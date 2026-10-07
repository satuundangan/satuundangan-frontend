<template>
  <div
    class="purrfect-match-theme relative min-h-screen bg-[#FFFDF9] text-[#2B2D42] overflow-x-hidden selection:bg-[#FFCCD5] selection:text-[#2B2D42]"
  >
    <!-- ============================================================== -->
    <!-- 1. AMBIENT BACKGROUND & FLOATING PAW CANVAS                    -->
    <!-- ============================================================== -->
    <!-- Soft Pastel Gradient Warm Canvas -->
    <div
      class="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,162,97,0.12),transparent_70%),radial-gradient(ellipse_60%_50%_at_50%_110%,rgba(255,204,213,0.18),transparent_70%)]"
    ></div>

    <!-- Soft Ambient Paw Print Particles Canvas -->
    <canvas
      ref="pawCanvas"
      class="fixed inset-0 w-full h-full pointer-events-none z-[1]"
    ></canvas>

    <!-- ============================================================== -->
    <!-- 2. FIXED CORNER ORNAMENTS (z-40 pointer-events-none select-none)-->
    <!-- Whimsical Sleeping Kittens, Paws & Playful Yarn Trails         -->
    <!-- ============================================================== -->
    <!-- Top-Left Corner: Sleeping Kitten on Cozy Pillow & Looping Yarn -->
    <div
      class="fixed top-0 left-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 z-40 pointer-events-none select-none opacity-90 drop-shadow-[0_4px_10px_rgba(231,111,81,0.15)]"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full"
      >
        <!-- Yarn trail loop -->
        <path
          d="M0 45 C40 45, 60 15, 95 28 C130 40, 110 85, 75 80 C40 75, 45 120, 90 120 C125 120, 145 90, 160 90"
          stroke="#E76F51"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-dasharray="3 3"
          opacity="0.65"
        />
        <!-- Cozy Pillow / Cloud -->
        <path
          d="M10 15 Q25 2 55 10 Q85 18 100 45 Q115 72 85 90 Q55 108 25 85 Q-5 62 10 15 Z"
          fill="#FFF3EA"
          stroke="#F4A261"
          stroke-width="1.5"
          opacity="0.9"
        />
        <!-- Sleeping Cat Silhouette / Art -->
        <g transform="translate(20, 24)">
          <!-- Cat Body -->
          <ellipse cx="36" cy="36" rx="26" ry="19" fill="#F4A261" />
          <!-- Cat Head -->
          <circle cx="20" cy="28" r="14" fill="#F4A261" />
          <!-- Ears -->
          <polygon points="12,18 8,6 20,15" fill="#E76F51" />
          <polygon points="23,16 32,7 28,19" fill="#E76F51" />
          <!-- Closed Sleeping Eyes (Arcs) -->
          <path d="M12 28 Q15 31 18 28" stroke="#2B2D42" stroke-width="1.4" stroke-linecap="round" fill="none" />
          <path d="M21 28 Q24 31 27 28" stroke="#2B2D42" stroke-width="1.4" stroke-linecap="round" fill="none" />
          <!-- Tiny Nose & Smile -->
          <polygon points="19,31 21,31 20,32.5" fill="#E07A5F" />
          <path d="M20 32.5 Q18 34.5 16 34" stroke="#2B2D42" stroke-width="1" fill="none" />
          <path d="M20 32.5 Q22 34.5 24 34" stroke="#2B2D42" stroke-width="1" fill="none" />
          <!-- Curled Tail -->
          <path
            d="M58 40 C65 35 68 22 58 18 C50 15 48 24 54 26"
            stroke="#F4A261"
            stroke-width="5"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Little zZz -->
          <text x="36" y="14" font-family="'Fredoka', sans-serif" font-size="9" fill="#E76F51" font-weight="bold" opacity="0.8">z</text>
          <text x="44" y="8" font-family="'Fredoka', sans-serif" font-size="11" fill="#E76F51" font-weight="bold" opacity="0.9">Z</text>
        </g>
        <!-- Little Paw Print Accent -->
        <circle cx="120" cy="40" r="3" fill="#FFCCD5" />
        <circle cx="114" cy="36" r="1.5" fill="#FFCCD5" />
        <circle cx="119" cy="33" r="1.5" fill="#FFCCD5" />
        <circle cx="125" cy="35" r="1.5" fill="#FFCCD5" />
      </svg>
    </div>

    <!-- Top-Right Corner: Playful Cat Paw Reaching For Yarn Ball -->
    <div
      class="fixed top-0 right-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 z-40 pointer-events-none select-none opacity-90 drop-shadow-[0_4px_10px_rgba(231,111,81,0.15)]"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full"
      >
        <!-- Yarn Ball -->
        <g transform="translate(100, 15)">
          <circle cx="22" cy="22" r="18" fill="#E76F51" />
          <path d="M8 22 C14 10 30 10 36 22" stroke="#FFF3EA" stroke-width="1.6" fill="none" opacity="0.75" />
          <path d="M12 28 C20 18 32 18 32 30" stroke="#FFF3EA" stroke-width="1.6" fill="none" opacity="0.75" />
          <path d="M22 6 C28 16 28 28 22 38" stroke="#FFF3EA" stroke-width="1.6" fill="none" opacity="0.75" />
          <circle cx="18" cy="18" r="3" fill="#FFF3EA" opacity="0.8" />
        </g>
        <!-- Yarn String Trailing Down & Left -->
        <path
          d="M110 38 C90 50, 75 30, 50 60 C30 85, 65 110, 40 140"
          stroke="#E76F51"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-dasharray="3 3"
          opacity="0.65"
        />
        <!-- Reaching Kitten Paw (Puffy White/Cream Paw with Pink Beans) -->
        <g transform="translate(35, 12) rotate(32)">
          <path
            d="M5 25 Q10 5 22 5 Q34 5 39 25 L36 50 L8 50 Z"
            fill="#FFF3EA"
            stroke="#F4A261"
            stroke-width="1.5"
          />
          <!-- Pink Toe Beans -->
          <ellipse cx="22" cy="24" rx="7" ry="5.5" fill="#FFCCD5" />
          <circle cx="12" cy="14" r="3" fill="#FFCCD5" />
          <circle cx="19" cy="10" r="3.2" fill="#FFCCD5" />
          <circle cx="26" cy="11" r="3.2" fill="#FFCCD5" />
          <circle cx="33" cy="15" r="3" fill="#FFCCD5" />
        </g>
        <!-- Floating Little Hearts -->
        <path
          d="M60 20 C60 16 56 12 52 12 C48 12 45 15 45 18 C45 23 52 28 60 34 C68 28 75 23 75 18 C75 15 72 12 68 12 C64 12 60 16 60 20 Z"
          fill="#FFCCD5"
          opacity="0.75"
          transform="scale(0.4) translate(70, 40)"
        />
      </svg>
    </div>

    <!-- Bottom-Left Corner: Dapper Cat with Bowtie Silhouette & Hearts -->
    <div
      class="fixed bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-40 pointer-events-none select-none opacity-85"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full"
      >
        <!-- Soft decorative quarter circle -->
        <path d="M0 160 L140 160 C140 85 85 30 0 30 Z" fill="#FFF3EA" opacity="0.6" />
        <path d="M0 160 L125 160 C125 95 95 45 0 45 Z" stroke="#F4A261" stroke-width="1.2" stroke-dasharray="4 4" fill="none" opacity="0.6" />
        <!-- Sitting Groom Cat Silhouette -->
        <g transform="translate(18, 55)">
          <!-- Body -->
          <path d="M22 65 C20 40 32 30 42 30 C52 30 64 40 62 65 Z" fill="#4A4E69" />
          <!-- Head -->
          <circle cx="42" cy="22" r="14" fill="#4A4E69" />
          <!-- Ears -->
          <polygon points="32,14 30,4 39,11" fill="#4A4E69" />
          <polygon points="45,11 54,4 52,14" fill="#4A4E69" />
          <!-- Bowtie -->
          <polygon points="36,32 42,35 36,38" fill="#E76F51" />
          <polygon points="48,32 42,35 48,38" fill="#E76F51" />
          <circle cx="42" cy="35" r="2" fill="#FFF3EA" />
          <!-- Tail curving gracefully -->
          <path d="M60 62 C75 60 80 48 76 40 C73 34 68 36 71 42" stroke="#4A4E69" stroke-width="4" stroke-linecap="round" fill="none" />
        </g>
        <!-- Little Fishbone Accent -->
        <g transform="translate(85, 115) rotate(-20) scale(0.7)">
          <line x1="0" y1="10" x2="36" y2="10" stroke="#E76F51" stroke-width="2" stroke-linecap="round" />
          <polygon points="36,10 46,3 46,17" fill="#E76F51" />
          <line x1="8" y1="3" x2="16" y2="17" stroke="#E76F51" stroke-width="1.6" stroke-linecap="round" />
          <line x1="18" y1="3" x2="26" y2="17" stroke="#E76F51" stroke-width="1.6" stroke-linecap="round" />
          <line x1="28" y1="3" x2="36" y2="17" stroke="#E76F51" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="4" cy="10" r="3" fill="#E76F51" />
        </g>
      </svg>
    </div>

    <!-- Bottom-Right Corner: Bride Cat Silhouette with Bridal Veil & Bouquet -->
    <div
      class="fixed bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-40 pointer-events-none select-none opacity-85"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full"
      >
        <path d="M160 160 L20 160 C20 85 75 30 160 30 Z" fill="#FFF0F3" opacity="0.6" />
        <path d="M160 160 L35 160 C35 95 65 45 160 45 Z" stroke="#FFCCD5" stroke-width="1.2" stroke-dasharray="4 4" fill="none" opacity="0.6" />
        <!-- Sitting Bride Cat Silhouette -->
        <g transform="translate(70, 52)">
          <!-- Bridal Veil (Flowing Soft Mesh) -->
          <path
            d="M40 12 C25 22 15 45 12 70 C28 72 45 68 55 60 C58 45 52 25 40 12 Z"
            fill="#FFF3EA"
            opacity="0.85"
            stroke="#FFCCD5"
            stroke-width="1"
          />
          <!-- Body -->
          <path d="M38 65 C36 42 46 32 54 32 C62 32 72 42 70 65 Z" fill="#E76F51" />
          <!-- Head -->
          <circle cx="54" cy="24" r="13" fill="#E76F51" />
          <!-- Ears -->
          <polygon points="45,16 43,6 51,13" fill="#E76F51" />
          <polygon points="57,13 65,6 63,16" fill="#E76F51" />
          <!-- Flower Crown / Tiara -->
          <circle cx="48" cy="12" r="3.5" fill="#FFCCD5" />
          <circle cx="54" cy="10" r="4" fill="#FFFDF9" stroke="#E76F51" stroke-width="1" />
          <circle cx="60" cy="12" r="3.5" fill="#FFCCD5" />
          <!-- Flower Bouquet in front -->
          <g transform="translate(38, 45)">
            <circle cx="6" cy="6" r="4" fill="#FFCCD5" />
            <circle cx="12" cy="5" r="4" fill="#FFFDF9" stroke="#E76F51" stroke-width="1" />
            <circle cx="9" cy="11" r="3.5" fill="#F4A261" />
          </g>
          <!-- Curled Bride Tail with little flower -->
          <path d="M68 62 C80 60 84 50 80 44 C77 39 72 41 75 46" stroke="#E76F51" stroke-width="3.5" stroke-linecap="round" fill="none" />
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
      primaryColor="#2B2D42"
      accentColor="#E76F51"
      :autoPlay="isOpened"
      class="z-[60]"
    />

    <!-- ============================================================== -->
    <!-- 4. FLOATING INTERACTIVE CAT PET WIDGET ("🐾 Elus Kucing 🐱")     -->
    <!-- ============================================================== -->
    <div
      v-if="isOpened"
      class="fixed bottom-6 left-5 z-50 flex items-center gap-3 select-none"
    >
      <div class="relative">
        <button
          @click="petTheCat"
          class="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#F4A261]/40 shadow-[0_8px_24px_rgba(231,111,81,0.18)] hover:shadow-[0_12px_28px_rgba(231,111,81,0.28)] hover:scale-105 active:scale-95 transition-all duration-300 text-[#2B2D42]"
          title="Klik untuk elus kucing kesayangan mempelai!"
        >
          <span class="text-lg animate-bounce inline-block">🐾</span>
          <span class="text-xs font-bold tracking-wide font-cute text-[#E76F51]">Elus Kucing</span>
          <span class="px-2 py-0.5 rounded-full bg-[#FFF3EA] text-[10px] font-black text-[#E07A5F] border border-[#F4A261]/30">
            {{ petCount }}x
          </span>
        </button>

        <!-- Dynamic Speech Bubble Meow Dialog -->
        <transition name="pop-bubble">
          <div
            v-if="showSpeechBubble"
            class="absolute bottom-14 left-0 w-64 bg-white/95 backdrop-blur-md p-3 rounded-2xl rounded-bl-sm border border-[#F4A261]/40 shadow-xl text-xs text-[#2B2D42] font-medium leading-snug pointer-events-none"
          >
            <div class="flex items-start gap-2">
              <span class="text-xl">😻</span>
              <div>
                <p class="font-bold text-[#E76F51] text-[11px] uppercase tracking-wider">Mochi &amp; Latte Berkata:</p>
                <p class="mt-0.5 text-[#4A4E69]">{{ currentSpeechText }}</p>
              </div>
            </div>
            <!-- Bubble tail -->
            <div class="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b border-r border-[#F4A261]/40 transform rotate-45"></div>
          </div>
        </transition>

        <!-- Floating click hearts -->
        <div
          v-for="h in floatingHearts"
          :key="h.id"
          class="absolute pointer-events-none text-base animate-float-heart"
          :style="{ left: `${h.x}px`, bottom: `${h.y}px`, color: h.color }"
        >
          {{ h.icon }}
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 5. FLOATING NAVIGATION BAR                                     -->
    <!-- ============================================================== -->
    <!-- Desktop Floating Pill (Right Side) -->
    <nav
      v-if="isOpened"
      class="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 p-2 rounded-full bg-white/85 backdrop-blur-md border border-[#F4A261]/30 shadow-[0_10px_30px_rgba(231,111,81,0.12)]"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="scrollToSection(item.id)"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative group"
        :class="activeSection === item.id ? 'bg-[#E76F51] text-white shadow-md scale-110' : 'text-[#4A4E69] hover:bg-[#FFF3EA] hover:text-[#E76F51]'"
        :title="item.label"
      >
        <i :class="[item.icon, 'text-xs']"></i>
        <span
          class="absolute right-12 px-3 py-1 rounded-xl bg-[#2B2D42] text-white text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <!-- Mobile Bottom Navigation Bar -->
    <nav
      v-if="isOpened"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(231,111,81,0.18)] border border-[#F4A261]/30 w-[94%] max-w-md md:hidden flex overflow-x-auto no-scrollbar py-2 px-3"
    >
      <div class="flex items-center justify-around w-full gap-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center justify-center py-1 rounded-full transition-all duration-300"
          :class="activeSection === item.id ? 'text-[#E76F51] font-bold scale-105' : 'text-[#4A4E69]/70 hover:text-[#E76F51]'"
        >
          <i :class="[item.icon, 'text-xs mb-0.5']"></i>
          <span class="text-[8px] uppercase tracking-wider font-semibold truncate">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- ============================================================== -->
    <!-- 6. WELCOME GATE SCREEN (Buka Undangan Penuh Cinta)              -->
    <!-- ============================================================== -->
    <transition name="gate-slide">
      <div
        v-if="!isOpened"
        class="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#FFFDF9] px-6 overflow-hidden select-none"
      >
        <!-- Background Ambient Cat Lover Graphics -->
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,204,213,0.35),transparent_70%)] pointer-events-none"
        ></div>

        <!-- Floating Whimsical Background Icons -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-30 text-2xl">
          <span class="absolute top-[12%] left-[10%] animate-pulse">🐾</span>
          <span class="absolute top-[20%] right-[15%] animate-bounce">🧶</span>
          <span class="absolute bottom-[25%] left-[12%] animate-pulse">💕</span>
          <span class="absolute bottom-[18%] right-[10%] animate-bounce">🐟</span>
        </div>

        <!-- Center Envelope & Seal Card -->
        <div class="relative w-full max-w-md flex flex-col items-center text-center space-y-6 z-10">
          
          <!-- Couple Monogram Crest -->
          <div class="relative">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFF3EA] border-2 border-dashed border-[#F4A261] flex items-center justify-center p-3 shadow-inner">
              <!-- SVG Couple Cats Crest -->
              <svg viewBox="0 0 100 100" class="w-full h-full" fill="none">
                <!-- Heart formed by tails -->
                <path d="M50 78 C32 60 25 40 38 28 C45 22 50 30 50 30 C50 30 55 22 62 28 C75 40 68 60 50 78 Z" fill="#FFCCD5" opacity="0.5" />
                <!-- Groom Cat (Left) -->
                <ellipse cx="38" cy="55" rx="14" ry="18" fill="#4A4E69" />
                <circle cx="38" cy="40" r="11" fill="#4A4E69" />
                <polygon points="30,34 26,24 35,31" fill="#4A4E69" />
                <polygon points="40,31 49,24 45,34" fill="#4A4E69" />
                <!-- Groom Bowtie -->
                <polygon points="34,48 38,50 34,52" fill="#E76F51" />
                <polygon points="42,48 38,50 42,52" fill="#E76F51" />
                <circle cx="38" cy="50" r="1.5" fill="#FFFDF9" />
                <!-- Bride Cat (Right) -->
                <ellipse cx="62" cy="55" rx="14" ry="18" fill="#E76F51" />
                <circle cx="62" cy="40" r="11" fill="#E76F51" />
                <polygon points="54,34 50,24 59,31" fill="#E76F51" />
                <polygon points="64,31 73,24 69,34" fill="#E76F51" />
                <!-- Bride Veil & Flower -->
                <path d="M57 32 C50 38 48 56 46 64 C56 66 68 64 74 58 C74 46 70 36 62 32 Z" fill="#FFF3EA" opacity="0.6" />
                <circle cx="62" cy="30" r="3" fill="#FFFDF9" stroke="#E76F51" stroke-width="1" />
              </svg>
            </div>
            <!-- Small floating paw badge -->
            <div class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#E76F51] text-white flex items-center justify-center text-xs shadow-md">
              🐾
            </div>
          </div>

          <!-- Typography Welcome -->
          <div class="space-y-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EA] text-[#E76F51] text-[10px] font-black uppercase tracking-[0.25em] border border-[#F4A261]/30">
              🐾 A Purrfect Match Wedding
            </span>
            <h1 class="text-3xl sm:text-4xl font-serif font-bold text-[#2B2D42] tracking-wide mt-2">
              {{ data.groomName || 'Leo' }} <span class="font-serif italic font-normal text-[#E76F51]">&amp;</span> {{ data.brideName || 'Luna' }}
            </h1>
            <p class="text-xs uppercase tracking-[0.2em] text-[#4A4E69] font-medium">
              Save The Date • {{ formatEventDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
            </p>
          </div>

          <!-- Guest Recipient Envelope Card -->
          <div class="w-full bg-white/95 rounded-2xl p-5 border border-[#F4A261]/30 shadow-[0_12px_36px_rgba(231,111,81,0.12)] space-y-3 relative overflow-hidden">
            <!-- Decorative Cat Ear Stamp Top Left -->
            <div class="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-12 h-12 bg-[#FFF3EA] rounded-full opacity-60 pointer-events-none"></div>

            <p class="text-[11px] text-[#4A4E69] font-medium tracking-wide">
              Kepada Yth. Sahabat &amp; Pecinta Kucing:
            </p>
            <div class="py-2 px-4 rounded-xl bg-[#FFFDF9] border border-[#F4A261]/20 inline-block max-w-full">
              <h3 class="text-base sm:text-lg font-bold text-[#2B2D42] truncate font-cute">
                {{ guestDisplayName }}
              </h3>
            </div>
            <p class="text-[10px] text-[#4A4E69]/80 italic">
              "Bersama dengkuran hangat &amp; jejak langkah kasih, kami mengundang Anda merayakan cinta kami."
            </p>
          </div>

          <!-- Open Invitation Button with Paw-Tap Stamp Animation -->
          <div class="pt-2">
            <button
              @click="openInvitationGate"
              class="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-cute font-bold text-sm tracking-wider shadow-[0_10px_25px_rgba(231,111,81,0.35)] hover:shadow-[0_15px_30px_rgba(231,111,81,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span class="text-lg group-hover:scale-125 transition-transform duration-300">🐾</span>
              <span>Buka Undangan Penuh Cinta</span>
              <!-- Shimmer light animation -->
              <span class="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out"></span>
            </button>
            <p class="text-[9px] uppercase tracking-widest text-[#4A4E69]/60 mt-3 font-semibold">
              Tap untuk memutar musik &amp; sapaan meow
            </p>
          </div>
        </div>

        <div class="absolute bottom-4 text-[9px] uppercase tracking-[0.2em] text-[#4A4E69]/50">
          © SATUUNDANGAN.ID • PURRFECT MATCH
        </div>
      </div>
    </transition>

    <!-- ============================================================== -->
    <!-- MAIN INVITATION CONTENT CONTAINER                              -->
    <!-- ============================================================== -->
    <div
      v-if="isOpened"
      id="main-content"
      class="relative z-30 transition-opacity duration-1000"
    >
      <!-- ============================================================ -->
      <!-- SECTION 1: HERO / COVER                                      -->
      <!-- ============================================================ -->
      <section
        id="home"
        v-if="isSectionEnabled('hero')"
        class="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF3EA]/60 to-[#FFFDF9]"
      >
        <!-- Floating Romantic Cat Badges -->
        <div class="space-y-6 max-w-3xl mx-auto z-10">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3EA] border border-[#F4A261]/40 text-[#E76F51] text-xs font-bold uppercase tracking-[0.25em] shadow-sm">
            <span>🐾</span> Paw in Hand, Forever &amp; Always <span>🐾</span>
          </div>

          <!-- Hero SVG Couple Cats Crest -->
          <div class="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto my-4">
            <svg viewBox="0 0 160 160" class="w-full h-full" fill="none">
              <!-- Golden Floral / Paw Wreath -->
              <circle cx="80" cy="80" r="70" stroke="#F4A261" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6" />
              <circle cx="80" cy="80" r="64" stroke="#FFCCD5" stroke-width="1" opacity="0.7" />
              <!-- Paw Wreath Ornaments -->
              <circle cx="80" cy="12" r="3" fill="#E76F51" />
              <circle cx="80" cy="148" r="3" fill="#E76F51" />
              <circle cx="12" cy="80" r="3" fill="#E76F51" />
              <circle cx="148" cy="80" r="3" fill="#E76F51" />
              
              <!-- Two Loving Cats sitting close -->
              <g transform="translate(24, 30)">
                <!-- Heart tail intertwine -->
                <path
                  d="M32 78 C15 55 20 35 34 26 C45 20 54 28 56 32 C58 28 67 20 78 26 C92 35 97 55 80 78 Z"
                  fill="#FFF0F3"
                  stroke="#FFCCD5"
                  stroke-width="1.5"
                />
                <!-- Groom Cat -->
                <path d="M30 84 C26 55 40 45 50 45 C60 45 68 55 64 84 Z" fill="#4A4E69" />
                <circle cx="48" cy="36" r="14" fill="#4A4E69" />
                <polygon points="38,28 34,16 45,24" fill="#4A4E69" />
                <polygon points="50,24 61,16 57,28" fill="#4A4E69" />
                <!-- Groom Bowtie -->
                <polygon points="43,46 48,49 43,52" fill="#E76F51" />
                <polygon points="53,46 48,49 53,52" fill="#E76F51" />
                <circle cx="48" cy="49" r="2" fill="#FFFDF9" />
                <!-- Bride Cat -->
                <path d="M52 84 C48 55 62 45 72 45 C82 45 90 55 86 84 Z" fill="#E76F51" />
                <circle cx="70" cy="36" r="14" fill="#E76F51" />
                <polygon points="60,28 56,16 67,24" fill="#E76F51" />
                <polygon points="72,24 83,16 79,28" fill="#E76F51" />
                <!-- Veil & Tiara -->
                <path d="M66 26 C58 35 55 58 52 70 C66 72 78 68 86 60 C86 45 80 32 70 26 Z" fill="#FFFDF9" opacity="0.75" />
                <circle cx="66" cy="23" r="3.5" fill="#FFCCD5" />
                <circle cx="72" cy="22" r="4" fill="#FFFDF9" stroke="#E76F51" stroke-width="1" />
                <circle cx="78" cy="23" r="3.5" fill="#FFCCD5" />
              </g>
            </svg>
          </div>

          <!-- Main Couple Names -->
          <div class="space-y-3">
            <p class="text-xs font-black uppercase tracking-[0.35em] text-[#E07A5F]">The Wedding Celebration of</p>
            <h1 class="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[#2B2D42] tracking-wide leading-tight">
              {{ data.groomName || 'Kuroo' }}
              <span class="block text-3xl sm:text-4xl md:text-5xl font-serif italic font-normal text-[#E76F51] my-1">&amp;</span>
              {{ data.brideName || 'Mimi' }}
            </h1>
          </div>

          <!-- Date & Save the Date pill -->
          <div class="pt-4 flex flex-col items-center gap-3">
            <div class="h-0.5 w-20 bg-[#E76F51] rounded-full"></div>
            <p class="text-base sm:text-lg font-serif italic text-[#4A4E69]">
              {{ formatEventDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
            </p>
            <p class="text-xs uppercase tracking-widest text-[#E76F51] font-bold">
              {{ data.resepsiLocation?.locationName || data.akadLocation?.locationName || 'Cat Lover Sanctuary Ballroom' }}
            </p>
          </div>
        </div>

        <!-- Scroll down indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 animate-bounce">
          <span class="text-[9px] uppercase font-bold tracking-widest text-[#E76F51]">Scroll Menuju Cerita</span>
          <i class="fa-solid fa-chevron-down text-xs text-[#E76F51]"></i>
        </div>
      </section>

      <!-- SVG BOUNCING YARN BALL SECTION DIVIDER -->
      <div class="relative w-full py-4 overflow-hidden flex items-center justify-center select-none pointer-events-none">
        <svg viewBox="0 0 1200 40" class="w-full h-8" fill="none" preserveAspectRatio="none">
          <path d="M0 20 Q 300 35 600 20 Q 900 5 1200 20" stroke="#F4A261" stroke-width="1.5" stroke-dasharray="6 6" />
        </svg>
        <div class="absolute flex items-center gap-3 bg-[#FFFDF9] px-6 py-1 rounded-full border border-[#F4A261]/30 text-xs text-[#E76F51] font-bold">
          <span>🧶</span> 🐾 Meow Forever 🐾 <span>🧶</span>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECTION 2: QUOTE / AYAT / PANTUN KUCING ROMANTIS              -->
      <!-- ============================================================ -->
      <section
        id="quote"
        v-if="isSectionEnabled('quote')"
        class="relative py-20 px-6 max-w-4xl mx-auto text-center space-y-8"
      >
        <!-- Cute Fishbone & Paw badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EA] text-[#E76F51] text-[10px] font-black uppercase tracking-[0.25em]">
          <span>🐟</span> Ayat &amp; Untaian Kasih <span>🐟</span>
        </div>

        <!-- Romantic Cat Poem -->
        <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-[#F4A261]/30 shadow-[0_15px_40px_rgba(231,111,81,0.08)] space-y-6">
          <span class="text-4xl text-[#FFCCD5]">“</span>
          <p class="text-lg sm:text-xl md:text-2xl font-serif italic text-[#2B2D42] leading-relaxed max-w-2xl mx-auto">
            {{ data.quoteText || 'Dua insan, satu cinta, saling melengkapi bagai dengkuran hangat kucing di malam berhujan. Melangkah bersama meninggalkan jejak kasih yang abadi di setiap tapak kehidupan.' }}
          </p>
          <div class="h-0.5 w-16 bg-[#E76F51] mx-auto rounded-full"></div>
          <p class="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#E76F51]">
            {{ data.quoteSource || 'QS. Ar-Rum: 21 & Untaian Janji Setia' }}
          </p>

          <!-- Whimsical Whisker Ornament -->
          <div class="flex items-center justify-center gap-4 pt-2 text-[#F4A261] opacity-70">
            <span>---=</span>
            <span class="text-base text-[#E76F51]">🐾</span>
            <span>=---</span>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 3: PROFIL MEMPELAI (Cat Daddy & Cat Mommy)             -->
      <!-- ============================================================ -->
      <section
        id="couple"
        v-if="isSectionEnabled('couple')"
        class="relative py-24 px-6 max-w-6xl mx-auto space-y-16"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 The Pawrents
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B2D42]">
            Mempelai Bahagia
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
            Dengan memohon rahmat dan ridho Allah SWT, kami bersatu dalam ikatan suci pernikahan.
          </p>
        </div>

        <!-- Couple Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-stretch max-w-5xl mx-auto">
          
          <!-- Groom Card (Cat Daddy) -->
          <div class="bg-white rounded-3xl p-8 border border-[#F4A261]/30 shadow-[0_15px_35px_rgba(231,111,81,0.08)] flex flex-col items-center text-center space-y-5 relative group hover:-translate-y-1.5 transition-all duration-500">
            <!-- Cute Cat Ear Outline at Top -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#4A4E69] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
              🎩 Groom • Cat Daddy 🐾
            </div>

            <!-- Photo with Cat Ears Frame -->
            <div class="relative w-44 h-44 sm:w-48 sm:h-48 mt-2">
              <div class="w-full h-full rounded-full overflow-hidden border-4 border-[#FFF3EA] ring-2 ring-[#4A4E69]/30 shadow-md bg-[#FFF3EA] flex items-center justify-center">
                <img
                  :src="data.groomPhoto || '/assets/images/sample-groom.jpg'"
                  :alt="data.groomName"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  @error="onImageError($event, 'groom')"
                />
              </div>
              <div class="absolute bottom-1 right-2 w-10 h-10 rounded-full bg-[#4A4E69] text-white flex items-center justify-center text-sm shadow-md">
                🐾
              </div>
            </div>

            <!-- Info -->
            <div class="space-y-2">
              <h3 class="text-2xl sm:text-3xl font-serif font-bold text-[#2B2D42]">
                {{ data.groomName || 'Kuroo Pratama' }}
              </h3>
              <p v-if="data.groomNickname" class="text-xs text-[#E76F51] font-bold">
                ( {{ data.groomNickname }} )
              </p>
              <p class="text-xs text-[#4A4E69] leading-relaxed max-w-xs mx-auto">
                {{ data.groomChildOrder || 'Putra Pertama' }} dari Pasangan<br>
                <span class="font-semibold text-[#2B2D42]">{{ data.groomFather || 'Bpk. Hendra Pratama' }}</span>
                &amp;
                <span class="font-semibold text-[#2B2D42]">{{ data.groomMother || 'Ibu Siti Aminah' }}</span>
              </p>
            </div>

            <!-- Instagram Button -->
            <div class="pt-2">
              <a
                v-if="data.groomInstagram"
                :href="formatInstagramUrl(data.groomInstagram)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF3EA] hover:bg-[#4A4E69] hover:text-white text-[#4A4E69] text-xs font-bold transition-all duration-300 border border-[#F4A261]/30"
              >
                <i class="fa-brands fa-instagram"></i>
                <span>@{{ cleanInstagram(data.groomInstagram) }}</span>
              </a>
            </div>
          </div>

          <!-- Bride Card (Cat Mommy) -->
          <div class="bg-white rounded-3xl p-8 border border-[#F4A261]/30 shadow-[0_15px_35px_rgba(231,111,81,0.08)] flex flex-col items-center text-center space-y-5 relative group hover:-translate-y-1.5 transition-all duration-500">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E76F51] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
              👑 Bride • Cat Mommy 🌸
            </div>

            <!-- Photo with Cat Ears Frame -->
            <div class="relative w-44 h-44 sm:w-48 sm:h-48 mt-2">
              <div class="w-full h-full rounded-full overflow-hidden border-4 border-[#FFF3EA] ring-2 ring-[#E76F51]/30 shadow-md bg-[#FFF3EA] flex items-center justify-center">
                <img
                  :src="data.bridePhoto || '/assets/images/sample-bride.jpg'"
                  :alt="data.brideName"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  @error="onImageError($event, 'bride')"
                />
              </div>
              <div class="absolute bottom-1 right-2 w-10 h-10 rounded-full bg-[#E76F51] text-white flex items-center justify-center text-sm shadow-md">
                🌸
              </div>
            </div>

            <!-- Info -->
            <div class="space-y-2">
              <h3 class="text-2xl sm:text-3xl font-serif font-bold text-[#2B2D42]">
                {{ data.brideName || 'Luna Amalia' }}
              </h3>
              <p v-if="data.brideNickname" class="text-xs text-[#E76F51] font-bold">
                ( {{ data.brideNickname }} )
              </p>
              <p class="text-xs text-[#4A4E69] leading-relaxed max-w-xs mx-auto">
                {{ data.brideChildOrder || 'Putri Kedua' }} dari Pasangan<br>
                <span class="font-semibold text-[#2B2D42]">{{ data.brideFather || 'Bpk. Bambang Wijaya' }}</span>
                &amp;
                <span class="font-semibold text-[#2B2D42]">{{ data.brideMother || 'Ibu Ratna Dewi' }}</span>
              </p>
            </div>

            <!-- Instagram Button -->
            <div class="pt-2">
              <a
                v-if="data.brideInstagram"
                :href="formatInstagramUrl(data.brideInstagram)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF3EA] hover:bg-[#E76F51] hover:text-white text-[#E76F51] text-xs font-bold transition-all duration-300 border border-[#F4A261]/30"
              >
                <i class="fa-brands fa-instagram"></i>
                <span>@{{ cleanInstagram(data.brideInstagram) }}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 4: COUNTDOWN TIMER (Cat Paw Shaped Clock Cards)        -->
      <!-- ============================================================ -->
      <section
        id="countdown"
        v-if="isSectionEnabled('countdown')"
        class="relative py-20 px-6 bg-gradient-to-r from-[#FFF3EA] via-[#FFFDF9] to-[#FFF3EA] border-y border-[#F4A261]/30"
      >
        <div class="max-w-4xl mx-auto text-center space-y-10">
          <div class="space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F]">
              🐾 Menghitung Hari Bahagia
            </span>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2B2D42]">
              Countdown to Our Purrfect Day
            </h2>
            <p class="text-xs text-[#4A4E69]">Setiap detik mendekatkan dua hati yang saling mencintai</p>
          </div>

          <!-- Cat Paw Clock Cards Grid -->
          <div class="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="relative bg-white rounded-3xl p-4 sm:p-6 border border-[#F4A261]/40 shadow-[0_10px_25px_rgba(231,111,81,0.1)] flex flex-col items-center justify-center group hover:scale-105 transition-transform"
            >
              <!-- 3 cute little toe beans at the top of the clock card -->
              <div class="flex items-center gap-1.5 -mt-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-[#FFCCD5]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#F4A261]"></span>
                <span class="w-2 h-2 rounded-full bg-[#FFCCD5]"></span>
              </div>
              <span class="text-2xl sm:text-4xl font-bold font-cute text-[#E76F51]">{{ val }}</span>
              <span class="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#4A4E69] mt-1">{{ label }}</span>
            </div>
          </div>

          <!-- Add to Calendar Button -->
          <div>
            <a
              :href="calendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#2B2D42] hover:bg-[#E76F51] text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:scale-105"
            >
              <i class="fa-regular fa-calendar-plus text-sm"></i>
              <span>Simpan ke Google Calendar</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 5: DETAIL ACARA (Akad & Resepsi)                       -->
      <!-- ============================================================ -->
      <section
        id="event"
        v-if="isSectionEnabled('event')"
        class="relative py-24 px-6 max-w-6xl mx-auto space-y-16"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 Waktu &amp; Tempat
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B2D42]">
            Rangkaian Acara
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
            Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kado terindah bagi kami.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          <!-- Akad Nikah Card -->
          <div class="bg-white rounded-3xl p-8 border border-[#F4A261]/30 shadow-[0_15px_35px_rgba(231,111,81,0.08)] space-y-6 relative overflow-hidden flex flex-col justify-between">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-[#FFF3EA] text-[#E76F51] text-[10px] font-bold uppercase tracking-widest border border-[#F4A261]/30">
                  🐾 Sakral &amp; Khidmat
                </span>
                <span class="text-2xl">💍</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-serif font-bold text-[#2B2D42]">
                {{ data.akadLocation?.title || 'Akad Nikah' }}
              </h3>
              <div class="space-y-2 text-xs sm:text-sm text-[#4A4E69]">
                <p class="flex items-center gap-2.5 font-semibold text-[#2B2D42]">
                  <i class="fa-regular fa-calendar-check text-[#E76F51]"></i>
                  {{ formatEventDate(data.akadLocation?.dateTime) }}
                </p>
                <p class="flex items-center gap-2.5">
                  <i class="fa-regular fa-clock text-[#E76F51]"></i>
                  {{ formatEventTime(data.akadLocation?.dateTime) }}
                </p>
                <p class="flex items-start gap-2.5 pt-1">
                  <i class="fa-solid fa-location-dot text-[#E76F51] mt-1"></i>
                  <span>
                    <strong class="text-[#2B2D42] block">{{ data.akadLocation?.locationName || 'Masjid Al-Barokah' }}</strong>
                    <span class="text-xs text-[#4A4E69]">{{ data.akadLocation?.address || 'Jl. Melati No. 12, Jakarta Selatan' }}</span>
                  </span>
                </p>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="pt-4 flex flex-wrap gap-3">
              <a
                v-if="data.akadLocation?.googleMapsUrl"
                :href="data.akadLocation.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FFF3EA] hover:bg-[#E76F51] text-[#E76F51] hover:text-white text-xs font-bold transition-all border border-[#F4A261]/30"
              >
                <i class="fa-solid fa-map-location-dot"></i>
                <span>Petunjuk Arah</span>
              </a>
              <a
                :href="buildCalendarLink(data.akadLocation, 'Akad Nikah')"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FFFDF9] hover:bg-[#2B2D42] text-[#4A4E69] hover:text-white text-xs font-bold transition-all border border-[#F4A261]/30"
              >
                <i class="fa-regular fa-calendar"></i>
                <span>Kalender</span>
              </a>
            </div>
          </div>

          <!-- Resepsi Pernikahan Card -->
          <div class="bg-white rounded-3xl p-8 border border-[#F4A261]/30 shadow-[0_15px_35px_rgba(231,111,81,0.08)] space-y-6 relative overflow-hidden flex flex-col justify-between">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-[#FFF3EA] text-[#E76F51] text-[10px] font-bold uppercase tracking-widest border border-[#F4A261]/30">
                  🎉 Resepsi Penuh Cinta
                </span>
                <span class="text-2xl">🐱</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-serif font-bold text-[#2B2D42]">
                {{ data.resepsiLocation?.title || 'Resepsi Pernikahan' }}
              </h3>
              <div class="space-y-2 text-xs sm:text-sm text-[#4A4E69]">
                <p class="flex items-center gap-2.5 font-semibold text-[#2B2D42]">
                  <i class="fa-regular fa-calendar-check text-[#E76F51]"></i>
                  {{ formatEventDate(data.resepsiLocation?.dateTime) }}
                </p>
                <p class="flex items-center gap-2.5">
                  <i class="fa-regular fa-clock text-[#E76F51]"></i>
                  {{ formatEventTime(data.resepsiLocation?.dateTime) }}
                </p>
                <p class="flex items-start gap-2.5 pt-1">
                  <i class="fa-solid fa-location-dot text-[#E76F51] mt-1"></i>
                  <span>
                    <strong class="text-[#2B2D42] block">{{ data.resepsiLocation?.locationName || 'The Grand Ballroom Sakura' }}</strong>
                    <span class="text-xs text-[#4A4E69]">{{ data.resepsiLocation?.address || 'Jl. Kencana No. 88, Kebayoran Baru, Jakarta Selatan' }}</span>
                  </span>
                </p>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="pt-4 flex flex-wrap gap-3">
              <a
                v-if="data.resepsiLocation?.googleMapsUrl"
                :href="data.resepsiLocation.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#E76F51] hover:bg-[#d45d3f] text-white text-xs font-bold transition-all shadow-md"
              >
                <i class="fa-solid fa-map-location-dot"></i>
                <span>Petunjuk Arah</span>
              </a>
              <a
                :href="buildCalendarLink(data.resepsiLocation, 'Resepsi Pernikahan')"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FFFDF9] hover:bg-[#2B2D42] text-[#4A4E69] hover:text-white text-xs font-bold transition-all border border-[#F4A261]/30"
              >
                <i class="fa-regular fa-calendar"></i>
                <span>Kalender</span>
              </a>
            </div>
          </div>

        </div>

        <!-- Custom extra events if present -->
        <div v-if="data.customEvents?.length" class="space-y-6 max-w-4xl mx-auto">
          <div
            v-for="(ev, idx) in data.customEvents"
            :key="idx"
            class="bg-white rounded-3xl p-6 border border-[#F4A261]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <span class="text-[10px] font-bold text-[#E76F51] uppercase tracking-wider">Acara Tambahan</span>
              <h4 class="text-xl font-serif font-bold text-[#2B2D42]">{{ ev.title }}</h4>
              <p class="text-xs text-[#4A4E69] mt-1">{{ formatEventDate(ev.dateTime) }} • {{ formatEventTime(ev.dateTime) }}</p>
              <p class="text-xs text-[#4A4E69]">{{ ev.locationName }} — {{ ev.address }}</p>
            </div>
            <div v-if="ev.googleMapsUrl">
              <a
                :href="ev.googleMapsUrl"
                target="_blank"
                class="px-4 py-2 rounded-full bg-[#FFF3EA] text-[#E76F51] text-xs font-bold hover:bg-[#E76F51] hover:text-white transition-all inline-block"
              >
                Buka Peta
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 6: LOVE STORY (Kisah Manis Pertemuan)                 -->
      <!-- ============================================================ -->
      <section
        id="story"
        v-if="isSectionEnabled('love-story')"
        class="relative py-24 px-6 max-w-5xl mx-auto space-y-16"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 Cat Cafe to Wedding Aisle
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B2D42]">
            Kisah Cinta Kami
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
            Bagaimana seutas benang takdir dan seekor kucing mempertemukan dua hati yang saling melengkapi.
          </p>
        </div>

        <!-- Timeline -->
        <div class="relative border-l-2 border-[#F4A261]/40 ml-4 sm:ml-32 md:ml-40 space-y-12">
          <div
            v-for="(st, idx) in effectiveStories"
            :key="idx"
            class="relative pl-8 sm:pl-12 group"
          >
            <!-- Timeline Paw Badge -->
            <div class="absolute -left-4 top-1 w-8 h-8 rounded-full bg-[#FFF3EA] border-2 border-[#E76F51] flex items-center justify-center text-xs text-[#E76F51] shadow-sm group-hover:scale-110 group-hover:bg-[#E76F51] group-hover:text-white transition-all duration-300">
              🐾
            </div>

            <!-- Content Card -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4A261]/30 shadow-[0_10px_30px_rgba(231,111,81,0.06)] space-y-3">
              <span class="inline-block px-3 py-1 rounded-full bg-[#FFF3EA] text-[#E76F51] text-[10px] font-bold uppercase tracking-wider">
                {{ st.date || st.year || `Babak ${idx + 1}` }}
              </span>
              <h3 class="text-xl sm:text-2xl font-serif font-bold text-[#2B2D42]">
                {{ st.title }}
              </h3>
              <p class="text-xs sm:text-sm text-[#4A4E69] leading-relaxed">
                {{ st.story || st.description }}
              </p>
              <div v-if="st.image" class="mt-4 rounded-2xl overflow-hidden max-h-60">
                <img :src="st.image" alt="Story Moment" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 7: DRESS CODE & PANDUAN ACARA                         -->
      <!-- ============================================================ -->
      <section
        id="dress-code"
        v-if="isSectionEnabled('dress-code')"
        class="relative py-20 px-6 max-w-4xl mx-auto space-y-12"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 Panduan Tamu Undangan
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2B2D42]">
            Dress Code &amp; Etiket
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
            Sentuhan nuansa busana hangat untuk melengkapi keindahan foto bersama kedua mempelai.
          </p>
        </div>

        <div class="bg-white rounded-3xl p-8 sm:p-10 border border-[#F4A261]/30 shadow-[0_15px_35px_rgba(231,111,81,0.08)] space-y-8 text-center">
          <!-- Swatches -->
          <div class="space-y-4">
            <p class="text-xs font-bold uppercase tracking-wider text-[#4A4E69]">Palette Warna yang Disarankan:</p>
            <div class="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 h-12 rounded-full bg-[#FFF3EA] border-2 border-[#F4A261] shadow-inner"></div>
                <span class="text-[10px] font-bold text-[#4A4E69]">Butter Peach</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 h-12 rounded-full bg-[#F4A261] shadow-sm"></div>
                <span class="text-[10px] font-bold text-[#4A4E69]">Warm Apricot</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 h-12 rounded-full bg-[#E76F51] shadow-sm"></div>
                <span class="text-[10px] font-bold text-[#4A4E69]">Terracotta</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 h-12 rounded-full bg-[#FFCCD5] shadow-sm"></div>
                <span class="text-[10px] font-bold text-[#4A4E69]">Paw Rose</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 h-12 rounded-full bg-[#4A4E69] shadow-sm"></div>
                <span class="text-[10px] font-bold text-[#4A4E69]">Espresso</span>
              </div>
            </div>
          </div>

          <!-- Do's and Don'ts playful guide -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4 border-t border-[#F4A261]/20">
            <div class="p-4 rounded-2xl bg-[#FFF3EA]/60 space-y-2">
              <span class="text-xs font-bold text-[#E76F51] flex items-center gap-2">
                <span>😸</span> Senyuman Manis
              </span>
              <p class="text-xs text-[#4A4E69] leading-relaxed">
                Hadir tepat waktu, berpakaian rapi &amp; sopan, serta sampaikan doa terbaik untuk kedua mempelai.
              </p>
            </div>
            <div class="p-4 rounded-2xl bg-[#FFF3EA]/60 space-y-2">
              <span class="text-xs font-bold text-[#4A4E69] flex items-center gap-2">
                <span>🐾</span> Sayang Kucing
              </span>
              <p class="text-xs text-[#4A4E69] leading-relaxed">
                Jaga kenyamanan bersama, dilarang menyalakan laser pointer sembarangan di area pelaminan! 😹
              </p>
            </div>
          </div>

          <p v-if="data.dressCodeNote" class="text-xs text-[#E76F51] font-semibold italic">
            "{{ data.dressCodeNote }}"
          </p>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 8: GALERI FOTO (GalleryInvitation)                    -->
      <!-- ============================================================ -->
      <section
        id="gallery"
        v-if="isSectionEnabled('gallery') && galleryItems.length > 0"
        class="relative py-24 px-6 max-w-6xl mx-auto space-y-14"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 Momen Manis
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B2D42]">
            Galeri Kenangan
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
            Potret bahagia perjalanan cinta kami sebelum melangkah menuju ikrar suci.
          </p>
        </div>

        <div class="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#F4A261]/30 shadow-[0_15px_40px_rgba(231,111,81,0.08)]">
          <GalleryInvitation :items="galleryItems" />
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 9: VIDEO PREWEDDING (YouTube Embed)                   -->
      <!-- ============================================================ -->
      <section
        id="video"
        v-if="isSectionEnabled('video') && data.videoUrl"
        class="relative py-20 px-6 max-w-4xl mx-auto space-y-12"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 Sinema Kasih
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2B2D42]">
            Video Prewedding
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69]">Saksikan rekaman kisah hangat kami dalam tayangan berikut</p>
        </div>

        <div class="relative bg-white rounded-3xl p-4 sm:p-6 border border-[#F4A261]/40 shadow-[0_20px_45px_rgba(231,111,81,0.12)]">
          <!-- Cute Cat Ears Frame Decor -->
          <div class="aspect-video w-full rounded-2xl overflow-hidden bg-black/5">
            <iframe
              :src="getEmbedUrlVideo(data.videoUrl)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 10: LIVE STREAMING                                    -->
      <!-- ============================================================ -->
      <section
        id="live-streaming"
        v-if="isSectionEnabled('live-streaming') && (data.streamingUrl || isPreviewMode)"
        class="relative py-20 px-6 max-w-4xl mx-auto text-center space-y-8"
      >
        <div class="bg-gradient-to-br from-[#FFF3EA] to-[#FFFDF9] rounded-3xl p-8 sm:p-12 border border-[#F4A261]/30 shadow-[0_15px_35px_rgba(231,111,81,0.08)] space-y-6">
          <div class="w-16 h-16 rounded-full bg-[#E76F51] text-white flex items-center justify-center text-2xl mx-auto shadow-md animate-pulse">
            <i class="fa-solid fa-video"></i>
          </div>
          <div class="space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E76F51]">Virtual Wedding</span>
            <h3 class="text-2xl sm:text-3xl font-serif font-bold text-[#2B2D42]">Saksikan Siaran Langsung</h3>
            <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
              Bagi keluarga &amp; sahabat yang berhalangan hadir secara langsung, silakan bergabung melalui siaran virtual pernikahan kami.
            </p>
          </div>
          <div>
            <a
              :href="data.streamingUrl || '#'"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#E76F51] hover:bg-[#d45d3f] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              <i class="fa-solid fa-tower-broadcast"></i>
              <span>Gabung Live Streaming ({{ data.streamingPlatform || 'YouTube' }})</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 11: AMPLOP DIGITAL & KIRIM KADO                       -->
      <!-- ============================================================ -->
      <section
        id="gift"
        v-if="isSectionEnabled('gift')"
        class="relative py-24 px-6 max-w-4xl mx-auto space-y-14"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 Tanda Kasih
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B2D42]">
            Kado &amp; Amplop Digital
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
            Doa restu Anda merupakan karunia terindah. Namun jika ingin memberikan tanda kasih secara digital maupun fisik:
          </p>
        </div>

        <div class="space-y-8">
          <!-- Bank Accounts Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              v-for="(acc, idx) in effectiveBankAccounts"
              :key="idx"
              class="bg-white rounded-3xl p-6 border border-[#F4A261]/30 shadow-[0_10px_30px_rgba(231,111,81,0.08)] space-y-4 relative overflow-hidden"
            >
              <!-- Card Chip Decor & Bank Name -->
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-xl bg-[#FFF3EA] text-[#E76F51] text-xs font-black tracking-wider uppercase">
                  {{ acc.bankName }}
                </span>
                <span class="text-xl">💳</span>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] uppercase tracking-wider text-[#4A4E69]/70 font-semibold">Nomor Rekening:</p>
                <p class="text-lg sm:text-xl font-mono font-bold text-[#2B2D42] tracking-wider">{{ acc.accountNumber }}</p>
                <p class="text-xs text-[#4A4E69] font-medium">a.n. {{ acc.accountHolder }}</p>
              </div>
              <button
                @click="copyText(acc.accountNumber, 'Nomor rekening')"
                class="w-full py-2.5 rounded-full bg-[#FFF3EA] hover:bg-[#E76F51] text-[#E76F51] hover:text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-[#F4A261]/30"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Nomor Rekening</span>
              </button>
            </div>
          </div>

          <!-- Physical Gift Address -->
          <div
            v-if="data.giftAddress || isPreviewMode"
            class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4A261]/30 shadow-[0_10px_30px_rgba(231,111,81,0.08)] space-y-4 text-center max-w-xl mx-auto"
          >
            <div class="w-12 h-12 rounded-full bg-[#FFF3EA] text-[#E76F51] flex items-center justify-center text-xl mx-auto">
              <i class="fa-solid fa-gift"></i>
            </div>
            <div>
              <h4 class="text-lg font-serif font-bold text-[#2B2D42]">Alamat Pengiriman Kado Fisik</h4>
              <p class="text-xs text-[#4A4E69] mt-1 font-medium">
                Penerima: {{ data.giftAddress?.recipientName || `${data.groomName || 'Kuroo'} & ${data.brideName || 'Luna'}` }}
                <span v-if="data.giftAddress?.phoneNumber"> ({{ data.giftAddress.phoneNumber }})</span>
              </p>
              <p class="text-xs text-[#2B2D42] mt-2 font-semibold">
                {{ data.giftAddress?.address || 'Jl. Kucing Bahagia No. 7, Jakarta Selatan 12345' }}
              </p>
            </div>
            <button
              @click="copyText(data.giftAddress?.address || 'Jl. Kucing Bahagia No. 7, Jakarta Selatan 12345', 'Alamat pengiriman')"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2B2D42] hover:bg-[#E76F51] text-white text-xs font-bold transition-all"
            >
              <i class="fa-regular fa-copy"></i>
              <span>Salin Alamat</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 12: RSVP & BUKU TAMU                                  -->
      <!-- ============================================================ -->
      <section
        id="rsvp"
        v-if="isSectionEnabled('rsvp')"
        class="relative py-24 px-6 max-w-4xl mx-auto space-y-14"
      >
        <div class="text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
            🐾 Konfirmasi Kehadiran
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B2D42]">
            RSVP &amp; Doa Restu
          </h2>
          <p class="text-xs sm:text-sm text-[#4A4E69] max-w-md mx-auto">
            Mohon konfirmasikan kehadiran Anda agar kami dapat menyambut Anda dengan penuh kehangatan.
          </p>
        </div>

        <!-- RSVP Form Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#F4A261]/30 shadow-[0_15px_40px_rgba(231,111,81,0.08)] space-y-6">
          <form @submit.prevent="submitRsvpForm" class="space-y-5">
            <!-- Nama Tamu -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-[#4A4E69]">Nama Anda</label>
              <input
                type="text"
                v-model="rsvpForm.name"
                required
                placeholder="Tuliskan nama lengkap Anda..."
                class="w-full px-4 py-3 rounded-2xl bg-[#FFFDF9] border border-[#F4A261]/30 focus:border-[#E76F51] focus:ring-2 focus:ring-[#E76F51]/20 outline-none text-xs text-[#2B2D42] transition-all"
              />
            </div>

            <!-- Konfirmasi Kehadiran -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-[#4A4E69]">Konfirmasi Kehadiran</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label
                  class="flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer text-xs font-bold transition-all text-center"
                  :class="rsvpForm.attendance === 'hadir' ? 'bg-[#FFF3EA] border-[#E76F51] text-[#E76F51]' : 'border-[#F4A261]/30 text-[#4A4E69] hover:bg-[#FFFDF9]'"
                >
                  <input type="radio" value="hadir" v-model="rsvpForm.attendance" class="hidden" />
                  <span>😸 Hadir</span>
                </label>
                <label
                  class="flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer text-xs font-bold transition-all text-center"
                  :class="rsvpForm.attendance === 'tidak' ? 'bg-[#FFF3EA] border-[#E76F51] text-[#E76F51]' : 'border-[#F4A261]/30 text-[#4A4E69] hover:bg-[#FFFDF9]'"
                >
                  <input type="radio" value="tidak" v-model="rsvpForm.attendance" class="hidden" />
                  <span>😿 Berhalangan</span>
                </label>
                <label
                  class="flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer text-xs font-bold transition-all text-center col-span-2 sm:col-span-1"
                  :class="rsvpForm.attendance === 'ragu' ? 'bg-[#FFF3EA] border-[#E76F51] text-[#E76F51]' : 'border-[#F4A261]/30 text-[#4A4E69] hover:bg-[#FFFDF9]'"
                >
                  <input type="radio" value="ragu" v-model="rsvpForm.attendance" class="hidden" />
                  <span>🤔 Masih Ragu</span>
                </label>
              </div>
            </div>

            <!-- Jumlah Tamu (if hadir) -->
            <div v-if="rsvpForm.attendance === 'hadir'" class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-[#4A4E69]">Jumlah Tamu yang Hadir</label>
              <select
                v-model="rsvpForm.totalGuests"
                class="w-full px-4 py-3 rounded-2xl bg-[#FFFDF9] border border-[#F4A261]/30 focus:border-[#E76F51] outline-none text-xs text-[#2B2D42]"
              >
                <option :value="1">1 Orang</option>
                <option :value="2">2 Orang</option>
                <option :value="3">3 Orang</option>
                <option :value="4">4 Orang</option>
              </select>
            </div>

            <!-- Ucapan & Doa -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-[#4A4E69]">Ucapan &amp; Doa Restu</label>
              <textarea
                v-model="rsvpForm.message"
                required
                rows="4"
                placeholder="Tuliskan ucapan manis dan doa restu untuk kedua mempelai..."
                class="w-full px-4 py-3 rounded-2xl bg-[#FFFDF9] border border-[#F4A261]/30 focus:border-[#E76F51] focus:ring-2 focus:ring-[#E76F51]/20 outline-none text-xs text-[#2B2D42] resize-none transition-all"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="submittingRsvp"
              class="w-full py-4 rounded-full bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-cute font-bold text-sm tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>🐾</span>
              <span>{{ submittingRsvp ? 'Mengirim Doa Restu...' : 'Kirim RSVP & Doa Restu' }}</span>
            </button>
          </form>
        </div>

        <!-- Guest Messages List -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-serif font-bold text-[#2B2D42] flex items-center gap-2">
              <span>Buku Tamu</span>
              <span class="text-xs font-normal text-[#E76F51] px-2.5 py-0.5 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
                {{ guestMessages.length }} Ucapan
              </span>
            </h3>
          </div>

          <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
            <div
              v-for="(msg, idx) in guestMessages"
              :key="idx"
              class="bg-white rounded-2xl p-5 border border-[#F4A261]/25 shadow-sm space-y-2 relative"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <!-- Cute Cat Avatar with dynamic pastel tone -->
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                    :style="{ backgroundColor: getAvatarColor(msg.name) }"
                  >
                    🐾
                  </div>
                  <div>
                    <h5 class="text-xs font-bold text-[#2B2D42]">{{ msg.name }}</h5>
                    <span
                      class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      :class="msg.attendance === 'hadir' ? 'bg-emerald-100 text-emerald-700' : msg.attendance === 'tidak' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'"
                    >
                      {{ msg.attendance === 'hadir' ? 'Hadir' : msg.attendance === 'tidak' ? 'Berhalangan' : 'Ragu' }}
                    </span>
                  </div>
                </div>
                <span class="text-[9px] text-[#4A4E69]/60">Terkirim</span>
              </div>
              <p class="text-xs text-[#4A4E69] leading-relaxed pt-1 pl-10">
                “{{ msg.message }}”
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 13: TURUT MENGUNDANG & FOOTER                         -->
      <!-- ============================================================ -->
      <section
        id="family"
        v-if="isSectionEnabled('extended-family') && effectiveTurutMengundang.length > 0"
        class="relative py-20 px-6 max-w-4xl mx-auto text-center space-y-8"
      >
        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#E07A5F] px-3 py-1 rounded-full bg-[#FFF3EA] border border-[#F4A261]/30">
          🐾 Keluarga Besar
        </span>
        <h3 class="text-2xl sm:text-3xl font-serif font-bold text-[#2B2D42]">Turut Mengundang</h3>
        <div class="bg-white/80 rounded-3xl p-6 sm:p-8 border border-[#F4A261]/30 max-w-2xl mx-auto shadow-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#4A4E69]">
            <p v-for="(name, idx) in effectiveTurutMengundang" :key="idx" class="font-medium py-1">
              • {{ name }}
            </p>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="relative py-16 px-6 text-center space-y-6 border-t border-[#F4A261]/30 bg-gradient-to-b from-[#FFFDF9] to-[#FFF3EA]">
        <!-- Couple Silhouette / Paw Footer Art -->
        <div class="space-y-2">
          <p class="text-xs uppercase font-bold tracking-[0.3em] text-[#E76F51]">Terima Kasih</p>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2B2D42]">
            {{ data.groomName || 'Kuroo' }} &amp; {{ data.brideName || 'Luna' }}
          </h2>
          <p class="text-xs text-[#4A4E69] italic max-w-sm mx-auto">
            "Semoga kehangatan cinta kami menjadi berkah bagi kita semua. Sampai jumpa di hari bahagia!"
          </p>
        </div>

        <!-- Watermark Badge from SatuUndangan -->
        <WatermarkBadge variant="dark" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'

// Props Declaration
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

// Reactive data syncing
const data = ref(props.data || {})
watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
  },
  { deep: true, immediate: true }
)

const toast = useToast()
const isOpened = ref(false)
const pawCanvas = ref(null)
let pawAnimId = null

// Preview mode checker
const isPreviewMode = computed(() => !data.value.id || data.value.id === 'live-preview' || data.value.id === 0)

// Guest Display Name
const guestDisplayName = computed(() => {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    return data.value.guestName
  }
  return 'Sahabat & Tamu Terhormat'
})

// ====================================================================
// SECTION ENABLED MAPPING WITH ALIASES
// ====================================================================
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
    quote: ['quote', 'ayat', 'doa']
  }

  const aliases = aliasMap[key] || [key]
  return aliases.some((a) => sections.includes(a))
}

// ====================================================================
// NAVIGATION ITEMS
// ====================================================================
const allNavItems = [
  { id: 'home', label: 'Cover', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'quote', label: 'Ayat', icon: 'fa-solid fa-feather-pointed', key: 'quote' },
  { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart', key: 'couple' },
  { id: 'countdown', label: 'Hitung Mundur', icon: 'fa-solid fa-hourglass-half', key: 'countdown' },
  { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-day', key: 'event' },
  { id: 'story', label: 'Cerita', icon: 'fa-solid fa-book-open', key: 'love-story' },
  { id: 'dress-code', label: 'Dress Code', icon: 'fa-solid fa-shirt', key: 'dress-code' },
  { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'gift', label: 'Kado', icon: 'fa-solid fa-gift', key: 'gift' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' }
]

const navItems = computed(() => {
  return allNavItems.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'gallery') return isSectionEnabled('gallery') && galleryItems.value.length > 0
    return isSectionEnabled(item.key)
  })
})

const activeSection = ref('home')

function scrollToSection(id) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// ====================================================================
// WEB AUDIO API SYNTHESIZER: CUTE SWEET MEOW & SOFT PURR CHIME
// ====================================================================
function playCuteMeow() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'triangle'
    osc2.type = 'sine'

    // Meow frequency sweep contour (420Hz -> 780Hz -> 460Hz)
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.linearRampToValueAtTime(780, now + 0.18)
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.55)

    osc2.frequency.setValueAtTime(840, now)
    osc2.frequency.linearRampToValueAtTime(1560, now + 0.18)
    osc2.frequency.exponentialRampToValueAtTime(920, now + 0.55)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(900, now)
    filter.frequency.linearRampToValueAtTime(1800, now + 0.2)
    filter.frequency.linearRampToValueAtTime(1100, now + 0.55)
    filter.Q.value = 3.2

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.25)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58)

    osc.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc2.start(now)
    osc.stop(now + 0.6)
    osc2.stop(now + 0.6)
  } catch (e) {
    console.debug('WebAudio meow error:', e)
  }
}

function playPurrSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const mod = ctx.createOscillator()
    const modGain = ctx.createGain()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(75, now)

    mod.type = 'sine'
    mod.frequency.setValueAtTime(26, now) // 26 Hz cat purr vibration

    modGain.gain.setValueAtTime(30, now)
    mod.connect(modGain)
    modGain.connect(osc.frequency)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65)

    osc.connect(gain)
    gain.connect(ctx.destination)

    mod.start(now)
    osc.start(now)
    mod.stop(now + 0.68)
    osc.stop(now + 0.68)
  } catch (e) {
    console.debug('WebAudio purr error:', e)
  }
}

// ====================================================================
// INTERACTIVE "ELUS KUCING" PET WIDGET
// ====================================================================
const petCount = ref(0)
const showSpeechBubble = ref(false)
const currentSpeechText = ref('')
const floatingHearts = ref([])
let bubbleTimeout = null

const catDialogues = [
  'Purrrr~ Terima kasih elusannya! Kami bahagia sekali! 😻',
  'Ngeong~ Semoga cinta kita selalu hangat selamanya! 🐾',
  'Meowww! Doa terbaik untuk kedua mempelai & semua sahabat! 💖',
  'Purr purr purr~ Hangatnya pelukan cinta hari ini! ✨',
  'Mrow! Jangan lupa cicipi hidangan lezat di resepsi nanti ya! 🐟'
]

function petTheCat() {
  petCount.value++
  if (petCount.value % 2 === 1) {
    playCuteMeow()
  } else {
    playPurrSound()
  }

  // Random speech
  currentSpeechText.value = catDialogues[Math.floor(Math.random() * catDialogues.length)]
  showSpeechBubble.value = true
  if (bubbleTimeout) clearTimeout(bubbleTimeout)
  bubbleTimeout = setTimeout(() => {
    showSpeechBubble.value = false
  }, 4000)

  // Spawn floating heart / paw
  const emojis = ['🐾', '💕', '😻', '✨', '🧶', '💖']
  const colors = ['#E76F51', '#F4A261', '#E07A5F', '#FFCCD5']
  const newHeart = {
    id: Date.now() + Math.random(),
    x: Math.random() * 40 + 10,
    y: Math.random() * 20 + 20,
    icon: emojis[Math.floor(Math.random() * emojis.length)],
    color: colors[Math.floor(Math.random() * colors.length)]
  }
  floatingHearts.value.push(newHeart)
  setTimeout(() => {
    floatingHearts.value = floatingHearts.value.filter((h) => h.id !== newHeart.id)
  }, 1200)
}

// ====================================================================
// WELCOME GATE CONTROLLER
// ====================================================================
function openInvitationGate() {
  playCuteMeow()
  isOpened.value = true
  toast.success('Selamat datang di pernikahan kami! 🐾', { timeout: 3000 })
}

// ====================================================================
// CANVAS PARTICLES: SOFT PAWS & HEARTS RISING GENTLY
// ====================================================================
function initPawParticles() {
  const canvas = pawCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const particles = []
  const count = Math.min(30, Math.floor(window.innerWidth / 40))

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 6 + 6,
      speedY: -(Math.random() * 0.45 + 0.2),
      speedX: (Math.random() - 0.5) * 0.35,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.015,
      alpha: Math.random() * 0.35 + 0.15,
      type: Math.random() > 0.4 ? 'paw' : 'heart'
    })
  }

  function drawPaw(ctx, r, alpha) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#E76F51'
    // Main pad
    ctx.beginPath()
    ctx.ellipse(0, 0, r, r * 0.8, 0, 0, Math.PI * 2)
    ctx.fill()
    // 4 toe pads
    const toeR = r * 0.32
    ctx.beginPath()
    ctx.arc(-r * 0.75, -r * 0.65, toeR, 0, Math.PI * 2)
    ctx.arc(-r * 0.28, -r * 0.95, toeR, 0, Math.PI * 2)
    ctx.arc(r * 0.28, -r * 0.95, toeR, 0, Math.PI * 2)
    ctx.arc(r * 0.75, -r * 0.65, toeR, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  function drawHeart(ctx, r, alpha) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#FFCCD5'
    ctx.beginPath()
    const topCurveHeight = r * 0.3
    ctx.moveTo(0, topCurveHeight)
    ctx.bezierCurveTo(0, 0, -r, 0, -r, topCurveHeight)
    ctx.bezierCurveTo(-r, (r + topCurveHeight) / 2, 0, r, 0, r * 1.3)
    ctx.bezierCurveTo(0, r, r, (r + topCurveHeight) / 2, r, topCurveHeight)
    ctx.bezierCurveTo(r, 0, 0, 0, 0, topCurveHeight)
    ctx.fill()
    ctx.restore()
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.angle += p.spin
      p.x += p.speedX
      p.y += p.speedY

      if (p.y < -30) {
        p.y = canvas.height + 30
        p.x = Math.random() * canvas.width
      }
      if (p.x < -30) p.x = canvas.width + 30
      if (p.x > canvas.width + 30) p.x = -30

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)

      if (p.type === 'paw') {
        drawPaw(ctx, p.radius, p.alpha)
      } else {
        drawHeart(ctx, p.radius, p.alpha)
      }

      ctx.restore()
    }

    pawAnimId = requestAnimationFrame(render)
  }

  render()
}

// ====================================================================
// COUNTDOWN TIMER LOGIC
// ====================================================================
const countdown = ref({
  Hari: '00',
  Jam: '00',
  Menit: '00',
  Detik: '00'
})
let countdownInterval = null

function updateCountdown() {
  const targetDateStr =
    data.value.resepsiLocation?.dateTime ||
    data.value.akadLocation?.dateTime ||
    data.value.dateTime
  if (!targetDateStr) {
    countdown.value = { Hari: '28', Jam: '08', Menit: '30', Detik: '00' }
    return
  }

  const target = new Date(targetDateStr).getTime()
  if (isNaN(target)) {
    countdown.value = { Hari: '12', Jam: '06', Menit: '45', Detik: '00' }
    return
  }

  const now = new Date().getTime()
  const diff = target - now

  if (diff <= 0) {
    countdown.value = { Hari: '00', Jam: '00', Menit: '00', Detik: '00' }
    return
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % 1000) / 1000) || Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = {
    Hari: String(d).padStart(2, '0'),
    Jam: String(h).padStart(2, '0'),
    Menit: String(m).padStart(2, '0'),
    Detik: String(s).padStart(2, '0')
  }
}

// ====================================================================
// RSVP & GUEST MESSAGES LOGIC
// ====================================================================
const rsvpForm = ref({
  name: '',
  attendance: 'hadir',
  totalGuests: 1,
  message: ''
})
const submittingRsvp = ref(false)
const guestMessages = ref([])

async function submitRsvpForm() {
  if (!rsvpForm.value.name?.trim() || !rsvpForm.value.message?.trim()) {
    toast.error('Mohon lengkapi nama dan doa restu Anda.')
    return
  }

  submittingRsvp.value = true
  try {
    if (data.value.id && !isPreviewMode.value) {
      await createGuestMessage({
        invitationId: data.value.id,
        guestName: rsvpForm.value.name,
        name: rsvpForm.value.name,
        message: rsvpForm.value.message,
        attendance: rsvpForm.value.attendance,
        rsvpStatus: rsvpForm.value.attendance,
        totalGuests: rsvpForm.value.attendance === 'hadir' ? Number(rsvpForm.value.totalGuests) : 0
      })
    }

    guestMessages.value.unshift({
      name: rsvpForm.value.name,
      message: rsvpForm.value.message,
      attendance: rsvpForm.value.attendance,
      totalGuests: rsvpForm.value.totalGuests
    })

    playCuteMeow()
    toast.success('Terima kasih atas doa restunya! Meow~ 🐾')
    rsvpForm.value.message = ''
  } catch (err) {
    console.error('RSVP submit error:', err)
    // Local fallback update for user delight
    guestMessages.value.unshift({
      name: rsvpForm.value.name,
      message: rsvpForm.value.message,
      attendance: rsvpForm.value.attendance,
      totalGuests: rsvpForm.value.totalGuests
    })
    toast.success('Doa restu Anda telah tercatat! 🐾')
    rsvpForm.value.message = ''
  } finally {
    submittingRsvp.value = false
  }
}

async function loadGuestMessages() {
  if (data.value.id && !isPreviewMode.value) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res || []
    } catch {
      setDefaultGuestMessages()
    }
  } else {
    setDefaultGuestMessages()
  }
}

function setDefaultGuestMessages() {
  guestMessages.value = [
    {
      name: 'Aditya & Cindy',
      attendance: 'hadir',
      message: 'Happy wedding cat lover kesayangan! Semoga pernikahannya sehangat pelukan anabul dan selalu diliputi berkah bahagia.'
    },
    {
      name: 'Dr. Faisal (Vet)',
      attendance: 'hadir',
      message: 'Selamat menempuh hidup baru Kuroo & Luna! Turut berbahagia untuk dua insan yang luar biasa penyayang.'
    },
    {
      name: 'Nadira Safitri',
      attendance: 'hadir',
      message: 'Barakallahu lakuma wa baraka alaikuma! Undangan terlucu yang pernah kulihat. Meow selalu ya!'
    }
  ]
}

const avatarColors = ['#E76F51', '#F4A261', '#E07A5F', '#4A4E69', '#2B2D42']
function getAvatarColor(name) {
  if (!name) return avatarColors[0]
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return avatarColors[sum % avatarColors.length]
}

// ====================================================================
// EFFECTIVE DATA HELPERS & FALLBACKS
// ====================================================================
const effectiveStories = computed(() => {
  if (data.value.loveStory && data.value.loveStory.length > 0) {
    return data.value.loveStory
  }
  return [
    {
      title: 'Awal Mula Pertemuan 🐾',
      date: 'Oktober 2022',
      description: 'Pertama kali berpapasan secara tidak sengaja di sebuah cat cafe kecil saat berebut memberi treat pada kucing belang tiga.'
    },
    {
      title: 'Kucing Pengantar Takdir 🧶',
      date: 'Desember 2023',
      description: 'Bersama-sama mengadopsi kucing jalanan pertama kami, Mochi. Dari merawat anabul bersama, rasa cinta kami tumbuh semakin dalam.'
    },
    {
      title: 'Ikrar Menuju Pelaminan 💍',
      date: 'Februari 2026',
      description: 'Di bawah senja pantai dengan kalung kucing bertuliskan "Will You Marry Me?", janji suci untuk hidup bersama selamanya terucap.'
    }
  ]
})

const effectiveBankAccounts = computed(() => {
  if (data.value.bankAccounts && data.value.bankAccounts.length > 0) {
    return data.value.bankAccounts
  }
  return [
    {
      bankName: 'BCA',
      accountNumber: '8830129481',
      accountHolder: data.value.groomName || 'Kuroo Pratama'
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '1370019284712',
      accountHolder: data.value.brideName || 'Luna Amalia'
    }
  ]
})

const effectiveTurutMengundang = computed(() => {
  if (data.value.turutMengundang) {
    if (Array.isArray(data.value.turutMengundang)) return data.value.turutMengundang
    if (typeof data.value.turutMengundang === 'string') {
      return data.value.turutMengundang.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  if (data.value.extendedFamily && Array.isArray(data.value.extendedFamily)) {
    return data.value.extendedFamily
  }
  return [
    'Keluarga Besar Bpk. Hendra Pratama (Bandung)',
    'Keluarga Besar Bpk. Bambang Wijaya (Jakarta)',
    'Komunitas Pecinta Kucing Indonesia (PKI)',
    'Segenap Sahabat & Rekan Kerja'
  ]
})

const galleryItems = computed(() => {
  if (data.value.galleryImages && data.value.galleryImages.length > 0) {
    return data.value.galleryImages.map((src, i) => ({
      src,
      thumbnail: src,
      alt: `Purrfect Moment ${i + 1}`,
      caption: `Momen Kasih ${i + 1}`
    }))
  }
  return [
    { src: '/assets/images/sample-gallery-1.jpg', thumbnail: '/assets/images/sample-gallery-1.jpg', caption: 'Kebersamaan Manis 🐾' },
    { src: '/assets/images/sample-gallery-2.jpg', thumbnail: '/assets/images/sample-gallery-2.jpg', caption: 'Tawa & Dengkuran Hangat 🐱' },
    { src: '/assets/images/sample-gallery-3.jpg', thumbnail: '/assets/images/sample-gallery-3.jpg', caption: 'Menuju Hari Bahagia 💍' },
    { src: '/assets/images/sample-gallery-4.jpg', thumbnail: '/assets/images/sample-gallery-4.jpg', caption: 'Jejak Kasih Selamanya ✨' }
  ]
})

// ====================================================================
// GENERAL HELPERS
// ====================================================================
function formatEventDate(dateStr) {
  if (!dateStr) return 'Sabtu, 28 Maret 2026'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatEventTime(dateStr) {
  if (!dateStr) return '09:00 WIB'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '09:00 WIB'
  return (
    date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB'
  )
}

function getMusicUrl(choice) {
  if (!choice) return '/audio/wedding-acoustic-morning.mp3'
  if (choice.startsWith('yt:') || choice.startsWith('http') || choice.startsWith('/')) return choice
  return `/audio/${choice}`
}

function getEmbedUrlVideo(url) {
  if (!url) return ''
  if (url.includes('embed')) return url
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

function cleanInstagram(handle) {
  return handle ? handle.replace('@', '') : ''
}

function formatInstagramUrl(handle) {
  if (!handle) return '#'
  return `https://instagram.com/${cleanInstagram(handle)}`
}

function copyText(text, label = 'Teks') {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    toast.success(`${label} berhasil disalin! 🐾`)
  })
}

function onImageError(e, type) {
  e.target.src = type === 'groom' ? '/assets/images/sample-groom.jpg' : '/assets/images/sample-bride.jpg'
}

const calendarUrl = computed(() => {
  const targetDateStr =
    data.value.resepsiLocation?.dateTime ||
    data.value.akadLocation?.dateTime ||
    data.value.dateTime
  return buildCalendarLink({ dateTime: targetDateStr, locationName: data.value.resepsiLocation?.locationName }, 'The Wedding Celebration')
})

function buildCalendarLink(event, titlePrefix = 'Pernikahan') {
  const targetDateStr = event?.dateTime || '2026-03-28T09:00:00'
  const start = new Date(targetDateStr)
  if (isNaN(start.getTime())) return '#'
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
  const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
  const title = encodeURIComponent(
    `${titlePrefix} ${data.value.groomName || 'Kuroo'} & ${data.value.brideName || 'Luna'} (Purrfect Match)`
  )
  const details = encodeURIComponent(
    'Pernikahan Kucing & Manusia Penuh Cinta: Dua insan dipersatukan dalam kehangatan ikatan suci.'
  )
  const location = encodeURIComponent(event?.address || event?.locationName || '')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`
}

// ====================================================================
// LIFECYCLE HOOKS
// ====================================================================
onMounted(() => {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvpForm.value.name = data.value.guestName
  }

  loadGuestMessages()
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
  initPawParticles()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (pawAnimId) cancelAnimationFrame(pawAnimId)
  if (bubbleTimeout) clearTimeout(bubbleTimeout)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.purrfect-match-theme {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.font-serif {
  font-family: 'Playfair Display', serif;
}

.font-cute {
  font-family: 'Fredoka', 'Plus Jakarta Sans', sans-serif;
}

/* Animations */
@keyframes floatHeart {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0.8) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px) scale(1.3) rotate(15deg);
  }
}

.animate-float-heart {
  animation: floatHeart 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

/* Gate Transitions */
.gate-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.77, 0, 0.175, 1);
}
.gate-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Bubble Transition */
.pop-bubble-enter-active,
.pop-bubble-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-bubble-enter-from,
.pop-bubble-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

/* Utilities */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
