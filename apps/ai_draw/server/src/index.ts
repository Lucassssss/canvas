import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/agent/chat', async (req, res) => {
  const { message } = req.body

  res.json({
    role: 'assistant',
    content: `收到消息: ${message || '你好！'}。AI Agent 功能正在开发中...`,
  })
})

app.listen(PORT, () => {
  console.log(`AI Draw API server running on http://localhost:${PORT}`)
})
