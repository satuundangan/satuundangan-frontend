<template>
  <div class="bg-[#FFF6E3] min-h-screen text-gray-800 font-sans">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
onMounted(() => {
  auth.init()
})

</script>
