<template>
  <section class="relative min-h-[88vh] bg-[#FAF8F5] flex items-center pt-20 border-b border-stone-200/80">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full py-12 md:py-0">
      
      <!-- Text Content -->
      <div class="space-y-6 text-center md:text-left z-10 animate-fade-in-up">
        <p class="text-xs uppercase tracking-[0.18em] text-stone-500 font-medium">
          Undangan Digital &amp; Wedding Hub
        </p>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.12] font-serif tracking-tight">
          Bagikan Kabar Bahagiamu Dengan Elegan.
        </h1>
        <p class="text-stone-600 text-base sm:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed font-normal">
          Wujudkan undangan pernikahan digital yang rapi dan personal untuk hari spesial Anda. Desain gratis sepuasnya, bayar hanya saat siap disebar.
        </p>

        <p class="text-xs sm:text-sm font-medium text-stone-600 pt-1">
          Wedding Planner Gratis · Revisi Tanpa Batas · Siap Sebar 5 Menit
        </p>
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 justify-center md:justify-start pt-2">
          <button
            @click="$emit('create-invitation')"
            class="bg-stone-900 hover:bg-stone-800 text-white text-sm sm:text-base px-6 py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2.5 font-semibold whitespace-nowrap cursor-pointer"
          >
            <span>Buat Undangan Sekarang</span>
            <i class="pi pi-arrow-right text-xs" aria-hidden="true"></i>
          </button>
          <a
            href="#templates"
            class="text-sm sm:text-base px-6 py-3.5 rounded-xl border border-stone-300 hover:border-stone-500 text-stone-800 bg-white hover:bg-stone-50 transition-colors duration-200 font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <i class="pi pi-palette text-stone-600 text-xs" aria-hidden="true"></i>
            <span>Lihat Katalog Desain</span>
          </a>
        </div>

        <div class="flex items-center justify-center md:justify-start gap-4 pt-6 text-sm text-muted border-t border-gray-200 mt-6 max-w-md mx-auto md:mx-0">
          <div class="flex -space-x-3">
            <img class="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100 object-cover shadow-sm" src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=80&h=80&q=70" alt="Pengantin SatuUndangan" width="40" height="40" loading="lazy" decoding="async" />
            <img class="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100 object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=70" alt="Pengantin SatuUndangan" width="40" height="40" loading="lazy" decoding="async" />
            <img class="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100 object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=70" alt="Pengantin SatuUndangan" width="40" height="40" loading="lazy" decoding="async" />
            <img class="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100 object-cover shadow-sm" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=70" alt="Pengantin SatuUndangan" width="40" height="40" loading="lazy" decoding="async" />
            <div class="w-10 h-10 rounded-full border-2 border-white bg-mocha text-white flex items-center justify-center text-xs font-bold ring-1 ring-gray-100 shadow-sm">+5k</div>
          </div>
          <div class="text-left">
            <div class="flex items-center gap-1 text-amber-400 text-xs">
              <i class="pi pi-star-fill text-[10px]" aria-hidden="true"></i>
              <i class="pi pi-star-fill text-[10px]" aria-hidden="true"></i>
              <i class="pi pi-star-fill text-[10px]" aria-hidden="true"></i>
              <i class="pi pi-star-fill text-[10px]" aria-hidden="true"></i>
              <i class="pi pi-star-fill text-[10px]" aria-hidden="true"></i>
              <span class="text-dark font-extrabold text-xs ml-1">4.9 / 5.0</span>
            </div>
            <p class="text-xs text-gray-500 font-medium">Dipercaya oleh 5.000+ calon pengantin</p>
          </div>
        </div>
      </div>

      <!-- Phone Mockup Image -->
      <div class="relative flex justify-center items-center z-10 mt-10 md:mt-0 perspective-1000">
        <!-- Floating Elements -->
        <!-- Notification 1 -->
        <div class="absolute top-1/4 -left-12 bg-white p-4 rounded-xl shadow-[0_12px_30px_-10px_rgba(28,25,23,0.12)] animate-float-slow hidden lg:block z-20 border border-stone-200/80 w-64">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center text-white text-sm shrink-0">
              <i class="pi pi-check font-bold" aria-hidden="true"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-0.5">
                 <p class="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">Status RSVP</p>
                 <span class="text-[10px] text-stone-400">Baru saja</span>
              </div>
              <p class="text-sm font-semibold text-stone-900 leading-tight mb-0.5">Undangan Terkirim</p>
              <p class="text-xs text-stone-500 truncate">Ke: Keluarga Bp. Budi</p>
            </div>
          </div>
        </div>

        <!-- Notification 2 -->
        <div class="absolute bottom-1/4 -right-12 bg-white p-4 rounded-xl shadow-[0_12px_30px_-10px_rgba(28,25,23,0.12)] animate-float-delayed hidden lg:block z-30 border border-stone-200/80 w-64">
          <div class="flex items-center gap-3.5">
            <div class="relative shrink-0">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=70" alt="Avatar" width="44" height="44" loading="lazy" decoding="async" class="w-11 h-11 rounded-full border border-stone-200 object-cover" />
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-[#8f5e38] rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">
                <i class="pi pi-heart-fill text-[7px]" aria-hidden="true"></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-0.5">
                 <p class="text-[10px] font-semibold text-[#8f5e38] uppercase tracking-wider">Pesan Baru</p>
                 <span class="text-[10px] text-stone-400">2m lalu</span>
              </div>
              <p class="text-sm font-semibold text-stone-900 leading-tight mb-0.5 flex items-center">
                <span>"Happy Wedding!"</span>
                <i class="pi pi-heart-fill text-rose-500 text-xs ml-1" aria-hidden="true"></i>
              </p>
              <p class="text-xs text-stone-500 truncate">Dari: Nabila (Sahabat)</p>
            </div>
          </div>
        </div>

        <!-- Phone Frame -->
        <div class="relative w-[300px] h-[600px] bg-stone-900 rounded-[3rem] shadow-2xl border-[8px] border-stone-900 overflow-hidden ring-1 ring-stone-800 z-10">
          
          <!-- Modern Notch (Dynamic Island) -->
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-between px-3 shadow-inner">
             <div class="flex items-center gap-1.5">
               <div class="w-3 h-3 rounded-full bg-gray-800 border border-gray-700/50 shadow-[inset_0px_0px_2px_rgba(255,255,255,0.1)]"></div>
               <div class="w-1.5 h-1.5 rounded-full bg-blue-500/30"></div>
             </div>
             <div class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
          </div>
          
          <!-- Screen Content -->
          <div class="w-full h-full bg-[#faf7f2] overflow-hidden relative rounded-[2.5rem] isolate">
             <img
               src="@/assets/hero_invitation_preview.webp"
               alt="Digital Wedding Invitation Preview"
               loading="eager"
               fetchpriority="high"
               decoding="async"
               width="300"
               height="600"
               class="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700 ease-out rounded-[2.5rem]"
             />
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
defineEmits(['create-invitation'])
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.animate-float-slow {
  animation: float 5s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite 2s;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
