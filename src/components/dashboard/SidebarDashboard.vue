<template>
  <div>
    <!-- Mobile Overlay -->
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-all duration-300"></div>

    <aside :class="[
      'bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out w-64',
      isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'
    ]">
      <div class="p-6 cursor-pointer border-b border-gray-50 flex items-center justify-between" @click="goToHome">
         <div class="flex items-center gap-3">
            <div class="w-7 h-7 bg-mocha text-white rounded-lg flex items-center justify-center font-serif font-bold text-sm">S</div>
            <span class="font-bold text-sm text-mocha tracking-tight uppercase tracking-widest">SatuUndangan</span>
         </div>
         <button @click.stop="$emit('close')" class="md:hidden p-2 text-gray-400 hover:text-mocha">
            <i class="fa-solid fa-times text-xl"></i>
         </button>
      </div>
      
      <nav class="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <ul class="space-y-1">
          <li v-for="item in menu" :key="item.name">
            <router-link :to="item.to" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group"
              active-class="bg-gray-50 text-mocha font-bold"
              :class="$route.path === item.to ? '' : 'text-gray-500 hover:bg-gray-50 hover:text-dark'">
              <span class="text-lg group-hover:scale-110 transition-transform duration-200 opacity-70 group-hover:opacity-100">{{ item.icon }}</span>
              <span class="text-xs">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-100">
         <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium">
            <span>🚪</span> Logout
         </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

defineProps({
  isOpen: { type: Boolean, default: false }
});

defineEmits(['close']);

const router = useRouter();
const auth = useAuthStore();

function goToHome() {
  router.push('/');
}

function handleLogout() {
  auth.logout();
  router.push('/');
}

const menu = [
  { name: "Dashboard", to: "/dashboard", icon: "📊" },
  { name: "Undangan Saya", to: "/invitations", icon: "💌" },
  { name: "Daftar Tamu", to: "/guests", icon: "👥" },
  { name: "Buku Tamu", to: "/guestbook", icon: "📖" },
  { name: "Pengaturan", to: "/settings", icon: "⚙️" },
];
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
