<template>
  <AdminShell
    title="Activity & Error Logs"
    description="Pantau aktivitas pengunjung, riwayat navigasi halaman, dan deteksi error platform secara real-time"
    show-search
    :search="search"
    search-placeholder="Cari path, email user, atau pesan error..."
    @update:search="handleSearch"
  >
    <div class="space-y-6">
      <!-- 1. Stats Counter Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Hari Ini -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Log Hari Ini</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ stats.totalToday }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Semua event tercatat</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-list-check"></i>
          </div>
        </div>

        <!-- Kunjungan Halaman -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-emerald-600">Kunjungan Halaman</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ stats.pageViewsToday }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Page views navigasi</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-compass"></i>
          </div>
        </div>

        <!-- Error Terdeteksi -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-rose-600">Error Sistem & Klien</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1" :class="stats.errorsToday > 0 ? 'text-rose-600' : 'text-slate-900'">
              {{ stats.errorsToday }}
            </h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Bug atau exception</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>

        <!-- Pengguna Aktif -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-blue-600">User Aktif Hari Ini</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ stats.activeUsersToday }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">User unik teridentifikasi</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>
      </div>

      <!-- 2. Filter Bar & Refresh Button -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <button
            v-for="f in levelFilters"
            :key="f.value"
            type="button"
            @click="setLevelFilter(f.value)"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5',
              selectedLevel === f.value
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            ]"
          >
            <i :class="f.icon"></i>
            <span>{{ f.label }}</span>
          </button>
        </div>

        <!-- Top Visited Pages Quick Pill & Refresh -->
        <div class="flex items-center gap-2">
          <div v-if="stats.topPaths?.length" class="hidden xl:flex items-center gap-1 text-[11px] text-slate-400">
            <span class="font-bold">Top:</span>
            <span
              v-for="p in stats.topPaths.slice(0, 2)"
              :key="p.path"
              class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]"
            >
              {{ p.path }} ({{ p.count }})
            </span>
          </div>

          <button
            type="button"
            @click="loadLogs"
            :disabled="loading"
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh logs"
          >
            <i :class="['fa-solid fa-rotate-right', loading ? 'animate-spin text-blue-600' : '']"></i>
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      <!-- 3. Logs DataTable -->
      <div class="card bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <DataTable
          :value="logs"
          lazy
          paginator
          :rows="limit"
          :totalRecords="total"
          :loading="loading"
          @page="onPage"
          class="p-datatable-sm"
          dataKey="id"
          responsiveLayout="scroll"
        >
          <template #empty>
            <div class="py-12 text-center space-y-2">
              <i class="fa-solid fa-inbox text-3xl text-slate-300"></i>
              <p class="text-sm font-bold text-slate-700">Tidak ada log aktivitas ditemukan</p>
              <p class="text-xs text-slate-400">Belum ada event yang cocok dengan filter saat ini.</p>
            </div>
          </template>
          <template #loading>
            <div class="py-8 text-center text-sm font-medium text-slate-500">Memuat log aktivitas...</div>
          </template>

          <!-- Waktu -->
          <Column field="createdAt" header="Waktu" style="min-width: 11rem">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-xs font-bold text-slate-900 font-mono">
                  {{ formatDate(data.createdAt) }}
                </span>
                <span class="text-[10px] text-slate-400 mt-0.5">
                  {{ formatRelative(data.createdAt) }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Level -->
          <Column field="level" header="Level" style="min-width: 7rem">
            <template #body="{ data }">
              <span
                :class="[
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border',
                  getLevelBadgeClass(data.level)
                ]"
              >
                <i :class="getLevelIcon(data.level)" class="text-[9px]"></i>
                {{ data.level }}
              </span>
            </template>
          </Column>

          <!-- Event / Aksi -->
          <Column field="action" header="Aksi / Event" style="min-width: 10rem">
            <template #body="{ data }">
              <span class="font-mono text-xs font-bold text-slate-800">
                {{ data.action }}
              </span>
            </template>
          </Column>

          <!-- Path / Route -->
          <Column field="path" header="Halaman / Path" style="min-width: 13rem">
            <template #body="{ data }">
              <div class="flex items-center gap-1.5">
                <span
                  class="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold max-w-[240px] truncate block"
                  :title="data.path || '-'"
                >
                  {{ data.path || '-' }}
                </span>
                <span v-if="data.method" class="text-[9px] font-mono uppercase text-slate-400 font-bold">
                  {{ data.method }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Pengguna & IP -->
          <Column header="Pengguna & IP" style="min-width: 13rem">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-slate-800 truncate" :title="data.userEmail || 'Anonim'">
                  <i class="fa-solid fa-user text-[10px] text-slate-400 mr-1"></i>
                  {{ data.userEmail || 'Tamu Anonim' }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono mt-0.5">
                  IP: {{ data.ip || '-' }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Ringkasan Info / Error Message -->
          <Column header="Ringkasan / Info" style="min-width: 15rem">
            <template #body="{ data }">
              <p class="text-xs text-slate-600 line-clamp-2 max-w-sm font-mono leading-relaxed">
                {{ getLogSummary(data) }}
              </p>
            </template>
          </Column>

          <!-- Aksi / Detail Button -->
          <Column header="Aksi" headerClass="text-right" bodyClass="text-right" style="min-width: 6rem">
            <template #body="{ data }">
              <button
                type="button"
                @click="openDetail(data)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <i class="fa-solid fa-magnifying-glass text-[10px]"></i>
                <span>Detail</span>
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Log Detail Inspector Modal -->
    <Teleport to="body">
      <div
        v-if="selectedLog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
        @click.self="selectedLog = null"
      >
        <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div class="flex items-center gap-2.5">
              <span
                :class="[
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border',
                  getLevelBadgeClass(selectedLog.level)
                ]"
              >
                {{ selectedLog.level }}
              </span>
              <h3 class="text-sm font-black text-slate-900 font-mono">
                Log #{{ selectedLog.id }} • {{ selectedLog.action }}
              </h3>
            </div>
            <button
              type="button"
              @click="selectedLog = null"
              class="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
            <!-- Metadata Grid -->
            <div class="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span class="text-[10px] font-black uppercase text-slate-400 block">Waktu Tercatat</span>
                <span class="font-bold text-slate-900 font-mono">{{ formatDate(selectedLog.createdAt) }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase text-slate-400 block">Path / Endpoint</span>
                <span class="font-bold text-slate-900 font-mono">{{ selectedLog.path || '-' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase text-slate-400 block">Email Pengguna</span>
                <span class="font-bold text-slate-900">{{ selectedLog.userEmail || 'Anonim' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase text-slate-400 block">Alamat IP & Method</span>
                <span class="font-bold text-slate-900 font-mono">{{ selectedLog.ip || '-' }} ({{ selectedLog.method || '-' }})</span>
              </div>
              <div class="col-span-2">
                <span class="text-[10px] font-black uppercase text-slate-400 block">User Agent (Browser / Device)</span>
                <span class="font-mono text-[11px] text-slate-600 break-all">{{ selectedLog.userAgent || '-' }}</span>
              </div>
            </div>

            <!-- Details Payload -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Data Rincian (Payload Details)
                </span>
                <button
                  type="button"
                  @click="copyJson(selectedLog.details)"
                  class="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                >
                  <i class="fa-regular fa-copy"></i>
                  <span>Salin JSON</span>
                </button>
              </div>
              <pre class="p-4 bg-slate-900 text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-60 custom-scrollbar border border-slate-800 leading-relaxed">{{ formatJson(selectedLog.details) }}</pre>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              type="button"
              @click="selectedLog = null"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { fetchAdminLogs, fetchAdminLogStats } from '@/api/admin.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const logs = ref([])
const total = ref(0)
const page = ref(1)
const limit = 20
const search = ref('')
const selectedLevel = ref('ALL')
const loading = ref(false)
const selectedLog = ref(null)

const stats = ref({
  totalToday: 0,
  pageViewsToday: 0,
  errorsToday: 0,
  activeUsersToday: 0,
  topPaths: [],
  recentErrors: [],
})

const levelFilters = [
  { label: 'Semua Event', value: 'ALL', icon: 'fa-solid fa-asterisk' },
  { label: 'Navigasi Halaman', value: 'INFO', icon: 'fa-solid fa-compass' },
  { label: 'Aksi Pengguna', value: 'ACTION', icon: 'fa-solid fa-bolt' },
  { label: 'Peringatan', value: 'WARN', icon: 'fa-solid fa-triangle-exclamation' },
  { label: 'Error Terdeteksi', value: 'ERROR', icon: 'fa-solid fa-circle-exclamation' },
]

async function loadStats() {
  try {
    const res = await fetchAdminLogStats()
    if (res) {
      stats.value = res
    }
  } catch (err) {
    console.debug('Failed to load log stats:', err)
  }
}

async function loadLogs() {
  loading.value = true
  try {
    const res = await fetchAdminLogs({
      page: page.value,
      limit,
      q: search.value,
      level: selectedLevel.value === 'ALL' ? undefined : selectedLevel.value,
    })
    logs.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    toast.error(error.message || 'Gagal memuat log aktivitas')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  loadLogs()
}, 350)

function handleSearch(val) {
  search.value = val
  page.value = 1
  debouncedSearch()
}

function setLevelFilter(val) {
  selectedLevel.value = val
  page.value = 1
  loadLogs()
}

function onPage(event) {
  page.value = event.page + 1
  loadLogs()
}

function openDetail(log) {
  selectedLog.value = log
}

function getLevelBadgeClass(level) {
  switch (level) {
    case 'ERROR':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'WARN':
      return 'bg-amber-50 text-amber-800 border-amber-200'
    case 'ACTION':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'INFO':
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
}

function getLevelIcon(level) {
  switch (level) {
    case 'ERROR':
      return 'fa-solid fa-triangle-exclamation text-rose-500'
    case 'WARN':
      return 'fa-solid fa-circle-exclamation text-amber-500'
    case 'ACTION':
      return 'fa-solid fa-bolt text-blue-500'
    default:
      return 'fa-solid fa-circle-info text-emerald-500'
  }
}

function getLogSummary(item) {
  if (!item.details) return '-'
  if (item.details.message) return item.details.message
  if (item.details.title) return item.details.title
  if (typeof item.details === 'string') return item.details
  try {
    return JSON.stringify(item.details)
  } catch {
    return '-'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatRelative(dateStr) {
  if (!dateStr) return ''
  const diffSec = Math.floor((new Date() - new Date(dateStr)) / 1000)
  if (diffSec < 60) return 'Baru saja'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} mnt lalu`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} jam lalu`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay} hari lalu`
}

function formatJson(val) {
  if (!val) return '// Tidak ada payload tambahan'
  try {
    return JSON.stringify(val, null, 2)
  } catch {
    return String(val)
  }
}

function copyJson(val) {
  navigator.clipboard.writeText(formatJson(val))
  toast.success('Rincian log berhasil disalin!')
}

onMounted(() => {
  loadStats()
  loadLogs()
})
</script>
