<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    
    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Undangan Saya" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
      
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

           <!-- Filter Tabs & Create Button -->
           <div class="flex items-center gap-2">
              <div class="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button 
                  @click="activeFilter = 'all'" 
                  class="px-3 py-1.5 rounded-lg transition-all"
                  :class="activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'"
                >
                  Semua ({{ invitations.length }})
                </button>
                <button 
                  @click="activeFilter = 'published'" 
                  class="px-3 py-1.5 rounded-lg transition-all"
                  :class="activeFilter === 'published' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'"
                >
                  Published
                </button>
                <button 
                  @click="activeFilter = 'draft'" 
                  class="px-3 py-1.5 rounded-lg transition-all"
                  :class="activeFilter === 'draft' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'"
                >
                  Draft
                </button>
              </div>

              <router-link 
                to="/templates" 
                class="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#a47148] text-white rounded-xl text-xs font-bold shadow-md shadow-[#a47148]/20 hover:bg-[#8e5e38] transition-all"
              >
                 <i class="fa-solid fa-plus text-[10px]"></i> Buat Baru
              </router-link>
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
        
        <div v-else-if="filteredInvitations.length === 0" class="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 space-y-3">
           <div class="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-slate-100">
              <i class="fa-solid fa-envelope-open"></i>
           </div>
           <h3 class="font-extrabold text-slate-900 text-base">Tidak ada undangan ditemukan</h3>
           <p class="text-xs text-slate-400 max-w-sm mx-auto">Mulai buat undangan digital pertama kamu dengan memilih dari katalog template kami.</p>
           <router-link to="/templates" class="inline-flex items-center gap-2 bg-[#a47148] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#8e5e38] transition-all shadow-sm">
              <i class="fa-solid fa-plus text-[10px]"></i> Buat Sekarang
           </router-link>
        </div>

        <InvitationsTable 
          v-else 
          :invitations="filteredInvitations" 
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
import InvitationsTable from "@/components/dashboard/InvitationsTable.vue"
import BottomNav from "@/components/dashboard/BottomNav.vue"
import { getInvitations, deleteInvitation } from "@/api/invitation"
import { useToast } from "vue-toastification"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

const router = useRouter()
const toast = useToast()
const invitations = ref([])
const loading = ref(true)
const isSidebarOpen = ref(window.innerWidth >= 768)
const showHelpModal = ref(false)
const activeFilter = ref('all')

const filteredInvitations = computed(() => {
  if (activeFilter.value === 'published') {
    return invitations.value.filter(inv => inv.isPublished)
  }
  if (activeFilter.value === 'draft') {
    return invitations.value.filter(inv => !inv.isPublished)
  }
  return invitations.value
})

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

function handlePreview(slug) {
  window.open(`/${slug}?preview=true`, "_blank")
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
