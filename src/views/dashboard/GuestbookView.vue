<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />
    <div class="flex-1 flex flex-col ml-64 transition-all duration-300">
      <Topbar title="Buku Tamu" />
      <main class="p-8 flex-1 overflow-y-auto">
        
        <!-- Filter -->
        <div class="mb-6 flex items-center gap-4">
           <label class="text-sm font-medium text-gray-500">Pilih Undangan:</label>
           <select v-model="selectedInvitationId" class="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-mocha">
              <option v-for="inv in invitations" :key="inv.id" :value="inv.id">{{ inv.title }}</option>
           </select>
        </div>

        <div v-if="loading" class="text-center py-20 text-gray-400">Loading messages...</div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div v-for="msg in messages" :key="msg.id" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div class="flex justify-between items-start mb-4">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-sage/20 text-sage rounded-full flex items-center justify-center font-bold text-lg">
                       {{ msg.guestName ? msg.guestName.charAt(0) : '?' }}
                    </div>
                    <div>
                       <h4 class="font-bold text-dark text-sm">{{ msg.guestName }}</h4>
                       <span class="text-[10px] text-gray-400">{{ formatDate(msg.createdAt) }}</span>
                    </div>
                 </div>
                 <span v-if="msg.rsvpStatus === 'hadir'" class="text-green-500 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Hadir</span>
                 <span v-else-if="msg.rsvpStatus === 'tidak'" class="text-red-500 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Tidak</span>
              </div>
              
              <p class="text-gray-600 text-sm italic mb-4">"{{ msg.message }}"</p>
              
              <div class="pt-4 border-t border-gray-50 flex justify-end">
                 <button @click="handleDeleteMessage(msg.id)" class="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1">
                    <i class="fa-solid fa-trash-can"></i> Hapus
                 </button>
              </div>
           </div>
           
           <div v-if="messages.length === 0" class="col-span-full py-20 text-center text-gray-400 italic bg-white rounded-2xl border border-dashed border-gray-200">
              Belum ada ucapan masuk.
           </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import { getInvitations } from "@/api/invitation";
import { getGuestMessagesByInvitationId, deleteGuestMessage } from "@/api/guestMessage";
import { useToast } from "vue-toastification";

const toast = useToast();
const invitations = ref([]);
const messages = ref([]);
const selectedInvitationId = ref(null);
const loading = ref(false);

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
      // API response structure: { success: true, data: [] } or just []
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
   return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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