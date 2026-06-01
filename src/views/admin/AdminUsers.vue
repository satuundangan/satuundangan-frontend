<template>
  <AdminShell
    title="Pengguna"
    description="Kelola akun pengguna platform"
    show-search
    :search="search"
    search-placeholder="Cari nama atau email"
    action-label="Tambah Pengguna"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <DataTable
      :headers="headers"
      :items="users"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="setPage"
    >
      <template #cell(name)="{ item }">
        <span class="font-medium text-slate-900">{{ item.name || '-' }}</span>
      </template>
      <template #cell(role)="{ item }">
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" :class="item.isAdmin ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-600'">
          {{ item.isAdmin ? 'Admin' : 'User' }}
        </span>
      </template>
      <template #cell(actions)="{ item }">
        <div class="flex justify-end gap-2 text-xs font-medium">
          <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 transition-colors" @click="openEdit(item)">Edit</button>
          <button class="rounded-lg border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50 transition-colors" @click="confirmDelete(item)">Hapus</button>
        </div>
      </template>
    </DataTable>

    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Pengguna' : 'Tambah Pengguna' }}</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Nama</label>
              <input v-model="form.name" type="text" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" required />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Email</label>
              <input v-model="form.email" type="email" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" required />
            </div>

            <div class="flex items-center gap-2">
              <input
                id="isAdmin"
                v-model="form.isAdmin"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              <label for="isAdmin" class="text-sm font-medium text-slate-600">Jadikan admin</label>
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Password</label>
              <input v-model="form.password" type="password" :required="!editing" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" :placeholder="editing ? 'Kosongkan jika tidak ingin mengubah' : 'Minimal 6 karakter'" />
            </div>

            <div class="flex justify-end gap-2 pt-2 text-sm font-medium">
              <button type="button" class="rounded-lg border border-slate-200 px-4 py-2" @click="closeForm">Batal</button>
              <button type="submit" :disabled="saving" class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60">
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
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from '@/components/admin/DataTable.vue'
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const users = ref([])
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
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
  { label: 'Aksi', key: 'actions', class: 'text-right' },
]

const form = reactive({
  name: '',
  email: '',
  isAdmin: false,
  password: '',
})

async function loadUsers() {
  loading.value = true
  try {
    const res = await fetchAdminUsers({ page: page.value, limit, q: search.value })
    users.value = res.data
    total.value = res.total
  } catch (error) {
    toast.error(error.message || 'Gagal memuat pengguna')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  loadUsers()
}, 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function setPage(newPage) {
  page.value = newPage
  loadUsers()
}

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', email: '', isAdmin: false, password: '' })
  showForm.value = true
}

function openEdit(user) {
  editing.value = user
  Object.assign(form, {
    name: user.name || '',
    email: user.email || '',
    isAdmin: Boolean(user.isAdmin),
    password: '',
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  saving.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showForm.value) closeForm()
}

async function submitForm() {
  if (saving.value) return
  saving.value = true
  try {
    if (editing.value) {
      const payload = {
        name: form.name,
        email: form.email,
        isAdmin: form.isAdmin,
      }
      if (form.password) payload.password = form.password
      await updateAdminUser(editing.value.id, payload)
      toast.success('Pengguna diperbarui')
    } else {
      const payload = {
        name: form.name,
        email: form.email,
        isAdmin: form.isAdmin,
      }
      if (form.password) payload.password = form.password
      await createAdminUser(payload)
      toast.success('Pengguna dibuat')
    }
    showForm.value = false
    loadUsers()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(user) {
  const result = await Swal.fire({
    title: 'Hapus pengguna?',
    text: `Tindakan ini tidak dapat dibatalkan untuk ${user.email}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminUser(user.id)
    toast.success('Pengguna dihapus')
    loadUsers()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus pengguna')
  }
}

onMounted(() => {
  loadUsers()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
