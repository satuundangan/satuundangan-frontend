<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    
    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Invitations" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="p-4 md:p-8 space-y-6 overflow-y-auto">
        <!-- Header Page -->
        <div class="flex items-center justify-between">
           <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Undangan Saya</h2>
           <router-link to="/templates" class="md:hidden w-10 h-10 rounded-xl bg-mocha text-white flex items-center justify-center shadow-lg shadow-mocha/20">
              <i class="fa-solid fa-plus"></i>
           </router-link>
           <router-link to="/templates" class="hidden md:flex items-center gap-2 px-6 py-2.5 bg-mocha text-white rounded-xl text-sm font-bold shadow-lg shadow-mocha/20">
              <i class="fa-solid fa-plus text-xs"></i> Buat Undangan
           </router-link>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-400">
           <div class="animate-spin text-3xl mb-4 text-mocha">⏳</div>
           <p class="text-sm font-medium">Memuat data...</p>
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
