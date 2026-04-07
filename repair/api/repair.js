import { request } from '../utils/request'

export const getRepairRegions = () =>
  request({
    url: '/repairs/regions',
  })

export const getRepairList = (params = {}) =>
  request({
    url: `/repairs?mine=${params.mine ? 'true' : 'false'}${params.status ? `&status=${encodeURIComponent(params.status)}` : ''}`,
  })

export const getRepairDetail = (id) =>
  request({
    url: `/repairs/${id}`,
  })

export const createRepair = (payload) =>
  request({
    url: '/repairs',
    method: 'POST',
    data: payload,
  })

export const receiveRepair = (id) =>
  request({
    url: `/repairs/${id}/receive`,
    method: 'PUT',
  })

export const completeRepair = (id, payload) =>
  request({
    url: `/repairs/${id}/complete`,
    method: 'PUT',
    data: payload,
  })
