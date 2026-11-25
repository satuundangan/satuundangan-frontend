<template>
  <div class="flex h-screen bg-[#FAF8F5] overflow-hidden pb-20 md:pb-0 font-sans">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @close="closeSidebar" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <!-- Topbar -->
      <Topbar title="Dashboard" showButton @toggleSidebar="toggleSidebar" @startTour="startDashboardTour({ force: true })" />

      <main class="p-4 md:p-8 space-y-7 overflow-y-auto custom-scrollbar max-w-6xl w-full mx-auto">
        
        <!-- Editorial Atelier Header -->
        <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 text-xs font-medium text-[#8f5e38]">
              <span class="w-4 h-px bg-[#a47148]"></span>
              <span>{{ greetingTime }}</span>
            </div>
            <h2 class="text-2xl md:text-4xl font-serif font-semibold text-stone-900 tracking-tight">
              Halo, {{ userFirstName }}.
            </h2>
            <p class="text-xs md:text-sm text-stone-500 max-w-xl leading-relaxed">
              Kelola undangan pernikahan, daftar tamu, dan konfirmasi kehadiran dari satu ruang kerja.
            </p>
          </div>
          
          <div class="flex flex-wrap items-center gap-2.5 shrink-0">
            <router-link
              to="/invitations"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-stone-700 border border-stone-200/90 text-xs font-semibold rounded-lg hover:border-stone-400 hover:text-stone-900 transition-colors"
            >
              <span>Lihat Undangan Saya</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </router-link>
            <router-link
              to="/templates"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>Buat Undangan Baru</span>
            </router-link>
          </div>
        </header>

        <!-- Panduan Persiapan Undangan (SAT-62: Journey Checklist Widget) -->
        <JourneyChecklistWidget 
          :invitations="invitations" 
          :stats="stats" 
          :loading="loading" 
        />

        <!-- Ringkasan Statistik (SAT-50: Tautan Cepat ke Detail Modul) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <StatCard 
            label="Total Undangan" 
            :value="stats.total" 
            iconClass="fa-solid fa-envelope-open-text" 
            to="/invitations"
          />
          <StatCard 
            label="Tamu Terundang" 
            :value="stats.guests" 
            iconClass="fa-solid fa-users" 
            to="/guests"
          />
          <StatCard 
            label="Konfirmasi Hadir" 
            :value="stats.attending" 
            iconClass="fa-solid fa-circle-check" 
            to="/guests?filter=hadir"
          />
          <StatCard 
            label="Ucapan Masuk" 
            :value="stats.responses" 
            iconClass="fa-solid fa-comments" 
            to="/guestbook"
          />
        </div>

        <!-- Pintasan Ruang Kerja (Grouped Hairline Bar — Anti-Slop) -->
        <section class="space-y-2.5">
          <h3 class="text-xs font-medium text-stone-500 px-0.5">
            Pintasan Cepat
          </h3>
          
          <div class="bg-white border border-stone-200/80 rounded-xl overflow-hidden grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/70">
            <router-link to="/planner" data-tour="dashboard-action-planner" class="flex items-center gap-3 p-4 hover:bg-stone-50/80 transition-colors group">
              <i class="fa-solid fa-clipboard-check text-sm text-[#8f5e38] shrink-0"></i>
              <div class="min-w-0">
                <span class="text-xs font-semibold text-stone-900 group-hover:text-[#8f5e38] transition-colors truncate block">Wedding Planner</span>
                <span class="text-[11px] text-stone-400 block truncate">Budget & Checklist</span>
              </div>
            </router-link>

            <router-link to="/templates" class="flex items-center gap-3 p-4 hover:bg-stone-50/80 transition-colors group">
              <i class="fa-solid fa-swatchbook text-sm text-stone-500 group-hover:text-[#8f5e38] transition-colors shrink-0"></i>
              <div class="min-w-0">
                <span class="text-xs font-semibold text-stone-900 group-hover:text-[#8f5e38] transition-colors block truncate">Katalog Template</span>
                <span class="text-[11px] text-stone-400 block truncate">Pilih desain baru</span>
              </div>
            </router-link>
            
            <router-link to="/guests" data-tour="dashboard-action-guests" class="flex items-center gap-3 p-4 hover:bg-stone-50/80 transition-colors group">
              <i class="fa-solid fa-user-plus text-sm text-stone-500 group-hover:text-[#8f5e38] transition-colors shrink-0"></i>
              <div class="min-w-0">
                <span class="text-xs font-semibold text-stone-900 group-hover:text-[#8f5e38] transition-colors block truncate">Daftar Tamu</span>
                <span class="text-[11px] text-stone-400 block truncate">Sebar via WhatsApp</span>
              </div>
            </router-link>
            
            <router-link to="/guestbook" data-tour="dashboard-action-reception" class="flex items-center gap-3 p-4 hover:bg-stone-50/80 transition-colors group">
              <i class="fa-solid fa-qrcode text-sm text-stone-500 group-hover:text-[#8f5e38] transition-colors shrink-0"></i>
              <div class="min-w-0">
                <span class="text-xs font-semibold text-stone-900 group-hover:text-[#8f5e38] transition-colors block truncate">Meja Resepsi</span>
                <span class="text-[11px] text-stone-400 block truncate">Buku tamu & QR</span>
              </div>
            </router-link>
            
            <router-link to="/settings" class="col-span-2 sm:col-span-1 flex items-center gap-3 p-4 hover:bg-stone-50/80 transition-colors group">
              <i class="fa-solid fa-sliders text-sm text-stone-500 group-hover:text-[#8f5e38] transition-colors shrink-0"></i>
              <div class="min-w-0">
                <span class="text-xs font-semibold text-stone-900 group-hover:text-[#8f5e38] transition-colors block truncate">Pengaturan</span>
                <span class="text-[11px] text-stone-400 block truncate">Profil & akun</span>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Daftar Undangan Terbaru -->
        <div data-tour="dashboard-invitations-card" class="bg-white rounded-xl p-5 md:p-6 border border-stone-200/80 space-y-4">
           <div class="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 class="text-xs font-semibold text-stone-600 flex items-center gap-2">
                 <i class="fa-solid fa-clock-rotate-left text-stone-400"></i> Undangan Terbaru
              </h3>
              <router-link to="/invitations" class="text-xs font-semibold text-[#8f5e38] hover:text-[#734a2b] transition-colors">
                 Lihat Semua ({{ invitations.length }})
              </router-link>
           </div>
           
           <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4 bg-stone-50 rounded-xl animate-pulse">
                 <div class="w-12 h-12 rounded-lg bg-stone-200 shrink-0"></div>
                 <div class="flex-1 space-y-2">
                    <div class="h-3 bg-stone-200 rounded w-1/3"></div>
                    <div class="h-2.5 bg-stone-100 rounded w-1/4"></div>
                 </div>
                 <div class="w-16 h-8 rounded-lg bg-stone-200 shrink-0"></div>
              </div>
           </div>

           <div v-else-if="invitationLoadError" class="py-10 px-4 text-center space-y-3">
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-lg border border-amber-200/60">
                 <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h4 class="font-semibold text-stone-900 text-sm">Daftar undangan belum bisa dimuat</h4>
              <p class="text-xs text-stone-500 max-w-sm mx-auto">{{ invitationLoadError }}</p>
              <router-link v-if="invitationRequiresLogin" :to="{ name: 'home', query: { login: 'true', redirect: '/dashboard' } }" class="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors">
                 <i class="fa-solid fa-arrow-right-to-bracket text-[10px]"></i> Masuk kembali
              </router-link>
           </div>

           <div v-else-if="invitations.length === 0" class="py-12 text-center space-y-3">
              <div class="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-lg border border-stone-200/60">
                 <i class="fa-solid fa-envelope-open"></i>
              </div>
              <h4 class="font-semibold text-stone-900 text-sm">Belum ada undangan dibuat</h4>
              <p class="text-xs text-stone-500 max-w-xs mx-auto">Pilih template untuk mulai menyusun draf undangan pernikahanmu.</p>
              <router-link to="/templates" class="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors">
                 <i class="fa-solid fa-plus text-[10px]"></i> Buat Undangan Pertama
              </router-link>
           </div>
           
           <div v-else class="divide-y divide-stone-100">
              <div 
                v-for="inv in invitations.slice(0, 4)" 
                :key="inv.id" 
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1 group"
              >
                 <div class="flex items-center gap-3.5 min-w-0">
                    <img 
                      :src="getInvitationThumbnail(inv)" 
                      class="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200/80 shrink-0" 
                      loading="lazy"
                    />
                    <div class="min-w-0">
                       <div class="flex items-center gap-2 flex-wrap">
                          <h4 class="font-semibold text-stone-900 text-sm truncate group-hover:text-[#8f5e38] transition-colors">
                            {{ inv.title || 'Undangan Tanpa Judul' }}
                          </h4>
                          <span 
                            :class="inv.isPublished ? 'text-emerald-700 bg-emerald-50 border-emerald-200/80' : (inv.paymentStatus === 'pending' || inv.latestPaymentStatus === 'pending') ? 'text-amber-700 bg-amber-50 border-amber-200/80' : 'text-stone-600 bg-stone-100 border-stone-200/80'" 
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border"
                          >
                             <span class="w-1.5 h-1.5 rounded-full" :class="inv.isPublished ? 'bg-emerald-600' : (inv.paymentStatus === 'pending' || inv.latestPaymentStatus === 'pending') ? 'bg-amber-600' : 'bg-stone-400'"></span>
                             {{ inv.isPublished ? 'Aktif' : (inv.paymentStatus === 'pending' || inv.latestPaymentStatus === 'pending') ? 'Menunggu Bayar' : 'Draft' }}
                          </span>
                          <span 
                            v-if="inv.package" 
                            class="text-[11px] font-medium text-stone-500 capitalize"
                          >
                            {{ inv.package }}
                          </span>
                       </div>
                       <p class="text-xs text-stone-400 truncate mt-0.5 font-mono">
                          {{ getInvitationPublicUrl(inv) }}
                       </p>
                    </div>
                 </div>

                 <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-auto flex-wrap">
                    <button 
                      @click="copyLink(inv)"
                      class="px-2.5 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors border border-stone-200/80 text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Salin Link Undangan"
                    >
                      <i class="fa-solid fa-copy text-[11px]"></i>
                      <span class="hidden md:inline">Salin</span>
                    </button>

                    <router-link 
                      :to="`/guests?invitationId=${inv.id}`"
                      class="px-2.5 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5"
                      title="Sebar WhatsApp & Kelola Tamu"
                    >
                      <i class="fa-brands fa-whatsapp text-xs text-emerald-600"></i>
                      <span>Tamu</span>
                    </router-link>
                    
                    <router-link 
                      :to="`/invitation/${inv.id}/edit`" 
                      class="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5"
                    >
                      <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                      <span>Edit</span>
                    </router-link>

                    <a 
                      :href="getInvitationPublicUrl(inv)"
                      target="_blank" 
                      class="w-8 h-8 flex items-center justify-center bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 hover:border-stone-400 rounded-lg transition-colors"
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
import JourneyChecklistWidget from "@/components/dashboard/JourneyChecklistWidget.vue"
import BottomNav from "@/components/dashboard/BottomNav.vue"
import { getInvitations, getDashboardStats } from "@/api/invitation"
import { getInvitationPublicUrl } from "@/utils/invitationUrls"
import { resolveTemplateThumbnail } from "@/utils/templateRegistry"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "vue-toastification"
import { startDashboardTour } from "@/composables/useOnboardingTour"
import { useDashboardSidebar } from "@/composables/useDashboardSidebar"

const toast = useToast()
const auth = useAuthStore()
const { isSidebarOpen, toggleSidebar, closeSidebar } = useDashboardSidebar()
const invitations = ref([])
const statsData = ref({
  total_invitations: 0,
  total_guests: 0,
  total_responses: 0
})
const loading = ref(true)
const invitationLoadError = ref('')
const invitationRequiresLogin = ref(false)

const userName = computed(() => auth.user?.name || auth.user?.username || 'Pengguna')
const userFirstName = computed(() => {
  const name = userName.value || 'Pengguna'
  return name.toString().split(' ')[0] || 'Pengguna'
})

const greetingTime = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 11) return 'Selamat Pagi'
  if (hour >= 11 && hour < 15) return 'Selamat Siang'
  if (hour >= 15 && hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const stats = computed(() => {
  const breakdown = statsData.value.rsvp_breakdown || {}
  return {
    total: statsData.value.total_invitations || invitations.value.length,
    guests: statsData.value.total_guests || 0,
    attending: breakdown.attending || 0,
    responses: statsData.value.total_messages_received || statsData.value.total_responses || 0
  }
})

function getInvitationThumbnail(inv) {
  const regThumb = inv.templateDesign
    ? resolveTemplateThumbnail(inv.templateDesign)
    : inv.templateName || inv.template
      ? resolveTemplateThumbnail({ slug: inv.template || inv.templateName })
      : ''
  return (
    regThumb ||
    inv.photoCoupleUrl ||
    inv.photoCouple ||
    inv.bridePhotoUrl ||
    inv.groomPhotoUrl ||
    inv.templateDesign?.thumbnailUrl ||
    inv.templateDesign?.previewUrl ||
    '/default-thumbnail.jpg'
  )
}

function copyLink(invitation) {
  const fullUrl = getInvitationPublicUrl(invitation)
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
    } else {
      invitationRequiresLogin.value = invRes.reason?.status === 401
      invitationLoadError.value = invitationRequiresLogin.value
        ? 'Sesi login sudah tidak berlaku. Masuk kembali dengan akun Tiara untuk melihat undangan.'
        : 'Periksa koneksi, lalu muat ulang halaman dashboard.'
    }
    
    if (statsRes.status === 'fulfilled') {
      statsData.value = statsRes.value.data || statsRes.value
    }
  } catch (error) {
    console.error(error)
    toast.error("Gagal memuat dashboard")
  } finally {
    loading.value = false
    // Trigger onboarding tour for new users with a smooth delay
    setTimeout(() => {
      startDashboardTour({ force: false })
    }, 1000)
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

