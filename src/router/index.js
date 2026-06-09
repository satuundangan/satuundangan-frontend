import CheckoutPage from '@/views/CheckoutPage.vue'
import CreateDesign from '@/views/CreateDesign.vue'
import CreateForm from '@/views/CreateForm.vue'
import HomeView from '@/views/HomeView.vue'
import Invitation from '@/views/InvitationView.vue'
import PreviewInvitation from '@/views/PreviewInvitation.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { analytics } from '@/api/analytics.js'
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
import AdminTemplates from '@/views/admin/AdminTemplates.vue'
import AdminAudio from '@/views/admin/AdminAudio.vue'
import AdminBanks from '@/views/admin/AdminBanks.vue'
import AdminSections from '@/views/admin/AdminSections.vue'
import AdminCategories from '@/views/admin/AdminCategories.vue'
import AdminPromoCodes from '@/views/admin/AdminPromoCodes.vue'

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
      path: '/create',
      name: 'create',
      component: () => import('@/views/StudioView.vue'),
      meta: { title: 'Studio Editor' },
    },
    {
      path: '/create/form',
      redirect: '/create',
    },
    {
      path: '/invitation/:id/edit',
      name: 'invitation.edit',
      component: () => import('@/views/StudioView.vue'),
      meta: { title: 'Edit Undangan', requiresAuth: true, requiresApproval: true },
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
      path: '/payment/finish',
      name: 'payment-finish',
      component: () => import('@/views/PaymentFinishPage.vue'),
      meta: { title: 'Status Pembayaran' },
    },
    {
      path: '/payment/pending',
      name: 'payment-pending',
      component: () => import('@/views/PaymentFinishPage.vue'),
      meta: { title: 'Status Pembayaran' },
    },
    {
      path: '/payment/error',
      name: 'payment-error',
      component: () => import('@/views/PaymentFinishPage.vue'),
      meta: { title: 'Pembayaran Gagal' },
    },
    {
      path: '/legal-consent',
      name: 'legal-consent',
      component: () => import('@/views/LegalConsent.vue'),
      meta: { title: 'Persetujuan Hukum', requiresAuth: true },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallback.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: { title: 'Reset Password' },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
      meta: { title: 'Syarat & Ketentuan' },
    },
    {
      path: '/syarat-ketentuan',
      redirect: '/terms',
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: { title: 'Kebijakan Privasi' },
    },
    {
      path: '/kebijakan-privasi',
      redirect: '/privacy',
    },
    {
      path: '/tentang-kami',
      name: 'tentang-kami',
      component: () => import('@/views/TentangKamiView.vue'),
      meta: { title: 'Tentang Kami' },
    },
    {
      path: '/affiliate/register',
      name: 'affiliate-register',
      redirect: '/',
      meta: { requiresAuth: true, title: 'Daftar Reseller' },
    },
    {
      path: '/affiliate/dashboard',
      name: 'affiliate-dashboard',
      redirect: '/dashboard',
      meta: { requiresAuth: true, title: 'Dashboard Reseller' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, requiresApproval: true },
    },
    { path: '/invitations', name: 'Invitations', component: InvitationsView, meta: { requiresAuth: true, requiresApproval: true } },
    { path: '/templates', name: 'Templates', component: TemplatesView, meta: { title: 'Katalog Template' } },
    { path: '/guestbook', name: 'Guestbook', component: GuestbookView, meta: { title: 'Buku Tamu', requiresAuth: true, requiresApproval: true } },
    { path: '/settings', name: 'Settings', component: SettingsView, meta: { requiresAuth: true, requiresApproval: true } },
    { path: '/admin/login', name: 'admin-login', component: AdminLogin, meta: { guestOnly: true } },
    {
      path: '/admin/totp/setup',
      name: 'admin-totp-setup',
      component: () => import('@/views/admin/AdminTotpSetup.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Setup Authenticator' },
    },
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
      path: '/admin/invitations/:id/edit',
      name: 'admin-invitation-edit',
      component: () => import('@/views/admin/AdminInvitationEdit.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Edit Undangan' },
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
      path: '/admin/promo-codes',
      name: 'admin-promo-codes',
      component: AdminPromoCodes,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/affiliate/resellers',
      name: 'admin-resellers',
      redirect: '/admin',
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Manajemen Reseller' },
    },
    {
      path: '/admin/affiliate/withdrawals',
      name: 'admin-withdrawals',
      redirect: '/admin',
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Antrean Penarikan' },
    },
    { path: '/guests', name: 'Guests', component: GuestsView },
    {
      path: '/demo/:templateSlug',
      name: 'demo',
      component: Invitation,
    },
    {
      path: '/inv/:slug/:guestSlug',
      name: 'invitation.guest',
      component: Invitation,
    },
    {
      path: '/:slug',
      name: 'invitation',
      component: Invitation,
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

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

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const requiresApproval = to.matched.some((record) => record.meta.requiresApproval)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (requiresAuth && !authStore.user) {
    if (requiresAdmin) {
      next({ name: 'admin-login', query: { redirect: to.fullPath } })
    } else {
      next({ name: 'home', query: { login: 'true', redirect: to.fullPath } })
    }
    return
  }

  // Legal Consent Check
  if (requiresApproval && !authStore.isApproved && to.name !== 'legal-consent') {
    next({ name: 'legal-consent' })
    return
  }

  if (requiresAdmin && !authStore.user?.isAdmin) {
    next({ name: 'admin-login' })
    return
  }

  // Block admin routes if TOTP not yet set up (production only)
  if (import.meta.env.PROD && requiresAdmin && authStore.user?.isAdmin && authStore.user?.totpEnabled === false && to.name !== 'admin-totp-setup') {
    next({ name: 'admin-totp-setup' })
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
    document.title = 'Loading Invitation... | Satu Undangan'
  } else {
    document.title = defaultTitle
  }

  next()
})

router.afterEach((to, from) => {
  const authStore = useAuthStore()

  // Identify user if logged in
  if (authStore.user) {
    analytics.identify(authStore.user.id, {
      $email: authStore.user.email,
      $name: authStore.user.name,
      role: authStore.user.isAdmin ? 'admin' : 'user',
    })
  }

  // Track page view with title and duration tracking
  const pageTitle = to.meta.title || to.name || 'Untitled'
  analytics.startTimer('Time on Page')
  analytics.trackPage(pageTitle, {
    path: to.fullPath,
    name: to.name,
    from_path: from.fullPath,
  })

  // When leaving the page (on the next transition), the 'Time on Page' for the PREVIOUS page should be captured.
  // Note: Mixpanel's time_event works by calling track() later with the same name.
  if (from.name) {
    const prevTitle = from.meta.title || from.name || 'Untitled'
    analytics.stopTimer('Time on Page', {
      page: prevTitle,
      path: from.fullPath,
    })
  }
})

export default router
