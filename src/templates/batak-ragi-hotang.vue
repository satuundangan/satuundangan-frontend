<template>
  <div class="relative min-h-screen bg-[#14080a] overflow-hidden font-serif no-scrollbar text-[#f7eee9] selection:bg-[#a82b3a]/30 selection:text-[#f3e5ab]">

    <!-- Ulos Weave & Black Paper Texture Overlay -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

    <!-- Geometric Tenun Ulos Line Grid -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-15"
      style="background-image: repeating-linear-gradient(45deg, transparent 0 14px, #c8963e 14px 15px, transparent 15px 30px), repeating-linear-gradient(-45deg, transparent 0 14px, #7c2432 14px 15px, transparent 15px 30px); background-size: 30px 30px;"
    ></div>

    <!-- Rumah Bolon Silhouette Watermark Backdrop -->
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] pointer-events-none opacity-[0.035] z-0 select-none text-[#c8963e]">
      <svg viewBox="0 0 200 120" fill="currentColor" class="w-full h-full">
        <path d="M10 80 Q100 20 190 80 L180 110 L20 110 Z" />
        <path d="M20 75 Q100 25 180 75 L100 15 Z" opacity="0.6" />
      </svg>
    </div>

    <!-- Batak Toba Gorga Corner Accents -->
    <div class="fixed top-0 left-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-75 pointer-events-none select-none">
      <img :src="cornerImg" alt="Corner Ornament" class="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(200,150,62,0.3)]" />
    </div>
    <div class="fixed bottom-0 right-0 w-24 h-24 md:w-36 md:h-36 z-10 opacity-75 pointer-events-none select-none rotate-180">
      <img :src="cornerImg" alt="Corner Ornament" class="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(200,150,62,0.3)]" />
    </div>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#381016"
      accentColor="#c8963e"
      :autoPlay="!showWelcome"
    />

    <!-- Floating Bottom Navigation -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#240d12]/90 backdrop-blur-xl border border-[#c8963e]/40 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.7)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#f0cb82] scale-105' : 'text-[#b59188] hover:text-[#f0cb82]'"
        >
          <i :class="[item.icon, 'text-base md:text-lg']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-sans">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c8963e] transition-all"
            :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen (Gokhon Dohot Jou-jou / Pesta Unjuk) -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#2e0b11] via-[#14080a] to-[#0a0405] transition-all duration-1000"
      >
        <!-- Border Frame Gorga Batak -->
        <div class="absolute inset-4 md:inset-8 border border-[#c8963e]/35 rounded-3xl pointer-events-none">
          <div class="absolute inset-1.5 border border-[#a82b3a]/30 rounded-[22px]"></div>
        </div>

        <div class="relative z-10 space-y-6 md:space-y-8 animate-fade-in-up max-w-lg mx-auto py-8">
          <!-- Gorga Batak Crest Emblem -->
          <div class="flex justify-center max-w-xs mx-auto">
            <img :src="gorgaImg" alt="Gorga Batak Toba" class="w-full h-auto object-contain filter drop-shadow-[0_4px_16px_rgba(200,150,62,0.4)]" />
          </div>

          <div class="space-y-2">
            <p class="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#c8963e] font-bold">
              Gokhon Dohot Jou-Jou
            </p>
            <h1 class="text-4xl md:text-6xl font-serif text-[#fbf6ea] drop-shadow-[0_2px_12px_rgba(200,150,62,0.35)] leading-tight">
              {{ data.groomName?.split(' ')[0] || data.groomName }}
              <span class="text-2xl md:text-3xl font-serif text-[#c8963e] block my-1">&amp;</span>
              {{ data.brideName?.split(' ')[0] || data.brideName }}
            </h1>
            <p class="text-xs text-[#d6a596] uppercase tracking-widest font-sans">Pesta Unjuk &amp; Pamasumasuon</p>
          </div>

          <!-- Guest Badge Card -->
          <div class="my-6 p-5 md:p-6 border border-[#c8963e]/30 bg-[#290d13]/70 backdrop-blur-md rounded-2xl max-w-xs mx-auto shadow-xl space-y-2">
            <p class="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c8963e]/90 font-medium">
              Tumpak Tu Napinarsangapan
            </p>
            <p class="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
            <p class="text-[10px] font-sans text-[#cbb2aa] italic">
              Santabi molo adong sala panggoraon goar/marga
            </p>
          </div>

          <button
            @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#9b2a38] via-[#c8963e] to-[#9b2a38] hover:brightness-110 text-[#fbf6ea] font-bold rounded-full transition-all shadow-[0_4px_25px_rgba(200,150,62,0.4)] text-xs uppercase tracking-[0.2em]"
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
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-24 bg-gradient-to-b from-[#24080e] via-[#14080a] to-[#14080a]">
        <div class="space-y-6 max-w-3xl mx-auto relative z-10" v-observe>
          <div class="flex items-center justify-center gap-4 text-[#c8963e]">
            <span class="w-12 h-px bg-[#c8963e]/50"></span>
            <span class="text-[10px] uppercase tracking-[0.4em] font-sans font-bold">Horas Jala Gabe</span>
            <span class="w-12 h-px bg-[#c8963e]/50"></span>
          </div>

          <!-- Couple Main Photo -->
          <div v-if="data.photoCoupleUrl" class="relative inline-block my-4">
            <div class="w-48 h-64 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#c8963e] p-1.5 shadow-[0_0_30px_rgba(200,150,62,0.25)] overflow-hidden bg-[#260a10]">
              <img :src="data.photoCoupleUrl" alt="Foto Pengantin" class="w-full h-full object-cover rounded-t-full" />
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#14080a] border border-[#c8963e] px-4 py-0.5 rounded-full text-[10px] text-[#c8963e] font-sans uppercase tracking-widest whitespace-nowrap">
              Oroan &amp; Pangoli
            </div>
          </div>

          <h1 class="text-5xl md:text-8xl font-serif text-[#fbf6ea] leading-tight">
            {{ data.groomName }} <br />
            <span class="text-3xl md:text-5xl text-[#c8963e] italic my-2 inline-block font-serif">&amp;</span> <br />
            {{ data.brideName }}
          </h1>

          <p class="text-base md:text-xl text-[#e5b86b] tracking-[0.25em] uppercase font-sans font-medium">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="grid grid-cols-4 gap-3 md:gap-6 mt-12 max-w-sm mx-auto">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="p-3 md:p-4 border border-[#c8963e]/30 rounded-2xl bg-[#260a10]/80 backdrop-blur-sm shadow-md"
            >
              <div class="text-2xl md:text-3xl font-serif font-bold text-[#fbf6ea]">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-wider text-[#c8963e] font-sans mt-1 font-semibold">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 animate-bounce text-[#c8963e]/60">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- QUOTE / AYAT ALKITAB ATAU DOA ADAT -->
      <section v-if="isSectionEnabled('quote')" class="py-24 px-6 bg-[#1f090e] relative text-center border-y border-[#c8963e]/20" v-observe>
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="flex justify-center text-[#c8963e] opacity-75">
            <i class="fa-solid fa-cross text-2xl"></i>
          </div>
          <p class="font-serif text-lg md:text-2xl text-[#f3e5e0] italic leading-relaxed px-4">
            "{{ data.quoteText || 'Ai songon aek tu aek, songon eme tu duhut, hot ma hamu jala gabe, maranak raris marboru sahat tu saur matua.' }}"
          </p>
          <div class="w-16 h-px bg-[#c8963e] mx-auto"></div>
          <p class="text-xs font-sans font-bold text-[#c8963e] tracking-[0.3em] uppercase">
            {{ data.quoteSource || 'Poda & Pasu-pasu' }}
          </p>
        </div>
      </section>

      <!-- KEDUA MEMPELAI -->
      <section v-if="isSectionEnabled('couple')" id="couple" class="py-24 md:py-32 px-6 bg-[#14080a]" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-16">
          <div class="space-y-4">
            <div class="flex justify-center max-w-sm mx-auto mb-2">
              <img :src="gorgaAuthenticImg" alt="Gorga Batak Toba" class="w-full h-auto object-contain drop-shadow-[0_2px_8px_rgba(200,150,62,0.3)]" />
            </div>
            <p class="text-xs uppercase tracking-[0.3em] text-[#c8963e] font-sans font-bold">Pangoli &amp; Oroan</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf6ea]">Kedua Mempelai</h2>
            <div class="flex justify-center max-w-xs mx-auto">
              <img :src="dividerImg" alt="Divider Emas" class="w-full h-auto object-contain opacity-80" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-16 md:gap-12 items-center">
            <!-- Groom -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#c8963e] p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] bg-[#240d12] overflow-hidden">
                  <img
                    :src="data.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'"
                    alt="Pangoli"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf6ea]">{{ data.groomName }}</h3>
                <p v-if="data.parents?.groomParents" class="text-xs text-[#cbb2aa] max-w-xs mx-auto leading-relaxed">
                  Anak ni amanta nami <br />
                  <strong class="text-[#f7eee9]">{{ data.parents.groomParents }}</strong>
                </p>
                <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaGroom.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#c8963e] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Bride -->
            <div class="space-y-5">
              <div class="relative inline-block">
                <div class="w-52 h-72 md:w-60 md:h-80 mx-auto rounded-t-full border-2 border-[#c8963e] p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] bg-[#240d12] overflow-hidden">
                  <img
                    :src="data.bridePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'"
                    alt="Oroan"
                    class="w-full h-full object-cover rounded-t-full"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf6ea]">{{ data.brideName }}</h3>
                <p v-if="data.parents?.brideParents" class="text-xs text-[#cbb2aa] max-w-xs mx-auto leading-relaxed">
                  Boru ni amanta nami <br />
                  <strong class="text-[#f7eee9]">{{ data.parents.brideParents }}</strong>
                </p>
                <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                  <a
                    :href="'https://instagram.com/' + data.socialMediaBrides.instagram"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-xs text-[#c8963e] hover:underline"
                  >
                    <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RANGKAIAN ACARA (PAMASUMASUON & PESTA UNJUK) -->
      <section v-if="isSectionEnabled('event')" id="event" class="py-24 md:py-32 px-6 bg-[#1f090e] relative" v-observe>
        <div class="max-w-4xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#c8963e] font-sans font-bold">Pesta Adat &amp; Gereja</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf6ea]">Partording Ni Ulaon</h2>
            <div class="flex justify-center max-w-xs mx-auto">
              <img :src="dividerImg" alt="Divider Emas" class="w-full h-auto object-contain opacity-80" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8 items-stretch">
            <!-- Pamasumasuon (Pemberkatan) -->
            <div
              v-if="data.akadLocation"
              class="p-8 border border-[#c8963e]/35 rounded-3xl bg-[#260a10]/80 backdrop-blur-sm space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#c8963e] text-[#c8963e]">
                  <i class="fa-solid fa-church text-lg"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf6ea]">Pamasumasuon (Gereja)</h3>
                <div class="w-12 h-px bg-[#c8963e]/40 mx-auto"></div>
                <p class="text-base text-[#f0cb82] font-sans font-bold">
                  {{ formatDate(data.akadLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#cbb2aa] font-sans">
                  {{ formatTime(data.akadLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#f7eee9] leading-relaxed pt-2">
                  {{ data.akadLocation.description }}
                </p>
              </div>

              <div class="pt-6">
                <a
                  v-if="data.akadLocation.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#c8963e] text-[#c8963e] hover:bg-[#c8963e] hover:text-[#14080a] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
              </div>
            </div>

            <!-- Pesta Unjuk / Adat -->
            <div
              v-if="data.resepsiLocation"
              class="p-8 border border-[#c8963e]/35 rounded-3xl bg-[#260a10]/80 backdrop-blur-sm space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div class="space-y-4">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#c8963e] text-[#c8963e]">
                  <i class="fa-solid fa-people-roof text-lg"></i>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif text-[#fbf6ea]">Pesta Unjuk (Adat)</h3>
                <div class="w-12 h-px bg-[#c8963e]/40 mx-auto"></div>
                <p class="text-base text-[#f0cb82] font-sans font-bold">
                  {{ formatDate(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-xs text-[#cbb2aa] font-sans">
                  {{ formatTime(data.resepsiLocation.dateTime) }}
                </p>
                <p class="text-sm text-[#f7eee9] leading-relaxed pt-2">
                  {{ data.resepsiLocation.description }}
                </p>
              </div>

              <div class="pt-6">
                <a
                  v-if="data.resepsiLocation.mapUrl"
                  :href="data.resepsiLocation.mapUrl"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#c8963e] text-[#c8963e] hover:bg-[#c8963e] hover:text-[#14080a] transition-all text-xs font-sans uppercase tracking-widest font-bold"
                >
                  <i class="fa-solid fa-location-dot"></i> Peta Lokasi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DRESS CODE / TATA BUSANA -->
      <section v-if="isSectionEnabled('dress-code') && data.dressCode" class="py-16 px-6 bg-[#170a0d] border-t border-[#c8963e]/20 text-center" v-observe>
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#c8963e]/25 rounded-2xl bg-[#240d12]/60">
          <div class="text-[#c8963e]"><i class="fa-solid fa-shirt text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#fbf6ea]">Pangkean / Dress Code</h3>
          <p class="text-xs md:text-sm text-[#f7eee9] leading-relaxed font-sans">
            {{ data.dressCode }}
          </p>
        </div>
      </section>

      <!-- LIVE STREAMING -->
      <section
        v-if="isSectionEnabled('live-streaming') && (data.liveStreamingLink || data.liveStreamingUrl)"
        class="py-16 px-6 bg-[#170a0d] text-center"
        v-observe
      >
        <div class="max-w-md mx-auto space-y-4 p-6 border border-[#c8963e]/25 rounded-2xl bg-[#240d12]/60">
          <div class="text-[#c8963e]"><i class="fa-solid fa-video text-2xl"></i></div>
          <h3 class="text-xl font-serif text-[#fbf6ea]">Siaran Langsung</h3>
          <p class="text-xs text-[#cbb2aa] leading-relaxed font-sans">
            Asa maradu marnida ulaon on tu hamu na di parserahan
          </p>
          <a
            :href="data.liveStreamingLink || data.liveStreamingUrl"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c8963e] text-[#14080a] rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110"
          >
            <i class="fa-brands fa-youtube"></i> Tonton Live
          </a>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 md:py-32 px-6 bg-[#1f090e]" v-observe>
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#c8963e] font-sans font-bold">Dalan Ni Holong</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf6ea]">Perjalanan Kasih</h2>
            <div class="w-16 h-px bg-[#c8963e] mx-auto"></div>
          </div>

          <div class="space-y-12 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-[#c8963e]/30 hidden md:block">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="idx"
              class="relative flex items-center justify-between"
              v-observe
            >
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                <div class="p-6 rounded-2xl border border-[#c8963e]/30 bg-[#260a10]/80 space-y-2">
                  <span class="text-xs text-[#c8963e] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
                  <h3 class="text-xl font-serif text-[#fbf6ea]">{{ story.title }}</h3>
                  <p class="text-xs text-[#cbb2aa] leading-relaxed font-sans">{{ story.description }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#c8963e] border-4 border-[#1f090e] z-10"></div>
              <div class="w-[44%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                <img
                  v-if="story.image || isPreviewMode"
                  :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                  class="rounded-2xl shadow-lg border border-[#c8963e]/30 aspect-video object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Mobile Story List -->
          <div class="md:hidden space-y-8">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="'m-' + idx"
              class="p-6 rounded-2xl border border-[#c8963e]/30 bg-[#260a10]/80 space-y-3"
            >
              <img
                v-if="story.image || isPreviewMode"
                :src="story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'"
                class="rounded-xl shadow-md border border-[#c8963e]/30 aspect-video object-cover w-full mb-3"
              />
              <span class="text-[10px] text-[#c8963e] font-sans font-bold tracking-widest uppercase">{{ story.date }}</span>
              <h3 class="text-lg font-serif text-[#fbf6ea]">{{ story.title }}</h3>
              <p class="text-xs text-[#cbb2aa] leading-relaxed font-sans">{{ story.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="isSectionEnabled('video') && data.videoPrewedding" class="py-24 px-6 bg-[#14080a]" v-observe>
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#c8963e] font-sans font-bold">Dokumentasi</p>
            <h2 class="text-4xl md:text-5xl font-serif text-[#fbf6ea]">Ende Ni Holong</h2>
            <div class="w-16 h-px bg-[#c8963e] mx-auto"></div>
          </div>
          <div class="aspect-video w-full rounded-2xl overflow-hidden border border-[#c8963e]/40 shadow-2xl">
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
      <section v-if="isSectionEnabled('gallery') && galleryImages.length" id="gallery" class="py-24 md:py-32 px-6 bg-[#1f090e]" v-observe>
        <div class="max-w-5xl mx-auto space-y-16 text-center">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#c8963e] font-sans font-bold">Gombar Ni Pardonganon</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf6ea]">Galeri Momen</h2>
            <div class="w-16 h-px bg-[#c8963e] mx-auto"></div>
          </div>

          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- TURUT MENGUNDANG / SUHI NI AMPANG NA OPAT -->
      <section
        v-if="isSectionEnabled('extended-family') && (data.extendedFamily?.length || data.turutMengundang)"
        class="py-20 px-6 bg-[#170a0d] border-t border-[#c8963e]/20 text-center"
        v-observe
      >
        <div class="max-w-2xl mx-auto space-y-6">
          <h3 class="text-2xl font-serif text-[#fbf6ea]">Suhi Ni Ampang Na Opat (Turut Mengundang)</h3>
          <div class="w-12 h-px bg-[#c8963e] mx-auto"></div>
          <div class="space-y-2 text-sm text-[#f7eee9] font-sans">
            <p v-for="(person, idx) in normalizedExtendedFamily" :key="idx" class="leading-relaxed">
              {{ person }}
            </p>
          </div>
        </div>
      </section>

      <!-- TANDA KASIH / TUMPAK -->
      <section
        v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || walletItems.length || giftAddresses.length)"
        id="gift"
        class="py-24 md:py-32 px-6 bg-[#14080a] text-center"
        v-observe
      >
        <div class="max-w-4xl mx-auto space-y-12">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#c8963e] font-sans font-bold">Silua &amp; Tumpak</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf6ea]">Tanda Kasih</h2>
            <div class="w-16 h-px bg-[#c8963e] mx-auto"></div>
            <p class="text-sm text-[#cbb2aa] max-w-lg mx-auto font-sans leading-relaxed">
              Pasu-pasu dohot tangiang muna ma na rumingkot di hami tumpak ni holong.
            </p>
          </div>

          <!-- Bank & Wallet Cards -->
          <div class="flex flex-wrap justify-center gap-6">
            <div
              v-for="(bank, idx) in data.bankAccounts"
              :key="'bank-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#c8963e]/40 bg-[#260a10]/90 space-y-3 shadow-lg"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#c8963e] uppercase font-sans tracking-widest">
                <img v-if="bank.bankLogo" :src="bank.bankLogo" :alt="bank.bankName" class="h-8 max-w-[120px] object-contain" />
                <span v-else>{{ bank.bankName }}</span>
              </div>
              <p class="text-xl font-mono text-white font-bold tracking-wider">{{ bank.accountNumber }}</p>
              <p class="text-xs text-[#cbb2aa] font-sans">a.n {{ bank.accountName }}</p>
              <button
                @click="copyToClipboard(bank.accountNumber)"
                class="w-full py-2 bg-transparent border border-[#c8963e]/60 hover:bg-[#c8963e] text-[#c8963e] hover:text-[#14080a] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Rekening
              </button>
            </div>

            <div
              v-for="(wallet, idx) in walletItems"
              :key="'wallet-' + idx"
              class="w-full sm:w-72 p-6 rounded-2xl border border-[#c8963e]/40 bg-[#260a10]/90 space-y-3 shadow-lg"
            >
              <div class="h-10 flex items-center justify-center font-bold text-lg text-[#c8963e] uppercase font-sans tracking-widest">
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
                class="w-full py-2 bg-transparent border border-[#c8963e]/60 hover:bg-[#c8963e] text-[#c8963e] hover:text-[#14080a] rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all mt-2"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Nomer
              </button>
            </div>
          </div>

          <!-- Physical Gift Address -->
          <div v-if="giftAddresses.length" class="max-w-xl mx-auto space-y-4 pt-6">
            <h4 class="text-lg font-serif text-[#c8963e]">Kirim Kado Fisik</h4>
            <div
              v-for="(addr, idx) in giftAddresses"
              :key="'addr-' + idx"
              class="p-6 border border-[#c8963e]/30 rounded-2xl bg-[#260a10]/80 text-left space-y-3"
            >
              <p class="text-xs text-[#f7eee9] leading-relaxed whitespace-pre-line font-sans">{{ addr }}</p>
              <button
                @click="copyToClipboard(addr)"
                class="text-xs text-[#c8963e] border border-[#c8963e]/60 px-4 py-1.5 rounded-full hover:bg-[#c8963e] hover:text-[#14080a] font-sans font-bold uppercase tracking-wider"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin Alamat
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP & UCAPAN -->
      <section v-if="isSectionEnabled('rsvp')" id="rsvp" class="py-24 md:py-32 px-6 bg-[#1f090e] relative" v-observe>
        <div class="max-w-2xl mx-auto space-y-12">
          <div class="text-center space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[#c8963e] font-sans font-bold">Haroroan Ni Tamu</p>
            <h2 class="text-4xl md:text-6xl font-serif text-[#fbf6ea]">Konfirmasi &amp; Hata Tangiang</h2>
            <div class="w-16 h-px bg-[#c8963e] mx-auto"></div>
          </div>

          <div class="p-8 border border-[#c8963e]/35 rounded-3xl bg-[#260a10]/90 shadow-2xl space-y-6">
            <form @submit.prevent="submitRsvp" class="space-y-4">
              <div>
                <label class="block text-xs uppercase font-sans text-[#c8963e] tracking-wider mb-2 font-bold">Goar / Marga</label>
                <input
                  v-model="rsvp.name"
                  type="text"
                  required
                  placeholder="Ketik goar dohot marga..."
                  class="w-full bg-[#14080a] border border-[#c8963e]/40 rounded-xl px-4 py-3 text-[#fbf6ea] text-sm focus:outline-none focus:border-[#c8963e]"
                />
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#c8963e] tracking-wider mb-2 font-bold">Haroroan</label>
                <select
                  v-model="rsvp.attendance"
                  class="w-full bg-[#14080a] border border-[#c8963e]/40 rounded-xl px-4 py-3 text-[#fbf6ea] text-sm focus:outline-none focus:border-[#c8963e]"
                >
                  <option value="hadir">Olo, Ro do hami</option>
                  <option value="tidak">Santabi, Ndang boi ro</option>
                  <option value="ragu">Marningot dope</option>
                </select>
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block text-xs uppercase font-sans text-[#c8963e] tracking-wider mb-2 font-bold">Bilangan Ni Tamu</label>
                <select
                  v-model="rsvp.totalGuests"
                  class="w-full bg-[#14080a] border border-[#c8963e]/40 rounded-xl px-4 py-3 text-[#fbf6ea] text-sm focus:outline-none focus:border-[#c8963e]"
                >
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Halak</option>
                </select>
              </div>

              <div>
                <label class="block text-xs uppercase font-sans text-[#c8963e] tracking-wider mb-2 font-bold">Hata Tangiang / Ucapan</label>
                <textarea
                  v-model="rsvp.message"
                  rows="4"
                  placeholder="Surat hata pasu-pasu tu oroan & pangoli..."
                  class="w-full bg-[#14080a] border border-[#c8963e]/40 rounded-xl px-4 py-3 text-[#fbf6ea] text-sm focus:outline-none focus:border-[#c8963e]"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submittingRsvp"
                class="w-full py-3.5 bg-gradient-to-r from-[#9b2a38] via-[#c8963e] to-[#9b2a38] text-[#fbf6ea] font-bold rounded-xl shadow-lg transition-all hover:brightness-110 text-xs uppercase tracking-widest"
              >
                {{ submittingRsvp ? 'Mangirim...' : 'Kirim Konfirmasi & Doa' }}
              </button>
            </form>
          </div>

          <!-- Messages List -->
          <div v-if="guestMessages.length" class="space-y-4 max-h-96 overflow-y-auto no-scrollbar pr-1">
            <div
              v-for="(msg, idx) in guestMessages"
              :key="'msg-' + idx"
              class="p-5 border border-[#c8963e]/20 rounded-2xl bg-[#260a10]/60 space-y-2 text-left"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-[#fbf6ea] text-base">{{ msg.name }}</span>
                <span
                  class="text-[9px] px-2 py-0.5 rounded-full font-sans uppercase font-bold"
                  :class="msg.attendance === 'hadir' ? 'bg-[#c8963e]/20 text-[#f0cb82]' : 'bg-gray-800 text-gray-400'"
                >
                  {{ msg.attendance === 'hadir' ? 'Ro' : 'Ndang Ro' }}
                </span>
              </div>
              <p class="text-xs text-[#e5d6d1] font-sans leading-relaxed">"{{ msg.message }}"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-20 md:py-28 bg-[#0a0405] text-center border-t border-[#c8963e]/25 relative overflow-hidden">
        <div class="relative z-10 px-6 space-y-4">
          <!-- Batak Peak Crest -->
          <div class="flex justify-center text-[#c8963e] opacity-60">
            <svg class="w-10 h-7" viewBox="0 0 100 80" fill="currentColor">
              <path d="M10 65 Q50 15 90 65 L80 75 Q50 35 20 75 Z" />
            </svg>
          </div>
          <p class="font-serif italic text-[#c8963e]/80 text-base md:text-lg">Mauliate Godang</p>
          <h2 class="text-4xl md:text-6xl font-serif text-[#fbf6ea]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
          <p v-if="data.footerText" class="text-[#cbb2aa] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            {{ data.footerText }}
          </p>
          <div class="w-16 h-px bg-[#c8963e]/30 mx-auto my-6"></div>
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
import gorgaImg from '@/assets/ornaments/gorga-batak.png'
import gorgaAuthenticImg from '@/assets/ornaments/gorga-batak-authentic.png'
import cornerImg from '@/assets/ornaments/batak-corner-gold.png'
import dividerImg from '@/assets/ornaments/batak-divider-gold.png'
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
    return data.value.galleryImages.map((img) =>
      typeof img === 'object' && img?.src ? img : { src: String(img || ''), thumbnail: String(img || '') },
    )
  }
  return []
})

const mockStories = [
  {
    title: 'Parjumpaan Parjolo',
    date: '2022',
    description: 'Dalan holong mamungka parjumpaan na uli, marpadan roha asa rap pajongjong parsaripeon.',
  },
  {
    title: 'Marhusip & Martumpol',
    date: '2025',
    description: 'Rongkap ni tondi tiur ditangihon di adopan ni Huria dohot keluarga dalihan na tolu.',
  },
]

const navItems = computed(() => {
  const list = [
    { id: 'home', label: 'Bebuka', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Oroan', icon: 'fa-solid fa-heart' },
    { id: 'event', label: 'Ulaon', icon: 'fa-solid fa-calendar-check' },
  ]
  if (isSectionEnabled('love-story')) list.push({ id: 'story', label: 'Holong', icon: 'fa-solid fa-book-open' })
  if (isSectionEnabled('gallery')) list.push({ id: 'gallery', label: 'Gombar', icon: 'fa-solid fa-images' })
  if (isSectionEnabled('gift')) list.push({ id: 'gift', label: 'Tumpak', icon: 'fa-solid fa-gift' })
  if (isSectionEnabled('rsvp')) list.push({ id: 'rsvp', label: 'Haroroan', icon: 'fa-solid fa-envelope' })
  return list
})

const countdown = ref({ Ari: '00', Jam: '00', Menit: '00', Detik: '00' })
let timerInterval = null

function updateCountdown() {
  const targetDateStr = data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
  if (!targetDateStr) return
  const target = new Date(targetDateStr).getTime()
  const now = new Date().getTime()
  const diff = target - now
  if (diff <= 0) {
    countdown.value = { Ari: '00', Jam: '00', Menit: '00', Detik: '00' }
    return
  }
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  countdown.value = {
    Ari: String(d).padStart(2, '0'),
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
    toast.success('Nunga disalin tu papan klip!')
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
    toast.success('Mauliate, nunga sahat konfirmasi dohot tangiang muna!')
    rsvp.value.message = ''
  } catch (err) {
    console.error(err)
    toast.error('Santabi, adong sala tikki mangirimkon konfirmasi.')
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
