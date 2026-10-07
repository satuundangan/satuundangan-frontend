<template>
  <div class="min-h-screen bg-[#faf8f5] font-sans text-stone-800 antialiased selection:bg-[#a47148]/20 selection:text-[#a47148]">
    <Navbar />

    <!-- Not Found State -->
    <div
      v-if="!currentTheme"
      class="min-h-[70vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-6"
    >
      <div class="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4 shadow-inner">
        <i class="fa-solid fa-palette text-3xl"></i>
      </div>
      <h1 class="font-serif text-3xl font-bold text-stone-900 mb-2">Tema Tidak Ditemukan</h1>
      <p class="text-stone-600 text-sm max-w-md mb-8">
        Maaf, tema undangan yang Anda cari tidak tersedia. Silakan telusuri katalog tema budaya dan modern kami di bawah ini.
      </p>

      <div class="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
        <router-link
          v-for="t in allThemes"
          :key="t.slug"
          :to="`/tema/${t.slug}`"
          class="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-[#a47148] hover:shadow-md transition-all group"
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: t.colorAccent }"></span>
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-400 group-hover:text-[#a47148] transition-colors">
              {{ t.badge }}
            </span>
          </div>
          <h2 class="font-serif font-bold text-stone-900 text-base group-hover:text-[#a47148] transition-colors">
            {{ t.name }}
          </h2>
          <p class="text-stone-500 text-xs line-clamp-2 mt-1">
            {{ t.metaDescription }}
          </p>
        </router-link>
      </div>
    </div>

    <!-- Theme Landing Page Content -->
    <main v-else class="pt-24 md:pt-28">
      <!-- Breadcrumbs -->
      <div class="max-w-7xl mx-auto px-6 mb-6">
        <nav aria-label="Breadcrumb" class="flex items-center flex-wrap gap-2 text-xs text-stone-500">
          <router-link to="/" class="hover:text-[#a47148] transition-colors">Beranda</router-link>
          <span class="text-stone-300">/</span>
          <router-link to="/templates" class="hover:text-[#a47148] transition-colors">Katalog Tema</router-link>
          <span class="text-stone-300">/</span>
          <span class="text-stone-800 font-semibold truncate">{{ currentTheme.name }}</span>
        </nav>
      </div>

      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-4 pb-16 md:pb-24 border-b border-stone-200/60">
        <!-- Ambient decorative background aura -->
        <div
          class="absolute inset-0 pointer-events-none opacity-40 -z-10"
          :class="`bg-gradient-to-b ${currentTheme.gradientBg}`"
        ></div>

        <div class="max-w-5xl mx-auto px-6 text-center">
          <!-- Cultural Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-xs mb-6"
               :class="currentTheme.badgeBg">
            <i class="fa-solid fa-sparkles text-[10px]"></i>
            <span>{{ currentTheme.badge }}</span>
          </div>

          <!-- SEO H1 Target -->
          <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.18] tracking-tight mb-6">
            {{ currentTheme.h1 }}
          </h1>

          <!-- High Conversion Copy -->
          <p class="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8 font-light">
            {{ currentTheme.heroSubtitle }}
          </p>

          <!-- Selling Points / Highlights Pills -->
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-3xl mx-auto">
            <div
              v-for="(hl, i) in currentTheme.highlights"
              :key="i"
              class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs border border-stone-200/80 shadow-2xs text-xs font-medium text-stone-700"
            >
              <i :class="[hl.icon, 'text-[#a47148]']"></i>
              <span>{{ hl.title }}</span>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#template-gallery"
              class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#a47148] hover:bg-[#8b5e3c] text-white font-semibold text-sm transition-all shadow-md shadow-[#a47148]/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
              <span>Pilih Desain {{ currentTheme.name }}</span>
            </a>
            <router-link
              to="/wedding-planner"
              class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-calculator text-[#a47148] text-xs"></i>
              <span>Kalkulator Budget Gratis</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Curated Templates Gallery -->
      <section id="template-gallery" class="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="text-xs font-bold uppercase tracking-wider text-[#a47148]">Koleksi Pilihan</span>
          <h2 class="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-3">
            Template Undangan {{ currentTheme.name }}
          </h2>
          <p class="text-stone-600 text-xs sm:text-sm">
            Semua template telah dioptimalkan khusus untuk smartphone, kompatibel dengan sebar WhatsApp, dan siap digunakan langsung.
          </p>
        </div>

        <!-- Templates Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div
            v-for="tpl in displayedTemplates"
            :key="tpl.slug"
            class="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
          >
            <!-- Thumbnail & Actions -->
            <div class="relative aspect-[4/5] bg-stone-100 overflow-hidden">
              <img
                :src="getTemplateThumbnail(tpl)"
                :alt="`Template ${tpl.name} - SatuUndangan`"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                @error="(e) => onImgError(e)"
              />

              <!-- Overlay buttons on hover -->
              <div class="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs p-4">
                <a
                  :href="`/demo/${tpl.slug}`"
                  target="_blank"
                  rel="noopener"
                  class="px-4 py-2.5 rounded-full bg-white text-stone-900 font-semibold text-xs hover:bg-stone-100 shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-eye text-[11px] text-[#a47148]"></i>
                  <span>Lihat Demo</span>
                </a>
                <button
                  @click="goToCreate(tpl)"
                  class="px-4 py-2.5 rounded-full bg-[#a47148] text-white font-semibold text-xs hover:bg-[#8b5e3c] shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
                  <span>Pakai Tema</span>
                </button>
              </div>

              <!-- Badges -->
              <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span class="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-stone-900 text-[10px] font-bold shadow-xs">
                  {{ tpl.category || currentTheme.name }}
                </span>
                <span v-if="tpl.isPremium" class="px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                  Premium
                </span>
              </div>

              <!-- Top-right Quick Demo Icon -->
              <a
                :href="`/demo/${tpl.slug}`"
                target="_blank"
                rel="noopener"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-[#a47148] shadow-sm transition-colors"
                title="Buka Demo Layar Penuh"
              >
                <i class="fa-solid fa-up-right-from-square text-xs"></i>
              </a>
            </div>

            <!-- Card Body -->
            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 class="font-serif text-lg font-bold text-stone-900 group-hover:text-[#a47148] transition-colors leading-snug">
                    {{ tpl.name }}
                  </h3>
                  <p class="text-xs text-stone-500 mt-0.5">
                    {{ tpl.description || `Desain khas bernuansa ${currentTheme.name} yang anggun.` }}
                  </p>
                </div>
              </div>

              <div class="pt-4 mt-auto border-t border-stone-100 flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5 font-bold text-stone-900">
                  <span class="text-emerald-700 font-extrabold">{{ tpl.price > 0 ? formatPrice(tpl.price) : 'Gratis / Siap Pakai' }}</span>
                </div>
                <button
                  @click="goToCreate(tpl)"
                  class="font-semibold text-[#a47148] hover:text-[#8b5e3c] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Mulai Desain</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cultural Guide & Rundown Section -->
      <section v-if="currentTheme.traditionGuide" class="py-16 md:py-24 bg-white border-y border-stone-200/80">
        <div class="max-w-5xl mx-auto px-6">
          <div class="text-center max-w-3xl mx-auto mb-14">
            <span class="text-xs font-bold uppercase tracking-wider text-[#a47148]">Panduan Budaya & Tradisi</span>
            <h2 class="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-3">
              {{ currentTheme.traditionGuide.title }}
            </h2>
            <p class="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {{ currentTheme.traditionGuide.intro }}
            </p>
          </div>

          <!-- Timeline / Steps Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div
              v-for="st in currentTheme.traditionGuide.steps"
              :key="st.step"
              class="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 flex gap-4 hover:border-[#a47148]/60 transition-colors"
            >
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-white shrink-0 shadow-sm"
                :style="{ backgroundColor: currentTheme.colorAccent }"
              >
                {{ st.step }}
              </div>
              <div>
                <h3 class="font-serif text-lg font-bold text-stone-900 mb-1.5">
                  {{ st.name }}
                </h3>
                <p class="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {{ st.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Advice Cards: Music & Dress Code -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div class="p-6 rounded-2xl bg-[#faf8f5] border border-stone-200/80 flex items-start gap-3.5">
              <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-music text-sm"></i>
              </div>
              <div>
                <h4 class="font-serif text-sm font-bold text-stone-900 mb-1">Rekomendasi Musik Latar</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  {{ currentTheme.traditionGuide.musicRecommendations }}
                </p>
              </div>
            </div>

            <div class="p-6 rounded-2xl bg-[#faf8f5] border border-stone-200/80 flex items-start gap-3.5">
              <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-shirt text-sm"></i>
              </div>
              <div>
                <h4 class="font-serif text-sm font-bold text-stone-900 mb-1">Panduan Dress Code & Busana</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  {{ currentTheme.traditionGuide.dressCodeTip }}
                </p>
              </div>
            </div>
          </div>

          <!-- Sample Invitation Wording with Copy Button -->
          <div v-if="currentTheme.traditionGuide.wordingSample" class="rounded-2xl bg-stone-900 text-stone-100 p-6 sm:p-8 shadow-xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-800">
              <div>
                <span class="text-[11px] font-mono uppercase tracking-wider text-amber-400">Template Redaksi</span>
                <h3 class="font-serif text-lg font-bold text-white mt-0.5">
                  {{ currentTheme.traditionGuide.wordingSample.title }}
                </h3>
              </div>
              <button
                @click="copyWording"
                class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0 border border-white/10"
              >
                <i :class="copied ? 'fa-solid fa-check text-emerald-400' : 'fa-regular fa-copy'"></i>
                <span>{{ copied ? 'Teks Berhasil Disalin!' : 'Salin Teks Undangan' }}</span>
              </button>
            </div>
            <pre class="font-sans text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-wrap bg-stone-950/50 p-5 rounded-xl border border-stone-800/80 overflow-x-auto selection:bg-amber-400/30">{{ currentTheme.traditionGuide.wordingSample.content }}</pre>
          </div>
        </div>
      </section>

      <!-- FAQ Section with Schema.org FAQPage -->
      <section v-if="currentTheme.faqs && currentTheme.faqs.length" class="py-16 md:py-24 max-w-4xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="text-xs font-bold uppercase tracking-wider text-[#a47148]">Tanya Jawab</span>
          <h2 class="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-3">
            Pertanyaan Seputar Undangan {{ currentTheme.name }}
          </h2>
          <p class="text-stone-600 text-xs sm:text-sm">
            Jawaban lengkap seputar fitur, kustomisasi teks adat, dan penyebaran undangan digital.
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, idx) in currentTheme.faqs"
            :key="idx"
            class="bg-white rounded-2xl border border-stone-200/80 overflow-hidden transition-all shadow-2xs"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-stone-900 hover:text-[#a47148] transition-colors"
            >
              <span class="text-sm sm:text-base leading-snug">{{ faq.question }}</span>
              <i
                class="fa-solid fa-chevron-down text-xs text-stone-400 transition-transform duration-200 shrink-0"
                :class="{ 'rotate-180': openFaqIndex === idx }"
              ></i>
            </button>
            <div
              v-show="openFaqIndex === idx"
              class="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </section>

      <!-- Cross-Linking Hub: Explore Other Themes -->
      <section class="py-16 md:py-20 bg-stone-100/70 border-t border-stone-200/80">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center max-w-2xl mx-auto mb-10">
            <span class="text-xs font-bold uppercase tracking-wider text-[#a47148]">Jelajahi Konsep Lainnya</span>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Koleksi Tema Budaya & Konsep Populer
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            <router-link
              v-for="t in otherThemes"
              :key="t.slug"
              :to="`/tema/${t.slug}`"
              class="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-[#a47148] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-1.5 mb-2">
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: t.colorAccent }"></span>
                  <span class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider truncate">
                    {{ t.badge }}
                  </span>
                </div>
                <h3 class="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#a47148] transition-colors line-clamp-1">
                  {{ t.name }}
                </h3>
              </div>
              <div class="mt-3 text-[11px] font-semibold text-[#a47148] flex items-center gap-1">
                <span>Lihat Desain</span>
                <i class="fa-solid fa-angle-right text-[9px] group-hover:translate-x-0.5 transition-transform"></i>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Final Bottom Conversion Banner -->
      <section class="py-16 sm:py-20 bg-gradient-to-br from-stone-900 via-[#1c1917] to-stone-950 text-white text-center relative overflow-hidden">
        <div class="max-w-3xl mx-auto px-6 relative z-10">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">
            Mulai Hari Ini
          </span>
          <h2 class="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-snug">
            Siap Mengabadikan Momen Bahagiamu dengan Tema {{ currentTheme.name }}?
          </h2>
          <p class="text-stone-300 text-xs sm:text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Hanya butuh 5 menit untuk membuat undangan digital pernikahan impian. Dilengkapi amplop digital, RSVP instan, dan sebar WhatsApp.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              @click="goToCreate(displayedTemplates[0])"
              class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#c89f68] hover:bg-[#d8b07a] text-stone-950 font-bold text-sm transition-all shadow-lg shadow-[#c89f68]/20 hover:-translate-y-0.5"
            >
              Buat Undangan Sekarang →
            </button>
            <router-link
              to="/templates"
              class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Lihat Semua Desain
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import { THEME_SEO_DATA, getAllThemes, getThemeBySlug } from '@/utils/themeSeoData'
import { resolveTemplateThumbnail, normalizeTemplateKey } from '@/utils/templateRegistry'
import { getTemplateDesigns } from '@/api/templateDesign'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const allThemes = getAllThemes()
const currentTheme = computed(() => getThemeBySlug(route.params.slug))
const otherThemes = computed(() => allThemes.filter((t) => t.slug !== route.params.slug))

const apiTemplates = ref([])
const openFaqIndex = ref(0)
const copied = ref(false)

const toggleFaq = (idx) => {
  openFaqIndex.value = openFaqIndex.value === idx ? -1 : idx
}

// Fallback metadata for templates in case API is offline or returns incomplete list
const FALLBACK_TEMPLATE_META = {
  'jawa-truntum': { name: 'Jawa Truntum', category: 'Adat Jawa', price: 0, isPremium: false },
  'sunda-sabilulungan': { name: 'Sunda Sabilulungan', category: 'Adat Sunda', price: 0, isPremium: false },
  'minang-suntiang-emas': { name: 'Minang Suntiang Emas', category: 'Adat Minang', price: 49000, isPremium: true },
  'palembang-aesan-gede': { name: 'Palembang Aesan Gede', category: 'Adat Palembang', price: 49000, isPremium: true },
  'betawi-palang-pintu': { name: 'Betawi Palang Pintu', category: 'Adat Betawi', price: 0, isPremium: false },
  'bali-payas-agung': { name: 'Bali Payas Agung', category: 'Adat Bali', price: 49000, isPremium: true },
  'batak-ragi-hotang': { name: 'Batak Ragi Hotang', category: 'Adat Batak', price: 49000, isPremium: true },
  'bugis-saoraja': { name: 'Bugis Saoraja', category: 'Adat Bugis', price: 49000, isPremium: true },
  'dayak-ngaju-benang-bintik': { name: 'Dayak Benang Bintik', category: 'Adat Dayak', price: 0, isPremium: false },
  'islami-emas': { name: 'Islami Emas', category: 'Islami & Syar\'i', price: 0, isPremium: false },
  'moroccan-marrakech-gold': { name: 'Moroccan Marrakech', category: 'Islami & Syar\'i', price: 49000, isPremium: true },
  'light-modern': { name: 'Light Modern', category: 'Modern', price: 0, isPremium: false },
  'minimalist-terra': { name: 'Minimalist Terra', category: 'Modern', price: 0, isPremium: false },
  'editorial-magazine': { name: 'Editorial Magazine', category: 'Modern', price: 49000, isPremium: true },
  'old-money-monogram': { name: 'Old Money Monogram', category: 'Quiet Luxury', price: 79000, isPremium: true },
  'royal-emerald': { name: 'Royal Emerald', category: 'Quiet Luxury', price: 49000, isPremium: true },
  'royal-gold': { name: 'Royal Gold', category: 'Elegan', price: 0, isPremium: false },
  'dark-elegant': { name: 'Dark Elegant', category: 'Elegan', price: 0, isPremium: false },
  'modern-noir': { name: 'Modern Noir', category: 'Modern', price: 0, isPremium: false },
  'kimi-no-na-wa': { name: 'Kimi no Na wa', category: 'Anime', price: 49000, isPremium: true },
  'naruto': { name: 'Shinobi Romance', category: 'Anime', price: 49000, isPremium: true },
  'one-piece': { name: 'Grand Line Romance', category: 'Anime', price: 49000, isPremium: true },
  'pixel-quest': { name: 'Pixel Quest 8-Bit', category: 'Gaming', price: 0, isPremium: false },
  'botanical-watercolor': { name: 'Botanical Watercolor', category: 'Rustic', price: 0, isPremium: false },
  'sakura-blossom': { name: 'Sakura Blossom', category: 'Floral', price: 0, isPremium: false },
  'strawberry-matcha': { name: 'Strawberry Matcha', category: 'Aesthetic', price: 0, isPremium: false },
  'azure-shores': { name: 'Azure Shores', category: 'Pantai', price: 0, isPremium: false },
}

const displayedTemplates = computed(() => {
  if (!currentTheme.value) return []
  const curated = currentTheme.value.curatedTemplateSlugs || []

  return curated.map((slug) => {
    const fromApi = apiTemplates.value.find((t) => normalizeTemplateKey(t.slug) === slug)
    if (fromApi) return fromApi

    const meta = FALLBACK_TEMPLATE_META[slug] || {}
    return {
      slug,
      name: meta.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      category: meta.category || currentTheme.value.name,
      price: meta.price ?? 0,
      isPremium: meta.isPremium ?? false,
      thumbnailUrl: '',
    }
  })
})

const getTemplateThumbnail = (tpl) => {
  return resolveTemplateThumbnail(tpl) || 'https://via.placeholder.com/400x500?text=Desain+Undangan'
}

const onImgError = (e) => {
  e.target.onerror = null
  e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

const goToCreate = (item) => {
  if (item) {
    localStorage.setItem('selectedTemplate', JSON.stringify(item))
    localStorage.setItem('selectedPackage', item.isPremium ? 'premium' : 'free')
    localStorage.removeItem('selectedSections')
    localStorage.removeItem('finalPayload')
  }
  router.push('/create')
}

const copyWording = async () => {
  if (!currentTheme.value?.traditionGuide?.wordingSample?.content) return
  try {
    await navigator.clipboard.writeText(currentTheme.value.traditionGuide.wordingSample.content)
    copied.value = true
    toast.success('Teks undangan berhasil disalin!')
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch {
    toast.error('Gagal menyalin teks.')
  }
}

// Technical SEO: Dynamic Meta & Schema.org JSON-LD
const updateMeta = () => {
  const theme = currentTheme.value
  const origin = import.meta.env.VITE_FRONTEND_URL || 'https://www.satuundangan.id'

  if (!theme) {
    document.title = 'Katalog Tema Undangan Digital | SatuUndangan'
    return
  }

  const currentUrl = `${origin}/tema/${theme.slug}`
  document.title = theme.metaTitle

  const setMeta = (name, content, isProperty = false) => {
    if (!content) return
    const attr = isProperty ? 'property' : 'name'
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  const ogImage = `${origin}/og-image-v1.jpg`

  setMeta('description', theme.metaDescription)
  setMeta('keywords', (theme.keywords || []).join(', '))
  setMeta('og:title', theme.metaTitle, true)
  setMeta('og:description', theme.metaDescription, true)
  setMeta('og:image', ogImage, true)
  setMeta('og:url', currentUrl, true)
  setMeta('og:type', 'website', true)
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', theme.metaTitle)
  setMeta('twitter:description', theme.metaDescription)
  setMeta('twitter:image', ogImage)

  // Canonical tag
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', currentUrl)

  // Breadcrumbs Schema JSON-LD
  let breadcrumbScript = document.getElementById('theme-breadcrumb-schema')
  if (!breadcrumbScript) {
    breadcrumbScript = document.createElement('script')
    breadcrumbScript.id = 'theme-breadcrumb-schema'
    breadcrumbScript.type = 'application/ld+json'
    document.head.appendChild(breadcrumbScript)
  }
  breadcrumbScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: origin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Katalog Tema',
        item: `${origin}/templates`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: theme.name,
        item: currentUrl,
      },
    ],
  })

  // FAQPage Schema JSON-LD
  let faqScript = document.getElementById('theme-faq-schema')
  if (theme.faqs && theme.faqs.length) {
    if (!faqScript) {
      faqScript = document.createElement('script')
      faqScript.id = 'theme-faq-schema'
      faqScript.type = 'application/ld+json'
      document.head.appendChild(faqScript)
    }
    faqScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: theme.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    })
  } else if (faqScript) {
    faqScript.remove()
  }

  // WebApplication / Service Schema JSON-LD
  let serviceScript = document.getElementById('theme-service-schema')
  if (!serviceScript) {
    serviceScript = document.createElement('script')
    serviceScript.id = 'theme-service-schema'
    serviceScript.type = 'application/ld+json'
    document.head.appendChild(serviceScript)
  }
  serviceScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `SatuUndangan - ${theme.name}`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    url: currentUrl,
    description: theme.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    provider: {
      '@type': 'Organization',
      name: 'Satu Undangan',
      url: origin,
    },
  })
}

const cleanupSchemas = () => {
  const ids = ['theme-breadcrumb-schema', 'theme-faq-schema', 'theme-service-schema']
  ids.forEach((id) => {
    const el = document.getElementById(id)
    if (el) el.remove()
  })
}

onMounted(async () => {
  updateMeta()
  try {
    const res = await getTemplateDesigns()
    if (res) {
      apiTemplates.value = Array.isArray(res) ? res : res.data || []
    }
  } catch (err) {
    console.warn('Could not fetch templates from API, using curated local data:', err)
  }
})

onUnmounted(() => {
  cleanupSchemas()
})

watch(
  () => route.params.slug,
  () => {
    updateMeta()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>
