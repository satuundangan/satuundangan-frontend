<template>
  <div ref="el" class="cf-turnstile"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const emit = defineEmits(['update:modelValue', 'error'])
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const el = ref(null)
let widgetId = null

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve()
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', reject)
      return
    }
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function renderWidget() {
  if (!siteKey) return
  try {
    await loadScript()
    window.turnstile.ready(() => {
      widgetId = window.turnstile.render(el.value, {
        sitekey: siteKey,
        callback: (token) => emit('update:modelValue', token),
        'expired-callback': () => emit('update:modelValue', ''),
        'error-callback': () => {
          emit('update:modelValue', '')
          emit('error')
        },
      })
    })
  } catch (e) {
    console.error('Gagal memuat Turnstile', e)
    emit('error')
  }
}

function reset() {
  if (window.turnstile && widgetId !== null) {
    window.turnstile.reset(widgetId)
    emit('update:modelValue', '')
  }
}

onMounted(renderWidget)
onBeforeUnmount(() => {
  if (window.turnstile && widgetId !== null) window.turnstile.remove(widgetId)
})

defineExpose({ reset })
</script>
