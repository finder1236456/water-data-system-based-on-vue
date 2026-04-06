import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/screen-data', async (_req, res, next) => {
  try {
    const [
      [waterStats],
      [usageShareStats],
      [annualUsageStats],
      [monthlyUsageTrend],
      [monthlyComparison],
      [quotaRecords],
      [savingSuggestions],
      [dashboardAlarms],
      [repairChannels],
      [repairReports],
      [aiExamples],
      [aiPromptExamples],
      [configRows],
    ] = await Promise.all([
      pool.execute(
        `
          SELECT
            stat_label AS label,
            stat_value AS value,
            stat_unit AS unit,
            percent_value AS percent
          FROM dashboard_water_stats
          ORDER BY sort_order ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            category_name AS name,
            percent_value AS value,
            total_amount AS total,
            color
          FROM usage_share_stats
          ORDER BY sort_order ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            year_label AS year,
            usage_amount AS value
          FROM annual_usage_stats
          ORDER BY sort_order ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            month_label AS month,
            usage_amount AS value
          FROM monthly_usage_trend
          ORDER BY month_no ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            month_label AS month,
            last_year_value AS lastYear,
            current_value AS current
          FROM monthly_comparison
          ORDER BY month_no ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            regions.name AS area,
            CONCAT(TRIM(TRAILING '.00' FROM FORMAT(quota_records.current_usage, 2)), ' m³') AS current,
            CONCAT(TRIM(TRAILING '.00' FROM FORMAT(quota_records.quota_amount, 2)), ' m³') AS quota,
            quota_records.status_label AS status
          FROM quota_records
          INNER JOIN regions ON regions.id = quota_records.region_id
          ORDER BY quota_records.sort_order ASC, quota_records.id ASC
        `,
      ),
      pool.execute(
        `
          SELECT content
          FROM saving_suggestions
          ORDER BY sort_order ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            dashboard_alarms.alarm_type AS type,
            regions.name AS region,
            DATE_FORMAT(dashboard_alarms.alarm_time, '%Y-%m-%d') AS time,
            dashboard_alarms.content AS content,
            dashboard_alarms.reporter_name AS reporter,
            dashboard_alarms.status_label AS status,
            dashboard_alarms.repairer_name AS repairer
          FROM dashboard_alarms
          INNER JOIN regions ON regions.id = dashboard_alarms.region_id
          ORDER BY dashboard_alarms.alarm_time DESC
        `,
      ),
      pool.execute(
        `
          SELECT
            role_name AS role,
            description AS \`desc\`
          FROM repair_channels
          ORDER BY sort_order ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            repair_code AS id,
            title,
            location,
            status_label AS status,
            channel
          FROM repair_reports
          ORDER BY report_time DESC, id DESC
        `,
      ),
      pool.execute(
        `
          SELECT question, answer
          FROM ai_examples
          ORDER BY sort_order ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT prompt_text AS prompt
          FROM ai_prompt_examples
          ORDER BY sort_order ASC, id ASC
        `,
      ),
      pool.execute(
        `
          SELECT
            monthly_baseline,
            last_month_usage,
            last_month_saving
          FROM system_config
          ORDER BY id ASC
          LIMIT 1
        `,
      ),
    ])

    const usageShare = usageShareStats.map((item) => ({
      ...item,
      value: Number(item.value),
      total: Number(item.total),
    }))

    const progressList = usageShare.map((item) => ({
      name: item.name,
      value: Math.round((item.total * item.value) / 100),
      total: Math.round(item.total),
    }))

    const savingMetrics = configRows[0]
      ? {
          baseline: Number(configRows[0].monthly_baseline),
          lastUsage: Number(configRows[0].last_month_usage),
          saving: Number(configRows[0].last_month_saving),
          ratio:
            Number(configRows[0].monthly_baseline) > 0
              ? Number(
                  (
                    (Number(configRows[0].last_month_saving) /
                      Number(configRows[0].monthly_baseline)) *
                    100
                  ).toFixed(2),
                )
              : 0,
        }
      : {
          baseline: 0,
          lastUsage: 0,
          saving: 0,
          ratio: 0,
        }

    res.json({
      waterStats,
      usageShare,
      progressList,
      alarms: dashboardAlarms,
      historyCards: annualUsageStats.map((item) => ({
        year: item.year,
        value: Number(item.value),
      })),
      lineTrend: monthlyUsageTrend.map((item) => ({
        month: item.month,
        value: Number(item.value),
      })),
      barTrend: monthlyComparison.map((item) => ({
        month: item.month,
        lastYear: Number(item.lastYear),
        current: Number(item.current),
      })),
      quotaList: quotaRecords,
      savingSuggestions: savingSuggestions.map((item) => item.content),
      repairChannels,
      repairTickets: repairReports,
      aiSuggestions: aiExamples,
      aiPromptSuggestions: aiPromptExamples.map((item) => item.prompt),
      savingMetrics,
    })
  } catch (error) {
    next(error)
  }
})

export default router
