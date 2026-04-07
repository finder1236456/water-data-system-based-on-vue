<script>
import { login } from '../../api/auth'
import { setAuthInfo } from '../../utils/auth'

export default {
  data() {
    return {
      loading: false,
      form: {
        username: 'repair001',
        password: '123456',
      },
    }
  },
  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        uni.showToast({ title: '请输入账号和密码', icon: 'none' })
        return
      }

      this.loading = true
      try {
        const result = await login(this.form)
        if (result.user.type !== 'repair') {
          uni.showToast({ title: '仅维修人员可登录小程序', icon: 'none' })
          return
        }

        setAuthInfo(result)
        uni.switchTab({
          url: '/pages/workbench/index',
        })
      } catch (error) {
        uni.showToast({
          title: error.message || '登录失败',
          icon: 'none',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <view class="login-page">
    <view class="login-panel card">
      <view class="login-panel__brand">水务维修端</view>
      <view class="section-title">微信小程序工单入口</view>
      <view class="section-desc">维修人员可在此查看待处理工单、快速上报故障并上传现场图片。</view>

      <view class="form-block">
        <text class="field-label">维修账号</text>
        <input v-model="form.username" class="field-input" placeholder="请输入维修账号" placeholder-style="color:#7b9bbb" />
      </view>

      <view class="form-block">
        <text class="field-label">登录密码</text>
        <input
          v-model="form.password"
          class="field-input"
          type="password"
          password
          placeholder="请输入登录密码"
          placeholder-style="color:#7b9bbb"
        />
      </view>

      <button class="primary-btn" :loading="loading" @click="handleLogin">登录并进入工单台</button>

      <view class="tips">测试账号：repair001 / 123456</view>
    </view>
  </view>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-panel {
  width: 100%;
  padding: 48rpx 38rpx;
}

.login-panel__brand {
  margin-bottom: 20rpx;
  color: #6edfff;
  font-size: 56rpx;
  font-weight: 700;
}

.form-block {
  margin-top: 28rpx;
}

.tips {
  margin-top: 24rpx;
  text-align: center;
  color: #89a9c8;
  font-size: 24rpx;
}
</style>
