import { BASE_URL } from '../config'
import { getStoredToken, getStoredUser } from './auth'

export const request = ({ url, method = 'GET', data = {} }) =>
  new Promise((resolve, reject) => {
    const user = getStoredUser()
    const token = getStoredToken()

    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(user?.id ? { 'x-user-id': String(user.id) } : {}),
        ...(user?.type ? { 'x-user-role': String(user.type) } : {}),
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }

        reject(new Error(res.data?.message || '请求失败，请稍后重试。'))
      },
      fail: (error) => {
        reject(new Error(error?.errMsg || '网络请求失败，请检查后端服务是否已启动。'))
      },
    })
  })
