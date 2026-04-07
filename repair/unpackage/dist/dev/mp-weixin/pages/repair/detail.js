"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const api_repair = require("../../api/repair.js");
const utils_auth = require("../../utils/auth.js");
const readFileAsBase64 = (filePath) => new Promise((resolve, reject) => {
  common_vendor.wx$1.getFileSystemManager().readFile({
    filePath,
    encoding: "base64",
    success: (res) => resolve(`data:image/jpeg;base64,${res.data}`),
    fail: reject
  });
});
const _sfc_main = {
  data() {
    return {
      id: "",
      detail: null,
      loading: false,
      completeRemark: "",
      completeImages: [],
      user: utils_auth.getStoredUser()
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadDetail();
  },
  methods: {
    async loadDetail() {
      this.loading = true;
      try {
        this.detail = await api_repair.getRepairDetail(this.id);
      } catch (error) {
        common_vendor.index.showToast({ title: error.message || "详情加载失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    async handleReceive() {
      try {
        await api_repair.receiveRepair(this.id);
        common_vendor.index.showToast({ title: "接单成功", icon: "success" });
        this.loadDetail();
      } catch (error) {
        common_vendor.index.showToast({ title: error.message || "接单失败", icon: "none" });
      }
    },
    chooseImages() {
      common_vendor.index.chooseImage({
        count: 3,
        success: (res) => {
          this.completeImages = res.tempFilePaths;
        }
      });
    },
    async handleComplete() {
      try {
        const images = [];
        for (const item of this.completeImages) {
          const base64 = await readFileAsBase64(item);
          if (base64) {
            images.push(base64);
          }
        }
        await api_repair.completeRepair(this.id, {
          content: this.completeRemark,
          images
        });
        common_vendor.index.showToast({ title: "工单已完成", icon: "success" });
        this.completeRemark = "";
        this.completeImages = [];
        this.loadDetail();
      } catch (error) {
        common_vendor.index.showToast({ title: error.message || "完工提交失败", icon: "none" });
      }
    },
    previewImage(url) {
      common_vendor.index.previewImage({
        urls: this.detail.images.map((item) => `${config_index.API_ORIGIN}${item.imageUrl}`),
        current: `${config_index.API_ORIGIN}${url}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.detail && $data.loading
  }, !$data.detail && $data.loading ? {} : $data.detail ? common_vendor.e({
    c: common_vendor.t($data.detail.title),
    d: common_vendor.t($data.detail.repairCode),
    e: common_vendor.t($data.detail.status),
    f: common_vendor.t($data.detail.regionName),
    g: common_vendor.t($data.detail.location),
    h: common_vendor.t($data.detail.channel),
    i: common_vendor.t($data.detail.reporterName || "系统"),
    j: common_vendor.t($data.detail.maintainerName || "待指派"),
    k: common_vendor.t($data.detail.description),
    l: $data.detail.images && $data.detail.images.length
  }, $data.detail.images && $data.detail.images.length ? {
    m: common_vendor.f($data.detail.images, (item, k0, i0) => {
      return {
        a: item.id,
        b: `${_ctx.API_ORIGIN}${item.imageUrl}`,
        c: common_vendor.o(($event) => $options.previewImage(item.imageUrl), item.id)
      };
    })
  } : {}, {
    n: common_vendor.f($data.detail.logs, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.operatorName || "系统"),
        b: common_vendor.t(item.actionType),
        c: common_vendor.t(item.content),
        d: common_vendor.t(item.createdAt),
        e: item.id
      };
    }),
    o: $data.detail.status === "待派单"
  }, $data.detail.status === "待派单" ? {
    p: common_vendor.o((...args) => $options.handleReceive && $options.handleReceive(...args), "fa")
  } : {}, {
    q: $data.detail.status === "处理中"
  }, $data.detail.status === "处理中" ? common_vendor.e({
    r: $data.completeRemark,
    s: common_vendor.o(($event) => $data.completeRemark = $event.detail.value, "09"),
    t: common_vendor.o((...args) => $options.chooseImages && $options.chooseImages(...args), "c0"),
    v: $data.completeImages.length
  }, $data.completeImages.length ? {
    w: common_vendor.t($data.completeImages.length)
  } : {}, {
    x: common_vendor.o((...args) => $options.handleComplete && $options.handleComplete(...args), "7a")
  }) : {}) : {}, {
    b: $data.detail
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1104d353"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/repair/detail.js.map
