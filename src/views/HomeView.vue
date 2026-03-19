<template>
  <div class="bg-ivory min-h-screen font-sans text-dark scroll-smooth">
    <Navbar @create-invitation="showModal = true" />

    <!-- Hero Section -->
    <HeroSection @create-invitation="showModal = true" />

    <!-- Features Section -->
    <section id="features">
      <FeaturesSection />
    </section>

    <!-- Steps Section -->
    <StepsSection />

    <!-- Template Section (Existing Logic) -->
    <section id="templates" class="section bg-white scroll-mt-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="heading mb-4">Pilih Template Favoritmu</h2>
          <p class="text-muted">Desain premium untuk hari spesialmu.</p>
        </div>

        <!-- Filter Categories (Desktop Tabs) -->
        <div class="flex flex-wrap justify-center gap-2 mb-10">
          <button v-for="cat in visibleCategories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
            'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
            selectedCategory === cat.id
              ? 'bg-mocha text-white border-mocha shadow-lg shadow-mocha/20'
              : 'bg-transparent text-gray-500 border-gray-200 hover:border-mocha hover:text-mocha'
          ]">
            {{ cat.name }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha"></div>
        </div>

        <div v-else class="grid md:grid-cols-3 gap-10">
          <div v-for="(item) in filteredTemplates.slice(0, 9)" :key="item.id"
            @click="selectTemplate(item.id); showModal = true;"
            class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-gray-100 relative">

            <div class="relative overflow-hidden h-64 bg-gray-100">
              <img :src="item.previewUrl || 'https://via.placeholder.com/400x300?text=No+Preview'" :alt="item.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span
                  class="bg-white/90 text-mocha px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                  👁️ Lihat Detail
                </span>
              </div>

              <!-- Badge Premium -->
              <div v-if="item.tags && item.tags.includes('premium')"
                class="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider uppercase">
                Premium
              </div>
            </div>

            <div class="p-5">
              <h4 class="font-bold text-dark text-lg mb-1 group-hover:text-mocha transition-colors">{{ item.name }}</h4>
              <p class="text-sm text-muted line-clamp-2 mb-4">{{ item.description }}</p>

              <div class="flex flex-wrap gap-2">
                <span v-for="tag in item.tags?.slice(0, 3)" :key="tag"
                  class="text-[10px] bg-sage/10 text-sage font-medium px-2 py-0.5 rounded-md">
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <button @click="showModal = true" class="btn-outline px-8 rounded-full hover:shadow-lg transition-all">Lihat
            Semua Template</button>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="section bg-ivory relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2">
      </div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-mocha/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2">
      </div>

      <div class="max-w-6xl mx-auto px-6 relative z-10">
        <h2 class="heading text-center mb-12">Kata Mereka</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(item, i) in testimonials" :key="i"
            class="bg-white rounded-2xl p-8 shadow-lg border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <div class="text-mocha text-5xl font-serif absolute top-6 left-6 opacity-20">"</div>
            <p class="text-dark/80 italic mb-6 mt-4 relative z-10 text-sm leading-relaxed">
              {{ item.text }}
            </p>
            <div class="flex items-center gap-4 border-t border-gray-100 pt-4">
              <img :src="item.avatar" alt="avatar"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-sage/30 p-0.5" />
              <div>
                <h4 class="text-sm font-bold text-dark">{{ item.name }}</h4>
                <p class="text-xs text-muted">{{ item.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <FaqSection />

    <!-- Footer -->
    <Footer />


    <!-- Modal Pilih Template -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center px-4"
      @click.self="showModal = false">
      <div
        class="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">

        <!-- Sidebar Filter (Desktop) -->
        <aside class="hidden md:flex md:w-64 bg-gray-50 border-r border-gray-200 flex-col">
          <div class="p-6 border-b border-gray-200">
            <h4 class="font-bold text-mocha text-lg flex items-center gap-2">
              <span>🔍</span> Filter
            </h4>
          </div>

          <div class="p-4 overflow-y-auto flex-1 custom-scrollbar">
            <div class="mb-6">
              <h5 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Kategori</h5>
              <ul class="space-y-1">
                <li v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
                  'cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex justify-between items-center group',
                  selectedCategory === cat.id ? 'bg-white text-mocha shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-200/50'
                ]">
                  {{ cat.name }}
                  <span v-if="selectedCategory === cat.id" class="w-1.5 h-1.5 rounded-full bg-mocha"></span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0 bg-white relative">
          <!-- Header Modal -->
          <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-white z-10 shadow-sm">
            <div>
              <h3 class="text-xl font-bold text-dark font-serif">Pilih Template</h3>
              <p class="text-sm text-muted hidden sm:block">Pilih desain terbaik untuk acaramu.</p>
            </div>
            <button @click="showModal = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition">
              &times;
            </button>
          </div>

          <!-- Mobile Filter Tabs -->
          <div class="md:hidden flex overflow-x-auto p-3 gap-2 border-b border-gray-100 no-scrollbar">
            <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
              'whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-colors',
              selectedCategory === cat.id ? 'bg-mocha text-white border-mocha' : 'bg-white text-gray-600 border-gray-200'
            ]">
              {{ cat.name }}
            </button>
          </div>

          <!-- Template Grid -->
          <div class="flex-1 overflow-y-auto p-6 bg-gray-50/50 custom-scrollbar">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin text-mocha text-3xl">⏳</div>
            </div>
            <div v-else-if="filteredTemplates.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              <div v-for="(item) in filteredTemplates" :key="item.id" :ref="el => templateRefs[item.id] = el"
                @click="selectTemplate(item.id)" :class="[
                  selectedTemplate === item.id ? 'ring-2 ring-mocha ring-offset-2 scale-[1.02]' : 'hover:shadow-lg hover:-translate-y-1',
                  'bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-gray-100 flex flex-col group shadow-sm'
                ]">
                <div class="relative h-44 overflow-hidden bg-gray-200">
                  <img :src="item.previewUrl || 'https://via.placeholder.com/400x300'"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div v-if="selectedTemplate === item.id"
                    class="absolute inset-0 bg-mocha/40 backdrop-blur-[1px] flex items-center justify-center animate-fade-in">
                    <div class="bg-white rounded-full p-2 shadow-lg scale-110">
                      <svg class="w-6 h-6 text-mocha" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="p-4 flex flex-col flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-dark text-sm line-clamp-1"
                      :class="selectedTemplate === item.id ? 'text-mocha' : ''">{{ item.name }}</h4>
                  </div>

                  <p class="text-xs text-muted mb-3 line-clamp-2 flex-1 leading-relaxed">{{ item.description }}</p>

                  <div class="pt-3 border-t border-gray-50 mt-auto flex justify-between items-center">
                    <div class="flex gap-1">
                      <span v-for="color in item.paletteColor" :key="color" class="w-3 h-3 rounded-full border border-gray-100" :style="{ backgroundColor: color }"></span>
                    </div>
                    <span v-if="selectedTemplate === item.id" class="text-xs font-bold text-mocha">Terpilih</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <div
                class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl grayscale opacity-50">
                📦</div>
              <div>
                <p class="font-medium text-gray-600">Tidak ada template ditemukan</p>
                <p class="text-sm">Coba pilih kategori lain.</p>
              </div>
            </div>
          </div>

          <!-- Footer Modal -->
          <div
            class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white flex justify-between items-center z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <div class="hidden sm:block">
              <p v-if="selectedTemplate" class="text-sm text-mocha font-medium">
                Template terpilih: <span class="font-bold">{{filteredTemplates.find(t => t.id ===
                  selectedTemplate)?.name }}</span>
              </p>
              <p v-else class="text-sm text-gray-400">Silakan pilih template.</p>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button @click="showModal = false"
                class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition">Batal</button>
              <button
                class="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-mocha text-white text-sm font-semibold hover:bg-mocha/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-mocha/20 hover:shadow-mocha/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                :disabled="selectedTemplate === null" @click="goToCreate">
                Lanjut <span class="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import HeroSection from '@/components/layout/HeroSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import StepsSection from '@/components/landing/StepsSection.vue'
import FaqSection from '@/components/landing/FaqSection.vue'
import { getTemplateDesigns } from '@/api/templateDesign'
import { getCategories } from '@/api/category' // Update Import

const router = useRouter()
const showModal = ref(false)
const selectedTemplate = ref(null)
const selectedCategory = ref('all') // Default to 'all' ID
const templateRefs = reactive({})
const templates = ref([])
const categories = ref([{ id: 'all', name: 'Semua' }]) // Init categories
const loading = ref(true)

const testimonials = [
  {
    id: 1,
    name: 'Rani & Aldi',
    role: 'Pengantin Bahagia',
    text: 'Sangat puas dengan hasilnya! Template premiumnya benar-benar elegan. Tamu-tamu kami banyak yang memuji desain undangannya.',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 2,
    name: 'Nabila',
    role: 'Sahabat Mempelai',
    text: 'Baru kali ini liat undangan online yang seprofesional ini. Fitur RSVP dan amplop digitalnya sangat membantu.',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 3,
    name: 'Vina & Robby',
    role: 'Pengantin',
    text: 'Worth every penny! Fitur lengkap, desain tidak pasaran, dan servernya cepat. Recommended banget buat yang mau nikah.',
    avatar: 'https://i.pravatar.cc/150?img=51',
  },
];

// Load Data
onMounted(async () => {
  try {
    const [tplData, catData] = await Promise.all([
      getTemplateDesigns(),
      getCategories()
    ])

    if (tplData) templates.value = tplData

    if (catData) {
      // Use the category NAME (label) as the ID for selection logic
      const rawCatData = Array.isArray(catData) ? catData : (catData.data || [])
      const formattedCats = rawCatData.map(c => ({
        id: c.label || c.name,
        name: c.label || c.name
      }))
      categories.value = [{ id: 'all', name: 'Semua' }, ...formattedCats]
    }

  } catch (e) {
    console.error('Gagal ambil data:', e)
  } finally {
    loading.value = false
  }
})

// Filter Logic
const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') return templates.value

  return templates.value.filter(t => {
    // Match template.category with the selected category NAME
    return t.category && t.category.toLowerCase() === selectedCategory.value.toLowerCase()
  })
})

const visibleCategories = computed(() => categories.value.slice(0, 5)) // Show top 5 on homepage

watch(() => showModal.value, (newVal) => {
  if (newVal) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

watch(() => showModal.value, async (val) => {
  if (val && selectedTemplate.value) {
    await nextTick()
    const el = templateRefs[selectedTemplate.value]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})

function selectTemplate(id) {
  selectedTemplate.value = id
}

function goToCreate() {
  const tpl = templates.value.find((t) => t.id === selectedTemplate.value)

  if (tpl) {
    localStorage.setItem('selectedTemplate', JSON.stringify(tpl))
    showModal.value = false;
    router.push('/create')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

.font-sans {
  font-family: 'Inter', sans-serif;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d6d3d1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a29e;
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
