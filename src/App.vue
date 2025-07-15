<template>
  <div class=" text-gray-800 font-sans">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
onMounted(() => {
  auth.init()
})

</script>


<style></style>
