<script>
import { getStoredUser } from './utils/auth'

export default {
  onLaunch() {
    const user = getStoredUser()
    if (!user) {
      uni.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
}
</script>

<style>
page {
  min-height: 100%;
  background: linear-gradient(180deg, #03101b 0%, #082035 100%);
  color: #eff8ff;
  font-size: 28rpx;
}

view,
text,
button,
input,
textarea {
  box-sizing: border-box;
}

.page-shell {
  min-height: 100vh;
  padding: 28rpx;
}

.card {
  background: rgba(8, 26, 48, 0.9);
  border: 1rpx solid rgba(100, 180, 255, 0.18);
  border-radius: 24rpx;
  box-shadow: 0 16rpx 50rpx rgba(1, 10, 24, 0.35);
}

.section-title {
  margin: 0 0 18rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #f5fbff;
}

.section-desc {
  margin: 0;
  color: #9ab9d8;
  font-size: 24rpx;
  line-height: 1.7;
}

.primary-btn {
  height: 88rpx;
  line-height: 88rpx;
  border: none;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #1788ff 0%, #29d7ff 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.ghost-btn {
  height: 80rpx;
  line-height: 80rpx;
  border: 1rpx solid rgba(115, 190, 255, 0.26);
  border-radius: 999rpx;
  background: rgba(16, 37, 65, 0.72);
  color: #d8f2ff;
  font-size: 28rpx;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #ddf4ff;
  background: rgba(56, 146, 255, 0.18);
}

.field-label {
  display: block;
  margin-bottom: 14rpx;
  color: #d7ecff;
  font-size: 26rpx;
}

.field-input,
.field-textarea,
.field-picker {
  width: 100%;
  padding: 22rpx 24rpx;
  border-radius: 20rpx;
  background: rgba(4, 17, 32, 0.9);
  border: 1rpx solid rgba(118, 190, 255, 0.12);
  color: #f0f8ff;
}

.muted-text {
  color: #94b4d4;
}
</style>
