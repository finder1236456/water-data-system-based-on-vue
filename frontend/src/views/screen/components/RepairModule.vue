<script setup lang="ts">
import ScreenPanel from './ScreenPanel.vue'
import { repairChannels, repairTickets } from '../data'
</script>

<template>
  <section class="wide-column">
    <ScreenPanel title="故障报修入口" unit="Web / UniApp">
      <div class="repair-layout">
        <div class="repair-summary">
          <div class="summary-card">
            <span>待处理工单</span>
            <strong>12</strong>
          </div>
          <div class="summary-card">
            <span>处理中工单</span>
            <strong>5</strong>
          </div>
          <div class="summary-card">
            <span>移动端上报占比</span>
            <strong>42%</strong>
          </div>
        </div>

        <div class="repair-channel-list">
          <div v-for="item in repairChannels" :key="item.role" class="repair-channel">
            <div class="repair-channel__head">
              <strong>{{ item.role }}</strong>
              <span>快速入口</span>
            </div>
            <p>{{ item.desc }}</p>
          </div>
        </div>

        <div class="repair-form-card">
          <div class="repair-form-card__header">
            <strong>在线报修表单</strong>
            <span>支持文字描述与现场图片上传</span>
          </div>

          <el-form label-position="top" class="repair-form">
            <div class="repair-form__grid">
              <el-form-item label="故障位置">
                <el-input placeholder="例如：教学楼 A 区 3F 配电间" />
              </el-form-item>
              <el-form-item label="故障类型">
                <el-select placeholder="请选择故障类型">
                  <el-option label="阀门漏水" value="leak" />
                  <el-option label="压力异常" value="pressure" />
                  <el-option label="流量计离线" value="meter" />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="故障描述">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入故障现象、影响范围、发生时间等关键信息"
              />
            </el-form-item>

            <div class="repair-form__actions">
              <el-upload action="#" :auto-upload="false">
                <el-button type="primary" plain>上传现场图片</el-button>
              </el-upload>
              <el-button type="primary">提交报修</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </ScreenPanel>
  </section>

  <section class="wide-column">
    <ScreenPanel title="故障工单跟踪" unit="实时状态">
      <div class="ticket-table-wrap">
        <el-table :data="repairTickets" class="common-table" height="100%">
          <el-table-column prop="id" label="工单号" min-width="150" />
          <el-table-column prop="title" label="故障类型" min-width="120" />
          <el-table-column prop="location" label="位置" min-width="140" />
          <el-table-column prop="channel" label="上报渠道" min-width="100" />
          <el-table-column prop="status" label="状态" min-width="100" />
        </el-table>
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

.repair-layout {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
  padding: 22px;
}

.repair-summary {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.summary-card,
.repair-channel,
.repair-form-card {
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

.repair-channel-list {
  display: grid;
  grid-column: span 4;
  gap: 16px;
}

.repair-channel {
  padding: 22px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
  }

  strong {
    color: #fff;
    font-size: 22px;
  }

  span {
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(78, 160, 196, 0.16);
    color: #9bdcff;
    font-size: 13px;
  }

  p {
    margin: 0;
    color: $color-text-secondary;
    line-height: 1.8;
    font-size: 16px;
  }
}

.repair-form-card {
  grid-column: span 8;
  padding: 22px;

  &__header {
    margin-bottom: 18px;

    strong {
      display: block;
      margin-bottom: 8px;
      font-size: 24px;
      color: #fff;
    }

    span {
      color: $color-text-secondary;
      font-size: 15px;
    }
  }
}

.repair-form {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
}

.ticket-table-wrap {
  min-height: 0;
  padding: 10px 0 0;
}

.common-table {
  height: 360px;
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

:deep(.repair-form .el-form-item__label) {
  color: #d9ebff;
}

:deep(.repair-form .el-input__wrapper),
:deep(.repair-form .el-textarea__inner),
:deep(.repair-form .el-select__wrapper) {
  background: rgba(6, 18, 36, 0.82);
  box-shadow: inset 0 0 0 1px rgba(120, 190, 255, 0.14);
}

@media (max-width: 1600px) {
  .wide-column {
    grid-column: auto;
  }

  .repair-layout,
  .repair-summary,
  .repair-form__grid {
    grid-template-columns: 1fr;
  }

  .repair-channel-list,
  .repair-form-card {
    grid-column: auto;
  }

  .repair-form__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
