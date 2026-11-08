<template>
  <div class="garden-editorial min-h-screen overflow-hidden bg-[#f5f1e8] text-[#27392f]" :class="{ 'motion-ready': motionReady }">
    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#f5f1e8"
      accentColor="#9c6b53"
    />

    <Transition name="cover">
      <section v-if="!isOpened" class="cover-screen fixed inset-0 z-[100] flex items-center justify-center px-5 py-8">
        <div class="cover-paper absolute inset-0"></div>
        <div class="cover-grain absolute inset-0 pointer-events-none"></div>
        <div class="cover-frame absolute inset-4 md:inset-8 pointer-events-none"></div>
        <img src="/assets/images/serene-garden-2d/background.svg" alt="" class="cover-layer cover-layer-background" />
        <img src="/assets/images/serene-garden-2d/middle.svg" alt="" class="cover-layer cover-layer-vines" />
        <img src="/assets/images/serene-garden-2d/accent.svg" alt="" class="cover-layer cover-layer-flowers" />
        <img src="/assets/images/serene-garden-2d/front.svg" alt="" class="cover-layer cover-layer-garden" />

        <div class="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center">
          <p class="cover-kicker mb-1 text-xs uppercase tracking-[0.24em]">The Wedding Of</p>
          <div class="cover-monogram-wrap relative mb-0 flex h-36 w-40 items-center justify-center md:h-44 md:w-48">
            <BotanicalSprig class="monogram-sprig monogram-sprig-left absolute inset-y-0 left-0 h-full w-20 md:w-24" />
            <BotanicalSprig class="monogram-sprig monogram-sprig-right absolute inset-y-0 right-0 h-full w-20 -scale-x-100 md:w-24" />
            <div class="cover-monogram flex flex-col items-center text-4xl leading-[0.8]">
              <span>{{ initials[0] }}</span><span class="my-2 text-xl">—</span><span>{{ initials[1] }}</span>
            </div>
          </div>
          <div class="cover-couple relative -mt-1 mb-1 flex h-36 w-48 items-end justify-center md:h-44 md:w-56">
            <img v-if="coverPhoto" :src="coverPhoto" alt="Foto pasangan" class="relative z-10 max-h-full max-w-full object-contain" />
            <svg v-else viewBox="0 0 240 190" class="relative z-10 h-full w-full" fill="none" aria-hidden="true">
              <path d="M73 187c-2-35 0-65 13-87 8-13 19-18 31-16 16 2 25 17 27 38l9 65H73Z" fill="#f8f5ed" stroke="#3b5366" stroke-width="2" />
              <path d="M92 83c-5-27 5-49 25-50 21-1 31 18 25 47l-4 34c-1 11-10 18-21 17-12-1-19-9-20-20l-5-28Z" fill="#f2eadc" stroke="#3b5366" stroke-width="2" />
              <path d="M87 72c3-27 17-41 31-41 17 0 30 15 30 42l-10 14c-9-12-13-22-16-33-8 11-20 18-35 20Z" fill="#e7e5dc" stroke="#3b5366" stroke-width="2" />
              <path d="M151 187c1-38 1-69 10-92 6-16 18-25 33-24 17 1 27 15 31 36l10 80h-84Z" fill="#f7f2e7" stroke="#3b5366" stroke-width="2" />
              <path d="M174 72c0-21 10-35 25-35s25 14 25 35l-4 33c-1 12-9 20-21 20s-20-8-21-20l-4-33Z" fill="#eadfce" stroke="#3b5366" stroke-width="2" />
              <path d="M173 70c3-21 12-34 26-34 16 0 24 13 27 34-9-4-16-12-20-23-6 11-17 19-33 23Z" fill="#e9e8df" stroke="#3b5366" stroke-width="2" />
              <path d="M126 130c11 14 21 17 31 10m-38 6c9 13 21 18 33 13" stroke="#d9959c" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
          <h1 class="cover-names mb-2 text-4xl leading-[0.95] md:text-6xl">
            {{ shortName(data.groomName, 'Mempelai Pria') }} &amp; {{ shortName(data.brideName, 'Mempelai Wanita') }}
          </h1>
          <p class="mb-5 text-sm tracking-wide">{{ weddingDate || 'Hari istimewa kami' }}</p>
          <p class="mb-1 text-xs">Kepada Yth.</p>
          <p class="mb-4 max-w-[18rem] truncate text-lg font-semibold">{{ data.guestName || 'Tamu Undangan' }}</p>
          <button class="open-button inline-flex items-center gap-3 rounded-full px-7 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5" @click="openInvitation">
            <span aria-hidden="true">✉</span>
            Buka Undangan
          </button>
        </div>
      </section>
    </Transition>

    <div v-if="isOpened" id="main-content" ref="scrollRoot" class="invitation-scroll h-screen overflow-y-auto scroll-smooth" @scroll.passive="handleInvitationScroll">
      <nav class="garden-nav fixed bottom-3 left-1/2 z-50 flex w-[min(94%,34rem)] -translate-x-1/2 items-center justify-around gap-1 overflow-x-auto rounded-full px-2 py-2 shadow-lg md:bottom-6" aria-label="Navigasi undangan">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item flex min-w-[3.4rem] flex-1 flex-col items-center gap-1 rounded-full px-2 py-2 text-[9px] transition"
          :class="activeSection === item.id ? 'is-active' : ''"
          :aria-label="item.label"
          @click="scrollToSection(item.id)"
        >
          <span class="text-sm" aria-hidden="true">{{ item.icon }}</span>
          <span class="max-w-full truncate">{{ item.label }}</span>
        </button>
      </nav>

      <main>
        <section id="home" ref="cinematicSequence" class="cinematic-sequence relative">
          <div class="hero-section cinematic-stage relative sticky top-0 flex items-center justify-center overflow-hidden px-6 pb-16 pt-12 text-center">
          <div class="hero-wash absolute inset-0"></div>
          <img src="/assets/images/serene-garden-2d/background.svg" alt="" class="hero-layer hero-layer-background" :style="{ transform: `scale(${1.12 - motionProgress * 0.12}) translateY(${motionProgress * 18}px)` }" />
          <img src="/assets/images/serene-garden-2d/middle.svg" alt="" class="hero-layer hero-layer-vines" :style="{ translate: `0 ${motionProgress * -54}px`, opacity: 0.6 + motionProgress * 0.25 }" />
          <img src="/assets/images/serene-garden-2d/front.svg" alt="" class="hero-layer hero-layer-garden" :style="{ translate: `0 ${motionProgress * 72}px`, scale: `${1 + motionProgress * 0.08}` }" />
          <BotanicalSprig class="hero-sprig hero-sprig-left absolute -left-10 top-8 h-72 w-52 md:h-[30rem] md:w-72" :style="{ translate: `${motionProgress * -28}px ${motionProgress * 34}px` }" />
          <BotanicalSprig class="hero-sprig hero-sprig-right absolute -right-12 bottom-0 h-72 w-52 rotate-180 md:h-[30rem] md:w-72" :style="{ translate: `${motionProgress * 30}px ${motionProgress * -28}px` }" />
          <div class="hero-ring absolute left-1/2 top-[17%] h-[17rem] w-[17rem] -translate-x-1/2 rounded-t-full border border-[#9c6b53]/30 md:top-[12%] md:h-[25rem] md:w-[25rem]" :style="{ rotate: `${motionProgress * 28}deg`, scale: `${1 - motionProgress * 0.12}` }"></div>

          <div class="hero-copy relative z-10 mx-auto w-full max-w-3xl" :style="{ opacity: Math.max(0.32, 1 - motionProgress * 0.76), translate: `0 ${motionProgress * -28}px` }">
            <p class="eyebrow mb-6">The beginning of forever</p>
            <div class="hero-portrait mx-auto mb-8 flex h-56 w-44 items-center justify-center overflow-hidden rounded-t-[10rem] border border-white/80 bg-[#e5e1d4] shadow-xl md:h-72 md:w-56" :style="{ scale: `${1 + motionProgress * 0.08}` }">
              <img v-if="coverPhoto" :src="coverPhoto" alt="Potret pasangan" class="h-full w-full object-cover" />
              <span v-else class="font-display text-5xl text-[#71816f]">{{ initials }}</span>
            </div>
            <p class="mb-3 text-xs uppercase tracking-[0.22em] text-[#71816f]">Kami mengundang Anda</p>
            <h2 class="hero-names mx-auto max-w-3xl text-5xl leading-[0.95] md:text-8xl">
              {{ shortName(data.groomName, 'Mempelai Pria') }}
              <span class="hero-ampersand px-2 text-3xl md:text-5xl">&amp;</span>
              {{ shortName(data.brideName, 'Mempelai Wanita') }}
            </h2>
            <p class="mx-auto mt-6 max-w-md text-sm leading-7 text-[#657369]">Dengan bahagia kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.</p>
            <p class="mt-7 text-xs uppercase tracking-[0.2em] text-[#9c6b53]">{{ weddingDate || 'Tanggal akan diumumkan' }}</p>
            <div v-if="hasCountdown" class="countdown-row mx-auto mt-8 flex max-w-sm justify-center gap-3">
              <div v-for="(value, label) in countdown" :key="label" class="countdown-cell min-w-16 rounded-2xl px-3 py-3">
                <strong class="block text-xl font-normal">{{ value }}</strong>
                <span class="mt-1 block text-[8px] uppercase tracking-[0.14em]">{{ label }}</span>
              </div>
            </div>
            <button class="scroll-cue mt-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#71816f]" :style="{ opacity: Math.max(0, 1 - motionProgress * 4) }" @click="scrollToSection('quote')">
              Gulir untuk melihat
              <span aria-hidden="true">↓</span>
            </button>
          </div>
          </div>
        </section>

        <section v-if="data.quoteText" id="quote" class="quote-section relative px-6 py-24 text-center md:py-32">
          <div class="section-wrap scroll-reveal relative mx-auto max-w-2xl">
            <p class="eyebrow mb-6">Sebuah doa</p>
            <p class="quote-copy text-2xl leading-relaxed md:text-4xl">“{{ data.quoteText }}”</p>
            <p v-if="data.quoteSource" class="mt-6 text-xs uppercase tracking-[0.2em] text-[#9c6b53]">— {{ data.quoteSource }}</p>
          </div>
        </section>

        <section v-if="isSectionEnabled('couple')" id="couple" class="couple-section relative px-6 py-24 md:py-32">
          <BotanicalSprig class="section-sprig absolute right-0 top-8 h-52 w-36 rotate-90 md:h-72 md:w-48" />
          <div class="section-wrap relative mx-auto max-w-5xl">
            <SectionHeading kicker="Dua hati, satu cerita" title="Mempelai" />
            <div class="mt-16 grid gap-12 md:grid-cols-2 md:gap-20">
              <article v-for="person in coupleCards" :key="person.role" class="couple-card text-center" :class="[person.role === 'mempelai-wanita' ? 'couple-card-bride md:mt-20' : 'couple-card-groom']">
                <div class="couple-photo mx-auto mb-7 flex aspect-[4/5] w-full max-w-[19rem] items-center justify-center overflow-hidden rounded-t-[10rem] border border-[#d8d2c5] bg-[#e6e4d9] shadow-md">
                  <img v-if="person.photo" :src="person.photo" :alt="'Foto ' + person.name" class="h-full w-full object-cover" />
                  <span v-else class="font-display text-6xl text-[#71816f]">{{ person.initial }}</span>
                </div>
                <p class="eyebrow mb-2">{{ person.label }}</p>
                <h3 class="font-display text-4xl text-[#35453a]">{{ person.name }}</h3>
                <p v-if="person.fullName && person.fullName !== person.name" class="mt-2 text-sm font-medium">{{ person.fullName }}</p>
                <p class="mt-4 text-sm italic text-[#71816f]">{{ person.parentLabel }}</p>
                <p v-if="person.parents" class="mt-1 text-sm leading-6 text-[#657369]">{{ person.parents }}</p>
              </article>
            </div>
          </div>
        </section>

        <section v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" id="story" class="story-section px-6 py-24 md:py-32">
          <div class="section-wrap mx-auto max-w-4xl">
            <SectionHeading kicker="Perjalanan kami" title="Dari waktu ke waktu" />
            <div class="story-list relative mx-auto mt-16 max-w-2xl space-y-10">
              <article v-for="(story, index) in data.loveStory || []" :key="index" class="story-card relative grid gap-5 pl-10 sm:grid-cols-[7rem_1fr] sm:gap-8">
                <span class="story-dot absolute left-0 top-1 h-3 w-3 rounded-full"></span>
                <p class="text-xs uppercase tracking-[0.14em] text-[#9c6b53]">{{ story.date || 'Satu hari' }}</p>
                <div>
                  <h3 class="font-display text-2xl">{{ story.title || 'Momen istimewa' }}</h3>
                  <p class="mt-2 text-sm leading-7 text-[#657369]">{{ story.description || story.content }}</p>
                </div>
              </article>
              <p v-if="!data.loveStory?.length" class="text-center text-sm italic text-[#71816f]">Cerita perjalanan kami akan segera hadir.</p>
            </div>
          </div>
        </section>

        <section v-if="isSectionEnabled('event')" id="event" class="event-section relative px-6 py-24 md:py-32">
          <div class="section-wrap mx-auto max-w-5xl">
            <SectionHeading kicker="Catat tanggalnya" title="Hari bahagia" />
            <div class="mt-14 grid gap-6 md:grid-cols-2">
              <article v-for="event in eventCards" :key="event.id" class="event-card relative overflow-hidden rounded-[2rem] px-7 py-9 md:px-10">
                <div class="event-number absolute right-5 top-1 text-7xl">0{{ event.number }}</div>
                <div class="relative z-10">
                  <p class="eyebrow mb-3">{{ event.label }}</p>
                  <h3 class="font-display text-3xl">{{ event.title }}</h3>
                  <p class="mt-5 text-sm font-medium">{{ formatDate(event.data?.dateTime) }}</p>
                  <p class="mt-1 text-sm text-[#71816f]">{{ formatTime(event.data?.dateTime) }} WIB</p>
                  <p class="mt-5 text-sm font-semibold">{{ event.data?.venue || event.data?.name || 'Lokasi acara' }}</p>
                  <p v-if="event.data?.description" class="mt-2 max-w-sm text-sm leading-6 text-[#657369]">{{ event.data.description }}</p>
                  <a v-if="event.data?.mapUrl" :href="event.data.mapUrl" target="_blank" rel="noreferrer" class="map-link mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold">
                    Lihat lokasi <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
              <p v-if="!eventCards.length" class="col-span-full text-center text-sm italic text-[#71816f]">Informasi acara akan segera hadir.</p>
            </div>
            <button v-if="eventDate" class="calendar-button mx-auto mt-8 flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold" @click="addToCalendar">
              <span aria-hidden="true">＋</span> Simpan tanggal
            </button>
            <div v-if="data.dressCode && isSectionEnabled('dress-code')" class="dress-code-card mx-auto mt-12 max-w-2xl rounded-[2rem] px-8 py-8 text-center">
              <p class="eyebrow mb-3">Palet busana</p>
              <h3 class="font-display text-3xl">Dress Code</h3>
              <p class="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#657369]">{{ data.dressCode }}</p>
              <div class="dress-swatches mx-auto mt-6 flex justify-center gap-3" aria-hidden="true">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="gallery-section px-4 py-24 md:px-6 md:py-32">
          <div class="section-wrap mx-auto max-w-6xl">
            <SectionHeading kicker="Potongan kenangan" title="Galeri kami" />
            <div class="mt-14"><GalleryInvitation :items="galleryImages" /></div>
          </div>
        </section>

        <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="rsvp-section relative px-5 py-24 md:px-6 md:py-32">
          <BotanicalSprig class="section-sprig absolute bottom-0 left-0 h-52 w-36 -rotate-90 md:h-72 md:w-48" />
          <div class="section-wrap relative mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div class="lg:pt-10">
              <p class="eyebrow mb-4">Kami menantikan kabar darimu</p>
              <h2 class="font-display text-5xl leading-tight md:text-6xl">Mari berbagi<br /><em>kebahagiaan.</em></h2>
              <p class="mt-6 max-w-sm text-sm leading-7 text-[#657369]">Mohon konfirmasi kehadiran dan tinggalkan doa untuk perjalanan baru kami.</p>
            </div>
            <div class="rsvp-card rounded-[2rem] p-6 shadow-lg md:p-10">
              <form class="space-y-5" @submit.prevent="submitRSVP">
                <label class="form-label block">Nama
                  <input v-model="rsvp.name" required autocomplete="name" maxlength="120" class="form-control mt-2" placeholder="Nama Anda" />
                </label>
                <fieldset>
                  <legend class="form-label mb-2">Kehadiran</legend>
                  <div class="grid grid-cols-3 gap-2">
                    <label v-for="option in attendanceOptions" :key="option.value" class="attendance-option rounded-xl px-2 py-3 text-center text-xs" :class="rsvp.attendance === option.value ? 'selected' : ''">
                      <input v-model="rsvp.attendance" class="sr-only" type="radio" :value="option.value" />{{ option.label }}
                    </label>
                  </div>
                </fieldset>
                <label v-if="rsvp.attendance === 'hadir'" class="form-label block">Jumlah tamu
                  <select v-model.number="rsvp.totalGuests" class="form-control mt-2">
                    <option v-for="count in 5" :key="count" :value="count">{{ count }} orang</option>
                  </select>
                </label>
                <label class="form-label block">Ucapan &amp; doa
                  <textarea v-model="rsvp.message" rows="4" maxlength="1000" class="form-control mt-2 resize-y" placeholder="Tuliskan pesan untuk kami"></textarea>
                </label>
                <button class="submit-button w-full rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 disabled:opacity-50" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Mengirim…' : 'Kirim konfirmasi' }}
                </button>
              </form>
              <div v-if="guestMessages.length" class="wishes-list mt-8 max-h-96 space-y-3 overflow-y-auto border-t border-[#dcd8cc] pt-6">
                <article v-for="(wish, index) in guestMessages" :key="wish.id || index" class="wish-card rounded-2xl px-4 py-4">
                  <div class="flex items-start justify-between gap-3">
                    <p class="text-sm font-semibold">{{ wish.guestName || 'Tamu' }}</p>
                    <span class="text-[10px] text-[#71816f]">{{ timeAgo(wish.createdAt) }}</span>
                  </div>
                  <p v-if="wish.message" class="mt-2 text-sm leading-6 text-[#657369]">{{ wish.message }}</p>
                </article>
              </div>
              <p v-else class="mt-6 border-t border-[#dcd8cc] pt-5 text-center text-xs italic text-[#71816f]">Jadilah yang pertama mengirimkan doa.</p>
            </div>
          </div>
        </section>

        <section v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || walletItems.length)" id="gift" class="gift-section px-6 py-24 text-center md:py-32">
          <div class="section-wrap mx-auto max-w-4xl">
            <SectionHeading kicker="Tanda kasih" title="Kado pernikahan" />
            <p class="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#657369]">Doa dan kehadiran Anda adalah hadiah terindah. Bila ingin berbagi tanda kasih, informasi berikut dapat digunakan.</p>
            <div class="mt-10 flex flex-wrap justify-center gap-5">
              <article v-for="(bank, index) in data.bankAccounts" :key="index" class="gift-card w-full max-w-sm rounded-[1.75rem] p-7 text-left">
                <p class="eyebrow">{{ bank.bankName || 'Transfer' }}</p>
                <p class="mt-5 text-xl tracking-[0.12em]">{{ bank.accountNumber }}</p>
                <p class="mt-2 text-sm text-[#71816f]">a.n. {{ bank.accountName }}</p>
                <button class="map-link mt-6 rounded-full px-5 py-2.5 text-xs font-semibold" @click="copyToClipboard(bank.accountNumber)">Salin nomor rekening</button>
              </article>
              <article v-for="(wallet, index) in walletItems" :key="'wallet-' + index" class="gift-card w-full max-w-sm rounded-[1.75rem] p-7 text-left">
                <p class="eyebrow">{{ wallet.wallet_provider || wallet.provider || 'E-Wallet' }}</p>
                <p class="mt-5 text-xl tracking-[0.12em]">{{ wallet.wallet_number || wallet.number || wallet }}</p>
                <p class="mt-2 text-sm text-[#71816f]">a.n. {{ wallet.account_name || wallet.accountName || data.groomName + ' & ' + data.brideName }}</p>
                <button class="map-link mt-6 rounded-full px-5 py-2.5 text-xs font-semibold" @click="copyToClipboard(wallet.wallet_number || wallet.number || wallet)">Salin nomor</button>
              </article>
            </div>
          </div>
        </section>

        <footer class="closing-section relative overflow-hidden px-6 py-24 text-center md:py-32">
          <BotanicalSprig class="closing-sprig absolute left-0 top-0 h-60 w-44 md:h-80 md:w-60" />
          <BotanicalSprig class="closing-sprig absolute right-0 bottom-0 h-60 w-44 rotate-180 md:h-80 md:w-60" />
          <div class="relative z-10 mx-auto max-w-2xl">
            <p class="eyebrow mb-5">Sampai jumpa di hari bahagia</p>
            <h2 class="font-display text-5xl md:text-7xl">{{ shortName(data.groomName, 'Mempelai Pria') }} <span class="text-3xl text-[#9c6b53]">&amp;</span> {{ shortName(data.brideName, 'Mempelai Wanita') }}</h2>
            <p class="mx-auto mt-6 max-w-md text-sm leading-7 text-[#657369]">Terima kasih atas doa, kasih, dan kehadiran yang akan menjadi bagian dari kenangan kami.</p>
            <div class="my-8 flex justify-center"><span class="ornament-divider" aria-hidden="true">✳</span></div>
            <WatermarkBadge variant="light" />
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, nextTick, onUnmounted, ref, watch } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const toast = useToast()
const data = ref({ ...props.data })
const isOpened = ref(false)
const motionReady = ref(false)
const motionProgress = ref(0)
const scrollRoot = ref(null)
const cinematicSequence = ref(null)
const activeSection = ref('home')
const isSubmitting = ref(false)
const galleryImages = ref([])
const guestMessages = ref([])
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const attendanceOptions = [
  { value: 'hadir', label: 'Hadir' },
  { value: 'tidak', label: 'Berhalangan' },
  { value: 'ragu', label: 'Belum pasti' },
]
const allNavItems = [
  { id: 'home', label: 'Beranda', icon: '⌂', key: 'hero' },
  { id: 'couple', label: 'Mempelai', icon: '♡', key: 'couple' },
  { id: 'story', label: 'Cerita', icon: '✳', key: 'love-story' },
  { id: 'event', label: 'Acara', icon: '◷', key: 'event' },
  { id: 'gallery', label: 'Galeri', icon: '▧', key: 'gallery' },
  { id: 'rsvp', label: 'Ucapan', icon: '✉', key: 'rsvp' },
  { id: 'gift', label: 'Kado', icon: '♧', key: 'gift' },
]

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)
const coverPhoto = computed(() => data.value.photoCoupleUrl || '')
const initials = computed(() => `${shortName(data.value.groomName, 'S')[0] || 'S'}${shortName(data.value.brideName, 'U')[0] || 'U'}`)
const eventDate = computed(() => data.value.akadLocation?.dateTime || data.value.resepsiLocation?.dateTime || data.value.dateTime || '')
const weddingDate = computed(() => formatDate(data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime))
const hasCountdown = computed(() => Boolean(eventDate.value && new Date(eventDate.value).getTime() > Date.now()))
const walletItems = computed(() => {
  const value = data.value.eWalletLink
  const items = Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? [value.trim()] : []
  return items.map((wallet) => typeof wallet === 'object' ? wallet : { wallet_number: wallet })
})
const navItems = computed(() => allNavItems.filter((item) => {
  if (item.key === 'hero') return true
  if (item.id === 'story') return isSectionEnabled(item.key) && (data.value.loveStory?.length || isPreviewMode.value)
  if (item.id === 'gallery') return isSectionEnabled(item.key) && galleryImages.value.length
  if (item.id === 'gift') return isSectionEnabled(item.key) && data.value.bankAccounts?.length
  return isSectionEnabled(item.key)
}))
const coupleCards = computed(() => [
  {
    role: 'mempelai-pria',
    label: 'Mempelai pria',
    name: data.value.groomName || 'Mempelai Pria',
    fullName: data.value.groomFullName,
    photo: data.value.groomPhotoUrl,
    initial: shortName(data.value.groomName, 'P')[0] || 'P',
    parentLabel: 'Putra dari',
    parents: data.value.parents?.groomParents || data.value.groomParents,
  },
  {
    role: 'mempelai-wanita',
    label: 'Mempelai wanita',
    name: data.value.brideName || 'Mempelai Wanita',
    fullName: data.value.brideFullName,
    photo: data.value.bridePhotoUrl,
    initial: shortName(data.value.brideName, 'W')[0] || 'W',
    parentLabel: 'Putri dari',
    parents: data.value.parents?.brideParents || data.value.brideParents,
  },
])
const eventCards = computed(() => [
  data.value.akadLocation && { id: 'akad', number: 1, label: 'Prosesi pertama', title: 'Akad Nikah', data: data.value.akadLocation },
  data.value.resepsiLocation && { id: 'resepsi', number: 2, label: 'Perayaan', title: 'Resepsi', data: data.value.resepsiLocation },
].filter(Boolean))

let countdownInterval
let sectionObserver
let revealObserver
let scrollFrame = 0

function isSectionEnabled(key) {
  const sections = data.value.selectedSections
  return !Array.isArray(sections) || sections.includes(key)
}

function shortName(name, fallback) {
  if (!name) return fallback
  return String(name).trim().split(/\s+/)[0]
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(value) {
  if (!value) return 'Waktu menyusul'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Waktu menyusul'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:') || choice.includes('/') || choice.includes('http')) return choice
  return '/audio/romantic_music1.mp3'
}

async function openInvitation() {
  isOpened.value = true
  await nextTick()
  motionReady.value = true
  initScrollSpy()
  initRevealObserver()
  updateMotionProgress()
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSection.value = id
}

function initScrollSpy() {
  sectionObserver?.disconnect()
  const root = scrollRoot.value
  if (!root) return
  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { root, threshold: 0.02 })
  allNavItems.forEach(({ id }) => {
    const section = document.getElementById(id)
    if (section) sectionObserver.observe(section)
  })
}

function initRevealObserver() {
  revealObserver?.disconnect()
  const root = scrollRoot.value
  if (!root) return
  const revealItems = root.querySelectorAll('.scroll-reveal, .couple-card, .story-card, .event-card')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('reveal-visible'))
    return
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('reveal-visible')
      revealObserver.unobserve(entry.target)
    })
  }, { root, threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  revealItems.forEach((item) => revealObserver.observe(item))
}

function handleInvitationScroll() {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    updateMotionProgress()
  })
}

function updateMotionProgress() {
  const root = scrollRoot.value
  const sequence = cinematicSequence.value
  if (!root || !sequence) return
  const start = sequence.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop
  const travel = Math.max(1, sequence.offsetHeight - root.clientHeight)
  const progress = (root.scrollTop - start) / travel
  motionProgress.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 1
    : Math.min(1, Math.max(0, progress))
}

function initCountdown() {
  if (countdownInterval) clearInterval(countdownInterval)
  const target = new Date(eventDate.value).getTime()
  if (!eventDate.value || Number.isNaN(target)) return
  const update = () => {
    const difference = target - Date.now()
    if (difference <= 0) {
      countdown.value = { Hari: '00', Jam: '00', Menit: '00', Detik: '00' }
      clearInterval(countdownInterval)
      return
    }
    countdown.value = {
      Hari: String(Math.floor(difference / 86400000)).padStart(2, '0'),
      Jam: String(Math.floor((difference % 86400000) / 3600000)).padStart(2, '0'),
      Menit: String(Math.floor((difference % 3600000) / 60000)).padStart(2, '0'),
      Detik: String(Math.floor((difference % 60000) / 1000)).padStart(2, '0'),
    }
  }
  update()
  countdownInterval = setInterval(update, 1000)
}

async function loadWishes() {
  if (!data.value.id || isPreviewMode.value) {
    guestMessages.value = []
    return
  }
  try {
    const response = await getGuestMessagesByInvitationId(data.value.id)
    guestMessages.value = response.data || response || []
  } catch {
    guestMessages.value = []
  }
}

function initData() {
  rsvp.value.name = data.value.guestName && data.value.guestName !== 'Tamu Undangan' ? data.value.guestName : ''
  galleryImages.value = (data.value.galleryImages || []).map((image) => typeof image === 'string' ? { src: image, thumbnail: image } : image)
  initCountdown()
  loadWishes()
}

async function submitRSVP() {
  if (isPreviewMode.value || !data.value.id) {
    toast.info('Konfirmasi kehadiran tersedia pada undangan yang sudah dipublikasikan.')
    return
  }
  if (!rsvp.value.name.trim()) {
    toast.error('Mohon isi nama Anda.')
    return
  }
  isSubmitting.value = true
  try {
    await createGuestMessage({
      invitationId: data.value.id,
      guestName: rsvp.value.name.trim(),
      message: rsvp.value.message.trim(),
      rsvpStatus: rsvp.value.attendance,
      totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0,
    })
    toast.success('Konfirmasi dan ucapan berhasil dikirim.')
    rsvp.value = { name: data.value.guestName || '', attendance: 'hadir', totalGuests: 1, message: '' }
    await loadWishes()
  } catch (error) {
    console.error(error)
    toast.error('Konfirmasi belum berhasil dikirim. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}

function addToCalendar() {
  const date = new Date(eventDate.value)
  if (Number.isNaN(date.getTime())) return
  const dateValue = date.toISOString().replace(/[-:]|\.\d{3}/g, '')
  const title = `Pernikahan ${data.value.groomName || ''} & ${data.value.brideName || ''}`
  const location = data.value.resepsiLocation?.description || data.value.akadLocation?.description || ''
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dateValue}/${dateValue}&location=${encodeURIComponent(location)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

async function copyToClipboard(value) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(String(value || ''))
    } else {
      const field = document.createElement('textarea')
      field.value = String(value || '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    toast.success('Nomor rekening berhasil disalin.')
  } catch {
    toast.error('Nomor rekening belum bisa disalin.')
  }
}

function timeAgo(value) {
  if (!value) return ''
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  if (Number.isNaN(days) || days < 1) return 'Baru saja'
  if (days < 30) return `${days} hari lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}

watch(() => props.data, (value) => {
  data.value = { ...(value || {}) }
  initData()
}, { deep: true, immediate: true })

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (scrollFrame) cancelAnimationFrame(scrollFrame)
  sectionObserver?.disconnect()
  revealObserver?.disconnect()
})

const SectionHeading = defineComponent({
  props: { kicker: String, title: String },
  setup(componentProps) {
    return () => h('div', { class: 'section-heading text-center' }, [
      h('p', { class: 'eyebrow mb-3' }, componentProps.kicker),
      h('h2', { class: 'font-display text-4xl md:text-6xl' }, componentProps.title),
      h('span', { class: 'heading-flourish mt-5 inline-block', 'aria-hidden': 'true' }, '✳'),
    ])
  },
})

const BotanicalSprig = defineComponent({
  setup(_componentProps, { attrs }) {
    return () => h('svg', {
      ...attrs,
      viewBox: '0 0 180 280',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      'aria-hidden': 'true',
      focusable: 'false',
    }, [
      h('path', { d: 'M13 269C49 219 45 170 78 119C100 84 126 45 163 12', stroke: 'currentColor', 'stroke-width': '1.5' }),
      h('path', { d: 'M50 201C19 195 7 176 8 158C34 158 49 174 50 201ZM76 153C48 147 35 130 38 111C63 113 77 130 76 153ZM103 106C78 95 71 77 79 60C101 69 110 87 103 106ZM130 61C107 49 103 31 113 16C133 29 138 46 130 61Z', stroke: 'currentColor', 'stroke-width': '1.3' }),
      h('path', { d: 'M54 194C70 175 90 170 107 176C96 195 78 203 54 194ZM82 145C101 126 121 123 138 132C125 150 106 157 82 145ZM111 94C129 75 148 71 164 80C152 98 133 106 111 94Z', stroke: 'currentColor', 'stroke-width': '1.3' }),
      h('circle', { cx: '12', cy: '240', r: '3', fill: 'currentColor' }),
      h('circle', { cx: '165', cy: '12', r: '3', fill: 'currentColor' }),
    ])
  },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Poppins:wght@400;500;600&display=swap');

.garden-editorial {
  --garden-ink: #263b4b;
  --garden-sage: #607986;
  --garden-rose: #c67f91;
  --garden-paper: #f4f6f4;
  font-family: 'Poppins', sans-serif;
  color: var(--garden-ink);
}

.garden-editorial .font-display,
.garden-editorial .hero-names,
.garden-editorial .cover-names,
.garden-editorial .quote-copy {
  font-family: 'Lora', Georgia, serif;
  font-weight: 400;
}

.cover-screen { isolation: isolate; background: #e8f1f4; }
.cover-paper { z-index: -5; background: linear-gradient(180deg,#e5f0f6,#f8f7f0 70%,#dfebed); }
.cover-layer { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.cover-layer-background { z-index: -4; object-fit: cover; opacity: .86; }
.cover-layer-vines { z-index: -3; object-fit: fill; opacity: .92; }
.cover-layer-flowers { z-index: -2; object-fit: fill; opacity: .68; }
.cover-layer-garden { z-index: -2; object-fit: fill; opacity: .9; }
.cover-grain { z-index: -1; opacity: .09; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E"); }
.cover-frame { z-index: 0; border: 1px solid rgba(38,59,75,.25); border-radius: 2rem 2rem 8rem 8rem; }
.hero-sprig, .section-sprig, .closing-sprig { color: #647f8b; opacity: .58; pointer-events: none; }
.monogram-sprig { color: #314a5b; opacity: .9; }
.cover-kicker { color: #263b4b; }
.cover-monogram { color: #263b4b; font-family: 'Lora', Georgia, serif; letter-spacing: .08em; }
.cover-names, .hero-names, .garden-editorial h2, .garden-editorial h3 { color: #263b4b; }
.cover-ampersand, .hero-ampersand { color: var(--garden-rose); font-style: italic; }
.cover-couple { filter: drop-shadow(0 5px 8px rgba(34,55,70,.14)); }
.cover-photo { box-shadow: 0 18px 50px rgba(49,62,51,.13); }
.cover-photo-placeholder { background: linear-gradient(155deg, #dfe4d9, #f0e7d7 60%, #dbcabe); }
.open-button, .submit-button { background: #263f53; box-shadow: 0 9px 24px rgba(39,57,47,.18); }
.open-button:hover, .submit-button:hover { background: #b97083; }
.eyebrow { color: var(--garden-rose); font-size: .62rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }
.cover-enter-active, .cover-leave-active { transition: opacity .8s ease, transform .8s ease; }
.cover-leave-to { opacity: 0; transform: translateY(-12px); pointer-events: none; }
.invitation-scroll { background: var(--garden-paper); scroll-padding-top: 1rem; }
.garden-nav { border: 1px solid rgba(38,59,75,.2); background: rgba(247,250,250,.94); backdrop-filter: blur(16px); }
.nav-item { color: #607986; }
.nav-item.is-active { background: #263f53; color: #fff; }
.hero-section { background: #e3edf2; }
.hero-wash { background: linear-gradient(180deg,rgba(232,242,247,.35),rgba(245,247,243,.6) 72%,rgba(236,238,231,.82)); }
.hero-layer { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.hero-layer-background { object-fit:cover; opacity:.3; }
.hero-layer-vines { object-fit:fill; opacity:.6; }
.hero-layer-garden { object-fit:fill; opacity:.45; }
.hero-ring { border-color: rgba(38,59,75,.24); }
.hero-portrait { box-shadow: 0 18px 45px rgba(49,62,51,.12); }
.countdown-cell { border: 1px solid rgba(38,59,75,.18); background: rgba(255,255,255,.72); color: #263f53; }
.scroll-cue span { animation: garden-nudge 1.8s ease-in-out infinite; }
@keyframes garden-nudge { 50% { transform: translateY(4px); } }
.cinematic-sequence { height: 220vh; height: 220svh; }
.cinematic-stage { height: 100vh; height: 100svh; }
.hero-layer-background, .hero-layer-vines, .hero-layer-garden, .hero-sprig, .hero-ring, .hero-copy, .hero-portrait { will-change: transform, opacity; }
.garden-editorial.motion-ready .scroll-reveal,
.garden-editorial.motion-ready .couple-card,
.garden-editorial.motion-ready .story-card,
.garden-editorial.motion-ready .event-card {
  opacity: 0;
  transform: translateY(1.75rem);
  transition: opacity .75s ease, transform .85s cubic-bezier(.2,.65,.25,1);
}
.garden-editorial.motion-ready .couple-card-groom { transform: translateX(-2.5rem); }
.garden-editorial.motion-ready .couple-card-bride { transform: translateX(2.5rem); }
.garden-editorial.motion-ready .reveal-visible { opacity: 1; transform: translate3d(0,0,0); }
.garden-editorial.motion-ready .couple-card-groom.reveal-visible,
.garden-editorial.motion-ready .couple-card-bride.reveal-visible { transform: translate3d(0,0,0); }
.quote-section { background: linear-gradient(180deg,#d9eaf4,#edf3f2); }
.quote-copy { color: #263b4b; }
.couple-section { background: #f7f8f5; }
.couple-photo { box-shadow: 0 14px 36px rgba(39,57,47,.1); }
.story-section { background: #e9f0f2; }
.story-list::before { position:absolute; left:5px; top:4px; bottom:4px; width:1px; background:#c5d1d4; content:''; }
.story-dot { border: 2px solid #f4f6f4; background: #c67f91; box-shadow: 0 0 0 1px #c67f91; }
.event-section { background: #f7f8f5; }
.event-card { border: 1px solid #d1dce0; background: linear-gradient(135deg,#fff,#eef3f3); box-shadow: 0 12px 30px rgba(39,57,47,.06); }
.event-number { color: rgba(96,121,134,.12); font-family: Georgia,serif; }
.map-link, .calendar-button { border: 1px solid #607986; color: #263f53; transition: .2s ease; }
.map-link:hover, .calendar-button:hover { background: #263f53; color: white; }
.dress-code-card { border: 1px solid #d1dce0; background: #eaf0ef; }
.dress-swatches span { width: 2rem; height: 2rem; border-radius: 9999px; border: 1px solid rgba(39,57,47,.12); }
.dress-swatches span:nth-child(1) { background:#d7d7c8; }
.dress-swatches span:nth-child(2) { background:#aebdc5; }
.dress-swatches span:nth-child(3) { background:#d9959c; }
.dress-swatches span:nth-child(4) { background:#f1e8d4; }
.gallery-section { background: #e9f0f2; }
.rsvp-section { background: #f4f6f4; }
.rsvp-card { border: 1px solid #d1dce0; background: #fff; }
.form-label { color: #4f6674; font-size: .75rem; font-weight: 600; }
.form-control { width: 100%; border: 1px solid #d1dce0; border-radius: .9rem; background: #f5f8f8; padding: .8rem 1rem; color: #263b4b; font: inherit; font-size: .875rem; outline: none; transition: border-color .2s, box-shadow .2s; }
.form-control:focus { border-color: #607986; box-shadow: 0 0 0 3px rgba(96,121,134,.14); }
.attendance-option { border: 1px solid #d1dce0; color:#607986; cursor:pointer; }
.attendance-option.selected { border-color:#263f53; background:#263f53; color:white; }
.wish-card { background:#f2f6f5; }
.gift-section { background:#e9f0f2; }
.gift-card { border:1px solid #d1dce0; background:#fff; }
.closing-section { background:linear-gradient(160deg,#e1edf2,#f4f6f4 62%,#e9e6df); }
.ornament-divider, .heading-flourish { color:#c67f91; }
.closing-sprig { opacity:.43; }
@media (prefers-reduced-motion: reduce) {
  .cinematic-sequence { height: 100vh !important; height: 100svh !important; }
  .cinematic-stage { position: relative !important; }
  .hero-layer-background, .hero-layer-vines, .hero-layer-garden, .hero-sprig, .hero-copy, .hero-portrait, .scroll-cue { transform: none !important; translate: none !important; rotate: none !important; scale: 1 !important; opacity: 1 !important; }
  .hero-ring { rotate: none !important; scale: 1 !important; opacity: 1 !important; }
  .garden-editorial.motion-ready .scroll-reveal,
  .garden-editorial.motion-ready .couple-card,
  .garden-editorial.motion-ready .story-card,
  .garden-editorial.motion-ready .event-card { opacity: 1 !important; transform: none !important; }
  .garden-editorial *, .garden-editorial *::before, .garden-editorial *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
}
</style>
