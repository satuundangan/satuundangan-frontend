<template>
  <div
    class="relative min-h-screen bg-[#0a0f0d] overflow-x-hidden font-sans text-[#f4f7f5] selection:bg-[#c93b2b]/30 selection:text-[#ffb703] demon-slayer-theme"
  >
    <!-- ============================================================== -->
    <!-- 1. AMBIENT BACKGROUND & CANVAS PARTICLES (Wisteria & Embers)   -->
    <!-- ============================================================== -->
    <!-- Base Ichimatsu Subtle Texture Layer -->
    <div class="fixed inset-0 pointer-events-none z-0 ichimatsu-pattern opacity-15"></div>

    <!-- Radial Atmospheric Night Atmosphere -->
    <div
      class="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(114,9,183,0.22),transparent_70%),radial-gradient(ellipse_60%_50%_at_50%_110%,rgba(201,59,43,0.18),transparent_70%)]"
    ></div>

    <!-- Dynamic Canvas Particle Effect (Falling Wisteria Petals & Golden Embers) -->
    <canvas
      ref="particleCanvas"
      class="fixed inset-0 w-full h-full pointer-events-none z-[1]"
    ></canvas>

    <!-- Slash Burst Canvas (Triggered on Welcome Gate Unlock) -->
    <canvas
      ref="slashCanvas"
      class="fixed inset-0 w-full h-full pointer-events-none z-[110]"
    ></canvas>

    <!-- ============================================================== -->
    <!-- 2. FIXED CORNER ORNAMENTS (z-40 pointer-events-none)          -->
    <!-- Crossed Nichirin Blades with Wisteria & Ichimatsu Pattern      -->
    <!-- ============================================================== -->
    <!-- Top-Left Corner -->
    <div
      class="fixed top-0 left-0 w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 z-40 pointer-events-none select-none opacity-90"
    >
      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(201,59,43,0.35)]"
      >
        <!-- Checker corner bracket -->
        <path d="M0 0 L180 0 L180 16 L16 16 L16 180 L0 180 Z" fill="url(#dsIchimatsuGrad)" opacity="0.6" />
        <!-- Gold outer accent line -->
        <path d="M4 4 L160 4 C120 18 90 48 76 88 C62 128 58 150 4 160 Z" stroke="url(#dsGoldGrad)" stroke-width="2" />
        <path d="M8 8 L130 8 C100 22 78 48 68 78 C58 108 52 130 8 130 Z" stroke="#e0aaff" stroke-width="1" stroke-dasharray="3 3" opacity="0.8" />
        <!-- Crossed Katana Silhouette -->
        <g transform="translate(18, 18)">
          <!-- Blade 1 -->
          <line x1="0" y1="0" x2="80" y2="80" stroke="#f4f7f5" stroke-width="2.5" stroke-linecap="round" />
          <line x1="0" y1="0" x2="80" y2="80" stroke="#c93b2b" stroke-width="1" opacity="0.8" />
          <!-- Tsuba 1 (Flame) -->
          <circle cx="28" cy="28" r="6" fill="#ffb703" stroke="#c93b2b" stroke-width="1.5" />
          <!-- Blade 2 -->
          <line x1="0" y1="56" x2="56" y2="0" stroke="#f4f7f5" stroke-width="2" stroke-linecap="round" />
          <!-- Tsuba 2 (Butterfly) -->
          <circle cx="28" cy="28" r="3.5" fill="#9b5de5" />
        </g>
        <!-- Hanging Wisteria Pods -->
        <g transform="translate(12, 12)">
          <path d="M10 20 Q 30 45 45 75" stroke="#7209b7" stroke-width="1.5" fill="none" opacity="0.7" />
          <circle cx="45" cy="75" r="3.5" fill="#e0aaff" />
          <circle cx="40" cy="65" r="3" fill="#9b5de5" />
          <circle cx="34" cy="55" r="2.5" fill="#7209b7" />
          <circle cx="27" cy="45" r="2.5" fill="#e0aaff" />
          <circle cx="20" cy="35" r="2" fill="#9b5de5" />
        </g>
        <defs>
          <linearGradient id="dsGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffb703" />
            <stop offset="50%" stop-color="#e65100" />
            <stop offset="100%" stop-color="#c93b2b" />
          </linearGradient>
          <linearGradient id="dsIchimatsuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1c442c" />
            <stop offset="100%" stop-color="#0d1712" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Top-Right Corner -->
    <div
      class="fixed top-0 right-0 w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 z-40 pointer-events-none select-none opacity-90 scale-x-[-1]"
    >
      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(201,59,43,0.35)]"
      >
        <path d="M0 0 L180 0 L180 16 L16 16 L16 180 L0 180 Z" fill="url(#dsIchimatsuGrad)" opacity="0.6" />
        <path d="M4 4 L160 4 C120 18 90 48 76 88 C62 128 58 150 4 160 Z" stroke="url(#dsGoldGrad)" stroke-width="2" />
        <path d="M8 8 L130 8 C100 22 78 48 68 78 C58 108 52 130 8 130 Z" stroke="#e0aaff" stroke-width="1" stroke-dasharray="3 3" opacity="0.8" />
        <g transform="translate(18, 18)">
          <line x1="0" y1="0" x2="80" y2="80" stroke="#f4f7f5" stroke-width="2.5" stroke-linecap="round" />
          <line x1="0" y1="0" x2="80" y2="80" stroke="#c93b2b" stroke-width="1" opacity="0.8" />
          <circle cx="28" cy="28" r="6" fill="#ffb703" stroke="#c93b2b" stroke-width="1.5" />
          <line x1="0" y1="56" x2="56" y2="0" stroke="#f4f7f5" stroke-width="2" stroke-linecap="round" />
          <circle cx="28" cy="28" r="3.5" fill="#9b5de5" />
        </g>
        <g transform="translate(12, 12)">
          <path d="M10 20 Q 30 45 45 75" stroke="#7209b7" stroke-width="1.5" fill="none" opacity="0.7" />
          <circle cx="45" cy="75" r="3.5" fill="#e0aaff" />
          <circle cx="40" cy="65" r="3" fill="#9b5de5" />
          <circle cx="34" cy="55" r="2.5" fill="#7209b7" />
          <circle cx="27" cy="45" r="2.5" fill="#e0aaff" />
          <circle cx="20" cy="35" r="2" fill="#9b5de5" />
        </g>
      </svg>
    </div>

    <!-- Bottom-Left Corner -->
    <div
      class="fixed bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-40 pointer-events-none select-none opacity-80 scale-y-[-1]"
    >
      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(114,9,183,0.35)]"
      >
        <path d="M4 4 L140 4 C100 18 78 48 66 88 C54 128 50 140 4 140 Z" stroke="url(#dsGoldGrad)" stroke-width="1.8" />
        <g transform="translate(18, 18)">
          <line x1="0" y1="0" x2="60" y2="60" stroke="#f4f7f5" stroke-width="2" />
          <circle cx="24" cy="24" r="5" fill="#ffb703" />
        </g>
      </svg>
    </div>

    <!-- Bottom-Right Corner -->
    <div
      class="fixed bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-40 pointer-events-none select-none opacity-80 scale-[-1]"
    >
      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full filter drop-shadow-[0_4px_12px_rgba(114,9,183,0.35)]"
      >
        <path d="M4 4 L140 4 C100 18 78 48 66 88 C54 128 50 140 4 140 Z" stroke="url(#dsGoldGrad)" stroke-width="1.8" />
        <g transform="translate(18, 18)">
          <line x1="0" y1="0" x2="60" y2="60" stroke="#f4f7f5" stroke-width="2" />
          <circle cx="24" cy="24" r="5" fill="#ffb703" />
        </g>
      </svg>
    </div>

    <!-- ============================================================== -->
    <!-- 3. MUSIC CONTROL                                               -->
    <!-- ============================================================== -->
    <MusicControl
      v-if="data.musicChoice && isOpened"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#1a4731"
      accentColor="#ffb703"
      :autoPlay="isOpened"
      class="z-[60]"
    />

    <!-- ============================================================== -->
    <!-- 4. FLOATING BOTTOM NAVIGATION (Kisatsutai Uniform Belt Dock)   -->
    <!-- ============================================================== -->
    <nav
      v-if="isOpened"
      class="fixed bottom-0 left-0 right-0 z-[80] bg-[#0c1410]/95 backdrop-blur-md border-t-2 border-[#ffb703]/50 shadow-[0_-8px_24px_rgba(0,0,0,0.7)] animate-fade-in flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-2 py-2.5 w-full sm:max-w-xl sm:mx-auto justify-between">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="
            activeSection === item.id
              ? 'text-[#ffb703] scale-110 -translate-y-0.5'
              : 'text-[#9b5de5]/75 hover:text-[#f4f7f5]'
          "
        >
          <!-- Active Fire Ring / Demon Slayer Haori Dot -->
          <div
            v-if="activeSection === item.id"
            class="absolute -top-1 w-2 h-0.5 bg-gradient-to-r from-[#c93b2b] via-[#ffb703] to-[#c93b2b] rounded-full"
          ></div>
          <i :class="[item.icon, 'text-lg md:text-xl']"></i>
          <span class="max-w-full truncate text-[8px] md:text-[9px] font-bold uppercase tracking-wider font-mono">
            {{ item.label }}
          </span>
        </button>
      </div>
    </nav>

    <!-- ============================================================== -->
    <!-- 5. WELCOME GATE (Gulungan Misi Korps Pemburu Iblis)            -->
    <!-- ============================================================== -->
    <transition name="scroll-gate">
      <div
        v-if="!isOpened"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 py-8 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#09110d] via-[#0d1c15] to-[#080d0a]"
      >
        <!-- Atmospheric Wisteria Fog & Flaming Embers -->
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(155,93,229,0.18),transparent_70%)]"></div>

        <!-- The Demon Slayer Mission Scroll Card -->
        <div
          class="relative w-full max-w-md my-auto rounded-3xl p-6 sm:p-8 text-center border-2 border-[#ffb703]/60 shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#13231a] via-[#101b15] to-[#0c1611] overflow-hidden animate-fade-in"
        >
          <!-- Top & Bottom Ichimatsu Ribbons -->
          <div class="absolute top-0 left-0 right-0 h-3 ichimatsu-pattern border-b border-[#ffb703]/40"></div>
          <div class="absolute bottom-0 left-0 right-0 h-3 ichimatsu-pattern border-t border-[#ffb703]/40"></div>

          <!-- Hanging Wisteria Floral Header SVG -->
          <div class="w-48 sm:w-56 mx-auto mb-2 filter drop-shadow-[0_2px_8px_rgba(155,93,229,0.5)]">
            <svg viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
              <!-- Central Wisteria Vine Branch -->
              <path d="M10 10 Q 70 30 120 15 Q 170 30 230 10" stroke="#7209b7" stroke-width="2" stroke-linecap="round" fill="none" />
              <!-- Blossoms -->
              <g fill="#e0aaff">
                <circle cx="50" cy="22" r="3" />
                <circle cx="58" cy="28" r="2.5" />
                <circle cx="85" cy="24" r="3.5" fill="#9b5de5" />
                <circle cx="92" cy="32" r="2.5" />
                <circle cx="120" cy="26" r="4" fill="#c93b2b" />
                <circle cx="148" cy="24" r="3.5" fill="#9b5de5" />
                <circle cx="155" cy="32" r="2.5" />
                <circle cx="182" cy="22" r="3" />
                <circle cx="190" cy="28" r="2.5" />
              </g>
            </svg>
          </div>

          <!-- Mission Badge / Title -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ffb703]/40 bg-[#0c1611]/80 text-[#ffb703] text-[10px] font-mono uppercase tracking-[0.35em] mb-4">
            <i class="fa-solid fa-fire text-[#c93b2b]"></i>
            <span>Misi Suci Kisatsutai</span>
            <i class="fa-solid fa-fire text-[#c93b2b]"></i>
          </div>

          <!-- Kanji & Japanese Romantic Subtitle -->
          <div class="text-[11px] tracking-[0.4em] text-[#e0aaff] font-serif uppercase mb-2">
            鬼滅の愛・永遠の契り
          </div>

          <!-- The Wedding Of -->
          <h2 class="text-xs font-mono uppercase tracking-[0.5em] text-[#f4f7f5]/80">
            Pernikahan Suci Pemburu Iblis
          </h2>

          <!-- Couple Names -->
          <div class="my-5 space-y-1">
            <h1 class="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#ffb703] drop-shadow-[0_2px_12px_rgba(255,183,3,0.4)]">
              {{ data.groomName?.split(' ')[0] || 'Tanjiro' }}
            </h1>
            <div class="flex items-center justify-center gap-3 my-1">
              <span class="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#ffb703] to-transparent"></span>
              <span class="text-xl sm:text-2xl font-serif italic text-[#c93b2b]">&amp;</span>
              <span class="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#ffb703] to-transparent"></span>
            </div>
            <h1 class="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#e0aaff] drop-shadow-[0_2px_12px_rgba(224,170,255,0.4)]">
              {{ data.brideName?.split(' ')[0] || 'Kanao' }}
            </h1>
          </div>

          <!-- Date Badge -->
          <p class="text-xs sm:text-sm font-mono tracking-widest text-[#f4f7f5]/90 uppercase mb-6">
            {{ formatDate(data.akadLocation?.dateTime || data.resepsiLocation?.dateTime) }}
          </p>

          <!-- Wisteria Protection Seal (Segel Wisteria Pelindung) -->
          <div class="relative max-w-xs mx-auto p-4 rounded-2xl bg-[#0b1410]/90 border border-[#9b5de5]/40 shadow-inner mb-6">
            <div class="text-[9px] uppercase tracking-[0.3em] text-[#e0aaff]/80 font-mono mb-1">
              Kepada Yth. Pendekar / Rekan Seperjuangan:
            </div>
            <div class="text-lg sm:text-xl font-bold text-[#ffb703] truncate py-0.5">
              {{ data.guestName || 'Tamu Kehormatan' }}
            </div>
            <div class="text-[8px] text-[#9b5de5] italic mt-0.5">
              "Terlindungi di Bawah Naungan Pohon Wisteria Suci"
            </div>
          </div>

          <!-- Action Button: Open Scroll with Hinokami Flame Slash -->
          <button
            @click="openInvitationWithSlash"
            class="group relative w-full py-4 px-6 rounded-2xl overflow-hidden font-mono font-bold tracking-[0.25em] text-sm uppercase text-[#0d1712] bg-gradient-to-r from-[#ffb703] via-[#f77f00] to-[#c93b2b] shadow-[0_0_24px_rgba(255,183,3,0.45)] hover:shadow-[0_0_35px_rgba(201,59,43,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <!-- Flame flare streak -->
            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span class="relative z-10 flex items-center justify-center gap-3">
              <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
              Buka Gulungan Undangan
              <i class="fa-solid fa-fire text-xs"></i>
            </span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ============================================================== -->
    <!-- 6. MAIN CONTENT WRAPPER                                        -->
    <!-- ============================================================== -->
    <div
      v-if="isOpened"
      id="main-content"
      class="opacity-0 transition-opacity duration-1000 min-h-screen relative z-10 pb-28"
    >
      <!-- ============================================================ -->
      <!-- SECTION 1: HERO (Tarian Hinokami & Pelataran Wisteria)       -->
      <!-- ============================================================ -->
      <section
        id="home"
        class="relative min-h-[92svh] flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 overflow-hidden"
      >
        <!-- Overhead Wisteria Vines & Canopy Decoration -->
        <div class="absolute top-0 left-0 right-0 h-40 pointer-events-none opacity-80 flex justify-around">
          <div v-for="i in 8" :key="'wist-' + i" class="w-8 sm:w-12 h-32 bg-gradient-to-b from-[#7209b7]/40 via-[#9b5de5]/25 to-transparent rounded-b-full filter blur-[1px] animate-pulse" :style="{ animationDelay: `${i * 0.3}s` }"></div>
        </div>

        <div class="relative z-10 max-w-3xl mx-auto space-y-6" v-observe>
          <!-- Japanese Calligraphy Banner -->
          <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#ffb703]/40 bg-[#0e1a14]/90 text-[#ffb703] text-[11px] font-mono uppercase tracking-[0.35em]">
            <i class="fa-solid fa-star text-[9px]"></i>
            {{ data.heroLabel || 'The Holy Union of Demon Slayers' }}
            <i class="fa-solid fa-star text-[9px]"></i>
          </div>

          <h3 class="text-sm md:text-base font-mono tracking-[0.4em] text-[#e0aaff] uppercase">
            Penyatuan Dua Jiwa di Bawah Langit Wisteria
          </h3>

          <!-- Grand Couple Photo Frame (Hanafuda & Nichirin Steel Rim) -->
          <div class="relative mx-auto w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[26rem] my-4 group">
            <!-- Outer Gold & Fire Glow Rings -->
            <div class="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#c93b2b] via-[#ffb703] to-[#9b5de5] opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-500"></div>

            <!-- Ichimatsu Pattern Outer Border -->
            <div class="absolute inset-0 rounded-3xl ichimatsu-pattern p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] border-2 border-[#ffb703]/50">
              <!-- Photo Container -->
              <div class="w-full h-full rounded-2xl overflow-hidden bg-[#0c1611] relative">
                <img
                  :src="data.photoCoupleUrl || fallbackCoupleImg"
                  alt="Mempelai"
                  class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <!-- Subtle Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-[#0c1611] via-transparent to-transparent opacity-60"></div>
              </div>
            </div>

            <!-- Bottom Floating Tsuba Badge -->
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#101e17] border-2 border-[#ffb703] text-[#ffb703] text-[10px] font-mono tracking-widest uppercase shadow-lg flex items-center gap-1.5 whitespace-nowrap">
              <i class="fa-solid fa-shield-halved text-[#c93b2b]"></i>
              <span>Ikrar Abadi</span>
              <i class="fa-solid fa-shield-halved text-[#c93b2b]"></i>
            </div>
          </div>

          <!-- Names Headline -->
          <div class="space-y-2 pt-4">
            <h1 class="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-[#f4f7f5] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              <span class="text-[#ffb703]">{{ data.groomName?.split(' ')[0] || 'Tanjiro' }}</span>
              <span class="text-2xl sm:text-4xl font-serif italic text-[#c93b2b] mx-2 md:mx-4">&amp;</span>
              <span class="text-[#e0aaff]">{{ data.brideName?.split(' ')[0] || 'Kanao' }}</span>
            </h1>

            <p class="text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] text-[#f4f7f5]/80 uppercase">
              {{ formatDate(data.akadLocation?.dateTime || data.resepsiLocation?.dateTime) }}
            </p>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 2: KATA MUTIARA & JANJI SUCI (Ayat & Sumpah Cinta)   -->
      <!-- ============================================================ -->
      <section
        id="quote"
        v-if="isSectionEnabled('quote')"
        class="py-20 px-4 relative bg-gradient-to-b from-transparent via-[#0d1813]/80 to-transparent"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <!-- Tsuba Shinobu / Butterfly Wing Icon SVG -->
          <div class="w-16 h-16 mx-auto filter drop-shadow-[0_0_12px_rgba(155,93,229,0.6)]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
              <!-- Butterfly Wings -->
              <path d="M50 50 C20 10 0 30 15 65 C25 75 45 60 50 50 Z" fill="url(#dsWistGrad)" opacity="0.85" />
              <path d="M50 50 C80 10 100 30 85 65 C75 75 55 60 50 50 Z" fill="url(#dsWistGrad)" opacity="0.85" />
              <path d="M50 50 C30 65 20 85 35 92 C48 95 50 65 50 50 Z" fill="#7209b7" opacity="0.75" />
              <path d="M50 50 C70 65 80 85 65 92 C52 95 50 65 50 50 Z" fill="#7209b7" opacity="0.75" />
              <line x1="50" y1="20" x2="50" y2="85" stroke="#ffb703" stroke-width="2" />
              <circle cx="50" cy="50" r="4" fill="#ffb703" />
              <defs>
                <linearGradient id="dsWistGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#e0aaff" />
                  <stop offset="100%" stop-color="#9b5de5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div class="space-y-4 max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0f1c16]/80 border border-[#ffb703]/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <!-- Ichimatsu side accents -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5 ichimatsu-pattern"></div>
            <div class="absolute right-0 top-0 bottom-0 w-1.5 ichimatsu-pattern"></div>

            <p class="text-xs font-mono tracking-[0.3em] uppercase text-[#ffb703]">
              Sumpah Cinta Abadi Pendekar
            </p>

            <blockquote class="text-sm sm:text-base md:text-lg font-serif italic leading-relaxed text-[#f4f7f5]/90">
              "{{ data.quote?.content || 'Meski badai menghadang dan malam begitu kelam, selama fajar masih menyingsing dan pedang cinta terhunus bersama, langkah kami tak akan pernah goyah. Cinta ini adalah nafas abadi yang menyucikan segala rintangan.' }}"
            </blockquote>

            <p class="text-xs font-mono tracking-wider text-[#e0aaff] pt-2">
              — {{ data.quote?.source || 'QS. Ar-Rum: 21 & Ikrar Korps Pemburu Iblis' }} —
            </p>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 3: PROFIL MEMPELAI (Kenshi & Hime)                   -->
      <!-- ============================================================ -->
      <section
        id="couple"
        v-if="isSectionEnabled('couple')"
        class="py-24 px-4 relative bg-[#09110d]"
        v-observe
      >
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-2">
            <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">
              Dua Jiwa Terpilih
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#f4f7f5]">
              Sang Pendekar &amp; Sang Putri
            </h2>
            <p class="text-xs sm:text-sm text-[#f4f7f5]/70 max-w-lg mx-auto">
              Dengan penuh keikhlasan dan rahmat Sang Pencipta, mempertemukan dua insan mulia dalam ikatan suci pernikahan:
            </p>
          </div>

          <!-- Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 max-w-4xl mx-auto">
            <!-- GROOM (Sang Kenshi / Pendekar Api) -->
            <div
              class="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#13231a] to-[#0d1611] border-2 border-[#c93b2b]/50 shadow-[0_15px_45px_rgba(201,59,43,0.25)] space-y-6 text-center group hover:border-[#ffb703] transition-all duration-300"
            >
              <!-- Top Flame Ribbon Indicator -->
              <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c93b2b] text-[#f4f7f5] text-[10px] font-mono tracking-widest uppercase shadow flex items-center gap-1.5">
                <i class="fa-solid fa-fire text-[#ffb703]"></i>
                <span>Sang Kenshi (Mempelai Pria)</span>
              </div>

              <!-- Groom Avatar / Photo -->
              <div class="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mt-2">
                <div class="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#c93b2b] to-[#ffb703] opacity-60 blur-md group-hover:opacity-100 transition-opacity"></div>
                <div class="relative w-full h-full rounded-full overflow-hidden border-2 border-[#ffb703] bg-[#0c1611]">
                  <img
                    :src="data.groomPhotoUrl || data.photoCoupleUrl || fallbackGroomImg"
                    alt="Foto Mempelai Pria"
                    class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <!-- Names & Lineage -->
              <div class="space-y-2">
                <h3 class="text-2xl sm:text-3xl font-serif font-black text-[#ffb703]">
                  {{ data.groomName || 'Kamado Tanjiro' }}
                </h3>
                <p class="text-xs font-mono uppercase tracking-widest text-[#f4f7f5]/80">
                  {{ data.groomNickname ? `"${data.groomNickname}"` : 'Pendekar Tarian Hinokami' }}
                </p>
                <div class="text-xs text-[#f4f7f5]/70 pt-2 leading-relaxed">
                  <p class="font-bold text-[#f4f7f5]/90">Putra Tercinta dari:</p>
                  <p>{{ data.groomFather || 'Bapak Tanjuro Kamado' }}</p>
                  <p>&amp; {{ data.groomMother || 'Ibu Kie Kamado' }}</p>
                </div>
              </div>

              <!-- Instagram / Social Button -->
              <div v-if="data.groomInstagram" class="pt-2">
                <a
                  :href="'https://instagram.com/' + data.groomInstagram.replace('@', '')"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1611] border border-[#ffb703]/40 text-[#ffb703] text-xs font-mono hover:bg-[#c93b2b] hover:text-white transition-all shadow-sm"
                >
                  <i class="fa-brands fa-instagram"></i>
                  <span>@{{ data.groomInstagram.replace('@', '') }}</span>
                </a>
              </div>
            </div>

            <!-- BRIDE (Sang Hime / Putri Bunga Wisteria) -->
            <div
              class="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#161a25] to-[#0e121a] border-2 border-[#9b5de5]/50 shadow-[0_15px_45px_rgba(155,93,229,0.25)] space-y-6 text-center group hover:border-[#e0aaff] transition-all duration-300"
            >
              <!-- Top Butterfly Ribbon Indicator -->
              <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7209b7] text-[#f4f7f5] text-[10px] font-mono tracking-widest uppercase shadow flex items-center gap-1.5">
                <i class="fa-solid fa-seedling text-[#e0aaff]"></i>
                <span>Sang Hime (Mempelai Wanita)</span>
              </div>

              <!-- Bride Avatar / Photo -->
              <div class="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mt-2">
                <div class="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#7209b7] to-[#e0aaff] opacity-60 blur-md group-hover:opacity-100 transition-opacity"></div>
                <div class="relative w-full h-full rounded-full overflow-hidden border-2 border-[#e0aaff] bg-[#0c1611]">
                  <img
                    :src="data.bridePhotoUrl || data.photoCoupleUrl || fallbackBrideImg"
                    alt="Foto Mempelai Wanita"
                    class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <!-- Names & Lineage -->
              <div class="space-y-2">
                <h3 class="text-2xl sm:text-3xl font-serif font-black text-[#e0aaff]">
                  {{ data.brideName || 'Tsuyuri Kanao' }}
                </h3>
                <p class="text-xs font-mono uppercase tracking-widest text-[#f4f7f5]/80">
                  {{ data.brideNickname ? `"${data.brideNickname}"` : 'Pendekar Nafas Bunga' }}
                </p>
                <div class="text-xs text-[#f4f7f5]/70 pt-2 leading-relaxed">
                  <p class="font-bold text-[#f4f7f5]/90">Putri Tercinta dari:</p>
                  <p>{{ data.brideFather || 'Bapak Kocho (Wali)' }}</p>
                  <p>&amp; {{ data.brideMother || 'Ibu Kanae Kocho' }}</p>
                </div>
              </div>

              <!-- Instagram / Social Button -->
              <div v-if="data.brideInstagram" class="pt-2">
                <a
                  :href="'https://instagram.com/' + data.brideInstagram.replace('@', '')"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e121a] border border-[#e0aaff]/40 text-[#e0aaff] text-xs font-mono hover:bg-[#7209b7] hover:text-white transition-all shadow-sm"
                >
                  <i class="fa-brands fa-instagram"></i>
                  <span>@{{ data.brideInstagram.replace('@', '') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 4: COUNTDOWN TIMER (Penanda Pertempuran Fajar)       -->
      <!-- ============================================================ -->
      <section
        id="countdown"
        v-if="isSectionEnabled('countdown')"
        class="py-20 px-4 relative bg-gradient-to-b from-[#09110d] via-[#101b15] to-[#09110d]"
        v-observe
      >
        <div class="max-w-2xl mx-auto space-y-8 text-center">
          <div class="space-y-2">
            <!-- Flame Tsuba Icon SVG -->
            <div class="w-12 h-12 mx-auto filter drop-shadow-[0_0_8px_rgba(255,183,3,0.5)]">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <circle cx="50" cy="50" r="42" stroke="#ffb703" stroke-width="4" />
                <path d="M50 12 Q 65 35 50 50 Q 75 40 88 50 Q 65 65 50 50 Q 60 75 50 88 Q 35 65 50 50 Q 25 60 12 50 Q 35 35 50 50 Q 40 25 50 12 Z" fill="#c93b2b" />
                <circle cx="50" cy="50" r="12" fill="#ffb703" stroke="#0d1712" stroke-width="2" />
              </svg>
            </div>
            <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">
              Penanda Waktu Penyatuan
            </p>
            <h3 class="text-2xl sm:text-3xl font-serif font-black text-[#f4f7f5]">
              Menghitung Fajar Hari Bahagia
            </h3>
          </div>

          <!-- 4 Time Boxes -->
          <div class="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 sm:p-5 rounded-2xl bg-[#0c1611]/90 border-2 border-[#ffb703]/50 shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm"
            >
              <div class="text-2xl sm:text-4xl font-mono font-black text-[#ffb703] drop-shadow-[0_2px_8px_rgba(255,183,3,0.3)]">
                {{ val }}
              </div>
              <div class="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-[#e0aaff] mt-1 font-bold">
                {{ label }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 5: JADWAL ACARA (Akad & Pesta di Bawah Pohon Wisteria)-->
      <!-- ============================================================ -->
      <section
        id="event"
        v-if="isSectionEnabled('event')"
        class="py-24 px-4 relative bg-[#09110d]"
        v-observe
      >
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-2">
            <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">
              Agenda Pertemuan Suci
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#f4f7f5]">
              Pertemuan di Bawah Naungan Wisteria
            </h2>
            <p class="text-xs sm:text-sm text-[#f4f7f5]/70 max-w-md mx-auto">
              Kehadiran dan doa restu para pendekar dan rekan sekalian adalah kehormatan tak ternilai bagi kami:
            </p>
          </div>

          <!-- Events Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- AKAD NIKAH / UPACARA IKRAR -->
            <div
              v-if="data.akadLocation?.dateTime || !data.resepsiLocation"
              class="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#13231a] to-[#0d1611] border-2 border-[#ffb703]/60 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-6 text-center overflow-hidden"
            >
              <div class="absolute top-0 left-0 right-0 h-2 ichimatsu-pattern"></div>

              <div class="w-12 h-12 mx-auto rounded-full bg-[#1b3325] border border-[#ffb703] flex items-center justify-center text-[#ffb703] text-lg shadow">
                <i class="fa-solid fa-certificate"></i>
              </div>

              <div class="space-y-1">
                <h3 class="text-2xl font-serif font-bold text-[#ffb703]">
                  {{ data.akadLocation?.title || 'Akad Nikah / Ikrar Suci' }}
                </h3>
                <p class="text-xs font-mono text-[#e0aaff] uppercase tracking-wider">
                  Upacara Penyematan Janji
                </p>
              </div>

              <!-- Date & Time Info -->
              <div class="p-4 rounded-2xl bg-[#09110d]/90 border border-[#ffb703]/30 space-y-2 text-xs sm:text-sm">
                <div class="flex items-center justify-center gap-2 text-[#f4f7f5] font-bold">
                  <i class="fa-regular fa-calendar-check text-[#ffb703]"></i>
                  <span>{{ formatDate(data.akadLocation?.dateTime) }}</span>
                </div>
                <div class="flex items-center justify-center gap-2 text-[#e0aaff]">
                  <i class="fa-regular fa-clock text-[#e0aaff]"></i>
                  <span>{{ formatTime(data.akadLocation?.dateTime) }}</span>
                </div>
              </div>

              <!-- Location Detail -->
              <div class="space-y-1 text-xs text-[#f4f7f5]/80">
                <p class="font-bold text-[#f4f7f5] text-sm">
                  {{ data.akadLocation?.locationName || 'Kuil Suci Bunga Wisteria' }}
                </p>
                <p class="leading-relaxed">
                  {{ data.akadLocation?.address || 'Jl. Lereng Gunung Fujikasane, Hutan Bunga Wisteria' }}
                </p>
              </div>

              <!-- Action Links (Maps & Calendar) -->
              <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  v-if="data.akadLocation?.mapUrl || data.akadLocation?.mapsUrl"
                  :href="data.akadLocation?.mapUrl || data.akadLocation?.mapsUrl"
                  target="_blank"
                  rel="noopener"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ffb703] text-[#0d1712] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#c93b2b] hover:text-white transition-all shadow flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>Peta Petunjuk</span>
                </a>
                <a
                  :href="addToCalendar(data.akadLocation, 'Akad Nikah')"
                  target="_blank"
                  rel="noopener"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#ffb703]/50 text-[#ffb703] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#ffb703]/10 transition-all shadow flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-calendar-plus"></i>
                  <span>Simpan Agenda</span>
                </a>
              </div>
            </div>

            <!-- RESEPSI PERNIKAHAN / PERAYAAN KORPS -->
            <div
              v-if="data.resepsiLocation?.dateTime || data.akadLocation"
              class="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#181d28] to-[#0e121a] border-2 border-[#9b5de5]/60 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-6 text-center overflow-hidden"
            >
              <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#7209b7] via-[#9b5de5] to-[#7209b7]"></div>

              <div class="w-12 h-12 mx-auto rounded-full bg-[#211b33] border border-[#e0aaff] flex items-center justify-center text-[#e0aaff] text-lg shadow">
                <i class="fa-solid fa-champagne-glasses"></i>
              </div>

              <div class="space-y-1">
                <h3 class="text-2xl font-serif font-bold text-[#e0aaff]">
                  {{ data.resepsiLocation?.title || 'Pesta Resepsi / Perayaan Korps' }}
                </h3>
                <p class="text-xs font-mono text-[#ffb703] uppercase tracking-wider">
                  Malam Keakraban Pendekar
                </p>
              </div>

              <!-- Date & Time Info -->
              <div class="p-4 rounded-2xl bg-[#09110d]/90 border border-[#9b5de5]/30 space-y-2 text-xs sm:text-sm">
                <div class="flex items-center justify-center gap-2 text-[#f4f7f5] font-bold">
                  <i class="fa-regular fa-calendar-check text-[#e0aaff]"></i>
                  <span>{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</span>
                </div>
                <div class="flex items-center justify-center gap-2 text-[#ffb703]">
                  <i class="fa-regular fa-clock text-[#ffb703]"></i>
                  <span>{{ formatTime(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</span>
                </div>
              </div>

              <!-- Location Detail -->
              <div class="space-y-1 text-xs text-[#f4f7f5]/80">
                <p class="font-bold text-[#f4f7f5] text-sm">
                  {{ data.resepsiLocation?.locationName || 'Paviliun Kediaman Kupu-kupu (Butterfly Mansion)' }}
                </p>
                <p class="leading-relaxed">
                  {{ data.resepsiLocation?.address || 'Kompleks Markas Utama Korps Pemburu Iblis' }}
                </p>
              </div>

              <!-- Action Links (Maps & Calendar) -->
              <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  v-if="data.resepsiLocation?.mapUrl || data.resepsiLocation?.mapsUrl || data.akadLocation?.mapUrl"
                  :href="data.resepsiLocation?.mapUrl || data.resepsiLocation?.mapsUrl || data.akadLocation?.mapUrl"
                  target="_blank"
                  rel="noopener"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#9b5de5] text-[#0d1712] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#7209b7] hover:text-white transition-all shadow flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>Peta Petunjuk</span>
                </a>
                <a
                  :href="addToCalendar(data.resepsiLocation || data.akadLocation, 'Resepsi')"
                  target="_blank"
                  rel="noopener"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#e0aaff]/50 text-[#e0aaff] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#9b5de5]/10 transition-all shadow flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-calendar-plus"></i>
                  <span>Simpan Agenda</span>
                </a>
              </div>
            </div>
          </div>

          <!-- DRESS CODE (TATA BUSANA PENDEKAR) -->
          <div
            v-if="data.dressCode || isSectionEnabled('dress-code')"
            class="max-w-lg mx-auto p-6 rounded-3xl bg-[#0f1c16]/90 border border-[#ffb703]/30 text-center space-y-3"
            v-observe
          >
            <div class="flex items-center justify-center gap-2 text-[#ffb703] text-sm font-mono uppercase tracking-widest font-bold">
              <i class="fa-solid fa-shirt"></i>
              <span>Tata Busana / Dress Code</span>
            </div>
            <p class="text-xs text-[#f4f7f5]/80 leading-relaxed">
              {{ data.dressCode?.description || data.dressCode || 'Pakaian Formal / Batik / Nuansa Demon Slayer (Deep Forest Green, Obsidian Noir, Wisteria Lilac, atau Sentuhan Emas & Api).' }}
            </p>
            <div class="flex items-center justify-center gap-3 pt-1">
              <span class="w-5 h-5 rounded-full bg-[#1a4731] border border-white/20 shadow" title="Forest Green"></span>
              <span class="w-5 h-5 rounded-full bg-[#0f1412] border border-white/20 shadow" title="Obsidian Noir"></span>
              <span class="w-5 h-5 rounded-full bg-[#9b5de5] border border-white/20 shadow" title="Wisteria Purple"></span>
              <span class="w-5 h-5 rounded-full bg-[#ffb703] border border-white/20 shadow" title="Hinokami Gold"></span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 6: LOVE STORY TIMELINE (Kronik Cinta Pendekar)       -->
      <!-- ============================================================ -->
      <section
        id="story"
        v-if="isSectionEnabled('love-story') && activeStories.length"
        class="py-24 px-4 relative bg-[#0a0f0d]"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-16 text-center">
          <div class="space-y-2">
            <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">
              Kronik Perjalanan Dua Jiwa
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#f4f7f5]">
              Kisah Kasih di Medan Takdir
            </h2>
            <p class="text-xs sm:text-sm text-[#f4f7f5]/70 max-w-md mx-auto">
              Setiap langkah, pertempuran batin, dan bunga wisteria yang mekar membawa kami pada satu takdir yang sama:
            </p>
          </div>

          <!-- Timeline Vertical -->
          <div class="relative border-l-2 border-[#ffb703]/40 ml-4 sm:ml-8 md:mx-auto md:max-w-xl space-y-12 text-left pl-6 sm:pl-8">
            <div
              v-for="(story, idx) in activeStories"
              :key="'story-' + idx"
              class="relative group"
            >
              <!-- Flame / Tsuba Node on Timeline Line -->
              <div
                class="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a0f0d] border-2 border-[#ffb703] flex items-center justify-center text-[#ffb703] text-[10px] shadow-[0_0_10px_rgba(255,183,3,0.5)] group-hover:scale-125 transition-transform"
              >
                <i :class="idx % 2 === 0 ? 'fa-solid fa-fire text-[#c93b2b]' : 'fa-solid fa-seedling text-[#e0aaff]'"></i>
              </div>

              <!-- Story Box -->
              <div
                class="p-5 sm:p-6 rounded-2xl border border-[#ffb703]/30 bg-[#101e17]/85 backdrop-blur-sm space-y-2 group-hover:border-[#ffb703] group-hover:shadow-[0_8px_25px_rgba(255,183,3,0.2)] transition-all"
              >
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <h4 class="font-bold text-base sm:text-lg text-[#ffb703] font-serif">
                    {{ story.title }}
                  </h4>
                  <span class="text-[10px] font-mono px-3 py-0.5 rounded-full border border-[#ffb703]/40 bg-[#c93b2b]/30 text-[#f4f7f5] font-bold">
                    {{ story.date }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-[#f4f7f5]/85 leading-relaxed">
                  {{ story.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 7: GALERI FOTO (Galeri Kenangan Pendekar)             -->
      <!-- ============================================================ -->
      <section
        id="gallery"
        v-if="isSectionEnabled('gallery') && galleryImages.length"
        class="py-24 px-4 relative bg-[#09110d] border-y border-[#ffb703]/30"
        v-observe
      >
        <div class="max-w-5xl mx-auto space-y-12 text-center">
          <div class="space-y-2">
            <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#e0aaff]">
              Bingkai Kenangan
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#f4f7f5]">
              Galeri Momen Bahagia
            </h2>
            <p class="text-xs sm:text-sm text-[#f4f7f5]/70 max-w-md mx-auto">
              Setiap senyuman di balik lebatnya bunga wisteria, terabadikan dalam lembaran sejarah:
            </p>
          </div>

          <!-- Gallery Component Integration -->
          <div class="p-2 sm:p-4 rounded-3xl bg-[#0c1611]/80 border border-[#9b5de5]/40 shadow-2xl">
            <GalleryInvitation :images="galleryImages" />
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 8: VIDEO PREWEDDING & LIVE STREAMING                 -->
      <!-- ============================================================ -->
      <!-- Video Section -->
      <section
        id="video"
        v-if="isSectionEnabled('video') && (data.videoUrl || isPreviewMode)"
        class="py-20 px-4 relative bg-[#0a0f0d]"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <div class="space-y-2">
            <span class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">Klip Sinematik</span>
            <h2 class="text-3xl font-serif font-black text-[#f4f7f5]">Tarian Kisah Kami</h2>
          </div>

          <div class="relative aspect-video rounded-3xl overflow-hidden border-2 border-[#ffb703]/50 shadow-[0_12px_40px_rgba(0,0,0,0.8)] bg-black">
            <iframe
              v-if="data.videoUrl"
              :src="getEmbedUrlVideo(data.videoUrl)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-[#ffb703] space-y-2">
              <i class="fa-solid fa-play text-4xl"></i>
              <span class="text-xs font-mono tracking-widest uppercase">Pratinjau Video Prewedding</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Live Streaming Section -->
      <section
        id="live-streaming"
        v-if="isSectionEnabled('live-streaming') && (data.liveStreamingUrl || data.liveStreamingLink)"
        class="py-16 px-4 bg-[#0e1a14] border-y border-[#ffb703]/25 text-center"
        v-observe
      >
        <div class="max-w-md mx-auto space-y-4 p-6 rounded-3xl bg-[#09110d]/90 border border-[#ffb703]/40 shadow-xl">
          <div class="text-[#c93b2b] text-3xl animate-pulse">
            <i class="fa-solid fa-tower-broadcast"></i>
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-serif font-bold text-[#ffb703]">Siaran Langsung Resepsi</h3>
            <p class="text-xs text-[#f4f7f5]/70">
              Bagi rekan seperjuangan yang berhalangan hadir secara fisik, dapat menyaksikan siaran langsung kami:
            </p>
          </div>
          <a
            :href="data.liveStreamingUrl || data.liveStreamingLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c93b2b] hover:bg-[#e65100] text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-lg"
          >
            <i class="fa-brands fa-youtube text-sm"></i>
            <span>Saksikan Siaran Langsung</span>
          </a>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 9: AMPLOP DIGITAL & KIRIM KADO                       -->
      <!-- (Kotak Perbekalan Kencana & Tanda Kasih)                     -->
      <!-- ============================================================ -->
      <section
        id="gift"
        v-if="isSectionEnabled('gift')"
        class="py-24 px-4 relative bg-[#09110d]"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-14 text-center">
          <div class="space-y-2">
            <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">
              Tanda Kasih &amp; Doa Restu
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#f4f7f5]">
              Kotak Perbekalan Kencana
            </h2>
            <p class="text-xs sm:text-sm text-[#f4f7f5]/70 max-w-md mx-auto">
              Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda berkenan memberikan tanda kasih:
            </p>
          </div>

          <!-- Bank Accounts & E-Wallet Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div
              v-for="(acc, index) in bankAccounts"
              :key="'bank-' + index"
              class="relative rounded-3xl p-6 bg-gradient-to-b from-[#13231a] to-[#0d1611] border-2 border-[#ffb703]/50 shadow-[0_10px_30px_rgba(0,0,0,0.6)] space-y-4 text-left overflow-hidden group hover:border-[#ffb703] transition-all"
            >
              <!-- Ichimatsu Corner Accent -->
              <div class="absolute top-0 right-0 w-16 h-16 ichimatsu-pattern opacity-30 pointer-events-none"></div>

              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-[#ffb703] uppercase tracking-widest">
                  {{ acc.bank || 'Bank Transfer' }}
                </span>
                <i class="fa-solid fa-credit-card text-[#ffb703]/80"></i>
              </div>

              <div class="space-y-1">
                <div class="text-xs text-[#f4f7f5]/70">Nomor Rekening:</div>
                <div class="text-lg sm:text-xl font-mono font-bold text-[#f4f7f5] tracking-wider">
                  {{ acc.number }}
                </div>
                <div class="text-xs text-[#e0aaff]">
                  a.n. {{ acc.name }}
                </div>
              </div>

              <button
                @click="copyToClipboard(acc.number)"
                class="w-full py-2.5 px-4 rounded-xl bg-[#ffb703] hover:bg-[#c93b2b] text-[#0d1712] hover:text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Nomor Rekening</span>
              </button>
            </div>
          </div>

          <!-- Physical Gift Address -->
          <div
            v-if="data.giftAddress || data.shippingAddress"
            class="max-w-md mx-auto p-6 rounded-3xl bg-[#0f1c16]/90 border border-[#9b5de5]/40 text-center space-y-4"
          >
            <div class="w-10 h-10 mx-auto rounded-full bg-[#1e1529] border border-[#e0aaff] flex items-center justify-center text-[#e0aaff]">
              <i class="fa-solid fa-gift"></i>
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-sm uppercase font-mono tracking-wider text-[#e0aaff]">
                Kirim Kado Fisik
              </h4>
              <p class="text-xs text-[#f4f7f5]/80 leading-relaxed">
                {{ data.giftAddress || data.shippingAddress }}
              </p>
            </div>
            <button
              @click="copyToClipboard(data.giftAddress || data.shippingAddress)"
              class="px-5 py-2 rounded-xl border border-[#e0aaff]/60 text-[#e0aaff] hover:bg-[#9b5de5]/20 font-mono text-xs font-bold uppercase tracking-wider transition-all"
            >
              <i class="fa-regular fa-copy mr-1"></i> Salin Alamat Kirim
            </button>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 10: RSVP & BUKU DOA RESTU                            -->
      <!-- ============================================================ -->
      <section
        id="rsvp"
        v-if="isSectionEnabled('rsvp')"
        class="py-24 px-4 relative bg-[#0a0f0d]"
        v-observe
      >
        <div class="max-w-3xl mx-auto space-y-14 text-center">
          <div class="space-y-2">
            <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">
              Konfirmasi &amp; Doa Restu
            </p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#f4f7f5]">
              Buku Doa Para Pendekar
            </h2>
            <p class="text-xs sm:text-sm text-[#f4f7f5]/70 max-w-md mx-auto">
              Kirimkan kabar kehadiran serta doa restu terbaik Anda untuk membekali langkah perjalanan baru kami:
            </p>
          </div>

          <!-- RSVP Form Card -->
          <div class="p-6 sm:p-8 rounded-3xl bg-[#101e17]/90 border-2 border-[#ffb703]/50 shadow-[0_15px_40px_rgba(0,0,0,0.7)] text-left max-w-xl mx-auto space-y-6">
            <form @submit.prevent="submitRsvp" class="space-y-4">
              <!-- Name Input -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-[#ffb703] mb-1 font-bold">
                  Nama Tamu / Pendekar
                </label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Tuliskan nama Anda..."
                  class="w-full px-4 py-3 rounded-xl bg-[#09110d] border border-[#ffb703]/40 text-[#f4f7f5] text-sm focus:outline-none focus:border-[#ffb703] transition-colors"
                />
              </div>

              <!-- Attendance Selection -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-[#ffb703] mb-2 font-bold">
                  Konfirmasi Kehadiran
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    @click="rsvp.attendance = 'hadir'"
                    :class="[
                      'py-3 px-4 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all text-center',
                      rsvp.attendance === 'hadir'
                        ? 'bg-[#1a4731] border-[#ffb703] text-[#ffb703] shadow-[0_0_12px_rgba(255,183,3,0.3)]'
                        : 'bg-[#09110d] border-white/20 text-[#f4f7f5]/60 hover:border-white/40',
                    ]"
                  >
                    <i class="fa-solid fa-circle-check mr-1.5 text-xs"></i> Hadir
                  </button>
                  <button
                    type="button"
                    @click="rsvp.attendance = 'tidak_hadir'"
                    :class="[
                      'py-3 px-4 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all text-center',
                      rsvp.attendance === 'tidak_hadir'
                        ? 'bg-[#c93b2b]/40 border-[#c93b2b] text-[#f4f7f5] shadow-[0_0_12px_rgba(201,59,43,0.3)]'
                        : 'bg-[#09110d] border-white/20 text-[#f4f7f5]/60 hover:border-white/40',
                    ]"
                  >
                    <i class="fa-solid fa-circle-xmark mr-1.5 text-xs"></i> Tidak Hadir
                  </button>
                </div>
              </div>

              <!-- Total Guests -->
              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block text-xs font-mono uppercase tracking-wider text-[#ffb703] mb-1 font-bold">
                  Jumlah Tamu
                </label>
                <select
                  v-model.number="rsvp.totalGuests"
                  class="w-full px-4 py-3 rounded-xl bg-[#09110d] border border-[#ffb703]/40 text-[#f4f7f5] text-sm focus:outline-none focus:border-[#ffb703] transition-colors"
                >
                  <option :value="1">1 Orang</option>
                  <option :value="2">2 Orang</option>
                  <option :value="3">3 Orang</option>
                  <option :value="4">4 Orang</option>
                </select>
              </div>

              <!-- Wishes / Doa Restu Message -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-[#ffb703] mb-1 font-bold">
                  Untaian Doa &amp; Restu
                </label>
                <textarea
                  v-model="rsvp.message"
                  rows="3"
                  required
                  placeholder="Tuliskan ucapan selamat & doa restu tulus Anda..."
                  class="w-full px-4 py-3 rounded-xl bg-[#09110d] border border-[#ffb703]/40 text-[#f4f7f5] text-sm focus:outline-none focus:border-[#ffb703] transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-3.5 px-6 rounded-xl font-mono font-bold tracking-widest text-xs uppercase text-[#0d1712] bg-gradient-to-r from-[#ffb703] via-[#f77f00] to-[#c93b2b] hover:shadow-[0_0_20px_rgba(255,183,3,0.5)] transition-all duration-300 disabled:opacity-50"
              >
                <span v-if="submittingRsvp">Mengirimkan Doa...</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <i class="fa-solid fa-paper-plane"></i>
                  Kirim Doa Restu
                </span>
              </button>
            </form>
          </div>

          <!-- Guest Wishes Feed -->
          <div class="max-w-xl mx-auto space-y-4 text-left">
            <h4 class="text-xs font-mono uppercase tracking-widest text-[#ffb703] font-bold text-center">
              Daftar Ucapan Pendekar ({{ guestMessages.length }})
            </h4>

            <div class="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-1">
              <div
                v-for="(msg, i) in guestMessages"
                :key="'msg-' + i"
                class="p-4 rounded-2xl bg-[#0e1a14]/90 border border-[#ffb703]/25 space-y-2"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-bold text-sm text-[#ffb703] flex items-center gap-2">
                    <i class="fa-solid fa-award text-xs text-[#c93b2b]"></i>
                    {{ msg.name }}
                  </span>
                  <span
                    :class="[
                      'text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold',
                      msg.attendance === 'hadir'
                        ? 'bg-[#1a4731] text-[#ffb703] border border-[#ffb703]/30'
                        : 'bg-white/10 text-white/60',
                    ]"
                  >
                    {{ msg.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir' }}
                  </span>
                </div>
                <p class="text-xs text-[#f4f7f5]/85 leading-relaxed">
                  {{ msg.message }}
                </p>
                <div v-if="msg.totalGuests > 1" class="text-[10px] text-[#e0aaff] font-mono">
                  <i class="fa-solid fa-users text-[9px] mr-1"></i> {{ msg.totalGuests }} Pendekar
                </div>
              </div>

              <div v-if="guestMessages.length === 0" class="text-center py-8 text-[#f4f7f5]/50 font-mono text-xs">
                — Belum ada doa yang terkirim. Jadilah yang pertama! —
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 11: TURUT MENGUNDANG & KELUARGA BESAR KORPS          -->
      <!-- ============================================================ -->
      <section
        id="family"
        v-if="isSectionEnabled('extended-family') && normalizedExtendedFamily.length"
        class="py-16 px-4 bg-[#09110d] text-center border-t border-[#ffb703]/25"
        v-observe
      >
        <div class="max-w-xl mx-auto space-y-6">
          <p class="text-xs font-mono uppercase tracking-[0.4em] text-[#ffb703]">
            Turut Mengundang
          </p>
          <h3 class="text-2xl font-serif font-black text-[#f4f7f5]">
            Keluarga Besar &amp; Rekan Seperjuangan
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#f4f7f5]/85">
            <div
              v-for="(fam, idx) in normalizedExtendedFamily"
              :key="'fam-' + idx"
              class="p-3 rounded-xl bg-[#0f1c16] border border-[#ffb703]/20 font-mono"
            >
              {{ typeof fam === 'string' ? fam : fam.name || fam }}
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- FOOTER & WATERMARK                                           -->
      <!-- ============================================================ -->
      <footer class="py-16 px-4 text-center space-y-6 relative" v-observe>
        <div class="w-16 h-16 mx-auto filter drop-shadow-[0_0_12px_rgba(255,183,3,0.5)]">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="#ffb703" stroke-width="2" />
            <path d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" fill="#c93b2b" />
            <circle cx="50" cy="50" r="6" fill="#ffb703" />
          </svg>
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <p class="font-serif text-2xl font-bold text-[#ffb703]">Terima Kasih</p>
          <p class="text-xs font-mono text-[#f4f7f5]/70 uppercase tracking-widest leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila rekan sekalian berkenan hadir dan memberikan doa restu.
          </p>
          <p class="text-[11px] font-mono text-[#e0aaff] pt-2">
            © {{ new Date().getFullYear() }} {{ data.groomName?.split(' ')[0] || 'Tanjiro' }} &amp; {{ data.brideName?.split(' ')[0] || 'Kanao' }}
          </p>
        </div>

        <div class="pt-4">
          <WatermarkBadge variant="dark" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemonSlayerTemplate',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const toast = useToast()
const isOpened = ref(false)
const submittingRsvp = ref(false)

const isPreviewMode = computed(
  () => props.data?.id === 'live-preview' || props.data?.id === 0 || !props.data?.id,
)

const data = ref(props.data || {})

watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
  },
  { deep: true, immediate: true },
)

// Fallback images
const fallbackCoupleImg = '/assets/images/comet_transparent_bg.png'
const fallbackGroomImg = '/assets/images/comet_transparent_bg.png'
const fallbackBrideImg = '/assets/images/comet_transparent_bg.png'

// Mock stories if none provided
const mockStories = [
  {
    title: 'Pertemuan Pertama di Kuil Bunga',
    date: 'Maret 2023',
    description: 'Di tengah riuhnya angin musim semi di bawah pohon Wisteria, takdir mempertemukan tatapan mata kami untuk pertama kalinya.',
  },
  {
    title: 'Ikrar Saling Melindungi',
    date: 'Agustus 2024',
    description: 'Kami saling berjanji untuk saling menguatkan, menjadi pedang pelindung dan tempat pulang paling teduh di setiap badai.',
  },
  {
    title: 'Menuju Pelaminan Abadi',
    date: 'Maret 2026',
    description: 'Kini kami melangkah bersama menuju babak baru: mengikat janji suci pernikahan di bawah lindungan bunga wisteria abadi.',
  },
]

const activeStories = computed(() => {
  if (data.value.loveStory && Array.isArray(data.value.loveStory) && data.value.loveStory.length > 0) {
    return data.value.loveStory
  }
  return mockStories
})

const bankAccounts = computed(() => {
  if (data.value.bankAccounts && Array.isArray(data.value.bankAccounts) && data.value.bankAccounts.length > 0) {
    return data.value.bankAccounts
  }
  return [
    { bank: 'BCA', number: '8219082341', name: 'Tanjiro Kamado' },
    { bank: 'Mandiri', number: '1370019283741', name: 'Kanao Tsuyuri' },
  ]
})

const galleryImages = computed(() => {
  if (data.value.galleryImages && Array.isArray(data.value.galleryImages)) {
    return data.value.galleryImages
  }
  return []
})

const normalizedExtendedFamily = computed(() => {
  const ef = data.value.extendedFamily
  if (Array.isArray(ef) && ef.length) return ef
  const tm = data.value.turutMengundang
  if (Array.isArray(tm) && tm.length) return tm
  if (typeof tm === 'string' && tm.trim()) {
    return tm.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return []
})

const guestMessages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const activeSection = ref('home')
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let timerInterval = null

// Canvas references
const particleCanvas = ref(null)
const slashCanvas = ref(null)
let particleAnimationId = null
let slashAnimationId = null

// Navigation items
const navItems = computed(() => {
  const items = [
    { id: 'home', label: 'Beranda', icon: 'fa-solid fa-torii-gate' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-user-group' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-day' },
    { id: 'story', label: 'Cerita', icon: 'fa-solid fa-scroll' },
    { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' },
    { id: 'gift', label: 'Hadiah', icon: 'fa-solid fa-gift' },
    { id: 'rsvp', label: 'Doa Restu', icon: 'fa-solid fa-envelope-open-text' },
  ]
  return items.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'couple') return isSectionEnabled('couple')
    if (item.id === 'event') return isSectionEnabled('event')
    if (item.id === 'story') return isSectionEnabled('love-story') && (data.value.loveStory?.length > 0 || isPreviewMode.value)
    if (item.id === 'gallery') return isSectionEnabled('gallery') && galleryImages.value.length > 0
    if (item.id === 'gift') return isSectionEnabled('gift')
    if (item.id === 'rsvp') return isSectionEnabled('rsvp')
    return true
  })
})

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
    countdown: ['countdown', 'timer'],
    gallery: ['gallery', 'galleryInvitation', 'photos'],
    gift: ['gift', 'amplop', 'kado'],
    rsvp: ['rsvp', 'guestbook', 'wishes', 'doa'],
    quote: ['quote', 'ayat', 'doa'],
  }
  const aliases = aliasMap[key] || [key]
  return aliases.some((a) => sections.includes(a))
}

// Helpers
function formatDate(dateStr) {
  if (!dateStr) return 'Sabtu, 28 Maret 2026'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(dateStr) {
  if (!dateStr) return '09:00 WIB'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return (
    date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  )
}

function getMusicUrl(choice) {
  if (!choice) return '/audio/wedding-sacred-ceremony.mp3'
  if (choice.startsWith('yt:') || choice.startsWith('http') || choice.startsWith('/')) return choice
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
    toast.success('Berhasil disalin ke papan klip!')
  })
}

function addToCalendar(event, titlePrefix = 'Pernikahan') {
  if (!event?.dateTime) return '#'
  const start = new Date(event.dateTime)
  if (isNaN(start.getTime())) return '#'
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
  const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
  const title = encodeURIComponent(
    `${titlePrefix} ${data.value.groomName || 'Tanjiro'} & ${data.value.brideName || 'Kanao'}`,
  )
  const details = encodeURIComponent(
    event.description || 'Pernikahan Korps Pemburu Iblis: Tarian Hinokami & Bunga Wisteria',
  )
  const location = encodeURIComponent(event.address || event.locationName || '')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`
}

function scrollToSection(id) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Open Invitation with Hinokami Fire Slash FX
function openInvitationWithSlash() {
  triggerSlashEffect(() => {
    isOpened.value = true
    setTimeout(() => {
      const el = document.getElementById('main-content')
      if (el) el.classList.remove('opacity-0')
    }, 150)
  })
}

function triggerSlashEffect(callback) {
  const canvas = slashCanvas.value
  if (!canvas) {
    if (callback) callback()
    return
  }
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  let frame = 0
  const maxFrames = 28
  const particles = []

  // Create burst of flame embers along diagonal slash arc
  const startX = -50
  const startY = canvas.height * 0.75
  const endX = canvas.width + 50
  const endY = canvas.height * 0.25

  for (let i = 0; i < 70; i++) {
    const t = Math.random()
    const px = startX + (endX - startX) * t
    const py = startY + (endY - startY) * t
    particles.push({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 2,
      size: Math.random() * 6 + 3,
      color: Math.random() > 0.4 ? '#ffb703' : '#c93b2b',
      alpha: 1,
    })
  }

  function renderSlash() {
    frame++
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const progress = frame / maxFrames

    // Blazing fiery arc
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    const curX = startX + (endX - startX) * Math.min(progress * 1.6, 1)
    const curY = startY + (endY - startY) * Math.min(progress * 1.6, 1)
    ctx.lineTo(curX, curY)
    ctx.strokeStyle = '#ffb703'
    ctx.lineWidth = 14 * (1 - progress)
    ctx.shadowColor = '#c93b2b'
    ctx.shadowBlur = 30
    ctx.lineCap = 'round'
    ctx.stroke()

    // Inner bright core
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(curX, curY)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 5 * (1 - progress)
    ctx.stroke()
    ctx.restore()

    // Particle explosions
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.alpha = Math.max(0, 1 - progress)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.alpha
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    if (frame < maxFrames) {
      slashAnimationId = requestAnimationFrame(renderSlash)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (callback) callback()
    }
  }

  renderSlash()
}

// Ambient Canvas FX: Falling Wisteria Petals & Golden Hinokami Embers
function initParticleCanvas() {
  const canvas = particleCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const petalColors = ['#e0aaff', '#9b5de5', '#7209b7', '#c77dff']
  const emberColors = ['#ffb703', '#f77f00', '#c93b2b', '#ffd166']

  const particles = []
  const count = Math.min(45, Math.floor(window.innerWidth / 28))

  for (let i = 0; i < count; i++) {
    const isEmber = Math.random() > 0.55
    particles.push({
      isEmber,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: isEmber ? Math.random() * 2 + 1.2 : Math.random() * 5 + 3,
      color: isEmber
        ? emberColors[Math.floor(Math.random() * emberColors.length)]
        : petalColors[Math.floor(Math.random() * petalColors.length)],
      speedY: isEmber ? -(Math.random() * 0.7 + 0.3) : Math.random() * 0.9 + 0.5,
      speedX: (Math.random() - 0.5) * 0.6,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.03,
      alpha: Math.random() * 0.6 + 0.3,
    })
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.angle += p.spin
      p.x += p.speedX + (p.isEmber ? 0 : Math.sin(p.angle) * 0.5)
      p.y += p.speedY

      // Wrap around bounds
      if (p.isEmber && p.y < -10) {
        p.y = canvas.height + 10
        p.x = Math.random() * canvas.width
      } else if (!p.isEmber && p.y > canvas.height + 10) {
        p.y = -10
        p.x = Math.random() * canvas.width
      }
      if (p.x < -10) p.x = canvas.width + 10
      if (p.x > canvas.width + 10) p.x = -10

      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.translate(p.x, p.y)

      if (p.isEmber) {
        // Glowing ember dot
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Wisteria Petal Ellipse
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.shadowColor = '#9b5de5'
        ctx.shadowBlur = 4
        ctx.beginPath()
        ctx.ellipse(0, 0, p.radius * 1.5, p.radius, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    particleAnimationId = requestAnimationFrame(renderParticles)
  }

  renderParticles()
}

// Countdown Timer logic
function updateCountdown() {
  const targetDateStr =
    data.value.resepsiLocation?.dateTime ||
    data.value.akadLocation?.dateTime ||
    data.value.dateTime
  if (!targetDateStr) return
  const target = new Date(targetDateStr).getTime()
  if (isNaN(target)) return
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

// RSVP Submission
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
    toast.success('Doa restu berhasil terkirim ke markas pemburu iblis!')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Mohon maaf, terjadi kendala saat mengirimkan doa.')
  } finally {
    submittingRsvp.value = false
  }
}

async function loadWishes() {
  if (data.value.id && !isPreviewMode.value) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res || []
    } catch {
      // noop
    }
  } else {
    guestMessages.value = [
      {
        name: 'Giyuu Tomioka',
        message: 'Semoga ikrar suci kalian berdua senantiasa kokoh bagaikan tenangnya permukaan air yang tak tergoyahkan. Selamat menempuh hidup baru.',
        attendance: 'hadir',
        totalGuests: 1,
      },
      {
        name: 'Kyojuro Rengoku',
        message: 'SET! SET! MAHABAHAGIA! Nyalakan api cintamu selamanya hingga menggetarkan seluruh angkasa! Selamat untuk kalian berdua!',
        attendance: 'hadir',
        totalGuests: 2,
      },
      {
        name: 'Shinobu Kocho',
        message: 'Di bawah naungan aroma wisteria yang selalu melindungi kita, semoga kebahagiaan kalian selalu mekar indah tanpa pernah layu.',
        attendance: 'hadir',
        totalGuests: 1,
      },
    ]
  }
}

// Custom Intersection Observer Directive
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
  initParticleCanvas()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (particleAnimationId) cancelAnimationFrame(particleAnimationId)
  if (slashAnimationId) cancelAnimationFrame(slashAnimationId)
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Shippori+Mincho:wght@500;700;800&family=Space+Mono:wght@400;700&display=swap');

/* Typography for Demon Slayer Theme */
.demon-slayer-theme {
  font-family: 'Shippori Mincho', serif;
}

.font-serif {
  font-family: 'Cinzel', serif;
}

.font-mono {
  font-family: 'Space Mono', monospace;
}

/* Authentic Demon Slayer Tanjiro Ichimatsu Checkered Pattern */
.ichimatsu-pattern {
  background-color: #0d1712;
  background-image:
    linear-gradient(45deg, #1c442c 25%, transparent 25%),
    linear-gradient(-45deg, #1c442c 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1c442c 75%),
    linear-gradient(-45deg, transparent 75%, #1c442c 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* Animations */
.scroll-gate-leave-active {
  transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}
.scroll-gate-leave-to {
  opacity: 0;
  transform: scale(1.08);
  filter: blur(14px);
}

.animate-fade-in {
  animation: fadeIn 0.9s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
