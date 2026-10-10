<template>
  <div class="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
    <!-- Studio Header (Full Width) -->
    <header class="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm shrink-0 z-40">
      <div class="flex items-center gap-3">
        <button @click="confirmExit" class="flex items-center gap-2 text-slate-400 hover:text-dark transition-all font-bold text-xs uppercase tracking-widest">
          <div class="w-8 h-8 rounded-full border border-slate-100 bg-white flex items-center justify-center hover:border-mocha hover:text-mocha transition-all shadow-sm">
            <i class="fa-solid fa-chevron-left text-[10px]"></i>
          </div>
          <span class="hidden sm:inline">Keluar</span>
        </button>
        
        <div class="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>
        
        <div>
          <h1 class="text-sm md:text-base font-bold text-dark flex items-center gap-2">
            Studio Editor
            <span class="text-[9px] bg-mocha/10 text-mocha px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
              {{ selectedTemplate.name || 'Tema' }}
            </span>
          </h1>
          <p class="text-[10px] text-slate-400 hidden sm:block">Buat dan edit undangan digitalmu secara real-time</p>
        </div>
      </div>

      <div class="flex items-center gap-3 md:gap-4">
        <!-- Free Design & Preview Reassurance Pill -->
        <div class="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Gratis Desain &amp; Preview • Bayar Hanya Saat Sebar</span>
        </div>

        <!-- Draft status indicator -->
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:inline-block">
          Draf Otomatis Tersimpan
        </span>
        <button @click="saveAndPreview" :disabled="isUploading" class="bg-mocha text-white font-bold py-2.5 px-6 rounded-xl hover:bg-dark shadow-lg shadow-mocha/20 transition-all disabled:opacity-50 flex items-center gap-2 text-xs md:text-sm">
          <span v-if="isUploading" class="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></span>
          <span>{{ route.params.id ? 'Simpan' : 'Simpan & Selesai' }}</span>
          <i v-if="!isUploading" class="fa-solid fa-wand-magic-sparkles text-xs"></i>
        </button>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <!-- Left Side: Editor Panel -->
      <div class="w-full lg:w-[45%] xl:w-[40%] h-full overflow-y-auto relative custom-scrollbar flex flex-col shrink-0 border-r border-gray-100">
        
        <!-- Editor Content with Side Sub-Nav -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar Sub-Nav (Desktop) -->
          <nav class="w-16 md:w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-2 shrink-0">
          <button v-for="tab in tabOptions" :key="tab.id" 
                  @click="activeTab = tab.id"
                  :class="[
                    'w-12 h-12 md:w-14 md:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all',
                    activeTab === tab.id 
                      ? 'bg-mocha text-white shadow-lg shadow-mocha/20 scale-105' 
                      : 'text-slate-400 hover:text-mocha hover:bg-slate-50'
                  ]"
                  :title="tab.label">
            <i :class="['fa-solid', tab.icon, 'text-base md:text-lg']"></i>
            <span class="text-[8px] font-bold uppercase tracking-wider scale-90 md:scale-100">{{ tab.shortLabel }}</span>
          </button>
        </nav>

        <!-- Editor Form Panel -->
        <div ref="editorFormPanel" class="flex-1 overflow-y-auto p-4 md:p-8 pb-32 custom-scrollbar">
          <div class="max-w-3xl mx-auto space-y-8">
            
            <!-- Section Header -->
            <div class="mb-6">
              <h2 class="text-xl md:text-2xl font-serif font-bold text-dark">
                {{ tabOptions.find(t => t.id === activeTab)?.label }}
              </h2>
              <p class="text-xs md:text-sm text-slate-500 mt-1">
                {{ tabOptions.find(t => t.id === activeTab)?.description }}
              </p>
            </div>

            <!-- TAB 1: TEMA & KOMPONEN -->
            <div v-if="activeTab === 'features'" class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8 animate-fade-in">
              <!-- Template Info Card -->
              <div class="flex flex-col sm:flex-row gap-5 items-start p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div class="w-full sm:w-32 aspect-[4/3] rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-200">
                  <img :src="templateImageUrl" class="w-full h-full object-cover" />
                </div>
                <div class="space-y-2">
                  <h4 class="font-serif font-bold text-dark text-lg">{{ selectedTemplate.name }}</h4>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="rounded-lg bg-white px-2 py-1 text-[9px] font-bold uppercase text-mocha shadow-sm border border-mocha/5">
                      ✨ Semua Desain Gratis
                    </span>
                  </div>
                  <button @click="goBackToTemplates" class="text-xs font-bold text-mocha hover:underline flex items-center gap-1.5 pt-1">
                    <i class="fa-solid fa-exchange text-[10px]"></i>
                    Ganti Template
                  </button>
                </div>
              </div>

              <!-- Section Checkboxes -->
              <div class="space-y-6">
                <div class="flex items-center justify-between border-b border-gray-50 pb-4">
                  <h3 class="font-bold text-dark text-sm">Pilihan Komponen Undangan</h3>
                  <div class="flex items-center gap-2">
                    <button @click="selectAll" class="px-2.5 py-1 rounded-lg bg-mocha/10 text-mocha text-[9px] font-bold uppercase tracking-wider hover:bg-mocha hover:text-white transition-all">Pilih Semua</button>
                    <button @click="deselectAll" class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-500 transition-all">Hapus Semua</button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-0.5">
                  <template v-for="(section, key) in sectionOptions" :key="key">
                    <label class="group relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300"
                           :class="sections[key] 
                             ? 'border-mocha bg-mocha/5 shadow-sm shadow-mocha/5' 
                             : 'border-gray-50 bg-gray-50/50 hover:border-mocha/20 hover:bg-white'">
                      <input type="checkbox" v-model="sections[key]" class="hidden" />
                      
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                           :class="sections[key] ? 'bg-mocha text-white' : 'bg-white text-gray-400 group-hover:text-mocha border border-gray-100'">
                        <i :class="['fa-solid', getIcon(key), 'text-xs']"></i>
                      </div>

                      <div class="flex-1 pt-0.5">
                        <span class="text-xs font-bold text-dark group-hover:text-mocha transition-colors select-none leading-none block">
                          {{ section }}
                        </span>
                      </div>

                      <div class="w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
                           :class="sections[key] ? 'border-mocha bg-mocha text-white scale-105' : 'border-gray-200 text-transparent group-hover:border-mocha/30'">
                        <i class="fa-solid fa-check text-[7px]"></i>
                      </div>
                    </label>
                  </template>
                </div>
              </div>
            </div>

            <!-- TAB 2: IDENTITAS MEMPELAI -->
            <div v-if="activeTab === 'mempelai'" class="space-y-6">
              <div class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8 animate-fade-in">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Wanita -->
                  <div class="space-y-5">
                    <h3 class="font-serif font-bold text-base text-mocha flex items-center gap-2">
                      <span class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-xs border border-mocha/10">👰‍♀️</span> 
                      Mempelai Wanita
                    </h3>
                    <div class="space-y-4">
                      <div data-field="brideName">
                        <label class="form-label">Nama Lengkap <span class="text-red-500">*</span></label>
                        <input v-model="formData.brideName" @input="validateField('brideName')" type="text" placeholder="Putri Diana" class="form-input" :class="{ 'border-red-500 bg-red-50/30': validationErrors.brideName }" />
                        <p v-if="validationErrors.brideName" class="form-error">{{ validationErrors.brideName }}</p>
                      </div>
                      <div data-field="brideParents">
                        <label class="form-label">Nama Orang Tua <span class="text-red-500">*</span></label>
                        <input v-model="formData.brideParents" @input="validateField('brideParents')" type="text" placeholder="Bpk. ... & Ibu ..." class="form-input" :class="{ 'border-red-500': validationErrors.brideParents }" />
                        <p v-if="validationErrors.brideParents" class="form-error">{{ validationErrors.brideParents }}</p>
                      </div>
                      <div data-field="bridePhoto">
                        <label class="form-label">Foto Mempelai Wanita <span class="text-red-500">*</span></label>
                        <div class="relative group max-w-[140px]">
                          <input type="file" accept="image/*" @change="handleBridePhotoUpload" class="hidden" id="bridePhoto" />
                          <label v-if="!formData.bridePhoto" for="bridePhoto" class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                            <i class="fa-solid fa-camera text-xl mb-1.5 text-gray-400"></i>
                            <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Pilih Foto</span>
                          </label>
                          <div v-else class="relative group w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                            <img :src="formData.bridePhoto" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                              <button type="button" @click="reopenCropperForBride" class="w-full py-1 bg-white text-dark rounded-lg text-[9px] font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center justify-center gap-1">
                                <i class="fa-solid fa-crop-simple"></i> Edit Crop
                              </button>
                              <label for="bridePhoto" class="w-full py-1 bg-white text-dark rounded-lg text-[9px] font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-arrow-up-from-bracket"></i> Ganti
                              </label>
                              <button type="button" @click="formData.bridePhoto = ''; formData.bridePhotoFile = null; validateField('bridePhoto')" class="w-full py-1 bg-red-500 text-white rounded-lg text-[9px] font-bold shadow hover:bg-red-600 transition-all flex items-center justify-center gap-1">
                                <i class="fa-solid fa-trash"></i> Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                        <p v-if="validationErrors.bridePhoto" class="form-error">{{ validationErrors.bridePhoto }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Pria -->
                  <div class="space-y-5">
                    <h3 class="font-serif font-bold text-base text-mocha flex items-center gap-2">
                      <span class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-xs border border-mocha/10">🤵‍♂️</span> 
                      Mempelai Pria
                    </h3>
                    <div class="space-y-4">
                      <div data-field="groomName">
                        <label class="form-label">Nama Lengkap <span class="text-red-500">*</span></label>
                        <input v-model="formData.groomName" @input="validateField('groomName')" type="text" placeholder="Pangeran Charles" class="form-input" :class="{ 'border-red-500 bg-red-50/30': validationErrors.groomName }" />
                        <p v-if="validationErrors.groomName" class="form-error">{{ validationErrors.groomName }}</p>
                      </div>
                      <div data-field="groomParents">
                        <label class="form-label">Nama Orang Tua <span class="text-red-500">*</span></label>
                        <input v-model="formData.groomParents" @input="validateField('groomParents')" type="text" placeholder="Bpk. ... & Ibu ..." class="form-input" :class="{ 'border-red-500': validationErrors.groomParents }" />
                        <p v-if="validationErrors.groomParents" class="form-error">{{ validationErrors.groomParents }}</p>
                      </div>
                      <div data-field="groomPhoto">
                        <label class="form-label">Foto Mempelai Pria <span class="text-red-500">*</span></label>
                        <div class="relative group max-w-[140px]">
                          <input type="file" accept="image/*" @change="handleGroomPhotoUpload" class="hidden" id="groomPhoto" />
                          <label v-if="!formData.groomPhoto" for="groomPhoto" class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                            <i class="fa-solid fa-camera text-xl mb-1.5 text-gray-400"></i>
                            <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Pilih Foto</span>
                          </label>
                          <div v-else class="relative group w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                            <img :src="formData.groomPhoto" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                              <button type="button" @click="reopenCropperForGroom" class="w-full py-1 bg-white text-dark rounded-lg text-[9px] font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center justify-center gap-1">
                                <i class="fa-solid fa-crop-simple"></i> Edit Crop
                              </button>
                              <label for="groomPhoto" class="w-full py-1 bg-white text-dark rounded-lg text-[9px] font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-arrow-up-from-bracket"></i> Ganti
                              </label>
                              <button type="button" @click="formData.groomPhoto = ''; formData.groomPhotoFile = null; validateField('groomPhoto')" class="w-full py-1 bg-red-500 text-white rounded-lg text-[9px] font-bold shadow hover:bg-red-600 transition-all flex items-center justify-center gap-1">
                                <i class="fa-solid fa-trash"></i> Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                        <p v-if="validationErrors.groomPhoto" class="form-error">{{ validationErrors.groomPhoto }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Slug / Link -->
                <div data-field="title" class="pt-6 border-t border-gray-50">
                  <label class="form-label">Judul Undangan (Nama Link / Slug) <span class="text-red-500">*</span></label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="flex-1">
                      <input v-model="formData.title" @input="validateField('title')" type="text" placeholder="Contoh: The Wedding of Putri & Pangeran" class="form-input font-bold" :class="{ 'border-red-500': validationErrors.title }" />
                      <p v-if="validationErrors.title" class="form-error">{{ validationErrors.title }}</p>
                    </div>
                    <button v-if="suggestedTitle && formData.title !== suggestedTitle" @click="formData.title = suggestedTitle" class="px-4 py-3 bg-mocha/5 text-mocha rounded-xl font-bold text-xs hover:bg-mocha hover:text-white transition-all whitespace-nowrap">Gunakan Saran</button>
                  </div>
                </div>
              </div>

              <!-- Quote Section -->
              <!-- Always shown: the quote renders on every invitation, but no template config enables a "quote" section -->
              <QuoteSection :formData="formData" :defaultQuote="DEFAULT_QUOTE" />
            </div>

            <!-- TAB 3: DETAIL ACARA -->
            <div v-if="activeTab === 'acara'" class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8 animate-fade-in">
              <div data-field="isSingleEvent">
                <label class="form-label mb-4 block">Format Acara Pernikahan <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label class="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all group" :class="formData.isSingleEvent === true ? 'border-mocha bg-mocha/5' : 'border-gray-50 bg-gray-50/50'">
                    <div class="w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0" :class="formData.isSingleEvent === true ? 'border-mocha bg-mocha text-white scale-105' : 'border-gray-300 bg-white group-hover:border-mocha/30'">
                      <i class="fa-solid fa-check text-[9px]" v-if="formData.isSingleEvent === true"></i>
                    </div>
                    <input type="radio" :value="true" v-model="formData.isSingleEvent" class="hidden" />
                    <div>
                      <span class="font-bold block text-dark text-sm">Satu Lokasi</span>
                      <span class="text-[10px] text-muted font-medium">Akad & Resepsi dilangsungkan di tempat sama</span>
                    </div>
                  </label>
                  
                  <label class="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all group" :class="formData.isSingleEvent === false ? 'border-mocha bg-mocha/5' : 'border-gray-50 bg-gray-50/50'">
                    <div class="w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0" :class="formData.isSingleEvent === false ? 'border-mocha bg-mocha text-white scale-105' : 'border-gray-300 bg-white group-hover:border-mocha/30'">
                      <i class="fa-solid fa-check text-[9px]" v-if="formData.isSingleEvent === false"></i>
                    </div>
                    <input type="radio" :value="false" v-model="formData.isSingleEvent" class="hidden" />
                    <div>
                      <span class="font-bold block text-dark text-sm">Acara Terpisah</span>
                      <span class="text-[10px] text-muted font-medium">Akad & Resepsi berbeda waktu / tempat</span>
                    </div>
                  </label>
                </div>
                <p v-if="validationErrors.isSingleEvent" class="form-error mt-2">{{ validationErrors.isSingleEvent }}</p>
              </div>

              <!-- Single Event Fields -->
              <div v-if="formData.isSingleEvent" class="bg-gray-50/50 p-5 md:p-8 rounded-2xl border border-gray-100 space-y-5 shadow-inner">
                <div class="grid md:grid-cols-2 gap-5">
                  <div data-field="dateTime">
                    <label class="form-label">Tanggal & Waktu Akad/Resepsi <span class="text-red-500">*</span></label>
                    <input v-model="formData.dateTime" type="datetime-local" class="form-input" :class="{ 'border-red-500': validationErrors.dateTime }" />
                    <p v-if="validationErrors.dateTime" class="form-error">{{ validationErrors.dateTime }}</p>
                  </div>
                  <div data-field="map">
                    <label class="form-label">Link Google Maps <span class="text-red-500">*</span></label>
                    <input v-model="formData.map" @input="validateField('map')" type="text" placeholder="https://maps.app.goo.gl/..." class="form-input" />
                    <p v-if="validationErrors.map" class="form-error">{{ validationErrors.map }}</p>
                  </div>
                </div>
                <div>
                  <label class="form-label">Alamat Lengkap Lokasi</label>
                  <textarea v-model="formData.mapDesc" placeholder="Contoh: Gedung Serbaguna Lt. 2, Jalan Kenanga No. 45, Jakarta Selatan" class="form-input h-20 resize-none"></textarea>
                </div>
              </div>

              <!-- Multi Event Fields -->
              <div v-if="formData.isSingleEvent === false" class="flex flex-col gap-6">
                <!-- Akad Nikah Card -->
                <div class="bg-white p-5 rounded-2xl border-2 border-gray-50 shadow-sm relative group hover:border-mocha/20 transition-all">
                  <div class="absolute -top-3 left-5 px-3 py-1 bg-sage text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-md">
                    Akad Nikah
                  </div>
                  <div class="space-y-4 mt-4">
                    <div data-field="akadDateTime">
                      <label class="form-label">Waktu Akad <span class="text-red-500">*</span></label>
                      <input v-model="formData.akadDateTime" type="datetime-local" class="form-input" />
                      <p v-if="validationErrors.akadDateTime" class="form-error">{{ validationErrors.akadDateTime }}</p>
                    </div>
                    <div data-field="akadMap">
                      <label class="form-label">Maps Lokasi Akad <span class="text-red-500">*</span></label>
                      <input v-model="formData.akadMap" @input="validateField('akadMap')" type="text" placeholder="https://..." class="form-input" />
                      <p v-if="validationErrors.akadMap" class="form-error">{{ validationErrors.akadMap }}</p>
                    </div>
                    <div>
                      <label class="form-label">Alamat / Lokasi Akad</label>
                      <input v-model="formData.akadDesc" type="text" placeholder="Masjid Al-Ikhlas..." class="form-input" />
                    </div>
                  </div>
                </div>

                <!-- Resepsi Card -->
                <div class="bg-white p-5 rounded-2xl border-2 border-gray-50 shadow-sm relative group hover:border-mocha/20 transition-all">
                  <div class="absolute -top-3 left-5 px-3 py-1 bg-mocha text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-md">
                    Resepsi Pernikahan
                  </div>
                  <div class="space-y-4 mt-4">
                    <div data-field="resepsiDateTime">
                      <label class="form-label">Waktu Resepsi <span class="text-red-500">*</span></label>
                      <input v-model="formData.resepsiDateTime" type="datetime-local" class="form-input" />
                      <p v-if="validationErrors.resepsiDateTime" class="form-error">{{ validationErrors.resepsiDateTime }}</p>
                    </div>
                    <div data-field="resepsiMap">
                      <label class="form-label">Maps Lokasi Resepsi <span class="text-red-500">*</span></label>
                      <input v-model="formData.resepsiMap" @input="validateField('resepsiMap')" type="text" placeholder="https://..." class="form-input" />
                      <p v-if="validationErrors.resepsiMap" class="form-error">{{ validationErrors.resepsiMap }}</p>
                    </div>
                    <div>
                      <label class="form-label">Alamat / Lokasi Resepsi</label>
                      <input v-model="formData.resepsiDesc" type="text" placeholder="Hotel Grand Ballroom..." class="form-input" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 4: GALERI & MUSIK (MEDIA) -->
            <div v-if="activeTab === 'media'" class="space-y-6">
              
              <!-- Images & Gallery Component -->
              <div class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <!-- photoCouple -->
                  <div data-field="photoCouple" class="md:col-span-2">
                    <label class="form-label">Foto Sampul Utama / Cover (Hero) <span class="text-red-500">*</span></label>

                    <!-- State: Belum ada foto -->
                    <label v-if="!formData.photoCouple" class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 group transition-all">
                      <input type="file" accept="image/*" @change="handleCouplePhotoUpload" class="hidden" id="couplePhoto" />
                      <i class="fa-solid fa-image text-3xl text-gray-300 group-hover:text-mocha transition-colors mb-2"></i>
                      <span class="text-xs text-gray-400 group-hover:text-mocha font-semibold">Klik untuk pilih foto sampul</span>
                    </label>

                    <!-- State: Sudah ada foto — preview natural ratio + tombol edit/hapus -->
                    <div v-else class="relative group rounded-2xl overflow-hidden shadow-md border-2 border-gray-100 bg-gray-50">
                      <img :src="formData.photoCouple" class="w-full max-h-72 object-contain rounded-2xl" />

                      <!-- Overlay actions on hover -->
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all rounded-2xl">
                        <!-- Edit / re-crop -->
                        <button type="button" @click="reopenCropperForCouple()" class="flex items-center gap-1.5 px-3 py-2 bg-white text-dark rounded-xl text-xs font-bold shadow hover:bg-mocha hover:text-white transition-all">
                          <i class="fa-solid fa-crop-simple"></i> Edit Crop
                        </button>
                        <!-- Ganti foto -->
                        <label class="flex items-center gap-1.5 px-3 py-2 bg-white text-dark rounded-xl text-xs font-bold shadow hover:bg-mocha hover:text-white transition-all cursor-pointer">
                          <input type="file" accept="image/*" @change="handleCouplePhotoUpload" class="hidden" />
                          <i class="fa-solid fa-arrow-up-from-bracket"></i> Ganti Foto
                        </label>
                        <!-- Hapus -->
                        <button type="button" @click="formData.photoCouple = ''; formData.photoCoupleFile = null" class="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow hover:bg-red-600 transition-all">
                          <i class="fa-solid fa-trash"></i> Hapus
                        </button>
                      </div>
                    </div>

                    <p v-if="validationErrors.photoCouple" class="form-error mt-2">{{ validationErrors.photoCouple }}</p>
                  </div>

                  <div v-if="isTiaraNoirInvitation" class="md:col-span-2 rounded-2xl border border-slate-200 bg-[#f8f7f4] p-5 md:p-6 space-y-5">
                    <div>
                      <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Khusus undangan Refda &amp; Tiara</p>
                      <h3 class="mt-1 font-serif text-lg font-semibold text-dark">Gaya Noir Celestial</h3>
                      <p class="mt-1 text-xs leading-relaxed text-slate-500">Atur tipografi dan media sampul. Foto akan tampil hitam-putih dengan kontras yang lembut.</p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label class="space-y-2">
                        <span class="form-label">Font nama</span>
                        <select v-model="formData.designSettings.fontFamily" class="form-input">
                          <option value="Cormorant Garamond">Cormorant Garamond</option>
                          <option value="Libre Baskerville">Libre Baskerville</option>
                          <option value="DM Sans">DM Sans</option>
                        </select>
                      </label>

                      <label class="space-y-2">
                        <span class="form-label flex items-center justify-between">
                          <span>Ukuran nama</span>
                          <span class="text-mocha">{{ Math.round(formData.designSettings.titleScale * 100) }}%</span>
                        </span>
                        <input
                          v-model.number="formData.designSettings.titleScale"
                          type="range"
                          min="0.8"
                          max="1.2"
                          step="0.05"
                          class="w-full accent-[#a47148]"
                        />
                        <span class="block text-[10px] text-slate-500">Geser untuk mengecilkan atau membesarkan nama.</span>
                      </label>
                    </div>

                    <div class="space-y-3 border-t border-slate-200 pt-4">
                      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label class="space-y-2">
                          <span class="form-label">Format latar</span>
                          <select
                            v-model="formData.designSettings.backgroundType"
                            class="form-input"
                            @change="handleNoirBackgroundTypeChange"
                          >
                            <option value="image">Foto / JPG</option>
                            <option value="video">Video MP4</option>
                          </select>
                        </label>
                        <label class="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:border-mocha hover:text-mocha">
                          <input
                            type="file"
                            :accept="formData.designSettings.backgroundType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'"
                            class="sr-only"
                            @change="handleNoirBackgroundUpload"
                          />
                          <i :class="formData.designSettings.backgroundType === 'video' ? 'fa-solid fa-video' : 'fa-solid fa-image'"></i>
                          <span>Pilih {{ formData.designSettings.backgroundType === 'video' ? 'video' : 'foto' }}</span>
                        </label>
                      </div>
                      <p class="text-[10px] leading-relaxed text-slate-500">Video akan diputar tanpa suara. Maksimal 25 MB; jika tidak memilih foto, foto sampul utama dipakai sebagai latar.</p>

                      <div v-if="noirBackgroundPreviewUrl" class="relative overflow-hidden rounded-xl border border-slate-200 bg-black">
                        <video
                          v-if="formData.designSettings.backgroundType === 'video'"
                          :src="noirBackgroundPreviewUrl"
                          class="h-36 w-full object-cover"
                          muted
                          playsinline
                          controls
                        ></video>
                        <img v-else :src="noirBackgroundPreviewUrl" alt="Pratinjau latar sampul" class="h-36 w-full object-cover grayscale" />
                        <button
                          type="button"
                          class="absolute right-2 top-2 rounded-lg bg-black/70 px-3 py-2 text-[10px] font-bold text-white"
                          @click="clearNoirBackground"
                        >Hapus latar pilihan</button>
                      </div>
                    </div>

                    <div class="space-y-4 border-t border-slate-200 pt-5">
                      <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Teks &amp; waktu acara</p>

                      <label class="block space-y-2">
                        <span class="form-label">Teks sambutan di halaman awal (hero)</span>
                        <textarea
                          v-model="formData.designSettings.heroCopy"
                          rows="3"
                          maxlength="400"
                          class="form-input"
                          placeholder="Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang Anda untuk hadir dalam hari bahagia kami."
                        ></textarea>
                        <span class="flex items-center justify-between text-xs text-slate-500">
                          <span>Kosongkan untuk memakai teks bawaan.</span>
                          <span data-testid="hero-copy-counter">{{ (formData.designSettings.heroCopy || '').length }}/400</span>
                        </span>
                      </label>

                      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label class="space-y-2">
                          <span class="form-label">Jam mulai acara</span>
                          <input v-model="formData.designSettings.eventStartTime" type="time" class="form-input" placeholder="08:00" />
                        </label>
                        <label class="space-y-2">
                          <span class="form-label">Jam selesai acara</span>
                          <input v-model="formData.designSettings.eventEndTime" type="time" class="form-input" placeholder="12:30" />
                        </label>
                      </div>
                      <p class="text-xs text-slate-500">Kosongkan untuk memakai 08.00 – 12.30 WIB.</p>

                      <label class="flex items-center gap-3">
                        <input v-model="formData.designSettings.hideRundown" type="checkbox" class="h-4 w-4 rounded border-slate-300" />
                        <span class="form-label !mb-0">Sembunyikan rundown</span>
                      </label>
                    </div>
                  </div>

                  <!-- denah upload (optional) -->
                  <div v-if="sections.denah" data-field="denah">
                    <label class="form-label">Denah Lokasi / Acara</label>
                    <div class="flex gap-4 items-end">
                      <input type="file" accept="image/*" @change="handleDenahUpload" class="hidden" id="denahUpload" />
                      <label v-if="!formData.denah" for="denahUpload" class="w-28 h-28 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 group transition-all">
                        <i class="fa-solid fa-map-location-dot text-2xl text-gray-300 group-hover:text-mocha transition-colors mb-1"></i>
                        <span class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Pilih Denah</span>
                      </label>
                      <div v-else class="relative group w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-gray-50 flex-shrink-0">
                        <img :src="formData.denah" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                          <button type="button" @click="reopenCropperForDenah" class="w-full py-0.5 bg-white text-dark rounded text-[9px] font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center justify-center gap-1">
                            <i class="fa-solid fa-crop-simple"></i> Crop
                          </button>
                          <label for="denahUpload" class="w-full py-0.5 bg-white text-dark rounded text-[9px] font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-arrow-up-from-bracket"></i> Ganti
                          </label>
                          <button type="button" @click="formData.denah = ''; formData.denahFile = null" class="w-full py-0.5 bg-red-500 text-white rounded text-[9px] font-bold shadow hover:bg-red-600 transition-all flex items-center justify-center gap-1">
                            <i class="fa-solid fa-trash"></i> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Gallery Grid -->
                <div data-field="gallery" class="pt-4 border-t border-gray-50">
                  <label class="form-label">Galeri Foto Pendukung (Maksimal {{ pkgFeatures.galleryLimit }})</label>

                  <div v-if="canGallery" class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    <label v-if="formData.gallery.length < pkgFeatures.galleryLimit" class="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 transition-all group">
                      <input type="file" accept="image/*" multiple @change="handleGalleryUpload" class="hidden" />
                      <i class="fa-solid fa-plus text-gray-300 group-hover:text-mocha"></i>
                    </label>
                    <div v-for="(img, i) in formData.gallery" :key="i" class="aspect-square relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                      <img :src="img.preview" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" @click="reopenCropperForGallery(i)" title="Edit Crop" class="w-7 h-7 rounded-full bg-white text-dark hover:bg-mocha hover:text-white flex items-center justify-center shadow text-xs transition-all">
                          <i class="fa-solid fa-crop-simple"></i>
                        </button>
                        <button type="button" @click="removeGalleryImage(i)" title="Hapus" class="w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center shadow text-xs transition-all">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Gallery locked (Basic tier) -->
                  <div v-else class="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-2.5">
                    <i class="fa-solid fa-images text-amber-500 mt-0.5 text-sm"></i>
                    <p class="text-[10px] md:text-xs text-amber-900 leading-relaxed">
                      Galeri foto tersedia di <strong>paket Premium &amp; Eksklusif</strong>. Upgrade paket saat checkout untuk mengaktifkannya.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Love Story Section -->
              <LoveStorySection v-if="sections['love-story']" :loveStories="formData.loveStories" @add="addLoveStory" @remove="removeLoveStory" @upload="handleLoveStoryUpload" @edit-crop="reopenCropperForLoveStory" />

              <!-- YouTube Link Section -->
              <div v-if="sections.video" class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5 animate-fade-in">
                <div class="flex items-center gap-3 pb-3 border-b border-gray-50">
                  <div class="w-10 h-10 bg-mocha/10 rounded-xl flex items-center justify-center text-mocha text-lg">
                    <i class="fa-solid fa-clapperboard"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-dark text-sm">Video Prewedding</h3>
                    <p class="text-[9px] text-muted uppercase tracking-widest font-black">Video untuk undangan</p>
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="form-label mb-0">URL Video YouTube atau MP4</label>
                    <span class="text-[11px] text-mocha font-medium flex items-center gap-1">
                      <i class="fa-brands fa-youtube"></i> Mendukung Link & Shorts
                    </span>
                  </div>
                  <input
                    v-model="formData.youtubeUrl"
                    type="text"
                    placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                    class="form-input"
                  />
                  <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Sematkan video sinematik / teaser prewedding yang akan langsung dapat diputar oleh tamu di undangan.
                  </p>
                </div>

                <div v-if="isTiaraNoirInvitation" class="space-y-3 rounded-2xl border border-slate-200 p-4">
                  <label class="form-label">Atau unggah video MP4 / WebM</label>
                  <input type="file" accept="video/mp4,video/webm" class="block w-full text-sm text-slate-700" :disabled="isPreweddingUploading" @change="handlePreweddingVideoUpload" />
                  <p class="text-xs text-slate-500">Maksimal 25 MB. Video diunggah saat dipilih agar tetap tersedia setelah tab ditutup; simpan undangan untuk menayangkannya.</p>
                  <p v-if="isPreweddingUploading" role="status" class="text-xs font-semibold text-slate-700">Mengunggah video…</p>
                  <video v-if="noirVideoPreviewUrl" :src="noirVideoPreviewUrl" controls playsinline preload="metadata" class="mx-auto max-h-64 w-full rounded-lg bg-black object-contain"></video>
                </div>

                <!-- Tutorial YouTube Unlisted (Tidak Publik) -->
                <div v-if="!isTiaraNoirInvitation" class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-2.5">
                  <div class="flex items-center gap-2 font-bold text-amber-900">
                    <i class="fa-solid fa-circle-question text-amber-600 text-sm"></i>
                    <span>Ingin video hanya bisa ditonton di undangan (Privat)?</span>
                  </div>
                  <p class="text-amber-800 leading-relaxed text-[11px]">
                    Kamu bisa mengatur visibilitas video di YouTube menjadi <strong>"Tidak Publik" (Unlisted)</strong> agar video tidak muncul di pencarian publik YouTube, tapi tetap bisa diputar di undangan:
                  </p>
                  <ol class="list-decimal list-inside space-y-1 text-amber-900/90 text-[11px] leading-relaxed pl-1 font-medium">
                    <li>Buka <strong>YouTube Studio</strong> (studio.youtube.com) atau aplikasi YouTube di HP.</li>
                    <li>Upload video prewedding kamu seperti biasa.</li>
                    <li>Pada tahap <strong>Visibilitas (Visibility)</strong>, pilih opsi <strong>"Tidak Publik" (Unlisted)</strong>.</li>
                    <li>Salin link video tersebut lalu tempel (paste) ke kolom URL di atas. Selesai! 🎉</li>
                  </ol>
                </div>
              </div>

              <!-- Unified Background Music Section -->
              <div v-if="sections.music" class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-fade-in">
                <div class="flex items-center gap-3 pb-3 border-b border-gray-50">
                  <div class="w-10 h-10 bg-mocha/10 rounded-xl flex items-center justify-center text-mocha text-lg">
                    <i class="fa-solid fa-music"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-dark text-sm">Musik Latar Belakang</h3>
                    <p class="text-[9px] text-muted uppercase tracking-widest font-black">Lagu Pengiring Undangan</p>
                  </div>
                </div>

                <div class="flex flex-col gap-6">
                  <!-- Mode Selection Tabs: Preset Library vs Upload Custom -->
                  <div class="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60">
                    <button
                      type="button"
                      @click="formData.music = formData.music === 'custom' ? '' : formData.music"
                      :class="[
                        'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                        formData.music !== 'custom' 
                          ? 'bg-white text-dark shadow-xs' 
                          : 'text-slate-500 hover:text-dark'
                      ]"
                    >
                      <i class="fa-solid fa-list-music text-mocha"></i>
                      <span>Pustaka Musik ({{ audioList.length }})</span>
                    </button>

                    <button
                      type="button"
                      @click="formData.music = 'custom'; if (!canCustomMusic) formData.musicPreview = ''"
                      :class="[
                        'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                        formData.music === 'custom' 
                          ? 'bg-white text-mocha shadow-xs' 
                          : 'text-slate-500 hover:text-dark'
                      ]"
                    >
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                      <span>Upload Lagu Sendiri</span>
                      <span v-if="!canCustomMusic" class="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <i class="fa-solid fa-gem text-[8px]"></i> Premium
                      </span>
                    </button>
                  </div>

                  <!-- MODE 1: PRESET MUSIC LIBRARY WITH SEARCH -->
                  <div v-if="formData.music !== 'custom'" class="space-y-4 animate-fade-in">
                    <!-- Search Input & Category Pills -->
                    <div class="space-y-3">
                      <div class="relative">
                        <input
                          v-model="musicSearchQuery"
                          type="text"
                          placeholder="Cari judul lagu, artis, atau genre..."
                          class="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-xs text-dark placeholder:text-gray-400 outline-none transition-all"
                        />
                        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                          <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <button
                          v-if="musicSearchQuery"
                          type="button"
                          @click="musicSearchQuery = ''"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
                        >
                          <i class="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                      <!-- Category Chips Filter -->
                      <div v-if="musicCategories.length > 1" class="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          @click="musicCategoryFilter = 'all'"
                          :class="[
                            'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer',
                            musicCategoryFilter === 'all'
                              ? 'bg-mocha text-white shadow-2xs'
                              : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                          ]"
                        >
                          Semua ({{ audioList.length }})
                        </button>
                        <button
                          v-for="cat in musicCategories"
                          :key="cat"
                          type="button"
                          @click="musicCategoryFilter = cat"
                          :class="[
                            'px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors cursor-pointer',
                            musicCategoryFilter === cat
                              ? 'bg-mocha text-white shadow-2xs'
                              : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                          ]"
                        >
                          {{ cat }}
                        </button>
                      </div>
                    </div>

                    <!-- Audio Tracks List / Selector -->
                    <div class="max-h-60 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-50 border border-gray-100 rounded-2xl p-2 bg-gray-50/40">
                      <div
                        v-for="audio in filteredAudioList"
                        :key="audio.id"
                        @click="formData.music = audio.url; formData.musicPreview = ''"
                        :class="[
                          'p-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all',
                          formData.music === audio.url 
                            ? 'bg-mocha/10 border border-mocha/30 text-mocha' 
                            : 'hover:bg-white text-slate-700'
                        ]"
                      >
                        <div class="flex items-center gap-3 min-w-0">
                          <div 
                            :class="[
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs',
                              formData.music === audio.url ? 'bg-mocha text-white' : 'bg-gray-200/80 text-gray-500'
                            ]"
                          >
                            <i :class="formData.music === audio.url ? 'fa-solid fa-volume-high' : 'fa-solid fa-music'"></i>
                          </div>
                          <div class="min-w-0">
                            <p class="text-xs font-bold truncate leading-tight">{{ audio.title }}</p>
                            <span v-if="audio.category" class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{{ audio.category }}</span>
                          </div>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                          <span v-if="formData.music === audio.url" class="text-[10px] font-black bg-mocha text-white px-2 py-0.5 rounded-full">
                            Terpilih
                          </span>
                          <span v-else class="text-[10px] font-semibold text-slate-400 group-hover:text-mocha">
                            Pilih
                          </span>
                        </div>
                      </div>

                      <!-- Empty State -->
                      <div v-if="filteredAudioList.length === 0" class="py-6 text-center text-slate-400 space-y-1">
                        <i class="fa-solid fa-music-slash text-xl mb-1 text-slate-300"></i>
                        <p class="text-xs font-medium">Lagu "{{ musicSearchQuery }}" tidak ditemukan</p>
                        <button type="button" @click="musicSearchQuery = ''; musicCategoryFilter = 'all'" class="text-[11px] text-mocha font-bold hover:underline cursor-pointer">
                          Reset Pencarian
                        </button>
                      </div>
                    </div>

                    <!-- Audio preview player for preset music -->
                    <div v-if="formData.music && formData.music !== 'custom'" class="flex flex-col bg-white p-4 rounded-2xl border border-mocha/20 shadow-xs animate-fade-in space-y-2">
                      <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-dark flex items-center gap-1.5">
                          <i class="fa-solid fa-circle-play text-mocha"></i>
                          Pratinjau Lagu Terpilih
                        </span>
                        <button type="button" @click="formData.music = ''" class="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer">
                          Hapus Pilihan
                        </button>
                      </div>
                      <audio :src="formData.music" controls class="w-full rounded-full shadow-inner h-9"></audio>
                    </div>
                  </div>

                  <!-- MODE 2: CUSTOM MP3 UPLOAD (TIER PREMIUM & EKSKLUSIF ONLY) -->
                  <div v-else class="space-y-4 animate-fade-in">
                    <!-- Allowed Tier Upload Box -->
                    <div v-if="canCustomMusic" class="space-y-4">
                      <div v-if="!formData.musicPreview" class="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-mocha/40 transition-colors text-center">
                        <input type="file" accept="audio/mp3,audio/mpeg,audio/wav" @change="handleMusicUpload" class="hidden" id="musicUpload" />
                        <label for="musicUpload" class="cursor-pointer flex flex-col items-center">
                          <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-mocha text-2xl mb-2.5">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </div>
                          <p class="text-xs font-bold text-dark mb-0.5">Klik untuk Upload File Musik Sendiri</p>
                          <p class="text-[10px] text-gray-500">Format MP3 / WAV, Maksimal 10MB</p>
                          <span class="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wider">
                            <i class="fa-solid fa-circle-check text-[8px]"></i> Akses {{ formData.package === 'eksklusif' ? 'Eksklusif' : 'Premium' }} Aktif
                          </span>
                        </label>
                      </div>

                      <div v-else class="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                          <div class="flex items-center gap-3 min-w-0">
                            <div class="w-10 h-10 bg-mocha text-white rounded-xl flex items-center justify-center text-base shrink-0">
                              <i class="fa-solid fa-file-audio"></i>
                            </div>
                            <div class="min-w-0">
                              <p class="text-xs font-bold text-dark truncate">{{ formData.musicFile?.name || 'Lagu Custom Pengantin' }}</p>
                              <p class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                <i class="fa-solid fa-check"></i> Musik Siap Digunakan
                              </p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            @click="formData.musicPreview = ''; formData.musicFile = null" 
                            class="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            Ganti File
                          </button>
                        </div>

                        <!-- Audio Trimmer Component -->
                        <AudioTrimmer
                          :url="formData.musicPreview"
                          :initialStart="formData.audioStart"
                          :initialEnd="formData.audioEnd"
                          @update:trim="({start, end}) => { formData.audioStart = start; formData.audioEnd = end }"
                        />
                      </div>
                    </div>

                    <!-- Locked State for Basic Tier -->
                    <div v-else class="bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-200/80 space-y-3.5 text-center">
                      <div class="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center text-xl mx-auto shadow-2xs">
                        <i class="fa-solid fa-lock"></i>
                      </div>
                      <div class="space-y-1">
                        <h4 class="font-bold text-amber-950 text-sm">Fitur Khusus Paket Premium &amp; Eksklusif</h4>
                        <p class="text-[11px] text-amber-800/90 leading-relaxed max-w-md mx-auto">
                          Upload file musik custom (.mp3 pilihanmu sendiri) hanya tersedia untuk <strong>Paket Premium &amp; Eksklusif</strong>. Paket Basic dapat menggunakan puluhan lagu romantis di <strong>Pustaka Musik</strong> gratis.
                        </p>
                      </div>
                      <div class="pt-1 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          @click="formData.music = ''"
                          class="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100/50 transition-all cursor-pointer"
                        >
                          Pilih dari Pustaka Musik
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 5: AMPLOP & INFORMASI EXTRA -->
            <div v-if="activeTab === 'ekstra'" class="space-y-6">
              
              <!-- Gift / Envelope Details -->
              <GiftSection :sections="sections" :formData="formData" :foodList="formData.foodList" :giftAddresses="formData.giftAddresses" @add-food="addFood" @remove-food="removeFood" @add-gift="addGiftAddress" @remove-gift="removeGiftAddress" @add-wallet="addWallet" @remove-wallet="removeWallet" @wallet-upload="handleWalletUpload" @wallet-crop="reopenCropperForWallet" @add-bank="addBank" @remove-bank="removeBank" @bank-upload="handleBankUpload" @bank-crop="reopenCropperForBank" />
              
              <!-- Social Media Links -->
              <SocialSection v-if="sections.socialMedia || sections['live-streaming']" :formData="formData" />

              <!-- Extra components and configs -->
              <div v-if="sections['dress-code'] || sections['extended-family'] || sections.likes" 
                   class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div v-if="sections['dress-code']">
                    <label class="form-label">Dress Code (Aturan Busana)</label>
                    <input v-model="formData.dressCode" type="text" placeholder="Contoh: Putih / Batik Modern" class="form-input" />
                  </div>
                </div>
                
                <div v-if="sections['extended-family']" class="pt-4 border-t border-gray-50">
                  <label class="form-label">Turut Mengundang (Keluarga Besar)</label>
                  <textarea v-model="formData.extendedFamilyText" placeholder="Tulis nama-nama keluarga besar, pisahkan dengan koma atau baris baru..." class="form-input h-20 resize-none"></textarea>
                </div>
              </div>

              <!-- Footer text Customization -->
              <div v-if="sections.footer" class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 animate-fade-in">
                <label class="form-label">Teks Penutup Undangan</label>
                <textarea v-model="formData.footerText" placeholder="Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu berkenan hadir..." class="form-input h-20 resize-none"></textarea>
              </div>

              <!-- Guestbook/RSVP Toggles -->
              <div class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5 animate-fade-in">
                <h3 class="font-bold text-dark text-sm border-b border-gray-50 pb-3">Konfigurasi Interaksi Tamu</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <span class="text-xs font-bold block text-dark">Buku Ucapan</span>
                      <span class="text-[9px] text-slate-400">Tamu bisa menulis ucapan doa</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" v-model="formData.wishesState" class="sr-only peer" />
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mocha"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <span class="text-xs font-bold block text-dark">Konfirmasi RSVP</span>
                      <span class="text-[9px] text-slate-400">Tamu bisa melakukan RSVP</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" v-model="formData.rsvpState" class="sr-only peer" />
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mocha"></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Custom Subdomain (Tier Eksklusif only) -->
              <div v-if="formData.package === 'eksklusif'" class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 animate-fade-in">
                <div class="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h3 class="font-bold text-dark text-sm flex items-center gap-2">
                    <i class="fa-solid fa-globe text-mocha/60"></i> Subdomain Custom
                  </h3>
                  <span class="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Eksklusif</span>
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed">
                  Alamat khusus undangan kamu. Kosongkan kalau mau pakai link biasa.
                </p>

                <div class="flex items-stretch rounded-xl border-2 transition-colors overflow-hidden"
                     :class="{
                       'border-gray-100 focus-within:border-mocha': subdomainStatus.state === 'idle' || subdomainStatus.state === 'checking',
                       'border-emerald-300': subdomainStatus.state === 'available',
                       'border-red-300': subdomainStatus.state === 'taken' || subdomainStatus.state === 'invalid',
                     }">
                  <input v-model="formData.subdomain" type="text" placeholder="namapasangan"
                         class="flex-1 min-w-0 px-3.5 py-2.5 text-sm outline-none bg-transparent" autocomplete="off" />
                  <span class="flex items-center px-3 bg-gray-50 text-xs text-slate-400 border-l border-gray-100 select-none">.satuundangan.id</span>
                </div>

                <!-- Status line -->
                <p v-if="subdomainStatus.state === 'checking'" class="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <i class="fa-solid fa-spinner fa-spin"></i> Mengecek ketersediaan...
                </p>
                <p v-else-if="subdomainStatus.state === 'available'" class="text-[11px] text-emerald-600 font-medium flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-check"></i> {{ subdomainStatus.normalized }}.satuundangan.id tersedia
                </p>
                <p v-else-if="subdomainStatus.state === 'taken' || subdomainStatus.state === 'invalid'" class="text-[11px] text-red-500 font-medium flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-xmark"></i> {{ subdomainStatus.message }}
                </p>
              </div>
            </div>

            <!-- Navigation Bar (Footer Form) -->
            <div class="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
              <button v-if="activeTabIndex > 0" @click="activeTab = tabOptions[activeTabIndex - 1].id" class="px-5 py-3 rounded-xl font-bold text-xs md:text-sm text-slate-400 hover:text-dark transition-all">
                <i class="fa-solid fa-arrow-left mr-1.5"></i> Sebelumnya
              </button>
              <div v-else></div>

              <button v-if="activeTabIndex < tabOptions.length - 1" @click="activeTab = tabOptions[activeTabIndex + 1].id" class="bg-mocha text-white font-bold py-3 px-8 rounded-xl hover:bg-dark shadow-md shadow-mocha/10 transition-all text-xs md:text-sm flex items-center gap-2">
                <span>Lanjut</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
              <button v-else @click="saveAndPreview" :disabled="isUploading" class="bg-mocha text-white font-bold py-3 px-8 rounded-xl hover:bg-dark shadow-md shadow-mocha/10 transition-all disabled:opacity-50 text-xs md:text-sm flex items-center gap-2">
                <span v-if="isUploading" class="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></span>
                <span>{{ route.params.id ? 'Simpan' : 'Simpan & Preview' }}</span>
                <i v-if="!isUploading" class="fa-solid fa-wand-magic-sparkles text-xs"></i>
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- Right Side: Live Preview Container (Desktop Only) -->
    <div class="hidden lg:flex flex-1 bg-slate-100 border-l border-gray-200 h-full flex-col items-center p-6 overflow-hidden">
      <!-- Device Switcher Header -->
      <div class="w-full flex items-center justify-between border-b border-gray-200/50 pb-4 mb-4 shrink-0">
        <!-- Live Sync Status -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-mocha/10 text-mocha rounded-full">
          <span class="relative flex h-2 w-2">
             <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-mocha opacity-75"></span>
             <span class="relative inline-flex rounded-full h-2 w-2 bg-mocha"></span>
          </span>
          <span class="text-[9px] font-black uppercase tracking-widest">Live Sync</span>
        </div>

        <!-- Mode Toggle (Mobile / Desktop) -->
        <div class="flex items-center bg-slate-200/60 p-0.5 rounded-xl border border-slate-200">
          <button @click="previewMode = 'mobile'" 
                  :class="[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200',
                    previewMode === 'mobile' 
                      ? 'bg-white text-mocha shadow-sm' 
                      : 'text-slate-500 hover:text-dark'
                  ]">
            <i class="fa-solid fa-mobile-screen-button"></i>
            <span>Mobile</span>
          </button>
          <button @click="previewMode = 'desktop'" 
                  :class="[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200',
                    previewMode === 'desktop' 
                      ? 'bg-white text-mocha shadow-sm' 
                      : 'text-slate-500 hover:text-dark'
                  ]">
            <i class="fa-solid fa-laptop text-xs"></i>
            <span>Desktop</span>
          </button>
        </div>

        <!-- Zoom Level Controller -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <span class="text-[9px] font-bold text-slate-400 px-1.5 flex items-center gap-1">
            <i class="fa-solid fa-magnifying-glass text-[8px]"></i>
            <span class="hidden sm:inline">Zoom</span>
          </span>
          <button 
            v-for="zoom in [70, 80, 90, 100]" 
            :key="zoom"
            @click="setZoom(zoom)"
            :class="[
              'px-2 py-1 rounded-lg text-[10px] font-bold transition-all',
              userZoom === zoom
                ? 'bg-white text-mocha shadow-sm' 
                : 'text-slate-500 hover:text-dark'
            ]"
            :title="`Atur zoom pratinjau ke ${zoom}%`"
          >
            {{ zoom }}%
          </button>
        </div>

        <!-- Refresh button -->
        <div class="text-right">
          <button @click="refreshPreview" class="w-8 h-8 rounded-full border border-gray-200 hover:border-mocha hover:text-mocha bg-white flex items-center justify-center transition-all shadow-sm ml-auto" title="Muat Ulang Pratinjau">
            <i class="fa-solid fa-rotate-right text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Preview Mockup Area -->
      <div ref="previewArea" class="flex-1 w-full flex items-center justify-center overflow-hidden py-4 relative">
        <!-- Dynamic Frame Wrapper -->
        <div :class="[
          'overflow-hidden flex flex-col shadow-2xl',
          previewMode === 'mobile'
            ? 'bg-dark rounded-[3rem] border-[12px] border-dark ring-4 ring-slate-200/50 flex-shrink-0'
            : 'bg-white rounded-2xl border border-slate-200 shadow-xl'
        ]" :style="wrapperStyle">
          <!-- Phone Notch (Mobile only) -->
          <div v-if="previewMode === 'mobile'" class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-dark rounded-b-xl z-20"></div>

          <!-- Browser address bar simulation (Desktop only) -->
          <div v-if="previewMode === 'desktop'" class="w-full bg-slate-50 border-b border-gray-200/50 px-4 py-2 flex items-center gap-3 shrink-0 select-none">
            <!-- Browser dots -->
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-400"></span>
            </div>
            <!-- Browser address input -->
            <div class="flex-1 max-w-md mx-auto bg-white border border-slate-200/60 rounded-lg px-3 py-1 text-[10px] text-slate-400 text-center truncate shadow-sm flex items-center justify-center gap-1">
              <i class="fa-solid fa-lock text-[8px] text-emerald-500"></i>
              <span>satuundangan.com/{{ formData.slug || 'slug-undangan' }}</span>
            </div>
            <!-- Empty placeholder to balance spacing -->
            <div class="w-12"></div>
          </div>

          <!-- Iframe Viewport with dynamic scaling -->
          <div class="flex-1 w-full h-full relative overflow-hidden">
            <iframe 
               ref="previewIframe"
               :src="previewUrl"
               class="absolute top-0 left-0 bg-white"
               :style="iframeStyle"
               frameborder="0"
               @load="onIframeLoad"
            ></iframe>

            <!-- Loading Overlay Inside Mockup -->
            <Transition name="fade">
               <div v-if="isPreviewLoading" class="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                  <div class="w-10 h-10 border-3 border-mocha/20 border-t-mocha rounded-full animate-spin mb-3"></div>
                  <p class="text-[9px] font-black text-mocha uppercase tracking-widest">Sinkronisasi...</p>
               </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Description Footer -->
      <div class="mt-2 text-center shrink-0">
         <p class="text-[10px] text-slate-400 max-w-[280px] font-medium leading-relaxed">
            Perubahan data pada form editor kiri disinkronisasikan ke pratinjau secara instan.
         </p>
      </div>
    </div>

  </div> <!-- Closes Main Workspace Div -->

    <!-- Floating Preview Trigger Button for Mobile devices -->
    <button @click="showMobilePreview = true" class="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-mocha text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all">
       <i class="fa-solid fa-eye text-base"></i>
    </button>

    <!-- Fullscreen Mobile Preview Sheet -->
    <Transition name="fade">
      <div v-if="showMobilePreview" class="lg:hidden fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex flex-col">
         <div class="flex items-center justify-between p-4 text-white">
            <div class="flex items-center gap-2">
               <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <span class="text-[10px] font-black uppercase tracking-widest">Pratinjau Mobile</span>
            </div>
            <button @click="showMobilePreview = false" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
               <i class="fa-solid fa-times text-xs"></i>
            </button>
         </div>
         
         <div class="flex-1 px-4 pb-4">
            <div class="w-full h-full bg-white rounded-2xl border-4 border-dark overflow-hidden relative">
               <iframe 
                  ref="mobilePreviewIframe"
                  :src="previewUrl"
                  class="w-full h-full"
                  frameborder="0"
                  @load="onIframeLoad"
               ></iframe>
               
               <Transition name="fade">
                  <div v-if="isPreviewLoading" class="absolute inset-0 bg-white flex flex-col items-center justify-center">
                     <div class="w-10 h-10 border-3 border-mocha/20 border-t-mocha rounded-full animate-spin mb-3"></div>
                     <p class="text-[9px] font-black text-mocha uppercase tracking-widest">Memuat...</p>
                  </div>
               </Transition>
            </div>
         </div>
      </div>
    </Transition>

    <!-- Crop Image Modal Container -->
    <ImageCropperModal
       :show="cropper.show"
       :imageSrc="cropper.image"
       :stencilAspectRatio="cropper.aspectRatio"
       @close="cropper.show = false"
       @crop="onCropComplete"
    />

    <!-- Upload Progress Modal -->
    <Transition name="modal">
       <div v-if="uploadProgress.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
          <div class="relative w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl overflow-hidden border border-gray-100">
             <div class="absolute -top-20 -left-20 w-40 h-40 bg-mocha/5 rounded-full blur-3xl animate-pulse"></div>
             
             <div class="relative z-10 space-y-4">
                <div class="relative inline-block">
                   <svg class="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" stroke-width="6" fill="transparent" class="text-gray-100" />
                      <circle cx="40" cy="40" r="32" stroke="currentColor" stroke-width="6" fill="transparent" 
                         :stroke-dasharray="2 * Math.PI * 32"
                         :stroke-dashoffset="2 * Math.PI * 32 * (1 - uploadProgress.percentage / 100)"
                         stroke-linecap="round" class="text-mocha transition-all duration-500" />
                   </svg>
                   <div class="absolute inset-0 flex items-center justify-center font-black text-dark text-lg">
                      {{ uploadProgress.percentage }}%
                   </div>
                </div>
                
                <h3 class="text-lg font-black text-dark uppercase tracking-tight">Menyimpan Perubahan...</h3>
                <p class="text-xs text-slate-400 leading-snug">{{ uploadProgress.message }}</p>
                
                <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                   <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-mocha shadow-sm shrink-0">
                      <i class="fa-solid fa-cloud-arrow-up animate-bounce text-sm"></i>
                   </div>
                   <div class="min-w-0 flex-1">
                      <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Nama File</p>
                      <p class="text-xs font-bold text-dark truncate">{{ uploadProgress.currentFile }}</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </Transition>

    <AuthModal v-if="showLogin" :show="showLogin" :authMode="authMode" @close="cancelLogin"
      @update:authMode="authMode = $event" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { analytics } from '@/api/analytics'
import { uploadFileApi } from '@/api/file'
import { getInvitationById, createInvitation, updateInvitation, checkSubdomainAvailability } from '@/api/invitation'
import { getSections, fetchPublicAudio } from '@/api/master'
import { featuresFor } from '@/config/packageFeatures'
import QuoteSection from './create-form/components/QuoteSection.vue'
import { resolveQuoteForSave } from './create-form/components/quotePresets'
import AudioTrimmer from '@/components/invitation/AudioTrimmer.vue'
import LoveStorySection from './create-form/components/LoveStorySection.vue'
import GiftSection from './create-form/components/GiftSection.vue'
import SocialSection from './create-form/components/SocialSection.vue'
import ImageCropperModal from './create-form/components/ImageCropperModal.vue'
import AuthModal from '@/components/modal/AuthModal.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const activeTab = ref('features')
const editorFormPanel = ref(null)
const isUploading = ref(false)
const getInitialTemplate = () => {
  try {
    const item = localStorage.getItem('selectedTemplate')
    return item ? (JSON.parse(item) || {}) : {}
  } catch (e) {
    console.error('Failed to parse selectedTemplate:', e)
    return {}
  }
}
const selectedTemplate = ref(getInitialTemplate())
const audioList = ref([])
const hasUnsavedChanges = ref(false)
const isHydrating = ref(true)
const noirBackgroundPreview = ref('')
const noirVideoPreview = ref('')
const isPreweddingUploading = ref(false)
const musicSearchQuery = ref('')
const musicCategoryFilter = ref('all')

const musicCategories = computed(() => {
  const cats = new Set()
  audioList.value.forEach(a => {
    if (a.category) cats.add(a.category)
  })
  return Array.from(cats)
})

const filteredAudioList = computed(() => {
  let list = audioList.value || []
  if (musicCategoryFilter.value !== 'all') {
    list = list.filter(a => (a.category || '').toLowerCase() === musicCategoryFilter.value.toLowerCase())
  }
  const q = musicSearchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(a => 
      (a.title || '').toLowerCase().includes(q) || 
      (a.category || '').toLowerCase().includes(q)
    )
  }
  return list
})
const showLogin = ref(false)
const authMode = ref('login')
const auth = useAuthStore()
const isAuthenticated = computed(() => !!auth.token)

// Preview States
const showMobilePreview = ref(false)
const isPreviewLoading = ref(true)
const previewIframe = ref(null)
const mobilePreviewIframe = ref(null)
const previewMode = ref('mobile')

const onIframeLoad = () => {
  isPreviewLoading.value = false
  syncDataToPreview(formData.value)
}

const handleMessageEvent = (event) => {
  if (event.data?.type === 'PREVIEW_READY') {
     isPreviewLoading.value = false
     syncDataToPreview(formData.value) 
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', handleMessageEvent)
}

const refreshPreview = () => {
  isPreviewLoading.value = true
  if (previewIframe.value) {
    try {
      previewIframe.value.src = previewUrl.value
    } catch (e) {
      previewIframe.value.contentWindow.location.reload()
    }
  }
}

const previewArea = ref(null)
const userZoom = ref(Number(localStorage.getItem('studio_preview_zoom')) || 80)
const scaleFactor = ref(1)
const mobileScale = ref(1)
const iframeHeight = ref('100%')
let resizeObserver = null

const setZoom = (val) => {
  userZoom.value = val
  try {
    localStorage.setItem('studio_preview_zoom', String(val))
  } catch (e) {}
  updateScale()
}

const updateScale = () => {
  if (!previewArea.value) return
  const containerWidth = previewArea.value.clientWidth
  const containerHeight = previewArea.value.clientHeight
  if (containerWidth <= 0 || containerHeight <= 0) return

  // 1. Desktop scale factor calculation
  const virtualWidth = 1280
  scaleFactor.value = containerWidth / virtualWidth
  
  let availableHeight = containerHeight
  if (previewMode.value === 'desktop') {
    const parent = previewIframe.value?.parentElement
    if (parent && parent.clientHeight > 0) {
      availableHeight = parent.clientHeight
    } else {
      availableHeight = containerHeight - 37 // fallback for simulated browser bar height
    }
  }
  iframeHeight.value = `${availableHeight / scaleFactor.value}px`

  // 2. Mobile mockup scale factor calculation: phone frame fits preview area comfortably
  const mobileWidth = 290
  const mobileHeight = 612.2 // 290 * 19 / 9
  const scaleW = (containerWidth - 32) / mobileWidth
  const scaleH = (containerHeight - 32) / mobileHeight
  mobileScale.value = Math.min(1, scaleW, scaleH)
}

watch(previewMode, () => {
  nextTick(() => {
    updateScale()
  })
})

const wrapperStyle = computed(() => {
  if (previewMode.value === 'mobile') {
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '290px',
      height: '612px',
      transform: `translate(-50%, -50%) scale(${mobileScale.value})`,
      transformOrigin: 'center',
    }
  }
  return {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    transform: 'none',
    transformOrigin: 'initial',
  }
})

const iframeStyle = computed(() => {
  const zoomFactor = (userZoom.value || 80) / 100

  if (previewMode.value === 'desktop') {
    const effectiveVirtualWidth = 1280 / zoomFactor
    const effectiveVirtualHeight = (parseFloat(iframeHeight.value) || 800) / zoomFactor
    const effectiveScale = scaleFactor.value * zoomFactor
    return {
      width: `${effectiveVirtualWidth.toFixed(1)}px`,
      height: `${effectiveVirtualHeight.toFixed(1)}px`,
      transform: `scale(${effectiveScale})`,
      transformOrigin: 'top left',
    }
  }

  // Mobile mode: zoom the content inside the phone frame
  if (zoomFactor >= 0.99 && zoomFactor <= 1.01) {
    return {
      width: '100%',
      height: '100%',
      transform: 'none',
      transformOrigin: 'initial',
    }
  }
  const invPercent = (100 / zoomFactor).toFixed(4)
  return {
    width: `${invPercent}%`,
    height: `${invPercent}%`,
    transform: `scale(${zoomFactor})`,
    transformOrigin: 'top left',
  }
})

const tabOptions = [
  { id: 'features', shortLabel: 'Komponen', label: 'Pilihan Komponen Undangan', description: 'Pilih bagian / komponen yang ingin Anda tampilkan di halaman undangan pernikahan Anda.', icon: 'fa-wand-magic-sparkles' },
  { id: 'mempelai', shortLabel: 'Mempelai', label: 'Identitas Mempelai', description: 'Masukkan biodata lengkap dan foto dari kedua mempelai pengantin serta kutipan ayat.', icon: 'fa-user-friends' },
  { id: 'acara', shortLabel: 'Acara', label: 'Detail Momen Acara', description: 'Tentukan lokasi dan waktu berlangsungnya acara Akad Nikah dan Resepsi pernikahan Anda.', icon: 'fa-calendar-alt' },
  { id: 'media', shortLabel: 'Media', label: 'Galeri & Lagu Latar', description: 'Tambahkan galeri foto kebersamaan, video prewedding, dan musik latar belakang pengiring.', icon: 'fa-images' },
  { id: 'ekstra', shortLabel: 'Ekstra', label: 'Hadiah & Pengaturan', description: 'Kelola amplop digital, detail dress code, himbauan protokol kesehatan, serta pesan/ucapan dari tamu.', icon: 'fa-gift' }
]

const activeTabIndex = computed(() => tabOptions.findIndex(t => t.id === activeTab.value))

const previewUrl = computed(() => {
  const templateSlug = selectedTemplate.value?.slug || 'dark-elegant'
  return `/live-preview?mode=live&preview=true&templateId=${templateSlug}&frame=true`
})

const suggestedTitle = computed(() => {
  const groom = (formData.value.groomName || '').split(' ')[0]
  const bride = (formData.value.brideName || '').split(' ')[0]
  return groom && bride ? `${groom} & ${bride}` : ''
})

const DEFAULT_QUOTE = "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (QS. Ar-Rum: 21)"

// Form State
const formData = ref({
  title: '', slug: '', brideName: '', groomName: '', bridePhoto: '', bridePhotoFile: null,
  groomPhoto: '', groomPhotoFile: null, photoCouple: '', photoCoupleFile: null,
  designSettings: {
    fontFamily: 'Cormorant Garamond',
    titleScale: 1,
    backgroundType: 'image',
    backgroundUrl: '',
    backgroundFile: null,
    heroCopy: '',
    eventStartTime: '',
    eventEndTime: '',
    hideRundown: false,
  },
  gallery: [], isSingleEvent: null, dateTime: '', map: '', mapDesc: '',
  akadDateTime: '', akadMap: '', akadDesc: '', resepsiDateTime: '', resepsiMap: '', resepsiDesc: '',
  music: '', youtubeUrl: '', denah: '', denahFile: null,
  musicFile: null, musicPreview: '', audioStart: 0, audioEnd: 0,
  wishes: 'ya', rsvp: 'ya', encryptedGuest: 'ya',
  brideParents: '', groomParents: '', 
  
  // Expanded fields
  loveStories: [],
  sosmedBride: { instagram: '', tiktok: '', youtube: '', otherSocial: '' },
  sosmedGroom: { instagram: '', tiktok: '', youtube: '', otherSocial: '' },
  liveStreamingLink: '',
  foodList: [],
  giftAddresses: [],
  eWalletLink: [],
  bankAccounts: [],
  dressCode: '',
  extendedFamily: [],
  extendedFamilyText: '',
  healthProtocol: true,
  footerText: '',
  subdomain: '',
  // Match the checkout default so Premium features are available while editing.
  // Explicitly selected Basic is still carried over from the pricing flow.
  package: 'premium',
  likes: true,
  quoteType: 'default',
  quote: '',
  quoteSource: '',
  religion: '',

  // States mapped to checkbox inputs
  wishesState: true,
  rsvpState: true
})

const isTiaraNoirInvitation = computed(
  () => formData.value.slug === 'refda-tiara' || selectedTemplate.value.slug === 'refda-tiara-noir',
)
const noirBackgroundPreviewUrl = computed(
  () =>
    noirBackgroundPreview.value ||
    formData.value.designSettings.backgroundUrl ||
    (formData.value.designSettings.backgroundType === 'image' ? formData.value.photoCouple : ''),
)
const noirVideoPreviewUrl = computed(() => {
  const source = noirVideoPreview.value || formData.value.youtubeUrl || ''
  return source.startsWith('blob:') || /\.(?:mp4|webm)(?:[?#]|$)/i.test(source) ? source : ''
})

// Custom subdomain live availability check (tier Eksklusif)
const subdomainStatus = ref({ state: 'idle', message: '', normalized: '' })
let subdomainTimer = null

watch(() => formData.value.subdomain, (val) => {
  clearTimeout(subdomainTimer)
  const raw = (val || '').trim()
  if (!raw) {
    subdomainStatus.value = { state: 'idle', message: '', normalized: '' }
    return
  }
  subdomainStatus.value = { state: 'checking', message: '', normalized: '' }
  subdomainTimer = setTimeout(async () => {
    try {
      const excludeId = route.params.id || localStorage.getItem('editInvitationId') || undefined
      const res = await checkSubdomainAvailability(raw, excludeId)
      const data = res.data || res
      if (data.available) {
        subdomainStatus.value = { state: 'available', message: '', normalized: data.normalized }
      } else {
        subdomainStatus.value = { state: data.reason?.includes('digunakan') ? 'taken' : 'invalid', message: data.reason || 'Tidak tersedia', normalized: data.normalized }
      }
    } catch {
      subdomainStatus.value = { state: 'invalid', message: 'Gagal mengecek, coba lagi', normalized: '' }
    }
  }, 450)
})

onUnmounted(() => clearTimeout(subdomainTimer))

// Checkbox items for optional components (CreateDesign)
const sections = ref({})
const sectionOptions = ref({})
const validationErrors = ref({})

const cropper = ref({
  show: false,
  image: '',
  aspectRatio: 1,
  targetField: '',
  targetIndex: null
})

const uploadProgress = ref({
  show: false,
  percentage: 0,
  message: '',
  currentFile: ''
})

// Feature access is driven by the chosen package tier, not the template.
const pkgFeatures = computed(() => featuresFor(formData.value.package))
const canCustomMusic = computed(() => pkgFeatures.value.customMusic)
const canGallery = computed(() => pkgFeatures.value.gallery)

const templateImageUrl = computed(() => (
  selectedTemplate.value?.thumbnailUrl ||
  selectedTemplate.value?.previewImageUrl ||
  selectedTemplate.value?.previewUrl ||
  'https://via.placeholder.com/400x300?text=Template'
))

const templatePrice = computed(() => {
  const price = Number(selectedTemplate.value?.price || 0)
  if (!price) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
})

const sectionOptionsLabelMap = {
  quote: 'Quote Ayat / Mutiara',
  'love-story': 'Love Story (Cerita Cinta)',
  photoCouple: 'Profil & Foto Mempelai',
  couple: 'Profil & Foto Mempelai',
  music: 'Musik Latar',
  map: 'Peta Lokasi (Google Maps)',
  'event-details': 'Detail Acara Lengkap',
  event: 'Detail Acara & Peta',
  rsvp: 'Konfirmasi Kehadiran (RSVP)',
  wishes: 'Kolom Ucapan & Doa',
  countdown: 'Hitung Mundur Acara',
  'dress-code': 'Panduan Dress Code',
  denah: 'Denah Lokasi / Ruangan',
  encryptedGuest: 'Enkripsi Nama Tamu',
  menu: 'Daftar Menu Makanan',
  gift: 'Amplop Digital & Kado',
  cover: 'Halaman Sampul (Cover)',
  hero: 'Halaman Sampul (Cover)',
  gallery: 'Galeri Foto',
  'live-streaming': 'Live Streaming Link',
  'likes': 'Fitur Like / Suka',
  footer: 'Halaman Penutup',
  'extended-family': 'Turut Mengundang',
  video: 'Video Prewedding'
}

const defaultCommonSections = [
  'quote',
  'photoCouple',
  'couple',
  'love-story',
  'countdown',
  'event',
  'map',
  'rsvp',
  'wishes'
]

// Icons Map helper
const getIcon = (key) => {
  const iconMap = {
    quote: 'fa-quote-left',
    'love-story': 'fa-book-heart',
    story: 'fa-book-heart',
    photoCouple: 'fa-user-group',
    couple: 'fa-user-group',
    music: 'fa-music',
    map: 'fa-map-location-dot',
    rsvp: 'fa-clipboard-check',
    wishes: 'fa-comment-dots',
    countdown: 'fa-clock',
    'dress-code': 'fa-shirt',
    dressCode: 'fa-shirt',
    denah: 'fa-map',
    encryptedGuest: 'fa-user-lock',
    menu: 'fa-utensils',
    gift: 'fa-gift',
    cover: 'fa-book-open',
    hero: 'fa-book-open',
    gallery: 'fa-images',
    'live-streaming': 'fa-video',
    'event-details': 'fa-calendar-day',
    event: 'fa-calendar-day',
    'likes': 'fa-thumbs-up',
    'footer': 'fa-scroll',
    'extended-family': 'fa-users',
    video: 'fa-clapperboard'
  }
  return iconMap[key] || 'fa-star'
}

const getCanonicalSelectedSections = () => {
  const activeKeys = Object.keys(sections.value).filter(k => sections.value[k])
  const expanded = new Set(activeKeys)

  const aliasPairs = [
    ['couple', 'photoCouple'],
    ['couple', 'mempelai'],
    ['event', 'event-details'],
    ['event', 'map'],
    ['event', 'acara'],
    ['hero', 'cover'],
    ['love-story', 'story'],
    ['wishes', 'guestbook'],
    ['gift', 'digital-envelope'],
    ['extended-family', 'turut-mengundang'],
    ['video', 'video-prewedding'],
    ['dress-code', 'dressCode'],
    ['live-streaming', 'live-stream']
  ]

  aliasPairs.forEach(([canonical, alias]) => {
    if (expanded.has(canonical) || expanded.has(alias)) {
      expanded.add(canonical)
      expanded.add(alias)
    }
  })

  return Array.from(expanded)
}

const selectAll = () => {
  Object.keys(sectionOptions.value).forEach(k => sections.value[k] = true)
}

const deselectAll = () => {
  Object.keys(sectionOptions.value).forEach(k => sections.value[k] = false)
}

// Syncing wishesState & rsvpState to database strings 'ya' / 'tidak'
watch(() => formData.value.wishesState, (val) => {
  formData.value.wishes = val ? 'ya' : 'tidak'
})
watch(() => formData.value.rsvpState, (val) => {
  formData.value.rsvp = val ? 'ya' : 'tidak'
})

watch(activeTab, () => {
  nextTick(() => {
    if (editorFormPanel.value) {
      editorFormPanel.value.scrollTop = 0
    }
  })
})

// Debounced Live Preview Sync Logic
const syncDataToPreview = (data) => {
  try {
    const rawPayload = {
      type: 'LIVE_PREVIEW_UPDATE',
      data: {
        title: data.title,
        template_slug: selectedTemplate.value.slug || 'dark-elegant',
        brideName: data.brideName || 'Nama Wanita',
        groomName: data.groomName || 'Nama Pria',
        photoCoupleUrl: data.photoCouple || '/default-couple.jpg',
        bridePhotoUrl: data.bridePhoto || '/default-bride.jpg',
        groomPhotoUrl: data.groomPhoto || '/default-groom.jpg',
        parents: {
          brideParents: data.brideParents || 'Bpk. ... & Ibu ...',
          groomParents: data.groomParents || 'Bpk. ... & Ibu ...'
        },
        isSingleEvent: data.isSingleEvent,
        akadLocation: data.isSingleEvent 
           ? { dateTime: data.dateTime, mapUrl: data.map, description: data.mapDesc }
           : { dateTime: data.akadDateTime, mapUrl: data.akadMap, description: data.akadDesc },
        resepsiLocation: data.isSingleEvent
           ? { dateTime: data.dateTime, mapUrl: data.map, description: data.mapDesc }
           : { dateTime: data.resepsiDateTime, mapUrl: data.resepsiMap, description: data.resepsiDesc },
        ...resolveQuoteForSave(data),
        loveStory: (data.loveStories || []).map(s => ({ title: s.title, date: s.date, description: s.description, image: s.photo })),
        galleryImages: (data.gallery || []).map(img => img.preview),
        giftDeliveryAddress: [...(data.giftAddresses || [])],
        bankAccounts: (data.bankAccounts || []).map(b => ({ bankName: b.bankName, accountNumber: b.accountNumber, accountName: b.accountName, bankLogo: b.bankLogo })),
        eWalletLink: (data.eWalletLink || []).map(w => ({ wallet_provider: w.wallet_provider, wallet_number: w.wallet_number, wallet_image: w.wallet_image })),
        dressCode: data.dressCode,
        healthProtocol: data.healthProtocol,
        extendedFamily: data.extendedFamilyText ? data.extendedFamilyText.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [],
        turutMengundang: data.extendedFamilyText,
        menu: { title: 'Menu Makanan', items: (data.foodList || []).map(f => ({ name: f })) },
        footerText: data.footerText,
        liveStreamingLink: data.liveStreamingLink,
        musicChoice: data.music === 'custom' ? data.musicPreview : data.music,
        audioStart: Number(data.audioStart) || 0,
        audioEnd: Number(data.audioEnd) || 0,
        videoPrewedding: noirVideoPreview.value || data.youtubeUrl || '',
        designSettings: {
          fontFamily: data.designSettings?.fontFamily,
          titleScale: data.designSettings?.titleScale,
          backgroundType: data.designSettings?.backgroundType,
          backgroundUrl: noirBackgroundPreview.value || data.designSettings?.backgroundUrl,
          heroCopy: data.designSettings?.heroCopy,
          eventStartTime: data.designSettings?.eventStartTime,
          eventEndTime: data.designSettings?.eventEndTime,
          hideRundown: !!data.designSettings?.hideRundown,
        },
        selectedSections: getCanonicalSelectedSections()
      }
    }
    const sanitizedPayload = JSON.parse(JSON.stringify(rawPayload))
    if (previewIframe.value && previewIframe.value.contentWindow) {
      previewIframe.value.contentWindow.postMessage(sanitizedPayload, '*')
    }
    if (mobilePreviewIframe.value && mobilePreviewIframe.value.contentWindow) {
      mobilePreviewIframe.value.contentWindow.postMessage(sanitizedPayload, '*')
    }
  } catch (err) {}
}

const cleanForDraft = (obj) => {
  if (obj === null || obj === undefined) return obj
  if (obj instanceof File || obj instanceof Blob) return null
  if (Array.isArray(obj)) {
    return obj.map(cleanForDraft)
  }
  if (typeof obj === 'object') {
    const cleaned = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.toLowerCase().includes('file')) {
          cleaned[key] = null
        } else {
          cleaned[key] = cleanForDraft(obj[key])
        }
      }
    }
    return cleaned
  }
  return obj
}

const deepMerge = (target, source) => {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {}
        deepMerge(target[key], source[key])
      } else if (Array.isArray(source[key])) {
        target[key] = JSON.parse(JSON.stringify(source[key]))
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}

const cancelLogin = () => {
  showLogin.value = false
  localStorage.removeItem('pending_save_after_login')
}

watch(isAuthenticated, (newVal) => {
  if (newVal && localStorage.getItem('pending_save_after_login') === 'true') {
     localStorage.removeItem('pending_save_after_login')
     showLogin.value = false
     saveAndPreview()
  }
})

const saveDraft = (data) => {
  try {
    const cleanedFormData = cleanForDraft(data)
    const draftData = { formData: cleanedFormData, sections: { ...sections.value }, timestamp: Date.now() }
    const draftKey = route.params.id ? `invitation_draft_${route.params.id}` : 'invitation_form_draft'
    localStorage.setItem(draftKey, JSON.stringify(draftData))
    if (!route.params.id) {
      localStorage.setItem('selectedSections', JSON.stringify(Object.keys(sections.value).filter(k => sections.value[k])))
    }
  } catch (e) {}
}


const clearDraft = () => {
  localStorage.removeItem('invitation_form_draft')
  if (route.params.id) localStorage.removeItem(`invitation_draft_${route.params.id}`)
  localStorage.removeItem('selectedSections')
  localStorage.removeItem('nova_draft')
}

// Watch both formData and sections to sync & save draft
watch(formData, (newVal) => {
  if (isHydrating.value) return
  hasUnsavedChanges.value = true
  syncDataToPreview(newVal)
  saveDraft(newVal)
}, { deep: true })

watch(sections, (newVal) => {
  if (isHydrating.value) return
  hasUnsavedChanges.value = true
  syncDataToPreview(formData.value)
  saveDraft(formData.value)
}, { deep: true })


const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault();
    e.returnValue = '';
  }
}


onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('Ada perubahan yang belum disimpan. Yakin ingin keluar?')
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload)

  const template = localStorage.getItem('selectedTemplate')
  
  if (!template && !route.params.id) {
    router.push('/templates')
    return
  }

  // Load preset audio options
  try {
    const res = await fetchPublicAudio()
    audioList.value = Array.isArray(res) ? res : (res?.data || [])
  } catch {}

  // Parse template design info
  if (template) {
    try {
      selectedTemplate.value = JSON.parse(template) || {}

      // Carry pricing tier chosen on the homepage (new invitations only; edit mode loads its own package).
      if (!route.params.id) {
        const chosenPkg = localStorage.getItem('selectedPackage')
        if (chosenPkg) formData.value.package = chosenPkg
      }


      // Initialize sections selection options
      if (selectedTemplate.value?.sections && Array.isArray(selectedTemplate.value.sections) && selectedTemplate.value.sections.length > 0) {
        const newOptions = {}
        const enabledKeys = []
        
        selectedTemplate.value.sections.forEach(s => {
          if (s.is_enabled) {
            const sectionKey = s.section?.key || s.key
            const sectionLabel = s.section?.label || s.label || sectionOptionsLabelMap[sectionKey] || sectionKey
            if (sectionKey) {
              newOptions[sectionKey] = sectionLabel
              enabledKeys.push(sectionKey)
            }
          }
        })
        sectionOptions.value = newOptions
        
        // Setup initial default sections
        enabledKeys.forEach(k => {
          sections.value[k] = defaultCommonSections.includes(k)
        })
      } else {
        try {
          const apiSections = await getSections()
          if (Array.isArray(apiSections) && apiSections.length > 0) {
            const newOptions = {}
            apiSections.forEach(s => {
              newOptions[s.key] = s.label || sectionOptionsLabelMap[s.key] || s.key
            })
            sectionOptions.value = newOptions
          } else {
            sectionOptions.value = { ...sectionOptionsLabelMap }
          }
        } catch {
          sectionOptions.value = { ...sectionOptionsLabelMap }
        }
        
        Object.keys(sectionOptions.value).forEach(k => {
          sections.value[k] = defaultCommonSections.includes(k)
        })
      }
    } catch {
      router.push('/templates')
      return
    }
  }

  // Read stashed / selected sections
  const storedSections = localStorage.getItem('selectedSections')
  if (storedSections) {
    try {
      const activeSections = JSON.parse(storedSections)
      activeSections.forEach(k => {
        sections.value[k] = true
      })
    } catch {}
  }

  // Load General Draft
  const generalDraft = localStorage.getItem('invitation_form_draft')
  if (generalDraft && !route.params.id) {
     try {
        const draft = JSON.parse(generalDraft)
        if (draft && draft.timestamp) {
           const age = (Date.now() - draft.timestamp) / (1000 * 60 * 60)
           if (age < 24) {
              if (confirm("Anda memiliki draf pengisian yang belum disimpan. Lanjutkan?")) {
                 deepMerge(formData.value, draft.formData)
                 if (draft.sections) {
                   Object.keys(draft.sections).forEach(k => {
                     sections.value[k] = draft.sections[k]
                   })
                 }
                 toast.success("Draf berhasil dipulihkan!")
              } else { clearDraft() }
           } else { clearDraft() }
        } else { clearDraft() }
     } catch (e) {
        console.error("Failed to parse general draft:", e)
        clearDraft()
     }
  }

  // Process Edit Mode if ID present in route params
  if (route.params.id) await handleEditMode(route.params.id)
  isHydrating.value = false
  await nextTick()

  // Fallback timeout to clear loading screen if something fails or race condition occurs
  setTimeout(() => {
     if (isPreviewLoading.value) {
        console.warn("Preview load timeout fallback triggered.")
        isPreviewLoading.value = false
        syncDataToPreview(formData.value)
     }
  }, 4000)

  if (typeof window !== 'undefined' && window.ResizeObserver) {
    resizeObserver = new window.ResizeObserver(() => {
      updateScale()
    })
    if (previewArea.value) {
      resizeObserver.observe(previewArea.value)
    }
  }
  window.addEventListener('resize', updateScale)

  // Handle pending save after login (e.g. after Google OAuth callback redirect)
  if (isAuthenticated.value && localStorage.getItem('pending_save_after_login') === 'true') {
     localStorage.removeItem('pending_save_after_login')
     setTimeout(() => {
        saveAndPreview()
     }, 1000)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (noirBackgroundPreview.value.startsWith('blob:')) URL.revokeObjectURL(noirBackgroundPreview.value)
  if (noirVideoPreview.value.startsWith('blob:')) URL.revokeObjectURL(noirVideoPreview.value)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', updateScale)
  if (typeof window !== 'undefined') {
    window.removeEventListener('message', handleMessageEvent)
  }
})

async function handleEditMode(id) {
  try {
     const res = await getInvitationById(id)
     const data = res.data || res
     mapPayloadToFormData(data)

     const draftKey = `invitation_draft_${id}`
     const savedDraft = localStorage.getItem(draftKey)
     let restoredDraft = false
     if (savedDraft) {
        try {
           const draft = JSON.parse(savedDraft)
           const ageInDays = (Date.now() - Number(draft.timestamp || 0)) / (1000 * 60 * 60 * 24)
           if (draft.formData && ageInDays < 30) {
              deepMerge(formData.value, draft.formData)
              if (draft.sections && typeof draft.sections === 'object') {
                 Object.keys(draft.sections).forEach(key => {
                    sections.value[key] = draft.sections[key]
                 })
              }
              restoredDraft = true
              toast.info('Perubahan terakhir dipulihkan dari draf lokal.')
           } else {
              localStorage.removeItem(draftKey)
           }
        } catch {
           localStorage.removeItem(draftKey)
        }
     }
     await nextTick()
     hasUnsavedChanges.value = restoredDraft
  } catch (error) {
     console.error("Failed to load invitation", error)
     if (error.response?.status === 403) {
        toast.error("Anda tidak memiliki akses ke undangan ini.")
        router.push('/dashboard')
     } else if (error.response?.status === 404) {
        toast.error("Undangan tidak ditemukan.")
        router.push('/dashboard')
     } else {
        toast.error("Gagal memuat data undangan.")
        router.push('/dashboard')
     }
  }
}

// Convert ISO UTC dates to input format (local time YYYY-MM-DDTHH:mm)
const formatISOToLocalInput = (isoString) => {
   if (!isoString) return ''
   const d = new Date(isoString)
   if (isNaN(d.getTime())) return ''
   const pad = (n) => n.toString().padStart(2, '0')
   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function mapPayloadToFormData(payload) {
   // Resolve template info
   const template = payload.templateDesign || payload.content?.templateDesign || {}
   const content = payload.content || {}
   const templateDesignId = payload.templateDesignId || content.templateDesignId || template.id
   const templateName = template.name || payload.templateName || content.templateName || ''
   selectedTemplate.value = {
     ...selectedTemplate.value,
     ...template,
     id: templateDesignId,
     name: templateName,
     slug: template.slug || payload.template_slug || content.template_slug || normalizeTemplateSlug(templateName)
   }

   if (Object.keys(sectionOptions.value).length === 0) {
      const templateSections = Array.isArray(template.sections) ? template.sections : []
      sectionOptions.value = templateSections.length
         ? Object.fromEntries(templateSections.filter(s => s.is_enabled !== false).map(s => {
              const key = s.section?.key || s.key
              return [key, s.section?.label || s.label || sectionOptionsLabelMap[key] || key]
           }).filter(([key]) => key))
         : { ...sectionOptionsLabelMap }
   }
   if (payload.slug === 'refda-tiara') sectionOptions.value.video = sectionOptionsLabelMap.video

   const activeSections = Array.isArray(payload.selectedSections)
      ? payload.selectedSections
      : Array.isArray(payload.content?.selectedSections)
         ? payload.content.selectedSections
         : null

   if (!activeSections && payload.slug === 'refda-tiara') {
      Object.keys(sectionOptions.value).forEach(key => { sections.value[key] = true })
   }

   if (activeSections) {
      // Clear current sections first
      Object.keys(sections.value).forEach(k => sections.value[k] = false)
      
      activeSections.forEach(key => {
         sections.value[key] = true
      })

      // Normalize keys for compatibility
      const normalizationMap = {
         'digital-envelope': 'gift',
         'loveStory': 'love-story',
         'foodList': 'menu',
         'turut-mengundang': 'extended-family',
         'video-prewedding': 'video',
         'live-stream': 'live-streaming'
      }

      Object.keys(normalizationMap).forEach(oldKey => {
         if (sections.value[oldKey]) {
            sections.value[normalizationMap[oldKey]] = true
         }
      })
   }

   formData.value.title = payload.title || ''
   formData.value.slug = payload.slug || ''
   formData.value.designSettings = {
     fontFamily: 'Cormorant Garamond',
     titleScale: 1,
     backgroundType: 'image',
     backgroundUrl: '',
     backgroundFile: null,
     heroCopy: '',
     eventStartTime: '',
     eventEndTime: '',
     hideRundown: false,
     ...(payload.designSettings || content.designSettings || {}),
     backgroundFile: null,
   }
   noirBackgroundPreview.value = formData.value.designSettings.backgroundUrl || ''
   if (formData.value.slug === 'refda-tiara') {
     selectedTemplate.value = {
       ...selectedTemplate.value,
       name: 'Noir Celestial',
       slug: 'refda-tiara-noir',
     }
   }
   formData.value.subdomain = payload.subdomain || payload.content?.subdomain || ''
   formData.value.package = payload.package || payload.content?.package || 'basic'
   formData.value.brideName = payload.brideName || ''
   formData.value.bridePhoto = payload.slug === 'refda-tiara' && /\/default-bride\./i.test(payload.bridePhotoUrl || '')
      ? '/assets/images/refda-tiara/tiara.png' : payload.bridePhotoUrl || ''
   formData.value.groomName = payload.groomName || ''
   formData.value.groomPhoto = payload.slug === 'refda-tiara' && /\/default-groom\./i.test(payload.groomPhotoUrl || '')
      ? '/assets/images/refda-tiara/refda.png' : payload.groomPhotoUrl || ''
   formData.value.photoCouple = payload.slug === 'refda-tiara' && /\/default-couple\./i.test(payload.photoCoupleUrl || '')
      ? '' : payload.photoCoupleUrl || ''
   if (payload.parents) {
      formData.value.brideParents = payload.parents.brideParents || ''
      formData.value.groomParents = payload.parents.groomParents || ''
   } else {
      formData.value.brideParents = payload.brideParents || ''
      formData.value.groomParents = payload.groomParents || ''
   }
   formData.value.isSingleEvent = payload.isSingleEvent
   if (payload.galleryImages && Array.isArray(payload.galleryImages)) {
      formData.value.gallery = payload.galleryImages.map(url => ({ preview: url, file: null }))
   }
   formData.value.quoteType = payload.quoteType || 'default'
   formData.value.quote = payload.quoteText || ''
   formData.value.quoteSource = payload.quoteSource || ''
   formData.value.religion = payload.religion || ''

   const akad = payload.akadLocation || {}
   const resepsi = payload.resepsiLocation || {}
   if (payload.isSingleEvent) {
      formData.value.dateTime = formatISOToLocalInput(akad.dateTime)
      formData.value.map = akad.mapUrl || ''
      formData.value.mapDesc = akad.description || ''
   } else {
      formData.value.akadDateTime = formatISOToLocalInput(akad.dateTime)
      formData.value.akadMap = akad.mapUrl || ''
      formData.value.akadDesc = akad.description || ''
      formData.value.resepsiDateTime = formatISOToLocalInput(resepsi.dateTime)
      formData.value.resepsiMap = resepsi.mapUrl || ''
      formData.value.resepsiDesc = resepsi.description || ''
   }
   if (payload.loveStory && Array.isArray(payload.loveStory)) {
      formData.value.loveStories = payload.loveStory.map(s => ({ title: s.title || '', date: s.date || '', description: s.description || s.content || '', photo: s.image || s.photo || '', photoFile: null, isOpen: false }))
   }
   formData.value.youtubeUrl = payload.videoPrewedding || ''
   formData.value.sosmedBride = { instagram: payload.socialMediaBrides?.instagram || '', tiktok: payload.socialMediaBrides?.tiktok || '', youtube: payload.socialMediaBrides?.youtube || '', otherSocial: payload.socialMediaBrides?.otherSocial || '' }
   formData.value.sosmedGroom = { instagram: payload.socialMediaGroom?.instagram || '', tiktok: payload.socialMediaGroom?.tiktok || '', youtube: payload.socialMediaGroom?.youtube || '', otherSocial: payload.socialMediaGroom?.otherSocial || '' }
   formData.value.liveStreamingLink = payload.liveStreamingLink || payload.liveStreamingUrl || ''
   if (payload.menu?.items) formData.value.foodList = payload.menu.items.map(i => i.name || i)
   formData.value.giftAddresses = Array.isArray(payload.giftDeliveryAddress) ? payload.giftDeliveryAddress : (payload.giftDeliveryAddress ? [payload.giftDeliveryAddress] : [])
   formData.value.eWalletLink = payload.eWalletLink || []
   formData.value.bankAccounts = payload.bankAccounts || []
   formData.value.dressCode = payload.dressCode || ''
   formData.value.healthProtocol = payload.healthProtocol !== false
   
   if (payload.extendedFamily && Array.isArray(payload.extendedFamily)) {
      formData.value.extendedFamilyText = payload.extendedFamily.join(', ')
   } else if (typeof payload.extendedFamily === 'string') {
      formData.value.extendedFamilyText = payload.extendedFamily
   } else if (payload.turutMengundang) {
      formData.value.extendedFamilyText = payload.turutMengundang
   }

   if (payload.isCustomMusic) {
      formData.value.music = 'custom'
      formData.value.musicPreview = payload.musicChoice
   } else { 
      formData.value.music = payload.musicChoice || '' 
   }
   formData.value.audioStart = Number(payload.audioStart) || 0
   formData.value.audioEnd = Number(payload.audioEnd) || 0
   
   formData.value.wishesState = payload.enableGuestMessage !== false
   formData.value.rsvpState = payload.enableCover !== false // standard mapping mapping
}

function normalizeTemplateSlug(name) {
   return String(name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function getSelectedTemplateDesignId() {
   return selectedTemplate.value.id || null
}

function validateField(field) {
   let message = ''
   const data = formData.value
   if (field === 'brideName' && !data.brideName?.trim()) message = 'Nama mempelai wanita wajib diisi'
   if (field === 'brideParents' && !data.brideParents?.trim()) message = 'Nama orang tua wanita wajib diisi'
   if (field === 'groomName' && !data.groomName?.trim()) message = 'Nama mempelai pria wajib diisi'
   if (field === 'groomParents' && !data.groomParents?.trim()) message = 'Nama orang tua pria wajib diisi'
   if (field === 'title' && !data.title?.trim()) message = 'Judul / Slug undangan wajib diisi'
   validationErrors.value[field] = message
   return !message
}

function validateForm() {
   validationErrors.value = {}
   const data = formData.value
   let isValid = true

   // Basic fields validation
   if (!data.brideName?.trim()) { validationErrors.value.brideName = 'Nama mempelai wanita wajib diisi'; isValid = false }
   if (!data.brideParents?.trim()) { validationErrors.value.brideParents = 'Nama orang tua wanita wajib diisi'; isValid = false }
   if (!data.bridePhoto && !data.bridePhotoFile) { validationErrors.value.bridePhoto = 'Foto mempelai wanita wajib diisi'; isValid = false }
   if (!data.groomName?.trim()) { validationErrors.value.groomName = 'Nama mempelai pria wajib diisi'; isValid = false }
   if (!data.groomParents?.trim()) { validationErrors.value.groomParents = 'Nama orang tua pria wajib diisi'; isValid = false }
   if (!data.groomPhoto && !data.groomPhotoFile) { validationErrors.value.groomPhoto = 'Foto mempelai pria wajib diisi'; isValid = false }
   if (!data.title?.trim()) { validationErrors.value.title = 'Judul undangan wajib diisi'; isValid = false }

   // Events validation
   if (data.isSingleEvent === null) { 
     validationErrors.value.isSingleEvent = 'Format acara wajib dipilih'
     isValid = false 
   } else if (data.isSingleEvent === true) {
      if (!data.dateTime) { validationErrors.value.dateTime = 'Waktu acara wajib diisi'; isValid = false }
      if (!data.map) { validationErrors.value.map = 'Link Google Maps wajib diisi'; isValid = false }
   } else if (data.isSingleEvent === false) {
      if (!data.akadDateTime) { validationErrors.value.akadDateTime = 'Waktu akad wajib diisi'; isValid = false }
      if (!data.akadMap) { validationErrors.value.akadMap = 'Link Maps akad wajib diisi'; isValid = false }
      if (!data.resepsiDateTime) { validationErrors.value.resepsiDateTime = 'Waktu resepsi wajib diisi'; isValid = false }
      if (!data.resepsiMap) { validationErrors.value.resepsiMap = 'Link Maps resepsi wajib diisi'; isValid = false }
   }

   // Cover photo validation
   if (!isTiaraNoirInvitation.value && !data.photoCouple && !data.photoCoupleFile) {
     validationErrors.value.photoCouple = 'Foto sampul (cover) wajib diisi'
     isValid = false 
   }

   if (!isValid) {
     toast.warning("Mohon lengkapi data yang wajib diisi terlebih dahulu")
   }
   return isValid
}

// Exit validation check
function confirmExit() {
  if (confirm("Keluar dari Studio? Draf pengisian Anda akan tetap disimpan secara lokal.")) {
    router.push('/dashboard')
  }
}

function goBackToTemplates() {
  if (confirm("Ganti template akan menyetel ulang beberapa pengaturan fitur khusus. Lanjutkan?")) {
    clearDraft()
    router.push('/templates')
  }
}

// Media upload and handlers
function addLoveStory() { formData.value.loveStories.push({ title: '', date: '', description: '', photo: '', photoFile: null, isOpen: true }) }
function removeLoveStory(index) { formData.value.loveStories.splice(index, 1) }
async function handleLoveStoryUpload(event, index) {
   const file = event.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.loveStories[index].photo = reader.result; formData.value.loveStories[index].photoFile = file }; reader.readAsDataURL(file)
}
function addFood() { formData.value.foodList.push('') }
function removeFood(index) { formData.value.foodList.splice(index, 1) }
function addGiftAddress() { formData.value.giftAddresses.push('') }
function removeGiftAddress(index) { formData.value.giftAddresses.splice(index, 1) }
function addWallet() { formData.value.eWalletLink.push({ wallet_provider: '', wallet_number: '', wallet_image: '', wallet_image_file: null }) }
function removeWallet(index) { formData.value.eWalletLink.splice(index, 1) }
async function handleWalletUpload(event, index) {
   const file = event.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.eWalletLink[index].wallet_image = reader.result; formData.value.eWalletLink[index].wallet_image_file = file }; reader.readAsDataURL(file)
}
function addBank() { formData.value.bankAccounts.push({ bankName: '', accountNumber: '', accountName: '', bankLogo: '', bankLogoFile: null }) }
function removeBank(index) { formData.value.bankAccounts.splice(index, 1) }
async function handleBankUpload(event, index) {
   const file = event.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.bankAccounts[index].bankLogo = reader.result; formData.value.bankAccounts[index].bankLogoFile = file }; reader.readAsDataURL(file)
}

// Image crop processing downscaling helper
async function downscaleImage(dataUrl, maxWidth = 1200) {
   return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
         const canvas = document.createElement('canvas'); let width = img.width; let height = img.height
         if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth }
         canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height)
         resolve(canvas.toDataURL('image/jpeg', 0.9))
      };
      img.onerror = () => {
         resolve(dataUrl)
      };
      img.src = dataUrl
   })
}

async function handleBridePhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = async () => { 
      const optimizedImage = await downscaleImage(reader.result)
      cropper.value = { show: true, image: optimizedImage, aspectRatio: 3/4, targetField: 'bride' }
   }; reader.readAsDataURL(file); e.target.value = ''
}
async function handleGroomPhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = async () => { 
      const optimizedImage = await downscaleImage(reader.result)
      cropper.value = { show: true, image: optimizedImage, aspectRatio: 3/4, targetField: 'groom' }
   }; reader.readAsDataURL(file); e.target.value = ''
}
async function handleCouplePhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = async () => { 
      const optimizedImage = await downscaleImage(reader.result)
      cropper.value = { show: true, image: optimizedImage, aspectRatio: null, targetField: 'couple' }
   }; reader.readAsDataURL(file); e.target.value = ''
}

function reopenCropperForBride() {
   if (!formData.value.bridePhoto) return
   cropper.value = { show: true, image: formData.value.bridePhoto, aspectRatio: 3/4, targetField: 'bride', targetIndex: null }
}

function reopenCropperForGroom() {
   if (!formData.value.groomPhoto) return
   cropper.value = { show: true, image: formData.value.groomPhoto, aspectRatio: 3/4, targetField: 'groom', targetIndex: null }
}

function reopenCropperForCouple() {
   if (!formData.value.photoCouple) return
   cropper.value = { show: true, image: formData.value.photoCouple, aspectRatio: null, targetField: 'couple', targetIndex: null }
}

function reopenCropperForDenah() {
   if (!formData.value.denah) return
   cropper.value = { show: true, image: formData.value.denah, aspectRatio: null, targetField: 'denah', targetIndex: null }
}

function reopenCropperForGallery(index) {
   const item = formData.value.gallery[index]
   if (!item?.preview) return
   cropper.value = { show: true, image: item.preview, aspectRatio: null, targetField: 'gallery', targetIndex: index }
}

function reopenCropperForLoveStory(index) {
   const story = formData.value.loveStories[index]
   if (!story?.photo) return
   cropper.value = { show: true, image: story.photo, aspectRatio: null, targetField: 'loveStory', targetIndex: index }
}

function reopenCropperForWallet(index) {
   const wallet = formData.value.eWalletLink[index]
   if (!wallet?.wallet_image) return
   cropper.value = { show: true, image: wallet.wallet_image, aspectRatio: null, targetField: 'wallet', targetIndex: index }
}

function reopenCropperForBank(index) {
   const bank = formData.value.bankAccounts[index]
   if (!bank?.bankLogo) return
   cropper.value = { show: true, image: bank.bankLogo, aspectRatio: null, targetField: 'bank', targetIndex: index }
}

function onCropComplete({ blob, preview }) {
   const field = cropper.value.targetField
   const idx = cropper.value.targetIndex
   if (field === 'bride') {
      formData.value.bridePhoto = preview
      formData.value.bridePhotoFile = new File([blob], 'bride.webp', { type: 'image/webp' })
      validateField('bridePhoto')
   } else if (field === 'groom') {
      formData.value.groomPhoto = preview
      formData.value.groomPhotoFile = new File([blob], 'groom.webp', { type: 'image/webp' })
      validateField('groomPhoto')
   } else if (field === 'couple') {
      formData.value.photoCouple = preview
      formData.value.photoCoupleFile = new File([blob], 'couple.webp', { type: 'image/webp' })
      validateField('photoCouple')
   } else if (field === 'denah') {
      formData.value.denah = preview
      formData.value.denahFile = new File([blob], 'denah.webp', { type: 'image/webp' })
   } else if (field === 'gallery' && idx !== null && idx !== undefined && formData.value.gallery[idx]) {
      formData.value.gallery[idx].preview = preview
      formData.value.gallery[idx].file = new File([blob], `gallery-${idx}.webp`, { type: 'image/webp' })
   } else if (field === 'loveStory' && idx !== null && idx !== undefined && formData.value.loveStories[idx]) {
      formData.value.loveStories[idx].photo = preview
      formData.value.loveStories[idx].photoFile = new File([blob], `story-${idx}.webp`, { type: 'image/webp' })
   } else if (field === 'wallet' && idx !== null && idx !== undefined && formData.value.eWalletLink[idx]) {
      formData.value.eWalletLink[idx].wallet_image = preview
      formData.value.eWalletLink[idx].wallet_image_file = new File([blob], `wallet-${idx}.webp`, { type: 'image/webp' })
   } else if (field === 'bank' && idx !== null && idx !== undefined && formData.value.bankAccounts[idx]) {
      formData.value.bankAccounts[idx].bankLogo = preview
      formData.value.bankAccounts[idx].bankLogoFile = new File([blob], `bank-${idx}.webp`, { type: 'image/webp' })
   }
   cropper.value.show = false
}

function handleGalleryUpload(e) {
   const limit = pkgFeatures.value.galleryLimit
   if (!pkgFeatures.value.gallery) {
      toast.warning('Galeri foto hanya tersedia untuk paket Premium & Eksklusif.')
      e.target.value = ''
      return
   }
   let files = Array.from(e.target.files || [])
   const remaining = limit - formData.value.gallery.length
   if (files.length > remaining) {
      files = files.slice(0, Math.max(0, remaining))
      toast.warning(`Maksimal ${limit} foto untuk paket ini.`)
   }
   files.forEach(file => { const reader = new FileReader(); reader.onload = () => formData.value.gallery.push({ preview: reader.result, file }); reader.readAsDataURL(file) })
   e.target.value = ''
}
function removeGalleryImage(i) { formData.value.gallery.splice(i, 1) }

async function handleDenahUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = async () => {
      const optimizedImage = await downscaleImage(reader.result)
      cropper.value = { show: true, image: optimizedImage, aspectRatio: null, targetField: 'denah', targetIndex: null }
   }; reader.readAsDataURL(file); e.target.value = ''
}

async function handleMusicUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   if (file.size > 10 * 1024 * 1024) { toast.error("File musik terlalu besar (Maks 10MB)"); return }
   const reader = new FileReader(); reader.onload = () => { formData.value.musicPreview = reader.result; formData.value.musicFile = file }; reader.readAsDataURL(file)
}

function handleNoirBackgroundUpload(e) {
   const file = e.target.files?.[0]
   if (!file) return
   const isVideo = file.type.startsWith('video/') || /\.(mp4|webm)$/i.test(file.name)
   const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name)
   if (!isVideo && !isImage) {
      toast.error('Pilih foto JPG/PNG/WebP atau video MP4/WebM.')
      e.target.value = ''
      return
   }
   if (file.size > 25 * 1024 * 1024) {
      toast.error('Ukuran media latar maksimal 25 MB.')
      e.target.value = ''
      return
   }
   if (noirBackgroundPreview.value.startsWith('blob:')) URL.revokeObjectURL(noirBackgroundPreview.value)
   formData.value.designSettings.backgroundType = isVideo ? 'video' : 'image'
   formData.value.designSettings.backgroundUrl = ''
   formData.value.designSettings.backgroundFile = file
   noirBackgroundPreview.value = URL.createObjectURL(file)
   e.target.value = ''
}

function handleNoirBackgroundTypeChange() {
   clearNoirBackground()
}

function clearNoirBackground() {
   if (noirBackgroundPreview.value.startsWith('blob:')) URL.revokeObjectURL(noirBackgroundPreview.value)
   noirBackgroundPreview.value = ''
   formData.value.designSettings.backgroundUrl = ''
   formData.value.designSettings.backgroundFile = null
}

async function handlePreweddingVideoUpload(event) {
   const file = event.target.files?.[0]
   event.target.value = ''
   if (!file) return
   if (!['video/mp4', 'video/webm'].includes(file.type) || file.size > 25 * 1024 * 1024) {
      toast.error('Pilih video MP4/WebM berukuran maksimal 25 MB.')
      return
   }
   if (noirVideoPreview.value.startsWith('blob:')) URL.revokeObjectURL(noirVideoPreview.value)
   noirVideoPreview.value = URL.createObjectURL(file)
   isPreweddingUploading.value = true
   try {
      const result = await uploadFileApi(file)
      if (!result.fileUrl) throw new Error('URL video tidak diterima dari server.')
      URL.revokeObjectURL(noirVideoPreview.value)
      noirVideoPreview.value = ''
      formData.value.youtubeUrl = result.fileUrl
      sections.value.video = true
      toast.success('Video terunggah. Simpan undangan untuk menayangkannya.')
   } catch (error) {
      URL.revokeObjectURL(noirVideoPreview.value)
      noirVideoPreview.value = ''
      toast.error(error.message || 'Gagal mengunggah video.')
   } finally {
      isPreweddingUploading.value = false
   }
}

// Convert a base64 data: URL back into a File so it can be uploaded.
function dataUrlToFile(dataUrl, baseName) {
   const [header, b64] = dataUrl.split(',')
   const mime = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream'
   const bin = atob(b64)
   const bytes = new Uint8Array(bin.length)
   for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
   const ext = mime.split('/')[1]?.split('+')[0] || 'bin'
   return new File([bytes], `${baseName}.${ext}`, { type: mime })
}

// File object wins; otherwise a leftover data: URL (e.g. draft restored after login
// reload drops File objects) is converted so it never reaches the API as base64.
function fileOrDataUrl(file, value, baseName) {
   if (file) return file
   if (typeof value === 'string' && value.startsWith('data:')) return dataUrlToFile(value, baseName)
   return null
}

// Parallel files upload progress handler
async function uploadAllFiles() {
   const filesToUpload = []
   const add = (file, value, baseName, setter, name) => {
      const f = fileOrDataUrl(file, value, baseName)
      if (f) filesToUpload.push({ file: f, setter, name })
   }
   const fd = formData.value
   add(fd.bridePhotoFile, fd.bridePhoto, 'bride', (url) => formData.value.bridePhoto = url, 'Foto Mempelai Wanita')
   add(fd.groomPhotoFile, fd.groomPhoto, 'groom', (url) => formData.value.groomPhoto = url, 'Foto Mempelai Pria')
   add(fd.photoCoupleFile, fd.photoCouple, 'couple', (url) => formData.value.photoCouple = url, 'Foto Sampul')
   add(fd.denahFile, fd.denah, 'denah', (url) => formData.value.denah = url, 'Foto Denah')
   if (fd.designSettings.backgroundFile) {
      filesToUpload.push({
        file: fd.designSettings.backgroundFile,
        setter: (url) => {
          formData.value.designSettings.backgroundUrl = url
          formData.value.designSettings.backgroundFile = null
          noirBackgroundPreview.value = url
        },
        name: 'Latar Sampul',
      })
   }
   if (fd.musicFile) filesToUpload.push({ file: fd.musicFile, setter: (url) => formData.value.music = url, name: 'File Musik' })
   else if (fd.music === 'custom') add(null, fd.musicPreview, 'music', (url) => formData.value.music = url, 'File Musik')
   fd.gallery.forEach((item, i) => add(item.file, item.preview, `gallery-${i}`, (url) => formData.value.gallery[i].preview = url, `Galeri Foto ${i+1}`))
   fd.loveStories.forEach((s, i) => add(s.photoFile, s.photo, `story-${i}`, (url) => formData.value.loveStories[i].photo = url, `Love Story Photo ${i+1}`))
   fd.eWalletLink.forEach((w, i) => add(w.wallet_image_file, w.wallet_image, `wallet-${i}`, (url) => formData.value.eWalletLink[i].wallet_image = url, `E-Wallet QR ${i+1}`))
   fd.bankAccounts.forEach((b, i) => add(b.bankLogoFile, b.bankLogo, `bank-${i}`, (url) => formData.value.bankAccounts[i].bankLogo = url, `Bank Logo ${i+1}`))
   if (filesToUpload.length === 0) return
   
   uploadProgress.value.show = true; let uploadedCount = 0
   for (const item of filesToUpload) {
      uploadProgress.value.currentFile = item.name; uploadProgress.value.message = `Mengupload ${item.name}...`
      try { 
        const res = await uploadFileApi(item.file)
        item.setter(res.fileUrl)
        uploadedCount++
        uploadProgress.value.percentage = Math.round((uploadedCount / filesToUpload.length) * 100) 
      }
      catch (err) { 
        uploadProgress.value.show = false
        throw err 
      }
   }
   uploadProgress.value.message = 'Semua file berhasil diupload!'; setTimeout(() => { uploadProgress.value.show = false }, 1000)
}

// Saving invitation API submit
async function saveAndPreview() {
   if (isPreweddingUploading.value) {
      toast.info('Tunggu video selesai diunggah sebelum menyimpan undangan.')
      return
   }
   if (!validateForm()) return
   // Block save if a custom subdomain was typed but isn't confirmed available
   if (formData.value.subdomain?.trim() && subdomainStatus.value.state !== 'available') {
      if (subdomainStatus.value.state === 'checking') {
         toast.warning('Tunggu pengecekan subdomain selesai.')
      } else {
         toast.error(subdomainStatus.value.message || 'Subdomain tidak tersedia. Ganti atau kosongkan.')
      }
      return
   }
   if (!isAuthenticated.value) {
      toast.warning("Silakan masuk atau daftar terlebih dahulu untuk menyimpan undangan.")
      localStorage.setItem('pending_save_after_login', 'true')
      showLogin.value = true
      return
   }
   if (!selectedTemplate.value.id && !route.params.id) { toast.error("Template belum dipilih. Mohon ulangi."); router.push('/templates'); return }
   isUploading.value = true
   try {
      await uploadAllFiles()

      // Enable gift section in payload if accounts / envelopes present
      if (formData.value.eWalletLink?.length > 0 || formData.value.bankAccounts?.length > 0 || formData.value.giftAddresses?.length > 0) {
         sections.value.gift = true
      }

      const payload = {
         title: formData.value.title, slug: formData.value.slug || formData.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
         brideName: formData.value.brideName, bridePhotoUrl: formData.value.bridePhoto, groomName: formData.value.groomName, groomPhotoUrl: formData.value.groomPhoto, photoCoupleUrl: formData.value.photoCouple, isSingleEvent: formData.value.isSingleEvent, mergeEvents: formData.value.isSingleEvent === true,
         parents: { brideParents: formData.value.brideParents || '', groomParents: formData.value.groomParents || '' },
         akadLocation: formData.value.isSingleEvent ? { dateTime: formData.value.dateTime ? new Date(formData.value.dateTime).toISOString() : '', mapUrl: formData.value.map || '', description: formData.value.mapDesc || '' } : { dateTime: formData.value.akadDateTime ? new Date(formData.value.akadDateTime).toISOString() : '', mapUrl: formData.value.akadMap || '', description: formData.value.akadDesc || '' },
         resepsiLocation: formData.value.isSingleEvent ? { dateTime: formData.value.dateTime ? new Date(formData.value.dateTime).toISOString() : '', mapUrl: formData.value.map || '', description: formData.value.mapDesc || '' } : { dateTime: formData.value.resepsiDateTime ? new Date(formData.value.resepsiDateTime).toISOString() : '', mapUrl: formData.value.resepsiMap || '', description: formData.value.resepsiDesc || '' },
         templateDesignId: getSelectedTemplateDesignId(), loveStory: formData.value.loveStories.map(s => ({ title: s.title, date: s.date, content: s.description || '', description: s.description || '', image: s.photo })),
         musicChoice: formData.value.music === 'custom' ? formData.value.musicPreview : (formData.value.music || 'default'), isCustomMusic: formData.value.music === 'custom' || Boolean(formData.value.music && !formData.value.music.startsWith('/audio/')),
         audioStart: formData.value.audioStart, audioEnd: formData.value.audioEnd, encryptedGuestName: formData.value.encryptedGuest === 'ya', galleryImages: formData.value.gallery.map(img => img.preview).filter(url => url && url.startsWith('http')),
         videoPrewedding: formData.value.youtubeUrl,
         giftDeliveryAddress: formData.value.giftAddresses, enableCover: true, healthProtocol: formData.value.healthProtocol, enableGuestMessage: formData.value.wishes === 'ya', selectedSections: getCanonicalSelectedSections(),
         dressCode: formData.value.dressCode, extendedFamily: formData.value.extendedFamilyText ? formData.value.extendedFamilyText.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [], turutMengundang: formData.value.extendedFamilyText, liveStreamingLink: formData.value.liveStreamingLink,
         footerText: formData.value.footerText, likes: formData.value.likes, menu: { title: 'Menu Makanan', items: formData.value.foodList.filter(n => n.trim()) },
         socialMediaBrides: { instagram: formData.value.sosmedBride.instagram, tiktok: formData.value.sosmedBride.tiktok, youtube: formData.value.sosmedBride.youtube, otherSocial: formData.value.sosmedBride.otherSocial },
         socialMediaGroom: { instagram: formData.value.sosmedGroom.instagram, tiktok: formData.value.sosmedGroom.tiktok, youtube: formData.value.sosmedGroom.youtube, otherSocial: formData.value.sosmedGroom.otherSocial },
         eWalletLink: formData.value.eWalletLink, bankAccounts: formData.value.bankAccounts, floorPlanImageUrl: formData.value.denah, quoteType: formData.value.quoteType, ...resolveQuoteForSave(formData.value), religion: formData.value.religion || null,
         designSettings: formData.value.designSettings,
         subdomain: formData.value.subdomain ? subdomainStatus.value.normalized : '',
         package: formData.value.package || 'basic'
      }
      
      const editId = route.params.id || localStorage.getItem('editInvitationId')
      let result
      
      if (editId) {
         try { 
           const res = await updateInvitation(editId, payload)
           result = res.data || res 
         }
         catch (error) { 
           if (!route.params.id && /not found|404/i.test(error?.message || '')) { 
             localStorage.removeItem('editInvitationId')
             const res = await createInvitation(payload)
             result = res.data || res
             localStorage.setItem('editInvitationId', result.id) 
           } else throw error 
         }
      } else { 
        const res = await createInvitation(payload)
        result = res.data || res
        localStorage.setItem('editInvitationId', result.id) 
      }
      
      analytics.trackAction('Studio Editor - Submitted', {
         invitation_id: result.id,
         invitation_title: result.title,
         template_id: result.templateDesignId,
         is_edit: !!editId
      })

      clearDraft()
      hasUnsavedChanges.value = false
      toast.success("Berhasil menyimpan data undangan!")
      router.push({ path: '/preview', query: { slug: result.slug } })
   } catch (error) { 
     console.error(error)
     const errorMsg = error.response?.data?.message || error.message || 'Gagal menyimpan data!'
     toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg) 
   }
   finally { isUploading.value = false }
}
</script>

<style scoped>
.form-label { display: block; font-weight: 700; color: #2D3748; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
.form-input { width: 100%; padding: 0.9rem 1.25rem; border-radius: 1.25rem; border: 2px solid #F7FAFC; background-color: #F7FAFC; transition: all 0.3s ease; font-size: 0.95rem; }
.form-input:focus { outline: none; border-color: #a47148; background-color: white; }
.form-error { color: #E53E3E; font-size: 0.7rem; font-weight: 600; margin-top: 0.5rem; }

.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-enter-active, .modal-leave-active { transition: all 0.3s ease-out; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
