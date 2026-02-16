<script setup>
import { getInvitationBySlug } from '@/api/invitation'
import { onMounted, ref, defineAsyncComponent, shallowRef, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const invitationData = ref(null)
const TemplateComponent = shallowRef(null)
const loading = ref(true)
const error = ref(null)
const isPreviewMode = ref(false)

onMounted(async () => {
  isPreviewMode.value = route.query.preview === 'true'
  
  try {
    const response = await getInvitationBySlug(slug)
    const rawData = response.data || response
    
    // Check if invitation is active or if we are in preview mode
    if (!rawData.is_published && !isPreviewMode.value) {
      error.value = 'Undangan ini belum dipublikasikan atau sudah tidak aktif.'
      loading.value = false
      return
    }
    
    // Flatten the data: merge root properties with content properties
    const data = {
      ...(rawData.content || {}),
      id: rawData.id,
      title: rawData.title,
      slug: rawData.slug,
      template_slug: rawData.template_slug || rawData.templateName,
      is_premium: rawData.is_premium,
      is_published: rawData.is_published
    }
    
    invitationData.value = {
      ...data,
      guestName: route.query.to || 'Tamu Undangan'
    }

    // Determine template slug
    const templateSlug = (data.template_slug || 'dark-elegant').toLowerCase().replace(/\s+/g, '-')

    // Dynamic import template berdasarkan slug
    // Ensure the path matches your project structure
    TemplateComponent.value = markRaw(defineAsyncComponent({
      loader: () => import(`../templates/${templateSlug}.vue`),
      errorComponent: {
        template: '<div class="text-center p-10">Template tidak ditemukan atau gagal dimuat.</div>'
      }
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
      <div v-if="isPreviewMode && !invitationData?.is_published" 
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
