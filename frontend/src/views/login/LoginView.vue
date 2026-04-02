<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getMockAccounts, getTargetRouteByUserType, login } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const accountList = getMockAccounts()

const rules: FormRules<typeof form> = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const fillAccount = (username: string, password: string) => {
  form.username = username
  form.password = password
}

const handleLogin = async () => {
  if (!formRef.value) {
    return
  }

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  loading.value = true

  try {
    const result = await login(form)
    userStore.setUserInfo({
      token: result.token,
      name: result.user.name,
      username: result.user.username,
      userType: result.user.type,
    })

    ElMessage.success(`登录成功，正在进入${result.user.name}页面`)
    await router.push(getTargetRouteByUserType(result.user.type))
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败，请稍后重试。')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-view__bg"></div>

    <section class="login-hero">
      <div class="login-hero__badge">智慧水务平台</div>
      <h1>水务数据统一管理入口</h1>
      <p>支持用户、管理员和维修人员登录，系统会根据账号名称自动进入对应的页面。</p>

      <div class="role-list">
        <div class="role-card role-card--user">
          <strong>用户</strong>
          <span>查看数据看板与基础业务信息</span>
        </div>
        <div class="role-card role-card--admin">
          <strong>管理员</strong>
          <span>管理平台配置与账户权限</span>
        </div>
        <div class="role-card role-card--repair">
          <strong>维修人员</strong>
          <span>处理告警、巡检与维护工单</span>
        </div>
      </div>
    </section>

    <section class="login-card">
      <div class="login-card__header">
        <span class="login-card__tag">LOGIN</span>
        <h2>账号登录</h2>
        <p>输入账号密码后，将根据账号身份自动跳转。</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="login-form">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" size="large" placeholder="请输入账号" clearable />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            size="large"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button class="login-submit" type="primary" size="large" :loading="loading" @click="handleLogin">
          登录系统
        </el-button>
      </el-form>

      <div class="account-tips">
        <div class="account-tips__title">测试账号</div>
        <button
          v-for="account in accountList"
          :key="account.username"
          type="button"
          class="account-item"
          @click="fillAccount(account.username, account.password)"
        >
          <strong>{{ account.name }}</strong>
          <span>{{ account.username }} / {{ account.password }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(380px, 460px);
  align-items: center;
  gap: 48px;
  height: 100%;
  padding: 48px 64px;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 20%, rgba(57, 163, 255, 0.22), transparent 24%),
    radial-gradient(circle at 78% 18%, rgba(62, 224, 255, 0.16), transparent 20%),
    linear-gradient(135deg, #04101d 0%, #081a33 50%, #0a2346 100%);

  &__bg {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85), transparent);
    opacity: 0.28;
    pointer-events: none;
  }
}

.login-hero,
.login-card {
  position: relative;
  z-index: 1;
}

.login-hero {
  max-width: 720px;

  &__badge {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid rgba(124, 202, 255, 0.26);
    border-radius: 999px;
    background: rgba(73, 165, 255, 0.12);
    color: #9ed8ff;
    font-size: 14px;
    letter-spacing: 1px;
  }

  h1 {
    margin: 20px 0 18px;
    color: #f4fbff;
    font-size: clamp(40px, 4vw, 60px);
    line-height: 1.08;
  }

  p {
    margin: 0;
    max-width: 620px;
    color: rgba(226, 239, 255, 0.78);
    font-size: 18px;
    line-height: 1.8;
  }
}

.role-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 36px;
}

.role-card {
  @include panel-surface;
  @include panel-overlay;
  padding: 24px 22px;
  backdrop-filter: blur(8px);

  strong {
    display: block;
    margin-bottom: 10px;
    color: #f4fbff;
    font-size: 22px;
  }

  span {
    color: rgba(221, 236, 255, 0.72);
    line-height: 1.7;
  }

  &--user {
    border-color: rgba(89, 182, 255, 0.4);
  }

  &--admin {
    border-color: rgba(126, 233, 197, 0.35);
  }

  &--repair {
    border-color: rgba(255, 198, 96, 0.35);
  }
}

.login-card {
  @include panel-surface;
  @include panel-overlay;
  width: 100%;
  padding: 32px;
  backdrop-filter: blur(14px);

  &__header {
    margin-bottom: 24px;

    h2 {
      margin: 12px 0 10px;
      color: #ffffff;
      font-size: 32px;
    }

    p {
      margin: 0;
      color: $color-text-secondary;
      line-height: 1.7;
    }
  }

  &__tag {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(76, 181, 255, 0.16);
    color: #8fd5ff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
  }
}

.login-form {
  :deep(.el-form-item__label) {
    color: #d9ebff;
    font-size: 15px;
  }

  :deep(.el-input__wrapper) {
    min-height: 48px;
    border-radius: 12px;
    background: rgba(4, 14, 28, 0.75);
    box-shadow: inset 0 0 0 1px rgba(120, 190, 255, 0.18);
  }

  :deep(.el-input__inner) {
    color: #eef6ff;
  }
}

.login-submit {
  width: 100%;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #1888be 0%, #39b7ff 100%);
}

.account-tips {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid rgba(115, 182, 255, 0.12);

  &__title {
    margin-bottom: 12px;
    color: #dcebff;
    font-size: 14px;
    font-weight: 700;
  }
}

.account-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  padding: 14px 16px;
  border: 1px solid rgba(115, 182, 255, 0.12);
  border-radius: 12px;
  background: rgba(9, 20, 38, 0.72);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform $transition-base,
    border-color $transition-base,
    background-color $transition-base;

  strong {
    margin-bottom: 6px;
    color: #f6fbff;
    font-size: 15px;
  }

  span {
    color: $color-text-secondary;
    font-size: 13px;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(89, 182, 255, 0.34);
    background: rgba(12, 29, 56, 0.9);
  }
}

@media (max-width: 1180px) {
  .login-view {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 28px 20px;
    overflow-y: auto;
  }

  .role-list {
    grid-template-columns: 1fr;
  }

  .login-card {
    max-width: 520px;
  }
}
</style>
