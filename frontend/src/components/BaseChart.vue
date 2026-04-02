<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, GaugeChart, LineChart, PieChart } from 'echarts/charts'
import {
  CanvasRenderer,
} from 'echarts/renderers'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import type { EChartsOption } from 'echarts'

echarts.use([
  BarChart,
  CanvasRenderer,
  GaugeChart,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  TooltipComponent,
])

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    autoresize?: boolean
  }>(),
  {
    autoresize: true,
  },
)

const chartRef = shallowRef<HTMLDivElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const style = computed(() => ({
  width: '100%',
  height: '100%',
}))

const resizeChart = () => {
  chartInstance.value?.resize()
}

const initChart = () => {
  if (!chartRef.value) {
    return
  }

  chartInstance.value = echarts.init(chartRef.value)
  chartInstance.value.setOption(props.option)
}

watch(
  () => props.option,
  (option) => {
    if (!chartInstance.value) {
      initChart()
      return
    }

    chartInstance.value.setOption(option, true)
  },
  { deep: true },
)

onMounted(() => {
  initChart()
  if (props.autoresize) {
    window.addEventListener('resize', resizeChart)
  }
})

onBeforeUnmount(() => {
  if (props.autoresize) {
    window.removeEventListener('resize', resizeChart)
  }
  chartInstance.value?.dispose()
})
</script>

<template>
  <div ref="chartRef" :style="style" />
</template>
