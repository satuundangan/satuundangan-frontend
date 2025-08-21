<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Topbar title="Guestbook" />
      <main class="p-6 overflow-y-auto">
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3">Name</th>
                <th class="px-6 py-3">Message</th>
                <th class="px-6 py-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t" v-for="guest in guests" :key="guest.id">
                <td class="px-6 py-4">{{ guest.name }}</td>
                <td class="px-6 py-4">{{ guest.message }}</td>
                <td class="px-6 py-4">{{ guest.attendance }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";

const guests = [
  { id: 1, name: "Budi", message: "Congrats!", attendance: "Yes" },
  { id: 2, name: "Sari", message: "Sorry I can’t join", attendance: "No" },
];
</script>
