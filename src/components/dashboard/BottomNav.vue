<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
    <router-link 
      to="/dashboard" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path === '/dashboard' ? 'text-mocha' : 'text-gray-400'"
    >
      <i class="fa-solid fa-house text-lg"></i>
      <span class="text-[10px] font-bold tracking-tight">Home</span>
    </router-link>

    <router-link 
      to="/invitations" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path.includes('/invitations') ? 'text-mocha' : 'text-gray-400'"
    >
      <i class="fa-solid fa-envelope-open-text text-lg"></i>
      <span class="text-[10px] font-bold tracking-tight">Undangan</span>
    </router-link>

    <router-link 
      to="/guests" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path.includes('/guests') ? 'text-mocha' : 'text-gray-400'"
    >
      <i class="fa-solid fa-users text-lg"></i>
      <span class="text-[10px] font-bold tracking-tight">Tamu</span>
    </router-link>

    <router-link 
      to="/settings" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path.includes('/settings') ? 'text-mocha' : 'text-gray-400'"
    >
      <i class="fa-solid fa-user text-lg"></i>
      <span class="text-[10px] font-bold tracking-tight">Akun</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';

const $route = useRoute();
</script>

<style scoped>
/* Menghapus @apply karena konflik dengan Tailwind v4 di scoped CSS */
</style>
