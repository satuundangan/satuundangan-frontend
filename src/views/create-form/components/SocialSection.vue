<template>
  <section class="space-y-6">
    <div>
      <label class="block text-mocha font-semibold">Sosial Media Mempelai</label>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <h3 class="font-semibold text-mocha">Mempelai Wanita</h3>
          <input v-model="formData.sosmedBride.instagram" type="text" placeholder="Instagram" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <input v-model="formData.sosmedBride.tiktok" type="text" placeholder="TikTok" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <input v-model="formData.sosmedBride.youtube" type="text" placeholder="YouTube" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <input v-model="formData.sosmedBride.otherSocial" type="text" placeholder="Link lainnya" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
        </div>
        <div class="space-y-2">
          <h3 class="font-semibold text-mocha">Mempelai Pria</h3>
          <input v-model="formData.sosmedGroom.instagram" type="text" placeholder="Instagram" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <input v-model="formData.sosmedGroom.tiktok" type="text" placeholder="TikTok" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <input v-model="formData.sosmedGroom.youtube" type="text" placeholder="YouTube" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <input v-model="formData.sosmedGroom.otherSocial" type="text" placeholder="Link lainnya" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
        </div>
      </div>
    </div>

    <div>
      <label class="block text-mocha font-semibold">Link Live Streaming</label>
      <input
        v-model="formData.liveStreamingLink"
        type="url"
        placeholder="https://youtube.com/..."
        class="w-full rounded-xl border border-gray-300 bg-white p-2"
      />
    </div>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
})

const { formData } = toRefs(props)
</script>
