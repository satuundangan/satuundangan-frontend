<template>
  <div
    class="elysian-parallax-theme relative min-h-screen bg-[#121713] text-[#e8ded1] overflow-x-hidden selection:bg-[#c99e52] selection:text-[#121713]"
  >
    <!-- Background Texture Noise Overlay -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15"
      style="background-image: radial-gradient(#d4af37 0.75px, transparent 0.75px); background-size: 24px 24px;"
    ></div>

    <!-- Music Control Component -->
    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#1c251f"
      accentColor="#dfb974"
      class="z-[55]"
    />

    <!-- ============================================================== -->
    <!-- DESKTOP FLOATING SIDEBAR NAVIGATION                           -->
    <!-- ============================================================== -->
    <nav
      v-if="!showWelcome"
      class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-all duration-700 hidden md:flex"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="scrollToSection(item.id)"
        class="w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 group relative"
        :class="
          activeSection === item.id
            ? 'bg-[#dfb974] text-[#121713] border-[#dfb974] scale-110 shadow-[0_0_15px_rgba(223,185,116,0.5)]'
            : 'bg-[#18211b]/80 text-[#dfb974] border-[#dfb974]/30 hover:bg-[#dfb974]/20 hover:scale-105'
        "
        :title="item.label"
      >
        <i :class="[item.icon, 'text-xs']"></i>
        <span
          class="absolute right-14 px-3 py-1 bg-[#18211b] text-[#f4eee1] text-[10px] font-medium tracking-widest uppercase rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-[#dfb974]/30"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <!-- ============================================================== -->
    <!-- MOBILE BOTTOM NAVIGATION                                       -->
    <!-- ============================================================== -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#161f18]/90 backdrop-blur-lg rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-[#dfb974]/30 w-[92%] max-w-md md:hidden transition-all duration-700 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-2 py-2.5 w-full justify-around">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-1 transition-all duration-300 px-2 py-1"
          :class="
            activeSection === item.id
              ? 'text-[#dfb974] -translate-y-0.5 scale-105'
              : 'text-[#9fa89e] hover:text-[#dfb974]'
          "
        >
          <i :class="[item.icon, 'text-base']"></i>
          <span class="max-w-[50px] truncate text-[8px] font-semibold tracking-wider uppercase">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- ============================================================== -->
    <!-- WELCOME GATE / COVER MODAL                                    -->
    <!-- Luxury Roman Arch split door with golden monogram seal         -->
    <!-- ============================================================== -->
    <transition name="gate-open">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#0f1410] text-[#f4eee1] overflow-hidden"
      >
        <!-- Background Atmospheric Glow -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,185,116,0.18)_0%,transparent_70%)] pointer-events-none"></div>

        <!-- Parallax Depth Backdrop in Gate -->
        <div
          class="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none scale-105 transition-transform duration-1000"
          style="background-image: url('/assets/images/elysian/bg-cathedral-depth.svg');"
        ></div>

        <!-- Left Gate Leaf Foliage Accent -->
        <img
          src="/assets/images/elysian/foreground-foliage-left.svg"
          alt=""
          class="absolute -left-12 -bottom-10 w-48 sm:w-64 md:w-80 pointer-events-none opacity-60 transform -rotate-12"
        />
        <!-- Right Gate Leaf Foliage Accent -->
        <img
          src="/assets/images/elysian/foreground-foliage-right.svg"
          alt=""
          class="absolute -right-12 -bottom-10 w-48 sm:w-64 md:w-80 pointer-events-none opacity-60 transform rotate-12"
        />

        <!-- Center Luxury Card -->
        <div
          class="relative z-10 w-full max-w-md bg-[#18211b]/90 backdrop-blur-xl p-8 sm:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#dfb974]/40 space-y-8 animate-float"
        >
          <!-- Crest Monogram Arch -->
          <div class="w-16 h-16 mx-auto rounded-full border border-[#dfb974] flex items-center justify-center bg-[#131a15] shadow-[0_0_20px_rgba(223,185,116,0.25)]">
            <span class="font-serif text-2xl text-[#dfb974] tracking-widest italic">
              {{ (data.groomName || 'E')[0] }}&amp;{{ (data.brideName || 'L')[0] }}
            </span>
          </div>

          <!-- Titles & Names -->
          <div class="space-y-3">
            <p class="text-[10px] sm:text-xs uppercase font-medium tracking-[0.35em] text-[#dfb974]">
              The Wedding Celebration of
            </p>
            <h1 class="text-4xl sm:text-5xl font-serif text-[#f4eee1] leading-tight">
              {{ data.groomName || 'Alexander' }}
              <br />
              <span class="text-2xl sm:text-3xl font-serif italic text-[#dfb974]">&amp;</span>
              <br />
              {{ data.brideName || 'Seraphina' }}
            </h1>
          </div>

          <!-- Guest Invitation Card -->
          <div class="py-5 border-y border-[#dfb974]/25 space-y-1 bg-[#141a15]/50 rounded-xl px-4">
            <p class="text-[9px] uppercase tracking-[0.3em] text-[#9fa89e]">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p class="text-lg sm:text-xl font-bold tracking-wide text-[#dfb974] truncate">
              {{ data.guestName ? data.guestName : 'Tamu Undangan' }}
            </p>
          </div>

          <!-- Open Button -->
          <button
            @click="openInvitation"
            class="w-full py-4 bg-gradient-to-r from-[#b68945] via-[#dfb974] to-[#b68945] text-[#121713] font-bold rounded-full transition-all duration-300 text-xs uppercase tracking-[0.25em] shadow-[0_8px_25px_rgba(223,185,116,0.35)] hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(223,185,116,0.5)] active:scale-95 flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-envelope-open text-xs"></i>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ============================================================== -->
    <!-- MAIN CONTENT CONTAINER                                         -->
    <!-- ============================================================== -->
    <div
      v-if="!showWelcome"
      id="main-content"
      ref="mainScrollContainer"
      class="relative z-30 transition-opacity duration-1000 overflow-x-hidden"
    >
      <!-- ============================================================ -->
      <!-- SECTION 1: HERO MULTI-LAYER PARALLAX DEPTH                   -->
      <!-- ============================================================ -->
      <section
        id="home"
        ref="heroSectionRef"
        class="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-[#121713]"
      >
        <!-- LAYER 1 (DEPTH): Distant Cathedral & Mountains Background (moves at slow speed) -->
        <div
          class="absolute inset-0 w-full h-[130%] -top-[15%] bg-cover bg-center pointer-events-none will-change-transform z-0"
          :style="{
            backgroundImage: `url('/assets/images/elysian/bg-cathedral-depth.svg')`,
            transform: `translate3d(0, ${parallaxBgOffset}px, 0) scale(${1.05 + parallaxZoom * 0.05})`
          }"
        ></div>

        <!-- Atmospheric Vignette & Soft Gradient -->
        <div class="absolute inset-0 bg-gradient-to-b from-[#121713]/40 via-transparent to-[#121713] pointer-events-none z-[1]"></div>

        <!-- Floating Dust Particles (Subtle Golden Sparkles) -->
        <div class="absolute inset-0 pointer-events-none z-[2] overflow-hidden opacity-60">
          <div class="particle-sparkle particle-1"></div>
          <div class="particle-sparkle particle-2"></div>
          <div class="particle-sparkle particle-3"></div>
          <div class="particle-sparkle particle-4"></div>
          <div class="particle-sparkle particle-5"></div>
        </div>

        <!-- LAYER 2 (MIDDLE): Roman Arch & Couple Portrait (moves at medium speed) -->
        <div
          class="relative z-[10] w-full max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center will-change-transform"
          :style="{
            transform: `translate3d(0, ${parallaxMidOffset}px, 0)`
          }"
        >
          <!-- Eyebrow Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18211b]/80 border border-[#dfb974]/40 shadow-lg mb-6 backdrop-blur-md"
            v-observe
          >
            <i class="fa-solid fa-gem text-[#dfb974] text-xs"></i>
            <span class="text-[9px] uppercase tracking-[0.3em] font-semibold text-[#dfb974]">
              Exclusive Wedding Invitation
            </span>
          </div>

          <!-- Typography Couple Title (Floating in 3D Depth) -->
          <h1
            class="text-5xl sm:text-7xl md:text-8xl font-serif text-[#f4eee1] leading-[1.08] tracking-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] mb-8"
            v-observe
          >
            {{ data.groomName || 'Alexander' }}
            <br />
            <span class="text-3xl sm:text-5xl md:text-6xl italic text-[#dfb974] font-serif">&amp;</span>
            <br />
            {{ data.brideName || 'Seraphina' }}
          </h1>

          <!-- Middle Layer: 3D Arch Framed Photo -->
          <div class="relative w-64 sm:w-80 md:w-96 aspect-[3/4] mb-8 group" v-observe>
            <!-- Golden Arch Frame SVG Overlay -->
            <img
              src="/assets/images/elysian/arch-frame-gold.svg"
              alt=""
              class="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] z-20 pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
            />
            <!-- Couple Portrait Cutout / Photo -->
            <div class="w-full h-full rounded-t-full rounded-b-2xl overflow-hidden bg-[#1b251e] shadow-2xl relative z-10 border border-[#dfb974]/30">
              <img
                :src="data.photoCoupleUrl || '/assets/images/sample-gallery-1.jpg'"
                @error="onImageError($event, 'couple')"
                alt="Couple"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#121713]/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>

          <!-- Wedding Date Pill -->
          <div class="space-y-2" v-observe>
            <p class="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-[#dfb974]">
              {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
            </p>
            <p class="text-[10px] tracking-[0.25em] uppercase text-[#9fa89e]">
              Jakarta, Indonesia
            </p>
          </div>
        </div>

        <!-- LAYER 3 (FOREGROUND): Floating Botanical Eucalyptus & Rose Branches -->
        <!-- Left Foliage (drifts outward and downward on scroll) -->
        <div
          class="absolute -bottom-10 left-0 w-44 sm:w-72 md:w-96 pointer-events-none z-[25] will-change-transform"
          :style="{
            transform: `translate3d(${parallaxFrontLeftX}px, ${parallaxFrontY}px, 0)`
          }"
        >
          <img
            src="/assets/images/elysian/foreground-foliage-left.svg"
            alt=""
            class="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
          />
        </div>

        <!-- Right Foliage (drifts outward right and downward on scroll) -->
        <div
          class="absolute -bottom-10 right-0 w-44 sm:w-72 md:w-96 pointer-events-none z-[25] will-change-transform"
          :style="{
            transform: `translate3d(${parallaxFrontRightX}px, ${parallaxFrontY}px, 0)`
          }"
        >
          <img
            src="/assets/images/elysian/foreground-foliage-right.svg"
            alt=""
            class="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
          />
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-70 pointer-events-none animate-bounce">
          <span class="text-[8px] uppercase tracking-[0.3em] text-[#dfb974]">Gulir Ke Bawah</span>
          <i class="fa-solid fa-chevron-down text-xs text-[#dfb974]"></i>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 2: QUOTE / AYAT SUCI                                 -->
      <!-- ============================================================ -->
      <section
        id="quote"
        v-if="isSectionEnabled('quote')"
        class="py-28 px-6 bg-[#161d18] relative overflow-hidden text-center border-t border-b border-[#dfb974]/20"
      >
        <!-- Background Glow -->
        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#dfb974]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="max-w-3xl mx-auto space-y-8 relative z-10" v-observe>
          <div class="w-12 h-12 mx-auto rounded-full border border-[#dfb974]/50 flex items-center justify-center text-[#dfb974] bg-[#121713]">
            <i class="fa-solid fa-feather-pointed text-base"></i>
          </div>

          <p class="text-xl sm:text-2xl md:text-3xl font-serif text-[#f4eee1] leading-relaxed italic">
            "{{ data.quoteText || defaultQuoteText }}"
          </p>

          <div class="flex items-center justify-center gap-4">
            <div class="w-12 h-px bg-gradient-to-r from-transparent to-[#dfb974]"></div>
            <p class="text-xs uppercase tracking-[0.3em] font-semibold text-[#dfb974]">
              {{ data.quoteSource || defaultQuoteSource }}
            </p>
            <div class="w-12 h-px bg-gradient-to-l from-transparent to-[#dfb974]"></div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 3: COUPLE PROFILE                                     -->
      <!-- ============================================================ -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6 relative bg-[#121713]">
        <div class="max-w-5xl mx-auto space-y-24">
          <!-- Section Title -->
          <div class="text-center space-y-3" v-observe>
            <p class="text-[10px] uppercase font-bold tracking-[0.35em] text-[#dfb974]">Mempelai Bahagia</p>
            <h2 class="text-4xl sm:text-5xl font-serif text-[#f4eee1]">Kedua Mempelai</h2>
            <div class="w-16 h-0.5 bg-[#dfb974] mx-auto rounded-full"></div>
          </div>

          <!-- Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 items-center">
            <!-- Groom Card -->
            <div class="flex flex-col items-center text-center space-y-6" v-observe>
              <div class="relative w-64 h-80 group">
                <img
                  src="/assets/images/elysian/arch-frame-gold.svg"
                  alt=""
                  class="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] z-20 pointer-events-none drop-shadow-lg"
                />
                <div class="w-full h-full rounded-t-full rounded-b-2xl overflow-hidden bg-[#18211b] border border-[#dfb974]/30 shadow-xl relative z-10">
                  <img
                    :src="data.groomPhotoUrl || '/assets/images/sample-groom.jpg'"
                    @error="onImageError($event, 'groom')"
                    alt="Groom"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <p class="text-[10px] uppercase font-bold tracking-[0.3em] text-[#dfb974]">Mempelai Pria</p>
                <h3 class="text-3xl font-serif text-[#f4eee1]">{{ data.groomName || 'Alexander Pratama' }}</h3>
                <p class="text-xs text-[#9fa89e] leading-relaxed max-w-xs">
                  Putra tercinta dari
                  <br />
                  <span class="font-medium text-[#e8ded1]">
                    {{ data.parents?.groomParents || 'Bpk. Hendra Pratama & Ibu Rina Kartika' }}
                  </span>
                </p>
              </div>

              <a
                v-if="data.socialMediaGroom?.instagram"
                :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                target="_blank"
                class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#18211b] text-xs font-semibold text-[#dfb974] border border-[#dfb974]/40 hover:bg-[#dfb974] hover:text-[#121713] transition-all"
              >
                <i class="fa-brands fa-instagram"></i>
                <span>@{{ cleanInstagram(data.socialMediaGroom.instagram) }}</span>
              </a>
            </div>

            <!-- Bride Card -->
            <div class="flex flex-col items-center text-center space-y-6" v-observe>
              <div class="relative w-64 h-80 group">
                <img
                  src="/assets/images/elysian/arch-frame-gold.svg"
                  alt=""
                  class="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] z-20 pointer-events-none drop-shadow-lg"
                />
                <div class="w-full h-full rounded-t-full rounded-b-2xl overflow-hidden bg-[#18211b] border border-[#dfb974]/30 shadow-xl relative z-10">
                  <img
                    :src="data.bridePhotoUrl || '/assets/images/sample-bride.jpg'"
                    @error="onImageError($event, 'bride')"
                    alt="Bride"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <p class="text-[10px] uppercase font-bold tracking-[0.3em] text-[#dfb974]">Mempelai Wanita</p>
                <h3 class="text-3xl font-serif text-[#f4eee1]">{{ data.brideName || 'Seraphina Wijaya' }}</h3>
                <p class="text-xs text-[#9fa89e] leading-relaxed max-w-xs">
                  Putri tercinta dari
                  <br />
                  <span class="font-medium text-[#e8ded1]">
                    {{ data.parents?.brideParents || 'Bpk. Bambang Wijaya & Ibu Ratna Dewi' }}
                  </span>
                </p>
              </div>

              <a
                v-if="data.socialMediaBride?.instagram"
                :href="formatInstagramUrl(data.socialMediaBride.instagram)"
                target="_blank"
                class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#18211b] text-xs font-semibold text-[#dfb974] border border-[#dfb974]/40 hover:bg-[#dfb974] hover:text-[#121713] transition-all"
              >
                <i class="fa-brands fa-instagram"></i>
                <span>@{{ cleanInstagram(data.socialMediaBride.instagram) }}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 4: COUNTDOWN TIMER                                   -->
      <!-- ============================================================ -->
      <section
        id="countdown"
        v-if="isSectionEnabled('countdown')"
        class="py-24 px-6 bg-[#161d18] relative text-center border-t border-b border-[#dfb974]/20"
      >
        <div class="max-w-4xl mx-auto space-y-10" v-observe>
          <div class="space-y-2">
            <p class="text-[10px] uppercase font-bold tracking-[0.35em] text-[#dfb974]">Menuju Hari Bahagia</p>
            <h2 class="text-3xl sm:text-4xl font-serif text-[#f4eee1]">Waktu Yang Dinantikan</h2>
          </div>

          <!-- Timer Boxes -->
          <div class="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-4 sm:p-6 bg-[#121713]/80 rounded-2xl border border-[#dfb974]/40 shadow-lg backdrop-blur-sm space-y-1"
            >
              <p class="text-2xl sm:text-4xl font-serif font-bold text-[#dfb974]">{{ val }}</p>
              <p class="text-[9px] sm:text-xs uppercase tracking-widest text-[#9fa89e]">{{ label }}</p>
            </div>
          </div>

          <!-- Add to Calendar Button -->
          <div class="pt-4">
            <a
              :href="calendarUrl"
              target="_blank"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#b68945] to-[#dfb974] text-[#121713] font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
            >
              <i class="fa-solid fa-calendar-plus"></i>
              <span>Simpan Tanggal di Kalender</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 5: EVENT DETAILS (AKAD & RESEPSI)                     -->
      <!-- ============================================================ -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 bg-[#121713] relative">
        <div class="max-w-5xl mx-auto space-y-20">
          <div class="text-center space-y-3" v-observe>
            <p class="text-[10px] uppercase font-bold tracking-[0.35em] text-[#dfb974]">Rangkaian Acara</p>
            <h2 class="text-4xl sm:text-5xl font-serif text-[#f4eee1]">Waktu &amp; Lokasi</h2>
            <div class="w-16 h-0.5 bg-[#dfb974] mx-auto rounded-full"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Akad Nikah Card -->
            <div
              class="p-8 sm:p-10 rounded-[28px] bg-[#18211b]/80 border border-[#dfb974]/35 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md"
              v-observe
            >
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-[0.3em] font-bold text-[#dfb974]">Akad Nikah</span>
                <i class="fa-solid fa-ring text-xl text-[#dfb974]"></i>
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl font-serif text-[#f4eee1]">
                  {{ formatEventDate(data.akadLocation?.dateTime || data.dateTime) }}
                </h3>
                <p class="text-sm font-semibold text-[#dfb974] tracking-wider">
                  Pukul {{ data.akadLocation?.startTime || formatEventTime(data.akadLocation?.dateTime || data.dateTime) }}
                  {{ data.akadLocation?.endTime ? `- ${data.akadLocation.endTime}` : 'WIB' }}
                </p>
              </div>

              <div class="space-y-1 text-sm text-[#9fa89e] border-t border-[#dfb974]/20 pt-4">
                <p class="font-bold text-[#e8ded1]">{{ data.akadLocation?.locationName || 'Masjid Agung Al-Azhar' }}</p>
                <p class="text-xs leading-relaxed">{{ data.akadLocation?.address || 'Jl. Sisingamangaraja No.1, Kebayoran Baru, Jakarta Selatan' }}</p>
              </div>

              <a
                v-if="data.akadLocation?.mapUrl || data.akadLocation?.address"
                :href="data.akadLocation.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(data.akadLocation.address)}`"
                target="_blank"
                class="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#131a15] text-xs font-semibold text-[#dfb974] border border-[#dfb974]/40 hover:bg-[#dfb974] hover:text-[#121713] transition-all"
              >
                <i class="fa-solid fa-map-location-dot"></i>
                <span>Petunjuk Arah Google Maps</span>
              </a>
            </div>

            <!-- Resepsi Card -->
            <div
              class="p-8 sm:p-10 rounded-[28px] bg-[#18211b]/80 border border-[#dfb974]/35 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md"
              v-observe
            >
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-[0.3em] font-bold text-[#dfb974]">Resepsi Pernikahan</span>
                <i class="fa-solid fa-champagne-glasses text-xl text-[#dfb974]"></i>
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl font-serif text-[#f4eee1]">
                  {{ formatEventDate(data.resepsiLocation?.dateTime || data.dateTime) }}
                </h3>
                <p class="text-sm font-semibold text-[#dfb974] tracking-wider">
                  Pukul {{ data.resepsiLocation?.startTime || formatEventTime(data.resepsiLocation?.dateTime || data.dateTime) }}
                  {{ data.resepsiLocation?.endTime ? `- ${data.resepsiLocation.endTime}` : 'WIB' }}
                </p>
              </div>

              <div class="space-y-1 text-sm text-[#9fa89e] border-t border-[#dfb974]/20 pt-4">
                <p class="font-bold text-[#e8ded1]">{{ data.resepsiLocation?.locationName || 'The Glass House Grand Ballroom' }}</p>
                <p class="text-xs leading-relaxed">{{ data.resepsiLocation?.address || 'Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan' }}</p>
              </div>

              <a
                v-if="data.resepsiLocation?.mapUrl || data.resepsiLocation?.address"
                :href="data.resepsiLocation.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(data.resepsiLocation.address)}`"
                target="_blank"
                class="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#131a15] text-xs font-semibold text-[#dfb974] border border-[#dfb974]/40 hover:bg-[#dfb974] hover:text-[#121713] transition-all"
              >
                <i class="fa-solid fa-map-location-dot"></i>
                <span>Petunjuk Arah Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 6: LOVE STORY                                         -->
      <!-- ============================================================ -->
      <section
        id="story"
        v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)"
        class="py-32 px-6 bg-[#161d18] relative"
      >
        <div class="max-w-4xl mx-auto space-y-20">
          <div class="text-center space-y-3" v-observe>
            <p class="text-[10px] uppercase font-bold tracking-[0.35em] text-[#dfb974]">Kisah Kasih</p>
            <h2 class="text-4xl sm:text-5xl font-serif text-[#f4eee1]">Perjalanan Cinta</h2>
            <div class="w-16 h-0.5 bg-[#dfb974] mx-auto rounded-full"></div>
          </div>

          <div class="relative border-l border-[#dfb974]/30 ml-4 sm:ml-32 space-y-12">
            <div
              v-for="(story, idx) in effectiveStories"
              :key="idx"
              class="relative pl-8 sm:pl-12 group"
              v-observe
            >
              <!-- Timeline Dot -->
              <div class="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-[#121713] border-2 border-[#dfb974] group-hover:scale-125 transition-transform flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-[#dfb974]"></div>
              </div>

              <!-- Date Badge (Desktop Left) -->
              <span class="sm:absolute sm:-left-32 sm:top-1 text-xs font-bold uppercase tracking-wider text-[#dfb974] block sm:text-right sm:w-24 mb-2 sm:mb-0">
                {{ story.date }}
              </span>

              <!-- Content Box -->
              <div class="p-6 bg-[#121713]/70 rounded-2xl border border-[#dfb974]/25 shadow-lg space-y-3">
                <div v-if="story.image" class="aspect-video rounded-xl overflow-hidden mb-3">
                  <img :src="story.image" alt="" class="w-full h-full object-cover" />
                </div>
                <h3 class="text-xl font-serif text-[#f4eee1]">{{ story.title }}</h3>
                <p class="text-xs sm:text-sm text-[#9fa89e] leading-relaxed">{{ story.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 7: GALLERY                                            -->
      <!-- ============================================================ -->
      <section id="gallery" v-if="isSectionEnabled('gallery')" class="py-32 px-6 bg-[#121713] relative">
        <div class="max-w-6xl mx-auto space-y-16">
          <div class="text-center space-y-3" v-observe>
            <p class="text-[10px] uppercase font-bold tracking-[0.35em] text-[#dfb974]">Kenangan Indah</p>
            <h2 class="text-4xl sm:text-5xl font-serif text-[#f4eee1]">Galeri Momen</h2>
            <div class="w-16 h-0.5 bg-[#dfb974] mx-auto rounded-full"></div>
          </div>

          <GalleryInvitation
            :images="galleryItems"
            :previewMode="isPreviewMode"
            accentColor="#dfb974"
            class="z-10"
          />
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 8: DIGITAL GIFT / ENVELOPE                            -->
      <!-- ============================================================ -->
      <section id="gift" v-if="isSectionEnabled('gift')" class="py-32 px-6 bg-[#161d18] relative">
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-3" v-observe>
            <p class="text-[10px] uppercase font-bold tracking-[0.35em] text-[#dfb974]">Tanda Kasih</p>
            <h2 class="text-4xl sm:text-5xl font-serif text-[#f4eee1]">Amplop Digital</h2>
            <p class="text-xs text-[#9fa89e] max-w-md mx-auto leading-relaxed">
              Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika berkenan memberikan tanda kasih, dapat melalui:
            </p>
          </div>

          <!-- Bank Accounts -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
            <div
              v-for="(bank, idx) in effectiveBankAccounts"
              :key="idx"
              class="p-8 bg-[#121713]/80 rounded-[28px] border border-[#dfb974]/35 shadow-xl space-y-6 text-center backdrop-blur-md"
              v-observe
            >
              <div class="flex items-center justify-between pb-4 border-b border-[#dfb974]/20">
                <span class="text-sm font-bold tracking-widest text-[#dfb974] uppercase">{{ bank.bankName }}</span>
                <i class="fa-solid fa-credit-card text-[#dfb974]"></i>
              </div>

              <div class="space-y-1">
                <p class="text-2xl font-mono tracking-widest font-bold text-[#f4eee1]">{{ bank.accountNumber }}</p>
                <p class="text-xs text-[#9fa89e] uppercase tracking-wider">a.n. {{ bank.accountHolder || bank.accountName }}</p>
              </div>

              <button
                @click="copyText(bank.accountNumber, 'Nomor rekening')"
                class="w-full py-3 rounded-full bg-[#18211b] text-xs font-bold text-[#dfb974] border border-[#dfb974]/40 hover:bg-[#dfb974] hover:text-[#121713] transition-all flex items-center justify-center gap-2"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Nomor Rekening</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 9: RSVP & WELL WISHES                                -->
      <!-- ============================================================ -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6 bg-[#121713] relative">
        <div class="max-w-3xl mx-auto space-y-16">
          <div class="text-center space-y-3" v-observe>
            <p class="text-[10px] uppercase font-bold tracking-[0.35em] text-[#dfb974]">Konfirmasi Kehadiran</p>
            <h2 class="text-4xl sm:text-5xl font-serif text-[#f4eee1]">RSVP &amp; Doa Restu</h2>
            <div class="w-16 h-0.5 bg-[#dfb974] mx-auto rounded-full"></div>
          </div>

          <!-- Form Box -->
          <div class="p-8 sm:p-10 rounded-[30px] bg-[#18211b]/80 border border-[#dfb974]/35 shadow-2xl space-y-6 backdrop-blur-md" v-observe>
            <form @submit.prevent="submitRsvpForm" class="space-y-5">
              <!-- Name Input -->
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-[#dfb974]">Nama Anda</label>
                <input
                  v-model="rsvpForm.name"
                  type="text"
                  placeholder="Isikan nama lengkap"
                  required
                  class="w-full px-4 py-3 rounded-xl bg-[#121713] border border-[#dfb974]/30 text-[#f4eee1] placeholder-[#5c685f] focus:outline-none focus:border-[#dfb974] text-sm"
                />
              </div>

              <!-- Attendance Choice -->
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-[#dfb974]">Konfirmasi Kehadiran</label>
                <div class="grid grid-cols-2 gap-3">
                  <label
                    class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all"
                    :class="rsvpForm.attendance === 'hadir' ? 'bg-[#dfb974] text-[#121713] border-[#dfb974]' : 'bg-[#121713] text-[#9fa89e] border-[#dfb974]/30'"
                  >
                    <input type="radio" value="hadir" v-model="rsvpForm.attendance" class="hidden" />
                    <i class="fa-solid fa-check"></i> Hadir
                  </label>
                  <label
                    class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all"
                    :class="rsvpForm.attendance === 'tidak_hadir' ? 'bg-[#dfb974] text-[#121713] border-[#dfb974]' : 'bg-[#121713] text-[#9fa89e] border-[#dfb974]/30'"
                  >
                    <input type="radio" value="tidak_hadir" v-model="rsvpForm.attendance" class="hidden" />
                    <i class="fa-solid fa-xmark"></i> Tidak Hadir
                  </label>
                </div>
              </div>

              <!-- Number of Guests -->
              <div v-if="rsvpForm.attendance === 'hadir'" class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-[#dfb974]">Jumlah Tamu</label>
                <select
                  v-model="rsvpForm.totalGuests"
                  class="w-full px-4 py-3 rounded-xl bg-[#121713] border border-[#dfb974]/30 text-[#f4eee1] focus:outline-none focus:border-[#dfb974] text-sm"
                >
                  <option :value="1">1 Orang</option>
                  <option :value="2">2 Orang</option>
                  <option :value="3">3 Orang</option>
                  <option :value="4">4 Orang</option>
                </select>
              </div>

              <!-- Message -->
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-[#dfb974]">Ucapan &amp; Doa Restu</label>
                <textarea
                  v-model="rsvpForm.message"
                  rows="4"
                  placeholder="Tuliskan ucapan selamat dan doa untuk kedua mempelai..."
                  required
                  class="w-full px-4 py-3 rounded-xl bg-[#121713] border border-[#dfb974]/30 text-[#f4eee1] placeholder-[#5c685f] focus:outline-none focus:border-[#dfb974] text-sm"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-4 rounded-full bg-gradient-to-r from-[#b68945] via-[#dfb974] to-[#b68945] text-[#121713] font-bold text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {{ submittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi & Doa Restu' }}
              </button>
            </form>
          </div>

          <!-- Feed of Well Wishes -->
          <div v-if="guestMessages.length > 0" class="space-y-4" v-observe>
            <h3 class="text-lg font-serif text-[#dfb974] text-center mb-6">Doa &amp; Harapan Sahabat</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto pr-2 no-scrollbar">
              <div
                v-for="(msg, idx) in guestMessages"
                :key="idx"
                class="p-4 bg-[#18211b]/60 rounded-xl border border-[#dfb974]/20 space-y-1.5"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#dfb974]">{{ msg.name }}</span>
                  <span
                    class="text-[9px] uppercase px-2 py-0.5 rounded-full"
                    :class="msg.attendance === 'hadir' ? 'bg-[#28382c] text-[#a3c4a9]' : 'bg-[#382626] text-[#c4a3a3]'"
                  >
                    {{ msg.attendance === 'hadir' ? 'Hadir' : 'Berhalangan' }}
                  </span>
                </div>
                <p class="text-xs text-[#e8ded1] leading-relaxed">{{ msg.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- FOOTER & WATERMARK                                           -->
      <!-- ============================================================ -->
      <footer class="py-24 text-center bg-[#0d120e] space-y-6 pb-28 md:pb-24 border-t border-[#dfb974]/20 relative">
        <div class="w-12 h-12 mx-auto rounded-full border border-[#dfb974]/40 flex items-center justify-center text-[#dfb974]">
          <span class="font-serif text-lg italic">
            {{ (data.groomName || 'A')[0] }}&amp;{{ (data.brideName || 'S')[0] }}
          </span>
        </div>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#f4eee1]">
          {{ data.groomName || 'Alexander' }} &amp; {{ data.brideName || 'Seraphina' }}
        </h2>
        <p class="text-xs text-[#9fa89e] tracking-widest uppercase">
          Terima kasih atas doa &amp; kehadiran Anda
        </p>

        <div class="pt-6">
          <WatermarkBadge variant="dark" />
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
  },
  { deep: true, immediate: true }
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)
const showWelcome = ref(true)

// ====================================================================
// PARALLAX ENGINE (IntersectionObserver + requestAnimationFrame)
// ====================================================================
const heroSectionRef = ref(null)
const parallaxBgOffset = ref(0)
const parallaxMidOffset = ref(0)
const parallaxFrontLeftX = ref(0)
const parallaxFrontRightX = ref(0)
const parallaxFrontY = ref(0)
const parallaxZoom = ref(0)

let isHeroVisible = false
let ticking = false
let heroObserver = null

function updateParallax() {
  if (!isHeroVisible) {
    ticking = false
    return
  }

  const scrollY = window.scrollY || window.pageYOffset || 0
  const maxRange = window.innerHeight * 1.5
  const progress = Math.min(Math.max(scrollY / maxRange, 0), 1)

  // Layer 1 (Depth Far BG): slow upward drift
  parallaxBgOffset.value = scrollY * 0.22
  parallaxZoom.value = progress

  // Layer 2 (Middle Portrait + Title): moderate upward translation
  parallaxMidOffset.value = -scrollY * 0.15

  // Layer 3 (Foreground Left/Right Foliage): outwards horizontal parting and slight rise
  parallaxFrontLeftX.value = -scrollY * 0.35
  parallaxFrontRightX.value = scrollY * 0.35
  parallaxFrontY.value = scrollY * 0.12

  ticking = false
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateParallax)
    ticking = true
  }
}

function initParallaxEngine() {
  if (typeof window === 'undefined') return

  if (heroSectionRef.value) {
    heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isHeroVisible = e.isIntersecting
          if (isHeroVisible) {
            updateParallax()
          }
        })
      },
      { threshold: [0, 0.2, 0.5, 0.8, 1] }
    )
    heroObserver.observe(heroSectionRef.value)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
}

// ====================================================================
// SECTION ENABLED CHECKER
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
  { id: 'countdown', label: 'Waktu', icon: 'fa-solid fa-hourglass-half', key: 'countdown' },
  { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-day', key: 'event' },
  { id: 'story', label: 'Cerita', icon: 'fa-solid fa-book-open', key: 'love-story' },
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

function initScrollSpy() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activeSection.value = e.target.id
      })
    },
    { threshold: 0.4 }
  )

  navItems.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

// ====================================================================
// OBSERVE DIRECTIVE (Smooth scroll reveal)
// ====================================================================
const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-1000', 'ease-out')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.remove('opacity-0', 'translate-y-8')
            el.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
  }
}

// ====================================================================
// WELCOME GATE CONTROLLER
// ====================================================================
function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    initScrollSpy()
    initParallaxEngine()
  }, 300)
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
    countdown.value = { Hari: '24', Jam: '08', Menit: '45', Detik: '00' }
    return
  }

  const target = new Date(targetDateStr).getTime()
  if (isNaN(target)) {
    countdown.value = { Hari: '24', Jam: '08', Menit: '45', Detik: '00' }
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
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = {
    Hari: String(d).padStart(2, '0'),
    Jam: String(h).padStart(2, '0'),
    Menit: String(m).padStart(2, '0'),
    Detik: String(s).padStart(2, '0')
  }
}

// ====================================================================
// RSVP & GUEST MESSAGES
// ====================================================================
const rsvpForm = ref({
  name: '',
  attendance: 'hadir',
  totalGuests: 1,
  message: ''
})
const submittingRsvp = ref(false)
const guestMessages = ref([])

async function loadGuestMessages() {
  if (data.value.id && !isPreviewMode.value) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      if (res?.data && Array.isArray(res.data)) {
        guestMessages.value = res.data
      }
    } catch {
      // quiet fallback
    }
  }

  if (guestMessages.value.length === 0) {
    guestMessages.value = [
      {
        name: 'Darmawan & Keluarga',
        attendance: 'hadir',
        message: 'Selamat berbahagia Alexander & Seraphina! Semoga ikatan suci ini langgeng penuh keberkahan.'
      },
      {
        name: 'Clara Anindya',
        attendance: 'hadir',
        message: 'Happy wedding both of you! So happy to witness your magical journey. Lancar sampai hari H!'
      }
    ]
  }
}

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

    toast.success('Terima kasih atas doa restunya!')
    rsvpForm.value.message = ''
  } catch (err) {
    console.error('RSVP submit error:', err)
    guestMessages.value.unshift({
      name: rsvpForm.value.name,
      message: rsvpForm.value.message,
      attendance: rsvpForm.value.attendance,
      totalGuests: rsvpForm.value.totalGuests
    })
    toast.success('Terima kasih atas konfirmasinya!')
    rsvpForm.value.message = ''
  } finally {
    submittingRsvp.value = false
  }
}

// ====================================================================
// DATA MAPPINGS & HELPERS
// ====================================================================
const defaultQuoteText =
  'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'
const defaultQuoteSource = 'QS. Ar-Rum: 21'

const effectiveStories = computed(() => {
  if (data.value.loveStory && data.value.loveStory.length > 0) {
    return data.value.loveStory
  }
  return [
    {
      title: 'Pertemuan Pertama',
      date: 'Oktober 2021',
      description: 'Di sebuah galeri seni di sudut kota, dua pasang mata bertemu mengawali cerita panjang penuh warna.'
    },
    {
      title: 'Menjalin Komitmen',
      date: 'Februari 2023',
      description: 'Memutuskan untuk melangkah bersama melewati setiap musim kehidupan dengan satu visi dan cinta.'
    },
    {
      title: 'Lamaran Menuju Pelaminan',
      date: 'Januari 2026',
      description: 'Di hadapan keluarga besar, janji suci diucapkan untuk menyatukan dua jiwa dalam ikatan pernikahan abadi.'
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
      accountHolder: data.value.groomName || 'Alexander Pratama'
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '1370019284712',
      accountHolder: data.value.brideName || 'Seraphina Wijaya'
    }
  ]
})

const galleryItems = computed(() => {
  if (data.value.galleryImages && data.value.galleryImages.length > 0) {
    return data.value.galleryImages.map((src, i) => ({
      src,
      thumbnail: src,
      alt: `Momen Bahagia ${i + 1}`,
      caption: `Kisah Kasih ${i + 1}`
    }))
  }
  return [
    { src: '/assets/images/sample-gallery-1.jpg', thumbnail: '/assets/images/sample-gallery-1.jpg', caption: 'Keabadian Kasih' },
    { src: '/assets/images/sample-gallery-2.jpg', thumbnail: '/assets/images/sample-gallery-2.jpg', caption: 'Di Bawah Langit Senja' },
    { src: '/assets/images/sample-gallery-3.jpg', thumbnail: '/assets/images/sample-gallery-3.jpg', caption: 'Langkah Menuju Hari Bahagia' },
    { src: '/assets/images/sample-gallery-4.jpg', thumbnail: '/assets/images/sample-gallery-4.jpg', caption: 'Dua Hati Satu Frekuensi' }
  ]
})

function formatEventDate(dateStr) {
  if (!dateStr) return 'Sabtu, 24 Oktober 2026'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatDate(dateStr) {
  return formatEventDate(dateStr)
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
  if (!choice) return '/audio/wedding-romantic-aisle.mp3'
  if (choice.startsWith('yt:') || choice.startsWith('http') || choice.startsWith('/')) return choice
  return `/audio/${choice}`
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
    toast.success(`${label} berhasil disalin!`)
  })
}

function onImageError(e, type) {
  e.target.src = type === 'groom' ? '/assets/images/sample-groom.jpg' : '/assets/images/sample-bride.jpg'
}

const calendarUrl = computed(() => {
  const targetDateStr =
    data.value.resepsiLocation?.dateTime ||
    data.value.akadLocation?.dateTime ||
    data.value.dateTime ||
    '2026-10-24T09:00:00'
  const start = new Date(targetDateStr)
  if (isNaN(start.getTime())) return '#'
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
  const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
  const title = encodeURIComponent(
    `Pernikahan ${data.value.groomName || 'Alexander'} & ${data.value.brideName || 'Seraphina'}`
  )
  const details = encodeURIComponent(
    'Momen Bahagia Penyatuan Cinta Suci Alexander & Seraphina. Kehadiran Anda adalah kehormatan bagi kami.'
  )
  const location = encodeURIComponent(
    data.value.resepsiLocation?.address || data.value.resepsiLocation?.locationName || 'Jakarta'
  )
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`
})

// ====================================================================
// LIFECYCLE
// ====================================================================
onMounted(() => {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvpForm.value.name = data.value.guestName
  }

  loadGuestMessages()
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (heroObserver) heroObserver.disconnect()
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

.font-serif {
  font-family: 'Cinzel', serif;
}

.elysian-parallax-theme {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Gate Opening Transition */
.gate-open-enter-active,
.gate-open-leave-active {
  transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease;
}

.gate-open-leave-to {
  transform: scale(1.1) translateY(-100%);
  opacity: 0;
}

/* Floating Animation */
@keyframes floatGentle {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
.animate-float {
  animation: floatGentle 5s ease-in-out infinite;
}

/* Floating Stardust Sparkles */
.particle-sparkle {
  position: absolute;
  border-radius: 50%;
  background-color: #dfb974;
  box-shadow: 0 0 10px #dfb974;
  animation: sparkleDrift 8s infinite ease-in-out;
}

.particle-1 { width: 4px; height: 4px; top: 25%; left: 18%; animation-delay: 0s; }
.particle-2 { width: 5px; height: 5px; top: 40%; right: 22%; animation-delay: 2s; }
.particle-3 { width: 3px; height: 3px; top: 65%; left: 30%; animation-delay: 4s; }
.particle-4 { width: 4px; height: 4px; top: 75%; right: 28%; animation-delay: 1s; }
.particle-5 { width: 6px; height: 6px; top: 30%; left: 70%; animation-delay: 3s; }

@keyframes sparkleDrift {
  0%, 100% {
    transform: translateY(0px) scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-25px) scale(1.2);
    opacity: 0.85;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #121713;
}
::-webkit-scrollbar-thumb {
  background: #3a4b3d;
  border-radius: 8px;
}
</style>
