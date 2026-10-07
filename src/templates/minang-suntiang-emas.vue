<template>
  <div class="relative min-h-screen bg-[#1a0508] overflow-hidden font-serif no-scrollbar text-[#fbf8ee] selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">

    <!-- Background Texture & Songket Pandai Sikek Weave Pattern -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

    <!-- Authentic Songket Pandai Sikek Geometric Lozenge Grid (Saik Galamai & Itiak Pulang Patang) -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15"
      style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1.5px), repeating-linear-gradient(45deg, transparent 0 14px, #4a0e17 14px 15px, transparent 15px 30px), repeating-linear-gradient(-45deg, transparent 0 14px, #b8860b 14px 15px, transparent 15px 30px); background-size: 32px 32px;"
    ></div>

    <!-- Ambient Maroon & Royal Gold Radial Glows -->
    <div class="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-[#4a0e17]/30 blur-[120px] pointer-events-none z-0"></div>
    <div class="fixed -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#b8860b]/20 blur-[140px] pointer-events-none z-0"></div>

    <!-- SVG Siluet Atap Gonjong Rumah Gadang Watermark Backdrop -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] md:w-[680px] pointer-events-none opacity-[0.045] z-0 select-none text-[#d4af37]">
      <svg viewBox="0 0 500 240" fill="currentColor" class="w-full h-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
        <!-- Main Gonjong Roof Silhouettes -->
        <!-- Center Left Main Gonjong -->
        <path d="M120 180 C150 140, 190 70, 160 10 C180 50, 215 120, 250 140 C285 120, 320 50, 340 10 C310 70, 350 140, 380 180 Z" />
        <!-- Outer Left Gonjong -->
        <path d="M40 190 C70 150, 110 80, 80 25 C100 65, 130 135, 170 155 L130 185 Z" />
        <!-- Outer Right Gonjong -->
        <path d="M460 190 C430 150, 390 80, 420 25 C400 65, 370 135, 330 155 L370 185 Z" />
        <!-- Roof ridge decorative spine -->
        <path d="M80 25 L85 15 L90 25 Z M160 10 L165 0 L170 10 Z M340 10 L335 0 L330 10 Z M420 25 L415 15 L410 25 Z" />
        <!-- Eaves and Rangkiang bottom line -->
        <rect x="50" y="185" width="400" height="10" rx="3" />
        <rect x="70" y="200" width="360" height="15" rx="3" />
        <!-- Stilts pillars -->
        <rect x="90" y="215" width="12" height="25" />
        <rect x="150" y="215" width="12" height="25" />
        <rect x="210" y="215" width="12" height="25" />
        <rect x="278" y="215" width="12" height="25" />
        <rect x="338" y="215" width="12" height="25" />
        <rect x="398" y="215" width="12" height="25" />
      </svg>
    </div>

    <!-- Royal Minang Antique Gold Corner Ornaments (Songket Pandai Sikek & Itiak Pulang Patang) -->
    <div class="fixed top-0 left-0 w-24 h-24 md:w-36 md:h-36 z-40 opacity-85 pointer-events-none select-none text-[#d4af37]">
      <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
        <path d="M0,0 L100,0 C70,10 50,25 35,45 C20,65 10,85 0,100 Z" opacity="0.15" />
        <path d="M0,0 L70,0 C50,15 35,30 25,50 C15,70 10,85 0,70 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M4,4 L45,4 C32,15 22,25 15,38 C8,50 4,60 4,45 Z" fill="none" stroke="#f3e5ab" stroke-width="1" stroke-dasharray="3,2" />
        <!-- Pucuak Rebung Triangle elements -->
        <polygon points="12,12 28,16 16,28" fill="currentColor" />
        <polygon points="26,14 42,18 30,30" opacity="0.7" fill="currentColor" />
        <polygon points="14,26 18,42 30,30" opacity="0.7" fill="currentColor" />
        <!-- Small circular bead accents -->
        <circle cx="8" cy="8" r="3" fill="#f3e5ab" />
        <circle cx="55" cy="10" r="2" fill="currentColor" />
        <circle cx="10" cy="55" r="2" fill="currentColor" />
      </svg>
    </div>
    <div class="fixed bottom-0 right-0 w-24 h-24 md:w-36 md:h-36 z-40 opacity-85 pointer-events-none select-none rotate-180 text-[#d4af37]">
      <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
        <path d="M0,0 L100,0 C70,10 50,25 35,45 C20,65 10,85 0,100 Z" opacity="0.15" />
        <path d="M0,0 L70,0 C50,15 35,30 25,50 C15,70 10,85 0,70 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M4,4 L45,4 C32,15 22,25 15,38 C8,50 4,60 4,45 Z" fill="none" stroke="#f3e5ab" stroke-width="1" stroke-dasharray="3,2" />
        <polygon points="12,12 28,16 16,28" fill="currentColor" />
        <polygon points="26,14 42,18 30,30" opacity="0.7" fill="currentColor" />
        <polygon points="14,26 18,42 30,30" opacity="0.7" fill="currentColor" />
        <circle cx="8" cy="8" r="3" fill="#f3e5ab" />
        <circle cx="55" cy="10" r="2" fill="currentColor" />
        <circle cx="10" cy="55" r="2" fill="currentColor" />
      </svg>
    </div>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#2c080e"
      accentColor="#d4af37"
      :autoPlay="!showWelcome"
    />

    <!-- Floating Bottom Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#2c080e]/90 backdrop-blur-xl border border-[#d4af37]/40 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#f3e5ab] scale-105' : 'text-[#d6b094] hover:text-[#f3e5ab]'"
        >
          <i :class="[item.icon, 'text-base md:text-lg']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-sans">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#d4af37] transition-all"
            :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen / Pintu Masuak Baralek Gadang -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#4a0e17] via-[#2c080e] to-[#1a0508] transition-all duration-1000"
      >
        <!-- Golden Songket Border Frame -->
        <div class="absolute inset-4 md:inset-8 border border-[#d4af37]/40 rounded-3xl pointer-events-none shadow-[inset_0_0_40px_rgba(212,175,55,0.15)]">
          <div class="absolute inset-1.5 border border-[#d4af37]/20 rounded-[22px]"></div>
          <!-- Corner flourishes -->
          <div class="absolute top-2 left-2 text-[#d4af37]/60 text-xs">◆</div>
          <div class="absolute top-2 right-2 text-[#d4af37]/60 text-xs">◆</div>
          <div class="absolute bottom-2 left-2 text-[#d4af37]/60 text-xs">◆</div>
          <div class="absolute bottom-2 right-2 text-[#d4af37]/60 text-xs">◆</div>
        </div>

        <div class="relative z-10 space-y-6 md:space-y-7 animate-fade-in-up max-w-lg mx-auto py-8">
          <!-- SUNTIANG EMAS VECTOR ORNAMENT -->
          <div class="flex justify-center max-w-xs mx-auto">
            <svg class="w-24 h-24 md:w-32 md:h-32 text-[#d4af37] filter drop-shadow-[0_4px_20px_rgba(212,175,55,0.5)] animate-pulse" viewBox="0 0 160 160" fill="currentColor">
              <defs>
                <linearGradient id="suntiangGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fdf6d8" />
                  <stop offset="45%" stop-color="#d4af37" />
                  <stop offset="80%" stop-color="#b8860b" />
                  <stop offset="100%" stop-color="#805b00" />
                </linearGradient>
              </defs>
              <!-- Suntiang Tiered Arc / Crown Base -->
              <path d="M40 120 Q80 95 120 120 Q80 108 40 120 Z" fill="url(#suntiangGoldGrad)" />
              <path d="M30 112 Q80 82 130 112 Q80 96 30 112 Z" fill="url(#suntiangGoldGrad)" opacity="0.9" />
              <!-- Radiating Kembang Goyang Sprigs -->
              <!-- Center Pinnacle Sprig -->
              <path d="M80 32 L83 60 L77 60 Z" fill="url(#suntiangGoldGrad)" />
              <circle cx="80" cy="28" r="5" fill="#fdf6d8" />
              <circle cx="80" cy="20" r="3" fill="#d4af37" />
              <!-- Radiating Left & Right Sprigs -->
              <g stroke="url(#suntiangGoldGrad)" stroke-width="2">
                <line x1="80" y1="85" x2="80" y2="40" />
                <line x1="80" y1="85" x2="65" y2="42" />
                <line x1="80" y1="85" x2="95" y2="42" />
                <line x1="80" y1="85" x2="52" y2="50" />
                <line x1="80" y1="85" x2="108" y2="50" />
                <line x1="80" y1="85" x2="40" y2="62" />
                <line x1="80" y1="85" x2="120" y2="62" />
                <line x1="80" y1="85" x2="30" y2="78" />
                <line x1="80" y1="85" x2="130" y2="78" />
                <line x1="80" y1="85" x2="24" y2="95" />
                <line x1="80" y1="85" x2="136" y2="95" />
              </g>
              <!-- Golden Floral Blossoms on Sprig Ends -->
              <circle cx="65" cy="40" r="3.5" fill="#fdf6d8" />
              <circle cx="95" cy="40" r="3.5" fill="#fdf6d8" />
              <circle cx="52" cy="48" r="3.5" fill="#f3e5ab" />
              <circle cx="108" cy="48" r="3.5" fill="#f3e5ab" />
              <circle cx="40" cy="60" r="3.5" fill="#d4af37" />
              <circle cx="120" cy="60" r="3.5" fill="#d4af37" />
              <circle cx="30" cy="76" r="3.5" fill="#d4af37" />
              <circle cx="130" cy="76" r="3.5" fill="#d4af37" />
              <circle cx="24" cy="93" r="3" fill="#b8860b" />
              <circle cx="136" cy="93" r="3" fill="#b8860b" />
              <!-- Middle Tier Rosettes -->
              <ellipse cx="80" cy="68" rx="8" ry="5" fill="#fdf6d8" />
              <ellipse cx="66" cy="72" rx="6" ry="4" fill="#d4af37" />
              <ellipse cx="94" cy="72" rx="6" ry="4" fill="#d4af37" />
              <ellipse cx="54" cy="80" rx="5" ry="4" fill="#b8860b" />
              <ellipse cx="106" cy="80" rx="5" ry="4" fill="#b8860b" />
              <!-- Kote-kote (Side Hanging Pendants) -->
              <g fill="#d4af37">
                <circle cx="22" cy="106" r="2.5" />
                <circle cx="20" cy="116" r="2" />
                <path d="M19 122 L21 122 L20 130 Z" />
                <circle cx="138" cy="106" r="2.5" />
                <circle cx="140" cy="116" r="2" />
                <path d="M139 122 L141 122 L140 130 Z" />
              </g>
            </svg>
          </div>

          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/40 bg-[#4a0e17]/50 backdrop-blur-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping"></span>
              <p class="font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#f3e5ab] font-bold">
                Baralek Gadang Minangkabau
              </p>
            </div>
            <h1 class="text-4xl md:text-6xl font-serif text-[#fbf8ee] drop-shadow-[0_2px_14px_rgba(212,175,55,0.4)] leading-tight pt-2">
              {{ data.groomName?.split(' ')[0] || data.groomName }}
              <span class="text-2xl md:text-3xl font-serif text-[#d4af37] block my-1">&amp;</span>
              {{ data.brideName?.split(' ')[0] || data.brideName }}
            </h1>
            <p class="text-xs text-[#d6b094] uppercase tracking-widest font-sans">
              Manjapuik Marapulai jo Anak Daro
            </p>
          </div>

          <!-- Guest Badge Card -->
          <div class="my-5 p-5 md:p-6 border border-[#d4af37]/35 bg-[#2c080e]/85 backdrop-blur-md rounded-2xl max-w-xs mx-auto shadow-2xl space-y-2">
            <p class="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Kapado Yth Bapak/Ibu/Dunsanak:
            </p>
            <p class="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
            <p class="text-[10px] font-sans text-[#d6b094] italic leading-relaxed">
              Maimbau sarato manjapuik dunsanak kasadonyo untuak ma-hadiri alek kami
            </p>
          </div>

          <button
            @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#1a0508] font-bold rounded-full transition-all shadow-[0_4px_25px_rgba(212,175,55,0.45)] text-xs uppercase tracking-[0.2em]"
          >
            <i class="fa-solid fa-envelope-open text-xs"></i>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth"
    >
      <!-- HERO / BANNER SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-24 bg-gradient-to-b from-[#4a0e17] via-[#2c080e] to-[#1a0508]">
        <!-- Gonjong Roof Accent at Top Hero -->
        <div class="w-48 md:w-72 text-[#d4af37]/70 mb-4" v-observe>
          <svg viewBox="0 0 300 80" fill="currentColor" class="w-full h-auto">
            <path d="M20 70 C50 45, 90 20, 75 5 C90 25, 120 55, 150 60 C180 55, 210 25, 225 5 C210 20, 250 45, 280 70 Z" />
            <path d="M75 5 L78 0 L81 5 Z M225 5 L222 0 L219 5 Z" />
          </svg>
        </div>

        <div class="space-y-6 max-w-3xl mx-auto relative z-10" v-observe>
          <div class="flex items-center justify-center gap-4 text-[#d4af37]">
            <span class="w-12 h-px bg-[#d4af37]/50"></span>
            <span class="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#f3e5ab]">Baralek Gadang Minangkabau</span>
            <span class="w-12 h-px bg-[#d4af37]/50"></span>
          </div>

          <!-- Couple Main Photo if Available -->
          <div v-if="data.photoCoupleUrl" class="relative inline-block my-4">
            <div class="w-48 h-64 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d4af37] p-1.5 shadow-[0_0_35px_rgba(212,175,55,0.3)] overflow-hidden bg-[#2c080e]">
              <img :src="data.photoCoupleUrl" alt="Foto Pasangan" class="w-full h-full object-cover rounded-t-full" />
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2c080e] border border-[#d4af37] px-4 py-0.5 rounded-full text-[10px] text-[#f3e5ab] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
              Marapulai &amp; Anak Daro
            </div>
          </div>

          <h1 class="text-5xl md:text-8xl font-serif text-[#fbf8ee] leading-tight">
            {{ data.groomName }} <br />
            <span class="text-3xl md:text-5xl text-[#d4af37] italic my-2 inline-block font-serif">&amp;</span> <br />
            {{ data.brideName }}
          </h1>

          <p class="text-base md:text-xl text-[#d4af37] tracking-[0.25em] uppercase font-sans font-medium">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
          </p>

          <!-- Countdown Timer -->
          <div class="grid grid-cols-4 gap-3 md:gap-6 mt-12 max-w-sm mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 md:p-4 border border-[#d4af37]/35 rounded-2xl bg-[#2c080e]/85 backdrop-blur-sm shadow-xl"
            >
              <div class="text-2xl md:text-3xl font-serif font-bold text-[#fbf8ee]">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-wider text-[#d4af37] font-sans mt-1 font-semibold">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 animate-bounce text-[#d4af37]/70">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- AYAT SUCI & PANTUN ADAT MINANG -->
      <section v-if="isSectionEnabled('quote')" class="py-24 px-6 bg-[#25060b] relative text-center border-y border-[#d4af37]/20" v-observe>
        <div class="max-w-3xl mx-auto space-y-8">
          <!-- Minang Woodcarving Divider Motif (Itiak Pulang Patang) -->
          <div class="flex items-center justify-center gap-2 text-[#d4af37] opacity-80 max-w-xs mx-auto">
            <span class="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></span>
            <svg class="w-8 h-8 text-[#d4af37]" viewBox="0 0 40 40" fill="currentColor">
              <polygon points="20,5 24,16 35,20 24,24 20,35 16,24 5,20 16,16" />
            </svg>
            <span class="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></span>
          </div>

          <!-- Pantun Minang Adat -->
          <div class="bg-[#380c13]/70 p-6 md:p-8 rounded-2xl border border-[#d4af37]/30 backdrop-blur-sm max-w-xl mx-auto space-y-3 shadow-lg">
            <p class="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-[#d4af37]">
              Petatah Petitih Minangkabau
            </p>
            <p class="font-serif italic text-base md:text-lg text-[#f3e5ab] leading-relaxed">
              "Anak urang koto anau, pai ka pakan mambawo lado.<br />
              Rundiang saiya jo sakato, bulek aie dek pambuluah bulek koto dek mupakaik."
            </p>
          </div>

          <!-- Holy Verse (QS Ar-Rum 21) -->
          <div class="space-y-4">
            <p class="font-serif text-lg md:text-2xl text-[#fbf8ee] italic leading-relaxed px-4">
              "{{ data.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.' }}"
            </p>
            <div class="w-16 h-px bg-[#d4af37] mx-auto"></div>
            <p class="text-xs font-sans font-bold text-[#d4af37] tracking-[0.3em] uppercase">
              {{ data.quoteSource || 'QS. Ar-Rum: 21' }}
            </p>
          </div>
        </div>
      </section>

      <!-- PROFIL KEDUA MEMPELAI (MARAPULAI & ANAK DARO) -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="py-24 md:py-32 px-6 bg-[#1a0508]" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-16">
          <div class="space-y-4">
            <div class="flex justify-center mb-2">
              <!-- Suntiang Motif Badge -->
              <svg class="w-12 h-12 text-[#d4af37]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M20 70 Q50 45 80 70 Q50 58 20 70 Z" />
                <path d="M50 20 L52 40 L48 40 Z" />
                <circle cx="50" cy="18" r="4" />
                <circle cx="36" cy="28" r="3" />
                <circle cx="64" cy="28" r="3" />
                <circle cx="26" cy="42" r="3" />
                <circle cx="74" cy="42" r="3" />
              </svg>
            </div>
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">Marapulai jo Anak Daro</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Mempelai Minang</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-16 md:gap-12 items-center">
            <!-- Groom / Marapulai -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d4af37] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-[#2c080e] overflow-hidden">
                  <img
                    :src="data.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'"
                    alt="Mempelai Marapulai"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#380c13] border border-[#d4af37] px-4 py-0.5 rounded-full text-[10px] text-[#f3e5ab] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  Sang Marapulai
                </div>
              </div>
              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">{{ data.groomName }}</h3>
                <p v-if="data.parents?.groomParents" class="text-xs text-[#d6b094] max-w-xs mx-auto leading-relaxed">
                  Putra dari <br />
                  <strong class="text-[#fbf8ee]">{{ data.parents.groomParents }}</strong>
                </p>
                <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaGroom.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Bride / Anak Daro -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d4af37] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-[#2c080e] overflow-hidden">
                  <img
                    :src="data.bridePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'"
                    alt="Mempelai Anak Daro"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#380c13] border border-[#d4af37] px-4 py-0.5 rounded-full text-[10px] text-[#f3e5ab] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  Sang Anak Daro
                </div>
              </div>
              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">{{ data.brideName }}</h3>
                <p v-if="data.parents?.brideParents" class="text-xs text-[#d6b094] max-w-xs mx-auto leading-relaxed">
                  Putri dari <br />
                  <strong class="text-[#fbf8ee]">{{ data.parents.brideParents }}</strong>
                </p>
                <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaBrides.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RANGKAIAN ACARA (AKAD NIKAH & BARALEK GADANG) -->
      <section v-if="isSectionEnabled('event')" id="event" class="py-24 md:py-32 px-6 bg-[#25060b] relative" v-observe>
        <div class="max-w-4xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">Waktu &amp; Tampek</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Rangkaian Acara</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-8 items-stretch">
            <!-- Akad Nikah / Ijab Qabul -->
            <div
              v-if="data.akadLocation"
              class="p-8 border border-[#d4af37]/35 rounded-3xl bg-[#320a11]/90 backdrop-blur-sm space-y-5 shadow-2xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d4af37] text-[#d4af37] bg-[#4a0e17]/50 shadow-inner">
                  <i class="fa-solid fa-ring text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">Akad Nikah</h3>
                <div class="w-12 h-px bg-[#d4af37]/40 mx-auto"></div>
                <p class="text-base text-[#f3e5ab] font-sans font-bold">
                  {{ formatDate(data.akadLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#d6b094] font-sans font-medium">
                  {{ formatTime(data.akadLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#fbf8ee] leading-relaxed pt-2">
                  {{ data.akadLocation.description }}
                </p>
              </div>

              <div class="pt-6">
                <a
                  v-if="data.akadLocation.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a0508] transition-all text-xs font-sans uppercase tracking-widest font-bold shadow-md"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
              </div>
            </div>

            <!-- Baralek Gadang / Resepsi -->
            <div
              v-if="data.resepsiLocation"
              class="p-8 border border-[#d4af37]/35 rounded-3xl bg-[#320a11]/90 backdrop-blur-sm space-y-5 shadow-2xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d4af37] text-[#d4af37] bg-[#4a0e17]/50 shadow-inner">
                  <i class="fa-solid fa-champagne-glasses text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">Baralek Gadang</h3>
                <div class="w-12 h-px bg-[#d4af37]/40 mx-auto"></div>
                <p class="text-base text-[#f3e5ab] font-sans font-bold">
                  {{ formatDate(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#d6b094] font-sans font-medium">
                  {{ formatTime(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#fbf8ee] leading-relaxed pt-2">
                  {{ data.resepsiLocation.description }}
                </p>
              </div>

              <div class="pt-6">
                <a
                  v-if="data.resepsiLocation.mapUrl"
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a0508] transition-all text-xs font-sans uppercase tracking-widest font-bold shadow-md"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TATA BUSANA / DRESS CODE -->
      <section v-if="isSectionEnabled('dress-code') && data.dressCode" class="py-16 px-6 bg-[#1a0508] border-t border-[#d4af37]/20 text-center" v-observe>
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#d4af37]/25 rounded-2xl bg-[#2c080e]/70 shadow-lg">
          <div class="text-[#d4af37]"><i class="fa-solid fa-shirt text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#fbf8ee]">Pakaian / Dress Code</h3>
          <p class="text-xs md:text-sm text-[#fbf8ee] leading-relaxed font-sans">
            {{ data.dressCode }}
          </p>
        </div>
      </section>

      <!-- LIVE STREAMING -->
      <section
        v-if="isSectionEnabled('live-streaming') && (data.liveStreamingLink || data.liveStreamingUrl)"
        class="py-16 px-6 bg-[#1a0508] text-center"
        v-observe
      >
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#d4af37]/25 rounded-2xl bg-[#2c080e]/70 shadow-lg">
          <div class="text-[#d4af37]"><i class="fa-solid fa-video text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#fbf8ee]">Siaran Langsung / Daring</h3>
          <p class="text-xs text-[#d6b094] leading-relaxed font-sans">
            Untuak dunsanak nan jauah atau alun sempat batatap muko langsuang
          </p>
          <a
            :href="data.liveStreamingLink || data.liveStreamingUrl"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-[#1a0508] rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-md"
          >
            <i class="fa-brands fa-youtube"></i> Saksikan Siaran Langsung
          </a>
        </div>
      </section>

      <!-- LOVE STORY TIMELINE -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 md:py-32 px-6 bg-[#25060b]" v-observe>
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">Pangalaman Kasiah</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Kisah Cinta</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>

          <!-- Desktop Timeline -->
          <div class="space-y-12 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-[#d4af37]/35 hidden md:block">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="idx"
              class="relative flex items-center justify-between"
              v-observe
            >
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                <div class="p-6 rounded-2xl border border-[#d4af37]/30 bg-[#320a11]/85 space-y-2 shadow-xl">
                  <span class="text-xs text-[#f3e5ab] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
                  <h3 class="text-xl font-serif text-[#fbf8ee]">{{ story.title }}</h3>
                  <p class="text-xs text-[#d6b094] leading-relaxed font-sans">{{ story.description }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4af37] border-4 border-[#25060b] z-10 shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                <img
                  v-if="story.image || isPreviewMode"
                  :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                  class="rounded-2xl shadow-xl border border-[#d4af37]/30 aspect-video object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Mobile Story Cards -->
          <div class="md:hidden space-y-8">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="'m-' + idx"
              class="p-6 rounded-2xl border border-[#d4af37]/30 bg-[#320a11]/85 space-y-3 shadow-xl"
            >
              <img
                v-if="story.image || isPreviewMode"
                :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                class="rounded-xl shadow-md border border-[#d4af37]/30 aspect-video object-cover w-full mb-3"
              />
              <span class="text-[10px] text-[#f3e5ab] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
              <h3 class="text-lg font-serif text-[#fbf8ee]">{{ story.title }}</h3>
              <p class="text-xs text-[#d6b094] leading-relaxed font-sans">{{ story.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="isSectionEnabled('video') && data.videoPrewedding" class="py-24 px-6 bg-[#1a0508]" v-observe>
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">Sinematik</p>
            <h2 class="text-4xl md:text-5xl font-serif text-[#fbf8ee]">Video Prewedding</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
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

      <!-- GALERI FOTO -->
      <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="py-24 md:py-32 px-6 bg-[#25060b]" v-observe>
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">Kenangan Manih</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Galeri Foto</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>

          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- TURUT MENGUNDANG / NINIK MAMAK & KELUARGA BESAR -->
      <section
        v-if="isSectionEnabled('extended-family') && (data.extendedFamily?.length || data.turutMengundang)"
        class="py-20 px-6 bg-[#1a0508] border-t border-[#d4af37]/20 text-center"
        v-observe
      >
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="inline-flex items-center gap-2 text-[#d4af37]">
            <i class="fa-solid fa-users text-lg"></i>
          </div>
          <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">Turut Mengundang</h3>
          <p class="text-xs text-[#d6b094] uppercase tracking-widest font-sans">Ninik Mamak, Bundo Kanduang &amp; Sanak Sudaro</p>
          <div class="w-16 h-px bg-[#d4af37]/40 mx-auto"></div>
          <div class="space-y-2 text-sm text-[#fbf8ee] font-sans">
            <p v-for="(person, idx) in normalizedExtendedFamily" :key="idx" class="leading-relaxed">
              {{ person }}
            </p>
          </div>
        </div>
      </section>

      <!-- AMPLOP DIGITAL / TANDO KASIAH (HADIAH & REKENING) -->
      <section
        v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || walletItems.length || giftAddresses.length)"
        id="gift"
        class="py-24 md:py-32 px-6 bg-[#1a0508] text-center"
        v-observe
      >
        <div class="max-w-4xl mx-auto space-y-12">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">Tando Kasiah</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Amplop Digital</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
            <p class="text-sm text-[#d6b094] max-w-lg mx-auto font-sans leading-relaxed">
              Doa restu dari Bapak/Ibu/Dunsanak marupoan anugerah nan sangaik bargo bagi kami. Jikok bapadok maagiah tando kasiah, dapek malalui rekening di bawah:
            </p>
          </div>

          <!-- Bank & E-Wallet Cards -->
          <div class="flex flex-wrap justify-center gap-6">
            <div
              v-for="(bank, idx) in data.bankAccounts"
              :key="'bank-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d4af37]/40 bg-[#2c080e]/90 space-y-3 shadow-xl relative overflow-hidden"
            >
              <div class="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#d4af37]/10 pointer-events-none"></div>
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#d4af37] uppercase font-sans tracking-widest">
                <img v-if="bank.bankLogo" :src="bank.bankLogo" :alt="bank.bankName" class="h-8 max-w-[120px] object-contain" />
                <span v-else>{{ bank.bankName }}</span>
              </div>
              <p class="text-xl font-mono text-white font-bold tracking-wider">{{ bank.accountNumber }}</p>
              <p class="text-xs text-[#d6b094] font-sans">a.n {{ bank.accountName }}</p>
              <button
                @click="copyToClipboard(bank.accountNumber)"
                class="w-full py-2 bg-transparent border border-[#d4af37]/60 hover:bg-[#d4af37] text-[#f3e5ab] hover:text-[#1a0508] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2 shadow-sm"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Rekening
              </button>
            </div>

            <div
              v-for="(wallet, idx) in walletItems"
              :key="'wallet-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d4af37]/40 bg-[#2c080e]/90 space-y-3 shadow-xl relative overflow-hidden"
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
                class="w-full py-2 bg-transparent border border-[#d4af37]/60 hover:bg-[#d4af37] text-[#f3e5ab] hover:text-[#1a0508] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2 shadow-sm"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Nomor
              </button>
            </div>
          </div>

          <!-- Physical Gift Address -->
          <div v-if="giftAddresses.length" class="max-w-xl mx-auto space-y-4 pt-6">
            <h4 class="text-lg font-serif text-[#d4af37]">Kirim Kado Fisik</h4>
            <div
              v-for="(addr, idx) in giftAddresses"
              :key="'addr-' + idx"
              class="p-6 border border-[#d4af37]/30 rounded-2xl bg-[#2c080e]/80 text-left space-y-3 shadow-md"
            >
              <p class="text-xs text-[#fbf8ee] leading-relaxed whitespace-pre-line font-sans">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="text-xs text-[#d4af37] border border-[#d4af37]/60 px-4 py-1.5 rounded-full hover:bg-[#d4af37] hover:text-[#1a0508] font-sans font-bold uppercase tracking-wider transition-all"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Alamat
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP & BUKU UCAPAN DOA RESTU -->
      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="py-24 md:py-32 px-6 bg-[#25060b] relative" v-observe>
        <div class="max-w-2xl mx-auto space-y-12">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">Kahadiran Dunsanak</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Konfirmasi &amp; Doa Restu</h2>
            <div class="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>

          <div class="p-8 border border-[#d4af37]/35 rounded-3xl bg-[#320a11]/90 shadow-2xl space-y-6">
            <form @submit.prevent="submitRsvp" class="space-y-4">
              <div>
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Namo Lengkok / Panggilan</label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Ketik namo dunsanak..."
                  class="w-full bg-[#1a0508] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Konfirmasi Kahadiran</label>
                <select
                  v-model="rsvp.attendance"
                  class="w-full bg-[#1a0508] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="hadir">Insya Allah, Ka Hadir</option>
                  <option value="tidak">Maaf, Alun Dapek Hadir</option>
                  <option value="ragu">Masih Ragu-ragu</option>
                </select>
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Jumlah Urang / Tamu</label>
                <select
                  v-model="rsvp.totalGuests"
                  class="w-full bg-[#1a0508] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Urang</option>
                </select>
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#d4af37] tracking-wider mb-2 font-bold">Kirim Doa Restu / Ucapan</label>
                <textarea
                  v-model="rsvp.message"
                  rows="4"
                  placeholder="Kirim doa restu jo pasanan untuak marapulai jo anak daro..."
                  class="w-full bg-[#1a0508] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4af37]"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-3.5 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-[#1a0508] font-bold rounded-xl shadow-lg transition-all hover:brightness-110 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {{ submittingRsvp ? 'Mangarim...' : 'Kirim Konfirmasi & Doa' }}
              </button>
            </form>
          </div>

          <!-- Guest Messages List -->
          <div v-if="guestMessages.length" class="space-y-4 max-h-96 overflow-y-auto no-scrollbar pr-1">
            <div
              v-for="(msg, idx) in guestMessages"
              :key="'msg-' + idx"
              class="p-5 border border-[#d4af37]/25 rounded-2xl bg-[#320a11]/70 space-y-2 text-left shadow-md"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-[#fbf8ee] text-base">{{ msg.name || msg.guestName }}</span>
                <span
                  class="text-[9px] px-2.5 py-0.5 rounded-full font-sans uppercase font-bold"
                  :class="(msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'bg-[#d4af37]/20 text-[#f3e5ab]' : 'bg-stone-800 text-stone-400'"
                >
                  {{ (msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'Hadir' : 'Absen' }}
                </span>
              </div>
              <p class="text-xs text-[#d6b094] font-sans leading-relaxed">"{{ msg.message }}"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-20 md:py-28 bg-[#120305] text-center border-t border-[#d4af37]/25 relative overflow-hidden">
        <div class="relative z-10 px-6 space-y-4">
          <!-- Gonjong Mini Symbol -->
          <div class="flex justify-center text-[#d4af37] opacity-75">
            <svg class="w-10 h-6" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10 50 C25 35, 45 15, 35 5 C45 20, 55 40, 50 42 C45 40, 55 20, 65 5 C55 15, 75 35, 90 50 Z" />
            </svg>
          </div>
          <p class="font-serif italic text-[#d4af37] text-base md:text-lg">Tarimo Kasih Banyak</p>
          <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
          <p v-if="data.footerText" class="text-[#d6b094] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            {{ data.footerText }}
          </p>
          <div class="w-20 h-px bg-[#d4af37]/40 mx-auto my-6"></div>
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
    title: 'Maso Batamu Mulo',
    date: '2022',
    description: 'Batamua duo pandangan mato di ranah minang, diikek niaik elok jo hati nan janiah.',
  },
  {
    title: 'Batuka Tando & Maminang',
    date: '2025',
    description: 'Kaluarga dunsanak kaduonyo lah marundiang saiya jo sakato untuak manantuan hari baik.',
  },
]

// Navigation Bar
const navItems = computed(() => {
  const list = [
    { id: 'home', label: 'Bebuka', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-check' },
  ]
  if (isSectionEnabled('love-story')) list.push({ id: 'story', label: 'Kisah', icon: 'fa-solid fa-book-open' })
  if (isSectionEnabled('gallery')) list.push({ id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' })
  if (isSectionEnabled('gift')) list.push({ id: 'gift', label: 'Kado', icon: 'fa-solid fa-gift' })
  if (isSectionEnabled('rsvp')) list.push({ id: 'rsvp', label: 'Doa', icon: 'fa-solid fa-envelope' })
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
    toast.success('Alah disalin ka papan klip!')
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
    toast.success('Tarimo kasih, doa jo konfirmasi alah kami tarimo!')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Maaf, tajadi kasalahan dalam mangirim konfirmasi.')
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
        name: 'Mak Tuo & Dunsanak Bukittinggi',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khoir. Salamaik manampuah hiduik baru kamanakan, samoga sakinah mawaddah warahmah.',
        attendance: 'hadir',
      },
      {
        name: 'Angku Datuak & Rangkayo Basa',
        message: 'Salamaik Baralek Gadang! Bulek aie dek pambuluah, bulek kato dek mupakaik. Samoga langgeng sampai anak cucu.',
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
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

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
