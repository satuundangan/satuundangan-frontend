<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0">
    <!-- Sidebar tetap untuk Desktop -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <!-- Topbar diperkecil untuk Mobile -->
      <Topbar title="Buku Tamu" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto">
        <div class="space-y-4">
           <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Daftar Ucapan</h2>
              <p class="text-xs text-muted md:hidden">Lihat doa dan harapan dari para tamu undanganmu.</p>
           </div>
           <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Pilih Undangan</label>
              <select v-model="selectedInvitationId" class="w-full border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-mocha/20">
                 <option v-for="inv in invitations" :key="inv.id" :value="inv.id">{{ inv.title }}</option>
              </select>
           </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-400">
           <div class="animate-spin text-3xl mb-4 text-mocha">⏳</div>
           <p class="text-sm font-medium">Memuat ucapan...</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
           <div v-for="msg in messages" :key="msg.id" class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition relative group">
              <div class="flex justify-between items-start mb-4">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-mocha/10 text-mocha rounded-xl flex items-center justify-center font-bold text-lg border-2 border-white">
                       {{ msg.guestName ? msg.guestName.charAt(0) : '?' }}
                    </div>
                    <div>
                       <h4 class="font-bold text-dark text-xs truncate max-w-[120px]">{{ msg.guestName }}</h4>
                       <p class="text-[9px] text-gray-400 tracking-wider">{{ formatDate(msg.createdAt) }}</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-1">
                    <span v-if="msg.rsvpStatus === 'hadir'" class="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-green-50 text-green-600 rounded-md border border-green-100">Hadir</span>
                    <span v-else-if="msg.rsvpStatus === 'tidak'" class="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-red-50 text-red-400 rounded-md border border-red-100">Tidak</span>
                 </div>
              </div>
              <div class="relative">
                 <i class="fa-solid fa-quote-left absolute -left-2 -top-2 text-mocha/5 text-3xl"></i>
                 <p class="text-gray-600 text-xs md:text-sm leading-relaxed relative z-10 italic">"{{ msg.message }}"</p>
              </div>
              <div class="pt-4 mt-4 border-t border-gray-50 flex justify-end">
                 <button @click="handleDeleteMessage(msg.id)" class="text-[10px] text-red-300 hover:text-red-500 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                    <i class="fa-solid fa-trash-can"></i> Hapus
                 </button>
              </div>
           </div>
           <div v-if="messages.length === 0" class="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                 <i class="fa-solid fa-comment-slash text-2xl"></i>
              </div>
              <h3 class="font-bold text-dark text-sm">Belum ada ucapan</h3>
              <p class="text-xs text-muted mt-1">Doa dan harapan dari tamu akan muncul di sini.</p>
           </div>
        </div>
      </main>
    </div>
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import BottomNav from "@/components/dashboard/BottomNav.vue";
import { getInvitations } from "@/api/invitation";
import { getGuestMessagesByInvitationId, deleteGuestMessage } from "@/api/guestMessage";
import { useToast } from "vue-toastification";

const toast = useToast();
const invitations = ref([]);
const messages = ref([]);
const selectedInvitationId = ref(null);
const loading = ref(false);
const isSidebarOpen = ref(window.innerWidth >= 768);

onMounted(async () => {
   try {
      const res = await getInvitations();
      const data = Array.isArray(res) ? res : (res.data || []);
      invitations.value = data;
      if(data.length > 0) {
         selectedInvitationId.value = data[0].id;
      }
   } catch (e) {
      console.error(e);
   }
});

watch(selectedInvitationId, async (newId) => {
   if(newId) await fetchMessages(newId);
});

async function fetchMessages(invId) {
   loading.value = true;
   try {
      const res = await getGuestMessagesByInvitationId(invId);
      messages.value = Array.isArray(res) ? res : (res.data || []);
   } catch (e) {
      console.error(e);
      toast.error("Gagal memuat pesan");
   } finally {
      loading.value = false;
   }
}

function formatDate(dateStr) {
   if(!dateStr) return '';
   const options = { day: 'numeric', month: 'short', year: 'numeric' };
   return new Date(dateStr).toLocaleDateString('id-ID', options);
}

async function handleDeleteMessage(id) {
   if(!confirm("Hapus ucapan ini?")) return;
   try {
      await deleteGuestMessage(id);
      toast.success("Ucapan dihapus");
      await fetchMessages(selectedInvitationId.value);
   } catch(e) {
      console.error(e);
      toast.error("Gagal menghapus");
   }
}
</script>
