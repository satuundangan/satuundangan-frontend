<template>
  <footer class="bg-[#1c1917] text-white pt-20 pb-10 font-sans">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10 pb-12">

        <!-- Brand -->
        <div class="space-y-6">
           <div class="flex items-center gap-3">
              <img
                src="@/assets/logo_satuundangan.png"
                alt="SatuUndangan Logo"
                class="h-11 w-11 object-contain rounded-xl bg-white p-0.5 shadow-md border border-white/10"
                width="44"
                height="44"
              />
              <div class="flex flex-col">
                <span class="font-serif font-bold text-xl tracking-tight text-white">
                  SatuUndangan<span class="text-accent-gold">.id</span>
                </span>
                <span class="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-semibold">
                  Digital Wedding Invitation
                </span>
              </div>
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

        <!-- Tema Budaya & Populer (SEO Hub) -->
        <div>
           <h4 class="font-bold text-lg mb-6">Tema Pilihan</h4>
           <ul class="space-y-3 text-sm text-gray-400">
              <li><router-link to="/tema/undangan-digital-adat-jawa" class="hover:text-mocha transition">Adat Jawa</router-link></li>
              <li><router-link to="/tema/undangan-digital-adat-sunda" class="hover:text-mocha transition">Adat Sunda</router-link></li>
              <li><router-link to="/tema/undangan-digital-adat-minang" class="hover:text-mocha transition">Adat Minang</router-link></li>
              <li><router-link to="/tema/undangan-digital-adat-betawi" class="hover:text-mocha transition">Adat Betawi</router-link></li>
              <li><router-link to="/tema/undangan-digital-adat-bali" class="hover:text-mocha transition">Adat Bali</router-link></li>
              <li><router-link to="/tema/undangan-digital-adat-batak" class="hover:text-mocha transition">Adat Batak</router-link></li>
              <li><router-link to="/tema/undangan-digital-islami" class="hover:text-mocha transition">Islami & Syar'i</router-link></li>
              <li><router-link to="/tema/undangan-digital-modern-minimalis" class="hover:text-mocha transition">Modern Minimalis</router-link></li>
              <li><router-link to="/tema/undangan-digital-quiet-luxury" class="hover:text-mocha transition">Quiet Luxury</router-link></li>
           </ul>
        </div>

        <!-- Links -->
        <div>
           <h4 class="font-bold text-lg mb-6">Layanan</h4>
           <ul class="space-y-3 text-sm text-gray-400">
              <li><router-link to="/create" class="hover:text-mocha transition">Buat Undangan</router-link></li>
              <li><router-link to="/wedding-planner" class="hover:text-mocha transition">Free Wedding Planner & Budget</router-link></li>
              <li><router-link to="/tools/love-calculator" class="hover:text-mocha transition">Kalkulator Cinta & Weton</router-link></li>
              <li><router-link to="/templates" class="hover:text-mocha transition">Katalog Desain</router-link></li>
              <li><a href="/#features" class="hover:text-mocha transition">Fitur Lengkap</a></li>
              <li><a href="/#pricing" class="hover:text-mocha transition">Harga Paket</a></li>
              <li><router-link to="/blog" class="hover:text-mocha transition">Blog & Tips Pernikahan</router-link></li>
           </ul>
        </div>

        <div>
           <h4 class="font-bold text-lg mb-6">Perusahaan</h4>
           <ul class="space-y-3 text-sm text-gray-400">
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
