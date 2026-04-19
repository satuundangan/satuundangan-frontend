<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />

    <div class="flex-1 flex flex-col ml-64 transition-all duration-300">
      <Topbar title="Daftar Tamu" />

      <main class="p-8 flex-1 overflow-y-auto">
        
        <!-- Invitation Selector (if multiple) -->
        <div class="mb-6 flex justify-between items-center">
           <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-500">Pilih Undangan:</label>
              <select v-model="selectedInvitationId" class="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-mocha">
                 <option v-for="inv in invitations" :key="inv.id" :value="inv.id">{{ inv.title }}</option>
              </select>
           </div>
           
           <button @click="showAddModal = true" :disabled="!selectedInvitationId" class="bg-mocha text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-mocha/90 flex items-center gap-2 shadow-lg shadow-mocha/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <span>+</span> Tambah Tamu
           </button>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
           <div class="animate-spin text-mocha text-2xl">⏳</div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 class="font-bold text-dark text-sm">Total Tamu: {{ guests.length }}</h3>
              <div class="flex gap-2">
                 <input v-model="searchQuery" type="text" placeholder="Cari nama..." class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-mocha">
              </div>
           </div>

           <table class="w-full text-left text-sm">
             <thead class="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
               <tr>
                 <th class="px-6 py-4">Nama Tamu</th>
                 <th class="px-6 py-4">Kategori</th>
                 <th class="px-6 py-4">Link Undangan</th>
                 <th class="px-6 py-4">Status Kirim</th>
                 <th class="px-6 py-4">Status RSVP</th>
                 <th class="px-6 py-4 text-right">Aksi</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
               <tr v-for="guest in filteredGuests" :key="guest.id" class="hover:bg-gray-50/50 transition-colors">
                 <td class="px-6 py-4 font-medium text-dark">{{ guest.name }}</td>
                 <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase">{{ guest.group || 'Umum' }}</span>
                 </td>
                 <td class="px-6 py-4">
                    <a v-if="currentInvitation?.isPublished" :href="`/${currentInvitationSlug}?to=${encodeURIComponent(guest.name)}`" target="_blank" class="text-blue-500 hover:text-blue-700 underline text-xs">
                       Lihat Undangan
                    </a>
                    <span v-else class="text-xs text-gray-400">Belum dipublikasikan</span>
                 </td>
                 <td class="px-6 py-4">
                    <span :class="guest.statusSend === 'sent' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'" class="px-2 py-1 rounded-md text-[10px] font-bold border uppercase">
                       {{ guest.statusSend === 'sent' ? 'Terkirim' : 'Belum' }}
                    </span>
                 </td>
                 <td class="px-6 py-4">
                    <span v-if="guest.rsvpStatus === 'hadir'" class="text-green-600 font-bold text-xs">✅ Hadir</span>
                    <span v-else-if="guest.rsvpStatus === 'tidak'" class="text-red-500 font-bold text-xs">❌ Tidak</span>
                    <span v-else class="text-gray-400 text-xs italic">Menunggu</span>
                 </td>
                 <td class="px-6 py-4 text-right flex justify-end gap-2">
                    <button @click="openShareModal(guest)" :disabled="!currentInvitation?.isPublished" :class="currentInvitation?.isPublished ? 'text-green-500 hover:text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100 cursor-not-allowed'" class="p-2 rounded-lg transition" title="Kirim WA">
                       <i class="fa-brands fa-whatsapp text-lg"></i>
                    </button>
                    <button @click="deleteGuestHandler(guest.id)" class="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition" title="Hapus">
                       <i class="fa-solid fa-trash text-sm"></i>
                    </button>
                 </td>
               </tr>
               <tr v-if="filteredGuests.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center text-gray-400 italic">Belum ada tamu yang ditambahkan.</td>
               </tr>
             </tbody>
           </table>
        </div>
      </main>
    </div>

    <!-- Add Guest Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
       <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
          <h3 class="font-bold text-lg mb-4 text-mocha">Tambah Tamu Baru</h3>
          
          <div class="space-y-3">
             <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Nama Tamu</label>
                <input v-model="newGuest.name" type="text" class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-mocha focus:border-mocha outline-none" placeholder="Contoh: Budi Santoso">
             </div>
             <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Kategori (Opsional)</label>
                <select v-model="newGuest.group" class="w-full border border-gray-300 rounded-lg p-2 mt-1 bg-white">
                   <option value="Keluarga">Keluarga</option>
                   <option value="Teman Kantor">Teman Kantor</option>
                   <option value="Teman Sekolah">Teman Sekolah</option>
                   <option value="VIP">VIP</option>
                   <option value="">Umum</option>
                </select>
             </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase">No. WhatsApp (Opsional)</label>
                <input v-model="newGuest.phoneNumber" type="text" class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-mocha focus:border-mocha outline-none" placeholder="0812...">
             </div>
          </div>

          <div class="mt-6 flex gap-3 justify-end">
             <button @click="showAddModal = false" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Batal</button>
             <button @click="submitGuest" :disabled="isSubmitting" class="px-4 py-2 bg-mocha text-white rounded-lg text-sm font-medium hover:bg-mocha/90 disabled:opacity-50">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
             </button>
          </div>
       </div>
    </div>

    <!-- Share / WhatsApp Modal -->
    <div v-if="showShareModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
       <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
          <h3 class="font-bold text-lg mb-4 text-mocha">Kirim Undangan via WhatsApp</h3>
          
          <div class="space-y-3">
             <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Pesan WhatsApp</label>
                <textarea v-if="loadingMessage" disabled class="w-full border border-gray-300 rounded-lg p-2 mt-1 bg-gray-50 h-32 text-sm italic">Memuat pesan template...</textarea>
                <textarea v-else v-model="shareMessage" class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-mocha focus:border-mocha outline-none h-32 text-sm" placeholder="Tulis pesan..."></textarea>
                <p class="text-xs text-gray-400 mt-1">Anda bisa mengedit pesan ini sebelum dikirim.</p>
             </div>
          </div>

          <div class="mt-6 flex gap-3 justify-end">
             <button @click="showShareModal = false" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Batal</button>
             <button @click="sendWhatsApp" :disabled="loadingMessage" class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center gap-2">
                <i class="fa-brands fa-whatsapp"></i> Kirim Sekarang
             </button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
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
   
   // Phone Number Strict Validation (Optional but strict if filled)
   if (newGuest.value.phoneNumber) {
      // Regex: Allow +62, 62, or 08 followed by digits. 
      // User-friendly check.
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
    // Backend returns { waLink, url, message } potentially wrapped in { data: ... }
    const data = response?.data || response;
    
    if (data?.message) {
      shareMessage.value = data.message;
    } else {
      // Fallback message if API doesn't return one
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
  
  // Format phone number to 62...
  const waNumber = phone.startsWith('0')
    ? `62${phone.slice(1)}`
    : phone.startsWith('62')
      ? phone
      : phone;

  const encodedMessage = encodeURIComponent(shareMessage.value);
  const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;
  
  window.open(waLink, '_blank');
  showShareModal.value = false;
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
