<template>
  <div class="relative min-h-screen bg-[#f4f1ea] overflow-hidden font-sans no-scrollbar text-[#5d4037] selection:bg-[#e07a5f]/30">
    
    <!-- Organic Background Shapes -->
    <div class="fixed top-[-10%] -right-[10%] w-[500px] h-[500px] z-0 opacity-20 pointer-events-none text-[#e07a5f]">
       <svg viewBox="0 0 200 200" fill="currentColor">
         <path d="M44.7,-76.4C58.1,-69.2,69.2,-57.1,76.4,-43.3C83.6,-29.5,86.9,-14.8,85.2,-0.9C83.6,12.9,77,25.8,69.1,38.2C61.2,50.6,52,62.5,40.1,70.1C28.2,77.7,14.1,81,-0.7,82.2C-15.5,83.4,-31,82.5,-44.2,75.6C-57.4,68.7,-68.3,55.8,-75.8,41.6C-83.3,27.4,-87.4,11.9,-86.3,-3.2C-85.2,-18.3,-78.9,-33,-69.4,-45.4C-59.9,-57.8,-47.2,-67.9,-33.6,-75C-20,-82.1,-10,-86.2,2.4,-90.3C14.8,-94.4,29.6,-98.5,44.7,-76.4Z" transform="translate(100 100)" />
       </svg>
    </div>
    <div class="fixed bottom-[-5%] -left-[5%] w-[400px] h-[400px] z-0 opacity-20 pointer-events-none text-[#81b29a]">
       <svg viewBox="0 0 200 200" fill="currentColor">
         <path d="M38.1,-65.4C49.1,-58.8,57.6,-48.1,64.4,-36.3C71.2,-24.5,76.3,-11.6,76.1,1.3C75.9,14.2,70.4,27.1,62.4,38.3C54.4,49.5,43.9,59,31.7,65.1C19.5,71.2,5.6,73.9,-8.4,72.5C-22.4,71.1,-36.5,65.6,-48.1,56.8C-59.7,48.1,-68.8,36.1,-74.1,22.6C-79.4,9.1,-80.9,-5.9,-77.4,-19.8C-73.9,-33.7,-65.4,-46.5,-53.8,-52.9C-42.2,-59.3,-27.5,-59.3,-14,-61.1C-0.5,-62.9,12.9,-66.5,27.1,-72C41.3,-77.5,56.3,-84.9,38.1,-65.4Z" transform="translate(100 100)" />
       </svg>
    </div>

    <!-- Music Control -->
    <MusicControl v-if="data.musicChoice" :src="getMusicUrl(data.musicChoice)" :audioStart="data.audioStart" :audioEnd="data.audioEnd" />

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!showWelcome"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3d405b]/90 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center justify-center gap-8 shadow-xl w-fit max-w-[90%] md:hidden transition-all duration-500">
      <button v-for="item in navItems" :key="item.id" @click="scrollToSection(item.id)"
        class="flex flex-col items-center gap-1 transition-all duration-300 relative group"
        :class="activeSection === item.id ? 'text-[#f2cc8f] scale-110' : 'text-white/40 hover:text-[#f2cc8f]'">
        <i :class="[item.icon, 'text-lg']"></i>
        <span class="text-[7px] font-bold uppercase tracking-widest">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Welcome Screen -->
    <transition name="fade">
      <div v-if="showWelcome"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 bg-[#f4f1ea] transition-all duration-1000">
        
        <div class="relative z-10 space-y-12 animate-fade-in-up">
          <div class="space-y-4">
            <span class="text-[10px] tracking-[0.4em] uppercase text-[#e07a5f] font-bold">Hello, You Are Invited</span>
            <div class="flex flex-col items-center">
              <h2 class="text-6xl md:text-8xl font-playfair italic text-[#3d405b]">{{ data.groomName }}</h2>
              <span class="text-2xl text-[#81b29a] my-[-10px] font-playfair">&</span>
              <h2 class="text-6xl md:text-8xl font-playfair italic text-[#3d405b]">{{ data.brideName }}</h2>
            </div>
          </div>

          <div class="max-w-xs mx-auto space-y-8">
            <div class="space-y-2">
               <p class="text-[10px] uppercase tracking-widest text-gray-400">Dear Our Friend</p>
               <p class="text-2xl font-medium text-[#3d405b]">{{ data.guestName }}</p>
            </div>
            <button @click="openInvitation"
              class="w-full py-4 bg-[#3d405b] text-white font-bold rounded-2xl transition-all hover:bg-[#e07a5f] flex items-center justify-center gap-3 text-xs uppercase tracking-widest group">
              View Invitation
              <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MAIN CONTENT -->
    <div v-if="!showWelcome" id="main-content" class="relative z-30 opacity-0 transition-opacity duration-1000 h-screen overflow-y-auto no-scrollbar scroll-smooth">
      
      <!-- HERO -->
      <section id="home" class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div class="space-y-8 max-w-2xl mx-auto" v-observe>
          <div class="w-16 h-16 mx-auto bg-[#f2cc8f] rounded-full flex items-center justify-center mb-4">
             <i class="fa-solid fa-heart text-[#3d405b]"></i>
          </div>
          <h1 class="text-5xl md:text-8xl font-playfair leading-tight text-[#3d405b]">
            {{ data.groomName }} <br> <span class="text-3xl italic text-[#e07a5f]">&</span> <br> {{ data.brideName }}
          </h1>
          <p class="text-sm md:text-base text-[#81b29a] font-bold tracking-[0.3em] uppercase">
            {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
          </p>

          <!-- Countdown -->
          <div class="flex justify-center gap-6 mt-16">
            <div v-for="(val, label) in countdown" :key="label" class="flex flex-col items-center">
              <div class="text-3xl md:text-5xl font-light text-[#3d405b]">{{ val }}</div>
              <div class="text-[8px] uppercase tracking-widest text-[#e07a5f] font-bold">{{ label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- QUOTE -->
      <section class="py-32 px-6 bg-white/40" v-observe>
        <div class="max-w-2xl mx-auto text-center border-l-4 border-[#f2cc8f] pl-8">
          <p class="text-xl md:text-3xl text-[#3d405b] italic leading-snug font-playfair mb-6">
            "{{ data.quoteText }}"
          </p>
          <p class="text-xs font-bold text-[#e07a5f] tracking-[0.2em] uppercase">— {{ data.quoteSource }}</p>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section id="story" v-if="isSectionEnabled('love-story') && data.loveStory?.length" class="py-32 px-6 bg-[#f4f1ea]">
        <div class="max-w-4xl mx-auto space-y-24">
          <div class="text-center space-y-4" v-observe>
            <h2 class="text-3xl md:text-5xl font-playfair italic text-[#3d405b]">Our Voyage</h2>
            <div class="w-16 h-1 bg-[#81b29a] rounded-full mx-auto"></div>
          </div>

          <div class="space-y-20">
            <div v-for="(story, idx) in data.loveStory" :key="idx" class="relative" v-observe>
               <div class="grid md:grid-cols-2 gap-12 items-center">
                  <div :class="idx % 2 === 0 ? '' : 'md:order-last'">
                     <div class="rounded-[2rem] overflow-hidden shadow-lg aspect-square grayscale hover:grayscale-0 transition-all duration-700">
                        <img v-if="story.image" :src="story.image" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full bg-[#3d405b]/5 flex items-center justify-center"><i class="fa-solid fa-heart text-[#e07a5f]/20 text-4xl"></i></div>
                     </div>
                  </div>
                  <div class="space-y-4" :class="idx % 2 === 0 ? 'text-left' : 'text-left md:text-right'">
                     <span class="text-[#e07a5f] font-bold text-xs uppercase tracking-[0.2em]">{{ story.date }}</span>
                     <h3 class="text-2xl md:text-3xl font-playfair italic text-[#3d405b]">{{ story.title }}</h3>
                     <p class="text-gray-500 text-sm md:text-base leading-relaxed font-light">{{ story.description }}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- COUPLE -->
      <section id="couple" v-if="isSectionEnabled('couple')" class="py-32 px-6">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-3xl md:text-5xl font-playfair text-center text-[#3d405b] mb-24" v-observe>The Couple</h2>
          
          <div class="grid md:grid-cols-2 gap-24 items-start">
            <!-- Groom -->
            <div class="space-y-8" v-observe>
              <div class="relative">
                <div class="absolute -top-6 -left-6 w-32 h-32 bg-[#81b29a]/20 rounded-full -z-10 animate-pulse"></div>
                <div class="rounded-[3rem] rounded-tr-none overflow-hidden shadow-xl aspect-[4/5] bg-gray-200">
                  <img :src="data.groomPhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full object-cover" />
                </div>
              </div>
              <div class="space-y-2">
                <h3 class="text-3xl md:text-4xl font-playfair italic text-[#3d405b]">{{ data.groomName }}</h3>
                <p class="text-xs uppercase tracking-widest text-[#e07a5f] font-bold">The Groom</p>
                <p class="text-sm text-gray-500 leading-relaxed pt-2">Son of {{ data.parents?.groomParents }}</p>
                <a v-if="data.socialMediaGroom?.instagram" :href="formatInstagramUrl(data.socialMediaGroom.instagram)" target="_blank" class="inline-block mt-4 text-[#3d405b] hover:text-[#e07a5f] transition-colors">
                  <i class="fa-brands fa-instagram text-2xl"></i>
                </a>
              </div>
            </div>

            <!-- Bride -->
            <div class="space-y-8 md:mt-32" v-observe>
              <div class="relative">
                <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f2cc8f]/30 rounded-full -z-10 animate-pulse"></div>
                <div class="rounded-[3rem] rounded-bl-none overflow-hidden shadow-xl aspect-[4/5] bg-gray-200">
                  <img :src="data.bridePhotoUrl || 'https://via.placeholder.com/400x600'" class="w-full h-full object-cover" />
                </div>
              </div>
              <div class="space-y-2 md:text-right">
                <h3 class="text-3xl md:text-4xl font-playfair italic text-[#3d405b]">{{ data.brideName }}</h3>
                <p class="text-xs uppercase tracking-widest text-[#e07a5f] font-bold">The Bride</p>
                <p class="text-sm text-gray-500 leading-relaxed pt-2">Daughter of {{ data.parents?.brideParents }}</p>
                <a v-if="data.socialMediaBrides?.instagram" :href="formatInstagramUrl(data.socialMediaBrides.instagram)" target="_blank" class="inline-block mt-4 text-[#3d405b] hover:text-[#e07a5f] transition-colors">
                  <i class="fa-brands fa-instagram text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EXTENDED FAMILY -->
      <section v-if="isSectionEnabled('extended-family') && data.extendedFamily?.length" class="py-32 px-6 bg-white/40 text-center border-y border-[#f2cc8f]/20">
         <div class="max-w-4xl mx-auto space-y-12" v-observe>
            <h3 class="text-2xl md:text-4xl font-playfair italic text-[#3d405b]">The Family Circle</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               <div v-for="(person, idx) in data.extendedFamily" :key="idx" class="p-6 bg-[#f4f1ea] rounded-[2rem] text-sm text-[#5d4037] font-medium tracking-wide">
                  {{ person }}
               </div>
            </div>
         </div>
      </section>

      <!-- EVENTS -->
      <section id="event" v-if="isSectionEnabled('event')" class="py-32 px-6 bg-[#3d405b] text-[#f4f1ea] rounded-[4rem] mx-4 md:mx-10 my-10">
        <div class="max-w-4xl mx-auto text-center space-y-20">
          <div class="space-y-4">
            <h2 class="text-4xl md:text-6xl font-playfair italic" v-observe>Join Our Celebration</h2>
            <p class="text-[#f2cc8f] text-sm tracking-[0.3em] uppercase" v-observe>Save The Date</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-12 text-left">
            <div class="p-8 border border-white/10 rounded-3xl space-y-6 hover:bg-white/5 transition-colors" v-observe>
              <h3 class="text-2xl font-playfair italic text-[#f2cc8f]">Akad Nikah</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-calendar-check text-[#81b29a] text-xl"></i>
                  <span>{{ formatDate(data.akadLocation?.dateTime) }}</span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-clock text-[#81b29a] text-xl"></i>
                  <span>{{ formatTime(data.akadLocation?.dateTime) }} WIB</span>
                </div>
                <div class="flex items-start gap-4 text-sm">
                  <i class="fa-solid fa-location-dot text-[#81b29a] text-xl"></i>
                  <span class="leading-relaxed">{{ data.akadLocation?.description }}</span>
                </div>
              </div>
              <a :href="data.akadLocation?.mapUrl" target="_blank"
                class="w-full py-3 bg-white/10 hover:bg-[#f2cc8f] hover:text-[#3d405b] text-white rounded-xl transition-all text-center block text-[10px] uppercase font-bold tracking-widest">
                Google Maps
              </a>
            </div>

            <div v-if="!data.mergeEvents" class="p-8 border border-white/10 rounded-3xl space-y-6 hover:bg-white/5 transition-colors" v-observe>
              <h3 class="text-2xl font-playfair italic text-[#f2cc8f]">Resepsi</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-calendar-check text-[#81b29a] text-xl"></i>
                  <span>{{ formatDate(data.resepsiLocation?.dateTime) }}</span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <i class="fa-regular fa-clock text-[#81b29a] text-xl"></i>
                  <span>{{ formatTime(data.resepsiLocation?.dateTime) }} WIB</span>
                </div>
                <div class="flex items-start gap-4 text-sm">
                  <i class="fa-solid fa-location-dot text-[#81b29a] text-xl"></i>
                  <span class="leading-relaxed">{{ data.resepsiLocation?.description }}</span>
                </div>
              </div>
              <a :href="data.resepsiLocation?.mapUrl" target="_blank"
                class="w-full py-3 bg-white/10 hover:bg-[#f2cc8f] hover:text-[#3d405b] text-white rounded-xl transition-all text-center block text-[10px] uppercase font-bold tracking-widest">
                Google Maps
              </a>
            </div>
          </div>

          <!-- DRESS CODE -->
          <div v-if="isSectionEnabled('dress-code') && data.dressCode" class="mt-20 text-center space-y-6" v-observe>
             <h3 class="text-sm uppercase tracking-[0.3em] font-bold text-[#f2cc8f]">Dress Code</h3>
             <div class="p-8 border border-white/10 rounded-[3rem] inline-block px-12">
                <i class="fa-solid fa-shirt text-[#81b29a] text-2xl mb-4 block"></i>
                <p class="text-white text-sm font-medium">{{ data.dressCode }}</p>
             </div>
          </div>

          <!-- LIVE STREAMING -->
          <div v-if="isSectionEnabled('live-streaming') && data.liveStreamingUrl" class="mt-20 text-center" v-observe>
             <a :href="data.liveStreamingUrl" target="_blank" class="inline-flex items-center gap-4 px-12 py-5 bg-[#f2cc8f] text-[#3d405b] rounded-full hover:bg-white transition-all shadow-2xl hover:-translate-y-1">
                <i class="fa-solid fa-video animate-pulse"></i>
                <span class="text-xs font-black uppercase tracking-[0.3em]">Watch Stream</span>
             </a>
          </div>

          <div v-observe>
            <button @click="addToCalendar"
              class="px-12 py-4 bg-[#f2cc8f] text-[#3d405b] rounded-2xl font-black hover:scale-105 transition-all shadow-xl text-xs uppercase tracking-[0.2em]">
              Save to Calendar
            </button>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" v-if="isSectionEnabled('gallery') && galleryImages.length" class="py-32 px-4 bg-[#f4f1ea]">
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-col items-center mb-20 space-y-4 text-center">
            <h2 class="text-4xl md:text-6xl font-playfair italic text-[#3d405b]" v-observe>Moments</h2>
            <div class="w-20 h-1 bg-[#e07a5f] rounded-full"></div>
          </div>
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- RSVP -->
      <section id="rsvp" v-if="isSectionEnabled('rsvp')" class="py-32 px-6">
        <div class="max-w-xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-[#f2cc8f]/30" v-observe>
          <div class="text-center mb-12">
            <h2 class="text-4xl font-playfair italic text-[#3d405b]">RSVP</h2>
            <p class="text-[#81b29a] text-[10px] uppercase tracking-widest font-bold mt-2">Kindly Respond</p>
          </div>

          <form @submit.prevent="submitRSVP" class="space-y-8">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-2">Your Name</label>
              <input v-model="rsvp.name" type="text" placeholder="Full Name"
                class="w-full bg-[#f4f1ea] border-0 rounded-2xl px-6 py-4 text-[#3d405b] focus:ring-2 focus:ring-[#81b29a] outline-none transition-all placeholder-gray-300"
                required />
            </div>

            <div class="grid grid-cols-3 gap-3">
              <label v-for="opt in [{v:'hadir',l:'Will Attend'},{v:'tidak',l:'Unable'},{v:'ragu',l:'Maybe'}]" :key="opt.v"
                class="flex items-center justify-center py-4 rounded-2xl cursor-pointer border-2 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                :class="rsvp.attendance === opt.v ? 'bg-[#3d405b] border-[#3d405b] text-white shadow-lg' : 'bg-transparent border-[#f4f1ea] text-gray-400 hover:border-[#81b29a]/30'">
                <input type="radio" :value="opt.v" v-model="rsvp.attendance" class="hidden"> {{ opt.l }}
              </label>
            </div>

            <select v-if="rsvp.attendance === 'hadir'" v-model="rsvp.totalGuests"
              class="w-full bg-[#f4f1ea] border-0 rounded-2xl px-6 py-4 text-[#3d405b] focus:ring-2 focus:ring-[#81b29a] outline-none font-bold text-xs">
              <option value="" disabled>Number of Guests</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} People</option>
            </select>

            <textarea v-model="rsvp.message" rows="4" placeholder="Your Blessing & Message"
              class="w-full bg-[#f4f1ea] border-0 rounded-2xl px-6 py-4 text-[#3d405b] focus:ring-2 focus:ring-[#81b29a] outline-none placeholder-gray-300"></textarea>

            <button type="submit"
              class="w-full py-5 bg-[#e07a5f] text-white font-bold rounded-2xl transition-all shadow-xl hover:bg-[#3d405b] uppercase tracking-[0.2em] text-[10px]">
              Confirm Attendance
            </button>
          </form>
        </div>
      </section>

      <!-- VIDEO PREWEDDING -->
      <section v-if="data.videoPrewedding && isSectionEnabled('video')" class="py-32 px-6 bg-[#f4f1ea]">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-playfair italic text-[#3d405b] mb-10" v-observe>Video Prewedding</h2>
          <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#f2cc8f]/20">
            <iframe :src="getEmbedUrlVideo(data.videoPrewedding)" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <!-- MENU -->
      <section v-if="data.menu?.items?.length && isSectionEnabled('menu')" class="py-32 px-6 bg-white/40">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-playfair italic text-[#3d405b] mb-10" v-observe>{{ data.menu.title || 'Menu Hidangan' }}</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(item, idx) in data.menu.items" :key="idx"
              class="bg-[#f4f1ea] p-6 rounded-[2rem] border border-[#f2cc8f]/30 text-left" v-observe>
              <h4 class="text-base font-medium text-[#3d405b]">{{ item.name || item }}</h4>
            </div>
          </div>
        </div>
      </section>

      <!-- GIFT -->
      <section v-if="data.bankAccounts?.length && isSectionEnabled('gift')" class="py-32 px-6 text-center bg-[#f4f1ea]">
        <h2 class="text-3xl font-playfair italic text-[#3d405b] mb-4" v-observe>Wedding Gift</h2>
        <p class="text-gray-400 mb-16 max-w-md mx-auto text-sm leading-relaxed">Your presence is enough for us, but if you wish to give a gift, you can use:</p>

        <div class="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          <div v-for="(bank, idx) in data.bankAccounts" :key="idx"
            class="bg-white p-10 rounded-[3rem] w-full sm:w-[320px] shadow-sm hover:shadow-xl transition-all border border-white" v-observe>
            <div class="h-12 flex items-center justify-center mb-8 text-[#e07a5f] font-bold text-2xl tracking-widest uppercase font-playfair">
              {{ bank.bankName }}
            </div>
            <p class="text-xl text-[#3d405b] font-medium mb-2 tracking-widest">{{ bank.accountNumber }}</p>
            <p class="text-[10px] text-gray-400 mb-8 uppercase tracking-[0.2em] font-bold">a.n {{ bank.accountName }}</p>
            <button @click="copyToClipboard(bank.accountNumber)"
              class="px-8 py-3 bg-[#f4f1ea] text-[#3d405b] rounded-full hover:bg-[#3d405b] hover:text-white transition-all font-bold uppercase text-[9px] tracking-widest">
              Copy Account
            </button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-32 bg-white text-center rounded-t-[4rem]">
        <h2 class="font-playfair italic text-5xl text-[#3d405b] mb-4">{{ data.groomName }} & {{ data.brideName }}</h2>
        <p class="text-[#81b29a] text-[10px] tracking-[0.5em] uppercase font-bold mb-12">See You on Our Big Day</p>
        <div class="flex justify-center gap-6 opacity-20 mb-12">
           <div class="w-12 h-12 bg-[#e07a5f] rounded-full"></div>
           <div class="w-12 h-12 bg-[#f2cc8f] rounded-full"></div>
           <div class="w-12 h-12 bg-[#81b29a] rounded-full"></div>
        </div>
        <p class="text-gray-300 text-[8px] tracking-[0.4em] uppercase font-bold italic">Created by SatuUndangan.id</p>
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

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const toast = useToast()
const data = ref(props.data || {})

// Normalize sections from different possible structures
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

// Navigation items
const allNavItems = [
  { id: 'home', label: 'Home', icon: 'fa-solid fa-house', key: 'hero' },
  { id: 'couple', label: 'Couple', icon: 'fa-solid fa-user-group', key: 'couple' },
  { id: 'story', label: 'Story', icon: 'fa-solid fa-book-heart', key: 'love-story' },
  { id: 'event', label: 'Event', icon: 'fa-solid fa-location-dot', key: 'event' },
  { id: 'gallery', label: 'Gallery', icon: 'fa-solid fa-palette', key: 'gallery' },
  { id: 'rsvp', label: 'RSVP', icon: 'fa-solid fa-pen-nib', key: 'rsvp' }
]

const navItems = computed(() => {
  if (!activeSections.value) return allNavItems
  return allNavItems.filter(item => {
    const sectionSettings = activeSections.value.find(s => s.key === item.key)
    return sectionSettings ? (sectionSettings.is_enabled !== false) : true
  })
})

function getEmbedUrlVideo(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]
    const ampPos = videoId.indexOf('&')
    return `https://www.youtube.com/embed/${ampPos !== -1 ? videoId.substring(0, ampPos) : videoId}`
  }
  if (url.includes('youtu.be')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`
  return url
}

const isSectionEnabled = (key) => {
  if (!activeSections.value) return true
  const section = activeSections.value.find(s => s.key === key)
  return section ? (section.is_enabled !== false) : true
}

const activeSection = ref('home')

// Countdown
const countdown = ref({ Days: '00', Hrs: '00', Min: '00', Sec: '00' })
let interval = null

const vObserve = {
  mounted: (el) => {
    el.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-[1.2s]', 'ease-out')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'scale-95')
          el.classList.add('opacity-100', 'scale-100')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
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
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
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
  return '/audio/romantic_music1.mp3'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatInstagramUrl(handle) {
  return `https://instagram.com/${handle.replace('@', '')}`
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard!')
}

function initData() {
  if (data.value.guestName && data.value.guestName !== 'Tamu Undangan') {
    rsvp.value.name = data.value.guestName
  }

  if (data.value.galleryImages?.length > 0) {
    galleryImages.value = data.value.galleryImages.map(src => ({ src, thumbnail: src }))
  } else {
    galleryImages.value = [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400' }
    ]
  }

  const targetDate = data.value.akadLocation?.dateTime || data.value.dateTime
  if (targetDate) {
    const target = new Date(targetDate).getTime()
    interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = target - now
      if (diff <= 0) return clearInterval(interval)
      countdown.value.Days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0')
      countdown.value.Hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
      countdown.value.Min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
      countdown.value.Sec = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
    }, 1000)
  }
}

function addToCalendar() {
  const event = {
    title: `Wedding of ${data.value.groomName} & ${data.value.brideName}`,
    start: new Date(data.value.akadLocation?.dateTime || Date.now()).toISOString().replace(/-|:|\.\d\d\d/g, ""),
    description: "Please join us on our wedding day."
  }
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.start}&details=${encodeURIComponent(event.description)}`
  window.open(url, '_blank')
}

async function submitRSVP() {
  if (!rsvp.value.name?.trim() || !rsvp.value.attendance) {
    toast.error("Please complete the RSVP form.")
    return
  }
  try {
    await createGuestMessage({
      invitationId: data.value.id,
      guestName: rsvp.value.name,
      message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance,
      totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0
    })
    toast.success(`Confirmation sent!`)
  } catch (err) {
    console.error(err)
    toast.error("Failed to send RSVP.")
  }
}

onMounted(() => { initData() })
onUnmounted(() => { if (interval) clearInterval(interval) })
watch(() => props.data, (newVal) => { if (newVal) { data.value = newVal; initData() } }, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600;700&display=swap');

.font-playfair { font-family: 'Playfair Display', serif; }
.font-sans { font-family: 'Montserrat', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-fade-in-up { animation: fadeInUp 1.2s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
le>
