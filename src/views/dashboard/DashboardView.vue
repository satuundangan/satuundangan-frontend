<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <div class="flex-1 flex flex-col">
      <Topbar title="Dashboard" showButton />

      <main class="p-6 space-y-6 overflow-y-auto">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Invitations" :value="24" />
          <StatCard label="Active" :value="18" />
          <StatCard label="Guest Responses" :value="120" />
        </div>

        <!-- Table -->
        <InvitationsTable :invitations="invitations" />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import StatCard from "@/components/dashboard/StatCard.vue";
import InvitationsTable from "@/components/dashboard/InvitationsTable.vue";

const invitations = [
  { id: 1, title: "Andi & Siti Wedding", status: "Active", date: "2025-09-12" },
  { id: 2, title: "Birthday - Fikri", status: "Draft", date: "2025-10-02" },
];
</script>
