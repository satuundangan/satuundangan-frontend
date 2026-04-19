<template>
  <div class="min-h-screen bg-ivory flex flex-col h-screen overflow-hidden font-sans text-dark">
    
    <!-- Desktop Header -->
    <header class="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <router-link to="/" class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
         <div class="w-8 h-8 bg-mocha text-white rounded-lg flex items-center justify-center font-serif font-bold">S</div>
         <span class="font-serif font-bold text-lg text-mocha tracking-tight">SatuUndangan</span>
      </router-link>

      <div class="flex items-center gap-2">
         <div class="flex bg-gray-100 p-1 rounded-lg">
            <button @click="viewMode = 'Mobile'" 
               :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2', viewMode === 'Mobile' ? 'bg-white text-mocha shadow-sm' : 'text-gray-500 hover:text-gray-700']">
               <i class="fa-solid fa-mobile-screen"></i> Mobile
            </button>
            <button @click="viewMode = 'Desktop'" 
               :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2', viewMode === 'Desktop' ? 'bg-white text-mocha shadow-sm' : 'text-gray-500 hover:text-gray-700']">
               <i class="fa-solid fa-desktop"></i> Desktop
            </button>
         </div>

         <button @click="toggleFullscreen" 
            class="ml-2 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-mocha transition-colors"
            :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'">
            <i :class="isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'"></i>
         </button>
      </div>

      <div class="w-24"></div> <!-- Spacer for balance -->
    </header>

    <!-- Main Preview Area -->
    <main ref="previewContainer" class="flex-1 relative w-full h-full overflow-hidden flex justify-center items-center bg-gray-100/50">
       <!-- Background Pattern (Optional) -->
       <div class="absolute inset-0 opacity-5 pointer-events-none" 
            style="background-image: radial-gradient(#a47148 1px, transparent 1px); background-size: 20px 20px;">
       </div>

       <!-- The Frame -->
       <div :class="[
          'transition-all duration-500 ease-in-out shadow-2xl relative bg-white overflow-hidden', 
          viewMode === 'Mobile' 
            ? 'w-full md:w-[375px] h-full md:h-[80vh] md:rounded-[2.5rem] md:border-[8px] md:border-dark' 
            : 'w-full h-full'
       ]">
           <!-- Notch (Mobile Mode Only) -->
           <div v-if="viewMode === 'Mobile'" class="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-dark rounded-b-xl z-20 pointer-events-none"></div>
           
           <!-- Content -->
           <div class="w-full h-full overflow-hidden">
              <iframe v-if="iframeUrl" :src="iframeUrl" class="w-full h-full border-none" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
           </div>
       </div>
    </main>

    <!-- Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 p-4 md:bottom-8 md:p-0 z-[60] flex justify-center pointer-events-none">
        
        <!-- Toggle Button (Show) -->
        <button v-if="!isActionBarVisible" @click="isActionBarVisible = true"
           class="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-mocha hover:scale-110 transition-transform absolute bottom-4 right-4 md:static">
           <i class="fa-solid fa-eye"></i>
        </button>

        <!-- Main Bar -->
        <div v-else class="relative flex items-center gap-2 sm:gap-4 bg-white/90 backdrop-blur-xl p-2 pl-4 sm:pl-6 pr-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 ring-1 ring-black/5 animate-slide-up pointer-events-auto">
            
            <!-- Hide Button -->
            <button @click="isActionBarVisible = false" class="absolute -top-3 -right-3 bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 text-xs border border-gray-100 transition-colors z-10" title="Sembunyikan">
               <i class="fa-solid fa-times"></i>
            </button>

            <div class="text-xs sm:text-sm font-semibold text-gray-500 mr-2 hidden sm:block">
               Sudah sesuai?
            </div>
            
            <button @click="goBack" class="px-4 py-2.5 sm:px-5 rounded-full text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
               <i class="fa-solid fa-pen"></i> <span class="hidden sm:inline">Edit Data</span><span class="sm:hidden">Edit</span>
            </button>
            
            <button @click="handlePublish" :disabled="isPublishing" 
               class="px-5 py-2.5 sm:px-6 rounded-full text-xs sm:text-sm font-bold text-white bg-mocha hover:bg-mocha/90 shadow-lg shadow-mocha/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
               <span v-if="isPublishing" class="animate-spin"><i class="fa-solid fa-circle-notch"></i></span>
               <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Lanjut Pembayaran' }}</span>
               <i v-if="!isPublishing" :class="isEditMode ? 'fa-solid fa-save' : 'fa-solid fa-arrow-right'"></i>
            </button>
        </div>
    </div>

    <AuthModal v-if="showLogin" :show="showLogin" :authMode="authMode" @close="showLogin = false"
      @update:authMode="authMode = $event" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import AuthModal from '@/components/modal/AuthModal.vue'

const auth = useAuthStore()
const userName = computed(() => auth.user?.name || null)
const router = useRouter()
const route = useRoute()

const viewMode = ref('Mobile')
const isPublishing = ref(false)
const showLogin = ref(false)
const authMode = ref('login')
const isFullscreen = ref(false)
const previewContainer = ref(null)
const iframeUrl = ref('')
const isEditMode = ref(!!localStorage.getItem('editInvitationId'))
const isActionBarVisible = ref(true)

function goBack() {
   router.push('/create/form')
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (previewContainer.value.requestFullscreen) {
      previewContainer.value.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

import { getMyInvitationBySlug } from '@/api/invitation'

const handlePublish = async () => {
  if (!userName.value) {
    showLogin.value = true
    return
  }

  if (isPublishing.value) return

  try {
    isPublishing.value = true
    // In preview mode, the invitation is already saved as draft in backend
    // So 'publish' just means proceeding to checkout for that specific invitation
    const editId = localStorage.getItem('editInvitationId')
    const slug = route.query.slug
    
    if (!slug) {
       alert("Data undangan tidak ditemukan.")
       return
    }

    router.push(`/checkout?slug=${slug}`)
  } catch (error) {
    console.error('Publish error:', error)
    alert('Gagal memproses undangan: ' + (error.response?.data?.message || error.message))
  } finally {
    isPublishing.value = false
  }
}

onMounted(async () => {
  const slugParam = route.query.slug
  
  if (slugParam) {
     try {
        // Just verify it exists or get details if needed
        const res = await getMyInvitationBySlug(slugParam)
        const data = res.data || res
        iframeUrl.value = `/${data.slug}?preview=true&frame=true`
     } catch (err) {
        console.error("Failed to fetch invitation for preview", err)
        // Fallback to localStorage if backend fetch fails
        const stored = localStorage.getItem('finalPayload')
        if (stored) {
           const data = JSON.parse(stored)
           const slug = data.slug || 'preview'
           iframeUrl.value = `/${slug}?preview=true&frame=true`
        }
     }
  } else {
     // Fallback for direct navigation without slug
     const stored = localStorage.getItem('finalPayload')
     if (stored) {
        const data = JSON.parse(stored)
        const slug = data.slug || 'preview'
        iframeUrl.value = `/${slug}?preview=true&frame=true`
     }
  }
  
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
