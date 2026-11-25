<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="closeSidebar" />
    
    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Undangan Saya" showButton @toggleSidebar="toggleSidebar" />
      
      <main class="p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <!-- Header Page -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Undangan Saya</h2>
              <button 
                @click="showHelpModal = true" 
                class="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-100 transition-colors" 
                title="Panduan Penggunaan"
              >
                <i class="fa-solid fa-circle-question"></i>
              </button>
            </div>
            <p class="text-xs text-slate-400 mt-1">Kelola seluruh undangan digital yang telah kamu buat.</p>
          </div>

          <router-link 
            to="/templates" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-[#a47148] text-white rounded-xl text-xs font-bold shadow-md shadow-[#a47148]/20 hover:bg-[#8e5e38] transition-all self-start sm:self-auto"
          >
            <i class="fa-solid fa-plus text-[10px]"></i> Buat Baru
          </router-link>
        </div>

        <!-- Quick Stat Summary Row -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            label="Total Undangan"
            :value="invitations.length"
            iconClass="fa-solid fa-layer-group"
            color="bg-blue-50 text-blue-600"
            class="cursor-pointer transition-transform hover:-translate-y-0.5"
            @click="activeFilter = 'all'"
          />
          <StatCard
            label="Undangan Aktif"
            :value="activeInvitationsCount"
            iconClass="fa-solid fa-circle-check"
            color="bg-emerald-50 text-emerald-600"
            class="cursor-pointer transition-transform hover:-translate-y-0.5"
            @click="activeFilter = 'published'"
          />
          <StatCard
            label="Menunggu Pembayaran / Draf"
            :value="pendingOrDraftCount"
            iconClass="fa-solid fa-clock"
            color="bg-amber-50 text-amber-600"
            class="cursor-pointer transition-transform hover:-translate-y-0.5"
            @click="activeFilter = activeFilter === 'pending' ? 'draft' : 'pending'"
          />
          <StatCard
            label="Tamu Terdaftar"
            :value="totalGuestsRegistered"
            iconClass="fa-solid fa-users"
            color="bg-indigo-50 text-indigo-600"
            class="transition-transform hover:-translate-y-0.5"
          />
        </div>

        <!-- Search and Filter Bar with View Mode Switcher -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="relative flex-1 max-w-md">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari judul, slug, atau nama mempelai..."
              class="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#a47148] focus:ring-1 focus:ring-[#a47148] shadow-2xs transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs"
              title="Reset pencarian"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Filter Tabs -->
            <div class="flex items-center overflow-x-auto p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 shrink-0">
              <button 
                @click="activeFilter = 'all'" 
                class="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                :class="activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'"
              >
                Semua ({{ invitations.length }})
              </button>
              <button 
                @click="activeFilter = 'published'" 
                class="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                :class="activeFilter === 'published' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'"
              >
                Aktif ({{ activeInvitationsCount }})
              </button>
              <button 
                @click="activeFilter = 'pending'" 
                class="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                :class="activeFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'"
              >
                Menunggu Bayar
              </button>
              <button 
                @click="activeFilter = 'draft'" 
                class="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                :class="activeFilter === 'draft' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'"
              >
                Draft
              </button>
            </div>

            <!-- View Mode Toggle (Table vs Card Grid) -->
            <div class="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 text-xs">
              <button
                @click="toggleViewMode('table')"
                class="px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'"
                title="Tampilan Tabel"
              >
                <i class="fa-solid fa-table-list"></i>
                <span>Tabel</span>
              </button>
              <button
                @click="toggleViewMode('grid')"
                class="px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'"
                title="Tampilan Kartu"
              >
                <i class="fa-solid fa-table-cells-large"></i>
                <span>Kartu</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row gap-6 animate-pulse">
            <div class="w-full md:w-48 h-28 bg-slate-100 rounded-xl"></div>
            <div class="flex-1 space-y-3 py-1">
              <div class="h-5 bg-slate-200 rounded-lg w-1/3"></div>
              <div class="h-3.5 bg-slate-100 rounded-lg w-1/4"></div>
              <div class="h-8 bg-slate-100 rounded-xl w-32 pt-2"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="invitations.length === 0" class="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 space-y-3">
          <div class="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-slate-100">
            <i class="fa-solid fa-envelope-open"></i>
          </div>
          <h3 class="font-extrabold text-slate-900 text-base">Tidak ada undangan ditemukan</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">Mulai buat undangan digital pertama kamu dengan memilih dari katalog template kami.</p>
          <router-link to="/templates" class="inline-flex items-center gap-2 bg-[#a47148] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#8e5e38] transition-all shadow-sm">
            <i class="fa-solid fa-plus text-[10px]"></i> Buat Sekarang
          </router-link>
        </div>

        <div v-else-if="filteredInvitations.length === 0" class="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 space-y-3">
          <div class="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-slate-100">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="font-extrabold text-slate-900 text-base">Tidak ada hasil yang cocok</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">Tidak ditemukan undangan yang cocok dengan kata kunci pencarian atau filter yang dipilih.</p>
          <button @click="resetFilters" class="inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all">
            <i class="fa-solid fa-rotate-left text-[10px]"></i> Reset Pencarian & Filter
          </button>
        </div>

        <InvitationsTable 
          v-else 
          :invitations="filteredInvitations" 
          :viewMode="viewMode"
          @edit="handleEdit" 
          @delete="handleDelete" 
          @preview="handlePreview" 
        />
      </main>
    </div>

    <!-- Bottom Navigation -->
    <BottomNav />

    <!-- Help Modal -->
    <div v-if="showHelpModal" class="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl animate-scale-up space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="font-black text-xl text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-circle-info text-[#a47148]"></i> Panduan Undangan
          </h3>
          <button @click="showHelpModal = false" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        
        <div class="space-y-5">
          <div class="flex gap-4">
            <div class="w-9 h-9 shrink-0 rounded-xl bg-[#a47148] text-white flex items-center justify-center font-bold text-xs">1</div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs">Status Draft</h4>
              <p class="text-xs text-slate-500 leading-relaxed mt-0.5">Undangan baru berstatus <b>Draft</b>. Kamu bebas mengubah isi teks, foto, musik, dan tema sepuasnya.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-9 h-9 shrink-0 rounded-xl bg-[#a47148] text-white flex items-center justify-center font-bold text-xs">2</div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs">Publish Undangan</h4>
              <p class="text-xs text-slate-500 leading-relaxed mt-0.5">Klik tombol <b>Publish</b> (ikon roket) untuk memproses pembayaran dan mengaktifkan link publik undanganmu.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-9 h-9 shrink-0 rounded-xl bg-[#a47148] text-white flex items-center justify-center font-bold text-xs">3</div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs">Sebarkan ke Tamu</h4>
              <p class="text-xs text-slate-500 leading-relaxed mt-0.5">Setelah berstatus <b>Published</b>, buka menu <b>Daftar Tamu</b> untuk mengirimkan ucapan & link khusus via WhatsApp.</p>
            </div>
          </div>
        </div>

        <button @click="showHelpModal = false" class="w-full py-3 bg-[#a47148] text-white rounded-xl font-bold text-xs shadow-md shadow-[#a47148]/20 hover:bg-[#8e5e38] transition-all">
          Saya Mengerti
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import Sidebar from "@/components/dashboard/SidebarDashboard.vue"
import Topbar from "@/components/dashboard/TopbarDashboard.vue"
import StatCard from "@/components/dashboard/StatCard.vue"
import InvitationsTable from "@/components/dashboard/InvitationsTable.vue"
import BottomNav from "@/components/dashboard/BottomNav.vue"
import { getInvitations, deleteInvitation } from "@/api/invitation"
import { getInvitationPreviewUrl } from "@/utils/invitationUrls"
import { useToast } from "vue-toastification"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"
import { useDashboardSidebar } from "@/composables/useDashboardSidebar"

const router = useRouter()
const toast = useToast()
const { isSidebarOpen, toggleSidebar, closeSidebar } = useDashboardSidebar()
const invitations = ref([])
const loading = ref(true)
const showHelpModal = ref(false)
const activeFilter = ref('all')
const searchQuery = ref('')
const viewMode = ref(typeof window !== 'undefined' ? (localStorage.getItem('satuundangan_invitations_view_mode') || 'table') : 'table')

function toggleViewMode(mode) {
  viewMode.value = mode
  if (typeof window !== 'undefined') {
    localStorage.setItem('satuundangan_invitations_view_mode', mode)
  }
}

const activeInvitationsCount = computed(() => invitations.value.filter(inv => inv.isPublished).length)
const pendingOrDraftCount = computed(() => invitations.value.filter(inv => !inv.isPublished).length)
const totalGuestsRegistered = computed(() => invitations.value.reduce((acc, inv) => acc + Number(inv.guestCount || 0), 0))
const totalRsvpHadir = computed(() => invitations.value.reduce((acc, inv) => acc + Number(inv.confirmedGuestCount || 0), 0))

const filteredInvitations = computed(() => {
  let list = invitations.value
  if (activeFilter.value === 'published') {
    list = list.filter(inv => inv.isPublished)
  } else if (activeFilter.value === 'pending') {
    list = list.filter(inv => !inv.isPublished && (inv.paymentStatus === 'pending' || inv.latestPaymentStatus === 'pending' || inv.latestOrderId))
  } else if (activeFilter.value === 'draft') {
    list = list.filter(inv => !inv.isPublished && inv.paymentStatus !== 'pending' && inv.latestPaymentStatus !== 'pending')
  }

  if (searchQuery.value && searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(inv => {
      const title = (inv.title || '').toLowerCase()
      const slug = (inv.slug || '').toLowerCase()
      const groom = (inv.groomName || inv.groomNickname || '').toLowerCase()
      const bride = (inv.brideName || inv.brideNickname || '').toLowerCase()
      return title.includes(q) || slug.includes(q) || groom.includes(q) || bride.includes(q)
    })
  }

  return list
})

function resetFilters() {
  searchQuery.value = ''
  activeFilter.value = 'all'
}

async function fetchInvitations() {
  loading.value = true
  try {
    const res = await getInvitations()
    invitations.value = Array.isArray(res) ? res : (res.data || [])
  } catch (error) {
    console.error(error)
    toast.error("Gagal memuat daftar undangan")
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInvitations()
})

function handleEdit(id) {
  router.push(`/invitation/${id}/edit`)
}

function handlePreview(invitation) {
  window.open(getInvitationPreviewUrl(invitation), "_blank")
}

async function handleDelete(id) {
  const result = await Swal.fire({
    title: 'Hapus Undangan?',
    text: 'Undangan yang dihapus tidak dapat dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    await deleteInvitation(id)
    toast.success("Undangan berhasil dihapus")
    await fetchInvitations()
  } catch (error) {
    console.error(error)
    toast.error("Gagal menghapus undangan: " + (error.message || "Terjadi kesalahan"))
  }
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
.animate-scale-up {
  animation: scaleUp 0.2s ease-out;
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>
