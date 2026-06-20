import type { ChatMessage } from '../types/config';

/**
 * DeepSeek V4 Flash 流式请求
 * 通过 Vite 代理避免 CORS
 */
export async function streamDeepSeek(
  messages: ChatMessage[],
  deepThink: boolean,
  onToken: (token: string) => void,
  onComplete: () => void,
  onError: (err: Error) => void,
): Promise<void> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    // 没有 API Key 时使用本地 mock 流式
    mockStream(onToken, onComplete);
    return;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: deepThink ? 'deepseek-reasoner' : 'deepseek-chat',
        messages: messages.map(m => ({ role: m.role, content: m.text })),
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          onComplete();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onToken(content);
          }
        } catch {
          // 跳过非 JSON 行
        }
      }
    }
    onComplete();
  } catch (err) {
    onError(err instanceof Error ? err : new Error('Unknown error'));
  }
}

/** 本地 Mock 流式输出 */
function mockStream(onToken: (token: string) => void, onComplete: () => void) {
  const mockText = '（Demo 模式）我是ClaySeek！DeepSeek API Key 未配置。请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY 以启用真实 AI 对话。';
  let i = 0;
  const interval = setInterval(() => {
    if (i < mockText.length) {
      onToken(mockText[i]);
      i++;
    } else {
      clearInterval(interval);
      onComplete();
    }
  }, 50);
}