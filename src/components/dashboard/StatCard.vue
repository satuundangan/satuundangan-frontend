<template>
  <div class="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs flex flex-col justify-between transition-all hover:border-slate-200 hover:shadow-md group cursor-default">
    <div class="flex items-center justify-between mb-3">
      <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">{{ label }}</span>
      <div :class="color" class="flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-transform group-hover:scale-110 shadow-2xs">
        <i v-if="iconClass" :class="iconClass"></i>
        <span v-else>{{ icon }}</span>
      </div>
    </div>
    <div>
      <p class="text-2xl font-black text-slate-900 tracking-tight">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  iconClass: String,
  color: { type: String, default: 'bg-slate-100 text-slate-700' },
})
</script>

