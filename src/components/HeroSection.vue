<template>
  <section class="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 max-w-7xl mx-auto gap-10">
    <!-- Text Content -->
    <div class="flex-1">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Website Undangan<br />
        Pernikahan Online
      </h1>
      <p class="mt-4 text-gray-600 text-lg">
        Undang orang-orang terdekat dalam momen kebahagiaan pernikahan Anda dengan cara yang unik dan menarik.
        Coba sekarang juga, GRATIS!
      </p>
      <div class="mt-6 flex gap-4">
        <button class="bg-[#FFCCEA] text-white px-5 py-3 rounded-lg font-medium hover:opacity-90">
          Buat Undangan
        </button>
        <button
          class="flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
          ▶️ Cara Buat Undangan
        </button>
      </div>
    </div>

    <!-- Image Section -->
    <div class="flex-1 flex justify-center">
      <img src="@/assets/sample-preview.png" alt="preview" class="w-full max-w-md rounded-xl shadow-xl" />
    </div>
  </section>
</template>
