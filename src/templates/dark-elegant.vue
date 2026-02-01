<template>
  <div class="relative min-h-screen bg-black overflow-hidden font-sans no-scrollbar font-montserrat text-[#f0f0f0]">

    <!-- Music Control -->
    <div class="absolute z-50">
       <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" />
    </div>

    <!-- Bottom Navigation -->
    <nav v-if="!showWelcome"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex gap-6 shadow-2xl animate-slide-up w-max max-w-[90%] overflow-x-auto no-scrollbar">
      <a href="#home"
        class="text-white/60 hover:text-[#d6b18a] transition-colors flex flex-col items-center gap-1 min-w-[40px]">
        <i class="fa-solid fa-house text-lg"></i>
        <span class="text-[10px]">Home</span>
      </a>
      <a href="#couple"
        class="text-white/60 hover:text-[#d6b18a] transition-colors flex flex-col items-center gap-1 min-w-[40px]">
        <i class="fa-solid fa-heart text-lg"></i>
        <span class="text-[10px]">Couple</span>
      </a>
      <a href="#event"
        class="text-white/60 hover:text-[#d6b18a] transition-colors flex flex-col items-center gap-1 min-w-[40px]">
        <i class="fa-solid fa-calendar-check text-lg"></i>
        <span class="text-[10px]">Event</span>
      </a>
      <a href="#rsvp"
        class="text-white/60 hover:text-[#d6b18a] transition-colors flex flex-col items-center gap-1 min-w-[40px]">
        <i class="fa-solid fa-envelope text-lg"></i>
        <span class="text-[10px]">RSVP</span>
      </a>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade">
      <div v-if="showWelcome"
        class="absolute inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-cover bg-center transition-all duration-1000"
        :style="{ backgroundImage: `url(${backgroundUrl})` }">

        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div class="relative z-10 space-y-6 animate-fade-in-up w-full">
          <div
            class="w-16 h-16 md:w-20 md:h-20 mx-auto border border-[#d6b18a] rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4">
            🌿
          </div>

          <h1 class="text-xs md:text-sm tracking-[0.3em] uppercase text-[#d6b18a]">The Wedding Of</h1>

          <div class="space-y-2">
            <h2 class="text-5xl md:text-6xl font-alex text-[#f0f0f0] drop-shadow-lg" v-html="data.groomName"></h2>
            <span class="text-lg md:text-xl font-serif italic text-[#d6b18a]">&</span>
            <h2 class="text-5xl md:text-6xl font-alex text-[#f0f0f0] drop-shadow-lg" v-html="data.brideName"></h2>
          </div>

          <div class="flex items-center justify-center gap-4 text-xs md:text-sm text-gray-300">
            <span>{{ formatDate(data.akadLocation?.dateTime) }}</span>
            <span>•</span>
            <span>{{ data.akadLocation?.description || 'Lokasi Acara' }}</span>
          </div>

          <div class="mt-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-xs mx-auto w-full">
            <p class="text-xs text-gray-400 mb-2">Kepada Yth.</p>
            <p class="text-xl font-bold text-white mb-4">Nama Tamu</p>
            <button @click="openInvitation"
              class="w-full py-3 bg-[#d6b18a] hover:bg-[#b48c5b] text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-[#d6b18a]/20 flex items-center justify-center gap-2 text-sm">
              <i class="fa-solid fa-envelope-open"></i> Buka Undangan
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="!showWelcome" id="main-content"
      class="opacity-0 transition-opacity duration-1000 h-full overflow-y-auto no-scrollbar scroll-smooth">

      <!-- HERO -->
      <section id="home"
        class="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-fixed bg-cover bg-center"
        :style="{ backgroundImage: `url(${backgroundUrl})` }">
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black"></div>

        <div class="relative z-10 space-y-6" v-observe>
          <p class="text-xs md:text-sm tracking-[0.4em] uppercase text-[#d6b18a]">We Are Getting Married</p>
          <h1 class="text-5xl md:text-7xl font-alex leading-tight text-white drop-shadow-2xl">
            {{ data.groomName }} <br> <span class="text-4xl text-[#d6b18a]">&</span> <br> {{ data.brideName }}
          </h1>
          <p class="text-base md:text-lg text-gray-200 font-light tracking-wide">{{
            formatDate(data.akadLocation?.dateTime) }}</p>

          <!-- Countdown Box -->
          <div class="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
            <div v-for="(val, label) in countdown" :key="label"
              class="bg-black/40 backdrop-blur-md border border-[#d6b18a]/30 p-3 md:p-4 rounded-xl w-16 md:w-20 text-center">
              <div class="text-xl md:text-2xl font-bold text-white">{{ val }}</div>
              <div class="text-[8px] md:text-[10px] uppercase text-[#d6b18a]">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-24 md:bottom-10 animate-bounce text-[#d6b18a]">
          <i class="fa-solid fa-chevron-down text-2xl"></i>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-20 md:py-24 px-6 relative bg-[#1a1a1a]" v-observe>
        <div class="max-w-3xl mx-auto text-center border-y border-[#d6b18a]/20 py-12">
          <i class="fa-solid fa-quote-left text-3xl md:text-4xl text-[#d6b18a]/20 mb-6 block"></i>
          <p class="text-base md:text-xl text-gray-300 italic leading-relaxed font-light mb-6">
            "{{ data.quoteText }}"
          </p>
          <p class="text-xs md:text-sm font-bold text-[#d6b18a] tracking-widest uppercase">{{ data.quoteSource }}</p>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" class="py-20 md:py-24 px-6 bg-[#1a1a1a]">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-alex text-center text-[#d6b18a] mb-12 md:mb-16" v-observe>The Happy
            Couple</h2>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Groom -->
            <div class="relative group" v-observe>
              <div
                class="absolute inset-0 bg-[#d6b18a] rotate-3 rounded-[2rem] md:rounded-[3rem] opacity-20 group-hover:rotate-6 transition-transform duration-500">
              </div>
              <div
                class="relative bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[#d6b18a]/30 shadow-2xl">
                <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x600'"
                  class="w-full h-[400px] md:h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div
                  class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-6 md:p-8 text-center">
                  <h3 class="text-2xl md:text-3xl font-alex text-[#d6b18a]">{{ data.groomName }}</h3>
                  <p class="text-xs md:text-sm text-gray-400 mt-2">Putra dari Bpk. {{
                    getParentName(data.parents?.groomParents, 0) }} & Ibu {{ getParentName(data.parents?.groomParents,
                    1) }}</p>
                  <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                    target="_blank" class="inline-block mt-4 text-[#d6b18a] hover:text-white transition-colors">
                    <i class="fa-brands fa-instagram text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Bride -->
            <div class="relative group mt-8 md:mt-24" v-observe>
              <div
                class="absolute inset-0 bg-[#d6b18a] -rotate-3 rounded-[2rem] md:rounded-[3rem] opacity-20 group-hover:-rotate-6 transition-transform duration-500">
              </div>
              <div
                class="relative bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[#d6b18a]/30 shadow-2xl">
                <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x600'"
                  class="w-full h-[400px] md:h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div
                  class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-6 md:p-8 text-center">
                  <h3 class="text-2xl md:text-3xl font-alex text-[#d6b18a]">{{ data.brideName }}</h3>
                  <p class="text-xs md:text-sm text-gray-400 mt-2">Putri dari Bpk. {{
                    getParentName(data.parents?.brideParents, 0) }} & Ibu {{ getParentName(data.parents?.brideParents,
                    1) }}</p>
                  <a v-if="data.socialMediaBrides?.instagram"
                    :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank"
                    class="inline-block mt-4 text-[#d6b18a] hover:text-white transition-colors">
                    <i class="fa-brands fa-instagram text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS -->
      <section id="event" class="py-20 md:py-24 px-6 relative overflow-hidden">
        <!-- Parallax Background -->
        <div class="absolute inset-0 bg-fixed bg-cover bg-center opacity-20"
          :style="{ backgroundImage: `url(${backgroundUrl})` }"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-transparent to-[#1a1a1a]"></div>

        <div class="max-w-4xl mx-auto relative z-10 text-center">
          <h2 class="text-3xl md:text-4xl font-alex text-[#d6b18a] mb-4" v-observe>Save The Date</h2>
          <p class="text-sm md:text-base text-gray-300 mb-8 md:mb-12">Kami menantikan kehadiran Anda di hari bahagia
            kami.</p>

          <div class="grid gap-8">
            <!-- Akad -->
            <div
              class="bg-black/60 backdrop-blur-md border border-[#d6b18a]/20 p-6 md:p-8 rounded-3xl relative overflow-hidden group hover:border-[#d6b18a]/50 transition-all"
              v-observe>
              <div
                class="absolute -right-10 -top-10 text-8xl md:text-9xl text-[#d6b18a]/5 group-hover:rotate-12 transition-transform">
                💍</div>
              <h3 class="text-xl md:text-2xl font-serif text-white mb-2">Akad Nikah</h3>
              <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-6 text-[#d6b18a]">
                <div class="text-center">
                  <i class="fa-regular fa-calendar text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                </div>
                <div class="h-8 w-px bg-[#d6b18a]/30 hidden md:block"></div>
                <div class="text-center">
                  <i class="fa-regular fa-clock text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                </div>
              </div>
              <p class="text-gray-300 text-xs md:text-sm mb-6 max-w-md mx-auto">{{ data.akadLocation?.description }}</p>
              <a :href="data.akadLocation?.mapUrl" target="_blank"
                class="inline-flex items-center justify-center px-6 py-2.5 border border-[#d6b18a] text-[#d6b18a] rounded-lg hover:bg-[#d6b18a] hover:text-black transition-all text-xs md:text-sm uppercase tracking-wide font-medium">
                <i class="fa-solid fa-location-dot mr-2"></i> Google Maps
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents"
              class="bg-black/60 backdrop-blur-md border border-[#d6b18a]/20 p-6 md:p-8 rounded-3xl relative overflow-hidden group hover:border-[#d6b18a]/50 transition-all"
              v-observe>
              <div
                class="absolute -left-10 -top-10 text-8xl md:text-9xl text-[#d6b18a]/5 group-hover:-rotate-12 transition-transform">
                🥂</div>
              <h3 class="text-xl md:text-2xl font-serif text-white mb-2">Resepsi</h3>
              <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-6 text-[#d6b18a]">
                <div class="text-center">
                  <i class="fa-regular fa-calendar text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                </div>
                <div class="h-8 w-px bg-[#d6b18a]/30 hidden md:block"></div>
                <div class="text-center">
                  <i class="fa-regular fa-clock text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                </div>
              </div>
              <p class="text-gray-300 text-xs md:text-sm mb-6 max-w-md mx-auto">{{ data.resepsiLocation?.description }}
              </p>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank"
                class="inline-flex items-center justify-center px-6 py-2.5 border border-[#d6b18a] text-[#d6b18a] rounded-lg hover:bg-[#d6b18a] hover:text-black transition-all text-xs md:text-sm uppercase tracking-wide font-medium">
                <i class="fa-solid fa-location-dot mr-2"></i> Google Maps
              </a>
            </div>
          </div>

          <!-- Live Stream -->
          <div v-if="data.liveStreamingLink" class="mt-8" v-observe>
             <a :href="data.liveStreamingLink" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:scale-105 font-bold">
                <i class="fa-solid fa-video"></i> Tonton Live Streaming
             </a>
          </div>

          <button @click="addToCalendar"
            class="mt-12 bg-[#d6b18a] text-black px-8 py-3 rounded-full font-bold hover:bg-[#b48c5b] transition-all shadow-lg hover:scale-105 text-sm md:text-base">
            <i class="fa-regular fa-calendar-plus mr-2"></i> Simpan Tanggal
          </button>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="data.videoPrewedding" class="py-20 md:py-24 px-6 bg-[#1a1a1a]" v-observe>
         <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-alex text-[#d6b18a] mb-8">Video Prewedding</h2>
            <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#d6b18a]/20">
               <iframe :src="getEmbedUrlVideo(data.videoPrewedding)" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
            </div>
         </div>
      </section>

      <!-- LOVE STORY -->
      <section v-if="data.loveStory?.length" class="py-20 md:py-24 px-6 bg-[#1a1a1a]">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-alex text-center text-[#d6b18a] mb-12 md:mb-16" v-observe>Our Journey
          </h2>

          <div class="space-y-12">
            <div v-for="(story, index) in data.loveStory" :key="index"
              class="flex flex-col md:flex-row gap-6 md:gap-8 items-center group" v-observe>
              <div :class="['w-full md:w-1/2', index % 2 !== 0 ? 'md:order-2' : '']">
                <img v-if="story.images" :src="story.images"
                  class="w-full h-56 md:h-64 object-cover rounded-2xl shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div v-else class="w-full h-56 md:h-64 bg-white/5 rounded-2xl flex items-center justify-center">
                  <i class="fa-solid fa-heart text-4xl text-white/20"></i>
                </div>
              </div>
              <div class="w-full md:w-1/2 text-center md:text-left">
                <div class="text-[#d6b18a] font-bold text-base md:text-lg mb-2">{{ formatStoryDate(story.date) }}</div>
                <h3 class="text-xl md:text-2xl font-serif text-white mb-3">{{ story.title }}</h3>
                <p class="text-gray-400 text-sm md:text-base leading-relaxed">{{ story.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section v-if="galleryImages.length" class="py-20 md:py-24 px-4 bg-black">
        <h2 class="text-3xl md:text-4xl font-alex text-center text-[#d6b18a] mb-8 md:mb-12" v-observe>Captured Moments
        </h2>

        <!-- Use the component -->
        <GalleryInvitation :items="galleryImages" />
      </section>

      <!-- RSVP -->
      <section id="rsvp" class="py-20 md:py-24 px-6 relative bg-[#1a1a1a]">
        <div
          class="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border border-[#d6b18a]/20 rounded-3xl p-6 md:p-12 shadow-2xl"
          v-observe>
          <h2 class="text-2xl md:text-3xl font-serif text-center text-white mb-2">RSVP</h2>
          <p class="text-center text-gray-400 mb-8 text-xs md:text-sm">Mohon konfirmasi kehadiran Anda sebelum acara
            dimulai.</p>

          <form @submit.prevent="submitRSVP" class="space-y-5">
            <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d6b18a] transition-colors placeholder-white/30 text-sm md:text-base"
              required />

            <div class="grid grid-cols-3 gap-3">
              <label
                class="flex items-center justify-center px-2 md:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-pointer transition-all hover:bg-white/10 text-xs md:text-base"
                :class="{ 'border-[#d6b18a] text-[#d6b18a] bg-[#d6b18a]/10 font-bold': rsvp.attendance === 'hadir' }">
                <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Hadir
              </label>
              <label
                class="flex items-center justify-center px-2 md:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-pointer transition-all hover:bg-white/10 text-xs md:text-base"
                :class="{ 'border-[#d6b18a] text-[#d6b18a] bg-[#d6b18a]/10 font-bold': rsvp.attendance === 'tidak' }">
                <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Maaf
              </label>
              <label
                class="flex items-center justify-center px-2 md:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-pointer transition-all hover:bg-white/10 text-xs md:text-base"
                :class="{ 'border-[#d6b18a] text-[#d6b18a] bg-[#d6b18a]/10 font-bold': rsvp.attendance === 'ragu' }">
                <input type="radio" value="ragu" v-model="rsvp.attendance" class="hidden"> Ragu
              </label>
            </div>

            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuest"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d6b18a] transition-colors placeholder-white/30 text-sm md:text-base">
              <option value="" disabled class="text-black">Jumlah Tamu</option>
              <option v-for="n in 5" :key="n" :value="n" class="text-black">{{ n }} Orang</option>
            </select>

            <textarea v-model="rsvp.message" rows="3" placeholder="Ucapan & Doa"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d6b18a] transition-colors placeholder-white/30 text-sm md:text-base"></textarea>

            <button type="submit"
              class="w-full py-3.5 bg-[#d6b18a] hover:bg-[#b48c5b] text-black font-bold rounded-xl transition-all shadow-lg mt-4 text-sm md:text-base">
              Kirim Konfirmasi
            </button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length || data.eWalletLink?.length"
        class="py-20 md:py-24 px-6 bg-black text-center">
        <h2 class="text-2xl md:text-3xl font-serif text-[#d6b18a] mb-4" v-observe>Wedding Gift</h2>
        <p class="text-gray-400 mb-10 max-w-lg mx-auto text-sm md:text-base">Doa restu Anda merupakan karunia yang
          sangat berarti bagi kami.</p>

        <div class="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          <!-- Bank Cards -->
          <div v-for="(bank, idx) in data.bankAccounts" :key="'bank' + idx"
            class="bg-[#1a1a1a] border border-[#333] p-6 rounded-2xl w-full sm:w-72 hover:border-[#d6b18a]/50 transition-all"
            v-observe>
            <div
              class="h-12 flex items-center justify-center mb-4 text-[#d6b18a] font-bold text-xl uppercase tracking-wider">
              {{ bank.bankName }}
            </div>
            <p class="text-lg text-white font-mono mb-1">{{ bank.accountNumber }}</p>
            <p class="text-sm text-gray-500 mb-4">a.n {{ bank.accountName }}</p>
            <button @click="copyToClipboard(bank.accountNumber)"
              class="text-xs text-[#d6b18a] border border-[#d6b18a] px-4 py-1.5 rounded-full hover:bg-[#d6b18a] hover:text-black transition-colors">
              <i class="fa-regular fa-copy mr-1"></i> Salin
            </button>
          </div>
        </div>
      </section>

      <!-- PROTOKOL KESEHATAN -->
      <section v-if="data.healthProtocol" class="py-16 px-6 bg-[#1a1a1a] text-center border-t border-[#333]">
         <h3 class="text-xl font-serif text-white mb-8">Protokol Kesehatan</h3>
         <div class="flex justify-center gap-8 flex-wrap text-[#d6b18a]">
            <div class="flex flex-col items-center gap-2 w-24">
               <i class="fa-solid fa-mask text-3xl"></i>
               <span class="text-xs text-gray-400">Pakai Masker</span>
            </div>
            <div class="flex flex-col items-center gap-2 w-24">
               <i class="fa-solid fa-hands-bubbles text-3xl"></i>
               <span class="text-xs text-gray-400">Cuci Tangan</span>
            </div>
            <div class="flex flex-col items-center gap-2 w-24">
               <i class="fa-solid fa-people-arrows text-3xl"></i>
               <span class="text-xs text-gray-400">Jaga Jarak</span>
            </div>
         </div>
      </section>

      <!-- TURUT MENGUNDANG -->
      <section v-if="data.turutMengundang" class="py-16 px-6 bg-black text-center border-t border-[#222]">
         <h3 class="text-xl font-serif text-[#d6b18a] mb-6">Turut Mengundang</h3>
         <p class="text-gray-400 text-sm whitespace-pre-line leading-relaxed max-w-2xl mx-auto">{{ data.turutMengundang }}</p>
      </section>

      <!-- FOOTER -->
      <footer class="py-12 bg-[#0f0f0f] text-center border-t border-[#222]">
        <h2 class="font-alex text-3xl md:text-4xl text-[#d6b18a] mb-2">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p v-if="data.footerText" class="text-gray-400 text-sm mb-4 max-w-lg mx-auto px-4">{{ data.footerText }}</p>
        <p class="text-gray-500 text-xs tracking-widest uppercase">Created with SatuUndangan</p>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'

// Basic Data Init
const data = ref({})
const showWelcome = ref(true)
const galleryImages = ref([])
const rsvp = ref({ name: '', attendance: '', totalGuest: '', message: '' })
const backgroundUrl = ref('https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1920&auto=format&fit=crop')

// Countdown Logic
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null

// --- Custom Directive for Scroll Animation ---
const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-10')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    observer.observe(el)
  }
}

// --- Methods ---
function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    document.getElementById('main-content').classList.remove('opacity-0')
  }, 100)
}

function getMusicUrl(choice) {
  if (!choice) return null
  // If it's a file name, assume local/uploaded path logic, else full URL
  // For now, simple mapping or return as is if custom
  if (choice.includes('.')) return choice // assumes file path
  if (choice === 'romantic') return '/audio/romantic_music1.mp3'
  return '/audio/romantic_music1.mp3' // default
}

function getParentName(parentString, index) {
  if (!parentString) return '...'
  // Simple split assuming "Father & Mother" format
  const parts = parentString.split('&')
  return parts[index]?.trim() || (index === 0 ? parentString : '')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatStoryDate(dateStr) {
  if (!dateStr) return 'Our Memory'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function formatInstagramUrl(handle) {
  return `https://instagram.com/${handle.replace('@', '')}`
}

function getEmbedUrlVideo(url) {
   if (!url) return '';
   // Convert YouTube watch URL to embed
   if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if(ampersandPosition !== -1) {
        return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
      }
      return `https://www.youtube.com/embed/${videoId}`;
   }
   if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
   }
   return url;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  alert('Berhasil disalin!')
}

function addToCalendar() {
  const event = {
    title: `Wedding of ${data.value.groomName} & ${data.value.brideName}`,
    start: new Date(data.value.akadLocation?.dateTime || Date.now()).toISOString(),
    duration: [3, "hour"],
    description: "Kami mengundang Anda untuk hadir di pernikahan kami."
  }
  // Simple Google Calendar Link
  const start = event.start.replace(/-|:|\.\d\d\d/g, "")
  const end = new Date(new Date(event.start).getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "")
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}`
  window.open(url, '_blank')
}

function submitRSVP() {
  // Validate Name
  if (!rsvp.value.name?.trim()) {
    alert("Mohon isi nama Anda.")
    return
  }
  
  // Validate Attendance
  if (!rsvp.value.attendance) {
    alert("Mohon pilih konfirmasi kehadiran (Hadir/Maaf/Ragu).")
    return
  }

  // Validate Total Guests if 'Hadir'
  if (rsvp.value.attendance === 'hadir' && !rsvp.value.totalGuest) {
    alert("Mohon pilih jumlah tamu yang akan hadir.")
    return
  }
  
  // Validate Message
  if (!rsvp.value.message?.trim() || rsvp.value.message.trim().length < 3) {
    alert("Mohon isi ucapan & doa minimal 3 karakter.")
    return
  }

  alert(`Terima kasih ${rsvp.value.name}, konfirmasi Anda telah terkirim!`)
}

// --- Lifecycle ---
onMounted(() => {
  const stored = localStorage.getItem('finalPayload')
  if (stored) {
    data.value = JSON.parse(stored)
    if (data.value.photoCoupleUrl) backgroundUrl.value = data.value.photoCoupleUrl

    // Countdown
    if (data.value.akadLocation?.dateTime) {
      const target = new Date(data.value.akadLocation.dateTime).getTime()
      interval = setInterval(() => {
        const now = new Date().getTime()
        const diff = target - now
        if (diff <= 0) return clearInterval(interval)

        countdown.value.Hari = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0')
        countdown.value.Jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
        countdown.value.Menit = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
        countdown.value.Detik = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
      }, 1000)
    }

    // Gallery
    if (data.value.galleryImages && data.value.galleryImages.length > 0) {
      galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
    } else {
      // Placeholder if empty
      galleryImages.value = [
        { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400' },
        { src: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=400' },
        { src: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=400' },
        { src: 'https://images.unsplash.com/photo-1522673607200-1645062cd958?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1522673607200-1645062cd958?q=80&w=400' }
      ]
    }
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:wght@200;300;400;500;600&display=swap');

.font-alex {
  font-family: 'Alex Brush', cursive;
}

.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
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

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }

  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>