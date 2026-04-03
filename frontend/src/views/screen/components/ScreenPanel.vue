<script setup lang="ts">
defineProps<{
  title: string
  unit?: string
}>()
</script>

<template>
  <article class="screen-panel">
    <div class="screen-panel__title">
      <span>{{ title }}</span>
      <span v-if="unit" class="screen-panel__unit">{{ unit }}</span>
    </div>
    <div class="screen-panel__body">
      <slot />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.screen-panel {
  @include panel-surface;
  @include panel-overlay;

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 18px;
    font-weight: 700;
  }

  &__unit {
    color: $color-text-secondary;
    font-size: 14px;
    font-weight: 500;
  }

  &__body {
    height: calc(100% - 52px);
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(103, 187, 255, 0.45) rgba(255, 255, 255, 0.08);
  }
}

:deep(.screen-panel__body::-webkit-scrollbar) {
  width: 8px;
}

:deep(.screen-panel__body::-webkit-scrollbar-thumb) {
  border-radius: 999px;
  background: rgba(103, 187, 255, 0.45);
}

:deep(.screen-panel__body::-webkit-scrollbar-track) {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}
</style>
