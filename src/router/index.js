import CheckoutPage from '@/views/CheckoutPage.vue'
import CreateDesign from '@/views/CreateDesign.vue'
import CreateForm from '@/views/CreateForm.vue'
import HomeView from '@/views/HomeView.vue'
import Invitation from '@/views/InvitationView.vue'
import PreviewInvitation from '@/views/PreviewInvitation.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import InvitationsView from '@/views/dashboard/InvitationsView.vue'
import TemplatesView from '@/views/dashboard/TemplatesView.vue'
import GuestbookView from '@/views/dashboard/GuestbookView.vue'
import SettingsView from '@/views/dashboard/SettingsView.vue'

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
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallback.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    { path: '/invitations', name: 'Invitations', component: InvitationsView },
    { path: '/templates', name: 'Templates', component: TemplatesView },
    { path: '/guestbook', name: 'Guestbook', component: GuestbookView },
    { path: '/settings', name: 'Settings', component: SettingsView },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.user) {
    console.log('Anda harus login untuk mengakses halaman ini.')
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
