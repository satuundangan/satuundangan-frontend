<template>
  <AdminShell title="Sistem & Audit" description="Kesehatan layanan, mode perawatan, dan jejak perubahan admin">
    <div role="tablist" aria-label="Bagian sistem" class="mb-5 flex gap-1 border-b border-slate-200">
      <button
        v-for="item in tabs"
        :id="`tab-${item.key}`"
        :key="item.key"
        type="button"
        role="tab"
        :aria-selected="tab === item.key"
        :aria-controls="`panel-${item.key}`"
        :tabindex="tab === item.key ? 0 : -1"
        class="px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600"
        :class="tab === item.key ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'"
        @click="tab = item.key"
        @keydown.right.prevent="move(1)"
        @keydown.left.prevent="move(-1)"
      >
        {{ item.label }}
      </button>
    </div>

    <!-- Health -->
    <section v-show="tab === 'health'" id="panel-health" role="tabpanel" aria-labelledby="tab-health">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p class="text-xs text-slate-500" data-testid="health-checked">
          <template v-if="health">Terakhir diperiksa {{ formatDate(health.checkedAt) }}</template>
        </p>
        <button type="button" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs" :disabled="healthLoading" @click="loadHealth(true)">
          {{ healthLoading ? 'Memeriksa…' : 'Periksa ulang' }}
        </button>
      </div>
      <p v-if="healthError" role="alert" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ healthError }} <button type="button" class="underline" @click="loadHealth(true)">Coba lagi</button>
      </p>
      <ul v-else-if="health" class="grid gap-3 md:grid-cols-2" data-testid="health-list">
        <li v-for="service in health.services" :key="service.key" class="rounded-xl border bg-white p-4" :class="statusBorder(service.status)">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold">{{ service.label }}</h3>
            <span class="rounded-full px-2 py-0.5 text-[11px] font-bold" :class="statusBadge(service.status)">{{ statusLabel(service.status) }}</span>
          </div>
          <p class="mt-1 text-sm text-slate-700">{{ service.message }}</p>
          <p class="mt-2 text-xs text-slate-500">
            {{ service.required ? 'Wajib' : 'Opsional' }} · cek: {{ service.method }}
            <template v-if="service.latencyMs != null"> · {{ service.latencyMs }} ms</template> · {{ formatDate(service.checkedAt) }}
          </p>
        </li>
      </ul>
      <p v-else role="status" class="text-sm text-slate-500">Memeriksa layanan…</p>
      <p class="mt-3 text-xs text-slate-500">
        "Tersedia" berarti pemeriksaan di kolom cek berhasil. "Terkonfigurasi" berarti kredensial ada tetapi belum diuji.
        Kredensial saja tidak pernah dihitung sehat.
      </p>
    </section>

    <!-- Maintenance -->
    <section v-show="tab === 'maintenance'" id="panel-maintenance" role="tabpanel" aria-labelledby="tab-maintenance">
      <p v-if="maintenanceError" role="alert" class="mb-3 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ maintenanceError }}</p>
      <div v-if="maintenance" class="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <p class="text-sm" data-testid="maintenance-state">
          Status:
          <strong :class="maintenance.active ? 'text-rose-700' : 'text-emerald-700'">{{ maintenance.active ? 'Perawatan AKTIF' : 'Normal' }}</strong>
        </p>
        <p class="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <strong>Cakupan:</strong> {{ maintenance.scope }}
          Admin tetap dapat masuk dan webhook pembayaran tetap diterima.
        </p>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="maintenanceForm.enabled" type="checkbox" class="h-4 w-4" /> Aktifkan mode perawatan
        </label>
        <div>
          <label for="m-message" class="block text-sm font-medium">Pesan untuk pengunjung</label>
          <textarea id="m-message" v-model="maintenanceForm.message" rows="2" maxlength="300" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        </div>
        <div>
          <label for="m-reason" class="block text-sm font-medium">Alasan internal (wajib saat aktif)</label>
          <input id="m-reason" v-model="maintenanceForm.reason" maxlength="300" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <p class="mt-1 text-xs text-slate-500">Tidak ditampilkan ke publik.</p>
        </div>
        <div>
          <label for="m-until" class="block text-sm font-medium">Perkiraan selesai (WIB, opsional)</label>
          <input id="m-until" v-model="maintenanceForm.until" type="datetime-local" class="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <p class="mt-1 text-xs text-slate-500">Mode berakhir otomatis setelah waktu ini.</p>
        </div>
        <button type="button" class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60" :disabled="maintenanceSaving" @click="saveMaintenance">
          {{ maintenanceSaving ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </div>
    </section>

    <!-- Audit -->
    <section v-show="tab === 'audit'" id="panel-audit" role="tabpanel" aria-labelledby="tab-audit">
      <form class="mb-4 flex flex-wrap items-end gap-3" @submit.prevent="auditPage = 1; loadAudit()">
        <div>
          <label for="a-entity" class="block text-xs text-slate-600">Objek</label>
          <select id="a-entity" v-model="auditFilters.entityType" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
            <option value="">Semua</option>
            <option v-for="entity in entityTypes" :key="entity" :value="entity">{{ entity }}</option>
          </select>
        </div>
        <div>
          <label for="a-result" class="block text-xs text-slate-600">Hasil</label>
          <select id="a-result" v-model="auditFilters.result" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
            <option value="">Semua</option>
            <option value="success">Berhasil</option>
            <option value="failed">Gagal</option>
          </select>
        </div>
        <div>
          <label for="a-from" class="block text-xs text-slate-600">Dari</label>
          <input id="a-from" v-model="auditFilters.from" type="date" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label for="a-to" class="block text-xs text-slate-600">Sampai</label>
          <input id="a-to" v-model="auditFilters.to" type="date" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <button type="submit" class="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Terapkan</button>
        <button v-if="hasAuditFilter" type="button" class="text-sm underline" @click="resetAudit">Reset filter</button>
      </form>
      <p v-if="auditError" role="alert" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ auditError }} <button type="button" class="underline" @click="loadAudit">Coba lagi</button>
      </p>
      <p v-else-if="auditLoading" role="status" class="text-sm text-slate-500">Memuat jejak audit…</p>
      <div v-else class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table class="min-w-full text-left text-xs">
          <caption class="sr-only">Jejak perubahan admin</caption>
          <thead class="bg-slate-50 text-[11px] uppercase text-slate-500">
            <tr>
              <th scope="col" class="px-3 py-2">Waktu (WIB)</th>
              <th scope="col" class="px-3 py-2">Admin</th>
              <th scope="col" class="px-3 py-2">Aksi</th>
              <th scope="col" class="px-3 py-2">Objek</th>
              <th scope="col" class="px-3 py-2">Perubahan</th>
              <th scope="col" class="px-3 py-2">Hasil</th>
              <th scope="col" class="px-3 py-2">Request ID</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100" data-testid="audit-rows">
            <tr v-for="row in audit.items" :key="row.id" class="align-top">
              <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(row.createdAt) }}</td>
              <td class="px-3 py-2">{{ row.actorEmail || '#' + row.actorId }}<br /><span class="text-slate-500">{{ row.actorRole }}</span></td>
              <td class="px-3 py-2 font-mono">{{ row.action }}</td>
              <td class="px-3 py-2">{{ row.entityType }}<template v-if="row.entityId"> #{{ row.entityId }}</template></td>
              <td class="px-3 py-2 max-w-xs">
                <details v-if="row.before || row.after || row.reason">
                  <summary class="cursor-pointer">Lihat</summary>
                  <p v-if="row.reason" class="mt-1"><strong>Alasan:</strong> {{ row.reason }}</p>
                  <pre v-if="row.before" class="mt-1 whitespace-pre-wrap break-all">Sebelum: {{ JSON.stringify(row.before) }}</pre>
                  <pre v-if="row.after" class="mt-1 whitespace-pre-wrap break-all">Sesudah: {{ JSON.stringify(row.after) }}</pre>
                </details>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-3 py-2">
                <span :class="row.result === 'success' ? 'text-emerald-700' : 'text-rose-700'">{{ row.result === 'success' ? 'Berhasil' : 'Gagal' }}</span>
                <span v-if="row.statusCode"> ({{ row.statusCode }})</span>
                <p v-if="row.errorMessage" class="text-slate-500">{{ row.errorMessage }}</p>
              </td>
              <td class="px-3 py-2 font-mono text-[10px] text-slate-500">{{ row.requestId }}</td>
            </tr>
            <tr v-if="!audit.items.length">
              <td colspan="7" class="px-3 py-8 text-center text-slate-500">
                {{ hasAuditFilter ? 'Tidak ada catatan untuk filter ini.' : 'Belum ada perubahan tercatat.' }}
                <button v-if="hasAuditFilter" type="button" class="ml-1 underline" @click="resetAudit">Reset filter</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="audit.totalPages > 1" class="mt-3 flex items-center gap-2 text-xs">
        <button type="button" class="rounded border px-2 py-1" :disabled="auditPage <= 1" @click="auditPage--; loadAudit()">Sebelumnya</button>
        <span>Halaman {{ audit.page }} dari {{ audit.totalPages }} ({{ audit.total }} catatan)</span>
        <button type="button" class="rounded border px-2 py-1" :disabled="auditPage >= audit.totalPages" @click="auditPage++; loadAudit()">Berikutnya</button>
      </div>
      <p class="mt-3 text-xs text-slate-500">
        Kata sandi, token, dan secret tidak pernah dicatat; email dan telepon dimasking. Tambahkan header
        <code>x-admin-reason</code> pada permintaan sensitif untuk menyimpan alasan.
      </p>
    </section>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  fetchAdminAuditLogs,
  fetchAdminHealthReport,
  fetchMaintenance,
  updateMaintenance,
} from '@/api/adminSecurity.js'
import { fromWibDateTimeInput, toWibDateTimeInput } from '@/utils/articleDrafts.js'

const toast = useToast()
const tabs = [
  { key: 'health', label: 'Kesehatan' },
  { key: 'maintenance', label: 'Mode perawatan' },
  { key: 'audit', label: 'Jejak audit' },
]
const tab = ref('health')
const move = (step) => {
  const index = tabs.findIndex((item) => item.key === tab.value)
  tab.value = tabs[(index + step + tabs.length) % tabs.length].key
}

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'medium' }) + ' WIB'
    : '-'

// Health
const health = ref(null)
const healthLoading = ref(false)
const healthError = ref('')
const STATUS = {
  available: ['Tersedia', 'bg-emerald-100 text-emerald-800', 'border-emerald-200'],
  configured: ['Terkonfigurasi', 'bg-sky-100 text-sky-800', 'border-sky-200'],
  degraded: ['Terdegradasi', 'bg-amber-100 text-amber-800', 'border-amber-300'],
  error: ['Error', 'bg-rose-100 text-rose-800', 'border-rose-300'],
  unknown: ['Tidak diketahui', 'bg-slate-100 text-slate-700', 'border-slate-200'],
}
const statusLabel = (status) => STATUS[status]?.[0] || status
const statusBadge = (status) => STATUS[status]?.[1] || ''
const statusBorder = (status) => STATUS[status]?.[2] || 'border-slate-200'

async function loadHealth(refresh = false) {
  healthLoading.value = true
  healthError.value = ''
  try {
    health.value = await fetchAdminHealthReport(refresh)
  } catch (e) {
    healthError.value = e.message || 'Pemeriksaan kesehatan gagal dijalankan.'
  } finally {
    healthLoading.value = false
  }
}

// Maintenance
const maintenance = ref(null)
const maintenanceError = ref('')
const maintenanceSaving = ref(false)
const maintenanceForm = reactive({ enabled: false, message: '', reason: '', until: '' })

async function loadMaintenance() {
  maintenanceError.value = ''
  try {
    maintenance.value = await fetchMaintenance()
    Object.assign(maintenanceForm, {
      enabled: maintenance.value.enabled,
      message: maintenance.value.message,
      reason: maintenance.value.reason,
      until: toWibDateTimeInput(maintenance.value.until),
    })
  } catch (e) {
    maintenanceError.value = e.message || 'Status perawatan belum dapat dimuat.'
  }
}

async function saveMaintenance() {
  maintenanceSaving.value = true
  try {
    await updateMaintenance({
      enabled: maintenanceForm.enabled,
      message: maintenanceForm.message,
      reason: maintenanceForm.reason,
      until: maintenanceForm.until ? fromWibDateTimeInput(maintenanceForm.until) : null,
    })
    toast.success(maintenanceForm.enabled ? 'Mode perawatan diaktifkan' : 'Pengaturan disimpan')
    await loadMaintenance()
  } catch (e) {
    toast.error(e.message || 'Gagal menyimpan')
  } finally {
    maintenanceSaving.value = false
  }
}

// Audit trail
const entityTypes = ['users', 'invitations', 'payments', 'promo-codes', 'template-designs', 'categories', 'banks', 'sections', 'audio', 'palette-colors', 'articles', 'maintenance']
const audit = ref({ items: [], total: 0, page: 1, totalPages: 1 })
const auditPage = ref(1)
const auditLoading = ref(false)
const auditError = ref('')
const auditFilters = reactive({ entityType: '', result: '', from: '', to: '' })
const hasAuditFilter = computed(() => Object.values(auditFilters).some(Boolean))

async function loadAudit() {
  auditLoading.value = true
  auditError.value = ''
  try {
    audit.value = await fetchAdminAuditLogs({ ...auditFilters, page: auditPage.value, limit: 25 })
  } catch (e) {
    auditError.value = e.message || 'Jejak audit belum dapat dimuat.'
  } finally {
    auditLoading.value = false
  }
}

function resetAudit() {
  Object.assign(auditFilters, { entityType: '', result: '', from: '', to: '' })
  auditPage.value = 1
  loadAudit()
}

onMounted(() => {
  loadHealth()
  loadMaintenance()
  loadAudit()
})
</script>
