import type { EChartsOption } from 'echarts'
import type { UsageItem } from './data'

export const createLineOption = (): EChartsOption => ({
  grid: { left: 32, right: 20, top: 36, bottom: 28 },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: { lineStyle: { color: 'rgba(164, 202, 255, 0.45)' } },
    axisLabel: { color: '#b8d7ff' },
  },
  yAxis: {
    type: 'value',
    name: '单位: 万吨',
    nameTextStyle: { color: '#7fa8d9', padding: [0, 0, 0, -8] },
    splitLine: { lineStyle: { color: 'rgba(130, 180, 255, 0.16)' } },
    axisLabel: { color: '#9fc3f3' },
  },
  series: [
    {
      data: [28, 22, 31, 44, 52, 29, 46, 33, 54, 71, 61, 58],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#78b9ff', width: 3 },
      itemStyle: { color: '#ffffff', borderColor: '#6bb7ff', borderWidth: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(86, 173, 255, 0.38)' },
            { offset: 1, color: 'rgba(86, 173, 255, 0.02)' },
          ],
        },
      },
    },
  ],
})

export const createBarOption = (): EChartsOption => ({
  grid: { left: 36, right: 20, top: 38, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: {
    right: 12,
    top: 6,
    textStyle: { color: '#98c5ff' },
    itemWidth: 14,
    itemHeight: 10,
  },
  xAxis: {
    type: 'category',
    data: ['2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'],
    axisLabel: { color: '#b5d6ff' },
    axisLine: { lineStyle: { color: 'rgba(160, 210, 255, 0.35)' } },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(130, 180, 255, 0.16)' } },
    axisLabel: { color: '#9fc3f3' },
  },
  series: [
    {
      name: '去年同期',
      type: 'bar',
      barWidth: 14,
      data: [38, 46, 58, 74, 50, 68, 70, 52, 79],
      itemStyle: {
        color: '#f2f5fb',
        borderRadius: [6, 6, 0, 0],
      },
    },
    {
      name: '本期',
      type: 'bar',
      barWidth: 14,
      data: [22, 32, 44, 52, 26, 46, 33, 55, 68],
      itemStyle: {
        color: '#7bd23c',
        borderRadius: [6, 6, 0, 0],
      },
    },
  ],
})

export const createSavingOption = (): EChartsOption => ({
  tooltip: { formatter: '{c}%' },
  series: [
    {
      type: 'gauge',
      center: ['50%', '55%'],
      radius: '92%',
      startAngle: 225,
      endAngle: -45,
      progress: {
        show: true,
        width: 16,
        itemStyle: { color: '#3cbcff' },
      },
      axisLine: {
        lineStyle: {
          width: 16,
          color: [[1, 'rgba(80, 150, 255, 0.18)']],
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: {
        show: true,
        icon: 'circle',
        length: '12%',
        width: 20,
        offsetCenter: [0, '-8%'],
        itemStyle: { color: 'rgba(255,255,255,0.3)' },
      },
      anchor: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '8%'],
        color: '#ffffff',
        fontSize: 22,
        formatter: '{value}%',
      },
      data: [{ value: 2 }],
    },
  ],
})

export const createDonutOption = (item: UsageItem): EChartsOption => ({
  title: {
    text: `${item.value}%`,
    left: 'center',
    top: '37%',
    textStyle: {
      color: item.color,
      fontSize: 22,
      fontWeight: 600,
    },
  },
  series: [
    {
      type: 'pie',
      radius: ['72%', '90%'],
      center: ['50%', '50%'],
      startAngle: 90,
      label: { show: false },
      data: [
        { value: item.value, itemStyle: { color: item.color } },
        { value: 100 - item.value, itemStyle: { color: 'rgba(255,255,255,0.2)' } },
      ],
    },
  ],
})
