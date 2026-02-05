<template>
  <header class="flex items-center justify-between bg-white shadow px-6 py-4">
    <h1 class="text-2xl font-semibold">{{ title }}</h1>
    <div class="flex items-center space-x-4">
      <button v-if="showButton" @click="$router.push('/create')" class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
        + New Invitation
      </button>
      <img class="w-10 h-10 rounded-full object-cover" :src="userAvatar" alt="User Avatar" />
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

const auth = useAuthStore();
const userAvatar = computed(() => auth.user?.photo || auth.user?.avatar || 'https://i.pravatar.cc/100');
</script>
