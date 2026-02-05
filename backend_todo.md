# Backend Development Requirements - SatuUndangan

Daftar penyesuaian API untuk mendukung fitur frontend terbaru.

## 🔑 Authentication & Profile
- [ ] **Google Auth Callback:** Pastikan setelah login berhasil, redirect ke frontend menyertakan token yang valid.
- [ ] **User Profile Data:** Tambahkan field `photo` atau `avatar` pada response `GET /auth/profile` agar dashboard tidak menampilkan gambar default acak.

## 💌 Invitations API
- [ ] **Draft/Resume Logic:** 
    - Sediakan endpoint atau pastikan `GET /invitations` bisa membedakan mana undangan yang masih "draft" vs "published".
    - Frontend perlu cara cepat untuk cek apakah user punya progres terakhir yang belum selesai.
- [ ] **Quote Data Structure:** 
    - Update schema/database tabel `invitations`. 
    - Pisahkan field `quote` menjadi dua: `quote_text` (isi ayat) dan `quote_source` (sumber/surah).
    - Update logic `POST` dan `PATCH` untuk menerima kedua field tersebut.
- [ ] **Stats Endpoint (Optional but Recommended):**
    - Buat endpoint `GET /dashboard/stats` yang mengembalikan summary: `total_invitations`, `total_guests`, dan `total_messages_received`.

## 👥 Guests API
- [ ] **Validation:** Pastikan `POST /guests` menolak request jika `invitationId` tidak valid atau tidak dimiliki oleh user yang sedang login.
- [ ] **Share Link Template:** Pastikan endpoint `GET /guests/:id/share-link` mengembalikan pesan template yang dinamis (mengambil nama tamu dan slug undangan).

## 🎨 Templates & Master Data
- [ ] **Palette Colors:** 
    - Update response `GET /template-designs`.
    - Tambahkan field `palette_colors` (array of strings, e.g., `['#FFFFFF', '#000000']`) agar frontend bisa menampilkan dot warna tanpa hardcode.
- [ ] **New Template Support:** 
    - Daftarkan key template baru (misal: `light-modern`) di database master agar bisa dipilih oleh user.

## ⚙️ Settings
- [ ] **Update Profile API:** Pastikan endpoint untuk update nama, email, dan password sudah tersedia dan berfungsi untuk halaman Pengaturan.
