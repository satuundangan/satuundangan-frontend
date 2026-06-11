<template>
  <div
    class="relative h-screen bg-[#022b1d] overflow-hidden font-sans font-montserrat text-[#e0e0e0] selection:bg-[#d4af37] selection:text-[#022b1d]"
  >
    <!-- Ultra-Smooth Gold Particle Canvas -->
    <canvas ref="particleCanvas" class="fixed inset-0 pointer-events-none z-0 opacity-60"></canvas>

    <!-- Subtle Texture Overlay -->
    <div
      class="fixed inset-0 opacity-20 mix-blend-overlay pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"
    ></div>

    <!-- Elegant Inner Frame (Addresses "Too Empty") -->
    <div
      class="fixed inset-4 md:inset-8 border border-[#d4af37]/15 rounded-[2rem] md:rounded-[4rem] pointer-events-none z-[2]"
    ></div>

    <!-- Botanical Line Art Overlay (Animated & Refined for "Simpler" look) -->
    <img
      src="/assets/images/royal-emerald-floral-overlay.png"
      alt=""
      aria-hidden="true"
      class="fixed inset-0 z-[1] w-full h-full object-cover pointer-events-none opacity-40 animate-slow-float [filter:brightness(1.2)_contrast(1.1)]"
    />

    <!-- Music Control -->
    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      primaryColor="#022b1d"
      accentColor="#d4af37"
    />

    <!-- Bottom Navigation (Refined Glassmorphism) -->
    <nav
      v-if="isOpened"
      class="fixed bottom-0 left-0 right-0 z-[80] bg-[#043927]/60 backdrop-blur-xl border-t border-[#d4af37]/30 rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.4)] animate-fade-in flex overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center justify-center gap-5 px-5 py-3 mx-auto min-w-max">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex flex-col items-center gap-1 transition-all duration-300 relative group min-w-[42px] shrink-0"
          :class="
            activeSection === item.id
              ? 'text-[#d4af37] scale-110'
              : 'text-white/30 hover:text-white/60'
          "
        >
          <i :class="[item.icon, 'text-lg md:text-xl']"></i>
          <span class="text-[6px] font-black uppercase tracking-tighter">{{ item.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade-welcome">
      <div
        v-if="!isOpened"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#022b1d] text-center px-6"
      >
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div
            class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 rounded-full blur-[120px] animate-pulse-slow"
          ></div>
          <div
            class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 rounded-full blur-[120px] animate-pulse-slow"
            style="animation-delay: 2s"
          ></div>
        </div>
        <div
          class="absolute inset-4 md:inset-8 pointer-events-none border border-[#d4af37]/20 rounded-[3rem] md:rounded-[5rem] m-2 md:m-4 overflow-hidden"
        >
        </div>
        <div
          class="relative z-10 w-full max-w-xl flex flex-col items-center justify-center space-y-12 md:space-y-16 py-10"
        >
          <div class="space-y-4 animate-fade-in">
            <p class="text-[10px] md:text-xs tracking-[0.8em] text-[#d4af37] font-black uppercase">
              The Wedding Of
            </p>
            <div
              class="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"
            ></div>
          </div>
          <div class="space-y-6 md:space-y-8 animate-fade-in-up" style="animation-delay: 0.3s">
            <h1
              class="text-6xl md:text-[8rem] font-alex text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              {{ data.groomName?.split(' ')[1] || data.groomName || 'Pria' }}
              <span class="text-3xl md:text-5xl font-serif italic text-[#d4af37]/80">&</span>
              {{ data.brideName?.split(' ')[1] || data.brideName || 'Wanita' }}
            </h1>
            <p
              class="text-lg md:text-2xl font-cormorant tracking-[0.3em] text-white/70 font-light uppercase"
            >
              {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
            </p>
          </div>
          <div class="w-full space-y-10 animate-fade-in-up" style="animation-delay: 0.6s">
            <div class="space-y-3">
              <p
                class="text-[9px] md:text-[10px] text-[#d4af37]/60 uppercase tracking-[0.5em] font-black"
              >
                Yth. Bapak/Ibu/Saudara/i
              </p>
              <h3
                class="text-2xl md:text-4xl font-serif font-black text-white tracking-tight drop-shadow-md px-4 truncate"
              >
                {{ data.guestName }}
              </h3>
            </div>
            <button
              @click="openInvitation"
              class="group relative z-[110] w-full max-w-[280px] mx-auto py-5 md:py-6 bg-gradient-to-r from-[#d4af37] via-[#f1c40f] to-[#d4af37] bg-[length:200%_auto] animate-gradient-gold text-[#022b1d] font-black rounded-full transition-all transform hover:scale-[1.05] active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-4 text-xs md:text-sm uppercase tracking-[0.3em] cursor-pointer"
            >
              <i
                class="fa-solid fa-envelope-open-text text-xl transition-transform group-hover:-rotate-12"
              ></i>
              <span>Buka Undangan</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div
      v-if="isOpened"
      id="main-content"
      class="opacity-0 transition-opacity duration-[1500ms] h-full overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth"
    >
      <div class="relative w-full bg-[#022b1d] min-h-screen">
        <!-- Watermark Background -->
        <div
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen opacity-[0.03]"
        >
          <h1 class="text-[50vh] font-alex text-[#d4af37] leading-none whitespace-nowrap">
            {{ data.groomName?.[0] }} & {{ data.brideName?.[0] }}
          </h1>
        </div>

        <!-- 1. HERO SECTION -->
        <section
          id="home"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 text-center px-6 overflow-hidden"
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-70 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0 transform rotate-180"
          >
          </div>

          <div
            class="absolute inset-0 bg-gradient-to-b from-[#022b1d] via-transparent to-[#022b1d]"
          ></div>
          <div class="relative z-10 w-full max-w-5xl mx-auto space-y-10" v-observe>
            <div class="relative mx-auto w-56 h-[22rem] md:w-80 md:h-[32rem]">
              <!-- Double Frame Effect -->
              <div
                class="absolute -inset-4 border border-[#d4af37]/10 rounded-t-[12rem] rounded-b-[4rem] hidden md:block"
              ></div>
              <div
                class="absolute inset-0 border border-[#d4af37]/30 rounded-t-full rounded-b-3xl translate-x-3 translate-y-3"
              ></div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#043927] to-[#022b1d] rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#d4af37]/50 shadow-3xl flex items-end justify-center"
              >
                <img
                  :src="data.photoCoupleUrl || illustrationUrl"
                  class="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div class="space-y-4">
              <p
                class="text-[8px] md:text-[10px] tracking-[0.8em] uppercase text-[#d4af37] font-black"
              >
                {{ data.heroLabel || 'The Halal Journey Of' }}
              </p>
              <h1 class="text-5xl md:text-[8rem] font-alex text-white leading-none drop-shadow-2xl">
                {{ data.groomName?.split(' ')[1] || data.groomName || 'Pria' }}
                <span class="text-2xl md:text-4xl font-cormorant italic text-[#d4af37]/80">&</span>
                {{ data.brideName?.split(' ')[1] || data.brideName || 'Wanita' }}
              </h1>
            </div>
            <div class="flex flex-col items-center gap-4">
              <div class="flex items-center justify-center gap-3 opacity-80">
                <div
                  class="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#d4af37]"
                ></div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-[#d4af37] animate-spin-slow w-4 h-4 md:w-6 md:h-6"
                >
                  <path
                    d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
                    fill="currentColor"
                  />
                </svg>
                <div
                  class="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-[#d4af37]"
                ></div>
              </div>
              <p
                class="text-lg md:text-3xl font-cormorant tracking-[0.3em] text-white/90 font-light uppercase mt-2"
              >
                {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
              </p>
            </div>
          </div>
        </section>

        <!-- 2. QUOTE SECTION -->
        <section
          v-if="isSectionEnabled('quote')"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 text-center px-8 bg-[#011a12] border-y border-[#d4af37]/10"
          v-observe
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-80 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-40 z-0 transform rotate-180"
          >
          </div>

          <div class="max-w-4xl mx-auto space-y-10">
            <i class="fa-solid fa-quote-left text-3xl md:text-5xl text-[#d4af37] opacity-20"></i>
            <p
              class="text-base md:text-2xl text-white/90 italic leading-relaxed font-serif px-2 md:px-12 drop-shadow-lg"
            >
              "{{ data.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.' }}"
            </p>
            <div class="flex flex-col items-center gap-4">
              <div class="h-10 md:h-16 w-[1px] bg-[#d4af37]/40"></div>
              <p class="text-[10px] md:text-sm font-black text-[#d4af37] tracking-[0.3em] uppercase">
                {{ data.quoteSource || 'QS. AR-RUM: 21' }}
              </p>
            </div>
          </div>
        </section>

        <!-- 3. GROOM SECTION -->
        <section
          v-if="isSectionEnabled('couple')"
          id="couple"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 text-center px-6 bg-[#022b1d]"
          v-observe
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-70 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0 transform rotate-180"
          >
          </div>

          <div class="w-full max-w-4xl flex flex-col items-center space-y-8 md:space-y-8">
            <div class="w-56 h-[20rem] md:w-64 md:h-[22rem] relative">
              <div
                class="absolute -inset-4 border border-[#d4af37]/10 rounded-t-[12rem] rounded-b-[3rem] hidden md:block"
              ></div>
              <div
                class="absolute inset-0 border border-[#d4af37]/30 rounded-t-full rounded-b-3xl -translate-x-3 translate-y-3"
              ></div>
              <div
                class="w-full h-full bg-gradient-to-t from-[#043927] to-[#022b1d] rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#d4af37]/50 shadow-2xl flex items-end justify-center"
              >
                <img
                  :src="data.groomPhotoUrl || illustrationUrl"
                  class="w-full h-full object-cover object-top scale-x-[-1]"
                />
                <!-- Sparkles -->
                <div class="absolute inset-0 z-20 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="absolute top-1/4 right-1/4 text-[#d4af37] animate-pulse-slow"
                  >
                    <path
                      d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="absolute top-1/2 left-1/4 text-[#d4af37] animate-ping-slow"
                  >
                    <path
                      d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <p class="text-[#d4af37] font-black tracking-[0.4em] uppercase text-[9px]">The Groom</p>
              <h3 class="text-4xl md:text-6xl font-alex text-white">{{ data.groomName }}</h3>
              <p class="text-white/50 text-sm md:text-xl font-serif italic">
                Putra ke-{{ data.groomOrder || 'dua' }} dari:
              </p>
              <p class="text-white text-lg md:text-2xl font-bold tracking-tight px-4">
                {{ data.parents?.groomParents }}
              </p>
            </div>
          </div>
        </section>

        <!-- 4. BRIDE SECTION -->
        <section
          v-if="isSectionEnabled('couple')"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 text-center px-6 bg-[#022b1d]"
          v-observe
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-80 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-60 z-0 transform rotate-180"
          >
          </div>

          <div class="w-full max-w-4xl flex flex-col items-center space-y-8 md:space-y-8">
            <div class="w-56 h-[20rem] md:w-64 md:h-[22rem] relative">
              <div
                class="absolute inset-0 border border-[#d4af37]/30 rounded-t-[10rem] rounded-b-[2rem] translate-x-3 translate-y-3"
              ></div>
              <div
                class="w-full h-full bg-[#043927] rounded-t-[10rem] rounded-b-[2rem] overflow-hidden border border-[#d4af37]/50 shadow-3xl flex items-end justify-center"
              >
                <img
                  :src="data.bridePhotoUrl || illustrationUrl"
                  class="w-full h-full object-cover object-top"
                />
                <!-- Sparkles -->
                <div class="absolute inset-0 z-20 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="absolute top-1/4 left-1/4 text-[#d4af37] animate-pulse-slow"
                  >
                    <path
                      d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="absolute top-1/2 right-1/4 text-[#d4af37] animate-ping-slow"
                  >
                    <path
                      d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <p class="text-[#d4af37] font-black tracking-[0.4em] uppercase text-[9px]">The Bride</p>
              <h3 class="text-4xl md:text-6xl font-alex text-white">{{ data.brideName }}</h3>
              <p class="text-white/50 text-sm md:text-xl font-serif italic">
                Putri ke-{{ data.brideOrder || 'dua' }} dari:
              </p>
              <p class="text-white text-lg md:text-2xl font-bold tracking-tight px-4">
                {{ data.parents?.brideParents }}
              </p>
            </div>
          </div>
        </section>

        <!-- 5. LOVE STORY SECTION -->
        <section
          v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)"
          id="story"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 bg-[#022b1d] px-6"
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-70 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0 transform rotate-180"
          >
          </div>

          <div class="max-w-4xl mx-auto w-full space-y-10">
            <div class="text-center space-y-3" v-observe>
              <h2 class="text-4xl md:text-6xl font-alex text-[#d4af37]">Our Chapter</h2>
              <p class="text-[8px] md:text-xs uppercase tracking-[0.5em] text-white/30">
                Journey to Eternity
              </p>
            </div>
            <div class="space-y-6 h-[60vh] overflow-y-auto no-scrollbar py-4 px-2" v-observe>
              <div
                v-for="(story, idx) in data.loveStory?.length ? data.loveStory : mockStories"
                :key="idx"
                class="bg-white/5 p-6 rounded-[2rem] border border-[#d4af37]/20 shadow-xl transition-all"
              >
                <div class="text-[#d4af37] font-black text-[9px] uppercase tracking-widest mb-1">
                  {{ story.date }}
                </div>
                <h3 class="text-lg md:text-2xl font-serif font-bold text-white mb-2">
                  {{ story.title }}
                </h3>
                <p class="text-white/60 text-xs md:text-sm leading-relaxed font-light">
                  {{ story.description }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. UNIFIED EVENT SECTION (Performance Optimized) -->
        <section
          v-if="isSectionEnabled('event')"
          id="event"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 px-4 bg-[#011a12] overflow-hidden"
          v-observe
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-80 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-40 z-0 transform rotate-180"
          >
          </div>

          <!-- Cinematic Infinity Backdrop -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-b from-[#022b1d] via-[#011a12] to-[#022b1d]"
            ></div>
            <!-- Golden Snowfall Magic -->
            <div class="absolute inset-0 w-full h-full opacity-60">
              <div
                class="absolute top-[-10%] left-[10%] w-2 h-2 bg-[#ffffff] rounded-full blur-[1px] animate-snow-1"
              ></div>
              <div
                class="absolute top-[-10%] left-[30%] w-3 h-3 bg-[#d4af37] rounded-full blur-[2px] animate-snow-2"
              ></div>
              <div
                class="absolute top-[-10%] left-[50%] w-1.5 h-1.5 bg-[#ffffff] rounded-full animate-snow-3"
              ></div>
              <div
                class="absolute top-[-10%] left-[70%] w-4 h-4 bg-[#d4af37] rounded-full blur-[3px] animate-snow-1"
                style="animation-delay: 2s"
              ></div>
              <div
                class="absolute top-[-10%] left-[90%] w-2 h-2 bg-[#ffffff] rounded-full animate-snow-2"
                style="animation-delay: 4s"
              ></div>
              <div
                class="absolute top-[-10%] left-[20%] w-2.5 h-2.5 bg-[#d4af37] rounded-full blur-[1px] animate-snow-3"
                style="animation-delay: 1.5s"
              ></div>
              <div
                class="absolute top-[-10%] left-[60%] w-2 h-2 bg-[#ffffff] rounded-full animate-snow-1"
                style="animation-delay: 3s"
              ></div>
              <div
                class="absolute top-[-10%] left-[80%] w-3 h-3 bg-[#d4af37] rounded-full blur-[2px] animate-snow-2"
                style="animation-delay: 5s"
              ></div>
            </div>
          </div>

          <div
            class="relative z-10 max-w-5xl w-full flex flex-col items-center space-y-4 md:space-y-4 h-full justify-center max-h-screen py-8 md:py-8"
          >
            <div class="text-center space-y-1 md:space-y-2">
              <p
                class="text-[8px] md:text-xs tracking-[0.8em] text-[#d4af37] font-black uppercase opacity-60"
              >
                {{ data.eventLabel || 'The Halal Rituals' }}
              </p>
              <h2 class="text-4xl md:text-[5rem] font-alex text-white leading-none">Acara Bahagia</h2>
              <div class="flex items-center gap-4 justify-center pt-1">
                <div class="h-[1px] w-8 md:w-10 bg-[#d4af37]/30"></div>
                <i class="fa-solid fa-moon text-[#d4af37]/40 text-[10px] md:text-xs"></i>
                <div class="h-[1px] w-8 md:w-10 bg-[#d4af37]/30"></div>
              </div>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-2 max-w-[360px] md:max-w-none mx-auto"
            >
              <!-- Akad Nikah Card (Horizontal Mobile) -->
              <div
                class="bg-[#022b1d] p-5 md:p-6 rounded-[2rem] md:rounded-[2rem] border border-[#d4af37]/20 shadow-xl flex flex-col space-y-3 md:space-y-8"
              >
                <div class="flex items-center md:flex-col gap-4 md:gap-6">
                  <div
                    class="w-12 h-12 md:w-20 md:h-20 bg-[#043927] rounded-full border border-[#d4af37]/30 flex flex-shrink-0 items-center justify-center"
                  >
                    <i :class="`fa-solid ${data.akadIcon || 'fa-kaaba'} text-xl md:text-4xl text-[#d4af37]`"></i>
                  </div>
                  <div class="flex-1 text-left md:text-center space-y-1 md:space-y-3">
                    <h3
                      class="text-xl md:text-4xl font-serif font-black text-white uppercase tracking-[0.1em]"
                    >
                      Akad Nikah
                    </h3>
                    <div class="flex items-center gap-2 md:flex-col md:gap-1">
                      <p class="text-white font-bold text-[11px] md:text-2xl">
                        {{ formatDate(data.akadLocation?.dateTime) }}
                      </p>
                      <span class="text-[#d4af37] md:hidden">|</span>
                      <p class="text-[#d4af37] text-[10px] md:text-lg font-black tracking-widest">
                        {{ formatTime(data.akadLocation?.dateTime) }} WIB
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  class="text-white/60 text-[9px] md:text-sm leading-relaxed font-light italic line-clamp-2 md:line-clamp-none text-left md:text-center"
                >
                  {{ data.akadLocation?.description }}
                </p>
                <div class="pt-1 md:pt-4">
                  <a
                    :href="data.akadLocation?.mapUrl"
                    target="_blank"
                    class="flex md:inline-flex justify-center items-center gap-2 w-full px-4 py-2.5 md:px-10 md:py-4 bg-[#d4af37] text-[#022b1d] rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-transform"
                  >
                    <i class="fa-solid fa-location-dot"></i> Google Maps
                  </a>
                </div>
              </div>

              <!-- Resepsi Card (Horizontal Mobile) -->
              <div
                class="bg-[#022b1d] p-5 md:p-6 rounded-[2rem] md:rounded-[2rem] border border-[#d4af37]/20 shadow-xl flex flex-col space-y-3 md:space-y-8"
              >
                <div class="flex items-center md:flex-col gap-4 md:gap-6">
                  <div
                    class="w-12 h-12 md:w-20 md:h-20 bg-[#043927] rounded-full border border-[#d4af37]/30 flex flex-shrink-0 items-center justify-center"
                  >
                    <i class="fa-solid fa-champagne-glasses text-xl md:text-4xl text-[#d4af37]"></i>
                  </div>
                  <div class="flex-1 text-left md:text-center space-y-1 md:space-y-3">
                    <h3
                      class="text-xl md:text-4xl font-serif font-black text-white uppercase tracking-[0.1em]"
                    >
                      Resepsi
                    </h3>
                    <div class="flex items-center gap-2 md:flex-col md:gap-1">
                      <p class="text-white font-bold text-[11px] md:text-2xl">
                        {{ formatDate(data.resepsiLocation?.dateTime) }}
                      </p>
                      <span class="text-[#d4af37] md:hidden">|</span>
                      <p class="text-[#d4af37] text-[10px] md:text-lg font-black tracking-widest">
                        08:00 - 20:00 WIB
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  class="text-white/60 text-[9px] md:text-sm leading-relaxed font-light italic line-clamp-2 md:line-clamp-none text-left md:text-center"
                >
                  {{ data.resepsiLocation?.description }}
                </p>
                <div class="pt-1 md:pt-4">
                  <a
                    :href="data.resepsiLocation?.mapUrl"
                    target="_blank"
                    class="flex md:inline-flex justify-center items-center gap-2 w-full px-4 py-2.5 md:px-10 md:py-4 border-2 border-[#d4af37] text-[#d4af37] rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    <i class="fa-solid fa-map-pin"></i> Lihat Lokasi
                  </a>
                </div>
              </div>
            </div>

            <div
              v-if="data.dressCode"
              class="mt-2 text-center bg-[#022b1d] px-8 py-3 md:px-12 md:py-6 rounded-2xl md:rounded-[2rem] border border-[#d4af37]/20 shadow-lg relative overflow-hidden w-full max-w-[360px] md:max-w-none mx-auto"
            >
              <p
                class="text-[#d4af37] text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-1 relative z-10"
              >
                The Dress Code
              </p>
              <p class="text-white font-serif italic text-xs md:text-2xl tracking-wide relative z-10">
                "{{ data.dressCode }}"
              </p>
            </div>
          </div>
        </section>

        <!-- 7. GALLERY SECTION -->
        <section
          v-if="isSectionEnabled('gallery') && galleryImages.length"
          id="gallery"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 px-6 bg-[#022b1d] overflow-hidden"
          v-observe
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-70 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0 transform rotate-180"
          >
          </div>

          <div class="max-w-4xl mx-auto w-full space-y-10 relative z-10">
            <div class="text-center space-y-3" v-observe>
              <h2 class="text-4xl md:text-6xl font-alex text-[#d4af37]">Our Moments</h2>
              <p class="text-[8px] md:text-xs uppercase tracking-[0.5em] text-white/30">
                Captured Memories
              </p>
            </div>
            <div
              class="bg-white/5 p-4 md:p-8 rounded-[2rem] border border-[#d4af37]/20 shadow-xl"
              v-observe
            >
              <GalleryInvitation :items="galleryImages" />
            </div>
          </div>
        </section>

        <!-- 8. GIFT SECTION -->
        <section
          v-if="isSectionEnabled('gift')"
          id="gift"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 px-4 bg-[#011a12] overflow-hidden"
          v-observe
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-70 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0 transform rotate-180"
          >
          </div>

          <div
            class="max-w-4xl mx-auto w-full space-y-4 md:space-y-10 overflow-y-auto no-scrollbar max-h-[90vh] py-6"
          >
            <div class="text-center space-y-2">
              <h2 class="text-3xl md:text-7xl font-alex text-[#d4af37]">Wedding Gift</h2>
              <p class="text-white/50 text-[8px] md:text-sm font-light italic max-w-xs mx-auto">
                Tanda kasih dapat dikirim melalui:
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div
                v-for="(bank, index) in data.bankAccounts"
                :key="index"
                class="bg-white/[0.04] p-5 md:p-8 rounded-[2rem] border border-[#d4af37]/20 text-center space-y-2"
              >
                <p
                  class="text-[#d4af37] text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em]"
                >
                  {{ bank.bankName }}
                </p>
                <p class="text-base md:text-3xl font-bold text-white tracking-widest">
                  {{ bank.accountNumber }}
                </p>
                <p class="text-white/60 text-[7px] md:text-[9px] uppercase font-bold">
                  A.N {{ bank.accountName }}
                </p>
                <button
                  @click="copyToClipboard(bank.accountNumber)"
                  class="px-4 py-1.5 bg-white/5 border border-[#d4af37]/30 rounded-lg text-[7px] md:text-[9px] text-[#d4af37] font-black uppercase"
                >
                  Salin No. Rekening
                </button>
              </div>
            </div>
            <div
              v-if="data.giftDeliveryAddress"
              class="p-5 md:p-8 bg-white/[0.02] border border-[#d4af37]/10 rounded-[2rem] text-center space-y-3"
            >
              <h3
                class="text-sm md:text-2xl font-serif font-black text-white uppercase tracking-widest"
              >
                Kirim Kado Fisik
              </h3>
              <p
                class="text-white/60 text-[9px] md:text-base leading-relaxed italic line-clamp-2 px-2"
              >
                "{{
                  Array.isArray(data.giftDeliveryAddress)
                    ? data.giftDeliveryAddress[0]
                    : data.giftDeliveryAddress
                }}"
              </p>
              <button
                @click="
                  copyToClipboard(
                    Array.isArray(data.giftDeliveryAddress)
                      ? data.giftDeliveryAddress[0]
                      : data.giftDeliveryAddress,
                  )
                "
                class="inline-flex items-center gap-2 px-6 py-2 border border-[#d4af37]/30 rounded-full text-[8px] md:text-[10px] font-black text-[#d4af37] uppercase"
              >
                Salin Alamat
              </button>
            </div>
          </div>
        </section>

        <!-- 9. RSVP & WISHES -->
        <section
          v-if="isSectionEnabled('rsvp')"
          id="rsvp"
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 px-6 bg-[#022b1d]"
        >
          <!-- Floral Corner Top Left -->
          <div
            class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-80 z-0"
          >
          </div>
          <!-- Floral Corner Bottom Right -->
          <div
            class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-60 z-0 transform rotate-180"
          >
          </div>

          <div
            class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center"
          >
            <div class="space-y-4 md:space-y-8 text-center lg:text-left" v-observe>
              <h2 class="text-5xl md:text-8xl font-alex text-[#d4af37] leading-none">
                RSVP <br />
                <span class="text-white">& Wishes</span>
              </h2>
              <p
                class="text-white/60 text-xs md:text-xl font-light max-w-xs md:max-w-md mx-auto lg:mx-0"
              >
                Mohon konfirmasikan kehadiran Anda.
              </p>
            </div>
            <div
              class="bg-white/[0.03] p-4 md:p-8 rounded-2xl md:rounded-3xl border border-[#d4af37]/30 shadow-3xl overflow-hidden h-[55vh] md:h-[62vh] flex flex-col"
              v-observe
            >
              <form @submit.prevent="submitRSVP" class="space-y-2 md:space-y-4 flex-shrink-0">
                <div class="grid grid-cols-2 gap-2 md:gap-4">
                  <div class="space-y-1">
                    <label
                      class="text-[8px] md:text-[10px] uppercase tracking-widest text-[#d4af37] font-black"
                      >Nama</label
                    >
                    <input
                      v-model="rsvp.name"
                      type="text"
                      class="w-full bg-[#043927] border border-[#d4af37]/20 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white text-xs md:text-sm outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label
                      class="text-[8px] md:text-[10px] uppercase tracking-widest text-[#d4af37] font-black"
                      >Hadir?</label
                    >
                    <select
                      v-model="rsvp.attendance"
                      class="w-full bg-[#043927] border border-[#d4af37]/20 rounded-lg px-2 py-2 md:px-4 md:py-3 text-white text-xs md:text-sm outline-none"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak">Absen</option>
                    </select>
                  </div>
                </div>
                <div v-if="rsvp.attendance === 'hadir'" class="space-y-1">
                  <label
                    class="text-[8px] md:text-[10px] uppercase tracking-widest text-[#d4af37] font-black"
                    >Jumlah Tamu</label
                  >
                  <input
                    v-model.number="rsvp.totalGuests"
                    type="number"
                    min="1"
                    max="20"
                    class="w-full bg-[#043927] border border-[#d4af37]/20 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white text-xs md:text-sm outline-none"
                  />
                </div>
                <div class="space-y-1">
                  <label
                    class="text-[8px] md:text-[10px] uppercase tracking-widest text-[#d4af37] font-black"
                    >Ucapan</label
                  >
                  <textarea
                    v-model="rsvp.message"
                    class="w-full bg-[#043927] border border-[#d4af37]/20 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white text-xs md:text-sm h-12 md:h-20 outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="w-full py-2 md:py-3 bg-[#d4af37] text-[#022b1d] rounded-lg font-black uppercase text-[9px] md:text-[11px] shadow-xl hover:scale-[1.02] transition-all"
                >
                  Kirim
                </button>
              </form>
              <div
                class="mt-3 md:mt-4 space-y-2 md:space-y-3 overflow-y-auto no-scrollbar flex-1 pt-3 md:pt-4 border-t border-white/5"
              >
                <div
                  v-for="(msg, i) in guestMessages"
                  :key="i"
                  class="bg-white/[0.04] p-2.5 md:p-4 rounded-xl border border-white/5"
                >
                  <div class="flex justify-between items-start gap-2">
                    <h4 class="text-[10px] md:text-sm font-bold text-white leading-tight">{{ msg.guestName }}</h4>
                    <span class="text-[6px] md:text-[9px] text-[#d4af37] shrink-0">{{
                      timeAgo(msg.createdAt)
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="text-[6px] md:text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                      :class="msg.rsvpStatus === 'hadir' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'"
                    >{{ msg.rsvpStatus === 'hadir' ? '✓ Hadir' : '✗ Absen' }}</span>
                    <span v-if="msg.rsvpStatus === 'hadir' && msg.totalGuests > 0" class="text-[6px] md:text-[8px] text-white/40">{{ msg.totalGuests }} orang</span>
                  </div>
                  <p
                    class="text-[9px] md:text-xs text-white/60 leading-relaxed line-clamp-2 mt-1"
                  >
                    {{ msg.message ? `"${msg.message}"` : '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 10. FOOTER -->
        <footer
          class="snap-start relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-8 pb-32 md:pt-12 md:pb-24 text-center px-8 bg-[#022b1d] overflow-hidden"
        >
          <div class="space-y-10 relative z-10 max-w-2xl mx-auto" v-observe>
            <div class="w-24 h-[1.5px] bg-[#d4af37] mx-auto mb-6"></div>
            <div class="space-y-6">
              <p class="text-sm md:text-xl text-white/80 leading-relaxed font-light font-serif">
                Merupakan sebuah kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i
                berkenan hadir untuk memberikan do'a restu kepada kami.
              </p>
              <div class="space-y-3 py-6 border-y border-white/5">
                <p class="text-xs md:text-base text-[#d4af37] font-black uppercase tracking-[0.2em]">
                  {{ data.closingGreeting || "Wassalamu'alaikum Warahmatullahi Wabarakatuh" }}
                </p>
              </div>
              <div class="space-y-3 pt-6">
                <p class="text-[9px] text-white/40 uppercase tracking-[0.5em] font-black">
                  Kami yang berbahagia,
                </p>
                <h2 class="font-alex text-5xl md:text-8xl text-white drop-shadow-2xl leading-none">
                  {{ data.groomName?.split(' ')[1] || data.groomName || 'Pria' }} &
                  {{ data.brideName?.split(' ')[1] || data.brideName || 'Wanita' }}
                </h2>
              </div>
            </div>
            <div class="pt-16 space-y-3 opacity-30">
              <p class="text-[8px] text-[#d4af37] tracking-[0.4em] uppercase font-black">
                Official Invitation By
              </p>
              <h3 class="font-serif text-white font-bold text-lg md:text-2xl tracking-tighter">
                SatuUndangan<span class="text-[#d4af37]">.id</span>
              </h3>
            </div>
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

// Illustration Path
const illustrationUrl = '/assets/images/foto_pengantin_afifah_saputra_animasi.png'

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
    title: 'Pertama Bertemu',
    date: 'Januari 2024',
    description:
      'Kisah cinta kami bermula dari pertemuan tak terduga yang menumbuhkan benih-benih kasih di hati.',
  },
  {
    title: 'Lamaran',
    date: 'Februari 2026',
    description:
      'Momen sakral dimana kami berkomitmen untuk melangkah ke jenjang yang lebih serius.',
  },
]

const galleryImages = ref([])
const guestMessages = ref([])
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const activeSection = ref('home')
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let interval = null
const particleCanvas = ref(null)
let animationId = null

const navItems = computed(() => {
  const items = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house' },
    { id: 'couple', label: 'Couple', icon: 'fa-solid fa-heart' },
    { id: 'story', label: 'Story', icon: 'fa-solid fa-feather' },
    { id: 'event', label: 'Event', icon: 'fa-solid fa-calendar-check' },
    { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-images' },
    { id: 'gift', label: 'Gift', icon: 'fa-solid fa-gift' },
    { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope' },
  ]
  return items.filter((item) => {
    if (item.id === 'home') return true
    if (item.id === 'story') return isSectionEnabled('love-story') && (data.value.loveStory?.length > 0 || isPreviewMode.value)
    if (item.id === 'gallery') return isSectionEnabled('gallery') && data.value.galleryImages?.length > 0
    return isSectionEnabled(item.id)
  })
})

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-[1500ms]', 'ease-out')
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
  class Particle {
    constructor() {
      this.reset()
      this.y = Math.random() * height
    }
    reset() {
      this.x = Math.random() * width
      this.y = -50
      this.size = 3 + Math.random() * 10
      this.speed = 0.2 + Math.random() * 0.5
      this.swing = Math.random() * 1.5
      this.swingStep = Math.random() * 100
      this.opacity = 0.05 + Math.random() * 0.2
      this.flip = Math.random() * Math.PI
      this.flipSpeed = 0.005 + Math.random() * 0.01
      this.color = ['#ffd700', '#d4af37', '#f1c40f'][Math.floor(Math.random() * 3)]
    }
    update() {
      this.y += this.speed
      this.swingStep += 0.005
      this.x += Math.sin(this.swingStep) * this.swing
      this.flip += this.flipSpeed
      if (this.y > height + 50) this.reset()
    }
    draw() {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.flip)
      ctx.scale(Math.sin(this.flip), 1)
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
    particles = Array.from({ length: 40 }, () => new Particle())
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
  return '/audio/wedding-sacred-ceremony.mp3'
}
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
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
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
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
        message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair.',
        rsvpStatus: 'hadir',
        createdAt: new Date(),
      },
      {
        guestName: 'Siti Aminah',
        message: 'MasyaAllah cantik banget Afifah!',
        rsvpStatus: 'hadir',
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
@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:wght@300;400;700;900&family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,700;1,400&display=swap');

.font-alex {
  font-family: 'Alex Brush', cursive;
}
.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}
.font-cormorant {
  font-family: 'Cormorant Garamond', serif;
}

.animate-spin-slow {
  animation: spin 40s linear infinite;
}
.animate-spin-reverse-slow {
  animation: spin-reverse 45s linear infinite;
}
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes slow-float {
  0%, 100% { transform: scale(1.02) translateY(0); }
  50% { transform: scale(1.05) translateY(-10px); }
}
.animate-slow-float {
  animation: slow-float 15s ease-in-out infinite;
}

@keyframes gradient-gold {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-gradient-gold {
  animation: gradient-gold 3s ease infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-fade-in {
  animation: fadeIn 1.5s ease-out forwards;
  opacity: 0;
}
.animate-fade-in-up {
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
.animate-reveal-text {
  animation: revealText 2.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes revealText {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
    filter: blur(10px);
  }
  100% {
    letter-spacing: 0.8em;
    opacity: 1;
    filter: blur(0);
  }
}

.fade-welcome-leave-active {
  transition: all 1.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.fade-welcome-leave-to {
  opacity: 0;
  transform: scale(1.1);
  filter: blur(20px);
}

.shadow-3xl {
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d4af37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 1.2em;
}
</style>
