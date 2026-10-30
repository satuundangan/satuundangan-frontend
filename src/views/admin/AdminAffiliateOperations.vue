<script setup>
import { onMounted, ref } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  getAdminTierConfigs,
  getAdminSystemConfig,
  getAdminAffiliateConfigHistory,
  getAdminAffiliateJobRuns,
  updateTierConfig,
  updateAdminSystemConfig,
} from '@/api/adminAffiliate'
import { useToast } from 'vue-toastification'

const toast = useToast()
const tiers = ref([])
const system = ref({})
const history = ref([])
const jobs = ref([])
const loading = ref(true)
const savingTier = ref('')
const savingSystem = ref(false)
const systemFields = [
  { key: 'minWithdrawalAmount', label: 'Minimum penarikan (Rp)' },
  { key: 'clearingPeriodDays', label: 'Masa clearing (hari)' },
  { key: 'inactivityDowngradeMonths', label: 'Downgrade karena tidak aktif (bulan)' },
]

async function load() {
  loading.value = true
  try {
    const [tierRes, systemRes, historyRes, jobRes] = await Promise.all([
      getAdminTierConfigs(),
      getAdminSystemConfig(),
      getAdminAffiliateConfigHistory(),
      getAdminAffiliateJobRuns(),
    ])
    tiers.value = (tierRes.data || []).map((tier) => ({
      ...tier,
      minSales: Number(tier.min_sales),
      commissionRate: Number(tier.commission_rate),
    }))
    system.value = { ...(systemRes.data || {}) }
    history.value = historyRes.data || []
    jobs.value = jobRes.data || []
  } catch {
    toast.error('Gagal memuat konfigurasi atau status scheduler afiliasi')
  } finally {
    loading.value = false
  }
}

async function saveTier(tier) {
  savingTier.value = tier.tier
  try {
    await updateTierConfig(tier.tier, {
      minSales: Number(tier.minSales),
      commissionRate: Number(tier.commissionRate),
    })
    toast.success(`Konfigurasi ${tier.tier} tersimpan`)
    await load()
  } catch {
    toast.error('Gagal menyimpan tier')
  } finally {
    savingTier.value = ''
  }
}

async function saveSystem() {
  savingSystem.value = true
  try {
    const payload = Object.fromEntries(
      systemFields.map(({ key }) => [key, Number(system.value[key])]),
    )
    await updateAdminSystemConfig(payload)
    toast.success('Aturan afiliasi tersimpan')
    await load()
  } catch {
    toast.error('Gagal menyimpan aturan afiliasi')
  } finally {
    savingSystem.value = false
  }
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : '—'
}

function jobLabel(run) {
  return run.succeeded === true ? 'Berhasil' : run.succeeded === false ? 'Gagal' : 'Berjalan'
}

onMounted(load)
</script>

<template>
  <AdminShell
    title="Aturan & Scheduler Afiliasi"
    description="Perubahan berlaku saat disimpan. Setiap perubahan konfigurasi dan hasil job harian tercatat untuk audit."
  >
    <div
      v-if="loading"
      class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500"
    >
      Memuat…
    </div>
    <template v-else>
      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 class="mb-4 text-lg font-bold text-slate-900">Tier komisi</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <form
            v-for="tier in tiers"
            :key="tier.tier"
            class="rounded-xl border border-slate-200 p-4"
            @submit.prevent="saveTier(tier)"
          >
            <h3 class="mb-3 font-bold uppercase text-slate-800">{{ tier.tier }}</h3>
            <label class="mb-3 block text-sm text-slate-600"
              >Minimum penjualan
              <input
                v-model.number="tier.minSales"
                type="number"
                min="0"
                class="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3"
              />
            </label>
            <label class="mb-4 block text-sm text-slate-600"
              >Rate komisi
              <input
                v-model.number="tier.commissionRate"
                type="number"
                min="0"
                max="1"
                step="0.0001"
                class="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3"
              />
            </label>
            <button
              :disabled="savingTier === tier.tier"
              class="min-h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              Simpan tier
            </button>
          </form>
        </div>
      </section>

      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 class="mb-4 text-lg font-bold text-slate-900">Aturan program</h2>
        <form class="grid gap-4 md:grid-cols-3" @submit.prevent="saveSystem">
          <label v-for="field in systemFields" :key="field.key" class="text-sm text-slate-600"
            >{{ field.label }}
            <input
              v-model.number="system[field.key]"
              type="number"
              min="0"
              class="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>
          <div class="md:col-span-3">
            <button
              :disabled="savingSystem"
              class="min-h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              Simpan aturan
            </button>
          </div>
        </form>
      </section>

      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-lg font-bold text-slate-900">Riwayat konfigurasi</h2>
          <span class="text-xs text-slate-500"
            >Mencatat perubahan baru; perubahan sebelum audit ini tidak tersedia.</span
          >
        </div>
        <div v-if="!history.length" class="text-sm text-slate-500">
          Belum ada perubahan tercatat.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[760px] text-left text-sm">
            <thead class="border-b text-xs uppercase text-slate-500">
              <tr>
                <th class="py-2">Berlaku</th>
                <th>Pengaturan</th>
                <th>Sebelum</th>
                <th>Sesudah</th>
                <th>Admin ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in history" :key="entry.id" class="border-b border-slate-100">
                <td class="py-3">{{ formatDate(entry.effectiveAt) }}</td>
                <td>{{ entry.configKey }}</td>
                <td>{{ entry.beforeValue ?? '—' }}</td>
                <td>{{ entry.afterValue }}</td>
                <td>{{ entry.changedByUserId ?? 'tidak tercatat' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-lg font-bold text-slate-900">Riwayat scheduler</h2>
          <span class="text-xs text-slate-500"
            >Belum ada metrik backlog; status di bawah berasal dari eksekusi job yang
            tercatat.</span
          >
        </div>
        <div v-if="!jobs.length" class="text-sm text-slate-500">
          Belum ada run yang tercatat. Scheduler dijalankan setiap hari pukul 02.00 dan 03.00 WIB.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead class="border-b text-xs uppercase text-slate-500">
              <tr>
                <th class="py-2">Job</th>
                <th>Mulai</th>
                <th>Selesai</th>
                <th>Status</th>
                <th>Jumlah</th>
                <th>Pesan error</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run in jobs" :key="run.id" class="border-b border-slate-100">
                <td class="py-3">{{ run.jobName }}</td>
                <td>{{ formatDate(run.startedAt) }}</td>
                <td>{{ formatDate(run.finishedAt) }}</td>
                <td>{{ jobLabel(run) }}</td>
                <td>{{ run.affectedCount ?? '—' }}</td>
                <td class="max-w-72 truncate text-rose-700" :title="run.errorMessage">
                  {{ run.errorMessage || '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </AdminShell>
</template>
