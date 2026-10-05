<template>
  <div class="watermark-footer-wrapper mt-8 mb-4 text-center select-none px-4">
    <a
      :href="targetUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="watermark-link inline-flex items-center gap-1.5 text-[11px] md:text-xs transition-all duration-300 group cursor-pointer font-medium tracking-wide"
      :class="variantClasses"
      title="Buat Undangan Pernikahan Digital di SatuUndangan.id"
    >
      <span class="opacity-60">Dibuat dengan</span>
      <span class="font-bold underline decoration-1 underline-offset-4 group-hover:opacity-100 transition-opacity">
        SatuUndangan.id
      </span>
      <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-40 group-hover:opacity-80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'dark', // 'dark' | 'light' | 'gold' | 'neon'
    validator: (v) => ['dark', 'light', 'gold', 'neon'].includes(v)
  },
  referralCode: {
    type: String,
    default: ''
  }
})

const targetUrl = computed(() => {
  const base = 'https://satuundangan.id/'
  const params = new URLSearchParams({
    utm_source: 'invitation_watermark',
    utm_medium: 'referral',
    utm_campaign: 'powered_by_satuundangan'
  })
  if (props.referralCode) {
    params.set('ref', props.referralCode)
  }
  return `${base}?${params.toString()}`
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'light':
      // For light/pastel backgrounds: subtle dark-slate text that blends naturally into light footers
      return 'text-slate-500 hover:text-slate-900 decoration-slate-400'
    case 'gold':
      // For royal gold / heritage themes: warm gold text blending into dark/gold footers
      return 'text-[#d6b18a]/75 hover:text-[#f3ddb3] decoration-[#d6b18a]/50'
    case 'neon':
      // For cyberpunk / anime themes: soft cyan text
      return 'text-cyan-400/80 hover:text-cyan-300 decoration-cyan-500/50'
    case 'dark':
    default:
      // For standard dark backgrounds: muted gray text with white hover
      return 'text-gray-400 hover:text-white decoration-gray-500'
  }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.watermark-link {
  text-decoration: none;
}
</style>
