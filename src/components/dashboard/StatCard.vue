<template>
  <div class="bg-white p-6 rounded-xl shadow">
    <h2 class="text-gray-500 text-sm">{{ label }}</h2>
    <p class="text-3xl font-bold">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
});
</script>
