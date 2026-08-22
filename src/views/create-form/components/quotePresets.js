// Religion catalogue + quote presets, extracted verbatim from QuoteSection.vue
// (moved, not reworded). Single source of truth for religion ids, names,
// icons, and preset quotes — no other module should redeclare these.

export const DEFAULT_RELIGION = 'islam'

export const RELIGIONS = [
  { id: 'islam', name: 'Islam', icon: '🕌' },
  { id: 'kristen', name: 'Kristen', icon: '⛪' },
  { id: 'katolik', name: 'Katolik', icon: '✝️' },
  { id: 'hindu', name: 'Hindu', icon: '🕉️' },
  { id: 'budha', name: 'Buddha', icon: '☸️' },
  { id: 'umum', name: 'Umum', icon: '📜' },
]

export const RELIGION_IDS = RELIGIONS.map((r) => r.id)

export const QUOTE_PRESETS = {
  islam: [
    {
      text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      source: "QS. Ar-Rum: 21"
    },
    {
      text: "Maha Suci Allah yang telah menciptakan semuanya berpasang-pasangan, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka sendiri, maupun dari apa yang tidak mereka ketahui.",
      source: "QS. Yasin: 36"
    },
    {
      text: "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).",
      source: "QS. Az-Zariyat: 49"
    }
  ],
  kristen: [
    {
      text: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Ia tidak pemarah dan tidak menyimpan kesalahan orang lain.",
      source: "1 Korintus 13:4-5"
    },
    {
      text: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.",
      source: "Matius 19:6"
    },
    {
      text: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
      source: "Kolose 3:14"
    }
  ],
  katolik: [
    {
      text: "Sehati sepikirlah kamu, dan hiduplah dalam perdamaian; maka Allah sumber kasih dan damai sejahtera akan menyertai kamu.",
      source: "2 Korintus 13:11"
    },
    {
      text: "Hendaklah kamu selalu rendah hati, lemah lembut, dan sabar. Tunjukkanlah kasihmu dalam saling membantu.",
      source: "Efesus 4:2"
    },
    {
      text: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
      source: "Kolose 3:14"
    }
  ],
  hindu: [
    {
      text: "Moga-moga saja kalian (suami-istri) menghayati cinta kasih yang mesra, tidak pernah berpisah, dan moga-moga saja kalian berdua panjang umur dan hidup bahagia bersama anak-anak serta cucu-cucu kalian di rumah kalian sendiri.",
      source: "Rigveda Samhita, X. 85. 42"
    },
    {
      text: "Aku menerima engkau sebagai istriku demi kemakmuran dan kebahagiaan kita bersama. Moga-moga engkau hidup bersamaku sampai hari tua atas restu para Dewa.",
      source: "Rigveda Samhita, X. 85. 36"
    },
    {
      text: "Ya Tuhan Yang Maha Pengasih, ikatlah kami (suami-istri) dalam ikatan pernikahan yang teguh, agar kami selalu hidup bersama dalam kesetiaan dan kebahagiaan.",
      source: "Atharvaveda, XIV. 1. 50"
    }
  ],
  budha: [
    {
      text: "Bila dua orang memiliki keyakinan (Saddha), kemoralan (Sila), kemurahan hati (Caga), dan kebijaksanaan (Panna) yang setara, maka mereka akan dapat saling memahami dan hidup bahagia bersama, baik di kehidupan ini maupun kehidupan selanjutnya.",
      source: "Anguttara Nikaya 4.55"
    },
    {
      text: "Saling mencintai, saling menghormati, dan saling membantu dalam kesukaran adalah jalan menuju kebahagiaan sejati dalam kehidupan berumah tangga.",
      source: "Dhammapada"
    }
  ],
  umum: [
    {
      text: "Aku ingin mencintaimu dengan sederhana: dengan kata yang tak sempat diucapkan kayu kepada api yang menjadikannya abu. Aku ingin mencintaimu dengan sederhana: dengan isyarat yang tak sempat disampaikan awan kepada hujan yang menjadikannya tiada.",
      source: "Sapardi Djoko Damono"
    },
    {
      text: "Cinta tidak terlihat dengan mata, tetapi dengan hati.",
      source: "William Shakespeare"
    },
    {
      text: "Dalam cinta sejati, jarak terkecil pun terlalu jauh, dan jarak terjauh pun bisa dijembatani.",
      source: "Hans Nouwens"
    }
  ]
}

const LEGACY_RELIGION_ALIASES = {
  bebas: 'umum',
}

/**
 * null/''/undefined/unknown -> DEFAULT_RELIGION. Legacy 'bebas' -> 'umum'.
 * Never throws. Never writes back to formData — display-only fallback.
 */
export function normalizeReligion(value) {
  if (!value) return DEFAULT_RELIGION
  const aliased = LEGACY_RELIGION_ALIASES[value] || value
  return RELIGION_IDS.includes(aliased) ? aliased : DEFAULT_RELIGION
}

/** Always a non-empty array. */
export function presetsFor(religion) {
  return QUOTE_PRESETS[normalizeReligion(religion)] || QUOTE_PRESETS[DEFAULT_RELIGION]
}

/** First preset of the (normalized) religion. -> { text, source } */
export function defaultQuoteFor(religion) {
  return presetsFor(religion)[0]
}

/**
 * The single source of truth for what gets sent to the API / live preview.
 * quoteType === 'default' -> { quoteText, quoteSource } from defaultQuoteFor(formData.religion)
 * otherwise               -> { quoteText: formData.quote || '', quoteSource: formData.quoteSource || '' }
 * Tolerates a partial/undefined formData without throwing.
 */
export function resolveQuoteForSave(formData) {
  const data = formData || {}
  if (data.quoteType === 'default') {
    const preset = defaultQuoteFor(data.religion)
    return { quoteText: preset.text, quoteSource: preset.source }
  }
  return {
    quoteText: data.quote || '',
    quoteSource: data.quoteSource || '',
  }
}
