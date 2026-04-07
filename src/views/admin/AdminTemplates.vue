<template>
  <AdminShell title="Template Desain" description="Kelola daftar template undangan" show-search :search="search"
    search-placeholder="Cari nama, slug, atau kategori" action-label="Tambah Template" @update:search="handleSearch"
    @action="openCreate">
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left font-medium text-slate-500">
          <tr>
            <th class="px-4 py-3 w-16">Preview</th>
            <th class="px-4 py-3">Nama</th>
            <th class="px-4 py-3">Slug</th>
            <th class="px-4 py-3">Kategori</th>
            <th class="px-4 py-3">Harga</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="template in templates" :key="template.id">
            <td class="px-4 py-3">
              <div class="h-10 w-10 rounded border border-slate-200 bg-slate-50 overflow-hidden">
                <img :src="template.thumbnailUrl || template.previewUrl" class="h-full w-full object-cover" v-if="template.thumbnailUrl || template.previewUrl" />
                <div class="h-full w-full flex items-center justify-center text-slate-300" v-else>
                  <i class="fa-solid fa-image text-xs"></i>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 font-medium text-slate-900">{{ template.name }}</td>
            <td class="px-4 py-3 text-slate-600">{{ template.slug }}</td>
            <td class="px-4 py-3 text-slate-600 capitalize">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">
                <span class="h-2 w-2 rounded-full"
                  :style="{ backgroundColor: getCategoryColor(template.category) }"></span>
                {{ template.category }}
              </span>
            </td>
            <td class="px-4 py-3 text-slate-600">
              {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(template.price || 0) }}
            </td>
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
            <td colspan="6" class="px-4 py-8 text-center text-slate-400">Tidak ada data</td>
          </tr>
          <tr v-if="loading">
            <td colspan="6" class="px-4 py-8 text-center text-slate-400">Memuat data…</td>
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
              <select v-model="form.category"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required>
                <option value="" disabled>Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Harga (Rp)</label>
              <input v-model="form.price" type="number" min="0"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Preview URL (Opsional)</label>
              <input v-model="form.previewUrl" type="url"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                placeholder="https://demo.satuundangan.id/template-a" />
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Thumbnail URL</label>
              <div class="mt-2 flex gap-2">
                <input v-model="form.thumbnailUrl" type="url"
                  class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="https://example.com/image.jpg" />
                <button type="button" @click="triggerThumbnailUpload"
                  class="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Upload</button>
                <input type="file" ref="thumbnailInput" class="hidden" accept="image/*" @change="handleThumbnailUpload" />
              </div>
              <div v-if="form.thumbnailUrl" class="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img :src="form.thumbnailUrl" class="w-full h-full object-cover" />
                <button @click="form.thumbnailUrl = ''" class="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-rose-500 hover:text-rose-700">×</button>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Deskripsi</label>
              <textarea v-model="form.description" rows="3"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
            </div>

            <!-- Tags Input UI -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Tags</label>
              <div
                class="mt-2 flex flex-wrap gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                <span v-for="(tag, index) in form.tags" :key="index"
                  class="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {{ tag }}
                  <button type="button" @click="removeTag(index)" class="text-slate-400 hover:text-rose-500">×</button>
                </span>
                <input v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.comma.prevent="addTag" @blur="addTag"
                  type="text" placeholder="Ketik tag dan enter..."
                  class="min-w-[120px] flex-1 bg-transparent text-sm outline-none" />
              </div>
              <p class="mt-1 text-xs text-slate-500">Tekan Enter atau Koma untuk menambahkan tag.</p>
            </div>

            <!-- Palette UI -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Palette Warna</label>
              <div class="mt-2 space-y-4">
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="paletteType" value="preset" class="text-slate-900" />
                    <span class="text-sm">Gunakan Preset</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="paletteType" value="custom" class="text-slate-900" />
                    <span class="text-sm font-bold text-indigo-600">Warna Custom (All-in-One)</span>
                  </label>
                </div>

                <!-- Preset Selection -->
                <div v-if="paletteType === 'preset'" class="flex items-center gap-3">
                  <select v-model="form.paletteId"
                    class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
                    <option value="" disabled>Pilih Palette</option>
                    <option v-for="pal in palettes" :key="pal.id" :value="pal.id">
                      {{ pal.name }}
                    </option>
                  </select>
                  <div v-if="selectedPalette" class="flex -space-x-2 shrink-0">
                    <span class="block h-9 w-9 rounded-full border-2 border-white shadow-sm"
                      :style="{ backgroundColor: selectedPalette.primary }" :title="'Primary: ' + selectedPalette.primary"></span>
                    <span class="block h-9 w-9 rounded-full border-2 border-white shadow-sm"
                      :style="{ backgroundColor: selectedPalette.secondary }" :title="'Secondary: ' + selectedPalette.secondary"></span>
                    <span class="block h-9 w-9 rounded-full border-2 border-white shadow-sm"
                      :style="{ backgroundColor: selectedPalette.accent }" :title="'Accent: ' + selectedPalette.accent"></span>
                  </div>
                </div>

                <!-- Custom Color Pickers -->
                <div v-if="paletteType === 'custom'" class="grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <div class="space-y-2">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Primary</label>
                    <div class="flex items-center gap-2">
                      <input type="color" v-model="customPalette.primary" class="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 bg-transparent" />
                      <input type="text" v-model="customPalette.primary" class="w-full text-[10px] font-mono border-b border-slate-200 bg-transparent uppercase" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Secondary</label>
                    <div class="flex items-center gap-2">
                      <input type="color" v-model="customPalette.secondary" class="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 bg-transparent" />
                      <input type="text" v-model="customPalette.secondary" class="w-full text-[10px] font-mono border-b border-slate-200 bg-transparent uppercase" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Accent</label>
                    <div class="flex items-center gap-2">
                      <input type="color" v-model="customPalette.accent" class="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 bg-transparent" />
                      <input type="text" v-model="customPalette.accent" class="w-full text-[10px] font-mono border-b border-slate-200 bg-transparent uppercase" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Options UI -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Section Options & Urutan</label>
              <div v-if="availableSections.length" class="mt-2 space-y-2">
                <div v-for="section in availableSections" :key="section.id"
                  class="flex items-center gap-4 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                  <input type="checkbox" :checked="isSectionEnabled(section.id)"
                    @change="toggleSection(section.id)"
                    class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                  
                  <span class="text-sm text-slate-700 font-medium min-w-[140px]">{{ section.label }}</span>
                  
                  <div class="flex items-center gap-2 ml-auto">
                    <span class="text-[10px] uppercase text-slate-400 font-bold">Urutan:</span>
                    <input type="number" 
                      :value="getSectionOrder(section.id)"
                      @input="updateSectionOrder(section.id, $event.target.value)"
                      class="w-16 rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:border-slate-400"
                      min="1" />
                  </div>
                </div>
              </div>
              <div v-else class="mt-2 text-sm text-slate-400 italic">
                Belum ada section yang tersedia. Tambahkan di menu Master Fitur.
              </div>
            </div>

            <div class="md:col-span-2 flex flex-wrap gap-6">
              <div class="flex items-center gap-2">
                <input id="templateActive" v-model="form.isActive" type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                <label for="templateActive" class="text-sm font-medium text-slate-600">Aktifkan template</label>
              </div>
              <div class="flex items-center gap-2">
                <input id="templatePremium" v-model="form.isPremium" type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                <label for="templatePremium" class="text-sm font-medium text-slate-600 font-bold text-amber-600">Template Premium</label>
              </div>
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
  fetchAdminCategories,
  fetchAdminPalettes,
} from '@/api/admin.js'
import { fetchAdminSections } from '@/api/master.js'
import { uploadFileApi } from '@/api/file.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const thumbnailInput = ref(null)
const templates = ref([])
const categories = ref([])
const palettes = ref([])
const availableSections = ref([]) // Dynamic sections from DB
const total = ref(0)
const page = ref(1)
const limit = 10
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const tagInput = ref('')
const paletteType = ref('preset') // 'preset' | 'custom'
const customPalette = reactive({
  primary: '#0F172A',
  secondary: '#64748B',
  accent: '#38BDF8'
})

const form = reactive({
  name: '',
  slug: '',
  category: '',
  price: 0,
  previewUrl: '',
  thumbnailUrl: '',
  description: '',
  tags: [],
  paletteId: '',
  sections: [],
  isActive: true,
  isPremium: false,
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const selectedPalette = computed(() => {
  if (!form.paletteId) return null
  return palettes.value.find(p => p.id === form.paletteId)
})

async function loadData() {
  loading.value = true
  try {
    const [tmplRes, catRes, sectRes, palRes] = await Promise.all([
      fetchAdminTemplates({ page: page.value, limit, q: search.value }),
      fetchAdminCategories({ limit: 100 }), // Get all categories
      fetchAdminSections({ limit: 100 }), // Fetch all active sections
      fetchAdminPalettes({ limit: 100 })
    ])

    templates.value = tmplRes.data
    total.value = tmplRes.total

    categories.value = catRes.data || catRes
    availableSections.value = sectRes.data || sectRes
    palettes.value = palRes.data || palRes
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

function getCategoryColor(categoryName) {
  const cat = categories.value.find(c => c.name === categoryName)
  return cat ? cat.color : '#cbd5e1'
}

function isSectionEnabled(sectionId) {
  return form.sections.some(s => s.sectionId === sectionId && s.is_enabled)
}

function getSectionOrder(sectionId) {
  const s = form.sections.find(s => s.sectionId === sectionId)
  return s ? s.order : 1
}

function updateSectionOrder(sectionId, val) {
  const index = form.sections.findIndex(s => s.sectionId === sectionId)
  if (index > -1) {
    form.sections[index].order = Number(val)
  } else {
    form.sections.push({
      sectionId,
      order: Number(val),
      is_enabled: false
    })
  }
}

function toggleSection(sectionId) {
  const index = form.sections.findIndex(s => s.sectionId === sectionId)
  if (index > -1) {
    form.sections[index].is_enabled = !form.sections[index].is_enabled
  } else {
    // If not found, add it as enabled
    form.sections.push({
      sectionId,
      order: form.sections.length + 1,
      is_enabled: true
    })
  }
}

function triggerThumbnailUpload() {
  thumbnailInput.value?.click()
}

async function handleThumbnailUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  try {
    const res = await uploadFileApi(file)
    form.thumbnailUrl = res.fileUrl
    toast.success('Thumbnail berhasil diupload')
  } catch (error) {
    toast.error('Gagal mengupload thumbnail')
  } finally {
    event.target.value = ''
  }
}

function addTag() {
  const val = tagInput.value.trim()
  if (val && !form.tags.includes(val)) {
    form.tags.push(val)
  }
  tagInput.value = ''
}

function removeTag(index) {
  form.tags.splice(index, 1)
}

function openCreate() {
  editing.value = null
  tagInput.value = ''
  paletteType.value = 'preset'
  Object.assign(customPalette, { primary: '#0F172A', secondary: '#64748B', accent: '#38BDF8' })
  Object.assign(form, {
    name: '',
    slug: '',
    category: '',
    price: 0,
    previewUrl: '',
    thumbnailUrl: '',
    description: '',
    tags: [],
    paletteId: '',
    sections: availableSections.value.map((s, index) => ({
      sectionId: s.id,
      order: index + 1,
      is_enabled: true
    })),
    isActive: true,
    isPremium: false,
  })
  showForm.value = true
}

function openEdit(template) {
  editing.value = template
  tagInput.value = ''

  // Determine palette type
  if (template.paletteId || template.palette) {
    paletteType.value = 'preset'
  } else if (template.paletteColors && template.paletteColors.length >= 3) {
    paletteType.value = 'custom'
    customPalette.primary = template.paletteColors[0]
    customPalette.secondary = template.paletteColors[1]
    customPalette.accent = template.paletteColors[2]
  } else {
    paletteType.value = 'preset'
  }

  let tags = []
  if (Array.isArray(template.tags)) {
    tags = [...template.tags]
  } else if (typeof template.tags === 'string') {
    tags = template.tags.split(',').map(t => t.trim()).filter(Boolean)
  }

  // Map existing sections or initialize with available ones
  const templateSections = Array.isArray(template.sections) ? template.sections : []
  const sections = availableSections.value.map((s, index) => {
    const existing = templateSections.find(ts => ts.sectionId === s.id || ts.id === s.id)
    return {
      sectionId: s.id,
      order: existing ? existing.order : index + 1,
      is_enabled: existing ? existing.is_enabled : false
    }
  })

  Object.assign(form, {
    name: template.name || '',
    slug: template.slug || '',
    category: template.category || '',
    price: template.price || 0,
    previewUrl: template.previewUrl || '',
    thumbnailUrl: template.thumbnailUrl || '',
    description: template.description || '',
    tags: tags,
    paletteId: template.paletteId || (template.palette ? template.palette.id : ''),
    sections: sections,
    isActive: Boolean(template.isActive),
    isPremium: Boolean(template.isPremium),
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
    price: Number(form.price),
    previewUrl: form.previewUrl,
    thumbnailUrl: form.thumbnailUrl || null,
    description: form.description || null,
    isActive: form.isActive,
    isPremium: form.isPremium,
    sections: form.sections.map(s => ({
      sectionId: s.sectionId,
      order: s.order,
      is_enabled: s.is_enabled
    })),
    tags: form.tags
  }

  if (paletteType.value === 'preset') {
    payload.paletteId = form.paletteId
    payload.paletteColors = null
  } else {
    payload.paletteId = null
    payload.paletteColors = [customPalette.primary, customPalette.secondary, customPalette.accent]
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
