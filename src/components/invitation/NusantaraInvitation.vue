<template>
  <div class="nusantara-invitation" :class="`nusantara--${themeKey}`" :style="themeStyle">
    <MusicControl
      v-if="opened && isSectionEnabled('music') && invitation.musicChoice"
      :src="getMusicUrl(invitation.musicChoice)"
      :audioStart="invitation.audioStart"
      :audioEnd="invitation.audioEnd"
      :primaryColor="theme.colors.primary"
      :accentColor="theme.colors.accent"
    />

    <Transition name="nu-cover-reveal">
      <section v-if="!opened" class="nu-cover" aria-labelledby="nu-cover-title">
      <img v-if="coverPhoto" :src="coverPhoto" alt="" class="nu-cover-photo" />
      <div class="nu-cover-wash" aria-hidden="true"></div>
      <div class="nu-cover-motif" aria-hidden="true"></div>

      <div class="nu-cover-content">
        <p class="nu-cover-scope">{{ theme.scope }}</p>
        <p id="nu-cover-title" class="nu-cover-label">
          Dengan penuh kebahagiaan, kami mengundang Anda
        </p>
        <h1 class="nu-names">
          <span>{{ invitation.groomName || 'Mempelai Pria' }}</span>
          <span class="nu-ampersand" aria-label="dan">&amp;</span>
          <span>{{ invitation.brideName || 'Mempelai Wanita' }}</span>
        </h1>
        <p class="nu-cover-date">{{ formatDate(coverEventDate) || theme.tagline }}</p>
        <div class="nu-cover-recipient">
          <span>Kepada Yth.</span>
          <strong>{{ invitation.guestName || 'Bapak/Ibu/Saudara/i' }}</strong>
        </div>
        <button class="nu-button nu-button--cover" type="button" @click="openInvitation">
          Buka Undangan
        </button>
      </div>
      </section>
    </Transition>

    <template v-if="opened">
      <main
        ref="scrollRoot"
        class="nu-scroll-root"
        :class="{ 'nu-scroll-root--sunda': themeKey === 'sunda' }"
      >
        <div v-if="themeKey === 'sunda'" class="nu-sunda-world" aria-hidden="true">
          <img
            class="nu-sunda-world__layer nu-sunda-world__mountains"
            src="/assets/images/nusantara/sunda/mountains-mist.jpg"
            alt=""
            data-nu-scene-layer="mountains"
          />
          <img
            class="nu-sunda-world__layer nu-sunda-world__tea"
            src="/assets/images/nusantara/sunda/tea-hills-golden-hour.jpg"
            alt=""
            data-nu-scene-layer="tea"
          />
          <img
            class="nu-sunda-world__layer nu-sunda-world__path"
            src="/assets/images/nusantara/sunda/tea-path.jpg"
            alt=""
            data-nu-scene-layer="path"
          />
          <img
            class="nu-sunda-world__layer nu-sunda-world__pavilion"
            src="/assets/images/nusantara/sunda/sundanese-pavilion.jpg"
            alt=""
            data-nu-scene-layer="pavilion"
          />
          <div class="nu-sunda-world__atmosphere"></div>
        </div>
        <section id="nu-home" class="nu-welcome nu-section">
          <div class="nu-section-mark" aria-hidden="true">
            <span v-for="mark in 5" :key="mark"></span>
          </div>
          <figure v-if="coverPhoto" class="nu-welcome-photo">
            <img :src="coverPhoto" alt="Foto kedua mempelai" fetchpriority="high" />
          </figure>
          <p class="nu-scope">{{ theme.scope }}</p>
          <h1 class="nu-welcome-names">
            <span class="nu-welcome-name">{{ invitation.groomName || 'Mempelai Pria' }}</span>
            <span class="nu-welcome-join" aria-label="dan">&amp;</span>
            <span class="nu-welcome-name">{{ invitation.brideName || 'Mempelai Wanita' }}</span>
          </h1>
          <p v-if="isSectionEnabled('quote') && invitation.quoteText" class="nu-opening-copy">
            {{ invitation.quoteText }}
          </p>
          <p v-else class="nu-opening-copy">
            {{ theme.tagline }}
          </p>
          <cite
            v-if="isSectionEnabled('quote') && invitation.quoteText && invitation.quoteSource"
            class="nu-quote-source"
          >
            {{ invitation.quoteSource }}
          </cite>
          <div class="nu-date-pill">
            {{ formatDate(coverEventDate) || 'Hari bahagia kami' }}
          </div>
          <div v-if="countdownVisible" class="nu-countdown" aria-label="Hitung mundur acara">
            <div v-for="(value, label) in countdown" :key="label">
              <strong>{{ value }}</strong>
              <span>{{ label }}</span>
            </div>
          </div>
        </section>

        <section
          v-if="isSectionEnabled('couple')"
          id="nu-couple"
          class="nu-section nu-couple-section"
        >
          <p class="nu-section-kicker">{{ theme.scope }}</p>
          <h2 class="nu-section-title">Kedua Mempelai</h2>
          <p class="nu-section-intro">Dua keluarga, satu cerita</p>
          <div class="nu-couple-grid">
            <article v-for="person in couple" :key="person.key" class="nu-person">
              <div class="nu-person-photo" :class="{ 'nu-person-photo--empty': !person.photo }">
                <img
                  v-if="person.photo"
                  :src="person.photo"
                  alt=""
                  loading="lazy"
                  data-nu-parallax
                />
                <span v-else aria-hidden="true">{{ person.initial }}</span>
              </div>
              <h3>{{ person.name }}</h3>
              <p>{{ person.parents }}</p>
            </article>
          </div>
        </section>

        <section
          v-if="isSectionEnabled('event-details') && events.length"
          id="nu-events"
          class="nu-section nu-event-section"
        >
          <p class="nu-section-kicker">{{ theme.eventKicker }}</p>
          <h2 class="nu-section-title">Rangkaian Acara</h2>
          <div class="nu-event-list">
            <article v-for="event in events" :key="event.key" class="nu-event-card">
              <h3>{{ event.label }}</h3>
              <p class="nu-event-date">{{ formatDate(event.data?.dateTime) }}</p>
              <p>{{ formatTime(event.data?.dateTime) }}</p>
              <p v-if="event.data?.description" class="nu-event-location">
                {{ event.data.description }}
              </p>
              <a
                v-if="isSectionEnabled('map') && event.data?.mapUrl"
                :href="event.data.mapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="nu-text-link"
              >
                Lihat lokasi
              </a>
            </article>
          </div>
          <button
            v-if="firstEventDate"
            class="nu-button nu-button--outline"
            type="button"
            @click="addToCalendar"
          >
            Simpan tanggal acara
          </button>
        </section>

        <section
          v-if="isSectionEnabled('dress-code') && invitation.dressCode"
          class="nu-section nu-detail-section"
        >
          <p class="nu-section-kicker">Panduan bagi tamu</p>
          <h2 class="nu-section-title">Busana</h2>
          <p class="nu-detail-copy">{{ invitation.dressCode }}</p>
        </section>

        <section
          v-if="
            isSectionEnabled('live-streaming') &&
            (invitation.liveStreamingLink || invitation.liveStreamingUrl)
          "
          class="nu-section nu-stream-section"
        >
          <p class="nu-section-kicker">Berbagi momen dari mana saja</p>
          <h2 class="nu-section-title">Saksikan secara daring</h2>
          <a
            class="nu-button nu-stream-link"
            :href="invitation.liveStreamingUrl || invitation.liveStreamingLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka tautan siaran
          </a>
        </section>

        <section
          v-if="isSectionEnabled('love-story') && loveStory.length"
          id="nu-story"
          class="nu-section nu-story-section"
        >
          <p class="nu-section-kicker">{{ theme.storyKicker }}</p>
          <h2 class="nu-section-title">Cerita Kami</h2>
          <ol class="nu-story-list">
            <li v-for="(story, index) in loveStory" :key="index" class="nu-story-item">
              <img v-if="story.image" :src="story.image" alt="" loading="lazy" data-nu-parallax />
              <p v-if="story.date" class="nu-story-date">{{ story.date }}</p>
              <h3>{{ story.title || `Cerita ${index + 1}` }}</h3>
              <p>{{ story.description || story.content }}</p>
            </li>
          </ol>
        </section>

        <section
          v-if="isSectionEnabled('gallery') && galleryItems.length"
          id="nu-gallery"
          class="nu-section nu-gallery-section"
        >
          <p class="nu-section-kicker">{{ theme.galleryKicker }}</p>
          <h2 class="nu-section-title">Galeri Kami</h2>
          <GalleryInvitation :items="galleryItems" />
        </section>

        <section
          v-if="isSectionEnabled('denah') && invitation.floorPlanImageUrl"
          class="nu-section nu-plan-section"
        >
          <p class="nu-section-kicker">Panduan menuju lokasi</p>
          <h2 class="nu-section-title">Denah acara</h2>
          <img
            class="nu-plan-image"
            :src="invitation.floorPlanImageUrl"
            alt="Denah lokasi acara"
            loading="lazy"
            data-nu-parallax
          />
        </section>

        <section
          v-if="isSectionEnabled('video') && invitation.videoPrewedding"
          class="nu-section nu-video-section"
        >
          <p class="nu-section-kicker">Sebuah kisah dalam gambar</p>
          <h2 class="nu-section-title">Video kami</h2>
          <div class="nu-video-frame">
            <iframe
              :src="getEmbedUrlVideo(invitation.videoPrewedding)"
              title="Video prewedding"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </section>

        <section
          v-if="isSectionEnabled('menu') && menuItems.length"
          class="nu-section nu-menu-section"
        >
          <p class="nu-section-kicker">Jamuan untuk para tamu</p>
          <h2 class="nu-section-title">{{ invitation.menu?.title || 'Menu hidangan' }}</h2>
          <ul class="nu-menu-list">
            <li v-for="(item, index) in menuItems" :key="`menu-${index}`">
              {{ typeof item === 'string' ? item : item.name }}
            </li>
          </ul>
        </section>

        <section
          v-if="isSectionEnabled('extended-family') && extendedFamily.length"
          class="nu-section nu-family-section"
        >
          <p class="nu-section-kicker">Dengan hormat</p>
          <h2 class="nu-section-title">Turut mengundang</h2>
          <ul class="nu-family-list">
            <li v-for="(person, index) in extendedFamily" :key="`family-${index}`">{{ person }}</li>
          </ul>
        </section>

        <section
          v-if="isSectionEnabled('gift') && hasGiftDetails"
          id="nu-gifts"
          class="nu-section nu-gift-section"
        >
          <p class="nu-section-kicker">{{ theme.giftKicker }}</p>
          <h2 class="nu-section-title">Tanda Kasih</h2>
          <p class="nu-section-intro">Doa restu Anda adalah hadiah terindah bagi kami.</p>

          <div v-if="invitation.bankAccounts?.length" class="nu-gift-list">
            <article v-for="(bank, index) in invitation.bankAccounts" :key="`bank-${index}`">
              <strong>{{ bank.bankName }}</strong>
              <span>{{ bank.accountNumber }}</span>
              <small>a.n. {{ bank.accountName }}</small>
              <button type="button" @click="copyToClipboard(bank.accountNumber)">
                Salin nomor
              </button>
            </article>
          </div>
          <div v-if="walletItems.length" class="nu-gift-list">
            <article v-for="(wallet, index) in walletItems" :key="`wallet-${index}`">
              <strong>{{ wallet.wallet_provider }}</strong>
              <span>{{ wallet.wallet_number }}</span>
              <button type="button" @click="copyToClipboard(wallet.wallet_number)">
                Salin nomor
              </button>
            </article>
          </div>
          <p v-for="(address, index) in giftAddresses" :key="`address-${index}`" class="nu-address">
            {{ address }}
          </p>
        </section>

        <section
          v-if="isSectionEnabled('rsvp') || isSectionEnabled('wishes')"
          id="nu-rsvp"
          class="nu-section nu-rsvp-section"
        >
          <div class="nu-rsvp-panel">
            <template v-if="isSectionEnabled('rsvp')">
              <p class="nu-section-kicker">{{ theme.rsvpKicker }}</p>
              <h2 class="nu-section-title">Kehadiran Anda</h2>
              <p class="nu-section-intro">
                Akan sangat berarti jika Anda berkenan hadir bersama kami.
              </p>
              <form class="nu-rsvp-form" @submit.prevent="submitRsvp">
                <label>
                  <span>Nama</span>
                  <input v-model.trim="rsvp.name" autocomplete="name" required />
                </label>
                <fieldset>
                  <legend>Konfirmasi kehadiran</legend>
                  <label
                    v-for="option in attendanceOptions"
                    :key="option.value"
                    class="nu-attendance"
                  >
                    <input v-model="rsvp.attendance" type="radio" :value="option.value" />
                    <span>{{ option.label }}</span>
                  </label>
                </fieldset>
                <label v-if="rsvp.attendance === 'hadir'">
                  <span>Jumlah tamu</span>
                  <select v-model.number="rsvp.totalGuests">
                    <option v-for="number in 20" :key="number" :value="number">
                      {{ number }} orang
                    </option>
                  </select>
                </label>
                <label v-if="isWishesEnabled">
                  <span>Ucapan dan doa</span>
                  <textarea v-model.trim="rsvp.message" rows="3"></textarea>
                </label>
                <button class="nu-button nu-button--submit" type="submit">Kirim konfirmasi</button>
              </form>
            </template>
            <div v-if="isWishesEnabled" class="nu-wishes">
              <h3>Ucapan dan doa</h3>
              <p v-if="!guestMessages.length" class="nu-wishes-empty">
                Ucapan dari para tamu akan tampil di sini.
              </p>
              <article
                v-for="(message, index) in guestMessages"
                :key="message.id || index"
                class="nu-wish"
              >
                <div class="nu-wish-heading">
                  <strong>{{ message.guestName }}</strong>
                  <time v-if="message.createdAt">{{ formatWishDate(message.createdAt) }}</time>
                </div>
                <p v-if="message.rsvpStatus" class="nu-wish-status">
                  {{
                    message.rsvpStatus === 'hadir'
                      ? 'Akan hadir'
                      : message.rsvpStatus === 'ragu'
                        ? 'Belum memastikan kehadiran'
                        : 'Berhalangan hadir'
                  }}
                  <span v-if="message.rsvpStatus === 'hadir' && message.totalGuests">
                    · {{ message.totalGuests }} tamu</span
                  >
                </p>
                <p v-if="message.message" class="nu-wish-message">“{{ message.message }}”</p>
              </article>
            </div>
          </div>
        </section>

        <footer v-if="isSectionEnabled('footer')" class="nu-footer">
          <p>
            {{ invitation.groomName || 'Mempelai Pria' }} &amp;
            {{ invitation.brideName || 'Mempelai Wanita' }}
          </p>
          <p>{{ invitation.footerText || theme.closing }}</p>
        </footer>
      </main>

      <nav class="nu-bottom-nav" aria-label="Navigasi undangan">
        <button
          v-for="item in navigation"
          :key="item.id"
          type="button"
          :class="{ 'is-active': activeSection === item.id }"
          :aria-label="item.label"
          :aria-current="activeSection === item.id ? 'location' : undefined"
          @click="scrollToSection(item.id)"
        >
          <i :class="item.icon" aria-hidden="true"></i>
          <span>{{ item.shortLabel }}</span>
        </button>
      </nav>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import MusicControl from '@/components/invitation/MusicControl.vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  themeKey: { type: String, required: true },
})

const toast = useToast()
const invitation = ref({})
watch(
  () => props.data,
  (value) => {
    invitation.value = { ...(value || {}) }
  },
  { deep: true, immediate: true },
)

const themes = {
  sunda: {
    scope: 'Pangantén Sunda · Priangan',
    tagline: 'Dua hati, satu langkah baru',
    eventKicker: 'Mugia lancar',
    storyKicker: 'Carita urang',
    galleryKicker: 'Momen kabagjaan',
    giftKicker: 'Tanda kaasih',
    rsvpKicker: 'Wilujeng sumping',
    closing: 'Hatur nuhun kana doa sareng restu anjeun.',
    colors: {
      background: '#EEF1E7',
      paper: '#FAFBF5',
      primary: '#355B47',
      dark: '#20382D',
      accent: '#B38B5B',
      leaf: '#82957C',
      muted: '#667267',
      panel: '#DFE7D9',
    },
  },
  jawa: {
    scope: 'Pawiwahan Jawa',
    tagline: 'Tresna tuwuh, katresnan langgeng',
    eventKicker: 'Dina kabagyan',
    storyKicker: 'Lelakon tresna',
    galleryKicker: 'Kenangan kita',
    giftKicker: 'Tanda tresna',
    rsvpKicker: 'Kanthi asih',
    closing: 'Matur nuwun awit donga lan pangestu panjenengan.',
    colors: {
      background: '#E9E9E3',
      paper: '#F7F6F0',
      primary: '#34445F',
      dark: '#222C3A',
      accent: '#AD9565',
      leaf: '#7E887B',
      muted: '#676B70',
      panel: '#DCDDD6',
    },
  },
  batak: {
    scope: 'Pesta Unjuk · Batak Toba',
    tagline: 'Horas! Dengan penuh sukacita',
    eventKicker: 'Pesta adat',
    storyKicker: 'Perjalanan kami',
    galleryKicker: 'Kenangan kami',
    giftKicker: 'Tanda kasih',
    rsvpKicker: 'Horas, keluarga',
    closing: 'Terima kasih atas doa dan berkat untuk keluarga kami.',
    colors: {
      background: '#EDE4DE',
      paper: '#F8F2EC',
      primary: '#7C2D3B',
      dark: '#38242B',
      accent: '#B48450',
      leaf: '#8A7773',
      muted: '#6E605D',
      panel: '#E4D4CA',
    },
  },
  'dayak-ngaju': {
    scope: 'Dayak Ngaju · Kalimantan Tengah',
    tagline: 'Satu perjalanan, banyak doa',
    eventKicker: 'Hari bahagia',
    storyKicker: 'Kisah kami',
    galleryKicker: 'Momen bersama',
    giftKicker: 'Tanda kasih',
    rsvpKicker: 'Salam hangat',
    closing: 'Terima kasih telah berbagi kebahagiaan bersama kami.',
    colors: {
      background: '#E8EDE3',
      paper: '#F5F4EA',
      primary: '#A34E37',
      dark: '#263E35',
      accent: '#BE974B',
      leaf: '#718871',
      muted: '#616D63',
      panel: '#D8E0D2',
    },
  },
}

const theme = computed(() => themes[props.themeKey] || themes.sunda)
const themeStyle = computed(() => ({
  '--nu-bg': theme.value.colors.background,
  '--nu-paper': theme.value.colors.paper,
  '--nu-primary': theme.value.colors.primary,
  '--nu-dark': theme.value.colors.dark,
  '--nu-accent': theme.value.colors.accent,
  '--nu-leaf': theme.value.colors.leaf,
  '--nu-muted': theme.value.colors.muted,
  '--nu-panel': theme.value.colors.panel,
}))
const coverPhoto = computed(() =>
  isSectionEnabled('photoCouple')
    ? invitation.value.photoCoupleUrl ||
      invitation.value.bridePhotoUrl ||
      invitation.value.groomPhotoUrl
    : '',
)

const opened = ref(false)
const scrollRoot = ref(null)
const activeSection = ref('nu-home')
let scrollObserver = null
let revealObserver = null
let parallaxFrame = null
let countdownInterval = null
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
const firstEventDate = computed(
  () =>
    invitation.value.akadLocation?.dateTime ||
    invitation.value.resepsiLocation?.dateTime ||
    invitation.value.dateTime,
)
const coverEventDate = computed(
  () =>
    invitation.value.resepsiLocation?.dateTime ||
    invitation.value.akadLocation?.dateTime ||
    invitation.value.dateTime,
)
const countdownVisible = computed(
  () => isSectionEnabled('countdown') && Boolean(firstEventDate.value),
)

function isSectionEnabled(key) {
  const sections = invitation.value.selectedSections ?? invitation.value.sections
  if (!Array.isArray(sections) || sections.length === 0) return true
  const aliases = {
    couple: ['photoCouple'],
    photoCouple: ['couple'],
    event: ['event-details'],
    'event-details': ['event'],
  }
  return sections.some((section) => {
    const sectionKey = typeof section === 'string' ? section : section?.key || section?.section?.key
    return (
      [key, ...(aliases[key] || [])].includes(sectionKey) &&
      (typeof section === 'string' || section?.is_enabled !== false)
    )
  })
}

const events = computed(() => {
  const items = []
  if (invitation.value.akadLocation)
    items.push({ key: 'akad', label: 'Prosesi Pernikahan', data: invitation.value.akadLocation })
  if (
    invitation.value.resepsiLocation &&
    (!invitation.value.mergeEvents || !invitation.value.akadLocation)
  )
    items.push({ key: 'resepsi', label: 'Resepsi', data: invitation.value.resepsiLocation })
  return items
})
const couple = computed(() => [
  {
    key: 'groom',
    initial: (invitation.value.groomName || 'P').slice(0, 1),
    name: invitation.value.groomName || 'Mempelai Pria',
    parents: `Putra dari ${invitation.value.parents?.groomParents || 'Bapak dan Ibu'}`,
    photo: invitation.value.groomPhotoUrl || invitation.value.photoCoupleUrl,
  },
  {
    key: 'bride',
    initial: (invitation.value.brideName || 'W').slice(0, 1),
    name: invitation.value.brideName || 'Mempelai Wanita',
    parents: `Putri dari ${invitation.value.parents?.brideParents || 'Bapak dan Ibu'}`,
    photo: invitation.value.bridePhotoUrl || invitation.value.photoCoupleUrl,
  },
])
const loveStory = computed(() =>
  (Array.isArray(invitation.value.loveStory) ? invitation.value.loveStory : []).filter(Boolean),
)
const menuItems = computed(() =>
  Array.isArray(invitation.value.menu?.items) ? invitation.value.menu.items.filter(Boolean) : [],
)
const extendedFamily = computed(() => {
  const value = invitation.value.extendedFamily
  if (Array.isArray(value)) return value.filter(Boolean)
  const text = typeof value === 'string' && value.trim() ? value : invitation.value.turutMengundang
  return typeof text === 'string'
    ? text
        .split(/,|\n/)
        .map((person) => person.trim())
        .filter(Boolean)
    : []
})
const galleryItems = computed(() =>
  (invitation.value.galleryImages || [])
    .filter(Boolean)
    .map((item) => (typeof item === 'string' ? { src: item, thumbnail: item } : item)),
)
const giftAddresses = computed(() => asList(invitation.value.giftDeliveryAddress))
const walletItems = computed(() =>
  asList(invitation.value.eWalletLink).map((wallet) =>
    typeof wallet === 'object'
      ? wallet
      : { wallet_provider: 'E-Wallet', wallet_number: String(wallet) },
  ),
)
const hasGiftDetails = computed(() =>
  Boolean(
    invitation.value.bankAccounts?.length || walletItems.value.length || giftAddresses.value.length,
  ),
)
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const attendanceOptions = [
  { value: 'hadir', label: 'Hadir' },
  { value: 'tidak', label: 'Belum bisa hadir' },
  { value: 'ragu', label: 'Masih belum pasti' },
]
const navigation = computed(() => [
  { id: 'nu-home', label: 'Beranda', shortLabel: 'Awal', icon: 'fa-solid fa-house' },
  ...(isSectionEnabled('couple')
    ? [{ id: 'nu-couple', label: 'Mempelai', shortLabel: 'Mempelai', icon: 'fa-solid fa-heart' }]
    : []),
  ...(isSectionEnabled('event-details') && events.value.length
    ? [{ id: 'nu-events', label: 'Acara', shortLabel: 'Acara', icon: 'fa-solid fa-calendar-check' }]
    : []),
  ...(isSectionEnabled('love-story') && loveStory.value.length
    ? [{ id: 'nu-story', label: 'Cerita', shortLabel: 'Cerita', icon: 'fa-solid fa-feather' }]
    : []),
  ...(isSectionEnabled('gallery') && galleryItems.value.length
    ? [{ id: 'nu-gallery', label: 'Galeri', shortLabel: 'Galeri', icon: 'fa-solid fa-images' }]
    : []),
  ...(isSectionEnabled('gift') && hasGiftDetails.value
    ? [{ id: 'nu-gifts', label: 'Hadiah', shortLabel: 'Hadiah', icon: 'fa-solid fa-gift' }]
    : []),
  ...(isSectionEnabled('rsvp') || isWishesEnabled.value
    ? [{ id: 'nu-rsvp', label: 'RSVP', shortLabel: 'RSVP', icon: 'fa-solid fa-envelope' }]
    : []),
])
const guestMessages = ref([])
const isWishesEnabled = computed(
  () => isSectionEnabled('wishes') && invitation.value.enableGuestMessage !== false,
)
watch(
  () => invitation.value.guestName,
  (name) => {
    if (!rsvp.value.name && name && name !== 'Tamu Undangan') rsvp.value.name = name
  },
  { immediate: true },
)

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  return typeof value === 'string' && value.trim() ? [value.trim()] : []
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
}

function formatTime(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
}

function formatWishDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getEmbedUrlVideo(value) {
  if (!value || typeof value !== 'string') return ''
  try {
    const url = new URL(value)
    if (url.hostname === 'youtu.be') return `https://www.youtube.com/embed/${url.pathname.slice(1)}`
    if (url.hostname.endsWith('youtube.com')) {
      const videoId =
        url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.split('/').pop()
      return videoId ? `https://www.youtube.com/embed/${videoId}` : value
    }
  } catch {
    return ''
  }
  return value
}

async function loadWishes() {
  if (!isWishesEnabled.value) {
    guestMessages.value = []
    return
  }
  const id = Number(invitation.value.id)
  if (!Number.isInteger(id) || id <= 0) {
    guestMessages.value = []
    return
  }
  try {
    const response = await getGuestMessagesByInvitationId(id)
    const messages = Array.isArray(response) ? response : response?.data
    guestMessages.value = Array.isArray(messages) ? messages : []
  } catch {
    guestMessages.value = []
  }
}

watch([() => invitation.value.id, isWishesEnabled], loadWishes, { immediate: true })

function updateCountdown() {
  if (countdownInterval) clearInterval(countdownInterval)
  if (!firstEventDate.value) return
  const target = new Date(firstEventDate.value).getTime()
  if (Number.isNaN(target)) return
  const tick = () => {
    const remaining = Math.max(0, target - Date.now())
    countdown.value = {
      Hari: String(Math.floor(remaining / 86400000)).padStart(2, '0'),
      Jam: String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, '0'),
      Menit: String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0'),
      Detik: String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0'),
    }
  }
  tick()
  countdownInterval = setInterval(tick, 1000)
}

function setupScrollObserver() {
  scrollObserver?.disconnect()
  if (typeof IntersectionObserver === 'undefined' || !scrollRoot.value) return
  scrollObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) activeSection.value = entry.target.id
    },
    { root: scrollRoot.value, threshold: 0.35 },
  )
  navigation.value.forEach((item) => {
    const element = scrollRoot.value.querySelector(`#${item.id}`)
    if (element) scrollObserver.observe(element)
  })
}

function updateParallax() {
  if (parallaxFrame !== null || !scrollRoot.value) return
  parallaxFrame = requestAnimationFrame(() => {
    parallaxFrame = null
    const root = scrollRoot.value
    const rootBounds = root?.getBoundingClientRect()
    if (!rootBounds) return
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const progress = reduceMotion ? 0 : root.scrollTop / Math.max(1, root.scrollHeight - root.clientHeight)
    const smoothstep = (start, end, value) => {
      const t = Math.max(0, Math.min(1, (value - start) / (end - start)))
      return t * t * (3 - 2 * t)
    }
    const sceneLayers = {
      mountains: { opacity: 0.9 - progress * 0.14, y: -progress * 24, scale: 1.1 },
      tea: { opacity: 0.25 + Math.sin(progress * Math.PI) * 0.12, y: -progress * 52, scale: 1.14 },
      path: {
        opacity: smoothstep(0.08, 0.32, progress) * (1 - smoothstep(0.5, 0.68, progress)) * 0.76,
        y: -progress * 86,
        scale: 1.08,
      },
      pavilion: {
        opacity: smoothstep(0.48, 0.68, progress) * (1 - smoothstep(0.92, 1, progress)) * 0.76,
        y: -progress * 38,
        scale: 1.12,
      },
    }
    root.querySelectorAll('[data-nu-scene-layer]').forEach((element) => {
      const layer = sceneLayers[element.dataset.nuSceneLayer]
      if (!layer) return
      element.style.opacity = String(layer.opacity)
      const x = ['path', 'pavilion'].includes(element.dataset.nuSceneLayer) ? '-50%' : '0'
      element.style.transform = `translate3d(${x}, ${layer.y.toFixed(1)}px, 0) scale(${layer.scale})`
    })
    const center = rootBounds.top + rootBounds.height / 2
    root.querySelectorAll('[data-nu-parallax]').forEach((element) => {
      const bounds = element.getBoundingClientRect()
      if (bounds.bottom < rootBounds.top || bounds.top > rootBounds.bottom) return
      const offset = Math.max(-18, Math.min(18, (center - (bounds.top + bounds.height / 2)) * 0.045))
      element.style.setProperty('--nu-parallax-y', `${offset.toFixed(2)}px`)
    })
  })
}

function setupScrollMotion() {
  revealObserver?.disconnect()
  const root = scrollRoot.value
  if (!root) return
  const targets = root.querySelectorAll('.nu-section, .nu-footer')
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
    targets.forEach((element) => element.classList.add('nu-section--visible'))
    updateParallax()
    return
  }
  if (typeof IntersectionObserver !== 'undefined') {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('nu-section--visible', entry.isIntersecting)
        }
      },
      { root, threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    targets.forEach((element) => revealObserver.observe(element))
  } else {
    targets.forEach((element) => element.classList.add('nu-section--visible'))
  }
  root.addEventListener('scroll', updateParallax, { passive: true })
  updateParallax()
}

function openInvitation() {
  opened.value = true
  requestAnimationFrame(() => {
    setupScrollObserver()
    setupScrollMotion()
  })
}

function scrollToSection(id) {
  const section = scrollRoot.value?.querySelector(`#${id}`)
  section?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
  activeSection.value = id
}

function getMusicUrl(choice) {
  if (
    typeof choice !== 'string' ||
    !choice ||
    choice.startsWith('yt:') ||
    choice.includes('/') ||
    choice.includes('http')
  )
    return choice
  return '/audio/romantic_music1.mp3'
}

async function submitRsvp() {
  if (!rsvp.value.name) return toast.error('Mohon isi nama Anda.')
  const invitationId = Number(invitation.value.id)
  if (!Number.isInteger(invitationId) || invitationId <= 0)
    return toast.info('RSVP dapat dikirim setelah undangan diterbitkan.')
  try {
    await createGuestMessage({
      invitationId,
      guestName: rsvp.value.name,
      message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance,
      totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0,
    })
    toast.success(`Terima kasih ${rsvp.value.name}, konfirmasi Anda telah terkirim!`)
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
    await loadWishes()
  } catch (error) {
    console.error('Failed to submit RSVP:', error)
    toast.error('Gagal mengirim RSVP. Silakan coba lagi.')
  }
}

async function copyToClipboard(value) {
  if (!value) return
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(String(value))
    } else {
      const input = document.createElement('textarea')
      input.value = String(value)
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      const copied = document.execCommand('copy')
      input.remove()
      if (!copied) throw new Error('Clipboard access is unavailable')
    }
    toast.success('Berhasil disalin!')
  } catch {
    toast.error('Nomor tidak dapat disalin dari browser ini.')
  }
}

function addToCalendar() {
  if (!firstEventDate.value) return
  const start = new Date(firstEventDate.value)
  if (Number.isNaN(start.getTime())) return
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
  const format = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '')
  const title = `Pernikahan ${invitation.value.groomName || ''} & ${invitation.value.brideName || ''}`
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(start)}/${format(end)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

watch(firstEventDate, updateCountdown)
onMounted(updateCountdown)
onUnmounted(() => {
  scrollObserver?.disconnect()
  revealObserver?.disconnect()
  scrollRoot.value?.removeEventListener('scroll', updateParallax)
  if (parallaxFrame !== null) cancelAnimationFrame(parallaxFrame)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.nusantara-invitation {
  min-height: 100vh;
  overflow: hidden;
  color: var(--nu-dark);
  background: var(--nu-bg);
  font-family: Inter, sans-serif;
  font-size: 15px;
  line-height: 1.65;
}

.nu-cover {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: 42px 28px;
  color: var(--nu-dark);
  background: var(--nu-paper);
  text-align: center;
}

.nu-cover-reveal-leave-active {
  position: fixed;
  z-index: 20;
  inset: 0;
  pointer-events: none;
  transform-origin: center top;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  transition:
    transform 760ms cubic-bezier(0.2, 0.7, 0.15, 1),
    opacity 640ms ease,
    filter 640ms ease;
}

.nu-cover-reveal-leave-to {
  opacity: 0;
  filter: blur(5px);
  transform: perspective(1100px) translate3d(0, -7vh, -90px) rotateX(7deg) scale(0.96);
}

.nu-cover-reveal-leave-active .nu-cover-photo {
  transform: translate3d(0, -3vh, 50px) scale(1.08);
  transition: transform 760ms cubic-bezier(0.2, 0.7, 0.15, 1);
}

.nu-cover-reveal-leave-active .nu-cover-motif {
  transform: translate3d(0, 2vh, -35px) scale(0.94);
  transition: transform 760ms cubic-bezier(0.2, 0.7, 0.15, 1);
}

.nu-cover-reveal-leave-active .nu-cover-content {
  opacity: 0;
  transform: translate3d(0, -24px, 35px);
  transition:
    opacity 320ms ease,
    transform 640ms cubic-bezier(0.2, 0.7, 0.15, 1);
}

.nu-cover-pattern {
  position: absolute;
  z-index: -1;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
  background-size: 34px 34px;
}

.nusantara--sunda .nu-cover-pattern {
  background-image: radial-gradient(
    ellipse at center,
    transparent 51%,
    var(--nu-leaf) 53%,
    transparent 57%
  );
  background-size: 36px 52px;
  opacity: 0.06;
}

.nusantara--jawa .nu-cover-pattern {
  background-image:
    radial-gradient(circle, var(--nu-accent) 1.2px, transparent 1.8px),
    radial-gradient(circle, transparent 9px, var(--nu-primary) 9.5px, transparent 10.5px);
  background-position:
    0 0,
    17px 17px;
  opacity: 0.1;
}

.nusantara--batak .nu-cover,
.nusantara--dayak-ngaju .nu-cover {
  color: var(--nu-paper);
  background: var(--nu-dark);
}

.nusantara--batak .nu-cover-pattern {
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent 0 11px,
      var(--nu-accent) 11px 12px,
      transparent 12px 23px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0 11px,
      var(--nu-primary) 11px 12px,
      transparent 12px 23px
    );
  opacity: 0.13;
}

.nusantara--dayak-ngaju .nu-cover-pattern {
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent 0 17px,
      var(--nu-accent) 17px 19px,
      transparent 19px 34px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0 17px,
      var(--nu-primary) 17px 19px,
      transparent 19px 34px
    );
  opacity: 0.13;
}

.nu-cover-rule {
  position: absolute;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background: var(--nu-leaf);
  opacity: 0.55;
}

.nu-cover-rule--left {
  left: 20px;
}
.nu-cover-rule--right {
  right: 20px;
}
.nusantara--jawa .nu-cover-rule,
.nusantara--batak .nu-cover-rule,
.nusantara--dayak-ngaju .nu-cover-rule {
  background: var(--nu-accent);
}

.nu-cover-content {
  width: min(100%, 500px);
  padding: 38px 18px;
}

.nu-emblem {
  position: relative;
  display: grid;
  width: 72px;
  height: 72px;
  margin: 0 auto 28px;
  place-items: center;
  color: var(--nu-leaf);
}

.nu-emblem--sunda {
  border: 1px solid currentColor;
  border-radius: 50%;
}
.nu-emblem-petal {
  position: absolute;
  width: 13px;
  height: 25px;
  border: 1px solid currentColor;
  border-radius: 50%;
}
.nu-emblem-petal:nth-child(1) {
  transform: translateY(-15px);
}
.nu-emblem-petal:nth-child(2) {
  transform: rotate(45deg) translateY(-15px);
}
.nu-emblem-petal:nth-child(3) {
  transform: rotate(90deg) translateY(-15px);
}
.nu-emblem-petal:nth-child(4) {
  transform: rotate(135deg) translateY(-15px);
}
.nu-emblem-petal:nth-child(5) {
  transform: rotate(180deg) translateY(-15px);
}
.nu-emblem-petal:nth-child(6) {
  transform: rotate(225deg) translateY(-15px);
}
.nu-emblem-petal:nth-child(7) {
  transform: rotate(270deg) translateY(-15px);
}
.nu-emblem-petal:nth-child(8) {
  transform: rotate(315deg) translateY(-15px);
}
.nu-emblem-center {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nu-accent);
}
.nu-emblem--jawa .nu-emblem-mark,
.nu-emblem--batak .nu-emblem-mark {
  position: absolute;
  width: 9px;
  height: 9px;
  border: 1px solid var(--nu-accent);
  transform: rotate(45deg);
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(1) {
  top: 10px;
  left: 32px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(2) {
  top: 24px;
  left: 15px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(3) {
  top: 24px;
  right: 15px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(4) {
  top: 31px;
  left: 31px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(5) {
  bottom: 14px;
  left: 15px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(6) {
  bottom: 14px;
  right: 15px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(7) {
  bottom: 6px;
  left: 31px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(8) {
  top: 4px;
  left: 15px;
}
.nu-emblem--jawa .nu-emblem-mark:nth-child(9) {
  top: 4px;
  right: 15px;
}
.nu-emblem--batak .nu-emblem-mark {
  width: 11px;
  height: 11px;
  background: var(--nu-primary);
}
.nu-emblem--batak .nu-emblem-mark:nth-child(1) {
  top: 4px;
  left: 31px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(2) {
  top: 16px;
  left: 16px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(3) {
  top: 16px;
  right: 16px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(4) {
  top: 30px;
  left: 31px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(5) {
  top: 45px;
  left: 16px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(6) {
  top: 45px;
  right: 16px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(7) {
  bottom: 3px;
  left: 31px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(8) {
  top: 31px;
  left: 3px;
}
.nu-emblem--batak .nu-emblem-mark:nth-child(9) {
  top: 31px;
  right: 3px;
}
.nu-betang-roof {
  position: absolute;
  top: 12px;
  width: 0;
  height: 0;
  border-right: 34px solid transparent;
  border-bottom: 24px solid var(--nu-accent);
  border-left: 34px solid transparent;
}
.nu-betang-house {
  position: absolute;
  top: 33px;
  width: 54px;
  height: 22px;
  border: 2px solid var(--nu-paper);
  background: var(--nu-primary);
}
.nu-betang-legs {
  position: absolute;
  bottom: 4px;
  width: 42px;
  height: 13px;
  border-right: 2px solid var(--nu-paper);
  border-left: 2px solid var(--nu-paper);
}

.nu-scope,
.nu-section-kicker {
  margin: 0;
  color: var(--nu-accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.nu-cover-label {
  margin: 22px 0 14px;
  color: var(--nu-accent);
  font-size: 0.84rem;
}
.nu-names {
  display: grid;
  gap: 2px;
  margin: 0;
  font:
    400 clamp(3rem, 13vw, 4.6rem) / 0.98 'Playfair Display',
    Georgia,
    serif;
}
.nu-ampersand {
  color: var(--nu-accent);
  font-size: 0.62em;
  line-height: 1.25;
}
.nu-cover-tagline {
  max-width: 24rem;
  margin: 22px auto 0;
  font:
    400 1.28rem/1.35 'Cormorant Garamond',
    Georgia,
    serif;
}
.nu-cover-recipient {
  display: grid;
  gap: 2px;
  margin: 35px 0 22px;
  color: var(--nu-muted);
  font-size: 0.78rem;
}
.nusantara--batak .nu-cover-recipient,
.nusantara--dayak-ngaju .nu-cover-recipient {
  color: var(--nu-paper);
}
.nu-cover-recipient strong {
  color: inherit;
  font-weight: 600;
}
.nu-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  color: #fff;
  background: var(--nu-primary);
  font:
    600 0.78rem/1.2 Inter,
    sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 180ms ease,
    background-color 180ms ease;
}
.nu-button:hover {
  transform: translateY(-2px);
}
.nu-button:focus-visible,
.nu-bottom-nav button:focus-visible,
.nu-gift-list button:focus-visible {
  outline: 3px solid var(--nu-accent);
  outline-offset: 3px;
}
.nu-button--cover {
  min-width: 194px;
}

.nu-scroll-root {
  height: 100svh;
  overflow: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.nu-scroll-root::-webkit-scrollbar {
  display: none;
}
.nu-section {
  position: relative;
  padding: 5.5rem 1.5rem;
  scroll-margin-top: 1rem;
}
.nu-welcome {
  display: grid;
  min-height: 42rem;
  align-content: center;
  justify-items: center;
  overflow: hidden;
  text-align: center;
  background: var(--nu-bg);
}
.nusantara--batak .nu-welcome,
.nusantara--dayak-ngaju .nu-welcome {
  background: var(--nu-paper);
}
.nu-section-mark {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.nu-section-mark span {
  width: 8px;
  height: 8px;
  border: 1px solid var(--nu-accent);
  transform: rotate(45deg);
}
.nu-section-mark span:nth-child(2n) {
  transform: rotate(45deg) translateY(7px);
}
.nu-welcome-names {
  max-width: 46rem;
  margin: 1.5rem auto;
  color: var(--nu-dark);
  font:
    400 clamp(2.5rem, 8vw, 5rem) / 1.1 'Playfair Display',
    Georgia,
    serif;
}
.nu-welcome-names span {
  color: var(--nu-accent);
}
.nu-opening-copy {
  max-width: 31rem;
  margin: 0 auto 1.5rem;
  color: var(--nu-muted);
}
.nu-date-pill {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  border: 1px solid var(--nu-accent);
  border-radius: 999px;
  padding: 0.4rem 1rem;
  color: var(--nu-primary);
  font-size: 0.83rem;
}
.nu-countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(54px, 76px));
  gap: 0.7rem;
  margin-top: 2.7rem;
}
.nu-countdown div {
  display: grid;
  gap: 2px;
}
.nu-countdown strong {
  color: var(--nu-dark);
  font:
    400 1.8rem/1 'Playfair Display',
    Georgia,
    serif;
}
.nu-countdown span {
  color: var(--nu-accent);
  font-size: 0.64rem;
}

.nu-couple-section {
  background: var(--nu-paper);
  text-align: center;
}
.nu-section-title {
  margin: 0.35rem 0 0.65rem;
  color: var(--nu-dark);
  font:
    400 clamp(1.8rem, 5vw, 2.6rem) / 1.2 'Playfair Display',
    Georgia,
    serif;
}
.nu-section-intro {
  margin: 0 0 2rem;
  color: var(--nu-muted);
  font-size: 0.92rem;
}
.nu-couple-grid {
  display: grid;
  width: min(100%, 740px);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 5vw, 2.5rem);
  margin: 2.3rem auto;
}
.nu-person {
  min-width: 0;
}
.nu-person-photo {
  display: grid;
  overflow: hidden;
  aspect-ratio: 0.78;
  place-items: center;
  border-radius: 45% 45% 10px 10px;
  background: var(--nu-panel);
}
.nu-person-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nu-person-photo span {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border-radius: 50%;
  color: var(--nu-paper);
  background: var(--nu-primary);
  font:
    400 1.8rem 'Playfair Display',
    Georgia,
    serif;
}
.nu-person:nth-child(2) .nu-person-photo span {
  background: var(--nu-accent);
}
.nu-person h3 {
  margin: 1rem 0 0.15rem;
  color: var(--nu-dark);
  font:
    400 clamp(1rem, 3.5vw, 1.45rem) / 1.3 'Playfair Display',
    Georgia,
    serif;
}
.nu-person p {
  margin: 0;
  color: var(--nu-muted);
  font-size: 0.78rem;
}
.nu-couple-quote {
  max-width: 36rem;
  margin: 2.5rem auto 0;
  color: var(--nu-primary);
  font:
    italic 1.2rem/1.45 'Cormorant Garamond',
    Georgia,
    serif;
}
.nu-couple-quote cite {
  display: block;
  margin-top: 0.7rem;
  color: var(--nu-muted);
  font:
    600 0.7rem Inter,
    sans-serif;
}

.nu-event-section {
  color: var(--nu-paper);
  background: var(--nu-dark);
  text-align: center;
}
.nu-event-section .nu-section-title {
  color: var(--nu-paper);
}
.nu-event-list {
  display: grid;
  width: min(100%, 780px);
  gap: 1rem;
  margin: 2rem auto;
}
.nu-event-card {
  border: 1px solid color-mix(in srgb, var(--nu-accent) 48%, transparent);
  border-radius: 1rem;
  padding: 1.5rem;
  color: var(--nu-dark);
  background: var(--nu-paper);
}
.nu-event-card h3 {
  margin: 0 0 0.6rem;
  color: var(--nu-primary);
  font:
    600 1.35rem 'Playfair Display',
    Georgia,
    serif;
}
.nu-event-card p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}
.nu-event-card .nu-event-date {
  color: var(--nu-accent);
  font-weight: 700;
}
.nu-event-card .nu-event-location {
  margin: 0.65rem 0;
  color: var(--nu-muted);
}
.nu-text-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--nu-primary);
  font-size: 0.82rem;
  font-weight: 700;
  text-underline-offset: 3px;
}
.nu-button--outline {
  border-color: var(--nu-accent);
  color: var(--nu-paper);
  background: transparent;
}

.nu-story-section {
  background: var(--nu-bg);
  text-align: center;
}
.nu-story-list {
  display: grid;
  width: min(100%, 680px);
  gap: 2rem;
  margin: 2rem auto 0;
  padding: 0;
  list-style: none;
}
.nu-story-item {
  border-left: 2px solid var(--nu-accent);
  padding: 0.25rem 1.25rem 1.25rem;
  text-align: left;
}
.nu-story-item img {
  display: block;
  width: 100%;
  max-height: 22rem;
  margin: 0 0 1rem;
  border-radius: 0.6rem;
  object-fit: cover;
}
.nu-story-date {
  margin: 0;
  color: var(--nu-accent);
  font-size: 0.78rem;
  font-weight: 700;
}
.nu-story-item h3 {
  margin: 0.3rem 0;
  color: var(--nu-dark);
  font:
    400 1.45rem 'Playfair Display',
    Georgia,
    serif;
}
.nu-story-item > p:last-child {
  margin: 0;
  color: var(--nu-muted);
}

.nu-gallery-section {
  background: var(--nu-paper);
  text-align: center;
}
.nu-gift-section {
  background: var(--nu-bg);
  text-align: center;
}
.nu-gift-list {
  display: grid;
  width: min(100%, 680px);
  gap: 0.8rem;
  margin: 1.2rem auto;
}
.nu-gift-list article {
  display: grid;
  justify-items: center;
  gap: 0.2rem;
  border: 1px solid var(--nu-accent);
  border-radius: 0.9rem;
  padding: 1.2rem;
  background: var(--nu-paper);
}
.nu-gift-list strong {
  color: var(--nu-primary);
  font:
    600 1.15rem 'Playfair Display',
    Georgia,
    serif;
}
.nu-gift-list span {
  color: var(--nu-dark);
  font-size: 1.05rem;
  font-variant-numeric: tabular-nums;
}
.nu-gift-list small {
  color: var(--nu-muted);
}
.nu-gift-list button {
  margin-top: 0.5rem;
  border: 1px solid var(--nu-primary);
  border-radius: 999px;
  padding: 0.4rem 1rem;
  color: var(--nu-primary);
  background: transparent;
  cursor: pointer;
}
.nu-address {
  width: min(100%, 680px);
  margin: 0.8rem auto;
  border-radius: 0.9rem;
  padding: 1rem;
  color: var(--nu-dark);
  background: var(--nu-paper);
  text-align: left;
}

.nu-rsvp-section {
  background: var(--nu-paper);
}
.nu-rsvp-panel {
  width: min(100%, 620px);
  margin: 0 auto;
  border: 1px solid var(--nu-accent);
  border-radius: 1.2rem;
  padding: clamp(1.25rem, 6vw, 3rem);
  background: var(--nu-bg);
  text-align: center;
}
.nu-rsvp-form {
  display: grid;
  gap: 1rem;
  text-align: left;
}
.nu-rsvp-form > label {
  display: grid;
  gap: 0.35rem;
  color: var(--nu-dark);
  font-size: 0.82rem;
  font-weight: 600;
}
.nu-rsvp-form input:not([type='radio']),
.nu-rsvp-form select,
.nu-rsvp-form textarea {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--nu-accent);
  border-radius: 0.65rem;
  padding: 0.65rem 0.8rem;
  color: var(--nu-dark);
  background: var(--nu-paper);
  font:
    400 0.95rem Inter,
    sans-serif;
}
.nu-rsvp-form input:focus-visible,
.nu-rsvp-form select:focus-visible,
.nu-rsvp-form textarea:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--nu-accent) 55%, white);
  outline-offset: 2px;
}
.nu-rsvp-form fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  border: 0;
  margin: 0;
  padding: 0;
}
.nu-rsvp-form legend {
  width: 100%;
  margin-bottom: 0.35rem;
  color: var(--nu-dark);
  font-size: 0.82rem;
  font-weight: 600;
}
.nu-attendance {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--nu-accent);
  border-radius: 999px;
  padding: 0.5rem 0.8rem;
  color: var(--nu-dark);
  background: var(--nu-paper);
  font-size: 0.78rem;
  cursor: pointer;
}
.nu-attendance:has(input:checked) {
  color: #fff;
  border-color: var(--nu-primary);
  background: var(--nu-primary);
}
.nu-attendance input {
  accent-color: var(--nu-accent);
}
.nu-button--submit {
  width: 100%;
  border-radius: 0.7rem;
}

.nu-footer {
  padding: 3.2rem 1.5rem 7rem;
  color: var(--nu-paper);
  background: var(--nu-dark);
  text-align: center;
}
.nu-footer p {
  margin: 0.4rem 0;
}
.nu-footer p:first-child {
  color: var(--nu-accent);
  font:
    400 1.7rem 'Playfair Display',
    Georgia,
    serif;
}
.nu-footer p:last-child {
  font:
    italic 1rem 'Cormorant Garamond',
    Georgia,
    serif;
}
.nu-bottom-nav {
  position: fixed;
  z-index: 30;
  right: 0;
  bottom: max(12px, env(safe-area-inset-bottom));
  left: 0;
  display: flex;
  width: min(94%, 560px);
  justify-content: space-around;
  gap: 0.15rem;
  margin: auto;
  border: 1px solid color-mix(in srgb, var(--nu-accent) 55%, transparent);
  border-radius: 1rem;
  padding: 0.45rem;
  background: color-mix(in srgb, var(--nu-dark) 93%, transparent);
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  backdrop-filter: blur(14px);
}
.nu-bottom-nav button {
  display: grid;
  min-width: 0;
  flex: 1;
  justify-items: center;
  gap: 0.2rem;
  border: 0;
  border-radius: 0.65rem;
  padding: 0.45rem 0.2rem;
  color: color-mix(in srgb, var(--nu-paper) 70%, transparent);
  background: transparent;
  font:
    500 0.58rem Inter,
    sans-serif;
  cursor: pointer;
}
.nu-bottom-nav button i {
  font-size: 0.95rem;
}
.nu-bottom-nav button.is-active {
  color: var(--nu-accent);
  background: color-mix(in srgb, var(--nu-paper) 10%, transparent);
}

.nusantara--sunda .nu-event-section {
  background-image: radial-gradient(
    ellipse at top right,
    color-mix(in srgb, var(--nu-leaf) 18%, transparent),
    transparent 42%
  );
}
.nusantara--jawa .nu-event-card {
  border-radius: 0.3rem;
}
.nusantara--batak .nu-event-section {
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0 22px,
    rgb(213 170 90 / 7%) 22px 24px,
    transparent 24px 46px
  );
}
.nusantara--dayak-ngaju .nu-event-section {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent 0 26px,
    rgb(214 170 67 / 7%) 26px 28px,
    transparent 28px 54px
  );
}
.nusantara--dayak-ngaju .nu-event-card {
  border-radius: 0.35rem 0.9rem;
}

/* Editorial, photo-led direction: one strong cover, open section rhythms, quieter controls. */
.nu-cover {
  min-height: 100svh;
  align-items: end;
  justify-items: stretch;
  padding: 0;
  color: var(--nu-paper);
  background:
    radial-gradient(
      ellipse at 68% 22%,
      color-mix(in srgb, var(--nu-primary) 55%, transparent),
      transparent 55%
    ),
    var(--nu-dark);
  text-align: left;
}
.nu-cover-photo,
.nu-cover-wash,
.nu-cover-motif {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.nu-cover-photo {
  z-index: -2;
  object-fit: cover;
  object-position: center 42%;
  filter: saturate(0.78);
}
.nu-cover-wash {
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgb(20 26 24 / 8%) 8%,
    rgb(20 26 24 / 35%) 46%,
    rgb(20 26 24 / 88%) 100%
  );
}
.nu-cover-motif {
  inset: auto 0 0 auto;
  width: min(76vw, 560px);
  height: min(76vw, 560px);
  transform: translate(27%, 25%);
  border: 1px solid color-mix(in srgb, var(--nu-accent) 62%, transparent);
  border-radius: 50%;
  opacity: 0.36;
  pointer-events: none;
}
.nu-cover-motif::before,
.nu-cover-motif::after {
  position: absolute;
  inset: 8%;
  border: 1px solid color-mix(in srgb, var(--nu-accent) 50%, transparent);
  border-radius: inherit;
  content: '';
}
.nu-cover-motif::after {
  inset: 18%;
}
.nusantara--jawa .nu-cover-motif {
  background: repeating-radial-gradient(
    circle at center,
    transparent 0 19px,
    color-mix(in srgb, var(--nu-accent) 24%, transparent) 20px 21px,
    transparent 22px 38px
  );
  border-radius: 0;
  transform: rotate(45deg) translate(22%, 27%);
}
.nusantara--batak .nu-cover-motif {
  width: min(62vw, 470px);
  height: min(62vw, 470px);
  border-radius: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent 0 18px,
    color-mix(in srgb, var(--nu-accent) 26%, transparent) 19px 20px,
    transparent 21px 38px
  );
  transform: rotate(45deg) translate(20%, 24%);
}
.nusantara--dayak-ngaju .nu-cover-motif {
  width: min(66vw, 500px);
  height: min(66vw, 500px);
  border-radius: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent 0 14px,
    color-mix(in srgb, var(--nu-accent) 30%, transparent) 15px 17px,
    transparent 18px 30px
  );
  transform: rotate(45deg) translate(23%, 27%);
}
.nu-cover-content {
  position: relative;
  z-index: 1;
  width: min(100%, 740px);
  margin: 0 auto;
  padding: clamp(5.5rem, 13vh, 9rem) clamp(1.5rem, 7vw, 5.5rem)
    max(2rem, env(safe-area-inset-bottom));
}
.nu-cover-scope {
  margin: 0 0 1.25rem;
  color: color-mix(in srgb, var(--nu-paper) 82%, var(--nu-accent));
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}
.nu-cover-label {
  max-width: 26rem;
  margin: 0 0 0.65rem;
  color: color-mix(in srgb, var(--nu-paper) 84%, transparent);
  font-size: 0.83rem;
}
.nu-names {
  gap: 0;
  max-width: 11ch;
  font:
    400 clamp(3.2rem, 14vw, 6.6rem) / 0.84 'Cormorant Garamond',
    Georgia,
    serif;
  letter-spacing: -0.045em;
  text-wrap: balance;
}
.nu-ampersand {
  margin: 0.2em 0;
  color: var(--nu-accent);
  font-size: 0.5em;
  line-height: 0.8;
}
.nu-cover-date {
  margin: 1.25rem 0 0;
  color: color-mix(in srgb, var(--nu-paper) 88%, transparent);
  font-size: 0.9rem;
}
.nu-cover-recipient {
  gap: 0.1rem;
  margin: 2rem 0 1.1rem;
  color: color-mix(in srgb, var(--nu-paper) 72%, transparent);
  font-size: 0.78rem;
}
.nu-cover-recipient strong {
  color: var(--nu-paper);
  font-size: 0.95rem;
}
.nu-button {
  border-radius: 2px;
  padding-inline: 1.4rem;
  letter-spacing: 0.01em;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}
.nu-button:hover {
  transform: none;
}
.nu-button--cover {
  min-width: 168px;
  border-color: color-mix(in srgb, var(--nu-paper) 65%, transparent);
  color: var(--nu-paper);
  background: transparent;
}
.nu-button--cover:hover {
  color: var(--nu-dark);
  background: var(--nu-paper);
}
.nu-scroll-root {
  overflow-x: clip;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  background: var(--nu-bg);
  animation: nu-scroll-root-arrive 760ms cubic-bezier(0.2, 0.7, 0.15, 1) both;
}

@keyframes nu-scroll-root-arrive {
  from {
    opacity: 0.72;
    transform: perspective(1100px) translate3d(0, 4vh, -55px) rotateX(1.5deg) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.nu-section,
.nu-footer {
  opacity: 0;
  visibility: hidden;
  transform: perspective(1100px) translate3d(0, 8vh, -100px) rotateX(4deg) scale(0.94);
  transform-origin: center top;
  transition:
    opacity 360ms ease-out,
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s linear 420ms;
}

.nu-section.nu-section--visible,
.nu-footer.nu-section--visible {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition:
    opacity 360ms ease-out,
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s;
}

.nu-section {
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  justify-content: center;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.nu-parallax-media {
  transform: translate3d(0, var(--nu-parallax-y, 0px), 12px) scale(1.035);
  transform-style: preserve-3d;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .nu-cover-reveal-leave-active,
  .nu-cover-reveal-leave-active .nu-cover-photo,
  .nu-cover-reveal-leave-active .nu-cover-motif,
  .nu-cover-reveal-leave-active .nu-cover-content,
  .nu-scroll-root,
  .nu-section,
  .nu-footer,
  .nu-parallax-media {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    filter: none !important;
  }

  .nu-section,
  .nu-footer {
    opacity: 1;
    visibility: visible;
  }
}
.nu-section {
  padding: clamp(4.5rem, 11vw, 8rem) max(1.4rem, calc((100% - 780px) / 2));
}
.nu-welcome {
  min-height: min(760px, 88svh);
  padding-inline: max(1.4rem, calc((100% - 720px) / 2));
  background: var(--nu-bg);
}
.nu-section-mark {
  display: none;
}
.nu-scope,
.nu-section-kicker {
  margin-bottom: 0.8rem;
  color: var(--nu-primary);
  font-size: 0.77rem;
  font-weight: 500;
  letter-spacing: 0.03em;
}
.nu-welcome-names,
.nu-section-title,
.nu-person h3,
.nu-event-card h3,
.nu-story-item h3,
.nu-gift-list strong,
.nu-footer p:first-child {
  font-family: 'Cormorant Garamond', Georgia, serif;
  letter-spacing: -0.025em;
}
.nu-welcome-names {
  max-width: 12ch;
  margin: 0 auto 1rem;
  font-size: clamp(3rem, 10vw, 5.8rem);
  line-height: 0.91;
}
.nu-opening-copy {
  max-width: 27rem;
  line-height: 1.8;
}
.nu-quote-source {
  display: block;
  margin: -0.8rem auto 1.5rem;
  color: var(--nu-muted);
  font-size: 0.78rem;
}
.nu-date-pill {
  min-height: 0;
  border: 0;
  border-bottom: 1px solid var(--nu-accent);
  border-radius: 0;
  padding: 0.4rem 0;
}
.nu-countdown {
  gap: clamp(0.8rem, 4vw, 2.25rem);
}
.nu-countdown strong {
  font-size: 2.1rem;
}
.nu-couple-section,
.nu-gallery-section,
.nu-rsvp-section {
  background: var(--nu-paper);
}
.nu-couple-grid {
  gap: clamp(1rem, 5vw, 3.4rem);
  margin-block: 2rem 1rem;
}
.nu-person {
  text-align: center;
}
.nu-person-photo {
  max-width: 280px;
  margin-inline: auto;
  aspect-ratio: 0.92;
  border-radius: 0;
  background: var(--nu-panel);
}
.nu-person-photo span {
  width: auto;
  height: auto;
  border-radius: 0;
  color: var(--nu-primary);
  background: transparent;
  font-size: 4rem;
}
.nu-person:nth-child(2) .nu-person-photo span {
  color: var(--nu-accent);
  background: transparent;
}
.nu-person h3 {
  font-size: clamp(1.35rem, 4vw, 1.8rem);
}
.nu-event-section {
  color: var(--nu-paper);
  background: var(--nu-dark);
  text-align: left;
}
.nu-event-section .nu-section-title {
  color: var(--nu-paper);
}
.nu-event-list {
  gap: 0;
  margin: 2.5rem 0;
}
.nu-event-card,
.nusantara--jawa .nu-event-card,
.nusantara--dayak-ngaju .nu-event-card {
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--nu-accent) 55%, transparent);
  border-radius: 0;
  padding: 1.5rem 0;
  color: var(--nu-paper);
  background: transparent;
}
.nu-event-card:last-child {
  border-bottom: 1px solid color-mix(in srgb, var(--nu-accent) 55%, transparent);
}
.nu-event-card h3,
.nu-event-card .nu-event-date {
  color: var(--nu-accent);
}
.nu-event-card .nu-event-location {
  color: color-mix(in srgb, var(--nu-paper) 70%, transparent);
}
.nu-text-link {
  color: var(--nu-paper);
}
.nu-story-section {
  background: var(--nu-bg);
  text-align: left;
}
.nu-story-list {
  gap: 2.5rem;
  margin-top: 2.5rem;
}
.nu-story-item {
  border-left: 0;
  border-top: 1px solid color-mix(in srgb, var(--nu-primary) 30%, transparent);
  padding: 1.25rem 0 0;
}
.nu-story-item img {
  max-height: 26rem;
  margin-bottom: 1.25rem;
  border-radius: 0;
}
.nu-story-item h3 {
  font-size: 1.8rem;
}
.nu-detail-section,
.nu-plan-section,
.nu-menu-section,
.nu-family-section {
  background: var(--nu-paper);
}
.nu-detail-copy {
  margin: 0;
  color: var(--nu-muted);
  font-size: 1.15rem;
}
.nu-stream-section {
  color: var(--nu-paper);
  background: var(--nu-primary);
}
.nu-stream-section .nu-section-kicker,
.nu-stream-section .nu-section-title {
  color: var(--nu-paper);
}
.nu-stream-link {
  border-color: color-mix(in srgb, var(--nu-paper) 60%, transparent);
  color: var(--nu-paper);
  background: transparent;
  text-decoration: none;
}
.nu-plan-image {
  display: block;
  width: min(100%, 780px);
  max-height: 75svh;
  margin: 2rem auto 0;
  object-fit: contain;
}
.nu-video-section {
  color: var(--nu-paper);
  background: var(--nu-dark);
}
.nu-video-section .nu-section-kicker,
.nu-video-section .nu-section-title {
  color: var(--nu-paper);
}
.nu-video-frame {
  position: relative;
  width: min(100%, 780px);
  aspect-ratio: 16 / 9;
  margin: 2rem auto 0;
  background: #111;
}
.nu-video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.nu-menu-list,
.nu-family-list {
  display: grid;
  width: min(100%, 680px);
  gap: 0.8rem;
  margin: 2rem auto 0;
  padding: 0;
  list-style: none;
}
.nu-menu-list li,
.nu-family-list li {
  border-top: 1px solid color-mix(in srgb, var(--nu-primary) 28%, transparent);
  padding: 0.8rem 0;
  color: var(--nu-dark);
}
.nu-menu-list li:last-child,
.nu-family-list li:last-child {
  border-bottom: 1px solid color-mix(in srgb, var(--nu-primary) 28%, transparent);
}
.nu-family-list {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
}
.nu-gift-section {
  background: var(--nu-bg);
}
.nu-gift-list {
  gap: 0;
}
.nu-gift-list article {
  justify-items: start;
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--nu-primary) 28%, transparent);
  border-radius: 0;
  padding: 1.2rem 0;
  background: transparent;
  text-align: left;
}
.nu-gift-list article:last-child {
  border-bottom: 1px solid color-mix(in srgb, var(--nu-primary) 28%, transparent);
}
.nu-gift-list button,
.nu-address {
  border-radius: 0;
}
.nu-address {
  background: var(--nu-paper);
}
.nu-rsvp-panel {
  width: min(100%, 700px);
  border: 0;
  border-top: 1px solid var(--nu-accent);
  border-radius: 0;
  padding: clamp(1.5rem, 6vw, 3.5rem) 0 0;
  background: transparent;
  text-align: left;
}
.nu-rsvp-panel > .nu-section-title,
.nu-rsvp-panel > .nu-section-intro {
  text-align: left;
}
.nu-wishes {
  margin-top: 2.5rem;
  border-top: 1px solid color-mix(in srgb, var(--nu-primary) 28%, transparent);
  padding-top: 1.5rem;
}
.nu-wishes h3 {
  margin: 0 0 1rem;
  color: var(--nu-dark);
  font:
    400 1.7rem/1.2 'Cormorant Garamond',
    Georgia,
    serif;
}
.nu-wishes-empty {
  color: var(--nu-muted);
  font-size: 0.9rem;
}
.nu-wish {
  border-top: 1px solid color-mix(in srgb, var(--nu-primary) 20%, transparent);
  padding: 1rem 0;
}
.nu-wish-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--nu-dark);
}
.nu-wish-heading time,
.nu-wish-status {
  color: var(--nu-muted);
  font-size: 0.76rem;
}
.nu-wish-status {
  margin: 0.25rem 0;
}
.nu-wish-message {
  margin: 0.4rem 0 0;
  color: var(--nu-primary);
  font:
    italic 1.1rem/1.45 'Cormorant Garamond',
    Georgia,
    serif;
}
.nu-rsvp-form input:not([type='radio']),
.nu-rsvp-form select,
.nu-rsvp-form textarea {
  border-color: color-mix(in srgb, var(--nu-primary) 35%, transparent);
  border-radius: 0;
}
.nu-attendance {
  border-radius: 2px;
}
.nu-attendance:has(input:checked) {
  color: var(--nu-paper);
  border-color: var(--nu-primary);
  background: var(--nu-primary);
}
.nu-button--submit {
  width: fit-content;
  border-radius: 2px;
}
.nu-footer {
  padding-bottom: calc(6rem + env(safe-area-inset-bottom));
}
.nu-bottom-nav {
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  justify-content: flex-start;
  gap: 0;
  overflow-x: auto;
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--nu-accent) 55%, transparent);
  border-radius: 0;
  padding: 0.35rem max(0.35rem, env(safe-area-inset-left)) max(0.35rem, env(safe-area-inset-bottom));
  background: color-mix(in srgb, var(--nu-paper) 96%, transparent);
  box-shadow: none;
  backdrop-filter: blur(16px);
}
.nu-bottom-nav button {
  max-width: 88px;
  flex: 0 0 68px;
  color: var(--nu-muted);
  font-size: 0.61rem;
}
.nu-bottom-nav button.is-active {
  color: var(--nu-primary);
  background: transparent;
}
.nu-bottom-nav button i {
  font-size: 0.88rem;
}
.nu-bottom-nav::-webkit-scrollbar {
  display: none;
}
.nu-bottom-nav {
  scrollbar-width: none;
}
.nusantara--sunda .nu-cover-motif {
  border-radius: 58% 42% 52% 48%;
  transform: rotate(-28deg) translate(24%, 26%);
}
.nusantara--sunda .nu-cover-motif::before {
  inset: 12%;
  border-radius: 58% 42% 52% 48%;
}
.nusantara--sunda .nu-event-section {
  background-image: linear-gradient(
    120deg,
    color-mix(in srgb, var(--nu-primary) 22%, transparent),
    transparent 62%
  );
}
.nusantara--jawa .nu-event-section,
.nusantara--batak .nu-event-section,
.nusantara--dayak-ngaju .nu-event-section {
  background-image: none;
}

@media (max-width: 540px) {
  .nu-cover {
    align-items: center;
    text-align: center;
  }
  .nu-cover-content {
    width: min(100%, 620px);
    padding: 3rem 1.25rem calc(2rem + env(safe-area-inset-bottom));
  }
  .nu-cover-scope {
    margin-bottom: 0.9rem;
    font-size: 0.7rem;
  }
  .nu-cover-label {
    margin-bottom: 0.4rem;
  }
  .nu-names {
    justify-items: center;
    max-width: 100%;
    font-size: clamp(2.7rem, 13vw, 4rem);
    line-height: 0.9;
  }
  .nu-ampersand {
    margin: 0.12em 0;
  }
  .nu-cover-date {
    font-size: 0.82rem;
  }
  .nu-cover-recipient {
    justify-items: center;
    margin: 1.4rem 0 1rem;
  }
  .nu-section {
    padding: clamp(4rem, 14vw, 5.5rem) 1.25rem;
  }

  .nu-section-title {
    font-size: clamp(1.7rem, 8vw, 2.25rem);
  }
  .nu-event-list {
    grid-template-columns: minmax(0, 1fr);
  }
  .nu-bottom-nav button {
    flex-basis: 64px;
    min-width: 0;
    padding-inline: 0.2rem;
  }
}

@media (min-width: 768px) {
  .nu-cover-content {
    padding-bottom: 4.5rem;
  }
  .nu-welcome {
    min-height: 720px;
  }
  .nu-event-list {
    grid-template-columns: 1fr;
  }
  .nu-bottom-nav {
    bottom: 0;
  }
}

@media (min-width: 768px) {
  .nu-cover {
    min-height: 100svh;
  }
  .nu-cover-content {
    padding: clamp(2rem, 7vh, 4.5rem) clamp(2rem, 5vw, 4rem)
      calc(2rem + env(safe-area-inset-bottom));
  }
  .nu-names {
    max-width: 100%;
    font-size: clamp(3.25rem, 7vw, 5.25rem);
  }
  .nu-cover-rule--left {
    left: max(7vw, 42px);
  }
  .nu-cover-rule--right {
    right: max(7vw, 42px);
  }
  .nu-section {
    padding: 7rem 2rem;
  }
  .nu-welcome {
    min-height: 700px;
  }
  .nu-event-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .nu-person-photo {
    aspect-ratio: 0.86;
  }
  .nu-bottom-nav {
    bottom: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
  .nu-scroll-root {
    scroll-snap-type: none;
  }
  .nu-section {
    scroll-snap-align: none;
    scroll-snap-stop: normal;
  }
}

.nu-scroll-root--sunda {
  position: relative;
  isolation: isolate;
  background: #20382d;
}

.nu-sunda-world {
  position: sticky;
  z-index: 0;
  top: 0;
  width: 100%;
  height: 100svh;
  margin-bottom: -100svh;
  overflow: hidden;
  pointer-events: none;
  background: #344b40;
}

.nu-sunda-world__layer,
.nu-sunda-world__atmosphere {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.nu-sunda-world__layer {
  object-fit: cover;
  will-change: transform, opacity;
  transition: opacity 180ms linear;
}

.nu-sunda-world__mountains {
  z-index: 0;
  object-position: center 48%;
  filter: saturate(0.78) brightness(0.86);
}

.nu-sunda-world__tea {
  z-index: 1;
  object-position: center 56%;
  filter: saturate(0.78) brightness(0.72);
  mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 100%);
}

.nu-sunda-world__path {
  z-index: 2;
  inset: 12% auto 0 50%;
  width: min(82vw, 920px);
  height: 88%;
  object-position: center 68%;
  filter: saturate(0.74) brightness(0.8) sepia(0.08);
  mask-image: radial-gradient(ellipse at center 54%, #000 22%, rgb(0 0 0 / 88%) 44%, transparent 76%);
}

.nu-sunda-world__pavilion {
  z-index: 3;
  inset: 19% auto 10% 50%;
  width: min(82vw, 920px);
  height: 71%;
  object-position: center 56%;
  filter: saturate(0.76) brightness(0.78) sepia(0.08);
  mask-image: radial-gradient(ellipse at center 56%, #000 28%, rgb(0 0 0 / 82%) 48%, transparent 78%);
}

.nu-sunda-world__atmosphere {
  z-index: 6;
  background:
    radial-gradient(ellipse at 75% 12%, rgb(235 179 96 / 24%), transparent 42%),
    linear-gradient(180deg, rgb(25 42 34 / 14%), rgb(25 42 34 / 8%) 45%, rgb(25 42 34 / 62%)),
    linear-gradient(90deg, rgb(19 32 27 / 26%), transparent 28%, transparent 72%, rgb(19 32 27 / 28%));
}

.nu-scroll-root--sunda > .nu-section,
.nu-scroll-root--sunda > .nu-footer {
  z-index: 1;
}

.nusantara--sunda .nu-welcome {
  background-color: rgb(238 241 231 / 20%);
}

.nusantara--sunda .nu-section:not(.nu-event-section):not(.nu-stream-section):not(.nu-video-section) {
  background-color: rgb(238 241 231 / 52%);
}

.nusantara--sunda .nu-couple-section,
.nusantara--sunda .nu-gallery-section,
.nusantara--sunda .nu-gift-section,
.nusantara--sunda .nu-rsvp-section {
  background-color: rgb(238 241 231 / 44%);
}

.nusantara--sunda .nu-event-section {
  background-color: rgb(32 56 45 / 76%);
}

.nusantara--sunda .nu-footer {
  position: relative;
  z-index: 1;
  background: rgb(32 56 45 / 82%);
}

@media (max-width: 767px) {
  .nu-sunda-world__mountains {
    object-position: 54% center;
  }

  .nu-sunda-world__tea {
    object-position: 56% center;
  }

  .nu-sunda-world__path {
    object-position: center 72%;
  }

  .nu-sunda-world__path {
    width: min(120vw, 540px);
    object-position: center 70%;
  }

  .nu-sunda-world__pavilion {
    inset: 24% auto 10% 50%;
    width: min(118vw, 520px);
    height: 66%;
    object-position: center center;
  }

  .nusantara--sunda .nu-section:not(.nu-event-section):not(.nu-stream-section):not(.nu-video-section) {
    background-color: rgb(238 241 231 / 64%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nu-sunda-world__layer {
    will-change: auto;
    transition: none;
  }
}

/* Consistent, photo-led invitation layout across the Nusantara themes. */
.nu-scroll-root {
  scroll-snap-type: y proximity;
  overscroll-behavior-y: contain;
  background: var(--nu-dark);
}

.nu-cover {
  align-items: center;
  text-align: center;
}

.nu-cover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.nu-cover-label {
  margin-inline: auto;
}

.nu-names {
  width: min(100%, 15ch);
  max-width: 100%;
  justify-items: center;
  font-size: clamp(3rem, 6vw, 5.4rem);
  letter-spacing: -0.025em;
  line-height: 0.9;
  text-wrap: balance;
}

.nu-cover-date {
  align-self: center;
}

.nu-cover-recipient {
  justify-items: center;
}

.nu-section {
  box-sizing: border-box;
  width: 100%;
  min-height: 100svh;
  padding: clamp(4.75rem, 9vh, 7.5rem) clamp(1.25rem, 5vw, 4.5rem);
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}

.nu-welcome {
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0.8rem, 2vh, 1.3rem);
  padding: 2.5rem 1.25rem calc(6rem + env(safe-area-inset-bottom));
  color: var(--nu-paper);
  background: var(--nu-dark);
  text-align: center;
}

.nu-welcome > * {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
}

.nu-welcome-photo {
  position: relative;
  width: clamp(9.5rem, 24vw, 16rem);
  height: clamp(12rem, 34vh, 21rem);
  margin: 0 0 0.4rem;
  border: 1px solid color-mix(in srgb, var(--nu-accent) 74%, transparent);
  border-radius: 48% 48% 0.25rem 0.25rem;
  padding: 0.35rem;
  background: color-mix(in srgb, var(--nu-dark) 80%, transparent);
  box-shadow: 0 1rem 3rem rgb(0 0 0 / 24%);
}

.nu-welcome-photo::before {
  position: absolute;
  z-index: -1;
  inset: 0.55rem -0.55rem -0.55rem 0.55rem;
  border: 1px solid color-mix(in srgb, var(--nu-accent) 42%, transparent);
  border-radius: inherit;
  content: '';
}

.nu-welcome-photo img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
  object-position: center 35%;
}

.nu-welcome .nu-section-mark {
  gap: 0.65rem;
  margin: 0 0 0.15rem;
}

.nu-welcome .nu-scope {
  color: var(--nu-accent);
  font-size: clamp(0.65rem, 1vw, 0.78rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.nu-welcome-names {
  display: grid;
  justify-items: center;
  gap: 0.04em;
  width: min(100%, 16ch);
  margin: 0;
  color: var(--nu-paper);
  font-size: clamp(2.45rem, 6.5vw, 5.25rem);
  line-height: 0.98;
  text-wrap: balance;
}

.nu-welcome-names span {
  color: var(--nu-accent);
}

.nu-welcome-names .nu-welcome-name {
  max-width: 100%;
  color: var(--nu-paper);
  overflow-wrap: anywhere;
}

.nu-welcome-names .nu-welcome-join {
  margin: 0;
  font-size: 0.48em;
  font-style: italic;
  line-height: 0.85;
}

.nu-opening-copy {
  width: min(100%, 34rem);
  margin: 0.35rem auto 0;
  color: color-mix(in srgb, var(--nu-paper) 84%, transparent);
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1rem, 1.6vw, 1.3rem);
  line-height: 1.55;
  text-wrap: pretty;
}

.nu-quote-source {
  margin: -0.35rem auto 0.2rem;
  color: color-mix(in srgb, var(--nu-paper) 65%, transparent);
}

.nu-date-pill {
  min-height: 0;
  align-self: center;
  margin-top: 0.25rem;
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--nu-accent) 70%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--nu-accent) 70%, transparent);
  padding: 0.55rem 1.1rem;
  color: var(--nu-paper);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
}

.nu-countdown {
  gap: clamp(0.6rem, 2vw, 1.4rem);
  margin-top: 0.4rem;
}

.nu-countdown strong {
  color: var(--nu-paper);
  font-size: clamp(1.35rem, 3vw, 2rem);
}

.nu-countdown span {
  color: var(--nu-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nu-couple-section,
.nu-gallery-section,
.nu-rsvp-section,
.nu-detail-section,
.nu-plan-section,
.nu-menu-section,
.nu-family-section {
  background: var(--nu-paper);
}

.nu-story-section,
.nu-gift-section {
  background: var(--nu-bg);
}

.nu-section-kicker {
  margin: 0 0 0.55rem;
  color: var(--nu-primary);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-align: center;
  text-transform: uppercase;
}

.nu-section-title {
  max-width: 22ch;
  margin: 0 auto 0.6rem;
  font-size: clamp(2rem, 4.8vw, 3.25rem);
  text-align: center;
  text-wrap: balance;
}

.nu-section-intro {
  max-width: 34rem;
  margin: 0 auto 1.5rem;
  line-height: 1.7;
  text-align: center;
}

.nu-couple-grid {
  width: min(100%, 920px);
  gap: clamp(1.25rem, 4vw, 3rem);
  margin: clamp(1.5rem, 4vh, 2.5rem) auto 0;
}

.nu-person-photo {
  width: min(100%, 19rem);
  margin-inline: auto;
  aspect-ratio: 0.82;
  border: 1px solid color-mix(in srgb, var(--nu-accent) 45%, transparent);
  border-radius: 48% 48% 0.25rem 0.25rem;
  padding: 0.35rem;
  background: var(--nu-panel);
}

.nu-person-photo img {
  border-radius: inherit;
}

.nu-person h3 {
  margin-top: 1.2rem;
  font-size: clamp(1.4rem, 3vw, 2rem);
  overflow-wrap: anywhere;
}

.nu-person p {
  max-width: 28ch;
  margin-inline: auto;
  line-height: 1.6;
}

.nu-event-section,
.nu-video-section {
  color: var(--nu-paper);
  background: var(--nu-dark);
}

.nu-event-section .nu-section-kicker,
.nu-event-section .nu-section-title,
.nu-video-section .nu-section-kicker,
.nu-video-section .nu-section-title {
  color: var(--nu-paper);
}

.nu-event-list {
  width: min(100%, 920px);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: clamp(1.5rem, 4vh, 2.5rem) auto;
}

.nu-event-card,
.nusantara--jawa .nu-event-card,
.nusantara--dayak-ngaju .nu-event-card {
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--nu-accent) 55%, transparent);
  border-radius: 0.25rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  color: var(--nu-dark);
  background: var(--nu-paper);
  text-align: center;
}

.nu-event-card h3 {
  color: var(--nu-primary);
  font-size: clamp(1.25rem, 2.3vw, 1.65rem);
}

.nu-event-card .nu-event-date {
  color: var(--nu-primary);
}

.nu-story-list {
  width: min(100%, 820px);
  gap: 2rem;
}

.nu-story-item {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  column-gap: clamp(1.25rem, 4vw, 3rem);
  border: 0;
  padding: 0;
}

.nu-story-item img {
  grid-row: span 3;
  height: min(55vh, 24rem);
  margin: 0;
  border-radius: 0.2rem;
}

.nu-story-item h3,
.nu-story-date,
.nu-story-item > p:last-child {
  grid-column: 2;
}

.nu-story-item > p:last-child {
  line-height: 1.75;
}

.nu-gallery-section :deep(.gallery-invitation),
.nu-gallery-section :deep(.gallery-grid) {
  max-width: 1000px;
  margin-inline: auto;
}

.nu-gift-list article {
  border-top-color: color-mix(in srgb, var(--nu-primary) 24%, transparent);
}

.nu-gift-list button,
.nu-address {
  border: 1px solid color-mix(in srgb, var(--nu-primary) 28%, transparent);
  border-radius: 0.2rem;
}

.nu-rsvp-panel {
  width: min(100%, 740px);
  border: 1px solid color-mix(in srgb, var(--nu-accent) 48%, transparent);
  padding: clamp(1.25rem, 4vw, 2.5rem);
  background: var(--nu-bg);
}

.nu-rsvp-panel > .nu-section-title,
.nu-rsvp-panel > .nu-section-intro {
  text-align: center;
}

.nu-bottom-nav {
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: calc(4.25rem + env(safe-area-inset-bottom));
  justify-content: center;
  gap: clamp(0.25rem, 2vw, 1rem);
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--nu-accent) 52%, transparent);
  border-radius: 0;
  padding: 0.35rem max(0.6rem, env(safe-area-inset-left)) calc(0.35rem + env(safe-area-inset-bottom));
  background: color-mix(in srgb, var(--nu-dark) 94%, transparent);
  box-shadow: 0 -0.5rem 2rem rgb(0 0 0 / 12%);
}

.nu-bottom-nav button {
  max-width: 7rem;
  min-height: 3.25rem;
  flex: 0 1 7rem;
  color: color-mix(in srgb, var(--nu-paper) 68%, transparent);
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nu-bottom-nav button i {
  font-size: 1.1rem;
}

.nu-bottom-nav button.is-active {
  color: var(--nu-accent);
}

.nu-footer {
  padding: 4rem 1.5rem calc(7rem + env(safe-area-inset-bottom));
}

.nusantara--sunda .nu-welcome {
  background:
    linear-gradient(180deg, rgb(25 42 34 / 42%), rgb(25 42 34 / 66%) 72%, rgb(25 42 34 / 88%)),
    transparent;
}

.nusantara--sunda .nu-section.nu-welcome {
  background:
    linear-gradient(180deg, rgb(25 42 34 / 42%), rgb(25 42 34 / 66%) 72%, rgb(25 42 34 / 88%)),
    transparent;
}

.nusantara--sunda .nu-section:not(.nu-welcome):not(.nu-event-section):not(.nu-stream-section):not(.nu-video-section) {
  background-color: color-mix(in srgb, var(--nu-paper) 96%, transparent);
}

.nusantara--sunda .nu-event-section,
.nusantara--sunda .nu-video-section,
.nusantara--sunda .nu-footer {
  background-color: color-mix(in srgb, var(--nu-dark) 97%, transparent);
}

.nusantara--batak .nu-welcome,
.nusantara--dayak-ngaju .nu-welcome {
  color: var(--nu-paper);
  background: var(--nu-dark);
}

.nusantara--sunda .nu-bottom-nav {
  background: color-mix(in srgb, var(--nu-dark) 97%, transparent);
}

@media (min-width: 768px) {
  .nu-welcome {
    gap: clamp(0.55rem, 1.35vh, 1.2rem);
    padding: 1.5rem 2rem calc(5.5rem + env(safe-area-inset-bottom));
  }

  .nu-section:not(.nu-welcome) {
    padding-inline: max(2rem, calc((100% - 1040px) / 2));
  }

  .nu-couple-grid {
    gap: clamp(2rem, 8vw, 7rem);
  }

  .nu-event-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .nu-bottom-nav {
    min-height: 4.25rem;
    padding-bottom: 0.35rem;
  }
}

@media (max-width: 767px) {
  .nu-scroll-root {
    scroll-snap-type: y proximity;
  }

  .nu-section {
    min-height: 100svh;
    padding: 4.5rem 1.25rem 6rem;
  }

  .nu-cover-content {
    width: min(100%, 620px);
    padding: 2.5rem 1.25rem calc(2rem + env(safe-area-inset-bottom));
  }

  .nu-names {
    width: min(100%, 13ch);
    font-size: clamp(2.65rem, 12.5vw, 4rem);
    line-height: 0.9;
  }

  .nu-welcome {
    gap: 0.7rem;
    padding-top: 1.5rem;
    padding-bottom: calc(5.2rem + env(safe-area-inset-bottom));
  }

  .nu-welcome-photo {
    width: clamp(8rem, 39vw, 10.5rem);
    height: clamp(10.5rem, 37svh, 15.5rem);
  }

  .nu-welcome-names {
    width: min(100%, 13ch);
    font-size: clamp(2.2rem, 10vw, 3.6rem);
    line-height: 0.98;
  }

  .nu-opening-copy {
    font-size: 1rem;
    line-height: 1.45;
  }

  .nu-quote-source {
    margin-top: -0.35rem;
  }

  .nu-date-pill {
    max-width: 100%;
    font-size: 0.69rem;
    letter-spacing: 0.04em;
    text-wrap: balance;
  }

  .nu-countdown {
    grid-template-columns: repeat(4, minmax(2.65rem, 1fr));
    gap: 0.35rem;
    margin-top: 0.15rem;
  }

  .nu-countdown strong {
    font-size: 1.4rem;
  }

  .nu-event-list {
    grid-template-columns: minmax(0, 1fr);
  }

  .nu-story-item {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.35rem;
  }

  .nu-story-item img {
    grid-row: auto;
    height: min(58svh, 24rem);
    margin-bottom: 0.75rem;
  }

  .nu-story-item h3,
  .nu-story-date,
  .nu-story-item > p:last-child {
    grid-column: 1;
  }

  .nu-bottom-nav {
    justify-content: space-around;
    gap: 0;
    overflow-x: hidden;
  }

  .nu-bottom-nav button {
    flex: 1 1 0;
    max-width: none;
    padding-inline: 0.05rem;
    font-size: clamp(0.44rem, 1.8vw, 0.57rem);
  }
}
</style>
