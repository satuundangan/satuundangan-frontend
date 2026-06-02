# Rencana Migrasi Layout: "Studio Editor" (2-Column Layout)

## 🎯 Visi & Tujuan
Mengubah sistem pembuatan undangan dari **Multi-Step Wizard** (halaman terpisah) menjadi **Live Studio Editor**. 
Konsep 3-kolom terlalu padat untuk layar standar, sehingga kita menggunakan kompromi **2-Kolom** (Kontrol di kiri, Live Preview di kanan bergaya Mobile Mockup).

**Tujuan:**
- Memberikan pengalaman *Real-time Feedback* (ketik langsung berubah).
- Mengurangi *cognitive load* dengan navigasi accordion/tab di sisi kiri.
- Memberikan kesan platform premium dan canggih (seperti Canva/Linktree).

---

## 📐 Arsitektur UI/UX

### Tampilan Desktop (Min 1024px)
*   **Header Bar:** Navigasi kembali, Nama Project/Template, Tombol "Simpan & Lanjut".
*   **Kolom Kiri (Panel Editor - 60% width):**
    *   **Sidebar Nav (Kiri Ekstrem):** Icon-only atau teks kecil untuk pindah seksi (Mempelai, Acara, Galeri, Fitur Tambahan).
    *   **Form Area:** Berubah sesuai navigasi yang dipilih. Menggunakan Accordion agar tidak memakan ruang.
*   **Kolom Kanan (Live Preview - 40% width):**
    *   Menempel (*Sticky*) saat layar di-scroll.
    *   Berupa mockup frame handphone (iPhone frame) yang berisi `iframe` undangan.
    *   Data di-sync secara *real-time* lewat `postMessage` ke iframe.

### Tampilan Mobile (< 1024px)
*   **Default View:** Menampilkan form step-by-step atau accordion panjang.
*   **Floating Action:** Tombol "Lihat Preview" mengambang di kanan bawah.
*   **Preview Mode:** Saat tombol ditekan, muncul *Fullscreen Modal* atau *Bottom Sheet* berisi hasil live preview.

---

## 🧩 Struktur Komponen (Vue)

Nantinya, `CreateDesign.vue` dan `CreateForm.vue` akan dilebur/direstruktur menjadi satu parent component: `StudioView.vue`.

```text
src/
  views/
    StudioView.vue (Parent Component & State Manager)
    studio/
      components/
        SidebarNav.vue (Navigasi Kiri)
        FormContainer.vue (Wadah untuk form-form)
          forms/
            MempelaiForm.vue
            AcaraForm.vue
            EkstraForm.vue
        LivePreview.vue (Kolom Kanan - Mockup HP & iframe)
```

---

## ⚙️ Manajemen State & Data Sync
Untuk sinkronisasi *real-time* tanpa bikin *lag*:
1. **Centralized Store (Pinia atau Ref di Parent):**
   Semua data `formData` disimpan di parent `StudioView` dan dipassing ke bawah menggunakan Provide/Inject atau Props.
2. **Debounced postMessage:**
   Setiap kali ada perubahan di form (misal ngetik nama mempelai), data dipassing ke komponen `LivePreview`.
   Preview akan menggunakan `window.postMessage` untuk mengirim data terbaru ke dalam `iframe` agar render ulang bagian yang berubah saja (atau re-render virtual DOM undangan).

---

## 🛤️ Fase Implementasi (Roadmap)

### Fase 1: Persiapan Struktur
- Membuat file/route baru `/studio` (agar sistem lama tetap jalan selama masa percobaan).
- Membangun layout kerangka grid (Kiri form, Kanan mockup HP).

### Fase 2: Pemindahan Form
- Memecah `CreateForm.vue` yang panjang menjadi komponen-komponen kecil (Mempelai, Acara, dsb).
- Memasukkan komponen tersebut ke dalam navigasi tab/accordion di kolom kiri.

### Fase 3: Integrasi Live Preview
- Memasang komponen `PreviewInvitation` ke dalam iframe di kolom kanan.
- Membangun mekanisme komunikasi 2 arah (Parent Form -> iframe Preview) menggunakan `postMessage`.

### Fase 4: Polish & Responsive
- Menambahkan animasi transisi antar menu form.
- Menyesuaikan UI untuk versi mobile (Floating Preview button).
- Testing performa (memastikan ngetik tidak lag karena render iframe terus-menerus).

---
*Status: Planned. Menunggu eksekusi setelah task urgent selesai.*