<template>
  <div class="rounded-2xl bg-white p-4 md:p-5 shadow-sm border border-gray-50 flex flex-col justify-between transition-all hover:shadow-md">
    <div :class="color" class="flex h-10 w-10 md:h-12 md:md:w-12 items-center justify-center rounded-xl text-lg md:text-xl mb-3">
      <i v-if="iconClass" :class="iconClass"></i>
      <span v-else>{{ icon }}</span>
    </div>
    <div>
      <h2 class="text-[10px] md:text-xs font-bold uppercase text-gray-400 tracking-wider">{{ label }}</h2>
      <p class="mt-1 text-2xl md:text-3xl font-bold text-dark">{{ value }}</p>
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

