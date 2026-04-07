import { request } from '../utils/request'

export const login = (payload) =>
  request({
    url: '/auth/login',
    method: 'POST',
    data: payload,
  })
