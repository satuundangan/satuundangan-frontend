<template>
  <div class="love-line-root relative min-h-screen bg-[#FAF6F4] text-[#2A221E] font-grotesk overflow-x-hidden selection:bg-[#A05A4F]/20 selection:text-[#A05A4F]">

    <!-- Subtle Continuous Line Background Texture & Watermark -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-25 select-none overflow-hidden">
      <!-- Continuous line decorative SVG curves -->
      <svg class="absolute -top-24 -left-24 w-[500px] h-[500px] text-[#A05A4F]/20" viewBox="0 0 400 400" fill="none" stroke="currentColor" stroke-width="1.2">
        <path d="M 50,150 C 120,50 200,220 280,120 C 340,40 380,260 250,320 C 120,380 30,220 50,150 Z" stroke-dasharray="3 3" />
        <path d="M 120,80 C 180,140 140,240 220,280 C 300,320 360,180 300,100" />
      </svg>
      <svg class="absolute -bottom-32 -right-24 w-[550px] h-[550px] text-[#A05A4F]/20" viewBox="0 0 400 400" fill="none" stroke="currentColor" stroke-width="1.2">
        <path d="M 80,320 C 160,380 240,220 320,300 C 380,360 360,140 240,100 C 120,60 40,200 80,320 Z" stroke-dasharray="4 4" />
      </svg>
    </div>

    <!-- Music Control Component -->
    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#FAF6F4"
      accentColor="#A05A4F"
      class="z-[65]"
    />

    <!-- Bottom Navigation Bar (Mobile / Compact) -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-[#A05A4F]/20 rounded-full shadow-xl shadow-[#A05A4F]/10 px-4 py-2.5 max-w-[94%] md:max-w-md w-full flex items-center justify-between no-scrollbar transition-all duration-500 animate-slide-up"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="scrollToSection(item.id)"
        type="button"
        class="flex flex-col items-center gap-1 min-w-[38px] transition-all duration-300 relative group shrink-0"
        :class="activeSection === item.id ? 'text-[#A05A4F] scale-105 font-bold' : 'text-[#7D6E68] hover:text-[#A05A4F]'"
      >
        <i :class="[item.icon, 'text-sm md:text-base transition-transform group-hover:scale-110']"></i>
        <span class="text-[8px] md:text-[9px] font-mono tracking-wider uppercase">{{ item.label }}</span>
        <span
          class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A05A4F] transition-all duration-300"
          :class="activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
        ></span>
      </button>
    </nav>

    <!-- WELCOME / GATE COVER SCREEN -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[70] flex flex-col items-center justify-center text-center px-6 bg-[#FAF6F4] overflow-hidden"
      >
        <!-- Background Decorative Arch Lines -->
        <div class="absolute inset-4 md:inset-8 border border-[#A05A4F]/25 rounded-[32px] md:rounded-[48px] pointer-events-none"></div>
        <div class="absolute inset-6 md:inset-10 border border-[#A05A4F]/10 rounded-[28px] md:rounded-[44px] pointer-events-none"></div>

        <!-- Continuous Line Lovers Illustration (SVG) -->
        <div class="relative z-10 w-full max-w-md space-y-6 md:space-y-8 animate-fade-in-up">
          
          <!-- Mono Eyebrow -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A05A4F]/10 border border-[#A05A4F]/20 text-[#A05A4F] font-mono text-[9px] md:text-[10px] tracking-widest uppercase">
            <span>●</span>
            <span>The Wedding Invitation</span>
            <span>●</span>
          </div>

          <!-- Couple Title with Cursive Ampersand -->
          <div class="space-y-1 md:space-y-2">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-[#2A221E] uppercase leading-none font-grotesk">
              {{ data.groomNickname || data.groomName?.split(' ')[0] || 'Julian' }}
            </h1>
            <div class="flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-[#A05A4F]/40"></span>
              <span class="font-script text-3xl md:text-4xl text-[#A05A4F] lowercase -my-1">&</span>
              <span class="w-8 h-px bg-[#A05A4F]/40"></span>
            </div>
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-[#2A221E] uppercase leading-none font-grotesk">
              {{ data.brideNickname || data.brideName?.split(' ')[0] || 'Nadine' }}
            </h1>
          </div>

          <!-- Continuous Line Heart Artwork -->
          <div class="w-20 h-20 md:w-24 md:h-24 mx-auto text-[#A05A4F] opacity-80 my-2">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <path d="M 20,40 C 20,25 35,15 50,30 C 65,15 80,25 80,40 C 80,65 50,85 50,85 C 50,85 20,65 20,40 Z" />
              <path d="M 35,45 C 42,38 48,45 52,48 C 58,40 65,42 66,48" stroke-width="1.2" />
              <path d="M 50,85 C 50,85 55,92 65,95 C 75,98 85,92 92,85" stroke-dasharray="2 3" stroke-width="1.2" />
            </svg>
          </div>

          <!-- Guest Greeting Card (Polaroid Style) -->
          <div class="bg-white/90 backdrop-blur-sm border border-[#A05A4F]/20 p-5 md:p-6 rounded-2xl shadow-lg shadow-[#A05A4F]/5 space-y-2 max-w-sm mx-auto">
            <p class="font-mono text-[9px] md:text-[10px] tracking-widest text-[#7D6E68] uppercase">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p class="text-xl md:text-2xl font-bold text-[#2A221E] tracking-tight">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
            <p class="text-[11px] text-[#7D6E68] italic font-serif">
              Merupakan suatu kehormatan atas kehadiran & doa restu Anda
            </p>
          </div>

          <!-- Open Invitation Button -->
          <div class="pt-2">
            <button
              @click="openInvitation"
              type="button"
              class="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 md:py-4 bg-[#A05A4F] hover:bg-[#8D4B41] text-white font-mono text-xs md:text-sm tracking-widest uppercase rounded-full shadow-lg shadow-[#A05A4F]/25 hover:shadow-xl hover:shadow-[#A05A4F]/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <i class="fa-solid fa-envelope-open text-xs transition-transform group-hover:scale-125"></i>
              <span>Buka Undangan</span>
              <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <!-- MAIN INVITATION CONTENT -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth"
    >

      <!-- 1. HERO SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 relative pt-12 pb-24">
        <div class="max-w-4xl mx-auto w-full text-center space-y-8" v-observe>
          
          <!-- Monospace Issue Badge -->
          <div class="flex items-center justify-center gap-4 text-[#A05A4F] font-mono text-[10px] md:text-xs tracking-widest uppercase">
            <span class="w-8 h-px bg-[#A05A4F]/40"></span>
            <span>LOVE LINE // VOL. 01</span>
            <span class="w-8 h-px bg-[#A05A4F]/40"></span>
          </div>

          <!-- Couple Names -->
          <div class="space-y-2">
            <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#2A221E] leading-[0.95]">
              {{ data.groomName }}
            </h1>
            <div class="flex items-center justify-center gap-4 my-2">
              <span class="w-12 md:w-20 h-px bg-[#A05A4F]/30"></span>
              <span class="font-script text-3xl md:text-5xl text-[#A05A4F] lowercase -my-2">&</span>
              <span class="w-12 md:w-20 h-px bg-[#A05A4F]/30"></span>
            </div>
            <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#2A221E] leading-[0.95]">
              {{ data.brideName }}
            </h1>
          </div>

          <!-- Wedding Date in Space Mono -->
          <p class="font-mono text-xs md:text-sm tracking-[0.25em] text-[#7D6E68] uppercase font-semibold">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
          </p>

          <!-- Featured Polaroid Photo with Washi Tape Effect -->
          <div class="relative max-w-sm md:max-w-md mx-auto pt-4">
            <!-- Simulated Washi Tape Accent -->
            <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#D4A373]/50 backdrop-blur-xs rotate-[-2deg] z-20 shadow-xs border border-white/40"></div>

            <div class="bg-white p-4 pb-8 rounded-lg shadow-2xl shadow-[#A05A4F]/10 border border-[#A05A4F]/10 rotate-[1deg] hover:rotate-0 transition-transform duration-700">
              <div class="aspect-[4/5] bg-[#F5ECE8] rounded overflow-hidden relative">
                <img
                  :src="data.photoCoupleUrl || data.groomPhotoUrl || heroPlaceholder"
                  alt="Couple Photo"
                  class="w-full h-full object-cover filter contrast-[1.03] hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <div class="mt-4 flex items-center justify-between px-2 text-[#7D6E68] font-mono text-[9px] md:text-[10px] tracking-widest uppercase">
                <span>EST. {{ currentYear }}</span>
                <span>TOGETHER FOREVER</span>
              </div>
            </div>
          </div>

          <!-- Countdown Timer Cards (Space Mono Style) -->
          <div class="pt-4 max-w-lg mx-auto">
            <p class="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#7D6E68] mb-3">
              Counting Down To The Sacred Day
            </p>
            <div class="grid grid-cols-4 gap-2 md:gap-3">
              <div
                v-for="(val, label) in countdown"
                :key="label"
                class="bg-white border border-[#A05A4F]/20 rounded-xl p-3 md:p-4 text-center shadow-sm"
              >
                <div class="text-2xl md:text-3xl font-mono font-bold text-[#A05A4F]">{{ val }}</div>
                <div class="text-[8px] md:text-[9px] font-mono uppercase tracking-wider text-[#7D6E68] mt-1">{{ label }}</div>
              </div>
            </div>
          </div>

          <!-- Animated Scroll Down Indicator -->
          <div class="pt-6 animate-bounce text-[#A05A4F]/60">
            <i class="fa-solid fa-arrow-down text-lg"></i>
          </div>

        </div>
      </section>

      <!-- 2. QUOTE SECTION -->
      <section
        id="quote"
        v-if="isSectionEnabled('quote')"
        class="py-20 md:py-28 px-6 bg-[#F3EDE8] relative overflow-hidden"
        v-observe
      >
        <div class="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          
          <!-- Continuous Floral Line Divider -->
          <div class="w-16 h-16 mx-auto text-[#A05A4F] opacity-75">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M 50,10 C 50,30 35,40 25,50 C 15,60 30,75 50,75 C 70,75 85,60 75,50 C 65,40 50,30 50,10 Z" />
              <path d="M 50,75 L 50,95" />
              <path d="M 50,85 C 40,82 35,88 35,88" />
              <path d="M 50,80 C 60,77 65,83 65,83" />
            </svg>
          </div>

          <!-- Quote Card -->
          <div class="space-y-4">
            <span class="font-serif text-5xl md:text-6xl text-[#A05A4F]/30 leading-none block">“</span>
            <p class="text-base sm:text-lg md:text-xl font-serif italic text-[#2A221E] leading-relaxed max-w-2xl mx-auto px-4 -mt-6">
              {{ data.quoteText || defaultQuoteText }}
            </p>
            <p class="font-mono text-[10px] md:text-xs font-bold text-[#A05A4F] tracking-widest uppercase pt-2">
              — {{ data.quoteSource || 'QS. Ar-Rum: 21' }}
            </p>
          </div>

        </div>
      </section>

      <!-- 3. THE COUPLE SECTION -->
      <section
        id="couple"
        v-if="isSectionEnabled('couple')"
        class="py-24 md:py-32 px-6 md:px-12 relative"
      >
        <div class="max-w-5xl mx-auto space-y-16 md:space-y-24">
          
          <!-- Section Title Header -->
          <div class="text-center space-y-2" v-observe>
            <div class="font-mono text-[10px] md:text-xs text-[#A05A4F] tracking-widest uppercase">
              [ 02 // THE COUPLE ]
            </div>
            <h2 class="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#2A221E]">
              Mempelai Yang Berbahagia
            </h2>
            <p class="text-xs md:text-sm text-[#7D6E68] max-w-md mx-auto">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengikat janji suci pernikahan:
            </p>
          </div>

          <!-- Couple Grid (Groom & Bride) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            <!-- Groom Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl border border-[#A05A4F]/15 shadow-xl shadow-[#A05A4F]/5 text-center space-y-6 relative group hover:-translate-y-1 transition-all duration-500" v-observe>
              <!-- Monogram Badge -->
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A05A4F] text-white font-mono text-[9px] uppercase px-4 py-1 rounded-full tracking-widest shadow-md">
                The Groom
              </div>

              <!-- Photo with Arch Frame & Line Contour -->
              <div class="w-48 h-64 mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#A05A4F]/30 p-1.5 bg-[#FAF6F4]">
                <img
                  :src="data.groomPhotoUrl || groomPlaceholder"
                  alt="Groom Photo"
                  class="w-full h-full object-cover rounded-t-full rounded-b-xl group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl md:text-3xl font-bold text-[#2A221E] tracking-tight">
                  {{ data.groomName }}
                </h3>
                <p v-if="data.parents?.groomParents" class="text-xs text-[#7D6E68] leading-relaxed">
                  Putra dari <span class="font-semibold text-[#2A221E]">{{ data.parents.groomParents }}</span>
                </p>
              </div>

              <!-- Instagram Button -->
              <div v-if="data.socialMediaGroom?.instagram">
                <a
                  :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A05A4F]/30 text-[#A05A4F] hover:bg-[#A05A4F] hover:text-white font-mono text-[10px] tracking-wider uppercase transition-colors"
                >
                  <i class="fa-brands fa-instagram text-xs"></i>
                  <span>@{{ cleanInstagram(data.socialMediaGroom.instagram) }}</span>
                </a>
              </div>
            </div>

            <!-- Bride Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl border border-[#A05A4F]/15 shadow-xl shadow-[#A05A4F]/5 text-center space-y-6 relative group hover:-translate-y-1 transition-all duration-500" v-observe>
              <!-- Monogram Badge -->
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A05A4F] text-white font-mono text-[9px] uppercase px-4 py-1 rounded-full tracking-widest shadow-md">
                The Bride
              </div>

              <!-- Photo with Arch Frame & Line Contour -->
              <div class="w-48 h-64 mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#A05A4F]/30 p-1.5 bg-[#FAF6F4]">
                <img
                  :src="data.bridePhotoUrl || bridePlaceholder"
                  alt="Bride Photo"
                  class="w-full h-full object-cover rounded-t-full rounded-b-xl group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl md:text-3xl font-bold text-[#2A221E] tracking-tight">
                  {{ data.brideName }}
                </h3>
                <p v-if="data.parents?.brideParents" class="text-xs text-[#7D6E68] leading-relaxed">
                  Putri dari <span class="font-semibold text-[#2A221E]">{{ data.parents.brideParents }}</span>
                </p>
              </div>

              <!-- Instagram Button -->
              <div v-if="data.socialMediaBrides?.instagram">
                <a
                  :href="formatInstagramUrl(data.socialMediaBrides.instagram)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A05A4F]/30 text-[#A05A4F] hover:bg-[#A05A4F] hover:text-white font-mono text-[10px] tracking-wider uppercase transition-colors"
                >
                  <i class="fa-brands fa-instagram text-xs"></i>
                  <span>@{{ cleanInstagram(data.socialMediaBrides.instagram) }}</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- 4. WEDDING EVENT / SCHEDULE SECTION -->
      <section
        id="event"
        v-if="isSectionEnabled('event')"
        class="py-24 md:py-32 px-6 md:px-12 bg-[#F3EDE8] relative"
      >
        <div class="max-w-5xl mx-auto space-y-16">
          
          <!-- Header -->
          <div class="text-center space-y-2" v-observe>
            <div class="font-mono text-[10px] md:text-xs text-[#A05A4F] tracking-widest uppercase">
              [ 03 // SAVE THE DATE ]
            </div>
            <h2 class="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#2A221E]">
              Waktu & Lokasi Acara
            </h2>
            <p class="text-xs md:text-sm text-[#7D6E68] max-w-md mx-auto">
              Insya Allah rangkaian acara pernikahan kami akan diselenggarakan pada:
            </p>
          </div>

          <!-- Event Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            <!-- Akad Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl border border-[#A05A4F]/20 shadow-lg space-y-6 text-center relative overflow-hidden" v-observe>
              <div class="inline-block px-4 py-1 rounded-full bg-[#A05A4F]/10 text-[#A05A4F] font-mono text-[10px] tracking-widest uppercase font-semibold">
                Akad Nikah
              </div>

              <div class="space-y-1">
                <p class="text-2xl md:text-3xl font-bold text-[#2A221E]">
                  {{ formatDate(data.akadLocation?.dateTime || data.dateTime) }}
                </p>
                <p class="font-mono text-xs md:text-sm text-[#A05A4F] font-semibold">
                  Pukul {{ formatTime(data.akadLocation?.dateTime || data.dateTime) }} WIB
                </p>
              </div>

              <div class="w-12 h-px bg-[#A05A4F]/30 mx-auto"></div>

              <div class="space-y-2">
                <p class="text-sm font-bold text-[#2A221E] uppercase tracking-wider">
                  Tempat Pelaksanaan
                </p>
                <p class="text-xs md:text-sm text-[#7D6E68] leading-relaxed max-w-sm mx-auto">
                  {{ data.akadLocation?.description || 'Plataran Menteng, Jakarta Pusat' }}
                </p>
              </div>

              <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  v-if="data.akadLocation?.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A05A4F] hover:bg-[#8D4B41] text-white rounded-full font-mono text-[10px] md:text-xs tracking-wider uppercase shadow-md transition-all hover:scale-105"
                >
                  <i class="fa-solid fa-location-dot"></i>
                  <span>Google Maps</span>
                </a>
                <button
                  type="button"
                  @click="saveToCalendar('Akad Nikah', data.akadLocation)"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#A05A4F]/30 text-[#A05A4F] hover:bg-[#FAF6F4] rounded-full font-mono text-[10px] md:text-xs tracking-wider uppercase transition-colors"
                >
                  <i class="fa-regular fa-calendar-plus"></i>
                  <span>Simpan Kalender</span>
                </button>
              </div>
            </div>

            <!-- Resepsi Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl border border-[#A05A4F]/20 shadow-lg space-y-6 text-center relative overflow-hidden" v-observe>
              <div class="inline-block px-4 py-1 rounded-full bg-[#A05A4F]/10 text-[#A05A4F] font-mono text-[10px] tracking-widest uppercase font-semibold">
                Resepsi Pernikahan
              </div>

              <div class="space-y-1">
                <p class="text-2xl md:text-3xl font-bold text-[#2A221E]">
                  {{ formatDate(data.resepsiLocation?.dateTime || data.dateTime) }}
                </p>
                <p class="font-mono text-xs md:text-sm text-[#A05A4F] font-semibold">
                  Pukul {{ formatTime(data.resepsiLocation?.dateTime || data.dateTime) }} WIB
                </p>
              </div>

              <div class="w-12 h-px bg-[#A05A4F]/30 mx-auto"></div>

              <div class="space-y-2">
                <p class="text-sm font-bold text-[#2A221E] uppercase tracking-wider">
                  Tempat Pelaksanaan
                </p>
                <p class="text-xs md:text-sm text-[#7D6E68] leading-relaxed max-w-sm mx-auto">
                  {{ data.resepsiLocation?.description || 'Grand Ballroom Plataran Menteng, Jakarta Pusat' }}
                </p>
              </div>

              <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  v-if="data.resepsiLocation?.mapUrl"
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A05A4F] hover:bg-[#8D4B41] text-white rounded-full font-mono text-[10px] md:text-xs tracking-wider uppercase shadow-md transition-all hover:scale-105"
                >
                  <i class="fa-solid fa-location-dot"></i>
                  <span>Google Maps</span>
                </a>
                <button
                  type="button"
                  @click="saveToCalendar('Resepsi Pernikahan', data.resepsiLocation)"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#A05A4F]/30 text-[#A05A4F] hover:bg-[#FAF6F4] rounded-full font-mono text-[10px] md:text-xs tracking-wider uppercase transition-colors"
                >
                  <i class="fa-regular fa-calendar-plus"></i>
                  <span>Simpan Kalender</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Dress Code Callout -->
          <div v-if="data.dressCode" class="bg-white/80 border border-[#A05A4F]/20 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-2" v-observe>
            <p class="font-mono text-[10px] uppercase tracking-widest text-[#A05A4F] font-semibold">
              <i class="fa-solid fa-shirt mr-1"></i> Dress Code
            </p>
            <p class="text-xs md:text-sm text-[#2A221E] font-medium">
              {{ data.dressCode }}
            </p>
          </div>

        </div>
      </section>

      <!-- 5. LOVE STORY (Connected by the "Love Line") -->
      <section
        id="story"
        v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)"
        class="py-24 md:py-32 px-6 md:px-12 relative"
      >
        <div class="max-w-4xl mx-auto space-y-16">
          
          <!-- Header -->
          <div class="text-center space-y-2" v-observe>
            <div class="font-mono text-[10px] md:text-xs text-[#A05A4F] tracking-widest uppercase">
              [ 04 // OUR LOVE LINE ]
            </div>
            <h2 class="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#2A221E]">
              Kisah Cinta Kami
            </h2>
            <p class="text-xs md:text-sm text-[#7D6E68] max-w-md mx-auto">
              Setiap kisah memiliki awal, namun bersama kita menjadikannya abadi.
            </p>
          </div>

          <!-- Connected Timeline with Continuous SVG Vertical Line -->
          <div class="relative">
            <!-- Vertical Line Track -->
            <div class="absolute left-4 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-[#A05A4F]/20 via-[#A05A4F]/60 to-[#A05A4F]/20 -translate-x-1/2 hidden sm:block"></div>

            <div class="space-y-12 md:space-y-16">
              <div
                v-for="(story, idx) in effectiveStories"
                :key="idx"
                class="relative flex flex-col md:flex-row items-center gap-6 md:gap-12"
                :class="idx % 2 === 0 ? 'md:flex-row-reverse' : ''"
                v-observe
              >
                <!-- Timeline Node Marker -->
                <div class="hidden sm:flex absolute left-4 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF6F4] border-2 border-[#A05A4F] items-center justify-center font-mono text-[10px] font-bold text-[#A05A4F] z-10 shadow-sm">
                  {{ idx + 1 }}
                </div>

                <!-- Story Text Card -->
                <div class="w-full md:w-1/2 bg-white p-6 md:p-8 rounded-2xl border border-[#A05A4F]/15 shadow-md space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[10px] md:text-xs text-[#A05A4F] font-bold tracking-widest uppercase">
                      {{ story.date }}
                    </span>
                    <span class="sm:hidden font-mono text-[10px] text-gray-400">#{{ idx + 1 }}</span>
                  </div>
                  <h3 class="text-xl md:text-2xl font-bold text-[#2A221E] tracking-tight">
                    {{ story.title }}
                  </h3>
                  <p class="text-xs md:text-sm text-[#7D6E68] leading-relaxed">
                    {{ story.description }}
                  </p>
                </div>

                <!-- Story Photo (Polaroid Frame) -->
                <div class="w-full md:w-1/2 flex justify-center">
                  <div class="bg-white p-3 pb-6 rounded-lg shadow-lg border border-[#A05A4F]/10 max-w-[280px] w-full rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                    <div class="aspect-[4/3] bg-[#F5ECE8] rounded overflow-hidden">
                      <img
                        :src="story.image || defaultStoryPlaceholder"
                        :alt="story.title"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- 6. GALLERY SECTION -->
      <section
        id="gallery"
        v-if="isSectionEnabled('gallery') && galleryItems.length"
        class="py-24 md:py-32 px-6 md:px-12 bg-[#F3EDE8] relative"
      >
        <div class="max-w-5xl mx-auto space-y-16">
          
          <!-- Header -->
          <div class="text-center space-y-2" v-observe>
            <div class="font-mono text-[10px] md:text-xs text-[#A05A4F] tracking-widest uppercase">
              [ 05 // SWEET MEMORIES ]
            </div>
            <h2 class="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#2A221E]">
              Galeri Kenangan
            </h2>
            <p class="text-xs md:text-sm text-[#7D6E68] max-w-md mx-auto">
              Untaian momen indah perjalanan kebersamaan kami yang terabadikan.
            </p>
          </div>

          <!-- Gallery Grid -->
          <div v-observe>
            <GalleryInvitation :items="galleryItems" />
          </div>

        </div>
      </section>

      <!-- 7. VIDEO PREWEDDING (IF ENABLED) -->
      <section
        id="video"
        v-if="isSectionEnabled('video') && data.videoPrewedding"
        class="py-20 md:py-28 px-6 md:px-12 bg-white relative"
        v-observe
      >
        <div class="max-w-4xl mx-auto space-y-8 text-center">
          <div class="font-mono text-[10px] md:text-xs text-[#A05A4F] tracking-widest uppercase">
            [ PREWEDDING CINEMATIC ]
          </div>
          <h2 class="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#2A221E]">
            Momen Kebersamaan
          </h2>
          <div class="aspect-video max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-[#A05A4F]/20">
            <iframe
              :src="data.videoPrewedding"
              title="Prewedding Video"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      </section>

      <!-- 8. WEDDING GIFT / AMPLOP DIGITAL -->
      <section
        id="gift"
        v-if="isSectionEnabled('gift')"
        class="py-24 md:py-32 px-6 md:px-12 relative"
      >
        <div class="max-w-3xl mx-auto space-y-12 text-center">
          
          <!-- Header -->
          <div class="space-y-2" v-observe>
            <div class="font-mono text-[10px] md:text-xs text-[#A05A4F] tracking-widest uppercase">
              [ 06 // WEDDING GIFT ]
            </div>
            <h2 class="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#2A221E]">
              Tanda Kasih
            </h2>
            <p class="text-xs md:text-sm text-[#7D6E68] max-w-md mx-auto leading-relaxed">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun apabila hendak memberikan tanda kasih, Anda dapat mengirimkannya melalui:
            </p>
          </div>

          <!-- Bank Accounts Grid -->
          <div v-if="effectiveBankAccounts.length" class="grid grid-cols-1 md:grid-cols-2 gap-6" v-observe>
            <div
              v-for="(acc, idx) in effectiveBankAccounts"
              :key="idx"
              class="bg-white p-6 rounded-2xl border border-[#A05A4F]/20 shadow-md text-left space-y-3 relative group"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-[#A05A4F] uppercase tracking-wider">
                  {{ acc.bankName }}
                </span>
                <i class="fa-solid fa-credit-card text-[#A05A4F]/40 text-sm"></i>
              </div>
              <div class="space-y-0.5">
                <p class="text-lg md:text-xl font-mono font-bold text-[#2A221E] tracking-wider select-all">
                  {{ acc.accountNumber }}
                </p>
                <p class="text-xs text-[#7D6E68]">
                  a.n. <span class="font-medium text-[#2A221E]">{{ acc.accountName }}</span>
                </p>
              </div>
              <button
                type="button"
                @click="copyText(acc.accountNumber, 'Nomor rekening')"
                class="w-full mt-2 py-2 bg-[#FAF6F4] hover:bg-[#A05A4F] text-[#A05A4F] hover:text-white rounded-xl font-mono text-[10px] tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold border border-[#A05A4F]/20"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin No. Rekening</span>
              </button>
            </div>
          </div>

          <!-- Gift Delivery Address -->
          <div v-if="giftAddresses.length" class="bg-white p-6 md:p-8 rounded-2xl border border-[#A05A4F]/20 shadow-md text-center space-y-4 max-w-xl mx-auto" v-observe>
            <div class="inline-block px-3 py-1 rounded-full bg-[#A05A4F]/10 text-[#A05A4F] font-mono text-[10px] uppercase font-semibold">
              <i class="fa-solid fa-gift mr-1"></i> Kirim Kado Fisik
            </div>
            <div v-for="(addr, idx) in giftAddresses" :key="idx" class="space-y-2">
              <p class="text-xs md:text-sm text-[#2A221E] leading-relaxed">
                {{ addr }}
              </p>
              <button
                type="button"
                @click="copyText(addr, 'Alamat pengiriman')"
                class="inline-flex items-center gap-2 px-5 py-2 bg-[#FAF6F4] hover:bg-[#A05A4F] text-[#A05A4F] hover:text-white rounded-full font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer border border-[#A05A4F]/20 font-bold"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Alamat</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- 9. RSVP & WISHES SECTION -->
      <section
        id="rsvp"
        v-if="isSectionEnabled('rsvp')"
        class="py-24 md:py-32 px-6 md:px-12 bg-[#F3EDE8] relative"
      >
        <div class="max-w-2xl mx-auto space-y-12">
          
          <!-- Header -->
          <div class="text-center space-y-2" v-observe>
            <div class="font-mono text-[10px] md:text-xs text-[#A05A4F] tracking-widest uppercase">
              [ 07 // RSVP & BLESSINGS ]
            </div>
            <h2 class="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#2A221E]">
              Konfirmasi Kehadiran
            </h2>
            <p class="text-xs md:text-sm text-[#7D6E68]">
              Mohon konfirmasi kehadiran serta berikan doa restu Anda:
            </p>
          </div>

          <!-- RSVP Form Card -->
          <div class="bg-white p-6 md:p-10 rounded-3xl border border-[#A05A4F]/20 shadow-xl space-y-6" v-observe>
            <form @submit.prevent="submitRSVP" class="space-y-5">
              
              <!-- Guest Name Field -->
              <div class="space-y-1.5 text-left">
                <label class="font-mono text-[10px] uppercase tracking-wider text-[#7D6E68] font-bold block">
                  Nama Anda
                </label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  class="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] border border-[#A05A4F]/20 text-[#2A221E] text-sm focus:outline-none focus:border-[#A05A4F] transition-colors"
                />
              </div>

              <!-- Attendance Choice -->
              <div class="space-y-1.5 text-left">
                <label class="font-mono text-[10px] uppercase tracking-wider text-[#7D6E68] font-bold block">
                  Konfirmasi Kehadiran
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    @click="rsvp.attendance = 'hadir'"
                    class="py-2.5 px-3 rounded-xl font-mono text-[10px] md:text-xs uppercase tracking-wider transition-all border cursor-pointer text-center font-bold"
                    :class="rsvp.attendance === 'hadir' ? 'bg-[#A05A4F] text-white border-[#A05A4F] shadow-sm' : 'bg-[#FAF6F4] text-[#7D6E68] border-[#A05A4F]/20 hover:border-[#A05A4F]'"
                  >
                    Hadir
                  </button>
                  <button
                    type="button"
                    @click="rsvp.attendance = 'tidak hadir'"
                    class="py-2.5 px-3 rounded-xl font-mono text-[10px] md:text-xs uppercase tracking-wider transition-all border cursor-pointer text-center font-bold"
                    :class="rsvp.attendance === 'tidak hadir' ? 'bg-[#A05A4F] text-white border-[#A05A4F] shadow-sm' : 'bg-[#FAF6F4] text-[#7D6E68] border-[#A05A4F]/20 hover:border-[#A05A4F]'"
                  >
                    Berhalangan
                  </button>
                  <button
                    type="button"
                    @click="rsvp.attendance = 'ragu'"
                    class="py-2.5 px-3 rounded-xl font-mono text-[10px] md:text-xs uppercase tracking-wider transition-all border cursor-pointer text-center font-bold"
                    :class="rsvp.attendance === 'ragu' ? 'bg-[#A05A4F] text-white border-[#A05A4F] shadow-sm' : 'bg-[#FAF6F4] text-[#7D6E68] border-[#A05A4F]/20 hover:border-[#A05A4F]'"
                  >
                    Masih Ragu
                  </button>
                </div>
              </div>

              <!-- Number of Guests -->
              <div v-if="rsvp.attendance === 'hadir'" class="space-y-1.5 text-left">
                <label class="font-mono text-[10px] uppercase tracking-wider text-[#7D6E68] font-bold block">
                  Jumlah Kehadiran (Orang)
                </label>
                <select
                  v-model="rsvp.totalGuests"
                  class="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] border border-[#A05A4F]/20 text-[#2A221E] text-sm focus:outline-none focus:border-[#A05A4F] transition-colors"
                >
                  <option :value="1">1 Orang</option>
                  <option :value="2">2 Orang</option>
                  <option :value="3">3 Orang</option>
                  <option :value="4">4 Orang</option>
                </select>
              </div>

              <!-- Message / Wishes -->
              <div class="space-y-1.5 text-left">
                <label class="font-mono text-[10px] uppercase tracking-wider text-[#7D6E68] font-bold block">
                  Ucapan & Doa Restu
                </label>
                <textarea
                  v-model="rsvp.message"
                  rows="3"
                  placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
                  class="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] border border-[#A05A4F]/20 text-[#2A221E] text-sm focus:outline-none focus:border-[#A05A4F] transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isSubmittingRsvp"
                class="w-full py-3.5 bg-[#A05A4F] hover:bg-[#8D4B41] text-white font-mono text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-bold disabled:opacity-50"
              >
                <span v-if="isSubmittingRsvp" class="animate-spin"><i class="fa-solid fa-circle-notch"></i></span>
                <span v-else><i class="fa-regular fa-paper-plane mr-1"></i> Kirim Konfirmasi</span>
              </button>

            </form>
          </div>

          <!-- Submitted Wishes List -->
          <div v-if="submittedWishes.length" class="space-y-4 text-left" v-observe>
            <p class="font-mono text-[10px] md:text-xs text-[#A05A4F] font-bold tracking-widest uppercase text-center">
              Untaian Doa Dari Para Sahabat ({{ submittedWishes.length }})
            </p>
            <div class="max-h-80 overflow-y-auto space-y-3 no-scrollbar pr-1">
              <div
                v-for="(wish, idx) in submittedWishes"
                :key="idx"
                class="bg-white p-4 rounded-xl border border-[#A05A4F]/15 shadow-xs space-y-1.5"
              >
                <div class="flex items-center justify-between">
                  <p class="font-bold text-xs md:text-sm text-[#2A221E]">{{ wish.name }}</p>
                  <span
                    class="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full"
                    :class="wish.rsvpStatus === 'hadir' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ wish.rsvpStatus === 'hadir' ? 'Hadir' : 'Berhalangan' }}
                  </span>
                </div>
                <p class="text-xs text-[#7D6E68] leading-relaxed">{{ wish.message }}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- 10. TURUT MENGUNDANG / EXTENDED FAMILY -->
      <section
        v-if="effectiveFamily.length"
        class="py-16 md:py-20 px-6 text-center bg-white border-t border-[#A05A4F]/15"
        v-observe
      >
        <div class="max-w-2xl mx-auto space-y-4">
          <p class="font-mono text-[10px] md:text-xs text-[#A05A4F] uppercase tracking-widest font-bold">
            Turut Mengundang
          </p>
          <div class="space-y-1.5">
            <p
              v-for="(family, idx) in effectiveFamily"
              :key="idx"
              class="text-xs md:text-sm text-[#7D6E68]"
            >
              {{ family }}
            </p>
          </div>
        </div>
      </section>

      <!-- 11. FOOTER SECTION -->
      <footer class="py-16 md:py-20 px-6 text-center space-y-6 bg-[#FAF6F4]">
        <div class="max-w-xl mx-auto space-y-3">
          <div class="w-12 h-px bg-[#A05A4F]/40 mx-auto"></div>
          <p class="font-serif italic text-xs md:text-sm text-[#7D6E68] leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
          </p>
          <p class="font-mono text-[10px] uppercase tracking-widest text-[#A05A4F] font-bold">
            Julian & Nadine
          </p>
        </div>

        <!-- Official SatuUndangan Watermark Badge -->
        <WatermarkBadge variant="light" />
      </footer>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const toast = useToast()
const data = ref(props.data || {})

watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
    initData()
  },
  { deep: true, immediate: true },
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)
const currentYear = new Date().getFullYear()

// Fallbacks and Placeholders
const heroPlaceholder = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop'
const groomPlaceholder = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'
const bridePlaceholder = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop'
const defaultStoryPlaceholder = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop'
const defaultQuoteText =
  'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.'

// Welcome Gate Screen State
const showWelcome = ref(true)

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    const el = document.getElementById('main-content')
    if (el) el.classList.remove('opacity-0')
    initScrollSpy()
  }, 100)
}

// Navigation Items with Scrollspy
const navItems = computed(() => {
  const items = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
    { id: 'quote', label: 'Ayat', icon: 'fa-solid fa-quote-left', key: 'quote' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart', key: 'couple' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-day', key: 'event' },
    { id: 'story', label: 'Cerita', icon: 'fa-solid fa-book-open', key: 'love-story' },
    { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images', key: 'gallery' },
    { id: 'gift', label: 'Kado', icon: 'fa-solid fa-gift', key: 'gift' },
    { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' },
  ]
  return items.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'story') return isSectionEnabled('love-story') && (effectiveStories.value.length > 0 || isPreviewMode.value)
    if (item.id === 'gallery') return isSectionEnabled('gallery') && galleryItems.value.length > 0
    return isSectionEnabled(item.key)
  })
})

const activeSection = ref('home')

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.35 },
  )

  navItems.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

// Countdown Logic
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let countdownInterval = null

function updateCountdown() {
  const targetDateStr =
    data.value.akadLocation?.dateTime ||
    data.value.resepsiLocation?.dateTime ||
    data.value.dateTime ||
    '2027-11-20T08:00:00.000Z'
  const target = new Date(targetDateStr).getTime()
  const now = new Date().getTime()
  const diff = target - now

  if (diff <= 0) {
    countdown.value = { Hari: '00', Jam: '00', Menit: '00', Detik: '00' }
    return
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = {
    Hari: String(d).padStart(2, '0'),
    Jam: String(h).padStart(2, '0'),
    Menit: String(m).padStart(2, '0'),
    Detik: String(s).padStart(2, '0'),
  }
}

// Custom Scroll Observation Directive
const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-8')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
  },
}

// Stories Fallback
const mockStories = [
  {
    date: '14 Feb 2022',
    title: 'Garis yang Bersilangan',
    description: 'Bermula dari perjumpaan tidak sengaja di sebuah pameran seni arsitektur dan desain di Jakarta Selatan. Dari percakapan singkat tentang estetika garis dan ruang, kami menyadari ada rasa hangat yang tak ingin kami sudahi.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop',
  },
  {
    date: '28 Okt 2024',
    title: 'Menyatukan Dua Langkah',
    description: 'Melewati berbagai musim kehidupan bersama, belajar saling memahami dan bertumbuh dalam kebaikan. Di bawah langit senja, kami saling mengucap janji untuk terus berjalan berdampingan.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
  },
  {
    date: '18 Mei 2026',
    title: 'Ikatan Satu Garis Abadi',
    description: 'Di hadapan kedua keluarga besar tercinta, lamaran resmi terucap dengan penuh rasa syukur. Sebuah awal dari lembaran baru menuju mahligai pernikahan suci.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop',
  },
]

const effectiveStories = computed(() => {
  if (data.value.loveStory && data.value.loveStory.length > 0) {
    return data.value.loveStory
  }
  return mockStories
})

// Gallery Items
const galleryItems = computed(() => {
  const images = data.value.galleryImages || []
  return images.map((src, i) => ({
    src,
    thumbnail: src,
    alt: `Moment ${i + 1}`,
  }))
})

// Bank Accounts
const effectiveBankAccounts = computed(() => {
  if (data.value.bankAccounts && data.value.bankAccounts.length > 0) {
    return data.value.bankAccounts
  }
  return [
    { bankName: 'BCA', accountNumber: '8820194821', accountName: data.value.groomName || 'Julian Pratama' },
    { bankName: 'Bank Mandiri', accountNumber: '137001928471', accountName: data.value.brideName || 'Nadine Azzahra' },
  ]
})

// Gift Delivery Address
const giftAddresses = computed(() => {
  const raw = data.value.giftDeliveryAddress
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  return list.map((a) => String(a || '').trim()).filter(Boolean)
})

// Turut Mengundang / Extended Family
const effectiveFamily = computed(() => {
  if (data.value.extendedFamily && Array.isArray(data.value.extendedFamily)) {
    return data.value.extendedFamily
  }
  if (data.value.turutMengundang) {
    return String(data.value.turutMengundang).split('\n').filter(Boolean)
  }
  return []
})

// RSVP State
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const isSubmittingRsvp = ref(false)
const submittedWishes = ref([
  {
    name: 'Dimas & Sekar',
    rsvpStatus: 'hadir',
    message: 'Selamat berbahagia Julian & Nadine! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah selamanya.',
  },
  {
    name: 'Alifia Rahman',
    rsvpStatus: 'hadir',
    message: 'MasyaAllah tabarakallah, so happy for both of you! Lancar sampai hari H ya.',
  },
])

async function submitRSVP() {
  if (!rsvp.value.name?.trim()) {
    toast.error('Mohon isi nama Anda.')
    return
  }
  if (!rsvp.value.attendance) {
    toast.error('Mohon pilih konfirmasi kehadiran.')
    return
  }

  try {
    isSubmittingRsvp.value = true
    if (data.value.id && !isPreviewMode.value) {
      await createGuestMessage({
        invitationId: data.value.id,
        guestName: rsvp.value.name,
        message: rsvp.value.message,
        rsvpStatus: rsvp.value.attendance,
        totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0,
      })
    }
    submittedWishes.value.unshift({
      name: rsvp.value.name,
      rsvpStatus: rsvp.value.attendance,
      message: rsvp.value.message || 'Hadir dan mendoakan kedua mempelai.',
    })
    toast.success(`Terima kasih ${rsvp.value.name}, konfirmasi Anda telah tercatat!`)
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
  } catch (err) {
    console.error('Failed to submit RSVP:', err)
    toast.error('Gagal mengirim RSVP. Silakan coba lagi.')
  } finally {
    isSubmittingRsvp.value = false
  }
}

// Copy Text Helper
function copyText(val, label) {
  if (!val) return
  navigator.clipboard.writeText(val).then(
    () => {
      toast.success(`${label} berhasil disalin!`)
    },
    () => {
      toast.error('Gagal menyalin teks.')
    },
  )
}

// Google Calendar Helper
function saveToCalendar(title, locationObj) {
  if (!locationObj?.dateTime) return
  const start = locationObj.dateTime.replace(/-|:|\.\d\d\d/g, '')
  const end = new Date(new Date(locationObj.dateTime).getTime() + 3 * 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, '')
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${title}: ${data.value.coupleName || 'Pernikahan'}`,
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    data.value.title || 'Undangan Pernikahan',
  )}&location=${encodeURIComponent(locationObj.description || '')}`
  window.open(url, '_blank')
}

// Utilities
function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:') || choice.startsWith('http') || choice.startsWith('/')) return choice
  return `/audio/${choice}`
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatInstagramUrl(handle) {
  const clean = cleanInstagram(handle)
  return clean ? `https://instagram.com/${clean}` : '#'
}

function cleanInstagram(handle) {
  return String(handle || '')
    .trim()
    .replace(/^@/, '')
}

function isSectionEnabled(key) {
  const sections = data.value.selectedSections
  if (sections === undefined || sections === null) return true
  if (!Array.isArray(sections)) return true
  const aliasMap = {
    couple: ['couple', 'photoCouple'],
    event: ['event', 'event-details', 'map'],
    hero: ['hero', 'cover'],
    'love-story': ['love-story', 'story'],
    'dress-code': ['dress-code', 'dressCode'],
    'live-streaming': ['live-streaming', 'liveStreaming'],
    'extended-family': ['extended-family', 'turut-mengundang'],
    gift: ['gift', 'amplop'],
    rsvp: ['rsvp', 'wishes', 'message'],
    video: ['video'],
    gallery: ['gallery'],
    quote: ['quote'],
  }
  const checkKeys = aliasMap[key] || [key]
  return checkKeys.some((k) => sections.includes(k))
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }
  updateCountdown()
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(updateCountdown, 1000)
}

onMounted(() => {
  initData()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Alex+Brush&display=swap');

.font-grotesk {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.font-mono {
  font-family: 'Space Mono', monospace;
}

.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

.font-script {
  font-family: 'Alex Brush', cursive;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in-up {
  animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

/* Custom Scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
