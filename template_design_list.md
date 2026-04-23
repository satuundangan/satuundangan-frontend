# Daftar Template dan Komponen Undangan

Dokumen ini berisi daftar template yang tersedia di frontend dan komponen (sections) yang didukung berdasarkan data seed database (`production_seed.sql`) dan implementasi frontend.

## Master Komponen (Sections)
Berikut adalah daftar komponen global yang tersedia di sistem:

| Key | Nama Komponen | Deskripsi |
|-----|---------------|-----------|
| `hero` | Header / Hero | Tampilan awal undangan |
| `couple` | Profil Pasangan | Foto dan nama mempelai |
| `event` | Detail Acara & Lokasi | Waktu dan Maps (Google Maps) |
| `gallery` | Galeri Foto | Kumpulan foto prewedding |
| `rsvp` | Konfirmasi Kehadiran | Form RSVP tamu |
| `love-story` | Cerita Cinta | Timeline perjalanan cinta |
| `gift` | Amplop Digital | QRIS / Rekening Bank |
| `music` | Musik Latar | Background audio (Auto-play) |
| `video` | Video Prewedding | Embed YouTube video |
| `menu` | Menu Hidangan | Daftar makanan di acara |
| `prokes` | Protokol Kesehatan | Informasi protokol COVID-19/Kesehatan |
| `extended-family` | Turut Mengundang | Daftar nama keluarga besar |
| `live-streaming` | Live Streaming | Tombol join Zoom/YouTube |
| `dress-code` | Dress Code | Informasi tema busana tamu |

---

## Daftar Template & Komponen Default

### 1. Dark Elegant (`dark-elegant`)
- **Kategori:** Basic (Paid)
- **Komponen Default:**
  - `hero`, `couple`, `event`, `gallery`, `rsvp`, `music`

### 2. Light Modern (`light-modern`)
- **Kategori:** Basic (Paid)
- **Komponen Default:**
  - `hero`, `couple`, `event`, `gallery`, `rsvp`, `music`

### 3. Botanical Watercolor (`botanical-watercolor`)
- **Kategori:** Premium (IDR 50,000)
- **Komponen Default:**
  - `hero`, `couple`, `event`, `gallery`, `rsvp`, `music`, `love-story`

### 4. Royal Gold Heritage (`royal-gold`)
- **Kategori:** Premium (IDR 75,000)
- **Komponen Default:**
  - `hero`, `couple`, `event`, `gallery`, `rsvp`, `gift`

### 5. Minimalist Sand & Terra (`minimalist-terra`)
- **Kategori:** Premium (IDR 50,000)
- **Komponen Default:**
  - `hero`, `couple`, `event`, `gallery`, `rsvp`, `prokes`

### 6. Celestial Sparkle (`celestial-sparkle`)
- **Kategori:** Exclusive (IDR 100,000)
- **Komponen Default:**
  - `hero`, `couple`, `event`, `gallery`, `rsvp`, `video`

### 7. The Editorial Story (`editorial-magazine`)
- **Kategori:** Exclusive (IDR 150,000)
- **Komponen Default:**
  - `hero`, `couple`, `event`, `gallery`, `rsvp`, `menu`

### 8. Zen Tranquility (`zen-tranquility`)
- **Kategori:** Premium (IDR 75,000)
- **Komponen Default:**
  - `hero`, `couple`, `love-story`, `event`, `gallery`, `rsvp`, `music`

### 9. Retro Nostalgia (`retro-nostalgia`)
- **Kategori:** Premium (IDR 75,000)
- **Komponen Default:**
  - `hero`, `couple`, `love-story`, `event`, `gallery`, `rsvp`, `music`

### 10. Modern Noir (`modern-noir`)
- **Kategori:** Exclusive (IDR 150,000)
- **Komponen Default:**
  - `hero`, `couple`, `love-story`, `event`, `gallery`, `rsvp`, `music`, `live-streaming`

### 11. Azure Shores (`azure-shores`)
- **Kategori:** Exclusive (IDR 150,000)
- **Komponen Default:**
  - `hero`, `couple`, `love-story`, `event`, `gallery`, `rsvp`, `music`, `dress-code`

### 12. Cyberpunk Neon (`cyberpunk-neon`)
- **Kategori:** Exclusive (IDR 150,000)
- **Komponen Default:**
  - `hero`, `couple`, `love-story`, `event`, `gallery`, `rsvp`, `music`, `extended-family`

---

## Catatan untuk Sinkronisasi Database:
1. Pastikan tabel `master_sections` di database memiliki key yang sesuai dengan kolom **Key** di atas.
2. Saat user membuat undangan, `selectedSections` di frontend harus mengirimkan array berisi key-key di atas.
3. Backend harus memproses `selectedSections` dan menyimpannya ke tabel relasi (misal `invitation_sections`) agar frontend bisa mem-filter komponen mana yang harus di-render.
