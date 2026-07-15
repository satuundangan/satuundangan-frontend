<template>
  <div class="relative min-h-screen bg-[#fffcf9] overflow-hidden font-sans text-[#4a3a3a] selection:bg-[#ffbe9f] selection:text-[#4a3a3a]">
    
    <!-- Music Control -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" primaryColor="#ff9671" accentColor="#4a3a3a" class="z-[55]" />

    <!-- Desktop Floating Sidebar Navigation -->
    <nav v-if="!showWelcome" class="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-[0_8px_20px_rgba(255,150,113,0.15)] border border-[#ffecd9] flex items-center justify-center transition-all duration-300 group relative hover:translate-x-[-4px]"
        :class="activeSection === item.id ? 'bg-gradient-to-br from-[#ff9671] to-[#ff7849] text-white scale-110 shadow-lg' : 'text-[#ff9671] hover:bg-[#ffece0]'">
        <i :class="[item.icon, 'text-sm']"></i>
        <span class="absolute right-16 px-3 py-1.5 bg-white text-[#4a3a3a] text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#ffece0]">
          {{ item.label }}
        </span>
      </button>
    </nav>
    
    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#ffece0] max-w-[92%] md:hidden flex overflow-x-auto no-scrollbar">
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
        <!-- Ambient Lights -->
        <div class="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-[#ff9671]/5 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-[#ffa87d]/5 blur-3xl pointer-events-none"></div>

        <div class="text-center mb-10 select-none animate-fade-in">
          <span class="text-[11px] uppercase font-black tracking-[0.3em] text-[#ff9671] mb-2 block">🐾 Meow-ry Invitation</span>
          <h2 class="text-4xl md:text-5xl font-serif text-[#4a3a3a] mt-1 font-bold">{{ data.groomName }} & {{ data.brideName }}</h2>
        </div>

        <!-- 3D Envelope Container -->
        <div class="envelope-container relative w-[330px] h-[230px] md:w-[410px] md:h-[280px] perspective-[1500px]">
          <div class="envelope-wrapper w-full h-full relative transform-style-3d transition-transform duration-300 ease-out shadow-[0_20px_50px_rgba(255,150,113,0.2)] rounded-3xl"
               :class="{ 'is-open': envelopeOpen }"
               :style="getTiltStyle('envelope')"
               @mousemove="handleTilt($event, 'envelope')"
               @mouseleave="resetTilt('envelope')"
               @touchmove="handleTouchTilt($event, 'envelope')"
               @touchend="resetTilt('envelope')">
            
            <div class="envelope-back absolute inset-0 bg-gradient-to-br from-[#ffe7dc] to-[#ffd0be] rounded-3xl border border-[#f5b8a1] transform-style-3d"></div>

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

            <div class="envelope-flap absolute left-0 right-0 top-0 h-1/2 bg-[#ffcab9] border-t border-[#f7a992] rounded-t-3xl z-20 origin-top transition-transform duration-700 ease-in-out transform-style-3d"
                 :class="envelopeOpen ? 'flap-open' : 'flap-closed'">
                 <div class="flap-inside w-full h-full bg-[#fca287]/40 rounded-t-3xl"></div>
            </div>

            <div class="envelope-front absolute inset-0 bg-gradient-to-t from-[#ffd4c4] via-[#ffecd9]/40 to-transparent rounded-3xl z-20 pointer-events-none flex items-end justify-center pb-2">
              <div class="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-tr from-[#ffbe9f]/30 to-transparent rounded-l-3xl"></div>
              <div class="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-tl from-[#ffbe9f]/30 to-transparent rounded-r-3xl"></div>
            </div>

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

    <!-- MAIN SCROLLABLE CONTAINER (NORMAL SCROLL FLOW, NO VIEWPORT SNAPPING) -->
    <div v-if="!showWelcome" id="main-content" @scroll="handleScroll" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen w-full overflow-y-auto scroll-smooth pb-16 md:pb-24">
      
      <!-- HERO COVER SECTION -->
      <section id="home" class="relative py-20 md:py-36 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 min-h-[90vh]">
        <!-- Hero Left Column: Editorial Large Typography -->
        <div class="w-full md:w-1/2 space-y-8 text-center md:text-left z-20">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ffece0] rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff7849] border border-[#ffbe9f] shadow-sm">
            🐾 Meow! We Are Getting Married
          </div>
          <h1 class="text-6xl sm:text-7xl md:text-8xl font-serif text-[#4a3a3a] leading-[0.95] font-black">
            {{ data.groomName }} <br>
            <span class="text-4xl md:text-6xl italic text-[#ff9671] font-normal">&amp;</span> <br>
            {{ data.brideName }}
          </h1>
          <div class="h-1.5 w-24 bg-gradient-to-r from-[#ff9671] to-[#ff7849] rounded-full mx-auto md:mx-0"></div>
          <div class="space-y-1">
            <p class="text-xs md:text-sm font-extrabold uppercase tracking-[0.4em] text-[#ff7849]">Save the Date</p>
            <p class="text-sm md:text-base font-bold text-gray-500">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</p>
          </div>
        </div>

        <!-- Hero Right Column: HUGE Parallax 3D Clay Card -->
        <div class="w-full md:w-1/2 flex justify-center z-10 md:pr-12">
          <!-- Huge card translating upwards as scroll happens -->
          <div class="relative w-80 sm:w-96 md:w-[440px] bg-white p-5 pb-12 shadow-[0_30px_70px_rgba(255,150,113,0.22)] border border-[#ffecd9] rounded-[2.5rem] transform-style-3d transition-transform duration-100 ease-out"
               :style="[getTiltStyle('heroCard'), getParallaxStyle(-0.15, 0, 0)]"
               @mousemove="handleTilt($event, 'heroCard')"
               @mouseleave="resetTilt('heroCard')"
               @touchmove="handleTouchTilt($event, 'heroCard')"
               @touchend="resetTilt('heroCard')">
            
            <!-- Protruding Cat Ears -->
            <div class="absolute -top-10 left-12 w-14 h-14 bg-white border-t border-l border-[#ffecd9] rounded-tr-[60%] transform rotate-[18deg]"></div>
            <div class="absolute -top-10 right-12 w-14 h-14 bg-white border-t border-r border-[#ffecd9] rounded-tl-[60%] transform rotate-[-18deg]"></div>
            
            <div class="aspect-[3/4] bg-gradient-to-br from-[#fff8f4] to-[#ffeedf] rounded-[2rem] overflow-hidden relative border border-[#ffe0cc] shadow-inner">
              <img src="/assets/images/clay-cat-wedding.webp" alt="Wedding Cats" class="w-full h-full object-cover p-6 scale-105" />
            </div>
            
            <!-- Absolute Floating Elements on the Card itself -->
            <div class="absolute -bottom-6 -left-6 w-20 h-20 pointer-events-none">
              <img src="/assets/images/clay-heart.webp" alt="Clay Heart" class="w-full h-full object-contain drop-shadow-md animate-pulse" />
            </div>
            <div class="absolute -top-6 -right-6 w-20 h-20 pointer-events-none">
              <img src="/assets/images/clay-cat-paw.webp" alt="Clay Paw" class="w-full h-full object-contain drop-shadow-md rotate-12" />
            </div>
          </div>
        </div>
      </section>

      <!-- QUOTE SECTION -->
      <section class="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-[#fffbf9] to-[#fff8f4] z-20">
        <!-- Huge Background Parallax Heart -->
        <img src="/assets/images/clay-heart.webp" alt="Huge Heart" 
             class="absolute w-44 h-44 md:w-64 md:h-64 opacity-[0.08] select-none pointer-events-none"
             :style="[getParallaxStyle(0.12, 0.03, vh * 0.5), { left: '15%', top: '10%' }]" />
             
        <div class="max-w-4xl mx-auto text-center space-y-10 relative z-20">
          <p class="text-2xl sm:text-3xl md:text-4xl italic leading-relaxed font-serif text-[#5a4848] px-4 font-semibold">
            "{{ data.quoteText || 'Dalam kehangatan dan kebersamaan, kita temukan makna persahabatan sejati dan cinta yang setia.' }}"
          </p>
          <div class="flex items-center justify-center gap-4">
             <div class="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#ffbe9f]"></div>
             <p class="text-xs font-black uppercase tracking-[0.4em] text-[#ff7849]">{{ data.quoteSource || 'Paws & Promises Romance' }}</p>
             <div class="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#ffbe9f]"></div>
          </div>
        </div>
      </section>

      <!-- COUPLE SECTION (ASYMMETRICAL GRID WITH OVERLAPPING PARALLAX CARDS) -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="relative py-32 md:py-48 px-6 bg-[#fffcf9]">
        <!-- Huge Background Parallax Paw -->
        <img src="/assets/images/clay-cat-paw.webp" alt="Huge Paw" 
             class="absolute w-52 h-52 md:w-80 md:h-80 opacity-[0.06] select-none pointer-events-none"
             :style="[getParallaxStyle(0.1, -0.02, vh * 1.2), { right: '10%', top: '20%' }]" />

        <div class="max-w-6xl mx-auto z-20 relative">
          <div class="text-center mb-24">
            <h2 class="text-5xl md:text-6xl font-serif text-[#4a3a3a] font-black">Mempelai Pria &amp; Wanita</h2>
            <div class="w-20 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-4"></div>
          </div>
          
          <!-- Asymmetrical Overlapping Grid -->
          <div class="flex flex-col md:flex-row justify-center items-start gap-16 md:gap-8 max-w-5xl mx-auto w-full relative min-h-[700px]">
            
            <!-- Groom Card (Left aligned, scrolls slower) -->
            <div class="w-full md:w-[46%] bg-white p-8 pb-12 rounded-[3rem] shadow-[0_20px_50px_rgba(255,150,113,0.14)] border border-[#ffecd9] flex flex-col justify-between items-center transform-style-3d transition-transform duration-100 ease-out z-20"
                 :style="[getTiltStyle('groomCard'), getParallaxStyle(0.04, 0, vh * 1.5)]"
                 @mousemove="handleTilt($event, 'groomCard')"
                 @mouseleave="resetTilt('groomCard')"
                 @touchmove="handleTouchTilt($event, 'groomCard')"
                 @touchend="resetTilt('groomCard')">
              <div class="space-y-8 w-full text-center">
                <!-- Circular Avatar Frame with Ears -->
                <div class="relative w-52 h-52 rounded-full p-2 bg-gradient-to-br from-[#fff7f2] to-[#ffe5db] border border-[#ffbe9f] shadow-inner flex items-center justify-center mx-auto">
                  <div class="absolute -top-2 left-6 w-8 h-8 bg-white border-t border-l border-[#ffbe9f] rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-2 right-6 w-8 h-8 bg-white border-t border-r border-[#ffbe9f] rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full shadow-md" />
                </div>
                <div class="space-y-3">
                  <span class="inline-block text-[10px] uppercase tracking-widest font-black text-[#ff7849] bg-[#ffece0] px-4 py-1 rounded-full border border-[#ffbe9f]">The Groom</span>
                  <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold mt-2">{{ data.groomName }}</h3>
                  <p class="text-xs text-gray-500 font-semibold leading-relaxed">Putra dari pasangan <br><span class="font-bold text-[#4a3a3a] text-sm">{{ data.parents?.groomParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="mt-8 px-6 py-3 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] rounded-2xl text-[9px] uppercase tracking-widest font-black text-[#ff7849] hover:text-white transition-all shadow-sm border border-[#ffc9b4]"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>

            <!-- Bride Card (Right aligned, shifted down, scrolls FASTER to create slide-past/overlap) -->
            <div class="w-full md:w-[46%] md:mt-32 bg-white p-8 pb-12 rounded-[3rem] shadow-[0_25px_60px_rgba(255,150,113,0.15)] border border-[#ffecd9] flex flex-col justify-between items-center transform-style-3d transition-transform duration-100 ease-out z-10"
                 :style="[getTiltStyle('brideCard'), getParallaxStyle(-0.1, 0, vh * 1.5)]"
                 @mousemove="handleTilt($event, 'brideCard')"
                 @mouseleave="resetTilt('brideCard')"
                 @touchmove="handleTouchTilt($event, 'brideCard')"
                 @touchend="resetTilt('brideCard')">
              <div class="space-y-8 w-full text-center">
                <!-- Circular Avatar Frame with Ears -->
                <div class="relative w-52 h-52 rounded-full p-2 bg-gradient-to-br from-[#fff7f2] to-[#ffe5db] border border-[#ffbe9f] shadow-inner flex items-center justify-center mx-auto">
                  <div class="absolute -top-2 left-6 w-8 h-8 bg-white border-t border-l border-[#ffbe9f] rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-2 right-6 w-8 h-8 bg-white border-t border-r border-[#ffbe9f] rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full shadow-md" />
                </div>
                <div class="space-y-3">
                  <span class="inline-block text-[10px] uppercase tracking-widest font-black text-[#ff7849] bg-[#ffece0] px-4 py-1 rounded-full border border-[#ffbe9f]">The Bride</span>
                  <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold mt-2">{{ data.brideName }}</h3>
                  <p class="text-xs text-gray-500 font-semibold leading-relaxed">Putri dari pasangan <br><span class="font-bold text-[#4a3a3a] text-sm">{{ data.parents?.brideParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="mt-8 px-6 py-3 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] rounded-2xl text-[9px] uppercase tracking-widest font-black text-[#ff7849] hover:text-white transition-all shadow-sm border border-[#ffc9b4]"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>

          </div>
        </div>
      </section>

      <!-- LOVE STORY SECTION -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="relative py-32 px-6 bg-gradient-to-b from-[#fffcf9] to-white z-20">
        <div class="max-w-6xl mx-auto space-y-20 relative">
          <div class="text-center mb-16">
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-black">Kisah Cinta Kami 🐾</h2>
            <div class="w-20 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-4"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <!-- Timelines cards overlapping naturally -->
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory.slice(0, 3) : mockStories)" :key="idx"
                 class="bg-[#fffbf6] p-6 rounded-[2.5rem] border border-[#ffecd9] shadow-sm space-y-6 flex flex-col justify-between group hover:shadow-[0_20px_40px_rgba(255,150,113,0.15)] hover:border-[#ffbe9f] transition-all duration-500"
                 :style="getParallaxStyle(idx === 0 ? 0.05 : idx === 1 ? -0.06 : 0.08, 0, vh * 2.2)">
               <div class="space-y-4">
                 <div v-if="story.image || isPreviewMode" class="aspect-[4/3] rounded-2xl overflow-hidden relative border border-[#ffecd9] shadow-inner">
                    <img :src="story.image || 'https://via.placeholder.com/600x400'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 </div>
                 <div class="space-y-2">
                    <span class="inline-block text-[9px] font-black text-[#ff7849] uppercase tracking-wider bg-[#ffece0] px-3 py-1 rounded-full border border-[#ffbe9f]">{{ story.date }}</span>
                    <h3 class="text-2xl font-serif text-[#4a3a3a] font-bold">{{ story.title }}</h3>
                    <p class="text-xs leading-relaxed text-[#7a6060]">{{ story.description }}</p>
                 </div>
               </div>
               <div class="pt-4 border-t border-[#ffebe0] text-[#ff9671] flex justify-between items-center">
                 <i class="fa-solid fa-paw text-sm"></i>
                 <span class="text-[9px] uppercase font-bold tracking-widest text-[#ffbe9f]">Chapter {{ idx+1 }}</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS SECTION (OFFSET CARDS WITH LARGE BG PAW) -->
      <section id="event" v-if="isSectionEnabled('event')" class="relative py-32 md:py-48 px-6 bg-[#fffcf9]">
        <!-- Massive Background Paw -->
        <img src="/assets/images/clay-cat-paw.webp" alt="Huge Paw" 
             class="absolute w-64 h-64 md:w-96 md:h-96 opacity-[0.06] select-none pointer-events-none"
             :style="[getParallaxStyle(0.12, 0.02, vh * 3.2), { left: '10%', top: '30%' }]" />

        <div class="max-w-5xl mx-auto relative z-20">
          <div class="text-center mb-24">
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-black">Waktu &amp; Lokasi Acara</h2>
            <div class="w-20 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-4"></div>
          </div>
          
          <div class="flex flex-col md:flex-row justify-center items-start gap-16 md:gap-10 max-w-4xl mx-auto w-full">
            <!-- Akad Card (Large, offset, slower parallax) -->
            <div class="w-full md:w-[48%] bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_25px_50px_rgba(255,150,113,0.12)] border border-[#ffecd9] space-y-6 text-center transform-style-3d transition-transform duration-100 ease-out"
                 :style="[getTiltStyle('akadCard'), getParallaxStyle(0.06, 0, vh * 3.5)]"
                 @mousemove="handleTilt($event, 'akadCard')"
                 @mouseleave="resetTilt('akadCard')"
                 @touchmove="handleTouchTilt($event, 'akadCard')"
                 @touchend="resetTilt('akadCard')">
              <div class="w-16 h-16 bg-[#ffece0] text-[#ff7849] rounded-2xl flex items-center justify-center mx-auto text-2xl border border-[#ffbe9f] shadow-inner"><i class="fa-solid fa-ring"></i></div>
              <div class="space-y-2">
                <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold">Akad Nikah</h3>
                <p class="text-[10px] uppercase tracking-wider font-extrabold text-[#ff7849] bg-[#ffece0] px-3.5 py-1 rounded-full inline-block border border-[#ffbe9f]">{{ formatDate(data.akadLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-3 pt-6 border-t border-[#ffece0] text-xs font-semibold">
                <p class="flex items-center justify-center gap-2 text-[#4a3a3a]"><i class="fa-regular fa-clock text-[#ff7849] text-sm"></i> Pukul {{ formatTime(data.akadLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-xs text-[#7a6060] font-normal leading-relaxed px-4">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="block w-full py-4 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[10px] rounded-xl transition-all border border-[#ffc9b4] shadow-sm">
                Petunjuk Maps 🗺️
              </a>
            </div>

            <!-- Resepsi Card (Large, offset down, faster parallax for overlapping feel) -->
            <div v-if="!data.mergeEvents" class="w-full md:w-[48%] md:mt-24 bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_25px_50px_rgba(255,150,113,0.12)] border border-[#ffecd9] space-y-6 text-center transform-style-3d transition-transform duration-100 ease-out"
                 :style="[getTiltStyle('resepsiCard'), getParallaxStyle(-0.08, 0, vh * 3.5)]"
                 @mousemove="handleTilt($event, 'resepsiCard')"
                 @mouseleave="resetTilt('resepsiCard')"
                 @touchmove="handleTouchTilt($event, 'resepsiCard')"
                 @touchend="resetTilt('resepsiCard')">
              <div class="w-16 h-16 bg-[#ffece0] text-[#ff7849] rounded-2xl flex items-center justify-center mx-auto text-2xl border border-[#ffbe9f] shadow-inner"><i class="fa-solid fa-champagne-glasses"></i></div>
              <div class="space-y-2">
                <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold">Resepsi</h3>
                <p class="text-[10px] uppercase tracking-wider font-extrabold text-[#ff7849] bg-[#ffece0] px-3.5 py-1 rounded-full inline-block border border-[#ffbe9f]">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-3 pt-6 border-t border-[#ffece0] text-xs font-semibold">
                <p class="flex items-center justify-center gap-2 text-[#4a3a3a]"><i class="fa-regular fa-clock text-[#ff7849] text-sm"></i> Pukul {{ formatTime(data.resepsiLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-xs text-[#7a6060] font-normal leading-relaxed px-4">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="block w-full py-4 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[10px] rounded-xl transition-all border border-[#ffc9b4] shadow-sm">
                Petunjuk Maps 🗺️
              </a>
            </div>
          </div>

          <!-- Dress Code -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-20 text-center space-y-4">
             <h3 class="text-[11px] uppercase tracking-[0.25em] font-black text-[#4a3a3a]">Dress Code</h3>
             <div class="bg-white px-8 py-5 rounded-2xl border border-[#ffecd9] shadow-md inline-flex items-center gap-3">
                <i class="fa-solid fa-shirt text-[#ff7849] text-lg"></i>
                <p class="text-[#4a3a3a] font-black uppercase tracking-wider text-[11px]">{{ data.dressCode }}</p>
             </div>
          </div>
        </div>
      </section>

      <!-- GALLERY SECTION -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="relative py-32 px-6 bg-[#fffcf9]">
        <div class="max-w-6xl mx-auto space-y-16 relative z-20">
          <div class="text-center">
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-black">Galeri Foto</h2>
            <div class="w-20 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-4"></div>
          </div>
          <!-- Spacious layout grid for gallery -->
          <div class="p-6 md:p-10 bg-white rounded-[3rem] shadow-[0_25px_60px_rgba(255,150,113,0.12)] border border-[#ffecd9]"
               :style="getParallaxStyle(0.04, 0, vh * 4.5)">
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- DIGITAL GIFT SECTION -->
      <section id="gift" v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.eWalletLink?.length)" class="relative py-32 px-6 text-center bg-white z-20">
        <div class="max-w-5xl mx-auto space-y-16 relative z-20">
          <div class="text-center mb-20">
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-black">Kado Digital</h2>
            <div class="w-20 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-4"></div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto w-full">
            <div v-for="(bank, idx) in data.bankAccounts.slice(0, 2)" :key="idx"
                 class="p-8 bg-[#fffbf6] border border-[#ffecd9] rounded-[2.5rem] w-full sm:w-[350px] shadow-sm text-left flex flex-col justify-between transform-style-3d transition-transform duration-100 ease-out"
                 :style="[getTiltStyle('bankCard_' + idx), getParallaxStyle(idx === 0 ? 0.06 : -0.06, 0, vh * 5.2)]"
                 @mousemove="handleTilt($event, 'bankCard_' + idx)"
                 @mouseleave="resetTilt('bankCard_' + idx)"
                 @touchmove="handleTouchTilt($event, 'bankCard_' + idx)"
                 @touchend="resetTilt('bankCard_' + idx)">
              <div>
                <div class="flex justify-between items-center mb-6">
                   <p class="text-base font-black uppercase tracking-wider text-[#ff7849]">{{ bank.bankName }}</p>
                   <div class="w-12 h-12 bg-white rounded-2xl border border-[#ffbe9f] flex items-center justify-center text-[#ff7849] shadow-sm"><i class="fa-solid fa-wallet"></i></div>
                </div>
                <p class="text-2xl font-bold tracking-wider mb-2 text-[#4a3a3a] font-mono">{{ bank.accountNumber }}</p>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest font-sans">A.N {{ bank.accountName }}</p>
              </div>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full mt-8 py-3 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[10px] rounded-xl transition-all shadow-sm border border-[#ffc9b4]">
                Salin Rekening 📋
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP SECTION (LARGE CONTAINER LAYOUT) -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="relative py-32 px-6 bg-[#fffcf9]">
        <!-- Huge Background Parallax Heart -->
        <img src="/assets/images/clay-heart.webp" alt="Huge Heart" 
             class="absolute w-52 h-52 md:w-72 md:h-72 opacity-[0.06] select-none pointer-events-none"
             :style="[getParallaxStyle(0.1, 0.02, vh * 6.2), { left: '8%', bottom: '20%' }]" />

        <div class="max-w-3xl mx-auto relative z-20">
          <div class="text-center mb-16">
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-black">Konfirmasi Kehadiran</h2>
            <div class="w-20 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-4"></div>
          </div>

          <!-- Large Form Layout -->
          <form @submit.prevent="submitRSVP" class="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_30px_70px_rgba(255,150,113,0.12)] border border-[#ffecd9] space-y-6"
                :style="getParallaxStyle(0.04, 0, vh * 6.5)">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Nama Lengkap</label>
                <input v-model="rsvp.name" type="text" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-3.5 px-4 text-xs font-semibold focus:border-[#ff9671] focus:bg-white outline-none transition-colors" required />
              </div>
              
              <div class="space-y-1">
                <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Jumlah Tamu</label>
                <select v-model="rsvp.totalGuests" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-3.5 px-4 text-xs font-semibold focus:border-[#ff9671] outline-none">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-2">
               <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Konfirmasi Kehadiran</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-4 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[10px]" :class="rsvp.attendance === 'hadir' ? 'border-[#ff9671] bg-gradient-to-br from-[#ff9671] to-[#ff7849] text-white shadow-md' : 'border-[#ffecd9] bg-[#fffbf6] text-gray-500'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Hadir 🐾
                 </label>
                 <label class="flex-1 py-4 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[10px]" :class="rsvp.attendance === 'tidak' ? 'border-red-400 bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md' : 'border-[#ffecd9] bg-[#fffbf6] text-gray-500'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Tidak Hadir
                 </label>
               </div>
            </div>

            <div class="space-y-1">
               <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Ucapan &amp; Doa Restu</label>
               <textarea v-model="rsvp.message" rows="4" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-3.5 px-4 text-xs font-normal focus:border-[#ff9671] focus:bg-white outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-4 bg-gradient-to-r from-[#ff9671] to-[#ff7849] hover:from-[#ff7849] hover:to-[#ff5c24] text-white text-[10px] uppercase tracking-widest font-black rounded-xl shadow-md transition-all duration-300">Kirim Konfirmasi 🐾</button>
          </form>

          <!-- Scenic Footer -->
          <footer class="mt-24 py-10 text-center space-y-4 border-t border-[#ffecd9]/60">
            <h2 class="font-serif text-3xl font-bold text-[#4a3a3a]">{{ data.groomName }} &amp; {{ data.brideName }}</h2>
            <p class="text-[9px] uppercase tracking-widest font-extrabold text-gray-400">Created with ❤️ by satuundangan.id</p>
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
const vh = ref(800)

function handleScroll(e) {
  scrollY.value = e.target.scrollTop
}

onMounted(() => {
  vh.value = window.innerHeight
  window.addEventListener('resize', () => {
    vh.value = window.innerHeight
  })
})

// ASYMMETRICAL OVERLAPPING PARALLAX STYLE
// speed can be negative (moves up faster than scroll) or positive (moves up slower/sinks down)
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
  }, { threshold: 0.25 })
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

/* 3D and Perspective */
.transform-style-3d {
  transform-style: preserve-3d;
}

/* Envelope Folds */
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
