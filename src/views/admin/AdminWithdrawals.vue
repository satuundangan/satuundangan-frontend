<script setup>
import { ref, onMounted } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import { getAdminWithdrawals, approveWithdrawal, rejectWithdrawal } from '@/api/adminAffiliate'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const withdrawals = ref([])
const total = ref(0)
const loading = ref(true)
const page = ref(1)
const statusFilter = ref('pending')

const fetchWithdrawals = async () => {
  loading.value = true
  try {
    const res = await getAdminWithdrawals({ 
      status: statusFilter.value, 
      page: page.value, 
      limit: 10 
    })
    withdrawals.value = res.data
    total.value = res.total
  } catch (err) {
    toast.error('Gagal memuat data penarikan')
  } finally {
    loading.value = false
  }
}

const handleApprove = async (item) => {
  const { value: formValues } = await Swal.fire({
    title: 'Setujui Penarikan',
    html:
      '<div class="text-left mb-2 text-sm text-slate-600 font-bold">Bukti Transfer (URL Gambar)</div>' +
      '<input id="swal-input1" class="swal2-input w-full" placeholder="https://...">' +
      '<div class="text-left mt-4 mb-2 text-sm text-slate-600 font-bold">Catatan Admin</div>' +
      '<textarea id="swal-input2" class="swal2-textarea w-full" placeholder="Transfer berhasil via BCA..."></textarea>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Setujui & Bayar',
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ]
    }
  })

  if (formValues) {
    try {
      await approveWithdrawal(item.id, { proofUrl: formValues[0], adminNote: formValues[1] })
      toast.success('Penarikan disetujui')
      fetchWithdrawals()
    } catch (err) {
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
      'aria-label': 'Alasan penolakan'
    },
    showCancelButton: true,
    confirmButtonText: 'Tolak',
    confirmButtonColor: '#EF4444'
  })

  if (reason) {
    try {
      await rejectWithdrawal(item.id, { adminNote: reason })
      toast.success('Penarikan ditolak')
      fetchWithdrawals()
    } catch (err) {
      toast.error('Gagal menolak penarikan')
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

const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(fetchWithdrawals)
</script>

<template>
  <AdminShell title="Antrean Penarikan Dana" description="Persetujuan dan pencairan komisi reseller">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 class="text-lg font-bold text-slate-800">Permintaan Withdraw</h3>
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button 
            @click="statusFilter = 'pending'; page = 1; fetchWithdrawals()"
            class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            :class="statusFilter === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            Pending
          </button>
          <button 
            @click="statusFilter = 'approved'; page = 1; fetchWithdrawals()"
            class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            :class="statusFilter === 'approved' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            Berhasil
          </button>
          <button 
            @click="statusFilter = 'rejected'; page = 1; fetchWithdrawals()"
            class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            :class="statusFilter === 'rejected' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            Ditolak
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-6 py-4 font-semibold">Reseller & Rekening</th>
              <th class="px-6 py-4 font-semibold text-right">Nominal</th>
              <th class="px-6 py-4 font-semibold">Tanggal</th>
              <th class="px-6 py-4 font-semibold">Status</th>
              <th class="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="5" class="px-6 py-4 h-16 bg-slate-50/50"></td>
            </tr>
            <tr v-for="w in withdrawals" :key="w.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-slate-800">{{ w.affiliateProfile?.user?.name }}</div>
                <div class="text-xs text-slate-500">
                  {{ w.affiliateProfile?.bankName }} - {{ w.affiliateProfile?.bankAccountNumber }} 
                  ({{ w.affiliateProfile?.bankAccountName }})
                </div>
              </td>
              <td class="px-6 py-4 text-right font-bold text-slate-800">
                {{ formatCurrency(w.requestedAmount) }}
              </td>
              <td class="px-6 py-4 text-slate-500">
                {{ formatDate(w.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2.5 py-1 rounded-lg text-xs font-bold"
                  :class="{
                    'bg-amber-100 text-amber-700': w.status === 'pending',
                    'bg-green-100 text-green-700': w.status === 'approved',
                    'bg-red-100 text-red-700': w.status === 'rejected'
                  }"
                >
                  {{ w.status === 'pending' ? 'Diproses' : w.status === 'approved' ? 'Berhasil' : 'Ditolak' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div v-if="w.status === 'pending'" class="flex gap-2">
                  <button @click="handleApprove(w)" class="text-xs font-bold text-green-600 hover:underline">Setujui</button>
                  <button @click="handleReject(w)" class="text-xs font-bold text-red-600 hover:underline">Tolak</button>
                </div>
                <div v-else class="text-xs text-slate-400 max-w-[150px] truncate">
                  {{ w.adminNote || 'No note' }}
                </div>
              </td>
            </tr>
            <tr v-if="!loading && withdrawals.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                Tidak ada permintaan penarikan dana.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-2">
        <button 
          :disabled="page === 1"
          @click="page--; fetchWithdrawals()"
          class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50"
        >
          Prev
        </button>
        <button 
          :disabled="withdrawals.length < 10"
          @click="page++; fetchWithdrawals()"
          class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </AdminShell>
</template>
