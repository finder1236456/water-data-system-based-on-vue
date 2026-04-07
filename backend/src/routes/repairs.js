import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repairsUploadDir = path.resolve(__dirname, '../../uploads/repairs')

const ensureUploadDir = async () => {
  await fs.mkdir(repairsUploadDir, { recursive: true })
}

const getActor = (req) => ({
  id: Number(req.headers['x-user-id'] || 0),
  role: String(req.headers['x-user-role'] || ''),
  name: String(req.headers['x-user-name'] || ''),
})

const saveBase64Image = async (base64, prefix) => {
  if (!base64 || typeof base64 !== 'string') {
    return null
  }

  const match = base64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  if (!match) {
    return null
  }

  const extensionMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }

  const mimeType = match[1]
  const ext = extensionMap[mimeType] || 'jpg'
  const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const absolutePath = path.join(repairsUploadDir, fileName)
  const fileBuffer = Buffer.from(match[2], 'base64')

  await ensureUploadDir()
  await fs.writeFile(absolutePath, fileBuffer)
  return `/uploads/repairs/${fileName}`
}

const insertRepairImages = async (repairId, images, imageType = 'report') => {
  if (!Array.isArray(images) || images.length === 0) {
    return []
  }

  const urls = []
  for (const item of images) {
    const url = await saveBase64Image(item, `repair-${repairId}`)
    if (url) {
      urls.push(url)
      await pool.execute(
        'INSERT INTO repair_images (repair_id, image_url, image_type) VALUES (?, ?, ?)',
        [repairId, url, imageType],
      )
    }
  }

  return urls
}

router.get('/regions', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `
        SELECT id, name
        FROM regions
        WHERE region_type = 'unit'
        ORDER BY id ASC
      `,
    )
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const actor = getActor(req)
    const status = String(req.query.status || '').trim()
    const mine = String(req.query.mine || '') === 'true'

    const conditions = []
    const params = []

    if (status) {
      conditions.push('repair_reports.status_label = ?')
      params.push(status)
    }

    if (mine && actor.id > 0) {
      conditions.push('(repair_reports.maintainer_user_id = ? OR repair_reports.reporter_user_id = ?)')
      params.push(actor.id, actor.id)
    } else if (actor.role === 'repair' && actor.id > 0) {
      conditions.push('(repair_reports.maintainer_user_id = ? OR repair_reports.maintainer_user_id IS NULL)')
      params.push(actor.id)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.execute(
      `
        SELECT
          repair_reports.id,
          repair_reports.repair_code,
          repair_reports.title,
          regions.name AS region_name,
          repair_reports.location,
          repair_reports.channel,
          repair_reports.status_label,
          repair_reports.description,
          repair_reports.report_time,
          repair_reports.complete_time,
          reporter.name AS reporter_name,
          maintainer.name AS maintainer_name
        FROM repair_reports
        INNER JOIN regions ON regions.id = repair_reports.region_id
        LEFT JOIN users AS reporter ON reporter.id = repair_reports.reporter_user_id
        LEFT JOIN users AS maintainer ON maintainer.id = repair_reports.maintainer_user_id
        ${whereClause}
        ORDER BY repair_reports.report_time DESC, repair_reports.id DESC
      `,
      params,
    )

    res.json(
      rows.map((item) => ({
        id: item.id,
        repairCode: item.repair_code,
        title: item.title,
        regionName: item.region_name,
        location: item.location,
        channel: item.channel,
        status: item.status_label,
        description: item.description,
        reportTime: item.report_time,
        completeTime: item.complete_time,
        reporterName: item.reporter_name,
        maintainerName: item.maintainer_name,
      })),
    )
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const [reportRows] = await pool.execute(
      `
        SELECT
          repair_reports.id,
          repair_reports.repair_code,
          repair_reports.title,
          repair_reports.region_id,
          regions.name AS region_name,
          repair_reports.location,
          repair_reports.channel,
          repair_reports.status_label,
          repair_reports.description,
          repair_reports.report_time,
          repair_reports.complete_time,
          reporter.name AS reporter_name,
          maintainer.name AS maintainer_name
        FROM repair_reports
        INNER JOIN regions ON regions.id = repair_reports.region_id
        LEFT JOIN users AS reporter ON reporter.id = repair_reports.reporter_user_id
        LEFT JOIN users AS maintainer ON maintainer.id = repair_reports.maintainer_user_id
        WHERE repair_reports.id = ?
        LIMIT 1
      `,
      [req.params.id],
    )

    const report = reportRows[0]
    if (!report) {
      return res.status(404).json({ message: '工单不存在。' })
    }

    const [imageRows] = await pool.execute(
      `
        SELECT id, image_url AS imageUrl, image_type AS imageType, created_at AS createdAt
        FROM repair_images
        WHERE repair_id = ?
        ORDER BY id ASC
      `,
      [req.params.id],
    )

    const [logRows] = await pool.execute(
      `
        SELECT
          repair_logs.id,
          repair_logs.action_type AS actionType,
          repair_logs.content,
          repair_logs.created_at AS createdAt,
          users.name AS operatorName
        FROM repair_logs
        LEFT JOIN users ON users.id = repair_logs.operator_user_id
        WHERE repair_logs.repair_id = ?
        ORDER BY repair_logs.id ASC
      `,
      [req.params.id],
    )

    res.json({
      id: report.id,
      repairCode: report.repair_code,
      title: report.title,
      regionId: report.region_id,
      regionName: report.region_name,
      location: report.location,
      channel: report.channel,
      status: report.status_label,
      description: report.description,
      reportTime: report.report_time,
      completeTime: report.complete_time,
      reporterName: report.reporter_name,
      maintainerName: report.maintainer_name,
      images: imageRows,
      logs: logRows,
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const actor = getActor(req)
    const { title, regionId, location, description, images = [], source = 'UniApp' } = req.body

    if (!title || !regionId || !location || !description) {
      return res.status(400).json({ message: '请完整填写报修标题、位置、区域和描述。' })
    }

    const repairCode = `BX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      Date.now(),
    ).slice(-5)}`

    const [result] = await pool.execute(
      `
        INSERT INTO repair_reports (
          repair_code,
          title,
          region_id,
          location,
          channel,
          status_label,
          description,
          reporter_user_id,
          maintainer_user_id,
          report_time
        ) VALUES (?, ?, ?, ?, ?, '待派单', ?, ?, NULL, NOW())
      `,
      [repairCode, title, regionId, location, source, description, actor.id || null],
    )

    await insertRepairImages(result.insertId, images, 'report')
    await pool.execute(
      'INSERT INTO repair_logs (repair_id, operator_user_id, action_type, content) VALUES (?, ?, ?, ?)',
      [result.insertId, actor.id || null, 'report', `${actor.name || '维修人员'}提交了新的报修工单。`],
    )

    res.status(201).json({
      id: result.insertId,
      repairCode,
      message: '报修工单已提交。',
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id/receive', async (req, res, next) => {
  try {
    const actor = getActor(req)
    if (actor.role !== 'repair') {
      return res.status(403).json({ message: '只有维修人员可以接单。' })
    }

    await pool.execute(
      `
        UPDATE repair_reports
        SET maintainer_user_id = ?, status_label = '处理中'
        WHERE id = ?
      `,
      [actor.id, req.params.id],
    )

    await pool.execute(
      'INSERT INTO repair_logs (repair_id, operator_user_id, action_type, content) VALUES (?, ?, ?, ?)',
      [req.params.id, actor.id, 'receive', `${actor.name || '维修人员'}已接单并开始处理。`],
    )

    res.json({ message: '接单成功。' })
  } catch (error) {
    next(error)
  }
})

router.put('/:id/complete', async (req, res, next) => {
  try {
    const actor = getActor(req)
    const { content = '', images = [] } = req.body

    if (actor.role !== 'repair') {
      return res.status(403).json({ message: '只有维修人员可以提交完工结果。' })
    }

    await pool.execute(
      `
        UPDATE repair_reports
        SET maintainer_user_id = ?, status_label = '已完成', complete_time = NOW()
        WHERE id = ?
      `,
      [actor.id, req.params.id],
    )

    await insertRepairImages(req.params.id, images, 'complete')
    await pool.execute(
      'INSERT INTO repair_logs (repair_id, operator_user_id, action_type, content) VALUES (?, ?, ?, ?)',
      [req.params.id, actor.id, 'complete', content || `${actor.name || '维修人员'}已完成维修处理。`],
    )

    res.json({ message: '工单已完成。' })
  } catch (error) {
    next(error)
  }
})

export default router
