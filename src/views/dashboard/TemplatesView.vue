<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Katalog Template" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Pilih Desain Impian</h2>
              <p class="text-xs text-slate-400 mt-1">Temukan tema undangan yang paling pas untuk momen spesialmu.</p>
           </div>
           
           <!-- Category Pills Filter -->
           <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
              <button 
                v-for="cat in categories" 
                :key="cat.id" 
                @click="selectedCategory = cat.id"
                :class="[
                   'whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-bold transition-all border',
                   selectedCategory === cat.id 
                     ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10' 
                     : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                ]"
              >
                 {{ cat.name }}
              </button>
           </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-slate-400">
           <i class="fa-solid fa-circle-notch animate-spin text-3xl mb-3 text-slate-900"></i>
           <p class="text-xs font-bold">Memuat katalog desain...</p>
        </div>

        <div v-else-if="filteredTemplates.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
           <div 
             v-for="item in filteredTemplates" 
             :key="item.id" 
             @click="goToCreate(item)"
             class="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-100 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
           >
              <div class="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-slate-100">
                 <img 
                   :src="resolveImageUrl(item.thumbnailUrl || item.previewUrl)" 
                   class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   @error="(e) => { 
                     e.target.onerror = null;
                     e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                   }"
                 />
                 <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                    <span class="bg-white text-slate-900 px-4 py-2 rounded-xl font-extrabold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5">
                       <i class="fa-solid fa-wand-magic-sparkles text-[11px] text-blue-600"></i> Gunakan Desain
                    </span>
                 </div>
                 
                 <a 
                   :href="'/demo/' + item.slug" 
                   target="_blank" 
                   @click.stop
                   class="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-700 shadow-sm border border-white/60 hover:bg-white hover:text-blue-600 transition-colors z-20"
                   title="Preview Demo"
                 >
                    <i class="fa-solid fa-eye text-xs"></i>
                 </a>

                 <span v-if="item.isPremium" class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                   Premium
                 </span>
              </div>
              
              <div class="p-4 flex flex-col flex-1">
                 <div class="mb-2">
                    <h4 class="font-extrabold text-slate-900 text-xs md:text-sm truncate group-hover:text-blue-600 transition-colors">{{ item.name }}</h4>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{{ item.category || 'Modern' }}</p>
                 </div>
                 
                 <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    <div class="font-black text-xs text-slate-900">
                       {{ item.price > 0 ? formatPrice(item.price) : 'Gratis' }}
                    </div>
                    <div class="flex gap-1">
                       <span 
                         v-for="color in (item.paletteColors || []).slice(0, 3)" 
                         :key="color" 
                         class="w-2.5 h-2.5 rounded-full border border-slate-100 shadow-2xs" 
                         :style="{ backgroundColor: color }"
                       ></span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div v-else class="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
           <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300 text-xl border border-slate-100">
             <i class="fa-solid fa-palette"></i>
           </div>
           <h3 class="text-sm font-extrabold text-slate-900">Belum Ada Template Ditemukan</h3>
           <p class="text-xs text-slate-400 max-w-xs mx-auto">Coba pilih kategori lain di filter atas untuk melihat pilihan desain yang tersedia.</p>
        </div>
      </main>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import Sidebar from "@/components/dashboard/SidebarDashboard.vue"
import Topbar from "@/components/dashboard/TopbarDashboard.vue"
import BottomNav from "@/components/dashboard/BottomNav.vue"
import { getTemplateDesigns } from '@/api/templateDesign'
import { getCategories } from '@/api/category'

const router = useRouter()
const templates = ref([])
const categories = ref([{ id: 'all', name: 'Semua' }])
const selectedCategory = ref('all')
const loading = ref(true)
const isSidebarOpen = ref(window.innerWidth >= 768)

onMounted(async () => {
  try {
    const [tplData, catData] = await Promise.all([
      getTemplateDesigns(),
      getCategories()
    ])
    if (tplData) templates.value = Array.isArray(tplData) ? tplData : (tplData.data || [])
    if (catData) {
      const rawCatData = Array.isArray(catData) ? catData : (Array.isArray(catData.data) ? catData.data : [])
      const formattedCats = rawCatData.map(c => ({ id: c.label || c.name, name: c.label || c.name }))
      categories.value = [{ id: 'all', name: 'Semua' }, ...formattedCats]
    }
  } catch (e) {
    console.error('Error fetching templates:', e)
  } finally {
    loading.value = false
  }
})

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') return templates.value
  return templates.value.filter(t => t.category && t.category.toLowerCase() === selectedCategory.value.toLowerCase())
})

function resolveImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/400x500?text=No+Preview'
  if (url.startsWith('http')) return url
  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : ''
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

function goToCreate(item) {
  localStorage.setItem('selectedTemplate', JSON.stringify(item))
  localStorage.removeItem('selectedSections')
  localStorage.removeItem('finalPayload')
  router.push('/create')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
