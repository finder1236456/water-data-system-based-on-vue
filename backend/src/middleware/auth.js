import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token) {
    return res.status(401).json({ message: '未登录或登录已过期，请重新登录。' })
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ message: 'JWT 配置缺失，请检查后端环境变量。' })
    }

    const payload = jwt.verify(token, secret)
    req.user = {
      id: Number(payload.id),
      username: String(payload.username),
      role: String(payload.role),
      name: String(payload.name || ''),
    }

    next()
  } catch {
    return res.status(401).json({ message: '登录凭证无效或已过期，请重新登录。' })
  }
}
