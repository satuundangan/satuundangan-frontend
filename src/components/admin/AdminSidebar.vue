<template>
  <!-- Main sidebar container with full height and flex column layout -->
  <aside class="flex h-screen w-64 flex-col overflow-y-auto border-r border-slate-200 bg-white">
    <!-- Sidebar Header -->
    <div class="flex h-16 shrink-0 items-center border-b border-slate-200 px-6">
      <router-link to="/admin" class="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <!-- A simple SVG logo for better visuals -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6 text-blue-600"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span>Undangdong</span>
      </router-link>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 space-y-1 px-4 py-4 text-sm">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium transition-colors duration-200"
        :class="[
          isActive(item.to)
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        ]"
      >
        <!-- Dynamic component for icons, making the code cleaner -->
        <component :is="item.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Sidebar Footer (User/Logout Section) -->
    <div class="mt-auto border-t border-slate-200 p-4">
      <div class="flex items-center gap-3 rounded-md px-3 py-2.5">
        <img
          class="h-9 w-9 rounded-full"
          :src="user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`"
          alt="User Avatar"
        >
        <div class="flex flex-col overflow-hidden">
          <span class="truncate text-sm font-semibold text-slate-800">{{ user?.name || 'Admin' }}</span>
          <span class="truncate text-xs text-slate-500">{{ user?.email }}</span>
        </div>
        <button 
          @click="handleLogout" 
          class="ml-auto text-slate-400 hover:text-red-500"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { h, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
  router.push('/admin/login');
};

// Helper function to create simple icon components from SVG paths
const createIcon = (paths) => ({
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        'stroke-width': 1.5,
      },
      paths.map(d => h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d }))
    );
  },
});

// Define icons as components for cleaner code and better reusability
const IconDashboard = createIcon(['M3 12l9-9 9 9M4.5 10.5V21h5.25v-4.5h4.5V21H19.5V10.5']);
const IconUsers = createIcon(['M15 19.128A9.38 9.38 0 0 0 18 15.75c0-2.071-1.5-3.75-3.75-3.75h-4.5C7.5 12 6 13.679 6 15.75c0 1.78.83 3.363 2.13 4.378','m-9.375 5.25a3.375 3.375 0 0 1 6.75 0 3.375 3.375 0 0 1-6.75 0Z']);
const IconInvitations = createIcon(['M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75']);
const IconGuests = createIcon(['M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm-9 8.25a6 6 0 0 1 12 0V21H6v-.75z']);
const IconMessages = createIcon(['M7.5 8.25h9M7.5 12h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z']);
const IconTemplates = createIcon(['M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.47 2.118L2.25 12.007a.94.94 0 0 1 .134-.739l.417-.646a.94.94 0 0 1 .84-.396h2.953a.94.94 0 0 1 .84.396l.417.646a.94.94 0 0 1 .134.739l-1.03 5.011a2.25 2.25 0 0 1 2.47-2.118 3 3 0 0 0 5.78-1.128zM15.75 1.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75zM12 12.75a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H12zm3 0a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H15zm3 0a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H18z']);
const IconCategories = createIcon(['M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z', 'M6 6h.008v.008H6V6Z']);
const IconPalettes = createIcon(['M4.017 10.312l-1.02.51a2.25 2.25 0 000 4.028l1.02.51a2.25 2.25 0 011.208 1.998V18.5a2.25 2.25 0 002.25 2.25h1.656a2.25 2.25 0 011.998 1.208l.51 1.02a2.25 2.25 0 004.028 0l.51-1.02a2.25 2.25 0 011.998-1.208h1.656a2.25 2.25 0 002.25-2.25v-1.152a2.25 2.25 0 011.208-1.998l1.02-.51a2.25 2.25 0 000-4.028l-1.02-.51a2.25 2.25 0 01-1.208-1.998V5.5a2.25 2.25 0 00-2.25-2.25h-1.656a2.25 2.25 0 01-1.998-1.208l-.51-1.02a2.25 2.25 0 00-4.028 0l-.51 1.02a2.25 2.25 0 01-1.998 1.208H6.267a2.25 2.25 0 00-2.25 2.25v1.152a2.25 2.25 0 01-1.208 1.998z']);
const IconAudio = createIcon(['M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z']);
const IconBanks = createIcon(['M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z']);
const IconSections = createIcon(['M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z']);

const IconPromoCodes = createIcon(['M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'])

// Navigation items array using the icon components
const navItems = [
  { label: 'Dashboard', to: '/admin', icon: IconDashboard },
  { label: 'Users', to: '/admin/users', icon: IconUsers },
  { label: 'Invitations', to: '/admin/invitations', icon: IconInvitations },
  { label: 'Guests', to: '/admin/guests', icon: IconGuests },
  { label: 'Guest Messages', to: '/admin/guest-messages', icon: IconMessages },
  { label: 'Template Designs', to: '/admin/templates', icon: IconTemplates },
  { label: 'Master Kategori', to: '/admin/categories', icon: IconCategories },
  { label: 'Master Palette Warna', to: '/admin/palettes', icon: IconPalettes },
  { label: 'Master Fitur (Sections)', to: '/admin/sections', icon: IconSections },
  { label: 'Audio & Musik', to: '/admin/audio', icon: IconAudio },
  { label: 'Bank & Pembayaran', to: '/admin/banks', icon: IconBanks },
  { label: 'Promo Code', to: '/admin/promo-codes', icon: IconPromoCodes },
];

// Function to determine if a link is active
const isActive = (path) => route.path === path;
</script>
