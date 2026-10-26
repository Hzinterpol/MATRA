> **ARSIP v6.6.** Daftar menu di bawah telah digantikan oleh [SITEMAP-v6.7.md](SITEMAP-v6.7.md).

# MATRA v6.6 — Sitemap Dashboard Admin dan PJ

Versi ini menyederhanakan navigasi dashboard dari **MATRA v6.5**. Semua halaman publik, data Semester 125, login PJ/Admin, animasi loading kuning, dan ilustrasi WebP **tidak diubah**.

> Halaman yang telah dihapus tidak lagi memiliki tampilan tersendiri. Tautan lama diarahkan ke halaman yang masih tersedia. Aksi penting dipertahankan di halaman terkait jika memang masih dibutuhkan.

## Dashboard Admin — 21 subhalaman

| Kelompok | Subhalaman yang dipertahankan |
|---|---|
| Beranda Admin | Ringkasan Dashboard; Konflik Jadwal; Konfirmasi H-1; Laporan Masuk |
| Peminjaman | Antrean Pengajuan; Riwayat Pengajuan; Alternatif & Tindak Lanjut |
| Jadwal & Alokasi | Daftar Jadwal Resmi; Tambah / Ubah Jadwal; Pola Tiap Kelas; Kalender Bersama; Tinjauan Konflik |
| Kelola Fasilitas | Daftar Ruang Kuliah; Daftar Lab Komputer; Penutupan Ruang; Pemindahan Alokasi; Riwayat Perubahan |
| PJ & Kelola Akses | Daftar Penugasan PJ |
| Laporan & Tindak Lanjut | PJ Belum Konfirmasi; Laporan Ketidaksesuaian; Riwayat Keputusan |

**Dihapus dari navigasi Admin (9 subhalaman):** Pengajuan Menunggu; Detail & Verifikasi; Keputusan Pengajuan; Semester & Masa Aktif; Terbitkan Kode Unik; Ganti / Cabut Kode; Riwayat Penugasan; Detail Tindak Lanjut; Notifikasi Terdampak.

Keputusan setuju/tolak tetap diproses **di dalam Antrean Pengajuan**, melalui dialog verifikasi. Catatan tindak lanjut laporan tetap dapat dibuat **di dalam Laporan Ketidaksesuaian**, tanpa halaman tersendiri. Ringkasan angka pengajuan menunggu tetap tampil sebagai metrik pada Beranda Admin dan mengarah ke Antrean Pengajuan.

## Dashboard Penanggung Jawab — 11 subhalaman

| Kelompok | Subhalaman yang dipertahankan |
|---|---|
| Dashboard PJ | Beranda PJ; Pengingat H-1 |
| Konfirmasi | Konfirmasi Pelaksanaan; Lepaskan Alokasi |
| Cari & Pinjam | Cari Ruang / Lab; Detail & Kalender; Formulir Pengajuan; Lapor Ketidaksesuaian |
| Pengajuan Saya | Detail Pengajuan; Alasan Penolakan |
| Akses & Dukungan | Identitas & Penugasan |

**Dihapus dari navigasi PJ (14 subhalaman):** Kelas Tanggung Jawab; Notifikasi; Info Penugasan; Jadwal Saya; Detail Pertemuan; Status Alokasi; Pilihan Alternatif; Pengajuan Aktif; Riwayat Pengajuan; Batalkan Pengajuan; Kode Tidak Berlaku; Pengajuan Mendesak; Status Perubahan; Keluar Dashboard PJ.

Agar halaman Detail Pengajuan tetap mudah ditemukan, Beranda PJ sekarang menampilkan **Pengajuan terbaru**, termasuk status dan tautan detail. Menu Detail Pengajuan pada sidebar mengarah ke pengajuan yang terakhir dibuat, bukan ID demo yang tetap. Formulir pengajuan juga membuka detail tepat setelah pengiriman.

Tindakan membatalkan permohonan yang masih menunggu keputusan tetap ada **di dalam Detail Pengajuan** (tanpa halaman pembatalan terpisah). Tombol logout tetap disediakan di bagian bawah sidebar sesuai mekanisme login sesi yang sudah ada; hanya subhalaman "Keluar Dashboard PJ" yang dihapus. Pemeriksaan kode PJ yang tidak aktif tetap ditangani oleh login/penjagaan akses, bukan sebagai menu halaman.

## Rute lama

URL lama yang dihapus diarahkan ke rute relevan yang masih tersedia untuk menghindari layar kosong / halaman error. Lihat `src/App.jsx` untuk pemetaan lengkap.

## Catatan implementasi

- `src/data/sitemap.js` menyimpan daftar menu aktif.
- `src/pages/AdminPages.jsx` dan `src/pages/PJPages.jsx` hanya menampilkan halaman yang dipertahankan.
- `src/components/Layouts.jsx` menampilkan menu baru dan tidak lagi menyediakan tombol notifikasi menuju halaman yang dihapus.
- `src/components/GlobalSearch.jsx` menyusun saran halaman dashboard dari sitemap yang sudah diperbarui.
- Source `src/context/AppContext.jsx` tetap mengelola keputusan admin, status, alokasi, dan audit log untuk demo frontend.
