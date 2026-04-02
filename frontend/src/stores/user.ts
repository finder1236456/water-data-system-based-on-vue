import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const name = ref('')
  const username = ref('')
  const userType = ref<UserType>('user')

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
  }

  const clearUserInfo = () => {
    token.value = ''
    name.value = ''
    username.value = ''
    userType.value = 'user'
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
