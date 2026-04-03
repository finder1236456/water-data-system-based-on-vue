import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '@/views/admin/AdminView.vue'
import LoginView from '@/views/login/LoginView.vue'
import ScreenView from '@/views/screen/index.vue'

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
      redirect: '/screen/user',
    },
    {
      path: '/screen/:role(user|repair)',
      name: 'role-screen',
      component: ScreenView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
  ],
})

export default router
