<template>
  <div
    v-if="active"
    role="status"
    data-testid="maintenance-banner"
    class="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900"
  >
    {{ message }}
    <template v-if="untilLabel"> Perkiraan selesai: {{ untilLabel }}.</template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPublicStatus } from '@/api/adminSecurity.js'
import { classifyAnalyticsRoute } from '@/api/analytics.js'

const REFRESH_MS = 5 * 60 * 1000
const route = useRoute()
const status = ref(null)
let timer

// Only where someone can be buying: never on guest invitation pages or the admin panel.
const active = computed(
  () =>
    Boolean(status.value?.maintenance?.active) &&
    ['marketing', 'app'].includes(classifyAnalyticsRoute(route)),
)
const message = computed(() => status.value?.maintenance?.message || '')
const untilLabel = computed(() => {
  const until = status.value?.maintenance?.until
  return until
    ? new Date(until).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB'
    : ''
})

async function load() {
  try {
    status.value = await fetchPublicStatus()
  } catch {
    // A failed status check must never show a notice or block the page.
    status.value = null
  }
}

onMounted(() => {
  load()
  timer = setInterval(load, REFRESH_MS)
})
onBeforeUnmount(() => clearInterval(timer))
</script>
