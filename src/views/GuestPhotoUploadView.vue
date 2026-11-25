<template>
  <div class="min-h-screen bg-[#FAF8F5] text-stone-800 selection:bg-stone-200">
    <!-- Editorial Top Bar -->
    <header class="border-b border-stone-200/80 bg-[#FAF8F5]/95 backdrop-blur-sm sticky top-0 z-20">
      <div class="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <p class="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-medium">
            Memory Wall
          </p>
          <h1 class="font-serif text-lg sm:text-xl text-stone-900 truncate">
            {{ invitation?.coupleName || invitation?.title || 'Live Photo Stream' }}
          </h1>
        </div>
        <router-link
          v-if="slug"
          :to="`/${slug}`"
          class="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 bg-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <i class="fa-solid fa-arrow-left text-[11px]"></i>
          <span>Undangan</span>
        </router-link>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 py-7 space-y-8">
      <!-- Loading State -->
      <div v-if="loading" class="py-16 text-center space-y-3">
        <i class="fa-solid fa-circle-notch animate-spin text-xl text-stone-400"></i>
        <p class="text-sm text-stone-500">Memuat ruang kenangan...</p>
      </div>

      <!-- Not Found / Error -->
      <div
        v-else-if="loadError"
        class="bg-white border border-stone-200/80 rounded-2xl p-8 text-center space-y-3"
      >
        <i class="fa-regular fa-image text-2xl text-stone-400"></i>
        <h2 class="font-serif text-xl text-stone-900">Halaman Tidak Ditemukan</h2>
        <p class="text-sm text-stone-500 max-w-sm mx-auto">
          {{ loadError }}
        </p>
      </div>

      <template v-else>
        <!-- Upload Card -->
        <section class="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-7 space-y-5">
          <div class="space-y-1">
            <h2 class="font-serif text-xl sm:text-2xl text-stone-900">
              Bagikan Momen Hari Ini
            </h2>
            <p class="text-sm text-stone-500 leading-relaxed">
              Unggah foto candid terbaik Anda. Foto yang disetujui akan tampil langsung di layar proyektor acara.
            </p>
          </div>

          <!-- Status Banner -->
          <div
            v-if="statusBanner"
            class="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm border"
            :class="
              statusBanner.type === 'success'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            "
          >
            <i
              :class="
                statusBanner.type === 'success'
                  ? 'fa-regular fa-circle-check mt-0.5 shrink-0'
                  : 'fa-solid fa-circle-exclamation mt-0.5 shrink-0'
              "
            ></i>
            <span>{{ statusBanner.text }}</span>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- File Drop / Camera Trigger -->
            <div>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                class="hidden"
                @change="handleFileChange"
              />

              <div
                v-if="!previewUrl"
                role="button"
                tabindex="0"
                @click="triggerFilePicker"
                @keydown.enter.prevent="triggerFilePicker"
                @keydown.space.prevent="triggerFilePicker"
                class="border border-dashed border-stone-300 hover:border-stone-500 bg-[#FAF8F5]/70 rounded-xl p-8 text-center cursor-pointer transition-colors space-y-2.5"
              >
                <div class="w-11 h-11 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto text-stone-700">
                  <i class="fa-solid fa-camera text-base"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-stone-800">
                    Ambil Foto atau Pilih dari Galeri
                  </p>
                  <p class="text-xs text-stone-400 mt-0.5">
                    JPG, PNG, WebP, atau HEIC (maksimal 5 MB)
                  </p>
                </div>
              </div>

              <div v-else class="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  :src="previewUrl"
                  alt="Pratinjau foto tamu"
                  class="w-full max-h-80 object-cover"
                />
                <button
                  type="button"
                  @click="clearSelectedFile"
                  class="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <i class="fa-solid fa-xmark text-[11px]"></i>
                  <span>Ganti Foto</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label for="snap-guest-name" class="block text-xs font-medium text-stone-600">
                  Nama Anda (Opsional)
                </label>
                <input
                  id="snap-guest-name"
                  v-model="guestName"
                  type="text"
                  maxlength="80"
                  placeholder="Contoh: Raka & Nadya"
                  class="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                />
              </div>

              <div class="space-y-1.5">
                <label for="snap-caption" class="block text-xs font-medium text-stone-600">
                  Keterangan Singkat (Opsional)
                </label>
                <input
                  id="snap-caption"
                  v-model="caption"
                  type="text"
                  maxlength="140"
                  placeholder="Momen manis di pelaminan"
                  class="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="!selectedFile || uploading"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-medium py-3 px-4 transition-colors"
            >
              <i v-if="uploading" class="fa-solid fa-circle-notch animate-spin text-xs"></i>
              <i v-else class="fa-solid fa-arrow-up-from-bracket text-xs"></i>
              <span>{{ uploading ? 'Mengunggah Foto...' : 'Kirim ke Memory Wall' }}</span>
            </button>
          </form>
        </section>

        <!-- Recent Approved Photos Grid -->
        <section class="space-y-4">
          <div class="flex items-baseline justify-between border-b border-stone-200/80 pb-3">
            <h3 class="font-serif text-lg text-stone-900">
              Galeri Tamu
            </h3>
            <span class="text-xs text-stone-500 tabular-nums">
              {{ photos.length }} foto
            </span>
          </div>

          <div
            v-if="photos.length === 0"
            class="bg-white border border-stone-200/80 rounded-2xl p-8 text-center space-y-2"
          >
            <i class="fa-regular fa-images text-xl text-stone-400"></i>
            <p class="text-sm text-stone-500">
              Belum ada foto yang dibagikan. Jadilah tamu pertama yang mengabadikan momen hari ini.
            </p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <article
              v-for="photo in photos"
              :key="photo.id"
              class="bg-white border border-stone-200/80 rounded-xl overflow-hidden flex flex-col"
            >
              <div class="aspect-square bg-stone-100 overflow-hidden">
                <img
                  :src="photo.thumbnailUrl || photo.imageUrl"
                  :alt="photo.caption || `Foto dari ${photo.guestName || 'Tamu'}`"
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-2.5 space-y-0.5">
                <p class="text-xs font-medium text-stone-800 truncate">
                  {{ photo.guestName || 'Tamu Undangan' }}
                </p>
                <p v-if="photo.caption" class="text-[11px] text-stone-500 line-clamp-2">
                  {{ photo.caption }}
                </p>
              </div>
            </article>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getSnapPortalInfo, uploadGuestPhoto } from '@/api/guestPhotos'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const loading = ref(true)
const loadError = ref('')
const invitation = ref(null)
const photos = ref([])

const fileInputRef = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const guestName = ref('')
const caption = ref('')
const uploading = ref(false)
const statusBanner = ref(null)

const MAX_FILE_BYTES = 5 * 1024 * 1024

function revokePreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
}

function triggerFilePicker() {
  fileInputRef.value?.click()
}

function clearSelectedFile() {
  selectedFile.value = null
  revokePreview()
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function handleFileChange(event) {
  statusBanner.value = null
  const file = event.target?.files?.[0]
  if (!file) return

  if (!file.type?.startsWith('image/')) {
    statusBanner.value = {
      type: 'error',
      text: 'Format file tidak didukung. Pilih file gambar JPG, PNG, atau WebP.',
    }
    clearSelectedFile()
    return
  }

  if (file.size > MAX_FILE_BYTES) {
    statusBanner.value = {
      type: 'error',
      text: 'Ukuran foto melebihi 5 MB. Silakan pilih foto dengan ukuran lebih kecil.',
    }
    clearSelectedFile()
    return
  }

  revokePreview()
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function fetchPortal() {
  if (!slug.value) {
    loadError.value = 'Slug undangan tidak valid.'
    loading.value = false
    return
  }

  loading.value = true
  loadError.value = ''
  try {
    const res = await getSnapPortalInfo(slug.value)
    invitation.value = res?.invitation || null
    photos.value = Array.isArray(res?.photos) ? res.photos : []
  } catch (err) {
    loadError.value = err?.message || 'Undangan tidak ditemukan atau sedang tidak tersedia.'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!selectedFile.value || uploading.value) return

  uploading.value = true
  statusBanner.value = null
  try {
    const uploaded = await uploadGuestPhoto(slug.value, {
      file: selectedFile.value,
      guestName: guestName.value,
      caption: caption.value,
    })

    if (uploaded && uploaded.isApproved !== false) {
      photos.value = [uploaded, ...photos.value]
    }

    clearSelectedFile()
    caption.value = ''
    statusBanner.value = {
      type: 'success',
      text: 'Foto berhasil dikirim ke Memory Wall.',
    }
  } catch (err) {
    statusBanner.value = {
      type: 'error',
      text: err?.message || 'Gagal mengunggah foto. Silakan coba lagi.',
    }
  } finally {
    uploading.value = false
  }
}

onMounted(fetchPortal)
onBeforeUnmount(revokePreview)
</script>
