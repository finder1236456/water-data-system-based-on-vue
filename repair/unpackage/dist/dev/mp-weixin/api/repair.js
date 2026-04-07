"use strict";
const utils_request = require("../utils/request.js");
const getRepairRegions = () => utils_request.request({
  url: "/repairs/regions"
});
const getRepairList = (params = {}) => utils_request.request({
  url: `/repairs?mine=${params.mine ? "true" : "false"}${params.status ? `&status=${encodeURIComponent(params.status)}` : ""}`
});
const getRepairDetail = (id) => utils_request.request({
  url: `/repairs/${id}`
});
const createRepair = (payload) => utils_request.request({
  url: "/repairs",
  method: "POST",
  data: payload
});
const receiveRepair = (id) => utils_request.request({
  url: `/repairs/${id}/receive`,
  method: "PUT"
});
const completeRepair = (id, payload) => utils_request.request({
  url: `/repairs/${id}/complete`,
  method: "PUT",
  data: payload
});
exports.completeRepair = completeRepair;
exports.createRepair = createRepair;
exports.getRepairDetail = getRepairDetail;
exports.getRepairList = getRepairList;
exports.getRepairRegions = getRepairRegions;
exports.receiveRepair = receiveRepair;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/repair.js.map
