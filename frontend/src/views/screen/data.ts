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

export const waterStats: WaterStat[] = [
  { label: '今日水量', value: '130', unit: 'm³', percent: 13 },
  { label: '本月水量', value: '39', unit: '百万m³', percent: 3 },
  { label: '本年水量', value: '46.8', unit: '千m³', percent: 46 },
  { label: '上月水量', value: '40', unit: '百万m³', percent: 4 },
]

export const usageShare: UsageItem[] = [
  { name: '生活用水', value: 74.67, color: '#6488ff', total: 1500 },
  { name: '教学用水', value: 68.2, color: '#88d56d', total: 1000 },
  { name: '商业用水', value: 53.6, color: '#ffca4b', total: 900 },
  { name: '其他用水', value: 60.83, color: '#ff6868', total: 600 },
]

export const progressList = [
  { name: '生活用水', value: 1120, total: 1500 },
  { name: '教学用水', value: 682, total: 1000 },
  { name: '商业用水', value: 512, total: 900 },
]

export const alarms = [
  { type: '设备故障', region: '一教1', time: '1/8/25', content: '设备离线', reporter: '系统', status: '待处理', repairer: '王工' },
  { type: '流量超标', region: '一教2', time: '1/8/25', content: '流量超预定值', reporter: '系统', status: '待处理', repairer: '赵工' },
  { type: '设备故障', region: '一教3', time: '1/8/25', content: '设备离线', reporter: '系统', status: '待处理', repairer: '李工' },
  { type: '压力异常', region: '实验楼', time: '1/9/25', content: '压力波动异常', reporter: '管理员', status: '处理中', repairer: '陈工' },
]

export const historyCards = [
  { year: '2020年', value: 192 },
  { year: '2021年', value: 196 },
  { year: '2022年', value: 208 },
]
