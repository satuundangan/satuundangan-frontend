<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { registerAffiliate, getAffiliateProfile } from '@/api/affiliate'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  bankName: '',
  accountNumber: '',
  accountHolderName: '',
  whatsappNumber: '',
})

const loading = ref(false)
const error = ref('')
const affiliateCode = ref('')
const registered = ref(false)

onMounted(async () => {
  if (!authStore.user) await authStore.init()
  if (!authStore.user) {
    router.push({ name: 'home', query: { login: 'true', redirect: '/affiliate/register' } })
    return
  }
  // Check if already registered
  try {
    const data = await getAffiliateProfile()
    if (data?.affiliateCode) {
      affiliateCode.value = data.affiliateCode
      registered.value = true
    }
  } catch {
    // Not yet registered — show form
  }
})

const copyCode = async () => {
  await navigator.clipboard.writeText(affiliateCode.value)
}

const submit = async () => {
  error.value = ''
  if (
    !form.value.bankName.trim() ||
    !form.value.accountNumber.trim() ||
    !form.value.accountHolderName.trim() ||
    !form.value.whatsappNumber.trim()
  ) {
    error.value = 'Semua field wajib diisi'
    return
  }
  loading.value = true
  try {
    const res = await registerAffiliate(form.value)
    affiliateCode.value = res.data.affiliateCode
    registered.value = true
  } catch (e) {
    error.value = e.message || 'Terjadi kesalahan, coba lagi'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <!-- Success / Already registered state -->
        <div v-if="registered" class="text-center space-y-6">
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <i class="fa-solid fa-circle-check text-green-500 text-2xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 mb-1">Kode Afiliasi Anda</h1>
            <p class="text-sm text-gray-500">Bagikan kode ini kepada calon pelanggan</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 flex items-center justify-between gap-3">
            <span class="text-2xl font-bold text-mocha tracking-widest uppercase">{{ affiliateCode }}</span>
            <button
              @click="copyCode"
              class="px-4 py-2 bg-mocha text-white text-xs font-bold rounded-lg hover:bg-mocha/90 uppercase tracking-wider whitespace-nowrap"
            >
              <i class="fa-regular fa-copy mr-1"></i> Salin
            </button>
          </div>
          <p class="text-xs text-gray-400">
            Link afiliasi:
            <span class="font-medium">{{ location.origin }}?ref={{ affiliateCode }}</span>
          </p>
          <button
            @click="router.push({ name: 'dashboard' })"
            class="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Ke Dashboard
          </button>
        </div>

        <!-- Registration form state -->
        <div v-else class="space-y-6">
          <div>
            <h1 class="text-xl font-bold text-gray-900 mb-1">Daftar Reseller</h1>
            <p class="text-sm text-gray-500">Isi data rekening untuk menerima komisi penjualan</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider"
                >Nama Bank</label
              >
              <input
                v-model="form.bankName"
                type="text"
                placeholder="BCA, BNI, Mandiri, ..."
                class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-mocha"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider"
                >Nomor Rekening</label
              >
              <input
                v-model="form.accountNumber"
                type="text"
                placeholder="1234567890"
                class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-mocha"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider"
                >Nama Pemilik Rekening</label
              >
              <input
                v-model="form.accountHolderName"
                type="text"
                placeholder="Sesuai buku tabungan"
                class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-mocha"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider"
                >Nomor WhatsApp</label
              >
              <input
                v-model="form.whatsappNumber"
                type="tel"
                placeholder="08xxxxxxxxxx"
                class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-mocha"
              />
            </div>
          </div>

          <p v-if="error" class="text-xs text-red-500 flex items-center gap-1">
            <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
          </p>

          <button
            @click="submit"
            :disabled="loading"
            class="w-full py-3 bg-mocha text-white text-sm font-bold rounded-xl hover:bg-mocha/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {{ loading ? 'Memproses...' : 'Daftar Sekarang' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
