<script setup lang="ts">
defineProps<{
  timeText: string
  dateText: string
  weekdayText: string
}>()
</script>

<template>
  <header class="screen-header">
    <div class="screen-header__brand">水务</div>
    <div class="screen-header__nav">首页</div>
    <div class="screen-header__tools">
      <div class="clock-box">
        <span class="clock">{{ timeText }}</span>
        <span class="divider"></span>
        <div class="date-group">
          <span class="weekday">{{ weekdayText }}</span>
          <span class="date">{{ dateText }}</span>
        </div>
      </div>
      <div class="tool-icon">↻</div>
      <div class="tool-icon">⚙</div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px 8px;

  &__brand {
    font-size: 48px;
    letter-spacing: 4px;
    color: $color-brand;
    text-shadow: 0 0 12px rgba(90, 220, 255, 0.28);
  }

  &__nav {
    margin-left: 48px;
    margin-right: auto;
    padding: 10px 50px;
    background: linear-gradient(90deg, rgba(78, 160, 196, 0.9), rgba(92, 188, 219, 0.65));
    color: #f8fdff;
    font-size: 28px;
    font-weight: 700;
    clip-path: polygon(18% 0, 100% 0, 82% 100%, 0 100%);
    box-shadow: 0 8px 24px rgba(31, 93, 120, 0.3);
  }

  &__tools {
    display: flex;
    align-items: center;
    gap: 14px;
  }
}

.clock-box {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 22px;
  background: linear-gradient(90deg, rgba(24, 136, 190, 0.92), rgba(15, 57, 93, 0.95));
  clip-path: polygon(6% 0, 100% 0, 94% 100%, 0 100%);
  box-shadow: 0 12px 28px rgba(11, 42, 68, 0.35);
}

.clock {
  font-size: 34px;
  font-weight: 700;
}

.divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.35);
}

.date-group {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.weekday {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.82);
}

.date {
  font-size: 18px;
  color: #b7e8ff;
}

.tool-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(118, 204, 255, 0.3);
  border-radius: 50%;
  color: #d2f1ff;
}

@media (max-width: 900px) {
  .screen-header {
    flex-wrap: wrap;
    gap: 12px;

    &__nav {
      margin: 0;
    }

    &__tools {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
