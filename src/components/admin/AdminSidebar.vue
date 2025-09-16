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
          src="https://placehold.co/100x100/E2E8F0/475569?text=A&font=sans"
          alt="User Avatar"
        >
        <div class="flex flex-col text-sm">
          <span class="font-semibold text-slate-800">Admin User</span>
          <span class="text-slate-500">admin@undangdong.com</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { h } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

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

// Navigation items array using the icon components
const navItems = [
  { label: 'Dashboard', to: '/admin', icon: IconDashboard },
  { label: 'Users', to: '/admin/users', icon: IconUsers },
  { label: 'Invitations', to: '/admin/invitations', icon: IconInvitations },
  { label: 'Guests', to: '/admin/guests', icon: IconGuests },
  { label: 'Guest Messages', to: '/admin/guest-messages', icon: IconMessages },
  { label: 'Template Designs', to: '/admin/templates', icon: IconTemplates },
];

// Function to determine if a link is active
const isActive = (path) => route.path === path;
</script>
