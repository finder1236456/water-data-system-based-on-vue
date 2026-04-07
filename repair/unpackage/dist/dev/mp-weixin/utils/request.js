"use strict";
const common_vendor = require("../common/vendor.js");
const config_index = require("../config/index.js");
const request = ({ url, method = "GET", data = {} }) => new Promise((resolve, reject) => {
  const token = common_vendor.index.getStorageSync("repair_token") || "";
  common_vendor.index.request({
    url: `${config_index.BASE_URL}${url}`,
    method,
    data,
    header: {
      "Content-Type": "application/json",
      ...token ? { Authorization: `Bearer ${token}` } : {}
    },
    success: (res) => {
      var _a;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(res.data);
        return;
      }
      reject(new Error(((_a = res.data) == null ? void 0 : _a.message) || "请求失败，请稍后重试。"));
    },
    fail: (error) => {
      reject(new Error((error == null ? void 0 : error.errMsg) || "网络请求失败，请检查后端服务是否已启动。"));
    }
  });
});
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
