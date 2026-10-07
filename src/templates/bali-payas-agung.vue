<template>
  <div class="relative min-h-screen bg-[#180e0a] overflow-hidden font-serif no-scrollbar text-[#fffdfa] selection:bg-[#dfb15b]/30 selection:text-[#f7e5aa]">

    <!-- Balinese Poleng Checkered Subtle Texture (Rwa Bhineda Weave) -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-10"
      style="background-image: repeating-linear-gradient(0deg, rgba(223, 177, 91, 0.08) 0 18px, transparent 18px 36px), repeating-linear-gradient(90deg, rgba(223, 177, 91, 0.08) 0 18px, transparent 18px 36px); background-size: 36px 36px;"
    ></div>

    <!-- Sacred Balinese Sandalwood Stone & Paper Grain Texture -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-25 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

    <!-- Ambient Golden Spiritual Glow -->
    <div class="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#dfb15b]/15 via-[#8c4830]/10 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>
    <div class="fixed -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-[#dfb15b]/10 via-[#3d2317]/20 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

    <!-- Majestic Kori Agung Watermark Silhouette Backdrop -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] md:w-[680px] pointer-events-none opacity-[0.035] z-0 select-none text-[#dfb15b]">
      <svg viewBox="0 0 240 300" fill="currentColor" class="w-full h-auto">
        <!-- Meru & Spire Apex -->
        <polygon points="120,5 116,25 124,25" />
        <path d="M120,25 C112,35 110,45 106,55 L134,55 C130,45 128,35 120,25 Z" />
        <path d="M120,55 C108,68 102,80 96,95 L144,95 C138,80 132,68 120,55 Z" />
        <path d="M120,95 C102,112 94,128 86,145 L154,145 C146,128 138,112 120,95 Z" />
        <!-- Winged Pylons Left and Right -->
        <path d="M86,145 L60,150 L65,175 L80,172 L78,210 L52,215 L56,240 L76,238 L72,295 L110,295 L110,190 C100,190 92,180 86,170 Z" />
        <path d="M154,145 L180,150 L175,175 L160,172 L162,210 L188,215 L184,240 L164,238 L168,295 L130,295 L130,190 C140,190 148,180 154,170 Z" />
        <!-- Central Sacred Portal -->
        <path d="M110,210 C110,195 130,195 130,210 L130,295 L110,295 Z" fill="#180e0a" />
      </svg>
    </div>

    <!-- Sacred Balinese Corner Ornaments (Ukiran Patra Samblung Prada Emas) -->
    <div class="fixed top-0 left-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-80 pointer-events-none select-none text-[#dfb15b]">
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full filter drop-shadow-[0_2px_10px_rgba(223,177,91,0.35)]">
        <!-- Corner Floral Vine Spire -->
        <path d="M0,0 L45,0 C42,12 36,20 28,26 C36,24 45,28 48,36 C50,42 46,50 38,52 C32,54 26,50 24,44 C22,38 26,30 32,28 C22,32 15,40 12,50 C9,62 14,74 20,84 L0,84 Z" fill="currentColor" opacity="0.3" />
        <path d="M2,2 L35,2 C30,10 24,18 16,22 C22,24 28,30 26,38 C24,44 18,46 14,42 C10,38 12,30 18,26 C12,30 6,38 4,48 L2,48 Z" fill="url(#goldGradient)" />
        <circle cx="20" cy="20" r="4" fill="#f7e5aa" />
        <circle cx="36" cy="10" r="2.5" fill="#f7e5aa" />
        <circle cx="10" cy="36" r="2.5" fill="#f7e5aa" />
      </svg>
    </div>
    <div class="fixed top-0 right-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-80 pointer-events-none select-none -scale-x-100 text-[#dfb15b]">
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full filter drop-shadow-[0_2px_10px_rgba(223,177,91,0.35)]">
        <path d="M0,0 L45,0 C42,12 36,20 28,26 C36,24 45,28 48,36 C50,42 46,50 38,52 C32,54 26,50 24,44 C22,38 26,30 32,28 C22,32 15,40 12,50 C9,62 14,74 20,84 L0,84 Z" fill="currentColor" opacity="0.3" />
        <path d="M2,2 L35,2 C30,10 24,18 16,22 C22,24 28,30 26,38 C24,44 18,46 14,42 C10,38 12,30 18,26 C12,30 6,38 4,48 L2,48 Z" fill="url(#goldGradient)" />
        <circle cx="20" cy="20" r="4" fill="#f7e5aa" />
        <circle cx="36" cy="10" r="2.5" fill="#f7e5aa" />
        <circle cx="10" cy="36" r="2.5" fill="#f7e5aa" />
      </svg>
    </div>
    <div class="fixed bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-80 pointer-events-none select-none -scale-y-100 text-[#dfb15b]">
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full filter drop-shadow-[0_2px_10px_rgba(223,177,91,0.35)]">
        <path d="M0,0 L45,0 C42,12 36,20 28,26 C36,24 45,28 48,36 C50,42 46,50 38,52 C32,54 26,50 24,44 C22,38 26,30 32,28 C22,32 15,40 12,50 C9,62 14,74 20,84 L0,84 Z" fill="currentColor" opacity="0.3" />
        <path d="M2,2 L35,2 C30,10 24,18 16,22 C22,24 28,30 26,38 C24,44 18,46 14,42 C10,38 12,30 18,26 C12,30 6,38 4,48 L2,48 Z" fill="url(#goldGradient)" />
        <circle cx="20" cy="20" r="4" fill="#f7e5aa" />
        <circle cx="36" cy="10" r="2.5" fill="#f7e5aa" />
        <circle cx="10" cy="36" r="2.5" fill="#f7e5aa" />
      </svg>
    </div>
    <div class="fixed bottom-0 right-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-80 pointer-events-none select-none rotate-180 text-[#dfb15b]">
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full filter drop-shadow-[0_2px_10px_rgba(223,177,91,0.35)]">
        <path d="M0,0 L45,0 C42,12 36,20 28,26 C36,24 45,28 48,36 C50,42 46,50 38,52 C32,54 26,50 24,44 C22,38 26,30 32,28 C22,32 15,40 12,50 C9,62 14,74 20,84 L0,84 Z" fill="currentColor" opacity="0.3" />
        <path d="M2,2 L35,2 C30,10 24,18 16,22 C22,24 28,30 26,38 C24,44 18,46 14,42 C10,38 12,30 18,26 C12,30 6,38 4,48 L2,48 Z" fill="url(#goldGradient)" />
        <circle cx="20" cy="20" r="4" fill="#f7e5aa" />
        <circle cx="36" cy="10" r="2.5" fill="#f7e5aa" />
        <circle cx="10" cy="36" r="2.5" fill="#f7e5aa" />
      </svg>
    </div>

    <!-- Music Control Component -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#2c1810"
      accentColor="#dfb15b"
      :autoPlay="!showWelcome"
    />

    <!-- Floating Bottom Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#2c1810]/92 backdrop-blur-xl border border-[#dfb15b]/45 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.8)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#f7e5aa] scale-105' : 'text-[#d5ba99]/75 hover:text-[#f7e5aa]'"
        >
          <i :class="[item.icon, 'text-base md:text-lg']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-sans">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#dfb15b] to-[#f7e5aa] transition-all shadow-[0_0_8px_rgba(223,177,91,0.8)]"
            :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- Welcome Gate / Pintu Gebyok Kori Agung -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#3d2317] via-[#2c1810] to-[#180e0a] transition-all duration-1000 overflow-y-auto"
      >
        <!-- Sacred Prada Frame Border -->
        <div class="absolute inset-4 md:inset-8 border border-[#dfb15b]/35 rounded-3xl pointer-events-none">
          <div class="absolute inset-1.5 border border-[#dfb15b]/20 rounded-[22px]"></div>
          <div class="absolute inset-3 border border-[#8c4830]/25 rounded-[18px]"></div>
        </div>

        <div class="relative z-10 space-y-6 md:space-y-8 animate-fade-in-up max-w-lg mx-auto py-8">
          <!-- Balinese Sacred Crown / Candi Bentar Icon -->
          <div class="flex flex-col items-center justify-center">
            <div class="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
              <svg viewBox="0 0 100 100" class="w-full h-full text-[#dfb15b] filter drop-shadow-[0_4px_16px_rgba(223,177,91,0.5)]">
                <!-- Om Swastyastu / Omkara Mandala Sunburst -->
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3" opacity="0.6" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" />
                <path d="M50 12 L52 22 L62 20 L58 28 L68 32 L60 38 L68 46 L58 48 L62 58 L52 56 L50 66 L48 56 L38 58 L42 48 L32 46 L40 38 L32 32 L42 28 L38 20 L48 22 Z" fill="#dfb15b" opacity="0.25" />
                <!-- Center Sacred Balinese Om Symbol / ॐ -->
                <text x="50" y="58" font-size="28" font-family="'Cinzel Decorative', serif" text-anchor="middle" fill="#f7e5aa" font-weight="bold">ॐ</text>
              </svg>
            </div>
            <div class="text-[11px] md:text-xs tracking-[0.45em] uppercase text-[#dfb15b] font-bold mt-2 font-sans">
              Om Swastyastu
            </div>
          </div>

          <!-- Title & Couple -->
          <div class="space-y-2">
            <p class="font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#d5ba99]/90 font-medium">
              Atur Piuning Pawiwahan Yadnya
            </p>
            <h1 class="text-4xl md:text-6xl font-serif text-[#fffdfa] drop-shadow-[0_2px_16px_rgba(223,177,91,0.35)] leading-tight">
              {{ data.groomName?.split(' ')[0] || data.groomName }}
              <span class="text-2xl md:text-3xl font-serif text-[#dfb15b] block my-1 font-light">&amp;</span>
              {{ data.brideName?.split(' ')[0] || data.brideName }}
            </h1>
            <p class="text-xs text-[#dfb15b] uppercase tracking-widest font-sans font-semibold">
              Adat Bali · Payas Agung
            </p>
          </div>

          <!-- Balinese Guest Card / Katur Suksma Majeng Ring -->
          <div class="my-6 p-5 md:p-6 border border-[#dfb15b]/35 bg-[#3d2317]/85 backdrop-blur-md rounded-2xl max-w-xs mx-auto shadow-2xl space-y-2.5 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#dfb15b]/20 to-transparent rounded-bl-full pointer-events-none"></div>
            <p class="text-[9px] md:text-[10px] font-sans uppercase tracking-[0.25em] text-[#dfb15b] font-semibold">
              Katur Suksma Majeng Ring:
            </p>
            <p class="text-xl md:text-2xl font-serif font-bold text-[#fffdfa] tracking-wide">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
            <p class="text-[10px] font-sans text-[#d5ba99]/80 italic">
              Lugrayang titiang ngaturang atur piuning ring sapangrauh Ida Dane sinamian
            </p>
          </div>

          <!-- Open Button -->
          <button
            @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#b8860b] via-[#dfb15b] to-[#b8860b] hover:brightness-110 text-[#180e0a] font-bold rounded-full transition-all shadow-[0_4px_25px_rgba(223,177,91,0.45)] text-xs uppercase tracking-[0.22em] active:scale-95 cursor-pointer"
          >
            <i class="fa-solid fa-envelope-open text-xs"></i>
            <span>Buka Undangan</span>
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
      <!-- HERO SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-24 bg-gradient-to-b from-[#3d2317] via-[#2c1810] to-[#180e0a]">
        <div class="space-y-6 max-w-3xl mx-auto relative z-10" v-observe>
          <!-- Balinese Badge -->
          <div class="flex items-center justify-center gap-3 text-[#dfb15b]">
            <span class="w-10 md:w-16 h-px bg-gradient-to-r from-transparent to-[#dfb15b]"></span>
            <span class="text-[10px] md:text-xs uppercase tracking-[0.35em] font-sans font-bold">Pawiwahan Yadnya</span>
            <span class="w-10 md:w-16 h-px bg-gradient-to-l from-transparent to-[#dfb15b]"></span>
          </div>

          <!-- Couple Main Photo Framed with Balinese Gateway Arch -->
          <div v-if="data.photoCoupleUrl" class="relative inline-block my-3">
            <div class="relative w-52 h-72 md:w-64 md:h-88 mx-auto rounded-t-full border-2 border-[#dfb15b] p-1.5 shadow-[0_0_35px_rgba(223,177,91,0.3)] overflow-hidden bg-[#2c1810]">
              <img :src="data.photoCoupleUrl" alt="Foto Mempelai" class="w-full h-full object-cover rounded-t-full filter brightness-95 hover:scale-105 transition-transform duration-700" />
            </div>
            <!-- Frangipani / Bunga Jepun Accent at Arch Apex -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 text-[#f7e5aa] filter drop-shadow-[0_2px_8px_rgba(223,177,91,0.6)]">
              <svg viewBox="0 0 40 40" fill="currentColor">
                <circle cx="20" cy="20" r="6" fill="#dfb15b" />
                <path d="M20 5 C23 12 25 15 20 20 C15 15 17 12 20 5 Z" fill="#fffdfa" />
                <path d="M35 20 C28 23 25 25 20 20 C25 15 28 17 35 20 Z" fill="#fffdfa" />
                <path d="M20 35 C17 28 15 25 20 20 C25 25 23 28 20 35 Z" fill="#fffdfa" />
                <path d="M5 20 C12 17 15 15 20 20 C15 25 12 23 5 20 Z" fill="#fffdfa" />
                <circle cx="20" cy="20" r="3.5" fill="#f7e5aa" />
              </svg>
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2c1810] border border-[#dfb15b] px-5 py-1 rounded-full text-[10px] text-[#f7e5aa] font-sans uppercase tracking-widest whitespace-nowrap shadow-lg">
              Sang Kalih Sane Mawiwaha
            </div>
          </div>

          <h1 class="text-5xl md:text-8xl font-serif text-[#fffdfa] leading-tight">
            {{ data.groomName }} <br />
            <span class="text-3xl md:text-5xl text-[#dfb15b] italic my-2 inline-block font-serif">&amp;</span> <br />
            {{ data.brideName }}
          </h1>

          <p class="text-base md:text-xl text-[#dfb15b] tracking-[0.25em] uppercase font-sans font-medium">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
          </p>

          <!-- Countdown Timer Balinese -->
          <div class="grid grid-cols-4 gap-3 md:gap-6 mt-10 max-w-md mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 md:p-4 border border-[#dfb15b]/35 rounded-2xl bg-[#2c1810]/85 backdrop-blur-md shadow-xl text-center group hover:border-[#dfb15b] transition-colors"
            >
              <div class="text-2xl md:text-3xl font-serif font-bold text-[#fffdfa]">{{ val }}</div>
              <div class="text-[9px] md:text-[10px] uppercase tracking-wider text-[#dfb15b] font-sans mt-1 font-bold">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 animate-bounce text-[#dfb15b]/70">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- SLOKA SUCI BHAGAWAD GITA / DOAYADNYA -->
      <section v-if="isSectionEnabled('quote')" class="py-24 px-6 bg-[#21130e] relative text-center border-y border-[#dfb15b]/20" v-observe>
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Balinese Sacred Lotus Motif -->
          <div class="flex justify-center text-[#dfb15b]">
            <svg class="w-12 h-12" viewBox="0 0 60 60" fill="currentColor">
              <path d="M30 10 C34 22 42 28 50 30 C40 34 36 42 30 50 C24 42 20 34 10 30 C18 28 26 22 30 10 Z" opacity="0.8" />
              <circle cx="30" cy="30" r="5" fill="#f7e5aa" />
            </svg>
          </div>

          <p class="font-serif text-lg md:text-2xl text-[#fdfbf7] italic leading-relaxed px-4">
            "{{ data.quoteText || 'Om Ihaiva Stam Ma Vi Yaus Tam, Visvam Ayur Vyasnutam, Kridantau Putraih Pautraih, Modamanau Sve Grhe. Ya Tuhan, anugerahkanlah kehidupan bahagia, janganlah terpisahkan, capailah usia penuh, bermainlah dengan anak dan cucu dalam rumah tangga yang damai.' }}"
          </p>

          <div class="flex items-center justify-center gap-3">
            <span class="w-12 h-px bg-[#dfb15b]/50"></span>
            <span class="w-2 h-2 rotate-45 bg-[#dfb15b]"></span>
            <span class="w-12 h-px bg-[#dfb15b]/50"></span>
          </div>

          <p class="text-xs font-sans font-bold text-[#dfb15b] tracking-[0.35em] uppercase">
            {{ data.quoteSource || 'Rgveda X.85.42 · Bhagawad Gita' }}
          </p>
        </div>
      </section>

      <!-- PROFIL MEMPELAI (PURUSHA & PRADHANA) -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="py-24 md:py-32 px-6 bg-[#180e0a] relative" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-16">
          <div class="space-y-4">
            <p class="text-xs uppercase tracking-[0.35em] text-[#dfb15b] font-sans font-bold">Mempelai Purusha &amp; Pradhana</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fffdfa]">Sang Kalih Sane Mawiwaha</h2>
            <!-- Balinese Floral Divider -->
            <div class="flex items-center justify-center gap-4 text-[#dfb15b] opacity-80">
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
              <i class="fa-solid fa-spa text-sm"></i>
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#d5ba99] max-w-lg mx-auto font-sans">
              Asung kertha wara nugraha Ida Sang Hyang Widhi Wasa, sampun prasida ngemargiang pasobayan suci sane kaiket antuk tresna asih.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-16 md:gap-12 items-center">
            <!-- Purusha (Groom) -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#dfb15b] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-[#2c1810] overflow-hidden">
                  <img
                    :src="data.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'"
                    alt="Mempelai Pria (Purusha)"
                    class="w-full h-full object-cover rounded-t-full filter brightness-95 hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#3d2317] border border-[#dfb15b] px-4 py-0.5 rounded-full text-[10px] text-[#f7e5aa] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  Purusha (Mempelai Pria)
                </div>
              </div>
              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fffdfa]">{{ data.groomName }}</h3>
                <p v-if="data.parents?.groomParents" class="text-xs text-[#d5ba99] max-w-xs mx-auto leading-relaxed font-sans">
                  Putra saking pasangan <br />
                  <strong class="text-[#fdfbf7]">{{ data.parents.groomParents }}</strong>
                </p>
                <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaGroom.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#dfb15b] hover:underline font-sans"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Pradhana (Bride) -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#dfb15b] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-[#2c1810] overflow-hidden">
                  <img
                    :src="data.bridePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'"
                    alt="Mempelai Wanita (Pradhana)"
                    class="w-full h-full object-cover rounded-t-full filter brightness-95 hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#3d2317] border border-[#dfb15b] px-4 py-0.5 rounded-full text-[10px] text-[#f7e5aa] font-sans uppercase tracking-widest whitespace-nowrap shadow-md">
                  Pradhana (Mempelai Wanita)
                </div>
              </div>
              <div class="space-y-2 pt-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fffdfa]">{{ data.brideName }}</h3>
                <p v-if="data.parents?.brideParents" class="text-xs text-[#d5ba99] max-w-xs mx-auto leading-relaxed font-sans">
                  Putri saking pasangan <br />
                  <strong class="text-[#fdfbf7]">{{ data.parents.brideParents }}</strong>
                </p>
                <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaBrides.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#dfb15b] hover:underline font-sans"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DUDONAN ACARA (PAWIWAHAN & RESEPSI) -->
      <section v-if="isSectionEnabled('event')" id="event" class="py-24 md:py-32 px-6 bg-[#21130e] relative" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-16">
          <div class="space-y-4">
            <p class="text-xs uppercase tracking-[0.35em] text-[#dfb15b] font-sans font-bold">Dudonan Acara</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fffdfa]">Waktu &amp; Genah Acara</h2>
            <div class="flex items-center justify-center gap-4 text-[#dfb15b] opacity-80">
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
              <i class="fa-solid fa-om text-sm"></i>
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#d5ba99] max-w-lg mx-auto font-sans">
              Dudonan upacara pawiwahan yadnya kalaksanayang nganutin dudonan galah ring sor puniki:
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 text-left">
            <!-- Upacara Pawiwahan Yadnya / Makala-kalaan / Mepamit -->
            <div class="p-8 md:p-10 border border-[#dfb15b]/35 bg-[#2c1810]/90 backdrop-blur-md rounded-3xl shadow-xl space-y-6 relative overflow-hidden group hover:border-[#dfb15b] transition-all">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#dfb15b]/15 border border-[#dfb15b]/40 flex items-center justify-center text-[#dfb15b] text-xl">
                  <i class="fa-solid fa-hands-praying"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-serif text-[#fffdfa]">Upacara Pawiwahan</h3>
                  <p class="text-xs text-[#dfb15b] font-sans uppercase tracking-wider font-semibold">Akad / Yadnya Makala-kalaan</p>
                </div>
              </div>

              <div class="space-y-3 font-sans text-sm text-[#d5ba99] border-t border-[#dfb15b]/20 pt-4">
                <div class="flex items-start gap-3">
                  <i class="fa-regular fa-calendar text-[#dfb15b] mt-1"></i>
                  <span>{{ formatDate(data.akadLocation?.dateTime || data.dateTime) }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fa-regular fa-clock text-[#dfb15b] mt-1"></i>
                  <span>{{ formatTime(data.akadLocation?.dateTime || data.dateTime) }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fa-solid fa-location-dot text-[#dfb15b] mt-1"></i>
                  <span class="leading-relaxed">{{ data.akadLocation?.description || 'Gria / Puri Kediaman Mempelai' }}</span>
                </div>
              </div>

              <div v-if="data.akadLocation?.mapUrl" class="pt-2">
                <a
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#3d2317] hover:bg-[#dfb15b] hover:text-[#180e0a] text-[#dfb15b] border border-[#dfb15b]/50 rounded-xl transition-all text-xs font-sans font-bold uppercase tracking-wider"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>Cingak Ring Google Maps</span>
                </a>
              </div>
            </div>

            <!-- Resepsi Pawiwahan / Ramah Tamah -->
            <div class="p-8 md:p-10 border border-[#dfb15b]/35 bg-[#2c1810]/90 backdrop-blur-md rounded-3xl shadow-xl space-y-6 relative overflow-hidden group hover:border-[#dfb15b] transition-all">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#dfb15b]/15 border border-[#dfb15b]/40 flex items-center justify-center text-[#dfb15b] text-xl">
                  <i class="fa-solid fa-champagne-glasses"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-serif text-[#fffdfa]">Resepsi Pawiwahan</h3>
                  <p class="text-xs text-[#dfb15b] font-sans uppercase tracking-wider font-semibold">Ramah Tamah &amp; Santap Siang</p>
                </div>
              </div>

              <div class="space-y-3 font-sans text-sm text-[#d5ba99] border-t border-[#dfb15b]/20 pt-4">
                <div class="flex items-start gap-3">
                  <i class="fa-regular fa-calendar text-[#dfb15b] mt-1"></i>
                  <span>{{ formatDate(data.resepsiLocation?.dateTime || data.dateTime) }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fa-regular fa-clock text-[#dfb15b] mt-1"></i>
                  <span>{{ formatTime(data.resepsiLocation?.dateTime || data.dateTime) }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fa-solid fa-location-dot text-[#dfb15b] mt-1"></i>
                  <span class="leading-relaxed">{{ data.resepsiLocation?.description || 'Bale Banjar / Gedung Serbaguna' }}</span>
                </div>
              </div>

              <div v-if="data.resepsiLocation?.mapUrl" class="pt-2">
                <a
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#3d2317] hover:bg-[#dfb15b] hover:text-[#180e0a] text-[#dfb15b] border border-[#dfb15b]/50 rounded-xl transition-all text-xs font-sans font-bold uppercase tracking-wider"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>Cingak Ring Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Dress Code & Live Streaming Details -->
          <div v-if="data.dressCode || data.liveStreamingUrl" class="max-w-xl mx-auto space-y-4 pt-6">
            <div v-if="data.dressCode" class="p-5 border border-[#dfb15b]/25 bg-[#2c1810]/70 rounded-2xl flex items-center justify-center gap-3 text-xs md:text-sm text-[#d5ba99] font-sans">
              <i class="fa-solid fa-shirt text-[#dfb15b]"></i>
              <span><strong>Busana / Dress Code:</strong> {{ data.dressCode }}</span>
            </div>

            <div v-if="data.liveStreamingUrl" class="p-5 border border-[#dfb15b]/25 bg-[#2c1810]/70 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <div class="flex items-center gap-3 text-xs md:text-sm text-[#d5ba99]">
                <i class="fa-solid fa-video text-red-500 animate-pulse"></i>
                <span>Siaran Langsung Pawiwahan (Live Streaming)</span>
              </div>
              <a
                :href="data.liveStreamingUrl"
                target="_blank"
                class="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110"
              >
                Nonton Live
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- CARITA TRESNA (LOVE STORY) -->
      <section v-if="isSectionEnabled('love-story')" id="story" class="py-24 md:py-32 px-6 bg-[#180e0a] relative" v-observe>
        <div class="max-w-3xl mx-auto space-y-16">
          <div class="text-center space-y-4">
            <p class="text-xs uppercase tracking-[0.35em] text-[#dfb15b] font-sans font-bold">Carita Tresna</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fffdfa]">Lelampahan Tresna Asih</h2>
            <div class="flex items-center justify-center gap-4 text-[#dfb15b] opacity-80">
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
              <i class="fa-solid fa-heart text-sm"></i>
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
            </div>
          </div>

          <div class="relative border-l-2 border-[#dfb15b]/40 ml-4 md:ml-32 space-y-12">
            <div
              v-for="(story, index) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="index"
              class="relative pl-8 md:pl-10 group"
            >
              <!-- Balinese Frangipani Timeline Dot -->
              <div class="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#2c1810] border-2 border-[#dfb15b] flex items-center justify-center text-[#dfb15b] text-xs shadow-[0_0_12px_rgba(223,177,91,0.5)]">
                <i class="fa-solid fa-spa text-[10px]"></i>
              </div>

              <div class="p-6 md:p-8 border border-[#dfb15b]/30 bg-[#2c1810]/80 backdrop-blur-md rounded-2xl shadow-lg space-y-3 group-hover:border-[#dfb15b] transition-all">
                <span class="text-[10px] uppercase font-bold tracking-[0.25em] text-[#dfb15b] font-sans block">
                  {{ story.date }}
                </span>
                <h3 class="text-xl md:text-2xl font-serif text-[#fffdfa]">{{ story.title }}</h3>
                <p class="text-xs md:text-sm text-[#d5ba99] leading-relaxed font-sans">{{ story.description }}</p>
                <div v-if="story.image" class="mt-4 rounded-xl overflow-hidden border border-[#dfb15b]/20 max-h-56">
                  <img :src="story.image" :alt="story.title" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- GALERI FOTO & VIDEO PREWEDDING -->
      <section v-if="isSectionEnabled('gallery')" id="gallery" class="py-24 md:py-32 px-6 bg-[#21130e] relative" v-observe>
        <div class="max-w-5xl mx-auto space-y-16">
          <div class="text-center space-y-4">
            <p class="text-xs uppercase tracking-[0.35em] text-[#dfb15b] font-sans font-bold">Galeri Pawiwahan</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fffdfa]">Potrek Kenangan Suci</h2>
            <div class="flex items-center justify-center gap-4 text-[#dfb15b] opacity-80">
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
              <i class="fa-solid fa-camera text-sm"></i>
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#d5ba99] max-w-lg mx-auto font-sans">
              Momen endah sane sampun kaunggahang pinaka saksi lelampahan tresna sang kalih.
            </p>
          </div>

          <!-- Video Prewedding if Available -->
          <div v-if="data.videoPrewedding" class="max-w-3xl mx-auto rounded-3xl overflow-hidden border-2 border-[#dfb15b]/40 shadow-2xl bg-black">
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

          <!-- Gallery Images Component -->
          <GalleryInvitation
            v-if="galleryImages.length"
            :items="galleryImages"
          />
        </div>
      </section>

      <!-- DANA PUNIA & KADO PERNIKAHAN -->
      <section v-if="isSectionEnabled('gift')" id="gift" class="py-24 md:py-32 px-6 bg-[#180e0a] relative" v-observe>
        <div class="max-w-3xl mx-auto text-center space-y-16">
          <div class="space-y-4">
            <p class="text-xs uppercase tracking-[0.35em] text-[#dfb15b] font-sans font-bold">Dana Punia / Tanda Tresna</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fffdfa]">Kado Pawiwahan</h2>
            <div class="flex items-center justify-center gap-4 text-[#dfb15b] opacity-80">
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
              <i class="fa-solid fa-gift text-sm"></i>
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#d5ba99] max-w-lg mx-auto leading-relaxed font-sans">
              Pinaka rasa suksma majeng ring Ida Dane sane meled ngaturang punia utawi kado tresna, prasida kasalurang saking genah ring sor puniki:
            </p>
          </div>

          <!-- Bank Accounts Grid -->
          <div class="grid md:grid-cols-2 gap-6 text-left">
            <div
              v-for="(acc, idx) in (data.bankAccounts || [])"
              :key="idx"
              class="p-6 md:p-8 border border-[#dfb15b]/35 bg-[#2c1810]/90 backdrop-blur-md rounded-2xl shadow-xl space-y-4 relative overflow-hidden group hover:border-[#dfb15b] transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-widest text-[#dfb15b] font-bold font-sans">{{ acc.bankName }}</span>
                <i class="fa-solid fa-building-columns text-[#dfb15b]/60"></i>
              </div>
              <div class="space-y-1">
                <p class="text-xl md:text-2xl font-serif font-bold text-[#fffdfa] tracking-wider">{{ acc.accountNumber }}</p>
                <p class="text-xs text-[#d5ba99] font-sans">a.n. {{ acc.accountName }}</p>
              </div>
              <button
                @click="copyToClipboard(acc.accountNumber)"
                class="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#3d2317] hover:bg-[#dfb15b] hover:text-[#180e0a] text-[#dfb15b] border border-[#dfb15b]/40 rounded-xl transition-all text-xs font-sans font-bold uppercase tracking-wider cursor-pointer"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Nomor Rekening</span>
              </button>
            </div>
          </div>

          <!-- E-Wallets -->
          <div v-if="walletItems.length" class="space-y-4 max-w-md mx-auto">
            <div
              v-for="(wallet, idx) in walletItems"
              :key="idx"
              class="p-6 border border-[#dfb15b]/35 bg-[#2c1810]/90 rounded-2xl text-left space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-widest text-[#dfb15b] font-bold font-sans">{{ wallet.wallet_provider || 'E-Wallet' }}</span>
                <i class="fa-solid fa-wallet text-[#dfb15b]/60"></i>
              </div>
              <p class="text-lg font-serif font-bold text-[#fffdfa]">{{ wallet.wallet_number }}</p>
              <button
                @click="copyToClipboard(wallet.wallet_number)"
                class="inline-flex items-center justify-center gap-2 w-full py-2 bg-[#3d2317] hover:bg-[#dfb15b] hover:text-[#180e0a] text-[#dfb15b] border border-[#dfb15b]/40 rounded-lg text-xs font-sans font-bold uppercase"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Nomor E-Wallet</span>
              </button>
            </div>
          </div>

          <!-- Delivery Address for Physical Gifts -->
          <div v-if="giftAddresses.length" class="space-y-4 max-w-lg mx-auto">
            <div
              v-for="(addr, idx) in giftAddresses"
              :key="idx"
              class="p-6 border border-[#dfb15b]/35 bg-[#2c1810]/80 rounded-2xl text-left space-y-3 font-sans"
            >
              <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-[#dfb15b] font-bold">
                <i class="fa-solid fa-map-pin"></i>
                <span>Genah Pangiriman Kado Fisik</span>
              </div>
              <p class="text-xs text-[#d5ba99] leading-relaxed">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="inline-flex items-center justify-center gap-2 w-full py-2 bg-[#3d2317] hover:bg-[#dfb15b] hover:text-[#180e0a] text-[#dfb15b] border border-[#dfb15b]/40 rounded-lg text-xs font-bold uppercase"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Salin Alamat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP & ATUR DOA RESTU -->
      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="py-24 md:py-32 px-6 bg-[#21130e] relative" v-observe>
        <div class="max-w-2xl mx-auto text-center space-y-12">
          <div class="space-y-4">
            <p class="text-xs uppercase tracking-[0.35em] text-[#dfb15b] font-sans font-bold">Konfirmasi Rawuh &amp; Doa</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fffdfa]">Atur Piuning &amp; Restu</h2>
            <div class="flex items-center justify-center gap-4 text-[#dfb15b] opacity-80">
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
              <i class="fa-solid fa-envelope-open-text text-sm"></i>
              <span class="w-16 h-px bg-[#dfb15b]/60"></span>
            </div>
            <p class="text-xs md:text-sm text-[#d5ba99] max-w-lg mx-auto font-sans">
              Lugrayang titiang nguningang indik kehadiran Ida Dane sinamian ring dudonan acara puniki.
            </p>
          </div>

          <!-- RSVP Form -->
          <form @submit.prevent="submitRsvp" class="p-8 md:p-10 border border-[#dfb15b]/35 bg-[#2c1810]/95 backdrop-blur-md rounded-3xl shadow-2xl space-y-6 text-left font-sans">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#dfb15b] font-bold mb-2">Wastan Jangkep (Nama Lengkap)</label>
              <input
                v-model="rsvp.name"
                type="text"
                required
                placeholder="Tulis wastan jangkep druene..."
                class="w-full px-4 py-3 bg-[#180e0a] border border-[#dfb15b]/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#dfb15b] text-sm"
              />
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#dfb15b] font-bold mb-2">Konfirmasi Karawuhan</label>
              <select
                v-model="rsvp.attendance"
                class="w-full px-4 py-3 bg-[#180e0a] border border-[#dfb15b]/40 rounded-xl text-white focus:outline-none focus:border-[#dfb15b] text-sm"
              >
                <option value="hadir">Presida Rawuh (Hadir)</option>
                <option value="tidak_hadir">Nenten Presida Rawuh (Tidak Hadir)</option>
                <option value="ragu">Durung Pasti (Belum Pasti)</option>
              </select>
            </div>

            <div v-if="rsvp.attendance === 'hadir'">
              <label class="block text-xs uppercase tracking-wider text-[#dfb15b] font-bold mb-2">Akeh Undangan sane Rawuh</label>
              <input
                v-model.number="rsvp.totalGuests"
                type="number"
                min="1"
                max="10"
                class="w-full px-4 py-3 bg-[#180e0a] border border-[#dfb15b]/40 rounded-xl text-white focus:outline-none focus:border-[#dfb15b] text-sm"
              />
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#dfb15b] font-bold mb-2">Atur Doa Restu &amp; Pangrastiti</label>
              <textarea
                v-model="rsvp.message"
                rows="4"
                required
                placeholder="Tulis atur doa restu majeng ring sang kalih..."
                class="w-full px-4 py-3 bg-[#180e0a] border border-[#dfb15b]/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#dfb15b] text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submittingRsvp"
              class="w-full py-4 bg-gradient-to-r from-[#b8860b] via-[#dfb15b] to-[#b8860b] text-[#180e0a] font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(223,177,91,0.4)] text-xs uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-50 cursor-pointer"
            >
              <span v-if="submittingRsvp">Ngirimang Atur Doa...</span>
              <span v-else>Kirim Konfirmasi &amp; Doa</span>
            </button>
          </form>

          <!-- List of Wishes -->
          <div v-if="guestMessages.length" class="space-y-4 text-left max-h-96 overflow-y-auto no-scrollbar">
            <div
              v-for="(msg, idx) in guestMessages"
              :key="idx"
              class="p-5 border border-[#dfb15b]/25 bg-[#2c1810]/70 rounded-2xl space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-[#fffdfa] text-sm">{{ msg.name }}</span>
                <span
                  class="text-[9px] px-2.5 py-0.5 rounded-full font-sans uppercase font-bold"
                  :class="msg.attendance === 'hadir' ? 'bg-[#dfb15b]/20 text-[#f7e5aa]' : 'bg-stone-800 text-stone-400'"
                >
                  {{ msg.attendance === 'hadir' ? 'Presida Rawuh' : 'Nenten Presida' }}
                </span>
              </div>
              <p class="text-xs text-[#d5ba99] font-sans leading-relaxed">"{{ msg.message }}"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- TURUT MENGUNDANG & PARAMA SANTIH (FOOTER) -->
      <footer class="py-24 md:py-32 bg-[#120a07] text-center border-t border-[#dfb15b]/30 relative overflow-hidden">
        <!-- Turut Ngaturang Piuning (Extended Family) -->
        <div v-if="normalizedExtendedFamily.length" class="max-w-2xl mx-auto px-6 mb-16 space-y-6">
          <p class="text-xs uppercase tracking-[0.35em] text-[#dfb15b] font-sans font-bold">Turut Ngaturang Piuning</p>
          <div class="flex flex-wrap justify-center gap-2.5 font-sans">
            <span
              v-for="(fam, idx) in normalizedExtendedFamily"
              :key="idx"
              class="px-4 py-2 bg-[#2c1810] border border-[#dfb15b]/30 rounded-full text-xs text-[#d5ba99]"
            >
              {{ fam }}
            </span>
          </div>
        </div>

        <div class="relative z-10 px-6 space-y-6">
          <!-- Balinese Omkara Seal -->
          <div class="flex justify-center text-[#dfb15b]">
            <div class="w-14 h-14 rounded-full border border-[#dfb15b]/50 flex items-center justify-center bg-[#2c1810]">
              <span class="text-2xl font-serif text-[#f7e5aa]">ॐ</span>
            </div>
          </div>

          <div class="space-y-2">
            <p class="font-serif italic text-[#dfb15b] text-lg md:text-xl">Matur Suksma</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fffdfa]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
            <p class="text-sm md:text-base font-serif text-[#dfb15b] tracking-widest mt-2">
              Om Shanti, Shanti, Shanti, Om
            </p>
          </div>

          <p v-if="data.footerText" class="text-[#d5ba99]/85 text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            {{ data.footerText }}
          </p>

          <div class="w-16 h-px bg-[#dfb15b]/40 mx-auto my-6"></div>
          <WatermarkBadge variant="gold" />
        </div>
      </footer>
    </div>

    <!-- Reusable SVG Linear Gradient Definitions -->
    <svg width="0" height="0" class="absolute">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f7e5aa" />
          <stop offset="50%" stop-color="#dfb15b" />
          <stop offset="100%" stop-color="#b8860b" />
        </linearGradient>
      </defs>
    </svg>
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
    title: 'Patepuk Ring Sujana',
    date: '2021',
    description: 'Kacunduk ring swagina tur nyihnayang rasa asih sane suci kadasarin manah sane tulus.',
  },
  {
    title: 'Ngiket Janji Pasobayan',
    date: '2024',
    description: 'Nyatuang kreti kalih kulawarga ageng nyujur pawiwahan yadnya sane ngulangunin.',
  },
]

// Navigation Bar
const navItems = computed(() => {
  const list = [
    { id: 'home', label: 'Bebuka', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-check' },
  ]
  if (isSectionEnabled('love-story')) list.push({ id: 'story', label: 'Carita', icon: 'fa-solid fa-book-open' })
  if (isSectionEnabled('gallery')) list.push({ id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' })
  if (isSectionEnabled('gift')) list.push({ id: 'gift', label: 'Punia', icon: 'fa-solid fa-gift' })
  if (isSectionEnabled('rsvp')) list.push({ id: 'rsvp', label: 'Restu', icon: 'fa-solid fa-envelope' })
  return list
})

// Countdown Timer (Dina, Jam, Menit, Detik)
const countdown = ref({ Dina: '00', Jam: '00', Menit: '00', Detik: '00' })
let timerInterval = null

function updateCountdown() {
  const targetDateStr = data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
  if (!targetDateStr) return
  const target = new Date(targetDateStr).getTime()
  const now = new Date().getTime()
  const diff = target - now
  if (diff <= 0) {
    countdown.value = { Dina: '00', Jam: '00', Menit: '00', Detik: '00' }
    return
  }
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  countdown.value = {
    Dina: String(d).padStart(2, '0'),
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

function copyToClipboard(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Kasil kasalin ring papan klip!')
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
    toast.success('Matur suksma, konfirmasi lan doa sampun katampi!')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Nenten prasida ngirim konfirmasi, wenten kaiwangan.')
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
