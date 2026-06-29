interface ChatBody {
  model: 'DeepSeek Flash' | 'DeepSeek Pro';
  messages: Array<{ role: 'user' | 'ai'; text: string }>;
  deepThink: boolean;
  systemPrompt: string;
}

export const onRequestPost = async (context: { request: Request; env: { DEEPSEEK_API_KEY: string } }): Promise<Response> => {
  try {
    const { model, messages, deepThink, systemPrompt } = await context.request.json() as ChatBody;
    const apiKey = context.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Backend error: DEEPSEEK_API_KEY is not configured in Cloudflare Dashboard." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiModel = model === 'DeepSeek Pro' ? 'deepseek-v4-pro' : 'deepseek-v4-flash';

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          { role: 'system', content: systemPrompt || '' },
          ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.text })),
        ],
        stream: true,
        thinking: {
          type: deepThink ? 'enabled' : 'disabled'
        },
        ...(deepThink ? { reasoning_effort: 'high' } : {})
      }),
    });

    if (!response.ok) {
      return new Response(response.body, { status: response.status, headers: response.headers });
    }

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