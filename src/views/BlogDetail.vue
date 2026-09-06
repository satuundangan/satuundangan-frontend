<template>
  <div class="min-h-screen bg-white font-sans text-gray-800">
    <Navbar />

    <div v-if="loading" class="flex justify-center items-center min-h-screen pt-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b7355]"></div>
    </div>

    <div v-else-if="error || !article" class="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
      <i class="pi pi-file-excel text-6xl text-gray-300 mb-4"></i>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Artikel Tidak Ditemukan</h1>
      <p class="text-gray-500 mb-6">Maaf, artikel yang Anda cari tidak ada atau telah dihapus.</p>
      <router-link to="/blog" class="px-6 py-2.5 bg-[#8b7355] text-white rounded-full font-medium hover:bg-[#7a6548] transition-colors">
        Kembali ke Blog
      </router-link>
    </div>

    <article v-else class="pt-28 pb-20">
      <!-- Article Header -->
      <header class="max-w-3xl mx-auto px-6 mb-10 text-center">
        <div class="text-[#8b7355] text-sm font-medium mb-4 flex items-center justify-center gap-2">
          <router-link to="/blog" class="hover:underline">Blog</router-link>
          <i class="pi pi-angle-right text-xs"></i>
          <span class="text-gray-500 truncate max-w-[200px]">{{ article.title }}</span>
        </div>
        
        <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {{ article.title }}
        </h1>
        
        <div class="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1.5">
            <i class="pi pi-calendar"></i>
            {{ formatDate(article.publishedAt || article.createdAt) }}
          </div>
          <div v-if="article.author?.name" class="flex items-center gap-1.5">
            <i class="pi pi-user"></i>
            Oleh {{ article.author.name }}
          </div>
        </div>
      </header>

      <!-- Cover Image -->
      <div v-if="article.coverImage" class="max-w-5xl mx-auto px-6 mb-12">
        <div class="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 shadow-md">
          <img :src="article.coverImage" :alt="article.title" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Article Content -->
      <div class="max-w-3xl mx-auto px-6">
        <div class="prose prose-lg prose-slate max-w-none article-content" v-html="article.content"></div>
        
        <!-- Share & Author section -->
        <div class="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-500">Bagikan:</span>
            <button @click="share('twitter')" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-colors">
              <i class="pi pi-twitter"></i>
            </button>
            <button @click="share('facebook')" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors">
              <i class="pi pi-facebook"></i>
            </button>
            <button @click="share('copy')" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors" title="Salin tautan">
              <i class="pi pi-link"></i>
            </button>
          </div>
        </div>
      </div>
    </article>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import { fetchArticleBySlug } from '@/api/article'

const route = useRoute()
const router = useRouter()

const article = ref(null)
const loading = ref(true)
const error = ref(false)

const loadArticle = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await fetchArticleBySlug(route.params.slug)
    article.value = res
    updateMeta()
  } catch (err) {
    console.error('Failed to load article:', err)
    error.value = true
  } finally {
    loading.value = false
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

const share = async (platform) => {
  const url = window.location.href
  const title = article.value?.title || 'Artikel Satu Undangan'
  
  if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
  } else if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  } else if (platform === 'copy') {
    try {
      await navigator.clipboard.writeText(url)
      alert('Tautan disalin ke clipboard!')
    } catch (e) {
      console.error('Failed to copy', e)
    }
  }
}

const updateMeta = () => {
  if (!article.value) return
  
  const siteUrl = import.meta.env.VITE_FRONTEND_URL || 'https://www.satuundangan.id'
  const currentUrl = `${siteUrl}/blog/${article.value.slug}`
  
  // Title
  document.title = article.value.metaTitle || `${article.value.title} - Satu Undangan`
  
  // Meta tags helper
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
  
  // Canonical
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
})

watch(() => route.params.slug, () => {
  if (route.name === 'blog-detail') {
    loadArticle()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<style>
/* Base typography styles for the article content (similar to Tiptap output) */
.article-content {
  color: #334155;
  line-height: 1.75;
}
.article-content h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.article-content h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.article-content h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.article-content p {
  margin-bottom: 1.25rem;
}
.article-content a {
  color: #8b7355;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.article-content a:hover {
  color: #6b5840;
}
.article-content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.article-content ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.article-content li {
  margin-bottom: 0.5rem;
}
.article-content blockquote {
  border-left: 4px solid #8b7355;
  padding-left: 1.25rem;
  font-style: italic;
  color: #475569;
  background-color: #faf9f7;
  padding: 1rem 1.25rem;
  border-radius: 0 0.5rem 0.5rem 0;
  margin: 1.5rem 0;
}
.article-content pre {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 1.25rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  margin: 1.5rem 0;
}
.article-content code {
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
  color: #ef4444;
}
.article-content pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}
.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 2rem auto;
  display: block;
}
.article-content hr {
  border-color: #e2e8f0;
  margin: 2.5rem 0;
}
</style>
