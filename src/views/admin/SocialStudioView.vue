<template>
  <div class="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
    <!-- LEFT SIDEBAR: Canva-like Tool Tabs -->
    <div class="w-16 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 justify-between z-30">
      <div class="flex flex-col items-center gap-5 w-full">
        <!-- Logo -->
        <router-link to="/admin" class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20" title="Kembali ke Admin">
          <img src="/logo.svg" alt="Satu Undangan" class="w-7 h-7 object-contain" />
        </router-link>

        <div class="w-8 h-[1px] bg-slate-800"></div>

        <!-- Navigation Tool Tabs -->
        <button
          v-for="tab in SIDEBAR_TABS"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex flex-col items-center gap-1 w-full py-2.5 transition-all text-[10px] font-medium"
          :class="activeTab === tab.id ? 'text-amber-400 bg-amber-500/10 border-r-2 border-amber-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'"
        >
          <i :class="['pi', tab.icon, 'text-base']"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Admin link -->
      <router-link to="/admin" class="p-2.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors" title="Keluar ke Dashboard Admin">
        <i class="pi pi-sign-out text-base"></i>
      </router-link>
    </div>

    <!-- SUB-PANEL: Active Tool Drawer -->
    <div class="w-80 shrink-0 bg-slate-900/90 border-r border-slate-800/80 flex flex-col h-full z-20 overflow-hidden shadow-2xl">
      <!-- Drawer Header -->
      <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <h2 class="font-bold text-sm text-slate-100 flex items-center gap-2">
          <span>{{ currentTabTitle }}</span>
        </h2>
        <span class="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">Canva Studio</span>
      </div>

      <!-- Drawer Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
        <!-- TAB 1: TEMPLATES & PRESETS -->
        <div v-if="activeTab === 'templates'" class="space-y-4">
          <!-- 9-Grid Rescue Presets -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-amber-400 flex items-center gap-1.5">
                <i class="pi pi-bolt text-xs"></i> 9-Grid Rescue Presets
              </span>
              <span class="text-[10px] text-slate-500">1-Klik Terapkan</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <button
                v-for="preset in PLAYBOOK_PRESETS"
                :key="preset.id"
                @click="applyPreset(preset)"
                class="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-amber-600/20 hover:border-amber-500/40 border border-slate-700/60 text-slate-300 hover:text-amber-200 transition-all text-left truncate flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                <span class="truncate">{{ preset.label }}</span>
              </button>
            </div>
          </div>

          <!-- Layout Type -->
          <div>
            <label class="block font-bold text-slate-300 mb-2">Pilih Tipe Layout</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="t in TEMPLATE_TYPES"
                :key="t.id"
                @click="currentSlide.type = t.id"
                class="p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5"
                :class="currentSlide.type === t.id ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold' : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'"
              >
                <i :class="['pi', t.icon, 'text-sm text-amber-400']"></i>
                <span class="text-xs truncate">{{ t.name }}</span>
              </button>
            </div>
          </div>

          <!-- Template Mockup Picker (if in Showcase Mode) -->
          <div v-if="currentSlide.type === 'showcase'" class="space-y-2">
            <label class="block font-bold text-slate-300">Pilih Desain Undangan</label>
            <select
              v-model="currentSlide.templateSlug"
              class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-amber-500 capitalize"
            >
              <option v-for="tpl in TEMPLATE_LIST" :key="tpl.slug" :value="tpl.slug">
                {{ tpl.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- TAB 2: TEXT & TYPOGRAPHY -->
        <div v-if="activeTab === 'text'" class="space-y-4">
          <!-- Category Badge -->
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Badge Kategori</label>
            <input
              v-model="currentSlide.badge"
              type="text"
              placeholder="Contoh: TIPS NIKAH, ADAT NUSANTARA"
              class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-amber-500"
            />
          </div>

          <!-- Title / Headline -->
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Headline Utama</label>
            <textarea
              v-model="currentSlide.title"
              rows="3"
              placeholder="Tulis headline hook..."
              class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-amber-500 leading-relaxed"
            ></textarea>
          </div>

          <!-- Subtitle / Body -->
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Subtitle / Keterangan</label>
            <textarea
              v-model="currentSlide.subtitle"
              rows="3"
              placeholder="Tulis penjelasan..."
              class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-amber-500 leading-relaxed"
            ></textarea>
          </div>

          <!-- Points list for Slide Edukasi -->
          <div v-if="currentSlide.type === 'body'" class="space-y-2">
            <label class="block font-semibold text-slate-300">Daftar Poin</label>
            <div v-for="(p, i) in currentSlide.points" :key="i" class="flex gap-2 items-center">
              <span class="font-bold text-amber-400 w-4">{{ i + 1 }}</span>
              <input
                v-model="currentSlide.points[i]"
                type="text"
                class="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
              />
              <button @click="removePoint(i)" class="text-slate-500 hover:text-rose-400 p-1">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <button
              @click="addPoint"
              class="w-full py-1.5 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-amber-300 text-xs flex items-center justify-center gap-1"
            >
              <i class="pi pi-plus text-xs"></i> Tambah Poin
            </button>
          </div>

          <!-- Typography Controls -->
          <div class="pt-3 border-t border-slate-800 space-y-3">
            <label class="block font-bold text-slate-300">Pengaturan Font Canva</label>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">Jenis Huruf (Font Family)</label>
              <select
                v-model="currentSlide.fontFamily"
                class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-amber-500"
              >
                <option value="font-serif">Playfair Display (Luxury Serif)</option>
                <option value="font-sans">Inter (Modern Clean Sans)</option>
                <option value="font-montserrat">Montserrat (Bold Editorial)</option>
                <option value="font-alex">Alex Brush (Romantic Script)</option>
              </select>
            </div>

            <!-- Font Size Slider -->
            <div>
              <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Ukuran Judul (Size)</span>
                <span class="font-bold text-amber-400">{{ currentSlide.fontSize || 64 }}px</span>
              </div>
              <input
                type="range"
                v-model.number="currentSlide.fontSize"
                min="40"
                max="96"
                step="2"
                class="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <!-- Alignment -->
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-slate-400">Rata Teks</span>
              <div class="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  v-for="align in ['left', 'center', 'right']"
                  :key="align"
                  @click="currentSlide.textAlign = align"
                  class="px-3 py-1 rounded text-xs transition-colors"
                  :class="currentSlide.textAlign === align ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
                >
                  <i :class="`pi pi-align-${align}`"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: COLORS & PALETTE -->
        <div v-if="activeTab === 'colors'" class="space-y-4">
          <label class="block font-bold text-slate-300 mb-2">Preset Palet Brand</label>
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="pal in PALETTES"
              :key="pal.id"
              @click="applyPalette(pal)"
              class="p-2.5 rounded-xl border flex items-center justify-between transition-all"
              :class="currentSlide.paletteId === pal.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'"
            >
              <div class="flex items-center gap-2.5">
                <div class="flex -space-x-2">
                  <span class="w-5 h-5 rounded-full border border-slate-900 shadow" :style="{ backgroundColor: pal.bg }"></span>
                  <span class="w-5 h-5 rounded-full border border-slate-900 shadow" :style="{ backgroundColor: pal.primary }"></span>
                  <span class="w-5 h-5 rounded-full border border-slate-900 shadow" :style="{ backgroundColor: pal.accent }"></span>
                </div>
                <span class="font-medium text-xs text-slate-200">{{ pal.name }}</span>
              </div>
              <i v-if="currentSlide.paletteId === pal.id" class="pi pi-check text-amber-400 text-xs"></i>
            </button>
          </div>

          <!-- Custom Color Picker -->
          <div class="pt-4 border-t border-slate-800 space-y-3">
            <label class="block font-bold text-slate-300">Kustomisasi HEX Manual</label>
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-slate-400">Background Kanvas</span>
              <div class="flex items-center gap-2">
                <input type="color" v-model="currentSlide.customBg" class="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent" />
                <span class="font-mono text-[11px] text-slate-400 uppercase">{{ currentSlide.customBg }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-slate-400">Warna Judul (Primary)</span>
              <div class="flex items-center gap-2">
                <input type="color" v-model="currentSlide.customPrimary" class="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent" />
                <span class="font-mono text-[11px] text-slate-400 uppercase">{{ currentSlide.customPrimary }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-slate-400">Warna Aksen / Emas</span>
              <div class="flex items-center gap-2">
                <input type="color" v-model="currentSlide.customAccent" class="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent" />
                <span class="font-mono text-[11px] text-slate-400 uppercase">{{ currentSlide.customAccent }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: ELEMENTS & STICKERS -->
        <div v-if="activeTab === 'elements'" class="space-y-4">
          <div>
            <label class="block font-bold text-slate-300 mb-1">Stiker Anabul & Romantis</label>
            <p class="text-[11px] text-slate-400 mb-2.5">Klik stiker untuk pasang di kanvas:</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="stk in STICKERS_LIST"
                :key="stk.id"
                @click="toggleSticker(stk)"
                class="p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center"
                :class="currentSlide.selectedStickers.includes(stk.file) ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'"
              >
                <img :src="stk.file" :alt="stk.name" class="w-10 h-10 object-contain drop-shadow" />
                <span class="text-[10px] text-slate-300 truncate w-full">{{ stk.name }}</span>
              </button>
            </div>
          </div>

          <!-- Ornamen Adat Nusantara -->
          <div class="pt-3 border-t border-slate-800">
            <label class="block font-bold text-slate-300 mb-1">Ornamen Adat Nusantara</label>
            <p class="text-[11px] text-slate-400 mb-2.5">Ornamen emas khas daerah:</p>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="orn in ORNAMENTS_LIST"
                :key="orn.id"
                @click="toggleOrnament(orn)"
                class="p-2.5 rounded-xl border flex items-center gap-2.5 transition-all"
                :class="currentSlide.selectedOrnament === orn.file ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'"
              >
                <img :src="orn.file" :alt="orn.name" class="w-8 h-8 object-contain" />
                <span class="text-[11px] text-slate-300 font-medium truncate">{{ orn.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 5: UPLOAD MEDIA -->
        <div v-if="activeTab === 'upload'" class="space-y-4">
          <label class="block font-bold text-slate-300">Upload Foto Pengantin / Klien</label>
          <div
            @click="$refs.fileInputRef.click()"
            class="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-800/30 hover:bg-amber-500/5 transition-all group"
          >
            <i class="pi pi-cloud-upload text-3xl text-slate-500 group-hover:text-amber-400 mb-2 transition-colors"></i>
            <p class="font-bold text-xs text-slate-300 group-hover:text-white">Pilih Foto dari Komputer</p>
            <p class="text-[10px] text-slate-500 mt-1">PNG, JPG, WebP (Maks 10MB)</p>
            <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
          </div>

          <div v-if="currentSlide.customImage" class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <img :src="currentSlide.customImage" class="w-10 h-10 rounded-lg object-cover border border-slate-600" />
              <div>
                <span class="font-bold text-xs text-slate-200 block">Foto Kustom Aktif</span>
                <span class="text-[10px] text-emerald-400">Terpasang di Kanvas</span>
              </div>
            </div>
            <button @click="currentSlide.customImage = null" class="text-slate-500 hover:text-rose-400 p-1">
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN STAGE & TIMELINE -->
    <div class="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
      <!-- TOP CONTROL TOOLBAR -->
      <div class="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/60 backdrop-blur-md z-10">
        <!-- Aspect Ratio Switcher -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-400 font-semibold">Ukuran Kanvas:</span>
          <div class="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              v-for="dim in ASPECT_RATIOS"
              :key="dim.id"
              @click="currentDimension = dim"
              class="px-2.5 py-1 rounded-md transition-all font-semibold flex items-center gap-1.5"
              :class="currentDimension.id === dim.id ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'"
            >
              <i :class="['pi', dim.icon, 'text-xs']"></i>
              <span>{{ dim.label }}</span>
            </button>
          </div>
        </div>

        <!-- Safe Zone & Zoom Controls -->
        <div class="flex items-center gap-5">
          <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white select-none">
            <input type="checkbox" v-model="showSafeZone" class="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800 cursor-pointer" />
            <span>Safe Zone 1:1 Profile</span>
          </label>

          <div class="w-[1px] h-4 bg-slate-800"></div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">Zoom:</span>
            <div class="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                v-for="sc in [0.35, 0.45, 0.6]"
                :key="sc"
                @click="previewScale = sc"
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="previewScale === sc ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'"
              >
                {{ Math.round(sc * 100) }}%
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CANVAS STAGE VIEWPORT -->
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
            class="relative shadow-[0_30px_90px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden transition-all duration-300"
            :style="{
              width: `${currentDimension.width}px`,
              height: `${currentDimension.height}px`,
              backgroundColor: currentSlide.customBg || currentPal.bg,
              color: currentSlide.customText || currentPal.text,
            }"
          >
            <!-- Background Radial Glow -->
            <div
              class="absolute inset-0 pointer-events-none"
              :style="{
                backgroundImage: `
                  radial-gradient(circle at 10% 10%, ${(currentSlide.customPrimary || currentPal.primary)}18, transparent 50%),
                  radial-gradient(circle at 90% 90%, ${(currentSlide.customAccent || currentPal.accent)}22, transparent 55%)
                `,
              }"
            ></div>

            <!-- Double Hairline Luxury Gold Border -->
            <div class="absolute inset-[36px] border border-amber-600/30 pointer-events-none"></div>
            <div class="absolute inset-[48px] border border-amber-600/15 pointer-events-none"></div>

            <!-- Optional Ornament (Top Corner or Center Emblem) -->
            <div v-if="currentSlide.selectedOrnament" class="absolute top-10 right-14 w-28 h-28 pointer-events-none z-10 opacity-70">
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
              <!-- Brand Mark -->
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-2 flex items-center justify-center shadow-lg">
                  <img src="/logo.svg" alt="Logo" class="w-full h-full object-contain filter drop-shadow" />
                </div>
                <div>
                  <span class="block font-serif text-3xl font-extrabold tracking-tight" :style="{ color: currentSlide.customPrimary || currentPal.primary }">
                    Satu Undangan
                  </span>
                  <span class="block text-xs uppercase tracking-[0.3em] font-bold opacity-60">
                    satuundangan.id
                  </span>
                </div>
              </div>

              <!-- Category Badge & Slide Count Pill -->
              <div class="flex items-center gap-4">
                <div
                  v-if="currentSlide.badge"
                  class="px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border shadow-sm"
                  :style="{
                    backgroundColor: (currentSlide.customAccent || currentPal.accent) + '22',
                    borderColor: (currentSlide.customAccent || currentPal.accent) + '66',
                    color: currentSlide.customPrimary || currentPal.primary,
                  }"
                >
                  {{ currentSlide.badge }}
                </div>
                <div
                  class="px-4 py-2 rounded-full text-sm font-extrabold tracking-widest"
                  :style="{
                    backgroundColor: (currentSlide.customText || currentPal.text) + '15',
                    color: currentSlide.customText || currentPal.text,
                  }"
                >
                  {{ currentSlideIndex + 1 }} / {{ slides.length }}
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 1 - COVER -->
            <div
              v-if="currentSlide.type === 'cover'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto"
              :class="`text-${currentSlide.textAlign || 'left'}`"
            >
              <div class="flex items-center gap-3 mb-8 opacity-80" :class="currentSlide.textAlign === 'center' ? 'justify-center' : ''">
                <span class="w-16 h-[2px]" :style="{ backgroundColor: currentSlide.customAccent || currentPal.accent }"></span>
                <i class="pi pi-sparkles text-sm" :style="{ color: currentSlide.customAccent || currentPal.accent }"></i>
                <span class="w-16 h-[2px]" :style="{ backgroundColor: currentSlide.customAccent || currentPal.accent }"></span>
              </div>

              <h1
                :class="currentSlide.fontFamily || 'font-serif'"
                :style="{
                  fontSize: `${currentSlide.fontSize || 66}px`,
                  color: currentSlide.customPrimary || currentPal.primary,
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

              <!-- Custom Uploaded Photo Preview if present -->
              <div v-if="currentSlide.customImage" class="mt-8 mx-auto w-[360px] h-[360px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60">
                <img :src="currentSlide.customImage" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 2 - BODY -->
            <div
              v-if="currentSlide.type === 'body'"
              class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto space-y-6"
            >
              <h2
                :class="currentSlide.fontFamily || 'font-serif'"
                :style="{
                  fontSize: `${(currentSlide.fontSize || 66) * 0.75}px`,
                  color: currentSlide.customPrimary || currentPal.primary,
                }"
                class="font-bold leading-tight"
              >
                {{ currentSlide.title }}
              </h2>

              <p v-if="currentSlide.subtitle" class="text-[24px] opacity-80 leading-relaxed mb-4">
                {{ currentSlide.subtitle }}
              </p>

              <!-- Points Stack -->
              <div class="space-y-4">
                <div
                  v-for="(point, i) in currentSlide.points"
                  :key="i"
                  class="p-6 rounded-2xl border backdrop-blur-md flex items-start gap-5 shadow-lg"
                  :style="{
                    backgroundColor: currentPal.cardBg || '#ffffff',
                    borderColor: (currentSlide.customPrimary || currentPal.primary) + '25',
                  }"
                >
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 text-white shadow-md"
                    :style="{ backgroundColor: currentSlide.customPrimary || currentPal.primary }"
                  >
                    0{{ i + 1 }}
                  </div>
                  <p class="text-[24px] font-medium leading-snug self-center" :style="{ color: currentSlide.customText || currentPal.text }">
                    {{ point }}
                  </p>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 3 - SHOWCASE -->
            <div v-if="currentSlide.type === 'showcase'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto text-center">
              <div class="mb-6">
                <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-2" :style="{ color: currentSlide.customAccent || currentPal.accent }">
                  Koleksi Tema Pernikahan
                </span>
                <h2
                  :class="currentSlide.fontFamily || 'font-serif'"
                  :style="{
                    fontSize: `${(currentSlide.fontSize || 66) * 0.8}px`,
                    color: currentSlide.customPrimary || currentPal.primary,
                  }"
                  class="font-black leading-tight"
                >
                  {{ currentSlide.title }}
                </h2>
                <p v-if="currentSlide.subtitle" class="text-[22px] opacity-80 mt-2 max-w-[750px] mx-auto">
                  {{ currentSlide.subtitle }}
                </p>
              </div>

              <!-- Smartphone Frame -->
              <div class="relative w-[340px] h-[640px] mx-auto rounded-[46px] border-[10px] border-slate-900 bg-slate-950 shadow-[0_30px_70px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col">
                <div class="w-32 h-5 bg-slate-900 rounded-b-2xl mx-auto z-30 shrink-0"></div>
                <div class="w-full flex-1 overflow-hidden relative bg-stone-100 flex items-start justify-center">
                  <img
                    :src="`/assets/templates/${currentSlide.templateSlug || 'dark-elegant'}.png`"
                    :alt="currentSlide.templateSlug"
                    class="w-full object-cover object-top"
                    @error="(e) => (e.target.src = '/assets/templates/dark-elegant.png')"
                  />
                  <!-- Price Pill -->
                  <div class="absolute bottom-5 inset-x-4 bg-slate-950/80 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl flex items-center justify-between shadow-2xl">
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

            <!-- CANVAS BODY: TYPE 4 - TWEET -->
            <div v-if="currentSlide.type === 'tweet'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto">
              <div
                class="p-12 rounded-[36px] border shadow-2xl backdrop-blur-md"
                :style="{
                  backgroundColor: currentPal.cardBg || '#ffffff',
                  borderColor: (currentSlide.customPrimary || currentPal.primary) + '25',
                }"
              >
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-5">
                    <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-md">
                      <img src="/apple-touch-icon.png" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-[32px] text-slate-900">Satu Undangan</span>
                        <i class="pi pi-verified text-xl text-sky-500"></i>
                      </div>
                      <span class="text-[20px] text-slate-500">@satuundangan_id</span>
                    </div>
                  </div>
                  <i class="pi pi-twitter text-3xl text-sky-500/80"></i>
                </div>
                <p class="font-sans text-[36px] font-normal text-slate-800 leading-[1.4] mb-8">
                  {{ currentSlide.title }}
                </p>
                <div class="border-t border-slate-200/80 pt-6 flex items-center justify-between text-slate-500 text-[20px]">
                  <span>22:00 • 23 Okt 2026</span>
                  <div class="flex items-center gap-8 font-semibold">
                    <span><strong class="text-slate-800">1,420</strong> Retweets</span>
                    <span><strong class="text-slate-800">8,930</strong> Likes</span>
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
            <div class="relative z-10 pb-16 px-16 flex items-center justify-between border-t border-slate-700/20 pt-8">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow"
                  :style="{ backgroundColor: currentSlide.customPrimary || currentPal.primary, color: currentPal.bg }"
                >
                  <i class="pi pi-instagram"></i>
                </div>
                <span class="font-bold text-xl tracking-tight" :style="{ color: currentSlide.customText || currentPal.text }">
                  @satuundangan_id
                </span>
              </div>

              <div class="flex items-center gap-3 font-semibold text-lg" :style="{ color: currentSlide.customPrimary || currentPal.primary }">
                <span>{{ currentSlideIndex < slides.length - 1 ? 'Geser Selanjutnya' : 'Kunjungi satuundangan.id' }}</span>
                <i :class="currentSlideIndex < slides.length - 1 ? 'pi pi-arrow-right' : 'pi pi-external-link'" class="text-base"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM FILMSTRIP: Multi-Slide Carousel Deck Manager (Canva-style) -->
      <div class="h-28 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <!-- Slides Strip -->
        <div class="flex items-center gap-3 overflow-x-auto py-2 custom-scrollbar">
          <div
            v-for="(s, idx) in slides"
            :key="s.id"
            @click="currentSlideIndex = idx"
            class="relative w-16 h-20 rounded-xl border-2 cursor-pointer transition-all shrink-0 flex flex-col justify-between p-1.5 overflow-hidden group shadow"
            :class="currentSlideIndex === idx ? 'border-amber-500 bg-amber-500/10 shadow-amber-500/20 scale-105' : 'border-slate-700 bg-slate-800/80 hover:border-slate-500'"
            :style="{ backgroundColor: s.customBg || '#fffaf3' }"
          >
            <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-900/80 text-white w-max">
              #{{ idx + 1 }}
            </span>
            <p class="text-[8px] font-bold line-clamp-2 leading-tight" :style="{ color: s.customPrimary || '#a47148' }">
              {{ s.title || 'Slide ' + (idx + 1) }}
            </p>
            <button
              v-if="slides.length > 1"
              @click.stop="deleteSlide(idx)"
              class="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              title="Hapus Slide"
            >
              <i class="pi pi-times text-[8px]"></i>
            </button>
          </div>

          <!-- Add Slide Button -->
          <button
            @click="addNewSlide"
            class="w-16 h-20 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-800/40 hover:bg-amber-500/10 text-slate-400 hover:text-amber-300 flex flex-col items-center justify-center gap-1 shrink-0 transition-all"
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
            class="py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <i class="pi pi-copy text-xs"></i>
            <span>Salin Caption</span>
          </button>

          <button
            @click="exportCurrentSlidePng"
            :disabled="isExporting"
            class="py-2.5 px-4 rounded-xl border border-amber-500/40 hover:border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <i v-if="!isExporting" class="pi pi-image text-xs"></i>
            <i v-else class="pi pi-spin pi-spinner text-xs"></i>
            <span>Unduh Slide Ini</span>
          </button>

          <button
            @click="exportAllSlidesZip"
            :disabled="isExporting"
            class="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <i v-if="!isExporting" class="pi pi-download text-sm"></i>
            <i v-else class="pi pi-spin pi-spinner text-sm"></i>
            <span>{{ isExporting ? 'Mengepak ZIP...' : `Download Semua (${slides.length} Slide) ZIP` }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

// Stickers List (from public/assets/images/)
const STICKERS_LIST = [
  { id: 'cat-paw', name: 'Cat Paw 🐾', file: '/assets/images/clay-cat-paw.png' },
  { id: 'clay-heart', name: 'Heart 3D ❤️', file: '/assets/images/clay-heart.png' },
  { id: 'clay-rings', name: 'Cincin Emas 💍', file: '/assets/images/luxury-clay-rings.png' },
  { id: 'clay-cats', name: 'Anabul 🐱', file: '/assets/images/luxury-clay-cats.png' },
  { id: 'cat-seal', name: 'Wax Seal', file: '/assets/images/cat-paw-seal.png' },
  { id: 'clay-envelope', name: 'Amplop', file: '/assets/images/luxury-clay-envelope.png' },
]

// Ornaments List (from public/assets/ornaments/)
const ORNAMENTS_LIST = [
  { id: 'siger', name: 'Siger Sunda', file: '/assets/ornaments/siger-gold.png' },
  { id: 'gunungan', name: 'Gunungan Jawa', file: '/assets/ornaments/gunungan-gold.png' },
  { id: 'gorga', name: 'Gorga Batak', file: '/assets/ornaments/gorga-batak.png' },
  { id: 'dayak', name: 'Talawang Dayak', file: '/assets/ornaments/dayak-talawang.png' },
]

// Template Types
const TEMPLATE_TYPES = [
  { id: 'cover', name: 'Cover Hook', icon: 'pi-bookmark' },
  { id: 'body', name: 'Slide Edukasi', icon: 'pi-list' },
  { id: 'showcase', name: 'Mockup Tema', icon: 'pi-mobile' },
  { id: 'tweet', name: 'Tweet / Quote', icon: 'pi-comment' },
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

// Initial Multi-Slide Deck State
const slides = ref([
  {
    id: 1,
    type: 'cover',
    badge: 'TIPS HEMAT NIKAH',
    title: 'Cetak 500 Undangan Kertas Buat Dibuang ke Tong Sampah? 😭',
    subtitle: 'Bukan pelit, tapi smart budgeting! Yuk hitung perbandingan riilnya.',
    paletteId: 'ivory',
    fontFamily: 'font-serif',
    fontSize: 66,
    textAlign: 'left',
    customBg: '',
    customPrimary: '',
    customAccent: '',
    customText: '',
    points: [],
    templateSlug: 'meowly-married',
    selectedStickers: [],
    selectedOrnament: null,
    customImage: null,
  },
  {
    id: 2,
    type: 'body',
    badge: 'KALKULASI BIAYA',
    title: 'Realita Undangan Fisik vs Digital',
    subtitle: 'Simak hitungan riil pos anggaran berikut:',
    paletteId: 'ivory',
    fontFamily: 'font-serif',
    fontSize: 56,
    textAlign: 'left',
    customBg: '',
    customPrimary: '',
    customAccent: '',
    customText: '',
    points: [
      'Cetak fisik 500 pcs x Rp 6.000 = Rp 3.000.000',
      'Fakta: 80% cuma dibaca 2 menit lalu masuk tempat sampah',
      'Pakai Satu Undangan cukup 79 ribu, hemat Rp 2.921.000!',
    ],
    templateSlug: 'meowly-married',
    selectedStickers: ['/assets/images/clay-heart.png'],
    selectedOrnament: null,
    customImage: null,
  },
  {
    id: 3,
    type: 'showcase',
    badge: 'PILIHAN TEMA',
    title: 'Desain Eksklusif Siap Pakai',
    subtitle: 'Mulai dari Adat Nusantara sakral sampai tema 3D Cat Lovers lucu!',
    paletteId: 'ivory',
    fontFamily: 'font-serif',
    fontSize: 54,
    textAlign: 'center',
    customBg: '',
    customPrimary: '',
    customAccent: '',
    customText: '',
    points: [],
    templateSlug: 'meowly-married',
    selectedStickers: ['/assets/images/clay-cat-paw.png'],
    selectedOrnament: null,
    customImage: null,
  },
])

const currentSlideIndex = ref(0)
const currentSlide = computed(() => slides.value[currentSlideIndex.value] || slides.value[0])
const currentPal = computed(() => PALETTES.find((p) => p.id === currentSlide.value.paletteId) || PALETTES[0])

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
    customBg: '',
    customPrimary: '',
    customAccent: '',
    customText: '',
    points: ['Poin pertama yang menarik', 'Poin kedua yang menguatkan hook'],
    templateSlug: 'meowly-married',
    selectedStickers: [],
    selectedOrnament: null,
    customImage: null,
  })
  currentSlideIndex.value = slides.value.length - 1
  toast.info('Slide baru ditambahkan!')
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
  currentSlide.value.paletteId = pal.id
  currentSlide.value.customBg = ''
  currentSlide.value.customPrimary = ''
  currentSlide.value.customAccent = ''
  currentSlide.value.customText = ''
}

function toggleSticker(stk) {
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

// 9-Grid Playbook Presets
const PLAYBOOK_PRESETS = [
  {
    id: 'post1',
    label: 'Post 1: Adat Nusantara',
    type: 'showcase',
    paletteId: 'ivory',
    badge: 'HERITAGE NUSANTARA',
    title: 'Menikah dengan Adat, Tetap Modern & Elegan',
    subtitle: 'Sentuhan ornamen sakral Minangkabau berpadu estetika smartphone modern.',
    templateSlug: 'minang-suntiang-emas',
  },
  {
    id: 'post2',
    label: 'Post 2: Kalkulasi Budget',
    type: 'cover',
    paletteId: 'ivory',
    badge: 'BONGKAR BUDGET',
    title: 'Cetak 500 Undangan Kertas Buat Dibuang ke Tong Sampah? 😭',
    subtitle: 'Bukan pelit, tapi smart budgeting! Yuk hitung perbandingan riilnya.',
  },
  {
    id: 'post3',
    label: 'Post 3: QR Code Tamu',
    type: 'body',
    paletteId: 'dark',
    badge: 'FITUR RESEPSI',
    title: 'Resepsi Bebas Drama Antre di Meja Buku Tamu',
    subtitle: 'Kenapa fitur QR Code Check-In Satu Undangan bikin tamu terkesan:',
    points: [
      'Tamu cukup tunjukkan QR di undangan HP',
      'Penerima tamu scan 1 detik, langsung tercatat',
      'Gak ada antrean panjang & pulpen macet di meja depan',
    ],
  },
  {
    id: 'post4',
    label: 'Post 4: Anabul Cat Lovers',
    type: 'showcase',
    paletteId: 'ivory',
    badge: 'SPECIAL NICHE 🐾',
    title: 'Undangan Nikah Khusus Anabul Parents Pertama di Indonesia!',
    subtitle: 'Animasi 3D clay telapak kucing pastel imut siap meriahkan hari bahagiamu.',
    templateSlug: 'meowly-married',
  },
  {
    id: 'post_tweet',
    label: 'Quote: Curhat Manten',
    type: 'tweet',
    paletteId: 'ivory',
    badge: 'CURHAT MANTEN',
    title: 'Ternyata debat milih vendor katering & warna suvenir jauh lebih menguras emosi daripada skripsi 😭 Untung urusan undangan 5 menit kelar di satuundangan.id',
  },
]

function applyPreset(preset) {
  currentSlide.value.type = preset.type
  currentSlide.value.paletteId = preset.paletteId
  currentSlide.value.badge = preset.badge
  currentSlide.value.title = preset.title
  if (preset.subtitle) currentSlide.value.subtitle = preset.subtitle
  if (preset.points) currentSlide.value.points = [...preset.points]
  if (preset.templateSlug) currentSlide.value.templateSlug = preset.templateSlug
  toast.success(`Preset "${preset.label}" berhasil dimuat!`)
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

// Batch Carousel ZIP Export (Canva Style)
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
      await new Promise((r) => setTimeout(r, 200)) // Wait render
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
  background: #020617;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
