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
        <div class="flex items-center justify-between mb-2">
           <div>
              <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Halo, {{ userName.split(' ')[0] }}! 👋</h2>
              <p class="text-xs md:text-sm text-muted">Selamat datang kembali di Satu Undangan.</p>
           </div>
           <div class="h-10 w-10 md:h-12 md:w-12 rounded-full bg-mocha/10 flex items-center justify-center text-mocha font-bold border-2 border-white shadow-sm">
              {{ userName.charAt(0) }}
           </div>
        </div>

        <!-- Progress Undangan / CTA Utama -->
        <div v-if="invitations.length > 0 && !allPublished" class="bg-white rounded-2xl p-5 shadow-sm border border-mocha/10 overflow-hidden relative">
           <div class="relative z-10">
              <span class="bg-mocha/10 text-mocha text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Langkah Selanjutnya</span>
              <h3 class="mt-2 font-bold text-dark text-lg">Selesaikan Undanganmu</h3>
              <p class="text-xs text-muted mb-4">Lengkapi detail undangan agar siap dipublikasikan.</p>
              
              <div class="w-full bg-gray-100 h-2 rounded-full mb-4">
                 <div class="bg-mocha h-full rounded-full transition-all duration-500" :style="{ width: '70%' }"></div>
              </div>
              
              <router-link to="/invitations" class="inline-flex items-center gap-2 px-4 py-2 bg-mocha text-white text-xs font-bold rounded-xl shadow-lg shadow-mocha/20">
                 Lanjutkan Edit <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </router-link>
           </div>
           <i class="fa-solid fa-wand-magic-sparkles absolute -right-4 -bottom-4 text-mocha/5 text-8xl rotate-12"></i>
        </div>

        <div v-else-if="invitations.length === 0" class="bg-mocha rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
           <div class="relative z-10">
              <h3 class="text-xl font-bold font-serif">Mulai Perjalananmu</h3>
              <p class="mt-1 text-sm text-white/80">Buat undangan digital impianmu hanya dalam hitungan menit.</p>
              <router-link to="/create" class="mt-4 inline-block bg-white text-mocha px-6 py-2.5 rounded-xl text-sm font-bold shadow-md">
                 Buat Undangan Sekarang
              </router-link>
           </div>
           <i class="fa-solid fa-heart absolute -right-6 -top-6 text-white/10 text-9xl"></i>
        </div>

        <!-- Ringkasan Statistik (Horizontal Scroll on Mobile) -->
        <div class="flex overflow-x-auto pb-2 gap-4 md:grid md:grid-cols-3 md:pb-0 scrollbar-hide">
          <StatCard 
            label="Total Undangan" 
            :value="stats.total" 
            iconClass="fa-solid fa-envelope-open-text" 
            color="bg-white text-blue-600" 
            class="min-w-[140px] flex-shrink-0 shadow-sm border border-gray-100"
          />
          <StatCard 
            label="Tamu Terundang" 
            :value="stats.guests" 
            iconClass="fa-solid fa-users" 
            color="bg-white text-violet-600" 
            class="min-w-[140px] flex-shrink-0 shadow-sm border border-gray-100"
          />
          <StatCard 
            label="Ucapan Masuk" 
            :value="stats.responses" 
            iconClass="fa-solid fa-message" 
            color="bg-white text-emerald-600" 
            class="min-w-[140px] flex-shrink-0 shadow-sm border border-gray-100"
          />
        </div>

        <!-- Aksi Cepat (Grid-based on Mobile) -->
        <div class="space-y-4">
           <h3 class="font-bold text-dark flex items-center justify-between">
              <span>⚡ Aksi Cepat</span>
              <router-link to="/invitations" class="text-[10px] text-mocha font-bold uppercase tracking-widest">Semua Fitur</router-link>
           </h3>
           <div class="grid grid-cols-2 gap-3">
              <router-link to="/create" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-mocha/30 transition-all">
                 <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                    <i class="fa-solid fa-plus text-lg"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Buat Baru</span>
              </router-link>
              <router-link to="/guests" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-mocha/30 transition-all">
                 <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                    <i class="fa-solid fa-user-plus text-lg"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Tambah Tamu</span>
              </router-link>
              <router-link to="/guestbook" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-mocha/30 transition-all">
                 <div class="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-3">
                    <i class="fa-solid fa-comment-dots text-lg"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Cek Ucapan</span>
              </router-link>
              <router-link to="/settings" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-mocha/30 transition-all">
                 <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-3">
                    <i class="fa-solid fa-gear text-lg"></i>
                 </div>
                 <span class="text-xs font-bold text-dark">Pengaturan</span>
              </router-link>
           </div>
        </div>

        <!-- Daftar Undangan Terbaru -->
        <div class="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
           <h3 class="font-bold text-dark mb-4 flex items-center gap-2">
              <span>🎉</span> Undangan Terakhir
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

