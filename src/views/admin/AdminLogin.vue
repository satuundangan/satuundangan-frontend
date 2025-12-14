<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-slate-900">Admin Login</h1>
        <p class="mt-2 text-sm text-slate-500">Masuk menggunakan akun administrator untuk mengelola platform.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="text-sm font-medium text-slate-600">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            placeholder="admin@undangdong.com"
          />
        </div>

        <div>
          <label for="password" class="text-sm font-medium text-slate-600">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Memproses…' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

async function handleSubmit() {
  if (loading.value) return
  loading.value = true
  try {
    await auth.login({ ...form })
    if (!auth.user || !auth.user.isAdmin) {
      toast.error('Akun ini tidak memiliki akses admin')
      auth.logout()
      return
    }

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    await router.push(redirect)
    toast.success('Selamat datang kembali')
  } catch (error) {
    toast.error(error.message || 'Login gagal, periksa kembali data Anda')
  } finally {
    loading.value = false
  }
}
</script>
