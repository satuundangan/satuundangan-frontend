<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-mocha">
            {{ authMode === 'login' ? 'Login' : 'Daftar' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-red-500 text-2xl font-bold">×</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="authMode === 'login' ? handleLogin() : handleRegister()" class="space-y-4">
          <input v-model="email" type="email" placeholder="Email"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-mocha" />
          <input v-model="password" type="password" placeholder="Password"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-mocha" />
          <input v-if="authMode === 'register'" v-model="name" type="text" placeholder="Nama Lengkap"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-mocha" />
          <button type="submit" class="w-full bg-mocha text-white font-semibold py-2 rounded-lg hover:bg-mocha/90">
            {{ authMode === 'login' ? 'Login' : 'Daftar' }}
          </button>
        </form>

        <!-- Atau -->
        <div class="text-center my-4 text-sm text-gray-500">atau</div>

        <!-- Google Login -->
        <button @click="handleGoogleLogin"
          class="w-full border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="h-5 w-5" />
          <span>Login dengan Google</span>
        </button>

        <!-- Switch Auth Mode -->
        <p class="text-center text-sm mt-4">
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
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

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

const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  try {
    await auth.login({ email: email.value, password: password.value })
    emit('close')
    router.push('/dashboard')
  } catch (e) {
    alert('Login gagal!')
    console.error(e)
  }
}

const handleRegister = async () => {
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    emit('close')
    router.push('/dashboard')
  } catch (e) {
    alert('Registrasi gagal!')
    console.error(e)
  }
}

const handleGoogleLogin = () => {
  window.location.href = 'https://api.satuundangan.id/auth/google'
}

const toggleAuthMode = () => {
  emit('update:authMode', props.authMode === 'login' ? 'register' : 'login')
}
</script>
