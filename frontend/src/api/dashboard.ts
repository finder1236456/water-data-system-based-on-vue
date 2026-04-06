import { http } from './http'
import type { ScreenData } from '@/views/screen/data'

export const getScreenData = () => http<ScreenData>('/dashboard/screen-data')
