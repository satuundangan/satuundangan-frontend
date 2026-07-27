<template>
  <!-- Main sidebar container with full height and flex column layout -->
  <aside 
    class="flex h-screen sticky top-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out shrink-0"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Sidebar Header -->
    <div 
      class="flex h-16 shrink-0 items-center border-b border-slate-200 px-4 transition-all duration-300"
      :class="isCollapsed ? 'justify-center' : 'justify-between px-6'"
    >
      <router-link to="/admin" class="flex items-center gap-3 overflow-hidden">
        <div class="shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300"
          :class="isCollapsed ? 'h-10 w-10' : 'h-12 w-32'"
        >
          <img 
            src="/logo-admin.jpg" 
            alt="Satu Undangan" 
            class="h-full w-full object-contain"
          />
        </div>
      </router-link>
      
      <button 
        v-if="!isCollapsed"
        @click="toggleCollapse" 
        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <i class="pi pi-chevron-left text-xs"></i>
      </button>
    </div>

    <!-- Toggle for Collapsed State -->
    <div v-if="isCollapsed" class="flex justify-center py-4 border-b border-slate-50">
      <button 
        @click="toggleCollapse" 
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        <i class="pi pi-chevron-right text-sm"></i>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 space-y-1.5 px-3 py-6 text-sm overflow-y-auto custom-scrollbar">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center rounded-xl font-medium transition-all duration-200 group relative"
        :class="[
          isActive(item.to)
            ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
          isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-3 px-4 py-3',
        ]"
        :title="isCollapsed ? item.label : ''"
      >
        <!-- PrimeIcon for nav items -->
        <i :class="['pi', item.icon, isCollapsed ? 'text-lg' : 'text-base']" aria-hidden="true"></i>
        <span v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">{{ item.label }}</span>
        
        <!-- Tooltip for collapsed state -->
        <div v-if="isCollapsed" class="absolute left-14 z-50 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-xl">
          {{ item.label }}
          <div class="absolute -left-1 top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-slate-900"></div>
        </div>
      </RouterLink>
    </nav>

    <!-- Sidebar Footer (User/Logout Section) -->
    <div class="mt-auto border-t border-slate-200 bg-slate-50/50 p-4">
      <div 
        class="flex items-center transition-all duration-300"
        :class="isCollapsed ? 'flex-col gap-4' : 'gap-3 px-2'"
      >
        <img
          class="h-10 w-10 rounded-xl border-2 border-white shadow-sm shrink-0"
          :src="user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`"
          alt="User Avatar"
        >
        <div v-if="!isCollapsed" class="flex flex-col min-w-0">
          <span class="truncate text-sm font-bold text-slate-800">{{ user?.name || 'Admin' }}</span>
          <span class="truncate text-[11px] font-medium text-slate-400">{{ user?.email }}</span>
        </div>
        <button 
          @click="handleLogout" 
          class="text-slate-400 hover:text-rose-500 transition-colors shrink-0"
          :class="isCollapsed ? '' : 'ml-auto'"
          title="Logout"
        >
          <i class="pi pi-sign-out text-base"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isCollapsed = ref(localStorage.getItem('admin_sidebar_collapsed') === 'true');

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('admin_sidebar_collapsed', isCollapsed.value);
};

const user = computed(() => authStore.user);

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Keluar dari Admin?',
    text: 'Sesi admin Anda akan diakhiri.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal',
    focusCancel: true
  });
  
  if (result.isConfirmed) {
    authStore.logout();
    router.push('/admin/login');
  }
};

// Navigation items array with PrimeIcons
const navItems = [
  { label: 'Dashboard', to: '/admin', icon: 'pi-home' },
  { label: 'Users', to: '/admin/users', icon: 'pi-users' },
  { label: 'Invitations', to: '/admin/invitations', icon: 'pi-envelope' },
  { label: 'Template Designs', to: '/admin/templates', icon: 'pi-palette' },
  { label: 'Master Kategori', to: '/admin/categories', icon: 'pi-tags' },
  { label: 'Master Fitur (Sections)', to: '/admin/sections', icon: 'pi-list' },
  { label: 'Audio & Musik', to: '/admin/audio', icon: 'pi-volume-up' },
  { label: 'Bank & Pembayaran', to: '/admin/banks', icon: 'pi-credit-card' },
  { label: 'Promo Code', to: '/admin/promo-codes', icon: 'pi-percentage' },
];

// Function to determine if a link is active
const isActive = (path) => route.path === path;
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
