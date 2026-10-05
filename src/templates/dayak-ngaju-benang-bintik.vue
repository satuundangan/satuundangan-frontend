<template>
  <div class="relative min-h-screen bg-[#17120e] overflow-hidden font-serif no-scrollbar text-[#f7f2ea] selection:bg-[#d4973b]/30 selection:text-[#f3e5ab]">

    <!-- Borneo Bark Cloth & Forest Texture Overlay -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

    <!-- Geometric Benang Bintik Dot-and-Line Pattern -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15"
      style="background-image: radial-gradient(circle, #d4973b 1px, transparent 1.5px), repeating-linear-gradient(45deg, transparent 0 16px, #9b332b 16px 17px, transparent 17px 34px); background-size: 34px 34px;"
    ></div>

    <!-- Batang Garing (Pohon Kehidupan) Silhouette Watermark Backdrop -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[750px] pointer-events-none opacity-[0.04] z-0 select-none text-[#d4973b]">
      <svg viewBox="0 0 100 160" fill="currentColor" class="w-full h-full">
        <path d="M50 0 C45 30, 20 60, 5 90 C15 90, 35 70, 50 50 C65 70, 85 90, 95 90 C80 60, 55 30, 50 0 Z" />
        <path d="M48 50 L52 50 L52 160 L48 160 Z" />
        <path d="M50 80 Q20 100 10 130 Q40 120 50 100 Q60 120 90 130 Q80 100 50 80 Z" />
      </svg>
    </div>

    <!-- Dayak Talawang / Ukir Tingang Corner Accents (Embedded SVG) -->
    <div class="fixed top-0 left-0 w-28 h-28 md:w-44 md:h-44 z-10 opacity-75 pointer-events-none text-[#d4973b]">
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M0,0 Q60,10 60,60 Q10,60 0,0" fill="#9b332b" fill-opacity="0.2" />
        <path d="M10,0 Q60,30 30,70 Q0,30 10,0" stroke="#d4973b" stroke-width="1.5" />
        <circle cx="36" cy="36" r="4" fill="#f7f2ea" />
        <circle cx="60" cy="60" r="3" fill="#d4973b" />
      </svg>
    </div>
    <div class="fixed bottom-0 right-0 w-28 h-28 md:w-44 md:h-44 z-10 opacity-75 pointer-events-none text-[#d4973b] rotate-180">
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M0,0 Q60,10 60,60 Q10,60 0,0" fill="#9b332b" fill-opacity="0.2" />
        <path d="M10,0 Q60,30 30,70 Q0,30 10,0" stroke="#d4973b" stroke-width="1.5" />
        <circle cx="36" cy="36" r="4" fill="#f7f2ea" />
        <circle cx="60" cy="60" r="3" fill="#d4973b" />
      </svg>
    </div>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#241711"
      accentColor="#d4973b"
      :autoPlay="!showWelcome"
    />

    <!-- Floating Bottom Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#241711]/90 backdrop-blur-xl border border-[#d4973b]/40 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.7)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#f5ca82] scale-105' : 'text-[#a89585] hover:text-[#f5ca82]'"
        >
          <i :class="[item.icon, 'text-base md:text-lg']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-sans">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#d4973b] transition-all"
            :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen (Dayak Ngaju / Batang Garing Blessing) -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#2e1913] via-[#17120e] to-[#0d0a08] transition-all duration-1000"
      >
        <!-- Golden Frame Border -->
        <div class="absolute inset-4 md:inset-8 border border-[#d4973b]/35 rounded-3xl pointer-events-none">
          <div class="absolute inset-1.5 border border-[#9b332b]/30 rounded-[22px]"></div>
        </div>

        <div class="relative z-10 space-y-6 md:space-y-8 animate-fade-in-up max-w-lg mx-auto py-8">
          <!-- Batang Garing Emblem -->
          <div class="flex justify-center text-[#d4973b] opacity-90 animate-pulse">
            <svg class="w-14 h-16 md:w-16 md:h-20" viewBox="0 0 100 140" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M50 10 C45 35, 20 60, 10 85 C25 85, 40 70, 50 50 C60 70, 75 85, 90 85 C80 60, 55 35, 50 10 Z" fill="currentColor" fill-opacity="0.15" />
              <path d="M50 50 L50 135" stroke-width="2.5" />
              <circle cx="50" cy="50" r="5" fill="#9b332b" stroke="currentColor" />
              <circle cx="28" cy="85" r="3.5" fill="#d4973b" />
              <circle cx="72" cy="85" r="3.5" fill="#d4973b" />
            </svg>
          </div>

          <div class="space-y-2">
            <p class="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#d4973b] font-bold">
              Surat Sarumpah Pesta Tiwah Panganten
            </p>
            <h1 class="text-4xl md:text-6xl font-serif text-[#fbf8ee] drop-shadow-[0_2px_12px_rgba(212,151,59,0.35)] leading-tight">
              {{ data.groomName?.split(' ')[0] || data.groomName }}
              <span class="text-2xl md:text-3xl font-serif text-[#d4973b] block my-1">&amp;</span>
              {{ data.brideName?.split(' ')[0] || data.brideName }}
            </h1>
            <p class="text-xs text-[#d6b094] uppercase tracking-widest font-sans">Adat Dayak Ngaju · Kalimantan Tengah</p>
          </div>

          <!-- Guest Badge Card -->
          <div class="my-6 p-5 md:p-6 border border-[#d4973b]/30 bg-[#261711]/80 backdrop-blur-md rounded-2xl max-w-xs mx-auto shadow-xl space-y-2">
            <p class="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d4973b]/90 font-medium">
              Kahadap Pahari &amp; Tambi Bue
            </p>
            <p class="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
            <p class="text-[10px] font-sans text-[#b8a294] italic">
              Keleh saling mangarti amun tege sala panyurat ara
            </p>
          </div>

          <button
            @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#9b332b] via-[#d4973b] to-[#9b332b] hover:brightness-110 text-[#fbf8ee] font-bold rounded-full transition-all shadow-[0_4px_25px_rgba(212,151,59,0.4)] text-xs uppercase tracking-[0.2em]"
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
      <!-- HERO SECTION -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-24 bg-gradient-to-b from-[#241510] via-[#17120e] to-[#17120e]">
        <div class="space-y-6 max-w-3xl mx-auto relative z-10" v-observe>
          <div class="flex items-center justify-center gap-4 text-[#d4973b]">
            <span class="w-12 h-px bg-[#d4973b]/50"></span>
            <span class="text-[10px] uppercase tracking-[0.4em] font-sans font-bold">Pesta Penganten Adat</span>
            <span class="w-12 h-px bg-[#d4973b]/50"></span>
          </div>

          <!-- Couple Main Photo -->
          <div v-if="data.photoCoupleUrl" class="relative inline-block my-4">
            <div class="w-48 h-64 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d4973b] p-1.5 shadow-[0_0_30px_rgba(212,151,59,0.25)] overflow-hidden bg-[#241711]">
              <img :src="data.photoCoupleUrl" alt="Foto Pengantin" class="w-full h-full object-cover rounded-t-full" />
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#17120e] border border-[#d4973b] px-4 py-0.5 rounded-full text-[10px] text-[#d4973b] font-sans uppercase tracking-widest whitespace-nowrap">
              Sang Penganten
            </div>
          </div>

          <h1 class="text-5xl md:text-8xl font-serif text-[#fbf8ee] leading-tight">
            {{ data.groomName }} <br />
            <span class="text-3xl md:text-5xl text-[#d4973b] italic my-2 inline-block font-serif">&amp;</span> <br />
            {{ data.brideName }}
          </h1>

          <p class="text-base md:text-xl text-[#e5b567] tracking-[0.25em] uppercase font-sans font-medium">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="grid grid-cols-4 gap-3 md:gap-6 mt-12 max-w-sm mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 md:p-4 border border-[#d4973b]/30 rounded-2xl bg-[#241711]/80 backdrop-blur-sm shadow-md"
            >
              <div class="text-2xl md:text-3xl font-serif font-bold text-[#fbf8ee]">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-wider text-[#d4973b] font-sans mt-1 font-semibold">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 animate-bounce text-[#d4973b]/60">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- QUOTE DAYAK NGAJU / DOA SEMESTA -->
      <section v-if="isSectionEnabled('quote')" class="py-24 px-6 bg-[#1f1510] relative text-center border-y border-[#d4973b]/20" v-observe>
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="flex justify-center text-[#d4973b] opacity-80">
            <i class="fa-solid fa-tree text-2xl"></i>
          </div>
          <p class="font-serif text-lg md:text-2xl text-[#f3e7dc] italic leading-relaxed px-4">
            "{{ data.quoteText || 'Adil Ka\' Talino, Bacuramin Ka\' Saruga, Basengat Ka\' Jubata. Mugi kahidupan sang penganten dados berkat sarupa Batang Garing sane rindang mangalindung.' }}"
          </p>
          <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
          <p class="text-xs font-sans font-bold text-[#d4973b] tracking-[0.3em] uppercase">
            {{ data.quoteSource || 'Pemberkatan Adat Dayak' }}
          </p>
        </div>
      </section>

      <!-- KEDUA MEMPELAI -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="py-24 md:py-32 px-6 bg-[#17120e]" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-16">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4973b] font-sans font-bold">Keluarga Penganten</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Kedua Mempelai</h2>
            <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-16 md:gap-12 items-center">
            <!-- Groom -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d4973b] p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] bg-[#241711] overflow-hidden">
                  <img
                    :src="data.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'"
                    alt="Mempelai Pria"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">{{ data.groomName }}</h3>
                <p v-if="data.parents?.groomParents" class="text-xs text-[#b8a294] max-w-xs mx-auto leading-relaxed">
                  Anak hatue bara amanta <br />
                  <strong class="text-[#f7f2ea]">{{ data.parents.groomParents }}</strong>
                </p>
                <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaGroom.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#d4973b] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Bride -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#d4973b] p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] bg-[#241711] overflow-hidden">
                  <img
                    :src="data.bridePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'"
                    alt="Mempelai Wanita"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">{{ data.brideName }}</h3>
                <p v-if="data.parents?.brideParents" class="text-xs text-[#b8a294] max-w-xs mx-auto leading-relaxed">
                  Anak bawi bara amanta <br />
                  <strong class="text-[#f7f2ea]">{{ data.parents.brideParents }}</strong>
                </p>
                <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaBrides.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#d4973b] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RANGKAIAN ACARA (AKAD/PEMBERKATAN & RESEPSI ADAT) -->
      <section v-if="isSectionEnabled('event')" id="event" class="py-24 md:py-32 px-6 bg-[#1f1510] relative" v-observe>
        <div class="max-w-4xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4973b] font-sans font-bold">Jadwal Acara</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Pesta Panganten</h2>
            <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
          </div>

          <div class="grid md:grid-cols-2 gap-8 items-stretch">
            <!-- Akad / Pemberkatan -->
            <div
              v-if="data.akadLocation"
              class="p-8 border border-[#d4973b]/35 rounded-3xl bg-[#241711]/80 backdrop-blur-sm space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#d4973b] text-[#d4973b]">
                  <i class="fa-solid fa-ring text-lg"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">Akad / Pemberkatan</h3>
                <div class="w-12 h-px bg-[#d4973b]/40 mx-auto"></div>
                <p class="text-base text-[#f5ca82] font-sans font-bold">
                  {{ formatDate(data.akadLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#b8a294] font-sans">
                  {{ formatTime(data.akadLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#f7f2ea] leading-relaxed pt-2">
                  {{ data.akadLocation.description }}
                </p>
              </div>

              <div class="pt-6">
                <a
                  v-if="data.akadLocation.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4973b] text-[#d4973b] hover:bg-[#d4973b] hover:text-[#17120e] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
              </div>
            </div>

            <!-- Resepsi / Pesta Adat -->
            <div
              v-if="data.resepsiLocation"
              class="p-8 border border-[#d4973b]/35 rounded-3xl bg-[#241711]/80 backdrop-blur-sm space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#d4973b] text-[#d4973b]">
                  <i class="fa-solid fa-champagne-glasses text-lg"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf8ee]">Pesta Adat Dayak</h3>
                <div class="w-12 h-px bg-[#d4973b]/40 mx-auto"></div>
                <p class="text-base text-[#f5ca82] font-sans font-bold">
                  {{ formatDate(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#b8a294] font-sans">
                  {{ formatTime(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#f7f2ea] leading-relaxed pt-2">
                  {{ data.resepsiLocation.description }}
                </p>
              </div>

              <div class="pt-6">
                <a
                  v-if="data.resepsiLocation.mapUrl"
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d4973b] text-[#d4973b] hover:bg-[#d4973b] hover:text-[#17120e] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DRESS CODE / TATA BUSANA -->
      <section v-if="isSectionEnabled('dress-code') && data.dressCode" class="py-16 px-6 bg-[#1a130f] border-t border-[#d4973b]/20 text-center" v-observe>
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#d4973b]/25 rounded-2xl bg-[#241711]/60">
          <div class="text-[#d4973b]"><i class="fa-solid fa-shirt text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#fbf8ee]">Pakaian / Dress Code</h3>
          <p class="text-xs md:text-sm text-[#f7f2ea] leading-relaxed font-sans">
            {{ data.dressCode }}
          </p>
        </div>
      </section>

      <!-- LIVE STREAMING -->
      <section
        v-if="isSectionEnabled('live-streaming') && (data.liveStreamingLink || data.liveStreamingUrl)"
        class="py-16 px-6 bg-[#1a130f] text-center"
        v-observe
      >
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#d4973b]/25 rounded-2xl bg-[#241711]/60">
          <div class="text-[#d4973b]"><i class="fa-solid fa-video text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#fbf8ee]">Siaran Langsung</h3>
          <p class="text-xs text-[#b8a294] leading-relaxed font-sans">
            Mangapala pahari handak manonton bara kejauhan
          </p>
          <a
            :href="data.liveStreamingLink || data.liveStreamingUrl"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d4973b] text-[#17120e] rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110"
          >
            <i class="fa-brands fa-youtube"></i> Tonton Live
          </a>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 md:py-32 px-6 bg-[#1f1510]" v-observe>
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4973b] font-sans font-bold">Kisah Kami</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Perjalanan Kasih</h2>
            <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
          </div>

          <div class="space-y-12 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-[#d4973b]/30 hidden md:block">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="idx"
              class="relative flex items-center justify-between"
              v-observe
            >
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                <div class="p-6 rounded-2xl border border-[#d4973b]/30 bg-[#241711]/80 space-y-2">
                  <span class="text-xs text-[#d4973b] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
                  <h3 class="text-xl font-serif text-[#fbf8ee]">{{ story.title }}</h3>
                  <p class="text-xs text-[#b8a294] leading-relaxed font-sans">{{ story.description }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4973b] border-4 border-[#1f1510] z-10"></div>
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                <img
                  v-if="story.image || isPreviewMode"
                  :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                  class="rounded-2xl shadow-lg border border-[#d4973b]/30 aspect-video object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Mobile Story List -->
          <div class="md:hidden space-y-8">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="'m-' + idx"
              class="p-6 rounded-2xl border border-[#d4973b]/30 bg-[#241711]/80 space-y-3"
            >
              <img
                v-if="story.image || isPreviewMode"
                :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                class="rounded-xl shadow-md border border-[#d4973b]/30 aspect-video object-cover w-full mb-3"
              />
              <span class="text-[10px] text-[#d4973b] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
              <h3 class="text-lg font-serif text-[#fbf8ee]">{{ story.title }}</h3>
              <p class="text-xs text-[#b8a294] leading-relaxed font-sans">{{ story.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="isSectionEnabled('video') && data.videoPrewedding" class="py-24 px-6 bg-[#17120e]" v-observe>
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4973b] font-sans font-bold">Sinematik</p>
            <h2 class="text-4xl md:text-5xl font-serif text-[#fbf8ee]">Video Prewedding</h2>
            <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
          </div>
          <div class="aspect-video w-full rounded-2xl overflow-hidden border border-[#d4973b]/40 shadow-2xl">
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
      <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="py-24 md:py-32 px-6 bg-[#1f1510]" v-observe>
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4973b] font-sans font-bold">Galeri Foto</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Momen Bahagia</h2>
            <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
          </div>

          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- TURUT MENGUNDANG -->
      <section
        v-if="isSectionEnabled('extended-family') && (data.extendedFamily?.length || data.turutMengundang)"
        class="py-20 px-6 bg-[#1a130f] border-t border-[#d4973b]/20 text-center"
        v-observe
      >
        <div class="max-w-2xl mx-auto space-y-6">
          <h3 class="text-2xl font-serif text-[#fbf8ee]">Turut Mengundang</h3>
          <div class="w-12 h-px bg-[#d4973b] mx-auto"></div>
          <div class="space-y-2 text-sm text-[#f7f2ea] font-sans">
            <p v-for="(person, idx) in normalizedExtendedFamily" :key="idx" class="leading-relaxed">
              {{ person }}
            </p>
          </div>
        </div>
      </section>

      <!-- TANDA KASIH / HADIAH PERNIKAHAN -->
      <section
        v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || walletItems.length || giftAddresses.length)"
        id="gift"
        class="py-24 md:py-32 px-6 bg-[#17120e] text-center"
        v-observe
      >
        <div class="max-w-4xl mx-auto space-y-12">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4973b] font-sans font-bold">Tanda Kasih</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Kado Pernikahan</h2>
            <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
            <p class="text-sm text-[#b8a294] max-w-lg mx-auto font-sans leading-relaxed">
              Doa restu pahari handak manjadi kado paling aji mangapala keluarga kami.
            </p>
          </div>

          <!-- Bank & Wallet Cards -->
          <div class="flex flex-wrap justify-center gap-6">
            <div
              v-for="(bank, idx) in data.bankAccounts"
              :key="'bank-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d4973b]/40 bg-[#241711]/90 space-y-3 shadow-lg"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#d4973b] uppercase font-sans tracking-widest">
                <img v-if="bank.bankLogo" :src="bank.bankLogo" :alt="bank.bankName" class="h-8 max-w-[120px] object-contain" />
                <span v-else>{{ bank.bankName }}</span>
              </div>
              <p class="text-xl font-mono text-white font-bold tracking-wider">{{ bank.accountNumber }}</p>
              <p class="text-xs text-[#b8a294] font-sans">a.n {{ bank.accountName }}</p>
              <button
                @click="copyToClipboard(bank.accountNumber)"
                class="w-full py-2 bg-transparent border border-[#d4973b]/60 hover:bg-[#d4973b] text-[#d4973b] hover:text-[#17120e] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Rekening
              </button>
            </div>

            <div
              v-for="(wallet, idx) in walletItems"
              :key="'wallet-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#d4973b]/40 bg-[#241711]/90 space-y-3 shadow-lg"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#d4973b] uppercase font-sans tracking-widest">
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
                class="w-full py-2 bg-transparent border border-[#d4973b]/60 hover:bg-[#d4973b] text-[#d4973b] hover:text-[#17120e] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Nomer
              </button>
            </div>
          </div>

          <!-- Physical Gift Address -->
          <div v-if="giftAddresses.length" class="max-w-xl mx-auto space-y-4 pt-6">
            <h4 class="text-lg font-serif text-[#d4973b]">Kirim Kado Fisik</h4>
            <div
              v-for="(addr, idx) in giftAddresses"
              :key="'addr-' + idx"
              class="p-6 border border-[#d4973b]/30 rounded-2xl bg-[#241711]/80 text-left space-y-3"
            >
              <p class="text-xs text-[#f7f2ea] leading-relaxed whitespace-pre-line font-sans">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="text-xs text-[#d4973b] border border-[#d4973b]/60 px-4 py-1.5 rounded-full hover:bg-[#d4973b] hover:text-[#17120e] font-sans font-bold uppercase tracking-wider"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Alamat
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP & UCAPAN -->
      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="py-24 md:py-32 px-6 bg-[#1f1510] relative" v-observe>
        <div class="max-w-2xl mx-auto space-y-12">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#d4973b] font-sans font-bold">Kehadiran Tamu</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">Konfirmasi &amp; Doa</h2>
            <div class="w-16 h-px bg-[#d4973b] mx-auto"></div>
          </div>

          <div class="p-8 border border-[#d4973b]/35 rounded-3xl bg-[#241711]/90 shadow-2xl space-y-6">
            <form @submit.prevent="submitRsvp" class="space-y-4">
              <div>
                <label class="block text-xs uppercase font-sans text-[#d4973b] tracking-wider mb-2 font-bold">Nama Tamu</label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Ketik nama Anda..."
                  class="w-full bg-[#17120e] border border-[#d4973b]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4973b]"
                />
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#d4973b] tracking-wider mb-2 font-bold">Kehadiran</label>
                <select
                  v-model="rsvp.attendance"
                  class="w-full bg-[#17120e] border border-[#d4973b]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4973b]"
                >
                  <option value="hadir">Bisa Hadir</option>
                  <option value="tidak">Tidak Bisa Hadir</option>
                  <option value="ragu">Masih Ragu-ragu</option>
                </select>
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block text-xs uppercase font-sans text-[#d4973b] tracking-wider mb-2 font-bold">Jumlah Tamu</label>
                <select
                  v-model="rsvp.totalGuests"
                  class="w-full bg-[#17120e] border border-[#d4973b]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4973b]"
                >
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
                </select>
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#d4973b] tracking-wider mb-2 font-bold">Doa Restu / Ucapan</label>
                <textarea
                  v-model="rsvp.message"
                  rows="4"
                  placeholder="Tulis ucapan dan doa restu..."
                  class="w-full bg-[#17120e] border border-[#d4973b]/40 rounded-xl px-4 py-3 text-[#fbf8ee] text-sm focus:outline-none focus:border-[#d4973b]"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-3.5 bg-gradient-to-r from-[#9b332b] via-[#d4973b] to-[#9b332b] text-[#fbf8ee] font-bold rounded-xl shadow-lg transition-all hover:brightness-110 text-xs uppercase tracking-widest"
              >
                {{ submittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi & Doa' }}
              </button>
            </form>
          </div>

          <!-- Messages List -->
          <div v-if="guestMessages.length" class="space-y-4 max-h-96 overflow-y-auto no-scrollbar pr-1">
            <div
              v-for="(msg, idx) in guestMessages"
              :key="'msg-' + idx"
              class="p-5 border border-[#d4973b]/20 rounded-2xl bg-[#241711]/60 space-y-2 text-left"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-[#fbf8ee] text-base">{{ msg.name }}</span>
                <span
                  class="text-[9px] px-2 py-0.5 rounded-full font-sans uppercase font-bold"
                  :class="msg.attendance === 'hadir' ? 'bg-[#d4973b]/20 text-[#f5ca82]' : 'bg-gray-800 text-gray-400'"
                >
                  {{ msg.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir' }}
                </span>
              </div>
              <p class="text-xs text-[#d6c7be] font-sans leading-relaxed">"{{ msg.message }}"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-20 md:py-28 bg-[#0d0a08] text-center border-t border-[#d4973b]/25 relative overflow-hidden">
        <div class="relative z-10 px-6 space-y-4">
          <!-- Batang Garing Mini Emblem -->
          <div class="flex justify-center text-[#d4973b] opacity-60">
            <svg class="w-8 h-10" viewBox="0 0 100 140" fill="currentColor">
              <path d="M50 10 C45 35, 20 60, 10 85 C25 85, 40 70, 50 50 C60 70, 75 85, 90 85 C80 60, 55 35, 50 10 Z" />
            </svg>
          </div>
          <p class="font-serif italic text-[#d4973b]/80 text-base md:text-lg">Tarima Kasih</p>
          <h2 class="text-4xl md:text-6xl font-serif text-[#fbf8ee]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
          <p v-if="data.footerText" class="text-[#b8a294] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            {{ data.footerText }}
          </p>
          <div class="w-16 h-px bg-[#d4973b]/30 mx-auto my-6"></div>
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
    return data.value.galleryImages
  }
  return []
})

const mockStories = [
  {
    title: 'Tampekan Parjolo',
    date: '2022',
    description: 'Bara pambukaan jalan manuju katresnan sane tulus di tanah Dayak Ngaju Kalimantan.',
  },
  {
    title: 'Janji Kasih Batang Garing',
    date: '2025',
    description: 'Keluarga mandukung bulat tekad manuju pesta nikah adat sane dipenuhi doa restu leluhur.',
  },
]

const navItems = computed(() => {
  const list = [
    { id: 'home', label: 'Bebuka', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Penganten', icon: 'fa-solid fa-heart' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-check' },
  ]
  if (isSectionEnabled('love-story')) list.push({ id: 'story', label: 'Kisah', icon: 'fa-solid fa-book-open' })
  if (isSectionEnabled('gallery')) list.push({ id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' })
  if (isSectionEnabled('gift')) list.push({ id: 'gift', label: 'Kado', icon: 'fa-solid fa-gift' })
  if (isSectionEnabled('rsvp')) list.push({ id: 'rsvp', label: 'Kehadiran', icon: 'fa-solid fa-envelope' })
  return list
})

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
    toast.success('Kasil disalin ing papan klip!')
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
    toast.success('Terima kasih, konfirmasi doa sampun tersimpan!')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Maaf, ada kendala saat mengirim konfirmasi.')
  } finally {
    submittingRsvp.value = false
  }
}

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
