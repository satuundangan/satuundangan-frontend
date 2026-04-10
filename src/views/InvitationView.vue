<script setup>
import { getInvitationBySlug } from '@/api/invitation'
import { demoData } from '@/api/demoData'
import { onMounted, ref, defineAsyncComponent, shallowRef, markRaw, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const templateMap = {
  'dark-elegant': () => import('../templates/dark-elegant.vue'),
  'light-modern': () => import('../templates/light-modern.vue'),
  'botanical-watercolor': () => import('../templates/botanical-watercolor.vue'),
  'royal-gold': () => import('../templates/royal-gold.vue'),
  'minimalist-terra': () => import('../templates/minimalist-terra.vue'),
  'celestial-sparkle': () => import('../templates/celestial-sparkle.vue'),
  'editorial-magazine': () => import('../templates/editorial-magazine.vue'),
}

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const invitationData = ref(null)
const TemplateComponent = shallowRef(null)
const loading = ref(true)
const error = ref(null)
const isPreviewMode = ref(false)
const isInsideFrame = ref(false)
const isDemoMode = ref(false)

onMounted(async () => {
  isPreviewMode.value = route.query.preview === 'true'
  // Check if inside iframe or forced via query param
  isInsideFrame.value = window.self !== window.top || route.query.frame === 'true'
  isDemoMode.value = route.name === 'demo'
  
  try {
    let data;

    if (isDemoMode.value) {
      // Handle Demo Mode
      const templateSlug = route.params.templateSlug
      data = {
        ...demoData,
        template_slug: templateSlug,
        guestName: route.query.to || demoData.guestName
      }
    } else {
      // Normal Mode: Fetch from API
      const response = await getInvitationBySlug(slug)
      const rawData = response.data || response
      
      // Check if invitation is active or if we are in preview mode
      const isPublished = rawData.is_published !== undefined ? rawData.is_published : rawData.isPublished
      
      if (!isPublished && !isPreviewMode.value) {
        error.value = 'Undangan ini belum dipublikasikan atau sudah tidak aktif.'
        loading.value = false
        return
      }
      
      // Flatten the data: merge root properties with content properties
      data = {
        ...(rawData.content || {}),
        id: rawData.id,
        title: rawData.title,
        slug: rawData.slug,
        template_slug: rawData.template_slug || rawData.templateName,
        is_premium: rawData.is_premium !== undefined ? rawData.is_premium : rawData.isPremium,
        is_published: rawData.is_published !== undefined ? rawData.is_published : rawData.isPublished
      }
      
      // Determine Guest Name
      let guestName = 'Tamu Undangan'
      if (route.query.to) {
        guestName = route.query.to
      } else if (route.query.e) {
        try {
          // Correctly decode UTF-8 from base64
          const binaryString = atob(route.query.e)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          guestName = new TextDecoder().decode(bytes)
        } catch (e) {
          console.error('Failed to decode guest name', e)
        }
      }
      data.guestName = guestName
    }
    
    invitationData.value = data

    // Determine template slug, fallback to dark-elegant if not found
    const templateSlug = (data.template_slug || 'dark-elegant').toLowerCase().replace(/\s+/g, '-')
    const loader = templateMap[templateSlug] || templateMap['dark-elegant']

    TemplateComponent.value = markRaw(defineAsyncComponent({
      loader,
      errorComponent: { render: () => h('div', { class: 'text-center p-10' }, 'Template tidak ditemukan atau gagal dimuat.') }
    }))
  } catch (err) {
    error.value = 'Undangan tidak ditemukan atau terjadi kesalahan.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const goToCheckout = () => {
  router.push(`/checkout?slug=${slug}`)
}
</script>

<template>
  <div class="relative">

    <div v-if="loading" class="min-h-screen text-center flex justify-center items-center">Loading undangan...
    </div>
    <div v-else-if="error" class="min-h-screen text-center flex justify-center items-center text-red-600">{{
      error }}</div>
    
    <template v-else>
      <component :is="TemplateComponent" :data="invitationData" />
      
      <!-- Floating Publish Button for Preview Mode -->
      <div v-if="isPreviewMode && !invitationData?.is_published && !isInsideFrame" 
        class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6">
        <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-mocha/10 flex items-center justify-between gap-4">
          <div class="hidden sm:block">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mode Preview</p>
            <p class="text-xs font-semibold text-mocha">Undangan belum aktif</p>
          </div>
          <button @click="goToCheckout" 
            class="flex-1 sm:flex-none bg-mocha text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-mocha/20 hover:bg-mocha/90 transition-all flex items-center justify-center gap-2">
            <i class="fa-solid fa-rocket"></i>
            Publikasikan Sekarang
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>
