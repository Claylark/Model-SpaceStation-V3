import type { ChatMessage, AIModel } from '../types/config';

export async function streamDeepSeek(
  model: AIModel,
  messages: ChatMessage[],
  deepThink: boolean,
  onToken: (token: string, type: 'content' | 'reasoning') => void,
  onComplete: () => void,
  onError: (err: Error) => void,
): Promise<void> {
  try {
    // 🎯 核心改变：请求你本地域名下的 Cloudflare Functions 代理路由
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, deepThink }),
    });

    if (!response.ok) {
      throw new Error(`Functions Proxy Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No stream response body received from Cloudflare Functions.');
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

          // 前端照常捕获 V4 推理流 Token
          const reasoningContent = parsed.choices?.[0]?.delta?.reasoning_content;
          if (reasoningContent) {
            onToken(reasoningContent, 'reasoning');
          }

          // 前端照常捕获正文回复流 Token
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onToken(content, 'content');
          }
        } catch {
          // 容错处理
        }
      }
    }
    onComplete();
  } catch (err) {
    onError(err instanceof Error ? err : new Error('Unknown error'));
  }
}
