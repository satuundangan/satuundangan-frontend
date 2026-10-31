<script setup>
import { ref, onMounted } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { getAdminWithdrawals, approveWithdrawal, rejectWithdrawal } from '@/api/adminAffiliate'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const withdrawals = ref([])
const total = ref(0)
const loading = ref(true)
const page = ref(1)
const limit = 10
const statusFilter = ref('pending')

const headers = [
  { label: 'Reseller & Rekening', key: 'reseller' },
  { label: 'Nominal', key: 'requestedAmount', class: 'text-right' },
  { label: 'Tanggal', key: 'createdAt' },
  { label: 'Status', key: 'status' },
  { label: 'Aksi', key: 'actions' },
]

const fetchWithdrawals = async () => {
  loading.value = true
  try {
    const res = await getAdminWithdrawals({
      status: statusFilter.value,
      page: page.value,
      limit,
    })
    withdrawals.value = res.data
    total.value = res.total
  } catch {
    toast.error('Gagal memuat data penarikan')
  } finally {
    loading.value = false
  }
}

const setPage = (p) => {
  page.value = p
  fetchWithdrawals()
}

const setStatusFilter = (status) => {
  statusFilter.value = status
  page.value = 1
  fetchWithdrawals()
}

const handleApprove = async (item) => {
  const { value: formValues } = await Swal.fire({
    title: 'Catat Transfer Selesai',
    text: 'Selesaikan transfer melalui bank terlebih dahulu. Panel ini hanya mencatat keputusan dan bukti; tidak mengirim dana.',
    html:
      '<div class="text-left mb-2 text-sm text-slate-600 font-bold">Bukti Transfer (URL Gambar)</div>' +
      '<input id="swal-input1" class="swal2-input w-full" placeholder="https://... (opsional)">' +
      '<div class="text-left mt-4 mb-2 text-sm text-slate-600 font-bold">Catatan Admin</div>' +
      '<textarea id="swal-input2" class="swal2-textarea w-full" placeholder="Referensi transfer atau catatan keputusan (wajib)"></textarea>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Catat Transfer Selesai',
    preConfirm: () => {
      const note = document.getElementById('swal-input2').value.trim()
      if (!note) {
        Swal.showValidationMessage('Catatan keputusan wajib diisi')
        return false
      }
      return [document.getElementById('swal-input1').value, note]
    },
  })

  if (formValues) {
    try {
      await approveWithdrawal(item.id, { proofUrl: formValues[0], adminNote: formValues[1] })
      toast.success('Penarikan disetujui')
      fetchWithdrawals()
    } catch {
      toast.error('Gagal menyetujui penarikan')
    }
  }
}

const handleReject = async (item) => {
  const { value: reason } = await Swal.fire({
    title: 'Tolak Penarikan',
    input: 'textarea',
    inputLabel: 'Alasan Penolakan',
    inputPlaceholder: 'Nomor rekening tidak valid...',
    inputAttributes: {
      'aria-label': 'Alasan penolakan',
    },
    showCancelButton: true,
    confirmButtonText: 'Tolak',
    confirmButtonColor: '#EF4444',
  })

  if (reason) {
    try {
      await rejectWithdrawal(item.id, { adminNote: reason })
      toast.success('Penarikan ditolak')
      fetchWithdrawals()
    } catch {
      toast.error('Gagal menolak penarikan')
    }
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatAge = (dateString) => {
  if (!dateString) return '—'
  const hours = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 3600000))
  if (hours < 24) return `${hours} jam`
  return `${Math.floor(hours / 24)} hari`
}

onMounted(fetchWithdrawals)
</script>

<template>
  <AdminShell
    title="Antrean Penarikan Dana"
    description="Catat keputusan payout reseller. Transfer dilakukan di luar panel, lalu bukti dan catatannya direkam di sini."
  >
    <div
      class="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      Menyetujui permintaan akan mengurangi saldo reseller. Pastikan transfer sudah dilakukan di
      luar panel sebelum mencatatnya sebagai selesai.
    </div>
    <div class="mb-6 flex bg-slate-100 p-1 rounded-xl w-fit">
      <button
        @click="setStatusFilter('pending')"
        class="px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
        :class="
          statusFilter === 'pending'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        "
      >
        Pending
      </button>
      <button
        @click="setStatusFilter('approved')"
        class="px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
        :class="
          statusFilter === 'approved'
            ? 'bg-white text-green-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        "
      >
        Berhasil
      </button>
      <button
        @click="setStatusFilter('rejected')"
        class="px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
        :class="
          statusFilter === 'rejected'
            ? 'bg-white text-red-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        "
      >
        Ditolak
      </button>
    </div>

    <DataTable
      :headers="headers"
      :items="withdrawals"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="setPage"
    >
      <template #cell(reseller)="{ item }">
        <div class="font-bold text-slate-800">{{ item.affiliateProfile?.user?.name }}</div>
        <div class="text-[10px] text-slate-500 leading-tight">
          {{ item.bankNameSnapshot || item.affiliateProfile?.bankName }} -
          {{ item.bankAccountNumberSnapshot || item.affiliateProfile?.bankAccountNumber }}
          <span class="opacity-60"
            >({{ item.bankAccountNameSnapshot || item.affiliateProfile?.bankAccountName }})</span
          >
          <div v-if="!item.bankAccountNumberSnapshot" class="text-amber-700">
            Rekening saat ini; snapshot belum tersedia untuk permintaan lama
          </div>
        </div>
      </template>

      <template #cell(requestedAmount)="{ item }">
        <span class="font-bold text-slate-900">{{ formatCurrency(item.requestedAmount) }}</span>
      </template>

      <template #cell(createdAt)="{ item }">
        <div class="text-slate-500 text-xs">{{ formatDate(item.createdAt) }}</div>
        <div v-if="item.status === 'pending'" class="text-[10px] text-amber-700">
          Menunggu {{ formatAge(item.createdAt) }}
        </div>
        <div v-if="item.processedAt" class="mt-1 text-[10px] text-slate-400">
          Diproses {{ formatDate(item.processedAt)
          }}<span v-if="item.processedBy?.name"> oleh {{ item.processedBy.name }}</span>
        </div>
      </template>

      <template #cell(status)="{ item }">
        <span
          class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
          :class="{
            'bg-amber-50 text-amber-700': item.status === 'pending',
            'bg-green-50 text-green-700': item.status === 'approved',
            'bg-red-50 text-red-700': item.status === 'rejected',
          }"
        >
          {{
            item.status === 'pending'
              ? 'Diproses'
              : item.status === 'approved'
                ? 'Berhasil'
                : 'Ditolak'
          }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <div v-if="item.status === 'pending'" class="flex gap-4">
          <button
            @click="handleApprove(item)"
            class="text-[11px] font-black uppercase tracking-widest text-green-600 hover:text-green-700"
          >
            Catat Selesai
          </button>
          <button
            @click="handleReject(item)"
            class="text-[11px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700"
          >
            Tolak
          </button>
        </div>
        <div
          v-else
          class="text-[10px] text-slate-500 max-w-[150px] truncate italic"
          :title="item.adminNote"
        >
          {{ item.adminNote || 'Tanpa catatan' }}
        </div>
      </template>
    </DataTable>
  </AdminShell>
</template>
