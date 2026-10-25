<template>
  <div class="doodle-sage-theme min-h-screen w-full bg-[#faf7f2] text-[#333d31] font-sans selection:bg-[#e87a90]/30 selection:text-[#333d31] paper-pattern relative overflow-x-hidden">

    <!-- ======================================================== -->
    <!-- WELCOME SCREEN / COVER INTERAKTIF (FULLSCREEN OVERLAY)   -->
    <!-- ======================================================== -->
    <transition name="cover-slide">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col justify-between items-center text-center px-4 py-8 bg-[#faf7f2] paper-pattern overflow-hidden"
      >
        <!-- Airmail Vintage Top Edge Strip -->
        <div class="airmail-strip w-full h-3 absolute top-0 left-0"></div>

        <!-- Floating Decorative Stickers & Doodles -->
        <div class="absolute top-8 left-6 md:left-16 pointer-events-none animate-float-slow">
          <svg class="w-8 h-8 md:w-10 md:h-10 text-[#e87a90]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        <div class="absolute top-10 right-6 md:right-16 pointer-events-none animate-wiggle">
          <span class="inline-block px-3 py-1.5 bg-[#fff2cd] border border-[#d5c38c] rounded-md font-hand text-xs text-[#745f28] shadow-xs rotate-6">
            ✨ Special Delivery
          </span>
        </div>

        <!-- Postal Stamp & Love Postmark (Top Right on Tablet/Desktop) -->
        <div class="absolute top-6 right-20 md:right-32 hidden sm:flex flex-col items-center opacity-85 rotate-[-6deg] pointer-events-none">
          <div class="w-16 h-20 bg-white border-2 border-dashed border-[#5b7a58] p-1 shadow-sm flex flex-col items-center justify-between">
            <div class="w-full h-11 bg-[#edf4eb] rounded-xs flex items-center justify-center">
              <svg class="w-6 h-6 text-[#5b7a58]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9z"/>
                <path d="M12 7v5l3 3"/>
              </svg>
            </div>
            <span class="font-hand text-[9px] font-bold text-[#5b7a58]">LOVE POST</span>
          </div>
          <span class="text-[9px] font-hand text-[#e87a90] tracking-widest uppercase mt-0.5">
            ≈ {{ weddingShortDate }} ≈
          </span>
        </div>

        <!-- Guest Greeting Pill with Doodle Pin -->
        <div class="z-10 mt-6 relative inline-block animate-fade-in">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
            <svg class="w-5 h-5 text-stone-500" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="7" r="4"/>
              <path d="M11 11h2v10h-2z"/>
            </svg>
          </div>
          <div class="px-6 py-2 rounded-full bg-[#eef4ec] border-2 border-[#5b7a58]/40 shadow-xs">
            <p class="font-hand text-xs sm:text-sm text-[#5b7a58] tracking-wide">
              Kepada Yth. Bapak/Ibu/Sahabat:
            </p>
            <p class="font-gaegu text-2xl sm:text-3xl font-bold text-[#333d31] mt-0.5">
              {{ guestName }}
            </p>
          </div>
        </div>

        <!-- Center Envelope Card & Couple Intro -->
        <div class="my-auto z-10 w-full max-w-md flex flex-col items-center px-4 animate-scale-up">
          
          <div class="inline-flex items-center gap-2 px-3.5 py-1 bg-[#fdeef2] rounded-full border border-[#e87a90]/40 text-[#c74c65] font-hand text-xs sm:text-sm mb-4">
            <span>🌸</span>
            <span>The Wedding Celebration</span>
            <span>🌸</span>
          </div>

          <h1 class="font-gaegu text-6xl sm:text-7xl md:text-8xl font-bold text-[#5b7a58] tracking-tight leading-none drop-shadow-xs">
            {{ brideNickname }}
          </h1>
          <div class="my-2 flex items-center justify-center gap-4">
            <span class="w-12 sm:w-16 h-0.5 bg-[#5b7a58]/30"></span>
            <span class="font-hand text-3xl sm:text-4xl text-[#e87a90] font-bold">&</span>
            <span class="w-12 sm:w-16 h-0.5 bg-[#5b7a58]/30"></span>
          </div>
          <h1 class="font-gaegu text-6xl sm:text-7xl md:text-8xl font-bold text-[#e87a90] tracking-tight leading-none drop-shadow-xs">
            {{ groomNickname }}
          </h1>

          <!-- Date Badge -->
          <div class="mt-6 px-5 py-2 bg-[#fff8e7] border-2 border-dashed border-[#5b7a58]/40 rounded-2xl shadow-xs flex items-center gap-2">
            <svg class="w-4 h-4 text-[#5b7a58]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="font-hand text-sm sm:text-base font-bold text-[#333d31]">
              {{ weddingDateFull }}
            </span>
          </div>
        </div>

        <!-- Wax Seal Button to Open -->
        <div class="z-20 w-full max-w-xs flex flex-col items-center gap-2.5 mb-4">
          <p class="font-hand text-xs sm:text-sm text-stone-500 animate-pulse">
            👇 Ketuk segel lilin untuk membuka undangan
          </p>

          <button
            @click="openInvitation"
            type="button"
            class="group w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#5b7a58] to-[#4b6649] text-white font-gaegu text-2xl sm:text-3xl font-bold tracking-wide shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 doodle-button cursor-pointer"
          >
            <span class="w-8 h-8 rounded-full bg-[#e87a90] border-2 border-white/80 shadow-inner flex items-center justify-center text-white font-hand text-xs font-black group-hover:rotate-12 transition-transform">
              💌
            </span>
            <span>Buka Undangan</span>
            <svg class="w-5 h-5 text-white/90 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
        </div>

        <!-- Airmail Vintage Bottom Edge Strip -->
        <div class="airmail-strip w-full h-3 absolute bottom-0 left-0"></div>
      </div>
    </transition>

    <!-- ======================================================== -->
    <!-- BACKGROUND MUSIC CONTROL                                 -->
    <!-- ======================================================== -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#5b7a58"
      accentColor="#e87a90"
      :autoPlay="!showWelcome"
    />

    <!-- ======================================================== -->
    <!-- FLOATING BOTTOM NAVIGATION DOCK (RESPONSIVE ALL DEVICES) -->
    <!-- ======================================================== -->
    <nav
      v-if="!showWelcome && navItems.length > 1"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg px-2.5 py-2 sm:px-4 sm:py-2.5 bg-white/90 backdrop-blur-md border-2 border-[#5b7a58]/30 rounded-full shadow-2xl flex items-center justify-between text-stone-600 transition-all duration-300"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="scrollToSection(item.id)"
        class="nav-bottom-item group"
      >
        <span class="text-base sm:text-lg group-hover:scale-115 transition-transform">{{ item.icon }}</span>
        <span class="text-[9px] sm:text-[10px] font-hand font-bold group-hover:text-[#5b7a58]">{{ item.label }}</span>
      </button>
    </nav>

    <!-- ======================================================== -->
    <!-- MAIN INVITATION CONTENT (RESPONSIVE FULL-WIDTH WEB VIEW) -->
    <!-- ======================================================== -->
    <main v-if="!showWelcome" id="main-content" class="relative z-10 w-full animate-enter-up">

      <!-- ======================================================== -->
      <!-- SECTION 1: HERO / BANNER                                 -->
      <!-- ======================================================== -->
      <section id="hero" class="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 py-20 relative overflow-hidden bg-gradient-to-b from-[#eef4ec]/70 via-[#faf7f2] to-[#faf7f2]">
        
        <div class="airmail-strip w-full h-3 absolute top-0 left-0"></div>

        <div class="max-w-4xl mx-auto flex flex-col items-center z-10 pt-8">
          
          <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fdeef2] rounded-full border border-[#e87a90]/40 text-[#c74c65] font-hand text-xs sm:text-sm mb-4">
            <span class="animate-bounce">🌸</span>
            <span>The Wedding Celebration</span>
            <span class="animate-bounce">🌸</span>
          </div>

          <h1 class="font-gaegu text-6xl sm:text-7xl md:text-9xl font-bold text-[#5b7a58] tracking-tight leading-none drop-shadow-xs">
            {{ brideNickname }}
          </h1>

          <div class="my-2 flex items-center justify-center gap-4">
            <span class="w-16 sm:w-28 h-0.5 bg-[#5b7a58]/30"></span>
            <span class="font-hand text-3xl sm:text-5xl text-[#e87a90] font-bold">&</span>
            <span class="w-16 sm:w-28 h-0.5 bg-[#5b7a58]/30"></span>
          </div>

          <h1 class="font-gaegu text-6xl sm:text-7xl md:text-9xl font-bold text-[#e87a90] tracking-tight leading-none drop-shadow-xs">
            {{ groomNickname }}
          </h1>

          <!-- Featured Couple Polaroid -->
          <div v-if="couplePhoto" class="mt-8 relative max-w-sm sm:max-w-md w-full bg-white p-3.5 pb-5 rounded-2xl shadow-lg border-2 border-[#5b7a58]/30 rotate-[-1deg] hover:rotate-0 transition-transform duration-300 doodle-box">
            <div class="washi-tape washi-yellow -top-3.5 left-1/2 -translate-x-1/2"></div>
            <div class="w-full aspect-[16/10] bg-[#edf4eb] rounded-xl overflow-hidden mb-3 border border-[#5b7a58]/20">
              <img
                :src="couplePhoto"
                alt="Couple photo"
                class="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <p class="font-hand text-sm sm:text-base text-stone-600 italic">
              "Two souls, one heart, walking together forever." ✨
            </p>
          </div>

          <!-- Wedding Date & Venue Quick Info -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div class="px-5 py-2.5 bg-white border-2 border-[#5b7a58]/30 rounded-2xl shadow-xs font-hand text-sm sm:text-base text-stone-700 font-bold flex items-center gap-2">
              <span>📅</span>
              <span>{{ weddingDateFull }}</span>
            </div>
            <div v-if="venueCity" class="px-5 py-2.5 bg-white border-2 border-[#5b7a58]/30 rounded-2xl shadow-xs font-hand text-sm sm:text-base text-stone-700 font-bold flex items-center gap-2">
              <span>📍</span>
              <span>{{ venueCity }}</span>
            </div>
          </div>

        </div>
      </section>

      <!-- ======================================================== -->
      <!-- SECTION 2: QUOTE / AR-RUM 21                             -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('quote')" id="quote" class="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <!-- Spiral Ring Binder Dots -->
        <div class="w-full flex justify-around items-center px-8 mb-[-12px] z-10">
          <span v-for="n in 12" :key="n" class="w-3.5 h-3.5 rounded-full bg-[#5b7a58]/30 border-2 border-[#5b7a58]/60 shadow-inner"></span>
        </div>

        <div class="w-full bg-[#fffefb] border-2 border-[#5b7a58]/30 rounded-3xl p-6 sm:p-10 shadow-md relative doodle-box overflow-hidden">
          <div class="washi-tape washi-yellow -top-3.5 left-1/2 -translate-x-1/2"></div>

          <div class="text-center mb-6">
            <span class="font-hand text-2xl sm:text-3xl text-[#5b7a58] tracking-widest font-bold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
          </div>

          <p class="font-hand text-base sm:text-xl text-[#445042] text-center leading-relaxed italic max-w-2xl mx-auto">
            "{{ quoteText }}"
          </p>

          <div class="mt-6 pt-4 border-t border-dashed border-[#5b7a58]/30 text-center">
            <span class="inline-block px-4 py-1.5 bg-[#eef4ec] rounded-full font-gaegu text-xl sm:text-2xl font-bold text-[#5b7a58]">
              {{ quoteSource }}
            </span>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- SECTION 3: THE BRIDE & GROOM                             -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-5 py-1.5 bg-[#eef4ec] border-2 border-[#5b7a58]/40 rounded-full shadow-xs">
            <span class="text-[#e87a90]">🌸</span>
            <span class="font-gaegu text-2xl font-bold text-[#5b7a58]">The Happy Couple</span>
            <span class="text-[#e87a90]">🌸</span>
          </div>
          <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#333d31] mt-3">
            Mempelai yang Berbahagia
          </h2>
          <p class="font-hand text-sm sm:text-base text-stone-500 max-w-md mx-auto mt-1">
            Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Sahabat sekalian untuk merayakan hari bahagia pernikahan kami:
          </p>
        </div>

        <!-- Responsive Grid: 1 Col on Mobile, 2 Cols on Desktop -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center justify-items-center">
          
          <!-- BRIDE POLAROID -->
          <div class="w-full max-w-[340px] bg-white p-5 pb-6 rounded-3xl shadow-lg border-2 border-[#5b7a58]/30 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 relative group doodle-box">
            <div class="washi-tape washi-pink -top-3.5 left-8"></div>

            <div class="w-full aspect-[4/4.8] bg-[#edf4eb] rounded-2xl overflow-hidden relative border border-[#5b7a58]/20 shadow-inner mb-4">
              <img
                :src="bridePhoto"
                :alt="brideName"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute bottom-2.5 right-2.5 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-full border border-[#e87a90]/40 font-hand text-xs text-[#e87a90] font-bold shadow-xs">
                👰 The Bride
              </div>
            </div>

            <div class="text-center">
              <h3 class="font-gaegu text-3xl sm:text-4xl font-bold text-[#e87a90] leading-none mb-1">
                {{ brideName }}
              </h3>
              <p class="font-hand text-sm text-[#5b7a58] font-bold tracking-wide mb-2">
                ({{ brideNickname }})
              </p>
              <p class="font-hand text-xs sm:text-sm text-stone-600 leading-snug px-2">
                {{ brideParents }}
              </p>

              <div v-if="brideInstagram" class="mt-4">
                <a
                  :href="`https://instagram.com/${brideInstagram.replace('@', '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fdeef2] border border-[#e87a90]/30 text-[#c74c65] font-hand text-xs sm:text-sm hover:bg-[#e87a90] hover:text-white transition-colors"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>@{{ brideInstagram.replace('@', '') }}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- GROOM POLAROID -->
          <div class="w-full max-w-[340px] bg-white p-5 pb-6 rounded-3xl shadow-lg border-2 border-[#5b7a58]/30 rotate-[2deg] hover:rotate-0 transition-transform duration-300 relative group doodle-box">
            <div class="washi-tape washi-mint -top-3.5 right-8"></div>

            <div class="w-full aspect-[4/4.8] bg-[#edf4eb] rounded-2xl overflow-hidden relative border border-[#5b7a58]/20 shadow-inner mb-4">
              <img
                :src="groomPhoto"
                :alt="groomName"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute bottom-2.5 right-2.5 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-full border border-[#5b7a58]/40 font-hand text-xs text-[#5b7a58] font-bold shadow-xs">
                🤵 The Groom
              </div>
            </div>

            <div class="text-center">
              <h3 class="font-gaegu text-3xl sm:text-4xl font-bold text-[#5b7a58] leading-none mb-1">
                {{ groomName }}
              </h3>
              <p class="font-hand text-sm text-[#e87a90] font-bold tracking-wide mb-2">
                ({{ groomNickname }})
              </p>
              <p class="font-hand text-xs sm:text-sm text-stone-600 leading-snug px-2">
                {{ groomParents }}
              </p>

              <div v-if="groomInstagram" class="mt-4">
                <a
                  :href="`https://instagram.com/${groomInstagram.replace('@', '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#eef4ec] border border-[#5b7a58]/30 text-[#5b7a58] font-hand text-xs sm:text-sm hover:bg-[#5b7a58] hover:text-white transition-colors"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>@{{ groomInstagram.replace('@', '') }}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- Extended Family / Turut Mengundang -->
        <div
          v-if="isSectionEnabled('extended-family') && (extendedFamilyList.length || turutMengundangText)"
          class="mt-12 max-w-3xl mx-auto p-6 bg-white border-2 border-dashed border-[#5b7a58]/30 rounded-3xl doodle-box text-center"
        >
          <span class="font-gaegu text-2xl sm:text-3xl font-bold text-[#5b7a58] block mb-2">
            Turut Mengundang
          </span>
          <p class="font-hand text-sm sm:text-base text-stone-600 leading-relaxed whitespace-pre-line">
            {{ turutMengundangText || extendedFamilyList.join(', ') }}
          </p>
        </div>

      </section>

      <!-- ======================================================== -->
      <!-- SECTION 4: SAVE THE DATE & CALENDAR                      -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('event')" id="calendar" class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <div class="w-full bg-white border-2 border-[#5b7a58]/30 rounded-3xl p-6 sm:p-10 shadow-md relative doodle-box">
          <div class="washi-tape washi-yellow -top-3.5 left-1/2 -translate-x-1/2"></div>

          <div class="text-center mb-8">
            <span class="inline-block px-4 py-1.5 bg-[#fff8e7] border border-[#e5d5a6] rounded-md font-hand text-xs sm:text-sm text-[#7d6728] mb-1 font-bold">
              🗓️ Mark Your Calendar
            </span>
            <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#5b7a58]">
              {{ calendarMonthYear }}
            </h2>
          </div>

          <!-- Dynamic Desk Pad Grid -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <!-- Calendar Grid -->
            <div class="md:col-span-7 w-full max-w-md mx-auto">
              <div class="grid grid-cols-7 text-center font-gaegu text-xl font-bold text-stone-500 mb-2 border-b border-dashed border-stone-200 pb-1">
                <span class="text-[#e87a90]">M</span>
                <span>S</span>
                <span>S</span>
                <span>R</span>
                <span>K</span>
                <span>J</span>
                <span>S</span>
              </div>

              <div class="grid grid-cols-7 gap-1.5 text-center font-hand text-sm sm:text-base text-stone-700">
                <!-- Leading blank slots -->
                <div v-for="blank in calendarData.firstDayIndex" :key="`blank-${blank}`" class="aspect-square"></div>

                <!-- Month days -->
                <div v-for="day in calendarData.totalDays" :key="day" class="aspect-square flex items-center justify-center relative">
                  <!-- Highlighted Target Wedding Day -->
                  <div
                    v-if="day === weddingDay"
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e87a90] text-white font-bold flex flex-col items-center justify-center shadow-md animate-pulse relative z-10 border-2 border-white"
                  >
                    <span class="text-xs sm:text-sm leading-none font-bold">{{ day }}</span>
                    <span class="text-[9px] leading-none">❤️</span>
                  </div>
                  <span v-else :class="{'text-[#e87a90] font-bold': (day + calendarData.firstDayIndex) % 7 === 1}">
                    {{ day }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Countdown Timer & Actions -->
            <div class="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-[#5b7a58]/30 pt-6 md:pt-0 md:pl-8">
              <p class="font-hand text-xs sm:text-sm text-stone-500 mb-3 font-bold uppercase tracking-wider">
                ⏳ Menuju Hari Bahagia
              </p>

              <div class="grid grid-cols-4 gap-2 w-full max-w-xs text-center mb-6">
                <div class="bg-[#edf4eb] border border-[#5b7a58]/30 rounded-xl p-2.5 shadow-xs">
                  <span class="font-gaegu text-3xl sm:text-4xl font-bold text-[#5b7a58] block leading-none">
                    {{ countdown.days }}
                  </span>
                  <span class="font-hand text-xs text-stone-600 font-bold">Hari</span>
                </div>
                <div class="bg-[#edf4eb] border border-[#5b7a58]/30 rounded-xl p-2.5 shadow-xs">
                  <span class="font-gaegu text-3xl sm:text-4xl font-bold text-[#5b7a58] block leading-none">
                    {{ countdown.hours }}
                  </span>
                  <span class="font-hand text-xs text-stone-600 font-bold">Jam</span>
                </div>
                <div class="bg-[#edf4eb] border border-[#5b7a58]/30 rounded-xl p-2.5 shadow-xs">
                  <span class="font-gaegu text-3xl sm:text-4xl font-bold text-[#5b7a58] block leading-none">
                    {{ countdown.minutes }}
                  </span>
                  <span class="font-hand text-xs text-stone-600 font-bold">Menit</span>
                </div>
                <div class="bg-[#edf4eb] border border-[#5b7a58]/30 rounded-xl p-2.5 shadow-xs">
                  <span class="font-gaegu text-3xl sm:text-4xl font-bold text-[#e87a90] block leading-none">
                    {{ countdown.seconds }}
                  </span>
                  <span class="font-hand text-xs text-stone-600 font-bold">Detik</span>
                </div>
              </div>

              <!-- Google Calendar Action -->
              <a
                :href="calendarUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full max-w-xs py-3 px-5 rounded-full bg-[#fff2cd] border-2 border-[#d5c38c] text-[#745f28] font-hand text-xs sm:text-sm font-bold hover:bg-[#ffe8a3] transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18"/>
                </svg>
                <span>Simpan di Google Calendar</span>
              </a>

            </div>

          </div>
        </div>

      </section>

      <!-- ======================================================== -->
      <!-- SECTION 5: RANGKAIAN ACARA (EVENT TICKETS)               -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('event')" id="events" class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-5 py-1.5 bg-[#fdeef2] border-2 border-[#e87a90]/40 rounded-full shadow-xs">
            <span class="text-[#e87a90]">💌</span>
            <span class="font-gaegu text-2xl font-bold text-[#c74c65]">Waktu & Lokasi</span>
          </div>
          <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#333d31] mt-3">
            Rangkaian Acara Bahagia
          </h2>
        </div>

        <!-- 2 Columns on Desktop -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          <!-- TICKET 1: AKAD NIKAH -->
          <div class="w-full bg-white border-2 border-[#5b7a58]/40 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden doodle-box flex flex-col justify-between">
            <div class="washi-tape washi-mint -top-3.5 left-8"></div>

            <div>
              <div class="flex items-center justify-between border-b border-dashed border-[#5b7a58]/30 pb-4 mb-4">
                <div class="flex items-center gap-3">
                  <span class="text-3xl">💍</span>
                  <div>
                    <span class="font-gaegu text-3xl font-bold text-[#5b7a58] block leading-none">Akad Nikah</span>
                    <span class="font-hand text-xs text-stone-500">Khusus Keluarga & Kerabat Dekat</span>
                  </div>
                </div>
                <span class="px-3 py-1 bg-[#edf4eb] text-[#5b7a58] font-hand text-xs font-bold rounded-lg border border-[#5b7a58]/30">
                  {{ akadTimeFormatted }}
                </span>
              </div>

              <div class="space-y-3 font-hand text-sm text-stone-700">
                <div class="flex items-start gap-2.5">
                  <span class="text-[#5b7a58] font-bold">📅 Hari/Tgl:</span>
                  <span>{{ weddingDateFull }}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="text-[#5b7a58] font-bold">📍 Lokasi:</span>
                  <span>{{ akadLocationDesc }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-dashed border-stone-200">
              <a
                :href="akadMapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3 px-5 rounded-2xl bg-[#5b7a58] text-white font-gaegu text-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#4b6649] transition-colors shadow-xs"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Buka Google Maps</span>
              </a>
            </div>
          </div>

          <!-- TICKET 2: RESEPSI PERNIKAHAN -->
          <div class="w-full bg-white border-2 border-[#e87a90]/40 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden doodle-box flex flex-col justify-between">
            <div class="washi-tape washi-pink -top-3.5 right-8"></div>

            <div>
              <div class="flex items-center justify-between border-b border-dashed border-[#e87a90]/30 pb-4 mb-4">
                <div class="flex items-center gap-3">
                  <span class="text-3xl">🎉</span>
                  <div>
                    <span class="font-gaegu text-3xl font-bold text-[#e87a90] block leading-none">Resepsi</span>
                    <span class="font-hand text-xs text-stone-500">Pesta Perayaan Bersama Sahabat</span>
                  </div>
                </div>
                <span class="px-3 py-1 bg-[#fdeef2] text-[#e87a90] font-hand text-xs font-bold rounded-lg border border-[#e87a90]/30">
                  {{ resepsiTimeFormatted }}
                </span>
              </div>

              <div class="space-y-3 font-hand text-sm text-stone-700">
                <div class="flex items-start gap-2.5">
                  <span class="text-[#e87a90] font-bold">📅 Hari/Tgl:</span>
                  <span>{{ weddingDateFull }}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="text-[#e87a90] font-bold">📍 Lokasi:</span>
                  <span>{{ resepsiLocationDesc }}</span>
                </div>
                <div v-if="dressCodeText" class="flex items-start gap-2.5">
                  <span class="text-[#e87a90] font-bold">👗 Dresscode:</span>
                  <span>{{ dressCodeText }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-dashed border-stone-200">
              <a
                :href="resepsiMapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3 px-5 rounded-2xl bg-[#e87a90] text-white font-gaegu text-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#d8667c] transition-colors shadow-xs"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Petunjuk Arah Venue</span>
              </a>
            </div>
          </div>

        </div>

        <!-- Live Streaming Link Button -->
        <div v-if="isSectionEnabled('live-streaming') && liveStreamingUrl" class="mt-8 text-center">
          <a
            :href="liveStreamingUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-[#5b7a58]/40 text-[#5b7a58] font-gaegu text-xl font-bold hover:bg-[#edf4eb] transition-colors shadow-sm"
          >
            <span>📺</span>
            <span>Saksikan Siaran Live Streaming</span>
          </a>
        </div>

      </section>

      <!-- ======================================================== -->
      <!-- SECTION 5B: VIDEO PREWEDDING (OPTIONAL FROM STUDIO)      -->
      <!-- ======================================================== -->
      <section v-if="videoEmbedUrl && isSectionEnabled('video')" id="video" class="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-5 py-1.5 bg-[#fdeef2] border-2 border-[#e87a90]/40 rounded-full shadow-xs">
            <span>🎬</span>
            <span class="font-gaegu text-2xl font-bold text-[#c74c65]">Video Prewedding</span>
          </div>
          <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#333d31] mt-3">
            Cinematic Love Story
          </h2>
        </div>

        <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-[#5b7a58]/30 doodle-box bg-stone-900">
          <iframe
            :src="videoEmbedUrl"
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- SECTION 6: OUR LOVE STORY (ROADMAP)                     -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('story') && loveStories.length" id="story" class="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-5 py-1.5 bg-[#fff8e7] border-2 border-[#d5c38c] rounded-full shadow-xs">
            <span>✨</span>
            <span class="font-gaegu text-2xl font-bold text-[#745f28]">Kisah Perjalanan</span>
          </div>
          <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#333d31] mt-3">
            Our Love Story
          </h2>
        </div>

        <div class="relative pl-6 sm:pl-10 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#5b7a58]/50 space-y-8">
          
          <div
            v-for="(milestone, idx) in loveStories"
            :key="idx"
            class="relative bg-white border-2 border-[#5b7a58]/30 rounded-3xl p-5 sm:p-6 shadow-sm doodle-box hover:shadow-md transition-all"
          >
            <!-- Timeline Pin Node -->
            <div class="absolute -left-[35px] sm:-left-[43px] top-6 w-8 h-8 rounded-full bg-[#fdeef2] border-2 border-[#e87a90] flex items-center justify-center text-xs text-[#e87a90] font-bold shadow-xs">
              ❤️
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="font-gaegu text-2xl sm:text-3xl font-bold text-[#5b7a58]">
                {{ milestone.title }}
              </span>
              <span v-if="milestone.year || milestone.date" class="font-hand text-xs sm:text-sm font-bold px-3 py-1 bg-[#edf4eb] text-[#5b7a58] rounded-xl border border-[#5b7a58]/20">
                {{ milestone.year || milestone.date }}
              </span>
            </div>

            <p class="font-hand text-sm sm:text-base text-stone-600 leading-relaxed">
              {{ milestone.description }}
            </p>
          </div>

        </div>

      </section>

      <!-- ======================================================== -->
      <!-- SECTION 7: MOMEN BAHAGIA (SCRAPBOOK GALLERY)             -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-5 py-1.5 bg-[#eef4ec] border-2 border-[#5b7a58]/40 rounded-full shadow-xs">
            <span>📷</span>
            <span class="font-gaegu text-2xl font-bold text-[#5b7a58]">Galeri Kenangan</span>
          </div>
          <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#333d31] mt-3">
            Momen Bahagia Kami
          </h2>
          <p class="font-hand text-sm sm:text-base text-stone-500 max-w-md mx-auto mt-1">
            Potret bahagia kebersamaan kami yang kami rekam dalam cerita cinta:
          </p>
        </div>

        <!-- 4 Columns on Desktop, 2 on Mobile -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
          <div
            v-for="(img, idx) in galleryImages"
            :key="idx"
            @click="selectedPhoto = img"
            class="bg-white p-3 pb-4 rounded-3xl shadow-sm border-2 border-[#5b7a58]/30 cursor-pointer group hover:scale-103 transition-all doodle-box relative"
            :class="idx % 2 === 0 ? 'rotate-[-1.5deg]' : 'rotate-[1.5deg]'"
          >
            <div class="washi-tape washi-yellow -top-3 left-1/2 -translate-x-1/2"></div>
            
            <div class="w-full aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden mb-3 relative">
              <img
                :src="img"
                alt="Gallery photo"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <p class="font-hand text-xs sm:text-sm text-center text-stone-600 italic">
              {{ galleryCaptions[idx] || 'Moment of Love ✨' }}
            </p>
          </div>
        </div>

        <!-- Lightbox Modal -->
        <div
          v-if="selectedPhoto"
          @click="selectedPhoto = null"
          class="fixed inset-0 bg-stone-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div class="relative max-w-lg w-full bg-white p-4 pb-8 rounded-3xl shadow-2xl border-4 border-[#5b7a58] animate-scale-up">
            <button
              @click.stop="selectedPhoto = null"
              class="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full bg-[#e87a90] text-white font-bold flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
            <img :src="selectedPhoto" alt="Zoomed photo" class="w-full rounded-2xl object-contain max-h-[75vh]"/>
            <p class="font-hand text-center text-stone-600 mt-4 text-base">
              💕 Eternal Memories
            </p>
          </div>
        </div>

      </section>

      <!-- ======================================================== -->
      <!-- SECTION 8: AMPLOP DIGITAL & KADO                         -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('gift') && (bankAccounts.length || giftAddress)" id="gift" class="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-5 py-1.5 bg-[#fdeef2] border-2 border-[#e87a90]/40 rounded-full shadow-xs">
            <span>🎁</span>
            <span class="font-gaegu text-2xl font-bold text-[#c74c65]">Tanda Kasih</span>
          </div>
          <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#333d31] mt-3">
            Wedding Gift & Amplop Digital
          </h2>
          <p class="font-hand text-sm sm:text-base text-stone-500 max-w-md mx-auto mt-1">
            Doa restu Anda adalah anugerah terindah bagi kami. Bagi yang ingin mengirimkan kado tanda kasih:
          </p>
        </div>

        <!-- Desktop 2 Cols for Bank Accounts -->
        <div v-if="bankAccounts.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            v-for="(acc, idx) in bankAccounts"
            :key="idx"
            class="bg-gradient-to-br from-[#edf4eb] to-[#e4ede1] border-2 border-[#5b7a58]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden doodle-box"
          >
            <div class="washi-tape washi-mint -top-3.5 left-8"></div>

            <div class="flex items-center justify-between mb-4">
              <span class="px-3.5 py-1.5 bg-white rounded-xl font-gaegu text-2xl font-bold text-[#5b7a58] border border-[#5b7a58]/30 shadow-2xs">
                {{ acc.bankName }}
              </span>
              <span class="font-hand text-xs sm:text-sm text-[#5b7a58] font-bold">Transfer Digital</span>
            </div>

            <div class="bg-white/85 backdrop-blur-xs rounded-2xl p-4 border border-[#5b7a58]/20 flex items-center justify-between">
              <div>
                <p class="font-mono text-lg sm:text-xl font-bold text-[#333d31] tracking-wider">
                  {{ acc.accountNumber }}
                </p>
                <p class="font-hand text-xs sm:text-sm text-stone-600">
                  a.n. {{ acc.accountName }}
                </p>
              </div>

              <button
                @click="copyText(acc.accountNumber, `No. Rekening ${acc.bankName}`)"
                class="px-4 py-2 bg-[#5b7a58] hover:bg-[#4b6649] text-white font-hand text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span>Salin</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Physical Gift Address -->
        <div v-if="giftAddress" class="max-w-3xl mx-auto bg-white border-2 border-dashed border-[#5b7a58]/40 rounded-3xl p-6 sm:p-8 shadow-sm relative doodle-box">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">📦</span>
            <span class="font-gaegu text-2xl sm:text-3xl font-bold text-[#5b7a58]">Kirim Kado Fisik</span>
          </div>
          <p class="font-hand text-sm sm:text-base text-stone-600 leading-relaxed mb-4">
            <span v-if="giftAddress.recipient" class="font-bold">{{ giftAddress.recipient }}</span>
            <span v-if="giftAddress.phone"> ({{ giftAddress.phone }})</span><br/>
            {{ giftAddress.address || giftAddress }}
          </p>

          <button
            @click="copyText(giftAddress.address || giftAddress, 'Alamat Kirim Kado')"
            class="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#fff8e7] border-2 border-[#d5c38c] text-[#745f28] font-hand text-sm font-bold hover:bg-[#ffe8a3] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>Salin Alamat Lengkap</span>
          </button>
        </div>

      </section>

      <!-- ======================================================== -->
      <!-- SECTION 9: RSVP & BULLETIN BOARD GUESTBOOK               -->
      <!-- ======================================================== -->
      <section v-if="isSectionEnabled('rsvp') || isSectionEnabled('wishes')" id="rsvp" class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-5 py-1.5 bg-[#eef4ec] border-2 border-[#5b7a58]/40 rounded-full shadow-xs">
            <span>💌</span>
            <span class="font-gaegu text-2xl font-bold text-[#5b7a58]">Konfirmasi & Doa Restu</span>
          </div>
          <h2 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#333d31] mt-3">
            Buku Tamu & RSVP
          </h2>
        </div>

        <!-- 2 Columns on Desktop: Form (Left) & Sticky Wall (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- RSVP FORM CARD -->
          <div v-if="isSectionEnabled('rsvp')" class="lg:col-span-5 w-full bg-white border-2 border-[#5b7a58]/30 rounded-3xl p-6 sm:p-8 shadow-md relative doodle-box">
            <div class="washi-tape washi-yellow -top-3.5 left-1/2 -translate-x-1/2"></div>

            <form @submit.prevent="submitRsvp" class="space-y-4">
              <div>
                <label class="font-hand text-sm font-bold text-[#5b7a58] block mb-1">
                  Nama Lengkap
                </label>
                <input
                  v-model="rsvpForm.name"
                  type="text"
                  required
                  placeholder="Masukkan nama Anda..."
                  class="w-full px-4 py-3 rounded-2xl border border-stone-300 font-hand text-sm focus:border-[#5b7a58] focus:ring-1 focus:ring-[#5b7a58] outline-hidden bg-[#faf8f3]"
                />
              </div>

              <div>
                <label class="font-hand text-sm font-bold text-[#5b7a58] block mb-1">
                  Konfirmasi Kehadiran
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    @click="rsvpForm.status = 'hadir'"
                    :class="rsvpForm.status === 'hadir' ? 'bg-[#5b7a58] text-white border-[#5b7a58]' : 'bg-[#faf8f3] text-stone-600 border-stone-200'"
                    class="py-2.5 px-2 rounded-xl border font-hand text-xs sm:text-sm font-bold text-center transition-all cursor-pointer"
                  >
                    🌸 Hadir
                  </button>
                  <button
                    type="button"
                    @click="rsvpForm.status = 'ragu'"
                    :class="rsvpForm.status === 'ragu' ? 'bg-[#d5c38c] text-white border-[#d5c38c]' : 'bg-[#faf8f3] text-stone-600 border-stone-200'"
                    class="py-2.5 px-2 rounded-xl border font-hand text-xs sm:text-sm font-bold text-center transition-all cursor-pointer"
                  >
                    🌼 Ragu
                  </button>
                  <button
                    type="button"
                    @click="rsvpForm.status = 'tidak'"
                    :class="rsvpForm.status === 'tidak' ? 'bg-[#e87a90] text-white border-[#e87a90]' : 'bg-[#faf8f3] text-stone-600 border-stone-200'"
                    class="py-2.5 px-2 rounded-xl border font-hand text-xs sm:text-sm font-bold text-center transition-all cursor-pointer"
                  >
                    🍃 Maaf
                  </button>
                </div>
              </div>

              <div v-if="rsvpForm.status === 'hadir'">
                <label class="font-hand text-sm font-bold text-[#5b7a58] block mb-1">
                  Jumlah Tamu Hadir
                </label>
                <select
                  v-model="rsvpForm.pax"
                  class="w-full px-4 py-3 rounded-2xl border border-stone-300 font-hand text-sm focus:border-[#5b7a58] outline-hidden bg-[#faf8f3]"
                >
                  <option value="1">1 Orang</option>
                  <option value="2">2 Orang</option>
                  <option value="3">3 Orang</option>
                  <option value="4">4 Orang</option>
                </select>
              </div>

              <div>
                <label class="font-hand text-sm font-bold text-[#5b7a58] block mb-1">
                  Untaian Doa & Ucapan Hangat
                </label>
                <textarea
                  v-model="rsvpForm.message"
                  required
                  rows="3"
                  placeholder="Tuliskan ucapan dan doa hangatmu untuk kedua mempelai..."
                  class="w-full px-4 py-3 rounded-2xl border border-stone-300 font-hand text-sm focus:border-[#5b7a58] focus:ring-1 focus:ring-[#5b7a58] outline-hidden bg-[#faf8f3]"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full py-3.5 rounded-2xl bg-[#5b7a58] hover:bg-[#4b6649] text-white font-gaegu text-2xl font-bold tracking-wide transition-colors shadow-md active:scale-95 cursor-pointer"
              >
                💌 Kirim Ucapan & RSVP
              </button>
            </form>
          </div>

          <!-- STICKY NOTES BULLETIN BOARD -->
          <div
            v-if="isSectionEnabled('wishes')"
            :class="isSectionEnabled('rsvp') ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl mx-auto'"
            class="w-full space-y-4"
          >
            <p class="font-hand text-sm font-bold text-stone-500 uppercase tracking-wider text-center lg:text-left">
              📌 Bulletin Board Doa Restu ({{ guestbook.length }})
            </p>

            <!-- Responsive 2 Columns of Sticky Notes on Tablet/Desktop -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div
                v-for="(wish, idx) in guestbook"
                :key="idx"
                :class="[
                  idx % 3 === 0 ? 'bg-[#fff9db] rotate-[-1deg]' : idx % 3 === 1 ? 'bg-[#eef4ec] rotate-[1deg]' : 'bg-[#fdeef2] rotate-[-0.5deg]'
                ]"
                class="p-5 rounded-2xl border border-stone-300/60 shadow-sm relative doodle-box"
              >
                <!-- Thumbtack on Top -->
                <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-base">
                  📌
                </div>

                <div class="flex items-center justify-between mb-2 mt-1">
                  <span class="font-gaegu text-2xl font-bold text-[#333d31]">
                    {{ wish.name }}
                  </span>
                  <span
                    class="font-hand text-xs font-bold px-2.5 py-0.5 rounded-full"
                    :class="wish.status === 'Hadir' ? 'bg-[#5b7a58]/20 text-[#5b7a58]' : 'bg-[#e87a90]/20 text-[#e87a90]'"
                  >
                    {{ wish.status }}
                  </span>
                </div>

                <p class="font-hand text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{{ wish.message }}"
                </p>
                
                <div class="mt-3 text-right">
                  <span class="font-hand text-xs text-stone-400">{{ wish.time }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      <!-- ======================================================== -->
      <!-- SECTION 10: CLOSING & FOOTER                             -->
      <!-- ======================================================== -->
      <footer class="w-full py-16 text-center relative flex flex-col items-center border-t-2 border-dashed border-[#5b7a58]/30 bg-gradient-to-b from-[#faf7f2] to-[#eef4ec]/60 px-4">
        <div class="text-4xl mb-3">🌿</div>

        <h3 class="font-gaegu text-4xl sm:text-5xl font-bold text-[#5b7a58]">
          Sampai Jumpa di Hari Bahagia!
        </h3>
        <p class="font-hand text-sm sm:text-base text-stone-500 max-w-md mx-auto mt-2 leading-relaxed">
          {{ footerCustomText || 'Kehadiran serta doa restu Bapak/Ibu/Sahabat sekalian merupakan kehormatan dan kebahagiaan terbesar bagi kami.' }}
        </p>

        <div class="mt-8">
          <p class="font-hand text-sm text-[#e87a90] font-bold">With Warm Love,</p>
          <p class="font-gaegu text-5xl sm:text-6xl font-bold text-[#333d31] mt-1">
            {{ brideNickname }} & {{ groomNickname }}
          </p>
        </div>

        <div class="mt-12 pt-6 border-t border-stone-200/60 w-full max-w-md text-center">
          <p class="font-hand text-xs text-stone-400">
            Created with ❤️ by <a href="/" class="underline hover:text-[#5b7a58]">satuundangan.id</a>
          </p>
        </div>
      </footer>

    </main>

    <!-- Copy Toast Notification -->
    <transition name="toast-pop">
      <div
        v-if="toastMessage"
        class="fixed top-8 left-1/2 -translate-x-1/2 z-[70] px-6 py-2.5 rounded-full bg-[#333d31] text-white font-hand text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/20"
      >
        <span>✨</span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

// Section Toggle Checker for Studio Editor
function isSectionEnabled(key) {
  if (!props.data?.selectedSections || !Array.isArray(props.data.selectedSections)) {
    return true
  }
  const list = props.data.selectedSections
  if (key === 'story' || key === 'love-story') return list.includes('love-story') || list.includes('story')
  if (key === 'couple' || key === 'mempelai') return list.includes('couple') || list.includes('mempelai')
  if (key === 'event' || key === 'acara') return list.includes('event') || list.includes('acara') || list.includes('map')
  if (key === 'gift') return list.includes('gift') || list.includes('digital-envelope')
  if (key === 'wishes' || key === 'guestbook') return list.includes('wishes') || list.includes('guestbook')
  if (key === 'video') return list.includes('video') || list.includes('video-prewedding')
  if (key === 'extended-family') return list.includes('extended-family') || list.includes('turut-mengundang')
  if (key === 'live-streaming') return list.includes('live-streaming') || list.includes('live-stream')
  return list.includes(key)
}

// Core Fields & Fallbacks
const guestName = computed(() => props.data?.guestName || 'Tamu Undangan')

const brideName = computed(() => props.data?.brideName || 'Dewi Anggraeni')
const brideNickname = computed(() => {
  if (props.data?.brideNickname) return props.data.brideNickname
  if (props.data?.brideName) return props.data.brideName.trim().split(' ')[0]
  return 'Dewi'
})

const groomName = computed(() => props.data?.groomName || 'Riyandi Alfriansyah')
const groomNickname = computed(() => {
  if (props.data?.groomNickname) return props.data.groomNickname
  if (props.data?.groomName) return props.data.groomName.trim().split(' ')[0]
  return 'Riyandi'
})

const brideParents = computed(() => {
  return props.data?.parents?.brideParents || 'Putri Pertama dari Bpk. Dudi dan Ibu Meylani'
})
const groomParents = computed(() => {
  return props.data?.parents?.groomParents || 'Putra Ke-6 dari Bpk. Eko dan Ibu Linda'
})

const brideInstagram = computed(() => {
  return props.data?.socialMediaBrides?.instagram || props.data?.brideNickname?.toLowerCase() || 'dewi'
})
const groomInstagram = computed(() => {
  return props.data?.socialMediaGroom?.instagram || props.data?.groomNickname?.toLowerCase() || 'riyandi'
})

const quoteText = computed(() => {
  return props.data?.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya dan Dia menjadikan antaramu rasa kasih dan sayang.'
})
const quoteSource = computed(() => props.data?.quoteSource || 'Q.S. Ar-Rum Ayat 21')

const couplePhoto = computed(() => {
  return props.data?.photoCoupleUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
})
const bridePhoto = computed(() => {
  return props.data?.bridePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
})
const groomPhoto = computed(() => {
  return props.data?.groomPhotoUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'
})

// Dynamic Date Parsing from Studio Form
const weddingDateObj = computed(() => {
  const raw = props.data?.dateTime || props.data?.akadLocation?.dateTime || props.data?.resepsiLocation?.dateTime
  if (!raw) return new Date('2026-11-29T08:00:00+07:00')
  const d = new Date(raw)
  return isNaN(d.getTime()) ? new Date('2026-11-29T08:00:00+07:00') : d
})

const weddingDateFull = computed(() => {
  return weddingDateObj.value.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const weddingShortDate = computed(() => {
  const d = weddingDateObj.value
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
})

const calendarMonthYear = computed(() => {
  return weddingDateObj.value.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })
})

const weddingDay = computed(() => weddingDateObj.value.getDate())
const weddingMonth = computed(() => weddingDateObj.value.getMonth())
const weddingYear = computed(() => weddingDateObj.value.getFullYear())

const calendarData = computed(() => {
  const totalDays = new Date(weddingYear.value, weddingMonth.value + 1, 0).getDate()
  const firstDayIndex = new Date(weddingYear.value, weddingMonth.value, 1).getDay() // 0 = Sunday
  return { totalDays, firstDayIndex }
})

// Locations & Times
const akadLocationDesc = computed(() => {
  return props.data?.akadLocation?.description || 'Love Garden Resto & Cafe, Jl. Veteran No.66, Bogor Tengah, Kota Bogor'
})
const akadMapUrl = computed(() => {
  return props.data?.akadLocation?.mapUrl || 'https://maps.google.com/?q=Love+Garden+Resto+Cafe+Bogor'
})
const resepsiLocationDesc = computed(() => {
  return props.data?.resepsiLocation?.description || 'Love Garden Resto & Cafe, Jl. Veteran No.66, Bogor Tengah, Kota Bogor'
})
const resepsiMapUrl = computed(() => {
  return props.data?.resepsiLocation?.mapUrl || 'https://maps.google.com/?q=Love+Garden+Resto+Cafe+Bogor'
})

const akadTimeFormatted = computed(() => {
  if (props.data?.designSettings?.eventStartTime && props.data?.designSettings?.eventEndTime) {
    return `${props.data.designSettings.eventStartTime} - ${props.data.designSettings.eventEndTime} WIB`
  }
  if (props.data?.eventStartTime) {
    return `${props.data.eventStartTime} - ${props.data.eventEndTime || 'Selesai'} WIB`
  }
  return '08.00 - 10.00 WIB'
})

const resepsiTimeFormatted = computed(() => {
  if (props.data?.eventEndTime) {
    return `11.00 - ${props.data.eventEndTime} WIB`
  }
  return '11.00 - 16.00 WIB'
})

const venueCity = computed(() => {
  const desc = akadLocationDesc.value
  if (desc.includes('Bogor')) return 'Bogor, Jawa Barat'
  if (desc.includes('Jakarta')) return 'Jakarta'
  if (desc.includes('Bandung')) return 'Bandung'
  if (desc.includes('Yogyakarta')) return 'Yogyakarta'
  if (desc.includes('Surabaya')) return 'Surabaya'
  const parts = desc.split(',')
  return parts.length > 1 ? parts[parts.length - 1].trim() : ''
})

const dressCodeText = computed(() => {
  return props.data?.dressCode || 'Sage Green, Soft Rose, Cream & Earthy Pastel'
})

const extendedFamilyList = computed(() => {
  if (Array.isArray(props.data?.extendedFamily) && props.data.extendedFamily.length) {
    return props.data.extendedFamily
  }
  return []
})
const turutMengundangText = computed(() => props.data?.turutMengundang || '')

const liveStreamingUrl = computed(() => props.data?.liveStreamingLink || '')

// Prewedding Video Embed
function getEmbedUrlVideo(url) {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = String(url).match(regExp)
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url
}
const videoEmbedUrl = computed(() => getEmbedUrlVideo(props.data?.videoPrewedding))

// Bank Accounts & Gifts
const bankAccounts = computed(() => {
  if (Array.isArray(props.data?.bankAccounts) && props.data.bankAccounts.length) {
    return props.data.bankAccounts
  }
  return [
    { bankName: 'MANDIRI', accountNumber: '1330022334455', accountName: 'Dewi Anggraeni' },
    { bankName: 'BCA', accountNumber: '8831122334', accountName: 'Riyandi Alfriansyah' }
  ]
})

const giftAddress = computed(() => {
  if (Array.isArray(props.data?.giftDeliveryAddress) && props.data.giftDeliveryAddress.length) {
    return props.data.giftDeliveryAddress[0]
  }
  if (props.data?.giftDeliveryAddress && typeof props.data.giftDeliveryAddress === 'object') {
    return props.data.giftDeliveryAddress
  }
  return {
    recipient: 'Dewi Anggraeni & Riyandi',
    phone: '0812-3456-7890',
    address: 'Jl. Pajajaran Indah No. 24, Baranangsiang, Bogor Timur, Kota Bogor 16143'
  }
})

const loveStories = computed(() => {
  if (Array.isArray(props.data?.loveStory) && props.data.loveStory.length) {
    return props.data.loveStory
  }
  return [
    {
      year: '2021',
      title: 'Pertemuan Pertama',
      description: 'Sebuah secangkir kopi di sudut kota Bogor yang tak sengaja menjadi saksi tatap mata pertama kami.'
    },
    {
      year: '2023',
      title: 'Menjalin Komitmen',
      description: 'Setelah ribuan cerita dan perjalanan bersama, kami sepakat untuk melangkah ke arah yang sama.'
    },
    {
      year: '2025',
      title: 'Hari Pertunangan',
      description: 'Di hadapan kedua keluarga besar, sebuah janji terucap untuk saling menjaga selamanya.'
    },
    {
      year: '2026',
      title: 'Menuju Babak Baru',
      description: 'Dengan penuh cinta dan rasa syukur, kami mengikat janji suci pernikahan.'
    }
  ]
})

const galleryImages = computed(() => {
  if (Array.isArray(props.data?.galleryImages) && props.data.galleryImages.length) {
    return props.data.galleryImages
  }
  return [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80'
  ]
})

const galleryCaptions = [
  'First Coffee Date ☕',
  'Golden Hour Memories ✨',
  'Laughter in Bogor 🌸',
  'Together Forever 💕'
]

const footerCustomText = computed(() => props.data?.footerText || '')

// Music URL Helper
function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:')) return choice
  if (choice.startsWith('http') || choice.startsWith('/')) return choice
  return `/audio/${choice}`
}

// Welcome Screen & State
const showWelcome = ref(true)
const selectedPhoto = ref(null)
const toastMessage = ref('')

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    scrollToSection('hero')
  }, 100)
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// Dynamic Navigation Items
const navItems = computed(() => {
  const items = [
    { id: 'hero', icon: '🏠', label: 'Beranda' }
  ]
  if (isSectionEnabled('couple')) items.push({ id: 'couple', icon: '👫', label: 'Mempelai' })
  if (isSectionEnabled('event')) {
    items.push({ id: 'calendar', icon: '📅', label: 'Jadwal' })
    items.push({ id: 'events', icon: '📍', label: 'Acara' })
  }
  if (isSectionEnabled('story') && loveStories.value?.length) {
    items.push({ id: 'story', icon: '📖', label: 'Cerita' })
  }
  if (isSectionEnabled('video') && videoEmbedUrl.value) {
    items.push({ id: 'video', icon: '🎬', label: 'Video' })
  }
  if (isSectionEnabled('gallery') && galleryImages.value?.length) {
    items.push({ id: 'gallery', icon: '📸', label: 'Galeri' })
  }
  if (isSectionEnabled('gift') && (bankAccounts.value?.length || giftAddress.value)) {
    items.push({ id: 'gift', icon: '🎁', label: 'Kado' })
  }
  if (isSectionEnabled('rsvp') || isSectionEnabled('wishes')) {
    items.push({ id: 'rsvp', icon: '💌', label: 'RSVP' })
  }
  return items
})

// Google Calendar URL Generator
const calendarUrl = computed(() => {
  const title = encodeURIComponent(`The Wedding of ${brideNickname.value} & ${groomNickname.value}`)
  const details = encodeURIComponent(`Walimatul Ursy ${brideName.value} & ${groomName.value}`)
  const location = encodeURIComponent(akadLocationDesc.value)
  const d = weddingDateObj.value
  const pad = (n) => String(n).padStart(2, '0')
  const dateStr = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T010000Z/${dateStr}T090000Z&details=${details}&location=${location}`
})

// Live Countdown
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let countdownTimer = null

function updateCountdown() {
  const now = new Date().getTime()
  const diff = weddingDateObj.value.getTime() - now

  if (diff <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  countdown.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

// RSVP Form State & Bulletin
const rsvpForm = ref({
  name: '',
  status: 'hadir',
  pax: '2',
  message: ''
})

const guestbook = ref([
  {
    name: 'Nabila Putri',
    status: 'Hadir',
    message: 'Selamat Dewi dan Riyandi! Semoga dilancarkan acaranya sampai hari H yaa, bahagia selalu kalian ❤️',
    time: '2 jam lalu'
  },
  {
    name: 'Fajar Kurniawan',
    status: 'Hadir',
    message: 'Alhamdulillah akhirnya nyusul juga bro Riyandi! Lancar dan sakinah selalu ya kawan.',
    time: '4 jam lalu'
  },
  {
    name: 'Rina & Dimas',
    status: 'Hadir',
    message: 'Happy wedding! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin 🌸',
    time: 'Kemarin'
  }
])

function submitRsvp() {
  if (!rsvpForm.value.name || !rsvpForm.value.message) return
  
  guestbook.value.unshift({
    name: rsvpForm.value.name,
    status: rsvpForm.value.status === 'hadir' ? 'Hadir' : rsvpForm.value.status === 'ragu' ? 'Ragu' : 'Berhalangan',
    message: rsvpForm.value.message,
    time: 'Baru saja'
  })

  showToast('Konfirmasi RSVP & doa berhasil dikirim! 💌')
  rsvpForm.value.name = ''
  rsvpForm.value.message = ''
}

function copyText(text, label) {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} berhasil disalin! ✨`)
    })
  } else {
    showToast(`${label}: ${text}`)
  }
}

let toastTimer = null
function showToast(msg) {
  toastMessage.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(countdownTimer)
  clearTimeout(toastTimer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Patrick+Hand&family=Nunito:wght@400;600;700;800&display=swap');

.font-gaegu {
  font-family: 'Gaegu', cursive, sans-serif;
}

.font-hand {
  font-family: 'Patrick Hand', cursive, sans-serif;
}

/* Authentic Paper Texture Pattern */
.paper-pattern {
  background-color: #faf7f2;
  background-image: 
    radial-gradient(#5b7a58 0.75px, transparent 0.75px), 
    radial-gradient(#e87a90 0.5px, #faf7f2 0.5px);
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
}

/* Bottom Navigation Item */
.nav-bottom-item {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.15rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-bottom-item:hover {
  background-color: rgba(91, 122, 88, 0.08);
}

/* Wobbly Hand-Drawn Doodle Border Box */
.doodle-box {
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  box-shadow: 4px 6px 0px rgba(91, 122, 88, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.doodle-box:hover {
  transform: translateY(-2px);
  box-shadow: 6px 8px 0px rgba(91, 122, 88, 0.25);
}

.doodle-button {
  border-radius: 255px 25px 225px 25px/25px 225px 25px 255px;
  box-shadow: 0 6px 0px #3d533b;
}

.doodle-button:active {
  transform: translateY(3px);
  box-shadow: 0 3px 0px #3d533b;
}

/* Washi Tape Ribbon Effect */
.washi-tape {
  position: absolute;
  width: 76px;
  height: 22px;
  opacity: 0.9;
  clip-path: polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%);
  z-index: 20;
}

.washi-yellow {
  background-color: #faebb8;
  border-top: 1px dashed rgba(160, 130, 40, 0.4);
  border-bottom: 1px dashed rgba(160, 130, 40, 0.4);
}

.washi-pink {
  background-color: #f8cfd7;
  border-top: 1px dashed rgba(200, 80, 100, 0.4);
  border-bottom: 1px dashed rgba(200, 80, 100, 0.4);
}

.washi-mint {
  background-color: #d1e7cf;
  border-top: 1px dashed rgba(60, 120, 60, 0.4);
  border-bottom: 1px dashed rgba(60, 120, 60, 0.4);
}

/* Airmail Diagonal Strip */
.airmail-strip {
  background: repeating-linear-gradient(
    135deg,
    #5b7a58,
    #5b7a58 14px,
    #faf7f2 14px,
    #faf7f2 20px,
    #e87a90 20px,
    #e87a90 34px,
    #faf7f2 34px,
    #faf7f2 40px
  );
}

/* Micro-animations */
@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(6deg); }
  50% { transform: rotate(2deg); }
}

.animate-float-slow {
  animation: float-slow 4s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 3s ease-in-out infinite;
}

/* Welcome Cover Curtain-Up Transition */
.cover-slide-leave-active {
  transition: transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease-in-out;
}

.cover-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0.95;
}

/* Main Content Enter Animation */
@keyframes enter-up {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-enter-up {
  animation: enter-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Toast Notification Animation */
.toast-pop-enter-active,
.toast-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-pop-enter-from,
.toast-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}

@keyframes scale-up {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-scale-up {
  animation: scale-up 0.35s ease-out forwards;
}
</style>
