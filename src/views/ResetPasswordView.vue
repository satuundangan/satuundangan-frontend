<template>
  <main class="min-h-screen bg-ivory font-sans px-4 py-10 text-dark">
    <section class="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col items-center justify-center">
      <router-link to="/" class="mb-8 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-mocha font-serif text-xl font-bold text-white shadow-lg shadow-mocha/20">
          S
        </div>
        <span class="font-serif text-xl font-bold text-mocha">SatuUndangan</span>
      </router-link>

      <div class="w-full rounded-3xl border border-mocha/10 bg-white p-6 shadow-2xl shadow-mocha/5 sm:p-8">
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-mocha/10 text-mocha">
            <i class="fa-solid fa-lock text-2xl"></i>
          </div>
          <h1 class="font-serif text-3xl font-bold text-dark">Reset Password</h1>
          <p class="mt-2 text-sm leading-6 text-gray-500">Buat password baru untuk akun kamu.</p>
        </div>

        <div v-if="!token" class="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
          Link reset password tidak valid atau token tidak ditemukan.
        </div>

        <form v-else class="space-y-5" @submit.prevent="handleResetPassword">
          <div class="space-y-1">
            <label for="newPassword" class="text-xs font-bold uppercase tracking-wide text-gray-500">Password Baru</label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-10 transition-colors focus:border-mocha focus:bg-white focus:outline-none focus:ring-1 focus:ring-mocha"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-mocha"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label for="confirmPassword" class="text-xs font-bold uppercase tracking-wide text-gray-500">Konfirmasi Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition-colors focus:border-mocha focus:bg-white focus:outline-none focus:ring-1 focus:ring-mocha"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-mocha py-3.5 font-bold text-white transition-all hover:bg-mocha/90 hover:shadow-lg hover:shadow-mocha/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span v-if="loading" class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            {{ loading ? 'Memproses...' : 'Simpan Password Baru' }}
          </button>
        </form>

        <button
          type="button"
          class="mt-5 w-full text-center text-sm font-bold text-mocha hover:underline"
          @click="goToLogin"
        >
          Kembali ke Login
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { resetPassword } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)

const token = computed(() => String(route.query.token || ''))

async function handleResetPassword() {
  if (!password.value || !confirmPassword.value) {
    toast.warning('Password dan konfirmasi wajib diisi')
    return
  }

  if (password.value.length < 6) {
    toast.warning('Password minimal 6 karakter')
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.warning('Konfirmasi password tidak sama')
    return
  }

  loading.value = true
  try {
    const res = await resetPassword({
      token: token.value,
      password: password.value,
    })
    toast.success(res.message || 'Password berhasil direset. Silakan login kembali.')
    goToLogin()
  } catch (error) {
    toast.error(error.message || 'Gagal reset password.')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push({ name: 'home', query: { login: 'true' } })
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>
