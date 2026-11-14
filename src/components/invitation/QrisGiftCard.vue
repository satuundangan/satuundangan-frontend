<template>
  <div v-if="resolvedQrisUrl" class="qris-gift-card inline-block" data-test="qris-gift-card">
    <!-- Trigger Button -->
    <button
      type="button"
      data-test="open-qris-modal-btn"
      class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      :class="buttonClass"
      @click="openModal"
    >
      <i class="fa-solid fa-qrcode text-base"></i>
      <span>{{ buttonText }}</span>
    </button>

    <!-- Modal Dialog -->
    <Teleport to="body">
      <Transition name="qris-fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
          data-test="qris-modal-backdrop"
          @click.self="closeModal"
        >
          <div
            class="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center text-gray-800 shadow-2xl space-y-5 animate-scale-up border border-gray-100 max-h-[92vh] overflow-y-auto"
            data-test="qris-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="QRIS Amplop Digital"
          >
            <!-- Close Button -->
            <button
              type="button"
              data-test="close-qris-modal-btn"
              class="absolute right-4 top-4 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200 flex items-center justify-center transition-colors text-sm font-bold"
              aria-label="Tutup modal"
              @click="closeModal"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Modal Header -->
            <div class="space-y-1.5 pt-1">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mb-1">
                <i class="fa-solid fa-qrcode text-2xl"></i>
              </div>
              <h3 class="text-xl sm:text-2xl font-serif font-black tracking-tight text-gray-900">
                Amplop Digital / QRIS
              </h3>
              <p v-if="coupleDisplayName" class="text-xs text-amber-700 font-medium">
                Pernikahan {{ coupleDisplayName }}
              </p>
              <p class="text-[11px] text-gray-500 leading-relaxed px-4">
                Pindai kode QRIS menggunakan m-banking atau aplikasi e-wallet pilihan Anda untuk mengirimkan tanda kasih.
              </p>
            </div>

            <!-- QRIS Barcode Frame -->
            <div class="relative mx-auto rounded-2xl border-2 border-gray-200 bg-white p-4 sm:p-5 shadow-inner max-w-[280px] sm:max-w-[320px]">
              <div class="relative overflow-hidden rounded-xl bg-white flex items-center justify-center aspect-square">
                <img
                  :src="resolvedQrisUrl"
                  alt="Barcode QRIS Amplop Digital"
                  class="w-full h-full object-contain select-none"
                  data-test="qris-image"
                  loading="eager"
                />
              </div>

              <div v-if="accountName" class="mt-3 pt-3 border-t border-gray-100 text-xs font-bold text-gray-700">
                A.N. {{ accountName }}
              </div>
            </div>

            <!-- Supported Wallets Badge -->
            <div class="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium flex-wrap">
              <span>BCA</span> • <span>Mandiri</span> • <span>BRI</span> • <span>BNI</span> • <span>GoPay</span> • <span>OVO</span> • <span>DANA</span> • <span>ShopeePay</span>
            </div>

            <!-- Instructions & Download Button -->
            <div class="space-y-2.5 pt-1">
              <button
                type="button"
                data-test="download-qris-btn"
                class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                @click="downloadQris"
              >
                <i class="fa-solid fa-arrow-down-to-line"></i>
                <span>Unduh Gambar QRIS</span>
              </button>

              <button
                type="button"
                class="w-full py-2.5 px-4 rounded-xl text-gray-500 hover:text-gray-800 text-xs font-semibold hover:bg-gray-50 transition-colors"
                @click="closeModal"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  qrisUrl: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  },
  groomName: {
    type: String,
    default: ''
  },
  brideName: {
    type: String,
    default: ''
  },
  accountName: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'Scan QRIS (Amplop Digital)'
  },
  variant: {
    type: String,
    default: 'default' // 'default', 'light', 'dark', 'gold', 'retro', 'minimal'
  }
})

const isOpen = ref(false)

const resolvedQrisUrl = computed(() => {
  if (props.qrisUrl && typeof props.qrisUrl === 'string' && props.qrisUrl.trim()) {
    return props.qrisUrl.trim()
  }
  const fromData =
    props.data?.qrisImageUrl ||
    props.data?.designSettings?.qrisImageUrl ||
    props.data?.giftSettings?.qrisImageUrl
  if (fromData && typeof fromData === 'string' && fromData.trim()) {
    return fromData.trim()
  }
  return ''
})

const coupleDisplayName = computed(() => {
  const g = props.groomName || props.data?.groomName || ''
  const b = props.brideName || props.data?.brideName || ''
  if (g && b) return `${g} & ${b}`
  return g || b || ''
})

const buttonClass = computed(() => {
  switch (props.variant) {
    case 'dark':
      return 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
    case 'light':
      return 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm'
    case 'gold':
      return 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#120e09] hover:brightness-110 shadow-[#d4af37]/20'
    case 'retro':
      return 'bg-[#2c2c2c] text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]'
    case 'minimal':
      return 'bg-transparent text-current border border-current hover:bg-current/10'
    default:
      return 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
  }
})

function openModal() {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

function downloadQris() {
  const url = resolvedQrisUrl.value
  if (!url) return
  try {
    const link = document.createElement('a')
    link.href = url
    const safeGroom = (props.groomName || props.data?.groomName || 'pengantin').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const safeBride = (props.brideName || props.data?.brideName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    link.download = `qris-wedding-${safeGroom}${safeBride ? '-' + safeBride : ''}.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    window.open(url, '_blank')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  openModal,
  closeModal,
  isOpen
})
</script>

<style scoped>
.qris-fade-enter-active,
.qris-fade-leave-active {
  transition: opacity 0.25s ease;
}

.qris-fade-enter-from,
.qris-fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  0% {
    transform: scale(0.92);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
