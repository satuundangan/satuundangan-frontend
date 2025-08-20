<template>
  <div class="min-h-screen bg-[#FFFDF8] font-sans px-6 py-10">
    <h1 class="text-3xl font-bold text-mocha text-center mb-10">Langkah 3: Isi Data Undangan</h1>

    <div class="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-300 space-y-8">

      <!-- Data Mempelai -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold text-center text-mocha border-b pb-2">Data Mempelai</h2>
        <div class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mempelai Wanita -->
            <!-- Mempelai Wanita -->
            <div class="space-y-4" data-field="brideName">
              <div class="">

                <h3 class="text-mocha font-semibold">Mempelai Wanita <span class="text-red-500">*</span></h3>
                <input v-model="formData.brideName" @input="validateField('brideName')" type="text"
                  placeholder="Nama Lengkap Wanita"
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.brideName ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.brideName" class="text-red-500 text-sm">{{ requiredFields.brideName }}</p>
              </div>
              <div>

                <input v-model="formData.brideParents" @input="validateField('brideParents')" type="text"
                  placeholder="Nama Orang Tua Wanita"
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.brideParents ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.brideParents" class="text-red-500 text-sm">{{ requiredFields.brideParents }}
                </p>
              </div>

              <!-- Upload Foto Wanita -->
              <div>
                <label class="block text-sm font-medium text-mocha mb-1">Foto Mempelai Wanita <span
                    class="text-red-500">*</span></label>
                <input type="file" accept="image/*" @change="handleBridePhotoUpload"
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.bridePhoto ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.bridePhoto" class="text-red-500 text-sm">{{ requiredFields.bridePhoto }}</p>
                <div v-if="formData.bridePhoto" class="mt-2">
                  <img :src="formData.bridePhoto" alt="Foto Mempelai Wanita"
                    class="max-w-48 h-72 object-cover rounded-xl shadow" />
                </div>
              </div>
            </div>

            <!-- Mempelai Pria -->
            <div class="space-y-4" data-field="groomName">
              <div class="">
                <h3 class="text-mocha font-semibold">Mempelai Pria <span class="text-red-500">*</span></h3>
                <input v-model="formData.groomName" @input="validateField('groomName')" type="text"
                  placeholder="Nama Lengkap Pria"
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.groomName ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.groomName" class="text-red-500 text-sm">{{ requiredFields.groomName }}</p>
              </div>
              <div class="">

                <input v-model="formData.groomParents" @input="validateField('groomParents')" type="text"
                  placeholder="Nama Orang Tua Pria"
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.groomParents ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.groomParents" class="text-red-500 text-sm">{{ requiredFields.groomParents }}
                </p>
              </div>
              <!-- Upload Foto Pria -->
              <div>
                <label class="block text-sm font-medium text-mocha mb-1">Foto Mempelai Pria <span
                    class="text-red-500">*</span></label>
                <input type="file" accept="image/*" @change="handleGroomPhotoUpload"
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.groomPhoto ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.groomPhoto" class="text-red-500 text-sm">{{ requiredFields.groomPhoto }}</p>
                <div v-if="formData.groomPhoto" class="mt-2">
                  <img :src="formData.groomPhoto" alt="Foto Mempelai Pria"
                    class="max-w-48 h-72 object-cover rounded-xl shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-field="title">
        <label class="block text-mocha font-semibold mb-2">Judul Undangan <span class="text-red-500">*</span></label>
        <input v-model="formData.title" @input="validateField('title')" type="text"
          placeholder="Contoh: The Wedding of..."
          :class="['w-full p-2 border rounded-xl bg-white', validationErrors.title ? 'border-red-500' : 'border-gray-300']" />
        <p v-if="validationErrors.title" class="text-red-500 text-sm">{{ requiredFields.title }}</p>
        <p v-if="suggestedTitle && formData.title !== suggestedTitle" class="text-sm text-gray-400 italic mt-1">
          Saran: {{ suggestedTitle }}
          <button @click="formData.title = suggestedTitle" class="text-blue-600 underline ml-2">Gunakan</button>
        </p>
      </div>


      <!-- Quote Ayat -->
      <div v-if="sections.quote">
        <label class="block text-mocha font-semibold mb-2">Quote Ayat</label>
        <div class="space-y-2">
          <div class="flex gap-4 items-center">
            <label class="flex items-center gap-2">
              <input type="radio" value="default" v-model="formData.quoteType" /> Default
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="custom" v-model="formData.quoteType" /> Custom
            </label>
          </div>
          <textarea v-if="formData.quoteType === 'custom'" v-model="formData.quote" rows="3"
            class="w-full p-2 border border-gray-300 rounded-xl resize-none"
            placeholder="Tulis ayat pilihanmu..."></textarea>
          <p v-else class="text-sm text-gray-500 italic">
            “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...”
          </p>
        </div>
      </div>

      <div class="mb-6" v-if="sections.loveStory">
        <label class="block text-mocha font-semibold mb-4">Love Story</label>

        <div v-if="!loveStories.length" class="text-gray-400 italic text-sm mb-4">Belum ada story yang ditambahkan.
        </div>

        <div v-for="(story, index) in loveStories" :key="index"
          class="mb-4 border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300">

          <!-- Header (Click to toggle) -->
          <div @click="story.isOpen = !story.isOpen"
            class="cursor-pointer flex justify-between items-center px-4 py-3 bg-mocha/10 hover:bg-mocha/20">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-mocha">{{ story.title || 'Story ' + (index + 1) }}</span>
              <span class="text-xs text-gray-400">{{ story.date }}</span>
            </div>
            <div class="text-mocha text-sm">{{ story.isOpen ? '−' : '+' }}</div>
          </div>

          <!-- Collapsible Content -->
          <transition name="fade">
            <div v-show="story.isOpen" class="p-4 space-y-4">

              <!-- Title -->
              <div>
                <label class="block text-sm font-semibold text-mocha mb-1">Judul Cerita</label>
                <input v-model="story.title" type="text"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500"
                  placeholder="Contoh: Awal Bertemu">
              </div>



              <!-- Foto -->
              <div>
                <label class="block text-sm font-semibold text-mocha mb-1">Upload Foto</label>
                <input type="file" @change="handleFileUploadLoveStory($event, index)" accept="image/*"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500">
                <div v-if="story.photo" class="mt-2">
                  <img :src="story.photo" alt="Preview" class="h-48 object-cover rounded-lg shadow-md" />
                </div>
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="block text-sm font-semibold text-mocha mb-1">Deskripsi</label>
                <textarea v-model="story.description" rows="3"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500 resize-none"
                  placeholder="Ceritakan kisahnya..."></textarea>
              </div>
              <!-- Delete -->
              <div class="text-right">
                <button @click="removeLoveStory(index)"
                  class="text-xs px-4 py-2 bg-red-500 rounded-full text-white hover:underline">
                  Hapus
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="text mt-4">
          <button @click="addLoveStory"
            class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
            + Tambah Cerita
          </button>
        </div>
      </div>


      <!-- Foto Mempelai -->
      <div v-if="sections.photoCouple" data-field="photoCouple">
        <label class="block text-mocha font-semibold mb-2">Foto Mempelai (Background Awal) <span
            class="text-red-500">*</span></label>
        <input type="file" accept="image/*" @change="handleCouplePhotoUpload"
          :class="['w-full p-2 border rounded-xl bg-white', validationErrors.photoCouple ? 'border-red-500' : 'border-gray-300']" />
        <p v-if="validationErrors.photoCouple" class="text-red-500 text-sm">{{ requiredFields.photoCouple }}</p>

        <div class="">
          <div v-if="formData.photoCouple">
            <p>Preview:</p>
            <img :src="formData.photoCouple" class="mt-2 rounded-xl h-48 object-cover shadow" />
          </div>
        </div>
      </div>

      <!-- Musik -->
      <div v-if="sections.music">
        <label class="block text-mocha font-semibold mb-2">Musik Latar</label>
        <select v-model="formData.music" class="w-full p-2 border border-gray-300 rounded-xl bg-white">
          <option disabled value="">Pilih Musik</option>
          <option value="romantic">Romantic Instrumental</option>
          <option value="acoustic">Acoustic Vibes</option>
          <option value="classic">Classic Wedding</option>
          <option value="custom">Custom (Premium Only)</option>
        </select>

        <div v-if="formData.music === 'custom' && isPremiumTemplate" class="mt-3">
          <label class="block text-sm font-semibold text-mocha mb-1">Upload File Musik</label>
          <input type="file" accept="audio/*" @change="handleMusicUpload"
            class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
          <p v-if="formData.musicFileName" class="text-sm text-gray-500 mt-1">{{ formData.musicFileName }}</p>
        </div>
        <p v-if="formData.music === 'custom' && !isPremiumTemplate" class="text-sm text-red-500 mt-2 italic">
          Upload musik hanya tersedia di template Premium
        </p>
      </div>

      <div v-if="sections.map" data-field="isSingleEvent">
        <label class="block text-mocha font-semibold mb-2">Apakah Acara Digabung? <span
            class="text-red-500">*</span></label>
        <div class="flex gap-4 items-center">
          <label class="flex items-center gap-2">
            <input type="radio" :value="true" v-model="formData.isSingleEvent" /> Ya, satu lokasi
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" :value="false" v-model="formData.isSingleEvent" /> Tidak, Akad & Resepsi dipisah
          </label>
        </div>
        <p v-if="validationErrors.isSingleEvent" class="text-red-500 text-sm">{{ requiredFields.isSingleEvent }}</p>

        <div v-if="formData.isSingleEvent != null">
          <!-- Gabungan -->
          <div v-if="formData.isSingleEvent">
            <label class="block font-medium mt-4 mb-1">Link Google Maps <span class="text-red-500">*</span></label>
            <input v-model="formData.map" @input="validateField('map')" type="link"
              placeholder="https://maps.google.com/..."
              :class="['w-full p-2 border rounded-xl bg-white', validationErrors.map ? 'border-red-500' : 'border-gray-300']" />
            <p v-if="validationErrors.map" class="text-red-500 text-sm">{{ requiredFields.map }}</p>

            <!-- Tanggal -->
            <div class="mt-4" data-field="dateTime">
              <label class="block text-sm font-semibold text-mocha mb-1">Tanggal & Waktu Acara <span
                  class="text-red-500">*</span></label>
              <input v-model="formData.dateTime" type="datetime-local"
                :class="['w-full p-2 border rounded-md bg-white', validationErrors.dateTime ? 'border-red-500' : 'border-gray-300']">
              <p v-if="validationErrors.dateTime" class="text-red-500 text-sm">{{ requiredFields.dateTime }}</p>
            </div>
            <input v-model="formData.mapDesc" type="text" placeholder="Keterangan Lokasi"
              class="w-full p-2 mt-2 border border-gray-300 rounded-xl bg-white" />
          </div>

          <!-- Akad & Resepsi -->
          <div v-else>
            <div class="grid md:grid-cols-2 gap-4">
              <div data-field="akadMap">
                <label class="block font-medium mt-4 mb-1">Link Maps Akad <span class="text-red-500">*</span></label>
                <input v-model="formData.akadMap" @input="validateField('akadMap')" type="link"
                  placeholder="https://maps.google.com/..."
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.akadMap ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.akadMap" class="text-red-500 text-sm">{{ requiredFields.akadMap }}</p>

                <input v-model="formData.akadDesc" type="text" placeholder="Keterangan Lokasi Akad"
                  class="w-full p-2 mt-2 border border-gray-300 rounded-xl bg-white" />

                <div data-field="akadDateTime">
                  <label class="block text-sm font-semibold text-mocha my-1">Tanggal Akad <span
                      class="text-red-500">*</span></label>
                  <input v-model="formData.akadDateTime" type="datetime-local"
                    :class="['w-full p-2 border rounded-md bg-white', validationErrors.akadDateTime ? 'border-red-500' : 'border-gray-300']">
                  <p v-if="validationErrors.akadDateTime" class="text-red-500 text-sm">{{ requiredFields.akadDateTime }}
                  </p>
                </div>
              </div>

              <div data-field="resepsiMap">
                <label class="block font-medium mt-4 mb-1">Link Maps Resepsi <span class="text-red-500">*</span></label>
                <input v-model="formData.resepsiMap" @input="validateField('resepsiMap')" type="link"
                  placeholder="https://maps.google.com/..."
                  :class="['w-full p-2 border rounded-xl bg-white', validationErrors.resepsiMap ? 'border-red-500' : 'border-gray-300']" />
                <p v-if="validationErrors.resepsiMap" class="text-red-500 text-sm">{{ requiredFields.resepsiMap }}</p>

                <input v-model="formData.resepsiDesc" type="text" placeholder="Keterangan Lokasi Resepsi"
                  class="w-full p-2 mt-2 border border-gray-300 rounded-xl bg-white" />

                <div data-field="resepsiDateTime">
                  <label class="block text-sm font-semibold text-mocha my-1">Tanggal Resepsi <span
                      class="text-red-500">*</span></label>
                  <input v-model="formData.resepsiDateTime" type="datetime-local"
                    :class="['w-full p-2 border rounded-md bg-white', validationErrors.resepsiDateTime ? 'border-red-500' : 'border-gray-300']">
                  <p v-if="validationErrors.resepsiDateTime" class="text-red-500 text-sm">{{
                    requiredFields.resepsiDateTime }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Tanggal & Waktu -->
      <div v-if="sections.countdown && !formData.isSingleEvent">
        <label class="block text-mocha font-semibold mb-2">Tanggal & Waktu Acara (Untuk Countdown)</label>
        <input v-model="formData.dateTime" type="datetime-local"
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
      </div>

      <!-- Nama Tamu Enkripsi -->
      <div v-if="sections.encryptedGuest">
        <label class="block text-mocha font-semibold mb-2">Nama Tamu Terenkripsi?</label>
        <select v-model="formData.encryptedGuest" class="w-full p-2 border border-gray-300 rounded-xl bg-white">
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>
      </div>

      <!-- Galeri -->
      <!-- <div v-if="sections.gallery ?? true"> -->
      <div>
        <label class="block text-mocha font-semibold mb-2">Galeri Foto Mempelai</label>
        <input type="file" accept="image/*" multiple @change="handleGalleryUpload"
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />

        <div v-if="formData.gallery.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          <div v-for="(img, i) in formData.gallery" :key="i" class="relative group">
            <img :src="img.preview" class="w-full h-40 object-cover rounded-lg shadow" />
            <button @click="removeGalleryImage(i)"
              class="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition">
              ✕
            </button>
          </div>
        </div>
      </div>


      <div class="mb-6" v-if="sections.denah" data-field="denah">
        <label class="block text-mocha font-semibold mb-2">Gambar Denah Ruangan <span
            class="text-red-500">*</span></label>
        <input type="file" accept="image/*" @change="handleDenahUpload"
          :class="['w-full p-2 bg-white border rounded-xl', validationErrors.denah ? 'border-red-500' : 'border-gray-300']" />
        <p v-if="validationErrors.denah" class="text-red-500 text-sm">{{ requiredFields.denah }}</p>
        <div v-if="formData.denah" class="mt-2">
          <img :src="formData.denah" alt="Denah" class="h-48 object-cover rounded-xl shadow-md" />
        </div>
      </div>

      <!-- DAFTAR MENU MAKANAN -->
      <div class="mb-6" v-if="sections.foodList">
        <label class="block text-mocha font-semibold mb-2">Daftar Menu Makanan</label>
        <div v-for="(item, index) in foodList" :key="index" class="flex items-center gap-2 mb-2">
          <input v-model="foodList[index]" type="text"
            class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="Contoh: Nasi Kebuli" />
          <button @click="removeFood(index)" class="text-red-500 text-sm hover:underline">Hapus</button>
        </div>
        <button @click="addFood"
          class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
          + Tambah Menu
        </button>
      </div>


      <!-- ALAMAT KADO -->
      <div class="mb-6" v-if="sections.gift">
        <label class="block text-mocha font-semibold mb-2">Alamat Kirim Kado</label>
        <div v-for="(gift, index) in giftAddresses" :key="index" class="flex gap-2 items-center mb-2">
          <input v-model="giftAddresses[index]" type="text"
            class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="Contoh: Jl. Melati No. 99" />
          <button @click="removeGift(index)" class="text-red-500 text-sm hover:underline">Hapus</button>
        </div>
        <button @click="addGift"
          class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
          + Tambah Alamat Kado
        </button>
      </div>
      <!-- E-WALLET SECTION -->
      <div class="mb-6" v-if="sections.gift">
        <label class="block text-mocha font-semibold mb-2">QRIS / E-Wallet</label>

        <div v-for="(wallet, index) in formData.eWalletLink" :key="index"
          class="mb-4 border border-gray-300 rounded-xl bg-white p-4 relative">

          <button @click="removeWallet(index)"
            class="absolute top-2 right-3 text-xs text-red-500 hover:underline">Hapus</button>

          <!-- Nama Provider -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Nama E-Wallet (Contoh: DANA, OVO, Gopay)</label>
            <input v-model="wallet.wallet_provider" type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500" />
          </div>

          <!-- Nomor atau ID -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Nomor</label>
            <input v-model="wallet.wallet_number" type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="Contoh: 08123456789" />
          </div>

          <!-- Screenshot QRIS -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Upload Gambar QRIS / Screenshot</label>
            <input type="file" accept="image/*" @change="handleWalletImageUpload($event, index)"
              class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500" />
            <div v-if="wallet.wallet_image" class="mt-3">
              <img :src="wallet.wallet_image" alt="QRIS" class="h-48 w-full object-contain rounded-lg shadow" />
            </div>
          </div>
        </div>

        <button @click="addWallet"
          class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
          + Tambah QRIS / E-Wallet
        </button>
      </div>

      <!-- BANK ACCOUNT SECTION -->
      <div class="mb-6" v-if="sections.gift">
        <label class="block text-mocha font-semibold mb-2">Rekening Bank</label>

        <div v-for="(account, index) in formData.bankAccounts" :key="index"
          class="mb-4 border border-gray-300 rounded-xl bg-white p-4 relative">

          <button @click="removeBankAccount(index)"
            class="absolute top-2 right-3 text-xs text-red-500 hover:underline">Hapus</button>

          <!-- Bank Name -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Nama Bank (Contoh: BCA, Mandiri, BRI)</label>
            <input v-model="account.bankName" type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500" />
          </div>

          <!-- Account Number -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Nomor Rekening</label>
            <input v-model="account.accountNumber" type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="Contoh: 1234567890" />
          </div>

          <!-- Account Holder Name -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Atas Nama</label>
            <input v-model="account.accountName" type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="Nama pemilik rekening" />
          </div>

          <!-- Bank Logo -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Logo Bank (Opsional)</label>
            <input type="file" accept="image/*" @change="handleBankLogoUpload($event, index)"
              class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500" />
            <div v-if="account.bankLogo" class="mt-3">
              <img :src="account.bankLogo" alt="Bank Logo" class="h-24 w-24 object-contain rounded-lg shadow" />
            </div>
          </div>
        </div>

        <button @click="addBankAccount"
          class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
          + Tambah Rekening Bank
        </button>
      </div>

      <!-- Sosial Media -->
      <div class="mb-6">
        <label class="block text-black font-semibold mb-4">Sosial Media Mempelai</label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Bride -->
          <div>
            <h3 class="font-semibold text-mocha mb-2">Mempelai Wanita</h3>
            <div class="space-y-2">
              <input v-model="formData.sosmedBride.instagram" type="text" placeholder="Instagram"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedBride.tiktok" type="text" placeholder="TikTok"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedBride.youtube" type="text" placeholder="YouTube"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedBride.other" type="text"
                placeholder="Link lainnya (Linktree, Website, dll)"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
            </div>
          </div>

          <!-- Groom -->
          <div>
            <h3 class="font-semibold text-mocha mb-2">Mempelai Pria</h3>
            <div class="space-y-2">
              <input v-model="formData.sosmedGroom.instagram" type="text" placeholder="Instagram"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedGroom.tiktok" type="text" placeholder="TikTok"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedGroom.youtube" type="text" placeholder="YouTube"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedGroom.other" type="text"
                placeholder="Link lainnya (Linktree, Website, dll)"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Live Stream -->
      <div>
        <label class="block text-mocha font-semibold mb-2">Link Live Streaming</label>
        <input v-model="formData.liveLink" type="text" placeholder="https://youtube.com/..."
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
      </div>

      <div class="text-center pt-6">
        <button @click="saveAndPreview" :disabled="isUploading"
          class="bg-mocha text-white font-semibold py-3 px-8 rounded-full hover:bg-mocha/90 shadow">
          <span v-if="!isUploading">Lihat Preview</span>
          <span v-else>Mengupload...</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { uploadFileApi } from '@/api/file'

// ==== Router ====
const router = useRouter()
const isUploading = ref(false);

// ==== Global States ====
const isPremiumTemplate = ref(false) // set true jika template premium

// ==== Reactive Data ====
const formData = ref({
  // Data Umum
  title: '',
  brideName: '',
  groomName: '',
  templateName: '',
  isPublished: false,
  quote: '',
  quoteSource: 'bebas',
  quoteType: '',

  // Musik
  music: '',
  musicFile: null,
  musicFileName: '',

  // Foto & Gallery
  photoCouple: '',
  gallery: [],

  // Lokasi & Tanggal
  isSingleEvent: null,
  akadMap: '',
  akadDesc: '',
  akadDateTime: '',
  resepsiMap: '',
  resepsiDesc: '',
  resepsiDateTime: '',
  map: '',
  mapDesc: '',
  date: '',

  // Fitur Tambahan
  denah: '',
  encryptedGuest: 'ya',
  rsvp: 'ya',
  wishes: 'ya',

  // Sosmed & Live
  sosmedBride: {
    instagram: '',
    tiktok: '',
    youtube: '',
    other: ''
  },
  sosmedGroom: {
    instagram: '',
    tiktok: '',
    youtube: '',
    other: ''
  },
  liveStreamingLink: '',

  // Orang Tua
  brideParents: '',
  groomParents: '',

  // Wallet
  eWalletLink: [],
  bankAccounts: []
})

// ==== Section Checklist ====
const sections = ref({
  // quote: 'Quote Ayat',
  // loveStory: 'Love Story',
  // photoCouple: 'Foto Mempelai',
  // music: 'Musik Latar',
  // map: 'Google Map',
  // rsvp: 'RSVP',
  // wishes: 'Ucapan untuk Mempelai',
  // likes: 'Like Count',
  // countdown: 'Hitung Mundur',
  // gallery: 'Gallery',
  // denah: 'Denah Ruangan',
  // encryptedGuest: 'Enkripsi Nama Tamu',
  // foodList: 'List Makanan/Minuman',
  // gift: 'Amplop Digital & Alamat Kado',
})

// ==== Nested States ====
const loveStories = ref([])
const foodList = ref([])
const giftAddresses = ref([])
const finalPayload = ref()

// ==== Love Story ====
const addLoveStory = () => {
  loveStories.value.push({
    title: '',
    date: '',
    photo: '',
    description: '',
    isOpen: true
  })
}

const removeLoveStory = (index) => loveStories.value.splice(index, 1)

// Foto Mempelai
const handleCouplePhotoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.photoCouple = reader.result; // Untuk preview
    formData.value.photoCoupleFile = file;     // Untuk upload nanti
  };
  reader.readAsDataURL(file);
};

// Love Story Photo
const handleFileUploadLoveStory = (event, index) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    loveStories.value[index].photo = reader.result; // Untuk preview
    loveStories.value[index].photoFile = file;      // Untuk upload nanti
  };
  reader.readAsDataURL(file);
};

function handleBridePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.bridePhoto = reader.result; // For preview
    formData.value.bridePhotoFile = file;     // For upload later
  };
  reader.readAsDataURL(file);
}

function handleGroomPhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.groomPhoto = reader.result; // For preview
    formData.value.groomPhotoFile = file;     // For upload later
  };
  reader.readAsDataURL(file);
}

// Gallery
const handleGalleryUpload = (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      formData.value.gallery.push({
        preview: reader.result, // Untuk preview di frontend
        file: file             // Untuk diupload ke backend
      })
    }
    reader.readAsDataURL(file)
  })
}
const removeGalleryImage = (index) => {
  formData.value.gallery.splice(index, 1)
}

// Denah
const handleDenahUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.denah = reader.result; // Untuk preview
    formData.value.denahFile = file;      // Untuk upload nanti
  };
  reader.readAsDataURL(file);
};

// E-Wallet
const handleWalletImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.eWalletLink[index].wallet_image = reader.result; // Untuk preview
    formData.value.eWalletLink[index].wallet_imageFile = file;      // Untuk upload nanti
  };
  reader.readAsDataURL(file);
};

// ==== Musik ====
const handleMusicUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.musicFile = reader.result
    formData.value.musicFileName = file.name
  }
  reader.readAsDataURL(file)
}


// ==== Food List ====
const addFood = () => foodList.value.push('')
const removeFood = (index) => foodList.value.splice(index, 1)

// ==== Alamat Kado ====
const addGift = () => giftAddresses.value.push('')
const removeGift = (index) => giftAddresses.value.splice(index, 1)

// ==== E-Wallet ====
const addWallet = () => {
  formData.value.eWalletLink.push({
    wallet_provider: '',
    wallet_image: '',
    wallet_number: ''
  })
}
const removeWallet = (index) => formData.value.eWalletLink.splice(index, 1)

function addBankAccount() {
  formData.value.bankAccounts.push({
    bankName: "",
    accountNumber: "",
    accountName: "",
    bankLogo: ""
  });
}

function removeBankAccount(index) {
  formData.value.bankAccounts.splice(index, 1);
}

const handleBankLogoUpload = (event, index) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.bankAccounts[index].bankLogo = reader.result; // Untuk preview
    formData.value.bankAccounts[index].bankLogoFile = file;      // Untuk upload nanti
  };
  reader.readAsDataURL(file);
};

// ==== Generate Payload ====
function generatePayload() {
  const payload = {
    title: formData.value.title,
    slug: formData.value.title.toLowerCase().replace(/\s+/g, '-'),
    brideName: formData.value.brideName,
    groomName: formData.value.groomName,
    bridePhotoUrl: formData.value.bridePhotoUrl || formData.value.bridePhoto,
    groomPhotoUrl: formData.value.groomPhotoUrl || formData.value.groomPhoto,
    templateName: formData.value.templateName,
    isPublished: formData.value.isPublished,
    quoteSource: formData.value.quoteSource,
    quoteType: formData.value.quoteType,
    quoteText: formData.value.quote,
    dateTime: formData.value.dateTime,
    photoCoupleUrl: formData.value.photoCoupleUrl || formData.value.photoCouple,

    loveStory: loveStories.value.map(story => ({
      title: story.title,
      images: story.photoUrl || story.photo,
      content: story.description,
      date: story.date
    })),

    galleryImages: formData.value.gallery.map(img => img.url || img.preview),
    floorPlanImageUrl: formData.value.denahUrl || formData.value.denah,

    eWalletLink: formData.value.eWalletLink.map(wallet => ({
      wallet_provider: wallet.wallet_provider,
      wallet_image: wallet.wallet_imageUrl || wallet.wallet_image,
      wallet_number: wallet.wallet_number
    })),

    bankAccounts: formData.value.bankAccounts.map(bankAccount => ({
      bankName: bankAccount.bankName,
      accountNumber: bankAccount.accountNumber,
      accountName: bankAccount.accountName,
      bankLogo: bankAccount.bankLogoUrl || bankAccount.bankLogo,
    })),

    musicChoice: isPremiumTemplate.value && formData.value.music === 'custom'
      ? formData.value.musicFileName
      : formData.value.music,
    isSingleEvent: formData.value.isSingleEvent,
    isCustomMusic: isPremiumTemplate.value && formData.value.music === 'custom',
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
      items: foodList.value
    },
    giftDeliveryAddress: giftAddresses.value,
    socialMediaBrides: {
      instagram: formData.value.sosmedBride.instagram,
      tiktok: formData.value.sosmedBride.tiktok,
      youtube: formData.value.sosmedBride.youtube,
      lainnya: formData.value.sosmedBride.otherSocial
    },
    socialMediaGroom: {
      instagram: formData.value.sosmedGroom.instagram,
      tiktok: formData.value.sosmedGroom.tiktok,
      youtube: formData.value.sosmedGroom.youtube,
      lainnya: formData.value.sosmedGroom.otherSocial
    },
    parents: {
      brideParents: formData.value.brideParents,
      groomParents: formData.value.groomParents
    },
    liveStreamingLink: formData.value.liveStreamingLink,
    selectedSections: Object.keys(sections.value).filter(k => !!sections.value[k]),
    enableGuestMessage: formData.value.wishes === 'ya'

  }

  localStorage.setItem('finalPayload', JSON.stringify(payload))
  console.log('[Payload Generated]', payload)
}

// ==== Action ====
// Add these to your script setup
const validationErrors = ref({
  // Bride & Groom Info
  brideName: false,
  groomName: false,
  brideParents: false,
  groomParents: false,
  bridePhoto: false,
  groomPhoto: false,

  // Wedding Info
  title: false,
  dateTime: false,
  photoCouple: false,

  // Location Info
  isSingleEvent: false,
  map: false,
  akadMap: false,
  resepsiMap: false,
  akadDateTime: false,
  resepsiDateTime: false,

  // Love Story
  loveStories: [],

  // Gallery
  gallery: false,

  // Other Sections
  denah: false,
  music: false,
});

const requiredFields = {
  // Basic Info
  brideName: 'Nama mempelai wanita wajib diisi',
  groomName: 'Nama mempelai pria wajib diisi',
  brideParents: 'Nama orang tua wanita wajib diisi',
  groomParents: 'Nama orang tua pria wajib diisi',
  bridePhoto: 'Foto mempelai wanita wajib diupload',
  groomPhoto: 'Foto mempelai pria wajib diupload',
  title: 'Judul undangan wajib diisi',
  dateTime: 'Tanggal dan waktu acara wajib diisi',
  photoCouple: 'Foto utama pasangan wajib diupload',

  // Location
  isSingleEvent: 'Pilih jenis acara (digabung atau dipisah)',
  map: 'Link Google Maps wajib diisi',
  akadMap: 'Link Google Maps akad wajib diisi',
  resepsiMap: 'Link Google Maps resepsi wajib diisi',
  akadDateTime: 'Tanggal dan waktu akad wajib diisi',
  resepsiDateTime: 'Tanggal dan waktu resepsi wajib diisi',

  // Other
  gallery: 'Minimal upload 1 foto untuk galeri',
  denah: 'Denah ruangan wajib diupload',
  music: 'Pilih musik latar',
};

// Add this function
function validateForm() {
  let isValid = true;

  // Reset all errors
  validationErrors.value = Object.keys(validationErrors.value).reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});

  // Validate basic info
  if (!formData.value.brideName?.trim()) {
    validationErrors.value.brideName = true;
    isValid = false;
  }

  if (!formData.value.groomName?.trim()) {
    validationErrors.value.groomName = true;
    isValid = false;
  }

  if (!formData.value.brideParents?.trim()) {
    validationErrors.value.brideParents = true;
    isValid = false;
  }

  if (!formData.value.groomParents?.trim()) {
    validationErrors.value.groomParents = true;
    isValid = false;
  }

  if (!formData.value.bridePhoto) {
    validationErrors.value.bridePhoto = true;
    isValid = false;
  }

  if (!formData.value.groomPhoto) {
    validationErrors.value.groomPhoto = true;
    isValid = false;
  }

  if (!formData.value.title?.trim()) {
    validationErrors.value.title = true;
    isValid = false;
  }

  if (!formData.value.photoCouple) {
    validationErrors.value.photoCouple = true;
    isValid = false;
  }

  // Validate date/time based on event type
  if (formData.value.isSingleEvent === null) {
    validationErrors.value.isSingleEvent = true;
    isValid = false;
  } else if (formData.value.isSingleEvent) {
    if (!formData.value.dateTime) {
      validationErrors.value.dateTime = true;
      isValid = false;
    }
    if (!formData.value.map?.trim()) {
      validationErrors.value.map = true;
      isValid = false;
    }
  } else {
    if (!formData.value.akadMap?.trim()) {
      validationErrors.value.akadMap = true;
      isValid = false;
    }
    if (!formData.value.resepsiMap?.trim()) {
      validationErrors.value.resepsiMap = true;
      isValid = false;
    }
    if (!formData.value.akadDateTime) {
      validationErrors.value.akadDateTime = true;
      isValid = false;
    }
    if (!formData.value.resepsiDateTime) {
      validationErrors.value.resepsiDateTime = true;
      isValid = false;
    }
  }

  // Validate love stories
  validationErrors.value.loveStories = loveStories.value.map(story => ({
    title: !story.title?.trim(),
    date: !story.date?.trim(),
    description: !story.description?.trim(),
    photo: !story.photo
  }));

  if (loveStories.value.length > 0) {
    const hasInvalidStory = validationErrors.value.loveStories.some(
      story => story.title || story.date || story.description || story.photo
    );
    if (hasInvalidStory) isValid = false;
  }

  // Validate gallery
  if (formData.value.gallery.length === 0) {
    validationErrors.value.gallery = true;
    isValid = false;
  }

  // Validate other sections
  if (sections.value.denah && !formData.value.denah) {
    validationErrors.value.denah = true;
    isValid = false;
  }

  if (sections.value.music && !formData.value.music) {
    validationErrors.value.music = true;
    isValid = false;
  }

  return isValid;
}

// Update the saveAndPreview function
async function saveAndPreview() {
  if (!validateForm()) {
    // Scroll to the first error
    const firstErrorField = Object.keys(validationErrors.value).find(
      key => validationErrors.value[key] === true ||
        (Array.isArray(validationErrors.value[key]) && validationErrors.value[key].some(item => item))
    );

    if (firstErrorField) {
      const element = document.querySelector(`[data-field="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }

    return;
  }

  isUploading.value = true;
  try {
    await uploadAllFiles();
    generatePayload();
    router.push('/preview');
  } catch (error) {
    console.error(error);
    alert('Upload gagal, silakan coba lagi');
  } finally {
    isUploading.value = false;
  }
}

// Add this helper function for real-time validation
function validateField(fieldName) {
  if (requiredFields[fieldName]) {
    validationErrors.value[fieldName] = !formData.value[fieldName]?.trim();
  }
}

async function uploadAllFiles() {
  const uploadPromises = [];

  // Upload Bride Photo
  if (formData.value.bridePhotoFile) {
    uploadPromises.push(
      uploadFileToBackend(formData.value.bridePhotoFile)
        .then(url => formData.value.bridePhotoUrl = url)
    );
  }

  // Upload Groom Photo
  if (formData.value.groomPhotoFile) {
    uploadPromises.push(
      uploadFileToBackend(formData.value.groomPhotoFile)
        .then(url => formData.value.groomPhotoUrl = url)
    );
  }

  // 1. Upload Foto Mempelai
  if (formData.value.photoCoupleFile) {
    console.log(formData.value.photoCoupleFile)
    uploadPromises.push(
      uploadFileToBackend(formData.value.photoCoupleFile)
        .then(url => formData.value.photoCoupleUrl = url)
    );
  }

  // 2. Upload Love Story Photos
  loveStories.value.forEach((story, index) => {
    console.log(story.photoFile)
    if (story.photoFile) {
      uploadPromises.push(
        uploadFileToBackend(story.photoFile)
          .then(url => loveStories.value[index].photoUrl = url)
      );
    }
  });

  // 3. Upload Gallery Images
  formData.value.gallery.forEach((img, index) => {
    if (img.file) {
      uploadPromises.push(
        uploadFileToBackend(img.file)
          .then(url => {
            formData.value.gallery[index].url = url // Simpan URL hasil upload
          })
      );
    }
  });

  // 4. Upload Denah
  if (formData.value.denahFile) {
    uploadPromises.push(
      uploadFileToBackend(formData.value.denahFile)
        .then(url => formData.value.denahUrl = url)
    );
  }

  // 5. Upload Wallet Images
  formData.value.eWalletLink.forEach((wallet, index) => {
    if (wallet.wallet_imageFile) {
      uploadPromises.push(
        uploadFileToBackend(wallet.wallet_imageFile)
          .then(url => formData.value.eWalletLink[index].wallet_imageUrl = url)
      );
    }
  });

  // 6. Upload Bank Images
  formData.value.bankAccounts.forEach((bankAccount, index) => {
    if (bankAccount.bankLogoFile) {
      uploadPromises.push(
        uploadFileToBackend(bankAccount.bankLogoFile)
          .then(url => formData.value.bankAccounts[index].bankLogoUrl = url)
      );
    }
  });

  // Tunggu semua upload selesai
  await Promise.all(uploadPromises);
}

async function uploadFileToBackend(file) {
  const data = await uploadFileApi(file)

  if (!data.fileUrl) {
    throw new Error('Upload failed');
  }

  return data.fileUrl;
}

const suggestedTitle = computed(() => {
  const groom = formData.value.groomName.trim()
  const bride = formData.value.brideName.trim()
  if (groom && bride) {
    return `The Wedding of ${groom} & ${bride}`
  }
  return ''
})
// ==== Lifecycle ====
onMounted(() => {
  const stored = localStorage.getItem('selectedSections')
  const finalPayloadStored = localStorage.getItem('finalPayload')

  if (!stored) return router.push('/create')

  // Parse finalPayload dari localStorage
  finalPayload.value = JSON.parse(finalPayloadStored);

  // Mapping finalPayload ke formData
  if (finalPayload.value) {
    mapPayloadToFormData(finalPayload.value);
  }

  const selected = JSON.parse(stored)
  const activeSections = selected || []

  sections.value = activeSections.reduce((obj, key) => {
    obj[key] = true
    return obj
  }, {})
})

// Fungsi untuk mapping payload ke formData
function mapPayloadToFormData(payload) {
  // Data Umum
  formData.value.title = payload.title || '';
  formData.value.brideName = payload.brideName || '';
  formData.value.groomName = payload.groomName || '';
  formData.value.bridePhoto = payload.bridePhotoUrl || '';
  formData.value.groomPhoto = payload.groomPhotoUrl || '';
  formData.value.templateName = payload.templateName || '';
  formData.value.isPublished = payload.isPublished || false;
  formData.value.quote = payload.quoteText || '';
  formData.value.quoteSource = payload.quoteSource || 'bebas';
  formData.value.quoteType = payload.quoteType || '';
  formData.value.dateTime = payload.dateTime || '';

  // Musik
  formData.value.music = payload.isCustomMusic ? 'custom' : payload.musicChoice || '';
  formData.value.musicFileName = payload.isCustomMusic ? payload.musicChoice : '';

  // Foto & Gallery
  formData.value.photoCouple = payload.photoCoupleUrl || '';
  formData.value.gallery = payload.galleryImages
    ? payload.galleryImages.map(img => ({ preview: img }))
    : [];
  // Lokasi & Tanggal
  formData.value.isSingleEvent = payload.mergeEvents;
  formData.value.akadMap = payload.akadLocation?.mapUrl || '';
  formData.value.akadDesc = payload.akadLocation?.description || '';
  formData.value.akadDateTime = payload.akadLocation?.dateTime || '';
  formData.value.resepsiMap = payload.resepsiLocation?.mapUrl || '';
  formData.value.resepsiDesc = payload.resepsiLocation?.description || '';
  formData.value.resepsiDateTime = payload.resepsiLocation?.dateTime || '';
  formData.value.map = payload.mergeEvents ? payload.resepsiLocation?.mapUrl || payload.akadLocation?.mapUrl || '' : '';
  formData.value.mapDesc = payload.mergeEvents ? payload.resepsiLocation?.description || payload.akadLocation?.description || '' : '';
  formData.value.date = payload.mergeEvents ? payload.resepsiLocation?.dateTime || payload.akadLocation?.dateTime || '' : '';

  // Fitur Tambahan
  formData.value.denah = payload.floorPlanImageUrl || '';
  formData.value.encryptedGuest = payload.encryptedGuestName ? 'ya' : 'tidak';
  formData.value.rsvp = 'ya'; // Default, sesuaikan jika ada di payload
  formData.value.wishes = payload.enableGuestMessage ? 'ya' : 'tidak';

  // Sosmed & Live
  formData.value.sosmedBride = {
    instagram: payload.socialMediaBrides?.instagram || '',
    tiktok: payload.socialMediaBrides?.tiktok || '',
    youtube: payload.socialMediaBrides?.youtube || '',
    other: payload.socialMediaBrides?.lainnya || ''
  };
  formData.value.sosmedGroom = {
    instagram: payload.socialMediaGroom?.instagram || '',
    tiktok: payload.socialMediaGroom?.tiktok || '',
    youtube: payload.socialMediaGroom?.youtube || '',
    other: payload.socialMediaGroom?.lainnya || ''
  };
  formData.value.liveStreamingLink = payload.liveStreamingLink || '';

  // Orang Tua
  formData.value.brideParents = payload.parents?.brideParents || '';
  formData.value.groomParents = payload.parents?.groomParents || '';

  // Wallet
  formData.value.eWalletLink = payload.eWalletLink ? payload.eWalletLink.map(wallet => ({
    wallet_provider: wallet.wallet_provider || '',
    wallet_image: wallet.wallet_image || '',
    wallet_number: wallet.wallet_number || ''
  })) : [];

  formData.value.bankAccounts = payload.bankAccounts ? payload.bankAccounts.map(bankAccount => ({
    bankName: bankAccount.bankName || '',
    accountNumber: bankAccount.accountNumber || '',
    accountName: bankAccount.accountName || '',
    bankLogo: bankAccount.bankLogo || '',

  })) : [];

  // Data lainnya yang mungkin perlu dimapping
  if (payload.loveStory) {
    loveStories.value = payload.loveStory.map(story => ({
      title: story.title || '',
      photo: story.images || '',
      description: story.content || '',
      date: story.date || ''
    }));
  }

  if (payload.giftDeliveryAddress) {
    giftAddresses.value = payload.giftDeliveryAddress;
  }

  if (payload.menu?.items) {
    foodList.value = payload.menu.items;
  }
}
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 999px;
}
</style>
