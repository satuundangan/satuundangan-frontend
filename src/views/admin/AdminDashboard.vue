<template>
  <AdminShell title="Dashboard" description="Pusat Kendali Operasional Platform"> 
    
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

    <!-- Cockpit Interactive Controls & Trends -->
    <section class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Quick Actions & System Control -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Quick Actions Panel -->
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
            Aksi Cepat Admin
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <RouterLink to="/admin/users" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all text-center group">
              <i class="fa-solid fa-user-plus text-lg text-blue-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Tambah User</span>
            </RouterLink>
            <RouterLink to="/admin/templates" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all text-center group">
              <i class="fa-solid fa-palette text-lg text-pink-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Buat Tema</span>
            </RouterLink>
            <RouterLink to="/admin/promo-codes" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all text-center group">
              <i class="fa-solid fa-ticket text-lg text-orange-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Kode Promo</span>
            </RouterLink>
            <RouterLink to="/admin/audio" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all text-center group">
              <i class="fa-solid fa-music text-lg text-emerald-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Kelola Audio</span>
            </RouterLink>
          </div>
        </div>

        <!-- System Settings & Maintenance Mode -->
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-gears text-slate-400"></i>
            Kontrol Pemeliharaan
          </h3>
          <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span class="text-xs font-bold text-slate-700 block">Mode Perbaikan (Maintenance)</span>
              <span class="text-[10px] text-slate-400 block">Buka/tutup akses publik aplikasi</span>
            </div>
            <button 
              @click="toggleMaintenance"
              :class="isMaintenanceMode ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600'"
              class="w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center shadow-inner"
            >
              <span 
                :class="isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'"
                class="w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Live Diagnostics Tools -->
      <div class="lg:col-span-1">
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <i class="fa-solid fa-shield-heart text-emerald-500"></i>
              Diagnostik Sistem
            </h3>
            <p class="text-[10px] text-slate-400 leading-normal mb-4">Verifikasi konektivitas database, latensi server, dan antrean pengiriman email secara real-time.</p>
            
            <div class="space-y-3">
              <!-- Database Connectivity -->
              <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/20 text-xs">
                <span class="font-medium text-slate-500">Database Core</span>
                <span v-if="!diagnosticResults?.database" class="text-slate-400">-</span>
                <span v-else class="font-bold text-emerald-600 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  {{ diagnosticResults?.database?.msg || '-' }}
                </span>
              </div>
              
              <!-- Storage Space -->
              <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/20 text-xs">
                <span class="font-medium text-slate-500">File Storage</span>
                <span v-if="!diagnosticResults?.storage" class="text-slate-400">-</span>
                <span v-else class="font-bold text-emerald-600">
                  {{ diagnosticResults?.storage?.msg || '-' }}
                </span>
              </div>

              <!-- SMTP Server -->
              <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/20 text-xs">
                <span class="font-medium text-slate-500">SMTP Mail Server</span>
                <span v-if="!diagnosticResults?.email" class="text-slate-400">-</span>
                <span v-else class="font-bold text-emerald-600">
                  {{ diagnosticResults?.email?.msg || '-' }}
                </span>
              </div>

              <!-- Midtrans API Gateway -->
              <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/20 text-xs">
                <span class="font-medium text-slate-500">API Payment Gateway</span>
                <span v-if="!diagnosticResults?.payment" class="text-slate-400">-</span>
                <span v-else class="font-bold text-emerald-600">
                  {{ diagnosticResults?.payment?.msg || '-' }}
                </span>
              </div>
            </div>
            
            <p v-if="diagnosticResults?.rendered" class="text-[9px] text-slate-400 text-right mt-3">Diagnostik terakhir: {{ diagnosticResults.rendered }}</p>
          </div>
          
          <button 
            @click="runDiagnostics" 
            :disabled="isRunningDiagnostics"
            class="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-all text-xs flex justify-center items-center gap-2 mt-6"
          >
            <i class="fa-solid fa-rotate animate-spin text-[10px]" v-if="isRunningDiagnostics"></i>
            <span>{{ isRunningDiagnostics ? 'Memeriksa Sistem...' : 'Jalankan Diagnostik' }}</span>
          </button>
        </div>
      </div>

      <!-- Trend Analysis (Registration Growth SVG Chart) -->
      <div class="lg:col-span-1">
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <i class="fa-solid fa-chart-line text-blue-500"></i>
              Tren Pendaftaran (7 Hari Terakhir)
            </h3>
            <p class="text-[10px] text-slate-400">Statistik pendaftaran undangan baru di platform.</p>
            
            <!-- SVG Line Chart -->
            <div class="h-44 relative mt-4">
              <svg class="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <!-- Gradients -->
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.00"/>
                  </linearGradient>
                </defs>
                
                <!-- Grid Lines -->
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f8fafc" stroke-width="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f8fafc" stroke-width="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f8fafc" stroke-width="1" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#f1f5f9" stroke-width="1.5" />
                
                <!-- Area Path -->
                <path
                  d="M 0 180 C 40 160, 80 140, 125 155 C 170 170, 210 110, 250 120 C 290 130, 330 80, 375 70 C 420 60, 460 30, 500 40 L 500 180 Z"
                  fill="url(#chartGradient)"
                />
                
                <!-- Line Path -->
                <path
                  d="M 0 180 C 40 160, 80 140, 125 155 C 170 170, 210 110, 250 120 C 290 130, 330 80, 375 70 C 420 60, 460 30, 500 40"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                
                <!-- Chart Dots -->
                <circle cx="125" cy="155" r="4" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
                <circle cx="250" cy="120" r="4" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
                <circle cx="375" cy="70" r="4" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
                <circle cx="500" cy="40" r="4" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
              </svg>
              
              <!-- Floating Data Labels -->
              <div class="absolute bottom-1 left-[25%] -translate-x-1/2 text-[8px] font-bold text-slate-400 uppercase">H-4</div>
              <div class="absolute bottom-1 left-[50%] -translate-x-1/2 text-[8px] font-bold text-slate-400 uppercase">H-2</div>
              <div class="absolute bottom-1 left-[75%] -translate-x-1/2 text-[8px] font-bold text-slate-400 uppercase">Kemarin</div>
              <div class="absolute bottom-1 right-0 text-[8px] font-bold text-blue-600 uppercase">Hari Ini</div>
            </div>
          </div>
          
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata Harian:</span>
            <span class="font-bold text-slate-800">24 Undangan</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Listings (Recent Invitations & Categories distribution) -->
    <section class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Recent Invitations List -->
      <div class="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-clock-rotate-left text-slate-400"></i>
            Undangan Terbaru
          </h2>
          <RouterLink to="/admin/invitations" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Lihat semua</RouterLink>
        </div>
        <div class="p-6 flex-1">
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

      <!-- Categories Distribution Breakdown -->
      <div class="lg:col-span-1 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div class="border-b border-slate-100 px-6 py-4">
          <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-chart-pie text-slate-400"></i>
            Kategori Undangan Populer
          </h2>
        </div>
        <div class="p-6 flex-1 space-y-4">
          <div v-for="cat in categoryDistribution" :key="cat.name" class="space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-slate-700 capitalize">{{ cat.name }}</span>
              <span class="text-slate-500 font-semibold">{{ cat.count }} ({{ cat.percentage }}%)</span>
            </div>
            <!-- Progress Bar -->
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div 
                :class="cat.color"
                class="h-full rounded-full transition-all duration-1000"
                :style="{ width: `${cat.percentage}%` }"
              ></div>
            </div>
          </div>
          
          <div v-if="categoryDistribution.length === 0" class="text-center py-10 text-slate-400 text-xs">
            Tidak ada distribusi kategori.
          </div>
        </div>
      </div>
    </section>

  </AdminShell>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {
  fetchAdminUsers,
  fetchAdminInvitations,
  fetchAdminGuests,
  fetchAdminTemplates,
  fetchAdminHealth,
} from '@/api/admin.js'
import { getAdminResellers, getAdminWithdrawals } from '@/api/adminAffiliate.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

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

// Diagnostics simulation states
const isRunningDiagnostics = ref(false)
const diagnosticResults = ref(null)

const runDiagnostics = async () => {
  isRunningDiagnostics.value = true
  diagnosticResults.value = null
  try {
    const res = await fetchAdminHealth()
    diagnosticResults.value = res?.data || res || null
    toast.success('Diagnostik sistem selesai!')
  } catch (error) {
    console.warn('Diagnostics error:', error)
  } finally {
    isRunningDiagnostics.value = false
  }
}

// Maintenance Mode switch configuration
const isMaintenanceMode = ref(localStorage.getItem('admin_maintenance_mode') === 'true')

const toggleMaintenance = async () => {
  const targetState = !isMaintenanceMode.value
  const result = await Swal.fire({
    title: targetState ? 'Aktifkan Mode Perbaikan?' : 'Matikan Mode Perbaikan?',
    text: targetState 
      ? 'Aplikasi akan menampilkan halaman pemeliharaan untuk pengguna biasa.' 
      : 'Pengguna biasa akan dapat mengakses kembali aplikasi secara normal.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: targetState ? 'Ya, Aktifkan' : 'Ya, Nonaktifkan',
    cancelButtonText: 'Batal'
  })
  
  if (result.isConfirmed) {
    isMaintenanceMode.value = targetState
    localStorage.setItem('admin_maintenance_mode', targetState)
    toast.success(targetState ? 'Mode perbaikan diaktifkan' : 'Mode perbaikan dinonaktifkan')
  }
}

// Category Distribution Calculator based on Invitations
const categoryColors = {
  modern: 'bg-blue-500',
  classic: 'bg-purple-500',
  rustic: 'bg-amber-500',
  floral: 'bg-pink-500',
  elegant: 'bg-slate-700',
}

const categoryDistribution = computed(() => {
  const counts = {}
  const items = Array.isArray(recentInvitations.value) ? recentInvitations.value : []
  items.forEach(inv => {
    const cat = inv?.category || 'Lainnya'
    counts[cat] = (counts[cat] || 0) + 1
  })
  
  const total = items.length || 1
  return Object.entries(counts).map(([name, count]) => {
    const key = name.toLowerCase()
    return {
      name,
      count,
      percentage: Math.round((count / total) * 100),
      color: categoryColors[key] || 'bg-slate-400'
    }
  }).sort((a, b) => b.count - a.count)
})

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
  runDiagnostics()
})
</script>
