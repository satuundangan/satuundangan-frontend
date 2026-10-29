<template>
  <AdminShell title="Analytics & Funnel" description="Visitor, funnel pembelian, purchase terverifikasi, atribusi, dan kualitas data">
    <form class="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4" @submit.prevent="reloadAll">
      <div>
        <label for="an-period" class="block text-xs text-slate-600">Periode (WIB)</label>
        <select id="an-period" v-model="period" name="period" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" @change="period !== 'custom' && reloadAll()">
          <option value="7">7 hari</option>
          <option value="30">30 hari</option>
          <option value="90">90 hari</option>
          <option value="custom">Pilih tanggal</option>
        </select>
      </div>
      <template v-if="period === 'custom'">
        <div>
          <label for="an-start" class="block text-xs text-slate-600">Dari</label>
          <input id="an-start" v-model="startDate" type="date" :max="today" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label for="an-end" class="block text-xs text-slate-600">Sampai</label>
          <input id="an-end" v-model="endDate" type="date" :max="today" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <button type="submit" class="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white" :disabled="!startDate || !endDate">Terapkan</button>
      </template>
    </form>

    <div role="tablist" aria-label="Laporan analytics" class="mb-5 flex flex-wrap gap-1 border-b border-slate-200">
      <button
        v-for="item in tabs"
        :id="`an-tab-${item.key}`"
        :key="item.key"
        type="button"
        role="tab"
        :aria-selected="tab === item.key"
        :aria-controls="`an-panel-${item.key}`"
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

    <!-- Ringkasan GA4 -->
    <section v-show="tab === 'overview'" id="an-panel-overview" role="tabpanel" aria-labelledby="an-tab-overview">
      <State :state="states.overview" @retry="load('overview')" />
      <template v-if="data.overview?.status === 'not_connected'">
        <p class="rounded-lg bg-slate-50 p-4 text-sm" data-testid="ga4-not-connected">
          GA4 belum tersambung. Variabel server yang belum lengkap: <strong>{{ data.overview.missingConfiguration.join(', ') }}</strong>.
          Angka tidak ditampilkan sampai kredensial lengkap.
        </p>
      </template>
      <template v-else-if="data.overview?.reports">
        <dl class="grid grid-cols-2 gap-3 md:grid-cols-5">
          <div v-for="metric in summaryMetrics" :key="metric.key" class="rounded-xl border border-slate-200 bg-white p-4">
            <dt class="text-xs text-slate-500">{{ metric.label }}</dt>
            <dd class="text-xl font-bold">{{ metricValue(metric) }}</dd>
            <dd class="text-xs text-slate-500">{{ metricChange(metric) }}</dd>
          </div>
        </dl>
        <ul v-if="data.overview.warnings?.length" class="mt-3 space-y-1 text-xs text-amber-800">
          <li v-for="warning in data.overview.warnings" :key="warning">{{ warning }}</li>
        </ul>
        <div class="mt-5 grid gap-4 lg:grid-cols-3">
          <SimpleTable title="Kanal" :rows="data.overview.reports.channels" dimension="sessionDefaultChannelGroup" />
          <SimpleTable title="Perangkat" :rows="data.overview.reports.devices" dimension="deviceCategory" />
          <SimpleTable title="Halaman masuk" :rows="data.overview.reports.landingPages" dimension="landingPage" />
        </div>
        <p class="mt-3 text-xs text-slate-500">
          {{ data.overview.scope.definition }} Diambil {{ dateTime(data.overview.generatedAt) }} WIB (cache 5 menit).
        </p>
      </template>
      <p v-else-if="data.overview?.status === 'no_data'" class="text-sm text-slate-600">{{ data.overview.emptyReason }}</p>
      <p v-else-if="data.overview?.status === 'error'" role="alert" class="text-sm text-rose-700">{{ data.overview.message }}</p>
    </section>

    <!-- Funnel -->
    <section v-show="tab === 'funnel'" id="an-panel-funnel" role="tabpanel" aria-labelledby="an-tab-funnel">
      <State :state="states.funnel" @retry="load('funnel')" />
      <template v-if="data.funnel">
        <h3 class="mb-2 text-sm font-bold">Backend: kohort undangan dibuat pada periode</h3>
        <p v-if="data.funnel.backend.cohort.note" class="mb-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900" data-testid="cohort-note">
          {{ data.funnel.backend.cohort.note }}
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
          <FunnelTable title="Kohort matang (disarankan untuk membandingkan)" :funnel="data.funnel.backend.mature" />
          <FunnelTable title="Semua undangan pada periode" :funnel="data.funnel.backend.all" />
        </div>
        <h3 class="mb-2 mt-6 text-sm font-bold">Hulu dari GA4 (event, tidak dijumlahkan dengan tahap backend)</h3>
        <p v-if="data.funnel.upstreamGa4.status === 'not_connected'" class="rounded-lg bg-slate-50 p-3 text-sm">GA4 belum tersambung; tahap hulu tidak tersedia.</p>
        <p v-else-if="data.funnel.upstreamGa4.status === 'error'" class="text-sm text-rose-700">{{ data.funnel.upstreamGa4.message }}</p>
        <table v-else class="min-w-full text-left text-sm">
          <caption class="sr-only">Event GA4 per tahap</caption>
          <thead class="text-xs text-slate-500"><tr><th scope="col" class="py-1">Tahap</th><th scope="col">Event</th><th scope="col">Users</th></tr></thead>
          <tbody><tr v-for="step in data.funnel.upstreamGa4.steps" :key="step.event" class="border-t border-slate-100"><td class="py-1">{{ step.label }}</td><td>{{ number(step.events) }}</td><td>{{ number(step.users) }}</td></tr></tbody>
        </table>
        <ul class="mt-4 space-y-1 text-xs text-slate-500">
          <li v-for="(text, key) in data.funnel.definitions" :key="key"><strong>{{ key }}:</strong> {{ text }}</li>
        </ul>
      </template>
    </section>

    <!-- Purchases -->
    <section v-show="tab === 'purchases'" id="an-panel-purchases" role="tabpanel" aria-labelledby="an-tab-purchases">
      <State :state="states.purchases" @retry="load('purchases')" />
      <template v-if="data.purchases">
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div class="rounded-xl border bg-white p-4"><p class="text-xs text-slate-500">Order dibayar (backend)</p><p class="text-xl font-bold">{{ number(data.purchases.backend.orders) }}</p></div>
          <div class="rounded-xl border bg-white p-4"><p class="text-xs text-slate-500">Penerimaan (backend)</p><p class="text-xl font-bold">{{ currency(data.purchases.backend.revenue) }}</p></div>
          <div class="rounded-xl border bg-white p-4"><p class="text-xs text-slate-500">Dikirim ke GA4</p><p class="text-xl font-bold">{{ number(data.purchases.dispatch.sent) }}</p></div>
          <div class="rounded-xl border bg-white p-4"><p class="text-xs text-slate-500">Tidak dihitung</p><p class="text-sm">gratis {{ data.purchases.excluded.free }}, simulasi {{ data.purchases.excluded.simulation }}, pending {{ data.purchases.excluded.pending }}, gagal {{ data.purchases.excluded.failed }}</p></div>
        </div>
        <p v-if="data.purchases.server.measurementProtocol !== 'configured'" class="mt-3 rounded-lg bg-slate-50 p-3 text-sm" data-testid="mp-not-configured">
          Pengiriman purchase server-side belum aktif. Variabel yang kurang: {{ data.purchases.server.missing.join(', ') }}.
        </p>
        <p v-if="data.purchases.ga4.status === 'not_connected'" class="mt-3 text-sm text-slate-600">Laporan GA4 belum tersambung, jadi kolom GA4 kosong (bukan nol).</p>
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <caption class="sr-only">Perbandingan purchase backend dan GA4 per hari</caption>
            <thead class="text-xs text-slate-500"><tr><th scope="col" class="py-1">Tanggal</th><th scope="col">Order backend</th><th scope="col">Order GA4</th><th scope="col">Selisih</th><th scope="col">Omzet backend</th><th scope="col">Omzet GA4</th></tr></thead>
            <tbody>
              <tr v-for="row in data.purchases.daily" :key="row.date" class="border-t border-slate-100">
                <td class="py-1">{{ row.date }}</td><td>{{ row.backendOrders }}</td><td>{{ row.ga4Purchases ?? '—' }}</td>
                <td>{{ row.orderDifference ?? '—' }}</td><td>{{ currency(row.backendRevenue) }}</td><td>{{ row.ga4Revenue == null ? '—' : currency(row.ga4Revenue) }}</td>
              </tr>
              <tr v-if="!data.purchases.daily.length"><td colspan="6" class="py-6 text-center text-slate-500">Belum ada order dibayar pada periode ini.</td></tr>
            </tbody>
          </table>
        </div>
        <ul class="mt-3 space-y-1 text-xs text-slate-600"><li v-for="line in data.purchases.explanations" :key="line">{{ line }}</li></ul>
        <p class="mt-2 text-xs text-slate-500">{{ data.purchases.definition }}</p>
      </template>
    </section>

    <!-- Attribution -->
    <section v-show="tab === 'attribution'" id="an-panel-attribution" role="tabpanel" aria-labelledby="an-tab-attribution">
      <State :state="states.attribution" @retry="load('attribution')" />
      <template v-if="data.attribution">
        <h3 class="mb-2 text-sm font-bold">Order dibayar per sumber ({{ data.attribution.paidOrders.total }} order)</h3>
        <table class="min-w-full text-left text-sm">
          <caption class="sr-only">Order dibayar per sumber akuisisi</caption>
          <thead class="text-xs text-slate-500"><tr><th scope="col" class="py-1">Sumber / medium</th><th scope="col">Order</th><th scope="col">Omzet</th></tr></thead>
          <tbody>
            <tr v-for="row in data.attribution.paidOrders.bySource" :key="row.label" class="border-t border-slate-100"><td class="py-1">{{ row.label }}</td><td>{{ row.orders }}</td><td>{{ currency(row.revenue) }}</td></tr>
            <tr v-if="!data.attribution.paidOrders.bySource.length"><td colspan="3" class="py-4 text-center text-slate-500">Belum ada order dibayar.</td></tr>
          </tbody>
        </table>
        <p v-if="data.attribution.ga4.status === 'not_connected'" class="mt-4 rounded-lg bg-slate-50 p-3 text-sm">Sumber trafik GA4 belum tersambung.</p>
        <template v-else-if="data.attribution.ga4.status === 'ready'">
          <ul v-if="data.attribution.ga4.warnings.length" class="mt-3 text-xs text-amber-800" data-testid="gateway-warning"><li v-for="w in data.attribution.ga4.warnings" :key="w">{{ w }}</li></ul>
          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <SimpleTable title="Sumber sesi" :rows="data.attribution.ga4.sessionSource" dimension="sessionSource" />
            <SimpleTable title="Sumber pengguna pertama" :rows="data.attribution.ga4.firstUserSource" dimension="firstUserSource" />
          </div>
        </template>
        <ul class="mt-4 space-y-1 text-xs text-slate-500"><li v-for="(text, key) in data.attribution.definitions" :key="key"><strong>{{ key }}:</strong> {{ text }}</li></ul>
      </template>
    </section>

    <!-- Quality -->
    <section v-show="tab === 'quality'" id="an-panel-quality" role="tabpanel" aria-labelledby="an-tab-quality">
      <State :state="states.quality" @retry="load('quality')" />
      <template v-if="data.quality">
        <p v-if="data.quality.status === 'error'" role="alert" class="text-sm text-rose-700">{{ data.quality.message }}</p>
        <template v-else>
          <p class="text-xs text-slate-500">Diperiksa {{ dateTime(data.quality.checkedAt) }} WIB · skema event v{{ data.quality.expectedEventSchemaVersion }} · tracking valid sejak {{ data.quality.trackingValidFrom }}</p>
          <p class="mt-2 text-sm" data-testid="coverage">
            Cakupan purchase server → GA4:
            <strong>{{ data.quality.purchaseCoverage.percent == null ? 'belum ada order' : data.quality.purchaseCoverage.percent + '%' }}</strong>
            ({{ data.quality.purchaseCoverage.sent }}/{{ data.quality.purchaseCoverage.verified }})
          </p>
          <ul class="mt-3 space-y-2" data-testid="alerts">
            <li v-for="alert in data.quality.alerts" :key="alert.code" class="rounded-lg border p-3 text-sm" :class="alertClass(alert.level)">
              <strong class="uppercase text-[11px]">{{ alert.level }}</strong> {{ alert.message }}
            </li>
          </ul>
        </template>
      </template>
    </section>

    <!-- Insights -->
    <section v-show="tab === 'insights'" id="an-panel-insights" role="tabpanel" aria-labelledby="an-tab-insights">
      <State :state="states.insights" @retry="load('insights')" />
      <template v-if="data.insights">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs text-slate-500">{{ data.insights.note }} <template v-if="data.insights.generatedAt">Dihitung {{ dateTime(data.insights.generatedAt) }} WIB.</template></p>
          <button v-if="canWrite" type="button" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs" :disabled="refreshing" @click="refreshInsights">{{ refreshing ? 'Menghitung…' : 'Hitung ulang' }}</button>
        </div>
        <ul class="space-y-3" data-testid="insights">
          <li v-for="item in data.insights.items" :key="item.id" class="rounded-xl border border-slate-200 bg-white p-4">
            <h3 class="text-sm font-semibold">{{ item.title }}</h3>
            <p class="mt-1 text-sm text-slate-700">{{ item.detail }}</p>
            <p class="mt-1 text-xs italic text-slate-500">{{ item.hypothesis }}</p>
            <p class="mt-2 text-xs text-slate-500">Periode {{ item.periodStart }} – {{ item.periodEnd }} · <RouterLink :to="item.link" class="underline">Telusuri</RouterLink></p>
          </li>
          <li v-if="!data.insights.items.length" class="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Belum ada insight untuk periode ini.</li>
        </ul>
        <h3 class="mb-2 mt-6 text-sm font-bold">Anotasi rilis dan kampanye</h3>
        <ul class="space-y-1 text-sm" data-testid="annotations">
          <li v-for="note in data.insights.annotations" :key="note.id" class="flex items-center justify-between gap-2">
            <span><strong>{{ note.date }}</strong> · {{ note.kind }} · {{ note.label }}</span>
            <button v-if="canWrite" type="button" class="text-xs text-rose-700 underline" @click="removeNote(note)">Hapus</button>
          </li>
          <li v-if="!data.insights.annotations.length" class="text-slate-500">Belum ada anotasi pada periode ini.</li>
        </ul>
        <form v-if="canWrite" class="mt-3 flex flex-wrap items-end gap-2" @submit.prevent="addNote">
          <div><label for="n-date" class="block text-xs text-slate-600">Tanggal</label><input id="n-date" v-model="note.date" type="date" required class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" /></div>
          <div><label for="n-kind" class="block text-xs text-slate-600">Jenis</label><select id="n-kind" v-model="note.kind" class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"><option value="release">Rilis</option><option value="campaign">Kampanye</option><option value="note">Catatan</option></select></div>
          <div class="grow"><label for="n-label" class="block text-xs text-slate-600">Keterangan</label><input id="n-label" v-model="note.label" minlength="3" maxlength="200" required class="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" /></div>
          <button type="submit" class="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Tambah</button>
        </form>
      </template>
    </section>
  </AdminShell>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import AdminShell from '@/components/admin/AdminShell.vue'
import { useAuthStore } from '@/stores/auth'
import {
  addAnalyticsAnnotation,
  fetchAnalyticsAttribution,
  fetchAnalyticsFunnel,
  fetchAnalyticsInsights,
  fetchAnalyticsPurchases,
  fetchAnalyticsQuality,
  fetchAnalyticsReport,
  refreshAnalyticsInsights,
  removeAnalyticsAnnotation,
} from '@/api/adminAnalytics.js'

const toast = useToast()
const auth = useAuthStore()
const canWrite = computed(() => auth.adminRole === 'superadmin')
const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10)

const tabs = [
  { key: 'overview', label: 'Ringkasan GA4' },
  { key: 'funnel', label: 'Funnel' },
  { key: 'purchases', label: 'Purchase' },
  { key: 'attribution', label: 'Atribusi' },
  { key: 'quality', label: 'Kualitas data' },
  { key: 'insights', label: 'Insight' },
]
const tab = ref('overview')
const move = (step) => {
  const index = tabs.findIndex((item) => item.key === tab.value)
  tab.value = tabs[(index + step + tabs.length) % tabs.length].key
}

const period = ref('7')
const startDate = ref('')
const endDate = ref('')
const params = () =>
  period.value === 'custom' ? { startDate: startDate.value, endDate: endDate.value } : { days: Number(period.value) }

const loaders = {
  overview: fetchAnalyticsReport,
  funnel: fetchAnalyticsFunnel,
  purchases: fetchAnalyticsPurchases,
  attribution: fetchAnalyticsAttribution,
  quality: () => fetchAnalyticsQuality(),
  insights: fetchAnalyticsInsights,
}
const data = reactive({})
const states = reactive(Object.fromEntries(Object.keys(loaders).map((key) => [key, { loading: true, error: '' }])))

async function load(key) {
  states[key] = { loading: true, error: '' }
  try {
    data[key] = await loaders[key](params())
    states[key] = { loading: false, error: '' }
  } catch (e) {
    data[key] = null
    states[key] = {
      loading: false,
      error: e.status === 403 ? 'Role Anda tidak memiliki akses ke laporan ini.' : e.message || 'Laporan belum dapat dimuat.',
    }
  }
}
const reloadAll = () => Promise.all(Object.keys(loaders).map(load))

const State = defineComponent({
  props: { state: { type: Object, required: true } },
  emits: ['retry'],
  setup(props, { emit }) {
    return () =>
      props.state.loading
        ? h('p', { role: 'status', class: 'text-sm text-slate-500' }, 'Memuat…')
        : props.state.error
          ? h('p', { role: 'alert', class: 'mb-3 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700' }, [
              props.state.error + ' ',
              h('button', { type: 'button', class: 'underline', onClick: () => emit('retry') }, 'Coba lagi'),
            ])
          : null
  },
})

const SimpleTable = defineComponent({
  props: { title: String, rows: { type: Array, default: () => [] }, dimension: String },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-xl border border-slate-200 bg-white p-3' }, [
        h('h3', { class: 'mb-2 text-sm font-bold' }, props.title),
        props.rows.length
          ? h('table', { class: 'w-full text-left text-xs' }, [
              h('caption', { class: 'sr-only' }, props.title),
              h('tbody', props.rows.slice(0, 8).map((row) =>
                h('tr', { class: 'border-t border-slate-100' }, [
                  h('td', { class: 'py-1 pr-2 break-all' }, row.dimensions[props.dimension] || '(tidak ada)'),
                  h('td', { class: 'text-right' }, new Intl.NumberFormat('id-ID').format(row.metrics.sessions ?? row.metrics.newUsers ?? 0)),
                ]),
              )),
            ])
          : h('p', { class: 'text-xs text-slate-500' }, 'Tidak ada data.'),
      ])
  },
})

const FunnelTable = defineComponent({
  props: { title: String, funnel: { type: Object, required: true } },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-xl border border-slate-200 bg-white p-3' }, [
        h('h4', { class: 'mb-2 text-sm font-semibold' }, props.title),
        h('table', { class: 'w-full text-left text-sm' }, [
          h('caption', { class: 'sr-only' }, props.title),
          h('thead', h('tr', { class: 'text-xs text-slate-500' }, ['Tahap', 'Jumlah', 'Dari sebelumnya', 'Dari awal'].map((t) => h('th', { scope: 'col', class: 'py-1' }, t)))),
          h('tbody', props.funnel.stages.map((stage) =>
            h('tr', { class: 'border-t border-slate-100', 'data-stage': stage.key }, [
              h('td', { class: 'py-1' }, stage.label),
              h('td', stage.count),
              h('td', stage.rateFromPrevious == null ? '—' : stage.rateFromPrevious + '%'),
              h('td', stage.rateFromStart == null ? '—' : stage.rateFromStart + '%'),
            ]),
          )),
        ]),
        h('p', { class: 'mt-2 text-xs text-slate-500' },
          `Median waktu ke checkout: ${props.funnel.medianHours.toCheckout ?? '—'} jam · ke pembayaran: ${props.funnel.medianHours.toPaid ?? '—'} jam · aktivasi gratis: ${props.funnel.freeActivated}`),
      ])
  },
})

const number = (value) => (value == null ? 'Belum tersedia' : new Intl.NumberFormat('id-ID').format(value))
const currency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0)
const dateTime = (value) =>
  value ? new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) : '-'
const alertClass = (level) =>
  level === 'critical' ? 'border-rose-300 bg-rose-50' : level === 'warning' ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'

const summaryMetrics = [
  { key: 'activeUsers', label: 'Active users' },
  { key: 'sessions', label: 'Sesi' },
  { key: 'screenPageViews', label: 'Pageviews' },
  { key: 'engagedSessions', label: 'Sesi engaged' },
  { key: 'engagementRate', label: 'Engagement rate', percent: true },
]
const current = (key) => data.overview?.reports?.summary?.current?.[key]
const previous = (key) => data.overview?.reports?.summary?.previous?.[key]
const metricValue = (metric) =>
  current(metric.key) == null ? 'Belum tersedia' : metric.percent ? Math.round(current(metric.key) * 1000) / 10 + '%' : number(current(metric.key))
function metricChange(metric) {
  const now = current(metric.key)
  const before = previous(metric.key)
  if (now == null || before == null) return 'Pembanding belum tersedia'
  if (!data.overview.period.comparisonComparable) return 'Pembanding belum setara (hari berjalan)'
  const delta = now - before
  if (metric.percent) return (delta >= 0 ? '+' : '') + Math.round(delta * 1000) / 10 + ' poin'
  return before === 0 ? (delta >= 0 ? '+' : '') + delta + ' · baseline nol' : (delta >= 0 ? '+' : '') + Math.round((delta / before) * 1000) / 10 + '%'
}

// Insights
const refreshing = ref(false)
const note = reactive({ date: today, kind: 'release', label: '' })
async function refreshInsights() {
  refreshing.value = true
  try {
    const result = await refreshAnalyticsInsights(params())
    toast.success(`${result.generated} insight dihitung`)
    await load('insights')
  } catch (e) {
    toast.error(e.message || 'Gagal menghitung insight')
  } finally {
    refreshing.value = false
  }
}
async function addNote() {
  try {
    await addAnalyticsAnnotation({ ...note })
    note.label = ''
    await load('insights')
  } catch (e) {
    toast.error(e.message || 'Gagal menambah anotasi')
  }
}
async function removeNote(item) {
  try {
    await removeAnalyticsAnnotation(item.id)
    await load('insights')
  } catch (e) {
    toast.error(e.message || 'Gagal menghapus anotasi')
  }
}

onMounted(async () => {
  await auth.loadAdminAccess()
  reloadAll()
})
</script>
