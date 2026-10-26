# MATRA v6.7 — Penggabungan Halaman Dashboard yang Berulang

- Meninjau komponen Admin dan PJ yang menampilkan konten sama, bukan hanya mengikuti daftar penghapusan v6.6.
- **Admin 21 → 10 halaman utama:** antrean/riwayat/alternatif, jadwal/form/pola kelas, kalender/konflik, fasilitas ruang/lab, operasional ruang, dan audit digabungkan dalam halaman bertab.
- **PJ 11 → 7 halaman utama:** pengingat di Beranda/Konfirmasi, pelepasan alokasi di halaman Konfirmasi dengan dialog sendiri, pencarian dan kalender satu halaman, serta daftar/status/alasan penolakan pengajuan dalam satu fitur.
- Rute lama diberi pengalihan ke halaman/tab baru. Detail pengajuan tetap memiliki URL dinamis sehingga tidak ada alur yang terputus.
- Pencarian fitur navbar otomatis memperbarui saran dari sitemap. Notifikasi yang mengarah ke rute yang digabungkan telah diperbaiki.
- Tidak menambah dependency atau mengubah data Semester 125, fitur publik, login demo, aset WebP, ataupun animasi tiga titik kuning. Overlay hanya dijalankan ketika `pathname` berubah, bukan saat memilih tab dalam halaman yang sama.
- Menambahkan pemeriksaan regresi `tests/v6_7.test.js`, pembaruan dokumentasi serta versi v6.7.

---

# MATRA v6.6 — Penyederhanaan Dashboard Admin/PJ

- Admin: menghapus 9 halaman terpisah dari menu dan mengalihkan rute lama ke antrean, penugasan, laporan atau dashboard yang masih tersedia.
- PJ: menghapus 14 halaman terpisah, mengubah judul kelompok **Jadwal & Konfirmasi** menjadi **Konfirmasi**.
- Beranda PJ: menampilkan pengajuan terbaru dan tautan dinamis ke detail; tidak ada lagi tautan ke daftar aktif, notifikasi, atau halaman jadwal pribadi yang dihapus.
- Antrean Admin tetap menyediakan dialog keputusan; daftar laporan tetap menyediakan dialog tindak lanjut.
- Notifikasi yang tadinya menuju halaman terhapus tidak ditampilkan lagi sebagai shortcut header; pencatatan audit internal tetap berlangsung.
- Validasi kode PJ tidak aktif dipindahkan ke jalur login PJ, logout tetap pada sidebar.
- Tidak menambah dependensi atau mengubah halaman publik, data jadwal, aset gambar, maupun loading.
- `.gitignore` disertakan untuk mencegah `node_modules`/`dist` masuk Git pada commit mendatang.

Baca `SITEMAP-v6.6.md` dan `UPGRADE-v6.6.md` untuk daftar dan instruksi lengkap.

---

# MATRA v6.5 — Perbaikan WebP tidak tampil

- Memulihkan dan menyertakan ulang semua aset ilustrasi WebP dalam patch.
- Mengubah sumber gambar hero dan Kenali MATRA dari string URL `/assets/...` menjadi `import` statis dari `src/assets`, sehingga Vite membundelnya dan memberi kegagalan build jika file tidak ada.
- Mengubah MediaFrame ke import statis yang sama; foto fasilitas manual WebP/JPG tetap didukung.
- Memperbaiki fallback antarmuka saat gambar gagal dirender.
- Mempertahankan desain warna, layering, navbar Beranda, dan animasi loading kuning v6.4.
- Tidak mengubah dependencies.
