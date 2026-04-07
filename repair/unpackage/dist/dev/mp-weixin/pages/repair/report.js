"use strict";
const common_vendor = require("../../common/vendor.js");
const api_repair = require("../../api/repair.js");
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
      regions: [],
      regionIndex: 0,
      form: {
        title: "",
        regionId: "",
        location: "",
        description: ""
      },
      images: [],
      submitting: false
    };
  },
  async onShow() {
    if (!this.regions.length) {
      await this.loadRegions();
    }
  },
  methods: {
    async loadRegions() {
      try {
        this.regions = await api_repair.getRepairRegions();
        if (this.regions.length) {
          this.form.regionId = this.regions[0].id;
        }
      } catch (error) {
        common_vendor.index.showToast({ title: error.message || "区域加载失败", icon: "none" });
      }
    },
    onRegionChange(event) {
      var _a;
      const value = Number(event.detail.value);
      this.regionIndex = value;
      this.form.regionId = ((_a = this.regions[value]) == null ? void 0 : _a.id) || "";
    },
    chooseImages() {
      common_vendor.index.chooseImage({
        count: 3,
        success: (res) => {
          this.images = res.tempFilePaths;
        }
      });
    },
    async handleSubmit() {
      if (!this.form.title || !this.form.regionId || !this.form.location || !this.form.description) {
        common_vendor.index.showToast({ title: "请完整填写信息", icon: "none" });
        return;
      }
      this.submitting = true;
      try {
        const images = [];
        for (const item of this.images) {
          const base64 = await readFileAsBase64(item);
          if (base64) {
            images.push(base64);
          }
        }
        await api_repair.createRepair({
          ...this.form,
          images,
          source: "UniApp"
        });
        common_vendor.index.showToast({ title: "上报成功", icon: "success" });
        this.form.title = "";
        this.form.location = "";
        this.form.description = "";
        this.images = [];
        common_vendor.index.switchTab({
          url: "/pages/workbench/index"
        });
      } catch (error) {
        common_vendor.index.showToast({ title: error.message || "上报失败", icon: "none" });
      } finally {
        this.submitting = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return common_vendor.e({
    a: $data.form.title,
    b: common_vendor.o(($event) => $data.form.title = $event.detail.value, "d6"),
    c: common_vendor.t(((_a = $data.regions[$data.regionIndex]) == null ? void 0 : _a.name) || "请选择单元"),
    d: $data.regions,
    e: $data.regionIndex,
    f: common_vendor.o((...args) => $options.onRegionChange && $options.onRegionChange(...args), "ce"),
    g: $data.form.location,
    h: common_vendor.o(($event) => $data.form.location = $event.detail.value, "70"),
    i: $data.form.description,
    j: common_vendor.o(($event) => $data.form.description = $event.detail.value, "04"),
    k: common_vendor.o((...args) => $options.chooseImages && $options.chooseImages(...args), "7f"),
    l: $data.images.length
  }, $data.images.length ? {
    m: common_vendor.t($data.images.length)
  } : {}, {
    n: $data.submitting,
    o: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args), "f0")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d0b6a772"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/repair/report.js.map
