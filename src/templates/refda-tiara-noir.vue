<template>
  <main class="noir-invitation" :style="themeStyle">
    <MusicControl
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

      <div class="cover-content">
        <p class="eyebrow">Dengan penuh syukur</p>
        <p class="cover-intro">Kami mengundang Anda untuk merayakan pernikahan</p>

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
          <span>Buka Undangan</span>
          <span aria-hidden="true">↗</span>
        </button>
        <p class="cover-note">Gulir untuk membaca undangan</p>
      </div>
      <span class="cover-index" aria-hidden="true">R&nbsp;·&nbsp;T</span>
    </div>

    <div v-else class="invitation-content" ref="invitationContent">
      <header class="page-masthead">
        <span>Refda &amp; Tiara</span>
        <span>{{ formatDate(eventDate) }}</span>
      </header>

      <nav class="section-nav" aria-label="Navigasi undangan">
        <a href="#home">Awal</a>
        <a v-if="isSectionEnabled('quote') && data.quoteText" href="#quote">Doa</a>
        <a v-if="isSectionEnabled('couple') || isSectionEnabled('photoCouple')" href="#couple">Mempelai</a>
        <a v-if="isSectionEnabled('event')" href="#event">Acara</a>
        <a v-if="isSectionEnabled('video') && (youtubeEmbedUrl || directVideoUrl)" href="#video">Video</a>
        <a v-if="isSectionEnabled('rsvp')" href="#rsvp">RSVP</a>
      </nav>

      <section id="home" class="hero-section">
        <p class="eyebrow">The beginning of always</p>
        <h1 class="hero-names">
          <span>{{ data.groomName || 'Muhammad Refda' }}</span>
          <span class="ampersand">&amp;</span>
          <span>{{ data.brideName || 'Uk Tiara Ayu' }}</span>
        </h1>
        <div class="hero-rule"><span></span><i aria-hidden="true">✳</i><span></span></div>
        <p class="hero-date">{{ formatDate(eventDate) }}</p>
        <p class="hero-copy">
          Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang Anda untuk hadir
          dalam hari bahagia kami.
        </p>
      </section>

      <section v-if="isSectionEnabled('quote') && data.quoteText" id="quote" class="quote-section">
        <span class="section-number">01 / DOA</span>
        <blockquote>“{{ data.quoteText }}”</blockquote>
        <p v-if="data.quoteSource" class="quote-source">{{ data.quoteSource }}</p>
      </section>

      <section
        v-if="isSectionEnabled('couple') || isSectionEnabled('photoCouple')"
        id="couple"
        class="couple-section"
      >
        <span class="section-number">02 / MEMPELAI</span>
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

      <section v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="story-section">
        <span class="section-number">03 / CERITA</span>
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

      <section v-if="isSectionEnabled('event')" id="event" class="event-section">
        <span class="section-number">04 / ACARA</span>
        <h2 class="section-title">Hari istimewa kami</h2>
        <div class="event-grid">
          <article v-for="item in events" :key="item.label" class="event-card">
            <p class="eyebrow">{{ item.label }}</p>
            <h3>{{ formatDate(item.dateTime) }}</h3>
            <p class="event-time">{{ formatTime(item.dateTime) }}</p>
            <p v-if="item.description" class="event-place">{{ item.description }}</p>
            <a v-if="eventMapUrl(item)" :href="eventMapUrl(item)" target="_blank" rel="noopener noreferrer">
              Lihat lokasi <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </section>

      <section
        v-if="isSectionEnabled('video') && (youtubeEmbedUrl || directVideoUrl)"
        id="video"
        class="video-section"
      >
        <div class="video-intro">
          <span class="section-number">VIDEO / KENANGAN</span>
          <h2 class="section-title">Sepotong cerita kami</h2>
          <p>Kenangan kecil yang ingin kami bagikan sebelum hari istimewa tiba.</p>
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
            :poster="directVideoUrl.startsWith('/assets/videos/refda-tiara/') ? '/assets/videos/refda-tiara/poster.jpg' : undefined"
            controls
            playsinline
            preload="metadata"
            aria-label="Video Refda dan Tiara"
          ></video>
        </div>
      </section>

      <section
        v-if="isSectionEnabled('gallery') && data.galleryImages?.length"
        class="gallery-section"
      >
        <span class="section-number">05 / POTRET</span>
        <h2 class="section-title">Sebuah jeda, untuk dikenang</h2>
        <div class="gallery-grid">
          <img v-for="(src, index) in data.galleryImages" :key="`${src}-${index}`" :src="src" alt="Potret Refda dan Tiara" loading="lazy" />
        </div>
      </section>

      <section v-if="isSectionEnabled('gift') && hasGiftDetails" class="gift-section">
        <span class="section-number">06 / TANDA KASIH</span>
        <h2 class="section-title">Doa Anda adalah hadiah terbaik</h2>
        <article v-for="(account, index) in data.bankAccounts || []" :key="`${account.accountNumber}-${index}`" class="gift-card">
          <p class="eyebrow">{{ account.bankName }}</p>
          <strong>{{ account.accountNumber }}</strong>
          <span>{{ account.accountName }}</span>
          <button type="button" @click="copyText(account.accountNumber)">Salin nomor rekening</button>
        </article>
        <p v-for="(address, index) in giftAddresses" :key="index" class="gift-address">{{ address }}</p>
      </section>

      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="rsvp-section">
        <span class="section-number">07 / KONFIRMASI</span>
        <h2 class="section-title">Kami berharap Anda hadir</h2>
        <p class="rsvp-intro">Mohon luangkan waktu untuk mengabarkan kehadiran Anda.</p>

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

          <label for="rsvp-message">Ucapan dan doa <span>(opsional)</span></label>
          <textarea id="rsvp-message" v-model.trim="rsvp.message" rows="4"></textarea>
          <button class="submit-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Mengirim…' : 'Kirim konfirmasi' }}
          </button>
        </form>
      </section>

      <footer class="closing-section">
        <span class="eyebrow">Terima kasih atas doa dan kehadiran Anda</span>
        <p>{{ data.groomName || 'Muhammad Refda' }} <span>&amp;</span> {{ data.brideName || 'Uk Tiara Ayu' }}</p>
        <small>{{ data.footerText || 'Dengan penuh rasa syukur, Refda & Tiara' }}</small>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { createGuestMessage } from '@/api/guestMessage'
import MusicControl from '@/components/invitation/MusicControl.vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const toast = useToast()
const data = computed(() => props.data || {})
const showCover = ref(true)
const isSubmitting = ref(false)
const prefersReducedMotion = ref(false)
const invitationContent = ref(null)
const rsvp = ref({ name: '', attendance: 'hadir', message: '' })

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
const giftAddresses = computed(() => {
  const value = data.value.giftDeliveryAddress
  return Array.isArray(value) ? value : value ? [value] : []
})
const hasGiftDetails = computed(
  () => (data.value.bankAccounts?.length || 0) > 0 || giftAddresses.value.length > 0,
)

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

function formatTime(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
}

function openInvitation() {
  showCover.value = false
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
}

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
    rsvp.value = { name: '', attendance: 'hadir', message: '' }
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
  prefersReducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false
})

onUnmounted(() => {
  if (invitationContent.value) invitationContent.value.scrollTop = 0
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
  min-height: 100vh;
  color: var(--text);
  background: var(--ink);
  font-family: 'DM Sans', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.cover-screen {
  position: relative;
  display: grid;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  background: #080808;
  isolation: isolate;
}

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

.cover-content { width: min(760px, 100%); padding: 5.5rem 1.5rem 4rem; text-align: center; }
.eyebrow,
.section-number { color: var(--muted); font-size: .65rem; font-weight: 600; letter-spacing: .27em; text-transform: uppercase; }
.cover-intro { max-width: 250px; margin: 1.15rem auto 2rem; color: rgba(239, 237, 231, .72); font-size: .75rem; line-height: 1.7; letter-spacing: .08em; }
.cover-names { display: grid; justify-items: center; gap: .03em; font-family: var(--title-font); font-size: clamp(2.2rem, calc(10vw * var(--title-scale)), 5rem); font-weight: 500; line-height: .96; letter-spacing: -.055em; overflow-wrap: anywhere; }
.ampersand { color: #bcbab3; font-family: var(--title-font); font-size: .53em; font-style: italic; font-weight: 400; line-height: 1.2; }
.cover-date { margin-top: 1.5rem; color: rgba(239, 237, 231, .8); font-size: .66rem; letter-spacing: .2em; text-transform: uppercase; }
.guest-line { display: grid; gap: .35rem; margin: 3.5rem auto 1.5rem; color: var(--muted); font-size: .68rem; letter-spacing: .08em; }
.guest-line strong { color: var(--text); font-size: .92rem; font-weight: 500; }
.open-button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 2rem; padding: .75rem 1.4rem; border: 1px solid rgba(244, 242, 237, .72); color: var(--paper); background: transparent; font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; transition: color .25s ease, background .25s ease; }
.open-button:hover,
.open-button:focus-visible { color: var(--ink); background: var(--paper); }
.open-button:focus-visible,
.section-nav a:focus-visible,
.rsvp-form :focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
.cover-note { margin-top: .9rem; color: rgba(239, 237, 231, .45); font-size: .62rem; letter-spacing: .08em; }
.cover-index { position: absolute; right: 1.5rem; bottom: 1.4rem; color: rgba(239, 237, 231, .48); font-family: var(--title-font); font-size: .8rem; letter-spacing: .22em; }

.invitation-content { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
.page-masthead { display: flex; justify-content: space-between; padding: 1.2rem 0; border-bottom: 1px solid var(--line); color: var(--muted); font-size: .62rem; letter-spacing: .16em; text-transform: uppercase; }
.section-nav { position: sticky; top: 0; z-index: 20; display: flex; justify-content: center; gap: clamp(1rem, 5vw, 3.5rem); border-bottom: 1px solid var(--line); background: rgba(12, 12, 12, .92); backdrop-filter: blur(12px); }
.section-nav a { display: inline-flex; min-height: 48px; align-items: center; color: var(--muted); font-size: .63rem; letter-spacing: .15em; text-decoration: none; text-transform: uppercase; white-space: nowrap; }
.section-nav a:hover { color: var(--paper); }
.invitation-content section[id] { scroll-margin-top: 64px; }

.hero-section { display: grid; min-height: 76vh; align-content: center; justify-items: center; padding: 6rem 1rem; text-align: center; }
.hero-names { display: grid; justify-items: center; gap: .08em; max-width: 100%; margin: 2rem 0 1.5rem; font-family: var(--title-font); font-size: clamp(2.3rem, calc(9vw * var(--title-scale)), 5.6rem); font-weight: 500; line-height: .98; letter-spacing: -.055em; overflow-wrap: anywhere; }
.hero-rule { display: flex; align-items: center; gap: 1rem; color: #c4c0b8; }
.hero-rule span { width: 42px; height: 1px; background: var(--line); }
.hero-rule i { font-size: .72rem; font-style: normal; }
.hero-date { margin: 1rem 0; color: var(--muted); font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; }
.hero-copy { max-width: 440px; margin: 1rem auto 0; color: #c4c2bc; font-family: var(--title-font); font-size: 1.1rem; line-height: 1.7; }

.quote-section,
.event-section,
.rsvp-section { margin: 0 -1.25rem; padding: 5rem max(1.25rem, calc((100vw - 760px) / 2)); color: #181817; background: var(--paper); }
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
.gift-section { padding: 5rem 0; }
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

.video-section { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 390px); align-items: center; gap: clamp(2rem, 7vw, 6rem); padding: 6rem 0; border-bottom: 1px solid var(--line); }
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
.event-card a { display: inline-flex; gap: .6rem; margin-top: .8rem; color: #151515; font-size: .65rem; letter-spacing: .13em; text-decoration: none; text-transform: uppercase; }

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
.rsvp-form input,
.rsvp-form textarea { width: 100%; min-height: 48px; margin-bottom: .75rem; padding: .75rem .2rem; border: 0; border-bottom: 1px solid rgba(24, 24, 23, .5); border-radius: 0; color: #181817; background: transparent; font: inherit; }
.rsvp-form textarea { min-height: 100px; resize: vertical; }
.rsvp-form fieldset { margin: .5rem 0; padding: 0; border: 0; }
.attendance-options { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: .7rem; }
.attendance-options button { min-height: 48px; border: 1px solid #232321; color: #232321; background: transparent; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; }
.attendance-options button.selected { color: var(--paper); background: #181817; }
.submit-button { min-height: 50px; margin-top: .4rem; border: 1px solid #181817; color: var(--paper); background: #181817; font-size: .66rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.submit-button:disabled { opacity: .6; }

.closing-section { display: grid; justify-items: center; gap: 1rem; padding: 5.5rem 0; text-align: center; }
.closing-section > p { margin: 0; font-family: var(--title-font); font-size: clamp(2rem, 6vw, 3.6rem); }
.closing-section > p span { color: #aaa79f; font-style: italic; }
.closing-section small { max-width: 430px; color: var(--muted); font-family: var(--title-font); font-size: .95rem; line-height: 1.6; }

@keyframes twinkle { 0%, 100% { opacity: .15; transform: scale(.8); } 50% { opacity: .85; transform: scale(1.25); } }
@keyframes drift { 0% { opacity: 0; transform: translate3d(-8px, 12px, 0); } 20% { opacity: .8; } 55% { opacity: .35; transform: translate3d(32px, -28px, 0); } 100% { opacity: 0; transform: translate3d(70px, -8px, 0); } }

@media (max-width: 640px) {
  .cover-content { padding-top: 4rem; }
  .guest-line { margin-top: 2.7rem; }
  .invitation-content { padding-right: 1rem; padding-left: 1rem; }
  .quote-section,
  .event-section,
  .rsvp-section { margin-right: -1rem; margin-left: -1rem; }
  .page-masthead { font-size: .52rem; letter-spacing: .1em; }
  .section-nav { justify-content: flex-start; gap: 1.2rem; margin: 0 -1rem; padding: 0 1rem; overflow-x: auto; overscroll-behavior-inline: contain; scrollbar-width: none; }
  .section-nav::-webkit-scrollbar { display: none; }
  .section-nav a { flex: 0 0 auto; font-size: .6rem; letter-spacing: .1em; }
  .hero-section { min-height: 70vh; padding: 5rem .25rem; }
  .couple-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .couple-divider { line-height: .5; }
  .person-card img,
  .portrait-placeholder { width: min(78%, 250px); }
  .event-grid { grid-template-columns: 1fr; }
  .event-card { min-height: 0; }
  .video-section { grid-template-columns: 1fr; gap: 2rem; padding: 4.5rem 0; }
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
