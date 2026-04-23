<template>
  <div class="relative min-h-screen bg-[#0a0a0a] overflow-hidden font-sans text-[#e5e5e5] selection:bg-white selection:text-black">
    <!-- Noise Overlay -->
    <div class="fixed inset-0 opacity-[0.05] pointer-events-none mix-blend-screen z-[100]" style="background-image: url('https://www.transparenttextures.com/patterns/black-paper.png');"></div>

    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" class="z-[55]" />

    <nav v-if="!showWelcome" class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 transition-all duration-1000 hidden md:flex">
      <button v-for="(item, idx) in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="group relative flex items-center justify-end w-32"
        :class="activeSection === item.id ? 'text-white' : 'text-[#404040] hover:text-white'">
        <span class="text-[8px] font-bold uppercase tracking-widest mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="{ 'opacity-100': activeSection === item.id }">{{ item.label }}</span>
        <div class="w-1.5 h-1.5 rounded-full bg-current transition-all duration-300" :class="activeSection === item.id ? 'scale-[2]' : 'scale-100'"></div>
      </button>
    </nav>
    
    <!-- Mobile Nav -->
    <nav v-if="!showWelcome" class="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10 flex justify-around py-4 px-6 md:hidden transition-all duration-1000">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300"
        :class="activeSection === item.id ? 'text-white' : 'text-[#404040]'">
        <i :class="[item.icon, 'text-sm']"></i>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade-slow">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#0a0a0a] text-white">
        <div class="relative z-10 space-y-16 w-full max-w-lg">
          <div class="space-y-4">
            <p class="text-[8px] uppercase tracking-[0.8em] text-[#808080]">A Cinematic Wedding</p>
            <div class="overflow-hidden">
              <h2 class="text-5xl md:text-8xl font-serif font-bold uppercase leading-none tracking-tighter animate-slide-up" style="animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards;">{{ data.groomName }}</h2>
            </div>
            <div class="overflow-hidden">
              <h2 class="text-5xl md:text-8xl font-serif font-bold uppercase leading-none tracking-tighter animate-slide-up" style="animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards;">{{ data.brideName }}</h2>
            </div>
          </div>

          <div class="space-y-8 animate-fade-in" style="animation-delay: 1s; opacity: 0; animation-fill-mode: forwards;">
            <div class="space-y-2">
               <p class="text-[8px] uppercase tracking-[0.5em] text-[#808080]">Guest of Honor</p>
               <p class="text-xl font-serif uppercase tracking-widest">{{ data.guestName ? data.guestName : 'Invited Guest' }}</p>
            </div>
            <button @click="openInvitation" class="px-10 py-4 bg-white text-black font-bold text-[8px] uppercase tracking-[0.4em] hover:bg-gray-200 transition-colors">
              Play Film
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto scroll-smooth pb-20 md:pb-0">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen relative flex items-end px-6 md:px-20 pb-32">
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10"></div>
          <img :src="data.photoCoupleUrl || 'https://via.placeholder.com/1920x1080'" class="w-full h-full object-cover grayscale-[80%] contrast-125" />
        </div>
        
        <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10" v-observe>
          <div class="space-y-4">
            <h1 class="text-6xl md:text-[8rem] font-serif font-bold uppercase leading-[0.85] tracking-tighter">
              {{ data.groomName }} <br> <span class="text-4xl md:text-7xl text-[#808080] italic">&</span> <br> {{ data.brideName }}
            </h1>
          </div>
          <div class="text-left md:text-right space-y-2">
            <p class="text-sm font-bold uppercase tracking-[0.4em]">{{ formatDate(data.akadLocation?.dateTime) }}</p>
            <p class="text-[10px] text-[#808080] uppercase tracking-widest">Directed by Destiny</p>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-12">
          <p class="text-2xl md:text-5xl font-serif leading-tight">"{{ data.quoteText }}"</p>
          <div class="w-12 h-px bg-white/20 mx-auto"></div>
          <p class="text-[10px] font-bold uppercase tracking-[0.5em] text-[#808080]">{{ data.quoteSource }}</p>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-32 px-6 border-y border-white/5 bg-[#050505]">
        <div class="max-w-7xl mx-auto space-y-24">
          <div class="text-center" v-observe>
            <p class="text-[8px] uppercase tracking-[0.8em] text-[#808080] mb-4">The Narrative</p>
            <h2 class="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tighter">Our Story</h2>
          </div>

          <div class="relative">
            <div class="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2"></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div v-for="(story, idx) in data.loveStory.slice(0, 3)" :key="idx" class="space-y-8 bg-[#0a0a0a] p-8 border border-white/5 group hover:border-white/20 transition-all duration-700" v-observe>
                <div class="space-y-2">
                  <span class="text-[8px] font-bold text-[#808080] uppercase tracking-widest">{{ story.date }}</span>
                  <h3 class="text-2xl font-serif font-bold uppercase tracking-tight text-white group-hover:text-[#808080] transition-colors">{{ story.title }}</h3>
                </div>
                <div v-if="story.image" class="aspect-[4/3] overflow-hidden grayscale contrast-125">
                   <img :src="story.image" class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                </div>
                <p class="text-xs leading-relaxed text-gray-500">{{ story.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CAST -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6 border-t border-white/10">
        <div class="max-w-7xl mx-auto space-y-32">
          <div class="text-center" v-observe>
            <h2 class="text-[10px] font-bold uppercase tracking-[0.8em] text-[#808080]">Starring Cast</h2>
          </div>

          <div class="grid md:grid-cols-2 gap-0 md:gap-20 items-center group" v-observe>
            <div class="order-2 md:order-1 p-10 md:p-0 space-y-6 text-center md:text-right transition-all duration-700 md:group-hover:-translate-x-4">
              <span class="text-[8px] uppercase tracking-[0.5em] text-[#808080]">Leading Man</span>
              <h3 class="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tighter">{{ data.groomName }}</h3>
              <p class="text-[10px] uppercase tracking-widest text-[#666666]">Son of <br><span class="text-white">{{ data.parents?.groomParents }}</span></p>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block mt-4 text-[10px] uppercase tracking-widest hover:text-white text-[#808080] transition-colors border-b border-[#808080] pb-1">@{{ data.socialMediaGroom.instagram }}</a>
            </div>
            <div class="order-1 md:order-2 overflow-hidden aspect-[3/4] md:aspect-square w-full transition-all duration-700 md:group-hover:translate-x-4">
               <img :src="data.groomPhotoUrl" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-0 md:gap-20 items-center group" v-observe>
            <div class="overflow-hidden aspect-[3/4] md:aspect-square w-full transition-all duration-700 md:group-hover:-translate-x-4">
               <img :src="data.bridePhotoUrl" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" />
            </div>
            <div class="p-10 md:p-0 space-y-6 text-center md:text-left transition-all duration-700 md:group-hover:translate-x-4">
              <span class="text-[8px] uppercase tracking-[0.5em] text-[#808080]">Leading Lady</span>
              <h3 class="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tighter">{{ data.brideName }}</h3>
              <p class="text-[10px] uppercase tracking-widest text-[#666666]">Daughter of <br><span class="text-white">{{ data.parents?.brideParents }}</span></p>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block mt-4 text-[10px] uppercase tracking-widest hover:text-white text-[#808080] transition-colors border-b border-[#808080] pb-1">@{{ data.socialMediaBrides.instagram }}</a>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-32 px-6 bg-white text-black">
        <div class="max-w-4xl mx-auto space-y-16" v-observe>
           <div class="text-center space-y-4">
              <p class="text-[8px] uppercase tracking-[0.8em] text-gray-400 font-bold">In Appreciation</p>
              <h2 class="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tighter">Family & Honors</h2>
           </div>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 text-center border-y border-gray-100 py-16">
              <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="text-sm font-serif uppercase tracking-widest font-bold">
                 {{ person }}
              </div>
           </div>
        </div>
      </section>

      <!-- EVENTS (SHOWTIMES) -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 border-t border-white/10 bg-[#050505]">
        <div class="max-w-6xl mx-auto grid md:grid-cols-12 gap-16 md:gap-20">
          <div class="md:col-span-4" v-observe>
            <div class="sticky top-20 space-y-6 text-center md:text-left">
              <p class="text-[8px] uppercase tracking-[0.8em] text-[#808080]">Schedule</p>
              <h2 class="text-5xl md:text-7xl font-serif font-bold uppercase leading-none tracking-tighter">Show<br>Times</h2>
            </div>
          </div>
          
          <div class="md:col-span-8 space-y-12">
            <!-- Akad -->
            <div class="group border border-white/10 p-8 md:p-12 hover:bg-white hover:text-black transition-all duration-500" v-observe>
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                <div class="space-y-2">
                  <span class="text-[8px] uppercase tracking-[0.5em] text-[#808080] group-hover:text-gray-500 transition-colors">Act I</span>
                  <h3 class="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tighter">Akad Nikah</h3>
                </div>
                <div class="text-left md:text-right">
                  <p class="text-xl font-bold uppercase tracking-widest">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                  <p class="text-sm font-bold text-[#808080] group-hover:text-gray-600">{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                </div>
              </div>
              <div class="space-y-8">
                <p class="text-sm leading-relaxed text-[#a3a3a3] group-hover:text-gray-800">{{ data.akadLocation?.description }}</p>
                <a :href="data.akadLocation?.mapUrl" target="_blank" class="inline-block px-8 py-4 border border-current text-[8px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white group-hover:hover:bg-black group-hover:hover:text-white group-hover:border-black transition-all">
                  Get Directions
                </a>
              </div>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="group border border-white/10 p-8 md:p-12 hover:bg-white hover:text-black transition-all duration-500" v-observe>
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                <div class="space-y-2">
                  <span class="text-[8px] uppercase tracking-[0.5em] text-[#808080] group-hover:text-gray-500 transition-colors">Act II</span>
                  <h3 class="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tighter">Reception</h3>
                </div>
                <div class="text-left md:text-right">
                  <p class="text-xl font-bold uppercase tracking-widest">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                  <p class="text-sm font-bold text-[#808080] group-hover:text-gray-600">{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                </div>
              </div>
              <div class="space-y-8">
                <p class="text-sm leading-relaxed text-[#a3a3a3] group-hover:text-gray-800">{{ data.resepsiLocation?.description }}</p>
                <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="inline-block px-8 py-4 border border-current text-[8px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white group-hover:hover:bg-black group-hover:hover:text-white group-hover:border-black transition-all">
                  Get Directions
                </a>
              </div>
            </div>

            <!-- DRESS CODE -->
            <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="border border-white/10 p-8 md:p-12 space-y-6 text-center" v-observe>
               <p class="text-[8px] uppercase tracking-[0.5em] text-[#808080]">Costume Design</p>
               <h3 class="text-2xl font-serif font-bold uppercase tracking-widest">Dress Code</h3>
               <div class="w-10 h-px bg-[#808080] mx-auto"></div>
               <p class="text-sm uppercase tracking-[0.2em] font-bold text-white">{{ data.dressCode }}</p>
            </div>

            <!-- LIVE STREAMING -->
            <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="bg-white p-8 md:p-12 text-black text-center space-y-8" v-observe>
               <p class="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-bold">Virtual Access</p>
               <h3 class="text-3xl font-serif font-bold uppercase tracking-tighter">Join Premiere</h3>
               <a :href="data.liveStreamingUrl" target="_blank" class="inline-block px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#333333] transition-all">
                  Watch Live Now
               </a>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-32 px-4 border-t border-white/10">
        <div class="max-w-7xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <p class="text-[8px] uppercase tracking-[0.8em] text-[#808080] mb-4">Behind The Scenes</p>
            <h2 class="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tighter">Stills</h2>
          </div>
          <div class="grayscale hover:grayscale-0 transition-all duration-1000">
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6 border-t border-white/10 bg-white text-black">
        <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div class="space-y-8 text-center md:text-left" v-observe>
            <p class="text-[8px] uppercase tracking-[0.8em] text-gray-500">Box Office</p>
            <h2 class="text-5xl md:text-7xl font-serif font-bold uppercase leading-none tracking-tighter">Reserve <br>Tickets</h2>
            <p class="text-xs uppercase tracking-widest text-gray-600 font-bold">Please confirm your attendance</p>
          </div>

          <form @submit.prevent="submitRSVP" class="space-y-8" v-observe>
            <div class="space-y-2">
              <label class="text-[8px] uppercase tracking-[0.4em] font-bold text-gray-500">Full Name</label>
              <input v-model="rsvp.name" type="text" class="w-full bg-transparent border-b-2 border-black py-2 text-xl focus:outline-none font-bold uppercase" required />
            </div>
            
            <div class="space-y-4">
               <label class="text-[8px] uppercase tracking-[0.4em] font-bold text-gray-500">Attendance</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-3 border-2 border-black text-center cursor-pointer transition-all font-bold uppercase tracking-widest text-[10px]" :class="rsvp.attendance === 'hadir' ? 'bg-black text-white' : 'hover:bg-gray-100'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Accept
                 </label>
                 <label class="flex-1 py-3 border-2 border-black text-center cursor-pointer transition-all font-bold uppercase tracking-widest text-[10px]" :class="rsvp.attendance === 'tidak' ? 'bg-black text-white' : 'hover:bg-gray-100'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Decline
                 </label>
               </div>
            </div>

            <div v-if="rsvp.attendance === 'hadir'" class="space-y-2">
              <label class="text-[8px] uppercase tracking-[0.4em] font-bold text-gray-500">Guests</label>
              <select v-model="rsvp.totalGuest" class="w-full bg-transparent border-b-2 border-black py-2 text-sm font-bold focus:outline-none uppercase">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} Seat(s)</option>
              </select>
            </div>

            <div class="space-y-2">
               <label class="text-[8px] uppercase tracking-[0.4em] font-bold text-gray-500">Message</label>
               <textarea v-model="rsvp.message" rows="2" class="w-full bg-transparent border-b-2 border-black py-2 text-sm focus:outline-none resize-none font-medium"></textarea>
            </div>

            <button type="submit" class="w-full py-5 bg-black text-white text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-gray-800 transition-colors">Confirm Reservation</button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length" class="py-32 px-6 text-center border-t border-white/10">
        <div class="max-w-5xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <p class="text-[8px] uppercase tracking-[0.8em] text-[#808080] mb-4">Registry</p>
            <h2 class="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tighter">Gifts</h2>
          </div>
          
          <div class="flex flex-wrap justify-center gap-8">
            <div v-for="(bank, idx) in data.bankAccounts" :key="idx" class="p-10 border border-white/10 bg-[#0a0a0a] w-full sm:w-[400px] text-left hover:border-white/30 transition-colors" v-observe>
              <div class="flex justify-between items-center mb-10">
                 <p class="text-xl font-bold uppercase tracking-widest text-[#808080]">{{ bank.bankName }}</p>
                 <i class="fa-solid fa-building-columns text-2xl text-white"></i>
              </div>
              <p class="text-3xl font-serif font-bold tracking-tighter mb-2 text-white">{{ bank.accountNumber }}</p>
              <p class="text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-10">{{ bank.accountName }}</p>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full py-4 border border-white/20 text-white text-[8px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black transition-colors">Copy Details</button>
            </div>
          </div>
        </div>
      </section>

      <footer class="py-32 text-center border-t border-white/10 space-y-8">
        <h2 class="font-serif text-5xl md:text-8xl font-bold uppercase tracking-tighter">{{ data.groomName }} & {{ data.brideName }}</h2>
        <div class="space-y-2">
          <p class="text-[8px] uppercase tracking-[0.8em] font-bold text-[#808080]">The End</p>
          <p class="text-[8px] uppercase tracking-widest text-[#404040]">Directed by SatuUndangan</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
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
const rsvp = ref({ name: '', attendance: '', totalGuest: 1, message: '' })

const allNavItems = [
  { id: 'home', label: 'Intro', icon: 'fa-solid fa-play', key: 'hero' },
  { id: 'couple', label: 'Cast', icon: 'fa-solid fa-users', key: 'couple' },
  { id: 'event', label: 'Show', icon: 'fa-solid fa-ticket', key: 'event' },
  { id: 'gallery', label: 'Stills', icon: 'fa-solid fa-film', key: 'gallery' },
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
    el.classList.add('opacity-0', 'translate-y-12', 'transition-all', 'duration-1000', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-12')
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
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}
function formatTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatInstagramUrl(handle) { return `https://instagram.com/${handle.replace('@', '')}` }
function copyToClipboard(text) { navigator.clipboard.writeText(text); toast.success('Details Copied') }

function initData() {
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) return toast.error("Action Required")
  try {
    await createGuestMessage({
      invitationId: data.value.id, guestName: rsvp.value.name, message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance, totalGuest: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuest) : 0
    })
    toast.success("Reservation Confirmed")
    rsvp.value = { name: '', attendance: '', totalGuest: 1, message: '' }
  } catch (err) { toast.error("Transmission Failed") }
}

onMounted(() => { initData() })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;700;900&display=swap');
.font-serif { font-family: 'Cinzel', serif; }
.font-sans { font-family: 'Inter', sans-serif; }

.fade-slow-enter-active, .fade-slow-leave-active { transition: opacity 1.5s ease; }
.fade-slow-enter-from, .fade-slow-leave-to { opacity: 0; }

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in { animation: fadeIn 1.5s ease; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #404040; }
</style>
