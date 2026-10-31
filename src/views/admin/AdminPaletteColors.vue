<template>
  <AdminShell
    title="Master Palet"
    description="Lihat warna master dan template yang menautkannya."
    show-search
    :search="search"
    search-placeholder="Cari nama palet"
    @update:search="handleSearch"
  >
    <p class="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
      Jumlah pemakaian menghitung template yang menautkan master palet. Warna khusus tersimpan di
      template tidak masuk hitungan. Pratinjau ini membantu pemeriksaan awal dan tidak menggantikan
      pengecekan kontras di tampilan undangan.
    </p>

    <AdminTableStatus
      :error="loadError"
      :loading="loading"
      :count="palettes.length"
      :filtered="Boolean(search)"
      :updated-at="lastLoadedAt"
      @retry="loadPalettes"
      @reset="resetSearch"
    />

    <div v-if="!loadError && palettes.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="palette in palettes"
        :key="palette.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="mb-4 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="truncate text-sm font-bold text-slate-900">{{ palette.name }}</h2>
            <p class="mt-1 text-xs text-slate-500">
              {{ palette.is_active ? 'Aktif' : 'Nonaktif' }}
            </p>
          </div>
          <span class="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
            {{ palette.templateUseCount ?? 0 }} template
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2" :aria-label="`Pratinjau warna ${palette.name}`">
          <div
            v-for="color in paletteColors(palette)"
            :key="color.label"
            class="overflow-hidden rounded-lg border border-slate-200"
          >
            <div class="h-12" :style="{ backgroundColor: color.value }"></div>
            <p class="truncate px-2 py-1.5 text-[10px] font-medium text-slate-600">
              {{ color.label }} · {{ color.value || '—' }}
            </p>
          </div>
        </div>
      </article>
    </div>

    <div
      v-if="!loading && !loadError && !palettes.length"
      class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500"
    >
      {{ search ? 'Tidak ada palet yang cocok.' : 'Belum ada master palet.' }}
    </div>

    <div v-if="totalPages > 1 && !loadError" class="mt-5 flex items-center justify-between gap-3">
      <p class="text-xs text-slate-500">{{ total }} palet · halaman {{ page }} dari {{ totalPages }}</p>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50"
          :disabled="page <= 1 || loading"
          @click="changePage(page - 1)"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50"
          :disabled="page >= totalPages || loading"
          @click="changePage(page + 1)"
        >
          Berikutnya
        </button>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import AdminTableStatus from '@/components/admin/AdminTableStatus.vue'
import { fetchAdminPaletteColors } from '@/api/master.js'

const palettes = ref([])
const search = ref('')
const page = ref(1)
const total = ref(0)
const limit = 20
const loading = ref(false)
const loadError = ref('')
const lastLoadedAt = ref(null)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

function paletteColors(palette) {
  return [
    { label: 'Primary', value: palette.primary },
    { label: 'Secondary', value: palette.secondary },
    { label: 'Accent', value: palette.accent },
  ]
}

async function loadPalettes() {
  loading.value = true
  loadError.value = ''
  try {
    const result = await fetchAdminPaletteColors({ page: page.value, limit, q: search.value })
    palettes.value = Array.isArray(result?.data) ? result.data : []
    total.value = Number(result?.total || 0)
    lastLoadedAt.value = new Date()
  } catch (error) {
    palettes.value = []
    total.value = 0
    loadError.value = error.message || 'Gagal memuat master palet.'
  } finally {
    loading.value = false
  }
}

function changePage(nextPage) {
  page.value = nextPage
  loadPalettes()
}

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedLoad()
}

function resetSearch() {
  handleSearch('')
}

const debouncedLoad = useDebounceFn(loadPalettes, 300)
onMounted(loadPalettes)
</script>
