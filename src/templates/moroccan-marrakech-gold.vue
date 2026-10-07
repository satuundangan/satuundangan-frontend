<template>
  <div
    class="relative min-h-screen bg-[#0d1b2a] overflow-x-hidden font-sans text-[#fdfaf6] selection:bg-[#d4af37]/30 selection:text-[#f7e7b4]"
  >
    <!-- ========================================== -->
    <!-- 1. FIXED CORNER ORNAMENTS (z-40 pointer-events-none) -->
    <!-- Authentic Moroccan Arabesque Spandrel Vectors -->
    <!-- ========================================== -->
    <div
      class="fixed top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 z-40 pointer-events-none select-none opacity-85"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]"
      >
        <path
          d="M0 0 L160 0 C130 15 105 40 90 70 C75 100 70 130 0 160 L0 0 Z"
          fill="url(#goldGradientCornerTL)"
          opacity="0.12"
        />
        <!-- Outer Arabesque Frame -->
        <path
          d="M 4 4 L 140 4 C 115 18 95 40 82 68 C 68 96 64 122 4 140 Z"
          stroke="url(#goldGradientCornerTL)"
          stroke-width="1.8"
        />
        <!-- Inner Filigree Arc -->
        <path
          d="M 4 4 L 105 4 C 88 15 72 32 62 52 C 52 72 48 90 4 105 Z"
          stroke="url(#goldGradientCornerTL)"
          stroke-width="1.2"
          stroke-dasharray="3 3"
        />
        <!-- Cusped Moorish scallop -->
        <path
          d="M 12 12 Q 35 14 50 30 Q 66 46 68 69"
          stroke="#f7e7b4"
          stroke-width="1.5"
        />
        <!-- 8-Pointed Moroccan Mini Star -->
        <g transform="translate(32, 32)">
          <polygon
            points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4"
            fill="url(#goldGradientCornerTL)"
          />
          <circle cx="0" cy="0" r="3.5" fill="#0d1b2a" stroke="#f7e7b4" stroke-width="1" />
        </g>
        <circle cx="95" cy="18" r="2.5" fill="#d4af37" />
        <circle cx="18" cy="95" r="2.5" fill="#d4af37" />
        <circle cx="65" cy="40" r="2" fill="#c59b27" />
        <circle cx="40" cy="65" r="2" fill="#c59b27" />
        <defs>
          <linearGradient id="goldGradientCornerTL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f7e7b4" />
            <stop offset="50%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#8b4513" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div
      class="fixed top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 z-40 pointer-events-none select-none opacity-85 scale-x-[-1]"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]"
      >
        <path
          d="M0 0 L160 0 C130 15 105 40 90 70 C75 100 70 130 0 160 L0 0 Z"
          fill="url(#goldGradientCornerTR)"
          opacity="0.12"
        />
        <path
          d="M 4 4 L 140 4 C 115 18 95 40 82 68 C 68 96 64 122 4 140 Z"
          stroke="url(#goldGradientCornerTR)"
          stroke-width="1.8"
        />
        <path
          d="M 4 4 L 105 4 C 88 15 72 32 62 52 C 52 72 48 90 4 105 Z"
          stroke="url(#goldGradientCornerTR)"
          stroke-width="1.2"
          stroke-dasharray="3 3"
        />
        <path
          d="M 12 12 Q 35 14 50 30 Q 66 46 68 69"
          stroke="#f7e7b4"
          stroke-width="1.5"
        />
        <g transform="translate(32, 32)">
          <polygon
            points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4"
            fill="url(#goldGradientCornerTR)"
          />
          <circle cx="0" cy="0" r="3.5" fill="#0d1b2a" stroke="#f7e7b4" stroke-width="1" />
        </g>
        <circle cx="95" cy="18" r="2.5" fill="#d4af37" />
        <circle cx="18" cy="95" r="2.5" fill="#d4af37" />
        <circle cx="65" cy="40" r="2" fill="#c59b27" />
        <circle cx="40" cy="65" r="2" fill="#c59b27" />
        <defs>
          <linearGradient id="goldGradientCornerTR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f7e7b4" />
            <stop offset="50%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#8b4513" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div
      class="fixed bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 z-40 pointer-events-none select-none opacity-85 scale-y-[-1]"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]"
      >
        <path
          d="M0 0 L160 0 C130 15 105 40 90 70 C75 100 70 130 0 160 L0 0 Z"
          fill="url(#goldGradientCornerBL)"
          opacity="0.12"
        />
        <path
          d="M 4 4 L 140 4 C 115 18 95 40 82 68 C 68 96 64 122 4 140 Z"
          stroke="url(#goldGradientCornerBL)"
          stroke-width="1.8"
        />
        <path
          d="M 4 4 L 105 4 C 88 15 72 32 62 52 C 52 72 48 90 4 105 Z"
          stroke="url(#goldGradientCornerBL)"
          stroke-width="1.2"
          stroke-dasharray="3 3"
        />
        <path
          d="M 12 12 Q 35 14 50 30 Q 66 46 68 69"
          stroke="#f7e7b4"
          stroke-width="1.5"
        />
        <g transform="translate(32, 32)">
          <polygon
            points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4"
            fill="url(#goldGradientCornerBL)"
          />
          <circle cx="0" cy="0" r="3.5" fill="#0d1b2a" stroke="#f7e7b4" stroke-width="1" />
        </g>
        <circle cx="95" cy="18" r="2.5" fill="#d4af37" />
        <circle cx="18" cy="95" r="2.5" fill="#d4af37" />
        <circle cx="65" cy="40" r="2" fill="#c59b27" />
        <circle cx="40" cy="65" r="2" fill="#c59b27" />
        <defs>
          <linearGradient id="goldGradientCornerBL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f7e7b4" />
            <stop offset="50%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#8b4513" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div
      class="fixed bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 z-40 pointer-events-none select-none opacity-85 rotate-180"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]"
      >
        <path
          d="M0 0 L160 0 C130 15 105 40 90 70 C75 100 70 130 0 160 L0 0 Z"
          fill="url(#goldGradientCornerBR)"
          opacity="0.12"
        />
        <path
          d="M 4 4 L 140 4 C 115 18 95 40 82 68 C 68 96 64 122 4 140 Z"
          stroke="url(#goldGradientCornerBR)"
          stroke-width="1.8"
        />
        <path
          d="M 4 4 L 105 4 C 88 15 72 32 62 52 C 52 72 48 90 4 105 Z"
          stroke="url(#goldGradientCornerBR)"
          stroke-width="1.2"
          stroke-dasharray="3 3"
        />
        <path
          d="M 12 12 Q 35 14 50 30 Q 66 46 68 69"
          stroke="#f7e7b4"
          stroke-width="1.5"
        />
        <g transform="translate(32, 32)">
          <polygon
            points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4"
            fill="url(#goldGradientCornerBR)"
          />
          <circle cx="0" cy="0" r="3.5" fill="#0d1b2a" stroke="#f7e7b4" stroke-width="1" />
        </g>
        <circle cx="95" cy="18" r="2.5" fill="#d4af37" />
        <circle cx="18" cy="95" r="2.5" fill="#d4af37" />
        <circle cx="65" cy="40" r="2" fill="#c59b27" />
        <circle cx="40" cy="65" r="2" fill="#c59b27" />
        <defs>
          <linearGradient id="goldGradientCornerBR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f7e7b4" />
            <stop offset="50%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#8b4513" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Background Atmospheric Textures & Ambient Zellige Star Grid -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15 mix-blend-overlay"
      style="background-image: radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1.5px), radial-gradient(circle at 0 0, #8b4513 1px, transparent 2px); background-size: 40px 40px, 80px 80px;"
    ></div>

    <!-- Soft Desert Gold Ambient Aura -->
    <div
      class="fixed -top-40 -left-40 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[140px] pointer-events-none z-0"
    ></div>
    <div
      class="fixed -bottom-40 -right-40 w-96 h-96 bg-[#8b4513]/25 rounded-full blur-[140px] pointer-events-none z-0"
    ></div>

    <!-- ========================================== -->
    <!-- MUSIC CONTROL -->
    <!-- ========================================== -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#0d1b2a"
      accentColor="#d4af37"
      :autoPlay="!showWelcome"
    />

    <!-- ========================================== -->
    <!-- FLOATING BOTTOM NAVIGATION (Moroccan Riad Arch) -->
    <!-- ========================================== -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-4 inset-x-0 mx-auto z-50 bg-[#0d1b2a]/92 backdrop-blur-xl border border-[#d4af37]/40 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.7)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2 w-full justify-between">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#f7e7b4] scale-105' : 'text-[#e2c9a5]/60 hover:text-[#f7e7b4]'"
        >
          <i :class="[item.icon, 'text-sm sm:text-base']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-marcellus">
            {{ item.label }}
          </span>
          <span
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37] transition-all"
            :class="activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- ========================================== -->
    <!-- 2. WELCOME SCREEN / GATE (IFTITAH & MARHABAN) -->
    <!-- ========================================== -->
    <transition name="gate-fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#0d1b2a] via-[#1b263b] to-[#0a1420] text-center px-4 overflow-hidden"
      >
        <!-- Subtle Animated Stardust Glow -->
        <div class="absolute inset-0 pointer-events-none opacity-40">
          <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-[#d4af37]/15 rounded-full blur-[100px] animate-pulse"></div>
          <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#a0522d]/25 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
        </div>

        <!-- Hanging Lanterns (Fanous Maroko) on Top -->
        <div class="absolute top-0 inset-x-0 flex justify-between items-start px-8 md:px-24 pointer-events-none z-10">
          <!-- Left Lantern -->
          <div class="flex flex-col items-center animate-sway-left origin-top">
            <div class="w-[1px] h-20 md:h-32 bg-gradient-to-b from-transparent via-[#d4af37]/60 to-[#d4af37]"></div>
            <div class="w-12 h-20 md:w-16 md:h-28 text-[#d4af37] filter drop-shadow-[0_0_15px_rgba(247,231,180,0.5)]">
              <svg viewBox="0 0 60 100" fill="currentColor">
                <!-- Ring -->
                <circle cx="30" cy="5" r="4" fill="none" stroke="#d4af37" stroke-width="2" />
                <!-- Dome -->
                <path d="M 18 18 Q 30 7 42 18 L 46 25 L 14 25 Z" fill="#d4af37" />
                <!-- Faceted Glass -->
                <polygon points="14,25 22,70 38,70 46,25" fill="#f7e7b4" opacity="0.3" stroke="#d4af37" stroke-width="1.5" />
                <line x1="30" y1="25" x2="30" y2="70" stroke="#d4af37" stroke-width="1.5" />
                <!-- Center flame glow -->
                <circle cx="30" cy="46" r="6" fill="#f7e7b4" opacity="0.8" />
                <!-- Bottom Base & Tassel -->
                <polygon points="22,70 30,85 38,70" fill="#d4af37" />
                <line x1="30" y1="85" x2="30" y2="98" stroke="#d4af37" stroke-width="1.5" />
                <circle cx="30" cy="98" r="2" fill="#d4af37" />
              </svg>
            </div>
          </div>

          <!-- Center Delicate Mini Crescent Star Pendant -->
          <div class="flex flex-col items-center origin-top">
            <div class="w-[1px] h-12 md:h-16 bg-gradient-to-b from-transparent to-[#d4af37]"></div>
            <div class="w-6 h-6 text-[#f7e7b4] opacity-80">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10 8 8 0 0 1-10-10z" />
                <circle cx="16" cy="8" r="2" fill="#f7e7b4" />
              </svg>
            </div>
          </div>

          <!-- Right Lantern -->
          <div class="flex flex-col items-center animate-sway-right origin-top">
            <div class="w-[1px] h-28 md:h-40 bg-gradient-to-b from-transparent via-[#d4af37]/60 to-[#d4af37]"></div>
            <div class="w-14 h-24 md:w-18 md:h-32 text-[#d4af37] filter drop-shadow-[0_0_15px_rgba(247,231,180,0.5)]">
              <svg viewBox="0 0 60 100" fill="currentColor">
                <circle cx="30" cy="5" r="4" fill="none" stroke="#d4af37" stroke-width="2" />
                <path d="M 18 18 Q 30 7 42 18 L 46 25 L 14 25 Z" fill="#d4af37" />
                <polygon points="14,25 22,70 38,70 46,25" fill="#f7e7b4" opacity="0.3" stroke="#d4af37" stroke-width="1.5" />
                <line x1="30" y1="25" x2="30" y2="70" stroke="#d4af37" stroke-width="1.5" />
                <circle cx="30" cy="46" r="6" fill="#f7e7b4" opacity="0.8" />
                <polygon points="22,70 30,85 38,70" fill="#d4af37" />
                <line x1="30" y1="85" x2="30" y2="98" stroke="#d4af37" stroke-width="1.5" />
                <circle cx="30" cy="98" r="2" fill="#d4af37" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Central Horseshoe Arch Invitation Portal -->
        <div class="relative z-20 w-full max-w-lg mx-auto py-8 px-4 flex flex-col items-center justify-center space-y-6">
          <!-- Bismillah Calligraphy -->
          <div class="space-y-1">
            <p class="font-amiri text-2xl md:text-3xl text-[#d4af37] drop-shadow-sm tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p class="text-[10px] uppercase font-marcellus tracking-[0.35em] text-[#e2c9a5]">
              Marhaban ya Duyuuf • Walimatul 'Ursy
            </p>
          </div>

          <!-- Horseshoe Arch Keyhole Card -->
          <div
            class="w-full relative p-6 sm:p-8 rounded-t-[5rem] sm:rounded-t-[6rem] rounded-b-3xl border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#1b263b]/90 via-[#0d1b2a]/95 to-[#162232] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden text-center space-y-5"
          >
            <!-- Cusped Scallop Moorish Top Arch SVG -->
            <div class="w-20 h-10 mx-auto text-[#d4af37]/70">
              <svg viewBox="0 0 100 50" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M 5 45 C 5 20, 25 5, 50 2 C 75 5, 95 20, 95 45" />
                <circle cx="50" cy="18" r="4" fill="#d4af37" />
              </svg>
            </div>

            <!-- Header Titles -->
            <div class="space-y-1">
              <span class="inline-block px-3 py-1 rounded-full border border-[#d4af37]/40 bg-[#8b4513]/30 text-[9px] uppercase tracking-[0.3em] text-[#f7e7b4] font-bold">
                The Wedding Celebration Of
              </span>
              <h1 class="text-3xl sm:text-5xl font-marcellus text-[#fdfaf6] tracking-wide pt-2">
                {{ groomShortName }}
                <span class="text-[#d4af37] italic font-serif mx-2">&</span>
                {{ brideShortName }}
              </h1>
              <p class="text-xs sm:text-sm text-[#e2c9a5] font-marcellus tracking-widest pt-1">
                {{ formatDate(mainEventDate) }}
              </p>
            </div>

            <!-- 8-Pointed Star Ornament Divider -->
            <div class="flex items-center justify-center gap-3 text-[#d4af37] py-1">
              <div class="h-px w-14 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-[#f7e7b4]">
                <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
              </svg>
              <div class="h-px w-14 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
            </div>

            <!-- Guest Name Card -->
            <div class="p-4 rounded-2xl border border-[#d4af37]/30 bg-[#0d1b2a]/80 space-y-1.5 shadow-inner">
              <p class="text-[9px] uppercase tracking-[0.25em] text-[#e2c9a5]/80 font-marcellus">
                Yth. Tamu Kehormatan
              </p>
              <h3 class="text-xl sm:text-2xl font-marcellus font-bold text-[#f7e7b4] px-2 truncate">
                {{ data.guestName || 'Tamu Undangan' }}
              </h3>
              <p class="text-[10px] text-[#e2c9a5]/70 italic">
                Semoga Allah SWT melimpahkan rahmat &amp; keberkahan
              </p>
            </div>

            <!-- Open Button (Iftitah) -->
            <button
              @click="openInvitation"
              class="group relative inline-flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-[#8b4513] via-[#d4af37] to-[#8b4513] hover:brightness-110 active:scale-95 text-[#0d1b2a] font-bold rounded-full transition-all duration-300 shadow-[0_8px_25px_rgba(212,175,55,0.4)] text-xs uppercase tracking-[0.25em] cursor-pointer"
            >
              <i class="fa-solid fa-envelope-open-text text-sm transition-transform duration-300 group-hover:scale-125"></i>
              <span class="font-extrabold text-[#0d1b2a]">Iftitah • Buka Undangan</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ========================================== -->
    <!-- 3. MAIN INVITATION CONTENT -->
    <!-- ========================================== -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="relative z-30 opacity-0 transition-opacity duration-1000 min-h-screen pb-24"
    >
      <!-- ========================================== -->
      <!-- SECTION 1: HERO / MAJESTIC PORTAL COVER -->
      <!-- ========================================== -->
      <section
        id="home"
        class="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 relative overflow-hidden bg-gradient-to-b from-[#0d1b2a] via-[#162638] to-[#0d1b2a]"
      >
        <div class="relative z-10 max-w-3xl mx-auto space-y-6" v-observe>
          <!-- Bismillah Header -->
          <div class="text-[#d4af37] space-y-1">
            <p class="font-amiri text-2xl sm:text-3xl text-[#f7e7b4] drop-shadow-md">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p class="text-[10px] sm:text-xs font-marcellus tracking-[0.4em] uppercase text-[#e2c9a5]">
              Walimatul 'Ursy • The Sacred Union
            </p>
          </div>

          <!-- Couple Frame with Moroccan Horseshoe Arch -->
          <div class="relative inline-block my-2">
            <!-- Moroccan Horseshoe Arch Shape -->
            <div
              class="w-56 h-80 sm:w-64 sm:h-92 md:w-72 md:h-96 mx-auto rounded-t-[7rem] sm:rounded-t-[8rem] rounded-b-3xl border-2 border-[#d4af37] p-2 bg-gradient-to-b from-[#8b4513]/40 to-[#0d1b2a] shadow-[0_0_40px_rgba(212,175,55,0.3)] overflow-hidden"
            >
              <img
                :src="coupleHeroPhoto"
                alt="Foto Mempelai"
                class="w-full h-full object-cover rounded-t-[6.5rem] sm:rounded-t-[7.5rem] rounded-b-2xl filter brightness-95 contrast-105"
              />
            </div>

            <!-- Decorative Arch Crest Badge -->
            <div
              class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0d1b2a] border border-[#d4af37] px-6 py-1.5 rounded-full text-[10px] font-marcellus uppercase tracking-[0.25em] text-[#f7e7b4] shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <i class="fa-solid fa-gem text-[8px] text-[#d4af37]"></i>
              <span>Al-Khadim &amp; Al-Khadimah</span>
              <i class="fa-solid fa-gem text-[8px] text-[#d4af37]"></i>
            </div>
          </div>

          <!-- Couple Full Royal Names -->
          <div class="space-y-2 pt-2">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-marcellus text-[#fdfaf6] tracking-wide leading-tight">
              {{ data.groomName || 'Fauzan Al-Farisi, S.T.' }}
              <span class="text-2xl sm:text-4xl text-[#d4af37] italic font-serif block my-1">&amp;</span>
              {{ data.brideName || 'Yasmin Zahirah, S.Ked.' }}
            </h1>
            <p class="text-xs sm:text-base text-[#e2c9a5] font-marcellus tracking-[0.3em] uppercase">
              {{ formatDate(mainEventDate) }}
            </p>
          </div>

          <!-- Geometric Divider -->
          <div class="flex items-center justify-center gap-2 max-w-xs mx-auto text-[#d4af37] opacity-80 my-2">
            <span class="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]"></span>
            <div class="w-3 h-3 rotate-45 border border-[#d4af37] bg-[#8b4513]"></div>
            <span class="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]"></span>
          </div>

          <!-- ========================================== -->
          <!-- COUNTDOWN TIMER (Moroccan Star Arch Boxes) -->
          <!-- ========================================== -->
          <div
            v-if="isSectionEnabled('countdown')"
            class="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto pt-4"
          >
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 sm:p-4 rounded-2xl border border-[#d4af37]/40 bg-gradient-to-b from-[#1b263b]/80 via-[#0d1b2a]/90 to-[#121e2d] shadow-[0_8px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-[#f7e7b4] transition-all"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent pointer-events-none"></div>
              <div class="text-2xl sm:text-3xl md:text-4xl font-marcellus font-bold text-[#f7e7b4] tracking-wider">
                {{ val }}
              </div>
              <div class="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold mt-1">
                {{ label }}
              </div>
              <div class="text-[8px] text-[#e2c9a5]/70 font-marcellus tracking-wider">
                {{ countdownArabicLabel(label) }}
              </div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 animate-bounce text-[#d4af37]/70">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 2: AYAT SUCI AL-QUR'AN (QS AR-RUM 21) -->
      <!-- ========================================== -->
      <section
        v-if="isSectionEnabled('quote')"
        class="py-20 px-4 relative bg-[#0b1724] border-y border-[#d4af37]/30 text-center"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- 8-Pointed Star Icon Crest -->
          <div class="flex justify-center text-[#d4af37]">
            <svg viewBox="0 0 40 40" class="w-10 h-10" fill="currentColor">
              <polygon points="20,0 25,12 37,15 28,24 30,37 20,30 10,37 12,24 3,15 15,12" fill="#d4af37" />
              <circle cx="20" cy="20" r="4" fill="#0b1724" />
            </svg>
          </div>

          <p class="text-xs font-marcellus uppercase tracking-[0.3em] text-[#d4af37]">
            Kalamullah • Firman Suci
          </p>

          <!-- Arabic Verse -->
          <div
            class="p-6 sm:p-8 rounded-3xl border border-[#d4af37]/35 bg-gradient-to-b from-[#162536]/70 to-[#0d1b2a]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4"
          >
            <p
              class="font-amiri text-xl sm:text-2xl md:text-3xl text-[#f7e7b4] leading-loose sm:leading-loose text-center"
              dir="rtl"
            >
              {{ data.quoteArabic || "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ" }}
            </p>

            <div class="w-16 h-px bg-[#d4af37]/40 mx-auto"></div>

            <p class="text-xs sm:text-sm text-[#e2c9a5] leading-relaxed font-marcellus italic">
              "{{ data.quote || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.' }}"
            </p>

            <p class="text-[11px] font-bold text-[#d4af37] tracking-widest uppercase">
              {{ data.quoteSource || 'QS. Ar-Rum: 21' }}
            </p>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 3: PROFIL MEMPELAI (AL-KHADIM & AL-KHADIMAH) -->
      <!-- ========================================== -->
      <section
        id="couple"
        v-if="isSectionEnabled('couple')"
        class="py-24 px-4 relative bg-gradient-to-b from-[#0d1b2a] via-[#142333] to-[#0d1b2a]"
        v-observe
      >
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <!-- Section Heading -->
          <div class="space-y-2">
            <p class="text-xs font-marcellus uppercase tracking-[0.35em] text-[#d4af37]">
              Mempelai Yang Berbahagia
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-marcellus text-[#fdfaf6]">
              Khadim &amp; Khadimah
            </h2>
            <p class="text-xs text-[#e2c9a5] max-w-lg mx-auto leading-relaxed">
              Dengan memohon rahmat dan ridho Allah Subhanahu wa Ta'ala, kami bermaksud menyelenggarakan ikatan pernikahan suci:
            </p>
          </div>

          <!-- Couple Profile Cards (Grid 2 cols) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 items-center">
            <!-- GROOM / KHADIM CARD -->
            <div
              class="relative p-6 sm:p-8 rounded-t-[6rem] rounded-b-3xl border-2 border-[#d4af37]/45 bg-gradient-to-b from-[#1b263b]/90 to-[#0a1420] shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-5 text-center group hover:border-[#f7e7b4] transition-all"
            >
              <!-- Moorish Arch Photo Frame -->
              <div class="relative w-44 h-60 sm:w-52 sm:h-72 mx-auto">
                <div
                  class="w-full h-full rounded-t-[5.5rem] rounded-b-2xl border-2 border-[#d4af37] p-1.5 overflow-hidden bg-[#0d1b2a] shadow-lg"
                >
                  <img
                    :src="groomPhoto"
                    alt="Foto Mempelai Pria"
                    class="w-full h-full object-cover rounded-t-[5rem] rounded-b-xl filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <!-- Small Moroccan Arch Badge -->
                <div
                  class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8b4513] text-[#f7e7b4] text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full border border-[#d4af37]"
                >
                  Al-Khadim
                </div>
              </div>

              <!-- Name & Parents -->
              <div class="space-y-2">
                <h3 class="text-2xl sm:text-3xl font-marcellus text-[#fdfaf6] tracking-wide">
                  {{ data.groomName || 'Fauzan Al-Farisi, S.T.' }}
                </h3>
                <p v-if="data.groomTitle" class="text-xs text-[#d4af37] font-marcellus uppercase tracking-widest">
                  {{ data.groomTitle }}
                </p>
                <div class="pt-2 text-xs text-[#e2c9a5] space-y-1">
                  <p class="text-[10px] uppercase tracking-wider text-[#d4af37]">Putra Tercinta dari Pasangan:</p>
                  <p class="font-bold text-sm text-[#fdfaf6]">
                    {{ data.groomFather || 'Bpk. H. Ahmad Farisi' }} &amp; {{ data.groomMother || 'Ibu Hj. Aminah Zahra' }}
                  </p>
                </div>
              </div>

              <!-- Instagram button if any -->
              <div v-if="data.groomInstagram" class="pt-1">
                <a
                  :href="getInstagramUrl(data.groomInstagram)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#0d1b2a]/60 text-xs text-[#f7e7b4] hover:bg-[#d4af37] hover:text-[#0d1b2a] transition-all"
                >
                  <i class="fa-brands fa-instagram"></i>
                  <span>@{{ sanitizeHandle(data.groomInstagram) }}</span>
                </a>
              </div>
            </div>

            <!-- BRIDE / KHADIMAH CARD -->
            <div
              class="relative p-6 sm:p-8 rounded-t-[6rem] rounded-b-3xl border-2 border-[#d4af37]/45 bg-gradient-to-b from-[#1b263b]/90 to-[#0a1420] shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-5 text-center group hover:border-[#f7e7b4] transition-all"
            >
              <!-- Moorish Arch Photo Frame -->
              <div class="relative w-44 h-60 sm:w-52 sm:h-72 mx-auto">
                <div
                  class="w-full h-full rounded-t-[5.5rem] rounded-b-2xl border-2 border-[#d4af37] p-1.5 overflow-hidden bg-[#0d1b2a] shadow-lg"
                >
                  <img
                    :src="bridePhoto"
                    alt="Foto Mempelai Wanita"
                    class="w-full h-full object-cover rounded-t-[5rem] rounded-b-xl filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <!-- Small Moroccan Arch Badge -->
                <div
                  class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8b4513] text-[#f7e7b4] text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full border border-[#d4af37]"
                >
                  Al-Khadimah
                </div>
              </div>

              <!-- Name & Parents -->
              <div class="space-y-2">
                <h3 class="text-2xl sm:text-3xl font-marcellus text-[#fdfaf6] tracking-wide">
                  {{ data.brideName || 'Yasmin Zahirah, S.Ked.' }}
                </h3>
                <p v-if="data.brideTitle" class="text-xs text-[#d4af37] font-marcellus uppercase tracking-widest">
                  {{ data.brideTitle }}
                </p>
                <div class="pt-2 text-xs text-[#e2c9a5] space-y-1">
                  <p class="text-[10px] uppercase tracking-wider text-[#d4af37]">Putri Tercinta dari Pasangan:</p>
                  <p class="font-bold text-sm text-[#fdfaf6]">
                    {{ data.brideFather || 'Bpk. Dr. H. Mansyur Malik' }} &amp; {{ data.brideMother || 'Ibu Hj. Siti Maryam' }}
                  </p>
                </div>
              </div>

              <!-- Instagram button if any -->
              <div v-if="data.brideInstagram" class="pt-1">
                <a
                  :href="getInstagramUrl(data.brideInstagram)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#0d1b2a]/60 text-xs text-[#f7e7b4] hover:bg-[#d4af37] hover:text-[#0d1b2a] transition-all"
                >
                  <i class="fa-brands fa-instagram"></i>
                  <span>@{{ sanitizeHandle(data.brideInstagram) }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 4: DETAIL ACARA (AKAD & RESEPSI / WALIMATUL 'URSY) -->
      <!-- ========================================== -->
      <section
        id="event"
        v-if="isSectionEnabled('event')"
        class="py-24 px-4 relative bg-[#0b1622] border-y border-[#d4af37]/30"
        v-observe
      >
        <div class="max-w-5xl mx-auto space-y-14 text-center">
          <div class="space-y-2">
            <p class="text-xs font-marcellus uppercase tracking-[0.35em] text-[#d4af37]">
              Waktu &amp; Tempat Pelaksanaan
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-marcellus text-[#fdfaf6]">
              Rangkaian Acara
            </h2>
            <p class="text-xs text-[#e2c9a5] max-w-md mx-auto leading-relaxed">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari istimewa kami:
            </p>
          </div>

          <!-- Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <!-- 1. AKAD NIKAH -->
            <div
              class="relative p-6 sm:p-8 rounded-t-[5rem] rounded-b-3xl border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#1b263b]/90 via-[#0d1b2a] to-[#111d2b] shadow-[0_12px_36px_rgba(0,0,0,0.6)] space-y-6 text-center overflow-hidden"
            >
              <!-- Top Moorish Arch Icon -->
              <div class="w-14 h-14 mx-auto rounded-full border border-[#d4af37]/50 bg-[#8b4513]/30 flex items-center justify-center text-[#f7e7b4] text-xl shadow-md">
                <i class="fa-solid fa-mosque"></i>
              </div>

              <div class="space-y-1">
                <span class="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">Ijab &amp; Qobul</span>
                <h3 class="text-2xl sm:text-3xl font-marcellus text-[#fdfaf6]">
                  Akad Nikah
                </h3>
              </div>

              <!-- Date & Time -->
              <div class="p-4 rounded-2xl border border-[#d4af37]/25 bg-[#0d1b2a]/70 space-y-2">
                <p class="text-sm sm:text-base font-bold text-[#f7e7b4]">
                  {{ formatDate(akadDate) }}
                </p>
                <div class="flex items-center justify-center gap-2 text-xs text-[#e2c9a5]">
                  <i class="fa-regular fa-clock text-[#d4af37]"></i>
                  <span>{{ formatTime(akadDate) || '08.00 WIB - Selesai' }}</span>
                </div>
              </div>

              <!-- Venue & Address -->
              <div class="space-y-2">
                <h4 class="font-bold text-sm sm:text-base text-[#fdfaf6]">
                  {{ data.akadLocation?.venueName || 'Masjid Agung Al-Barkah / Kediaman Mempelai' }}
                </h4>
                <p class="text-xs text-[#e2c9a5]/80 leading-relaxed max-w-xs mx-auto">
                  {{ data.akadLocation?.address || 'Jl. Kemang Raya No. 45, Jakarta Selatan' }}
                </p>
              </div>

              <!-- Action Buttons (Calendar & Map) -->
              <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  v-if="data.akadLocation?.googleMapsUrl"
                  :href="data.akadLocation.googleMapsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8b4513] to-[#d4af37] text-[#0d1b2a] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>Petunjuk Arah</span>
                </a>
                <a
                  :href="getCalendarUrl('Akad Nikah ' + groomShortName + ' & ' + brideShortName, akadDate, data.akadLocation?.address)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#d4af37]/50 bg-[#0d1b2a]/80 text-[#f7e7b4] font-semibold text-xs uppercase tracking-wider hover:bg-[#d4af37] hover:text-[#0d1b2a] transition-all"
                >
                  <i class="fa-regular fa-calendar-plus"></i>
                  <span>Simpan Kalender</span>
                </a>
              </div>
            </div>

            <!-- 2. WALIMATUL 'URSY / RESEPSI -->
            <div
              class="relative p-6 sm:p-8 rounded-t-[5rem] rounded-b-3xl border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#1b263b]/90 via-[#0d1b2a] to-[#111d2b] shadow-[0_12px_36px_rgba(0,0,0,0.6)] space-y-6 text-center overflow-hidden"
            >
              <!-- Top Moorish Arch Icon -->
              <div class="w-14 h-14 mx-auto rounded-full border border-[#d4af37]/50 bg-[#8b4513]/30 flex items-center justify-center text-[#f7e7b4] text-xl shadow-md">
                <i class="fa-solid fa-champagne-glasses"></i>
              </div>

              <div class="space-y-1">
                <span class="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">Walimatul 'Ursy</span>
                <h3 class="text-2xl sm:text-3xl font-marcellus text-[#fdfaf6]">
                  Resepsi Pernikahan
                </h3>
              </div>

              <!-- Date & Time -->
              <div class="p-4 rounded-2xl border border-[#d4af37]/25 bg-[#0d1b2a]/70 space-y-2">
                <p class="text-sm sm:text-base font-bold text-[#f7e7b4]">
                  {{ formatDate(resepsiDate) }}
                </p>
                <div class="flex items-center justify-center gap-2 text-xs text-[#e2c9a5]">
                  <i class="fa-regular fa-clock text-[#d4af37]"></i>
                  <span>{{ formatTime(resepsiDate) || '11.00 - 15.00 WIB' }}</span>
                </div>
              </div>

              <!-- Venue & Address -->
              <div class="space-y-2">
                <h4 class="font-bold text-sm sm:text-base text-[#fdfaf6]">
                  {{ data.resepsiLocation?.venueName || 'The Grand Riad Ballroom & Courtyard' }}
                </h4>
                <p class="text-xs text-[#e2c9a5]/80 leading-relaxed max-w-xs mx-auto">
                  {{ data.resepsiLocation?.address || 'Jl. Gatot Subroto Kav. 18, Jakarta Selatan' }}
                </p>
              </div>

              <!-- Action Buttons (Calendar & Map) -->
              <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  v-if="data.resepsiLocation?.googleMapsUrl"
                  :href="data.resepsiLocation.googleMapsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8b4513] to-[#d4af37] text-[#0d1b2a] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>Petunjuk Arah</span>
                </a>
                <a
                  :href="getCalendarUrl('Resepsi ' + groomShortName + ' & ' + brideShortName, resepsiDate, data.resepsiLocation?.address)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#d4af37]/50 bg-[#0d1b2a]/80 text-[#f7e7b4] font-semibold text-xs uppercase tracking-wider hover:bg-[#d4af37] hover:text-[#0d1b2a] transition-all"
                >
                  <i class="fa-regular fa-calendar-plus"></i>
                  <span>Simpan Kalender</span>
                </a>
              </div>
            </div>
          </div>

          <!-- DRESS CODE / TATA BUSANA (If provided) -->
          <div
            v-if="data.dressCode || isSectionEnabled('dress-code')"
            class="max-w-md mx-auto p-5 rounded-2xl border border-[#d4af37]/30 bg-[#162536]/60 space-y-2 text-center"
          >
            <div class="flex items-center justify-center gap-2 text-[#d4af37] text-sm">
              <i class="fa-solid fa-shirt"></i>
              <span class="font-bold text-xs uppercase tracking-widest">Dress Code / Busana Tamu</span>
            </div>
            <p class="text-xs text-[#e2c9a5]">
              {{ data.dressCode?.description || data.dressCode || 'Pakaian Sopan & Menutup Aurat / Nuansa Earth Tone, Sand Gold, atau Terracotta.' }}
            </p>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 5: LOVE STORY TIMELINE (KISAH KASIH) -->
      <!-- ========================================== -->
      <section
        id="story"
        v-if="isSectionEnabled('love-story')"
        class="py-24 px-4 relative bg-[#0d1b2a]"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-14 text-center">
          <div class="space-y-2">
            <p class="text-xs font-marcellus uppercase tracking-[0.35em] text-[#d4af37]">
              Jejak Langkah Cinta
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-marcellus text-[#fdfaf6]">
              Kisah Kasih &amp; Ta'aruf
            </h2>
            <p class="text-xs text-[#e2c9a5] max-w-md mx-auto">
              Perjalanan dua insan yang dipersatukan atas ketetapan dan takdir indah-Nya:
            </p>
          </div>

          <!-- Vertical Timeline with 8-Pointed Star Nodes -->
          <div class="relative border-l-2 border-[#d4af37]/40 ml-4 md:mx-auto md:max-w-xl space-y-10 text-left pl-6 md:pl-8">
            <div
              v-for="(story, index) in activeStories"
              :key="'story-' + index"
              class="relative group"
            >
              <!-- 8-Pointed Star Node -->
              <div
                class="absolute -left-[35px] md:-left-[43px] top-1.5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#0d1b2a] border-2 border-[#d4af37] flex items-center justify-center text-[#f7e7b4] text-[10px] shadow-lg group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-star text-[10px] text-[#d4af37]"></i>
              </div>

              <!-- Content Card -->
              <div
                class="p-5 sm:p-6 rounded-2xl border border-[#d4af37]/30 bg-[#162536]/80 backdrop-blur-sm space-y-2 group-hover:border-[#f7e7b4] transition-all"
              >
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <h4 class="font-bold text-base sm:text-lg text-[#f7e7b4] font-marcellus">
                    {{ story.title }}
                  </h4>
                  <span class="text-[10px] px-2.5 py-0.5 rounded-full border border-[#d4af37]/40 bg-[#8b4513]/40 text-[#e2c9a5] font-bold">
                    {{ story.date }}
                  </span>
                </div>
                <p class="text-xs text-[#e2c9a5]/90 leading-relaxed">
                  {{ story.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 6: GALERI FOTO (RIAD COURTYARD GALLERY) -->
      <!-- ========================================== -->
      <section
        id="gallery"
        v-if="isSectionEnabled('gallery') && galleryImages.length"
        class="py-24 px-4 relative bg-[#0b1622] border-y border-[#d4af37]/30"
        v-observe
      >
        <div class="max-w-5xl mx-auto space-y-12 text-center">
          <div class="space-y-2">
            <p class="text-xs font-marcellus uppercase tracking-[0.35em] text-[#d4af37]">
              Momen Bahagia
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-marcellus text-[#fdfaf6]">
              Galeri Kenangan
            </h2>
            <p class="text-xs text-[#e2c9a5] max-w-md mx-auto">
              Lentera kebahagiaan yang terabadikan dalam lembaran potret penuh cinta:
            </p>
          </div>

          <!-- Gallery Component -->
          <div class="moroccan-gallery-wrapper">
            <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 7: TANDA KASIH & KADO DIGITAL (AMPLOP DIGITAL) -->
      <!-- ========================================== -->
      <section
        id="gift"
        v-if="isSectionEnabled('gift')"
        class="py-24 px-4 relative bg-[#0d1b2a]"
        v-observe
      >
        <div class="max-w-4xl mx-auto space-y-12 text-center">
          <div class="space-y-2">
            <p class="text-xs font-marcellus uppercase tracking-[0.35em] text-[#d4af37]">
              Ungkapan Tanda Kasih
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-marcellus text-[#fdfaf6]">
              Kado &amp; Hadyah Digital
            </h2>
            <p class="text-xs text-[#e2c9a5] max-w-md mx-auto leading-relaxed">
              Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda berhasrat memberikan tanda kasih, dapat disalurkan melalui:
            </p>
          </div>

          <!-- Accounts Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <!-- Bank Accounts -->
            <div
              v-for="(acc, index) in bankAccountsList"
              :key="'bank-' + index"
              class="relative p-6 rounded-3xl border border-[#d4af37]/40 bg-gradient-to-b from-[#1b263b]/90 to-[#0a1420] shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4 text-center group hover:border-[#f7e7b4] transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  {{ acc.bankName || 'Bank Syariah Indonesia' }}
                </span>
                <i class="fa-solid fa-credit-card text-[#f7e7b4]"></i>
              </div>

              <div class="py-2 space-y-1">
                <p class="text-xl sm:text-2xl font-mono font-bold text-[#f7e7b4] tracking-widest">
                  {{ acc.accountNumber }}
                </p>
                <p class="text-xs text-[#e2c9a5]">
                  a.n {{ acc.accountHolder }}
                </p>
              </div>

              <button
                @click="copyToClipboard(acc.accountNumber)"
                class="w-full py-2.5 rounded-full border border-[#d4af37]/50 bg-[#0d1b2a] hover:bg-[#d4af37] hover:text-[#0d1b2a] text-[#f7e7b4] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Nomor Rekening</span>
              </button>
            </div>

            <!-- E-Wallets if any -->
            <div
              v-for="(wallet, index) in walletItems"
              :key="'wallet-' + index"
              class="relative p-6 rounded-3xl border border-[#d4af37]/40 bg-gradient-to-b from-[#1b263b]/90 to-[#0a1420] shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4 text-center group hover:border-[#f7e7b4] transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  {{ wallet.wallet_provider || 'Dompet Digital' }}
                </span>
                <i class="fa-solid fa-wallet text-[#f7e7b4]"></i>
              </div>

              <div class="py-2 space-y-1">
                <p class="text-xl sm:text-2xl font-mono font-bold text-[#f7e7b4] tracking-widest">
                  {{ wallet.wallet_number }}
                </p>
                <p class="text-xs text-[#e2c9a5]">
                  E-Wallet Mempelai
                </p>
              </div>

              <button
                @click="copyToClipboard(wallet.wallet_number)"
                class="w-full py-2.5 rounded-full border border-[#d4af37]/50 bg-[#0d1b2a] hover:bg-[#d4af37] hover:text-[#0d1b2a] text-[#f7e7b4] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Nomor E-Wallet</span>
              </button>
            </div>
          </div>

          <!-- Gift Delivery Address -->
          <div
            v-if="giftAddresses.length"
            class="max-w-xl mx-auto p-6 rounded-3xl border border-[#d4af37]/35 bg-[#162536]/70 space-y-3 text-center"
          >
            <div class="flex items-center justify-center gap-2 text-[#d4af37]">
              <i class="fa-solid fa-box-open text-base"></i>
              <span class="font-bold text-xs uppercase tracking-widest">Kirim Kado Fisik</span>
            </div>
            <p
              v-for="(addr, idx) in giftAddresses"
              :key="'addr-' + idx"
              class="text-xs text-[#e2c9a5] leading-relaxed"
            >
              {{ addr }}
            </p>
            <button
              @click="copyToClipboard(giftAddresses[0])"
              class="mt-2 px-5 py-2 rounded-full border border-[#d4af37]/40 bg-[#0d1b2a] hover:bg-[#d4af37] hover:text-[#0d1b2a] text-[#f7e7b4] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
            >
              <i class="fa-regular fa-copy"></i>
              <span>Salin Alamat Kirim</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 8: RSVP & UCAPAN DOA RESTU (BARAKALLAHU LAKUMA) -->
      <!-- ========================================== -->
      <section
        id="rsvp"
        v-if="isSectionEnabled('rsvp')"
        class="py-24 px-4 relative bg-[#0b1622] border-y border-[#d4af37]/30"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-12">
          <!-- Section Heading -->
          <div class="text-center space-y-2">
            <p class="text-xs font-marcellus uppercase tracking-[0.35em] text-[#d4af37]">
              Konfirmasi Kehadiran &amp; Doa
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-marcellus text-[#fdfaf6]">
              RSVP &amp; Doa Restu
            </h2>
            <p class="text-xs text-[#e2c9a5] max-w-md mx-auto">
              Mohon konfirmasikan kehadiran dan kirimkan untaian doa barakah bagi kedua mempelai:
            </p>
          </div>

          <!-- RSVP Form Card -->
          <div
            class="p-6 sm:p-8 rounded-3xl border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#1b263b]/90 to-[#0a1420] shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-6"
          >
            <form @submit.prevent="submitRsvp" class="space-y-4">
              <!-- Name Input -->
              <div class="space-y-1">
                <label class="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">Nama Lengkap</label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Nama Anda atau Keluarga"
                  class="w-full px-4 py-3 rounded-xl bg-[#0d1b2a] border border-[#d4af37]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <!-- Attendance & Guests Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">Konfirmasi Kehadiran</label>
                  <select
                    v-model="rsvp.attendance"
                    class="w-full px-4 py-3 rounded-xl bg-[#0d1b2a] border border-[#d4af37]/30 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="hadir">Insya Allah Hadir</option>
                    <option value="tidak_hadir">Maaf, Tidak Dapat Hadir</option>
                    <option value="ragu">Masih Ragu-ragu</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">Jumlah Tamu</label>
                  <select
                    v-model="rsvp.totalGuests"
                    class="w-full px-4 py-3 rounded-xl bg-[#0d1b2a] border border-[#d4af37]/30 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option :value="1">1 Orang</option>
                    <option :value="2">2 Orang</option>
                    <option :value="3">3 Orang</option>
                    <option :value="4">4 Orang</option>
                  </select>
                </div>
              </div>

              <!-- Prayer / Message -->
              <div class="space-y-1">
                <label class="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">Ucapan Doa &amp; Restu</label>
                <textarea
                  v-model="rsvp.message"
                  rows="3"
                  required
                  placeholder="Tuliskan ucapan selamat atau doa barakah bagi mempelai..."
                  class="w-full px-4 py-3 rounded-xl bg-[#0d1b2a] border border-[#d4af37]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-4 bg-gradient-to-r from-[#8b4513] via-[#d4af37] to-[#8b4513] hover:brightness-110 active:scale-95 text-[#0d1b2a] font-bold rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-[0_6px_20px_rgba(212,175,55,0.3)] disabled:opacity-50 cursor-pointer"
              >
                <span v-if="submittingRsvp">
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengirimkan...
                </span>
                <span v-else>
                  <i class="fa-solid fa-paper-plane mr-2"></i> Kirim Konfirmasi &amp; Doa
                </span>
              </button>
            </form>
          </div>

          <!-- Wishes / Doa Feed -->
          <div class="space-y-4" v-if="guestMessages.length">
            <h4 class="text-center font-marcellus text-xl text-[#f7e7b4]">
              Untaian Doa Restu ({{ guestMessages.length }})
            </h4>
            <div class="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-1">
              <div
                v-for="(msg, idx) in guestMessages"
                :key="'msg-' + idx"
                class="p-4 rounded-2xl border border-[#d4af37]/25 bg-[#162536]/80 space-y-1 text-left"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sm text-[#fdfaf6]">{{ msg.name || msg.guestName }}</span>
                  <span
                    class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
                    :class="(msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'bg-[#d4af37]/20 text-[#f7e7b4] border border-[#d4af37]/40' : 'bg-gray-800 text-gray-400'"
                  >
                    {{ (msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'Hadir' : 'Absen' }}
                  </span>
                </div>
                <p class="text-xs text-[#e2c9a5] leading-relaxed">
                  "{{ msg.message }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 9: TURUT MENGUNDANG & DOA PENUTUP -->
      <!-- ========================================== -->
      <footer
        class="py-24 px-4 bg-[#0a131e] text-center border-t border-[#d4af37]/30 relative overflow-hidden"
      >
        <div class="relative z-10 max-w-2xl mx-auto space-y-8">
          <!-- Moroccan Crest Icon -->
          <div class="flex justify-center text-[#d4af37]">
            <svg viewBox="0 0 100 60" fill="currentColor" class="w-14 h-8 opacity-75">
              <polygon points="50,5 60,25 80,25 65,37 70,55 50,43 30,55 35,37 20,25 40,25" />
            </svg>
          </div>

          <!-- Turut Mengundang List if available -->
          <div v-if="normalizedExtendedFamily.length" class="space-y-3">
            <h4 class="text-xs font-marcellus uppercase tracking-[0.3em] text-[#d4af37]">
              Turut Mengundang
            </h4>
            <div class="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              <span
                v-for="(member, i) in normalizedExtendedFamily"
                :key="'fam-' + i"
                class="text-xs text-[#e2c9a5] px-3 py-1 rounded-full border border-[#d4af37]/20 bg-[#0d1b2a]/60"
              >
                {{ member }}
              </span>
            </div>
          </div>

          <!-- Closing Blessing -->
          <div class="space-y-2">
            <p class="font-amiri text-xl text-[#f7e7b4]">
              جَزَاكُمُ اللَّهُ خَيْرًا كَثِيرًا
            </p>
            <p class="text-xs text-[#e2c9a5]/80 max-w-md mx-auto leading-relaxed">
              {{ data.footerText || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara(i) berkenan hadir dan memberikan doa restu bagi kami berdua.' }}
            </p>
          </div>

          <div class="w-16 h-px bg-[#d4af37]/40 mx-auto"></div>

          <!-- Couple signature -->
          <h3 class="text-2xl sm:text-3xl font-marcellus text-[#fdfaf6]">
            {{ groomShortName }} &amp; {{ brideShortName }}
          </h3>

          <div class="pt-4">
            <WatermarkBadge variant="gold" />
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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

// Section normalization rule
function isSectionEnabled(key) {
  const sections = data.value?.selectedSections
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
    countdown: ['countdown', 'timer'],
    gallery: ['gallery', 'galleryInvitation'],
    gift: ['gift', 'amplop', 'kado'],
    rsvp: ['rsvp', 'guestbook', 'wishes'],
    quote: ['quote', 'ayat', 'doa'],
  }
  const aliases = aliasMap[key] || [key]
  return aliases.some((a) => sections.includes(a))
}

// Couple Names & Photos
const groomShortName = computed(() => {
  const full = data.value.groomName || 'Fauzan'
  return full.split(',')[0].trim().split(' ').slice(-1)[0] || 'Fauzan'
})

const brideShortName = computed(() => {
  const full = data.value.brideName || 'Yasmin'
  return full.split(',')[0].trim().split(' ').slice(-1)[0] || 'Yasmin'
})

const coupleHeroPhoto = computed(() => {
  return (
    data.value.photoCoupleUrl ||
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'
  )
})

const groomPhoto = computed(() => {
  return (
    data.value.groomPhotoUrl ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  )
})

const bridePhoto = computed(() => {
  return (
    data.value.bridePhotoUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  )
})

// Dates
const akadDate = computed(() => {
  return data.value.akadLocation?.dateTime || data.value.dateTime || '2026-11-20T08:00:00'
})

const resepsiDate = computed(() => {
  return data.value.resepsiLocation?.dateTime || data.value.dateTime || '2026-11-20T11:00:00'
})

const mainEventDate = computed(() => {
  return data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime || '2026-11-20T08:00:00'
})

// Nav items
const navItems = computed(() => {
  const list = [
    { id: 'home', label: 'Bebuka', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-check' },
  ]
  if (isSectionEnabled('love-story')) list.push({ id: 'story', label: 'Kisah', icon: 'fa-solid fa-book-open' })
  if (isSectionEnabled('gallery') && galleryImages.value.length) list.push({ id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' })
  if (isSectionEnabled('gift')) list.push({ id: 'gift', label: 'Kado', icon: 'fa-solid fa-gift' })
  if (isSectionEnabled('rsvp')) list.push({ id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope' })
  return list
})

// Countdown Timer with Moroccan Arabic Sublabels
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let timerInterval = null

function countdownArabicLabel(key) {
  const map = { Hari: 'Ayyam', Jam: "Sa'at", Menit: 'Daqaiq', Detik: 'Thawani' }
  return map[key] || ''
}

function updateCountdown() {
  const targetDateStr = mainEventDate.value
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

// Love Stories
const mockStories = [
  {
    title: "Ta'aruf & Perjumpaan Pertama",
    date: 'Januari 2024',
    description: 'Atas petunjuk Allah dan perantara silaturahmi keluarga, dua hati dipertemukan dalam niat mulia membangun mahligai sakinah.',
  },
  {
    title: 'Khitbah (Peminangan)',
    date: 'Maret 2025',
    description: 'Keluarga besar bersua dalam majelis khitbah yang penuh hangat, mengikat janji suci di hadapan sanak keluarga dan para sesepuh.',
  },
  {
    title: "Walimatul 'Ursy (Pernikahan)",
    date: 'November 2026',
    description: 'Melangkah bersama dalam ridho Ilahi menuju babak baru yang penuh berkah, mawaddah, wa rahmah.',
  },
]

const activeStories = computed(() => {
  return data.value.loveStory?.length ? data.value.loveStory : mockStories
})

// Gallery Images
const galleryImages = computed(() => {
  if (Array.isArray(data.value.galleryImages) && data.value.galleryImages.length) {
    return data.value.galleryImages.map((img) =>
      typeof img === 'object' && img?.src ? img : { src: String(img || ''), thumbnail: String(img || '') },
    )
  }
  // Moroccan desert & luxury bridal samples
  return [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80' },
    { src: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=80' },
    { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80' },
  ]
})

// Bank Accounts & Gifts
const bankAccountsList = computed(() => {
  if (Array.isArray(data.value.bankAccounts) && data.value.bankAccounts.length) {
    return data.value.bankAccounts
  }
  return [
    { bankName: 'Bank Syariah Indonesia (BSI)', accountNumber: '7123456789', accountHolder: 'Fauzan Al-Farisi' },
    { bankName: 'Bank Mandiri', accountNumber: '1400012345678', accountHolder: 'Yasmin Zahirah' },
  ]
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
      }
    })
    .filter(Boolean)
})

const giftAddresses = computed(() => {
  const raw = data.value.giftDeliveryAddress
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  return list.map((a) => String(a || '').trim()).filter(Boolean)
})

// Extended Family
const normalizedExtendedFamily = computed(() => {
  const ef = data.value.extendedFamily
  if (Array.isArray(ef) && ef.length) return ef
  const tm = data.value.turutMengundang
  if (typeof tm === 'string' && tm.trim()) {
    return tm.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
  }
  return []
})

// RSVP state
const rsvp = ref({
  name: data.value.guestName || '',
  attendance: 'hadir',
  totalGuests: 1,
  message: '',
})

const guestMessages = ref([])

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
    details: `Undangan Pernikahan ${title}`,
    location: location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function sanitizeHandle(h) {
  if (!h) return ''
  return h.replace(/^@/, '').trim()
}

function getInstagramUrl(h) {
  return `https://instagram.com/${sanitizeHandle(h)}`
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Berhasil disalin ke papan klip!')
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
        name: 'Ustadz Ahmad & Keluarga',
        message: 'Barakallahu lakuma wa baraka alaika wa jamaa bainakuma fii khoir. Semoga sakinah mawaddah wa rahmah selamanya.',
        attendance: 'hadir',
      },
      {
        name: 'Dr. Malik Ibrahim',
        message: 'Selamat menempuh hidup baru sahabatku. Semoga senantiasa dipenuhi keberkahan dan kebahagiaan.',
        attendance: 'hadir',
      },
      {
        name: 'Keluarga Besar Al-Mansyur',
        message: 'Alhamdulillah, turut bersukacita atas pernikahan ananda berdua. Semoga berkah dunia dan akhirat.',
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
      totalGuests: rsvp.value.totalGuests,
    })
    toast.success('Terima kasih! Konfirmasi & doa Anda telah terkirim.')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Gagal mengirim ucapan, silakan coba lagi.')
  } finally {
    submittingRsvp.value = false
  }
}

// Local IntersectionObserver directive
const vObserve = {
  mounted(el) {
    el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-8')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8')
            entry.target.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(entry.target)
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Marcellus&family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap');

.font-amiri {
  font-family: 'Amiri', serif;
}

.font-marcellus {
  font-family: 'Marcellus', serif;
}

/* Moroccan Fanous Sway Animation */
@keyframes sway-left {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-3.5deg);
  }
}

@keyframes sway-right {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(3.5deg);
  }
}

.animate-sway-left {
  animation: sway-left 6s ease-in-out infinite;
}

.animate-sway-right {
  animation: sway-right 7s ease-in-out infinite;
}

/* Gate Fade Transition */
.gate-fade-leave-active {
  transition: all 1.2s cubic-bezier(0.65, 0, 0.35, 1);
}

.gate-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(12px);
}

/* Hide scrollbars */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
