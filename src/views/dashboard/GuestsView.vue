<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden pb-20 md:pb-0">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div
      :class="[
        'flex-1 flex flex-col transition-all duration-300 min-w-0',
        isSidebarOpen ? 'md:ml-64' : 'md:ml-0',
      ]"
    >
      <Topbar title="Daftar Tamu" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 flex-1 overflow-y-auto space-y-6">
        <!-- Header & Main Actions -->
        <div class="space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <h2 class="text-xl md:text-3xl font-serif font-bold text-dark">Manajemen Tamu</h2>
              <button
                @click="showHelpModal = true"
                class="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs hover:bg-blue-100 transition-colors"
                title="Cara Pakai"
              >
                <i class="fa-solid fa-question"></i>
              </button>
            </div>
            <div class="flex flex-wrap gap-2 md:gap-3">
              <button
                @click="showAddModal = true"
                :disabled="!selectedInvitationId"
                class="flex-1 md:flex-none bg-mocha text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-mocha/90 flex items-center justify-center gap-2 shadow-lg shadow-mocha/20 disabled:opacity-50 transition-all"
              >
                <i class="fa-solid fa-user-plus"></i> Tambah
              </button>
              <button
                @click="showBulkModal = true"
                :disabled="!selectedInvitationId"
                class="flex-1 md:flex-none bg-white text-mocha border border-mocha/20 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                <i class="fa-solid fa-users"></i> Massal
              </button>
              <button
                @click="pickFromContacts"
                :disabled="!selectedInvitationId"
                class="flex-1 md:flex-none bg-white text-blue-600 border border-blue-100 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                <i class="fa-solid fa-address-book"></i> Kontak
              </button>
              <div class="flex gap-1">
                <button
                  @click="triggerExcelImport"
                  :disabled="!selectedInvitationId"
                  class="flex-1 md:flex-none bg-white text-green-600 border border-green-100 px-5 py-2.5 rounded-l-xl text-xs font-bold hover:bg-green-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all border-r-0"
                >
                  <i class="fa-solid fa-file-excel"></i> Import
                </button>
                <button
                  @click="downloadTemplate"
                  :disabled="!selectedInvitationId"
                  class="bg-white text-green-600 border border-green-100 px-3 py-2.5 rounded-r-xl text-xs font-bold hover:bg-green-50 flex items-center justify-center disabled:opacity-50 transition-all"
                  title="Download Template Excel"
                >
                  <i class="fa-solid fa-download"></i>
                </button>
              </div>
              <input
                type="file"
                ref="excelInput"
                class="hidden"
                accept=".xlsx, .xls"
                @change="handleExcelImport"
              />
            </div>
          </div>

          <div
            class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4"
          >
            <div class="flex-1">
              <label
                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
                >Pilih Undangan</label
              >
              <select
                v-model="selectedInvitationId"
                class="w-full border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-mocha/20"
              >
                <option v-for="inv in invitations" :key="inv.id" :value="inv.id">
                  {{ inv.title }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label
                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
                >Cari Nama</label
              >
              <div class="relative">
                <i
                  class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"
                ></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Masukkan nama tamu..."
                  class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-mocha/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin text-mocha text-2xl">⏳</div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-bold text-dark text-xs uppercase tracking-wider">
              Total: {{ filteredGuests.length }} Tamu
            </h3>
          </div>

          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead
                class="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest"
              >
                <tr>
                  <th class="px-6 py-4">Nama Tamu</th>
                  <th class="px-6 py-4">Kategori</th>
                  <th class="px-6 py-4">Status RSVP</th>
                  <th class="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="guest in filteredGuests"
                  :key="guest.id"
                  class="hover:bg-gray-50/50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <p class="font-bold text-dark">{{ guest.name }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">
                      {{ guest.phoneNumber || 'No phone' }}
                    </p>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2 py-1 rounded-lg text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider"
                      >{{ guest.group || 'Umum' }}</span
                    >
                  </td>
                  <td class="px-6 py-4">
                    <div
                      v-if="guest.rsvpStatus === 'hadir'"
                      class="flex items-center gap-1.5 text-green-600 font-bold text-xs"
                    >
                      <i class="fa-solid fa-circle-check"></i> Hadir
                    </div>
                    <div
                      v-else-if="guest.rsvpStatus === 'tidak'"
                      class="flex items-center gap-1.5 text-red-400 font-bold text-xs"
                    >
                      <i class="fa-solid fa-circle-xmark"></i> Tidak
                    </div>
                    <div v-else class="text-gray-300 text-[10px] italic">Menunggu...</div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="openShareModal(guest)"
                        :class="
                          currentInvitation?.isPublished
                            ? 'text-green-500 hover:text-green-600 bg-green-50 hover:bg-green-100'
                            : 'text-gray-300 bg-gray-50'
                        "
                        class="w-9 h-9 flex items-center justify-center rounded-xl transition"
                        title="Kirim WA"
                      >
                        <i class="fa-brands fa-whatsapp text-lg"></i>
                      </button>
                      <button
                        @click="deleteGuestHandler(guest.id)"
                        class="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition"
                        title="Hapus"
                      >
                        <i class="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="md:hidden divide-y divide-gray-50">
            <div v-for="guest in filteredGuests" :key="guest.id" class="p-4 space-y-3">
              <div class="flex justify-between items-start">
                <div class="min-w-0 flex-1 pr-4">
                  <p class="font-bold text-dark truncate">{{ guest.name }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    {{ guest.phoneNumber || 'No phone' }}
                  </p>
                </div>
                <span
                  class="shrink-0 px-2 py-1 rounded-lg text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider"
                  >{{ guest.group || 'Umum' }}</span
                >
              </div>

              <div class="flex justify-between items-center">
                <div class="text-xs">
                  <div
                    v-if="guest.rsvpStatus === 'hadir'"
                    class="flex items-center gap-1.5 text-green-600 font-bold"
                  >
                    <i class="fa-solid fa-circle-check"></i> Hadir
                  </div>
                  <div
                    v-else-if="guest.rsvpStatus === 'tidak'"
                    class="flex items-center gap-1.5 text-red-400 font-bold"
                  >
                    <i class="fa-solid fa-circle-xmark"></i> Tidak
                  </div>
                  <div v-else class="text-gray-300 italic text-[10px]">Menunggu...</div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="openShareModal(guest)"
                    :class="
                      currentInvitation?.isPublished
                        ? 'text-green-500 bg-green-50 active:bg-green-100'
                        : 'text-gray-300 bg-gray-50'
                    "
                    class="w-10 h-10 flex items-center justify-center rounded-xl transition"
                  >
                    <i class="fa-brands fa-whatsapp text-xl"></i>
                  </button>
                  <button
                    @click="deleteGuestHandler(guest.id)"
                    class="w-10 h-10 flex items-center justify-center text-red-400 bg-red-50 active:bg-red-100 rounded-xl transition"
                  >
                    <i class="fa-solid fa-trash-can text-base"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredGuests.length === 0" class="px-6 py-12 text-center">
            <div class="text-gray-300 mb-2"><i class="fa-solid fa-users-slash text-3xl"></i></div>
            <p class="text-gray-400 text-xs italic">Belum ada tamu atau nama tidak ditemukan.</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-xl animate-scale-up">
        <h3 class="font-bold text-xl mb-6 text-dark flex items-center gap-2">
          <i class="fa-solid fa-user-plus text-mocha"></i> Tambah Tamu
        </h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
              >Nama Tamu</label
            >
            <input
              v-model="newGuest.name"
              type="text"
              class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none text-sm"
              placeholder="Misal: Budi Santoso"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
              >Kategori</label
            >
            <select
              v-model="newGuest.group"
              class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 text-sm"
            >
              <option value="">Umum</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Teman">Teman</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
              >WhatsApp (08...)</label
            >
            <input
              v-model="newGuest.phoneNumber"
              type="text"
              class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none text-sm"
              placeholder="085121266550"
            />
          </div>
        </div>
        <div class="mt-8 flex gap-3">
          <button @click="showAddModal = false" class="flex-1 py-3 text-gray-400 font-bold text-sm">
            Batal
          </button>
          <button
            @click="submitGuest"
            :disabled="isSubmitting"
            class="flex-[2] py-3 bg-mocha text-white rounded-xl text-sm font-bold disabled:opacity-50"
          >
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Tamu' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Add Modal -->
    <div
      v-if="showBulkModal"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-xl animate-scale-up">
        <h3 class="font-bold text-xl mb-2 text-dark">Tambah Tamu Massal</h3>
        <p class="text-xs text-muted mb-6 italic">
          Format: "Nama NomorHP" (per baris). Contoh: "Budi Santoso 08123456789"
        </p>
        <textarea
          v-model="bulkText"
          class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 h-64 text-sm focus:ring-2 focus:ring-mocha/20 outline-none"
          placeholder="Budi Santoso 08123456789&#10;Ani Wijaya 081388889999"
        ></textarea>
        <div class="mt-8 flex gap-3">
          <button
            @click="showBulkModal = false"
            class="flex-1 py-3 text-gray-400 font-bold text-sm"
          >
            Batal
          </button>
          <button
            @click="processBulkAdd"
            :disabled="!bulkText.trim() || isSubmitting"
            class="flex-[2] py-3 bg-mocha text-white rounded-xl text-sm font-bold disabled:opacity-50"
          >
            {{ isSubmitting ? 'Memproses...' : 'Proses Massal' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-xl animate-scale-up">
        <h3 class="font-bold text-xl mb-2 text-dark">Kirim Undangan</h3>
        <p class="text-xs text-muted mb-6">Pesan ini akan dikirim melalui WhatsApp.</p>
        <textarea
          v-if="loadingMessage"
          disabled
          class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 h-40 text-sm italic"
        >
Memuat pesan template...</textarea
        >
        <textarea
          v-else
          v-model="shareMessage"
          class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 focus:ring-2 focus:ring-mocha/20 outline-none h-40 text-sm"
        ></textarea>
        <div class="mt-8 flex gap-3">
          <button
            @click="showShareModal = false"
            class="flex-1 py-3 text-gray-400 font-bold text-sm"
          >
            Batal
          </button>
          <button
            @click="sendWhatsApp"
            :disabled="loadingMessage"
            class="flex-[2] py-3 bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <i class="fa-brands fa-whatsapp text-lg"></i> Kirim WA
          </button>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div
      v-if="showHelpModal"
      class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl animate-scale-up">
        <h3 class="font-bold text-2xl mb-2 text-dark">Panduan Manajemen Tamu</h3>
        <p class="text-sm text-gray-500 mb-8">Cara mudah mengelola dan mengirim undangan.</p>

        <div class="space-y-6">
          <div class="flex gap-4">
            <div
              class="w-10 h-10 shrink-0 rounded-full bg-mocha text-white flex items-center justify-center font-bold"
            >
              1
            </div>
            <div>
              <h4 class="font-bold text-dark text-sm">Input Tamu</h4>
              <p class="text-xs text-gray-500 leading-relaxed">
                Gunakan tombol <b>Tambah</b> untuk satu orang, atau <b>Massal</b> untuk copy-paste
                list banyak orang sekaligus.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div
              class="w-10 h-10 shrink-0 rounded-full bg-mocha text-white flex items-center justify-center font-bold"
            >
              2
            </div>
            <div>
              <h4 class="font-bold text-dark text-sm">Pilih dari Kontak</h4>
              <p class="text-xs text-gray-500 leading-relaxed">
                Klik tombol <b>Kontak</b> (saat buka web di HP) untuk memilih tamu langsung dari
                buku telepon Anda.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div
              class="w-10 h-10 shrink-0 rounded-full bg-mocha text-white flex items-center justify-center font-bold"
            >
              3
            </div>
            <div>
              <h4 class="font-bold text-dark text-sm">Kirim Undangan</h4>
              <p class="text-xs text-gray-500 leading-relaxed">
                Klik icon <b>WhatsApp</b> untuk mengirim pesan undangan profesional
                (Assalamu'alaikum, dll) secara otomatis.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <button
            @click="showHelpModal = false"
            class="w-full py-4 bg-mocha text-white rounded-2xl font-bold text-sm shadow-lg shadow-mocha/20"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import Sidebar from '@/components/dashboard/SidebarDashboard.vue'
import Topbar from '@/components/dashboard/TopbarDashboard.vue'
import BottomNav from '@/components/dashboard/BottomNav.vue'
import { getInvitations } from '@/api/invitation'
import {
  getGuestsByInvitationId,
  createGuest,
  deleteGuest,
  getGuestShareLink,
  importGuests,
} from '@/api/guest'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'

const toast = useToast()
const invitations = ref([])
const selectedInvitationId = ref(null)
const guests = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const showBulkModal = ref(false)
const showHelpModal = ref(false)
const bulkText = ref('')
const isSubmitting = ref(false)
const searchQuery = ref('')
const isSidebarOpen = ref(window.innerWidth >= 768)
const excelInput = ref(null)

const showShareModal = ref(false)
const shareMessage = ref('')
const selectedGuestForShare = ref(null)
const loadingMessage = ref(false)

const isContactPickerSupported = computed(() => {
  return !!(navigator.contacts && window.ContactsManager)
})

const filteredGuests = computed(() => {
  if (!searchQuery.value) return guests.value
  const lower = searchQuery.value.toLowerCase()
  return guests.value.filter((g) => g.name.toLowerCase().includes(lower))
})

onMounted(async () => {
  await fetchInvitations()
})

watch(selectedInvitationId, async (newId) => {
  if (newId) await fetchGuests(newId)
})

async function fetchInvitations() {
  try {
    const res = await getInvitations()
    const data = Array.isArray(res) ? res : res.data || []
    invitations.value = data
  } catch (error) {
    toast.error('Gagal memuat undangan')
    console.error(error)
  }
}

async function fetchGuests(invId) {
  loading.value = true
  try {
    const res = await getGuestsByInvitationId(invId)
    guests.value = Array.isArray(res) ? res : res.data || []
  } catch (error) {
    toast.error('Gagal memuat tamu')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function submitGuest() {
  if (!newGuest.value.name?.trim()) {
    toast.warning('Nama tamu wajib diisi')
    return
  }
  isSubmitting.value = true
  try {
    await createGuest({ ...newGuest.value, invitationId: selectedInvitationId.value })
    toast.success('Tamu berhasil ditambahkan')
    showAddModal.value = false
    newGuest.value = { name: '', group: '', phoneNumber: '' }
    await fetchGuests(selectedInvitationId.value)
  } catch (error) {
    toast.error('Gagal menambahkan tamu')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

async function deleteGuestHandler(id) {
  if (!confirm('Hapus tamu?')) return
  try {
    await deleteGuest(id)
    toast.success('Dihapus')
    await fetchGuests(selectedInvitationId.value)
  } catch (error) {
    toast.error('Gagal menghapus tamu')
    console.error(error)
  }
}

async function openShareModal(guest) {
  if (!currentInvitation.value?.isPublished) {
    toast.warning('Undangan belum dipublikasikan')
    return
  }
  selectedGuestForShare.value = guest
  showShareModal.value = true
  loadingMessage.value = true
  try {
    const res = await getGuestShareLink(guest.id)
    // Support both direct response or response.data wrapping
    const data = res?.data || res
    if (data?.message) {
      shareMessage.value = data.message
    } else {
      const couple =
        currentInvitation.value?.coupleName ||
        `${currentInvitation.value?.groomName} & ${currentInvitation.value?.brideName}`
      shareMessage.value = `Assalamu'alaikum Wr. Wb.\n\nYth. *${guest.name}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n*${couple}*\n\nDetail Undangan:\n${data?.url || ''}\n\nTerima kasih.`
    }
  } catch (error) {
    shareMessage.value = `Hai ${guest.name}! Mohon maaf terjadi kesalahan teknis.`
  } finally {
    loadingMessage.value = false
  }
}

function sendWhatsApp() {
  if (!selectedGuestForShare.value) return
  const guest = selectedGuestForShare.value
  const phone = (guest.phoneNumber || '').replace(/[^0-9]/g, '')
  const waNumber = phone.startsWith('0') ? `62${phone.slice(1)}` : phone
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(shareMessage.value)}`, '_blank')
  showShareModal.value = false
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.2s ease-out;
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
