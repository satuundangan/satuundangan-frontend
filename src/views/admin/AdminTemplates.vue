<template>
  <AdminShell title="Template Desain" description="Kelola daftar template undangan" show-search :search="search"
    search-placeholder="Cari nama, slug, atau kategori" action-label="Tambah Template" @update:search="handleSearch"
    @action="openCreate">
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left font-medium text-slate-500">
          <tr>
            <th class="px-4 py-3">Nama</th>
            <th class="px-4 py-3">Slug</th>
            <th class="px-4 py-3">Kategori</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="template in templates" :key="template.id">
            <td class="px-4 py-3 font-medium text-slate-900">{{ template.name }}</td>
            <td class="px-4 py-3 text-slate-600">{{ template.slug }}</td>
            <td class="px-4 py-3 text-slate-600 capitalize">{{ template.category }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="template.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'">
                {{ template.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2 text-xs font-medium">
                <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50"
                  @click="openEdit(template)">Edit</button>
                <button class="rounded-lg border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50"
                  @click="confirmDelete(template)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && !templates.length">
            <td colspan="5" class="px-4 py-8 text-center text-slate-400">Tidak ada data</td>
          </tr>
          <tr v-if="loading">
            <td colspan="5" class="px-4 py-8 text-center text-slate-400">Memuat data…</td>
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
        <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Template' : 'Tambah Template' }}</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Nama</label>
              <input v-model="form.name" type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Slug</label>
              <input v-model="form.slug" type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Kategori</label>
              <input v-model="form.category" type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Preview URL</label>
              <input v-model="form.previewUrl" type="url"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Deskripsi</label>
              <textarea v-model="form.description" rows="3"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Tags (pisahkan dengan koma)</label>
              <input v-model="form.tags" type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
            </div>

            <!-- Palette Color UI -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Palette Colors</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <div v-for="(color, index) in form.paletteColor" :key="index"
                  class="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 pl-1 pr-2 py-1">
                  <input type="color" v-model="form.paletteColor[index]"
                    class="h-6 w-6 cursor-pointer rounded-full border-none bg-transparent p-0" />
                  <input type="text" v-model="form.paletteColor[index]"
                    class="w-20 bg-transparent text-xs font-mono outline-none" />
                  <button type="button" @click="removeColor(index)"
                    class="text-slate-400 hover:text-rose-500">×</button>
                </div>
                <button type="button" @click="addColor"
                  class="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-medium text-slate-500 hover:border-slate-400 hover:text-slate-600">
                  + Warna
                </button>
              </div>
            </div>

            <!-- Section Options UI -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Section Options</label>
              <div v-if="availableSections.length" class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                <label v-for="section in availableSections" :key="section.key"
                  class="flex items-center gap-2 rounded-lg border border-slate-200 p-2 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" :value="section.key" v-model="form.sectionOptions"
                    class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                  <span class="text-sm text-slate-700 capitalize">{{ section.label }}</span>
                </label>
              </div>
              <div v-else class="mt-2 text-sm text-slate-400 italic">
                Belum ada section yang tersedia. Tambahkan di menu Master Fitur.
              </div>
            </div>

            <div class="md:col-span-2 flex items-center gap-2">
              <input id="templateActive" v-model="form.isActive" type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
              <label for="templateActive" class="text-sm font-medium text-slate-600">Aktifkan template</label>
            </div>

            <div class="md:col-span-2 flex justify-end gap-2 pt-2 text-sm font-medium">
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
  fetchAdminTemplates,
  createAdminTemplate,
  updateAdminTemplate,
  deleteAdminTemplate,
} from '@/api/admin.js'
import { fetchAdminSections } from '@/api/master.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const templates = ref([])
const availableSections = ref([]) // Dynamic sections from DB
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
  slug: '',
  category: '',
  previewUrl: '',
  description: '',
  tags: '',
  paletteColor: [],
  sectionOptions: [],
  isActive: true,
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

async function loadData() {
  loading.value = true
  try {
    const [tmplRes, sectRes] = await Promise.all([
      fetchAdminTemplates({ page: page.value, limit, q: search.value }),
      fetchAdminSections() // Fetch all active sections
    ])

    templates.value = tmplRes.data
    total.value = tmplRes.total

    availableSections.value = sectRes || []
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

function addColor() {
  form.paletteColor.push('#000000')
}

function removeColor(index) {
  form.paletteColor.splice(index, 1)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    name: '',
    slug: '',
    category: '',
    previewUrl: '',
    description: '',
    tags: '',
    paletteColor: ['#FFFFFF', '#000000'],
    // Default: auto-select sections that are marked as 'active' globally if desired,
    // or start empty. Let's start empty or all. Let's start with all active ones.
    sectionOptions: availableSections.value.filter(s => s.is_active).map(s => s.key),
    isActive: true,
  })
  showForm.value = true
}

function openEdit(template) {
  editing.value = template

  let pColor = []
  if (Array.isArray(template.paletteColor)) {
    pColor = template.paletteColor
  } else if (typeof template.paletteColor === 'string') {
    try { pColor = JSON.parse(template.paletteColor) } catch { }
  }

  let sOptions = []
  if (Array.isArray(template.sectionOptions)) {
    sOptions = template.sectionOptions
  } else if (typeof template.sectionOptions === 'object' && template.sectionOptions !== null) {
    sOptions = Object.keys(template.sectionOptions).filter(k => template.sectionOptions[k])
  } else if (typeof template.sectionOptions === 'string') {
    try {
      const parsed = JSON.parse(template.sectionOptions)
      if (Array.isArray(parsed)) sOptions = parsed
      else sOptions = Object.keys(parsed).filter(k => parsed[k])
    } catch { }
  }

  Object.assign(form, {
    name: template.name || '',
    slug: template.slug || '',
    category: template.category || '',
    previewUrl: template.previewUrl || '',
    description: template.description || '',
    tags: Array.isArray(template.tags) ? template.tags.join(', ') : template.tags || '',
    paletteColor: pColor,
    sectionOptions: sOptions,
    isActive: Boolean(template.isActive),
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  saving.value = false
}

function buildPayload() {
  const payload = {
    name: form.name,
    slug: form.slug,
    category: form.category,
    previewUrl: form.previewUrl,
    description: form.description || null,
    isActive: form.isActive,
    paletteColor: form.paletteColor,
    sectionOptions: form.sectionOptions
  }

  if (form.tags) {
    payload.tags = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
  }

  return payload
}

async function submitForm() {
  if (saving.value) return
  try {
    const payload = buildPayload()
    saving.value = true
    if (editing.value) {
      await updateAdminTemplate(editing.value.id, payload)
      toast.success('Template diperbarui')
    } else {
      await createAdminTemplate(payload)
      toast.success('Template dibuat')
    }
    showForm.value = false
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan template')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(template) {
  const result = await Swal.fire({
    title: 'Hapus template?',
    text: `Template ${template.name} akan dihapus`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminTemplate(template.id)
    toast.success('Template dihapus')
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus template')
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
