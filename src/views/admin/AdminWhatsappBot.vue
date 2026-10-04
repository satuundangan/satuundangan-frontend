<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <i class="pi pi-whatsapp text-emerald-600 text-2xl"></i>
          WhatsApp Auto-Reply Bot
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Auto-reply WhatsApp pintar berbasis Baileys & Google Gemini AI tanpa langganan bulanan.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="loadStatus"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
        >
          <i :class="['pi pi-refresh', loading ? 'animate-spin' : '']"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Status Overview & Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Status Connection -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Koneksi</span>
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              status.status === 'CONNECTED'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : status.status === 'SCAN_QR'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200',
            ]"
          >
            <span
              :class="[
                'w-2 h-2 rounded-full',
                status.status === 'CONNECTED'
                  ? 'bg-emerald-500 animate-pulse'
                  : status.status === 'SCAN_QR'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-rose-500',
              ]"
            ></span>
            {{ status.status }}
          </span>
        </div>
        <div class="mt-4">
          <div v-if="status.status === 'CONNECTED'" class="text-sm font-semibold text-slate-800">
            {{ status.connectedName || status.botName || 'WhatsApp Connected' }}
            <p class="text-xs font-normal text-slate-500 font-mono mt-0.5">
              +{{ status.connectedPhone || status.phoneNumber || '-' }}
            </p>
          </div>
          <div v-else class="text-sm text-slate-500">
            {{ status.status === 'SCAN_QR' ? 'Menunggu Scan QR Code' : 'Terputus dari WhatsApp' }}
          </div>
        </div>
      </div>

      <!-- Master Bot Auto-Reply Switch -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Master Bot Auto-Reply</span>
          <i :class="['pi pi-power-off', status.isBotEnabled ? 'text-emerald-500' : 'text-slate-400']"></i>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-slate-800">
              {{ status.isBotEnabled ? 'Bot Aktif' : 'Bot Nonaktif' }}
            </div>
            <p class="text-xs text-slate-500">Auto-reply pesan masuk</p>
          </div>
          <button
            @click="handleToggleBot"
            :disabled="togglingBot"
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              status.isBotEnabled ? 'bg-emerald-600' : 'bg-slate-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                status.isBotEnabled ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>
      </div>

      <!-- AI Auto-Reply Switch -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Gemini AI Engine</span>
          <i class="pi pi-sparkles text-amber-500"></i>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-slate-800">
              {{ status.isAiEnabled ? 'AI Aktif' : 'Menu Statis' }}
            </div>
            <p class="text-xs text-slate-500">Balasan pintar vs menu</p>
          </div>
          <button
            @click="handleToggleAi"
            :disabled="togglingAi || !status.isBotEnabled"
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              status.isAiEnabled && status.isBotEnabled ? 'bg-purple-600' : 'bg-slate-300',
              !status.isBotEnabled ? 'opacity-40 cursor-not-allowed' : ''
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                status.isAiEnabled ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>
      </div>

      <!-- Messages Replied Counter -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Pesan Dibalas</span>
          <i class="pi pi-comments text-blue-500"></i>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-bold text-slate-900">
            {{ status.stats?.messagesReplied || 0 }}
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Dari {{ status.stats?.messagesReceived || 0 }} total pesan masuk
          </p>
        </div>
      </div>

      <!-- AI Generated Responses -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Jawaban AI</span>
          <i class="pi pi-bolt text-purple-500"></i>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-bold text-purple-700">
            {{ status.stats?.aiRepliesGenerated || 0 }}
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Gemini 2.5 Flash / Flash-Lite</p>
        </div>
      </div>
    </div>

    <!-- Main Section: QR Scanner & Connection Card -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- QR Scanner / Session Card -->
      <div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i class="pi pi-qrcode text-slate-700"></i>
              Autentikasi WhatsApp Multi-Device
            </h2>
          </div>

          <!-- CONNECTED STATE -->
          <div
            v-if="status.status === 'CONNECTED'"
            class="text-center py-8 px-4 rounded-xl bg-emerald-50/50 border border-emerald-100"
          >
            <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shadow-inner">
              <i class="pi pi-check"></i>
            </div>
            <h3 class="text-base font-bold text-emerald-900">WhatsApp Terhubung Aktif!</h3>
            <p class="text-xs text-emerald-700 mt-1 max-w-xs mx-auto">
              Bot sedang berjalan dan siap membalas pesan masuk secara otomatis 24/7.
            </p>
            <div class="mt-4 p-3 bg-white rounded-lg border border-emerald-200 inline-block text-left text-xs text-slate-700 font-mono">
              <div><strong>Nomor:</strong> +{{ status.connectedPhone || 'N/A' }}</div>
              <div><strong>Nama:</strong> {{ status.connectedName || 'N/A' }}</div>
            </div>

            <div class="mt-6">
              <button
                @click="handleLogout"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition disabled:opacity-50"
              >
                <i class="pi pi-sign-out"></i>
                Putuskan Sambungan (Logout)
              </button>
            </div>
          </div>

          <!-- SCAN QR STATE -->
          <div
            v-else-if="status.status === 'SCAN_QR' && status.qrCodeUrl"
            class="text-center py-4 px-2"
          >
            <p class="text-xs text-slate-600 mb-4">
              Buka aplikasi WhatsApp di HP &rarr; <strong>Perangkat Tertaut (Linked Devices)</strong> &rarr; Tautkan Perangkat, lalu arahkan kamera ke QR berikut:
            </p>
            <div class="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-400 shadow-md">
              <img
                :src="status.qrCodeUrl"
                alt="Scan WhatsApp QR"
                class="w-60 h-60 object-contain mx-auto"
              />
            </div>
            <p class="text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
              <i class="pi pi-spin pi-spinner text-xs"></i>
              QR diperbarui otomatis jika kedaluwarsa
            </p>
          </div>

          <!-- DISCONNECTED / INITIAL STATE -->
          <div
            v-else
            class="text-center py-10 px-4 rounded-xl bg-slate-50 border border-slate-200/80"
          >
            <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xl">
              <i class="pi pi-power-off"></i>
            </div>
            <h3 class="text-sm font-bold text-slate-800">Bot Belum Terhubung</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Klik tombol di bawah untuk membuat sesi baru dan menampilkan QR Code WhatsApp.
            </p>
            <div class="mt-5">
              <button
                @click="handleConnect"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
              >
                <i :class="['pi pi-link', actionLoading ? 'animate-spin' : '']"></i>
                Mulai Sesi WhatsApp & Tampilkan QR
              </button>
            </div>
          </div>
        </div>

        <!-- Instructions Box -->
        <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div class="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
            <i class="pi pi-info-circle text-blue-500"></i>
            Tips Keamanan & Operasional:
          </div>
          <div>• Menggunakan protokol WebSocket resmi WhatsApp Web (Baileys Multi-Device).</div>
          <div>• Bebas biaya langganan bulanan selamanya (Rp 0).</div>
          <div>• Jika pelanggan mengetik kata seperti <em>"admin"</em> atau <em>"bicara admin"</em>, bot otomatis jeda membalas selama 2 jam agar Anda dapat membalas secara manual.</div>
        </div>
      </div>

      <!-- Right Column: AI Playground & Test Sandbox -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Live AI Simulation Playground -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i class="pi pi-sparkles text-purple-600"></i>
                Simulasi Balasan AI (Playground Sandbox)
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Uji coba kecerdasan prompt Gemini menjawab pertanyaan prospek seputar SatuUndangan.
              </p>
            </div>
          </div>

          <!-- Quick Prompts Chips -->
          <div class="flex flex-wrap gap-2 mb-3">
            <button
              v-for="(sample, idx) in sampleQuestions"
              :key="idx"
              @click="testMessage = sample"
              type="button"
              class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              {{ sample }}
            </button>
          </div>

          <!-- Input Message -->
          <div class="space-y-3">
            <div class="relative">
              <textarea
                v-model="testMessage"
                rows="3"
                placeholder="Ketik pertanyaan pelanggan di sini (misal: 'Halo min, berapa harga bikin undangan pernikahan digital?')"
                class="w-full text-sm rounded-xl border-slate-300 focus:border-purple-500 focus:ring focus:ring-purple-200 p-3"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                @click="handleTestAi"
                :disabled="testingAi || !testMessage.trim()"
                class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition shadow-sm disabled:opacity-50"
              >
                <i :class="['pi pi-send', testingAi ? 'animate-spin' : '']"></i>
                {{ testingAi ? 'Menghasilkan Balasan...' : 'Uji Respon AI' }}
              </button>
            </div>
          </div>

          <!-- AI Response Preview Bubble -->
          <div v-if="aiTestResult" class="mt-4 p-4 rounded-xl bg-purple-50/60 border border-purple-200">
            <div class="flex items-center justify-between text-xs text-purple-800 font-semibold mb-2">
              <span class="flex items-center gap-1.5">
                <i class="pi pi-sparkles text-purple-600"></i>
                Hasil Jawaban Gemini:
              </span>
              <span class="text-[11px] text-purple-600 font-normal">
                {{ aiTestResult.timestamp ? new Date(aiTestResult.timestamp).toLocaleTimeString() : '' }}
              </span>
            </div>
            <div class="text-xs text-slate-800 whitespace-pre-line leading-relaxed bg-white p-3.5 rounded-lg border border-purple-100 shadow-sm font-sans">
              {{ aiTestResult.reply }}
            </div>
          </div>
        </div>

        <!-- Manual Dispatch Test Box -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i class="pi pi-send text-emerald-600"></i>
                Kirim Pesan WhatsApp Manual (Test Dispatch)
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Kirim pesan langsung ke nomor WhatsApp Anda untuk memastikan socket aktif.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-1">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
              <input
                v-model="manualPhone"
                type="text"
                placeholder="08123456789"
                class="w-full text-xs rounded-xl border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 p-2.5"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Isi Pesan</label>
              <div class="flex gap-2">
                <input
                  v-model="manualText"
                  type="text"
                  placeholder="Halo ini pesan tes dari bot SatuUndangan!"
                  class="w-full text-xs rounded-xl border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 p-2.5"
                />
                <button
                  @click="handleSendManual"
                  :disabled="sendingManual || !manualPhone || !manualText"
                  class="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  <i :class="['pi pi-send', sendingManual ? 'animate-spin' : '']"></i>
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import {
  fetchWhatsappBotStatus,
  connectWhatsappBot,
  logoutWhatsappBot,
  toggleWhatsappBot,
  toggleWhatsappBotAi,
  testWhatsappBotAi,
  sendWhatsappBotMessage,
} from '@/api/whatsappBot.js';

const loading = ref(false);
const actionLoading = ref(false);
const togglingBot = ref(false);
const togglingAi = ref(false);
const testingAi = ref(false);
const sendingManual = ref(false);

const status = ref({
  status: 'DISCONNECTED',
  connectedPhone: null,
  connectedName: null,
  botName: null,
  phoneNumber: null,
  qrCodeUrl: null,
  isBotEnabled: true,
  isAiEnabled: true,
  stats: {
    messagesReceived: 0,
    messagesReplied: 0,
    aiRepliesGenerated: 0,
  },
});

const testMessage = ref('Halo min, berapa harga pembuatan undangan pernikahan di SatuUndangan?');
const aiTestResult = ref(null);

const manualPhone = ref('');
const manualText = ref('Halo ini pesan uji coba dari sistem WhatsApp Bot SatuUndangan.');

const sampleQuestions = [
  'Berapa harga paket undangannya?',
  'Bisa revisi sepuasnya gak min?',
  'Berapa lama proses pembuatannya?',
  'Saya mau bicara sama admin langsung dong',
];

let pollInterval = null;

const loadStatus = async () => {
  try {
    loading.value = true;
    const res = await fetchWhatsappBotStatus();
    if (res && res.data) {
      status.value = res.data;
    }
  } catch (err) {
    console.error('Failed to load bot status:', err);
  } finally {
    loading.value = false;
  }
};

const handleConnect = async () => {
  try {
    actionLoading.value = true;
    await connectWhatsappBot();
    await loadStatus();
    Swal.fire({
      icon: 'info',
      title: 'Memulai WhatsApp Bot',
      text: 'Silakan scan QR code yang muncul di layar dengan aplikasi WhatsApp Anda.',
      timer: 2500,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memulai Bot',
      text: err.message || 'Terjadi kesalahan sistem',
    });
  } finally {
    actionLoading.value = false;
  }
};

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Putuskan WhatsApp?',
    text: 'Sesi bot akan dihentikan dan QR code baru akan dibutuhkan untuk menghubungkan kembali.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Logout',
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
      actionLoading.value = true;
      await logoutWhatsappBot();
      await loadStatus();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Logout',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Logout',
        text: err.message || 'Terjadi kesalahan',
      });
    } finally {
      actionLoading.value = false;
    }
  }
};

const handleToggleBot = async () => {
  try {
    togglingBot.value = true;
    const nextState = !status.value.isBotEnabled;
    const res = await toggleWhatsappBot(nextState);
    if (res && res.data) {
      status.value.isBotEnabled = res.data.isBotEnabled;
    } else {
      status.value.isBotEnabled = nextState;
    }
    Swal.fire({
      icon: status.value.isBotEnabled ? 'success' : 'info',
      title: status.value.isBotEnabled ? 'Bot Diaktifkan' : 'Bot Dinonaktifkan',
      text: status.value.isBotEnabled
        ? 'Auto-reply bot sekarang akan membalas pesan WhatsApp masuk.'
        : 'Bot berhenti membalas pesan masuk. Anda dapat membalas chat secara manual.',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengubah Status Bot',
      text: err.message || 'Terjadi kesalahan sistem',
    });
  } finally {
    togglingBot.value = false;
  }
};

const handleToggleAi = async () => {
  try {
    togglingAi.value = true;
    const nextState = !status.value.isAiEnabled;
    const res = await toggleWhatsappBotAi(nextState);
    if (res && res.data) {
      status.value.isAiEnabled = res.data.isAiEnabled;
    } else {
      status.value.isAiEnabled = nextState;
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengubah Status AI',
      text: err.message,
    });
  } finally {
    togglingAi.value = false;
  }
};

const handleTestAi = async () => {
  if (!testMessage.value.trim()) return;
  try {
    testingAi.value = true;
    const res = await testWhatsappBotAi(testMessage.value);
    if (res && res.data) {
      aiTestResult.value = res.data;
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menguji AI',
      text: err.message || 'Pastikan GEMINI_API_KEY terkonfigurasi dengan benar.',
    });
  } finally {
    testingAi.value = false;
  }
};

const handleSendManual = async () => {
  if (!manualPhone.value || !manualText.value) return;
  try {
    sendingManual.value = true;
    await sendWhatsappBotMessage(manualPhone.value, manualText.value);
    Swal.fire({
      icon: 'success',
      title: 'Pesan Terkirim',
      text: `Pesan berhasil dikirim ke ${manualPhone.value}`,
      timer: 2000,
      showConfirmButton: false,
    });
    manualText.value = '';
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengirim Pesan',
      text: err.message || 'Pastikan bot dalam status CONNECTED.',
    });
  } finally {
    sendingManual.value = false;
  }
};

onMounted(() => {
  loadStatus();
  // Poll status every 4 seconds to detect QR scan automatically
  pollInterval = setInterval(() => {
    if (status.value.status === 'SCAN_QR' || status.value.status === 'CONNECTING') {
      loadStatus();
    }
  }, 4000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
