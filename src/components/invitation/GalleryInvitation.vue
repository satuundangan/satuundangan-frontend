<template>
  <div class="gallery-container mx-auto max-w-6xl px-4">
    <!-- Thumbnail Grid -->
    <div class="grid-container">
      <div v-for="(item, index) in items" :key="index" class="grid-item" @click="openLightbox(index)">
        <img :src="item.thumbnail || item.src" :alt="item.alt || `Image ${index + 1}`" class="thumbnail-image"
          loading="lazy" />
        <div v-if="item.caption" class="image-caption">{{ item.caption }}</div>
      </div>
    </div>

    <!-- Lightbox Overlay -->
    <Teleport to="body">
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
    </Teleport>
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
/* Main Container */
.gallery-container {
  width: 100%;
  padding: 2rem 0;
}

/* Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Grid Items */
.grid-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  aspect-ratio: 1 / 1;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Hover Effects */
.grid-item:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

/* Image Styling */
.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.grid-item:hover .thumbnail-image {
  transform: scale(1.05);
}

/* Caption Styling */
.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.2rem;
  color: white;
  font-size: 0.95rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 30%, transparent);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.grid-item:hover .image-caption {
  opacity: 1;
  transform: translateY(0);
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: pan-y;
  backdrop-filter: blur(8px);
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
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.lightbox-caption {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.8rem 1.5rem;
  border-radius: 24px;
  max-width: 80%;
  text-align: center;
  font-size: 1.1rem;
}

/* Navigation Buttons */
.close-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 2.5rem;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.5rem;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 2rem;
}

.next-btn {
  right: 2rem;
}

/* Animations */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-next-enter-from {
  transform: translateX(30%);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-30%);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(30%);
  opacity: 0;
}

@media (max-width: 768px) {
  .close-btn {
    top: 1rem;
    right: 1rem;
    width: 2.8rem;
    height: 2.8rem;
    font-size: 2rem;
  }

  .nav-btn {
    width: 3rem;
    height: 3rem;
    font-size: 2rem;
  }

  .lightbox-caption {
    bottom: 1.5rem;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>