# Rencana: Perombakan Dashboard User (Mobile-First) - Tahap Lanjutan

## Latar Belakang
Setelah sukses merombak navigasi utama dan halaman ringkasan, ditemukan bahwa beberapa halaman fungsional seperti **Settings**, **Guestbook**, dan **Templates** masih menggunakan desain lama yang kaku (desktop-centric). Hal ini merusak pengalaman pengguna (UX) saat mengakses fitur-fitur penting lewat HP.

## Tujuan
Memastikan seluruh ekosistem dashboard user 100% responsive, ramah jempol, dan memiliki bahasa visual yang konsisten (modern & app-like).

---

## 1. Daftar Halaman yang Perlu Perbaikan (Audit UX)

### A. Pengaturan (SettingsView.vue)
- **Isu**: Form input terlalu lebar, label kurang jelas di mobile, dan aksi simpan tidak berada di area jangkauan jempol.
- **Solusi**: 
  - Gunakan layout satu kolom yang rapat.
  - Perbesar input field (minimal height 44px).
  - Tambahkan visual feedback (ikon) pada setiap kategori pengaturan (Profil, Akun, Keamanan).
  - Implementasi `BottomNav` dan padding bawah yang cukup.

### B. Buku Tamu / Ucapan (GuestbookView.vue)
- **Isu**: Tabel ucapan pecah di layar kecil, aksi hapus/balas terlalu kecil untuk dipencet.
- **Solusi**:
  - Bungkus tabel dalam horizontal scroll container.
  - Ganti tampilan tabel menjadi "Card List" khusus untuk mobile (opsional/fase 2).
  - Tambahkan padding `pb-20` agar konten terakhir tidak tertutup `BottomNav`.

### C. Galeri Template (TemplatesView.vue)
- **Isu**: Grid template (3 atau 4 kolom) membuat gambar preview jadi terlalu kecil di mobile.
- **Solusi**:
  - Ubah grid menjadi 1 kolom (full width) atau 2 kolom yang bersih di mobile.
  - Tambahkan efek "Tap to Preview" yang lebih responsif.

---

## 2. Strategi Implementasi (Rewrite Plan)

### Tahap 3: Transformasi Form & Pengaturan (Settings)
- [ ] Refactor `SettingsView.vue` menggunakan `md:ml-64` yang dinamis.
- [ ] Implementasi `BottomNav` di halaman Settings.
- [ ] Re-layout form menjadi section-based dengan kartu-kartu yang bersih.

### Tahap 4: Optimasi Data & Tabel (Guestbook)
- [ ] Update `GuestbookView.vue` agar konsisten dengan layout dashboard baru.
- [ ] Pastikan tabel ucapan bisa di-scroll horizontal tanpa merusak layout header.
- [ ] Poles tombol aksi (Hapus/Edit) agar lebih finger-friendly.

### Tahap 5: Final Polish & Konsistensi Global
- [ ] Cek ulang semua modal (Pop-up) agar menggunakan animasi `slide-up` di mobile.
- [ ] Pastikan semua halaman memiliki padding bawah (`pb-20`) untuk menghindari konflik dengan `BottomNav`.
- [ ] Verifikasi build akhir untuk memastikan tidak ada konflik Tailwind v4.

---

## 3. Catatan Teknis
- **Z-Index**: Pastikan `BottomNav` selalu di atas modal (z-50).
- **Sticky Actions**: Pertimbangkan tombol "Simpan" yang lengket (sticky) di bawah layar pada halaman form panjang.
- **Font-Scaling**: Pastikan font size tidak turun di bawah 12px untuk keterbacaan optimal di outdoor.
