<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col md:ml-64 transition-all duration-300 min-w-0">
      <Topbar title="Dashboard" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
        <!-- Welcome Banner -->
        <div class="rounded-2xl bg-mocha p-6 text-white shadow-lg md:p-8">
           <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                 <p class="text-xs font-bold uppercase text-white/70">Dashboard Undangan</p>
                 <h2 class="mt-2 text-2xl md:text-3xl font-serif font-bold">Halo, {{ userName }}</h2>
                 <p class="mt-2 text-sm md:text-base text-white/85">Pantau status undangan, tamu, dan publikasi dari satu tempat.</p>
              </div>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                 <div class="rounded-xl bg-white/10 px-4 py-3">
                    <p class="text-[10px] font-bold uppercase text-white/60">Published</p>
                    <p class="text-2xl font-bold">{{ publishedCount }}</p>
                 </div>
                 <div class="rounded-xl bg-white/10 px-4 py-3">
                    <p class="text-[10px] font-bold uppercase text-white/60">Draft</p>
                    <p class="text-2xl font-bold">{{ draftCount }}</p>
                 </div>
                 <router-link to="/create" class="col-span-2 flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-mocha transition hover:bg-ivory sm:col-span-1">
                    Buat Baru
                 </router-link>
              </div>
           </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatCard label="Total Undangan" :value="stats.total" iconClass="fa-solid fa-envelope-open-text" color="bg-blue-50 text-blue-600" />
          <StatCard label="Tamu Terundang" :value="stats.guests" iconClass="fa-solid fa-users" color="bg-violet-50 text-violet-600" />
          <StatCard label="Ucapan Masuk" :value="stats.responses" iconClass="fa-solid fa-message" color="bg-emerald-50 text-emerald-600" />
        </div>

        <!-- Recent Activity & Quick Share -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
           <!-- Recent Invitations -->
           <div class="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
              <h3 class="font-bold text-dark mb-4 flex items-center gap-2">
                 <span>🎉</span> Undangan Terakhir
              </h3>
              
              <div v-if="loading" class="py-10 text-center text-gray-400">Loading...</div>
              <div v-else-if="invitations.length === 0" class="py-10 text-center text-gray-400 italic">
                 Belum ada undangan. <router-link to="/create" class="text-mocha underline">Buat sekarang</router-link>
              </div>
              
              <div v-else class="space-y-3 md:space-y-4">
                 <div v-for="inv in invitations.slice(0, 4)" :key="inv.id" class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition gap-4">
                    <div class="flex min-w-0 items-center gap-3 md:gap-4">
                       <img :src="getInvitationThumbnail(inv)" class="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover shadow-sm bg-gray-200" />
                       <div class="min-w-0">
                          <div class="flex flex-wrap items-center gap-2">
                             <h4 class="font-bold text-dark text-sm truncate max-w-[180px] sm:max-w-none">{{ inv.title }}</h4>
                             <span :class="inv.isPublished ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-200 text-gray-500 border-gray-300'" class="rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase">
                                {{ inv.isPublished ? 'Published' : 'Draft' }}
                             </span>
                          </div>
                          <p class="mt-1 text-[10px] md:text-xs text-muted truncate">/{{ inv.slug }}</p>
                          <p class="mt-1 text-[10px] text-gray-400">{{ formatDate(inv.akadLocation?.dateTime || inv.dateTime) }}</p>
                       </div>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto">
                       <a v-if="inv.isPublished" :href="`/${inv.slug}`" target="_blank" class="flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-bold text-mocha bg-mocha/10 rounded-lg hover:bg-mocha hover:text-white transition">
                          Lihat
                       </a>
                       <span v-else class="flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-bold text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed">
                          Draft
                       </span>
                       <router-link :to="`/invitations`" class="flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          Kelola
                       </router-link>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Quick Actions -->
           <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center text-center space-y-4">
              <div class="mx-auto w-12 h-12 md:w-16 md:h-16 bg-sage/20 rounded-xl flex items-center justify-center text-sage text-2xl md:text-3xl mb-2">
                 <i class="fa-solid fa-bolt"></i>
              </div>
              <h3 class="font-bold text-dark">Aksi Cepat</h3>
              <p class="text-xs text-muted">Kelola workflow undangan yang paling sering dipakai.</p>
              
              <router-link to="/create" class="w-full py-3 bg-mocha text-white rounded-xl font-bold shadow-lg shadow-mocha/20 hover:shadow-mocha/40 transition-all hover:-translate-y-1">
                 + Buat Undangan Baru
              </router-link>
              <router-link to="/guests" class="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition">
                 Kelola Tamu
              </router-link>
           </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import StatCard from "@/components/dashboard/StatCard.vue";
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
const isSidebarOpen = ref(false);

const userName = computed(() => auth.user?.name || 'User');

const stats = computed(() => {
  return {
    total: statsData.value.total_invitations || invitations.value.length,
    guests: statsData.value.total_guests || 0,
    responses: statsData.value.total_responses || 0
  };
});

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
