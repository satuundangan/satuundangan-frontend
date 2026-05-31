<template>
  <AdminShell
    title="Edit Undangan"
    :description="invitation?.title || 'Memuat...'"
  >
    <div v-if="loading" class="flex items-center justify-center py-16 text-slate-500 text-sm">
      Memuat data...
    </div>

    <form v-if="!loading && invitation" class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Informasi Umum -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="mb-4 text-sm font-semibold text-slate-700">Informasi Umum</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Judul</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Judul undangan"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Slug</label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="url-slug-undangan"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              v-model="form.status"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div class="flex items-center gap-3 pt-6">
            <input
              id="isPublished"
              v-model="form.isPublished"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 accent-slate-900"
            />
            <label for="isPublished" class="text-sm font-medium text-slate-700">Dipublikasikan</label>
          </div>
        </div>
      </div>

      <!-- Akad -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="mb-4 text-sm font-semibold text-slate-700">Akad</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Tanggal & Waktu Akad</label>
            <input
              v-model="form.akadDateTime"
              type="datetime-local"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nama Tempat Akad</label>
            <input
              v-model="form.akadName"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Nama gedung / masjid"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Alamat Akad</label>
            <textarea
              v-model="form.akadAddress"
              rows="3"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Alamat lengkap"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Resepsi -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="mb-4 text-sm font-semibold text-slate-700">Resepsi</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Tanggal & Waktu Resepsi</label>
            <input
              v-model="form.resepsiDateTime"
              type="datetime-local"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nama Tempat Resepsi</label>
            <input
              v-model="form.resepsiName"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Nama gedung / ballroom"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Alamat Resepsi</label>
            <textarea
              v-model="form.resepsiAddress"
              rows="3"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Alamat lengkap"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
        <RouterLink
          to="/admin/invitations"
          class="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Batal
        </RouterLink>
      </div>
    </form>
  </AdminShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminInvitation, updateAdminInvitation } from '@/api/admin.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const saving = ref(false)
const invitation = ref(null)

const form = ref({
  title: '',
  slug: '',
  isPublished: false,
  status: 'draft',
  akadDateTime: '',
  akadName: '',
  akadAddress: '',
  resepsiDateTime: '',
  resepsiName: '',
  resepsiAddress: '',
})

async function loadInvitation() {
  loading.value = true
  try {
    const data = await fetchAdminInvitation(route.params.id)
    invitation.value = data
    form.value.title = data.title || ''
    form.value.slug = data.slug || ''
    form.value.isPublished = data.isPublished ?? false
    form.value.status = data.status || 'draft'
    form.value.akadDateTime = data.akadLocation?.dateTime
      ? data.akadLocation.dateTime.slice(0, 16)
      : ''
    form.value.akadName = data.akadLocation?.name || ''
    form.value.akadAddress = data.akadLocation?.address || ''
    form.value.resepsiDateTime = data.resepsiLocation?.dateTime
      ? data.resepsiLocation.dateTime.slice(0, 16)
      : ''
    form.value.resepsiName = data.resepsiLocation?.name || ''
    form.value.resepsiAddress = data.resepsiLocation?.address || ''
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data undangan')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  saving.value = true
  try {
    const payload = {
      title: form.value.title,
      slug: form.value.slug,
      isPublished: form.value.isPublished,
      status: form.value.status,
      akadLocation: {
        dateTime: form.value.akadDateTime,
        name: form.value.akadName,
        address: form.value.akadAddress,
      },
      resepsiLocation: {
        dateTime: form.value.resepsiDateTime,
        name: form.value.resepsiName,
        address: form.value.resepsiAddress,
      },
    }
    await updateAdminInvitation(route.params.id, payload)
    toast.success('Undangan berhasil diperbarui')
    router.push('/admin/invitations')
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadInvitation()
})
</script>
