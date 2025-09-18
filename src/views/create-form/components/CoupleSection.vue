<template>
  <section class="space-y-6" data-field="brideName">
    <h2 class="text-xl font-bold text-center text-mocha border-b pb-2">Data Mempelai</h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="space-y-4">
        <div>
          <h3 class="text-mocha font-semibold">Mempelai Wanita <span class="text-red-500">*</span></h3>
          <input
            v-model="formData.brideName"
            @input="emit('validate', 'brideName')"
            type="text"
            placeholder="Nama Lengkap Wanita"
            :class="inputClass(validationErrors.brideName)"
          />
          <p v-if="validationErrors.brideName" class="text-sm text-red-500">{{ validationErrors.brideName }}</p>
        </div>
        <div>
          <input
            v-model="formData.brideParents"
            @input="emit('validate', 'brideParents')"
            type="text"
            placeholder="Nama Orang Tua Wanita"
            :class="inputClass(validationErrors.brideParents)"
          />
          <p v-if="validationErrors.brideParents" class="text-sm text-red-500">{{ validationErrors.brideParents }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-mocha mb-1">Foto Mempelai Wanita <span class="text-red-500">*</span></label>
          <input
            type="file"
            accept="image/*"
            @change="emit('upload-bride', $event)"
            :class="inputClass(validationErrors.bridePhoto)"
          />
          <p v-if="validationErrors.bridePhoto" class="text-sm text-red-500">{{ validationErrors.bridePhoto }}</p>
          <div v-if="formData.bridePhoto" class="mt-2">
            <img :src="formData.bridePhoto" alt="Foto Mempelai Wanita" class="max-w-48 h-72 rounded-xl object-cover shadow" />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-mocha font-semibold">Mempelai Pria <span class="text-red-500">*</span></h3>
          <input
            v-model="formData.groomName"
            @input="emit('validate', 'groomName')"
            type="text"
            placeholder="Nama Lengkap Pria"
            :class="inputClass(validationErrors.groomName)"
          />
          <p v-if="validationErrors.groomName" class="text-sm text-red-500">{{ validationErrors.groomName }}</p>
        </div>
        <div>
          <input
            v-model="formData.groomParents"
            @input="emit('validate', 'groomParents')"
            type="text"
            placeholder="Nama Orang Tua Pria"
            :class="inputClass(validationErrors.groomParents)"
          />
          <p v-if="validationErrors.groomParents" class="text-sm text-red-500">{{ validationErrors.groomParents }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-mocha mb-1">Foto Mempelai Pria <span class="text-red-500">*</span></label>
          <input
            type="file"
            accept="image/*"
            @change="emit('upload-groom', $event)"
            :class="inputClass(validationErrors.groomPhoto)"
          />
          <p v-if="validationErrors.groomPhoto" class="text-sm text-red-500">{{ validationErrors.groomPhoto }}</p>
          <div v-if="formData.groomPhoto" class="mt-2">
            <img :src="formData.groomPhoto" alt="Foto Mempelai Pria" class="max-w-48 h-72 rounded-xl object-cover shadow" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  validationErrors: { type: Object, required: true },
})

const emit = defineEmits(['validate', 'upload-bride', 'upload-groom'])

const { formData, validationErrors } = toRefs(props)

function inputClass(error) {
  return [
    'w-full p-2 border rounded-xl bg-white outline-none focus:ring focus:ring-mocha/20 focus:border-mocha',
    error ? 'border-red-500' : 'border-gray-300',
  ]
}
</script>
