<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    
    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Invitations" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="p-4 md:p-8 space-y-6 overflow-y-auto">
        <!-- Header Page -->
        <div class="flex items-center justify-between">
           <div class="flex items-center gap-3">
              <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Undangan Saya</h2>
              <button @click="showHelpModal = true" class="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs hover:bg-blue-100 transition-colors" title="Cara Pakai">
                 <i class="fa-solid fa-question"></i>
              </button>
           </div>
           <router-link to="/templates" class="md:hidden w-10 h-10 rounded-xl bg-mocha text-white flex items-center justify-center shadow-lg shadow-mocha/20">
              <i class="fa-solid fa-plus"></i>
           </router-link>
           <router-link to="/templates" class="hidden md:flex items-center gap-2 px-6 py-2.5 bg-mocha text-white rounded-xl text-sm font-bold shadow-lg shadow-mocha/20">
              <i class="fa-solid fa-plus text-xs"></i> Buat Undangan
           </router-link>
        </div>

        <div v-if="loading" class="space-y-4">
           <!-- Skeleton Items -->
           <div v-for="i in 3" :key="i" class="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col md:flex-row gap-6 animate-pulse">
              <!-- Skeleton Thumbnail -->
              <div class="w-full md:w-48 h-32 bg-gray-100 rounded-2xl"></div>
              
              <!-- Skeleton Details -->
              <div class="flex-1 space-y-4 py-2">
                 <div class="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                 <div class="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                 
                 <div class="flex gap-2 pt-2">
                    <div class="h-8 bg-gray-100 rounded-lg w-20"></div>
                    <div class="h-8 bg-gray-100 rounded-lg w-20"></div>
                 </div>
              </div>
           </div>
        </div>
        
        <div v-else-if="invitations.length === 0" class="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
           <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <i class="fa-solid fa-envelope-open text-3xl"></i>
           </div>
           <h3 class="font-bold text-dark">Belum ada undangan</h3>
           <p class="text-xs text-muted mt-1 mb-6">Mulai buat undangan digital pertamamu sekarang.</p>
           <router-link to="/templates" class="inline-block bg-mocha text-white px-8 py-3 rounded-xl text-sm font-bold">
              Buat Sekarang
           </router-link>
        </div>

        <InvitationsTable 
          v-else 
          :invitations="invitations" 
          @edit="handleEdit" 
          @delete="handleDelete" 
          @preview="handlePreview" 
        />
      </main>
    </div>

    <!-- Bottom Navigation untuk Mobile -->
    <BottomNav />

    <!-- Help Modal -->
    <div v-if="showHelpModal" class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
       <div class="bg-white rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl animate-scale-up">
          <h3 class="font-bold text-2xl mb-2 text-dark">Panduan Undangan</h3>
          <p class="text-sm text-gray-500 mb-8">Kelola undangan pernikahan Anda dengan mudah.</p>
          
          <div class="space-y-6">
             <div class="flex gap-4">
                <div class="w-10 h-10 shrink-0 rounded-full bg-mocha text-white flex items-center justify-center font-bold">1</div>
                <div>
                   <h4 class="font-bold text-dark text-sm">Status Draft</h4>
                   <p class="text-xs text-gray-500 leading-relaxed">Undangan baru berstatus <b>Draft</b>. Anda bisa mengedit data, foto, dan musik sepuasnya tanpa biaya.</p>
                </div>
             </div>
             <div class="flex gap-4">
                <div class="w-10 h-10 shrink-0 rounded-full bg-mocha text-white flex items-center justify-center font-bold">2</div>
                <div>
                   <h4 class="font-bold text-dark text-sm">Publish Undangan</h4>
                   <p class="text-xs text-gray-500 leading-relaxed">Klik tombol <b>Publish</b> (icon roket) untuk memproses pembayaran. Setelah aktif, status berubah jadi <b>Published</b>.</p>
                </div>
             </div>
             <div class="flex gap-4">
                <div class="w-10 h-10 shrink-0 rounded-full bg-mocha text-white flex items-center justify-center font-bold">3</div>
                <div>
                   <h4 class="font-bold text-dark text-sm">Sebarkan</h4>
                   <p class="text-xs text-gray-500 leading-relaxed">Setelah berstatus Published, buka menu <b>Daftar Tamu</b> untuk mulai mengirimkan link undangan via WhatsApp.</p>
                </div>
             </div>
          </div>

          <div class="mt-10">
             <button @click="showHelpModal = false" class="w-full py-4 bg-mocha text-white rounded-2xl font-bold text-sm shadow-lg shadow-mocha/20">Saya Mengerti</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import InvitationsTable from "@/components/dashboard/InvitationsTable.vue";
import BottomNav from "@/components/dashboard/BottomNav.vue";
import { getInvitations, deleteInvitation } from "@/api/invitation";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const invitations = ref([]);
const loading = ref(true);
const isSidebarOpen = ref(window.innerWidth >= 768);
const showHelpModal = ref(false);

async function fetchInvitations() {
  loading.value = true;
  try {
    const res = await getInvitations();
    invitations.value = Array.isArray(res) ? res : (res.data || []);
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar undangan");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchInvitations();
});

function handleEdit(id) {
  router.push(`/invitation/${id}/edit`);
}

function handlePreview(slug) {
  window.open(`/${slug}?preview=true`, "_blank");
}

async function handleDelete(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus undangan ini?")) return;

  try {
    await deleteInvitation(id);
    toast.success("Undangan berhasil dihapus");
    await fetchInvitations();
  } catch (error) {
    console.error(error);
    toast.error("Gagal menghapus undangan: " + (error.message || "Terjadi kesalahan"));
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.2s ease-out;
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>
