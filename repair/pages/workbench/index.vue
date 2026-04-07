<script>
import { getRepairList } from '../../api/repair'

const tabs = ['全部', '待派单', '处理中', '待复核', '已完成']

export default {
  data() {
    return {
      tabs,
      activeTab: '全部',
      loading: false,
      list: [],
    }
  },
  onShow() {
    this.loadList()
  },
  methods: {
    async loadList() {
      this.loading = true
      try {
        const status = this.activeTab === '全部' ? '' : this.activeTab
        this.list = await getRepairList({ status })
      } catch (error) {
        uni.showToast({
          title: error.message || '工单加载失败',
          icon: 'none',
        })
      } finally {
        this.loading = false
      }
    },
    switchTab(tab) {
      if (this.activeTab === tab) {
        return
      }
      this.activeTab = tab
      this.loadList()
    },
    openDetail(item) {
      uni.navigateTo({
        url: `/pages/repair/detail?id=${item.id}`,
      })
    },
  },
}
</script>

<template>
  <view class="page-shell">
    <view class="hero card">
      <view class="section-title">维修工单工作台</view>
      <view class="section-desc">支持查看待派单、处理中、待复核和已完成工单，并可进入详情接单或完工。</view>
    </view>

    <scroll-view class="tab-scroll" scroll-x>
      <view class="tab-row">
        <view
          v-for="tab in tabs"
          :key="tab"
          class="tab-chip"
          :class="{ 'tab-chip--active': activeTab === tab }"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </view>
      </view>
    </scroll-view>

    <view v-if="loading" class="empty-state">工单加载中...</view>

    <view v-else-if="!list.length" class="empty-state card">当前暂无工单</view>

    <view v-else class="list-wrap">
      <view v-for="item in list" :key="item.id" class="ticket-card card" @click="openDetail(item)">
        <view class="ticket-card__head">
          <text class="ticket-title">{{ item.title }}</text>
          <text class="tag">{{ item.status }}</text>
        </view>
        <view class="ticket-meta">工单号：{{ item.repairCode }}</view>
        <view class="ticket-meta">位置：{{ item.location }}</view>
        <view class="ticket-meta">区域：{{ item.regionName }}</view>
        <view class="ticket-meta">上报渠道：{{ item.channel }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.hero {
  padding: 28rpx;
}

.tab-scroll {
  margin: 24rpx 0;
  white-space: nowrap;
}

.tab-row {
  display: inline-flex;
  gap: 16rpx;
}

.tab-chip {
  padding: 16rpx 26rpx;
  border-radius: 999rpx;
  color: #cfe9ff;
  background: rgba(10, 31, 56, 0.82);
  border: 1rpx solid rgba(116, 189, 255, 0.14);
}

.tab-chip--active {
  background: linear-gradient(90deg, #1788ff 0%, #29d7ff 100%);
  color: #fff;
}

.list-wrap {
  display: grid;
  gap: 18rpx;
}

.ticket-card {
  padding: 24rpx;
}

.ticket-card__head {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  align-items: center;
  margin-bottom: 16rpx;
}

.ticket-title {
  flex: 1;
  color: #f3fbff;
  font-size: 32rpx;
  font-weight: 700;
}

.ticket-meta {
  margin-top: 10rpx;
  color: #9bb7d4;
  font-size: 25rpx;
  line-height: 1.7;
}

.empty-state {
  margin-top: 24rpx;
  padding: 50rpx 30rpx;
  text-align: center;
  color: #9cb9d8;
}
</style>
