# Project Todo List - SatuUndangan

## ✅ Completed Tasks

- [x] **Fix: Akad & Resepsi Unified Logic**
    - **Description:** Saat Akad dan Resepsi disatukan, data tidak tersimpan dengan benar. Perlu penyesuaian di Frontend (saat kirim data) dan Backend (saat proses simpan).
    - **Details:** Pastikan waktu, link maps, dan detail lokasi terhandle dengan benar untuk kondisi event yang digabung.
    - **Status:** Fixed by populating both akad and resepsi location objects in payload when unified.

- [x] **Test & Verify: Menu Makanan & Love Story**
    - **Description:** Seksi Menu Makanan dan Love Story belum ditest secara menyeluruh.
    - **Tasks:** 
        - Tambahkan ke dalam list seksi yang aktif.
        - Verifikasi input data di form dan tampilannya di halaman undangan.
    - **Status:** Integrated UI for Love Story and Menu Makanan in CreateForm.vue.

- [x] **Final Audit: User Dashboard**
    - **Description:** Melakukan pengecekan ulang secara menyeluruh pada dashboard user.
    - **Note:** Beberapa bug sebelumnya sudah diperbaiki, namun perlu dipastikan tidak ada regresi pada fitur utama (tabel undangan, manajemen tamu, dll).
    - **Status:** Verified and updated stats to use live data from /dashboard/stats.

- [x] **Enhance: Checkout & Simulasi Pembayaran**
    - **Description:** Halaman checkout sudah oke dan sudah bisa ambil data berdasarkan slug undangan.
    - **Task:** Implementasikan simulasi pembayaran untuk melengkapi flow transaksi user.
    - **Status:** Added "Simulate Payment Success" button for development.

