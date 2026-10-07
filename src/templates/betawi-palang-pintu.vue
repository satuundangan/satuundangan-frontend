<template>
  <div class="relative min-h-screen bg-[#120e09] overflow-hidden font-serif no-scrollbar text-[#fcf9f2] selection:bg-[#d99b26]/30 selection:text-[#f5ca68]">

    <!-- Background Texture & Motif Tegel Antik Batavia -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-15 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

    <!-- Authentic Geometri Anyaman Kembang Kelapa & Wajik Betawi Grid -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15"
      style="background-image: radial-gradient(circle, #d99b26 1px, transparent 1.5px), repeating-linear-gradient(45deg, transparent 0 16px, #1a3c2b 16px 17px, transparent 17px 34px), repeating-linear-gradient(-45deg, transparent 0 16px, #9c4126 16px 17px, transparent 17px 34px); background-size: 34px 34px;"
    ></div>

    <!-- Ambient Glows (Terracotta Batavia & Hijau Daun Pandan Betawi) -->
    <div class="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-[#9c4126]/20 blur-[130px] pointer-events-none z-0"></div>
    <div class="fixed -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#1a3c2b]/35 blur-[150px] pointer-events-none z-0"></div>
    <div class="fixed top-1/3 -right-20 w-80 h-80 rounded-full bg-[#d99b26]/15 blur-[120px] pointer-events-none z-0"></div>

    <!-- SVG Siluet Ondel-Ondel & Kembang Kelapa Megah Kontemporer (Watermark Backdrop) -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[600px] pointer-events-none opacity-[0.055] z-0 select-none text-[#d99b26]">
      <svg viewBox="0 0 600 600" fill="currentColor" class="w-full h-auto drop-shadow-[0_0_35px_rgba(217,155,38,0.3)]">
        <!-- Center Kembang Kelapa (Manggar) Tree & Bursting Foliage -->
        <g opacity="0.9">
          <!-- Central Manggar Trunk -->
          <path d="M296 220 L304 220 L303 520 L297 520 Z" />
          <!-- Bursting Palm/Coconut Palm Fronds radiating outwards -->
          <path d="M300 220 Q220 180 160 120 Q220 160 300 220 Z" />
          <path d="M300 220 Q380 180 440 120 Q380 160 300 220 Z" />
          <path d="M300 210 Q200 130 110 90 Q190 140 300 210 Z" />
          <path d="M300 210 Q400 130 490 90 Q410 140 300 210 Z" />
          <path d="M300 190 Q240 90 190 30 Q250 80 300 190 Z" />
          <path d="M300 190 Q360 90 410 30 Q350 80 300 190 Z" />
          <path d="M300 180 Q300 70 300 10 Q300 70 300 180 Z" />
          <!-- Small spherical flowers on manggar tips -->
          <circle cx="160" cy="120" r="8" />
          <circle cx="440" cy="120" r="8" />
          <circle cx="110" cy="90" r="7" />
          <circle cx="490" cy="90" r="7" />
          <circle cx="190" cy="30" r="7" />
          <circle cx="410" cy="30" r="7" />
          <circle cx="300" cy="10" r="9" />
          <circle cx="230" cy="70" r="6" />
          <circle cx="370" cy="70" r="6" />
        </g>

        <!-- Left Silhouette: Ondel-Ondel Abang Gagah (Male) -->
        <g transform="translate(60, 240)">
          <!-- Crown Kembang Kelapa on head -->
          <path d="M120 40 Q100 10 70 0 Q95 20 115 45 Z" />
          <path d="M130 35 Q130 5 130 0 Q130 15 130 35 Z" />
          <path d="M140 40 Q160 10 190 0 Q165 20 145 45 Z" />
          <circle cx="70" cy="0" r="4" />
          <circle cx="130" cy="0" r="4" />
          <circle cx="190" cy="0" r="4" />
          <!-- Head / Mask -->
          <path d="M100 45 Q130 35 160 45 Q170 75 165 105 Q130 120 95 105 Q90 75 100 45 Z" />
          <!-- Kumis / Mustache -->
          <path d="M110 88 Q130 82 150 88 Q140 96 130 90 Q120 96 110 88 Z" />
          <!-- Badan / Baju Sadariah & Selendang Sarung -->
          <path d="M85 110 L175 110 L195 280 L65 280 Z" />
          <!-- Cukin / Sarung selempang leher -->
          <path d="M95 110 L120 180 L135 180 L165 110 Z" opacity="0.8" />
          <rect x="80" y="270" width="100" height="15" rx="3" />
        </g>

        <!-- Right Silhouette: Ondel-Ondel None Manis (Female) -->
        <g transform="translate(300, 240)">
          <!-- Crown Kembang Kelapa on head -->
          <path d="M120 40 Q100 10 70 0 Q95 20 115 45 Z" />
          <path d="M130 35 Q130 5 130 0 Q130 15 130 35 Z" />
          <path d="M140 40 Q160 10 190 0 Q165 20 145 45 Z" />
          <circle cx="70" cy="0" r="4" />
          <circle cx="130" cy="0" r="4" />
          <circle cx="190" cy="0" r="4" />
          <!-- Head / Kerudung / Sanggul -->
          <path d="M98 45 Q130 38 162 45 Q172 75 162 105 Q130 118 98 105 Q88 75 98 45 Z" />
          <!-- Giwang / Anting bulat -->
          <circle cx="92" cy="85" r="4" />
          <circle cx="168" cy="85" r="4" />
          <!-- Badan / Kebaya Encim & Selendang -->
          <path d="M90 110 L170 110 L190 280 L70 280 Z" />
          <!-- Selendang menjuntai anggun -->
          <path d="M100 115 Q130 160 110 240 Q120 200 140 130 Z" opacity="0.8" />
          <rect x="80" y="270" width="100" height="15" rx="3" />
        </g>
      </svg>
    </div>

    <!-- FIXED CORNER ORNAMENTS (Z-40 POINTER-EVENTS-NONE) -->
    <!-- Ukiran Jendela Langkan & Gigi Balang Rumah Kebaya Betawi -->
    <div class="fixed top-0 left-0 w-24 h-24 md:w-36 md:h-36 z-40 opacity-85 pointer-events-none select-none text-[#d99b26]">
      <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full filter drop-shadow-[0_2px_8px_rgba(217,155,38,0.4)]">
        <!-- Latar segitiga sudut -->
        <path d="M0,0 L100,0 C75,12 50,28 32,48 C16,68 8,88 0,100 Z" opacity="0.18" />
        <!-- Lisplang Gigi Balang Atas -->
        <path d="M0,0 L100,0 L90,14 L78,0 L66,14 L54,0 L42,14 L30,0 L18,14 L6,0 L0,0 Z" fill="#9c4126" />
        <!-- Lisplang Gigi Balang Samping -->
        <path d="M0,0 L0,100 L14,90 L0,78 L14,66 L0,54 L14,42 L0,30 L14,18 L0,6 Z" fill="#9c4126" />
        <!-- Garis List Emas Kencana -->
        <path d="M0,0 L76,0 C54,16 38,34 26,56 C14,76 6,94 0,76 Z" fill="none" stroke="#d99b26" stroke-width="1.6" />
        <path d="M4,4 L46,4 C34,16 24,26 16,40 C8,54 4,64 4,46 Z" fill="none" stroke="#f5ca68" stroke-width="1" stroke-dasharray="3,2" />
        <!-- Ornamen Flora Teratai & Wajik Betawi -->
        <polygon points="12,12 28,16 16,28" fill="#d99b26" />
        <polygon points="26,14 44,20 32,32" opacity="0.75" fill="#f5ca68" />
        <polygon points="14,26 20,44 32,32" opacity="0.75" fill="#f5ca68" />
        <circle cx="8" cy="8" r="3" fill="#f5ca68" />
        <circle cx="58" cy="10" r="2" fill="#d99b26" />
        <circle cx="10" cy="58" r="2" fill="#d99b26" />
      </svg>
    </div>
    <div class="fixed bottom-0 right-0 w-24 h-24 md:w-36 md:h-36 z-40 opacity-85 pointer-events-none select-none rotate-180 text-[#d99b26]">
      <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full filter drop-shadow-[0_2px_8px_rgba(217,155,38,0.4)]">
        <path d="M0,0 L100,0 C75,12 50,28 32,48 C16,68 8,88 0,100 Z" opacity="0.18" />
        <path d="M0,0 L100,0 L90,14 L78,0 L66,14 L54,0 L42,14 L30,0 L18,14 L6,0 L0,0 Z" fill="#9c4126" />
        <path d="M0,0 L0,100 L14,90 L0,78 L14,66 L0,54 L14,42 L0,30 L14,18 L0,6 Z" fill="#9c4126" />
        <path d="M0,0 L76,0 C54,16 38,34 26,56 C14,76 6,94 0,76 Z" fill="none" stroke="#d99b26" stroke-width="1.6" />
        <path d="M4,4 L46,4 C34,16 24,26 16,40 C8,54 4,64 4,46 Z" fill="none" stroke="#f5ca68" stroke-width="1" stroke-dasharray="3,2" />
        <polygon points="12,12 28,16 16,28" fill="#d99b26" />
        <polygon points="26,14 44,20 32,32" opacity="0.75" fill="#f5ca68" />
        <polygon points="14,26 20,44 32,32" opacity="0.75" fill="#f5ca68" />
        <circle cx="8" cy="8" r="3" fill="#f5ca68" />
        <circle cx="58" cy="10" r="2" fill="#d99b26" />
        <circle cx="10" cy="58" r="2" fill="#d99b26" />
      </svg>
    </div>

    <!-- Music Control Component -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#1a3c2b"
      accentColor="#d99b26"
      :autoPlay="!showWelcome"
    />

    <!-- Floating Bottom Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#17110a]/92 backdrop-blur-xl border border-[#d99b26]/40 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.85)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#f5ca68] scale-105' : 'text-[#deb887]/75 hover:text-[#f5ca68]'"
        >
          <i :class="[item.icon, 'text-base md:text-lg']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-sans">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#d99b26] transition-all"
            :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- WELCOME SCREEN (BUKA PALANG PINTU ADAT BETAWI) -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#22170e] via-[#161009] to-[#0c0905] transition-all duration-1000"
      >
        <!-- Golden & Terracotta Gigi Balang Frame -->
        <div class="absolute inset-4 md:inset-8 border border-[#d99b26]/40 rounded-3xl pointer-events-none shadow-[inset_0_0_50px_rgba(217,155,38,0.18)]">
          <div class="absolute inset-1.5 border border-[#9c4126]/35 rounded-[22px]"></div>

          <!-- Gigi Balang Top Trim -->
          <div class="absolute top-2 inset-x-8 h-3 flex justify-between overflow-hidden opacity-60 text-[#d99b26]">
            <svg class="w-full h-full" preserveAspectRatio="repeat-x" viewBox="0 0 120 12" fill="currentColor">
              <path d="M0,0 L10,12 L20,0 L30,12 L40,0 L50,12 L60,0 L70,12 L80,0 L90,12 L100,0 L110,12 L120,0 Z" />
            </svg>
          </div>
          <!-- Gigi Balang Bottom Trim -->
          <div class="absolute bottom-2 inset-x-8 h-3 flex justify-between overflow-hidden opacity-60 text-[#d99b26] rotate-180">
            <svg class="w-full h-full" preserveAspectRatio="repeat-x" viewBox="0 0 120 12" fill="currentColor">
              <path d="M0,0 L10,12 L20,0 L30,12 L40,0 L50,12 L60,0 L70,12 L80,0 L90,12 L100,0 L110,12 L120,0 Z" />
            </svg>
          </div>
        </div>

        <div class="relative z-10 space-y-6 md:space-y-7 animate-fade-in-up max-w-lg mx-auto py-8">
          <!-- Kembang Kelapa / Ondel-ondel Badge Icon -->
          <div class="flex justify-center">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#d99b26] bg-[#1a3c2b]/80 p-2 shadow-[0_0_25px_rgba(217,155,38,0.45)] flex items-center justify-center text-[#f5ca68] animate-pulse">
              <svg viewBox="0 0 100 100" fill="currentColor" class="w-14 h-14">
                <!-- Roti Buaya / Mahkota Betawi Crest -->
                <path d="M20,65 Q50,40 80,65 Q50,52 20,65 Z" />
                <!-- Kembang Kelapa Sunburst -->
                <path d="M50,15 L50,45 M35,22 L45,47 M65,22 L55,47 M22,35 L43,50 M78,35 L57,50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="50" cy="12" r="3.5" />
                <circle cx="33" cy="20" r="3" />
                <circle cx="67" cy="20" r="3" />
                <circle cx="20" cy="35" r="3" />
                <circle cx="80" cy="35" r="3" />
                <!-- Melati di Tengah -->
                <circle cx="50" cy="54" r="5" fill="#fcf9f2" />
              </svg>
            </div>
          </div>

          <div class="space-y-2">
            <p class="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#f5ca68] font-bold">
              Walimatul 'Ursy Adat Betawi
            </p>
            <h1 class="text-4xl md:text-6xl font-serif text-[#fcf9f2] drop-shadow-[0_2px_14px_rgba(217,155,38,0.4)] leading-tight">
              {{ data.groomName?.split(' ')[0] || data.groomName || 'Abang' }}
              <span class="text-2xl md:text-3xl font-serif text-[#d99b26] block my-1">&amp;</span>
              {{ data.brideName?.split(' ')[0] || data.brideName || 'None' }}
            </h1>
            <p class="text-xs md:text-sm font-sans text-[#deb887] italic tracking-wide">
              "Palang Pintu Terbuka, Dua Hati Menyatu Menuju Sakinah"
            </p>
          </div>

          <!-- Guest Card Badge -->
          <div class="my-5 p-5 md:p-6 border border-[#d99b26]/40 bg-[#1b140c]/90 backdrop-blur-md rounded-2xl max-w-xs mx-auto shadow-2xl space-y-2">
            <p class="text-[10px] font-sans uppercase tracking-[0.25em] text-[#f5ca68] font-medium">
              Keluarge &amp; Sahabat Tercinte
            </p>
            <p class="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              {{ data.guestName || 'Tamu Kehormatan' }}
            </p>
            <p class="text-[10px] font-sans text-[#deb887]/80 italic">
              Mohon ma'af lahir batin bila ade salah penulisan name/gelar
            </p>
          </div>

          <button
            @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#9c4126] via-[#d99b26] to-[#9c4126] hover:brightness-110 text-[#fcf9f2] font-bold rounded-full transition-all shadow-[0_4px_25px_rgba(217,155,38,0.45)] text-xs uppercase tracking-[0.2em]"
          >
            <i class="fa-solid fa-door-open text-xs"></i>
            <span>Nyok Buka Palang Pintu</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN SCROLLABLE CONTENT -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth"
    >
      <!-- SECTION 1: HERO COVER -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-24 bg-gradient-to-b from-[#1c140c] via-[#120e09] to-[#120e09]">
        <div class="space-y-6 max-w-3xl mx-auto relative z-10" v-observe>
          <!-- Gigi Balang Ribbon Header -->
          <div class="flex items-center justify-center gap-4 text-[#d99b26]">
            <span class="w-12 h-px bg-[#d99b26]/60"></span>
            <span class="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#f5ca68]">Harmoni Batavia Tempo Doeloe</span>
            <span class="w-12 h-px bg-[#d99b26]/60"></span>
          </div>

          <!-- Couple Photo in Betawi Arched Frame -->
          <div v-if="data.photoCoupleUrl" class="relative inline-block my-4">
            <div class="w-48 h-64 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d99b26] p-1.5 shadow-[0_0_35px_rgba(217,155,38,0.3)] overflow-hidden bg-[#1c291e]">
              <img :src="data.photoCoupleUrl" alt="Foto Mempelai Abang & None" class="w-full h-full object-cover rounded-t-full" />
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1b140c] border border-[#d99b26] px-4 py-0.5 rounded-full text-[10px] text-[#f5ca68] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
              Abang &amp; None
            </div>
          </div>

          <h1 class="text-5xl md:text-8xl font-serif text-[#fcf9f2] leading-tight">
            {{ data.groomName }} <br />
            <span class="text-3xl md:text-5xl text-[#d99b26] italic my-2 inline-block font-serif">&amp;</span> <br />
            {{ data.brideName }}
          </h1>

          <p class="text-base md:text-xl text-[#deb887] tracking-[0.25em] uppercase font-sans font-medium">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
          </p>

          <!-- SVG Gigi Balang Horizontal Divider -->
          <div class="w-48 mx-auto h-3 text-[#d99b26] opacity-80 my-4">
            <svg class="w-full h-full" viewBox="0 0 100 12" fill="currentColor">
              <path d="M0,0 L10,12 L20,0 L30,12 L40,0 L50,12 L60,0 L70,12 L80,0 L90,12 L100,0 Z" />
            </svg>
          </div>

          <!-- Countdown Timer -->
          <div class="grid grid-cols-4 gap-3 md:gap-6 mt-8 max-w-sm mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 md:p-4 border border-[#d99b26]/35 rounded-2xl bg-[#1b140c]/85 backdrop-blur-sm shadow-xl"
            >
              <div class="text-2xl md:text-3xl font-serif font-bold text-[#fcf9f2]">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-wider text-[#f5ca68] font-sans mt-1 font-semibold">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 animate-bounce text-[#d99b26]/70">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- SECTION 2: PANTUN PALANG PINTU & AYAT SUCI (QUOTE SECTION) -->
      <section v-if="isSectionEnabled('quote')" class="py-24 px-6 bg-[#18110b] relative text-center border-y border-[#d99b26]/20" v-observe>
        <div class="max-w-3xl mx-auto space-y-8">
          <!-- Pantun Palang Pintu Card -->
          <div class="p-6 md:p-8 rounded-3xl border border-[#d99b26]/40 bg-[#1f170f]/90 backdrop-blur-md shadow-2xl space-y-4">
            <div class="inline-flex items-center justify-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#f5ca68]">
              <i class="fa-solid fa-feather-pointed"></i>
              <span>Pantun Palang Pintu Betawi</span>
            </div>
            <p class="font-serif italic text-base md:text-lg text-[#fcf9f2] leading-relaxed">
              "Kalo jalan lewat Kwitang, jangan lupe beli semanggi.<br />
              Niat kami datang bertandang, nyambung silaturahmi yang tinggi.<br />
              Bukan kembang sembarang kembang, kembang melati harum mewangi.<br />
              Bukan kumbang sembarang kumbang, niat meminang si pujaan hati."
            </p>
            <div class="w-16 h-0.5 bg-[#9c4126] mx-auto"></div>
            <p class="text-[11px] font-sans text-[#deb887] tracking-wider uppercase font-semibold">
              Kearifan Adat Palang Pintu Batavia
            </p>
          </div>

          <!-- Holy Verse (QS Ar-Rum 21) -->
          <div class="space-y-4 pt-4">
            <div class="flex justify-center text-[#d99b26] opacity-80">
              <!-- Ronce Melati SVG -->
              <svg class="w-8 h-8" viewBox="0 0 40 40" fill="currentColor">
                <circle cx="20" cy="20" r="6" />
                <circle cx="20" cy="8" r="4" opacity="0.8" />
                <circle cx="20" cy="32" r="4" opacity="0.8" />
                <circle cx="8" cy="20" r="4" opacity="0.8" />
                <circle cx="32" cy="20" r="4" opacity="0.8" />
              </svg>
            </div>
            <p class="font-serif text-lg md:text-2xl text-[#fcf9f2] italic leading-relaxed px-4">
              "{{ data.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.' }}"
            </p>
            <div class="w-16 h-px bg-[#d99b26] mx-auto"></div>
            <p class="text-xs font-sans font-bold text-[#f5ca68] tracking-[0.3em] uppercase">
              {{ data.quoteSource || 'QS. Ar-Rum: 21' }}
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION 3: PROFIL KEDUA MEMPELAI (NONE & ABANG) -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="py-24 md:py-32 px-6 bg-[#120e09]" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-16">
          <div class="space-y-4">
            <!-- Roti Buaya SVG Motif -->
            <div class="flex justify-center mb-2 text-[#d99b26]">
              <svg viewBox="0 0 160 50" fill="currentColor" class="w-32 h-10 drop-shadow-[0_2px_8px_rgba(217,155,38,0.35)]">
                <!-- Sepasang Roti Buaya Betawi Saling Berhadapan -->
                <path d="M10,25 Q35,15 55,25 Q70,30 75,25 Q55,20 10,25 Z" />
                <circle cx="70" cy="23" r="2" fill="#120e09" />
                <path d="M150,25 Q125,15 105,25 Q90,30 85,25 Q105,20 150,25 Z" />
                <circle cx="90" cy="23" r="2" fill="#120e09" />
                <!-- Sisik ornamen buaya -->
                <circle cx="35" cy="24" r="1.5" />
                <circle cx="45" cy="23" r="1.5" />
                <circle cx="125" cy="24" r="1.5" />
                <circle cx="115" cy="23" r="1.5" />
                <!-- Melati simpul di tengah -->
                <circle cx="80" cy="25" r="4" fill="#fcf9f2" />
              </svg>
            </div>
            <p class="text-xs uppercase tracking-[0.3em] text-[#f5ca68] font-sans font-bold">Mempelai Berbahagia</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fcf9f2]">Abang &amp; None</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d99b26] to-transparent mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-16 md:gap-12 items-center">
            <!-- Groom / Abang Gagah -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d99b26] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-[#1a3c2b] overflow-hidden">
                  <img
                    :src="data.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'"
                    alt="Abang Penganten"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#9c4126] border border-[#d99b26] px-4 py-0.5 rounded-full text-[10px] text-[#fcf9f2] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  Abang Gagah
                </div>
              </div>
              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fcf9f2]">{{ data.groomName }}</h3>
                <p v-if="data.parents?.groomParents" class="text-xs text-[#deb887] max-w-xs mx-auto leading-relaxed">
                  Putra tercinte dari <br />
                  <strong class="text-[#fcf9f2]">{{ data.parents.groomParents }}</strong>
                </p>
                <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaGroom.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#f5ca68] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Bride / None Manis -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d99b26] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-[#1a3c2b] overflow-hidden">
                  <img
                    :src="data.bridePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'"
                    alt="None Penganten"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#9c4126] border border-[#d99b26] px-4 py-0.5 rounded-full text-[10px] text-[#fcf9f2] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  None Manis
                </div>
              </div>
              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fcf9f2]">{{ data.brideName }}</h3>
                <p v-if="data.parents?.brideParents" class="text-xs text-[#deb887] max-w-xs mx-auto leading-relaxed">
                  Putri tercinte dari <br />
                  <strong class="text-[#fcf9f2]">{{ data.parents.brideParents }}</strong>
                </p>
                <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaBrides.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#f5ca68] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 4: RANGKAIAN ACARA (AKAD NIKAH & RESEPSI PESTA ADAT) -->
      <section v-if="isSectionEnabled('event')" id="event" class="py-24 md:py-32 px-6 bg-[#18110a] relative" v-observe>
        <div class="max-w-4xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#f5ca68] font-sans font-bold">Waktu &amp; Lokasi Hajat</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fcf9f2]">Rangkaian Acara</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d99b26] to-transparent mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-8 items-stretch">
            <!-- Akad Nikah / Ijab Qabul -->
            <div
              v-if="data.akadLocation"
              class="p-8 border border-[#d99b26]/40 rounded-3xl bg-[#20160d]/90 backdrop-blur-sm space-y-5 shadow-2xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d99b26] text-[#f5ca68] bg-[#1a3c2b]/80 shadow-inner">
                  <i class="fa-solid fa-ring text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fcf9f2]">Akad Nikah</h3>
                <div class="w-12 h-px bg-[#d99b26]/40 mx-auto"></div>
                <p class="text-base text-[#f5ca68] font-sans font-bold">
                  {{ formatDate(data.akadLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#deb887] font-sans font-medium">
                  {{ formatTime(data.akadLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#fcf9f2] leading-relaxed pt-2">
                  {{ data.akadLocation.description || data.akadLocation.address }}
                </p>
              </div>

              <div class="pt-6 flex flex-wrap gap-3 justify-center">
                <a
                  v-if="data.akadLocation.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#d99b26] text-[#f5ca68] hover:bg-[#d99b26] hover:text-[#120e09] transition-all text-xs font-sans uppercase tracking-wider font-bold shadow-md"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
                <a
                  v-if="data.akadLocation.dateTime"
                  :href="addToCalendar(data.akadLocation, 'Akad Nikah')"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#9c4126] text-[#fcf9f2] hover:bg-[#b84c2a] transition-all text-xs font-sans uppercase tracking-wider font-bold shadow-md"
                >
                  <i class="fa-regular fa-calendar-plus"></i> Simpan Tanggal
                </a>
              </div>
            </div>

            <!-- Resepsi Pesta Adat Betawi -->
            <div
              v-if="data.resepsiLocation"
              class="p-8 border border-[#d99b26]/40 rounded-3xl bg-[#20160d]/90 backdrop-blur-sm space-y-5 shadow-2xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d99b26] text-[#f5ca68] bg-[#1a3c2b]/80 shadow-inner">
                  <i class="fa-solid fa-champagne-glasses text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fcf9f2]">Resepsi Adat</h3>
                <div class="w-12 h-px bg-[#d99b26]/40 mx-auto"></div>
                <p class="text-base text-[#f5ca68] font-sans font-bold">
                  {{ formatDate(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#deb887] font-sans font-medium">
                  {{ formatTime(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#fcf9f2] leading-relaxed pt-2">
                  {{ data.resepsiLocation.description || data.resepsiLocation.address }}
                </p>
              </div>

              <div class="pt-6 flex flex-wrap gap-3 justify-center">
                <a
                  v-if="data.resepsiLocation.mapUrl"
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#d99b26] text-[#f5ca68] hover:bg-[#d99b26] hover:text-[#120e09] transition-all text-xs font-sans uppercase tracking-wider font-bold shadow-md"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
                <a
                  v-if="data.resepsiLocation.dateTime"
                  :href="addToCalendar(data.resepsiLocation, 'Resepsi Pernikahan')"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#9c4126] text-[#fcf9f2] hover:bg-[#b84c2a] transition-all text-xs font-sans uppercase tracking-wider font-bold shadow-md"
                >
                  <i class="fa-regular fa-calendar-plus"></i> Simpan Tanggal
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 5: LOVE STORY TIMELINE -->
      <section v-if="isSectionEnabled('love-story')" id="story" class="py-24 md:py-32 px-6 bg-[#120e09]" v-observe>
        <div class="max-w-4xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#f5ca68] font-sans font-bold">Jejak Langkah Asmara</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fcf9f2]">Kisah Kasih</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d99b26] to-transparent mx-auto"></div>
          </div>

          <!-- Desktop Alternating Timeline -->
          <div class="space-y-12 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-[#d99b26]/30 hidden md:block">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="idx"
              class="relative flex items-center justify-between"
              v-observe
            >
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                <div class="p-6 rounded-2xl border border-[#d99b26]/35 bg-[#1e150d]/85 space-y-2 shadow-xl">
                  <span class="text-xs text-[#f5ca68] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
                  <h3 class="text-xl font-serif text-[#fcf9f2]">{{ story.title }}</h3>
                  <p class="text-xs text-[#deb887] leading-relaxed font-sans">{{ story.description }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d99b26] border-4 border-[#120e09] z-10 shadow-[0_0_10px_rgba(217,155,38,0.8)]"></div>
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                <img
                  v-if="story.image || isPreviewMode"
                  :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                  class="rounded-2xl shadow-lg border border-[#d99b26]/30 aspect-video object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Mobile Story List -->
          <div class="md:hidden space-y-8">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="'m-' + idx"
              class="p-6 rounded-2xl border border-[#d99b26]/35 bg-[#1e150d]/85 space-y-3 shadow-xl"
            >
              <img
                v-if="story.image || isPreviewMode"
                :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                class="rounded-xl shadow-md border border-[#d99b26]/30 aspect-video object-cover w-full mb-3"
              />
              <span class="text-[10px] text-[#f5ca68] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
              <h3 class="text-lg font-serif text-[#fcf9f2]">{{ story.title }}</h3>
              <p class="text-xs text-[#deb887] leading-relaxed font-sans">{{ story.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 6: VIDEO PREWEDDING -->
      <section v-if="isSectionEnabled('video') && data.videoPrewedding" class="py-24 px-6 bg-[#161009]" v-observe>
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#f5ca68] font-sans font-bold">Sinematik Batavia</p>
            <h2 class="text-4xl md:text-5xl font-serif text-[#fcf9f2]">Koleksi Video</h2>
            <div class="w-16 h-px bg-[#d99b26] mx-auto"></div>
          </div>
          <div class="aspect-video w-full rounded-3xl overflow-hidden border-2 border-[#d99b26]/40 shadow-2xl bg-black">
            <iframe
              :src="getEmbedUrlVideo(data.videoPrewedding)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <!-- SECTION 7: GALERI FOTO (GALLERY INVITATION) -->
      <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="py-24 md:py-32 px-6 bg-[#18110b]" v-observe>
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#f5ca68] font-sans font-bold">Dokumentasi Kenangan</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fcf9f2]">Galeri Foto</h2>
            <div class="w-16 h-px bg-[#d99b26] mx-auto"></div>
          </div>

          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- SECTION 8: TURUT MENGUNDANG -->
      <section
        v-if="isSectionEnabled('extended-family') && (data.extendedFamily?.length || data.turutMengundang)"
        class="py-20 px-6 bg-[#140f09] border-t border-[#d99b26]/20 text-center"
        v-observe
      >
        <div class="max-w-2xl mx-auto space-y-6">
          <h3 class="text-2xl font-serif text-[#fcf9f2]">Turut Mengundang</h3>
          <p class="text-xs text-[#f5ca68] font-sans uppercase tracking-widest">Keluarge Besar &amp; Para Sesepuh</p>
          <div class="w-12 h-px bg-[#d99b26] mx-auto"></div>
          <div class="space-y-2 text-sm text-[#deb887] font-sans">
            <p v-for="(person, idx) in normalizedExtendedFamily" :key="idx" class="leading-relaxed">
              {{ person }}
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION 9: WEDDING GIFT / TANDE ASIH -->
      <section
        v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || walletItems.length || giftAddresses.length)"
        id="gift"
        class="py-24 md:py-32 px-6 bg-[#120e09] text-center"
        v-observe
      >
        <div class="max-w-4xl mx-auto space-y-12">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#f5ca68] font-sans font-bold">Tande Kasih &amp; Keberkahan</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fcf9f2]">Amplop Digital &amp; Kado</h2>
            <div class="w-16 h-px bg-[#d99b26] mx-auto"></div>
            <p class="text-sm text-[#deb887] max-w-lg mx-auto font-sans leading-relaxed">
              Doa restu dan kerelaan bapak/ibu/saudara sekalian jadi hadiah paling berharge buat Abang &amp; None sekeluarge.
            </p>
          </div>

          <!-- Bank & E-Wallet Cards -->
          <div class="flex flex-wrap justify-center gap-6">
            <div
              v-for="(bank, idx) in data.bankAccounts"
              :key="'bank-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d99b26]/40 bg-[#1d150d]/90 space-y-3 shadow-xl"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#f5ca68] uppercase font-sans tracking-widest">
                <img v-if="bank.bankLogo" :src="bank.bankLogo" :alt="bank.bankName" class="h-8 max-w-[120px] object-contain" />
                <span v-else>{{ bank.bankName }}</span>
              </div>
              <p class="text-xl font-mono text-white font-bold tracking-wider">{{ bank.accountNumber }}</p>
              <p class="text-xs text-[#deb887] font-sans">a.n {{ bank.accountName }}</p>
              <button
                @click="copyToClipboard(bank.accountNumber)"
                class="w-full py-2 bg-transparent border border-[#d99b26]/60 hover:bg-[#d99b26] text-[#f5ca68] hover:text-[#120e09] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Rekening
              </button>
            </div>

            <div
              v-for="(wallet, idx) in walletItems"
              :key="'wallet-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d99b26]/40 bg-[#1d150d]/90 space-y-3 shadow-xl"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#f5ca68] uppercase font-sans tracking-widest">
                {{ wallet.wallet_provider }}
              </div>
              <img
                v-if="wallet.wallet_image"
                :src="wallet.wallet_image"
                :alt="'QR ' + wallet.wallet_provider"
                class="w-36 h-36 object-contain mx-auto rounded-lg bg-white p-2"
              />
              <p class="text-xl font-mono text-white font-bold tracking-wider">{{ wallet.wallet_number }}</p>
              <button
                @click="copyToClipboard(wallet.wallet_number)"
                class="w-full py-2 bg-transparent border border-[#d99b26]/60 hover:bg-[#d99b26] text-[#f5ca68] hover:text-[#120e09] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Nomor
              </button>
            </div>
          </div>

          <!-- Physical Gift Address -->
          <div v-if="giftAddresses.length" class="max-w-xl mx-auto space-y-4 pt-6">
            <h4 class="text-lg font-serif text-[#f5ca68]">Kirim Kado Fisik</h4>
            <div
              v-for="(addr, idx) in giftAddresses"
              :key="'addr-' + idx"
              class="p-6 border border-[#d99b26]/35 rounded-2xl bg-[#1d150d]/85 text-left space-y-3"
            >
              <p class="text-xs text-[#fcf9f2] leading-relaxed whitespace-pre-line font-sans">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="text-xs text-[#f5ca68] border border-[#d99b26]/60 px-4 py-1.5 rounded-full hover:bg-[#d99b26] hover:text-[#120e09] font-sans font-bold uppercase tracking-wider"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Alamat
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 10: RSVP & DOA RESTU (RESTU TETAMU) -->
      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="py-24 md:py-32 px-6 bg-[#18110a] relative" v-observe>
        <div class="max-w-2xl mx-auto space-y-12">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#f5ca68] font-sans font-bold">Konfirmasi Rawuh &amp; Sike</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fcf9f2]">Doa &amp; Restu</h2>
            <div class="w-16 h-px bg-[#d99b26] mx-auto"></div>
          </div>

          <div class="p-8 border border-[#d99b26]/35 rounded-3xl bg-[#20160e]/95 shadow-2xl space-y-6">
            <form @submit.prevent="submitRsvp" class="space-y-4">
              <div>
                <label class="block text-xs uppercase font-sans text-[#f5ca68] tracking-wider mb-2 font-bold">Name Lengkap</label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Ketik name panjenengan / saudara..."
                  class="w-full bg-[#140e09] border border-[#d99b26]/40 rounded-xl px-4 py-3 text-[#fcf9f2] text-sm focus:outline-none focus:border-[#f5ca68]"
                />
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#f5ca68] tracking-wider mb-2 font-bold">Konfirmasi Kehadiran</label>
                <select
                  v-model="rsvp.attendance"
                  class="w-full bg-[#140e09] border border-[#d99b26]/40 rounded-xl px-4 py-3 text-[#fcf9f2] text-sm focus:outline-none focus:border-[#f5ca68]"
                >
                  <option value="hadir">Insya Allah, Pasti Hadir</option>
                  <option value="tidak">Ma'af, Belum Bisa Hadir</option>
                  <option value="ragu">Masih Ragu-ragu</option>
                </select>
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block text-xs uppercase font-sans text-[#f5ca68] tracking-wider mb-2 font-bold">Jumlah Tamu</label>
                <select
                  v-model="rsvp.totalGuests"
                  class="w-full bg-[#140e09] border border-[#d99b26]/40 rounded-xl px-4 py-3 text-[#fcf9f2] text-sm focus:outline-none focus:border-[#f5ca68]"
                >
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
                </select>
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#f5ca68] tracking-wider mb-2 font-bold">Doa &amp; Ucapan Selamat</label>
                <textarea
                  v-model="rsvp.message"
                  rows="4"
                  placeholder="Tulis ucapan dan doa terbaik buat Abang & None..."
                  class="w-full bg-[#140e09] border border-[#d99b26]/40 rounded-xl px-4 py-3 text-[#fcf9f2] text-sm focus:outline-none focus:border-[#f5ca68]"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-3.5 bg-gradient-to-r from-[#9c4126] via-[#d99b26] to-[#9c4126] text-[#fcf9f2] font-bold rounded-xl shadow-lg transition-all hover:brightness-110 text-xs uppercase tracking-widest"
              >
                {{ submittingRsvp ? 'Mengirim Doa...' : 'Kirim Konfirmasi & Doa Restu' }}
              </button>
            </form>
          </div>

          <!-- Guest Messages List -->
          <div v-if="guestMessages.length" class="space-y-4 max-h-96 overflow-y-auto no-scrollbar pr-1">
            <div
              v-for="(msg, idx) in guestMessages"
              :key="'msg-' + idx"
              class="p-5 border border-[#d99b26]/25 rounded-2xl bg-[#1d150d]/70 space-y-2 text-left"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-[#fcf9f2] text-base">{{ msg.name }}</span>
                <span
                  class="text-[9px] px-2 py-0.5 rounded-full font-sans uppercase font-bold"
                  :class="msg.attendance === 'hadir' ? 'bg-[#d99b26]/20 text-[#f5ca68]' : 'bg-gray-800 text-gray-400'"
                >
                  {{ msg.attendance === 'hadir' ? 'Hadir' : 'Absen' }}
                </span>
              </div>
              <p class="text-xs text-[#deb887] font-sans leading-relaxed">"{{ msg.message }}"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 11: FOOTER & PANTUN PENUTUP BETAWI -->
      <footer class="py-20 md:py-28 bg-[#0c0905] text-center border-t border-[#d99b26]/30 relative overflow-hidden">
        <div class="relative z-10 px-6 space-y-5">
          <!-- Gigi Balang Mini Ornamen -->
          <div class="w-32 mx-auto h-2.5 text-[#d99b26] opacity-70">
            <svg class="w-full h-full" viewBox="0 0 100 10" fill="currentColor">
              <path d="M0,0 L10,10 L20,0 L30,10 L40,0 L50,10 L60,0 L70,10 L80,0 L90,10 L100,0 Z" />
            </svg>
          </div>

          <p class="font-serif italic text-[#f5ca68] text-base md:text-lg">
            "Buah mangga buah kueni, paling enak dimakan siang hari.<br />
            Terime kasih udah hadir di mari, semoga berkah mengiringi hari."
          </p>

          <h2 class="text-4xl md:text-6xl font-serif text-[#fcf9f2]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
          <p v-if="data.footerText" class="text-[#deb887] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            {{ data.footerText }}
          </p>
          <div class="w-16 h-px bg-[#d99b26]/40 mx-auto my-6"></div>
          <WatermarkBadge variant="gold" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
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
  },
  { deep: true, immediate: true },
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)
const showWelcome = ref(true)
const activeSection = ref('home')
const submittingRsvp = ref(false)

const rsvp = ref({
  name: data.value.guestName || '',
  attendance: 'hadir',
  totalGuests: 1,
  message: '',
})

const guestMessages = ref([])

// Section normalization
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
    'extended-family': ['extended-family', 'turut-mengundang'],
    video: ['video', 'video-prewedding'],
    'live-streaming': ['live-streaming', 'live-stream'],
    quote: ['quote', 'ayat', 'pantun'],
    gallery: ['gallery', 'photos'],
    gift: ['gift', 'amplop', 'kado'],
    rsvp: ['rsvp', 'doa', 'wishes'],
  }
  const aliases = aliasMap[key] || [key]
  return aliases.some((a) => sections.includes(a))
}

const normalizedExtendedFamily = computed(() => {
  const ef = data.value.extendedFamily
  if (Array.isArray(ef) && ef.length) return ef
  const tm = data.value.turutMengundang
  if (typeof tm === 'string' && tm.trim()) {
    return tm.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
  }
  return []
})

const giftAddresses = computed(() => {
  const raw = data.value.giftDeliveryAddress
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  return list.map((a) => String(a || '').trim()).filter(Boolean)
})

const walletItems = computed(() => {
  const raw = data.value.eWalletLink
  const list = Array.isArray(raw) ? raw : raw && typeof raw === 'string' && raw.trim() ? [raw.trim()] : []
  return list
    .map((wallet) => {
      if (!wallet) return null
      if (typeof wallet === 'object') return wallet
      return {
        wallet_provider: 'E-Wallet',
        wallet_number: String(wallet),
        wallet_image: '',
      }
    })
    .filter(Boolean)
})

const galleryImages = computed(() => {
  if (Array.isArray(data.value.galleryImages) && data.value.galleryImages.length) {
    return data.value.galleryImages.map((img) =>
      typeof img === 'object' && img?.src ? img : { src: String(img || ''), thumbnail: String(img || '') },
    )
  }
  return []
})

const mockStories = [
  {
    title: 'Pertame Ketemu di Batavia',
    date: '2022',
    description: 'Pandangan pertame waktu jalan sore di pelataran Kota Tua, senyum manis None bikin Abang kepincut hati.',
  },
  {
    title: 'Nglamar & Niat Baik Betandang',
    date: '2024',
    description: 'Keluarge besan sowan bawa sirih nanas dan roti buaya, tanda niat tulus menyatukan dua kelurga besan.',
  },
  {
    title: 'Akad & Buka Palang Pintu',
    date: '2026',
    description: 'Hari bahagia menyatukan janji suci di hadapan penghulu dan sanak keluarga, resmi jadi sepasang penganten.',
  },
]

// Navigation Bar
const navItems = computed(() => {
  const list = [
    { id: 'home', label: 'Buka Pintu', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Abang & None', icon: 'fa-solid fa-heart' },
    { id: 'event', label: 'Akad & Pesta', icon: 'fa-solid fa-calendar-check' },
  ]
  if (isSectionEnabled('love-story')) list.push({ id: 'story', label: 'Kisah Kasih', icon: 'fa-solid fa-book-open' })
  if (isSectionEnabled('gallery')) list.push({ id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' })
  if (isSectionEnabled('gift')) list.push({ id: 'gift', label: 'Tande Asih', icon: 'fa-solid fa-gift' })
  if (isSectionEnabled('rsvp')) list.push({ id: 'rsvp', label: 'Kirim Doa', icon: 'fa-solid fa-envelope-open-text' })
  return list
})

// Countdown Timer
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let timerInterval = null

function updateCountdown() {
  const targetDateStr = data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
  if (!targetDateStr) return
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

// Helpers
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return (
    date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  )
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('http') || choice.startsWith('/')) return choice
  return `/audio/${choice}`
}

function getEmbedUrlVideo(url) {
  if (!url) return ''
  if (url.includes('embed')) return url
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Alhamdulillah, berhasil disalin!')
  })
}

function addToCalendar(event, titlePrefix = 'Pernikahan') {
  if (!event?.dateTime) return '#'
  const start = new Date(event.dateTime)
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
  const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
  const title = encodeURIComponent(`${titlePrefix} ${data.value.groomName || 'Abang'} & ${data.value.brideName || 'None'}`)
  const details = encodeURIComponent(event.description || 'Pernikahan Adat Betawi - Harmoni Batavia Tempo Doeloe')
  const location = encodeURIComponent(event.address || event.locationName || '')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`
}

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    const el = document.getElementById('main-content')
    if (el) el.classList.remove('opacity-0')
  }, 100)
}

function scrollToSection(id) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

async function submitRsvp() {
  submittingRsvp.value = true
  try {
    if (data.value.id && !isPreviewMode.value) {
      await createGuestMessage({
        invitationId: data.value.id,
        name: rsvp.value.name,
        message: rsvp.value.message,
        attendance: rsvp.value.attendance,
        totalGuests: rsvp.value.totalGuests,
      })
    }
    guestMessages.value.unshift({
      name: rsvp.value.name,
      message: rsvp.value.message,
      attendance: rsvp.value.attendance,
    })
    toast.success('Terime kasih banyaak! Konfirmasi dan doa restu udah kami terime.')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Mohon ma\'af, terjadi kesalahan waktu ngirim doa.')
  } finally {
    submittingRsvp.value = false
  }
}

async function loadWishes() {
  if (data.value.id && !isPreviewMode.value) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res || []
    } catch (err) {
      // fallback
    }
  } else {
    guestMessages.value = [
      {
        name: 'Kong Haji & Mpok Hindun',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khoir. Selamat menempuh hidup baru buat Abang dan None, langgeng sampai kakek nenek, rukun rezekinya lancar.',
        attendance: 'hadir',
      },
      {
        name: 'Babeh Sabeni & Keluarge',
        message: 'Nyok kite doaken bareng-bareng! Semoga keluarge barunye sakinah mawaddah warahmah, berkah dunia akhirat!',
        attendance: 'hadir',
      },
    ]
  }
}

// Observe directive
const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('opacity-0', 'translate-y-8')
            el.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
  },
}

onMounted(() => {
  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)
  loadWishes()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
