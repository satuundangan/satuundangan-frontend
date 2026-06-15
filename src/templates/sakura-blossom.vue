<template>
  <div
    class="relative min-h-screen bg-[#fff8fa] overflow-hidden font-sans no-scrollbar text-[#5e3a45] selection:bg-[#d6336c]/30"
  >
    <!-- Falling Sakura Petals (ambient, persistent) -->
    <canvas ref="particleCanvas" class="fixed inset-0 pointer-events-none z-0"></canvas>

    <!-- Sakura Background Overlay (after envelope opened) -->
    <transition name="fade">
      <img
        v-if="isOpened"
        src="/assets/images/sakura-bg.png"
        alt=""
        aria-hidden="true"
        class="fixed inset-0 z-[1] w-full h-full object-cover object-top pointer-events-none opacity-30 md:opacity-40"
      />
    </transition>

    <!-- Opening Burst: Falling Cherry Blossoms -->
    <img
      v-if="isOpened"
      src="/assets/images/sakura-falling-petals.png"
      alt=""
      aria-hidden="true"
      class="fixed inset-0 z-[95] w-full h-full object-cover pointer-events-none transition-opacity duration-[2500ms] ease-out"
      :class="burstActive ? 'opacity-90' : 'opacity-0'"
    />

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#fff5f7"
      accentColor="#d6336c"
    />

    <!-- Mobile Bottom Navigation -->
    <nav
      v-if="isOpened"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#4a2530]/90 backdrop-blur-md rounded-2xl shadow-xl max-w-[90%] md:hidden transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center justify-center gap-8 px-6 py-3 mx-auto min-w-max">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-1 transition-all duration-300 relative group shrink-0"
          :class="
            activeSection === item.id
              ? 'text-[#ffb6c1] scale-110'
              : 'text-white/40 hover:text-[#ffb6c1]'
          "
        >
          <i :class="[item.icon, 'text-lg']"></i>
          <span class="text-[7px] font-bold uppercase tracking-widest">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade-welcome">
      <div
        v-if="!isOpened"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#fff5f7] via-[#ffeef3] to-[#ffe0e9] transition-all duration-1000"
      >
        <div class="relative z-10 space-y-10 animate-fade-in-up max-w-md mx-auto">
          <div class="space-y-3">
            <span class="text-[10px] tracking-[0.4em] uppercase text-[#d6336c] font-bold"
              >The Wedding Of</span
            >
            <div class="flex flex-col items-center">
              <h2 class="text-5xl md:text-7xl font-shippori text-[#5e3a45]">
                {{ data.groomName }}
              </h2>
              <span class="text-2xl text-[#d6336c] my-1 font-shippori">桜</span>
              <h2 class="text-5xl md:text-7xl font-shippori text-[#5e3a45]">
                {{ data.brideName }}
              </h2>
            </div>
            <p class="text-[10px] uppercase tracking-[0.3em] text-[#b08a98] pt-2">
              {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-[10px] uppercase tracking-widest text-[#c98ba0]">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p class="text-xl font-medium text-[#5e3a45]">{{ data.guestName }}</p>
          </div>

          <button @click="openInvitation" class="group flex flex-col items-center gap-3 mx-auto">
            <img
              src="/assets/images/sakura-envelope-icon.png"
              alt="Buka Undangan"
              class="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg animate-bounce-slow group-hover:scale-110 group-active:scale-95 transition-transform"
            />
            <span class="text-[10px] uppercase tracking-[0.4em] font-bold text-[#d6336c]"
              >Buka Undangan</span
            >
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div
      v-if="isOpened"
      id="main-content"
      class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth"
    >
      <!-- HERO -->
      <section
        id="home"
        class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative"
      >
        <div class="space-y-8 max-w-2xl mx-auto" v-observe>
          <SakuraFlower class="w-10 h-10 mx-auto text-[#d6336c]" />
          <h1 class="text-5xl md:text-8xl font-shippori leading-tight text-[#5e3a45]">
            <span class="block">{{ data.groomName }}</span>
            <span class="block text-4xl md:text-6xl text-[#d6336c] font-shippori my-2">&</span>
            <span class="block">{{ data.brideName }}</span>
          </h1>
          <p class="text-sm md:text-base text-[#d6336c] font-bold tracking-[0.3em] uppercase">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="flex justify-center gap-4 md:gap-6 mt-16">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm min-w-[64px]"
            >
              <div class="text-3xl md:text-5xl font-light text-[#5e3a45]">{{ val }}</div>
              <div class="text-[8px] uppercase tracking-widest text-[#d6336c] font-bold">
                {{ label }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6 bg-white/40" v-observe>
        <div class="max-w-2xl mx-auto text-center border-l-4 border-[#ffb6c1] pl-8">
          <p class="text-xl md:text-3xl text-[#5e3a45] italic leading-snug font-shippori mb-6">
            "{{ data.quoteText }}"
          </p>
          <p class="text-xs font-bold text-[#d6336c] tracking-[0.2em] uppercase">
            — {{ data.quoteSource }}
          </p>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section
        id="story"
        v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)"
        class="py-32 px-6 bg-[#fff8fa]"
      >
        <div class="max-w-4xl mx-auto space-y-24">
          <div class="text-center space-y-4" v-observe>
            <span class="text-[10px] uppercase tracking-[0.4em] text-[#d6336c] font-bold"
              >Hanami Story</span
            >
            <h2 class="text-3xl md:text-5xl font-shippori italic text-[#5e3a45]">
              Kisah Kasih Kami
            </h2>
            <SakuraFlower class="w-8 h-8 mx-auto text-[#ffb6c1]" />
          </div>

          <div class="space-y-20">
            <div
              v-for="(story, idx) in data.loveStory?.length ? data.loveStory : mockStories"
              :key="idx"
              class="relative"
              v-observe
            >
              <div class="grid md:grid-cols-2 gap-12 items-center">
                <div :class="idx % 2 === 0 ? '' : 'md:order-last'">
                  <div class="rounded-[2rem] overflow-hidden shadow-lg aspect-square">
                    <img
                      v-if="story.image || isPreviewMode"
                      :src="story.image || 'https://via.placeholder.com/400x400'"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full bg-[#ffeef3] flex items-center justify-center">
                      <i class="fa-solid fa-heart text-[#d6336c]/20 text-4xl"></i>
                    </div>
                  </div>
                </div>
                <div
                  class="space-y-4"
                  :class="idx % 2 === 0 ? 'text-left' : 'text-left md:text-right'"
                >
                  <span class="text-[#d6336c] font-bold text-xs uppercase tracking-[0.2em]">{{
                    story.date
                  }}</span>
                  <h3 class="text-2xl md:text-3xl font-shippori italic text-[#5e3a45]">
                    {{ story.title }}
                  </h3>
                  <p class="text-[#a9788a] text-sm md:text-base leading-relaxed font-light">
                    {{ story.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center space-y-4 mb-24" v-observe>
            <span class="text-[10px] uppercase tracking-[0.4em] text-[#d6336c] font-bold"
              >Mempelai</span
            >
            <h2 class="text-3xl md:text-5xl font-shippori text-[#5e3a45]">Kedua Mempelai</h2>
          </div>

          <div class="grid md:grid-cols-2 gap-24 items-start">
            <!-- Groom -->
            <div class="space-y-8" v-observe>
              <div class="relative">
                <div
                  class="absolute -top-6 -left-6 w-32 h-32 bg-[#ffb6c1]/30 rounded-full -z-10 animate-pulse"
                ></div>
                <div
                  class="rounded-[3rem] rounded-tr-none overflow-hidden shadow-xl aspect-[4/5] bg-[#ffeef3]"
                >
                  <img
                    :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x600'"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <h3 class="text-3xl md:text-4xl font-shippori italic text-[#5e3a45]">
                  {{ data.groomName }}
                </h3>
                <p class="text-xs uppercase tracking-widest text-[#d6336c] font-bold">
                  Mempelai Pria
                </p>
                <p class="text-sm text-[#a9788a] leading-relaxed pt-2">
                  Putra dari {{ data.parents?.groomParents || 'Bpk. & Ibu' }}
                </p>
                <a
                  v-if="data.socialMediaGroom?.instagram"
                  :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                  target="_blank"
                  class="inline-block mt-4 text-[#5e3a45] hover:text-[#d6336c] transition-colors"
                >
                  <i class="fa-brands fa-instagram text-2xl"></i>
                </a>
              </div>
            </div>

            <!-- Bride -->
            <div class="space-y-8 md:mt-32" v-observe>
              <div class="relative">
                <div
                  class="absolute -bottom-6 -right-6 w-32 h-32 bg-[#d6336c]/15 rounded-full -z-10 animate-pulse"
                ></div>
                <div
                  class="rounded-[3rem] rounded-bl-none overflow-hidden shadow-xl aspect-[4/5] bg-[#ffeef3]"
                >
                  <img
                    :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x600'"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div class="space-y-2 md:text-right">
                <h3 class="text-3xl md:text-4xl font-shippori italic text-[#5e3a45]">
                  {{ data.brideName }}
                </h3>
                <p class="text-xs uppercase tracking-widest text-[#d6336c] font-bold">
                  Mempelai Wanita
                </p>
                <p class="text-sm text-[#a9788a] leading-relaxed pt-2">
                  Putri dari {{ data.parents?.brideParents || 'Bpk. & Ibu' }}
                </p>
                <a
                  v-if="data.socialMediaBrides?.instagram"
                  :href="formatInstagramUrl(data.socialMediaBrides.instagram)"
                  target="_blank"
                  class="inline-block mt-4 text-[#5e3a45] hover:text-[#d6336c] transition-colors"
                >
                  <i class="fa-brands fa-instagram text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section
        v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length"
        class="py-32 px-6 bg-white/40 text-center border-y border-[#ffb6c1]/30"
      >
        <div class="max-w-4xl mx-auto space-y-12" v-observe>
          <h3 class="text-2xl md:text-4xl font-shippori italic text-[#5e3a45]">Keluarga Besar</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(person, idx) in data.extendedFamily"
              :key="idx"
              class="p-6 bg-[#fff8fa] rounded-[2rem] text-sm text-[#5e3a45] font-medium tracking-wide"
            >
              {{ person }}
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS -->
      <section
        id="event"
        v-if="isSectionEnabled('event')"
        class="py-32 px-6 bg-[#4a2530] text-[#fbe4ec] rounded-[4rem] mx-4 md:mx-10 my-10"
      >
        <div class="max-w-4xl mx-auto text-center space-y-20">
          <div class="space-y-4">
            <h2 class="text-4xl md:text-6xl font-shippori italic" v-observe>Acara Pernikahan</h2>
            <p class="text-[#ffb6c1] text-sm tracking-[0.3em] uppercase" v-observe>Save The Date</p>
          </div>

          <div class="grid md:grid-cols-2 gap-12 text-left">
            <div
              class="p-8 border border-white/10 rounded-3xl space-y-6 hover:bg-white/5 transition-colors"
              v-observe
            >
              <h3 class="text-2xl font-shippori italic text-[#ffb6c1]">Akad Nikah</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-calendar-check text-[#ffb6c1] text-xl"></i>
                  <span>{{ formatDate(data.akadLocation?.dateTime) }}</span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-clock text-[#ffb6c1] text-xl"></i>
                  <span>{{ formatTime(data.akadLocation?.dateTime) }} WIB</span>
                </div>
                <div class="flex items-start gap-4 text-sm">
                  <i class="fa-solid fa-location-dot text-[#ffb6c1] text-xl"></i>
                  <span class="leading-relaxed">{{ data.akadLocation?.description }}</span>
                </div>
              </div>
              <a
                :href="data.akadLocation?.mapUrl"
                target="_blank"
                class="w-full py-3 bg-white/10 hover:bg-[#ffb6c1] hover:text-[#4a2530] text-white rounded-xl transition-all text-center block text-[10px] uppercase font-bold tracking-widest"
              >
                Google Maps
              </a>
            </div>

            <div
              v-if="!data.mergeEvents"
              class="p-8 border border-white/10 rounded-3xl space-y-6 hover:bg-white/5 transition-colors"
              v-observe
            >
              <h3 class="text-2xl font-shippori italic text-[#ffb6c1]">Resepsi</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-calendar-check text-[#ffb6c1] text-xl"></i>
                  <span>{{ formatDate(data.resepsiLocation?.dateTime) }}</span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-clock text-[#ffb6c1] text-xl"></i>
                  <span>{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</span>
                </div>
                <div class="flex items-start gap-4 text-sm">
                  <i class="fa-solid fa-location-dot text-[#ffb6c1] text-xl"></i>
                  <span class="leading-relaxed">{{ data.resepsiLocation?.description }}</span>
                </div>
              </div>
              <a
                :href="data.resepsiLocation?.mapUrl"
                target="_blank"
                class="w-full py-3 bg-white/10 hover:bg-[#ffb6c1] hover:text-[#4a2530] text-white rounded-xl transition-all text-center block text-[10px] uppercase font-bold tracking-widest"
              >
                Google Maps
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div
            v-if="isSectionEnabled('dress-code') && data.dressCode"
            class="mt-20 text-center space-y-6"
            v-observe
          >
            <h3 class="text-sm uppercase tracking-[0.3em] font-bold text-[#ffb6c1]">Dress Code</h3>
            <div class="p-8 border border-white/10 rounded-[3rem] inline-block px-12">
              <i class="fa-solid fa-shirt text-[#ffb6c1] text-2xl mb-4 block"></i>
              <p class="text-white text-sm font-medium">{{ data.dressCode }}</p>
            </div>
          </div>

          <!-- LIVE STREAMING -->
          <div
            v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl"
            class="mt-20 text-center"
            v-observe
          >
            <a
              :href="data.liveStreamingUrl"
              target="_blank"
              class="inline-flex items-center gap-4 px-12 py-5 bg-[#ffb6c1] text-[#4a2530] rounded-full hover:bg-white transition-all shadow-2xl hover:-translate-y-1"
            >
              <i class="fa-solid fa-video animate-pulse"></i>
              <span class="text-xs font-black uppercase tracking-[0.3em]"
                >Tonton Live Streaming</span
              >
            </a>
          </div>

          <div v-observe>
            <button
              @click="addToCalendar"
              class="px-12 py-4 bg-[#ffb6c1] text-[#4a2530] rounded-2xl font-black hover:scale-105 transition-all shadow-xl text-xs uppercase tracking-[0.2em]"
            >
              Simpan ke Kalender
            </button>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section
        id="gallery"
        v-if="isSectionEnabled('gallery') && galleryImages.length"
        class="py-32 px-4 bg-[#fff8fa]"
      >
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-col items-center mb-20 space-y-4 text-center">
            <span class="text-[10px] uppercase tracking-[0.4em] text-[#d6336c] font-bold" v-observe
              >Gallery</span
            >
            <h2 class="text-4xl md:text-6xl font-shippori italic text-[#5e3a45]" v-observe>
              Galeri Momen
            </h2>
            <SakuraFlower class="w-8 h-8 text-[#ffb6c1]" />
          </div>
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6">
        <div
          class="max-w-xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-[#ffb6c1]/30"
          v-observe
        >
          <div class="text-center mb-12">
            <h2 class="text-4xl font-shippori italic text-[#5e3a45]">RSVP</h2>
            <p class="text-[#d6336c] text-[10px] uppercase tracking-widest font-bold mt-2">
              Konfirmasi Kehadiran
            </p>
          </div>

          <form @submit.prevent="submitRSVP" class="space-y-8">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-[#c98ba0] font-bold ml-2"
                >Nama Anda</label
              >
              <input
                v-model="rsvp.name"
                type="text"
                placeholder="Nama Lengkap"
                class="w-full bg-[#fff8fa] border-0 rounded-2xl px-6 py-4 text-[#5e3a45] focus:ring-2 focus:ring-[#ffb6c1] outline-none transition-all placeholder-[#e0c3cc]"
                required
              />
            </div>

            <div class="grid grid-cols-3 gap-3">
              <label
                v-for="opt in [
                  { v: 'hadir', l: 'Hadir' },
                  { v: 'tidak', l: 'Tidak Hadir' },
                  { v: 'ragu', l: 'Ragu-ragu' },
                ]"
                :key="opt.v"
                class="flex items-center justify-center py-4 rounded-2xl cursor-pointer border-2 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                :class="
                  rsvp.attendance === opt.v
                    ? 'bg-[#4a2530] border-[#4a2530] text-white shadow-lg'
                    : 'bg-transparent border-[#fff8fa] text-[#c98ba0] hover:border-[#ffb6c1]/50'
                "
              >
                <input type="radio" :value="opt.v" v-model="rsvp.attendance" class="hidden" />
                {{ opt.l }}
              </label>
            </div>

            <select
              v-if="rsvp.attendance === 'hadir'"
              v-model="rsvp.totalGuests"
              class="w-full bg-[#fff8fa] border-0 rounded-2xl px-6 py-4 text-[#5e3a45] focus:ring-2 focus:ring-[#ffb6c1] outline-none font-bold text-xs"
            >
              <option value="" disabled>Jumlah Tamu</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
            </select>

            <textarea
              v-model="rsvp.message"
              rows="4"
              placeholder="Doa & Ucapan Anda"
              class="w-full bg-[#fff8fa] border-0 rounded-2xl px-6 py-4 text-[#5e3a45] focus:ring-2 focus:ring-[#ffb6c1] outline-none placeholder-[#e0c3cc]"
            ></textarea>

            <button
              type="submit"
              class="w-full py-5 bg-[#d6336c] text-white font-bold rounded-2xl transition-all shadow-xl hover:bg-[#4a2530] uppercase tracking-[0.2em] text-[10px]"
            >
              Kirim Konfirmasi
            </button>
          </form>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section
        v-if="data.videoPrewedding && isSectionEnabled('video')"
        class="py-32 px-6 bg-[#fff8fa]"
      >
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-shippori italic text-[#5e3a45] mb-10" v-observe>
            Video Prewedding
          </h2>
          <div
            class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#ffb6c1]/30"
          >
            <iframe
              :src="getEmbedUrlVideo(data.videoPrewedding)"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <!-- MENU -->
      <section
        v-if="data.menu?.items?.length && isSectionEnabled('menu')"
        class="py-32 px-6 bg-white/40"
      >
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-shippori italic text-[#5e3a45] mb-10" v-observe>
            {{ data.menu.title || 'Menu Hidangan' }}
          </h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="(item, idx) in data.menu.items"
              :key="idx"
              class="bg-[#fff8fa] p-6 rounded-[2rem] border border-[#ffb6c1]/30 text-left"
              v-observe
            >
              <h4 class="text-base font-medium text-[#5e3a45]">{{ item.name || item }}</h4>
            </div>
          </div>
        </div>
      </section>

      <!-- GIFT -->
      <section
        v-if="isSectionEnabled('gift') && (data.bankAccounts?.length || data.eWalletLink?.length)"
        id="gift"
        class="py-32 px-6 text-center bg-[#fff8fa]"
      >
        <h2 class="text-3xl font-shippori italic text-[#5e3a45] mb-4" v-observe>
          Hadiah Pernikahan
        </h2>
        <p class="text-[#a9788a] mb-16 max-w-md mx-auto text-sm leading-relaxed">
          Doa restu Anda adalah karunia terindah bagi kami. Namun jika ingin memberi tanda kasih,
          dapat melalui:
        </p>

        <div class="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          <div
            v-for="(bank, idx) in data.bankAccounts"
            :key="idx"
            class="bg-white p-10 rounded-[3rem] w-full sm:w-[320px] shadow-sm hover:shadow-xl transition-all border border-[#ffb6c1]/20"
            v-observe
          >
            <div
              class="h-12 flex items-center justify-center mb-8 text-[#d6336c] font-bold text-2xl tracking-widest uppercase font-shippori"
            >
              {{ bank.bankName }}
            </div>
            <p class="text-xl text-[#5e3a45] font-medium mb-2 tracking-widest">
              {{ bank.accountNumber }}
            </p>
            <p class="text-[10px] text-[#c98ba0] mb-8 uppercase tracking-[0.2em] font-bold">
              a.n {{ bank.accountName }}
            </p>
            <button
              @click="copyToClipboard(bank.accountNumber)"
              class="px-8 py-3 bg-[#fff8fa] text-[#5e3a45] rounded-full hover:bg-[#4a2530] hover:text-white transition-all font-bold uppercase text-[9px] tracking-widest"
            >
              Salin Rekening
            </button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-32 bg-white text-center rounded-t-[4rem]">
        <SakuraFlower class="w-10 h-10 mx-auto mb-6 text-[#ffb6c1]" />
        <h2 class="font-shippori italic text-5xl text-[#5e3a45] mb-4">
          {{ data.groomName }}
          <span>&</span>
          {{ data.brideName }}
        </h2>
        <p class="text-[#d6336c] text-[10px] tracking-[0.5em] uppercase font-bold mb-12">
          Sampai Jumpa di Hari Bahagia Kami
        </p>
        <p class="text-[#e0c3cc] text-[8px] tracking-[0.4em] uppercase font-bold italic">
          Created by SatuUndangan.id
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick, h } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { createGuestMessage } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
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

// Decorative inline sakura flower icon (5 petals)
const SakuraFlower = {
  render() {
    const petal = (rotate) =>
      h('path', {
        d: 'M50 50 C40 32 40 12 50 0 C60 12 60 32 50 50 Z',
        transform: `rotate(${rotate} 50 50)`,
      })
    return h(
      'svg',
      { viewBox: '0 0 100 100', fill: 'currentColor' },
      [0, 72, 144, 216, 288]
        .map(petal)
        .concat([h('circle', { cx: 50, cy: 50, r: 6, class: 'opacity-70' })]),
    )
  },
}

const mockStories = [
  {
    title: 'Pertama Bertemu',
    date: 'Januari 2024',
    description: 'Pertemuan tak terduga di bawah pohon sakura yang menjadi awal kisah kami.',
  },
  {
    title: 'Lamaran',
    date: 'Februari 2026',
    description: 'Saat bunga sakura mulai mekar, kami berjanji untuk melangkah bersama selamanya.',
  },
]

const isOpened = ref(false)
const burstActive = ref(false)
const galleryImages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const activeSection = ref('home')
const particleCanvas = ref(null)
let animationId = null

// Navigation items
const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'couple', label: 'Couple', icon: 'fa-solid fa-user-group', key: 'couple' },
  { id: 'story', label: 'Story', icon: 'fa-solid fa-feather', key: 'love-story' },
  { id: 'event', label: 'Event', icon: 'fa-solid fa-calendar-days', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'gift', label: 'Gift', icon: 'fa-solid fa-gift', key: 'gift' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope-open-text', key: 'rsvp' },
]

const navItems = computed(() => {
  return allNavItems.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'story')
      return (
        isSectionEnabled('love-story') && (data.value.loveStory?.length > 0 || isPreviewMode.value)
      )
    if (item.id === 'gallery') return isSectionEnabled('gallery') && galleryImages.value.length > 0
    return isSectionEnabled(item.key)
  })
})

function getEmbedUrlVideo(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]
    const ampPos = videoId.indexOf('&')
    return `https://www.youtube.com/embed/${ampPos !== -1 ? videoId.substring(0, ampPos) : videoId}`
  }
  if (url.includes('youtu.be')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`
  return url
}

const isSectionEnabled = (key) => {
  if (data.value.selectedSections === undefined || data.value.selectedSections === null) return true
  return data.value.selectedSections.includes(key)
}

// Countdown
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-[1.2s]', 'ease-out')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('opacity-0', 'scale-95')
            el.classList.add('opacity-100', 'scale-100')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
  },
}

function initParticleEngine() {
  const canvas = particleCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let width,
    height,
    particles = []
  const resize = () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }
  class Petal {
    constructor() {
      this.reset()
      this.y = Math.random() * height
    }
    reset() {
      this.x = Math.random() * width
      this.y = -20
      this.size = 4 + Math.random() * 8
      this.speed = 0.4 + Math.random() * 1
      this.swing = Math.random() * 1.5
      this.swingStep = Math.random() * 100
      this.opacity = 0.15 + Math.random() * 0.25
      this.flip = Math.random() * Math.PI
      this.flipSpeed = 0.01 + Math.random() * 0.02
      this.color = ['#ffb7c5', '#ffc1cc', '#f8a5c2', '#fff0f5'][Math.floor(Math.random() * 4)]
    }
    update() {
      this.y += this.speed
      this.swingStep += 0.01
      this.x += Math.sin(this.swingStep) * this.swing
      this.flip += this.flipSpeed
      if (this.y > height + 20) this.reset()
    }
    draw() {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.flip)
      ctx.scale(Math.sin(this.flip) || 0.2, 1)
      ctx.globalAlpha = this.opacity
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(this.size, -this.size / 2, this.size, this.size, 0, this.size)
      ctx.bezierCurveTo(-this.size, this.size, -this.size, -this.size / 2, 0, 0)
      ctx.fill()
      ctx.restore()
    }
  }
  const init = () => {
    resize()
    particles = Array.from({ length: 30 }, () => new Petal())
  }
  const animate = () => {
    ctx.clearRect(0, 0, width, height)
    particles.forEach((p) => {
      p.update()
      p.draw()
    })
    animationId = requestAnimationFrame(animate)
  }
  window.addEventListener('resize', resize)
  init()
  animate()
}

async function openInvitation() {
  isOpened.value = true
  burstActive.value = true
  await nextTick()
  const content = document.getElementById('main-content')
  if (content) {
    setTimeout(() => {
      content.classList.remove('opacity-0')
      content.classList.add('opacity-100')
    }, 50)
  }
  setTimeout(() => {
    burstActive.value = false
  }, 600)
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
    { threshold: 0.5 },
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
  return '/audio/wedding-romantic-aisle.mp3'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatInstagramUrl(handle) {
  if (!handle) return '#'
  return `https://instagram.com/${handle.replace('@', '')}`
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  toast.success('Berhasil disalin!')
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }

  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map((src) => ({ src, thumbnail: src }))
  }

  const targetDate =
    data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || data.value.dateTime
  if (targetDate) {
    const target = new Date(targetDate).getTime()
    if (!isNaN(target)) {
      if (interval) clearInterval(interval)
      interval = setInterval(() => {
        const now = new Date().getTime()
        const diff = target - now
        if (diff <= 0) return clearInterval(interval)
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
}

function addToCalendar() {
  const event = {
    title: `Wedding of ${data.value.groomName} & ${data.value.brideName}`,
    start: new Date(data.value.akadLocation?.dateTime || data.value.dateTime || Date.now())
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, ''),
    description: 'Please join us on our wedding day.',
  }
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.start}&details=${encodeURIComponent(event.description)}`
  window.open(url, '_blank')
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) {
    toast.error('Mohon lengkapi formulir RSVP.')
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
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
  } catch (err) {
    console.error(err)
    toast.error('Gagal mengirim RSVP.')
  }
}

onMounted(() => {
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
    if (newVal) {
      data.value = newVal
      initData()
    }
  },
  { deep: true },
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@300;400;500;600;700&display=swap');

.font-shippori {
  font-family: 'Shippori Mincho', serif;
}
.font-sans {
  font-family: 'Quicksand', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-welcome-enter-active,
.fade-welcome-leave-active {
  transition: opacity 1s ease;
}
.fade-welcome-enter-from,
.fade-welcome-leave-to {
  opacity: 0;
}

.animate-fade-in-up {
  animation: fadeInUp 1.2s ease-out forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce-slow {
  animation: bounceSlow 2.5s ease-in-out infinite;
}
@keyframes bounceSlow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
