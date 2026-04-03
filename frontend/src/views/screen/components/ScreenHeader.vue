<script setup lang="ts">
type NavItem = {
  key: string
  label: string
}

defineProps<{
  timeText: string
  dateText: string
  weekdayText: string
  roleLabel: string
  navItems: NavItem[]
  activeKey: string
}>()

const emit = defineEmits<{
  navigate: [key: string]
  logout: []
}>()
</script>

<template>
  <header class="screen-header">
    <div class="screen-header__brand-wrap">
      <div class="screen-header__brand">水务</div>
      <div class="screen-header__role">{{ roleLabel }}</div>
    </div>

    <nav class="screen-header__nav">
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        class="nav-chip"
        :class="{ 'nav-chip--active': item.key === activeKey }"
        @click="emit('navigate', item.key)"
      >
        {{ item.label }}
      </button>
    </nav>

    <div class="screen-header__tools">
      <div class="clock-box">
        <span class="clock">{{ timeText }}</span>
        <span class="divider"></span>
        <div class="date-group">
          <span class="weekday">{{ weekdayText }}</span>
          <span class="date">{{ dateText }}</span>
        </div>
      </div>
      <button type="button" class="tool-icon" title="退出登录" @click="emit('logout')">退</button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.screen-header {
  display: grid;
  grid-template-columns: minmax(220px, 320px) minmax(540px, 1fr) minmax(320px, 380px);
  align-items: center;
  gap: 28px;
  padding: 22px 32px 10px;

  &__brand-wrap {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  &__brand {
    font-size: 62px;
    letter-spacing: 4px;
    color: $color-brand;
    text-shadow: 0 0 12px rgba(90, 220, 255, 0.28);
    line-height: 1;
  }

  &__role {
    padding: 6px 14px;
    border: 1px solid rgba(118, 204, 255, 0.28);
    border-radius: 999px;
    background: rgba(73, 165, 255, 0.12);
    color: #bfe9ff;
    font-size: 14px;
    white-space: nowrap;
  }

  &__nav {
    display: flex;
    justify-content: center;
    gap: 16px;
    min-width: 0;
  }

  &__tools {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
  }
}

.nav-chip {
  min-width: 132px;
  padding: 14px 22px;
  border: 1px solid rgba(105, 188, 226, 0.28);
  background: linear-gradient(90deg, rgba(33, 70, 110, 0.78), rgba(49, 113, 146, 0.36));
  color: #d8f4ff;
  font-size: 18px;
  font-weight: 600;
  clip-path: polygon(9% 0, 100% 0, 91% 100%, 0 100%);
  cursor: pointer;
  transition:
    transform $transition-base,
    border-color $transition-base,
    background $transition-base;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(120, 220, 255, 0.45);
  }

  &--active {
    background: linear-gradient(90deg, rgba(78, 160, 196, 0.9), rgba(92, 188, 219, 0.65));
    color: #f8fdff;
    box-shadow: 0 8px 24px rgba(31, 93, 120, 0.3);
  }
}

.clock-box {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 332px;
  padding: 14px 24px;
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
  width: 44px;
  height: 44px;
  border: 1px solid rgba(118, 204, 255, 0.3);
  border-radius: 50%;
  background: transparent;
  color: #d2f1ff;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .screen-header {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
  }

  .screen-header__nav {
    flex-wrap: wrap;
  }
}
</style>
