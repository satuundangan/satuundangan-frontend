<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        @click="$emit('close')" 
        class="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
      ></div>
    </Transition>

    <aside :class="[
      'bg-white border-r border-stone-200/80 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out w-64 select-none',
      isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'
    ]">
      <!-- Brand Logo Header -->
      <div class="p-5 border-b border-stone-100 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 bg-[#8f5e38] text-white rounded-lg flex items-center justify-center font-serif font-bold text-sm">
            S
          </div>
          <div>
            <span class="font-semibold text-sm text-stone-900 tracking-tight block">SatuUndangan</span>
            <span class="text-[10px] font-medium text-stone-400 block -mt-0.5">Ruang Kerja</span>
          </div>
        </router-link>
        
        <button @click="$emit('close')" class="md:hidden p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Main Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-5 px-3 custom-scrollbar space-y-6">
        <div>
          <span class="px-3 text-[11px] font-medium text-stone-400 block mb-2">Menu</span>
          <ul class="space-y-1">
            <li v-for="item in primaryMenu" :key="item.name">
              <router-link 
                :to="item.to" 
                @click="handleNavClick"
                class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 group relative text-xs font-medium"
                :class="route.path === item.to || (route.path.startsWith(item.to) && item.to !== '/dashboard')
                  ? 'bg-stone-900 text-white font-semibold' 
                  : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'"
              >
                <i :class="['fa-solid', item.icon, 'text-xs w-4 text-center transition-colors', 
                  route.path === item.to || (route.path.startsWith(item.to) && item.to !== '/dashboard') ? 'text-white' : 'text-stone-400 group-hover:text-stone-700']"></i>
                <span>{{ item.name }}</span>
                <span v-if="item.badge" class="ml-auto px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-800">
                  {{ item.badge }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <span class="px-3 text-[11px] font-medium text-stone-400 block mb-2">Akun</span>
          <ul class="space-y-1">
            <li v-for="item in secondaryMenu" :key="item.name">
              <router-link 
                :to="item.to" 
                @click="handleNavClick"
                class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 group relative text-xs font-medium"
                :class="route.path === item.to 
                  ? 'bg-stone-900 text-white font-semibold' 
                  : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'"
              >
                <i :class="['fa-solid', item.icon, 'text-xs w-4 text-center transition-colors', 
                  route.path === item.to ? 'text-white' : 'text-stone-400 group-hover:text-stone-700']"></i>
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- User Profile & Logout Bottom Card -->
      <div class="p-3 border-t border-stone-100 bg-[#FAF8F5]">
        <div class="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between gap-2.5">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-semibold text-xs shrink-0">
              {{ userInitial }}
            </div>
            <div class="min-w-0">
              <span class="text-xs font-semibold text-stone-900 truncate block">{{ userName }}</span>
              <span class="text-[10px] text-stone-400 truncate block">{{ userEmail }}</span>
            </div>
          </div>

          <button 
            @click="handleLogout" 
            class="w-7 h-7 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer" 
            title="Keluar / Logout"
          >
            <i class="fa-solid fa-right-from-bracket text-xs"></i>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const handleNavClick = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    emit('close')
  }
}

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const userName = computed(() => auth.user?.name || 'Pengguna')
const userEmail = computed(() => auth.user?.email || 'user@satuundangan.com')
const userInitial = computed(() => (userName.value || 'U').trim().charAt(0).toUpperCase())

const primaryMenu = [
  { name: 'Dashboard', to: '/dashboard', icon: 'fa-chart-line' },
  { name: 'Undangan Saya', to: '/invitations', icon: 'fa-envelope-open-text' },
  { name: 'Wedding Planner', to: '/planner', icon: 'fa-clipboard-check', badge: 'Free' },
  { name: 'Daftar Tamu', to: '/guests', icon: 'fa-users' },
  { name: 'Buku Tamu', to: '/guestbook', icon: 'fa-book-open' },
  { name: 'Katalog Template', to: '/templates', icon: 'fa-layer-group' },
]

const secondaryMenu = [
  { name: 'Pengaturan Akun', to: '/settings', icon: 'fa-sliders' },
]

async function handleLogout() {
  const result = await Swal.fire({
    title: 'Keluar Akun?',
    text: 'Apakah kamu yakin ingin keluar dari aplikasi?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Ya, Logout',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    auth.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
