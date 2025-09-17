<template>
  <section class="space-y-6">
    <div v-if="sections.map" class="space-y-4" data-field="isSingleEvent">
      <div>
        <label class="block text-mocha font-semibold">Apakah Acara Digabung? <span class="text-red-500">*</span></label>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2">
            <input type="radio" :value="true" v-model="formData.isSingleEvent" @change="emit('validate', 'isSingleEvent')" />
            Ya, satu lokasi
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" :value="false" v-model="formData.isSingleEvent" @change="emit('validate', 'isSingleEvent')" />
            Tidak, Akad &amp; Resepsi dipisah
          </label>
        </div>
        <p v-if="validationErrors.isSingleEvent" class="text-sm text-red-500">{{ validationErrors.isSingleEvent }}</p>
      </div>

      <div v-if="formData.isSingleEvent === true" class="space-y-3">
        <div>
          <label class="block font-medium">Link Google Maps <span class="text-red-500">*</span></label>
          <input
            v-model="formData.map"
            @input="emit('validate', 'map')"
            type="url"
            placeholder="https://maps.google.com/..."
            :class="inputClass(validationErrors.map)"
          />
          <p v-if="validationErrors.map" class="text-sm text-red-500">{{ validationErrors.map }}</p>
        </div>
        <div data-field="dateTime">
          <label class="block text-sm font-semibold text-mocha">Tanggal &amp; Waktu Acara <span class="text-red-500">*</span></label>
          <input
            v-model="formData.dateTime"
            type="datetime-local"
            @input="emit('validate', 'dateTime')"
            :class="inputClass(validationErrors.dateTime)"
          />
          <p v-if="validationErrors.dateTime" class="text-sm text-red-500">{{ validationErrors.dateTime }}</p>
        </div>
        <input
          v-model="formData.mapDesc"
          type="text"
          placeholder="Keterangan Lokasi"
          class="w-full rounded-xl border border-gray-300 bg-white p-2"
        />
      </div>

      <div v-else-if="formData.isSingleEvent === false" class="grid gap-4 md:grid-cols-2">
        <div class="space-y-3" data-field="akadMap">
          <label class="block font-medium">Link Maps Akad <span class="text-red-500">*</span></label>
          <input
            v-model="formData.akadMap"
            @input="emit('validate', 'akadMap')"
            type="url"
            placeholder="https://maps.google.com/..."
            :class="inputClass(validationErrors.akadMap)"
          />
          <p v-if="validationErrors.akadMap" class="text-sm text-red-500">{{ validationErrors.akadMap }}</p>
          <input v-model="formData.akadDesc" type="text" placeholder="Keterangan Lokasi Akad" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <div data-field="akadDateTime">
            <label class="block text-sm font-semibold text-mocha">Tanggal Akad <span class="text-red-500">*</span></label>
            <input
              v-model="formData.akadDateTime"
              type="datetime-local"
              @input="emit('validate', 'akadDateTime')"
              :class="inputClass(validationErrors.akadDateTime)"
            />
            <p v-if="validationErrors.akadDateTime" class="text-sm text-red-500">{{ validationErrors.akadDateTime }}</p>
          </div>
        </div>

        <div class="space-y-3" data-field="resepsiMap">
          <label class="block font-medium">Link Maps Resepsi <span class="text-red-500">*</span></label>
          <input
            v-model="formData.resepsiMap"
            @input="emit('validate', 'resepsiMap')"
            type="url"
            placeholder="https://maps.google.com/..."
            :class="inputClass(validationErrors.resepsiMap)"
          />
          <p v-if="validationErrors.resepsiMap" class="text-sm text-red-500">{{ validationErrors.resepsiMap }}</p>
          <input v-model="formData.resepsiDesc" type="text" placeholder="Keterangan Lokasi Resepsi" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
          <div data-field="resepsiDateTime">
            <label class="block text-sm font-semibold text-mocha">Tanggal Resepsi <span class="text-red-500">*</span></label>
            <input
              v-model="formData.resepsiDateTime"
              type="datetime-local"
              @input="emit('validate', 'resepsiDateTime')"
              :class="inputClass(validationErrors.resepsiDateTime)"
            />
            <p v-if="validationErrors.resepsiDateTime" class="text-sm text-red-500">{{ validationErrors.resepsiDateTime }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="sections.countdown && formData.isSingleEvent === false" class="space-y-2">
      <label class="block text-mocha font-semibold">Tanggal &amp; Waktu Acara (Untuk Countdown)</label>
      <input v-model="formData.dateTime" type="datetime-local" class="w-full rounded-xl border border-gray-300 bg-white p-2" />
    </div>

    <div v-if="sections.encryptedGuest" class="space-y-2">
      <label class="block text-mocha font-semibold">Nama Tamu Terenkripsi?</label>
      <select v-model="formData.encryptedGuest" class="w-full rounded-xl border border-gray-300 bg-white p-2">
        <option value="ya">Ya</option>
        <option value="tidak">Tidak</option>
      </select>
    </div>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  validationErrors: { type: Object, required: true },
  sections: { type: Object, required: true },
})

const emit = defineEmits(['validate'])

const { formData, validationErrors, sections } = toRefs(props)

function inputClass(error) {
  return [
    'w-full rounded-xl border bg-white p-2 outline-none focus:border-mocha focus:ring focus:ring-mocha/20',
    error ? 'border-red-500' : 'border-gray-300',
  ]
}
</script>
