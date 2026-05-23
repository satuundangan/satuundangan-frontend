<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <!-- Sidebar tetap untuk Desktop -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <!-- Topbar diperkecil untuk Mobile -->
      <Topbar title="Ringkasan" :showButton="false" @toggleSidebar="isSidebarOpen = !isSidebarOpen" class="md:hidden" />
      <Topbar title="Dashboard" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" class="hidden md:flex" />

      <main class="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
        
        <!-- Header Ringkas (Mobile-First) -->
        <div class="flex items-center justify-between">
           <div>
              <h2 class="text-xl md:text-3xl font-bold text-dark tracking-tight">Halo, {{ userName.split(' ')[0] }}!</h2>
              <p class="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Selamat datang di Satu Undangan</p>
           </div>
        </div>

        <!-- Progress Undangan / CTA Utama -->
        <div v-if="invitations.length > 0 && !allPublished" class="bg-mocha rounded-2xl p-5 md:p-6 text-white overflow-hidden relative shadow-sm">
           <div class="relative z-10">
              <h3 class="font-bold text-lg">Selesaikan Undanganmu</h3>
              <p class="text-xs text-white/80 mb-4">Lengkapi detail agar siap dipublikasikan.</p>
              
              <div class="w-full bg-white/20 h-1.5 rounded-full mb-5">
                 <div class="bg-white h-full rounded-full transition-all duration-500" :style="{ width: '70%' }"></div>
              </div>
              
              <router-link to="/invitations" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-mocha text-[11px] font-bold rounded-xl shadow-sm hover:scale-105 transition-transform">
                 Lanjutkan Edit <i class="fa-solid fa-arrow-right"></i>
              </router-link>
           </div>
           <i class="fa-solid fa-wand-magic-sparkles absolute -right-6 -bottom-6 text-white/10 text-9xl rotate-12"></i>
        </div>

        <div v-else-if="invitations.length === 0" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden relative">
           <div class="relative z-10">
              <h3 class="text-lg font-bold text-dark">Mulai Perjalananmu</h3>
              <p class="mt-1 text-xs text-gray-400">Buat undangan digital impianmu hanya dalam hitungan menit.</p>
              <router-link to="/create" class="mt-5 inline-block bg-mocha text-white px-6 py-3 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all">
                 Buat Undangan Sekarang
              </router-link>
           </div>
        </div>

        <!-- Ringkasan Statistik (Horizontal Scroll on Mobile) -->
        <div class="flex overflow-x-auto pb-2 gap-4 md:grid md:grid-cols-3 md:pb-0 scrollbar-hide">
          <StatCard 
            label="Total Undangan" 
            :value="stats.total" 
            iconClass="fa-solid fa-envelope-open-text" 
            color="bg-blue-50 text-blue-500" 
            class="min-w-[140px] flex-shrink-0"
          />
          <StatCard 
            label="Tamu Terundang" 
            :value="stats.guests" 
            iconClass="fa-solid fa-users" 
            color="bg-violet-50 text-violet-500" 
            class="min-w-[140px] flex-shrink-0"
          />
          <StatCard 
            label="Ucapan Masuk" 
            :value="stats.responses" 
            iconClass="fa-solid fa-message" 
            color="bg-emerald-50 text-emerald-500" 
            class="min-w-[140px] flex-shrink-0"
          />
        </div>

        <!-- Aksi Cepat (Grid-based on Mobile) -->
        <div class="space-y-4">
           <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center justify-between px-1">
              <span>⚡ Aksi Cepat</span>
           </h3>
           <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <router-link to="/create" class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-mocha/20 transition-all">
                 <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-plus text-sm"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Buat Baru</span>
              </router-link>
              <router-link to="/guests" class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-mocha/20 transition-all">
                 <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-user-plus text-sm"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Tamu</span>
              </router-link>
              <router-link to="/guestbook" class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-mocha/20 transition-all">
                 <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-comment-dots text-sm"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Ucapan</span>
              </router-link>
              <router-link to="/settings" class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-mocha/20 transition-all">
                 <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-gear text-sm"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Setelan</span>
              </router-link>
           </div>
        </div>

        <!-- Daftar Undangan Terbaru -->
        <div class="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
           <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
              Terakhir Dibuat
           </h3>
           
           <div v-if="loading" class="space-y-3">
              <!-- Skeleton Items -->
              <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl animate-pulse border border-gray-100/50">
                 <div class="w-12 h-12 rounded-lg bg-gray-200 shrink-0"></div>
                 <div class="flex-1 space-y-2">
                    <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div class="h-2 bg-gray-100 rounded w-1/2"></div>
                 </div>
                 <div class="w-8 h-8 rounded-lg bg-gray-100 shrink-0"></div>
              </div>
           </div>
           <div v-else-if="invitations.length === 0" class="py-10 text-center text-gray-400 italic">
              Belum ada undangan. <router-link to="/create" class="text-mocha underline">Buat sekarang</router-link>
           </div>
           
           <div v-else class="space-y-3">
              <div v-for="inv in invitations.slice(0, 3)" :key="inv.id" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                 <img :src="getInvitationThumbnail(inv)" class="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                 <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                       <h4 class="font-bold text-dark text-xs truncate">{{ inv.title }}</h4>
                       <span :class="inv.isPublished ? 'text-green-600' : 'text-gray-400'" class="text-[8px] font-bold uppercase">
                          • {{ inv.isPublished ? 'Published' : 'Draft' }}
                       </span>
                    </div>
                    <p class="text-[10px] text-muted truncate">satuundangan.com/{{ inv.slug }}</p>
                 </div>
                 <router-link :to="inv.isPublished ? `/${inv.slug}` : '/invitations'" target="_blank" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-mocha shadow-sm border border-gray-100">
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                 </router-link>
              </div>
           </div>
        </div>

      </main>
    </div>

    <!-- Bottom Navigation untuk Mobile -->
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import StatCard from "@/components/dashboard/StatCard.vue";
import BottomNav from "@/components/dashboard/BottomNav.vue";
import { getInvitations, getDashboardStats } from "@/api/invitation";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const toast = useToast();
const auth = useAuthStore();
const invitations = ref([]);
const statsData = ref({
  total_invitations: 0,
  total_guests: 0,
  total_responses: 0
});
const loading = ref(true);
const isSidebarOpen = ref(window.innerWidth >= 768);

const userName = computed(() => auth.user?.name || 'User');

const stats = computed(() => {
  return {
    total: statsData.value.total_invitations || invitations.value.length,
    guests: statsData.value.total_guests || 0,
    responses: statsData.value.total_responses || 0
  };
});

const allPublished = computed(() => invitations.value.every(inv => inv.isPublished));
const publishedCount = computed(() => invitations.value.filter((inv) => inv.isPublished).length);
const draftCount = computed(() => Math.max(0, invitations.value.length - publishedCount.value));

function getInvitationThumbnail(inv) {
  return (
    inv.photoCoupleUrl ||
    inv.photoCouple ||
    inv.bridePhotoUrl ||
    inv.groomPhotoUrl ||
    inv.templateDesign?.thumbnailUrl ||
    inv.templateDesign?.previewUrl ||
    '/default-thumbnail.jpg'
  );
}

function formatDate(date) {
  if (!date) return 'Tanggal belum diatur';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Tanggal belum diatur';
  return parsed.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

onMounted(async () => {
  try {
    const [invRes, statsRes] = await Promise.allSettled([
      getInvitations(),
      getDashboardStats()
    ]);
    
    if (invRes.status === 'fulfilled') {
      invitations.value = Array.isArray(invRes.value) ? invRes.value : (invRes.value.data || []);
    }
    
    if (statsRes.status === 'fulfilled') {
      statsData.value = statsRes.value.data || statsRes.value;
    }
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat dashboard");
  } finally {
    loading.value = false;
  }
});
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>

