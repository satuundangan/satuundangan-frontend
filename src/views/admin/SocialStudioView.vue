<template>
  <div class="flex h-screen bg-[#f8f7f4] text-stone-800 overflow-hidden font-sans select-none">
    <!-- LEFT SIDEBAR: Studio Editor Style Vertical Sub-Nav -->
    <nav class="w-16 md:w-20 bg-white border-r border-stone-200/80 flex flex-col items-center py-5 justify-between z-30 shrink-0 shadow-xs">
      <div class="flex flex-col items-center gap-4 w-full">
        <!-- Logo -->
        <router-link
          to="/admin"
          class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          title="Kembali ke Dashboard Admin"
        >
          <img src="/logo_satuundangan.png" alt="Satu Undangan" class="w-full h-full object-contain" />
        </router-link>

        <div class="w-8 h-[1px] bg-stone-200"></div>

        <!-- Navigation Tool Tabs -->
        <div class="flex flex-col items-center gap-2 w-full px-2">
          <button
            v-for="tab in SIDEBAR_TABS"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all"
            :class="
              activeTab === tab.id
                ? 'bg-mocha text-white shadow-lg shadow-mocha/20 scale-105 font-bold'
                : 'text-stone-400 hover:text-mocha hover:bg-stone-50'
            "
            :title="tab.label"
          >
            <i :class="['pi', tab.icon, 'text-base md:text-lg']"></i>
            <span class="text-[9px] uppercase font-bold tracking-wider scale-95">{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Exit link -->
      <router-link
        to="/admin"
        class="w-10 h-10 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
        title="Keluar ke Dashboard Admin"
      >
        <i class="pi pi-sign-out text-base"></i>
      </router-link>
    </nav>

    <!-- SUB-PANEL: Tool Drawer (Clean Studio White) -->
    <div class="w-88 shrink-0 bg-white border-r border-stone-200/80 flex flex-col h-full z-20 overflow-hidden shadow-sm">
      <!-- Drawer Header -->
      <div class="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 class="font-serif font-bold text-base text-stone-900 leading-tight">
            {{ currentTabTitle }}
          </h2>
          <p class="text-[10px] text-stone-400">Sesuaikan tampilan postingan</p>
        </div>
        <span class="text-[10px] bg-mocha/10 text-mocha font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          IG Creator
        </span>
      </div>

      <!-- Drawer Content -->
      <div class="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
        <!-- TAB 1: TEMPLATES & PRESETS -->
        <div v-if="activeTab === 'templates'" class="space-y-5">
          <!-- 1. FULL CAROUSEL DECK PRESETS (Loads All Slides at Once!) -->
          <div class="p-4 rounded-2xl bg-[#fffaf3] border border-amber-200/70 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-mocha flex items-center gap-1.5">
                <i class="pi pi-sparkles text-xs text-amber-500"></i> Full Carousel Decks
              </span>
              <span class="text-[9px] bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-full font-bold">1-Klik 5-7 Slide</span>
            </div>
            <p class="text-[11px] text-stone-600 leading-relaxed">
              Langsung muat 1 paket carousel cerita lengkap (Cover s/d CTA) ke timeline bawah:
            </p>
            <div class="space-y-1.5">
              <button
                v-for="deck in FULL_CAROUSEL_DECKS"
                :key="deck.id"
                @click="loadFullCarouselDeck(deck)"
                class="w-full px-3 py-2.5 rounded-xl bg-white hover:bg-mocha/5 hover:border-mocha/40 border border-amber-200/80 text-stone-800 hover:text-mocha transition-all flex items-center justify-between shadow-xs group"
              >
                <div class="flex items-center gap-2 truncate">
                  <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span class="font-bold text-xs truncate">{{ deck.title }}</span>
                </div>
                <span class="text-[10px] bg-stone-100 group-hover:bg-mocha/10 group-hover:text-mocha text-stone-500 px-2 py-0.5 rounded-md font-semibold shrink-0">
                  {{ deck.slides.length }} Slide
                </span>
              </button>
            </div>
          </div>

          <!-- 2. PILIHAN 12 TIPE LAYOUT -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block font-bold text-stone-800">Pilih Tipe Layout Slide</label>
              <span class="text-[10px] text-stone-400 font-semibold">{{ TEMPLATE_TYPES.length }} Pilihan</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="t in TEMPLATE_TYPES"
                :key="t.id"
                @click="currentSlide.type = t.id"
                class="p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 shadow-xs"
                :class="
                  currentSlide.type === t.id
                    ? 'bg-mocha text-white border-mocha font-bold shadow-md shadow-mocha/20'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                "
              >
                <i :class="['pi', t.icon, 'text-sm', currentSlide.type === t.id ? 'text-white' : 'text-mocha']"></i>
                <span class="text-[10px] leading-tight">{{ t.name }}</span>
              </button>
            </div>
          </div>

          <!-- 3. SINKRONISASI MASSAL (DECK WIDE TOOLS) -->
          <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span class="font-bold text-stone-800 text-[11px] block">Sinkronisasi Seluruh Slide</span>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="applyPaletteToAll(currentPal)"
                class="px-2.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-mocha text-stone-700 hover:text-mocha font-bold text-[10px] flex items-center justify-center gap-1 shadow-xs transition-colors"
                title="Terapkan palet warna saat ini ke semua slide di carousel"
              >
                <i class="pi pi-palette text-xs text-mocha"></i>
                <span>Samakan Warna</span>
              </button>
              <button
                @click="applyFontToAll"
                class="px-2.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-mocha text-stone-700 hover:text-mocha font-bold text-[10px] flex items-center justify-center gap-1 shadow-xs transition-colors"
                title="Terapkan jenis font saat ini ke semua slide di carousel"
              >
                <i class="pi pi-pencil text-xs text-mocha"></i>
                <span>Samakan Font</span>
              </button>
            </div>
          </div>

          <!-- Layout Specific Pickers -->
          <div v-if="currentSlide.type === 'showcase'" class="space-y-2 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Pilih Desain Mockup Undangan</label>
            <select
              v-model="currentSlide.templateSlug"
              class="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:bg-white focus:border-mocha outline-none capitalize shadow-xs"
            >
              <option v-for="tpl in TEMPLATE_LIST" :key="tpl.slug" :value="tpl.slug">
                {{ tpl.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- TAB 2: TEXT & CONTENT EDITOR -->
        <div v-if="activeTab === 'text'" class="space-y-4">
          <!-- Category Badge -->
          <div>
            <label class="block font-semibold text-stone-700 mb-1">Badge Kategori</label>
            <input
              v-model="currentSlide.badge"
              type="text"
              placeholder="Contoh: TIPS NIKAH, BONGKAR BIAYA"
              class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:bg-white focus:border-mocha outline-none shadow-xs"
            />
          </div>

          <!-- Title / Headline -->
          <div>
            <label class="block font-semibold text-stone-700 mb-1">Headline Utama</label>
            <textarea
              v-model="currentSlide.title"
              rows="3"
              placeholder="Tulis headline pemikat..."
              class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:bg-white focus:border-mocha outline-none leading-relaxed shadow-xs"
            ></textarea>
          </div>

          <!-- Subtitle / Body -->
          <div>
            <label class="block font-semibold text-stone-700 mb-1">Subtitle / Keterangan</label>
            <textarea
              v-model="currentSlide.subtitle"
              rows="2"
              placeholder="Tulis penjelasan..."
              class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:bg-white focus:border-mocha outline-none leading-relaxed shadow-xs"
            ></textarea>
          </div>

          <!-- DYNAMIC CONTENT BY LAYOUT TYPE -->

          <!-- 1. Slide Edukasi: Points List -->
          <div v-if="currentSlide.type === 'body'" class="space-y-2 pt-2 border-t border-stone-100">
            <label class="block font-semibold text-stone-700">Daftar Poin</label>
            <div v-for="(p, i) in currentSlide.points" :key="i" class="flex gap-2 items-center">
              <span class="font-bold text-mocha w-4 text-center">{{ i + 1 }}</span>
              <input
                v-model="currentSlide.points[i]"
                type="text"
                class="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:bg-white focus:border-mocha outline-none"
              />
              <button @click="removePoint(i)" class="text-stone-400 hover:text-rose-500 p-1" title="Hapus poin">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <button
              @click="addPoint"
              class="w-full py-2 border border-dashed border-stone-300 hover:border-mocha rounded-xl text-stone-500 hover:text-mocha text-xs flex items-center justify-center gap-1.5 transition-colors font-medium"
            >
              <i class="pi pi-plus text-xs"></i> Tambah Poin
            </button>
          </div>

          <!-- 2. Comparison (Versus): Kiri vs Kanan -->
          <div v-if="currentSlide.type === 'comparison'" class="space-y-3 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Konten Perbandingan (Versus)</label>
            <div class="space-y-2">
              <span class="text-[11px] font-bold text-rose-600 block">Sisi Kiri (Masalah / Konvensional):</span>
              <input v-model="currentSlide.versusLeftTitle" placeholder="Judul Kiri (cth: Cetak Fisik)" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs" />
              <textarea v-model="currentSlide.versusLeftPoints" rows="2" placeholder="Poin kiri (pisahkan koma)" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs"></textarea>
            </div>
            <div class="space-y-2">
              <span class="text-[11px] font-bold text-emerald-600 block">Sisi Kanan (Solusi Satu Undangan):</span>
              <input v-model="currentSlide.versusRightTitle" placeholder="Judul Kanan (cth: Satu Undangan)" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs" />
              <textarea v-model="currentSlide.versusRightPoints" rows="2" placeholder="Poin kanan (pisahkan koma)" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs"></textarea>
            </div>
          </div>

          <!-- 3. Testimonial Content -->
          <div v-if="currentSlide.type === 'testimonial'" class="space-y-2.5 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Konten Ulasan Pengantin</label>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Nama Mempelai</label>
              <input v-model="currentSlide.testiAuthor" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs" />
            </div>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Kota / Asal</label>
              <input v-model="currentSlide.testiRole" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs" />
            </div>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Rating Bintang</label>
              <input type="number" v-model.number="currentSlide.testiRating" min="1" max="5" class="w-16 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-bold text-amber-500" />
            </div>
          </div>

          <!-- 4. Weton Jodoh Jawa -->
          <div v-if="currentSlide.type === 'weton'" class="space-y-2 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Hitungan Primbon Jawa</label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-stone-500 block mb-0.5">Weton Pria</label>
                <input v-model="currentSlide.wetonPria" class="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs" />
              </div>
              <div>
                <label class="text-[10px] text-stone-500 block mb-0.5">Weton Wanita</label>
                <input v-model="currentSlide.wetonWanita" class="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs" />
              </div>
            </div>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Hasil Kecocokan</label>
              <input v-model="currentSlide.wetonStatus" class="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs font-bold text-mocha" />
            </div>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Makna Penafsiran</label>
              <textarea v-model="currentSlide.wetonMakna" rows="2" class="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs"></textarea>
            </div>
          </div>

          <!-- 5. Chat Bubble Simulation -->
          <div v-if="currentSlide.type === 'chat_bubble'" class="space-y-2 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Dialog Chat WhatsApp</label>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Pesan Pertama (Mempelai Pria/Wanita)</label>
              <textarea v-model="currentSlide.chatMsg1" rows="2" class="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs"></textarea>
            </div>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Balasan Kedua (Solusi Satu Undangan)</label>
              <textarea v-model="currentSlide.chatMsg2" rows="2" class="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs"></textarea>
            </div>
          </div>

          <!-- 6. Bento Grid Fitur -->
          <div v-if="currentSlide.type === 'bento'" class="space-y-3 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Item Bento Grid (4 Fitur)</label>
            <div v-for="(b, idx) in (currentSlide.bentoItems || defaultBentoItems)" :key="idx" class="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <span class="text-[10px] font-bold text-mocha">Fitur 0{{ idx + 1 }}</span>
              <input v-model="b.title" placeholder="Judul Fitur" class="w-full px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold" />
              <input v-model="b.desc" placeholder="Keterangan singkat" class="w-full px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs" />
            </div>
          </div>

          <!-- 7. FAQ / Tanya Jawab Manten -->
          <div v-if="currentSlide.type === 'faq'" class="space-y-3 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Tanya Jawab Manten (FAQ)</label>
            <div class="space-y-2">
              <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span class="text-[10px] font-bold text-mocha">Pertanyaan 1</span>
                <input v-model="currentSlide.faqQ1" class="w-full px-2.5 py-1 rounded bg-white border border-stone-200 text-xs font-semibold" />
                <textarea v-model="currentSlide.faqA1" rows="2" class="w-full px-2.5 py-1 rounded bg-white border border-stone-200 text-xs" placeholder="Jawaban"></textarea>
              </div>
              <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span class="text-[10px] font-bold text-mocha">Pertanyaan 2</span>
                <input v-model="currentSlide.faqQ2" class="w-full px-2.5 py-1 rounded bg-white border border-stone-200 text-xs font-semibold" />
                <textarea v-model="currentSlide.faqA2" rows="2" class="w-full px-2.5 py-1 rounded bg-white border border-stone-200 text-xs" placeholder="Jawaban"></textarea>
              </div>
              <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span class="text-[10px] font-bold text-mocha">Pertanyaan 3</span>
                <input v-model="currentSlide.faqQ3" class="w-full px-2.5 py-1 rounded bg-white border border-stone-200 text-xs font-semibold" />
                <textarea v-model="currentSlide.faqA3" rows="2" class="w-full px-2.5 py-1 rounded bg-white border border-stone-200 text-xs" placeholder="Jawaban"></textarea>
              </div>
            </div>
          </div>

          <!-- 8. Closing Call to Action (CTA) -->
          <div v-if="currentSlide.type === 'cta'" class="space-y-2 pt-2 border-t border-stone-100">
            <label class="block font-bold text-stone-800">Pengaturan Closing CTA</label>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Kode Promo / Voucher</label>
              <input v-model="currentSlide.ctaPromo" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono font-bold" />
            </div>
            <div>
              <label class="text-[10px] text-stone-500 block mb-0.5">Instruksi Aksi</label>
              <input v-model="currentSlide.ctaAction" class="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs" />
            </div>
          </div>

          <!-- Typography Controls -->
          <div class="pt-4 border-t border-stone-100 space-y-3.5">
            <div class="flex items-center justify-between">
              <label class="block font-bold text-stone-800">Pengaturan Tipografi</label>
              <button
                @click="applyFontToAll"
                class="text-[10px] text-mocha font-bold hover:underline flex items-center gap-1"
                title="Terapkan font ini ke semua slide di carousel"
              >
                <i class="pi pi-sync text-[9px]"></i>
                <span>Terapkan ke Semua</span>
              </button>
            </div>
            <div>
              <label class="text-[11px] text-stone-500 block mb-1">Jenis Huruf (Font Family)</label>
              <select
                v-model="currentSlide.fontFamily"
                class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs focus:bg-white focus:border-mocha outline-none shadow-xs"
              >
                <option value="font-serif">Playfair Display (Luxury Editorial)</option>
                <option value="font-sans">Inter (Modern Clean Sans)</option>
                <option value="font-montserrat">Montserrat (Bold Modern)</option>
                <option value="font-alex">Alex Brush (Romantic Script)</option>
              </select>
            </div>

            <div>
              <div class="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                <span>Ukuran Judul</span>
                <span class="font-bold text-mocha">{{ currentSlide.fontSize || 66 }}px</span>
              </div>
              <input
                type="range"
                v-model.number="currentSlide.fontSize"
                min="38"
                max="96"
                step="2"
                class="w-full accent-mocha cursor-pointer"
              />
            </div>

            <div class="flex items-center justify-between pt-1">
              <span class="text-[11px] text-stone-500">Format Huruf</span>
              <div class="flex items-center gap-1 bg-stone-100 rounded-xl p-0.5 border border-stone-200">
                <button
                  v-for="align in ['left', 'center', 'right']"
                  :key="align"
                  @click="currentSlide.textAlign = align"
                  class="px-2.5 py-1 rounded-lg text-xs transition-colors"
                  :class="currentSlide.textAlign === align ? 'bg-white text-mocha font-bold shadow-xs' : 'text-stone-500 hover:text-stone-800'"
                  :title="`Rata ${align}`"
                >
                  <i :class="`pi pi-align-${align}`"></i>
                </button>
                <button
                  @click="currentSlide.isUppercase = !currentSlide.isUppercase"
                  class="px-2.5 py-1 rounded-lg text-xs transition-colors font-bold"
                  :class="currentSlide.isUppercase ? 'bg-white text-mocha shadow-xs' : 'text-stone-500 hover:text-stone-800'"
                  title="Toggle Huruf Kapital (UPPERCASE)"
                >
                  AA
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: COLORS & PALETTE -->
        <div v-if="activeTab === 'colors'" class="space-y-4">
          <!-- Scope Toggle -->
          <div class="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-200 shadow-xs">
            <span class="text-[11px] font-bold text-stone-700">Terapkan Perubahan Ke:</span>
            <div class="flex items-center gap-1 bg-white rounded-xl p-0.5 border border-stone-200 text-[10px]">
              <button
                @click="applyScope = 'current'"
                class="px-2.5 py-1 rounded-lg font-bold transition-all"
                :class="applyScope === 'current' ? 'bg-mocha text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'"
              >
                Slide Ini
              </button>
              <button
                @click="applyScope = 'all'"
                class="px-2.5 py-1 rounded-lg font-bold transition-all"
                :class="applyScope === 'all' ? 'bg-mocha text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'"
              >
                Semua Slide
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="block font-bold text-stone-800">Preset Palet Brand</label>
            <button
              @click="applyPaletteToAll(currentPal)"
              class="text-[10px] text-mocha font-bold hover:underline flex items-center gap-1"
              title="Samakan warna semua slide dengan palet saat ini"
            >
              <i class="pi pi-sync text-[9px]"></i>
              <span>Terapkan ke Semua</span>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="pal in PALETTES"
              :key="pal.id"
              @click="applyPalette(pal)"
              class="p-3 rounded-2xl border flex items-center justify-between transition-all shadow-xs"
              :class="currentSlide.paletteId === pal.id && !hasCustomHex ? 'border-mocha bg-mocha/5 font-bold' : 'border-stone-200 bg-white hover:bg-stone-50'"
            >
              <div class="flex items-center gap-3">
                <div class="flex -space-x-2">
                  <span class="w-6 h-6 rounded-full border border-white shadow-xs" :style="{ backgroundColor: pal.bg }"></span>
                  <span class="w-6 h-6 rounded-full border border-white shadow-xs" :style="{ backgroundColor: pal.primary }"></span>
                  <span class="w-6 h-6 rounded-full border border-white shadow-xs" :style="{ backgroundColor: pal.accent }"></span>
                </div>
                <span class="font-medium text-xs text-stone-800">{{ pal.name }}</span>
              </div>
              <i v-if="currentSlide.paletteId === pal.id && !hasCustomHex" class="pi pi-check text-mocha text-xs font-bold"></i>
            </button>
          </div>

          <!-- Custom Color Picker & CLEAR BUTTON -->
          <div class="pt-4 border-t border-stone-100 space-y-3.5">
            <div class="flex items-center justify-between">
              <label class="font-bold text-stone-800">Kustomisasi HEX Manual</label>
              <button
                @click="clearCustomHex"
                :disabled="!hasCustomHex"
                class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 shadow-xs"
                :class="hasCustomHex ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer' : 'text-stone-300 border border-stone-200 bg-stone-50 cursor-not-allowed'"
                title="Hapus kustomisasi HEX dan kembali ke palet brand"
              >
                <i class="pi pi-refresh text-[9px]"></i>
                <span>Clear / Reset</span>
              </button>
            </div>

            <p v-if="hasCustomHex" class="text-[10px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
              ⚡ Warna manual sedang aktif. Klik <strong>Clear</strong> untuk kembali ke warna palet asli.
            </p>

            <div class="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/80">
              <span class="text-[11px] text-stone-600 font-medium">Background Kanvas</span>
              <div class="flex items-center gap-2">
                <input type="color" v-model="currentSlide.customBg" class="w-7 h-7 rounded border border-stone-300 cursor-pointer bg-transparent" />
                <span class="font-mono text-[11px] text-stone-500 uppercase">{{ currentSlide.customBg || currentPal.bg }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/80">
              <span class="text-[11px] text-stone-600 font-medium">Warna Judul (Primary)</span>
              <div class="flex items-center gap-2">
                <input type="color" v-model="currentSlide.customPrimary" class="w-7 h-7 rounded border border-stone-300 cursor-pointer bg-transparent" />
                <span class="font-mono text-[11px] text-stone-500 uppercase">{{ currentSlide.customPrimary || currentPal.primary }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/80">
              <span class="text-[11px] text-stone-600 font-medium">Warna Aksen / Emas</span>
              <div class="flex items-center gap-2">
                <input type="color" v-model="currentSlide.customAccent" class="w-7 h-7 rounded border border-stone-300 cursor-pointer bg-transparent" />
                <span class="font-mono text-[11px] text-stone-500 uppercase">{{ currentSlide.customAccent || currentPal.accent }}</span>
              </div>
            </div>

            <!-- Background Pattern Switcher -->
            <div class="pt-2 space-y-2">
              <span class="text-[11px] text-stone-600 font-semibold block mb-1">Tekstur Latar Belakang</span>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="pat in [
                    { id: 'glow', label: 'Glow Emas' },
                    { id: 'mesh', label: 'Grid Mesh' },
                    { id: 'clean', label: 'Polos' },
                  ]"
                  :key="pat.id"
                  @click="currentSlide.bgPattern = pat.id"
                  class="py-1.5 rounded-xl border text-[11px] font-medium transition-all"
                  :class="currentSlide.bgPattern === pat.id ? 'bg-mocha text-white border-mocha font-bold shadow-xs' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'"
                >
                  {{ pat.label }}
                </button>
              </div>
              <button
                @click="applyBgPatternToAll"
                class="w-full py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <i class="pi pi-check text-[9px] text-mocha"></i>
                <span>Terapkan Latar ke Semua Slide</span>
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 4: ELEMENTS & STICKERS -->
        <div v-if="activeTab === 'elements'" class="space-y-4">
          <div>
            <label class="block font-bold text-stone-800 mb-1">Stiker Anabul & 3D Clay</label>
            <p class="text-[11px] text-stone-500 mb-2.5">Klik stiker untuk pasang di kanvas:</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="stk in STICKERS_LIST"
                :key="stk.id"
                @click="toggleSticker(stk)"
                class="p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center group shadow-xs"
                :class="currentSlide.selectedStickers.includes(stk.file) ? 'border-mocha bg-mocha/10 ring-2 ring-mocha/20' : 'border-stone-200 bg-stone-50 hover:bg-white'"
              >
                <img :src="stk.file" :alt="stk.name" class="w-10 h-10 object-contain drop-shadow group-hover:scale-110 transition-transform" />
                <span class="text-[10px] text-stone-700 font-medium truncate w-full">{{ stk.name }}</span>
              </button>
            </div>
          </div>

          <!-- Ornamen Adat Nusantara -->
          <div class="pt-4 border-t border-stone-100">
            <label class="block font-bold text-stone-800 mb-1">Ornamen Adat Emas</label>
            <p class="text-[11px] text-stone-500 mb-2.5">Ornamen khas nusantara resmi:</p>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="orn in ORNAMENTS_LIST"
                :key="orn.id"
                @click="toggleOrnament(orn)"
                class="p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all shadow-xs"
                :class="currentSlide.selectedOrnament === orn.file ? 'border-mocha bg-mocha/10 ring-2 ring-mocha/20' : 'border-stone-200 bg-stone-50 hover:bg-white'"
              >
                <img :src="orn.file" :alt="orn.name" class="w-8 h-8 object-contain" />
                <span class="text-[11px] text-stone-700 font-medium truncate">{{ orn.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 5: UPLOAD MEDIA -->
        <div v-if="activeTab === 'upload'" class="space-y-4">
          <label class="block font-bold text-stone-800">Upload Foto Pengantin / Klien</label>
          <div
            @click="$refs.fileInputRef.click()"
            class="border-2 border-dashed border-stone-300 hover:border-mocha rounded-2xl p-6 text-center cursor-pointer bg-stone-50 hover:bg-mocha/5 transition-all group"
          >
            <i class="pi pi-cloud-upload text-3xl text-stone-400 group-hover:text-mocha mb-2 transition-colors"></i>
            <p class="font-bold text-xs text-stone-700 group-hover:text-mocha">Pilih Foto dari Komputer</p>
            <p class="text-[10px] text-stone-400 mt-1">PNG, JPG, WebP (Maks 10MB)</p>
            <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
          </div>

          <div v-if="currentSlide.customImage" class="p-3 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <img :src="currentSlide.customImage" class="w-10 h-10 rounded-xl object-cover border border-stone-200" />
              <div>
                <span class="font-bold text-xs text-stone-800 block">Foto Kustom Aktif</span>
                <span class="text-[10px] text-emerald-600 font-medium">Terpasang di Kanvas</span>
              </div>
            </div>
            <button @click="currentSlide.customImage = null" class="text-stone-400 hover:text-rose-500 p-1.5" title="Hapus foto">
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN STAGE & TIMELINE -->
    <div class="flex-1 flex flex-col h-full bg-[#eeebe5] relative overflow-hidden">
      <!-- TOP CONTROL TOOLBAR -->
      <header class="h-16 border-b border-stone-200 bg-white px-6 flex items-center justify-between shadow-xs z-10">
        <!-- Left: Undo, Redo, Dimensions -->
        <div class="flex items-center gap-3">
          <!-- UNDO / REDO BUTTONS -->
          <div class="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
            <button
              @click="undo"
              :disabled="!canUndo"
              class="px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="canUndo ? 'text-stone-700 hover:text-mocha hover:bg-white' : 'text-stone-400'"
              title="Undo (Cmd+Z / Ctrl+Z)"
            >
              <i class="pi pi-undo text-xs"></i>
              <span class="hidden sm:inline font-semibold">Undo</span>
            </button>
            <button
              @click="redo"
              :disabled="!canRedo"
              class="px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="canRedo ? 'text-stone-700 hover:text-mocha hover:bg-white' : 'text-stone-400'"
              title="Redo (Cmd+Y / Ctrl+Y)"
            >
              <i class="pi pi-refresh text-xs"></i>
              <span class="hidden sm:inline font-semibold">Redo</span>
            </button>
          </div>

          <div class="w-[1px] h-5 bg-stone-200"></div>

          <!-- Aspect Ratio Switcher -->
          <div class="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200 text-xs">
            <button
              v-for="dim in ASPECT_RATIOS"
              :key="dim.id"
              @click="currentDimension = dim"
              class="px-3 py-1.5 rounded-lg transition-all font-bold flex items-center gap-1.5"
              :class="currentDimension.id === dim.id ? 'bg-mocha text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'"
            >
              <i :class="['pi', dim.icon, 'text-xs']"></i>
              <span>{{ dim.label }}</span>
            </button>
          </div>
        </div>

        <!-- Right: Safe Zone, Zoom Controls, Copy Image -->
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-600 hover:text-stone-900 select-none">
            <input type="checkbox" v-model="showSafeZone" class="rounded border-stone-300 text-mocha focus:ring-mocha bg-stone-50 cursor-pointer" />
            <span>Safe Zone 1:1 Profile</span>
          </label>

          <div class="w-[1px] h-5 bg-stone-200"></div>

          <!-- Copy Image Direct to Clipboard -->
          <button
            @click="copyImageToClipboard"
            :disabled="isExporting"
            class="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-mocha/40 bg-stone-50 hover:bg-white text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="Salin gambar langsung ke clipboard tanpa download"
          >
            <i class="pi pi-copy text-xs text-mocha"></i>
            <span>Salin Gambar</span>
          </button>

          <!-- Zoom -->
          <div class="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200 text-xs">
            <button
              v-for="sc in [0.35, 0.45, 0.6]"
              :key="sc"
              @click="previewScale = sc"
              class="px-2.5 py-1 rounded-lg text-xs font-bold"
              :class="previewScale === sc ? 'bg-white text-mocha shadow-xs' : 'text-stone-500 hover:text-stone-800'"
            >
              {{ Math.round(sc * 100) }}%
            </button>
          </div>
        </div>
      </header>

      <!-- CANVAS STAGE VIEWPORT (Drafting Table Feel) -->
      <div class="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar">
        <!-- Scale Wrapper -->
        <div
          class="transition-transform duration-150 origin-center select-none shrink-0"
          :style="{ transform: `scale(${previewScale})` }"
        >
          <!-- THE 1080x1350 / 1080x1920 CANVAS -->
          <div
            ref="canvasRef"
            id="export-canvas"
            class="relative shadow-[0_20px_60px_rgba(40,30,20,0.18)] flex flex-col justify-between overflow-hidden transition-all duration-300 rounded-sm"
            :style="{
              width: `${currentDimension.width}px`,
              height: `${currentDimension.height}px`,
              backgroundColor: activeBg,
              color: activeText,
            }"
          >
            <!-- Background Radial Glow / Texture -->
            <div
              v-if="currentSlide.bgPattern !== 'clean'"
              class="absolute inset-0 pointer-events-none"
              :style="{
                backgroundImage:
                  currentSlide.bgPattern === 'mesh'
                    ? `radial-gradient(${activeAccent}33 1px, transparent 1px)`
                    : `
                    radial-gradient(circle at 10% 10%, ${activePrimary}15, transparent 50%),
                    radial-gradient(circle at 90% 90%, ${activeAccent}20, transparent 55%)
                  `,
                backgroundSize: currentSlide.bgPattern === 'mesh' ? '32px 32px' : 'auto',
              }"
            ></div>

            <!-- Double Hairline Luxury Gold Border -->
            <div class="absolute inset-[36px] border border-amber-600/30 pointer-events-none"></div>
            <div class="absolute inset-[48px] border border-amber-600/15 pointer-events-none"></div>

            <!-- Optional Ornament (Top Corner Emblem) -->
            <div v-if="currentSlide.selectedOrnament" class="absolute top-10 right-14 w-28 h-28 pointer-events-none z-10 opacity-75">
              <img :src="currentSlide.selectedOrnament" class="w-full h-full object-contain filter drop-shadow" />
            </div>

            <!-- 1:1 Square Safe Zone Overlay for Feed Grid -->
            <div
              v-if="showSafeZone && currentDimension.id === 'feed'"
              class="absolute inset-x-0 top-[135px] h-[1080px] border-2 border-dashed border-rose-500/70 pointer-events-none z-50 flex items-start justify-end p-5"
            >
              <span class="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                Safe Zone Feed 1:1 (Grid Profile)
              </span>
            </div>

            <!-- CANVAS HEADER (TOP BAR) -->
            <div class="relative z-10 pt-16 px-16 flex items-center justify-between">
              <!-- REAL BRAND LOGO: SatuUndangan.id (Matching Web App) -->
              <div class="flex items-center gap-4">
                <img
                  src="/logo_satuundangan.png"
                  alt="Satu Undangan Logo"
                  class="h-16 w-16 object-contain rounded-2xl shadow-md border border-amber-600/20 bg-white p-1"
                />
                <div class="flex flex-col">
                  <div class="flex items-baseline leading-none">
                    <span class="font-serif text-3xl font-extrabold tracking-tight" :style="{ color: activePrimary }">
                      SatuUndangan
                    </span>
                    <span class="font-serif text-3xl font-extrabold tracking-tight" :style="{ color: activeAccent }">
                      .id
                    </span>
                  </div>
                  <span class="block text-[11px] uppercase tracking-[0.25em] font-bold opacity-60 mt-1">
                    Digital Wedding Invitation
                  </span>
                </div>
              </div>

              <!-- Category Badge & Slide Count Pill -->
              <div class="flex items-center gap-4">
                <div
                  v-if="currentSlide.badge"
                  class="px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border shadow-xs"
                  :style="{
                    backgroundColor: activeAccent + '22',
                    borderColor: activeAccent + '66',
                    color: activePrimary,
                  }"
                >
                  {{ currentSlide.badge }}
                </div>
                <div
                  class="px-4 py-2 rounded-full text-sm font-extrabold tracking-widest"
                  :style="{
                    backgroundColor: activeText + '15',
                    color: activeText,
                  }"
                >
                  {{ currentSlideIndex + 1 }} / {{ slides.length }}
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 1 - COVER HOOK -->
            <div
              v-if="currentSlide.type === 'cover'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto"
              :class="`text-${currentSlide.textAlign || 'left'}`"
            >
              <div class="flex items-center gap-3 mb-8 opacity-80" :class="currentSlide.textAlign === 'center' ? 'justify-center' : ''">
                <span class="w-16 h-[2px]" :style="{ backgroundColor: activeAccent }"></span>
                <i class="pi pi-sparkles text-sm" :style="{ color: activeAccent }"></i>
                <span class="w-16 h-[2px]" :style="{ backgroundColor: activeAccent }"></span>
              </div>

              <h1
                :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                :style="{
                  fontSize: `${currentSlide.fontSize || 66}px`,
                  color: activePrimary,
                }"
                class="font-black leading-[1.12] tracking-tight mb-8"
              >
                {{ currentSlide.title }}
              </h1>

              <p
                v-if="currentSlide.subtitle"
                class="text-[28px] font-light leading-[1.45] max-w-[850px] opacity-90"
                :class="currentSlide.textAlign === 'center' ? 'mx-auto' : ''"
              >
                {{ currentSlide.subtitle }}
              </p>

              <div v-if="currentSlide.customImage" class="mt-8 mx-auto w-[360px] h-[360px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80">
                <img :src="currentSlide.customImage" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 2 - BODY (POINTS) -->
            <div
              v-if="currentSlide.type === 'body'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto space-y-6"
            >
              <h2
                :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                :style="{
                  fontSize: `${(currentSlide.fontSize || 66) * 0.75}px`,
                  color: activePrimary,
                }"
                class="font-bold leading-tight"
              >
                {{ currentSlide.title }}
              </h2>

              <p v-if="currentSlide.subtitle" class="text-[24px] opacity-80 leading-relaxed mb-4">
                {{ currentSlide.subtitle }}
              </p>

              <div class="space-y-4">
                <div
                  v-for="(point, i) in currentSlide.points"
                  :key="i"
                  class="p-6 rounded-2xl border backdrop-blur-md flex items-start gap-5 shadow-sm"
                  :style="{
                    backgroundColor: currentPal.cardBg || '#ffffff',
                    borderColor: activePrimary + '25',
                  }"
                >
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 text-white shadow-xs"
                    :style="{ backgroundColor: activePrimary }"
                  >
                    0{{ i + 1 }}
                  </div>
                  <p class="text-[24px] font-medium leading-snug self-center" :style="{ color: activeText }">
                    {{ point }}
                  </p>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 3 - COMPARISON (VERSUS / SPLIT CARD) -->
            <div
              v-if="currentSlide.type === 'comparison'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto"
            >
              <div class="text-center mb-8">
                <h2
                  :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                  :style="{ fontSize: `${(currentSlide.fontSize || 66) * 0.75}px`, color: activePrimary }"
                  class="font-black leading-tight"
                >
                  {{ currentSlide.title }}
                </h2>
                <p v-if="currentSlide.subtitle" class="text-[22px] opacity-80 mt-2">
                  {{ currentSlide.subtitle }}
                </p>
              </div>

              <!-- Two Column Versus Grid -->
              <div class="grid grid-cols-2 gap-8">
                <!-- Left: Problem / Fisik -->
                <div class="p-8 rounded-3xl border-2 border-rose-300 bg-rose-50/70 shadow-lg flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-4 text-rose-600 font-black text-2xl uppercase tracking-wider">
                      <i class="pi pi-times-circle text-2xl"></i>
                      <span>{{ currentSlide.versusLeftTitle || 'Undangan Fisik' }}</span>
                    </div>
                    <ul class="space-y-4 text-stone-700 text-[20px]">
                      <li
                        v-for="(pt, idx) in (currentSlide.versusLeftPoints || 'Biaya cetak Rp 3-5 Juta,80% cuma dibuang ke tempat sampah,Repot antar satu per satu & ongkir mahal').split(',')"
                        :key="idx"
                        class="flex items-start gap-2.5 font-medium"
                      >
                        <span class="text-rose-500 font-bold shrink-0">✕</span>
                        <span>{{ pt.trim() }}</span>
                      </li>
                    </ul>
                  </div>
                  <span class="mt-8 text-center text-xs font-bold text-rose-500 uppercase tracking-widest block bg-rose-100 py-2 rounded-xl">
                    Boros Biaya & Waktu
                  </span>
                </div>

                <!-- Right: Satu Undangan Solusi -->
                <div class="p-8 rounded-3xl border-2 border-emerald-400 bg-emerald-50/90 shadow-xl flex flex-col justify-between relative transform -translate-y-2">
                  <span class="absolute -top-3.5 right-6 bg-emerald-600 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow">
                    Pilihan Cerdas
                  </span>
                  <div>
                    <div class="flex items-center gap-2 mb-4 text-emerald-800 font-black text-2xl uppercase tracking-wider">
                      <i class="pi pi-check-circle text-2xl text-emerald-600"></i>
                      <span>{{ currentSlide.versusRightTitle || 'Satu Undangan' }}</span>
                    </div>
                    <ul class="space-y-4 text-stone-800 text-[20px]">
                      <li
                        v-for="(pt, idx) in (currentSlide.versusRightPoints || 'Cukup bayar Rp 79.000 sekali,Sebar ke ribuan tamu via WhatsApp 1 klik,Tamu scan QR bebas antre di resepsi,Hemat 2.9 juta buat upgrade menu katering').split(',')"
                        :key="idx"
                        class="flex items-start gap-2.5 font-bold"
                      >
                        <span class="text-emerald-600 font-extrabold shrink-0">✓</span>
                        <span>{{ pt.trim() }}</span>
                      </li>
                    </ul>
                  </div>
                  <span class="mt-8 text-center text-xs font-bold text-emerald-800 uppercase tracking-widest block bg-emerald-100 py-2 rounded-xl">
                    Hemat Jutaan Rupiah
                  </span>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 4 - SHOWCASE MOCKUP -->
            <div v-if="currentSlide.type === 'showcase'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto text-center">
              <div class="mb-6">
                <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-2" :style="{ color: activeAccent }">
                  Koleksi Tema Pernikahan
                </span>
                <h2
                  :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                  :style="{
                    fontSize: `${(currentSlide.fontSize || 66) * 0.8}px`,
                    color: activePrimary,
                  }"
                  class="font-black leading-tight"
                >
                  {{ currentSlide.title }}
                </h2>
                <p v-if="currentSlide.subtitle" class="text-[22px] opacity-80 mt-2 max-w-[750px] mx-auto">
                  {{ currentSlide.subtitle }}
                </p>
              </div>

              <!-- Smartphone Frame with Real Template Screenshot -->
              <div class="relative w-[340px] h-[640px] mx-auto rounded-[46px] border-[10px] border-stone-900 bg-stone-950 shadow-[0_25px_60px_rgba(40,30,20,0.3)] overflow-hidden flex flex-col">
                <div class="w-32 h-5 bg-stone-900 rounded-b-2xl mx-auto z-30 shrink-0"></div>
                <div class="w-full flex-1 overflow-hidden relative bg-stone-100 flex items-start justify-center">
                  <img
                    :src="`/assets/templates/${currentSlide.templateSlug || 'dark-elegant'}.png`"
                    :alt="currentSlide.templateSlug"
                    class="w-full object-cover object-top"
                    @error="(e) => (e.target.src = '/assets/templates/dark-elegant.png')"
                  />
                  <!-- Price Pill -->
                  <div class="absolute bottom-5 inset-x-4 bg-stone-950/80 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl flex items-center justify-between shadow-xl">
                    <div>
                      <span class="text-[11px] text-amber-400 font-bold block uppercase tracking-wide">Mulai Dari</span>
                      <span class="text-lg font-black text-white">Rp 49.000</span>
                    </div>
                    <span class="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-1 rounded-md border border-emerald-500/30">
                      Aktif 1 Tahun
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 5 - TESTIMONIAL / REVIEW -->
            <div v-if="currentSlide.type === 'testimonial'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto">
              <div
                class="p-14 rounded-[36px] border shadow-xl backdrop-blur-md relative"
                :style="{ backgroundColor: currentPal.cardBg || '#ffffff', borderColor: activePrimary + '25' }"
              >
                <!-- 5 Stars -->
                <div class="flex items-center gap-2 text-amber-400 text-3xl mb-8">
                  <i v-for="star in (currentSlide.testiRating || 5)" :key="star" class="pi pi-star-fill"></i>
                </div>

                <!-- Review Quote -->
                <p class="font-serif italic text-[36px] leading-[1.45] text-stone-800 mb-10">
                  "{{ currentSlide.title }}"
                </p>

                <!-- Author info -->
                <div class="flex items-center justify-between border-t border-stone-200/80 pt-8">
                  <div class="flex items-center gap-5">
                    <div class="w-18 h-18 rounded-full overflow-hidden border-2 border-mocha/30 shadow bg-stone-100 flex items-center justify-center text-mocha font-serif text-2xl font-black">
                      {{ (currentSlide.testiAuthor || 'Rani & Aldi')[0] }}
                    </div>
                    <div>
                      <span class="font-bold text-[28px] text-stone-900 block">{{ currentSlide.testiAuthor || 'Rani & Aldi Pratama' }}</span>
                      <span class="text-[20px] text-stone-500 font-medium">{{ currentSlide.testiRole || 'Pengantin (Bandung)' }}</span>
                    </div>
                  </div>
                  <span class="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold flex items-center gap-1.5">
                    <i class="pi pi-verified"></i> Verified Couple
                  </span>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 6 - PRICE LIST (3 TIERS) -->
            <div v-if="currentSlide.type === 'pricing'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto text-center">
              <h2
                :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                :style="{ fontSize: `${(currentSlide.fontSize || 66) * 0.8}px`, color: activePrimary }"
                class="font-black leading-tight mb-3"
              >
                {{ currentSlide.title }}
              </h2>
              <p class="text-[24px] opacity-80 mb-8 max-w-[800px] mx-auto">
                {{ currentSlide.subtitle || '100% Tanpa Watermark, Aktif 1 Tahun Penuh, Sekali Bayar!' }}
              </p>

              <!-- 3 Column Pricing Cards -->
              <div class="grid grid-cols-3 gap-6 text-left">
                <!-- Basic -->
                <div class="p-8 rounded-3xl border bg-white/95 text-stone-900 shadow-xl flex flex-col justify-between">
                  <div>
                    <span class="text-xs font-bold text-stone-500 uppercase tracking-widest block">Paket Basic</span>
                    <span class="text-4xl font-black text-stone-900 mt-2 block">Rp 49.000</span>
                    <ul class="mt-6 space-y-3 text-[18px] text-stone-600 font-medium">
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Bebas Semua Tema</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Aktif 1 Tahun</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Tanpa Watermark</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Galeri 8 Foto</li>
                    </ul>
                  </div>
                  <span class="mt-8 text-xs font-bold text-center block text-stone-400">Cocok untuk Intimate</span>
                </div>

                <!-- Premium (Best Seller) -->
                <div class="p-8 rounded-3xl border-2 border-mocha bg-[#fffaf3] text-stone-900 shadow-2xl flex flex-col justify-between relative transform -translate-y-3">
                  <span class="absolute -top-4 right-6 bg-mocha text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow">
                    Best Seller
                  </span>
                  <div>
                    <span class="text-xs font-bold text-mocha uppercase tracking-widest block">Paket Premium</span>
                    <span class="text-4xl font-black text-mocha mt-2 block">Rp 79.000</span>
                    <ul class="mt-6 space-y-3 text-[18px] text-stone-800 font-bold">
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-600"></i> Galeri 20 Foto</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-600"></i> Upload Musik Sendiri</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-600"></i> Subdomain Kustom</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-600"></i> QR Code Buku Tamu</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-600"></i> Cerita Cinta (Timeline)</li>
                    </ul>
                  </div>
                  <span class="mt-8 text-xs font-bold text-center block text-mocha bg-mocha/10 py-2 rounded-xl">Paling Banyak Dipilih</span>
                </div>

                <!-- Eksklusif -->
                <div class="p-8 rounded-3xl border bg-stone-900 text-white shadow-xl flex flex-col justify-between">
                  <div>
                    <span class="text-xs font-bold text-amber-400 uppercase tracking-widest block">Paket Eksklusif</span>
                    <span class="text-4xl font-black text-white mt-2 block">Rp 99.000</span>
                    <ul class="mt-6 space-y-3 text-[18px] text-stone-300 font-medium">
                      <li class="flex items-center gap-2"><i class="pi pi-check text-amber-400"></i> Galeri 35 Foto</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-amber-400"></i> Video Prewedding</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-amber-400"></i> Live Streaming Link</li>
                      <li class="flex items-center gap-2"><i class="pi pi-check text-amber-400"></i> Panduan Dress Code</li>
                    </ul>
                  </div>
                  <span class="mt-8 text-xs font-bold text-center block text-amber-300">Fitur Terlengkap</span>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 7 - WETON JODOH -->
            <div v-if="currentSlide.type === 'weton'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto text-center">
              <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-2" :style="{ color: activeAccent }">
                Primbon Jawa Modern • Satu Undangan
              </span>
              <h2
                :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                :style="{ fontSize: `${(currentSlide.fontSize || 66) * 0.85}px`, color: activePrimary }"
                class="font-black leading-tight mb-8"
              >
                {{ currentSlide.title }}
              </h2>

              <div
                class="p-12 rounded-3xl border shadow-xl max-w-[850px] mx-auto w-full"
                :style="{ backgroundColor: currentPal.cardBg || currentPal.bg, borderColor: activeAccent + '44' }"
              >
                <div class="flex items-center justify-around mb-8">
                  <div class="text-center">
                    <span class="text-xs uppercase font-bold tracking-widest opacity-60 block">Weton Pria</span>
                    <span class="font-serif text-3xl font-bold mt-1 block" :style="{ color: activePrimary }">
                      {{ currentSlide.wetonPria || 'Senin Wage (8)' }}
                    </span>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-mocha/10 text-mocha flex items-center justify-center font-bold text-2xl">
                    +
                  </div>
                  <div class="text-center">
                    <span class="text-xs uppercase font-bold tracking-widest opacity-60 block">Weton Wanita</span>
                    <span class="font-serif text-3xl font-bold mt-1 block" :style="{ color: activePrimary }">
                      {{ currentSlide.wetonWanita || 'Minggu Legi (10)' }}
                    </span>
                  </div>
                </div>

                <div class="py-4 px-8 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-mocha font-serif text-3xl font-black mb-5">
                  Hasil: "{{ currentSlide.wetonStatus || 'RATU (Neptu 18)' }}"
                </div>

                <p class="text-[24px] leading-relaxed opacity-90 font-medium">
                  {{ currentSlide.wetonMakna || 'Pasangan ini memang sudah jodohnya. Dihormati tetangga & keluarga, rezeki lancar berlimpah.' }}
                </p>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 8 - CHAT BUBBLE SIMULATION -->
            <div v-if="currentSlide.type === 'chat_bubble'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto">
              <div class="text-center mb-8">
                <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-2" :style="{ color: activeAccent }">
                  Realita Calon Pengantin
                </span>
                <h2
                  :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                  :style="{ fontSize: `${(currentSlide.fontSize || 66) * 0.75}px`, color: activePrimary }"
                  class="font-black leading-tight"
                >
                  {{ currentSlide.title }}
                </h2>
              </div>

              <!-- Chat Container -->
              <div class="max-w-[850px] mx-auto w-full p-8 rounded-3xl bg-[#efeae2] border border-stone-300 shadow-xl space-y-6">
                <!-- Message 1: Left Bubble -->
                <div class="flex items-start gap-3">
                  <div class="w-12 h-12 rounded-full bg-stone-300 flex items-center justify-center text-stone-700 font-bold shrink-0">
                    👰
                  </div>
                  <div class="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[550px]">
                    <span class="text-xs font-bold text-stone-400 block mb-1">Calon Istri</span>
                    <p class="text-[22px] text-stone-800 leading-snug">
                      {{ currentSlide.chatMsg1 || 'Sayang, vendor katering sama dekor udah oke. Tapi biaya cetak 500 undangan kertas 3 juta lebih... budget kita jebol 😭' }}
                    </p>
                  </div>
                </div>

                <!-- Message 2: Right Bubble -->
                <div class="flex items-start justify-end gap-3">
                  <div class="bg-[#d9fdd3] p-5 rounded-2xl rounded-tr-none shadow-sm max-w-[550px] text-left">
                    <span class="text-xs font-bold text-emerald-700 block mb-1">Calon Suami</span>
                    <p class="text-[22px] text-stone-800 leading-snug font-medium">
                      {{ currentSlide.chatMsg2 || 'Tenang yang! Kita pake satuundangan.id aja cuma 79 ribu udah dapet desain adat mewah, QR tamu, dan sebar WA otomatis. Sisa 2.9 juta buat honeymoon! 😍' }}
                    </p>
                  </div>
                  <div class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    🤵
                  </div>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 9 - TWEET / QUOTE -->
            <div v-if="currentSlide.type === 'tweet'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto">
              <div
                class="p-12 rounded-[36px] border shadow-xl backdrop-blur-md"
                :style="{
                  backgroundColor: currentPal.cardBg || '#ffffff',
                  borderColor: activePrimary + '25',
                }"
              >
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-5">
                    <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-md bg-white p-1">
                      <img src="/logo_satuundangan.png" class="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-[32px] text-stone-900">Satu Undangan</span>
                        <i class="pi pi-verified text-xl text-sky-500"></i>
                      </div>
                      <span class="text-[20px] text-stone-500">@satuundangan_id</span>
                    </div>
                  </div>
                  <i class="pi pi-twitter text-3xl text-sky-500/80"></i>
                </div>
                <p class="font-sans text-[36px] font-normal text-stone-800 leading-[1.4] mb-8">
                  {{ currentSlide.title }}
                </p>
                <div class="border-t border-stone-200/80 pt-6 flex items-center justify-between text-stone-500 text-[20px]">
                  <span>22:00 • 23 Okt 2026</span>
                  <div class="flex items-center gap-8 font-semibold">
                    <span><strong class="text-stone-800">1,420</strong> Retweets</span>
                    <span><strong class="text-stone-800">8,930</strong> Likes</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 10 - BENTO GRID FITUR -->
            <div
              v-if="currentSlide.type === 'bento'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto"
            >
              <div class="text-center mb-8">
                <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-2" :style="{ color: activeAccent }">
                  Fitur Unggulan • Satu Undangan
                </span>
                <h2
                  :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                  :style="{ fontSize: `${(currentSlide.fontSize || 66) * 0.75}px`, color: activePrimary }"
                  class="font-black leading-tight"
                >
                  {{ currentSlide.title }}
                </h2>
                <p v-if="currentSlide.subtitle" class="text-[22px] opacity-80 mt-2 max-w-[750px] mx-auto">
                  {{ currentSlide.subtitle }}
                </p>
              </div>

              <!-- 2x2 Bento Grid -->
              <div class="grid grid-cols-2 gap-6 max-w-[900px] mx-auto w-full">
                <div
                  v-for="(item, idx) in (currentSlide.bentoItems || defaultBentoItems)"
                  :key="idx"
                  class="p-7 rounded-3xl border shadow-md flex flex-col justify-between"
                  :style="{
                    backgroundColor: currentPal.cardBg || '#ffffff',
                    borderColor: activePrimary + '25',
                  }"
                >
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 shadow-sm" :style="{ backgroundColor: activePrimary }">
                    <i :class="['pi', item.icon || 'pi-star']"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-[24px] mb-2" :style="{ color: activePrimary }">{{ item.title }}</h3>
                    <p class="text-[19px] opacity-80 leading-snug" :style="{ color: activeText }">{{ item.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 11 - FAQ / TANYA JAWAB -->
            <div
              v-if="currentSlide.type === 'faq'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto space-y-6"
            >
              <div class="text-center mb-4">
                <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-1" :style="{ color: activeAccent }">
                  Tanya Jawab Manten • Satu Undangan
                </span>
                <h2
                  :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                  :style="{ fontSize: `${(currentSlide.fontSize || 66) * 0.75}px`, color: activePrimary }"
                  class="font-black leading-tight"
                >
                  {{ currentSlide.title }}
                </h2>
              </div>

              <div class="space-y-4 max-w-[920px] mx-auto w-full">
                <!-- Q1 -->
                <div
                  class="p-6 rounded-2xl border shadow-sm space-y-2"
                  :style="{ backgroundColor: currentPal.cardBg || '#ffffff', borderColor: activePrimary + '25' }"
                >
                  <div class="flex items-center gap-3">
                    <span class="px-2.5 py-0.5 rounded-lg text-xs font-black text-white shrink-0" :style="{ backgroundColor: activePrimary }">Q</span>
                    <span class="font-bold text-[22px]" :style="{ color: activePrimary }">{{ currentSlide.faqQ1 || 'Bisa sebar berapa banyak tamu?' }}</span>
                  </div>
                  <div class="flex items-start gap-3 pl-8 text-[19px] opacity-85" :style="{ color: activeText }">
                    <span class="text-emerald-600 font-bold">A:</span>
                    <span>{{ currentSlide.faqA1 || 'Unlimited! Tanpa kuota dan bebas kirim ke ribuan tamu tanpa biaya tambahan.' }}</span>
                  </div>
                </div>

                <!-- Q2 -->
                <div
                  class="p-6 rounded-2xl border shadow-sm space-y-2"
                  :style="{ backgroundColor: currentPal.cardBg || '#ffffff', borderColor: activePrimary + '25' }"
                >
                  <div class="flex items-center gap-3">
                    <span class="px-2.5 py-0.5 rounded-lg text-xs font-black text-white shrink-0" :style="{ backgroundColor: activePrimary }">Q</span>
                    <span class="font-bold text-[22px]" :style="{ color: activePrimary }">{{ currentSlide.faqQ2 || 'Apakah ada watermark logo di undangan?' }}</span>
                  </div>
                  <div class="flex items-start gap-3 pl-8 text-[19px] opacity-85" :style="{ color: activeText }">
                    <span class="text-emerald-600 font-bold">A:</span>
                    <span>{{ currentSlide.faqA2 || '100% bebas watermark! Undangan tampil eksklusif dan profesional.' }}</span>
                  </div>
                </div>

                <!-- Q3 -->
                <div
                  class="p-6 rounded-2xl border shadow-sm space-y-2"
                  :style="{ backgroundColor: currentPal.cardBg || '#ffffff', borderColor: activePrimary + '25' }"
                >
                  <div class="flex items-center gap-3">
                    <span class="px-2.5 py-0.5 rounded-lg text-xs font-black text-white shrink-0" :style="{ backgroundColor: activePrimary }">Q</span>
                    <span class="font-bold text-[22px]" :style="{ color: activePrimary }">{{ currentSlide.faqQ3 || 'Berapa lama masa aktif undangannya?' }}</span>
                  </div>
                  <div class="flex items-start gap-3 pl-8 text-[19px] opacity-85" :style="{ color: activeText }">
                    <span class="text-emerald-600 font-bold">A:</span>
                    <span>{{ currentSlide.faqA3 || 'Aktif 1 tahun penuh, bisa diakses kapan saja sebelum & sesudah resepsi.' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 12 - CALL TO ACTION (CTA CLOSING) -->
            <div
              v-if="currentSlide.type === 'cta'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto text-center"
            >
              <div
                class="max-w-[850px] mx-auto w-full p-12 rounded-[40px] border shadow-2xl backdrop-blur-md"
                :style="{ backgroundColor: currentPal.cardBg || '#ffffff', borderColor: activeAccent + '40' }"
              >
                <!-- Save Reminder Pill -->
                <div
                  class="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider mb-6 shadow-sm border"
                  :style="{ backgroundColor: activeAccent + '22', color: activePrimary, borderColor: activeAccent + '60' }"
                >
                  <i class="pi pi-bookmark-fill text-amber-500"></i>
                  <span>Simpan Postingan Ini Biar Nggak Lupa!</span>
                </div>

                <h2
                  :class="[currentSlide.fontFamily || 'font-serif', currentSlide.isUppercase ? 'uppercase' : '']"
                  :style="{ fontSize: `${(currentSlide.fontSize || 66) * 0.85}px`, color: activePrimary }"
                  class="font-black leading-tight mb-4"
                >
                  {{ currentSlide.title || 'Mulai Buat Undangan Impianmu Sekarang' }}
                </h2>

                <p class="text-[24px] opacity-80 leading-relaxed mb-8 max-w-[650px] mx-auto" :style="{ color: activeText }">
                  {{ currentSlide.subtitle || 'Daftar gratis dalam 2 menit, pilih tema adat atau modern, dan sebar undangan sepuasnya!' }}
                </p>

                <!-- Promo Code Box -->
                <div
                  class="p-5 rounded-2xl border-2 border-dashed mb-8 flex items-center justify-between max-w-[500px] mx-auto"
                  :style="{ borderColor: activeAccent, backgroundColor: activeAccent + '15' }"
                >
                  <div class="text-left">
                    <span class="text-xs uppercase font-bold tracking-widest block opacity-70">Diskon Followers Baru</span>
                    <span class="font-mono text-2xl font-black" :style="{ color: activePrimary }">{{ currentSlide.ctaPromo || 'KODE: NIKAHHEMAT' }}</span>
                  </div>
                  <span class="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs uppercase shadow">
                    Diskon 30%
                  </span>
                </div>

                <!-- Account Badge Callout -->
                <div class="flex items-center justify-center gap-4 pt-4 border-t border-stone-200">
                  <div class="w-14 h-14 rounded-full overflow-hidden border border-amber-600/30 bg-white p-0.5 shadow-sm">
                    <img src="/logo_satuundangan.png" class="w-full h-full object-contain" />
                  </div>
                  <div class="text-left">
                    <span class="font-bold text-2xl block text-stone-900">@satuundangan_id</span>
                    <span class="text-sm text-mocha font-bold">👉 {{ currentSlide.ctaAction || 'Klik Link di Bio Profil Instagram' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Stickers Container -->
            <div v-if="currentSlide.selectedStickers.length" class="absolute bottom-32 right-16 flex items-center gap-4 z-20 pointer-events-none">
              <img
                v-for="(stk, i) in currentSlide.selectedStickers"
                :key="i"
                :src="stk"
                class="w-24 h-24 object-contain filter drop-shadow-xl animate-bounce"
                :style="{ animationDuration: `${2 + i * 0.5}s` }"
              />
            </div>

            <!-- CANVAS FOOTER (BOTTOM BAR) -->
            <div class="relative z-10 pb-16 px-16 flex items-center justify-between border-t border-amber-900/10 pt-8">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs"
                  :style="{ backgroundColor: activePrimary, color: activeBg }"
                >
                  <i class="pi pi-instagram"></i>
                </div>
                <span class="font-bold text-xl tracking-tight" :style="{ color: activeText }">
                  @satuundangan_id
                </span>
              </div>

              <div class="flex items-center gap-3 font-semibold text-lg" :style="{ color: activePrimary }">
                <span>{{ currentSlideIndex < slides.length - 1 ? 'Geser Selanjutnya' : 'Kunjungi satuundangan.id' }}</span>
                <i :class="currentSlideIndex < slides.length - 1 ? 'pi pi-arrow-right' : 'pi pi-external-link'" class="text-base"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM FILMSTRIP: Multi-Slide Carousel Deck (Clean Studio White) -->
      <footer class="h-28 border-t border-stone-200 bg-white px-6 flex items-center justify-between z-20 shadow-xs">
        <!-- Slides Strip with Move & Duplicate Controls -->
        <div class="flex items-center gap-3 overflow-x-auto py-2 custom-scrollbar">
          <div
            v-for="(s, idx) in slides"
            :key="s.id"
            @click="currentSlideIndex = idx"
            class="relative w-20 h-20 rounded-2xl border-2 cursor-pointer transition-all shrink-0 flex flex-col justify-between p-2 overflow-hidden group shadow-xs"
            :class="
              currentSlideIndex === idx
                ? 'border-mocha bg-mocha/5 shadow-md shadow-mocha/20 scale-105'
                : 'border-stone-200 bg-stone-50 hover:border-stone-400'
            "
            :style="{ backgroundColor: s.customBg || '#fffaf3' }"
          >
            <div class="flex items-center justify-between w-full">
              <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-stone-900/80 text-white">
                #{{ idx + 1 }}
              </span>
              <!-- Quick Action icons on hover -->
              <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                <!-- Duplicate -->
                <button
                  @click.stop="duplicateSlide(idx)"
                  class="w-4 h-4 rounded-full bg-stone-700 hover:bg-mocha text-white flex items-center justify-center"
                  title="Duplikat Slide"
                >
                  <i class="pi pi-copy text-[8px]"></i>
                </button>
                <!-- Delete -->
                <button
                  v-if="slides.length > 1"
                  @click.stop="deleteSlide(idx)"
                  class="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center"
                  title="Hapus Slide"
                >
                  <i class="pi pi-times text-[8px]"></i>
                </button>
              </div>
            </div>

            <p class="text-[8px] font-bold line-clamp-2 leading-tight" :style="{ color: s.customPrimary || '#a47148' }">
              {{ s.title || 'Slide ' + (idx + 1) }}
            </p>

            <!-- Reorder arrows -->
            <div class="flex items-center justify-between text-[8px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                v-if="idx > 0"
                @click.stop="moveSlide(idx, -1)"
                class="hover:text-mocha p-0.5"
                title="Pindah Kiri"
              >
                ◀
              </button>
              <span class="flex-1"></span>
              <button
                v-if="idx < slides.length - 1"
                @click.stop="moveSlide(idx, 1)"
                class="hover:text-mocha p-0.5"
                title="Pindah Kanan"
              >
                ▶
              </button>
            </div>
          </div>

          <!-- Add Slide Button -->
          <button
            @click="addNewSlide"
            class="w-16 h-20 rounded-2xl border-2 border-dashed border-stone-300 hover:border-mocha bg-stone-50 hover:bg-mocha/5 text-stone-500 hover:text-mocha flex flex-col items-center justify-center gap-1 shrink-0 transition-all"
            title="Tambah Slide Baru"
          >
            <i class="pi pi-plus text-sm"></i>
            <span class="text-[9px] font-bold">Slide</span>
          </button>
        </div>

        <!-- Export Buttons Deck -->
        <div class="flex items-center gap-3 shrink-0">
          <button
            @click="copyInstagramCaption"
            class="py-2.5 px-4 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <i class="pi pi-copy text-xs text-mocha"></i>
            <span>Salin Caption</span>
          </button>

          <button
            @click="exportCurrentSlidePng"
            :disabled="isExporting"
            class="py-2.5 px-4 rounded-xl border border-mocha/30 hover:border-mocha bg-mocha/5 hover:bg-mocha/10 text-mocha text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
          >
            <i v-if="!isExporting" class="pi pi-image text-xs"></i>
            <i v-else class="pi pi-spin pi-spinner text-xs"></i>
            <span>Unduh Slide Ini</span>
          </button>

          <button
            @click="exportAllSlidesZip"
            :disabled="isExporting"
            class="py-2.5 px-5 rounded-xl bg-mocha hover:bg-dark text-white font-bold text-xs shadow-lg shadow-mocha/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <i v-if="!isExporting" class="pi pi-download text-sm"></i>
            <i v-else class="pi pi-spin pi-spinner text-sm"></i>
            <span>{{ isExporting ? 'Mengepak ZIP...' : `Download Semua (${slides.length} Slide) ZIP` }}</span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { useToast } from 'vue-toastification'

const toast = useToast()
const canvasRef = ref(null)
const isExporting = ref(false)
const showSafeZone = ref(false)
const previewScale = ref(0.45)
const fileInputRef = ref(null)

// Navigation Sidebar Tabs
const SIDEBAR_TABS = [
  { id: 'templates', label: 'Preset', icon: 'pi-bolt' },
  { id: 'text', label: 'Teks', icon: 'pi-file-edit' },
  { id: 'colors', label: 'Warna', icon: 'pi-palette' },
  { id: 'elements', label: 'Elemen', icon: 'pi-th-large' },
  { id: 'upload', label: 'Upload', icon: 'pi-upload' },
]
const activeTab = ref('templates')
const currentTabTitle = computed(() => {
  const match = SIDEBAR_TABS.find((t) => t.id === activeTab.value)
  return match ? match.label : 'Pengaturan'
})

// Aspect Ratios (Resize Tool)
const ASPECT_RATIOS = [
  { id: 'feed', label: 'Feed 4:5', width: 1080, height: 1350, icon: 'pi-mobile' },
  { id: 'story', label: 'Story 9:16', width: 1080, height: 1920, icon: 'pi-window-maximize' },
  { id: 'square', label: 'Square 1:1', width: 1080, height: 1080, icon: 'pi-stop' },
]
const currentDimension = ref(ASPECT_RATIOS[0])

// Color Palettes
const PALETTES = [
  { id: 'ivory', name: 'Ivory Classic (Brand)', bg: '#fffaf3', cardBg: '#ffffff', text: '#2f2f2f', primary: '#a47148', accent: '#c89f68' },
  { id: 'mocha', name: 'Mocha Warm', bg: '#a47148', cardBg: '#875630', text: '#fffaf3', primary: '#fffaf3', accent: '#facc15' },
  { id: 'sage', name: 'Sage Botanical', bg: '#f3f6f1', cardBg: '#ffffff', text: '#2f2f2f', primary: '#677d59', accent: '#a47148' },
  { id: 'dark', name: 'Dark Elegant', bg: '#141417', cardBg: '#1f1f24', text: '#f8fafc', primary: '#d4af37', accent: '#f59e0b' },
]

// Stickers List
const STICKERS_LIST = [
  { id: 'cat-paw', name: 'Cat Paw 🐾', file: '/assets/images/clay-cat-paw.png' },
  { id: 'clay-heart', name: 'Heart 3D ❤️', file: '/assets/images/clay-heart.png' },
  { id: 'clay-rings', name: 'Cincin Emas 💍', file: '/assets/images/luxury-clay-rings.png' },
  { id: 'clay-cats', name: 'Anabul 🐱', file: '/assets/images/luxury-clay-cats.png' },
  { id: 'cat-seal', name: 'Wax Seal', file: '/assets/images/cat-paw-seal.png' },
  { id: 'clay-envelope', name: 'Amplop', file: '/assets/images/luxury-clay-envelope.png' },
]

// Ornaments List
const ORNAMENTS_LIST = [
  { id: 'siger', name: 'Siger Sunda', file: '/assets/ornaments/siger-gold.png' },
  { id: 'gunungan', name: 'Gunungan Jawa', file: '/assets/ornaments/gunungan-gold.png' },
  { id: 'gorga', name: 'Gorga Batak', file: '/assets/ornaments/gorga-batak.png' },
  { id: 'dayak', name: 'Talawang Dayak', file: '/assets/ornaments/dayak-talawang.png' },
]

// 12 Rich Template Layout Types
const TEMPLATE_TYPES = [
  { id: 'cover', name: 'Cover Hook', icon: 'pi-bookmark' },
  { id: 'body', name: 'Slide Edukasi', icon: 'pi-list' },
  { id: 'comparison', name: 'Perbandingan (Versus)', icon: 'pi-arrows-h' },
  { id: 'showcase', name: 'Mockup Tema', icon: 'pi-mobile' },
  { id: 'bento', name: 'Bento Grid Fitur', icon: 'pi-th-large' },
  { id: 'faq', name: 'FAQ / Tanya Jawab', icon: 'pi-question-circle' },
  { id: 'testimonial', name: 'Review Pengantin', icon: 'pi-star' },
  { id: 'pricing', name: 'Tabel Harga', icon: 'pi-tag' },
  { id: 'weton', name: 'Weton Jodoh', icon: 'pi-heart' },
  { id: 'chat_bubble', name: 'Simulasi Chat WA', icon: 'pi-comments' },
  { id: 'tweet', name: 'Tweet / Quote', icon: 'pi-twitter' },
  { id: 'cta', name: 'Closing & CTA', icon: 'pi-arrow-circle-right' },
]

// Default Bento Items
const defaultBentoItems = [
  { icon: 'pi-wallet', title: 'Amplop Digital Cashless', desc: 'QRIS & Rekening Bank langsung ke kamu tanpa potongan sepeserpun.' },
  { icon: 'pi-qrcode', title: 'Buku Tamu QR Code', desc: 'Check-in cepat di meja resepsi dan bebas antre catat buku manual.' },
  { icon: 'pi-whatsapp', title: 'WhatsApp Sebar 1-Klik', desc: 'Format pesan personal ramah dengan nama masing-masing tamu.' },
  { icon: 'pi-map-marker', title: 'Navigasi Google Maps', desc: 'Petunjuk arah akurat langsung ke lokasi agar tamu tidak tersesat.' },
]

// Template List
const TEMPLATE_LIST = [
  { slug: 'meowly-married', name: 'Meowly Married (3D Clay Cat)' },
  { slug: 'minang-suntiang-emas', name: 'Minang Suntiang Emas' },
  { slug: 'jawa-truntum', name: 'Jawa Truntum' },
  { slug: 'sunda-sabilulungan', name: 'Sunda Sabilulungan' },
  { slug: 'bali-payas-agung', name: 'Bali Payas Agung' },
  { slug: 'kimi-no-na-wa', name: 'Kimi no Na wa (Anime)' },
  { slug: 'dark-elegant', name: 'Dark Elegant' },
  { slug: 'botanical-watercolor', name: 'Botanical Watercolor' },
  { slug: 'old-money-monogram', name: 'Old Money Monogram' },
  { slug: 'pixel-quest', name: 'Pixel Quest 8-Bit' },
]

// 6 FULL CAROUSEL DECKS (Loads 4 to 6 slides in 1-Click!)
const FULL_CAROUSEL_DECKS = [
  {
    id: 'deck-budget',
    title: 'Post 2: Bongkar Budget 500 Undangan',
    slides: [
      {
        id: 1,
        type: 'cover',
        badge: 'BONGKAR BUDGET NIKAH',
        title: 'Cetak 500 Undangan Kertas Buat Dibuang ke Tong Sampah? 😭',
        subtitle: 'Bukan pelit, tapi smart budgeting! Yuk hitung perbandingan riilnya.',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 66,
        textAlign: 'left',
        isUppercase: false,
        bgPattern: 'glow',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 2,
        type: 'comparison',
        badge: 'PERBANDINGAN RIIL',
        title: 'Realita Fisik vs Digital',
        subtitle: 'Selisih anggarannya bisa buat nambah menu prasmanan!',
        versusLeftTitle: 'Undangan Kertas',
        versusLeftPoints: 'Biaya cetak Rp 3-5 Juta,80% cuma dibuang ke tempat sampah,Repot keliling bagi-bagi & bensin boros',
        versusRightTitle: 'Satu Undangan',
        versusRightPoints: 'Cukup Rp 79.000 sekali bayar,Sebar ke ribuan tamu via WA 1 klik,Tamu scan QR bebas antre di resepsi,Hemat 2.9 juta buat upgrade katering',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 56,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 3,
        type: 'chat_bubble',
        badge: 'RELATABLE STORY',
        title: 'Drama Calon Manten H-60',
        chatMsg1: 'Sayang, vendor katering sama dekor udah oke. Tapi biaya cetak 500 undangan kertas 3 juta lebih... budget kita jebol 😭',
        chatMsg2: 'Tenang yang! Kita pake satuundangan.id aja cuma 79 ribu udah dapet desain adat mewah, QR tamu, dan sebar WA otomatis. Sisa 2.9 juta buat honeymoon! 😍',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 56,
        textAlign: 'center',
        selectedStickers: ['/assets/images/clay-heart.png'],
        selectedOrnament: null,
      },
      {
        id: 4,
        type: 'pricing',
        badge: 'HARGA TRANSPARAN',
        title: 'Fitur Sultan, Harga Teman.',
        subtitle: '100% Tanpa Watermark, Aktif 1 Tahun Penuh, Sekali Bayar!',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 56,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 5,
        type: 'testimonial',
        badge: 'ULASAN PENGANTIN',
        title: 'Sangat puas dengan hasilnya! Tamu-tamu undangan banyak yang memuji lagunya enak dan desainnya berkelas banget.',
        testiAuthor: 'Rani & Aldi Pratama',
        testiRole: 'Pengantin (Bandung)',
        testiRating: 5,
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'left',
        selectedStickers: [],
        selectedOrnament: null,
      },
    ],
  },
  {
    id: 'deck-adat',
    title: 'Post 1: Heritage Adat Nusantara',
    slides: [
      {
        id: 11,
        type: 'cover',
        badge: 'HERITAGE NUSANTARA',
        title: 'Menikah dengan Adat, Tetap Modern & Elegan',
        subtitle: 'Sentuhan ornamen sakral Minangkabau berpadu estetika smartphone modern.',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 66,
        textAlign: 'left',
        selectedStickers: [],
        selectedOrnament: '/assets/ornaments/siger-gold.png',
      },
      {
        id: 12,
        type: 'showcase',
        badge: 'TEMA MINANG',
        title: 'Minang Suntiang Emas',
        subtitle: 'Kemegahan mahkota suntiang Minangkabau berbalut marun dan emas Rumah Gadang.',
        templateSlug: 'minang-suntiang-emas',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 13,
        type: 'showcase',
        badge: 'TEMA JAWA',
        title: 'Jawa Truntum Keraton',
        subtitle: 'Sakralnya motif batik truntum berpadu alunan gamelan Jawa yang menenangkan.',
        templateSlug: 'jawa-truntum',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: '/assets/ornaments/gunungan-gold.png',
      },
      {
        id: 14,
        type: 'showcase',
        badge: 'TEMA SUNDA',
        title: 'Sunda Sabilulungan',
        subtitle: 'Keanggunan mahkota Siger priangan berpadu alunan merdu degung Sunda.',
        templateSlug: 'sunda-sabilulungan',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: '/assets/ornaments/siger-gold.png',
      },
      {
        id: 15,
        type: 'body',
        badge: 'KENAPA SATU UNDANGAN?',
        title: 'Fitur Adat Terlengkap di Indonesia',
        subtitle: 'Didesain khusus untuk menghormati tradisi leluhur tanpa kehilangan sentuhan teknologi:',
        points: [
          'Tersedia lagu tradisional preset (Gamelan Jawa, Degung Sunda, Gamelan Bali)',
          'Dukungan seksi Turut Mengundang untuk keluarga besar & sesepuh',
          'Integrasi Google Maps ke gedung / masjid akad agar tamu tak tersesat',
          'Kirim undangan personal via WhatsApp dalam 1 klik',
        ],
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'left',
        selectedStickers: [],
        selectedOrnament: null,
      },
    ],
  },
  {
    id: 'deck-cat',
    title: 'Post 4: Anabul Cat Lovers (3D Clay)',
    slides: [
      {
        id: 21,
        type: 'cover',
        badge: 'CAT LOVERS EDITION 🐾',
        title: 'Undangan Nikah Khusus Anabul Parents Pertama di Indonesia!',
        subtitle: 'Animasi 3D clay telapak kucing pastel imut siap meriahkan hari bahagiamu.',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 64,
        textAlign: 'left',
        selectedStickers: ['/assets/images/clay-cat-paw.png'],
        selectedOrnament: null,
      },
      {
        id: 22,
        type: 'showcase',
        badge: 'MEOWLY MARRIED',
        title: 'Tema Meowly Married',
        subtitle: 'Amplop pastel lipat 3D, cap telapak kucing gemas, dan galeri foto anabul kesayangan.',
        templateSlug: 'meowly-married',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: ['/assets/images/luxury-clay-cats.png'],
        selectedOrnament: null,
      },
      {
        id: 23,
        type: 'body',
        badge: 'FITUR ANABUL',
        title: 'Kenapa Pasangan Cat Lovers Suka Banget?',
        subtitle: 'Bukan cuma lucu, tapi punya fitur super lengkap buat pernikahanmu:',
        points: [
          'Cover amplop animasi telapak kucing interaktif',
          'Bisa upload foto berdua bareng kucing peliharaan',
          'Amplop digital QRIS cashless & nomor rekening bank',
          'RSVP online & buku tamu bebas antre',
        ],
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 52,
        textAlign: 'left',
        selectedStickers: ['/assets/images/clay-heart.png'],
        selectedOrnament: null,
      },
    ],
  },
  {
    id: 'deck-weton',
    title: 'Post 6: Weton Jodoh Jawa Modern',
    slides: [
      {
        id: 31,
        type: 'cover',
        badge: 'PRIMBON JAWA MODERN',
        title: 'Kamu & Doi Masuk Kategori Apa? Cek Jodohmu di Sini!',
        subtitle: 'Hitung kecocokan neptu weton kalian secara gratis pakai kalkulator Satu Undangan.',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 64,
        textAlign: 'left',
        selectedStickers: [],
        selectedOrnament: '/assets/ornaments/gunungan-gold.png',
      },
      {
        id: 32,
        type: 'weton',
        badge: 'SIMULASI NEPTU',
        title: 'Simulasi Weton Neptu 18',
        wetonPria: 'Senin Wage (8)',
        wetonWanita: 'Minggu Legi (10)',
        wetonStatus: 'RATU (Neptu 18)',
        wetonMakna: 'Pasangan ini memang sudah jodohnya. Dihormati tetangga & keluarga, rezeki lancar berlimpah.',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 33,
        type: 'body',
        badge: 'GRATIS DI WEB',
        title: 'Mau Cek Weton Kamu & Pasangan?',
        subtitle: 'Tersedia kalkulator weton online otomatis di web Satu Undangan:',
        points: [
          'Pilih tanggal lahir kamu & pasangan',
          'Sistem otomatis menghitung hari pasarannya (Wage, Kliwon, Legi, dll)',
          'Dapatkan tafsir Primbon Jawa modern yang santun & bijak',
          '100% Gratis tanpa dipungut biaya apapun!',
        ],
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 52,
        textAlign: 'left',
        selectedStickers: [],
        selectedOrnament: null,
      },
    ],
  },
  {
    id: 'deck-features',
    title: 'Post 3: 4 Fitur Rahasia Undangan Digital',
    slides: [
      {
        id: 41,
        type: 'cover',
        badge: 'FITUR RAHASIA',
        title: 'Bikin Tamu Takjub dengan 4 Fitur Sultan Ini!',
        subtitle: 'Bukan sekadar link website biasa, tapi pengalaman resepsi digital tak terlupakan bagi tamu.',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 64,
        textAlign: 'left',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 42,
        type: 'bento',
        badge: '4 FITUR UNGGULAN',
        title: 'Semua Kebutuhan Resepsimu Ada di Sini',
        subtitle: 'Terintegrasi otomatis dalam satu link undangan digital:',
        bentoItems: [
          { icon: 'pi-wallet', title: 'Amplop Digital Cashless', desc: 'QRIS & Rekening Bank langsung ke rekeningmu tanpa potongan sepeserpun.' },
          { icon: 'pi-qrcode', title: 'Buku Tamu QR Code', desc: 'Scan check-in cepat di meja resepsi, bebas antre tulis buku tamu manual.' },
          { icon: 'pi-whatsapp', title: 'Kirim WhatsApp 1-Klik', desc: 'Sapaan ramah dengan nama masing-masing tamu secara personal & otomatis.' },
          { icon: 'pi-map-marker', title: 'Navigasi Google Maps', desc: 'Petunjuk arah akurat & live traffic agar tamu tidak tersesat ke gedung.' },
        ],
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 43,
        type: 'faq',
        badge: 'TANYA JAWAB',
        title: 'Pertanyaan yang Paling Sering Ditanyakan',
        faqQ1: 'Bisa sebar berapa banyak tamu?',
        faqA1: 'Unlimited! Tanpa kuota dan bebas kirim ke ribuan tamu tanpa biaya tambahan sepeserpun.',
        faqQ2: 'Apakah ada watermark logo di undangan?',
        faqA2: '100% bebas watermark untuk semua paket. Undangan tampil eksklusif, rapi, dan profesional.',
        faqQ3: 'Berapa lama masa aktif undangannya?',
        faqA3: 'Aktif 1 tahun penuh, bisa diakses kapan saja sebelum & sesudah resepsi.',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 44,
        type: 'cta',
        badge: 'COBA SEKARANG',
        title: 'Siap Bikin Undangan Impianmu Hari Ini?',
        subtitle: 'Daftar gratis dalam 2 menit, pilih tema favoritmu, dan nikmati kemudahan sebar undangan digital!',
        ctaPromo: 'KODE: NIKAHHEMAT',
        ctaAction: 'Klik Link di Bio @satuundangan_id',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 56,
        textAlign: 'center',
        selectedStickers: ['/assets/images/clay-heart.png'],
        selectedOrnament: null,
      },
    ],
  },
  {
    id: 'deck-promo',
    title: 'Post 5: Promo Spesial Mulai 49 Ribu',
    slides: [
      {
        id: 51,
        type: 'cover',
        badge: 'PROMO SPESIAL',
        title: 'Mau Undangan Estetik Tanpa Bikin Kantong Jebol? 💸',
        subtitle: 'Dapatkan 30+ pilihan tema pernikahan mewah mulai Rp 49.000 sekali bayar!',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 64,
        textAlign: 'left',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 52,
        type: 'showcase',
        badge: 'PILIHAN TEMA',
        title: '30+ Tema Estetik & Adat Nusantara',
        subtitle: 'Dari adat Minang, Jawa, Sunda, Bali hingga Modern Minimalis & Animasi 3D Clay.',
        templateSlug: 'meowly-married',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 53,
        type: 'pricing',
        badge: 'HARGA TRANSPARAN',
        title: 'Paket Hemat, Fitur Lengkap',
        subtitle: '100% Tanpa Watermark, Aktif 1 Tahun Penuh, Sekali Bayar!',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 54,
        textAlign: 'center',
        selectedStickers: [],
        selectedOrnament: null,
      },
      {
        id: 54,
        type: 'cta',
        badge: 'KLAIM PROMO',
        title: 'Klaim Diskon 30% Khusus Followers!',
        subtitle: 'Gunakan kode promo di bawah saat checkout di website satuundangan.id:',
        ctaPromo: 'KODE: SIKAT30',
        ctaAction: 'Klik Link di Bio @satuundangan_id',
        paletteId: 'ivory',
        fontFamily: 'font-serif',
        fontSize: 56,
        textAlign: 'center',
        selectedStickers: ['/assets/images/luxury-clay-rings.png'],
        selectedOrnament: null,
      },
    ],
  },
]

// Initial Multi-Slide Deck State
const slides = ref(JSON.parse(JSON.stringify(FULL_CAROUSEL_DECKS[0].slides)))
const currentSlideIndex = ref(0)
const currentSlide = computed(() => slides.value[currentSlideIndex.value] || slides.value[0])
const currentPal = computed(() => PALETTES.find((p) => p.id === currentSlide.value.paletteId) || PALETTES[0])
const applyScope = ref('current') // 'current' or 'all'

// Load Entire Carousel Deck
function loadFullCarouselDeck(deck) {
  slides.value = JSON.parse(JSON.stringify(deck.slides))
  currentSlideIndex.value = 0
  toast.success(`Berhasil memuat "${deck.title}" (${deck.slides.length} slide sekaligus)! 🚀`)
}

// Active Colors
const activeBg = computed(() => currentSlide.value.customBg || currentPal.value.bg)
const activePrimary = computed(() => currentSlide.value.customPrimary || currentPal.value.primary)
const activeAccent = computed(() => currentSlide.value.customAccent || currentPal.value.accent)
const activeText = computed(() => currentSlide.value.customText || currentPal.value.text)
const hasCustomHex = computed(() => Boolean(currentSlide.value.customBg || currentSlide.value.customPrimary || currentSlide.value.customAccent))

// Reset / Clear Custom HEX
function clearCustomHex() {
  currentSlide.value.customBg = ''
  currentSlide.value.customPrimary = ''
  currentSlide.value.customAccent = ''
  currentSlide.value.customText = ''
  toast.success('Kustomisasi HEX direset ke palet brand!')
}

// UNDO / REDO HISTORY ENGINE
const historyStack = ref([])
const historyIndex = ref(-1)
let isHistoryAction = false
let debounceTimer = null

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < historyStack.value.length - 1)

function recordHistory() {
  if (isHistoryAction) return
  const snapshot = JSON.stringify(slides.value)
  if (historyStack.value[historyIndex.value] === snapshot) return

  historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
  historyStack.value.push(snapshot)
  if (historyStack.value.length > 25) historyStack.value.shift()
  historyIndex.value = historyStack.value.length - 1
}

function undo() {
  if (!canUndo.value) return
  isHistoryAction = true
  historyIndex.value--
  slides.value = JSON.parse(historyStack.value[historyIndex.value])
  if (currentSlideIndex.value >= slides.value.length) {
    currentSlideIndex.value = slides.value.length - 1
  }
  toast.info('Undo ↩️')
  setTimeout(() => {
    isHistoryAction = false
  }, 60)
}

function redo() {
  if (!canRedo.value) return
  isHistoryAction = true
  historyIndex.value++
  slides.value = JSON.parse(historyStack.value[historyIndex.value])
  if (currentSlideIndex.value >= slides.value.length) {
    currentSlideIndex.value = slides.value.length - 1
  }
  toast.info('Redo ↪️')
  setTimeout(() => {
    isHistoryAction = false
  }, 60)
}

watch(
  slides,
  () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      recordHistory()
    }, 400)
  },
  { deep: true }
)

function handleKeyboardShortcuts(e) {
  const tag = document.activeElement?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea') return

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) {
      redo()
    } else {
      undo()
    }
    e.preventDefault()
  } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
    redo()
    e.preventDefault()
  }
}

onMounted(() => {
  historyStack.value = [JSON.stringify(slides.value)]
  historyIndex.value = 0
  window.addEventListener('keydown', handleKeyboardShortcuts)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcuts)
})

// Slide Management
function addNewSlide() {
  const newId = Date.now()
  slides.value.push({
    id: newId,
    type: 'body',
    badge: 'SLIDE ' + (slides.value.length + 1),
    title: 'Poin Pembahasan Selanjutnya',
    subtitle: 'Tulis penjelasan singkat di sini...',
    paletteId: currentSlide.value.paletteId || 'ivory',
    fontFamily: currentSlide.value.fontFamily || 'font-serif',
    fontSize: 56,
    textAlign: 'left',
    isUppercase: false,
    bgPattern: currentSlide.value.bgPattern || 'glow',
    customBg: '',
    customPrimary: '',
    customAccent: '',
    customText: '',
    points: ['Poin pertama yang menarik', 'Poin kedua yang menguatkan hook'],
    bentoItems: JSON.parse(JSON.stringify(defaultBentoItems)),
    faqQ1: 'Bisa sebar berapa banyak tamu?',
    faqA1: 'Unlimited! Tanpa kuota dan bebas kirim ke ribuan tamu.',
    faqQ2: 'Apakah ada watermark logo di undangan?',
    faqA2: '100% Bebas Watermark untuk semua paket.',
    faqQ3: 'Berapa lama masa aktif undangannya?',
    faqA3: 'Aktif 1 tahun penuh, bisa diakses sebelum & sesudah resepsi.',
    ctaPromo: 'KODE: NIKAHHEMAT',
    ctaAction: 'Klik Link di Bio @satuundangan_id',
    templateSlug: 'meowly-married',
    selectedStickers: [],
    selectedOrnament: null,
    customImage: null,
  })
  currentSlideIndex.value = slides.value.length - 1
  toast.info('Slide baru ditambahkan!')
}

function duplicateSlide(idx) {
  const target = slides.value[idx]
  const clone = JSON.parse(JSON.stringify(target))
  clone.id = Date.now()
  clone.title = (clone.title || '') + ' (Copy)'
  slides.value.splice(idx + 1, 0, clone)
  currentSlideIndex.value = idx + 1
  toast.success('Slide berhasil diduplikat!')
}

function moveSlide(idx, direction) {
  const newIdx = idx + direction
  if (newIdx < 0 || newIdx >= slides.value.length) return
  const item = slides.value.splice(idx, 1)[0]
  slides.value.splice(newIdx, 0, item)
  currentSlideIndex.value = newIdx
}

function deleteSlide(idx) {
  if (slides.value.length <= 1) return
  slides.value.splice(idx, 1)
  if (currentSlideIndex.value >= slides.value.length) {
    currentSlideIndex.value = slides.value.length - 1
  }
}

function addPoint() {
  if (!currentSlide.value.points) currentSlide.value.points = []
  currentSlide.value.points.push('Poin baru...')
}

function removePoint(idx) {
  currentSlide.value.points.splice(idx, 1)
}

function applyPalette(pal) {
  if (applyScope.value === 'all') {
    applyPaletteToAll(pal)
  } else {
    currentSlide.value.paletteId = pal.id
    clearCustomHex()
    toast.info(`Palet ${pal.name} diterapkan ke slide ini!`)
  }
}

function applyPaletteToAll(pal) {
  slides.value.forEach((s) => {
    s.paletteId = pal.id
    s.customBg = ''
    s.customPrimary = ''
    s.customAccent = ''
    s.customText = ''
  })
  toast.success(`Palet "${pal.name}" diterapkan ke SEMUA (${slides.value.length}) slide! 🎨`)
}

function applyFontToAll() {
  const currentFont = currentSlide.value.fontFamily || 'font-serif'
  slides.value.forEach((s) => {
    s.fontFamily = currentFont
  })
  toast.success(`Font diterapkan ke SEMUA (${slides.value.length}) slide! ✍️`)
}

function applyBgPatternToAll() {
  const currentPat = currentSlide.value.bgPattern || 'glow'
  slides.value.forEach((s) => {
    s.bgPattern = currentPat
  })
  toast.success(`Tekstur latar diterapkan ke SEMUA (${slides.value.length}) slide! ✨`)
}

function toggleSticker(stk) {
  if (!currentSlide.value.selectedStickers) currentSlide.value.selectedStickers = []
  const arr = currentSlide.value.selectedStickers
  const idx = arr.indexOf(stk.file)
  if (idx > -1) {
    arr.splice(idx, 1)
  } else {
    arr.push(stk.file)
  }
}

function toggleOrnament(orn) {
  if (currentSlide.value.selectedOrnament === orn.file) {
    currentSlide.value.selectedOrnament = null
  } else {
    currentSlide.value.selectedOrnament = orn.file
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    currentSlide.value.customImage = event.target.result
    toast.success('Foto berhasil diupload ke kanvas!')
  }
  reader.readAsDataURL(file)
}

// Single Slide Export
async function exportCurrentSlidePng() {
  if (!canvasRef.value) return
  isExporting.value = true
  const oldSafe = showSafeZone.value
  showSafeZone.value = false

  try {
    await new Promise((r) => setTimeout(r, 100))
    const dataUrl = await toPng(canvasRef.value, {
      pixelRatio: 1.5,
      quality: 0.98,
      cacheBust: true,
    })
    const link = document.createElement('a')
    link.download = `satuundangan-slide-${currentSlideIndex.value + 1}.png`
    link.href = dataUrl
    link.click()
    toast.success('Slide berhasil didownload!')
  } catch (err) {
    console.error(err)
    toast.error('Gagal export: ' + err.message)
  } finally {
    showSafeZone.value = oldSafe
    isExporting.value = false
  }
}

// Copy Image Directly to Clipboard
async function copyImageToClipboard() {
  if (!canvasRef.value) return
  isExporting.value = true
  const oldSafe = showSafeZone.value
  showSafeZone.value = false

  try {
    await new Promise((r) => setTimeout(r, 100))
    const dataUrl = await toPng(canvasRef.value, {
      pixelRatio: 1.5,
      quality: 0.95,
      cacheBust: true,
    })
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    toast.success('Gambar berhasil disalin ke clipboard! Siap di-paste langsung 📋')
  } catch (err) {
    console.error('Copy to clipboard failed:', err)
    toast.error('Browser tidak mendukung copy image: ' + err.message)
  } finally {
    showSafeZone.value = oldSafe
    isExporting.value = false
  }
}

// Batch Carousel ZIP Export
async function exportAllSlidesZip() {
  if (!canvasRef.value || slides.value.length === 0) return
  isExporting.value = true
  const oldSafe = showSafeZone.value
  showSafeZone.value = false
  const originalIndex = currentSlideIndex.value

  const zip = new JSZip()
  const imgFolder = zip.folder('satuundangan-carousel')

  try {
    for (let i = 0; i < slides.value.length; i++) {
      currentSlideIndex.value = i
      await new Promise((r) => setTimeout(r, 200))
      const dataUrl = await toPng(canvasRef.value, {
        pixelRatio: 1.5,
        quality: 0.98,
        cacheBust: true,
      })
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
      imgFolder.file(`slide-${i + 1}.png`, base64Data, { base64: true })
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.download = `satuundangan-carousel-${Date.now()}.zip`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)

    toast.success(`Berhasil! ${slides.value.length} slide di-pack dalam 1 file ZIP! 📦`)
  } catch (err) {
    console.error(err)
    toast.error('Gagal export ZIP: ' + err.message)
  } finally {
    currentSlideIndex.value = originalIndex
    showSafeZone.value = oldSafe
    isExporting.value = false
  }
}

// Copy Caption & Hashtags
function copyInstagramCaption() {
  const current = currentSlide.value
  const caption = `${current.title}\n\n${current.subtitle || ''}\n\n✨ Bikin undangan pernikahan digital estetik & anti-ribet mulai 49rb di @satuundangan_id!\n\nFitur lengkap:\n✅ 30+ Pilihan Tema (Adat Nusantara, Luxury, Anime, Cat Lovers)\n✅ Bebas Watermark & Aktif 1 Tahun Penuh\n✅ Sebar WA Otomatis & QR Code Buku Tamu\n✅ Free Wedding Planner & Kalkulator Weton\n\n👉 Coba buat gratis sekarang: Klik link di bio @satuundangan_id\n\n.\n#undanganpernikahan #undangandigital #undanganonline #weddinginvitation #tipsnikah #persiapanpernikahan #nikahhemat #undanganpernikahandigital #satuundangan`

  navigator.clipboard.writeText(caption)
  toast.success('Caption & Hashtags berhasil disalin ke clipboard! 📋')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f0ec;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d6d3cd;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a47148;
}
</style>
