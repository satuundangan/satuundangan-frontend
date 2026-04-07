<template>
  <div class="min-h-screen bg-ivory font-montserrat flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center space-y-6">

      <!-- Loading -->
      <div v-if="checking" class="space-y-4">
        <div class="w-16 h-16 border-4 border-mocha/20 border-t-mocha rounded-full animate-spin mx-auto"></div>
        <p class="text-mocha/60 font-medium animate-pulse">Mengecek status pembayaran...</p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="space-y-6">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <i class="fa-solid fa-check text-green-500 text-4xl"></i>
        </div>
        <div>
          <h2 class="text-3xl font-bold text-mocha font-alex">Pembayaran Berhasil!</h2>
          <p class="text-gray-500 text-sm mt-2">Undangan kamu sudah aktif. Selamat!</p>
        </div>
        <button @click="goToInvitation" class="btn-primary w-full !py-4 flex items-center justify-center gap-2">
          <i class="fa-solid fa-envelope-open-text"></i>
          Lihat Undangan
        </button>
      </div>

      <!-- Pending -->
      <div v-else-if="status === 'pending'" class="space-y-6">
        <div class="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <i class="fa-solid fa-clock text-yellow-500 text-4xl"></i>
        </div>
        <div>
          <h2 class="text-3xl font-bold text-mocha font-alex">Sedang Diproses</h2>
          <p class="text-gray-500 text-sm mt-2">Pembayaran kamu sedang diverifikasi. Undangan akan aktif otomatis setelah dikonfirmasi.</p>
        </div>
        <button @click="router.push('/dashboard')" class="btn-primary w-full !py-4 flex items-center justify-center gap-2">
          <i class="fa-solid fa-gauge"></i>
          Ke Dashboard
        </button>
      </div>

      <!-- Failed / Expired -->
      <div v-else class="space-y-6">
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <i class="fa-solid fa-xmark text-red-500 text-4xl"></i>
        </div>
        <div>
          <h2 class="text-3xl font-bold text-mocha font-alex">Pembayaran Gagal</h2>
          <p class="text-gray-500 text-sm mt-2">Transaksi dibatalkan atau kadaluarsa. Silakan coba lagi.</p>
        </div>
        <button @click="router.back()" class="btn-primary w-full !py-4 flex items-center justify-center gap-2">
          <i class="fa-solid fa-rotate-left"></i>
          Coba Lagi
        </button>
      </div>

      <router-link to="/" class="block text-xs text-gray-400 hover:text-mocha transition-colors">
        Kembali ke Beranda
      </router-link>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPaymentStatus } from '@/api/payment'

const route = useRoute()
const router = useRouter()

const checking = ref(true)
const status = ref(null)
const invitationSlug = ref(null)

onMounted(async () => {
  const orderId = route.query.order_id
  if (!orderId) {
    status.value = 'failed'
    checking.value = false
    return
  }

  try {
    const res = await getPaymentStatus(orderId)
    status.value = res.status || res.data?.status || 'pending'
    invitationSlug.value = res.invitationSlug || res.data?.invitationSlug || null
  } catch (err) {
    console.error('Gagal cek status pembayaran:', err)
    status.value = 'pending'
  } finally {
    checking.value = false
  }
})

const goToInvitation = () => {
  if (invitationSlug.value) {
    router.push(`/${invitationSlug.value}`)
  } else {
    router.push('/dashboard')
  }
}
</script>
