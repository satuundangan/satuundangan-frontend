<template>
  <div class="dt-art-scene" data-testid="dt-art-scene" aria-hidden="true">
    <div class="dt-art-scene__background" :style="backgroundStyle"></div>
    <img
      v-if="hero.layers?.back"
      :src="hero.layers.back"
      alt=""
      class="dt-art-layer dt-art-layer--back"
      :class="motionClass"
    />
    <img
      v-if="hero.layers?.middle"
      :src="hero.layers.middle"
      alt=""
      class="dt-art-layer dt-art-layer--middle"
      :class="motionClass"
    />
    <img
      v-if="hero.layers?.front"
      :src="hero.layers.front"
      alt=""
      class="dt-art-layer dt-art-layer--front"
      :class="motionClass"
    />
    <img
      v-if="hero.layers?.accent"
      :src="hero.layers.accent"
      alt=""
      class="dt-art-layer dt-art-layer--accent"
      :class="motionClass"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ORNAMENT_MOTION_PRESETS } from '@/utils/themeConfig'

const props = defineProps({
  hero: { type: Object, required: true },
  motionPreset: { type: String, default: 'none' },
})

const backgroundStyle = computed(() => ({
  backgroundImage: props.hero.backgroundImage
    ? `url("${props.hero.backgroundImage}")`
    : 'none',
}))

const motionClass = computed(() => {
  const preset = props.motionPreset
  return ORNAMENT_MOTION_PRESETS.includes(preset) && preset !== 'none'
    ? `dt-art-motion-${preset}`
    : ''
})
</script>

<style scoped>
.dt-art-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background-color: var(--dt-color-background);
}

.dt-art-scene__background,
.dt-art-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.dt-art-scene__background {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.dt-art-layer {
  object-fit: cover;
  object-position: center;
}

.dt-art-layer--back { z-index: 1; }
.dt-art-layer--middle { z-index: 2; }
.dt-art-layer--front { z-index: 3; }
.dt-art-layer--accent { z-index: 4; }

.dt-art-motion-float { animation: dt-art-float var(--dt-motion-duration, 8s) ease-in-out infinite; }
.dt-art-motion-drift { animation: dt-art-drift var(--dt-motion-duration, 12s) ease-in-out infinite; }
.dt-art-motion-sway {
  animation: dt-art-sway var(--dt-motion-duration, 7s) ease-in-out infinite;
  transform-origin: 50% 100%;
}
.dt-art-motion-twinkle { animation: dt-art-twinkle var(--dt-motion-duration, 4s) ease-in-out infinite; }
.dt-art-motion-pulse { animation: dt-art-pulse var(--dt-motion-duration, 5s) ease-in-out infinite; }

@keyframes dt-art-float {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -7px, 0); }
}
@keyframes dt-art-drift {
  0%, 100% { transform: translate3d(-5px, 2px, 0); }
  50% { transform: translate3d(5px, -3px, 0); }
}
@keyframes dt-art-sway {
  0%, 100% { transform: rotate(-1.5deg) translateX(-2px); }
  50% { transform: rotate(1.5deg) translateX(2px); }
}
@keyframes dt-art-twinkle {
  0%, 100% { opacity: 0.72; }
  50% { opacity: 1; }
}
@keyframes dt-art-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.025); }
}

@media (prefers-reduced-motion: reduce) {
  .dt-art-layer { animation: none !important; }
}
</style>
