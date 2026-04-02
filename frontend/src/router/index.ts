import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/LoginView.vue'
import ScreenView from '@/views/screen/index.vue'
import RolePlaceholderView from '@/views/screen/RolePlaceholderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/screen',
      name: 'screen',
      component: ScreenView,
    },
    {
      path: '/screen/:role(user|admin|repair)',
      name: 'role-screen',
      component: RolePlaceholderView,
    },
  ],
})

export default router
