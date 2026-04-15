<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col md:ml-64 transition-all duration-300 min-w-0">
      <Topbar title="Dashboard" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-mocha to-[#bfa6a0] rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
           <div class="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white/10 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <h2 class="text-2xl md:text-3xl font-serif font-bold mb-1 md:mb-2 relative z-10">Halo, {{ userName }}!</h2>
           <p class="text-sm md:text-base opacity-90 relative z-10">Siap menyebarkan kabar bahagiamu hari ini?</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatCard label="Total Undangan" :value="stats.total" icon="💌" color="bg-blue-50 text-blue-600" />
          <StatCard label="Tamu Terundang" :value="stats.guests" icon="👥" color="bg-purple-50 text-purple-600" />
          <StatCard label="Ucapan Masuk" :value="stats.responses" icon="💬" color="bg-green-50 text-green-600" />
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
                 <div v-for="inv in invitations.slice(0, 3)" :key="inv.id" class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition gap-4">
                    <div class="flex items-center gap-3 md:gap-4">
                       <img :src="inv.photoCoupleUrl || 'https://via.placeholder.com/50'" class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm" />
                       <div class="min-w-0">
                          <h4 class="font-bold text-dark text-sm truncate max-w-[150px] sm:max-w-none">{{ inv.title }}</h4>
                          <p class="text-[10px] md:text-xs text-muted truncate">{{ inv.slug }}</p>
                       </div>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto">
                       <a :href="`/${inv.slug}`" target="_blank" class="flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-bold text-mocha bg-mocha/10 rounded-lg hover:bg-mocha hover:text-white transition">
                          Lihat
                       </a>
                       <router-link :to="`/invitations`" class="flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          Kelola
                       </router-link>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Quick Actions -->
           <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center space-y-4">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-sage/20 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-2">🚀</div>
              <h3 class="font-bold text-dark">Aksi Cepat</h3>
              <p class="text-xs text-muted">Mulai sesuatu yang baru.</p>
              
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