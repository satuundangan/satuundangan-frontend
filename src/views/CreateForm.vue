<template>
  <div class="min-h-screen bg-ivory font-sans pt-24 pb-20 px-4 md:px-8">
    <div class="max-w-5xl mx-auto">
      
      <!-- Stepper -->
      <div class="flex justify-center mb-10">
         <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-sage/20 text-sage font-bold flex items-center justify-center">1</div>
            <div class="w-12 h-1 bg-sage/20 rounded-full"></div>
            <div class="w-10 h-10 rounded-full bg-sage/20 text-sage font-bold flex items-center justify-center">2</div>
            <div class="w-12 h-1 bg-sage/20 rounded-full"></div>
            <div class="w-10 h-10 rounded-full bg-mocha text-white font-bold flex items-center justify-center shadow-lg shadow-mocha/20">3</div>
         </div>
      </div>

      <div class="text-center mb-10">
         <h1 class="text-3xl md:text-4xl font-serif font-bold text-mocha mb-3">Lengkapi Data Undangan</h1>
         <p class="text-muted text-lg">Isi detail acaramu dengan lengkap agar undangan terlihat sempurna.</p>
      </div>

      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        <!-- Progress Bar -->
        <div class="h-1 bg-gray-100 w-full">
           <div class="h-full bg-mocha transition-all duration-500" :style="{ width: progressPercentage + '%' }"></div>
        </div>

        <div class="p-8 md:p-12 space-y-12">
           
           <!-- Section: Data Mempelai -->
           <section class="space-y-6">
              <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
                 <div class="w-10 h-10 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-xl">👩‍❤️‍👨</div>
                 <h2 class="text-xl font-bold text-dark">Data Mempelai</h2>
              </div>

              <div class="grid md:grid-cols-2 gap-10">
                 <!-- Wanita -->
                 <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-mocha/30 transition-colors">
                    <h3 class="font-serif font-bold text-lg text-mocha mb-4 flex items-center gap-2">
                       <span>👰‍♀️</span> Mempelai Wanita
                    </h3>
                    
                    <div class="space-y-4">
                       <div data-field="brideName">
                          <label class="form-label">Nama Lengkap <span class="text-red-500">*</span></label>
                          <input v-model="formData.brideName" @input="validateField('brideName')" type="text"
                            placeholder="Putri Diana"
                            class="form-input" :class="{ 'border-red-500': validationErrors.brideName }" />
                          <p v-if="validationErrors.brideName" class="form-error">{{ validationErrors.brideName }}</p>
                       </div>
                       
                       <div data-field="brideParents">
                          <label class="form-label">Nama Orang Tua</label>
                          <input v-model="formData.brideParents" @input="validateField('brideParents')" type="text"
                            placeholder="Bpk. ... & Ibu ..."
                            class="form-input" :class="{ 'border-red-500': validationErrors.brideParents }" />
                          <p v-if="validationErrors.brideParents" class="form-error">{{ validationErrors.brideParents }}</p>
                       </div>

                       <div data-field="bridePhoto">
                          <label class="form-label">Foto wanita <span class="text-red-500">*</span></label>
                          <div class="relative group">
                             <input type="file" accept="image/*" @change="handleBridePhotoUpload" class="hidden" id="bridePhoto" />
                             <label for="bridePhoto" 
                                class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-white">
                                <img v-if="formData.bridePhoto" :src="formData.bridePhoto" class="w-full h-full object-cover" />
                                <div v-else class="flex flex-col items-center text-gray-400">
                                   <i class="fa-solid fa-cloud-arrow-up text-2xl mb-2"></i>
                                   <span class="text-xs font-medium">Upload Foto</span>
                                </div>
                                <div v-if="formData.bridePhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <span class="text-white text-xs font-bold">Ganti Foto</span>
                                </div>
                             </label>
                          </div>
                          <p v-if="validationErrors.bridePhoto" class="form-error">{{ validationErrors.bridePhoto }}</p>
                       </div>
                    </div>
                 </div>

                 <!-- Pria -->
                 <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-mocha/30 transition-colors">
                    <h3 class="font-serif font-bold text-lg text-mocha mb-4 flex items-center gap-2">
                       <span>🤵‍♂️</span> Mempelai Pria
                    </h3>
                    
                    <div class="space-y-4">
                       <div data-field="groomName">
                          <label class="form-label">Nama Lengkap <span class="text-red-500">*</span></label>
                          <input v-model="formData.groomName" @input="validateField('groomName')" type="text"
                            placeholder="Pangeran Charles"
                            class="form-input" :class="{ 'border-red-500': validationErrors.groomName }" />
                          <p v-if="validationErrors.groomName" class="form-error">{{ validationErrors.groomName }}</p>
                       </div>
                       
                       <div data-field="groomParents">
                          <label class="form-label">Nama Orang Tua</label>
                          <input v-model="formData.groomParents" @input="validateField('groomParents')" type="text"
                            placeholder="Bpk. ... & Ibu ..."
                            class="form-input" :class="{ 'border-red-500': validationErrors.groomParents }" />
                          <p v-if="validationErrors.groomParents" class="form-error">{{ validationErrors.groomParents }}</p>
                       </div>

                       <div data-field="groomPhoto">
                          <label class="form-label">Foto Pria <span class="text-red-500">*</span></label>
                          <div class="relative group">
                             <input type="file" accept="image/*" @change="handleGroomPhotoUpload" class="hidden" id="groomPhoto" />
                             <label for="groomPhoto" 
                                class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-white">
                                <img v-if="formData.groomPhoto" :src="formData.groomPhoto" class="w-full h-full object-cover" />
                                <div v-else class="flex flex-col items-center text-gray-400">
                                   <i class="fa-solid fa-cloud-arrow-up text-2xl mb-2"></i>
                                   <span class="text-xs font-medium">Upload Foto</span>
                                </div>
                                <div v-if="formData.groomPhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <span class="text-white text-xs font-bold">Ganti Foto</span>
                                </div>
                             </label>
                          </div>
                          <p v-if="validationErrors.groomPhoto" class="form-error">{{ validationErrors.groomPhoto }}</p>
                       </div>
                    </div>
                 </div>
              </div>

               <div data-field="title" class="pt-4">
                 <label class="form-label">Judul Undangan (Slug) <span class="text-red-500">*</span></label>
                 <div class="flex gap-2">
                    <div class="flex-1">
                      <input v-model="formData.title" @input="validateField('title')" type="text"
                       placeholder="Contoh: The Wedding of Putri & Pangeran"
                       class="form-input" :class="{ 'border-red-500': validationErrors.title }" />
                       <p v-if="validationErrors.title" class="form-error">{{ validationErrors.title }}</p>
                    </div>
                    <button v-if="suggestedTitle && formData.title !== suggestedTitle" 
                       @click="formData.title = suggestedTitle" 
                       class="text-xs bg-mocha/10 text-mocha px-3 rounded-lg font-bold hover:bg-mocha hover:text-white transition whitespace-nowrap h-[46px]">
                       Gunakan Saran
                    </button>
                 </div>
              </div>
           </section>

           <!-- Section: Quote -->
           <section v-if="sections.quote" class="space-y-6 pt-8 border-t border-gray-100">
               <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
                 <div class="w-10 h-10 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-xl">📜</div>
                 <h2 class="text-xl font-bold text-dark">Quote / Ayat</h2>
              </div>
              
              <div class="grid md:grid-cols-3 gap-6">
                 <div class="md:col-span-1 space-y-3">
                    <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition" :class="formData.quoteType === 'default' ? 'border-mocha bg-mocha/5' : 'border-gray-200'">
                       <input type="radio" value="default" v-model="formData.quoteType" class="text-mocha focus:ring-mocha" />
                       <span class="font-medium">Quote Default</span>
                    </label>
                    <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition" :class="formData.quoteType === 'custom' ? 'border-mocha bg-mocha/5' : 'border-gray-200'">
                       <input type="radio" value="custom" v-model="formData.quoteType" class="text-mocha focus:ring-mocha" />
                       <span class="font-medium">Tulis Sendiri</span>
                    </label>
                 </div>
                 
                 <div class="md:col-span-2">
                    <textarea v-if="formData.quoteType === 'custom'" v-model="formData.quote" rows="4"
                     class="form-input"
                     placeholder="Tulis ayat atau kata-kata mutiara pilihanmu..."></textarea>
                    <div v-else class="bg-gray-50 p-4 rounded-xl border border-gray-200 italic text-muted text-sm">
                       “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...”
                    </div>
                 </div>
              </div>
           </section>

           <!-- Section: Acara -->
           <section class="space-y-6 pt-8 border-t border-gray-100">
               <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
                 <div class="w-10 h-10 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-xl">📅</div>
                 <h2 class="text-xl font-bold text-dark">Detail Acara</h2>
              </div>

               <div data-field="isSingleEvent">
                  <label class="form-label mb-3 block">Format Acara <span class="text-red-500">*</span></label>
                  <div class="flex flex-col sm:flex-row gap-4">
                     <label class="flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition" :class="formData.isSingleEvent === true ? 'border-mocha bg-mocha/5' : 'border-gray-200'">
                        <input type="radio" :value="true" v-model="formData.isSingleEvent" class="text-mocha focus:ring-mocha" />
                        <div>
                           <span class="font-bold block text-dark">Satu Lokasi / Waktu</span>
                           <span class="text-xs text-muted">Akad & Resepsi digabung</span>
                        </div>
                     </label>
                     <label class="flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition" :class="formData.isSingleEvent === false ? 'border-mocha bg-mocha/5' : 'border-gray-200'">
                        <input type="radio" :value="false" v-model="formData.isSingleEvent" class="text-mocha focus:ring-mocha" />
                         <div>
                           <span class="font-bold block text-dark">Terpisah</span>
                           <span class="text-xs text-muted">Akad & Resepsi beda waktu/tempat</span>
                        </div>
                     </label>
                  </div>
                  <p v-if="validationErrors.isSingleEvent" class="form-error mt-2">{{ validationErrors.isSingleEvent }}</p>
               </div>
               
               <!-- Single Event Form -->
               <div v-if="formData.isSingleEvent" class="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 animate-fade-in">
                  <div class="grid md:grid-cols-2 gap-4">
                     <div data-field="dateTime">
                        <label class="form-label">Tanggal & Waktu <span class="text-red-500">*</span></label>
                        <input v-model="formData.dateTime" type="datetime-local" class="form-input" :class="{ 'border-red-500': validationErrors.dateTime }" />
                        <p v-if="validationErrors.dateTime" class="form-error">{{ validationErrors.dateTime }}</p>
                     </div>
                     <div data-field="map">
                        <label class="form-label">Link Google Maps <span class="text-red-500">*</span></label>
                        <input v-model="formData.map" @input="validateField('map')" type="text" placeholder="https://maps.app.goo.gl/..." class="form-input" :class="{ 'border-red-500': validationErrors.map }" />
                        <p v-if="validationErrors.map" class="form-error">{{ validationErrors.map }}</p>
                     </div>
                  </div>
                   <div>
                      <label class="form-label">Nama Lokasi / Alamat</label>
                      <input v-model="formData.mapDesc" type="text" placeholder="Gedung Serbaguna, Jl. Mawar No. 1" class="form-input" />
                   </div>
               </div>

               <!-- Separate Event Form -->
               <div v-if="formData.isSingleEvent === false" class="grid md:grid-cols-2 gap-6 animate-fade-in">
                  <!-- Akad -->
                  <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                     <div class="absolute top-0 left-0 w-1 h-full bg-sage"></div>
                     <h3 class="font-bold text-dark mb-4 text-lg">Acara Akad</h3>
                     <div class="space-y-4">
                        <div data-field="akadDateTime">
                           <label class="form-label">Waktu Akad <span class="text-red-500">*</span></label>
                           <input v-model="formData.akadDateTime" type="datetime-local" class="form-input" :class="{ 'border-red-500': validationErrors.akadDateTime }" />
                           <p v-if="validationErrors.akadDateTime" class="form-error">{{ validationErrors.akadDateTime }}</p>
                        </div>
                        <div data-field="akadMap">
                           <label class="form-label">Maps Akad <span class="text-red-500">*</span></label>
                           <input v-model="formData.akadMap" @input="validateField('akadMap')" type="text" class="form-input" :class="{ 'border-red-500': validationErrors.akadMap }" />
                           <p v-if="validationErrors.akadMap" class="form-error">{{ validationErrors.akadMap }}</p>
                        </div>
                        <div>
                           <label class="form-label">Lokasi Akad</label>
                           <input v-model="formData.akadDesc" type="text" class="form-input" />
                        </div>
                     </div>
                  </div>

                  <!-- Resepsi -->
                   <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                     <div class="absolute top-0 left-0 w-1 h-full bg-mocha"></div>
                     <h3 class="font-bold text-dark mb-4 text-lg">Acara Resepsi</h3>
                     <div class="space-y-4">
                        <div data-field="resepsiDateTime">
                           <label class="form-label">Waktu Resepsi <span class="text-red-500">*</span></label>
                           <input v-model="formData.resepsiDateTime" type="datetime-local" class="form-input" :class="{ 'border-red-500': validationErrors.resepsiDateTime }" />
                           <p v-if="validationErrors.resepsiDateTime" class="form-error">{{ validationErrors.resepsiDateTime }}</p>
                        </div>
                        <div data-field="resepsiMap">
                           <label class="form-label">Maps Resepsi <span class="text-red-500">*</span></label>
                           <input v-model="formData.resepsiMap" @input="validateField('resepsiMap')" type="text" class="form-input" :class="{ 'border-red-500': validationErrors.resepsiMap }" />
                           <p v-if="validationErrors.resepsiMap" class="form-error">{{ validationErrors.resepsiMap }}</p>
                        </div>
                        <div>
                           <label class="form-label">Lokasi Resepsi</label>
                           <input v-model="formData.resepsiDesc" type="text" class="form-input" />
                        </div>
                     </div>
                  </div>
               </div>
           </section>

           <!-- Section: Galeri & Media -->
           <section class="space-y-6 pt-8 border-t border-gray-100">
              <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
                 <div class="w-10 h-10 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-xl">🖼️</div>
                 <h2 class="text-xl font-bold text-dark">Galeri & Media</h2>
              </div>
              
              <div v-if="sections.photoCouple" data-field="photoCouple">
                 <label class="form-label">Foto Sampul Utama (Hero) <span class="text-red-500">*</span></label>
                 <div class="flex gap-4 items-start">
                    <label class="w-32 h-32 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-white">
                       <input type="file" accept="image/*" @change="handleCouplePhotoUpload" class="hidden" />
                       <i class="fa-solid fa-plus text-gray-400"></i>
                    </label>
                    <div v-if="formData.photoCouple" class="relative group">
                       <img :src="formData.photoCouple" class="w-32 h-32 object-cover rounded-xl shadow-md" />
                       <div class="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">Utama</div>
                    </div>
                 </div>
                 <p v-if="validationErrors.photoCouple" class="form-error mt-2">{{ validationErrors.photoCouple }}</p>
              </div>

              <div data-field="gallery">
                 <label class="form-label">Galeri Foto (Max 10)</label>
                 <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    <label class="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-white">
                       <input type="file" accept="image/*" multiple @change="handleGalleryUpload" class="hidden" />
                       <i class="fa-solid fa-images text-gray-400 mb-1"></i>
                       <span class="text-[10px] text-gray-500">Add</span>
                    </label>
                    
                    <div v-for="(img, i) in formData.gallery" :key="i" class="aspect-square relative group">
                       <img :src="img.preview" class="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100" />
                       <button @click="removeGalleryImage(i)" class="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md">&times;</button>
                    </div>
                 </div>
                 <p v-if="validationErrors.gallery" class="form-error mt-2">{{ validationErrors.gallery }}</p>
              </div>

              <!-- Video Prewedding -->
              <div v-if="sections['video-prewedding']">
                 <label class="form-label">Link Video Prewedding (YouTube/Vimeo)</label>
                 <input v-model="formData.videoPrewedding" type="text" placeholder="https://youtu.be/..." class="form-input" />
              </div>

              <!-- Live Stream -->
              <div v-if="sections['live-stream']">
                 <label class="form-label">Link Live Streaming</label>
                 <input v-model="formData.liveStreamingLink" type="text" placeholder="https://youtube.com/live/..." class="form-input" />
              </div>
              
              <!-- Music Selection -->
              <div v-if="sections.music" class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <label class="form-label">Musik Latar</label>
                 <div class="grid md:grid-cols-2 gap-4">
                    <select v-model="formData.music" class="form-input">
                      <option disabled value="">Pilih Musik</option>
                      <option value="romantic">Romantic Instrumental</option>
                      <option value="acoustic">Acoustic Vibes</option>
                      <option value="classic">Classic Wedding</option>
                      <option value="custom">Custom (Upload Sendiri)</option>
                    </select>
                    
                    <div v-if="formData.music === 'custom'">
                       <input type="file" accept="audio/*" @change="handleMusicUpload" class="form-input text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-mocha/10 file:text-mocha hover:file:bg-mocha/20"/>
                       <p v-if="formData.musicFileName" class="text-xs text-mocha mt-1 font-medium">🎵 {{ formData.musicFileName }}</p>
                       <p v-if="!isPremiumTemplate" class="text-xs text-red-500 mt-1">* Fitur Premium</p>
                    </div>
                 </div>
              </div>
           </section>

           <!-- Section: Fitur Tambahan -->
           <section class="space-y-6 pt-8 border-t border-gray-100">
              <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
                 <div class="w-10 h-10 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-xl">✨</div>
                 <h2 class="text-xl font-bold text-dark">Fitur Tambahan</h2>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                 <!-- Turut Mengundang -->
                 <div v-if="sections['turut-mengundang']">
                    <label class="form-label">Turut Mengundang</label>
                    <textarea v-model="formData.turutMengundang" rows="4" placeholder="Keluarga Besar Bpk..." class="form-input"></textarea>
                 </div>

                 <!-- Footer Text -->
                 <div v-if="sections.footer">
                    <label class="form-label">Teks Penutup (Footer)</label>
                    <textarea v-model="formData.footerText" rows="4" placeholder="Terima kasih atas doa restu..." class="form-input"></textarea>
                 </div>
              </div>

              <div class="flex flex-col gap-4">
                 <!-- Health Protocol -->
                 <label v-if="sections['health-protocol']" class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <input type="checkbox" v-model="formData.healthProtocol" class="text-mocha focus:ring-mocha w-5 h-5" />
                    <div>
                       <span class="font-bold text-dark block">Tampilkan Protokol Kesehatan</span>
                       <span class="text-xs text-muted">Icon masker, cuci tangan, dll.</span>
                    </div>
                 </label>

                 <!-- Enable Cover -->
                 <label v-if="sections.cover" class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <input type="checkbox" v-model="formData.enableCover" class="text-mocha focus:ring-mocha w-5 h-5" />
                    <div>
                       <span class="font-bold text-dark block">Aktifkan Halaman Cover (Welcome Screen)</span>
                       <span class="text-xs text-muted">Halaman pembuka sebelum masuk ke undangan utama.</span>
                    </div>
                 </label>
              </div>
           </section>

           <!-- Submit Action -->
           <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40 md:static md:border-t md:border-gray-200 md:pt-10 md:p-0 md:bg-transparent flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-none">
              <button @click="router.back()" class="text-gray-500 font-medium hover:text-dark px-4 py-2 md:px-6 md:py-3 text-sm md:text-base">
                 &larr; <span class="hidden md:inline">Kembali</span>
              </button>
              
              <button @click="saveAndPreview" :disabled="isUploading"
                class="bg-mocha text-white font-bold py-3 px-6 md:py-4 md:px-10 rounded-xl hover:bg-mocha/90 shadow-lg shadow-mocha/20 hover:shadow-mocha/30 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 md:gap-3 text-sm md:text-base">
                <span v-if="isUploading" class="animate-spin w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                <span v-else>Preview <span class="hidden md:inline">Undangan</span></span>
                <i v-if="!isUploading" class="fa-solid fa-wand-magic-sparkles"></i>
              </button>
           </div>
           
        </div>
      </div>
      <!-- Spacer for mobile sticky footer -->
      <div class="h-20 md:hidden"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { uploadFileApi } from '@/api/file'

const router = useRouter()
const isUploading = ref(false)
const isPremiumTemplate = ref(false)

const formData = ref({
  title: '',
  brideName: '',
  groomName: '',
  templateName: '',
  isPublished: false,
  quote: '',
  quoteSource: 'bebas',
  quoteType: 'default',
  music: '',
  musicFile: null,
  musicFileName: '',
  bridePhoto: '',
  bridePhotoFile: null,
  groomPhoto: '',
  groomPhotoFile: null,
  photoCouple: '',
  photoCoupleFile: null,
  gallery: [],
  isSingleEvent: null,
  akadMap: '',
  akadDesc: '',
  akadDateTime: '',
  resepsiMap: '',
  resepsiDesc: '',
  resepsiDateTime: '',
  map: '',
  mapDesc: '',
  dateTime: '',
  denah: '',
  denahFile: null,
  encryptedGuest: 'ya',
  rsvp: 'ya',
  wishes: 'ya',
  sosmedBride: {
    instagram: '',
    tiktok: '',
    youtube: '',
    otherSocial: '',
  },
  sosmedGroom: {
    instagram: '',
    tiktok: '',
    youtube: '',
    otherSocial: '',
  },
  liveStreamingLink: '',
  videoPrewedding: '',
  turutMengundang: '',
  footerText: '',
  healthProtocol: false,
  enableCover: true,
  brideParents: '',
  groomParents: '',
  eWalletLink: [],
  bankAccounts: [],
})

const sections = ref({})
const loveStories = ref([])
const foodList = ref([])
const giftAddresses = ref([])
const finalPayload = ref(null)

const validationErrors = ref({})

const suggestedTitle = computed(() => {
  const groom = (formData.value.groomName || '').trim().split(' ')[0]
  const bride = (formData.value.brideName || '').trim().split(' ')[0]
  return groom && bride ? `${groom} & ${bride}` : ''
})

const progressPercentage = computed(() => {
   let filled = 0
   const total = 7
   if(formData.value.brideName) filled++
   if(formData.value.groomName) filled++
   if(formData.value.title) filled++
   if(formData.value.isSingleEvent !== null) filled++
   if(formData.value.photoCouple) filled++
   return (filled / total) * 100
})

watch(
  () => formData.value.isSingleEvent,
  () => {
    validateField('isSingleEvent')
    // Reset validations related to events when switching
    validationErrors.value.map = ''
    validationErrors.value.dateTime = ''
    validationErrors.value.akadMap = ''
    validationErrors.value.resepsiMap = ''
  }
)


function handleCouplePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.photoCouple = reader.result
    formData.value.photoCoupleFile = file
    validateField('photoCouple')
  }
  reader.readAsDataURL(file)
}


function handleBridePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.bridePhoto = reader.result
    formData.value.bridePhotoFile = file
    validateField('bridePhoto')
  }
  reader.readAsDataURL(file)
}

function handleGroomPhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.groomPhoto = reader.result
    formData.value.groomPhotoFile = file
    validateField('groomPhoto')
  }
  reader.readAsDataURL(file)
}

function handleGalleryUpload(event) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return
  
  if (formData.value.gallery.length + files.length > 10) {
     alert("Maksimal 10 foto galeri")
     return
  }
  
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      formData.value.gallery.push({ preview: reader.result, file })
      validateField('gallery')
    }
    reader.readAsDataURL(file)
  })
}

function removeGalleryImage(index) {
  formData.value.gallery.splice(index, 1)
  validateField('gallery')
}


function handleMusicUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.musicFile = reader.result
    formData.value.musicFileName = file.name
    validateField('music')
  }
  reader.readAsDataURL(file)
}


function generatePayload() {
  const selectedTemplate = JSON.parse(localStorage.getItem('selectedTemplate') || '{}')
  
  const payload = {
    title: formData.value.title,
    slug: formData.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    coupleName: `${formData.value.groomName} & ${formData.value.brideName}`,
    brideName: formData.value.brideName,
    groomName: formData.value.groomName,
    templateDesignId: selectedTemplate.id ? Number(selectedTemplate.id) : null,
    templateName: selectedTemplate.name || formData.value.templateName,
    
    bridePhotoUrl: formData.value.bridePhotoUrl || formData.value.bridePhoto,
    groomPhotoUrl: formData.value.groomPhotoUrl || formData.value.groomPhoto,
    isPublished: formData.value.isPublished,
    quoteSource: formData.value.quoteSource,
    quoteType: formData.value.quoteType,
    quoteText: formData.value.quote,
    dateTime: formData.value.dateTime,
    photoCoupleUrl: formData.value.photoCoupleUrl || formData.value.photoCouple,
    
    loveStory: loveStories.value.map((story) => ({
      title: story.title,
      images: story.photoUrl || story.photo,
      content: story.description,
      date: story.date,
    })),
    
    galleryImages: formData.value.gallery.map((img) => img.url || img.preview),
    floorPlanImageUrl: formData.value.denahUrl || formData.value.denah,
    
    // Convert eWallet array to JSON string as per docs 'string' type expectation for rich data, or fallback
    eWalletLink: formData.value.eWalletLink.length > 0 ? JSON.stringify(formData.value.eWalletLink.map((wallet) => ({
      wallet_provider: wallet.wallet_provider,
      wallet_image: wallet.wallet_imageUrl || wallet.wallet_image,
      wallet_number: wallet.wallet_number,
    })))
     : "",
    
    // Bank accounts aren't explicitly in 'POST /invitation' docs top level but form has them. 
    // If backend supports 'bankAccounts', keep it. If not, maybe it goes into eWalletLink or similar?
    // Keeping it as is for now, assuming docs might be partial or it's a custom field.
    bankAccounts: formData.value.bankAccounts.map((account) => ({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      bankLogo: account.bankLogoUrl || account.bankLogo,
    })),
    
    musicChoice:
      formData.value.music === 'custom'
        ? formData.value.musicFileName
        : formData.value.music,
    isSingleEvent: formData.value.isSingleEvent,
    isCustomMusic: formData.value.music === 'custom',
    
    akadLocation: formData.value.isSingleEvent ? null : {
      mapUrl: formData.value.akadMap,
      description: formData.value.akadDesc,
      dateTime: formData.value.akadDateTime
    },

    resepsiLocation: formData.value.isSingleEvent ? null : {
      mapUrl: formData.value.resepsiMap,
      description: formData.value.resepsiDesc,
      dateTime: formData.value.resepsiDateTime
    },
    mergeEvents: formData.value.isSingleEvent,
    encryptedGuestName: formData.value.encryptedGuest === 'ya',
    menu: {
      title: 'Menu Makanan',
      items: foodList.value,
    },
    
    // Convert array to string
    giftDeliveryAddress: giftAddresses.value.join('\n'),
    
    // Docs expect 'socialMedia' object
    socialMedia: {
      instagram: formData.value.sosmedBride.instagram || formData.value.sosmedGroom.instagram,
      tiktok: formData.value.sosmedBride.tiktok || formData.value.sosmedGroom.tiktok,
      youtube: formData.value.sosmedBride.youtube || formData.value.sosmedGroom.youtube,
      lainnya: formData.value.sosmedBride.otherSocial || formData.value.sosmedGroom.otherSocial,
    },
    // Keep separate ones just in case backend logic relies on them despite docs
    socialMediaBrides: {
      instagram: formData.value.sosmedBride.instagram,
      tiktok: formData.value.sosmedBride.tiktok,
      youtube: formData.value.sosmedBride.youtube,
      lainnya: formData.value.sosmedBride.otherSocial,
    },
    socialMediaGroom: {
      instagram: formData.value.sosmedGroom.instagram,
      tiktok: formData.value.sosmedGroom.tiktok,
      youtube: formData.value.sosmedGroom.youtube,
      lainnya: formData.value.sosmedGroom.otherSocial,
    },
    
    parents: {
      brideParents: formData.value.brideParents,
      groomParents: formData.value.groomParents,
    },
    liveStreamingLink: formData.value.liveStreamingLink,
    videoPrewedding: formData.value.videoPrewedding,
    turutMengundang: formData.value.turutMengundang,
    footerText: formData.value.footerText,
    healthProtocol: formData.value.healthProtocol,
    enableCover: formData.value.enableCover !== false, // Default true
    
    selectedSections: Object.keys(sections.value).filter((key) => !!sections.value[key]),
    enableGuestMessage: formData.value.wishes === 'ya',
  }
  localStorage.setItem('finalPayload', JSON.stringify(payload))
}

function resetValidationErrors() {
  validationErrors.value = {}
}

function isValidUrl(value) {
  if (!value) return false
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function validateField(field) {
  let message = ''
  const data = formData.value
  switch (field) {
    case 'brideName':
      if (!data.brideName?.trim()) message = 'Nama wajib diisi'
      break
    case 'groomName':
      if (!data.groomName?.trim()) message = 'Nama wajib diisi'
      break
    case 'brideParents':
      // if (!data.brideParents?.trim()) message = 'Wajib diisi'
      break
    case 'groomParents':
      // if (!data.groomParents?.trim()) message = 'Wajib diisi'
      break
    case 'bridePhoto':
      if (!data.bridePhoto && !data.bridePhotoFile) message = 'Foto wajib diupload'
      break
    case 'groomPhoto':
      if (!data.groomPhoto && !data.groomPhotoFile) message = 'Foto wajib diupload'
      break
    case 'title':
      if (!data.title?.trim()) message = 'Judul wajib diisi'
      else if (data.title.trim().length < 3) message = 'Minimal 3 karakter'
      break
    case 'photoCouple':
      if (sections.value.photoCouple && !data.photoCouple && !data.photoCoupleFile) message = 'Foto utama wajib diupload'
      break
    case 'isSingleEvent':
      if (data.isSingleEvent === null) message = 'Pilih format acara'
      break
    case 'map':
      if (data.isSingleEvent && !data.map?.trim()) message = 'Link Maps wajib diisi'
      break
    case 'dateTime':
      if (data.isSingleEvent && !data.dateTime) message = 'Tanggal & waktu wajib diisi'
      break
    case 'akadMap':
      if (data.isSingleEvent === false && !data.akadMap?.trim()) message = 'Link Maps Akad wajib diisi'
      break
    case 'resepsiMap':
      if (data.isSingleEvent === false && !data.resepsiMap?.trim()) message = 'Link Maps Resepsi wajib diisi'
      break
    case 'akadDateTime':
      if (data.isSingleEvent === false && !data.akadDateTime) message = 'Waktu Akad wajib diisi'
      break
    case 'resepsiDateTime':
      if (data.isSingleEvent === false && !data.resepsiDateTime) message = 'Waktu Resepsi wajib diisi'
      break
    case 'gallery':
      // if (!data.gallery.length) message = 'Minimal 1 foto galeri'
      break
    default:
      break
  }
  validationErrors.value[field] = message
  return !message
}


function validateForm() {
  resetValidationErrors()
  const fieldsToValidate = [
    'brideName', 'groomName', 'bridePhoto', 'groomPhoto', 'title', 
    'photoCouple', 'isSingleEvent', 'map', 'dateTime', 
    'akadMap', 'akadDateTime', 'resepsiMap', 'resepsiDateTime'
  ]
  
  const results = fieldsToValidate.map((field) => validateField(field))
  
  // Custom checks for conditional fields
  
  return results.every(Boolean)
}

function findFirstErrorField() {
  const order = [
    'brideName', 'groomName', 'bridePhoto', 'groomPhoto', 'title', 
    'photoCouple', 'isSingleEvent', 'map', 'dateTime', 
    'akadMap', 'akadDateTime', 'resepsiMap', 'resepsiDateTime'
  ]
  for (const key of order) {
    if (validationErrors.value[key]) {
      return key
    }
  }
  return ''
}

async function saveAndPreview() {
  if (!validateForm()) {
    const target = findFirstErrorField()
    if (target) {
      const element = document.querySelector(`[data-field="${target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add shake animation logic here if desired
      }
    }
    return
  }

  isUploading.value = true
  try {
    await uploadAllFiles()
    generatePayload()
    router.push('/preview')
  } catch (error) {
    console.error(error)
    alert('Gagal mengupload file. Pastikan koneksi internet stabil.')
  } finally {
    isUploading.value = false
  }
}

async function uploadAllFiles() {
  const uploads = []
  
  const pushUpload = (file, callback) => {
     if(file) {
        uploads.push(uploadFileToBackend(file).then(callback))
     }
  }

  pushUpload(formData.value.bridePhotoFile, url => formData.value.bridePhotoUrl = url)
  pushUpload(formData.value.groomPhotoFile, url => formData.value.groomPhotoUrl = url)
  pushUpload(formData.value.photoCoupleFile, url => formData.value.photoCoupleUrl = url)
  
  loveStories.value.forEach((story, index) => {
    pushUpload(story.photoFile, url => loveStories.value[index].photoUrl = url)
  })
  
  formData.value.gallery.forEach((image, index) => {
    pushUpload(image.file, url => formData.value.gallery[index].url = url)
  })
  
  pushUpload(formData.value.denahFile, url => formData.value.denahUrl = url)

  formData.value.eWalletLink.forEach((wallet, index) => {
    pushUpload(wallet.wallet_imageFile, url => formData.value.eWalletLink[index].wallet_imageUrl = url)
  })
  
  formData.value.bankAccounts.forEach((account, index) => {
    pushUpload(account.bankLogoFile, url => formData.value.bankAccounts[index].bankLogoUrl = url)
  })

  await Promise.all(uploads)
}

async function uploadFileToBackend(file) {
  const data = await uploadFileApi(file)
  if (!data.fileUrl) throw new Error('Upload failed')
  return data.fileUrl
}

onMounted(() => {
  const stored = localStorage.getItem('selectedSections')
  const finalPayloadStored = localStorage.getItem('finalPayload')
  
  if (!stored) {
    router.push('/create')
    return
  }
  
  if (finalPayloadStored) {
    try {
      finalPayload.value = JSON.parse(finalPayloadStored)
      mapPayloadToFormData(finalPayload.value)
    } catch(e) {
      console.error("Error parsing stored payload", e)
    }
  }
  
  const activeSections = JSON.parse(stored) || []
  sections.value = activeSections.reduce((acc, key) => {
    acc[key] = true
    return acc
  }, {})
})

function mapPayloadToFormData(payload) {
  if(!payload) return
  
  formData.value.title = payload.title || ''
  formData.value.brideName = payload.brideName || ''
  formData.value.groomName = payload.groomName || ''
  formData.value.bridePhoto = payload.bridePhotoUrl || ''
  formData.value.groomPhoto = payload.groomPhotoUrl || ''
  formData.value.templateName = payload.templateName || ''
  formData.value.quote = payload.quoteText || ''
  formData.value.quoteType = payload.quoteType || 'default'
  formData.value.dateTime = payload.dateTime || ''
  formData.value.music = payload.isCustomMusic ? 'custom' : payload.musicChoice || ''
  formData.value.musicFileName = payload.isCustomMusic ? payload.musicChoice : ''
  formData.value.photoCouple = payload.photoCoupleUrl || ''
  
  if(payload.galleryImages) {
     formData.value.gallery = payload.galleryImages.map(img => ({ preview: img }))
  }

  formData.value.isSingleEvent = payload.mergeEvents
  
  if(payload.akadLocation) {
     formData.value.akadMap = payload.akadLocation.mapUrl
     formData.value.akadDesc = payload.akadLocation.description
     formData.value.akadDateTime = payload.akadLocation.dateTime
  }
  
  if(payload.resepsiLocation) {
     formData.value.resepsiMap = payload.resepsiLocation.mapUrl
     formData.value.resepsiDesc = payload.resepsiLocation.description
     formData.value.resepsiDateTime = payload.resepsiLocation.dateTime
  }

  if(payload.mergeEvents && payload.resepsiLocation) {
     formData.value.map = payload.resepsiLocation.mapUrl
     formData.value.mapDesc = payload.resepsiLocation.description
  }

  formData.value.brideParents = payload.parents?.brideParents || ''
  formData.value.groomParents = payload.parents?.groomParents || ''
  formData.value.videoPrewedding = payload.videoPrewedding || ''
  formData.value.turutMengundang = payload.turutMengundang || ''
  formData.value.footerText = payload.footerText || ''
  formData.value.healthProtocol = payload.healthProtocol || false
  formData.value.enableCover = payload.enableCover !== false // Default true
  formData.value.liveStreamingLink = payload.liveStreamingLink || ''
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.form-label {
  display: block;
  font-weight: 600;
  color: #a47148; /* mocha */
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.form-input:focus {
  outline: none;
  border-color: #a47148;
  box-shadow: 0 0 0 3px rgba(164, 113, 72, 0.1);
}

.form-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
