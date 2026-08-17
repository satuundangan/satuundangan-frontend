<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Buku Tamu & Ucapan" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <div class="space-y-4">
           <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                 <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Daftar Ucapan & Doa</h2>
                 <p class="text-xs text-slate-400 mt-1">Lihat ucapan dan konfirmasi kehadiran langsung dari para tamu.</p>
              </div>
           </div>

           <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Pilih Undangan</label>
              <select v-model="selectedInvitationId" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all">
                 <option v-for="inv in invitations" :key="inv.id" :value="inv.id">{{ inv.title }}</option>
              </select>
           </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-slate-400">
           <i class="fa-solid fa-circle-notch animate-spin text-3xl mb-3 text-[#a47148]"></i>
           <p class="text-xs font-bold">Memuat pesan ucapan...</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <div 
             v-for="msg in messages" 
             :key="msg.id" 
             class="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 hover:border-slate-200 transition-all relative flex flex-col justify-between"
           >
              <div>
                <div class="flex justify-between items-start mb-3 gap-2">
                   <div class="flex items-center gap-3 min-w-0">
                      <div class="w-9 h-9 bg-[#a47148] text-white rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                         {{ msg.guestName ? msg.guestName.charAt(0).toUpperCase() : '?' }}
                      </div>
                      <div class="min-w-0">
                         <h4 class="font-extrabold text-slate-900 text-xs truncate">{{ msg.guestName }}</h4>
                         <p class="text-[10px] text-slate-400 font-medium">{{ formatDate(msg.createdAt) }}</p>
                      </div>
                   </div>

                   <div class="flex items-center gap-1 shrink-0">
                      <span v-if="msg.rsvpStatus === 'hadir'" class="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-200">Hadir</span>
                      <span v-else-if="msg.rsvpStatus === 'tidak'" class="text-[9px] font-black uppercase px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md border border-rose-200">Tidak Hadir</span>
                      <span v-else class="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200">Ragu</span>
                   </div>
                </div>

                <div class="relative py-2">
                   <p class="text-slate-600 text-xs leading-relaxed italic">"{{ msg.message }}"</p>
                </div>
              </div>

              <div class="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                 <button 
                   @click="handleDeleteMessage(msg.id)" 
                   class="text-[10px] text-rose-400 hover:text-rose-600 font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                 >
                    <i class="fa-solid fa-trash-can"></i> Hapus Ucapan
                 </button>
              </div>
           </div>

           <div v-if="messages.length === 0" class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
              <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300 text-xl border border-slate-100">
                 <i class="fa-solid fa-comment-slash"></i>
              </div>
              <h3 class="font-extrabold text-slate-800 text-sm">Belum Ada Ucapan Masuk</h3>
              <p class="text-xs text-slate-400">Doa dan pesan kebahagiaan dari para tamu akan tampil di sini.</p>
           </div>
        </div>
      </main>
    </div>
    
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import Sidebar from "@/components/dashboard/SidebarDashboard.vue"
import Topbar from "@/components/dashboard/TopbarDashboard.vue"
import BottomNav from "@/components/dashboard/BottomNav.vue"
import { getInvitations } from "@/api/invitation"
import { getGuestMessagesByInvitationId, deleteGuestMessage } from "@/api/guestMessage"
import { useToast } from "vue-toastification"
import Swal from "sweetalert2"

const toast = useToast()
const invitations = ref([])
const messages = ref([])
const selectedInvitationId = ref(null)
const loading = ref(false)
const isSidebarOpen = ref(window.innerWidth >= 768)

onMounted(async () => {
   try {
      const res = await getInvitations()
      const data = Array.isArray(res) ? res : (res.data || [])
      invitations.value = data
      if(data.length > 0) {
         selectedInvitationId.value = data[0].id
      }
   } catch (e) {
      console.error(e)
   }
})

watch(selectedInvitationId, async (newId) => {
   if(newId) await fetchMessages(newId)
})

async function fetchMessages(invId) {
   loading.value = true
   try {
      const res = await getGuestMessagesByInvitationId(invId)
      messages.value = Array.isArray(res) ? res : (res.data || [])
   } catch (e) {
      console.error(e)
      toast.error("Gagal memuat pesan ucapan")
   } finally {
      loading.value = false
   }
}

function formatDate(dateStr) {
   if(!dateStr) return '-'
   try {
     const options = { day: 'numeric', month: 'short', year: 'numeric' }
     return new Date(dateStr).toLocaleDateString('id-ID', options)
   } catch {
     return '-'
   }
}

async function handleDeleteMessage(id) {
   const result = await Swal.fire({
     title: 'Hapus Ucapan Ini?',
     text: 'Ucapan tamu yang dihapus tidak dapat dikembalikan!',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#e11d48',
     cancelButtonColor: '#cbd5e1',
     confirmButtonText: 'Ya, Hapus',
     cancelButtonText: 'Batal'
   })

   if (!result.isConfirmed) return

   try {
      await deleteGuestMessage(id)
      toast.success("Ucapan berhasil dihapus")
      await fetchMessages(selectedInvitationId.value)
   } catch(e) {
      console.error(e)
      toast.error("Gagal menghapus ucapan: " + (e.message || "Terjadi kesalahan"))
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
</style>
