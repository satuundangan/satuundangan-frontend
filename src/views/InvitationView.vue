<script setup>
// import { getInvitationBySlug } from '@/api/invitation'
import { onMounted, ref, defineAsyncComponent, shallowRef, markRaw } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug
const invitationData = ref(null)
const TemplateComponent = shallowRef(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    // const data = await getInvitationBySlug(slug)
    // invitationData.value = data

    const templateSlug = slug//data.template_slug

    // Dynamic import template berdasarkan slug
    TemplateComponent.value = markRaw(defineAsyncComponent(() =>
      import(`../templates/${templateSlug}.vue`)
    ))
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
