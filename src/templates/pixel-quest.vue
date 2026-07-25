<template>
  <div class="relative h-screen bg-[#0b0b14] overflow-hidden font-vt323 text-gray-100 selection:bg-rose-500 selection:text-white">
    <!-- BACKGROUND CANVAS FOR FLOATING HEART PIXELS -->
    <canvas ref="pixelCanvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50"></canvas>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && isOpened"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#0b0b14"
      accentColor="#f43f5e"
      :autoPlay="isOpened"
      class="z-[60]"
    />

    <!-- Bottom Navigation (Retro Style) -->
    <nav
      v-if="isOpened"
      class="fixed bottom-0 left-0 right-0 z-[80] bg-[#101018]/90 border-t-4 border-white shadow-[0_-8px_0_0_#000] animate-fade-in flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-2 py-3 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group"
          :class="
            activeSection === item.id
              ? 'text-yellow-400 scale-110 -translate-y-1'
              : 'text-gray-500 hover:text-white'
          "
        >
          <i :class="[item.icon, 'text-xl md:text-2xl']"></i>
          <span class="max-w-full truncate text-[8px] font-pixel-sub uppercase tracking-tighter">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen / Gatekeeper -->
    <transition name="pixel-gate">
      <div
        v-if="!isOpened"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06060c] px-6"
      >
        <div class="max-w-md w-full text-center retro-border p-8 relative overflow-hidden bg-[#101018]">
          <!-- Starry Frame details -->
          <div class="absolute top-2 left-2 text-yellow-400 text-xs font-pixel-sub">★</div>
          <div class="absolute top-2 right-2 text-yellow-400 text-xs font-pixel-sub">★</div>
          <div class="absolute bottom-2 left-2 text-yellow-400 text-xs font-pixel-sub">★</div>
          <div class="absolute bottom-2 right-2 text-yellow-400 text-xs font-pixel-sub">★</div>

          <!-- Wedding Game Logo -->
          <div class="text-rose-500 text-6xl my-4 animate-float">❤️</div>
          <h1 class="font-pixel-title text-lg md:text-xl text-yellow-400 leading-relaxed mb-2">WEDDING QUEST</h1>
          <p class="font-pixel-sub text-[10px] text-blue-400 mb-6 tracking-widest uppercase">{{ data.heroLabel || 'EDISI PERNIKAHAN 8-BIT' }}</p>

          <hr class="border-2 border-dashed border-gray-700 my-4">

          <p class="text-xl mb-1 text-gray-300">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <div class="text-2xl text-white font-bold my-2 bg-slate-900 p-2 border-2 border-gray-500 rounded-sm truncate">
            {{ data.guestName || 'Tamu Undangan Istimewa' }}
          </div>

          <p class="text-sm text-gray-400 mb-8 mt-4 leading-relaxed">Kami mengundang Anda untuk bergabung dalam misi petualangan hidup kami!</p>

          <!-- Insert Coin/Press Start Action -->
          <button @click="openInvitation" class="retro-btn retro-btn-rose px-6 py-4 text-xl w-full font-pixel-sub animate-pulse-pixel">
            INSERT COIN / START
          </button>

          <p class="text-xs text-gray-500 mt-4 font-pixel-sub uppercase">Ketuk untuk memulai petualangan</p>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div
      v-if="isOpened"
      id="main-content"
      class="opacity-0 transition-opacity duration-1000 h-full overflow-y-auto no-scrollbar scroll-smooth bg-[#0b0b14]"
    >
      <div class="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16 pb-32">
        
        <!-- HERO SECTION -->
        <header id="home" class="text-center pt-8">
          <div class="retro-border p-6 bg-gradient-to-b from-[#18182c] to-[#0c0c1a]" v-observe>
            <div class="flex justify-between text-yellow-500 font-pixel-sub text-[10px] mb-4">
              <span>SCORE: 999990</span>
              <span>STAGE: WEDDING</span>
              <span>LIVES: ❤️❤️❤️</span>
            </div>
            
            <h2 class="font-pixel-sub text-[10px] tracking-[0.3em] text-cyan-400 mb-2 uppercase">PENGUMUMAN CO-OP MODE</h2>
            <h1 class="font-pixel-title text-2xl md:text-5xl text-rose-500 font-extrabold my-6 uppercase tracking-wider">
              {{ data.groomName?.split(' ')[0] }} &amp; {{ data.brideName?.split(' ')[0] }}
            </h1>
            <p class="text-2xl text-gray-300">Menuju Pelaminan &amp; Misi Seumur Hidup!</p>
            
            <div class="inline-block bg-slate-900 px-6 py-3 border-2 border-slate-700 text-emerald-400 my-6 text-xl">
              📆 {{ formatDate(data.akadLocation?.dateTime || data.resepsiLocation?.dateTime) }}
            </div>

            <!-- Floating retro stats -->
            <p class="text-sm text-gray-400 italic">"Dua pemain bersepakat untuk mengunci slot kontrol selamanya."</p>
          </div>
        </header>

        <!-- COUNTDOWN CLOCK -->
        <section class="text-center" v-observe>
          <div class="retro-border-accent p-6 max-w-xl mx-auto bg-[#101018]">
            <h3 class="font-pixel-sub text-[10px] text-rose-400 mb-4 tracking-widest uppercase">COUNTDOWN TO QUEST COMMENCEMENT</h3>
            <div class="grid grid-cols-4 gap-2 text-center">
              <div class="bg-black/60 p-2 border-2 border-rose-500">
                <div class="text-3xl md:text-4xl text-white font-bold">{{ countdown.Hari }}</div>
                <div class="text-[10px] text-rose-400 uppercase font-pixel-sub">HARI</div>
              </div>
              <div class="bg-black/60 p-2 border-2 border-rose-500">
                <div class="text-3xl md:text-4xl text-white font-bold">{{ countdown.Jam }}</div>
                <div class="text-[10px] text-rose-400 uppercase font-pixel-sub">JAM</div>
              </div>
              <div class="bg-black/60 p-2 border-2 border-rose-500">
                <div class="text-3xl md:text-4xl text-white font-bold">{{ countdown.Menit }}</div>
                <div class="text-[10px] text-rose-400 uppercase font-pixel-sub">MENIT</div>
              </div>
              <div class="bg-black/60 p-2 border-2 border-rose-500">
                <div class="text-3xl md:text-4xl text-white font-bold">{{ countdown.Detik }}</div>
                <div class="text-[10px] text-rose-400 uppercase font-pixel-sub">DETIK</div>
              </div>
            </div>
          </div>
        </section>

        <!-- QUOTE SECTION -->
        <section v-if="isSectionEnabled('quote')" class="text-center px-4" v-observe>
          <div class="retro-border p-8 max-w-2xl mx-auto bg-slate-900/50">
            <div class="text-yellow-400 text-4xl mb-4">"</div>
            <p class="text-xl md:text-2xl leading-relaxed italic text-gray-200">
              {{ data.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.' }}
            </p>
            <div class="w-16 h-1 bg-rose-500 mx-auto my-6"></div>
            <p class="font-pixel-sub text-xs text-rose-400 tracking-widest uppercase">
              {{ data.quoteSource || 'QS. AR-RUM: 21' }}
            </p>
          </div>
        </section>

        <!-- CHARACTERS / COUPLE DETAILS -->
        <section id="couple" v-if="isSectionEnabled('couple')" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pixel-title text-lg text-yellow-400">CHOOSE YOUR HEROES</h2>
            <p class="text-gray-400 text-xl mt-2">Dua petualang yang siap bergabung dalam satu party</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- GROOM CARD (PLAYER 1) -->
            <div class="retro-border p-6 flex flex-col items-center bg-[#101018]" v-observe>
              <div class="text-blue-400 font-pixel-sub text-[10px] mb-4 tracking-widest uppercase">PLAYER 1</div>
              
              <!-- Pixel Portrait Container -->
              <div class="w-48 h-48 bg-slate-800 border-4 border-blue-500 p-2 flex items-center justify-center relative mb-6 overflow-hidden">
                <img v-if="data.groomPhotoUrl" :src="data.groomPhotoUrl" class="w-full h-full object-cover [image-rendering:pixelated]" />
                <svg v-else class="w-full h-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Pixelated Boy Portrait -->
                  <rect x="4" y="4" width="8" height="9" fill="#ffdbac"/>
                  <rect x="3" y="2" width="10" height="3" fill="#5c4033"/>
                  <rect x="3" y="3" width="2" height="4" fill="#5c4033"/>
                  <rect x="11" y="3" width="2" height="4" fill="#5c4033"/>
                  <rect x="5" y="6" width="2" height="2" fill="#2b1a09"/>
                  <rect x="9" y="6" width="2" height="2" fill="#2b1a09"/>
                  <rect x="4" y="8" width="1" height="1" fill="#f43f5e"/>
                  <rect x="11" y="8" width="1" height="1" fill="#f43f5e"/>
                  <rect x="7" y="10" width="2" height="1" fill="#111"/>
                  <rect x="2" y="13" width="12" height="3" fill="#1e3a8a"/>
                  <rect x="7" y="13" width="2" height="3" fill="#fff"/>
                  <rect x="7" y="14" width="2" height="1" fill="#ef4444"/>
                </svg>
              </div>

              <h3 class="text-3xl text-blue-400 font-bold mb-2">{{ data.groomName || 'Rian Mahendra' }}</h3>
              <p class="text-lg text-gray-400 mb-6">Putra dari {{ data.parents?.groomParents || 'Bapak Mahendra & Ibu Ratna' }}</p>

              <!-- Character Stats Panel -->
              <div class="w-full bg-slate-950 p-4 border-2 border-slate-700 text-sm space-y-2 font-mono">
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>CLASS:</span> <span class="text-cyan-400 uppercase">{{ data.groomOrder || 'Software Knight' }}</span>
                </div>
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>WEAPON:</span> <span class="text-cyan-400">Wedding Gold Ring</span>
                </div>
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>HP:</span> <span class="text-emerald-400">999 / 999</span>
                </div>
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>MP:</span> <span class="text-blue-400">550 / 550</span>
                </div>
                <div class="flex justify-between">
                  <span>SPECIAL:</span> <span class="text-yellow-400">Lover's Aura</span>
                </div>
              </div>
              
              <div v-if="data.socialMediaGroom?.instagram" class="mt-6 w-full">
                <a :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="retro-btn w-full py-2 text-center text-sm flex items-center justify-center gap-2">
                  <i class="fa-brands fa-instagram text-lg"></i>
                  @{{ data.socialMediaGroom.instagram.replace('@', '') }}
                </a>
              </div>
            </div>

            <!-- BRIDE CARD (PLAYER 2) -->
            <div class="retro-border p-6 flex flex-col items-center border-rose-500 bg-[#101018]" v-observe>
              <div class="text-rose-400 font-pixel-sub text-[10px] mb-4 tracking-widest uppercase">PLAYER 2</div>

              <!-- Pixel Portrait Container -->
              <div class="w-48 h-48 bg-slate-800 border-4 border-rose-500 p-2 flex items-center justify-center relative mb-6 overflow-hidden">
                <img v-if="data.bridePhotoUrl" :src="data.bridePhotoUrl" class="w-full h-full object-cover [image-rendering:pixelated]" />
                <svg v-else class="w-full h-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Pixelated Girl Portrait -->
                  <rect x="4" y="4" width="8" height="9" fill="#ffe0bd"/>
                  <rect x="2" y="2" width="12" height="3" fill="#2d142c"/>
                  <rect x="2" y="5" width="2" height="8" fill="#2d142c"/>
                  <rect x="12" y="5" width="2" height="8" fill="#2d142c"/>
                  <rect x="5" y="6" width="2" height="2" fill="#c084fc"/>
                  <rect x="9" y="6" width="2" height="2" fill="#c084fc"/>
                  <rect x="4" y="8" width="1" height="1" fill="#f43f5e"/>
                  <rect x="11" y="8" width="1" height="1" fill="#f43f5e"/>
                  <rect x="7" y="10" width="2" height="1" fill="#e11d48"/>
                  <rect x="6" y="1" width="4" height="1" fill="#facc15"/>
                  <rect x="7" y="0" width="2" height="1" fill="#facc15"/>
                  <rect x="2" y="13" width="12" height="3" fill="#fdf2f8"/>
                  <rect x="6" y="13" width="4" height="1" fill="#ec4899"/>
                </svg>
              </div>

              <h3 class="text-3xl text-rose-400 font-bold mb-2">{{ data.brideName || 'Sari Amalia' }}</h3>
              <p class="text-lg text-gray-400 mb-6">Putri dari {{ data.parents?.brideParents || 'Bapak Gunawan & Ibu Sulastri' }}</p>

              <!-- Character Stats Panel -->
              <div class="w-full bg-slate-950 p-4 border-2 border-slate-700 text-sm space-y-2 font-mono">
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>CLASS:</span> <span class="text-pink-400 uppercase">{{ data.brideOrder || 'Design Sorceress' }}</span>
                </div>
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>WEAPON:</span> <span class="text-pink-400">Bridal Bouquet</span>
                </div>
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>HP:</span> <span class="text-emerald-400">999 / 999</span>
                </div>
                <div class="flex justify-between border-b border-slate-800 pb-1">
                  <span>MP:</span> <span class="text-blue-400">620 / 620</span>
                </div>
                <div class="flex justify-between">
                  <span>SPECIAL:</span> <span class="text-yellow-400">Radiant Smile</span>
                </div>
              </div>

              <div v-if="data.socialMediaBrides?.instagram" class="mt-6 w-full">
                <a :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="retro-btn retro-btn-rose w-full py-2 text-center text-sm flex items-center justify-center gap-2">
                  <i class="fa-brands fa-instagram text-lg"></i>
                  @{{ data.socialMediaBrides.instagram.replace('@', '') }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- QUEST DIARY (LOVE STORY) -->
        <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pixel-title text-lg text-yellow-400 uppercase tracking-widest">OUR QUEST DIARY</h2>
            <p class="text-gray-400 text-xl mt-2">Bagaimana cara kami naik level (Level-Up) menuju pernikahan</p>
          </div>

          <div class="space-y-8 max-w-2xl mx-auto">
            <div 
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)" 
              :key="idx"
              class="retro-border p-6 bg-slate-900/80 flex flex-col md:flex-row items-center gap-6"
              v-observe
            >
              <div 
                class="px-4 py-2 font-bold text-2xl border-4 border-white shrink-0"
                :class="idx % 3 === 0 ? 'bg-blue-600' : idx % 3 === 1 ? 'bg-purple-600' : 'bg-yellow-600'"
              >
                LVL {{ idx + 1 }}
              </div>
              <div class="flex-1 text-center md:text-left">
                <h4 class="text-2xl font-bold text-white mb-1">{{ story.title }}</h4>
                <span class="font-pixel-sub text-[10px] text-gray-500 block mb-3 uppercase tracking-widest">{{ story.date }}</span>
                <p class="text-lg text-gray-300 leading-relaxed">{{ story.description }}</p>
              </div>
              <div v-if="story.image" class="w-32 h-32 border-4 border-slate-700 shrink-0 overflow-hidden hidden md:block">
                <img :src="story.image" class="w-full h-full object-cover [image-rendering:pixelated]" />
              </div>
            </div>
          </div>
        </section>

        <!-- EVENT INFO (THE MAIN QUESTS) -->
        <section id="event" v-if="isSectionEnabled('event')" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pixel-title text-lg text-emerald-400 uppercase tracking-widest">THE MAIN QUESTS</h2>
            <p class="text-gray-400 text-xl mt-2">Tanggal, waktu, dan peta wilayah event berlangsung</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- QUEST 1: AKAD -->
            <div class="retro-border p-6 bg-[#161d12] border-emerald-500" v-observe>
              <div class="flex items-center gap-4 mb-6">
                <span class="text-4xl">⚔️</span>
                <div>
                  <h3 class="text-2xl font-bold text-emerald-400 uppercase">AKAD NIKAH</h3>
                  <p class="font-pixel-sub text-[10px] text-emerald-500 uppercase tracking-widest">QUEST ACARA UTAMA</p>
                </div>
              </div>
              
              <ul class="space-y-4 text-xl text-gray-300 mb-8">
                <li class="flex items-start gap-3">
                  <span class="shrink-0">📅</span>
                  <strong class="text-white">{{ formatDate(data.akadLocation?.dateTime) }}</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span class="shrink-0">⏰</span>
                  <strong class="text-white">{{ formatTime(data.akadLocation?.dateTime) }} WIB</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span class="shrink-0">📍</span>
                  <span class="leading-snug">{{ data.akadLocation?.description }}</span>
                </li>
              </ul>

              <div class="p-4 bg-black/40 border border-emerald-600 text-xs text-emerald-300 font-pixel-sub uppercase tracking-wider">
                *Dikhususkan untuk keluarga terdekat untuk kelancaran jalannya upacara yang hikmat.
              </div>
              
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="retro-btn retro-btn-emerald px-6 py-3 text-lg mt-6 block text-center">
                🧭 BUKA DI GOOGLE MAPS
              </a>
            </div>

            <!-- QUEST 2: RESEPSI -->
            <div class="retro-border p-6 bg-[#1f1610] border-amber-500" v-observe>
              <div class="flex items-center gap-4 mb-6">
                <span class="text-4xl">🏆</span>
                <div>
                  <h3 class="text-2xl font-bold text-amber-400 uppercase">RESEPSI</h3>
                  <p class="font-pixel-sub text-[10px] text-amber-500 uppercase tracking-widest">THE GRAND FEAST</p>
                </div>
              </div>
              
              <ul class="space-y-4 text-xl text-gray-300 mb-8">
                <li class="flex items-start gap-3">
                  <span class="shrink-0">📅</span>
                  <strong class="text-white">{{ formatDate(data.resepsiLocation?.dateTime) }}</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span class="shrink-0">⏰</span>
                  <strong class="text-white">11:00 - 16:00 WIB</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span class="shrink-0">📍</span>
                  <span class="leading-snug">{{ data.resepsiLocation?.description }}</span>
                </li>
              </ul>

              <div class="p-4 bg-black/40 border border-amber-600 text-xs text-amber-300 font-pixel-sub uppercase tracking-wider">
                *Mari beramah-tamah, merayakan bersama santapan lezat, dan mengobrol asyik!
              </div>

              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="retro-btn retro-btn-rose px-6 py-3 text-lg mt-6 block text-center">
                🧭 BUKA DI GOOGLE MAPS
              </a>
            </div>
          </div>
          
          <!-- DRESS CODE SECTION -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="retro-border p-8 text-center max-w-xl mx-auto bg-slate-900 border-rose-500" v-observe>
            <h4 class="font-pixel-title text-sm mb-4 text-rose-500 uppercase tracking-widest">THE DRESS CODE</h4>
            <p class="text-2xl text-white font-bold mb-2">"{{ data.dressCode }}"</p>
            <div class="mt-4 flex justify-center gap-4">
              <div class="w-12 h-12 bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-2xl">👔</div>
              <div class="w-12 h-12 bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-2xl">👗</div>
            </div>
          </div>
        </section>

        <!-- GALLERY SECTION -->
        <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pixel-title text-lg text-cyan-400 uppercase tracking-widest">OUR MOMENTS</h2>
            <p class="text-gray-400 text-xl mt-2">Koleksi kenangan dalam resolusi terbaik (Captured Memories)</p>
          </div>
          
          <div class="retro-border p-4 bg-[#101018] border-cyan-500" v-observe>
            <GalleryInvitation :items="galleryImages" />
          </div>
        </section>

        <!-- GIFT REGISTRY (ADVENTURE FUND) -->
        <section id="gift" v-if="isSectionEnabled('gift')" class="max-w-xl mx-auto space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pixel-title text-lg text-yellow-400 uppercase tracking-widest">GOLD CHEST</h2>
            <p class="text-gray-400 text-xl mt-2">Kirimkan bekal emas / hadiah untuk mendukung perjalanan kami</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="(bank, index) in data.bankAccounts" 
              :key="index"
              class="retro-border p-6 bg-slate-900 relative"
              v-observe
            >
              <div class="text-yellow-500 font-pixel-sub text-[10px] mb-2 uppercase tracking-widest">GOLD TRANSFER {{ index + 1 }}</div>
              <div class="text-2xl font-bold text-white mb-2 uppercase">{{ bank.bankName }}</div>
              <div class="text-2xl text-cyan-400 font-mono tracking-wider break-all mb-1">{{ bank.accountNumber }}</div>
              <div class="text-xs text-gray-400 mt-1 uppercase font-pixel-sub">A/N {{ bank.accountName }}</div>
              <button @click="copyToClipboard(bank.accountNumber)" class="retro-btn px-4 py-2 text-xs mt-4 uppercase">
                📋 SALIN NO REK
              </button>
            </div>
          </div>

          <!-- Physical Gift -->
          <div v-if="data.giftDeliveryAddress" class="retro-border p-6 text-center bg-[#101018] border-rose-500" v-observe>
            <h3 class="font-pixel-sub text-[10px] text-rose-500 mb-4 uppercase tracking-widest">KIRIM KADO FISIK</h3>
            <p class="text-lg text-gray-300 leading-relaxed italic mb-6">
              "{{ Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress }}"
            </p>
            <button @click="copyToClipboard(Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress)" class="retro-btn px-6 py-2 text-sm uppercase">
              📋 SALIN ALAMAT
            </button>
          </div>
        </section>

        <!-- RSVP SECTION -->
        <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="max-w-xl mx-auto space-y-8">
          <div class="retro-border-accent p-8 bg-slate-950/95" v-observe>
            <div class="text-center mb-8">
              <h2 class="font-pixel-title text-lg text-rose-500 uppercase tracking-widest">QUEST CONFIRMATION (RSVP)</h2>
              <p class="text-gray-400 text-xl mt-2">Apakah Anda akan bergabung dalam party perayaan kami?</p>
            </div>

            <form @submit.prevent="submitRSVP" class="space-y-6">
              <div>
                <label class="block text-sm text-gray-400 mb-2 uppercase tracking-widest font-pixel-sub">NAMA PETUALANG (GUEST NAME):</label>
                <input v-model="rsvp.name" type="text" required class="w-full bg-slate-900 border-4 border-slate-700 p-3 text-xl text-white font-mono focus:border-rose-500 outline-none" placeholder="Masukkan nama Anda...">
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block text-sm text-gray-400 mb-2 uppercase tracking-widest font-pixel-sub">JUMLAH ANGGOTA PARTY (SQUAD SIZE):</label>
                <select v-model="rsvp.totalGuests" class="w-full bg-slate-900 border-4 border-slate-700 p-3 text-xl text-white font-mono focus:border-rose-500 outline-none">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang ({{ n === 1 ? 'Single Player' : n === 2 ? 'Local Co-Op' : 'Guild Member' }})</option>
                </select>
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-2 uppercase tracking-widest font-pixel-sub">APAKAH AKAN HADIR (ACCEPT QUEST?):</label>
                <div class="grid grid-cols-2 gap-4 mt-2">
                  <label class="flex items-center justify-center p-4 border-4 border-slate-700 bg-slate-900 cursor-pointer hover:border-emerald-500 text-lg transition-all" :class="rsvp.attendance === 'hadir' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' : ''">
                    <input type="radio" v-model="rsvp.attendance" value="hadir" class="sr-only">
                    <span class="font-bold">🟢 HADIR (ACCEPT)</span>
                  </label>
                  <label class="flex items-center justify-center p-4 border-4 border-slate-700 bg-slate-900 cursor-pointer hover:border-rose-500 text-lg transition-all" :class="rsvp.attendance === 'tidak' ? 'border-rose-500 bg-rose-950/40 text-rose-400' : ''">
                    <input type="radio" v-model="rsvp.attendance" value="tidak" class="sr-only">
                    <span class="font-bold">🔴 ABSEN (DECLINE)</span>
                  </label>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm text-gray-400 mb-2 uppercase tracking-widest font-pixel-sub">PESAN/UCAPAN (MESSAGE):</label>
                <textarea v-model="rsvp.message" rows="4" class="w-full bg-slate-900 border-4 border-slate-700 p-3 text-xl text-white font-mono focus:border-rose-500 outline-none resize-none" placeholder="Tulis ucapan selamatmu..."></textarea>
              </div>

              <button type="submit" class="retro-btn retro-btn-emerald w-full py-4 text-2xl mt-4 font-bold shadow-[0_8px_0_0_#064e3b] active:shadow-none active:translate-y-2 transition-all">
                ⚔️ KIRIM JAWABAN (SUBMIT)
              </button>
            </form>
          </div>
        </section>

        <!-- WISH LOG / GUEST BOOK -->
        <section class="max-w-2xl mx-auto space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pixel-title text-lg text-cyan-400 uppercase tracking-widest">THE WISH LOG</h2>
            <p class="text-gray-400 text-xl mt-2">Pesan berharga dari para petualang lainnya</p>
          </div>

          <!-- Scrollable Terminal of wishes -->
          <div class="retro-border p-6 bg-black border-slate-700" v-observe>
            <div class="flex items-center gap-3 mb-6 text-xs text-gray-500">
              <span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span class="font-mono ml-2 uppercase tracking-widest">TERMINAL_LOGS: ACTIVE_WISHES.TXT</span>
            </div>
            
            <div class="space-y-6 max-h-[500px] overflow-y-auto pr-4 no-scrollbar">
              <div 
                v-for="(msg, i) in guestMessages" 
                :key="i"
                class="border-b-2 border-slate-800 pb-6 last:border-0"
              >
                <div class="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 mb-2">
                  <div class="flex items-center gap-3">
                    <span class="text-yellow-400 font-bold text-xl uppercase">[{{ msg.rsvpStatus === 'hadir' ? 'HERO' : 'NPC' }}] {{ msg.guestName }}</span>
                    <span v-if="msg.rsvpStatus === 'hadir'" class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 border border-emerald-500/30 uppercase font-pixel-sub tracking-widest">ACCEPTED</span>
                  </div>
                  <span class="text-gray-500 text-sm font-mono">{{ timeAgo(msg.createdAt) }}</span>
                </div>
                <p class="text-gray-300 text-lg leading-relaxed italic">"{{ msg.message }}"</p>
                <div v-if="msg.totalGuests > 1" class="text-[10px] text-blue-400 mt-2 font-pixel-sub uppercase tracking-widest">PARTY SIZE: {{ msg.totalGuests }} MEMBERS</div>
              </div>
              
              <div v-if="guestMessages.length === 0" class="text-center py-12 text-gray-600 font-pixel-sub uppercase tracking-widest">
                --- NO LOGS FOUND ---
              </div>
            </div>
          </div>
        </section>

        <!-- FOOTER / CREDIT SCREEN -->
        <footer class="text-center py-20 text-sm text-gray-500 relative" v-observe>
          <div class="w-32 h-[2px] bg-slate-800 mx-auto mb-8"></div>
          <div class="font-mono space-y-3">
            <p class="uppercase tracking-[0.2em]">© {{ new Date().getFullYear() }} {{ data.groomName?.split(' ')[0] }} &amp; {{ data.brideName?.split(' ')[0] }} WEDDING QUEST</p>
            <p v-if="data.show_branding" class="text-gray-600 mt-1 uppercase tracking-widest text-[10px]">ALL RIGHTS RESERVED. MADE WITH ❤️ BY SATUUNDANGAN.ID</p>
          </div>
          <div class="text-yellow-600 text-2xl mt-12 font-bold font-pixel-title uppercase tracking-widest animate-pulse">
            THANKS FOR PLAYING!
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const toast = useToast()
const isOpened = ref(false)
const isPreviewMode = computed(() => props.data?.id === 'live-preview' || props.data?.id === 0)

// Illustration Paths
const illustrationGroomUrl = '/assets/images/foto_pengantin_afifah_saputra_animasi.png'
const illustrationBrideUrl = '/assets/images/foto_pengantin_afifah_saputra_animasi.png'

const data = ref(props.data || {})

watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
  },
  { deep: true, immediate: true },
)

const mockStories = [
  {
    title: 'Awal Petualangan',
    date: 'Januari 2024',
    description: 'Kisah cinta kami bermula dari pertemuan tak terduga yang menumbuhkan benih-benih kasih.',
  },
  {
    title: 'Co-Op Mode Unlocked',
    date: 'Februari 2025',
    description: 'Kami memutuskan untuk menjalin hubungan dan mulai petualangan bersama.',
  },
  {
    title: 'Ultimate Promotion',
    date: 'Maret 2026',
    description: 'Momen sakral dimana kami berkomitmen untuk melangkah ke jenjang pernikahan.',
  },
]

const galleryImages = ref([])
const guestMessages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const activeSection = ref('home')
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null
const pixelCanvas = ref(null)

const navItems = computed(() => {
  const items = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart' },
    { id: 'story', label: 'Cerita', icon: 'fa-solid fa-book-open' },
    { id: 'event', label: 'Acara', icon: 'fa-solid fa-map-location-dot' },
    { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' },
    { id: 'gift', label: 'Kado', icon: 'fa-solid fa-coins' },
    { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-floppy-disk' },
  ]
  return items.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'story') return isSectionEnabled('love-story') && (data.value.loveStory?.length > 0 || isPreviewMode.value)
    if (item.id === 'gallery') return isSectionEnabled('gallery') && data.value.galleryImages?.length > 0
    if (item.id === 'gift') return isSectionEnabled('gift')
    return isSectionEnabled(item.id)
  })
})

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-[800ms]', 'ease-out')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('opacity-0', 'translate-y-10')
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

// Particle Heart Logic
class HeartParticle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = this.canvas.height + Math.random() * 100
    this.size = Math.random() * 12 + 8
    this.speedY = -(Math.random() * 0.8 + 0.3)
    this.speedX = Math.random() * 0.4 - 0.2
    this.color = ['#f43f5e', '#fda4af', '#e11d48', '#fb7185'][Math.floor(Math.random() * 4)]
    this.opacity = Math.random() * 0.4 + 0.1
  }

  update() {
    this.y += this.speedY
    this.x += this.speedX
    if (this.y < -20) this.reset()
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity
    const s = this.size / 4
    const grid = [
      [0,1,1,0,1,1,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
      [0,0,0,1,0,0,0]
    ]

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 1) {
          ctx.fillRect(
            this.x + (col * s) - (grid[0].length * s / 2),
            this.y + (row * s) - (grid.length * s / 2),
            s + 0.5,
            s + 0.5
          )
        }
      }
    }
  }
}

let particles = []
let animationId = null

function initParticleEngine() {
  const canvas = pixelCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  window.addEventListener('resize', resize)
  resize()
  
  particles = Array.from({ length: 25 }, () => new HeartParticle(canvas))
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      p.update()
      p.draw(ctx)
    })
    animationId = requestAnimationFrame(animate)
  }
  animate()
}

async function openInvitation() {
  isOpened.value = true
  await nextTick()
  const el = document.getElementById('main-content')
  if (el) {
    setTimeout(() => {
      el.classList.remove('opacity-0')
      el.classList.add('opacity-100')
    }, 50)
  }
  initScrollSpy()
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { threshold: 0.3 },
  )
  navItems.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:')) return choice
  if (choice.includes('/') || choice.includes('http')) return choice
  return '/audio/wedding-chiptune-retro.mp3'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).toUpperCase()
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function isSectionEnabled(key) {
  if (data.value.selectedSections === undefined || data.value.selectedSections === null) return true
  return data.value.selectedSections.includes(key)
}

function formatInstagramUrl(handle) {
  return handle ? `https://instagram.com/${handle.replace('@', '')}` : '#'
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  toast.success('Berhasil disalin!')
}

function timeAgo(date) {
  if (!date) return ''
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  let interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' bulan lalu'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' hari lalu'
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' jam lalu'
  return 'Baru saja'
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim()) {
    toast.error('Isi nama Anda.')
    return
  }
  try {
    await createGuestMessage({
      invitationId: data.value.id,
      guestName: rsvp.value.name,
      message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance,
      totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0,
    })
    toast.success(`Konfirmasi terkirim!`)
    loadWishes()
  } catch (err) {
    toast.error('Gagal mengirim RSVP.')
  }
}

async function loadWishes() {
  if (data.value.id && data.value.id !== 'live-preview' && data.value.id !== 0) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res
    } catch (err) {}
  } else {
    guestMessages.value = [
      {
        guestName: 'Fauzan & Keluarga',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Selamat menempuh quest baru!',
        rsvpStatus: 'hadir',
        totalGuests: 2,
        createdAt: new Date(),
      },
      {
        guestName: 'Siti Aminah',
        message: 'Aaaaa so cute undangannya! Sari akhirnya dapet Player 2 yang sepadan.',
        rsvpStatus: 'hadir',
        totalGuests: 1,
        createdAt: new Date(),
      },
    ]
  }
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }

  if (data.value.akadLocation?.dateTime) {
    const target = new Date(data.value.akadLocation.dateTime).getTime()
    if (!isNaN(target)) {
      if (interval) clearInterval(interval)
      interval = setInterval(() => {
        const now = new Date().getTime()
        const diff = target - now
        if (diff <= 0) {
          if (interval) clearInterval(interval)
          return
        }
        countdown.value.Hari = Math.floor(diff / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, '0')
        countdown.value.Jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          .toString()
          .padStart(2, '0')
        countdown.value.Menit = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, '0')
        countdown.value.Detik = Math.floor((diff % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, '0')
      }, 1000)
    }
  }
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map((src) => ({ src, thumbnail: src }))
  }
  loadWishes()
}

onMounted(() => {
  if (!props.data || Object.keys(props.data).length === 0) {
    const stored = localStorage.getItem('finalPayload')
    if (stored) data.value = { ...data.value, ...JSON.parse(stored) }
  } else {
    data.value = { ...data.value, ...props.data }
  }
  initData()
  initParticleEngine()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
  if (animationId) cancelAnimationFrame(animationId)
})

watch(
  () => props.data,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      data.value = { ...data.value, ...newVal }
      initData()
    }
  },
  { deep: true },
)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&display=swap');

.font-pixel-title {
  font-family: 'Press Start 2P', cursive;
}
.font-pixel-sub {
  font-family: 'Silkscreen', sans-serif;
}
.font-vt323 {
  font-family: 'VT323', monospace;
}

/* JRPG Dialogue Box Style */
.retro-border {
  border: 4px solid #ffffff;
  box-shadow: 
    0 0 0 4px #000000,
    0 8px 0 0 #111111;
  image-rendering: pixelated;
}

.retro-border-accent {
  border: 4px solid #f43f5e;
  box-shadow: 
    0 0 0 4px #000000,
    0 6px 0 0 #881337;
}

/* Pushable Pixel Button */
.retro-btn {
  position: relative;
  display: inline-block;
  border: 4px solid #ffffff;
  box-shadow: 0 0 0 4px #000000, 0 4px 0 0 #1e3a8a;
  background-color: #3b82f6;
  color: #ffffff;
  text-shadow: 2px 2px 0px #1e3a8a;
  transition: all 0.1s ease;
  top: 0;
  cursor: pointer;
}

.retro-btn:active {
  top: 4px;
  box-shadow: 0 0 0 4px #000000, 0 0px 0 0 #1e3a8a;
}

.retro-btn-rose {
  background-color: #f43f5e;
  box-shadow: 0 0 0 4px #000000, 0 4px 0 0 #881337;
  text-shadow: 2px 2px 0px #881337;
}
.retro-btn-rose:active {
  box-shadow: 0 0 0 4px #000000, 0 0px 0 0 #881337;
}

.retro-btn-emerald {
  background-color: #10b981;
  box-shadow: 0 0 0 4px #000000, 0 4px 0 0 #064e3b;
  text-shadow: 2px 2px 0px #064e3b;
}
.retro-btn-emerald:active {
  box-shadow: 0 0 0 4px #000000, 0 0px 0 0 #064e3b;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.animate-pulse-pixel {
  animation: pulse-pixel 1.5s infinite;
}
@keyframes pulse-pixel {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.pixel-gate-leave-active {
  transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}
.pixel-gate-leave-to {
  opacity: 0;
  transform: scale(1.1);
  filter: blur(20px);
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

input, select, textarea {
  image-rendering: pixelated;
}

/* Custom Checkbox/Radio */
input[type="radio"] + span::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  margin-right: 8px;
}
</style>
