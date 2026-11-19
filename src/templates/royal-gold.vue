<template>
  <div class="relative min-h-screen bg-[#0a1128] overflow-hidden font-serif no-scrollbar text-[#e5e7eb] selection:bg-[#d4af37]/30">
    
    <!-- Pattern Overlay (Batik/Heritage Vibe) -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
    <div class="fixed inset-0 pointer-events-none z-0 opacity-20" 
         style="background-image: url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 50L0 0M50 50L100 0M50 50L100 100M50 50L0 100\' stroke=\'%23d4af37\' stroke-width=\'0.5\' fill=\'none\'/%3E%3C/svg%3E'); background-size: 60px 60px;"></div>

    <!-- Royal Ornaments (Embedded SVG) -->
    <div class="fixed top-0 left-0 w-32 h-32 md:w-48 md:h-48 z-40 opacity-75 pointer-events-none text-[#d4af37]">
       <svg viewBox="0 0 100 100" fill="currentColor">
         <path d="M0 0C20 0 40 10 50 30C60 10 80 0 100 0V5C80 5 60 15 50 35C40 15 20 5 0 5V0Z" />
         <circle cx="50" cy="45" r="3" />
       </svg>
    </div>
    <div class="fixed bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 z-40 opacity-75 pointer-events-none text-[#d4af37] rotate-180">
       <svg viewBox="0 0 100 100" fill="currentColor">
         <path d="M0 0C20 0 40 10 50 30C60 10 80 0 100 0V5C80 5 60 15 50 35C40 15 20 5 0 5V0Z" />
         <circle cx="50" cy="45" r="3" />
       </svg>
    </div>

    <!-- Music Control -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" primaryColor="#0a1128" accentColor="#d4af37" />

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#d4af37]/30 rounded-xl shadow-2xl w-[92%] max-w-md md:hidden transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth">
      <div class="flex items-center gap-1 px-2 py-3 w-full">
        <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group"
          :class="activeSection === item.id ? 'text-[#d4af37] scale-110' : 'text-gray-500 hover:text-[#d4af37]'">
          <i :class="[item.icon, 'text-lg']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-widest">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade">
      <div v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#0a1128] transition-all duration-1000">
        
        <div class="relative z-10 space-y-10 animate-fade-in-up">
          <div class="space-y-4">
            <h1 class="text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#d4af37] font-bold">The Royal Wedding Of</h1>
            <div class="flex flex-col items-center gap-2">
              <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cinzel text-white drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] leading-tight max-w-xl mx-auto">{{ data.groomName }}</h2>
              <div class="w-20 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
              <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cinzel text-white drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] leading-tight max-w-xl mx-auto">{{ data.brideName }}</h2>
            </div>
          </div>

          <div class="max-w-xs mx-auto space-y-6">
            <div class="p-6 border border-[#d4af37]/20 bg-white/5 backdrop-blur-sm rounded-lg">
               <p class="text-[10px] uppercase tracking-widest text-[#d4af37] mb-2 font-bold">Special Guest</p>
               <p class="text-xl font-cinzel font-bold text-white mb-6 uppercase">{{ data.guestName }}</p>
               <button @click="openInvitation"
                 class="w-full py-4 bg-[#d4af37] text-[#0a1128] font-black rounded-lg transition-all hover:bg-[#f1c40f] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]">
                 Open Invitation
               </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-20">
        <div class="space-y-6 max-w-3xl mx-auto" v-observe>
          <div class="flex items-center justify-center gap-4">
             <div class="w-12 h-px bg-[#d4af37]/50"></div>
             <span class="text-[10px] uppercase tracking-[0.5em] text-[#d4af37] font-bold">Est. 2026</span>
             <div class="w-12 h-px bg-[#d4af37]/50"></div>
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel leading-snug text-white tracking-wide">
            {{ data.groomName }} <br> <span class="text-2xl md:text-3xl text-[#d4af37] italic my-2 inline-block font-serif">&</span> <br> {{ data.brideName }}
          </h1>
          <p class="text-base md:text-xl text-[#d4af37] font-medium tracking-[0.3em] uppercase">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="grid grid-cols-4 gap-3 md:gap-8 mt-10 md:mt-12 max-w-md mx-auto">
            <div v-for="(val, label) in countdown" :key="label" class="p-3 md:p-4 border border-[#d4af37]/30 rounded-lg bg-white/5">
              <div class="text-xl md:text-3xl font-cinzel text-white">{{ val }}</div>
              <div class="text-[8px] uppercase tracking-widest text-[#d4af37] mt-1">{{ label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-16 md:py-24 px-6 relative bg-[#080e20]" v-observe>
        <div class="max-w-3xl mx-auto text-center">
          <div class="text-[#d4af37] mb-6 flex justify-center">
             <i class="fa-solid fa-crown text-2xl md:text-3xl opacity-50"></i>
          </div>
          <p class="text-base md:text-xl text-gray-300 italic leading-relaxed font-light mb-6 px-4 font-serif">
            "{{ data.quoteText }}"
          </p>
          <p class="text-xs md:text-sm font-bold text-[#d4af37] tracking-[0.4em] uppercase">{{ data.quoteSource }}</p>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-16 md:py-24 px-6 bg-[#0a1128]">
        <div class="max-w-5xl mx-auto space-y-16">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-3xl md:text-4xl font-cinzel text-white">Our Heritage</h2>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
          </div>

          <div class="space-y-12">
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)" :key="idx" class="relative group" v-observe>
               <div class="grid md:grid-cols-12 gap-8 md:gap-16 items-center">
                  <div class="md:col-span-4" :class="idx % 2 === 0 ? '' : 'md:order-last'">
                     <div class="relative rounded-lg overflow-hidden border border-[#d4af37]/30 shadow-2xl aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-700">
                        <img v-if="story.image || isPreviewMode" :src="story.image || 'https://via.placeholder.com/400x500'" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full bg-white/5 flex items-center justify-center"><i class="fa-solid fa-heart text-[#d4af37]/20 text-4xl"></i></div>
                     </div>
                  </div>
                  <div class="md:col-span-8 space-y-4" :class="idx % 2 === 0 ? 'text-left' : 'text-left md:text-right'">
                     <span class="text-[#d4af37] font-cinzel text-xl tracking-widest">{{ story.date }}</span>
                     <h3 class="text-2xl md:text-3xl font-serif text-white uppercase tracking-tighter">{{ story.title }}</h3>
                     <p class="text-gray-400 text-sm md:text-base leading-relaxed font-serif italic">{{ story.description }}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-16 md:py-24 px-6 bg-[#0a1128]">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-cinzel text-center text-white mb-10 md:mb-14" v-observe>Mempelai</h2>
          
          <div class="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">
            <!-- Groom -->
            <div class="flex flex-col items-center gap-6" v-observe>
              <div class="relative group">
                <div class="absolute inset-0 border-2 border-[#d4af37] -m-3 rounded-xl group-hover:m-0 transition-all duration-500"></div>
                <div class="w-44 h-60 sm:w-52 sm:h-68 md:w-56 md:h-76 lg:w-64 lg:h-84 overflow-hidden rounded-lg shadow-2xl relative">
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-transparent opacity-60"></div>
                </div>
              </div>
              <div class="text-center space-y-2 max-w-sm">
                <h3 class="text-xl sm:text-2xl md:text-3xl font-cinzel text-white leading-snug">{{ data.groomName }}</h3>
                <p class="text-[#d4af37] text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">Putra Dari</p>
                <p class="text-gray-400 font-serif text-sm md:text-base leading-relaxed">{{ data.parents?.groomParents || 'Bpk. & Ibu' }}</p>
                <div class="pt-2 flex justify-center">
                   <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="w-9 h-9 border border-[#d4af37]/50 rounded-full flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a1128] transition-all text-sm">
                     <i class="fa-brands fa-instagram"></i>
                   </a>
                </div>
              </div>
            </div>

            <!-- Bride -->
            <div class="flex flex-col items-center gap-6" v-observe>
              <div class="relative group">
                <div class="absolute inset-0 border-2 border-[#d4af37] -m-3 rounded-xl group-hover:m-0 transition-all duration-500"></div>
                <div class="w-44 h-60 sm:w-52 sm:h-68 md:w-56 md:h-76 lg:w-64 lg:h-84 overflow-hidden rounded-lg shadow-2xl relative">
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-transparent opacity-60"></div>
                </div>
              </div>
              <div class="text-center space-y-2 max-w-sm">
                <h3 class="text-xl sm:text-2xl md:text-3xl font-cinzel text-white leading-snug">{{ data.brideName }}</h3>
                <p class="text-[#d4af37] text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">Putri Dari</p>
                <p class="text-gray-400 font-serif text-sm md:text-base leading-relaxed">{{ data.parents?.brideParents || 'Bpk. & Ibu' }}</p>
                <div class="pt-2 flex justify-center">
                   <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="w-9 h-9 border border-[#d4af37]/50 rounded-full flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a1128] transition-all text-sm">
                     <i class="fa-brands fa-instagram"></i>
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-16 md:py-24 px-6 bg-[#080e20] text-center">
         <div class="max-w-4xl mx-auto space-y-10" v-observe>
            <h3 class="text-xl md:text-3xl font-cinzel text-[#d4af37] uppercase tracking-widest">Turut Mengundang</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300 font-serif">
               <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="border-b border-[#d4af37]/10 pb-3">
                  {{ person }}
               </div>
            </div>
         </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-16 md:py-24 px-6 bg-[#080e20]">
        <div class="max-w-5xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-cinzel text-white mb-12 md:mb-16" v-observe>Agenda Acara</h2>
          
          <div class="grid md:grid-cols-2 gap-8 md:gap-12">
            <div class="relative group p-8 md:p-10 bg-white/5 border border-[#d4af37]/20 rounded-2xl space-y-6 md:space-y-8 hover:bg-[#d4af37]/5 transition-colors" v-observe>
              <div class="text-[#d4af37]"><i class="fa-solid fa-ring text-3xl md:text-4xl"></i></div>
              <h3 class="text-2xl md:text-3xl font-cinzel text-white tracking-widest">Akad Nikah</h3>
              <div class="space-y-2 text-[#d4af37] font-cinzel">
                <p class="text-lg md:text-xl">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                <p class="text-base md:text-lg">{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
              </div>
              <p class="text-gray-400 font-serif italic text-sm md:text-base">{{ data.akadLocation?.description }}</p>
              <a :href="data.akadLocation?.mapUrl" target="_blank"
                class="inline-block px-8 py-3 bg-transparent border-2 border-[#d4af37] text-[#d4af37] font-black rounded-lg hover:bg-[#d4af37] hover:text-[#0a1128] transition-all text-[10px] uppercase tracking-[0.3em]">
                Google Maps
              </a>
            </div>

            <div v-if="!data.mergeEvents" class="relative group p-8 md:p-10 bg-white/5 border border-[#d4af37]/20 rounded-2xl space-y-6 md:space-y-8 hover:bg-[#d4af37]/5 transition-colors" v-observe>
              <div class="text-[#d4af37]"><i class="fa-solid fa-champagne-glasses text-3xl md:text-4xl"></i></div>
              <h3 class="text-2xl md:text-3xl font-cinzel text-white tracking-widest">Resepsi</h3>
              <div class="space-y-2 text-[#d4af37] font-cinzel">
                <p class="text-lg md:text-xl">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                <p class="text-base md:text-lg">{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
              </div>
              <p class="text-gray-400 font-serif italic text-sm md:text-base">{{ data.resepsiLocation?.description }}</p>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank"
                class="inline-block px-8 py-3 bg-transparent border-2 border-[#d4af37] text-[#d4af37] font-black rounded-lg hover:bg-[#d4af37] hover:text-[#0a1128] transition-all text-[10px] uppercase tracking-[0.3em]">
                Google Maps
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && (data.dressCode || data.designSettings?.dressCodeColors?.length)" class="mt-14 md:mt-16 text-center" v-observe>
             <h3 class="text-lg md:text-xl font-cinzel text-[#d4af37] mb-4 tracking-widest">Dress Code</h3>
             <div class="inline-block p-6 md:p-8 border border-[#d4af37]/30 bg-white/5 rounded-2xl px-8 md:px-12 max-w-md w-full">
                <i class="fa-solid fa-shirt text-[#d4af37] text-2xl mb-2 block"></i>
                <p v-if="data.dressCode" class="text-white text-xs md:text-sm uppercase tracking-widest">{{ data.dressCode }}</p>
                <DressCodeSwatches :colors="data.designSettings?.dressCodeColors || data.dressCodeColors" />
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="mt-14 md:mt-16 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-4 md:gap-6 px-10 py-4 bg-[#d4af37] text-[#0a1128] font-black rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(214,177,138,0.3)] group">
                <i class="fa-solid fa-video text-lg animate-pulse"></i>
                <span class="text-xs md:text-sm uppercase tracking-[0.3em]">Join Royal Celebration</span>
             </a>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-16 md:py-24 px-4 bg-[#0a1128]">
        <h2 class="text-3xl md:text-4xl font-cinzel text-center text-white mb-12 md:mb-16" v-observe>Galeri Foto</h2>
        <div class="max-w-6xl mx-auto">
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-16 md:py-24 px-6 bg-[#080e20]">
        <div class="max-w-2xl mx-auto bg-white/5 border border-[#d4af37]/20 rounded-2xl p-6 md:p-12 text-center" v-observe>
          <h2 class="text-3xl md:text-4xl font-cinzel text-white mb-2">RSVP</h2>
          <p class="text-[#d4af37] mb-8 text-xs md:text-sm uppercase tracking-widest">Konfirmasi Kehadiran</p>

          <form @submit.prevent="submitRSVP" class="space-y-6">
            <div class="relative">
              <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap"
                class="w-full bg-transparent border-b border-[#d4af37]/30 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-600 font-cinzel tracking-widest"
                required />
            </div>

            <div class="grid grid-cols-3 gap-3 md:gap-4">
              <label v-for="opt in [{v:'hadir',l:'Hadir'},{v:'tidak',l:'Maaf'},{v:'ragu',l:'Ragu'}]" :key="opt.v"
                class="flex items-center justify-center py-3.5 rounded-lg cursor-pointer border transition-all text-[10px] font-bold uppercase tracking-widest"
                :class="rsvp.attendance === opt.v ? 'bg-[#d4af37] border-[#d4af37] text-[#0a1128]' : 'bg-transparent border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10'">
                <input type="radio" :value="opt.v" v-model="rsvp.attendance" class="hidden"> {{ opt.l }}
              </label>
            </div>

            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuests"
              class="w-full bg-[#0a1128] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-[#d4af37] focus:outline-none focus:border-[#d4af37] font-cinzel uppercase tracking-widest text-xs">
              <option value="" disabled>Jumlah Tamu</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
            </select>

            <textarea v-model="rsvp.message" rows="4" placeholder="Ucapan & Doa"
              class="w-full bg-[#0a1128]/50 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] placeholder-gray-600 font-serif"></textarea>

            <button type="submit"
              class="w-full py-4 bg-[#d4af37] text-[#0a1128] font-black rounded-lg transition-all shadow-xl hover:bg-[#f1c40f] uppercase tracking-[0.3em] text-xs">
              Kirim Konfirmasi
            </button>
          </form>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="data.videoPrewedding && isSectionEnabled('video')" class="py-16 md:py-24 px-6 bg-[#080e20]">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-cinzel text-white mb-8" v-observe>Video Prewedding</h2>
          <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/20">
            <iframe :src="getEmbedUrlVideo(data.videoPrewedding)" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <!-- MENU -->
      <section v-if="data.menu?.items?.length && isSectionEnabled('menu')" class="py-16 md:py-24 px-6 bg-[#0a1128]">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-cinzel text-white mb-8" v-observe>{{ data.menu.title || 'Menu Hidangan' }}</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(item, idx) in data.menu.items" :key="idx"
              class="bg-[#080e20] p-5 rounded-2xl border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors text-left" v-observe>
              <h4 class="text-sm md:text-base font-cinzel text-white">{{ item.name || item }}</h4>
            </div>
          </div>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.qrisImageUrl || data.designSettings?.qrisImageUrl || data.giftSettings?.qrisImageUrl)" id="gift" class="py-16 md:py-24 px-6 text-center bg-[#0a1128]">
        <h2 class="text-3xl md:text-4xl font-cinzel text-white mb-2" v-observe>Wedding Gift</h2>
        <p class="text-[#d4af37] mb-12 max-w-md mx-auto text-xs uppercase tracking-widest">Tanda Kasih Digital</p>

        <div class="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          <div v-for="(bank, idx) in data.bankAccounts" :key="idx"
            class="bg-[#080e20] border border-[#d4af37]/30 p-8 rounded-2xl w-full sm:w-[320px] shadow-2xl relative overflow-hidden" v-observe>
            <i class="pi pi-building absolute -top-10 -right-10 text-[#d4af37] opacity-5 text-9xl pointer-events-none select-none" aria-hidden="true"></i>
            <div class="mb-6 text-[#d4af37] font-bold text-xl tracking-widest uppercase font-cinzel">
              {{ bank.bankName }}
            </div>
            <p class="text-xl text-white font-mono mb-2 tracking-tighter">{{ bank.accountNumber }}</p>
            <p class="text-[10px] text-gray-500 mb-6 uppercase tracking-[0.3em]">a.n {{ bank.accountName }}</p>
            <button @click="copyToClipboard(bank.accountNumber)"
              class="w-full bg-transparent border border-[#d4af37] text-[#d4af37] py-2.5 rounded-lg hover:bg-[#d4af37] hover:text-[#0a1128] transition-all font-bold uppercase text-[10px] tracking-widest">
              Salin Rekening
            </button>
          </div>
        <div v-if="data.qrisImageUrl || data.designSettings?.qrisImageUrl || data.giftSettings?.qrisImageUrl" class="mt-6 flex justify-center" v-observe>
          <QrisGiftCard :data="data" :groomName="data.groomName" :brideName="data.brideName" variant="gold" />
        </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-16 md:py-20 bg-[#050a18] text-center border-t border-[#d4af37]/20">
        <h2 class="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white mb-4">{{ data.groomName }} & {{ data.brideName }}</h2>
        <div class="flex justify-center gap-4 mb-10 opacity-30">
           <div class="w-16 h-px bg-[#d4af37]"></div>
           <i class="fa-solid fa-gem text-[#d4af37]"></i>
           <div class="w-16 h-px bg-[#d4af37]"></div>
        </div>
        <p v-if="data.footerText" class="text-gray-500 text-sm mb-12 max-w-lg mx-auto px-6 italic font-serif leading-loose">{{ data.footerText }}</p>
        <WatermarkBadge variant="gold" />
      </footer>

    </div>
  </div>
</template>

<script setup>
import { loadGoogleFont } from '@/utils/fontLoader'

loadGoogleFont('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap')
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import DressCodeSwatches from '@/components/invitation/DressCodeSwatches.vue'
import QrisGiftCard from '@/components/invitation/QrisGiftCard.vue'
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
  const rawList = data.value.selectedSections || data.value.content?.selectedSections
  if (rawList && Array.isArray(rawList)) {
    return rawList.map(s => typeof s === 'string' ? { key: s, is_enabled: true } : s)
  }
  return null
})

const showWelcome = ref(true)
const galleryImages = ref([])
const rsvp = ref({ name: '', attendance: '', totalGuests: 1, message: '' })
const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)

const mockStories = [
  {
    title: 'First Encounter',
    date: 'Januari 2024',
    description: 'Pertemuan pertama yang membuka awal kisah perjalanan cinta kami berdua.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'A Promise to Forever',
    date: 'Februari 2026',
    description: 'Sebuah janji tulus untuk saling melengkapi dan melangkah bersama menuju masa depan.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
  }
]

// Navigation items with their corresponding keys in backend
const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'story', label: 'Story', icon: 'fa-solid fa-book-open', key: 'love-story' },
  { id: 'couple', label: 'Couple', icon: 'fa-solid fa-heart', key: 'couple' },
  { id: 'event', label: 'Event', icon: 'fa-solid fa-calendar-check', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' }
]

const isSectionEnabled = (key) => {
  if (!activeSections.value) return true
  const aliasMap = {
    couple: ['couple', 'photoCouple'],
    event: ['event', 'event-details', 'map'],
    hero: ['hero', 'cover'],
    'love-story': ['love-story', 'story'],
    'dress-code': ['dress-code', 'dressCode'],
    'extended-family': ['extended-family', 'turut-mengundang'],
    video: ['video', 'video-prewedding'],
    'live-streaming': ['live-streaming', 'live-stream']
  }
  const aliases = aliasMap[key] || [key]
  const section = activeSections.value.find(s => aliases.includes(s.key))
  return section ? (section.is_enabled !== false) : false
}

const navItems = computed(() => {
  if (!activeSections.value) return allNavItems
  return allNavItems.filter(item => {
    if (item.id === 'story') return isSectionEnabled('love-story') && (data.value.loveStory?.length > 0 || isPreviewMode.value)
    return isSectionEnabled(item.key)
  })
})
function getEmbedUrlVideo(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]
    const ampPos = videoId.indexOf('&')
    return `https://www.youtube.com/embed/${ampPos !== -1 ? videoId.substring(0, ampPos) : videoId}`
  }
  if (url.includes('youtu.be')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`
  return url
}

const activeSection = ref('home')

// Countdown
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-[1.5s]')
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
  if (choice.startsWith('http') || choice.startsWith('/')) return choice
  return `/audio/${choice}`
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatInstagramUrl(handle) {
  return `https://instagram.com/${handle.replace('@', '')}`
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  toast.success('Berhasil disalin!')
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
      countdown.value.Hari = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0')
      countdown.value.Jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
      countdown.value.Menit = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
      countdown.value.Detik = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
    }, 1000)
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) {
    toast.error("Mohon lengkapi formulir RSVP.")
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
    toast.success(`Konfirmasi terkirim!`)
  } catch (err) {
    console.error(err)
    toast.error("Gagal mengirim RSVP.")
  }
}

onMounted(() => { initData() })
onUnmounted(() => { if (interval) clearInterval(interval) })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>

.font-cinzel { font-family: 'Cinzel', serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-fade-in-up { animation: fadeInUp 1.5s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
