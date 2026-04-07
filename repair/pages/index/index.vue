<script>
import { getStoredUser } from '../../utils/auth'

export default {
  onLoad() {
    const user = getStoredUser()
    if (user) {
      uni.switchTab({
        url: '/pages/workbench/index',
      })
      return
    }

    uni.reLaunch({
      url: '/pages/login/login',
    })
  },
}
</script>

<template>
  <view class="page-shell"></view>
</template>
