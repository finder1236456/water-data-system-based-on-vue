import { http } from './http'
import type { UserType } from './user'

export type AdminUser = {
  id?: number
  username: string
  name: string
  role: UserType
  password: string
}

export type SystemConfig = {
  waterPrice: number
  baseQuota: number
  warningThreshold: number
  pushStrategy: string
}

type SystemConfigResponse = {
  water_price: number
  base_quota: number
  warning_threshold: number
  push_strategy: string
}

export const getAdminUsers = () => http<AdminUser[]>('/admin/users')

export const createAdminUser = (payload: AdminUser) =>
  http<AdminUser>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const deleteAdminUser = (username: string) =>
  http<void>(`/admin/users/${username}`, {
    method: 'DELETE',
  })

export const getSystemConfig = async (): Promise<SystemConfig> => {
  const data = await http<SystemConfigResponse>('/admin/config')
  return {
    waterPrice: Number(data.water_price),
    baseQuota: data.base_quota,
    warningThreshold: data.warning_threshold,
    pushStrategy: data.push_strategy,
  }
}

export const updateSystemConfig = (payload: SystemConfig) =>
  http<SystemConfig>('/admin/config', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
