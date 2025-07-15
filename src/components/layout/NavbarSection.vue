<template>
  <nav class="sticky top-0 z-50 bg-ivory shadow-sm  border-mocha px-6 py-4">

    <div class="max-w-7xl mx-auto flex md:justify-between justify-start items-center">
      <button @click="sidebarOpen = true" class="md:hidden text-mocha text-2xl">
        ☰
      </button>
      <!-- Sidebar (Mobile) -->
      <transition name="fade">
        <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/50 md:hidden" @click="sidebarOpen = false">
          <aside class="fixed left-0 top-0 bottom-0 w-64 bg-white p-6 shadow-md z-50" @click.stop>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-mocha">Menu</h2>
              <button @click="sidebarOpen = false" class="text-xl font-bold text-gray-400">×</button>
            </div>

            <ul class="space-y-4 text-dark">
              <li><a href="#" class="block hover:text-mocha">Home</a></li>
              <li><a href="#" class="block hover:text-mocha">Fitur</a></li>
              <li><a href="#" class="block hover:text-mocha">Tema</a></li>
              <li><a href="#" class="block hover:text-mocha">Harga</a></li>
              <li><a href="#" class="block hover:text-mocha">Portofolio</a></li>
              <li><a href="#" class="block hover:text-mocha">Blog</a></li>
              <li v-if="userName">
                <button @click="handleLogout" class="text-red-500 hover:underline">Logout</button>
              </li>
              <li v-else>
                <button @click="() => { sidebarOpen = false; show.value = true }"
                  class="hover:text-mocha">Login</button>
                <button @click="() => { emit('create-invitation'); sidebarOpen = false }" class="btn-primary mt-2">
                  Buat Undangan
                </button>
              </li>
            </ul>
          </aside>
        </div>
      </transition>

      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div
          class="hidden bg-sage text-white font-bold rounded-full w-9 h-9 md:flex items-center justify-center shadow-inner text-lg">
          1
        </div>
        <h1 class="pl-3 md:pl-0 text-lg font-bold text-dark tracking-tight">
          <span class="text-mocha">satu</span>undangan<span class="text-sage">.id</span>
        </h1>
      </div>

      <!-- Navigation -->
      <ul class="hidden md:flex gap-6 text-sm font-medium text-dark">
        <li><a href="#" class="hover:text-mocha transition">Home</a></li>
        <li><a href="#" class="hover:text-mocha transition">Fitur</a></li>
        <li><a href="#" class="hover:text-mocha transition">Tema</a></li>
        <li><a href="#" class="hover:text-mocha transition">Harga</a></li>
        <li><a href="#" class="hover:text-mocha transition">Portofolio</a></li>
        <li><a href="#" class="hover:text-mocha transition">Blog</a></li>
      </ul>
      <AuthModal :show="show" :authMode="authMode" @update:authMode="authMode = $event" @close="show = false" />

      <!-- CTA -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="userName">
          <div class="relative">
            <button @click="toggleDropdown" class="flex items-center gap-2 text-sm text-dark hover:text-mocha">
              <div
                class="w-8 h-8 bg-sage text-white font-bold rounded-full flex items-center justify-center shadow-inner">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden md:inline">{{ userName }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownOpen" ref="dropdownRef"
              class="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <a href="/dashboard" class="block px-4 py-2 text-sm text-dark hover:bg-gray-100">Dashboard</a>
              <a href="/pengaturan" class="block px-4 py-2 text-sm text-dark hover:bg-gray-100">Pengaturan</a>
              <button @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Logout</button>
            </div>
          </div>
        </template>

        <template v-else>
          <button class="text-sm text-mocha hover:text-accent-gold transition" @click="show = true">Login/Sign
            Up</button>
          <button class="px-4 py-2 md:py-3 text-sm text-white bg-[#bfa6a0] hover:bg-[#5a4f4c] transition-all rounded-xl"
            @click="emit('create-invitation')">
            Buat Undangan
          </button>
        </template>
      </div>

    </div>
  </nav>
</template>
<script setup>
import { ref, computed } from 'vue'
import AuthModal from '@/components/modal/AuthModal.vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import { onClickOutside } from '@vueuse/core'

const show = ref(false)
const authMode = ref('login')
const sidebarOpen = ref(false)

const auth = useAuthStore()
const userName = computed(() => auth.user?.name || null)

const toast = useToast()
const dropdownOpen = ref(false)
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
const emit = defineEmits(['create-invitation'])

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Yakin mau logout?',
    text: 'Kamu akan keluar dari akunmu.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Logout',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    auth.logout()
    toast.success('Logout berhasil, sampai jumpa lagi 👋')
  }
}


</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
