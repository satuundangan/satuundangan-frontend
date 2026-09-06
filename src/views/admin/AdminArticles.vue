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
            statusFilter === tab.value
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-500'
          "
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Articles Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="py-20 text-center">
        <i class="pi pi-file-edit text-4xl text-slate-300 mb-4"></i>
        <p class="text-slate-500 text-sm">Belum ada artikel. Mulai menulis artikel pertama Anda!</p>
        <button
          @click="$router.push({ name: 'admin-article-create' })"
          class="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Tulis Artikel
        </button>
      </div>

      <!-- Table -->
      <table v-else class="w-full text-sm">
        <thead class="border-b border-slate-100 bg-slate-50/50">
          <tr>
            <th class="px-6 py-3 text-left font-semibold text-slate-600">Judul</th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600">SEO Score</th>
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
                  <p class="text-xs text-slate-400 truncate">/blog/{{ article.slug }}</p>
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
                  class="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                <button
                  @click="confirmDelete(article)"
                  class="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
import { ref, watch, computed } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminArticles, deleteAdminArticle } from '@/api/admin.js'
import Swal from 'sweetalert2'

const articles = ref([])
const loading = ref(true)
const search = ref('')
const page = ref(1)
const limit = ref(20)
const total = ref(0)
const statusFilter = ref('all')

const totalPages = computed(() => Math.ceil(total.value / limit.value))

const statusTabs = computed(() => [
  { label: 'Semua', value: 'all', count: total.value },
  {
    label: 'Published',
    value: 'published',
    count: articles.value.filter((a) => a.status === 'published').length,
  },
  {
    label: 'Draft',
    value: 'draft',
    count: articles.value.filter((a) => a.status === 'draft').length,
  },
])

const seoScore = (article) => {
  let score = 0
  const checks = [
    article.metaTitle,
    article.metaDescription,
    article.focusKeyword,
    article.excerpt,
    article.coverImage || article.ogImage,
  ]
  checks.forEach((c) => {
    if (c) score += 20
  })
  return score
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
  loading.value = true
  try {
    const params = { page: page.value, limit: limit.value }
    if (search.value) params.q = search.value
    if (statusFilter.value !== 'all') params.filters = JSON.stringify({ status: statusFilter.value })
    const res = await fetchAdminArticles(params)
    articles.value = res.items || res.data || []
    total.value = res.total || 0
  } catch (e) {
    console.error('Failed to load articles:', e)
    articles.value = []
  } finally {
    loading.value = false
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

loadArticles()
</script>
