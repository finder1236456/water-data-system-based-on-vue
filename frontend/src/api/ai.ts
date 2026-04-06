import { http } from './http'

export type AiMessage = {
  role: 'user' | 'assistant'
  content: string
}

export const chatWithAi = (payload: { message: string; history: AiMessage[] }) =>
  http<{ content: string }>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
