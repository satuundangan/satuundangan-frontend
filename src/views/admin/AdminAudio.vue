<template>
  <AdminShell
    title="Audio & Musik"
description="Kelola musik latar. Pemakaian dicocokkan dari URL; duplikasi file baru diperiksa dari SHA-256. Sumber dan izin mengikuti catatan admin."
    show-search
    :search="search"
    search-placeholder="Cari judul atau kategori musik"
    action-label="Tambah Satuan"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <!-- View Switcher -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex bg-slate-100 p-1 rounded-xl">
        <button 
          @click="viewType = 'grid'"
          class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          :class="viewType === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
        >
          Cards
        </button>
        <button 
          @click="viewType = 'table'"
          class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          :class="viewType === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
        >
          Table
        </button>
      </div>
    </div>

    <!-- Bulk Upload Section -->
    <section v-if="viewType === 'grid'" class="mb-8 overflow-hidden rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-2 transition-all hover:border-indigo-300">
      <div 
        class="group relative flex flex-col items-center justify-center rounded-[2rem] bg-slate-50/50 py-12 px-6 transition-all hover:bg-indigo-50/30"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleBulkDrop"
      >
        <input
          type="file"
          multiple
          aria-label="Pilih beberapa file musik MP3 untuk diunggah"
          accept="audio/mpeg, audio/mp3"
          class="absolute inset-0 z-10 cursor-pointer opacity-0"
          @change="handleBulkFileChange"
        />

        <div v-if="bulkQueue.length === 0" class="text-center pointer-events-none">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-indigo-500 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md">
            <i class="fa-solid fa-cloud-arrow-up text-3xl"></i>
          </div>
          <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight">Bulk Upload Musik</h2>
          <p class="mt-2 text-sm text-slate-500">Drag & drop banyak file MP3 sekaligus ke sini. <br/> Judul otomatis diambil dari nama file.</p>
        </div>

        <div v-else class="relative z-20 w-full max-w-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
             <div>
                <h3 class="text-lg font-black text-slate-900">{{ bulkQueue.length }} File Siap Diupload</h3>
                <p class="text-xs text-slate-500 uppercase tracking-widest font-bold">Pilih Kategori untuk Batch Ini</p>
             </div>
             <div class="flex items-center gap-3">
                <select v-model="bulkCategory" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                   <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <button 
                  @click.stop="processBulkUpload" 
                  :disabled="isBulking"
                  class="rounded-xl bg-slate-900 px-6 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
                >
                  {{ isBulking ? 'Uploading...' : 'Mulai Upload Semua' }}
                </button>
                <button @click.stop="bulkQueue = []" class="text-slate-500 hover:text-rose-500 transition-colors">
                   <i class="fa-solid fa-times"></i>
                </button>
             </div>
          </div>

          <div class="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
             <div v-for="(item, idx) in bulkQueue" :key="idx" class="mb-2 flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-slate-50">
                <div class="flex items-center gap-3 min-w-0">
                   <div class="h-8 w-8 flex items-center justify-center rounded-lg" :class="item.status === 'done' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-500'">
                      <i v-if="item.status === 'done'" class="fa-solid fa-check text-xs"></i>
                      <i v-else-if="item.status === 'uploading'" class="fa-solid fa-spinner animate-spin text-xs"></i>
                      <i v-else class="fa-solid fa-file-audio text-xs"></i>
                   </div>
                   <span class="truncate text-xs font-bold text-slate-700">{{ item.file.name }}</span>
                </div>
                <span v-if="item.status === 'done'" class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Selesai</span>
                <span v-else-if="item.status === 'error'" class="text-[10px] font-black text-rose-500 uppercase tracking-widest">Gagal</span>
                <span v-else class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{{ (item.file.size / 1024 / 1024).toFixed(1) }} MB</span>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main List (Grid) -->
    <AdminTableStatus
      :error="loadError"
      :loading="loading"
      :count="filteredAudios.length"
      :filtered="Boolean(search)"
      :updated-at="lastLoadedAt"
      @retry="loadAudio"
      @reset="handleSearch('')"
    />

    <section
      v-if="audios.length"
      class="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pemeriksaan kesehatan audio"
    >
      <div>
        <h2 class="text-sm font-bold text-slate-900">Kesehatan player</h2>
        <p class="mt-1 text-xs text-slate-500">
          Periksa semua audio yang termuat, termasuk yang tidak terlihat karena pencarian. Pemeriksaan
          tidak memutar suara.
        </p>
        <p v-if="playbackAuditStarted" class="mt-2 text-xs font-medium text-slate-700" aria-live="polite">
          {{ playbackAuditProgress }} dari {{ audios.length }} selesai · {{ playbackAuditCounts.playable }}
          siap diputar · {{ playbackAuditCounts.failed }} gagal · {{ playbackAuditCounts.timeout }} waktu habis
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
        :disabled="loading || isPlaybackAuditRunning || !audios.length"
        @click="checkAllAudioPlayback"
      >
        {{ isPlaybackAuditRunning ? 'Memeriksa audio…' : playbackAuditStarted ? 'Ulangi cek audio' : 'Periksa semua audio' }}
      </button>
    </section>

    <div v-if="viewType === 'grid'" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-12 w-12 rounded-2xl bg-slate-100"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-3/4 rounded bg-slate-100"></div>
              <div class="h-3 w-1/4 rounded bg-slate-50"></div>
            </div>
          </div>
          <div class="h-10 w-full rounded-xl bg-slate-50"></div>
        </div>
      </template>

      <!-- Audio Cards -->
      <template v-else>
        <div
          v-for="track in filteredAudios"
          :key="track.id"
          class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
        >
          <div class="flex items-start justify-between gap-4 mb-6">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span
                  class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  :class="getCategoryMeta(track.category).badgeClass"
                >
                  {{ getCategoryMeta(track.category).label }}
                </span>
              </div>
              <h3 class="truncate text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors" :title="track.title">
                {{ track.title }}
              </h3>
              <p class="mt-1 line-clamp-1 text-xs text-slate-500 font-medium">
                {{ getCategoryMeta(track.category).description }}
              </p>
              <p class="mt-2 text-[11px] text-slate-600">
                Dipakai: {{ track.templateUseCount ?? 0 }} template · {{ track.invitationUseCount ?? 0 }} undangan
              </p>
              <p v-if="track.sameUrlTrackCount > 1" class="text-[10px] font-semibold text-amber-700">
                URL identik dipakai {{ track.sameUrlTrackCount }} entri audio
              </p>
              <p v-if="track.sameContentTrackCount > 1" class="text-[10px] font-semibold text-amber-700">
                Isi file identik (SHA-256) ditemukan pada {{ track.sameContentTrackCount }} entri
              </p>
              <p v-else-if="track.contentHashStatus !== 'checked'" class="text-[10px] text-slate-500">
                Duplikasi isi file belum diperiksa untuk entri lama
              </p>
              <p class="text-[10px] text-slate-500">Player: {{ playbackStatusLabel(track) }}</p>
              <p class="mt-2 text-[10px] text-slate-500">
                Sumber: {{ track.source || 'belum tercatat' }} · Kredit: {{ track.credit || 'belum tercatat' }}
              </p>
              <p class="text-[10px] text-slate-500">
                {{ track.format || 'format belum tercatat' }} · {{ formatBytes(track.fileSizeBytes) }} · durasi {{ formatDuration(track.durationSeconds) }} · izin {{ licenseStatusLabel(track.licenseStatus) }}
              </p>
            </div>
            
            <div class="flex flex-col gap-2">
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                title="Edit sumber dan status izin"
                :aria-label="`Edit metadata ${track.title}`"
                @click="openEdit(track)"
              >
                <i class="pi pi-pencil text-xs"></i>
              </button>
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-500"
                title="Hapus"
                @click="confirmDelete(track)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>

          <!-- Custom Audio Player Feel -->
          <div class="relative mt-auto">
            <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100 transition-all group-hover:bg-white group-hover:ring-slate-200">
              <div class="flex-1 overflow-hidden">
                <audio 
                  controls 
                  class="h-8 w-full opacity-80"
                  @play="handlePlay($event, track)"
                  @canplay="markAudioPlayable(track)"
                  @error="markAudioFailed(track)"
                >
                  <source :src="track.url" type="audio/mpeg">
                </audio>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
             <span class="text-[10px] font-mono text-slate-300 truncate pr-4">{{ track.url }}</span>
             <button @click="copyLink(track.url)" class="shrink-0 text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700">Copy Link</button>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-if="!loading && !loadError && !filteredAudios.length" class="col-span-full py-20 flex flex-col items-center justify-center text-center">
        <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900">Belum ada musik</h3>
        <p class="mt-2 max-w-xs text-sm text-slate-500">
          {{ audios.length ? "Tidak ada musik yang cocok dengan pencarian." : "Gunakan area Bulk Upload di atas untuk menambahkan musik." }}
        </p>
      </div>
    </div>

    <!-- Main List (Table) -->
    <div class="card" v-else-if="!loadError">
      <DataTable 
        v-model:filters="filters" 
        :value="audios" 
        paginator 
        :rows="10" 
        dataKey="id" 
        filterDisplay="row" 
        :loading="loading"
        :globalFilterFields="['title', 'category', 'url']"
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex justify-end">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Cari musik..." />
            </IconField>
          </div>
        </template>
        <template #empty> Tidak ada musik ditemukan. </template>
        <template #loading> Memuat data musik. Silakan tunggu. </template>
        
        <Column field="title" header="Judul" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="font-bold text-slate-900">{{ data.title }}</span>
              <span class="text-[10px] font-mono text-slate-500 truncate max-w-xs">{{ data.url }}</span>
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Cari judul" />
          </template>
        </Column>

        <Column field="category" header="Kategori" :showFilterMenu="false" style="min-width: 12rem">
          <template #body="{ data }">
            <Tag :value="getCategoryMeta(data.category).label" :severity="getSeverity(data.category)" />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select v-model="filterModel.value" @change="filterCallback()" :options="categoryOptions" optionValue="value" optionLabel="label" placeholder="Semua Kategori" :showClear="true" class="w-full">
              <template #option="slotProps">
                <Tag :value="slotProps.option.label" :severity="getSeverity(slotProps.option.value)" />
              </template>
            </Select>
          </template>
        </Column>

        <Column header="Metadata" style="min-width: 14rem">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 text-xs">
              <span>Sumber: {{ data.source || 'belum tercatat' }}</span>
              <span>Kredit: {{ data.credit || 'belum tercatat' }}</span>
              <span class="text-slate-500">Izin: {{ licenseStatusLabel(data.licenseStatus) }}</span>
              <span v-if="data.sameUrlTrackCount > 1" class="font-semibold text-amber-700">URL identik: {{ data.sameUrlTrackCount }} entri</span>
              <span v-if="data.sameContentTrackCount > 1" class="font-semibold text-amber-700">Isi file identik (SHA-256): {{ data.sameContentTrackCount }} entri</span>
              <span v-else-if="data.contentHashStatus !== 'checked'" class="text-slate-500">Hash isi belum tersedia untuk entri lama</span>
              <span class="text-slate-500">Player: {{ playbackStatusLabel(data) }}</span>
            </div>
          </template>
        </Column>
        <Column header="File" style="min-width: 11rem">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 text-xs text-slate-600">
              <span>{{ data.format || 'format belum tercatat' }}</span>
              <span>{{ formatBytes(data.fileSizeBytes) }}</span>
              <span>Durasi {{ formatDuration(data.durationSeconds) }}</span>
            </div>
          </template>
        </Column>
        <Column header="Player" class="w-48">
          <template #body="{ data }">
            <audio 
              controls 
              class="h-8 w-full opacity-80 scale-90 origin-left"
              @play="handlePlay($event, data)"
              @canplay="markAudioPlayable(data)"
              @error="markAudioFailed(data)"
            >
              <source :src="data.url" type="audio/mpeg">
            </audio>
          </template>
        </Column>

        <Column header="Aksi" headerClass="text-right" bodyClass="text-right">
          <template #body="{ data }">
            <div class="flex justify-end gap-3">
              <button @click="copyLink(data.url)" class="text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700 cursor-pointer">Link</button>
              <button @click="openEdit(data)" class="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 cursor-pointer">Metadata</button>
              <button @click="confirmDelete(data)" class="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:text-rose-700 cursor-pointer">Hapus</button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create Modal -->
    <Transition name="modal">
      <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeForm"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all">
          <div class="bg-indigo-600 p-8 text-white">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-2xl font-black">{{ editingAudio ? 'Metadata Musik' : 'Tambah Musik' }}</h2>
              <button class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95" @click="closeForm">
                 <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <p class="text-indigo-100 text-sm opacity-80">Sumber dan status izin mengikuti informasi yang dicatat admin; nilai yang tidak diketahui tetap ditandai unknown.</p>
          </div>

          <form class="p-8 space-y-6" @submit.prevent="submitForm">
            <div>
              <label class="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Judul Musik</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Contoh: A Thousand Years - Piano"
                class="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                :disabled="Boolean(editingAudio)"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Kategori</label>
                  <select
                    v-model="form.category"
                    :disabled="Boolean(editingAudio)"
                    class="w-full appearance-none rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-100 focus:bg-white"
                  >
                    <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
               </div>
               <div>
                  <label class="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Format</label>
                  <div class="w-full rounded-2xl bg-slate-50 px-5 py-4 text-sm font-bold text-slate-500">
                     MP3 Audio
                  </div>
               </div>
            </div>

            <div v-if="editingAudio" class="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
              <label class="block text-[11px] font-black uppercase tracking-widest text-slate-600">Ganti file MP3 (opsional)</label>
              <input
                type="file"
                accept="audio/mpeg, audio/mp3"
                aria-label="Pilih file MP3 pengganti"
                class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:font-semibold"
                @change="handleReplacementFileChange"
              />
              <p v-if="replacementAudioFile" class="text-xs text-slate-700">
                {{ replacementAudioFile.name }} · {{ formatBytes(replacementAudioFile.size) }} · durasi {{ formatDuration(replacementDurationSeconds) }}
              </p>
              <p v-if="replacementAudioFile" class="text-xs text-indigo-900">
                {{ editingAudio.templateUseCount ?? 0 }} template dan {{ editingAudio.invitationUseCount ?? 0 }} undangan yang memakai URL persis akan diarahkan ke file baru. File lama tetap disimpan untuk kemungkinan referensi historis yang tidak terpetakan.
              </p>
            </div>

            <div class="space-y-4 rounded-2xl bg-slate-50 p-4">
              <div>
                <label class="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Sumber</label>
                <input
                  v-model="form.source"
                  type="text"
                  maxlength="255"
                  placeholder="URL, pemilik, atau catatan sumber"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label class="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Kredit</label>
                <textarea
                  v-model="form.credit"
                  rows="2"
                  maxlength="2000"
                  placeholder="Nama pencipta/pemegang hak atau detail kredit yang diketahui"
                  class="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300"
                ></textarea>
              </div>
              <div>
                <label class="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Status izin</label>
                <select v-model="form.licenseStatus" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300">
                  <option value="unknown">Belum diketahui</option>
                  <option value="pending">Perlu ditinjau</option>
                  <option value="recorded">Izin tercatat oleh admin</option>
                  <option value="restricted">Tidak boleh digunakan</option>
                </select>
                <p class="mt-2 text-[11px] text-slate-500">Status ini adalah catatan admin, bukan pemeriksaan otomatis atas hak cipta.</p>
              </div>
            </div>

            <p v-if="editingAudio && !replacementAudioFile" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
              File tetap sama. Format, ukuran, dan durasi tidak diubah dari formulir ini.
            </p>
            <p v-else-if="replacementAudioFile" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
              File baru: {{ replacementAudioFile.type || 'Format tidak terbaca' }} · {{ formatBytes(replacementAudioFile.size) }} · durasi {{ formatDuration(replacementDurationSeconds) }}
            </p>
            <p v-else-if="selectedAudioFile" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
              {{ selectedAudioFile.type || 'Format tidak terbaca' }} · {{ formatBytes(selectedAudioFile.size) }} · durasi {{ formatDuration(form.durationSeconds) }}
            </p>

            <!-- Upload Zone -->
            <div v-if="!editingAudio">
              <label class="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">File Audio</label>
              <div 
                class="group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
                :class="{ 'border-indigo-400 bg-indigo-50': uploadingFile }"
              >
                <input
                  type="file"
                  aria-label="Pilih file musik MP3"
                  accept="audio/mpeg, audio/mp3"
                  class="absolute inset-0 z-10 cursor-pointer opacity-0"
                  @change="handleFileChange"
                />
                
                <div v-if="uploadingFile" class="text-center">
                   <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                      <svg class="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   </div>
                   <p class="text-sm font-black text-indigo-600 uppercase tracking-widest">Uploading...</p>
                   <p class="mt-1 text-xs text-slate-500">Sedang mengirim file ke R2 Storage</p>
                </div>
                
                <div v-else-if="form.url" class="text-center">
                   <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                      <i class="fa-solid fa-check text-2xl"></i>
                   </div>
                   <p class="text-sm font-black text-emerald-700 uppercase tracking-widest">File Ready</p>
                   <p class="mt-1 text-[10px] text-slate-500 truncate max-w-[200px]">{{ form.fileName }}</p>
                </div>

                <div v-else class="text-center">
                   <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm transition-all group-hover:scale-110 group-hover:text-indigo-400 group-hover:shadow-md">
                      <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                   </div>
                   <p class="text-sm font-black text-slate-900 uppercase tracking-widest">Pilih File MP3</p>
                   <p class="mt-1 text-xs text-slate-500">Klik atau drag audio ke sini</p>
                </div>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="button" 
                class="flex-1 rounded-2xl border-2 border-slate-100 py-4 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 active:scale-95" 
                @click="closeForm"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving || uploadingFile || (!editingAudio && !selectedAudioFile)"
                class="flex-[2] rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saving ? 'Menyimpan…' : editingAudio ? replacementAudioFile ? 'Ganti File & Simpan Metadata' : 'Simpan Metadata' : 'Simpan Musik' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import AdminTableStatus from '@/components/admin/AdminTableStatus.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { FilterMatchMode } from '@primevue/core/api'
import { fetchAdminAudio, deleteAdminAudio, uploadAdminAudio, updateAdminAudioMetadata, replaceAdminAudioFile } from '@/api/master.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const CATEGORY_OPTIONS = [
  {
    value: 'romantic',
    label: 'Romantic Aisle',
    description: 'Lembut dan emosional untuk opening, aisle, dan first look.',
    badgeClass: 'border-rose-100 bg-rose-50 text-rose-600',
  },
  {
    value: 'acoustic',
    label: 'Acoustic Morning',
    description: 'Hangat dan ringan untuk intimate wedding atau garden party.',
    badgeClass: 'border-amber-100 bg-amber-50 text-amber-700',
  },
  {
    value: 'elegant',
    label: 'Elegant First Dance',
    description: 'Lebih megah untuk ballroom, dinner, dan first dance.',
    badgeClass: 'border-indigo-100 bg-indigo-50 text-indigo-600',
  },
  {
    value: 'sacred',
    label: 'Sacred Ceremony',
    description: 'Tenang dan khidmat untuk akad, blessing, atau pemberkatan.',
    badgeClass: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  },
  {
    value: 'warm',
    label: 'Warm Reception',
    description: 'Sedikit lebih penuh untuk resepsi santai dan momen kumpul keluarga.',
    badgeClass: 'border-orange-100 bg-orange-50 text-orange-600',
  },
  {
    value: 'instrumental',
    label: 'Instrumental Garden',
    description: 'Netral dan ringan untuk outdoor wedding serta slideshow galeri.',
    badgeClass: 'border-sky-100 bg-sky-50 text-sky-600',
  },
]

const toast = useToast()
const audios = ref([])
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const uploadingFile = ref(false)
const currentPlayingAudio = ref(null)
const audioPlaybackStates = ref({})
const playbackAuditStates = ref({})
const playbackAuditStarted = ref(false)
const isPlaybackAuditRunning = ref(false)
const selectedAudioFile = ref(null)
const editingAudio = ref(null)
const replacementAudioFile = ref(null)
const replacementDurationSeconds = ref(null)
const viewType = ref('grid') // 'grid' or 'table'

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const getSeverity = (category) => {
  switch (category) {
    case 'romantic': return 'danger';
    case 'acoustic': return 'warn';
    case 'elegant': return 'info';
    case 'sacred': return 'success';
    case 'warm': return 'secondary';
    default: return null;
  }
}

// Bulk Upload States
const isDragging = ref(false)
const isBulking = ref(false)
const bulkCategory = ref('romantic')
const bulkQueue = ref([])

const playbackAuditGeneration = ref(0)
const playbackAuditCleanupHandlers = new Set()
const playbackAuditProgress = computed(() =>
  Object.values(playbackAuditStates.value).filter((state) => state !== 'checking').length,
)
const playbackAuditCounts = computed(() => ({
  playable: Object.values(playbackAuditStates.value).filter((state) => state === 'playable').length,
  failed: Object.values(playbackAuditStates.value).filter((state) => state === 'failed').length,
  timeout: Object.values(playbackAuditStates.value).filter((state) => state === 'timeout').length,
}))

const form = reactive({ title: '', category: 'romantic', url: '', fileName: '', source: '', credit: '', licenseStatus: 'unknown', durationSeconds: null })
const categoryOptions = CATEGORY_OPTIONS

const filteredAudios = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return audios.value
  return audios.value.filter((track) => {
    const categoryLabel = getCategoryMeta(track.category).label.toLowerCase()
    return [track.title, track.category, categoryLabel, track.url]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword))
  })
})

function getCategoryMeta(category) {
  return CATEGORY_OPTIONS.find((option) => option.value === category) || {
    value: category || 'other',
    label: category || 'Umum',
    description: 'Kategori lain untuk kebutuhan audio khusus.',
    badgeClass: 'border-slate-100 bg-slate-50 text-slate-500',
  }
}

const loadError = ref('')
const lastLoadedAt = ref(null)

async function loadAudio() {
  cancelPlaybackAudit()
  playbackAuditStates.value = {}
  playbackAuditStarted.value = false
  loading.value = true
  loadError.value = ''
  try {
    const res = await fetchAdminAudio()
    const data = Array.isArray(res) ? res : (res.data || [])
    audios.value = data
    audioPlaybackStates.value = {}
    lastLoadedAt.value = new Date()
  } catch (error) {
    loadError.value = error.message || 'Gagal memuat musik'
  } finally {
    loading.value = false
  }
}

function handleSearch(value) { 
  search.value = value
  filters.value.global.value = value 
}
function resetForm() {
  selectedAudioFile.value = null
  editingAudio.value = null
  replacementAudioFile.value = null
  replacementDurationSeconds.value = null
  Object.assign(form, { title: '', category: 'romantic', url: '', fileName: '', source: '', credit: '', licenseStatus: 'unknown', durationSeconds: null })
}
function openCreate() { resetForm(); showForm.value = true }
function openEdit(track) {
  resetForm()
  editingAudio.value = track
  Object.assign(form, {
    title: track.title,
    category: track.category,
    source: track.source || '',
    credit: track.credit || '',
    licenseStatus: track.licenseStatus || 'unknown',
    durationSeconds: track.durationSeconds ?? null,
  })
  showForm.value = true
}
function closeForm() { showForm.value = false; resetForm() }

function handlePlay(event, track) {
  if (currentPlayingAudio.value && currentPlayingAudio.value !== event.target) {
    currentPlayingAudio.value.pause()
  }
  currentPlayingAudio.value = event.target
  if (audioPlaybackStates.value[track.id] !== 'playable') {
    audioPlaybackStates.value = { ...audioPlaybackStates.value, [track.id]: 'checking' }
  }
}

function markAudioPlayable(track) {
  audioPlaybackStates.value = { ...audioPlaybackStates.value, [track.id]: 'playable' }
}

function markAudioFailed(track) {
  audioPlaybackStates.value = { ...audioPlaybackStates.value, [track.id]: 'failed' }
}

function checkAllAudioPlayback() {
  if (loading.value || isPlaybackAuditRunning.value || !audios.value.length) return

  cancelPlaybackAudit()
  const generation = playbackAuditGeneration.value
  const tracks = [...audios.value]
  playbackAuditStates.value = Object.fromEntries(tracks.map((track) => [track.id, 'checking']))
  playbackAuditStarted.value = true
  isPlaybackAuditRunning.value = true

  let nextTrackIndex = 0
  const checkNextTrack = async () => {
    while (nextTrackIndex < tracks.length && generation === playbackAuditGeneration.value) {
      const track = tracks[nextTrackIndex++]
      const result = await checkAudioPlayback(track.url)
      if (generation !== playbackAuditGeneration.value) return
      playbackAuditStates.value = { ...playbackAuditStates.value, [track.id]: result }
    }
  }

  Promise.all(Array.from({ length: Math.min(4, tracks.length) }, () => checkNextTrack())).finally(() => {
    if (generation === playbackAuditGeneration.value) isPlaybackAuditRunning.value = false
  })
}

function checkAudioPlayback(url) {
  return new Promise((resolve) => {
    const audio = new Audio()
    let settled = false
    let timeoutId

    const cleanup = () => finish(null)
    const removeListeners = () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      if (timeoutId) window.clearTimeout(timeoutId)
      playbackAuditCleanupHandlers.delete(cleanup)
    }
    const finish = (result) => {
      if (settled) return
      settled = true
      removeListeners()
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      resolve(result)
    }
    const handleCanPlay = () => finish('playable')
    const handleError = () => finish('failed')

    playbackAuditCleanupHandlers.add(cleanup)
    audio.preload = 'auto'
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    timeoutId = window.setTimeout(() => finish('timeout'), 10000)

    if (!url) {
      finish('failed')
      return
    }
    try {
      audio.src = url
      audio.load()
    } catch {
      finish('failed')
    }
  })
}

function cancelPlaybackAudit() {
  playbackAuditGeneration.value += 1
  for (const cleanup of [...playbackAuditCleanupHandlers]) cleanup()
  isPlaybackAuditRunning.value = false
}

function playbackStatusLabel(track) {
  return ({
    unverified: 'belum diperiksa di browser',
    checking: 'sedang memuat',
    playable: 'siap diputar di browser',
    failed: 'gagal dimuat di browser',
    timeout: 'waktu habis saat memuat',
  })[playbackAuditStates.value[track.id] || audioPlaybackStates.value[track.id] || 'unverified']
}

function copyLink(url) {
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`
  navigator.clipboard.writeText(fullUrl)
  toast.success("Link berhasil disalin!")
}

// Bulk Upload Handlers
function handleBulkDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.includes('mpeg') || f.type.includes('mp3'))
  addFilesToQueue(files)
}

function handleBulkFileChange(e) {
  const files = Array.from(e.target.files)
  addFilesToQueue(files)
}

function addFilesToQueue(files) {
  const newItems = files.map(file => ({
    file,
    status: 'pending' // pending, uploading, done, error
  }))
  bulkQueue.value = [...bulkQueue.value, ...newItems]
}

async function processBulkUpload() {
  if (isBulking.value || bulkQueue.value.length === 0) return
  isBulking.value = true
  
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < bulkQueue.value.length; i++) {
    const item = bulkQueue.value[i]
    if (item.status === 'done') continue

    item.status = 'uploading'
    try {
      const title = item.file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ")
      await uploadAdminAudio(item.file, {
        title,
        category: bulkCategory.value,
        durationSeconds: await readAudioDuration(item.file),
      })

      item.status = 'done'
      successCount++
    } catch (error) {
      console.error('Bulk upload error:', error)
      item.status = 'error'
      failCount++
    }
  }

  isBulking.value = false
  if (successCount > 0) {
    toast.success(`${successCount} musik berhasil diupload!`)
    loadAudio()
  }
  if (failCount > 0) {
    toast.error(`${failCount} musik gagal diupload.`)
  }
  
  // Clear done items after a delay
  setTimeout(() => {
     bulkQueue.value = bulkQueue.value.filter(item => item.status !== 'done')
  }, 3000)
}

async function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  selectedAudioFile.value = null
  form.durationSeconds = null
  if (!file.type.includes('mpeg') && !file.type.includes('mp3')) {
     toast.error("Format file harus MP3")
     event.target.value = ""
     return
  }
  if (file.size > 25 * 1024 * 1024) {
     toast.error("Ukuran file terlalu besar (Maks 25MB)")
     event.target.value = ""
     return
  }

  selectedAudioFile.value = file
  form.fileName = file.name
  form.url = file.name
  form.durationSeconds = await readAudioDuration(file)
}

async function handleReplacementFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  replacementAudioFile.value = null
  replacementDurationSeconds.value = null
  if (!file.type.includes('mpeg') && !file.type.includes('mp3')) {
    toast.error('Format file harus MP3')
    event.target.value = ''
    return
  }
  if (file.size > 25 * 1024 * 1024) {
    toast.error('Ukuran file terlalu besar (Maks 25MB)')
    event.target.value = ''
    return
  }
  replacementAudioFile.value = file
  replacementDurationSeconds.value = await readAudioDuration(file)
}

function readAudioDuration(file) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const audio = new Audio()
    const timeout = setTimeout(() => finish(null), 5000)
    const finish = (duration) => {
      clearTimeout(timeout)
      audio.onloadedmetadata = null
      audio.onerror = null
      URL.revokeObjectURL(objectUrl)
      resolve(Number.isFinite(duration) && duration >= 0 ? Math.round(duration) : null)
    }
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => finish(audio.duration)
    audio.onerror = () => finish(null)
    audio.src = objectUrl
  })
}

function formatBytes(value) {
  const bytes = Number(value)
  return Number.isFinite(bytes) && bytes >= 0 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : 'ukuran belum tercatat'
}

function formatDuration(value) {
  const seconds = Number(value)
  if (!Number.isInteger(seconds) || seconds < 0) return 'belum tercatat'
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function licenseStatusLabel(status) {
  return ({ unknown: 'belum diketahui', pending: 'perlu ditinjau', recorded: 'izin tercatat oleh admin', restricted: 'tidak boleh digunakan' })[status] || 'belum diketahui'
}

async function submitForm() {
  if (saving.value || (!editingAudio.value && !selectedAudioFile.value)) return
  saving.value = true
  uploadingFile.value = true
  try {
    const metadata = {
      source: form.source,
      credit: form.credit,
      licenseStatus: form.licenseStatus,
    }
    if (editingAudio.value && replacementAudioFile.value) {
      const result = await replaceAdminAudioFile(editingAudio.value.id, replacementAudioFile.value, {
        ...metadata,
        durationSeconds: replacementDurationSeconds.value,
      })
      toast.success(
        `File diganti. ${result.templateReferencesUpdated} template dan ${result.invitationReferencesUpdated} undangan diperbarui.`,
      )
    } else if (editingAudio.value) {
      await updateAdminAudioMetadata(editingAudio.value.id, metadata)
      toast.success('Metadata musik diperbarui')
    } else {
      await uploadAdminAudio(selectedAudioFile.value, {
        title: form.title,
        category: form.category,
        ...metadata,
        durationSeconds: form.durationSeconds,
      })
      toast.success('Musik ditambahkan ke katalog')
    }
    closeForm()
    await loadAudio()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan')
  } finally {
    uploadingFile.value = false
    saving.value = false
  }
}

async function confirmDelete(track) {
  const result = await Swal.fire({
    title: 'Hapus musik?',
    text: `Audio ini terdeteksi dipakai oleh ${track.templateUseCount ?? 0} template dan ${track.invitationUseCount ?? 0} undangan. Referensi harus diganti sebelum audio dapat dihapus.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminAudio(track.id)
    toast.success('Musik dihapus')
    await loadAudio()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus')
  }
}

onMounted(() => { loadAudio() })
onUnmounted(() => { cancelPlaybackAudit() })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }

/* Custom Scrollbar for the list */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
