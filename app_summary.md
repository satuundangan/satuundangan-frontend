# Ringkasan Aplikasi: Satu Undangan (SatuUndangan.id)

Satu Undangan adalah platform pembuatan dan manajemen undangan pernikahan digital (online) yang modern. Aplikasi ini menggunakan arsitektur monorepo terpisah antara **Frontend** (Vue 3) dan **Backend** (NestJS) dengan integrasi gateway pembayaran Midtrans, penyimpanan Cloudflare R2, dan database MySQL.

---

## 🛠️ Arsitektur & Arus Sistem (Tech Stack)

Platform ini dibagi menjadi dua repositori utama di dalam folder kerja:

### 1. Frontend (`satuundangan-frontend`)
*   **Framework**: Vue 3 (Composition API dengan `<script setup>` syntax).
*   **Routing**: Vue Router 4 dengan guard navigasi berbasis metadata (`requiresAuth`, `requiresAdmin`).
*   **State Management**: Pinia (`stores/auth.js` untuk mengelola otentikasi user/admin & token JWT).
*   **Styling**: Tailwind CSS v4 (menggunakan `@tailwindcss/vite` plugin).
*   **HTTP Layer**: Fetch API dengan kustom wrapper `apiFetch` (`src/api/client.js`) yang secara otomatis menyisipkan token JWT dari `localStorage` untuk otorisasi endpoint 🔒.
*   **UI/UX Utilities**: SweetAlert2 (untuk dialog konfirmasi/alert), Vue-toastification (notifikasi toast).
*   **E2E Testing**: Playwright (`tests/` directory).

### 2. Backend (`satuundangan-backend`)
*   **Framework**: NestJS (TypeScript REST API).
*   **Database & ORM**: MySQL dengan TypeORM (`synchronize: true` untuk sinkronisasi skema otomatis dari entitas).
*   **File Storage**: Cloudflare R2 (S3-compatible) untuk upload gambar mempelai, galeri, dan musik melalui endpoint `POST /upload`.
*   **Payment Gateway**: Midtrans Snap API (untuk pembuatan transaksi premium menggunakan token Snap di sisi klien).
*   **Otentikasi**: Passport JWT + Google OAuth (menyimpan token & membuat user baru otomatis).

---

## 🔑 Fitur Utama Aplikasi

1.  **Otentikasi & Manajemen Akun**
    *   Registrasi & Login menggunakan Email/Password atau Google OAuth.
    *   Role-based access control (RBAC): Membedakan pengguna biasa dan Administrator.
2.  **Alur Pembuatan Undangan (Invitation Wizard Flow)**
    *   **Langkah 1**: Memilih Template / Desain (`CreateDesign.vue`). Template dapat bertipe *Free* (Gratis) maupun *Premium* (Berbayar).
    *   **Langkah 2**: Mengisi Form Undangan (`CreateForm.vue`) yang mencakup detail mempelai (Akad & Resepsi), kisah cinta (Love Story), galeri foto, pilihan musik latar belakang (soundtrack), kutipan pernikahan, serta info hadiah/rekening bank.
3.  **Manajemen Pembayaran & Aktivasi Instan**
    *   Mengintegrasikan Midtrans Snap popup.
    *   Skema pembayaran otomatis: Template premium memerlukan pembayaran Rp 49.000, sedangkan template gratis akan langsung terbit (*isPublished = true*).
    *   Disediakan endpoint simulasi pembayaran (`POST /payment/simulate`) untuk kebutuhan pengujian developer.
4.  **Dashboard Pengguna & Panel Admin**
    *   **User Dashboard**: Melihat statistik undangan (total view, jumlah kehadiran/RSVP tamu), daftar undangan aktif/draft, manajemen buku tamu, dan pengaturan profil.
    *   **Admin Panel**: Mengelola master data (kategori, daftar template desain, bank, audio latar, kode promo), melacak semua undangan aktif, melihat pesan/ucapan dari tamu, dan mengelola data pengguna terdaftar.
5.  **Buku Tamu & Pembagian Undangan (Guest Management)**
    *   Menambahkan tamu secara manual atau mengimpor daftar tamu secara massal menggunakan file Excel (.xlsx).
    *   Menghasilkan tautan undangan unik beserta template teks WhatsApp siap kirim (`waLink` & pesan kustom).
    *   Mencatat status pengiriman undangan (Sent) setelah dibagikan melalui WhatsApp.
    *   Mendukung QR Code Check-in tamu di lokasi acara (mengubah status kehadiran).
6.  **Halaman Publik Undangan**
    *   Menggunakan routing dinamis `/:slug` atau `/:slug/guest/:guestSlug`.
    *   Secara dinamis memuat komponen template Vue yang sesuai (misal: `dark-elegant.vue`, `light-modern.vue`).
    *   Tamu dapat mengisi form RSVP (Kehadiran) dan menulis kartu ucapan yang langsung masuk ke dashboard pemilik undangan.

---

## 📈 Rencana Perbaikan UI/UX (Mobile-First)

Terdapat **dua dokumen rencana perbaikan (.md)** yang menjelaskan tahap-tahap lanjutan perombakan dashboard agar 100% responsif dan nyaman digunakan pada perangkat mobile:

### A. Rencana pada Frontend (`satuundangan-frontend/plan.md`)
Rencana ini berfokus pada perbaikan halaman-halaman fungsional di dashboard pengguna agar ramah jempol (mobile-friendly):
*   **Tahap 3 (Transformasi Form & Pengaturan)**:
    *   Refactor `SettingsView.vue` agar responsif dengan sidebar (`md:ml-64`).
    *   Integrasi menu navigasi bawah (`BottomNav`) untuk perangkat mobile.
    *   Menata ulang input field dengan minimal tinggi 44px agar mudah disentuh jempol.
*   **Tahap 4 (Optimasi Data & Tabel)**:
    *   Refactor `GuestbookView.vue` (buku tamu).
    *   Membungkus tabel data ucapan agar bisa di-scroll secara horizontal, atau menggantinya dengan tampilan kartu (Card List) pada layar HP.
    *   Memperbesar ukuran tombol aksi hapus/edit.
*   **Tahap 5 (Final Polish & Konsistensi Global)**:
    *   Memastikan semua popup/modal menggunakan efek transisi `slide-up` di mobile.
    *   Menambahkan padding bawah `pb-20` agar konten tidak terpotong oleh `BottomNav`.
    *   Memastikan kecocokan dengan Tailwind CSS v4.

### B. Rencana pada Root Proyek (`plan.md`)
Rencana lanjutan ini berfokus pada pengisian data dan alur pembuatan undangan (*Creation Flow*):
*   **Tahap 6 (Optimasi CreateDesign.vue)**:
    *   Menghapus komponen *stepper* bulat (1-2-3) yang tidak interaktif dan memakan banyak tempat di layar mobile.
    *   Menggantinya dengan indikator langkah yang sederhana (seperti "Step 1/2").
    *   Menambahkan tombol **"Kembali ke Galeri"** yang jelas agar user bisa dengan mudah mengubah pilihan template.
    *   Merampingkan area preview template pilihan di mobile agar daftar pilihan fitur lebih terlihat tanpa perlu banyak scroll.
*   **Tahap 7 (Optimasi CreateForm.vue)**:
    *   Menghapus komponen *stepper* visual lama di halaman formulir.
    *   Menambahkan progress bar tipis yang estetik di bagian atas layar sebagai indikator pengisian form.
    *   Mempercantik judul seksi formulir (Mempelai, Acara, dll) dengan ikon minimalis dan tipografi modern.
    *   Memastikan tombol simpan/lanjut di mobile selalu berada pada area jangkauan jempol di bagian bawah layar.
*   **Tahap 8 (Sinkronisasi Global & Testing)**:
    *   Memastikan transisi antar halaman pembuatan undangan berjalan mulus.
    *   Memastikan pesan error validasi form tidak merusak tata letak layout pada layar HP.
    *   Melakukan verifikasi kompilasi akhir (build).

### C. Rencana Migrasi Layout: "Studio Editor" (editor_layout_plan.md)
Rencana ini bertujuan memigrasikan sistem pembuatan undangan dari model Multi-Step Wizard ke Live Studio Editor 2-Kolom:
*   **Desktop Layout**: Panel editor 60% lebar di kiri (sidebar navigasi ikon & accordion form), Live Preview 40% lebar di kanan (mockup HP dengan rendering real-time via `iframe` & `postMessage`).
*   **Mobile Layout**: Tampilan formulir default dengan tombol melayang (Floating Action Button) untuk memicu preview layar penuh (*Fullscreen Modal* / *Bottom Sheet*).
*   **Fase Rencana**: Fase 1 (Kerangka Grid Studio), Fase 2 (Split Form), Fase 3 (Live Preview Integration), Fase 4 (Polish & Optimization).

---

## ⚡ Status Saat Ini & Rekomendasi
*   **Backend**: Integrasi logika penyatuan Akad-Resepsi, menu makanan, love story, payment simulation, dan dashboard stats sudah selesai dikembangkan dan diuji (semua centang di `backend_todo.md` selesai).
*   **Frontend**: Fitur inti untuk dashboard dan checkout sudah terintegrasi, namun optimasi visual dan navigasi mobile-first (sesuai Tahap 3 hingga Tahap 8 di atas) adalah tugas prioritas berikutnya untuk meningkatkan kualitas pengalaman pengguna secara keseluruhan.
