<script setup>
import { getInvitationBySlug } from '@/api/invitation'
import { onMounted, ref, defineAsyncComponent, shallowRef, markRaw } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug
const invitationData = ref(null)
const TemplateComponent = shallowRef(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const isPreview = route.query.preview === 'true'
  
  try {
    let data;
    if (isPreview) {
      const stored = localStorage.getItem('finalPayload')
      data = stored ? JSON.parse(stored) : null
      if (!data) throw new Error('No preview data found')
    } else {
      data = await getInvitationBySlug(slug)
    }
    
    invitationData.value = data

    // Default to 'dark-elegant' if templateName or template_slug is missing
    const templateSlug = (data.templateName || data.template_slug || 'dark-elegant').toLowerCase().replace(/\s+/g, '-')

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
</script>

<template>
  <div>

    <div v-if="loading" class="min-h-screen text-center flex justify-center items-center">Loading undangan...
    </div>
    <div v-else-if="error" class="min-h-screen text-center flex justify-center items-center text-red-600">{{
      error }}</div>
    <component :is="TemplateComponent" v-else :data="invitationData" />
  </div>
</template>
