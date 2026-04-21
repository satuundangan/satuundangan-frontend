<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0">
    <!-- Sidebar tetap untuk Desktop -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <!-- Topbar diperkecil untuk Mobile -->
      <Topbar title="Katalog Template" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Pilih Desain Terbaik</h2>
              <p class="text-xs md:text-sm text-muted">Temukan tema yang paling cocok untuk momen spesialmu.</p>
           </div>
           <div class="flex overflow-x-auto gap-2 pb-2 md:pb-0 no-scrollbar">
              <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id"
                 :class="[
                    'whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border transition-all',
                    selectedCategory === cat.id ? 'bg-mocha text-white border-mocha shadow-lg shadow-mocha/20' : 'bg-white text-gray-400 border-gray-100 hover:border-mocha/30'
                 ]">
                 {{ cat.name }}
              </button>
           </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-400">
           <div class="animate-spin text-3xl mb-4 text-mocha">⏳</div>
           <p class="text-sm font-medium">Memuat desain...</p>
        </div>

        <div v-else-if="filteredTemplates.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
           <div v-for="item in filteredTemplates" :key="item.id" 
                @click="goToCreate(item)"
                class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col">
              <div class="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-50">
                 <img :src="resolveImageUrl(item.thumbnailUrl || item.previewUrl)" 
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      @error="(e) => { 
                        e.target.onerror = null;
                        e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                      }"/>
                 <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="bg-white text-dark px-4 py-2 rounded-xl font-bold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                       Gunakan
                    </span>
                 </div>
                 <div v-if="item.isPremium" class="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[8px] font-bold px-2 py-1 rounded-md shadow-md uppercase z-10">
                    Premium
                 </div>
                 <a :href="'/demo/' + item.slug" target="_blank" @click.stop
                    class="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center text-mocha shadow-sm border border-white/50 hover:bg-white transition-colors z-20">
                    <i class="fa-solid fa-eye text-xs"></i>
                 </a>
              </div>
              <div class="p-4 flex flex-col flex-1">
                 <div class="mb-2">
                    <h4 class="font-bold text-dark text-xs md:text-sm truncate group-hover:text-mocha transition-colors">{{ item.name }}</h4>
                    <p class="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">{{ item.category || 'Basic' }}</p>
                 </div>
                 <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <div class="text-mocha font-bold text-[10px] md:text-xs">
                       {{ item.price > 0 ? formatPrice(item.price) : 'Gratis' }}
                    </div>
                    <div class="flex gap-1">
                       <span v-for="color in (item.paletteColors || []).slice(0, 3)" :key="color" 
                         class="w-2.5 h-2.5 rounded-full border border-gray-100 shadow-sm" :style="{ backgroundColor: color }"></span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div v-else class="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
           <div class="text-4xl mb-4">🎨</div>
           <h3 class="text-lg font-bold text-dark mb-1">Belum ada template</h3>
           <p class="text-muted text-sm px-10">Coba pilih kategori lain atau kembali beberapa saat lagi.</p>
        </div>
      </main>
    </div>
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import BottomNav from "@/components/dashboard/BottomNav.vue";
import { getTemplateDesigns } from '@/api/templateDesign';
import { getCategories } from '@/api/category';

const router = useRouter();
const templates = ref([]);
const categories = ref([{ id: 'all', name: 'Semua' }]);
const selectedCategory = ref('all');
const loading = ref(true);
const isSidebarOpen = ref(window.innerWidth >= 768);

onMounted(async () => {
  try {
    const [tplData, catData] = await Promise.all([
      getTemplateDesigns(),
      getCategories()
    ]);
    if (tplData) templates.value = Array.isArray(tplData) ? tplData : (tplData.data || []);
    if (catData) {
      const rawCatData = Array.isArray(catData) ? catData : (Array.isArray(catData.data) ? catData.data : []);
      const formattedCats = rawCatData.map(c => ({ id: c.label || c.name, name: c.label || c.name }));
      categories.value = [{ id: 'all', name: 'Semua' }, ...formattedCats];
    }
  } catch (e) { console.error('Error fetching templates:', e); }
  finally { loading.value = false; }
});

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') return templates.value;
  return templates.value.filter(t => t.category && t.category.toLowerCase() === selectedCategory.value.toLowerCase());
});

function resolveImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/400x500?text=No+Preview';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

function goToCreate(item) {
  localStorage.setItem('selectedTemplate', JSON.stringify(item));
  localStorage.removeItem('selectedSections');
  localStorage.removeItem('finalPayload');
  router.push('/create');
}
</script>

<style>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
