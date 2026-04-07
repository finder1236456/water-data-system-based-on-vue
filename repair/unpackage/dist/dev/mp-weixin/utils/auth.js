"use strict";
const common_vendor = require("../common/vendor.js");
const TOKEN_KEY = "repair_token";
const USER_KEY = "repair_user";
const getStoredToken = () => common_vendor.index.getStorageSync(TOKEN_KEY) || "";
const getStoredUser = () => {
  const user = common_vendor.index.getStorageSync(USER_KEY);
  return user || null;
};
const setAuthInfo = ({ token, user }) => {
  common_vendor.index.setStorageSync(TOKEN_KEY, token);
  common_vendor.index.setStorageSync(USER_KEY, user);
};
const clearAuthInfo = () => {
  common_vendor.index.removeStorageSync(TOKEN_KEY);
  common_vendor.index.removeStorageSync(USER_KEY);
};
exports.clearAuthInfo = clearAuthInfo;
exports.getStoredToken = getStoredToken;
exports.getStoredUser = getStoredUser;
exports.setAuthInfo = setAuthInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
