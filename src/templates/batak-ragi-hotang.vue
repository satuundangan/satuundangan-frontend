<script setup>
import NusantaraInvitation from '@/components/invitation/NusantaraInvitation.vue'

const props = defineProps({ data: { type: Object, default: () => ({}) } })
</script>

<template>
  <NusantaraInvitation theme-key="batak" :data="props.data" />
</template>
