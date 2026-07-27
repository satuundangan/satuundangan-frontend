<template>
  <AdminShell title="Dashboard" description="Ringkasan aktivitas dan metrik platform"> 
    <!-- Dashboard Stats Grid -->
    <section class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300"
      >
        <div class="space-y-1">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
          <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stat.value }}</p>
        </div>
        <div :class="[stat.color, 'h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-inner']">
          <i :class="['fa-solid', stat.icon]"></i>
        </div>
      </div>
    </section>

    <!-- Recent Activity Layout -->
    <section class="mt-8 grid grid-cols-1 gap-6">
      <div class="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-clock-rotate-left text-slate-400"></i>
            Undangan Terbaru
          </h2>
          <RouterLink to="/admin/invitations" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Lihat semua</RouterLink>
        </div>
        <div class="p-6">
          <DataTable
            :value="recentInvitations"
            class="p-datatable-sm"
            dataKey="id"
          >
            <template #empty> Tidak ada undangan terbaru. </template>
            
            <Column field="title" header="Judul Undangan" style="min-width: 15rem">
              <template #body="{ data }">
                <span class="font-bold text-slate-900">{{ data.title }}</span>
              </template>
            </Column>

            <Column field="slug" header="Link / Slug" style="min-width: 12rem">
              <template #body="{ data }">
                <span class="font-mono text-xs text-slate-500">/preview?slug={{ data.slug }}</span>
              </template>
            </Column>

            <Column field="user" header="Pemilik" style="min-width: 12rem">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-700">{{ data.user?.name || '-' }}</span>
                  <span class="text-[10px] text-slate-400">{{ data.user?.email || '' }}</span>
                </div>
              </template>
            </Column>

            <Column header="Aksi" headerClass="text-right" bodyClass="text-right">
              <template #body="{ data }">
                <div class="flex justify-end gap-1.5">
                  <a :href="`/preview?slug=${data.slug}`" target="_blank"
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Lihat Undangan">
                    <i class="fa-solid fa-eye text-xs"></i>
                  </a>
                  <RouterLink :to="`/admin/invitations/${data.id}/edit`"
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-100 text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Edit Undangan">
                    <i class="fa-solid fa-pencil text-xs"></i>
                  </RouterLink>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </section>
  </AdminShell>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {
  fetchAdminUsers,
  fetchAdminInvitations,
  fetchAdminGuests,
  fetchAdminTemplates,
} from '@/api/admin.js'
import { getAdminResellers, getAdminWithdrawals } from '@/api/adminAffiliate.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const stats = ref([
  { label: 'Total Pengguna', value: 0, icon: 'fa-users', color: 'bg-blue-50 text-blue-600' },
  { label: 'Total Undangan', value: 0, icon: 'fa-envelope', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Total Tamu', value: 0, icon: 'fa-address-book', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Template Desain', value: 0, icon: 'fa-palette', color: 'bg-pink-50 text-pink-600' },
  { label: 'Reseller Aktif', value: 0, icon: 'fa-handshake', color: 'bg-orange-50 text-orange-600' },
  { label: 'Penarikan Pending', value: 0, icon: 'fa-clock', color: 'bg-rose-50 text-rose-600' },
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

    let resellersCount = 0
    let withdrawalsCount = 0

    try {
      const resellersRes = await getAdminResellers({ page: 1, limit: 1 })
      resellersCount = resellersRes.total || 0
    } catch (e) {
      console.warn("Failed to fetch resellers count:", e)
    }

    try {
      const withdrawalsRes = await getAdminWithdrawals({ page: 1, limit: 1, status: 'pending' })
      withdrawalsCount = withdrawalsRes.total || 0
    } catch (e) {
      console.warn("Failed to fetch withdrawals count:", e)
    }

    stats.value = [
      { label: 'Total Pengguna', value: users.total || 0, icon: 'fa-users', color: 'bg-blue-50 text-blue-600' },
      { label: 'Total Undangan', value: invitations.total || 0, icon: 'fa-envelope', color: 'bg-indigo-50 text-indigo-600' },
      { label: 'Total Tamu', value: guests.total || 0, icon: 'fa-address-book', color: 'bg-emerald-50 text-emerald-600' },
      { label: 'Template Desain', value: templates.total || 0, icon: 'fa-palette', color: 'bg-pink-50 text-pink-600' },
      { label: 'Reseller Aktif', value: resellersCount, icon: 'fa-handshake', color: 'bg-orange-50 text-orange-600' },
      { label: 'Penarikan Pending', value: withdrawalsCount, icon: 'fa-clock', color: 'bg-rose-50 text-rose-600' },
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
