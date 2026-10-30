<template>
  <div class=" text-gray-800 font-sans">
    <MaintenanceBanner />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MaintenanceBanner from '@/components/MaintenanceBanner.vue'

const auth = useAuthStore()
onMounted(() => {
  auth.init()
})

</script>


<style></style>
