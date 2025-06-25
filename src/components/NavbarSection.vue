<template>
  <nav class="sticky top-0 z-50 bg-ivory shadow-sm  border-mocha px-6 py-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div
          class="bg-sage text-white font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-inner text-lg">
          1
        </div>
        <h1 class="text-lg font-bold text-dark tracking-tight">
          <span class="text-mocha">satu</span>undangan<span class="text-sage">.id</span>
        </h1>
      </div>

      <!-- Navigation -->
      <ul class="hidden md:flex gap-6 text-sm font-medium text-dark">
        <li><a href="#" class="hover:text-mocha transition">Home</a></li>
        <li><a href="#" class="hover:text-mocha transition">Fitur</a></li>
        <li><a href="#" class="hover:text-mocha transition">Tema</a></li>
        <li><a href="#" class="hover:text-mocha transition">Harga</a></li>
        <li><a href="#" class="hover:text-mocha transition">Portofolio</a></li>
        <li><a href="#" class="hover:text-mocha transition">Blog</a></li>
      </ul>

      <!-- CTA -->
      <div class="flex items-center gap-4">
        <button class="text-sm text-mocha hover:text-accent-gold transition">Login</button>
        <button class="btn-primary">
          Buat Undangan
        </button>
      </div>
    </div>
  </nav>
</template>
