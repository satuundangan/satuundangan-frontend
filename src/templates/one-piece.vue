<template>
  <div
    class="relative h-screen overflow-hidden font-nautical text-[#2b1a0e] selection:bg-[#b5171e] selection:text-[#f4e4c1] op-sky"
  >
    <!-- Floating bubbles canvas -->
    <canvas ref="seaCanvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-90"></canvas>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && isOpened"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#0f3a5f"
      accentColor="#f9c74f"
      :autoPlay="isOpened"
      class="z-[60]"
    />

    <!-- Bottom Navigation (Compass / Log Pose style) -->
    <nav
      v-if="isOpened"
      class="fixed bottom-0 left-0 right-0 z-[80] bg-[#0b2c48]/95 border-t-4 border-[#f9c74f] shadow-[0_-6px_20px_rgba(0,0,0,0.4)] animate-fade-in flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center justify-center gap-4 px-4 py-3 mx-auto min-w-max">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-1 transition-all duration-300 relative group min-w-[52px] shrink-0"
          :class="
            activeSection === item.id
              ? 'text-[#f9c74f] scale-110 -translate-y-1'
              : 'text-[#a9d6e5]/70 hover:text-[#f4e4c1]'
          "
        >
          <i :class="[item.icon, 'text-xl md:text-2xl']"></i>
          <span class="text-[9px] font-wanted uppercase tracking-tight">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen / WANTED Poster Gate -->
    <transition name="poster-gate">
      <div
        v-if="!isOpened"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center px-5 op-sky"
      >
        <!-- horizon glow + sun -->
        <div class="absolute inset-0 op-horizon pointer-events-none"></div>

        <div class="relative w-full max-w-sm wanted-poster p-6 pb-8 text-center animate-float-slow">
          <div class="wanted-corner top-2 left-2">✦</div>
          <div class="wanted-corner top-2 right-2">✦</div>
          <div class="wanted-corner bottom-2 left-2">✦</div>
          <div class="wanted-corner bottom-2 right-2">✦</div>

          <h1 class="font-pirate text-5xl md:text-6xl text-[#3a2312] tracking-[0.15em] leading-none mt-2">WANTED</h1>
          <div class="flex items-center justify-center gap-2 my-2">
            <span class="h-[2px] w-8 bg-[#7a4a1e]"></span>
            <span class="font-wanted text-[10px] tracking-[0.35em] text-[#7a4a1e] uppercase">Dead or Alive</span>
            <span class="h-[2px] w-8 bg-[#7a4a1e]"></span>
          </div>

          <!-- Straw hat mugshot area -->
          <div class="relative mx-auto my-4 w-40 h-40 border-4 border-[#6b3f18] bg-[#efe0bb] overflow-hidden shadow-inner flex items-center justify-center">
            <img :src="assets.strawHat" alt="straw hat" class="w-32 h-auto mix-blend-multiply" />
          </div>

          <p class="font-wanted text-[11px] tracking-[0.25em] text-[#7a4a1e] uppercase mb-1">Diminta hadir dalam petualangan</p>

          <div class="bg-[#3a2312] text-[#f4e4c1] font-pirate text-2xl md:text-3xl py-2 px-3 my-3 truncate tracking-wide">
            {{ data.guestName || 'Nakama Terhormat' }}
          </div>

          <p class="text-sm text-[#5a3a1c] leading-relaxed mb-6 px-2">
            Sebuah undangan berlayar menuju babak baru kehidupan dua insan. Naikkan jangkar & buka gulungan takdir ini!
          </p>

          <button @click="openInvitation" class="pirate-btn w-full py-3 text-lg font-pirate tracking-widest animate-pulse-soft">
            ⚓ BUKA UNDANGAN
          </button>

          <p class="font-wanted text-[9px] text-[#7a4a1e]/80 mt-4 uppercase tracking-[0.3em]">✕ MARINE ✕ Grand Line Edition</p>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div
      v-if="isOpened"
      id="main-content"
      class="opacity-0 transition-opacity duration-1000 h-full overflow-y-auto no-scrollbar scroll-smooth"
    >
      <!-- Sky + horizon glow + sun (fixed scene) -->
      <div class="fixed inset-0 z-0 op-horizon pointer-events-none"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16 pb-36">

        <!-- HERO -->
        <header id="home" class="text-center pt-6">
          <div v-observe class="relative">
            <p class="font-wanted text-[11px] tracking-[0.4em] text-[#f9c74f] uppercase mb-4">{{ data.heroLabel || 'The Pirate Wedding' }}</p>

            <img :src="assets.sunny" alt="Thousand Sunny" class="w-64 md:w-80 mx-auto drop-shadow-[0_18px_25px_rgba(0,0,0,0.45)] animate-sail" />

            <div class="ocean-plaque mt-2 px-6 py-6 max-w-xl mx-auto">
              <h2 class="font-wanted text-[10px] tracking-[0.35em] text-[#7a4a1e] uppercase mb-2">Kami akan melabuhkan hati</h2>
              <h1 class="font-pirate text-4xl md:text-6xl text-[#3a2312] leading-tight my-3">
                {{ data.groomName?.split(' ')[0] || 'Luffy' }}
                <span class="text-[#b5171e]">&amp;</span>
                {{ data.brideName?.split(' ')[0] || 'Nami' }}
              </h1>
              <div class="flex items-center justify-center gap-3 my-4">
                <span class="text-[#b5171e] text-xl">☠</span>
                <span class="h-[2px] flex-1 max-w-[80px] bg-[#7a4a1e]"></span>
                <span class="font-wanted text-sm text-[#5a3a1c] tracking-widest">{{ formatDate(data.akadLocation?.dateTime || data.resepsiLocation?.dateTime) }}</span>
                <span class="h-[2px] flex-1 max-w-[80px] bg-[#7a4a1e]"></span>
                <span class="text-[#b5171e] text-xl">☠</span>
              </div>
              <p class="text-sm text-[#5a3a1c] italic">"Dua bajak laut menyatukan kompas menuju satu tujuan: One Piece — kebahagiaan seumur hidup."</p>
            </div>
          </div>
        </header>

        <!-- COUNTDOWN (Log Pose) -->
        <section class="text-center" v-observe>
          <div class="ocean-plaque max-w-xl mx-auto px-6 py-6">
            <h3 class="font-wanted text-[10px] text-[#7a4a1e] mb-4 tracking-[0.3em] uppercase">Menuju hari berlayar</h3>
            <div class="grid grid-cols-4 gap-2 text-center">
              <div v-for="(unit, key) in countdown" :key="key" class="log-pose-cell">
                <div class="font-pirate text-3xl md:text-4xl text-[#3a2312]">{{ unit }}</div>
                <div class="text-[9px] text-[#7a4a1e] uppercase font-wanted tracking-widest">{{ key }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- QUOTE -->
        <section v-if="isSectionEnabled('quote')" class="text-center px-2" v-observe>
          <div class="parchment-card max-w-2xl mx-auto p-8">
            <div class="font-pirate text-5xl text-[#b5171e] leading-none mb-2">“</div>
            <p class="text-lg md:text-xl leading-relaxed italic text-[#3a2312]">
              {{ data.quoteText || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.' }}
            </p>
            <div class="w-16 h-1 bg-[#b5171e] mx-auto my-5"></div>
            <p class="font-wanted text-xs text-[#7a4a1e] tracking-[0.3em] uppercase">{{ data.quoteSource || 'QS. Ar-Rum: 21' }}</p>
          </div>
        </section>

        <!-- COUPLE — Bounty Posters -->
        <section id="couple" v-if="isSectionEnabled('couple')" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pirate text-3xl md:text-4xl text-[#f9c74f] drop-shadow-[0_2px_0_#0b2c48]">The Straw Hat Crew</h2>
            <p class="text-[#a9d6e5] text-base mt-2">Dua nakama yang siap berlayar seumur hidup bersama</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Groom bounty -->
            <div class="wanted-poster p-5 pb-6 text-center" v-observe>
              <h3 class="font-pirate text-3xl text-[#3a2312] tracking-widest">WANTED</h3>
              <p class="font-wanted text-[9px] tracking-[0.3em] text-[#7a4a1e] uppercase mb-3">Dead or Alive</p>
              <div class="mx-auto mb-4 w-40 h-44 border-4 border-[#6b3f18] bg-[#efe0bb] overflow-hidden flex items-center justify-center">
                <img v-if="data.groomPhotoUrl" :src="data.groomPhotoUrl" class="w-full h-full object-cover sepia-[.25]" />
                <span v-else class="text-6xl">🏴‍☠️</span>
              </div>
              <h3 class="font-pirate text-3xl text-[#b5171e] mb-1">{{ data.groomName || 'Monkey D. Rian' }}</h3>
              <p class="text-sm text-[#5a3a1c] mb-4">Putra dari {{ data.parents?.groomParents || 'Bapak Mahendra & Ibu Ratna' }}</p>
              <div class="bounty-tag">
                <span class="font-wanted text-[10px] tracking-widest text-[#7a4a1e] uppercase">Bounty</span>
                <span class="font-pirate text-xl text-[#3a2312]">฿ 1,500,000,000</span>
              </div>
              <div v-if="data.socialMediaGroom?.instagram" class="mt-4">
                <a :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="pirate-btn inline-flex items-center gap-2 px-5 py-2 text-sm">
                  <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram.replace('@', '') }}
                </a>
              </div>
            </div>

            <!-- Bride bounty -->
            <div class="wanted-poster p-5 pb-6 text-center" v-observe>
              <h3 class="font-pirate text-3xl text-[#3a2312] tracking-widest">WANTED</h3>
              <p class="font-wanted text-[9px] tracking-[0.3em] text-[#7a4a1e] uppercase mb-3">Dead or Alive</p>
              <div class="mx-auto mb-4 w-40 h-44 border-4 border-[#6b3f18] bg-[#efe0bb] overflow-hidden flex items-center justify-center">
                <img v-if="data.bridePhotoUrl" :src="data.bridePhotoUrl" class="w-full h-full object-cover sepia-[.25]" />
                <span v-else class="text-6xl">🌊</span>
              </div>
              <h3 class="font-pirate text-3xl text-[#b5171e] mb-1">{{ data.brideName || 'Nami D. Sari' }}</h3>
              <p class="text-sm text-[#5a3a1c] mb-4">Putri dari {{ data.parents?.brideParents || 'Bapak Gunawan & Ibu Sulastri' }}</p>
              <div class="bounty-tag">
                <span class="font-wanted text-[10px] tracking-widest text-[#7a4a1e] uppercase">Bounty</span>
                <span class="font-pirate text-xl text-[#3a2312]">฿ 366,000,000</span>
              </div>
              <div v-if="data.socialMediaBrides?.instagram" class="mt-4">
                <a :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="pirate-btn inline-flex items-center gap-2 px-5 py-2 text-sm">
                  <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram.replace('@', '') }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- LOVE STORY — Captain's Log -->
        <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pirate text-3xl md:text-4xl text-[#f9c74f] drop-shadow-[0_2px_0_#0b2c48]">Captain's Log</h2>
            <p class="text-[#a9d6e5] text-base mt-2">Catatan perjalanan menyusuri Grand Line cinta kami</p>
          </div>

          <div class="space-y-6 max-w-2xl mx-auto">
            <div
              v-for="(story, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="idx"
              class="parchment-card p-6 flex flex-col md:flex-row items-center gap-5"
              v-observe
            >
              <div class="log-badge shrink-0">
                <span class="font-wanted text-[9px] uppercase tracking-widest text-[#7a4a1e]">Log</span>
                <span class="font-pirate text-2xl text-[#b5171e]">{{ idx + 1 }}</span>
              </div>
              <div class="flex-1 text-center md:text-left">
                <h4 class="font-pirate text-2xl text-[#3a2312] mb-1">{{ story.title }}</h4>
                <span class="font-wanted text-[10px] text-[#7a4a1e] block mb-2 uppercase tracking-widest">{{ story.date }}</span>
                <p class="text-[15px] text-[#5a3a1c] leading-relaxed">{{ story.description }}</p>
              </div>
              <div v-if="story.image" class="w-28 h-28 border-4 border-[#6b3f18] shrink-0 overflow-hidden hidden md:block">
                <img :src="story.image" class="w-full h-full object-cover sepia-[.2]" />
              </div>
            </div>
          </div>
        </section>

        <!-- EVENT — Island Quests -->
        <section id="event" v-if="isSectionEnabled('event')" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pirate text-3xl md:text-4xl text-[#f9c74f] drop-shadow-[0_2px_0_#0b2c48]">The Islands</h2>
            <p class="text-[#a9d6e5] text-base mt-2">Titik labuh untuk merayakan bersama para nakama</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Akad -->
            <div class="parchment-card p-6" v-observe>
              <div class="flex items-center gap-3 mb-5">
                <span class="text-4xl">⚓</span>
                <div>
                  <h3 class="font-pirate text-2xl text-[#b5171e]">Akad Nikah</h3>
                  <p class="font-wanted text-[9px] text-[#7a4a1e] uppercase tracking-[0.3em]">First Landing</p>
                </div>
              </div>
              <ul class="space-y-3 text-[15px] text-[#3a2312] mb-6">
                <li class="flex items-start gap-3"><span>📅</span><strong>{{ formatDate(data.akadLocation?.dateTime) }}</strong></li>
                <li class="flex items-start gap-3"><span>⏰</span><strong>{{ formatTime(data.akadLocation?.dateTime) }} WIB</strong></li>
                <li class="flex items-start gap-3"><span>📍</span><span class="leading-snug">{{ data.akadLocation?.description }}</span></li>
              </ul>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="pirate-btn block text-center py-2.5 text-base">🧭 Buka Peta Harta Karun</a>
            </div>

            <!-- Resepsi -->
            <div class="parchment-card p-6" v-observe>
              <div class="flex items-center gap-3 mb-5">
                <span class="text-4xl">🏴‍☠️</span>
                <div>
                  <h3 class="font-pirate text-2xl text-[#b5171e]">Resepsi</h3>
                  <p class="font-wanted text-[9px] text-[#7a4a1e] uppercase tracking-[0.3em]">Grand Feast</p>
                </div>
              </div>
              <ul class="space-y-3 text-[15px] text-[#3a2312] mb-6">
                <li class="flex items-start gap-3"><span>📅</span><strong>{{ formatDate(data.resepsiLocation?.dateTime) }}</strong></li>
                <li class="flex items-start gap-3"><span>⏰</span><strong>{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</strong></li>
                <li class="flex items-start gap-3"><span>📍</span><span class="leading-snug">{{ data.resepsiLocation?.description }}</span></li>
              </ul>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="pirate-btn block text-center py-2.5 text-base">🧭 Buka Peta Harta Karun</a>
            </div>
          </div>

          <!-- Dress code -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="parchment-card p-8 text-center max-w-xl mx-auto" v-observe>
            <h4 class="font-pirate text-2xl text-[#b5171e] mb-2">Kode Berpakaian</h4>
            <p class="text-xl text-[#3a2312] font-semibold mb-3">"{{ data.dressCode }}"</p>
            <div class="flex justify-center gap-4">
              <div class="w-12 h-12 border-2 border-dashed border-[#7a4a1e] flex items-center justify-center text-2xl">🧥</div>
              <div class="w-12 h-12 border-2 border-dashed border-[#7a4a1e] flex items-center justify-center text-2xl">👗</div>
            </div>
          </div>
        </section>

        <!-- GALLERY -->
        <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pirate text-3xl md:text-4xl text-[#f9c74f] drop-shadow-[0_2px_0_#0b2c48]">Adventure Log</h2>
            <p class="text-[#a9d6e5] text-base mt-2">Momen berharga dari pelayaran kami</p>
          </div>
          <div class="parchment-card p-4" v-observe>
            <GalleryInvitation :items="galleryImages" />
          </div>
        </section>

        <!-- GIFT — Treasure Chest -->
        <section id="gift" v-if="isSectionEnabled('gift')" class="max-w-xl mx-auto space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pirate text-3xl md:text-4xl text-[#f9c74f] drop-shadow-[0_2px_0_#0b2c48]">Treasure Chest</h2>
            <p class="text-[#a9d6e5] text-base mt-2">Kirimkan harta karun sebagai bekal pelayaran kami</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(bank, index) in data.bankAccounts" :key="index" class="parchment-card p-6" v-observe>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">💰</span>
                <span class="font-wanted text-[10px] text-[#7a4a1e] uppercase tracking-widest">Peti {{ index + 1 }}</span>
              </div>
              <div class="font-pirate text-2xl text-[#3a2312] uppercase mb-1">{{ bank.bankName }}</div>
              <div class="text-xl text-[#b5171e] font-mono tracking-wider break-all mb-1">{{ bank.accountNumber }}</div>
              <div class="text-xs text-[#5a3a1c] uppercase font-wanted tracking-wide">a/n {{ bank.accountName }}</div>
              <button @click="copyToClipboard(bank.accountNumber)" class="pirate-btn px-4 py-2 text-xs mt-4">📋 Salin No. Rekening</button>
            </div>
          </div>

          <div v-if="data.giftDeliveryAddress" class="parchment-card p-6 text-center" v-observe>
            <h3 class="font-pirate text-xl text-[#b5171e] mb-3">Kirim Kado ke Kapal Kami</h3>
            <p class="text-[15px] text-[#3a2312] leading-relaxed italic mb-5">
              "{{ Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress }}"
            </p>
            <button @click="copyToClipboard(Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress)" class="pirate-btn px-6 py-2 text-sm">📋 Salin Alamat</button>
          </div>
        </section>

        <!-- RSVP — Den Den Mushi call -->
        <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="max-w-xl mx-auto space-y-8">
          <div class="ocean-plaque p-8" v-observe>
            <div class="text-center mb-6">
              <img :src="assets.denDen" alt="den den mushi" class="w-24 mx-auto mb-3 mix-blend-multiply animate-wiggle" />
              <h2 class="font-pirate text-3xl text-[#b5171e]">Den Den Mushi</h2>
              <p class="text-[#5a3a1c] text-base mt-1">Kabari kami apakah kau akan bergabung di dek perayaan?</p>
            </div>

            <form @submit.prevent="submitRSVP" class="space-y-5">
              <div>
                <label class="block font-wanted text-[10px] text-[#7a4a1e] mb-2 uppercase tracking-widest">Nama Nakama</label>
                <input v-model="rsvp.name" type="text" required class="pirate-input" placeholder="Masukkan namamu..." />
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block font-wanted text-[10px] text-[#7a4a1e] mb-2 uppercase tracking-widest">Jumlah Kru</label>
                <select v-model="rsvp.totalGuests" class="pirate-input">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
                </select>
              </div>

              <div>
                <label class="block font-wanted text-[10px] text-[#7a4a1e] mb-2 uppercase tracking-widest">Akan Berlayar Bersama?</label>
                <div class="grid grid-cols-2 gap-3 mt-1">
                  <label class="attend-opt" :class="rsvp.attendance === 'hadir' ? 'attend-yes' : ''">
                    <input type="radio" v-model="rsvp.attendance" value="hadir" class="sr-only" />
                    <span>⚓ Hadir</span>
                  </label>
                  <label class="attend-opt" :class="rsvp.attendance === 'tidak' ? 'attend-no' : ''">
                    <input type="radio" v-model="rsvp.attendance" value="tidak" class="sr-only" />
                    <span>🌊 Absen</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block font-wanted text-[10px] text-[#7a4a1e] mb-2 uppercase tracking-widest">Pesan / Doa</label>
                <textarea v-model="rsvp.message" rows="4" class="pirate-input resize-none" placeholder="Tulis ucapanmu..."></textarea>
              </div>

              <button type="submit" class="pirate-btn w-full py-3 text-lg font-pirate tracking-widest">⚓ Kirim Pesan</button>
            </form>
          </div>
        </section>

        <!-- GUESTBOOK — Transmissions -->
        <section class="max-w-2xl mx-auto space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-pirate text-3xl md:text-4xl text-[#f9c74f] drop-shadow-[0_2px_0_#0b2c48]">Transmissions</h2>
            <p class="text-[#a9d6e5] text-base mt-2">Pesan dari para nakama di seluruh lautan</p>
          </div>

          <div class="parchment-card p-6" v-observe>
            <div class="space-y-5 max-h-[500px] overflow-y-auto pr-3 no-scrollbar">
              <div v-for="(msg, i) in guestMessages" :key="i" class="border-b-2 border-dashed border-[#c8a86b] pb-4 last:border-0">
                <div class="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1 mb-1">
                  <div class="flex items-center gap-2">
                    <span class="font-pirate text-lg text-[#3a2312]">{{ msg.guestName }}</span>
                    <span v-if="msg.rsvpStatus === 'hadir'" class="text-[9px] bg-[#b5171e]/15 text-[#b5171e] px-2 py-0.5 border border-[#b5171e]/30 uppercase font-wanted tracking-widest">Berlayar</span>
                  </div>
                  <span class="text-[#7a4a1e] text-xs font-wanted">{{ timeAgo(msg.createdAt) }}</span>
                </div>
                <p class="text-[#5a3a1c] text-[15px] leading-relaxed italic">"{{ msg.message }}"</p>
                <div v-if="msg.totalGuests > 1" class="text-[10px] text-[#7a4a1e] mt-1 font-wanted uppercase tracking-widest">Kru: {{ msg.totalGuests }} orang</div>
              </div>

              <div v-if="guestMessages.length === 0" class="text-center py-10 text-[#7a4a1e] font-wanted uppercase tracking-widest">— Belum ada transmisi —</div>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="text-center py-16 relative" v-observe>
          <img :src="assets.sunny" alt="Thousand Sunny" class="w-40 mx-auto opacity-90 animate-sail" />
          <div class="ocean-plaque max-w-md mx-auto mt-4 px-6 py-6">
            <p class="font-pirate text-2xl text-[#b5171e] mb-2">Terima Kasih, Nakama!</p>
            <p class="text-sm text-[#5a3a1c] uppercase tracking-[0.2em] font-wanted">
              © {{ new Date().getFullYear() }} {{ data.groomName?.split(' ')[0] }} &amp; {{ data.brideName?.split(' ')[0] }}
            </p>
            <p v-if="data.show_branding" class="text-[#7a4a1e]/80 mt-2 uppercase tracking-widest text-[9px] font-wanted">Dibuat dengan ❤️ oleh satuundangan.id</p>
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

const assets = {
  sunny: '/assets/images/one-piece/thousand-sunny.png',
  parchment: '/assets/images/one-piece/parchment.jpeg',
  strawHat: '/assets/images/one-piece/straw-hat.jpeg',
  denDen: '/assets/images/one-piece/den-den-mushi.jpeg',
}

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
    title: 'Bertemu di Grand Line',
    date: 'Januari 2024',
    description: 'Takdir mempertemukan kami di tengah lautan luas, dan sejak itu kompas hati tak pernah salah arah.',
  },
  {
    title: 'Bergabung Satu Kru',
    date: 'Februari 2025',
    description: 'Kami memutuskan berlayar dalam satu kapal, menghadapi badai dan senja bersama-sama.',
  },
  {
    title: 'Menuju One Piece',
    date: 'Maret 2026',
    description: 'Kini kami siap menemukan harta karun terbesar: kehidupan bersama selamanya.',
  },
]

const galleryImages = ref([])
const guestMessages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const activeSection = ref('home')
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null
const seaCanvas = ref(null)

const navItems = computed(() => {
  const items = [
    { id: 'home', label: 'Deck', icon: 'fa-solid fa-anchor' },
    { id: 'couple', label: 'Crew', icon: 'fa-solid fa-skull-crossbones' },
    { id: 'story', label: 'Log', icon: 'fa-solid fa-book' },
    { id: 'event', label: 'Island', icon: 'fa-solid fa-map-location-dot' },
    { id: 'gallery', label: 'Album', icon: 'fa-solid fa-images' },
    { id: 'gift', label: 'Chest', icon: 'fa-solid fa-sack-dollar' },
    { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope' },
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

// Floating bubbles
class Bubble {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }
  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = this.canvas.height + Math.random() * 200
    this.size = Math.random() * 13 + 3
    this.speedY = -(Math.random() * 0.8 + 0.25)
    this.speedX = Math.random() * 0.4 - 0.2
    this.opacity = Math.random() * 0.4 + 0.15
  }
  update() {
    this.y += this.speedY
    this.x += this.speedX
    if (this.y < -20) this.reset()
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(233, 236, 245, ${this.opacity})`
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = `rgba(169, 214, 229, ${this.opacity * 0.4})`
    ctx.fill()
  }
}

let bubbles = []
let animationId = null

function initParticleEngine() {
  const canvas = seaCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()
  bubbles = Array.from({ length: 75 }, () => new Bubble(canvas))
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    bubbles.forEach((b) => {
      b.update()
      b.draw(ctx)
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
  if (!choice) return '/audio/one-piece-luffy.mp3'
  if (choice.startsWith('yt:')) return choice
  if (choice.includes('/') || choice.includes('http')) return choice
  return `/audio/${choice}`
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
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
  let intv = seconds / 2592000
  if (intv > 1) return Math.floor(intv) + ' bulan lalu'
  intv = seconds / 86400
  if (intv > 1) return Math.floor(intv) + ' hari lalu'
  intv = seconds / 3600
  if (intv > 1) return Math.floor(intv) + ' jam lalu'
  return 'Baru saja'
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim()) {
    toast.error('Isi namamu terlebih dahulu.')
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
    toast.success('Transmisi terkirim!')
    loadWishes()
  } catch {
    toast.error('Gagal mengirim RSVP.')
  }
}

async function loadWishes() {
  if (data.value.id && data.value.id !== 'live-preview' && data.value.id !== 0) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res
    } catch {
      /* ignore fetch errors, keep current messages */
    }
  } else {
    guestMessages.value = [
      {
        guestName: 'Zoro & Keluarga',
        message: 'Barakallahu lakuma! Selamat berlayar menuju harta karun terbesar kalian, One Piece kebahagiaan.',
        rsvpStatus: 'hadir',
        totalGuests: 2,
        createdAt: new Date(),
      },
      {
        guestName: 'Robin',
        message: 'Undangannya keren banget! Selamat menempuh petualangan baru, semoga langgeng sampai akhir Grand Line.',
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
        countdown.value.Hari = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0')
        countdown.value.Jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
        countdown.value.Menit = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
        countdown.value.Detik = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
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
@import url('https://fonts.googleapis.com/css2?family=Pirata+One&family=Special+Elite&family=Cinzel:wght@500;700&display=swap');

.font-pirate {
  font-family: 'Pirata One', cursive;
  letter-spacing: 0.02em;
}
.font-wanted {
  font-family: 'Special Elite', monospace;
}
.font-nautical {
  font-family: 'Cinzel', serif;
}

/* One Piece sky + sea horizon backdrop */
.op-sky {
  background: linear-gradient(
    180deg,
    #0a2740 0%,
    #0f3a5f 30%,
    #16577c 52%,
    #2685ac 68%,
    #63bcda 77%,
    #a7e0ef 81%,
    #5fb2d2 86%,
    #2c7da0 100%
  );
}

/* Warm sun glow sitting on the horizon line */
.op-horizon {
  background:
    radial-gradient(70% 30% at 50% 80%, rgba(255, 246, 214, 0.65) 0%, rgba(255, 233, 168, 0.28) 32%, rgba(255, 233, 168, 0) 62%),
    linear-gradient(180deg, transparent 78.5%, rgba(255, 255, 255, 0.55) 80%, transparent 81.5%);
}

/* WANTED poster on parchment */
.wanted-poster {
  background-image: url('/assets/images/one-piece/parchment.jpeg');
  background-size: cover;
  background-position: center;
  border: 3px solid #6b3f18;
  box-shadow: 0 0 0 2px #3a2312, 0 14px 30px rgba(0, 0, 0, 0.45);
  color: #3a2312;
}
.wanted-corner {
  position: absolute;
  color: #7a4a1e;
  font-size: 12px;
}

/* Parchment info card */
.parchment-card {
  background-image: url('/assets/images/one-piece/parchment.jpeg');
  background-size: cover;
  background-position: center;
  border: 3px solid #6b3f18;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
}

/* Weathered wood/ocean plaque */
.ocean-plaque {
  background: linear-gradient(180deg, #f4e4c1 0%, #ecd8ac 100%);
  border: 3px solid #6b3f18;
  border-radius: 4px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(122, 74, 30, 0.15);
}

.log-pose-cell {
  background: rgba(58, 35, 18, 0.08);
  border: 2px solid #6b3f18;
  border-radius: 4px;
  padding: 8px 4px;
}

.bounty-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px;
  border-top: 2px dashed #7a4a1e;
  border-bottom: 2px dashed #7a4a1e;
}

.log-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 3px solid #6b3f18;
  border-radius: 50%;
  background: rgba(181, 23, 30, 0.08);
}

/* Pirate button (wood + gold) */
.pirate-btn {
  display: inline-block;
  background: linear-gradient(180deg, #b5171e 0%, #8c1015 100%);
  color: #f9c74f;
  border: 2px solid #3a2312;
  border-radius: 4px;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
  box-shadow: 0 4px 0 0 #3a2312;
  cursor: pointer;
  transition: all 0.12s ease;
  top: 0;
  position: relative;
}
.pirate-btn:active {
  top: 4px;
  box-shadow: 0 0 0 0 #3a2312;
}

.pirate-input {
  width: 100%;
  background: #f7ecd0;
  border: 2px solid #6b3f18;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  color: #3a2312;
  font-family: 'Cinzel', serif;
  outline: none;
}
.pirate-input:focus {
  border-color: #b5171e;
}

.attend-opt {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border: 2px solid #6b3f18;
  border-radius: 4px;
  background: #f7ecd0;
  cursor: pointer;
  font-family: 'Pirata One', cursive;
  font-size: 18px;
  color: #3a2312;
  transition: all 0.2s ease;
}
.attend-yes {
  border-color: #b5171e;
  background: rgba(181, 23, 30, 0.12);
  color: #b5171e;
}
.attend-no {
  border-color: #7a4a1e;
  background: rgba(122, 74, 30, 0.12);
  color: #7a4a1e;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-sail {
  animation: sail 5s ease-in-out infinite;
}
@keyframes sail {
  0% { transform: translateY(0) rotate(-1.5deg); }
  50% { transform: translateY(-14px) rotate(1.5deg); }
  100% { transform: translateY(0) rotate(-1.5deg); }
}

.animate-float-slow {
  animation: floatSlow 4s ease-in-out infinite;
}
@keyframes floatSlow {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.animate-wiggle {
  animation: wiggle 2.5s ease-in-out infinite;
}
@keyframes wiggle {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}

.animate-pulse-soft {
  animation: pulseSoft 1.8s infinite;
}
@keyframes pulseSoft {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.poster-gate-leave-active {
  transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}
.poster-gate-leave-to {
  opacity: 0;
  transform: scale(1.08);
  filter: blur(14px);
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
