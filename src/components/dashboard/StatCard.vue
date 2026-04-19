<template>
  <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-xs font-bold uppercase text-gray-500">{{ label }}</h2>
        <p class="mt-2 text-3xl font-bold text-dark">{{ value }}</p>
      </div>
      <div :class="color" class="flex h-12 w-12 items-center justify-center rounded-xl text-xl">
        <i v-if="iconClass" :class="iconClass"></i>
        <span v-else>{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  iconClass: String,
  color: { type: String, default: 'bg-mocha/10 text-mocha' },
});
</script>
