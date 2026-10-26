# MATRA v6.7 — Sitemap Dashboard Terpadu

Dokumen ini **menggantikan** `SITEMAP-v6.6.md` untuk struktur dashboard aktif. Berdasarkan peninjauan kode v6.6, sejumlah halaman benar-benar menampilkan komponen/data yang sama, atau merupakan satu tahapan dari tugas yang seharusnya diselesaikan di satu halaman.

## Dashboard Admin — 10 halaman utama

| Kelompok sidebar | Halaman | Isi yang digabung |
|---|---|---|
| Beranda Admin | Ringkasan Dashboard `/admin` | KPI, antrean terbaru, tautan penanganan |
| Peminjaman | Pengajuan & Riwayat `/admin/antrean` | Tab **Perlu Keputusan**, **Riwayat Pengajuan**, **Alternatif Ruangan**. Verifikasi/keputusan tetap dalam modal |
| Jadwal & Alokasi | Jadwal & Pola Kelas `/admin/jadwal` | Tab **Jadwal Resmi**, **Tambah Jadwal**, **Pola Perkuliahan** |
| Jadwal & Alokasi | Kalender & Konflik `/admin/kalender` | Tab **Kalender Bersama**, **Tinjauan Konflik** |
| Kelola Fasilitas | Daftar Fasilitas `/admin/fasilitas` | Tab **Ruang Kuliah**, **Lab Komputer** dan catatan fasilitas |
| Kelola Fasilitas | Operasional Ruang `/admin/operasional` | Tab **Penutupan Ruang**, **Pemindahan Alokasi** dengan validasi/konfirmasi |
| Kelola Fasilitas | Riwayat Aktivitas `/admin/aktivitas` | Tab **Semua Aktivitas**, **Perubahan Fasilitas**, **Keputusan Peminjaman** |
| PJ & Kelola Akses | Daftar Penugasan PJ `/admin/penugasan` | Daftar akses/penugasan PJ sesuai kelas |
| Monitoring & Laporan | Konfirmasi H-1 `/admin/konfirmasi-h1` | Status PJ belum konfirmasi, offline/online, dan perlindungan alokasi |
| Monitoring & Laporan | Laporan Ketidaksesuaian `/admin/laporan` | Laporan masuk beserta tindakan penyelesaian melalui dialog |

**Pengulangan yang dihilangkan:** Konflik Jadwal vs Tinjauan Konflik; Konfirmasi H-1 vs PJ Belum Konfirmasi; Laporan Masuk vs Laporan Ketidaksesuaian; Antrean vs Riwayat Pengajuan; Riwayat Perubahan vs Riwayat Keputusan; dua daftar fasilitas sejenis; form/jadwal/pola yang saling terkait; dua operasional ruang yang berkaitan.

## Dashboard PJ — 7 halaman utama

| Kelompok sidebar | Halaman | Isi yang digabung |
|---|---|---|
| Dashboard PJ | Beranda PJ `/pj` | KPI, pengingat H-1, pertemuan yang harus dikonfirmasi, pengajuan terbaru |
| Konfirmasi | Konfirmasi & Pelepasan `/pj/konfirmasi` | Pilih tetap offline/berubah online, simpan konfirmasi, lepas alokasi lewat dialog terpisah |
| Cari & Pinjam | Cari Ruang & Kalender `/pj/cari` | Tab hasil pencarian/kalender ketersediaan |
| Cari & Pinjam | Ajukan Peminjaman `/pj/ajukan` | Form pengajuan, validasi, menuju detail setelah dikirim |
| Pengajuan Saya | Daftar & Status Pengajuan `/pj/pengajuan` | Tab semua, menunggu, disetujui, ditolak, dibatalkan; klik untuk rincian |
| Laporan & Akun | Lapor Ketidaksesuaian `/pj/lapor` | Form laporan dan nomor laporan setelah dikirim |
| Laporan & Akun | Identitas & Akses `/pj/identitas` | Identitas, kelas, semester dan lingkup kewenangan |

**Detail dinamis tetap ada:** `/pj/pengajuan/:id` dibuka dari daftar atau setelah pengajuan. Rincian memuat alasan penolakan dan aksi pembatalan jika masih menunggu. Detail ini bukan submenu yang terpisah.

**Pengulangan yang dihilangkan:** Pengingat H-1 vs beranda dan konfirmasi; Lepaskan Alokasi vs Konfirmasi Pelaksanaan; Cari Ruang vs Detail & Kalender; Alasan Penolakan vs Detail Pengajuan. Logout masih ada pada sidebar, bukan halaman.

## Prinsip keselamatan alur dan akses

- Perubahan pelaksanaan menjadi **Berubah Online** tidak otomatis melepas ruangan. Pelepasan tetap memerlukan konfirmasi eksplisit tersendiri di dalam halaman yang sama.
- PJ tidak dapat menyetujui sendiri pengajuannya. Admin harus memverifikasi dan menyimpan keputusan pada antrean.
- Pengajuan yang ditolak menampilkan alasan dan dapat diarahkan ke pencarian ruang lain. Pengajuan menunggu dapat dibatalkan dari detail, bukan dari subhalaman terpisah.
- Penutupan dan pemindahan ruang tetap memiliki pemeriksaan serta notifikasi dalam data simulasi.
- Rute historis lama menggunakan `Navigate replace` menuju halaman baru serta tab yang relevan, untuk menghindari white screen atau tautan rusak.
- Hak akses Admin/PJ, data Jadwal Semester 125, aset loading Lottie kuning, WebP, dan halaman publik tidak berubah. Loading tetap sama pada perpindahan **halaman**; berpindah **tab** tidak memunculkan overlay 1,1 detik. Login tetap **demo frontend**, tidak cocok sebagai autentikasi produksi.
