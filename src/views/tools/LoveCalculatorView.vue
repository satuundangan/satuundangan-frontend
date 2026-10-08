<template>
  <div class="bg-[#FAF7F2] min-h-screen font-sans text-dark scroll-smooth selection:bg-rose-100 selection:text-rose-900">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Header -->
    <header class="relative pt-28 pb-14 overflow-hidden bg-gradient-to-b from-white via-[#FAF7F2] to-[#F5EFEB]">
      <!-- Romantic Decorative Glows -->
      <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-rose-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-28 -left-20 w-72 h-72 bg-amber-200/25 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute top-28 -right-20 w-72 h-72 bg-rose-200/25 rounded-full blur-2xl pointer-events-none"></div>

      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-5">
        <!-- Floating Pill Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold tracking-wider uppercase shadow-xs">
          <i class="fa-solid fa-heart text-rose-500 animate-pulse"></i>
          <span>Tools Gratis Calon Pengantin • Ramalan Primbon Modern</span>
        </div>

        <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.2]">
          Kalkulator Kecocokan Cinta &amp; <br class="hidden sm:inline" />
          <span class="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 bg-clip-text text-transparent">
            Weton Jodoh Jawa Modern
          </span>
        </h1>

        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Temukan getaran chemistry nama kalian berdua dan hitung neptu jodoh berdasarkan kearifan luhur Primbon Jawa modern. Dapatkan analisis cinta mendalam, makna filosofis bijak, serta panduan melangkah mantap menuju pelaminan.
        </p>

        <!-- Mode / Tab Switcher -->
        <div class="pt-3 flex justify-center">
          <div class="inline-flex p-1.5 bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-md">
            <button
              type="button"
              @click="activeTab = 'name'"
              :class="[
                'flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer',
                activeTab === 'name'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              ]"
            >
              <i class="fa-solid fa-heart-pulse text-sm"></i>
              <span>Chemistry Nama Cinta</span>
            </button>

            <button
              type="button"
              @click="activeTab = 'weton'"
              :class="[
                'flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer',
                activeTab === 'weton'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/50'
              ]"
            >
              <i class="fa-solid fa-moon text-sm"></i>
              <span>Weton Jodoh Jawa (Neptu)</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 pb-24 space-y-12">
      <!-- ========================================== -->
      <!-- TAB 1: CHEMISTRY NAMA CINTA (FUN MATCHER) -->
      <!-- ========================================== -->
      <section v-show="activeTab === 'name'" class="space-y-8 animate-fadeIn">
        <!-- Input Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xl shadow-stone-200/50 relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-40 h-40 bg-rose-100/40 rounded-full blur-2xl pointer-events-none"></div>

          <div class="text-center max-w-lg mx-auto mb-8 space-y-2">
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Cek Skor Chemistry Nama Berdua
            </h2>
            <p class="text-xs sm:text-sm text-slate-500">
              Masukkan nama lengkap atau panggilanmu dan pasangan. Algoritma deterministic kami akan menghitung frekuensi kecocokan cinta kalian.
            </p>
          </div>

          <form @submit.prevent="calculateLoveScore" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
              <!-- Name 1 -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <i class="fa-solid fa-user text-rose-400 mr-1.5"></i> Nama Kamu
                </label>
                <div class="relative">
                  <input
                    v-model="nameForm.name1"
                    type="text"
                    placeholder="Contoh: Rian Aditya"
                    class="w-full px-4 py-3.5 pl-11 rounded-2xl bg-stone-50/70 border border-stone-200 focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                    required
                  />
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400">
                    <i class="fa-regular fa-heart"></i>
                  </div>
                </div>
              </div>

              <!-- Romantic Connector Badge (Center Desktop) -->
              <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-rose-50 border border-rose-200 text-rose-500 items-center justify-center text-xs shadow-sm">
                <i class="fa-solid fa-plus"></i>
              </div>

              <!-- Name 2 -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <i class="fa-solid fa-heart text-rose-400 mr-1.5"></i> Nama Pasangan
                </label>
                <div class="relative">
                  <input
                    v-model="nameForm.name2"
                    type="text"
                    placeholder="Contoh: Putri Maharani"
                    class="w-full px-4 py-3.5 pl-11 rounded-2xl bg-stone-50/70 border border-stone-200 focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                    required
                  />
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400">
                    <i class="fa-solid fa-heart"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preset / Sample Pair Quick Buttons -->
            <div class="flex items-center justify-center flex-wrap gap-2 pt-1 text-xs text-slate-500">
              <span class="text-[11px] text-slate-400">Coba contoh:</span>
              <button
                type="button"
                @click="fillNameSample('Ardi Pranata', 'Citra Kirana')"
                class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer text-[11px] font-medium"
              >
                Ardi &amp; Citra
              </button>
              <button
                type="button"
                @click="fillNameSample('Bima Sakti', 'Adinda Larasati')"
                class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer text-[11px] font-medium"
              >
                Bima &amp; Adinda
              </button>
              <button
                type="button"
                @click="fillNameSample('Fajar Pratama', 'Nabila Zahra')"
                class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer text-[11px] font-medium"
              >
                Fajar &amp; Nabila
              </button>
            </div>

            <!-- Submit Button -->
            <div class="pt-2 text-center">
              <button
                type="submit"
                :disabled="isNameCalculating || !nameForm.name1.trim() || !nameForm.name2.trim()"
                class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-rose-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <i v-if="isNameCalculating" class="fa-solid fa-spinner fa-spin text-base"></i>
                <i v-else class="fa-solid fa-wand-magic-sparkles text-amber-200"></i>
                <span>{{ isNameCalculating ? 'Membaca Gelombang Cinta...' : 'Hitung Kecocokan Cinta Sekarang' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Result Display Card (Appears after calculation) -->
        <div
          v-if="nameResult"
          id="name-result-section"
          class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-2xl space-y-8 relative overflow-hidden animate-scaleUp"
        >
          <!-- Romantic Decorative Ribbon Top -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500"></div>

          <!-- Couple Header Tag -->
          <div class="text-center space-y-2 pt-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <i class="fa-solid fa-sparkles text-amber-500"></i>
              Hasil Analisis Kecocokan Cinta
            </span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {{ nameResult.displayName1 }} &amp; {{ nameResult.displayName2 }}
            </h3>
          </div>

          <!-- Big Animated Circular / Heart Counter -->
          <div class="flex flex-col items-center justify-center space-y-4">
            <div class="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              <!-- SVG Radial Meter -->
              <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#F3E8E2"
                  stroke-width="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#roseGradient)"
                  stroke-width="12"
                  stroke-linecap="round"
                  fill="transparent"
                  :stroke-dasharray="2 * Math.PI * 70"
                  :stroke-dashoffset="circumferenceOffset"
                  class="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#F43F5E" />
                    <stop offset="50%" stop-color="#FB7185" />
                    <stop offset="100%" stop-color="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>

              <!-- Central Content -->
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div class="text-rose-500 text-xl animate-bounce">
                  <i class="fa-solid fa-heart"></i>
                </div>
                <div class="font-serif text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {{ animatedScore }}<span class="text-2xl sm:text-3xl text-rose-500">%</span>
                </div>
                <div class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                  Chemistry Match
                </div>
              </div>
            </div>

            <!-- Title & Badge -->
            <div class="text-center space-y-1">
              <div class="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-sm">
                {{ nameResult.title }}
              </div>
              <p class="text-xs sm:text-sm text-slate-500 italic max-w-md mx-auto pt-1">
                "{{ nameResult.tagline }}"
              </p>
            </div>
          </div>

          <!-- Breakdown Sub-scores -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div class="p-4 rounded-2xl bg-[#FFFBF8] border border-stone-200/70 text-center space-y-1">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Komunikasi &amp; Nyaman</span>
              <div class="font-bold text-lg text-slate-900">{{ nameResult.subScores.comm }}%</div>
              <div class="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div class="bg-rose-500 h-full rounded-full" :style="{ width: nameResult.subScores.comm + '%' }"></div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-[#FFFBF8] border border-stone-200/70 text-center space-y-1">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Romantisme &amp; Tarikan</span>
              <div class="font-bold text-lg text-slate-900">{{ nameResult.subScores.romance }}%</div>
              <div class="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" :style="{ width: nameResult.subScores.romance + '%' }"></div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-[#FFFBF8] border border-stone-200/70 text-center space-y-1">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Kekompakan &amp; Visi</span>
              <div class="font-bold text-lg text-slate-900">{{ nameResult.subScores.teamwork }}%</div>
              <div class="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div class="bg-rose-400 h-full rounded-full" :style="{ width: nameResult.subScores.teamwork + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Playful Narrative Analysis (3 Pillars) -->
          <div class="p-6 rounded-2xl bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 border border-rose-100/80 space-y-4">
            <h4 class="font-bold text-sm text-slate-800 flex items-center gap-2">
              <i class="fa-solid fa-feather text-rose-500"></i>
              <span>Analisis Hubungan &amp; Bahasa Cinta Pasangan</span>
            </h4>

            <div class="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  <i class="fa-solid fa-comment-dots"></i>
                </div>
                <div>
                  <b class="text-slate-800">Gaya Interaksi:</b> {{ nameResult.narratives.style }}
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  <i class="fa-solid fa-shield-heart"></i>
                </div>
                <div>
                  <b class="text-slate-800">Kekuatan Utama:</b> {{ nameResult.narratives.strength }}
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  <i class="fa-solid fa-rings-wedding"></i>
                </div>
                <div>
                  <b class="text-slate-800">Prediksi Pelaminan:</b> {{ nameResult.narratives.future }}
                </div>
              </div>

              <!-- Candaan & Fakta Unik Pasangan -->
              <div v-if="nameResult.narratives.quirk" class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  <i class="fa-solid fa-face-laugh-squint"></i>
                </div>
                <div>
                  <b class="text-slate-800">Bumbu Candaan:</b> {{ nameResult.narratives.quirk }}
                </div>
              </div>
            </div>

            <!-- Love Language Match Badge -->
            <div class="pt-2 border-t border-rose-100/60 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span class="text-slate-500 font-medium">Kombinasi Bahasa Cinta Utama:</span>
              <span class="font-bold text-rose-600 bg-rose-100/60 px-3 py-1 rounded-full">
                {{ nameResult.loveLanguage }}
              </span>
            </div>
          </div>

          <!-- Share & Copy Actions -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              @click="shareNameResultWA"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <i class="fa-brands fa-whatsapp text-lg"></i>
              <span>Bagikan Hasil ke WhatsApp</span>
            </button>

            <button
              type="button"
              @click="copyNameResult"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <i :class="copiedName ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy text-slate-500'"></i>
              <span>{{ copiedName ? 'Tersalin ke Clipboard!' : 'Salin Teks Hasil Cinta' }}</span>
            </button>

            <button
              type="button"
              @click="resetNameForm"
              class="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-rotate-left text-xs"></i>
              <span>Coba Nama Lain</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================== -->
      <!-- TAB 2: KALKULATOR WETON JODOH JAWA (NEPTU PRIMBON) -->
      <!-- ================================================== -->
      <section v-show="activeTab === 'weton'" class="space-y-8 animate-fadeIn">
        <!-- Input Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xl shadow-stone-200/50 relative overflow-hidden">
          <div class="absolute -top-12 -left-12 w-40 h-40 bg-amber-100/40 rounded-full blur-2xl pointer-events-none"></div>

          <div class="text-center max-w-lg mx-auto mb-8 space-y-2">
            <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1">
              <i class="fa-solid fa-scroll text-amber-600"></i>
              <span>Tradisi Budaya Nusantara</span>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Kalkulator Neptu &amp; Weton Jodoh Jawa
            </h2>
            <p class="text-xs sm:text-sm text-slate-500">
              Pilih tanggal lahir calon mempelai pria dan wanita. Sistem otomatis menentukan hari (dino), pasaran Jawa, jumlah neptu, dan pembagian 8 Primbon modern.
            </p>
          </div>

          <form @submit.prevent="calculateWeton" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <!-- Calon Pria -->
              <div class="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-4">
                <div class="flex items-center gap-2 pb-1 border-b border-stone-200">
                  <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-mars"></i>
                  </div>
                  <h3 class="text-sm font-bold text-slate-800">Calon Mempelai Pria</h3>
                </div>

                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-600">Nama Pria</label>
                  <input
                    v-model="wetonForm.groomName"
                    type="text"
                    placeholder="Contoh: Raden Bagus"
                    class="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-sm font-medium text-slate-800"
                    required
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-600">Tanggal Lahir Pria</label>
                  <input
                    v-model="wetonForm.groomDob"
                    type="date"
                    min="1940-01-01"
                    max="2020-12-31"
                    class="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-sm font-medium text-slate-800"
                    required
                  />
                  <p class="text-[11px] text-slate-400">Pilih tanggal, bulan, dan tahun lahir</p>
                </div>
              </div>

              <!-- Calon Wanita -->
              <div class="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-4">
                <div class="flex items-center gap-2 pb-1 border-b border-stone-200">
                  <div class="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-venus"></i>
                  </div>
                  <h3 class="text-sm font-bold text-slate-800">Calon Mempelai Wanita</h3>
                </div>

                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-600">Nama Wanita</label>
                  <input
                    v-model="wetonForm.brideName"
                    type="text"
                    placeholder="Contoh: Dewi Sekar"
                    class="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-sm font-medium text-slate-800"
                    required
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-600">Tanggal Lahir Wanita</label>
                  <input
                    v-model="wetonForm.brideDob"
                    type="date"
                    min="1940-01-01"
                    max="2020-12-31"
                    class="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-sm font-medium text-slate-800"
                    required
                  />
                  <p class="text-[11px] text-slate-400">Pilih tanggal, bulan, dan tahun lahir</p>
                </div>
              </div>
            </div>

            <!-- Preset Samples -->
            <div class="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
              <span class="text-[11px] text-slate-400">Coba tanggal contoh:</span>
              <button
                type="button"
                @click="fillWetonSample('Raden Arga', '1996-01-01', 'Dewi Lestari', '1998-08-17')"
                class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-50 hover:text-amber-800 transition-colors cursor-pointer text-[11px] font-medium"
              >
                Senin Pahing &amp; Senin Wage
              </button>
              <button
                type="button"
                @click="fillWetonSample('Dimas Bayu', '1994-05-12', 'Ayu Pitaloka', '1997-11-20')"
                class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-50 hover:text-amber-800 transition-colors cursor-pointer text-[11px] font-medium"
              >
                Kamis Kliwon &amp; Kamis Legi
              </button>
            </div>

            <!-- Submit Button -->
            <div class="pt-2 text-center">
              <button
                type="submit"
                :disabled="isWetonCalculating || !wetonForm.groomDob || !wetonForm.brideDob"
                class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-600/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <i v-if="isWetonCalculating" class="fa-solid fa-spinner fa-spin text-base"></i>
                <i v-else class="fa-solid fa-compass text-amber-200"></i>
                <span>{{ isWetonCalculating ? 'Menghitung Penanggalan Jawa...' : 'Hitung Neptu & Weton Jodoh' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Result Display Card (Weton Primbon) -->
        <div
          v-if="wetonResult"
          id="weton-result-section"
          class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-2xl space-y-8 relative overflow-hidden animate-scaleUp"
        >
          <!-- Traditional Gold Decorative Accent Top -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-rose-600"></div>

          <!-- Header Tag -->
          <div class="text-center space-y-2 pt-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <i class="fa-solid fa-ring text-amber-600"></i>
              Perhitungan Weton Jodoh (Primbon Dibagi 8)
            </span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {{ wetonResult.groomName }} &amp; {{ wetonResult.brideName }}
            </h3>
          </div>

          <!-- Side by Side Neptu Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Pria -->
            <div class="p-5 rounded-2xl bg-[#FAF7F2] border border-amber-200/70 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <i class="fa-solid fa-mars text-blue-600"></i> Mempelai Pria
                </span>
                <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {{ wetonResult.groom.dateFormatted }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-1">
                <div>
                  <div class="font-serif text-xl font-bold text-slate-900">
                    {{ wetonResult.groom.wetonName }}
                  </div>
                  <div class="text-xs text-slate-500">
                    Hari {{ wetonResult.groom.dino.name }} ({{ wetonResult.groom.dino.neptu }}) + Pasaran {{ wetonResult.groom.pasaran.name }} ({{ wetonResult.groom.pasaran.neptu }})
                  </div>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-amber-700">Neptu</span>
                  <span class="text-xl font-black">{{ wetonResult.groom.neptu }}</span>
                </div>
              </div>

              <div class="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-stone-200/50 flex items-center gap-2">
                <i class="fa-solid fa-leaf text-amber-600 text-xs"></i>
                <span><b>Watak Elemen:</b> {{ wetonResult.groom.pasaran.meaning }}</span>
              </div>
            </div>

            <!-- Wanita -->
            <div class="p-5 rounded-2xl bg-[#FAF7F2] border border-rose-200/70 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <i class="fa-solid fa-venus text-rose-600"></i> Mempelai Wanita
                </span>
                <span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                  {{ wetonResult.bride.dateFormatted }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-1">
                <div>
                  <div class="font-serif text-xl font-bold text-slate-900">
                    {{ wetonResult.bride.wetonName }}
                  </div>
                  <div class="text-xs text-slate-500">
                    Hari {{ wetonResult.bride.dino.name }} ({{ wetonResult.bride.dino.neptu }}) + Pasaran {{ wetonResult.bride.pasaran.name }} ({{ wetonResult.bride.pasaran.neptu }})
                  </div>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-rose-700">Neptu</span>
                  <span class="text-xl font-black">{{ wetonResult.bride.neptu }}</span>
                </div>
              </div>

              <div class="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-stone-200/50 flex items-center gap-2">
                <i class="fa-solid fa-leaf text-rose-600 text-xs"></i>
                <span><b>Watak Elemen:</b> {{ wetonResult.bride.pasaran.meaning }}</span>
              </div>
            </div>
          </div>

          <!-- Total Neptu Summary Banner -->
          <div class="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div class="space-y-1 text-center sm:text-left">
              <span class="text-[11px] uppercase tracking-widest text-amber-300 font-bold block">
                Akumulasi Nilai Neptu Jodoh
              </span>
              <div class="text-lg sm:text-xl font-bold">
                Neptu Pria ({{ wetonResult.groom.neptu }}) + Neptu Wanita ({{ wetonResult.bride.neptu }})
              </div>
              <p class="text-xs text-stone-300">
                Total {{ wetonResult.totalNeptu }} dibagi 8 menyisakan angka <b>{{ wetonResult.category.remainder }}</b>
              </p>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <div class="text-xs text-stone-300">Total Neptu</div>
                <div class="text-3xl font-black text-amber-400">{{ wetonResult.totalNeptu }}</div>
              </div>
              <div class="text-center px-4 py-2 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40">
                <div class="text-xs text-amber-300">Sisa Pembagian</div>
                <div class="text-3xl font-black text-amber-300">{{ wetonResult.category.remainder }}</div>
              </div>
            </div>
          </div>

          <!-- Primbon 8 Category Card -->
          <div :class="['p-6 sm:p-8 rounded-3xl border space-y-5 transition-all shadow-sm', wetonResult.category.bgClass]">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
              <div class="space-y-1">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider" :class="wetonResult.category.pillClass">
                  <i :class="wetonResult.category.icon"></i>
                  <span>Kategori {{ wetonResult.category.name }} (Sisa {{ wetonResult.category.remainder }})</span>
                </div>
                <h4 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {{ wetonResult.category.title }}
                </h4>
              </div>

              <!-- Harmony Meter Badge -->
              <div class="text-right sm:text-right shrink-0">
                <div class="text-xs font-bold text-slate-500">Skor Keselarasan</div>
                <div class="text-2xl font-black" :class="wetonResult.category.accentColor">
                  {{ wetonResult.category.score }}%
                </div>
              </div>
            </div>

            <!-- Meaning & Philosophy -->
            <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div class="space-y-1">
                <h5 class="font-bold text-slate-900 flex items-center gap-2">
                  <i class="fa-solid fa-book-open text-amber-700"></i>
                  <span>Makna Tradisi Primbon:</span>
                </h5>
                <p class="text-slate-600 bg-white/70 p-4 rounded-xl border border-stone-200/50">
                  {{ wetonResult.category.traditionalMeaning }}
                </p>
              </div>

              <!-- Positive Modern Advice -->
              <div class="space-y-1">
                <h5 class="font-bold text-slate-900 flex items-center gap-2">
                  <i class="fa-solid fa-lightbulb text-amber-600"></i>
                  <span>Nasihat Bijak Positif Modern untuk Melangkah ke Pelaminan:</span>
                </h5>
                <div class="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                  <p class="text-slate-800 leading-relaxed font-medium">
                    "{{ wetonResult.category.modernWisdom }}"
                  </p>
                  <div class="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs text-amber-800 font-bold">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>Kunci Hubungan: {{ wetonResult.category.keyTakeaway }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Share & Actions -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              @click="shareWetonResultWA"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <i class="fa-brands fa-whatsapp text-lg"></i>
              <span>Bagikan Hasil Weton ke WhatsApp</span>
            </button>

            <button
              type="button"
              @click="copyWetonResult"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <i :class="copiedWeton ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy text-slate-500'"></i>
              <span>{{ copiedWeton ? 'Tersalin ke Clipboard!' : 'Salin Teks Hasil Weton' }}</span>
            </button>

            <button
              type="button"
              @click="resetWetonForm"
              class="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-rotate-left text-xs"></i>
              <span>Cek Tanggal Lain</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================== -->
      <!-- SECTION 2: HIGH-CONVERTING CALL-TO-ACTION BANNER   -->
      <!-- ================================================== -->
      <section
        v-if="nameResult || wetonResult"
        class="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 text-white shadow-2xl space-y-8 animate-fade-in"
      >
        <!-- Background Ambient Sparkles -->
        <div class="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 text-center max-w-2xl mx-auto space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest">
            <i class="fa-solid fa-circle-check text-emerald-400"></i>
            <span>100% Bebas Coba Desain Dulu • Tanpa Biaya di Awal</span>
          </div>

          <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Kalian cocok banget! <br />
            <span class="bg-gradient-to-r from-amber-300 via-rose-200 to-amber-400 bg-clip-text text-transparent">
              Kapan sebar undangan?
            </span>
          </h2>

          <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl mx-auto">
            Bebas bikin &amp; coba ratusan desain undangan pernikahan berdua gratis sekarang! Edit nama, foto, dan lagu sepuasnya sampai pas di hati. <strong class="text-amber-300 font-semibold">Kamu hanya bayar saat sudah siap menyebarkan link undangan ke tamu.</strong>
          </p>

          <!-- Trust Badges (Zero-Risk) -->
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-xs text-stone-300">
            <span class="inline-flex items-center gap-1.5 font-medium text-emerald-300">
              <i class="fa-solid fa-check text-[11px]"></i> Bikin &amp; Edit Gratis Sepuasnya
            </span>
            <span class="inline-flex items-center gap-1.5 font-medium text-amber-300">
              <i class="fa-solid fa-check text-[11px]"></i> Tanpa Kartu Kredit / DP
            </span>
            <span class="inline-flex items-center gap-1.5 font-medium text-rose-300">
              <i class="fa-solid fa-check text-[11px]"></i> Bayar Cuma Pas Mau Sebar
            </span>
          </div>

          <!-- Buttons -->
          <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <router-link
              to="/create"
              class="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-sm tracking-wide transition-all shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <i class="fa-solid fa-wand-magic-sparkles text-amber-200"></i>
              <span>Mulai Desain Undangan Gratis</span>
            </router-link>

            <a
              href="/#templates"
              class="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-palette text-amber-300"></i>
              <span>Lihat Katalog Tema (33+ Pilihan)</span>
            </a>
          </div>

          <div class="pt-2 text-[11px] text-stone-400">
            <span>💡 Tidak ada komitmen • Simpan draf kapan saja • Bayar hanya saat publish</span>
          </div>

          <div class="pt-2">
            <router-link
              to="/wedding-planner"
              class="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-medium underline underline-offset-4 transition-colors"
            >
              <span>Atau rencanakan budget &amp; rundown di Wedding Planner Gratis</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </router-link>
          </div>
        </div>

        <!-- Mini Showcase Carousel / Grid of Designs -->
        <div class="pt-6 border-t border-white/10 relative z-10">
          <div class="text-center text-xs text-stone-400 uppercase tracking-widest font-bold mb-4">
            Pilihan Tema Favorit Pasangan SatuUndangan
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1.5 hover:bg-white/10 transition-colors">
              <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-xs">
                <i class="fa-solid fa-crown"></i>
              </div>
              <div class="font-bold text-xs text-white">Jawa Royal / Truntum</div>
              <div class="text-[10px] text-stone-400">Nuansa Klasik Sakral</div>
            </div>

            <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1.5 hover:bg-white/10 transition-colors">
              <div class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 mx-auto flex items-center justify-center text-xs">
                <i class="fa-solid fa-spa"></i>
              </div>
              <div class="font-bold text-xs text-white">Botanical Watercolor</div>
              <div class="text-[10px] text-stone-400">Elegan &amp; Romantis</div>
            </div>

            <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1.5 hover:bg-white/10 transition-colors">
              <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center text-xs">
                <i class="fa-solid fa-gem"></i>
              </div>
              <div class="font-bold text-xs text-white">Royal Emerald</div>
              <div class="text-[10px] text-stone-400">Mewah Modern &amp; Glam</div>
            </div>

            <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1.5 hover:bg-white/10 transition-colors">
              <div class="w-8 h-8 rounded-full bg-slate-500/20 text-slate-300 mx-auto flex items-center justify-center text-xs">
                <i class="fa-solid fa-feather-pointed"></i>
              </div>
              <div class="font-bold text-xs text-white">Minimalist Terra</div>
              <div class="text-[10px] text-stone-400">Simple &amp; Chic Minimalis</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================== -->
      <!-- SECTION 3: EDUKASI PRIMBON & TABEL NEPTU JAWA      -->
      <!-- ================================================== -->
      <section class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-8">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-amber-700 font-bold text-xs uppercase tracking-widest">Ensiklopedi Budaya</span>
          <h3 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Panduan Lengkap Nilai Neptu Hari &amp; Pasaran
          </h3>
          <p class="text-xs sm:text-sm text-slate-500">
            Dalam penanggalan Jawa, weton merupakan gabungan antara hari 7 (saptawara) dan pasaran 5 (pancawara) yang masing-masing membawa bobot neptu.
          </p>
        </div>

        <!-- Tables Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tabel Hari (Dino) -->
          <div class="border border-stone-200 rounded-2xl overflow-hidden">
            <div class="bg-stone-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Hari (Dino / Saptawara)</span>
              <span class="text-amber-400">Nilai Neptu</span>
            </div>
            <div class="divide-y divide-stone-100 text-xs">
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Minggu</span><span class="font-bold text-slate-800">5</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Senin</span><span class="font-bold text-slate-800">4</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Selasa</span><span class="font-bold text-slate-800">3</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Rabu</span><span class="font-bold text-slate-800">7</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Kamis</span><span class="font-bold text-slate-800">8</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Jumat</span><span class="font-bold text-slate-800">6</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Sabtu</span><span class="font-bold text-slate-800">9</span></div>
            </div>
          </div>

          <!-- Tabel Pasaran -->
          <div class="border border-stone-200 rounded-2xl overflow-hidden">
            <div class="bg-stone-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Pasaran (Pancawara)</span>
              <span class="text-amber-400">Nilai Neptu</span>
            </div>
            <div class="divide-y divide-stone-100 text-xs">
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Legi (Manis)</span><span class="font-bold text-slate-800">5</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Pahing (Pahit / Berani)</span><span class="font-bold text-slate-800">9</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Pon (Petak / Teguh)</span><span class="font-bold text-slate-800">7</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Wage (Cemeng / Tenang)</span><span class="font-bold text-slate-800">4</span></div>
              <div class="px-4 py-2.5 flex justify-between items-center hover:bg-stone-50"><span>Kliwon (Asih / Pengayom)</span><span class="font-bold text-slate-800">8</span></div>
            </div>
          </div>
        </div>

        <!-- 8 Kategori Primbon Reference Box -->
        <div class="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
          <h4 class="font-bold text-sm text-slate-900">Ringkasan 8 Hasil Pembagian Neptu Jodoh:</h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-rose-600 block">1. Pegat</span>
              <p class="text-[11px] text-slate-500">Ujian ego &amp; butuh kedewasaan komunikasi.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-emerald-600 block">2. Ratu</span>
              <p class="text-[11px] text-slate-500">Dihormati, disegani, jodoh harmonis.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-emerald-600 block">3. Jodoh</span>
              <p class="text-[11px] text-slate-500">Saling melengkapi lahir &amp; batin sejati.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-blue-600 block">4. Topo</span>
              <p class="text-[11px] text-slate-500">Kerja keras di awal berbuah manis.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-amber-600 block">5. Tinari</span>
              <p class="text-[11px] text-slate-500">Dimudahkan rezeki &amp; keberuntungan.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-amber-600 block">6. Padu</span>
              <p class="text-[11px] text-slate-500">Dinamis, diselesaikan dengan pelukan.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-purple-600 block">7. Sujanan</span>
              <p class="text-[11px] text-slate-500">Fokus transparansi &amp; keterbukaan hati.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span class="font-black text-emerald-600 block">8. Pesthi</span>
              <p class="text-[11px] text-slate-500">Ayem tentrem dan damai hingga tua.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================== -->
      <!-- SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQ)        -->
      <!-- ================================================== -->
      <section class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6">
        <div class="text-center max-w-lg mx-auto space-y-2">
          <span class="text-rose-600 font-bold text-xs uppercase tracking-widest">Tanya Jawab</span>
          <h3 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Pertanyaan Seputar Kalkulator Jodoh
          </h3>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
          >
            <button
              type="button"
              @click="toggleFaq(idx)"
              class="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>{{ faq.q }}</span>
              <i :class="openFaqIndex === idx ? 'fa-solid fa-chevron-up text-rose-500' : 'fa-solid fa-chevron-down text-stone-400'"></i>
            </button>
            <div
              v-show="openFaqIndex === idx"
              class="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 bg-[#FAF7F2]/50"
            >
              {{ faq.a }}
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import { calculateLoveScore as computeLoveResult } from '@/utils/loveCalculator.js'

// --- Tabs State ---
const activeTab = ref('name') // 'name' | 'weton'

// --- Tab 1: Chemistry Nama Cinta State ---
const nameForm = reactive({
  name1: '',
  name2: ''
})
const isNameCalculating = ref(false)
const nameResult = ref(null)
const animatedScore = ref(0)
const copiedName = ref(false)

// Circumference for 70px radius SVG = 2 * PI * 70 = 439.82
const CIRCUMFERENCE = 2 * Math.PI * 70
const circumferenceOffset = computed(() => {
  const pct = animatedScore.value / 100
  return CIRCUMFERENCE * (1 - pct)
})

const fillNameSample = (n1, n2) => {
  nameForm.name1 = n1
  nameForm.name2 = n2
  calculateLoveScore()
}

// Deterministic Polynomial Hash Algorithm
function computeHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}

function calculateLoveScore() {
  const n1 = (nameForm.name1 || '').trim()
  const n2 = (nameForm.name2 || '').trim()
  if (!n1 || !n2) return

  isNameCalculating.value = true
  nameResult.value = null
  animatedScore.value = 0

  const calculated = computeLoveResult(n1, n2)

  setTimeout(() => {
    isNameCalculating.value = false
    nameResult.value = calculated

    // Scroll smoothly to result
    nextTick(() => {
      const el = document.getElementById('name-result-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      animateCounter(calculated.score)
    })
  }, 600)
}

function animateCounter(target) {
  let current = 0
  const duration = 1200
  const start = performance.now()

  function step(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // easeOutQuad
    const ease = 1 - (1 - progress) * (1 - progress)
    animatedScore.value = Math.floor(ease * target)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      animatedScore.value = target
    }
  }
  requestAnimationFrame(step)
}

function shareNameResultWA() {
  if (!nameResult.value) return
  const text = `Hai! Kami baru cek kecocokan cinta di SatuUndangan:
❤️ ${nameResult.value.displayName1} & ${nameResult.value.displayName2}
Skor Chemistry: ${nameResult.value.score}% (${nameResult.value.title})
"${nameResult.value.tagline}"

💡 Di SatuUndangan bisa bikin & coba-coba desain undangan pernikahan GRATIS dulu loh (bayar cuma pas mau sebar link)!

Cek kecocokanmu dan pasanganmu di: https://satuundangan.id/tools/love-calculator`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

function copyNameResult() {
  if (!nameResult.value) return
  const text = `❤️ Skor Chemistry Cinta: ${nameResult.value.displayName1} & ${nameResult.value.displayName2}
Persentase: ${nameResult.value.score}%
Predikat: ${nameResult.value.title}
Catatan: "${nameResult.value.tagline}"

✨ Info: Bisa bikin & coba desain undangan digital berdua GRATIS dulu tanpa biaya di awal:
https://satuundangan.id/tools/love-calculator`

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      copiedName.value = true
      setTimeout(() => (copiedName.value = false), 2500)
    })
  }
}

function resetNameForm() {
  nameForm.name1 = ''
  nameForm.name2 = ''
  nameResult.value = null
  animatedScore.value = 0
}

// --- Tab 2: Weton Jodoh Jawa State ---
const wetonForm = reactive({
  groomName: '',
  groomDob: '',
  brideName: '',
  brideDob: ''
})
const isWetonCalculating = ref(false)
const wetonResult = ref(null)
const copiedWeton = ref(false)

const DINO_DATA = [
  { name: 'Minggu', neptu: 5 },
  { name: 'Senin', neptu: 4 },
  { name: 'Selasa', neptu: 3 },
  { name: 'Rabu', neptu: 7 },
  { name: 'Kamis', neptu: 8 },
  { name: 'Jumat', neptu: 6 },
  { name: 'Sabtu', neptu: 9 }
]

const PASARAN_DATA = [
  { name: 'Legi', neptu: 5, meaning: 'Luwes, manis budi, ramah dan bijaksana.' },
  { name: 'Pahing', neptu: 9, meaning: 'Berani, bersemangat, mandiri, dan berwibawa.' },
  { name: 'Pon', neptu: 7, meaning: 'Teguh pendirian, berjiwa pemimpin, dan setia.' },
  { name: 'Wage', neptu: 4, meaning: 'Tenang, teliti, hemat, dan tekun bekerja.' },
  { name: 'Kliwon', neptu: 8, meaning: 'Penuh welas asih, pengayom, dan pemaaf.' }
]

// 8 Primbon Categories (Sisa 1 s/d 8)
const PRIMBON_CATEGORIES = {
  1: {
    name: 'Pegat',
    remainder: 1,
    title: 'Pegat (Ujian Kedewasaan & Komunikasi)',
    score: 80,
    pillClass: 'bg-rose-100 text-rose-800',
    bgClass: 'bg-rose-50/50 border-rose-200/80',
    accentColor: 'text-rose-600',
    icon: 'fa-solid fa-heart-crack',
    traditionalMeaning:
      'Secara harfiah dalam primbon klasik, Pegat menandakan potensi gesekan ego, masalah perbedaan pendapat, atau ujian ekonomi yang menuntut kesabaran ekstra.',
    modernWisdom:
      'Dalam filosofi modern SatuUndangan, Pegat bukanlah penghalang jodoh, melainkan pengingat luhur agar kalian berdua melatih komunikasi terbuka tanpa gengsi serta menyusun anggaran keuangan keluarga yang rapi sejak awal. Pasangan yang saling merendahkan ego terbukti menjadi rumah tangga paling tangguh.',
    keyTakeaway: 'Keterbukaan emosi, saling memaafkan, dan manajemen finansial bersama.'
  },
  2: {
    name: 'Ratu',
    remainder: 2,
    title: 'Ratu (Jodoh Sakral & Dihormati)',
    score: 98,
    pillClass: 'bg-amber-100 text-amber-900',
    bgClass: 'bg-amber-50/50 border-amber-200/80',
    accentColor: 'text-amber-600',
    icon: 'fa-solid fa-crown',
    traditionalMeaning:
      'Pasangan ini diibaratkan raja dan ratu; sangat disegani, dihormati oleh keluarga besar serta lingkungan masyarakat, dan dipandang berwibawa.',
    modernWisdom:
      'Kalian adalah pasangan panutan yang memancarkan aura positif. Tetaplah rendah hati, ramah, dan jadikan pernikahan kalian sebagai ladang kebaikan yang mengayomi sesama keluarga.',
    keyTakeaway: 'Menjaga nama baik keluarga dan terus saling memuliakan pasangan.'
  },
  3: {
    name: 'Jodoh',
    remainder: 3,
    title: 'Jodoh (Saling Melengkapi & Rukun Sejati)',
    score: 99,
    pillClass: 'bg-emerald-100 text-emerald-900',
    bgClass: 'bg-emerald-50/50 border-emerald-200/80',
    accentColor: 'text-emerald-600',
    icon: 'fa-solid fa-rings-wedding',
    traditionalMeaning:
      'Pertemuan dua jiwa yang memang digariskan saling melengkapi. Kekurangan yang satu ditutup oleh kelebihan pasangannya secara harmonis.',
    modernWisdom:
      'Kalian memiliki kecocokan alami lahir dan batin. Rawatlah keindahan cinta ini dengan apresiasi harian, quality time, dan terus bersyukur atas kehadiran satu sama lain.',
    keyTakeaway: 'Saling menerima ketidaksempurnaan dan merayakan cinta setiap hari.'
  },
  4: {
    name: 'Topo',
    remainder: 4,
    title: 'Topo (Kerja Keras Membawa Kejayaan)',
    score: 86,
    pillClass: 'bg-blue-100 text-blue-900',
    bgClass: 'bg-blue-50/50 border-blue-200/80',
    accentColor: 'text-blue-600',
    icon: 'fa-solid fa-mountain',
    traditionalMeaning:
      'Menghadapi proses perjuangan atau adaptasi di awal pernikahan, namun perlahan tapi pasti berbuah kemapanan, kemuliaan, dan kebahagiaan sejati.',
    modernWisdom:
      'Jadikan masa-masa adaptasi di awal pernikahan sebagai pembentuk ikatan batin yang tak tergoyahkan. Kalian adalah rekan tim sejati; setiap ikhtiar bersama akan membuahkan hasil manis.',
    keyTakeaway: 'Kekompakan tim, saling mendukung karir, dan pantang menyerah.'
  },
  5: {
    name: 'Tinari',
    remainder: 5,
    title: 'Tinari (Limpahan Rezeki & Keberuntungan)',
    score: 96,
    pillClass: 'bg-amber-100 text-amber-900',
    bgClass: 'bg-amber-50/50 border-amber-200/80',
    accentColor: 'text-amber-600',
    icon: 'fa-solid fa-coins',
    traditionalMeaning:
      'Mendapat kemudahan dalam mencari sandang pangan dan rezeki, sering memperoleh keberuntungan tak terduga dalam membina rumah tangga.',
    modernWisdom:
      'Pernikahan kalian membawa pintu rezeki yang lapang. Imbangi kemudahan ini dengan gemar berbagi, bersedekah, dan saling menjaga rasa syukur agar berkah senantiasa berlipat ganda.',
    keyTakeaway: 'Bersyukur, gemar berbagi, dan pengelolaan harta yang bijaksana.'
  },
  6: {
    name: 'Padu',
    remainder: 6,
    title: 'Padu (Dinamis & Penuh Bumbu Cinta)',
    score: 82,
    pillClass: 'bg-orange-100 text-orange-900',
    bgClass: 'bg-orange-50/50 border-orange-200/80',
    accentColor: 'text-orange-600',
    icon: 'fa-solid fa-bolt',
    traditionalMeaning:
      'Sering diwarnai perdebatan kecil seputar hal sepele, namun tidak sampai merusak ikatan cinta dan biasanya cepat baikan kembali.',
    modernWisdom:
      'Perbedaan selera atau gaya bicara justru menjadi bumbu yang menghidupkan suasana. Terapkan prinsip emas: jangan tidur sebelum berbaikan dan selesaikan perbedaan dengan pelukan hangat.',
    keyTakeaway: 'Jangan membesar-besarkan hal kecil dan selalu utamakan pelukan damai.'
  },
  7: {
    name: 'Sujanan',
    remainder: 7,
    title: 'Sujanan (Ujian Kesetiaan & Komitmen)',
    score: 81,
    pillClass: 'bg-purple-100 text-purple-900',
    bgClass: 'bg-purple-50/50 border-purple-200/80',
    accentColor: 'text-purple-600',
    icon: 'fa-solid fa-eye',
    traditionalMeaning:
      'Mengisyaratkan pentingnya menjaga batas pergaulan dan waspada terhadap potensi rasa cemburu atau pihak ketiga yang menguji kesetiaan.',
    modernWisdom:
      'Jadikan ini sebagai motivasi untuk membangun transparansi total tanpa rahasia. Buat batasan yang sehat dengan dunia luar dan selalu prioritaskan perasaan pasangan di atas segalanya.',
    keyTakeaway: 'Transparansi penuh, saling menjaga rasa percaya, dan apresiasi kesetiaan.'
  },
  8: {
    name: 'Pesthi',
    remainder: 8,
    title: 'Pesthi (Ayem Tentrem Hingga Akhir Hayat)',
    score: 99,
    pillClass: 'bg-emerald-100 text-emerald-900',
    bgClass: 'bg-emerald-50/50 border-emerald-200/80',
    accentColor: 'text-emerald-600',
    icon: 'fa-solid fa-dove',
    traditionalMeaning:
      'Simbol ketenteraman sejati. Rumah tangga rukun, damai, dan adem ayem hingga hari tua tanpa goncangan besar.',
    modernWisdom:
      'Ketenangan batin adalah anugerah terbesar dalam berumah tangga. Jaga keharmonisan ini dengan saling menemani, menghormati, dan merawat cinta hingga akhir hayat.',
    keyTakeaway: 'Kedamaian hati, saling menghormati, dan kelembutan tutur kata.'
  }
}

function calculateWetonFromDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))

  // Anchor: 1 Januari 2024 (Senin Pahing)
  const anchorDate = new Date(Date.UTC(2024, 0, 1, 12, 0, 0))
  const diffDays = Math.round((targetDate.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24))

  // Day of week: 0 = Minggu, 1 = Senin, ...
  const dayIndex = targetDate.getUTCDay()
  const dino = DINO_DATA[dayIndex]

  // Pasaran: 1 Jan 2024 was Pahing (index 1 of [Legi, Pahing, Pon, Wage, Kliwon])
  const pasaranIndex = (((diffDays % 5) + 5) % 5 + 1) % 5
  const pasaran = PASARAN_DATA[pasaranIndex]

  const totalNeptu = dino.neptu + pasaran.neptu

  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(year, month - 1, day))

  return {
    dino,
    pasaran,
    wetonName: `${dino.name} ${pasaran.name}`,
    neptu: totalNeptu,
    dateFormatted
  }
}

function fillWetonSample(gName, gDob, bName, bDob) {
  wetonForm.groomName = gName
  wetonForm.groomDob = gDob
  wetonForm.brideName = bName
  wetonForm.brideDob = bDob
  calculateWeton()
}

function calculateWeton() {
  if (!wetonForm.groomDob || !wetonForm.brideDob) return

  isWetonCalculating.value = true
  wetonResult.value = null

  setTimeout(() => {
    const groomWeton = calculateWetonFromDate(wetonForm.groomDob)
    const brideWeton = calculateWetonFromDate(wetonForm.brideDob)
    const totalNeptu = groomWeton.neptu + brideWeton.neptu

    // Primbon modulo 8: remainder 1..8
    let remainder = totalNeptu % 8
    if (remainder === 0) remainder = 8

    const category = PRIMBON_CATEGORIES[remainder]

    isWetonCalculating.value = false
    wetonResult.value = {
      groomName: wetonForm.groomName || 'Calon Pria',
      brideName: wetonForm.brideName || 'Calon Wanita',
      groom: groomWeton,
      bride: brideWeton,
      totalNeptu,
      category
    }

    nextTick(() => {
      const el = document.getElementById('weton-result-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, 500)
}

function shareWetonResultWA() {
  if (!wetonResult.value) return
  const r = wetonResult.value
  const text = `Hasil Hitungan Weton Jodoh Primbon Jawa di SatuUndangan:
🤵 ${r.groomName}: ${r.groom.wetonName} (Neptu ${r.groom.neptu})
👰 ${r.brideName}: ${r.bride.wetonName} (Neptu ${r.bride.neptu})
Total Neptu Jodoh: ${r.totalNeptu} -> Sisa ${r.category.remainder}: ${r.category.name} (${r.category.title})

Makna & Nasihat:
"${r.category.modernWisdom}"

💡 Di SatuUndangan bisa bikin & coba-coba desain undangan pernikahan GRATIS dulu loh (bayar cuma pas mau sebar link)!

Cek weton pernikahanmu di: https://satuundangan.id/tools/love-calculator`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

function copyWetonResult() {
  if (!wetonResult.value) return
  const r = wetonResult.value
  const text = `💍 Hitungan Neptu & Weton Jodoh Jawa
Pria: ${r.groomName} (${r.groom.wetonName}, Neptu ${r.groom.neptu})
Wanita: ${r.brideName} (${r.bride.wetonName}, Neptu ${r.bride.neptu})
Total Neptu: ${r.totalNeptu} (Dibagi 8 = Sisa ${r.category.remainder}: ${r.category.name})
Kategori: ${r.category.title}
Nasihat Bijak: "${r.category.modernWisdom}"

✨ Info: Bisa bikin & coba desain undangan digital berdua GRATIS dulu tanpa biaya di awal:
https://satuundangan.id/tools/love-calculator`

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      copiedWeton.value = true
      setTimeout(() => (copiedWeton.value = false), 2500)
    })
  }
}

function resetWetonForm() {
  wetonForm.groomName = ''
  wetonForm.groomDob = ''
  wetonForm.brideName = ''
  wetonForm.brideDob = ''
  wetonResult.value = null
}

// Sync nameForm and wetonForm if user types in either
watch(
  () => nameForm.name1,
  (val) => {
    if (val && !wetonForm.groomName) wetonForm.groomName = val
  }
)
watch(
  () => nameForm.name2,
  (val) => {
    if (val && !wetonForm.brideName) wetonForm.brideName = val
  }
)

// --- FAQ Accordion State ---
const openFaqIndex = ref(0)
const toggleFaq = (idx) => {
  openFaqIndex.value = openFaqIndex.value === idx ? null : idx
}

const faqs = [
  {
    q: 'Bagaimana kecocokan nama pasangan dihitung?',
    a: 'Perhitungan ini memadukan harmoni nama kalian berdua untuk melihat chemistry, bahasa cinta, dan kekompakan karakter. Hasilnya selalu konsisten dan dirancang khusus agar seru dibagikan ke pasangan atau media sosial!'
  },
  {
    q: 'Bagaimana rumus perhitungan Weton Jodoh Primbon Jawa dihitung?',
    a: 'Kami mengonversi tanggal lahir masehi ke siklus penanggalan Jawa: 7 Hari Saptawara (Minggu=5, Senin=4, Selasa=3, Rabu=7, Kamis=8, Jumat=6, Sabtu=9) dan 5 Pasaran Pancawara (Legi=5, Pahing=9, Pon=7, Wage=4, Kliwon=8). Nilai neptu kedua mempelai dijumlahkan lalu dibagi dengan angka 8 untuk mendapatkan salah satu dari 8 kategori primbon klasik: Pegat, Ratu, Jodoh, Topo, Tinari, Padu, Sujanan, atau Pesthi.'
  },
  {
    q: 'Apakah hasil Weton menentukan nasib pernikahan selamanya?',
    a: 'Tidak. Budaya Primbon Jawa adalah warisan kearifan lokal luhur yang berfungsi sebagai sarana mawas diri (introspeksi). Kunci pernikahan langgeng, berkah, dan bahagia sejati terletak pada niat baik, komunikasi terbuka, saling memaafkan, dan komitmen bersama di hadapan Tuhan Yang Maha Esa.'
  },
  {
    q: 'Setelah menghitung kecocokan, apa langkah selanjutnya di SatuUndangan?',
    a: 'Kalian bisa langsung memilih desain undangan digital eksklusif di katalog SatuUndangan, mencoba Studio Editor secara gratis tanpa komitmen, atau menggunakan modul Wedding Planner & Kalkulator Budget untuk merencanakan rincian biaya pernikahan kalian berdua!'
  }
]
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.35s ease-out forwards;
}

.animate-scaleUp {
  animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
