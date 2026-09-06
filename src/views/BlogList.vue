<template>
  <div class="min-h-screen bg-[#faf9f7] font-sans text-gray-800">
    <Navbar />

    <!-- Hero Section -->
    <div class="bg-[#1c1917] text-white py-20 mt-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="font-serif text-4xl md:text-5xl font-bold mb-4">Blog & Artikel</h1>
        <p class="text-gray-400 text-lg">Tips, inspirasi, dan panduan seputar pernikahan dan undangan digital.</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 py-16">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b7355]"></div>
      </div>
      
      <div v-else-if="articles.length === 0" class="text-center py-20 text-gray-500">
        Belum ada artikel yang dipublikasikan.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link 
          v-for="article in articles" 
          :key="article.id"
          :to="`/blog/${article.slug}`"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
        >
          <!-- Cover Image -->
          <div class="h-48 bg-gray-200 overflow-hidden relative">
            <img 
              v-if="article.coverImage || article.ogImage" 
              :src="article.coverImage || article.ogImage" 
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-[#8b7355]/10">
              <i class="pi pi-file-edit text-4xl text-[#8b7355]/40"></i>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-6 flex flex-col flex-1">
            <div class="text-xs text-gray-400 mb-2 flex items-center gap-2">
              <i class="pi pi-calendar"></i>
              {{ formatDate(article.publishedAt || article.createdAt) }}
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{{ article.title }}</h2>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{{ article.excerpt || stripHtml(article.content).substring(0, 150) + '...' }}</p>
            <div class="flex items-center gap-2 text-[#8b7355] text-sm font-medium mt-auto group">
              Baca selengkapnya 
              <i class="pi pi-arrow-right transition-transform group-hover:translate-x-1"></i>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12 gap-2">
        <button 
          v-for="p in totalPages" 
          :key="p"
          @click="changePage(p)"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            page === p 
              ? 'bg-[#8b7355] text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          ]"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import { fetchArticles } from '@/api/article'

const articles = ref([])
const loading = ref(true)
const page = ref(1)
const totalPages = ref(1)

const loadArticles = async () => {
  loading.value = true
  try {
    const res = await fetchArticles({ page: page.value, limit: 9 })
    articles.value = res.items || res.data || []
    totalPages.value = res.totalPages || 1
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (p) => {
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

onMounted(() => {
  loadArticles()
  document.title = 'Blog & Artikel - Satu Undangan'
})
</script>
