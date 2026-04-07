"use strict";
const utils_request = require("../utils/request.js");
const login = (payload) => utils_request.request({
  url: "/auth/login",
  method: "POST",
  data: payload
});
exports.login = login;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/auth.js.map
