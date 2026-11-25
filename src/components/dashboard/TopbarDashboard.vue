<template>
  <header class="flex items-center justify-between bg-white px-4 md:px-8 py-3.5 sticky top-0 z-40 border-b border-stone-200/80 select-none">
    <div class="flex items-center gap-3">
      <!-- Mobile Sidebar Toggle -->
      <button 
        @click="$emit('toggleSidebar')" 
        class="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600 cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        <i class="fa-solid fa-bars-staggered text-base"></i>
      </button>

      <!-- Desktop Sidebar Toggle -->
      <button 
        @click="$emit('toggleSidebar')" 
        class="hidden md:flex p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-400 hover:text-stone-700 cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        <i class="fa-solid fa-bars-staggered text-base"></i>
      </button>

      <h1 class="text-sm md:text-base font-semibold text-stone-900 truncate tracking-tight flex items-center gap-2">
        {{ title }}
      </h1>
    </div>
    
    <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
      <button 
        type="button"
        @click="$emit('startTour')" 
        class="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-700 rounded-lg transition-colors text-xs font-medium cursor-pointer"
        title="Mulai Tur Panduan Interaktif"
      >
        <i class="fa-solid fa-circle-question text-[#8f5e38] text-xs"></i>
        <span class="hidden sm:inline">Panduan</span>
      </button>

      <router-link 
        v-if="showButton" 
        to="/templates" 
        class="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-xs font-semibold shrink-0"
        title="Buat Undangan Baru"
      >
        <i class="fa-solid fa-plus text-[10px]"></i>
        <span class="hidden sm:inline">Buat Undangan</span>
        <span class="sm:hidden text-[11px]">Buat</span>
      </router-link>
      
      <div class="flex items-center gap-2 pl-2 border-l border-stone-200">
        <div class="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 border border-stone-200/80 flex items-center justify-center text-xs font-semibold">
          {{ userInitial }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps({
  title: { type: String, required: true },
  showButton: { type: Boolean, default: false },
})

defineEmits(['toggleSidebar', 'startTour'])

const auth = useAuthStore()
const userInitial = computed(() => (auth.user?.name || 'U').trim().charAt(0).toUpperCase())
</script>

