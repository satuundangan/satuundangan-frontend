<template>
  <button
    type="button"
    @click.stop="toggleAudio"
    :class="[
      'inline-flex items-center gap-1.5 transition-all duration-300 rounded-full font-bold select-none cursor-pointer',
      isThisPlaying
        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-400/40'
        : 'bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/80 shadow-xs hover:shadow-md hover:scale-102',
      compact ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-1.5 text-xs',
    ]"
    :title="isThisPlaying ? 'Jeda Musik' : 'Dengarkan Cuplikan Musik Tema'"
    :aria-label="isThisPlaying ? 'Jeda Musik' : 'Dengarkan Cuplikan Musik Tema'"
  >
    <!-- Wave / Disk Icon -->
    <span class="flex items-center justify-center">
      <span v-if="isThisPlaying" class="flex items-center gap-0.5 h-3">
        <span class="w-0.5 h-2 bg-white animate-bounce"></span>
        <span class="w-0.5 h-3 bg-white animate-bounce [animation-delay:0.15s]"></span>
        <span class="w-0.5 h-1.5 bg-white animate-bounce [animation-delay:0.3s]"></span>
      </span>
      <i v-else class="fa-solid fa-music text-[11px] text-amber-500"></i>
    </span>

    <!-- Play/Pause state icon & label -->
    <span class="flex items-center gap-1">
      <i :class="isThisPlaying ? 'fa-solid fa-pause text-[10px]' : 'fa-solid fa-play text-[9px]'"></i>
      <span v-if="!compact">{{ isThisPlaying ? 'Jeda Musik' : 'Cuplikan Musik' }}</span>
      <span v-else>{{ isThisPlaying ? 'Jeda' : 'Musik' }}</span>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'

const props = defineProps({
  audioUrl: {
    type: String,
    default: '',
  },
  templateName: {
    type: String,
    default: '',
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const { play, isCurrentTrackPlaying } = useAudioPlayer()

const isThisPlaying = computed(() => {
  return isCurrentTrackPlaying(props.audioUrl)
})

function toggleAudio() {
  play(props.audioUrl)
}
</script>
