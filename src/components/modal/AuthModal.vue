<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
      <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <div class="absolute top-4 right-4">
          <button @click="$emit('close')"
            class="text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none">×</button>
        </div>

        <h2 class="text-2xl font-bold text-center text-mocha mb-6">
          {{ authMode === 'login' ? 'Masuk ke Akunmu' : 'Buat Akun Baru' }}
        </h2>

        <!-- Form -->
        <form @submit.prevent="authMode === 'login' ? handleLogin() : handleRegister()" class="space-y-4">
          <input v-model="email" type="email" placeholder="Email"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-mocha" />
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
              class="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring focus:ring-mocha" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mocha"
              @click="togglePassword">
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>

          <input v-if="authMode === 'register'" v-model="name" type="text" placeholder="Nama Lengkap"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-mocha" />
          <button type="submit"
            class="w-full bg-mocha text-white font-semibold py-2 rounded-lg hover:bg-mocha/90 flex justify-center items-center gap-2"
            :disabled="loading">
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span>{{ loading ? 'Mohon tunggu...' : authMode === 'login' ? 'Login' : 'Daftar' }}</span>
          </button>

        </form>

        <div class="text-center my-6 text-sm text-gray-500">atau login dengan</div>

        <button @click="handleGoogleLogin"
          class="w-full border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="h-5 w-5" />
          <span>Login dengan Google</span>
        </button>

        <p class="text-center text-sm mt-6">
          {{ authMode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?' }}
          <a href="#" class="text-mocha hover:underline" @click.prevent="toggleAuthMode">
            {{ authMode === 'login' ? 'Daftar' : 'Login' }}
          </a>
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const props = defineProps({
  show: Boolean,
  authMode: {
    type: String,
    default: 'login',
  },
})
const emit = defineEmits(['close', 'update:authMode'])

const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)

const auth = useAuthStore()
const toast = useToast()

const showPassword = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    toast.success('Login berhasil!')
    emit('close')
  } catch (e) {
    toast.error('Login gagal!')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    toast.success('Registrasi berhasil!')
    emit('close')
  } catch (e) {
    toast.error('Registrasi gagal!')
    console.error(e)
  } finally {
    loading.value = false
  }
}


const handleGoogleLogin = () => {
  window.location.href = 'https://api.satuundangan.id/auth/google'
}

const toggleAuthMode = () => {
  emit('update:authMode', props.authMode === 'login' ? 'register' : 'login')
}
</script>

<style scoped>
/* tambahin di style scoped kalau pakai */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
