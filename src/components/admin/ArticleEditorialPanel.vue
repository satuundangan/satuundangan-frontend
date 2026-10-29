<template>
  <details class="mb-6 rounded-2xl border border-slate-200 bg-white" data-testid="editorial-panel" @toggle="onToggle">
    <summary class="cursor-pointer px-5 py-4 text-sm font-bold text-slate-800">
      Kalender editorial, antrean konten lama, dan performa artikel
    </summary>
    <div class="border-t border-slate-100 p-5">
      <div role="tablist" aria-label="Editorial" class="mb-4 flex gap-1 border-b border-slate-200">
        <button
          v-for="item in tabs"
          :id="`ed-tab-${item.key}`"
          :key="item.key"
          type="button"
          role="tab"
          :aria-selected="tab === item.key"
          :aria-controls="`ed-panel-${item.key}`"
          class="px-3 py-2 text-sm font-medium"
          :class="tab === item.key ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500'"
          @click="select(item.key)"
        >
          {{ item.label }}
        </button>
      </div>

      <section v-show="tab === 'calendar'" id="ed-panel-calendar" role="tabpanel" aria-labelledby="ed-tab-calendar">
        <p v-if="overviewState.loading" role="status" class="text-sm text-slate-500">Memuat…</p>
        <p v-else-if="overviewState.error" role="alert" class="text-sm text-rose-700">
          {{ overviewState.error }} <button type="button" class="underline" @click="loadOverview">Coba lagi</button>
        </p>
        <template v-else-if="overview">
          <p v-if="overview.execution.note" class="mb-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800" data-testid="overdue-note">{{ overview.execution.note }}</p>
          <h3 class="mb-1 text-sm font-bold">Jadwal terbit (WIB)</h3>
          <ul class="mb-4 space-y-1 text-sm" data-testid="scheduled-list">
            <li v-for="item in overview.calendar.scheduled" :key="item.id" class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-xs">{{ formatDateTime(item.scheduledPublishAt) }}</span>
              <RouterLink :to="`/admin/articles/${item.id}/edit`" class="underline">{{ item.title }}</RouterLink>
              <span v-if="item.overdue" class="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">Melewati jadwal</span>
            </li>
            <li v-if="!overview.calendar.scheduled.length" class="text-slate-500">Tidak ada artikel terjadwal.</li>
          </ul>
          <h3 class="mb-1 text-sm font-bold">Eksekusi terakhir penjadwal</h3>
          <ul class="mb-4 space-y-1 text-xs text-slate-600">
            <li v-for="(run, index) in overview.execution.lastRuns" :key="index">
              {{ formatDateTime(run.at) }} · {{ run.ok ? 'berhasil' : 'gagal' }}
              <template v-if="run.details?.published != null"> · terbit {{ run.details.published }}, dilewati {{ run.details.skipped }}, gagal {{ run.details.failed?.length ?? 0 }}</template>
            </li>
            <li v-if="!overview.execution.lastRuns.length" class="text-slate-500">Belum ada eksekusi tercatat.</li>
          </ul>
          <h3 class="mb-1 text-sm font-bold">Perlu ditinjau</h3>
          <p class="mb-1 text-xs text-slate-500">
            Terbit tidak diperbarui lebih dari {{ overview.attention.thresholds.stalePublishedDays }} hari; draft tidak disentuh lebih dari {{ overview.attention.thresholds.staleDraftDays }} hari.
          </p>
          <ul class="space-y-1 text-sm" data-testid="stale-list">
            <li v-for="item in staleItems" :key="item.kind + item.id" class="flex flex-wrap items-center gap-2">
              <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold">{{ item.kind }}</span>
              <RouterLink :to="`/admin/articles/${item.id}/edit`" class="underline">{{ item.title }}</RouterLink>
              <span class="text-xs text-slate-500">{{ item.ageDays }} hari tanpa pembaruan</span>
            </li>
            <li v-if="!staleItems.length" class="text-slate-500">Tidak ada konten yang melewati batas.</li>
          </ul>
        </template>
      </section>

      <section v-show="tab === 'performance'" id="ed-panel-performance" role="tabpanel" aria-labelledby="ed-tab-performance">
        <div class="mb-3 flex items-center gap-2 text-sm">
          <label for="ed-days">Periode</label>
          <select id="ed-days" v-model="days" class="rounded-lg border border-slate-300 px-2 py-1" @change="loadPerformance">
            <option value="7">7 hari</option>
            <option value="30">30 hari</option>
            <option value="90">90 hari</option>
          </select>
        </div>
        <p v-if="performanceState.loading" role="status" class="text-sm text-slate-500">Memuat…</p>
        <p v-else-if="performanceState.error" role="alert" class="text-sm text-rose-700">
          {{ performanceState.error }} <button type="button" class="underline" @click="loadPerformance">Coba lagi</button>
        </p>
        <template v-else-if="performance">
          <ul class="mb-3 space-y-1 text-xs" data-testid="sources">
            <li>GA4: <strong>{{ sourceLabel(performance.sources.ga4) }}</strong></li>
            <li>Search Console: <strong>{{ sourceLabel(performance.sources.searchConsole) }}</strong></li>
          </ul>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-xs">
              <caption class="sr-only">Performa artikel</caption>
              <thead class="text-slate-500">
                <tr>
                  <th scope="col" class="py-1">Artikel</th><th scope="col">Sesi</th><th scope="col">Engagement</th><th scope="col">Purchase</th>
                  <th scope="col">Klik</th><th scope="col">Tayang</th><th scope="col">CTR</th><th scope="col">Posisi</th>
                </tr>
              </thead>
              <tbody data-testid="performance-rows">
                <tr v-for="row in performance.items" :key="row.id" class="border-t border-slate-100">
                  <td class="py-1 pr-2">{{ row.title }}</td>
                  <td>{{ val(row.reader?.sessions) }}</td>
                  <td>{{ row.reader?.engagementRate == null ? '—' : Math.round(row.reader.engagementRate * 1000) / 10 + '%' }}</td>
                  <td>{{ val(row.conversion?.purchases) }}</td>
                  <td>{{ val(row.search?.clicks) }}</td>
                  <td>{{ val(row.search?.impressions) }}</td>
                  <td>{{ row.search?.ctr == null ? '—' : Math.round(row.search.ctr * 1000) / 10 + '%' }}</td>
                  <td>{{ row.search?.position == null ? '—' : Math.round(row.search.position * 10) / 10 }}</td>
                </tr>
                <tr v-if="!performance.items.length"><td colspan="8" class="py-4 text-center text-slate-500">Belum ada artikel terbit.</td></tr>
              </tbody>
            </table>
          </div>
          <ul class="mt-3 space-y-1 text-xs text-slate-500">
            <li v-for="(text, key) in performance.definitions" :key="key"><strong>{{ key }}:</strong> {{ text }}</li>
          </ul>
        </template>
      </section>
    </div>
  </details>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchArticlePerformance, fetchEditorialOverview } from '@/api/articleEditorial.js'

const tabs = [
  { key: 'calendar', label: 'Kalender & antrean' },
  { key: 'performance', label: 'Performa' },
]
const tab = ref('calendar')
const loaded = reactive({ calendar: false, performance: false })
const overview = ref(null)
const performance = ref(null)
const overviewState = reactive({ loading: false, error: '' })
const performanceState = reactive({ loading: false, error: '' })
const days = ref('30')

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '-'
const val = (value) => (value == null ? '—' : new Intl.NumberFormat('id-ID').format(value))
const staleItems = computed(() => [
  ...(overview.value?.attention.stalePublished || []).map((item) => ({ ...item, kind: 'Terbit' })),
  ...(overview.value?.attention.staleDrafts || []).map((item) => ({ ...item, kind: 'Draft' })),
])
const sourceLabel = (source) =>
  source.status === 'ready'
    ? 'tersambung'
    : source.status === 'not_connected'
      ? `belum tersambung${source.missingConfiguration?.length ? ' (kurang: ' + source.missingConfiguration.join(', ') + ')' : ''}`
      : source.message || 'gagal dimuat'

async function loadOverview() {
  if (overviewState.loading) return
  overviewState.loading = true
  overviewState.error = ''
  try {
    overview.value = await fetchEditorialOverview()
    loaded.calendar = true
  } catch (e) {
    overviewState.error = e.message || 'Kalender editorial belum dapat dimuat.'
  } finally {
    overviewState.loading = false
  }
}

async function loadPerformance() {
  if (performanceState.loading) return
  performanceState.loading = true
  performanceState.error = ''
  try {
    performance.value = await fetchArticlePerformance({ days: days.value })
    loaded.performance = true
  } catch (e) {
    performanceState.error = e.message || 'Performa artikel belum dapat dimuat.'
  } finally {
    performanceState.loading = false
  }
}

function select(key) {
  tab.value = key
  if (key === 'calendar' && !loaded.calendar) loadOverview()
  if (key === 'performance' && !loaded.performance) loadPerformance()
}

// Nothing is fetched until the panel is opened, so the article list stays as light as before.
function onToggle(event) {
  if (event.target.open && !loaded[tab.value]) select(tab.value)
}
</script>
