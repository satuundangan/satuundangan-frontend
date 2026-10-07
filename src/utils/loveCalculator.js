/**
 * Love & Weton Calculator Core Logic
 * Pure, isolated calculation helpers for SatuUndangan viral love & weton tools.
 */

// 7 Hari Saptawara (Day of Week)
export const DINO_DATA = [
  { name: 'Minggu', alias: 'Sunday', neptu: 5, index: 0 },
  { name: 'Senin', alias: 'Monday', neptu: 4, index: 1 },
  { name: 'Selasa', alias: 'Tuesday', neptu: 3, index: 2 },
  { name: 'Rabu', alias: 'Wednesday', neptu: 7, index: 3 },
  { name: 'Kamis', alias: 'Thursday', neptu: 8, index: 4 },
  { name: 'Jumat', alias: 'Friday', neptu: 6, index: 5 },
  { name: 'Sabtu', alias: 'Saturday', neptu: 9, index: 6 },
]

export const DINO_MAP = {
  minggu: 5,
  sunday: 5,
  senin: 4,
  monday: 4,
  selasa: 3,
  tuesday: 3,
  rabu: 7,
  wednesday: 7,
  kamis: 8,
  thursday: 8,
  jumat: 6,
  friday: 6,
  sabtu: 9,
  saturday: 9,
}

// 5 Pasaran Pancawara
export const PASARAN_DATA = [
  { name: 'Legi', neptu: 5, meaning: 'Luwes, manis budi, ramah dan bijaksana.' },
  { name: 'Pahing', neptu: 9, meaning: 'Berani, bersemangat, mandiri, dan berwibawa.' },
  { name: 'Pon', neptu: 7, meaning: 'Teguh pendirian, berjiwa pemimpin, dan setia.' },
  { name: 'Wage', neptu: 4, meaning: 'Tenang, teliti, hemat, dan tekun bekerja.' },
  { name: 'Kliwon', neptu: 8, meaning: 'Penuh welas asih, pengayom, dan pemaaf.' },
]

export const PASARAN_MAP = {
  legi: 5,
  pahing: 9,
  pon: 7,
  wage: 4,
  kliwon: 8,
}

/**
 * Modulo 8 Categorization:
 * 1: Pegat
 * 2: Ratu
 * 3: Jodoh
 * 4: Topo
 * 5: Tinari
 * 6: Padu
 * 7: Sujanan
 * 0 (or 8): Pesthi
 */
export const MODULO_8_NAMES = {
  1: 'Pegat',
  2: 'Ratu',
  3: 'Jodoh',
  4: 'Topo',
  5: 'Tinari',
  6: 'Padu',
  7: 'Sujanan',
  0: 'Pesthi',
  8: 'Pesthi',
}

export const PRIMBON_CATEGORIES = {
  1: {
    name: 'Pegat',
    remainder: 1,
    title: 'Pegat (Ujian Kedewasaan & Komunikasi)',
    score: 80,
    pillClass: 'bg-rose-100 text-rose-800',
    bgClass: 'bg-rose-50/50 border-rose-200/80',
    accentColor: 'text-rose-600',
    icon: 'fa-solid fa-heart-crack',
    traditionalMeaning:
      'Secara harfiah dalam primbon klasik, Pegat menandakan potensi gesekan ego, masalah perbedaan pendapat, atau ujian ekonomi yang menuntut kesabaran ekstra.',
    modernWisdom:
      'Dalam filosofi modern SatuUndangan, Pegat bukanlah penghalang jodoh, melainkan pengingat luhur agar kalian berdua melatih komunikasi terbuka tanpa gengsi serta menyusun anggaran keuangan keluarga yang rapi sejak awal. Pasangan yang saling merendahkan ego terbukti menjadi rumah tangga paling tangguh.',
    keyTakeaway: 'Keterbukaan emosi, saling memaafkan, dan manajemen finansial bersama.',
  },
  2: {
    name: 'Ratu',
    remainder: 2,
    title: 'Ratu (Jodoh Sakral & Dihormati)',
    score: 98,
    pillClass: 'bg-amber-100 text-amber-900',
    bgClass: 'bg-amber-50/50 border-amber-200/80',
    accentColor: 'text-amber-600',
    icon: 'fa-solid fa-crown',
    traditionalMeaning:
      'Pasangan ini diibaratkan raja dan ratu; sangat disegani, dihormati oleh keluarga besar serta lingkungan masyarakat, dan dipandang berwibawa.',
    modernWisdom:
      'Kalian adalah pasangan panutan yang memancarkan aura positif. Tetaplah rendah hati, ramah, dan jadikan pernikahan kalian sebagai ladang kebaikan yang mengayomi sesama keluarga.',
    keyTakeaway: 'Menjaga nama baik keluarga dan terus saling memuliakan pasangan.',
  },
  3: {
    name: 'Jodoh',
    remainder: 3,
    title: 'Jodoh (Saling Melengkapi & Rukun Sejati)',
    score: 99,
    pillClass: 'bg-emerald-100 text-emerald-900',
    bgClass: 'bg-emerald-50/50 border-emerald-200/80',
    accentColor: 'text-emerald-600',
    icon: 'fa-solid fa-rings-wedding',
    traditionalMeaning:
      'Pertemuan dua jiwa yang memang digariskan saling melengkapi. Kekurangan yang satu ditutup oleh kelebihan pasangannya secara harmonis.',
    modernWisdom:
      'Kalian memiliki kecocokan alami lahir dan batin. Rawatlah keindahan cinta ini dengan apresiasi harian, quality time, dan terus bersyukur atas kehadiran satu sama lain.',
    keyTakeaway: 'Saling menerima ketidaksempurnaan dan merayakan cinta setiap hari.',
  },
  4: {
    name: 'Topo',
    remainder: 4,
    title: 'Topo (Kerja Keras Membawa Kejayaan)',
    score: 86,
    pillClass: 'bg-blue-100 text-blue-900',
    bgClass: 'bg-blue-50/50 border-blue-200/80',
    accentColor: 'text-blue-600',
    icon: 'fa-solid fa-mountain',
    traditionalMeaning:
      'Menghadapi proses perjuangan atau adaptasi di awal pernikahan, namun perlahan tapi pasti berbuah kemapanan, kemuliaan, dan kebahagiaan sejati.',
    modernWisdom:
      'Jadikan masa-masa adaptasi di awal pernikahan sebagai pembentuk ikatan batin yang tak tergoyahkan. Kalian adalah rekan tim sejati; setiap ikhtiar bersama akan membuahkan hasil manis.',
    keyTakeaway: 'Kekompakan tim, saling mendukung karir, dan pantang menyerah.',
  },
  5: {
    name: 'Tinari',
    remainder: 5,
    title: 'Tinari (Limpahan Rezeki & Keberuntungan)',
    score: 96,
    pillClass: 'bg-amber-100 text-amber-900',
    bgClass: 'bg-amber-50/50 border-amber-200/80',
    accentColor: 'text-amber-600',
    icon: 'fa-solid fa-coins',
    traditionalMeaning:
      'Mendapat kemudahan dalam mencari sandang pangan dan rezeki, sering memperoleh keberuntungan tak terduga dalam membina rumah tangga.',
    modernWisdom:
      'Pernikahan kalian membawa pintu rezeki yang lapang. Imbangi kemudahan ini dengan gemar berbagi, bersedekah, dan saling menjaga rasa syukur agar berkah senantiasa berlipat ganda.',
    keyTakeaway: 'Bersyukur, gemar berbagi, dan pengelolaan harta yang bijaksana.',
  },
  6: {
    name: 'Padu',
    remainder: 6,
    title: 'Padu (Dinamis & Penuh Bumbu Cinta)',
    score: 82,
    pillClass: 'bg-orange-100 text-orange-900',
    bgClass: 'bg-orange-50/50 border-orange-200/80',
    accentColor: 'text-orange-600',
    icon: 'fa-solid fa-bolt',
    traditionalMeaning:
      'Sering diwarnai perdebatan kecil seputar hal sepele, namun tidak sampai merusak ikatan cinta dan biasanya cepat baikan kembali.',
    modernWisdom:
      'Perbedaan selera atau gaya bicara justru menjadi bumbu yang menghidupkan suasana. Terapkan prinsip emas: jangan tidur sebelum berbaikan dan selesaikan perbedaan dengan pelukan hangat.',
    keyTakeaway: 'Jangan membesar-besarkan hal kecil dan selalu utamakan pelukan damai.',
  },
  7: {
    name: 'Sujanan',
    remainder: 7,
    title: 'Sujanan (Ujian Kesetiaan & Komitmen)',
    score: 81,
    pillClass: 'bg-purple-100 text-purple-900',
    bgClass: 'bg-purple-50/50 border-purple-200/80',
    accentColor: 'text-purple-600',
    icon: 'fa-solid fa-eye',
    traditionalMeaning:
      'Mengisyaratkan pentingnya menjaga batas pergaulan dan waspada terhadap potensi rasa cemburu atau pihak ketiga yang menguji kesetiaan.',
    modernWisdom:
      'Jadikan ini sebagai motivasi untuk membangun transparansi total tanpa rahasia. Buat batasan yang sehat dengan dunia luar dan selalu prioritaskan perasaan pasangan di atas segalanya.',
    keyTakeaway: 'Transparansi penuh, saling menjaga rasa percaya, dan apresiasi kesetiaan.',
  },
  8: {
    name: 'Pesthi',
    remainder: 8,
    title: 'Pesthi (Ayem Tentrem Hingga Akhir Hayat)',
    score: 99,
    pillClass: 'bg-emerald-100 text-emerald-900',
    bgClass: 'bg-emerald-50/50 border-emerald-200/80',
    accentColor: 'text-emerald-600',
    icon: 'fa-solid fa-dove',
    traditionalMeaning:
      'Simbol ketenteraman sejati. Rumah tangga rukun, damai, dan adem ayem hingga hari tua tanpa goncangan besar.',
    modernWisdom:
      'Ketenangan batin adalah anugerah terbesar dalam berumah tangga. Jaga keharmonisan ini dengan saling menemani, menghormati, dan merawat cinta hingga akhir hayat.',
    keyTakeaway: 'Kedamaian hati, saling menghormati, dan kelembutan tutur kata.',
  },
}
// Alias remainder 0 to Pesthi (same as 8)
PRIMBON_CATEGORIES[0] = PRIMBON_CATEGORIES[8]

/**
 * Calculate Weton Neptu from Day (Dino) name and Pasaran name.
 * Example: calculateWetonNeptu('Minggu', 'Legi') -> 5 + 5 = 10
 * Example: calculateWetonNeptu('Sunday', 'Legi') -> 5 + 5 = 10
 */
export function calculateWetonNeptu(dayInput, pasaranInput) {
  const dayKey = String(dayInput || '').trim().toLowerCase()
  const pasaranKey = String(pasaranInput || '').trim().toLowerCase()

  const dayNeptu = DINO_MAP[dayKey]
  const pasaranNeptu = PASARAN_MAP[pasaranKey]

  if (dayNeptu === undefined || pasaranNeptu === undefined) {
    throw new Error(`Invalid Day ('${dayInput}') or Pasaran ('${pasaranInput}') name.`)
  }

  return dayNeptu + pasaranNeptu
}

/**
 * Modulo 8 categorization of total neptu.
 * Returns { remainder, name, category }
 * remainder is in 0..7 or 1..8 mapping:
 * 1: Pegat, 2: Ratu, 3: Jodoh, 4: Topo, 5: Tinari, 6: Padu, 7: Sujanan, 0: Pesthi
 */
export function getModulo8Category(totalNeptu) {
  const remainderRaw = ((Number(totalNeptu) % 8) + 8) % 8
  const remainderForDisplay = remainderRaw === 0 ? 8 : remainderRaw
  const name = MODULO_8_NAMES[remainderRaw]
  const category = PRIMBON_CATEGORIES[remainderForDisplay]

  return {
    remainder: remainderRaw,
    displayRemainder: remainderForDisplay,
    name,
    category,
  }
}

/**
 * Convert Gregorian YYYY-MM-DD date to Javanese Day & Pasaran weton object.
 */
export function calculateWetonFromDate(dateStr) {
  if (!dateStr) return null
  const parts = String(dateStr).split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null

  const [year, month, day] = parts
  const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))

  // Anchor: 1 Januari 2024 (Senin Pahing)
  const anchorDate = new Date(Date.UTC(2024, 0, 1, 12, 0, 0))
  const diffDays = Math.round((targetDate.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24))

  // Day of week: 0 = Minggu (Sunday), 1 = Senin, ...
  const dayIndex = targetDate.getUTCDay()
  const dino = DINO_DATA[dayIndex]

  // Pasaran: 1 Jan 2024 was Pahing (index 1 of [Legi, Pahing, Pon, Wage, Kliwon])
  const pasaranIndex = (((diffDays % 5) + 5) % 5 + 1) % 5
  const pasaran = PASARAN_DATA[pasaranIndex]

  const totalNeptu = dino.neptu + pasaran.neptu

  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))

  return {
    dino,
    pasaran,
    wetonName: `${dino.name} ${pasaran.name}`,
    neptu: totalNeptu,
    dateFormatted,
  }
}

/**
 * Calculate complete weton compatibility for a pair.
 */
export function calculateWetonPair(groomDob, brideDob, groomName = 'Calon Pria', brideName = 'Calon Wanita') {
  const groom = calculateWetonFromDate(groomDob)
  const bride = calculateWetonFromDate(brideDob)

  if (!groom || !bride) return null

  const totalNeptu = groom.neptu + bride.neptu
  const mod8 = getModulo8Category(totalNeptu)

  return {
    groomName,
    brideName,
    groom,
    bride,
    totalNeptu,
    remainder: mod8.remainder,
    displayRemainder: mod8.displayRemainder,
    categoryName: mod8.name,
    category: mod8.category,
  }
}

/**
 * Deterministic polynomial hash function for names.
 */
export function computeHash(str) {
  let hash = 0
  const s = String(str || '')
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * Calculate deterministic Love Chemistry percentage for a pair of names.
 * Ensures:
 * 1. Consistent score for same pair regardless of ordering ('A' & 'B' == 'B' & 'A').
 * 2. Case and whitespace insensitive.
 * 3. Score bounded strictly between 1% and 100% (default viral range 78% - 99%).
 */
export function calculateLoveScore(name1, name2) {
  const n1 = (name1 || '').trim()
  const n2 = (name2 || '').trim()
  if (!n1 || !n2) {
    return {
      score: 0,
      displayName1: n1,
      displayName2: n2,
      title: '',
      tagline: '',
      subScores: { comm: 0, romance: 0, teamwork: 0 },
    }
  }

  const clean1 = n1.toLowerCase().replace(/[^a-z0-9]/g, '')
  const clean2 = n2.toLowerCase().replace(/[^a-z0-9]/g, '')
  const combined = [clean1, clean2].sort().join('&')
  const baseHash = computeHash(combined)

  // Viral range: 78% to 99%, strictly bounded in [1, 100]
  const rawScore = 78 + (baseHash % 22)
  const finalScore = Math.max(1, Math.min(100, rawScore))

  const hashComm = computeHash(combined + '_comm')
  const hashRomance = computeHash(combined + '_romance')
  const hashTeam = computeHash(combined + '_team')

  const subScores = {
    comm: Math.max(1, Math.min(100, 80 + (hashComm % 19))),
    romance: Math.max(1, Math.min(100, 82 + (hashRomance % 18))),
    teamwork: Math.max(1, Math.min(100, 79 + (hashTeam % 20))),
  }

  let title = 'Soulmate Tak Terpisahkan'
  let tagline = 'Kalian berdua memiliki resonansi batin yang saling melengkapi dalam suka maupun duka.'

  if (finalScore >= 96) {
    title = 'Pasangan Jiwa Sejati (Twin Flames)'
    tagline = 'Frekuensi cinta kalian sangat langka dan sakral. Saling terikat erat secara batin & visi masa depan.'
  } else if (finalScore >= 92) {
    title = 'Dua Hati Satu Frekuensi (Harmoni Sempurna)'
    tagline = 'Candaan selalu nyambung, obrolan mengalir tanpa jeda, dan saling mengerti bahkan tanpa kata.'
  } else if (finalScore >= 87) {
    title = 'Soulmate Tak Terpisahkan (Saling Menggenapi)'
    tagline = 'Kekuatan terbesar kalian adalah menjadi tempat pulang paling tenang di kala lelah melanda.'
  } else if (finalScore >= 82) {
    title = 'Kisah Kasih Romantis & Hangat (Best Friends in Love)'
    tagline = 'Berangkat dari kenyamanan persahabatan tulus yang menjelma jadi komitmen cinta abadi.'
  } else {
    title = 'Dua Karakter Saling Menumbuhkan (Dynamic Duo)'
    tagline = 'Perbedaan karakter kalian justru jadi bumbu manis yang selalu memicu rasa kagum setiap hari.'
  }

  return {
    score: finalScore,
    displayName1: n1,
    displayName2: n2,
    title,
    tagline,
    subScores,
    hash: baseHash,
  }
}
