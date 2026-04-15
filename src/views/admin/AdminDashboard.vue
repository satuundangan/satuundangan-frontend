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

    <section class="mt-8">
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
  fetchAdminTemplates,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const stats = ref([
  { label: 'Total Pengguna', value: 0 },
  { label: 'Total Undangan', value: 0 },
  { label: 'Total Tamu', value: 0 },
  { label: 'Template Tersedia', value: 0 },
])
const recentInvitations = ref([])

async function loadDashboard() {
  try {
    const [users, invitations, guests, templates] = await Promise.all([
      fetchAdminUsers({ page: 1, limit: 1 }),
      fetchAdminInvitations({ page: 1, limit: 5 }),
      fetchAdminGuests({ page: 1, limit: 1 }),
      fetchAdminTemplates({ page: 1, limit: 1 }),
    ])

    stats.value = [
      { label: 'Total Pengguna', value: users.total },
      { label: 'Total Undangan', value: invitations.total },
      { label: 'Total Tamu', value: guests.total },
      { label: 'Template Tersedia', value: templates.total },
    ]

    recentInvitations.value = invitations.data || []
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data dashboard')
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
