<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <div class="flex-1 flex flex-col">
      <Topbar title="Dashboard" showButton />

      <main class="p-6 space-y-6 overflow-y-auto">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Invitations" :value="stats.total" />
          <StatCard label="Active" :value="stats.active" />
          <StatCard label="Guest Responses" :value="stats.responses" />
        </div>

        <!-- Table -->
        <div v-if="loading" class="text-center py-10 text-gray-500">Memuat data...</div>
        <InvitationsTable v-else :invitations="invitations" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import StatCard from "@/components/dashboard/StatCard.vue";
import InvitationsTable from "@/components/dashboard/InvitationsTable.vue";
import { getInvitations } from "@/api/invitation";
import { useToast } from "vue-toastification";

const toast = useToast();
const invitations = ref([]);
const loading = ref(true);

const stats = computed(() => {
  const total = invitations.value.length;
  const active = invitations.value.filter(i => i.isActive).length; // Assumes isActive boolean or string
  // Guest responses would ideally come from a separate API or included in the invitation object
  const responses = 0; 
  return { total, active, responses };
});

onMounted(async () => {
  try {
    const res = await getInvitations();
    // Handle both array response or { data: [] } response structure
    invitations.value = Array.isArray(res) ? res : (res.data || []);
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat data dashboard");
  } finally {
    loading.value = false;
  }
});
</script>
