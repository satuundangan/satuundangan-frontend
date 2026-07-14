<template>
  <div class="relative min-h-screen bg-[#fffcf7] overflow-hidden font-sans text-[#4a3e3d] selection:bg-[#ffbfa3] selection:text-[#4a3e3d]">
    <!-- Cute paw print background decoration -->
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style="background-image: radial-gradient(circle at center, #ff8c69 1px, transparent 1px); background-size: 30px 30px;"></div>

    <!-- Background Music -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" primaryColor="#ff9f80" accentColor="#4a3e3d" class="z-[55]" />

    <!-- Navigation (Floating Cat Paw) -->
    <nav v-if="!showWelcome" class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-all duration-1000 hidden md:flex">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="w-11 h-11 rounded-full bg-white shadow-md border border-[#ffe5db] flex items-center justify-center transition-all duration-300 group relative"
        :class="activeSection === item.id ? 'bg-[#ff9f80] text-white scale-110' : 'text-[#ff9f80] hover:bg-[#ffe5db]'">
        <i :class="[item.icon, 'text-sm']"></i>
        <span class="absolute right-14 px-2 py-1 bg-white text-[#4a3e3d] text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#ffe5db]">
          {{ item.label }}
        </span>
      </button>
    </nav>
    
    <!-- Mobile Navigation -->
    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[#ffe5db] max-w-[90%] md:hidden transition-all duration-1000 flex overflow-x-auto no-scrollbar">
      <div class="flex items-center justify-center gap-5 px-5 py-2.5 mx-auto">
        <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-0.5 transition-all duration-300"
          :class="activeSection === item.id ? 'text-[#ff9f80] scale-105' : 'text-gray-400'">
          <i :class="[item.icon, 'text-base']"></i>
          <span class="text-[7px] font-bold uppercase tracking-wider">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- 3D ENVELOPE WELCOME SCREEN -->
    <transition name="fade-screen">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#fff5f0] px-4 overflow-hidden">
        <!-- Floating paws background -->
        <div class="absolute top-10 left-10 text-4xl opacity-10 animate-wiggle"><i class="fa-solid fa-paw text-[#ff9f80]"></i></div>
        <div class="absolute bottom-10 right-10 text-4xl opacity-10 animate-wiggle" style="animation-delay: 2s;"><i class="fa-solid fa-paw text-[#ff9f80]"></i></div>
        
        <div class="text-center mb-8 animate-fade-in">
          <span class="text-[10px] uppercase font-bold tracking-[0.25em] text-[#ff9f80]">Meowly Married</span>
          <h2 class="text-3xl font-serif text-[#4a3e3d] mt-1">{{ data.groomName }} & {{ data.brideName }}</h2>
        </div>

        <!-- 3D Envelope Container -->
        <div class="envelope-container relative w-[320px] h-[220px] md:w-[380px] md:h-[260px] perspective-1000">
          <div class="envelope-wrapper w-full h-full relative" :class="{ 'is-open': envelopeOpen }">
            <!-- 1. Envelope Back -->
            <div class="envelope-back absolute inset-0 bg-[#ffdcd0] rounded-2xl shadow-lg border border-[#f0c5b8]"></div>

            <!-- 2. The Letter Inside -->
            <div class="envelope-letter absolute left-4 right-4 bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-between text-center transition-all duration-1000 ease-in-out z-10"
                 :class="envelopeOpen ? 'letter-up' : 'letter-down'">
              <div class="space-y-2">
                <p class="text-[8px] uppercase tracking-widest text-[#ff9f80] font-bold">Dear Special Guest</p>
                <h3 class="text-base font-bold text-[#4a3e3d] max-w-[220px] truncate">{{ data.guestName || 'Tamu Undangan' }}</h3>
                <div class="h-0.5 w-8 bg-[#ffbeab] mx-auto rounded-full"></div>
              </div>
              <button @click="openInvitation" class="w-full mt-4 py-2.5 bg-[#ff9f80] hover:bg-[#ff8c69] text-white text-[9px] uppercase tracking-widest font-black rounded-full shadow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                Buka Undangan
              </button>
            </div>

            <!-- 3. Envelope Flap (Top) -->
            <div class="envelope-flap absolute left-0 right-0 top-0 h-1/2 bg-[#ffcab9] border-t border-[#f0b5a3] rounded-t-2xl z-20 origin-top transition-transform duration-700 ease-in-out"
                 :class="envelopeOpen ? 'flap-open' : 'flap-closed'">
                 <div class="flap-inside w-full h-full bg-[#f9baa7] opacity-50 rounded-t-2xl"></div>
            </div>

            <!-- 4. Envelope Front Sides & Bottom (Visual Fold Overlay) -->
            <div class="envelope-front absolute inset-0 bg-gradient-to-t from-[#ffdcd0] via-[#ffe3da] to-transparent rounded-2xl z-20 pointer-events-none flex items-end justify-center pb-2">
              <!-- Left fold overlay -->
              <div class="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-tr from-[#ffcab9]/30 to-transparent rounded-l-2xl"></div>
              <!-- Right fold overlay -->
              <div class="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-tl from-[#ffcab9]/30 to-transparent rounded-r-2xl"></div>
            </div>

            <!-- 5. Paw Wax Seal -->
            <div class="absolute left-1/2 top-[40%] md:top-[42%] -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 cursor-pointer"
                 :class="envelopeOpen ? 'scale-0 rotate-45 opacity-0' : 'scale-100 hover:scale-110'"
                 @click="triggerEnvelope">
              <img src="/assets/images/cat-paw-seal.webp" alt="Open Seal" class="w-16 h-16 md:w-20 md:h-20 drop-shadow-md" />
              <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.2em] text-[#ff8c69] font-black animate-pulse whitespace-nowrap">Klik Segel Paw</div>
            </div>
          </div>
        </div>

        <div class="mt-12 text-center text-xs text-gray-400 animate-pulse">
          <p>© satuundangan.id</p>
        </div>
      </div>
    </transition>

    <!-- MAIN SCROLLABLE CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto scroll-smooth pb-24 md:pb-0">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen relative flex items-center justify-center px-6 py-20 bg-gradient-to-b from-[#fff5f0] to-white">
        <!-- Floating cat elements -->
        <div class="absolute top-24 left-1/4 text-2xl opacity-20"><i class="fa-solid fa-fish text-[#ff9f80]"></i></div>
        <div class="absolute bottom-24 right-1/4 text-2xl opacity-20"><i class="fa-solid fa-cat text-[#ff9f80]"></i></div>

        <div class="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center relative z-10" v-observe>
          <div class="order-2 md:order-1 space-y-6 text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#ffe5db] rounded-full text-[9px] font-bold uppercase tracking-widest text-[#ff8c69]">
              🐾 Kami Menikah!
            </div>
            <h1 class="text-5xl md:text-7xl font-serif text-[#4a3e3d] leading-none">
              {{ data.groomName }} <br><span class="text-3xl md:text-5xl italic text-[#ff9f80]">&</span><br> {{ data.brideName }}
            </h1>
            <p class="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#ff8c69]">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</p>
          </div>
          
          <div class="order-1 md:order-2 relative flex justify-center">
            <!-- Polaroid with cat ears frame -->
            <div class="relative w-64 md:w-72 bg-white p-3 pb-8 shadow-xl border border-gray-100 rounded-lg rotate-3 hover:rotate-0 transition-transform duration-700">
              <!-- Cat Ears Top Left -->
              <div class="absolute -top-6 left-6 w-8 h-8 bg-white border-t border-l border-gray-100 rounded-tr-[50%] transform rotate-[15deg]"></div>
              <!-- Cat Ears Top Right -->
              <div class="absolute -top-6 right-6 w-8 h-8 bg-white border-t border-r border-gray-100 rounded-tl-[50%] transform rotate-[-15deg]"></div>
              
              <div class="aspect-[3/4] bg-gray-50 rounded overflow-hidden">
                <img :src="data.photoCoupleUrl || '/assets/images/cat-wedding-cover.webp'" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-24 px-6 bg-[#fffcf7] relative overflow-hidden" v-observe>
        <div class="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <i class="fa-solid fa-paw text-[#ffbeab] text-3xl opacity-40"></i>
          <p class="text-lg md:text-2xl italic leading-relaxed font-serif text-[#5a4c4a] px-4">
            "{{ data.quoteText || 'Dalam kehangatan dan kebersamaan, kita temukan makna persahabatan sejati dan cinta yang setia.' }}"
          </p>
          <div class="flex items-center justify-center gap-3">
             <div class="w-6 h-px bg-[#ffbeab]"></div>
             <p class="text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff8c69]">{{ data.quoteSource || 'Cat-Lover Romance' }}</p>
             <div class="w-6 h-px bg-[#ffbeab]"></div>
          </div>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 px-6 bg-white relative">
        <div class="max-w-5xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <h2 class="text-4xl md:text-5xl font-serif text-[#4a3e3d]">Our Meow-ry</h2>
            <div class="w-12 h-1 bg-[#ffbeab] mx-auto rounded-full mt-2"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)" :key="idx" class="bg-[#fffcf7] p-5 rounded-[2rem] border border-[#ffe5db] space-y-5 flex flex-col group hover:-translate-y-1.5 transition-all duration-500" v-observe>
               <div v-if="story.image || isPreviewMode" class="aspect-[4/3] rounded-2xl overflow-hidden relative">
                  <img :src="story.image || 'https://via.placeholder.com/600x400'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               </div>
               <div class="space-y-2 flex-1">
                  <span class="text-[8px] font-black text-[#ff8c69] uppercase tracking-wider">{{ story.date }}</span>
                  <h3 class="text-xl font-serif text-[#4a3e3d]">{{ story.title }}</h3>
                  <p class="text-xs leading-relaxed text-[#7a6a68]">{{ story.description }}</p>
               </div>
               <div class="pt-3 border-t border-[#ffe5db] text-[#ff9f80]"><i class="fa-solid fa-paw"></i></div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-24 px-6 bg-[#fffcf7]">
        <div class="max-w-4xl mx-auto space-y-20">
          
          <!-- Groom -->
          <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16" v-observe>
            <div class="w-full md:w-1/2 relative flex justify-center">
               <!-- Circle frame with ears -->
               <div class="relative w-56 h-56 rounded-full p-1.5 bg-white shadow-lg border border-[#ffe5db] z-10">
                  <div class="absolute -top-3 left-6 w-8 h-8 bg-white border-t border-l border-gray-100 rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-3 right-6 w-8 h-8 bg-white border-t border-r border-gray-100 rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full" />
               </div>
               <div class="absolute top-5 right-10 w-16 h-16 bg-[#ff9f80]/10 rounded-full blur-xl z-0"></div>
            </div>
            <div class="w-full md:w-1/2 text-center md:text-left space-y-4">
              <span class="text-[9px] uppercase tracking-widest font-bold text-[#ff8c69]">The Groom</span>
              <h3 class="text-3xl md:text-4xl font-serif text-[#4a3e3d]">{{ data.groomName }}</h3>
              <p class="text-xs font-medium text-[#7a6a68] leading-relaxed">Putra dari pasangan <br><span class="font-bold text-[#4a3e3d]">{{ data.parents?.groomParents || 'Bpk. & Ibu' }}</span></p>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block mt-3 px-5 py-2 bg-white rounded-full shadow-sm text-[8px] uppercase tracking-widest font-bold text-[#ff8c69] hover:bg-[#ff9f80] hover:text-white transition-colors border border-[#ffe5db]"><i class="fa-brands fa-instagram mr-1.5"></i>Instagram</a>
            </div>
          </div>

          <!-- Bride -->
          <div class="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16" v-observe>
            <div class="w-full md:w-1/2 relative flex justify-center">
               <div class="relative w-56 h-56 rounded-full p-1.5 bg-white shadow-lg border border-[#ffe5db] z-10">
                  <div class="absolute -top-3 left-6 w-8 h-8 bg-white border-t border-l border-gray-100 rounded-tr-[50%] transform rotate-[15deg]"></div>
                  <div class="absolute -top-3 right-6 w-8 h-8 bg-white border-t border-r border-gray-100 rounded-tl-[50%] transform rotate-[-15deg]"></div>
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x400'" class="w-full h-full object-cover rounded-full" />
               </div>
               <div class="absolute bottom-5 left-10 w-16 h-16 bg-[#ff9f80]/10 rounded-full blur-xl z-0"></div>
            </div>
            <div class="w-full md:w-1/2 text-center md:text-right space-y-4">
              <span class="text-[9px] uppercase tracking-widest font-bold text-[#ff8c69]">The Bride</span>
              <h3 class="text-3xl md:text-4xl font-serif text-[#4a3e3d]">{{ data.brideName }}</h3>
              <p class="text-xs font-medium text-[#7a6a68] leading-relaxed">Putri dari pasangan <br><span class="font-bold text-[#4a3e3d]">{{ data.parents?.brideParents || 'Bpk. & Ibu' }}</span></p>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block mt-3 px-5 py-2 bg-white rounded-full shadow-sm text-[8px] uppercase tracking-widest font-bold text-[#ff8c69] hover:bg-[#ff9f80] hover:text-white transition-colors border border-[#ffe5db]"><i class="fa-brands fa-instagram mr-1.5"></i>Instagram</a>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-24 px-6 relative bg-gradient-to-b from-[#fffcf7] to-white">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16" v-observe>
            <h2 class="text-4xl md:text-5xl font-serif text-[#4a3e3d]">Waktu & Tempat</h2>
            <div class="w-12 h-1 bg-[#ffbeab] mx-auto rounded-full mt-2"></div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Akad -->
            <div class="bg-white p-8 rounded-[2rem] shadow-md border border-[#ffe5db] space-y-6 text-center hover:-translate-y-1 transition-transform duration-500" v-observe>
              <div class="w-14 h-14 bg-[#fff5f0] text-[#ff9f80] rounded-full flex items-center justify-center mx-auto text-xl"><i class="fa-solid fa-ring"></i></div>
              <div>
                <h3 class="text-2xl font-serif text-[#4a3e3d]">Akad Nikah</h3>
                <p class="text-[9px] uppercase tracking-wider font-bold text-[#ff8c69] mt-1">{{ formatDate(data.akadLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-2 pt-4 border-t border-gray-100 text-xs font-semibold">
                <p class="flex items-center justify-center gap-2"><i class="fa-regular fa-clock text-[#ff9f80]"></i> Pukul {{ formatTime(data.akadLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-[#7a6a68] font-normal leading-relaxed">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="block w-full py-3 bg-[#fff5f0] hover:bg-[#ff9f80] text-[#ff8c69] hover:text-white font-bold uppercase tracking-wider text-[9px] rounded-full transition-colors border border-[#ffbeab]">
                Buka Map
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="bg-white p-8 rounded-[2rem] shadow-md border border-[#ffe5db] space-y-6 text-center hover:-translate-y-1 transition-transform duration-500" v-observe>
              <div class="w-14 h-14 bg-[#fff5f0] text-[#ff9f80] rounded-full flex items-center justify-center mx-auto text-xl"><i class="fa-solid fa-champagne-glasses"></i></div>
              <div>
                <h3 class="text-2xl font-serif text-[#4a3e3d]">Resepsi</h3>
                <p class="text-[9px] uppercase tracking-wider font-bold text-[#ff8c69] mt-1">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-2 pt-4 border-t border-gray-100 text-xs font-semibold">
                <p class="flex items-center justify-center gap-2"><i class="fa-regular fa-clock text-[#ff9f80]"></i> Pukul {{ formatTime(data.resepsiLocation?.dateTime) }} WIB - Selesai</p>
                <p class="text-[#7a6a68] font-normal leading-relaxed">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="block w-full py-3 bg-[#fff5f0] hover:bg-[#ff9f80] text-[#ff8c69] hover:text-white font-bold uppercase tracking-wider text-[9px] rounded-full transition-colors border border-[#ffbeab]">
                Buka Map
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-16 text-center space-y-4" v-observe>
             <h3 class="text-[10px] uppercase tracking-widest font-black text-[#4a3e3d]">Dress Code</h3>
             <div class="bg-white px-8 py-5 rounded-full border border-[#ffbeab] shadow-sm inline-flex items-center gap-3">
                <i class="fa-solid fa-shirt text-[#ff9f80]"></i>
                <p class="text-[#4a3e3d] font-bold uppercase tracking-wider text-[10px]">{{ data.dressCode }}</p>
             </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-24 px-4 bg-[#fffcf7]">
        <div class="max-w-5xl mx-auto space-y-12">
          <div class="text-center" v-observe>
            <h2 class="text-4xl md:text-5xl font-serif text-[#4a3e3d]">Captured Moments</h2>
            <div class="w-12 h-1 bg-[#ffbeab] mx-auto rounded-full mt-2"></div>
          </div>
          <div class="p-4 bg-white rounded-[2rem] shadow-md border border-[#ffe5db]">
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- GIFT -->
      <section id="gift" v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.eWalletLink?.length)" class="py-24 px-6 text-center bg-white">
        <div class="max-w-4xl mx-auto space-y-12">
          <div class="text-center" v-observe>
            <h2 class="text-4xl md:text-5xl font-serif text-[#4a3e3d]">Kado Digital</h2>
            <div class="w-12 h-1 bg-[#ffbeab] mx-auto rounded-full mt-2"></div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-6">
            <div v-for="(bank, idx) in data.bankAccounts" :key="idx" class="p-6 bg-[#fffcf7] border border-[#ffe5db] rounded-[2rem] w-full sm:w-[320px] shadow-sm text-left flex flex-col justify-between" v-observe>
              <div class="flex justify-between items-center mb-6">
                 <p class="text-base font-bold uppercase tracking-wider text-[#ff8c69]">{{ bank.bankName }}</p>
                 <div class="w-10 h-10 bg-[#fff5f0] rounded-full flex items-center justify-center text-[#ff9f80]"><i class="fa-solid fa-gift"></i></div>
              </div>
              <p class="text-2xl font-bold tracking-wider mb-1 text-[#4a3e3d]">{{ bank.accountNumber }}</p>
              <p class="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-6">A.N {{ bank.accountName }}</p>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full py-2.5 bg-white text-[#ff8c69] hover:bg-[#ff9f80] hover:text-white font-bold uppercase tracking-wider text-[9px] rounded-full transition-colors border border-[#ffbeab]">Salin Rekening</button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-24 px-6 bg-[#fffcf7] relative overflow-hidden">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-12" v-observe>
            <h2 class="text-4xl font-serif text-[#4a3e3d]">Konfirmasi Kehadiran</h2>
            <p class="text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-1">Kami Menunggu Kehadiran Anda</p>
          </div>

          <form @submit.prevent="submitRSVP" class="bg-white p-6 md:p-10 rounded-[2rem] shadow-md border border-[#ffe5db] space-y-6" v-observe>
            <div class="space-y-1">
              <label class="text-[9px] uppercase tracking-widest font-bold text-[#ff8c69] px-2">Nama Lengkap</label>
              <input v-model="rsvp.name" type="text" class="w-full bg-[#fffcf7] border border-[#ffe5db] rounded-xl py-3 px-4 text-xs font-semibold focus:border-[#ff9f80] outline-none transition-colors" required />
            </div>
            
            <div class="space-y-2">
               <label class="text-[9px] uppercase tracking-widest font-bold text-[#ff8c69] px-2">Konfirmasi Kehadiran</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-3 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[9px]" :class="rsvp.attendance === 'hadir' ? 'border-[#ff9f80] bg-[#ff9f80] text-white' : 'border-[#ffe5db] bg-[#fffcf7] text-gray-500'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Hadir
                 </label>
                 <label class="flex-1 py-3 border rounded-xl text-center cursor-pointer transition-all font-bold uppercase tracking-wider text-[9px]" :class="rsvp.attendance === 'tidak' ? 'border-red-400 bg-red-50 text-red-500' : 'border-[#ffe5db] bg-[#fffcf7] text-gray-500'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Tidak Hadir
                 </label>
               </div>
            </div>

            <div v-if="rsvp.attendance === 'hadir'" class="space-y-1">
              <label class="text-[9px] uppercase tracking-widest font-bold text-[#ff8c69] px-2">Jumlah Tamu</label>
              <select v-model="rsvp.totalGuests" class="w-full bg-[#fffcf7] border border-[#ffe5db] rounded-xl py-3 px-4 text-xs font-semibold focus:border-[#ff9f80] outline-none">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
              </select>
            </div>

            <div class="space-y-1">
               <label class="text-[9px] uppercase tracking-widest font-bold text-[#ff8c69] px-2">Ucapan & Doa Restu</label>
               <textarea v-model="rsvp.message" rows="3" class="w-full bg-[#fffcf7] border border-[#ffe5db] rounded-xl py-3 px-4 text-xs font-normal focus:border-[#ff9f80] outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-4 bg-[#ff9f80] hover:bg-[#ff8c69] text-white text-[9px] uppercase tracking-widest font-black rounded-full shadow transition-all duration-300">Kirim Konfirmasi</button>
          </form>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-16 text-center bg-white space-y-6 border-t border-[#ffe5db]">
        <i class="fa-solid fa-paw text-[#ffbeab] text-2xl"></i>
        <h2 class="font-serif text-3xl font-bold text-[#4a3e3d]">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p class="text-[8px] uppercase tracking-widest font-bold text-gray-400">Created with ❤️ by satuundangan.id</p>
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

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-[1000ms]', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-6')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
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
  }, 1100) // Delay to let letter pop up animation finish
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activeSection.value = e.target.id })
  }, { threshold: 0.4 })
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

/* 3D Envelope Styles */
.envelope-container {
  margin: 0 auto;
}

.envelope-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.envelope-flap {
  transform-origin: top center;
  transition: transform 0.6s ease-in-out, z-index 0.2s ease-in-out;
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
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1), z-index 0.5s ease-in-out;
}

.letter-down {
  transform: translateY(0);
  z-index: 8;
}

.letter-up {
  transform: translateY(-55%);
  z-index: 22;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.animate-wiggle {
  animation: wiggle 3s ease-in-out infinite;
}

.fade-screen-leave-active {
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}
.fade-screen-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
