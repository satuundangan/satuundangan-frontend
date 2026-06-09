<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-semibold text-slate-900">Setup Authenticator</h1>
        <p class="mt-2 text-sm text-slate-500">Scan QR code ini dengan Google Authenticator atau Authy.</p>
      </div>

      <div v-if="loadingSetup" class="flex justify-center py-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>
      </div>

      <template v-else-if="qrCode">
        <div class="flex justify-center mb-4">
          <img :src="qrCode" alt="TOTP QR Code" class="w-48 h-48 rounded-lg border border-slate-200" />
        </div>

        <details class="mb-6">
          <summary class="cursor-pointer text-xs text-slate-400 text-center hover:text-slate-600">
            Tidak bisa scan? Masukkan manual
          </summary>
          <p class="mt-2 break-all rounded bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 select-all">
            {{ secret }}
          </p>
        </details>

        <form @submit.prevent="handleActivate" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-600">Verifikasi Kode OTP</label>
            <input
              v-model="code"
              type="text"
              inputmode="numeric"
              pattern="[0-9]{6}"
              maxlength="6"
              required
              placeholder="000000"
              class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-center tracking-widest outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
            <p class="mt-1 text-xs text-slate-400">Masukkan kode dari authenticator untuk konfirmasi setup.</p>
          </div>

          <button
            type="submit"
            :disabled="loading || code.length !== 6"
            class="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Mengaktifkan…' : 'Aktifkan TOTP' }}
          </button>
        </form>
      </template>

      <div v-else class="text-center text-sm text-red-500 py-4">
        Gagal memuat setup. Pastikan kamu sudah login sebagai admin.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { apiFetch } from '@/api/client'

const qrCode = ref('')
const secret = ref('')
const code = ref('')
const loading = ref(false)
const loadingSetup = ref(true)
const router = useRouter()
const toast = useToast()

onMounted(async () => {
  try {
    const res = await apiFetch('/auth/admin/totp/setup')
    qrCode.value = res.qrCode
    secret.value = res.secret
  } catch (error) {
    toast.error(error.message || 'Gagal memuat QR code')
  } finally {
    loadingSetup.value = false
  }
})

async function handleActivate() {
  if (loading.value) return
  loading.value = true
  try {
    await apiFetch('/auth/admin/totp/activate', {
      method: 'POST',
      body: JSON.stringify({ code: code.value }),
    })
    toast.success('TOTP berhasil diaktifkan! Login ulang untuk menggunakan.')
    await router.push('/admin')
  } catch (error) {
    toast.error(error.message || 'Kode OTP tidak valid')
    code.value = ''
  } finally {
    loading.value = false
  }
}
</script>
