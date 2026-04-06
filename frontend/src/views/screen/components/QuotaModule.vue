<script setup lang="ts">
import ScreenPanel from './ScreenPanel.vue'
import type { QuotaItem } from '../data'

defineProps<{
  quotaList: QuotaItem[]
  savingSuggestions: string[]
}>()
</script>

<template>
  <section class="wide-column">
    <ScreenPanel title="用水定额与超额监测" unit="按楼栋单元统计">
      <div class="quota-layout">
        <div class="quota-summary">
          <div class="summary-card">
            <span>当前监测单元</span>
            <strong>{{ quotaList.length }} 个</strong>
          </div>
          <div class="summary-card">
            <span>超额预警</span>
            <strong>{{ quotaList.filter((item) => item.status.includes('超额')).length }} 个单元</strong>
          </div>
          <div class="summary-card">
            <span>建议重点关注</span>
            <strong>{{ quotaList.find((item) => item.status.includes('预警'))?.area || '暂无' }}</strong>
          </div>
        </div>

        <div class="quota-cards">
          <div v-for="item in quotaList" :key="item.area" class="quota-card">
            <div class="quota-card__head">
              <strong>{{ item.area }}</strong>
              <em>{{ item.status }}</em>
            </div>
            <div class="quota-card__metrics">
              <div>
                <span>当前用水</span>
                <b>{{ item.current }}</b>
              </div>
              <div>
                <span>定额标准</span>
                <b>{{ item.quota }}</b>
              </div>
            </div>
          </div>
        </div>

        <div class="quota-table-wrap">
          <el-table :data="quotaList" class="common-table" height="100%">
            <el-table-column prop="area" label="楼栋单元" min-width="180" />
            <el-table-column prop="current" label="当前用水" min-width="140" />
            <el-table-column prop="quota" label="定额标准" min-width="140" />
            <el-table-column prop="status" label="监测结果" min-width="140" />
          </el-table>
        </div>
      </div>
    </ScreenPanel>
  </section>

  <section class="wide-column">
    <ScreenPanel title="系统节水建议" unit="智能推送">
      <div class="suggestion-list">
        <div v-for="item in savingSuggestions" :key="item" class="suggestion-item">
          {{ item }}
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

.quota-layout {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
  padding: 22px;
}

.quota-summary {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.summary-card {
  @include panel-surface;
  @include panel-overlay;
  padding: 20px 22px;
  border-color: rgba(115, 182, 255, 0.14);
  background: rgba(9, 22, 42, 0.72);

  span {
    display: block;
    margin-bottom: 10px;
    color: $color-text-secondary;
    font-size: 14px;
  }

  strong {
    color: #fff;
    font-size: clamp(22px, 2vw, 30px);
    font-weight: 700;
  }
}

.quota-cards {
  display: grid;
  grid-column: span 5;
  gap: 16px;
}

.quota-card {
  @include panel-surface;
  @include panel-overlay;
  padding: 20px 22px;
  border-color: rgba(115, 182, 255, 0.14);
  background: rgba(9, 22, 42, 0.72);

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  strong {
    font-size: 22px;
    color: #fff;
  }

  em {
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(78, 160, 196, 0.16);
    color: #9bdcff;
    font-style: normal;
    font-size: 13px;
    white-space: nowrap;
  }

  span {
    display: block;
    margin-bottom: 8px;
    color: $color-text-secondary;
    font-size: 13px;
  }

  b {
    color: #f5fbff;
    font-size: 22px;
    font-weight: 600;
  }
}

.quota-table-wrap {
  grid-column: span 7;
  min-height: 0;
  padding: 6px 2px 0;
}

.suggestion-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 8px 0 4px;
}

.suggestion-item {
  @include panel-surface;
  @include panel-overlay;
  min-height: 128px;
  display: flex;
  align-items: center;
  padding: 22px;
  border-color: rgba(115, 182, 255, 0.14);
  background: rgba(9, 22, 42, 0.72);
  font-size: 18px;
  line-height: 1.8;
}

.common-table {
  height: 420px;
  background: transparent;
}

:deep(.common-table.el-table) {
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(86, 168, 255, 0.08);
  --el-table-header-bg-color: rgba(83, 129, 198, 0.16);
  --el-table-border-color: rgba(115, 182, 255, 0.12);
  --el-table-text-color: #dfeeff;
  --el-table-header-text-color: #f4f8ff;
  --el-fill-color-lighter: transparent;
}

:deep(.common-table .el-table__inner-wrapper::before) {
  display: none;
}

@media (max-width: 1600px) {
  .wide-column {
    grid-column: auto;
  }

  .quota-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quota-summary,
  .suggestion-list {
    grid-column: 1 / -1;
  }

  .quota-cards,
  .quota-table-wrap {
    grid-column: auto;
  }
}

@media (max-width: 980px) {
  .quota-layout,
  .quota-summary,
  .suggestion-list,
  .quota-card__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
