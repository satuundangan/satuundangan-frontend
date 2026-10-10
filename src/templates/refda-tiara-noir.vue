<template>
  <main class="noir-invitation" :style="themeStyle">
    <MusicControl
      ref="musicControl"
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#111111"
      accentColor="#f4f1e9"
      class="z-[70]"
    />

    <div v-if="!showCover" class="firefly-field" aria-hidden="true">
      <span
        v-for="firefly in fireflies"
        :key="firefly.id"
        class="firefly"
        :style="{
          left: firefly.left,
          top: firefly.top,
          animationDelay: firefly.delay,
          animationDuration: firefly.duration,
        }"
      ></span>
    </div>

    <transition name="cover-fade">
      <div v-if="showCover" class="cover-screen" aria-label="Sampul undangan">
        <div class="cover-media" aria-hidden="true">
          <video
            v-if="backgroundType === 'video' && /\.(?:mp4|webm)(?:[?#]|$)/i.test(backgroundUrl)"
            :src="backgroundUrl"
            :poster="isPlaceholderMedia(data.photoCoupleUrl) ? undefined : data.photoCoupleUrl"
            muted
            loop
            playsinline
            :autoplay="!prefersReducedMotion"
            class="cover-image"
          ></video>
          <img v-else-if="backgroundType !== 'video' && backgroundUrl" :src="backgroundUrl" alt="" class="cover-image" />
          <div class="cover-shade"></div>
          <div class="glow-blob glow-blob--top"></div>
          <div class="glow-blob glow-blob--bottom"></div>
          <div class="star-field">
            <span
              v-for="star in stars"
              :key="star.id"
              class="star"
              :style="{ left: star.left, top: star.top, animationDelay: star.delay }"
            ></span>
            <span
              v-for="firefly in fireflies"
              :key="firefly.id"
              class="firefly"
              :style="{
                left: firefly.left,
                top: firefly.top,
                animationDelay: firefly.delay,
                animationDuration: firefly.duration,
              }"
            ></span>
          </div>
        </div>
        <div class="cover-frame" aria-hidden="true"></div>

        <div class="cover-content">
          <p class="eyebrow">The Wedding Of</p>
          <span class="hairline" aria-hidden="true"></span>

          <div class="cover-names">
            <span>{{ data.groomName || 'Muhammad Refda' }}</span>
            <span class="ampersand">&amp;</span>
            <span>{{ data.brideName || 'Uk Tiara Ayu' }}</span>
          </div>

          <p class="cover-date">{{ formatDate(eventDate) }}</p>

          <div class="guest-line">
            <span>Kepada Yth.</span>
            <strong>{{ displayGuestName }}</strong>
          </div>

          <button class="open-button" type="button" @click="openInvitation">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path v-for="d in ENVELOPE_ICON" :key="d" :d="d" />
            </svg>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </transition>

    <div v-if="!showCover" ref="scroller" class="noir-scroller">
      <section id="home" data-nav="home" class="snap-section hero-section">
        <p class="eyebrow">The beginning of always</p>
        <h1 class="hero-names">
          <span>{{ data.groomName || 'Muhammad Refda' }}</span>
          <span class="ampersand">&amp;</span>
          <span>{{ data.brideName || 'Uk Tiara Ayu' }}</span>
        </h1>
        <div class="hero-rule"><span></span><i aria-hidden="true">✳</i><span></span></div>
        <p class="hero-date">{{ formatDate(eventDate) }}</p>
        <p v-if="heroCopy" class="hero-copy">{{ heroCopy }}</p>
        <p v-else class="hero-copy">
          Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang Anda untuk hadir
          dalam hari bahagia kami.
        </p>
      </section>

      <section v-if="sectionVisibility.quote" id="quote" data-nav="quote" class="snap-section quote-section">
        <span class="section-number">DOA</span>
        <blockquote>“{{ data.quoteText }}”</blockquote>
        <p v-if="data.quoteSource" class="quote-source">{{ data.quoteSource }}</p>
      </section>

      <section v-if="sectionVisibility.couple" id="couple" data-nav="couple" class="snap-section couple-section">
        <span class="section-number">MEMPELAI</span>
        <div class="couple-grid">
          <article class="person-card">
            <img :src="groomPhotoSrc" :alt="data.groomName || 'Refda'" @error="usePortraitFallback($event, 'refda')" />
            <p class="eyebrow">Mempelai pria</p>
            <h2>{{ data.groomName || 'Muhammad Refda' }}</h2>
            <p v-if="groomParents">{{ groomParents }}</p>
          </article>
          <div class="couple-divider" aria-hidden="true">&amp;</div>
          <article class="person-card">
            <img :src="bridePhotoSrc" :alt="data.brideName || 'Tiara'" @error="usePortraitFallback($event, 'tiara')" />
            <p class="eyebrow">Mempelai wanita</p>
            <h2>{{ data.brideName || 'Uk Tiara Ayu' }}</h2>
            <p v-if="brideParents">{{ brideParents }}</p>
          </article>
        </div>
      </section>

      <section v-if="sectionVisibility.story" id="story" data-nav="story" class="snap-section story-section">
        <span class="section-number">CERITA</span>
        <h2 class="section-title">Jalan yang mempertemukan</h2>
        <div class="story-list">
          <article v-for="(story, index) in data.loveStory" :key="`${story.title}-${index}`">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <p class="story-date">{{ story.date }}</p>
              <h3>{{ story.title }}</h3>
              <p>{{ story.description || story.content }}</p>
            </div>
          </article>
        </div>
      </section>

      <section v-if="sectionVisibility.event" id="event" data-nav="event" class="snap-section event-section">
        <span class="section-number">ACARA</span>
        <h2 class="section-title">Hari istimewa kami</h2>
        <div class="event-grid">
          <article v-for="item in events" :key="item.label" class="event-card">
            <p class="eyebrow">{{ item.label }}</p>
            <h3>{{ formatDate(item.dateTime) }}</h3>
            <p class="event-time">{{ eventTimeRange() }}</p>
            <p class="event-place">{{ item.description || DEFAULT_VENUE }}</p>
            <a v-if="eventMapUrl(item)" :href="eventMapUrl(item)" target="_blank" rel="noopener noreferrer">
              Lihat lokasi <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </section>

      <section v-if="sectionVisibility.rundown" id="rundown" data-nav="rundown" class="snap-section rundown-section">
        <span class="section-number">RUNDOWN</span>
        <h2 class="section-title">Susunan acara</h2>
        <ol class="rundown-list">
          <li v-for="(item, index) in rundownItems" :key="`${item.time}-${index}`">
            <time>{{ item.time }}</time>
            <span>{{ item.title }}</span>
          </li>
        </ol>
      </section>

      <section v-if="sectionVisibility.video" id="video" data-nav="video" class="snap-section video-section">
        <div class="video-intro">
          <span class="section-number">VIDEO / KENANGAN</span>
          <h2 class="section-title">Sepotong cerita kami</h2>
          <p>Setelah 3 tahun bersama, Kami memutuskan untuk hidup selamanya</p>
        </div>
        <div class="video-frame" :class="{ 'is-youtube': !!youtubeEmbedUrl }">
          <iframe
            v-if="youtubeEmbedUrl"
            :src="youtubeEmbedUrl"
            title="Video Refda dan Tiara"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
          <video
            v-else
            :src="directVideoUrl"
            :poster="directVideoUrl.includes('/assets/videos/refda-tiara/prewedding.mp4') ? '/assets/videos/refda-tiara/poster.jpg' : bridePhotoSrc"
            controls
            playsinline
            preload="metadata"
            aria-label="Video Refda dan Tiara"
          ></video>
        </div>
      </section>

      <section v-if="sectionVisibility.gallery" id="gallery" data-nav="gallery" class="snap-section gallery-section">
        <span class="section-number">POTRET</span>
        <h2 class="section-title">Sebuah jeda, untuk dikenang</h2>
        <div class="gallery-grid">
          <img v-for="(item, index) in galleryItems" :key="`${item.src}-${index}`" :src="item.src" :alt="item.alt" loading="lazy" />
        </div>
      </section>

      <section v-if="sectionVisibility.gift" id="gift" data-nav="gift" class="snap-section gift-section">
        <span class="section-number">TANDA KASIH</span>
        <h2 class="section-title">Doa Anda adalah hadiah terbaik</h2>
        <article v-for="(account, index) in data.bankAccounts || []" :key="`${account.accountNumber}-${index}`" class="gift-card">
          <p class="eyebrow">{{ account.bankName }}</p>
          <strong>{{ account.accountNumber }}</strong>
          <span>{{ account.accountName }}</span>
          <button type="button" @click="copyText(account.accountNumber)">Salin nomor rekening</button>
        </article>
        <p v-for="(address, index) in giftAddresses" :key="index" class="gift-address">{{ address }}</p>
      </section>

      <section v-if="sectionVisibility.rsvp" id="rsvp" data-nav="rsvp" class="snap-section rsvp-section">
        <span class="section-number">KONFIRMASI</span>
        <h2 class="section-title">Kehadiran Anda Sangat Berarti</h2>
        <p class="rsvp-intro">Mohon konfirmasikan kehadiran Anda melalui formulir berikut.</p>

        <form class="rsvp-form" @submit.prevent="submitRSVP">
          <label for="rsvp-name">Nama</label>
          <input id="rsvp-name" v-model.trim="rsvp.name" type="text" autocomplete="name" required />

          <fieldset>
            <legend>Kehadiran</legend>
            <div class="attendance-options">
              <button
                type="button"
                :aria-pressed="rsvp.attendance === 'hadir'"
                :class="{ selected: rsvp.attendance === 'hadir' }"
                @click="rsvp.attendance = 'hadir'"
              >Hadir</button>
              <button
                type="button"
                :aria-pressed="rsvp.attendance === 'tidak'"
                :class="{ selected: rsvp.attendance === 'tidak' }"
                @click="rsvp.attendance = 'tidak'"
              >Berhalangan</button>
            </div>
          </fieldset>

          <label for="rsvp-message" class="rsvp-message-label">Ucapan dan doa <span>(opsional)</span></label>
          <textarea id="rsvp-message" v-model.trim="rsvp.message" rows="4"></textarea>
          <button class="submit-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Mengirim…' : 'Kirim konfirmasi' }}
          </button>
        </form>
      </section>

      <footer id="closing" data-nav="rsvp" class="snap-section closing-section">
        <span class="eyebrow">Terima kasih atas doa dan kehadiran Anda</span>
        <p>{{ data.groomName || 'Muhammad Refda' }} <span>&amp;</span> {{ data.brideName || 'Uk Tiara Ayu' }}</p>
        <small>{{ data.footerText || 'Dengan penuh rasa syukur, Refda & Tiara' }}</small>
      </footer>
    </div>

    <nav v-if="!showCover" class="glass-nav" aria-label="Navigasi undangan">
      <div ref="navInner" class="glass-nav__inner" :class="{ 'is-crowded': navItems.length > 8 }">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="glass-nav__item"
          :class="{ 'is-active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'true' : undefined"
          @click="scrollToSection(item.id)"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path v-for="d in item.icon" :key="d" :d="d" />
          </svg>
          <span class="glass-nav__label">{{ item.label }}</span>
        </button>
      </div>
    </nav>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { createGuestMessage } from '@/api/guestMessage'
import MusicControl from '@/components/invitation/MusicControl.vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const DEFAULT_EVENT_START = '08:00'
const DEFAULT_EVENT_END = '12:30'
const DEFAULT_VENUE = 'Lume Coffee'
const DEFAULT_RUNDOWN = [
  { time: '08.00', title: 'Tamu hadir & snack box' },
  { time: '08.15', title: 'Pembukaan & mempelai memasuki tempat akad' },
  { time: '08.40', title: 'Akad nikah (ijab kabul)' },
  { time: '09.05', title: 'Sungkeman' },
  { time: '09.30', title: 'Adat Jawa' },
  { time: '10.00', title: 'Resepsi — makan, foto bersama, ramah tamah' },
  { time: '11.00', title: 'Games & lempar bunga' },
  { time: '11.30', title: 'Karaoke keluarga' },
  { time: '12.30', title: 'Selesai' },
]

const toast = useToast()
const musicControl = ref(null)
const data = computed(() => props.data || {})
const showCover = ref(true)
const isSubmitting = ref(false)
const prefersReducedMotion = ref(false)
const scroller = ref(null)
const navInner = ref(null)
const activeSection = ref('home')
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
let spyObserver = null
let reducedMotionQuery = null
let onReducedMotionChange = null

const stars = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${(index * 47 + 9) % 100}%`,
  top: `${(index * 71 + 13) % 100}%`,
  delay: `-${(index % 9) * 0.55}s`,
}))

const fireflies = Array.from({ length: 7 }, (_, index) => ({
  id: index,
  left: `${(index * 31 + 14) % 92}%`,
  top: `${(index * 43 + 19) % 84}%`,
  delay: `-${index * 1.4}s`,
  duration: `${8 + (index % 4) * 2}s`,
}))

const designSettings = computed(() => data.value.designSettings || {})

// Studio writes `designSettings.heroCopy`. `data.heroCopy` and `HERO_COPY` are legacy
// fallbacks. When all are empty the template's default sentence (v-else) is shown.
const HERO_COPY = ''
const heroCopy = computed(() =>
  String(designSettings.value.heroCopy || data.value.heroCopy || HERO_COPY || '').trim(),
)
const backgroundType = computed(() => designSettings.value.backgroundType || 'image')
const isPlaceholderMedia = (url) => !url || /\/(?:default-groom|default-bride|default-couple)\.(?:png|jpe?g|webp)(?:\?|$)/i.test(url)
const backgroundUrl = computed(() => {
  if (designSettings.value.backgroundUrl) return designSettings.value.backgroundUrl
  if (backgroundType.value === 'video') return ''
  return isPlaceholderMedia(data.value.photoCoupleUrl) ? '' : data.value.photoCoupleUrl
})
const groomPhotoSrc = computed(() => isPlaceholderMedia(data.value.groomPhotoUrl) ? '/assets/images/refda-tiara/refda.png' : data.value.groomPhotoUrl)
const bridePhotoSrc = computed(() => isPlaceholderMedia(data.value.bridePhotoUrl) ? '/assets/images/refda-tiara/tiara.png' : data.value.bridePhotoUrl)
const groomParents = computed(() => {
  const value = data.value.parents?.groomParents || data.value.groomParents || ''
  return /^bapak\s*&\s*ibu\s+refda$/i.test(value.trim()) ? '' : value
})
const brideParents = computed(() => {
  const value = data.value.parents?.brideParents || data.value.brideParents || ''
  return /^bapak\s*&\s*ibu\s+tiara$/i.test(value.trim()) ? '' : value
})
const videoSource = computed(() => String(data.value.videoPrewedding || '').trim())
const youtubeEmbedUrl = computed(() => {
  try {
    const url = new URL(videoSource.value)
    const host = url.hostname.toLowerCase()
    let id = ''
    if (host === 'youtu.be' || host === 'www.youtu.be') id = url.pathname.slice(1)
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(host)) {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || ''
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : ''
  } catch { return '' }
})
const directVideoUrl = computed(() => {
  const source = videoSource.value
  if (source.startsWith('blob:')) return source
  if (!/\.(?:mp4|webm)(?:[?#]|$)/i.test(source)) return ''
  if (source.startsWith('/') && !source.startsWith('//')) return source
  try { return new URL(source).protocol === 'https:' ? source : '' } catch { return '' }
})
const titleScale = computed(() => {
  const scale = Number(designSettings.value.titleScale)
  return Number.isFinite(scale) ? Math.min(1.2, Math.max(0.8, scale)) : 1
})
const fontStacks = {
  'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
  'Libre Baskerville': "'Libre Baskerville', Georgia, serif",
  'DM Sans': "'DM Sans', Arial, sans-serif",
}
const titleFont = computed(
  () => fontStacks[designSettings.value.fontFamily] || fontStacks['Cormorant Garamond'],
)
const themeStyle = computed(() => ({
  '--title-font': titleFont.value,
  '--title-scale': titleScale.value,
}))

const eventDate = computed(
  () => data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime,
)
const displayGuestName = computed(() => {
  const name = data.value.guestName
  return name && name !== 'Tamu Undangan' ? name : 'Tamu Undangan'
})
const events = computed(() => {
  const akad = data.value.akadLocation || {}
  const resepsi = data.value.resepsiLocation || {}
  if (data.value.isSingleEvent || data.value.mergeEvents) {
    const event = akad.dateTime || akad.description || akad.mapUrl ? akad : resepsi
    return [{ label: 'Akad & resepsi', ...event }]
  }
  return [
    { label: 'Akad nikah', ...akad },
    { label: 'Resepsi', ...resepsi },
  ].filter((event) => event.dateTime || event.description || event.mapUrl)
})
const showRundown = computed(
  () => !(designSettings.value.hideRundown || data.value.hideRundown),
)
const rundownItems = computed(() => {
  const custom = data.value.rundown
  const items = Array.isArray(custom) ? custom.filter((i) => i && (i.time || i.title)) : []
  return items.length ? items : DEFAULT_RUNDOWN
})
const giftAddresses = computed(() => {
  const value = data.value.giftDeliveryAddress
  return Array.isArray(value) ? value : value ? [value] : []
})
const hasGiftDetails = computed(
  () => (data.value.bankAccounts?.length || 0) > 0 || giftAddresses.value.length > 0,
)

const galleryItems = computed(() =>
  (data.value.galleryImages || [])
    .map((image) => (typeof image === 'string' ? image : image?.url || image?.src))
    .filter(Boolean)
    .map((src) => ({ src, thumbnail: src, alt: 'Potret Refda dan Tiara' })),
)

// Single source of truth for both the bottom nav and every section v-if.
const sectionVisibility = computed(() => ({
  home: true,
  quote: isSectionEnabled('quote') && !!data.value.quoteText,
  couple: isSectionEnabled('couple') || isSectionEnabled('photoCouple'),
  story: isSectionEnabled('love-story') && (data.value.loveStory?.length || 0) > 0,
  event: isSectionEnabled('event'),
  rundown: showRundown.value,
  video: isSectionEnabled('video') && !!(youtubeEmbedUrl.value || directVideoUrl.value),
  gallery: isSectionEnabled('gallery') && galleryItems.value.length > 0,
  gift: isSectionEnabled('gift') && hasGiftDetails.value,
  rsvp: isSectionEnabled('rsvp'),
}))

const ENVELOPE_ICON = [
  'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'M22 7l-10 6L2 7',
]
const NAV_DEFS = [
  { id: 'home', label: 'Awal', icon: ['M3 10.5 12 3l9 7.5', 'M5 9.5V21h14V9.5', 'M10 21v-6h4v6'] },
  { id: 'quote', label: 'Doa', icon: ['M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z', 'M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z'] },
  { id: 'couple', label: 'Mempelai', icon: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 22l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z'] },
  { id: 'story', label: 'Cerita', icon: ['M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z', 'M16 8 2 22', 'M17.5 15H9'] },
  { id: 'event', label: 'Acara', icon: ['M8 2v4', 'M16 2v4', 'M3 8h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'] },
  { id: 'rundown', label: 'Rundown', icon: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'] },
  { id: 'video', label: 'Video', icon: ['M5 3l14 9-14 9V3z'] },
  { id: 'gallery', label: 'Galeri', icon: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M21 15l-5-5L5 21'] },
  { id: 'gift', label: 'Hadiah', icon: ['M20 12v10H4V12', 'M2 7h20v5H2z', 'M12 22V7', 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z', 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'] },
  { id: 'rsvp', label: 'RSVP', icon: ENVELOPE_ICON },
]
const navItems = computed(() => NAV_DEFS.filter((item) => sectionVisibility.value[item.id]))

function isSectionEnabled(key) {
  const selected = data.value.selectedSections
  if (!Array.isArray(selected) || selected.length === 0) return true
  const aliases = {
    couple: ['couple', 'photoCouple', 'mempelai'],
    photoCouple: ['photoCouple', 'couple', 'mempelai'],
    event: ['event', 'event-details', 'acara'],
    rsvp: ['rsvp'],
    quote: ['quote'],
    'love-story': ['love-story', 'loveStory', 'story'],
    gallery: ['gallery'],
    gift: ['gift', 'digital-envelope'],
    video: ['video', 'video-prewedding'],
  }
  return (aliases[key] || [key]).some((item) => selected.includes(item))
}

function getMusicUrl(choice) {
  if (!choice || choice === 'default') return null
  if (choice.startsWith('yt:')) return choice
  return choice.includes('/') || choice.includes('http') ? choice : `/audio/${choice}`
}

function formatDate(value) {
  if (!value) return 'Tanggal menyusul'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Tanggal menyusul'
    : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// The displayed time is pinned (not derived from dateTime): the stored dateTime
// may be a UTC value that would render at the wrong WIB hour.
function eventTimeRange() {
  const start =
    designSettings.value.eventStartTime || data.value.eventStartTime || DEFAULT_EVENT_START
  const end = designSettings.value.eventEndTime || data.value.eventEndTime || DEFAULT_EVENT_END
  return `${String(start).replace(':', '.')} – ${String(end).replace(':', '.')} WIB`
}

function initScrollSpy() {
  if (spyObserver) spyObserver.disconnect()
  spyObserver = null
  if (!scroller.value || typeof IntersectionObserver === 'undefined') return
  // A thin band at the viewport centre detects the section in view, which also works
  // for sections taller than the screen.
  spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.dataset.nav
      })
    },
    { root: scroller.value, rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  )
  scroller.value.querySelectorAll('[data-nav]').forEach((el) => spyObserver.observe(el))
}

function scrollToSection(id) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion.value ? 'auto' : 'smooth', block: 'start' })
  activeSection.value = id
}

async function openInvitation() {
  musicControl.value?.play()
  showCover.value = false
  await nextTick()
  scroller.value?.scrollTo({ top: 0 })
  initScrollSpy()
}

watch(navItems, () => {
  if (!showCover.value) nextTick(initScrollSpy)
})

watch(activeSection, () => {
  nextTick(() => {
    navInner.value
      ?.querySelector('.glass-nav__item.is-active')
      ?.scrollIntoView({
        inline: 'nearest',
        block: 'nearest',
        behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
      })
  })
})

function copyText(value) {
  if (!value) return
  if (!navigator.clipboard?.writeText) {
    toast.error('Nomor rekening belum bisa disalin.')
    return
  }
  navigator.clipboard.writeText(value).then(
    () => toast.success('Nomor rekening disalin.'),
    () => toast.error('Nomor rekening belum bisa disalin.'),
  )
}

function usePortraitFallback(event, person) {
  const fallback = `/assets/images/refda-tiara/${person}.png`
  if (!event.target.src.endsWith(fallback)) event.target.src = fallback
}

function eventMapUrl(item) {
  if (item.mapUrl && !/example/i.test(item.mapUrl)) {
    try {
      const url = new URL(item.mapUrl)
      if (['https:', 'http:'].includes(url.protocol)) return url.href
    } catch { /* Fall back to a search using the venue. */ }
  }
  if (!item.description) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.description)}`
}

async function submitRSVP() {
  if (!rsvp.value.name) return
  if (!data.value.id || data.value.id === 'live-preview' || data.value.id === 0) {
    toast.info('Konfirmasi akan aktif setelah undangan disimpan.')
    return
  }

  isSubmitting.value = true
  try {
    await createGuestMessage({
      invitationId: Number(data.value.id),
      guestName: rsvp.value.name,
      message: rsvp.value.message || '-',
      rsvpStatus: rsvp.value.attendance,
      totalGuests: rsvp.value.attendance === 'hadir' ? 1 : 0,
    })
    toast.success('Terima kasih atas konfirmasi Anda.')
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
  } catch {
    toast.error('Konfirmasi belum terkirim. Silakan coba kembali.')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => data.value.guestName,
  (name) => {
    if (name && name !== 'Tamu Undangan') rsvp.value.name = name
  },
  { immediate: true },
)

onMounted(() => {
  reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') || null
  prefersReducedMotion.value = reducedMotionQuery?.matches || false
  onReducedMotionChange = (event) => {
    prefersReducedMotion.value = event.matches
  }
  reducedMotionQuery?.addEventListener?.('change', onReducedMotionChange)
})

onUnmounted(() => {
  if (spyObserver) spyObserver.disconnect()
  spyObserver = null
  reducedMotionQuery?.removeEventListener?.('change', onReducedMotionChange)
  if (scroller.value) scroller.value.scrollTop = 0
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap');

.noir-invitation {
  --ink: #0c0c0c;
  --paper: #f4f2ed;
  --text: #efede7;
  --muted: #aaa8a2;
  --line: rgba(239, 237, 231, 0.22);
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  color: var(--text);
  background: var(--ink);
  font-family: 'DM Sans', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.cover-screen {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #080808;
  isolation: isolate;
}
.cover-fade-leave-active { transition: opacity .8s ease; }
.cover-fade-leave-to { opacity: 0; }

.glow-blob { position: absolute; width: 18rem; height: 18rem; border-radius: 50%; background: rgba(244, 242, 237, .06); filter: blur(120px); pointer-events: none; }
.glow-blob--top { top: -4rem; left: -5rem; }
.glow-blob--bottom { right: -5rem; bottom: -4rem; }
.cover-frame { position: absolute; z-index: 1; inset: 1rem; border: 1px solid rgba(244, 242, 237, .18); border-radius: 3rem; pointer-events: none; }

.cover-media,
.cover-shade,
.star-field {
  position: absolute;
  inset: 0;
}

.cover-media { z-index: -1; }
.cover-image { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); }
.cover-shade { background: linear-gradient(180deg, rgba(5, 5, 5, .46), rgba(5, 5, 5, .78) 72%, #080808); }
.star-field { overflow: hidden; }
.firefly-field { position: fixed; z-index: 19; inset: 0; overflow: hidden; pointer-events: none; }
.star,
.firefly { position: absolute; border-radius: 50%; pointer-events: none; }
.star { width: 2px; height: 2px; background: #f4f1e9; opacity: .25; animation: twinkle 4s ease-in-out infinite; }
.firefly { width: 4px; height: 4px; background: #f7d84a; box-shadow: 0 0 12px 3px rgba(247, 216, 74, .62); opacity: 0; animation: drift 12s ease-in-out infinite; }

.cover-content { position: relative; z-index: 2; width: min(760px, 100%); padding: 3rem 1.5rem; text-align: center; }
.hairline { display: block; width: 48px; height: 1px; margin: .9rem auto 1.6rem; background: linear-gradient(90deg, transparent, rgba(244, 242, 237, .6), transparent); }
.eyebrow,
.section-number { color: var(--muted); font-size: .65rem; font-weight: 600; letter-spacing: .27em; text-transform: uppercase; }
.cover-names { display: grid; justify-items: center; gap: .03em; font-family: var(--title-font); font-size: clamp(2.2rem, calc(10vw * var(--title-scale)), 5rem); font-weight: 500; line-height: .96; letter-spacing: -.055em; overflow-wrap: anywhere; }
.ampersand { color: #bcbab3; font-family: var(--title-font); font-size: .53em; font-style: italic; font-weight: 400; line-height: 1.2; }
.cover-date { margin-top: 1.5rem; color: rgba(239, 237, 231, .8); font-size: .66rem; letter-spacing: .2em; text-transform: uppercase; }
.guest-line { display: grid; gap: .35rem; margin: 2.6rem auto 1.5rem; color: var(--muted); font-size: .68rem; letter-spacing: .08em; }
.guest-line strong { color: var(--text); font-size: .92rem; font-weight: 500; }
.open-button { display: inline-flex; width: 100%; max-width: 280px; min-height: 48px; align-items: center; justify-content: center; gap: .7rem; padding: .75rem 1.4rem; border: 1px solid var(--paper); border-radius: 999px; color: var(--ink); background: var(--paper); font-size: .68rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; transition: color .25s ease, background .25s ease; }
.open-button:hover,
.open-button:focus-visible { color: var(--paper); background: transparent; }
.open-button:focus-visible,
.rsvp-form :focus-visible { outline: 2px solid #f4f2ed; outline-offset: 4px; }

.noir-scroller { height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scroll-behavior: smooth; scroll-snap-type: y proximity; scrollbar-width: none; padding-bottom: 0; }
.noir-scroller::-webkit-scrollbar { display: none; }
.snap-section { min-height: 100vh; min-height: 100svh; scroll-snap-align: start; padding: 3.5rem 1.25rem calc(6.5rem + env(safe-area-inset-bottom)); }

.hero-section { display: grid; align-content: center; justify-items: center; text-align: center; }
.hero-names { display: grid; justify-items: center; gap: .08em; max-width: 100%; margin: 2rem 0 1.5rem; font-family: var(--title-font); font-size: clamp(2.3rem, calc(9vw * var(--title-scale)), 5.6rem); font-weight: 500; line-height: .98; letter-spacing: -.055em; overflow-wrap: anywhere; }
.hero-rule { display: flex; align-items: center; gap: 1rem; color: #c4c0b8; }
.hero-rule span { width: 42px; height: 1px; background: var(--line); }
.hero-rule i { font-size: .72rem; font-style: normal; }
.hero-date { margin: 1rem 0; color: var(--muted); font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; }
.hero-copy { max-width: 440px; margin: 1rem auto 0; color: #c4c2bc; font-family: var(--title-font); font-size: 1.1rem; line-height: 1.7; }

.quote-section,
.event-section,
.rsvp-section { color: #181817; background: var(--paper); }
.quote-section blockquote { max-width: 760px; margin: 2rem auto 1.2rem; font-family: var(--title-font); font-size: clamp(1.4rem, 4vw, 2.35rem); line-height: 1.4; text-align: center; }
.quote-source { color: #77746d; font-size: .66rem; letter-spacing: .15em; text-align: center; text-transform: uppercase; }
.section-number { display: block; color: #85827b; }
.section-title { max-width: 650px; margin: 1.2rem auto 2.6rem; font-family: var(--title-font); font-size: clamp(2rem, 5vw, 3.6rem); font-weight: 500; line-height: 1.05; text-align: center; }
.quote-section .section-number,
.event-section .section-number,
.rsvp-section .section-number { max-width: 760px; margin: 0 auto; }

.couple-section,
.story-section,
.gallery-section,
.gift-section { padding-top: 5rem; }
.couple-grid { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 2rem; margin-top: 2.5rem; text-align: center; }
.person-card img,
.portrait-placeholder { width: min(100%, 260px); aspect-ratio: 4 / 5; margin: 0 auto 1.5rem; object-fit: cover; filter: grayscale(1); }
.portrait-placeholder { display: grid; place-items: center; border: 1px solid var(--line); color: #c4c0b8; font-family: var(--title-font); font-size: 5rem; }
.person-card h2 { margin: .55rem 0; font-family: var(--title-font); font-size: clamp(1.65rem, 4vw, 2.5rem); font-weight: 500; }
.person-card > p:last-child { color: var(--muted); font-family: var(--title-font); font-size: .95rem; line-height: 1.6; }
.couple-divider { color: #aaa79f; font-family: var(--title-font); font-size: 2rem; font-style: italic; }

.story-list { display: grid; gap: 1rem; max-width: 760px; margin: 2rem auto 0; }
.story-list article { display: grid; grid-template-columns: 3rem 1fr; gap: 1rem; padding: 1.4rem 0; border-top: 1px solid var(--line); }
.story-list article > span { color: #aaa79f; font-family: var(--title-font); font-size: 1.25rem; }
.story-date { color: var(--muted); font-size: .62rem; letter-spacing: .18em; text-transform: uppercase; }
.story-list h3 { margin: .35rem 0; font-family: var(--title-font); font-size: 1.6rem; font-weight: 500; }
.story-list article div > p:last-child { color: #c4c2bc; font-size: .84rem; line-height: 1.75; }

.video-section { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 390px); align-items: center; gap: clamp(2rem, 7vw, 6rem); padding-top: 5rem; border-bottom: 1px solid var(--line); }
.video-intro .section-number { color: var(--muted); }
.video-intro .section-title { margin: 1.2rem 0 1.5rem; text-align: left; }
.video-intro > p { max-width: 30ch; color: var(--muted); font-family: var(--title-font); font-size: 1.3rem; line-height: 1.5; }
.video-frame { width: 100%; max-width: 390px; aspect-ratio: 9 / 16; overflow: hidden; border: 1px solid var(--line); background: #151515; }
.video-frame.is-youtube { aspect-ratio: 16 / 9; }
.video-frame iframe,
.video-frame video { display: block; width: 100%; height: 100%; border: 0; object-fit: contain; }
.video-frame video { filter: grayscale(1); }

.event-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; max-width: 760px; margin: 0 auto; }
.event-card { min-height: 230px; padding: 1.7rem; border: 1px solid rgba(24, 24, 23, .16); }
.event-card h3 { margin: 1.3rem 0 .25rem; font-family: var(--title-font); font-size: 1.75rem; font-weight: 500; }
.event-time { color: #65635e; font-size: .72rem; letter-spacing: .12em; }
.event-place { min-height: 2.5rem; margin-top: 1rem; color: #55534f; font-family: var(--title-font); font-size: .95rem; line-height: 1.55; }
.event-card a { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: .6rem; margin-top: 1rem; padding: .85rem 1.4rem; border: 1px solid #181817; color: var(--paper); background: #181817; font-size: .65rem; font-weight: 600; letter-spacing: .13em; text-decoration: none; text-transform: uppercase; transition: color .25s ease, background .25s ease; }
.event-card a:hover,
.event-card a:focus-visible { color: #181817; background: var(--paper); }
.event-card a:focus-visible { outline: 2px solid #181817; outline-offset: 3px; }

.rundown-section { padding-top: 5rem; border-bottom: 1px solid var(--line); }
.rundown-section .section-number { max-width: 560px; margin: 0 auto; color: var(--muted); }
.rundown-list { position: relative; display: grid; gap: 0; max-width: 560px; margin: 0 auto; padding: 0; list-style: none; }
.rundown-list::before { content: ''; position: absolute; top: .6rem; bottom: .6rem; left: 4.6rem; width: 1px; background: var(--line); }
.rundown-list li { position: relative; display: grid; grid-template-columns: 4rem 1fr; gap: 1.5rem; align-items: baseline; padding: .85rem 0; }
.rundown-list li::before { content: ''; position: absolute; top: 1.3rem; left: calc(4.6rem - 3px); width: 7px; height: 7px; border-radius: 50%; background: var(--paper); }
.rundown-list time { color: var(--muted); font-size: .72rem; font-weight: 600; letter-spacing: .14em; text-align: right; }
.rundown-list span { color: var(--text); font-family: var(--title-font); font-size: 1.2rem; line-height: 1.4; }

.gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
.gallery-grid img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; filter: grayscale(1); }
.gift-section { text-align: center; }
.gift-card { display: grid; justify-items: center; gap: .55rem; max-width: 420px; margin: 1rem auto; padding: 1.5rem; border: 1px solid var(--line); }
.gift-card strong { font-family: var(--title-font); font-size: 1.7rem; font-weight: 500; letter-spacing: .04em; }
.gift-card > span { color: var(--muted); font-size: .8rem; }
.gift-card button { min-height: 44px; margin-top: .5rem; padding: .65rem 1rem; border: 1px solid var(--line); color: var(--text); background: transparent; font-size: .62rem; letter-spacing: .12em; text-transform: uppercase; }
.gift-address { color: var(--muted); font-family: var(--title-font); font-size: 1rem; line-height: 1.6; }

.rsvp-intro { margin: -1.4rem auto 2rem; color: #66635d; font-family: var(--title-font); text-align: center; }
.rsvp-form { display: grid; gap: .75rem; max-width: 540px; margin: 0 auto; }
.rsvp-form label,
.rsvp-form legend { color: #4f4d48; font-size: .62rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.rsvp-form label span { color: #8a877f; font-weight: 400; letter-spacing: .04em; text-transform: none; }
.rsvp-form label.rsvp-message-label { margin-top: .5rem; font-size: .85rem; letter-spacing: .14em; text-align: center; }
.rsvp-form input,
.rsvp-form textarea { width: 100%; min-height: 48px; margin-bottom: .75rem; padding: .75rem .2rem; border: 0; border-bottom: 1px solid rgba(24, 24, 23, .5); border-radius: 0; color: #181817; background: transparent; font: inherit; }
.rsvp-form textarea { min-height: 100px; resize: vertical; }
.rsvp-form fieldset { margin: .5rem 0; padding: 0; border: 0; }
.attendance-options { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: .7rem; }
.attendance-options button { min-height: 48px; border: 1px solid #232321; color: #232321; background: transparent; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; }
.attendance-options button.selected { color: var(--paper); background: #181817; }
.submit-button { min-height: 50px; margin-top: .4rem; border: 1px solid #181817; color: var(--paper); background: #181817; font-size: .66rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.submit-button:disabled { opacity: .6; }

.closing-section { display: grid; align-content: center; justify-items: center; gap: 1rem; text-align: center; }
.closing-section > p { margin: 0; font-family: var(--title-font); font-size: clamp(2rem, 6vw, 3.6rem); }
.closing-section > p span { color: #aaa79f; font-style: italic; }
.closing-section small { max-width: 430px; color: var(--muted); font-family: var(--title-font); font-size: .95rem; line-height: 1.6; }

/* Fixed bottom glass navigation */
.glass-nav { position: fixed; z-index: 80; right: 0; bottom: 0; left: 50%; width: 100%; max-width: 720px; transform: translateX(-50%); border-top: 1px solid rgba(244, 242, 237, .22); border-radius: 1rem 1rem 0 0; background: rgba(16, 16, 16, .72); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); box-shadow: 0 -10px 30px rgba(0, 0, 0, .45); }
.glass-nav__inner { display: flex; gap: 2px; padding: .55rem .25rem calc(.55rem + env(safe-area-inset-bottom)); overflow-x: auto; scrollbar-width: none; }
.glass-nav__inner::-webkit-scrollbar { display: none; }
.glass-nav__inner.is-crowded { justify-content: flex-start; }
.glass-nav__item { position: relative; display: flex; flex: 1 1 0; min-width: 0; min-height: 44px; flex-direction: column; align-items: center; justify-content: center; gap: .25rem; padding: 0; border: 0; color: rgba(239, 237, 231, .42); background: transparent; transition: color .25s ease; }
.is-crowded .glass-nav__item { flex: 0 0 auto; min-width: 44px; padding: 0 .3rem; }
.glass-nav__item::before { content: ''; position: absolute; top: 0; left: 50%; width: 18px; height: 1px; background: var(--paper); opacity: 0; transform: translateX(-50%); transition: opacity .25s ease; }
.glass-nav__item.is-active { color: var(--paper); }
.glass-nav__item.is-active::before { opacity: 1; }
.glass-nav__item:focus-visible { outline: 2px solid #f4f2ed; outline-offset: -2px; }
.glass-nav__label { max-width: 100%; padding: 0; overflow: hidden; font-size: .5rem; font-weight: 600; letter-spacing: .02em; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; }
.is-crowded .glass-nav__label { overflow: visible; text-overflow: clip; }
@media (min-width: 768px) {
  .glass-nav__label { font-size: .6rem; }
  .cover-frame { border-radius: 5rem; }
}

@keyframes twinkle { 0%, 100% { opacity: .15; transform: scale(.8); } 50% { opacity: .85; transform: scale(1.25); } }
@keyframes drift { 0% { opacity: 0; transform: translate3d(-8px, 12px, 0); } 20% { opacity: .8; } 55% { opacity: .35; transform: translate3d(32px, -28px, 0); } 100% { opacity: 0; transform: translate3d(70px, -8px, 0); } }

@media (max-width: 640px) {
  .guest-line { margin-top: 2.2rem; }
  .rsvp-section .section-title { max-width: 340px; font-size: clamp(1.75rem, 8.4vw, 2.2rem); }
  .rundown-list li { grid-template-columns: 3.4rem 1fr; gap: 1.25rem; }
  .rundown-list::before { left: 4rem; }
  .rundown-list li::before { left: calc(4rem - 3px); }
  .rundown-list span { font-size: 1.05rem; }
  .couple-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .couple-divider { line-height: .5; }
  .person-card img,
  .portrait-placeholder { width: min(78%, 250px); }
  .event-grid { grid-template-columns: 1fr; }
  .event-card { min-height: 0; }
  .event-card a { display: flex; width: 100%; }
  .video-section { grid-template-columns: 1fr; gap: 2rem; }
  .video-intro { text-align: center; }
  .video-intro .section-title { text-align: center; }
  .video-intro > p { margin: 0 auto; font-size: 1.15rem; }
  .video-frame { max-width: 330px; margin: 0 auto; }
  .video-frame.is-youtube { max-width: 100%; }
  .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery-grid img:last-child:nth-child(odd) { grid-column: span 2; aspect-ratio: 16 / 9; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .firefly { opacity: .65 !important; animation: none !important; transform: none !important; }
}
</style>
