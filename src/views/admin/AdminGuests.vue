<template>
  <AdminShell
    title="Tamu"
    description="Kelola daftar tamu dan data kontak"
    show-search
    :search="search"
    search-placeholder="Cari nama, nomor, atau slug"
    @update:search="handleSearch"
  >
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left font-medium text-slate-500">
          <tr>
            <th class="px-4 py-3">Nama</th>
            <th class="px-4 py-3">Nomor HP</th>
            <th class="px-4 py-3">Undangan</th>
            <th class="px-4 py-3">Slug</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="guest in guests" :key="guest.id">
            <td class="px-4 py-3 font-medium text-slate-900">{{ guest.name }}</td>
            <td class="px-4 py-3 text-slate-600">{{ guest.phoneNumber || '-' }}</td>
            <td class="px-4 py-3 text-slate-600">{{ guest.invitation?.title || '-' }}</td>
            <td class="px-4 py-3 text-slate-600">{{ guest.slug }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2 text-xs font-medium">
                <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50" @click="openEdit(guest)">Edit</button>
                <button class="rounded-lg border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50" @click="confirmDelete(guest)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && !guests.length">
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
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40" :disabled="page === 1" @click="setPage(page - 1)">Sebelumnya</button>
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40" :disabled="page === totalPages" @click="setPage(page + 1)">Berikutnya</button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Edit Tamu</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Nama</label>
              <input v-model="form.name" type="text" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" required />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Nomor HP</label>
              <input v-model="form.phoneNumber" type="text" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Slug</label>
              <input v-model="form.slug" type="text" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminGuests, updateAdminGuest, deleteAdminGuest } from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const guests = ref([])
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
  phoneNumber: '',
  slug: '',
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

async function loadGuests() {
  loading.value = true
  try {
    const res = await fetchAdminGuests({ page: page.value, limit, q: search.value })
    guests.value = res.data
    total.value = res.total
  } catch (error) {
    toast.error(error.message || 'Gagal memuat tamu')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadGuests(), 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function setPage(newPage) {
  page.value = newPage
  loadGuests()
}

function openEdit(guest) {
  editing.value = guest
  Object.assign(form, {
    name: guest.name || '',
    phoneNumber: guest.phoneNumber || '',
    slug: guest.slug || '',
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  saving.value = false
}

async function submitForm() {
  if (!editing.value || saving.value) return
  saving.value = true
  try {
    await updateAdminGuest(editing.value.id, { ...form })
    toast.success('Data tamu diperbarui')
    showForm.value = false
    loadGuests()
  } catch (error) {
    toast.error(error.message || 'Gagal memperbarui tamu')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(guest) {
  const result = await Swal.fire({
    title: 'Hapus tamu?',
    text: `Data tamu ${guest.name} akan dihapus`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminGuest(guest.id)
    toast.success('Tamu dihapus')
    loadGuests()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus tamu')
  }
}

onMounted(() => {
  loadGuests()
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
