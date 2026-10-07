<template>
  <div class="relative min-h-screen bg-[#081711] overflow-hidden font-serif no-scrollbar text-[#faf8f2] selection:bg-[#d4af37]/30 selection:text-[#f4e087]">

    <!-- Silk Paper & Weave Texture Overlay -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

    <!-- Motif Sarung Sabbe Bugis (Geometric Tenun Sutra Lagosi / Sulapa Eppa Diamond Mesh) -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15"
      style="
        background-image: 
          repeating-linear-gradient(45deg, transparent 0 14px, #d4af37 14px 15px, transparent 15px 30px),
          repeating-linear-gradient(-45deg, transparent 0 14px, #681423 14px 15px, transparent 15px 30px),
          radial-gradient(circle, #f4e087 1px, transparent 1.5px);
        background-size: 30px 30px, 30px 30px, 30px 30px;
      "
    ></div>

    <!-- SVG Siluet Atap Rumah Saoraja (Balla Lompoa / Timpa Laja 5 Tingkat) Watermark Backdrop -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[650px] pointer-events-none opacity-[0.045] z-0 select-none text-[#d4af37]">
      <svg viewBox="0 0 500 360" fill="currentColor" class="w-full h-auto filter drop-shadow-[0_0_35px_rgba(212,175,55,0.2)]">
        <!-- Puncak Anjong Kembar Melengkung -->
        <path d="M 250 15 Q 240 35 220 45 Q 200 48 185 35 Q 195 20 230 10 Q 245 5 250 15 Z" />
        <path d="M 250 15 Q 260 35 280 45 Q 300 48 315 35 Q 305 20 270 10 Q 255 5 250 15 Z" />
        <circle cx="250" cy="18" r="7" />
        <path d="M 248 10 L 252 10 L 252 0 L 248 0 Z" />

        <!-- Segitiga Timpa Laja (5 Tingkatan Bangsawan Saoraja) -->
        <!-- Tingkat 1 (Teratas) -->
        <polygon points="250,50 220,95 280,95" />
        <rect x="210" y="95" width="80" height="4" rx="2" fill="#aa820a" />

        <!-- Tingkat 2 -->
        <polygon points="250,90 200,140 300,140" />
        <rect x="185" y="140" width="130" height="5" rx="2.5" fill="#aa820a" />

        <!-- Tingkat 3 -->
        <polygon points="250,135 175,190 325,190" />
        <rect x="160" y="190" width="180" height="6" rx="3" fill="#aa820a" />

        <!-- Tingkat 4 -->
        <polygon points="250,185 145,245 355,245" />
        <rect x="130" y="245" width="240" height="7" rx="3.5" fill="#aa820a" />

        <!-- Tingkat 5 (Dasar Saoraja Utama) -->
        <polygon points="250,240 110,305 390,305" />
        <rect x="90" y="305" width="320" height="8" rx="4" fill="#aa820a" />

        <!-- Kisi-kisi Jendela Krawangan Ukir Bugis & Tiang Balla Lompoa -->
        <rect x="130" y="313" width="240" height="45" rx="4" fill="none" stroke="currentColor" stroke-width="3" />
        <line x1="170" y1="313" x2="170" y2="358" stroke="currentColor" stroke-width="2" />
        <line x1="210" y1="313" x2="210" y2="358" stroke="currentColor" stroke-width="2" />
        <line x1="250" y1="313" x2="250" y2="358" stroke="currentColor" stroke-width="2" />
        <line x1="290" y1="313" x2="290" y2="358" stroke="currentColor" stroke-width="2" />
        <line x1="330" y1="313" x2="330" y2="358" stroke="currentColor" stroke-width="2" />

        <!-- Ornamen Walasuji / Sulapa Eppa Diamond Details -->
        <polygon points="250,110 258,122 250,134 242,122" />
        <polygon points="250,160 260,174 250,188 240,174" />
        <polygon points="250,210 262,226 250,242 238,226" />
        <polygon points="250,265 265,282 250,300 235,282" />
      </svg>
    </div>

    <!-- Aksara Lontara Subtle Watermark Overlay -->
    <div class="fixed top-1/4 -right-16 md:right-10 pointer-events-none opacity-[0.035] select-none text-[#d4af37] text-7xl md:text-9xl font-serif rotate-90 tracking-widest">
      ᨔᨗᨄᨀᨈᨕᨘ • ᨔᨗᨄᨀᨒᨙᨅᨗ
    </div>
    <div class="fixed bottom-1/4 -left-16 md:left-10 pointer-events-none opacity-[0.035] select-none text-[#d4af37] text-7xl md:text-9xl font-serif -rotate-90 tracking-widest">
      ᨔᨗᨄᨀᨕᨗᨂᨙ • ᨔᨕᨚᨑᨍ
    </div>

    <!-- Royal Bugis Gold Corner Filigrees (Sulapa Eppa / Ukiran Bunga Walasuji) -->
    <div class="fixed top-0 left-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-75 pointer-events-none select-none">
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full text-[#d4af37]">
        <path d="M 0,0 L 40,0 C 40,15 25,25 25,40 C 25,25 15,20 0,20 Z" fill="currentColor" fill-opacity="0.25" />
        <path d="M 0,2 L 35,2 C 35,12 22,22 22,35 C 12,22 2,22 2,35 L 2,0" stroke="currentColor" stroke-width="1.5" />
        <path d="M 6,6 L 24,6 L 24,24 L 6,24 Z" stroke="#f4e087" stroke-width="1" />
        <polygon points="15,9 21,15 15,21 9,15" fill="#681423" stroke="#d4af37" stroke-width="1" />
        <circle cx="15" cy="15" r="2" fill="#faf8f2" />
        <!-- Sulur spiral daun -->
        <path d="M 22,22 Q 35,30 45,22 Q 40,35 22,45" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="45" cy="22" r="2" fill="#d4af37" />
        <circle cx="22" cy="45" r="2" fill="#d4af37" />
      </svg>
    </div>
    <div class="fixed bottom-0 right-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-75 pointer-events-none select-none rotate-180">
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full text-[#d4af37]">
        <path d="M 0,0 L 40,0 C 40,15 25,25 25,40 C 25,25 15,20 0,20 Z" fill="currentColor" fill-opacity="0.25" />
        <path d="M 0,2 L 35,2 C 35,12 22,22 22,35 C 12,22 2,22 2,35 L 2,0" stroke="currentColor" stroke-width="1.5" />
        <path d="M 6,6 L 24,6 L 24,24 L 6,24 Z" stroke="#f4e087" stroke-width="1" />
        <polygon points="15,9 21,15 15,21 9,15" fill="#681423" stroke="#d4af37" stroke-width="1" />
        <circle cx="15" cy="15" r="2" fill="#faf8f2" />
        <path d="M 22,22 Q 35,30 45,22 Q 40,35 22,45" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="45" cy="22" r="2" fill="#d4af37" />
        <circle cx="22" cy="45" r="2" fill="#d4af37" />
      </svg>
    </div>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#0f291e"
      accentColor="#d4af37"
      :autoPlay="!showWelcome"
    />

    <!-- Floating Bottom Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#0f291e]/90 backdrop-blur-xl border border-[#d4af37]/40 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.75)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#f4e087] scale-105' : 'text-[#b7cbbf] hover:text-[#f4e087]'"
        >
          <i :class="[item.icon, 'text-base md:text-lg']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-sans">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d4af37] transition-all"
            :class="activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- WELCOME GATE (TABE' SOMPA / BUKA UNDANGAN SAORAJA) -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#1a4332] via-[#0f291e] to-[#081711] transition-all duration-1000"
      >
        <!-- Golden Frame Border & Sulapa Eppa Insets -->
        <div class="absolute inset-4 md:inset-8 border border-[#d4af37]/35 rounded-3xl pointer-events-none">
          <div class="absolute inset-1.5 border border-[#681423]/40 rounded-[22px]"></div>
          <!-- Corner Diamond Pins -->
          <div class="absolute top-2 left-2 w-3 h-3 rotate-45 bg-[#d4af37]"></div>
          <div class="absolute top-2 right-2 w-3 h-3 rotate-45 bg-[#d4af37]"></div>
          <div class="absolute bottom-2 left-2 w-3 h-3 rotate-45 bg-[#d4af37]"></div>
          <div class="absolute bottom-2 right-2 w-3 h-3 rotate-45 bg-[#d4af37]"></div>
        </div>

        <div class="relative z-10 space-y-6 md:space-y-8 animate-fade-in-up max-w-lg mx-auto py-8">
          <!-- Saoraja Royal Timpa Laja Crest Emblem -->
          <div class="flex justify-center">
            <div class="relative p-3 rounded-full border border-[#d4af37]/40 bg-[#0f291e]/80 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
              <svg viewBox="0 0 100 80" fill="currentColor" class="w-16 h-14 md:w-20 md:h-16 text-[#f4e087]">
                <path d="M 50 5 Q 45 15 35 20 Q 25 22 18 15 Q 23 8 40 4 Z" />
                <path d="M 50 5 Q 55 15 65 20 Q 75 22 82 15 Q 77 8 60 4 Z" />
                <circle cx="50" cy="8" r="3" fill="#f4e087" />
                <polygon points="50,18 38,32 62,32" fill="#d4af37" />
                <polygon points="50,30 30,46 70,46" fill="#f4e087" />
                <polygon points="50,44 22,60 78,60" fill="#aa820a" />
                <polygon points="50,58 14,74 86,74" fill="#d4af37" />
                <line x1="10" y1="75" x2="90" y2="75" stroke="#f4e087" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- Lontara Greeting & Titles -->
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/40 bg-[#1a4332]/60 text-[10px] md:text-xs font-sans tracking-[0.25em] text-[#f4e087] font-bold uppercase">
              <span>ᨔᨗᨄᨀᨈᨕᨘ</span>
              <span class="w-1 h-1 rounded-full bg-[#d4af37]"></span>
              <span>Adat Bugis-Makassar</span>
              <span class="w-1 h-1 rounded-full bg-[#d4af37]"></span>
              <span>ᨔᨗᨄᨀᨒᨙᨅᨗ</span>
            </div>

            <p class="font-sans text-[11px] md:text-xs tracking-[0.4em] uppercase text-[#d4af37] font-semibold pt-1">
              Mappasiarekeng &amp; Mappattuada
            </p>

            <h1 class="text-4xl md:text-6xl font-serif text-[#faf8f2] drop-shadow-[0_2px_15px_rgba(212,175,55,0.35)] leading-tight">
              {{ groomShortName }}
              <span class="text-2xl md:text-3xl font-serif text-[#f4e087] block my-1">&amp;</span>
              {{ brideShortName }}
            </h1>

            <p class="text-xs text-[#b7cbbf] tracking-widest font-sans uppercase">
              Kemegahan Saoraja &amp; Sutra Baju Bodo
            </p>
          </div>

          <!-- Guest Badge Card (Kada Tabe' Datu / Sompa) -->
          <div class="my-6 p-5 md:p-6 border border-[#d4af37]/40 bg-[#0f291e]/90 backdrop-blur-md rounded-2xl max-w-xs mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2 relative overflow-hidden">
            <div class="absolute -top-6 -right-6 w-16 h-16 bg-[#681423]/30 rounded-full blur-xl pointer-events-none"></div>
            <p class="text-[10px] font-sans uppercase tracking-[0.3em] text-[#d4af37] font-bold">
              Kada Tabe' Datu / Sompa
            </p>
            <p class="text-[11px] font-sans text-[#b7cbbf]">Katur Dihasratkan Kepada Yth:</p>
            <p class="text-xl md:text-2xl font-serif font-bold text-white tracking-wide py-0.5">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
            <p class="text-[10px] font-sans text-[#b7cbbf]/90 italic leading-relaxed pt-1">
              Tabe' ki' makkurru sumange' molo engka sala aseng iwarekkeng
            </p>
          </div>

          <!-- Open Invitation Button -->
          <button
            @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#aa820a] via-[#d4af37] to-[#aa820a] hover:brightness-110 text-[#081711] font-bold rounded-full transition-all shadow-[0_4px_25px_rgba(212,175,55,0.4)] text-xs uppercase tracking-[0.2em] transform active:scale-95"
          >
            <i class="fa-solid fa-envelope-open text-xs"></i>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN INVITATION CONTENT -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth"
    >
      <!-- HERO COVER SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-24 bg-gradient-to-b from-[#1a4332] via-[#0f291e] to-[#081711]">
        <div class="space-y-6 max-w-3xl mx-auto relative z-10" v-observe>
          <!-- Badge Salutation -->
          <div class="flex items-center justify-center gap-3 text-[#d4af37]">
            <span class="w-12 h-px bg-[#d4af37]/50"></span>
            <span class="text-[10px] uppercase tracking-[0.4em] font-sans font-bold">Walimatul 'Ursy Adat Bugis</span>
            <span class="w-12 h-px bg-[#d4af37]/50"></span>
          </div>

          <!-- Couple Main Photo (Arch / Kubah Saoraja Frame) -->
          <div v-if="data.photoCoupleUrl" class="relative inline-block my-3">
            <div class="w-52 h-72 md:w-64 md:h-88 mx-auto rounded-t-full border-2 border-[#d4af37] p-1.5 shadow-[0_0_35px_rgba(212,175,55,0.3)] overflow-hidden bg-[#0f291e]">
              <img :src="data.photoCoupleUrl" alt="Foto Pasangan Mempelai" class="w-full h-full object-cover rounded-t-full" />
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#081711] border border-[#d4af37] px-5 py-1 rounded-full text-[10px] text-[#f4e087] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
              Kallolo &amp; Bainea
            </div>
          </div>

          <!-- Couple Big Names -->
          <h1 class="text-4xl sm:text-5xl md:text-8xl font-serif text-[#faf8f2] leading-tight">
            {{ data.groomName || 'Andi Muhammad Fajar, S.T.' }} <br />
            <span class="text-2xl sm:text-3xl md:text-5xl text-[#d4af37] italic my-2 inline-block font-serif">&amp;</span> <br />
            {{ data.brideName || 'Andi Tenri Bau, S.Ked.' }}
          </h1>

          <!-- Main Event Date -->
          <p class="text-sm md:text-xl text-[#f4e087] tracking-[0.25em] uppercase font-sans font-semibold">
            {{ formatDate(mainEventDate) }}
          </p>

          <!-- Divider Sulapa Eppa -->
          <div class="flex items-center justify-center gap-2 max-w-xs mx-auto text-[#d4af37] opacity-80 my-4">
            <span class="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]"></span>
            <div class="w-2.5 h-2.5 rotate-45 border border-[#d4af37] bg-[#681423]"></div>
            <span class="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]"></span>
          </div>

          <!-- COUNTDOWN TIMER -->
          <div class="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 mt-10 max-w-sm sm:max-w-md mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 sm:p-4 border border-[#d4af37]/35 rounded-2xl bg-[#0f291e]/85 backdrop-blur-sm shadow-[0_6px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#f4e087]/60 transition-all"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none"></div>
              <div class="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#faf8f2] tracking-wider">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-wider text-[#d4af37] font-sans mt-1 font-bold">{{ label }}</div>
              <div class="text-[8px] text-[#b7cbbf] font-sans capitalize hidden sm:block">{{ countdownSubLabel(label) }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 animate-bounce text-[#d4af37]/60">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- QUOTE & FILOSOFI BUGIS (SIPAKATAU, SIPAKALEBBI, SIPAKAINGE & QS AR-RUM 21) -->
      <section v-if="isSectionEnabled('quote')" class="py-24 px-6 bg-[#0c1f17] relative text-center border-y border-[#d4af37]/25" v-observe>
        <div class="max-w-3xl mx-auto space-y-8">
          <!-- Bismillah Calligraphy Ornament -->
          <div class="text-[#d4af37] space-y-2">
            <div class="text-2xl md:text-3xl font-serif leading-relaxed" style="font-family: 'Amiri', 'Traditional Arabic', serif;">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div class="text-xs font-sans text-[#b7cbbf] tracking-widest uppercase">
              Bismillahir-Rahmanir-Rahim
            </div>
          </div>

          <!-- Bugis Philosophy Emblem -->
          <div class="inline-block p-4 rounded-2xl border border-[#d4af37]/30 bg-[#0f291e]/70 backdrop-blur-sm max-w-xl mx-auto">
            <div class="text-[#f4e087] text-lg md:text-xl font-serif tracking-widest mb-1">
              ᨔᨗᨄᨀᨈᨕᨘ • ᨔᨗᨄᨀᨒᨙᨅᨗ • ᨔᨗᨄᨀᨕᨗᨂᨙ
            </div>
            <p class="text-xs md:text-sm text-[#faf8f2] font-sans font-medium tracking-wide">
              "Sipakatau, Sipakalebbi, Sipakainge"
            </p>
            <p class="text-[11px] text-[#b7cbbf] font-sans italic mt-1">
              Saling memanusiakan dengan kelembutan, saling menghormati dan memuliakan harkat martabat, serta saling mengingatkan dalam kebaikan dan ketaatan.
            </p>
          </div>

          <!-- QS Ar-Rum 21 / Quran Verse -->
          <div class="space-y-4 pt-2">
            <p class="font-serif text-base sm:text-lg md:text-xl text-[#faf8f2] italic leading-relaxed px-4 max-w-2xl mx-auto">
              "{{ data.quoteText || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.' }}"
            </p>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
            <p class="text-xs font-sans font-bold text-[#d4af37] tracking-[0.3em] uppercase">
              {{ data.quoteSource || 'QS. Ar-Rum: 21' }}
            </p>
          </div>
        </div>
      </section>

      <!-- KEDUA MEMPELAI (ANA' KALLOLO & ANA' BAINEA) -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="py-24 md:py-32 px-6 bg-[#081711]" v-observe>
        <div class="max-w-5xl mx-auto text-center space-y-16">
          <div class="space-y-4">
            <!-- Saoraja mini crest -->
            <div class="flex justify-center text-[#d4af37]">
              <svg viewBox="0 0 120 40" fill="currentColor" class="w-28 h-auto opacity-80">
                <path d="M 60 5 L 45 25 L 75 25 Z" />
                <path d="M 60 15 L 30 35 L 90 35 Z" fill-opacity="0.7" />
                <line x1="10" y1="36" x2="110" y2="36" stroke="currentColor" stroke-width="2" />
              </svg>
            </div>
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Kallolo &amp; Bainea
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#faf8f2]">
              Kedua Mempelai
            </h2>
            <p class="text-xs md:text-sm text-[#b7cbbf] font-sans max-w-md mx-auto leading-relaxed">
              Dengan memohon rahmat dan ridho Allah SWT, mempertemukan dua insan mulia dalam ikatan suci pernikahan adat Bugis-Makassar:
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-16 md:gap-12 items-center">
            <!-- Mempelai Pria (Ana' Kallolo) -->
            <div class="space-y-6">
              <div class="relative inline-block group">
                <!-- Frame Mahkota Saoraja Emas -->
                <div class="w-56 h-76 md:w-64 md:h-84 mx-auto rounded-t-full border-2 border-[#d4af37] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.65)] bg-[#0f291e] overflow-hidden relative">
                  <div class="absolute inset-0 border border-[#681423]/40 rounded-t-full pointer-events-none"></div>
                  <img
                    :src="data.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'"
                    alt="Foto Ana' Kallolo"
                    class="w-full h-full object-cover rounded-t-full transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <!-- Badge Adat Pria -->
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1a4332] border border-[#d4af37] px-4 py-1 rounded-full text-[10px] text-[#f4e087] font-sans font-bold uppercase tracking-widest shadow-md">
                  Ana' Kallolo (Mempelai Pria)
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#faf8f2] font-semibold">
                  {{ data.groomName || 'Andi Muhammad Fajar, S.T.' }}
                </h3>
                <p v-if="data.parents?.groomParents" class="text-xs text-[#b7cbbf] max-w-xs mx-auto leading-relaxed font-sans">
                  Putra tercinta dari: <br />
                  <strong class="text-[#faf8f2] font-medium">{{ data.parents.groomParents }}</strong>
                </p>
                <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaGroom.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#f4e087] transition-colors"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Mempelai Wanita (Ana' Bainea) -->
            <div class="space-y-6">
              <div class="relative inline-block group">
                <!-- Frame Mahkota Saoraja Emas -->
                <div class="w-56 h-76 md:w-64 md:h-84 mx-auto rounded-t-full border-2 border-[#d4af37] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.65)] bg-[#0f291e] overflow-hidden relative">
                  <div class="absolute inset-0 border border-[#681423]/40 rounded-t-full pointer-events-none"></div>
                  <img
                    :src="data.bridePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'"
                    alt="Foto Ana' Bainea"
                    class="w-full h-full object-cover rounded-t-full transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <!-- Badge Adat Wanita -->
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1a4332] border border-[#d4af37] px-4 py-1 rounded-full text-[10px] text-[#f4e087] font-sans font-bold uppercase tracking-widest shadow-md">
                  Ana' Bainea (Mempelai Wanita)
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#faf8f2] font-semibold">
                  {{ data.brideName || 'Andi Tenri Bau, S.Ked.' }}
                </h3>
                <p v-if="data.parents?.brideParents" class="text-xs text-[#b7cbbf] max-w-xs mx-auto leading-relaxed font-sans">
                  Putri tercinta dari: <br />
                  <strong class="text-[#faf8f2] font-medium">{{ data.parents.brideParents }}</strong>
                </p>
                <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaBrides.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#f4e087] transition-colors"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DETAIL RANGKAIAN ACARA (AKAD NIKAH & RESEPSI MAPPADENDANG / MAPPACCI) -->
      <section v-if="isSectionEnabled('event')" id="event" class="py-24 md:py-32 px-6 bg-[#0c1f17] relative" v-observe>
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Mappasikarawa &amp; Mappadendang
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#faf8f2]">
              Rangkaian Acara
            </h2>
            <div class="flex items-center justify-center gap-2 max-w-xs mx-auto text-[#d4af37] opacity-80 pt-1">
              <span class="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]"></span>
              <div class="w-2.5 h-2.5 rotate-45 border border-[#d4af37] bg-[#681423]"></div>
              <span class="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]"></span>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8 items-stretch">
            <!-- Akad Nikah (Mappasikarawa) -->
            <div
              v-if="data.akadLocation"
              class="p-8 sm:p-10 border border-[#d4af37]/40 rounded-3xl bg-[#0f291e]/90 backdrop-blur-sm space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden"
            >
              <!-- Ruby accent header line -->
              <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#681423] to-[#d4af37]"></div>

              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d4af37] bg-[#1a4332]/60 text-[#f4e087] shadow-inner">
                  <i class="fa-solid fa-ring text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#faf8f2]">Akad Nikah</h3>
                <p class="text-[10px] uppercase font-sans tracking-widest text-[#d4af37] font-bold">
                  Mappasikarawa &amp; Ijab Kabul
                </p>

                <div class="w-12 h-px bg-[#d4af37]/40 mx-auto"></div>

                <div class="space-y-1">
                  <p class="text-base md:text-lg text-[#f4e087] font-sans font-bold">
                    {{ formatDate(data.akadLocation.dateTime) }}
                  </p>
                  <p class="text-xs text-[#b7cbbf] font-sans">
                    {{ formatTime(data.akadLocation.dateTime) }}
                  </p>
                </div>

                <div class="pt-2 text-sm text-[#faf8f2] leading-relaxed">
                  <p class="font-bold text-white">{{ data.akadLocation.locationName || 'Kediaman Mempelai / Masjid Saoraja' }}</p>
                  <p class="text-xs text-[#b7cbbf] mt-1">{{ data.akadLocation.address || data.akadLocation.description }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  v-if="data.akadLocation.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#081711] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
                <a
                  :href="getCalendarUrl('Akad Nikah ' + groomShortName + ' & ' + brideShortName, data.akadLocation.dateTime, data.akadLocation.locationName)"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1a4332] text-[#f4e087] hover:bg-[#d4af37] hover:text-[#081711] transition-all text-xs font-sans uppercase tracking-widest font-semibold border border-[#d4af37]/40"
                >
                  <i class="fa-regular fa-calendar-plus"></i> Simpan Kalender
                </a>
              </div>
            </div>

            <!-- Resepsi Pernikahan (Mappadendang / Walimatul Ursy) -->
            <div
              v-if="data.resepsiLocation"
              class="p-8 sm:p-10 border border-[#d4af37]/40 rounded-3xl bg-[#0f291e]/90 backdrop-blur-sm space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden"
            >
              <!-- Gold accent header line -->
              <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#681423] via-[#d4af37] to-[#681423]"></div>

              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d4af37] bg-[#1a4332]/60 text-[#f4e087] shadow-inner">
                  <i class="fa-solid fa-champagne-glasses text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#faf8f2]">Resepsi Pernikahan</h3>
                <p class="text-[10px] uppercase font-sans tracking-widest text-[#d4af37] font-bold">
                  Mappadendang &amp; Walimatul 'Ursy
                </p>

                <div class="w-12 h-px bg-[#d4af37]/40 mx-auto"></div>

                <div class="space-y-1">
                  <p class="text-base md:text-lg text-[#f4e087] font-sans font-bold">
                    {{ formatDate(data.resepsiLocation.dateTime) }}
                  </p>
                  <p class="text-xs text-[#b7cbbf] font-sans">
                    {{ formatTime(data.resepsiLocation.dateTime) }}
                  </p>
                </div>

                <div class="pt-2 text-sm text-[#faf8f2] leading-relaxed">
                  <p class="font-bold text-white">{{ data.resepsiLocation.locationName || 'Ballroom Saoraja Grand Hall' }}</p>
                  <p class="text-xs text-[#b7cbbf] mt-1">{{ data.resepsiLocation.address || data.resepsiLocation.description }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  v-if="data.resepsiLocation.mapUrl"
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#081711] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
                <a
                  :href="getCalendarUrl('Resepsi ' + groomShortName + ' & ' + brideShortName, data.resepsiLocation.dateTime, data.resepsiLocation.locationName)"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1a4332] text-[#f4e087] hover:bg-[#d4af37] hover:text-[#081711] transition-all text-xs font-sans uppercase tracking-widest font-semibold border border-[#d4af37]/40"
                >
                  <i class="fa-regular fa-calendar-plus"></i> Simpan Kalender
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DRESS CODE / TATA BUSANA ADAT -->
      <section v-if="isSectionEnabled('dress-code') && data.dressCode" class="py-16 px-6 bg-[#081711] border-t border-[#d4af37]/20 text-center" v-observe>
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#d4af37]/30 rounded-2xl bg-[#0f291e]/70">
          <div class="text-[#d4af37]"><i class="fa-solid fa-shirt text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#faf8f2]">Tata Busana / Dress Code</h3>
          <p class="text-xs md:text-sm text-[#faf8f2] leading-relaxed font-sans">
            {{ data.dressCode }}
          </p>
          <p class="text-[10px] text-[#b7cbbf] font-sans italic">
            Nuansa Baju Bodo Sutra Bugis / Jas Tutup Tradisional / Busana Formal Elegan
          </p>
        </div>
      </section>

      <!-- LIVE STREAMING -->
      <section
        v-if="isSectionEnabled('live-streaming') && (data.liveStreamingLink || data.liveStreamingUrl)"
        class="py-16 px-6 bg-[#081711] text-center"
        v-observe
      >
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#d4af37]/30 rounded-2xl bg-[#0f291e]/70">
          <div class="text-[#d4af37]"><i class="fa-solid fa-video text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#faf8f2]">Siaran Langsung</h3>
          <p class="text-xs text-[#b7cbbf] leading-relaxed font-sans">
            Bagi keluarga dan kerabat yang berhalangan hadir secara langsung, silakan mengikuti prosesi melalui siaran langsung:
          </p>
          <a
            :href="data.liveStreamingLink || data.liveStreamingUrl"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d4af37] text-[#081711] rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg"
          >
            <i class="fa-brands fa-youtube"></i> Tonton Live Streaming
          </a>
        </div>
      </section>

      <!-- LOVE STORY TIMELINE (PARIAMA / PERJALANAN KASIH) -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 md:py-32 px-6 bg-[#0c1f17]" v-observe>
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Pariama &amp; Janji Suci
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#faf8f2]">
              Kisah Kasih
            </h2>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
          </div>

          <!-- Desktop Timeline -->
          <div class="space-y-12 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-[#d4af37]/35 hidden md:block">
            <div
              v-for="(story, idx) in activeStories"
              :key="idx"
              class="relative flex items-center justify-between"
              v-observe
            >
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                <div class="p-6 rounded-2xl border border-[#d4af37]/35 bg-[#0f291e]/90 space-y-2 shadow-xl">
                  <span class="text-xs text-[#f4e087] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
                  <h3 class="text-xl font-serif text-[#faf8f2]">{{ story.title }}</h3>
                  <p class="text-xs text-[#b7cbbf] leading-relaxed font-sans">{{ story.description }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4af37] border-4 border-[#0c1f17] z-10 shadow-md"></div>
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                <img
                  v-if="story.image || isPreviewMode"
                  :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                  class="rounded-2xl shadow-xl border border-[#d4af37]/35 aspect-video object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Mobile Timeline -->
          <div class="md:hidden space-y-8">
            <div
              v-for="(story, idx) in activeStories"
              :key="'m-' + idx"
              class="p-6 rounded-2xl border border-[#d4af37]/35 bg-[#0f291e]/90 space-y-3 shadow-lg"
            >
              <img
                v-if="story.image || isPreviewMode"
                :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                class="rounded-xl shadow-md border border-[#d4af37]/35 aspect-video object-cover w-full mb-3"
              />
              <span class="text-[10px] text-[#f4e087] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
              <h3 class="text-lg font-serif text-[#faf8f2]">{{ story.title }}</h3>
              <p class="text-xs text-[#b7cbbf] leading-relaxed font-sans">{{ story.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="isSectionEnabled('video') && data.videoPrewedding" class="py-24 px-6 bg-[#081711]" v-observe>
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">Dokumentasi Video</p>
            <h2 class="text-4xl md:text-5xl font-serif text-[#faf8f2]">Sinema Pra-Nikah</h2>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
          </div>
          <div class="aspect-video w-full rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl">
            <iframe
              :src="getEmbedUrlVideo(data.videoPrewedding)"
              class="w-full h-full"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <!-- GALERI FOTO (GALLERY INVITATION) -->
      <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="py-24 md:py-32 px-6 bg-[#0c1f17]" v-observe>
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">Potret Kenangan</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#faf8f2]">Galeri Foto</h2>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
          </div>

          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- TURUT MENGUNDANG (SULEWATANG & KELUARGA BESAR) -->
      <section
        v-if="isSectionEnabled('extended-family') && (data.extendedFamily?.length || data.turutMengundang)"
        class="py-20 px-6 bg-[#081711] border-t border-[#d4af37]/20 text-center"
        v-observe
      >
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="flex justify-center text-[#d4af37] opacity-80">
            <i class="fa-solid fa-users text-xl"></i>
          </div>
          <h3 class="text-2xl font-serif text-[#faf8f2]">Sulewatang &amp; Turut Mengundang</h3>
          <div class="w-12 h-px bg-[#d4af37] mx-auto"></div>
          <div class="space-y-2 text-sm text-[#faf8f2] font-sans">
            <p v-for="(person, idx) in normalizedExtendedFamily" :key="idx" class="leading-relaxed">
              {{ person }}
            </p>
          </div>
        </div>
      </section>

      <!-- AMPLOP DIGITAL & SOMPA (TANDA KASIH) -->
      <section
        v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || walletItems.length || giftAddresses.length)"
        id="gift"
        class="py-24 md:py-32 px-6 bg-[#081711] text-center"
        v-observe
      >
        <div class="max-w-4xl mx-auto space-y-12">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">Sompa &amp; Kado Pernikahan</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#faf8f2]">Tanda Kasih</h2>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
            <p class="text-sm text-[#b7cbbf] max-w-lg mx-auto font-sans leading-relaxed">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberikan tanda kasih, dapat disampaikan melalui:
            </p>
          </div>

          <!-- Bank & Wallet Cards -->
          <div class="flex flex-wrap justify-center gap-6">
            <div
              v-for="(bank, idx) in data.bankAccounts"
              :key="'bank-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d4af37]/40 bg-[#0f291e]/90 space-y-3 shadow-xl relative overflow-hidden group hover:border-[#f4e087]/70 transition-all"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#d4af37] uppercase font-sans tracking-widest">
                <img v-if="bank.bankLogo" :src="bank.bankLogo" :alt="bank.bankName" class="h-8 max-w-[120px] object-contain" />
                <span v-else>{{ bank.bankName }}</span>
              </div>
              <p class="text-xl font-mono text-white font-bold tracking-wider">{{ bank.accountNumber }}</p>
              <p class="text-xs text-[#b7cbbf] font-sans">a.n {{ bank.accountName }}</p>
              <button
                @click="copyToClipboard(bank.accountNumber)"
                class="w-full py-2 bg-transparent border border-[#d4af37]/60 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#081711] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin No. Rekening
              </button>
            </div>

            <div
              v-for="(wallet, idx) in walletItems"
              :key="'wallet-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d4af37]/40 bg-[#0f291e]/90 space-y-3 shadow-xl relative overflow-hidden group hover:border-[#f4e087]/70 transition-all"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#d4af37] uppercase font-sans tracking-widest">
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
                class="w-full py-2 bg-transparent border border-[#d4af37]/60 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#081711] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Nomor E-Wallet
              </button>
            </div>
          </div>

          <!-- Physical Gift Address -->
          <div v-if="giftAddresses.length" class="max-w-xl mx-auto space-y-4 pt-6">
            <h4 class="text-lg font-serif text-[#d4af37]">Kirim Kado Fisik</h4>
            <div
              v-for="(addr, idx) in giftAddresses"
              :key="'addr-' + idx"
              class="p-6 border border-[#d4af37]/35 rounded-2xl bg-[#0f291e]/85 text-left space-y-3 shadow-lg"
            >
              <p class="text-xs text-[#faf8f2] leading-relaxed whitespace-pre-line font-sans">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="text-xs text-[#d4af37] border border-[#d4af37]/60 px-4 py-1.5 rounded-full hover:bg-[#d4af37] hover:text-[#081711] font-sans font-bold uppercase tracking-wider transition-all"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Alamat Pengiriman
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP & BUKU TAMU (MAPPADENDANG / DOA RESTU) -->
      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="py-24 md:py-32 px-6 bg-[#0c1f17] relative" v-observe>
        <div class="max-w-2xl mx-auto space-y-12">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">Konfirmasi Kehadiran</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#faf8f2]">RSVP &amp; Buku Tamu</h2>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
          </div>

          <div class="p-8 sm:p-10 border border-[#d4af37]/40 rounded-3xl bg-[#0f291e]/90 shadow-2xl space-y-6">
            <form @submit.prevent="submitRsvp" class="space-y-4">
              <div>
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Nama Tamu Undangan</label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Ketikkan nama lengkap Anda..."
                  class="w-full bg-[#081711] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#faf8f2] text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Konfirmasi Kehadiran</label>
                <select
                  v-model="rsvp.attendance"
                  class="w-full bg-[#081711] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#faf8f2] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="hadir">Hadir (InsyaAllah Hadir)</option>
                  <option value="tidak">Tidak Hadir (Berhalangan Hadir)</option>
                  <option value="ragu">Masih Ragu / Belum Pasti</option>
                </select>
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Jumlah Tamu</label>
                <select
                  v-model="rsvp.totalGuests"
                  class="w-full bg-[#081711] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#faf8f2] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option :value="1">1 Orang</option>
                  <option :value="2">2 Orang</option>
                  <option :value="3">3 Orang</option>
                  <option :value="4">4 Orang atau lebih</option>
                </select>
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Ucapan &amp; Doa Restu</label>
                <textarea
                  v-model="rsvp.message"
                  rows="4"
                  required
                  placeholder="Tuliskan ucapan selamat dan doa berkah untuk kedua mempelai..."
                  class="w-full bg-[#081711] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#faf8f2] text-sm focus:outline-none focus:border-[#d4af37]"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-3.5 bg-gradient-to-r from-[#aa820a] via-[#d4af37] to-[#aa820a] hover:brightness-110 text-[#081711] font-bold rounded-xl font-sans uppercase tracking-[0.2em] text-xs transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
              >
                <span v-if="submittingRsvp"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengirimkan...</span>
                <span v-else><i class="fa-solid fa-paper-plane mr-2"></i> Kirim Konfirmasi &amp; Doa</span>
              </button>
            </form>
          </div>

          <!-- LIST UCAPAN DOA RESTU -->
          <div class="space-y-4" v-if="guestMessages.length">
            <h4 class="text-center font-serif text-xl text-[#f4e087]">Doa &amp; Restu Sahabat</h4>
            <div class="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-1">
              <div
                v-for="(msg, idx) in guestMessages"
                :key="'msg-' + idx"
                class="p-4 rounded-2xl border border-[#d4af37]/25 bg-[#0f291e]/80 space-y-1 text-left"
              >
                <div class="flex items-center justify-between">
                  <span class="font-serif font-bold text-sm text-[#faf8f2]">{{ msg.name || msg.guestName }}</span>
                  <span
                    class="text-[9px] px-2 py-0.5 rounded-full font-sans uppercase font-bold"
                    :class="(msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'bg-[#d4af37]/20 text-[#f4e087]' : 'bg-gray-800 text-gray-400'"
                  >
                    {{ (msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'Hadir' : 'Absen' }}
                  </span>
                </div>
                <p class="text-xs text-[#b7cbbf] font-sans leading-relaxed">"{{ msg.message }}"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER & DOA PENUTUP (KURRU SUMANGE') -->
      <footer class="py-20 md:py-28 bg-[#050e0a] text-center border-t border-[#d4af37]/25 relative overflow-hidden">
        <div class="relative z-10 px-6 space-y-4">
          <!-- Saoraja Mini Crest -->
          <div class="flex justify-center text-[#d4af37] opacity-65 mb-2">
            <svg viewBox="0 0 100 60" fill="currentColor" class="w-12 h-8">
              <path d="M 50 5 Q 45 15 35 20 Q 25 22 18 15 Q 23 8 40 4 Z" />
              <path d="M 50 5 Q 55 15 65 20 Q 75 22 82 15 Q 77 8 60 4 Z" />
              <polygon points="50,18 36,32 64,32" fill="#d4af37" />
              <polygon points="50,30 28,46 72,46" fill="#f4e087" />
              <line x1="20" y1="48" x2="80" y2="48" stroke="#d4af37" stroke-width="2" />
            </svg>
          </div>

          <p class="font-serif italic text-[#d4af37]/90 text-base md:text-lg">Kurru Sumange' &amp; Tabe' Mappatabe'</p>
          <h2 class="text-3xl sm:text-4xl md:text-6xl font-serif text-[#faf8f2]">
            {{ data.groomName || 'Andi Muhammad Fajar' }} &amp; {{ data.brideName || 'Andi Tenri Bau' }}
          </h2>
          <p v-if="data.footerText" class="text-[#b7cbbf] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            {{ data.footerText }}
          </p>
          <p v-else class="text-[#b7cbbf] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara(i) berkenan hadir dan memberikan doa restu bagi kedua mempelai.
          </p>

          <div class="w-16 h-px bg-[#d4af37]/35 mx-auto my-6"></div>
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

const groomShortName = computed(() => {
  const full = data.value.groomName || 'Fajar'
  return full.split(',')[0].trim().split(' ').slice(-1)[0] || 'Fajar'
})

const brideShortName = computed(() => {
  const full = data.value.brideName || 'Tenri'
  return full.split(',')[0].trim().split(' ').slice(-1)[0] || 'Tenri'
})

const mainEventDate = computed(() => {
  return data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
})

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
    title: 'Mappese\'-pese\' (Awal Perjumpaan)',
    date: '2022',
    description: 'Berawal dari perjumpaan di tanah Daeng, terjalin keselarasan hati dan pandangan hidup yang luhur.',
  },
  {
    title: 'Mappattuada (Lamaran & Kesepakatan)',
    date: '2025',
    description: 'Kedua rumpun keluarga besar bersua dalam musyawarah adat, menyepakati suntingan, hari baik, dan doa restu para tetua.',
  },
  {
    title: 'Menuju Pelaminan (Mappasikarawa)',
    date: '2026',
    description: 'Melangkah bersama dalam ikatan suci pernikahan di bawah naungan adat Bugis-Makassar yang sakral dan penuh berkah.',
  },
]

const activeStories = computed(() => {
  return data.value.loveStory?.length ? data.value.loveStory : mockStories
})

// Navigation Bar
const navItems = computed(() => {
  const list = [
    { id: 'home', label: 'Bebuka', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-check' },
  ]
  if (isSectionEnabled('love-story')) list.push({ id: 'story', label: 'Pariama', icon: 'fa-solid fa-book-open' })
  if (isSectionEnabled('gallery')) list.push({ id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' })
  if (isSectionEnabled('gift')) list.push({ id: 'gift', label: 'Sompa', icon: 'fa-solid fa-gift' })
  if (isSectionEnabled('rsvp')) list.push({ id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope' })
  return list
})

// Countdown Timer
const countdown = ref({ Allo: '00', Tette: '00', Menette: '00', Deti: '00' })
let timerInterval = null

function countdownSubLabel(key) {
  const map = { Allo: 'Hari', Tette: 'Jam', Menette: 'Menit', Deti: 'Detik' }
  return map[key] || ''
}

function updateCountdown() {
  const targetDateStr = mainEventDate.value
  if (!targetDateStr) return
  const target = new Date(targetDateStr).getTime()
  const now = new Date().getTime()
  const diff = target - now
  if (diff <= 0) {
    countdown.value = { Allo: '00', Tette: '00', Menette: '00', Deti: '00' }
    return
  }
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  countdown.value = {
    Allo: String(d).padStart(2, '0'),
    Tette: String(h).padStart(2, '0'),
    Menette: String(m).padStart(2, '0'),
    Deti: String(s).padStart(2, '0'),
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
    }) + ' WITA'
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

function getCalendarUrl(title, dateStr, location) {
  if (!dateStr) return '#'
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  const startTime = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
  const endTime = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours() + 2)}${pad(d.getMinutes())}00`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startTime}/${endTime}`,
    details: `Undangan Pernikahan Adat Bugis Saoraja ${title}`,
    location: location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Salinan berhasil disimpan ke papan klip!')
  })
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

async function loadWishes() {
  if (data.value.id && !isPreviewMode.value) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res || []
    } catch (err) {
      console.error(err)
    }
  } else {
    guestMessages.value = [
      {
        name: 'Andi Baso & Keluarga',
        message: 'Barakallahu lakuma wa baraka alaika wa jamaa bainakuma fii khoir. Selamat mappasikarawa, langgeng sampai anak cucu!',
        attendance: 'hadir',
      },
      {
        name: 'Daeng Rangka & Istri',
        message: 'Sipakatau, sipakalebbi, sipakainge. Salama\' ki tapada salama\', semoga senantiasa dalam limpahan berkah dan sakinah mawaddah.',
        attendance: 'hadir',
      },
      {
        name: 'Keluarga Besar Opu Tanete',
        message: 'Selamat berbahagia untuk ananda berdua. Turut bersukacita atas ikatan suci yang terjalin megah penuh berkah.',
        attendance: 'hadir',
      },
    ]
  }
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
    toast.success('Kurru sumange\', konfirmasi dan doa restu telah kami terima!')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Mohon maaf, terjadi kendala saat mengirimkan konfirmasi.')
  } finally {
    submittingRsvp.value = false
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
