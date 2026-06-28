import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'chat-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
            if (req.method !== 'POST' || url.pathname !== '/api/chat') return next()

            try {
              const chunks = []
              for await (const chunk of req) chunks.push(chunk)
              const body = JSON.parse(Buffer.concat(chunks).toString())
              const { model, messages, deepThink } = body

              const apiKey = env.DEEPSEEK_API_KEY
              if (!apiKey) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'DEEPSEEK_API_KEY not configured' }))
                return
              }

              const apiModel = model === 'DeepSeek Pro' ? 'deepseek-v4-pro' : 'deepseek-v4-flash'

              const cleanMessages = (messages || []).map(m => ({
                role: m.role === 'ai' ? 'assistant' : m.role,
                content: m.text || m.content,
              }))

              const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  model: apiModel,
                  messages: cleanMessages,
                  stream: true,
                  thinking: { type: deepThink ? 'enabled' : 'disabled' },
                  ...(deepThink ? { reasoning_effort: 'high' } : {}),
                }),
              })

              if (!response.ok) {
                const errText = await response.text()
                res.writeHead(response.status, { 'Content-Type': 'application/json' })
                res.end(errText)
                return
              }

              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
              })

              const reader = response.body.getReader()
              const decoder = new TextDecoder()
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                res.write(decoder.decode(value, { stream: true }))
              }
              res.end()
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }))
            }
          })
        },
      },
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  }
})
