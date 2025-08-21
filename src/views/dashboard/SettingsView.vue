<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Topbar title="Settings" />
      <main class="p-6 overflow-y-auto">
        <div class="bg-white p-6 rounded-xl shadow space-y-4 max-w-lg">
          <div>
            <label class="block text-gray-700">Full Name</label>
            <input type="text" class="w-full mt-1 p-2 border rounded-lg" placeholder="Your name" />
          </div>
          <div>
            <label class="block text-gray-700">Email</label>
            <input type="email" class="w-full mt-1 p-2 border rounded-lg" placeholder="Your email" />
          </div>
          <div>
            <label class="block text-gray-700">Password</label>
            <input type="password" class="w-full mt-1 p-2 border rounded-lg" placeholder="New password" />
          </div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Changes
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
