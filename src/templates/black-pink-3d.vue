<template>
  <div class="velvet-invite min-h-screen overflow-hidden bg-[#09070b] text-white">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#110a10"
      accentColor="#ff5ba8"
      class="z-[55]"
    />

    <Transition name="cover">
      <div v-if="showWelcome" class="welcome fixed inset-0 z-[60] grid place-items-center px-5">
        <div class="welcome-glow" aria-hidden="true"></div>
        <div class="welcome-content relative z-10 mx-auto w-full max-w-md text-center">
          <p class="eyebrow mb-6">Dengan penuh cinta, kami mengundang</p>
          <div class="envelope-scene mx-auto mb-8" aria-hidden="true">
            <div class="envelope-shadow"></div>
            <div class="envelope-card">
              <span class="card-monogram">{{ initials }}</span>
              <span class="card-rule"></span>
              <span class="card-caption">Save the date</span>
            </div>
            <div class="envelope-base"></div>
            <div class="envelope-flap"></div>
            <span class="envelope-seal">{{ initials }}</span>
          </div>
          <h1 class="font-display text-4xl leading-tight sm:text-5xl">
            {{ data.groomName || 'Raka' }} <span class="pink-script">&</span>
            {{ data.brideName || 'Nadia' }}
          </h1>
          <p class="mt-3 text-sm tracking-[0.28em] text-white/55">
            {{ formatDate(eventDate) }}
          </p>
          <p class="mt-9 text-xs uppercase tracking-[0.2em] text-white/45">
            Kepada Yth. {{ data.guestName || 'Tamu Undangan' }}
          </p>
          <button class="open-button mt-5" type="button" @click="openInvitation">
            <span class="mr-2">✦</span> Buka Undangan
          </button>
        </div>
      </div>
    </Transition>

    <main v-if="!showWelcome" id="invite-content" class="relative z-10">
      <nav class="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-black/65 p-1.5 shadow-xl backdrop-blur-xl md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col">
        <button v-for="item in visibleNav" :key="item.id" class="nav-dot" :aria-label="item.label" :title="item.label" @click="scrollTo(item.id)">
          <span>{{ item.icon }}</span>
        </button>
      </nav>

      <section id="home" class="hero-section relative flex min-h-screen items-center px-5 py-24 sm:px-10">
        <div class="hero-orbit orbit-one" aria-hidden="true"></div>
        <div class="hero-orbit orbit-two" aria-hidden="true"></div>
        <div class="hero-layout mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[0.92fr_1.08fr]">
          <div class="relative z-10 text-center md:text-left">
            <p class="eyebrow mb-6">The beginning of forever</p>
            <h2 class="font-display text-5xl leading-[1.08] sm:text-7xl">
              {{ data.groomName || 'Raka' }}<br />
              <span class="pink-script text-5xl sm:text-6xl">and</span><br />
              {{ data.brideName || 'Nadia' }}
            </h2>
            <p class="mt-7 max-w-md text-sm leading-7 text-white/60 md:mx-0 mx-auto">
              {{ data.quoteText || 'Dua hati, satu cerita, dan sebuah awal yang ingin kami rayakan bersama.' }}
            </p>
            <div class="mt-8 flex items-center justify-center gap-3 md:justify-start">
              <span class="h-px w-10 bg-[#ff5ba8]"></span>
              <span class="text-xs uppercase tracking-[0.22em] text-[#ff9bc7]">{{ formatDate(eventDate) }}</span>
            </div>
            <button class="text-link mt-10" type="button" @click="scrollTo('couple')">Kenali kami <span>↓</span></button>
          </div>

          <div class="portrait-scene mx-auto w-full max-w-lg" aria-label="Foto pasangan dalam bingkai berlapis">
            <div class="portrait-backdrop"></div>
            <div class="portrait-frame frame-back"><img v-if="data.bridePhotoUrl" :src="data.bridePhotoUrl" alt="" /></div>
            <div class="portrait-frame frame-front">
              <img v-if="data.photoCoupleUrl || data.groomPhotoUrl" :src="data.photoCoupleUrl || data.groomPhotoUrl" alt="Foto pasangan" />
              <div v-else class="photo-placeholder"><span>{{ initials }}</span><small>our forever</small></div>
            </div>
            <span class="floating-heart heart-one">♡</span>
            <span class="floating-heart heart-two">✦</span>
            <div class="frame-caption">A love written in the stars</div>
          </div>
        </div>
        <span class="hero-index">01 / FOREVER</span>
      </section>

      <section v-if="isSectionEnabled('couple')" id="couple" class="section-shell couple-section px-5 py-24 sm:px-10 sm:py-32">
        <div class="mx-auto max-w-5xl">
          <div class="section-heading text-center">
            <p class="eyebrow">Two souls, one promise</p>
            <h2 class="font-display mt-4 text-4xl sm:text-6xl">Tentang Kami</h2>
            <span class="heading-flourish">✦</span>
          </div>
          <div class="couple-grid mt-16 grid gap-12 md:grid-cols-2">
            <article class="person-card">
              <div class="person-photo"><img v-if="data.groomPhotoUrl" :src="data.groomPhotoUrl" :alt="data.groomName" /><span v-else>{{ (data.groomName || 'R').slice(0, 1) }}</span></div>
              <p class="eyebrow mt-7">Mempelai Pria</p>
              <h3 class="font-display mt-2 text-3xl">{{ data.groomName || 'Nama Mempelai Pria' }}</h3>
              <p class="mt-3 text-sm text-white/55">Putra dari {{ data.parents?.groomParents || 'Bapak & Ibu' }}</p>
              <a v-if="data.socialMediaGroom?.instagram" class="social-link" :href="instagramUrl(data.socialMediaGroom.instagram)" target="_blank" rel="noreferrer">Instagram ↗</a>
            </article>
            <article class="person-card person-card-offset">
              <div class="person-photo"><img v-if="data.bridePhotoUrl" :src="data.bridePhotoUrl" :alt="data.brideName" /><span v-else>{{ (data.brideName || 'N').slice(0, 1) }}</span></div>
              <p class="eyebrow mt-7">Mempelai Wanita</p>
              <h3 class="font-display mt-2 text-3xl">{{ data.brideName || 'Nama Mempelai Wanita' }}</h3>
              <p class="mt-3 text-sm text-white/55">Putri dari {{ data.parents?.brideParents || 'Bapak & Ibu' }}</p>
              <a v-if="data.socialMediaBrides?.instagram" class="social-link" :href="instagramUrl(data.socialMediaBrides.instagram)" target="_blank" rel="noreferrer">Instagram ↗</a>
            </article>
          </div>
        </div>
      </section>

      <section v-if="isSectionEnabled('love-story') && data.loveStory?.length" id="story" class="section-shell story-section px-5 py-24 sm:px-10 sm:py-32">
        <div class="mx-auto max-w-4xl">
          <div class="section-heading text-center">
            <p class="eyebrow">Every love has a story</p>
            <h2 class="font-display mt-4 text-4xl sm:text-6xl">Perjalanan Kami</h2>
          </div>
          <div class="story-list mt-16">
            <article v-for="(story, index) in data.loveStory" :key="index" class="story-item">
              <span class="story-number">0{{ index + 1 }}</span>
              <div class="story-copy"><p class="eyebrow">{{ story.date }}</p><h3 class="font-display mt-2 text-2xl">{{ story.title }}</h3><p class="mt-3 text-sm leading-7 text-white/55">{{ story.description }}</p></div>
              <img v-if="story.image" :src="story.image" :alt="story.title" />
            </article>
          </div>
        </div>
      </section>

      <section v-if="isSectionEnabled('event')" id="event" class="section-shell event-section px-5 py-24 sm:px-10 sm:py-32">
        <div class="mx-auto max-w-5xl">
          <div class="section-heading text-center">
            <p class="eyebrow">Save the date</p>
            <h2 class="font-display mt-4 text-4xl sm:text-6xl">Hari Bahagia</h2>
            <p class="mt-4 text-sm tracking-[0.2em] text-[#ff9bc7]">{{ formatDate(eventDate) }}</p>
          </div>
          <div class="event-grid mt-14 grid gap-5 md:grid-cols-2">
            <article v-for="event in events" :key="event.title" class="event-card">
              <span class="event-mark">✦</span>
              <p class="eyebrow">{{ event.label }}</p>
              <h3 class="font-display mt-3 text-3xl">{{ event.title }}</h3>
              <p class="mt-5 text-sm text-[#ff9bc7]">{{ formatDate(event.dateTime) }}<br />{{ formatTime(event.dateTime) }}</p>
              <p class="mt-5 text-sm leading-6 text-white/55">{{ event.description || event.location }}</p>
              <a v-if="event.mapUrl" class="map-link mt-6" :href="event.mapUrl" target="_blank" rel="noreferrer">Lihat lokasi ↗</a>
            </article>
          </div>
          <div v-if="data.dressCode" class="dress-code mt-6 text-center"><span class="eyebrow">Dress code</span><p class="mt-2">{{ data.dressCode }}</p></div>
        </div>
      </section>

      <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="section-shell gallery-section px-5 py-24 sm:px-10 sm:py-32">
        <div class="mx-auto max-w-6xl">
          <div class="section-heading text-center"><p class="eyebrow">Little moments, forever remembered</p><h2 class="font-display mt-4 text-4xl sm:text-6xl">Galeri Cinta</h2></div>
          <div class="gallery-grid mt-14"><img v-for="(image, index) in galleryImages" :key="image" :src="image" :alt="`Foto pasangan ${index + 1}`" :class="`gallery-image image-${index % 5}`" /></div>
        </div>
      </section>

      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="section-shell rsvp-section px-5 py-24 sm:px-10 sm:py-32">
        <div class="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div><p class="eyebrow">We saved a place for you</p><h2 class="font-display mt-4 text-5xl leading-tight sm:text-6xl">Kehadiranmu<br /><span class="pink-script">berarti</span></h2><p class="mt-6 max-w-sm text-sm leading-7 text-white/55">Mohon konfirmasi kehadiran dan tinggalkan doa terbaik untuk kami.</p></div>
          <form class="rsvp-form" @submit.prevent="submitRSVP">
            <label>Nama<input v-model="rsvp.name" required autocomplete="name" placeholder="Nama lengkap" /></label>
            <label>Konfirmasi<select v-model="rsvp.attendance"><option value="hadir">Saya akan hadir</option><option value="tidak">Maaf, belum bisa hadir</option></select></label>
            <label v-if="rsvp.attendance === 'hadir'">Jumlah tamu<select v-model.number="rsvp.totalGuests"><option v-for="count in 5" :key="count" :value="count">{{ count }} orang</option></select></label>
            <label>Pesan<textarea v-model="rsvp.message" rows="3" placeholder="Tulis ucapan atau doa"></textarea></label>
            <button class="open-button w-full" type="submit">Kirim Konfirmasi <span class="ml-2">↗</span></button>
          </form>
        </div>
      </section>

      <section v-if="isSectionEnabled('gift') && data.bankAccounts?.length" id="gift" class="section-shell gift-section px-5 py-24 sm:px-10 sm:py-28">
        <div class="mx-auto max-w-4xl text-center"><p class="eyebrow">A little token of love</p><h2 class="font-display mt-4 text-4xl sm:text-5xl">Wedding Gift</h2>
          <div class="mt-10 grid gap-4 sm:grid-cols-2"><article v-for="(bank, index) in data.bankAccounts" :key="index" class="bank-card"><p class="eyebrow">{{ bank.bankName }}</p><p class="mt-4 text-xl tracking-wider">{{ bank.accountNumber }}</p><p class="mt-2 text-sm text-white/50">a.n. {{ bank.accountName }}</p><button type="button" class="social-link" @click="copyAccount(bank.accountNumber)">Salin nomor rekening</button></article></div>
        </div>
      </section>

      <footer class="footer-shell px-5 py-20 text-center">
        <span class="pink-script text-4xl">With love,</span>
        <h2 class="font-display mt-4 text-3xl sm:text-5xl">{{ data.groomName || 'Raka' }} & {{ data.brideName || 'Nadia' }}</h2>
        <p class="eyebrow mt-6">{{ formatDate(eventDate) }} · Sampai jumpa di hari bahagia</p>
        <WatermarkBadge variant="dark" class="mt-8" />
      </footer>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { createGuestMessage } from '@/api/guestMessage'
import MusicControl from '@/components/invitation/MusicControl.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { useToast } from 'vue-toastification'

const props = defineProps({ data: { type: Object, default: () => ({}) } })
const data = ref({ ...props.data })
const showWelcome = ref(true)
const toast = useToast()
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })

watch(() => props.data, (value) => {
  data.value = { ...(value || {}) }
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') rsvp.value.name = data.value.guestName
}, { deep: true, immediate: true })

const eventDate = computed(() => data.value.akadLocation?.dateTime || data.value.resepsiLocation?.dateTime || data.value.dateTime)
const initials = computed(() => `${(data.value.groomName || 'R').trim().charAt(0)}${(data.value.brideName || 'N').trim().charAt(0)}`)
const galleryImages = computed(() => Array.isArray(data.value.galleryImages) ? data.value.galleryImages.filter(Boolean) : [])
const events = computed(() => {
  const list = []
  if (data.value.akadLocation) list.push({ label: 'Momen sakral', title: 'Akad Nikah', ...data.value.akadLocation })
  if (data.value.resepsiLocation && !data.value.mergeEvents) list.push({ label: 'Perayaan cinta', title: 'Resepsi', ...data.value.resepsiLocation })
  return list
})
const navItems = [
  { id: 'home', label: 'Beranda', icon: '⌂' },
  { id: 'couple', label: 'Mempelai', icon: '♡', section: 'couple' },
  { id: 'story', label: 'Cerita', icon: '✦', section: 'love-story' },
  { id: 'event', label: 'Acara', icon: '◷', section: 'event' },
  { id: 'gallery', label: 'Galeri', icon: '▧', section: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: '✉', section: 'rsvp' },
]
const visibleNav = computed(() => navItems.filter((item) => !item.section || isSectionEnabled(item.section)))

function isSectionEnabled(key) {
  return data.value.selectedSections == null || data.value.selectedSections.includes(key)
}
function openInvitation() { showWelcome.value = false }
function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:') || choice.includes('/') || choice.includes('http')) return choice
  return '/audio/wedding-acoustic-morning.mp3'
}
function formatDate(value) {
  if (!value) return 'Tanggal segera diumumkan'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Tanggal segera diumumkan' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(value) {
  if (!value) return 'Waktu menyusul'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Waktu menyusul' : `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
}
function instagramUrl(handle) { return `https://instagram.com/${String(handle).replace('@', '')}` }
async function copyAccount(accountNumber) {
  try { await navigator.clipboard.writeText(accountNumber); toast.success('Nomor rekening disalin') }
  catch { toast.error('Nomor rekening belum bisa disalin') }
}
async function submitRSVP() {
  if (!data.value.id || data.value.id === 'live-preview') return toast.info('RSVP tersedia setelah undangan dipublikasikan')
  try {
    await createGuestMessage({ invitationId: data.value.id, guestName: rsvp.value.name, message: rsvp.value.message, rsvpStatus: rsvp.value.attendance, totalGuests: rsvp.value.attendance === 'hadir' ? rsvp.value.totalGuests : 0 })
    toast.success('Terima kasih, konfirmasi kehadiran berhasil dikirim')
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
  } catch (error) {
    console.error(error)
    toast.error('Konfirmasi belum berhasil dikirim')
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.velvet-invite { --pink: #ff5ba8; --pink-soft: #ff9bc7; --ink: #09070b; font-family: 'DM Sans', sans-serif; isolation: isolate; }
.font-display { font-family: 'Playfair Display', Georgia, serif; font-weight: 400; }
.pink-script { color: var(--pink-soft); font-family: 'Playfair Display', Georgia, serif; font-style: italic; }
.ambient { position: fixed; z-index: -1; width: 28rem; height: 28rem; border-radius: 50%; filter: blur(110px); opacity: .16; pointer-events: none; }
.ambient-one { top: -12rem; left: -10rem; background: #f62987; }.ambient-two { right: -14rem; bottom: 8rem; background: #8d1659; }
.welcome { background: radial-gradient(ellipse at 50% 42%, #28101e 0%, #110a10 45%, #09070b 78%); }
.welcome-glow { position: absolute; width: 18rem; height: 18rem; border-radius: 50%; background: #ff5ba8; filter: blur(130px); opacity: .18; }
.eyebrow { color: #ff9bc7; font-size: .62rem; font-weight: 600; letter-spacing: .25em; text-transform: uppercase; }
.envelope-scene { position: relative; width: 210px; height: 170px; perspective: 900px; transform-style: preserve-3d; }
.envelope-shadow { position: absolute; left: 12%; right: 12%; bottom: 5px; height: 24px; border-radius: 50%; background: #000; filter: blur(15px); transform: rotateX(70deg) translateZ(-25px); }
.envelope-card { position: absolute; z-index: 1; left: 20%; top: 3%; width: 60%; height: 76%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; border: 1px solid #ffd1e5; background: linear-gradient(145deg,#fff7fb,#f3d5e4); color: #371326; box-shadow: 0 12px 35px #0008; transform: translateZ(14px) rotateX(5deg); animation: card-rise 4s ease-in-out infinite; }
.card-monogram { font: 2.7rem 'Playfair Display',serif; color: #a32b63; }.card-rule { width: 34px; height: 1px; background: #cc5d91; }.card-caption { font-size: .48rem; letter-spacing: .22em; text-transform: uppercase; }
.envelope-base { position: absolute; z-index: 2; left: 0; bottom: 0; width: 100%; height: 66%; background: linear-gradient(145deg,#a82661,#601238); clip-path: polygon(0 0,50% 58%,100% 0,100% 100%,0 100%); filter: drop-shadow(0 15px 20px #0008); transform: translateZ(26px); }
.envelope-flap { position: absolute; z-index: 3; left: 0; top: 0; width: 100%; height: 65%; background: linear-gradient(160deg,#e34b8a,#8a1d4d); clip-path: polygon(0 0,100% 0,50% 78%); transform: translateZ(27px); transform-origin: top; animation: flap-breathe 4s ease-in-out infinite; }
.envelope-seal { position: absolute; z-index: 4; left: 50%; top: 57%; display: grid; width: 35px; height: 35px; place-items: center; border: 1px solid #ffc3df; border-radius: 50%; background: #d83c7d; color: white; font: .7rem 'Playfair Display',serif; transform: translate(-50%,-50%) translateZ(35px); box-shadow: 0 3px 12px #2c0016aa; }
.open-button { border: 1px solid #ff78b5; border-radius: 999px; background: linear-gradient(110deg,#e4438a,#a82162); padding: .9rem 1.7rem; color: white; font-size: .68rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; box-shadow: 0 8px 26px #d6327740; transition: transform .25s, box-shadow .25s; }
.open-button:hover { transform: translateY(-2px); box-shadow: 0 12px 32px #d6327760; }
.cover-leave-active { transition: opacity .8s, transform .8s; }.cover-leave-to { opacity: 0; transform: scale(1.04); }
.hero-section { background: radial-gradient(ellipse at 75% 50%,#24101c 0,transparent 45%); }
.hero-layout { perspective: 1000px; }.hero-orbit { position: absolute; top: 50%; right: 9%; width: min(43vw,520px); aspect-ratio: 1; border: 1px solid #ff5ba822; border-radius: 50%; transform: translateY(-50%) rotateX(68deg) rotateZ(-18deg); pointer-events: none; }.orbit-two { width: min(35vw,420px); right: 12%; border-color: #ff5ba833; transform: translateY(-50%) rotateX(68deg) rotateZ(35deg); }
.portrait-scene { position: relative; aspect-ratio: .92; perspective: 1100px; transform-style: preserve-3d; animation: scene-float 7s ease-in-out infinite; }
.portrait-backdrop { position: absolute; inset: 9% 10%; border: 1px solid #ff5ba855; border-radius: 48% 48% 12px 12px; background: linear-gradient(145deg,#29101f,#110b12); transform: rotateY(-9deg) rotateZ(3deg) translateZ(-30px); box-shadow: 20px 25px 70px #0009; }
.portrait-frame { position: absolute; overflow: hidden; border: 1px solid #ff9bc766; background: #160d14; box-shadow: 0 25px 70px #0009; }
.portrait-frame img,.person-photo img { width: 100%; height: 100%; object-fit: cover; }
.frame-back { top: 5%; right: 4%; width: 48%; height: 62%; transform: rotateY(-16deg) rotateZ(8deg) translateZ(-12px); opacity: .68; }
.frame-front { left: 11%; top: 15%; width: 67%; height: 76%; border-radius: 48% 48% 5px 5px; transform: rotateY(9deg) rotateX(2deg) translateZ(24px); }
.photo-placeholder { display: grid; width: 100%; height: 100%; place-content: center; justify-items: center; gap: 8px; background: radial-gradient(ellipse at 50% 40%,#82345e,#26121f 58%,#140d14); color: #ffd4e7; }.photo-placeholder span { font: 5rem 'Playfair Display',serif; }.photo-placeholder small { color: #ff9bc7; font-size: .55rem; letter-spacing: .28em; text-transform: uppercase; }
.floating-heart { position: absolute; z-index: 4; color: var(--pink-soft); text-shadow: 0 0 20px #ff5ba8aa; }.heart-one { top: 7%; left: 14%; font-size: 2rem; transform: translateZ(48px); }.heart-two { right: 7%; bottom: 16%; font-size: 1.3rem; transform: translateZ(60px); }.frame-caption { position: absolute; z-index: 5; right: 0; bottom: 3%; color: #ff9bc7; font: italic .9rem 'Playfair Display',serif; transform: translateZ(70px) rotate(-5deg); }
.hero-index { position: absolute; bottom: 2rem; left: 2rem; color: #ffffff38; font-size: .55rem; letter-spacing: .22em; }
.section-shell { position: relative; border-top: 1px solid #ffffff0d; }.couple-section,.gallery-section,.gift-section { background: linear-gradient(180deg,#0d090e,#100a10); }.story-section,.event-section,.rsvp-section { background: #0a080b; }
.section-heading h2 { color: #fff4f9; }.heading-flourish { display: block; margin-top: 1.2rem; color: var(--pink); }
.person-card { position: relative; padding: 1.5rem; border: 1px solid #ff5ba826; background: linear-gradient(140deg,#170e16,#0e0a0e); text-align: center; box-shadow: 0 20px 60px #0005; }.person-card-offset { margin-top: 3rem; }.person-photo { width: min(100%,290px); aspect-ratio: .8; margin: 0 auto; overflow: hidden; border: 1px solid #ff5ba866; background: radial-gradient(ellipse,#632344,#1a1018); color: #ffc2dc; }.person-photo span { display: grid; height: 100%; place-items: center; font: 8rem 'Playfair Display',serif; }.social-link,.map-link { display: inline-block; margin-top: 1.2rem; color: #ff9bc7; font-size: .66rem; letter-spacing: .12em; text-transform: uppercase; }
.story-list { border-left: 1px solid #ff5ba855; }.story-item { position: relative; display: grid; grid-template-columns: 3rem 1fr; gap: 1rem; padding: 0 0 3rem 1.5rem; }.story-item::before { position: absolute; top: .3rem; left: -.28rem; width: .5rem; height: .5rem; border-radius: 50%; background: var(--pink); box-shadow: 0 0 14px var(--pink); content: ''; }.story-number { color: #ff78b5; font: 1.2rem 'Playfair Display',serif; }.story-item img { grid-column: 2; width: min(100%,420px); max-height: 240px; object-fit: cover; border: 1px solid #ff5ba833; }
.event-card,.bank-card { position: relative; padding: 2rem; border: 1px solid #ff5ba833; background: linear-gradient(145deg,#1a1019,#100b10); box-shadow: 0 15px 40px #0005; }.event-mark { position: absolute; top: 1.5rem; right: 1.5rem; color: #ff5ba8; }.dress-code { padding: 1.5rem; border: 1px solid #ffffff14; color: #fff; }
.gallery-grid { display: grid; grid-auto-rows: 120px; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .7rem; }.gallery-image { width: 100%; height: 100%; object-fit: cover; border: 1px solid #ff5ba844; filter: saturate(.78); }.image-0 { grid-row: span 2; }.image-3 { grid-column: span 2; }.image-4 { grid-row: span 2; }
.rsvp-form { display: grid; gap: 1.1rem; padding: 1.6rem; border: 1px solid #ff5ba833; background: #110d12; }.rsvp-form label { display: grid; gap: .5rem; color: #ff9bc7; font-size: .62rem; letter-spacing: .12em; text-transform: uppercase; }.rsvp-form input,.rsvp-form select,.rsvp-form textarea { width: 100%; border: 0; border-bottom: 1px solid #ffffff26; border-radius: 0; background: transparent; padding: .65rem 0; color: white; font: 400 .85rem 'DM Sans',sans-serif; outline: none; }.rsvp-form option { background: #110d12; }.rsvp-form input:focus,.rsvp-form select:focus,.rsvp-form textarea:focus { border-color: var(--pink); }.rsvp-form input::placeholder,.rsvp-form textarea::placeholder { color: #ffffff50; }
.footer-shell { border-top: 1px solid #ff5ba822; background: #080609; }.nav-dot { display: grid; width: 2.3rem; height: 2.3rem; place-items: center; border-radius: 50%; color: #ff9bc7; transition: background .2s, transform .2s; }.nav-dot:hover { background: #ff5ba822; transform: scale(1.08); }
@keyframes card-rise { 0%,100% { transform: translateZ(14px) translateY(8px) rotateX(5deg); } 50% { transform: translateZ(30px) translateY(-7px) rotateX(5deg); } }
@keyframes flap-breathe { 0%,100% { transform: translateZ(27px) rotateX(0); } 50% { transform: translateZ(27px) rotateX(3deg); } }
@keyframes scene-float { 0%,100% { transform: rotateY(-2deg) translateY(0); } 50% { transform: rotateY(2deg) translateY(-9px); } }
@media (min-width: 768px) { .gallery-grid { grid-auto-rows: 170px; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 1rem; }.image-3 { grid-column: auto; }.story-item { grid-template-columns: 4rem 1fr 250px; gap: 2rem; }.story-item img { grid-column: auto; grid-row: 1; } }
@media (max-width: 767px) { .portrait-scene { width: 84%; }.hero-section { min-height: 100svh; }.hero-index { bottom: 5rem; left: 1.25rem; }.frame-back { right: 0; }.hero-orbit { right: -25%; width: 90vw; }.orbit-two { right: -18%; width: 75vw; } }
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
</style>
