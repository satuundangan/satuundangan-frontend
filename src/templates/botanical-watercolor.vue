<template>
  <div class="relative min-h-screen bg-[#fdfaf5] overflow-hidden font-sans no-scrollbar text-[#4a4a4a] selection:bg-[#e8d5c4]">
    
    <!-- Paper Texture Overlay -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

    <!-- Floating Watercolors (Embedded SVG for 100% stability) -->
    <div class="fixed -top-10 -left-10 w-48 h-48 md:w-64 md:h-64 z-10 opacity-30 pointer-events-none animate-float-slow text-[#b48c5b]">
       <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path d="M0 0C50 0 100 20 120 70C140 120 180 140 200 140V0H0Z" opacity="0.2"/>
         <path d="M40 20C60 20 70 40 70 60C70 80 50 90 30 80C10 70 10 40 40 20Z" opacity="0.5"/>
         <path d="M80 50C100 50 110 70 110 90C110 110 90 120 70 110C50 100 50 70 80 50Z" opacity="0.4"/>
         <path d="M20 70C40 70 50 90 50 110C50 130 30 140 10 130C-10 120 -10 90 20 70Z" opacity="0.3"/>
       </svg>
    </div>
    <div class="fixed -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 z-10 opacity-30 pointer-events-none animate-float-slow-reverse text-[#b48c5b]">
       <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="rotate-180">
         <path d="M0 0C50 0 100 20 120 70C140 120 180 140 200 140V0H0Z" opacity="0.2"/>
         <path d="M40 20C60 20 70 40 70 60C70 80 50 90 30 80C10 70 10 40 40 20Z" opacity="0.5"/>
         <path d="M80 50C100 50 110 70 110 90C110 110 90 120 70 110C50 100 50 70 80 50Z" opacity="0.4"/>
         <path d="M20 70C40 70 50 90 50 110C50 130 30 140 10 130C-10 120 -10 90 20 70Z" opacity="0.3"/>
       </svg>
    </div>

    <!-- Falling Petals Effect -->
    <div class="fixed inset-0 pointer-events-none z-20">
      <div v-for="n in 15" :key="n" class="petal" :style="getPetalStyle(n)"></div>
    </div>

    <!-- Music Control -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" />

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/70 backdrop-blur-xl border border-[#e8d5c4] rounded-full px-6 py-3 flex items-center justify-center gap-6 shadow-xl w-fit max-w-[90%] md:hidden transition-all duration-500">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300 relative group"
        :class="activeSection === item.id ? 'text-[#b48c5b] scale-110' : 'text-gray-400 hover:text-[#b48c5b]'">
        <i :class="[item.icon, 'text-lg']"></i>
        <span class="text-[8px] font-bold uppercase tracking-tighter">{{ item.label }}</span>
        <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#b48c5b] transition-all"
          :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"></span>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade">
      <div v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#fdfaf5] transition-all duration-1000">
        <div class="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        
        <div class="relative z-10 space-y-8 animate-fade-in-up">
          <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 flex items-center justify-center relative">
             <div class="absolute inset-0 border border-[#e8d5c4] rounded-full animate-spin-slow"></div>
             <span class="text-3xl">🌸</span>
          </div>

          <div class="space-y-2">
            <h1 class="text-xs md:text-sm tracking-[0.5em] uppercase text-[#b48c5b] font-semibold">The Wedding Celebration Of</h1>
            <div class="py-4">
              <h2 class="text-5xl md:text-7xl font-playfair text-[#4a4a4a]" v-html="data.groomName"></h2>
              <div class="text-2xl md:text-3xl font-playfair italic text-[#b48c5b] my-2">&</div>
              <h2 class="text-5xl md:text-7xl font-playfair text-[#4a4a4a]" v-html="data.brideName"></h2>
            </div>
          </div>

          <div class="max-w-xs mx-auto space-y-4 pt-6">
            <div class="space-y-1">
               <p class="text-[10px] uppercase tracking-widest text-gray-400">Kepada Yth. Bapak/Ibu/Saudara/i</p>
               <p class="text-2xl font-playfair font-bold text-[#4a4a4a]">{{ data.guestName }}</p>
            </div>
            <button @click="openInvitation"
              class="w-full py-4 bg-[#b48c5b] text-white font-bold rounded-full transition-all hover:bg-[#9a754a] shadow-lg shadow-[#b48c5b]/20 flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
              <i class="fa-solid fa-envelope-open text-xs"></i> Buka Undangan
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth">
      
      <!-- HERO SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div class="space-y-6 max-w-2xl mx-auto" v-observe>
          <span class="inline-block px-4 py-1 border-y border-[#e8d5c4] text-[10px] uppercase tracking-[0.4em] text-[#b48c5b] font-bold">Save The Date</span>
          <h1 class="text-5xl md:text-8xl font-playfair leading-tight text-[#4a4a4a]">
            {{ data.groomName }} <br> <span class="text-3xl italic text-[#b48c5b]">&</span> <br> {{ data.brideName }}
          </h1>
          <p class="text-sm md:text-base text-gray-500 font-medium tracking-[0.2em] uppercase">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="flex justify-center gap-4 md:gap-8 mt-12">
            <div v-for="(val, label) in countdown" :key="label" class="flex flex-col items-center">
              <div class="text-3xl md:text-5xl font-playfair text-[#4a4a4a]">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-widest text-[#b48c5b] font-bold mt-1">{{ label }}</div>
            </div>
          </div>
        </div>
        
        <div class="absolute bottom-10 animate-bounce text-[#b48c5b]/50">
          <i class="fa-solid fa-chevron-down text-xl"></i>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-24 px-6 bg-white/30" v-observe>
        <div class="max-w-2xl mx-auto text-center">
          <div class="w-12 h-px bg-[#e8d5c4] mx-auto mb-8"></div>
          <p class="text-base md:text-xl text-gray-600 italic leading-relaxed font-light mb-8 px-4">
            "{{ data.quoteText }}"
          </p>
          <p class="text-xs font-bold text-[#b48c5b] tracking-[0.3em] uppercase">{{ data.quoteSource }}</p>
          <div class="w-12 h-px bg-[#e8d5c4] mx-auto mt-8"></div>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-24 px-6">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-5xl font-playfair text-center text-[#4a4a4a] mb-16" v-observe>Cerita Kita</h2>
          
          <div class="space-y-20 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-[#e8d5c4] hidden md:block">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="relative flex items-center justify-between" v-observe>
              <div class="w-[42%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                 <div class="space-y-3">
                    <span class="text-[10px] font-bold text-[#b48c5b] uppercase tracking-widest">{{ story.date }}</span>
                    <h3 class="text-xl md:text-2xl font-playfair text-[#4a4a4a]">{{ story.title }}</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">{{ story.description }}</p>
                 </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#b48c5b] border-4 border-white ring-1 ring-[#e8d5c4] z-10"></div>
              <div class="w-[42%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                 <img v-if="story.image" :src="story.image" class="rounded-3xl shadow-lg border-4 border-white aspect-video object-cover" />
              </div>
            </div>
          </div>

          <!-- Mobile Story -->
          <div class="md:hidden space-y-12">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="space-y-6 text-center" v-observe>
               <img v-if="story.image" :src="story.image" class="rounded-[2.5rem] shadow-md border-4 border-white w-full aspect-video object-cover" />
               <div class="px-4">
                  <span class="text-[10px] font-bold text-[#b48c5b] uppercase tracking-widest">{{ story.date }}</span>
                  <h3 class="text-xl font-playfair text-[#4a4a4a] mb-2">{{ story.title }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">{{ story.description }}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-24 px-6">
        <div class="max-w-5xl mx-auto text-center">
          <h2 class="text-3xl md:text-5xl font-playfair text-[#4a4a4a] mb-16" v-observe>The Bride & Groom</h2>
          
          <div class="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <!-- Groom -->
            <div class="space-y-6" v-observe>
              <div class="relative mx-auto w-64 h-80 md:w-72 md:h-96">
                <div class="absolute inset-4 border border-[#e8d5c4] translate-x-4 translate-y-4 -z-10"></div>
                <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x600'" 
                  class="w-full h-full object-cover shadow-xl" />
              </div>
              <div class="pt-4">
                <h3 class="text-2xl md:text-4xl font-playfair text-[#4a4a4a]">{{ data.groomName }}</h3>
                <p class="text-xs uppercase tracking-widest text-[#b48c5b] font-bold mt-2">Putra Dari</p>
                <p class="text-sm text-gray-500 mt-1">{{ data.parents?.groomParents }}</p>
                <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" 
                  target="_blank" class="inline-flex mt-4 text-[#b48c5b] hover:text-[#9a754a] transition-colors">
                  <i class="fa-brands fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            <!-- Bride -->
            <div class="space-y-6" v-observe>
              <div class="relative mx-auto w-64 h-80 md:w-72 md:h-96">
                <div class="absolute inset-4 border border-[#e8d5c4] -translate-x-4 translate-y-4 -z-10"></div>
                <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x600'" 
                  class="w-full h-full object-cover shadow-xl" />
              </div>
              <div class="pt-4">
                <h3 class="text-2xl md:text-4xl font-playfair text-[#4a4a4a]">{{ data.brideName }}</h3>
                <p class="text-xs uppercase tracking-widest text-[#b48c5b] font-bold mt-2">Putri Dari</p>
                <p class="text-sm text-gray-500 mt-1">{{ data.parents?.brideParents }}</p>
                <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" 
                  target="_blank" class="inline-flex mt-4 text-[#b48c5b] hover:text-[#9a754a] transition-colors">
                  <i class="fa-brands fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-24 px-6 text-center border-y border-[#e8d5c4]/30 bg-white/20">
         <div class="max-w-4xl mx-auto space-y-12" v-observe>
            <h3 class="text-2xl md:text-3xl font-playfair text-[#4a4a4a]">Turut Mengundang</h3>
            <div class="flex flex-wrap justify-center gap-x-12 gap-y-6">
               <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="text-sm text-gray-500 italic">
                  {{ person }}
               </div>
            </div>
         </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-24 px-6 relative bg-white/50">
        <div class="max-w-4xl mx-auto text-center space-y-12">
          <h2 class="text-3xl md:text-5xl font-playfair text-[#4a4a4a]" v-observe>Event Details</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Akad -->
            <div class="bg-white p-8 md:p-12 border border-[#e8d5c4]/50 shadow-sm rounded-[2rem] space-y-6" v-observe>
              <span class="text-3xl">💍</span>
              <h3 class="text-2xl font-playfair text-[#4a4a4a]">Akad Nikah</h3>
              <div class="space-y-2 text-sm text-gray-500 font-medium">
                <p class="uppercase tracking-widest">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                <p>{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
              </div>
              <p class="text-sm text-gray-400 italic">{{ data.akadLocation?.description }}</p>
              <a :href="data.akadLocation?.mapUrl" target="_blank"
                class="inline-block px-8 py-3 bg-[#fdfaf5] border border-[#e8d5c4] text-[#b48c5b] rounded-full hover:bg-[#b48c5b] hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                Lihat Lokasi
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="bg-white p-8 md:p-12 border border-[#e8d5c4]/50 shadow-sm rounded-[2rem] space-y-6" v-observe>
              <span class="text-3xl">🥂</span>
              <h3 class="text-2xl font-playfair text-[#4a4a4a]">Resepsi</h3>
              <div class="space-y-2 text-sm text-gray-500 font-medium">
                <p class="uppercase tracking-widest">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                <p>{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
              </div>
              <p class="text-sm text-gray-400 italic">{{ data.resepsiLocation?.description }}</p>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank"
                class="inline-block px-8 py-3 bg-[#fdfaf5] border border-[#e8d5c4] text-[#b48c5b] rounded-full hover:bg-[#b48c5b] hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                Lihat Lokasi
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="pt-8 text-center" v-observe>
             <h3 class="text-lg md:text-xl font-playfair text-[#4a4a4a] mb-4 italic">Dress Code</h3>
             <div class="bg-[#fdfaf5] p-6 rounded-[2rem] border border-[#e8d5c4] inline-block px-10">
                <i class="fa-solid fa-shirt text-[#b48c5b] text-xl mb-3 block"></i>
                <p class="text-gray-500 text-sm font-medium">{{ data.dressCode }}</p>
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="pt-8 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-4 px-10 py-4 bg-[#4a4a4a] text-white rounded-full hover:bg-[#b48c5b] transition-all shadow-xl hover:-translate-y-1">
                <i class="fa-solid fa-tower-broadcast animate-pulse"></i>
                <span class="text-xs font-bold uppercase tracking-widest">Saksikan Virtual Wedding</span>
             </a>
          </div>

          <div v-observe>
            <button @click="addToCalendar"
              class="px-10 py-4 bg-[#b48c5b] text-white rounded-full font-bold hover:bg-[#9a754a] transition-all shadow-xl text-sm uppercase tracking-[0.2em]">
              Simpan Ke Kalender
            </button>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-24 px-4">
        <h2 class="text-3xl md:text-5xl font-playfair text-center text-[#4a4a4a] mb-12" v-observe>Moments Gallery</h2>
        <div class="max-w-6xl mx-auto">
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-24 px-6 bg-[#fdfaf5]">
        <div class="max-w-2xl mx-auto bg-white border border-[#e8d5c4] rounded-[3rem] p-8 md:p-16 shadow-lg text-center" v-observe>
          <h2 class="text-3xl font-playfair text-[#4a4a4a] mb-2">RSVP</h2>
          <p class="text-gray-400 mb-10 text-sm">Konfirmasi kehadiran Anda di hari bahagia kami</p>

          <form @submit.prevent="submitRSVP" class="space-y-6">
            <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap"
              class="w-full bg-[#fdfaf5] border border-[#e8d5c4] rounded-2xl px-6 py-4 text-[#4a4a4a] focus:outline-none focus:border-[#b48c5b] transition-colors placeholder-gray-300"
              required />

            <div class="grid grid-cols-3 gap-4">
              <label v-for="opt in [{v:'hadir',l:'Hadir'},{v:'tidak',l:'Maaf'},{v:'ragu',l:'Ragu'}]" :key="opt.v"
                class="flex items-center justify-center py-4 rounded-2xl cursor-pointer border transition-all text-sm font-bold uppercase tracking-tighter"
                :class="rsvp.attendance === opt.v ? 'bg-[#b48c5b] border-[#b48c5b] text-white' : 'bg-white border-[#e8d5c4] text-gray-400 hover:bg-gray-50'">
                <input type="radio" :value="opt.v" v-model="rsvp.attendance" class="hidden"> {{ opt.l }}
              </label>
            </div>

            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuests"
              class="w-full bg-[#fdfaf5] border border-[#e8d5c4] rounded-2xl px-6 py-4 text-[#4a4a4a] focus:outline-none focus:border-[#b48c5b]">
              <option value="" disabled>Jumlah Tamu</option>
              <option v-for="_ in 5" :key="_" :value="_">{{ _ }} Orang</option>
            </select>

            <textarea v-model="rsvp.message" rows="4" placeholder="Ucapan & Doa Terbaik"
              class="w-full bg-[#fdfaf5] border border-[#e8d5c4] rounded-2xl px-6 py-4 text-[#4a4a4a] focus:outline-none focus:border-[#b48c5b] placeholder-gray-300"></textarea>

            <button type="submit"
              class="w-full py-5 bg-[#b48c5b] text-white font-bold rounded-2xl transition-all shadow-lg hover:bg-[#9a754a] uppercase tracking-widest text-sm">
              Kirim Konfirmasi
            </button>
          </form>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="data.videoPrewedding && isSectionEnabled('video')" class="py-24 px-6 bg-[#fdfaf5]">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-playfair text-[#4a4a4a] mb-10" v-observe>Video Prewedding</h2>
          <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#e8d5c4]/30">
            <iframe :src="getEmbedUrlVideo(data.videoPrewedding)" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <!-- MENU -->
      <section v-if="data.menu?.items?.length && isSectionEnabled('menu')" class="py-24 px-6 bg-white">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-playfair text-[#4a4a4a] mb-10" v-observe>{{ data.menu.title || 'Menu Hidangan' }}</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(item, idx) in data.menu.items" :key="idx"
              class="bg-[#fdfaf5] p-6 rounded-2xl border border-[#e8d5c4]/40 hover:border-[#b48c5b]/40 transition-colors text-left" v-observe>
              <h4 class="text-base font-playfair text-[#4a4a4a]">{{ item.name || item }}</h4>
            </div>
          </div>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length && isSectionEnabled('gift')" class="py-24 px-6 text-center">
        <h2 class="text-3xl font-playfair text-[#4a4a4a] mb-4" v-observe>Wedding Gift</h2>
        <p class="text-gray-400 mb-12 max-w-md mx-auto text-sm">Doa restu Anda sudah lebih dari cukup bagi kami, namun jika ingin memberikan tanda kasih, silakan melalui:</p>

        <div class="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          <div v-for="(bank, idx) in data.bankAccounts" :key="idx"
            class="bg-white border border-[#e8d5c4] p-8 rounded-[2rem] w-full sm:w-80 shadow-sm hover:shadow-md transition-all" v-observe>
            <div class="h-10 flex items-center justify-center mb-6 text-[#b48c5b] font-bold text-xl tracking-widest uppercase">
              {{ bank.bankName }}
            </div>
            <p class="text-xl text-[#4a4a4a] font-mono mb-2 tracking-tighter">{{ bank.accountNumber }}</p>
            <p class="text-xs text-gray-400 mb-6 uppercase tracking-widest">a.n {{ bank.accountName }}</p>
            <button @click="copyToClipboard(bank.accountNumber)"
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b48c5b] border border-[#b48c5b] px-6 py-2 rounded-full hover:bg-[#b48c5b] hover:text-white transition-all">
              Salin Nomor
            </button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-24 bg-[#fdfaf5] text-center border-t border-[#e8d5c4]">
        <h2 class="font-playfair text-4xl text-[#4a4a4a] mb-4">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p v-if="data.footerText" class="text-gray-400 text-sm mb-8 max-w-lg mx-auto px-6 italic">{{ data.footerText }}</p>
        <div class="w-16 h-px bg-[#e8d5c4] mx-auto mb-8"></div>
        <p class="text-gray-300 text-[10px] tracking-[0.4em] uppercase font-bold">Created with SatuUndangan</p>
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
  // Structure 1: data.sections (direct from template)
  if (data.value.sections && Array.isArray(data.value.sections)) {
    return data.value.sections
  }
  // Structure 2: data.content.selectedSections (from invitation content)
  if (data.value.content?.selectedSections && Array.isArray(data.value.content.selectedSections)) {
    return data.value.content.selectedSections.map(s => typeof s === 'string' ? { key: s, is_enabled: true } : s)
  }
  // Structure 3: data.selectedSections (root of invitation)
  if (data.value.selectedSections && Array.isArray(data.value.selectedSections)) {
    return data.value.selectedSections.map(s => typeof s === 'string' ? { key: s, is_enabled: true } : s)
  }
  return null
})

const showWelcome = ref(true)
const galleryImages = ref([])
const rsvp = ref({ name: '', attendance: '', totalGuests: 1, message: '' })

// Navigation items with their corresponding keys in backend
const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'couple', label: 'Couple', icon: 'fa-solid fa-heart', key: 'couple' },
  { id: 'story', label: 'Story', icon: 'fa-solid fa-book-heart', key: 'love-story' },
  { id: 'event', label: 'Event', icon: 'fa-solid fa-calendar-check', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' }
]

const navItems = computed(() => {
  // If no sections defined in data, show all as fallback
  if (!activeSections.value) return allNavItems

  return allNavItems.filter(item => {
    const sectionSettings = activeSections.value.find(s => s.key === item.key)
    return sectionSettings ? (sectionSettings.is_enabled !== false) : true
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

const isSectionEnabled = (key) => {
  if (!activeSections.value) return true
  const section = activeSections.value.find(s => s.key === key)
  return section ? (section.is_enabled !== false) : true
}

const activeSection = ref('home')

// Countdown
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-1000')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-8')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    observer.observe(el)
  }
}

function getPetalStyle(_n) {
  const left = Math.random() * 100
  const duration = 5 + Math.random() * 10
  const delay = Math.random() * 10
  const size = 10 + Math.random() * 15
  return {
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `-${delay}s`,
    width: `${size}px`,
    height: `${size * 0.7}px`,
    opacity: 0.3 + Math.random() * 0.4
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

function addToCalendar() {
  const event = {
    title: `Wedding of ${data.value.groomName} & ${data.value.brideName}`,
    start: new Date(data.value.akadLocation?.dateTime || Date.now()).toISOString().replace(/-|:|\.\d\d\d/g, ""),
    description: "Kami mengundang Anda untuk hadir di pernikahan kami."
  }
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.start}&details=${encodeURIComponent(event.description)}`
  window.open(url, '_blank')
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

function initData() {
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  } else {
    galleryImages.value = [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400' },
      { src: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=400' }
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

onMounted(() => { initData() })
onUnmounted(() => { if (interval) clearInterval(interval) })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');

.font-playfair { font-family: 'Playfair Display', serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-spin-slow { animation: spin 15s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.animate-float-slow { animation: float 10s ease-in-out infinite; }
.animate-float-slow-reverse { animation: float 12s ease-in-out infinite reverse; }
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.petal {
  position: absolute;
  background: #fbcfe8;
  border-radius: 150% 0 150% 0;
  top: -20px;
  animation: fall linear infinite;
  z-index: 20;
}

@keyframes fall {
  0% { transform: translateY(0) rotate(0); }
  100% { transform: translateY(110vh) rotate(720deg); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
