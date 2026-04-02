<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const pageTitle = computed(() => {
  const role = String(route.params.role)
  const titleMap: Record<string, string> = {
    user: '用户页面',
    admin: '管理员页面',
    repair: '维修人员页面',
  }

  return titleMap[role] ?? '角色页面'
})
</script>

<template>
  <div class="role-page">
    <div class="role-card">
      <h1>{{ pageTitle }}</h1>
      <p>当前登录账号：{{ userStore.username || '未登录' }}</p>
      <p>当前身份：{{ userStore.userType }}</p>
      <p>这里先作为登录后的占位页，后续可以分别替换成各自独立页面。</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.role-page {
  display: grid;
  place-items: center;
  height: 100%;
  background:
    radial-gradient(circle at top, rgba(73, 165, 255, 0.2), transparent 32%),
    linear-gradient(180deg, #05101d 0%, #0a1d38 100%);
}

.role-card {
  @include panel-surface;
  @include panel-overlay;
  width: min(560px, calc(100vw - 48px));
  padding: 36px;

  h1 {
    margin: 0 0 16px;
    font-size: 32px;
  }

  p {
    margin: 0 0 10px;
    color: $color-text-secondary;
    font-size: 16px;
  }
}
</style>
