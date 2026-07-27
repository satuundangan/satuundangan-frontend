<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <!-- Topbar -->
      <Topbar title="Dashboard" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar">
        
        <!-- Header Banner with Time-based Greeting -->
        <div class="rounded-3xl bg-gradient-to-r from-[#a47148] via-[#b58055] to-[#8e5e38] p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-[#a47148]/20">
          <div class="relative z-10 max-w-2xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
              <i class="fa-solid fa-sparkles text-amber-200"></i> {{ greetingTime }}
            </div>
            <h2 class="text-2xl md:text-4xl font-extrabold tracking-tight">Halo, {{ userName.split(' ')[0] }}! 👋</h2>
            <p class="text-xs md:text-sm text-amber-100/90 leading-relaxed">
              Kelola seluruh undangan digital pernikahanmu, daftar tamu, dan pesan ucapan langsung dari satu panel sederhana.
            </p>
            
            <div class="pt-2 flex flex-wrap items-center gap-3">
              <router-link to="/templates" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#a47148] text-xs font-black rounded-xl shadow-md hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all">
                <i class="fa-solid fa-plus text-xs"></i> Buat Undangan Baru
              </router-link>
              <router-link to="/invitations" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white text-xs font-bold rounded-xl hover:bg-white/25 transition-all backdrop-blur-sm">
                Lihat Undangan Saya <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </router-link>
            </div>
          </div>
          
          <i class="fa-solid fa-envelope-open-text absolute -right-6 -bottom-8 text-white/10 text-[180px] rotate-12 pointer-events-none hidden sm:block"></i>
        </div>

        <!-- Ringkasan Statistik -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            label="Total Undangan" 
            :value="stats.total" 
            iconClass="fa-solid fa-envelope-open-text" 
            color="bg-blue-50 text-blue-600" 
          />
          <StatCard 
            label="Tamu Terundang" 
            :value="stats.guests" 
            iconClass="fa-solid fa-users" 
            color="bg-purple-50 text-purple-600" 
          />
          <StatCard 
            label="Ucapan Masuk" 
            :value="stats.responses" 
            iconClass="fa-solid fa-comments" 
            color="bg-emerald-50 text-emerald-600" 
          />
        </div>

        <!-- Aksi Cepat / Shortcut Cockpit Grid -->
        <div class="space-y-3">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
             <span class="flex items-center gap-2"><i class="fa-solid fa-bolt text-amber-500"></i> Aksi Cepat</span>
          </h3>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
             <router-link to="/templates" class="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <i class="fa-solid fa-wand-magic-sparkles text-base"></i>
                </div>
                <div>
                   <span class="text-xs font-bold text-slate-900 block">Katalog Template</span>
                   <span class="text-[10px] text-slate-400 block">Pilih desain baru</span>
                </div>
             </router-link>
             
             <router-link to="/guests" class="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group">
                <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <i class="fa-solid fa-user-plus text-base"></i>
                </div>
                <div>
                   <span class="text-xs font-bold text-slate-900 block">Daftar Tamu</span>
                   <span class="text-[10px] text-slate-400 block">Kelola penerima</span>
                </div>
             </router-link>
             
             <router-link to="/guestbook" class="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <i class="fa-solid fa-book-open text-base"></i>
                </div>
                <div>
                   <span class="text-xs font-bold text-slate-900 block">Buku Tamu</span>
                   <span class="text-[10px] text-slate-400 block">Lihat ucapan masuk</span>
                </div>
             </router-link>
             
             <router-link to="/settings" class="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group">
                <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <i class="fa-solid fa-sliders text-base"></i>
                </div>
                <div>
                   <span class="text-xs font-bold text-slate-900 block">Pengaturan</span>
                   <span class="text-[10px] text-slate-400 block">Profil & akun</span>
                </div>
             </router-link>
          </div>
        </div>

        <!-- Daftar Undangan Terbaru -->
        <div class="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
           <div class="flex items-center justify-between">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <i class="fa-solid fa-clock-rotate-left text-blue-500"></i> Undangan Terakhir Dibuat
              </h3>
              <router-link to="/invitations" class="text-xs font-bold text-blue-600 hover:underline">
                 Lihat Semua ({{ invitations.length }})
              </router-link>
           </div>
           
           <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl animate-pulse">
                 <div class="w-12 h-12 rounded-xl bg-slate-200 shrink-0"></div>
                 <div class="flex-1 space-y-2">
                    <div class="h-3 bg-slate-200 rounded w-1/3"></div>
                    <div class="h-2.5 bg-slate-100 rounded w-1/4"></div>
                 </div>
                 <div class="w-16 h-8 rounded-xl bg-slate-200 shrink-0"></div>
              </div>
           </div>

           <div v-else-if="invitations.length === 0" class="py-12 text-center space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto text-xl border border-slate-100">
                 <i class="fa-solid fa-envelope-open"></i>
              </div>
              <h4 class="font-bold text-slate-800 text-sm">Belum Ada Undangan Dibuat</h4>
              <p class="text-xs text-slate-400 max-w-xs mx-auto">Mulai perjalananmu membuat undangan digital elegan hanya dalam hitungan menit.</p>
              <router-link to="/templates" class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
                 <i class="fa-solid fa-plus text-[10px]"></i> Buat Undangan Pertama
              </router-link>
           </div>
           
           <div v-else class="space-y-3">
              <div 
                v-for="inv in invitations.slice(0, 4)" 
                :key="inv.id" 
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group"
              >
                 <div class="flex items-center gap-3.5 min-w-0">
                    <img 
                      :src="getInvitationThumbnail(inv)" 
                      class="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200/60 shrink-0" 
                    />
                    <div class="min-w-0">
                       <div class="flex items-center gap-2">
                          <h4 class="font-extrabold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                            {{ inv.title || 'Undangan Tanpa Judul' }}
                          </h4>
                          <span 
                            :class="inv.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'" 
                            class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border"
                          >
                             {{ inv.isPublished ? 'Published' : 'Draft' }}
                          </span>
                       </div>
                       <p class="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          <i class="fa-solid fa-link text-[10px] text-slate-300"></i>
                          <span>satuundangan.com/{{ inv.slug }}</span>
                       </p>
                    </div>
                 </div>

                 <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button 
                      @click="copyLink(inv.slug)"
                      class="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 text-xs flex items-center gap-1.5"
                      title="Salin Link Undangan"
                    >
                      <i class="fa-solid fa-copy"></i>
                      <span class="hidden md:inline">Salin</span>
                    </button>
                    
                    <router-link 
                      :to="`/invitation/${inv.id}/edit`" 
                      class="px-3.5 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5"
                    >
                      <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                      <span>Edit</span>
                    </router-link>

                    <a 
                      :href="`/${inv.slug}`" 
                      target="_blank" 
                      class="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-2xs"
                      title="Buka Website Undangan"
                    >
                      <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                    </a>
                 </div>
              </div>
           </div>
        </div>

      </main>
    </div>

    <!-- Bottom Navigation Mobile -->
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import Sidebar from "@/components/dashboard/SidebarDashboard.vue"
import Topbar from "@/components/dashboard/TopbarDashboard.vue"
import StatCard from "@/components/dashboard/StatCard.vue"
import BottomNav from "@/components/dashboard/BottomNav.vue"
import { getInvitations, getDashboardStats } from "@/api/invitation"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "vue-toastification"

const toast = useToast()
const auth = useAuthStore()
const invitations = ref([])
const statsData = ref({
  total_invitations: 0,
  total_guests: 0,
  total_responses: 0
})
const loading = ref(true)
const isSidebarOpen = ref(window.innerWidth >= 768)

const userName = computed(() => auth.user?.name || 'User')

const greetingTime = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 11) return 'Selamat Pagi'
  if (hour >= 11 && hour < 15) return 'Selamat Siang'
  if (hour >= 15 && hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const stats = computed(() => {
  return {
    total: statsData.value.total_invitations || invitations.value.length,
    guests: statsData.value.total_guests || 0,
    responses: statsData.value.total_responses || 0
  }
})

function getInvitationThumbnail(inv) {
  return (
    inv.photoCoupleUrl ||
    inv.photoCouple ||
    inv.bridePhotoUrl ||
    inv.groomPhotoUrl ||
    inv.templateDesign?.thumbnailUrl ||
    inv.templateDesign?.previewUrl ||
    '/default-thumbnail.jpg'
  )
}

function copyLink(slug) {
  const fullUrl = `${window.location.origin}/${slug}`
  navigator.clipboard.writeText(fullUrl)
  toast.success('Link undangan berhasil disalin!')
}

onMounted(async () => {
  try {
    const [invRes, statsRes] = await Promise.allSettled([
      getInvitations(),
      getDashboardStats()
    ])
    
    if (invRes.status === 'fulfilled') {
      invitations.value = Array.isArray(invRes.value) ? invRes.value : (invRes.value.data || [])
    }
    
    if (statsRes.status === 'fulfilled') {
      statsData.value = statsRes.value.data || statsRes.value
    }
  } catch (error) {
    console.error(error)
    toast.error("Gagal memuat dashboard")
  } finally {
    loading.value = false
  }
})
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
</style>

