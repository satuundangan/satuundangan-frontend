<template>
  <div class="gallery-container">
    <!-- Thumbnail Grid -->
    <div class="grid-container">
      <div v-for="(item, index) in items" :key="index" class="grid-item" :style="{
        'grid-column': `span ${item.colSpan || 1}`,
        'grid-row': `span ${item.rowSpan || 1}`
      }" @click="openLightbox(index)">
        <img :src="item.thumbnail || item.src" :alt="item.alt || `Image ${index + 1}`" class="thumbnail-image"
          loading="lazy" />
        <div v-if="item.caption" class="image-caption">{{ item.caption }}</div>
      </div>
    </div>

    <!-- Lightbox Overlay -->
    <div v-if="lightboxVisible" class="lightbox-overlay" @click="closeLightbox" @touchstart="handleTouchStart"
      @touchmove="handleTouchMove" @touchend="handleTouchEnd">
      <button class="close-btn" @click.stop="closeLightbox">×</button>
      <button class="nav-btn prev-btn" @click.stop="prevImage" @touchstart.stop>‹</button>

      <div class="lightbox-content">
        <transition :name="transitionDirection" mode="out-in">
          <div class="slide-container" :key="currentIndex">
            <img :src="items[currentIndex].src" :alt="items[currentIndex].alt || `Image ${currentIndex + 1}`"
              class="lightbox-image" ref="lightboxImage" />
            <div v-if="items[currentIndex].caption" class="lightbox-caption">
              {{ items[currentIndex].caption }}
            </div>
          </div>
        </transition>
      </div>

      <button class="nav-btn next-btn" @click.stop="nextImage" @touchstart.stop>›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => items.every(item => 'src' in item)
  }
})

// Lightbox state
const lightboxVisible = ref(false)
const currentIndex = ref(0)
const transitionDirection = ref('slide-next')

// Touch gestures
const touchStartX = ref(0)
const touchEndX = ref(0)
const isSwiping = ref(false)

const openLightbox = (index) => {
  currentIndex.value = index
  lightboxVisible.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxVisible.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (currentIndex.value < props.items.length - 1) {
    transitionDirection.value = 'slide-next'
    currentIndex.value++
  } else {
    transitionDirection.value = 'slide-next'
    currentIndex.value = 0
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    transitionDirection.value = 'slide-prev'
    currentIndex.value--
  } else {
    transitionDirection.value = 'slide-prev'
    currentIndex.value = props.items.length - 1
  }
}

// Touch event handlers
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  isSwiping.value = true
}

const handleTouchMove = (e) => {
  if (!isSwiping.value) return
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!isSwiping.value) return
  isSwiping.value = false

  const difference = touchStartX.value - touchEndX.value
  if (Math.abs(difference) > 50) { // Minimum swipe distance
    if (difference > 0) {
      nextImage()
    } else {
      prevImage()
    }
  }
}

// Keyboard navigation
const handleKeyDown = (e) => {
  if (!lightboxVisible.value) return

  switch (e.key) {
    case 'ArrowRight':
      nextImage()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'Escape':
      closeLightbox()
      break
  }
}

// Set up and clean up event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Grid Layout */
.gallery-container {
  width: 100%;
  padding: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.grid-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
  aspect-ratio: 1/1;
}

.grid-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.grid-item[style*="grid-column: span 2"] {
  aspect-ratio: 2/1;
}

.grid-item[style*="grid-row: span 2"] {
  aspect-ratio: 1/2;
}

.grid-item[style*="grid-column: span 2"][style*="grid-row: span 2"] {
  aspect-ratio: 2/2;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  padding: 0.5rem;
  font-size: 0.8rem;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: pan-y;
}

.lightbox-content {
  position: relative;
  width: 90%;
  height: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
}

.lightbox-caption {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  max-width: 80%;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prev-btn {
  left: 1rem;
}

.next-btn {
  right: 1rem;
}

/* Animation */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s ease;
}

.slide-next-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }

  .nav-btn {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.5rem;
  }
}
</style>
