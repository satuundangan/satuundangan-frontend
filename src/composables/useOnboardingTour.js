import { ref } from 'vue'

export const STORAGE_KEY_STUDIO = 'satuundangan_studio_tour_done'
export const STORAGE_KEY_DASHBOARD = 'satuundangan_dashboard_tour_done'

export function isStudioTourDone() {
  try {
    return localStorage.getItem(STORAGE_KEY_STUDIO) === 'true'
  } catch {
    return false
  }
}

export function isDashboardTourDone() {
  try {
    return localStorage.getItem(STORAGE_KEY_DASHBOARD) === 'true'
  } catch {
    return false
  }
}

export function setStudioTourDone(done = true) {
  try {
    localStorage.setItem(STORAGE_KEY_STUDIO, done ? 'true' : 'false')
  } catch {
    // Ignore localStorage errors (e.g. private mode quota)
  }
}

export function setDashboardTourDone(done = true) {
  try {
    localStorage.setItem(STORAGE_KEY_DASHBOARD, done ? 'true' : 'false')
  } catch {
    // Ignore localStorage errors
  }
}

export function resetTourState() {
  try {
    localStorage.removeItem(STORAGE_KEY_STUDIO)
    localStorage.removeItem(STORAGE_KEY_DASHBOARD)
  } catch {
    // Ignore
  }
}

export const isTourActive = ref(false)

/**
 * Custom Driver.js options tailored for SatuUndangan luxury aesthetic
 */
const DEFAULT_DRIVER_CONFIG = {
  animate: true,
  overlayColor: 'rgba(28, 20, 15, 0.72)',
  overlayOpacity: 0.72,
  stagePadding: 6,
  stageRadius: 18,
  allowClose: true,
  skipMissingElement: true,
  showProgress: true,
  progressText: 'Langkah {{current}} dari {{total}}',
  nextBtnText: 'Lanjut →',
  prevBtnText: '← Kembali',
  doneBtnText: 'Selesai ✓',
  popoverClass: 'satuundangan-tour-popover',
}

/**
 * Creates and runs the Studio Editor interactive walkthrough
 */
export async function startStudioTour(options = {}) {
  const { force = false } = options

  if (!force && isStudioTourDone()) {
    return null
  }

  // Dynamic import for zero bundle impact on initial page load
  const { driver } = await import('driver.js')
  await import('driver.js/dist/driver.css')

  const steps = [
    {
      element: '[data-tour="studio-tabs"]',
      popover: {
        title: '1. Navigasi 5 Tab Editor',
        description:
          'Undanganmu dibagi menjadi 5 bagian: Pilih Komponen, Biodata Mempelai, Momen Acara, Galeri & Musik, dan Ekstra/Amplop. Klik tab untuk berpindah bagian.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="studio-form-panel"]',
      popover: {
        title: '2. Formulir Biodata & Konten',
        description:
          'Isi biodata kedua mempelai, kutipan ayat, jadwal acara, serta unggah foto. Foto dapat dipotong (crop) langsung di peramban ini.',
        side: 'right',
        align: 'center',
      },
    },
    {
      element: '[data-tour="studio-preview-frame"]',
      popover: {
        title: '3. Pratinjau Interaktif Real-time',
        description:
          'Layar ponsel tiruan ini menampilkan hasil undangan secara langsung. Setiap ketikan dan foto langsung tampil seketika!',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '[data-tour="studio-save-action"]',
      popover: {
        title: '4. Draf Tersimpan Aman',
        description:
          'Drafmu otomatis tersimpan di peramban ini. Klik tombol "Simpan" kapan saja untuk menyimpan perubahan dan melangkah ke tahap sebar undangan.',
        side: 'bottom',
        align: 'end',
      },
    },
  ]

  const driverObj = driver({
    ...DEFAULT_DRIVER_CONFIG,
    steps,
    onDestroyed: () => {
      isTourActive.value = false
      setStudioTourDone(true)
    },
    onDoneClick: () => {
      setStudioTourDone(true)
      driverObj.destroy()
    },
  })

  isTourActive.value = true
  driverObj.drive()
  return driverObj
}

/**
 * Creates and runs the Dashboard Cockpit interactive walkthrough
 */
export async function startDashboardTour(options = {}) {
  const { force = false } = options

  if (!force && isDashboardTourDone()) {
    return null
  }

  const { driver } = await import('driver.js')
  await import('driver.js/dist/driver.css')

  const steps = [
    {
      element: '[data-tour="dashboard-invitations-card"]',
      popover: {
        title: '1. Undangan Digital Kamu',
        description:
          'Pantau status undangan (Draft / Aktif), salin tautan website undangan, edit kembali di Studio, atau buka pratinjau publik.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '[data-tour="dashboard-action-guests"]',
      popover: {
        title: '2. Personalisasi Nama Tamu',
        description:
          'Masukkan daftar tamu undanganmu di sini agar setiap tamu memiliki link unik dengan sapaan personal ("Kepada Yth. Bapak/Ibu...").',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '[data-tour="dashboard-action-planner"]',
      popover: {
        title: '3. Wedding Planner Terintegrasi',
        description:
          'Gunakan Wedding Planner untuk menyusun kalkulator anggaran pernikahan, daftar checklist persiapan (H-180 hingga Hari H), dan kontak vendor.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '[data-tour="dashboard-action-reception"]',
      popover: {
        title: '4. Meja Resepsi & Standee QR',
        description:
          'Cetak Standee QR untuk meja penerima tamu fisik, dan gunakan kamera HP panitia untuk memindai tiket kedatangan tamu di Hari H.',
        side: 'top',
        align: 'center',
      },
    },
  ]

  const driverObj = driver({
    ...DEFAULT_DRIVER_CONFIG,
    steps,
    onDestroyed: () => {
      isTourActive.value = false
      setDashboardTourDone(true)
    },
    onDoneClick: () => {
      setDashboardTourDone(true)
      driverObj.destroy()
    },
  })

  isTourActive.value = true
  driverObj.drive()
  return driverObj
}

export function useOnboardingTour() {
  return {
    isTourActive,
    isStudioTourDone,
    isDashboardTourDone,
    setStudioTourDone,
    setDashboardTourDone,
    resetTourState,
    startStudioTour,
    startDashboardTour,
  }
}
