<template>
  <AdminShell
    title="Artikel & Blog"
    description="Kelola artikel dan konten blog untuk SEO"
    :showSearch="true"
    v-model:search="search"
    searchPlaceholder="Cari artikel..."
    actionLabel="+ Tulis Artikel"
    @action="$router.push({ name: 'admin-article-create' })"
  >
    <!-- Auto-Blog Status & Action Banner -->
    <div
      class="mb-6 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-amber-50 border border-violet-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shrink-0"
        >
          <i class="pi pi-sparkles text-lg"></i>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="font-bold text-slate-900 text-sm">Auto-Blogger AI (Gemini)</h4>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide"
              :class="botBadge.class"
              >{{ botBadge.label }}</span
            >
          </div>
          <p v-if="botLoading" class="text-xs text-slate-500 mt-1" role="status">
            Memeriksa konfigurasi dan riwayat bot…
          </p>
          <div v-else-if="botError" class="text-xs text-rose-700 mt-1" role="alert">
            <p>Status bot belum dapat dimuat. {{ botError }}</p>
            <button type="button" @click="loadBotStatus" class="mt-1 underline font-semibold">
              Coba lagi status bot
            </button>
          </div>
          <div v-else-if="botStatus" class="text-xs text-slate-600 mt-1 space-y-1">
            <p>
              {{ botStatus.scheduleTime }} · Penyedia AI
              {{ botStatus.geminiConfigured ? 'terkonfigurasi' : 'belum terkonfigurasi' }}.
            </p>
            <p>
              Topik kurasi belum dipakai: {{ botStatus.curatedKeywordsRemaining ?? '—' }} dari
              {{ botStatus.curatedKeywordsTotal ?? '—' }}.
            </p>
            <p v-if="botStatus.nextScheduledRunAt">
              Jadwal berikutnya: {{ formatDateTime(botStatus.nextScheduledRunAt) }}.
            </p>
            <p v-if="!botStatus.historyAvailable">
              {{ botStatus.historyWarning || 'Riwayat eksekusi belum dapat diverifikasi.' }}
            </p>
            <template v-else>
              <p>
                {{ botRunLabel
                }}<span v-if="botStatus.lastAttemptAt">
                  · Percobaan terakhir: {{ formatDateTime(botStatus.lastAttemptAt) }}</span
                >
              </p>
              <p>
                Berhasil terakhir:
                {{
                  botStatus.lastSuccessAt
                    ? formatDateTime(botStatus.lastSuccessAt)
                    : 'Belum ada catatan berhasil'
                }}.
              </p>
              <p v-if="botStatus.lastError" class="text-rose-700">
                Kegagalan tercatat {{ formatDateTime(botStatus.lastError.occurredAt) }}:
                {{ botStatus.lastError.message }}
              </p>
            </template>
            <p class="text-slate-500">
              Konfigurasi dan jadwal tidak menjamin proses berhasil; riwayat menampilkan eksekusi
              yang tercatat.
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        :disabled="isGenerating || botLoading || !!botError || !botStatus?.geminiConfigured"
        @click="triggerAutoGenerate"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all disabled:opacity-50 shrink-0"
      >
        <i v-if="isGenerating" class="pi pi-spin pi-spinner"></i>
        <i v-else class="pi pi-bolt text-amber-400"></i>
        <span>{{ isGenerating ? 'AI Sedang Menulis...' : 'Generate 1 Artikel Sekarang' }}</span>
      </button>
    </div>

    <ArticleEditorialPanel />

    <!-- Status Filter Tabs -->
    <div class="mb-6 flex gap-2">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        @click="statusFilter = tab.value"
        class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="
          statusFilter === tab.value
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        "
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== null"
          class="ml-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs"
          :class="
            statusFilter === tab.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          "
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Articles Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div v-if="loadError" class="p-4 bg-rose-50 text-rose-800 text-sm" role="alert">
        <p>Data artikel gagal dimuat. {{ loadError }}</p>
        <p v-if="articles.length" class="mt-1">Daftar di bawah berasal dari pemuatan sebelumnya.</p>
        <button type="button" @click="loadArticles" class="mt-2 underline font-semibold">
          Coba lagi artikel
        </button>
      </div>
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"
        ></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0 && !loadError" class="py-20 text-center">
        <i class="pi pi-file-edit text-4xl text-slate-300 mb-4"></i>
        <p class="text-slate-500 text-sm">
          {{
            search || statusFilter !== 'all'
              ? 'Tidak ada artikel sesuai pencarian dan status ini.'
              : 'Belum ada artikel. Mulai menulis artikel pertama Anda!'
          }}
        </p>
        <button
          @click="$router.push({ name: 'admin-article-create' })"
          class="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Tulis Artikel
        </button>
      </div>

      <!-- Table -->
      <table v-else-if="articles.length" class="w-full text-sm">
        <thead class="border-b border-slate-100 bg-slate-50/50">
          <tr>
            <th class="px-6 py-3 text-left font-semibold text-slate-600">Judul</th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
            <th
              class="px-6 py-3 text-left font-semibold text-slate-600"
              title="Checklist kelengkapan konten, bukan prediksi peringkat Google"
            >
              Kelengkapan SEO
            </th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600">Penulis</th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600">Tanggal</th>
            <th class="px-6 py-3 text-right font-semibold text-slate-600">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="article in articles"
            :key="article.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  v-if="article.coverImage"
                  class="h-10 w-14 shrink-0 rounded-lg bg-cover bg-center"
                  :style="{ backgroundImage: `url(${article.coverImage})` }"
                ></div>
                <div
                  v-else
                  class="h-10 w-14 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center"
                >
                  <i class="pi pi-image text-slate-300"></i>
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-slate-900 truncate">{{ article.title }}</p>
                  <p class="text-xs text-slate-500 truncate">/blog/{{ article.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="
                  article.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                "
              >
                <span
                  class="mr-1.5 h-1.5 w-1.5 rounded-full"
                  :class="article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'"
                ></span>
                {{ article.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="h-2 w-16 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="seoScoreColor(seoScore(article))"
                    :style="{ width: seoScore(article) + '%' }"
                  ></div>
                </div>
                <span class="text-xs font-medium text-slate-500">{{ seoScore(article) }}%</span>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-600">
              {{ article.author?.name || '-' }}
            </td>
            <td class="px-6 py-4 text-slate-500 text-xs">
              {{ formatDate(article.publishedAt || article.createdAt) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="$router.push({ name: 'admin-article-edit', params: { id: article.id } })"
                  class="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                <button
                  @click="confirmDelete(article)"
                  class="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Hapus"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="total > limit"
        class="flex items-center justify-between border-t border-slate-100 px-6 py-4"
      >
        <p class="text-sm text-slate-500">
          Menampilkan {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }} dari
          {{ total }} artikel
        </p>
        <div class="flex gap-2">
          <button
            @click="page > 1 && (page--, loadArticles())"
            :disabled="page <= 1"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            @click="page < totalPages && (page++, loadArticles())"
            :disabled="page >= totalPages"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import ArticleEditorialPanel from '@/components/admin/ArticleEditorialPanel.vue'
import {
  fetchAdminArticles,
  fetchAdminArticleBotStatus,
  deleteAdminArticle,
  autoGenerateAdminArticle,
} from '@/api/admin.js'
import { getArticleSeoScore as seoScore } from '@/utils/articleSeo.js'
import Swal from 'sweetalert2'

const articles = ref([])
const loading = ref(true)
const isGenerating = ref(false)
const search = ref('')
const page = ref(1)
const limit = ref(20)
const total = ref(0)
const statusFilter = ref('all')
const statusCounts = ref({ all: null, published: null, draft: null })
const loadError = ref('')
const botStatus = ref(null)
const botLoading = ref(true)
const botError = ref('')
let listRequestVersion = 0
let botRequestVersion = 0

const totalPages = computed(() => Math.ceil(total.value / limit.value))

const statusTabs = computed(() => [
  { label: 'Semua', value: 'all', count: statusCounts.value.all },
  {
    label: 'Published',
    value: 'published',
    count: statusCounts.value.published,
  },
  {
    label: 'Draft',
    value: 'draft',
    count: statusCounts.value.draft,
  },
])

const botBadge = computed(() => {
  if (botLoading.value) return { label: 'Memuat status', class: 'bg-slate-100 text-slate-600' }
  if (botError.value || !botStatus.value)
    return { label: 'Status belum tersedia', class: 'bg-amber-100 text-amber-800' }
  if (!botStatus.value.autoBlogEnabled)
    return { label: 'Jadwal nonaktif', class: 'bg-slate-100 text-slate-600' }
  if (!botStatus.value.geminiConfigured)
    return { label: 'Konfigurasi belum lengkap', class: 'bg-amber-100 text-amber-800' }
  return { label: 'Jadwal aktif', class: 'bg-violet-100 text-violet-800' }
})

const botRunLabel = computed(
  () =>
    ({
    succeeded: 'Catatan eksekusi terbaru: berhasil',
    failed: 'Catatan eksekusi terbaru: gagal',
      incomplete: 'Hasil percobaan terakhir belum tercatat',
      unknown: 'Belum ada catatan eksekusi',
    })[botStatus.value?.runState] || 'Riwayat belum diketahui',
)

const formatDateTime = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Waktu tidak tersedia'
    : `${date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })} WIB`
}

const loadBotStatus = async () => {
  const version = ++botRequestVersion
  botLoading.value = true
  botError.value = ''
  try {
    const result = await fetchAdminArticleBotStatus()
    if (version !== botRequestVersion) return
    if (
      !result ||
      typeof result.autoBlogEnabled !== 'boolean' ||
      typeof result.geminiConfigured !== 'boolean'
    )
      throw new Error('Respons status bot tidak lengkap.')
    botStatus.value = result
  } catch (error) {
    if (version === botRequestVersion)
      botError.value = error?.message || 'Coba kembali beberapa saat lagi.'
  } finally {
    if (version === botRequestVersion) botLoading.value = false
  }
}

const seoScoreColor = (score) => {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const loadArticles = async () => {
  const version = ++listRequestVersion
  loading.value = true
  loadError.value = ''
  try {
    const params = { page: page.value, limit: limit.value }
    if (search.value) params.q = search.value
    if (statusFilter.value !== 'all')
      params.filters = JSON.stringify({ status: statusFilter.value })
    const res = await fetchAdminArticles(params)
    if (version !== listRequestVersion) return
    articles.value = res.items || res.data || []
    total.value = res.total || 0
    statusCounts.value = res.statusCounts || { all: null, published: null, draft: null }
  } catch (e) {
    if (version === listRequestVersion)
      loadError.value = e?.message || 'Coba kembali beberapa saat lagi.'
  } finally {
    if (version === listRequestVersion) loading.value = false
  }
}

const confirmDelete = async (article) => {
  const result = await Swal.fire({
    title: 'Hapus Artikel?',
    text: `"${article.title}" akan dihapus permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })
  if (result.isConfirmed) {
    try {
      await deleteAdminArticle(article.id)
      await loadArticles()
      Swal.fire('Terhapus!', 'Artikel berhasil dihapus.', 'success')
    } catch (e) {
      Swal.fire('Gagal', e.message, 'error')
    }
  }
}

let searchTimeout = null
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    loadArticles()
  }, 300)
})

watch(statusFilter, () => {
  page.value = 1
  loadArticles()
})

const triggerAutoGenerate = async () => {
  const result = await Swal.fire({
    title: 'Generate Artikel dengan AI?',
    text: 'Gemini AI akan memilih topik pernikahan terbaik dan menulis artikel lengkap (1.200+ kata) beserta SEO & gambar cover.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: '⚡ Ya, Tulis Sekarang',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  isGenerating.value = true
  try {
    const article = await autoGenerateAdminArticle()
    await loadArticles()
    Swal.fire({
      title:
        article.status === 'published'
          ? 'Artikel berhasil diterbitkan'
          : 'Draft artikel berhasil dibuat',
      text: `"${article.title}" tersimpan sebagai ${article.status === 'published' ? 'artikel terbit' : 'draft'}.`,
      icon: 'success',
    })
  } catch (err) {
    Swal.fire(
      'Gagal Membuat Artikel',
      err?.message || 'Pastikan GEMINI_API_KEY sudah diset di backend .env',
      'error',
    )
  } finally {
    isGenerating.value = false
    loadBotStatus()
  }
}

onBeforeUnmount(() => {
  clearTimeout(searchTimeout)
  listRequestVersion++
  botRequestVersion++
})

loadArticles()
loadBotStatus()
</script>
