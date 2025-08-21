<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Topbar title="Templates" />
      <main class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
        <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow p-4">
          <div class="h-40 bg-gray-200 rounded-md mb-3"></div>
          <h3 class="font-medium">Template {{ n }}</h3>
          <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Use Template
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
</script>
