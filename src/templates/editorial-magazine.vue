<template>
  <div class="relative min-h-screen bg-white overflow-hidden font-sans no-scrollbar text-[#1a1a1a] selection:bg-black selection:text-white">
    
    <!-- Editorial Lines -->
    <div class="fixed top-0 left-10 w-px h-full bg-gray-100 z-0 hidden md:block"></div>
    <div class="fixed top-0 right-10 w-px h-full bg-gray-100 z-0 hidden md:block"></div>

    <!-- Music Control -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" />

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-none px-8 py-4 flex items-center justify-center gap-10 shadow-2xl w-fit max-w-[95%] md:hidden transition-all duration-500">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300"
        :class="activeSection === item.id ? 'text-white' : 'text-gray-500'">
        <i :class="[item.icon, 'text-base']"></i>
        <span class="text-[6px] font-black uppercase tracking-[0.3em]">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade">
      <div v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-white transition-all duration-1000">
        
        <div class="relative z-10 space-y-12 md:space-y-16 w-full max-w-lg">
          <div class="space-y-4">
            <div class="w-12 h-1 bg-black mx-auto mb-6 md:mb-10"></div>
            <h1 class="text-[8px] md:text-[9px] tracking-[0.5em] md:tracking-[0.8em] uppercase font-black text-gray-400">Special Editorial Issue</h1>
            <div class="space-y-2">
              <h2 class="text-5xl md:text-8xl font-playfair font-black uppercase leading-none tracking-tighter shrink-0">{{ data.groomName }}</h2>
              <p class="text-lg md:text-xl font-playfair italic text-gray-400">&</p>
              <h2 class="text-5xl md:text-8xl font-playfair font-black uppercase leading-none tracking-tighter shrink-0">{{ data.brideName }}</h2>
            </div>
          </div>

          <div class="space-y-8 md:space-y-10">
            <div class="space-y-2 py-4 md:py-6 border-y border-gray-100">
               <p class="text-[7px] md:text-[8px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-400">Invited Guest</p>
               <p class="text-2xl md:text-3xl font-playfair font-bold uppercase tracking-tight truncate px-4">{{ data.guestName }}</p>
            </div>
            <button @click="openInvitation"
              class="w-full py-5 bg-black text-white font-black transition-all hover:bg-gray-800 flex items-center justify-center gap-4 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em]">
              Enter Story
              <i class="fa-solid fa-chevron-right text-[8px]"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 relative pt-10 md:pt-0">
        <div class="w-full max-w-6xl grid md:grid-cols-12 gap-8 md:gap-10 items-center" v-observe>
          <div class="md:col-span-7 space-y-6 md:space-y-8 order-2 md:order-1 text-center md:text-left">
            <span class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-gray-300">The Wedding Issue / No. 01</span>
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-playfair font-black leading-[0.9] md:leading-[0.85] uppercase tracking-tighter">
              {{ data.groomName }} <br> <span class="text-2xl md:text-5xl text-gray-300 italic">&</span> <br> {{ data.brideName }}
            </h1>
            <div class="flex items-center justify-center md:justify-start gap-4 md:gap-6">
               <div class="w-12 md:w-20 h-px bg-black"></div>
               <p class="text-xs md:text-lg font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                 {{ formatDate(data.akadLocation?.dateTime) }}
               </p>
            </div>
          </div>
          <div class="md:col-span-5 order-1 md:order-2">
             <div class="aspect-[4/5] md:aspect-[3/4] bg-gray-100 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-xl md:shadow-2xl mx-auto max-w-[280px] md:max-w-none">
                <img :src="data.photoCoupleUrl || 'https://via.placeholder.com/600x800'" class="w-full h-full object-cover" />
                <div class="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white text-[7px] md:text-[8px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold">Featured Couple</div>
             </div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-24 md:py-32 px-6 bg-gray-50" v-observe>
        <div class="max-w-4xl mx-auto text-center md:text-left">
          <div class="grid md:grid-cols-12 gap-6 md:gap-10">
             <div class="md:col-span-2 hidden md:block">
                <span class="text-5xl font-playfair italic text-gray-200">"</span>
             </div>
             <div class="md:col-span-10">
                <p class="text-2xl md:text-4xl font-playfair leading-tight mb-8 md:mb-12">
                  {{ data.quoteText }}
                </p>
                <p class="text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-400">— {{ data.quoteSource }}</p>
             </div>
          </div>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-24 md:py-32 px-6 border-y-2 border-black">
        <div class="max-w-7xl mx-auto space-y-20">
          <div class="flex items-end justify-between border-b border-gray-100 pb-10">
             <h2 class="text-4xl md:text-7xl font-playfair font-black uppercase leading-none tracking-tighter">Feature<br>Story</h2>
             <span class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Volume 01 / Page 08</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="space-y-6 group" v-observe>
               <div class="aspect-square bg-gray-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <img v-if="story.image" :src="story.image" class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s]" />
                  <div v-else class="w-full h-full flex items-center justify-center font-playfair italic text-gray-300">Visual Missing</div>
               </div>
               <div class="space-y-3">
                  <span class="text-[8px] font-black uppercase tracking-[0.3em] text-[#b48c5b]">{{ story.date }}</span>
                  <h3 class="text-2xl font-playfair font-bold uppercase leading-tight">{{ story.title }}</h3>
                  <p class="text-xs leading-relaxed text-gray-500 line-clamp-4">{{ story.description }}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-24 md:py-32 px-6 md:px-20">
        <div class="max-w-7xl mx-auto space-y-32 md:space-y-40">
          <!-- Groom -->
          <div class="grid md:grid-cols-2 gap-12 md:gap-20 items-center relative" v-observe>
            <div class="space-y-6 md:space-y-10 order-2 md:order-1">
              <h2 class="text-7xl md:text-9xl font-playfair font-black text-gray-50 absolute -top-10 md:-top-16 -left-4 md:-left-8 z-0 select-none">01</h2>
              <div class="relative z-10 space-y-4 md:space-y-6">
                <span class="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-black text-gray-400">The Gentleman</span>
                <h3 class="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold uppercase tracking-tighter leading-none">{{ data.groomName }}</h3>
                <div class="w-16 md:w-20 h-1 bg-black"></div>
                <p class="text-xs md:text-sm uppercase tracking-widest font-bold pt-2 md:pt-4">Son of {{ data.parents?.groomParents }}</p>
                <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block mt-4 md:mt-6 text-[10px] md:text-sm font-black border-b-2 border-black pb-1 hover:text-gray-500 transition-colors uppercase tracking-widest">
                  Follow Journey
                </a>
              </div>
            </div>
            <div class="relative order-1 md:order-2">
               <div class="aspect-[4/5] bg-gray-100 grayscale overflow-hidden shadow-xl md:shadow-2xl mx-auto max-w-[300px] md:max-w-none">
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/600x800'" class="w-full h-full object-cover" />
               </div>
            </div>
          </div>

          <!-- Bride -->
          <div class="grid md:grid-cols-2 gap-12 md:gap-20 items-center relative" v-observe>
            <div class="order-2 md:order-1 relative">
               <div class="aspect-[4/5] bg-gray-100 grayscale overflow-hidden shadow-xl md:shadow-2xl mx-auto max-w-[300px] md:max-w-none">
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/600x800'" class="w-full h-full object-cover" />
               </div>
            </div>
            <div class="order-1 md:order-2 space-y-6 md:space-y-10 text-right md:text-left">
              <h2 class="text-7xl md:text-9xl font-playfair font-black text-gray-50 absolute -top-10 md:-top-16 -right-4 md:-right-8 md:left-auto z-0 select-none">02</h2>
              <div class="relative z-10 space-y-4 md:space-y-6">
                <span class="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-black text-gray-400">The Lady</span>
                <h3 class="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold uppercase tracking-tighter leading-none">{{ data.brideName }}</h3>
                <div class="w-16 md:w-20 h-1 bg-black ml-auto md:ml-0"></div>
                <p class="text-xs md:text-sm uppercase tracking-widest font-bold pt-2 md:pt-4">Daughter of {{ data.parents?.brideParents }}</p>
                <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block mt-4 md:mt-6 text-[10px] md:text-sm font-black border-b-2 border-black pb-1 hover:text-gray-500 transition-colors uppercase tracking-widest">
                  View Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-24 md:py-32 px-6 bg-white border-y border-gray-100">
         <div class="max-w-5xl mx-auto space-y-16" v-observe>
            <div class="text-center space-y-2">
               <h2 class="text-3xl md:text-5xl font-playfair font-black uppercase tracking-tighter">In Association With</h2>
               <p class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 italic">Turut Mengundang</p>
            </div>
            <div class="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-8 text-center md:text-left border-l-2 border-black pl-10 ml-6">
               <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="text-xs font-bold uppercase tracking-widest leading-loose">
                  {{ person }}
               </div>
            </div>
         </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-24 md:py-32 px-6 bg-black text-white">
        <div class="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-20">
          <div class="md:col-span-4 space-y-4 md:space-y-6 text-center md:text-left" v-observe>
            <h2 class="text-5xl md:text-6xl font-playfair font-black uppercase leading-none">The <br class="hidden md:block"> Schedule</h2>
            <p class="text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">Mark Your Calendar</p>
          </div>
          
          <div class="md:col-span-8 space-y-16 md:space-y-24">
            <!-- Akad -->
            <div class="grid md:grid-cols-2 gap-8 md:gap-10 border-t border-white/10 pt-8 md:pt-10" v-observe>
              <div class="space-y-2 md:space-y-4">
                <span class="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-500 font-black">Part I</span>
                <h3 class="text-3xl md:text-4xl font-playfair font-bold uppercase">Akad Nikah</h3>
              </div>
              <div class="space-y-4 md:space-y-6">
                <p class="text-xl md:text-2xl font-playfair italic">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                <p class="text-xs md:text-sm uppercase tracking-widest font-bold">{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                <p class="text-gray-400 text-xs md:text-sm leading-relaxed">{{ data.akadLocation?.description }}</p>
                <a :href="data.akadLocation?.mapUrl" target="_blank"
                  class="inline-block w-full md:w-auto text-center px-8 py-4 md:py-3 border border-white/20 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black hover:bg-white hover:text-black transition-all">
                  Open Directions
                </a>
              </div>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="grid md:grid-cols-2 gap-8 md:gap-10 border-t border-white/10 pt-8 md:pt-10" v-observe>
              <div class="space-y-2 md:space-y-4">
                <span class="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-500 font-black">Part II</span>
                <h3 class="text-3xl md:text-4xl font-playfair font-bold uppercase">Wedding Reception</h3>
              </div>
              <div class="space-y-4 md:space-y-6">
                <p class="text-xl md:text-2xl font-playfair italic">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                <p class="text-xs md:text-sm uppercase tracking-widest font-bold">{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                <p class="text-gray-400 text-xs md:text-sm leading-relaxed">{{ data.resepsiLocation?.description }}</p>
                <a :href="data.resepsiLocation?.mapUrl" target="_blank"
                  class="inline-block w-full md:w-auto text-center px-8 py-4 md:py-3 border border-white/20 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black hover:bg-white hover:text-black transition-all">
                  Open Directions
                </a>
              </div>
            </div>

            <!-- DRESS CODE -->
            <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="border-t border-white/10 pt-10 text-center md:text-left space-y-6" v-observe>
               <span class="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-500 font-black">Wardrobe</span>
               <h3 class="text-2xl md:text-4xl font-playfair font-bold uppercase tracking-widest italic text-gray-400">Dress Code</h3>
               <p class="text-xs md:text-lg font-bold uppercase tracking-[0.2em]">{{ data.dressCode }}</p>
            </div>

            <!-- LIVE STREAMING -->
            <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="border-t border-white/10 pt-10 text-center" v-observe>
               <p class="text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-gray-500 font-black mb-6">Online Premiere</p>
               <a :href="data.liveStreamingUrl" target="_blank" class="inline-block px-12 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-gray-200 transition-all">
                  Join Virtual Event
               </a>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-24 md:py-32 px-4 bg-white">
        <div class="max-w-7xl mx-auto space-y-12 md:space-y-20">
          <div class="flex items-end justify-between border-b-2 md:border-b-4 border-black pb-6 md:pb-10" v-observe>
            <h2 class="text-5xl md:text-7xl font-playfair font-black uppercase leading-none tracking-tighter shrink-0">Gallery</h2>
            <span class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 hidden md:block">Issue No. 01 / Page 12-24</span>
          </div>
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-24 md:py-32 px-6 bg-gray-50">
        <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div class="space-y-6 md:space-y-10 text-center md:text-left" v-observe>
            <h2 class="text-5xl md:text-6xl font-playfair font-black uppercase leading-none">R.S.V.P</h2>
            <p class="text-gray-500 text-xs md:text-sm leading-relaxed font-medium uppercase tracking-widest">Your confirmation is essential for our editorial planning. Please respond by the indicated date.</p>
            <div class="w-32 md:w-40 h-px bg-black mx-auto md:ml-0"></div>
          </div>

          <form @submit.prevent="submitRSVP" class="space-y-8 md:space-y-10 bg-white p-8 md:p-16 shadow-xl md:shadow-2xl" v-observe>
            <div class="space-y-2">
              <label class="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-gray-400">Full Name</label>
              <input v-model="rsvp.name" type="text"
                class="w-full bg-transparent border-b-2 border-black py-3 md:py-4 text-lg md:text-xl focus:outline-none placeholder-gray-200 font-playfair"
                required />
            </div>

            <div class="space-y-4">
               <label class="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-gray-400">Attendance Status</label>
               <div class="grid grid-cols-1 gap-3">
                 <label v-for="opt in [{v:'hadir',l:'Will Attend'},{v:'tidak',l:'Unable to Attend'}]" :key="opt.v"
                   class="flex items-center gap-4 py-3 md:py-4 px-5 md:px-6 border-2 transition-all cursor-pointer group"
                   :class="rsvp.attendance === opt.v ? 'bg-black border-black text-white' : 'bg-transparent border-gray-100 hover:border-black'">
                   <input type="radio" :value="opt.v" v-model="rsvp.attendance" class="hidden">
                   <span class="w-3 h-3 md:w-4 md:h-4 border-2 rounded-full flex items-center justify-center transition-all" :class="rsvp.attendance === opt.v ? 'border-white bg-white' : 'border-gray-300'"></span>
                   <span class="text-[10px] md:text-xs font-black uppercase tracking-widest">{{ opt.l }}</span>
                 </label>
               </div>
            </div>

            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuests"
              class="w-full bg-gray-50 border-0 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none">
              <option value="" disabled>Number of Guests</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} Person(s)</option>
            </select>

            <textarea v-model="rsvp.message" rows="4" placeholder="Send Your Blessing..."
              class="w-full bg-gray-50 border-0 py-4 px-6 text-xs md:text-sm font-medium outline-none placeholder-gray-200"></textarea>

            <button type="submit"
              class="w-full py-5 md:py-6 bg-black text-white font-black hover:bg-gray-800 transition-all uppercase tracking-[0.4em] md:tracking-[0.5em] text-[9px] md:text-[10px]">
              Submit Confirmation
            </button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length" class="py-24 md:py-32 px-6 text-center md:px-20">
        <h2 class="text-5xl md:text-7xl font-playfair font-black uppercase tracking-tighter mb-12 md:mb-20" v-observe>Gifts</h2>
        
        <div class="flex flex-wrap justify-center gap-4 md:gap-6">
          <div v-for="(bank, idx) in data.bankAccounts" :key="idx"
            class="bg-white border-2 md:border-4 border-black p-8 md:p-12 w-full sm:w-[450px] text-left group" v-observe>
            <div class="flex justify-between items-start mb-10 md:mb-16">
               <div class="text-3xl md:text-4xl font-playfair font-black uppercase tracking-tighter">{{ bank.bankName }}</div>
               <div class="text-gray-200 group-hover:text-black transition-colors"><i class="fa-solid fa-credit-card text-2xl md:text-3xl"></i></div>
            </div>
            <div class="space-y-1">
               <p class="text-2xl md:text-3xl font-playfair font-bold tracking-tighter">{{ bank.accountNumber }}</p>
               <p class="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-gray-400">Account Name: {{ bank.accountName }}</p>
            </div>
            <button @click="copyToClipboard(bank.accountNumber)"
              class="mt-10 md:mt-12 w-full py-4 bg-gray-100 text-black font-black hover:bg-black hover:text-white transition-all text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em]">
              Copy to Clipboard
            </button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer v-if="isSectionEnabled('footer')" class="py-24 md:py-32 text-center bg-white border-t-4 md:border-t-8 border-black">
        <h2 class="font-playfair font-black text-4xl md:text-8xl lg:text-[10rem] uppercase leading-none tracking-tighter mb-8 md:mb-10 px-4">{{ data.groomName }} & {{ data.brideName }}</h2>
        <div class="flex flex-col items-center space-y-4 md:space-y-6 px-4">
           <p class="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.5em] md:tracking-[0.8em] font-black">All Rights Reserved / 2026</p>
           <p class="text-black text-[8px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-black px-6 py-2 border-2 border-black inline-block">SatuUndangan Editorial</p>
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
  { id: 'home', label: 'Home', icon: 'fa-solid fa-square', key: 'hero' },
  { id: 'couple', label: 'Couple', icon: 'fa-solid fa-user', key: 'couple' },
  { id: 'story', label: 'Story', icon: 'fa-solid fa-book-heart', key: 'love-story' },
  { id: 'event', label: 'Event', icon: 'fa-solid fa-clock', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-image', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-check', key: 'rsvp' }
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
const countdown = ref({ DD: '00', HR: '00', MN: '00', SC: '00' })
let interval = null

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-[1s]', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-10')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
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
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatInstagramUrl(handle) {
  return `https://instagram.com/${handle.replace('@', '')}`
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  toast.success('Information Copied')
}

function initData() {
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
      countdown.value.DD = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0')
      countdown.value.HR = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
      countdown.value.MN = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
      countdown.value.SC = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
    }, 1000)
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) {
    toast.error("Information missing.")
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
    toast.success(`Registry Updated`)
  } catch (err) {
    console.error(err)
    toast.error("Process failed.")
  }
}

onMounted(() => { initData() })
onUnmounted(() => { if (interval) clearInterval(interval) })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;700;900&display=swap');

.font-playfair { font-family: 'Playfair Display', serif; }
.font-sans { font-family: 'Inter', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
