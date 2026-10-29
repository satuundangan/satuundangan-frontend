<template>
  <AdminShell title="Dashboard" description="Ringkasan bisnis dan pekerjaan admin">
    <section class="rounded-2xl border border-slate-200 bg-white p-5">
      <form class="flex flex-wrap items-end gap-3" @submit.prevent="applyPeriod">
        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Periode laporan
          <select
            v-model="selectedPeriod"
            name="period"
            class="rounded-lg border border-slate-300 px-3 py-2"
            @change="changePeriod"
          >
            <option value="7">7 hari terakhir</option>
            <option value="30">30 hari terakhir</option>
            <option value="90">90 hari terakhir</option>
            <option value="custom">Pilih tanggal</option>
          </select>
        </label>
        <template v-if="selectedPeriod === 'custom'">
          <label class="grid gap-1 text-sm"
            >Dari<input
              v-model="startDate"
              type="date"
              required
              :max="endDate || today"
              class="rounded-lg border border-slate-300 px-3 py-2"
          /></label>
          <label class="grid gap-1 text-sm"
            >Sampai<input
              v-model="endDate"
              type="date"
              required
              :min="startDate"
              :max="today"
              class="rounded-lg border border-slate-300 px-3 py-2"
          /></label>
          <button
            type="submit"
            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Terapkan
          </button>
        </template>
        <button
          type="button"
          :disabled="loading"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50"
          @click="loadOverview"
        >
          Perbarui laporan
        </button>
      </form>
      <p v-if="overview" class="mt-3 text-xs text-slate-500">
        {{ overview.period.startDate }} — {{ overview.period.endDate }} · WIB. Dibandingkan
        {{ overview.period.previousStartDate }} — {{ overview.period.previousEndDate }} dengan waktu
        pengamatan setara.
        <strong v-if="overview.period.includesToday">Hari ini masih berjalan.</strong>
      </p>
    </section>

    <div
      v-if="error"
      role="alert"
      class="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
    >
      {{ error }}
      <button type="button" class="ml-2 font-bold underline" @click="loadOverview">
        Coba lagi
      </button>
    </div>
    <p v-if="loading" role="status" class="py-8 text-sm text-slate-500">Memuat laporan bisnis…</p>

    <template v-if="overview && !loading">
      <section
        data-testid="business-metrics"
        class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Metrik periode terpilih"
      >
        <article
          v-for="card in businessCards"
          :key="card.key"
          class="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h2 class="text-sm font-medium text-slate-600">{{ card.label }}</h2>
          <p class="mt-2 text-2xl font-bold text-slate-950">
            {{
              card.money ? currency(overview.metrics[card.key]) : number(overview.metrics[card.key])
            }}
          </p>
          <p class="mt-1 text-xs text-slate-500">{{ comparisonLabel(card.key, card.money) }}</p>
          <p class="mt-3 text-xs leading-relaxed text-slate-500">{{ card.description }}</p>
          <RouterLink
            :to="metricLink(card)"
            class="mt-3 inline-block text-xs font-semibold text-indigo-700 underline focus-visible:outline focus-visible:outline-2"
            >{{ card.key === 'invitationsCreated' ? 'Lihat undangan sumber' : 'Lihat transaksi sumber' }}</RouterLink
          >
        </article>
      </section>
      <div
        v-if="overview.metrics.unverifiedSuccesses"
        class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
      >
        {{ number(overview.metrics.unverifiedSuccesses) }} transaksi sukses memerlukan pemeriksaan
        sumber/waktu/nominal dan belum masuk penerimaan di atas.
      </div>
      <details class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <summary class="cursor-pointer font-semibold text-slate-700">
          Definisi angka dan batas data
        </summary>
        <p class="mt-3 text-slate-600">{{ overview.definitions.revenue }}</p>
        <p class="mt-2 text-slate-600">{{ overview.definitions.history }}</p>
        <p class="mt-2 text-slate-600">
          Lingkungan gateway saat ini:
          {{
            overview.sources.currentGatewayEnvironment === 'production'
              ? 'produksi'
              : 'sandbox atau belum terkonfirmasi'
          }}. Angka ini belum menyatakan laba maupun dana yang sudah masuk rekening.
        </p>
        <p class="mt-2 text-xs text-slate-500">
          Sumber: catatan pembayaran dan undangan backend. Laporan dibuat
          {{ dateTime(overview.period.asOf) }} WIB. Baseline nol ditampilkan sebagai perubahan
          absolut tanpa persentase.
        </p>
      </details>

      <section class="mt-6" aria-label="Total saat ini">
        <h2 class="mb-3 text-sm font-semibold text-slate-700">Total saat ini · semua waktu</h2>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-6">
          <div
            v-for="card in totalCards"
            :key="card.key"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p class="text-xs text-slate-500">{{ card.label }}</p>
            <p class="mt-1 text-xl font-bold">{{ number(overview.totals[card.key]) }}</p>
            <RouterLink
              v-if="card.to"
              :to="card.to"
              class="mt-1 inline-block text-xs font-semibold text-indigo-700 underline"
              >Lihat daftar</RouterLink
            >
            <p v-else-if="card.note" class="mt-1 text-[11px] text-slate-500">{{ card.note }}</p>
          </div>
        </div>
        <p v-if="overview.sourceWarnings?.length" class="mt-2 text-xs text-amber-800">
          Sebagian total belum tersedia. Nilai kosong belum dapat dinyatakan sebagai nol.
        </p>
      </section>

      <section class="mt-6 grid gap-5 lg:grid-cols-2">
        <article class="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 class="font-semibold">Undangan dibuat</h2>
          <p class="mt-1 text-xs text-slate-500">
            Jumlah undangan baru pada periode terpilih. Ini bukan jumlah visitor atau akun baru.
          </p>
          <svg
            v-if="overview.trend.length"
            class="mt-5 h-36 w-full"
            viewBox="0 0 500 140"
            role="img"
            aria-label="Tren jumlah undangan dibuat"
          >
            <polyline
              :points="trendPoints"
              fill="none"
              stroke="#4f46e5"
              stroke-width="3"
              vector-effect="non-scaling-stroke"
            />
            <a
              v-for="point in trendDots"
              :key="point.date"
              :href="router.resolve(dayLink(point.date)).href"
              :aria-label="`${point.date}: ${point.count} undangan dibuat. Buka daftar`"
              @click.prevent="router.push(dayLink(point.date))"
            >
              <circle :cx="point.x" :cy="point.y" r="5" fill="#4f46e5" />
            </a>
          </svg>
          <details class="mt-3">
            <summary class="cursor-pointer text-sm text-indigo-700">Lihat data harian</summary>
            <div class="mt-3 overflow-x-auto">
              <table class="w-full text-left text-xs">
                <caption class="sr-only">
                  Data harian dalam WIB
                </caption>
                <thead>
                  <tr>
                    <th class="p-2">Tanggal WIB</th>
                    <th class="p-2">Undangan</th>
                    <th class="p-2">Order berbayar</th>
                    <th class="p-2">Penerimaan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="day in overview.trend"
                    :key="day.date"
                    class="border-t border-slate-100"
                  >
                    <td class="p-2">{{ day.date }}</td>
                    <td class="p-2">
                      <RouterLink :to="dayLink(day.date)" class="text-indigo-700 underline">{{
                        number(day.count)
                      }}</RouterLink>
                    </td>
                    <td class="p-2">
                      <RouterLink :to="dayPaymentsLink(day.date)" class="text-indigo-700 underline">{{
                        number(day.paidOrders)
                      }}</RouterLink>
                    </td>
                    <td class="p-2">{{ currency(day.revenue) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 class="font-semibold">Kategori undangan baru</h2>
          <p class="mt-1 text-xs text-slate-500">
            Pemakaian kategori dari undangan yang dibuat pada periode yang sama.
          </p>
          <ul v-if="overview.categories.length" class="mt-5 space-y-3">
            <li
              v-for="item in overview.categories"
              :key="item.category"
              class="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 text-sm"
            >
              <RouterLink :to="categoryLink(item.category)" class="text-indigo-700 underline">{{
                item.category
              }}</RouterLink
              ><strong>{{ number(item.count) }}</strong>
            </li>
          </ul>
          <p v-else class="py-8 text-sm text-slate-500">
            Belum ada undangan yang dibuat pada periode ini.
          </p>
        </article>
      </section>
    </template>

    <section class="mt-6 grid gap-5 lg:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-5" data-testid="action-queue">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="font-semibold">Perlu tindakan</h2>
          <RouterLink
            to="/admin/payments?tab=reconciliation"
            class="text-xs font-semibold text-indigo-700 underline"
            >Buka antrean pembayaran</RouterLink
          >
        </div>
        <p class="mt-1 text-xs text-slate-500">{{ queue?.note || 'Antrean dari pusat pembayaran.' }}</p>
        <p v-if="queueLoading" role="status" class="py-6 text-sm text-slate-500">Memuat antrean…</p>
        <div v-else-if="queueError" class="mt-4 text-sm text-amber-800">
          {{ queueError }}
          <button type="button" class="underline" @click="loadQueue">Muat ulang antrean</button>
        </div>
        <template v-else-if="queue">
          <p class="mt-3 text-sm">
            {{ number(queue.count) }} item · transaksi {{ number(queue.countsBySource.transaksi) }},
            undangan {{ number(queue.countsBySource.undangan) }}, payout
            {{ number(queue.countsBySource.payout) }}
          </p>
          <ul class="mt-3 space-y-3">
            <li
              v-for="item in queue.items.slice(0, 8)"
              :key="item.key"
              class="rounded-lg border p-3 text-sm"
              :class="item.priority === 1 ? 'border-rose-200 bg-rose-50' : 'border-amber-100 bg-amber-50'"
            >
              <div class="flex items-center justify-between gap-2">
                <RouterLink v-if="item.link" :to="item.link" class="font-semibold text-slate-800 underline">{{
                  item.title
                }}</RouterLink>
                <span v-else class="font-semibold text-slate-800">{{ item.title }}</span>
                <span class="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold">{{ item.priorityLabel }}</span>
              </div>
              <p class="mt-1 text-xs text-slate-600">{{ item.reason }}</p>
              <p class="mt-1 text-xs text-slate-500">
                <template v-if="item.ageHours != null">Umur {{ ageLabel(item.ageHours) }}</template>
                <template v-if="item.amount"> · {{ currency(item.amount) }}</template>
                <template v-if="item.linkNote"> · {{ item.linkNote }}</template>
              </p>
            </li>
          </ul>
          <p v-if="!queue.items.length" class="py-6 text-sm text-slate-500">
            Tidak ada pengecualian pada hasil pemeriksaan ini.
          </p>
          <p v-if="queue.items.length > 8" class="mt-2 text-xs text-slate-500">
            Menampilkan 8 teratas dari {{ number(queue.items.length) }}.
          </p>
          <ul v-if="queue.unavailableSources?.length" class="mt-3 text-xs text-slate-500">
            <li v-for="source in queue.unavailableSources" :key="source.source">
              Belum tersedia ({{ source.source }}): {{ source.reason }}
            </li>
          </ul>
        </template>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5" data-testid="ga4-card">
        <h2 class="font-semibold">Visitor dan perjalanan pembelian</h2>
        <p v-if="ga4Loading" role="status" class="mt-3 text-sm text-slate-500">Memuat GA4…</p>
        <template v-else-if="ga4 && ga4.status === 'ready'">
          <dl class="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt class="text-xs text-slate-500">Users</dt>
              <dd class="text-lg font-bold">{{ number(ga4.reports.summary.current?.activeUsers) }}</dd>
            </div>
            <div>
              <dt class="text-xs text-slate-500">Sesi</dt>
              <dd class="text-lg font-bold">{{ number(ga4.reports.summary.current?.sessions) }}</dd>
            </div>
            <div>
              <dt class="text-xs text-slate-500">Engagement</dt>
              <dd class="text-lg font-bold">
                {{
                  ga4.reports.summary.current?.engagementRate == null
                    ? 'Belum tersedia'
                    : Math.round(ga4.reports.summary.current.engagementRate * 1000) / 10 + '%'
                }}
              </dd>
            </div>
          </dl>
          <p class="mt-2 text-xs text-slate-500">
            {{ ga4.scope.name }} · diambil {{ dateTime(ga4.generatedAt) }} WIB
          </p>
        </template>
        <p v-else class="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          {{ ga4Message }}
        </p>
        <RouterLink
          to="/admin/analytics"
          class="mt-4 inline-block text-sm font-semibold text-indigo-700 underline"
          >Funnel, purchase, atribusi, dan kualitas data</RouterLink
        >
      </article>
    </section>

    <section class="mt-6 grid gap-5 lg:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <h2 class="font-semibold">Undangan terbaru · semua waktu</h2>
          <RouterLink
            to="/admin/invitations"
            class="text-xs font-semibold text-indigo-700 underline"
            >Lihat semua</RouterLink
          >
        </div>
        <p v-if="recentError" class="mt-3 text-sm text-amber-800">{{ recentError }}</p>
        <ul v-else class="mt-3 divide-y divide-slate-100">
          <li v-for="item in recentInvitations" :key="item.id" class="py-3">
            <RouterLink
              :to="'/admin/invitations/' + item.id + '/edit'"
              class="text-sm font-semibold text-indigo-700 underline"
              >{{ item.title || item.slug }}</RouterLink
            >
            <p class="mt-1 text-xs text-slate-500">
              {{ item.paymentStatus?.label || 'Pembayaran belum diketahui' }} ·
              {{ item.isPublished ? 'Terbit' : 'Draft' }}
            </p>
          </li>
        </ul>
        <p v-if="!recentError && !recentInvitations.length" class="mt-4 text-sm text-slate-500">
          {{ recentLoading ? 'Memuat undangan…' : 'Belum ada undangan.' }}
        </p>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5" data-testid="system-card">
        <h2 class="font-semibold">Status sistem</h2>
        <template v-if="isSuperadmin">
          <p class="mt-1 text-xs text-slate-500">
            Pemeriksaan nyata per layanan. Kredensial saja tidak dihitung sehat.
          </p>
          <p v-if="systemError" class="mt-3 text-sm text-rose-700">
            {{ systemError }}
            <button type="button" class="underline" @click="loadSystem">Coba lagi</button>
          </p>
          <ul v-else-if="system" class="mt-3 space-y-2 text-sm">
            <li v-for="item in system.services" :key="item.key" class="flex justify-between gap-3">
              <span>{{ item.label }}</span>
              <span :class="serviceClass(item.status)">{{ statusLabel(item.status) }}</span>
            </li>
          </ul>
          <p v-else role="status" class="mt-3 text-sm text-slate-500">Memeriksa layanan…</p>
          <p class="mt-3 text-sm" data-testid="maintenance-status">
            Mode perawatan:
            <strong :class="maintenance?.active ? 'text-rose-700' : 'text-emerald-700'">{{
              maintenance == null ? 'belum diketahui' : maintenance.active ? 'AKTIF' : 'normal'
            }}</strong>
          </p>
          <RouterLink to="/admin/system" class="mt-4 inline-block text-sm font-semibold text-indigo-700 underline"
            >Buka kesehatan, perawatan, dan jejak audit</RouterLink
          >
        </template>
        <p v-else class="mt-3 text-sm text-slate-600">
          Kesehatan sistem dan mode perawatan hanya tersedia untuk superadmin.
        </p>
      </article>
    </section>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  fetchAdminDashboardOverview,
  fetchAdminInvitations,
  fetchAdminActionQueue,
} from '@/api/admin.js'
import { fetchAnalyticsReport } from '@/api/adminAnalytics.js'
import { fetchAdminHealthReport, fetchMaintenance } from '@/api/adminSecurity.js'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isSuperadmin = computed(() => authStore.adminRole === 'superadmin')
const overview = ref(null)
const loading = ref(false)
const error = ref('')
const selectedPeriod = ref(
  route.query.startDate && route.query.endDate
    ? 'custom'
    : ['7', '30', '90'].includes(String(route.query.days))
      ? String(route.query.days)
      : '7',
)
const startDate = ref(String(route.query.startDate || ''))
const endDate = ref(String(route.query.endDate || ''))
const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10)
let requestSequence = 0
const queue = ref(null),
  queueLoading = ref(true),
  queueError = ref('')
const recentInvitations = ref([]),
  recentLoading = ref(true),
  recentError = ref('')
const system = ref(null),
  systemError = ref(''),
  maintenance = ref(null)
const ga4 = ref(null),
  ga4Loading = ref(true),
  ga4Message = ref('Memuat GA4…')
const businessCards = [
  {
    key: 'revenue',
    label: 'Penerimaan undangan',
    money: true,
    link: true,
    description: 'Pembayaran undangan setelah diskon. Biaya, refund dan komisi belum dikurangi.',
  },
  {
    key: 'paidOrders',
    label: 'Order undangan berbayar',
    link: true,
    description: 'Transaksi sukses berbayar, termasuk upgrade. Aktivasi gratis dipisahkan.',
  },
  {
    key: 'paidInvitations',
    label: 'Undangan menerima pembayaran',
    description:
      'Undangan unik pada transaksi periode ini. Beberapa order bisa terkait satu undangan.',
  },
  {
    key: 'buyers',
    label: 'Pembeli unik',
    description: 'Identitas akun; email digunakan bila ID akun tidak tersedia.',
  },
  {
    key: 'invitationsCreated',
    label: 'Undangan dibuat',
    description: 'Undangan baru pada periode terpilih.',
  },
  {
    key: 'freeActivations',
    label: 'Aktivasi gratis',
    link: true,
    description: 'Aktivasi sukses nol rupiah dengan sumber gratis/promo yang dikenali.',
  },
  {
    key: 'averageOrderValue',
    label: 'Rata-rata order berbayar',
    money: true,
    description: 'Penerimaan undangan dibagi jumlah order undangan berbayar.',
  },
  {
    key: 'pendingOrders',
    label: 'Checkout masih pending',
    link: true,
    description: 'Order yang dibuat pada periode dan masih menunggu saat laporan dibuka.',
  },
  {
    key: 'aiRevenue',
    label: 'Penerimaan kredit AI',
    money: true,
    link: true,
    description: 'Top-up AI dipisahkan dari penjualan undangan.',
  },
]
const totalCards = [
  { key: 'users', label: 'Pengguna', to: '/admin/users' },
  { key: 'invitations', label: 'Undangan', to: '/admin/invitations' },
  { key: 'guests', label: 'Tamu', note: 'Belum ada halaman admin untuk tamu.' },
  { key: 'templates', label: 'Template', to: '/admin/templates' },
  { key: 'activeResellers', label: 'Reseller berstatus aktif', note: 'Halaman reseller belum aktif.' },
  { key: 'pendingWithdrawals', label: 'Penarikan pending', note: 'Antrean payout belum aktif.' },
]
const number = (value) =>
  value == null ? 'Belum tersedia' : new Intl.NumberFormat('id-ID').format(value)
const currency = (value) =>
  value == null
    ? 'Belum tersedia'
    : new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(value)
function dateTime(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Belum tersedia'
    : new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}
function comparisonLabel(key, money) {
  const item = overview.value?.comparison?.[key]
  if (!item) return 'Pembanding belum tersedia'
  const change = (item.delta > 0 ? '+' : '') + (money ? currency(item.delta) : number(item.delta))
  return item.percent == null
    ? change + ' · baseline nol'
    : change + ' (' + (item.percent > 0 ? '+' : '') + item.percent + '%)'
}
function params() {
  return selectedPeriod.value === 'custom'
    ? { startDate: startDate.value, endDate: endDate.value }
    : { days: Number(selectedPeriod.value) }
}
async function loadOverview() {
  const request = ++requestSequence
  loading.value = true
  error.value = ''
  overview.value = null
  try {
    const response = await fetchAdminDashboardOverview(params())
    if (request === requestSequence) overview.value = response?.data || response
  } catch (err) {
    if (request === requestSequence) error.value = err.message || 'Laporan belum dapat dimuat.'
  } finally {
    if (request === requestSequence) loading.value = false
  }
}
function applyPeriod() {
  const query = { ...route.query }
  delete query.days
  delete query.startDate
  delete query.endDate
  for (const [key, value] of Object.entries(params())) query[key] = String(value)
  router.replace({ query }).catch(() => {})
  loadGa4()
  return loadOverview()
}
function changePeriod() {
  if (selectedPeriod.value !== 'custom') applyPeriod()
}
function metricLink(card) {
  if (card.key === 'invitationsCreated') {
    return {
      path: '/admin/invitations',
      query: {
        startDate: overview.value.period.startDate,
        endDate: overview.value.period.endDate,
      },
    }
  }
  return {
    path: '/admin/payments',
    query: {
      status: card.key === 'pendingOrders' ? 'pending' : 'success',
      purpose: card.key === 'aiRevenue' ? 'ai_credits' : 'invitation',
      kind:
        card.key === 'freeActivations' ? 'free' : card.key === 'pendingOrders' ? 'pending' : 'paid',
      startDate: overview.value.period.startDate,
      endDate: overview.value.period.endDate,
    },
  }
}
const dayLink = (date) => ({ path: '/admin/invitations', query: { startDate: date, endDate: date } })
const dayPaymentsLink = (date) => ({
  path: '/admin/payments',
  query: { status: 'success', purpose: 'invitation', kind: 'paid', startDate: date, endDate: date },
})
const categoryLink = (category) => ({
  path: '/admin/invitations',
  query: {
    category,
    startDate: overview.value.period.startDate,
    endDate: overview.value.period.endDate,
  },
})
const trendDots = computed(() => {
  const days = overview.value?.trend || []
  const max = Math.max(...days.map((d) => d.count), 1)
  return days.map((day, index) => ({
    date: day.date,
    count: day.count,
    x: (index / Math.max(days.length - 1, 1)) * 480 + 10,
    y: 130 - (day.count / max) * 115,
  }))
})
const trendPoints = computed(() => {
  const days = overview.value?.trend || []
  const max = Math.max(...days.map((d) => d.count), 1)
  return days
    .map(
      (day, index) =>
        (index / Math.max(days.length - 1, 1)) * 480 + 10 + ',' + (130 - (day.count / max) * 115),
    )
    .join(' ')
})
async function loadQueue() {
  queueLoading.value = true
  queueError.value = ''
  try {
    const response = await fetchAdminActionQueue()
    queue.value = response?.data || response
  } catch (err) {
    queue.value = null
    queueError.value = err.message || 'Antrean belum tersedia.'
  } finally {
    queueLoading.value = false
  }
}
async function loadRecent() {
  try {
    const response = await fetchAdminInvitations({ page: 1, limit: 5 })
    recentInvitations.value = response.data || []
  } catch (err) {
    recentError.value = err.message || 'Undangan terbaru belum tersedia.'
  } finally {
    recentLoading.value = false
  }
}
const STATUS_LABELS = {
  available: 'Tersedia',
  configured: 'Terkonfigurasi',
  degraded: 'Terdegradasi',
  error: 'Error',
  unknown: 'Tidak diketahui',
}
const statusLabel = (status) => STATUS_LABELS[status] || status
function serviceClass(status) {
  return status === 'available'
    ? 'text-emerald-700'
    : status === 'error'
      ? 'text-rose-700'
      : status === 'degraded'
        ? 'text-amber-800'
        : 'text-slate-600'
}
function ageLabel(hours) {
  return hours >= 48 ? Math.floor(hours / 24) + ' hari' : hours + ' jam'
}
async function loadSystem() {
  if (!isSuperadmin.value) return
  systemError.value = ''
  try {
    system.value = await fetchAdminHealthReport()
  } catch (err) {
    system.value = null
    systemError.value = err.message || 'Pemeriksaan gagal.'
  }
  try {
    maintenance.value = await fetchMaintenance()
  } catch {
    maintenance.value = null
  }
}
async function loadGa4() {
  ga4Loading.value = true
  try {
    const report = await fetchAnalyticsReport(params())
    ga4.value = report
    ga4Message.value =
      report.status === 'not_connected'
        ? 'GA4 belum tersambung ke panel admin. Angka tidak ditampilkan sampai kredensial server lengkap.'
        : report.status === 'no_data'
          ? report.emptyReason || 'Tidak ada data GA4 untuk periode ini.'
          : report.message || 'Laporan GA4 belum dapat dimuat.'
  } catch (err) {
    ga4.value = null
    ga4Message.value =
      err.status === 403
        ? 'Role Anda tidak memiliki akses ke laporan GA4.'
        : err.message || 'Laporan GA4 belum dapat dimuat.'
  } finally {
    ga4Loading.value = false
  }
}
onMounted(async () => {
  await authStore.loadAdminAccess()
  loadOverview()
  loadQueue()
  loadRecent()
  loadSystem()
  loadGa4()
})
</script>
