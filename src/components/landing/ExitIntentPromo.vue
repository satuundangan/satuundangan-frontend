<template>
  <Transition name="fade-bounce">
    <div
      v-if="isVisible && promoData"
      class="fixed inset-0 z-[100] flex items-center justify-center sm:items-center items-end sm:p-4 p-0 sm:bg-black/40 bg-black/60 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="bg-[#FDFBF7] w-full sm:w-[480px] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] max-h-[85vh] transition-transform duration-300 transform border sm:border-[#E5E0D8] border-b-0 border-[#E5E0D8]"
        :class="isVisible ? 'translate-y-0' : 'translate-y-full sm:translate-y-8 sm:scale-95'"
      >
        <!-- Top bar with close button -->
        <div class="flex justify-end p-3 sm:p-4 absolute top-0 right-0 z-10 w-full bg-gradient-to-b from-[#FDFBF7] to-transparent">
          <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto sm:hidden mb-2 mt-1 absolute left-1/2 -translate-x-1/2"></div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100/50 backdrop-blur-sm"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 sm:p-8 pt-10 sm:pt-12 text-center overflow-y-auto custom-scrollbar">
          <div class="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4F0E6] text-[#A67C52] border border-[#E5E0D8]">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          
          <h3 class="font-serif text-2xl sm:text-3xl text-gray-900 mb-2 font-medium tracking-tight">Tunggu Sebentar!</h3>
          <p class="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed max-w-[90%] mx-auto">
            {{ promoData.text || 'Khusus untuk Anda yang mendaftar hari ini, dapatkan potongan harga spesial.' }}
          </p>

          <!-- Promo Code Box -->
          <div class="bg-white border border-dashed border-[#A67C52] rounded-xl p-4 sm:p-5 mb-6 relative overflow-hidden group">
            <div class="absolute inset-0 bg-[#A67C52] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"></div>
            <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Gunakan Kode Promo</div>
            <div class="text-2xl sm:text-3xl font-bold text-[#A67C52] tracking-widest font-mono">{{ promoData.code }}</div>
            <div class="mt-2 text-sm font-medium text-gray-700 bg-[#F4F0E6] inline-block px-3 py-1 rounded-full border border-[#E5E0D8]">
              Diskon {{ formatDiscount(promoData) }}
            </div>
          </div>

          <!-- Countdown -->
          <div class="flex justify-center items-center gap-3 mb-8">
            <div class="flex flex-col items-center">
              <div class="bg-gray-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold font-mono shadow-inner">
                {{ String(timeLeft.minutes).padStart(2, '0') }}
              </div>
              <span class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Menit</span>
            </div>
            <div class="text-gray-400 font-bold text-xl sm:text-2xl -mt-5">:</div>
            <div class="flex flex-col items-center">
              <div class="bg-gray-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold font-mono shadow-inner">
                {{ String(timeLeft.seconds).padStart(2, '0') }}
              </div>
              <span class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Detik</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-3">
            <button 
              @click="claimPromo"
              class="w-full bg-[#1A1A1A] hover:bg-[#A67C52] text-white py-3.5 sm:py-4 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>Amankan Promo Sekarang</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button 
              @click="close"
              class="w-full text-gray-400 hover:text-gray-600 py-2 text-xs sm:text-sm transition-colors"
            >
              Tidak, terima kasih. Saya bayar harga normal.
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const isVisible = ref(false);
const promoData = ref(null);
const hasTriggered = ref(false);
const router = useRouter();

const timeLeft = ref({ minutes: 14, seconds: 59 });
let timerInterval = null;

const formatDiscount = (promo) => {
  if (!promo) return '';
  if (promo.discount_type === 'percentage') {
    return \`\${promo.discount_value}%\`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(promo.discount_value);
};

const claimPromo = () => {
  if (promoData.value) {
    localStorage.setItem('savedPromoCode', promoData.value.code);
  }
  close();
  router.push('/register');
};

const close = () => {
  isVisible.value = false;
  if (timerInterval) clearInterval(timerInterval);
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value.seconds > 0) {
      timeLeft.value.seconds--;
    } else if (timeLeft.value.minutes > 0) {
      timeLeft.value.minutes--;
      timeLeft.value.seconds = 59;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const triggerExitIntent = () => {
  if (hasTriggered.value || !promoData.value) return;
  hasTriggered.value = true;
  isVisible.value = true;
  startTimer();
};

const handleMouseLeave = (e) => {
  if (e.clientY < 20) {
    triggerExitIntent();
  }
};

let lastScrollY = 0;
let lastScrollTime = 0;
let inactivityTimer = null;

const handleScroll = () => {
  if (hasTriggered.value) return;
  
  const currentScrollY = window.scrollY;
  const currentTime = Date.now();
  
  if (window.innerWidth <= 768) {
    const timeDiff = currentTime - lastScrollTime;
    const scrollDiff = lastScrollY - currentScrollY;
    
    if (scrollDiff > 50 && timeDiff < 100 && currentScrollY < 300) {
       triggerExitIntent();
    }
  }
  
  lastScrollY = currentScrollY;
  lastScrollTime = currentTime;
  
  resetInactivityTimer();
};

const resetInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (window.innerWidth <= 768 && window.scrollY > 200) {
    inactivityTimer = setTimeout(() => {
      triggerExitIntent();
    }, 15000);
  }
};

const fetchActivePromo = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await axios.get(\`\${apiUrl}/promo/active-intent\`);
    if (response.data?.success && response.data.data) {
      promoData.value = response.data.data;
      
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('scroll', handleScroll, { passive: true });
      resetInactivityTimer();
    }
  } catch (error) {
    console.error('Failed to fetch exit intent promo:', error);
  }
};

onMounted(() => {
  setTimeout(fetchActivePromo, 2000);
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseleave', handleMouseLeave);
  document.removeEventListener('scroll', handleScroll);
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.fade-bounce-enter-active {
  transition: opacity 0.4s ease;
}
.fade-bounce-leave-active {
  transition: opacity 0.3s ease;
}
.fade-bounce-enter-from,
.fade-bounce-leave-to {
  opacity: 0;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E5E0D8;
  border-radius: 10px;
}
</style>
