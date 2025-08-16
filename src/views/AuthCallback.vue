<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-lg">Memproses login Anda, mohon tunggu...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 🚨 Panggil di top-level
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token

  if (token) {
    console.log('Token diterima:', token)

    try {
      await authStore.handleLoginWithToken(token)
      router.push('/checkout') // atau arahkan ke dashboard
    } catch (err) {
      console.error('Gagal login Google:', err)
      router.push('/')
    }
  } else {
    console.error('Callback dipanggil tanpa token.')
    router.push('/')
  }
})
</script>
