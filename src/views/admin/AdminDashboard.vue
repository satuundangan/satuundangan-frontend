<template>
  <AdminShell title="Dashboard" description="Ringkasan aktivitas platform"> 
    <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-slate-500">{{ stat.label }}</p>
        <p class="mt-2 text-2xl font-semibold text-slate-900">{{ stat.value }}</p>
      </div>
    </section>

    <section class="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 class="text-base font-semibold text-slate-900">Undangan Terbaru</h2>
          <RouterLink to="/admin/invitations" class="text-sm font-medium text-slate-500 hover:text-slate-900">Lihat semua</RouterLink>
        </div>
        <div class="p-5">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-slate-500">
                <th class="pb-3 font-medium">Judul</th>
                <th class="pb-3 font-medium">Pemilik</th>
                <th class="pb-3 font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in recentInvitations" :key="inv.id" class="border-t border-slate-100">
                <td class="py-3">{{ inv.title }}</td>
                <td class="py-3">{{ inv.user?.name || '-' }}</td>
                <td class="py-3 text-slate-500">{{ inv.slug }}</td>
              </tr>
              <tr v-if="!recentInvitations.length">
                <td colspan="3" class="py-8 text-center text-slate-400">Belum ada data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 class="text-base font-semibold text-slate-900">Pesan Tamu Terbaru</h2>
          <RouterLink to="/admin/guest-messages" class="text-sm font-medium text-slate-500 hover:text-slate-900">Lihat semua</RouterLink>
        </div>
        <div class="p-5">
          <ul class="space-y-4">
            <li v-for="message in recentMessages" :key="message.id" class="rounded-lg border border-slate-100 px-4 py-3">
              <p class="text-sm font-medium text-slate-900">{{ message.guestName || 'Anonim' }}</p>
              <p class="mt-1 text-sm text-slate-600">{{ message.message }}</p>
            </li>
            <li v-if="!recentMessages.length" class="py-8 text-center text-slate-400">Belum ada data</li>
          </ul>
        </div>
      </div>
    </section>
  </AdminShell>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  fetchAdminUsers,
  fetchAdminInvitations,
  fetchAdminGuests,
  fetchAdminGuestMessages,
  fetchAdminTemplates,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const stats = ref([
  { label: 'Total Pengguna', value: 0 },
  { label: 'Total Undangan', value: 0 },
  { label: 'Total Tamu', value: 0 },
  { label: 'Pesan Tamu', value: 0 },
  { label: 'Template Tersedia', value: 0 },
])
const recentInvitations = ref([])
const recentMessages = ref([])

async function loadDashboard() {
  try {
    const [users, invitations, guests, messages, templates] = await Promise.all([
      fetchAdminUsers({ page: 1, limit: 1 }),
      fetchAdminInvitations({ page: 1, limit: 5 }),
      fetchAdminGuests({ page: 1, limit: 1 }),
      fetchAdminGuestMessages({ page: 1, limit: 5 }),
      fetchAdminTemplates({ page: 1, limit: 1 }),
    ])

    stats.value = [
      { label: 'Total Pengguna', value: users.total },
      { label: 'Total Undangan', value: invitations.total },
      { label: 'Total Tamu', value: guests.total },
      { label: 'Pesan Tamu', value: messages.total },
      { label: 'Template Tersedia', value: templates.total },
    ]

    recentInvitations.value = invitations.data || []
    recentMessages.value = messages.data || []
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data dashboard')
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
