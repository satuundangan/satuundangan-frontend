<template>
  <aside
    class="flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out shrink-0"
    :class="mobile ? 'h-full w-full' : ['h-screen sticky top-0', isCollapsed ? 'w-20' : 'w-72']"
  >
    <div
      class="flex h-16 shrink-0 items-center border-b border-slate-200 px-4"
      :class="isCollapsed ? 'justify-center' : 'justify-between'"
    >
      <RouterLink
        to="/admin"
        aria-label="Dashboard Satu Undangan"
        class="flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        @click="emit('navigate')"
      >
        <img
          src="/logo-admin.jpg"
          alt="Satu Undangan"
          class="object-contain"
          :class="isCollapsed ? 'h-10 w-10' : 'h-12 w-32'"
        />
      </RouterLink>
      <button
        v-if="!mobile && !isCollapsed"
        type="button"
        aria-label="Ciutkan menu admin"
        aria-controls="admin-desktop-navigation-links"
        :aria-expanded="!isCollapsed"
        @click="toggleCollapse"
        class="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <i class="pi pi-chevron-left text-xs" aria-hidden="true"></i>
      </button>
    </div>
    <div v-if="isCollapsed" class="flex justify-center border-b border-slate-50 py-3">
      <button
        type="button"
        aria-label="Perluas menu admin"
        aria-controls="admin-desktop-navigation-links"
        :aria-expanded="!isCollapsed"
        @click="toggleCollapse"
        class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <i class="pi pi-chevron-right text-sm" aria-hidden="true"></i>
      </button>
    </div>
    <nav
      :id="mobile ? 'admin-mobile-navigation-links' : 'admin-desktop-navigation-links'"
      aria-label="Menu admin"
      class="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4 text-sm custom-scrollbar"
    >
      <div v-for="group in visibleGroups" :key="group.label">
        <h2
          :class="
            isCollapsed
              ? 'sr-only'
              : 'mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500'
          "
        >
          {{ group.label }}
        </h2>
        <div class="space-y-1">
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            :aria-label="item.label"
            :aria-current="activeItem?.to === item.to ? 'page' : undefined"
            :title="isCollapsed ? item.label : undefined"
            @click="emit('navigate')"
            class="group relative flex min-h-11 items-center rounded-xl font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            :class="[
              activeItem?.to === item.to
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              isCollapsed ? 'mx-auto h-12 w-12 justify-center' : 'gap-3 px-4 py-3',
            ]"
          >
            <i
              :class="['pi', item.icon, isCollapsed ? 'text-lg' : 'text-base']"
              aria-hidden="true"
            ></i>
            <span v-if="!isCollapsed">{{ item.label }}</span>
          </RouterLink>
        </div>
      </div>
    </nav>
    <div class="mt-auto shrink-0 border-t border-slate-200 bg-slate-50/50 p-4">
      <div class="flex items-center" :class="isCollapsed ? 'flex-col gap-3' : 'gap-3'">
        <img
          class="h-10 w-10 shrink-0 rounded-xl border-2 border-white"
          :src="
            user?.avatar ||
            'https://ui-avatars.com/api/?name=' +
              encodeURIComponent(user?.name || 'Admin') +
              '&background=random'
          "
          alt=""
        />
        <div v-if="!isCollapsed" class="flex min-w-0 flex-col">
          <span class="truncate text-sm font-bold text-slate-800">{{ user?.name || 'Admin' }}</span>
          <span class="truncate text-[11px] text-slate-500">{{ user?.email }}</span>
        </div>
        <button
          type="button"
          title="Logout"
          aria-label="Keluar dari admin"
          @click="handleLogout"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :class="isCollapsed ? '' : 'ml-auto'"
        >
          <i class="pi pi-sign-out text-base" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
export const adminNavigationGroups = [
  {
    label: 'Operasional',
    items: [
      { label: 'Dashboard', to: '/admin', icon: 'pi-home' },
      { label: 'Users', to: '/admin/users', icon: 'pi-users' },
      { label: 'Invitations', to: '/admin/invitations', icon: 'pi-envelope' },
      { label: 'Pembayaran & Transaksi', to: '/admin/payments', icon: 'pi-receipt' },
    ],
  },
  {
    label: 'Analitik',
    items: [{ label: 'Analytics & Funnel', to: '/admin/analytics', icon: 'pi-chart-line' }],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Promo Code', to: '/admin/promo-codes', icon: 'pi-percentage' },
      { label: 'Reseller', to: '/admin/affiliate/resellers', icon: 'pi-users' },
      { label: 'Ledger Komisi', to: '/admin/affiliate/commissions', icon: 'pi-book' },
      { label: 'Penarikan Reseller', to: '/admin/affiliate/withdrawals', icon: 'pi-wallet' },
      { label: 'Aturan & Scheduler Afiliasi', to: '/admin/affiliate/operations', icon: 'pi-cog' },
      { label: 'WhatsApp Bot', to: '/admin/whatsapp-bot', icon: 'pi-whatsapp' },
      { label: 'Social Studio (IG)', to: '/admin/social-studio', icon: 'pi-camera' },
    ],
  },
  {
    label: 'Konten',
    items: [
      { label: 'Template Designs', to: '/admin/templates', icon: 'pi-palette' },
      { label: 'Master Kategori', to: '/admin/categories', icon: 'pi-tags' },
      { label: 'Master Fitur (Sections)', to: '/admin/sections', icon: 'pi-list' },
      { label: 'Audio & Musik', to: '/admin/audio', icon: 'pi-volume-up' },
      { label: 'Artikel & Blog', to: '/admin/articles', icon: 'pi-file-edit' },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { label: 'Master Bank & E-wallet', to: '/admin/banks', icon: 'pi-credit-card' },
      { label: 'Activity & Error Logs', to: '/admin/logs', icon: 'pi-history' },
      { label: 'Sistem & Audit', to: '/admin/system', icon: 'pi-shield' },
      { label: 'Keamanan Akun', to: '/admin/security', icon: 'pi-lock' },
    ],
  },
]

export function findAdminNavigationItem(path) {
  return adminNavigationGroups
    .flatMap((group) => group.items)
    .filter((item) => path === item.to || (item.to !== '/admin' && path.startsWith(item.to + '/')))
    .sort((first, second) => second.to.length - first.to.length)[0]
}
</script>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { filterNavigationGroups } from '@/utils/adminAccess'
import Swal from 'sweetalert2'

const props = defineProps({ mobile: { type: Boolean, default: false } })
const emit = defineEmits(['navigate'])
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const visibleGroups = computed(() =>
  // Menu hides what the role cannot use; unknown access hides nothing (the server still enforces).
  filterNavigationGroups(adminNavigationGroups, authStore.adminAccess),
)
const desktopCollapsed = ref(localStorage.getItem('admin_sidebar_collapsed') === 'true')
const isCollapsed = computed(() => !props.mobile && desktopCollapsed.value)
const activeItem = computed(() => findAdminNavigationItem(route.path))
const user = computed(() => authStore.user)

function toggleCollapse() {
  desktopCollapsed.value = !desktopCollapsed.value
  localStorage.setItem('admin_sidebar_collapsed', String(desktopCollapsed.value))
}

async function handleLogout() {
  emit('navigate')
  // Close the drawer before SweetAlert owns focus and body scrolling.
  await nextTick()
  const result = await Swal.fire({
    title: 'Keluar dari Admin?',
    text: 'Sesi admin Anda akan diakhiri.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal',
    focusCancel: true,
  })
  if (result.isConfirmed) {
    authStore.logout()
    router.push('/admin/login')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
