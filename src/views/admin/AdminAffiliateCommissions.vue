<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { getAdminCommissions } from '@/api/adminAffiliate'
import { useToast } from 'vue-toastification'

const toast = useToast()
const rows = ref([])
const total = ref(0)
const summary = ref(null)
const ledgerNote = ref('')
const page = ref(1)
const limit = 20
const status = ref('')
const loading = ref(false)

const headers = [
  { label: 'Reseller', key: 'reseller' },
  { label: 'Pembeli / order', key: 'buyer' },
  { label: 'Nilai transaksi', key: 'grossAmount', class: 'text-right' },
  { label: 'Komisi snapshot', key: 'commissionAmount', class: 'text-right' },
  { label: 'Status saldo', key: 'status' },
]

const statusExplanation = computed(() => ({
  pending: 'Menunggu periode clearing.',
  cleared: 'Sudah melewati periode clearing dan tersedia sesuai aturan saldo.',
  reversed: 'Komisi dibalikkan.',
}))

async function fetchRows() {
  loading.value = true
  try {
    const response = await getAdminCommissions({
      page: page.value,
      limit,
      ...(status.value ? { status: status.value } : {}),
    })
    rows.value = response.data || []
    total.value = response.total || 0
    summary.value = response.summary || null
    ledgerNote.value = response.note || ''
  } catch {
    toast.error('Gagal memuat ledger komisi reseller')
  } finally {
    loading.value = false
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('id-ID') : '—'
}

watch(status, () => {
  page.value = 1
  fetchRows()
})
onMounted(fetchRows)
</script>

<template>
  <AdminShell
    title="Ledger Komisi Reseller"
    description="Baris ledger tersimpan ketika settlement terverifikasi. Status payment ditampilkan saat ini karena payment bisa berubah setelah settlement; payment.commissionCredited tidak dipakai sebagai bukti kredit."
  >
    <div
      class="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950"
    >
      <div>
        <p class="font-semibold">Ledger hanya menampilkan komisi yang tercatat.</p>
        <p class="mt-1 text-blue-800">
          Komisi yang dilewati karena reseller nonaktif atau alasan lain tidak memiliki baris
          historis terstruktur. Status payment saja tidak berarti komisi dibayar.
        </p>
      </div>
      <label class="flex items-center gap-2">
        <span class="font-medium">Status</span>
        <select
          v-model="status"
          class="min-h-10 rounded-lg border border-blue-200 bg-white px-3 text-sm"
        >
          <option value="">Semua status</option>
          <option value="pending">Pending</option>
          <option value="cleared">Cleared</option>
          <option value="reversed">Reversed</option>
        </select>
      </label>
    </div>
    <div v-if="summary" class="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <div
        v-for="card in [
          { label: 'Komisi pending', value: summary.pendingCommissions },
          { label: 'Komisi cleared', value: summary.clearedCommissions },
          { label: 'Payout disetujui', value: summary.approvedWithdrawals },
          { label: 'Payout pending', value: summary.pendingWithdrawals },
          { label: 'Tersedia setelah payout', value: summary.availableAfterApprovedWithdrawals },
        ]"
        :key="card.label"
        class="rounded-xl border border-slate-200 bg-white p-4"
      >
        <div class="text-xs text-slate-500">{{ card.label }}</div>
        <div class="mt-1 font-bold text-slate-900">{{ formatCurrency(card.value) }}</div>
      </div>
    </div>
    <p v-if="summary" class="mb-5 text-xs text-slate-500">{{ summary.reconciliationNote }}</p>
    <p v-if="ledgerNote" class="mb-5 text-xs text-slate-500">{{ ledgerNote }}</p>
    <DataTable
      :headers="headers"
      :items="rows"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="fetchRows"
    >
      <template #cell(reseller)="{ item }">
        <div class="font-semibold text-slate-800">{{ item.reseller }}</div>
        <div class="font-mono text-xs text-slate-500">
          {{ item.resellerCode }} · {{ item.tierAtTime }} ·
          {{ (Number(item.commissionRate) * 100).toFixed(2) }}%
        </div>
      </template>
      <template #cell(buyer)="{ item }">
        <div>{{ item.buyer }}</div>
        <div class="font-mono text-xs text-slate-500">{{ item.orderId }}</div>
        <div class="text-xs text-slate-400">
          Payment {{ item.paymentStatus }} · {{ formatDate(item.settledAt) }}
        </div>
      </template>
      <template #cell(grossAmount)="{ item }">
        <span>{{ formatCurrency(item.grossAmount) }}</span>
      </template>
      <template #cell(commissionAmount)="{ item }">
        <div class="font-semibold">{{ formatCurrency(item.commissionAmount) }}</div>
        <div class="text-xs text-slate-500">
          {{ item.tierAtTime }} @ {{ (Number(item.commissionRate) * 100).toFixed(2) }}%
        </div>
      </template>
      <template #cell(status)="{ item }">
        <div class="font-semibold capitalize">{{ item.status }}</div>
        <div class="max-w-52 text-xs text-slate-500">
          {{ statusExplanation[item.status] || item.note || 'Tidak ada catatan status.' }}
        </div>
      </template>
    </DataTable>
  </AdminShell>
</template>
