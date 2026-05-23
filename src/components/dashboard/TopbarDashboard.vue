<template>
  <header class="flex items-center justify-between bg-white px-4 md:px-8 py-3 md:py-4 sticky top-0 z-40 border-b border-gray-50">
    <div class="flex items-center gap-3">
      <button @click="$emit('toggleSidebar')" class="hidden md:flex p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
        <i class="fa-solid fa-bars-staggered text-lg"></i>
      </button>
      <h1 class="text-lg md:text-xl font-bold text-dark truncate tracking-tight">{{ title }}</h1>
    </div>
    
    <div class="flex items-center gap-3">
      <router-link v-if="showButton" to="/create" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-mocha text-white rounded-xl hover:bg-dark transition-all text-xs font-bold shadow-sm">
        <i class="fa-solid fa-plus text-[10px]"></i> Baru
      </router-link>
      
      <div class="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-gray-50 text-mocha border border-gray-100 flex items-center justify-center text-xs font-bold">
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

