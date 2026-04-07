"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_auth = require("./utils/auth.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/workbench/index.js";
  "./pages/repair/detail.js";
  "./pages/repair/report.js";
  "./pages/profile/index.js";
}
const _sfc_main = {
  onLaunch() {
    const user = utils_auth.getStoredUser();
    if (!user) {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
