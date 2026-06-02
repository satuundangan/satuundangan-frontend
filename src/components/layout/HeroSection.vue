<template>
  <section class="relative min-h-[90vh] bg-ivory overflow-hidden flex items-center pt-20">
    <!-- Decorative Blobs -->
    <div class="absolute top-0 right-0 w-1/2 h-full bg-sage/5 rounded-l-full blur-3xl -z-10 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-mocha/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full py-12 md:py-0">
      
      <!-- Text Content -->
      <div class="space-y-6 text-center md:text-left z-10 animate-fade-in-up">
        <div class="inline-block px-4 py-1.5 rounded-full bg-mocha/10 text-mocha text-sm font-semibold mb-2 ring-1 ring-mocha/20">
          ✨ #1 Platform Undangan Digital Premium
        </div>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-dark leading-[1.1] font-serif tracking-tight">
          Bagikan Kabar <br/>
          <span class="text-mocha italic">Bahagiamu</span> <br/>
          Dengan Elegan.
        </h1>
        <p class="text-dark/70 text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
          Buat undangan pernikahan digital yang eksklusif, modern, dan penuh makna. 
          <span class="font-bold text-dark/90 block mt-2">Edit sendiri sesukamu, revisi sepuasnya tanpa batas!</span>
        </p>

        <div class="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-8 text-sm font-bold text-dark/60 pt-2">
          <div class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg bg-mocha/5 flex items-center justify-center group-hover:bg-mocha/10 transition-colors">
              <i class="fa-solid fa-infinity text-mocha text-xs"></i>
            </div>
            <span>Unlimited Revisi</span>
          </div>
          <div class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg bg-mocha/5 flex items-center justify-center group-hover:bg-mocha/10 transition-colors">
              <i class="fa-solid fa-bolt text-mocha text-xs"></i>
            </div>
            <span>Proses Instan</span>
          </div>
          <div class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg bg-mocha/5 flex items-center justify-center group-hover:bg-mocha/10 transition-colors">
              <i class="fa-solid fa-shield-heart text-mocha text-xs"></i>
            </div>
            <span>Aktif Selamanya</span>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-6">
          <button @click="$emit('create-invitation')" class="btn-primary text-lg px-8 py-3.5 shadow-xl shadow-mocha/20 hover:shadow-mocha/40 hover:-translate-y-1 transition-all duration-300 rounded-full">
            Buat Undangan
          </button>
          <a href="#templates" class="btn-outline text-lg px-8 py-3.5 hover:-translate-y-1 rounded-full border-gray-300 hover:border-mocha text-dark hover:bg-white">
            Lihat Katalog
          </a>
        </div>

        <div class="flex items-center justify-center md:justify-start gap-4 pt-8 text-sm text-muted border-t border-gray-200 mt-8 max-w-md mx-auto md:mx-0">
          <div class="flex -space-x-3">
            <img class="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100" src="https://i.pravatar.cc/100?img=1" alt="User" />
            <img class="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100" src="https://i.pravatar.cc/100?img=5" alt="User" />
            <img class="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100" src="https://i.pravatar.cc/100?img=8" alt="User" />
            <div class="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 ring-1 ring-gray-100">+2k</div>
          </div>
          <div class="text-left">
             <p class="font-bold text-dark text-lg leading-none">5,000+</p>
             <p class="text-xs">Pasangan puas</p>
          </div>
        </div>
      </div>

      <!-- Phone Mockup Image -->
      <div class="relative flex justify-center items-center z-10 mt-10 md:mt-0 perspective-1000">
        <!-- Floating Elements -->
        <!-- Notification 1 -->
        <div class="absolute top-1/4 -left-12 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] animate-float-slow hidden lg:block z-20 border border-white/60 hover:scale-105 transition-transform duration-300 w-64 group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg shadow-inner group-hover:rotate-12 transition-transform duration-300">
              <i class="fa-solid fa-check-double"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-0.5">
                 <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Status RSVP</p>
                 <span class="text-[9px] text-gray-400">Baru saja</span>
              </div>
              <p class="text-sm font-bold text-dark leading-tight mb-0.5">Undangan Terkirim</p>
              <p class="text-xs text-gray-500 truncate">Ke: Keluarga Bp. Budi</p>
            </div>
          </div>
        </div>

        <!-- Notification 2 -->
        <div class="absolute bottom-1/4 -right-12 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] animate-float-delayed hidden lg:block z-30 border border-white/60 hover:scale-105 transition-transform duration-300 w-64 group">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img src="https://i.pravatar.cc/100?img=32" alt="Avatar" class="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-mocha rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">
                <i class="fa-solid fa-heart"></i>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-0.5">
                 <p class="text-[10px] font-bold text-mocha uppercase tracking-wider">Pesan Baru</p>
                 <span class="text-[9px] text-gray-400">2m lalu</span>
              </div>
              <p class="text-sm font-bold text-dark leading-tight mb-0.5">"Happy Wedding! 🥰"</p>
              <p class="text-xs text-gray-500 truncate">Dari: Nabila (Sahabat)</p>
            </div>
          </div>
        </div>

        <!-- Phone Frame -->
        <div class="relative w-[300px] h-[600px] bg-dark rounded-[3rem] shadow-2xl border-[8px] border-dark overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-all duration-700 ring-2 ring-gray-800/50 group z-10">
          <!-- Screen Glare Reflection -->
          <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 z-30 pointer-events-none transform -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
          
          <!-- Modern Notch (Dynamic Island) -->
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-between px-3 shadow-inner">
             <div class="flex items-center gap-1.5">
               <div class="w-3 h-3 rounded-full bg-gray-800 border border-gray-700/50 shadow-[inset_0px_0px_2px_rgba(255,255,255,0.1)]"></div>
               <div class="w-1.5 h-1.5 rounded-full bg-blue-500/30"></div>
             </div>
             <div class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
          </div>
          
          <!-- Screen Content -->
          <div class="w-full h-full bg-white overflow-hidden relative rounded-[2.5rem] isolate">
             <img src="@/assets/hero_image.png" alt="App Preview" class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out rounded-[2.5rem]" />
             
             <!-- Overlay Gradient & Content -->
             <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 flex flex-col justify-end items-center p-8 text-white text-center pb-10 z-10">
                
                <!-- Play Music Button -->
                <div class="w-14 h-14 rounded-full border border-white/30 backdrop-blur-md bg-white/10 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-mocha transition-all duration-500 cursor-pointer shadow-lg transform translate-y-4 group-hover:translate-y-0">
                   <i class="fa-solid fa-play ml-1 text-lg"></i>
                </div>

                <div class="overflow-hidden">
                  <p class="font-serif text-4xl mb-1 drop-shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    Romeo <span class="italic text-mocha text-3xl font-light">&</span> Juliet
                  </p>
                </div>
                <div class="overflow-hidden mt-2">
                  <p class="text-[10px] tracking-[0.4em] text-gray-300 uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 delay-100 ease-out">
                    The Wedding
                  </p>
                </div>
                
                <!-- Swipe up indicator -->
                <div class="mt-8 flex flex-col items-center animate-bounce opacity-70">
                   <i class="fa-solid fa-angles-up text-[10px] mb-1"></i>
                   <span class="text-[8px] uppercase tracking-widest font-bold">Buka Undangan</span>
                </div>
             </div>
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
