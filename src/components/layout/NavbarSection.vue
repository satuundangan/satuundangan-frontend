<template>
  <nav :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-gray-200 py-3' : 'bg-transparent border-transparent py-5'
  ]">
    <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
      
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="bg-mocha text-white font-serif font-bold rounded-lg w-10 h-10 flex items-center justify-center text-xl shadow-lg group-hover:bg-accent-gold transition-colors duration-300">
          S
        </div>
        <div class="flex flex-col">
          <span :class="['font-serif font-bold text-lg leading-none tracking-tight', isScrolled ? 'text-dark' : 'text-mocha']">
            SatuUndangan
          </span>
          <span :class="['text-[10px] tracking-[0.2em] uppercase font-medium', isScrolled ? 'text-muted' : 'text-dark/60']">
            Digital Invitation
          </span>
        </div>
      </router-link>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="item in menuItems" :key="item.text">
          <a :href="item.href" 
             :class="[
               'text-sm font-medium transition-all duration-300 relative py-1 hover:text-mocha',
               isScrolled ? 'text-dark' : 'text-dark/80'
             ]">
             {{ item.text }}
             <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-mocha transition-all duration-300 group-hover:w-full"></span>
          </a>
        </li>
      </ul>

      <!-- CTA & User (Desktop) -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="userName">
          <div class="relative">
             <button @click="toggleDropdown" 
                class="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border border-gray-200 bg-white hover:border-mocha transition-colors shadow-sm">
                <div class="w-8 h-8 bg-sage/20 text-sage font-bold rounded-full flex items-center justify-center text-sm">
                   {{ userName.charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm font-medium text-dark max-w-[100px] truncate">{{ userName }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
             </button>

              <!-- Dropdown -->
            <div v-if="dropdownOpen" ref="dropdownRef"
              class="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
              <div class="px-4 py-2 border-b border-gray-50 mb-1">
                 <p class="text-xs text-muted">Signed in as</p>
                 <p class="text-sm font-bold text-dark truncate">{{ userName }}</p>
              </div>
              <router-link to="/dashboard" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-mocha">
                 <span>📊</span> Dashboard
              </router-link>
              <router-link to="/settings" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-mocha">
                 <span>⚙️</span> Pengaturan
              </router-link>
              <div class="border-t border-gray-50 my-1"></div>
              <button @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </template>
        
        <template v-else>
          <button @click="show = true" class="text-sm font-semibold hover:text-mocha transition" :class="isScrolled ? 'text-dark' : 'text-dark/80'">
             Masuk
          </button>
          <button @click="$emit('create-invitation')" class="btn-primary shadow-lg shadow-mocha/20 text-sm px-6 py-2.5 rounded-full hover:shadow-mocha/40 hover:-translate-y-0.5 transition-all">
             Buat Undangan
          </button>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="sidebarOpen = true" class="md:hidden text-2xl" :class="isScrolled ? 'text-dark' : 'text-dark'">
        ☰
      </button>
    </div>
  </nav>

  <!-- Mobile Sidebar -->
  <transition name="slide-fade">
    <div v-if="sidebarOpen" class="fixed inset-0 z-[100]" @click="sidebarOpen = false">
       <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>
       
       <aside class="absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col z-10" @click.stop>
          <div class="flex justify-between items-center mb-8">
             <h3 class="font-serif font-bold text-2xl text-mocha">Menu</h3>
             <button @click="sidebarOpen = false" class="text-3xl text-gray-400 font-light hover:text-red-500 transition">&times;</button>
          </div>

          <ul class="space-y-6 flex-1">
            <li v-for="item in menuItems" :key="item.text">
               <a :href="item.href" @click="sidebarOpen = false" class="text-lg font-medium text-dark hover:text-mocha block border-b border-gray-100 pb-2">
                 {{ item.text }}
               </a>
            </li>
          </ul>

          <div class="space-y-4 pt-6 border-t border-gray-100">
             <template v-if="userName">
                <div class="flex items-center gap-3 mb-4">
                   <div class="w-10 h-10 bg-sage text-white rounded-full flex items-center justify-center font-bold">
                      {{ userName.charAt(0).toUpperCase() }}
                   </div>
                   <div>
                      <p class="text-sm text-muted">Halo,</p>
                      <p class="font-bold text-dark">{{ userName }}</p>
                   </div>
                </div>
                <router-link to="/dashboard" class="btn-outline w-full text-center py-3 rounded-xl block">Dashboard</router-link>
                <router-link to="/templates" class="btn-primary w-full text-center py-3 rounded-xl block shadow-lg shadow-mocha/20">Buat Undangan</router-link>
                <button @click="handleLogout" class="w-full text-red-500 py-2 text-sm hover:underline">Logout</button>
             </template>
             <template v-else>
                <button @click="show = true; sidebarOpen = false" class="btn-outline w-full py-3 rounded-xl">Masuk</button>
                <button @click="$emit('create-invitation'); sidebarOpen = false" class="btn-primary w-full py-3 rounded-xl shadow-lg shadow-mocha/20">Buat Undangan</button>
             </template>
          </div>
       </aside>
    </div>
  </transition>
  
  <AuthModal :show="show" :authMode="authMode" @update:authMode="authMode = $event" @close="show = false" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import AuthModal from '@/components/modal/AuthModal.vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import { onClickOutside } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

const show = ref(false)
const authMode = ref('login')
const sidebarOpen = ref(false)
const isScrolled = ref(false)
const router = useRouter()

watch(sidebarOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const auth = useAuthStore()
const route = useRoute()
const userName = computed(() => auth.user?.name || null)

const toast = useToast()
const dropdownOpen = ref(false)
const dropdownRef = ref(null);

const menuItems = [
  { text: 'Home', href: '#' },
  { text: 'Fitur', href: '#features' },
  { text: 'Katalog', href: '#templates' },
  { text: 'Harga', href: '#pricing' },
  { text: 'Testimoni', href: '#testimonials' },
]

onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
defineEmits(['create-invitation'])

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Logout?',
    text: 'Sesi anda akan berakhir.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#a47148', // mocha
    cancelButtonColor: '#e5e7eb',
    confirmButtonText: 'Ya, Logout',
    cancelButtonText: 'Batal',
    customClass: {
       cancelButton: 'text-gray-600'
    }
  })

  if (result.isConfirmed) {
    auth.logout()
    toast.success('Berhasil logout 👋')
    router.push('/')
  }
}

const handleScroll = () => {
   isScrolled.value = window.scrollY > 50
}

onMounted(() => {
   window.addEventListener('scroll', handleScroll)
   if (route.query.login === 'true') {
      show.value = true
      authMode.value = 'login'
   }
})

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
