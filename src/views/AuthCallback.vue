<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-lg">Memproses login Anda, mohon tunggu...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

onMounted(async () => {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  const token = route.query.token

  if (token) {
    try {
      await authStore.handleLoginWithToken(token)

      // Ambil path yang sebelumnya disimpan atau default ke dashboard
      const redirectTo = authStore.redirectPath || '/dashboard'
      authStore.clearRedirectPath()

      router.push(redirectTo)
    } catch (err) {
      console.error('Login error:', err)

      router.push('/')
    }
  } else {
    console.error('Callback dipanggil tanpa token.')
    router.push('/')
  }
})
</script>
