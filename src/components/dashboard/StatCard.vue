<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    :class="[
      'rounded-2xl bg-white p-5 border border-slate-100 shadow-xs flex flex-col justify-between transition-all group block select-none',
      to
        ? 'cursor-pointer hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:shadow-xs'
        : 'cursor-default hover:border-slate-200 hover:shadow-md',
    ]"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-1.5">
        <span
          class="text-[10px] font-black uppercase tracking-wider transition-colors"
          :class="to ? 'text-slate-400 group-hover:text-slate-700' : 'text-slate-400'"
        >
          {{ label }}
        </span>
        <i
          v-if="to"
          class="fa-solid fa-chevron-right text-[9px] text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all"
          aria-hidden="true"
        ></i>
      </div>
      <div
        :class="color"
        class="flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-transform duration-200 group-hover:scale-110 shadow-2xs shrink-0"
      >
        <i v-if="iconClass" :class="iconClass" aria-hidden="true"></i>
        <span v-else>{{ icon }}</span>
      </div>
    </div>
    <div class="flex items-end justify-between">
      <p class="text-2xl font-black text-slate-900 tracking-tight">{{ value }}</p>
      <span
        v-if="to"
        class="text-[11px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 duration-200"
      >
        <span>Lihat</span>
        <i class="fa-solid fa-arrow-right text-[9px]" aria-hidden="true"></i>
      </span>
    </div>
  </component>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  iconClass: String,
  color: { type: String, default: 'bg-slate-100 text-slate-700' },
  to: [String, Object],
})
</script>
