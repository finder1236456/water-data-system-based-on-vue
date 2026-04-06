<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { chatWithAi } from '@/api'
import ScreenPanel from './ScreenPanel.vue'
import type { AiSuggestion } from '../data'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const props = defineProps<{
  initialSuggestions: AiSuggestion[]
  promptSuggestions: string[]
}>()

const loading = ref(false)
const prompt = ref('')
const messages = ref<ChatMessage[]>([])

watch(
  () => props.initialSuggestions,
  (value) => {
    messages.value = value.flatMap((item) => [
      { role: 'user' as const, content: item.question },
      { role: 'assistant' as const, content: item.answer },
    ])
  },
  { immediate: true },
)

const askCount = computed(() => messages.value.filter((item) => item.role === 'user').length)
const assistantCount = computed(() => messages.value.filter((item) => item.role === 'assistant').length)

const latestTopic = computed(() => {
  const latestUserQuestion = [...messages.value].reverse().find((item) => item.role === 'user')
  return latestUserQuestion?.content || '节水建议'
})

const fillPrompt = (text: string) => {
  prompt.value = text
}

const handleSend = async () => {
  const content = prompt.value.trim()
  if (!content || loading.value) {
    return
  }

  messages.value.push({ role: 'user', content })
  prompt.value = ''
  loading.value = true

  try {
    const history = messages.value
      .slice(0, -1)
      .map((item) => ({ role: item.role, content: item.content }))

    const response = await chatWithAi({
      message: content,
      history,
    })

    messages.value.push({
      role: 'assistant',
      content: response.content,
    })
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'AI 服务调用失败')
    messages.value.push({
      role: 'assistant',
      content: '当前 AI 服务暂时不可用，请稍后再试。',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="wide-column">
    <ScreenPanel title="AI智能咨询" unit="智能问答">
      <div class="ai-layout">
        <div class="ai-summary">
          <div class="summary-card">
            <span>今日咨询量</span>
            <strong>{{ askCount }} 次</strong>
          </div>
          <div class="summary-card">
            <span>热点主题</span>
            <strong>{{ latestTopic }}</strong>
          </div>
          <div class="summary-card">
            <span>累计回复数</span>
            <strong>{{ assistantCount }} 条</strong>
          </div>
        </div>

        <div class="ai-chat">
          <div
            v-for="(item, index) in messages"
            :key="`${item.role}-${index}`"
            class="chat-card"
            :class="{ 'chat-card--assistant': item.role === 'assistant' }"
          >
            <div class="chat-card__question">{{ item.role === 'user' ? 'Q' : 'A' }}</div>
            <div class="chat-card__answer">{{ item.content }}</div>
          </div>
        </div>

        <div class="ai-input-card">
          <div class="ai-input-card__header">
            <strong>发起智能问答</strong>
            <span>可咨询用水偏高原因、设备故障排查、节水建议等问题</span>
          </div>

          <div class="prompt-list">
            <button
              v-for="item in promptSuggestions"
              :key="item"
              type="button"
              class="prompt-chip"
              @click="fillPrompt(item)"
            >
              {{ item }}
            </button>
          </div>

          <div class="ai-input-box">
            <el-input
              v-model="prompt"
              type="textarea"
              :rows="7"
              placeholder="请输入水务问题，例如：某栋某单元夜间用水偏高、节水建议、设备故障排查等"
            />
            <el-button type="primary" :loading="loading" @click="handleSend">发送咨询</el-button>
          </div>
        </div>
      </div>
    </ScreenPanel>
  </section>
</template>

<style lang="scss" scoped>
.wide-column {
  display: grid;
  grid-column: 1 / -1;
  gap: $screen-gap;
  min-height: 0;
  max-width: 1480px;
  width: 100%;
  margin: 0 auto;
}

.ai-layout {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
  padding: 22px;
}

.ai-summary {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.summary-card,
.chat-card,
.ai-input-card {
  @include panel-surface;
  @include panel-overlay;
  border-color: rgba(115, 182, 255, 0.14);
  background: rgba(9, 22, 42, 0.72);
}

.summary-card {
  padding: 20px 22px;

  span {
    display: block;
    margin-bottom: 10px;
    color: $color-text-secondary;
    font-size: 14px;
  }

  strong {
    color: #fff;
    font-size: clamp(20px, 2vw, 30px);
    font-weight: 700;
  }
}

.ai-chat {
  display: grid;
  grid-column: span 7;
  gap: 16px;
  align-content: start;
}

.chat-card {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 16px;
  padding: 22px;

  &--assistant .chat-card__question {
    background: rgba(79, 194, 149, 0.18);
    color: #91f0c7;
  }

  &__question {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(71, 156, 255, 0.18);
    color: #9fd8ff;
    font-size: 18px;
    font-weight: 700;
  }

  &__answer {
    color: $color-text-secondary;
    line-height: 1.8;
    font-size: 16px;
    word-break: break-word;
  }
}

.ai-input-card {
  grid-column: span 5;
  padding: 22px;

  &__header {
    margin-bottom: 18px;

    strong {
      display: block;
      margin-bottom: 8px;
      color: #fff;
      font-size: 24px;
    }

    span {
      color: $color-text-secondary;
      font-size: 15px;
      line-height: 1.7;
    }
  }
}

.prompt-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.prompt-chip {
  padding: 10px 14px;
  border: 1px solid rgba(115, 182, 255, 0.16);
  border-radius: 999px;
  background: rgba(10, 28, 54, 0.86);
  color: #d5efff;
  cursor: pointer;
}

.ai-input-box {
  display: grid;
  gap: 14px;
}

:deep(.ai-input-box .el-textarea__inner) {
  background: rgba(6, 18, 36, 0.82);
  box-shadow: inset 0 0 0 1px rgba(120, 190, 255, 0.14);
}

@media (max-width: 1600px) {
  .wide-column {
    grid-column: auto;
  }

  .ai-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ai-summary {
    grid-column: 1 / -1;
  }

  .ai-chat,
  .ai-input-card {
    grid-column: auto;
  }
}

@media (max-width: 980px) {
  .ai-layout,
  .ai-summary {
    grid-template-columns: 1fr;
  }
}
</style>
