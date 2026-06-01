<script setup>
import { ref, onMounted } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { getAdminResellers, updateResellerStatus } from '@/api/adminAffiliate'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import { useDebounceFn } from '@vueuse/core'

const toast = useToast()
const resellers = ref([])
const total = ref(0)
const loading = ref(true)
const page = ref(1)
const search = ref('')
const limit = 10

const headers = [
  { label: 'Reseller', key: 'reseller' },
  { label: 'Penjualan', key: 'sales', class: 'text-right' },
  { label: 'Saldo', key: 'balance', class: 'text-right' },
  { label: 'Tier', key: 'tier' },
  { label: 'Status', key: 'status' },
  { label: 'Aksi', key: 'actions' },
]

const fetchResellers = async () => {
  loading.value = true
  try {
    const res = await getAdminResellers({ page: page.value, limit, search: search.value })
    resellers.value = res.data
    total.value = res.total
  } catch {
    toast.error('Gagal memuat data reseller')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  page.value = 1
  fetchResellers()
}, 300)

const handleSearch = (val) => {
  search.value = val
  debouncedSearch()
}

const setPage = (p) => {
  page.value = p
  fetchResellers()
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
    } catch {
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
  <AdminShell 
    title="Manajemen Reseller" 
    description="Kelola daftar reseller, tier, dan komisi"
    show-search
    :search="search"
    search-placeholder="Cari nama atau kode..."
    @update:search="handleSearch"
  >
    <DataTable
      :headers="headers"
      :items="resellers"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="setPage"
    >
      <template #cell(reseller)="{ item }">
        <div class="font-bold text-slate-800">{{ item.user?.name }}</div>
        <div class="text-[10px] text-slate-400 font-mono tracking-tight">{{ item.affiliateCode }}</div>
      </template>

      <template #cell(sales)="{ item }">
        <div class="text-right">
          <div class="font-medium text-slate-700">{{ item.totalSales }} Penjualan</div>
          <div class="text-[10px] text-slate-400">{{ formatCurrency(item.totalSalesAmount) }}</div>
        </div>
      </template>

      <template #cell(balance)="{ item }">
        <div class="text-right">
          <div class="font-bold text-blue-600">{{ formatCurrency(item.commissionBalance) }}</div>
          <div class="text-[10px] text-slate-400">Total: {{ formatCurrency(item.totalEarned) }}</div>
        </div>
      </template>

      <template #cell(tier)="{ item }">
        <span class="capitalize px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
          {{ item.tier }}
        </span>
      </template>

      <template #cell(status)="{ item }">
        <span 
          class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
          :class="{
            'bg-green-50 text-green-700': item.status === 'active',
            'bg-amber-50 text-amber-700': item.status === 'suspended',
            'bg-red-50 text-red-700': item.status === 'blacklisted'
          }"
        >
          {{ item.status === 'active' ? 'Aktif' : item.status === 'suspended' ? 'Suspended' : 'Blacklist' }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex gap-3">
          <button 
            v-if="item.status !== 'active'"
            @click="handleUpdateStatus(item, 'active')"
            class="text-[11px] font-black uppercase tracking-widest text-green-600 hover:text-green-700"
          >
            Aktifkan
          </button>
          <button 
            v-if="item.status === 'active'"
            @click="handleUpdateStatus(item, 'suspended')"
            class="text-[11px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700"
          >
            Suspend
          </button>
          <button 
            v-if="item.status !== 'blacklisted'"
            @click="handleUpdateStatus(item, 'blacklisted')"
            class="text-[11px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700"
          >
            Blacklist
          </button>
        </div>
      </template>
    </DataTable>
  </AdminShell>
</template>
