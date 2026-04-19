<template>
  <header class="flex items-center justify-between bg-white shadow px-4 md:px-6 py-4 sticky top-0 z-10">
    <div class="flex items-center gap-3">
      <button @click="$emit('toggleSidebar')" class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <i class="fa-solid fa-bars text-xl text-gray-600"></i>
      </button>
      <h1 class="text-xl md:text-2xl font-semibold text-dark truncate">{{ title }}</h1>
    </div>
    
    <div class="flex items-center space-x-3 md:space-x-4">
      <button v-if="showButton" @click="$router.push('/create')" class="hidden sm:block px-4 py-2 bg-mocha text-white rounded-lg shadow hover:bg-mocha/90 transition-all text-sm font-bold">
        + New Invitation
      </button>
      <button v-if="showButton" @click="$router.push('/create')" class="sm:hidden w-8 h-8 bg-mocha text-white rounded-lg shadow flex items-center justify-center font-bold">
        +
      </button>
      <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-mocha text-white border border-gray-100 shadow-sm flex items-center justify-center text-sm font-bold">
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
const userInitial = computed(() => (auth.user?.name || auth.user?.email || 'U').trim().charAt(0).toUpperCase());
</script>
