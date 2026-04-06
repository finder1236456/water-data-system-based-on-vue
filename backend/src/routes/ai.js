import { Router } from 'express'

const router = Router()

router.post('/chat', async (req, res, next) => {
  try {
    const apiUrl =
      process.env.AI_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    const apiKey = process.env.AI_API_KEY
    const model = process.env.AI_MODEL || 'glm-5'
    const { message, history = [] } = req.body

    if (!apiKey) {
      return res.status(400).json({
        message: 'AI 服务配置不完整，请检查后端环境变量。',
      })
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        message: '请输入要咨询的问题。',
      })
    }

    const messages = [
      {
        role: 'system',
        content:
          '你是一名水务智能助手，负责回答用水建议、定额管理、故障排查和节水优化相关问题。回答要清晰、专业、可执行。',
      },
      ...history,
      {
        role: 'user',
        content: message,
      },
    ]

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || data?.message || 'AI 服务调用失败，请稍后重试。',
      })
    }

    const content = data?.choices?.[0]?.message?.content || '暂未获取到有效回复。'
    res.json({ content })
  } catch (error) {
    next(error)
  }
})

export default router
