<template>
  <div class="relative min-h-screen bg-[#fdfbf7] overflow-hidden font-mont no-scrollbar text-[#3e4d3e] selection:bg-[#dce5db] selection:text-[#344033]">

    <!-- Rice Paper Texture Overlay -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>

    <!-- Floating Botanical Leaves (Embedded SVG) -->
    <div class="fixed -top-8 -left-8 w-40 h-40 md:w-60 md:h-60 z-10 opacity-80 pointer-events-none animate-float-slow">
       <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M0,0 C50,20 100,80 80,150 C40,120 10,70 0,0 Z" fill="#a3b6a0" opacity="0.4"/>
         <path d="M10,10 C60,25 110,90 90,160 C50,130 20,80 10,10 Z" fill="#839b7f" opacity="0.6"/>
       </svg>
    </div>
    <div class="fixed -bottom-8 -right-8 w-40 h-40 md:w-60 md:h-60 z-10 opacity-80 pointer-events-none animate-float-slow-reverse rotate-180">
       <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M0,0 C50,20 100,80 80,150 C40,120 10,70 0,0 Z" fill="#a3b6a0" opacity="0.4"/>
         <path d="M10,10 C60,25 110,90 90,160 C50,130 20,80 10,10 Z" fill="#839b7f" opacity="0.6"/>
       </svg>
    </div>

    <!-- Falling Petals Effect -->
    <div class="fixed inset-0 pointer-events-none z-20">
      <div v-for="n in 20" :key="n" class="petal" :style="getPetalStyle(n)"></div>
    </div>

    <!-- Music Control (autoplay on open) -->
    <MusicControl v-if="data.musicChoice && !showWelcome" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" primaryColor="#fdfbf7" accentColor="#657b62" :autoPlay="!showWelcome" />

    <!-- Mobile Bottom Navigation (Footer Menu) -->
    <nav v-if="!showWelcome"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/70 backdrop-blur-xl border border-[#dce5db] rounded-full shadow-xl max-w-[90%] overflow-x-auto no-scrollbar scroll-smooth transition-all duration-500 flex">
      <div class="flex items-center justify-center gap-6 px-6 py-3 mx-auto min-w-max">
        <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-1 transition-all duration-300 relative group shrink-0"
          :class="activeSection === item.id ? 'text-[#657b62] scale-110' : 'text-gray-400 hover:text-[#657b62]'">
          <i :class="[item.icon, 'text-lg']"></i>
          <span class="text-[8px] font-bold uppercase tracking-tighter">{{ item.label }}</span>
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c5a059] transition-all"
            :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"></span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade">
      <div v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#fdfbf7] transition-all duration-1000">
        <div class="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>

        <!-- Corner leaves -->
        <svg class="absolute top-0 left-0 w-32 md:w-56 opacity-80 animate-float-slow pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C50,20 100,80 80,150 C40,120 10,70 0,0 Z" fill="#a3b6a0" opacity="0.4"/>
          <path d="M10,10 C60,25 110,90 90,160 C50,130 20,80 10,10 Z" fill="#839b7f" opacity="0.6"/>
        </svg>
        <svg class="absolute bottom-0 right-0 w-32 md:w-56 opacity-80 rotate-180 animate-float-slow-reverse pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C50,20 100,80 80,150 C40,120 10,70 0,0 Z" fill="#a3b6a0" opacity="0.4"/>
          <path d="M10,10 C60,25 110,90 90,160 C50,130 20,80 10,10 Z" fill="#839b7f" opacity="0.6"/>
        </svg>

        <div class="relative z-10 space-y-8 animate-fade-in-up max-w-lg mx-auto">
          <div class="space-y-2">
            <p class="font-serif italic text-[#657b62] tracking-[0.4em] uppercase text-xs md:text-sm">The Wedding Of</p>
            <h1 class="font-script text-6xl md:text-8xl text-[#4e604d] leading-tight drop-shadow-sm py-2">
              {{ data.groomName?.split(' ')[0] || data.groomName }} &amp; {{ data.brideName?.split(' ')[0] || data.brideName }}
            </h1>
          </div>

          <div class="my-8 py-6 border-y border-[#c5d3c3] max-w-xs mx-auto space-y-1">
            <p class="text-[10px] uppercase tracking-widest text-[#657b62]">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p class="text-2xl font-serif font-semibold text-[#3e4d3e]">{{ data.guestName }}</p>
          </div>

          <button @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#657b62] text-white font-bold rounded-full transition-all hover:bg-[#4e604d] shadow-lg shadow-[#657b62]/20 text-sm uppercase tracking-widest">
            <i class="fa-solid fa-envelope-open text-xs"></i> Buka Undangan
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth">

      <!-- HERO SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative bg-[#eef2ee]/40">
        <!-- Watercolor blobs -->
        <div class="absolute top-[8%] left-[-15%] w-80 h-80 bg-[#dce5db] rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>
        <div class="absolute bottom-[8%] right-[-15%] w-80 h-80 bg-[#c5d3c3] rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>

        <div class="space-y-6 max-w-2xl mx-auto relative z-10" v-observe>
          <span class="inline-block px-4 py-1 border-y border-[#c5d3c3] text-[10px] uppercase tracking-[0.4em] text-[#657b62] font-bold">Save The Date</span>
          <h1 class="font-script text-6xl md:text-8xl leading-tight text-[#3e4d3e]">
            {{ data.groomName }} <br> <span class="text-3xl md:text-4xl text-[#c5a059]">&</span> <br> {{ data.brideName }}
          </h1>
          <p class="font-serif text-base md:text-lg text-[#4e604d] tracking-[0.2em] uppercase">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="flex justify-center gap-4 md:gap-8 mt-12">
            <div v-for="(val, label) in countdown" :key="label" class="flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#dce5db] px-3 py-2 md:px-5 md:py-3">
              <div class="text-2xl md:text-4xl font-serif font-bold text-[#4e604d]">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-widest text-[#657b62] font-bold mt-1">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-10 animate-bounce text-[#657b62]/50">
          <i class="fa-solid fa-chevron-down text-xl"></i>
        </div>
      </section>

      <!-- QUOTE -->
      <section v-if="isSectionEnabled('quote')" class="py-24 px-6 bg-[#fdfbf7]" v-observe>
        <div class="max-w-2xl mx-auto text-center">
          <div class="w-12 h-px bg-[#c5a059] mx-auto mb-8"></div>
          <p class="font-serif text-lg md:text-xl text-[#4e604d] italic leading-relaxed mb-8 px-4">
            "{{ data.quoteText }}"
          </p>
          <p class="text-xs font-bold text-[#657b62] tracking-[0.3em] uppercase">{{ data.quoteSource }}</p>
          <div class="w-12 h-px bg-[#c5a059] mx-auto mt-8"></div>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 px-6 bg-[#eef2ee]/40">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16" v-observe>
            <h2 class="font-script text-5xl md:text-6xl text-[#4e604d] mb-2">Cerita Kita</h2>
            <div class="w-16 h-px bg-[#c5a059] mx-auto"></div>
          </div>

          <div class="space-y-20 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-[#c5d3c3] hidden md:block">
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)" :key="idx" class="relative flex items-center justify-between" v-observe>
              <div class="w-[42%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                 <div class="space-y-3">
                    <span class="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">{{ story.date }}</span>
                    <h3 class="font-serif text-xl md:text-2xl font-semibold text-[#3e4d3e]">{{ story.title }}</h3>
                    <p class="text-sm text-[#657b62] leading-relaxed">{{ story.description }}</p>
                 </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#c5a059] border-4 border-white ring-1 ring-[#c5d3c3] z-10"></div>
              <div class="w-[42%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                 <img v-if="story.image || isPreviewMode" :src="story.image || 'https://via.placeholder.com/400x300'" class="rounded-3xl shadow-lg border-4 border-white aspect-video object-cover" />
              </div>
            </div>
          </div>

          <!-- Mobile Story -->
          <div class="md:hidden space-y-12">
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)" :key="idx" class="space-y-6 text-center" v-observe>
               <img v-if="story.image || isPreviewMode" :src="story.image || 'https://via.placeholder.com/400x300'" class="rounded-[2.5rem] shadow-md border-4 border-white w-full aspect-video object-cover" />
               <div class="px-4">
                  <span class="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">{{ story.date }}</span>
                  <h3 class="font-serif text-xl font-semibold text-[#3e4d3e] mb-2">{{ story.title }}</h3>
                  <p class="text-sm text-[#657b62] leading-relaxed">{{ story.description }}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-24 px-6 bg-[#fdfbf7]">
        <div class="max-w-5xl mx-auto text-center">
          <div class="mb-16" v-observe>
            <h2 class="font-script text-5xl md:text-6xl text-[#4e604d] mb-2">Mempelai</h2>
            <div class="w-16 h-px bg-[#c5a059] mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <!-- Groom -->
            <div class="space-y-6 flex flex-col items-center" v-observe>
              <div class="w-48 h-64 md:w-56 md:h-72 p-2 bg-white shadow-lg arch-frame relative">
                <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full arch-shape" />
                <svg class="absolute -bottom-5 -right-5 w-16 h-16" viewBox="0 0 100 100" fill="none"><path d="M50 0 C70 30 100 50 100 50 C100 50 70 70 50 100 C30 70 0 50 0 50 C0 50 30 30 50 0 Z" fill="#839b7f" opacity="0.3"/></svg>
              </div>
              <div class="pt-2">
                <h3 class="font-serif text-2xl md:text-3xl font-semibold text-[#3e4d3e]">{{ data.groomName }}</h3>
                <p class="text-xs uppercase tracking-widest text-[#c5a059] font-bold mt-2">Putra ke-{{ data.groomOrder || 'dua' }} dari</p>
                <p class="text-sm text-[#657b62] mt-1">{{ data.parents?.groomParents || 'Bpk. & Ibu' }}</p>
                <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                  target="_blank" class="inline-flex mt-4 text-[#657b62] hover:text-[#4e604d] transition-colors">
                  <i class="fa-brands fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            <!-- Bride -->
            <div class="space-y-6 flex flex-col items-center" v-observe>
              <div class="w-48 h-64 md:w-56 md:h-72 p-2 bg-white shadow-lg arch-frame relative">
                <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full arch-shape" />
                <svg class="absolute -top-5 -left-5 w-16 h-16" viewBox="0 0 100 100" fill="none"><path d="M50 0 C70 30 100 50 100 50 C100 50 70 70 50 100 C30 70 0 50 0 50 C0 50 30 30 50 0 Z" fill="#839b7f" opacity="0.3"/></svg>
              </div>
              <div class="pt-2">
                <h3 class="font-serif text-2xl md:text-3xl font-semibold text-[#3e4d3e]">{{ data.brideName }}</h3>
                <p class="text-xs uppercase tracking-widest text-[#c5a059] font-bold mt-2">Putri ke-{{ data.brideOrder || 'dua' }} dari</p>
                <p class="text-sm text-[#657b62] mt-1">{{ data.parents?.brideParents || 'Bpk. & Ibu' }}</p>
                <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)"
                  target="_blank" class="inline-flex mt-4 text-[#657b62] hover:text-[#4e604d] transition-colors">
                  <i class="fa-brands fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && (data.extendedFamily?.length || data.turutMengundang)" class="py-24 px-6 text-center border-y border-[#dce5db] bg-[#eef2ee]/40">
         <div class="max-w-4xl mx-auto space-y-12" v-observe>
            <h3 class="font-serif text-2xl md:text-3xl font-semibold text-[#3e4d3e]">Turut Mengundang</h3>
            <div class="flex flex-wrap justify-center gap-x-12 gap-y-6">
               <template v-if="Array.isArray(data.extendedFamily)">
                  <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="text-sm text-[#657b62] italic">
                     {{ person }}
                  </div>
               </template>
               <template v-else-if="typeof data.extendedFamily === 'string' && data.extendedFamily.trim()">
                  <div v-for="(person, idx) in data.extendedFamily.split(/,|\n/).map(s => s.trim()).filter(Boolean)" :key="idx" class="text-sm text-[#657b62] italic">
                     {{ person }}
                  </div>
               </template>
               <template v-else-if="data.turutMengundang">
                  <div v-for="(person, idx) in data.turutMengundang.split(/,|\n/).map(s => s.trim()).filter(Boolean)" :key="idx" class="text-sm text-[#657b62] italic">
                     {{ person }}
                  </div>
               </template>
            </div>
         </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-24 px-6 relative bg-[#fdfbf7]">
        <div class="max-w-4xl mx-auto text-center space-y-12">
          <div v-observe>
            <h2 class="font-script text-5xl md:text-6xl text-[#4e604d] mb-2">Waktu &amp; Tempat</h2>
            <div class="w-16 h-px bg-[#c5a059] mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <!-- Akad -->
            <div class="bg-white p-8 md:p-12 border-t-4 border-[#839b7f] shadow-lg rounded-[2rem] space-y-6 relative overflow-hidden" v-observe>
              <div class="absolute top-0 right-0 w-24 h-24 bg-[#eef2ee] rounded-bl-full -z-0"></div>
              <span class="text-3xl relative z-10">💍</span>
              <h3 class="font-serif text-2xl font-semibold text-[#3e4d3e] relative z-10">Akad Nikah</h3>
              <div class="space-y-2 text-sm text-[#657b62] font-medium relative z-10">
                <p class="uppercase tracking-widest">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                <p>{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
              </div>
              <p class="text-sm text-[#657b62]/70 italic relative z-10">{{ data.akadLocation?.description }}</p>
              <a :href="data.akadLocation?.mapUrl" target="_blank"
                class="relative z-10 inline-block px-8 py-3 border border-[#657b62] text-[#657b62] rounded-full hover:bg-[#657b62] hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                Lihat Lokasi
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="bg-white p-8 md:p-12 border-t-4 border-[#c5a059] shadow-lg rounded-[2rem] space-y-6 relative overflow-hidden" v-observe>
              <div class="absolute top-0 left-0 w-24 h-24 bg-[#faf6ec] rounded-br-full -z-0"></div>
              <span class="text-3xl relative z-10">🥂</span>
              <h3 class="font-serif text-2xl font-semibold text-[#3e4d3e] relative z-10">Resepsi</h3>
              <div class="space-y-2 text-sm text-[#657b62] font-medium relative z-10">
                <p class="uppercase tracking-widest">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                <p>{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
              </div>
              <p class="text-sm text-[#657b62]/70 italic relative z-10">{{ data.resepsiLocation?.description }}</p>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank"
                class="relative z-10 inline-block px-8 py-3 border border-[#657b62] text-[#657b62] rounded-full hover:bg-[#657b62] hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                Lihat Lokasi
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="pt-8 text-center" v-observe>
             <h3 class="font-serif text-lg md:text-xl text-[#3e4d3e] mb-4 italic">Dress Code</h3>
             <div class="bg-white p-6 rounded-[2rem] border border-[#dce5db] inline-block px-10 shadow-sm">
                <i class="fa-solid fa-shirt text-[#c5a059] text-xl mb-3 block"></i>
                <p class="text-[#657b62] text-sm font-medium">{{ data.dressCode }}</p>
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="pt-8 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-4 px-10 py-4 bg-[#3e4d3e] text-white rounded-full hover:bg-[#657b62] transition-all shadow-xl hover:-translate-y-1">
                <i class="fa-solid fa-tower-broadcast animate-pulse"></i>
                <span class="text-xs font-bold uppercase tracking-widest">Saksikan Virtual Wedding</span>
             </a>
          </div>

          <div v-observe>
            <button @click="addToCalendar"
              class="px-10 py-4 bg-[#657b62] text-white rounded-full font-bold hover:bg-[#4e604d] transition-all shadow-xl text-sm uppercase tracking-[0.2em]">
              Simpan Ke Kalender
            </button>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-24 px-4 bg-[#3e4d3e]">
        <div class="text-center mb-12" v-observe>
          <h2 class="font-script text-5xl md:text-6xl text-[#eef2ee] mb-2">Galeri Momen</h2>
          <div class="w-16 h-px bg-[#a3b6a0] mx-auto"></div>
        </div>
        <div class="max-w-6xl mx-auto">
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-24 px-6 bg-[#eef2ee]/40">
        <div class="max-w-2xl mx-auto bg-white border border-[#dce5db] rounded-[3rem] p-8 md:p-12 shadow-lg flex flex-col" style="max-height: 90vh;" v-observe>
          <div class="text-center mb-8 flex-shrink-0">
            <h2 class="font-script text-4xl md:text-5xl text-[#4e604d] mb-2">RSVP &amp; Ucapan</h2>
            <div class="w-12 h-px bg-[#c5a059] mx-auto mb-3"></div>
            <p class="text-[#657b62] text-sm">Konfirmasi kehadiran Anda di hari bahagia kami</p>
          </div>

          <form @submit.prevent="submitRSVP" class="space-y-4 flex-shrink-0">
            <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap"
              class="w-full bg-[#fdfbf7] border border-[#dce5db] rounded-2xl px-6 py-4 text-[#3e4d3e] focus:outline-none focus:border-[#657b62] transition-colors placeholder-gray-300"
              required />

            <div class="grid grid-cols-3 gap-3">
              <label v-for="opt in [{v:'hadir',l:'Hadir'},{v:'tidak',l:'Maaf'},{v:'ragu',l:'Ragu'}]" :key="opt.v"
                class="flex items-center justify-center py-3 rounded-2xl cursor-pointer border transition-all text-sm font-bold uppercase tracking-tighter"
                :class="rsvp.attendance === opt.v ? 'bg-[#657b62] border-[#657b62] text-white' : 'bg-white border-[#dce5db] text-gray-400 hover:bg-gray-50'">
                <input type="radio" :value="opt.v" v-model="rsvp.attendance" class="hidden"> {{ opt.l }}
              </label>
            </div>

            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuests"
              class="w-full bg-[#fdfbf7] border border-[#dce5db] rounded-2xl px-6 py-4 text-[#3e4d3e] focus:outline-none focus:border-[#657b62]">
              <option value="" disabled>Jumlah Tamu</option>
              <option v-for="_ in 5" :key="_" :value="_">{{ _ }} Orang</option>
            </select>

            <textarea v-model="rsvp.message" rows="3" placeholder="Ucapan & Doa Terbaik"
              class="w-full bg-[#fdfbf7] border border-[#dce5db] rounded-2xl px-6 py-3 text-[#3e4d3e] focus:outline-none focus:border-[#657b62] placeholder-gray-300"></textarea>

            <button type="submit"
              class="w-full py-4 bg-[#657b62] text-white font-bold rounded-2xl transition-all shadow-lg hover:bg-[#4e604d] uppercase tracking-widest text-sm">
              Kirim Konfirmasi
            </button>
          </form>

          <!-- Guest Messages -->
          <div v-if="guestMessages.length" class="mt-6 flex-1 overflow-y-auto no-scrollbar space-y-3 pt-4 border-t border-[#dce5db]">
            <div v-for="(msg, i) in guestMessages" :key="i"
              class="bg-[#fdfbf7] p-4 rounded-2xl border-l-4 text-left"
              :class="msg.rsvpStatus === 'hadir' ? 'border-[#839b7f]' : 'border-[#c5d3c3]'">
              <div class="flex justify-between items-start gap-2 mb-1">
                <span class="text-sm font-bold text-[#3e4d3e]">{{ msg.guestName }}</span>
                <span class="text-[10px] text-[#c5a059] shrink-0">{{ timeAgo(msg.createdAt) }}</span>
              </div>
              <span class="inline-block text-[9px] px-2 py-0.5 rounded-full font-bold mb-1"
                :class="msg.rsvpStatus === 'hadir' ? 'bg-[#eef2ee] text-[#4e604d]' : 'bg-gray-100 text-gray-500'">
                {{ msg.rsvpStatus === 'hadir' ? '✓ Hadir' : '✗ Tidak Hadir' }}
              </span>
              <p v-if="msg.message" class="text-xs text-[#657b62] italic leading-relaxed line-clamp-2">"{{ msg.message }}"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="data.videoPrewedding && isSectionEnabled('video')" class="py-24 px-6 bg-[#fdfbf7]">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="font-script text-4xl md:text-5xl text-[#4e604d] mb-10" v-observe>Video Prewedding</h2>
          <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#dce5db]">
            <iframe :src="getEmbedUrlVideo(data.videoPrewedding)" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <!-- MENU -->
      <section v-if="data.menu?.items?.length && isSectionEnabled('menu')" class="py-24 px-6 bg-white">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="font-script text-4xl md:text-5xl text-[#4e604d] mb-10" v-observe>{{ data.menu.title || 'Menu Hidangan' }}</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(item, idx) in data.menu.items" :key="idx"
              class="bg-[#fdfbf7] p-6 rounded-2xl border border-[#dce5db] hover:border-[#657b62]/40 transition-colors text-left" v-observe>
              <h4 class="font-serif text-base font-semibold text-[#3e4d3e]">{{ item.name || item }}</h4>
            </div>
          </div>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.eWalletLink?.length)" id="gift" class="py-24 px-6 text-center bg-[#fdfbf7]">
        <div v-observe>
          <h2 class="font-script text-5xl md:text-6xl text-[#4e604d] mb-2">Wedding Gift</h2>
          <div class="w-16 h-px bg-[#c5a059] mx-auto mb-4"></div>
        </div>
        <p class="text-[#657b62] mb-12 max-w-md mx-auto text-sm">Doa restu Anda sudah lebih dari cukup bagi kami, namun jika ingin memberikan tanda kasih, silakan melalui:</p>

        <div class="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          <div v-for="(bank, idx) in data.bankAccounts" :key="idx"
            class="bg-white border border-[#dce5db] p-8 rounded-[2rem] w-full sm:w-80 shadow-sm hover:shadow-md transition-all" v-observe>
            <div class="h-10 flex items-center justify-center mb-6 text-[#657b62] font-bold text-xl tracking-widest uppercase">
              {{ bank.bankName }}
            </div>
            <p class="text-xl text-[#3e4d3e] font-mono mb-2 tracking-tighter">{{ bank.accountNumber }}</p>
            <p class="text-xs text-[#657b62] mb-6 uppercase tracking-widest">a.n {{ bank.accountName }}</p>
            <button @click="copyToClipboard(bank.accountNumber)"
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#657b62] border border-[#657b62] px-6 py-2 rounded-full hover:bg-[#657b62] hover:text-white transition-all">
              Salin Nomor
            </button>
          </div>
        </div>

        <!-- Physical Gift Address -->
        <div v-if="data.giftDeliveryAddress" class="mt-8 max-w-lg mx-auto" v-observe>
          <div class="bg-white border border-[#dce5db] p-8 rounded-[2rem] shadow-sm text-center space-y-3">
            <i class="fa-solid fa-gift text-[#c5a059] text-xl block"></i>
            <h3 class="font-serif text-base font-semibold text-[#3e4d3e]">Kirim Kado Fisik</h3>
            <p class="text-sm text-[#657b62] italic leading-relaxed">
              "{{ Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress }}"
            </p>
            <button @click="copyToClipboard(Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress)"
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#657b62] border border-[#657b62] px-6 py-2 rounded-full hover:bg-[#657b62] hover:text-white transition-all">
              Salin Alamat
            </button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-24 bg-[#eef2ee]/50 text-center border-t border-[#dce5db] relative overflow-hidden">
        <svg class="absolute top-0 left-0 w-32 md:w-48 opacity-30 pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C50,20 100,80 80,150 C40,120 10,70 0,0 Z" fill="#a3b6a0" opacity="0.4"/>
        </svg>
        <div class="relative z-10">
          <p class="font-serif italic text-[#4e604d] text-lg mb-4">Terima Kasih</p>
          <h2 class="font-script text-5xl md:text-6xl text-[#3e4d3e] mb-4">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
          <p v-if="data.footerText" class="text-[#657b62] text-sm mb-8 max-w-lg mx-auto px-6 italic">{{ data.footerText }}</p>
          <div class="w-16 h-px bg-[#c5a059] mx-auto mb-8"></div>
          <p v-if="data.show_branding" class="text-gray-400 text-[10px] tracking-[0.4em] uppercase font-bold">Created with SatuUndangan</p>
        </div>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const data = ref(props.data || {})

watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
  },
  { deep: true, immediate: true },
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)

const mockStories = [
  {
    title: 'First Date',
    date: 'Jan 2024',
    description: 'Where it all began at a small vintage cafe.',
  },
  {
    title: 'The Proposal',
    date: 'Feb 2026',
    description: 'Under the starlight, we promised to be together forever.',
  },
]

const showWelcome = ref(true)
const galleryImages = ref([])
const guestMessages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })

// Navigation items with their corresponding keys in backend
const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'story', label: 'Story', icon: 'fa-solid fa-feather', key: 'love-story' },
  { id: 'couple', label: 'Couple', icon: 'fa-solid fa-heart', key: 'couple' },
  { id: 'event', label: 'Event', icon: 'fa-solid fa-calendar-check', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' },
  { id: 'gift', label: 'Gift', icon: 'fa-solid fa-gift', key: 'gift' }
]

const navItems = computed(() => {
  return allNavItems.filter((item) => {
    if (item.id === 'home') return true
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

const isSectionEnabled = (key) => {
  if (data.value.selectedSections === undefined || data.value.selectedSections === null) return true
  return data.value.selectedSections.includes(key)
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
  const duration = 6 + Math.random() * 10
  const delay = Math.random() * duration
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

function timeAgo(date) {
  if (!date) return ''
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  let interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' bulan lalu'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' hari lalu'
  return 'Baru saja'
}

async function loadWishes() {
  if (data.value.id && data.value.id !== 'live-preview' && data.value.id !== 0) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res
    } catch (err) {}
  } else {
    guestMessages.value = [
      { guestName: 'Budi & Keluarga', message: 'Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah.', rsvpStatus: 'hadir', createdAt: new Date() },
      { guestName: 'Siti Rahayu', message: 'MasyaAllah, cantik banget! Barakallahu lakuma.', rsvpStatus: 'hadir', createdAt: new Date() },
    ]
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatInstagramUrl(handle) {
  if (!handle) return '#'
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
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
    loadWishes()
  } catch (err) {
    console.error(err)
    toast.error("Gagal mengirim RSVP.")
  }
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }

  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  }

  loadWishes()

  const targetDate = data.value.akadLocation?.dateTime || data.value.dateTime
  if (targetDate) {
    const target = new Date(targetDate).getTime()
    if (!isNaN(target)) {
      if (interval) clearInterval(interval)
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
}

onMounted(() => { initData() })
onUnmounted(() => { if (interval) clearInterval(interval) })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap');

.font-mont { font-family: 'Montserrat', sans-serif; }
.font-serif { font-family: 'Cormorant Garamond', serif; }
.font-script { font-family: 'Great Vibes', cursive; }

/* Arch-shaped profile photos */
.arch-shape {
  border-radius: 1000px 1000px 10px 10px;
  object-fit: cover;
}
.arch-frame {
  border-radius: 110px 110px 16px 16px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-float-slow { animation: float 10s ease-in-out infinite; }
.animate-float-slow-reverse { animation: float 12s ease-in-out infinite reverse; }
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(3deg); }
}

.petal {
  position: absolute;
  background: #c5d3c3;
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
