<script setup>
import { ref } from 'vue'
import NovaChatWidget from './NovaChatWidget.vue'

const emit = defineEmits(['require-auth'])

const isOpen = ref(false)

const toggle = () => { isOpen.value = !isOpen.value }
const close = () => { isOpen.value = false }
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    <!-- Chat widget -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <NovaChatWidget
        v-if="isOpen"
        @close="close"
        @require-auth="emit('require-auth')"
      />
    </Transition>

    <!-- Floating button -->
    <button
      @click="toggle"
      class="w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center relative"
      aria-label="Chat dengan Nova AI"
    >
      <!-- Open icon: sparkle -->
      <svg v-if="!isOpen" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <!-- Close icon: X -->
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
      </svg>

      <!-- Pulse ring when closed -->
      <span v-if="!isOpen" class="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30 pointer-events-none"></span>
    </button>

    <!-- Label tooltip -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!isOpen"
        class="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full shadow pointer-events-none absolute right-16 bottom-3 whitespace-nowrap"
      >
        Buat undangan pakai AI ✨
      </div>
    </Transition>
  </div>
</template>
