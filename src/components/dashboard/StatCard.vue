<template>
  <div class="rounded-3xl bg-white p-5 border border-gray-100 flex flex-col justify-between transition-all hover:border-mocha/20">
    <div :class="color" class="flex h-9 w-9 items-center justify-center rounded-xl text-base mb-4">
      <i v-if="iconClass" :class="iconClass"></i>
      <span v-else>{{ icon }}</span>
    </div>
    <div>
      <h2 class="text-[10px] font-black uppercase text-gray-400 tracking-widest">{{ label }}</h2>
      <p class="mt-1 text-2xl font-bold text-dark tracking-tight">{{ value }}</p>
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

