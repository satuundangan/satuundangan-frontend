<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col ml-64 transition-all duration-300">
      <Topbar title="Invitations" showButton />
      <main class="p-6 space-y-6 overflow-y-auto">
        <div v-if="loading" class="text-center py-10 text-gray-500">Memuat data...</div>
        <InvitationsTable 
          v-else 
          :invitations="invitations" 
          @edit="handleEdit" 
          @delete="handleDelete" 
          @preview="handlePreview" 
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import InvitationsTable from "@/components/dashboard/InvitationsTable.vue";
import { getInvitations, deleteInvitation } from "@/api/invitation";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const invitations = ref([]);
const loading = ref(true);

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
    const res = await deleteInvitation(id);
    // As per user request: check if status is 200 or res is success
    // Usually apiFetch throws if not ok, so reaching here means it was successful
    toast.success("Undangan berhasil dihapus");
    await fetchInvitations();
  } catch (error) {
    console.error(error);
    toast.error("Gagal menghapus undangan: " + (error.message || "Terjadi kesalahan"));
  }
}
</script>
