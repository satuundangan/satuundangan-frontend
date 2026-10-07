<template>
  <div class="relative min-h-screen bg-[#fcfbf7] overflow-hidden font-serif no-scrollbar text-[#1a1614] selection:bg-[#bfa15f]/25 selection:text-[#1a1614]">

    <!-- Classical Parchment Texture & Subtle Paper Grain -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply"
      style="background-image: radial-gradient(#1a1614 0.5px, transparent 0.5px), radial-gradient(#bfa15f 0.5px, #fcfbf7 0.5px); background-size: 24px 24px; background-position: 0 0, 12px 12px;"
    ></div>

    <!-- Fixed Editorial Hairline Frame -->
    <div class="fixed inset-3 md:inset-6 pointer-events-none z-30 border border-[#bfa15f]/30"></div>
    <div class="fixed inset-4 md:inset-7 pointer-events-none z-30 border border-[#bfa15f]/15"></div>

    <!-- Fixed Classical Victorian / Old Money Corner Flourishes (z-40 pointer-events-none) -->
    <!-- Top-Left Corner -->
    <div class="fixed top-3 left-3 md:top-6 md:left-6 w-16 h-16 md:w-24 md:h-24 z-40 pointer-events-none select-none text-[#bfa15f]">
      <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="currentColor">
        <path d="M 6 6 L 6 70 M 6 6 L 70 6" stroke-width="1.2" opacity="0.4" />
        <path d="M 14 14 L 14 55 M 14 14 L 55 14" stroke-width="1.8" opacity="0.85" />
        <path d="M 14 14 C 30 30 40 18 52 32 C 40 36 36 48 22 48" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 C 30 30 18 40 32 52 C 36 40 48 36 48 22" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 Q 36 36 56 56" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
        <circle cx="14" cy="14" r="3.5" fill="currentColor" />
        <circle cx="36" cy="36" r="2" fill="currentColor" opacity="0.9" />
        <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>

    <!-- Top-Right Corner -->
    <div class="fixed top-3 right-3 md:top-6 md:right-6 w-16 h-16 md:w-24 md:h-24 z-40 pointer-events-none select-none text-[#bfa15f] scale-x-[-1]">
      <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="currentColor">
        <path d="M 6 6 L 6 70 M 6 6 L 70 6" stroke-width="1.2" opacity="0.4" />
        <path d="M 14 14 L 14 55 M 14 14 L 55 14" stroke-width="1.8" opacity="0.85" />
        <path d="M 14 14 C 30 30 40 18 52 32 C 40 36 36 48 22 48" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 C 30 30 18 40 32 52 C 36 40 48 36 48 22" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 Q 36 36 56 56" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
        <circle cx="14" cy="14" r="3.5" fill="currentColor" />
        <circle cx="36" cy="36" r="2" fill="currentColor" opacity="0.9" />
        <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>

    <!-- Bottom-Left Corner -->
    <div class="fixed bottom-3 left-3 md:bottom-6 md:left-6 w-16 h-16 md:w-24 md:h-24 z-40 pointer-events-none select-none text-[#bfa15f] scale-y-[-1]">
      <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="currentColor">
        <path d="M 6 6 L 6 70 M 6 6 L 70 6" stroke-width="1.2" opacity="0.4" />
        <path d="M 14 14 L 14 55 M 14 14 L 55 14" stroke-width="1.8" opacity="0.85" />
        <path d="M 14 14 C 30 30 40 18 52 32 C 40 36 36 48 22 48" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 C 30 30 18 40 32 52 C 36 40 48 36 48 22" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 Q 36 36 56 56" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
        <circle cx="14" cy="14" r="3.5" fill="currentColor" />
        <circle cx="36" cy="36" r="2" fill="currentColor" opacity="0.9" />
        <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>

    <!-- Bottom-Right Corner -->
    <div class="fixed bottom-3 right-3 md:bottom-6 md:right-6 w-16 h-16 md:w-24 md:h-24 z-40 pointer-events-none select-none text-[#bfa15f] rotate-180">
      <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="currentColor">
        <path d="M 6 6 L 6 70 M 6 6 L 70 6" stroke-width="1.2" opacity="0.4" />
        <path d="M 14 14 L 14 55 M 14 14 L 55 14" stroke-width="1.8" opacity="0.85" />
        <path d="M 14 14 C 30 30 40 18 52 32 C 40 36 36 48 22 48" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 C 30 30 18 40 32 52 C 36 40 48 36 48 22" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <path d="M 14 14 Q 36 36 56 56" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
        <circle cx="14" cy="14" r="3.5" fill="currentColor" />
        <circle cx="36" cy="36" r="2" fill="currentColor" opacity="0.9" />
        <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>

    <!-- Music Control Component -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#1a1614"
      accentColor="#bfa15f"
      :autoPlay="!showWelcome"
      class="z-[55]"
    />

    <!-- Sleek Floating Minimal Bottom Pill Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#1a1614]/92 backdrop-blur-xl border border-[#bfa15f]/40 rounded-full shadow-[0_12px_36px_rgba(26,22,20,0.35)] w-[92%] max-w-lg transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center justify-between gap-1 px-4 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#bfa15f] scale-105' : 'text-[#fcfbf7]/60 hover:text-[#bfa15f]'"
        >
          <i :class="[item.icon, 'text-sm md:text-base transition-transform group-hover:scale-110']"></i>
          <span class="max-w-full truncate text-[8px] font-sans font-semibold uppercase tracking-[0.2em]">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#bfa15f] transition-all duration-300"
            :class="activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- WELCOME GATE (Break Seal / Buka Undangan) -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-4 md:px-8 bg-gradient-to-b from-[#fcfbf7] via-[#f7f3eb] to-[#f4efe6] transition-all duration-1000 overflow-y-auto no-scrollbar py-12"
      >
        <!-- Vintage Stationery Double Frame -->
        <div class="absolute inset-4 md:inset-8 border border-[#bfa15f]/40 rounded-2xl pointer-events-none">
          <div class="absolute inset-1.5 border border-[#bfa15f]/20 rounded-xl"></div>
        </div>

        <div class="relative z-10 max-w-md w-full space-y-7 md:space-y-8 animate-fade-in-up py-4 px-2">
          
          <!-- Heraldic Monogram Laurel Crest -->
          <div class="flex justify-center">
            <div class="w-28 h-28 md:w-32 md:h-32 text-[#bfa15f] transition-transform duration-700 hover:scale-105">
              <svg viewBox="0 0 160 160" class="w-full h-full" fill="none">
                <!-- Aristocratic Crown -->
                <path d="M80 18 L87 27 L98 22 L94 36 L66 36 L62 22 L73 27 Z" fill="#bfa15f" opacity="0.9" />
                <circle cx="80" cy="16" r="2.2" fill="#9c7c38" />
                <circle cx="62" cy="20" r="1.8" fill="#9c7c38" />
                <circle cx="98" cy="20" r="1.8" fill="#9c7c38" />

                <!-- Left Laurel Branch -->
                <path d="M72 135 C50 132 34 114 32 84 C30 60 44 42 62 38" stroke="#bfa15f" stroke-width="1.8" stroke-linecap="round" />
                <!-- Laurel Leaves Left -->
                <path d="M38 98 C32 94 30 84 35 80 C40 86 42 94 38 98 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M35 80 C29 76 29 66 34 62 C38 68 39 76 35 80 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M37 62 C32 58 34 48 40 46 C42 52 42 60 37 62 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M48 48 C44 44 48 36 55 35 C56 42 53 48 48 48 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M52 120 C44 118 40 108 46 104 C50 109 54 116 52 120 Z" fill="#bfa15f" opacity="0.75" />

                <!-- Right Laurel Branch -->
                <path d="M88 135 C110 132 126 114 128 84 C130 60 116 42 98 38" stroke="#bfa15f" stroke-width="1.8" stroke-linecap="round" />
                <!-- Laurel Leaves Right -->
                <path d="M122 98 C128 94 130 84 125 80 C120 86 118 94 122 98 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M125 80 C131 76 131 66 126 62 C122 68 121 76 125 80 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M123 62 C128 58 126 48 120 46 C118 52 118 60 123 62 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M112 48 C116 44 112 36 105 35 C104 42 107 48 112 48 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M108 120 C116 118 120 108 114 104 C110 109 106 116 108 120 Z" fill="#bfa15f" opacity="0.75" />

                <!-- Base Laurel Ribbon -->
                <path d="M66 134 C74 138 86 138 94 134 C97 141 101 149 108 152 C99 150 93 145 90 141 C87 145 81 150 72 152 C79 149 83 141 86 134" fill="#bfa15f" opacity="0.85" />
                <circle cx="80" cy="136" r="3" fill="#9c7c38" />

                <!-- Monogram Text In Center -->
                <text x="80" y="88" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-weight="700" font-size="28" fill="#1a1614" letter-spacing="2">
                  {{ coupleMonogram }}
                </text>
                <text x="80" y="104" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="600" font-size="7" fill="#9c7c38" letter-spacing="3">
                  MMXXVI
                </text>
              </svg>
            </div>
          </div>

          <!-- Formal Invitation Request -->
          <div class="space-y-2.5">
            <p class="font-sans text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-[#9c7c38] font-bold">
              The Honor of Your Presence
            </p>
            <h1 class="text-3xl md:text-5xl font-serif text-[#1a1614] leading-tight tracking-tight">
              {{ groomFirstName }}
              <span class="text-xl md:text-2xl font-serif text-[#bfa15f] italic block my-1 font-normal">&amp;</span>
              {{ brideFirstName }}
            </h1>
            <p class="font-sans text-[10px] tracking-[0.25em] text-[#635b54] uppercase font-medium">
              {{ formattedHeroDate }}
            </p>
          </div>

          <!-- Esteemed Guest Card / Calling Card -->
          <div class="p-6 md:p-7 border border-[#bfa15f]/35 bg-[#f4f1ea]/90 backdrop-blur-md rounded-xl shadow-[0_8px_24px_rgba(191,161,95,0.12)] space-y-2 relative overflow-hidden">
            <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#bfa15f] to-transparent"></div>
            <p class="text-[9px] font-sans uppercase tracking-[0.35em] text-[#9c7c38] font-semibold">
              Cordially Presented To
            </p>
            <p class="text-2xl md:text-3xl font-serif font-bold text-[#1a1614] tracking-normal capitalize py-1">
              {{ data.guestName || 'Distinguished Guest' }}
            </p>
            <p class="text-[10px] font-sans text-[#635b54] italic">
              We request the pleasure of your esteemed company to celebrate our holy union
            </p>
          </div>

          <!-- Interactive Wax Seal Monogram Button -->
          <div class="flex flex-col items-center pt-2 space-y-3">
            <button
              @click="handleBreakSeal"
              :class="{'scale-95 opacity-80': isBreakingSeal}"
              class="group relative focus:outline-none transition-all duration-300 cursor-pointer"
              title="Break Seal to Open Invitation"
            >
              <!-- 3D Wax Seal Stamp Monogram -->
              <div
                class="w-24 h-24 md:w-28 md:h-28 rounded-full relative flex items-center justify-center transition-all duration-500 transform group-hover:scale-105 shadow-[0_12px_28px_rgba(139,38,38,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)]"
                style="background: radial-gradient(circle at 35% 35%, #ad342e 0%, #89221d 55%, #59110d 100%);"
              >
                <!-- Outer Organic Wax Drip Silhouette Ring -->
                <div class="absolute inset-0 rounded-full border-2 border-[#d4a853]/40 opacity-70"></div>
                <div class="absolute inset-1.5 rounded-full border border-dashed border-[#f5d796]/50"></div>
                
                <!-- Inner Debossed Monogram Disc -->
                <div
                  class="w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center border border-[#701511] shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)]"
                  style="background: radial-gradient(circle at 45% 45%, #942722 0%, #751814 80%, #52100d 100%);"
                >
                  <span class="font-serif text-lg md:text-xl font-bold tracking-widest text-[#f5e6c8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {{ coupleMonogram }}
                  </span>
                  <span class="text-[6px] tracking-[0.25em] uppercase text-[#e8c98e] font-sans font-bold -mt-0.5">
                    SEALED
                  </span>
                </div>

                <!-- Subtle Wax Glow / Flare -->
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-white/20 rounded-full blur-sm pointer-events-none"></div>
              </div>
            </button>

            <!-- Break Seal Action Label -->
            <button
              @click="handleBreakSeal"
              class="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#1a1614] hover:bg-[#2b2420] text-[#fcfbf7] border border-[#bfa15f]/50 rounded-full text-[10px] md:text-xs font-sans uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              <i class="fa-solid fa-envelope-open-text text-[#bfa15f]"></i>
              <span>Break Seal &amp; Enter</span>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <!-- MAIN INVITATION CONTENT -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="relative z-20 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth"
    >
      
      <!-- HERO SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 relative pt-20 pb-28 md:py-24">
        <div class="w-full max-w-4xl mx-auto text-center space-y-8 md:space-y-10" v-observe>
          
          <!-- Heraldic Monogram Crest -->
          <div class="flex justify-center">
            <div class="w-24 h-24 md:w-32 md:h-32 text-[#bfa15f]">
              <svg viewBox="0 0 160 160" class="w-full h-full" fill="none">
                <path d="M80 18 L87 27 L98 22 L94 36 L66 36 L62 22 L73 27 Z" fill="#bfa15f" opacity="0.9" />
                <circle cx="80" cy="16" r="2.2" fill="#9c7c38" />
                <circle cx="62" cy="20" r="1.8" fill="#9c7c38" />
                <circle cx="98" cy="20" r="1.8" fill="#9c7c38" />
                <path d="M72 135 C50 132 34 114 32 84 C30 60 44 42 62 38" stroke="#bfa15f" stroke-width="1.8" stroke-linecap="round" />
                <path d="M38 98 C32 94 30 84 35 80 C40 86 42 94 38 98 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M35 80 C29 76 29 66 34 62 C38 68 39 76 35 80 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M37 62 C32 58 34 48 40 46 C42 52 42 60 37 62 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M48 48 C44 44 48 36 55 35 C56 42 53 48 48 48 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M88 135 C110 132 126 114 128 84 C130 60 116 42 98 38" stroke="#bfa15f" stroke-width="1.8" stroke-linecap="round" />
                <path d="M122 98 C128 94 130 84 125 80 C120 86 118 94 122 98 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M125 80 C131 76 131 66 126 62 C122 68 121 76 125 80 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M123 62 C128 58 126 48 120 46 C118 52 118 60 123 62 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M112 48 C116 44 112 36 105 35 C104 42 107 48 112 48 Z" fill="#bfa15f" opacity="0.75" />
                <path d="M66 134 C74 138 86 138 94 134 C97 141 101 149 108 152 C99 150 93 145 90 141 C87 145 81 150 72 152 C79 149 83 141 86 134" fill="#bfa15f" opacity="0.85" />
                <circle cx="80" cy="136" r="3" fill="#9c7c38" />
                <text x="80" y="88" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-weight="700" font-size="28" fill="#1a1614" letter-spacing="2">
                  {{ coupleMonogram }}
                </text>
                <text x="80" y="104" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="600" font-size="7" fill="#9c7c38" letter-spacing="3">
                  MMXXVI
                </text>
              </svg>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-[9px] md:text-xs font-sans uppercase tracking-[0.4em] text-[#9c7c38] font-bold">
              High-Society Wedding Editorial
            </p>
            <h1 class="text-4xl md:text-7xl lg:text-8xl font-serif text-[#1a1614] leading-[1.05] tracking-tight">
              {{ data.groomName || 'Alexander Sterling' }}
              <span class="text-2xl md:text-5xl font-serif text-[#bfa15f] italic block my-2">&amp;</span>
              {{ data.brideName || 'Victoria Windsor' }}
            </h1>
            <div class="flex items-center justify-center gap-4 pt-2">
              <span class="w-12 md:w-20 h-px bg-[#bfa15f]/60"></span>
              <p class="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-[#635b54] font-medium">
                {{ formattedEventDate }}
              </p>
              <span class="w-12 md:w-20 h-px bg-[#bfa15f]/60"></span>
            </div>
          </div>

          <!-- Featured Couple Editorial Portrait -->
          <div class="relative max-w-sm md:max-w-md mx-auto pt-4">
            <div class="p-3 md:p-4 bg-[#f4f1ea] border border-[#bfa15f]/40 rounded-xl shadow-[0_16px_40px_rgba(26,22,20,0.08)] relative">
              <!-- Inner Double Hairline Passe-partout -->
              <div class="p-1 border border-[#bfa15f]/30 rounded-lg">
                <div class="aspect-[4/5] bg-[#eae5db] rounded-md overflow-hidden relative group">
                  <img
                    :src="data.photoCoupleUrl || data.groomPhotoUrl || defaultCouplePhoto"
                    alt="Featured Couple"
                    class="w-full h-full object-cover filter contrast-[1.03] transition-all duration-1000 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#1a1614]/60 via-transparent to-transparent opacity-40"></div>
                  <div class="absolute bottom-4 inset-x-0 text-center text-[#fcfbf7] font-serif text-xs md:text-sm tracking-widest uppercase italic">
                    The Monogram Union
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scroll Indicator -->
          <div class="pt-6 animate-bounce text-[#bfa15f]">
            <i class="fa-solid fa-chevron-down text-sm"></i>
          </div>

        </div>
      </section>

      <!-- ROMANTIC QUOTE SECTION -->
      <section v-if="isSectionEnabled('quote')" class="py-24 md:py-32 px-6 bg-[#f7f4ee] relative border-y border-[#bfa15f]/25" v-observe>
        <div class="max-w-3xl mx-auto text-center space-y-6">
          <div class="flex justify-center text-[#bfa15f]">
            <svg class="w-8 h-8" viewBox="0 0 40 40" fill="currentColor">
              <path d="M14 10 C10 14 8 20 8 26 C8 30 11 32 14 32 C17 32 19 30 19 26 C19 22 17 20 14 20 C14 16 16 13 18 11 Z" opacity="0.8" />
              <path d="M28 10 C24 14 22 20 22 26 C22 30 25 32 28 32 C31 32 33 30 33 26 C33 22 31 20 28 20 C28 16 30 13 32 11 Z" opacity="0.8" />
            </svg>
          </div>

          <p class="font-serif text-xl md:text-3xl text-[#1a1614] italic leading-relaxed px-4 md:px-8">
            "{{ data.quoteText || 'Love is not love which alters when it alteration finds, or bends with the remover to remove. O no! it is an ever-fixed mark that looks on tempests and is never shaken.' }}"
          </p>

          <div class="flex items-center justify-center gap-3">
            <span class="w-12 h-px bg-[#bfa15f]/50"></span>
            <span class="w-1.5 h-1.5 rotate-45 bg-[#bfa15f]"></span>
            <span class="w-12 h-px bg-[#bfa15f]/50"></span>
          </div>

          <p class="text-[10px] md:text-xs font-sans font-bold text-[#9c7c38] tracking-[0.35em] uppercase">
            {{ data.quoteSource || 'William Shakespeare · Sonnet 116' }}
          </p>
        </div>
      </section>

      <!-- PROFIL MEMPELAI (THE GROOM & THE BRIDE) -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="py-24 md:py-36 px-6 md:px-12 bg-[#fcfbf7] relative" v-observe>
        <div class="max-w-5xl mx-auto space-y-20">
          
          <div class="text-center space-y-3">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#9c7c38] font-sans font-bold">The Betrothed</p>
            <h2 class="text-3xl md:text-6xl font-serif text-[#1a1614]">The Gentleman &amp; The Lady</h2>
            <div class="flex items-center justify-center gap-4 text-[#bfa15f] opacity-80 pt-1">
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
              <i class="fa-solid fa-feather-pointed text-xs"></i>
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#635b54] max-w-lg mx-auto font-sans leading-relaxed">
              With joyous hearts and high regard, we formally introduce the bride and groom embarking upon a lifelong devotion.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-14 md:gap-16 items-center">
            
            <!-- Groom Card -->
            <div class="space-y-6 text-center md:text-left flex flex-col items-center md:items-start" v-observe>
              <div class="relative w-64 md:w-72">
                <div class="p-3 bg-[#f4f1ea] border border-[#bfa15f]/40 rounded-xl shadow-[0_12px_32px_rgba(26,22,20,0.06)]">
                  <div class="p-1 border border-[#bfa15f]/30 rounded-lg">
                    <div class="aspect-[4/5] bg-[#eae5db] rounded-md overflow-hidden relative group">
                      <img
                        :src="data.groomPhotoUrl || defaultGroomPhoto"
                        :alt="data.groomName || 'The Groom'"
                        class="w-full h-full object-cover filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
                <!-- Lineage Tag -->
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 bg-[#1a1614] border border-[#bfa15f] px-4 py-1 rounded-full text-[9px] text-[#fcfbf7] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  The Gentleman
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-4xl font-serif text-[#1a1614] font-bold">
                  {{ data.groomName || 'Alexander Sterling' }}
                </h3>
                <p class="text-[10px] font-sans uppercase tracking-[0.25em] text-[#9c7c38] font-bold">Son of</p>
                <p class="text-xs md:text-sm font-sans text-[#635b54] leading-relaxed">
                  {{ data.parents?.groomParents || 'Lord & Lady Sterling' }}
                </p>
                <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                  <a
                    :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                    target="_blank"
                    class="inline-flex items-center gap-2 text-xs font-sans text-[#1a1614] hover:text-[#bfa15f] border-b border-[#bfa15f] pb-0.5 transition-colors uppercase tracking-widest"
                  >
                    <i class="fa-brands fa-instagram"></i>
                    <span>@{{ cleanInstagramHandle(data.socialMediaGroom.instagram) }}</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Bride Card -->
            <div class="space-y-6 text-center md:text-left flex flex-col items-center md:items-start" v-observe>
              <div class="relative w-64 md:w-72">
                <div class="p-3 bg-[#f4f1ea] border border-[#bfa15f]/40 rounded-xl shadow-[0_12px_32px_rgba(26,22,20,0.06)]">
                  <div class="p-1 border border-[#bfa15f]/30 rounded-lg">
                    <div class="aspect-[4/5] bg-[#eae5db] rounded-md overflow-hidden relative group">
                      <img
                        :src="data.bridePhotoUrl || defaultBridePhoto"
                        :alt="data.brideName || 'The Bride'"
                        class="w-full h-full object-cover filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
                <!-- Lineage Tag -->
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 bg-[#1a1614] border border-[#bfa15f] px-4 py-1 rounded-full text-[9px] text-[#fcfbf7] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  The Lady
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-4xl font-serif text-[#1a1614] font-bold">
                  {{ data.brideName || 'Victoria Windsor' }}
                </h3>
                <p class="text-[10px] font-sans uppercase tracking-[0.25em] text-[#9c7c38] font-bold">Daughter of</p>
                <p class="text-xs md:text-sm font-sans text-[#635b54] leading-relaxed">
                  {{ data.parents?.brideParents || 'Sir & Lady Windsor' }}
                </p>
                <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                  <a
                    :href="formatInstagramUrl(data.socialMediaBrides.instagram)"
                    target="_blank"
                    class="inline-flex items-center gap-2 text-xs font-sans text-[#1a1614] hover:text-[#bfa15f] border-b border-[#bfa15f] pb-0.5 transition-colors uppercase tracking-widest"
                  >
                    <i class="fa-brands fa-instagram"></i>
                    <span>@{{ cleanInstagramHandle(data.socialMediaBrides.instagram) }}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- COUNTDOWN TIMER SECTION (Classy Minimal Roman / Numerical Layout) -->
      <section class="py-20 md:py-28 px-6 bg-[#f4f1ea] border-y border-[#bfa15f]/30" v-observe>
        <div class="max-w-3xl mx-auto text-center space-y-8">
          <div class="space-y-2">
            <p class="text-[9px] uppercase tracking-[0.4em] text-[#9c7c38] font-sans font-bold">The Epoch Approaches</p>
            <h2 class="text-2xl md:text-5xl font-serif text-[#1a1614]">Until The Sacred Vows</h2>
          </div>

          <!-- Classy Roman / Numerical Grid -->
          <div class="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto">
            <div
              v-for="(item, key) in countdownItems"
              :key="key"
              class="p-4 md:p-6 bg-[#fcfbf7] border border-[#bfa15f]/40 rounded-xl shadow-[0_8px_20px_rgba(26,22,20,0.04)] text-center relative group hover:border-[#bfa15f] transition-all"
            >
              <div class="text-[8px] md:text-[9px] font-serif uppercase tracking-[0.2em] text-[#9c7c38] mb-1 font-semibold">
                {{ item.roman }}
              </div>
              <div class="text-2xl md:text-4xl font-serif font-bold text-[#1a1614] tracking-tight">
                {{ item.value }}
              </div>
              <div class="text-[8px] md:text-[9px] font-sans uppercase tracking-[0.2em] text-[#635b54] mt-1 font-medium">
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CEREMONY & RECEPTION ITINERARY -->
      <section v-if="isSectionEnabled('event')" id="event" class="py-24 md:py-36 px-6 md:px-12 bg-[#fcfbf7] relative" v-observe>
        <div class="max-w-5xl mx-auto space-y-20">
          
          <div class="text-center space-y-3">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#9c7c38] font-sans font-bold">The Order of Events</p>
            <h2 class="text-3xl md:text-6xl font-serif text-[#1a1614]">Solemnisation &amp; Grand Soirée</h2>
            <div class="flex items-center justify-center gap-4 text-[#bfa15f] opacity-80 pt-1">
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
              <i class="fa-solid fa-champagne-glasses text-xs"></i>
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#635b54] max-w-lg mx-auto font-sans leading-relaxed">
              We cordially request your graceful attendance at the ceremonies as scheduled below.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 md:gap-12">
            
            <!-- Akad / Holy Matrimony -->
            <div
              v-if="data.akadLocation?.dateTime || data.akadLocation?.address || !data.resepsiLocation"
              class="p-8 md:p-10 bg-[#f4f1ea] border border-[#bfa15f]/40 rounded-2xl shadow-[0_12px_30px_rgba(26,22,20,0.06)] relative overflow-hidden flex flex-col justify-between space-y-6"
            >
              <div class="space-y-4">
                <div class="flex items-center justify-between border-b border-[#bfa15f]/20 pb-4">
                  <span class="text-[10px] font-sans uppercase tracking-[0.3em] text-[#9c7c38] font-bold">Part I</span>
                  <i class="fa-solid fa-ring text-[#bfa15f]"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#1a1614] font-bold">
                  {{ data.akadTitle || 'Holy Matrimony & Akad' }}
                </h3>
                <div class="space-y-2 text-xs md:text-sm font-sans text-[#635b54]">
                  <p class="flex items-center gap-2 font-medium text-[#1a1614]">
                    <i class="fa-regular fa-calendar text-[#bfa15f]"></i>
                    <span>{{ formatDate(data.akadLocation?.dateTime || data.dateTime) }}</span>
                  </p>
                  <p class="flex items-center gap-2 font-medium text-[#1a1614]">
                    <i class="fa-regular fa-clock text-[#bfa15f]"></i>
                    <span>{{ formatTime(data.akadLocation?.dateTime || data.dateTime) }}</span>
                  </p>
                  <p class="pt-2 leading-relaxed">
                    <strong>{{ data.akadLocation?.venue || 'The Grand Estate Chapel' }}</strong><br />
                    {{ data.akadLocation?.address || 'Private Estate Grounds' }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-4 space-y-2.5">
                <a
                  v-if="data.akadLocation?.mapUrl || data.akadLocation?.address"
                  :href="data.akadLocation?.mapUrl || getGoogleMapsSearchUrl(data.akadLocation?.address)"
                  target="_blank"
                  class="w-full py-3 bg-[#1a1614] hover:bg-[#2b2420] text-[#fcfbf7] border border-[#bfa15f]/40 rounded-xl text-xs font-sans uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <i class="fa-solid fa-location-dot text-[#bfa15f]"></i>
                  <span>View Estate Map</span>
                </a>
                <button
                  @click="addToCalendar('Akad')"
                  class="w-full py-2.5 bg-transparent hover:bg-[#bfa15f]/15 text-[#1a1614] border border-[#bfa15f]/40 rounded-xl text-[11px] font-sans uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <i class="fa-regular fa-calendar-plus text-[#9c7c38]"></i>
                  <span>Add to Calendar</span>
                </button>
              </div>
            </div>

            <!-- Resepsi / Evening Reception -->
            <div
              class="p-8 md:p-10 bg-[#f4f1ea] border border-[#bfa15f]/40 rounded-2xl shadow-[0_12px_30px_rgba(26,22,20,0.06)] relative overflow-hidden flex flex-col justify-between space-y-6"
            >
              <div class="space-y-4">
                <div class="flex items-center justify-between border-b border-[#bfa15f]/20 pb-4">
                  <span class="text-[10px] font-sans uppercase tracking-[0.3em] text-[#9c7c38] font-bold">Part II</span>
                  <i class="fa-solid fa-champagne-glasses text-[#bfa15f]"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#1a1614] font-bold">
                  {{ data.resepsiTitle || 'Wedding Reception Soirée' }}
                </h3>
                <div class="space-y-2 text-xs md:text-sm font-sans text-[#635b54]">
                  <p class="flex items-center gap-2 font-medium text-[#1a1614]">
                    <i class="fa-regular fa-calendar text-[#bfa15f]"></i>
                    <span>{{ formatDate(data.resepsiLocation?.dateTime || data.dateTime) }}</span>
                  </p>
                  <p class="flex items-center gap-2 font-medium text-[#1a1614]">
                    <i class="fa-regular fa-clock text-[#bfa15f]"></i>
                    <span>{{ formatTime(data.resepsiLocation?.dateTime || data.dateTime) }}</span>
                  </p>
                  <p class="pt-2 leading-relaxed">
                    <strong>{{ data.resepsiLocation?.venue || 'The Grand Ballroom & Conservatory' }}</strong><br />
                    {{ data.resepsiLocation?.address || 'High-Society Estate Club' }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-4 space-y-2.5">
                <a
                  v-if="data.resepsiLocation?.mapUrl || data.resepsiLocation?.address"
                  :href="data.resepsiLocation?.mapUrl || getGoogleMapsSearchUrl(data.resepsiLocation?.address)"
                  target="_blank"
                  class="w-full py-3 bg-[#1a1614] hover:bg-[#2b2420] text-[#fcfbf7] border border-[#bfa15f]/40 rounded-xl text-xs font-sans uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <i class="fa-solid fa-location-dot text-[#bfa15f]"></i>
                  <span>View Estate Map</span>
                </a>
                <button
                  @click="addToCalendar('Resepsi')"
                  class="w-full py-2.5 bg-transparent hover:bg-[#bfa15f]/15 text-[#1a1614] border border-[#bfa15f]/40 rounded-xl text-[11px] font-sans uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <i class="fa-regular fa-calendar-plus text-[#9c7c38]"></i>
                  <span>Add to Calendar</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Dress Code Announcement Card -->
          <div v-if="isSectionEnabled('dress-code')" class="p-6 md:p-8 border border-[#bfa15f]/35 bg-[#f4f1ea] rounded-xl text-center space-y-3 max-w-xl mx-auto shadow-sm">
            <span class="text-[9px] font-sans uppercase tracking-[0.35em] text-[#9c7c38] font-bold">Attire Etiquette</span>
            <h4 class="text-xl font-serif text-[#1a1614] font-bold">Dress Code: {{ data.dressCode || 'High-Society Black Tie & Formal Elegance' }}</h4>
            <p class="text-xs font-sans text-[#635b54] leading-relaxed max-w-md mx-auto">
              We warmly invite gentlemen to don dark suits or tuxedos, and ladies to grace the celebration in floor-length gowns of muted earthy &amp; champagne hues.
            </p>
            <div class="flex justify-center items-center gap-3 pt-2">
              <span class="w-4 h-4 rounded-full bg-[#1a1614] border border-[#bfa15f]/50" title="Espresso Noir"></span>
              <span class="w-4 h-4 rounded-full bg-[#f4f1ea] border border-[#bfa15f]/50" title="Ivory Cream"></span>
              <span class="w-4 h-4 rounded-full bg-[#bfa15f] border border-[#bfa15f]/50" title="Antique Gold"></span>
              <span class="w-4 h-4 rounded-full bg-[#635b54] border border-[#bfa15f]/50" title="Warm Slate"></span>
            </div>
          </div>

        </div>
      </section>

      <!-- OUR JOURNEY / LOVE STORY (Monograph Editorial Chapters) -->
      <section v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" id="story" class="py-24 md:py-36 px-6 md:px-12 bg-[#f7f4ee] border-y border-[#bfa15f]/25" v-observe>
        <div class="max-w-4xl mx-auto space-y-20">
          
          <div class="text-center space-y-3">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#9c7c38] font-sans font-bold">Our Chronicle</p>
            <h2 class="text-3xl md:text-6xl font-serif text-[#1a1614]">The Chapters of Our Love</h2>
            <div class="flex items-center justify-center gap-4 text-[#bfa15f] opacity-80 pt-1">
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
              <i class="fa-solid fa-book-bookmark text-xs"></i>
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#635b54] max-w-lg mx-auto font-sans leading-relaxed">
              Moments woven with quiet grace, shared laughter, and an enduring promise written in time.
            </p>
          </div>

          <!-- Chronicle Items -->
          <div class="space-y-16">
            <div
              v-for="(story, idx) in displayedStories"
              :key="idx"
              class="grid md:grid-cols-12 gap-8 items-center"
              v-observe
            >
              <div
                class="md:col-span-5"
                :class="idx % 2 === 0 ? 'md:order-1' : 'md:order-2'"
              >
                <div class="p-2.5 bg-[#fcfbf7] border border-[#bfa15f]/35 rounded-xl shadow-md">
                  <div class="aspect-[4/3] bg-[#eae5db] rounded-lg overflow-hidden relative">
                    <img
                      v-if="story.image || isPreviewMode"
                      :src="story.image || defaultStoryPhoto"
                      :alt="story.title"
                      class="w-full h-full object-cover filter contrast-[1.02]"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-[#bfa15f]">
                      <i class="fa-solid fa-heart text-3xl opacity-30"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="md:col-span-7 space-y-3"
                :class="idx % 2 === 0 ? 'md:order-2 text-left' : 'md:order-1 text-left md:text-right'"
              >
                <span class="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-[#9c7c38]">
                  Chapter {{ getRomanNumeral(idx + 1) }} • {{ story.date }}
                </span>
                <h3 class="text-2xl md:text-3xl font-serif text-[#1a1614] font-bold">
                  {{ story.title }}
                </h3>
                <p class="text-xs md:text-sm text-[#635b54] font-sans leading-relaxed">
                  {{ story.description }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- GALLERY EXHIBITION & PREWEDDING VIDEO -->
      <section v-if="isSectionEnabled('gallery')" id="gallery" class="py-24 md:py-36 px-6 md:px-12 bg-[#fcfbf7] relative" v-observe>
        <div class="max-w-5xl mx-auto space-y-16">
          
          <div class="text-center space-y-3">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#9c7c38] font-sans font-bold">Visual Chronicle</p>
            <h2 class="text-3xl md:text-6xl font-serif text-[#1a1614]">The Portrait Exhibition</h2>
            <div class="flex items-center justify-center gap-4 text-[#bfa15f] opacity-80 pt-1">
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
              <i class="fa-solid fa-camera text-xs"></i>
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#635b54] max-w-lg mx-auto font-sans leading-relaxed">
              Curated glimpses into our most cherished days, captured with quiet elegance.
            </p>
          </div>

          <!-- Video Prewedding Embed if present -->
          <div v-if="data.videoPrewedding" class="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-[#bfa15f]/40 shadow-xl bg-black">
            <div class="aspect-video w-full">
              <iframe
                :src="getEmbedUrlVideo(data.videoPrewedding)"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Gallery Component -->
          <GalleryInvitation
            v-if="galleryImages.length"
            :items="galleryImages"
          />

        </div>
      </section>

      <!-- WEDDING REGISTRY & DIGITAL ENVELOPE -->
      <section v-if="isSectionEnabled('gift')" id="gift" class="py-24 md:py-36 px-6 md:px-12 bg-[#f7f4ee] border-y border-[#bfa15f]/25" v-observe>
        <div class="max-w-3xl mx-auto text-center space-y-16">
          
          <div class="space-y-3">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#9c7c38] font-sans font-bold">Wedding Registry</p>
            <h2 class="text-3xl md:text-6xl font-serif text-[#1a1614]">Tanda Kasih &amp; Tokens of Regard</h2>
            <div class="flex items-center justify-center gap-4 text-[#bfa15f] opacity-80 pt-1">
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
              <i class="fa-solid fa-gift text-xs"></i>
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#635b54] max-w-lg mx-auto font-sans leading-relaxed">
              Your blessing and presence are the greatest gifts of all. Should you wish to bestow a token of affection, electronic envelopes and registry details are provided below.
            </p>
          </div>

          <!-- Bank Accounts Grid -->
          <div v-if="data.bankAccounts?.length" class="grid md:grid-cols-2 gap-6 text-left">
            <div
              v-for="(acc, idx) in data.bankAccounts"
              :key="idx"
              class="p-6 md:p-8 bg-[#fcfbf7] border border-[#bfa15f]/35 rounded-2xl shadow-sm space-y-4 relative overflow-hidden group hover:border-[#bfa15f] transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-widest text-[#9c7c38] font-bold font-sans">{{ acc.bankName }}</span>
                <i class="fa-solid fa-building-columns text-[#bfa15f]/70"></i>
              </div>
              <div class="space-y-1">
                <p class="text-xl md:text-2xl font-serif font-bold text-[#1a1614] tracking-wider">{{ acc.accountNumber }}</p>
                <p class="text-xs text-[#635b54] font-sans">a.n. {{ acc.accountName }}</p>
              </div>
              <button
                @click="copyToClipboard(acc.accountNumber)"
                class="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#1a1614] hover:bg-[#2b2420] text-[#fcfbf7] rounded-xl transition-all text-xs font-sans font-bold uppercase tracking-wider cursor-pointer"
              >
                <i class="fa-regular fa-copy text-[#bfa15f]"></i>
                <span>Salin Nomor Rekening</span>
              </button>
            </div>
          </div>

          <!-- E-Wallets -->
          <div v-if="walletItems.length" class="space-y-4 max-w-md mx-auto text-left">
            <div
              v-for="(wallet, idx) in walletItems"
              :key="idx"
              class="p-6 bg-[#fcfbf7] border border-[#bfa15f]/35 rounded-2xl space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-widest text-[#9c7c38] font-bold font-sans">{{ wallet.wallet_provider || 'E-Wallet' }}</span>
                <i class="fa-solid fa-wallet text-[#bfa15f]/70"></i>
              </div>
              <p class="text-lg font-serif font-bold text-[#1a1614]">{{ wallet.wallet_number }}</p>
              <button
                @click="copyToClipboard(wallet.wallet_number)"
                class="inline-flex items-center justify-center gap-2 w-full py-2 bg-[#1a1614] hover:bg-[#2b2420] text-[#fcfbf7] rounded-lg text-xs font-sans font-bold uppercase cursor-pointer"
              >
                <i class="fa-regular fa-copy text-[#bfa15f]"></i>
                <span>Salin Nomor E-Wallet</span>
              </button>
            </div>
          </div>

          <!-- Physical Gifts Delivery Address -->
          <div v-if="giftAddresses.length" class="space-y-4 max-w-lg mx-auto text-left font-sans">
            <div
              v-for="(addr, idx) in giftAddresses"
              :key="idx"
              class="p-6 bg-[#fcfbf7] border border-[#bfa15f]/35 rounded-2xl space-y-3"
            >
              <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9c7c38] font-bold">
                <i class="fa-solid fa-box-open text-[#bfa15f]"></i>
                <span>Estate Parcel Address / Kirim Kado Fisik</span>
              </div>
              <p class="text-xs text-[#635b54] leading-relaxed">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="inline-flex items-center justify-center gap-2 w-full py-2 bg-[#1a1614] hover:bg-[#2b2420] text-[#fcfbf7] rounded-lg text-xs font-bold uppercase cursor-pointer"
              >
                <i class="fa-regular fa-copy text-[#bfa15f]"></i>
                <span>Salin Alamat Kirim</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- RSVP & WELL WISHES (The Guestbook & Registry) -->
      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="py-24 md:py-36 px-6 md:px-12 bg-[#fcfbf7] relative" v-observe>
        <div class="max-w-2xl mx-auto text-center space-y-12">
          
          <div class="space-y-3">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#9c7c38] font-sans font-bold">Kindly Respond</p>
            <h2 class="text-3xl md:text-6xl font-serif text-[#1a1614]">RSVP &amp; Book of Regard</h2>
            <div class="flex items-center justify-center gap-4 text-[#bfa15f] opacity-80 pt-1">
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
              <i class="fa-solid fa-signature text-xs"></i>
              <span class="w-16 h-px bg-[#bfa15f]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#635b54] max-w-lg mx-auto font-sans leading-relaxed">
              We look forward to honoring your presence. Please confirm your attendance and pen your esteemed wishes.
            </p>
          </div>

          <!-- RSVP Form -->
          <form @submit.prevent="submitRsvp" class="p-8 md:p-10 bg-[#f4f1ea] border border-[#bfa15f]/40 rounded-3xl shadow-[0_12px_36px_rgba(26,22,20,0.06)] space-y-6 text-left font-sans">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#9c7c38] font-bold mb-2">Nama Lengkap (Your Full Name)</label>
              <input
                v-model="rsvp.name"
                type="text"
                required
                placeholder="Lord / Lady / Nama Anda..."
                class="w-full px-4 py-3 bg-[#fcfbf7] border border-[#bfa15f]/40 rounded-xl text-[#1a1614] placeholder-[#a89f91] focus:outline-none focus:border-[#bfa15f] text-sm"
              />
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#9c7c38] font-bold mb-2">Konfirmasi Kehadiran</label>
              <select
                v-model="rsvp.attendance"
                class="w-full px-4 py-3 bg-[#fcfbf7] border border-[#bfa15f]/40 rounded-xl text-[#1a1614] focus:outline-none focus:border-[#bfa15f] text-sm"
              >
                <option value="hadir">Will Attend with Pleasure (Hadir)</option>
                <option value="tidak_hadir">Regretfully Decline (Tidak Dapat Hadir)</option>
                <option value="ragu">Uncertain at Present (Belum Pasti)</option>
              </select>
            </div>

            <div v-if="rsvp.attendance === 'hadir'">
              <label class="block text-xs uppercase tracking-wider text-[#9c7c38] font-bold mb-2">Jumlah Tamu Hadir</label>
              <input
                v-model.number="rsvp.totalGuests"
                type="number"
                min="1"
                max="10"
                class="w-full px-4 py-3 bg-[#fcfbf7] border border-[#bfa15f]/40 rounded-xl text-[#1a1614] focus:outline-none focus:border-[#bfa15f] text-sm"
              />
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#9c7c38] font-bold mb-2">Doa &amp; Pesan Hangat (Warm Regards)</label>
              <textarea
                v-model="rsvp.message"
                rows="4"
                required
                placeholder="Tulis ucapan dan doa restu untuk kedua mempelai..."
                class="w-full px-4 py-3 bg-[#fcfbf7] border border-[#bfa15f]/40 rounded-xl text-[#1a1614] placeholder-[#a89f91] focus:outline-none focus:border-[#bfa15f] text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submittingRsvp"
              class="w-full py-4 bg-[#1a1614] hover:bg-[#2b2420] text-[#fcfbf7] border border-[#bfa15f]/60 font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(26,22,20,0.15)] text-xs uppercase tracking-[0.25em] hover:brightness-105 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <span v-if="submittingRsvp">Menyampaikan Pesan...</span>
              <span v-else>Confirm &amp; Send Regards</span>
            </button>
          </form>

          <!-- List of Wishes -->
          <div v-if="displayWishes.length" class="space-y-4 text-left max-h-96 overflow-y-auto no-scrollbar">
            <div
              v-for="(msg, idx) in displayWishes"
              :key="idx"
              class="p-5 border border-[#bfa15f]/25 bg-[#f4f1ea]/80 rounded-2xl space-y-2 shadow-sm"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-[#1a1614] text-sm">{{ msg.name }}</span>
                <span
                  class="text-[9px] px-2.5 py-0.5 rounded-full font-sans uppercase font-bold"
                  :class="msg.attendance === 'hadir' ? 'bg-[#bfa15f]/20 text-[#9c7c38]' : 'bg-[#e5e0d8] text-[#786f65]'"
                >
                  {{ msg.attendance === 'hadir' ? 'Attending' : 'Decline' }}
                </span>
              </div>
              <p class="text-xs text-[#635b54] font-sans leading-relaxed">"{{ msg.message }}"</p>
            </div>
          </div>

        </div>
      </section>

      <!-- EXTENDED FAMILY & TURUT MENGUNDANG -->
      <footer class="py-24 md:py-32 bg-[#1a1614] text-center text-[#fcfbf7] border-t-2 border-[#bfa15f] relative overflow-hidden">
        
        <!-- Turut Mengundang Badges -->
        <div v-if="normalizedExtendedFamily.length" class="max-w-2xl mx-auto px-6 mb-16 space-y-6">
          <p class="text-[10px] uppercase tracking-[0.4em] text-[#bfa15f] font-sans font-bold">Turut Mengundang / Kinship &amp; Extended Family</p>
          <div class="flex flex-wrap justify-center gap-2.5 font-sans">
            <span
              v-for="(fam, idx) in normalizedExtendedFamily"
              :key="idx"
              class="px-4 py-2 bg-[#241e1b] border border-[#bfa15f]/30 rounded-full text-xs text-[#e8e2d5]"
            >
              {{ fam }}
            </span>
          </div>
        </div>

        <div class="relative z-10 px-6 space-y-6">
          <!-- Monogram Laurel Crest in Footer -->
          <div class="flex justify-center text-[#bfa15f]">
            <div class="w-16 h-16">
              <svg viewBox="0 0 160 160" class="w-full h-full" fill="none">
                <path d="M80 18 L87 27 L98 22 L94 36 L66 36 L62 22 L73 27 Z" fill="#bfa15f" opacity="0.9" />
                <path d="M72 135 C50 132 34 114 32 84 C30 60 44 42 62 38" stroke="#bfa15f" stroke-width="1.8" stroke-linecap="round" />
                <path d="M88 135 C110 132 126 114 128 84 C130 60 116 42 98 38" stroke="#bfa15f" stroke-width="1.8" stroke-linecap="round" />
                <text x="80" y="88" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-weight="700" font-size="28" fill="#fcfbf7" letter-spacing="2">
                  {{ coupleMonogram }}
                </text>
              </svg>
            </div>
          </div>

          <h2 class="font-serif text-3xl md:text-5xl text-[#fcfbf7] font-bold">
            {{ data.groomName || 'Alexander' }} &amp; {{ data.brideName || 'Victoria' }}
          </h2>

          <p v-if="data.footerText" class="text-xs md:text-sm text-[#b5ada3] max-w-md mx-auto font-sans leading-relaxed">
            {{ data.footerText }}
          </p>
          <p v-else class="text-xs md:text-sm text-[#b5ada3] max-w-md mx-auto font-sans leading-relaxed italic">
            "With heartfelt gratitude for gracing our life's most sacred milestone with your prayers, presence, and timeless regard."
          </p>

          <div class="flex flex-col items-center space-y-4 pt-6">
            <p class="text-[9px] uppercase tracking-[0.4em] text-[#bfa15f] font-sans font-bold">
              The Grand Monogram Collection · Anno Domini MMXXVI
            </p>
            <WatermarkBadge variant="dark" />
          </div>
        </div>

      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const toast = useToast()
const data = ref(props.data || {})

watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
    initData()
  },
  { deep: true, immediate: true }
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)
const showWelcome = ref(true)
const isBreakingSeal = ref(false)
const activeSection = ref('home')
const submittingRsvp = ref(false)

// Default stock imagery for high-society quiet luxury
const defaultCouplePhoto = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
const defaultGroomPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
const defaultBridePhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
const defaultStoryPhoto = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'

// Couple Names & Initials
const groomFirstName = computed(() => {
  return data.value.groomName ? data.value.groomName.split(' ')[0] : 'Alexander'
})

const brideFirstName = computed(() => {
  return data.value.brideName ? data.value.brideName.split(' ')[0] : 'Victoria'
})

const coupleMonogram = computed(() => {
  const gInit = groomFirstName.value ? groomFirstName.value.charAt(0).toUpperCase() : 'A'
  const bInit = brideFirstName.value ? brideFirstName.value.charAt(0).toUpperCase() : 'V'
  return `${gInit}&${bInit}`
})

// Section Filter Rule
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
    gift: ['gift', 'digital-envelope', 'rek'],
    rsvp: ['rsvp', 'guestbook', 'wishes'],
    quote: ['quote', 'romantic-quote']
  }
  const aliases = aliasMap[key] || [key]
  return aliases.some((a) => sections.includes(a))
}

// Navigation Items
const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'couple', label: 'Betrothed', icon: 'fa-solid fa-crown', key: 'couple' },
  { id: 'event', label: 'Itinerary', icon: 'fa-solid fa-calendar-check', key: 'event' },
  { id: 'story', label: 'Chronicle', icon: 'fa-solid fa-book-bookmark', key: 'love-story' },
  { id: 'gallery', label: 'Exhibition', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'gift', label: 'Registry', icon: 'fa-solid fa-gift', key: 'gift' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-feather-pointed', key: 'rsvp' }
]

const navItems = computed(() => {
  return allNavItems.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'story') return isSectionEnabled('love-story') && (data.value.loveStory?.length > 0 || isPreviewMode.value)
    return isSectionEnabled(item.key)
  })
})

// Extended Family Normalization
const normalizedExtendedFamily = computed(() => {
  const ef = data.value.extendedFamily
  if (Array.isArray(ef) && ef.length) return ef
  const tm = data.value.turutMengundang
  if (typeof tm === 'string' && tm.trim()) {
    return tm.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
  }
  return []
})

// Gift details normalization
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
        wallet_image: ''
      }
    })
    .filter(Boolean)
})

const galleryImages = computed(() => {
  if (Array.isArray(data.value.galleryImages) && data.value.galleryImages.length) {
    return data.value.galleryImages.map((img) =>
      typeof img === 'object' && img?.src ? img : { src: String(img || ''), thumbnail: String(img || '') }
    )
  }
  return [
    { src: defaultCouplePhoto, thumbnail: defaultCouplePhoto },
    { src: defaultGroomPhoto, thumbnail: defaultGroomPhoto },
    { src: defaultBridePhoto, thumbnail: defaultBridePhoto }
  ]
})

// Story Items
const mockStories = [
  {
    title: 'The Serendipitous Encounter',
    date: 'Autumn, 2022',
    description: 'A shared conversation over bespoke coffee under the twilight of London, sparking a quiet revelation.'
  },
  {
    title: 'The Suitor’s Promise',
    date: 'Spring, 2024',
    description: 'Beneath the centuries-old olive arches of Tuscany, a promise of devotion sealed forever with an heirloom ring.'
  },
  {
    title: 'The Eternal Vow',
    date: 'Present Day',
    description: 'Stepping forward into high estate, joining two distinguished heritages into a single harmonious family.'
  }
]

const displayedStories = computed(() => {
  if (data.value.loveStory && data.value.loveStory.length > 0) {
    return data.value.loveStory
  }
  return mockStories
})

// Countdown Timer logic
const countdown = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let timerInterval = null

const countdownItems = computed(() => [
  { roman: 'DIES', value: countdown.value.days, label: 'Days' },
  { roman: 'HORAE', value: countdown.value.hours, label: 'Hours' },
  { roman: 'MINUTA', value: countdown.value.minutes, label: 'Minutes' },
  { roman: 'SECUNDA', value: countdown.value.seconds, label: 'Seconds' }
])

function updateCountdown() {
  const targetDateStr = data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
  if (!targetDateStr) {
    countdown.value = { days: '14', hours: '08', minutes: '32', seconds: '45' }
    return
  }
  const target = new Date(targetDateStr).getTime()
  const now = new Date().getTime()
  const diff = target - now
  if (diff <= 0) {
    countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
    return
  }
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  countdown.value = {
    days: String(d).padStart(2, '0'),
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
}

// RSVP & Guest Messages
const rsvp = ref({
  name: data.value.guestName || '',
  attendance: 'hadir',
  totalGuests: 1,
  message: ''
})

const guestMessages = ref([])

const mockWishes = [
  {
    name: 'Duke & Duchess of Somerset',
    attendance: 'hadir',
    message: 'Wishing both of you eternal happiness, peace, and grace in this exquisite union.'
  },
  {
    name: 'Sir Charles Kensington',
    attendance: 'hadir',
    message: 'The warmest congratulations to the honorable couple. May your legacy shine forever.'
  }
]

const displayWishes = computed(() => {
  if (guestMessages.value.length > 0) return guestMessages.value
  return mockWishes
})

async function fetchGuestMessages() {
  if (!data.value.id || isPreviewMode.value) return
  try {
    const res = await getGuestMessagesByInvitationId(data.value.id)
    if (res?.data) {
      guestMessages.value = res.data
    } else if (Array.isArray(res)) {
      guestMessages.value = res
    }
  } catch (err) {
    console.warn('Failed to load guest messages:', err)
  }
}

async function submitRsvp() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) {
    toast.error('Mohon lengkapi nama dan konfirmasi kehadiran.')
    return
  }
  submittingRsvp.value = true
  try {
    if (data.value.id && !isPreviewMode.value) {
      await createGuestMessage({
        invitationId: data.value.id,
        name: rsvp.value.name,
        message: rsvp.value.message,
        attendance: rsvp.value.attendance,
        totalGuests: rsvp.value.totalGuests
      })
    }
    guestMessages.value.unshift({
      name: rsvp.value.name,
      message: rsvp.value.message,
      attendance: rsvp.value.attendance
    })
    toast.success('Your warmest regards have been recorded with honor.')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Unable to transmit response. Please try again.')
  } finally {
    submittingRsvp.value = false
  }
}

// Interactive Wax Seal Break Action
function handleBreakSeal() {
  isBreakingSeal.value = true
  setTimeout(() => {
    showWelcome.value = false
    setTimeout(() => {
      const el = document.getElementById('main-content')
      if (el) el.classList.remove('opacity-0')
      initScrollSpy()
    }, 150)
  }, 400)
}

function scrollToSection(id) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { threshold: 0.35 })

  navItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

// Helpers
const formattedHeroDate = computed(() => {
  const dateStr = data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
  if (!dateStr) return 'AUTUMN MMXXVI'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'AUTUMN MMXXVI'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
})

const formattedEventDate = computed(() => {
  const dateStr = data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
  if (!dateStr) return 'SATURDAY, OCTOBER 24, 2026'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'SATURDAY, OCTOBER 24, 2026'
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
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

function formatInstagramUrl(handle) {
  if (!handle) return '#'
  return `https://instagram.com/${handle.replace('@', '')}`
}

function cleanInstagramHandle(handle) {
  if (!handle) return ''
  return handle.replace('@', '')
}

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied to clipboard with grace.')
  })
}

function getGoogleMapsSearchUrl(address) {
  if (!address) return '#'
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

function addToCalendar(eventType) {
  const targetDateStr = eventType === 'Akad'
    ? data.value.akadLocation?.dateTime || data.value.dateTime
    : data.value.resepsiLocation?.dateTime || data.value.dateTime
  const venue = eventType === 'Akad'
    ? data.value.akadLocation?.venue || data.value.akadLocation?.address || ''
    : data.value.resepsiLocation?.venue || data.value.resepsiLocation?.address || ''
  
  const title = `Wedding of ${data.value.groomName || 'Alexander'} & ${data.value.brideName || 'Victoria'} - ${eventType}`
  const startDate = targetDateStr ? new Date(targetDateStr) : new Date()
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
  
  const formatCalTime = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "")
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatCalTime(startDate)}/${formatCalTime(endDate)}&details=${encodeURIComponent('High-Society Wedding Celebration')}&location=${encodeURIComponent(venue)}`
  window.open(calUrl, '_blank')
}

function getRomanNumeral(num) {
  const romanMap = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
  return romanMap[num - 1] || String(num)
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }
  updateCountdown()
  fetchGuestMessages()
}

// Fade in observer directive
const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out')
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
      { threshold: 0.1 }
    )
    observer.observe(el)
  }
}

onMounted(() => {
  initData()
  timerInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');

.font-serif {
  font-family: 'Cormorant Garamond', Garamond, 'Times New Roman', serif;
}

.font-sans {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
