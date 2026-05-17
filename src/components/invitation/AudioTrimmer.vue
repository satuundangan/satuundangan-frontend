<template>
  <div class="audio-trimmer space-y-4">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-semibold text-gray-700">Atur Bagian Musik</h3>
      <div class="text-xs text-gray-500 font-mono">
        {{ formatTime(startTime) }} - {{ formatTime(endTime) }}
      </div>
    </div>

    <!-- Waveform Container -->
    <div ref="waveformContainer" class="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200"></div>

    <!-- Controls -->
    <div class="flex items-center gap-3">
      <button 
        @click="togglePlay" 
        type="button"
        class="w-10 h-10 rounded-full bg-mocha text-white flex items-center justify-center hover:bg-mocha/90 transition-all"
      >
        <i :class="[isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play', { 'ml-1': !isPlaying }]"></i>
      </button>

      <div class="flex-1 grid grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Mulai (detik)</label>
          <input 
            type="number" 
            v-model.number="startTime" 
            step="0.1" 
            min="0" 
            :max="duration"
            class="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-mocha/20 outline-none"
          />
        </div>
        <div>
          <label class="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Selesai (detik)</label>
          <input 
            type="number" 
            v-model.number="endTime" 
            step="0.1" 
            min="0" 
            :max="duration"
            class="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-mocha/20 outline-none"
          />
        </div>
      </div>
    </div>

    <p class="text-[10px] text-gray-500 italic">
      * Musik akan otomatis berulang (loop) dari bagian yang Anda pilih.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  initialStart: {
    type: Number,
    default: 0
  },
  initialEnd: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:trim'])

const waveformContainer = ref(null)
const wavesurfer = ref(null)
const isPlaying = ref(false)
const duration = ref(0)
const startTime = ref(props.initialStart)
const endTime = ref(props.initialEnd)

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 10)
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
}

onMounted(() => {
  if (!waveformContainer.value) return

  wavesurfer.value = WaveSurfer.create({
    container: waveformContainer.value,
    waveColor: '#d2b48c',
    progressColor: '#8b4513',
    cursorColor: '#8b4513',
    height: 80,
    responsive: true,
    normalize: true,
    plugins: [
      RegionsPlugin.create()
    ]
  })

  wavesurfer.value.load(props.url)

  wavesurfer.value.on('ready', () => {
    duration.value = wavesurfer.value.getDuration()
    startTime.value = Math.min(Math.max(startTime.value || 0, 0), duration.value)
    endTime.value = endTime.value === 0
      ? duration.value
      : Math.min(Math.max(endTime.value, startTime.value + 0.1), duration.value)

    // Create a region for trimming
    const wsRegions = wavesurfer.value.registerPlugin(RegionsPlugin.create())
    
    const activeRegion = wsRegions.addRegion({
      id: 'trim-region',
      start: startTime.value,
      end: endTime.value,
      color: 'rgba(139, 69, 19, 0.2)',
      drag: true,
      resize: true
    })
    emitUpdate()

    // FIX: Use wsRegions instead of wavesurfer for region events
    wsRegions.on('region-updated', (reg) => {
      startTime.value = Number(reg.start.toFixed(2))
      endTime.value = Number(reg.end.toFixed(2))
      emitUpdate()
    })

    // Allow inputs to update the region
    watch([startTime, endTime], ([newStart, newEnd]) => {
      if (activeRegion) {
        const safeStart = Math.min(Math.max(Number(newStart) || 0, 0), duration.value)
        const safeEnd = Math.min(Math.max(Number(newEnd) || safeStart + 0.1, safeStart + 0.1), duration.value)

        activeRegion.setOptions({
          start: safeStart,
          end: safeEnd
        })
        emitUpdate()
      }
    })

    wavesurfer.value.on('play', () => isPlaying.value = true)
    wavesurfer.value.on('pause', () => isPlaying.value = false)
    
    // Loop within region
    wavesurfer.value.on('timeupdate', (time) => {
      if (time >= endTime.value) {
        wavesurfer.value.setTime(startTime.value)
      }
    })
  })
})

const emitUpdate = () => {
  emit('update:trim', {
    start: Number(startTime.value.toFixed(2)),
    end: Number(endTime.value.toFixed(2))
  })
}

const togglePlay = () => {
  if (wavesurfer.value.isPlaying()) {
    wavesurfer.value.pause()
  } else {
    wavesurfer.value.play()
  }
}

onUnmounted(() => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy()
  }
})
</script>
