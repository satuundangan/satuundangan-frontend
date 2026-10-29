<template>
  <AdminShell title="Keamanan Akun" description="Autentikator, recovery code, dan sesi login admin">
    <p v-if="error" role="alert" class="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {{ error }}
      <button type="button" class="ml-2 underline" @click="load">Coba lagi</button>
    </p>
    <p v-if="loading" role="status" class="text-sm text-slate-500">Memuat…</p>

    <div v-else-if="security" class="grid gap-6 lg:grid-cols-2">
      <section class="rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="sec-account">
        <h2 id="sec-account" class="text-sm font-bold text-slate-800">Akun dan akses</h2>
        <dl class="mt-3 space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-slate-500">Role</dt>
            <dd class="font-semibold capitalize">{{ security.adminRole || 'tidak diketahui' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-slate-500">Login terakhir sebelum ini</dt>
            <dd data-testid="last-login" class="text-right">
              <template v-if="security.lastLogin">
                {{ formatDate(security.lastLogin.at) }}<br />
                <span class="text-xs text-slate-500"
                  >{{ security.lastLogin.ip || 'IP tidak tercatat' }} ·
                  {{ shortAgent(security.lastLogin.userAgent) }}</span
                >
              </template>
              <template v-else>Belum ada catatan sebelumnya</template>
            </dd>
          </div>
        </dl>
        <p class="mt-3 text-xs text-slate-500">
          Jika ada login yang bukan Anda, cabut sesi di bawah dan ganti password.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="sec-totp">
        <h2 id="sec-totp" class="text-sm font-bold text-slate-800">Autentikator (TOTP)</h2>
        <p class="mt-2 text-sm">
          Status:
          <strong :class="security.totpEnabled ? 'text-emerald-700' : 'text-amber-700'">{{
            security.totpEnabled ? 'Aktif' : 'Belum aktif'
          }}</strong>
        </p>
        <p class="mt-1 text-xs text-slate-500">
          Login belum meminta kode OTP. Mengaktifkan TOTP menyiapkan perangkat dan recovery code;
          mewajibkannya saat login adalah keputusan terpisah.
        </p>
        <p v-if="security.totpEnabled" class="mt-1 text-xs text-slate-500">
          Recovery code tersisa: {{ security.recoveryCodesRemaining }}
        </p>

        <div v-if="recoveryCodes.length" class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm font-semibold text-amber-900">Simpan recovery code ini sekarang</p>
          <p class="text-xs text-amber-800">Hanya ditampilkan sekali. Setiap kode berlaku satu kali.</p>
          <ul class="mt-2 grid grid-cols-2 gap-1 font-mono text-sm" data-testid="recovery-codes">
            <li v-for="item in recoveryCodes" :key="item">{{ item }}</li>
          </ul>
          <div class="mt-3 flex gap-2">
            <button type="button" class="rounded-lg border border-amber-300 px-3 py-1.5 text-xs" @click="copyCodes">
              Salin
            </button>
            <button type="button" class="rounded-lg bg-amber-600 px-3 py-1.5 text-xs text-white" @click="recoveryCodes = []">
              Sudah saya simpan
            </button>
          </div>
        </div>

        <div v-if="!security.totpEnabled && !setup" class="mt-4">
          <button type="button" class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white" :disabled="busy" @click="startSetup">
            Siapkan autentikator
          </button>
        </div>

        <form v-if="setup" class="mt-4 space-y-3" @submit.prevent="activate">
          <img :src="setup.qrCode" alt="QR code autentikator" class="h-44 w-44 rounded-lg border border-slate-200" />
          <details>
            <summary class="cursor-pointer text-xs text-slate-500">Tidak bisa scan? Masukkan manual</summary>
            <p class="mt-1 break-all rounded bg-slate-50 px-3 py-2 font-mono text-xs select-all">{{ setup.secret }}</p>
          </details>
          <label class="block text-sm font-medium text-slate-700" for="totp-activate">Kode 6 digit dari autentikator</label>
          <input id="totp-activate" v-model="code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required autocomplete="one-time-code" class="w-40 rounded-lg border border-slate-300 px-3 py-2 text-center tracking-widest" />
          <div>
            <button type="submit" class="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60" :disabled="busy || code.length !== 6">
              Aktifkan
            </button>
          </div>
        </form>

        <form v-if="security.totpEnabled" class="mt-4 space-y-3 border-t border-slate-100 pt-4" @submit.prevent>
          <p class="text-sm font-medium text-slate-700">Ganti perangkat atau buat ulang recovery code</p>
          <label class="block text-xs text-slate-600" for="proof-code">Kode OTP saat ini</label>
          <input id="proof-code" v-model="proof.code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" class="w-40 rounded-lg border border-slate-300 px-3 py-2" />
          <label class="block text-xs text-slate-600" for="proof-recovery">atau satu recovery code</label>
          <input id="proof-recovery" v-model="proof.recoveryCode" autocomplete="off" class="w-64 rounded-lg border border-slate-300 px-3 py-2 font-mono" />
          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm" :disabled="busy" @click="regenerate">
              Buat ulang recovery code
            </button>
            <button type="button" class="rounded-lg border border-rose-300 px-3 py-2 text-sm text-rose-700" :disabled="busy" @click="disable">
              Nonaktifkan TOTP
            </button>
          </div>
        </form>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2" aria-labelledby="sec-sessions">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 id="sec-sessions" class="text-sm font-bold text-slate-800">Sesi aktif</h2>
          <button v-if="otherSessions" type="button" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs" :disabled="busy" @click="revokeOthers">
            Cabut semua sesi lain
          </button>
        </div>
        <ul class="mt-3 divide-y divide-slate-100" data-testid="sessions">
          <li v-for="session in security.sessions" :key="session.id" class="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
            <div>
              <p class="font-medium">
                {{ shortAgent(session.userAgent) }}
                <span v-if="session.current" class="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">Sesi ini</span>
              </p>
              <p class="text-xs text-slate-500">
                {{ session.ip || 'IP tidak tercatat' }} · masuk {{ formatDate(session.createdAt) }} · aktif terakhir {{ formatDate(session.lastSeenAt) }}
              </p>
            </div>
            <button v-if="!session.current" type="button" class="rounded-lg border border-rose-300 px-3 py-1.5 text-xs text-rose-700" :disabled="busy" @click="revoke(session)">
              Cabut
            </button>
          </li>
        </ul>
      </section>
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  activateAdminTotp,
  disableAdminTotp,
  fetchAdminSecurity,
  regenerateRecoveryCodes,
  revokeAdminSession,
  revokeOtherAdminSessions,
  setupAdminTotp,
} from '@/api/adminSecurity.js'

const toast = useToast()
const security = ref(null)
const loading = ref(true)
const busy = ref(false)
const error = ref('')
const setup = ref(null)
const code = ref('')
const recoveryCodes = ref([])
const proof = reactive({ code: '', recoveryCode: '' })

const otherSessions = computed(() => (security.value?.sessions || []).some((item) => !item.current))

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB'
    : '-'

function shortAgent(agent) {
  if (!agent) return 'Perangkat tidak dikenal'
  const browser = /(Edg|Chrome|Firefox|Safari)\//.exec(agent)?.[1] || 'Browser'
  const os = /(Windows|Mac OS X|Android|iPhone|iPad|Linux)/.exec(agent)?.[1] || ''
  return `${browser === 'Edg' ? 'Edge' : browser}${os ? ' di ' + os.replace('Mac OS X', 'macOS') : ''}`
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    security.value = await fetchAdminSecurity()
  } catch (e) {
    error.value = e.message || 'Status keamanan belum dapat dimuat.'
  } finally {
    loading.value = false
  }
}

const proofPayload = () => ({
  code: proof.code || undefined,
  recoveryCode: proof.recoveryCode || undefined,
})

async function run(action, success) {
  if (busy.value) return
  busy.value = true
  try {
    const result = await action()
    if (success) toast.success(success)
    return result
  } catch (e) {
    toast.error(e.message || 'Tindakan gagal')
  } finally {
    busy.value = false
  }
}

async function startSetup() {
  const result = await run(() => setupAdminTotp())
  if (result) setup.value = result
}

async function activate() {
  const result = await run(() => activateAdminTotp(code.value), 'Autentikator aktif')
  if (!result) {
    code.value = ''
    return
  }
  recoveryCodes.value = result.recoveryCodes || []
  setup.value = null
  code.value = ''
  await load()
}

async function regenerate() {
  const result = await run(() => regenerateRecoveryCodes(proofPayload()), 'Recovery code baru dibuat')
  if (!result) return
  recoveryCodes.value = result.recoveryCodes || []
  proof.code = proof.recoveryCode = ''
  await load()
}

async function disable() {
  const { isConfirmed } = await Swal.fire({
    title: 'Nonaktifkan TOTP?',
    text: 'Anda perlu menyiapkan ulang autentikator untuk perangkat baru.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Nonaktifkan',
    cancelButtonText: 'Batal',
  })
  if (!isConfirmed) return
  const result = await run(() => disableAdminTotp(proofPayload()), 'TOTP dinonaktifkan')
  if (result) {
    proof.code = proof.recoveryCode = ''
    await load()
  }
}

async function revoke(session) {
  if (await run(() => revokeAdminSession(session.id), 'Sesi dicabut')) await load()
}

async function revokeOthers() {
  if (await run(() => revokeOtherAdminSessions(), 'Sesi lain dicabut')) await load()
}

async function copyCodes() {
  try {
    await navigator.clipboard.writeText(recoveryCodes.value.join('\n'))
    toast.success('Recovery code disalin')
  } catch {
    toast.error('Tidak dapat menyalin; salin manual dari daftar.')
  }
}

onMounted(load)
</script>
