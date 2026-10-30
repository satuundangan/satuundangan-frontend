<template>
  <AdminShell
    title="Edit Undangan"
    :description="invitation?.title || 'Memuat...'"
  >
    <div v-if="loading" class="flex items-center justify-center py-16 text-slate-500 text-sm">
      Memuat data...
    </div>

    <form v-if="!loading && invitation" class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Context & Status Banner -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Pemilik:</span>
            <span class="text-sm font-semibold text-slate-900">{{ invitation.user?.name || '-' }}</span>
            <span class="text-xs text-slate-500">({{ invitation.user?.email || '-' }})</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <span>Paket: <strong class="text-slate-800 uppercase">{{ invitation.package || 'Basic' }}</strong></span>
            <span>•</span>
            <span>Dibuat: {{ diffForHumans(invitation.createdAt) }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="invitation.paymentStatus"
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border',
              invitation.paymentStatus.variant === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              invitation.paymentStatus.variant === 'info' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              invitation.paymentStatus.variant === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              invitation.paymentStatus.variant === 'danger' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            ]"
          >
            {{ invitation.paymentStatus.label }}
          </span>
          <a
            :href="`/preview?slug=${invitation.slug}`"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> Live Preview
          </a>
        </div>
      </div>

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
            <p v-if="form.slug !== initialSlug" class="mt-1 text-xs text-amber-700 flex items-center gap-1 font-medium">
              <i class="fa-solid fa-triangle-exclamation"></i>
              Mengubah slug akan merusak tautan undangan yang sudah dibagikan ke tamu.
            </p>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Alasan Perubahan (Audit Log)</label>
            <input
              v-model="form.reason"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Cth: Koreksi nama pasangan atau permintaan customer"
            />
          </div>
          <div class="flex items-center gap-3 pt-6">
            <input
              id="isPublished"
              v-model="form.isPublished"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 accent-slate-900"
            />
            <label for="isPublished" class="text-sm font-medium text-slate-700">Dipublikasikan (Online)</label>
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
import Swal from 'sweetalert2'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminInvitationDetail, updateAdminInvitation } from '@/api/admin.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const saving = ref(false)
const invitation = ref(null)
const initialSlug = ref('')

const form = ref({
  title: '',
  slug: '',
  reason: '',
  isPublished: false,
  akadDateTime: '',
  akadName: '',
  akadAddress: '',
  resepsiDateTime: '',
  resepsiName: '',
  resepsiAddress: '',
})

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

async function loadInvitation() {
  loading.value = true
  try {
    const data = await fetchAdminInvitationDetail(route.params.id)
    invitation.value = data
    form.value.title = data.title || ''
    form.value.slug = data.slug || ''
    initialSlug.value = data.slug || ''
    form.value.isPublished = data.isPublished ?? false
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
  if (form.value.slug !== initialSlug.value) {
    const res = await Swal.fire({
      title: 'Ubah Slug Undangan?',
      text: `Perubahan dari "${initialSlug.value}" menjadi "${form.value.slug}" akan menyebabkan link undangan lama yang sudah dikirim ke tamu tidak bisa dibuka lagi. Yakin ingin melanjutkan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Ubah Slug',
      cancelButtonText: 'Batal',
    })
    if (!res.isConfirmed) return
  }

  saving.value = true
  try {
    const payload = {
      title: form.value.title,
      slug: form.value.slug,
      isPublished: form.value.isPublished,
      reason: form.value.reason || undefined,
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
