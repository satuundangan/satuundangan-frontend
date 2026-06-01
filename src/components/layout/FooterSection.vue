<template>
  <footer class="bg-[#1c1917] text-white pt-20 pb-10 font-sans">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-12 border-b border-white/10 pb-12">

        <!-- Brand -->
        <div class="md:col-span-1 space-y-6">
           <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-mocha rounded-lg flex items-center justify-center font-serif font-bold text-xl text-white">S</div>
              <span class="font-serif font-bold text-xl tracking-tight">satuundangan.id</span>
           </div>
           <p class="text-gray-400 text-sm leading-relaxed">
             Platform undangan pernikahan digital premium. Buat momen spesialmu lebih berkesan dengan desain elegan dan fitur canggih.
           </p>
           <div class="flex gap-4">
              <a href="https://www.instagram.com/satuundangan_official" target="_blank" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-mocha transition-colors text-gray-400 hover:text-white">
                 <i class="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@satuundangan.id" target="_blank" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-mocha transition-colors text-gray-400 hover:text-white">
                 <i class="fab fa-tiktok"></i>
              </a>
              <a href="https://wa.me/6285121266550?text=Halo%20SatuUndangan%2C%20saya%20ingin%20tanya%20tentang%20undangan%20digital" target="_blank" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-mocha transition-colors text-gray-400 hover:text-white">
                 <i class="fab fa-whatsapp"></i>
              </a>
           </div>
        </div>

        <!-- Links -->
        <div>
           <h4 class="font-bold text-lg mb-6">Layanan</h4>
           <ul class="space-y-4 text-sm text-gray-400">
              <li><router-link to="/create" class="hover:text-mocha transition">Buat Undangan</router-link></li>
              <li><router-link to="/templates" class="hover:text-mocha transition">Katalog Tema</router-link></li>
              <li><a href="#features" class="hover:text-mocha transition">Fitur Premium</a></li>
           </ul>
        </div>

        <div>
           <h4 class="font-bold text-lg mb-6">Perusahaan</h4>
           <ul class="space-y-4 text-sm text-gray-400">
              <li><router-link to="/tentang-kami" class="hover:text-mocha transition">Tentang Kami</router-link></li>
              <li><a href="https://wa.me/6285121266550?text=Halo%20SatuUndangan%2C%20saya%20ingin%20tanya%20tentang%20undangan%20digital" target="_blank" class="hover:text-mocha transition">Hubungi Kami</a></li>
              <li><router-link to="/terms" class="hover:text-mocha transition">Syarat & Ketentuan</router-link></li>
              <li><router-link to="/privacy" class="hover:text-mocha transition">Kebijakan Privasi</router-link></li>
           </ul>
        </div>
      </div>

      <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
         <p>© 2026 SatuUndangan.id. All rights reserved.</p>
         <div class="flex gap-6">
            <span>Made with ❤️ in Indonesia</span>
         </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>
