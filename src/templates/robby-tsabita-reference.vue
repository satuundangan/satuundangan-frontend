<template>
  <div class="rt-reference" :class="{ 'is-open': isOpen, 'motion-ready': motionReady }">
    <Transition name="cover">
      <section v-if="!isOpen" class="rt-cover" aria-label="Sampul undangan">
        <div class="rt-cover-scene" aria-hidden="true">
          <img class="cover-background" src="/assets/images/robby-tsabita-reference/garden-background.jpeg" alt="" />
          <div class="cover-haze"></div>
          <img class="cover-blossoms" src="/assets/images/robby-tsabita-reference/hanging-blossoms.webp" alt="" />
          <svg class="cover-wreath" viewBox="0 0 180 180" fill="none">
            <ellipse cx="90" cy="90" rx="55" ry="71" stroke="#71806a" stroke-width="1.5" stroke-dasharray="2 3" />
            <path d="M47 53c21 10 27 23 31 39M133 53c-21 10-27 23-31 39M46 124c18-8 27-20 32-35m56 35c-18-8-27-20-32-35" stroke="#72806b" stroke-width="2" />
            <g fill="#d99b9c"><circle cx="45" cy="51" r="4"/><circle cx="134" cy="51" r="4"/><circle cx="45" cy="126" r="4"/><circle cx="135" cy="126" r="4"/></g>
            <text x="90" y="82" text-anchor="middle" fill="#31465a" font-family="Georgia,serif" font-size="22">R</text>
            <text x="90" y="106" text-anchor="middle" fill="#31465a" font-family="Georgia,serif" font-size="15">&amp;</text>
            <text x="90" y="128" text-anchor="middle" fill="#31465a" font-family="Georgia,serif" font-size="22">T</text>
          </svg>
          <div class="cover-couple-art"><img src="/assets/images/robby-tsabita-reference/couple-portrait.webp" alt="Ilustrasi pasangan pengantin" /></div>
        </div>
        <div class="cover-copy">
          <p class="cover-kicker">The Wedding Of</p>
          <h1>{{ coupleNames.groom }} <i>&amp;</i> {{ coupleNames.bride }}</h1>
          <p class="cover-date">{{ weddingDate }}</p>
          <div class="guest-address"><span>Dear,</span><strong>{{ guestName }}</strong></div>
          <button class="open-button" @click="openInvitation">Open Invitation <span>↓</span></button>
        </div>
      </section>
    </Transition>

    <div v-if="isOpen" ref="scrollRoot" class="rt-scroll" @scroll.passive="onScroll">
      <section class="cinematic-journey" :style="{ height: `${sceneCount * 100}vh` }" aria-label="Pembuka sinematik">
        <div class="stage" :class="{ 'stage-motion-ready': motionReady }">
          <div class="stage-layer stage-sky" :style="layerStyle('background')"></div>
          <div class="stage-layer stage-floor" :style="layerStyle('floor')"><i></i><i></i><i></i><i></i></div>
          <div class="stage-layer stage-tree tree-back" :style="layerStyle('treeBack')"></div>
          <div class="stage-layer stage-tree tree-front" :style="layerStyle('treeFront')"></div>
          <div class="stage-layer stage-couple-art" :style="layerStyle('couple')"><img src="/assets/images/robby-tsabita-reference/couple-portrait.webp" alt="" /></div>
          <div class="stage-vines" :style="layerStyle('vines')"><img src="/assets/images/robby-tsabita-reference/hanging-blossoms.webp" alt="" /></div>
          <div class="stage-title" :style="layerStyle('cover')">
            <div class="mini-wreath">R <b>&amp;</b> T</div>
            <p>The Wedding Of</p><h2>{{ coupleNames.groom }} &amp; {{ coupleNames.bride }}</h2><small>{{ weddingDate }}</small>
          </div>
          <article class="stage-card quote-card" :style="layerStyle('quote')">
            <span class="stage-ornament">❧</span><p>“{{ quoteText }}”</p><small>— {{ quoteSource }}</small>
          </article>
          <article class="stage-card profile-card profile-groom" :style="layerStyle('groom')">
            <span class="profile-placeholder"><img src="/assets/images/robby-tsabita-reference/couple-portrait.webp" alt="" class="profile-groom-art" /></span><small>The Groom</small><h2>{{ coupleNames.groom }}</h2><p>{{ groomFullName }}</p>
          </article>
          <article class="stage-card profile-card profile-bride" :style="layerStyle('bride')">
            <span class="profile-placeholder"><img src="/assets/images/robby-tsabita-reference/couple-portrait.webp" alt="" class="profile-bride-art" /></span><small>The Bride</small><h2>{{ coupleNames.bride }}</h2><p>{{ brideFullName }}</p>
          </article>
          <article class="stage-card event-card" :style="layerStyle('event')">
            <span class="stage-ornament">✿</span><small>Save the Date</small><h2>{{ eventDateShort }}</h2><p>{{ eventLocation }}</p>
          </article>
          <article class="stage-card verse-card" :style="layerStyle('verse')">
            <span class="stage-ornament">❧</span><p>“{{ verseText }}”</p><small>{{ verseSource }}</small>
          </article>
          <span class="stage-butterfly" :style="layerStyle('butterfly')" aria-hidden="true">✧</span>
          <span class="stage-progress">{{ String(Math.min(sceneCount, Math.floor(sceneProgress) + 1)).padStart(2, '0') }} <i>/</i> 06</span>
        </div>
      </section>

      <main class="invitation-content">
        <section id="quote" class="paper-section quote-section">
          <p class="eyebrow">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p><span class="large-quote">“</span>
          <blockquote>{{ quoteText }}</blockquote><p class="quote-attribution">— {{ quoteSource }}</p>
        </section>

        <section id="couple" class="paper-section couple-section">
          <header class="section-heading"><span>With joyful hearts</span><h2>The Couple</h2><i>❧</i></header>
          <div class="couple-columns">
            <article class="person-card"><div class="portrait-placeholder"><img src="/assets/images/robby-tsabita-reference/couple-portrait.webp" alt="Ilustrasi mempelai pria" class="portrait-groom-art" /><b>✿</b></div><small>The Groom</small><h3>{{ groomFullName }}</h3><p>Putra dari</p><strong>{{ parents.groom }}</strong></article>
            <div class="and-mark">&amp;</div>
            <article class="person-card"><div class="portrait-placeholder portrait-bride"><img src="/assets/images/robby-tsabita-reference/couple-portrait.webp" alt="Ilustrasi mempelai wanita" class="portrait-bride-art" /><b>✿</b></div><small>The Bride</small><h3>{{ brideFullName }}</h3><p>Putri dari</p><strong>{{ parents.bride }}</strong></article>
          </div>
        </section>

        <section id="events" class="event-section">
          <header class="section-heading"><span>Join our celebration</span><h2>Wedding Events</h2><i>✿</i></header>
          <div class="event-list">
            <article v-for="(event, idx) in events" :key="idx" class="event-panel"><span class="event-index">0{{ idx + 1 }}</span><p class="eyebrow">{{ event.label }}</p><h3>{{ event.title }}</h3><p class="event-date">{{ event.date }}</p><p>{{ event.time }}</p><p class="event-place">{{ event.location }}</p><a v-if="event.mapUrl" :href="event.mapUrl" target="_blank" rel="noreferrer">Open Map ↗</a></article>
          </div>
          <div class="countdown"><span v-for="unit in countdown" :key="unit.label"><b>{{ unit.value }}</b><small>{{ unit.label }}</small></span></div>
          <button class="outline-button" @click="saveDate">Save The Date</button>
        </section>

        <section id="dress-code" class="paper-section dress-section"><header class="section-heading"><span>For our dearest guests</span><h2>Dress Code</h2><i>❧</i></header><p>We would be delighted to see you in these soft, garden-inspired shades.</p><div class="palette"><span v-for="shade in palette" :key="shade" :style="{ background: shade }"></span></div><small>Dusty rose · sage · warm ivory · soft blue</small></section>

        <section id="verse" class="verse-section"><span>﷽</span><blockquote>{{ verseText }}</blockquote><p>— {{ verseSource }}</p></section>

        <section id="rsvp" class="paper-section rsvp-section"><header class="section-heading"><span>Kindly reply</span><h2>RSVP &amp; Wishes</h2><i>✿</i></header>
          <form class="rsvp-form" @submit.prevent="submitWish"><label>Your Name<input v-model="wish.name" required maxlength="100" placeholder="Nama Anda" /></label><label>Your Wishes<textarea v-model="wish.message" required maxlength="500" rows="3" placeholder="Tulis ucapan dan doa"></textarea></label><div class="rsvp-row"><label>Will you attend?<select v-model="wish.attendance"><option value="yes">Joyfully accepts</option><option value="no">Regretfully declines</option></select></label><label>Guests<select v-model.number="wish.guests"><option v-for="n in 5" :key="n" :value="n">{{ n }}</option></select></label></div><button class="open-button" type="submit">Send Wishes</button><p v-if="wishSent" class="form-feedback">Terima kasih atas doa dan konfirmasinya.</p></form>
          <div class="wishes"><article v-for="(item, idx) in wishes" :key="idx"><b>{{ item.name }}</b><span>{{ item.message }}</span><small>{{ item.attendance === 'yes' ? 'Will attend' : 'Sends their wishes' }}</small></article></div>
        </section>

        <section id="gallery" class="paper-section gallery-section"><header class="section-heading"><span>Our memories</span><h2>Moments in Time</h2><i>❧</i></header><div class="gallery-grid"><figure v-for="(item, idx) in gallerySlots" :key="idx" class="gallery-placeholder" :class="`gallery-${idx + 1}`"><img :src="item.src" :alt="item.alt" loading="lazy" /><figcaption>{{ item.caption }}</figcaption></figure></div></section>

        <section class="closing-section"><div class="closing-wreath">R <i>&amp;</i> T</div><p>Thank you for being part of our story.</p><h2>Two hearts,<br /><em>one love.</em></h2><p>{{ coupleNames.groom }} &amp; {{ coupleNames.bride }}</p><small>Made with love · Envelope</small></section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { EVENT_TIME_ZONE, toEventDate } from '@/utils/eventTime'

const props = defineProps({ data: { type: Object, default: () => ({}) } })
const sceneCount = 6
const isOpen = ref(false)
const motionReady = ref(false)
const scrollRoot = ref(null)
const sceneProgress = ref(0)
const smoothedProgress = ref(0)
let frameId = 0
let scrollTarget = 0
let lastScene = -1
let countdownInterval = 0
let wishSent = ref(false)
const wish = reactive({ name: '', message: '', attendance: 'yes', guests: 1 })

const fallbackNames = { groom: 'Robby', bride: 'Tsabita' }
const cleanName = (value, fallback) => {
  const text = String(value || '').trim()
  if (!text || /^(mempelai pria|mempelai wanita|adam|hawa)$/i.test(text)) return fallback
  return text.split(/\s+/)[0]
}
const coupleNames = computed(() => isGenericDemo.value
  ? fallbackNames
  : { groom: cleanName(props.data?.groomName, fallbackNames.groom), bride: cleanName(props.data?.brideName, fallbackNames.bride) })
const initials = computed(() => ({ groom: coupleNames.value.groom.charAt(0).toUpperCase(), bride: coupleNames.value.bride.charAt(0).toUpperCase() }))
const isGenericDemo = computed(() => {
  const groom = String(props.data?.groomName || '').trim().toLowerCase()
  const bride = String(props.data?.brideName || '').trim().toLowerCase()
  const hasReferenceNames = groom.startsWith('robby') && bride.startsWith('tsabita')
  const genericNames = !groom || !bride || ['adam', 'hawa', 'mempelai pria', 'mempelai wanita'].includes(groom) || ['adam', 'hawa', 'mempelai pria', 'mempelai wanita'].includes(bride)
  return genericNames || (Number(props.data?.id) === 0 && !hasReferenceNames)
})
const guestName = computed(() => isGenericDemo.value ? 'Refda' : props.data?.guestName || 'Tamu Undangan')
const parents = computed(() => ({
  groom: isGenericDemo.value ? 'Mr. Abdul Haris & Mrs. Nok Farkhanah' : props.data?.parents?.groomParents || 'Bapak & Ibu Robby',
  bride: isGenericDemo.value ? 'Mr. Tri Karyanto & Mrs. Wiji Riyanti' : props.data?.parents?.brideParents || 'Bapak & Ibu Tsabita',
}))
const groomFullName = computed(() => isGenericDemo.value ? 'Robby Hadani Faris' : props.data?.groomFullName || coupleNames.value.groom)
const brideFullName = computed(() => isGenericDemo.value ? 'Tsabita Dyah Sayekti' : props.data?.brideFullName || coupleNames.value.bride)
const dateInput = computed(() => isGenericDemo.value ? null : props.data?.resepsiLocation?.dateTime || props.data?.akadLocation?.dateTime || props.data?.weddingDate)
const weddingDate = computed(() => {
  const date = toEventDate(dateInput.value || '2026-09-26T08:00:00')
  return Number.isNaN(date.getTime()) ? 'Saturday, September 26, 2026' : new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: EVENT_TIME_ZONE }).format(date)
})
const eventDateShort = computed(() => weddingDate.value.replace(/^\w+,\s*/, ''))
const eventLocation = computed(() => isGenericDemo.value
  ? 'Gedung Semeru BBPPMPV Bisnis dan Pariwisata · Jl. Raya Parung - Ciputat, Kel. Bojongsari Baru, Kec. Bojongsari, Kota Depok, Jawa Barat 16516'
  : props.data?.resepsiLocation?.locationName || props.data?.resepsiLocation?.address || 'The Garden Hall · Jakarta')
const quoteText = computed(() => isGenericDemo.value
  ? 'You will not enter Paradise until you believe, and you will not believe until you love one another. Shall I inform you of something which, if you do, you will love one another? Give greetings (peace) amongst yourselves.'
  : props.data?.quoteText || 'You will not enter Paradise until you believe, and you will not believe until you love one another.')
const quoteSource = computed(() => isGenericDemo.value ? 'Sahih Muslim' : props.data?.quoteSource || 'Sahih Muslim')
const verseText = computed(() => isGenericDemo.value
  ? 'And it is among His signs that He has created for you wives from among yourselves, so that you may find tranquility in them, and He has created love and kindness between you. Surely in this there are signs for a people who reflect.'
  : props.data?.verseText || 'And it is among His signs that He has created for you wives from among yourselves, so that you may find tranquility in them.')
const verseSource = computed(() => isGenericDemo.value ? 'Ar-Rum : 21' : props.data?.verseSource || 'Ar-Rum : 21')
const events = computed(() => {
  const referenceMap = 'https://maps.app.goo.gl/ZEPUDccesr67jFvR6'
  const akad = isGenericDemo.value ? { mapUrl: referenceMap } : props.data?.akadLocation || {}
  const reception = isGenericDemo.value ? { mapUrl: referenceMap } : props.data?.resepsiLocation || {}
  return [
    { label: 'The Ceremony', title: 'Akad', date: formatDate(akad?.dateTime) || weddingDate.value, time: isGenericDemo.value ? '07:00 – 09:00 AM' : formatTime(akad?.dateTime) || '08.00 – 10.00 WIB', location: isGenericDemo.value ? eventLocation.value : akad?.locationName || akad?.address || eventLocation.value, mapUrl: akad?.mapUrl || akad?.mapsUrl },
    { label: 'The Celebration', title: 'Reception', date: formatDate(reception?.dateTime) || weddingDate.value, time: isGenericDemo.value ? '11:00 – 14:00 AM' : formatTime(reception?.dateTime) || '11.00 – 14.00 WIB', location: isGenericDemo.value ? eventLocation.value : reception?.locationName || reception?.address || eventLocation.value, mapUrl: reception?.mapUrl || reception?.mapsUrl },
  ]
})
const palette = ['#d9a2a1', '#9ba58d', '#eee6d4', '#9aa7ad']
const gallerySlots = [
  { src: '/assets/images/robby-tsabita-reference/gallery-garden-moments.webp', alt: 'Pasangan pengantin berdiri di taman', caption: 'A day to remember' },
  { src: '/assets/images/robby-tsabita-reference/gallery-garden-moments.webp', alt: 'Potret pasangan pengantin', caption: 'Our beginning' },
  { src: '/assets/images/robby-tsabita-reference/gallery-garden-moments.webp', alt: 'Pasangan pengantin berjalan di taman', caption: 'Together, always' },
  { src: '/assets/images/robby-tsabita-reference/gallery-garden-moments.webp', alt: 'Pasangan di dekat air mancur taman', caption: 'A little forever' },
]
const countdown = ref([{ value: '00', label: 'Days' }, { value: '00', label: 'Hours' }, { value: '00', label: 'Minutes' }, { value: '00', label: 'Seconds' }])
const wishes = ref([
  { name: 'Keluarga & Sahabat', message: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Selamat berbahagia!', attendance: 'yes' },
  { name: 'With love', message: 'Wishing you a lifetime of laughter, love, and beautiful memories together.', attendance: 'yes' },
])

function formatDate(value) {
  if (!value) return ''
  const date = toEventDate(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: EVENT_TIME_ZONE }).format(date)
}
function formatTime(value) {
  if (!value) return ''
  const date = toEventDate(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: EVENT_TIME_ZONE }).format(date) + ' WIB'
}

// Each scene has independent layer keyframes. The local scene progress is eased
// continuously, so scrolling backwards reverses the same transform path.
const states = {
  background: [
    [{ x: 0, y: 0, s: 1, o: 1 }, { x: 150, y: 260, s: 1.8, o: 1 }],
    [{ x: 150, y: 260, s: 1.8, o: 1 }, { x: -20, y: 50, s: 2, o: 1 }],
    [{ x: -20, y: 50, s: 2, o: 1 }, { x: 0, y: 80, s: 2.3, o: 1 }],
    [{ x: 0, y: 80, s: 2.3, o: 1 }, { x: 0, y: 400, s: 3, o: 1 }],
    [{ x: 0, y: 400, s: 3, o: 1 }, { x: 0, y: 50, s: 1.5, o: 1 }],
    [{ x: 0, y: 50, s: 1.5, o: 1 }, { x: 0, y: 300, s: 3, o: 0.4 }],
  ],
  floor: [
    [{ x: 0, y: 0, s: 1, o: 1 }, { x: 300, y: 600, s: 3, o: 1 }],
    [{ x: 300, y: 600, s: 3, o: 1 }, { x: -220, y: 200, s: 6.6, o: 1 }],
    [{ x: -220, y: 200, s: 6.6, o: 1 }, { x: -40, y: 300, s: 6.9, o: 1 }],
    [{ x: -40, y: 300, s: 6.9, o: 1 }, { x: 0, y: 800, s: 8, o: 1 }],
    [{ x: 0, y: 800, s: 8, o: 1 }, { x: 0, y: 90, s: 1.6, o: 1 }],
    [{ x: 0, y: 90, s: 1.6, o: 1 }, { x: 0, y: 760, s: 7, o: 0.5 }],
  ],
  couple: [
    [{ x: 0, y: 0, s: 0.25, o: 1 }, { x: 320, y: 575, s: 0.7, o: 0.9 }],
    [{ x: 320, y: 575, s: 0.7, o: 0.9 }, { x: -160, y: 90, s: 1.5, o: 0.65 }],
    [{ x: -160, y: 90, s: 1.5, o: 0.65 }, { x: 160, y: 100, s: 1.5, o: 0.65 }],
    [{ x: 160, y: 100, s: 1.5, o: 0.65 }, { x: 0, y: 780, s: 2.2, o: 0.2 }],
    [{ x: 0, y: 780, s: 2.2, o: 0.2 }, { x: 0, y: 900, s: 2, o: 0 }],
    [{ x: 0, y: 900, s: 2, o: 0 }, { x: 0, y: 1200, s: 3, o: 0 }],
  ],
  treeBack: [
    [{ x: -80, y: 0, s: 1.2, o: 1 }, { x: -160, y: 260, s: 2.2, o: 1 }],
    [{ x: -160, y: 260, s: 2.2, o: 1 }, { x: 40, y: 160, s: 4, o: 0.9 }],
    [{ x: 40, y: 160, s: 4, o: 0.9 }, { x: -60, y: 200, s: 4.5, o: 0.8 }],
    [{ x: -60, y: 200, s: 4.5, o: 0.8 }, { x: 200, y: 600, s: 5.9, o: 0.7 }],
    [{ x: 200, y: 600, s: 5.9, o: 0.7 }, { x: 600, y: 0, s: 2, o: 0 }],
    [{ x: 600, y: 0, s: 2, o: 0 }, { x: 900, y: 500, s: 5, o: 0 }],
  ],
  treeFront: [
    [{ x: 120, y: 20, s: 1, o: 1 }, { x: 260, y: 440, s: 3.2, o: 1 }],
    [{ x: 260, y: 440, s: 3.2, o: 1 }, { x: -220, y: 300, s: 5.9, o: 1 }],
    [{ x: -220, y: 300, s: 5.9, o: 1 }, { x: 150, y: 380, s: 4.8, o: 1 }],
    [{ x: 150, y: 380, s: 4.8, o: 1 }, { x: -200, y: 800, s: 5.8, o: 0.8 }],
    [{ x: -200, y: 800, s: 5.8, o: 0.8 }, { x: -700, y: 200, s: 2, o: 0 }],
    [{ x: -700, y: 200, s: 2, o: 0 }, { x: -900, y: 800, s: 5, o: 0 }],
  ],
  arch: [
    [{ x: 0, y: 0, s: 1, o: 1 }, { x: 0, y: 0, s: 2.5, o: 0.8 }],
    [{ x: 0, y: 0, s: 2.5, o: 0.8 }, { x: -30, y: 50, s: 2.9, o: 0.65 }],
    [{ x: -30, y: 50, s: 2.9, o: 0.65 }, { x: 20, y: 100, s: 3, o: 0.5 }],
    [{ x: 20, y: 100, s: 3, o: 0.5 }, { x: 0, y: 400, s: 4, o: 0.3 }],
    [{ x: 0, y: 400, s: 4, o: 0.3 }, { x: 0, y: 50, s: 2, o: 0.1 }],
    [{ x: 0, y: 50, s: 2, o: 0.1 }, { x: 0, y: 400, s: 4, o: 0 }],
  ],
  vines: [
    [{ x: 0, y: 0, s: 1, o: 1 }, { x: 0, y: -200, s: 1.1, o: 0.4 }],
    [{ x: 0, y: -200, s: 1.1, o: 0.4 }, { x: -20, y: -350, s: 1.2, o: 0 }],
    [{ x: -20, y: -350, s: 1.2, o: 0 }, { x: 0, y: -450, s: 1.3, o: 0 }],
    [{ x: 0, y: -450, s: 1.3, o: 0 }, { x: 0, y: -500, s: 1.4, o: 0 }],
    [{ x: 0, y: -500, s: 1.4, o: 0 }, { x: 0, y: -600, s: 1.4, o: 0 }],
    [{ x: 0, y: -600, s: 1.4, o: 0 }, { x: 0, y: -700, s: 1.4, o: 0 }],
  ],
  cover: [[{ x: 0, y: 0, s: 1, o: 1 }, { x: 0, y: -40, s: 0.5, o: 0 }], [{ x: 0, y: -40, s: 0.5, o: 0 }, { x: 0, y: -80, s: 0.3, o: 0 }], [{ x: 0, y: -80, s: 0.3, o: 0 }, { x: 0, y: -100, s: 0.2, o: 0 }], [{ x: 0, y: -100, s: 0.2, o: 0 }, { x: 0, y: -120, s: 0.1, o: 0 }], [{ x: 0, y: -120, s: 0.1, o: 0 }, { x: 0, y: -140, s: 0.1, o: 0 }], [{ x: 0, y: -140, s: 0.1, o: 0 }, { x: 0, y: -160, s: 0.1, o: 0 }]],
  quote: [
    [{ p: 0, x: 300, y: 320, s: 1.4, o: 0 }, { p: 0.7, x: 300, y: 320, s: 1.4, o: 0 }, { p: 1, x: 0, y: 0, s: 1, o: 1 }],
    [{ p: 0, x: 300, y: 320, s: 1.4, o: 1 }, { p: 0.5, x: 0, y: 0, s: 1, o: 0 }, { p: 1, x: -200, y: 0, s: 0.8, o: 0 }],
    ...Array(4).fill([{ p: 0, x: -200, y: 0, s: 0.8, o: 0 }, { p: 1, x: -300, y: 0, s: 0.6, o: 0 }]),
  ],
  groom: [
    [{ x: -320, y: 0, s: 0.8, o: 0 }, { x: -320, y: 0, s: 0.8, o: 0 }],
    [{ p: 0, x: 0, y: 0, s: 1, o: 0 }, { p: 0.5, x: 0, y: 0, s: 1, o: 0 }, { p: 1, x: -320, y: 0, s: 1, o: 1 }],
    [{ p: 0, x: -320, y: 0, s: 1, o: 1 }, { p: 0.5, x: 0, y: 0, s: 1, o: 0 }, { p: 1, x: 0, y: 0, s: 1, o: 0 }],
    ...Array(3).fill([{ x: 320, y: 0, s: 0.8, o: 0 }, { x: 420, y: 0, s: 0.6, o: 0 }]),
  ],
  bride: [
    ...Array(2).fill([{ x: 320, y: 0, s: 0.8, o: 0 }, { x: 320, y: 0, s: 0.8, o: 0 }]),
    [{ p: 0, x: 0, y: 0, s: 1, o: 0 }, { p: 0.5, x: 0, y: 0, s: 1, o: 0 }, { p: 1, x: 320, y: 0, s: 1, o: 1 }],
    [{ p: 0, x: 320, y: 0, s: 1, o: 1 }, { p: 0.5, x: 0, y: 0, s: 1, o: 0 }, { p: 1, x: 0, y: 0, s: 1, o: 0 }],
    ...Array(2).fill([{ x: -320, y: 0, s: 0.8, o: 0 }, { x: -420, y: 0, s: 0.6, o: 0 }]),
  ],
  event: [
    ...Array(3).fill([{ x: 0, y: -500, s: 0.7, o: 0 }, { x: 0, y: -500, s: 0.7, o: 0 }]),
    [{ p: 0, x: 0, y: -500, s: 0.7, o: 0 }, { p: 0.5, x: 0, y: -500, s: 0.7, o: 0 }, { p: 1, x: 0, y: 0, s: 1, o: 1 }],
    [{ p: 0, x: 0, y: 0, s: 1, o: 1 }, { p: 0.5, x: 0, y: -500, s: 0.7, o: 0 }, { p: 1, x: 0, y: -500, s: 0.7, o: 0 }],
    [{ x: 0, y: -320, s: 0.8, o: 0 }, { x: 0, y: -500, s: 0.6, o: 0 }],
  ],
  verse: [
    ...Array(4).fill([{ x: 500, y: 0, s: 0.5, o: 0 }, { x: 500, y: 0, s: 0.5, o: 0 }]),
    [{ p: 0, x: 500, y: 0, s: 0.5, o: 0 }, { p: 0.5, x: 500, y: 0, s: 0.5, o: 0 }, { p: 1, x: 0, y: 0, s: 1, o: 1 }],
    [{ p: 0, x: 0, y: 0, s: 1, o: 1 }, { p: 0.5, x: 0, y: 300, s: 0.5, o: 0 }, { p: 1, x: -500, y: 0, s: 0.5, o: 0 }],
  ],
  butterfly: [[{ x: 0, y: 0, s: 1, o: 1 }, { x: 120, y: -160, s: 1.1, o: 1 }], [{ x: 120, y: -160, s: 1.1, o: 1 }, { x: -80, y: -220, s: 1.2, o: 1 }], [{ x: -80, y: -220, s: 1.2, o: 1 }, { x: 100, y: -300, s: 1.2, o: 1 }], [{ x: 100, y: -300, s: 1.2, o: 1 }, { x: 120, y: -200, s: 1.1, o: 1 }], [{ x: 120, y: -200, s: 1.1, o: 1 }, { x: 300, y: -400, s: 1, o: 0 }], [{ x: 300, y: -400, s: 1, o: 0 }, { x: 400, y: -600, s: 1, o: 0 }]],
}

function interpolate(a, b, t) { return a + (b - a) * t }
function frameFor(key, progress) {
  const scene = Math.min(sceneCount - 1, Math.floor(progress))
  const t = Math.max(0, Math.min(1, progress - scene))
  const frames = states[key]?.[scene] || [{ x: 0, y: 0, s: 1, o: 0 }, { x: 0, y: 0, s: 1, o: 0 }]
  const stops = frames.map((frame, index) => ({ p: frame.p ?? index / (frames.length - 1), ...frame }))
  const next = stops.findIndex((frame) => t <= frame.p)
  const endIndex = next < 0 ? stops.length - 1 : next === 0 ? 1 : next
  const start = stops[endIndex - 1]
  const end = stops[endIndex] || stops[stops.length - 1]
  const local = end.p === start.p ? 1 : Math.max(0, Math.min(1, (t - start.p) / (end.p - start.p)))
  return { x: interpolate(start.x, end.x, local), y: interpolate(start.y, end.y, local), s: interpolate(start.s, end.s, local), o: interpolate(start.o, end.o, local) }
}
function layerStyle(key) {
  const f = frameFor(key, smoothedProgress.value)
  const anchor = key === 'cover'
    ? 'translateX(-50%) '
    : ['quote', 'groom', 'bride', 'event', 'verse'].includes(key)
      ? 'translate(-50%, -50%) '
      : ''
  return { transform: `${anchor}translate3d(${f.x}px, ${f.y}px, 0) scale(${f.s})`, opacity: f.o }
}
function onScroll() {
  if (!scrollRoot.value) return
  const height = scrollRoot.value.clientHeight || window.innerHeight
  scrollTarget = Math.max(0, Math.min(sceneCount, scrollRoot.value.scrollTop / height))
  sceneProgress.value = scrollTarget
}
function animate() {
  const destination = isOpen.value ? scrollTarget : 0
  const scene = Math.floor(smoothedProgress.value)
  const smoothing = scene >= sceneCount - 1 ? 0.025 : 0.015
  smoothedProgress.value += (destination - smoothedProgress.value) * smoothing
  if (Math.abs(destination - smoothedProgress.value) < 0.0005) smoothedProgress.value = destination
  const currentScene = Math.min(sceneCount - 1, Math.floor(smoothedProgress.value))
  if (currentScene !== lastScene) { lastScene = currentScene; motionReady.value = true }
  frameId = requestAnimationFrame(animate)
}
function openInvitation() {
  isOpen.value = true
  requestAnimationFrame(() => { if (scrollRoot.value) { scrollRoot.value.scrollTop = 0; onScroll() } })
}
function submitWish() {
  wishes.value.unshift({ ...wish })
  wish.name = ''
  wish.message = ''
  wishSent.value = true
  window.setTimeout(() => { wishSent.value = false }, 3500)
}
function saveDate() {
  const start = dateInput.value ? new Date(dateInput.value) : new Date('2026-09-26T08:00:00+07:00')
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`The Wedding of ${coupleNames.value.groom} & ${coupleNames.value.bride}`)}&dates=${stamp(start)}/${stamp(end)}&details=${encodeURIComponent('Wedding celebration')}&location=${encodeURIComponent(eventLocation.value)}`
  window.open(href, '_blank', 'noopener,noreferrer')
}
function updateCountdown() {
  const target = dateInput.value ? new Date(dateInput.value) : new Date('2026-09-26T08:00:00+07:00')
  const remaining = Math.max(0, target.getTime() - Date.now())
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
  countdown.value = values.map((value, index) => ({ value: String(value).padStart(2, '0'), label: ['Days', 'Hours', 'Minutes', 'Seconds'][index] }))
}
onMounted(() => { animate(); updateCountdown(); countdownInterval = window.setInterval(updateCountdown, 1000) })
onBeforeUnmount(() => { cancelAnimationFrame(frameId); window.clearInterval(countdownInterval) })
</script>

<style scoped>
.rt-reference{--ink:#30465a;--leaf:#71806a;--rose:#d99b9c;--paper:#f8f5ed;--stone:#d7d0c1;min-height:100vh;background:#e9e5d9;color:var(--ink);font-family:'Lora',Georgia,serif;overflow:hidden}.rt-cover{position:fixed;inset:0;z-index:90;display:grid;place-items:center;overflow:hidden;background:#d8d1c1}.rt-cover-scene{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#f3efe5 0 20%,transparent 63%),linear-gradient(180deg,#dce2d8,#e8e2d4 68%,#cabfa9)}.cover-haze{position:absolute;inset:0;background:linear-gradient(180deg,rgba(240,239,226,.4),transparent 70%)}.cover-arch{position:absolute;width:min(76vw,390px);height:78vh;left:50%;bottom:-20%;transform:translateX(-50%);border:16px solid #e5dfd1;border-bottom:0;border-radius:50% 50% 0 0;box-shadow:inset 0 0 0 2px #c8bfae,0 0 0 1px rgba(83,78,63,.15);background:linear-gradient(180deg,rgba(222,215,200,.2),rgba(192,184,166,.4))}.cover-stair{position:absolute;left:50%;height:10vh;transform:translateX(-50%);background:linear-gradient(180deg,#d9d1c2,#eee9dd 14%,#c8bead 16%,#e5dfd2 30%);clip-path:polygon(12% 0,88% 0,100% 100%,0 100%);opacity:.92}.stair-one{bottom:0;width:100%;height:20vh}.stair-two{bottom:16vh;width:72%;height:13vh}.cover-vine{position:absolute;top:-1rem;color:var(--leaf);font-size:clamp(2rem,8vw,4.8rem);line-height:1.6;writing-mode:vertical-rl;text-shadow:0 4px 8px #7774}.vine-left{left:0;transform:rotate(22deg)}.vine-right{right:0;transform:rotate(-22deg)}.cover-wreath{position:absolute;left:50%;top:14%;width:148px;transform:translateX(-50%)}.cover-couple-art{position:absolute;left:50%;top:35%;transform:translateX(-50%) scale(1.15);width:180px;height:220px}.cover-copy{position:relative;z-index:2;align-self:center;margin-top:12vh;text-align:center;color:#30465a;text-shadow:0 1px 6px #f8f5ed99}.cover-kicker{text-transform:uppercase;letter-spacing:.3em;font-size:.72rem;margin:0 0 .25rem}.cover-copy h1{font-size:clamp(2rem,8vw,3.15rem);font-weight:400;line-height:1;margin:.1rem 0}.cover-copy h1 i{font-size:.7em;color:#71806a}.cover-date{font:500 .72rem/1.4 'Poppins',sans-serif;letter-spacing:.11em;margin:.6rem 0 1.2rem}.guest-address{display:flex;flex-direction:column;gap:.1rem;font: .78rem 'Poppins',sans-serif}.guest-address strong{font:600 1rem 'Lora',serif}.open-button{margin:1rem auto 0;display:flex;gap:1rem;align-items:center;justify-content:center;border:0;background:#243b52;color:white;padding:.85rem 1.4rem;min-width:200px;letter-spacing:.04em;box-shadow:0 8px 20px #29374733;cursor:pointer}.open-button:hover{background:#385267}.cover-enter-active,.cover-leave-active{transition:opacity .9s ease,transform .9s ease}.cover-leave-to{opacity:0;transform:scale(1.08)}
.rt-scroll{height:100svh;overflow-y:auto;scrollbar-width:none;overscroll-behavior:contain}.rt-scroll::-webkit-scrollbar{display:none}.cinematic-journey{position:relative}.stage{position:sticky;top:0;height:100svh;min-height:560px;overflow:hidden;isolation:isolate;background:#ddd7c8}.stage-layer,.stage-vines,.stage-title,.stage-card,.stage-butterfly{position:absolute;will-change:transform,opacity;transition:none}.stage-sky{inset:-40%;background:radial-gradient(ellipse at 50% 40%,#f4f0e7 0 13%,#e7e2d5 30%,transparent 65%),linear-gradient(180deg,#cbd8cf,#e9e3d5 70%,#c7bba4);z-index:-5}.stage-arch{width:78vw;height:110vh;left:11vw;top:7vh;border:22px solid #e9e2d4;border-bottom:0;border-radius:50% 50% 0 0;box-shadow:inset 0 0 0 2px #bdb5a5,0 0 0 4px #e4ddce;z-index:-4}.stage-arch span{position:absolute;inset:9% 10% 0;border:1px solid #c8c0b1;border-bottom:0;border-radius:50% 50% 0 0}.stage-floor{left:-50%;right:-50%;bottom:-20%;height:68%;background:repeating-linear-gradient(180deg,#d0c7b7 0 3px,#e5decf 4px 12px);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);z-index:-2}.stage-floor i{position:absolute;left:50%;height:2px;background:#b8ad99;width:90%;transform:translateX(-50%)}.stage-floor i:nth-child(1){top:20%}.stage-floor i:nth-child(2){top:43%}.stage-floor i:nth-child(3){top:67%}.stage-floor i:nth-child(4){top:87%}.stage-tree{bottom:-12%;width:70vw;height:82vh;background:radial-gradient(ellipse at 35% 42%,#778c70 0 17%,transparent 18%),radial-gradient(ellipse at 63% 38%,#869778 0 20%,transparent 21%),radial-gradient(ellipse at 48% 24%,#92a181 0 20%,transparent 21%),radial-gradient(ellipse at 48% 60%,#536c58 0 34%,transparent 35%);filter:drop-shadow(0 12px 18px #4d5d4840);z-index:-1}.tree-back{left:-34%;opacity:.72}.tree-front{right:-42%;background:radial-gradient(ellipse at 35% 42%,#61795f 0 17%,transparent 18%),radial-gradient(ellipse at 63% 38%,#7e8f6e 0 20%,transparent 21%),radial-gradient(ellipse at 48% 24%,#8b9874 0 20%,transparent 21%),radial-gradient(ellipse at 48% 60%,#495e4d 0 34%,transparent 35%)}.stage-couple-art{left:calc(50% - 76px);top:27%;width:152px;height:230px;transform-origin:center bottom;z-index:1}.silhouette{position:absolute;bottom:0;display:block;width:65px;height:150px;border-radius:40px 40px 0 0;background:#f8f4e9;border:1px solid #6c7880;filter:drop-shadow(0 3px 5px #65706044)}.silhouette:before{content:'';position:absolute;width:43px;height:49px;left:10px;top:-39px;border-radius:50% 50% 44% 44%;background:#d9c6ac;border:1px solid #78817c}.silhouette:after{content:'';position:absolute;left:2px;right:2px;bottom:0;height:75%;background:linear-gradient(100deg,transparent 45%,#d7d0c1 46% 49%,transparent 50%),linear-gradient(180deg,#fbf8ef,#e8e1d3);clip-path:polygon(25% 0,75% 0,100% 100%,0 100%)}.silhouette.groom{left:24px;width:56px;height:142px;background:#31465a}.silhouette.groom:before{width:35px;height:43px;left:10px;top:-37px;background:#bd9d82}.silhouette.groom:after{height:70%;background:linear-gradient(90deg,#293d50,#526476)}.silhouette.bride{left:71px;width:72px;height:174px;background:#f4eee2}.silhouette.bride:before{left:15px;width:42px;height:49px;top:-42px;background:#cbaa8a}.silhouette.bride:after{background:linear-gradient(90deg,#eee8db,#fffaf0 50%,#ded5c5);height:77%}.stage-vines{top:-2rem;left:0;right:0;display:flex;justify-content:space-between;color:#6c8064;font-size:clamp(2.6rem,9vw,5rem);opacity:.9;z-index:2}.stage-vines span:first-child{transform:rotate(24deg);writing-mode:vertical-rl}.stage-vines span:last-child{transform:rotate(-24deg);writing-mode:vertical-rl}.stage-title{left:50%;top:9%;width:min(90%,520px);text-align:center;transform:translateX(-50%);z-index:4}.mini-wreath{margin:auto auto .5rem;width:46px;height:46px;border:1px solid #71806a;border-radius:50%;display:grid;place-items:center;font-size:.85rem}.mini-wreath b{font-size:.6rem}.stage-title p,.stage-title small,.stage-card small,.profile-card small{font: .6rem 'Poppins',sans-serif;letter-spacing:.2em;text-transform:uppercase}.stage-title h2{font-size:clamp(1.4rem,6vw,2.6rem);font-weight:400;margin:.3rem 0}.stage-card{left:50%;top:50%;width:min(78vw,380px);transform:translate(-50%,-50%);text-align:center;z-index:5;color:#30465a}.stage-card p{font-size:1rem;line-height:1.65}.stage-ornament{display:block;color:#71806a;font-size:2.4rem}.quote-card p{font-size:clamp(1rem,4vw,1.45rem);font-style:italic}.quote-card small{display:block}.profile-card{width:min(75vw,320px);background:#f8f5eddb;padding:1rem 1rem 1.3rem;box-shadow:0 12px 40px #53604c22}.profile-placeholder{height:30vh;max-height:250px;min-height:140px;display:grid;place-items:center;background:radial-gradient(circle at 50% 35%,#d4bea5 0 11%,transparent 12%),linear-gradient(135deg,#a1a98f,#d9cbb5);font-size:4rem;color:#fff9}.profile-card h2{font-size:2rem;font-weight:400;margin:.45rem 0}.event-card h2{font-size:1.6rem;font-weight:400}.verse-card p{font-size:1.2rem;font-style:italic}.stage-butterfly{left:20%;top:35%;font-size:2rem;color:#d99b9c;z-index:6}.stage-progress{position:absolute;right:1.25rem;bottom:1.2rem;z-index:7;font: .65rem 'Poppins',sans-serif;letter-spacing:.15em}.stage-progress i{color:#aa9e8d;font-style:normal}.motion-ready .stage-layer,.motion-ready .stage-vines,.motion-ready .stage-title,.motion-ready .stage-card,.motion-ready .stage-butterfly{will-change:transform,opacity}
.invitation-content{position:relative;background:var(--paper);z-index:4}.paper-section{padding:clamp(4rem,12vw,8rem) 1.5rem;text-align:center}.quote-section{background:#f4f0e6}.eyebrow,.section-heading span,.person-card small{font: .65rem 'Poppins',sans-serif;text-transform:uppercase;letter-spacing:.22em;color:#71806a}.large-quote{display:block;font:6rem Georgia;color:#d99b9c;height:4rem}.quote-section blockquote,.verse-section blockquote{max-width:44rem;margin:0 auto;font-size:clamp(1.35rem,4.5vw,2.2rem);line-height:1.5;font-style:italic}.quote-attribution{font: .7rem 'Poppins',sans-serif;letter-spacing:.12em;margin-top:1.5rem}.section-heading h2{font-size:clamp(2.1rem,7vw,3.6rem);font-weight:400;margin:.55rem 0}.section-heading i{display:block;color:#71806a;font-size:1.6rem;font-style:normal}.couple-columns{position:relative;display:grid;grid-template-columns:1fr;gap:3rem;max-width:760px;margin:3.5rem auto 0}.person-card h3{font-size:1.25rem;font-weight:400;margin:.9rem 0 .35rem}.person-card p{font: .72rem 'Poppins',sans-serif;color:#8b8375;margin:.8rem 0 .2rem}.person-card strong{font-size:.85rem;font-weight:400}.portrait-placeholder{position:relative;display:grid;place-items:center;width:min(70vw,260px);aspect-ratio:4/5;margin:0 auto 1.2rem;border-radius:48% 48% 4px 4px;background:radial-gradient(circle at 50% 28%,#d1b99e 0 13%,transparent 14%),linear-gradient(130deg,#98a189,#e1d1b9);color:#fff;font-size:4rem;overflow:hidden}.portrait-placeholder:after{content:'';position:absolute;left:22%;right:22%;bottom:-5%;height:58%;border-radius:48% 48% 0 0;background:linear-gradient(90deg,#e8e0d3,#fff8ed,#d9d1c3)}.portrait-placeholder b{position:absolute;right:1rem;top:1rem;color:#fff9;font-size:1.5rem;z-index:1}.portrait-bride{background:radial-gradient(circle at 50% 28%,#cfb092 0 13%,transparent 14%),linear-gradient(130deg,#d1a4a1,#e6dac8)}.and-mark{font-size:2.2rem;color:#d99b9c}.event-section{padding:5rem 1.5rem;text-align:center;background:#dfe2d6}.event-list{display:grid;gap:1rem;max-width:800px;margin:3rem auto}.event-panel{position:relative;padding:2rem 1.25rem;background:#f8f5ed;border:1px solid #d7d2c5}.event-index{position:absolute;right:1rem;top:.8rem;font-size:2rem;color:#e2d7c6}.event-panel h3{font-size:1.8rem;font-weight:400;margin:.5rem}.event-panel p{font: .8rem/1.5 'Poppins',sans-serif}.event-panel .event-date{font-family:'Lora',serif;font-size:1rem}.event-panel .event-place{font-weight:600}.event-panel a{display:inline-block;color:#71806a;font: .7rem 'Poppins',sans-serif;text-decoration:underline;margin-top:.5rem}.countdown{display:flex;justify-content:center;gap:1rem;margin:2.5rem auto}.countdown span{display:flex;flex-direction:column;min-width:55px}.countdown b{font-size:1.4rem;font-weight:400}.countdown small{font: .55rem 'Poppins',sans-serif;text-transform:uppercase;letter-spacing:.12em}.outline-button{border:1px solid #526455;background:transparent;padding:.75rem 1.4rem;font: .7rem 'Poppins',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#354b3d;cursor:pointer}.dress-section{background:#f7f3e9}.dress-section>p{font-size:.95rem;line-height:1.6;max-width:30rem;margin:1.5rem auto}.palette{display:flex;justify-content:center;gap:.65rem;margin:2rem auto 1rem}.palette span{width:48px;height:48px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px #3b3b3318}.dress-section>small{font: .6rem 'Poppins',sans-serif;letter-spacing:.07em;color:#898476}.verse-section{padding:6rem 1.5rem;text-align:center;background:#33495a;color:#f8f5ed}.verse-section>span{font-size:1.7rem;color:#d9c2a9}.verse-section blockquote{margin:1rem auto}.verse-section p{font: .65rem 'Poppins',sans-serif;letter-spacing:.15em}.rsvp-section{background:#f1ece1}.rsvp-form{max-width:500px;margin:2.5rem auto;display:grid;gap:1rem;text-align:left;font: .68rem 'Poppins',sans-serif;letter-spacing:.05em}.rsvp-form label{display:grid;gap:.45rem}.rsvp-form input,.rsvp-form textarea,.rsvp-form select{width:100%;padding:.8rem;border:1px solid #d4ccbd;background:#fcfaf4;color:#30465a;font: .85rem 'Lora',serif;outline-color:#9ba58d}.rsvp-row{display:grid;grid-template-columns:2fr 1fr;gap:.8rem}.rsvp-form .open-button{margin:.5rem auto 0;width:100%}.form-feedback{text-align:center;color:#657d5f}.wishes{max-width:580px;margin:3rem auto 0;text-align:left;display:grid;gap:.8rem}.wishes article{display:grid;gap:.4rem;padding:1rem;border-left:2px solid #d99b9c;background:#faf8f2}.wishes b{font-size:.85rem}.wishes span{font-size:.82rem;line-height:1.5}.wishes small{font: .58rem 'Poppins',sans-serif;color:#71806a}.gallery-section{background:#e4e4d9}.gallery-grid{max-width:900px;margin:3rem auto 0;display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.gallery-placeholder{aspect-ratio:1;display:grid;place-items:center;position:relative;overflow:hidden;background:linear-gradient(135deg,#d4c8b4,#a3ad99);color:#fff;text-align:center;padding:1rem}.gallery-placeholder:nth-child(even){background:linear-gradient(145deg,#c2b5a2,#d7a6a4)}.gallery-placeholder span{max-width:9rem;font-size:.95rem;font-style:italic;text-shadow:0 1px 4px #514c4355}.gallery-placeholder i{position:absolute;right:.7rem;top:.5rem;font-style:normal;color:#fff9}.gallery-2,.gallery-4{margin-top:1.5rem}.closing-section{padding:5rem 1.5rem 7rem;text-align:center;background:#d8ddcf}.closing-wreath{width:100px;height:100px;display:grid;place-items:center;border:1px solid #71806a;border-radius:50%;margin:0 auto 1rem;font-size:1.7rem}.closing-wreath i{font-size:1rem}.closing-section>p{font: .65rem 'Poppins',sans-serif;letter-spacing:.15em}.closing-section h2{font-size:2.5rem;font-weight:400;line-height:1.05;margin:1.7rem}.closing-section h2 em{color:#71806a}.closing-section>small{font: .55rem 'Poppins',sans-serif;letter-spacing:.14em;color:#7a8074}.cover-enter-active,.cover-leave-active{transition:opacity .9s ease,transform .9s ease}.cover-leave-to{opacity:0;transform:scale(1.04)}
@media(min-width:700px){.cover-wreath{top:9%;width:175px}.cover-couple-art{top:29%;transform:translateX(-50%) scale(1.35)}.cover-copy{margin-top:9vh}.stage-arch{left:30vw;width:40vw}.stage-couple-art{top:22%;transform:scale(1.2)}.stage-title{top:7%}.couple-columns{grid-template-columns:1fr 50px 1fr;align-items:center}.person-card:nth-child(3){margin-top:5rem}.and-mark{grid-column:2;grid-row:1}.event-list{grid-template-columns:1fr 1fr}.gallery-grid{grid-template-columns:repeat(4,1fr)}.gallery-2,.gallery-4{margin-top:2.5rem}}
@media(prefers-reduced-motion:reduce){.rt-reference *, .rt-reference *::before,.rt-reference *::after{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}.rt-reference .stage-layer,.rt-reference .stage-vines,.rt-reference .stage-butterfly{transform:none!important}.rt-reference .stage-card{transform:translate(-50%,-50%)!important;opacity:0!important}.rt-reference .stage-title{transform:translateX(-50%)!important;opacity:1!important}}

/* Local reference assets: supplied garden and couple art, plus original florals. */
.rt-cover-scene{background:#435440}
.cover-background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 45%;filter:saturate(.9)}
.cover-haze{background:linear-gradient(180deg,rgba(238,237,215,.16),rgba(22,39,28,.08) 42%,rgba(22,33,31,.44))}
.cover-arch,.cover-stair,.cover-vine{display:none}
.cover-blossoms{position:absolute;z-index:1;top:-2%;left:-9%;width:118%;height:auto;max-height:34vh;object-fit:contain;object-position:top center;filter:drop-shadow(0 4px 8px #22352255)}
.cover-wreath{z-index:2;top:5%;width:102px;filter:drop-shadow(0 1px 4px #f8f5edaa)}
.cover-couple-art{top:20%;width:min(83vw,400px);height:50vh;transform:translateX(-50%);display:grid;place-items:center;filter:drop-shadow(0 12px 18px #23302340)}
.cover-couple-art img{height:100%;max-width:100%;object-fit:contain}
.cover-copy{position:absolute;left:1rem;right:1rem;bottom:4vh;margin:0;padding:1rem .5rem .75rem;color:#fdf9ed;text-shadow:0 2px 10px #102317,0 1px 3px #102317;background:linear-gradient(180deg,transparent,#17251dcc 20%,#17251dcc);}
.cover-copy h1{font-size:clamp(1.7rem,7vw,2.7rem)}
.cover-date{margin:.45rem 0 .75rem}
.guest-address{gap:.15rem}
.guest-address strong{font-size:.95rem}
.open-button{background:#243b52;border:1px solid #f4eddb77}
.stage-sky{background:linear-gradient(180deg,#34452e22,#243b5222),url('/assets/images/robby-tsabita-reference/garden-background.jpeg') center 48%/cover no-repeat}
.stage-arch{display:none}
.stage-floor,.stage-tree{opacity:0!important}
.stage-couple-art{left:calc(50% - 115px);top:17%;width:230px;height:58vh;display:grid;place-items:center;filter:drop-shadow(0 8px 14px #17211755)}
.stage-couple-art img{width:100%;height:100%;object-fit:contain}
.stage-vines{top:-4rem;left:-8%;right:-8%;height:180px;display:block;opacity:.95;z-index:2}
.stage-vines img{width:100%;height:100%;object-fit:cover;object-position:top center}
.profile-placeholder{position:relative;overflow:hidden;background:linear-gradient(150deg,#9ba78d,#eadfca)}
.profile-placeholder img{height:100%;width:100%;object-fit:contain;object-position:center top}
.profile-placeholder .profile-groom-art{clip-path:inset(0 48% 0 0)}
.profile-placeholder .profile-bride-art{clip-path:inset(0 0 0 40%);transform:scale(1.1)}
.portrait-placeholder{background:linear-gradient(150deg,#9ba78d,#eadfca)}
.portrait-placeholder>img{width:100%;height:100%;object-fit:cover;object-position:20% 10%;mix-blend-mode:multiply;opacity:.94}
.portrait-placeholder>img.portrait-bride-art{object-position:80% 10%}
.portrait-placeholder:after{display:none}
.portrait-placeholder b{z-index:2}
.gallery-placeholder{margin:0;display:block;background:#d4c8b4;padding:0;isolation:isolate}
.gallery-placeholder img{position:absolute;width:200%;height:200%;max-width:none;display:block;object-fit:cover;transition:transform .7s ease}
.gallery-1 img{left:0;top:0}.gallery-2 img{left:-100%;top:0}.gallery-3 img{left:0;top:-100%}.gallery-4 img{left:-100%;top:-100%}
.gallery-placeholder:hover img{transform:scale(1.025)}
.gallery-placeholder figcaption{position:absolute;z-index:1;left:0;right:0;bottom:0;padding:2.5rem .8rem .8rem;color:#fff;text-align:left;font:italic .88rem 'Lora',serif;text-shadow:0 1px 5px #222;background:linear-gradient(transparent,#1d2b26a8)}
.gallery-placeholder i{z-index:2}
.paper-section,.event-section,.closing-section{position:relative;isolation:isolate}
.paper-section:after,.event-section:after,.closing-section:after{content:'';position:absolute;z-index:-1;right:-64px;top:-48px;width:200px;height:184px;background:url('/assets/images/robby-tsabita-reference/rose-corner.webp') center/contain no-repeat;opacity:.22;pointer-events:none}
.event-section:after,.closing-section:after{right:auto;left:-64px;transform:scaleX(-1)}
.closing-wreath{position:relative}
@media(min-width:700px){.cover-couple-art{top:16%;height:55vh}.cover-copy{left:50%;right:auto;bottom:5vh;width:min(90%,760px);transform:translateX(-50%);border-radius:1rem}.cover-blossoms{left:4%;width:92%;max-height:36vh}.cover-wreath{top:5%;width:120px}.stage-couple-art{left:calc(50% - 150px);width:300px;top:11%;height:66vh}}
</style>
