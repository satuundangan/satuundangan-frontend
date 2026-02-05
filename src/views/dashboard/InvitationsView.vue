<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col ml-64 transition-all duration-300">
      <Topbar title="Invitations" showButton />
      <main class="p-6 space-y-6 overflow-y-auto">
        <div v-if="loading" class="text-center py-10 text-gray-500">Memuat data...</div>
        <InvitationsTable v-else :invitations="invitations" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import InvitationsTable from "@/components/dashboard/InvitationsTable.vue";
import { getInvitations } from "@/api/invitation";
import { useToast } from "vue-toastification";

const toast = useToast();
const invitations = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await getInvitations();
    invitations.value = Array.isArray(res) ? res : (res.data || []);
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar undangan");
  } finally {
    loading.value = false;
  }
});
</script>
