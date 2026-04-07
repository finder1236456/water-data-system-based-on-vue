import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import adminRouter from './routes/admin.js'
import aiRouter from './routes/ai.js'
import authRouter from './routes/auth.js'
import dashboardRouter from './routes/dashboard.js'
import repairsRouter from './routes/repairs.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.resolve(__dirname, '../uploads')

app.use(cors())
app.use(express.json({ limit: '12mb' }))
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/ai', aiRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/repairs', repairsRouter)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({
    message:
      error?.code === 'ER_DUP_ENTRY'
        ? '账号已存在，请更换后重试。'
        : '服务器内部错误，请稍后重试。',
  })
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`)
})
