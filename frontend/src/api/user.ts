import { http } from './http'

export type LoginParams = {
  username: string
  password: string
}

export type UserType = 'user' | 'admin' | 'repair'

type MockAccount = {
  username: string
  password: string
  name: string
  type: UserType
}

type LoginResponse = {
  token: string
  user: {
    id: number | string
    username: string
    name: string
    type: UserType
  }
}

const mockAccounts: MockAccount[] = [
  { username: 'user001', password: '123456', name: '普通用户', type: 'user' },
  { username: 'admin001', password: '123456', name: '系统管理员', type: 'admin' },
  { username: 'repair001', password: '123456', name: '维修人员', type: 'repair' },
]

export const getTargetRouteByUserType = (userType: UserType) => {
  const routeMap: Record<UserType, string> = {
    user: '/screen/user',
    admin: '/admin',
    repair: '/screen/repair',
  }

  return routeMap[userType]
}

export const login = async (params: LoginParams) => {
  try {
    return await http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  } catch {
    const account = mockAccounts.find(
      (item) => item.username === params.username && item.password === params.password,
    )

    if (!account) {
      throw new Error('账号或密码错误，请重新输入。')
    }

    return {
      token: `mock-token-${account.type}`,
      user: {
        id: account.username,
        name: account.name,
        username: account.username,
        type: account.type,
      },
    }
  }
}

export const getMockAccounts = () => mockAccounts
