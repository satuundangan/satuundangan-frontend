<template>
  <header class="flex items-center justify-between bg-white px-4 md:px-8 py-3.5 sticky top-0 z-40 border-b border-slate-100/80 shadow-xs select-none">
    <div class="flex items-center gap-3">
      <!-- Mobile Sidebar Toggle -->
      <button 
        @click="$emit('toggleSidebar')" 
        class="md:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 active:scale-95"
        aria-label="Toggle Sidebar"
      >
        <i class="fa-solid fa-bars-staggered text-base"></i>
      </button>

      <!-- Desktop Sidebar Toggle -->
      <button 
        @click="$emit('toggleSidebar')" 
        class="hidden md:flex p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
        aria-label="Toggle Sidebar"
      >
        <i class="fa-solid fa-bars-staggered text-base"></i>
      </button>

      <h1 class="text-base md:text-lg font-extrabold text-slate-900 truncate tracking-tight flex items-center gap-2">
        {{ title }}
      </h1>
    </div>
    
    <div class="flex items-center gap-3">
      <router-link 
        v-if="showButton" 
        to="/templates" 
        class="flex items-center gap-2 px-4 py-2 bg-[#a47148] text-white rounded-xl hover:bg-[#8e5e38] transition-all text-xs font-bold shadow-md shadow-[#a47148]/20 hover:scale-105 active:scale-95"
      >
        <i class="fa-solid fa-plus text-[10px]"></i>
        <span>Buat Undangan</span>
      </router-link>
      
      <div class="flex items-center gap-2 pl-2 border-l border-slate-100">
        <div class="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/60 flex items-center justify-center text-xs font-extrabold shadow-2xs">
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

defineEmits(['toggleSidebar'])

const auth = useAuthStore()
const userInitial = computed(() => (auth.user?.name || 'U').trim().charAt(0).toUpperCase())
</script>

