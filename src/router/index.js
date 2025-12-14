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
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminUsers from '@/views/admin/AdminUsers.vue'
import AdminInvitations from '@/views/admin/AdminInvitations.vue'
import AdminGuests from '@/views/admin/AdminGuests.vue'
import AdminGuestMessages from '@/views/admin/AdminGuestMessages.vue'
import AdminTemplates from '@/views/admin/AdminTemplates.vue'
import AdminAudio from '@/views/admin/AdminAudio.vue'
import AdminBanks from '@/views/admin/AdminBanks.vue'
import AdminSections from '@/views/admin/AdminSections.vue'

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
    { path: '/admin/login', name: 'admin-login', component: AdminLogin, meta: { guestOnly: true } },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsers,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/invitations',
      name: 'admin-invitations',
      component: AdminInvitations,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/guests',
      name: 'admin-guests',
      component: AdminGuests,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/guest-messages',
      name: 'admin-guest-messages',
      component: AdminGuestMessages,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/templates',
      name: 'admin-templates',
      component: AdminTemplates,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/audio',
      name: 'admin-audio',
      component: AdminAudio,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/banks',
      name: 'admin-banks',
      component: AdminBanks,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/sections',
      name: 'admin-sections',
      component: AdminSections,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (!authStore.user && !authStore.token && localStorage.getItem('token')) {
    authStore.token = localStorage.getItem('token')
  }

  if (!authStore.user && authStore.token) {
    try {
      await authStore.fetchProfile()
    } catch (error) {
      console.error('Gagal memuat profil, logout otomatis', error)
      authStore.logout()
    }
  }

  if (requiresAuth && !authStore.user) {
    if (requiresAdmin) {
      next({ name: 'admin-login', query: { redirect: to.fullPath } })
    } else {
      next({ name: 'home' })
    }
    return
  }

  if (requiresAdmin && !authStore.user?.isAdmin) {
    next({ name: 'admin-login' })
    return
  }

  if (guestOnly && authStore.user?.isAdmin) {
    next({ name: 'admin-dashboard' })
    return
  }

  next()
})

export default router
