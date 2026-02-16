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
import GuestsView from '@/views/dashboard/GuestsView.vue'
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
import AdminCategories from '@/views/admin/AdminCategories.vue'
import AdminPalettes from '@/views/admin/AdminPalettes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' },
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
      meta: { title: 'Pilih Desain' },
    },
    {
      path: '/create/form',
      name: 'create.form',
      component: CreateForm,
    },
    {
      path: '/invitation/:id/edit',
      name: 'invitation.edit',
      component: CreateForm,
      meta: { title: 'Edit Undangan' },
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
      meta: { title: 'Checkout & Pembayaran' },
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
    { path: '/templates', name: 'Templates', component: TemplatesView, meta: { title: 'Katalog Template' } },
    { path: '/guestbook', name: 'Guestbook', component: GuestbookView, meta: { title: 'Buku Tamu' } },
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
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: AdminCategories,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/palettes',
      name: 'admin-palettes',
      component: AdminPalettes,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    { path: '/guests', name: 'Guests', component: GuestsView },
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

  // Update Page Title
  const defaultTitle = 'Satu Undangan - Buat Undangan Digital Pernikahan'
  if (to.meta.title) {
    document.title = `${to.meta.title} | Satu Undangan`
  } else if (to.name === 'invitation') {
    // For dynamic invitation, we let the component handle the specific title,
    // or set a temporary one here.
    document.title = 'Loading Invitation... | Satu Undangan'
  } else {
    document.title = defaultTitle
  }

  next()
})

export default router
