<template>
  <div class="relative min-h-screen bg-[#0a0a12] overflow-hidden font-sans text-[#e2e8f0] selection:bg-[#00f0ff] selection:text-black">
    <!-- Grid Overlay -->
    <div class="fixed inset-0 pointer-events-none z-0" style="background-image: linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px); background-size: 30px 30px; opacity: 0.2;"></div>

    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" class="z-[55]" />

    <!-- Navigation -->
    <nav v-if="!showWelcome" class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 transition-all duration-1000 hidden md:flex">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="w-12 h-12 border-2 border-[#00f0ff]/30 bg-[#0a0a12]/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 group shadow-[0_0_15px_rgba(0,240,255,0.1)] relative"
        :class="activeSection === item.id ? 'text-[#00f0ff] border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'text-[#94a3b8] hover:text-[#00f0ff] hover:border-[#00f0ff]/70'">
        <i :class="[item.icon, 'text-sm']"></i>
        <div class="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0a0a12]/90 border border-[#00f0ff]/50 text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          {{ item.label }}
        </div>
      </button>
    </nav>
    
    <!-- Mobile Nav -->
    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a12]/90 backdrop-blur-md px-6 py-3 border border-[#00f0ff]/30 flex items-center justify-center gap-6 shadow-[0_0_20px_rgba(0,240,255,0.15)] w-fit max-w-[95%] md:hidden transition-all duration-1000">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300"
        :class="activeSection === item.id ? 'text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'text-[#64748b] hover:text-[#00f0ff]'">
        <i :class="[item.icon, 'text-lg']"></i>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="glitch-out">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#0a0a12]">
        <div class="relative z-10 w-full max-w-sm p-10 border border-[#ff003c]/30 bg-[#0a0a12]/80 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,60,0.1)] before:absolute before:-inset-[1px] before:bg-gradient-to-r before:from-[#ff003c] before:to-[#00f0ff] before:z-[-1] before:opacity-50">
          
          <div class="space-y-8 animate-glitch">
            <div class="space-y-2">
              <p class="text-[10px] uppercase font-bold tracking-[0.4em] text-[#00f0ff] animate-pulse">System Override</p>
              <h2 class="text-4xl md:text-5xl font-mono text-[#e2e8f0] font-black uppercase tracking-tighter">{{ data.groomName }} <br><span class="text-[#ff003c] text-3xl">X</span><br> {{ data.brideName }}</h2>
            </div>
            
            <div class="py-6 border-y border-[#1e293b] space-y-2">
               <p class="text-[8px] uppercase tracking-[0.5em] text-[#94a3b8] font-bold">User Detected</p>
               <p class="text-lg font-mono font-bold uppercase tracking-widest text-[#00f0ff] truncate px-2 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">{{ data.guestName ? data.guestName : 'Guest_001' }}</p>
            </div>
          </div>

          <button @click="openInvitation" class="mt-8 w-full py-4 bg-transparent border-2 border-[#ff003c] text-[#ff003c] font-black hover:bg-[#ff003c] hover:text-white transition-all duration-300 text-[10px] uppercase tracking-[0.4em] shadow-[0_0_15px_rgba(255,0,60,0.3)] hover:shadow-[0_0_25px_rgba(255,0,60,0.6)]">
            Initialize
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto scroll-smooth pb-20 md:pb-0">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen relative flex items-center justify-center px-6 md:px-20 py-20">
        <div class="w-full max-w-5xl grid md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10" v-observe>
          <div class="order-2 md:order-1 space-y-8 text-center md:text-left">
            <div class="inline-flex items-center gap-3 px-4 py-2 border border-[#00f0ff]/50 bg-[#0a0a12]/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
               <i class="fa-solid fa-microchip text-[#00f0ff] animate-pulse"></i>
               <span class="text-[8px] font-bold uppercase tracking-[0.4em] text-[#e2e8f0]">Connection Established</span>
            </div>
            <h1 class="text-6xl md:text-[5rem] font-mono font-black uppercase leading-[1] text-white drop-shadow-[2px_2px_0px_#ff003c,-2px_-2px_0px_#00f0ff]">
              {{ data.groomName }} <br><span class="text-5xl md:text-7xl text-[#facc15] drop-shadow-none">&</span><br> {{ data.brideName }}
            </h1>
            <p class="text-xs md:text-sm font-mono font-bold uppercase tracking-[0.5em] text-[#00f0ff]">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}</p>
          </div>
          
          <div class="order-1 md:order-2 relative">
             <div class="absolute inset-0 bg-gradient-to-br from-[#ff003c] to-[#00f0ff] opacity-40 blur-xl z-0"></div>
             <div class="relative z-10 aspect-[3/4] bg-[#0a0a12] p-2 border border-white/10">
                <img :src="data.photoCoupleUrl || 'https://via.placeholder.com/600x800'" class="w-full h-full object-cover contrast-125 saturate-150 mix-blend-luminosity" />
             </div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6 relative border-y border-white/5 bg-[#050508]" v-observe>
        <div class="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <i class="fa-solid fa-terminal text-[#ff003c] text-4xl mb-6 animate-pulse"></i>
          <p class="text-2xl md:text-4xl font-mono font-bold leading-tight uppercase tracking-wide text-[#e2e8f0]">"{{ data.quoteText }}"</p>
          <div class="flex items-center justify-center gap-4">
             <p class="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-[#00f0ff]">> {{ data.quoteSource }}</p>
             <span class="w-2 h-4 bg-[#00f0ff] animate-ping"></span>
          </div>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-32 px-6">
        <div class="max-w-6xl mx-auto space-y-24">
          <div class="text-center space-y-4" v-observe>
            <p class="text-[10px] font-mono uppercase tracking-[0.5em] text-[#ff003c]">> History.log</p>
            <h2 class="text-5xl md:text-6xl font-mono font-black uppercase text-white tracking-tighter">Timeline</h2>
          </div>

          <div class="space-y-12">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="relative group" v-observe>
               <div class="absolute left-0 top-0 w-1 h-full bg-[#1e293b] group-hover:bg-[#00f0ff] transition-colors"></div>
               <div class="pl-8 py-4 space-y-6">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div class="space-y-1">
                        <span class="text-[10px] font-mono text-[#00f0ff] font-bold">[{{ story.date }}]</span>
                        <h3 class="text-2xl md:text-3xl font-mono font-black uppercase text-white group-hover:text-[#00f0ff] transition-colors">{{ story.title }}</h3>
                     </div>
                     <div class="h-px flex-1 bg-white/5 mx-4 hidden md:block"></div>
                  </div>
                  <div class="grid md:grid-cols-2 gap-8 items-start">
                     <p class="text-sm font-mono leading-relaxed text-[#94a3b8]">{{ story.description }}</p>
                     <div v-if="story.image" class="border border-white/10 p-1 bg-[#0a0a12] max-w-md">
                        <img :src="story.image" class="w-full aspect-video object-cover mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6">
        <div class="max-w-5xl mx-auto space-y-32">
          
          <div class="flex flex-col md:flex-row items-center gap-12 md:gap-20" v-observe>
            <div class="w-full md:w-1/2 relative group">
               <div class="aspect-square p-2 bg-[#0a0a12] border border-[#ff003c]/50 relative z-10 mx-auto max-w-[300px] shadow-[0_0_20px_rgba(255,0,60,0.2)] group-hover:shadow-[0_0_30px_rgba(255,0,60,0.5)] transition-all">
                  <img :src="data.groomPhotoUrl" class="w-full h-full object-cover contrast-150 grayscale group-hover:grayscale-0 transition-all duration-500" />
               </div>
               <div class="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#ff003c]"></div>
               <div class="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#ff003c]"></div>
            </div>
            <div class="w-full md:w-1/2 text-center md:text-left space-y-6">
              <span class="text-[10px] uppercase font-mono tracking-[0.5em] font-bold text-[#ff003c]">Player 1</span>
              <h3 class="text-4xl md:text-6xl font-mono font-black uppercase text-white">{{ data.groomName }}</h3>
              <p class="text-xs font-mono text-[#94a3b8] uppercase tracking-widest">Son of <br><span class="font-bold text-[#e2e8f0]">{{ data.parents?.groomParents }}</span></p>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block mt-4 px-6 py-3 border border-[#ff003c] text-[10px] uppercase font-mono tracking-widest font-bold text-[#ff003c] hover:bg-[#ff003c] hover:text-white transition-colors"><i class="fa-brands fa-instagram mr-2"></i>Connect</a>
            </div>
          </div>

          <div class="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20" v-observe>
            <div class="w-full md:w-1/2 relative group">
               <div class="aspect-square p-2 bg-[#0a0a12] border border-[#00f0ff]/50 relative z-10 mx-auto max-w-[300px] shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
                  <img :src="data.bridePhotoUrl" class="w-full h-full object-cover contrast-150 grayscale group-hover:grayscale-0 transition-all duration-500" />
               </div>
               <div class="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#00f0ff]"></div>
               <div class="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#00f0ff]"></div>
            </div>
            <div class="w-full md:w-1/2 text-center md:text-right space-y-6">
              <span class="text-[10px] uppercase font-mono tracking-[0.5em] font-bold text-[#00f0ff]">Player 2</span>
              <h3 class="text-4xl md:text-6xl font-mono font-black uppercase text-white">{{ data.brideName }}</h3>
              <p class="text-xs font-mono text-[#94a3b8] uppercase tracking-widest">Daughter of <br><span class="font-bold text-[#e2e8f0]">{{ data.parents?.brideParents }}</span></p>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block mt-4 px-6 py-3 border border-[#00f0ff] text-[10px] uppercase font-mono tracking-widest font-bold text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-colors"><i class="fa-brands fa-instagram mr-2"></i>Connect</a>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 border-y border-white/5 bg-[#050508]">
        <div class="max-w-5xl mx-auto relative z-10">
          <div class="text-center mb-20 space-y-4" v-observe>
            <p class="text-[10px] font-mono uppercase tracking-[0.5em] text-[#ff003c]">> Timeline</p>
            <h2 class="text-5xl md:text-6xl font-mono font-black uppercase text-white">Missions</h2>
          </div>
          
          <div class="grid md:grid-cols-2 gap-10">
            <!-- Akad -->
            <div class="bg-[#0a0a12] p-8 border border-white/10 hover:border-[#00f0ff]/50 space-y-8 relative group overflow-hidden transition-all duration-500" v-observe>
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-[8px] font-mono uppercase tracking-widest text-[#64748b]">Mission 01</span>
                  <h3 class="text-3xl font-mono font-bold uppercase text-white mt-2">Akad</h3>
                </div>
                <i class="fa-solid fa-ring text-2xl text-[#00f0ff]"></i>
              </div>
              <div class="space-y-4 font-mono text-sm">
                <p class="text-[#e2e8f0] font-bold">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                <p class="text-[#00f0ff]">{{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                <p class="text-[#94a3b8] text-xs leading-relaxed border-l-2 border-[#1e293b] pl-4">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="inline-block px-6 py-2 border border-[#00f0ff] text-[#00f0ff] font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-[#00f0ff] hover:text-black transition-colors">
                [ Get Coordinates ]
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="bg-[#0a0a12] p-8 border border-white/10 hover:border-[#ff003c]/50 space-y-8 relative group overflow-hidden transition-all duration-500" v-observe>
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-[8px] font-mono uppercase tracking-widest text-[#64748b]">Mission 02</span>
                  <h3 class="text-3xl font-mono font-bold uppercase text-white mt-2">Reception</h3>
                </div>
                <i class="fa-solid fa-champagne-glasses text-2xl text-[#ff003c]"></i>
              </div>
              <div class="space-y-4 font-mono text-sm">
                <p class="text-[#e2e8f0] font-bold">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                <p class="text-[#ff003c]">{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                <p class="text-[#94a3b8] text-xs leading-relaxed border-l-2 border-[#1e293b] pl-4">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="inline-block px-6 py-2 border border-[#ff003c] text-[#ff003c] font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-[#ff003c] hover:text-white transition-colors">
                [ Get Coordinates ]
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-32 px-4">
        <div class="max-w-7xl mx-auto space-y-16">
          <div class="text-center space-y-4" v-observe>
            <p class="text-[10px] font-mono uppercase tracking-[0.5em] text-[#facc15]">> Logs</p>
            <h2 class="text-5xl md:text-6xl font-mono font-black uppercase text-white">Visual Data</h2>
          </div>
          <div class="p-6 bg-[#0a0a12] border border-white/5">
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6 border-y border-white/5 bg-[#050508]">
        <div class="max-w-3xl mx-auto relative z-10">
          <div class="text-center mb-16 space-y-4" v-observe>
            <p class="text-[10px] font-mono uppercase tracking-[0.5em] text-[#00f0ff]">> Input Required</p>
            <h2 class="text-5xl font-mono font-black uppercase text-white">R.S.V.P</h2>
          </div>

          <form @submit.prevent="submitRSVP" class="bg-[#0a0a12] border border-[#00f0ff]/30 p-8 md:p-12 space-y-8 relative" v-observe>
            <!-- Decorative corners -->
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]"></div>
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]"></div>

            <div class="space-y-2">
              <label class="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#64748b]">Identifier</label>
              <input v-model="rsvp.name" type="text" class="w-full bg-[#1e293b]/50 border border-white/10 py-3 px-4 text-sm font-mono text-white focus:border-[#00f0ff] outline-none transition-colors" placeholder="Enter Name..." required />
            </div>
            
            <div class="space-y-4">
               <label class="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#64748b]">Status</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-3 border border-white/10 bg-[#1e293b]/50 text-center cursor-pointer transition-all font-mono font-bold uppercase tracking-widest text-[10px]" :class="rsvp.attendance === 'hadir' ? 'border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'text-[#94a3b8] hover:border-[#00f0ff]/50'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Connect
                 </label>
                 <label class="flex-1 py-3 border border-white/10 bg-[#1e293b]/50 text-center cursor-pointer transition-all font-mono font-bold uppercase tracking-widest text-[10px]" :class="rsvp.attendance === 'tidak' ? 'border-[#ff003c] text-[#ff003c] shadow-[0_0_10px_rgba(255,0,60,0.2)]' : 'text-[#94a3b8] hover:border-[#ff003c]/50'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Disconnect
                 </label>
               </div>
            </div>

            <div v-if="rsvp.attendance === 'hadir'" class="space-y-2">
              <label class="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#64748b]">Units</label>
              <select v-model="rsvp.totalGuests" class="w-full bg-[#1e293b]/50 border border-white/10 py-3 px-4 text-sm font-mono text-white focus:border-[#00f0ff] outline-none">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} Unit(s)</option>
              </select>
            </div>

            <div class="space-y-2">
               <label class="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#64748b]">Data Stream</label>
               <textarea v-model="rsvp.message" rows="3" class="w-full bg-[#1e293b]/50 border border-white/10 py-3 px-4 text-sm font-mono text-white focus:border-[#00f0ff] outline-none resize-none" placeholder="Type message..."></textarea>
            </div>

            <button type="submit" class="w-full py-4 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] font-mono text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#00f0ff] hover:text-black transition-all">Transmit Data</button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length" class="py-32 px-6 text-center">
        <div class="max-w-5xl mx-auto space-y-16">
          <div class="text-center space-y-4" v-observe>
            <p class="text-[10px] font-mono uppercase tracking-[0.5em] text-[#facc15]">> Transaction</p>
            <h2 class="text-5xl md:text-6xl font-mono font-black uppercase text-white">Credits</h2>
          </div>
          
          <div class="flex flex-wrap justify-center gap-8">
            <div v-for="(bank, idx) in data.bankAccounts" :key="idx" class="p-8 md:p-10 bg-[#0a0a12] border border-white/10 w-full sm:w-[400px] hover:border-[#facc15]/50 transition-colors text-left relative overflow-hidden group" v-observe>
              <div class="absolute top-0 right-0 w-16 h-16 bg-[#facc15]/10 rounded-bl-full z-0 group-hover:bg-[#facc15]/20 transition-colors"></div>
              <div class="relative z-10">
                <div class="flex justify-between items-center mb-8">
                   <p class="text-lg font-mono font-bold uppercase tracking-widest text-[#facc15]">{{ bank.bankName }}</p>
                   <i class="fa-solid fa-qrcode text-xl text-white/50"></i>
                </div>
                <p class="text-3xl font-mono font-bold tracking-widest mb-2 text-white">{{ bank.accountNumber }}</p>
                <p class="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-widest mb-10">{{ bank.accountName }}</p>
                <button @click="copyToClipboard(bank.accountNumber)" class="w-full py-3 bg-transparent border border-[#facc15] text-[#facc15] font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-[#facc15] hover:text-black transition-colors">[ Copy Code ]</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="py-24 text-center border-t border-white/5 space-y-8 pb-32 md:pb-24">
        <h2 class="font-mono text-3xl md:text-5xl font-black uppercase text-white tracking-tighter">{{ data.groomName }} <span class="text-[#ff003c]">X</span> {{ data.brideName }}</h2>
        <p class="text-[10px] font-mono uppercase tracking-[0.4em] font-bold text-[#64748b]">> SYSTEM_OFFLINE // SatuUndangan</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { createGuestMessage } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'

const props = defineProps({ data: { type: Object, default: () => ({}) } })
const toast = useToast()
const data = ref(props.data || {})

const activeSections = computed(() => {
  if (data.value.sections && Array.isArray(data.value.sections)) return data.value.sections
  if (data.value.content?.selectedSections && Array.isArray(data.value.content.selectedSections)) {
    return data.value.content.selectedSections.map(s => typeof s === 'string' ? { key: s, is_enabled: true } : s)
  }
  return null
})

const showWelcome = ref(true)
const galleryImages = ref([])
const rsvp = ref({ name: '', attendance: '', totalGuests: 1, message: '' })

const allNavItems = [
  { id: 'home', label: 'Init', icon: 'fa-solid fa-power-off', key: 'hero' },
  { id: 'couple', label: 'Users', icon: 'fa-solid fa-user-astronaut', key: 'couple' },
  { id: 'event', label: 'Quests', icon: 'fa-solid fa-map-location-dot', key: 'event' },
  { id: 'gallery', label: 'Data', icon: 'fa-solid fa-floppy-disk', key: 'gallery' },
  { id: 'rsvp', label: 'Ping', icon: 'fa-solid fa-satellite-dish', key: 'rsvp' }
]

const navItems = computed(() => {
  if (!activeSections.value) return allNavItems
  return allNavItems.filter(item => {
    const s = activeSections.value.find(s => s.key === item.key)
    return s ? (s.is_enabled !== false) : true
  })
})

const isSectionEnabled = (key) => {
  if (!activeSections.value) return true
  const section = activeSections.value.find(s => s.key === key)
  return section ? (section.is_enabled !== false) : true
}

const activeSection = ref('home')

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-8')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.15 })
    observer.observe(el)
  }
}

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    const content = document.getElementById('main-content')
    if (content) content.classList.remove('opacity-0')
    initScrollSpy()
  }, 100)
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  activeSection.value = id
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activeSection.value = e.target.id })
  }, { threshold: 0.5 })
  navItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}

function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:')) return choice
  if (choice.includes('/') || choice.includes('http')) return choice
  return '/audio/wedding-acoustic-morning.mp3'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}
function formatTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatInstagramUrl(handle) { return `https://instagram.com/${handle.replace('@', '')}` }
function copyToClipboard(text) { navigator.clipboard.writeText(text); toast.success('Data Copied') }

function initData() {
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) return toast.error("Invalid Input")
  try {
    await createGuestMessage({
      invitationId: data.value.id, guestName: rsvp.value.name, message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance, totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0
    })
    toast.success("Data Transmitted")
  } catch (err) {
    console.error(err)
    toast.error("Transmission failed.")
  }
}

onMounted(() => { initData() })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
.font-mono { font-family: 'Share Tech Mono', monospace; }
.font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }

.glitch-out-leave-active { animation: glitchOut 0.5s cubic-bezier(.25, .46, .45, .94) forwards; }

@keyframes glitchOut {
  0% { opacity: 1; transform: scale(1); filter: hue-rotate(0deg); }
  20% { transform: scale(1.05) skewX(5deg); filter: hue-rotate(90deg); }
  40% { transform: scale(0.95) skewX(-5deg); opacity: 0.8; }
  60% { transform: scale(1.1) skewY(5deg); filter: hue-rotate(180deg); }
  80% { transform: scale(0.9) skewY(-5deg); opacity: 0.4; }
  100% { transform: scale(1); opacity: 0; filter: blur(10px); }
}

@keyframes glitch {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 2px) }
  40% { transform: translate(-2px, -2px) }
  60% { transform: translate(2px, 2px) }
  80% { transform: translate(2px, -2px) }
  100% { transform: translate(0) }
}
.animate-glitch { animation: glitch 2s ease infinite; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0a0a12; }
::-webkit-scrollbar-thumb { background: #00f0ff; border-radius: 0; }
</style>
