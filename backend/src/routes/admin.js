import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/users', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, name, role, password FROM users ORDER BY id DESC',
    )
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

router.post('/users', async (req, res, next) => {
  try {
    const { username, name, role, password } = req.body
    const [result] = await pool.execute(
      'INSERT INTO users (username, name, role, password) VALUES (?, ?, ?, ?)',
      [username, name, role, password],
    )

    res.status(201).json({
      id: result.insertId,
      username,
      name,
      role,
      password,
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/users/:username', async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM users WHERE username = ?', [req.params.username])
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

router.get('/config', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT water_price, base_quota, warning_threshold, push_strategy FROM system_config ORDER BY id ASC LIMIT 1',
    )
    res.json(rows[0] ?? null)
  } catch (error) {
    next(error)
  }
})

router.put('/config', async (req, res, next) => {
  try {
    const { waterPrice, baseQuota, warningThreshold, pushStrategy } = req.body
    await pool.execute(
      `
        UPDATE system_config
        SET water_price = ?, base_quota = ?, warning_threshold = ?, push_strategy = ?
        WHERE id = (SELECT id FROM (SELECT id FROM system_config ORDER BY id ASC LIMIT 1) AS t)
      `,
      [waterPrice, baseQuota, warningThreshold, pushStrategy],
    )

    res.json({
      waterPrice,
      baseQuota,
      warningThreshold,
      pushStrategy,
    })
  } catch (error) {
    next(error)
  }
})

export default router
