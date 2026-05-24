<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="show"
        class="fixed inset-0 z-[8888] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 h-screen w-screen">
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-scale-up max-h-[90vh] md:max-h-[800px]">

          <!-- Close Button -->
          <button @click="$emit('close')"
            class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white md:text-gray-500 flex items-center justify-center transition-colors">
            &times;
          </button>

          <!-- Left Side: Image/Brand (Hidden on Mobile) -->
          <div
            class="hidden md:flex md:w-5/12 bg-mocha relative flex-col justify-between p-10 text-white overflow-hidden">
            <!-- Background Pattern/Image -->
            <div class="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop"
                class="w-full h-full object-cover grayscale mix-blend-multiply" />
            </div>

            <div class="relative z-10">
              <div
                class="w-12 h-12 bg-white text-mocha rounded-xl flex items-center justify-center font-serif font-bold text-2xl mb-6 shadow-lg">
                S</div>
              <h2 class="font-serif text-3xl font-bold leading-tight mb-4">
                {{ authMode === 'login' ? 'Selamat Datang Kembali.' : 'Mulai Perjalanan Barumu.' }}
              </h2>
              <p class="text-white/80 text-sm leading-relaxed">
                Buat undangan pernikahan digital impianmu dengan fitur premium dan desain eksklusif hanya di
                SatuUndangan.
              </p>
            </div>

            <div class="relative z-10 text-xs text-white/60">
              © 2026 SatuUndangan.id
            </div>
          </div>

          <!-- Right Side: Form -->
          <div class="flex-1 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
            <div class="max-w-sm mx-auto w-full">
              <h2 class="text-2xl font-bold text-dark mb-1 md:hidden">
                {{ authMode === 'login' ? 'Masuk Akun' : 'Daftar Baru' }}
              </h2>
              <p class="text-muted text-sm mb-8 md:hidden">Silakan masuk untuk melanjutkan.</p>

              <!-- Google Login -->
              <button @click="handleGoogleLogin"
                class="w-full border border-gray-300 rounded-xl py-2.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-dark text-sm mb-6 group">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg"
                  class="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Lanjutkan dengan Google</span>
              </button>

              <div class="relative mb-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-white px-3 text-gray-400 font-medium tracking-wider">Atau dengan email</span>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="authMode === 'login' ? handleLogin() : handleRegister()" class="space-y-4">

                <div v-if="authMode === 'register'" class="space-y-1">
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Lengkap</label>
                  <input v-model="name" type="text" placeholder="John Doe"
                    class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-mocha focus:ring-1 focus:ring-mocha transition-colors bg-gray-50 focus:bg-white" />
                </div>

                <div class="space-y-1">
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <input v-model="email" type="email" placeholder="nama@email.com"
                    class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-mocha focus:ring-1 focus:ring-mocha transition-colors bg-gray-50 focus:bg-white" />
                </div>

                <div class="space-y-1">
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                  <div class="relative">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                      class="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-mocha focus:ring-1 focus:ring-mocha transition-colors bg-gray-50 focus:bg-white" />
                    <button type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mocha transition-colors"
                      @click="togglePassword">
                      <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <div v-if="authMode === 'register'" class="flex items-start gap-2 pt-2">
                  <input id="terms" v-model="agreedToTerms" type="checkbox"
                    class="mt-1 h-4 w-4 rounded border-gray-300 text-mocha focus:ring-mocha accent-mocha cursor-pointer" />
                  <label for="terms" class="text-xs text-gray-500 leading-normal cursor-pointer">
                    Saya setuju dengan
                    <router-link to="/terms" target="_blank" class="font-bold text-mocha hover:underline" @click="emit('close')">Syarat & Ketentuan</router-link>
                    dan
                    <router-link to="/privacy" target="_blank" class="font-bold text-mocha hover:underline" @click="emit('close')">Kebijakan Privasi</router-link>
                    SatuUndangan.
                  </label>
                </div>

                <button type="submit"
                  class="w-full bg-mocha text-white font-bold py-3.5 rounded-xl hover:bg-mocha/90 hover:shadow-lg hover:shadow-mocha/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4"
                  :disabled="loading">
                  <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>{{ loading ? 'Memproses...' : authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Gratis'
                    }}</span>
                </button>

              </form>

              <p class="text-center text-sm mt-8 text-muted">
                {{ authMode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?' }}
                <a href="#" class="font-bold text-mocha hover:underline" @click.prevent="toggleAuthMode">
                  {{ authMode === 'login' ? 'Daftar disini' : 'Masuk disini' }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { BASE_URL } from '@/api/client'
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
const agreedToTerms = ref(false)
const loading = ref(false)

const auth = useAuthStore()
const toast = useToast()
const router = useRouter()

const showPassword = ref(false)

watch(() => props.show, (val) => {
  if (val) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.warning('Email dan Password wajib diisi')
    return
  }

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    toast.warning('Format email tidak valid (contoh: nama@email.com)')
    return
  }

  // Password length validation
  if (password.value.length < 6) {
    toast.warning('Password minimal 6 karakter')
    return
  }

  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    toast.success('Selamat datang kembali! 🎉')
    emit('close')
    
    // Logic for redirection:
    // 1. Check if there's a redirect query in the URL
    // 2. Check if we have a stored redirect path
    // 3. If on home or guest pages, go to dashboard
    // 4. Otherwise, stay where we are
    
    const queryRedirect = router.currentRoute.value.query.redirect
    const storedRedirect = localStorage.getItem('redirect_after_login')
    
    if (queryRedirect) {
      router.push(queryRedirect)
    } else if (storedRedirect) {
      localStorage.removeItem('redirect_after_login')
      router.push(storedRedirect)
    } else if (router.currentRoute.value.path === '/' || router.currentRoute.value.path === '/login') {
      router.push('/dashboard')
    }
    // Else: Stay on current page

  } catch (e) {
    toast.error('Login gagal! Periksa email dan password.')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    toast.warning('Semua data wajib diisi')
    return
  }

  // Name validation
  if (name.value.trim().length < 3) {
    toast.warning('Nama lengkap minimal 3 karakter')
    return
  }

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    toast.warning('Format email tidak valid (contoh: nama@email.com)')
    return
  }

  // Password length validation
  if (password.value.length < 6) {
    toast.warning('Password minimal 6 karakter')
    return
  }

  // Terms agreement validation
  if (!agreedToTerms.value) {
    toast.warning('Anda harus menyetujui Syarat dan Ketentuan')
    return
  }

  loading.value = true
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      agreedToTerms: agreedToTerms.value
    })
    toast.success('Akun berhasil dibuat! Silakan login.')
    emit('update:authMode', 'login')
  } catch (e) {
    toast.error(e.response?.data?.message || 'Registrasi gagal. Email mungkin sudah terdaftar.')
    console.error(e)
  } finally {
    loading.value = false
  }
}


const handleGoogleLogin = () => {
  // Simpan path saat ini agar bisa kembali setelah login Google
  localStorage.setItem('redirect_after_login', router.currentRoute.value.fullPath)
  window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL || `${BASE_URL}/auth/google`
}

const toggleAuthMode = () => {
  emit('update:authMode', props.authMode === 'login' ? 'register' : 'login')
  // Reset form
  email.value = ''
  password.value = ''
  name.value = ''
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
