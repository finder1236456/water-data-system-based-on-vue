<script setup lang="ts">
import ScreenPanel from './ScreenPanel.vue'
import { aiSuggestions } from '../data'
</script>

<template>
  <section class="wide-column">
    <ScreenPanel title="AI智能咨询" unit="智能问答">
      <div class="ai-layout">
        <div class="ai-summary">
          <div class="summary-card">
            <span>今日咨询量</span>
            <strong>86 次</strong>
          </div>
          <div class="summary-card">
            <span>热点主题</span>
            <strong>节水建议</strong>
          </div>
          <div class="summary-card">
            <span>平均响应时间</span>
            <strong>1.2 秒</strong>
          </div>
        </div>

        <div class="ai-chat">
          <div v-for="item in aiSuggestions" :key="item.question" class="chat-card">
            <div class="chat-card__question">Q：{{ item.question }}</div>
            <div class="chat-card__answer">A：{{ item.answer }}</div>
          </div>
        </div>

        <div class="ai-input-card">
          <div class="ai-input-card__header">
            <strong>发起智能问答</strong>
            <span>可咨询用水偏高原因、设备故障排查、节水建议等问题</span>
          </div>

          <div class="prompt-list">
            <button type="button" class="prompt-chip">宿舍区夜间用水为什么偏高？</button>
            <button type="button" class="prompt-chip">如何快速排查设备离线？</button>
            <button type="button" class="prompt-chip">有没有更合适的节水措施？</button>
          </div>

          <div class="ai-input-box">
            <el-input
              type="textarea"
              :rows="7"
              placeholder="请输入水务问题，例如：用水偏高原因、节水建议、设备故障排查等"
            />
            <el-button type="primary">发送咨询</el-button>
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
    font-size: 30px;
    font-weight: 700;
  }
}

.ai-chat {
  display: grid;
  grid-column: span 7;
  gap: 16px;
}

.chat-card {
  padding: 22px;

  &__question {
    margin-bottom: 12px;
    color: #f4fbff;
    font-size: 20px;
    font-weight: 600;
  }

  &__answer {
    color: $color-text-secondary;
    line-height: 1.8;
    font-size: 16px;
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

  .ai-layout,
  .ai-summary {
    grid-template-columns: 1fr;
  }

  .ai-chat,
  .ai-input-card {
    grid-column: auto;
  }
}
</style>
