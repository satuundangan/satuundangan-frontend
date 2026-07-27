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
      'bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out w-64 select-none',
      isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'
    ]">
      <!-- Brand Logo Header -->
      <div class="p-5 border-b border-slate-100/80 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <span class="font-black text-sm text-slate-900 tracking-tight block">SatuUndangan</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block -mt-0.5">User Portal</span>
          </div>
        </router-link>
        
        <button @click="$emit('close')" class="md:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Main Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-5 px-3 custom-scrollbar space-y-6">
        <div>
          <span class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Navigasi Utama</span>
          <ul class="space-y-1">
            <li v-for="item in primaryMenu" :key="item.name">
              <router-link 
                :to="item.to" 
                @click="$emit('close')"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative text-xs font-semibold"
                :class="$route.path === item.to || ($route.path.startsWith(item.to) && item.to !== '/dashboard')
                  ? 'bg-slate-900 text-white font-bold shadow-md shadow-slate-900/10' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
              >
                <i :class="['fa-solid', item.icon, 'text-sm w-5 transition-transform duration-200 group-hover:scale-110', 
                  $route.path === item.to || ($route.path.startsWith(item.to) && item.to !== '/dashboard') ? 'text-white' : 'text-slate-400 group-hover:text-slate-900']"></i>
                <span>{{ item.name }}</span>
                <span v-if="item.badge" class="ml-auto px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-blue-100 text-blue-600">
                  {{ item.badge }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <span class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Akun & Pengaturan</span>
          <ul class="space-y-1">
            <li v-for="item in secondaryMenu" :key="item.name">
              <router-link 
                :to="item.to" 
                @click="$emit('close')"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative text-xs font-semibold"
                :class="$route.path === item.to 
                  ? 'bg-slate-900 text-white font-bold shadow-md shadow-slate-900/10' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
              >
                <i :class="['fa-solid', item.icon, 'text-sm w-5 transition-transform duration-200 group-hover:scale-110', 
                  $route.path === item.to ? 'text-white' : 'text-slate-400 group-hover:text-slate-900']"></i>
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- User Profile & Logout Bottom Card -->
      <div class="p-3 border-t border-slate-100 bg-slate-50/50">
        <div class="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {{ userInitial }}
            </div>
            <div class="min-w-0">
              <span class="text-xs font-bold text-slate-900 truncate block">{{ userName }}</span>
              <span class="text-[9px] text-slate-400 truncate block">{{ userEmail }}</span>
            </div>
          </div>

          <button 
            @click="handleLogout" 
            class="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0" 
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

defineEmits(['close'])

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const userName = computed(() => auth.user?.name || 'Pengguna')
const userEmail = computed(() => auth.user?.email || 'user@satuundangan.com')
const userInitial = computed(() => (userName.value || 'U').trim().charAt(0).toUpperCase())

const primaryMenu = [
  { name: 'Dashboard', to: '/dashboard', icon: 'fa-chart-line' },
  { name: 'Undangan Saya', to: '/invitations', icon: 'fa-envelope-open-text' },
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
