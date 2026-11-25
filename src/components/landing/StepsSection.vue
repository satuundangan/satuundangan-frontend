<template>
  <section class="section bg-[#FAF8F5] border-t border-stone-200/70 relative overflow-hidden pb-28">
    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="text-center mb-16">
        <span class="text-[#8f5e38] font-semibold tracking-widest uppercase text-xs mb-2 block">Alur Pembuatan</span>
        <h2 class="text-3xl md:text-5xl font-playfair font-bold text-stone-900 mb-4">Cara Buat Undangan</h2>
        <p class="text-stone-500 max-w-xl mx-auto text-base md:text-lg">Selesaikan dalam hitungan menit. Pilih desain, lengkapi data, lalu bagikan ke tamu.</p>
      </div>

      <div class="relative">
        <!-- Connecting Line (Desktop) -->
        <div class="hidden md:block absolute top-10 left-16 right-16 h-px bg-stone-200 z-0"></div>

        <div class="grid md:grid-cols-4 gap-6 relative z-10">
          <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center group relative">
            
            <!-- Icon Container -->
            <div
              class="w-16 h-16 md:w-20 md:h-20 mb-6 rounded-xl bg-white border border-stone-200/90 flex items-center justify-center text-2xl md:text-3xl text-[#8f5e38] group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-colors duration-200 relative z-10">
              <i :class="step.icon"></i>
              <span class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stone-900 text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                0{{ index + 1 }}
              </span>
            </div>
            
            <!-- Content -->
            <div class="text-center bg-white p-5 rounded-xl border border-stone-200/80 w-full h-full">
              <h3 class="font-semibold text-stone-900 text-base mb-1.5">{{ step.title }}</h3>
              <p class="text-sm text-stone-500 leading-relaxed">{{ step.description }}</p>
            </div>
            
          </div>
        </div>
      </div>
      
      <!-- Call to action button -->
      <div class="text-center mt-14">
         <button @click="$emit('create-invitation')" class="px-8 py-3.5 text-sm font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors inline-flex items-center gap-2.5 mx-auto cursor-pointer">
            <span>Mulai Buat Sekarang</span>
            <i class="pi pi-arrow-right text-xs" aria-hidden="true"></i>
         </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  { title: "Pilih Template", description: "Pilih tema eksklusif yang sesuai seleramu.", icon: 'pi pi-palette' },
  { title: "Isi Data", description: "Lengkapi data mempelai, acara, dan galeri foto.", icon: 'pi pi-pencil' },
  { title: "Live Preview", description: "Lihat hasil undanganmu secara real-time.", icon: 'pi pi-mobile' },
  { title: "Aktifkan & Bagikan", description: "Pilih paket, selesaikan pembayaran, lalu bagikan undangan yang sudah aktif.", icon: 'pi pi-send' },
]

defineEmits(['create-invitation'])
</script>

<style scoped>
.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
