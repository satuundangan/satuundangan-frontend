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
          Buat undangan pernikahan digital yang eksklusif, modern, dan penuh makna. Desain premium untuk momen sekali seumur hidup.
        </p>
        
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
        <div class="absolute top-1/4 -left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-float-slow hidden lg:block z-20 border border-white/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center text-xl">💌</div>
            <div>
              <p class="text-xs text-muted">Status Undangan</p>
              <p class="text-sm font-bold text-dark">Terkirim Sempurna</p>
            </div>
          </div>
        </div>

        <div class="absolute bottom-1/4 -right-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-float-delayed hidden lg:block z-20 border border-white/50">
             <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-mocha/20 rounded-full flex items-center justify-center text-xl">💬</div>
            <div>
              <p class="text-xs text-muted">Ucapan Masuk</p>
              <p class="text-sm font-bold text-dark">"Happy Wedding!"</p>
            </div>
          </div>
        </div>

        <!-- Phone Frame -->
        <div class="relative w-[300px] h-[600px] bg-dark rounded-[3rem] shadow-2xl border-[8px] border-dark overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700 ring-1 ring-gray-900/50">
          <!-- Notch -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-dark rounded-b-xl z-20"></div>
          
          <!-- Screen Content -->
          <div class="w-full h-full bg-white overflow-hidden relative group">
             <img src="@/assets/template1.png" alt="App Preview" class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
             
             <!-- Overlay Gradient -->
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 flex flex-col justify-end p-8 text-white text-center pb-16">
                <p class="font-serif text-3xl mb-2 drop-shadow-md">Romeo & Juliet</p>
                <p class="text-sm tracking-widest opacity-90 uppercase">The Wedding</p>
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
