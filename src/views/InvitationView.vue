<script setup>
import {
  getInvitationBySlug,
  getInvitationWithGuest,
  getMyInvitationBySlug,
  getInvitationBySubdomain,
  getCustomSubdomain,
} from '@/api/invitation'
import { demoData } from '@/api/demoData'
import { orangutanData } from '@/api/orangutanData'
import { getTemplateDesignBySlug } from '@/api/templateDesign'
import { featuresFor } from '@/config/packageFeatures'
import { onMounted, ref, computed, defineAsyncComponent, shallowRef, markRaw, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QRCode from 'qrcode'
import {
  templateLoaders,
  resolveTemplateKey,
  normalizeTemplateKey,
  FALLBACK_TEMPLATE_KEY,
  DYNAMIC_THEME_KEY,
} from '@/utils/templateRegistry'

const props = defineProps({
  // Host-based mode: invitation resolved from custom subdomain, not route slug.
  subdomainMode: { type: Boolean, default: false },
})

const TIARA_INVITATION_SLUG = 'refda-tiara'
const TIARA_TEMPLATE_KEY = 'refda-tiara-noir'

const route = useRoute()
const router = useRouter()
// In subdomain mode the route has no :slug — resolve label from the host.
const subdomainLabel = props.subdomainMode ? getCustomSubdomain() : null
const slug = route.params.slug
const invitationData = ref(null)
const TemplateComponent = shallowRef(null)
const loading = ref(true)
const error = ref(null)
const isPreviewMode = ref(false)
const isInsideFrame = ref(false)
const isDemoMode = ref(false)
const guestData = ref(null)
const showTicketModal = ref(false)
const ticketQrDataUrl = ref('')
const isGeneratingQr = ref(false)

const isLiveSyncActive = ref(false)

const ALL_SECTION_KEYS = [
  'quote', 'love-story', 'couple', 'event', 'gallery', 'rsvp', 
  'gift', 'extended-family', 'dress-code', 
  'live-streaming', 'video', 'denah', 'menu', 'countdown',
  'wishes', 'map', 'music', 'photoCouple', 'hero'
]

let templateResolveSeq = 0

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
  watch(() => invitationData.value?.template_slug, async (newSlug) => {
    if (!newSlug) return
    const seq = ++templateResolveSeq
    let tmpl = null
    let key = resolveTemplateKey(newSlug)

    // Unknown slug: the design may be an admin-created row bound to an existing renderer.
    if (key === FALLBACK_TEMPLATE_KEY && normalizeTemplateKey(newSlug) !== FALLBACK_TEMPLATE_KEY) {
      try {
        tmpl = await getTemplateDesignBySlug(newSlug)
        key = resolveTemplateKey(newSlug, tmpl?.componentKey)
      } catch {
        // keep the fallback — a network error or 404 must not blank the page
      }
    }
    if (seq !== templateResolveSeq) return // a newer slug won the race

    // The dynamic-theme renderer needs designConfig even when the slug itself
    // resolved directly (i.e. the componentKey lookup above was skipped).
    if (key === DYNAMIC_THEME_KEY && !tmpl) {
      try {
        tmpl = await getTemplateDesignBySlug(newSlug)
      } catch {
        // defaults are fine — dynamic-theme renders a complete invitation with zero designConfig
      }
      if (seq !== templateResolveSeq) return
    }

    if (tmpl?.designConfig && invitationData.value && !isLiveSyncActive.value) {
      // Reassigning the object does not re-fire this watch (its source is
      // template_slug, unchanged) but does propagate through the template's
      // deep props.data watch.
      invitationData.value = { ...invitationData.value, designConfig: tmpl.designConfig }
    }

    TemplateComponent.value = markRaw(defineAsyncComponent({
      loader: templateLoaders[key],
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
      let sampleContent = {}
      let tmpl = null
      try {
        tmpl = await getTemplateDesignBySlug(templateSlug)
        templateDefaultMusic = tmpl?.defaultMusic || null
        templateAudioStart = tmpl?.defaultAudioStart ?? 0
        templateAudioEnd = tmpl?.defaultAudioEnd ?? 0
        sampleContent =
          tmpl && typeof tmpl.sampleContent === 'object' && tmpl.sampleContent
            ? tmpl.sampleContent
            : {}
        applyDemoSeo(tmpl)
      } catch {
        // no-op — demo still works without template music
      }
      
      const defaultDemoMusic = {
        'naruto': 'wedding-instrumental-garden.mp3',
        'one-piece': 'one-piece-luffy.mp3',
      }
        
      data = {
        ...demoData,
        ...sampleContent,
        ...(templateSlug === TIARA_TEMPLATE_KEY
          ? {
              id: 0,
              title: 'The wedding of us',
              groomName: 'Muhammad Refda',
              groomPhotoUrl: '/assets/images/refda-tiara/refda.png',
              brideName: 'Uk Tiara Ayu',
              bridePhotoUrl: '/assets/images/refda-tiara/tiara.png',
              guestName: route.query.to || 'Tamu Undangan',
              quoteText:
                'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
              quoteSource: 'QS. Ar-Rum: 21',
              dateTime: '2026-11-22T09:00:00.000Z',
              isSingleEvent: true,
              mergeEvents: true,
              akadLocation: {
                dateTime: '2026-11-22T09:00:00.000Z',
                mapUrl: '',
                description: '',
              },
              resepsiLocation: {
                dateTime: '2026-11-22T09:00:00.000Z',
                mapUrl: '',
                description: '',
              },
              galleryImages: [],
              loveStory: [],
              bankAccounts: [],
              giftDeliveryAddress: [],
              selectedSections: ['hero', 'quote', 'couple', 'event', 'rsvp'],
              designSettings: {
                fontFamily: 'Cormorant Garamond',
                titleScale: 1,
                backgroundType: 'image',
                backgroundUrl: '',
              },
            }
          : {}),
        template_slug: templateSlug,
        guestName: route.query.to || sampleContent.guestName || demoData.guestName,
        musicChoice: templateDefaultMusic || defaultDemoMusic[templateSlug] || demoData.musicChoice,
        audioStart: templateDefaultMusic ? templateAudioStart : (demoData.audioStart || 0),
        audioEnd: templateDefaultMusic ? templateAudioEnd : (demoData.audioEnd || 0),
        show_branding: false, // demo preview is a clean (premium-look) showcase
        designConfig: tmpl?.designConfig ?? null,
      }
    } else {
      try {
        // Normal Mode: Fetch from API
        const response = await fetchInvitationData(slug)
        const rawData = response?.invitation || response
        if (response?.guest) {
          guestData.value = response.guest
        }
        
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
          template_slug:
            rawData.slug === TIARA_INVITATION_SLUG
              ? TIARA_TEMPLATE_KEY
              : rawData.template_slug || rawData.templateName,
          show_branding: rawData.show_branding ?? false,
          is_published: rawData.is_published !== undefined ? rawData.is_published : rawData.isPublished,
          guestName: response?.guest?.name,
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
       error.value = err?.message || 'Undangan tidak ditemukan atau terjadi kesalahan.'
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

const isPersonalGuest = computed(() => {
  return Boolean(
    route.params.guestSlug ||
    route.params.token ||
    route.query.token ||
    guestData.value?.accessToken ||
    guestData.value?.slug ||
    guestData.value?.id
  )
})

const weddingCoupleNames = computed(() => {
  const d = invitationData.value
  if (!d) return 'The Wedding'
  if (d.groomName && d.brideName) return `${d.groomName} & ${d.brideName}`
  if (d.groom_name && d.bride_name) return `${d.groom_name} & ${d.bride_name}`
  if (d.couple_name) return d.couple_name
  if (d.title) return d.title
  return 'The Wedding'
})

const guestDisplayName = computed(() => {
  return guestData.value?.name || invitationData.value?.guestName || route.query.to || 'Tamu Undangan'
})

const guestCategory = computed(() => {
  return guestData.value?.group || guestData.value?.category || 'VIP'
})

async function generateTicketQr() {
  if (ticketQrDataUrl.value) return
  isGeneratingQr.value = true
  try {
    const token =
      route.params.guestSlug ||
      route.params.token ||
      guestData.value?.accessToken ||
      guestData.value?.slug ||
      guestData.value?.id ||
      route.query.token

    const qrPayload =
      typeof window !== 'undefined' && window.location?.href
        ? window.location.href
        : String(token || 'guest')

    ticketQrDataUrl.value = await QRCode.toDataURL(qrPayload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
  } catch (e) {
    console.error('Failed to generate ticket QR code', e)
  } finally {
    isGeneratingQr.value = false
  }
}

function openTicketModal() {
  generateTicketQr()
  showTicketModal.value = true
}

// Set document title + meta/OG tags for a template's demo page from its SEO
// fields, falling back to the template name/description/thumbnail.
function applyDemoSeo(tmpl) {
  if (!tmpl || typeof document === 'undefined') return
  const title = tmpl.seoTitle || `${tmpl.name} — Demo Undangan Digital | Satu Undangan`
  const description =
    tmpl.seoDescription ||
    tmpl.description ||
    `Lihat demo template undangan pernikahan digital ${tmpl.name} di Satu Undangan.`
  const image = tmpl.thumbnailUrl || tmpl.previewUrl || ''

  document.title = title

  const canonicalUrl = window.location.href.split('#')[0]
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', canonicalUrl)

  const upsertMeta = (key, attr, value) => {
    if (!value) return
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', value)
  }

  upsertMeta('description', 'name', description)
  upsertMeta('og:title', 'property', title)
  upsertMeta('og:description', 'property', description)
  upsertMeta('og:image', 'property', image)
  upsertMeta('og:type', 'property', 'website')
  upsertMeta('twitter:card', 'name', image ? 'summary_large_image' : 'summary')
  upsertMeta('twitter:title', 'name', title)
  upsertMeta('twitter:description', 'name', description)
  upsertMeta('twitter:image', 'name', image)
}

async function fetchInvitationData(slug) {
  try {
    let response
    if (props.subdomainMode && subdomainLabel) {
      response = await getInvitationBySubdomain(subdomainLabel)
    } else if (isPreviewMode.value) {
      response = await getMyInvitationBySlug(slug)
    } else if (route.params.guestSlug) {
      response = await getInvitationWithGuest(slug, route.params.guestSlug)
    } else {
      response = await getInvitationBySlug(slug)
    }
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
      show_branding: featuresFor(payload.package).watermark,
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

      <!-- Floating Ticket & QR Action Button for Personal Guest -->
      <div
        v-if="isPersonalGuest && !isInsideFrame"
        class="fixed bottom-6 right-6 z-40 transition-all duration-300"
      >
        <button
          type="button"
          @click="openTicketModal"
          class="flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-slate-900/95 hover:bg-black text-white shadow-2xl shadow-black/30 backdrop-blur-md border border-white/20 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm font-extrabold tracking-wide cursor-pointer group"
        >
          <span class="text-base group-hover:rotate-12 transition-transform duration-300">🎟️</span>
          <span>Tiket & QR Kehadiran</span>
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      <!-- Ticket & QR Kehadiran Modal -->
      <Teleport to="body">
        <div
          v-if="showTicketModal"
          class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
          @click.self="showTicketModal = false"
        >
          <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up border border-slate-100">
            <!-- Decorative Header -->
            <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-[#a47148] p-6 text-white text-center relative overflow-hidden">
              <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
              <div class="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-[#a47148]/20 blur-xl"></div>

              <button
                type="button"
                @click="showTicketModal = false"
                class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>

              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-xs border border-white/10">
                <span>🎟️</span>
                <span>E-Ticket & QR Kehadiran</span>
              </div>

              <h3 class="text-lg sm:text-xl font-black tracking-tight leading-tight">
                {{ weddingCoupleNames }}
              </h3>
              <p class="text-[11px] text-slate-300 mt-1 font-medium">Buku Tamu Digital & Akses Masuk Resepsi</p>
            </div>

            <!-- Perforated Ticket Divider -->
            <div class="relative flex items-center justify-between px-3 -my-3 z-10">
              <div class="w-6 h-6 rounded-full bg-black/60 -ml-6"></div>
              <div class="flex-1 border-t-2 border-dashed border-slate-200 mx-2"></div>
              <div class="w-6 h-6 rounded-full bg-black/60 -mr-6"></div>
            </div>

            <!-- Guest Info & QR Code -->
            <div class="p-6 text-center space-y-4">
              <div>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 mb-1.5">
                  {{ guestCategory }}
                </span>
                <h4 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {{ guestDisplayName }}
                </h4>
              </div>

              <!-- QR Code Container -->
              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 inline-block shadow-inner">
                <div v-if="ticketQrDataUrl" class="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-xl overflow-hidden bg-white p-2 shadow-xs flex items-center justify-center">
                  <img :src="ticketQrDataUrl" alt="QR Code Kehadiran" class="w-full h-full object-contain" />
                </div>
                <div v-else class="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                  <i class="fa-solid fa-circle-notch animate-spin text-2xl mb-2 text-[#a47148]"></i>
                  <span class="text-xs font-bold">Membuat QR Code...</span>
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p class="text-xs text-slate-600 font-medium leading-relaxed">
                  <i class="fa-solid fa-camera text-slate-400 mr-1"></i>
                  Tunjukkan QR Code ini kepada penerima tamu di meja resepsi untuk akses masuk.
                </p>
              </div>

              <button
                type="button"
                @click="showTicketModal = false"
                class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>
