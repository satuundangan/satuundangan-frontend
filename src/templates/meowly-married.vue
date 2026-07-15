<template>
  <div class="relative min-h-screen bg-[#fcfaf7] overflow-hidden font-sans text-[#2a2221] selection:bg-[#e6dfd5] selection:text-[#2a2221]">
    
    <!-- Background Music -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" primaryColor="#2a2221" accentColor="#8a7e72" class="z-[55]" />

    <!-- Minimalist Desktop Floating Navigation -->
    <nav v-if="!showWelcome" class="fixed right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-5 hidden md:flex">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="w-10 h-10 bg-[#fcfaf7]/90 backdrop-blur-md shadow-sm border border-[#e6dfd5] flex items-center justify-center transition-all duration-500 group relative hover:bg-[#2a2221] hover:text-white"
        :class="activeSection === item.id ? 'bg-[#2a2221] text-white scale-105' : 'text-[#8a7e72]'">
        <i :class="[item.icon, 'text-xs']"></i>
        <span class="absolute right-14 px-3 py-1 bg-[#2a2221] text-white text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {{ item.label }}
        </span>
      </button>
    </nav>
    
    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#fcfaf7]/95 backdrop-blur-md rounded-none shadow-md border border-[#e6dfd5] max-w-[90%] md:hidden flex overflow-x-auto no-scrollbar">
      <div class="flex items-center justify-center gap-6 px-6 py-3 mx-auto">
        <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-0.5 transition-all duration-300 shrink-0"
          :class="activeSection === item.id ? 'text-[#2a2221] scale-105 font-black' : 'text-gray-400'">
          <i :class="[item.icon, 'text-xs']"></i>
          <span class="text-[7px] font-black uppercase tracking-[0.15em]">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- VERO STYLE WELCOME SCREEN -->
    <transition name="fade-screen">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#fcfaf7] px-6 overflow-hidden">
        <!-- Minimalist Layout -->
        <div class="w-full max-w-lg flex flex-col items-center text-center space-y-8 animate-fade-in">
          
          <div class="space-y-2">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 Commissioned Fine-Art</span>
            <div class="h-[1px] w-12 bg-[#e6dfd5] mx-auto my-3"></div>
            <h2 class="text-3xl md:text-4xl font-serif text-[#2a2221] leading-tight font-light uppercase tracking-[0.05em]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
          </div>

          <!-- Sculpture Card (Vero Style Frame) -->
          <div class="relative w-64 md:w-72 bg-white p-3 shadow-sm border border-[#e6dfd5] transform-style-3d transition-transform duration-500 hover:scale-[1.02]"
               :style="getTiltStyle('envelope')"
               @mousemove="handleTilt($event, 'envelope')"
               @mouseleave="resetTilt('envelope')"
               @touchmove="handleTouchTilt($event, 'envelope')"
               @touchend="resetTilt('envelope')">
            <div class="aspect-[3/4] bg-[#fcfaf7] overflow-hidden border border-[#f0eae1] flex items-center justify-center">
              <img src="/assets/images/luxury-clay-cats.webp" alt="Vero Cat Sculpture" class="w-full h-full object-cover p-3" />
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-[9px] uppercase tracking-[0.25em] text-[#8a7e72]">Presented by satuundangan.id</p>
            <button @click="openInvitation" class="px-8 py-3.5 bg-transparent hover:bg-[#2a2221] text-[#2a2221] hover:text-white font-sans uppercase tracking-[0.3em] text-[9px] font-black border border-[#2a2221] transition-all duration-500 cursor-pointer rounded-none">
              *enter* THE CELEBRATION
            </button>
          </div>
        </div>

        <div class="absolute bottom-8 text-[8px] uppercase tracking-[0.2em] text-gray-400">
          <p>© VERO STUDIO STYLE — 2026</p>
        </div>
      </div>
    </transition>

    <!-- MAIN SCROLLABLE CONTAINER (NORMAL SCROLL FLOW) -->
    <div v-if="!showWelcome" id="main-content" @scroll="handleScroll" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen w-full overflow-y-auto scroll-smooth pb-16 md:pb-24">
      
      <!-- HERO COVER SECTION -->
      <section id="home" class="relative py-24 md:py-40 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 min-h-[90vh]">
        <!-- Hero Left Column: Editorial Large Typography -->
        <div class="w-full md:w-1/2 space-y-8 text-center md:text-left z-20">
          <div class="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#8a7e72]">
            🐾 *introducing the* WEDDING *of*
          </div>
          <h1 class="text-6xl sm:text-7xl md:text-[5.5rem] font-serif text-[#2a2221] leading-[0.95] font-black uppercase tracking-[0.02em]">
            {{ data.groomName }} <br>
            <span class="text-4xl md:text-6xl font-serif italic text-[#8a7e72] font-normal font-serif lowercase">&amp;</span> <br>
            {{ data.brideName }}
          </h1>
          <div class="h-[1px] w-24 bg-[#2a2221] mx-auto md:mx-0"></div>
          <div class="space-y-1">
            <p class="text-[9px] uppercase tracking-[0.35em] text-[#8a7e72] font-black">Save the Date</p>
            <p class="text-sm md:text-base font-serif italic text-gray-500">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</p>
          </div>
        </div>

        <!-- Hero Right Column: HUGE Parallax Sculpture Card -->
        <div class="w-full md:w-1/2 flex justify-center z-10 md:pr-8">
          <div class="relative w-80 sm:w-96 md:w-[440px] bg-white p-4 pb-12 shadow-[0_30px_70px_rgba(42,34,33,0.06)] border border-[#e6dfd5] rounded-none transform-style-3d transition-transform duration-100 ease-out"
               :style="[getTiltStyle('heroCard'), getParallaxStyle(-0.06, 0, sectionOffsets.home)]"
               @mousemove="handleTilt($event, 'heroCard')"
               @mouseleave="resetTilt('heroCard')"
               @touchmove="handleTouchTilt($event, 'heroCard')"
               @touchend="resetTilt('heroCard')">
            
            <div class="aspect-[3/4] bg-[#fcfaf7] overflow-hidden relative border border-[#f0eae1] flex items-center justify-center">
              <img src="/assets/images/luxury-clay-cats.webp" alt="Wedding Cat Sculpture" class="w-full h-full object-cover p-5 scale-105" />
            </div>

            <!-- Floating 3D Sculpture Heart overlay -->
            <div class="absolute -bottom-8 -left-8 w-24 h-24 pointer-events-none select-none">
              <img src="/assets/images/luxury-clay-heart.webp" alt="Heart Sculpture" class="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(42,34,33,0.08)]" />
            </div>
          </div>
        </div>
      </section>

      <!-- QUOTE SECTION -->
      <section class="relative py-36 px-6 overflow-hidden bg-[#faf8f5] z-20 border-t border-b border-[#e6dfd5]">
        <!-- Huge Background Parallax Heart -->
        <img src="/assets/images/luxury-clay-heart.webp" alt="Heart Sculpture Background" 
             class="absolute w-64 h-64 md:w-96 md:h-96 opacity-[0.03] select-none pointer-events-none"
             :style="[getParallaxStyle(0.04, 0.01, sectionOffsets.home), { left: '10%', top: '5%' }]" />
             
        <div class="max-w-4xl mx-auto text-center space-y-10 relative z-20">
          <p class="text-2xl sm:text-3xl md:text-4xl italic leading-relaxed font-serif text-[#2a2221] px-4 font-normal font-serif">
            "{{ data.quoteText || 'Dalam kehangatan dan kebersamaan, kita temukan makna persahabatan sejati dan cinta yang setia.' }}"
          </p>
          <div class="flex items-center justify-center gap-4">
             <div class="w-12 h-[1px] bg-[#e6dfd5]"></div>
             <p class="text-[9px] font-black uppercase tracking-[0.35em] text-[#8a7e72]">{{ data.quoteSource || 'Paws &amp; Promises Romance' }}</p>
             <div class="w-12 h-[1px] bg-[#e6dfd5]"></div>
          </div>
        </div>
      </section>

      <!-- COUPLE SECTION (ASYMMETRICAL DIPTYCH COLUMNS WITH OVERLAPPING PARALLAX) -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="relative py-36 md:py-48 px-6 bg-[#fcfaf7] z-20">
        <!-- Huge Background Parallax Paw -->
        <img src="/assets/images/luxury-clay-paw.webp" alt="Paw Sculpture Background" 
             class="absolute w-64 h-64 md:w-96 md:h-96 opacity-[0.03] select-none pointer-events-none"
             :style="[getParallaxStyle(0.03, -0.01, sectionOffsets.couple), { right: '10%', top: '15%' }]" />

        <div class="max-w-6xl mx-auto z-20 relative">
          <div class="text-center mb-28">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 *meet the* couple</span>
            <h2 class="text-5xl md:text-6xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">Mempelai Pernikahan</h2>
            <div class="h-[1px] w-20 bg-[#2a2221] mx-auto mt-6"></div>
          </div>
          
          <!-- Asymmetrical Diptych Layout -->
          <div class="flex flex-col md:flex-row justify-center items-start gap-20 md:gap-8 max-w-5xl mx-auto w-full relative min-h-[800px]">
            
            <!-- Groom Card (Left column, scrolls slower) -->
            <div class="w-full md:w-[47%] bg-white p-6 pb-10 border border-[#e6dfd5] rounded-none flex flex-col justify-between items-center transform-style-3d transition-transform duration-100 ease-out z-20 shadow-[0_20px_50px_rgba(42,34,33,0.03)]"
                 :style="[getTiltStyle('groomCard'), getParallaxStyle(0.02, 0, sectionOffsets.couple)]"
                 @mousemove="handleTilt($event, 'groomCard')"
                 @mouseleave="resetTilt('groomCard')"
                 @touchmove="handleTouchTilt($event, 'groomCard')"
                 @touchend="resetTilt('groomCard')">
              <div class="space-y-8 w-full text-center">
                <!-- Rectangular frame with thin borders (Editorial style) -->
                <div class="relative aspect-[3/4] w-full bg-[#fcfaf7] border border-[#e6dfd5] overflow-hidden flex items-center justify-center p-2 shadow-inner">
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x533'" class="w-full h-full object-cover" />
                </div>
                <div class="space-y-3">
                  <span class="inline-block text-[9px] uppercase tracking-[0.3em] font-black text-[#8a7e72] border-b border-[#e6dfd5] pb-1">The Groom</span>
                  <h3 class="text-3xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">{{ data.groomName }}</h3>
                  <p class="text-xs text-gray-500 font-medium leading-relaxed">Putra dari pasangan <br><span class="font-serif italic text-[#2a2221] text-sm">{{ data.parents?.groomParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="mt-8 px-6 py-3.5 bg-transparent hover:bg-[#2a2221] text-[#2a2221] hover:text-white rounded-none text-[8px] uppercase tracking-[0.25em] font-black border border-[#2a2221] transition-all"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>

            <!-- Bride Card (Right column, shifted down, scrolls faster/upwards to slide past Groom) -->
            <div class="w-full md:w-[47%] md:mt-40 bg-white p-6 pb-10 border border-[#e6dfd5] rounded-none flex flex-col justify-between items-center transform-style-3d transition-transform duration-100 ease-out z-10 shadow-[0_25px_60px_rgba(42,34,33,0.04)]"
                 :style="[getTiltStyle('brideCard'), getParallaxStyle(-0.03, 0, sectionOffsets.couple)]"
                 @mousemove="handleTilt($event, 'brideCard')"
                 @mouseleave="resetTilt('brideCard')"
                 @touchmove="handleTouchTilt($event, 'brideCard')"
                 @touchend="resetTilt('brideCard')">
              <div class="space-y-8 w-full text-center">
                <!-- Rectangular frame with thin borders -->
                <div class="relative aspect-[3/4] w-full bg-[#fcfaf7] border border-[#e6dfd5] overflow-hidden flex items-center justify-center p-2 shadow-inner">
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x533'" class="w-full h-full object-cover" />
                </div>
                <div class="space-y-3">
                  <span class="inline-block text-[9px] uppercase tracking-[0.3em] font-black text-[#8a7e72] border-b border-[#e6dfd5] pb-1">The Bride</span>
                  <h3 class="text-3xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">{{ data.brideName }}</h3>
                  <p class="text-xs text-gray-500 font-medium leading-relaxed">Putri dari pasangan <br><span class="font-serif italic text-[#2a2221] text-sm">{{ data.parents?.brideParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="mt-8 px-6 py-3.5 bg-transparent hover:bg-[#2a2221] text-[#2a2221] hover:text-white rounded-none text-[8px] uppercase tracking-[0.25em] font-black border border-[#2a2221] transition-all"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>

          </div>
        </div>
      </section>

      <!-- LOVE STORY SECTION -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="relative py-36 px-6 bg-gradient-to-b from-[#fcfaf7] to-white z-20">
        <div class="max-w-6xl mx-auto space-y-20 relative">
          <div class="text-center mb-16">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 *our* journey</span>
            <h2 class="text-5xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">Kisah Cinta Kami</h2>
            <div class="h-[1px] w-20 bg-[#2a2221] mx-auto mt-6"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <!-- Timelines cards overlapping naturally -->
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory.slice(0, 3) : mockStories)" :key="idx"
                 class="bg-white p-6 border border-[#e6dfd5] rounded-none shadow-sm space-y-6 flex flex-col justify-between transition-all duration-500 hover:shadow-md hover:border-[#8a7e72]"
                 :style="getParallaxStyle(idx === 0 ? 0.02 : idx === 1 ? -0.02 : 0.03, 0, sectionOffsets.story)">
               <div class="space-y-4">
                 <div v-if="story.image || isPreviewMode" class="aspect-[4/3] overflow-hidden relative border border-[#e6dfd5]">
                    <img :src="story.image || 'https://via.placeholder.com/600x400'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 </div>
                 <div class="space-y-2">
                    <span class="inline-block text-[9px] font-black text-[#8a7e72] uppercase tracking-[0.25em] border-b border-[#e6dfd5] pb-0.5">{{ story.date }}</span>
                    <h3 class="text-xl font-serif text-[#2a2221] font-bold mt-1">{{ story.title }}</h3>
                    <p class="text-xs leading-relaxed text-[#7a6a68]">{{ story.description }}</p>
                 </div>
               </div>
               <div class="pt-4 border-t border-[#f0eae1] text-[#8a7e72] flex justify-between items-center">
                 <span class="text-[14px] font-serif italic text-gray-300">0{{ idx+1 }}</span>
                 <span class="text-[9px] uppercase font-bold tracking-widest text-[#8a7e72]">Chapter</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS SECTION (OFFSET EDITORIAL STYLING) -->
      <section id="event" v-if="isSectionEnabled('event')" class="relative py-36 md:py-48 px-6 bg-[#fcfaf7] z-20 border-t border-b border-[#e6dfd5]">
        <!-- Massive Background Parallax Paw -->
        <img src="/assets/images/luxury-clay-paw.webp" alt="Paw Sculpture Background" 
             class="absolute w-64 h-64 md:w-96 md:h-96 opacity-[0.03] select-none pointer-events-none"
             :style="[getParallaxStyle(0.04, 0.01, sectionOffsets.event), { left: '8%', top: '25%' }]" />

        <div class="max-w-5xl mx-auto relative z-20">
          <div class="text-center mb-24">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 *join the* CELEBRATION</span>
            <h2 class="text-5xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">Waktu &amp; Lokasi Acara</h2>
            <div class="h-[1px] w-20 bg-[#2a2221] mx-auto mt-6"></div>
          </div>
          
          <div class="flex flex-col md:flex-row justify-center items-start gap-16 md:gap-10 max-w-4xl mx-auto w-full">
            <!-- Akad Card (Large, offset, slower parallax) -->
            <div class="w-full md:w-[48%] bg-white p-8 border border-[#e6dfd5] rounded-none space-y-6 text-center transform-style-3d transition-transform duration-100 ease-out shadow-[0_20px_40px_rgba(42,34,33,0.02)]"
                 :style="[getTiltStyle('akadCard'), getParallaxStyle(0.03, 0, sectionOffsets.event)]"
                 @mousemove="handleTilt($event, 'akadCard')"
                 @mouseleave="resetTilt('akadCard')"
                 @touchmove="handleTouchTilt($event, 'akadCard')"
                 @touchend="resetTilt('akadCard')">
              
              <!-- Luxury Intertwined Rings Sculpture -->
              <div class="w-20 h-20 mx-auto flex items-center justify-center pointer-events-none select-none">
                <img src="/assets/images/luxury-clay-rings.webp" alt="Wedding Rings Sculpture" class="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(42,34,33,0.06)]" />
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl font-serif text-[#2a2221] font-bold">Akad Nikah</h3>
                <p class="text-[9px] uppercase tracking-wider font-extrabold text-[#8a7e72] border-b border-[#e6dfd5] pb-1 inline-block">{{ formatDate(data.akadLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-3 pt-6 border-t border-[#f0eae1] text-xs font-semibold">
                <p class="flex items-center justify-center gap-2 text-[#2a2221]"><i class="fa-regular fa-clock text-[#8a7e72] text-sm"></i> Pukul {{ formatTime(data.akadLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-xs text-[#7a6a68] font-normal leading-relaxed px-4">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="block w-full py-3.5 bg-[#fcfaf7] hover:bg-[#2a2221] text-[#2a2221] hover:text-white font-black uppercase tracking-[0.25em] text-[9px] rounded-none transition-all border border-[#e6dfd5] shadow-sm">
                Petunjuk Maps 🗺️
              </a>
            </div>

            <!-- Resepsi Card (Large, offset down, faster parallax for overlapping feel) -->
            <div v-if="!data.mergeEvents" class="w-full md:w-[48%] md:mt-28 bg-white p-8 border border-[#e6dfd5] rounded-none space-y-6 text-center transform-style-3d transition-transform duration-100 ease-out shadow-[0_20px_40px_rgba(42,34,33,0.02)]"
                 :style="[getTiltStyle('resepsiCard'), getParallaxStyle(-0.03, 0, sectionOffsets.event)]"
                 @mousemove="handleTilt($event, 'resepsiCard')"
                 @mouseleave="resetTilt('resepsiCard')"
                 @touchmove="handleTouchTilt($event, 'resepsiCard')"
                 @touchend="resetTilt('resepsiCard')">
              
              <!-- Luxury Champagne Glasses Sculpture -->
              <div class="w-20 h-20 mx-auto flex items-center justify-center pointer-events-none select-none">
                <img src="/assets/images/luxury-clay-glasses.webp" alt="Champagne Glasses Sculpture" class="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(42,34,33,0.06)]" />
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl font-serif text-[#2a2221] font-bold">Resepsi</h3>
                <p class="text-[9px] uppercase tracking-wider font-extrabold text-[#8a7e72] border-b border-[#e6dfd5] pb-1 inline-block">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-3 pt-6 border-t border-[#f0eae1] text-xs font-semibold">
                <p class="flex items-center justify-center gap-2 text-[#2a2221]"><i class="fa-regular fa-clock text-[#8a7e72] text-sm"></i> Pukul {{ formatTime(data.resepsiLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-xs text-[#7a6a68] font-normal leading-relaxed px-4">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="block w-full py-3.5 bg-[#fcfaf7] hover:bg-[#2a2221] text-[#2a2221] hover:text-white font-black uppercase tracking-[0.25em] text-[9px] rounded-none transition-all border border-[#e6dfd5] shadow-sm">
                Petunjuk Maps 🗺️
              </a>
            </div>
          </div>

          <!-- Dress Code -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-24 text-center space-y-4">
             <h3 class="text-[10px] uppercase tracking-[0.25em] font-black text-[#2a2221]">*dress* CODE</h3>
             <div class="bg-white px-8 py-5 border border-[#e6dfd5] shadow-sm inline-flex items-center gap-3">
                <i class="fa-solid fa-shirt text-[#8a7e72]"></i>
                <p class="text-[#2a2221] font-black uppercase tracking-wider text-[10px]">{{ data.dressCode }}</p>
             </div>
          </div>
        </div>
      </section>

      <!-- GALLERY SECTION -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="relative py-36 px-6 bg-[#fcfaf7] z-20">
        <div class="max-w-6xl mx-auto space-y-16 relative z-20">
          <div class="text-center">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 *our* GALLERY</span>
            <h2 class="text-5xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">Galeri Foto</h2>
            <div class="h-[1px] w-20 bg-[#2a2221] mx-auto mt-6"></div>
          </div>
          <!-- Spacious layout grid for gallery -->
          <div class="p-6 bg-white border border-[#e6dfd5] shadow-[0_20px_50px_rgba(42,34,33,0.03)]"
               :style="getParallaxStyle(0.02, 0, sectionOffsets.gallery)">
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- DIGITAL GIFT SECTION -->
      <section id="gift" v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.eWalletLink?.length)" class="relative py-36 px-6 text-center bg-white z-20 border-t border-[#e6dfd5]">
        <div class="max-w-5xl mx-auto space-y-16 relative z-20">
          <div class="text-center mb-20">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 *digital* GIFTING</span>
            <h2 class="text-5xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">Kado Digital</h2>
            <div class="h-[1px] w-20 bg-[#2a2221] mx-auto mt-6"></div>
          </div>
          
          <!-- Staggered cards container with extra padding buffers to prevent clipping -->
          <div class="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 max-w-4xl mx-auto w-full pt-20 md:pt-28 pb-12">
            <div v-for="(bank, idx) in data.bankAccounts.slice(0, 2)" :key="idx"
                 class="p-8 bg-[#fcfaf7] border border-[#e6dfd5] rounded-none shadow-sm text-left flex flex-col justify-between transform-style-3d transition-transform duration-100 ease-out"
                 :style="[getTiltStyle('bankCard_' + idx), getParallaxStyle(idx === 0 ? 0.03 : -0.03, 0, sectionOffsets.gift)]"
                 @mousemove="handleTilt($event, 'bankCard_' + idx)"
                 @mouseleave="resetTilt('bankCard_' + idx)"
                 @touchmove="handleTouchTilt($event, 'bankCard_' + idx)"
                 @touchend="resetTilt('bankCard_' + idx)">
              <div>
                <div class="flex justify-between items-center mb-6">
                   <p class="text-base font-black uppercase tracking-wider text-[#2a2221] border-b border-[#e6dfd5] pb-0.5">{{ bank.bankName }}</p>
                   
                   <!-- Luxury Wallet Clay Sculpture -->
                   <div class="w-12 h-12 flex items-center justify-center pointer-events-none select-none">
                     <img src="/assets/images/luxury-clay-wallet.webp" alt="Wallet Sculpture" class="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(42,34,33,0.05)]" />
                   </div>

                </div>
                <p class="text-2xl font-bold tracking-wider mb-2 text-[#2a2221] font-mono">{{ bank.accountNumber }}</p>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest font-sans">A.N {{ bank.accountName }}</p>
              </div>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full mt-8 py-3 bg-white text-[#2a2221] hover:bg-[#2a2221] hover:text-white font-black uppercase tracking-[0.25em] text-[9px] rounded-none transition-all shadow-sm border border-[#e6dfd5]">
                Salin Rekening 📋
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP SECTION (LARGE CLEAN CONTAINER LAYOUT) -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="relative py-36 px-6 bg-[#fcfaf7] z-20 border-t border-[#e6dfd5]">
        <div class="max-w-3xl mx-auto relative z-20">
          <div class="text-center mb-16">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 *rsvp* REGISTRY</span>
            <h2 class="text-5xl font-serif text-[#2a2221] font-light uppercase tracking-[0.05em] mt-2">Konfirmasi Kehadiran</h2>
            <div class="h-[1px] w-20 bg-[#2a2221] mx-auto mt-6"></div>
          </div>

          <!-- Large Form Layout -->
          <form @submit.prevent="submitRSVP" class="bg-white p-8 md:p-12 border border-[#e6dfd5] rounded-none space-y-6 shadow-[0_20px_50px_rgba(42,34,33,0.02)]"
                :style="getParallaxStyle(0.02, 0, sectionOffsets.rsvp)">
            
            <!-- Luxury Envelope Clay Sculpture -->
            <div class="w-20 h-20 mx-auto flex items-center justify-center pointer-events-none select-none mb-6">
              <img src="/assets/images/luxury-clay-envelope.webp" alt="Envelope Sculpture" class="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(42,34,33,0.06)]" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-[9px] uppercase tracking-widest font-black text-[#8a7e72] px-1">Nama Lengkap</label>
                <input v-model="rsvp.name" type="text" class="w-full bg-[#fcfaf7] border border-[#e6dfd5] py-3.5 px-4 text-xs font-semibold focus:border-[#2a2221] focus:bg-white outline-none transition-colors rounded-none" required />
              </div>
              
              <div class="space-y-1">
                <label class="text-[9px] uppercase tracking-widest font-black text-[#8a7e72] px-1">Jumlah Tamu</label>
                <select v-model="rsvp.totalGuests" class="w-full bg-[#fcfaf7] border border-[#e6dfd5] py-3.5 px-4 text-xs font-semibold focus:border-[#2a2221] outline-none rounded-none">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-2">
               <label class="text-[9px] uppercase tracking-widest font-black text-[#8a7e72] px-1">Konfirmasi Kehadiran</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-4 border rounded-none text-center cursor-pointer transition-all font-bold uppercase tracking-[0.2em] text-[9px]" :class="rsvp.attendance === 'hadir' ? 'border-[#2a2221] bg-[#2a2221] text-white shadow-sm' : 'border-[#e6dfd5] bg-[#fcfaf7] text-gray-500 hover:border-[#2a2221]'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Hadir 🐾
                 </label>
                 <label class="flex-1 py-4 border rounded-none text-center cursor-pointer transition-all font-bold uppercase tracking-[0.2em] text-[9px]" :class="rsvp.attendance === 'tidak' ? 'border-[#2a2221] bg-[#2a2221] text-white shadow-sm' : 'border-[#e6dfd5] bg-[#fcfaf7] text-gray-500 hover:border-[#2a2221]'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Tidak Hadir
                 </label>
               </div>
            </div>

            <div class="space-y-1">
               <label class="text-[9px] uppercase tracking-widest font-black text-[#8a7e72] px-1">Ucapan &amp; Doa Restu</label>
               <textarea v-model="rsvp.message" rows="4" class="w-full bg-[#fcfaf7] border border-[#e6dfd5] py-3.5 px-4 text-xs font-normal focus:border-[#2a2221] focus:bg-white outline-none resize-none rounded-none"></textarea>
            </div>

            <button type="submit" class="w-full py-4 bg-[#2a2221] hover:bg-[#1a1413] text-white text-[9px] uppercase tracking-[0.3em] font-black rounded-none shadow-sm transition-all duration-300">Kirim Konfirmasi 🐾</button>
          </form>

          <!-- Scenic Footer -->
          <footer class="mt-28 py-12 text-center space-y-4 border-t border-[#e6dfd5]">
            <span class="text-[9px] uppercase tracking-[0.3em] text-[#8a7e72] font-black block">🐾 VERO STUDIO INSPIRED</span>
            <h2 class="font-serif text-3xl font-light uppercase tracking-[0.05em] text-[#2a2221]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
            <p class="text-[8px] uppercase tracking-widest font-extrabold text-gray-400">Created with ❤️ by satuundangan.id</p>
          </footer>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { createGuestMessage } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({
  data: { type: Object, required: true }
})

const data = ref(props.data || {})
const toast = useToast()

watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
  },
  { deep: true, immediate: true },
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)

const mockStories = [
  {
    title: 'Awal Pertemuan 🐾',
    date: 'Mei 2024',
    description: 'Pertama kali berpapasan secara tidak sengaja di sebuah cat cafe kecil.',
  },
  {
    title: 'Lamaran',
    date: 'Februari 2026',
    description: 'Di bawah hangatnya senja, kami berjanji untuk bersama selamanya.',
  },
]

const showWelcome = ref(true)
const envelopeOpen = ref(false)
const galleryImages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })

// 3D CARD TILT REACTIVE STATES
const tiltState = ref({
  envelope: { x: 0, y: 0, s: 1 },
  heroCard: { x: 0, y: 0, s: 1 },
  groomCard: { x: 0, y: 0, s: 1 },
  brideCard: { x: 0, y: 0, s: 1 },
  akadCard: { x: 0, y: 0, s: 1 },
  resepsiCard: { x: 0, y: 0, s: 1 },
  bankCard_0: { x: 0, y: 0, s: 1 },
  bankCard_1: { x: 0, y: 0, s: 1 }
})

// MOUSEMOVE TILT HANDLER (DESKTOP)
function handleTilt(e, key) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  
  const tiltX = (y / (rect.height / 2)) * -10
  const tiltY = (x / (rect.width / 2)) * 10
  
  if (!tiltState.value[key]) {
    tiltState.value[key] = { x: 0, y: 0, s: 1 }
  }
  
  tiltState.value[key].x = tiltX
  tiltState.value[key].y = tiltY
  tiltState.value[key].s = 1.02
}

// TOUCHMOVE TILT HANDLER (MOBILE / TOUCHSCREEN)
function handleTouchTilt(e, key) {
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0]
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = touch.clientX - rect.left - rect.width / 2
    const y = touch.clientY - rect.top - rect.height / 2
    
    const tiltX = (y / (rect.height / 2)) * -8
    const tiltY = (x / (rect.width / 2)) * 8
    
    if (!tiltState.value[key]) {
      tiltState.value[key] = { x: 0, y: 0, s: 1 }
    }
    
    tiltState.value[key].x = tiltX
    tiltState.value[key].y = tiltY
    tiltState.value[key].s = 1.01
  }
}

// RESET TILT ON LEAVE
function resetTilt(key) {
  if (tiltState.value[key]) {
    tiltState.value[key].x = 0
    tiltState.value[key].y = 0
    tiltState.value[key].s = 1
  }
}

// GET DYNAMIC INLINE TILT STYLE
function getTiltStyle(key) {
  const state = tiltState.value[key]
  if (!state) return ''
  return {
    transform: `perspective(1200px) rotateX(${state.x}deg) rotateY(${state.y}deg) scale3d(${state.s}, ${state.s}, 1)`
  }
}

// SCROLL PARALLAX BINDING
const scrollY = ref(0)
const vh = ref(800)

const sectionOffsets = ref({
  home: 0,
  couple: 800,
  story: 1600,
  event: 2400,
  gallery: 3200,
  gift: 4000,
  rsvp: 4800
})

function updateOffsets() {
  const sections = ['home', 'couple', 'story', 'event', 'gallery', 'gift', 'rsvp']
  sections.forEach(id => {
    const el = document.getElementById(id)
    if (el) {
      sectionOffsets.value[id] = el.offsetTop
    }
  })
}

function handleScroll(e) {
  scrollY.value = e.target.scrollTop
}

// ASYMMETRICAL OVERLAPPING PARALLAX STYLE
function getParallaxStyle(speed, rotateSpeed = 0, targetOffset = 0) {
  const relativeScroll = scrollY.value - targetOffset
  const yOffset = relativeScroll * speed
  const rotate = relativeScroll * rotateSpeed
  return {
    transform: `translate3d(0, ${yOffset}px, 0) rotate(${rotate}deg)`,
    willChange: 'transform'
  }
}

const allNavItems = [
  { id: 'home', label: 'Cover', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart', key: 'couple' },
  { id: 'story', label: 'Cerita', icon: 'fa-solid fa-book-open', key: 'love-story' },
  { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-day', key: 'event' },
  { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'gift', label: 'Kado', icon: 'fa-solid fa-gift', key: 'gift' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' }
]

const navItems = computed(() => {
  return allNavItems.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'story') return isSectionEnabled('love-story') && (data.value.loveStory?.length > 0 || isPreviewMode.value)
    return isSectionEnabled(item.key)
  })
})

const activeSection = ref('home')

function triggerEnvelope() {
  envelopeOpen.value = true
}

function openInvitation() {
  envelopeOpen.value = true
  setTimeout(() => {
    showWelcome.value = false
    setTimeout(() => {
      const content = document.getElementById('main-content')
      if (content) content.classList.remove('opacity-0')
      initScrollSpy()
      updateOffsets()
    }, 100)
  }, 1100)
}

// Scroll to section
function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activeSection.value = e.target.id })
  }, { threshold: 0.2 })
  navItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

const isSectionEnabled = (key) => {
  if (data.value.selectedSections === undefined || data.value.selectedSections === null) return true
  return data.value.selectedSections.includes(key)
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:')) return choice
  if (choice.includes('/') || choice.includes('http')) return choice
  return '/audio/wedding-acoustic-morning.mp3'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// Format time
function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatInstagramUrl(handle) {
  if (!handle) return '#'
  return `https://instagram.com/${handle.replace('@', '')}`
}

function copyToClipboard(text) { 
  navigator.clipboard.writeText(text)
  toast.success('Nomor Rekening Disalin!') 
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) return toast.error("Lengkapi data yang dibutuhkan")
  try {
    await createGuestMessage({
      invitationId: data.value.id, guestName: rsvp.value.name, message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance, totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0
    })
    toast.success("Terima kasih atas konfirmasinya!")
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
  } catch (err) {
    console.error(err)
    toast.error("Gagal mengirim RSVP.")
  }
}

onMounted(() => {
  initData()
  vh.value = window.innerHeight
  window.addEventListener('resize', () => {
    vh.value = window.innerHeight
    updateOffsets()
  })
  setTimeout(updateOffsets, 600)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600;700;900&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}
.font-sans {
  font-family: 'Montserrat', sans-serif;
}

/* 3D and Perspective */
.transform-style-3d {
  transform-style: preserve-3d;
}

/* Envelope Welcomer */
.envelope-flap {
  transform-origin: top center;
  transition: transform 0.8s ease-in-out, z-index 0.2s ease-in-out;
}

.flap-closed {
  transform: rotateX(0deg);
  z-index: 25;
}

.flap-open {
  transform: rotateX(180deg);
  z-index: 5;
}

.envelope-letter {
  top: 10%;
  bottom: 5%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.15), z-index 0.5s ease-in-out;
}

.letter-down {
  transform: translateY(0);
  z-index: 8;
}

.letter-up {
  transform: translateY(-58%);
  z-index: 22;
}

.fade-screen-leave-active {
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}
.fade-screen-leave-to {
  opacity: 0;
  transform: scale(1.08);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
