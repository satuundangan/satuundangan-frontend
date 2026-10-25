<template>
  <div class="love-line-page min-h-screen bg-[#EFECE5] text-[#1B1B1B] font-montserrat selection:bg-[#1B1B1B] selection:text-[#F5F2EC]">

    <!-- Global SVG Duotone Filter matching our-wedding.link -->
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

    <!-- Studio / Live Preview Quick Gate Toggle Bar (Visible only in iframe / preview mode) -->
    <div
      v-if="isPreviewMode || isInsideFrame"
      class="fixed top-3 left-3 z-[80] flex items-center gap-2 bg-[#1B1B1B]/90 text-[#F5F2EC] px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider shadow-lg backdrop-blur-xs border border-white/20 select-none"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>Studio Preview</span>
      <button
        type="button"
        @click="showWelcome = !showWelcome"
        class="ml-1 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded-full text-[9px] uppercase tracking-widest transition-colors cursor-pointer"
      >
        {{ showWelcome ? 'Lihat Isi' : 'Lihat Cover' }}
      </button>
    </div>

    <!-- MAIN RESPONSIVE WRAPPER (Split 2-Column on Desktop lg: >= 1024px, Centered on Tablet/Mobile) -->
    <div class="w-full flex justify-center items-start min-h-screen">

      <!-- ==================================================================== -->
      <!-- DESKTOP STICKY SHOWCASE ASIDE (Visible on Laptop & Desktop: lg:flex) -->
      <!-- ==================================================================== -->
      <aside
        class="hidden lg:flex lg:w-1/2 xl:w-[48%] h-screen sticky top-0 flex-col justify-between p-10 xl:p-14 bg-[#EFECE5] border-r border-[#1B1B1B]/10 z-20 overflow-hidden select-none"
      >
        <!-- Top Editorial Header -->
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-montserrat uppercase tracking-[0.3em] text-[#1B1B1B]/70 font-semibold">
              The Wedding Celebration
            </span>
            <div class="w-10 opacity-70">
              <img
                src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                alt="Flourish"
                class="w-full h-auto object-contain"
              />
            </div>
          </div>

          <span class="text-[11px] font-montserrat font-bold tracking-widest text-[#1B1B1B]/80 px-3 py-1 rounded-full border border-[#1B1B1B]/20 bg-[#F5F2EC]/60">
            {{ formatNumericDate(data.akadLocation?.dateTime || data.dateTime) }}
          </span>
        </div>

        <!-- Center Couple Calligraphy & Continuous Line Illustration -->
        <div class="flex flex-col items-center text-center my-auto py-6">
          <!-- Couple Names in Mr Dafoe -->
          <div class="space-y-1 mb-4">
            <h1 class="font-dafoe text-6xl xl:text-7xl text-[#1B1B1B] leading-none">
              {{ groomFirstName }}
            </h1>
            <p class="font-dafoe text-4xl text-[#C8242C] leading-none my-1">
              &amp;
            </p>
            <h1 class="font-dafoe text-6xl xl:text-7xl text-[#1B1B1B] leading-none">
              {{ brideFirstName }}
            </h1>
          </div>

          <!-- Line Couple Illustration with Stop-Motion Wobble -->
          <div class="relative w-52 xl:w-60 my-2">
            <img
              src="/assets/templates/love-line/2297f990-c95e-11f1-bea3-415a8cc57c30.png"
              alt="Continuous Line Couple"
              class="w-full h-auto object-contain gc-goyang"
            />
            <!-- Overlapping Hand-written Caveat Accent -->
            <p class="font-caveat text-2xl xl:text-3xl text-[#1B1B1B]/90 absolute -bottom-3 -right-6 -rotate-[14deg]">
              lebih baik bersama
            </p>
          </div>
        </div>

        <!-- Bottom Venue & Countdown Panel -->
        <div class="space-y-4 pt-4 border-t border-[#1B1B1B]/10">
          <div class="flex items-center justify-between text-left">
            <div>
              <p class="text-[13px] font-montserrat font-bold text-[#1B1B1B]">
                {{ data.akadLocation?.title || 'Villa Mawar' }}
              </p>
              <p class="text-[11px] font-montserrat text-[#1B1B1B]/70 mt-0.5">
                {{ data.akadLocation?.description || 'Jl. Bukit Indah No. 8, Bogor' }}
              </p>
            </div>
            <!-- Live Countdown Mini Pill -->
            <div class="text-right">
              <span class="text-[10px] uppercase font-montserrat tracking-widest text-[#1B1B1B]/60">Hitung Mundur</span>
              <p class="text-[14px] font-montserrat font-bold text-[#1B1B1B]">
                {{ countdown.Hari }}H {{ countdown.Jam }}J {{ countdown.Menit }}M
              </p>
            </div>
          </div>

          <!-- Helpful Desktop Scroll Cue -->
          <div class="flex items-center justify-center gap-2 text-[10px] font-montserrat uppercase tracking-[0.25em] text-[#1B1B1B]/60 pt-2 animate-bounce">
            <i class="pi pi-arrow-down text-[10px]"></i>
            <span>Gulir sisi kanan untuk melihat rincian undangan</span>
          </div>
        </div>
      </aside>

      <!-- ==================================================================== -->
      <!-- RIGHT / MAIN INVITATION COLUMN (Scrollable Canvas for All Viewports) -->
      <!-- ==================================================================== -->
      <main class="w-full lg:w-1/2 xl:w-[52%] min-h-screen bg-[#EFECE5] flex justify-center overflow-x-hidden relative">

        <!-- Column Container (Responsive: 390px on mobile, max 460px on tablet/desktop) -->
        <div class="w-full max-w-[430px] sm:max-w-[460px] min-h-screen bg-[#F5F2EC] sm:my-0 lg:my-0 shadow-2xl relative overflow-x-hidden flex flex-col justify-start sm:border-x sm:border-[#1B1B1B]/10">

          <!-- ==================== COVER SCREEN (GATE / SAMPUL) ==================== -->
          <transition name="fade">
            <div
              v-if="showWelcome"
              class="fixed lg:absolute inset-0 z-[70] flex justify-center bg-[#EFECE5] lg:bg-[#F5F2EC] overflow-y-auto"
            >
              <div class="w-full max-w-[430px] sm:max-w-[460px] h-[844px] min-h-[844px] bg-[#F5F2EC] relative shadow-2xl overflow-hidden select-none">
                
                <!-- Top Eyebrow -->
                <p
                  class="font-montserrat text-[11.5px] text-[#1B1B1B]/85 tracking-[0.6px] lowercase absolute top-[138px] left-[20px] w-[350px] text-center z-10"
                >
                  kamu diundang ke pernikahan kami
                </p>

                <!-- Groom Name: Elang (Mr Dafoe, 54px, left-aligned) -->
                <h1
                  class="font-dafoe text-[54px] text-[#1B1B1B] leading-none absolute top-[156px] left-[70px] w-[300px] text-left z-10"
                >
                  {{ groomFirstName }}
                </h1>

                <!-- Ampersand: & (Mr Dafoe, 40px, red #C8242C) -->
                <p
                  class="font-dafoe text-[40px] text-[#C8242C] leading-none absolute top-[204px] left-[104px] w-[60px] text-left z-10"
                >
                  &amp;
                </p>

                <!-- Bride Name: Laila (Mr Dafoe, 54px, left-aligned) -->
                <h1
                  class="font-dafoe text-[54px] text-[#1B1B1B] leading-none absolute top-[222px] left-[128px] w-[260px] text-left z-10"
                >
                  {{ brideFirstName }}
                </h1>

                <!-- Botanical Flourish (top left of illustration) -->
                <div class="absolute top-[316px] left-[46px] w-[22px] h-[22px] z-10 pointer-events-none">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>

                <!-- Center Continuous Line Couple Illustration with Stop-Motion Wobble -->
                <div class="absolute top-[284px] left-[70px] w-[236px] h-[291px] z-[5] pointer-events-none">
                  <img
                    src="/assets/templates/love-line/2297f990-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Continuous Line Couple"
                    class="w-full h-full object-contain gc-goyang"
                  />
                </div>

                <!-- Handwritten Annotation: lebih baik bersama (Caveat 18px, rotated -16deg) -->
                <p
                  class="font-caveat text-[18px] text-[#1B1B1B]/90 leading-tight absolute top-[470px] left-[270px] w-[110px] text-left z-10 -rotate-[16deg]"
                >
                  lebih baik bersama
                </p>

                <!-- Small Botanical Flourish next to handwritten annotation -->
                <div class="absolute top-[516px] left-[322px] w-[14px] h-[14px] z-10 pointer-events-none">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>

                <!-- Guest Greeting Label -->
                <p
                  class="font-montserrat text-[10px] text-[#1B1B1B]/70 tracking-[0.6px] absolute top-[596px] left-[30px] w-[330px] text-center z-10"
                >
                  Kepada Yth. Bapak/Ibu/Saudara/i
                </p>

                <!-- Guest Name -->
                <p
                  class="font-montserrat text-[19px] font-bold text-[#1B1B1B] absolute top-[612px] left-[30px] w-[330px] text-center z-10 truncate px-4"
                >
                  {{ data.guestName || 'Tamu Undangan' }}
                </p>

                <!-- Buka Undangan Button (Authentic Pill Style) -->
                <div class="absolute top-[662px] left-0 w-full flex justify-center z-20">
                  <button
                    type="button"
                    @click="openInvitation"
                    class="gc-tombol-buka-btn inline-flex items-center justify-center gap-2.5 px-9 py-3.5 bg-[#1B1B1B] hover:bg-black text-[#F5F2EC] font-montserrat text-[11px] font-semibold tracking-[0.24em] uppercase rounded-full shadow-[0_3px_0_rgba(0,0,0,0.15),0_12px_22px_-14px_rgba(0,0,0,0.6)] hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                      <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                    </svg>
                    <span>Buka Undangan</span>
                  </button>
                </div>

              </div>
            </div>
          </transition>

          <!-- ==================== OPENED INVITATION CONTENT ==================== -->
          <div v-show="!showWelcome" class="w-full flex flex-col transition-opacity duration-1000">

            <!-- SECTION 1: PEMBUKA & AYAT (Quote) -->
            <section
              v-if="isSectionEnabled('quote')"
              id="quote"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Eyebrow -->
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
                dengan penuh syukur
              </p>

              <!-- Main Couple Photo with Duotone Filter & Flower Stamp -->
              <div class="relative mt-3.5 w-[250px] sm:w-[270px] h-[300px] sm:h-[320px] overflow-hidden bg-[#EFECE5] shadow-sm">
                <img
                  :src="data.heroImage || data.photoCoupleUrl || '/assets/templates/love-line/68257d80-cb47-11f1-8e64-a9fec9085fda.jpg'"
                  alt="Mempelai"
                  class="w-full h-full object-cover duotone-photo"
                />
                <!-- Overlapping Flower Stamp -->
                <div class="absolute -top-3 -right-3 w-[78px] h-[78px] pointer-events-none opacity-80">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>

              <!-- Description Text 1 -->
              <p class="font-montserrat text-[13px] text-[#1B1B1B] leading-[1.6] max-w-[320px] mt-4.5">
                Dengan memohon rahmat Tuhan, kami bermaksud menikah. Kehadiran dan doamu akan membuat hari itu jauh lebih bahagia.
              </p>

              <!-- Caveat Scripture / Quote -->
              <p class="font-caveat text-[17px] sm:text-[18px] text-[#1B1B1B]/90 leading-[1.35] max-w-[320px] mt-4">
                {{ data.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya, Dia menciptakan pasangan untukmu agar kamu merasa tenteram.' }}
              </p>
              <p v-if="data.quoteSource" class="font-montserrat text-[10px] text-[#1B1B1B]/60 tracking-wider uppercase mt-1">
                — {{ data.quoteSource }}
              </p>
            </section>

            <!-- SECTION 2: MEMPELAI (Couple) -->
            <section
              v-if="isSectionEnabled('couple')"
              id="couple"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Eyebrow -->
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
                dua orang, satu cerita
              </p>

              <!-- Section Heading (Rotated -4deg) -->
              <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none mt-1.5 -rotate-[4deg]">
                Mempelai
              </h2>

              <!-- GROOM BLOCK -->
              <div class="w-full flex flex-col items-center mt-3.5">
                <!-- Photo Container with Relative Badges -->
                <div class="relative w-[240px] sm:w-[260px] h-[300px] sm:h-[320px] overflow-visible my-2">
                  <img
                    :src="data.groomPhoto || data.groomPhotoUrl || '/assets/templates/love-line/684b7c10-cb47-11f1-8e64-a9fec9085fda.jpg'"
                    alt="Groom"
                    class="w-full h-full object-cover duotone-photo shadow-sm"
                  />
                  <!-- 'si dia' in Caveat (Red #C8242C, rotated -14deg) -->
                  <span class="font-caveat text-[26px] text-[#C8242C] absolute -bottom-3 -left-3 -rotate-[14deg] z-10 pointer-events-none select-none">
                    si dia
                  </span>
                  <!-- Botanical Flourish (top right) -->
                  <div class="absolute -top-4 -right-4 w-[75px] h-[75px] z-10 pointer-events-none opacity-85">
                    <img
                      src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                      alt="Flourish"
                      class="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <!-- Groom Name (Mr Dafoe, rotated -3deg) -->
                <h3 class="font-dafoe text-[38px] sm:text-[42px] text-[#1B1B1B] leading-none mt-2.5 -rotate-[3deg]">
                  {{ data.groomName || 'Elang Prakoso' }}
                </h3>

                <!-- Groom Parents -->
                <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] mt-2">
                  putra dari
                </p>
                <p class="font-montserrat text-[13px] text-[#1B1B1B] leading-relaxed mt-0.5 max-w-[280px]">
                  {{ data.parents?.groomParents || 'Bapak Bambang Prakoso & Ibu Sri Lestari' }}
                </p>

                <!-- Instagram Button -->
                <div v-if="data.socialMediaGroom?.instagram" class="mt-3.5">
                  <a
                    :href="formatInstagramUrl(data.socialMediaGroom.instagram)"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full border border-[#1B1B1B] text-[11px] font-montserrat font-medium text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
                  >
                    <i class="pi pi-instagram text-[12px]"></i>
                    <span>@{{ cleanInstagram(data.socialMediaGroom.instagram) }}</span>
                  </a>
                </div>
              </div>

              <!-- Ampersand Divider (& in Dafoe, Red #C8242C) -->
              <div class="font-dafoe text-[40px] text-[#C8242C] leading-none my-6 select-none">
                &amp;
              </div>

              <!-- BRIDE BLOCK -->
              <div class="w-full flex flex-col items-center">
                <!-- Photo Container with Relative Badges -->
                <div class="relative w-[240px] sm:w-[260px] h-[300px] sm:h-[320px] overflow-visible my-2">
                  <img
                    :src="data.bridePhoto || data.bridePhotoUrl || '/assets/templates/love-line/685f2b20-cb47-11f1-8e64-a9fec9085fda.jpg'"
                    alt="Bride"
                    class="w-full h-full object-cover duotone-photo shadow-sm"
                  />
                  <!-- 'si cantik' in Caveat (Red #C8242C, rotated 12deg) -->
                  <span class="font-caveat text-[26px] text-[#C8242C] absolute -top-3 -right-3 rotate-[12deg] z-10 pointer-events-none select-none">
                    si cantik
                  </span>
                  <!-- Botanical Flourish (bottom left) -->
                  <div class="absolute -bottom-3 -left-3 w-[56px] h-[56px] z-10 pointer-events-none opacity-85">
                    <img
                      src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                      alt="Flourish"
                      class="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <!-- Bride Name (Mr Dafoe, rotated 2deg) -->
                <h3 class="font-dafoe text-[38px] sm:text-[42px] text-[#1B1B1B] leading-none mt-2.5 rotate-[2deg]">
                  {{ data.brideName || 'Laila Anindita' }}
                </h3>

                <!-- Bride Parents -->
                <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] mt-2">
                  putri dari
                </p>
                <p class="font-montserrat text-[13px] text-[#1B1B1B] leading-relaxed mt-0.5 max-w-[280px]">
                  {{ data.parents?.brideParents || 'Bapak Dedi Supriyadi & Ibu Endang Rahayu' }}
                </p>

                <!-- Instagram Button -->
                <div v-if="data.socialMediaBrides?.instagram" class="mt-3.5">
                  <a
                    :href="formatInstagramUrl(data.socialMediaBrides.instagram)"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full border border-[#1B1B1B] text-[11px] font-montserrat font-medium text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
                  >
                    <i class="pi pi-instagram text-[12px]"></i>
                    <span>@{{ cleanInstagram(data.socialMediaBrides.instagram) }}</span>
                  </a>
                </div>
              </div>
            </section>

            <!-- SECTION 3: TANGGAL & TEMPAT (Event) -->
            <section
              v-if="isSectionEnabled('event')"
              id="event"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Eyebrow -->
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
                detail hari bahagia kami
              </p>

              <!-- Headings (Rotated -4deg) -->
              <div class="mt-2 -rotate-[4deg] space-y-0">
                <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none">
                  Tanggal
                </h2>
                <h2 class="font-dafoe text-[40px] sm:text-[44px] text-[#1B1B1B] leading-none -mt-1">
                  &amp; Tempat
                </h2>
              </div>

              <!-- Date Item -->
              <div class="flex items-center gap-4 mt-6 text-left w-full max-w-[290px]">
                <img
                  src="/assets/templates/love-line/21edd6e0-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Date Icon"
                  class="w-8 h-8 object-contain shrink-0"
                />
                <div>
                  <p class="font-montserrat text-[15px] font-semibold tracking-wider text-[#1B1B1B]">
                    {{ formatNumericDate(data.akadLocation?.dateTime || data.dateTime) }}
                  </p>
                </div>
              </div>

              <!-- Time Item -->
              <div class="flex items-center gap-4 mt-4.5 text-left w-full max-w-[290px]">
                <img
                  src="/assets/templates/love-line/21d4f7b0-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Time Icon"
                  class="w-8 h-8 object-contain shrink-0"
                />
                <div>
                  <p class="font-montserrat text-[15px] font-semibold tracking-wider text-[#1B1B1B]">
                    {{ formatTime(data.akadLocation?.dateTime || data.dateTime) }} WIB
                  </p>
                </div>
              </div>

              <!-- Place Item -->
              <div class="flex items-start gap-4 mt-4.5 text-left w-full max-w-[290px]">
                <img
                  src="/assets/templates/love-line/221e5cc0-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Location Icon"
                  class="w-8 h-8 object-contain shrink-0 mt-0.5"
                />
                <div>
                  <p class="font-montserrat text-[15px] font-semibold tracking-wider text-[#1B1B1B]">
                    {{ data.akadLocation?.title || 'Villa Mawar' }}
                  </p>
                  <p class="font-montserrat text-[12px] text-[#1B1B1B]/75 leading-relaxed mt-0.5">
                    {{ data.akadLocation?.description || 'Jl. Bukit Indah No. 8, Bogor' }}
                  </p>
                </div>
              </div>

              <!-- Countdown Boxes -->
              <div class="mt-8 w-full max-w-[320px] p-4 bg-[#EFECE5]/80 rounded-2xl border border-[#1B1B1B]/10">
                <p class="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#1B1B1B]/60 mb-3 text-center">
                  Menghitung Hari
                </p>
                <div class="grid grid-cols-4 gap-2 text-center">
                  <div v-for="(val, unit) in countdown" :key="unit" class="bg-[#F5F2EC] py-2 px-1 rounded-xl shadow-xs">
                    <span class="block font-montserrat text-xl font-bold text-[#1B1B1B]">{{ val }}</span>
                    <span class="block font-montserrat text-[9px] uppercase tracking-wider text-[#1B1B1B]/70 mt-0.5">{{ unit }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 mt-7 w-full max-w-[290px]">
                <a
                  v-if="data.akadLocation?.mapUrl"
                  :href="data.akadLocation.mapUrl"
                  target="_blank"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1B1B1B] text-[#F5F2EC] text-[11px] font-montserrat font-semibold tracking-[0.2em] uppercase rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <i class="pi pi-map-marker text-[12px]"></i>
                  <span>Buka Peta</span>
                </a>
                <button
                  type="button"
                  @click="saveToCalendar('Pernikahan', data.akadLocation)"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#1B1B1B] text-[#1B1B1B] text-[11px] font-montserrat font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-[#1B1B1B] hover:text-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
                >
                  <i class="pi pi-calendar text-[12px]"></i>
                  <span>Kalender</span>
                </button>
              </div>
            </section>

            <!-- SECTION 4: JADWAL / RUNDOWN -->
            <section
              v-if="isSectionEnabled('rundown')"
              id="rundown"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Eyebrow -->
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
                susunan acara
              </p>

              <!-- Heading with Flower Stamp -->
              <div class="relative mt-1.5 inline-block">
                <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none -rotate-[4deg]">
                  Jadwal
                </h2>
                <div class="absolute -top-1 -right-5 w-[18px] h-[18px] pointer-events-none opacity-80">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>

              <!-- Rundown Items -->
              <div class="mt-7 w-full max-w-[290px] flex flex-col items-center space-y-4">
                <div
                  v-for="(item, idx) in effectiveRundown"
                  :key="idx"
                  class="w-full flex flex-col items-center text-center"
                >
                  <p class="font-montserrat text-[16px] font-bold text-[#1B1B1B] tracking-wide">
                    {{ item.time }}
                  </p>
                  <p class="font-montserrat text-[14px] text-[#1B1B1B] mt-0.5">
                    {{ item.title }}
                  </p>
                  <!-- Authentic short horizontal divider -->
                  <div v-if="idx < effectiveRundown.length - 1" class="w-9 h-[1.5px] bg-[#1B1B1B]/80 mt-4"></div>
                </div>
              </div>
            </section>

            <!-- SECTION 5: CERITA (Zig-Zag Timeline with Stop-Motion Wobble) -->
            <section
              v-if="isSectionEnabled('love-story') && (effectiveStories.length > 0 || isPreviewMode)"
              id="story"
              class="pt-11 pb-12 px-4 sm:px-6 text-center flex flex-col items-center relative"
            >
              <!-- Eyebrow -->
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
                perjalanan kami
              </p>

              <!-- Heading with Flower Stamp -->
              <div class="relative mt-1.5 inline-block">
                <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none -rotate-[4deg]">
                  Cerita
                </h2>
                <div class="absolute -top-1 -right-5 w-[18px] h-[18px] pointer-events-none opacity-80">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>

              <!-- Zig-Zag Timeline Container -->
              <div class="mt-7 w-full relative">
                <!-- Center Vertical Line -->
                <div class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#1B1B1B]/80 z-0"></div>

                <!-- Story Items -->
                <div class="flex flex-col space-y-8 relative z-10">
                  <div
                    v-for="(story, idx) in effectiveStories"
                    :key="idx"
                    class="gc-cerita-item relative min-h-[196px] w-full"
                  >
                    <!-- Center Dot -->
                    <div class="absolute top-[54px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full bg-[#1B1B1B] z-20"></div>

                    <!-- Odd Item (idx % 2 === 0): Photo on Left, Text on Right -->
                    <div v-if="idx % 2 === 0" class="w-full h-full relative">
                      <!-- Photo on Left (136x160 with wobble animation) -->
                      <div class="absolute top-[16px] left-[16px] sm:left-[24px] w-[136px] h-[160px] gc-goyang z-10 shadow-sm bg-[#EFECE5]">
                        <img
                          :src="story.image || defaultStoryPhoto(idx)"
                          :alt="story.title"
                          class="w-full h-full object-cover duotone-photo"
                        />
                      </div>
                      <!-- Text on Right (ml-[54%], left-aligned) -->
                      <div class="ml-[54%] mr-3 sm:mr-4 pt-6 text-left">
                        <h4 class="font-caveat text-[22px] text-[#1B1B1B] leading-tight font-semibold">
                          {{ story.title }}
                        </h4>
                        <p class="font-montserrat text-[12px] text-[#1B1B1B]/85 leading-relaxed mt-1">
                          {{ story.description }}
                        </p>
                      </div>
                    </div>

                    <!-- Even Item (idx % 2 === 1): Photo on Right, Text on Left -->
                    <div v-else class="w-full h-full relative">
                      <!-- Photo on Right (136x160 with alternate wobble) -->
                      <div class="absolute top-[16px] right-[16px] sm:right-[24px] w-[136px] h-[160px] gc-goyang gc-goyang-b z-10 shadow-sm bg-[#EFECE5]">
                        <img
                          :src="story.image || defaultStoryPhoto(idx)"
                          :alt="story.title"
                          class="w-full h-full object-cover duotone-photo"
                        />
                      </div>
                      <!-- Text on Left (mr-[54%], right-aligned) -->
                      <div class="mr-[54%] ml-3 sm:ml-4 pt-6 text-right">
                        <h4 class="font-caveat text-[22px] text-[#1B1B1B] leading-tight font-semibold">
                          {{ story.title }}
                        </h4>
                        <p class="font-montserrat text-[12px] text-[#1B1B1B]/85 leading-relaxed mt-1">
                          {{ story.description }}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            <!-- SECTION 6: GALERI (Gallery) -->
            <section
              v-if="isSectionEnabled('gallery') && (effectiveGallery.length > 0 || isPreviewMode)"
              id="gallery"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Eyebrow -->
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
                momen kami
              </p>

              <!-- Heading with Flower Stamp -->
              <div class="relative mt-1.5 inline-block">
                <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none -rotate-[4deg]">
                  Galeri
                </h2>
                <div class="absolute -top-1 -right-5 w-[16px] h-[16px] pointer-events-none opacity-80">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>

              <!-- 2x2 Photo Grid with Duotone Filter & Lightbox Click -->
              <div class="mt-7 grid grid-cols-2 gap-3 w-full max-w-[340px] sm:max-w-[380px]">
                <div
                  v-for="(img, idx) in effectiveGallery.slice(0, 4)"
                  :key="idx"
                  @click="openLightbox(img)"
                  class="aspect-[4/5] overflow-hidden bg-[#EFECE5] shadow-xs cursor-pointer group rounded-xs"
                >
                  <img
                    :src="img"
                    :alt="`Galeri ${idx + 1}`"
                    class="w-full h-full object-cover duotone-photo group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </section>

            <!-- SECTION 7: DRESS CODE -->
            <section
              v-if="isSectionEnabled('dress-code')"
              id="dress-code"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Subtitle / Eyebrow -->
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 leading-relaxed max-w-[320px]">
                kehadiranmu adalah hadiah terbesar, tapi kami akan senang bila kamu berbusana dalam palet warna kami
              </p>

              <!-- Headings (Rotated -5deg) -->
              <div class="mt-4 -rotate-[5deg]">
                <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none">
                  Dress
                </h2>
                <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none -mt-2">
                  Code
                </h2>
              </div>

              <!-- Color Swatches with Labels (5 Circles matching authentic colors) -->
              <div class="flex items-center justify-center gap-3 sm:gap-4 mt-7">
                <div
                  v-for="(item, idx) in dressCodeSwatches"
                  :key="idx"
                  class="flex flex-col items-center gap-1.5"
                >
                  <div
                    class="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] rounded-full shadow-sm border border-black/10 transition-transform hover:scale-110"
                    :style="{ backgroundColor: item.color }"
                  ></div>
                  <span class="font-montserrat text-[8px] uppercase tracking-wider text-[#1B1B1B]/60">
                    {{ item.name }}
                  </span>
                </div>
              </div>

              <!-- Custom Dress Code Note from Studio -->
              <p v-if="data.dressCode" class="font-montserrat text-[12px] text-[#1B1B1B]/80 mt-4 max-w-[280px]">
                {{ data.dressCode }}
              </p>
            </section>

            <!-- SECTION: TURUT MENGUNDANG / EXTENDED FAMILY (Studio Integration) -->
            <section
              v-if="isSectionEnabled('extended-family') && (normalizedExtendedFamily.length > 0 || isPreviewMode)"
              id="family"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <p class="font-montserrat text-[11px] text-[#1B1B1B]/75 tracking-[0.6px] lowercase">
                keluarga besar
              </p>
              <div class="relative mt-1.5 inline-block">
                <h2 class="font-dafoe text-[44px] text-[#1B1B1B] leading-none -rotate-[3deg]">
                  Turut Mengundang
                </h2>
                <div class="absolute -top-1 -right-5 w-[16px] h-[16px] pointer-events-none opacity-80">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div class="mt-6 w-full max-w-[320px] p-5 bg-[#EFECE5]/60 rounded-2xl border border-[#1B1B1B]/10 space-y-2">
                <p
                  v-for="(member, idx) in normalizedExtendedFamily"
                  :key="idx"
                  class="font-montserrat text-[13px] text-[#1B1B1B] font-medium leading-relaxed"
                >
                  {{ member }}
                </p>
              </div>
            </section>

            <!-- SECTION 8: KONFIRMASI (RSVP) -->
            <section
              v-if="isSectionEnabled('rsvp')"
              id="rsvp"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Envelope Continuous Line Illustration -->
              <div class="w-full max-w-[340px] pointer-events-none mb-4">
                <img
                  src="/assets/templates/love-line/233c76f0-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Konfirmasi RSVP"
                  class="w-full h-auto object-contain"
                />
              </div>

              <!-- Heading (Rotated -4deg) -->
              <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none -rotate-[4deg]">
                Konfirmasi
              </h2>
              <p class="font-montserrat text-[12px] text-[#1B1B1B]/80 leading-relaxed max-w-[280px] mt-2">
                Kabari kami kehadiranmu lewat formulir di bawah ini, ya.
              </p>

              <!-- RSVP Form with Clean Underline Inputs -->
              <form @submit.prevent="submitRSVP" class="gc-borang mt-6 w-full max-w-[320px] text-left space-y-4">
                <!-- Guest Name -->
                <div>
                  <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    v-model="rsvp.name"
                    type="text"
                    placeholder="Tuliskan nama Anda"
                    required
                    class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-[13px] font-montserrat outline-none transition-colors"
                  />
                </div>

                <!-- Attendance -->
                <div>
                  <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                    Konfirmasi Kehadiran
                  </label>
                  <select
                    v-model="rsvp.attendance"
                    class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-[13px] font-montserrat outline-none cursor-pointer"
                  >
                    <option value="hadir" class="bg-[#F5F2EC] text-[#1B1B1B]">Ya, saya akan hadir</option>
                    <option value="tidak_hadir" class="bg-[#F5F2EC] text-[#1B1B1B]">Maaf, belum bisa hadir</option>
                  </select>
                </div>

                <!-- Total Guests -->
                <div v-if="rsvp.attendance === 'hadir'">
                  <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                    Jumlah Hadir
                  </label>
                  <select
                    v-model="rsvp.totalGuests"
                    class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-[13px] font-montserrat outline-none cursor-pointer"
                  >
                    <option :value="1" class="bg-[#F5F2EC] text-[#1B1B1B]">1 Orang</option>
                    <option :value="2" class="bg-[#F5F2EC] text-[#1B1B1B]">2 Orang</option>
                    <option :value="3" class="bg-[#F5F2EC] text-[#1B1B1B]">3 Orang</option>
                    <option :value="4" class="bg-[#F5F2EC] text-[#1B1B1B]">4 Orang</option>
                  </select>
                </div>

                <!-- Message / Wishes -->
                <div>
                  <label class="block text-[11px] font-montserrat uppercase tracking-wider text-[#1B1B1B]/70 mb-1">
                    Pesan / Doa
                  </label>
                  <textarea
                    v-model="rsvp.message"
                    rows="3"
                    placeholder="Tuliskan ucapan dan doa Anda..."
                    class="w-full bg-transparent border-0 border-b border-[#1B1B1B]/40 focus:border-[#1B1B1B] px-0 py-2 text-[13px] font-montserrat outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <div class="pt-2 text-center">
                  <button
                    type="submit"
                    :disabled="isSubmittingRsvp"
                    class="w-full py-3 bg-[#1B1B1B] text-[#F5F2EC] font-montserrat text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full shadow-md hover:bg-black active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {{ isSubmittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi' }}
                  </button>
                </div>
              </form>
            </section>

            <!-- SECTION 9: DOA & UCAPAN (Wishes) -->
            <section
              v-if="isSectionEnabled('wishes')"
              id="wishes"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Heading with Flower Stamp -->
              <div class="relative inline-block">
                <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none -rotate-[4deg]">
                  Doa &amp; Ucapan
                </h2>
                <div class="absolute -top-1 -right-5 w-[16px] h-[16px] pointer-events-none opacity-80">
                  <img
                    src="/assets/templates/love-line/21bd5100-c95e-11f1-bea3-415a8cc57c30.png"
                    alt="Flourish"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p class="font-montserrat text-[12px] text-[#1B1B1B]/80 leading-relaxed max-w-[280px] mt-2">
                Tinggalkan doa dan harapan terbaikmu untuk kami.
              </p>

              <!-- Wishes List -->
              <div class="mt-6 w-full max-w-[340px] sm:max-w-[360px] space-y-3 max-h-[380px] overflow-y-auto pr-1">
                <div
                  v-for="(item, idx) in submittedWishes"
                  :key="idx"
                  class="p-4 bg-white/60 backdrop-blur-xs rounded-[14px] border border-black/10 text-left shadow-xs"
                >
                  <div class="flex items-center justify-between">
                    <p class="font-montserrat text-[13px] font-bold text-[#1B1B1B]">
                      {{ item.name }}
                    </p>
                    <span
                      class="font-montserrat text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                      :class="item.rsvpStatus === 'hadir' ? 'bg-[#7A8063]/20 text-[#7A8063]' : 'bg-[#A35A4A]/20 text-[#A35A4A]'"
                    >
                      {{ item.rsvpStatus === 'hadir' ? 'Hadir' : 'Absen' }}
                    </span>
                  </div>
                  <p class="font-montserrat text-[12px] text-[#1B1B1B]/80 leading-relaxed mt-1.5">
                    {{ item.message }}
                  </p>
                </div>
              </div>
            </section>

            <!-- SECTION 10: TANDA KASIH (Gift) -->
            <section
              v-if="isSectionEnabled('gift')"
              id="gift"
              class="pt-11 pb-12 px-6 sm:px-8 text-center flex flex-col items-center relative"
            >
              <!-- Heading (Rotated -4deg) -->
              <h2 class="font-dafoe text-[48px] sm:text-[52px] text-[#1B1B1B] leading-none -rotate-[4deg]">
                Tanda Kasih
              </h2>
              <p class="font-montserrat text-[12px] text-[#1B1B1B]/80 leading-relaxed max-w-[310px] mt-2">
                Doa restumu sudah lebih dari cukup. Bila ingin memberi lebih, kami menerimanya dengan penuh syukur.
              </p>

              <!-- Bank Account Cards -->
              <div class="mt-6 w-full max-w-[320px] space-y-3">
                <div
                  v-for="(acc, idx) in effectiveBankAccounts"
                  :key="idx"
                  class="p-4 bg-white/60 rounded-[14px] border border-black/10 text-left flex items-center justify-between shadow-xs"
                >
                  <div>
                    <p class="font-montserrat text-[11px] font-bold uppercase tracking-wider text-[#1B1B1B]">
                      {{ acc.bankName }}
                    </p>
                    <p class="font-montserrat text-[14px] font-semibold text-[#1B1B1B] tracking-wider mt-0.5">
                      {{ acc.accountNumber }}
                    </p>
                    <p class="font-montserrat text-[11px] text-[#1B1B1B]/70 mt-0.5">
                      a.n {{ acc.accountName }}
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="copyText(acc.accountNumber, acc.bankName)"
                    class="px-3.5 py-1.5 bg-[#1B1B1B] hover:bg-black text-[#F5F2EC] text-[10px] font-montserrat font-semibold uppercase tracking-wider rounded-full active:scale-95 transition-all cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <!-- Gift Delivery Address from Studio (if available) -->
              <div
                v-if="effectiveGiftAddress"
                class="mt-4 p-4 bg-white/60 rounded-[14px] border border-black/10 text-left w-full max-w-[320px] shadow-xs"
              >
                <div class="flex items-center gap-2 mb-1">
                  <i class="pi pi-box text-[#1B1B1B] text-xs"></i>
                  <span class="font-montserrat text-[11px] font-bold uppercase tracking-wider text-[#1B1B1B]">
                    Kirim Kado Fisik
                  </span>
                </div>
                <p class="font-montserrat text-[12px] text-[#1B1B1B]/80 leading-relaxed">
                  {{ effectiveGiftAddress }}
                </p>
                <button
                  type="button"
                  @click="copyText(effectiveGiftAddress, 'Alamat pengiriman kado')"
                  class="mt-2.5 inline-block text-[10px] font-montserrat font-semibold uppercase tracking-wider text-[#1B1B1B] underline hover:opacity-75 cursor-pointer"
                >
                  Salin Alamat
                </button>
              </div>
            </section>

            <!-- SECTION 11: PENUTUP (Closing) -->
            <section class="pt-11 pb-16 px-6 sm:px-8 text-center flex flex-col items-center relative">
              <!-- Hands Line Art Illustration -->
              <div class="w-full max-w-[200px] pointer-events-none mb-4">
                <img
                  src="/assets/templates/love-line/21299c80-c95e-11f1-bea3-415a8cc57c30.png"
                  alt="Penutup"
                  class="w-full h-auto object-contain"
                />
              </div>

              <p class="font-montserrat text-[13px] text-[#1B1B1B] leading-relaxed max-w-[300px]">
                Terima kasih sudah jadi bagian dari cerita kami. Sampai jumpa di hari bahagia!
              </p>

              <!-- Couple Signatures in Dafoe Calligraphy -->
              <div class="mt-6 space-y-0 text-center">
                <h3 class="font-dafoe text-[44px] sm:text-[48px] text-[#1B1B1B] leading-none -rotate-[3deg]">
                  {{ groomFirstName }}
                </h3>
                <p class="font-dafoe text-[32px] sm:text-[36px] text-[#C8242C] leading-none -mt-1">
                  &amp;
                </p>
                <h3 class="font-dafoe text-[44px] sm:text-[48px] text-[#1B1B1B] leading-none rotate-[2deg] -mt-1">
                  {{ brideFirstName }}
                </h3>
              </div>

              <!-- SatuUndangan Watermark Badge -->
              <div class="mt-12">
                <WatermarkBadge />
              </div>
            </section>

          </div>

        </div>

      </main>

    </div>

    <!-- ==================== INTERACTIVE GALLERY LIGHTBOX MODAL ==================== -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="lightboxImage"
          class="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="lightboxImage = null"
        >
          <div class="relative max-w-lg w-full flex flex-col items-center">
            <button
              type="button"
              @click="lightboxImage = null"
              class="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition-all cursor-pointer"
            >
              <i class="pi pi-times"></i>
            </button>
            <img
              :src="lightboxImage"
              alt="Galeri Lightbox"
              class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
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
    data.value = { ...newVal }
    initData()
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

  // Backend format: [{ key: 'couple', isEnabled: true }]
  if (sections.length > 0 && typeof sections[0] === 'object') {
    const target = sections.find((s) => s.key === key || s.section?.key === key)
    if (target) return target.isEnabled !== false
  }

  // Canonical Studio alias mapping
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

// Cover Screen Gate
const showWelcome = ref(true)

function openInvitation() {
  showWelcome.value = false
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
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '28.02.2028'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

function formatTime(dateStr) {
  if (!dateStr) return '15:00'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '15:00'
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
