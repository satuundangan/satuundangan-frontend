<template>
  <AdminShell title="Palette Warna" description="Kelola daftar kombinasi warna (palette) untuk template" show-search :search="search"
    search-placeholder="Cari nama palette" action-label="Tambah Palette" @update:search="handleSearch"
    @action="openCreate">
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left font-medium text-slate-500">
          <tr>
            <th class="px-4 py-3">Nama Palette</th>
            <th class="px-4 py-3">Kombinasi Warna</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="palette in palettes" :key="palette.id">
            <td class="px-4 py-3 font-medium text-slate-900">{{ palette.name }}</td>
            <td class="px-4 py-3 text-slate-600">
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <span class="block h-8 w-8 rounded-full border-2 border-white shadow-sm"
                    :style="{ backgroundColor: palette.primary || '#FFFFFF' }" :title="palette.primary"></span>
                  <span class="block h-8 w-8 rounded-full border-2 border-white shadow-sm"
                    :style="{ backgroundColor: palette.secondary || '#FFFFFF' }" :title="palette.secondary"></span>
                  <span class="block h-8 w-8 rounded-full border-2 border-white shadow-sm"
                    :style="{ backgroundColor: palette.accent || '#FFFFFF' }" :title="palette.accent"></span>
                </div>
                <span class="ml-2 font-mono text-[10px] text-slate-400">
                  {{ palette.primary }}, {{ palette.secondary }}, {{ palette.accent }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2 text-xs font-medium">
                <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50"
                  @click="openEdit(palette)">Edit</button>
                <button class="rounded-lg border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50"
                  @click="confirmDelete(palette)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && !palettes.length">
            <td colspan="3" class="px-4 py-8 text-center text-slate-400">Tidak ada data</td>
          </tr>
          <tr v-if="loading">
            <td colspan="3" class="px-4 py-8 text-center text-slate-400">Memuat data…</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="total > limit" class="mt-4 flex items-center justify-between text-sm text-slate-600">
      <p>Menampilkan halaman {{ page }} dari {{ totalPages }}</p>
      <div class="flex items-center gap-2">
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page === 1" @click="setPage(page - 1)">Sebelumnya</button>
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page === totalPages" @click="setPage(page + 1)">Berikutnya</button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Palette' : 'Tambah Palette' }}</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="grid grid-cols-1 gap-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Nama Palette</label>
              <input v-model="form.name" type="text" placeholder="Contoh: Modern Elegant"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            
            <div class="space-y-3">
              <label class="text-sm font-medium text-slate-600">Kombinasi Warna</label>
              
              <div class="flex items-center gap-3">
                <input type="color" v-model="form.primary"
                  class="h-10 w-10 cursor-pointer rounded-lg border-none bg-transparent p-0" />
                <div class="flex-1">
                   <p class="text-[10px] text-slate-400 font-medium uppercase mb-1">Warna Utama</p>
                   <input type="text" v-model="form.primary"
                    class="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
                    pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" placeholder="#FFFFFF" />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <input type="color" v-model="form.secondary"
                  class="h-10 w-10 cursor-pointer rounded-lg border-none bg-transparent p-0" />
                <div class="flex-1">
                   <p class="text-[10px] text-slate-400 font-medium uppercase mb-1">Warna Sekunder</p>
                   <input type="text" v-model="form.secondary"
                    class="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
                    pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" placeholder="#FFFFFF" />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <input type="color" v-model="form.accent"
                  class="h-10 w-10 cursor-pointer rounded-lg border-none bg-transparent p-0" />
                <div class="flex-1">
                   <p class="text-[10px] text-slate-400 font-medium uppercase mb-1">Warna Aksen / Text</p>
                   <input type="text" v-model="form.accent"
                    class="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
                    pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" placeholder="#FFFFFF" />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 text-sm font-medium">
              <button type="button" class="rounded-lg border border-slate-200 px-4 py-2"
                @click="closeForm">Batal</button>
              <button type="submit" :disabled="saving"
                class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60">
                {{ saving ? 'Menyimpan…' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  fetchAdminPalettes,
  createAdminPalette,
  updateAdminPalette,
  deleteAdminPalette,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const palettes = ref([])
const total = ref(0)
const page = ref(1)
const limit = 10
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const form = reactive({
  name: '',
  primary: '#FFFFFF',
  secondary: '#F3F4F6',
  accent: '#1F2937',
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

async function loadData() {
  loading.value = true
  try {
    const res = await fetchAdminPalettes({ page: page.value, limit, q: search.value })
    // Handle both paginated object { data, total } and direct array [ ... ]
    if (res && res.data && Array.isArray(res.data)) {
      palettes.value = res.data
      total.value = res.total || res.data.length
    } else if (Array.isArray(res)) {
      palettes.value = res
      total.value = res.length
    } else {
      palettes.value = []
      total.value = 0
    }
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadData(), 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function setPage(newPage) {
  page.value = newPage
  loadData()
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    name: '',
    primary: '#FFFFFF',
    secondary: '#F3F4F6',
    accent: '#1F2937',
  })
  showForm.value = true
}

function openEdit(palette) {
  editing.value = palette
  Object.assign(form, {
    name: palette.name || '',
    primary: palette.primary || '#FFFFFF',
    secondary: palette.secondary || '#FFFFFF',
    accent: palette.accent || '#FFFFFF',
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  saving.value = false
}

async function submitForm() {
  if (saving.value) return
  try {
    saving.value = true
    if (editing.value) {
      await updateAdminPalette(editing.value.id, { ...form })
      toast.success('Palette diperbarui')
    } else {
      await createAdminPalette({ ...form })
      toast.success('Palette dibuat')
    }
    showForm.value = false
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan palette')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(palette) {
  const result = await Swal.fire({
    title: 'Hapus palette?',
    text: `Palette ${palette.name} akan dihapus`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminPalette(palette.id)
    toast.success('Palette dihapus')
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus palette')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
