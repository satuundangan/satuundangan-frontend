<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-slate-900">Admin Login</h1>
        <p class="mt-2 text-sm text-slate-500">
          {{ step === 'credentials' ? 'Masuk menggunakan akun administrator.' : 'Masukkan kode dari aplikasi authenticator.' }}
        </p>
      </div>

      <!-- Step 1: Email + Password -->
      <form v-if="step === 'credentials'" @submit.prevent="handleCredentials" class="space-y-6">
        <div>
          <label for="email" class="text-sm font-medium text-slate-600">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Memproses…' : 'Lanjut' }}
        </button>
      </form>

      <!-- Step 2: TOTP Code -->
      <form v-else-if="step === 'totp'" @submit.prevent="handleTotp" class="space-y-6">
        <div>
          <label for="totp" class="text-sm font-medium text-slate-600">Kode OTP (6 digit)</label>
          <input
            id="totp"
            v-model="form.totpCode"
            type="text"
            inputmode="numeric"
            pattern="[0-9]{6}"
            maxlength="6"
            required
            autocomplete="one-time-code"
            placeholder="000000"
            class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-center tracking-widest outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          <p class="mt-2 text-xs text-slate-400">Buka Google Authenticator / Authy dan masukkan kode 6 digit.</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Memverifikasi…' : 'Masuk' }}
        </button>

        <button
          type="button"
          @click="step = 'credentials'"
          class="w-full text-center text-sm text-slate-400 hover:text-slate-600"
        >
          Kembali
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
import { apiFetch } from '@/api/client'

const form = reactive({ email: '', password: '', totpCode: '' })
const step = ref('credentials')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

async function handleCredentials() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await apiFetch('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email: form.email, password: form.password }),
    })

    if (res.requiresTotp) {
      step.value = 'totp'
      return
    }

    await finishLogin(res)
  } catch (error) {
    toast.error(error.message || 'Login gagal, periksa kembali data Anda')
  } finally {
    loading.value = false
  }
}

async function handleTotp() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await apiFetch('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email: form.email, password: form.password, totpCode: form.totpCode }),
    })
    await finishLogin(res)
  } catch (error) {
    toast.error(error.message || 'Kode OTP tidak valid')
    form.totpCode = ''
  } finally {
    loading.value = false
  }
}

async function finishLogin(res) {
  auth.token = res.access_token
  localStorage.setItem('token', res.access_token)
  await auth.fetchProfile()

  if (!auth.user?.isAdmin) {
    toast.error('Akun ini tidak memiliki akses admin')
    auth.logout()
    return
  }

  if (res.totpSetupRequired) {
    await router.push('/admin/totp/setup')
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
  await router.push(redirect)
  toast.success('Selamat datang kembali')
}
</script>
