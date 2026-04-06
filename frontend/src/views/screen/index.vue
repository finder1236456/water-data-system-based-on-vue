<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getScreenData } from '@/api'
import { useUserStore } from '@/stores/user'
import ScreenHeader from './components/ScreenHeader.vue'
import AnalysisModule from './components/AnalysisModule.vue'
import QuotaModule from './components/QuotaModule.vue'
import RepairModule from './components/RepairModule.vue'
import AiModule from './components/AiModule.vue'
import { defaultScreenData, moduleNav, type ScreenData } from './data'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const now = ref(new Date())
const activeModule = ref('analysis')
const screenData = ref<ScreenData>(defaultScreenData)
let timer: number | undefined

const isAnalysisModule = computed(() => activeModule.value === 'analysis')

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    user: '用户端大屏',
    repair: '维修端大屏',
  }

  return map[String(route.params.role)] ?? '业务大屏'
})

const timeText = computed(() =>
  now.value.toLocaleTimeString('zh-CN', {
    hour12: false,
  }),
)

const dateText = computed(() =>
  now.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }),
)

const weekdayText = computed(() =>
  now.value.toLocaleDateString('zh-CN', {
    weekday: 'long',
  }),
)

const handleLogout = async () => {
  userStore.clearUserInfo()
  await router.push('/login')
}

const loadScreenData = async () => {
  try {
    screenData.value = await getScreenData()
  } catch (error) {
    ElMessage.warning(error instanceof Error ? error.message : '大屏数据加载失败，已切换为本地示例数据。')
    screenData.value = defaultScreenData
  }
}

watch(
  () => route.query.module,
  (value) => {
    if (typeof value === 'string' && moduleNav.some((item) => item.key === value)) {
      activeModule.value = value
      return
    }

    activeModule.value = 'analysis'
  },
  { immediate: true },
)

onMounted(async () => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)

  await loadScreenData()
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
})
</script>

<template>
  <div class="screen-page">
    <div class="screen-page__bg"></div>

    <div class="screen-page__content">
      <ScreenHeader
        :time-text="timeText"
        :date-text="dateText"
        :weekday-text="weekdayText"
        :role-label="roleLabel"
        :nav-items="moduleNav"
        :active-key="activeModule"
        @navigate="activeModule = $event"
        @logout="handleLogout"
      />

      <main class="screen-page__main" :class="{ 'screen-page__main--stacked': !isAnalysisModule }">
        <AnalysisModule
          v-if="activeModule === 'analysis'"
          :water-stats="screenData.waterStats"
          :usage-share="screenData.usageShare"
          :progress-list="screenData.progressList"
          :history-cards="screenData.historyCards"
          :line-trend="screenData.lineTrend"
          :bar-trend="screenData.barTrend"
          :saving-metrics="screenData.savingMetrics"
        />
        <QuotaModule
          v-else-if="activeModule === 'quota'"
          :quota-list="screenData.quotaList"
          :saving-suggestions="screenData.savingSuggestions"
        />
        <RepairModule
          v-else-if="activeModule === 'repair'"
          :repair-channels="screenData.repairChannels"
          :repair-tickets="screenData.repairTickets"
        />
        <AiModule
          v-else
          :initial-suggestions="screenData.aiSuggestions"
          :prompt-suggestions="screenData.aiPromptSuggestions"
        />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.screen-page {
  position: relative;
  min-height: 100%;
  overflow-x: hidden;
  color: $color-text-primary;
  background:
    radial-gradient(circle at 50% 82%, rgba(62, 224, 255, 0.35), transparent 18%),
    radial-gradient(circle at 50% 100%, rgba(53, 125, 255, 0.28), transparent 32%),
    radial-gradient(circle at 50% 30%, rgba(19, 72, 148, 0.15), transparent 40%),
    linear-gradient(180deg, $color-page-bg-top 0%, $color-page-bg-mid 48%, $color-page-bg-bottom 100%);

  &__bg {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 15% 22%, rgba(93, 207, 255, 0.8) 0 2px, transparent 3px),
      radial-gradient(circle at 62% 16%, rgba(93, 207, 255, 0.6) 0 1px, transparent 2px),
      radial-gradient(circle at 83% 34%, rgba(255, 255, 255, 0.55) 0 1px, transparent 3px),
      radial-gradient(circle at 34% 66%, rgba(93, 207, 255, 0.55) 0 2px, transparent 3px),
      radial-gradient(circle at 53% 42%, rgba(93, 207, 255, 0.75) 0 2px, transparent 4px),
      radial-gradient(circle at 75% 72%, rgba(93, 207, 255, 0.45) 0 1px, transparent 3px);
    opacity: 0.95;
    pointer-events: none;
  }

  &__content {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  &__main {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(0, 360px) minmax(0, 1fr) minmax(0, 360px);
    align-items: stretch;
    gap: $screen-gap;
    padding: 12px 18px 18px;
    min-height: 0;
  }

  &__main--stacked {
    grid-template-columns: minmax(0, 1fr);
    align-content: start;
    gap: 18px;
    padding-inline: clamp(16px, 2.5vw, 24px);
    padding-bottom: 24px;
    overflow-y: auto;
  }
}

@media (max-width: 1440px) {
  .screen-page__main {
    grid-template-columns: minmax(0, 1fr);
    padding-inline: 16px;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  .screen-page__content {
    min-height: 100svh;
  }

  .screen-page__main,
  .screen-page__main--stacked {
    padding-inline: 12px;
    padding-bottom: 16px;
  }
}
</style>
