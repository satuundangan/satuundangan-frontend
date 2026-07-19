<template>
  <div
    class="relative h-screen overflow-hidden font-konoha text-[#2a1c0d] selection:bg-[#ff7800] selection:text-[#2a1c0d] konoha-sky"
  >
    <!-- Leaves + clouds + sunbeam canvas -->
    <canvas ref="fxCanvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-0"></canvas>

    <!-- Konoha village background layer (composited under the canvas fx) -->
    <div class="fixed inset-0 z-0 konoha-bg pointer-events-none"></div>

    <!-- Kawarimi smoke poof overlay (plays over the welcome gate on open) -->
    <canvas ref="poofCanvas" class="fixed inset-0 w-full h-full pointer-events-none z-[110]"></canvas>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && isOpened"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#ff7800"
      accentColor="#e6c58a"
      :autoPlay="isOpened"
      class="z-[60]"
    />

    <!-- Bottom Navigation (Ninja tool belt) -->
    <nav
      v-if="isOpened"
      class="fixed bottom-0 left-0 right-0 z-[80] bg-[#1f2e17]/95 border-t-4 border-[#ff7800] shadow-[0_-6px_20px_rgba(0,0,0,0.45)] animate-fade-in flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center justify-center gap-4 px-4 py-3 mx-auto min-w-max">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-1 transition-all duration-300 relative group min-w-[52px] shrink-0"
          :class="
            activeSection === item.id
              ? 'text-[#ff7800] scale-110 -translate-y-1'
              : 'text-[#e6c58a]/70 hover:text-[#e6c58a]'
          "
        >
          <i :class="[item.icon, 'text-xl md:text-2xl']"></i>
          <span class="text-[9px] font-scroll uppercase tracking-tight">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen / Mission Scroll Gate -->
    <transition name="scroll-gate">
      <div
        v-if="!isOpened"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center px-5"
      >
        <!-- warm horizon / sunbeam glow -->
        <div class="absolute inset-0 konoha-horizon pointer-events-none"></div>

        <div class="relative w-full max-w-sm scroll-card p-6 pb-8 text-center animate-float-slow">

          <p class="font-scroll text-[10px] md:text-xs tracking-[0.6em] text-[#ff7800] font-black uppercase mt-2">
            The Wedding Of
          </p>

          <h1 class="font-script text-5xl md:text-6xl text-[#2a1c0d] leading-tight my-4">
            {{ data.groomName?.split(' ')[0] || 'Naruto' }}
            <span class="block text-2xl md:text-3xl font-scroll text-[#ff7800] my-1">&amp;</span>
            {{ data.brideName?.split(' ')[0] || 'Hinata' }}
          </h1>

          <!-- Divider accent -->
          <div class="flex items-center justify-center my-3 opacity-90">
            <span class="h-[2px] w-24 bg-[#8a5a2b]"></span>
          </div>

          <p class="font-scroll text-sm md:text-base tracking-[0.25em] text-[#4a331a] uppercase mb-6">
            {{ formatDate(data.akadLocation?.dateTime || data.resepsiLocation?.dateTime) }}
          </p>

          <p class="font-scroll text-[10px] tracking-[0.35em] text-[#8a5a2b] uppercase mb-1">
            Yth. Bapak/Ibu/Saudara/i
          </p>

          <div class="bg-[#1f2e17] text-[#e6c58a] font-shinobi text-xl md:text-2xl py-2 px-3 mb-6 truncate tracking-wide">
            {{ data.guestName || 'Tamu Undangan' }}
          </div>

          <button
            @click="openInvitation($event)"
            class="shinobi-btn w-full py-3 text-lg font-shinobi tracking-widest animate-pulse-soft"
          >
            BUKA UNDANGAN
          </button>

        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div
      v-if="isOpened"
      id="main-content"
      class="opacity-0 transition-opacity duration-1000 h-full overflow-y-auto no-scrollbar scroll-smooth"
    >
      <!-- Warm horizon glow (fixed scene) -->
      <div class="fixed inset-0 z-0 konoha-horizon pointer-events-none"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16 pb-36">
        <!-- HERO -->
        <header id="home" class="text-center pt-6">
          <div v-observe class="relative">
            <p class="font-scroll text-[11px] tracking-[0.4em] text-[#ff7800] uppercase mb-4">
              {{ data.heroLabel || 'The Wedding Of' }}
            </p>

            <div class="leaf-plaque mt-2 px-6 py-6 max-w-xl mx-auto">
              <h2 class="font-scroll text-[10px] tracking-[0.35em] text-[#8a5a2b] uppercase mb-2">
                Dengan penuh syukur, kami akan menikah
              </h2>
              <h1 class="font-shinobi text-4xl md:text-6xl text-[#2a1c0d] leading-tight my-3">
                {{ data.groomName?.split(' ')[0] || 'Naruto' }}
                <span class="text-[#ff7800]">&amp;</span>
                {{ data.brideName?.split(' ')[0] || 'Hinata' }}
              </h1>
              <div class="flex items-center justify-center gap-3 my-4">
                <span class="h-[2px] flex-1 max-w-[80px] bg-[#8a5a2b]"></span>
                <span class="font-scroll text-sm text-[#4a331a] tracking-widest">
                  {{ formatDate(data.akadLocation?.dateTime || data.resepsiLocation?.dateTime) }}
                </span>
                <span class="h-[2px] flex-1 max-w-[80px] bg-[#8a5a2b]"></span>
              </div>
            </div>
          </div>
        </header>

        <!-- COUNTDOWN -->
        <section class="text-center" v-observe>
          <div class="leaf-plaque max-w-xl mx-auto px-6 py-6">
            <h3 class="font-scroll text-[10px] text-[#8a5a2b] mb-4 tracking-[0.3em] uppercase">
              Hitung Mundur Pernikahan
            </h3>
            <div class="grid grid-cols-4 gap-2 text-center">
              <div v-for="(unit, key) in countdown" :key="key" class="scroll-cell">
                <div class="font-shinobi text-3xl md:text-4xl text-[#2a1c0d]">{{ unit }}</div>
                <div class="text-[9px] text-[#8a5a2b] uppercase font-scroll tracking-widest">{{ key }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- QUOTE -->
        <section v-if="isSectionEnabled('quote')" class="text-center px-2" v-observe>
          <div class="scroll-card max-w-2xl mx-auto p-8">
            <div class="font-shinobi text-5xl text-[#ff7800] leading-none mb-2">"</div>
            <p class="text-lg md:text-xl leading-relaxed italic text-[#2a1c0d]">
              {{
                data.quoteText ||
                'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.'
              }}
            </p>
            <div class="w-16 h-1 bg-[#ff7800] mx-auto my-5"></div>
            <p class="font-scroll text-xs text-[#8a5a2b] tracking-[0.3em] uppercase">
              {{ data.quoteSource || 'QS. Ar-Rum: 21' }}
            </p>
          </div>
        </section>

        <!-- COUPLE — Shinobi Profile Cards -->
        <section id="couple" v-if="isSectionEnabled('couple')" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-shinobi text-3xl md:text-4xl text-[#e6c58a] drop-shadow-[0_2px_0_#1f2e17]">
              Kedua Mempelai
            </h2>
            <p class="text-[#c9dfc1] text-base mt-2">Dengan penuh kebahagiaan, kami memperkenalkan kedua mempelai</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Groom card -->
            <div class="ninja-card p-5 pb-6 text-center" v-observe>
              <h3 class="font-shinobi text-2xl text-[#2a1c0d] tracking-widest mb-3">Mempelai Pria</h3>
              <div class="mx-auto mb-4 w-40 h-44 border-4 border-[#3f7d3a] bg-[#efe6cd] overflow-hidden flex items-center justify-center">
                <img
                  v-if="data.groomPhotoUrl"
                  :src="data.groomPhotoUrl"
                  class="w-full h-full object-cover sepia-[.1]"
                />
                <span v-else class="text-6xl">👤</span>
              </div>
              <h3 class="font-shinobi text-2xl text-[#ff7800] mb-1">{{ data.groomName || 'Naruto Uzumaki' }}</h3>
              <p class="text-sm text-[#4a331a] mb-4">
                Putra dari {{ data.parents?.groomParents || 'Bapak Minato & Ibu Kushina' }}
              </p>
              <div v-if="data.socialMediaGroom?.instagram" class="mt-4">
                <a
                  :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                  target="_blank"
                  class="shinobi-btn inline-flex items-center gap-2 px-5 py-2 text-sm"
                >
                  <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaGroom.instagram.replace('@', '') }}
                </a>
              </div>
            </div>

            <!-- Bride card -->
            <div class="ninja-card p-5 pb-6 text-center" v-observe>
              <h3 class="font-shinobi text-2xl text-[#2a1c0d] tracking-widest mb-3">Mempelai Wanita</h3>
              <div class="mx-auto mb-4 w-40 h-44 border-4 border-[#3f7d3a] bg-[#efe6cd] overflow-hidden flex items-center justify-center">
                <img
                  v-if="data.bridePhotoUrl"
                  :src="data.bridePhotoUrl"
                  class="w-full h-full object-cover sepia-[.1]"
                />
                <span v-else class="text-6xl">🌸</span>
              </div>
              <h3 class="font-shinobi text-2xl text-[#ff7800] mb-1">{{ data.brideName || 'Hinata Hyuga' }}</h3>
              <p class="text-sm text-[#4a331a] mb-4">
                Putri dari {{ data.parents?.brideParents || 'Bapak Hiashi & Ibu Hyuga' }}
              </p>
              <div v-if="data.socialMediaBrides?.instagram" class="mt-4">
                <a
                  :href="formatInstagramUrl(data.socialMediaBrides.instagram)"
                  target="_blank"
                  class="shinobi-btn inline-flex items-center gap-2 px-5 py-2 text-sm"
                >
                  <i class="fa-brands fa-instagram"></i> @{{ data.socialMediaBrides.instagram.replace('@', '') }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- LOVE STORY — Scroll of Memories -->
        <section
          id="story"
          v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)"
          class="space-y-8"
        >
          <div class="text-center" v-observe>
            <h2 class="font-shinobi text-3xl md:text-4xl text-[#e6c58a] drop-shadow-[0_2px_0_#1f2e17]">
              Kisah Cinta Kami
            </h2>
            <p class="text-[#c9dfc1] text-base mt-2">Perjalanan kisah kami hingga hari bahagia ini</p>
          </div>

          <div class="space-y-6 max-w-2xl mx-auto">
            <div
              v-for="(story, idx) in data.loveStory?.length ? data.loveStory : mockStories"
              :key="idx"
              class="scroll-card p-6 flex flex-col md:flex-row items-center gap-5"
              v-observe
            >
              <div class="scroll-badge shrink-0">
                <span class="font-scroll text-[9px] uppercase tracking-widest text-[#8a5a2b]">Kisah</span>
                <span class="font-shinobi text-2xl text-[#ff7800]">{{ idx + 1 }}</span>
              </div>
              <div class="flex-1 text-center md:text-left">
                <h4 class="font-shinobi text-2xl text-[#2a1c0d] mb-1">{{ story.title }}</h4>
                <span class="font-scroll text-[10px] text-[#8a5a2b] block mb-2 uppercase tracking-widest">{{
                  story.date
                }}</span>
                <p class="text-[15px] text-[#4a331a] leading-relaxed">{{ story.description }}</p>
              </div>
              <div v-if="story.image" class="w-28 h-28 border-4 border-[#3f7d3a] shrink-0 overflow-hidden hidden md:block">
                <img :src="story.image" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <!-- EVENT — Meeting Points -->
        <section id="event" v-if="isSectionEnabled('event')" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-shinobi text-3xl md:text-4xl text-[#e6c58a] drop-shadow-[0_2px_0_#1f2e17]">
              Waktu &amp; Tempat
            </h2>
            <p class="text-[#c9dfc1] text-base mt-2">Merupakan suatu kehormatan bagi kami atas kehadiran Anda</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Akad -->
            <div class="scroll-card p-6" v-observe>
              <div class="flex items-center gap-3 mb-5">
                <div>
                  <h3 class="font-shinobi text-2xl text-[#ff7800]">Akad Nikah</h3>
                </div>
              </div>
              <ul class="space-y-3 text-[15px] text-[#2a1c0d] mb-6">
                <li class="flex items-start gap-3">
                  <span>📅</span><strong>{{ formatDate(data.akadLocation?.dateTime) }}</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span>⏰</span><strong>{{ formatTime(data.akadLocation?.dateTime) }} WIB</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span>📍</span><span class="leading-snug">{{ data.akadLocation?.description }}</span>
                </li>
              </ul>
              <a
                :href="data.akadLocation?.mapUrl"
                target="_blank"
                class="shinobi-btn block text-center py-2.5 text-base"
                >Buka Peta Lokasi</a
              >
            </div>

            <!-- Resepsi -->
            <div class="scroll-card p-6" v-observe>
              <div class="flex items-center gap-3 mb-5">
                <div>
                  <h3 class="font-shinobi text-2xl text-[#ff7800]">Resepsi</h3>
                </div>
              </div>
              <ul class="space-y-3 text-[15px] text-[#2a1c0d] mb-6">
                <li class="flex items-start gap-3">
                  <span>📅</span><strong>{{ formatDate(data.resepsiLocation?.dateTime) }}</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span>⏰</span><strong>{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</strong>
                </li>
                <li class="flex items-start gap-3">
                  <span>📍</span><span class="leading-snug">{{ data.resepsiLocation?.description }}</span>
                </li>
              </ul>
              <a
                :href="data.resepsiLocation?.mapUrl"
                target="_blank"
                class="shinobi-btn block text-center py-2.5 text-base"
                >Buka Peta Lokasi</a
              >
            </div>
          </div>

          <!-- Dress code -->
          <div
            v-if="isSectionEnabled('dress-code') && data.dressCode"
            class="scroll-card p-8 text-center max-w-xl mx-auto"
            v-observe
          >
            <h4 class="font-shinobi text-2xl text-[#ff7800] mb-2">Dress Code</h4>
            <p class="text-xl text-[#2a1c0d] font-semibold">"{{ data.dressCode }}"</p>
          </div>
        </section>

        <!-- GALLERY -->
        <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-shinobi text-3xl md:text-4xl text-[#e6c58a] drop-shadow-[0_2px_0_#1f2e17]">Galeri Foto</h2>
            <p class="text-[#c9dfc1] text-base mt-2">Momen berharga perjalanan kami</p>
          </div>
          <div class="scroll-card p-4" v-observe>
            <GalleryInvitation :items="galleryImages" />
          </div>
        </section>

        <!-- GIFT — Ninja Gift Scroll -->
        <section id="gift" v-if="isSectionEnabled('gift')" class="max-w-xl mx-auto space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-shinobi text-3xl md:text-4xl text-[#e6c58a] drop-shadow-[0_2px_0_#1f2e17]">
              Tanda Kasih
            </h2>
            <p class="text-[#c9dfc1] text-base mt-2">Doa restu Anda merupakan hadiah terindah bagi kami</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(bank, index) in data.bankAccounts" :key="index" class="scroll-card p-6" v-observe>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-scroll text-[10px] text-[#8a5a2b] uppercase tracking-widest"
                  >Rekening {{ index + 1 }}</span
                >
              </div>
              <div class="font-shinobi text-2xl text-[#2a1c0d] uppercase mb-1">{{ bank.bankName }}</div>
              <div class="text-xl text-[#ff7800] font-mono tracking-wider break-all mb-1">
                {{ bank.accountNumber }}
              </div>
              <div class="text-xs text-[#4a331a] uppercase font-scroll tracking-wide">a/n {{ bank.accountName }}</div>
              <button @click="copyToClipboard(bank.accountNumber)" class="shinobi-btn px-4 py-2 text-xs mt-4">
                📋 Salin No. Rekening
              </button>
            </div>
          </div>

          <div v-if="data.giftDeliveryAddress" class="scroll-card p-6 text-center" v-observe>
            <h3 class="font-shinobi text-xl text-[#ff7800] mb-3">Kirim Hadiah ke Alamat Kami</h3>
            <p class="text-[15px] text-[#2a1c0d] leading-relaxed italic mb-5">
              "{{ Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress }}"
            </p>
            <button
              @click="
                copyToClipboard(
                  Array.isArray(data.giftDeliveryAddress) ? data.giftDeliveryAddress[0] : data.giftDeliveryAddress,
                )
              "
              class="shinobi-btn px-6 py-2 text-sm"
            >
              📋 Salin Alamat
            </button>
          </div>
        </section>

        <!-- RSVP — Hawk Messenger -->
        <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="max-w-xl mx-auto space-y-8">
          <div class="leaf-plaque p-8" v-observe>
            <div class="text-center mb-6">
              <span class="block text-5xl mx-auto mb-3 animate-wiggle select-none">💌</span>
              <h2 class="font-shinobi text-3xl text-[#ff7800]">Konfirmasi Kehadiran</h2>
              <p class="text-[#4a331a] text-base mt-1">Mohon konfirmasi kehadiran Anda pada hari bahagia kami</p>
            </div>

            <form @submit.prevent="submitRSVP" class="space-y-5">
              <div>
                <label class="block font-scroll text-[10px] text-[#8a5a2b] mb-2 uppercase tracking-widest"
                  >Nama</label
                >
                <input v-model="rsvp.name" type="text" required class="shinobi-input" placeholder="Masukkan namamu..." />
              </div>

              <div v-if="rsvp.attendance === 'hadir'">
                <label class="block font-scroll text-[10px] text-[#8a5a2b] mb-2 uppercase tracking-widest"
                  >Jumlah Tamu</label
                >
                <select v-model="rsvp.totalGuests" class="shinobi-input">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
                </select>
              </div>

              <div>
                <label class="block font-scroll text-[10px] text-[#8a5a2b] mb-2 uppercase tracking-widest"
                  >Konfirmasi Kehadiran</label
                >
                <div class="grid grid-cols-2 gap-3 mt-1">
                  <label class="attend-opt" :class="rsvp.attendance === 'hadir' ? 'attend-yes' : ''">
                    <input type="radio" v-model="rsvp.attendance" value="hadir" class="sr-only" />
                    <span>Hadir</span>
                  </label>
                  <label class="attend-opt" :class="rsvp.attendance === 'tidak' ? 'attend-no' : ''">
                    <input type="radio" v-model="rsvp.attendance" value="tidak" class="sr-only" />
                    <span>Tidak Hadir</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block font-scroll text-[10px] text-[#8a5a2b] mb-2 uppercase tracking-widest"
                  >Pesan / Doa</label
                >
                <textarea
                  v-model="rsvp.message"
                  rows="4"
                  class="shinobi-input resize-none"
                  placeholder="Tulis ucapanmu..."
                ></textarea>
              </div>

              <button type="submit" class="shinobi-btn w-full py-3 text-lg font-shinobi tracking-widest">
                Kirim
              </button>
            </form>
          </div>
        </section>

        <!-- GUESTBOOK — Scroll of Wishes -->
        <section class="max-w-2xl mx-auto space-y-8">
          <div class="text-center" v-observe>
            <h2 class="font-shinobi text-3xl md:text-4xl text-[#e6c58a] drop-shadow-[0_2px_0_#1f2e17]">
              Ucapan &amp; Doa
            </h2>
            <p class="text-[#c9dfc1] text-base mt-2">Ucapan dan doa dari keluarga &amp; sahabat</p>
          </div>

          <div class="scroll-card p-6" v-observe>
            <div class="space-y-5 max-h-[500px] overflow-y-auto pr-3 no-scrollbar">
              <div
                v-for="(msg, i) in guestMessages"
                :key="i"
                class="border-b-2 border-dashed border-[#c9a86b] pb-4 last:border-0"
              >
                <div class="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1 mb-1">
                  <div class="flex items-center gap-2">
                    <span class="font-shinobi text-lg text-[#2a1c0d]">{{ msg.guestName }}</span>
                    <span
                      v-if="msg.rsvpStatus === 'hadir'"
                      class="text-[9px] bg-[#ff7800]/15 text-[#ff7800] px-2 py-0.5 border border-[#ff7800]/30 uppercase font-scroll tracking-widest"
                      >Hadir</span
                    >
                  </div>
                  <span class="text-[#8a5a2b] text-xs font-scroll">{{ timeAgo(msg.createdAt) }}</span>
                </div>
                <p class="text-[#4a331a] text-[15px] leading-relaxed italic">"{{ msg.message }}"</p>
                <div v-if="msg.totalGuests > 1" class="text-[10px] text-[#8a5a2b] mt-1 font-scroll uppercase tracking-widest">
                  {{ msg.totalGuests }} orang
                </div>
              </div>

              <div v-if="guestMessages.length === 0" class="text-center py-10 text-[#8a5a2b] font-scroll uppercase tracking-widest">
                — Belum ada ucapan —
              </div>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="text-center py-16 relative" v-observe>
          <span class="block text-6xl mx-auto opacity-90 animate-leaf-sway select-none">🍃</span>
          <div class="leaf-plaque max-w-md mx-auto mt-4 px-6 py-6">
            <p class="font-shinobi text-2xl text-[#ff7800] mb-2">Terima Kasih</p>
            <p class="text-sm text-[#4a331a] uppercase tracking-[0.2em] font-scroll">
              © {{ new Date().getFullYear() }} {{ data.groomName?.split(' ')[0] }} &amp; {{ data.brideName?.split(' ')[0] }}
            </p>
            <p v-if="data.show_branding" class="text-[#8a5a2b]/80 mt-2 uppercase tracking-widest text-[9px] font-scroll">
              Dibuat dengan ❤️ oleh satuundangan.id
            </p>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NarutoTemplate',
}
</script>

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
    title: 'Awal Pertemuan',
    date: 'Januari 2024',
    description: 'Takdir mempertemukan kami, dan sejak saat itu kami tahu bahwa perjalanan ini akan berjalan bersama.',
  },
  {
    title: 'Menjalin Komitmen',
    date: 'Februari 2025',
    description: 'Kami memutuskan untuk melangkah bersama, saling menguatkan dalam suka maupun duka.',
  },
  {
    title: 'Menuju Pernikahan',
    date: 'Maret 2026',
    description: 'Kini kami siap memulai babak baru: membangun keluarga bersama selamanya.',
  },
]

const galleryImages = ref([])
const guestMessages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const activeSection = ref('home')
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null
const fxCanvas = ref(null)
const poofCanvas = ref(null)

const navItems = computed(() => {
  const items = [
    { id: 'home', label: 'Beranda', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-user-group' },
    { id: 'story', label: 'Cerita', icon: 'fa-solid fa-book' },
    { id: 'event', label: 'Lokasi', icon: 'fa-solid fa-map-location-dot' },
    { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images' },
    { id: 'gift', label: 'Hadiah', icon: 'fa-solid fa-gift' },
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

// --- Canvas FX engine: falling leaves + drifting cloud layers + sunbeam glow ---
const leafImg = new Image()
leafImg.src = '/assets/images/naruto/naruto-leaves.webp'
leafImg.loaded = false
leafImg.onload = () => {
  leafImg.loaded = true
}

const cloudImg = new Image()
cloudImg.src = '/assets/images/naruto/naruto-clouds.webp'
cloudImg.loaded = false
cloudImg.onload = () => {
  cloudImg.loaded = true
}

class Leaf {
  constructor(canvas) {
    this.canvas = canvas
    this.reset(true)
  }
  reset(initial = false) {
    this.x = Math.random() * this.canvas.width
    this.y = initial ? Math.random() * this.canvas.height : -Math.random() * 100 - 20
    this.size = Math.random() * 26 + 18
    this.speedY = Math.random() * 0.9 + 0.4
    this.swayAmplitude = Math.random() * 40 + 15
    this.swaySpeed = Math.random() * 0.02 + 0.008
    this.phase = Math.random() * Math.PI * 2
    this.baseX = this.x
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.03
    this.opacity = Math.random() * 0.5 + 0.5
  }
  update() {
    this.y += this.speedY
    this.phase += this.swaySpeed
    this.x = this.baseX + Math.sin(this.phase) * this.swayAmplitude
    this.rotation += this.rotationSpeed
    if (this.y > this.canvas.height + 60) {
      this.baseX = Math.random() * this.canvas.width
      this.reset()
      this.y = -Math.random() * 80 - 20
      this.baseX = Math.random() * this.canvas.width
    }
  }
  draw(ctx) {
    if (!leafImg.loaded) return
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.drawImage(leafImg, -this.size / 2, -this.size / 2, this.size, this.size)
    ctx.restore()
  }
}

class CloudLayer {
  constructor(canvas, y, speedX, opacity, width) {
    this.canvas = canvas
    this.y = y
    this.speedX = speedX
    this.opacity = opacity
    this.width = width
    this.height = width * 0.55
    this.x = Math.random() * canvas.width
  }
  update() {
    this.x -= this.speedX
    if (this.x < -this.width) {
      this.x = this.canvas.width + Math.random() * 200
    }
  }
  draw(ctx) {
    if (!cloudImg.loaded) return
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.drawImage(cloudImg, this.x, this.y, this.width, this.height)
    ctx.drawImage(cloudImg, this.x - this.canvas.width - 200, this.y, this.width, this.height)
    ctx.restore()
  }
}

let leaves = []
let cloudLayers = []
let animationId = null
let fxResizeHandler = null

function drawSunbeam(ctx, canvas) {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const gradient = ctx.createRadialGradient(
    canvas.width * 0.72,
    canvas.height * 0.18,
    0,
    canvas.width * 0.72,
    canvas.height * 0.18,
    canvas.width * 0.7,
  )
  gradient.addColorStop(0, 'rgba(255, 210, 140, 0.55)')
  gradient.addColorStop(0.35, 'rgba(255, 170, 90, 0.28)')
  gradient.addColorStop(1, 'rgba(255, 120, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
  ctx.globalCompositeOperation = 'source-over'
}

function initParticleEngine() {
  const canvas = fxCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cloudLayers.forEach((layer) => {
      layer.canvas = canvas
    })
  }
  fxResizeHandler = resize
  window.addEventListener('resize', resize)
  resize()

  leaves = Array.from({ length: 45 }, () => new Leaf(canvas))
  cloudLayers = [
    new CloudLayer(canvas, canvas.height * 0.04, 0.12, 0.28, 480),
    new CloudLayer(canvas, canvas.height * 0.1, 0.2, 0.4, 380),
    new CloudLayer(canvas, canvas.height * 0.18, 0.3, 0.5, 320),
    new CloudLayer(canvas, canvas.height * 0.28, 0.42, 0.55, 260),
    new CloudLayer(canvas, canvas.height * 0.38, 0.5, 0.35, 300),
    new CloudLayer(canvas, canvas.height * 0.52, 0.6, 0.28, 220),
  ]

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    cloudLayers.forEach((c) => {
      c.update()
      c.draw(ctx)
    })

    drawSunbeam(ctx, canvas)

    leaves.forEach((leaf) => {
      leaf.update()
      leaf.draw(ctx)
    })

    animationId = requestAnimationFrame(animate)
  }
  animate()
}

// Kawarimi-style smoke poof, adapted for the "Buka Undangan" transition
class SmokeParticle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 60
    this.y = y + (Math.random() - 0.5) * 60
    this.vx = (Math.random() - 0.5) * 10
    this.vy = (Math.random() - 0.5) * 10
    this.radius = Math.random() * 26 + 14
    this.alpha = 1
    this.growthRate = Math.random() * 2.5 + 1.5
    this.decayRate = Math.random() * 0.02 + 0.02
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    this.radius += this.growthRate
    this.alpha -= this.decayRate
  }
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#e6c58a'
    ctx.shadowBlur = 18
    ctx.shadowColor = '#fff8e6'
    ctx.fill()
    ctx.restore()
  }
}

let poofParticles = []
let poofAnimId = null

function triggerPoof(x, y) {
  const canvas = poofCanvas.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  for (let i = 0; i < 50; i++) {
    poofParticles.push(new SmokeParticle(x, y))
  }
  if (poofAnimId) return
  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = poofParticles.length - 1; i >= 0; i--) {
      const p = poofParticles[i]
      p.update()
      p.draw(ctx)
      if (p.alpha <= 0) poofParticles.splice(i, 1)
    }
    poofAnimId = poofParticles.length > 0 ? requestAnimationFrame(loop) : null
  }
  loop()
}

async function openInvitation(event) {
  const rect = event?.currentTarget?.getBoundingClientRect?.()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
  triggerPoof(x, y)

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
  if (!choice) return '/audio/wedding-instrumental-garden.mp3'
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
    toast.success('Ucapan terkirim!')
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
        guestName: 'Budi & Sinta',
        message: 'Barakallahu lakuma! Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
        rsvpStatus: 'hadir',
        totalGuests: 2,
        createdAt: new Date(),
      },
      {
        guestName: 'Andi Pratama',
        message: 'Selamat menempuh hidup baru! Semoga langgeng sampai kakek nenek dan selalu bahagia.',
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
  if (poofAnimId) cancelAnimationFrame(poofAnimId)
  if (fxResizeHandler) window.removeEventListener('resize', fxResizeHandler)
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
@import url('https://fonts.googleapis.com/css2?family=Bungee&family=Zen+Kaku+Gothic+New:wght@500;700&family=Noto+Serif:wght@400;600&family=Great+Vibes&display=swap');

.font-shinobi {
  font-family: 'Bungee', cursive;
  letter-spacing: 0.02em;
}
.font-scroll {
  font-family: 'Zen Kaku Gothic New', sans-serif;
}
.font-konoha {
  font-family: 'Noto Serif', serif;
}
.font-script {
  font-family: 'Great Vibes', cursive;
}

/* Konoha forest + sky backdrop (fallback gradient behind the bg image) */
.konoha-sky {
  background: linear-gradient(180deg, #0f1a0a 0%, #1f2e17 30%, #2f4a24 55%, #3f7d3a 78%, #6ea85e 100%);
}

/* Village background image layer */
.konoha-bg {
  background-image: url('/assets/images/naruto/naruto-bg.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.55;
}

/* Warm sunbeam glow sitting near the upper horizon */
.konoha-horizon {
  background:
    radial-gradient(60% 35% at 72% 15%, rgba(255, 210, 140, 0.35) 0%, rgba(255, 170, 90, 0.16) 35%, rgba(255, 120, 0, 0) 65%),
    linear-gradient(180deg, transparent 78.5%, rgba(255, 255, 255, 0.18) 80%, transparent 81.5%);
}

/* Mission scroll card (paper scroll look, no external image needed) */
.scroll-card {
  background: linear-gradient(180deg, rgba(247, 236, 210, 0.7) 0%, rgba(230, 197, 138, 0.7) 100%);
  border: 3px solid #7a4a1e;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
  color: #2a1c0d;
  position: relative;
}
.scroll-corner {
  position: absolute;
  font-size: 14px;
}

/* Wood/leaf plaque */
.leaf-plaque {
  background: linear-gradient(180deg, rgba(244, 233, 204, 0.7) 0%, rgba(230, 197, 138, 0.7) 100%);
  border: 3px solid #3f7d3a;
  border-radius: 4px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(63, 125, 58, 0.12);
}

.headband-emblem {
  border-radius: 9999px;
  box-shadow: 0 0 0 4px #ff7800, inset 0 0 20px rgba(0, 0, 0, 0.5);
}

.scroll-cell {
  background: rgba(42, 28, 13, 0.08);
  border: 2px solid #7a4a1e;
  border-radius: 4px;
  padding: 8px 4px;
}

.rank-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px;
  border-top: 2px dashed #8a5a2b;
  border-bottom: 2px dashed #8a5a2b;
}

.scroll-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 3px solid #7a4a1e;
  border-radius: 50%;
  background: rgba(255, 120, 0, 0.1);
}

/* Ninja card (profile card equivalent) */
.ninja-card {
  background: linear-gradient(180deg, rgba(247, 236, 210, 0.7) 0%, rgba(239, 224, 187, 0.7) 100%);
  border: 3px solid #3f7d3a;
  box-shadow: 0 0 0 2px #2a1c0d, 0 14px 30px rgba(0, 0, 0, 0.45);
  color: #2a1c0d;
}

/* Shinobi button (orange + forest) */
.shinobi-btn {
  display: inline-block;
  background: linear-gradient(180deg, #ff7800 0%, #d15f00 100%);
  color: #1f2e17;
  border: 2px solid #2a1c0d;
  border-radius: 4px;
  font-family: 'Noto Serif', serif;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 0 0 #2a1c0d;
  cursor: pointer;
  transition: all 0.12s ease;
  top: 0;
  position: relative;
}
.shinobi-btn:active {
  top: 4px;
  box-shadow: 0 0 0 0 #2a1c0d;
}

.shinobi-input {
  width: 100%;
  background: #f7ecd2;
  border: 2px solid #7a4a1e;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  color: #2a1c0d;
  font-family: 'Noto Serif', serif;
  outline: none;
}
.shinobi-input:focus {
  border-color: #ff7800;
}

.attend-opt {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border: 2px solid #7a4a1e;
  border-radius: 4px;
  background: #f7ecd2;
  cursor: pointer;
  font-family: 'Bungee', cursive;
  font-size: 16px;
  color: #2a1c0d;
  transition: all 0.2s ease;
}
.attend-yes {
  border-color: #ff7800;
  background: rgba(255, 120, 0, 0.14);
  color: #ff7800;
}
.attend-no {
  border-color: #3f7d3a;
  background: rgba(63, 125, 58, 0.14);
  color: #3f7d3a;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-leaf-sway {
  animation: leafSway 5s ease-in-out infinite;
}
@keyframes leafSway {
  0% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-12px) rotate(3deg);
  }
  100% {
    transform: translateY(0) rotate(-3deg);
  }
}

.animate-float-slow {
  animation: floatSlow 4s ease-in-out infinite;
}
@keyframes floatSlow {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-wiggle {
  animation: wiggle 2.5s ease-in-out infinite;
}
@keyframes wiggle {
  0%,
  100% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(6deg);
  }
}

.animate-pulse-soft {
  animation: pulseSoft 1.8s infinite;
}
@keyframes pulseSoft {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

.scroll-gate-leave-active {
  transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}
.scroll-gate-leave-to {
  opacity: 0;
  transform: scale(1.08);
  filter: blur(14px);
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
