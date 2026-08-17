<template>
  <nav class="md:hidden fixed bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white rounded-2xl px-4 py-2 flex justify-between items-center z-50 shadow-2xl shadow-slate-950/40 select-none">
    <!-- Home -->
    <router-link 
      to="/dashboard" 
      class="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all"
      :class="$route.path === '/dashboard' ? 'text-[#c89f68] font-bold' : 'text-slate-400 hover:text-white'"
    >
      <i class="fa-solid fa-house text-base"></i>
      <span class="text-[9px] font-bold tracking-tight">Beranda</span>
    </router-link>

    <!-- Invitations -->
    <router-link 
      to="/invitations" 
      class="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all"
      :class="$route.path.includes('/invitations') ? 'text-[#c89f68] font-bold' : 'text-slate-400 hover:text-white'"
    >
      <i class="fa-solid fa-envelope-open-text text-base"></i>
      <span class="text-[9px] font-bold tracking-tight">Undangan</span>
    </router-link>

    <!-- Center Floating Action Button (Buat Undangan) -->
    <router-link 
      to="/templates"
      class="-mt-5 w-11 h-11 bg-gradient-to-tr from-[#a47148] to-[#c89f68] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#a47148]/40 active:scale-90 transition-transform border-2 border-slate-900"
      title="Buat Undangan Baru"
    >
      <i class="fa-solid fa-plus text-base"></i>
    </router-link>

    <!-- Guests -->
    <router-link 
      to="/guests" 
      class="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all"
      :class="$route.path.includes('/guests') ? 'text-[#c89f68] font-bold' : 'text-slate-400 hover:text-white'"
    >
      <i class="fa-solid fa-users text-base"></i>
      <span class="text-[9px] font-bold tracking-tight">Tamu</span>
    </router-link>

    <!-- Profile/Settings -->
    <router-link 
      to="/settings" 
      class="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all"
      :class="$route.path.includes('/settings') ? 'text-[#c89f68] font-bold' : 'text-slate-400 hover:text-white'"
    >
      <i class="fa-solid fa-user-gear text-base"></i>
      <span class="text-[9px] font-bold tracking-tight">Akun</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const $route = useRoute()
</script>
