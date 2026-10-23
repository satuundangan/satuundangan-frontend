<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
    <!-- LEFT PANEL: Controls & Customizer -->
    <div class="w-[440px] shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col h-full shadow-2xl z-20">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <i class="pi pi-camera text-base"></i>
          </div>
          <div>
            <h1 class="font-bold text-sm text-slate-100 flex items-center gap-2">
              Social Media Studio
              <span class="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">IG Kit</span>
            </h1>
            <p class="text-[11px] text-slate-400">@satuundangan_id Post Creator</p>
          </div>
        </div>
        <router-link
          to="/admin"
          class="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          title="Kembali ke Admin Dashboard"
        >
          <i class="pi pi-arrow-left text-[10px]"></i>
          <span>Admin</span>
        </router-link>
      </div>

      <!-- Scrollable Controls -->
      <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6 custom-scrollbar text-xs">
        <!-- 1. Quick Rescue Presets (from Playbook) -->
        <div class="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-600/30 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-amber-400 flex items-center gap-1.5">
              <i class="pi pi-bolt text-xs"></i> Rescue 9-Grid Presets
            </span>
            <span class="text-[10px] text-slate-400">1-Klik Terapkan</span>
          </div>
          <p class="text-[11px] text-slate-300 leading-relaxed">
            Muat teks & konsep dari Playbook IG Revamp tanpa perlu mikir copy lagi:
          </p>
          <div class="grid grid-cols-2 gap-1.5 pt-1">
            <button
              v-for="preset in PLAYBOOK_PRESETS"
              :key="preset.id"
              @click="applyPreset(preset)"
              class="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-600/20 hover:border-amber-500/40 border border-slate-700/60 text-slate-300 hover:text-amber-200 transition-all text-left text-[11px] truncate flex items-center gap-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
              <span class="truncate">{{ preset.label }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Template Type Selector -->
        <div>
          <label class="block font-semibold text-slate-300 mb-2">Tipe Postingan</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="t in TEMPLATE_TYPES"
              :key="t.id"
              @click="currentType = t.id"
              class="p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5"
              :class="currentType === t.id ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'"
            >
              <i :class="['pi', t.icon, 'text-sm']"></i>
              <span class="text-[11px] font-medium leading-tight">{{ t.name }}</span>
            </button>
          </div>
        </div>

        <!-- 3. Color Palette Presets -->
        <div>
          <label class="block font-semibold text-slate-300 mb-2">Warna Brand (Palette)</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="p in PALETTES"
              :key="p.id"
              @click="currentPalette = p.id"
              class="p-2 rounded-xl border flex items-center gap-2.5 transition-all text-left"
              :class="currentPalette === p.id ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'"
            >
              <div class="flex -space-x-1.5 shrink-0">
                <span class="w-4 h-4 rounded-full border border-slate-900" :style="{ backgroundColor: p.bg }"></span>
                <span class="w-4 h-4 rounded-full border border-slate-900" :style="{ backgroundColor: p.primary }"></span>
                <span class="w-4 h-4 rounded-full border border-slate-900" :style="{ backgroundColor: p.accent }"></span>
              </div>
              <span class="text-[11px] font-medium truncate">{{ p.name }}</span>
            </button>
          </div>
        </div>

        <!-- 4. Dynamic Content Form Fields -->
        <div class="space-y-3 pt-2 border-t border-slate-800">
          <div class="flex items-center justify-between">
            <label class="font-semibold text-slate-300">Kustomisasi Teks</label>
            <span class="text-[10px] text-slate-500">Live Editor</span>
          </div>

          <!-- Category Pill -->
          <div>
            <label class="text-[11px] text-slate-400 block mb-1">Badge Kategori / Topik</label>
            <input
              v-model="postData.badge"
              type="text"
              placeholder="Contoh: TIPS HEMAT NIKAH, PANDUAN KUA"
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <!-- Main Title / Hook -->
          <div>
            <label class="text-[11px] text-slate-400 block mb-1">Headline Utama (Hook)</label>
            <textarea
              v-model="postData.title"
              rows="3"
              placeholder="Masukkan headline pemikat..."
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
            ></textarea>
          </div>

          <!-- Subtitle / Body / Highlight Points -->
          <div v-if="currentType === 'cover' || currentType === 'body' || currentType === 'pricing'">
            <label class="text-[11px] text-slate-400 block mb-1">Teks Penjelas / Subtitle</label>
            <textarea
              v-model="postData.subtitle"
              rows="3"
              placeholder="Penjelasan ringkas poin atau masalah..."
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
            ></textarea>
          </div>

          <!-- Points list for Carousel Body / Pricing -->
          <div v-if="currentType === 'body'" class="space-y-2">
            <label class="text-[11px] text-slate-400 block">Poin-poin Penjelas (Card List)</label>
            <div v-for="(point, idx) in postData.points" :key="idx" class="flex gap-2 items-center">
              <span class="text-[10px] font-bold text-amber-400 w-4">{{ idx + 1 }}</span>
              <input
                v-model="postData.points[idx]"
                type="text"
                class="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-amber-500"
              />
              <button
                @click="removePoint(idx)"
                class="text-slate-500 hover:text-rose-400 p-1"
                title="Hapus poin"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <button
              @click="addPoint"
              class="w-full py-1.5 border border-dashed border-slate-700 hover:border-amber-500/50 rounded-lg text-slate-400 hover:text-amber-300 text-[11px] flex items-center justify-center gap-1 transition-colors"
            >
              <i class="pi pi-plus text-[10px]"></i> Tambah Poin
            </button>
          </div>

          <!-- Template Selector for Showcase Mode -->
          <div v-if="currentType === 'showcase'">
            <label class="text-[11px] text-slate-400 block mb-1">Pilih Desain Template Undangan</label>
            <select
              v-model="postData.templateSlug"
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-xs capitalize"
            >
              <option v-for="t in TEMPLATE_LIST" :key="t.slug" :value="t.slug">
                {{ t.name }}
              </option>
            </select>
            <p class="text-[10px] text-slate-500 mt-1">Mockup smartphone akan otomatis memuat tangkapan layar tema ini.</p>
          </div>

          <!-- Weton Selector for Weton Mode -->
          <div v-if="currentType === 'weton'" class="space-y-2">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-slate-400 block mb-0.5">Weton Pria</label>
                <input v-model="postData.wetonPria" type="text" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 block mb-0.5">Weton Wanita</label>
                <input v-model="postData.wetonWanita" type="text" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs" />
              </div>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 block mb-0.5">Hasil Kecocokan (Status)</label>
              <input v-model="postData.wetonStatus" type="text" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300" />
            </div>
            <div>
              <label class="text-[10px] text-slate-400 block mb-0.5">Penjelasan Makna Primbon</label>
              <textarea v-model="postData.wetonMakna" rows="2" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs"></textarea>
            </div>
          </div>

          <!-- Tweet Mode Customizer -->
          <div v-if="currentType === 'tweet'" class="space-y-2">
            <div>
              <label class="text-[10px] text-slate-400 block mb-0.5">Penulis / Nama Akun</label>
              <input v-model="postData.tweetAuthor" type="text" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs" />
            </div>
            <div>
              <label class="text-[10px] text-slate-400 block mb-0.5">Username Handle</label>
              <input v-model="postData.tweetHandle" type="text" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-slate-400 block mb-0.5">Jumlah Retweets</label>
                <input v-model="postData.tweetRetweets" type="text" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 block mb-0.5">Jumlah Likes</label>
                <input v-model="postData.tweetLikes" type="text" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs" />
              </div>
            </div>
          </div>

          <!-- Slide Index Indicator -->
          <div class="flex items-center justify-between pt-2">
            <label class="text-[11px] text-slate-400">Nomor Slide Carousel</label>
            <div class="flex items-center gap-1.5">
              <input
                v-model.number="postData.slideIndex"
                type="number"
                min="1"
                max="10"
                class="w-12 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-center text-xs text-amber-300 font-bold"
              />
              <span class="text-slate-500">/</span>
              <input
                v-model.number="postData.totalSlides"
                type="number"
                min="1"
                max="10"
                class="w-12 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-center text-xs text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Action Buttons -->
      <div class="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-2">
        <button
          @click="exportHighResPng"
          :disabled="isExporting"
          class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="!isExporting" class="pi pi-download text-sm"></i>
          <i v-else class="pi pi-spin pi-spinner text-sm"></i>
          <span>{{ isExporting ? 'Merender Gambar HD...' : 'Download PNG Feed (1080 x 1350)' }}</span>
        </button>

        <button
          @click="copyInstagramCaption"
          class="w-full py-2 px-3 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <i class="pi pi-copy text-xs"></i>
          <span>Salin Copywriting & Hashtags</span>
        </button>
      </div>
    </div>

    <!-- RIGHT PANEL: Live Interactive Preview Stage -->
    <div class="flex-1 flex flex-col h-full bg-slate-900/90 relative overflow-hidden">
      <!-- Stage Toolbar -->
      <div class="h-14 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-sm z-10">
        <div class="flex items-center gap-4 text-xs text-slate-400">
          <span class="font-medium text-slate-300 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Pratinjau Asli: 1080 × 1350 px (4:5 Portrait)
          </span>
          <span class="text-slate-600">•</span>
          <label class="flex items-center gap-1.5 cursor-pointer hover:text-slate-200 select-none">
            <input type="checkbox" v-model="showSafeZone" class="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800" />
            <span>Tampilkan Safe Zone 1:1 Feed Profile</span>
          </label>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-500">Zoom Tampilan:</span>
          <div class="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              v-for="scale in [0.4, 0.5, 0.65]"
              :key="scale"
              @click="previewScale = scale"
              class="px-2.5 py-1 rounded-md transition-all font-medium"
              :class="previewScale === scale ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
            >
              {{ Math.round(scale * 100) }}%
            </button>
          </div>
        </div>
      </div>

      <!-- Canvas Center Container -->
      <div class="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar">
        <!-- Scale Wrapper -->
        <div
          class="transition-transform duration-200 origin-center select-none shrink-0"
          :style="{ transform: `scale(${previewScale})` }"
        >
          <!-- THE ACTUAL 1080x1350 EXPORTABLE CANVAS -->
          <div
            ref="canvasRef"
            id="export-canvas"
            class="relative w-[1080px] h-[1350px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden"
            :style="{
              backgroundColor: currentPal.bg,
              color: currentPal.text,
            }"
          >
            <!-- Background Decorative Texture / Radials -->
            <div
              class="absolute inset-0 pointer-events-none"
              :style="{
                backgroundImage: `
                  radial-gradient(circle at 10% 10%, ${currentPal.primary}18, transparent 45%),
                  radial-gradient(circle at 90% 90%, ${currentPal.accent}20, transparent 50%),
                  radial-gradient(circle at 50% 50%, ${currentPal.primary}08, transparent 60%)
                `,
              }"
            ></div>

            <!-- Outer Luxury Double Hairline Frame -->
            <div class="absolute inset-[36px] border border-amber-600/25 pointer-events-none"></div>
            <div class="absolute inset-[48px] border border-amber-600/15 pointer-events-none"></div>

            <!-- 1:1 Square Safe Zone Overlay (For Preview Verification only) -->
            <div
              v-if="showSafeZone"
              class="absolute inset-x-0 top-[135px] h-[1080px] border-2 border-dashed border-rose-500/60 pointer-events-none z-50 flex items-start justify-end p-4"
            >
              <span class="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                Area Potong Feed 1:1 (Profile Grid)
              </span>
            </div>

            <!-- CANVAS HEADER (TOP BAR) -->
            <div class="relative z-10 pt-16 px-16 flex items-center justify-between">
              <!-- Brand Identity Mark -->
              <div class="flex items-center gap-4">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  class="w-12 h-12 object-contain filter drop-shadow"
                  @error="(e) => (e.target.style.display = 'none')"
                />
                <div>
                  <span class="block font-serif text-2xl font-bold tracking-tight" :style="{ color: currentPal.primary }">
                    Satu Undangan
                  </span>
                  <span class="block text-xs uppercase tracking-[0.25em] font-semibold opacity-60">
                    satuundangan.id
                  </span>
                </div>
              </div>

              <!-- Category Badge & Slide Counter -->
              <div class="flex items-center gap-4">
                <div
                  v-if="postData.badge"
                  class="px-4 py-1.5 rounded-full text-sm font-extrabold uppercase tracking-widest border"
                  :style="{
                    backgroundColor: currentPal.accent + '22',
                    borderColor: currentPal.accent + '66',
                    color: currentPal.primary,
                  }"
                >
                  {{ postData.badge }}
                </div>
                <div
                  v-if="postData.slideIndex"
                  class="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider"
                  :style="{
                    backgroundColor: currentPal.text + '12',
                    color: currentPal.text,
                  }"
                >
                  {{ postData.slideIndex }} / {{ postData.totalSlides }}
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 1 - CAROUSEL COVER -->
            <div v-if="currentType === 'cover'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto">
              <!-- Golden Divider Motif -->
              <div class="flex items-center gap-3 mb-8 opacity-80">
                <span class="w-16 h-[2px]" :style="{ backgroundColor: currentPal.accent }"></span>
                <i class="pi pi-sparkles text-sm" :style="{ color: currentPal.accent }"></i>
                <span class="w-16 h-[2px]" :style="{ backgroundColor: currentPal.accent }"></span>
              </div>

              <!-- Main Headline -->
              <h1
                class="font-serif text-[68px] font-extrabold leading-[1.12] tracking-tight mb-8"
                :style="{ color: currentPal.primary }"
              >
                {{ postData.title }}
              </h1>

              <!-- Subtitle Copy -->
              <p
                v-if="postData.subtitle"
                class="text-[28px] font-light leading-[1.45] max-w-[850px] opacity-90"
              >
                {{ postData.subtitle }}
              </p>
            </div>

            <!-- CANVAS BODY: TYPE 2 - CAROUSEL BODY (CONTENT SLIDE) -->
            <div v-if="currentType === 'body'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto space-y-6">
              <h2
                class="font-serif text-[48px] font-bold leading-tight"
                :style="{ color: currentPal.primary }"
              >
                {{ postData.title }}
              </h2>

              <p v-if="postData.subtitle" class="text-[24px] opacity-80 leading-relaxed mb-4">
                {{ postData.subtitle }}
              </p>

              <!-- Points Stack -->
              <div class="space-y-4">
                <div
                  v-for="(point, i) in postData.points"
                  :key="i"
                  class="p-6 rounded-2xl border backdrop-blur-md flex items-start gap-5 shadow-lg transition-all"
                  :style="{
                    backgroundColor: currentPal.cardBg || currentPal.bg,
                    borderColor: currentPal.primary + '25',
                  }"
                >
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 text-white shadow-md"
                    :style="{ backgroundColor: currentPal.primary }"
                  >
                    0{{ i + 1 }}
                  </div>
                  <p class="text-[24px] font-medium leading-snug self-center" :style="{ color: currentPal.text }">
                    {{ point }}
                  </p>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 3 - SHOWCASE MOCKUP (SMARTPHONE) -->
            <div v-if="currentType === 'showcase'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto">
              <div class="text-center mb-6">
                <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-2" :style="{ color: currentPal.accent }">
                  Katalog Tema Pernikahan
                </span>
                <h2 class="font-serif text-[52px] font-black leading-tight" :style="{ color: currentPal.primary }">
                  {{ postData.title }}
                </h2>
                <p v-if="postData.subtitle" class="text-[22px] opacity-80 mt-2 max-w-[750px] mx-auto">
                  {{ postData.subtitle }}
                </p>
              </div>

              <!-- Smartphone Frame with Real Template Screenshot -->
              <div class="relative w-[340px] h-[640px] mx-auto rounded-[46px] border-[10px] border-slate-900 bg-slate-950 shadow-[0_30px_70px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col">
                <!-- Phone Notch / Dynamic Island -->
                <div class="w-32 h-5 bg-slate-900 rounded-b-2xl mx-auto z-30 shrink-0"></div>

                <!-- Template Screenshot -->
                <div class="w-full flex-1 overflow-hidden relative bg-stone-100 flex items-start justify-center">
                  <img
                    :src="`/assets/templates/${postData.templateSlug}.png`"
                    :alt="postData.templateSlug"
                    class="w-full object-cover object-top"
                    @error="(e) => (e.target.src = '/assets/templates/dark-elegant.png')"
                  />
                  <!-- Floating Price Badge -->
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

            <!-- CANVAS BODY: TYPE 4 - TWEET / RELATABLE QUOTE -->
            <div v-if="currentType === 'tweet'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto">
              <!-- Tweet Card Container -->
              <div
                class="p-12 rounded-[36px] border shadow-2xl backdrop-blur-md"
                :style="{
                  backgroundColor: currentPal.cardBg || '#ffffff',
                  borderColor: currentPal.primary + '25',
                }"
              >
                <!-- Author Header -->
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-5">
                    <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-md">
                      <img src="/apple-touch-icon.png" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-[32px] text-slate-900">{{ postData.tweetAuthor }}</span>
                        <i class="pi pi-verified text-xl text-sky-500"></i>
                      </div>
                      <span class="text-[20px] text-slate-500">@{{ postData.tweetHandle }}</span>
                    </div>
                  </div>
                  <i class="pi pi-twitter text-3xl text-sky-500/80"></i>
                </div>

                <!-- Tweet Text Content -->
                <p class="font-sans text-[36px] font-normal text-slate-800 leading-[1.4] mb-8">
                  {{ postData.title }}
                </p>

                <!-- Tweet Date / Stat Footer -->
                <div class="border-t border-slate-200/80 pt-6 flex items-center justify-between text-slate-500 text-[20px]">
                  <span>22:00 • 23 Okt 2026</span>
                  <div class="flex items-center gap-8 font-semibold">
                    <span><strong class="text-slate-800">{{ postData.tweetRetweets }}</strong> Retweets</span>
                    <span><strong class="text-slate-800">{{ postData.tweetLikes }}</strong> Likes</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 5 - WETON JODOH -->
            <div v-if="currentType === 'weton'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto text-center">
              <span class="text-sm uppercase font-bold tracking-[0.3em] opacity-70 block mb-2" :style="{ color: currentPal.accent }">
                Primbon Jawa Modern • Satu Undangan
              </span>
              <h2 class="font-serif text-[54px] font-black leading-tight mb-8" :style="{ color: currentPal.primary }">
                {{ postData.title }}
              </h2>

              <!-- Weton Calculator Box -->
              <div
                class="p-10 rounded-3xl border shadow-2xl max-w-[850px] mx-auto w-full"
                :style="{
                  backgroundColor: currentPal.cardBg || currentPal.bg,
                  borderColor: currentPal.accent + '44',
                }"
              >
                <div class="flex items-center justify-around mb-8">
                  <div class="text-center">
                    <span class="text-xs uppercase font-bold tracking-widest opacity-60 block">Weton Pria</span>
                    <span class="font-serif text-3xl font-bold mt-1 block" :style="{ color: currentPal.primary }">
                      {{ postData.wetonPria }}
                    </span>
                  </div>
                  <div class="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xl">
                    +
                  </div>
                  <div class="text-center">
                    <span class="text-xs uppercase font-bold tracking-widest opacity-60 block">Weton Wanita</span>
                    <span class="font-serif text-3xl font-bold mt-1 block" :style="{ color: currentPal.primary }">
                      {{ postData.wetonWanita }}
                    </span>
                  </div>
                </div>

                <!-- Result Pill -->
                <div class="py-3 px-6 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-500 font-serif text-3xl font-black mb-4">
                  Hasil: "{{ postData.wetonStatus }}"
                </div>

                <!-- Description -->
                <p class="text-[22px] leading-relaxed opacity-90">
                  {{ postData.wetonMakna }}
                </p>
              </div>
            </div>

            <!-- CANVAS BODY: TYPE 6 - PRICE LIST -->
            <div v-if="currentType === 'pricing'" class="relative z-10 px-20 flex-1 flex flex-col justify-center my-auto text-center">
              <h2 class="font-serif text-[52px] font-black leading-tight mb-3" :style="{ color: currentPal.primary }">
                {{ postData.title }}
              </h2>
              <p class="text-[22px] opacity-80 mb-8 max-w-[800px] mx-auto">
                {{ postData.subtitle }}
              </p>

              <!-- 3 Column Pricing Cards -->
              <div class="grid grid-cols-3 gap-5 text-left">
                <!-- Basic -->
                <div class="p-6 rounded-2xl border bg-white/90 text-slate-900 shadow-xl flex flex-col justify-between">
                  <div>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-widest block">Paket Basic</span>
                    <span class="text-3xl font-black text-slate-900 mt-1 block">Rp 49.000</span>
                    <ul class="mt-4 space-y-2 text-xs text-slate-600">
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-emerald-500"></i> Bebas Semua Tema</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-emerald-500"></i> Aktif 1 Tahun Penuh</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-emerald-500"></i> Tanpa Watermark</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-emerald-500"></i> Galeri 8 Foto</li>
                    </ul>
                  </div>
                  <span class="mt-6 text-[11px] font-bold text-center block text-slate-400">Cocok untuk Intimate</span>
                </div>

                <!-- Premium (Best Seller) -->
                <div class="p-6 rounded-2xl border-2 border-amber-500 bg-amber-50/90 text-slate-900 shadow-2xl flex flex-col justify-between relative transform -translate-y-2">
                  <span class="absolute -top-3.5 right-4 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow">
                    Best Seller
                  </span>
                  <div>
                    <span class="text-xs font-bold text-amber-700 uppercase tracking-widest block">Paket Premium</span>
                    <span class="text-3xl font-black text-amber-900 mt-1 block">Rp 79.000</span>
                    <ul class="mt-4 space-y-2 text-xs text-slate-700">
                      <li class="flex items-center gap-1.5 font-bold"><i class="pi pi-check text-emerald-600"></i> Galeri 20 Foto</li>
                      <li class="flex items-center gap-1.5 font-bold"><i class="pi pi-check text-emerald-600"></i> Upload Musik Sendiri</li>
                      <li class="flex items-center gap-1.5 font-bold"><i class="pi pi-check text-emerald-600"></i> Subdomain Kustom</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-emerald-600"></i> QR Code Buku Tamu</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-emerald-600"></i> Cerita Cinta (Timeline)</li>
                    </ul>
                  </div>
                  <span class="mt-6 text-[11px] font-bold text-center block text-amber-700">Paling Banyak Dipilih</span>
                </div>

                <!-- Eksklusif -->
                <div class="p-6 rounded-2xl border bg-slate-900 text-white shadow-xl flex flex-col justify-between">
                  <div>
                    <span class="text-xs font-bold text-amber-400 uppercase tracking-widest block">Paket Eksklusif</span>
                    <span class="text-3xl font-black text-white mt-1 block">Rp 99.000</span>
                    <ul class="mt-4 space-y-2 text-xs text-slate-300">
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-amber-400"></i> Galeri 35 Foto</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-amber-400"></i> Video Prewedding</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-amber-400"></i> Live Streaming Link</li>
                      <li class="flex items-center gap-1.5"><i class="pi pi-check text-amber-400"></i> Panduan Dress Code</li>
                    </ul>
                  </div>
                  <span class="mt-6 text-[11px] font-bold text-center block text-amber-300">Fitur Terlengkap</span>
                </div>
              </div>
            </div>

            <!-- CANVAS FOOTER (BOTTOM BAR) -->
            <div class="relative z-10 pb-16 px-16 flex items-center justify-between border-t border-slate-700/20 pt-8">
              <!-- Left: Handle & Follow CTA -->
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                  :style="{ backgroundColor: currentPal.primary, color: currentPal.bg }"
                >
                  <i class="pi pi-instagram"></i>
                </div>
                <span class="font-bold text-xl tracking-tight" :style="{ color: currentPal.text }">
                  @satuundangan_id
                </span>
              </div>

              <!-- Right: Swipe CTA or Website CTA -->
              <div class="flex items-center gap-3 font-semibold text-lg" :style="{ color: currentPal.primary }">
                <span>{{ postData.slideIndex < postData.totalSlides ? 'Geser Selanjutnya' : 'Kunjungi satuundangan.id' }}</span>
                <i :class="postData.slideIndex < postData.totalSlides ? 'pi pi-arrow-right' : 'pi pi-external-link'" class="text-base"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { toPng } from 'html-to-image'
import { useToast } from 'vue-toastification'

const toast = useToast()
const canvasRef = ref(null)
const isExporting = ref(false)
const showSafeZone = ref(false)
const previewScale = ref(0.5)

// Template Types
const TEMPLATE_TYPES = [
  { id: 'cover', name: 'Cover / Hook', icon: 'pi-bookmark' },
  { id: 'body', name: 'Slide Edukasi', icon: 'pi-list' },
  { id: 'showcase', name: 'Mockup Tema', icon: 'pi-mobile' },
  { id: 'tweet', name: 'Tweet / Quote', icon: 'pi-comment' },
  { id: 'weton', name: 'Weton Jodoh', icon: 'pi-heart' },
  { id: 'pricing', name: 'Price List', icon: 'pi-tag' },
]

const currentType = ref('cover')

// Color Palettes
const PALETTES = [
  {
    id: 'ivory',
    name: 'Ivory Classic (Brand)',
    bg: '#fffaf3',
    cardBg: '#ffffff',
    text: '#2f2f2f',
    primary: '#a47148',
    accent: '#c89f68',
  },
  {
    id: 'mocha',
    name: 'Mocha Warm',
    bg: '#a47148',
    cardBg: '#875630',
    text: '#fffaf3',
    primary: '#fffaf3',
    accent: '#facc15',
  },
  {
    id: 'sage',
    name: 'Sage Botanical',
    bg: '#f3f6f1',
    cardBg: '#ffffff',
    text: '#2f2f2f',
    primary: '#677d59',
    accent: '#a47148',
  },
  {
    id: 'dark',
    name: 'Dark Elegant',
    bg: '#141417',
    cardBg: '#1f1f24',
    text: '#f8fafc',
    primary: '#d4af37',
    accent: '#f59e0b',
  },
]

const currentPalette = ref('ivory')
const currentPal = computed(() => PALETTES.find((p) => p.id === currentPalette.value) || PALETTES[0])

// Template list from public/assets/templates
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
  { slug: 'editorial-magazine', name: 'The Editorial Story' },
  { slug: 'purrfect-match', name: 'Purrfect Match (Cat)' },
  { slug: 'royal-emerald', name: 'Royal Emerald' },
  { slug: 'retro-nostalgia', name: 'Retro Nostalgia' },
]

// Current Post Data
const postData = ref({
  badge: 'TIPS HEMAT NIKAH',
  title: 'Yakin Masih Mau Cetak 500 Undangan Kertas?',
  subtitle: 'Fakta di lapangan: 80% undangan kertas cuma dibaca 2 menit lalu berakhir di tempat sampah.',
  points: [
    'Biaya cetak 500 pcs x 6.000 = Rp 3.000.000',
    'Capek keliling bagi-bagi fisik & ongkir mahal',
    'Ganti pakai Satu Undangan cukup 79 ribu, hemat 2,9 juta!',
  ],
  templateSlug: 'meowly-married',
  wetonPria: 'Senin Pon (11)',
  wetonWanita: 'Jumat Kliwon (14)',
  wetonStatus: 'JODOH (Neptu 25)',
  wetonMakna: 'Rumah tangga diprediksi rukun, saling menerima kelebihan & kekurangan, dan langgeng hingga tua.',
  tweetAuthor: 'Satu Undangan',
  tweetHandle: 'satuundangan_id',
  tweetRetweets: '1,420',
  tweetLikes: '8,930',
  slideIndex: 1,
  totalSlides: 5,
})

function addPoint() {
  postData.value.points.push('Poin baru...')
}

function removePoint(idx) {
  postData.value.points.splice(idx, 1)
}

// 9-Grid Rescue Presets directly loaded from Playbook
const PLAYBOOK_PRESETS = [
  {
    id: 'post1',
    label: 'Post 1: Adat Nusantara',
    type: 'showcase',
    palette: 'ivory',
    badge: 'HERITAGE NUSANTARA',
    title: 'Menikah dengan Adat, Tetap Modern & Elegan',
    subtitle: 'Sentuhan ornamen sakral Minangkabau berpadu estetika smartphone modern.',
    templateSlug: 'minang-suntiang-emas',
    slideIndex: 1,
    totalSlides: 7,
  },
  {
    id: 'post2',
    label: 'Post 2: Kalkulasi Budget',
    type: 'cover',
    palette: 'ivory',
    badge: 'BONGKAR BUDGET',
    title: 'Cetak 500 Undangan Kertas Buat Dibuang ke Tong Sampah? 😭',
    subtitle: 'Bukan pelit, tapi smart budgeting! Yuk hitung perbandingan riilnya.',
    slideIndex: 1,
    totalSlides: 5,
  },
  {
    id: 'post3',
    label: 'Post 3: QR Code Tamu',
    type: 'body',
    palette: 'dark',
    badge: 'FITUR RESEPSI',
    title: 'Resepsi Bebas Drama Antre di Meja Buku Tamu',
    subtitle: 'Kenapa fitur QR Code Check-In Satu Undangan bikin tamu terkesan:',
    points: [
      'Tamu cukup tunjukkan QR di undangan HP',
      'Penerima tamu scan 1 detik, langsung tercatat',
      'Gak ada antrean panjang & pulpen macet di meja depan',
    ],
    slideIndex: 2,
    totalSlides: 4,
  },
  {
    id: 'post4',
    label: 'Post 4: Anabul Cat Lovers',
    type: 'showcase',
    palette: 'ivory',
    badge: 'SPECIAL NICHE 🐾',
    title: 'Undangan Nikah Khusus Anabul Parents Pertama di Indonesia!',
    subtitle: 'Animasi 3D clay telapak kucing pastel imut siap meriahkan hari bahagiamu.',
    templateSlug: 'meowly-married',
    slideIndex: 1,
    totalSlides: 5,
  },
  {
    id: 'post6',
    label: 'Post 6: Weton Jodoh',
    type: 'weton',
    palette: 'ivory',
    badge: 'PRIMBON JAWA MODERN',
    title: 'Kamu & Doi Masuk Kategori Apa?',
    wetonPria: 'Senin Wage (8)',
    wetonWanita: 'Minggu Legi (10)',
    wetonStatus: 'RATU (Neptu 18)',
    wetonMakna: 'Pasangan ini memang sudah jodohnya. Dihormati tetangga & keluarga, rezeki lancar berlimpah.',
    slideIndex: 1,
    totalSlides: 3,
  },
  {
    id: 'post8',
    label: 'Post 8: Checklist KUA',
    type: 'body',
    palette: 'sage',
    badge: 'PANDUAN KUA GRATIS',
    title: 'Checklist Berkas Nikah KUA Biar Gak Bolak-Balik!',
    subtitle: 'Persiapkan berkas ini minimal H-30 sebelum hari H:',
    points: [
      'Surat Pengantar RT/RW & Kelurahan (Model N1 - N4)',
      'Sertifikat Laik Nikah Puskesmas (Aplikasi ELSIMIL)',
      'Pas Foto 2x3 & 4x6 Background Biru',
      'Pendaftaran Online di SIMKAH Kemenag',
    ],
    slideIndex: 2,
    totalSlides: 7,
  },
  {
    id: 'post9',
    label: 'Post 9: Harga Transparan',
    type: 'pricing',
    palette: 'ivory',
    badge: 'HARGA TRANSPARAN',
    title: 'Fitur Sultan, Harga Teman.',
    subtitle: '100% Tanpa Watermark, Aktif 1 Tahun Penuh, Sekali Bayar!',
    slideIndex: 1,
    totalSlides: 3,
  },
  {
    id: 'post_tweet',
    label: 'Quote: Relatable Curhat',
    type: 'tweet',
    palette: 'ivory',
    badge: 'CURHAT MANTEN',
    title: 'Ternyata debat milih vendor katering & warna suvenir jauh lebih menguras emosi daripada skripsi 😭 Untung urusan undangan 5 menit kelar di satuundangan.id',
    tweetAuthor: 'Satu Undangan',
    tweetHandle: 'satuundangan_id',
    tweetRetweets: '2,890',
    tweetLikes: '14.2K',
    slideIndex: 1,
    totalSlides: 1,
  },
]

function applyPreset(preset) {
  currentType.value = preset.type
  currentPalette.value = preset.palette
  postData.value.badge = preset.badge
  postData.value.title = preset.title
  if (preset.subtitle) postData.value.subtitle = preset.subtitle
  if (preset.points) postData.value.points = [...preset.points]
  if (preset.templateSlug) postData.value.templateSlug = preset.templateSlug
  if (preset.wetonPria) postData.value.wetonPria = preset.wetonPria
  if (preset.wetonWanita) postData.value.wetonWanita = preset.wetonWanita
  if (preset.wetonStatus) postData.value.wetonStatus = preset.wetonStatus
  if (preset.wetonMakna) postData.value.wetonMakna = preset.wetonMakna
  if (preset.slideIndex) postData.value.slideIndex = preset.slideIndex
  if (preset.totalSlides) postData.value.totalSlides = preset.totalSlides

  toast.success(`Preset "${preset.label}" berhasil dimuat!`, { timeout: 2000 })
}

// Export High-Resolution PNG (1080x1350)
async function exportHighResPng() {
  if (!canvasRef.value) return
  isExporting.value = true

  try {
    // Hide safe zone temporarily during screenshot
    const oldSafeZone = showSafeZone.value
    showSafeZone.value = false

    // Wait next tick for DOM repaint
    await new Promise((r) => setTimeout(r, 100))

    const dataUrl = await toPng(canvasRef.value, {
      pixelRatio: 1.5, // Crisp 1620x2025 output
      quality: 0.98,
      cacheBust: true,
      skipFonts: false,
    })

    showSafeZone.value = oldSafeZone

    // Trigger download
    const link = document.createElement('a')
    const filename = `satuundangan-${currentType.value}-slide${postData.value.slideIndex || 1}-${Date.now()}.png`
    link.download = filename
    link.href = dataUrl
    link.click()

    toast.success('Gambar berhasil didownload! Siap posting di IG 🚀')
  } catch (err) {
    console.error('Export failed:', err)
    toast.error('Gagal mengekspor gambar: ' + (err.message || 'Error'))
  } finally {
    isExporting.value = false
  }
}

// Copy Instagram Caption & Hashtags
function copyInstagramCaption() {
  const caption = `${postData.value.title}\n\n${postData.value.subtitle || ''}\n\n✨ Bikin undangan pernikahan digital estetik & anti-ribet mulai 49rb di @satuundangan_id!\n\nFitur lengkap:\n✅ 30+ Pilihan Tema (Adat Nusantara, Luxury, Anime, Cat Lovers)\n✅ Bebas Watermark & Aktif 1 Tahun\n✅ Sebar WA Otomatis & QR Code Buku Tamu\n✅ Free Wedding Planner & Kalkulator Weton\n\n👉 Coba buat gratis sekarang: Klik link di bio @satuundangan_id\n\n.\n#undanganpernikahan #undangandigital #undanganonline #weddinginvitation #tipsnikah #persiapanpernikahan #nikahhemat #undanganpernikahandigital #satuundangan`

  navigator.clipboard.writeText(caption)
  toast.success('Caption & Hashtags berhasil disalin ke clipboard! 📋')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #090d16;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
