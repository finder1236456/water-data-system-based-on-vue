import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const [rows] = await pool.execute(
      `
        SELECT
          users.id,
          users.username,
          users.password,
          users.name,
          users.phone,
          roles.code AS role
        FROM users
        INNER JOIN roles ON roles.id = users.role_id
        WHERE users.username = ?
        LIMIT 1
      `,
      [username],
    )

    const user = rows[0]
    if (!user || user.password !== password) {
      return res.status(401).json({ message: '账号或密码错误，请重新输入。' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ message: 'JWT 配置缺失，请检查后端环境变量。' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        type: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
