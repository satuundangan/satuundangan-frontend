<template>
  <AdminShell title="Kategori" description="Kelola daftar kategori template" show-search :search="search"
    search-placeholder="Cari nama kategori" action-label="Tambah Kategori" @update:search="handleSearch"
    @action="openCreate">
    <DataTable
      :headers="headers"
      :items="categories"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="setPage"
    >
      <template #cell(name)="{ item }">
        <span class="font-medium text-slate-900">{{ item.name }}</span>
      </template>
      <template #cell(color)="{ item }">
        <div class="flex items-center gap-2">
          <span class="block h-6 w-6 rounded-full border border-slate-200"
            :style="{ backgroundColor: item.color || '#000000' }"></span>
          <span class="font-mono text-xs">{{ item.color }}</span>
        </div>
      </template>
      <template #cell(actions)="{ item }">
        <div class="flex justify-end gap-2 text-xs font-medium">
          <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 transition-colors"
            @click="openEdit(item)">Edit</button>
          <button class="rounded-lg border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50 transition-colors"
            @click="confirmDelete(item)">Hapus</button>
        </div>
      </template>
    </DataTable>

    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Kategori' : 'Tambah Kategori' }}</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="grid grid-cols-1 gap-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Nama</label>
              <input v-model="form.name" type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Warna</label>
              <div class="mt-2 flex items-center gap-2">
                <input type="color" v-model="form.color"
                  class="h-10 w-10 cursor-pointer rounded-lg border-none bg-transparent p-0" />
                <input type="text" v-model="form.color"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" placeholder="#000000" />
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
import DataTable from '@/components/admin/DataTable.vue'
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const categories = ref([])
const total = ref(0)
const page = ref(1)
const limit = 10
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const headers = [
  { label: 'Nama', key: 'name' },
  { label: 'Warna', key: 'color' },
  { label: 'Aksi', key: 'actions', class: 'text-right' },
]

const form = reactive({
  name: '',
  color: '#000000',
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchAdminCategories({ page: page.value, limit, q: search.value })
    categories.value = res.data || []
    total.value = res.total || 0
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
    color: '#000000',
  })
  showForm.value = true
}

function openEdit(category) {
  editing.value = category
  Object.assign(form, {
    name: category.name || '',
    color: category.color || '#000000',
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
      await updateAdminCategory(editing.value.id, { ...form })
      toast.success('Kategori diperbarui')
    } else {
      await createAdminCategory({ ...form })
      toast.success('Kategori dibuat')
    }
    showForm.value = false
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan kategori')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(category) {
  const result = await Swal.fire({
    title: 'Hapus kategori?',
    text: `Kategori ${category.name} akan dihapus`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminCategory(category.id)
    toast.success('Kategori dihapus')
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus kategori')
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
