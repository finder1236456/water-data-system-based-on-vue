const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const getToken = () => localStorage.getItem('water_token') || ''

export const http = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${input}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }))
    throw new Error(error.message || '请求失败')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
