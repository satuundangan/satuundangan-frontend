<template>
  <footer class="bg-[#1c1917] text-white pt-20 pb-10 font-sans">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
        
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
              <a href="#" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-mocha transition-colors text-gray-400 hover:text-white">
                 <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-mocha transition-colors text-gray-400 hover:text-white">
                 <i class="fab fa-tiktok"></i>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-mocha transition-colors text-gray-400 hover:text-white">
                 <i class="fab fa-whatsapp"></i>
              </a>
           </div>
        </div>

        <!-- Links -->
        <div>
           <h4 class="font-bold text-lg mb-6">Layanan</h4>
           <ul class="space-y-4 text-sm text-gray-400">
              <li><a href="#" class="hover:text-mocha transition">Buat Undangan</a></li>
              <li><a href="#" class="hover:text-mocha transition">Katalog Tema</a></li>
              <li><a href="#" class="hover:text-mocha transition">Fitur Premium</a></li>
              <li><a href="#" class="hover:text-mocha transition">Harga</a></li>
           </ul>
        </div>

        <div>
           <h4 class="font-bold text-lg mb-6">Perusahaan</h4>
           <ul class="space-y-4 text-sm text-gray-400">
              <li><a href="#" class="hover:text-mocha transition">Tentang Kami</a></li>
              <li><a href="#" class="hover:text-mocha transition">Hubungi Kami</a></li>
              <li><a href="#" class="hover:text-mocha transition">Syarat & Ketentuan</a></li>
              <li><a href="#" class="hover:text-mocha transition">Kebijakan Privasi</a></li>
           </ul>
        </div>

        <!-- Newsletter -->
        <div>
           <h4 class="font-bold text-lg mb-6">Berlangganan</h4>
           <p class="text-gray-400 text-sm mb-4">Dapatkan info promo dan update desain terbaru.</p>
           <form @submit.prevent class="flex flex-col gap-3">
              <input type="email" placeholder="Email kamu" class="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-mocha focus:ring-1 focus:ring-mocha transition text-white placeholder-gray-600">
              <button class="bg-mocha text-white font-bold text-sm py-3 rounded-lg hover:bg-accent-gold transition-colors">
                 Subscribe
              </button>
           </form>
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