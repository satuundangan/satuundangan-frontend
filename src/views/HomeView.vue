<template>
  <div class="bg-ivory min-h-screen font-sans text-dark scroll-smooth">
    <Navbar @create-invitation="showModal = true" />

    <!-- Hero Section -->
    <HeroSection @create-invitation="showModal = true" />

    <!-- Comparison Section -->
    <ComparisonSection />

    <!-- Features Section -->
    <section id="features">
      <FeaturesSection />
    </section>

    <!-- Template Section (Existing Logic) -->
    <section id="templates" class="section bg-white scroll-mt-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="heading mb-4">Pilih Template Favoritmu</h2>
          <p class="text-muted">Desain premium untuk hari spesialmu.</p>
        </div>

        <!-- Filter Categories (Desktop Tabs) -->
        <div class="flex flex-wrap justify-center gap-2 mb-10">
          <button v-for="cat in styleCategories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
            'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
            selectedCategory === cat.id
              ? 'bg-mocha text-white border-mocha shadow-lg shadow-mocha/20'
              : 'bg-transparent text-gray-500 border-gray-200 hover:border-mocha hover:text-mocha'
          ]">
            {{ cat.name }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha"></div>
        </div>

        <div v-else class="grid md:grid-cols-3 gap-10">
          <div v-for="(item) in filteredTemplates.slice(0, 6)" :key="item.id"
            class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border border-gray-100 flex flex-col">

            <!-- Card Image -->
            <div class="relative overflow-hidden aspect-[4/5] bg-gray-100 cursor-pointer" @click="selectTemplate(item.id); showModal = true;">
              <img :src="resolveImageUrl(item.thumbnailUrl || item.previewUrl)" :alt="item.name"
                class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                @error="(e) => { e.target.onerror = null; e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; }" />

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button @click.stop="selectTemplate(item.id); showModal = true;"
                  class="bg-white text-mocha px-4 py-2 rounded-xl font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-mocha hover:text-white flex items-center gap-2">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> Pilih
                </button>
                <a :href="'/demo/' + item.slug" target="_blank" @click.stop
                   class="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-xl font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-mocha flex items-center gap-2 delay-75">
                  <i class="fa-solid fa-eye"></i> Demo
                </a>
              </div>

              <!-- Badge Premium -->
              <div v-if="item.isPremium"
                class="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md tracking-wider uppercase z-10">
                Premium
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-6 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-dark text-lg group-hover:text-mocha transition-colors truncate">{{ item.name }}</h4>
                <div class="text-mocha font-bold">
                  {{ item.price > 0 ? formatPrice(item.price) : 'Gratis' }}
                </div>
              </div>

              <p class="text-sm text-muted line-clamp-2 mb-6 flex-1">{{ item.description }}</p>

              <!-- Features Summary -->
              <div class="flex items-center gap-4 mb-6">
                 <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <i class="fa-solid fa-layer-group text-mocha/40"></i>
                    <span>{{ item.sections?.length || 0 }} Fitur</span>
                 </div>
                 <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <i class="fa-solid fa-palette text-mocha/40"></i>
                    <div class="flex gap-1">
                       <span v-for="color in (item.paletteColors || []).slice(0, 3)" :key="color"
                         class="w-2.5 h-2.5 rounded-full border border-gray-100" :style="{ backgroundColor: color }"></span>
                    </div>
                 </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-auto">
                 <button @click="selectTemplate(item.id); showModal = true;"
                   class="flex-[2] bg-mocha text-white py-3 rounded-xl text-sm font-bold hover:bg-mocha/90 transition-all shadow-lg shadow-mocha/10 flex items-center justify-center gap-2">
                   Gunakan Template
                 </button>
                 <a :href="'/demo/' + item.slug" target="_blank"
                   class="flex-1 bg-gray-50 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all text-center flex items-center justify-center">
                   Demo
                 </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredTemplates.length === 0" class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
           <div class="text-4xl mb-4">🎨</div>
           <h3 class="text-lg font-bold text-dark mb-1">Belum ada template</h3>
           <p class="text-muted text-sm">Coba pilih kategori lain atau kembali beberapa saat lagi.</p>
        </div>

        <div class="text-center mt-12">
          <button @click="showModal = true" class="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-mocha border-2 border-mocha hover:bg-mocha hover:text-white transition-all duration-300">
            <span>Lihat Semua Template</span>
            <i class="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Steps Section -->
    <StepsSection @create-invitation="showModal = true" />

    <!-- Tutorial Section (TikTok) -->
    <TutorialSection />

    <!-- Pricing Section -->
    <section id="pricing" class="section bg-ivory scroll-mt-20 py-24">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-mocha font-bold tracking-widest uppercase text-sm mb-2 block">Harga</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-dark mb-4">Pilih Paket Sesuai Kebutuhanmu</h2>
          <p class="text-muted max-w-2xl mx-auto text-lg">
            Semua desain bebas dipakai. Bedanya cuma di fiturnya — pilih yang pas buat acaramu.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 items-center">
          <div v-for="plan in pricingPlans" :key="plan.name" @click="choosePlan(plan.id)" :class="[
            'rounded-3xl p-8 bg-white flex flex-col transition-all duration-300 cursor-pointer',
            plan.highlighted
              ? 'border-2 border-mocha shadow-2xl shadow-mocha/15 md:scale-105 relative z-10'
              : 'border border-gray-100 shadow-lg hover:shadow-xl',
            selectedPlan === plan.id ? 'ring-2 ring-mocha ring-offset-2' : ''
          ]">
            <!-- Best Seller Badge -->
            <div v-if="plan.highlighted"
              class="absolute -top-4 left-1/2 -translate-x-1/2 bg-mocha text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wider uppercase">
              Best Seller
            </div>

            <div class="mb-6">
              <h3 class="text-xl font-bold text-dark mb-1">{{ plan.name }}</h3>
              <p class="text-sm text-muted leading-relaxed min-h-[40px]">{{ plan.tagline }}</p>
            </div>

            <div class="mb-8">
              <span class="text-4xl font-bold text-dark">{{ plan.price }}</span>
              <span class="text-muted text-sm">/undangan</span>
            </div>

            <ul class="space-y-4 mb-8 flex-1">
              <li v-for="feat in plan.features" :key="feat.label" class="flex items-start gap-3 text-sm">
                <!-- Check Icon -->
                <svg v-if="feat.included" class="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <!-- X Icon -->
                <svg v-else class="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span :class="feat.included ? 'text-dark/80' : 'text-red-400 line-through decoration-red-300/60'">{{ feat.label }}</span>
              </li>
            </ul>

            <button @click.stop="choosePlan(plan.id)" :class="[
              'w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300',
              plan.highlighted
                ? 'bg-mocha text-white shadow-lg shadow-mocha/20 hover:bg-mocha/90 hover:-translate-y-0.5'
                : 'bg-ivory text-mocha border-2 border-mocha/20 hover:border-mocha hover:bg-mocha hover:text-white'
            ]">
              Mulai Buat Undangan
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="section bg-ivory relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2">
      </div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-mocha/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2">
      </div>

      <div class="max-w-6xl mx-auto px-6 relative z-10">
        <h2 class="heading text-center mb-12">Kata Mereka</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(item, i) in testimonials" :key="i"
            class="bg-white rounded-2xl p-8 shadow-lg border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <div class="text-mocha text-5xl font-serif absolute top-6 left-6 opacity-20">"</div>
            <p class="text-dark/80 italic mb-6 mt-4 relative z-10 text-sm leading-relaxed">
              {{ item.text }}
            </p>
            <div class="flex items-center gap-4 border-t border-gray-100 pt-4">
              <img :src="item.avatar" alt="avatar"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-sage/30 p-0.5" />
              <div>
                <h4 class="text-sm font-bold text-dark">{{ item.name }}</h4>
                <p class="text-xs text-muted">{{ item.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <FaqSection />

    <!-- Custom Theme CTA Section -->
    <section class="py-16 px-6 bg-gradient-to-br from-stone-50 to-amber-50/40">
      <div class="max-w-3xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 bg-amber-100/80 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-amber-200/60">
          <i class="fa-solid fa-palette"></i> Custom Design
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-dark mb-3 font-serif leading-snug">
          Ga ketemu tema undangan<br class="hidden sm:block" /> yang kamu mau?
        </h2>
        <p class="text-muted text-base mb-2">
          Chat kami untuk request desain custom sesuai keinginanmu.
        </p>
        <p class="text-xs text-gray-400 mb-8">*Harga custom berbeda dari tema yang tersedia</p>
        <a
          href="https://wa.me/6285121266550?text=Halo%20SatuUndangan%2C%20saya%20ingin%20request%20desain%20undangan%20custom%20%F0%9F%92%8C"
          target="_blank"
          class="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          <i class="fa-brands fa-whatsapp text-xl"></i>
          Chat Kami Sekarang
        </a>
      </div>
    </section>

    <!-- Footer -->
    <Footer />


    <!-- Nova AI Floating Button -->
    <FloatingNovaButton @require-auth="showAuthModal = true" />

    <!-- Auth Modal (triggered by Nova when user not logged in) -->
    <AuthModal :show="showAuthModal" :authMode="authMode" @update:authMode="authMode = $event" @close="showAuthModal = false" />

    <!-- Modal Pilih Template -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center sm:px-4 md:py-8"
      @click.self="showModal = false">
      <div
        class="bg-white w-full h-full sm:h-[90vh] max-w-6xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">

        <!-- Sidebar Filter (Desktop) -->
        <aside class="hidden md:flex md:w-64 bg-gray-50 border-r border-gray-200 flex-col">
          <div class="p-6 border-b border-gray-200">
            <h4 class="font-bold text-mocha text-lg flex items-center gap-2">
              <span>🔍</span> Filter
            </h4>
          </div>

          <div class="p-4 overflow-y-auto flex-1 custom-scrollbar">
            <div class="mb-6">
              <h5 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Kategori</h5>
              <ul class="space-y-1">
                <li v-for="cat in styleCategories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
                  'cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex justify-between items-center group',
                  selectedCategory === cat.id ? 'bg-white text-mocha shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-200/50'
                ]">
                  {{ cat.name }}
                  <span v-if="selectedCategory === cat.id" class="w-1.5 h-1.5 rounded-full bg-mocha"></span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0 min-h-0 bg-white relative">
          <!-- Header Modal -->
          <div class="shrink-0 p-5 border-b border-gray-200 flex justify-between items-center bg-white z-10 shadow-sm">
            <div>
              <h3 class="text-xl font-bold text-dark font-serif">Pilih Template</h3>
              <p class="text-sm text-muted hidden sm:block">Pilih desain terbaik untuk acaramu.</p>
            </div>
            <button @click="showModal = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition">
              &times;
            </button>
          </div>

          <!-- Mobile Filter Tabs -->
          <div class="shrink-0 md:hidden flex w-full max-w-full overflow-x-auto p-3 gap-2 border-b border-gray-100 no-scrollbar">
            <button v-for="cat in styleCategories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
              'whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-colors',
              selectedCategory === cat.id ? 'bg-mocha text-white border-mocha' : 'bg-white text-gray-600 border-gray-200'
            ]">
              {{ cat.name }}
            </button>
          </div>

          <!-- Template Grid -->
          <div class="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 custom-scrollbar">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin text-mocha text-3xl">⏳</div>
            </div>
            <div v-else-if="filteredTemplates.length > 0"
              class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 pb-4">
              <div v-for="(item) in filteredTemplates" :key="item.id" :ref="el => templateRefs[item.id] = el"
                @click="selectTemplate(item.id)" :class="[
                  selectedTemplate === item.id ? 'ring-2 ring-mocha ring-offset-2 scale-[1.02]' : 'hover:shadow-lg hover:-translate-y-1',
                  'bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-gray-100 flex flex-col group shadow-sm'
                ]">
                <div class="relative aspect-[4/5] overflow-hidden bg-gray-200">
                  <img :src="resolveImageUrl(item.thumbnailUrl || item.previewUrl)"
                    class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    @error="(e) => { e.target.onerror = null; e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; }" />

                  <!-- Preview Button (Always on top of selection overlay) -->
                  <div class="absolute top-2 right-2 flex gap-2 z-20">
                    <a :href="'/demo/' + item.slug" target="_blank" @click.stop
                       class="bg-white/95 hover:bg-white text-mocha px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 border border-mocha/10">
                      <i class="fa-solid fa-eye"></i> Demo
                    </a>
                  </div>

                  <div v-if="selectedTemplate === item.id"
                    class="absolute inset-0 bg-mocha/40 backdrop-blur-[1px] flex items-center justify-center animate-fade-in z-10">
                    <div class="bg-white rounded-full p-2 shadow-lg scale-110">
                      <svg class="w-6 h-6 text-mocha" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <!-- Price Tag -->
                  <div class="absolute bottom-2 left-2 z-20">
                    <div class="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold border border-white/10">
                      {{ item.price > 0 ? formatPrice(item.price) : 'Gratis' }}
                    </div>
                  </div>
                </div>
                <div class="p-4 flex flex-col flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-dark text-sm line-clamp-1"
                      :class="selectedTemplate === item.id ? 'text-mocha' : ''">{{ item.name }}</h4>
                    <span v-if="item.isPremium" class="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-200 uppercase">Premium</span>
                  </div>

                  <p class="text-[11px] text-muted mb-3 line-clamp-2 flex-1 leading-relaxed">{{ item.description }}</p>

                  <!-- Additional Info: Sections & Tags -->
                  <div class="flex items-center gap-3 mb-4">
                    <div class="flex items-center gap-1 text-[10px] text-gray-500">
                      <i class="fa-solid fa-layer-group text-mocha/50"></i>
                      <span>{{ item.sections?.length || 0 }} Fitur</span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-gray-500">
                      <i class="fa-solid fa-tag text-mocha/50"></i>
                      <span class="capitalize">{{ item.category || 'Basic' }}</span>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-gray-50 mt-auto flex justify-between items-center">
                    <div class="flex gap-1">
                      <span v-for="color in (item.paletteColors || item.paletteColor)" :key="color" class="w-3 h-3 rounded-full border border-gray-100" :style="{ backgroundColor: color }"></span>
                    </div>
                    <span v-if="selectedTemplate === item.id" class="text-xs font-bold text-mocha flex items-center gap-1">
                      <i class="fa-solid fa-circle-check"></i> Terpilih
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <div
                class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl grayscale opacity-50">
                📦</div>
              <div>
                <p class="font-medium text-gray-600">Tidak ada template ditemukan</p>
                <p class="text-sm">Coba pilih kategori lain.</p>
              </div>
            </div>
          </div>

          <!-- Footer Modal -->
          <div
            class="shrink-0 p-4 border-t border-gray-200 bg-white flex justify-between items-center z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] mt-auto">
            <div class="hidden sm:block">
              <p v-if="selectedTemplate" class="text-sm text-mocha font-medium">
                Template terpilih: <span class="font-bold">{{filteredTemplates.find(t => t.id ===
                  selectedTemplate)?.name }}</span>
              </p>
              <p v-else class="text-sm text-gray-400">Silakan pilih template.</p>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button @click="showModal = false"
                class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition">Batal</button>
              <button
                class="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-mocha text-white text-sm font-semibold hover:bg-mocha/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-mocha/20 hover:shadow-mocha/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                :disabled="selectedTemplate === null" @click="goToCreate">
                Lanjut <span class="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
    <ExitIntentPromo />
</template>

<script setup>
import { ref, computed, watch, nextTick, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import HeroSection from '@/components/layout/HeroSection.vue'
import ComparisonSection from '@/components/landing/ComparisonSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import StepsSection from '@/components/landing/StepsSection.vue'
import TutorialSection from '@/components/landing/TutorialSection.vue'
import FaqSection from '@/components/landing/FaqSection.vue'
import { getTemplateDesigns } from '@/api/templateDesign'
import { getPackages } from '@/api/payment'
import FloatingNovaButton from '@/components/nova/FloatingNovaButton.vue'
import AuthModal from '@/components/modal/AuthModal.vue'

const router = useRouter()
const showModal = ref(false)
const selectedPlan = ref(null)

// Pricing tier chosen on homepage. Persisted in goToCreate so it carries into the studio + checkout.
function choosePlan(planId) {
  selectedPlan.value = planId
  showModal.value = true
}
const showAuthModal = ref(false)
const authMode = ref('login')

watch(showModal, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const selectedTemplate = ref(null)
const selectedCategory = ref('all') // Default to 'all' ID
const templateRefs = reactive({})
const templates = ref([])
const loading = ref(true)

// Presentation metadata. Price filled from GET /payment/packages (single source of truth).
// id matches InvitationPackage enum on backend.
const pricingPlans = ref([
  {
    id: 'basic',
    name: 'Basic',
    price: 'Rp 89.000',
    tagline: 'Cocok untuk undangan simpel & hemat.',
    highlighted: false,
    features: [
      { label: 'Bebas Pilih Semua Desain', included: true },
      { label: 'Peta Lokasi', included: true },
      { label: 'Hitung Mundur', included: true },
      { label: 'Musik Latar', included: true },
      { label: 'RSVP & Amplop Digital', included: true },
      { label: 'Tanpa Galeri', included: false },
      { label: 'Ada Watermark "SatuUndangan"', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'Rp 179.000',
    tagline: 'Fitur lengkap untuk momen spesialmu.',
    highlighted: true,
    features: [
      { label: 'Semua Fitur Basic', included: true },
      { label: 'Musik Latar', included: true },
      { label: 'Galeri Foto', included: true },
      { label: 'RSVP & Amplop Digital', included: true },
      { label: 'Kirim Undangan via WhatsApp', included: true },
      { label: 'Template Pesan Undangan Siap Pakai', included: true },
      { label: 'Tanpa Watermark (Undangan Bersih)', included: true },
    ],
  },
  {
    id: 'eksklusif',
    name: 'Eksklusif',
    price: 'Rp 239.000',
    tagline: 'Lebih profesional & otomatis.',
    highlighted: false,
    features: [
      { label: 'Semua Fitur Premium', included: true },
      { label: 'Subdomain Custom (namapasangan.satuundangan.id)', included: true },
    ],
  },
])

function formatRupiah(value) {
  return 'Rp ' + Number(value || 0).toLocaleString('id-ID')
}

const testimonials = [
  {
    id: 1,
    name: 'Rani & Aldi',
    role: 'Pengantin Bahagia',
    text: 'Sangat puas dengan hasilnya! Template premiumnya benar-benar elegan. Tamu-tamu kami banyak yang memuji desain undangannya.',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 2,
    name: 'Nabila',
    role: 'Sahabat Mempelai',
    text: 'Baru kali ini liat undangan online yang seprofesional ini. Fitur RSVP dan amplop digitalnya sangat membantu.',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 3,
    name: 'Vina & Robby',
    role: 'Pengantin',
    text: 'Worth every penny! Fitur lengkap, desain tidak pasaran, dan servernya cepat. Recommended banget buat yang mau nikah.',
    avatar: 'https://i.pravatar.cc/150?img=51',
  },
];

// Load Data
onMounted(async () => {
  try {
    const tplData = await getTemplateDesigns()

    if (tplData) {
      const rawTplData = Array.isArray(tplData) ? tplData : (tplData.data || [])
      templates.value = Array.isArray(rawTplData) ? rawTplData : []
    }

  } catch (e) {
    console.error('Gagal ambil data:', e)
  } finally {
    loading.value = false
  }

  // Sync prices from backend so cards never drift from real package prices.
  try {
    const pkgData = await getPackages()
    const list = Array.isArray(pkgData) ? pkgData : (pkgData?.data || [])
    const priceById = Object.fromEntries(list.map((p) => [p.id, p.price]))
    pricingPlans.value = pricingPlans.value.map((plan) =>
      priceById[plan.id] != null ? { ...plan, price: formatRupiah(priceById[plan.id]) } : plan,
    )
  } catch (e) {
    console.error('Gagal ambil paket harga, pakai harga statis:', e)
  }
})

// Normalize tags to array (handles JSON array, CSV string, or existing array)
const normalizeTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    const trimmed = tags.trim()
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return trimmed.split(',').map(t => t.trim()).filter(Boolean)
  }
  return []
}

// Filter Logic
const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') return templates.value

  return templates.value.filter(t => {
    const tags = normalizeTags(t.tags)
    return tags.some(tag => tag.toLowerCase() === selectedCategory.value.toLowerCase())
  })
})

// Catalog filter categories, derived dynamically from the tags of loaded templates.
// id = lowercase tag (matches case-insensitive filter); name = display-cased. Always prefixed with "Semua".
const styleCategories = computed(() => {
  const map = new Map()
  templates.value.forEach((t) =>
    normalizeTags(t.tags).forEach((raw) => {
      const tag = (raw || '').trim()
      const key = tag.toLowerCase()
      if (key && !map.has(key)) {
        map.set(key, tag.charAt(0).toUpperCase() + tag.slice(1))
      }
    }),
  )
  const cats = [...map.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id, name]) => ({ id, name }))
  return [{ id: 'all', name: 'Semua' }, ...cats]
})

watch(() => showModal.value, (newVal) => {
  if (newVal) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

watch(() => showModal.value, async (val) => {
  if (val && selectedTemplate.value) {
    await nextTick()
    const el = templateRefs[selectedTemplate.value]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})

function selectTemplate(id) {
  selectedTemplate.value = id
}

function resolveImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/400x300?text=No+Preview'
  if (url.startsWith('http')) return url
  // Handle absolute path from backend
  const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '')
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

function goToCreate() {
  const tpl = templates.value.find((t) => t.id === selectedTemplate.value)

  if (tpl) {
    localStorage.removeItem('editInvitationId')
    localStorage.removeItem('selectedSections')
    localStorage.removeItem('finalPayload')
    localStorage.setItem('selectedTemplate', JSON.stringify(tpl))
    localStorage.setItem('selectedPackage', selectedPlan.value || 'basic')
    showModal.value = false;
    router.push('/create')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

.font-sans {
  font-family: 'Inter', sans-serif;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d6d3d1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a29e;
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
