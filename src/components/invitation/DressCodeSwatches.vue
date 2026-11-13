<template>
  <div 
    v-if="resolvedColors.length > 0" 
    class="dress-code-swatches-container flex flex-col items-center justify-center space-y-2.5 my-3"
    data-test="dress-code-swatches"
  >
    <div 
      v-if="showLabel"
      class="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-75 inline-flex items-center gap-1.5"
    >
      <i class="fa-solid fa-palette text-[10px] opacity-70"></i>
      <span>{{ labelText }}</span>
    </div>

    <!-- Swatches List -->
    <div class="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap max-w-sm mx-auto">
      <div 
        v-for="(hex, index) in resolvedColors" 
        :key="index"
        class="group relative flex flex-col items-center"
      >
        <div 
          class="rounded-full shadow-xs border transition-all duration-300 transform group-hover:scale-115 flex items-center justify-center cursor-default select-none"
          :class="sizeClass"
          :style="{
            backgroundColor: hex,
            borderColor: getContrastBorder(hex),
            boxShadow: getSwatchShadow(hex)
          }"
          :title="hex"
          data-test="swatch-circle"
        ></div>

        <span 
          v-if="showHex"
          class="text-[9px] font-mono mt-1 opacity-60 uppercase tracking-tighter"
        >
          {{ hex }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { normalizeHex, getContrastBorder, getSwatchShadow } from '@/utils/dressCodePresets'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    default: null
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  labelText: {
    type: String,
    default: 'Nuansa Warna Busana'
  },
  size: {
    type: String,
    default: 'md' // 'sm' | 'md' | 'lg'
  },
  showHex: {
    type: Boolean,
    default: false
  }
})

const resolvedColors = computed(() => {
  // Support either explicit colors prop, or nested inside data.designSettings.dressCodeColors, or data.dressCodeColors
  const rawList = (props.colors && props.colors.length > 0)
    ? props.colors
    : (props.data?.designSettings?.dressCodeColors || props.data?.dressCodeColors || [])

  if (!Array.isArray(rawList)) return []

  return rawList
    .map(c => normalizeHex(c))
    .filter(Boolean)
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'w-6 h-6'
  if (props.size === 'lg') return 'w-10 h-10'
  return 'w-7 h-7 sm:w-8 sm:h-8'
})
</script>

<style scoped>
.dress-code-swatches-container {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
