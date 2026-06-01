<template>
  <AdminShell title="Master Fitur (Sections)" description="Kelola daftar fitur/section yang tersedia untuk template"
    show-search :search="search" search-placeholder="Cari label atau key" action-label="Tambah Section"
    @update:search="handleSearch" @action="openCreate">
    <DataTable
      :headers="headers"
      :items="sections"
      :loading="loading"
    >
      <template #cell(label)="{ item }">
        <span class="font-medium text-slate-900">{{ item.label }}</span>
      </template>
      <template #cell(key)="{ item }">
        <span class="font-mono text-slate-600">{{ item.key }}</span>
      </template>
      <template #cell(is_active)="{ item }">
        <span class="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
          :class="item.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'">
          {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
        </span>
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

    <!-- Modal Form -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Section' : 'Tambah Section' }}</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Label (Nama Tampilan)</label>
              <input v-model="form.label" type="text" placeholder="Contoh: Love Story"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Key (Kode Unik)</label>
              <input v-model="form.key" type="text" placeholder="Contoh: loveStory"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
              <p class="mt-1 text-xs text-slate-400">Digunakan oleh frontend untuk logika coding. Jangan pakai spasi.
              </p>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input id="sectionActive" v-model="form.is_active" type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
              <label for="sectionActive" class="text-sm font-medium text-slate-600">Aktif</label>
            </div>

            <div class="flex justify-end gap-2 pt-4 text-sm font-medium">
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
import { onMounted, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { fetchAdminSections, createAdminSection, updateAdminSection, deleteAdminSection } from '@/api/master.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const sections = ref([])
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const headers = [
  { label: 'Label (Nama Fitur)', key: 'label' },
  { label: 'Key (Kode Sistem)', key: 'key' },
  { label: 'Status', key: 'is_active' },
  { label: 'Aksi', key: 'actions', class: 'text-right' },
]

const form = reactive({
  label: '',
  key: '',
  is_active: true,
})

async function loadSections() {
  loading.value = true
  try {
    const res = await fetchAdminSections({ q: search.value })
    const rawData = Array.isArray(res) ? res : (res.data || [])
    sections.value = rawData.map(item => ({
      ...item,
      is_active: !!item.is_active
    }))
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadSections(), 300)

function handleSearch(value) {
  search.value = value
  debouncedSearch()
}

function openCreate() {
  editing.value = null
  Object.assign(form, { label: '', key: '', is_active: true })
  showForm.value = true
}

function openEdit(item) {
  editing.value = item
  Object.assign(form, {
    label: item.label,
    key: item.key,
    is_active: !!item.is_active,
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function submitForm() {
  if (saving.value) return
  saving.value = true
  try {
    if (editing.value) {
      await updateAdminSection(editing.value.id, form)
      toast.success('Data diperbarui')
    } else {
      await createAdminSection(form)
      toast.success('Data ditambahkan')
    }
    showForm.value = false
    loadSections()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(item) {
  const result = await Swal.fire({
    title: 'Hapus section?',
    text: `Section "${item.label}" akan dihapus.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminSection(item.id)
    toast.success('Data dihapus')
    loadSections()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus')
  }
}

onMounted(() => {
  loadSections()
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
