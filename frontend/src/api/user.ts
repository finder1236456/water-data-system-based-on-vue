import { http } from './http'

export type LoginParams = {
  username: string
  password: string
}

export type UserType = 'user' | 'admin' | 'repair'

type LoginResponse = {
  token: string
  user: {
    id: number | string
    username: string
    name: string
    type: UserType
  }
}

export const getTargetRouteByUserType = (userType: UserType) => {
  const routeMap: Record<UserType, string> = {
    user: '/screen/user',
    admin: '/admin',
    repair: '/screen/repair',
  }

  return routeMap[userType]
}

export const login = (params: LoginParams) =>
  http<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  })

export const getMockAccounts = () => [
  { username: 'user001', password: '123456', name: '普通用户' },
  { username: 'admin001', password: '123456', name: '系统管理员' },
  { username: 'repair001', password: '123456', name: '维修人员' },
]
