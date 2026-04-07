const TOKEN_KEY = 'repair_token'
const USER_KEY = 'repair_user'

export const getStoredToken = () => uni.getStorageSync(TOKEN_KEY) || ''

export const getStoredUser = () => {
  const user = uni.getStorageSync(USER_KEY)
  return user || null
}

export const setAuthInfo = ({ token, user }) => {
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(USER_KEY, user)
}

export const clearAuthInfo = () => {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(USER_KEY)
}
