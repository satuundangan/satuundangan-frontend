<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    :class="[
      'rounded-xl bg-white p-5 border border-stone-200/80 flex flex-col justify-between transition-colors duration-150 group block select-none',
      to
        ? 'cursor-pointer hover:border-stone-400 hover:bg-stone-50/40 active:bg-stone-100/60'
        : 'cursor-default hover:border-stone-300',
    ]"
  >
    <div class="flex items-center justify-between mb-3 gap-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <span
          class="text-xs font-medium tracking-tight transition-colors truncate"
          :class="to ? 'text-stone-500 group-hover:text-stone-900' : 'text-stone-500'"
        >
          {{ label }}
        </span>
        <i
          v-if="to"
          class="fa-solid fa-chevron-right text-[9px] text-stone-300 group-hover:text-stone-700 transition-colors"
          aria-hidden="true"
        ></i>
      </div>
      <div
        class="flex h-7 w-7 items-center justify-center rounded-lg text-xs text-stone-500 bg-stone-100/80 shrink-0 group-hover:text-[#8f5e38] transition-colors"
      >
        <i v-if="iconClass" :class="iconClass" aria-hidden="true"></i>
        <span v-else>{{ icon }}</span>
      </div>
    </div>
    <div class="flex items-baseline justify-between gap-2">
      <p class="text-2xl md:text-[26px] font-semibold text-stone-900 tracking-tight tabular-nums">{{ value }}</p>
      <span
        v-if="to"
        class="text-[11px] font-medium text-stone-400 group-hover:text-stone-800 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 duration-150"
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
