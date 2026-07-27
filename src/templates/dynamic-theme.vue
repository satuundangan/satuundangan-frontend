<template>
  <div
    class="relative min-h-screen overflow-hidden"
    :style="[
      rootStyle,
      {
        backgroundColor: 'var(--dt-color-background)',
        color: 'var(--dt-color-text)',
        fontFamily: 'var(--dt-font-body)',
      },
    ]"
  >
    <!-- Fixed decorative texture layer, behind everything -->
    <div
      v-if="theme.decor.patternUrl"
      class="fixed inset-0 pointer-events-none z-0"
      :style="patternStyle"
    ></div>

    <MusicControl
      v-if="data.musicChoice"
      :src="getMusicUrl(data.musicChoice)"
      :audioStart="data.audioStart"
      :audioEnd="data.audioEnd"
      :primaryColor="theme.colors.primary"
      :accentColor="theme.colors.accent"
    />

    <!-- COVER GATE -->
    <transition name="dt-fade">
      <div
        v-if="showGate"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 bg-cover bg-center bg-no-repeat"
        :style="gateBackgroundStyle"
      >
        <div class="absolute inset-0" :style="gateOverlayStyle"></div>

        <img
          v-if="theme.ornaments.corner"
          :src="theme.ornaments.corner"
          alt=""
          class="absolute top-0 left-0 w-20 md:w-28 opacity-90 pointer-events-none"
        />
        <img
          v-if="theme.ornaments.corner"
          :src="theme.ornaments.corner"
          alt=""
          class="absolute top-0 right-0 w-20 md:w-28 opacity-90 pointer-events-none -scale-x-100"
        />
        <img
          v-if="theme.ornaments.corner"
          :src="theme.ornaments.corner"
          alt=""
          class="absolute bottom-0 left-0 w-20 md:w-28 opacity-90 pointer-events-none -scale-y-100"
        />
        <img
          v-if="theme.ornaments.corner"
          :src="theme.ornaments.corner"
          alt=""
          class="absolute bottom-0 right-0 w-20 md:w-28 opacity-90 pointer-events-none -scale-x-100 -scale-y-100"
        />

        <div class="relative z-10 space-y-6 w-full max-w-md">
          <p
            class="text-xs md:text-sm tracking-[0.3em] uppercase"
            :style="{ color: 'var(--dt-color-accent)' }"
          >
            The Wedding Of
          </p>

          <div class="space-y-1">
            <h2
              class="text-4xl md:text-5xl leading-tight"
              :style="{ fontFamily: 'var(--dt-font-script)', color: 'var(--dt-color-primary)' }"
            >
              {{ data.groomName }}
            </h2>
            <span class="text-lg italic" :style="{ color: 'var(--dt-color-accent)' }">&amp;</span>
            <h2
              class="text-4xl md:text-5xl leading-tight"
              :style="{ fontFamily: 'var(--dt-font-script)', color: 'var(--dt-color-primary)' }"
            >
              {{ data.brideName }}
            </h2>
          </div>

          <div
            class="mt-8 p-6 rounded-[var(--dt-radius)] border w-full mx-auto"
            :style="{
              backgroundColor: 'var(--dt-color-surface)',
              borderColor: 'var(--dt-color-secondary)',
            }"
          >
            <p class="text-xs mb-2" :style="{ color: 'var(--dt-color-text-muted)' }">Kepada Yth.</p>
            <p class="text-xl font-bold mb-4" :style="{ color: 'var(--dt-color-text)' }">
              {{ data.guestName }}
            </p>
            <button
              @click="openInvitation"
              class="w-full py-3 rounded-full font-bold transition-transform hover:scale-105 flex items-center justify-center gap-2 text-sm"
              :style="{
                backgroundColor: 'var(--dt-color-primary)',
                color: 'var(--dt-color-surface)',
              }"
            >
              <i class="fa-solid fa-envelope-open"></i> Buka Undangan
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-show="!showGate" id="main-content" class="relative z-10">
      <!-- HERO -->
      <section
        id="hero"
        class="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        :style="[sectionBg('hero'), heroSectionStyle]"
      >
        <template v-if="theme.hero.variant === 'full-photo'">
          <div
            class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            :style="heroBgImageStyle"
          ></div>
          <div class="absolute inset-0" :style="gateOverlayStyle"></div>
          <div class="relative z-10 mt-auto mb-16 space-y-4" v-observe>
            <p
              class="text-xs md:text-sm tracking-[0.4em] uppercase"
              :style="{ color: 'var(--dt-color-accent)' }"
            >
              We Are Getting Married
            </p>
            <h1
              class="text-4xl md:text-6xl leading-tight drop-shadow-lg"
              :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-surface)' }"
            >
              {{ data.groomName }} &amp; {{ data.brideName }}
            </h1>
          </div>
        </template>

        <template v-else-if="theme.hero.variant === 'framed'">
          <div class="relative z-10 space-y-6 max-w-md" v-observe>
            <p
              class="text-xs md:text-sm tracking-[0.4em] uppercase"
              :style="{ color: 'var(--dt-color-accent)' }"
            >
              We Are Getting Married
            </p>
            <div
              class="mx-auto w-48 h-64 md:w-56 md:h-72 border-4 rounded-[var(--dt-radius)] overflow-hidden bg-cover bg-center"
              :style="{
                borderColor: 'var(--dt-color-secondary)',
                backgroundImage: heroFrameImageCss,
              }"
            ></div>
            <h1
              class="text-3xl md:text-5xl leading-tight"
              :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
            >
              {{ data.groomName }} &amp; {{ data.brideName }}
            </h1>
          </div>
        </template>

        <template v-else>
          <div
            class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            :style="heroBgImageStyle"
          ></div>
          <div class="absolute inset-0" :style="gateOverlayStyle"></div>
          <div class="relative z-10 space-y-6" v-observe>
            <p
              class="text-xs md:text-sm tracking-[0.4em] uppercase"
              :style="{ color: 'var(--dt-color-accent)' }"
            >
              We Are Getting Married
            </p>
            <h1
              class="text-5xl md:text-7xl leading-tight drop-shadow-2xl"
              :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-surface)' }"
            >
              {{ data.groomName }} <br />
              <span class="text-3xl md:text-4xl" :style="{ color: 'var(--dt-color-accent)' }"
                >&amp;</span
              >
              <br />
              {{ data.brideName }}
            </h1>
            <p
              class="text-base md:text-lg font-light tracking-wide"
              :style="{ color: 'var(--dt-color-surface)' }"
            >
              {{ formatDate(data.resepsiLocation?.dateTime || data.akadLocation?.dateTime) }}
            </p>

            <div class="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
              <div
                v-for="(val, label) in countdown"
                :key="label"
                class="p-3 md:p-4 rounded-[var(--dt-radius)] w-16 md:w-20 text-center border"
                :style="{
                  backgroundColor: 'var(--dt-color-surface)',
                  borderColor: 'var(--dt-color-secondary)',
                }"
              >
                <div
                  class="text-xl md:text-2xl font-bold"
                  :style="{ color: 'var(--dt-color-primary)' }"
                >
                  {{ val }}
                </div>
                <div
                  class="text-[8px] md:text-[10px] uppercase"
                  :style="{ color: 'var(--dt-color-accent)' }"
                >
                  {{ label }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>

      <!-- QUOTE -->
      <section
        v-if="isSectionEnabled('quote') && data.quoteText"
        class="py-16 md:py-24 px-6"
        :style="sectionBg('quote')"
        v-observe
      >
        <div
          class="max-w-3xl mx-auto text-center border-y py-12"
          :style="{ borderColor: 'var(--dt-color-secondary)' }"
        >
          <i
            class="fa-solid fa-quote-left text-3xl md:text-4xl mb-6 block"
            :style="{ color: 'var(--dt-color-accent)', opacity: 0.4 }"
          ></i>
          <p class="text-base md:text-xl italic leading-relaxed font-light mb-6">
            "{{ data.quoteText }}"
          </p>
          <p
            class="text-xs md:text-sm font-bold tracking-widest uppercase"
            :style="{ color: 'var(--dt-color-primary)' }"
          >
            {{ data.quoteSource }}
          </p>
        </div>
      </section>

      <!-- COUPLE -->
      <section
        v-if="isSectionEnabled('couple')"
        id="couple"
        class="py-16 md:py-24 px-6"
        :style="sectionBg('couple')"
      >
        <div class="max-w-6xl mx-auto">
          <h2
            class="text-3xl md:text-4xl text-center mb-12 md:mb-16"
            :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
            v-observe
          >
            The Happy Couple
          </h2>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div class="relative" v-observe>
              <div
                class="relative overflow-hidden shadow-2xl rounded-[var(--dt-radius)]"
                :style="coupleFrameStyle"
              >
                <img
                  :src="data.groomPhotoUrl || data.photoCoupleUrl || ''"
                  class="w-full h-[380px] md:h-[460px] object-cover"
                  alt=""
                />
                <div
                  class="absolute bottom-0 inset-x-0 p-6 md:p-8 text-center"
                  :style="{
                    background: 'linear-gradient(to top, var(--dt-color-text), transparent)',
                  }"
                >
                  <h3
                    class="text-2xl md:text-3xl"
                    :style="{
                      fontFamily: 'var(--dt-font-script)',
                      color: 'var(--dt-color-surface)',
                    }"
                  >
                    {{ data.groomName }}
                  </h3>
                  <p
                    class="text-xs md:text-sm mt-2"
                    :style="{ color: 'var(--dt-color-surface)', opacity: 0.8 }"
                  >
                    Putra dari {{ data.parents?.groomParents }}
                  </p>
                </div>
              </div>
            </div>

            <div class="relative mt-8 md:mt-16" v-observe>
              <div
                class="relative overflow-hidden shadow-2xl rounded-[var(--dt-radius)]"
                :style="coupleFrameStyle"
              >
                <img
                  :src="data.bridePhotoUrl || data.photoCoupleUrl || ''"
                  class="w-full h-[380px] md:h-[460px] object-cover"
                  alt=""
                />
                <div
                  class="absolute bottom-0 inset-x-0 p-6 md:p-8 text-center"
                  :style="{
                    background: 'linear-gradient(to top, var(--dt-color-text), transparent)',
                  }"
                >
                  <h3
                    class="text-2xl md:text-3xl"
                    :style="{
                      fontFamily: 'var(--dt-font-script)',
                      color: 'var(--dt-color-surface)',
                    }"
                  >
                    {{ data.brideName }}
                  </h3>
                  <p
                    class="text-xs md:text-sm mt-2"
                    :style="{ color: 'var(--dt-color-surface)', opacity: 0.8 }"
                  >
                    Putri dari {{ data.parents?.brideParents }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ORNAMENT DIVIDER -->
      <div
        v-if="theme.ornaments.divider"
        class="flex justify-center py-6"
        :style="sectionBg('couple')"
      >
        <img :src="theme.ornaments.divider" alt="" class="h-10 md:h-14 opacity-90" />
      </div>

      <!-- EVENT -->
      <section
        v-if="isSectionEnabled('event')"
        id="event"
        class="py-16 md:py-24 px-6"
        :style="sectionBg('event')"
      >
        <div class="max-w-4xl mx-auto relative z-10 text-center">
          <h2
            class="text-3xl md:text-4xl mb-4"
            :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
            v-observe
          >
            Save The Date
          </h2>
          <p class="text-sm md:text-base mb-10" :style="{ color: 'var(--dt-color-text-muted)' }">
            Kami menantikan kehadiran Anda di hari bahagia kami.
          </p>

          <div class="grid gap-8">
            <div
              class="p-6 md:p-8 rounded-[var(--dt-radius)] border"
              :style="{
                backgroundColor: 'var(--dt-color-surface)',
                borderColor: 'var(--dt-color-secondary)',
              }"
              v-observe
            >
              <h3 class="text-xl md:text-2xl mb-2" :style="{ color: 'var(--dt-color-text)' }">
                Akad Nikah
              </h3>
              <div
                class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-6"
              >
                <div class="text-center" :style="{ color: 'var(--dt-color-accent)' }">
                  <i class="fa-regular fa-calendar text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">{{ formatDate(data.akadLocation?.dateTime) }}</p>
                </div>
                <div
                  class="h-8 w-px hidden md:block"
                  :style="{ backgroundColor: 'var(--dt-color-secondary)' }"
                ></div>
                <div class="text-center" :style="{ color: 'var(--dt-color-accent)' }">
                  <i class="fa-regular fa-clock text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">
                    {{ formatTime(data.akadLocation?.dateTime) }} WIB
                  </p>
                </div>
              </div>
              <p
                class="text-xs md:text-sm mb-6 max-w-md mx-auto"
                :style="{ color: 'var(--dt-color-text-muted)' }"
              >
                {{ data.akadLocation?.description }}
              </p>
              <a
                v-if="data.akadLocation?.mapUrl"
                :href="data.akadLocation.mapUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-xs md:text-sm uppercase tracking-wide font-medium border transition-colors"
                :style="{
                  color: 'var(--dt-color-primary)',
                  borderColor: 'var(--dt-color-primary)',
                }"
              >
                <i class="fa-solid fa-location-dot mr-2"></i> Google Maps
              </a>
            </div>

            <div
              v-if="!data.mergeEvents"
              class="p-6 md:p-8 rounded-[var(--dt-radius)] border"
              :style="{
                backgroundColor: 'var(--dt-color-surface)',
                borderColor: 'var(--dt-color-secondary)',
              }"
              v-observe
            >
              <h3 class="text-xl md:text-2xl mb-2" :style="{ color: 'var(--dt-color-text)' }">
                Resepsi
              </h3>
              <div
                class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-6"
              >
                <div class="text-center" :style="{ color: 'var(--dt-color-accent)' }">
                  <i class="fa-regular fa-calendar text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">
                    {{ formatDate(data.resepsiLocation?.dateTime) }}
                  </p>
                </div>
                <div
                  class="h-8 w-px hidden md:block"
                  :style="{ backgroundColor: 'var(--dt-color-secondary)' }"
                ></div>
                <div class="text-center" :style="{ color: 'var(--dt-color-accent)' }">
                  <i class="fa-regular fa-clock text-lg md:text-xl mb-1"></i>
                  <p class="text-sm md:text-base">
                    {{ formatTime(data.resepsiLocation?.dateTime) }} WIB
                  </p>
                </div>
              </div>
              <p
                class="text-xs md:text-sm mb-6 max-w-md mx-auto"
                :style="{ color: 'var(--dt-color-text-muted)' }"
              >
                {{ data.resepsiLocation?.description }}
              </p>
              <a
                v-if="data.resepsiLocation?.mapUrl"
                :href="data.resepsiLocation.mapUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-xs md:text-sm uppercase tracking-wide font-medium border transition-colors"
                :style="{
                  color: 'var(--dt-color-primary)',
                  borderColor: 'var(--dt-color-primary)',
                }"
              >
                <i class="fa-solid fa-location-dot mr-2"></i> Google Maps
              </a>
            </div>
          </div>

          <div
            v-if="isSectionEnabled('dress-code') && data.dressCode"
            class="mt-12 text-center"
            v-observe
          >
            <h3
              class="text-xl mb-4"
              :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
            >
              Dress Code
            </h3>
            <div
              class="inline-block p-6 rounded-[var(--dt-radius)] border"
              :style="{
                backgroundColor: 'var(--dt-color-surface)',
                borderColor: 'var(--dt-color-secondary)',
              }"
            >
              <i
                class="fa-solid fa-shirt text-2xl mb-3 block"
                :style="{ color: 'var(--dt-color-accent)' }"
              ></i>
              <p class="text-sm tracking-wide" :style="{ color: 'var(--dt-color-text-muted)' }">
                {{ data.dressCode }}
              </p>
            </div>
          </div>

          <div
            v-if="
              (data.liveStreamingLink || data.liveStreamingUrl) &&
              isSectionEnabled('live-streaming')
            "
            class="mt-12"
            v-observe
          >
            <a
              :href="data.liveStreamingUrl || data.liveStreamingLink"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all shadow-lg hover:scale-105 font-bold uppercase text-xs tracking-widest"
              :style="{
                backgroundColor: 'var(--dt-color-primary)',
                color: 'var(--dt-color-surface)',
              }"
            >
              <i class="fa-solid fa-video"></i> Tonton Live Streaming
            </a>
          </div>

          <button
            @click="addToCalendar"
            class="mt-12 px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:scale-105 text-sm md:text-base"
            :style="{
              backgroundColor: 'var(--dt-color-primary)',
              color: 'var(--dt-color-surface)',
            }"
          >
            <i class="fa-regular fa-calendar-plus mr-2"></i> Simpan Tanggal
          </button>
        </div>
      </section>

      <!-- LOVE STORY -->
      <section
        v-if="isSectionEnabled('love-story') && (data.loveStory?.length || isPreviewMode)"
        id="love-story"
        class="py-16 md:py-24 px-6"
        :style="sectionBg('love-story')"
      >
        <div class="max-w-4xl mx-auto">
          <h2
            class="text-3xl md:text-4xl text-center mb-12 md:mb-20"
            :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
            v-observe
          >
            Our Journey
          </h2>

          <div class="space-y-12">
            <div
              v-for="(story, index) in loveStoryItems"
              :key="index"
              class="space-y-4 text-center"
              v-observe
            >
              <div
                v-if="story.image"
                class="aspect-video rounded-[var(--dt-radius)] overflow-hidden border max-w-lg mx-auto"
                :style="{ borderColor: 'var(--dt-color-secondary)' }"
              >
                <img :src="story.image" class="w-full h-full object-cover" alt="" />
              </div>
              <span
                class="font-bold text-xs md:text-sm tracking-widest"
                :style="{ color: 'var(--dt-color-accent)' }"
              >
                {{ story.date }}
              </span>
              <h3
                class="text-xl md:text-2xl"
                :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-text)' }"
              >
                {{ story.title }}
              </h3>
              <p
                class="text-sm leading-relaxed max-w-md mx-auto"
                :style="{ color: 'var(--dt-color-text-muted)' }"
              >
                {{ story.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section
        v-if="isSectionEnabled('gallery') && galleryImages.length"
        id="gallery"
        class="py-16 md:py-24 px-6"
        :style="sectionBg('gallery')"
      >
        <div class="max-w-5xl mx-auto text-center">
          <h2
            class="text-3xl md:text-4xl mb-12"
            :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
            v-observe
          >
            Our Gallery
          </h2>
          <GalleryInvitation :items="galleryImages" />
        </div>
      </section>

      <!-- GIFT -->
      <section
        v-if="isSectionEnabled('gift') && data.bankAccounts?.length"
        id="gift"
        class="py-16 md:py-24 px-6 text-center"
        :style="sectionBg('gift')"
      >
        <h2
          class="text-2xl md:text-3xl mb-4"
          :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
          v-observe
        >
          Wedding Gift
        </h2>
        <p
          class="mb-10 max-w-lg mx-auto text-sm md:text-base"
          :style="{ color: 'var(--dt-color-text-muted)' }"
        >
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
        </p>

        <div class="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          <div
            v-for="(bank, idx) in data.bankAccounts"
            :key="'bank' + idx"
            class="p-6 rounded-[var(--dt-radius)] border w-full sm:w-72"
            :style="{
              backgroundColor: 'var(--dt-color-surface)',
              borderColor: 'var(--dt-color-secondary)',
            }"
            v-observe
          >
            <div
              class="h-12 flex items-center justify-center mb-4 font-bold text-xl uppercase tracking-wider"
              :style="{ color: 'var(--dt-color-primary)' }"
            >
              {{ bank.bankName }}
            </div>
            <p class="text-lg font-mono mb-1" :style="{ color: 'var(--dt-color-text)' }">
              {{ bank.accountNumber }}
            </p>
            <p class="text-sm mb-4" :style="{ color: 'var(--dt-color-text-muted)' }">
              a.n {{ bank.accountName }}
            </p>
            <button
              @click="copyToClipboard(bank.accountNumber)"
              class="text-xs border px-4 py-1.5 rounded-full transition-colors"
              :style="{ color: 'var(--dt-color-primary)', borderColor: 'var(--dt-color-primary)' }"
            >
              <i class="fa-regular fa-copy mr-1"></i> Salin
            </button>
          </div>
        </div>
      </section>

      <!-- RSVP + WISHES -->
      <section
        v-if="isSectionEnabled('rsvp')"
        id="rsvp"
        class="py-16 md:py-24 px-6"
        :style="sectionBg('rsvp')"
      >
        <div
          class="max-w-2xl mx-auto rounded-[var(--dt-radius)] border p-6 md:p-12 shadow-2xl"
          :style="{
            backgroundColor: 'var(--dt-color-surface)',
            borderColor: 'var(--dt-color-secondary)',
          }"
          v-observe
        >
          <h2
            class="text-2xl md:text-3xl text-center mb-2"
            :style="{ fontFamily: 'var(--dt-font-heading)', color: 'var(--dt-color-primary)' }"
          >
            RSVP
          </h2>
          <p
            class="text-center mb-8 text-xs md:text-sm"
            :style="{ color: 'var(--dt-color-text-muted)' }"
          >
            Mohon konfirmasi kehadiran Anda sebelum acara dimulai.
          </p>

          <form @submit.prevent="submitRSVP" class="space-y-5">
            <input
              v-model="rsvp.name"
              type="text"
              placeholder="Nama Lengkap"
              class="w-full rounded-xl px-4 py-3 border text-sm md:text-base focus:outline-none"
              :style="rsvpInputStyle"
              required
            />

            <div class="grid grid-cols-3 gap-3">
              <label
                v-for="option in attendanceOptions"
                :key="option.value"
                class="flex items-center justify-center px-2 md:px-4 py-3 rounded-xl border cursor-pointer transition-all text-xs md:text-base"
                :style="rsvp.attendance === option.value ? rsvpOptionActiveStyle : rsvpInputStyle"
              >
                <input
                  type="radio"
                  :value="option.value"
                  v-model="rsvp.attendance"
                  class="hidden"
                />
                {{ option.label }}
              </label>
            </div>

            <select
              v-if="rsvp.attendance === 'hadir'"
              v-model="rsvp.totalGuests"
              class="w-full rounded-xl px-4 py-3 border text-sm md:text-base focus:outline-none"
              :style="rsvpInputStyle"
            >
              <option value="" disabled>Jumlah Tamu</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} Orang</option>
            </select>

            <textarea
              v-model="rsvp.message"
              rows="3"
              placeholder="Ucapan &amp; Doa"
              class="w-full rounded-xl px-4 py-3 border text-sm md:text-base focus:outline-none"
              :style="rsvpInputStyle"
            ></textarea>

            <button
              type="submit"
              class="w-full py-3.5 rounded-xl font-bold transition-all shadow-lg mt-4 text-sm md:text-base"
              :style="{
                backgroundColor: 'var(--dt-color-primary)',
                color: 'var(--dt-color-surface)',
              }"
            >
              Kirim Konfirmasi
            </button>
          </form>
        </div>
      </section>

      <!-- FOOTER -->
      <footer
        v-if="isSectionEnabled('footer')"
        class="py-12 text-center border-t"
        :style="[sectionBg('footer'), { borderColor: 'var(--dt-color-secondary)' }]"
      >
        <h2
          class="text-3xl md:text-4xl mb-2"
          :style="{ fontFamily: 'var(--dt-font-script)', color: 'var(--dt-color-primary)' }"
        >
          {{ data.groomName }} &amp; {{ data.brideName }}
        </h2>
        <p
          v-if="data.show_branding"
          class="text-xs tracking-widest uppercase"
          :style="{ color: 'var(--dt-color-text-muted)' }"
        >
          Created with SatuUndangan
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MusicControl from '@/components/invitation/MusicControl.vue'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { createGuestMessage } from '@/api/guestMessage'
import { useToast } from 'vue-toastification'
import {
  normalizeThemeConfig,
  themeCssVars,
  googleFontsUrl,
  sectionStyle,
} from '@/utils/themeConfig'
import { applyThemeFonts, removeThemeFonts } from '@/utils/themeFonts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const toast = useToast()

const data = ref(props.data || {})
watch(
  () => props.data,
  (v) => {
    data.value = { ...v }
  },
  { deep: true, immediate: true },
)

const isPreviewMode = computed(() => data.value.id === 'live-preview' || data.value.id === 0)

// --- Theme wiring — the whole point of this file ---
const theme = computed(() => normalizeThemeConfig(data.value.designConfig))
const rootStyle = computed(() => themeCssVars(theme.value))

function sectionBg(key) {
  return sectionStyle(theme.value, key)
}

const patternStyle = computed(() => ({
  backgroundImage: `url("${theme.value.decor.patternUrl}")`,
  backgroundRepeat: 'repeat',
  opacity: theme.value.decor.patternOpacity,
}))

const gateOverlayStyle = computed(() => ({
  backgroundColor: theme.value.hero.overlayColor,
  opacity: theme.value.hero.overlayOpacity,
}))

const heroSectionStyle = computed(() => {
  if (theme.value.hero.variant !== 'classic') return {}
  return { display: 'flex' }
})

const heroBackgroundUrl = computed(
  () => theme.value.hero.backgroundImage || data.value.photoCoupleUrl || '',
)

const heroBgImageStyle = computed(() => ({
  backgroundImage: heroBackgroundUrl.value ? `url("${heroBackgroundUrl.value}")` : 'none',
}))

const heroFrameImageCss = computed(() =>
  heroBackgroundUrl.value ? `url("${heroBackgroundUrl.value}")` : 'none',
)

const gateBackgroundStyle = computed(() => ({
  backgroundColor: theme.value.colors.background,
  backgroundImage: heroBackgroundUrl.value ? `url("${heroBackgroundUrl.value}")` : 'none',
}))

const coupleFrameStyle = computed(() => {
  if (!theme.value.ornaments.frame) return {}
  return {
    borderWidth: '6px',
    borderStyle: 'solid',
    borderImage: `url("${theme.value.ornaments.frame}") 30 stretch`,
  }
})

const rsvpInputStyle = computed(() => ({
  backgroundColor: theme.value.colors.background,
  borderColor: theme.value.colors.secondary,
  color: theme.value.colors.text,
}))

const rsvpOptionActiveStyle = computed(() => ({
  backgroundColor: theme.value.colors.primary,
  borderColor: theme.value.colors.primary,
  color: theme.value.colors.surface,
  fontWeight: 'bold',
}))

// --- Cover gate ---
const showGate = ref(true)
function openInvitation() {
  showGate.value = false
}

// --- Section visibility ---
function isSectionEnabled(key) {
  if (data.value.selectedSections === undefined || data.value.selectedSections === null) return true
  return data.value.selectedSections.includes(key)
}

// --- Music ---
function getMusicUrl(choice) {
  if (!choice) return null
  if (choice.startsWith('yt:')) return choice
  if (choice.includes('/') || choice.includes('http')) return choice
  return '/audio/romantic_music1.mp3'
}

// --- Date/time formatting ---
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// --- Countdown ---
const countdown = ref({ Hari: '00', Jam: '00', Menit: '00', Detik: '00' })
let countdownInterval = null

function startCountdown() {
  const targetSrc =
    data.value.akadLocation?.dateTime || data.value.resepsiLocation?.dateTime || data.value.dateTime
  if (!targetSrc) return
  const target = new Date(targetSrc).getTime()
  if (Number.isNaN(target)) return

  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    const now = Date.now()
    const diff = target - now
    if (diff <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      return
    }
    countdown.value.Hari = Math.floor(diff / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, '0')
    countdown.value.Jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      .toString()
      .padStart(2, '0')
    countdown.value.Menit = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, '0')
    countdown.value.Detik = Math.floor((diff % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, '0')
  }, 1000)
}

watch(
  () => data.value.akadLocation?.dateTime,
  () => startCountdown(),
)

// --- Scroll-reveal directive ---
const vObserve = {
  mounted(el) {
    el.classList.add('dt-observe')
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('dt-observe-visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('dt-observe-visible')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
  },
}

// --- Gallery ---
const galleryImages = computed(() =>
  (data.value.galleryImages || []).map((src) => ({ src, thumbnail: src })),
)

// --- Love story (with a tasteful fallback for the demo/preview) ---
const mockLoveStory = [
  {
    title: 'First Date',
    date: 'Jan 2024',
    description: 'Where it all began at a small vintage cafe.',
  },
  {
    title: 'The Proposal',
    date: 'Feb 2026',
    description: 'Under the starlight, we promised to be together forever.',
  },
]

const loveStoryItems = computed(() =>
  data.value.loveStory?.length ? data.value.loveStory : mockLoveStory,
)

// --- RSVP form ---
const rsvp = ref({ name: '', attendance: 'hadir', totalGuests: 1, message: '' })
const attendanceOptions = [
  { value: 'hadir', label: 'Hadir' },
  { value: 'tidak', label: 'Maaf' },
  { value: 'ragu', label: 'Ragu' },
]

async function submitRSVP() {
  if (!rsvp.value.name?.trim()) {
    toast.error('Mohon isi nama Anda.')
    return
  }
  if (!rsvp.value.attendance) {
    toast.error('Mohon pilih konfirmasi kehadiran.')
    return
  }

  try {
    await createGuestMessage({
      invitationId: data.value.id,
      guestName: rsvp.value.name,
      message: rsvp.value.message,
      rsvpStatus: rsvp.value.attendance,
      totalGuests: rsvp.value.attendance === 'hadir' ? Number(rsvp.value.totalGuests) : 0,
    })

    toast.success(`Terima kasih ${rsvp.value.name}, konfirmasi Anda telah terkirim!`)
    rsvp.value = { name: '', attendance: 'hadir', totalGuests: 1, message: '' }
  } catch (err) {
    console.error('Failed to submit RSVP:', err)
    toast.error('Gagal mengirim RSVP. Silakan coba lagi.')
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  toast.success('Berhasil disalin!')
}

function addToCalendar() {
  const startSrc = data.value.akadLocation?.dateTime || data.value.dateTime || Date.now()
  const startISO = new Date(startSrc).toISOString()
  const start = startISO.replace(/-|:|\.\d\d\d/g, '')
  const end = new Date(new Date(startISO).getTime() + 3 * 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, '')
  const title = `Wedding of ${data.value.groomName} & ${data.value.brideName}`
  const description = 'Kami mengundang Anda untuk hadir di pernikahan kami.'
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}`
  window.open(url, '_blank')
}

// --- Google Fonts injection — reactive so a font change in the theme builder
// re-fetches the stylesheet instead of staying stuck at mount-time ---
watch(() => googleFontsUrl(theme.value), () => applyThemeFonts(theme.value), { immediate: true })

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  removeThemeFonts()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.dt-fade-enter-active,
.dt-fade-leave-active {
  transition: opacity 0.6s ease;
}

.dt-fade-enter-from,
.dt-fade-leave-to {
  opacity: 0;
}

.dt-observe {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.dt-observe-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
