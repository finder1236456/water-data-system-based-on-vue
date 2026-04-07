"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  data() {
    return {
      loading: false,
      form: {
        username: "repair001",
        password: "123456"
      }
    };
  },
  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        common_vendor.index.showToast({ title: "请输入账号和密码", icon: "none" });
        return;
      }
      this.loading = true;
      try {
        const result = await api_auth.login(this.form);
        if (result.user.type !== "repair") {
          common_vendor.index.showToast({ title: "仅维修人员可登录小程序", icon: "none" });
          return;
        }
        utils_auth.setAuthInfo(result);
        common_vendor.index.switchTab({
          url: "/pages/workbench/index"
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "登录失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.username,
    b: common_vendor.o(($event) => $data.form.username = $event.detail.value, "06"),
    c: $data.form.password,
    d: common_vendor.o(($event) => $data.form.password = $event.detail.value, "99"),
    e: $data.loading,
    f: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args), "c5")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
