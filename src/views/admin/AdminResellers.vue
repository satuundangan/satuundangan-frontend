<script setup>
import { ref, onMounted } from 'vue'
import SidebarDashboard from '@/components/dashboard/SidebarDashboard.vue'
import TopbarDashboard from '@/components/dashboard/TopbarDashboard.vue'
import { getAdminResellers, updateResellerStatus } from '@/api/adminAffiliate'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const resellers = ref([])
const total = ref(0)
const loading = ref(true)
const page = ref(1)
const search = ref('')

const fetchResellers = async () => {
  loading.value = true
  try {
    const res = await getAdminResellers({ page: page.value, limit: 10, search: search.value })
    resellers.value = res.data
    total.value = res.total
  } catch (err) {
    toast.error('Gagal memuat data reseller')
  } finally {
    loading.value = false
  }
}

const handleUpdateStatus = async (reseller, newStatus) => {
  const actionText = newStatus === 'active' ? 'Mengaktifkan' : newStatus === 'suspended' ? 'Menonaktifkan sementara' : 'Memasukkan ke daftar hitam'
  
  const result = await Swal.fire({
    title: 'Konfirmasi',
    text: `Apakah Anda yakin ingin ${actionText} reseller ${reseller.user?.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      await updateResellerStatus(reseller.id, newStatus)
      toast.success('Status berhasil diperbarui')
      fetchResellers()
    } catch (err) {
      toast.error('Gagal memperbarui status')
    }
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

onMounted(fetchResellers)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <SidebarDashboard />

    <div class="flex-1 flex flex-col min-w-0">
      <TopbarDashboard title="Manajemen Reseller" />

      <main class="p-6">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 class="text-lg font-bold text-slate-800">Daftar Semua Reseller</h3>
            <div class="flex gap-2">
              <input 
                v-model="search" 
                @keyup.enter="fetchResellers"
                type="text" 
                placeholder="Cari nama atau kode..."
                class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button @click="fetchResellers" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Cari</button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                <tr>
                  <th class="px-6 py-4 font-semibold">Reseller</th>
                  <th class="px-6 py-4 font-semibold text-right">Penjualan</th>
                  <th class="px-6 py-4 font-semibold text-right">Saldo</th>
                  <th class="px-6 py-4 font-semibold">Tier</th>
                  <th class="px-6 py-4 font-semibold">Status</th>
                  <th class="px-6 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                  <td colspan="6" class="px-6 py-4 h-16 bg-slate-50/50"></td>
                </tr>
                <tr v-for="r in resellers" :key="r.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-bold text-slate-800">{{ r.user?.name }}</div>
                    <div class="text-xs text-slate-400 font-mono">{{ r.affiliateCode }}</div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="font-medium text-slate-700">{{ r.totalSales }} Penjualan</div>
                    <div class="text-xs text-slate-400">{{ formatCurrency(r.totalSalesAmount) }}</div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="font-bold text-blue-600">{{ formatCurrency(r.commissionBalance) }}</div>
                    <div class="text-xs text-slate-400">Total: {{ formatCurrency(r.totalEarned) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="capitalize px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                      {{ r.tier }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2.5 py-1 rounded-lg text-xs font-bold"
                      :class="{
                        'bg-green-100 text-green-700': r.status === 'active',
                        'bg-amber-100 text-amber-700': r.status === 'suspended',
                        'bg-red-100 text-red-700': r.status === 'blacklisted'
                      }"
                    >
                      {{ r.status === 'active' ? 'Aktif' : r.status === 'suspended' ? 'Suspended' : 'Blacklist' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button 
                        v-if="r.status !== 'active'"
                        @click="handleUpdateStatus(r, 'active')"
                        class="text-xs font-bold text-green-600 hover:underline"
                      >
                        Aktifkan
                      </button>
                      <button 
                        v-if="r.status === 'active'"
                        @click="handleUpdateStatus(r, 'suspended')"
                        class="text-xs font-bold text-amber-600 hover:underline"
                      >
                        Suspend
                      </button>
                      <button 
                        v-if="r.status !== 'blacklisted'"
                        @click="handleUpdateStatus(r, 'blacklisted')"
                        class="text-xs font-bold text-red-600 hover:underline"
                      >
                        Blacklist
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!loading && resellers.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                    Tidak ada reseller ditemukan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-2">
            <button 
              :disabled="page === 1"
              @click="page--; fetchResellers()"
              class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              :disabled="resellers.length < 10"
              @click="page++; fetchResellers()"
              class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
