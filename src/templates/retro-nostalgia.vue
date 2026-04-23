<template>
  <div class="relative min-h-screen bg-[#fdfbf7] overflow-hidden font-sans text-[#2c2c2c] selection:bg-[#e06d53] selection:text-white">
    <!-- Film Grain Overlay -->
    <div class="fixed inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay z-[100]" style="background-image: url('https://www.transparenttextures.com/patterns/stardust.png');"></div>

    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" class="z-[55]" />

    <nav v-if="!showWelcome" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2c2c2c] px-6 py-3 rounded-xl flex items-center justify-center gap-6 shadow-[4px_4px_0px_0px_rgba(224,109,83,1)] w-fit max-w-[95%] border-2 border-[#e06d53] transition-all duration-500">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300"
        :class="activeSection === item.id ? 'text-[#e06d53] -translate-y-1' : 'text-[#fdfbf7] hover:text-[#e06d53]'">
        <i :class="[item.icon, 'text-xl']"></i>
        <span class="text-[8px] font-bold uppercase tracking-widest">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="retro-slide">
      <div v-if="showWelcome" class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#2c2c2c] text-[#fdfbf7]">
        <div class="absolute inset-4 border-2 border-dashed border-[#e06d53]/30 rounded-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-12 w-full max-w-sm bg-[#fdfbf7] text-[#2c2c2c] p-10 rounded-2xl shadow-[8px_8px_0px_0px_rgba(224,109,83,1)] border-2 border-[#2c2c2c] rotate-[-2deg]">
          
          <div class="space-y-2">
            <h1 class="text-xs tracking-widest uppercase font-bold text-[#e06d53] border-b-2 border-dashed border-[#e06d53] pb-2 inline-block">{{ data.guestName ? 'Ticket For: ' + data.guestName : 'Admit One' }}</h1>
          </div>
          
          <div class="space-y-4">
            <p class="text-[10px] uppercase font-bold tracking-widest text-gray-400">Starring</p>
            <h2 class="text-4xl font-serif font-black uppercase leading-none">{{ data.groomName }}</h2>
            <p class="text-3xl font-serif font-black text-[#e06d53]">&</p>
            <h2 class="text-4xl font-serif font-black uppercase leading-none">{{ data.brideName }}</h2>
          </div>

          <button @click="openInvitation" class="w-full py-4 bg-[#e06d53] text-white font-black hover:bg-[#2c2c2c] transition-all duration-300 text-xs uppercase tracking-widest border-2 border-transparent hover:border-[#e06d53]">
            Tear Ticket
          </button>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto scroll-smooth">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 relative py-20 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        <div class="w-full max-w-4xl text-center space-y-12" v-observe>
          
          <div class="relative inline-block rotate-[3deg] hover:rotate-0 transition-transform duration-500">
            <div class="absolute -inset-2 bg-white shadow-xl border border-gray-200"></div>
            <div class="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#e06d53]/50 -rotate-12 mix-blend-multiply"></div>
            <img :src="data.photoCoupleUrl || 'https://via.placeholder.com/800x600'" class="relative z-10 w-full max-w-[600px] h-[400px] object-cover grayscale-[50%] contrast-125 sepia-[0.2] border-8 border-white border-b-[40px]" />
            <p class="absolute bottom-3 right-6 z-20 font-serif font-bold text-xl text-black rotate-[-5deg]">Est. 2026</p>
          </div>

          <div class="space-y-6 pt-10">
            <span class="inline-block px-4 py-1 bg-[#2c2c2c] text-[#fdfbf7] text-[10px] font-bold uppercase tracking-widest rounded-full">A Love Story</span>
            <h1 class="text-6xl md:text-8xl font-serif font-black uppercase leading-none text-center">
              {{ data.groomName }} <br><span class="text-[#e06d53]">&</span><br> {{ data.brideName }}
            </h1>
            <p class="text-sm font-bold uppercase tracking-[0.3em] text-[#e06d53]">{{ formatDate(data.akadLocation?.dateTime) }}</p>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6 bg-[#2c2c2c] text-[#fdfbf7]" v-observe>
        <div class="max-w-3xl mx-auto text-center space-y-8 relative">
          <i class="fa-solid fa-quote-left text-6xl text-[#e06d53] opacity-50 absolute -top-10 -left-6 md:-left-10"></i>
          <p class="text-2xl md:text-4xl font-serif font-bold leading-tight relative z-10">"{{ data.quoteText }}"</p>
          <div class="w-20 h-1 bg-[#e06d53] mx-auto"></div>
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400">{{ data.quoteSource }}</p>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-32 px-6 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        <div class="max-w-5xl mx-auto space-y-20">
          <div class="text-center" v-observe>
            <h2 class="text-6xl font-serif font-black uppercase italic">Our Story</h2>
            <div class="w-24 h-2 bg-[#e06d53] mx-auto mt-6"></div>
          </div>

          <div class="space-y-24 relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-1 before:bg-[#2c2c2c]/10 before:-translate-x-1/2 hidden md:block">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="relative flex items-center justify-between" v-observe>
              <div class="w-[45%]" :class="idx % 2 === 0 ? 'text-right' : 'order-last text-left'">
                <div class="bg-white p-6 border-2 border-[#2c2c2c] shadow-[6px_6px_0px_0px_rgba(44,44,44,1)] space-y-4" :class="idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'">
                  <span class="text-[#e06d53] font-bold text-xs">{{ story.date }}</span>
                  <h3 class="text-2xl font-serif font-black uppercase">{{ story.title }}</h3>
                  <p class="text-sm font-medium text-gray-600 leading-relaxed">{{ story.description }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#e06d53] border-4 border-[#fdfbf7] z-10"></div>
              <div class="w-[45%]" :class="idx % 2 === 0 ? 'order-last' : ''">
                <div v-if="story.image" class="relative group" :class="idx % 2 === 0 ? 'rotate-[3deg]' : 'rotate-[-3deg]'">
                  <div class="absolute -inset-2 bg-white shadow-lg border border-gray-200"></div>
                  <img :src="story.image" class="relative z-10 w-full aspect-video object-cover border-4 border-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Story -->
          <div class="md:hidden space-y-16">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="space-y-6" v-observe>
               <div class="bg-white p-6 border-2 border-[#2c2c2c] shadow-[6px_6px_0px_0px_rgba(44,44,44,1)] space-y-4">
                  <span class="text-[#e06d53] font-bold text-xs">{{ story.date }}</span>
                  <h3 class="text-2xl font-serif font-black uppercase">{{ story.title }}</h3>
                  <p class="text-sm font-medium text-gray-600 leading-relaxed">{{ story.description }}</p>
               </div>
               <div v-if="story.image" class="relative max-w-[280px] mx-auto rotate-[2deg]">
                  <div class="absolute -inset-2 bg-white shadow-lg border border-gray-200"></div>
                  <img :src="story.image" class="relative z-10 w-full aspect-square object-cover border-4 border-white border-b-[30px]" />
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6 relative overflow-hidden">
        <div class="absolute top-20 left-10 w-32 h-32 border-4 border-dashed border-[#e06d53]/20 rounded-full animate-spin-slow"></div>
        <div class="max-w-5xl mx-auto space-y-32">
          
          <div class="grid md:grid-cols-2 gap-12 md:gap-20 items-center" v-observe>
            <div class="order-2 md:order-1 space-y-6 bg-white p-8 border-2 border-[#2c2c2c] shadow-[8px_8px_0px_0px_rgba(44,44,44,1)] rotate-[-1deg]">
              <span class="inline-block px-3 py-1 bg-[#e06d53] text-white text-[10px] font-bold uppercase tracking-widest">The Groom</span>
              <h3 class="text-5xl font-serif font-black uppercase">{{ data.groomName }}</h3>
              <p class="text-sm font-bold text-gray-500">Putra dari Bpk. {{ data.parents?.groomParents?.split('&')[0] }} <br>& Ibu {{ data.parents?.groomParents?.split('&')[1] }}</p>
              <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-[#2c2c2c] hover:text-[#e06d53] underline decoration-2 underline-offset-4"><i class="fa-brands fa-instagram mr-2"></i>@{{ data.socialMediaGroom.instagram }}</a>
            </div>
            <div class="order-1 md:order-2 relative rotate-[3deg] hover:rotate-0 transition-transform duration-500 mx-auto max-w-[300px]">
               <div class="absolute -inset-2 bg-white shadow-xl border border-gray-200"></div>
               <img :src="data.groomPhotoUrl" class="relative z-10 w-full aspect-square object-cover grayscale contrast-125 border-8 border-white border-b-[40px]" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-12 md:gap-20 items-center" v-observe>
            <div class="relative rotate-[-3deg] hover:rotate-0 transition-transform duration-500 mx-auto max-w-[300px]">
               <div class="absolute -inset-2 bg-white shadow-xl border border-gray-200"></div>
               <img :src="data.bridePhotoUrl" class="relative z-10 w-full aspect-square object-cover grayscale contrast-125 border-8 border-white border-b-[40px]" />
            </div>
            <div class="space-y-6 bg-white p-8 border-2 border-[#2c2c2c] shadow-[-8px_8px_0px_0px_rgba(44,44,44,1)] rotate-[1deg]">
              <span class="inline-block px-3 py-1 bg-[#e06d53] text-white text-[10px] font-bold uppercase tracking-widest">The Bride</span>
              <h3 class="text-5xl font-serif font-black uppercase">{{ data.brideName }}</h3>
              <p class="text-sm font-bold text-gray-500">Putri dari Bpk. {{ data.parents?.brideParents?.split('&')[0] }} <br>& Ibu {{ data.parents?.brideParents?.split('&')[1] }}</p>
              <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-[#2c2c2c] hover:text-[#e06d53] underline decoration-2 underline-offset-4"><i class="fa-brands fa-instagram mr-2"></i>@{{ data.socialMediaBrides.instagram }}</a>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-32 px-6 bg-[#2c2c2c] text-[#fdfbf7]">
        <div class="max-w-4xl mx-auto space-y-12" v-observe>
          <div class="text-center">
             <h2 class="text-4xl font-serif font-black uppercase">Kami Yang Mengundang</h2>
             <div class="w-16 h-1 bg-[#e06d53] mx-auto mt-4"></div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
             <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="text-center font-bold text-sm border border-white/10 py-4 px-2 hover:bg-[#e06d53] hover:border-transparent transition-all duration-300">
                {{ person }}
             </div>
          </div>
        </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 bg-[#e06d53] text-[#fdfbf7] relative">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-20" v-observe>
            <h2 class="text-6xl font-serif font-black uppercase">Schedule</h2>
            <div class="w-24 h-2 bg-[#2c2c2c] mx-auto mt-6"></div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-12">
            <!-- Akad -->
            <div class="bg-[#fdfbf7] text-[#2c2c2c] p-8 border-4 border-[#2c2c2c] shadow-[12px_12px_0px_0px_rgba(44,44,44,1)] space-y-6 transform hover:-translate-y-2 transition-transform duration-300" v-observe>
              <div class="flex justify-between items-center border-b-4 border-[#2c2c2c] pb-4">
                <h3 class="text-3xl font-serif font-black uppercase">Akad</h3>
                <i class="fa-solid fa-ring text-4xl text-[#e06d53]"></i>
              </div>
              <div class="space-y-4 font-bold text-sm">
                <p class="flex items-center gap-3"><i class="fa-regular fa-calendar text-xl"></i> {{ formatDate(data.akadLocation?.dateTime) }}</p>
                <p class="flex items-center gap-3"><i class="fa-regular fa-clock text-xl"></i> {{ formatTime(data.akadLocation?.dateTime) }} WIB</p>
                <p class="flex items-start gap-3 leading-relaxed"><i class="fa-solid fa-location-dot text-xl mt-1"></i> {{ data.akadLocation?.description }}</p>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank" class="block w-full text-center py-4 bg-[#2c2c2c] text-white font-black uppercase tracking-widest text-xs hover:bg-[#e06d53] transition-colors border-2 border-[#2c2c2c] hover:border-white">
                View on Map
              </a>
            </div>

            <!-- Resepsi -->
            <div v-if="!data.mergeEvents" class="bg-[#fdfbf7] text-[#2c2c2c] p-8 border-4 border-[#2c2c2c] shadow-[12px_12px_0px_0px_rgba(44,44,44,1)] space-y-6 transform hover:-translate-y-2 transition-transform duration-300 mt-12 md:mt-0" v-observe>
              <div class="flex justify-between items-center border-b-4 border-[#2c2c2c] pb-4">
                <h3 class="text-3xl font-serif font-black uppercase">Resepsi</h3>
                <i class="fa-solid fa-champagne-glasses text-4xl text-[#e06d53]"></i>
              </div>
              <div class="space-y-4 font-bold text-sm">
                <p class="flex items-center gap-3"><i class="fa-regular fa-calendar text-xl"></i> {{ formatDate(data.resepsiLocation?.dateTime) }}</p>
                <p class="flex items-center gap-3"><i class="fa-regular fa-clock text-xl"></i> {{ formatTime(data.resepsiLocation?.dateTime) }} WIB</p>
                <p class="flex items-start gap-3 leading-relaxed"><i class="fa-solid fa-location-dot text-xl mt-1"></i> {{ data.resepsiLocation?.description }}</p>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank" class="block w-full text-center py-4 bg-[#2c2c2c] text-white font-black uppercase tracking-widest text-xs hover:bg-[#e06d53] transition-colors border-2 border-[#2c2c2c] hover:border-white">
                View on Map
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-20 text-center space-y-6" v-observe>
             <h3 class="text-2xl font-serif font-black uppercase underline decoration-4 decoration-[#2c2c2c] underline-offset-8">Dress Code</h3>
             <div class="p-8 bg-white border-4 border-[#2c2c2c] shadow-[8px_8px_0px_0px_rgba(44,44,44,1)] inline-block px-12 text-[#2c2c2c] font-black uppercase tracking-widest text-xs">
                <i class="fa-solid fa-shirt text-[#e06d53] text-2xl mb-4 block"></i>
                <p>{{ data.dressCode }}</p>
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="mt-20 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-6 px-12 py-5 bg-[#2c2c2c] text-white border-4 border-white shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                <i class="fa-solid fa-video text-2xl text-[#e06d53]"></i>
                <span class="text-sm font-black uppercase tracking-[0.3em]">Watch Virtual Wedding</span>
             </a>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-32 px-4 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        <div class="max-w-7xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <h2 class="text-6xl font-serif font-black uppercase">Memories</h2>
            <div class="w-24 h-2 bg-[#e06d53] mx-auto mt-6"></div>
          </div>
          <div class="p-4 md:p-8 bg-white border-4 border-[#2c2c2c] shadow-[16px_16px_0px_0px_rgba(224,109,83,1)]">
             <GalleryInvitation :items="galleryImages" />
          </div>
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6 bg-[#2c2c2c] text-[#fdfbf7]">
        <div class="max-w-3xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <h2 class="text-6xl font-serif font-black uppercase">R.S.V.P</h2>
            <p class="text-sm font-bold uppercase tracking-widest text-gray-400 mt-4">We'd love to see you there</p>
            <div class="w-24 h-2 bg-[#e06d53] mx-auto mt-6"></div>
          </div>

          <form @submit.prevent="submitRSVP" class="bg-[#fdfbf7] text-[#2c2c2c] p-8 md:p-12 border-4 border-[#e06d53] shadow-[12px_12px_0px_0px_rgba(224,109,83,1)] space-y-8" v-observe>
            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest">Full Name</label>
              <input v-model="rsvp.name" type="text" class="w-full bg-transparent border-b-4 border-[#2c2c2c] py-3 text-xl font-bold focus:border-[#e06d53] outline-none transition-colors" required />
            </div>
            
            <div class="space-y-4">
               <label class="text-xs font-black uppercase tracking-widest">Will you attend?</label>
               <div class="grid grid-cols-2 gap-4">
                 <label class="flex items-center justify-center gap-2 py-4 border-4 cursor-pointer transition-all font-bold uppercase tracking-widest text-xs" :class="rsvp.attendance === 'hadir' ? 'border-[#2c2c2c] bg-[#2c2c2c] text-white' : 'border-[#2c2c2c] hover:bg-gray-100'">
                   <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden"> Heck Yes!
                 </label>
                 <label class="flex items-center justify-center gap-2 py-4 border-4 cursor-pointer transition-all font-bold uppercase tracking-widest text-xs" :class="rsvp.attendance === 'tidak' ? 'border-[#e06d53] bg-[#e06d53] text-white' : 'border-[#2c2c2c] hover:bg-gray-100'">
                   <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden"> Sadly No
                 </label>
               </div>
            </div>

            <div v-if="rsvp.attendance === 'hadir'" class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest">Number of Guests</label>
              <select v-model="rsvp.totalGuest" class="w-full bg-transparent border-b-4 border-[#2c2c2c] py-3 text-xl font-bold focus:border-[#e06d53] outline-none">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} Person(s)</option>
              </select>
            </div>

            <div class="space-y-2">
               <label class="text-xs font-black uppercase tracking-widest">Leave a Note</label>
               <textarea v-model="rsvp.message" rows="3" class="w-full bg-transparent border-4 border-[#2c2c2c] p-4 text-sm font-bold focus:border-[#e06d53] outline-none resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-5 bg-[#e06d53] text-white text-sm uppercase tracking-widest font-black hover:bg-[#2c2c2c] transition-all border-4 border-[#2c2c2c] hover:border-transparent">Send RSVP</button>
          </form>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length" class="py-32 px-6 text-center bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        <div class="max-w-4xl mx-auto space-y-16">
          <div class="text-center" v-observe>
            <h2 class="text-6xl font-serif font-black uppercase">Wedding Gift</h2>
            <div class="w-24 h-2 bg-[#e06d53] mx-auto mt-6"></div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-8">
            <div v-for="(bank, idx) in data.bankAccounts" :key="idx" class="p-8 border-4 border-[#2c2c2c] bg-white w-full sm:w-[400px] shadow-[12px_12px_0px_0px_rgba(224,109,83,1)] transform hover:-translate-y-2 transition-transform duration-300 text-left" v-observe>
              <div class="flex justify-between items-center mb-8 border-b-4 border-[#2c2c2c] pb-4">
                 <p class="text-2xl font-serif font-black uppercase">{{ bank.bankName }}</p>
                 <i class="fa-solid fa-money-bill-wave text-3xl text-[#e06d53]"></i>
              </div>
              <p class="text-4xl font-black tracking-tighter mb-2">{{ bank.accountNumber }}</p>
              <p class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">{{ bank.accountName }}</p>
              <button @click="copyToClipboard(bank.accountNumber)" class="w-full py-4 bg-[#2c2c2c] text-white text-xs uppercase tracking-widest font-black hover:bg-[#e06d53] transition-all border-2 border-[#2c2c2c] hover:border-white">Copy Account Number</button>
            </div>
          </div>
        </div>
      </section>

      <footer class="py-24 text-center bg-[#2c2c2c] text-[#fdfbf7] space-y-6 pb-32 md:pb-24 border-t-8 border-[#e06d53]">
        <h2 class="font-serif text-5xl font-black uppercase">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Est. 2026 / Created with SatuUndangan</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
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
const rsvp = ref({ name: '', attendance: '', totalGuest: 1, message: '' })

const allNavItems = [
  { id: 'home', label: 'Ticket', icon: 'fa-solid fa-ticket', key: 'hero' },
  { id: 'couple', label: 'Cast', icon: 'fa-solid fa-star', key: 'couple' },
  { id: 'event', label: 'Showtime', icon: 'fa-solid fa-film', key: 'event' },
  { id: 'gallery', label: 'Stills', icon: 'fa-solid fa-camera-retro', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-pen-nib', key: 'rsvp' }
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
    el.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-700', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.remove('opacity-0', 'scale-95')
          el.classList.add('opacity-100', 'scale-100')
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
function copyToClipboard(text) { navigator.clipboard.writeText(text); toast.success('Account Copied!') }

function initData() {
  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  }
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) return toast.error("Missing required fields")
  try {
    await createGuestMessage({
      invitationId: data.value.id, guestName: rsvp.value.name, message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance, totalGuest: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuest) : 0
    })
    toast.success("RSVP Received!")
    rsvp.value = { name: '', attendance: '', totalGuest: 1, message: '' }
  } catch (err) { toast.error("Failed to send RSVP") }
}

onMounted(() => { initData() })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
.font-serif { font-family: 'Courier Prime', monospace; }
.font-sans { font-family: 'Space Mono', monospace; }

.retro-slide-enter-active, .retro-slide-leave-active { transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.5s; }
.retro-slide-leave-to { transform: translateY(-100%); opacity: 0; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #fdfbf7; border-left: 2px solid #2c2c2c; }
::-webkit-scrollbar-thumb { background: #e06d53; border: 2px solid #2c2c2c; }
</style>
