<script>
import { createRepair, getRepairRegions } from '../../api/repair'

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
      regions: [],
      regionIndex: 0,
      form: {
        title: '',
        regionId: '',
        location: '',
        description: '',
      },
      images: [],
      submitting: false,
    }
  },
  async onShow() {
    if (!this.regions.length) {
      await this.loadRegions()
    }
  },
  methods: {
    async loadRegions() {
      try {
        this.regions = await getRepairRegions()
        if (this.regions.length) {
          this.form.regionId = this.regions[0].id
        }
      } catch (error) {
        uni.showToast({ title: error.message || '区域加载失败', icon: 'none' })
      }
    },
    onRegionChange(event) {
      const value = Number(event.detail.value)
      this.regionIndex = value
      this.form.regionId = this.regions[value]?.id || ''
    },
    chooseImages() {
      uni.chooseImage({
        count: 3,
        success: (res) => {
          this.images = res.tempFilePaths
        },
      })
    },
    async handleSubmit() {
      if (!this.form.title || !this.form.regionId || !this.form.location || !this.form.description) {
        uni.showToast({ title: '请完整填写信息', icon: 'none' })
        return
      }

      this.submitting = true
      try {
        const images = []
        for (const item of this.images) {
          const base64 = await readFileAsBase64(item)
          if (base64) {
            images.push(base64)
          }
        }

        await createRepair({
          ...this.form,
          images,
          source: 'UniApp',
        })

        uni.showToast({ title: '上报成功', icon: 'success' })
        this.form.title = ''
        this.form.location = ''
        this.form.description = ''
        this.images = []
        uni.switchTab({
          url: '/pages/workbench/index',
        })
      } catch (error) {
        uni.showToast({ title: error.message || '上报失败', icon: 'none' })
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<template>
  <view class="page-shell">
    <view class="card report-card">
      <view class="section-title">维修人员快速上报</view>
      <view class="section-desc">巡检发现异常时，可直接通过微信小程序提交位置、描述和现场图片。</view>

      <view class="form-block">
        <text class="field-label">故障标题</text>
        <input v-model="form.title" class="field-input" placeholder="例如：5栋1单元泵房压力异常" placeholder-style="color:#7b9bbb" />
      </view>

      <view class="form-block">
        <text class="field-label">所属单元</text>
        <picker :range="regions" range-key="name" :value="regionIndex" @change="onRegionChange">
          <view class="field-picker">{{ regions[regionIndex]?.name || '请选择单元' }}</view>
        </picker>
      </view>

      <view class="form-block">
        <text class="field-label">具体位置</text>
        <input v-model="form.location" class="field-input" placeholder="例如：2栋1单元 1202 室门口" placeholder-style="color:#7b9bbb" />
      </view>

      <view class="form-block">
        <text class="field-label">故障描述</text>
        <textarea
          v-model="form.description"
          class="field-textarea"
          placeholder="请输入故障表现、影响范围和现场情况"
          placeholder-style="color:#7b9bbb"
        />
      </view>

      <button class="ghost-btn mt" @click="chooseImages">选择现场图片</button>
      <view v-if="images.length" class="muted-text mt">已选择 {{ images.length }} 张图片</view>

      <button class="primary-btn mt" :loading="submitting" @click="handleSubmit">提交报修</button>
    </view>
  </view>
</template>

<style scoped>
.report-card {
  padding: 28rpx;
}

.form-block {
  margin-top: 24rpx;
}

.mt {
  margin-top: 20rpx;
}
</style>
