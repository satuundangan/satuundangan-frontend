<template>
  <AdminShell title="Template Desain" description="Kelola daftar template undangan"
    action-label="Tambah Template"
    @action="openCreate">
    <div class="card">
      <DataTable
        v-model:filters="filters"
        :value="templates"
        paginator
        :rows="10"
        dataKey="id"
        filterDisplay="row"
        :loading="loading"
        class="p-datatable-sm"
      >
        <template #empty> Tidak ada template ditemukan. </template>
        <template #loading> Memuat data template. Silakan tunggu. </template>

        <Column header="Preview" class="w-16">
          <template #body="{ data }">
            <div class="h-10 w-10 rounded border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
              <img :src="data.thumbnailUrl || data.previewUrl" class="h-full w-full object-cover" v-if="data.thumbnailUrl || data.previewUrl" />
              <div class="h-full w-full flex items-center justify-center text-slate-300" v-else>
                <i class="fa-solid fa-image text-xs"></i>
              </div>
            </div>
          </template>
        </Column>

        <Column field="name" header="Nama" sortable style="min-width: 12rem">
          <template #body="{ data }">
            <span class="font-medium text-slate-900">{{ data.name }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Cari nama" />
          </template>
        </Column>

        <Column field="slug" header="Slug" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="text-slate-500 text-xs">{{ data.slug }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Cari slug" />
          </template>
        </Column>

        <Column field="category" header="Kategori" sortable :showFilterMenu="false" style="min-width: 10rem">
          <template #body="{ data }">
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
              <span class="h-1.5 w-1.5 rounded-full"
                :style="{ backgroundColor: getCategoryColor(data.category) }"></span>
              {{ data.category }}
            </span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select v-model="filterModel.value" @change="filterCallback()" :options="categories" optionValue="name" optionLabel="name" placeholder="Semua" :showClear="true" class="w-full">
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: slotProps.option.color }"></span>
                  <span>{{ slotProps.option.name }}</span>
                </div>
              </template>
            </Select>
          </template>
        </Column>

        <Column field="price" header="Harga" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <span class="text-slate-700 font-medium">
              {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.price || 0) }}
            </span>
          </template>
        </Column>

        <Column field="isActive" header="Status" sortable :showFilterMenu="false" style="min-width: 8rem">
          <template #body="{ data }">
            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
              :class="data.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'">
              {{ data.isActive ? 'Aktif' : 'Nonaktif' }}
            </span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select v-model="filterModel.value" @change="filterCallback()" :options="statusOptions" optionValue="value" optionLabel="label" placeholder="Semua" :showClear="true" class="w-full" />
          </template>
        </Column>

        <Column header="Aksi" headerClass="text-right" bodyClass="text-right">
          <template #body="{ data }">
            <div class="flex justify-end gap-1.5">
              <a :href="`/demo/${data.slug}`" target="_blank"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 text-blue-600 hover:bg-blue-50 transition-colors"
                title="Lihat Demo">
                <i class="pi pi-eye text-xs"></i>
              </a>
              <button
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors"
                @click="openEdit(data)"
                title="Edit Template">
                <i class="pi pi-pencil text-xs"></i>
              </button>
              <button
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 transition-colors"
                @click="confirmDelete(data)"
                title="Hapus Template">
                <i class="pi pi-trash text-xs"></i>
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Template' : 'Tambah Template' }}</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Nama</label>
              <input v-model="form.name" type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Slug</label>
              <input v-model="form.slug" type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Kategori</label>
              <select v-model="form.category"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required>
                <option value="" disabled>Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-slate-600">Harga (Rp)</label>
              <input v-model="form.price" type="number" min="0"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required />
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Preview URL (Opsional)</label>
              <input v-model="form.previewUrl" type="url"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                placeholder="https://demo.satuundangan.id/template-a" />
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Thumbnail URL</label>
              <div class="mt-2 flex gap-2">
                <input v-model="form.thumbnailUrl" type="url"
                  class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="https://example.com/image.jpg" />
                <button type="button" @click="triggerThumbnailUpload"
                  class="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Upload</button>
                <input type="file" ref="thumbnailInput" class="hidden" accept="image/*" @change="handleThumbnailUpload" />
              </div>
              <div v-if="form.thumbnailUrl" class="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img :src="form.thumbnailUrl" class="w-full h-full object-cover" />
                <button @click="form.thumbnailUrl = ''" class="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-rose-500 hover:text-rose-700">×</button>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Deskripsi</label>
              <textarea v-model="form.description" rows="3"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
            </div>

            <!-- SEO -->
            <div class="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div class="mb-1 flex items-center gap-2">
                <i class="fa-solid fa-magnifying-glass text-xs text-slate-400"></i>
                <label class="text-sm font-semibold text-slate-700">SEO Halaman Demo</label>
              </div>
              <p class="mb-3 text-xs text-slate-500">
                Judul & deskripsi untuk hasil pencarian Google dan preview saat link
                <span class="font-mono">/demo/{{ form.slug || 'slug' }}</span> dibagikan. Kosongkan untuk pakai Nama & Deskripsi template. Gambar preview memakai Thumbnail.
              </p>
              <div class="space-y-3">
                <div>
                  <label class="text-[10px] uppercase font-bold text-slate-400">SEO Title</label>
                  <input v-model="form.seoTitle" type="text" maxlength="70"
                    placeholder="Undangan Digital Kimi no Na wa — Tema Anime Senja | Satu Undangan"
                    class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  <p class="mt-1 text-[10px] text-slate-400">{{ (form.seoTitle || '').length }}/70 karakter (ideal ≤ 60)</p>
                </div>
                <div>
                  <label class="text-[10px] uppercase font-bold text-slate-400">SEO Description</label>
                  <textarea v-model="form.seoDescription" rows="2" maxlength="320"
                    placeholder="Template undangan pernikahan digital bertema senja sinematik dengan komet jatuh dan langit berbintang. Coba demo gratis di Satu Undangan."
                    class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  <p class="mt-1 text-[10px] text-slate-400">{{ (form.seoDescription || '').length }}/320 karakter (ideal ≤ 160)</p>
                </div>
              </div>
            </div>

            <!-- Tags Input UI -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Tags</label>
              <div
                class="mt-2 flex flex-wrap gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                <span v-for="(tag, index) in form.tags" :key="index"
                  class="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {{ tag }}
                  <button type="button" @click="removeTag(index)" class="text-slate-400 hover:text-rose-500">×</button>
                </span>
                <input v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.,.prevent="addTag" @blur="addTag"
                  type="text" placeholder="Ketik tag dan enter..."
                  class="min-w-[120px] flex-1 bg-transparent text-sm outline-none" />
              </div>
              <p class="mt-1 text-xs text-slate-500">Tekan Enter atau Koma untuk menambahkan tag.</p>
            </div>

            <!-- Default Music -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Default Musik</label>
              <div class="relative mt-2" ref="audioDropdownRef">
                <div class="relative">
                  <input
                    type="text"
                    v-model="audioSearch"
                    @focus="showAudioDropdown = true"
                    placeholder="Cari musik..."
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                  <div v-if="form.defaultMusic && !audioSearch" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400 truncate max-w-[50%]">
                    Terpilih: {{ getSelectedAudioTitle }}
                  </div>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1" v-if="!form.defaultMusic && !audioSearch">
                    <i class="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                  </div>
                </div>

                <div v-if="showAudioDropdown" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                  <div
                    class="cursor-pointer px-3 py-2 text-sm hover:bg-slate-50 border-b border-slate-50"
                    @click="selectAudio(null)"
                  >
                    — Tanpa Musik Default —
                  </div>
                  <div
                    v-for="audio in filteredAudioList"
                    :key="audio.id"
                    class="cursor-pointer px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                    :class="{ 'bg-slate-100': form.defaultMusic === audio.url }"
                    @click="selectAudio(audio)"
                  >
                    <div class="font-medium text-slate-900">{{ audio.title }}</div>
                    <div class="text-[10px] text-slate-500 uppercase font-bold">{{ audio.category }}</div>
                  </div>
                  <div v-if="filteredAudioList.length === 0" class="px-3 py-4 text-center text-sm text-slate-500 italic">
                    Tidak ada musik ditemukan
                  </div>
                </div>
              </div>
              <p v-if="form.defaultMusic" class="mt-1 text-xs text-slate-400 truncate">URL: {{ form.defaultMusic }}</p>
            </div>

            <!-- Audio Trim with Mini Player -->
            <div v-if="form.defaultMusic" class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Trim Audio</label>

              <audio ref="audioRef" :src="form.defaultMusic" preload="metadata"
                @timeupdate="onAudioTimeUpdate" @loadedmetadata="onAudioLoadedMetadata"
                @ended="onAudioEnded" @play="onAudioPlay" @pause="onAudioPause" class="hidden" />

              <div class="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <!-- Player row -->
                <div class="flex items-center gap-3">
                  <button type="button" @click="togglePlay"
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow transition-colors hover:bg-slate-700">
                    <i :class="audioIsPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" class="text-xs"></i>
                  </button>
                  <div class="min-w-0 flex-1">
                    <input type="range" min="0" :max="audioDuration || 100" step="0.1" :value="audioCurrentTime"
                      @input="seekAudio"
                      class="w-full h-1.5 cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900" />
                    <div class="mt-1 flex justify-between font-mono text-[10px] text-slate-400">
                      <span>{{ formatTime(audioCurrentTime) }}</span>
                      <span>{{ formatTime(audioDuration) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Set point buttons -->
                <div class="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" @click="setTrimStart"
                    class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100">
                    <i class="fa-solid fa-circle-dot text-emerald-500"></i>
                    Set Mulai
                    <span class="ml-auto font-mono text-slate-400">{{ formatTime(form.defaultAudioStart) }}</span>
                  </button>
                  <button type="button" @click="setTrimEnd"
                    class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100">
                    <i class="fa-solid fa-stop text-rose-400"></i>
                    Set Akhir
                    <span class="ml-auto font-mono text-slate-400">{{ form.defaultAudioEnd > 0 ? formatTime(form.defaultAudioEnd) : 'Penuh' }}</span>
                  </button>
                </div>

                <!-- Manual inputs -->
                <div class="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-[10px] text-slate-400">Mulai (detik)</label>
                    <input v-model.number="form.defaultAudioStart" type="number" min="0" step="1"
                      class="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-slate-400"
                      placeholder="0" />
                  </div>
                  <div>
                    <label class="text-[10px] text-slate-400">Akhir (detik, 0 = penuh)</label>
                    <input v-model.number="form.defaultAudioEnd" type="number" min="0" step="1"
                      class="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-slate-400"
                      placeholder="0" />
                  </div>
                </div>

                <p v-if="form.defaultAudioStart > 0 || form.defaultAudioEnd > 0" class="mt-2 text-xs text-slate-400">
                  Diputar dari detik {{ form.defaultAudioStart }}
                  <span v-if="form.defaultAudioEnd > 0"> hingga detik {{ form.defaultAudioEnd }}</span>
                  <span v-else> sampai habis</span>
                </p>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Palette Warna</label>
              <div class="mt-2 grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div class="space-y-2">
                  <label class="text-[10px] uppercase font-bold text-slate-400">Primary</label>
                  <div class="flex items-center gap-2">
                    <input type="color" v-model="customPalette.primary" class="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 bg-transparent" />
                    <input type="text" v-model="customPalette.primary" class="w-full text-[10px] font-mono border-b border-slate-200 bg-transparent uppercase" />
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] uppercase font-bold text-slate-400">Secondary</label>
                  <div class="flex items-center gap-2">
                    <input type="color" v-model="customPalette.secondary" class="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 bg-transparent" />
                    <input type="text" v-model="customPalette.secondary" class="w-full text-[10px] font-mono border-b border-slate-200 bg-transparent uppercase" />
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] uppercase font-bold text-slate-400">Accent</label>
                  <div class="flex items-center gap-2">
                    <input type="color" v-model="customPalette.accent" class="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 bg-transparent" />
                    <input type="text" v-model="customPalette.accent" class="w-full text-[10px] font-mono border-b border-slate-200 bg-transparent uppercase" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Options UI -->
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Section Options & Urutan</label>
              <div v-if="availableSections.length" class="mt-2 space-y-2">
                <div v-for="section in availableSections" :key="section.id"
                  class="flex items-center gap-4 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                  <input type="checkbox" :checked="isSectionEnabled(section.id)"
                    @change="toggleSection(section.id)"
                    class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />

                  <span class="text-sm text-slate-700 font-medium min-w-[140px]">{{ section.label }}</span>

                  <div class="flex items-center gap-2 ml-auto">
                    <span class="text-[10px] uppercase text-slate-400 font-bold">Urutan:</span>
                    <input type="number"
                      :value="getSectionOrder(section.id)"
                      @input="updateSectionOrder(section.id, $event.target.value)"
                      class="w-16 rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:border-slate-400"
                      min="1" />
                  </div>
                </div>
              </div>
              <div v-else class="mt-2 text-sm text-slate-400 italic">
                Belum ada section yang tersedia. Tambahkan di menu Master Fitur.
              </div>
            </div>

            <!-- Sample / Demo Content Editor -->
            <div class="md:col-span-2">
              <fieldset class="rounded-xl border border-slate-200 p-4">
                <legend class="px-1 text-sm font-semibold text-slate-700">Konten Sample / Demo</legend>
                <p class="mb-3 text-xs text-slate-500">
                  Opsional. Isi untuk menampilkan konten khusus template ini di halaman
                  <span class="font-mono">/demo/{{ form.slug || '&lt;slug&gt;' }}</span>. Jika dikosongkan,
                  demo akan memakai data contoh bawaan (Adam &amp; Hawa).
                </p>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label class="text-sm font-medium text-slate-600">Nama Pengantin Pria</label>
                    <input v-model="form.sampleContent.groomName" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-slate-600">Nama Pengantin Wanita</label>
                    <input v-model="form.sampleContent.brideName" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-sm font-medium text-slate-600">Nama Panggilan Pasangan</label>
                    <input v-model="form.sampleContent.coupleName" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-600">Foto Pengantin Pria</label>
                    <div class="mt-2 flex gap-2">
                      <input v-model="form.sampleContent.groomPhotoUrl" type="url"
                        class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        placeholder="https://example.com/groom.jpg" />
                      <button type="button" @click="$event.currentTarget.nextElementSibling.click()"
                        class="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Upload</button>
                      <input type="file" class="hidden" accept="image/*"
                        @change="handleSampleUpload($event, (url) => form.sampleContent.groomPhotoUrl = url, 3 / 4)" />
                    </div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-slate-600">Foto Pengantin Wanita</label>
                    <div class="mt-2 flex gap-2">
                      <input v-model="form.sampleContent.bridePhotoUrl" type="url"
                        class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        placeholder="https://example.com/bride.jpg" />
                      <button type="button" @click="$event.currentTarget.nextElementSibling.click()"
                        class="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Upload</button>
                      <input type="file" class="hidden" accept="image/*"
                        @change="handleSampleUpload($event, (url) => form.sampleContent.bridePhotoUrl = url, 3 / 4)" />
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-sm font-medium text-slate-600">Foto Pasangan</label>
                    <div class="mt-2 flex gap-2">
                      <input v-model="form.sampleContent.photoCoupleUrl" type="url"
                        class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        placeholder="https://example.com/couple.jpg" />
                      <button type="button" @click="$event.currentTarget.nextElementSibling.click()"
                        class="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Upload</button>
                      <input type="file" class="hidden" accept="image/*"
                        @change="handleSampleUpload($event, (url) => form.sampleContent.photoCoupleUrl = url, 1)" />
                    </div>
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-600">Sumber Kutipan</label>
                    <input v-model="form.sampleContent.quoteSource" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-slate-600">Tanggal &amp; Waktu Acara</label>
                    <input v-model="form.sampleContent.dateTime" type="text"
                      placeholder="2026-08-15T10:00:00"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-sm font-medium text-slate-600">Kutipan</label>
                    <textarea v-model="form.sampleContent.quoteText" rows="2"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>

                  <div class="rounded-lg border border-slate-200 p-3">
                    <p class="mb-2 text-xs font-bold uppercase text-slate-400">Lokasi Akad</p>
                    <input v-model="form.sampleContent.akadLocation.mapUrl" type="text" placeholder="Map URL"
                      class="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <input v-model="form.sampleContent.akadLocation.description" type="text" placeholder="Deskripsi lokasi"
                      class="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <input v-model="form.sampleContent.akadLocation.dateTime" type="text" placeholder="Tanggal & waktu"
                      class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                  </div>
                  <div class="rounded-lg border border-slate-200 p-3">
                    <p class="mb-2 text-xs font-bold uppercase text-slate-400">Lokasi Resepsi</p>
                    <input v-model="form.sampleContent.resepsiLocation.mapUrl" type="text" placeholder="Map URL"
                      class="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <input v-model="form.sampleContent.resepsiLocation.description" type="text" placeholder="Deskripsi lokasi"
                      class="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <input v-model="form.sampleContent.resepsiLocation.dateTime" type="text" placeholder="Tanggal & waktu"
                      class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-600">Orang Tua Pengantin Wanita</label>
                    <input v-model="form.sampleContent.parents.brideParents" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-slate-600">Orang Tua Pengantin Pria</label>
                    <input v-model="form.sampleContent.parents.groomParents" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-600">Instagram Pengantin Pria</label>
                    <input v-model="form.sampleContent.socialMediaGroom.instagram" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-slate-600">Instagram Pengantin Wanita</label>
                    <input v-model="form.sampleContent.socialMediaBrides.instagram" type="text"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>

                  <div class="md:col-span-2">
                    <label class="text-sm font-medium text-slate-600">Footer Text</label>
                    <textarea v-model="form.sampleContent.footerText" rows="2"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
                  </div>
                </div>

                <!-- Gallery Images -->
                <div class="mt-4">
                  <div class="mb-2 flex items-center justify-between">
                    <label class="text-sm font-medium text-slate-600">Galeri Foto</label>
                    <button type="button" @click="addGalleryImage"
                      class="rounded-lg border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50">+ Tambah Foto</button>
                  </div>
                  <div v-for="(img, index) in form.sampleContent.galleryImages" :key="index"
                    class="mb-2 flex items-center gap-2">
                    <input v-model="form.sampleContent.galleryImages[index]" type="url"
                      class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                      placeholder="https://example.com/gallery.jpg" />
                    <button type="button" @click="$event.currentTarget.nextElementSibling.click()"
                      class="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50">Upload</button>
                    <input type="file" class="hidden" accept="image/*"
                      @change="handleSampleUpload($event, (url) => form.sampleContent.galleryImages[index] = url, 3 / 4)" />
                    <button type="button" @click="removeGalleryImage(index)"
                      class="rounded-lg border border-rose-100 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50">Hapus</button>
                  </div>
                </div>

                <!-- Love Story -->
                <div class="mt-4">
                  <div class="mb-2 flex items-center justify-between">
                    <label class="text-sm font-medium text-slate-600">Cerita Cinta</label>
                    <button type="button" @click="addLoveStory"
                      class="rounded-lg border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50">+ Tambah Cerita</button>
                  </div>
                  <div v-for="(story, index) in form.sampleContent.loveStory" :key="index"
                    class="mb-3 rounded-lg border border-slate-200 p-3">
                    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <input v-model="story.date" type="text" placeholder="Tanggal"
                        class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                      <input v-model="story.title" type="text" placeholder="Judul"
                        class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    </div>
                    <textarea v-model="story.description" rows="2" placeholder="Deskripsi"
                      class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <div class="mt-2 flex items-center gap-2">
                      <input v-model="story.image" type="url" placeholder="URL foto"
                        class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                      <button type="button" @click="$event.currentTarget.nextElementSibling.click()"
                        class="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50">Upload</button>
                      <input type="file" class="hidden" accept="image/*"
                        @change="handleSampleUpload($event, (url) => story.image = url, 3 / 4)" />
                      <button type="button" @click="removeLoveStory(index)"
                        class="rounded-lg border border-rose-100 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50">Hapus</button>
                    </div>
                  </div>
                </div>

                <!-- Bank Accounts -->
                <div class="mt-4">
                  <div class="mb-2 flex items-center justify-between">
                    <label class="text-sm font-medium text-slate-600">Rekening Bank</label>
                    <button type="button" @click="addBankAccount"
                      class="rounded-lg border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50">+ Tambah Rekening</button>
                  </div>
                  <div v-for="(bank, index) in form.sampleContent.bankAccounts" :key="index"
                    class="mb-2 grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-4">
                    <input v-model="bank.bankName" type="text" placeholder="Nama Bank"
                      class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <input v-model="bank.accountNumber" type="text" placeholder="No. Rekening"
                      class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <input v-model="bank.accountName" type="text" placeholder="Atas Nama"
                      class="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <button type="button" @click="removeBankAccount(index)"
                      class="rounded-lg border border-rose-100 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50">Hapus</button>
                  </div>
                </div>
              </fieldset>
            </div>

            <div class="md:col-span-2 flex flex-wrap gap-6">
              <div class="flex items-center gap-2">
                <input id="templateActive" v-model="form.isActive" type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                <label for="templateActive" class="text-sm font-medium text-slate-600">Aktifkan template</label>
              </div>
            </div>

            <div class="md:col-span-2 flex justify-end gap-2 pt-2 text-sm font-medium">
              <button type="button" class="rounded-lg border border-slate-200 px-4 py-2"
                @click="closeForm">Batal</button>
              <button type="submit" :disabled="saving"
                class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60">
                {{ saving ? 'Menyimpan…' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <ImageCropperModal
      :show="cropper.show"
      :imageSrc="cropper.image"
      :stencilAspectRatio="cropper.aspectRatio"
      @close="cropper.show = false"
      @crop="onSampleCropComplete"
    />
  </AdminShell>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { FilterMatchMode } from '@primevue/core/api'
import slugify from 'slugify'
import {
  fetchAdminTemplates,
  createAdminTemplate,
  updateAdminTemplate,
  deleteAdminTemplate,
  fetchAdminCategories,
} from '@/api/admin.js'
import { fetchAdminSections, fetchAdminAudio } from '@/api/master.js'
import { uploadFileApi } from '@/api/file.js'
import ImageCropperModal from '@/views/create-form/components/ImageCropperModal.vue'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const thumbnailInput = ref(null)
const cropper = ref({ show: false, image: '', aspectRatio: 3 / 4, setUrl: null })
const audioRef = ref(null)
const audioCurrentTime = ref(0)
const audioDuration = ref(0)
const audioIsPlaying = ref(false)
const templates = ref([])
const categories = ref([])
const availableSections = ref([]) // Dynamic sections from DB
const audioList = ref([])
const audioSearch = ref('')
const showAudioDropdown = ref(false)
const audioDropdownRef = ref(null)

const filteredAudioList = computed(() => {
  if (!audioSearch.value) return audioList.value
  const q = audioSearch.value.toLowerCase()
  return audioList.value.filter(audio =>
    (audio.title && audio.title.toLowerCase().includes(q)) ||
    (audio.category && audio.category.toLowerCase().includes(q))
  )
})

const getSelectedAudioTitle = computed(() => {
  if (!form.defaultMusic) return ''
  const audio = audioList.value.find(a => a.url === form.defaultMusic)
  return audio ? `${audio.title} (${audio.category})` : ''
})

function selectAudio(audio) {
  form.defaultMusic = audio ? audio.url : null
  showAudioDropdown.value = false
  audioSearch.value = ''
}

onClickOutside(audioDropdownRef, () => {
  showAudioDropdown.value = false
})

const total = ref(0)
const sortBy = ref('id')
const sortOrder = ref('DESC')
const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  slug: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS },
  isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
})
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const statusOptions = ref([
  { label: 'Aktif', value: true },
  { label: 'Nonaktif', value: false }
])

const tagInput = ref('')
const customPalette = reactive({
  primary: '#0F172A',
  secondary: '#64748B',
  accent: '#38BDF8'
})

function emptySampleContent() {
  return {
    groomName: '',
    brideName: '',
    coupleName: '',
    groomPhotoUrl: '',
    bridePhotoUrl: '',
    photoCoupleUrl: '',
    quoteText: '',
    quoteSource: '',
    dateTime: '',
    akadLocation: { mapUrl: '', description: '', dateTime: '' },
    resepsiLocation: { mapUrl: '', description: '', dateTime: '' },
    parents: { brideParents: '', groomParents: '' },
    galleryImages: [],
    loveStory: [],
    bankAccounts: [],
    socialMediaGroom: { instagram: '' },
    socialMediaBrides: { instagram: '' },
    footerText: '',
  }
}

const form = reactive({
  name: '',
  slug: '',
  category: '',
  price: 0,
  previewUrl: '',
  thumbnailUrl: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  tags: [],
  sections: [],
  isActive: true,
  defaultMusic: null,
  defaultAudioStart: 0,
  defaultAudioEnd: 0,
  sampleContent: emptySampleContent(),
})

watch(() => form.name, (newVal) => {
  if (!editing.value && newVal) {
    form.slug = slugify(newVal, { lower: true, strict: true })
    form.previewUrl = `/demo/${form.slug}`
  }
})

watch(() => form.slug, (newVal) => {
  if (!editing.value && newVal) {
    form.previewUrl = `/demo/${newVal}`
  }
})

async function loadData() {
  loading.value = true
  try {
    const [tmplRes, catRes, sectRes, audioRes] = await Promise.all([
      fetchAdminTemplates({
        limit: 1000 // Fetch all for client-side handling
      }),
      fetchAdminCategories({ limit: 100 }),
      fetchAdminSections({ limit: 100 }),
      fetchAdminAudio({ limit: 100 }),
    ])

    templates.value = tmplRes.data || tmplRes
    total.value = tmplRes.total || (tmplRes.data ? tmplRes.data.length : tmplRes.length)

    categories.value = catRes.data || catRes
    availableSections.value = sectRes.data || sectRes
    audioList.value = audioRes.data || audioRes
  } catch {
    toast.error('Gagal memuat data')
  } finally {
    loading.value = false
  }
}

function getCategoryColor(categoryName) {
  const cat = categories.value.find(c => c.name === categoryName)
  return cat ? cat.color : '#cbd5e1'
}

function isSectionEnabled(sectionId) {
  return form.sections.some(s => s.sectionId === sectionId && s.is_enabled)
}

function getSectionOrder(sectionId) {
  const s = form.sections.find(s => s.sectionId === sectionId)
  return s ? s.order : 1
}

function updateSectionOrder(sectionId, val) {
  const index = form.sections.findIndex(s => s.sectionId === sectionId)
  if (index > -1) {
    form.sections[index].order = Number(val)
  } else {
    form.sections.push({
      sectionId,
      order: Number(val),
      is_enabled: false
    })
  }
}

function toggleSection(sectionId) {
  const index = form.sections.findIndex(s => s.sectionId === sectionId)
  if (index > -1) {
    form.sections[index].is_enabled = !form.sections[index].is_enabled
  } else {
    // If not found, add it as enabled
    form.sections.push({
      sectionId,
      order: form.sections.length + 1,
      is_enabled: true
    })
  }
}

function triggerThumbnailUpload() {
  thumbnailInput.value?.click()
}

async function handleThumbnailUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  try {
    const res = await uploadFileApi(file)
    form.thumbnailUrl = res.fileUrl
    toast.success('Thumbnail berhasil diupload')
  } catch {
    toast.error('Gagal mengupload thumbnail')
  } finally {
    event.target.value = ''
  }
}

function downscaleImage(dataUrl, maxWidth = 1600) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

// Open the shared cropper before uploading. setUrl receives the final CDN URL.
function handleSampleUpload(event, setUrl, aspectRatio = 3 / 4) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    const image = await downscaleImage(reader.result)
    cropper.value = { show: true, image, aspectRatio, setUrl }
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

async function onSampleCropComplete({ blob }) {
  const setUrl = cropper.value.setUrl
  cropper.value.show = false
  if (!setUrl || !blob) return
  try {
    const cropped = new File([blob], 'sample.webp', { type: 'image/webp' })
    const res = await uploadFileApi(cropped)
    setUrl(res.fileUrl)
    toast.success('Foto berhasil diupload')
  } catch {
    toast.error('Gagal mengupload foto')
  }
}

function addGalleryImage() {
  form.sampleContent.galleryImages.push('')
}

function removeGalleryImage(index) {
  form.sampleContent.galleryImages.splice(index, 1)
}

function addLoveStory() {
  form.sampleContent.loveStory.push({ date: '', title: '', description: '', image: '' })
}

function removeLoveStory(index) {
  form.sampleContent.loveStory.splice(index, 1)
}

function addBankAccount() {
  form.sampleContent.bankAccounts.push({ bankName: '', accountNumber: '', accountName: '' })
}

function removeBankAccount(index) {
  form.sampleContent.bankAccounts.splice(index, 1)
}

function addTag() {
  const val = tagInput.value.trim()
  if (val && !form.tags.includes(val)) {
    form.tags.push(val)
  }
  tagInput.value = ''
}

function removeTag(index) {
  form.tags.splice(index, 1)
}

function openCreate() {
  editing.value = null
  tagInput.value = ''
  audioSearch.value = ''
  showAudioDropdown.value = false
  Object.assign(customPalette, { primary: '#0F172A', secondary: '#64748B', accent: '#38BDF8' })
  Object.assign(form, {
    name: '',
    slug: '',
    category: '',
    price: 0,
    previewUrl: '',
    thumbnailUrl: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    tags: [],
    sections: availableSections.value.map((s, index) => ({
      sectionId: s.id,
      order: index + 1,
      is_enabled: true
    })),
    isActive: true,
    defaultMusic: null,
    defaultAudioStart: 0,
    defaultAudioEnd: 0,
    sampleContent: emptySampleContent(),
  })
  showForm.value = true
}

function openEdit(template) {
  editing.value = template
  tagInput.value = ''
  audioSearch.value = ''
  showAudioDropdown.value = false

  if (template.paletteColors && template.paletteColors.length >= 3) {
    customPalette.primary = template.paletteColors[0]
    customPalette.secondary = template.paletteColors[1]
    customPalette.accent = template.paletteColors[2]
  } else {
    Object.assign(customPalette, { primary: '#0F172A', secondary: '#64748B', accent: '#38BDF8' })
  }

  let tags = []
  if (Array.isArray(template.tags)) {
    tags = [...template.tags]
  } else if (typeof template.tags === 'string') {
    tags = template.tags.split(',').map(t => t.trim()).filter(Boolean)
  }

  // Map existing sections or initialize with available ones
  const templateSections = Array.isArray(template.sections) ? template.sections : []
  const sections = availableSections.value.map((s, index) => {
    const existing = templateSections.find(ts => ts.sectionId === s.id || ts.id === s.id)
    return {
      sectionId: s.id,
      order: existing ? existing.order : index + 1,
      is_enabled: existing ? existing.is_enabled : false
    }
  })

  const savedSampleContent =
    template.sampleContent && typeof template.sampleContent === 'object'
      ? template.sampleContent
      : {}
  const sampleContent = {
    ...emptySampleContent(),
    ...savedSampleContent,
    akadLocation: {
      ...emptySampleContent().akadLocation,
      ...(savedSampleContent.akadLocation || {}),
    },
    resepsiLocation: {
      ...emptySampleContent().resepsiLocation,
      ...(savedSampleContent.resepsiLocation || {}),
    },
    parents: {
      ...emptySampleContent().parents,
      ...(savedSampleContent.parents || {}),
    },
    socialMediaGroom: {
      ...emptySampleContent().socialMediaGroom,
      ...(savedSampleContent.socialMediaGroom || {}),
    },
    socialMediaBrides: {
      ...emptySampleContent().socialMediaBrides,
      ...(savedSampleContent.socialMediaBrides || {}),
    },
    galleryImages: Array.isArray(savedSampleContent.galleryImages)
      ? [...savedSampleContent.galleryImages]
      : [],
    loveStory: Array.isArray(savedSampleContent.loveStory)
      ? savedSampleContent.loveStory.map(item => ({ ...item }))
      : [],
    bankAccounts: Array.isArray(savedSampleContent.bankAccounts)
      ? savedSampleContent.bankAccounts.map(item => ({ ...item }))
      : [],
  }

  Object.assign(form, {
    name: template.name || '',
    slug: template.slug || '',
    category: template.category || '',
    price: template.price || 0,
    previewUrl: template.previewUrl || '',
    thumbnailUrl: template.thumbnailUrl || '',
    description: template.description || '',
    seoTitle: template.seoTitle || '',
    seoDescription: template.seoDescription || '',
    tags: tags,
    sections: sections,
    isActive: Boolean(template.isActive),
    defaultMusic: template.defaultMusic || null,
    defaultAudioStart: template.defaultAudioStart ?? 0,
    defaultAudioEnd: template.defaultAudioEnd ?? 0,
    sampleContent,
  })
  showForm.value = true
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function togglePlay() {
  if (!audioRef.value) return
  audioIsPlaying.value ? audioRef.value.pause() : audioRef.value.play()
}

function seekAudio(event) {
  if (!audioRef.value) return
  audioRef.value.currentTime = Number(event.target.value)
}

function setTrimStart() {
  form.defaultAudioStart = Math.floor(audioCurrentTime.value)
}

function setTrimEnd() {
  form.defaultAudioEnd = Math.floor(audioCurrentTime.value)
}

function onAudioTimeUpdate() { audioCurrentTime.value = audioRef.value?.currentTime || 0 }
function onAudioLoadedMetadata() { audioDuration.value = audioRef.value?.duration || 0 }
function onAudioEnded() { audioIsPlaying.value = false }
function onAudioPlay() { audioIsPlaying.value = true }
function onAudioPause() { audioIsPlaying.value = false }

watch(() => form.defaultMusic, () => {
  if (audioRef.value) { audioRef.value.pause(); audioRef.value.load() }
  audioCurrentTime.value = 0
  audioDuration.value = 0
  audioIsPlaying.value = false
})

watch(showForm, (val) => {
  if (!val && audioRef.value) { audioRef.value.pause(); audioIsPlaying.value = false }
})

function closeForm() {
  showForm.value = false
  saving.value = false
}

// Recursively strip empty values so a blank sample field never overrides
// the built-in demoData default. Returns undefined when nothing remains.
function pruneEmpty(value) {
  if (Array.isArray(value)) {
    const items = value.map(pruneEmpty).filter((v) => v !== undefined)
    return items.length ? items : undefined
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      const pruned = pruneEmpty(v)
      if (pruned !== undefined) out[k] = pruned
    }
    return Object.keys(out).length ? out : undefined
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? trimmed : undefined
  }
  return value === undefined || value === null ? undefined : value
}

function buildPayload() {
  const prunedSample = pruneEmpty(form.sampleContent)
  const payload = {
    name: form.name,
    slug: form.slug,
    category: form.category,
    price: Number(form.price),
    previewUrl: form.previewUrl,
    thumbnailUrl: form.thumbnailUrl || null,
    description: form.description || null,
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
    isActive: form.isActive,
    defaultMusic: form.defaultMusic || null,
    defaultAudioStart: Number(form.defaultAudioStart) || 0,
    defaultAudioEnd: Number(form.defaultAudioEnd) || 0,
    sections: form.sections.map(s => ({
      sectionId: s.sectionId,
      order: s.order,
      is_enabled: s.is_enabled
    })),
    tags: form.tags,
    sampleContent: prunedSample ?? null
  }

  payload.paletteId = null
  payload.paletteColors = [customPalette.primary, customPalette.secondary, customPalette.accent]

  return payload
}

async function submitForm() {
  if (saving.value) return
  try {
    const payload = buildPayload()
    saving.value = true
    if (editing.value) {
      await updateAdminTemplate(editing.value.id, payload)
      toast.success('Template diperbarui')
    } else {
      await createAdminTemplate(payload)
      toast.success('Template dibuat')
    }
    showForm.value = false
    loadData()
  } catch {
    toast.error('Gagal menyimpan template')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(template) {
  const result = await Swal.fire({
    title: 'Hapus template?',
    text: `Template ${template.name} akan dihapus`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminTemplate(template.id)
    toast.success('Template dihapus')
    loadData()
  } catch {
    toast.error('Gagal menghapus template')
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showForm.value) closeForm()
}

onMounted(() => {
  loadData()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
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
