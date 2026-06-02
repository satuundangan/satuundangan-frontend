<template>
  <div class="relative min-h-screen bg-[#050b1a] overflow-hidden font-sans no-scrollbar text-[#d1d5db] selection:bg-[#f3ca40]/30">
    
    <!-- Starry Background (CSS Animated) -->
    <div class="fixed inset-0 z-0 pointer-events-none">
       <div v-for="n in 50" :key="n" class="star" :style="getStarStyle(n)"></div>
    </div>

    <!-- Glowing Nebula Ornaments -->
    <div class="fixed top-[-20%] -left-[-10%] w-[600px] h-[600px] z-0 opacity-20 pointer-events-none rounded-full blur-[120px] bg-blue-900/50 animate-pulse"></div>
    <div class="fixed bottom-[-20%] -right-[-10%] w-[600px] h-[600px] z-0 opacity-20 pointer-events-none rounded-full blur-[120px] bg-indigo-900/50 animate-pulse"></div>

    <!-- Music Control -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" />

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0a192f]/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-center gap-8 shadow-2xl w-fit max-w-[90%] md:hidden transition-all duration-500">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300 relative group"
        :class="activeSection === item.id ? 'text-[#f3ca40] scale-110' : 'text-gray-500 hover:text-[#f3ca40]'">
        <i :class="[item.icon, 'text-lg']"></i>
        <span class="text-[7px] font-bold uppercase tracking-widest">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade">
      <div v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#050b1a] transition-all duration-1000">
        
        <div class="relative z-10 space-y-12 animate-fade-in-up">
          <div class="space-y-6">
            <div class="inline-flex items-center justify-center w-12 h-12 border border-[#f3ca40]/50 rounded-full mb-4 animate-spin-slow">
               <i class="fa-solid fa-moon text-[#f3ca40]"></i>
            </div>
            <h1 class="text-[10px] md:text-xs tracking-[0.8em] uppercase text-gray-400 font-medium">Under the Stars, Two Hearts as One</h1>
            <div class="space-y-4">
              <h2 class="text-6xl md:text-8xl font-cormorant font-bold text-white drop-shadow-[0_0_15px_rgba(243,202,64,0.4)]">{{ data.groomName }}</h2>
              <div class="flex items-center justify-center gap-4">
                 <div class="w-12 h-px bg-white/10"></div>
                 <span class="text-2xl italic font-cormorant text-[#f3ca40]">and</span>
                 <div class="w-12 h-px bg-white/10"></div>
              </div>
              <h2 class="text-6xl md:text-8xl font-cormorant font-bold text-white drop-shadow-[0_0_15px_rgba(243,202,64,0.4)]">{{ data.brideName }}</h2>
            </div>
          </div>

          <div class="max-w-xs mx-auto space-y-8">
            <div class="space-y-1">
               <p class="text-[10px] uppercase tracking-widest text-gray-500">Dedicated To</p>
               <p class="text-2xl font-cormorant font-bold text-white">{{ data.guestName }}</p>
            </div>
            <button @click="openInvitation"
              class="w-full py-4 bg-gradient-to-r from-[#f3ca40] to-[#e6b033] text-[#050b1a] font-black rounded-full transition-all hover:scale-105 shadow-[0_0_25px_rgba(243,202,64,0.3)] flex items-center justify-center gap-3 text-xs uppercase tracking-widest group">
              Step Into Our Dream
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div class="space-y-8 max-w-2xl mx-auto" v-observe>
          <span class="inline-block py-1 px-6 rounded-full border border-white/10 bg-white/5 text-[9px] uppercase tracking-[0.5em] text-[#f3ca40] font-bold">You are invited to witness</span>
          <h1 class="text-5xl md:text-9xl font-cormorant font-bold leading-tight text-white">
            {{ data.groomName }} <br> <span class="text-3xl italic text-[#f3ca40]">&</span> <br> {{ data.brideName }}
          </h1>
          <p class="text-sm md:text-xl text-gray-400 font-light tracking-[0.4em] uppercase">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="flex justify-center gap-4 md:gap-12 mt-16">
            <div v-for="(val, label) in countdown" :key="label" class="flex flex-col items-center w-16 md:w-24">
              <div class="text-3xl md:text-6xl font-cormorant text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{{ val }}</div>
              <div class="text-[8px] uppercase tracking-widest text-[#f3ca40] font-bold mt-2">{{ label }}</div>
            </div>
          </div>
        </div>
        
        <div class="absolute bottom-10 animate-bounce text-white/20">
          <i class="fa-solid fa-chevron-down text-xl"></i>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6" v-observe>
        <div class="max-w-3xl mx-auto text-center relative">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#f3ca40] opacity-10 text-9xl font-serif italic">"</div>
          <p class="text-xl md:text-3xl text-white italic leading-relaxed font-cormorant mb-10 px-4 relative z-10">
            "{{ data.quoteText }}"
          </p>
          <p class="text-xs font-bold text-[#f3ca40] tracking-[0.5em] uppercase">{{ data.quoteSource }}</p>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-32 px-6 bg-white/[0.01]">
        <div class="max-w-4xl mx-auto space-y-24">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-4xl md:text-7xl font-cormorant font-bold text-white">Our Journey</h2>
            <div class="w-16 h-px bg-[#f3ca40]/50 mx-auto"></div>
          </div>

          <div class="space-y-20 relative before:absolute before:left-0 md:before:left-1/2 before:top-0 before:h-full before:w-px before:bg-white/10 ml-4 md:ml-0">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="relative pl-10 md:pl-0" v-observe>
               <div class="absolute left-[-5px] md:left-1/2 md:translate-x-[-50%] top-0 w-2.5 h-2.5 rounded-full bg-[#f3ca40] shadow-[0_0_10px_#f3ca40]"></div>
               <div class="grid md:grid-cols-2 gap-8 md:gap-24 items-center">
                  <div :class="idx % 2 === 0 ? 'md:text-right' : 'md:order-last text-left'">
                     <span class="text-[10px] font-bold text-[#f3ca40] uppercase tracking-[0.3em]">{{ story.date }}</span>
                     <h3 class="text-2xl md:text-3xl font-cormorant font-bold text-white mt-2">{{ story.title }}</h3>
                     <p class="text-gray-400 text-sm leading-relaxed mt-4 font-light">{{ story.description }}</p>
                  </div>
                  <div :class="idx % 2 === 0 ? '' : 'md:order-first'">
                     <div class="relative rounded-2xl overflow-hidden border border-white/5 aspect-video shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <img v-if="story.image" :src="story.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl md:text-7xl font-cormorant font-bold text-center text-white mb-24" v-observe>The Celestial Pair</h2>
          
          <div class="grid md:grid-cols-2 gap-20 items-center">
            <!-- Groom -->
            <div class="space-y-8 text-center" v-observe>
              <div class="relative inline-block mx-auto group">
                <div class="absolute inset-0 bg-gradient-to-br from-[#f3ca40]/40 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div class="w-64 h-80 md:w-80 md:h-[450px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl relative bg-gray-900">
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                </div>
              </div>
              <div class="pt-4">
                <h3 class="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">{{ data.groomName }}</h3>
                <p class="text-[#f3ca40] text-[10px] uppercase tracking-[0.4em] font-bold mt-2">The Groom</p>
                <p class="text-gray-500 font-light text-sm mt-2 italic px-8">Beloved Son of {{ data.parents?.groomParents }}</p>
                <div class="flex justify-center gap-4 mt-6">
                   <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#f3ca40] hover:text-[#050b1a] transition-all">
                     <i class="fa-brands fa-instagram text-xl"></i>
                   </a>
                </div>
              </div>
            </div>

            <!-- Bride -->
            <div class="space-y-8 text-center" v-observe>
              <div class="relative inline-block mx-auto group">
                <div class="absolute inset-0 bg-gradient-to-bl from-[#f3ca40]/40 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div class="w-64 h-80 md:w-80 md:h-[450px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl relative bg-gray-900">
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                </div>
              </div>
              <div class="pt-4">
                <h3 class="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">{{ data.brideName }}</h3>
                <p class="text-[#f3ca40] text-[10px] uppercase tracking-[0.4em] font-bold mt-2">The Bride</p>
                <p class="text-gray-500 font-light text-sm mt-2 italic px-8">Beloved Daughter of {{ data.parents?.brideParents }}</p>
                <div class="flex justify-center gap-4 mt-6">
                   <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#f3ca40] hover:text-[#050b1a] transition-all">
                     <i class="fa-brands fa-instagram text-xl"></i>
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-32 px-6 bg-[#030712] border-y border-white/5">
         <div class="max-w-4xl mx-auto space-y-16" v-observe>
            <div class="text-center">
               <h3 class="text-3xl md:text-5xl font-cormorant text-white">With Deepest Gratitude</h3>
               <p class="text-[10px] uppercase tracking-[0.4em] text-[#f3ca40] mt-4 font-bold">Kami yang mengundang</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-400 font-light text-sm italic">
               <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="px-4">
                  {{ person }}
               </div>
            </div>
         </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 bg-white/[0.02]">
        <div class="max-w-5xl mx-auto text-center space-y-20">
          <h2 class="text-4xl md:text-7xl font-cormorant font-bold text-white" v-observe>Save The Date</h2>
          
          <div class="grid md:grid-cols-2 gap-12">
            <!-- Akad -->
            <div class="relative group p-12 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-[#f3ca40]/30 transition-all overflow-hidden" v-observe>
              <div class="absolute -right-10 -top-10 text-8xl text-white/[0.02] group-hover:text-[#f3ca40]/10 transition-colors pointer-events-none">✨</div>
              <h3 class="text-3xl font-cormorant font-bold text-white mb-8 tracking-widest">Akad Nikah</h3>
              <div class="space-y-6 text-sm">
                <div class="flex items-center justify-center gap-4">
                  <span class="text-[#f3ca40]"><i class="fa-regular fa-calendar-days text-xl"></i></span>
                  <p class="font-light tracking-[0.2em] uppercase">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                </div>
                <div class="flex items-center justify-center gap-4">
                  <span class="text-[#f3ca40]"><i class="fa-regular fa-clock text-xl"></i></span>
                  <p class="font-light tracking-[0.2em] uppercase">{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                </div>
                <p class="text-gray-500 italic mt-4">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank"
                class="mt-10 inline-block px-10 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-[#f3ca40] hover:text-[#050b1a] transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
                See Map
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="relative group p-12 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-[#f3ca40]/30 transition-all overflow-hidden" v-observe>
              <div class="absolute -left-10 -top-10 text-8xl text-white/[0.02] group-hover:text-[#f3ca40]/10 transition-colors pointer-events-none">🌟</div>
              <h3 class="text-3xl font-cormorant font-bold text-white mb-8 tracking-widest">Resepsi</h3>
              <div class="space-y-6 text-sm">
                <div class="flex items-center justify-center gap-4">
                  <span class="text-[#f3ca40]"><i class="fa-regular fa-calendar-days text-xl"></i></span>
                  <p class="font-light tracking-[0.2em] uppercase">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                </div>
                <div class="flex items-center justify-center gap-4">
                  <span class="text-[#f3ca40]"><i class="fa-regular fa-clock text-xl"></i></span>
                  <p class="font-light tracking-[0.2em] uppercase">{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                </div>
                <p class="text-gray-500 italic mt-4">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank"
                class="mt-10 inline-block px-10 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-[#f3ca40] hover:text-[#050b1a] transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
                See Map
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-20 text-center space-y-4" v-observe>
             <h3 class="text-lg md:text-2xl font-cormorant text-white tracking-[0.2em]">Dress Code</h3>
             <div class="inline-flex items-center gap-4 px-10 py-6 border border-[#f3ca40]/20 rounded-full bg-white/5">
                <i class="fa-solid fa-shirt text-[#f3ca40]"></i>
                <p class="text-gray-300 text-xs font-bold uppercase tracking-widest">{{ data.dressCode }}</p>
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="mt-20 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-6 px-12 py-5 bg-gradient-to-r from-[#f3ca40] to-[#e6b033] text-[#050b1a] font-black rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(243,202,64,0.3)]">
                <i class="fa-solid fa-video text-xl animate-pulse"></i>
                <span class="text-xs uppercase tracking-[0.3em]">Watch Celestial Premiere</span>
             </a>
          </div>

          <div v-observe>
            <button @click="addToCalendar"
              class="px-12 py-4 bg-transparent border-2 border-[#f3ca40] text-[#f3ca40] rounded-full font-black hover:bg-[#f3ca40] hover:text-[#050b1a] transition-all shadow-[0_0_30px_rgba(243,202,64,0.2)] text-xs uppercase tracking-[0.3em]">
              Set Reminder
            </button>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-32 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl md:text-7xl font-cormorant font-bold text-center text-white mb-20" v-observe>Our Memories</h2>
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6">
        <div class="max-w-2xl mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-[3rem] p-10 md:p-20 text-center" v-observe>
          <h2 class="text-4xl font-cormorant font-bold text-white mb-2">RSVP</h2>
          <p class="text-[#f3ca40] mb-12 text-xs uppercase tracking-[0.5em] font-light">Confirm Your Presence</p>

          <form @submit.prevent="submitRSVP" class="space-y-8">
            <input v-model="rsvp.name" type="text" placeholder="Your Full Name"
              class="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-[#f3ca40] transition-colors placeholder-gray-600 font-light text-center"
              required />

            <div class="grid grid-cols-3 gap-4">
              <label v-for="opt in [{v:'hadir',l:'Joyfully Attend'},{v:'tidak',l:'Sadly Decline'},{v:'ragu',l:'Undecided'}]" :key="opt.v"
                class="flex items-center justify-center py-4 rounded-xl cursor-pointer border transition-all text-[9px] font-bold uppercase tracking-widest text-center h-16"
                :class="rsvp.attendance === opt.v ? 'bg-[#f3ca40] border-[#f3ca40] text-[#050b1a]' : 'bg-transparent border-white/10 text-gray-500 hover:bg-white/5'">
                <input type="radio" :value="opt.v" v-model="rsvp.attendance" class="hidden"> {{ opt.l }}
              </label>
            </div>

            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuests"
              class="w-full bg-[#0a192f] border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#f3ca40] text-center uppercase tracking-widest text-xs">
              <option value="" disabled>Party Size</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} Guest(s)</option>
            </select>

            <textarea v-model="rsvp.message" rows="4" placeholder="Send Your Warm Wishes..."
              class="w-full bg-transparent border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#f3ca40] placeholder-gray-600 font-light text-center"></textarea>

            <button type="submit"
              class="w-full py-5 bg-white/5 border border-white/20 text-[#f3ca40] font-black rounded-full transition-all shadow-xl hover:bg-[#f3ca40] hover:text-[#050b1a] uppercase tracking-[0.4em] text-xs">
              Confirm Reservation
            </button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length" class="py-32 px-6 text-center">
        <h2 class="text-4xl font-cormorant font-bold text-white mb-4" v-observe>Digital Gift</h2>
        <p class="text-gray-500 mb-16 max-w-md mx-auto text-xs tracking-widest leading-loose">Should you wish to honor us with a gift, a digital token would be appreciated.</p>

        <div class="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">
          <div v-for="(bank, idx) in data.bankAccounts" :key="idx"
            class="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-12 rounded-[2rem] w-full sm:w-[380px] shadow-2xl relative group" v-observe>
            <div class="absolute top-4 right-6 text-white/5 group-hover:text-[#f3ca40]/10 transition-colors">
               <i class="fa-solid fa-star text-4xl"></i>
            </div>
            <div class="mb-10 text-[#f3ca40] font-bold text-2xl tracking-[0.2em] uppercase font-cormorant">
              {{ bank.bankName }}
            </div>
            <p class="text-2xl text-white font-mono mb-2 tracking-widest">{{ bank.accountNumber }}</p>
            <p class="text-[10px] text-gray-500 mb-10 uppercase tracking-[0.4em] font-bold">a.n {{ bank.accountName }}</p>
            <button @click="copyToClipboard(bank.accountNumber)"
              class="w-full bg-transparent border border-white/20 text-white py-3 rounded-full hover:border-[#f3ca40] hover:text-[#f3ca40] transition-all font-bold uppercase text-[9px] tracking-widest">
              Copy Account
            </button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer v-if="isSectionEnabled('footer')" class="py-32 text-center bg-[#030712] relative">
        <div class="absolute inset-0 bg-gradient-to-t from-[#f3ca40]/5 to-transparent pointer-events-none"></div>
        <h2 class="font-cormorant font-bold text-5xl md:text-7xl text-white mb-6 tracking-wide relative z-10">{{ data.groomName }} <span class="text-[#f3ca40]">&</span> {{ data.brideName }}</h2>
        <p class="text-gray-600 text-[10px] tracking-[0.6em] uppercase font-bold mb-12 relative z-10">Bound by the Heavens</p>
        <p class="text-[#f3ca40]/30 text-[8px] tracking-[0.5em] uppercase font-black relative z-10">Created with SatuUndangan.id</p>
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

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const toast = useToast()
const data = ref(props.data || {})

// Normalize sections from different possible structures
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

// Navigation items
const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-moon', key: 'hero' },
  { id: 'couple', label: 'Pair', icon: 'fa-solid fa-star', key: 'couple' },
  { id: 'story', label: 'Story', icon: 'fa-solid fa-book-heart', key: 'love-story' },
  { id: 'event', label: 'Date', icon: 'fa-solid fa-calendar', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-camera-retro', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-paper-plane', key: 'rsvp' }
]

const navItems = computed(() => {
  if (!activeSections.value) return allNavItems
  return allNavItems.filter(item => {
    const sectionSettings = activeSections.value.find(s => s.key === item.key)
    return sectionSettings ? (sectionSettings.is_enabled !== false) : true
  })
})

const isSectionEnabled = (key) => {
  if (!activeSections.value) return true
  const section = activeSections.value.find(s => s.key === key)
  return section ? (section.is_enabled !== false) : true
}

const activeSection = ref('home')

// Countdown
const countdown = ref({ Days: '00', Hours: '00', Min: '00', Sec: '00' })
let interval = null

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-[1.5s]', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-6')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    observer.observe(el)
  }
}

function getStarStyle(_n) {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const delay = Math.random() * 5
  const duration = 2 + Math.random() * 3
  const size = 1 + Math.random() * 2
  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
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
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
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
  return '/audio/romantic_music1.mp3'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatInstagramUrl(handle) {
  return `https://instagram.com/${handle.replace('@', '')}`
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard!')
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }

  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  } else {
    galleryImages.value = [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400' }
    ]
  }

  const targetDate = data.value.akadLocation?.dateTime || data.value.dateTime
  if (targetDate) {
    const target = new Date(targetDate).getTime()
    interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = target - now
      if (diff <= 0) return clearInterval(interval)
      countdown.value.Days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0')
      countdown.value.Hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
      countdown.value.Min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
      countdown.value.Sec = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
    }, 1000)
  }
}

function addToCalendar() {
  const event = {
    title: `Wedding of ${data.value.groomName} & ${data.value.brideName}`,
    start: new Date(data.value.akadLocation?.dateTime || Date.now()).toISOString().replace(/-|:|\.\d\d\d/g, ""),
    description: "Please join us under the stars."
  }
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.start}&details=${encodeURIComponent(event.description)}`
  window.open(url, '_blank')
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) {
    toast.error("Form incomplete.")
    return
  }
  try {
    await createGuestMessage({
      invitationId: data.value.id,
      guestName: rsvp.value.name,
      message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance,
      totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0
    })
    toast.success(`See you there!`)
  } catch (err) {
    console.error(err)
    toast.error("Failed to confirm.")
  }
}

onMounted(() => { initData() })
onUnmounted(() => { if (interval) clearInterval(interval) })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600&display=swap');

.font-cormorant { font-family: 'Cormorant Garamond', serif; }
.font-sans { font-family: 'Montserrat', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-spin-slow { animation: spin 20s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 5px white;
  animation: blink infinite ease-in-out;
}

@keyframes blink {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
tyle>
