<template>
  <div class="min-h-screen bg-[#FAF8F5] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans selection:bg-[#a47148]/20 selection:text-[#7a4e2b]">
    <!-- Ambient Background Blobs & Textures -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#f1e5d7] blur-3xl opacity-70 pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#ebd5bf] blur-3xl opacity-60 pointer-events-none"></div>
    
    <!-- Subtle Pattern Texture -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#a47148_1px,transparent_1px)] [background-size:24px_24px]"></div>

    <!-- Main Card Container -->
    <div class="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-[#a47148]/15 shadow-[0_20px_50px_rgba(164,113,72,0.12)] p-6 sm:p-10 text-center space-y-6 z-10">
      
      <!-- Top Crest & Monogram Icon -->
      <div class="relative inline-flex items-center justify-center">
        <!-- Outer Glow Ring -->
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#f5ede4] via-white to-[#faebd7] border-2 border-[#a47148]/25 shadow-inner flex items-center justify-center">
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#a47148] to-[#86532d] text-white flex items-center justify-center shadow-lg shadow-[#a47148]/30">
            <i class="fa-solid fa-lock text-xl sm:text-2xl"></i>
          </div>
        </div>
        <!-- Sparkle Accent -->
        <span class="absolute -top-1 -right-1 text-amber-500 text-sm">✨</span>
      </div>

      <!-- Pill Badge -->
      <div>
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#a47148]/10 border border-[#a47148]/20 text-[#a47148] text-[11px] font-extrabold uppercase tracking-widest">
          🔒 Undangan Bersifat Privat
        </span>
      </div>

      <!-- Title & Headline -->
      <div class="space-y-3">
        <h1 class="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-snug">
          Akses Khusus Tamu Undangan
        </h1>
        <div class="w-12 h-0.5 bg-[#a47148]/30 mx-auto rounded-full"></div>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
          Kedua mempelai melangsungkan perayaan pernikahan secara <span class="font-bold text-slate-800">intimate</span>. Demi kenyamanan dan privasi, undangan ini hanya dapat dibuka melalui <span class="text-[#a47148] font-bold">tautan personal khusus</span> yang dikirimkan langsung oleh kedua mempelai.
        </p>
      </div>

      <!-- Helpful Advice Box -->
      <div class="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#a47148]/15 text-left space-y-2">
        <div class="flex items-center gap-2 text-slate-800 font-bold text-xs sm:text-sm">
          <i class="fa-brands fa-whatsapp text-emerald-600 text-base"></i>
          <span>Apakah Anda Tamu Terdaftar?</span>
        </div>
        <p class="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
          Silakan periksa kembali pesan WhatsApp atau SMS dari mempelai. Buka undangan langsung dari tautan berformat khusus yang menyertakan nama atau tiket akses Anda.
        </p>
      </div>

      <!-- Interactive Actions -->
      <div class="space-y-3 pt-2">
        <a
          href="/"
          class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-bold text-xs sm:text-sm shadow-xl shadow-slate-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          <i class="fa-solid fa-house text-xs"></i>
          <span>Kembali ke Beranda SatuUndangan.id</span>
        </a>
      </div>

      <!-- Viral CRO Footer -->
      <div class="pt-4 border-t border-slate-100 flex flex-col items-center gap-1.5">
        <p class="text-[11px] text-slate-400 font-medium">
          Ingin membuat undangan pernikahan digital privat & elegan seperti ini?
        </p>
        <a
          href="/create"
          class="text-xs font-black text-[#a47148] hover:text-[#86532d] transition-colors flex items-center gap-1.5"
        >
          <span>Buat Undangan Digital Anda Sekarang</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  slug: { type: String, default: '' },
})
</script>
