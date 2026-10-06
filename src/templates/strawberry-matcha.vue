<template>
  <div class="relative min-h-screen bg-[#FAF7F2] overflow-hidden font-sans no-scrollbar text-[#2D3E32] selection:bg-[#F3C4CD]/40 selection:text-[#3B4D3F]">

    <!-- Frosted Texture & Organic Ambient Glow -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-25 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"></div>

    <!-- Dreamy Fluid Mesh Gradient: Strawberry Rose & Matcha Cream -->
    <div class="fixed top-[-10%] left-[-15%] w-96 h-96 md:w-[32rem] md:h-[32rem] bg-[#E2EBDC] rounded-full blur-[100px] opacity-70 pointer-events-none"></div>
    <div class="fixed top-[30%] right-[-15%] w-96 h-96 md:w-[32rem] md:h-[32rem] bg-[#FCE3E7] rounded-full blur-[110px] opacity-65 pointer-events-none"></div>
    <div class="fixed bottom-[-10%] left-[10%] w-96 h-96 md:w-[32rem] md:h-[32rem] bg-[#E8EFE5] rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

    <!-- Floating Leaves & Blossom Petals (Pure CSS/SVG Animation) -->
    <div class="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <div v-for="n in 12" :key="n" class="floating-petal" :style="getPetalStyle(n)">
        <svg viewBox="0 0 24 24" fill="none" class="w-full h-full" :class="n % 2 === 0 ? 'text-[#D96B7D]' : 'text-[#7B9275]'">
          <path d="M12 2C8 6 4 11 6 16C8 21 16 21 18 16C20 11 16 6 12 2Z" fill="currentColor" fill-opacity="0.25" />
        </svg>
      </div>
    </div>

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice && !showWelcome"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#FAF7F2"
      accentColor="#7B9275"
      :autoPlay="!showWelcome"
    />

    <!-- Mobile Bottom Navigation (Floating Cafe Pill) -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-white/80 backdrop-blur-xl border border-[#DCE6D8] rounded-full shadow-[0_10px_35px_rgba(74,93,78,0.12)] w-[92%] max-w-md transition-all duration-500 flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center gap-1 px-3 py-2.5 w-full">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-1 min-w-0 flex-col items-center gap-1 transition-all duration-300 relative group py-1"
          :class="activeSection === item.id ? 'text-[#3E5142] scale-105' : 'text-[#8E9F8E] hover:text-[#3E5142]'"
        >
          <i :class="[item.icon, 'text-sm md:text-base']"></i>
          <span class="max-w-full truncate text-[8px] font-bold uppercase tracking-wider font-sans">{{ item.label }}</span>
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D96B7D] transition-all"
            :class="activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- 1. WELCOME SCREEN / COVER GATE -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE3] to-[#FAF7F2] transition-all duration-1000"
      >
        <!-- Arched Frame Border -->
        <div class="absolute inset-4 md:inset-8 border border-[#7B9275]/25 rounded-[3rem] pointer-events-none">
          <div class="absolute inset-2 border border-[#D96B7D]/20 rounded-[2.5rem]"></div>
        </div>

        <div class="relative z-10 space-y-7 md:space-y-8 max-w-md mx-auto py-6 animate-fade-in-up">
          <!-- Monogram Crest Emblem -->
          <div class="flex justify-center">
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#E0EBD9] via-[#FAF7F2] to-[#FCE0E5] p-1 shadow-md shadow-[#7B9275]/10 flex items-center justify-center border border-white">
              <div class="w-full h-full rounded-full border border-[#7B9275]/30 flex items-center justify-center text-[#3E5142] font-serif font-black text-xl md:text-2xl tracking-tighter">
                {{ getInitials }}
              </div>
            </div>
          </div>

          <!-- Wedding Subtitle & Couple Name -->
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#DCE6D8] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#7B9275]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#D96B7D]"></span>
              The Wedding Celebration
              <span class="w-1.5 h-1.5 rounded-full bg-[#D96B7D]"></span>
            </div>

            <h1 class="text-4xl md:text-6xl font-serif font-black text-[#2D3E32] leading-tight tracking-tight pt-2">
              {{ data.groomName?.split(' ')[0] || data.groomName || 'Romeo' }}
              <span class="block text-2xl md:text-3xl font-serif italic font-normal text-[#D96B7D] my-1">&amp;</span>
              {{ data.brideName?.split(' ')[0] || data.brideName || 'Juliet' }}
            </h1>
          </div>

          <!-- Personalized Guest Card -->
          <div class="my-6 p-5 md:p-6 border border-[#DCE6D8] bg-white/85 backdrop-blur-md rounded-3xl shadow-sm space-y-2">
            <p class="text-[9px] uppercase tracking-[0.25em] text-[#7B9275] font-bold">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p class="text-xl md:text-2xl font-serif font-black text-[#2D3E32] tracking-wide">
              {{ data.guestName || 'Tamu Undangan Terhormat' }}
            </p>
            <p class="text-[10px] text-[#6E8070] italic">
              Merupakan suatu kehormatan atas kehadiran Anda di hari bahagia kami
            </p>
          </div>

          <!-- Open Invitation Button -->
          <button
            @click="openInvitation"
            class="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#3E5142] to-[#4F6753] hover:from-[#2D3E32] hover:to-[#3E5142] text-white font-black text-xs uppercase tracking-[0.25em] shadow-lg shadow-[#3E5142]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <i class="fa-solid fa-envelope-open text-xs text-[#FCE0E5]"></i>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- 2. MAIN SCROLLABLE CONTENT -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth"
    >
      <!-- HERO BANNER -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative py-20">
        <div class="max-w-2xl mx-auto space-y-6 relative z-10" v-observe>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#DCE6D8] text-[10px] font-black uppercase tracking-[0.35em] text-[#7B9275]">
            Save The Date
          </div>

          <h1 class="text-5xl md:text-7xl font-serif font-black text-[#2D3E32] leading-none tracking-tight">
            {{ data.groomName || 'Romeo' }}
            <span class="block text-3xl md:text-4xl font-serif italic font-normal text-[#D96B7D] my-2">&amp;</span>
            {{ data.brideName || 'Juliet' }}
          </h1>

          <p class="font-serif italic text-base md:text-lg text-[#5A6F5E] tracking-wider">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
          </p>

          <!-- Countdown Component -->
          <div class="flex justify-center gap-3 md:gap-5 pt-6">
            <div
              v-for="(val, label) in countdown"
              :key="label"
              class="flex flex-col items-center justify-center w-16 h-18 md:w-20 md:h-22 bg-white/90 backdrop-blur-md rounded-2xl border border-[#DCE6D8] shadow-sm"
            >
              <div class="text-xl md:text-2xl font-serif font-black text-[#2D3E32]">{{ val }}</div>
              <div class="text-[9px] uppercase tracking-widest text-[#7B9275] font-bold mt-0.5">{{ label }}</div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-8 animate-bounce text-[#7B9275]/60">
          <i class="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </section>

      <!-- QUOTE SECTION -->
      <section v-if="isSectionEnabled('quote')" class="py-20 px-6 bg-white/50 backdrop-blur-xs relative" v-observe>
        <div class="max-w-xl mx-auto text-center space-y-5">
          <div class="w-10 h-0.5 bg-[#D96B7D]/60 mx-auto rounded-full"></div>
          <p class="font-serif italic text-base md:text-lg text-[#3E5142] leading-relaxed px-4">
            "{{ data.quoteText || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.' }}"
          </p>
          <p class="text-xs font-black text-[#7B9275] tracking-[0.25em] uppercase">
            {{ data.quoteSource || 'Ar-Rum: 21' }}
          </p>
          <div class="w-10 h-0.5 bg-[#7B9275]/40 mx-auto rounded-full"></div>
        </div>
      </section>

      <!-- COUPLE SECTION -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-24 px-6 relative" v-observe>
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#D96B7D]">Mempelai Bahagia</span>
            <h2 class="text-3xl md:text-5xl font-serif font-black text-[#2D3E32]">Dua Insan Satu Cinta</h2>
            <p class="text-xs text-[#6E8070] max-w-md mx-auto">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <!-- Mempelai Pria -->
            <div class="flex flex-col items-center text-center space-y-4 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#DCE6D8] shadow-sm">
              <div class="relative w-40 h-52 md:w-48 md:h-60 rounded-[3rem] overflow-hidden border-4 border-white shadow-md">
                <img
                  :src="data.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'"
                  alt="Mempelai Pria"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 class="text-2xl font-serif font-black text-[#2D3E32]">{{ data.groomName || 'Romeo Monty' }}</h3>
                <p class="text-xs text-[#D96B7D] font-bold mt-0.5">Mempelai Pria</p>
              </div>
              <p class="text-xs text-[#5A6F5E] max-w-xs leading-relaxed">
                Putra dari {{ data.parents?.groomParents || 'Bapak Monty & Ibu Monty' }}
              </p>
              <div v-if="data.groomInstagram" class="pt-2">
                <a
                  :href="`https://instagram.com/${data.groomInstagram.replace('@', '')}`"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DCE6D8] text-[10px] font-bold text-[#7B9275] hover:text-[#3E5142]"
                >
                  <i class="fa-brands fa-instagram text-xs"></i>
                  <span>@{{ data.groomInstagram.replace('@', '') }}</span>
                </a>
              </div>
            </div>

            <!-- Mempelai Wanita -->
            <div class="flex flex-col items-center text-center space-y-4 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#DCE6D8] shadow-sm">
              <div class="relative w-40 h-52 md:w-48 md:h-60 rounded-[3rem] overflow-hidden border-4 border-white shadow-md">
                <img
                  :src="data.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'"
                  alt="Mempelai Wanita"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 class="text-2xl font-serif font-black text-[#2D3E32]">{{ data.brideName || 'Juliet Capulet' }}</h3>
                <p class="text-xs text-[#D96B7D] font-bold mt-0.5">Mempelai Wanita</p>
              </div>
              <p class="text-xs text-[#5A6F5E] max-w-xs leading-relaxed">
                Putri dari {{ data.parents?.brideParents || 'Bapak Capulet & Ibu Capulet' }}
              </p>
              <div v-if="data.brideInstagram" class="pt-2">
                <a
                  :href="`https://instagram.com/${data.brideInstagram.replace('@', '')}`"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DCE6D8] text-[10px] font-bold text-[#7B9275] hover:text-[#3E5142]"
                >
                  <i class="fa-brands fa-instagram text-xs"></i>
                  <span>@{{ data.brideInstagram.replace('@', '') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENT SECTION -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-24 px-6 bg-gradient-to-b from-white/40 via-white/80 to-white/40" v-observe>
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#7B9275]">Jadwal & Lokasi</span>
            <h2 class="text-3xl md:text-5xl font-serif font-black text-[#2D3E32]">Rangkaian Acara</h2>
            <p class="text-xs text-[#6E8070]">Insya Allah akan diselenggarakan pada:</p>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <!-- Akad Nikah -->
            <div class="bg-white p-8 rounded-3xl border border-[#DCE6D8] shadow-sm flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-[#E2EBDC] text-[#3E5142] flex items-center justify-center text-lg font-black">
                  <i class="fa-solid fa-heart"></i>
                </div>
                <h3 class="text-2xl font-serif font-black text-[#2D3E32]">Akad Nikah</h3>
                <div class="space-y-2 text-xs text-[#5A6F5E]">
                  <p class="font-bold text-sm text-[#2D3E32]">
                    <i class="fa-regular fa-calendar text-[#D96B7D] mr-2"></i>
                    {{ formatDate(data.akadLocation?.dateTime) }}
                  </p>
                  <p>
                    <i class="fa-regular fa-clock text-[#7B9275] mr-2"></i>
                    {{ formatTime(data.akadLocation?.dateTime) }} - Selesai
                  </p>
                  <p class="leading-relaxed pt-1">
                    <i class="fa-solid fa-location-dot text-[#7B9275] mr-2"></i>
                    {{ data.akadLocation?.description || 'Masjid Agung Al-Barkah, Bandung' }}
                  </p>
                </div>
              </div>

              <div class="pt-4 flex flex-wrap gap-2">
                <a
                  v-if="data.akadLocation?.mapsUrl"
                  :href="data.akadLocation.mapsUrl"
                  target="_blank"
                  class="flex-1 text-center py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#E2EBDC] border border-[#DCE6D8] text-xs font-bold text-[#3E5142] transition-colors"
                >
                  <i class="fa-solid fa-map-location-dot mr-1.5 text-[#7B9275]"></i> Buka Google Maps
                </a>
              </div>
            </div>

            <!-- Resepsi Pernikahan -->
            <div class="bg-white p-8 rounded-3xl border border-[#DCE6D8] shadow-sm flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-[#FCE0E5] text-[#D96B7D] flex items-center justify-center text-lg font-black">
                  <i class="fa-solid fa-champagne-glasses"></i>
                </div>
                <h3 class="text-2xl font-serif font-black text-[#2D3E32]">Resepsi Pernikahan</h3>
                <div class="space-y-2 text-xs text-[#5A6F5E]">
                  <p class="font-bold text-sm text-[#2D3E32]">
                    <i class="fa-regular fa-calendar text-[#D96B7D] mr-2"></i>
                    {{ formatDate(data.resepsiLocation?.dateTime) }}
                  </p>
                  <p>
                    <i class="fa-regular fa-clock text-[#7B9275] mr-2"></i>
                    {{ formatTime(data.resepsiLocation?.dateTime) }} - Selesai
                  </p>
                  <p class="leading-relaxed pt-1">
                    <i class="fa-solid fa-location-dot text-[#7B9275] mr-2"></i>
                    {{ data.resepsiLocation?.description || 'The Glass House Garden, Bandung' }}
                  </p>
                </div>
              </div>

              <div class="pt-4 flex flex-wrap gap-2">
                <a
                  v-if="data.resepsiLocation?.mapsUrl"
                  :href="data.resepsiLocation.mapsUrl"
                  target="_blank"
                  class="flex-1 text-center py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#E2EBDC] border border-[#DCE6D8] text-xs font-bold text-[#3E5142] transition-colors"
                >
                  <i class="fa-solid fa-map-location-dot mr-1.5 text-[#7B9275]"></i> Buka Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DRESS CODE SECTION -->
      <section v-if="isSectionEnabled('dress-code')" class="py-16 px-6" v-observe>
        <div class="max-w-md mx-auto text-center space-y-5 bg-white/85 p-6 md:p-8 rounded-3xl border border-[#DCE6D8] shadow-sm">
          <span class="text-[10px] font-black uppercase tracking-[0.25em] text-[#7B9275]">Panduan Busana</span>
          <h3 class="text-xl md:text-2xl font-serif font-black text-[#2D3E32]">Dress Code Tamu</h3>
          <p class="text-xs text-[#6E8070]">
            Untuk keselarasan momen foto bersama, kami menyarankan busana dengan nuansa warna berikut:
          </p>

          <div class="flex items-center justify-center gap-3 pt-2">
            <div class="flex flex-col items-center gap-1.5">
              <span class="w-10 h-10 rounded-full bg-[#4A5D4E] shadow-sm border-2 border-white"></span>
              <span class="text-[9px] font-bold text-[#4A5D4E]">Matcha</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <span class="w-10 h-10 rounded-full bg-[#8FA382] shadow-sm border-2 border-white"></span>
              <span class="text-[9px] font-bold text-[#8FA382]">Sage</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <span class="w-10 h-10 rounded-full bg-[#FCE0E5] shadow-sm border-2 border-white"></span>
              <span class="text-[9px] font-bold text-[#D96B7D]">Blush</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <span class="w-10 h-10 rounded-full bg-[#F5EFE6] shadow-sm border-2 border-white"></span>
              <span class="text-[9px] font-bold text-[#A6937C]">Cream</span>
            </div>
          </div>
        </div>
      </section>

      <!-- LOVE STORY TIMELINE -->
      <section id="story" v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)" class="py-24 px-6 relative" v-observe>
        <div class="max-w-3xl mx-auto space-y-16">
          <div class="text-center space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#D96B7D]">Kisah Manis</span>
            <h2 class="text-3xl md:text-5xl font-serif font-black text-[#2D3E32]">Perjalanan Cinta</h2>
            <p class="text-xs text-[#6E8070]">Bagaimana secangkir matcha dan semangkuk stroberi kami berpadu</p>
          </div>

          <div class="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-[#DCE6D8]">
            <div
              v-for="(item, idx) in (data.loveStory?.length ? data.loveStory : mockStories)"
              :key="idx"
              class="relative flex flex-col md:flex-row items-start gap-6 md:gap-12"
              :class="idx % 2 === 0 ? 'md:flex-row-reverse' : ''"
            >
              <div class="w-full md:w-1/2 pl-10 md:pl-0">
                <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#DCE6D8] shadow-sm space-y-2">
                  <span class="inline-block px-2.5 py-0.5 rounded-full bg-[#E2EBDC] text-[#3E5142] text-[10px] font-bold">
                    {{ item.date || item.year || '2024' }}
                  </span>
                  <h4 class="text-lg font-serif font-black text-[#2D3E32]">{{ item.title }}</h4>
                  <p class="text-xs text-[#5A6F5E] leading-relaxed">{{ item.description }}</p>
                </div>
              </div>

              <!-- Dot -->
              <div class="absolute left-2.5 md:left-1/2 -translate-x-1/2 top-4 w-4 h-4 rounded-full bg-[#D96B7D] border-4 border-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY SECTION -->
      <section id="gallery" v-if="isSectionEnabled('gallery')" class="py-24 px-6 bg-white/40" v-observe>
        <div class="max-w-5xl mx-auto space-y-12">
          <div class="text-center space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#7B9275]">Galeri Kenangan</span>
            <h2 class="text-3xl md:text-5xl font-serif font-black text-[#2D3E32]">Momen Bahagia</h2>
          </div>

          <GalleryInvitation
            v-if="data.galleryImages?.length"
            :images="data.galleryImages"
          />
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="i in 6"
              :key="i"
              class="aspect-square rounded-2xl overflow-hidden border border-[#DCE6D8] bg-slate-100"
            >
              <img
                :src="`https://picsum.photos/600/600?random=${i + 20}`"
                alt="Preview Photo"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- VIDEO SECTION -->
      <section v-if="isSectionEnabled('video') && (data.videoUrl || isPreviewMode)" class="py-20 px-6" v-observe>
        <div class="max-w-3xl mx-auto space-y-8 text-center">
          <div class="space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#D96B7D]">Video Prewedding</span>
            <h2 class="text-3xl font-serif font-black text-[#2D3E32]">Klip Momen Bahagia</h2>
          </div>

          <div class="aspect-video w-full rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-black">
            <iframe
              v-if="data.videoUrl"
              :src="getEmbedUrlVideo(data.videoUrl)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="w-full h-full flex items-center justify-center text-white/50 text-xs">
              Preview Video Prewedding
            </div>
          </div>
        </div>
      </section>

      <!-- DIGITAL GIFT SECTION -->
      <section id="gift" v-if="isSectionEnabled('gift')" class="py-24 px-6 bg-gradient-to-b from-white/30 to-white/70" v-observe>
        <div class="max-w-xl mx-auto space-y-12 text-center">
          <div class="space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#7B9275]">Tanda Kasih</span>
            <h2 class="text-3xl md:text-5xl font-serif font-black text-[#2D3E32]">Amplop Digital</h2>
            <p class="text-xs text-[#6E8070] max-w-sm mx-auto">
              Doa restu Anda adalah karunia terindah bagi kami. Jika ingin memberikan tanda kasih secara cashless:
            </p>
          </div>

          <!-- Bank Accounts -->
          <div class="space-y-4">
            <div
              v-for="(bank, idx) in (data.bankAccounts || defaultBanks)"
              :key="idx"
              class="bg-white p-6 rounded-3xl border border-[#DCE6D8] shadow-sm flex items-center justify-between gap-4 text-left"
            >
              <div>
                <span class="text-[10px] font-black uppercase text-[#D96B7D] tracking-wider">{{ bank.bankName }}</span>
                <p class="text-lg font-mono font-black text-[#2D3E32] mt-0.5">{{ bank.accountNumber }}</p>
                <p class="text-xs text-[#6E8070]">a.n. {{ bank.accountHolder }}</p>
              </div>

              <button
                type="button"
                @click="copyText(bank.accountNumber, 'Nomor rekening')"
                class="px-4 py-2 rounded-xl bg-[#E2EBDC] hover:bg-[#D4E3CC] text-[#3E5142] text-xs font-bold transition-colors cursor-pointer"
              >
                <i class="fa-regular fa-copy mr-1"></i> Salin
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RSVP & WISHES SECTION -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-24 px-6" v-observe>
        <div class="max-w-xl mx-auto space-y-12">
          <div class="text-center space-y-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#D96B7D]">Konfirmasi & Doa</span>
            <h2 class="text-3xl md:text-5xl font-serif font-black text-[#2D3E32]">RSVP & Ucapan</h2>
            <p class="text-xs text-[#6E8070]">Kirimkan konfirmasi kehadiran dan untaian doa restu terbaik</p>
          </div>

          <!-- RSVP Form -->
          <form @submit.prevent="submitRsvp" class="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-[#DCE6D8] shadow-sm space-y-4">
            <div>
              <label class="block text-xs font-bold text-[#3E5142] mb-1.5">Nama Lengkap</label>
              <input
                v-model="rsvpForm.guestName"
                type="text"
                required
                placeholder="Tulis nama Anda..."
                class="w-full px-4 py-2.5 rounded-xl border border-[#DCE6D8] bg-[#FAF7F2] text-xs text-[#2D3E32] focus:outline-none focus:border-[#7B9275]"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#3E5142] mb-1.5">Konfirmasi Kehadiran</label>
              <select
                v-model="rsvpForm.attendance"
                class="w-full px-4 py-2.5 rounded-xl border border-[#DCE6D8] bg-[#FAF7F2] text-xs text-[#2D3E32] focus:outline-none focus:border-[#7B9275]"
              >
                <option value="hadir">Hadir</option>
                <option value="ragu">Masih Ragu</option>
                <option value="tidak">Tidak Hadir</option>
              </select>
            </div>

            <div v-if="rsvpForm.attendance === 'hadir'">
              <label class="block text-xs font-bold text-[#3E5142] mb-1.5">Jumlah Tamu</label>
              <input
                v-model.number="rsvpForm.totalGuests"
                type="number"
                min="1"
                max="5"
                class="w-full px-4 py-2.5 rounded-xl border border-[#DCE6D8] bg-[#FAF7F2] text-xs text-[#2D3E32] focus:outline-none focus:border-[#7B9275]"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#3E5142] mb-1.5">Untaian Doa & Ucapan</label>
              <textarea
                v-model="rsvpForm.message"
                rows="3"
                required
                placeholder="Tulis ucapan selamat dan doa..."
                class="w-full px-4 py-2.5 rounded-xl border border-[#DCE6D8] bg-[#FAF7F2] text-xs text-[#2D3E32] focus:outline-none focus:border-[#7B9275]"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submittingRsvp"
              class="w-full py-3.5 rounded-full bg-[#3E5142] hover:bg-[#2D3E32] text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {{ submittingRsvp ? 'Mengirim...' : 'Kirim RSVP & Doa' }}
            </button>
          </form>

          <!-- Guest Wishes List -->
          <div v-if="isSectionEnabled('wishes')" class="space-y-4 pt-4">
            <h4 class="text-sm font-black text-[#2D3E32] flex items-center justify-between">
              <span>Ucapan Teman & Sahabat</span>
              <span class="text-xs text-[#7B9275] font-normal">({{ guestMessages.length }} ucapan)</span>
            </h4>

            <div class="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="(w, idx) in guestMessages"
                :key="idx"
                class="p-4 rounded-2xl bg-white border border-[#DCE6D8] space-y-1.5 shadow-2xs"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-[#2D3E32]">{{ w.guestName }}</span>
                  <span
                    class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
                    :class="w.rsvpStatus === 'hadir' ? 'bg-[#E2EBDC] text-[#3E5142]' : 'bg-slate-100 text-slate-500'"
                  >
                    {{ w.rsvpStatus === 'hadir' ? 'Hadir' : 'Absen' }}
                  </span>
                </div>
                <p class="text-xs text-[#5A6F5E] leading-relaxed">{{ w.message }}</p>
                <div class="text-[9px] text-[#8E9F8E] pt-1">{{ timeAgo(w.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER SECTION -->
      <footer class="py-16 px-6 text-center space-y-6 bg-white border-t border-[#DCE6D8] relative z-20">
        <div class="space-y-2">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-[#7B9275]">Sampai Berjumpa di Hari Bahagia</p>
          <h3 class="text-3xl font-serif font-black text-[#2D3E32]">
            {{ data.groomName?.split(' ')[0] || 'Romeo' }} &amp; {{ data.brideName?.split(' ')[0] || 'Juliet' }}
          </h3>
        </div>

        <div class="pt-4 flex justify-center">
          <WatermarkBadge variant="light" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage, getGuestMessagesByInvitationId } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const data = ref(props.data || {})

watch(
  () => props.data,
  (newVal) => {
    data.value = { ...newVal }
  },
  { deep: true, immediate: true }
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0 || !data.value.id)

const showWelcome = ref(true)
const activeSection = ref('home')
const submittingRsvp = ref(false)
const guestMessages = ref([])

const rsvpForm = ref({
  guestName: data.value.guestName || '',
  attendance: 'hadir',
  totalGuests: 1,
  message: ''
})

const defaultBanks = [
  { bankName: 'BCA', accountNumber: '8830192841', accountHolder: 'Romeo Monty' },
  { bankName: 'Bank Mandiri', accountNumber: '1310088921102', accountHolder: 'Juliet Capulet' }
]

const mockStories = [
  {
    year: '2022',
    title: 'Pertemuan Pertama di Tokyo Cafe',
    description: 'Berawal dari memesan minuman strawberry matcha yang sama di sebuah sudut kafe tenang.'
  },
  {
    year: '2024',
    title: 'Janji di Bawah Pohon Sakura',
    description: 'Menemukan kenyamanan satu sama lain dan memutuskan melangkah ke jenjang yang lebih serius.'
  },
  {
    year: '2026',
    title: 'Menuju Hari Bahagia',
    description: 'Mengikat janji suci disaksikan keluarga dan sahabat tercinta.'
  }
]

const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-heart', key: 'couple' },
  { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-check', key: 'event' },
  { id: 'story', label: 'Cerita', icon: 'fa-solid fa-feather', key: 'love-story' },
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

const getInitials = computed(() => {
  const g = (data.value.groomName || 'R').charAt(0).toUpperCase()
  const b = (data.value.brideName || 'J').charAt(0).toUpperCase()
  return `${g}&${b}`
})

const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-1000')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-6')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    observer.observe(el)
  }
}

function isSectionEnabled(key) {
  if (data.value.selectedSections === undefined || data.value.selectedSections === null) return true
  return data.value.selectedSections.includes(key)
}

function getPetalStyle(_n) {
  const left = Math.random() * 100
  const duration = 8 + Math.random() * 12
  const delay = Math.random() * duration
  const size = 12 + Math.random() * 16
  return {
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `-${delay}s`,
    width: `${size}px`,
    height: `${size * 1.3}px`,
    opacity: 0.2 + Math.random() * 0.4
  }
}

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    const content = document.getElementById('main-content')
    if (content) content.classList.remove('opacity-0')
    initScrollSpy()
  }, 100)
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { threshold: 0.4 })

  navItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:')) return choice
  if (choice.includes('/') || choice.includes('http')) return choice
  return '/audio/romantic_music1.mp3'
}

function getEmbedUrlVideo(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]
    const ampPos = videoId.indexOf('&')
    return `https://www.youtube.com/embed/${ampPos !== -1 ? videoId.substring(0, ampPos) : videoId}`
  }
  if (url.includes('youtu.be/')) {
    return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`
  }
  return url
}

function formatDate(dateStr) {
  if (!dateStr) return 'Sabtu, 24 Oktober 2026'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function formatTime(dateStr) {
  if (!dateStr) return '09:00 WIB'
  try {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB'
  } catch {
    return '09:00 WIB'
  }
}

function copyText(text, label) {
  navigator.clipboard.writeText(text)
  toast.success(`${label} berhasil disalin!`)
}

function timeAgo(date) {
  if (!date) return 'Baru saja'
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'Baru saja'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

async function submitRsvp() {
  if (!rsvpForm.value.guestName || !rsvpForm.value.message) {
    toast.warning('Silakan isi nama dan doa restu Anda.')
    return
  }

  submittingRsvp.value = true
  try {
    const payload = {
      guestName: rsvpForm.value.guestName,
      message: rsvpForm.value.message,
      rsvpStatus: rsvpForm.value.attendance,
      totalGuests: rsvpForm.value.attendance === 'hadir' ? rsvpForm.value.totalGuests : 0
    }

    if (data.value.id && data.value.id !== 'live-preview' && data.value.id !== 0) {
      await createGuestMessage(data.value.id, payload)
    }

    guestMessages.value.unshift({
      ...payload,
      createdAt: new Date()
    })

    toast.success('Terima kasih atas konfirmasi dan doanya! ✨')
    rsvpForm.value.message = ''
  } catch (err) {
    toast.error('Gagal mengirim ucapan, coba lagi nanti.')
  } finally {
    submittingRsvp.value = false
  }
}

async function loadWishes() {
  if (data.value.id && data.value.id !== 'live-preview' && data.value.id !== 0) {
    try {
      const res = await getGuestMessagesByInvitationId(data.value.id)
      guestMessages.value = res.data || res || []
    } catch (err) {}
  } else {
    guestMessages.value = [
      { guestName: 'Fauzan & Nadia', message: 'Selamat menikah! Suka banget tema strawberry matcha nya estetik parah 🍵🍓', rsvpStatus: 'hadir', createdAt: new Date() },
      { guestName: 'Rian Pratama', message: 'Semoga langgeng sampai kakek nenek, sakinah mawaddah warahmah!', rsvpStatus: 'hadir', createdAt: new Date() }
    ]
  }
}

function updateCountdown() {
  const targetDate = data.value.resepsiLocation?.dateTime || data.value.akadLocation?.dateTime || '2026-10-24T09:00:00'
  const diff = new Date(targetDate) - new Date()
  if (diff <= 0) {
    countdown.value = { Hari: '00', Jam: '00', Menit: '00', Detik: '00' }
    return
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  countdown.value = {
    Hari: String(days).padStart(2, '0'),
    Jam: String(hours).padStart(2, '0'),
    Menit: String(minutes).padStart(2, '0'),
    Detik: String(seconds).padStart(2, '0')
  }
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
  loadWishes()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
@keyframes floatUp {
  0% {
    transform: translateY(105vh) rotate(0deg);
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
  }
}

.floating-petal {
  position: absolute;
  top: 0;
  animation: floatUp linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
