<template>
  <AdminShell
    title="Undangan"
    description="Pantau seluruh undangan yang dibuat pengguna"
    show-search
    :search="search"
    search-placeholder="Cari judul, pasangan, atau slug"
    @update:search="handleSearch"
  >
    <DataTable
      :headers="headers"
      :items="invitations"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="setPage"
    >
      <template #cell(title)="{ item }">
        <span class="font-medium text-slate-900">{{ item.title }}</span>
      </template>
      <template #cell(user)="{ item }">
        <span class="text-slate-600">{{ item.user?.name || item.user?.email || '-' }}</span>
      </template>
      <template #cell(createdAt)="{ item }">
        <span class="text-slate-600 text-xs">{{ diffForHumans(item.createdAt) }}</span>
      </template>
      <template #cell(actions)="{ item }">
        <div class="flex justify-end gap-2">
          <RouterLink
            :to="`/admin/invitations/${item.id}/edit`"
            class="rounded-lg border border-amber-200 px-3 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors"
          >Edit</RouterLink>
          <a :href="`/preview?slug=${item.slug}`" target="_blank" class="rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors">Lihat</a>
          <button class="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors" @click="confirmDelete(item)">Hapus</button>
        </div>
      </template>
    </DataTable>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from '@/components/admin/DataTable.vue'
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

function setPage(newPage) {
  page.value = newPage
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
