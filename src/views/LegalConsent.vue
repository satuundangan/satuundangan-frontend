<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-black">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-8 border border-gray-100">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-3xl mb-4">
          ⚖️
        </div>
        <h2 class="text-3xl font-extrabold text-mocha">
          Persetujuan Hukum
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Satu langkah lagi untuk memulai. Silakan setujui dokumen hukum kami untuk melindungi data Anda.
        </p>
      </div>

      <div class="space-y-6">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="tos" v-model="agreedToTos" type="checkbox" class="focus:ring-mocha h-4 w-4 text-mocha border-gray-300 rounded accent-mocha">
            </div>
            <div class="ml-3 text-sm">
              <label for="tos" class="font-medium text-gray-700">Syarat & Ketentuan (v2026.1)</label>
              <p class="text-gray-500">Saya telah membaca dan menyetujui 
                <router-link to="/terms" target="_blank" class="text-mocha hover:underline">Syarat dan Ketentuan</router-link>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="privacy" v-model="agreedToPrivacy" type="checkbox" class="focus:ring-mocha h-4 w-4 text-mocha border-gray-300 rounded accent-mocha">
            </div>
            <div class="ml-3 text-sm">
              <label for="privacy" class="font-medium text-gray-700">Kebijakan Privasi (v2026.1)</label>
              <p class="text-gray-500">Saya menyetujui bagaimana data saya dikelola sesuai 
                <router-link to="/privacy" target="_blank" class="text-mocha hover:underline">Kebijakan Privasi</router-link>
              </p>
            </div>
          </div>
        </div>

        <div class="text-[10px] text-gray-400 italic">
          Metadata Sesi: IP Address dan User-Agent akan dicatat untuk kebutuhan log persetujuan legal (UU ITE & UU PDP).
        </div>

        <button 
          @click="submitConsent"
          :disabled="!agreedToTos || !agreedToPrivacy || loading"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-mocha hover:bg-mocha/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mocha disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Memproses...
          </span>
          <span v-else>Setuju & Lanjut ke Dashboard</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const agreedToTos = ref(false)
const agreedToPrivacy = ref(false)
const loading = ref(false)

const submitConsent = async () => {
  loading.value = true
  try {
    await auth.recordConsent({
      tos_version: 'v2026.1',
      privacy_version: 'v2026.1'
    })

    toast.success('Persetujuan berhasil dicatat!')
    router.push({ name: 'dashboard' })

  } catch (error) {
    toast.error('Gagal mencatat persetujuan. Silakan coba lagi.')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
