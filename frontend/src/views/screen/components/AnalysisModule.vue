<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import ScreenPanel from './ScreenPanel.vue'
import { historyCards, progressList, usageShare, waterStats } from '../data'
import { createBarOption, createDonutOption, createLineOption, createSavingOption } from '../chart-options'

const lineOption = computed(() => createLineOption())
const barOption = computed(() => createBarOption())
const savingOption = computed(() => createSavingOption())
</script>

<template>
  <section class="side-column">
    <ScreenPanel title="用水数据" unit="m³">
      <div class="stat-grid">
        <div v-for="item in waterStats" :key="item.label" class="water-stat">
          <div class="water-stat__ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" class="track" />
              <circle
                cx="60"
                cy="60"
                r="52"
                class="progress"
                :style="{ strokeDasharray: `${(327 * item.percent) / 100} 327` }"
              />
            </svg>
            <span>{{ item.percent }}%</span>
          </div>
          <div class="water-stat__info">
            <h4>{{ item.label }}</h4>
            <p>{{ item.value }} {{ item.unit }}</p>
          </div>
        </div>
      </div>
    </ScreenPanel>

    <ScreenPanel title="区域用水占比分析" unit="单位：m³">
      <div class="share-block">
        <div class="share-grid">
          <div v-for="item in usageShare" :key="item.name" class="share-item">
            <div class="share-chart">
              <BaseChart :option="createDonutOption(item)" />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div class="progress-list">
        <div v-for="item in progressList" :key="item.name" class="progress-row">
          <span>{{ item.name }}</span>
          <el-progress
            :percentage="Math.round((item.value / item.total) * 100)"
            :show-text="false"
            color="#56a8ff"
            :stroke-width="12"
          />
          <span>{{ item.value }}/{{ item.total }}</span>
          </div>
        </div>
    </ScreenPanel>

    <ScreenPanel title="用水规律统计" unit="单位：万吨">
      <div class="chart-box">
        <BaseChart :option="lineOption" />
      </div>
    </ScreenPanel>
  </section>

  <section class="center-column">
    <div class="center-glow">
      <div class="glow-halo"></div>
      <div class="glow-ring"></div>
    </div>

    <ScreenPanel title="用水报告" unit="自动生成">
      <div class="report-box">
        <div class="report-card">
          <strong>本月综合结论</strong>
          <p>整体用水趋势平稳，教学区与宿舍区在夜间存在轻微异常波动，建议结合分时监测继续跟踪。</p>
        </div>
        <div class="report-card">
          <strong>区域关注点</strong>
          <p>一教片区与宿舍北区建议作为重点巡检对象，优先核查基流、阀件与漏损情况。</p>
        </div>
      </div>
    </ScreenPanel>
  </section>

  <section class="side-column">
    <ScreenPanel title="历年用水量数据" unit="单位：万吨">
      <div class="hex-grid">
        <div v-for="item in historyCards" :key="item.year" class="hex-card">
          <div class="hex-card__inner">
            <strong>{{ item.value }}</strong>
            <span>万吨</span>
            <small>{{ item.year }}</small>
          </div>
        </div>
      </div>
    </ScreenPanel>

    <ScreenPanel title="节水比" unit="单位：万吨">
      <div class="saving-panel">
        <div class="saving-chart">
          <BaseChart :option="savingOption" />
        </div>
        <div class="saving-data">
          <div>
            <label>月基准水量</label>
            <strong>4000 m³</strong>
          </div>
          <div>
            <label>上月用水量</label>
            <strong>3900 m³</strong>
          </div>
          <div>
            <label>上月节水量</label>
            <strong>100 m³</strong>
          </div>
        </div>
      </div>
    </ScreenPanel>

    <ScreenPanel title="同比分析图" unit="单位：万吨">
      <div class="chart-box">
        <BaseChart :option="barOption" />
      </div>
    </ScreenPanel>
  </section>
</template>

<style lang="scss" scoped>
.side-column,
.center-column {
  display: grid;
  gap: $screen-gap;
  min-height: 0;
}

.side-column {
  grid-template-rows: 1.25fr 1.4fr 1.15fr;
}

.center-column {
  grid-template-rows: minmax(0, 1fr) 220px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  padding: 18px 14px 16px;
}

.water-stat {
  display: flex;
  align-items: center;
  gap: 10px;

  &__ring {
    position: relative;
    width: 96px;
    height: 96px;
    flex-shrink: 0;
  }

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .track {
    fill: none;
    stroke: rgba(85, 173, 255, 0.18);
    stroke-width: 6;
  }

  .progress {
    fill: none;
    stroke: $color-accent;
    stroke-width: 6;
    stroke-linecap: round;
  }

  span {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-weight: 700;
    color: #f4fbff;
  }

  &__info {
    h4 {
      margin: 0 0 6px;
      font-size: 16px;
      color: #ddecff;
    }

    p {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
    }
  }
}

.share-block {
  padding: 12px 10px 6px;
}

.share-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.share-item {
  text-align: center;
  color: #bddbff;
  font-size: 14px;
}

.share-chart {
  height: 120px;
  width: 120px;
}

.progress-list {
  padding: 0 18px 16px;
  display: grid;
  gap: 10px;
}

.progress-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) 100px;
  gap: 12px;
  align-items: center;
  color: #b6d7ff;
  font-size: 14px;
}

.chart-box {
  height: 100%;
  min-height: 0;
}

.center-glow {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border-radius: $screen-radius;
}

.glow-halo {
  position: absolute;
  inset: 22% 16% 10%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 62%, rgba(113, 244, 255, 0.95) 0, rgba(113, 244, 255, 0.35) 18%, rgba(113, 244, 255, 0.08) 38%, transparent 64%);
  filter: blur(10px);
}

.glow-ring {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 10px;
  height: 190px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(101, 228, 255, 0.18) 0 40%, transparent 60%),
    linear-gradient(180deg, rgba(77, 184, 255, 0.18), rgba(77, 184, 255, 0.02));
  box-shadow:
    inset 0 0 40px rgba(123, 238, 255, 0.45),
    0 0 60px rgba(57, 181, 255, 0.2);
  transform: perspective(400px) rotateX(70deg);
}

.report-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 18px;
  height: 100%;
}

.report-card {
  @include panel-surface;
  @include panel-overlay;
  padding: 18px;
  border-color: rgba(115, 182, 255, 0.14);
  background: rgba(9, 22, 42, 0.72);

  strong {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: $color-text-secondary;
    line-height: 1.7;
  }
}

.hex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 26px 18px 20px;
}

.hex-card {
  display: flex;
  justify-content: center;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 108px;
    height: 120px;
    clip-path: polygon(25% 7%, 75% 7%, 100% 50%, 75% 93%, 25% 93%, 0 50%);
    background: linear-gradient(180deg, rgba(19, 72, 126, 0.9), rgba(11, 34, 68, 0.9));
    box-shadow:
      inset 0 0 0 1px rgba(85, 173, 255, 0.2),
      0 10px 24px rgba(3, 12, 31, 0.32);

    strong {
      font-size: 22px;
      color: #37a3ff;
    }

    span {
      font-size: 13px;
      color: #5db5ff;
    }

    small {
      margin-top: 8px;
      color: #8faed0;
      font-size: 14px;
    }
  }
}

.saving-panel {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 8px;
  height: 100%;
  min-height: 0;
  padding: 8px 10px 14px;
}

.saving-chart {
  height: 100%;
  min-height: 0;
}

.saving-data {
  display: grid;
  gap: 18px;
  align-content: center;

  label {
    display: block;
    margin-bottom: 6px;
    color: $color-text-secondary;
    font-size: 14px;
  }

  strong {
    color: #3bb2ff;
    font-size: 26px;
    font-weight: 700;
  }
}

:deep(.progress-row .el-progress-bar__outer) {
  background: rgba(255, 255, 255, 0.12);
}

@media (max-width: 1600px) {
  .side-column,
  .center-column {
    grid-template-rows: none;
  }

  .center-glow {
    min-height: 320px;
  }

  .report-box {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .stat-grid,
  .share-grid,
  .hex-grid,
  .saving-panel {
    grid-template-columns: 1fr;
  }

  .progress-row {
    grid-template-columns: 84px 240px 92px;
  }
}
</style>
