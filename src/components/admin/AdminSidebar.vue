<template>
  <aside class="w-64 border-r border-slate-200 bg-white">
    <div class="px-6 py-6 border-b border-slate-200">
      <router-link to="/admin" class="text-lg font-semibold text-slate-900">Undangdong Admin</router-link>
    </div>

    <nav class="px-3 py-4 space-y-1 text-sm">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-md px-3 py-2 font-medium transition"
        :class="[
          route.path === item.to
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        ]"
      >
        <span class="shrink-0" v-html="item.icon" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = computed(() => [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h5.25v-4.5h4.5V21H19.5V10.5" /></svg>',
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128A9.38 9.38 0 0 0 18 15.75c0-2.071-1.5-3.75-3.75-3.75h-4.5C7.5 12 6 13.679 6 15.75c0 1.78.83 3.363 2.13 4.378" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128A9.38 9.38 0 0 1 12 19.5c-1.09 0-2.137-.19-3.105-.537M15 19.128a6 6 0 0 0 3-5.264C18 12.571 16.5 10.5 14.25 10.5h-4.5C7.5 10.5 6 12.571 6 13.864a6 6 0 0 0 3 5.264m6 0V21m-6-1.872V21m3-10.5a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75z" /></svg>',
  },
  {
    label: 'Invitations',
    to: '/admin/invitations',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3h9a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-9a2.25 2.25 0 0 1-2.25-2.25V5.25A2.25 2.25 0 0 1 7.5 3zm0 0v18M16.5 3v18" /></svg>',
  },
  {
    label: 'Guests',
    to: '/admin/guests',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm-9 8.25a6 6 0 0 1 12 0V21H6v-.75z" /></svg>',
  },
  {
    label: 'Guest Messages',
    to: '/admin/guest-messages',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9M7.5 12h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>',
  },
  {
    label: 'Template Designs',
    to: '/admin/templates',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m-3 0h3v3" /></svg>',
  },
])
</script>
