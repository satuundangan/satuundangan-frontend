<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
    <router-link 
      to="/dashboard" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path === '/dashboard' ? 'text-mocha' : 'text-gray-300'"
    >
      <i class="fa-solid fa-house text-lg"></i>
      <span class="text-[9px] font-black uppercase tracking-tighter">Home</span>
    </router-link>

    <router-link 
      to="/invitations" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path.includes('/invitations') ? 'text-mocha' : 'text-gray-300'"
    >
      <i class="fa-solid fa-envelope-open-text text-lg"></i>
      <span class="text-[9px] font-black uppercase tracking-tighter">Invitations</span>
    </router-link>

    <router-link 
      to="/guests" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path.includes('/guests') ? 'text-mocha' : 'text-gray-300'"
    >
      <i class="fa-solid fa-users text-lg"></i>
      <span class="text-[9px] font-black uppercase tracking-tighter">Guests</span>
    </router-link>

    <router-link 
      to="/settings" 
      class="flex flex-col items-center gap-1 transition-colors"
      :class="$route.path.includes('/settings') ? 'text-mocha' : 'text-gray-300'"
    >
      <i class="fa-solid fa-user text-lg"></i>
      <span class="text-[9px] font-black uppercase tracking-tighter">Profile</span>
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
