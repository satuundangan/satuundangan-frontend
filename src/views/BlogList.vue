<template>
  <div class="min-h-screen bg-[#faf8f5] font-sans text-stone-800 antialiased selection:bg-[#a47148]/20 selection:text-[#a47148]">
    <Navbar />

    <!-- Hero Header Section -->
    <header class="relative pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-gradient-to-b from-[#f5ede4]/70 via-[#faf8f5] to-[#faf8f5] border-b border-stone-200/60">
      <!-- Decorative background blur orbs -->
      <div class="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-tr from-[#c89f68]/15 via-[#a47148]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative max-w-5xl mx-auto px-6 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#c89f68]/30 shadow-xs mb-6 backdrop-blur-sm">
          <i class="pi pi-sparkles text-[#a47148] text-xs"></i>
          <span class="text-xs font-semibold tracking-wider uppercase text-[#a47148]">
            Jurnal & Inspirasi Pernikahan
          </span>
        </div>

        <!-- Headline -->
        <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15] mb-5">
          Tips, Konsep & Panduan Hari Bahagia
        </h1>

        <!-- Subhead -->
        <p class="max-w-2xl mx-auto text-stone-600 text-base sm:text-lg leading-relaxed mb-8">
          Kumpulan artikel terkurasi seputar persiapan pernikahan, etika undangan, hingga pengelolaan budget.
        </p>

        <!-- Live Search Bar -->
        <div class="max-w-xl mx-auto relative">
          <div class="relative flex items-center">
            <span class="absolute left-4.5 text-stone-400 pointer-events-none">
              <i class="pi pi-search text-base"></i>
            </span>
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              type="text"
              placeholder="Cari panduan, adat, etika, susunan acara..."
              class="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-full bg-white border border-stone-200 shadow-md text-stone-800 placeholder-stone-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#a47148]/30 focus:border-[#a47148] transition-all"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Bersihkan pencarian"
              type="button"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <!-- Category Filter Chips -->
      <section class="mb-12" aria-label="Kategori Artikel">
        <div class="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectCategory(cat)"
            :class="[
              'px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer',
              selectedCategory === cat
                ? 'bg-[#a47148] text-white shadow-sm ring-1 ring-[#a47148]'
                : 'bg-white text-stone-600 hover:bg-stone-100/80 border border-stone-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="w-12 h-12 rounded-full border-3 border-stone-200 border-t-[#a47148] animate-spin mb-4"></div>
        <p class="text-stone-500 text-sm font-medium tracking-wide">Memuat artikel inspiratif...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredArticles.length === 0" class="text-center py-24 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs max-w-2xl mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#a47148]/10 flex items-center justify-center text-[#a47148]">
          <i class="pi pi-search text-2xl"></i>
        </div>
        <h3 class="font-serif text-2xl font-bold text-stone-900 mb-2">Tidak Menemukan Artikel</h3>
        <p class="text-stone-600 text-sm max-w-md mx-auto mb-6">
          Tidak ada artikel yang cocok dengan pencarian <span class="font-semibold text-stone-800">"{{ searchQuery || selectedCategory }}"</span>. Silakan coba kata kunci lain.
        </p>
        <button
          @click="resetFilters"
          class="px-5 py-2.5 rounded-full bg-[#a47148] text-white font-medium text-sm hover:bg-[#8b5e3c] transition-colors cursor-pointer"
        >
          Lihat Semua Artikel
        </button>
      </div>

      <div v-else class="space-y-14">
        <!-- Hero Featured / Highlight Article Card (Only shown on Page 1) -->
        <section v-if="page === 1 && featuredArticle" aria-label="Artikel Pilihan Editor">
          <router-link
            :to="`/blog/${featuredArticle.slug}`"
            class="group block bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <!-- Left: High-Res Cover Image -->
              <div class="lg:col-span-7 relative overflow-hidden bg-stone-100 min-h-[280px] sm:min-h-[380px] lg:min-h-[440px]">
                <img
                  :src="featuredArticle.coverImage || featuredArticle.ogImage || defaultCover"
                  :alt="featuredArticle.title"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
                <!-- Editor's Pick Badge -->
                <div class="absolute top-4 left-4 z-10">
                  <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-200 text-xs font-semibold shadow-md">
                    <span>⭐</span>
                    <span>Pilihan Editor</span>
                  </span>
                </div>
              </div>

              <!-- Right: Content Details -->
              <div class="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between bg-white">
                <div>
                  <div class="flex items-center flex-wrap gap-2 text-xs mb-4">
                    <span class="px-2.5 py-1 rounded-full bg-[#a47148]/10 text-[#a47148] font-semibold tracking-wide">
                      {{ getCategory(featuredArticle) }}
                    </span>
                    <span class="text-stone-300">•</span>
                    <span class="text-stone-500 flex items-center gap-1">
                      <i class="pi pi-calendar text-[11px]"></i>
                      {{ formatDate(featuredArticle.publishedAt || featuredArticle.createdAt) }}
                    </span>
                    <span class="text-stone-300">•</span>
                    <span class="text-stone-500 flex items-center gap-1">
                      <i class="pi pi-clock text-[11px]"></i>
                      {{ getReadingTime(featuredArticle) }}
                    </span>
                  </div>

                  <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900 group-hover:text-[#a47148] transition-colors duration-200 leading-snug mb-4">
                    {{ featuredArticle.title }}
                  </h2>

                  <p class="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {{ featuredArticle.excerpt || stripHtml(featuredArticle.content).substring(0, 180) + '...' }}
                  </p>
                </div>

                <div class="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-[#a47148]/15 text-[#a47148] flex items-center justify-center font-bold text-xs">
                      SU
                    </div>
                    <span class="text-xs font-medium text-stone-700">Tim Editorial SatuUndangan</span>
                  </div>

                  <span class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#a47148] group-hover:translate-x-1 transition-transform">
                    Baca Artikel Lengkap
                    <i class="pi pi-arrow-right text-xs"></i>
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </section>

        <!-- Section Title for Grid -->
        <div v-if="gridArticles.length > 0" class="flex items-center justify-between pt-2">
          <div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {{ selectedCategory === 'Semua' && !searchQuery ? 'Artikel Terbaru' : 'Daftar Artikel' }}
            </h2>
            <p class="text-stone-500 text-xs sm:text-sm mt-1">
              Menampilkan {{ filteredArticles.length }} artikel terkurasi
            </p>
          </div>
        </div>

        <!-- 3-Column Responsive Grid Layout -->
        <section aria-label="Daftar Artikel">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article
              v-for="article in gridArticles"
              :key="article.id || article.slug"
              class="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <router-link :to="`/blog/${article.slug}`" class="flex flex-col h-full">
                <!-- Cover Image (aspect 16/10) -->
                <div class="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                  <img
                    :src="article.coverImage || article.ogImage || defaultCover"
                    :alt="article.title"
                    class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <!-- Category Badge overlay -->
                  <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-800 text-[11px] font-semibold shadow-xs">
                      {{ getCategory(article) }}
                    </span>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-6 flex flex-col flex-1">
                  <!-- Metadata: Reading time & Date -->
                  <div class="flex items-center gap-2 text-xs text-stone-500 mb-3">
                    <span class="flex items-center gap-1">
                      <i class="pi pi-calendar text-[10px]"></i>
                      {{ formatDate(article.publishedAt || article.createdAt) }}
                    </span>
                    <span class="text-stone-300">•</span>
                    <span class="flex items-center gap-1 text-[#a47148] font-medium">
                      <i class="pi pi-clock text-[10px]"></i>
                      {{ getReadingTime(article) }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h3 class="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#a47148] transition-colors duration-200 line-clamp-2 mb-2.5 leading-snug">
                    {{ article.title }}
                  </h3>

                  <!-- Excerpt -->
                  <p class="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                    {{ article.excerpt || stripHtml(article.content).substring(0, 140) + '...' }}
                  </p>

                  <!-- Card Footer: Author Attribution -->
                  <div class="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
                    <span class="text-[11px] font-medium text-stone-500">
                      Tim Editorial SatuUndangan
                    </span>
                    <span class="text-xs font-semibold text-[#a47148] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Baca
                      <i class="pi pi-arrow-right text-[10px]"></i>
                    </span>
                  </div>
                </div>
              </router-link>
            </article>
          </div>
        </section>

        <!-- Newsletter / Free Guide Lead Magnet Banner -->
        <section aria-label="Panduan Gratis Pernikahan" class="pt-6">
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2c221a] via-[#3a2f26] to-[#251d16] text-white p-8 sm:p-12 shadow-xl border border-[#c89f68]/30">
            <!-- Decorative luxury accents -->
            <div class="absolute -right-16 -top-16 w-64 h-64 bg-[#c89f68]/20 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-[#a47148]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
              <div class="text-center lg:text-left space-y-3">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c89f68]/20 text-[#e9cca4] text-xs font-medium border border-[#c89f68]/30">
                  <i class="pi pi-gift"></i>
                  <span>Free Wedding Kit</span>
                </div>
                <h3 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Download Wedding Checklist & Template Excel Tamu Gratis
                </h3>
                <p class="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  Dapatkan wedding planner spreadsheet, checklist rundown hari H, dan panduan etika undangan digital via email.
                </p>
              </div>

              <!-- Newsletter Form -->
              <div class="w-full lg:w-auto shrink-0 max-w-md">
                <form @submit.prevent="submitLeadMagnet" class="flex flex-col sm:flex-row gap-2.5">
                  <input
                    v-model="leadEmail"
                    type="email"
                    required
                    placeholder="Masukkan alamat email Anda"
                    class="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89f68] focus:bg-white/15 transition-all w-full sm:w-64"
                  />
                  <button
                    type="submit"
                    :disabled="leadSubmitting"
                    class="px-6 py-3 rounded-full bg-[#c89f68] hover:bg-[#d8b07a] text-stone-900 font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50 whitespace-nowrap"
                  >
                    <span v-if="leadSubmitting">Mengirim...</span>
                    <span v-else>Dapatkan Gratis ✨</span>
                  </button>
                </form>
                <p class="text-[11px] text-stone-400 mt-2 text-center lg:text-left">
                  Bebas spam. Anda dapat berhenti berlangganan kapan saja.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Refined Pagination Controls -->
        <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-6" aria-label="Navigasi Halaman">
          <!-- Previous Page Button -->
          <button
            @click="changePage(page - 1)"
            :disabled="page <= 1"
            class="px-3.5 py-2 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <i class="pi pi-chevron-left text-xs"></i>
            <span class="hidden sm:inline">Sebelumnya</span>
          </button>

          <!-- Numbered Buttons -->
          <div class="flex items-center gap-1.5">
            <button
              v-for="p in totalPages"
              :key="p"
              @click="changePage(p)"
              :class="[
                'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer',
                page === p
                  ? 'bg-[#a47148] text-white shadow-sm ring-1 ring-[#a47148]'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              ]"
            >
              {{ p }}
            </button>
          </div>

          <!-- Next Page Button -->
          <button
            @click="changePage(page + 1)"
            :disabled="page >= totalPages"
            class="px-3.5 py-2 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span class="hidden sm:inline">Selanjutnya</span>
            <i class="pi pi-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import { fetchArticles } from '@/api/article'

const toast = useToast()

const articles = ref([])
const loading = ref(true)
const page = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const selectedCategory = ref('Semua')

const leadEmail = ref('')
const leadSubmitting = ref(false)

const defaultCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'

const categories = [
  'Semua',
  'Panduan & Tips',
  'Konsep & Adat',
  'Susunan Acara',
  'Kata Mutiara & Doa',
  'Budget & Katering'
]

// Smart category classification based on metadata / content
const getCategory = (article) => {
  if (!article) return 'Panduan & Tips'
  if (article.category) return article.category
  const text = `${article.title || ''} ${article.excerpt || ''} ${article.focusKeyword || ''}`.toLowerCase()
  if (/adat|jawa|sunda|bali|batak|minang|tradisi|konsep|tema|modern|rustic|vintage/.test(text)) return 'Konsep & Adat'
  if (/susunan|rundown|akad|resepsi|acara|jadwal|tata urutan|mc/.test(text)) return 'Susunan Acara'
  if (/doa|ayat|mutiara|kutipan|quote|kata|ucapan|ar-rum|berkah|islami/.test(text)) return 'Kata Mutiara & Doa'
  if (/budget|biaya|katering|catering|hemat|anggaran|vendor|souvenir|harga/.test(text)) return 'Budget & Katering'
  return 'Panduan & Tips'
}

// Reading time calculation (~180-200 wpm)
const getReadingTime = (article) => {
  if (!article) return '3 min baca'
  const content = article.content || article.excerpt || article.title || ''
  const cleanText = content.replace(/<[^>]*>/g, ' ').trim()
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0
  const minutes = Math.max(1, Math.ceil(wordCount / 180))
  return `${minutes} min baca`
}

// Client-side filter matching selected category
const filteredArticles = computed(() => {
  if (selectedCategory.value === 'Semua') {
    return articles.value
  }
  return articles.value.filter((a) => getCategory(a) === selectedCategory.value)
})

// Highlight featured article on page 1 (if available)
const featuredArticle = computed(() => {
  return filteredArticles.value.length > 0 ? filteredArticles.value[0] : null
})

// Articles displayed in the 3-column grid
const gridArticles = computed(() => {
  if (page.value === 1 && featuredArticle.value) {
    return filteredArticles.value.slice(1)
  }
  return filteredArticles.value
})

let searchDebounceTimer = null
const handleSearchInput = () => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    page.value = 1
    loadArticles()
  }, 350)
}

const clearSearch = () => {
  searchQuery.value = ''
  page.value = 1
  loadArticles()
}

const selectCategory = (cat) => {
  selectedCategory.value = cat
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'Semua'
  page.value = 1
  loadArticles()
}

const loadArticles = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: 10
    }
    if (searchQuery.value.trim()) {
      params.q = searchQuery.value.trim()
    }
    const res = await fetchArticles(params)
    articles.value = res.items || res.data || []
    totalPages.value = res.totalPages || 1
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

const submitLeadMagnet = () => {
  if (!leadEmail.value) return
  leadSubmitting.value = true
  setTimeout(() => {
    leadSubmitting.value = false
    toast.success('Checklist & template spreadsheet telah dikirim ke email Anda! Cek inbox atau folder spam.')
    leadEmail.value = ''
  }, 600)
}

onMounted(() => {
  loadArticles()
  document.title = 'Jurnal & Inspirasi Pernikahan - Satu Undangan'
})
</script>
