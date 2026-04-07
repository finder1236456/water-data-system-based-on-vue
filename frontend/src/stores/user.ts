import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType } from '@/api/user'

const TOKEN_KEY = 'water_token'
const NAME_KEY = 'water_name'
const USERNAME_KEY = 'water_username'
const USER_TYPE_KEY = 'water_user_type'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const name = ref(localStorage.getItem(NAME_KEY) || '')
  const username = ref(localStorage.getItem(USERNAME_KEY) || '')
  const userType = ref<UserType>((localStorage.getItem(USER_TYPE_KEY) as UserType) || 'user')

  const isLoggedIn = computed(() => Boolean(token.value))

  const setUserInfo = (payload: {
    token: string
    name: string
    username: string
    userType: UserType
  }) => {
    token.value = payload.token
    name.value = payload.name
    username.value = payload.username
    userType.value = payload.userType

    localStorage.setItem(TOKEN_KEY, payload.token)
    localStorage.setItem(NAME_KEY, payload.name)
    localStorage.setItem(USERNAME_KEY, payload.username)
    localStorage.setItem(USER_TYPE_KEY, payload.userType)
  }

  const clearUserInfo = () => {
    token.value = ''
    name.value = ''
    username.value = ''
    userType.value = 'user'

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(NAME_KEY)
    localStorage.removeItem(USERNAME_KEY)
    localStorage.removeItem(USER_TYPE_KEY)
  }

  return {
    token,
    name,
    username,
    userType,
    isLoggedIn,
    setUserInfo,
    clearUserInfo,
  }
})
