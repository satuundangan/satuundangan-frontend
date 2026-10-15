<template>
  <nav :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-gray-200 py-3' : 'bg-transparent border-transparent py-5'
  ]">
    <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group focus:outline-none">
        <img
          src="@/assets/logo_satuundangan.png"
          alt="SatuUndangan Logo"
          class="h-10 w-10 object-contain rounded-xl shadow-sm border border-mocha/10 bg-white p-0.5 transition-transform duration-300 group-hover:scale-105"
          width="40"
          height="40"
        />
        <div class="flex flex-col">
          <span :class="['font-serif font-bold text-xl leading-none tracking-tight transition-colors', isScrolled ? 'text-dark' : 'text-mocha']">
            SatuUndangan<span class="text-accent-gold">.id</span>
          </span>
          <span :class="['text-[9px] tracking-[0.22em] uppercase font-semibold mt-0.5', isScrolled ? 'text-muted' : 'text-dark/60']">
            Digital Wedding Invitation
          </span>
        </div>
      </router-link>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center gap-7">
        <li>
          <a
            :href="getHref({ href: '#templates' })"
            @click.prevent="handleNavClick({ href: '#templates' })"
            :class="[
              'text-sm font-medium transition-all duration-300 relative py-1 hover:text-mocha group cursor-pointer',
              isScrolled ? 'text-dark' : 'text-dark/80'
            ]"
          >
            Katalog Desain
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-mocha transition-all duration-300 group-hover:w-full"></span>
          </a>
        </li>
        <li>
          <a
            :href="getHref({ href: '#features' })"
            @click.prevent="handleNavClick({ href: '#features' })"
            :class="[
              'text-sm font-medium transition-all duration-300 relative py-1 hover:text-mocha group cursor-pointer',
              isScrolled ? 'text-dark' : 'text-dark/80'
            ]"
          >
            Fitur
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-mocha transition-all duration-300 group-hover:w-full"></span>
          </a>
        </li>
        <li>
          <a
            :href="getHref({ href: '#pricing' })"
            @click.prevent="handleNavClick({ href: '#pricing' })"
            :class="[
              'text-sm font-medium transition-all duration-300 relative py-1 hover:text-mocha group cursor-pointer',
              isScrolled ? 'text-dark' : 'text-dark/80'
            ]"
          >
            Harga
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-mocha transition-all duration-300 group-hover:w-full"></span>
          </a>
        </li>

        <!-- Tools Dropdown -->
        <li class="relative" ref="toolsDropdownRef">
          <button
            @click="toolsDropdownOpen = !toolsDropdownOpen"
            type="button"
            :class="[
              'text-sm font-medium transition-all duration-300 py-1 hover:text-mocha flex items-center gap-1.5 cursor-pointer',
              isScrolled ? 'text-dark' : 'text-dark/80',
              toolsDropdownOpen ? 'text-mocha font-semibold' : ''
            ]"
          >
            <span>Tools Gratis</span>
            <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200" :class="{ 'rotate-180': toolsDropdownOpen }"></i>
          </button>

          <!-- Dropdown Menu -->
          <transition name="dropdown-fade">
            <div
              v-if="toolsDropdownOpen"
              class="absolute left-0 mt-3 w-64 bg-white border border-stone-200/80 rounded-2xl shadow-xl py-2 z-50 backdrop-blur-md"
            >
              <router-link
                to="/wedding-planner"
                @click="toolsDropdownOpen = false"
                class="flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors group"
              >
                <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-calculator text-xs"></i>
                </div>
                <div>
                  <p class="text-xs font-bold text-dark group-hover:text-mocha transition-colors">Wedding Planner</p>
                  <p class="text-[11px] text-muted leading-tight mt-0.5">Budget calculator & susunan acara</p>
                </div>
              </router-link>

              <router-link
                to="/tools/love-calculator"
                @click="toolsDropdownOpen = false"
                class="flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors group"
              >
                <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-heart text-xs"></i>
                </div>
                <div>
                  <p class="text-xs font-bold text-dark group-hover:text-mocha transition-colors">Kalkulator Jodoh</p>
                  <p class="text-[11px] text-muted leading-tight mt-0.5">Cek chemistry nama & weton Jawa</p>
                </div>
              </router-link>
            </div>
          </transition>
        </li>

        <li>
          <a
            :href="getHref({ href: '/blog' })"
            @click.prevent="handleNavClick({ href: '/blog' })"
            :class="[
              'text-sm font-medium transition-all duration-300 relative py-1 hover:text-mocha group cursor-pointer',
              isScrolled ? 'text-dark' : 'text-dark/80'
            ]"
          >
            Blog &amp; Tips
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
              <router-link to="/dashboard" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-mocha group transition-colors">
                 <i class="fa-solid fa-chart-line w-4 text-gray-400 group-hover:text-mocha transition-colors"></i> Dashboard
              </router-link>
              <router-link to="/settings" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-mocha group transition-colors">
                 <i class="fa-solid fa-gear w-4 text-gray-400 group-hover:text-mocha transition-colors"></i> Pengaturan
              </router-link>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="handleLogout"
                class="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors group">
                <i class="fa-solid fa-right-from-bracket w-4 text-red-400 group-hover:text-red-500 transition-colors"></i> Logout
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <button @click="show = true" class="text-sm font-semibold hover:text-mocha transition" :class="isScrolled ? 'text-dark' : 'text-dark/80'">
             Masuk
          </button>
          <button @click="$emit('create-invitation')" class="btn-primary shadow-lg shadow-mocha/20 text-sm px-6 py-2.5 rounded-full hover:shadow-mocha/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 font-bold">
             <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
             <span>Buat Undangan</span>
          </button>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="sidebarOpen = true" class="md:hidden text-lg hover:text-mocha transition-colors p-2 rounded-lg" :class="isScrolled ? 'text-dark' : 'text-dark'" aria-label="Menu Navigasi">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>
  </nav>

  <!-- Mobile Sidebar -->
  <transition name="slide-fade">
    <div v-if="sidebarOpen" class="fixed inset-0 z-[100]" @click="sidebarOpen = false">
       <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>

       <aside class="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col z-10" @click.stop>
          <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
             <div class="flex items-center gap-2.5">
               <img src="@/assets/logo_satuundangan.png" alt="SatuUndangan" class="h-9 w-9 object-contain rounded-xl border border-mocha/10 bg-white p-0.5" />
               <span class="font-serif font-bold text-lg text-mocha">SatuUndangan<span class="text-accent-gold">.id</span></span>
             </div>
             <button @click="sidebarOpen = false" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-red-500 transition" aria-label="Tutup Menu">
               <i class="fa-solid fa-xmark text-lg"></i>
             </button>
          </div>

          <ul class="space-y-4 flex-1 overflow-y-auto pr-1">
            <li v-for="item in menuItems" :key="item.text">
              <a
                :href="getHref(item)"
                @click.prevent="handleNavClick(item)"
                class="text-base font-medium text-dark hover:text-mocha flex items-center justify-between border-b border-gray-100 pb-2.5 cursor-pointer"
              >
                <span>{{ item.text }}</span>
                <span
                  v-if="item.badge"
                  class="text-[9px] uppercase tracking-wider font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200"
                >
                  {{ item.badge }}
                </span>
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
const dropdownRef = ref(null)

const toolsDropdownOpen = ref(false)
const toolsDropdownRef = ref(null)

const menuItems = [
  { text: 'Katalog Desain', href: '#templates' },
  { text: 'Fitur', href: '#features' },
  { text: 'Harga', href: '#pricing' },
  { text: 'Wedding Planner', href: '/wedding-planner', badge: 'Tools' },
  { text: 'Kalkulator Jodoh', href: '/tools/love-calculator', badge: 'Tools' },
  { text: 'Blog & Tips', href: '/blog' },
]

const getHref = (item) => {
  if (item.href === '#' || item.href === '') {
    return '/'
  }
  if (item.href.startsWith('#') && route.path !== '/') {
    return '/' + item.href
  }
  return item.href
}

const handleNavClick = (item) => {
  sidebarOpen.value = false

  // Direct page routes like /blog
  if (item.href.startsWith('/') && !item.href.startsWith('/#')) {
    router.push(item.href)
    return
  }

  // Home / Top of page
  if (item.href === '#' || item.href === '' || item.href === '/') {
    if (route.path !== '/') {
      router.push('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return
  }

  // Hash links like #features, #templates, #pricing, #testimonials
  if (route.path !== '/') {
    router.push('/' + item.href)
  } else {
    const el = document.querySelector(item.href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})

onClickOutside(toolsDropdownRef, () => {
  toolsDropdownOpen.value = false
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
   } else if (route.query.register === 'true') {
      show.value = true
      authMode.value = 'register'
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

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
