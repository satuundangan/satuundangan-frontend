<template>
  <div class="relative min-h-screen bg-[#f5f5f0] overflow-hidden font-sans text-[#4a4a4a] selection:bg-[#8b9d83] selection:text-white">
    <!-- Texture Overlay -->
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper.png');"></div>

    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" class="z-[55]" />

    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full flex items-center justify-center gap-8 shadow-lg shadow-[#8b9d83]/10 w-fit max-w-[95%] border border-[#8b9d83]/20 transition-all duration-1000">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1.5 transition-all duration-500"
        :class="activeSection === item.id ? 'text-[#8b9d83] scale-110' : 'text-[#a3a3a3] hover:text-[#8b9d83]'">
        <i :class="[item.icon, 'text-lg']"></i>
        <span class="text-[8px] font-medium uppercase tracking-[0.2em]">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="slow-fade">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#f5f5f0] transition-all duration-[1.5s] ease-in-out">
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper.png');"></div>
        <div class="relative z-10 space-y-16 w-full max-w-lg animate-fade-in-slow">
          <div class="w-px h-24 bg-[#8b9d83] mx-auto opacity-50"></div>
          <div class="space-y-6">
            <h1 class="text-[10px] tracking-[0.4em] uppercase font-light text-[#8b9d83]">{{ data.guestName ? 'Untuk ' + data.guestName : 'Undangan Pernikahan' }}</h1>
            <div class="space-y-4">
              <h2 class="text-5xl md:text-7xl font-serif text-[#333333] font-light">{{ data.groomName }}</h2>
              <div class="w-12 h-px bg-[#8b9d83]/30 mx-auto"></div>
              <h2 class="text-5xl md:text-7xl font-serif text-[#333333] font-light">{{ data.brideName }}</h2>
            </div>
          </div>
          <button @click="openInvitation" class="px-8 py-3 bg-transparent border border-[#8b9d83] text-[#8b9d83] font-medium hover:bg-[#8b9d83] hover:text-white transition-all duration-700 text-[10px] uppercase tracking-[0.3em] rounded-sm">
            Buka Undangan
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-[1.5s] h-screen overflow-y-auto scroll-smooth">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 relative py-20">
        <div class="w-full max-w-5xl flex flex-col md:flex-row items-center gap-16" v-observe>
          <div class="w-full md:w-1/2 relative group">
            <div class="absolute -inset-4 bg-[#8b9d83]/10 rotate-[-3deg] rounded-tl-[100px] rounded-br-[100px] transition-transform duration-[2s] group-hover:rotate-0"></div>
            <div class="aspect-[3/4] overflow-hidden rounded-tl-[80px] rounded-br-[80px] shadow-2xl relative z-10 bg-[#e8e8e3]">
              <img :src="data.photoCoupleUrl || 'https://via.placeholder.com/600x800'" class="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[3s] sepia-[0.3]" />
            </div>
          </div>
          <div class="w-full md:w-1/2 space-y-12 text-center md:text-left">
            <div class="space-y-6">
              <h1 class="text-6xl md:text-8xl font-serif font-light text-[#333333] leading-tight">
                {{ data.groomName }} <br><span class="text-3xl md:text-5xl italic text-[#8b9d83]">&</span><br> {{ data.brideName }}
              </h1>
              <p class="text-xs font-light uppercase tracking-[0.3em] text-[#7a7a7a]">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</p>
            </div>
            <div class="w-24 h-px bg-[#8b9d83] mx-auto md:mx-0"></div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6 bg-[#eaeaea] relative" v-observe>
        <div class="w-px h-32 bg-[#8b9d83]/30 absolute top-0 left-1/2 -translate-x-1/2"></div>
        <div class="max-w-3xl mx-auto text-center space-y-12 relative z-10 pt-16">
          <i class="fa-solid fa-leaf text-[#8b9d83] text-2xl opacity-50"></i>
          <p class="text-xl md:text-3xl font-serif leading-relaxed font-light text-[#4a4a4a]">"{{ data.quoteText }}"</p>
          <p class="text-[10px] uppercase tracking-[0.4em] text-[#8b9d83]">— {{ data.quoteSource }}</p>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-32 px-6 bg-[#f5f5f0]">
        <div class="max-w-4xl mx-auto space-y-20">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-sm uppercase tracking-[0.5em] text-[#8b9d83]">Cerita Kita</h2>
            <div class="w-12 h-px bg-[#8b9d83] mx-auto"></div>
          </div>

          <div class="relative border-l border-[#8b9d83]/30 ml-4 md:ml-auto md:mr-auto space-y-16 pl-8">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="relative" v-observe>
              <div class="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-[#f5f5f0] border-2 border-[#8b9d83] flex items-center justify-center">
                 <div class="w-1.5 h-1.5 rounded-full bg-[#8b9d83]"></div>
              </div>
              <div class="space-y-4">
                <span class="text-[10px] font-bold text-[#8b9d83] uppercase tracking-widest">{{ story.date }}</span>
                <h3 class="text-2xl font-serif font-light text-[#333333]">{{ story.title }}</h3>
                <p class="text-sm leading-relaxed text-[#7a7a7a] max-w-2xl">{{ story.description }}</p>
                <div v-if="story.image" class="aspect-video max-w-md rounded-2xl overflow-hidden shadow-lg grayscale hover:grayscale-0 transition-all duration-700 mt-6">
                  <img :src="story.image" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6">
        <div class="max-w-6xl mx-auto space-y-32">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-sm uppercase tracking-[0.5em] text-[#8b9d83]">Mempelai</h2>
            <div class="w-12 h-px bg-[#8b9d83] mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-20 items-center" v-observe>
            <div class="order-2 md:order-1 text-center md:text-right space-y-6">
              <h3 class="text-4xl md:text-6xl font-serif font-light text-[#333333]">{{ data.groomName }}</h3>
              <p class="text-xs font-light text-[#7a7a7a] uppercase tracking-[0.2em]">Putra dari<br><span class="font-medium text-[#4a4a4a]">{{ data.parents?.groomParents }}</span></p>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block text-[10px] uppercase tracking-[0.2em] text-[#8b9d83] border-b border-[#8b9d83] pb-1 hover:text-[#333333] transition-colors pt-4"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>
            <div class="order-1 md:order-2 aspect-square rounded-full overflow-hidden border-8 border-white shadow-xl mx-auto max-w-[280px] bg-[#e8e8e3]">
               <img :src="data.groomPhotoUrl" class="w-full h-full object-cover sepia-[0.2]" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-20 items-center" v-observe>
            <div class="aspect-square rounded-full overflow-hidden border-8 border-white shadow-xl mx-auto max-w-[280px] bg-[#e8e8e3]">
               <img :src="data.bridePhotoUrl" class="w-full h-full object-cover sepia-[0.2]" />
            </div>
            <div class="text-center md:text-left space-y-6">
              <h3 class="text-4xl md:text-6xl font-serif font-light text-[#333333]">{{ data.brideName }}</h3>
              <p class="text-xs font-light text-[#7a7a7a] uppercase tracking-[0.2em]">Putri dari<br><span class="font-medium text-[#4a4a4a]">{{ data.parents?.brideParents }}</span></p>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block text-[10px] uppercase tracking-[0.2em] text-[#8b9d83] border-b border-[#8b9d83] pb-1 hover:text-[#333333] transition-colors pt-4"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY (TURUT MENGUNDANG) -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-32 px-6 bg-[#eaeaea]">
        <div class="max-w-4xl mx-auto text-center space-y-12" v-observe>
          <div class="space-y-4">
             <h2 class="text-sm uppercase tracking-[0.5em] text-[#8b9d83]">Turut Mengundang</h2>
             <div class="w-12 h-px bg-[#8b9d83] mx-auto"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#7a7a7a]">
             <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="italic">
                {{ person }}
             </div>
          </div>
        </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 bg-white relative">
        <div class="absolute top-0 right-0 w-64 h-64 bg-[#8b9d83]/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-[#e8e8e3] rounded-full blur-3xl"></div>
        
        <div class="max-w-5xl mx-auto relative z-10">
          <div class="text-center space-y-4 mb-24" v-observe>
            <h2 class="text-sm uppercase tracking-[0.5em] text-[#8b9d83]">Agenda Acara</h2>
            <div class="w-12 h-px bg-[#8b9d83] mx-auto"></div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-12">
            <!-- Akad -->
            <div class="p-10 border border-[#eaeaea] rounded-[40px] text-center space-y-8 hover:shadow-xl hover:border-[#8b9d83]/30 transition-all duration-700 bg-white/50 backdrop-blur-sm" v-observe>
              <div class="w-16 h-16 rounded-full bg-[#f5f5f0] flex items-center justify-center mx-auto text-[#8b9d83]"><i class="fa-solid fa-ring text-2xl"></i></div>
              <h3 class="text-3xl font-serif font-light text-[#333333]">Akad Nikah</h3>
              <div class="space-y-3 text-sm text-[#7a7a7a]">
                <p class="font-medium text-[#4a4a4a]">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                <p>{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                <p class="pt-4 px-4">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="inline-block px-8 py-3 bg-[#f5f5f0] text-[#8b9d83] hover:bg-[#8b9d83] hover:text-white rounded-full text-[10px] uppercase tracking-[0.2em] transition-all">Lihat Lokasi</a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="p-10 border border-[#eaeaea] rounded-[40px] text-center space-y-8 hover:shadow-xl hover:border-[#8b9d83]/30 transition-all duration-700 bg-white/50 backdrop-blur-sm" v-observe>
              <div class="w-16 h-16 rounded-full bg-[#f5f5f0] flex items-center justify-center mx-auto text-[#8b9d83]"><i class="fa-solid fa-champagne-glasses text-2xl"></i></div>
              <h3 class="text-3xl font-serif font-light text-[#333333]">Resepsi</h3>
              <div class="space-y-3 text-sm text-[#7a7a7a]">
                <p class="font-medium text-[#4a4a4a]">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                <p>{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                <p class="pt-4 px-4">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="inline-block px-8 py-3 bg-[#f5f5f0] text-[#8b9d83] hover:bg-[#8b9d83] hover:text-white rounded-full text-[10px] uppercase tracking-[0.2em] transition-all">Lihat Lokasi</a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-20 text-center space-y-6" v-observe>
             <h3 class="text-sm uppercase tracking-[0.3em] text-[#8b9d83]">Dress Code</h3>
             <div class="p-8 bg-[#f5f5f0]/50 rounded-[30px] border border-[#8b9d83]/10 inline-block px-12">
                <i class="fa-solid fa-shirt text-[#8b9d83] text-xl mb-4 block"></i>
                <p class="text-[#4a4a4a] font-light">{{ data.dressCode }}</p>
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="mt-20 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-4 px-12 py-5 bg-[#333333] text-white rounded-full hover:bg-[#8b9d83] transition-all shadow-xl hover:-translate-y-1">
                <i class="fa-solid fa-video animate-pulse"></i>
                <span class="text-xs font-bold uppercase tracking-[0.2em]">Saksikan Live Streaming</span>
             </a>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-32 px-4 bg-[#eaeaea]">
        <div class="max-w-7xl mx-auto space-y-20">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-sm uppercase tracking-[0.5em] text-[#8b9d83]">Galeri</h2>
            <div class="w-12 h-px bg-[#8b9d83] mx-auto"></div>
          </div>
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6">
        <div class="max-w-3xl mx-auto space-y-16">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-sm uppercase tracking-[0.5em] text-[#8b9d83]">Kehadiran</h2>
            <div class="w-12 h-px bg-[#8b9d83] mx-auto"></div>
          </div>

          <form @submit.prevent="submitRSVP" class="bg-white p-8 md:p-12 rounded-[40px] shadow-xl shadow-[#8b9d83]/5 space-y-8" v-observe>
            <div class="space-y-2">
              <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap" class="w-full bg-transparent border-b border-[#eaeaea] py-3 text-sm focus:border-[#8b9d83] outline-none transition-colors" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center justify-center gap-2 py-3 border rounded-xl cursor-pointer transition-all" :class="rsvp.attendance === 'hadir' ? 'border-[#8b9d83] bg-[#f5f5f0] text-[#8b9d83]' : 'border-[#eaeaea] text-[#a3a3a3] hover:border-[#8b9d83]/30'">
                <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"><i class="fa-solid fa-check"></i><span class="text-xs">Hadir</span>
              </label>
              <label class="flex items-center justify-center gap-2 py-3 border rounded-xl cursor-pointer transition-all" :class="rsvp.attendance === 'tidak' ? 'border-red-300 bg-red-50 text-red-500' : 'border-[#eaeaea] text-[#a3a3a3] hover:border-red-300/30'">
                <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"><i class="fa-solid fa-xmark"></i><span class="text-xs">Tidak Hadir</span>
              </label>
            </div>
            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuests" class="w-full bg-transparent border-b border-[#eaeaea] py-3 text-sm focus:border-[#8b9d83] outline-none">
              <option value="" disabled>Jumlah Tamu</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
            </select>
            <textarea v-model="rsvp.message" rows="3" placeholder="Pesan & Doa (Opsional)" class="w-full bg-transparent border-b border-[#eaeaea] py-3 text-sm focus:border-[#8b9d83] outline-none resize-none"></textarea>
            <button type="submit" class="w-full py-4 bg-[#8b9d83] text-white rounded-xl text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#6e7d67] transition-all">Kirim Konfirmasi</button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length" class="py-32 px-6 bg-white text-center">
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-sm uppercase tracking-[0.5em] text-[#8b9d83]">Tanda Kasih</h2>
            <div class="w-12 h-px bg-[#8b9d83] mx-auto"></div>
            <p class="text-xs text-[#7a7a7a] max-w-md mx-auto pt-4 leading-relaxed">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, Anda dapat melalui fitur di bawah ini.</p>
          </div>
          
          <div class="flex flex-wrap justify-center gap-6">
            <div v-for="(bank, idx) in data.bankAccounts" :key="idx" class="p-8 border border-[#eaeaea] rounded-3xl w-full sm:w-[350px] hover:shadow-xl hover:border-[#8b9d83]/20 transition-all duration-500" v-observe>
              <p class="text-sm font-bold text-[#333333] uppercase tracking-wider mb-6">{{ bank.bankName }}</p>
              <p class="text-2xl font-light text-[#4a4a4a] tracking-widest mb-2">{{ bank.accountNumber }}</p>
              <p class="text-xs text-[#7a7a7a] mb-8">a.n {{ bank.accountName }}</p>
              <button @click="copyToClipboard(bank.accountNumber)" class="px-6 py-2 bg-[#f5f5f0] text-[#8b9d83] text-[10px] uppercase tracking-[0.1em] rounded-full hover:bg-[#8b9d83] hover:text-white transition-all"><i class="fa-regular fa-copy mr-2"></i>Salin Nomor</button>
            </div>
          </div>
        </div>
      </section>

      <footer class="py-20 text-center bg-[#eaeaea] space-y-6 pb-32 md:pb-20">
        <h2 class="font-serif text-3xl text-[#333333] font-light">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p class="text-[8px] uppercase tracking-[0.4em] text-[#a3a3a3]">Dibuat dengan SatuUndangan</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { createGuestMessage } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({ data: { type: Object, default: () => ({}) } })
const toast = useToast()
const data = ref(props.data || {})

const activeSections = computed(() => {
  if (data.value.sections && Array.isArray(data.value.sections)) return data.value.sections
  if (data.value.content?.selectedSections && Array.isArray(data.value.content.selectedSections)) {
    return data.value.content.selectedSections.map(s => typeof s === 'string' ? { key: s, is_enabled: true } : s)
  }
  return null
})

const showWelcome = ref(true)
const galleryImages = ref([])
const rsvp = ref({ name: '', attendance: '', totalGuests: 1, message: '' })

const allNavItems = [
  { id: 'home', label: 'Utama', icon: 'fa-solid fa-leaf', key: 'hero' },
  { id: 'couple', label: 'Profil', icon: 'fa-solid fa-user', key: 'couple' },
  { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar', key: 'event' },
  { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-image', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' }
]

const navItems = computed(() => {
  if (!activeSections.value) return allNavItems
  return allNavItems.filter(item => {
    const s = activeSections.value.find(s => s.key === item.key)
    return s ? (s.is_enabled !== false) : true
  })
})

const isSectionEnabled = (key) => {
  if (!activeSections.value) return true
  const section = activeSections.value.find(s => s.key === key)
  return section ? (section.is_enabled !== false) : true
}

const activeSection = ref('home')

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-[1.5s]', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-8')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.15 })
    observer.observe(el)
  }
}

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    const content = document.getElementById('main-content')
    if (content) content.classList.remove('opacity-0')
    initScrollSpy()
  }, 100)
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activeSection.value = e.target.id })
  }, { threshold: 0.5 })
  navItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:')) return choice
  if (choice.includes('/') || choice.includes('http')) return choice
  return '/audio/wedding-acoustic-morning.mp3'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatInstagramUrl(handle) { return `https://instagram.com/${handle.replace('@', '')}` }
function copyToClipboard(text) { navigator.clipboard.writeText(text); toast.success('Nomor Rekening Disalin') }

function initData() {
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) return toast.error("Lengkapi data yang dibutuhkan")
  try {
    await createGuestMessage({
      invitationId: data.value.id, guestName: rsvp.value.name, message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance, totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0
    })
    toast.success("Terima kasih atas konfirmasinya")
  } catch (err) {
    console.error(err)
    toast.error("Gagal mengirim RSVP.")
  }
}

onMounted(() => { initData() })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
.font-serif { font-family: 'Cormorant Garamond', serif; }
.font-sans { font-family: 'Montserrat', sans-serif; }
.slow-fade-enter-active, .slow-fade-leave-active { transition: opacity 1.5s ease; }
.slow-fade-enter-from, .slow-fade-leave-to { opacity: 0; }
.animate-fade-in-slow { animation: fadeIn 2s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f5f5f0; }
::-webkit-scrollbar-thumb { background: #8b9d83; border-radius: 10px; }
</style>
style>
