<template>
  <section class="space-y-6">
    <div v-if="sections.photoCouple" class="space-y-2" data-field="photoCouple">
      <label class="block text-mocha font-semibold">Foto Mempelai (Background Awal) <span class="text-red-500">*</span></label>
      <input
        type="file"
        accept="image/*"
        @change="emit('upload-couple', $event)"
        :class="inputClass(validationErrors.photoCouple)"
      />
      <p v-if="validationErrors.photoCouple" class="text-sm text-red-500">{{ validationErrors.photoCouple }}</p>
      <div v-if="formData.photoCouple" class="pt-2">
        <p class="text-sm text-gray-500">Preview:</p>
        <img :src="formData.photoCouple" class="mt-2 h-48 rounded-xl object-cover shadow" alt="Foto Mempelai" />
      </div>
    </div>

    <div v-if="sections.music" class="space-y-2" data-field="music">
      <label class="block text-mocha font-semibold">Musik Latar</label>
      <select v-model="formData.music" class="w-full rounded-xl border border-gray-300 bg-white p-2">
        <option disabled value="">Pilih Musik</option>
        <option value="romantic">Romantic Instrumental</option>
        <option value="acoustic">Acoustic Vibes</option>
        <option value="classic">Classic Wedding</option>
        <option value="custom">Custom (Premium Only)</option>
      </select>
      <p v-if="validationErrors.music" class="text-sm text-red-500">{{ validationErrors.music }}</p>
      <div v-if="formData.music === 'custom' && isPremiumTemplate" class="space-y-1">
        <label class="block text-sm font-semibold text-mocha">Upload File Musik</label>
        <input type="file" accept="audio/*" class="w-full rounded-xl border border-gray-300 bg-white p-2" @change="emit('upload-music', $event)" />
        <p v-if="formData.musicFileName" class="text-sm text-gray-500">{{ formData.musicFileName }}</p>
      </div>
      <p v-if="formData.music === 'custom' && !isPremiumTemplate" class="text-sm italic text-red-500">
        Upload musik hanya tersedia di template Premium
      </p>
    </div>

    <div class="space-y-3" data-field="gallery">
      <label class="block text-mocha font-semibold">Galeri Foto Mempelai</label>
      <input type="file" accept="image/*" multiple class="w-full rounded-xl border border-gray-300 bg-white p-2" @change="emit('upload-gallery', $event)" />
      <p v-if="validationErrors.gallery" class="text-sm text-red-500">{{ validationErrors.gallery }}</p>
      <div v-if="formData.gallery.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <div v-for="(img, index) in formData.gallery" :key="index" class="group relative">
          <img :src="img.preview" class="h-40 w-full rounded-lg object-cover shadow" />
          <button
            type="button"
            class="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
            @click="emit('remove-gallery', index)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div v-if="sections.denah" class="space-y-2" data-field="denah">
      <label class="block text-mocha font-semibold">Gambar Denah Ruangan <span class="text-red-500">*</span></label>
      <input
        type="file"
        accept="image/*"
        @change="emit('upload-denah', $event)"
        :class="inputClass(validationErrors.denah)"
      />
      <p v-if="validationErrors.denah" class="text-sm text-red-500">{{ validationErrors.denah }}</p>
      <div v-if="formData.denah" class="pt-2">
        <img :src="formData.denah" alt="Denah" class="h-48 rounded-xl object-cover shadow" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  validationErrors: { type: Object, required: true },
  sections: { type: Object, required: true },
  isPremiumTemplate: { type: Boolean, default: false },
})

const emit = defineEmits(['upload-couple', 'upload-gallery', 'remove-gallery', 'upload-denah', 'upload-music'])

const { formData, validationErrors, sections, isPremiumTemplate } = toRefs(props)

function inputClass(error) {
  return [
    'w-full rounded-xl border bg-white p-2 outline-none focus:border-mocha focus:ring focus:ring-mocha/20',
    error ? 'border-red-500' : 'border-gray-300',
  ]
}
</script>
