<template>
  <aside class="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-20">
    <div class="p-6 cursor-pointer border-b border-gray-100" @click="goToHome">
       <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-mocha text-white rounded-lg flex items-center justify-center font-serif font-bold">S</div>
          <span class="font-serif font-bold text-lg text-mocha tracking-tight">SatuUndangan</span>
       </div>
    </div>
    
    <nav class="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
      <ul class="space-y-1">
        <li v-for="item in menu" :key="item.name">
          <router-link :to="item.to" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            active-class="bg-mocha/10 text-mocha font-semibold shadow-sm"
            :class="$route.path === item.to ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-dark'">
            <span class="text-xl group-hover:scale-110 transition-transform duration-200">{{ item.icon }}</span>
            <span class="text-sm">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-gray-100">
       <button class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium">
          <span>🚪</span> Logout
       </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
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