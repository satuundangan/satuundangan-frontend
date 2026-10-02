import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { trackError } from './utils/telemetry'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err, info)
  trackError(err, { info, component: instance?.$options?.name || 'anonymous' })
}

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
  trackError(error, { source: 'unhandledrejection' })
})

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  }
})

app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  draggable: true,
  containerClassName: 'z-[10000]',
})


app.use(createPinia())
app.use(router)

app.mount('#app')
