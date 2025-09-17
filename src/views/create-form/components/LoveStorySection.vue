<template>
  <section class="space-y-4" data-field="loveStories">
    <label class="block text-mocha font-semibold">Love Story</label>

    <div v-if="!loveStories.length" class="text-sm italic text-gray-400">Belum ada story yang ditambahkan.</div>

    <article
      v-for="(story, index) in loveStories"
      :key="index"
      class="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition"
    >
      <header
        class="flex cursor-pointer items-center justify-between bg-mocha/10 px-4 py-3 hover:bg-mocha/20"
        @click="story.isOpen = !story.isOpen"
      >
        <div class="flex items-center gap-2">
          <span class="font-semibold text-mocha">{{ story.title || `Story ${index + 1}` }}</span>
          <span class="text-xs text-gray-400">{{ story.date }}</span>
        </div>
        <div class="text-sm text-mocha">{{ story.isOpen ? '−' : '+' }}</div>
      </header>

      <transition name="fade">
        <div v-show="story.isOpen" class="space-y-4 p-4">
          <div>
            <label class="block text-sm font-semibold text-mocha">Judul Cerita</label>
            <input v-model="story.title" type="text" class="w-full rounded-md border border-gray-300 p-2" />
            <p v-if="loveStoryErrors?.[index]?.title" class="text-xs text-red-500">
              {{ loveStoryErrors[index].title }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-mocha">Upload Foto</label>
            <input
              type="file"
              accept="image/*"
              @change="emit('upload', $event, index)"
              class="w-full rounded-md border border-gray-300 p-2"
            />
            <div v-if="story.photo" class="mt-2">
              <img :src="story.photo" alt="Preview" class="h-48 rounded-lg object-cover shadow" />
            </div>
            <p v-if="loveStoryErrors?.[index]?.photo" class="text-xs text-red-500">
              {{ loveStoryErrors[index].photo }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-mocha">Deskripsi</label>
            <textarea
              v-model="story.description"
              rows="3"
              class="w-full resize-none rounded-md border border-gray-300 p-2"
              placeholder="Ceritakan kisahnya..."
            />
            <p v-if="loveStoryErrors?.[index]?.description" class="text-xs text-red-500">
              {{ loveStoryErrors[index].description }}
            </p>
          </div>

          <div class="text-right">
            <button type="button" class="rounded-full bg-red-500 px-4 py-2 text-xs text-white" @click="emit('remove', index)">
              Hapus
            </button>
          </div>
        </div>
      </transition>
    </article>

    <button
      type="button"
      class="rounded-full bg-mocha px-4 py-2 text-sm text-white hover:bg-mocha/90"
      @click="emit('add')"
    >
      + Tambah Cerita
    </button>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  loveStories: { type: Array, required: true },
  loveStoryErrors: { type: Array, default: () => [] },
})

const emit = defineEmits(['add', 'remove', 'upload'])

const { loveStories, loveStoryErrors } = toRefs(props)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
