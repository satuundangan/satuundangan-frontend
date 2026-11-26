<template>
  <div class="gift-registry-wrapper inline-block" data-test="gift-registry-wrapper">
    <!-- Trigger Button in Gift Section -->
    <button
      type="button"
      data-test="open-registry-modal-btn"
      class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      :class="buttonClass"
      @click="openModal"
    >
      <i class="fa-solid fa-gift text-base"></i>
      <span>{{ buttonText }}</span>
      <span
        v-if="availableCount > 0"
        class="ml-1 px-2 py-0.5 text-[10px] rounded-full font-black bg-white/20 text-current"
      >
        {{ availableCount }}
      </span>
    </button>

    <!-- Main Registry Modal Dialog -->
    <Teleport to="body">
      <Transition name="registry-fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
          data-test="registry-modal-backdrop"
          @click.self="closeModal"
        >
          <div
            class="relative w-full max-w-xl rounded-3xl bg-white p-5 sm:p-7 text-gray-800 shadow-2xl space-y-5 animate-scale-up border border-gray-100 max-h-[92vh] flex flex-col"
            data-test="registry-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="Wishlist Kado Pernikahan"
          >
            <!-- Close Button -->
            <button
              type="button"
              data-test="close-registry-modal-btn"
              class="absolute right-4 top-4 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200 flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
              aria-label="Tutup modal"
              @click="closeModal"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Modal Header -->
            <div class="space-y-1.5 text-center shrink-0 pr-6">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mb-1">
                <i class="fa-solid fa-gifts text-2xl"></i>
              </div>
              <h3 class="text-xl sm:text-2xl font-serif font-black tracking-tight text-gray-900">
                Wishlist Kado Pernikahan
              </h3>
              <p v-if="coupleDisplayName" class="text-xs text-amber-700 font-semibold">
                Kado Impian {{ coupleDisplayName }}
              </p>
              <p class="text-[11px] text-gray-500 max-w-md mx-auto leading-relaxed">
                Pilih kado impian yang ingin Anda berikan. Status kado akan otomatis terkunci agar tidak ada kado kembar/ganda.
              </p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="py-12 text-center text-gray-400 space-y-2">
              <i class="fa-solid fa-circle-notch animate-spin text-2xl text-amber-500"></i>
              <p class="text-xs font-semibold">Memuat daftar kado impian...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="items.length === 0" class="py-12 text-center text-gray-400 space-y-2">
              <i class="fa-solid fa-box-open text-3xl text-gray-300"></i>
              <p class="text-xs font-bold text-gray-600">Belum ada daftar kado impian</p>
              <p class="text-[11px] text-gray-400">Pengantin belum menambahkan item kado ke dalam daftar ini.</p>
            </div>

            <!-- Items List -->
            <div v-else class="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
              <div
                v-for="item in items"
                :key="item.id"
                class="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                :class="item.status === 'CLAIMED'
                  ? 'bg-slate-50 border-slate-200/70 opacity-80'
                  : 'bg-white border-amber-200/60 shadow-xs hover:border-amber-400'"
              >
                <!-- Item Info -->
                <div class="space-y-1 min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="font-bold text-sm text-gray-900 truncate">
                      {{ item.itemName }}
                    </h4>
                    <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                      {{ item.category || 'Lainnya' }}
                    </span>
                    <span
                      v-if="item.status === 'CLAIMED'"
                      class="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 shrink-0"
                    >
                      <i class="fa-solid fa-check text-[8px]"></i>
                      <span>Sudah Dipesan</span>
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0"
                    >
                      <span>Tersedia</span>
                    </span>
                  </div>

                  <p v-if="item.priceEstimate" class="text-xs font-black text-amber-800">
                    Est. {{ formatRupiah(item.priceEstimate) }}
                  </p>

                  <p v-if="item.notes" class="text-[11px] text-gray-500 line-clamp-2">
                    {{ item.notes }}
                  </p>

                  <!-- Claimer info if claimed -->
                  <p v-if="item.status === 'CLAIMED' && item.claimedByGuestName" class="text-[11px] text-slate-600 italic">
                    Dihadiahkan oleh: <strong>{{ item.claimedByGuestName }}</strong>
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <!-- Direct Marketplace Product Link -->
                  <a
                    v-if="item.productUrl"
                    :href="item.productUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    title="Buka link produk di toko online"
                  >
                    <span>Lihat Produk</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>

                  <!-- Claim Button -->
                  <button
                    v-if="item.status !== 'CLAIMED'"
                    type="button"
                    @click="openClaimModal(item)"
                    class="px-4 py-2 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:scale-95 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <i class="fa-solid fa-gift text-[11px]"></i>
                    <span>Saya Hadiahkan</span>
                  </button>
                  <span
                    v-else
                    class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 select-none"
                  >
                    Terklaim
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Note -->
            <div class="pt-2 text-center text-[10px] text-gray-400 border-t border-gray-100 shrink-0">
              Pengantin dapat melihat daftar ini secara langsung di dashboard persiapan pernikahan.
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Sub-Modal: Konfirmasi Klaim Kado Impian -->
    <Teleport to="body">
      <Transition name="registry-fade">
        <div
          v-if="selectedItemToClaim"
          class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          @click.self="selectedItemToClaim = null"
        >
          <div
            class="relative w-full max-w-md rounded-3xl bg-white p-6 text-gray-800 shadow-2xl space-y-4 animate-scale-up border border-gray-100"
          >
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-gift"></i>
                </div>
                <div>
                  <h4 class="font-black text-sm text-gray-900">Hadiahkan Kado Ini</h4>
                  <p class="text-[11px] text-gray-500">Kunci kado agar tidak ada tamu lain yang membeli kembar</p>
                </div>
              </div>
              <button
                type="button"
                @click="selectedItemToClaim = null"
                class="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="submitClaim" class="space-y-3 pt-1">
              <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs">
                <span class="text-gray-500 block text-[10px] font-bold uppercase tracking-wider">Kado yang dipilih:</span>
                <span class="font-black text-amber-900 block mt-0.5">{{ selectedItemToClaim.itemName }}</span>
                <span v-if="selectedItemToClaim.priceEstimate" class="text-[11px] text-amber-700 font-bold block">
                  Est. {{ formatRupiah(selectedItemToClaim.priceEstimate) }}
                </span>
              </div>

              <div>
                <label class="block text-xs font-black text-gray-700 mb-1">
                  Nama Anda <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="claimForm.guestName"
                  type="text"
                  required
                  placeholder="Cth: Budi Santoso / Rekan Kantor"
                  class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-black text-gray-700 mb-1">
                  Nomor WhatsApp / HP (Opsional)
                </label>
                <input
                  v-model="claimForm.phoneNumber"
                  type="tel"
                  placeholder="08123456789 (untuk ucapan terima kasih pengantin)"
                  class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-black text-gray-700 mb-1">
                  Pesan / Doa Singkat untuk Kado (Opsional)
                </label>
                <textarea
                  v-model="claimForm.notes"
                  rows="2"
                  placeholder="Cth: Semoga bermanfaat untuk rumah barunya ya!"
                  class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  @click="selectedItemToClaim = null"
                  :disabled="isClaiming"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="isClaiming"
                  class="px-5 py-2 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <i v-if="isClaiming" class="fa-solid fa-circle-notch animate-spin text-xs"></i>
                  <i v-else class="fa-solid fa-check text-xs"></i>
                  <span>Konfirmasi Hadiahkan Kado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getPublicGiftRegistry, getPublicGiftRegistryBySlug, claimGiftRegistryItem } from '@/api/giftRegistry'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  invitationId: {
    type: [Number, String],
    default: null,
  },
  slug: {
    type: String,
    default: '',
  },
  groomName: {
    type: String,
    default: '',
  },
  brideName: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Wishlist Kado Fisik',
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'light', 'dark', 'gold', 'retro', 'minimal'
  },
})

const isOpen = ref(false)
const loading = ref(false)
const items = ref([])
const selectedItemToClaim = ref(null)
const isClaiming = ref(false)

const claimForm = ref({
  guestName: '',
  phoneNumber: '',
  notes: '',
})

const resolvedInvitationId = computed(() => {
  return props.invitationId || props.data?.id || null
})

const resolvedSlug = computed(() => {
  return props.slug || props.data?.slug || ''
})

const coupleDisplayName = computed(() => {
  const g = props.groomName || props.data?.groomName || ''
  const b = props.brideName || props.data?.brideName || ''
  if (g && b) return `${g} & ${b}`
  return g || b || ''
})

const availableCount = computed(() => {
  return items.value.filter((i) => i.status !== 'CLAIMED').length
})

const buttonClass = computed(() => {
  switch (props.variant) {
    case 'dark':
      return 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
    case 'floating':
      return 'bg-slate-900/95 text-white border border-white/20 backdrop-blur-md shadow-2xl shadow-black/30 hover:bg-black'
    case 'light':
      return 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm'
    case 'gold':
      return 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#120e09] hover:brightness-110 shadow-[#d4af37]/20'
    case 'retro':
      return 'bg-[#2c2c2c] text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]'
    case 'minimal':
      return 'bg-transparent text-current border border-current hover:bg-current/10'
    default:
      return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25'
  }
})

function formatRupiah(num) {
  if (!num) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const playTone = (freq, time, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, time)
      gain.gain.setValueAtTime(0.001, time)
      gain.gain.exponentialRampToValueAtTime(0.18, time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(time)
      osc.stop(time + duration)
    }
    playTone(523.25, now, 0.25)
    playTone(659.25, now + 0.08, 0.25)
    playTone(783.99, now + 0.16, 0.35)
  } catch {
    // ignore
  }
}

async function fetchItems() {
  const invId = resolvedInvitationId.value
  const slug = resolvedSlug.value

  // Test environment guard when API URL is not configured
  if (import.meta.env.MODE === 'test' && !import.meta.env.VITE_API_URL && !window.__MOCK_GIFT_REGISTRY__) {
    return
  }

  // Live preview or demo mock data
  if ((!invId && !slug) || invId === 'live-preview' || invId === 0) {
    items.value = [
      {
        id: 'demo-1',
        itemName: 'Air Fryer Digital 4.5L',
        category: 'Peralatan Dapur',
        priceEstimate: 850000,
        productUrl: 'https://shopee.co.id',
        status: 'AVAILABLE',
        notes: 'Warna hitam atau sage green',
      },
      {
        id: 'demo-2',
        itemName: 'Set Bedcover King Size Tencel',
        category: 'Kamar Tidur',
        priceEstimate: 1200000,
        productUrl: 'https://tokopedia.com',
        status: 'CLAIMED',
        claimedByGuestName: 'Dian Permata',
        notes: 'Motif minimalis polos',
      },
      {
        id: 'demo-3',
        itemName: 'Robot Vacuum & Mop Cleaner',
        category: 'Elektronik Rumah',
        priceEstimate: 2100000,
        productUrl: 'https://ikea.co.id',
        status: 'AVAILABLE',
        notes: 'Untuk rumah baru kami',
      },
    ]
    return
  }

  loading.value = true
  try {
    let res
    if (invId) {
      res = await getPublicGiftRegistry(invId)
    } else {
      res = await getPublicGiftRegistryBySlug(slug)
    }
    const data = Array.isArray(res) ? res : res.data || []
    items.value = data
  } catch (err) {
    console.error('Failed to load gift registry items:', err)
  } finally {
    loading.value = false
  }
}

function openModal() {
  isOpen.value = true
  fetchItems()
}

function closeModal() {
  isOpen.value = false
  selectedItemToClaim.value = null
}

function openClaimModal(item) {
  selectedItemToClaim.value = item
  claimForm.value = {
    guestName: props.data?.guestName || '',
    phoneNumber: '',
    notes: '',
  }
}

async function submitClaim() {
  if (!selectedItemToClaim.value) return
  const item = selectedItemToClaim.value
  const guestName = claimForm.value.guestName.trim()
  if (!guestName) {
    toast.error('Nama Anda wajib diisi')
    return
  }

  isClaiming.value = true
  const previousStatus = item.status
  const previousClaimer = item.claimedByGuestName

  // 0ms Optimistic UI update
  item.status = 'CLAIMED'
  item.claimedByGuestName = guestName
  playSuccessChime()
  toast.success(`Terima kasih! Kado "${item.itemName}" berhasil Anda tandai.`)
  selectedItemToClaim.value = null

  try {
    const payload = {
      guestName,
      phoneNumber: claimForm.value.phoneNumber?.trim() || undefined,
      notes: claimForm.value.notes?.trim() || undefined,
    }
    await claimGiftRegistryItem(item.id, payload)
  } catch (err) {
    console.error('Claim error:', err)
    // Rollback on failure
    item.status = previousStatus
    item.claimedByGuestName = previousClaimer
    toast.error(err.message || 'Gagal mengeklaim kado. Mungkin kado baru saja diklaim tamu lain.')
  } finally {
    isClaiming.value = false
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (selectedItemToClaim.value) {
      selectedItemToClaim.value = null
    } else if (isOpen.value) {
      closeModal()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  // Preload items count in background
  fetchItems()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  openModal,
  closeModal,
  isOpen,
})
</script>

<style scoped>
.registry-fade-enter-active,
.registry-fade-leave-active {
  transition: opacity 0.25s ease;
}

.registry-fade-enter-from,
.registry-fade-leave-to {
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
