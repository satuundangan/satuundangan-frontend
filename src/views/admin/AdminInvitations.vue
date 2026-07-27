<template>
  <AdminShell
    title="Undangan"
    description="Pantau seluruh undangan yang dibuat pengguna"
    show-search
    :search="search"
    search-placeholder="Cari judul, pasangan, atau slug"
    @update:search="handleSearch"
  >
    <div class="card bg-white">
      <DataTable
        :value="invitations"
        lazy
        paginator
        :rows="limit"
        :totalRecords="total"
        :loading="loading"
        @page="onPage"
        class="p-datatable-sm bg-white"
        dataKey="id"
      >
        <template #empty> Tidak ada undangan ditemukan. </template>
        <template #loading> Memuat data undangan. Silakan tunggu. </template>

        <Column field="title" header="Judul Undangan" style="min-width: 15rem">
          <template #body="{ data }">
            <span class="font-medium text-slate-900">{{ data.title }}</span>
          </template>
        </Column>

        <Column field="user" header="Pengguna" style="min-width: 12rem">
          <template #body="{ data }">
            <span class="text-slate-600">{{ data.user?.name || data.user?.email || '-' }}</span>
          </template>
        </Column>

        <Column field="slug" header="Link / Slug" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-mono text-xs text-slate-500">/preview?slug={{ data.slug }}</span>
          </template>
        </Column>

        <Column field="category" header="Kategori" style="min-width: 8rem">
          <template #body="{ data }">
            <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
              {{ data.category || '-' }}
            </span>
          </template>
        </Column>

        <Column field="createdAt" header="Dibuat" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="text-slate-600 text-xs">{{ diffForHumans(data.createdAt) }}</span>
          </template>
        </Column>

        <Column header="Aksi" headerClass="text-right" bodyClass="text-right" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="flex justify-end gap-1.5 text-xs font-medium">
              <RouterLink
                :to="`/admin/invitations/${data.id}/edit`"
                class="flex h-8 items-center gap-1.5 rounded-lg border border-amber-200 px-3 text-amber-600 hover:bg-amber-50 transition-colors"
                title="Edit Undangan"
              >
                <i class="fa-solid fa-pencil text-[10px]"></i> Edit
              </RouterLink>
              <a :href="`/preview?slug=${data.slug}`" target="_blank"
                class="flex h-8 items-center gap-1.5 rounded-lg border border-blue-200 px-3 text-blue-600 hover:bg-blue-50 transition-colors"
                title="Lihat Undangan"
              >
                <i class="fa-solid fa-eye text-[10px]"></i> Lihat
              </a>
              <button
                class="flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-rose-600 hover:bg-rose-50 transition-colors"
                @click="confirmDelete(data)"
                title="Hapus Undangan"
              >
                <i class="fa-solid fa-trash text-[10px]"></i> Hapus
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { fetchAdminInvitations, deleteAdminInvitation } from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const invitations = ref([])
const total = ref(0)
const page = ref(1)
const limit = 10
const search = ref('')
const loading = ref(false)

const headers = [
  { label: 'Judul', key: 'title' },
  { label: 'Pengguna', key: 'user' },
  { label: 'Slug', key: 'slug' },
  { label: 'Kategori', key: 'category' },
  { label: 'Dibuat', key: 'createdAt' },
  { label: 'Aksi', key: 'actions', class: 'text-right' },
]

function diffForHumans(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} bulan yang lalu`
  return `${Math.floor(diffInSeconds / 31536000)} tahun yang lalu`
}

async function loadInvitations() {
  loading.value = true
  try {
    const res = await fetchAdminInvitations({ page: page.value, limit, q: search.value })
    invitations.value = res.data
    total.value = res.total
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data undangan')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadInvitations(), 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function onPage(event) {
  page.value = event.page + 1
  loadInvitations()
}

async function confirmDelete(invitation) {
  const result = await Swal.fire({
    title: 'Hapus undangan?',
    text: `Undangan ${invitation.title} akan dihapus permanen`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminInvitation(invitation.id)
    toast.success('Undangan dihapus')
    loadInvitations()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus undangan')
  }
}

onMounted(() => {
  loadInvitations()
})
</script>
