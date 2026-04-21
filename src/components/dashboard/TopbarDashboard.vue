<template>
  <header class="flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3 md:py-4 sticky top-0 z-40">
    <div class="flex items-center gap-3">
      <!-- Tombol Hamburger disembunyikan di mobile karena sudah ada BottomNav -->
      <button @click="$emit('toggleSidebar')" class="hidden md:flex p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
        <i class="fa-solid fa-bars-staggered text-lg"></i>
      </button>
      <h1 class="text-lg md:text-2xl font-serif font-bold text-dark truncate">{{ title }}</h1>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Tombol 'Buat' ringkas untuk desktop/tablet -->
      <router-link v-if="showButton" to="/create" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-mocha text-white rounded-xl shadow-lg shadow-mocha/10 hover:bg-dark transition-all text-xs font-bold">
        <i class="fa-solid fa-plus text-[10px]"></i> Baru
      </router-link>
      
      <!-- Avatar/Initial -->
      <div class="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-mocha/10 text-mocha border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold">
        {{ userInitial }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  title: { type: String, required: true },
  showButton: { type: Boolean, default: false },
});

defineEmits(['toggleSidebar']);

const auth = useAuthStore();
const userInitial = computed(() => (auth.user?.name || 'U').trim().charAt(0).toUpperCase());
</script>

