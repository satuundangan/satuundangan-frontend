<template>
  <div class="relative min-h-screen bg-[#fffbf6] overflow-hidden font-sans text-[#4a3a3a] selection:bg-[#ffbe9f] selection:text-[#4a3a3a]">
    
    <!-- Background Music -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" primaryColor="#ff9671" accentColor="#4a3a3a" class="z-[55]" />

    <!-- Desktop Sidebar Navigation (Floating 3D-styled dots) -->
    <nav v-if="!showWelcome" class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-[0_8px_16px_rgba(255,150,113,0.15)] border border-[#ffecd9] flex items-center justify-center transition-all duration-300 group relative hover:translate-x-[-4px]"
        :class="activeSection === item.id ? 'bg-gradient-to-br from-[#ff9671] to-[#ff7849] text-white scale-110 shadow-lg' : 'text-[#ff9671] hover:bg-[#ffece0]'">
        <i :class="[item.icon, 'text-sm']"></i>
        <span class="absolute right-16 px-3 py-1.5 bg-white text-[#4a3a3a] text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#ffece0]">
          {{ item.label }}
        </span>
      </button>
    </nav>
    
    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-[#ffece0] max-w-[92%] md:hidden flex overflow-x-auto no-scrollbar">
      <div class="flex items-center justify-center gap-6 px-6 py-3.5 mx-auto">
        <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-1 transition-all duration-300 shrink-0"
          :class="activeSection === item.id ? 'text-[#ff7849] scale-110 font-bold' : 'text-gray-400'">
          <i :class="[item.icon, 'text-base']"></i>
          <span class="text-[8px] font-bold uppercase tracking-wider">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- 3D ENVELOPE WELCOME SCREEN -->
    <transition name="fade-screen">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-br from-[#fff7f2] via-[#fffbf9] to-[#ffece0] px-4 overflow-hidden">
        <!-- Ambient Background Lights -->
        <div class="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-[#ff9671]/5 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-[#ffa87d]/5 blur-3xl pointer-events-none"></div>

        <div class="text-center mb-10 select-none animate-fade-in">
          <span class="text-[11px] uppercase font-black tracking-[0.3em] text-[#ff9671] mb-2 block">🐾 Meow-ry Invitation</span>
          <h2 class="text-4xl md:text-5xl font-serif text-[#4a3a3a] mt-1 font-bold">{{ data.groomName }} & {{ data.brideName }}</h2>
        </div>

        <!-- 3D ENVELOPE CONTAINER -->
        <div class="envelope-container relative w-[330px] h-[230px] md:w-[410px] md:h-[280px] perspective-[1500px]">
          <!-- The Envelope Wrapper with Interactive 3D Mouse/Touch Tilt -->
          <div class="envelope-wrapper w-full h-full relative transform-style-3d transition-transform duration-300 ease-out shadow-[0_20px_50px_rgba(255,150,113,0.2)] rounded-3xl"
               :class="{ 'is-open': envelopeOpen }"
               :style="getTiltStyle('envelope')"
               @mousemove="handleTilt($event, 'envelope')"
               @mouseleave="resetTilt('envelope')"
               @touchmove="handleTouchTilt($event, 'envelope')"
               @touchend="resetTilt('envelope')">
            
            <!-- 1. Envelope Back Panel -->
            <div class="envelope-back absolute inset-0 bg-gradient-to-br from-[#ffe7dc] to-[#ffd0be] rounded-3xl border border-[#f5b8a1] transform-style-3d"></div>

            <!-- 2. The Pop-Up Letter Card Inside -->
            <div class="envelope-letter absolute left-5 right-5 bg-white p-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-[#ffecd9] flex flex-col items-center justify-between text-center transition-all duration-1000 ease-in-out z-10"
                 :class="envelopeOpen ? 'letter-up' : 'letter-down'">
              <div class="space-y-3">
                <div class="flex justify-center gap-1"><i class="fa-solid fa-paw text-[#ff9671] text-xs"></i></div>
                <p class="text-[9px] uppercase tracking-[0.25em] text-[#ff9671] font-extrabold">Kepada Yth. Tamu Spesial</p>
                <h3 class="text-lg font-bold text-[#4a3a3a] max-w-[240px] truncate">{{ data.guestName || 'Tamu Undangan' }}</h3>
                <div class="h-[3px] w-12 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full"></div>
              </div>
              <button @click="openInvitation" class="w-full mt-5 py-3 bg-gradient-to-r from-[#ff9671] to-[#ff7849] hover:from-[#ff7849] hover:to-[#ff5c24] text-white text-[10px] uppercase tracking-widest font-black rounded-xl shadow-[0_6px_15px_rgba(255,120,73,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                Buka Undangan 🐾
              </button>
            </div>

            <!-- 3. Envelope Flap (Top fold - Folds up in 3D) -->
            <div class="envelope-flap absolute left-0 right-0 top-0 h-1/2 bg-[#ffcab9] border-t border-[#f7a992] rounded-t-3xl z-20 origin-top transition-transform duration-700 ease-in-out transform-style-3d"
                 :class="envelopeOpen ? 'flap-open' : 'flap-closed'">
                 <div class="flap-inside w-full h-full bg-[#fca287]/40 rounded-t-3xl"></div>
            </div>

            <!-- 4. Envelope Front Sides & Bottom (Isometric Fold Overlay) -->
            <div class="envelope-front absolute inset-0 bg-gradient-to-t from-[#ffd4c4] via-[#ffecd9]/40 to-transparent rounded-3xl z-20 pointer-events-none flex items-end justify-center pb-2">
              <div class="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-tr from-[#ffbe9f]/30 to-transparent rounded-l-3xl"></div>
              <div class="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-tl from-[#ffbe9f]/30 to-transparent rounded-r-3xl"></div>
            </div>

            <!-- 5. Interactive 3D Paw Wax Seal Stamp -->
            <div class="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 cursor-pointer"
                 :class="envelopeOpen ? 'scale-0 rotate-45 opacity-0' : 'scale-100 hover:scale-110 hover:rotate-3'"
                 @click="triggerEnvelope">
              <img src="/assets/images/clay-cat-paw.webp" alt="Wax Seal" class="w-18 h-18 md:w-22 md:h-22 drop-shadow-[0_8px_16px_rgba(255,120,73,0.4)]" />
              <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.25em] text-[#ff7849] font-black animate-pulse whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full border border-[#ffe0cc]">
                Klik Paw Seal
              </div>
            </div>
          </div>
        </div>

        <div class="mt-14 text-center text-xs text-gray-400 animate-pulse">
          <p>© satuundangan.id</p>
        </div>
      </div>
    </transition>

    <!-- MAIN FULL-SCREEN SCROLL-SNAP CONTAINER -->
    <div v-if="!showWelcome" id="main-content" @scroll="handleScroll"
         class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen w-full overflow-y-auto scroll-smooth snap-y snap-mandatory no-scrollbar pb-24 md:pb-0">
      
      <!-- SECTION 0: HERO (COVER STAGE) -->
      <section id="home" class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#fff7f2] to-[#fffbf6] shrink-0">
        <!-- 3D Parallax Far-Background Layers -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[20%] left-[10%] text-5xl text-[#ff9671]/10 filter blur-[0.5px]" :style="getParallaxStyle(0, 0.18, 0.05, 0)"><i class="fa-solid fa-cloud"></i></div>
          <div class="absolute top-[15%] right-[15%] text-7xl text-[#ff9671]/8 filter blur-[1px]" :style="getParallaxStyle(0, 0.12, -0.03, 0)"><i class="fa-solid fa-cloud"></i></div>
          <div class="absolute bottom-[30%] left-[25%] text-4xl text-[#ff9671]/10" :style="getParallaxStyle(0, 0.22, 0.04, 0)"><i class="fa-solid fa-paw"></i></div>
        </div>

        <!-- Midground Content -->
        <div class="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center px-6 z-20">
          <div class="space-y-6 text-center md:text-left popup-card" v-observe>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ffece0] rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff7849] border border-[#ffbe9f]">
              🐾 Meow! We Are Getting Married
            </div>
            <h1 class="text-6xl md:text-8xl font-serif text-[#4a3a3a] leading-none font-bold">
              {{ data.groomName }} <br><span class="text-3xl md:text-5xl italic text-[#ff9671] font-normal">&</span><br> {{ data.brideName }}
            </h1>
            <div class="h-1 w-20 bg-gradient-to-r from-[#ff9671] to-[#ff7849] rounded-full mx-auto md:mx-0"></div>
            <p class="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-[#ff7849]">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</p>
          </div>

          <div class="flex justify-center popup-card" v-observe>
            <div class="relative w-72 md:w-80 bg-white p-4 pb-10 shadow-[0_25px_50px_rgba(255,150,113,0.18)] border border-[#ffecd9] rounded-3xl transform-style-3d transition-transform duration-300 ease-out"
                 :style="getTiltStyle('heroCard')"
                 @mousemove="handleTilt($event, 'heroCard')"
                 @mouseleave="resetTilt('heroCard')"
                 @touchmove="handleTouchTilt($event, 'heroCard')"
                 @touchend="resetTilt('heroCard')">
              
              <!-- 3D Clay Ears protruding at top -->
              <div class="absolute -top-7 left-10 w-10 h-10 bg-white border-t border-l border-[#ffecd9] rounded-tr-[60%] transform rotate-[18deg]"></div>
              <div class="absolute -top-7 right-10 w-10 h-10 bg-white border-t border-r border-[#ffecd9] rounded-tl-[60%] transform rotate-[-18deg]"></div>
              
              <div class="aspect-[3/4] bg-gradient-to-br from-[#fff7f2] to-[#fff0e6] rounded-2xl overflow-hidden relative border border-[#ffebd4]">
                <img src="/assets/images/clay-cat-wedding.webp" alt="Wedding Cats" class="w-full h-full object-cover p-4 transform-style-3d scale-105" />
              </div>
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 text-2xl text-[#ff9671]"><i class="fa-solid fa-heart animate-pulse"></i></div>
            </div>
          </div>
        </div>

        <!-- 3D Parallax Foreground Layer (Fast Zoom Overlay) -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-16 h-16"
               :style="[getParallaxStyle(0, -0.35, 0.08, 0), { left: '8%', bottom: '20%' }]" />
          <img src="/assets/images/clay-cat-paw.webp" alt="Foreground Paw" class="absolute w-20 h-20"
               :style="[getParallaxStyle(0, -0.45, -0.06, 0), { right: '10%', bottom: '15%' }]" />
        </div>
      </section>

      <!-- SECTION 1: QUOTE (SCENIC LOVE QUOTE) -->
      <section class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#fffbf6] to-[#fff7f2] shrink-0">
        <!-- Far-Background -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[10%] left-[20%] text-6xl text-[#ff9671]/8" :style="getParallaxStyle(1, 0.15, -0.04, 0)"><i class="fa-solid fa-star"></i></div>
          <div class="absolute bottom-[20%] right-[20%] text-8xl text-[#ffbe9f]/10" :style="getParallaxStyle(1, 0.22, 0.05, 0)"><i class="fa-solid fa-heart-crack opacity-10"></i></div>
        </div>

        <!-- Midground Content Quote Card -->
        <div class="max-w-4xl mx-auto text-center space-y-8 px-6 z-20 popup-card" v-observe>
          <img src="/assets/images/clay-heart.webp" alt="Clay Heart" class="w-18 h-18 mx-auto drop-shadow-md animate-bounce" style="animation-duration: 4s;" />
          <p class="text-xl md:text-3xl italic leading-relaxed font-serif text-[#5a4848] px-4 font-semibold">
            "{{ data.quoteText || 'Dalam kehangatan dan kebersamaan, kita temukan makna persahabatan sejati dan cinta yang setia.' }}"
          </p>
          <div class="flex items-center justify-center gap-4">
             <div class="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#ffbe9f]"></div>
             <p class="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff7849]">{{ data.quoteSource || 'Paws & Promises Romance' }}</p>
             <div class="w-8 h-0.5 bg-gradient-to-l from-transparent to-[#ffbe9f]"></div>
          </div>
        </div>

        <!-- Foreground (Zoom-out items) -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-cat-paw.webp" alt="Foreground Paw" class="absolute w-22 h-22"
               :style="[getParallaxStyle(1, -0.38, 0.1, 0), { left: '12%', top: '25%' }]" />
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-14 h-14"
               :style="[getParallaxStyle(1, -0.28, -0.05, 0), { right: '15%', bottom: '25%' }]" />
        </div>
      </section>

      <!-- SECTION 2: MEMPELAI (COUPLE PROFILES) -->
      <section id="couple" class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#fff7f2] to-[#fffbf6] shrink-0">
        <!-- Far-Background -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[15%] left-[5%] text-7xl text-[#ff9671]/5" :style="getParallaxStyle(2, 0.12, 0.02, 0)"><i class="fa-solid fa-cat"></i></div>
          <div class="absolute bottom-[10%] right-[8%] text-8xl text-[#ff9671]/5" :style="getParallaxStyle(2, 0.18, -0.04, 0)"><i class="fa-solid fa-cat"></i></div>
        </div>

        <div class="w-full max-w-5xl px-6 z-20 flex flex-col justify-center h-full">
          <div class="text-center mb-10 popup-card" v-observe>
            <h2 class="text-4xl md:text-5xl font-serif text-[#4a3a3a] font-bold">Mempelai Pria & Wanita</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          
          <div class="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto w-full">
            <!-- Groom Card (3D Tilt) -->
            <div class="flex-1 bg-white p-5 pb-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.12)] border border-[#ffecd9] text-center flex flex-col justify-between items-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('groomCard')"
                 @mousemove="handleTilt($event, 'groomCard')"
                 @mouseleave="resetTilt('groomCard')"
                 @touchmove="handleTouchTilt($event, 'groomCard')"
                 @touchend="resetTilt('groomCard')"
                 v-observe>
              <div class="space-y-5">
                <div class="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-br from-[#fff7f2] to-[#ffe5db] border border-[#ffbe9f] flex items-center justify-center mx-auto">
                  <div class="absolute -top-2 left-3 w-6 h-6 bg-white border-t border-l border-[#ffbe9f] rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-2 right-3 w-6 h-6 bg-white border-t border-r border-[#ffbe9f] rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full" />
                </div>
                <div class="space-y-1.5">
                  <span class="text-[8px] uppercase tracking-widest font-black text-[#ff7849] bg-[#ffece0] px-3 py-0.5 rounded-full border border-[#ffbe9f]">The Groom</span>
                  <h3 class="text-2xl font-serif text-[#4a3a3a] font-bold mt-1">{{ data.groomName }}</h3>
                  <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Putra dari <br><span class="font-bold text-[#4a3a3a]">{{ data.parents?.groomParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="mt-4 px-5 py-2 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] rounded-xl text-[8px] uppercase tracking-widest font-black text-[#ff7849] hover:text-white transition-all border border-[#ffc9b4]"><i class="fa-brands fa-instagram mr-1.5"></i>Instagram</a>
            </div>

            <!-- Bride Card (3D Tilt) -->
            <div class="flex-1 bg-white p-5 pb-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.12)] border border-[#ffecd9] text-center flex flex-col justify-between items-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('brideCard')"
                 @mousemove="handleTilt($event, 'brideCard')"
                 @mouseleave="resetTilt('brideCard')"
                 @touchmove="handleTouchTilt($event, 'brideCard')"
                 @touchend="resetTilt('brideCard')"
                 v-observe>
              <div class="space-y-5">
                <div class="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-br from-[#fff7f2] to-[#ffe5db] border border-[#ffbe9f] flex items-center justify-center mx-auto">
                  <div class="absolute -top-2 left-3 w-6 h-6 bg-white border-t border-l border-[#ffbe9f] rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-2 right-3 w-6 h-6 bg-white border-t border-r border-[#ffbe9f] rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full" />
                </div>
                <div class="space-y-1.5">
                  <span class="text-[8px] uppercase tracking-widest font-black text-[#ff7849] bg-[#ffece0] px-3 py-0.5 rounded-full border border-[#ffbe9f]">The Bride</span>
                  <h3 class="text-2xl font-serif text-[#4a3a3a] font-bold mt-1">{{ data.brideName }}</h3>
                  <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Putri dari <br><span class="font-bold text-[#4a3a3a]">{{ data.parents?.brideParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="mt-4 px-5 py-2 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] rounded-xl text-[8px] uppercase tracking-widest font-black text-[#ff7849] hover:text-white transition-all border border-[#ffc9b4]"><i class="fa-brands fa-instagram mr-1.5"></i>Instagram</a>
            </div>
          </div>
        </div>

        <!-- Foreground Parallax Layer -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-14 h-14"
               :style="[getParallaxStyle(2, -0.25, 0.06, 0), { left: '6%', bottom: '25%' }]" />
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-16 h-16"
               :style="[getParallaxStyle(2, -0.32, -0.04, 0), { right: '6%', top: '20%' }]" />
        </div>
      </section>

      <!-- SECTION 3: STORY (LOVE TIMELINE STAGE) -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#fffbf6] to-[#fff7f2] shrink-0">
        <!-- Far-Background -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[20%] right-[10%] text-6xl text-[#ff9671]/5" :style="getParallaxStyle(3, 0.15, -0.03, 0)"><i class="fa-solid fa-heart opacity-20"></i></div>
          <div class="absolute bottom-[20%] left-[10%] text-7xl text-[#ffbe9f]/10" :style="getParallaxStyle(3, 0.22, 0.05, 0)"><i class="fa-solid fa-cat opacity-10"></i></div>
        </div>

        <div class="w-full max-w-5xl px-6 z-20 flex flex-col justify-center h-full">
          <div class="text-center mb-10 popup-card" v-observe>
            <h2 class="text-4xl md:text-5xl font-serif text-[#4a3a3a] font-bold">Kisah Cinta Kami 🐾</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory.slice(0, 3) : mockStories)" :key="idx"
                 class="bg-[#fffbf6] p-5 rounded-[2rem] border border-[#ffecd9] shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-[0_15px_30px_rgba(255,150,113,0.15)] hover:border-[#ffbe9f] transition-all duration-500 popup-card"
                 v-observe>
               <div class="space-y-3">
                 <div v-if="story.image || isPreviewMode" class="aspect-[4/3] rounded-2xl overflow-hidden relative border border-[#ffecd9]">
                    <img :src="story.image || 'https://via.placeholder.com/600x400'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 </div>
                 <div class="space-y-1.5">
                    <span class="inline-block text-[8px] font-black text-[#ff7849] uppercase tracking-wider bg-[#ffece0] px-2.5 py-0.5 rounded-full">{{ story.date }}</span>
                    <h3 class="text-xl font-serif text-[#4a3a3a] font-bold">{{ story.title }}</h3>
                    <p class="text-[11px] leading-relaxed text-[#7a6060] line-clamp-3">{{ story.description }}</p>
                 </div>
               </div>
               <div class="pt-3 border-t border-[#ffebe0] text-[#ff9671] flex justify-between items-center">
                 <i class="fa-solid fa-paw text-xs"></i>
                 <span class="text-[8px] uppercase font-bold tracking-widest text-[#ffbe9f]">Chapter {{ idx+1 }}</span>
               </div>
            </div>
          </div>
        </div>

        <!-- Foreground Parallax Layer -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-cat-paw.webp" alt="Foreground Paw" class="absolute w-20 h-20"
               :style="[getParallaxStyle(3, -0.35, 0.08, 0), { left: '10%', bottom: '15%' }]" />
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-12 h-12"
               :style="[getParallaxStyle(3, -0.28, -0.05, 0), { right: '12%', top: '25%' }]" />
        </div>
      </section>

      <!-- SECTION 4: EVENT (AKAD & RESEPSI PANELS) -->
      <section id="event" v-if="isSectionEnabled('event')" class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#fff7f2] to-[#fffbf6] shrink-0">
        <!-- Far-Background -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[20%] left-[8%] text-7xl text-[#ff9671]/6" :style="getParallaxStyle(4, 0.15, 0.03, 0)"><i class="fa-solid fa-envelope"></i></div>
          <div class="absolute bottom-[20%] right-[10%] text-8xl text-[#ffbe9f]/8" :style="getParallaxStyle(4, 0.22, -0.05, 0)"><i class="fa-solid fa-bell"></i></div>
        </div>

        <div class="w-full max-w-5xl px-6 z-20 flex flex-col justify-center h-full">
          <div class="text-center mb-10 popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Waktu & Lokasi Acara</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            <!-- Akad Card (3D Tilt) -->
            <div class="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.1)] border border-[#ffecd9] space-y-5 text-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('akadCard')"
                 @mousemove="handleTilt($event, 'akadCard')"
                 @mouseleave="resetTilt('akadCard')"
                 @touchmove="handleTouchTilt($event, 'akadCard')"
                 @touchend="resetTilt('akadCard')"
                 v-observe>
              <div class="w-12 h-12 bg-[#ffece0] text-[#ff7849] rounded-2xl flex items-center justify-center mx-auto text-xl border border-[#ffbe9f] shadow-inner"><i class="fa-solid fa-ring"></i></div>
              <div class="space-y-1">
                <h3 class="text-2xl font-serif text-[#4a3a3a] font-bold">Akad Nikah</h3>
                <p class="text-[9px] uppercase tracking-wider font-extrabold text-[#ff7849] bg-[#ffece0] px-2.5 py-0.5 rounded-full inline-block border border-[#ffbe9f]">{{ formatDate(data.akadLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-2 pt-4 border-t border-[#ffece0] text-xs font-semibold">
                <p class="flex items-center justify-center gap-1.5 text-[#4a3a3a]"><i class="fa-regular fa-clock text-[#ff7849] text-sm"></i> Pukul {{ formatTime(data.akadLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-[11px] text-[#7a6060] font-normal leading-relaxed px-4 line-clamp-2">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="block w-full py-3 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[9px] rounded-xl transition-all border border-[#ffc9b4]">
                Petunjuk Maps 🗺️
              </a>
            </div>

            <!-- Resepsi Card (3D Tilt) -->
            <div v-if="!data.mergeEvents" class="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.1)] border border-[#ffecd9] space-y-5 text-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('resepsiCard')"
                 @mousemove="handleTilt($event, 'resepsiCard')"
                 @mouseleave="resetTilt('resepsiCard')"
                 @touchmove="handleTouchTilt($event, 'resepsiCard')"
                 @touchend="resetTilt('resepsiCard')"
                 v-observe>
              <div class="w-12 h-12 bg-[#ffece0] text-[#ff7849] rounded-2xl flex items-center justify-center mx-auto text-xl border border-[#ffbe9f] shadow-inner"><i class="fa-solid fa-champagne-glasses"></i></div>
              <div class="space-y-1">
                <h3 class="text-2xl font-serif text-[#4a3a3a] font-bold">Resepsi</h3>
                <p class="text-[9px] uppercase tracking-wider font-extrabold text-[#ff7849] bg-[#ffece0] px-2.5 py-0.5 rounded-full inline-block border border-[#ffbe9f]">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-2 pt-4 border-t border-[#ffece0] text-xs font-semibold">
                <p class="flex items-center justify-center gap-1.5 text-[#4a3a3a]"><i class="fa-regular fa-clock text-[#ff7849] text-sm"></i> Pukul {{ formatTime(data.resepsiLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-[11px] text-[#7a6060] font-normal leading-relaxed px-4 line-clamp-2">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="block w-full py-3 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[9px] rounded-xl transition-all border border-[#ffc9b4]">
                Petunjuk Maps 🗺️
              </a>
            </div>
          </div>
        </div>

        <!-- Foreground Parallax Layer -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-14 h-14"
               :style="[getParallaxStyle(4, -0.32, 0.06, 0), { left: '15%', top: '15%' }]" />
          <img src="/assets/images/clay-cat-paw.webp" alt="Foreground Paw" class="absolute w-16 h-16"
               :style="[getParallaxStyle(4, -0.25, -0.05, 0), { right: '12%', bottom: '25%' }]" />
        </div>
      </section>

      <!-- SECTION 5: GALLERY (SCENIC SNAPSHOTS) -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#fffbf6] shrink-0">
        <!-- Far-Background -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[15%] left-[8%] text-7xl text-[#ff9671]/4" :style="getParallaxStyle(5, 0.12, 0.02, 0)"><i class="fa-solid fa-camera"></i></div>
          <div class="absolute bottom-[20%] right-[10%] text-6xl text-[#ffbe9f]/6" :style="getParallaxStyle(5, 0.2, -0.04, 0)"><i class="fa-solid fa-image"></i></div>
        </div>

        <div class="w-full max-w-5xl px-6 z-20 flex flex-col justify-center h-full">
          <div class="text-center mb-8 popup-card" v-observe>
            <h2 class="text-4xl md:text-5xl font-serif text-[#4a3a3a] font-bold">Galeri Foto</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          <div class="p-4 bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.12)] border border-[#ffecd9] popup-card" v-observe>
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>

        <!-- Foreground Parallax -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-14 h-14"
               :style="[getParallaxStyle(5, -0.3, 0.05, 0), { left: '10%', bottom: '20%' }]" />
        </div>
      </section>

      <!-- SECTION 6: GIFT (INTERACTIVE WALLTET COVERS) -->
      <section id="gift" v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.eWalletLink?.length)" class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-white shrink-0">
        <!-- Far-Background -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[10%] left-[20%] text-6xl text-[#ff9671]/4" :style="getParallaxStyle(6, 0.15, -0.04, 0)"><i class="fa-solid fa-gift"></i></div>
          <div class="absolute bottom-[20%] right-[20%] text-8xl text-[#ffbe9f]/6" :style="getParallaxStyle(6, 0.22, 0.05, 0)"><i class="fa-solid fa-envelope-open"></i></div>
        </div>

        <div class="w-full max-w-5xl px-6 z-20 flex flex-col justify-center h-full">
          <div class="text-center mb-10 popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Kado Digital</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto w-full">
            <div v-for="(bank, idx) in data.bankAccounts.slice(0, 2)" :key="idx"
                 class="p-6 bg-[#fffbf6] border border-[#ffecd9] rounded-[2.5rem] w-full sm:w-[320px] shadow-sm text-left flex flex-col justify-between transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('bankCard_' + idx)"
                 @mousemove="handleTilt($event, 'bankCard_' + idx)"
                 @mouseleave="resetTilt('bankCard_' + idx)"
                 @touchmove="handleTouchTilt($event, 'bankCard_' + idx)"
                 @touchend="resetTilt('bankCard_' + idx)"
                 v-observe>
              <div>
                <div class="flex justify-between items-center mb-5">
                   <p class="text-base font-black uppercase tracking-wider text-[#ff7849]">{{ bank.bankName }}</p>
                   <div class="w-10 h-10 bg-white rounded-2xl border border-[#ffbe9f] flex items-center justify-center text-[#ff7849] shadow-sm"><i class="fa-solid fa-wallet"></i></div>
                </div>
                <p class="text-xl font-bold tracking-wider mb-1 text-[#4a3a3a] font-mono">{{ bank.accountNumber }}</p>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest font-sans">A.N {{ bank.accountName }}</p>
              </div>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full mt-6 py-2.5 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[9px] rounded-xl transition-all shadow-sm border border-[#ffc9b4]">
                Salin Rekening 📋
              </button>
            </div>
          </div>
        </div>

        <!-- Foreground Parallax -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-cat-paw.webp" alt="Foreground Paw" class="absolute w-20 h-20"
               :style="[getParallaxStyle(6, -0.35, 0.08, 0), { right: '15%', top: '25%' }]" />
        </div>
      </section>

      <!-- SECTION 7: RSVP (WISHES & FOOTER STAGE) -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="snap-start h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#fffbf6] shrink-0">
        <!-- Far-Background -->
        <div class="absolute inset-0 pointer-events-none select-none">
          <div class="absolute top-[10%] right-[15%] text-7xl text-[#ff9671]/4" :style="getParallaxStyle(7, 0.12, -0.02, 0)"><i class="fa-solid fa-moon"></i></div>
          <div class="absolute bottom-[20%] left-[8%] text-8xl text-[#ffbe9f]/6" :style="getParallaxStyle(7, 0.18, 0.04, 0)"><i class="fa-solid fa-paw opacity-10"></i></div>
        </div>

        <!-- Main Form & Footer stacked inside the snap panel -->
        <div class="w-full max-w-2xl px-6 z-20 flex flex-col justify-between h-[85vh]">
          
          <form @submit.prevent="submitRSVP" class="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.1)] border border-[#ffecd9] space-y-4 popup-card" v-observe>
            <div class="text-center">
              <h2 class="text-3xl font-serif text-[#4a3a3a] font-bold">Konfirmasi Kehadiran</h2>
              <div class="w-10 h-1 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-1.5"></div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[8px] uppercase tracking-widest font-black text-[#ff7849] px-1">Nama Lengkap</label>
                <input v-model="rsvp.name" type="text" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-2 px-3 text-xs font-semibold focus:border-[#ff9671] focus:bg-white outline-none transition-colors" required />
              </div>
              
              <div class="space-y-1">
                <label class="text-[8px] uppercase tracking-widest font-black text-[#ff7849] px-1">Jumlah Tamu</label>
                <select v-model="rsvp.totalGuests" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-2 px-3 text-xs font-semibold focus:border-[#ff9671] outline-none">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-1">
               <label class="text-[8px] uppercase tracking-widest font-black text-[#ff7849] px-1">Konfirmasi Kehadiran</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-2 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[9px]" :class="rsvp.attendance === 'hadir' ? 'border-[#ff9671] bg-gradient-to-br from-[#ff9671] to-[#ff7849] text-white shadow-sm' : 'border-[#ffecd9] bg-[#fffbf6] text-gray-500'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Hadir 🐾
                 </label>
                 <label class="flex-1 py-2 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[9px]" :class="rsvp.attendance === 'tidak' ? 'border-red-400 bg-gradient-to-br from-red-400 to-red-500 text-white shadow-sm' : 'border-[#ffecd9] bg-[#fffbf6] text-gray-500'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Tidak Hadir
                 </label>
               </div>
            </div>

            <div class="space-y-1">
               <label class="text-[8px] uppercase tracking-widest font-black text-[#ff7849] px-1">Ucapan & Doa Restu</label>
               <textarea v-model="rsvp.message" rows="2" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-2 px-3 text-xs font-normal focus:border-[#ff9671] focus:bg-white outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-3 bg-gradient-to-r from-[#ff9671] to-[#ff7849] hover:from-[#ff7849] hover:to-[#ff5c24] text-white text-[9px] uppercase tracking-widest font-black rounded-xl shadow-md transition-all duration-300">Kirim Konfirmasi 🐾</button>
          </form>

          <!-- Standard Scenic Footer -->
          <footer class="py-6 text-center space-y-3 relative z-20 border-t border-[#ffecd9]/50">
            <h2 class="font-serif text-2xl font-bold text-[#4a3a3a]">{{ data.groomName }} & {{ data.brideName }}</h2>
            <p class="text-[8px] uppercase tracking-widest font-extrabold text-gray-400">Created with ❤️ by satuundangan.id</p>
          </footer>
        </div>

        <!-- Foreground Parallax -->
        <div class="absolute inset-0 pointer-events-none select-none z-30">
          <img src="/assets/images/clay-heart.webp" alt="Foreground Heart" class="absolute w-14 h-14"
               :style="[getParallaxStyle(7, -0.3, 0.05, 0), { left: '10%', bottom: '15%' }]" />
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
  
  const tiltX = (y / (rect.height / 2)) * -14
  const tiltY = (x / (rect.width / 2)) * 14
  
  if (!tiltState.value[key]) {
    tiltState.value[key] = { x: 0, y: 0, s: 1 }
  }
  
  tiltState.value[key].x = tiltX
  tiltState.value[key].y = tiltY
  tiltState.value[key].s = 1.03
}

// TOUCHMOVE TILT HANDLER (MOBILE / TOUCHSCREEN)
function handleTouchTilt(e, key) {
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0]
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = touch.clientX - rect.left - rect.width / 2
    const y = touch.clientY - rect.top - rect.height / 2
    
    const tiltX = (y / (rect.height / 2)) * -12
    const tiltY = (x / (rect.width / 2)) * 12
    
    if (!tiltState.value[key]) {
      tiltState.value[key] = { x: 0, y: 0, s: 1 }
    }
    
    tiltState.value[key].x = tiltX
    tiltState.value[key].y = tiltY
    tiltState.value[key].s = 1.02
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
    transform: `perspective(1000px) rotateX(${state.x}deg) rotateY(${state.y}deg) scale3d(${state.s}, ${state.s}, 1)`
  }
}

// SCROLL PARALLAX BINDING
const scrollY = ref(0)
const sectionHeight = ref(800)

function handleScroll(e) {
  scrollY.value = e.target.scrollTop
}

onMounted(() => {
  sectionHeight.value = window.innerHeight
  window.addEventListener('resize', () => {
    sectionHeight.value = window.innerHeight
  })
})

// FULL PARALLAX TRANSFORM STYLE
function getParallaxStyle(sectionIndex, speed, rotateSpeed = 0, initialY = 0) {
  const sectionOffset = sectionIndex * sectionHeight.value
  const relativeScroll = scrollY.value - sectionOffset
  
  // Only calculate style if the section is close to viewport to optimize rendering
  if (Math.abs(relativeScroll) < sectionHeight.value * 1.5) {
    const yOffset = relativeScroll * speed + initialY
    const rotate = relativeScroll * rotateSpeed
    return {
      transform: `translate3d(0, ${yOffset}px, 0) rotate(${rotate}deg)`,
      willChange: 'transform'
    }
  }
  return {
    transform: `translate3d(0, ${initialY}px, 0)`
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

// 3D POP-UP CARD ENTRY DIRECTIVE
const vObserve = {
  mounted: (el) => {
    el.classList.add('popup-card')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.15 })
    observer.observe(el)
  }
}

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
    }, 100)
  }, 1100)
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activeSection.value = e.target.id })
  }, { threshold: 0.45 })
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

onMounted(() => { initData() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600;700&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}
.font-sans {
  font-family: 'Montserrat', sans-serif;
}

/* 3D Transform and Perspective classes */
.transform-style-3d {
  transform-style: preserve-3d;
}

/* Envelope 3D Fold Styles */
.envelope-flap {
  transform-origin: top center;
  transition: transform 0.7s ease-in-out, z-index 0.2s ease-in-out;
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

/* 3D Pop-Up Card Fold Styles */
.popup-card {
  opacity: 0;
  transform: perspective(1000px) rotateX(-15deg) translateZ(-40px) scale(0.96);
  transform-origin: bottom center;
  transition: opacity 1s cubic-bezier(0.19, 1, 0.22, 1), transform 1s cubic-bezier(0.19, 1, 0.22, 1);
}

.popup-card.is-visible {
  opacity: 1;
  transform: perspective(1000px) rotateX(0deg) translateZ(0) scale(1);
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
