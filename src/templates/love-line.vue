<template>
  <div class="love-line-template relative min-h-screen bg-[#F5F2EC] text-[#1B1B1B] font-montserrat overflow-x-hidden selection:bg-[#1B1B1B] selection:text-[#F5F2EC]">

    <!-- Global SVG Duotone & Line Art Filters matching our-wedding.link -->
    <svg width="0" height="0" class="absolute pointer-events-none opacity-0 select-none" aria-hidden="true">
      <filter id="owduo-love-line" color-interpolation-filters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.106 0.961" />
          <feFuncG type="table" tableValues="0.106 0.949" />
          <feFuncB type="table" tableValues="0.106 0.925" />
        </feComponentTransfer>
      </filter>
      <!-- Charcoal line filter for transparent white PNG line art to match #1B1B1B -->
      <filter id="owduo-charcoal" color-interpolation-filters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.106 0.106" />
          <feFuncG type="table" tableValues="0.106 0.106" />
          <feFuncB type="table" tableValues="0.106 0.106" />
        </feComponentTransfer>
      </filter>
      <!-- Crimson red accent filter for heart flourishes to match #C8242C -->
      <filter id="owduo-red" color-interpolation-filters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.784 0.784" />
          <feFuncG type="table" tableValues="0.141 0.141" />
          <feFuncB type="table" tableValues="0.173 0.173" />
        </feComponentTransfer>
      </filter>
    </svg>

    <!-- Music Control Component -->
    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#1B1B1B"
      accentColor="#F5F2EC"
      class="z-[65]"
    />

    <!-- Studio / Live Preview Quick Gate Toggle Bar (Visible only inside iframe) -->
    <div
      v-if="isInsideFrame"
      class="fixed top-3 left-3 z-[80] flex items-center gap-2 bg-[#1B1B1B]/90 text-[#F5F2EC] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider shadow-lg backdrop-blur-xs border border-white/20 select-none animate-fade-in"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>Studio Preview</span>
      <button
        type="button"
        @click="toggleGate"
        class="ml-1 px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded-full text-[9px] uppercase tracking-widest transition-colors cursor-pointer"
      >
        {{ showWelcome ? 'Lihat Isi' : 'Lihat Cover' }}
      </button>
    </div>

    <!-- Bottom Navigation Bar (Standard SatuUndangan Floating Nav) -->
    <nav
      v-if="!showWelcome"
      class="fixed bottom-6 inset-x-0 mx-auto z-50 bg-[#1B1B1B]/85 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl max-w-[95%] sm:max-w-md overflow-x-auto no-scrollbar scroll-smooth flex justify-center animate-slide-up"
    >
      <div class="flex items-center justify-center gap-2 sm:gap-4 px-4 py-2.5">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-0.5 min-w-[42px] transition-all duration-300 relative group shrink-0 cursor-pointer"
          :class="activeSection === item.id ? 'text-[#F5F2EC] scale-110 font-bold' : 'text-[#F5F2EC]/50 hover:text-[#F5F2EC]/80'"
        >
          <i :class="[item.icon, 'text-base sm:text-lg mb-0.5']"></i>
          <span class="text-[8px] sm:text-[9px] uppercase tracking-wider">{{ item.label }}</span>
          <!-- Active Dot Indicator -->
          <span
            class="w-1 h-1 rounded-full bg-[#C8242C] transition-all duration-300 mt-0.5"
            :class="activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
          ></span>
        </button>
      </div>
    </nav>

    <!-- ==================== COVER SCREEN (FULL WIDE GATE / SAMPUL) ==================== -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 z-[70] w-full h-full min-h-screen flex flex-col items-center justify-between text-center px-4 sm:px-6 py-6 sm:py-8 md:py-10 bg-[#F5F2EC] overflow-y-auto transition-all duration-1000 select-none"
      >
        <!-- Floating Subtle Botanical Line Flourishes for Desktop / Tablet -->
        <div class="hidden md:block absolute top-8 left-10 w-24 h-24 lg:w-32 lg:h-32 opacity-25 pointer-events-none -rotate-12">
          <img
            src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
            alt="Flourish"
            class="w-full h-full object-contain flourish-red"
          />
        </div>
        <div class="hidden md:block absolute bottom-10 right-10 w-28 h-28 lg:w-36 lg:h-36 opacity-25 pointer-events-none rotate-45">
          <img
            src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
            alt="Flourish"
            class="w-full h-full object-contain flourish-red"
          />
        </div>

        <!-- Top Eyebrow -->
        <div class="space-y-2 pt-2 relative z-10 animate-fade-in shrink-0">
          <p class="font-montserrat text-[11px] sm:text-xs md:text-sm text-[#1B1B1B]/80 tracking-[0.25em] lowercase">
            kamu diundang ke pernikahan kami
          </p>
          <div class="w-8 sm:w-10 mx-auto opacity-70">
            <img
              src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
              alt="Heart Flourish"
              class="w-full h-auto object-contain flourish-red gc-denyut"
            />
          </div>
        </div>

        <!-- Center Couple Calligraphy & Continuous Line Illustration -->
        <div class="my-auto py-2 sm:py-4 flex flex-col items-center space-y-2 sm:space-y-4 relative z-10 animate-fade-in-up w-full max-w-xl">
          <!-- Staggered Diagonal Calligraphy Names matching our-wedding.link -->
          <div class="relative py-1 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] mx-auto text-left">
            <h1 class="font-dafoe text-5xl sm:text-6xl md:text-7xl text-[#1B1B1B] leading-none pl-4">
              {{ groomFirstName }}
            </h1>
            <p class="font-dafoe text-3xl sm:text-4xl text-[#C8242C] leading-none pl-14 sm:pl-16 -my-1 select-none">
              &amp;
            </p>
            <h1 class="font-dafoe text-5xl sm:text-6xl md:text-7xl text-[#1B1B1B] leading-none pl-20 sm:pl-28">
              {{ brideFirstName }}
            </h1>
          </div>

          <!-- Continuous Line Couple Illustration with Stop-Motion Wobble -->
          <div class="relative w-44 sm:w-52 md:w-56 mx-auto pt-1">
            <img
              src="/assets/templates/love-line/2297f990-c95e-11f1-bea3-415a8cc57c30.png"
              alt="Continuous Line Couple"
              class="w-full h-auto object-contain gc-goyang mx-auto line-art-charcoal"
            />
            <div class="absolute -bottom-2 -right-4 sm:-right-8 flex items-center gap-1.5 select-none -rotate-[14deg]">
              <p class="font-caveat text-lg sm:text-xl md:text-2xl text-[#1B1B1B]/90 whitespace-nowrap">
                lebih baik bersama
              </p>
              <div class="w-3.5 h-3.5 opacity-80">
                <img
                  src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Heart"
                  class="w-full h-full object-contain flourish-red gc-denyut"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Guest Greeting & Open Button -->
        <div class="w-full max-w-sm mx-auto space-y-3 pb-2 sm:pb-4 relative z-10 animate-fade-in-up shrink-0">
          <div>
            <p class="font-montserrat text-[10px] sm:text-xs text-[#1B1B1B]/70 tracking-widest uppercase">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p class="font-montserrat text-lg sm:text-xl md:text-2xl font-bold text-[#1B1B1B] mt-0.5 truncate px-4">
              {{ data.guestName || 'Tamu Undangan' }}
            </p>
          </div>

          <!-- Buka Undangan Button (Pill style matching target) -->
          <div class="pt-1">
            <button
              type="button"
              @click="openInvitation"
              class="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3 sm:py-3.5 bg-[#1B1B1B] hover:bg-black text-[#F5F2EC] font-montserrat text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <i class="fa-solid fa-arrow-right text-xs"></i>
              <span>Buka Undangan</span>
            </button>
          </div>
        </div>

      </div>
    </transition>

    <!-- ==================== MAIN INVITATION CONTENT ==================== -->
    <div
      v-if="!showWelcome"
      id="main-content"
      class="opacity-0 transition-opacity duration-1000 w-full flex flex-col items-center"
    >

      <!-- ==================== SECTION 1: PEMBUKA & AYAT (#home) ==================== -->
      <section
        v-if="isSectionEnabled('quote')"
        id="home"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative"
      >
        <div class="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6">
          <p class="font-montserrat text-[11px] md:text-xs text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
            dengan penuh syukur
          </p>

          <!-- Main Couple Photo with Duotone Filter & Flower Stamp -->
          <div class="relative w-[250px] sm:w-[280px] md:w-[320px] h-[300px] sm:h-[340px] md:h-[380px] overflow-hidden bg-[#EFECE5] rounded-2xl shadow-sm">
            <img
              :src="data.heroImage || data.photoCoupleUrl || '/assets/templates/love-line/68257d80-cb47-11f1-8e64-a9fec9085fda.jpg'"
              alt="Mempelai"
              class="w-full h-full object-cover duotone-photo"
            />
            <!-- Overlapping Flower Stamp -->
            <div class="absolute -top-3 -right-3 w-16 md:w-20 h-16 md:h-20 pointer-events-none opacity-85">
              <img
                src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                alt="Flourish"
                class="w-full h-full object-contain flourish-red"
              />
            </div>
          </div>

          <!-- Description Text 1 -->
          <p class="font-montserrat text-sm md:text-base text-[#1B1B1B] leading-relaxed max-w-md">
            Dengan memohon rahmat Tuhan, kami bermaksud menikah. Kehadiran dan doamu akan membuat hari itu jauh lebih bahagia.
          </p>

          <!-- Scripture / Quote -->
          <div class="space-y-2 max-w-lg border-y border-[#1B1B1B]/10 py-6">
            <p class="font-caveat text-xl sm:text-2xl md:text-3xl text-[#1B1B1B]/90 leading-relaxed">
              "{{ data.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya, Dia menciptakan pasangan untukmu agar kamu merasa tenteram.' }}"
            </p>
            <p v-if="data.quoteSource" class="font-montserrat text-[10px] md:text-xs text-[#1B1B1B]/60 tracking-widest uppercase">
              — {{ data.quoteSource }}
            </p>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 2: MEMPELAI (#couple) ==================== -->
      <section
        v-if="isSectionEnabled('couple')"
        id="couple"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-4xl mx-auto flex flex-col items-center">
          <p class="font-montserrat text-[11px] md:text-xs text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
            dua orang, satu cerita
          </p>

          <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none mt-2 -rotate-[4deg]">
            Mempelai
          </h2>

          <!-- Responsive Couple Cards: Stacked on Mobile, Side-by-Side on Tablet/Desktop -->
          <div class="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start relative">
            
            <!-- GROOM CARD -->
            <div class="flex flex-col items-center space-y-3">
              <div class="relative w-[240px] sm:w-[260px] h-[300px] sm:h-[320px] rounded-2xl overflow-hidden shadow-sm bg-[#EFECE5]">
                <img
                  :src="data.groomPhoto || data.groomPhotoUrl || '/assets/templates/love-line/684b7c10-cb47-11f1-8e64-a9fec9085fda.jpg'"
                  alt="Mempelai Pria"
                  class="w-full h-full object-cover duotone-photo"
                />
                <!-- 'si dia' in Caveat -->
                <span class="font-caveat text-2xl md:text-3xl text-[#C8242C] absolute -bottom-2 -left-2 -rotate-[14deg] z-10 pointer-events-none select-none">
                  si dia
                </span>
                <div class="absolute -top-3 -right-3 w-16 h-16 z-10 pointer-events-none opacity-85">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain flourish-red"
                  />
                </div>
              </div>

              <h3 class="font-dafoe text-4xl md:text-5xl text-[#1B1B1B] leading-tight pt-2 -rotate-[3deg]">
                {{ data.groomName || 'Elang Prakoso' }}
              </h3>

              <div class="space-y-0.5">
                <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px]">
                  putra dari
                </p>
                <p class="font-montserrat text-sm md:text-base text-[#1B1B1B] font-medium leading-relaxed max-w-[280px]">
                  {{ data.parents?.groomParents || 'Bapak Bambang Prakoso & Ibu Sri Lestari' }}
                </p>
              </div>

              <div v-if="data.socialMediaGroom?.instagram" class="pt-2">
                <a
                  :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full border border-[#1B1B1B] text-xs font-montserrat font-medium text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
                >
                  <i class="fa-brands fa-instagram text-xs"></i>
                  <span>@{{ cleanInstagram(data.socialMediaGroom.instagram) }}</span>
                </a>
              </div>
            </div>

            <!-- Red Ampersand (Absolute centered on desktop, in-between on mobile) -->
            <div class="md:hidden font-dafoe text-4xl text-[#C8242C] leading-none my-2 select-none">
              &amp;
            </div>

            <!-- BRIDE CARD -->
            <div class="flex flex-col items-center space-y-3">
              <div class="relative w-[240px] sm:w-[260px] h-[300px] sm:h-[320px] rounded-2xl overflow-hidden shadow-sm bg-[#EFECE5]">
                <img
                  :src="data.bridePhoto || data.bridePhotoUrl || '/assets/templates/love-line/685f2b20-cb47-11f1-8e64-a9fec9085fda.jpg'"
                  alt="Mempelai Wanita"
                  class="w-full h-full object-cover duotone-photo"
                />
                <!-- 'si cantik' in Caveat -->
                <span class="font-caveat text-2xl md:text-3xl text-[#C8242C] absolute -top-2 -right-2 rotate-[12deg] z-10 pointer-events-none select-none">
                  si cantik
                </span>
                <div class="absolute -bottom-3 -left-3 w-14 h-14 z-10 pointer-events-none opacity-85">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain flourish-red"
                  />
                </div>
              </div>

              <h3 class="font-dafoe text-4xl md:text-5xl text-[#1B1B1B] leading-tight pt-2 rotate-[2deg]">
                {{ data.brideName || 'Laila Anindita' }}
              </h3>

              <div class="space-y-0.5">
                <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px]">
                  putri dari
                </p>
                <p class="font-montserrat text-sm md:text-base text-[#1B1B1B] font-medium leading-relaxed max-w-[280px]">
                  {{ data.parents?.brideParents || 'Bapak Dedi Supriyadi & Ibu Endang Rahayu' }}
                </p>
              </div>

              <div v-if="data.socialMediaBrides?.instagram" class="pt-2">
                <a
                  :href="formatInstagramUrl(data.socialMediaBrides.instagram)"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full border border-[#1B1B1B] text-xs font-montserrat font-medium text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
                >
                  <i class="fa-brands fa-instagram text-xs"></i>
                  <span>@{{ cleanInstagram(data.socialMediaBrides.instagram) }}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ==================== SECTION 3: TANGGAL & TEMPAT (#event) ==================== -->
      <section
        v-if="isSectionEnabled('event')"
        id="event"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-4xl mx-auto flex flex-col items-center">
          <p class="font-montserrat text-[11px] md:text-xs text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
            detail hari bahagia kami
          </p>

          <div class="mt-2 -rotate-[4deg] space-y-0">
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none">
              Tanggal
            </h2>
            <h2 class="font-dafoe text-4xl md:text-5xl text-[#1B1B1B] leading-none -mt-1">
              &amp; Tempat
            </h2>
          </div>

          <!-- Responsive Event Cards: 1 column on mobile, 2 columns on tablet/desktop -->
          <div class="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            <!-- Akad Nikah Card -->
            <div class="p-6 md:p-8 bg-[#EFECE5]/70 rounded-3xl border border-[#1B1B1B]/10 flex flex-col items-center text-center justify-between shadow-xs">
              <div class="space-y-3 flex flex-col items-center">
                <img
                  src="/assets/templates/love-line/21edd6e0-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Calendar"
                  class="w-10 h-10 object-contain line-art-charcoal"
                />
                <h3 class="font-montserrat text-lg md:text-xl font-bold uppercase tracking-wider text-[#1B1B1B]">
                  Akad Nikah
                </h3>
                <p class="font-montserrat text-sm md:text-base font-semibold text-[#1B1B1B]">
                  {{ formatNumericDate(data.akadLocation?.dateTime || data.dateTime) }}
                </p>
                <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/80 font-medium">
                  Pukul {{ formatTime(data.akadLocation?.dateTime || data.dateTime) }} WIB
                </p>
                <div class="pt-2 text-xs text-[#1B1B1B]/70 leading-relaxed max-w-xs">
                  <p class="font-bold text-[#1B1B1B]">{{ data.akadLocation?.title || 'Villa Mawar' }}</p>
                  <p>{{ data.akadLocation?.description || 'Jl. Bukit Indah No. 8, Megamendung, Bogor' }}</p>
                </div>
              </div>

              <div class="pt-6 w-full max-w-[200px]">
                <a
                  v-if="data.akadLocation?.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1B1B1B] text-[#F5F2EC] text-[11px] font-montserrat font-semibold tracking-wider uppercase rounded-full shadow-sm hover:bg-black active:scale-95 transition-all cursor-pointer"
                >
                  <i class="fa-solid fa-map-location-dot text-xs"></i>
                  <span>Buka Peta</span>
                </a>
              </div>
            </div>

            <!-- Resepsi Card -->
            <div class="p-6 md:p-8 bg-[#EFECE5]/70 rounded-3xl border border-[#1B1B1B]/10 flex flex-col items-center text-center justify-between shadow-xs">
              <div class="space-y-3 flex flex-col items-center">
                <img
                  src="/assets/templates/love-line/21d4f7b0-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Clock"
                  class="w-10 h-10 object-contain line-art-charcoal"
                />
                <h3 class="font-montserrat text-lg md:text-xl font-bold uppercase tracking-wider text-[#1B1B1B]">
                  Resepsi Pernikahan
                </h3>
                <p class="font-montserrat text-sm md:text-base font-semibold text-[#1B1B1B]">
                  {{ formatNumericDate(data.resepsiLocation?.dateTime || data.dateTime) }}
                </p>
                <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/80 font-medium">
                  Pukul {{ formatTime(data.resepsiLocation?.dateTime || data.dateTime) }} WIB
                </p>
                <div class="pt-2 text-xs text-[#1B1B1B]/70 leading-relaxed max-w-xs">
                  <p class="font-bold text-[#1B1B1B]">{{ data.resepsiLocation?.title || data.akadLocation?.title || 'Villa Mawar' }}</p>
                  <p>{{ data.resepsiLocation?.description || data.akadLocation?.description || 'Jl. Bukit Indah No. 8, Megamendung, Bogor' }}</p>
                </div>
              </div>

              <div class="pt-6 w-full max-w-[200px]">
                <button
                  type="button"
                  @click="saveToCalendar('Pernikahan', data.resepsiLocation || data.akadLocation)"
                  class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#1B1B1B] text-[#1B1B1B] text-[11px] font-montserrat font-semibold tracking-wider uppercase rounded-full hover:bg-[#1B1B1B] hover:text-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
                >
                  <i class="fa-solid fa-calendar-plus text-xs"></i>
                  <span>Simpan Tanggal</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Countdown Timer Box -->
          <div class="mt-12 w-full max-w-md p-6 bg-[#EFECE5]/80 rounded-3xl border border-[#1B1B1B]/10 shadow-xs">
            <p class="font-montserrat text-xs uppercase tracking-[0.25em] text-[#1B1B1B]/60 mb-4 text-center font-semibold">
              Menghitung Hari Bahagia
            </p>
            <div class="grid grid-cols-4 gap-3 text-center">
              <div v-for="(val, unit) in countdown" :key="unit" class="bg-[#F5F2EC] py-3 px-2 rounded-2xl shadow-xs">
                <span class="block font-montserrat text-2xl md:text-3xl font-bold text-[#1B1B1B]">{{ val }}</span>
                <span class="block font-montserrat text-[10px] uppercase tracking-wider text-[#1B1B1B]/70 mt-1">{{ unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 4: JADWAL / RUNDOWN ==================== -->
      <section
        v-if="isSectionEnabled('rundown')"
        id="rundown"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-xl mx-auto flex flex-col items-center">
          <p class="font-montserrat text-[11px] md:text-xs text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
            susunan acara
          </p>

          <div class="relative mt-2 inline-block">
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[4deg]">
              Jadwal
            </h2>
            <div class="absolute -top-1 -right-6 w-5 h-5 pointer-events-none opacity-80">
              <img
                src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                alt="Flourish"
                class="w-full h-full object-contain flourish-red"
              />
            </div>
          </div>

          <div class="mt-8 w-full space-y-5">
            <div
              v-for="(item, idx) in effectiveRundown"
              :key="idx"
              class="w-full flex flex-col items-center text-center"
            >
              <p class="font-montserrat text-lg md:text-xl font-bold text-[#1B1B1B] tracking-wide">
                {{ item.time }}
              </p>
              <p class="font-montserrat text-sm md:text-base text-[#1B1B1B] mt-0.5">
                {{ item.title }}
              </p>
              <div v-if="idx < effectiveRundown.length - 1" class="w-10 h-[1.5px] bg-[#1B1B1B]/80 mt-4"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 5: CERITA (#story) ==================== -->
      <section
        v-if="isSectionEnabled('love-story') && (effectiveStories.length > 0 || isPreviewMode)"
        id="story"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-3xl mx-auto flex flex-col items-center">
          <p class="font-montserrat text-[11px] md:text-xs text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
            perjalanan kami
          </p>

          <div class="relative mt-2 inline-block">
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[4deg]">
              Cerita
            </h2>
            <div class="absolute -top-1 -right-6 w-5 h-5 pointer-events-none opacity-80">
              <img
                src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                alt="Flourish"
                class="w-full h-full object-contain flourish-red"
              />
            </div>
          </div>

          <!-- Alternating Zig-Zag Timeline Container -->
          <div class="mt-10 w-full relative">
            <!-- Center Vertical Line -->
            <div class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#1B1B1B]/80 z-0"></div>

            <div class="flex flex-col space-y-10 relative z-10">
              <div
                v-for="(story, idx) in effectiveStories"
                :key="idx"
                class="relative min-h-[200px] w-full"
              >
                <!-- Center Dot -->
                <div class="absolute top-[54px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#1B1B1B] z-20"></div>

                <!-- Odd Item (idx % 2 === 0): Photo on Left, Text on Right -->
                <div v-if="idx % 2 === 0" class="w-full h-full relative">
                  <div class="absolute top-4 left-4 sm:left-12 md:left-16 w-36 sm:w-44 h-44 sm:h-52 gc-goyang z-10 shadow-sm bg-[#EFECE5] rounded-xl overflow-hidden">
                    <img
                      :src="story.image || defaultStoryPhoto(idx)"
                      :alt="story.title"
                      class="w-full h-full object-cover duotone-photo"
                    />
                  </div>
                  <div class="ml-[56%] mr-4 sm:mr-10 pt-6 text-left space-y-1">
                    <h4 class="font-caveat text-2xl sm:text-3xl text-[#1B1B1B] font-semibold leading-tight">
                      {{ story.title }}
                    </h4>
                    <p class="font-montserrat text-xs sm:text-sm text-[#1B1B1B]/85 leading-relaxed">
                      {{ story.description }}
                    </p>
                  </div>
                </div>

                <!-- Even Item (idx % 2 === 1): Photo on Right, Text on Left -->
                <div v-else class="w-full h-full relative">
                  <div class="absolute top-4 right-4 sm:right-12 md:right-16 w-36 sm:w-44 h-44 sm:h-52 gc-goyang gc-goyang-b z-10 shadow-sm bg-[#EFECE5] rounded-xl overflow-hidden">
                    <img
                      :src="story.image || defaultStoryPhoto(idx)"
                      :alt="story.title"
                      class="w-full h-full object-cover duotone-photo"
                    />
                  </div>
                  <div class="mr-[56%] ml-4 sm:ml-10 pt-6 text-right space-y-1">
                    <h4 class="font-caveat text-2xl sm:text-3xl text-[#1B1B1B] font-semibold leading-tight">
                      {{ story.title }}
                    </h4>
                    <p class="font-montserrat text-xs sm:text-sm text-[#1B1B1B]/85 leading-relaxed">
                      {{ story.description }}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 6: GALERI (#gallery) ==================== -->
      <section
        v-if="isSectionEnabled('gallery') && (effectiveGallery.length > 0 || isPreviewMode)"
        id="gallery"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-5xl mx-auto flex flex-col items-center">
          <p class="font-montserrat text-[11px] md:text-xs text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
            momen kami
          </p>

          <div class="relative mt-2 inline-block">
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[4deg]">
              Galeri
            </h2>
            <div class="absolute -top-1 -right-6 w-5 h-5 pointer-events-none opacity-80">
              <img
                src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                alt="Flourish"
                class="w-full h-full object-contain flourish-red"
              />
            </div>
          </div>

          <!-- Responsive Gallery Grid: 2 columns on mobile, 4 columns on tablet & desktop -->
          <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div
              v-for="(img, idx) in effectiveGallery"
              :key="idx"
              @click="openLightbox(img)"
              class="aspect-[4/5] overflow-hidden bg-[#EFECE5] rounded-xl shadow-xs cursor-pointer group relative"
            >
              <img
                :src="img"
                :alt="`Galeri ${idx + 1}`"
                class="w-full h-full object-cover duotone-photo group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg">
                <i class="fa-solid fa-magnifying-glass-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 7: DRESS CODE (#dress-code) ==================== -->
      <section
        v-if="isSectionEnabled('dress-code')"
        id="dress-code"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-xl mx-auto flex flex-col items-center">
          <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/75 leading-relaxed max-w-md">
            kehadiranmu adalah hadiah terbesar, tapi kami akan senang bila kamu berbusana dalam palet warna kami
          </p>

          <div class="mt-4 -rotate-[5deg]">
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none">
              Dress
            </h2>
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -mt-2">
              Code
            </h2>
          </div>

          <!-- Color Swatches with Labels -->
          <div class="flex items-center justify-center gap-4 sm:gap-6 mt-8">
            <div
              v-for="(item, idx) in dressCodeSwatches"
              :key="idx"
              class="flex flex-col items-center gap-2"
            >
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm border border-black/10 transition-transform hover:scale-110"
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-wider text-[#1B1B1B]/70 font-medium">
                {{ item.name }}
              </span>
            </div>
          </div>

          <p v-if="data.dressCode" class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/80 mt-6 max-w-md leading-relaxed">
            {{ data.dressCode }}
          </p>
        </div>
      </section>

      <!-- ==================== SECTION: TURUT MENGUNDANG (#family) ==================== -->
      <section
        v-if="isSectionEnabled('extended-family') && (normalizedExtendedFamily.length > 0 || isPreviewMode)"
        id="family"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-2xl mx-auto flex flex-col items-center">
          <p class="font-montserrat text-[11px] md:text-xs text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
            keluarga besar
          </p>
          <div class="relative mt-2 inline-block">
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[3deg]">
              Turut Mengundang
            </h2>
            <div class="absolute -top-1 -right-6 w-5 h-5 pointer-events-none opacity-80">
              <img
                src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                alt="Flourish"
                class="w-full h-full object-contain flourish-red"
              />
            </div>
          </div>

          <div class="mt-8 w-full max-w-md p-6 bg-[#EFECE5]/80 rounded-3xl border border-[#1B1B1B]/10 space-y-2.5 shadow-xs">
            <p
              v-for="(member, idx) in normalizedExtendedFamily"
              :key="idx"
              class="font-montserrat text-sm md:text-base text-[#1B1B1B] font-medium leading-relaxed"
            >
              {{ member }}
            </p>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 8: KONFIRMASI (#rsvp) ==================== -->
      <section
        v-if="isSectionEnabled('rsvp')"
        id="rsvp"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-xl mx-auto flex flex-col items-center">
          <!-- Envelope Continuous Line Illustration -->
          <div class="w-full max-w-xs pointer-events-none mb-4">
            <img
              src="/assets/templates/love-line/233c76f0-c95e-11f1-bea3-415a8cc57c30.png"
              alt="Konfirmasi RSVP"
              class="w-full h-auto object-contain line-art-charcoal"
            />
          </div>

          <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[4deg]">
            Konfirmasi
          </h2>
          <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/80 leading-relaxed max-w-xs mt-2">
            Kabari kami kehadiranmu lewat formulir di bawah ini, ya.
          </p>

          <form @submit.prevent="submitRSVP" class="gc-borang mt-8 w-full max-w-md text-left space-y-5 bg-[#EFECE5]/50 p-6 md:p-8 rounded-3xl border border-[#1B1B1B]/10">
            <div>
              <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                Nama Lengkap
              </label>
              <input
                v-model="rsvp.name"
                type="text"
                placeholder="Tuliskan nama Anda"
                required
                class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-sm font-montserrat outline-none transition-colors"
              />
            </div>

            <div>
              <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                Konfirmasi Kehadiran
              </label>
              <select
                v-model="rsvp.attendance"
                class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-sm font-montserrat outline-none cursor-pointer"
              >
                <option value="hadir" class="bg-[#F5F2EC] text-[#1B1B1B]">Ya, saya akan hadir</option>
                <option value="tidak_hadir" class="bg-[#F5F2EC] text-[#1B1B1B]">Maaf, belum bisa hadir</option>
              </select>
            </div>

            <div v-if="rsvp.attendance === 'hadir'">
              <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                Jumlah Hadir
              </label>
              <select
                v-model="rsvp.totalGuests"
                class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-sm font-montserrat outline-none cursor-pointer"
              >
                <option :value="1" class="bg-[#F5F2EC] text-[#1B1B1B]">1 Orang</option>
                <option :value="2" class="bg-[#F5F2EC] text-[#1B1B1B]">2 Orang</option>
                <option :value="3" class="bg-[#F5F2EC] text-[#1B1B1B]">3 Orang</option>
                <option :value="4" class="bg-[#F5F2EC] text-[#1B1B1B]">4 Orang</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                Pesan / Doa
              </label>
              <textarea
                v-model="rsvp.message"
                rows="3"
                placeholder="Tuliskan ucapan dan doa Anda..."
                class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-sm font-montserrat outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <div class="pt-3 text-center">
              <button
                type="submit"
                :disabled="isSubmittingRsvp"
                class="w-full py-3.5 bg-[#1B1B1B] text-[#F5F2EC] font-montserrat text-xs font-semibold tracking-[0.2em] uppercase rounded-full shadow-md hover:bg-black active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {{ isSubmittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi' }}
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- ==================== SECTION 9: DOA & UCAPAN (#wishes) ==================== -->
      <section
        v-if="isSectionEnabled('wishes')"
        id="wishes"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-xl mx-auto flex flex-col items-center">
          <div class="relative inline-block">
            <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[4deg]">
              Doa &amp; Ucapan
            </h2>
            <div class="absolute -top-1 -right-6 w-5 h-5 pointer-events-none opacity-80">
              <img
                src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                alt="Flourish"
                class="w-full h-full object-contain flourish-red"
              />
            </div>
          </div>
          <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/80 leading-relaxed max-w-xs mt-2">
            Tinggalkan doa dan harapan terbaikmu untuk kami.
          </p>

          <div class="mt-8 w-full space-y-4 max-h-[420px] overflow-y-auto pr-1">
            <div
              v-for="(item, idx) in submittedWishes"
              :key="idx"
              class="p-4 md:p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-black/10 text-left shadow-xs"
            >
              <div class="flex items-center justify-between">
                <p class="font-montserrat text-sm md:text-base font-bold text-[#1B1B1B]">
                  {{ item.name }}
                </p>
                <span
                  class="font-montserrat text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold"
                  :class="item.rsvpStatus === 'hadir' ? 'bg-[#7A8063]/20 text-[#7A8063]' : 'bg-[#A35A4A]/20 text-[#A35A4A]'"
                >
                  {{ item.rsvpStatus === 'hadir' ? 'Hadir' : 'Absen' }}
                </span>
              </div>
              <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/85 leading-relaxed mt-2">
                {{ item.message }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 10: TANDA KASIH (#gift) ==================== -->
      <section
        v-if="isSectionEnabled('gift')"
        id="gift"
        class="w-full py-16 md:py-24 px-6 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10"
      >
        <div class="w-full max-w-xl mx-auto flex flex-col items-center">
          <h2 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[4deg]">
            Tanda Kasih
          </h2>
          <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/80 leading-relaxed max-w-md mt-2">
            Doa restumu sudah lebih dari cukup. Bila ingin memberi lebih, kami menerimanya dengan penuh syukur.
          </p>

          <div class="mt-8 w-full space-y-4">
            <div
              v-for="(acc, idx) in effectiveBankAccounts"
              :key="idx"
              class="p-5 bg-white/70 rounded-2xl border border-black/10 text-left flex items-center justify-between shadow-xs"
            >
              <div>
                <p class="font-montserrat text-xs font-bold uppercase tracking-wider text-[#1B1B1B]">
                  {{ acc.bankName }}
                </p>
                <p class="font-montserrat text-base md:text-lg font-semibold text-[#1B1B1B] tracking-wider mt-0.5">
                  {{ acc.accountNumber }}
                </p>
                <p class="font-montserrat text-xs text-[#1B1B1B]/70 mt-0.5">
                  a.n {{ acc.accountName }}
                </p>
              </div>
              <button
                type="button"
                @click="copyText(acc.accountNumber, acc.bankName)"
                class="px-4 py-2 bg-[#1B1B1B] hover:bg-black text-[#F5F2EC] text-[11px] font-montserrat font-semibold uppercase tracking-wider rounded-full active:scale-95 transition-all cursor-pointer"
              >
                Salin
              </button>
            </div>

            <!-- Gift Delivery Address -->
            <div
              v-if="effectiveGiftAddress"
              class="p-5 bg-white/70 rounded-2xl border border-black/10 text-left shadow-xs"
            >
              <div class="flex items-center gap-2 mb-1.5">
                <i class="fa-solid fa-gift text-[#1B1B1B] text-sm"></i>
                <span class="font-montserrat text-xs font-bold uppercase tracking-wider text-[#1B1B1B]">
                  Kirim Kado Fisik
                </span>
              </div>
              <p class="font-montserrat text-xs md:text-sm text-[#1B1B1B]/80 leading-relaxed">
                {{ effectiveGiftAddress }}
              </p>
              <button
                type="button"
                @click="copyText(effectiveGiftAddress, 'Alamat pengiriman kado')"
                class="mt-3 inline-block text-[11px] font-montserrat font-semibold uppercase tracking-wider text-[#1B1B1B] underline hover:opacity-75 cursor-pointer"
              >
                Salin Alamat
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 11: PENUTUP ==================== -->
      <section class="w-full py-16 md:py-24 px-6 pb-28 text-center flex flex-col items-center relative border-t border-[#1B1B1B]/10">
        <div class="w-full max-w-xl mx-auto flex flex-col items-center space-y-6">
          <!-- Hands Line Art Illustration -->
          <div class="w-48 sm:w-56 pointer-events-none">
            <img
              src="/assets/templates/love-line/21299c80-c95e-11f1-bea3-415a8cc57c30.png"
              alt="Penutup"
              class="w-full h-auto object-contain line-art-charcoal"
            />
          </div>

          <p class="font-montserrat text-sm md:text-base text-[#1B1B1B] leading-relaxed max-w-sm">
            Terima kasih sudah jadi bagian dari cerita kami. Sampai jumpa di hari bahagia!
          </p>

          <div class="space-y-0 text-center pt-2">
            <h3 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none -rotate-[3deg]">
              {{ groomFirstName }}
            </h3>
            <p class="font-dafoe text-3xl md:text-4xl text-[#C8242C] leading-none -mt-1">
              &amp;
            </p>
            <h3 class="font-dafoe text-5xl md:text-6xl text-[#1B1B1B] leading-none rotate-[2deg] -mt-1">
              {{ brideFirstName }}
            </h3>
          </div>

          <div class="pt-8">
            <WatermarkBadge />
          </div>
        </div>
      </section>

    </div>

    <!-- ==================== LIGHTBOX MODAL ==================== -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="lightboxImage"
          class="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="lightboxImage = null"
        >
          <div class="relative max-w-2xl w-full flex flex-col items-center">
            <button
              type="button"
              @click="lightboxImage = null"
              class="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition-all cursor-pointer"
            >
              <i class="fa-solid fa-times"></i>
            </button>
            <img
              :src="lightboxImage"
              alt="Galeri Lightbox"
              class="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import MusicControl from '@/components/invitation/MusicControl.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import { createGuestMessage } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'
import { EVENT_TIME_ZONE, getEventDateParts, toEventDate } from '@/utils/eventTime'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()
const toast = useToast()
const data = ref(props.data || {})

watch(
  () => props.data,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      if (JSON.stringify(newVal) !== JSON.stringify(data.value)) {
        data.value = { ...newVal }
        initData()
      }
    }
  },
  { deep: true, immediate: true },
)

const isPreviewMode = computed(() => {
  return (
    data.value.id === 'live-preview' ||
    data.value.id === 0 ||
    route.query.preview === 'true' ||
    route.query.mode === 'live'
  )
})

const isInsideFrame = computed(() => {
  return typeof window !== 'undefined' && (window.self !== window.top || route.query.frame === 'true')
})

// Groom & Bride display names
const groomFirstName = computed(() => {
  return (
    data.value.groomNickname ||
    (data.value.groomName ? data.value.groomName.split(' ')[0] : 'Elang')
  )
})

const brideFirstName = computed(() => {
  return (
    data.value.brideNickname ||
    (data.value.brideName ? data.value.brideName.split(' ')[0] : 'Laila')
  )
})

// Section Visibility Engine (Studio Editor Compatible)
function isSectionEnabled(key) {
  const sections = data.value.selectedSections || data.value.sections
  if (sections === undefined || sections === null) return true
  if (!Array.isArray(sections)) return true

  if (sections.length > 0 && typeof sections[0] === 'object') {
    const target = sections.find((s) => s.key === key || s.section?.key === key)
    if (target) return target.isEnabled !== false
  }

  const aliasMap = {
    quote: ['quote', 'pembuka', 'ayat'],
    couple: ['couple', 'mempelai', 'photoCouple'],
    event: ['event', 'event-details', 'map', 'acara', 'lokasi'],
    rundown: ['rundown', 'jadwal', 'acara', 'itinerary'],
    'love-story': ['love-story', 'story', 'cerita'],
    gallery: ['gallery', 'galeri', 'foto'],
    'dress-code': ['dress-code', 'dressCode'],
    rsvp: ['rsvp', 'konfirmasi'],
    wishes: ['wishes', 'guestbook', 'doa', 'ucapan'],
    gift: ['gift', 'digital-envelope', 'tanda-kasih', 'rek', 'hadiah'],
    'extended-family': ['extended-family', 'turut-mengundang', 'keluarga'],
  }
  const aliases = aliasMap[key] || [key]
  return aliases.some((a) => sections.includes(a))
}

// Bottom Navigation items matching standard SatuUndangan templates
const allNavItems = [
  { id: 'home', label: 'Sampul', icon: 'fa-solid fa-heart', key: 'quote' },
  { id: 'couple', label: 'Mempelai', icon: 'fa-solid fa-user-group', key: 'couple' },
  { id: 'event', label: 'Acara', icon: 'fa-solid fa-calendar-check', key: 'event' },
  { id: 'story', label: 'Cerita', icon: 'fa-solid fa-book-open', key: 'love-story' },
  { id: 'gallery', label: 'Galeri', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' },
  { id: 'gift', label: 'Hadiah', icon: 'fa-solid fa-gift', key: 'gift' },
]

const navItems = computed(() => {
  return allNavItems.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'story') return isSectionEnabled('love-story') && (effectiveStories.value.length > 0 || isPreviewMode.value)
    if (item.id === 'gallery') return isSectionEnabled('gallery') && (effectiveGallery.value.length > 0 || isPreviewMode.value)
    return isSectionEnabled(item.key)
  })
})

const activeSection = ref('home')

function scrollToSection(id) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function initScrollSpy() {
  if (typeof IntersectionObserver === 'undefined') return
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, { threshold: 0.25 })

  navItems.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

// Cover Screen Gate
const showWelcome = ref(true)

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    const el = document.getElementById('main-content')
    if (el) el.classList.remove('opacity-0')
    initScrollSpy()
  }, 100)
}

function toggleGate() {
  showWelcome.value = !showWelcome.value
  if (!showWelcome.value) {
    setTimeout(() => {
      const el = document.getElementById('main-content')
      if (el) el.classList.remove('opacity-0')
      initScrollSpy()
    }, 100)
  }
}

// Countdown
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let countdownInterval = null

function updateCountdown() {
  const targetDateStr =
    data.value.akadLocation?.dateTime ||
    data.value.resepsiLocation?.dateTime ||
    data.value.dateTime ||
    '2028-02-28T15:00:00.000Z'
  const target = new Date(targetDateStr).getTime()
  const now = new Date().getTime()
  const diff = target - now

  if (diff <= 0) {
    countdown.value = { Hari: '00', Jam: '00', Menit: '00', Detik: '00' }
    return
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = {
    Hari: String(d).padStart(2, '0'),
    Jam: String(h).padStart(2, '0'),
    Menit: String(m).padStart(2, '0'),
    Detik: String(s).padStart(2, '0'),
  }
}

// Rundown
const defaultRundown = [
  { time: '15:00', title: 'Akad nikah' },
  { time: '16:00', title: 'Ramah tamah' },
  { time: '18:00', title: 'Makan malam' },
  { time: '19:30', title: 'Pesta dansa' },
]

const effectiveRundown = computed(() => {
  if (data.value.rundown && data.value.rundown.length > 0) {
    return data.value.rundown
  }
  return defaultRundown
})

// Stories
const defaultStories = [
  {
    title: 'Pertama kenal',
    description: 'Berawal dari obrolan singkat di kedai kopi, ternyata nyambung sampai lupa waktu.',
    image: '/assets/templates/love-line/67e60380-cb47-11f1-8e64-a9fec9085fda.jpg',
  },
  {
    title: 'Jalan bareng',
    description: 'Hujan, macet, dan payung yang kekecilan. Semuanya terasa lucu kalau dijalani berdua.',
    image: '/assets/templates/love-line/67ca3e20-cb47-11f1-8e64-a9fec9085fda.jpg',
  },
  {
    title: 'Lamaran',
    description: 'Satu pertanyaan sederhana, satu jawaban paling cepat yang pernah ada: iya.',
    image: '/assets/templates/love-line/681243a0-cb47-11f1-8e64-a9fec9085fda.jpg',
  },
  {
    title: 'Menuju halal',
    description: 'Sekarang kami siap memulai babak baru, dan kamu ikut jadi saksinya.',
    image: '/assets/templates/love-line/673fd870-cb47-11f1-8e64-a9fec9085fda.jpg',
  },
]

const effectiveStories = computed(() => {
  if (data.value.loveStory && data.value.loveStory.length > 0) {
    return data.value.loveStory
  }
  return defaultStories
})

function defaultStoryPhoto(idx) {
  const p = [
    '/assets/templates/love-line/67e60380-cb47-11f1-8e64-a9fec9085fda.jpg',
    '/assets/templates/love-line/67ca3e20-cb47-11f1-8e64-a9fec9085fda.jpg',
    '/assets/templates/love-line/681243a0-cb47-11f1-8e64-a9fec9085fda.jpg',
    '/assets/templates/love-line/673fd870-cb47-11f1-8e64-a9fec9085fda.jpg',
  ]
  return p[idx % p.length]
}

// Gallery Photos & Lightbox
const defaultGalleryPhotos = [
  '/assets/templates/love-line/67645060-cb47-11f1-8e64-a9fec9085fda.jpg',
  '/assets/templates/love-line/677a4960-cb47-11f1-8e64-a9fec9085fda.jpg',
  '/assets/templates/love-line/67946110-cb47-11f1-8e64-a9fec9085fda.jpg',
  '/assets/templates/love-line/67a83730-cb47-11f1-8e64-a9fec9085fda.jpg',
]

const effectiveGallery = computed(() => {
  if (data.value.galleryImages && data.value.galleryImages.length > 0) {
    return data.value.galleryImages
  }
  if (data.value.gallery && data.value.gallery.length > 0) {
    return data.value.gallery.map((g) => (typeof g === 'string' ? g : g.preview || g.url))
  }
  return defaultGalleryPhotos
})

const lightboxImage = ref(null)

function openLightbox(url) {
  lightboxImage.value = url
}

// Dress code swatches
const dressCodeSwatches = [
  { name: 'Charcoal', color: '#2B2B2B' },
  { name: 'Sage', color: '#7A8063' },
  { name: 'Khaki', color: '#C9B79C' },
  { name: 'Cream', color: '#E8DCCB' },
  { name: 'Terracotta', color: '#A35A4A' },
]

// Bank Accounts & Gift Delivery
const effectiveBankAccounts = computed(() => {
  if (data.value.bankAccounts && data.value.bankAccounts.length > 0) {
    return data.value.bankAccounts
  }
  return [
    { bankName: 'BCA', accountNumber: '7829104821', accountName: data.value.groomName || 'Elang Prakoso' },
    { bankName: 'Bank Mandiri', accountNumber: '137001928471', accountName: data.value.brideName || 'Laila Anindita' },
  ]
})

const effectiveGiftAddress = computed(() => {
  if (data.value.giftDeliveryAddress && Array.isArray(data.value.giftDeliveryAddress) && data.value.giftDeliveryAddress.length) {
    const first = data.value.giftDeliveryAddress[0]
    return typeof first === 'string' ? first : first.address || first.fullAddress
  }
  return data.value.giftAddress || null
})

// Extended Family
const normalizedExtendedFamily = computed(() => {
  const ef = data.value.extendedFamily
  if (Array.isArray(ef) && ef.length) return ef
  if (data.value.turutMengundang) {
    return data.value.turutMengundang
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return [
    'Keluarga Besar Bpk. Bambang Prakoso',
    'Keluarga Besar Bpk. Dedi Supriyadi',
    'Segenap Sahabat & Kerabat Tercinta',
  ]
})

// RSVP & Wishes
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const isSubmittingRsvp = ref(false)
const submittedWishes = ref([
  {
    name: 'Dimas & Sekar',
    rsvpStatus: 'hadir',
    message: 'Selamat berbahagia Elang & Laila! Semoga menjadi keluarga sakinah mawaddah warahmah selamanya.',
  },
  {
    name: 'Alifia Rahman',
    rsvpStatus: 'hadir',
    message: 'Lancar sampai hari H ya berdua, can’t wait to celebrate with you guys!',
  },
])

async function submitRSVP() {
  if (!rsvp.value.name?.trim()) {
    toast.error('Mohon isi nama kamu.')
    return
  }

  try {
    isSubmittingRsvp.value = true
    if (data.value.id && !isPreviewMode.value) {
      await createGuestMessage({
        invitationId: data.value.id,
        guestName: rsvp.value.name,
        message: rsvp.value.message,
        rsvpStatus: rsvp.value.attendance,
        totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0,
      })
    }
    submittedWishes.value.unshift({
      name: rsvp.value.name,
      rsvpStatus: rsvp.value.attendance,
      message: rsvp.value.message || 'Hadir dan mendoakan kedua mempelai.',
    })
    toast.success('Konfirmasi kamu berhasil dikirim!')
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
  } catch (err) {
    console.error('Failed to submit RSVP:', err)
    toast.error('Gagal mengirim konfirmasi. Coba lagi ya.')
  } finally {
    isSubmittingRsvp.value = false
  }
}

function copyText(val, label) {
  if (!val) return
  navigator.clipboard.writeText(val).then(
    () => toast.success(`${label} berhasil disalin!`),
    () => toast.error('Gagal menyalin teks.'),
  )
}

function saveToCalendar(title, locationObj) {
  if (!locationObj?.dateTime) return
  const start = locationObj.dateTime.replace(/-|:|\.\d\d\d/g, '')
  const end = new Date(new Date(locationObj.dateTime).getTime() + 3 * 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, '')
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${title}: ${data.value.coupleName || 'Pernikahan Elang & Laila'}`,
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    data.value.title || 'Undangan Pernikahan',
  )}&location=${encodeURIComponent(locationObj.description || 'Villa Mawar, Bogor')}`
  window.open(url, '_blank')
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:') || choice.startsWith('http') || choice.startsWith('/')) return choice
  return `/audio/${choice}`
}

function formatNumericDate(dateStr) {
  if (!dateStr) return '28.02.2028'
  const parts = getEventDateParts(dateStr)
  if (!parts) return '28.02.2028'
  const day = String(parts.day).padStart(2, '0')
  const month = String(parts.month + 1).padStart(2, '0')
  return `${day}.${month}.${parts.year}`
}

function formatTime(dateStr) {
  if (!dateStr) return '15:00'
  const d = toEventDate(dateStr)
  if (isNaN(d.getTime())) return '15:00'
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: EVENT_TIME_ZONE })
}

function formatInstagramUrl(handle) {
  const clean = cleanInstagram(handle)
  return clean ? `https://instagram.com/${clean}` : '#'
}

function cleanInstagram(handle) {
  return String(handle || '')
    .trim()
    .replace(/^@/, '')
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }
  updateCountdown()
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(updateCountdown, 1000)
}

onMounted(() => {
  initData()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Mr+Dafoe&display=swap');

.font-dafoe {
  font-family: 'Mr Dafoe', cursive;
}

.font-caveat {
  font-family: 'Caveat', cursive;
}

.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}

/* Authentic warm duotone filter matching our-wedding.link */
.duotone-photo {
  filter: url('#owduo-love-line');
  transition: filter 0.5s ease;
}

.duotone-photo:hover {
  filter: none;
}

/* Animasi: garis bergoyang seperti gambar tangan (stop-motion hand-drawn jitter) */
.gc-goyang {
  animation: gc-goyang 1.2s steps(1) infinite;
  transform-origin: 50% 80%;
}

.gc-goyang-b {
  animation-delay: -0.6s;
}

@keyframes gc-goyang {
  0% { transform: rotate(-0.5deg) translate(0, 0); }
  33% { transform: rotate(0.4deg) translate(0.5px, -0.5px); }
  66% { transform: rotate(-0.2deg) translate(-0.5px, 0.5px); }
}

/* Animasi detak jantung lembut */
.gc-denyut {
  animation: gc-denyut 1.6s ease-in-out infinite;
}

@keyframes gc-denyut {
  0%, 100% { transform: scale(1) rotate(-8deg); }
  50% { transform: scale(1.18) rotate(6deg); }
}

/* Authentic line art & flourish filters */
.line-art-charcoal {
  filter: url('#owduo-charcoal');
}

.flourish-red {
  filter: url('#owduo-red');
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
