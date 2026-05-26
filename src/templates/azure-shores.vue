<template>
  <div class="relative min-h-screen bg-[#f0f8ff] overflow-hidden font-sans text-[#1e3a8a] selection:bg-[#ffb703] selection:text-white">
    <!-- Wavy Pattern Overlay -->
    <div class="fixed inset-0 opacity-10 pointer-events-none z-0" style="background-image: radial-gradient(circle at center, #1e3a8a 1px, transparent 1px); background-size: 20px 20px;"></div>

    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" class="z-[55]" />

    <!-- Navigation -->
    <nav v-if="!showWelcome" class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 transition-all duration-1000 hidden md:flex">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="w-12 h-12 rounded-full bg-white shadow-lg border border-[#e0f2fe] flex items-center justify-center transition-all duration-300 group"
        :class="activeSection === item.id ? 'bg-[#1e3a8a] text-white scale-110' : 'text-[#1e3a8a] hover:bg-[#e0f2fe] hover:scale-105'">
        <i :class="[item.icon, 'text-sm']"></i>
        <span class="absolute right-16 px-3 py-1 bg-white text-[#1e3a8a] text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#e0f2fe]">
          {{ item.label }}
        </span>
      </button>
    </nav>
    
    <!-- Mobile Nav -->
    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md px-6 py-3 rounded-[30px] flex items-center justify-center gap-6 shadow-xl border border-[#e0f2fe] w-fit max-w-[95%] md:hidden transition-all duration-1000">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300"
        :class="activeSection === item.id ? 'text-[#1e3a8a] -translate-y-1' : 'text-[#93c5fd] hover:text-[#1e3a8a]'">
        <i :class="[item.icon, 'text-lg']"></i>
        <span class="text-[8px] font-bold uppercase tracking-widest">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="float-up">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#1e3a8a] text-white">
        <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#3b82f6]/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1e40af]/50 to-transparent"></div>
        
        <div class="relative z-10 w-full max-w-sm bg-white text-[#1e3a8a] p-10 rounded-[40px] shadow-2xl space-y-10 border-4 border-[#e0f2fe] animate-float">
          <div class="w-16 h-1 bg-[#ffb703] mx-auto rounded-full"></div>
          
          <div class="space-y-6">
            <div class="space-y-2">
              <p class="text-[10px] uppercase font-bold tracking-[0.3em] text-[#60a5fa]">We Are Getting Married</p>
              <h2 class="text-4xl md:text-5xl font-serif text-[#1e3a8a] leading-tight">{{ data.groomName }} <br><span class="text-[#ffb703] text-3xl italic">&</span><br> {{ data.brideName }}</h2>
            </div>
            
            <div class="py-6 border-y border-[#e0f2fe] space-y-2">
               <p class="text-[8px] uppercase tracking-[0.4em] text-[#93c5fd] font-bold">Dear Guest</p>
               <p class="text-lg font-bold uppercase tracking-widest text-[#1e3a8a] truncate px-2">{{ data.guestName ? data.guestName : 'Invited Guest' }}</p>
            </div>
          </div>

          <button @click="openInvitation" class="w-full py-4 bg-[#ffb703] text-[#1e3a8a] font-black rounded-full hover:bg-[#fbbf24] transition-all duration-300 text-[10px] uppercase tracking-[0.3em] shadow-lg hover:-translate-y-1">
            Open Invitation
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
            <div class="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-[#e0f2fe]">
               <i class="fa-solid fa-sun text-[#ffb703]"></i>
               <span class="text-[8px] font-bold uppercase tracking-[0.3em] text-[#60a5fa]">Summer Wedding</span>
            </div>
            <h1 class="text-6xl md:text-[5rem] font-serif leading-[1] text-[#1e3a8a]">
              {{ data.groomName }} <br><span class="text-5xl md:text-7xl italic text-[#ffb703]">&</span><br> {{ data.brideName }}
            </h1>
            <p class="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-[#3b82f6]">{{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime || data.dateTime) }}</p>
          </div>
          
          <div class="order-1 md:order-2 relative">
             <div class="absolute -inset-6 bg-gradient-to-tr from-[#3b82f6]/20 to-[#e0f2fe] rounded-t-full rounded-b-[40px] -rotate-6 transform origin-bottom z-0"></div>
             <div class="relative z-10 aspect-[3/4] bg-white p-3 shadow-2xl rounded-t-full rounded-b-[30px] rotate-3 hover:rotate-0 transition-transform duration-700">
                <img :src="data.photoCoupleUrl || 'https://via.placeholder.com/600x800'" class="w-full h-full object-cover rounded-t-full rounded-b-2xl" />
             </div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6 bg-[#1e3a8a] text-white relative overflow-hidden" v-observe>
        <div class="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/30 rounded-full blur-[80px]"></div>
        <div class="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <i class="fa-solid fa-anchor text-[#ffb703] text-4xl mb-6"></i>
          <p class="text-2xl md:text-5xl font-serif leading-tight">"{{ data.quoteText }}"</p>
          <div class="flex items-center justify-center gap-4">
             <div class="w-10 h-px bg-[#3b82f6]"></div>
             <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-[#93c5fd]">{{ data.quoteSource }}</p>
             <div class="w-10 h-px bg-[#3b82f6]"></div>
          </div>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-32 px-6 relative">
        <div class="max-w-7xl mx-auto space-y-20">
          <div class="text-center" v-observe>
            <h2 class="text-5xl md:text-6xl font-serif text-[#1e3a8a] mb-4">Our Voyage</h2>
            <div class="w-16 h-1 bg-[#ffb703] mx-auto rounded-full"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="bg-white p-6 rounded-[30px] shadow-lg border border-[#e0f2fe] space-y-6 flex flex-col group hover:-translate-y-2 transition-all duration-500" v-observe>
               <div v-if="story.image" class="aspect-[4/3] rounded-2xl overflow-hidden relative">
                  <img :src="story.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div class="absolute inset-0 bg-[#1e3a8a]/10 group-hover:bg-transparent transition-colors"></div>
               </div>
               <div class="space-y-3 flex-1">
                  <span class="text-[10px] font-black text-[#60a5fa] uppercase tracking-widest">{{ story.date }}</span>
                  <h3 class="text-2xl font-serif text-[#1e3a8a]">{{ story.title }}</h3>
                  <p class="text-sm leading-relaxed text-[#64748b]">{{ story.description }}</p>
               </div>
               <div class="pt-4 border-t border-[#f0f8ff] text-[#ffb703]"><i class="fa-solid fa-compass"></i></div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6">
        <div class="max-w-5xl mx-auto space-y-32">
          
          <div class="flex flex-col md:flex-row items-center gap-12 md:gap-20" v-observe>
            <div class="w-full md:w-1/2 relative">
               <div class="aspect-square rounded-full p-2 bg-white shadow-xl border border-[#e0f2fe] relative z-10 mx-auto max-w-[300px]">
                  <img :src="data.groomPhotoUrl" class="w-full h-full object-cover rounded-full" />
               </div>
               <div class="absolute top-10 -right-4 w-20 h-20 bg-[#ffb703] rounded-full blur-2xl opacity-40 z-0"></div>
            </div>
            <div class="w-full md:w-1/2 text-center md:text-left space-y-6">
              <span class="text-[10px] uppercase tracking-[0.4em] font-bold text-[#60a5fa]">The Groom</span>
              <h3 class="text-4xl md:text-6xl font-serif text-[#1e3a8a]">{{ data.groomName }}</h3>
              <p class="text-xs font-medium text-[#3b82f6] leading-relaxed">Son of <br><span class="font-bold text-[#1e3a8a]">{{ data.parents?.groomParents }}</span></p>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block mt-4 px-6 py-2 bg-white rounded-full shadow-sm text-[10px] uppercase tracking-widest font-bold text-[#1e3a8a] hover:bg-[#ffb703] hover:text-white transition-colors border border-[#e0f2fe]"><i class="fa-brands fa-instagram mr-2"></i>Follow</a>
            </div>
          </div>

          <div class="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20" v-observe>
            <div class="w-full md:w-1/2 relative">
               <div class="aspect-square rounded-full p-2 bg-white shadow-xl border border-[#e0f2fe] relative z-10 mx-auto max-w-[300px]">
                  <img :src="data.bridePhotoUrl" class="w-full h-full object-cover rounded-full" />
               </div>
               <div class="absolute bottom-10 -left-4 w-20 h-20 bg-[#3b82f6] rounded-full blur-2xl opacity-40 z-0"></div>
            </div>
            <div class="w-full md:w-1/2 text-center md:text-right space-y-6">
              <span class="text-[10px] uppercase tracking-[0.4em] font-bold text-[#60a5fa]">The Bride</span>
              <h3 class="text-4xl md:text-6xl font-serif text-[#1e3a8a]">{{ data.brideName }}</h3>
              <p class="text-xs font-medium text-[#3b82f6] leading-relaxed">Daughter of <br><span class="font-bold text-[#1e3a8a]">{{ data.parents?.brideParents }}</span></p>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block mt-4 px-6 py-2 bg-white rounded-full shadow-sm text-[10px] uppercase tracking-widest font-bold text-[#1e3a8a] hover:bg-[#ffb703] hover:text-white transition-colors border border-[#e0f2fe]"><i class="fa-brands fa-instagram mr-2"></i>Follow</a>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-32 px-6 bg-[#1e3a8a]/5">
        <div class="max-w-4xl mx-auto space-y-16" v-observe>
          <div class="text-center">
             <h2 class="text-4xl md:text-5xl font-serif text-[#1e3a8a]">With Love, Our Family</h2>
             <p class="text-[10px] uppercase tracking-[0.3em] font-bold text-[#60a5fa] mt-2">Kami yang mengundang</p>
          </div>
          <div class="bg-white p-12 rounded-[40px] shadow-sm border border-[#e0f2fe]">
             <div class="grid grid-cols-2 gap-8 text-center">
                <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="text-sm font-bold text-[#1e3a8a] uppercase tracking-widest">
                   {{ person }}
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 relative">
        <div class="absolute inset-0 bg-[#e0f2fe]/50 -skew-y-3 origin-top-left z-0"></div>
        <div class="max-w-5xl mx-auto relative z-10">
          <div class="text-center mb-20" v-observe>
            <h2 class="text-5xl md:text-6xl font-serif text-[#1e3a8a] mb-4">When & Where</h2>
            <div class="w-16 h-1 bg-[#ffb703] mx-auto rounded-full"></div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-10">
            <!-- Akad -->
            <div class="bg-white p-10 rounded-[30px] shadow-xl border border-[#bae6fd] space-y-8 text-center transform hover:-translate-y-2 transition-transform duration-500" v-observe>
              <div class="w-16 h-16 bg-[#eff6ff] text-[#3b82f6] rounded-full flex items-center justify-center mx-auto text-2xl"><i class="fa-solid fa-ring"></i></div>
              <div>
                <h3 class="text-3xl font-serif text-[#1e3a8a] mb-2">Akad Nikah</h3>
                <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#60a5fa]">{{ formatDate(data.akadLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-4 pt-6 border-t border-[#e0f2fe]">
                <p class="flex items-center justify-center gap-3 text-sm font-bold text-[#1e3a8a]"><i class="fa-regular fa-clock text-[#ffb703]"></i> {{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                <p class="text-sm text-[#64748b] leading-relaxed">{{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="block w-full py-4 bg-[#f0f8ff] text-[#1e3a8a] font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-[#1e3a8a] hover:text-white transition-colors border border-[#bae6fd]">
                Open Map
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="bg-white p-10 rounded-[30px] shadow-xl border border-[#bae6fd] space-y-8 text-center transform hover:-translate-y-2 transition-transform duration-500" v-observe>
              <div class="w-16 h-16 bg-[#eff6ff] text-[#3b82f6] rounded-full flex items-center justify-center mx-auto text-2xl"><i class="fa-solid fa-champagne-glasses"></i></div>
              <div>
                <h3 class="text-3xl font-serif text-[#1e3a8a] mb-2">Resepsi</h3>
                <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#60a5fa]">{{ formatDate(data.resepsiLocation?.dateTime) }}</p>
              </div>
              <div class="space-y-4 pt-6 border-t border-[#e0f2fe]">
                <p class="flex items-center justify-center gap-3 text-sm font-bold text-[#1e3a8a]"><i class="fa-regular fa-clock text-[#ffb703]"></i> {{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                <p class="text-sm text-[#64748b] leading-relaxed">{{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="block w-full py-4 bg-[#f0f8ff] text-[#1e3a8a] font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-[#1e3a8a] hover:text-white transition-colors border border-[#bae6fd]">
                Open Map
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-20 text-center space-y-6" v-observe>
             <h3 class="text-sm uppercase tracking-[0.3em] font-black text-[#1e3a8a]">Dress Code</h3>
             <div class="bg-white px-12 py-8 rounded-full border-2 border-[#ffb703] shadow-lg shadow-[#ffb703]/10 inline-flex items-center gap-4">
                <i class="fa-solid fa-shirt text-[#ffb703]"></i>
                <p class="text-[#1e3a8a] font-bold uppercase tracking-widest text-xs">{{ data.dressCode }}</p>
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="mt-20 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-4 px-12 py-5 bg-[#1e3a8a] text-white rounded-full hover:bg-[#ffb703] hover:text-[#1e3a8a] transition-all shadow-xl hover:-translate-y-1 group">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40"><i class="fa-solid fa-video animate-pulse"></i></div>
                <span class="text-xs font-black uppercase tracking-[0.3em]">Join Celebration Online</span>
             </a>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-32 px-4">
        <div class="max-w-7xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <h2 class="text-5xl md:text-6xl font-serif text-[#1e3a8a] mb-4">Captured Moments</h2>
            <div class="w-16 h-1 bg-[#ffb703] mx-auto rounded-full"></div>
          </div>
          <div class="p-6 bg-white rounded-[40px] shadow-xl border border-[#e0f2fe]">
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6 bg-[#1e3a8a] text-white relative overflow-hidden">
        <div class="absolute bottom-0 left-0 w-full h-full opacity-10" style="background-image: radial-gradient(circle at center, white 1px, transparent 1px); background-size: 20px 20px;"></div>
        <div class="max-w-3xl mx-auto relative z-10">
          <div class="text-center mb-16" v-observe>
            <h2 class="text-5xl font-serif mb-4">Are you attending?</h2>
            <p class="text-xs uppercase tracking-widest font-bold text-[#93c5fd]">Please let us know</p>
          </div>

          <form @submit.prevent="submitRSVP" class="bg-white text-[#1e3a8a] p-8 md:p-12 rounded-[40px] shadow-2xl space-y-8" v-observe>
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#60a5fa] px-4">Full Name</label>
              <input v-model="rsvp.name" type="text" class="w-full bg-[#f0f8ff] border border-[#e0f2fe] rounded-2xl py-4 px-6 text-sm font-bold focus:border-[#3b82f6] outline-none transition-colors" required />
            </div>
            
            <div class="space-y-4">
               <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#60a5fa] px-4">Attendance</label>
               <div class="flex gap-4">
                 <label class="flex-1 py-4 border-2 rounded-2xl text-center cursor-pointer transition-all font-bold uppercase tracking-widest text-[10px]" :class="rsvp.attendance === 'hadir' ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-[#e0f2fe] hover:border-[#3b82f6] bg-[#f0f8ff]'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Yes, I will
                 </label>
                 <label class="flex-1 py-4 border-2 rounded-2xl text-center cursor-pointer transition-all font-bold uppercase tracking-widest text-[10px]" :class="rsvp.attendance === 'tidak' ? 'border-[#ef4444] bg-[#fef2f2] text-[#ef4444]' : 'border-[#e0f2fe] hover:border-[#ef4444] bg-[#f0f8ff]'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Sorry, No
                 </label>
               </div>
            </div>

            <div v-if="rsvp.attendance === 'hadir'" class="space-y-2">
              <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#60a5fa] px-4">Number of Guests</label>
              <select v-model="rsvp.totalGuests" class="w-full bg-[#f0f8ff] border border-[#e0f2fe] rounded-2xl py-4 px-6 text-sm font-bold focus:border-[#3b82f6] outline-none appearance-none">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} Person(s)</option>
              </select>
            </div>

            <div class="space-y-2">
               <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#60a5fa] px-4">Wishes</label>
               <textarea v-model="rsvp.message" rows="3" class="w-full bg-[#f0f8ff] border border-[#e0f2fe] rounded-2xl py-4 px-6 text-sm font-medium focus:border-[#3b82f6] outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-5 bg-[#ffb703] text-[#1e3a8a] text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-[#fbbf24] hover:-translate-y-1 shadow-lg transition-all">Send Confirmation</button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length" class="py-32 px-6 text-center">
        <div class="max-w-5xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <h2 class="text-5xl md:text-6xl font-serif text-[#1e3a8a] mb-4">Wedding Gift</h2>
            <div class="w-16 h-1 bg-[#ffb703] mx-auto rounded-full"></div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-8">
            <div v-for="(bank, idx) in data.bankAccounts" :key="idx" class="p-8 md:p-10 bg-white border border-[#e0f2fe] rounded-[30px] w-full sm:w-[400px] shadow-xl transform hover:-translate-y-2 transition-transform duration-500 text-left" v-observe>
              <div class="flex justify-between items-center mb-8">
                 <p class="text-lg font-bold uppercase tracking-widest text-[#3b82f6]">{{ bank.bankName }}</p>
                 <div class="w-12 h-12 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#1e3a8a]"><i class="fa-solid fa-gift text-xl"></i></div>
              </div>
              <p class="text-3xl font-bold tracking-widest mb-2 text-[#1e3a8a]">{{ bank.accountNumber }}</p>
              <p class="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-10">{{ bank.accountName }}</p>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full py-4 bg-[#f0f8ff] text-[#1e3a8a] text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-[#1e3a8a] hover:text-white transition-colors border border-[#bae6fd]">Copy Number</button>
            </div>
          </div>
        </div>
      </section>

      <footer class="py-24 text-center bg-white space-y-8 pb-32 md:pb-24 border-t border-[#e0f2fe]">
        <i class="fa-solid fa-sun text-[#ffb703] text-3xl"></i>
        <h2 class="font-serif text-4xl md:text-5xl font-bold text-[#1e3a8a]">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p class="text-[8px] uppercase tracking-widest font-bold text-[#93c5fd]">Made with love by SatuUndangan</p>
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
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'couple', label: 'Couple', icon: 'fa-solid fa-heart', key: 'couple' },
  { id: 'event', label: 'Events', icon: 'fa-solid fa-calendar-day', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-images', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-envelope', key: 'rsvp' }
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
    el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-10')
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
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}
function formatTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatInstagramUrl(handle) { return `https://instagram.com/${handle.replace('@', '')}` }
function copyToClipboard(text) { navigator.clipboard.writeText(text); toast.success('Number Copied') }

function initData() {
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) return toast.error("Please fill all fields")
  try {
    await createGuestMessage({
      invitationId: data.value.id, guestName: rsvp.value.name, message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance, totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0
    })
    toast.success("Thank you for confirming!")
  } catch (err) {
    console.error(err)
    toast.error("Failed to confirm.")
  }
}

onMounted(() => { initData() })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=Nunito:wght@300;400;700;900&display=swap');
.font-serif { font-family: 'DM Serif Display', serif; }
.font-sans { font-family: 'Nunito', sans-serif; }

.float-up-enter-active, .float-up-leave-active { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s; }
.float-up-leave-to { transform: translateY(-100%) scale(0.9); opacity: 0; }

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
.animate-float { animation: float 6s ease-in-out infinite; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f0f8ff; }
::-webkit-scrollbar-thumb { background: #93c5fd; border-radius: 10px; }
</style>
