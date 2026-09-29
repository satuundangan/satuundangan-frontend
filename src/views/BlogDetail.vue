<template>
  <div class="min-h-screen bg-[#faf8f5] font-sans text-stone-800 antialiased selection:bg-[#a47148]/20 selection:text-[#a47148]">
    <!-- Reading Progress Bar (Fixed Top) -->
    <div class="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        class="h-full bg-gradient-to-r from-[#a47148] via-[#c89f68] to-[#8b7355] transition-[width] duration-100 ease-out shadow-xs"
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>

    <Navbar />

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center min-h-[70vh] pt-24">
      <div class="w-12 h-12 rounded-full border-3 border-stone-200 border-t-[#a47148] animate-spin mb-4"></div>
      <p class="text-stone-500 text-sm font-medium tracking-wide">Menyiapkan artikel...</p>
    </div>

    <!-- Error / Not Found State -->
    <div
      v-else-if="error || !article"
      class="min-h-[70vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-6"
    >
      <div class="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
        <i class="pi pi-file-excel text-3xl"></i>
      </div>
      <h1 class="font-serif text-3xl font-bold text-stone-900 mb-2">Artikel Tidak Ditemukan</h1>
      <p class="text-stone-600 text-sm max-w-md mb-6">
        Maaf, artikel yang Anda cari tidak tersedia atau mungkin tautannya sudah berubah.
      </p>
      <router-link
        to="/blog"
        class="px-6 py-2.5 bg-[#a47148] text-white rounded-full font-medium text-sm hover:bg-[#8b5e3c] transition-colors shadow-sm"
      >
        Kembali ke Indeks Blog
      </router-link>
    </div>

    <!-- Article Content View -->
    <article v-else class="pt-28 md:pt-32 pb-20">
      <!-- Breadcrumbs & Category Bar -->
      <div class="max-w-4xl mx-auto px-6 mb-6">
        <nav aria-label="Breadcrumb" class="flex items-center flex-wrap gap-2 text-xs text-stone-500">
          <router-link to="/" class="hover:text-[#a47148] transition-colors">Beranda</router-link>
          <span class="text-stone-300">/</span>
          <router-link to="/blog" class="hover:text-[#a47148] transition-colors">Blog</router-link>
          <span class="text-stone-300">/</span>
          <span class="text-stone-800 font-medium truncate max-w-[220px] sm:max-w-xs md:max-w-md">
            {{ article.title }}
          </span>
        </nav>
      </div>

      <!-- Article Header -->
      <header class="max-w-4xl mx-auto px-6 mb-10 text-center">
        <!-- Category & Date Badge -->
        <div class="inline-flex items-center gap-2 mb-5">
          <span class="px-3 py-1 rounded-full bg-[#a47148]/10 text-[#a47148] text-xs font-semibold tracking-wide">
            {{ getCategory(article) }}
          </span>
          <span class="text-stone-300">•</span>
          <span class="text-xs text-stone-500 flex items-center gap-1">
            <i class="pi pi-calendar text-[11px]"></i>
            {{ formatDate(article.publishedAt || article.createdAt) }}
          </span>
        </div>

        <!-- Big Serif Headline -->
        <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-[1.2] tracking-tight mb-6">
          {{ article.title }}
        </h1>

        <!-- Excerpt / Subheading if present -->
        <p v-if="article.excerpt" class="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
          {{ article.excerpt }}
        </p>

        <!-- Author Bar & Reading Time -->
        <div class="flex items-center justify-center gap-4 py-4 border-y border-stone-200/70 max-w-lg mx-auto">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#a47148]/15 border border-[#a47148]/30 flex items-center justify-center font-bold text-[#a47148] text-sm">
              SU
            </div>
            <div class="text-left">
              <p class="text-xs sm:text-sm font-semibold text-stone-900">Tim Editorial SatuUndangan</p>
              <p class="text-[11px] text-stone-500">Kurasi Jurnal Pernikahan</p>
            </div>
          </div>
          <div class="h-8 w-px bg-stone-200"></div>
          <div class="flex items-center gap-1.5 text-xs sm:text-sm text-[#a47148] font-medium">
            <i class="pi pi-clock text-xs"></i>
            <span>{{ getReadingTime(article) }}</span>
          </div>
        </div>
      </header>

      <!-- High-Res Cover Image -->
      <div class="max-w-5xl mx-auto px-6 mb-12">
        <div class="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-stone-100 shadow-xl border border-stone-200/80">
          <img
            :src="article.coverImage || article.ogImage || defaultCover"
            :alt="article.title"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Main Layout: Content + Sticky Sidebar -->
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <!-- Article Main Body (8 Cols on Desktop) -->
          <div class="lg:col-span-8 min-w-0">
            <!-- Mobile Collapsible Table of Contents -->
            <div
              v-if="tocItems.length > 0"
              class="lg:hidden mb-8 bg-white border border-stone-200 rounded-2xl p-5 shadow-xs"
            >
              <button
                @click="isMobileTocOpen = !isMobileTocOpen"
                class="w-full flex items-center justify-between text-left font-serif font-bold text-stone-900 text-base cursor-pointer"
                type="button"
              >
                <span class="flex items-center gap-2">
                  <i class="pi pi-list text-[#a47148]"></i>
                  Daftar Isi Artikel
                  <span class="text-xs font-normal text-stone-500">({{ tocItems.length }} bagian)</span>
                </span>
                <i
                  :class="[
                    'pi transition-transform duration-200 text-stone-400 text-xs',
                    isMobileTocOpen ? 'pi-chevron-up' : 'pi-chevron-down'
                  ]"
                ></i>
              </button>

              <div v-show="isMobileTocOpen" class="mt-4 pt-4 border-t border-stone-100 space-y-2">
                <a
                  v-for="item in tocItems"
                  :key="item.id"
                  :href="`#${item.id}`"
                  @click.prevent="scrollToHeading(item.id)"
                  :class="[
                    'block text-sm transition-colors py-1 cursor-pointer',
                    item.level === 3 ? 'pl-4 text-xs' : 'font-medium',
                    activeHeadingId === item.id ? 'text-[#a47148] font-semibold' : 'text-stone-600 hover:text-stone-900'
                  ]"
                >
                  {{ item.text }}
                </a>
              </div>
            </div>

            <!-- Social Share Bar (Top of body) -->
            <div class="flex items-center flex-wrap gap-2.5 pb-6 mb-8 border-b border-stone-200/80">
              <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider mr-1">Bagikan:</span>
              
              <!-- WhatsApp (Primary CTA) -->
              <button
                @click="share('whatsapp')"
                class="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                title="Bagikan via WhatsApp"
              >
                <i class="pi pi-whatsapp text-sm"></i>
                <span>WhatsApp</span>
              </button>

              <!-- Copy Link -->
              <button
                @click="share('copy')"
                class="px-3.5 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Salin Tautan Artikel"
              >
                <i class="pi pi-link text-xs"></i>
                <span>Salin Tautan</span>
              </button>

              <!-- Twitter / X -->
              <button
                @click="share('twitter')"
                class="w-9 h-9 rounded-full bg-white hover:bg-stone-900 hover:text-white text-stone-700 border border-stone-200 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                title="Bagikan ke X / Twitter"
              >
                <i class="pi pi-twitter text-xs"></i>
              </button>

              <!-- Facebook -->
              <button
                @click="share('facebook')"
                class="w-9 h-9 rounded-full bg-white hover:bg-[#1877F2] hover:text-white text-stone-700 border border-stone-200 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                title="Bagikan ke Facebook"
              >
                <i class="pi pi-facebook text-xs"></i>
              </button>
            </div>

            <!-- Article HTML Content -->
            <div
              ref="articleContentRef"
              class="article-content prose prose-stone lg:prose-lg max-w-none"
              v-html="processedContent"
            ></div>

            <!-- In-Article Conversion CTA Banner -->
            <div class="my-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#f8f3ed] via-[#fffdf9] to-[#f4ebe1] border border-[#c89f68]/40 shadow-sm relative overflow-hidden">
              <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-[#c89f68]/15 rounded-full blur-2xl pointer-events-none"></div>

              <div class="relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                <div class="space-y-2">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a47148]/10 text-[#a47148] text-xs font-semibold">
                    <i class="pi pi-sparkles text-[10px]"></i>
                    <span>Satu Undangan Digital</span>
                  </div>
                  <h3 class="font-serif text-2xl font-bold text-stone-900 leading-snug">
                    Rencanakan Undangan Pernikahan Impianmu Tanpa Repot
                  </h3>
                  <p class="text-stone-600 text-sm max-w-lg leading-relaxed">
                    Coba gratis ratusan template eksklusif SatuUndangan. Jadi dalam 5 menit, bebas revisi sepuasnya.
                  </p>
                </div>
                <a
                  href="/#templates"
                  class="shrink-0 px-6 py-3.5 rounded-full bg-[#a47148] hover:bg-[#8b5e3c] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Pilih Desain Undangan</span>
                  <i class="pi pi-arrow-right text-xs"></i>
                </a>
              </div>
            </div>

            <!-- Social Share Actions Footer -->
            <div class="py-6 border-t border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Suka artikel ini? Bagikan ke teman & pasangan:
              </span>
              <div class="flex items-center gap-2">
                <button
                  @click="share('whatsapp')"
                  class="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <i class="pi pi-whatsapp text-sm"></i>
                  <span>WhatsApp</span>
                </button>
                <button
                  @click="share('copy')"
                  class="px-3.5 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <i class="pi pi-link text-xs"></i>
                  <span>Salin Tautan</span>
                </button>
              </div>
            </div>

            <!-- Author Bio Card -->
            <div class="mt-10 p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div class="w-16 h-16 rounded-2xl bg-[#a47148]/15 border border-[#a47148]/30 text-[#a47148] flex items-center justify-center font-bold text-xl shrink-0">
                SU
              </div>
              <div class="text-center sm:text-left space-y-2">
                <div class="flex items-center justify-center sm:justify-start gap-2">
                  <h4 class="font-serif text-lg font-bold text-stone-900">Tim Editorial SatuUndangan</h4>
                  <span class="px-2 py-0.5 rounded-full bg-[#a47148]/10 text-[#a47148] text-[10px] font-semibold">Editorial</span>
                </div>
                <p class="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Ditulis oleh Tim Editorial SatuUndangan — Kurasi panduan, konsep, dan tren pernikahan digital terkini di Indonesia. Kami berdedikasi membantu calon pengantin menciptakan momen sakral yang berkesan dan praktis.
                </p>
                <div class="pt-2">
                  <router-link to="/blog" class="text-xs font-semibold text-[#a47148] hover:underline inline-flex items-center gap-1">
                    Jelajahi artikel lainnya
                    <i class="pi pi-arrow-right text-[10px]"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Sidebar (4 Cols on Desktop) -->
          <aside class="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <!-- Table of Contents Widget -->
            <div v-if="tocItems.length > 0" class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
              <div class="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
                <i class="pi pi-list text-[#a47148] text-sm"></i>
                <h3 class="font-serif text-base font-bold text-stone-900">Daftar Isi</h3>
              </div>

              <nav class="space-y-1 max-h-[50vh] overflow-y-auto pr-1 text-xs">
                <a
                  v-for="item in tocItems"
                  :key="item.id"
                  :href="`#${item.id}`"
                  @click.prevent="scrollToHeading(item.id)"
                  :class="[
                    'block py-1.5 transition-all border-l-2 cursor-pointer leading-snug',
                    item.level === 3 ? 'pl-5 text-[11px]' : 'pl-3 font-medium',
                    activeHeadingId === item.id
                      ? 'border-[#a47148] text-[#a47148] font-bold bg-[#a47148]/5 rounded-r-md'
                      : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                  ]"
                >
                  {{ item.text }}
                </a>
              </nav>
            </div>

            <!-- Quick Share Widget -->
            <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
              <h4 class="font-serif text-sm font-bold text-stone-900 mb-3">Bagikan Artikel</h4>
              <div class="flex flex-col gap-2">
                <button
                  @click="share('whatsapp')"
                  class="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <i class="pi pi-whatsapp"></i>
                  <span>Bagikan ke WhatsApp</span>
                </button>
                <div class="grid grid-cols-3 gap-2 pt-1">
                  <button
                    @click="share('copy')"
                    class="py-2 px-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Salin Tautan"
                  >
                    <i class="pi pi-link text-xs"></i>
                    <span>Salin</span>
                  </button>
                  <button
                    @click="share('twitter')"
                    class="py-2 px-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Twitter / X"
                  >
                    <i class="pi pi-twitter text-xs"></i>
                    <span>X</span>
                  </button>
                  <button
                    @click="share('facebook')"
                    class="py-2 px-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Facebook"
                  >
                    <i class="pi pi-facebook text-xs"></i>
                    <span>FB</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Sidebar Promo Card -->
            <div class="bg-gradient-to-br from-[#2c221a] to-[#3a2f26] rounded-3xl p-6 text-white text-center border border-[#c89f68]/30 shadow-md">
              <span class="inline-block p-2.5 rounded-full bg-[#c89f68]/20 text-[#e9cca4] mb-3">
                <i class="pi pi-sparkles text-lg"></i>
              </span>
              <h4 class="font-serif text-lg font-bold mb-2">Buat Undangan Sekarang</h4>
              <p class="text-stone-300 text-xs mb-5 leading-relaxed">
                Desain responsif, fitur amplop digital, RSVP instan & buku tamu QR code.
              </p>
              <a
                href="/#templates"
                class="block w-full py-2.5 px-4 rounded-full bg-[#c89f68] hover:bg-[#d8b07a] text-stone-900 font-semibold text-xs transition-colors cursor-pointer"
              >
                Lihat Katalog Template →
              </a>
            </div>
          </aside>
        </div>
      </div>

      <!-- Related Articles Section -->
      <section v-if="relatedArticles.length > 0" class="max-w-7xl mx-auto px-6 mt-20 pt-16 border-t border-stone-200">
        <div class="mb-10 text-center">
          <span class="text-xs font-semibold uppercase tracking-wider text-[#a47148]">Rekomendasi Bacaan</span>
          <h2 class="font-serif text-3xl font-bold text-stone-900 mt-1">Artikel Terkait Lainnya</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="rel in relatedArticles"
            :key="rel.id || rel.slug"
            class="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <router-link :to="`/blog/${rel.slug}`" class="flex flex-col h-full">
              <div class="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                <img
                  :src="rel.coverImage || rel.ogImage || defaultCover"
                  :alt="rel.title"
                  class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-800 text-[11px] font-semibold shadow-xs">
                    {{ getCategory(rel) }}
                  </span>
                </div>
              </div>

              <div class="p-6 flex flex-col flex-1">
                <div class="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span>{{ formatDate(rel.publishedAt || rel.createdAt) }}</span>
                  <span>•</span>
                  <span class="text-[#a47148] font-medium">{{ getReadingTime(rel) }}</span>
                </div>
                <h3 class="font-serif text-lg font-bold text-stone-900 group-hover:text-[#a47148] transition-colors line-clamp-2 mb-2 leading-snug">
                  {{ rel.title }}
                </h3>
                <p class="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                  {{ rel.excerpt || stripHtml(rel.content).substring(0, 120) + '...' }}
                </p>
                <div class="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#a47148] mt-auto">
                  <span>Baca Selengkapnya</span>
                  <i class="pi pi-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </router-link>
          </article>
        </div>
      </section>
    </article>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import { fetchArticleBySlug, fetchArticles } from '@/api/article'

const route = useRoute()
const toast = useToast()

const article = ref(null)
const relatedArticles = ref([])
const loading = ref(true)
const error = ref(false)

const scrollProgress = ref(0)
const tocItems = ref([])
const activeHeadingId = ref('')
const isMobileTocOpen = ref(false)
const articleContentRef = ref(null)

const defaultCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'

// Smart Category derivation
const getCategory = (art) => {
  if (!art) return 'Panduan & Tips'
  if (art.category) return art.category
  const text = `${art.title || ''} ${art.excerpt || ''} ${art.focusKeyword || ''}`.toLowerCase()
  if (/adat|jawa|sunda|bali|batak|minang|tradisi|konsep|tema|modern|rustic|vintage/.test(text)) return 'Konsep & Adat'
  if (/susunan|rundown|akad|resepsi|acara|jadwal|tata urutan|mc/.test(text)) return 'Susunan Acara'
  if (/doa|ayat|mutiara|kutipan|quote|kata|ucapan|ar-rum|berkah|islami/.test(text)) return 'Kata Mutiara & Doa'
  if (/budget|biaya|katering|catering|hemat|anggaran|vendor|souvenir|harga/.test(text)) return 'Budget & Katering'
  return 'Panduan & Tips'
}

// Reading time calculation
const getReadingTime = (art) => {
  if (!art) return '3 min baca'
  const content = art.content || art.excerpt || art.title || ''
  const cleanText = content.replace(/<[^>]*>/g, ' ').trim()
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0
  const minutes = Math.max(1, Math.ceil(wordCount / 180))
  return `${minutes} min baca`
}

// Parses H2 and H3 headings and injects IDs so anchor links work
const processedContent = computed(() => {
  if (!article.value || !article.value.content) return ''
  const rawHtml = article.value.content
  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHtml, 'text/html')
  const headings = doc.querySelectorAll('h2, h3')
  const items = []

  headings.forEach((heading, idx) => {
    const text = heading.textContent.trim()
    if (!text) return
    const cleanSlug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
    const id = heading.id || `section-${idx + 1}-${cleanSlug.substring(0, 30)}`
    heading.id = id

    items.push({
      id,
      text,
      level: heading.tagName.toLowerCase() === 'h3' ? 3 : 2
    })
  })

  // Synchronize TOC items
  tocItems.value = items
  return doc.body.innerHTML
})

const scrollToHeading = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -96 // header offset
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
    activeHeadingId.value = id
    isMobileTocOpen.value = false
  }
}

// Window scroll listener for reading progress bar and active TOC heading
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    scrollProgress.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  } else {
    scrollProgress.value = 0
  }

  if (tocItems.value.length === 0) return
  const scrollPosition = scrollTop + 130
  const headingElements = tocItems.value
    .map((item) => document.getElementById(item.id))
    .filter(Boolean)

  for (let i = headingElements.length - 1; i >= 0; i--) {
    if (headingElements[i].offsetTop <= scrollPosition) {
      activeHeadingId.value = headingElements[i].id
      return
    }
  }
  if (headingElements.length > 0 && !activeHeadingId.value) {
    activeHeadingId.value = headingElements[0].id
  }
}

const loadArticle = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await fetchArticleBySlug(route.params.slug)
    article.value = res
    updateMeta()
    loadRelatedArticles()
  } catch (err) {
    console.error('Failed to load article:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const loadRelatedArticles = async () => {
  try {
    const res = await fetchArticles({ limit: 6 })
    const all = res.items || res.data || []
    relatedArticles.value = all
      .filter((a) => a.slug !== route.params.slug)
      .slice(0, 3)
  } catch (err) {
    console.error('Failed to load related articles:', err)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const stripHtml = (html) => {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

const share = async (platform) => {
  const url = window.location.href
  const title = article.value?.title || 'Artikel Satu Undangan'
  const shareText = `${title}\n\nBaca artikel selengkapnya di Satu Undangan:`

  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`, '_blank')
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
  } else if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  } else if (platform === 'copy') {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Tautan artikel berhasil disalin ke clipboard!')
    } catch {
      toast.error('Gagal menyalin tautan.')
    }
  }
}

const updateMeta = () => {
  if (!article.value) return

  const siteUrl = import.meta.env.VITE_FRONTEND_URL || 'https://www.satuundangan.id'
  const currentUrl = `${siteUrl}/blog/${article.value.slug}`

  document.title = article.value.metaTitle || `${article.value.title} - Satu Undangan`

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

  setMeta('description', article.value.metaDescription || article.value.excerpt)
  setMeta('og:title', article.value.metaTitle || article.value.title, true)
  setMeta('og:description', article.value.metaDescription || article.value.excerpt, true)
  setMeta('og:image', article.value.ogImage || article.value.coverImage, true)
  setMeta('og:url', currentUrl, true)
  setMeta('og:type', 'article', true)
  setMeta('twitter:card', 'summary_large_image')

  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', article.value.canonicalUrl || currentUrl)
}

onMounted(() => {
  loadArticle()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(
  () => route.params.slug,
  () => {
    if (route.name === 'blog-detail') {
      loadArticle()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
)
</script>

<style>
/* Luxury Editorial Typography for article content */
.article-content {
  color: #292524;
  font-size: 1.125rem;
  line-height: 1.85;
}

.article-content h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1c1917;
  margin-top: 3rem;
  margin-bottom: 1.25rem;
  line-height: 1.3;
  scroll-margin-top: 100px;
}

.article-content h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #292524;
  margin-top: 2.25rem;
  margin-bottom: 1rem;
  line-height: 1.35;
  scroll-margin-top: 100px;
}

.article-content h4 {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #44403c;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}

.article-content p {
  margin-bottom: 1.5rem;
  color: #44403c;
}

.article-content a {
  color: #a47148;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 500;
  transition: color 0.2s;
}

.article-content a:hover {
  color: #8b5e3c;
}

.article-content ul {
  list-style-type: disc;
  padding-left: 1.75rem;
  margin-bottom: 1.5rem;
  color: #44403c;
}

.article-content ol {
  list-style-type: decimal;
  padding-left: 1.75rem;
  margin-bottom: 1.5rem;
  color: #44403c;
}

.article-content li {
  margin-bottom: 0.625rem;
  padding-left: 0.25rem;
}

.article-content blockquote {
  border-left: 4px solid #a47148;
  padding: 1.25rem 1.5rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 1.2rem;
  line-height: 1.7;
  color: #292524;
  background-color: #fbf9f6;
  border-radius: 0 1rem 1rem 0;
  margin: 2.25rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.article-content pre {
  background-color: #1c1917;
  color: #f5f5f4;
  padding: 1.25rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  margin: 1.75rem 0;
}

.article-content code {
  background-color: #f5f5f4;
  color: #b91c1c;
  padding: 0.2rem 0.4rem;
  border-radius: 0.35rem;
  font-size: 0.875em;
  font-family: monospace;
}

.article-content pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  margin: 2.5rem auto;
  display: block;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.article-content hr {
  border: 0;
  border-top: 1px solid #e7e5e4;
  margin: 3rem 0;
}
</style>
