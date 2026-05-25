<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SidebarDashboard from '@/components/dashboard/SidebarDashboard.vue'
import TopbarDashboard from '@/components/dashboard/TopbarDashboard.vue'
import BottomNav from '@/components/dashboard/BottomNav.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import {
  getAffiliateDashboard,
  getAffiliateCommissions,
  getAffiliateWithdrawals,
  submitWithdraw,
  getAffiliateProfile
} from '@/api/affiliate'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const dashboardData = ref(null)
const commissions = ref([])
const withdrawals = ref([])
const profile = ref(null)
const withdrawAmount = ref(0)
const isSubmittingWithdraw = ref(false)

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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const affiliateLink = computed(() => {
  if (!dashboardData.value?.affiliateCode) return ''
  return `${window.location.origin}?ref=${dashboardData.value.affiliateCode}`
})

const hasPendingWithdrawal = computed(() => {
  return withdrawals.value.some((w) => w.status === 'pending')
})

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Disalin ke clipboard!')
  } catch {
    toast.error('Gagal menyalin')
  }
}

const fetchDashboard = async () => {
  try {
    const data = await getAffiliateDashboard()
    dashboardData.value = data
  } catch (err) {
    if (err.status === 404) {
      router.push('/affiliate/register')
      throw err
    } else {
      toast.error('Gagal memuat dashboard')
      throw err
    }
  }
}

const fetchCommissions = async () => {
  try {
    const res = await getAffiliateCommissions({ page: 1, limit: 10 })
    commissions.value = res.data
  } catch (err) {
    console.error('Gagal memuat komisi', err)
  }
}

const fetchWithdrawals = async () => {
  try {
    const res = await getAffiliateWithdrawals()
    withdrawals.value = res.data
  } catch (err) {
    console.error('Gagal memuat riwayat penarikan', err)
  }
}

const fetchProfile = async () => {
  try {
    profile.value = await getAffiliateProfile()
  } catch (err) {
    console.error('Gagal memuat profil', err)
  }
}

const handleWithdraw = async () => {
  if (withdrawAmount.value < 100000) {
    toast.warning('Minimal penarikan adalah Rp 100.000')
    return
  }

  const result = await Swal.fire({
    title: 'Konfirmasi Penarikan',
    text: `Apakah Anda yakin ingin menarik dana sebesar ${formatCurrency(withdrawAmount.value)} ke rekening ${profile.value?.bankName} - ${profile.value?.bankAccountNumber}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Tarik Dana',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#3B82F6'
  })

  if (result.isConfirmed) {
    isSubmittingWithdraw.value = true
    try {
      await submitWithdraw({ amount: withdrawAmount.value })
      toast.success('Permintaan penarikan berhasil dikirim!')
      withdrawAmount.value = 0
      await Promise.all([fetchDashboard(), fetchWithdrawals()])
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim permintaan penarikan')
    } finally {
      isSubmittingWithdraw.value = false
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await fetchDashboard()
    await Promise.allSettled([
      fetchCommissions(),
      fetchWithdrawals(),
      fetchProfile()
    ])
  } catch (err) {
    // Expected on 404
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <SidebarDashboard />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <TopbarDashboard title="Dashboard Reseller" />

      <main class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="dashboardData" class="space-y-6 max-w-7xl mx-auto">
          <!-- Balance Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Tersedia (Cleared)"
              :value="formatCurrency(dashboardData.balance.availableToWithdraw)"
              icon="💰"
              color="text-green-600"
            />
            <StatCard
              label="Tertunda (Pending)"
              :value="formatCurrency(dashboardData.balance.pending)"
              icon="⏳"
              color="text-amber-600"
            />
            <StatCard
              label="Sudah Ditarik"
              :value="formatCurrency(dashboardData.balance.withdrawn)"
              icon="📤"
              color="text-blue-600"
            />
            <StatCard
              label="Total Penjualan"
              :value="dashboardData.tier.totalSales.toString()"
              icon="📈"
              color="text-indigo-600"
            />
          </div>

          <!-- Affiliate Link & Tier Info -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Affiliate Code Card -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Link Afiliasi Anda</h3>
              <div class="space-y-4">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 break-all text-sm font-mono text-slate-600">
                  {{ affiliateLink }}
                </div>
                <div class="flex gap-2">
                  <button
                    @click="copyToClipboard(affiliateLink)"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    Salin Link
                  </button>
                  <button
                    @click="copyToClipboard(dashboardData.affiliateCode)"
                    class="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-xl transition-all"
                  >
                    Salin Kode: {{ dashboardData.affiliateCode }}
                  </button>
                </div>
                <p class="text-xs text-slate-500 italic">
                  * Bagikan link atau kode ini. Setiap pembelian yang menggunakan kode Anda akan memberikan komisi otomatis.
                </p>
              </div>
            </div>

            <!-- Tier Progress Card -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-bold text-slate-800">Status Tier: <span class="capitalize text-blue-600">{{ dashboardData.tier.current }}</span></h3>
                <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {{ dashboardData.tier.current }}
                </span>
              </div>
              
              <div v-if="dashboardData.tier.nextTier" class="space-y-4">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-slate-600">Progres ke Tier {{ dashboardData.tier.nextTier }}</span>
                  <span class="font-bold text-slate-800">{{ dashboardData.tier.totalSales }} / {{ dashboardData.tier.nextTierMinSales }} Penjualan</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    :style="{ width: `${Math.min(100, (dashboardData.tier.totalSales / dashboardData.tier.nextTierMinSales) * 100)}%` }"
                  ></div>
                </div>
                <p class="text-sm text-slate-600">
                  Butuh <span class="font-bold text-blue-600">{{ dashboardData.tier.salesNeededForNextTier }}</span> penjualan lagi untuk naik ke tier <span class="capitalize font-bold">{{ dashboardData.tier.nextTier }}</span> dan mendapatkan rate komisi lebih tinggi!
                </p>
              </div>
              <div v-else class="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <p class="text-sm text-yellow-800 font-medium">
                  🎉 Anda telah mencapai Tier tertinggi ({{ dashboardData.tier.current.toUpperCase() }}). Terus tingkatkan penjualan Anda!
                </p>
              </div>
            </div>
          </div>

          <!-- Commission History Table -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 class="text-lg font-bold text-slate-800">Riwayat Komisi Terakhir</h3>
              <router-link to="#" class="text-blue-600 text-sm font-semibold hover:underline">Lihat Semua</router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th class="px-6 py-4 font-semibold">Pembeli</th>
                    <th class="px-6 py-4 font-semibold text-right">Nilai Transaksi</th>
                    <th class="px-6 py-4 font-semibold text-right">Komisi</th>
                    <th class="px-6 py-4 font-semibold">Status</th>
                    <th class="px-6 py-4 font-semibold">Tanggal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="item in commissions" :key="item.id" class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-medium text-slate-800">{{ item.buyerName }}</div>
                      <div class="text-xs text-slate-400 capitalize">{{ item.tier }} Tier</div>
                    </td>
                    <td class="px-6 py-4 text-right font-medium text-slate-600">
                      {{ formatCurrency(item.grossAmount) }}
                    </td>
                    <td class="px-6 py-4 text-right font-bold text-blue-600">
                      {{ formatCurrency(item.commissionAmount) }}
                    </td>
                    <td class="px-6 py-4">
                      <span 
                        class="px-2.5 py-1 rounded-lg text-xs font-bold"
                        :class="{
                          'bg-amber-100 text-amber-700': item.status === 'pending',
                          'bg-green-100 text-green-700': item.status === 'cleared',
                          'bg-blue-100 text-blue-700': item.status === 'withdrawn',
                          'bg-red-100 text-red-700': item.status === 'reversed'
                        }"
                      >
                        {{ item.status === 'pending' ? 'Tertunda' : item.status === 'cleared' ? 'Siap Cair' : item.status === 'withdrawn' ? 'Ditarik' : 'Batal' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">
                      {{ formatDate(item.createdAt) }}
                    </td>
                  </tr>
                  <tr v-if="commissions.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                      Belum ada riwayat komisi.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Withdrawal Section -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Withdraw Form -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Tarik Dana</h3>
              
              <div v-if="hasPendingWithdrawal" class="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                <p class="text-sm text-amber-800">
                  ⚠️ Anda memiliki permintaan penarikan yang sedang diproses. Mohon tunggu hingga selesai sebelum mengajukan kembali.
                </p>
              </div>
              
              <div v-else class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Nominal Penarikan</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input 
                      v-model.number="withdrawAmount"
                      type="number"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Min. 100.000"
                    />
                  </div>
                  <div class="flex justify-between mt-2 text-xs text-slate-500">
                    <span>Minimal Rp 100.000</span>
                    <button 
                      @click="withdrawAmount = dashboardData.balance.availableToWithdraw"
                      class="text-blue-600 font-bold hover:underline"
                    >
                      Tarik Semua
                    </button>
                  </div>
                </div>

                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Rekening Tujuan</p>
                  <div v-if="profile" class="text-sm">
                    <div class="font-bold text-slate-800">{{ profile.bankName }}</div>
                    <div class="text-slate-600">{{ profile.bankAccountNumber }}</div>
                    <div class="text-slate-600">a.n. {{ profile.bankAccountName }}</div>
                  </div>
                  <router-link to="/dashboard/settings" class="text-xs text-blue-600 font-bold hover:underline inline-block mt-2">
                    Ubah Rekening
                  </router-link>
                </div>

                <button 
                  @click="handleWithdraw"
                  :disabled="isSubmittingWithdraw || withdrawAmount < 100000 || withdrawAmount > dashboardData.balance.availableToWithdraw"
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100"
                >
                  {{ isSubmittingWithdraw ? 'Memproses...' : 'Ajukan Penarikan' }}
                </button>
              </div>
            </div>

            <!-- Withdrawal History -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div class="p-6 border-b border-slate-50">
                <h3 class="text-lg font-bold text-slate-800">Riwayat Penarikan Dana</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                    <tr>
                      <th class="px-6 py-4 font-semibold">Nominal</th>
                      <th class="px-6 py-4 font-semibold">Status</th>
                      <th class="px-6 py-4 font-semibold">Tanggal</th>
                      <th class="px-6 py-4 font-semibold">Catatan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-for="w in withdrawals" :key="w.id" class="hover:bg-slate-50 transition-colors">
                      <td class="px-6 py-4 font-bold text-slate-800">
                        {{ formatCurrency(w.requestedAmount) }}
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
                      <td class="px-6 py-4 text-slate-500">
                        {{ formatDate(w.createdAt) }}
                      </td>
                      <td class="px-6 py-4 text-slate-500 max-w-xs truncate">
                        {{ w.adminNote || '—' }}
                      </td>
                    </tr>
                    <tr v-if="withdrawals.length === 0">
                      <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">
                        Belum ada riwayat penarikan.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
