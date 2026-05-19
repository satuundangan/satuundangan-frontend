<template>
   <div class="min-h-screen bg-gray-50 font-sans pb-24 flex flex-col lg:flex-row">
      <!-- LEFT PANE: FORM -->
      <div class="flex-1 lg:max-w-[600px] xl:max-w-[700px] bg-gray-50 w-full overflow-y-auto" :class="{'hidden lg:block': showMobilePreview}">
         <!-- Sticky Header Stepper -->
         <div class="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-4 mb-8 md:mb-12">
         <div class="max-w-5xl mx-auto">
            <div class="flex items-center justify-between mb-4">
               <button @click="currentStep > 1 ? currentStep-- : router.back()" class="group flex items-center gap-3 text-slate-400 hover:text-dark transition-all font-bold text-xs uppercase tracking-widest">
                  <div class="w-8 h-8 rounded-full border border-slate-100 bg-white flex items-center justify-center group-hover:border-mocha group-hover:text-mocha transition-all shadow-sm">
                     <i class="fa-solid fa-chevron-left text-[10px]"></i>
                  </div>
                  <span class="hidden sm:inline">{{ currentStep > 1 ? 'Langkah ' + (currentStep - 1) : 'Batal' }}</span>
               </button>
               
               <div class="flex flex-col items-end">
                  <div class="flex items-center gap-2 mb-1">
                     <span class="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Progress</span>
                     <span class="text-xs font-black text-mocha">{{ Math.round((currentStep / 4) * 100) }}%</span>
                  </div>
                  <div class="text-[9px] font-bold text-dark uppercase tracking-widest bg-mocha/10 px-3 py-1 rounded-full border border-mocha/10">
                     {{ ['Mempelai', 'Acara', 'Media', 'Ekstra'][currentStep-1] }}
                  </div>
               </div>
            </div>

            <!-- Slim Progress Line -->
            <div class="relative h-1 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
               <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-mocha/80 to-mocha transition-all duration-700 ease-out shadow-[0_0_15px_rgba(164,113,72,0.3)]"
                  :style="{ width: (currentStep / 4 * 100) + '%' }">
                  <div class="absolute inset-0 bg-white/20 skew-x-12 animate-pulse"></div>
               </div>
            </div>
         </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 md:px-8">
         <div class="text-center mb-10 md:mb-12">
            <h1 class="text-2xl md:text-4xl font-serif font-bold text-dark mb-3">
               {{ ['Data Mempelai', 'Detail Acara', 'Galeri & Media', 'Informasi Tambahan'][currentStep-1] }}
            </h1>
            <p class="text-muted text-sm md:text-lg">
               {{ [
                  'Isi informasi pasangan agar undangan terlihat personal.',
                  'Tentukan kapan dan di mana momen bahagiamu berlangsung.',
                  'Abadikan momen lewat foto, video, dan musik pilihan.',
                  'Lengkapi fitur pendukung agar tamu merasa nyaman.'
               ][currentStep-1] }}
            </p>
         </div>

         <div class="bg-white rounded-[2.5rem] shadow-xl shadow-mocha/5 border border-gray-100 overflow-hidden relative">
            <div class="p-6 md:p-12">

               <!-- Step 1: Mempelai -->
               <div v-if="currentStep === 1" class="space-y-12 animate-fade-in">
                  <section class="space-y-6">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        <!-- Wanita -->
                        <div class="space-y-6">
                           <h3 class="font-serif font-bold text-lg text-mocha flex items-center gap-2">
                              <span class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-sm border border-mocha/10">👰‍♀️</span> 
                              Mempelai Wanita
                           </h3>
                           <div class="space-y-5">
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
                                 <div class="relative group max-w-[200px]">
                                    <input type="file" accept="image/*" @change="handleBridePhotoUpload" class="hidden" id="bridePhoto" />
                                    <label for="bridePhoto" class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                                       <img v-if="formData.bridePhoto" :src="formData.bridePhoto" class="w-full h-full object-cover" />
                                       <div v-else class="flex flex-col items-center text-gray-400">
                                          <i class="fa-solid fa-camera text-2xl mb-2"></i>
                                          <span class="text-[10px] font-bold uppercase tracking-widest">Pilih Foto</span>
                                       </div>
                                       <div v-if="formData.bridePhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <span class="text-white text-[10px] font-bold uppercase tracking-widest">Ganti</span>
                                       </div>
                                    </label>
                                 </div>
                                 <p v-if="validationErrors.bridePhoto" class="form-error">{{ validationErrors.bridePhoto }}</p>
                              </div>
                           </div>
                        </div>
                        <!-- Pria -->
                        <div class="space-y-6">
                           <h3 class="font-serif font-bold text-lg text-mocha flex items-center gap-2">
                              <span class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-sm border border-mocha/10">🤵‍♂️</span> 
                              Mempelai Pria
                           </h3>
                           <div class="space-y-5">
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
                                 <div class="relative group max-w-[200px]">
                                    <input type="file" accept="image/*" @change="handleGroomPhotoUpload" class="hidden" id="groomPhoto" />
                                    <label for="groomPhoto" class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                                       <img v-if="formData.groomPhoto" :src="formData.groomPhoto" class="w-full h-full object-cover" />
                                       <div v-else class="flex flex-col items-center text-gray-400">
                                          <i class="fa-solid fa-camera text-2xl mb-2"></i>
                                          <span class="text-[10px] font-bold uppercase tracking-widest">Pilih Foto</span>
                                       </div>
                                       <div v-if="formData.groomPhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <span class="text-white text-[10px] font-bold uppercase tracking-widest">Ganti</span>
                                       </div>
                                    </label>
                                 </div>
                                 <p v-if="validationErrors.groomPhoto" class="form-error">{{ validationErrors.groomPhoto }}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div data-field="title" class="pt-6 border-t border-gray-50">
                        <label class="form-label">Judul Undangan (Slug) <span class="text-red-500">*</span></label>
                        <div class="flex flex-col sm:flex-row gap-3">
                           <div class="flex-1">
                              <input v-model="formData.title" @input="validateField('title')" type="text" placeholder="Contoh: The Wedding of Putri & Pangeran" class="form-input font-bold" :class="{ 'border-red-500': validationErrors.title }" />
                              <p v-if="validationErrors.title" class="form-error">{{ validationErrors.title }}</p>
                           </div>
                           <button v-if="suggestedTitle && formData.title !== suggestedTitle" @click="formData.title = suggestedTitle" class="px-4 py-3 bg-mocha/5 text-mocha rounded-xl font-bold text-xs hover:bg-mocha hover:text-white transition-all whitespace-nowrap">Gunakan Saran</button>
                        </div>
                     </div>
                  </section>
                  <QuoteSection v-if="sections.quote" :formData="formData" :defaultQuote="DEFAULT_QUOTE" />
               </div>

               <!-- Step 2: Acara -->
               <div v-if="currentStep === 2" class="space-y-12 animate-fade-in">
                  <section class="space-y-8">
                     <div data-field="isSingleEvent">
                        <label class="form-label mb-4 block">Format Acara <span class="text-red-500">*</span></label>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all group" :class="formData.isSingleEvent === true ? 'border-mocha bg-mocha/5' : 'border-gray-50 bg-gray-50/50'">
                              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all" :class="formData.isSingleEvent === true ? 'border-mocha bg-mocha text-white scale-110' : 'border-gray-300 bg-white group-hover:border-mocha/30'"><i class="fa-solid fa-check text-[10px]" v-if="formData.isSingleEvent === true"></i></div>
                              <input type="radio" :value="true" v-model="formData.isSingleEvent" class="hidden" />
                              <div><span class="font-bold block text-dark text-sm">Satu Lokasi</span><span class="text-[10px] text-muted font-medium">Akad & Resepsi digabung</span></div>
                           </label>
                           <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all group" :class="formData.isSingleEvent === false ? 'border-mocha bg-mocha/5' : 'border-gray-50 bg-gray-50/50'">
                              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all" :class="formData.isSingleEvent === false ? 'border-mocha bg-mocha text-white scale-110' : 'border-gray-300 bg-white group-hover:border-mocha/30'"><i class="fa-solid fa-check text-[10px]" v-if="formData.isSingleEvent === false"></i></div>
                              <input type="radio" :value="false" v-model="formData.isSingleEvent" class="hidden" />
                              <div><span class="font-bold block text-dark text-sm">Acara Terpisah</span><span class="text-[10px] text-muted font-medium">Akad & Resepsi beda tempat</span></div>
                           </label>
                        </div>
                        <p v-if="validationErrors.isSingleEvent" class="form-error mt-2">{{ validationErrors.isSingleEvent }}</p>
                     </div>

                     <div v-if="formData.isSingleEvent" class="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100 space-y-6 shadow-inner">
                        <div class="grid md:grid-cols-2 gap-6">
                           <div data-field="dateTime"><label class="form-label">Tanggal & Waktu <span class="text-red-500">*</span></label><input v-model="formData.dateTime" type="datetime-local" class="form-input" :class="{ 'border-red-500': validationErrors.dateTime }" /><p v-if="validationErrors.dateTime" class="form-error">{{ validationErrors.dateTime }}</p></div>
                           <div data-field="map"><label class="form-label">Link Google Maps <span class="text-red-500">*</span></label><input v-model="formData.map" @input="validateField('map')" type="text" placeholder="https://maps.app.goo.gl/..." class="form-input" /><p v-if="validationErrors.map" class="form-error">{{ validationErrors.map }}</p></div>
                        </div>
                        <div><label class="form-label">Alamat Lengkap Lokasi</label><textarea v-model="formData.mapDesc" placeholder="Gedung Serbaguna, Jl. Mawar No. 1" class="form-input h-24 resize-none"></textarea></div>
                     </div>

                     <div v-if="formData.isSingleEvent === false" class="grid md:grid-cols-2 gap-8">
                        <div class="bg-white p-6 md:p-8 rounded-3xl border-2 border-gray-50 shadow-sm relative group hover:border-mocha/20 transition-all">
                           <div class="absolute -top-3 left-6 px-4 py-1 bg-sage text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">Akad Nikah</div>
                           <div class="space-y-5 mt-4">
                              <div data-field="akadDateTime"><label class="form-label">Waktu Akad <span class="text-red-500">*</span></label><input v-model="formData.akadDateTime" type="datetime-local" class="form-input" /><p v-if="validationErrors.akadDateTime" class="form-error">{{ validationErrors.akadDateTime }}</p></div>
                              <div data-field="akadMap"><label class="form-label">Maps Akad <span class="text-red-500">*</span></label><input v-model="formData.akadMap" @input="validateField('akadMap')" type="text" class="form-input" /><p v-if="validationErrors.akadMap" class="form-error">{{ validationErrors.akadMap }}</p></div>
                              <div><label class="form-label">Lokasi Akad</label><input v-model="formData.akadDesc" type="text" class="form-input" /></div>
                           </div>
                        </div>
                        <div class="bg-white p-6 md:p-8 rounded-3xl border-2 border-gray-50 shadow-sm relative group hover:border-mocha/20 transition-all">
                           <div class="absolute -top-3 left-6 px-4 py-1 bg-mocha text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">Resepsi</div>
                           <div class="space-y-5 mt-4">
                              <div data-field="resepsiDateTime"><label class="form-label">Waktu Resepsi <span class="text-red-500">*</span></label><input v-model="formData.resepsiDateTime" type="datetime-local" class="form-input" /><p v-if="validationErrors.resepsiDateTime" class="form-error">{{ validationErrors.resepsiDateTime }}</p></div>
                              <div data-field="resepsiMap"><label class="form-label">Maps Resepsi <span class="text-red-500">*</span></label><input v-model="formData.resepsiMap" @input="validateField('resepsiMap')" type="text" class="form-input" /><p v-if="validationErrors.resepsiMap" class="form-error">{{ validationErrors.resepsiMap }}</p></div>
                              <div><label class="form-label">Lokasi Resepsi</label><input v-model="formData.resepsiDesc" type="text" class="form-input" /></div>
                           </div>
                        </div>
                     </div>
                  </section>
               </div>

               <!-- Step 3: Media -->
               <div v-if="currentStep === 3" class="space-y-12 animate-fade-in">
                  <section class="space-y-8">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div data-field="photoCouple">
                           <label class="form-label">Foto Sampul Utama (Hero) <span class="text-red-500">*</span></label>
                           <div class="flex gap-4 items-end">
                              <label class="w-32 h-32 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 group">
                                 <input type="file" accept="image/*" @change="handleCouplePhotoUpload" class="hidden" /><i class="fa-solid fa-plus text-gray-300 group-hover:text-mocha transition-colors"></i>
                              </label>
                              <div v-if="formData.photoCouple" class="relative group"><img :src="formData.photoCouple" class="w-32 h-40 object-cover rounded-2xl shadow-xl ring-4 ring-white" /><button @click="formData.photoCouple = ''; formData.photoCoupleFile = null" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg">×</button></div>
                           </div>
                           <p v-if="validationErrors.photoCouple" class="form-error mt-2">{{ validationErrors.photoCouple }}</p>
                        </div>
                        <div v-if="sections.denah" data-field="denah">
                           <label class="form-label">Denah Lokasi / Ruangan</label>
                           <div class="flex gap-4 items-end">
                              <label class="w-32 h-32 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 group">
                                 <input type="file" accept="image/*" @change="handleDenahUpload" class="hidden" /><i class="fa-solid fa-map-location-dot text-gray-300 group-hover:text-mocha transition-colors"></i>
                              </label>
                              <img v-if="formData.denah" :src="formData.denah" class="h-32 w-40 rounded-2xl object-cover shadow-lg ring-4 ring-white" />
                           </div>
                        </div>
                     </div>
                     <div data-field="gallery" class="pt-4">
                        <label class="form-label">Galeri Foto (Maksimal 10)</label>
                        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                           <label class="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 transition-all group"><input type="file" accept="image/*" multiple @change="handleGalleryUpload" class="hidden" /><i class="fa-solid fa-plus text-gray-300 group-hover:text-mocha"></i></label>
                           <div v-for="(img, i) in formData.gallery" :key="i" class="aspect-square relative group"><img :src="img.preview" class="w-full h-full object-cover rounded-2xl shadow-sm border border-white" /><button @click="removeGalleryImage(i)" class="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg text-[10px]">×</button></div>
                        </div>
                     </div>
                  </section>
                  <LoveStorySection v-if="sections.loveStory" :loveStories="formData.loveStories" @add="addLoveStory" @remove="removeLoveStory" @upload="handleLoveStoryUpload" />
                  
                  <!-- Unified Music Section -->
                  <section v-if="sections.music" class="space-y-6">
                     <div class="flex items-center gap-4 pb-4 border-b border-gray-50">
                        <div class="w-12 h-12 bg-mocha/10 rounded-2xl flex items-center justify-center text-mocha text-2xl">
                           <i class="fa-solid fa-music"></i>
                        </div>
                        <div>
                           <h2 class="text-xl font-bold text-dark">Musik Latar</h2>
                           <p class="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">Lagu Undangan</p>
                        </div>
                     </div>

                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-4">
                           <label class="form-label">Pilih Sumber Musik</label>
                           <select v-model="formData.music" class="form-input font-semibold" @change="formData.musicPreview = ''">
                              <option value="">Pilih Musik Preset</option>
                              <option v-for="audio in audioList" :key="audio.id" :value="audio.url">
                                 {{ audio.title }}
                              </option>
                              <option value="custom" v-if="isPremiumTemplate">Upload Musik Sendiri (MP3)</option>
                              <option value="custom" v-else disabled>Upload Musik Sendiri (Premium)</option>
                           </select>

                           <div v-if="formData.music === 'custom' && isPremiumTemplate" class="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200 animate-fade-in mt-4">
                              <div v-if="!formData.musicPreview" class="text-center">
                                 <input type="file" accept="audio/mp3,audio/mpeg" @change="handleMusicUpload" class="hidden" id="musicUpload" />
                                 <label for="musicUpload" class="cursor-pointer flex flex-col items-center">
                                    <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-mocha text-2xl mb-3">
                                       <i class="fa-solid fa-cloud-arrow-up"></i>
                                    </div>
                                    <p class="text-sm font-bold text-dark mb-1">Upload File MP3</p>
                                    <p class="text-[10px] text-gray-400 uppercase tracking-widest">Maksimal 10MB</p>
                                 </label>
                              </div>

                              <div v-else class="space-y-4">
                                 <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                       <div class="w-10 h-10 bg-mocha text-white rounded-xl flex items-center justify-center">
                                          <i class="fa-solid fa-file-audio"></i>
                                       </div>
                                       <div>
                                          <p class="text-xs font-bold text-dark">Musik Terpilih</p>
                                          <p class="text-[10px] text-gray-500 truncate max-w-[200px]">{{ formData.musicFile?.name || 'File Musik' }}</p>
                                       </div>
                                    </div>
                                    <button @click="formData.musicPreview = ''; formData.musicFile = null" class="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700">Ganti File</button>
                                 </div>

                                 <AudioTrimmer
                                    :url="formData.musicPreview"
                                    :initialStart="formData.audioStart"
                                    :initialEnd="formData.audioEnd"
                                    @update:trim="({start, end}) => { formData.audioStart = start; formData.audioEnd = end }"
                                 />
                              </div>
                           </div>

                           <div v-if="formData.music === 'custom' && !isPremiumTemplate" class="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 mt-4">
                              <i class="fa-solid fa-gem text-amber-500 mt-1"></i>
                              <p class="text-xs text-amber-900 leading-relaxed">
                                 Fitur <strong>Upload Musik Sendiri</strong> hanya tersedia untuk <strong>Template Premium</strong>. Silakan ganti template atau pilih musik yang tersedia.
                              </p>
                           </div>
                        </div>

                        <div v-if="formData.music && formData.music !== 'custom'" class="flex flex-col justify-center bg-gray-50/50 p-6 rounded-3xl border border-gray-100 animate-fade-in">
                           <span class="text-[10px] font-bold text-mocha uppercase tracking-[0.2em] mb-3 block">Pratinjau Suara:</span>
                           <audio :src="formData.music" controls class="h-10 w-full rounded-full shadow-sm"></audio>
                        </div>
                     </div>
                  </section>
               </div>

               <!-- Step 4: Ekstra -->
               <div v-if="currentStep === 4" class="space-y-12 animate-fade-in">
                  <GiftSection v-if="sections.gift || sections.foodList" :sections="sections" :formData="formData" :foodList="formData.foodList" :giftAddresses="formData.giftAddresses" @add-food="addFood" @remove-food="removeFood" @add-gift="addGiftAddress" @remove-gift="removeGiftAddress" @add-wallet="addWallet" @remove-wallet="removeWallet" @wallet-upload="handleWalletUpload" @add-bank="addBank" @remove-bank="removeBank" @bank-upload="handleBankUpload" />
                  <SocialSection v-if="sections.socialMedia || sections['live-stream']" :formData="formData" />
                  <section v-if="sections['dress-code'] || sections['turut-mengundang'] || sections['health-protocol'] || sections.likes" class="space-y-8">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div v-if="sections['dress-code']"><label class="form-label">Dress Code</label><input v-model="formData.dressCode" type="text" placeholder="Contoh: Putih / Batik" class="form-input" /></div>
                        <div v-if="sections['health-protocol']"><label class="form-label">Protokol Kesehatan</label><div class="flex items-center gap-4 mt-2"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="formData.healthProtocol" class="w-5 h-5 text-mocha rounded border-gray-300 focus:ring-mocha" /><span class="text-sm font-medium text-dark">Tampilkan Protokol Kesehatan</span></label></div></div>
                     </div>
                     <div v-if="sections['turut-mengundang']"><label class="form-label">Turut Mengundang (Extended Family)</label><textarea v-model="formData.extendedFamilyText" placeholder="Pisahkan nama dengan koma atau baris baru" class="form-input h-24 resize-none"></textarea></div>
                  </section>
                  <section v-if="sections.footer" class="space-y-6">
                     <div><label class="form-label">Teks Penutup</label><textarea v-model="formData.footerText" placeholder="Terima kasih atas doa restu Anda..." class="form-input h-24 resize-none"></textarea></div>
                  </section>
               </div>

               <!-- Navigation Buttons -->
               <div class="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
                  <button v-if="currentStep > 1" @click="currentStep--" class="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-dark transition-all">
                     <i class="fa-solid fa-arrow-left mr-2"></i> Sebelumnya
                  </button>
                  <div v-else></div>

                  <button v-if="currentStep < 4" @click="nextStep" class="bg-mocha text-white font-bold py-4 px-12 rounded-2xl hover:bg-dark shadow-xl shadow-mocha/20 transition-all flex items-center gap-3">
                     Lanjut Ke Step {{ currentStep + 1 }} <i class="fa-solid fa-arrow-right"></i>
                  </button>

                  <button v-else @click="saveAndPreview" :disabled="isUploading" class="bg-mocha text-white font-bold py-4 px-12 rounded-2xl hover:bg-dark shadow-xl shadow-mocha/20 transition-all disabled:opacity-50 flex items-center gap-3">
                     <span v-if="isUploading" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                     <span>{{ route.params.id ? 'Simpan Perubahan' : 'Lanjut Preview' }}</span>
                     <i v-if="!isUploading" class="fa-solid fa-wand-magic-sparkles"></i>
                  </button>
               </div>

            </div>
         </div>
         <div class="h-32 lg:hidden"></div>
      </div>

      <!-- RIGHT PANE: LIVE PREVIEW (Desktop) -->
      <div class="hidden lg:flex w-[400px] xl:w-[450px] bg-slate-900 shadow-2xl flex-col sticky top-0 h-screen border-l border-slate-800">
         <div class="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shadow-sm z-10">
            <div class="flex items-center gap-2 text-white">
               <i class="fa-solid fa-eye text-mocha text-sm"></i>
               <span class="font-bold text-sm tracking-wide">Live Preview</span>
            </div>
            <div class="flex gap-1">
               <div class="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
               <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
               <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            </div>
         </div>
         <div class="flex-1 bg-black p-4 xl:p-6 flex items-center justify-center overflow-hidden">
            <!-- Mobile Frame Mockup -->
            <div class="w-[320px] xl:w-[360px] h-[680px] xl:h-[720px] bg-white rounded-[2.5rem] shadow-2xl ring-[8px] ring-slate-800 overflow-hidden relative transition-all duration-300">
               <!-- Notch Mockup -->
               <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20 pointer-events-none"></div>
               
               <iframe 
                  ref="previewIframe"
                  :src="previewUrl" 
                  class="w-full h-full border-none"
                  allow="autoplay"
               ></iframe>
               
               <!-- Loading Overlay for Iframe -->
               <div v-if="isPreviewLoading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div class="animate-spin text-mocha text-3xl"><i class="fa-solid fa-spinner"></i></div>
               </div>
            </div>
         </div>
      </div>

      <!-- MOBILE LIVE PREVIEW MODAL -->
      <Transition name="slide-up">
         <div v-if="showMobilePreview" class="fixed inset-0 z-[60] bg-black lg:hidden flex flex-col">
            <div class="p-4 bg-slate-900 flex items-center justify-between">
               <div class="flex items-center gap-2 text-white">
                  <i class="fa-solid fa-eye text-mocha text-sm"></i>
                  <span class="font-bold text-sm">Live Preview</span>
               </div>
               <button @click="showMobilePreview = false" class="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95 transition-transform">
                  <i class="fa-solid fa-times"></i>
               </button>
            </div>
            <div class="flex-1 overflow-hidden relative">
               <iframe 
                  ref="mobilePreviewIframe"
                  :src="previewUrl" 
                  class="w-full h-full border-none bg-white"
                  allow="autoplay"
               ></iframe>
            </div>
         </div>
      </Transition>

      <!-- FAB Mobile Toggle Preview -->
      <button 
         @click="showMobilePreview = !showMobilePreview"
         class="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-900/40 flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all"
         :class="{'rotate-180': showMobilePreview}"
      >
         <i v-if="!showMobilePreview" class="fa-solid fa-eye text-xl"></i>
         <i v-else class="fa-solid fa-times text-xl"></i>
      </button>
   </div>

   <!-- Image Cropper Modal -->
   <ImageCropperModal
      :show="cropper.show"
      :imageSrc="cropper.image"
      :stencilAspectRatio="cropper.aspectRatio"
      @close="cropper.show = false"
      @crop="onCropComplete"
   />

   <!-- Global Upload Progress Modal -->
   <Transition name="modal">
      <div v-if="uploadProgress.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
         <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
         <div class="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 text-center shadow-2xl overflow-hidden">
            <!-- Animated Background Pulse -->
            <div class="absolute -top-24 -left-24 w-48 h-48 bg-mocha/5 rounded-full blur-3xl animate-pulse"></div>
            
            <div class="relative z-10">
               <div class="mb-6 relative inline-block">
                  <svg class="w-24 h-24 transform -rotate-90">
                     <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-100" />
                     <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" 
                        :stroke-dasharray="2 * Math.PI * 40"
                        :stroke-dashoffset="2 * Math.PI * 40 * (1 - uploadProgress.percentage / 100)"
                        stroke-linecap="round" class="text-mocha transition-all duration-500" />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center font-black text-dark text-xl">
                     {{ uploadProgress.percentage }}%
                  </div>
               </div>
               
               <h3 class="text-xl font-black text-dark mb-2 uppercase tracking-tight">Menyimpan Momen...</h3>
               <p class="text-sm text-slate-500 font-medium mb-6">{{ uploadProgress.message }}</p>
               
               <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-mocha shadow-sm">
                     <i class="fa-solid fa-cloud-arrow-up animate-bounce"></i>
                  </div>
                  <div class="text-left flex-1 min-w-0">
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current File</p>
                     <p class="text-xs font-bold text-dark truncate">{{ uploadProgress.currentFile }}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </Transition>
</template>

<script setup>
import { computed, onMounted, ref, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { uploadFileApi, deleteFileApi } from '@/api/file'
import { getInvitationById, createInvitation, updateInvitation } from '@/api/invitation'
import { fetchPublicAudio } from '@/api/master'
import { useToast } from "vue-toastification"
import QuoteSection from './create-form/components/QuoteSection.vue'
import AudioTrimmer from '@/components/invitation/AudioTrimmer.vue'
import LoveStorySection from './create-form/components/LoveStorySection.vue'
import GiftSection from './create-form/components/GiftSection.vue'
import SocialSection from './create-form/components/SocialSection.vue'
import ImageCropperModal from './create-form/components/ImageCropperModal.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const isUploading = ref(false)
const musicType = ref('library')
const currentStep = ref(1)
const selectedTemplateRef = ref(JSON.parse(localStorage.getItem('selectedTemplate') || '{}'))
const audioList = ref([])

// Cropper States
const cropper = ref({
   show: false,
   image: '',
   aspectRatio: 1,
   targetField: '' // bride, groom, couple
})

const uploadProgress = ref({
   show: false,
   percentage: 0,
   message: '',
   currentFile: ''
})

const isPremiumTemplate = computed(() => {
   return selectedTemplateRef.value.isPremium === true || selectedTemplateRef.value.isPremium === 'true'
})

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
   quoteSource: ''
})

const sections = ref({})
const validationErrors = ref({})
const loveStoryErrors = ref([])

// Helper methods for Dynamic Sections
function addLoveStory() {
   formData.value.loveStories.push({ title: '', date: '', description: '', photo: '', photoFile: null, isOpen: true })
}
function removeLoveStory(index) {
   formData.value.loveStories.splice(index, 1)
}
async function handleLoveStoryUpload(event, index) {
   const file = event.target.files?.[0]
   if (!file) return
   const reader = new FileReader()
   reader.onload = () => {
      formData.value.loveStories[index].photo = reader.result
      formData.value.loveStories[index].photoFile = file
   }
   reader.readAsDataURL(file)
}

function addFood() { formData.value.foodList.push('') }
function removeFood(index) { formData.value.foodList.splice(index, 1) }

function addGiftAddress() { formData.value.giftAddresses.push('') }
function removeGiftAddress(index) { formData.value.giftAddresses.splice(index, 1) }

function addWallet() {
   formData.value.eWalletLink.push({ wallet_provider: '', wallet_number: '', wallet_image: '', wallet_image_file: null })
}
function removeWallet(index) { formData.value.eWalletLink.splice(index, 1) }
async function handleWalletUpload(event, index) {
   const file = event.target.files?.[0]
   if (!file) return
   const reader = new FileReader()
   reader.onload = () => {
      formData.value.eWalletLink[index].wallet_image = reader.result
      formData.value.eWalletLink[index].wallet_image_file = file
   }
   reader.readAsDataURL(file)
}

function addBank() {
   formData.value.bankAccounts.push({ bankName: '', accountNumber: '', accountName: '', bankLogo: '', bankLogoFile: null })
}
function removeBank(index) { formData.value.bankAccounts.splice(index, 1) }
async function handleBankUpload(event, index) {
   const file = event.target.files?.[0]
   if (!file) return
   const reader = new FileReader()
   reader.onload = () => {
      formData.value.bankAccounts[index].bankLogo = reader.result
      formData.value.bankAccounts[index].bankLogoFile = file
   }
   reader.readAsDataURL(file)
}

// Helper to downscale image before cropping
async function downscaleImage(dataUrl, maxWidth = 1200) {
   return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
         const canvas = document.createElement('canvas')
         let width = img.width
         let height = img.height
         if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
         }
         canvas.width = width
         canvas.height = height
         const ctx = canvas.getContext('2d')
         ctx.drawImage(img, 0, 0, width, height)
         resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.src = dataUrl
   })
}

async function handleBridePhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = async () => { 
      const optimizedImage = await downscaleImage(reader.result)
      cropper.value = { show: true, image: optimizedImage, aspectRatio: 3/4, targetField: 'bride' }
   }; reader.readAsDataURL(file)
   e.target.value = ''
}
async function handleGroomPhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = async () => { 
      const optimizedImage = await downscaleImage(reader.result)
      cropper.value = { show: true, image: optimizedImage, aspectRatio: 3/4, targetField: 'groom' }
   }; reader.readAsDataURL(file)
   e.target.value = ''
}
async function handleCouplePhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = async () => { 
      const optimizedImage = await downscaleImage(reader.result)
      cropper.value = { show: true, image: optimizedImage, aspectRatio: 1, targetField: 'couple' }
   }; reader.readAsDataURL(file)
   e.target.value = ''
}

function onCropComplete({ blob, preview }) {
   const field = cropper.value.targetField
   if (field === 'bride') {
      formData.value.bridePhoto = preview
      formData.value.bridePhotoFile = new File([blob], 'bride.jpg', { type: 'image/jpeg' })
   } else if (field === 'groom') {
      formData.value.groomPhoto = preview
      formData.value.groomPhotoFile = new File([blob], 'groom.jpg', { type: 'image/jpeg' })
   } else if (field === 'couple') {
      formData.value.photoCouple = preview
      formData.value.photoCoupleFile = new File([blob], 'couple.jpg', { type: 'image/jpeg' })
   }
   cropper.value.show = false
   validateField(field + 'Photo') // Trigger validation refresh
}

function handleGalleryUpload(e) {
   const files = Array.from(e.target.files || [])
   files.forEach(file => {
      const reader = new FileReader(); reader.onload = () => formData.value.gallery.push({ preview: reader.result, file }); reader.readAsDataURL(file)
   })
}
function removeGalleryImage(i) { formData.value.gallery.splice(i, 1) }

function handleDenahUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.denah = reader.result; formData.value.denahFile = file }; reader.readAsDataURL(file)
}

async function handleMusicUpload(e) {
   const file = e.target.files?.[0]
   if (!file) return
   if (file.size > 10 * 1024 * 1024) {
      toast.error("File musik terlalu besar (Maks 10MB)")
      return
   }
   const reader = new FileReader()
   reader.onload = () => {
      formData.value.musicPreview = reader.result
      formData.value.musicFile = file
   }
   reader.readAsDataURL(file)
}

const progressPercentage = computed(() => {
   let filled = 0; const total = 7
   if (formData.value.brideName) filled++
   if (formData.value.groomName) filled++
   if (formData.value.title) filled++
   if (formData.value.isSingleEvent !== null) filled++
   if (formData.value.photoCouple) filled++
   if (formData.value.dateTime || (formData.value.akadDateTime && formData.value.resepsiDateTime)) filled++
   if (formData.value.map || (formData.value.akadMap && formData.value.resepsiMap)) filled++
   return (filled / total) * 100
})

const suggestedTitle = computed(() => {
   const groom = (formData.value.groomName || '').split(' ')[0]
   const bride = (formData.value.brideName || '').split(' ')[0]
   return groom && bride ? `${groom} & ${bride}` : ''
})

const DEFAULT_QUOTE = "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (QS. Ar-Rum: 21)"

onMounted(async () => {
   try {
      const res = await fetchPublicAudio()
      audioList.value = Array.isArray(res) ? res : (res?.data || [])
   } catch {}

   const stored = localStorage.getItem('selectedSections')
   if (!route.params.id && !stored) {
      router.push('/create')
      return
   }

   if (stored) {
      const activeSections = JSON.parse(stored)
      sections.value = activeSections.reduce((acc, key) => { acc[key] = true; return acc }, {})
   }

   const novaDraft = localStorage.getItem('nova_draft')
   if (novaDraft && !route.params.id) {
      try {
         const draft = JSON.parse(novaDraft)
         if (draft.groomName) formData.value.groomName = draft.groomName
         if (draft.brideName) formData.value.brideName = draft.brideName
         if (draft.groomParents) formData.value.groomParents = draft.groomParents
         if (draft.brideParents) formData.value.brideParents = draft.brideParents
         if (draft.akadDateTime) formData.value.akadDateTime = draft.akadDateTime.substring(0, 16)
         if (draft.akadLocation) formData.value.akadDesc = draft.akadLocation
         if (draft.resepsiDateTime) formData.value.resepsiDateTime = draft.resepsiDateTime.substring(0, 16)
         if (draft.resepsiLocation) formData.value.resepsiDesc = draft.resepsiLocation
         if (draft.akadDateTime && draft.resepsiDateTime) {
            formData.value.isSingleEvent = false
         } else if (draft.akadDateTime) {
            formData.value.isSingleEvent = true
            formData.value.dateTime = draft.akadDateTime.substring(0, 16)
            if (draft.akadLocation) formData.value.mapDesc = draft.akadLocation
         }
         localStorage.removeItem('nova_draft')
         toast.success('Data dari Nova berhasil dimuat! Lengkapi foto dan detail lainnya ya 💍')
      } catch {}
   }

   if (route.params.id) {
      handleEditMode(route.params.id)
   }
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

function mapPayloadToFormData(payload) {
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
      formData.value.dateTime = akad.dateTime ? akad.dateTime.substring(0, 16) : ''
      formData.value.map = akad.mapUrl || ''
      formData.value.mapDesc = akad.description || ''
   } else {
      formData.value.akadDateTime = akad.dateTime ? akad.dateTime.substring(0, 16) : ''
      formData.value.akadMap = akad.mapUrl || ''
      formData.value.akadDesc = akad.description || ''
      formData.value.resepsiDateTime = resepsi.dateTime ? resepsi.dateTime.substring(0, 16) : ''
      formData.value.resepsiMap = resepsi.mapUrl || ''
      formData.value.resepsiDesc = resepsi.description || ''
   }

   if (payload.loveStory && Array.isArray(payload.loveStory)) {
      formData.value.loveStories = payload.loveStory.map(s => ({
         title: s.title || '',
         date: s.date || '',
         description: s.description || s.content || '',
         photo: s.image || s.photo || '',
         photoFile: null,
         isOpen: false
      }))
   }

   formData.value.sosmedBride = {
      instagram: payload.socialMediaBrides?.instagram || '',
      tiktok: payload.socialMediaBrides?.tiktok || '',
      youtube: payload.socialMediaBrides?.youtube || '',
      otherSocial: payload.socialMediaBrides?.otherSocial || ''
   }
   formData.value.sosmedGroom = {
      instagram: payload.socialMediaGroom?.instagram || '',
      tiktok: payload.socialMediaGroom?.tiktok || '',
      youtube: payload.socialMediaGroom?.youtube || '',
      otherSocial: payload.socialMediaGroom?.otherSocial || ''
   }

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

   // Handle Music
   if (payload.isCustomMusic) {
      formData.value.music = 'custom'
      formData.value.musicPreview = payload.musicChoice
   } else {
      formData.value.music = payload.musicChoice || ''
   }
   formData.value.audioStart = Number(payload.audioStart) || 0
   formData.value.audioEnd = Number(payload.audioEnd) || 0
}

function validateField(field) {
   let message = ''
   const data = formData.value
   if (field === 'brideName' && !data.brideName?.trim()) message = 'Wajib diisi'
   if (field === 'brideParents' && !data.brideParents?.trim()) message = 'Wajib diisi'
   if (field === 'groomName' && !data.groomName?.trim()) message = 'Wajib diisi'
   if (field === 'groomParents' && !data.groomParents?.trim()) message = 'Wajib diisi'
   if (field === 'title' && !data.title?.trim()) message = 'Wajib diisi'
   validationErrors.value[field] = message
   return !message
}

function validateStep(step) {
   validationErrors.value = {}
   const data = formData.value
   let isValid = true

   if (step === 1) {
      if (!data.brideName?.trim()) { validationErrors.value.brideName = 'Nama mempelai wanita wajib diisi'; isValid = false }
      if (!data.brideParents?.trim()) { validationErrors.value.brideParents = 'Nama orang tua wanita wajib diisi'; isValid = false }
      if (!data.bridePhoto && !data.bridePhotoFile) { validationErrors.value.bridePhoto = 'Foto mempelai wanita wajib diisi'; isValid = false }
      if (!data.groomName?.trim()) { validationErrors.value.groomName = 'Nama mempelai pria wajib diisi'; isValid = false }
      if (!data.groomParents?.trim()) { validationErrors.value.groomParents = 'Nama orang tua pria wajib diisi'; isValid = false }
      if (!data.groomPhoto && !data.groomPhotoFile) { validationErrors.value.groomPhoto = 'Foto mempelai pria wajib diisi'; isValid = false }
      if (!data.title?.trim()) { validationErrors.value.title = 'Judul undangan wajib diisi'; isValid = false }
   } else if (step === 2) {
      if (data.isSingleEvent === null) { validationErrors.value.isSingleEvent = 'Format acara wajib dipilih'; isValid = false }
      if (data.isSingleEvent === true) {
         if (!data.dateTime) { validationErrors.value.dateTime = 'Waktu acara wajib diisi'; isValid = false }
         if (!data.map) { validationErrors.value.map = 'Link Google Maps wajib diisi'; isValid = false }
      } else if (data.isSingleEvent === false) {
         if (!data.akadDateTime) { validationErrors.value.akadDateTime = 'Waktu akad wajib diisi'; isValid = false }
         if (!data.akadMap) { validationErrors.value.akadMap = 'Link Maps akad wajib diisi'; isValid = false }
         if (!data.resepsiDateTime) { validationErrors.value.resepsiDateTime = 'Waktu resepsi wajib diisi'; isValid = false }
         if (!data.resepsiMap) { validationErrors.value.resepsiMap = 'Link Maps resepsi wajib diisi'; isValid = false }
      }
   } else if (step === 3) {
      if (!data.photoCouple && !data.photoCoupleFile) { validationErrors.value.photoCouple = 'Foto sampul wajib diisi'; isValid = false }
   }

   if (!isValid) toast.warning("Mohon lengkapi data yang wajib diisi")
   return isValid
}

function nextStep() {
   if (validateStep(currentStep.value)) {
      currentStep.value++
      window.scrollTo({ top: 0, behavior: 'smooth' })
   }
}

async function uploadAllFiles() {
   const filesToUpload = []
   if (formData.value.bridePhotoFile) filesToUpload.push({ file: formData.value.bridePhotoFile, setter: (url) => formData.value.bridePhoto = url, name: 'Foto Mempelai Wanita' })
   if (formData.value.groomPhotoFile) filesToUpload.push({ file: formData.value.groomPhotoFile, setter: (url) => formData.value.groomPhoto = url, name: 'Foto Mempelai Pria' })
   if (formData.value.photoCoupleFile) filesToUpload.push({ file: formData.value.photoCoupleFile, setter: (url) => formData.value.photoCouple = url, name: 'Foto Sampul' })
   if (formData.value.denahFile) filesToUpload.push({ file: formData.value.denahFile, setter: (url) => formData.value.denah = url, name: 'Foto Denah' })
   if (formData.value.musicFile) filesToUpload.push({ file: formData.value.musicFile, setter: (url) => formData.value.music = url, name: 'File Musik' })
   
   formData.value.gallery.forEach((item, i) => {
      if (item.file) filesToUpload.push({ file: item.file, setter: (url) => formData.value.gallery[i].preview = url, name: `Galeri Foto ${i+1}` })
   })
   formData.value.loveStories.forEach((s, i) => {
      if (s.photoFile) filesToUpload.push({ file: s.photoFile, setter: (url) => formData.value.loveStories[i].photo = url, name: `Love Story Photo ${i+1}` })
   })
   formData.value.eWalletLink.forEach((w, i) => {
      if (w.wallet_image_file) filesToUpload.push({ file: w.wallet_image_file, setter: (url) => formData.value.eWalletLink[i].wallet_image = url, name: `E-Wallet QR ${i+1}` })
   })
   formData.value.bankAccounts.forEach((b, i) => {
      if (b.bankLogoFile) filesToUpload.push({ file: b.bankLogoFile, setter: (url) => formData.value.bankAccounts[i].bankLogo = url, name: `Bank Logo ${i+1}` })
   })

   if (filesToUpload.length === 0) return

   uploadProgress.value.show = true
   let uploadedCount = 0

   for (const item of filesToUpload) {
      uploadProgress.value.currentFile = item.name
      uploadProgress.value.message = `Mengupload ${item.name}...`
      try {
         const res = await uploadFileApi(item.file)
         item.setter(res.fileUrl)
         uploadedCount++
         uploadProgress.value.percentage = Math.round((uploadedCount / filesToUpload.length) * 100)
      } catch (err) {
         uploadProgress.value.show = false
         throw err
      }
   }
   
   uploadProgress.value.message = 'Semua file berhasil diupload!'
   setTimeout(() => { uploadProgress.value.show = false }, 1000)
}

async function saveAndPreview() {
   if (!validateStep(4)) return
   if (!selectedTemplateRef.value.id && !route.params.id) {
      toast.error("Template belum dipilih. Mohon ulangi dari awal.")
      router.push('/create')
      return
   }

   isUploading.value = true
   try {
      await uploadAllFiles()
      
      const payload = {
         title: formData.value.title,
         slug: formData.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
         brideName: formData.value.brideName,
         bridePhotoUrl: formData.value.bridePhoto,
         groomName: formData.value.groomName,
         groomPhotoUrl: formData.value.groomPhoto,
         photoCoupleUrl: formData.value.photoCouple,
         isSingleEvent: formData.value.isSingleEvent,
         mergeEvents: formData.value.isSingleEvent === true,
         parents: { brideParents: formData.value.brideParents || '', groomParents: formData.value.groomParents || '' },
         akadLocation: formData.value.isSingleEvent 
            ? { dateTime: formData.value.dateTime ? new Date(formData.value.dateTime).toISOString() : '', mapUrl: formData.value.map || '', description: formData.value.mapDesc || '' }
            : { dateTime: formData.value.akadDateTime ? new Date(formData.value.akadDateTime).toISOString() : '', mapUrl: formData.value.akadMap || '', description: formData.value.akadDesc || '' },
         resepsiLocation: formData.value.isSingleEvent
            ? { dateTime: formData.value.dateTime ? new Date(formData.value.dateTime).toISOString() : '', mapUrl: formData.value.map || '', description: formData.value.mapDesc || '' }
            : { dateTime: formData.value.resepsiDateTime ? new Date(formData.value.resepsiDateTime).toISOString() : '', mapUrl: formData.value.resepsiMap || '', description: formData.value.resepsiDesc || '' },
         templateDesignId: selectedTemplateRef.value.id || 1, 
         loveStory: formData.value.loveStories.map(s => ({ title: s.title, date: s.date, description: s.description, image: s.photo })),
         musicChoice: formData.value.music === 'custom' ? formData.value.musicPreview : (formData.value.music || 'default'),
         isCustomMusic: formData.value.music === 'custom' || (formData.value.music && !formData.value.music.startsWith('/audio/')),
         audioStart: formData.value.audioStart,
         audioEnd: formData.value.audioEnd,
         encryptedGuestName: formData.value.encryptedGuest === 'ya',
         galleryImages: formData.value.gallery.map(img => img.preview).filter(url => url && url.startsWith('http')),
         giftDeliveryAddress: formData.value.giftAddresses,
         enableCover: true,
         healthProtocol: formData.value.healthProtocol,
         enableGuestMessage: formData.value.wishes === 'ya',
         selectedSections: Object.keys(sections.value).filter(k => sections.value[k]),
         dressCode: formData.value.dressCode,
         extendedFamily: formData.value.extendedFamilyText ? formData.value.extendedFamilyText.split(',').map(s => s.trim()) : [],
         turutMengundang: formData.value.extendedFamilyText,
         liveStreamingLink: formData.value.liveStreamingLink,
         footerText: formData.value.footerText,
         likes: formData.value.likes,
         menu: { title: 'Menu Makanan', items: formData.value.foodList.map(name => ({ name })) },
         socialMedia: {},
         socialMediaBrides: { instagram: formData.value.sosmedBride.instagram, tiktok: formData.value.sosmedBride.tiktok, youtube: formData.value.sosmedBride.youtube, otherSocial: formData.value.sosmedBride.otherSocial },
         socialMediaGroom: { instagram: formData.value.sosmedGroom.instagram, tiktok: formData.value.sosmedGroom.tiktok, youtube: formData.value.sosmedGroom.youtube, otherSocial: formData.value.sosmedGroom.otherSocial },
         eWalletLink: formData.value.eWalletLink,
         bankAccounts: formData.value.bankAccounts,
         floorPlanImageUrl: formData.value.denah,
         quoteType: formData.value.quoteType,
         quoteText: formData.value.quote,
         quoteSource: formData.value.quoteSource
      }

      const editId = route.params.id || localStorage.getItem('editInvitationId')
      let result
      if (editId) {
         try {
            const res = await updateInvitation(editId, payload)
            result = res.data || res
         } catch (error) {
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
      toast.success("Berhasil menyimpan!")
      router.push({ path: '/preview', query: { slug: result.slug } })
   } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan!'
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
   } finally { isUploading.value = false }
}
</script>

<style scoped>
.form-label { display: block; font-weight: 700; color: #2D3748; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
.form-input { width: 100%; padding: 0.9rem 1.25rem; border-radius: 1.25rem; border: 2px solid #F7FAFC; background-color: #F7FAFC; transition: all 0.3s ease; font-size: 0.95rem; }
.form-input:focus { outline: none; border-color: #a47148; background-color: white; }
.form-error { color: #E53E3E; font-size: 0.7rem; font-weight: 600; margin-top: 0.5rem; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
