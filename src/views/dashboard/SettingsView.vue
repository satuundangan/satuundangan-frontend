<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Pengaturan" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto">
        <div class="mb-2">
           <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Pengaturan Akun</h2>
           <p class="text-xs md:text-sm text-muted">Kelola informasi profil dan keamanan akunmu.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div class="lg:col-span-2 space-y-6">
              <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                 <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                    <div class="h-16 w-16 rounded-2xl bg-mocha/10 flex items-center justify-center text-mocha text-2xl font-bold border-2 border-white shadow-sm">
                       {{ userName.charAt(0) }}
                    </div>
                    <div>
                       <h3 class="font-bold text-dark">{{ userName }}</h3>
                       <p class="text-xs text-muted">{{ userEmail }}</p>
                    </div>
                 </div>

                 <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nama Lengkap</label>
                          <input v-model="profileForm.name" type="text" class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none text-sm" placeholder="Nama lengkap kamu">
                       </div>
                       <div>
                          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Alamat Email</label>
                          <input v-model="profileForm.email" type="email" disabled class="w-full border border-gray-100 rounded-xl p-3 bg-gray-100 text-gray-400 cursor-not-allowed text-sm" placeholder="email@contoh.com">
                       </div>
                    </div>
                    <div class="flex justify-end pt-2">
                       <button type="submit" :disabled="loadingProfile" class="w-full md:w-auto px-8 py-3 bg-mocha text-white rounded-xl text-sm font-bold shadow-lg shadow-mocha/20 hover:bg-dark transition-all disabled:opacity-50">
                          {{ loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
                       </button>
                    </div>
                 </form>
              </div>

              <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                 <h3 class="font-bold text-dark mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-shield-halved text-mocha"></i> Keamanan Akun
                 </h3>
                 <form @submit.prevent="handleUpdatePassword" class="space-y-4">
                    <div>
                       <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Password Baru</label>
                       <input v-model="passwordForm.newPassword" type="password" class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none text-sm" placeholder="Minimal 6 karakter">
                    </div>
                    <div>
                       <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Konfirmasi Password Baru</label>
                       <input v-model="passwordForm.confirmPassword" type="password" class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none text-sm" placeholder="Ulangi password baru">
                    </div>
                    <div class="flex justify-end pt-2">
                       <button type="submit" :disabled="loadingPassword" class="w-full md:w-auto px-8 py-3 bg-white border border-mocha text-mocha rounded-xl text-sm font-bold hover:bg-mocha/5 transition-all disabled:opacity-50">
                          {{ loadingPassword ? 'Memproses...' : 'Ganti Password' }}
                       </button>
                    </div>
                 </form>
              </div>
           </div>

           <div class="space-y-6">
              <div class="bg-mocha rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                 <div class="relative z-10">
                    <h3 class="font-bold text-lg mb-2">Butuh Bantuan?</h3>
                    <p class="text-xs text-white/80 mb-4 leading-relaxed">Punya kendala dengan akunmu? Tim support kami siap membantumu kapan saja.</p>
                    <a href="https://wa.me/628123456789" target="_blank" class="inline-flex items-center gap-2 bg-white text-mocha px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                       <i class="fa-brands fa-whatsapp text-sm"></i> Chat Support
                    </a>
                 </div>
                 <i class="fa-solid fa-headset absolute -right-6 -bottom-6 text-white/10 text-8xl rotate-12"></i>
              </div>
              <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                 <h3 class="font-bold text-dark text-xs uppercase tracking-widest mb-4">Informasi Akun</h3>
                 <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-50">
                       <span class="text-xs text-muted">Status</span>
                       <span class="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-md border border-green-100 uppercase">Aktif</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                       <span class="text-xs text-muted">Versi App</span>
                       <span class="text-xs text-gray-400">v1.2.0</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Sidebar from "@/components/dashboard/SidebarDashboard.vue";
import Topbar from "@/components/dashboard/TopbarDashboard.vue";
import BottomNav from "@/components/dashboard/BottomNav.vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const toast = useToast();
const auth = useAuthStore();
const isSidebarOpen = ref(window.innerWidth >= 768);

const userName = computed(() => auth.user?.name || 'User');
const userEmail = computed(() => auth.user?.email || 'email@example.com');

const loadingProfile = ref(false);
const loadingPassword = ref(false);

const profileForm = ref({
  name: auth.user?.name || '',
  email: auth.user?.email || ''
});

const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
});

async function handleUpdateProfile() {
  if (!profileForm.value.name.trim()) {
    toast.warning("Nama tidak boleh kosong");
    return;
  }
  loadingProfile.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success("Profil berhasil diperbarui");
  } catch {
    toast.error("Gagal memperbarui profil");
  } finally {
    loadingProfile.value = false;
  }
}

async function handleUpdatePassword() {
  if (passwordForm.value.newPassword.length < 6) {
    toast.warning("Password minimal 6 karakter");
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error("Konfirmasi password tidak cocok");
    return;
  }
  loadingPassword.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Password berhasil diganti");
    passwordForm.value = { newPassword: '', confirmPassword: '' };
  } catch {
    toast.error("Gagal mengganti password");
  } finally {
    loadingPassword.value = false;
  }
}
</script>
