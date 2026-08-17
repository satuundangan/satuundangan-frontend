<template>
  <section id="tutorial" class="section bg-white scroll-mt-20 py-24 relative overflow-hidden">
    <!-- Decorative blobs -->
    <div class="absolute top-0 right-0 w-80 h-80 bg-mocha/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-sage/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

    <div class="max-w-3xl mx-auto px-6 relative z-10 text-center">
      <span class="text-mocha font-bold tracking-widest uppercase text-sm mb-2 block">Tutorial</span>
      <h2 class="text-4xl md:text-5xl font-playfair font-bold text-dark mb-4">Lihat Cara Pakainya</h2>
      <p class="text-muted text-lg max-w-xl mx-auto mb-12">
        Tonton video singkat ini biar makin paham cara bikin undanganmu dari awal sampai jadi.
      </p>

      <!-- Video frame (TikTok vertical 9:16) -->
      <div class="mx-auto w-full max-w-[325px]">
        <div
          class="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl shadow-mocha/10 border border-gray-100 bg-gray-50">
          <iframe
            v-if="embedId"
            :src="`https://www.tiktok.com/embed/v2/${embedId}`"
            class="absolute inset-0 w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>

          <!-- Placeholder until a real TikTok URL is set -->
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-gray-400">
            <i class="fa-brands fa-tiktok text-5xl mb-4 text-dark/70"></i>
            <p class="font-bold text-dark/70">Video tutorial segera hadir</p>
            <p class="text-sm mt-1">Pasang link TikTok di <code>tiktokUrl</code>.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

// TODO: ganti dengan URL video TikTok tutorial.
// Format: https://www.tiktok.com/@akun/video/1234567890123456789
const tiktokUrl = ''

// Extract numeric video id from a TikTok video URL.
const embedId = computed(() => {
  const match = tiktokUrl.match(/\/video\/(\d+)/)
  return match ? match[1] : ''
})
</script>
