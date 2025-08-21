<template>
  <aside class="w-64 bg-white shadow-lg">
    <div class="p-4 font-bold text-xl cursor-pointer" @click="goToHome">SatuUndangan</div>
    <nav class="mt-6">
      <ul class="space-y-2">
        <li v-for="item in menu" :key="item.name">
          <router-link :to="item.to" class="flex items-center px-4 py-2 hover:bg-gray-200 rounded-lg"
            active-class="bg-blue-100 text-blue-600 font-medium">
            <span>{{ item.icon }} {{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import router from '@/router';

function goToHome() {
  router.push('/');
}

const menu = [
  { name: "Dashboard", to: "/dashboard", icon: "📊" },
  { name: "Invitations", to: "/invitations", icon: "🎉" },
  { name: "Templates", to: "/templates", icon: "🎨" },
  { name: "Guestbook", to: "/guestbook", icon: "📖" },
  { name: "Settings", to: "/settings", icon: "⚙️" },
];
</script>
