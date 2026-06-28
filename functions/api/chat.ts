interface ChatBody {
  model: 'DeepSeek Flash' | 'DeepSeek Pro';
  messages: Array<{ role: 'user' | 'ai'; text: string }>;
  deepThink: boolean;
}

export const onRequestPost = async (context: { request: Request; env: { DEEPSEEK_API_KEY: string } }): Promise<Response> => {
  try {
    const { model, messages, deepThink } = await context.request.json() as ChatBody;
    const apiKey = context.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Backend error: DEEPSEEK_API_KEY is not configured in Cloudflare Dashboard." }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 精准映射为 DeepSeek-V4 官方标准旗舰模型 ID
    const apiModel = model === 'DeepSeek Pro' ? 'deepseek-v4-pro' : 'deepseek-v4-flash';

    // 发起向 DeepSeek 官方的高速请求
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
        // 过滤掉历史思维链，只发送干净的角色与正文，杜绝 400 坏请求报错
        messages: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.text })),
        stream: true,
        // V4 全新思维链开关与深度控制参数
        thinking: {
          type: deepThink ? 'enabled' : 'disabled'
        },
        ...(deepThink ? { reasoning_effort: 'high' } : {})
      }),
    });

    if (!response.ok) {
      return new Response(response.body, { status: response.status, headers: response.headers });
    }

    // 直接将 response.body 流回传给浏览器，绝不占用 Functions 的 CPU 运行时间与内存
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown internal error' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
};
