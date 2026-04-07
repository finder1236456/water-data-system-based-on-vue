import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
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
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.name === 'login' && userStore.isLoggedIn) {
    return userStore.userType === 'admin' ? '/admin' : `/screen/${userStore.userType}`
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return '/login'
  }

  if (to.meta.requiresRole && userStore.userType !== to.meta.requiresRole) {
    return '/login'
  }

  return true
})

export default router
