import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({
    message: error?.code === 'ER_DUP_ENTRY' ? '账号已存在，请更换后重试。' : '服务器内部错误，请稍后重试。',
  })
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`)
})
