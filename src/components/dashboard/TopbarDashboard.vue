<template>
  <header class="flex items-center justify-between bg-white shadow px-6 py-4">
    <h1 class="text-2xl font-semibold">{{ title }}</h1>
    <div class="flex items-center space-x-4">
      <button v-if="showButton" class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
        + New Invitation
      </button>
      <img class="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100" alt="User Avatar" />
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  showButton: { type: Boolean, default: false },
});
</script>
