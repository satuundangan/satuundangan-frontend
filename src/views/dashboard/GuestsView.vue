<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Daftar Tamu" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 flex-1 overflow-y-auto space-y-6">
        
        <!-- Header & Filter -->
        <div class="space-y-4">
           <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Manajemen Tamu</h2>
              <button @click="showAddModal = true" :disabled="!selectedInvitationId" class="w-full md:w-auto bg-mocha text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-mocha/90 flex items-center justify-center gap-2 shadow-lg shadow-mocha/20 disabled:opacity-50">
                 <i class="fa-solid fa-plus text-xs"></i> Tambah Tamu
              </button>
           </div>

           <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                 <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Pilih Undangan</label>
                 <select v-model="selectedInvitationId" class="w-full border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-mocha/20">
                    <option v-for="inv in invitations" :key="inv.id" :value="inv.id">{{ inv.title }}</option>
                 </select>
              </div>
              <div class="flex-1">
                 <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cari Nama</label>
                 <div class="relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                    <input v-model="searchQuery" type="text" placeholder="Masukkan nama tamu..." class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-mocha/20">
                 </div>
              </div>
           </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
           <div class="animate-spin text-mocha text-2xl">⏳</div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 class="font-bold text-dark text-xs uppercase tracking-wider">Total: {{ filteredGuests.length }} Tamu</h3>
           </div>

           <div class="overflow-x-auto">
              <table class="w-full text-left text-sm min-w-[700px]">
                <thead class="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                  <tr>
                    <th class="px-6 py-4">Nama Tamu</th>
                    <th class="px-6 py-4">Kategori</th>
                    <th class="px-6 py-4">Status RSVP</th>
                    <th class="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="guest in filteredGuests" :key="guest.id" class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4">
                       <p class="font-bold text-dark">{{ guest.name }}</p>
                       <p class="text-[10px] text-gray-400 mt-0.5">{{ guest.phoneNumber || 'No phone' }}</p>
                    </td>
                    <td class="px-6 py-4">
                       <span class="px-2 py-1 rounded-lg text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">{{ guest.group || 'Umum' }}</span>
                    </td>
                    <td class="px-6 py-4">
                       <div v-if="guest.rsvpStatus === 'hadir'" class="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                          <i class="fa-solid fa-circle-check"></i> Hadir
                       </div>
                       <div v-else-if="guest.rsvpStatus === 'tidak'" class="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                          <i class="fa-solid fa-circle-xmark"></i> Tidak
                       </div>
                       <div v-else class="text-gray-300 text-[10px] italic">Menunggu...</div>
                    </td>
                    <td class="px-6 py-4 text-right">
                       <div class="flex justify-end gap-2">
                          <button @click="openShareModal(guest)" :disabled="!currentInvitation?.isPublished" :class="currentInvitation?.isPublished ? 'text-green-500 hover:text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-300 bg-gray-50 cursor-not-allowed'" class="w-9 h-9 flex items-center justify-center rounded-xl transition" title="Kirim WA">
                             <i class="fa-brands fa-whatsapp text-lg"></i>
                          </button>
                          <button @click="deleteGuestHandler(guest.id)" class="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition" title="Hapus">
                             <i class="fa-solid fa-trash-can text-sm"></i>
                          </button>
                       </div>
                    </td>
                  </tr>
                  <tr v-if="filteredGuests.length === 0">
                     <td colspan="4" class="px-6 py-12 text-center">
                        <div class="text-gray-300 mb-2"><i class="fa-solid fa-users-slash text-3xl"></i></div>
                        <p class="text-gray-400 text-xs italic">Belum ada tamu atau nama tidak ditemukan.</p>
                     </td>
                  </tr>
                </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>

    <!-- Modals (Add & Share) same as before -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
       <div class="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md p-8 shadow-2xl animate-slide-up md:animate-scale-up">
          <div class="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 md:hidden"></div>
          <h3 class="font-bold text-xl mb-6 text-dark flex items-center gap-2">
             <i class="fa-solid fa-user-plus text-mocha"></i> Tambah Tamu
          </h3>
          
          <div class="space-y-4">
             <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nama Tamu</label>
                <input v-model="newGuest.name" type="text" class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none text-sm" placeholder="Misal: Budi Santoso">
             </div>
             <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Kategori</label>
                <select v-model="newGuest.group" class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 text-sm">
                   <option value="">Umum</option>
                   <option value="Keluarga">Keluarga</option>
                   <option value="Teman">Teman</option>
                   <option value="VIP">VIP</option>
                </select>
             </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">WhatsApp (08...)</label>
                <input v-model="newGuest.phoneNumber" type="text" class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none text-sm" placeholder="08123456789">
             </div>
          </div>

          <div class="mt-8 flex gap-3">
             <button @click="showAddModal = false" class="flex-1 py-3 text-gray-400 font-bold text-sm">Batal</button>
             <button @click="submitGuest" :disabled="isSubmitting" class="flex-[2] py-3 bg-mocha text-white rounded-xl text-sm font-bold shadow-lg shadow-mocha/20 disabled:opacity-50">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Tamu' }}
             </button>
          </div>
       </div>
    </div>

    <div v-if="showShareModal" class="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
       <div class="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md p-8 shadow-2xl animate-slide-up md:animate-scale-up">
          <div class="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 md:hidden"></div>
          <h3 class="font-bold text-xl mb-4 text-dark">Kirim Undangan</h3>
          <p class="text-xs text-muted mb-6">Pesan ini akan dikirim melalui WhatsApp.</p>
          
          <div class="space-y-4">
             <div class="relative">
                <textarea v-if="loadingMessage" disabled class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 h-40 text-sm italic">Memuat pesan template...</textarea>
                <textarea v-else v-model="shareMessage" class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none h-40 text-sm" placeholder="Tulis pesan..."></textarea>
             </div>
          </div>

          <div class="mt-8 flex gap-3">
             <button @click="showShareModal = false" class="flex-1 py-3 text-gray-400 font-bold text-sm">Batal</button>
             <button @click="sendWhatsApp" :disabled="loadingMessage" class="flex-[2] py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp text-lg"></i> Kirim WA
             </button>
          </div>
       </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import BottomNav from "@/components/dashboard/BottomNav.vue";
import { getInvitations } from "@/api/invitation";
import { getGuestsByInvitationId, createGuest, deleteGuest, getGuestShareLink } from "@/api/guest";
import { useToast } from "vue-toastification";

const toast = useToast();
const invitations = ref([]);
const selectedInvitationId = ref(null);
const guests = ref([]);
const loading = ref(false);
const showAddModal = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref("");
const isSidebarOpen = ref(window.innerWidth >= 768);

// Share Modal State
const showShareModal = ref(false);
const shareMessage = ref("");
const selectedGuestForShare = ref(null);
const loadingMessage = ref(false);

const currentInvitation = computed(() => {
   return invitations.value.find(i => i.id === selectedInvitationId.value) || null;
});

const currentInvitationSlug = computed(() => {
   return currentInvitation.value?.slug || "";
});

const newGuest = ref({
  name: "",
  group: "",
  phoneNumber: "",
});

const filteredGuests = computed(() => {
   if(!searchQuery.value) return guests.value;
   const lower = searchQuery.value.toLowerCase();
   return guests.value.filter(g => g.name.toLowerCase().includes(lower));
});

onMounted(async () => {
  await fetchInvitations();
});

watch(selectedInvitationId, async (newId) => {
   if(newId) await fetchGuests(newId);
});

async function fetchInvitations() {
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
}

async function fetchGuests(invId) {
   loading.value = true;
   try {
      const res = await getGuestsByInvitationId(invId);
      guests.value = Array.isArray(res) ? res : (res.data || []);
   } catch (e) {
      toast.error("Gagal memuat tamu");
   } finally {
      loading.value = false;
   }
}

async function submitGuest() {
   if(!newGuest.value.name?.trim()) {
      toast.warning("Nama tamu wajib diisi");
      return;
   }
   
   if (newGuest.value.phoneNumber) {
      const phoneRegex = /^(\+62|62|08)[0-9]{6,15}$/; 
      if (!phoneRegex.test(newGuest.value.phoneNumber)) {
         toast.warning("Nomor HP tidak valid. Gunakan format 08... atau 62...");
         return;
      }
   }

   isSubmitting.value = true;
   try {
      await createGuest({
         ...newGuest.value,
         invitationId: selectedInvitationId.value
      });
      toast.success("Tamu berhasil ditambahkan");
      showAddModal.value = false;
      newGuest.value = { name: "", group: "", phoneNumber: "" };
      await fetchGuests(selectedInvitationId.value);
   } catch (e) {
      toast.error("Gagal menambah tamu");
   } finally {
      isSubmitting.value = false;
   }
}

async function deleteGuestHandler(id) {
   if(!confirm("Yakin hapus tamu ini?")) return;
   try {
      await deleteGuest(id);
      toast.success("Tamu dihapus");
      await fetchGuests(selectedInvitationId.value);
   } catch(e) {
      toast.error("Gagal hapus");
   }
}

async function openShareModal(guest) {
  if (!currentInvitation.value?.isPublished) {
    toast.warning("Undangan belum dipublikasikan");
    return;
  }

  selectedGuestForShare.value = guest;
  showShareModal.value = true;
  loadingMessage.value = true;
  shareMessage.value = "";

  try {
    const response = await getGuestShareLink(guest.id);
    const data = response?.data || response;
    
    if (data?.message) {
      shareMessage.value = data.message;
    } else {
      const url = data?.url || '';
      const name = guest.name?.split(' ')[0] || 'Teman';
      shareMessage.value = `Hai ${name}! Ini undangan pernikahan kami.\nKlik untuk lihat: ${url}`;
    }
  } catch (error) {
    console.error("Failed to load share message:", error);
    toast.error("Gagal memuat pesan template");
    shareMessage.value = `Halo ${guest.name}, mohon maaf link undangan belum dapat dimuat.`;
  } finally {
    loadingMessage.value = false;
  }
}

function sendWhatsApp() {
  if (!selectedGuestForShare.value) return;

  const guest = selectedGuestForShare.value;
  const phone = (guest.phoneNumber || '').replace(/[^0-9]/g, '');
  const waNumber = phone.startsWith('0') ? `62${phone.slice(1)}` : phone;
  const encodedMessage = encodeURIComponent(shareMessage.value);
  const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;
  
  window.open(waLink, '_blank');
  showShareModal.value = false;
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
