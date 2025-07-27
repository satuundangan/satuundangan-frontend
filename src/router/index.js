import CheckoutPage from '@/views/CheckoutPage.vue'
import CreateDesign from '@/views/CreateDesign.vue'
import CreateForm from '@/views/CreateForm.vue'
import HomeView from '@/views/HomeView.vue'
import Invitation from '@/views/InvitationView.vue'
import PreviewInvitation from '@/views/PreviewInvitation.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:slug',
      name: 'invitation',
      component: Invitation,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateDesign,
    },
    {
      path: '/create/form',
      name: 'create.form',
      component: CreateForm,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewInvitation,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutPage,
    },
    {
      path: '/auth/google/callback',
      name: 'google-callback',
      component: () => import('@/views/AuthCallback.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.user) {
    console.log('Anda harus login untuk mengakses halaman ini.');
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router
