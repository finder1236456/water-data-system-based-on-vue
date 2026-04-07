<script>
import { clearAuthInfo, getStoredUser } from '../../utils/auth'

export default {
  data() {
    return {
      user: getStoredUser(),
    }
  },
  onShow() {
    this.user = getStoredUser()
  },
  methods: {
    logout() {
      clearAuthInfo()
      uni.reLaunch({
        url: '/pages/login/login',
      })
    },
  },
}
</script>

<template>
  <view class="page-shell">
    <view class="card profile-card">
      <view class="section-title">我的账号</view>
      <view class="profile-row"><text class="profile-label">姓名</text><text>{{ user?.name || '-' }}</text></view>
      <view class="profile-row"><text class="profile-label">账号</text><text>{{ user?.username || '-' }}</text></view>
      <view class="profile-row"><text class="profile-label">角色</text><text>维修人员</text></view>
      <view class="profile-row"><text class="profile-label">手机号</text><text>{{ user?.phone || '-' }}</text></view>

      <button class="primary-btn logout-btn" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<style scoped>
.profile-card {
  padding: 28rpx;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  padding: 18rpx 0;
  border-bottom: 1rpx solid rgba(120, 180, 255, 0.08);
}

.profile-row:last-of-type {
  border-bottom: none;
}

.profile-label {
  color: #96b5d5;
}

.logout-btn {
  margin-top: 28rpx;
}
</style>
