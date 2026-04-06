export type WaterStat = {
  label: string
  value: string
  unit: string
  percent: number
}

export type UsageItem = {
  name: string
  value: number
  color: string
  total: number
}

export type ProgressItem = {
  name: string
  value: number
  total: number
}

export type AlarmItem = {
  type: string
  region: string
  time: string
  content: string
  reporter: string
  status: string
  repairer: string
}

export type HistoryCard = {
  year: string
  value: number
}

export type MonthlyTrendItem = {
  month: string
  value: number
}

export type MonthlyComparisonItem = {
  month: string
  lastYear: number
  current: number
}

export type QuotaItem = {
  area: string
  current: string
  quota: string
  status: string
}

export type RepairChannel = {
  role: string
  desc: string
}

export type RepairItem = {
  id: string
  title: string
  location: string
  status: string
  channel: string
}

export type AiSuggestion = {
  question: string
  answer: string
}

export type SavingMetrics = {
  baseline: number
  lastUsage: number
  saving: number
  ratio: number
}

export type ScreenData = {
  waterStats: WaterStat[]
  usageShare: UsageItem[]
  progressList: ProgressItem[]
  alarms: AlarmItem[]
  historyCards: HistoryCard[]
  lineTrend: MonthlyTrendItem[]
  barTrend: MonthlyComparisonItem[]
  quotaList: QuotaItem[]
  savingSuggestions: string[]
  repairChannels: RepairChannel[]
  repairTickets: RepairItem[]
  aiSuggestions: AiSuggestion[]
  aiPromptSuggestions: string[]
  savingMetrics: SavingMetrics
}

export const moduleNav = [
  { key: 'analysis', label: '用水分析' },
  { key: 'quota', label: '定额管理' },
  { key: 'repair', label: '故障报修' },
  { key: 'ai', label: 'AI智能咨询' },
]

export const defaultScreenData: ScreenData = {
  waterStats: [
    { label: '今日水量', value: '130', unit: 'm³', percent: 13 },
    { label: '本月水量', value: '39', unit: '百万 m³', percent: 3 },
    { label: '本年水量', value: '46.8', unit: '千 m³', percent: 46 },
    { label: '上月水量', value: '40', unit: '百万 m³', percent: 4 },
  ],
  usageShare: [
    { name: '居民生活用水', value: 74.67, color: '#6488ff', total: 1500 },
    { name: '住户厨房用水', value: 68.2, color: '#88d56d', total: 1000 },
    { name: '公共保洁用水', value: 53.6, color: '#ffca4b', total: 900 },
    { name: '其他公共用水', value: 60.83, color: '#ff6868', total: 600 },
  ],
  progressList: [
    { name: '居民生活用水', value: 1120, total: 1500 },
    { name: '住户厨房用水', value: 682, total: 1000 },
    { name: '公共保洁用水', value: 512, total: 900 },
  ],
  alarms: [
    {
      type: '设备故障',
      region: '1栋1单元',
      time: '2026-04-01',
      content: '采集设备短时离线',
      reporter: '系统',
      status: '待处理',
      repairer: '王工',
    },
    {
      type: '流量超标',
      region: '2栋1单元',
      time: '2026-04-01',
      content: '瞬时流量超过阈值',
      reporter: '系统',
      status: '待处理',
      repairer: '赵工',
    },
    {
      type: '设备故障',
      region: '3栋1单元',
      time: '2026-04-02',
      content: '水表通信异常',
      reporter: '系统',
      status: '待处理',
      repairer: '李工',
    },
  ],
  historyCards: [
    { year: '2020年', value: 192 },
    { year: '2021年', value: 196 },
    { year: '2022年', value: 208 },
  ],
  lineTrend: [
    { month: '1月', value: 28 },
    { month: '2月', value: 22 },
    { month: '3月', value: 31 },
    { month: '4月', value: 44 },
    { month: '5月', value: 52 },
    { month: '6月', value: 29 },
    { month: '7月', value: 46 },
    { month: '8月', value: 33 },
    { month: '9月', value: 54 },
    { month: '10月', value: 71 },
    { month: '11月', value: 61 },
    { month: '12月', value: 58 },
  ],
  barTrend: [
    { month: '2月', lastYear: 38, current: 22 },
    { month: '3月', lastYear: 46, current: 32 },
    { month: '4月', lastYear: 58, current: 44 },
    { month: '5月', lastYear: 74, current: 52 },
    { month: '6月', lastYear: 50, current: 26 },
    { month: '7月', lastYear: 68, current: 46 },
    { month: '8月', lastYear: 70, current: 33 },
    { month: '9月', lastYear: 52, current: 55 },
    { month: '10月', lastYear: 79, current: 68 },
  ],
  quotaList: [
    { area: '1栋1单元', current: '1280 m³', quota: '1200 m³', status: '超额 6.7%' },
    { area: '1栋2单元', current: '1045 m³', quota: '1100 m³', status: '正常' },
    { area: '2栋1单元', current: '760 m³', quota: '800 m³', status: '正常' },
    { area: '2栋2单元', current: '845 m³', quota: '860 m³', status: '接近阈值' },
    { area: '3栋1单元', current: '980 m³', quota: '950 m³', status: '预警' },
    { area: '3栋2单元', current: '910 m³', quota: '930 m³', status: '正常' },
    { area: '5栋1单元', current: '1085 m³', quota: '1000 m³', status: '超额 8.5%' },
    { area: '6栋2单元', current: '690 m³', quota: '820 m³', status: '节水优秀' },
  ],
  savingSuggestions: [
    '建议优先排查 1栋1单元夜间基流偏高问题。',
    '3栋1单元可启用分时段供水策略，降低峰值波动。',
    '5栋1单元建议更换高耗水阀件，并推送节水提醒。',
    '6栋2单元可作为节水示范单元，建议在全小区推广节水经验。',
  ],
  repairChannels: [
    { role: '业主 Web 端', desc: '在线填写故障描述，上传现场图片，自动关联楼栋与单元。' },
    { role: '维修 UniApp 端', desc: '支持移动端拍照上报、快速定位和工单回传。' },
  ],
  repairTickets: [
    { id: 'BX-202604-01', title: '阀门漏水', location: '1栋2单元 601 室水表井旁', status: '待派单', channel: 'Web' },
    { id: 'BX-202604-02', title: '水压异常', location: '2栋1单元 1002 室入户管', status: '处理中', channel: 'UniApp' },
    { id: 'BX-202604-03', title: '流量计离线', location: '3栋1单元 地下水表井', status: '待复核', channel: 'Web' },
  ],
  aiSuggestions: [
    {
      question: '最近 1栋1单元夜间用水偏高怎么办？',
      answer: '建议先排查夜间基流、卫生间长流水点位，并对近 7 天分时数据做异常对比。',
    },
    {
      question: '设备离线后如何快速定位故障？',
      answer: '优先检查供电、网络链路和采集终端状态，再结合最近告警记录判断是否为批量故障。',
    },
  ],
  aiPromptSuggestions: [
    '3栋1单元夜间用水为什么偏高？',
    '如何快速排查设备离线？',
    '小区还有哪些更合适的节水措施？',
  ],
  savingMetrics: {
    baseline: 4000,
    lastUsage: 3900,
    saving: 100,
    ratio: 2.5,
  },
}
