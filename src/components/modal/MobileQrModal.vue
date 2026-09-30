<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 transform transition-all animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        <!-- Header -->
        <div class="p-5 sm:p-6 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white relative">
          <button
            @click="close"
            type="button"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
            aria-label="Tutup Modal"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="flex items-center gap-3 mb-2">
            <span class="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-lg">
              <i class="fa-solid fa-mobile-screen"></i>
            </span>
            <div>
              <span class="text-[10px] uppercase font-bold tracking-widest text-amber-400/90">Preview Langsung di HP</span>
              <h3 id="qr-modal-title" class="text-lg font-bold font-serif text-white">
                {{ template?.name || 'Coba Desain di HP Kamu' }}
              </h3>
            </div>
          </div>
          <p class="text-xs text-stone-300 leading-relaxed">
            Scan QR Code menggunakan kamera smartphone Anda untuk melihat pengalaman animasi & interaksi undangan sesungguhnya.
          </p>
        </div>

        <!-- Body: QR Code & Steps -->
        <div class="p-6 text-center space-y-5">
          <!-- QR Code Display -->
          <div class="relative inline-block p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 shadow-inner group">
            <div v-if="loadingQr" class="w-48 h-48 flex items-center justify-center">
              <i class="fa-solid fa-circle-notch animate-spin text-2xl text-stone-400"></i>
            </div>
            <img
              v-else-if="qrDataUrl"
              :src="qrDataUrl"
              alt="Scan QR Preview Undangan"
              class="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-xl shadow-sm bg-white p-2"
            />
            <div v-else class="w-48 h-48 flex items-center justify-center text-stone-400 text-xs">
              Gagal memuat QR Code
            </div>

            <!-- Badge Center or Corner -->
            <div class="mt-2 text-[11px] font-mono text-stone-500 font-medium truncate max-w-[220px] mx-auto">
              {{ shortUrl }}
            </div>
          </div>

          <!-- Instructions -->
          <div class="grid grid-cols-3 gap-2 text-left bg-stone-50/80 p-3 rounded-2xl border border-stone-100">
            <div class="flex items-start gap-2">
              <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
              <p class="text-[11px] text-stone-600 leading-snug">Buka kamera HP</p>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
              <p class="text-[11px] text-stone-600 leading-snug">Arahkan ke QR</p>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
              <p class="text-[11px] text-stone-600 leading-snug">Buka undangan</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              @click="copyLink"
              type="button"
              class="flex-1 py-3 px-4 rounded-xl font-bold text-xs border border-stone-200 hover:border-stone-400 text-stone-700 bg-white hover:bg-stone-50 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
            >
              <i :class="copied ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy'"></i>
              <span>{{ copied ? 'Link Tersalin!' : 'Salin Link Demo' }}</span>
            </button>
            <a
              :href="demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-stone-900 hover:bg-black text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              <span>Buka di Tab Baru</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  template: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['update:modelValue'])

const qrDataUrl = ref('')
const loadingQr = ref(false)
const copied = ref(false)

const demoUrl = computed(() => {
  if (!props.template?.slug) return window?.location?.origin || 'https://satuundangan.id'
  const origin = window?.location?.origin || 'https://satuundangan.id'
  return `${origin}/demo/${props.template.slug}`
})

const shortUrl = computed(() => {
  if (!props.template?.slug) return 'satuundangan.id'
  return `satuundangan.id/demo/${props.template.slug}`
})

async function generateQr() {
  if (!demoUrl.value) return
  loadingQr.value = true
  try {
    qrDataUrl.value = await QRCode.toDataURL(demoUrl.value, {
      width: 260,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
  } catch (err) {
    console.error('Gagal generate QR Code:', err)
  } finally {
    loadingQr.value = false
  }
}

watch(
  () => [props.modelValue, props.template?.slug],
  ([isOpen, slug]) => {
    if (isOpen && slug) {
      copied.value = false
      generateQr()
    }
  },
  { immediate: true },
)

function close() {
  emit('update:modelValue', false)
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(demoUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    console.error('Gagal copy link:', err)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
