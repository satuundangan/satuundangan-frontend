<script setup>
import { getInvitationBySlug, getMyInvitationBySlug } from '@/api/invitation'
import { demoData } from '@/api/demoData'
import { orangutanData } from '@/api/orangutanData'
import { getTemplateDesignBySlug } from '@/api/templateDesign'
import { onMounted, ref, defineAsyncComponent, shallowRef, markRaw, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const templateMap = {
  'dark-elegant': () => import('../templates/dark-elegant.vue'),
  'light-modern': () => import('../templates/light-modern.vue'),
  'botanical-watercolor': () => import('../templates/botanical-watercolor.vue'),
  'royal-gold': () => import('../templates/royal-gold.vue'),
  'minimalist-terra': () => import('../templates/minimalist-terra.vue'),
  'celestial-sparkle': () => import('../templates/celestial-sparkle.vue'),
  'editorial-magazine': () => import('../templates/editorial-magazine.vue'),
  'zen-tranquility': () => import('../templates/zen-tranquility.vue'),
  'retro-nostalgia': () => import('../templates/retro-nostalgia.vue'),
  'modern-noir': () => import('../templates/modern-noir.vue'),
  'azure-shores': () => import('../templates/azure-shores.vue'),
  'cyberpunk-neon': () => import('../templates/cyberpunk-neon.vue'),
  'royal-emerald': () => import('../templates/royal-emerald.vue'),
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

const isLiveSyncActive = ref(false)

const ALL_SECTION_KEYS = [
  'quote', 'love-story', 'couple', 'event', 'gallery', 'rsvp', 
  'gift', 'prokes', 'extended-family', 'dress-code', 
  'live-streaming', 'video', 'denah', 'menu', 'countdown',
  'wishes', 'map', 'music', 'photoCouple', 'hero'
]

onMounted(async () => {
  isPreviewMode.value = route.query.preview === 'true' || route.query.mode === 'live'
  // Check if inside iframe or forced via query param
  isInsideFrame.value = window.self !== window.top || route.query.frame === 'true'
  isDemoMode.value = route.name === 'demo'
  
  // Listen for LIVE PREVIEW updates from CreateForm
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'LIVE_PREVIEW_UPDATE' && isPreviewMode.value) {
      isLiveSyncActive.value = true // Mark that we are using live data
      const payload = event.data.data
      
      // Update template data reactively
      const newData = {
        ...(invitationData.value || {}),
        ...payload,
        id: invitationData.value?.id || 'live-preview',
        title: payload.title || 'Live Preview',
        slug: payload.slug || 'live-preview',
        musicChoice: payload.music === 'custom' ? payload.musicPreview : payload.music,
        audioStart: Number(payload.audioStart) || 0,
        audioEnd: Number(payload.audioEnd) || 0,
        template_slug: payload.template_slug || payload.templateDesignId || 'dark-elegant',
        guestName: payload.guestName || invitationData.value?.guestName || 'Tamu Undangan',
      }
      
      if (payload.selectedSections) {
        const existingSections = newData.sections && Array.isArray(newData.sections) ? newData.sections : []
        const existingKeys = existingSections.map(s => s.key || s.section?.key).filter(Boolean)
        const allKeys = Array.from(new Set([...existingKeys, ...ALL_SECTION_KEYS]))
        
        const mappedSections = allKeys.map(key => {
          const existing = existingSections.find(s => (s.key === key || s.section?.key === key))
          return {
            ...(existing || {}),
            key,
            is_enabled: payload.selectedSections.includes(key)
          }
        })
        
        newData.sections = mappedSections
        if (newData.content) {
          newData.content.selectedSections = mappedSections
        }
        newData.selectedSections = payload.selectedSections
      }
      
      invitationData.value = newData
      loading.value = false // Ensure we stop loading when data is received
    }
  })

  // Watch for invitationData changes to update TemplateComponent
  watch(() => invitationData.value?.template_slug, (newSlug) => {
    if (!newSlug) return
    
    const normalizedSlug = newSlug.toLowerCase().replace(/\s+/g, '-')
    const loader = templateMap[normalizedSlug] || templateMap['dark-elegant']

    TemplateComponent.value = markRaw(defineAsyncComponent({
      loader,
      errorComponent: { render: () => h('div', { class: 'text-center p-10' }, 'Template tidak ditemukan atau gagal dimuat.') }
    }))
  }, { immediate: true })

  // Tell the parent window (CreateForm) that we are ready to receive data
  if (isInsideFrame.value && window.parent) {
    window.parent.postMessage({ type: 'PREVIEW_READY' }, '*')
  }
  
  // Skip fetching if virtual live-preview slug
  if (slug === 'live-preview' && isPreviewMode.value) {
    if (!invitationData.value) {
       invitationData.value = {
          template_slug: route.query.templateId || 'dark-elegant',
          guestName: 'Tamu Undangan'
       }
    }
    loading.value = false
    return
  }

  try {
    let data;

    if (slug === 'jennifer-hayato') {
      data = {
        ...orangutanData,
        template_slug: route.query.templateId || 'royal-emerald',
        guestName: route.query.to || orangutanData.guestName,
      }
    } else if (isDemoMode.value) {
      // Handle Demo Mode
      const templateSlug = route.params.templateSlug
      let templateDefaultMusic = null
      let templateAudioStart = 0
      let templateAudioEnd = 0
      try {
        const tmpl = await getTemplateDesignBySlug(templateSlug)
        templateDefaultMusic = tmpl?.defaultMusic || null
        templateAudioStart = tmpl?.defaultAudioStart ?? 0
        templateAudioEnd = tmpl?.defaultAudioEnd ?? 0
      } catch {
        // no-op — demo still works without template music
      }
      data = {
        ...demoData,
        template_slug: templateSlug,
        guestName: route.query.to || demoData.guestName,
        musicChoice: templateDefaultMusic || demoData.musicChoice,
        audioStart: templateDefaultMusic ? templateAudioStart : (demoData.audioStart || 0),
        audioEnd: templateDefaultMusic ? templateAudioEnd : (demoData.audioEnd || 0),
      }
    } else {
      try {
        // Normal Mode: Fetch from API
        const rawData = await fetchInvitationData(slug)
        
        // If live sync already started, don't overwrite with old API data
        if (isLiveSyncActive.value) {
           return
        }

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
          audioStart: Number((rawData.content || rawData).audioStart) || 0,
          audioEnd: Number((rawData.content || rawData).audioEnd) || 0,
          template_slug: rawData.template_slug || rawData.templateName,
          is_premium: rawData.is_premium !== undefined ? rawData.is_premium : rawData.isPremium,
          is_published: rawData.is_published !== undefined ? rawData.is_published : rawData.isPublished
        }
      } catch (err) {
        // If live sync already started, ignore error
        if (isLiveSyncActive.value) return

        if (isPreviewMode.value) {
          data = {
            content: {},
            template_slug: route.query.templateId || 'dark-elegant',
            guestName: 'Tamu Undangan'
          }
        } else {
          throw err
        }
      }
      
      // Determine Guest Name
      let guestName = data.guestName || 'Tamu Undangan'
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
    
    // Final check before setting data
    if (!isLiveSyncActive.value) {
       invitationData.value = data
    }
  } catch (err) {
    if (!isLiveSyncActive.value) {
       error.value = 'Undangan tidak ditemukan atau terjadi kesalahan.'
       console.error(err)
    }
  } finally {
    if (!isLiveSyncActive.value) {
       loading.value = false
    }
  }
})

const goToCheckout = () => {
  router.push(`/checkout?slug=${slug}`)
}

async function fetchInvitationData(slug) {
  try {
    const response = isPreviewMode.value
      ? await getMyInvitationBySlug(slug)
      : await getInvitationBySlug(slug)
    return response.data || response
  } catch (err) {
    if (isPreviewMode.value) {
      const fallback = getLocalPreviewPayload(slug)
      if (fallback) return fallback
    }

    throw err
  }
}

function getLocalPreviewPayload(slug) {
  const stored = localStorage.getItem('finalPayload')
  if (!stored) return null

  try {
    const payload = JSON.parse(stored)
    if (payload.slug && payload.slug !== slug) return null

    return {
      id: payload.id || null,
      title: payload.title,
      slug: payload.slug || slug,
      musicChoice: payload.musicChoice,
      audioStart: payload.audioStart,
      audioEnd: payload.audioEnd,
      template_slug: payload.template_slug || payload.templateName,
      content: payload,
      is_premium: Boolean(payload.isPremium),
      is_published: false,
    }
  } catch (error) {
    console.error('Failed to load local preview payload', error)
    return null
  }
}
</script>

<template>
  <div class="relative">

    <div v-if="loading" class="min-h-screen bg-white">
      <div class="animate-pulse">
        <!-- Hero Skeleton -->
        <div class="h-[60vh] bg-gray-50 flex items-center justify-center flex-col px-6">
           <div class="w-32 h-32 rounded-full bg-gray-200 mb-8"></div>
           <div class="h-8 w-48 bg-gray-200 rounded-full mb-4"></div>
           <div class="h-4 w-32 bg-gray-100 rounded-full"></div>
        </div>
        <!-- Couple Section Skeleton -->
        <div class="py-20 px-6 space-y-12">
           <div class="flex flex-col md:flex-row items-center justify-center gap-12">
              <div class="w-48 h-48 rounded-full bg-gray-100"></div>
              <div class="space-y-3 items-center flex flex-col">
                 <div class="h-6 w-40 bg-gray-200 rounded-full"></div>
                 <div class="h-4 w-24 bg-gray-100 rounded-full"></div>
              </div>
           </div>
           <div class="flex flex-col md:flex-row-reverse items-center justify-center gap-12">
              <div class="w-48 h-48 rounded-full bg-gray-100"></div>
              <div class="space-y-3 items-center flex flex-col">
                 <div class="h-6 w-40 bg-gray-200 rounded-full"></div>
                 <div class="h-4 w-24 bg-gray-100 rounded-full"></div>
              </div>
           </div>
        </div>
        <!-- Event Skeleton -->
        <div class="bg-gray-50 py-20 px-6">
           <div class="max-w-md mx-auto h-64 bg-white rounded-[2rem] shadow-sm p-8 space-y-6">
              <div class="h-6 w-32 bg-gray-100 rounded-full mx-auto"></div>
              <div class="h-4 w-full bg-gray-50 rounded-full"></div>
              <div class="h-4 w-2/3 bg-gray-50 rounded-full mx-auto"></div>
              <div class="h-12 w-full bg-gray-100 rounded-2xl"></div>
           </div>
        </div>
      </div>
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
