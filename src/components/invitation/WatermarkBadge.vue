<template>
  <div class="watermark-footer-wrapper my-6 text-center select-none px-4">
    <a
      :href="targetUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="watermark-card inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg group cursor-pointer"
      :class="variantClasses"
      title="Dibuat dengan cinta menggunakan SatuUndangan.id — Dapatkan Diskon & Komisi Afiliasi"
    >
      <!-- Logo / Icon Emblem -->
      <div 
        class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12 shadow-sm"
        :class="iconContainerClasses"
      >
        <i class="fa-solid fa-heart text-[11px] animate-pulse"></i>
      </div>

      <!-- Copy -->
      <div class="text-left flex flex-col justify-center">
        <span class="text-[9px] uppercase tracking-wider font-semibold opacity-80 leading-tight flex items-center gap-1">
          <span>Dibuat dengan cinta menggunakan</span>
        </span>
        <span class="text-xs font-black tracking-wide flex items-center gap-1.5 leading-tight">
          <span><span class="underline decoration-amber-400 decoration-1 underline-offset-2">SatuUndangan.id</span></span>
          <span class="text-[9px] font-bold text-amber-300 bg-amber-400/15 px-1.5 py-0.5 rounded-full border border-amber-400/25">
            Diskon & Komisi
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
        </span>
        <span class="text-[9px] font-medium opacity-75 leading-tight mt-0.5">
          Tertarik undangan seperti ini? Buat milikmu sekarang
        </span>
      </div>
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

const effectiveReferralCode = computed(() => {
  if (props.referralCode) return props.referralCode
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('referral_code') || localStorage.getItem('affiliate_code')
      if (stored) return stored
    } catch {
      // safe fallback if localStorage unavailable
    }
  }
  return ''
})

const targetUrl = computed(() => {
  const base = 'https://satuundangan.id/'
  const params = new URLSearchParams({
    utm_source: 'invitation_watermark',
    utm_medium: 'referral',
    utm_campaign: 'viral_watermark_loop'
  })
  if (effectiveReferralCode.value) {
    params.set('ref', effectiveReferralCode.value)
  }
  return `${base}?${params.toString()}`
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'light':
      // For light/pastel backgrounds: deep slate pill with crisp white text & soft amber accent
      return 'bg-slate-900/90 hover:bg-black text-white border border-slate-700/60 shadow-slate-900/20 backdrop-blur-md'
    case 'gold':
      // For royal gold / heritage themes: deep navy pill with rich gold border & glow
      return 'bg-[#080f24]/95 hover:bg-[#0c1636] text-[#f7e7ce] border border-[#d4af37]/60 shadow-[0_10px_25px_-5px_rgba(212,175,55,0.25)] backdrop-blur-md'
    case 'neon':
      // For cyberpunk / anime themes: dark tech pill with neon glow
      return 'bg-[#0a0f1d]/95 hover:bg-[#0f172a] text-[#38bdf8] border border-[#06b6d4]/50 shadow-[0_10px_25px_-5px_rgba(6,182,212,0.3)] backdrop-blur-md'
    case 'dark':
    default:
      // For standard dark backgrounds: black glass with warm border and gold accent
      return 'bg-black/75 hover:bg-black/90 text-white border border-white/20 shadow-black/40 backdrop-blur-md'
  }
})

const iconContainerClasses = computed(() => {
  switch (props.variant) {
    case 'gold':
      return 'bg-gradient-to-br from-[#d4af37] to-[#b38f28] text-slate-950'
    case 'neon':
      return 'bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] text-slate-950'
    case 'light':
      return 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950'
    case 'dark':
    default:
      return 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950'
  }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.watermark-card {
  text-decoration: none;
}
</style>
