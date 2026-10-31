import CheckoutPage from '@/views/CheckoutPage.vue'
import CreateDesign from '@/views/CreateDesign.vue'
import CreateForm from '@/views/CreateForm.vue'
import HomeView from '@/views/HomeView.vue'
import Invitation from '@/views/InvitationView.vue'
import PreviewInvitation from '@/views/PreviewInvitation.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { getCustomSubdomain } from '@/api/invitation'
import { analytics } from '@/api/analytics.js'
import { trackPageView, trackError } from '@/utils/telemetry.js'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import InvitationsView from '@/views/dashboard/InvitationsView.vue'
import TemplatesView from '@/views/dashboard/TemplatesView.vue'
import GuestsView from '@/views/dashboard/GuestsView.vue'
import GuestbookView from '@/views/dashboard/GuestbookView.vue'
import SettingsView from '@/views/dashboard/SettingsView.vue'
import AdminLogin from '@/views/admin/AdminLogin.vue'
import { canOpenAdminPath } from '@/utils/adminAccess'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminUsers from '@/views/admin/AdminUsers.vue'
import AdminInvitations from '@/views/admin/AdminInvitations.vue'
import AdminTemplates from '@/views/admin/AdminTemplates.vue'
import AdminPaletteColors from '@/views/admin/AdminPaletteColors.vue'
import AdminAudio from '@/views/admin/AdminAudio.vue'
import AdminBanks from '@/views/admin/AdminBanks.vue'
import AdminSections from '@/views/admin/AdminSections.vue'
import AdminCategories from '@/views/admin/AdminCategories.vue'
import AdminPromoCodes from '@/views/admin/AdminPromoCodes.vue'
import PantauAnakKrakatau from '@/views/PantauAnakKrakatau.vue'

// Host-based routing: on a custom subdomain (e.g. rina-budi.satuundangan.id),
// the root path serves that invitation instead of the marketing homepage.
const customSubdomain = getCustomSubdomain()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    customSubdomain
      ? {
          path: '/',
          name: 'invitation',
          component: Invitation,
          props: { subdomainMode: true },
          meta: { title: 'Undangan' },
        }
      : {
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
      path: '/pantau-anak-krakatau',
      name: 'pantau-anak-krakatau',
      component: PantauAnakKrakatau,
      meta: { title: 'Pantau Anak Krakatau' },
    },
    {
      path: '/smoke-studio',
      name: 'smoke-studio',
      component: () => import('@/views/SmokeStudioView.vue'),
      meta: { title: 'Studio Kabut' },
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
    {
      path: '/invitations',
      name: 'Invitations',
      component: InvitationsView,
      meta: { requiresAuth: true, requiresApproval: true },
    },
    {
      path: '/planner',
      name: 'WeddingPlanner',
      component: () => import('@/views/dashboard/WeddingPlannerView.vue'),
      meta: { title: 'Wedding Planner', requiresAuth: true, requiresApproval: true },
    },
    {
      path: '/wedding-planner',
      name: 'WeddingPlannerPublic',
      component: () => import('@/views/WeddingPlannerPublicView.vue'),
      meta: { title: 'Free Wedding Planner & Kalkulator Budget' },
    },
    {
      path: '/tools/love-calculator',
      alias: ['/kalkulator-cinta', '/kalkulator-weton'],
      name: 'LoveCalculator',
      component: () => import('@/views/tools/LoveCalculatorView.vue'),
      meta: { title: 'Kalkulator Kecocokan Cinta & Weton Jodoh Jawa Modern' },
    },
    {
      path: '/templates',
      name: 'Templates',
      component: TemplatesView,
      meta: { title: 'Katalog Template' },
    },
    {
      path: '/guestbook',
      name: 'Guestbook',
      component: GuestbookView,
      meta: { title: 'Buku Tamu', requiresAuth: true, requiresApproval: true },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: { requiresAuth: true, requiresApproval: true },
    },
    { path: '/admin/login', name: 'admin-login', component: AdminLogin, meta: { guestOnly: true } },
    {
      path: '/admin/totp/setup',
      name: 'admin-totp-setup',
      redirect: '/admin/security',
    },
    {
      path: '/blog',
      name: 'blog-list',
      component: () => import('@/views/BlogList.vue'),
      meta: { title: 'Blog & Artikel' },
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('@/views/BlogDetail.vue'),
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
      path: '/admin/payments',
      name: 'admin-payments',
      component: () => import('@/views/admin/AdminPayments.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Pembayaran & Transaksi' },
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
      path: '/admin/palettes',
      name: 'admin-palettes',
      component: AdminPaletteColors,
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Master Palet' },
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
      component: () => import('@/views/admin/AdminResellers.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Manajemen Reseller' },
    },
    {
      path: '/admin/affiliate/withdrawals',
      name: 'admin-withdrawals',
      component: () => import('@/views/admin/AdminWithdrawals.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Antrean Penarikan' },
    },
    {
      path: '/admin/affiliate/commissions',
      name: 'admin-affiliate-commissions',
      component: () => import('@/views/admin/AdminAffiliateCommissions.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Ledger Komisi Reseller' },
    },
    {
      path: '/admin/affiliate/operations',
      name: 'admin-affiliate-operations',
      component: () => import('@/views/admin/AdminAffiliateOperations.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Aturan & Scheduler Afiliasi' },
    },
    {
      path: '/admin/articles',
      name: 'admin-articles',
      component: () => import('@/views/admin/AdminArticles.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Artikel & Blog' },
    },
    {
      path: '/admin/articles/create',
      name: 'admin-article-create',
      component: () => import('@/views/admin/AdminArticleEditor.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Tulis Artikel' },
    },
    {
      path: '/admin/articles/:id/edit',
      name: 'admin-article-edit',
      component: () => import('@/views/admin/AdminArticleEditor.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Edit Artikel' },
    },
    {
      path: '/admin/whatsapp-bot',
      name: 'admin-whatsapp-bot',
      component: () => import('@/views/admin/AdminWhatsappBot.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'WhatsApp Bot' },
    },
    {
      path: '/admin/social-studio',
      alias: ['/tools/social-studio', '/social-studio', '/ig-studio'],
      name: 'admin-social-studio',
      component: () => import('@/views/admin/SocialStudioView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Social Media Studio' },
    },
    {
      path: '/admin/analytics',
      name: 'admin-analytics',
      component: () => import('@/views/admin/AdminAnalytics.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Analytics & Funnel' },
    },
    {
      path: '/admin/system',
      name: 'admin-system',
      component: () => import('@/views/admin/AdminSystem.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Sistem & Audit' },
    },
    {
      path: '/admin/security',
      name: 'admin-security',
      component: () => import('@/views/admin/AdminSecurity.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Keamanan Akun' },
    },
    {
      path: '/admin/logs',
      name: 'admin-logs',
      component: () => import('@/views/admin/AdminLogs.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Activity & Error Logs' },
    },
    { path: '/guests', name: 'Guests', component: GuestsView },
    {
      path: '/tema',
      redirect: '/templates',
    },
    {
      path: '/tema/:slug',
      name: 'theme-category',
      component: () => import('@/views/seo/ThemeCategoryView.vue'),
    },
    {
      path: '/demo/:templateSlug',
      name: 'demo',
      component: Invitation,
    },
    {
      path: '/inv/:slug',
      name: 'invitation.owner',
      component: Invitation,
      meta: { title: 'Undangan' },
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

  if (requiresAdmin) {
    // The server enforces roles; this only keeps an admin off pages they cannot use.
    const access = await authStore.loadAdminAccess()
    if (!canOpenAdminPath(access, to.path)) {
      next({ name: 'admin-dashboard' })
      return
    }
  }

  // Block admin routes if TOTP not yet set up (temporarily disabled)
  // if (import.meta.env.VITE_ADMIN_TOTP_ENABLED === 'true' && requiresAdmin && authStore.user?.isAdmin && authStore.user?.totpEnabled === false && to.name !== 'admin-totp-setup') {
  //   next({ name: 'admin-totp-setup' })
  //   return
  // }

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
  } else if (to.name === 'theme-category') {
    // Dynamic meta title set by ThemeCategoryView based on theme slug
  } else {
    document.title = defaultTitle
  }

  next()
})

router.afterEach((to, from, failure) => {
  if (failure) return
  const authStore = useAuthStore()
  const context = analytics.trackNavigation(to, from, {
    userId: authStore.user?.id,
    isAdmin: authStore.user?.isAdmin,
  })
  // Internal page telemetry receives the same safe route identity, not tokens or
  // recipient names from fullPath. Sensitive admin/test navigation is excluded.
  if (!authStore.user?.isAdmin && !['admin', 'test'].includes(context.site_area)) {
    trackPageView(context.path, context.page_type, { site_area: context.site_area })
  }
})

// Handle stale asset/chunk errors after new deployments
router.onError((error) => {
  trackError(error, { source: 'router.onError' })
  const isChunkError =
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.message?.includes('Importing a module script failed') ||
    error.message?.includes('Expected a JavaScript') ||
    error.name === 'ChunkLoadError'

  if (isChunkError) {
    console.warn('New deployment detected or stale chunk error. Reloading page...')
    window.location.reload()
  }
})

export default router
