import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/users', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `
        SELECT
          users.id,
          users.username,
          users.name,
          roles.code AS role,
          users.password
        FROM users
        INNER JOIN roles ON roles.id = users.role_id
        ORDER BY users.id DESC
      `,
    )
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

router.post('/users', async (req, res, next) => {
  try {
    const { username, name, role, password } = req.body
    const [roleRows] = await pool.execute('SELECT id FROM roles WHERE code = ? LIMIT 1', [role])
    const roleRow = roleRows[0]

    if (!roleRow) {
      return res.status(400).json({ message: '角色不存在，请检查后重试。' })
    }

    const [result] = await pool.execute(
      `
        INSERT INTO users (username, name, role_id, password, status)
        VALUES (?, ?, ?, ?, 1)
      `,
      [username, name, roleRow.id, password],
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
      `
        SELECT
          water_price,
          base_quota,
          warning_threshold,
          push_strategy,
          monthly_baseline,
          last_month_usage,
          last_month_saving
        FROM system_config
        ORDER BY id ASC
        LIMIT 1
      `,
    )
    res.json(rows[0] ?? null)
  } catch (error) {
    next(error)
  }
})

router.put('/config', async (req, res, next) => {
  try {
    const {
      waterPrice,
      baseQuota,
      warningThreshold,
      pushStrategy,
      monthlyBaseline,
      lastMonthUsage,
      lastMonthSaving,
    } = req.body

    await pool.execute(
      `
        UPDATE system_config
        SET
          water_price = ?,
          base_quota = ?,
          warning_threshold = ?,
          push_strategy = ?,
          monthly_baseline = COALESCE(?, monthly_baseline),
          last_month_usage = COALESCE(?, last_month_usage),
          last_month_saving = COALESCE(?, last_month_saving)
        WHERE id = (SELECT id FROM (SELECT id FROM system_config ORDER BY id ASC LIMIT 1) AS t)
      `,
      [
        waterPrice,
        baseQuota,
        warningThreshold,
        pushStrategy,
        monthlyBaseline ?? null,
        lastMonthUsage ?? null,
        lastMonthSaving ?? null,
      ],
    )

    res.json({
      waterPrice,
      baseQuota,
      warningThreshold,
      pushStrategy,
      monthlyBaseline,
      lastMonthUsage,
      lastMonthSaving,
    })
  } catch (error) {
    next(error)
  }
})

export default router
