import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const [rows] = await pool.execute(
      'SELECT id, username, password, name, role FROM users WHERE username = ? LIMIT 1',
      [username],
    )

    const user = rows[0]
    if (!user || user.password !== password) {
      return res.status(401).json({ message: '账号或密码错误，请重新输入。' })
    }

    res.json({
      token: `mysql-token-${user.role}`,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        type: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
