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

      <div class="flex items-center gap-4">
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
                      {{ selectedTemplate.isPremium ? '💎 Premium' : '✨ Gratis' }}
                    </span>
                    <span class="text-xs font-bold text-mocha">{{ templatePrice }}</span>
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
                          <label for="bridePhoto" class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                            <img v-if="formData.bridePhoto" :src="formData.bridePhoto" class="w-full h-full object-cover" />
                            <div v-else class="flex flex-col items-center text-gray-400">
                              <i class="fa-solid fa-camera text-xl mb-1.5"></i>
                              <span class="text-[9px] font-bold uppercase tracking-widest">Pilih Foto</span>
                            </div>
                            <div v-if="formData.bridePhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span class="text-white text-[9px] font-bold uppercase tracking-widest">Ganti</span>
                            </div>
                          </label>
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
                          <label for="groomPhoto" class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                            <img v-if="formData.groomPhoto" :src="formData.groomPhoto" class="w-full h-full object-cover" />
                            <div v-else class="flex flex-col items-center text-gray-400">
                              <i class="fa-solid fa-camera text-xl mb-1.5"></i>
                              <span class="text-[9px] font-bold uppercase tracking-widest">Pilih Foto</span>
                            </div>
                            <div v-if="formData.groomPhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span class="text-white text-[9px] font-bold uppercase tracking-widest">Ganti</span>
                            </div>
                          </label>
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
              <QuoteSection v-if="sections.quote" :formData="formData" :defaultQuote="DEFAULT_QUOTE" />
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
              <div v-if="formData.isSingleEvent === false" class="grid md:grid-cols-2 gap-6">
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
                  <div data-field="photoCouple">
                    <label class="form-label">Foto Sampul Utama / Cover (Hero) <span class="text-red-500">*</span></label>
                    <div class="flex gap-4 items-end">
                      <label class="w-28 h-28 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 group">
                        <input type="file" accept="image/*" @change="handleCouplePhotoUpload" class="hidden" id="couplePhoto" />
                        <i class="fa-solid fa-plus text-gray-300 group-hover:text-mocha transition-colors"></i>
                      </label>
                      <div v-if="formData.photoCouple" class="relative group">
                        <img :src="formData.photoCouple" class="w-28 h-36 object-cover rounded-2xl shadow-md border-2 border-white" />
                        <button @click="formData.photoCouple = ''; formData.photoCoupleFile = null" class="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg">×</button>
                      </div>
                    </div>
                    <p v-if="validationErrors.photoCouple" class="form-error mt-2">{{ validationErrors.photoCouple }}</p>
                  </div>

                  <!-- denah upload (optional) -->
                  <div v-if="sections.denah" data-field="denah">
                    <label class="form-label">Denah Lokasi / Acara</label>
                    <div class="flex gap-4 items-end">
                      <label class="w-28 h-28 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 group">
                        <input type="file" accept="image/*" @change="handleDenahUpload" class="hidden" />
                        <i class="fa-solid fa-map-location-dot text-gray-300 group-hover:text-mocha transition-colors"></i>
                      </label>
                      <div v-if="formData.denah" class="relative group">
                        <img :src="formData.denah" class="w-28 h-28 object-cover rounded-2xl shadow-md border-2 border-white" />
                        <button @click="formData.denah = ''; formData.denahFile = null" class="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg">×</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Gallery Grid -->
                <div data-field="gallery" class="pt-4 border-t border-gray-50">
                  <label class="form-label">Galeri Foto Pendukung (Maksimal 10)</label>
                  <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    <label class="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 transition-all group">
                      <input type="file" accept="image/*" multiple @change="handleGalleryUpload" class="hidden" />
                      <i class="fa-solid fa-plus text-gray-300 group-hover:text-mocha"></i>
                    </label>
                    <div v-for="(img, i) in formData.gallery" :key="i" class="aspect-square relative group">
                      <img :src="img.preview" class="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100" />
                      <button @click="removeGalleryImage(i)" class="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg text-[9px]">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Love Story Section -->
              <LoveStorySection v-if="sections['love-story']" :loveStories="formData.loveStories" @add="addLoveStory" @remove="removeLoveStory" @upload="handleLoveStoryUpload" />

              <!-- YouTube Link Section -->
              <div v-if="sections.video" class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 animate-fade-in">
                <div class="flex items-center gap-3 pb-3 border-b border-gray-50">
                  <div class="w-10 h-10 bg-mocha/10 rounded-xl flex items-center justify-center text-mocha text-lg">
                    <i class="fa-solid fa-clapperboard"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-dark text-sm">Video Prewedding</h3>
                    <p class="text-[9px] text-muted uppercase tracking-widest font-black">Link YouTube Video</p>
                  </div>
                </div>
                <div>
                  <label class="form-label">URL Video YouTube</label>
                  <input v-model="formData.youtubeUrl" type="text" placeholder="https://www.youtube.com/watch?v=..." class="form-input" />
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

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <label class="form-label">Pilih Lagu</label>
                    <select v-model="formData.music" class="form-input font-semibold" @change="formData.musicPreview = ''">
                      <option value="">Pilih Musik Preset</option>
                      <option v-for="audio in audioList" :key="audio.id" :value="audio.url">
                        {{ audio.title }}
                      </option>
                      <option value="custom" v-if="isPremiumTemplate">Upload Musik Sendiri (.mp3)</option>
                      <option value="custom" v-else disabled>Upload Musik Sendiri (💎 Premium)</option>
                    </select>

                    <!-- Custom MP3 File Selection -->
                    <div v-if="formData.music === 'custom' && isPremiumTemplate" class="bg-gray-50 p-5 rounded-2xl border-2 border-dashed border-gray-200 animate-fade-in mt-4">
                      <div v-if="!formData.musicPreview" class="text-center">
                        <input type="file" accept="audio/mp3,audio/mpeg" @change="handleMusicUpload" class="hidden" id="musicUpload" />
                        <label for="musicUpload" class="cursor-pointer flex flex-col items-center">
                          <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-mocha text-xl mb-2">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </div>
                          <p class="text-xs font-bold text-dark mb-0.5">Upload File MP3</p>
                          <p class="text-[9px] text-gray-400 uppercase tracking-widest">Maksimal 10MB</p>
                        </label>
                      </div>

                      <div v-else class="space-y-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-mocha text-white rounded-lg flex items-center justify-center text-sm">
                              <i class="fa-solid fa-file-audio"></i>
                            </div>
                            <div>
                              <p class="text-[10px] font-bold text-dark">File Terpilih</p>
                              <p class="text-[9px] text-gray-500 truncate max-w-[150px]">{{ formData.musicFile?.name || 'Lagu Custom' }}</p>
                            </div>
                          </div>
                          <button @click="formData.musicPreview = ''; formData.musicFile = null" class="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700">Ganti</button>
                        </div>

                        <!-- Trimmer component -->
                        <AudioTrimmer
                           :url="formData.musicPreview"
                           :initialStart="formData.audioStart"
                           :initialEnd="formData.audioEnd"
                           @update:trim="({start, end}) => { formData.audioStart = start; formData.audioEnd = end }"
                        />
                      </div>
                    </div>

                    <!-- Custom MP3 locked message -->
                    <div v-if="formData.music === 'custom' && !isPremiumTemplate" class="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-2.5 mt-4">
                      <i class="fa-solid fa-gem text-amber-500 mt-0.5 text-sm"></i>
                      <p class="text-[10px] md:text-xs text-amber-900 leading-relaxed">
                        Fitur <strong>Upload Musik Sendiri</strong> hanya tersedia untuk <strong>Template Premium</strong>. Silakan ganti tema atau pilih musik preset yang tersedia.
                      </p>
                    </div>
                  </div>

                  <!-- Audio preview player for preset music -->
                  <div v-if="formData.music && formData.music !== 'custom'" class="flex flex-col justify-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100 animate-fade-in">
                    <span class="text-[9px] font-bold text-mocha uppercase tracking-widest mb-2 block">Dengarkan Lagu:</span>
                    <audio :src="formData.music" controls class="h-9 w-full rounded-full shadow-inner"></audio>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 5: AMPLOP & INFORMASI EXTRA -->
            <div v-if="activeTab === 'ekstra'" class="space-y-6">
              
              <!-- Gift / Envelope Details -->
              <GiftSection :sections="sections" :formData="formData" :foodList="formData.foodList" :giftAddresses="formData.giftAddresses" @add-food="addFood" @remove-food="removeFood" @add-gift="addGiftAddress" @remove-gift="removeGiftAddress" @add-wallet="addWallet" @remove-wallet="removeWallet" @wallet-upload="handleWalletUpload" @add-bank="addBank" @remove-bank="removeBank" @bank-upload="handleBankUpload" />
              
              <!-- Social Media Links -->
              <SocialSection v-if="sections.socialMedia || sections['live-streaming']" :formData="formData" />

              <!-- Extra components and configs -->
              <div v-if="sections['dress-code'] || sections['extended-family'] || sections.prokes || sections.likes" 
                   class="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div v-if="sections['dress-code']">
                    <label class="form-label">Dress Code (Aturan Busana)</label>
                    <input v-model="formData.dressCode" type="text" placeholder="Contoh: Putih / Batik Modern" class="form-input" />
                  </div>
                  <div v-if="sections.prokes">
                    <label class="form-label">Protokol Kesehatan</label>
                    <div class="flex items-center gap-3 mt-3">
                      <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" v-model="formData.healthProtocol" class="w-5 h-5 text-mocha rounded border-gray-300 focus:ring-mocha" />
                        <span class="text-xs font-bold text-dark">Tampilkan Himbauan Prokes</span>
                      </label>
                    </div>
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

        <!-- Refresh button -->
        <div class="w-20 text-right">
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
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { analytics } from '@/api/analytics'
import { uploadFileApi } from '@/api/file'
import { getInvitationById, createInvitation, updateInvitation } from '@/api/invitation'
import { getSections, fetchPublicAudio } from '@/api/master'
import QuoteSection from './create-form/components/QuoteSection.vue'
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
const scaleFactor = ref(1)
const mobileScale = ref(1)
const iframeHeight = ref('100%')
let resizeObserver = null

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

  // 2. Mobile mockup scale factor calculation (target height is around 612px)
  const mobileWidth = 290
  const mobileHeight = 612.2 // 290 * 19 / 9
  // Allow scaling down if container height or width is smaller than mobile dimensions
  const scaleW = containerWidth / mobileWidth
  const scaleH = containerHeight / mobileHeight
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
  if (previewMode.value === 'desktop') {
    return {
      width: '1280px',
      height: iframeHeight.value,
      transform: `scale(${scaleFactor.value})`,
      transformOrigin: 'top left',
    }
  }
  return {
    width: '100%',
    height: '100%',
    transform: 'none',
    transformOrigin: 'initial',
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
  title: '', brideName: '', groomName: '', bridePhoto: '', bridePhotoFile: null,
  groomPhoto: '', groomPhotoFile: null, photoCouple: '', photoCoupleFile: null,
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
  likes: true,
  quoteType: 'default',
  quote: '',
  quoteSource: '',
  
  // States mapped to checkbox inputs
  wishesState: true,
  rsvpState: true
})

// Checkbox items for optional components (CreateDesign)
const sections = ref({})
const sectionOptions = ref({})
const validationErrors = ref({})

const cropper = ref({
  show: false,
  image: '',
  aspectRatio: 1,
  targetField: ''
})

const uploadProgress = ref({
  show: false,
  percentage: 0,
  message: '',
  currentFile: ''
})

const isPremiumTemplate = computed(() => {
  return selectedTemplate.value?.isPremium === true || selectedTemplate.value?.isPremium === 'true'
})

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
  photoCouple: 'Foto Utama Pasangan',
  music: 'Musik Latar',
  map: 'Peta Lokasi (Google Maps)',
  rsvp: 'Konfirmasi Kehadiran (RSVP)',
  wishes: 'Kolom Ucapan & Doa',
  countdown: 'Hitung Mundur Acara',
  denah: 'Denah Lokasi / Ruangan',
  encryptedGuest: 'Enkripsi Nama Tamu',
  menu: 'Daftar Menu Makanan',
  gift: 'Amplop Digital & Kado',
  cover: 'Halaman Sampul (Cover)',
  gallery: 'Galeri Foto',
  'live-streaming': 'Live Streaming Link',
  prokes: 'Protokol Kesehatan',
  'event-details': 'Detail Acara Lengkap',
  'likes': 'Fitur Like / Suka',
  footer: 'Halaman Penutup',
  'extended-family': 'Turut Mengundang',
  video: 'Video Prewedding'
}

const defaultCommonSections = [
  'quote',
  'photoCouple',
  'love-story',
  'countdown',
  'rsvp',
  'wishes',
  'map'
]

// Icons Map helper
const getIcon = (key) => {
  const iconMap = {
    quote: 'fa-quote-left',
    'love-story': 'fa-book-heart',
    photoCouple: 'fa-image',
    music: 'fa-music',
    map: 'fa-map-location-dot',
    rsvp: 'fa-clipboard-check',
    wishes: 'fa-comment-dots',
    countdown: 'fa-clock',
    denah: 'fa-map',
    encryptedGuest: 'fa-user-lock',
    menu: 'fa-utensils',
    gift: 'fa-gift',
    cover: 'fa-book-open',
    gallery: 'fa-images',
    'live-streaming': 'fa-video',
    prokes: 'fa-shield-virus',
    'event-details': 'fa-calendar-day',
    'likes': 'fa-thumbs-up',
    'footer': 'fa-scroll',
    'extended-family': 'fa-users',
    video: 'fa-clapperboard'
  }
  return iconMap[key] || 'fa-star'
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
        quoteText: data.quote,
        quoteSource: data.quoteSource,
        loveStory: (data.loveStories || []).map(s => ({ title: s.title, date: s.date, description: s.description, image: s.photo })),
        galleryImages: (data.gallery || []).map(img => img.preview),
        giftDeliveryAddress: [...(data.giftAddresses || [])],
        bankAccounts: (data.bankAccounts || []).map(b => ({ bankName: b.bankName, accountNumber: b.accountNumber, accountName: b.accountName, bankLogo: b.bankLogo })),
        eWalletLink: (data.eWalletLink || []).map(w => ({ wallet_provider: w.wallet_provider, wallet_number: w.wallet_number, wallet_image: w.wallet_image })),
        dressCode: data.dressCode,
        healthProtocol: data.healthProtocol,
        extendedFamily: data.extendedFamilyText ? data.extendedFamilyText.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [],
        turutMengundang: data.extendedFamilyText,
        footerText: data.footerText,
        liveStreamingLink: data.liveStreamingLink,
        musicChoice: data.music === 'custom' ? data.musicPreview : data.music,
        audioStart: Number(data.audioStart) || 0,
        audioEnd: Number(data.audioEnd) || 0,
        selectedSections: Object.keys(sections.value).filter(k => sections.value[k])
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
  if (route.params.id) return
  try {
    const cleanedFormData = cleanForDraft(data)
    const draftData = { formData: cleanedFormData, sections: { ...sections.value }, timestamp: Date.now() }
    localStorage.setItem('invitation_form_draft', JSON.stringify(draftData))
    localStorage.setItem('selectedSections', JSON.stringify(Object.keys(sections.value).filter(k => sections.value[k])))
  } catch (e) {}
}

const clearDraft = () => {
  localStorage.removeItem('invitation_form_draft')
  localStorage.removeItem('selectedSections')
  localStorage.removeItem('nova_draft')
}

// Watch both formData and sections to sync & save draft
watch(formData, (newVal) => {
  syncDataToPreview(newVal)
  saveDraft(newVal)
}, { deep: true })

watch(sections, (newVal) => {
  syncDataToPreview(formData.value)
  saveDraft(formData.value)
}, { deep: true })

onMounted(async () => {
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
  if (route.params.id) {
    handleEditMode(route.params.id)
  }

  // Handle preview ready message from iframe
  window.addEventListener('message', (event) => {
     if (event.data?.type === 'PREVIEW_READY') {
        isPreviewLoading.value = false
        syncDataToPreview(formData.value) 
     }
  })

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
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', updateScale)
})

async function handleEditMode(id) {
  try {
     const res = await getInvitationById(id)
     const data = res.data || res
     mapPayloadToFormData(data)
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

   const activeSections = Array.isArray(payload.selectedSections)
      ? payload.selectedSections
      : Array.isArray(payload.content?.selectedSections)
         ? payload.content.selectedSections
         : null

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
         'health-protocol': 'prokes',
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
   formData.value.brideName = payload.brideName || ''
   formData.value.bridePhoto = payload.bridePhotoUrl || ''
   formData.value.groomName = payload.groomName || ''
   formData.value.groomPhoto = payload.groomPhotoUrl || ''
   formData.value.photoCouple = payload.photoCoupleUrl || ''
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
   if (!data.photoCouple && !data.photoCoupleFile) { 
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
      cropper.value = { show: true, image: optimizedImage, aspectRatio: 1, targetField: 'couple' }
   }; reader.readAsDataURL(file); e.target.value = ''
}

function onCropComplete({ blob, preview }) {
   const field = cropper.value.targetField
   if (field === 'bride') { formData.value.bridePhoto = preview; formData.value.bridePhotoFile = new File([blob], 'bride.jpg', { type: 'image/jpeg' }) }
   else if (field === 'groom') { formData.value.groomPhoto = preview; formData.value.groomPhotoFile = new File([blob], 'groom.jpg', { type: 'image/jpeg' }) }
   else if (field === 'couple') { formData.value.photoCouple = preview; formData.value.photoCoupleFile = new File([blob], 'couple.jpg', { type: 'image/jpeg' }) }
   cropper.value.show = false; validateField(field + 'Photo')
}

function handleGalleryUpload(e) {
   const files = Array.from(e.target.files || [])
   files.forEach(file => { const reader = new FileReader(); reader.onload = () => formData.value.gallery.push({ preview: reader.result, file }); reader.readAsDataURL(file) })
}
function removeGalleryImage(i) { formData.value.gallery.splice(i, 1) }

function handleDenahUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.denah = reader.result; formData.value.denahFile = file }; reader.readAsDataURL(file)
}

async function handleMusicUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   if (file.size > 10 * 1024 * 1024) { toast.error("File musik terlalu besar (Maks 10MB)"); return }
   const reader = new FileReader(); reader.onload = () => { formData.value.musicPreview = reader.result; formData.value.musicFile = file }; reader.readAsDataURL(file)
}

// Parallel files upload progress handler
async function uploadAllFiles() {
   const filesToUpload = []
   if (formData.value.bridePhotoFile) filesToUpload.push({ file: formData.value.bridePhotoFile, setter: (url) => formData.value.bridePhoto = url, name: 'Foto Mempelai Wanita' })
   if (formData.value.groomPhotoFile) filesToUpload.push({ file: formData.value.groomPhotoFile, setter: (url) => formData.value.groomPhoto = url, name: 'Foto Mempelai Pria' })
   if (formData.value.photoCoupleFile) filesToUpload.push({ file: formData.value.photoCoupleFile, setter: (url) => formData.value.photoCouple = url, name: 'Foto Sampul' })
   if (formData.value.denahFile) filesToUpload.push({ file: formData.value.denahFile, setter: (url) => formData.value.denah = url, name: 'Foto Denah' })
   if (formData.value.musicFile) filesToUpload.push({ file: formData.value.musicFile, setter: (url) => formData.value.music = url, name: 'File Musik' })
   formData.value.gallery.forEach((item, i) => { if (item.file) filesToUpload.push({ file: item.file, setter: (url) => formData.value.gallery[i].preview = url, name: `Galeri Foto ${i+1}` }) })
   formData.value.loveStories.forEach((s, i) => { if (s.photoFile) filesToUpload.push({ file: s.photoFile, setter: (url) => formData.value.loveStories[i].photo = url, name: `Love Story Photo ${i+1}` }) })
   formData.value.eWalletLink.forEach((w, i) => { if (w.wallet_image_file) filesToUpload.push({ file: w.wallet_image_file, setter: (url) => formData.value.eWalletLink[i].wallet_image = url, name: `E-Wallet QR ${i+1}` }) })
   formData.value.bankAccounts.forEach((b, i) => { if (b.bankLogoFile) filesToUpload.push({ file: b.bankLogoFile, setter: (url) => formData.value.bankAccounts[i].bankLogo = url, name: `Bank Logo ${i+1}` }) })
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
   if (!validateForm()) return
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
         title: formData.value.title, slug: formData.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
         brideName: formData.value.brideName, bridePhotoUrl: formData.value.bridePhoto, groomName: formData.value.groomName, groomPhotoUrl: formData.value.groomPhoto, photoCoupleUrl: formData.value.photoCouple, isSingleEvent: formData.value.isSingleEvent, mergeEvents: formData.value.isSingleEvent === true,
         parents: { brideParents: formData.value.brideParents || '', groomParents: formData.value.groomParents || '' },
         akadLocation: formData.value.isSingleEvent ? { dateTime: formData.value.dateTime ? new Date(formData.value.dateTime).toISOString() : '', mapUrl: formData.value.map || '', description: formData.value.mapDesc || '' } : { dateTime: formData.value.akadDateTime ? new Date(formData.value.akadDateTime).toISOString() : '', mapUrl: formData.value.akadMap || '', description: formData.value.akadDesc || '' },
         resepsiLocation: formData.value.isSingleEvent ? { dateTime: formData.value.dateTime ? new Date(formData.value.dateTime).toISOString() : '', mapUrl: formData.value.map || '', description: formData.value.mapDesc || '' } : { dateTime: formData.value.resepsiDateTime ? new Date(formData.value.resepsiDateTime).toISOString() : '', mapUrl: formData.value.resepsiMap || '', description: formData.value.resepsiDesc || '' },
         templateDesignId: getSelectedTemplateDesignId(), loveStory: formData.value.loveStories.map(s => ({ title: s.title, date: s.date, description: s.description, image: s.photo })),
         musicChoice: formData.value.music === 'custom' ? formData.value.musicPreview : (formData.value.music || 'default'), isCustomMusic: formData.value.music === 'custom' || (formData.value.music && !formData.value.music.startsWith('/audio/')),
         audioStart: formData.value.audioStart, audioEnd: formData.value.audioEnd, encryptedGuestName: formData.value.encryptedGuest === 'ya', galleryImages: formData.value.gallery.map(img => img.preview).filter(url => url && url.startsWith('http')),
         videoPrewedding: formData.value.youtubeUrl,
         giftDeliveryAddress: formData.value.giftAddresses, enableCover: true, healthProtocol: formData.value.healthProtocol, enableGuestMessage: formData.value.wishes === 'ya', selectedSections: Object.keys(sections.value).filter(k => sections.value[k]),
         dressCode: formData.value.dressCode, extendedFamily: formData.value.extendedFamilyText ? formData.value.extendedFamilyText.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [], turutMengundang: formData.value.extendedFamilyText, liveStreamingLink: formData.value.liveStreamingLink,
         footerText: formData.value.footerText, likes: formData.value.likes, menu: { title: 'Menu Makanan', items: formData.value.foodList.filter(n => n.trim()) },
         socialMediaBrides: { instagram: formData.value.sosmedBride.instagram, tiktok: formData.value.sosmedBride.tiktok, youtube: formData.value.sosmedBride.youtube, otherSocial: formData.value.sosmedBride.otherSocial },
         socialMediaGroom: { instagram: formData.value.sosmedGroom.instagram, tiktok: formData.value.sosmedGroom.tiktok, youtube: formData.value.sosmedGroom.youtube, otherSocial: formData.value.sosmedGroom.otherSocial },
         eWalletLink: formData.value.eWalletLink, bankAccounts: formData.value.bankAccounts, floorPlanImageUrl: formData.value.denah, quoteType: formData.value.quoteType, quoteText: formData.value.quote, quoteSource: formData.value.quoteSource
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
