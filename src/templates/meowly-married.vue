<template>
  <div class="relative min-h-screen bg-[#fffbf6] overflow-hidden font-sans text-[#4a3a3a] selection:bg-[#ffbe9f] selection:text-[#4a3a3a]">
    
    <!-- 3D FLOATING PARALLAX BACKGROUND ASSETS -->
    <div v-if="!showWelcome" class="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <!-- 1. Floating 3D Heart (Top Left) -->
      <img src="/assets/images/clay-heart.webp" alt="Heart"
           class="absolute w-12 h-12 md:w-16 md:h-16 opacity-75 blur-[0.5px] transition-transform duration-100 ease-out"
           :style="{
             left: '8%',
             top: '15%',
             transform: 'translateY(' + (scrollY * -0.15) + 'px) rotate(' + (scrollY * 0.08) + 'deg) scale(0.95)'
           }" />

      <!-- 2. Floating 3D Cat Paw (Top Right) -->
      <img src="/assets/images/clay-cat-paw.webp" alt="Paw"
           class="absolute w-14 h-14 md:w-20 md:h-20 opacity-60 blur-[1px] transition-transform duration-100 ease-out"
           :style="{
             right: '10%',
             top: '25%',
             transform: 'translateY(' + (scrollY * 0.12) + 'px) rotate(' + (scrollY * -0.05) + 'deg) scale(0.8)'
           }" />

      <!-- 3. Floating 3D Heart (Middle Right) -->
      <img src="/assets/images/clay-heart.webp" alt="Heart"
           class="absolute w-16 h-16 md:w-24 md:h-24 opacity-80 transition-transform duration-100 ease-out"
           :style="{
             right: '6%',
             top: '55%',
             transform: 'translateY(' + (scrollY * -0.22) + 'px) rotate(' + (scrollY * 0.12) + 'deg) scale(1.1)'
           }" />

      <!-- 4. Floating 3D Cat Paw (Bottom Left) -->
      <img src="/assets/images/clay-cat-paw.webp" alt="Paw"
           class="absolute w-16 h-16 md:w-22 md:h-22 opacity-70 transition-transform duration-100 ease-out"
           :style="{
             left: '5%',
             top: '70%',
             transform: 'translateY(' + (scrollY * -0.08) + 'px) rotate(' + (scrollY * -0.1) + 'deg) scale(1)'
           }" />

      <!-- 5. Floating 3D Heart (Bottom Right) -->
      <img src="/assets/images/clay-heart.webp" alt="Heart"
           class="absolute w-10 h-10 md:w-14 md:h-14 opacity-50 blur-[1.5px] transition-transform duration-100 ease-out"
           :style="{
             right: '15%',
             top: '85%',
             transform: 'translateY(' + (scrollY * 0.2) + 'px) rotate(' + (scrollY * 0.04) + 'deg) scale(0.7)'
           }" />
    </div>

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

    <!-- MAIN SCROLLABLE CONTENT -->
    <div v-if="!showWelcome" id="main-content" @scroll="handleScroll" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto scroll-smooth pb-24 md:pb-0">
      
      <!-- HERO SECTION -->
      <section id="home" class="min-h-screen relative flex items-center justify-center px-6 py-20 bg-gradient-to-b from-[#fff7f2] to-[#fffbf6]">
        <div class="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center relative z-20">
          
          <!-- Hero Title Panel -->
          <div class="order-2 md:order-1 space-y-6 text-center md:text-left popup-card" v-observe>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ffece0] rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff7849] border border-[#ffbe9f]">
              🐾 Meow! We Are Getting Married
            </div>
            <h1 class="text-6xl md:text-8xl font-serif text-[#4a3a3a] leading-none font-bold">
              {{ data.groomName }} <br><span class="text-3xl md:text-5xl italic text-[#ff9671] font-normal">&</span><br> {{ data.brideName }}
            </h1>
            <div class="h-1 w-20 bg-gradient-to-r from-[#ff9671] to-[#ff7849] rounded-full mx-auto md:mx-0"></div>
            <p class="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-[#ff7849]">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</p>
          </div>
          
          <!-- Hero 3D Card (Tilt Interactive Cover) -->
          <div class="order-1 md:order-2 flex justify-center popup-card" v-observe>
            <div class="relative w-72 md:w-80 bg-white p-4 pb-10 shadow-[0_25px_50px_rgba(255,150,113,0.18)] border border-[#ffecd9] rounded-3xl transform-style-3d transition-transform duration-300 ease-out"
                 :style="getTiltStyle('heroCard')"
                 @mousemove="handleTilt($event, 'heroCard')"
                 @mouseleave="resetTilt('heroCard')"
                 @touchmove="handleTouchTilt($event, 'heroCard')"
                 @touchend="resetTilt('heroCard')">
              
              <!-- 3D Clay Ears protruding at top -->
              <div class="absolute -top-7 left-10 w-10 h-10 bg-white border-t border-l border-[#ffecd9] rounded-tr-[60%] transform rotate-[18deg] shadow-[-2px_-4px_8px_rgba(255,150,113,0.05)]"></div>
              <div class="absolute -top-7 right-10 w-10 h-10 bg-white border-t border-r border-[#ffecd9] rounded-tl-[60%] transform rotate-[-18deg] shadow-[2px_-4px_8px_rgba(255,150,113,0.05)]"></div>
              
              <div class="aspect-[3/4] bg-gradient-to-br from-[#fff7f2] to-[#fff0e6] rounded-2xl overflow-hidden relative shadow-inner border border-[#ffebd4]">
                <!-- Main 3D Clay Wedding Illustration -->
                <img src="/assets/images/clay-cat-wedding.webp" alt="Wedding Cats" class="w-full h-full object-cover p-4 transform-style-3d scale-105" />
              </div>
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 text-2xl text-[#ff9671]"><i class="fa-solid fa-heart animate-pulse"></i></div>
            </div>
          </div>
        </div>
      </section>

      <!-- QUOTE SECTION -->
      <section class="py-28 px-6 bg-gradient-to-b from-[#fffbf6] to-white relative overflow-hidden">
        <div class="max-w-4xl mx-auto text-center space-y-8 relative z-20 popup-card" v-observe>
          <img src="/assets/images/clay-heart.webp" alt="Clay Heart" class="w-16 h-16 mx-auto drop-shadow-md animate-bounce" style="animation-duration: 4s;" />
          <p class="text-xl md:text-3xl italic leading-relaxed font-serif text-[#5a4848] px-4 font-semibold">
            "{{ data.quoteText || 'Dalam kehangatan dan kebersamaan, kita temukan makna persahabatan sejati dan cinta yang setia.' }}"
          </p>
          <div class="flex items-center justify-center gap-4">
             <div class="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#ffbe9f]"></div>
             <p class="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff7849]">{{ data.quoteSource || 'Paws & Promises Romance' }}</p>
             <div class="w-8 h-0.5 bg-gradient-to-l from-transparent to-[#ffbe9f]"></div>
          </div>
        </div>
      </section>

      <!-- COUPLE SECTION (Interactive 3D Profil Cards) -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-28 px-6 bg-[#fffbf6] relative">
        <div class="max-w-5xl mx-auto space-y-24 relative z-20">
          <div class="text-center mb-16 popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Mempelai Pria & Wanita</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          
          <div class="flex flex-col md:flex-row justify-center items-stretch gap-12 max-w-4xl mx-auto">
            
            <!-- Groom Card (3D Tilt) -->
            <div class="flex-1 bg-white p-6 pb-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.12)] border border-[#ffecd9] text-center flex flex-col justify-between items-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('groomCard')"
                 @mousemove="handleTilt($event, 'groomCard')"
                 @mouseleave="resetTilt('groomCard')"
                 @touchmove="handleTouchTilt($event, 'groomCard')"
                 @touchend="resetTilt('groomCard')"
                 v-observe>
              <div class="space-y-6">
                <!-- Circular Avatar Frame with Ears -->
                <div class="relative w-44 h-44 rounded-full p-2 bg-gradient-to-br from-[#fff7f2] to-[#ffe5db] border border-[#ffbe9f] shadow-inner flex items-center justify-center mx-auto">
                  <div class="absolute -top-2 left-4 w-7 h-7 bg-white border-t border-l border-[#ffbe9f] rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-2 right-4 w-7 h-7 bg-white border-t border-r border-[#ffbe9f] rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full" />
                </div>
                <div class="space-y-2">
                  <span class="text-[9px] uppercase tracking-widest font-black text-[#ff7849] bg-[#ffece0] px-3 py-1 rounded-full border border-[#ffbe9f]">The Groom</span>
                  <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold mt-2">{{ data.groomName }}</h3>
                  <p class="text-xs text-gray-500 font-medium leading-relaxed mt-1">Putra dari pasangan <br><span class="font-bold text-[#4a3a3a]">{{ data.parents?.groomParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] rounded-xl text-[9px] uppercase tracking-widest font-black text-[#ff7849] hover:text-white transition-all shadow-sm border border-[#ffc9b4]"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>

            <!-- Bride Card (3D Tilt) -->
            <div class="flex-1 bg-white p-6 pb-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.12)] border border-[#ffecd9] text-center flex flex-col justify-between items-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('brideCard')"
                 @mousemove="handleTilt($event, 'brideCard')"
                 @mouseleave="resetTilt('brideCard')"
                 @touchmove="handleTouchTilt($event, 'brideCard')"
                 @touchend="resetTilt('brideCard')"
                 v-observe>
              <div class="space-y-6">
                <!-- Circular Avatar Frame with Ears -->
                <div class="relative w-44 h-44 rounded-full p-2 bg-gradient-to-br from-[#fff7f2] to-[#ffe5db] border border-[#ffbe9f] shadow-inner flex items-center justify-center mx-auto">
                  <div class="absolute -top-2 left-4 w-7 h-7 bg-white border-t border-l border-[#ffbe9f] rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-2 right-4 w-7 h-7 bg-white border-t border-r border-[#ffbe9f] rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full" />
                </div>
                <div class="space-y-2">
                  <span class="text-[9px] uppercase tracking-widest font-black text-[#ff7849] bg-[#ffece0] px-3 py-1 rounded-full border border-[#ffbe9f]">The Bride</span>
                  <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold mt-2">{{ data.brideName }}</h3>
                  <p class="text-xs text-gray-500 font-medium leading-relaxed mt-1">Putri dari pasangan <br><span class="font-bold text-[#4a3a3a]">{{ data.parents?.brideParents || 'Bpk. & Ibu' }}</span></p>
                </div>
              </div>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] rounded-xl text-[9px] uppercase tracking-widest font-black text-[#ff7849] hover:text-white transition-all shadow-sm border border-[#ffc9b4]"><i class="fa-brands fa-instagram mr-2"></i>Instagram</a>
            </div>

          </div>
        </div>
      </section>

      <!-- LOVE STORY SECTION -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-28 px-6 bg-white relative">
        <div class="max-w-5xl mx-auto space-y-16 relative z-20">
          <div class="text-center mb-16 popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Kisah Cinta Kami 🐾</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)" :key="idx"
                 class="bg-[#fffbf6] p-6 rounded-[2rem] border border-[#ffecd9] shadow-sm space-y-5 flex flex-col justify-between group hover:shadow-[0_15px_30px_rgba(255,150,113,0.15)] hover:border-[#ffbe9f] hover:-translate-y-2 transition-all duration-500 popup-card"
                 v-observe>
               <div class="space-y-4">
                 <div v-if="story.image || isPreviewMode" class="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-sm border border-[#ffecd9]">
                    <img :src="story.image || 'https://via.placeholder.com/600x400'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 </div>
                 <div class="space-y-2">
                    <span class="inline-block text-[9px] font-black text-[#ff7849] uppercase tracking-wider bg-[#ffece0] px-3 py-1 rounded-full">{{ story.date }}</span>
                    <h3 class="text-2xl font-serif text-[#4a3a3a] font-bold">{{ story.title }}</h3>
                    <p class="text-xs leading-relaxed text-[#7a6060]">{{ story.description }}</p>
                 </div>
               </div>
               <div class="pt-4 border-t border-[#ffebe0] text-[#ff9671] flex justify-between items-center">
                 <i class="fa-solid fa-paw"></i>
                 <span class="text-[9px] uppercase font-bold tracking-widest text-[#ffbe9f]">Chapter {{ idx+1 }}</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS SECTION (Akad & Resepsi 3D Pop-Up Cards) -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-28 px-6 relative bg-gradient-to-b from-[#fffbf6] to-white">
        <div class="max-w-4xl mx-auto relative z-20">
          <div class="text-center mb-16 popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Waktu & Lokasi Acara</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-10">
            <!-- Akad Card (3D Tilt) -->
            <div class="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.1)] border border-[#ffecd9] space-y-6 text-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('akadCard')"
                 @mousemove="handleTilt($event, 'akadCard')"
                 @mouseleave="resetTilt('akadCard')"
                 @touchmove="handleTouchTilt($event, 'akadCard')"
                 @touchend="resetTilt('akadCard')"
                 v-observe>
              <div class="w-16 h-16 bg-[#ffece0] text-[#ff7849] rounded-2xl flex items-center justify-center mx-auto text-2xl border border-[#ffbe9f] shadow-inner"><i class="fa-solid fa-ring"></i></div>
              <div>
                <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold">Akad Nikah</h3>
                <p class="text-[10px] uppercase tracking-wider font-extrabold text-[#ff7849] mt-2 bg-[#ffece0] px-3 py-1 rounded-full inline-block border border-[#ffbe9f]">{{ formatDate(data.akadLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-3 pt-6 border-t border-[#ffece0] text-xs font-semibold">
                <p class="flex items-center justify-center gap-2 text-[#4a3a3a]"><i class="fa-regular fa-clock text-[#ff7849] text-sm"></i> Pukul {{ formatTime(data.akadLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-[#7a6060] font-normal leading-relaxed px-4">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="block w-full py-3.5 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[10px] rounded-xl transition-all shadow-sm border border-[#ffc9b4]">
                Petunjuk Maps 🗺️
              </a>
            </div>

            <!-- Resepsi Card (3D Tilt) -->
            <div v-if="!data.mergeEvents" class="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.1)] border border-[#ffecd9] space-y-6 text-center transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('resepsiCard')"
                 @mousemove="handleTilt($event, 'resepsiCard')"
                 @mouseleave="resetTilt('resepsiCard')"
                 @touchmove="handleTouchTilt($event, 'resepsiCard')"
                 @touchend="resetTilt('resepsiCard')"
                 v-observe>
              <div class="w-16 h-16 bg-[#ffece0] text-[#ff7849] rounded-2xl flex items-center justify-center mx-auto text-2xl border border-[#ffbe9f] shadow-inner"><i class="fa-solid fa-champagne-glasses"></i></div>
              <div>
                <h3 class="text-3xl font-serif text-[#4a3a3a] font-bold">Resepsi</h3>
                <p class="text-[10px] uppercase tracking-wider font-extrabold text-[#ff7849] mt-2 bg-[#ffece0] px-3 py-1 rounded-full inline-block border border-[#ffbe9f]">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-3 pt-6 border-t border-[#ffece0] text-xs font-semibold">
                <p class="flex items-center justify-center gap-2 text-[#4a3a3a]"><i class="fa-regular fa-clock text-[#ff7849] text-sm"></i> Pukul {{ formatTime(data.resepsiLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-[#7a6060] font-normal leading-relaxed px-4">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="block w-full py-3.5 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[10px] rounded-xl transition-all shadow-sm border border-[#ffc9b4]">
                Petunjuk Maps 🗺️
              </a>
            </div>
          </div>

          <!-- Dress Code Details -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-16 text-center space-y-4 popup-card" v-observe>
             <h3 class="text-[11px] uppercase tracking-[0.25em] font-black text-[#4a3a3a]">Dress Code</h3>
             <div class="bg-white px-8 py-5 rounded-2xl border border-[#ffecd9] shadow-sm inline-flex items-center gap-3">
                <i class="fa-solid fa-shirt text-[#ff7849] text-lg"></i>
                <p class="text-[#4a3a3a] font-black uppercase tracking-wider text-[11px]">{{ data.dressCode }}</p>
             </div>
          </div>
        </div>
      </section>

      <!-- GALLERY SECTION -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-28 px-4 bg-[#fffbf6] relative">
        <div class="max-w-5xl mx-auto space-y-16 relative z-20">
          <div class="text-center popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Galeri Foto</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          <div class="p-6 bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(255,150,113,0.12)] border border-[#ffecd9] popup-card" v-observe>
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- DIGITAL GIFT SECTION (Interactive Bank Cards) -->
      <section id="gift" v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.eWalletLink?.length)" class="py-28 px-6 text-center bg-white">
        <div class="max-w-4xl mx-auto space-y-16 relative z-20">
          <div class="text-center mb-16 popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Kado Digital</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-8">
            <div v-for="(bank, idx) in data.bankAccounts" :key="idx"
                 class="p-8 bg-[#fffbf6] border border-[#ffecd9] rounded-[2.5rem] w-full sm:w-[340px] shadow-sm text-left flex flex-col justify-between transform-style-3d transition-transform duration-300 ease-out popup-card"
                 :style="getTiltStyle('bankCard_' + idx)"
                 @mousemove="handleTilt($event, 'bankCard_' + idx)"
                 @mouseleave="resetTilt('bankCard_' + idx)"
                 @touchmove="handleTouchTilt($event, 'bankCard_' + idx)"
                 @touchend="resetTilt('bankCard_' + idx)"
                 v-observe>
              <div>
                <div class="flex justify-between items-center mb-6">
                   <p class="text-lg font-black uppercase tracking-wider text-[#ff7849]">{{ bank.bankName }}</p>
                   <div class="w-12 h-12 bg-white rounded-2xl border border-[#ffbe9f] flex items-center justify-center text-[#ff7849] shadow-sm"><i class="fa-solid fa-wallet"></i></div>
                </div>
                <p class="text-2xl font-bold tracking-wider mb-2 text-[#4a3a3a] font-mono">{{ bank.accountNumber }}</p>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">A.N {{ bank.accountName }}</p>
              </div>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full mt-8 py-3 bg-gradient-to-r from-[#ffece0] to-[#ffdcd0] hover:from-[#ff9671] hover:to-[#ff7849] text-[#ff7849] hover:text-white font-black uppercase tracking-wider text-[10px] rounded-xl transition-all shadow-sm border border-[#ffc9b4]">
                Salin Rekening 📋
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP SECTION (Interactive Letter Box Form) -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-28 px-6 bg-[#fffbf6] relative overflow-hidden">
        <div class="max-w-2xl mx-auto relative z-20">
          <div class="text-center mb-16 popup-card" v-observe>
            <h2 class="text-5xl font-serif text-[#4a3a3a] font-bold">Konfirmasi Kehadiran</h2>
            <div class="w-16 h-1.5 bg-gradient-to-r from-[#ffbe9f] to-[#ff9671] mx-auto rounded-full mt-3"></div>
          </div>

          <form @submit.prevent="submitRSVP" class="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_25px_50px_rgba(255,150,113,0.12)] border border-[#ffecd9] space-y-6 popup-card" v-observe>
            <div class="space-y-1">
              <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Nama Lengkap</label>
              <input v-model="rsvp.name" type="text" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-3.5 px-4 text-xs font-semibold focus:border-[#ff9671] focus:bg-white outline-none transition-colors" required />
            </div>
            
            <div class="space-y-2">
               <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Konfirmasi Kehadiran</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-3.5 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[10px]" :class="rsvp.attendance === 'hadir' ? 'border-[#ff9671] bg-gradient-to-br from-[#ff9671] to-[#ff7849] text-white shadow-md' : 'border-[#ffecd9] bg-[#fffbf6] text-gray-500 hover:border-[#ffbe9f]'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Hadir 🐾
                 </label>
                 <label class="flex-1 py-3.5 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[10px]" :class="rsvp.attendance === 'tidak' ? 'border-red-400 bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md' : 'border-[#ffecd9] bg-[#fffbf6] text-gray-500 hover:border-red-300'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Tidak Hadir
                 </label>
               </div>
            </div>

            <div v-if="rsvp.attendance === 'hadir'" class="space-y-1">
              <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Jumlah Tamu</label>
              <select v-model="rsvp.totalGuests" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-3.5 px-4 text-xs font-semibold focus:border-[#ff9671] outline-none">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
              </select>
            </div>

            <div class="space-y-1">
               <label class="text-[10px] uppercase tracking-widest font-black text-[#ff7849] px-2">Ucapan & Doa Restu</label>
               <textarea v-model="rsvp.message" rows="4" class="w-full bg-[#fffbf6] border border-[#ffecd9] rounded-xl py-3.5 px-4 text-xs font-normal focus:border-[#ff9671] focus:bg-white outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-4 bg-gradient-to-r from-[#ff9671] to-[#ff7849] hover:from-[#ff7849] hover:to-[#ff5c24] text-white text-[10px] uppercase tracking-widest font-black rounded-xl shadow-[0_6px_15px_rgba(255,120,73,0.3)] transition-all duration-300 hover:scale-[1.01]">Kirim Konfirmasi 🐾</button>
          </form>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-20 text-center bg-white space-y-6 border-t border-[#ffecd9] relative z-20">
        <img src="/assets/images/clay-cat-paw.webp" alt="Paw" class="w-12 h-12 mx-auto opacity-75" />
        <h2 class="font-serif text-4xl font-bold text-[#4a3a3a]">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p class="text-[9px] uppercase tracking-widest font-extrabold text-gray-400">Created with ❤️ by satuundangan.id</p>
      </footer>
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
  bankCard_1: { x: 0, y: 0, s: 1 },
  bankCard_2: { x: 0, y: 0, s: 1 }
})

// MOUSEMOVE TILT HANDLER (DESKTOP)
function handleTilt(e, key) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  
  // Max tilt angle 14 degrees
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

// BACKGROUND PARALLAX SCROLL POSITION
const scrollY = ref(0)
function handleScroll(e) {
  scrollY.value = e.target.scrollTop
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
.perspective-1000 {
  perspective: 1000px;
}
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
  transform: perspective(1000px) rotateX(-20deg) translateZ(-50px) scale(0.95);
  transform-origin: bottom center;
  transition: opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1), transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
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
