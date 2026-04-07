"use strict";
const common_vendor = require("../../common/vendor.js");
const api_repair = require("../../api/repair.js");
const tabs = ["全部", "待派单", "处理中", "待复核", "已完成"];
const _sfc_main = {
  data() {
    return {
      tabs,
      activeTab: "全部",
      loading: false,
      list: []
    };
  },
  onShow() {
    this.loadList();
  },
  methods: {
    async loadList() {
      this.loading = true;
      try {
        const status = this.activeTab === "全部" ? "" : this.activeTab;
        this.list = await api_repair.getRepairList({ status });
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "工单加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    switchTab(tab) {
      if (this.activeTab === tab) {
        return;
      }
      this.activeTab = tab;
      this.loadList();
    },
    openDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/repair/detail?id=${item.id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, k0, i0) => {
      return {
        a: common_vendor.t(tab),
        b: tab,
        c: $data.activeTab === tab ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(tab), tab)
      };
    }),
    b: $data.loading
  }, $data.loading ? {} : !$data.list.length ? {} : {
    d: common_vendor.f($data.list, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.status),
        c: common_vendor.t(item.repairCode),
        d: common_vendor.t(item.location),
        e: common_vendor.t(item.regionName),
        f: common_vendor.t(item.channel),
        g: item.id,
        h: common_vendor.o(($event) => $options.openDetail(item), item.id)
      };
    })
  }, {
    c: !$data.list.length
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a1a17f19"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/workbench/index.js.map
