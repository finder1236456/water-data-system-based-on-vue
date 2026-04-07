<script>
import { API_ORIGIN } from '../../config'
import { completeRepair, getRepairDetail, receiveRepair } from '../../api/repair'
import { getStoredUser } from '../../utils/auth'

const readFileAsBase64 = (filePath) =>
  new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: (res) => resolve(`data:image/jpeg;base64,${res.data}`),
      fail: reject,
    })
    // #endif

    // #ifndef MP-WEIXIN
    resolve('')
    // #endif
  })

export default {
  data() {
    return {
      id: '',
      detail: null,
      loading: false,
      completeRemark: '',
      completeImages: [],
      user: getStoredUser(),
    }
  },
  onLoad(options) {
    this.id = options.id
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      this.loading = true
      try {
        this.detail = await getRepairDetail(this.id)
      } catch (error) {
        uni.showToast({ title: error.message || '详情加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    async handleReceive() {
      try {
        await receiveRepair(this.id)
        uni.showToast({ title: '接单成功', icon: 'success' })
        this.loadDetail()
      } catch (error) {
        uni.showToast({ title: error.message || '接单失败', icon: 'none' })
      }
    },
    chooseImages() {
      uni.chooseImage({
        count: 3,
        success: (res) => {
          this.completeImages = res.tempFilePaths
        },
      })
    },
    async handleComplete() {
      try {
        const images = []
        for (const item of this.completeImages) {
          const base64 = await readFileAsBase64(item)
          if (base64) {
            images.push(base64)
          }
        }

        await completeRepair(this.id, {
          content: this.completeRemark,
          images,
        })
        uni.showToast({ title: '工单已完成', icon: 'success' })
        this.completeRemark = ''
        this.completeImages = []
        this.loadDetail()
      } catch (error) {
        uni.showToast({ title: error.message || '完工提交失败', icon: 'none' })
      }
    },
    previewImage(url) {
      uni.previewImage({
        urls: this.detail.images.map((item) => `${API_ORIGIN}${item.imageUrl}`),
        current: `${API_ORIGIN}${url}`,
      })
    },
  },
}
</script>

<template>
  <view class="page-shell">
    <view v-if="!detail && loading" class="empty-state">工单详情加载中...</view>

    <template v-else-if="detail">
      <view class="card detail-card">
        <view class="detail-head">
          <view>
            <view class="section-title">{{ detail.title }}</view>
            <view class="muted-text">工单号：{{ detail.repairCode }}</view>
          </view>
          <view class="tag">{{ detail.status }}</view>
        </view>

        <view class="detail-row"><text class="detail-label">区域</text><text>{{ detail.regionName }}</text></view>
        <view class="detail-row"><text class="detail-label">位置</text><text>{{ detail.location }}</text></view>
        <view class="detail-row"><text class="detail-label">上报渠道</text><text>{{ detail.channel }}</text></view>
        <view class="detail-row"><text class="detail-label">上报人</text><text>{{ detail.reporterName || '系统' }}</text></view>
        <view class="detail-row"><text class="detail-label">维修人</text><text>{{ detail.maintainerName || '待指派' }}</text></view>
        <view class="detail-desc">{{ detail.description }}</view>
      </view>

      <view v-if="detail.images && detail.images.length" class="card image-card">
        <view class="section-title">现场图片</view>
        <scroll-view scroll-x class="image-scroll">
          <view class="image-row">
            <image
              v-for="item in detail.images"
              :key="item.id"
              class="thumb"
              :src="`${API_ORIGIN}${item.imageUrl}`"
              mode="aspectFill"
              @click="previewImage(item.imageUrl)"
            />
          </view>
        </scroll-view>
      </view>

      <view class="card log-card">
        <view class="section-title">处理记录</view>
        <view v-for="item in detail.logs" :key="item.id" class="log-item">
          <view class="log-item__title">{{ item.operatorName || '系统' }} · {{ item.actionType }}</view>
          <view class="log-item__content">{{ item.content }}</view>
          <view class="muted-text">{{ item.createdAt }}</view>
        </view>
      </view>

      <view v-if="detail.status === '待派单'" class="card action-card">
        <view class="section-title">接单处理</view>
        <button class="primary-btn" @click="handleReceive">立即接单</button>
      </view>

      <view v-if="detail.status === '处理中'" class="card action-card">
        <view class="section-title">提交完工结果</view>
        <textarea
          v-model="completeRemark"
          class="field-textarea"
          placeholder="请输入维修说明、处理结果和恢复情况"
          placeholder-style="color:#7b9bbb"
        />
        <button class="ghost-btn mt" @click="chooseImages">选择完工图片</button>
        <view v-if="completeImages.length" class="muted-text mt">已选择 {{ completeImages.length }} 张图片</view>
        <button class="primary-btn mt" @click="handleComplete">提交完工</button>
      </view>
    </template>
  </view>
</template>

<style scoped>
.detail-card,
.image-card,
.log-card,
.action-card {
  padding: 26rpx;
  margin-bottom: 20rpx;
}

.detail-head {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 22rpx;
}

.detail-row {
  display: flex;
  gap: 18rpx;
  margin-bottom: 14rpx;
  line-height: 1.7;
}

.detail-label {
  width: 120rpx;
  color: #91b2d2;
}

.detail-desc {
  margin-top: 20rpx;
  color: #d7ecff;
  line-height: 1.8;
}

.image-scroll {
  white-space: nowrap;
}

.image-row {
  display: inline-flex;
  gap: 16rpx;
}

.thumb {
  width: 180rpx;
  height: 180rpx;
  border-radius: 18rpx;
}

.log-item {
  padding: 18rpx 0;
  border-bottom: 1rpx solid rgba(120, 180, 255, 0.08);
}

.log-item:last-child {
  border-bottom: none;
}

.log-item__title {
  margin-bottom: 10rpx;
  color: #f2f9ff;
  font-size: 28rpx;
  font-weight: 600;
}

.log-item__content {
  margin-bottom: 10rpx;
  color: #b9d4ee;
  line-height: 1.7;
}

.mt {
  margin-top: 18rpx;
}

.empty-state {
  padding: 50rpx 30rpx;
  text-align: center;
  color: #9cb9d8;
}
</style>
