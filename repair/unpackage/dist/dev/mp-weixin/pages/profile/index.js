"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  data() {
    return {
      user: utils_auth.getStoredUser()
    };
  },
  onShow() {
    this.user = utils_auth.getStoredUser();
  },
  methods: {
    logout() {
      utils_auth.clearAuthInfo();
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c;
  return {
    a: common_vendor.t(((_a = $data.user) == null ? void 0 : _a.name) || "-"),
    b: common_vendor.t(((_b = $data.user) == null ? void 0 : _b.username) || "-"),
    c: common_vendor.t(((_c = $data.user) == null ? void 0 : _c.phone) || "-"),
    d: common_vendor.o((...args) => $options.logout && $options.logout(...args), "70")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
