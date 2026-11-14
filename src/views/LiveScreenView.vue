<template>
  <div
    ref="rootEl"
    class="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none"
    data-testid="live-screen-container"
    @mousemove="handleUserActivity"
    @touchstart="handleUserActivity"
    @click="handleUserInteraction"
  >
    <!-- ============================================== -->
    <!-- AMBIENT SLIDESHOW BACKGROUND (Ken Burns & Cross-fade) -->
    <!-- ============================================== -->
    <div class="absolute inset-0 overflow-hidden" data-testid="ambient-slideshow">
      <transition-group name="kenburns-fade">
        <div
          v-for="(photo, index) in slidePhotos"
          v-show="currentSlideIndex === index"
          :key="photo"
          class="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform will-change-transform ken-burns-layer"
          :style="{ backgroundImage: `url(${photo})` }"
        />
      </transition-group>

      <!-- Luxurious Dark & Gold Radial Vignette Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/85 pointer-events-none"
      />
      <div
        class="absolute inset-0 pointer-events-none radial-gold-glow"
      />

      <!-- Subtle Ambient Gold Light Dust / Particles -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- OPERATOR TOOLBAR (Auto-Hide on Idle) -->
    <!-- ============================================== -->
    <transition name="toolbar-slide">
      <header
        v-show="isToolbarVisible"
        class="absolute top-0 inset-x-0 z-40 p-4 md:px-8 flex items-center justify-between backdrop-blur-md bg-slate-950/80 border-b border-amber-500/20 text-xs shadow-2xl transition-all duration-300"
        data-testid="operator-toolbar"
      >
        <!-- Left: Status Indicator -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60" data-testid="sync-status">
            <span
              class="w-2.5 h-2.5 rounded-full"
              :class="syncStatusClass"
            />
            <span class="font-medium text-slate-200">{{ syncStatusText }}</span>
          </div>

          <div v-if="greetingQueue.length > 0" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold" data-testid="greeting-queue-badge">
            <i class="fa-solid fa-users text-amber-400"></i>
            <span>Antrean Sapa: {{ greetingQueue.length }}</span>
          </div>
        </div>

        <!-- Center: Branding -->
        <div class="hidden md:flex items-center gap-2 text-amber-300/80 font-serif tracking-widest uppercase text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
          <span>SatuUndangan Live Stage Projector</span>
          <span class="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
        </div>

        <!-- Right: Operator Controls -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Button: Test Greeting Simulation -->
          <button
            type="button"
            @click="triggerGreetingSimulation"
            class="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            data-testid="btn-test-greeting"
            title="Uji coba animasi sambutan tamu (simulasi check-in)"
          >
            <span>✨ Tes Sambutan</span>
          </button>

          <!-- Button: Audio Chime Toggle -->
          <button
            type="button"
            @click="toggleAudio"
            class="px-3.5 py-1.5 rounded-xl border font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            :class="isAudioEnabled ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60' : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:bg-slate-800'"
            data-testid="btn-toggle-audio"
            :title="isAudioEnabled ? 'Matikan Suara Chime' : 'Aktifkan Suara Chime'"
          >
            <i :class="isAudioEnabled ? 'fa-solid fa-bell text-emerald-400' : 'fa-solid fa-bell-slash text-slate-500'"></i>
            <span>{{ isAudioEnabled ? '🔔 Suara: ON' : '🔕 Suara: OFF' }}</span>
          </button>

          <!-- Button: Fullscreen Toggle -->
          <button
            type="button"
            @click="toggleFullscreen"
            class="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            data-testid="btn-toggle-fullscreen"
            :title="isFullscreen ? 'Keluar Layar Penuh' : 'Masuk Layar Penuh'"
          >
            <i :class="isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'"></i>
            <span>{{ isFullscreen ? '🗗 Keluar Penuh' : '⛶ Layar Penuh' }}</span>
          </button>
        </div>
      </header>
    </transition>

    <!-- ============================================== -->
    <!-- MAIN STAGE DISPLAY (CENTER COUPLE & EVENT INFO) -->
    <!-- ============================================== -->
    <main class="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 pb-24 md:pb-28">
      <!-- Top Stage Header -->
      <div class="flex items-center justify-between text-center w-full">
        <div class="w-1/3 text-left">
          <!-- Subtle Top Left Brand Mark -->
          <span class="inline-flex items-center gap-2 text-xs md:text-sm font-light tracking-[0.25em] text-amber-200/60 uppercase">
            Wedding Reception
          </span>
        </div>

        <div class="w-1/3 flex justify-center">
          <div class="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent"></div>
        </div>

        <div class="w-1/3 text-right">
          <span class="text-xs md:text-sm font-light tracking-widest text-slate-400">
            {{ currentTimeString }}
          </span>
        </div>
      </div>

      <!-- Center Hero Couple Content -->
      <div class="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto space-y-6 my-auto">
        <!-- Subtitle badge -->
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 backdrop-blur-md shadow-lg shadow-black/40">
          <span class="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping"></span>
          <span class="text-xs md:text-sm uppercase tracking-[0.35em] font-serif text-amber-200">
            Walimatul 'Ursy
          </span>
        </div>

        <!-- Couple Names (Grand Serif Display) -->
        <h1
          class="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-extralight tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-[#d4af37] drop-shadow-2xl leading-none"
          data-testid="couple-names"
        >
          {{ coupleDisplay }}
        </h1>

        <!-- Decorative Divider -->
        <div class="flex items-center justify-center gap-4 w-full max-w-md my-2">
          <div class="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/60"></div>
          <span class="text-[#d4af37] text-sm">✦</span>
          <div class="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4af37]/60"></div>
        </div>

        <!-- Event Date -->
        <p
          class="text-lg sm:text-xl md:text-2xl font-light text-amber-100/90 tracking-widest font-serif"
          data-testid="event-date"
        >
          {{ formattedEventDate }}
        </p>

        <!-- Venue Location -->
        <p
          v-if="venueDisplay"
          class="text-sm sm:text-base md:text-lg text-slate-300 font-light flex items-center justify-center gap-2 tracking-wide max-w-2xl px-4"
          data-testid="venue-info"
        >
          <i class="fa-solid fa-location-dot text-[#d4af37]"></i>
          <span>{{ venueDisplay }}</span>
        </p>
      </div>

      <!-- Stage Bottom Placeholder space for Ticker & Corner elements -->
      <div class="h-6"></div>
    </main>

    <!-- ============================================== -->
    <!-- BOTTOM LIVE TICKER (Ucapan & Doa Restu Masuk) -->
    <!-- ============================================== -->
    <footer
      class="absolute bottom-0 inset-x-0 z-30 bg-slate-950/85 backdrop-blur-xl border-t border-[#d4af37]/30 py-3.5 px-6 md:px-12 flex items-center justify-between gap-6"
      data-testid="wishes-ticker"
    >
      <!-- Ticker Title / Live Badge -->
      <div class="flex items-center gap-2.5 shrink-0">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="text-xs md:text-sm font-semibold tracking-wider text-amber-300 uppercase whitespace-nowrap">
          Doa & Ucapan Tamu
        </span>
      </div>

      <!-- Ticker Rotating Content -->
      <div class="flex-1 overflow-hidden relative h-10 flex items-center">
        <transition name="wish-crossfade" mode="out-in">
          <div
            v-if="currentWish"
            :key="currentWish.id || currentWishIndex"
            class="flex items-center gap-3 text-xs md:text-sm text-slate-200 truncate w-full"
            data-testid="wish-message"
          >
            <span class="font-bold text-amber-200 shrink-0 flex items-center gap-1.5">
              <i class="fa-solid fa-comment-dots text-amber-400 text-xs"></i>
              {{ currentWish.senderName || currentWish.guestName || currentWish.name || 'Tamu Undangan' }}:
            </span>
            <span class="italic text-slate-300 truncate">
              "{{ currentWish.message }}"
            </span>
            <span
              v-if="currentWish.attendance || currentWish.rsvpStatus"
              class="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
            >
              Hadir
            </span>
          </div>
          <div
            v-else
            class="text-xs md:text-sm text-slate-400 italic flex items-center gap-2 truncate"
          >
            <i class="fa-solid fa-heart text-amber-400/70"></i>
            <span>Scan QR di sudut layar untuk mengirimkan doa restu & ucapan kepada kedua mempelai.</span>
          </div>
        </transition>
      </div>

      <!-- Slide counter or indicator -->
      <div v-if="wishesList.length > 1" class="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 font-mono shrink-0">
        <span>{{ currentWishIndex + 1 }}</span>
        <span>/</span>
        <span>{{ wishesList.length }}</span>
      </div>
    </footer>

    <!-- ============================================== -->
    <!-- CORNER QR CODE (Scan HP Tamu di Ballroom) -->
    <!-- ============================================== -->
    <aside
      class="absolute bottom-20 right-6 md:right-10 z-30 flex flex-col items-center bg-slate-900/90 backdrop-blur-md p-3 md:p-3.5 rounded-2xl border border-[#d4af37]/40 shadow-2xl transition-all duration-300 hover:scale-105"
      data-testid="corner-qr"
    >
      <div class="w-20 h-20 md:w-24 md:h-24 bg-white p-1 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
        <img
          v-if="qrDataUrl"
          :src="qrDataUrl"
          alt="QR Undangan"
          class="w-full h-full object-contain"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
          <i class="fa-solid fa-qrcode text-2xl"></i>
        </div>
      </div>
      <div class="mt-2 text-center">
        <span class="block text-[10px] md:text-[11px] font-bold text-amber-300 tracking-wider">
          SCAN UNDANGAN
        </span>
        <span class="block text-[9px] text-slate-400">
          Kirim Ucapan & Doa
        </span>
      </div>
    </aside>

    <!-- ============================================== -->
    <!-- POP-UP SAMBUTAN REAL-TIME (GREETING OVERLAY MODAL) -->
    <!-- ============================================== -->
    <transition name="greeting-modal">
      <div
        v-if="currentGreeting"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-950/85 backdrop-blur-xl"
        data-testid="greeting-modal"
        @click.self="dismissGreeting"
      >
        <!-- Modal Card Container -->
        <div
          class="relative w-full max-w-3xl rounded-3xl p-8 md:p-14 text-center border-2 border-[#d4af37] bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 shadow-[0_0_80px_rgba(212,175,55,0.35)] overflow-hidden transform will-change-transform"
        >
          <!-- Glowing Corner Decorations -->
          <div class="absolute -top-12 -left-12 w-36 h-36 bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-12 -right-12 w-36 h-36 bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Close / Dismiss button -->
          <button
            type="button"
            @click="dismissGreeting"
            class="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer text-sm"
            title="Tutup Sambutan"
          >
            ✕
          </button>

          <!-- Top Badge: Selamat Datang -->
          <div class="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#d4af37]/60 bg-[#d4af37]/15 text-[#d4af37] font-serif text-sm md:text-base tracking-[0.25em] uppercase font-bold mb-6 shadow-sm">
            <span>✨</span>
            <span data-testid="greeting-welcome-text">Selamat Datang</span>
            <span>✨</span>
          </div>

          <!-- Guest Name (Cinematic Highlight) -->
          <h2
            class="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-[#d4af37] drop-shadow-lg mb-3 tracking-wide leading-tight"
            data-testid="greeting-guest-name"
          >
            {{ currentGreeting.name || 'Tamu Terhormat' }}
          </h2>

          <!-- Degree / Gelar -->
          <p
            v-if="currentGreeting.degree"
            class="text-base md:text-lg text-amber-200/90 font-serif italic mb-4"
            data-testid="greeting-guest-degree"
          >
            {{ currentGreeting.degree }}
          </p>

          <!-- Group & Pax Badge -->
          <div class="flex items-center justify-center gap-3 mb-8 flex-wrap">
            <span
              v-if="currentGreeting.group"
              class="px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase bg-[#d4af37]/20 text-amber-200 border border-[#d4af37]/40 shadow-xs"
              data-testid="greeting-guest-group"
            >
              <i class="fa-solid fa-tag text-[#d4af37] mr-1.5 text-xs"></i>
              {{ currentGreeting.group }}
            </span>

            <span
              v-if="currentGreeting.pax"
              class="px-4 py-1.5 rounded-full text-xs md:text-sm font-medium bg-slate-800/80 text-slate-300 border border-slate-700"
            >
              <i class="fa-solid fa-user-group text-slate-400 mr-1.5 text-xs"></i>
              {{ currentGreeting.pax }} Orang
            </span>

            <span
              v-if="currentGreeting.checkedInAt"
              class="px-4 py-1.5 rounded-full text-xs md:text-sm font-mono text-slate-400 bg-slate-850/60 border border-slate-700/60"
            >
              <i class="fa-regular fa-clock mr-1 text-xs"></i>
              {{ formatCheckInTime(currentGreeting.checkedInAt) }}
            </span>
          </div>

          <!-- Warm Welcome Message -->
          <div class="max-w-xl mx-auto border-t border-[#d4af37]/30 pt-6">
            <p class="text-base md:text-xl font-light text-slate-200 font-serif leading-relaxed italic">
              "{{ currentGreeting.customGreeting || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran Bapak/Ibu/Saudara/i di hari bahagia kami.' }}"
            </p>
          </div>

          <!-- Progress Bar (7s duration indicator) -->
          <div class="absolute bottom-0 inset-x-0 h-1 bg-slate-800">
            <div class="h-full bg-gradient-to-r from-amber-400 to-[#d4af37] greeting-progress-bar"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import { getLiveScreenFeed } from '@/api/invitation'

const props = defineProps({
  slug: {
    type: String,
    default: null,
  },
})

const route = useRoute()
const currentSlug = computed(() => props.slug || route?.params?.slug || '')

// Elements & Fullscreen State
const rootEl = ref(null)
const isFullscreen = ref(false)

// Operator Toolbar Auto-Hide
const isToolbarVisible = ref(true)
let toolbarTimeout = null

// Audio Settings & Web Audio API
const isAudioEnabled = ref(true)
const audioCtx = ref(null)

// Feed & Stage Data
const invitationData = ref(null)
const recentCheckIns = ref([])
const wishesList = ref([])
const qrDataUrl = ref('')
const syncStatus = ref('connected') // 'connected' | 'syncing' | 'error'
const lastSyncTime = ref(null)

// Greeting Queue & Active Modal
const greetingQueue = ref([])
const currentGreeting = ref(null)
const seenCheckInIds = new Set()
let greetingTimer = null

// Ambient Slideshow State
const currentSlideIndex = ref(0)
const defaultSlides = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80',
]

// Wishes Ticker State
const currentWishIndex = ref(0)

// Clock State
const currentTimeString = ref('')

// Polling and Timer references
let pollInterval = null
let slideInterval = null
let wishInterval = null
let clockInterval = null

// Computed: Couple Name
const coupleDisplay = computed(() => {
  const inv = invitationData.value
  if (!inv) return 'Mempelai'
  if (inv.coupleName) return inv.coupleName
  const groom = inv.groomName || ''
  const bride = inv.brideName || ''
  if (groom && bride) return `${groom} & ${bride}`
  return inv.title || 'Mempelai'
})

// Computed: Formatted Event Date
const formattedEventDate = computed(() => {
  const inv = invitationData.value
  const rawDate = inv?.eventDate || inv?.dateTime || inv?.resepsiLocation?.date
  if (!rawDate) return ''
  try {
    const d = new Date(rawDate)
    if (isNaN(d.getTime())) return String(rawDate)
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return String(rawDate)
  }
})

// Computed: Venue Display
const venueDisplay = computed(() => {
  const inv = invitationData.value
  if (!inv) return ''
  if (inv.venueName) return inv.venueName
  if (inv.resepsiLocation) {
    if (typeof inv.resepsiLocation === 'string') return inv.resepsiLocation
    return inv.resepsiLocation.locationName || inv.resepsiLocation.address || ''
  }
  if (inv.akadLocation) {
    if (typeof inv.akadLocation === 'string') return inv.akadLocation
    return inv.akadLocation.locationName || inv.akadLocation.address || ''
  }
  return ''
})

// Computed: Slide Photos
const slidePhotos = computed(() => {
  const inv = invitationData.value
  const list = []
  if (Array.isArray(inv?.galleryImages) && inv.galleryImages.length > 0) {
    for (const img of inv.galleryImages) {
      if (typeof img === 'string' && img.trim()) list.push(img.trim())
      else if (img?.url) list.push(img.url)
    }
  }
  if (Array.isArray(inv?.gallery) && inv.gallery.length > 0) {
    for (const img of inv.gallery) {
      if (typeof img === 'string' && img.trim()) list.push(img.trim())
      else if (img?.url) list.push(img.url)
    }
  }
  if (inv?.photoCoupleUrl) list.push(inv.photoCoupleUrl)
  if (inv?.bridePhotoUrl) list.push(inv.bridePhotoUrl)
  if (inv?.groomPhotoUrl) list.push(inv.groomPhotoUrl)

  return list.length > 0 ? list : defaultSlides
})

// Computed: Current Slide Photo
const currentSlidePhoto = computed(() => {
  const photos = slidePhotos.value
  return photos[currentSlideIndex.value] || photos[0] || defaultSlides[0]
})

// Computed: Current Wish in Ticker
const currentWish = computed(() => {
  if (!wishesList.value || wishesList.value.length === 0) return null
  return wishesList.value[currentWishIndex.value] || wishesList.value[0]
})

// Computed: Sync Status Indicator
const syncStatusText = computed(() => {
  if (syncStatus.value === 'syncing') return 'Menghubungkan...'
  if (syncStatus.value === 'error') return 'Koneksi Terputus'
  return '🟢 Live Sync Terhubung'
})

const syncStatusClass = computed(() => {
  if (syncStatus.value === 'syncing') return 'bg-amber-400 animate-pulse'
  if (syncStatus.value === 'error') return 'bg-red-500'
  return 'bg-emerald-400 animate-pulse'
})

// User Activity: Auto-hide toolbar after 3 seconds idle
function handleUserActivity() {
  isToolbarVisible.value = true
  if (toolbarTimeout) clearTimeout(toolbarTimeout)
  toolbarTimeout = setTimeout(() => {
    isToolbarVisible.value = false
  }, 3000)
}

// User Interaction: Resume AudioContext if suspended
function handleUserInteraction() {
  handleUserActivity()
  if (audioCtx.value && audioCtx.value.state === 'suspended') {
    audioCtx.value.resume().catch(() => {})
  }
}

// Fullscreen API Handling
async function toggleFullscreen() {
  handleUserActivity()
  try {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen()
      }
      isFullscreen.value = true
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen()
      }
      isFullscreen.value = false
    }
  } catch (err) {
    console.warn('Fullscreen toggle failed:', err)
  }
}

function handleFullscreenChange() {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

// Audio Chime Toggle
function toggleAudio() {
  handleUserActivity()
  isAudioEnabled.value = !isAudioEnabled.value
  if (isAudioEnabled.value) {
    playChimeSound()
  }
}

// Web Audio API Pure Synthesis: Harmonic Luxury Bell Chime
function playChimeSound() {
  if (!isAudioEnabled.value) return
  if (typeof window === 'undefined') return
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return

  try {
    if (!audioCtx.value) {
      audioCtx.value = new AudioCtx()
    }
    if (audioCtx.value.state === 'suspended') {
      audioCtx.value.resume().catch(() => {})
    }
    const ctx = audioCtx.value
    const now = ctx.currentTime

    // 4 harmonic celestial notes (F5 -> A5 -> C6 -> F6)
    const chords = [
      { freq: 698.46, delay: 0.0, dur: 2.0 },
      { freq: 880.00, delay: 0.12, dur: 2.2 },
      { freq: 1046.50, delay: 0.25, dur: 2.5 },
      { freq: 1396.91, delay: 0.38, dur: 2.8 },
    ]

    chords.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + delay)

      // Harmonic bell partial overtone
      const overtone = ctx.createOscillator()
      const overtoneGain = ctx.createGain()
      overtone.type = 'triangle'
      overtone.frequency.setValueAtTime(freq * 2.76, now + delay)

      // Envelope: gentle fast attack, smooth long exponential decay
      gain.gain.setValueAtTime(0.0001, now + delay)
      gain.gain.exponentialRampToValueAtTime(0.25, now + delay + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur)

      overtoneGain.gain.setValueAtTime(0.0001, now + delay)
      overtoneGain.gain.exponentialRampToValueAtTime(0.05, now + delay + 0.02)
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur * 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)
      overtone.connect(overtoneGain)
      overtoneGain.connect(ctx.destination)

      osc.start(now + delay)
      osc.stop(now + delay + dur)
      overtone.start(now + delay)
      overtone.stop(now + delay + dur * 0.4)
    })
  } catch (err) {
    console.warn('Web Audio synthesis omitted:', err)
  }
}

// Format check-in time e.g., "Pukul 19:45 WIB"
function formatCheckInTime(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `Pukul ${h}:${m} WIB`
  } catch {
    return ''
  }
}

// Check-In Processing & Greeting Queue Management
function processNewCheckIns(checkIns) {
  if (!Array.isArray(checkIns)) return
  for (const guest of checkIns) {
    if (!guest) continue
    const key = guest.id || `${guest.name}-${guest.checkedInAt}`
    if (!seenCheckInIds.has(key)) {
      seenCheckInIds.add(key)
      enqueueGreeting(guest)
    }
  }
}

function enqueueGreeting(guest) {
  greetingQueue.value.push(guest)
  if (!currentGreeting.value) {
    showNextGreeting()
  }
}

function showNextGreeting() {
  if (greetingQueue.value.length === 0) {
    currentGreeting.value = null
    return
  }

  currentGreeting.value = greetingQueue.value.shift()
  playChimeSound()

  if (greetingTimer) clearTimeout(greetingTimer)
  // Display greeting for 7 seconds as required
  greetingTimer = setTimeout(() => {
    dismissGreeting()
  }, 7000)
}

function dismissGreeting() {
  if (greetingTimer) {
    clearTimeout(greetingTimer)
    greetingTimer = null
  }
  currentGreeting.value = null

  // If there are more greetings waiting in queue, show next after brief transition
  if (greetingQueue.value.length > 0) {
    setTimeout(() => {
      showNextGreeting()
    }, 400)
  }
}

// Test Simulation Button
function triggerGreetingSimulation() {
  handleUserActivity()
  const sampleGuests = [
    {
      id: `sim-${Date.now()}`,
      name: 'Bapak Hendra Kusuma & Keluarga',
      degree: 'S.Kom., M.T.',
      group: 'Tamu VIP',
      pax: 2,
      checkedInAt: new Date().toISOString(),
      customGreeting: 'Selamat Datang di Resepsi Pernikahan Kami.',
    },
    {
      id: `sim-${Date.now() + 1}`,
      name: 'Ibu Ratna Dewi & Rekan',
      degree: 'S.E., Ak.',
      group: 'Keluarga Besar',
      pax: 3,
      checkedInAt: new Date().toISOString(),
      customGreeting: 'Terima kasih atas kehadiran Bapak/Ibu.',
    },
  ]
  const chosen = sampleGuests[Math.floor(Math.random() * sampleGuests.length)]
  enqueueGreeting(chosen)
}

// Slideshow Next Slide
function nextSlide() {
  if (slidePhotos.value.length <= 1) return
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slidePhotos.value.length
}

// Wishes Ticker Next
function nextWish() {
  if (wishesList.value.length <= 1) return
  currentWishIndex.value = (currentWishIndex.value + 1) % wishesList.value.length
}

// Clock updates
function updateClock() {
  const d = new Date()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  currentTimeString.value = `${hours}:${minutes}:${seconds} WIB`
}

// Generate QR Code for Ballroom Mobile Scanners
async function generateQrCode(slug) {
  if (!slug) return
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://satuundangan.id'
    const targetUrl = `${origin}/inv/${slug}`
    qrDataUrl.value = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
  } catch (err) {
    console.warn('Failed to generate corner QR:', err)
  }
}

// Fetch Feed from Backend
async function fetchFeed() {
  if (!currentSlug.value) return
  try {
    const res = await getLiveScreenFeed(currentSlug.value)
    const feed = res?.data || res || {}

    if (feed.invitation) {
      invitationData.value = feed.invitation
    } else if (feed.groomName || feed.coupleName || feed.title) {
      invitationData.value = feed
    }

    // Process new check-ins
    const checkIns = feed.recentCheckIns || feed.checkIns || []
    recentCheckIns.value = checkIns
    processNewCheckIns(checkIns)

    // Process wishes / guest messages
    const wishes = feed.wishes || feed.guestMessages || feed.messages || []
    if (Array.isArray(wishes) && wishes.length > 0) {
      wishesList.value = wishes
    }

    syncStatus.value = 'connected'
    lastSyncTime.value = new Date()
  } catch (err) {
    console.error('Error fetching live screen feed:', err)
    syncStatus.value = 'error'
  }
}

watch(currentSlug, (newSlug) => {
  if (newSlug) {
    generateQrCode(newSlug)
    fetchFeed()
  }
})

onMounted(async () => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)

  if (currentSlug.value) {
    generateQrCode(currentSlug.value)
    await fetchFeed()
  }

  // Setup periodic polling every 3.5s
  pollInterval = setInterval(fetchFeed, 3500)

  // Slideshow rotation every 9s
  slideInterval = setInterval(nextSlide, 9000)

  // Wishes ticker rotation every 6s
  wishInterval = setInterval(nextWish, 6000)

  // Event Listeners
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  }

  // Auto-hide toolbar initial countdown
  handleUserActivity()
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (slideInterval) clearInterval(slideInterval)
  if (wishInterval) clearInterval(wishInterval)
  if (clockInterval) clearInterval(clockInterval)
  if (greetingTimer) clearTimeout(greetingTimer)
  if (toolbarTimeout) clearTimeout(toolbarTimeout)

  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  }

  if (audioCtx.value) {
    try {
      audioCtx.value.close().catch(() => {})
    } catch {}
    audioCtx.value = null
  }
})
</script>

<style scoped>
/* Ken Burns Smooth Pan & Zoom Effect */
.ken-burns-layer {
  animation: kenburnsEffect 18s ease-in-out infinite alternate;
}

@keyframes kenburnsEffect {
  0% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1.08) translate(-1.5%, -1%);
  }
}

/* Luxury Gold Glow Vignette */
.radial-gold-glow {
  background: radial-gradient(
    circle at 50% 45%,
    rgba(212, 175, 55, 0.12) 0%,
    rgba(15, 23, 42, 0.4) 60%,
    rgba(2, 6, 23, 0.85) 100%
  );
}

/* Subtle Floating Light Particles */
.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #fde047 0%, rgba(212, 175, 55, 0) 70%);
  filter: blur(1px);
  animation: floatParticle 14s infinite linear;
}

.particle-1 {
  width: 6px;
  height: 6px;
  top: 20%;
  left: 15%;
  animation-duration: 16s;
}

.particle-2 {
  width: 10px;
  height: 10px;
  top: 60%;
  left: 80%;
  animation-duration: 22s;
  animation-delay: -5s;
}

.particle-3 {
  width: 8px;
  height: 8px;
  top: 75%;
  left: 25%;
  animation-duration: 18s;
  animation-delay: -10s;
}

.particle-4 {
  width: 5px;
  height: 5px;
  top: 30%;
  left: 70%;
  animation-duration: 14s;
  animation-delay: -7s;
}

.particle-5 {
  width: 7px;
  height: 7px;
  top: 45%;
  left: 40%;
  animation-duration: 20s;
  animation-delay: -12s;
}

@keyframes floatParticle {
  0% {
    transform: translateY(0) translateX(0) scale(0.8);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-40px) translateX(25px) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-80px) translateX(0) scale(0.8);
    opacity: 0.2;
  }
}

/* Greeting Progress Bar Animation (7 Seconds Duration) */
.greeting-progress-bar {
  animation: progressTimer 7s linear forwards;
}

@keyframes progressTimer {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

/* Transitions */
.kenburns-fade-enter-active,
.kenburns-fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.kenburns-fade-enter-from,
.kenburns-fade-leave-to {
  opacity: 0;
}

.toolbar-slide-enter-active,
.toolbar-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toolbar-slide-enter-from,
.toolbar-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.greeting-modal-enter-active,
.greeting-modal-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.greeting-modal-enter-from {
  opacity: 0;
  transform: scale(0.92);
}
.greeting-modal-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.wish-crossfade-enter-active,
.wish-crossfade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.wish-crossfade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.wish-crossfade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
