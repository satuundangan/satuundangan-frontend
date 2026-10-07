<template>
  <div class="relative min-h-screen bg-[#140205] overflow-hidden font-serif no-scrollbar text-[#fbf8ee] selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">

    <!-- Background Texture & Songket Lepus Benang Emas Grid Overlay -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-25 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

    <!-- Authentic Songket Lepus Gold Thread Diamond Grid (Bunga Intan & Pucuk Rebung) -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15"
      style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1.5px), repeating-linear-gradient(45deg, transparent 0 14px, #430a13 14px 15px, transparent 15px 30px), repeating-linear-gradient(-45deg, transparent 0 14px, #b8860b 14px 15px, transparent 15px 30px); background-size: 32px 32px;"
    ></div>

    <!-- Ambient Maroon & Royal Sriwijaya Gold Radial Glows -->
    <div class="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-[#430a13]/35 blur-[120px] pointer-events-none z-0"></div>
    <div class="fixed -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#b8860b]/25 blur-[140px] pointer-events-none z-0"></div>
    <div class="fixed top-1/3 -right-32 w-80 h-80 rounded-full bg-[#430a13]/25 blur-[110px] pointer-events-none z-0"></div>

    <!-- SVG Siluet Atap Rumah Limas Palembang (Watermark Backdrop) -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] md:w-[700px] pointer-events-none opacity-[0.045] z-0 select-none text-[#d4af37]">
      <svg viewBox="0 0 600 320" fill="currentColor" class="w-full h-auto drop-shadow-[0_0_35px_rgba(212,175,55,0.25)]">
        <!-- Central Kemuncak / Finial Spire -->
        <path d="M 300 8 L 303 36 L 297 36 Z" />
        <circle cx="300" cy="10" r="4.5" />
        <circle cx="300" cy="22" r="3.5" />
        <!-- Simbar Crests (Acanthus Horns / Lebah Bergayut apex) -->
        <path d="M 300 36 C 290 20 270 18 260 26 C 275 30 288 38 296 42 Z" />
        <path d="M 300 36 C 310 20 330 18 340 26 C 325 30 312 38 304 42 Z" />

        <!-- Tier 1: Topmost Limas peak -->
        <polygon points="300,38 265,75 335,75" />
        <rect x="255" y="75" width="90" height="4" rx="2" />

        <!-- Tier 2: Bengkilas Upper Roof -->
        <polygon points="300,72 225,125 375,125" />
        <rect x="215" y="125" width="170" height="5" rx="2.5" />

        <!-- Tier 3: Main Limas Body -->
        <polygon points="300,120 175,182 425,182" />
        <!-- Eave Flairs -->
        <path d="M 175 182 Q 165 184 158 176 Q 166 188 178 187 Z" />
        <path d="M 425 182 Q 435 184 442 176 Q 434 188 422 187 Z" />
        <rect x="158" y="186" width="284" height="6" rx="3" />

        <!-- Tier 4: Grand Lower Limas Eaves (Gajah Menyusu) -->
        <polygon points="300,182 95,242 505,242" />
        <path d="M 95 242 Q 85 244 76 234 Q 86 250 98 248 Z" />
        <path d="M 505 242 Q 515 244 524 234 Q 514 250 502 248 Z" />
        <rect x="76" y="246" width="448" height="8" rx="4" />

        <!-- Lebah Bergayut carved droplet accents -->
        <g opacity="0.85">
          <circle cx="115" cy="256" r="2.5" />
          <circle cx="155" cy="256" r="2.5" />
          <circle cx="195" cy="256" r="2.5" />
          <circle cx="235" cy="256" r="2.5" />
          <circle cx="275" cy="256" r="2.5" />
          <circle cx="325" cy="256" r="2.5" />
          <circle cx="365" cy="256" r="2.5" />
          <circle cx="405" cy="256" r="2.5" />
          <circle cx="445" cy="256" r="2.5" />
          <circle cx="485" cy="256" r="2.5" />
        </g>

        <!-- Base Wall & Carved Railings (Pilis / Terali Tembus) -->
        <rect x="110" y="254" width="380" height="38" rx="3" fill="none" stroke="currentColor" stroke-width="2" />
        <rect x="140" y="260" width="50" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
        <rect x="220" y="260" width="50" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
        <rect x="330" y="260" width="50" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
        <rect x="410" y="260" width="50" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
        <rect x="282" y="258" width="36" height="34" rx="2" fill="none" stroke="currentColor" stroke-width="2" />

        <!-- Stilt Foundation Pillars (Tiang Ulin Rumah Adat) -->
        <rect x="120" y="292" width="12" height="24" rx="1" />
        <rect x="180" y="292" width="12" height="24" rx="1" />
        <rect x="240" y="292" width="12" height="24" rx="1" />
        <rect x="300" y="292" width="12" height="24" rx="1" />
        <rect x="360" y="292" width="12" height="24" rx="1" />
        <rect x="420" y="292" width="12" height="24" rx="1" />
        <rect x="470" y="292" width="12" height="24" rx="1" />
      </svg>
    </div>

    <!-- Fixed Palembang Songket Lepus Corner Ornaments (z-40 pointer-events-none) -->
    <!-- Top-Left Corner -->
    <div class="fixed top-0 left-0 w-24 h-24 md:w-36 md:h-36 z-40 opacity-90 pointer-events-none select-none text-[#d4af37]">
      <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]">
        <path d="M 0,0 L 100,0 C 75,10 55,25 40,45 C 25,65 10,85 0,100 Z" opacity="0.18" />
        <path d="M 0,0 L 75,0 C 55,15 38,32 28,52 C 18,72 10,88 0,75 Z" fill="none" stroke="currentColor" stroke-width="1.8" />
        <path d="M 4,4 L 50,4 C 36,15 25,26 18,40 C 10,54 4,64 4,50 Z" fill="none" stroke="#f3e5ab" stroke-width="1" stroke-dasharray="3,2" />
        <!-- Pucuk Rebung Triangles -->
        <polygon points="12,12 30,16 16,30" fill="currentColor" />
        <polygon points="14,14 26,17 17,26" fill="#430a13" />
        <polygon points="28,15 45,19 32,32" opacity="0.75" fill="currentColor" />
        <polygon points="15,28 19,45 32,32" opacity="0.75" fill="currentColor" />
        <!-- Sriwijaya Golden Vine / Sulur Melati -->
        <path d="M 22,22 C 38,32 50,22 62,35 C 50,48 35,42 22,62" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        <circle cx="62" cy="35" r="3" fill="#fff4c2" />
        <circle cx="22" cy="62" r="3" fill="#fff4c2" />
        <circle cx="38" cy="38" r="2" fill="#d4af37" />
        <circle cx="8" cy="8" r="3" fill="#fff4c2" />
        <circle cx="60" cy="10" r="2.2" fill="currentColor" />
        <circle cx="10" cy="60" r="2.2" fill="currentColor" />
      </svg>
    </div>

    <!-- Bottom-Right Corner (Rotated 180 deg) -->
    <div class="fixed bottom-0 right-0 w-24 h-24 md:w-36 md:h-36 z-40 opacity-90 pointer-events-none select-none rotate-180 text-[#d4af37]">
      <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]">
        <path d="M 0,0 L 100,0 C 75,10 55,25 40,45 C 25,65 10,85 0,100 Z" opacity="0.18" />
        <path d="M 0,0 L 75,0 C 55,15 38,32 28,52 C 18,72 10,88 0,75 Z" fill="none" stroke="currentColor" stroke-width="1.8" />
        <path d="M 4,4 L 50,4 C 36,15 25,26 18,40 C 10,54 4,64 4,50 Z" fill="none" stroke="#f3e5ab" stroke-width="1" stroke-dasharray="3,2" />
        <polygon points="12,12 30,16 16,30" fill="currentColor" />
        <polygon points="14,14 26,17 17,26" fill="#430a13" />
        <polygon points="28,15 45,19 32,32" opacity="0.75" fill="currentColor" />
        <polygon points="15,28 19,45 32,32" opacity="0.75" fill="currentColor" />
        <path d="M 22,22 C 38,32 50,22 62,35 C 50,48 35,42 22,62" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        <circle cx="62" cy="35" r="3" fill="#fff4c2" />
        <circle cx="22" cy="62" r="3" fill="#fff4c2" />
        <circle cx="38" cy="38" r="2" fill="#d4af37" />
        <circle cx="8" cy="8" r="3" fill="#fff4c2" />
        <circle cx="60" cy="10" r="2.2" fill="currentColor" />
        <circle cx="10" cy="60" r="2.2" fill="currentColor" />
      </svg>
    </div>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#28050b"
      accentColor="#d4af37"
      :autoPlay="!showWelcome"
    />

    <!-- Floating Bottom Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#28050b]/90 backdrop-blur-xl border border-[#d4af37]/45 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.85)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
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
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d4af37] transition-all"
            :class="activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen / Pintu Gerbang Kesultanan Palembang -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#430a13] via-[#28050b] to-[#140205] transition-all duration-1000"
      >
        <!-- Golden Songket Border Frame -->
        <div class="absolute inset-4 md:inset-8 border border-[#d4af37]/40 rounded-3xl pointer-events-none shadow-[inset_0_0_50px_rgba(212,175,55,0.18)]">
          <div class="absolute inset-1.5 border border-[#d4af37]/20 rounded-[22px]"></div>
          <!-- Corner flourishes -->
          <div class="absolute top-2 left-2 text-[#d4af37]/70 text-xs">◆</div>
          <div class="absolute top-2 right-2 text-[#d4af37]/70 text-xs">◆</div>
          <div class="absolute bottom-2 left-2 text-[#d4af37]/70 text-xs">◆</div>
          <div class="absolute bottom-2 right-2 text-[#d4af37]/70 text-xs">◆</div>
        </div>

        <div class="relative z-10 space-y-6 md:space-y-7 animate-fade-in-up max-w-lg mx-auto py-8">
          <!-- MAHKOTA AESAN GEDE / KEMBANG GOYANG GANDIK VECTOR ORNAMENT -->
          <div class="flex justify-center max-w-xs mx-auto">
            <svg class="w-24 h-24 md:w-32 md:h-32 text-[#d4af37] filter drop-shadow-[0_4px_22px_rgba(212,175,55,0.55)] animate-pulse" viewBox="0 0 200 180" fill="currentColor">
              <defs>
                <linearGradient id="aesanGoldGradWelcome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fff4c2" />
                  <stop offset="35%" stop-color="#d4af37" />
                  <stop offset="70%" stop-color="#b8860b" />
                  <stop offset="100%" stop-color="#734d05" />
                </linearGradient>
                <radialGradient id="gemGlowWelcome" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="50%" stop-color="#e2264d" />
                  <stop offset="100%" stop-color="#700618" />
                </radialGradient>
              </defs>

              <!-- Gandik (Golden Headband Base) -->
              <path d="M 40 145 C 70 125, 130 125, 160 145 C 130 135, 70 135, 40 145 Z" fill="url(#aesanGoldGradWelcome)" />
              <path d="M 35 152 C 70 132, 130 132, 165 152 C 130 140, 70 140, 35 152 Z" fill="url(#aesanGoldGradWelcome)" opacity="0.9" />

              <!-- Headband bead accents -->
              <g fill="#f3e5ab">
                <circle cx="50" cy="144" r="2.5" />
                <circle cx="65" cy="140" r="2.5" />
                <circle cx="80" cy="137" r="2.5" />
                <circle cx="100" cy="136" r="3" />
                <circle cx="120" cy="137" r="2.5" />
                <circle cx="135" cy="140" r="2.5" />
                <circle cx="150" cy="144" r="2.5" />
              </g>

              <!-- Central Lotus Crest (Teratai Sriwijaya) -->
              <ellipse cx="100" cy="120" rx="14" ry="10" fill="url(#aesanGoldGradWelcome)" />
              <ellipse cx="100" cy="120" rx="6" ry="6" fill="url(#gemGlowWelcome)" />
              <path d="M 100 102 C 92 110 94 120 100 124 C 106 120 108 110 100 102 Z" fill="url(#aesanGoldGradWelcome)" />
              <path d="M 85 110 C 85 120 92 124 100 124 C 95 116 90 110 85 110 Z" fill="url(#aesanGoldGradWelcome)" />
              <path d="M 115 110 C 115 120 108 124 100 124 C 105 116 110 110 115 110 Z" fill="url(#aesanGoldGradWelcome)" />

              <!-- Central Spire Sprig -->
              <path d="M 98 105 L 100 30 L 102 105 Z" fill="url(#aesanGoldGradWelcome)" />
              <circle cx="100" cy="24" r="7" fill="#fff4c2" />
              <circle cx="100" cy="24" r="3.5" fill="url(#gemGlowWelcome)" />
              <circle cx="100" cy="12" r="4" fill="url(#aesanGoldGradWelcome)" />
              <circle cx="100" cy="4" r="2.5" fill="#fff4c2" />

              <!-- Radiating Kembang Goyang Stems -->
              <g stroke="url(#aesanGoldGradWelcome)" stroke-width="2.5" stroke-linecap="round">
                <line x1="96" y1="115" x2="82" y2="40" />
                <line x1="104" y1="115" x2="118" y2="40" />
                <line x1="92" y1="120" x2="64" y2="52" />
                <line x1="108" y1="120" x2="136" y2="52" />
                <line x1="88" y1="125" x2="48" y2="70" />
                <line x1="112" y1="125" x2="152" y2="70" />
                <line x1="82" y1="130" x2="34" y2="92" />
                <line x1="118" y1="130" x2="166" y2="92" />
                <line x1="75" y1="135" x2="24" y2="115" />
                <line x1="125" y1="135" x2="176" y2="115" />
              </g>

              <!-- Golden Flower Heads (Cempaka Emas) -->
              <circle cx="82" cy="38" r="6" fill="#fff4c2" />
              <circle cx="82" cy="38" r="3" fill="#b8860b" />
              <circle cx="118" cy="38" r="6" fill="#fff4c2" />
              <circle cx="118" cy="38" r="3" fill="#b8860b" />

              <circle cx="64" cy="50" r="5.5" fill="url(#aesanGoldGradWelcome)" />
              <circle cx="64" cy="50" r="2.5" fill="#fff4c2" />
              <circle cx="136" cy="50" r="5.5" fill="url(#aesanGoldGradWelcome)" />
              <circle cx="136" cy="50" r="2.5" fill="#fff4c2" />

              <circle cx="48" cy="68" r="5" fill="#fff4c2" />
              <circle cx="48" cy="68" r="2" fill="#700618" />
              <circle cx="152" cy="68" r="5" fill="#fff4c2" />
              <circle cx="152" cy="68" r="2" fill="#700618" />

              <circle cx="34" cy="90" r="4.5" fill="url(#aesanGoldGradWelcome)" />
              <circle cx="166" cy="90" r="4.5" fill="url(#aesanGoldGradWelcome)" />

              <circle cx="24" cy="113" r="4" fill="#fff4c2" />
              <circle cx="176" cy="113" r="4" fill="#fff4c2" />

              <!-- Sumping & Kote-kote Pendants -->
              <g fill="url(#aesanGoldGradWelcome)">
                <circle cx="30" cy="155" r="3" />
                <circle cx="28" cy="163" r="2.5" />
                <circle cx="26" cy="170" r="2" />
                <path d="M 25 172 L 27 172 L 26 179 Z" />

                <circle cx="170" cy="155" r="3" />
                <circle cx="172" cy="163" r="2.5" />
                <circle cx="174" cy="170" r="2" />
                <path d="M 173 172 L 175 172 L 174 179 Z" />
              </g>
            </svg>
          </div>

          <div class="space-y-2">
            <p class="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#d4af37] font-sans font-bold">
              Walimatul 'Ursy · Adat Palembang
            </p>
            <h1 class="text-4xl md:text-5xl font-serif text-[#fbf8ee] drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)] leading-tight">
              {{ groomShortName }}
              <span class="text-2xl md:text-3xl text-[#d4af37] block my-1 font-serif">&amp;</span>
              {{ brideShortName }}
            </h1>
            <p class="text-xs text-[#d6b094] uppercase tracking-widest font-sans">Aesan Gede · Kemegahan Kerajaan Sriwijaya</p>
          </div>

          <!-- Guest Badge Card -->
          <div class="my-6 p-5 md:p-6 border border-[#d4af37]/40 bg-[#28050b]/85 backdrop-blur-md rounded-2xl max-w-xs mx-auto shadow-2xl space-y-2">
            <p class="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Kapado Yth Bapak/Ibu/Sanak Dulur
            </p>
            <p class="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
            <p class="text-[10px] text-[#d6b094] font-sans italic">
              Di Tempat
            </p>
          </div>

          <!-- Open Invitation Button -->
          <button
            @click="openInvitation"
            class="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#b8860b] text-[#140205] rounded-full font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all duration-300 inline-flex items-center gap-2 group cursor-pointer"
          >
            <i class="fa-solid fa-envelope-open transition-transform group-hover:scale-110"></i>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN INVITATION CONTENT -->
    <div id="main-content" :class="{ 'opacity-0': showWelcome }" class="transition-opacity duration-1000">

      <!-- HERO SECTION -->
      <header id="home" class="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 overflow-hidden">
        <!-- SVG Siluet Atap Rumah Limas Header Accent -->
        <div class="w-32 md:w-44 text-[#d4af37] mx-auto mb-4 opacity-85">
          <svg viewBox="0 0 500 220" fill="currentColor" class="w-full h-auto drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">
            <path d="M 250 10 L 252 35 L 248 35 Z" />
            <circle cx="250" cy="12" r="5" />
            <polygon points="250,38 220,72 280,72" />
            <rect x="210" y="72" width="80" height="4" rx="2" />
            <polygon points="250,70 180,120 320,120" />
            <rect x="170" y="120" width="160" height="5" rx="2.5" />
            <polygon points="250,118 130,172 370,172" />
            <rect x="120" y="172" width="260" height="6" rx="3" />
            <polygon points="250,170 70,215 430,215" />
            <rect x="55" y="215" width="390" height="7" rx="3.5" />
          </svg>
        </div>

        <div class="space-y-4 max-w-2xl mx-auto z-10" v-observe>
          <p class="text-xs uppercase tracking-[0.4em] text-[#d4af37] font-sans font-bold">
            Walimatul 'Ursy
          </p>
          <p class="text-xs md:text-sm text-[#d6b094] uppercase tracking-widest font-sans">
            Pernikahan Adat Palembang · Aesan Gede
          </p>

          <h1 class="text-5xl md:text-7xl font-serif text-[#fbf8ee] drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)] py-2 leading-tight">
            {{ groomShortName }}
            <span class="text-3xl md:text-5xl text-[#d4af37] block md:inline md:mx-4 font-serif">&amp;</span>
            {{ brideShortName }}
          </h1>

          <p class="text-base md:text-xl text-[#f3e5ab] font-sans font-semibold tracking-wide">
            {{ weddingFormattedDate }}
          </p>

          <!-- SVG Border Songket Ribbon Divider -->
          <div class="py-4 max-w-md mx-auto opacity-75">
            <svg viewBox="0 0 400 24" fill="currentColor" class="w-full h-auto text-[#d4af37]">
              <line x1="0" y1="12" x2="160" y2="12" stroke="currentColor" stroke-width="1.5" />
              <polygon points="175,12 185,5 195,12 185,19" fill="#f3e5ab" />
              <polygon points="200,12 210,3 220,12 210,21" fill="currentColor" />
              <polygon points="225,12 235,5 245,12 235,19" fill="#f3e5ab" />
              <line x1="260" y1="12" x2="400" y2="12" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </div>

          <!-- COUNTDOWN TIMER -->
          <div class="pt-4 max-w-lg mx-auto">
            <p class="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-sans font-semibold mb-3">
              Menghitung Hari Menuju Hari Bahagia
            </p>
            <div class="grid grid-cols-4 gap-2.5 sm:gap-4">
              <div
                v-for="(val, label) in countdown"
                :key="label"
                class="p-3 sm:p-4 rounded-2xl border border-[#d4af37]/40 bg-[#28050b]/80 backdrop-blur-md text-center shadow-[0_4px_18px_rgba(0,0,0,0.6)]"
              >
                <div class="text-2xl sm:text-4xl font-bold font-serif text-[#f3e5ab]">{{ val }}</div>
                <div class="text-[9px] sm:text-[10px] uppercase font-sans tracking-widest text-[#d6b094] mt-1">{{ label }}</div>
              </div>
            </div>
          </div>

          <!-- Simpan ke Kalender Hero Button -->
          <div class="pt-6">
            <a
              :href="getCalendarUrl('Pernikahan ' + groomShortName + ' & ' + brideShortName, weddingTargetDate, data.resepsiLocation?.locationName || data.akadLocation?.locationName)"
              target="_blank"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37]/60 bg-[#28050b]/60 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#140205] transition-all text-xs font-sans uppercase tracking-widest font-semibold shadow-lg"
            >
              <i class="fa-regular fa-calendar-plus"></i> Simpan ke Kalender
            </a>
          </div>
        </div>

        <!-- Scroll down indicator -->
        <div class="absolute bottom-6 inset-x-0 mx-auto text-center pointer-events-none opacity-60 animate-bounce">
          <i class="fa-solid fa-chevron-down text-[#d4af37] text-sm"></i>
        </div>
      </header>

      <!-- QUOTE & PANTUN PALEMBANG SECTION -->
      <section class="py-20 md:py-28 px-6 bg-[#200409] relative overflow-hidden" v-observe>
        <div class="max-w-3xl mx-auto space-y-10 relative z-10 text-center">

          <!-- Quranic Verse (QS. Ar-Rum: 21) -->
          <div class="space-y-4 p-8 md:p-10 border border-[#d4af37]/35 rounded-3xl bg-[#28050b]/75 backdrop-blur-sm shadow-xl relative">
            <div class="text-[#d4af37] text-2xl mb-2">﷽</div>
            <p class="font-serif italic text-base md:text-lg text-[#fbf8ee] leading-relaxed">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <p class="text-xs uppercase tracking-widest text-[#d4af37] font-sans font-bold">
              (QS. Ar-Rum: 21)
            </p>
          </div>

          <!-- Authentic Pantun Palembang Adat Sriwijaya -->
          <div class="p-8 md:p-10 border border-[#d4af37]/30 rounded-3xl bg-gradient-to-b from-[#28050b]/90 to-[#140205]/90 shadow-2xl relative">
            <div class="flex justify-center mb-4 text-[#d4af37]">
              <!-- Songket Rebung mini crest -->
              <svg viewBox="0 0 60 30" fill="currentColor" class="w-10 h-5">
                <polygon points="30,2 40,22 20,22" />
                <polygon points="12,10 18,24 6,24" />
                <polygon points="48,10 54,24 42,24" />
              </svg>
            </div>
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold mb-4">
              Pantun Adat Palembang
            </p>
            <div class="space-y-2 font-serif text-sm md:text-base text-[#fbf8ee] italic leading-relaxed">
              <p>Bukan keno pantun berlayang, keno budi bahaso nan elok.</p>
              <p>Bukan keno intan gemilang, keno asih suci nan tertambat elok.</p>
              <p class="pt-2 text-[#f3e5ab]">Tepian Musi beriak tenang, perahu rakit kanti sejalan,</p>
              <p class="text-[#f3e5ab]">Dua hati kini bersanding senang, merajut berkah dalam ikatan.</p>
            </div>
            <div class="w-16 h-px bg-[#d4af37]/40 mx-auto mt-6"></div>
          </div>
        </div>
      </section>

      <!-- PROFIL MEMPELAI (KANTI SEKATO / PENGANTEN) -->
      <section id="couple" class="py-24 md:py-32 px-6 bg-[#180306] relative" v-observe>
        <div class="max-w-5xl mx-auto space-y-16">

          <!-- Section Heading -->
          <div class="text-center space-y-3">
            <!-- Ornamen Mahkota Aesan Gede Mini -->
            <div class="flex justify-center text-[#d4af37] mb-2">
              <svg class="w-12 h-10" viewBox="0 0 100 80" fill="currentColor">
                <path d="M 20 65 Q 50 50 80 65 Q 50 56 20 65 Z" />
                <line x1="50" y1="45" x2="50" y2="12" stroke="currentColor" stroke-width="2" />
                <circle cx="50" cy="10" r="3.5" fill="#f3e5ab" />
                <line x1="42" y1="50" x2="32" y2="18" stroke="currentColor" stroke-width="1.5" />
                <circle cx="32" cy="18" r="3" fill="#f3e5ab" />
                <line x1="58" y1="50" x2="68" y2="18" stroke="currentColor" stroke-width="1.5" />
                <circle cx="68" cy="18" r="3" fill="#f3e5ab" />
              </svg>
            </div>
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Kanti Sekato · Mempelai
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">
              Penganten Berdua
            </h2>
            <p class="text-xs md:text-sm text-[#d6b094] max-w-lg mx-auto font-sans leading-relaxed">
              Maha Suci Allah yang telah mempertemukan kami dalam ikatan pernikahan yang agung nan penuh berkah.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

            <!-- MEMPELAI PRIA (PENGANTEN PRIA) -->
            <div class="space-y-6 text-center group">
              <!-- Photo with Royal Songket Golden Frame -->
              <div class="relative w-56 h-72 sm:w-64 sm:h-80 mx-auto rounded-3xl p-2.5 border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#430a13] to-[#28050b] shadow-[0_10px_35px_rgba(0,0,0,0.7)] group-hover:border-[#f3e5ab] transition-all duration-500">
                <div class="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    :src="groomPhoto"
                    :alt="data.groomName"
                    class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <!-- Inner Gradient Vignette -->
                  <div class="absolute inset-0 bg-gradient-to-t from-[#140205]/70 via-transparent to-transparent"></div>
                </div>
                <!-- Corner Pins -->
                <div class="absolute top-1 left-1 text-[#d4af37] text-xs">◆</div>
                <div class="absolute top-1 right-1 text-[#d4af37] text-xs">◆</div>
                <div class="absolute bottom-1 left-1 text-[#d4af37] text-xs">◆</div>
                <div class="absolute bottom-1 right-1 text-[#d4af37] text-xs">◆</div>
              </div>

              <div class="space-y-2">
                <p class="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">
                  Penganten Pria
                </p>
                <h3 class="text-2xl md:text-3xl font-serif font-bold text-[#fbf8ee]">
                  {{ data.groomName || 'Muhammad Fadhil Al-Farizi, S.T.' }}
                </h3>
                <p v-if="data.groomTitle" class="text-xs text-[#d4af37] font-sans">
                  {{ data.groomTitle }}
                </p>
                <div class="pt-2 text-xs md:text-sm text-[#d6b094] font-sans space-y-1">
                  <p>Putra dari Pasangan Terhormat:</p>
                  <p class="font-semibold text-[#fbf8ee]">
                    Bpk. {{ data.groomFather || 'Masagus H. Ahmad Syukri' }} &amp; Ibu {{ data.groomMother || 'Hj. Syarifah Aminah' }}
                  </p>
                </div>

                <div v-if="data.groomInstagram" class="pt-3">
                  <a
                    :href="'https://instagram.com/' + data.groomInstagram.replace('@', '')"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/50 text-xs text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#140205] transition-all font-sans font-medium"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.groomInstagram.replace('@', '') }}
                  </a>
                </div>
              </div>
            </div>

            <!-- MEMPELAI WANITA (PENGANTEN WANITA) -->
            <div class="space-y-6 text-center group">
              <!-- Photo with Royal Songket Golden Frame -->
              <div class="relative w-56 h-72 sm:w-64 sm:h-80 mx-auto rounded-3xl p-2.5 border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#430a13] to-[#28050b] shadow-[0_10px_35px_rgba(0,0,0,0.7)] group-hover:border-[#f3e5ab] transition-all duration-500">
                <div class="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    :src="bridePhoto"
                    :alt="data.brideName"
                    class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <!-- Inner Gradient Vignette -->
                  <div class="absolute inset-0 bg-gradient-to-t from-[#140205]/70 via-transparent to-transparent"></div>
                </div>
                <!-- Corner Pins -->
                <div class="absolute top-1 left-1 text-[#d4af37] text-xs">◆</div>
                <div class="absolute top-1 right-1 text-[#d4af37] text-xs">◆</div>
                <div class="absolute bottom-1 left-1 text-[#d4af37] text-xs">◆</div>
                <div class="absolute bottom-1 right-1 text-[#d4af37] text-xs">◆</div>
              </div>

              <div class="space-y-2">
                <p class="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-sans font-bold">
                  Penganten Wanita
                </p>
                <h3 class="text-2xl md:text-3xl font-serif font-bold text-[#fbf8ee]">
                  {{ data.brideName || 'Nyimas Raden Syarifah Azzahra, S.Ak.' }}
                </h3>
                <p v-if="data.brideTitle" class="text-xs text-[#d4af37] font-sans">
                  {{ data.brideTitle }}
                </p>
                <div class="pt-2 text-xs md:text-sm text-[#d6b094] font-sans space-y-1">
                  <p>Putri dari Pasangan Terhormat:</p>
                  <p class="font-semibold text-[#fbf8ee]">
                    Bpk. {{ data.brideFather || 'Raden H. Mahmud Badaruddin' }} &amp; Ibu {{ data.brideMother || 'Hj. Nyimas Rohana' }}
                  </p>
                </div>

                <div v-if="data.brideInstagram" class="pt-3">
                  <a
                    :href="'https://instagram.com/' + data.brideInstagram.replace('@', '')"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/50 text-xs text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#140205] transition-all font-sans font-medium"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.brideInstagram.replace('@', '') }}
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ACARA PERNIKAHAN (AKAD NIKAH / MUNGGAH & RESEPSI) -->
      <section id="event" class="py-24 md:py-32 px-6 bg-[#200409] relative" v-observe>
        <div class="max-w-5xl mx-auto space-y-16">

          <!-- Section Heading -->
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Rangkaian Acara
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">
              Akad &amp; Resepsi
            </h2>
            <p class="text-xs md:text-sm text-[#d6b094] max-w-lg mx-auto font-sans leading-relaxed">
              Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Bapak/Ibu/Sanak Dulur untuk menghadiri:
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            <!-- AKAD NIKAH (PROSESI MUNGGAH) -->
            <div
              v-if="data.akadLocation"
              class="p-8 sm:p-10 border border-[#d4af37]/45 rounded-3xl bg-[#28050b]/90 backdrop-blur-md space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group"
            >
              <!-- Songket Top Gold Strip -->
              <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37]"></div>

              <div class="space-y-4 text-center">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d4af37] bg-[#430a13]/80 text-[#f3e5ab] shadow-inner mx-auto">
                  <i class="fa-solid fa-ring text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">Akad Nikah</h3>
                <p class="text-[10px] uppercase font-sans tracking-widest text-[#d4af37] font-bold">
                  Prosesi Ijab Kabul &amp; Munggah
                </p>

                <div class="w-12 h-px bg-[#d4af37]/40 mx-auto"></div>

                <div class="space-y-1">
                  <p class="text-base md:text-lg text-[#f3e5ab] font-sans font-bold">
                    {{ formatDate(data.akadLocation.dateTime) }}
                  </p>
                  <p class="text-xs text-[#d6b094] font-sans">
                    {{ formatTime(data.akadLocation.dateTime) }}
                  </p>
                </div>

                <div class="pt-2 text-sm text-[#fbf8ee] leading-relaxed">
                  <p class="font-bold text-white">{{ data.akadLocation.locationName || 'Masjid Agung Sultan Mahmud Badaruddin I' }}</p>
                  <p class="text-xs text-[#d6b094] mt-1">{{ data.akadLocation.address || data.akadLocation.description || 'Kawasan 19 Ilir, Bukit Kecil, Palembang' }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  v-if="data.akadLocation.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#140205] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
                <a
                  :href="getCalendarUrl('Akad Nikah ' + groomShortName + ' & ' + brideShortName, data.akadLocation.dateTime, data.akadLocation.locationName)"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#430a13] text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#140205] transition-all text-xs font-sans uppercase tracking-widest font-semibold border border-[#d4af37]/50"
                >
                  <i class="fa-regular fa-calendar-plus"></i> Simpan Kalender
                </a>
              </div>
            </div>

            <!-- RESEPSI PERNIKAHAN (KEBESARAN ADAT PALEMBANG) -->
            <div
              v-if="data.resepsiLocation"
              class="p-8 sm:p-10 border border-[#d4af37]/45 rounded-3xl bg-[#28050b]/90 backdrop-blur-md space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group"
            >
              <!-- Songket Top Gold Strip -->
              <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab]"></div>

              <div class="space-y-4 text-center">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#d4af37] bg-[#430a13]/80 text-[#f3e5ab] shadow-inner mx-auto">
                  <i class="fa-solid fa-champagne-glasses text-xl"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">Resepsi Pernikahan</h3>
                <p class="text-[10px] uppercase font-sans tracking-widest text-[#d4af37] font-bold">
                  Resepsi Kebesaran Adat Palembang
                </p>

                <div class="w-12 h-px bg-[#d4af37]/40 mx-auto"></div>

                <div class="space-y-1">
                  <p class="text-base md:text-lg text-[#f3e5ab] font-sans font-bold">
                    {{ formatDate(data.resepsiLocation.dateTime) }}
                  </p>
                  <p class="text-xs text-[#d6b094] font-sans">
                    {{ formatTime(data.resepsiLocation.dateTime) }}
                  </p>
                </div>

                <div class="pt-2 text-sm text-[#fbf8ee] leading-relaxed">
                  <p class="font-bold text-white">{{ data.resepsiLocation.locationName || 'Grand Ballroom The Aryaduta Palembang' }}</p>
                  <p class="text-xs text-[#d6b094] mt-1">{{ data.resepsiLocation.address || data.resepsiLocation.description || 'Jl. POM IX, Palembang Square, Kota Palembang' }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  v-if="data.resepsiLocation.mapUrl"
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#140205] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
                <a
                  :href="getCalendarUrl('Resepsi ' + groomShortName + ' & ' + brideShortName, data.resepsiLocation.dateTime, data.resepsiLocation.locationName)"
                  target="_blank"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#430a13] text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#140205] transition-all text-xs font-sans uppercase tracking-widest font-semibold border border-[#d4af37]/50"
                >
                  <i class="fa-regular fa-calendar-plus"></i> Simpan Kalender
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- DRESS CODE / TATA BUSANA -->
      <section v-if="isSectionEnabled('dress-code') && data.dressCode" class="py-16 px-6 bg-[#140205] border-t border-[#d4af37]/25 text-center" v-observe>
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#d4af37]/35 rounded-2xl bg-[#28050b]/80 shadow-xl">
          <div class="text-[#d4af37]"><i class="fa-solid fa-shirt text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#fbf8ee]">Tata Busana / Dress Code</h3>
          <p class="text-xs md:text-sm text-[#fbf8ee] leading-relaxed font-sans">
            {{ data.dressCode }}
          </p>
          <p class="text-[10px] text-[#d6b094] font-sans italic">
            Nuansa Songket Palembang / Tradisional / Formal Elegan (Maroon, Royal Gold &amp; Ruby)
          </p>
        </div>
      </section>

      <!-- LIVE STREAMING / VIDEO PREWEDDING -->
      <section
        v-if="isSectionEnabled('video') && (data.youtubeVideoUrl || data.liveStreamingLink || data.liveStreamingUrl)"
        class="py-20 px-6 bg-[#180306] text-center"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-6">
          <div class="text-[#d4af37]"><i class="fa-solid fa-video text-3xl"></i></div>
          <h3 class="text-3xl font-serif text-[#fbf8ee]">Momen Bahagia &amp; Siaran Langsung</h3>
          <p class="text-xs md:text-sm text-[#d6b094] max-w-lg mx-auto font-sans leading-relaxed">
            Bagi keluarga dan sanak dulur yang berhalangan hadir secara langsung, silakan menyaksikan prosesi sakral kami:
          </p>

          <div v-if="data.youtubeVideoUrl" class="aspect-video w-full rounded-3xl overflow-hidden border-2 border-[#d4af37]/50 shadow-2xl">
            <iframe
              :src="getEmbedUrlVideo(data.youtubeVideoUrl)"
              class="w-full h-full"
              allowfullscreen
              frameborder="0"
            ></iframe>
          </div>

          <div v-if="data.liveStreamingLink || data.liveStreamingUrl" class="pt-2">
            <a
              :href="data.liveStreamingLink || data.liveStreamingUrl"
              target="_blank"
              class="inline-flex items-center gap-2 px-8 py-3 bg-[#d4af37] text-[#140205] rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg"
            >
              <i class="fa-brands fa-youtube text-base"></i> Tonton Siaran Langsung
            </a>
          </div>
        </div>
      </section>

      <!-- LOVE STORY TIMELINE -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 md:py-32 px-6 bg-[#200409]" v-observe>
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Kisah Kasih &amp; Jalinan Asmara
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">
              Perjalanan Dua Hati
            </h2>
          </div>

          <!-- Timeline Track -->
          <div class="relative border-l-2 border-[#d4af37]/40 ml-4 md:ml-32 space-y-12 py-4">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="idx"
              class="relative pl-8 md:pl-12 group"
            >
              <!-- Glowing Golden Teratai Pin -->
              <div class="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#430a13] border-2 border-[#d4af37] flex items-center justify-center text-[#f3e5ab] text-xs shadow-md">
                ◆
              </div>

              <div class="p-6 md:p-8 rounded-3xl border border-[#d4af37]/35 bg-[#28050b]/80 backdrop-blur-sm space-y-3 shadow-xl transition-all duration-300 group-hover:border-[#f3e5ab]">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <h4 class="text-xl md:text-2xl font-serif font-bold text-[#fbf8ee]">{{ story.title }}</h4>
                  <span class="text-xs px-3 py-1 rounded-full bg-[#430a13] text-[#f3e5ab] font-sans font-bold border border-[#d4af37]/40">
                    {{ story.year || story.date }}
                  </span>
                </div>
                <p class="text-xs md:text-sm text-[#d6b094] font-sans leading-relaxed">{{ story.description }}</p>
                <div v-if="story.image" class="pt-2 rounded-xl overflow-hidden max-h-60">
                  <img :src="story.image" :alt="story.title" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- GALERI FOTO -->
      <section id="gallery" v-if="isSectionEnabled('gallery')" class="py-24 md:py-32 px-6 bg-[#180306]" v-observe>
        <div class="max-w-5xl mx-auto space-y-12">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Galeri Momen
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">
              Potret Kebahagiaan
            </h2>
            <p class="text-xs md:text-sm text-[#d6b094] max-w-lg mx-auto font-sans leading-relaxed">
              Koleksi kenangan indah dalam balutan adat megah Palembang dan nuansa romantis cinta kami.
            </p>
          </div>

          <!-- Gallery Component -->
          <div class="rounded-3xl p-4 md:p-8 border border-[#d4af37]/35 bg-[#28050b]/60 backdrop-blur-md shadow-2xl">
            <GalleryInvitation :images="galleryImages" />
          </div>
        </div>
      </section>

      <!-- AMPLOP DIGITAL & KIRIM KADO -->
      <section id="gift" v-if="isSectionEnabled('gift')" class="py-24 md:py-32 px-6 bg-[#200409] relative" v-observe>
        <div class="max-w-4xl mx-auto space-y-14">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Tanda Kasih
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">
              Amplop Digital &amp; Kado
            </h2>
            <p class="text-xs md:text-sm text-[#d6b094] max-w-lg mx-auto font-sans leading-relaxed">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, silakan melalui saluran berikut:
            </p>
          </div>

          <!-- Rekening Bank Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(bank, idx) in displayBankAccounts"
              :key="idx"
              class="p-6 md:p-8 rounded-3xl border border-[#d4af37]/45 bg-[#28050b]/90 backdrop-blur-md space-y-4 shadow-xl text-center relative overflow-hidden"
            >
              <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
              <div class="w-12 h-12 rounded-full border border-[#d4af37] bg-[#430a13] text-[#f3e5ab] flex items-center justify-center mx-auto text-xl">
                <i class="fa-solid fa-credit-card"></i>
              </div>
              <div>
                <h4 class="text-lg font-serif font-bold text-[#fbf8ee]">{{ bank.bank_name || 'Bank Transfer' }}</h4>
                <p class="text-xl md:text-2xl font-mono text-[#f3e5ab] font-bold tracking-wider my-1">
                  {{ bank.account_number }}
                </p>
                <p class="text-xs text-[#d6b094] font-sans">a.n {{ bank.account_holder }}</p>
              </div>

              <button
                @click="copyToClipboard(bank.account_number)"
                class="w-full py-2.5 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#140205] transition-all text-xs font-sans uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <i class="fa-regular fa-copy"></i> Salin Nomor Rekening
              </button>
            </div>
          </div>

          <!-- Kirim Kado Fisik -->
          <div v-if="giftAddresses.length" class="p-8 rounded-3xl border border-[#d4af37]/35 bg-[#28050b]/80 text-center space-y-4 shadow-xl">
            <div class="text-[#d4af37] text-2xl"><i class="fa-solid fa-gift"></i></div>
            <h4 class="text-xl font-serif text-[#fbf8ee]">Kirim Kado Fisik</h4>
            <div v-for="(addr, i) in giftAddresses" :key="i" class="space-y-3 max-w-md mx-auto">
              <p class="text-xs md:text-sm text-[#d6b094] font-sans leading-relaxed">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="px-6 py-2 rounded-full border border-[#d4af37]/60 text-xs text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#140205] transition-all font-sans uppercase tracking-widest font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <i class="fa-regular fa-copy"></i> Salin Alamat Pengiriman
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP & BUKU UCAPAN DOA -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-24 md:py-32 px-6 bg-[#180306] relative" v-observe>
        <div class="max-w-3xl mx-auto space-y-12">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
              Konfirmasi &amp; Doa
            </p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">
              Buku Ucapan &amp; RSVP
            </h2>
            <p class="text-xs md:text-sm text-[#d6b094] max-w-lg mx-auto font-sans leading-relaxed">
              Mohon konfirmasi kehadiran dan sampaikan doa tulus Anda untuk mengiringi langkah baru kami.
            </p>
          </div>

          <!-- Form RSVP -->
          <form @submit.prevent="submitRsvp" class="p-8 sm:p-10 border border-[#d4af37]/40 rounded-3xl bg-[#28050b]/85 backdrop-blur-md shadow-2xl space-y-5">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#d4af37] font-sans font-bold mb-2">Nama Anda</label>
              <input
                v-model="rsvp.name"
                type="text"
                required
                placeholder="Tuliskan nama Anda"
                class="w-full px-4 py-3 rounded-xl bg-[#140205]/80 border border-[#d4af37]/40 text-[#fbf8ee] placeholder-stone-500 font-sans text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs uppercase tracking-wider text-[#d4af37] font-sans font-bold mb-2">Konfirmasi Kehadiran</label>
                <select
                  v-model="rsvp.attendance"
                  class="w-full px-4 py-3 rounded-xl bg-[#140205]/80 border border-[#d4af37]/40 text-[#fbf8ee] font-sans text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Berhalangan Hadir</option>
                </select>
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider text-[#d4af37] font-sans font-bold mb-2">Jumlah Tamu</label>
                <select
                  v-model.number="rsvp.totalGuests"
                  class="w-full px-4 py-3 rounded-xl bg-[#140205]/80 border border-[#d4af37]/40 text-[#fbf8ee] font-sans text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option :value="1">1 Orang</option>
                  <option :value="2">2 Orang</option>
                  <option :value="3">3 Orang</option>
                  <option :value="4">4 Orang</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#d4af37] font-sans font-bold mb-2">Doa &amp; Ucapan Selamat</label>
              <textarea
                v-model="rsvp.message"
                rows="4"
                required
                placeholder="Tuliskan doa restu untuk kedua mempelai..."
                class="w-full px-4 py-3 rounded-xl bg-[#140205]/80 border border-[#d4af37]/40 text-[#fbf8ee] placeholder-stone-500 font-sans text-sm focus:outline-none focus:border-[#d4af37]"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submittingRsvp"
              class="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#b8860b] text-[#140205] rounded-xl font-sans text-xs uppercase tracking-[0.2em] font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {{ submittingRsvp ? 'Mengirimkan...' : 'Kirim Konfirmasi & Doa' }}
            </button>
          </form>

          <!-- List of Wishes -->
          <div class="space-y-4 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
            <div
              v-for="(msg, i) in guestMessages"
              :key="i"
              class="p-5 rounded-2xl border border-[#d4af37]/25 bg-[#28050b]/70 space-y-2 backdrop-blur-sm shadow-md"
            >
              <div class="flex items-center justify-between">
                <h5 class="font-serif font-bold text-[#f3e5ab] text-sm md:text-base">{{ msg.name }}</h5>
                <span
                  class="text-[9px] px-2.5 py-0.5 rounded-full font-sans uppercase font-bold"
                  :class="(msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'bg-[#d4af37]/25 text-[#f3e5ab]' : 'bg-stone-800 text-stone-400'"
                >
                  {{ (msg.attendance === 'hadir' || msg.rsvpStatus === 'hadir') ? 'Hadir' : 'Absen' }}
                </span>
              </div>
              <p class="text-xs text-[#d6b094] font-sans leading-relaxed">"{{ msg.message }}"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- TURUT MENGUNDANG / KELUARGA BESAR -->
      <section v-if="isSectionEnabled('extended-family') && normalizedExtendedFamily.length" class="py-20 px-6 bg-[#200409] text-center border-t border-[#d4af37]/20" v-observe>
        <div class="max-w-2xl mx-auto space-y-6">
          <p class="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-sans font-bold">
            Sanak Dulur
          </p>
          <h3 class="text-3xl md:text-4xl font-serif text-[#fbf8ee]">
            Turut Mengundang
          </h3>
          <div class="p-6 md:p-8 rounded-3xl border border-[#d4af37]/35 bg-[#28050b]/80 shadow-xl space-y-3">
            <p
              v-for="(fam, idx) in normalizedExtendedFamily"
              :key="idx"
              class="text-xs md:text-sm text-[#f3e5ab] font-sans leading-relaxed"
            >
              {{ fam }}
            </p>
          </div>
        </div>
      </section>

      <!-- FOOTER / DOA PENUTUP -->
      <footer class="py-24 md:py-32 bg-[#120204] text-center border-t border-[#d4af37]/30 relative overflow-hidden">
        <div class="relative z-10 px-6 space-y-5">
          <!-- Mini Rumah Limas Crest -->
          <div class="flex justify-center text-[#d4af37] opacity-80 mb-2">
            <svg class="w-12 h-8" viewBox="0 0 100 60" fill="currentColor">
              <polygon points="50,5 30,22 70,22" />
              <polygon points="50,20 20,38 80,38" />
              <polygon points="50,36 10,54 90,54" />
            </svg>
          </div>

          <p class="font-serif italic text-[#d4af37] text-base md:text-lg">Matur Kesuwun Sedalam-dalamnyo</p>
          <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">{{ data.groomName || 'Fadhil' }} &amp; {{ data.brideName || 'Zahra' }}</h2>

          <p v-if="data.footerText" class="text-[#d6b094] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            {{ data.footerText }}
          </p>
          <p v-else class="text-[#d6b094] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga, apabila Bapak/Ibu/Sanak Dulur berkenan hadir dan memberikan doa restu kepada kami.
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
    gift: ['gift', 'amplop', 'kado'],
    rsvp: ['rsvp', 'guestbook', 'wishes'],
    gallery: ['gallery', 'galeri', 'photos'],
  }
  const aliases = aliasMap[key] || [key]
  return aliases.some((a) => sections.includes(a))
}

const groomShortName = computed(() => {
  if (data.value.groomShortName) return data.value.groomShortName
  if (data.value.groomName) {
    const parts = data.value.groomName.split(' ')
    return parts[0] || 'Fadhil'
  }
  return 'Fadhil'
})

const brideShortName = computed(() => {
  if (data.value.brideShortName) return data.value.brideShortName
  if (data.value.brideName) {
    const cleaned = data.value.brideName.replace(/Nyimas|Raden|R\.|Syarifah/gi, '').trim()
    const parts = cleaned.split(' ')
    return parts[0] || 'Zahra'
  }
  return 'Zahra'
})

const groomPhoto = computed(() => {
  return data.value.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
})

const bridePhoto = computed(() => {
  return data.value.bridePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
})

const weddingTargetDate = computed(() => {
  return data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime || '2026-11-20T08:00:00'
})

const weddingFormattedDate = computed(() => {
  return formatDate(weddingTargetDate.value)
})

const normalizedExtendedFamily = computed(() => {
  const ef = data.value.extendedFamily
  if (Array.isArray(ef) && ef.length) return ef
  const tm = data.value.turutMengundang
  if (typeof tm === 'string' && tm.trim()) {
    return tm.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
  }
  return [
    'Keluarga Besar Masagus H. Ahmad Syukri (Palembang)',
    'Keluarga Besar Raden H. Mahmud Badaruddin (Seberang Ulu)',
    'Keluarga Besar H. Kemas Ridwan Effendi (Ilir Barat)',
    'Segenap Sanak Dulur & Handai Taulan',
  ]
})

const giftAddresses = computed(() => {
  const raw = data.value.giftDeliveryAddress
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  const filtered = list.map((a) => String(a || '').trim()).filter(Boolean)
  if (filtered.length) return filtered
  return ['Jl. Sultan Mahmud Badaruddin II No. 45, Bukit Kecil, Kota Palembang, Sumatera Selatan 30136']
})

const displayBankAccounts = computed(() => {
  if (Array.isArray(data.value.bankAccounts) && data.value.bankAccounts.length) {
    return data.value.bankAccounts
  }
  return [
    {
      bank_name: 'Bank Mandiri',
      account_number: '1130018899201',
      account_holder: data.value.groomName || 'Muhammad Fadhil Al-Farizi',
    },
    {
      bank_name: 'Bank BCA',
      account_number: '8220556781',
      account_holder: data.value.brideName || 'Nyimas R. S. Azzahra',
    },
  ]
})

const galleryImages = computed(() => {
  if (Array.isArray(data.value.galleryImages) && data.value.galleryImages.length) {
    return data.value.galleryImages.map((img) =>
      typeof img === 'object' && img?.src ? img : { src: String(img || ''), thumbnail: String(img || '') },
    )
  }
  return [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80', thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80' },
  ]
})

const mockStories = [
  {
    year: '2021',
    title: 'Pertemuan Pertama di Bumi Sriwijaya',
    description: 'Bermula dari perjumpaan di tepian Sungai Musi, saling sapa dalam kelembutan tutur kata adat Melayu Palembang nan santun.',
  },
  {
    year: '2023',
    title: 'Janji & Pertunangan (Batimbang Tando)',
    description: 'Keluarga besar bersua dalam musyawarah adat, menyematkan tanda pertunangan sebagai simbol ikatan suci dua insan.',
  },
  {
    year: '2026',
    title: 'Menuju Mahligai Rumah Limas',
    description: 'Dengan restu orang tua dan sanak dulur, kami melangkah menyatukan jiwa dalam akad nikah nan sakral.',
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
  const targetDateStr = weddingTargetDate.value
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
    details: `Undangan Pernikahan Adat Palembang Aesan Gede - ${title}`,
    location: location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Alhamdulillah, berhasil disalin ke papan klip!')
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
    toast.success('Matur kesuwun, konfirmasi dan doa restu telah kami terima!')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Maaf, terjadi kesalahan dalam mengirim konfirmasi.')
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
        name: 'Kemas H. Alamsyah & Keluarga',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khair. Selamat menempuh hidup baru sanak, semoga langgeng sakinah mawaddah warahmah hingga akhir hayat.',
        attendance: 'hadir',
      },
      {
        name: 'Nyimas Hj. Fatimah (Banyuasin)',
        message: 'Bukan keno pantun berlayang, keno budi bahaso nan elok. Selamat Berbahagia kanti sekato, megah bak Aesan Gede Kerajaan Sriwijaya!',
        attendance: 'hadir',
      },
      {
        name: 'Sahabat Kuliah Unsri',
        message: 'Selamat berbahagia Fadhil & Zahra! Semoga ikatan cinta selalu kokoh seperti tiang ulin Rumah Limas. Amin!',
        attendance: 'hadir',
      },
    ]
  }
}

// Observe directive for smooth fade-in
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
