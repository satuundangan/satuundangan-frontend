<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-lg">Sedang memproses login dengan Google...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token
  if (token) {
    try {
      await authStore.handleLoginWithToken(token)
      
      const redirectPath = localStorage.getItem('redirect_after_login')
      if (redirectPath) {
        localStorage.removeItem('redirect_after_login')
        router.push(redirectPath)
      } else {
        router.push('/dashboard') // fallback ke dashboard
      }

    } catch (e) {
      console.error('Gagal login Google:', e)
      router.push('/')
    }
  } else {
    console.error('Tidak ada token di callback.')
    router.push('/')
  }
})
</script>
