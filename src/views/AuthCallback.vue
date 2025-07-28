<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-lg">Memproses login Anda, mohon tunggu...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

onMounted(() => {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  // 1. Ambil token dari query parameter URL
  const token = route.query.token

  if (token) {
    console.log('Token diterima:', token)
    // 2. Simpan token dan fetch profile menggunakan aksi di Pinia
    // Kita buat sebuah aksi baru untuk menangani ini
    authStore.handleLoginWithToken(token).then(() => {
      // 3. Arahkan ke halaman utama atau dashboard setelah berhasil
      router.push('/checkout') // atau '/dashboard'
    })
  } else {
    // Jika tidak ada token, arahkan ke halaman utama
    console.error('Callback dipanggil tanpa token.')
    router.push('/')
  }
})
</script>
