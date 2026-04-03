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

export type QuotaItem = {
  area: string
  current: string
  quota: string
  status: string
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

export const waterStats: WaterStat[] = [
  { label: '今日水量', value: '130', unit: 'm³', percent: 13 },
  { label: '本月水量', value: '39', unit: '百万 m³', percent: 3 },
  { label: '本年水量', value: '46.8', unit: '千 m³', percent: 46 },
  { label: '上月水量', value: '40', unit: '百万 m³', percent: 4 },
]

export const usageShare: UsageItem[] = [
  { name: '生活用水', value: 74.67, color: '#6488ff', total: 1500 },
  { name: '住户用水', value: 68.2, color: '#88d56d', total: 1000 },
  { name: '保安用水', value: 53.6, color: '#ffca4b', total: 900 },
  { name: '其他用水', value: 60.83, color: '#ff6868', total: 600 },
]

export const progressList = [
  { name: '生活用水', value: 1120, total: 1500 },
  { name: '住户用水', value: 682, total: 1000 },
  { name: '保安用水', value: 512, total: 900 },
]

export const alarms = [
  { type: '设备故障', region: '一栋 1', time: '2026-04-01', content: '设备离线', reporter: '系统', status: '待处理', repairer: '王工' },
  { type: '流量超标', region: '二栋 1', time: '2026-04-01', content: '流量超过阈值', reporter: '系统', status: '待处理', repairer: '赵工' },
  { type: '设备故障', region: '三栋 1', time: '2026-04-02', content: '设备离线', reporter: '系统', status: '待处理', repairer: '李工' },
  { type: '压力异常', region: '实验楼', time: '2026-04-02', content: '压力波动异常', reporter: '管理员', status: '处理中', repairer: '陈工' },
]

export const historyCards = [
  { year: '2020年', value: 192 },
  { year: '2021年', value: 196 },
  { year: '2022年', value: 208 },
]

export const moduleNav = [
  { key: 'analysis', label: '用水分析' },
  { key: 'quota', label: '定额管理' },
  { key: 'repair', label: '故障报修' },
  { key: 'ai', label: 'AI智能咨询' },
]

export const quotaList: QuotaItem[] = [
  { area: '一栋片区', current: '1280 m³', quota: '1200 m³', status: '超额 6.7%' },
  { area: '二栋片区', current: '760 m³', quota: '800 m³', status: '正常' },
  { area: '三栋片区', current: '980 m³', quota: '950 m³', status: '预警' },
]

export const savingSuggestions = [
  '建议优先排查一栋片区夜间基流偏高问题。',
  '三栋片区可启用分时段供水策略，降低峰值波动。',
  '一栋片区建议更换高耗水阀件，并推送节水提醒。',
]

export const repairChannels = [
  { role: '用户 Web 端', desc: '在线填写故障描述，上传现场图片，自动关联区域。' },
  { role: '维修 UniApp 端', desc: '支持移动端拍照上报、快速定位和工单回传。' },
]

export const repairTickets: RepairItem[] = [
  { id: 'BX-202604-01', title: '阀门漏水', location: '教学楼 A 区', status: '待派单', channel: 'Web' },
  { id: 'BX-202604-02', title: '水压异常', location: '实验楼 2F', status: '处理中', channel: 'UniApp' },
  { id: 'BX-202604-03', title: '流量计离线', location: '宿舍北区', status: '待复核', channel: 'Web' },
]

export const aiSuggestions: AiSuggestion[] = [
  {
    question: '最近一栋夜间用水偏高怎么办？',
    answer: '建议先排查夜间基流、卫生间长流水点位，并对近 7 天分时数据做异常对比。',
  },
  {
    question: '设备离线后如何快速定位故障？',
    answer: '优先检查供电、网络链路和采集终端状态，再结合最近告警记录判断是否为批量故障。',
  },
]
