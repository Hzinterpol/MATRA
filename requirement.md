# Addendum requirement MATRA v6.2

- REQ-SEARCH-01: modal pencarian harus muncul di atas semua lapisan halaman dan backdrop menutup viewport seluruhnya.
- REQ-SEARCH-02: ketika modal aktif, scroll halaman tidak boleh bergerak; saat ditutup, overflow dipulihkan.
- REQ-SEARCH-03: dukung navigasi keyboard (Ctrl/Cmd+K, Escape, Enter, panah, Tab) dan fokus input saat dialog dibuka.
- REQ-AUTH-UI-01: hilangkan paragraf peringatan panjang di bagian bawah formulir login PJ dan Admin tanpa mengubah aturan login atau penyimpanan sesi simulasi.
- REQ-COMPAT-01: tidak mengubah data Semester 125, aset WebP, status jadwal, ataupun paket dependency.

---

# Addendum Kebutuhan MATRA v5.0

- Navbar publik menyediakan ikon pencarian cepat dan tombol **Masuk sebagai PJ** setelah ikon tersebut.
- Footer publik menyediakan tautan **Login Admin** serta tautan bantuan.
- Area beranda mengutamakan penemuan informasi, akses cepat dan proses peminjaman, tetap menjalankan alur yang ditetapkan dalam dokumen ini.
- Media ruang kuliah, laboratorium, dan layanan berupa slot foto opsional; jika berkas belum tersedia, tampilkan placeholder ilustratif yang tidak rusak.
- Ikon menggunakan satu keluarga outline konsisten dari `lucide-react`, tanpa menambahkan dependensi frontend.
- Persyaratan hak akses, aturan konflik, pelindungan alokasi, waktu WIB, status persetujuan serta data Semester 125 tidak berubah.

---

# REQUIREMENT.md — MATRA | Sistem Informasi Ruang dan Fasilitas Akademik

> **Software/Product Requirements Document (PRD/SRS awal)** untuk **Halaman Publik, Dashboard PJ Mata Kuliah, dan Dashboard Admin**, dengan prioritas wireframe/prototipe **Desktop** dan dukungan responsif.
>
> **Versi acuan:** 25 Oktober 2026 · **Bahasa produk:** Indonesia · **Zona waktu:** WIB (Asia/Jakarta)
>
> **Status:** spesifikasi kebutuhan dan kriteria uji, bukan dokumentasi aplikasi yang telah berfungsi penuh.

## 1. Ringkasan Proyek

**MATRA** adalah website pengelolaan dan informasi fasilitas akademik di lingkungan **Rumpun Matematika, FMIPA Universitas Negeri Jakarta**. Platform ini mengintegrasikan **Ruang Kuliah**, **Lab Komputer**, dan **Layanan Kampus** agar informasi jadwal, kapasitas, fasilitas, status slot, dan pengajuan peminjaman tidak tersebar di PDF/WhatsApp atau bergantung pada konfirmasi manual lintas kelas.

### 1.1 Masalah yang ingin diselesaikan

Hasil user research dalam `UTS(2).docx` mencatat bahwa PJ memperoleh jadwal resmi tetapi belum selalu memperoleh kepastian penggunaan fisik ruang ketika pola kelas offline/online berubah. Kasus bentrokan **GDS 607** menunjukkan dampak operasionalnya: PJ harus mencari ruangan alternatif, menghubungi pihak lain, dan berisiko menunda kelas. Pengelola juga perlu melayani permintaan lewat komunikasi terpisah.

### 1.2 Tujuan produk

1. Memusatkan informasi jadwal, status slot, fasilitas, dan perubahan yang relevan.
2. Memberi akses informasi **tanpa login** kepada mahasiswa/publik.
3. Memberi akses tindakan terbatas kepada **PJ terverifikasi** sesuai penugasan.
4. Memberi admin sarana verifikasi dan keputusan terhadap permohonan.
5. Melindungi alokasi jadwal resmi meski PJ belum mengonfirmasi pelaksanaan.
6. Meminimalkan dua persetujuan pada ruang dan interval waktu yang beririsan.
7. Menyediakan hasil pencarian dan alternatif yang transparan, beserta alasan bila slot tidak tersedia.
8. Memungkinkan prototipe diuji dan diperbaiki bertahap melalui **Evolutionary Prototyping**.

### 1.3 Dasar spesifikasi

| Sumber | Bagian yang digunakan |
|---|---|
| `UTS(2).docx` | User research, user journey, problem statement, konsep MATRA, user flow, aturan alokasi/konfirmasi/peminjaman, identitas visual |
| `Halaman Publik(2).png` | Sitemap Publik: empat kelompok dengan lima subhalaman masing-masing |
| `Halaman PJ.png` | Sitemap PJ: lima kelompok dengan lima subhalaman masing-masing |
| `Halaman Admin.png` | Sitemap Admin: enam kelompok dengan lima subhalaman masing-masing |
| [Figma MATRA, Page 3](https://www.figma.com/design/Ew0UZ1gAECgRFCMIaNGw69/Biologi-FMIPA-UNJ?node-id=243-40) | 21 frame Publik berukuran desktop 1440px, konten 1160px; tiga screen awal terisi |
| `00  BERANDA PUBLIK.png`, `01  RUANG KULIAH.png` | Contoh high-fidelity untuk tampilan beranda/daftar/detail |
| `design.md` | Kontrak visual dan pola komponen untuk kebutuhan pada dokumen ini |
| Contoh `REQUIREMENT.md` ChemistryLab | Format penulisan kebutuhan fungsional, nonfungsional, struktur file, dan acceptance checklist; kebutuhan kimia tidak diadopsi |

### 1.4 Konvensi prioritas

- **P0 — Kritis:** harus benar untuk alur inti dan keamanan/akurasi ketersediaan.
- **P1 — Penting:** termasuk dalam sitemap dan diperlukan untuk cakupan prototipe yang utuh.
- **P2 — Peningkatan:** penyempurnaan alur, tampilan, atau kenyamanan setelah alur utama berjalan.

Prioritas adalah **usulan perencanaan implementasi**, bukan keputusan proyek yang telah disetujui pengelola.

---

## 2. Target Pengguna dan Hak Akses

### 2.1 Pengguna utama

| Aktor | Konteks kebutuhan | Tindakan utama |
|---|---|---|
| **Mahasiswa / Publik** | Mencari informasi lokasi, jadwal, fasilitas, dan ketersediaan | Baca, cari, filter, lihat kalender, lihat petunjuk; **tanpa login** |
| **PJ Mata Kuliah** | Menjaga kelancaran kelas yang menjadi tanggung jawabnya | Masuk dengan kode aktif, konfirmasi H-1, lepaskan alokasi melalui aksi berizin, ajukan pinjaman, lihat keputusan, lapor ketidaksesuaian |
| **Admin / Pengelola** | Menjaga jadwal resmi dan integritas penggunaan fasilitas | Login admin, kelola jadwal/fasilitas/PJ, verifikasi dan putuskan pengajuan, tangani konflik dan laporan, audit perubahan |

### 2.2 Matriks otorisasi ringkas

| Operasi | Publik | PJ terverifikasi | Admin |
|---|:---:|:---:|:---:|
| Lihat daftar/detail ruang, lab, jadwal, dan ketersediaan publik | Ya | Ya | Ya |
| Cari ruang/lab dan lihat alternatif | Ya | Ya | Ya |
| Lihat direktori layanan kampus | Ya | Ya | Ya |
| Lihat penugasan PJ yang bersangkutan | Tidak | **Hanya milik sendiri** | Ya |
| Konfirmasi kelas offline/online | Tidak | **Hanya kelas ditugaskan** | Lihat/tindak lanjut sesuai kebijakan |
| Lepaskan alokasi kelas resmi | Tidak | **Sesuai penugasan + konfirmasi tindakan** | Pengelolaan alokasi menurut kewenangan |
| Ajukan peminjaman ruang/lab | Tidak | Ya, jika kode masih berlaku | Memproses pengajuan; bukan jalur pengajuan publik |
| Lihat detail/riwayat pengajuan pribadi | Tidak | Hanya milik sendiri | Semua sesuai tugas |
| Batalkan pengajuan | Tidak | Pengajuan milik sendiri, sesuai aturan | Mengelola konsekuensi sesuai kebijakan |
| Ubah jadwal resmi/pola kelas/fasilitas | Tidak | Tidak | Ya |
| Setujui/tolak pengajuan | Tidak | Tidak | Ya |
| Terbitkan/cabut kode PJ | Tidak | Tidak | Ya |
| Tinjau konflik, laporan, dan riwayat keputusan | Data publik terbatas | Data yang berhubungan dengan tugas | Ya |

Sistem **harus** memeriksa izin saat memproses aksi, bukan sekadar menyembunyikan tombol di UI.

---

## 3. Ruang Lingkup dan Batas Produk

### 3.1 In scope

1. Website desktop yang berlanjut menjadi responsif untuk tablet/mobile.
2. Informasi Publik: Beranda, Ruang Kuliah, Lab Komputer, Pencarian Bersama, Layanan & Akses.
3. Portal PJ: Dashboard, Jadwal & Konfirmasi, Cari & Pinjam, Pengajuan Saya, Akses & Dukungan.
4. Portal Admin: Beranda, Peminjaman, Jadwal & Alokasi, Kelola Fasilitas, PJ & Kode Akses, Laporan & Tindak Lanjut.
5. Pemisahan status: slot ruang, keputusan pengajuan, dan konfirmasi pelaksanaan.
6. Pengingat H-1 serta pemberitahuan penting berdasarkan status kelas/pengajuan.
7. Pemeriksaan konflik serta alternatif ruang/waktu.
8. Riwayat penugasan, pengajuan, perubahan jadwal/ruang, dan keputusan admin.

### 3.2 Out of scope pada rancangan awal

- Booking **komputer individual** di laboratorium (lab dipinjam **satu ruangan penuh**).
- Reservasi atau sistem antrean digital untuk seluruh layanan kampus; direktori layanan bersifat informasional.
- Hak mahasiswa umum untuk langsung mengajukan atau mengubah alokasi tanpa autentikasi PJ.
- Melepaskan ruangan secara otomatis hanya karena PJ tidak membalas H-1.
- Persetujuan otomatis tanpa keputusan admin.
- Integrasi WhatsApp, email, SSO kampus, pengenalan wajah, pembayaran, dan fitur AI **tidak diasumsikan tersedia**; memerlukan keputusan dan spesifikasi terpisah jika ingin ditambahkan.
- Data fasilitas/jadwal contoh pada prototipe tidak dianggap sebagai data operasional final.

### 3.3 Status pengembangan desain yang terverifikasi

Page 3 Figma memiliki **21 frame Publik**: **00–02 telah terisi**, **03–20 masih kosong**. Halaman PJ dan Admin baru dipetakan melalui sitemap pada materi yang diberikan. Karena itu semua persyaratan pada dua area terakhir berarti **perlu dirancang dan dibangun**, bukan sudah tersedia.

---

## 4. Sitemap dan Modul Navigasi

### 4.1 Halaman Publik

```text
Beranda Publik (tanpa login)
├── Ruang Kuliah
│   ├── Daftar Ruang Kuliah
│   ├── Detail Ruang Kuliah
│   ├── Kalender Ruang Kuliah
│   ├── Detail Status Slot
│   └── Info Konfirmasi PJ
├── Lab Komputer
│   ├── Daftar Lab Komputer
│   ├── Detail Lab Komputer
│   ├── Software Laboratorium
│   ├── Kalender Lab Komputer
│   └── Waktu Pemeriksaan
├── Pencarian Bersama
│   ├── Cari Ruang & Lab
│   ├── Filter Pencarian
│   ├── Filter Waktu
│   ├── Hasil & Alternatif
│   └── Kalender Ketersediaan
└── Layanan & Akses
    ├── Direktori Layanan Kampus
    ├── Detail Layanan
    ├── Masuk sebagai PJ
    ├── Login Admin
    └── Petunjuk Peminjaman
```

### 4.2 Halaman PJ

```text
Masuk sebagai PJ (kode unik, masa aktif penugasan)
├── Dashboard PJ
│   ├── Beranda PJ
│   ├── Kelas Tanggung Jawab
│   ├── Pengingat H-1
│   ├── Notifikasi
│   └── Info Penugasan
├── Jadwal & Konfirmasi
│   ├── Jadwal Saya
│   ├── Detail Pertemuan
│   ├── Konfirmasi Pelaksanaan
│   ├── Lepaskan Alokasi
│   └── Status Alokasi
├── Cari & Pinjam
│   ├── Cari Ruang / Lab
│   ├── Detail & Kalender
│   ├── Formulir Pengajuan
│   ├── Pilihan Alternatif
│   └── Lapor Ketidaksesuaian
├── Pengajuan Saya
│   ├── Pengajuan Aktif
│   ├── Detail Pengajuan
│   ├── Riwayat Pengajuan
│   ├── Alasan Penolakan
│   └── Batalkan Pengajuan
└── Akses & Dukungan
    ├── Identitas & Penugasan
    ├── Kode Tidak Berlaku
    ├── Pengajuan Mendesak
    ├── Status Perubahan
    └── Keluar Dashboard PJ
```

### 4.3 Halaman Admin

```text
Login Dashboard Admin (autentikasi terpisah)
├── Beranda Admin
│   ├── Ringkasan Dashboard
│   ├── Pengajuan Menunggu
│   ├── Konflik Jadwal
│   ├── Konfirmasi H-1
│   └── Laporan Masuk
├── Peminjaman
│   ├── Antrean Pengajuan
│   ├── Detail & Verifikasi
│   ├── Keputusan Pengajuan
│   ├── Riwayat Pengajuan
│   └── Alternatif & Tindak Lanjut
├── Jadwal & Alokasi
│   ├── Daftar Jadwal Resmi
│   ├── Tambah / Ubah Jadwal
│   ├── Pola Tiap Kelas
│   ├── Kalender Bersama
│   └── Tinjauan Konflik
├── Kelola Fasilitas
│   ├── Daftar Ruang Kuliah
│   ├── Daftar Lab Komputer
│   ├── Penutupan Ruang
│   ├── Pemindahan Alokasi
│   └── Riwayat Perubahan
├── PJ & Kode Akses
│   ├── Daftar Penugasan PJ
│   ├── Semester & Masa Aktif
│   ├── Terbitkan Kode Unik
│   ├── Ganti / Cabut Kode
│   └── Riwayat Penugasan
└── Laporan & Tindak Lanjut
    ├── PJ Belum Konfirmasi
    ├── Laporan Ketidaksesuaian
    ├── Detail Tindak Lanjut
    ├── Notifikasi Terdampak
    └── Riwayat Keputusan
```

---

## 5. Persyaratan Fungsional — Halaman Publik

Setiap baris memakai satu ID kebutuhan untuk pemetaan desain/QA. Seluruh navigasi publik harus bisa dibaca **tanpa login**; hanya aksi masuk sebagai PJ/Admin yang membuka autentikasi.

| ID | Halaman/Fitur | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-PUB-00` | Beranda Publik | Menampilkan brand, navigasi layanan, hero, quick search tanggal/jam, tiga kartu layanan, informasi kewenangan, dan footer. | P0 |
| `FR-PUB-01` | Daftar Ruang Kuliah | Menampilkan daftar ruangan beserta lokasi, kapasitas/fasilitas dan status untuk interval yang dipilih. | P0 |
| `FR-PUB-02` | Detail Ruang Kuliah | Menampilkan identitas, gedung, lantai, kapasitas, fasilitas, dan akses kalender/jadwal detail. | P0 |
| `FR-PUB-03` | Kalender Ruang Kuliah | Menyediakan kalender per tanggal/sesi yang membedakan empat status slot dan dapat membuka detail sel. | P0 |
| `FR-PUB-04` | Detail Status Slot | Menjelaskan tanggal, interval, status slot, dan konteks alokasi/konflik yang boleh ditampilkan. | P0 |
| `FR-PUB-05` | Info Konfirmasi PJ | Menampilkan konfirmasi PJ sebagai informasi **terpisah** dari ketersediaan; pengunjung tidak dapat mengubahnya. | P0 |
| `FR-PUB-06` | Daftar Lab Komputer | Menampilkan daftar lab, lokasi, kapasitas, jumlah PC berfungsi (jika tercatat), fasilitas, status slot. | P1 |
| `FR-PUB-07` | Detail Lab Komputer | Menampilkan spesifikasi fasilitas dan ketentuan reservasi **satu lab penuh**, bukan PC terpisah. | P1 |
| `FR-PUB-08` | Software Laboratorium | Menyediakan daftar aplikasi/IDE/compiler; versi ditampilkan jika tersedia pada data resmi. | P1 |
| `FR-PUB-09` | Kalender Lab Komputer | Menyediakan jadwal alokasi lab per interval dengan legenda status yang sama. | P1 |
| `FR-PUB-10` | Waktu Pemeriksaan | Menampilkan informasi pemeriksaan fasilitas terakhir atau pesan bahwa data belum tersedia. | P1 |
| `FR-PUB-11` | Cari Ruang & Lab | Memungkinkan pencarian lintas ruang kuliah/lab berdasarkan tanggal, jam, lokasi, dan kebutuhan. | P0 |
| `FR-PUB-12` | Filter Pencarian | Memungkinkan memilih gedung, lantai, kapasitas, fasilitas, jenis ruang; filter relevan lab bila diperlukan. | P0 |
| `FR-PUB-13` | Filter Waktu | Menerima tanggal serta waktu mulai–selesai/sesi dan menolak interval tidak valid. | P0 |
| `FR-PUB-14` | Hasil & Alternatif | Menampilkan hasil yang sesuai serta ruang/waktu alternatif saat pilihan tidak tersedia; tidak mengklaim kepastian yang belum diverifikasi. | P0 |
| `FR-PUB-15` | Kalender Ketersediaan | Menyediakan tampilan kalender ketersediaan lintas fasilitas sesuai filter waktu. | P1 |
| `FR-PUB-16` | Direktori Layanan Kampus | Memuat daftar layanan, kategori, ringkasan lokasi/jam, dan navigasi detail. | P1 |
| `FR-PUB-17` | Detail Layanan | Memuat lokasi, jam operasional, persyaratan, dan kontak pengelola yang disetujui untuk publikasi. | P1 |
| `FR-PUB-18` | Masuk sebagai PJ | Menyediakan autentikasi kode akses PJ; memvalidasi kode, status aktif, masa berlaku dan penugasan. | P0 |
| `FR-PUB-19` | Login Admin | Menyediakan jalur autentikasi terpisah untuk operator admin. | P0 |
| `FR-PUB-20` | Petunjuk Peminjaman | Menjelaskan pencarian, kewenangan PJ, alur pengajuan, hasil keputusan, dan jalur bantuan. | P1 |

### 5.1 Aturan hasil dan filter Publik

- Input tanggal, waktu mulai, dan waktu selesai harus tampil bersama konteks zona **WIB**.
- Hasil pencarian memiliki ringkasan filter aktif dan jumlah hasil; `Reset filter` menghapus filter tambahan yang dipilih.
- Status ruang selalu dihitung **untuk interval terpilih**, tidak dibuat seolah berlaku sepanjang hari.
- Klik `Lihat detail` mempertahankan konteks tanggal dan jam yang dipilih pengguna.
- Ketika belum ada hasil, pengguna mendapat alasan yang dapat dimengerti serta aksi untuk mengubah waktu/filter.
- Hasil alternatif harus dicek kembali terhadap alokasi dan penutupan sebelum ditampilkan sebagai *calon opsi*.
- Publik tidak melihat data sensitif PJ/admin atau kode akses; hanya informasi resmi yang diizinkan tampil.

---

## 6. Persyaratan Fungsional — Dashboard PJ

### 6.1 Dashboard PJ

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-PJ-01` | Beranda PJ | Merangkum jadwal, kelas ditugaskan, status pengajuan dan pekerjaan yang perlu respons. | P0 |
| `FR-PJ-02` | Kelas Tanggung Jawab | Menampilkan **hanya** kelas, mata kuliah, prodi dan semester dalam penugasan aktif PJ. | P0 |
| `FR-PJ-03` | Pengingat H-1 | Menampilkan kelas yang harus dikonfirmasi sebelum pertemuan sesuai aturan H-1. | P0 |
| `FR-PJ-04` | Notifikasi | Menampilkan pengingat, keputusan permohonan, konflik, dan pembaruan yang relevan bagi PJ. | P1 |
| `FR-PJ-05` | Info Penugasan | Menampilkan lingkup, semester dan masa berlaku penugasan/kode aktif. | P1 |

### 6.2 Jadwal & Konfirmasi

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-PJ-06` | Jadwal Saya | Menampilkan jadwal pertemuan dari kelas dalam penugasan PJ; mendukung filter. | P0 |
| `FR-PJ-07` | Detail Pertemuan | Menampilkan waktu, tempat, pola pelaksanaan, jadwal resmi, status alokasi dan konfirmasi. | P0 |
| `FR-PJ-08` | Konfirmasi Pelaksanaan | PJ berwenang dapat menyatakan `Tetap Offline` atau `Berubah Online` untuk pertemuan terkait. | P0 |
| `FR-PJ-09` | Lepaskan Alokasi | PJ berwenang dapat melepas alokasi pada kondisi yang diizinkan melalui **dialog konfirmasi konsekuensi**. | P0 |
| `FR-PJ-10` | Status Alokasi | Menampilkan status slot dan konfirmasi PJ sebagai dua informasi terpisah, beserta hasil pelepasan. | P0 |

### 6.3 Cari & Pinjam

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-PJ-11` | Cari Ruang / Lab | Menggunakan pencarian/filter dan hasil status berdasarkan interval, sesuai kebutuhan tugas PJ. | P0 |
| `FR-PJ-12` | Detail & Kalender | Menampilkan fasilitas dan kalender yang relevan sebelum pengajuan. | P0 |
| `FR-PJ-13` | Formulir Pengajuan | Mengirim kebutuhan peminjaman ruang/lab dengan identitas penugasan, lokasi, interval dan alasan; hasil awal `Menunggu Keputusan`. | P0 |
| `FR-PJ-14` | Pilihan Alternatif | Menawarkan ruang/waktu lain yang sesuai jika slot utama tidak memungkinkan. | P1 |
| `FR-PJ-15` | Lapor Ketidaksesuaian | PJ dapat melaporkan keadaan ruang/jadwal dengan konteks ruang dan waktu; laporan **tidak langsung** mengubah alokasi. | P1 |

### 6.4 Pengajuan Saya

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-PJ-16` | Pengajuan Aktif | Memuat permohonan sendiri yang menunggu/disetujui. | P0 |
| `FR-PJ-17` | Detail Pengajuan | Menampilkan nomor, waktu diterima, slot, status, keputusan admin, dan detail terkait. | P0 |
| `FR-PJ-18` | Riwayat Pengajuan | Memuat permohonan lama termasuk ditolak dan dibatalkan, tanpa menghapus jejak histori. | P1 |
| `FR-PJ-19` | Alasan Penolakan | Menampilkan alasan admin dan opsi tindak lanjut yang tersedia. | P1 |
| `FR-PJ-20` | Batalkan Pengajuan | Memungkinkan pembatalan atas permohonan sendiri **jika diizinkan kebijakan**, dengan dialog konfirmasi dan riwayat. | P1 |

### 6.5 Akses & Dukungan

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-PJ-21` | Identitas & Penugasan | Menampilkan identitas dan lingkup penugasan yang telah dikonfirmasi. | P1 |
| `FR-PJ-22` | Kode Tidak Berlaku | Menghentikan akses tindakan bila kode tidak aktif/kedaluwarsa/dicabut dan menyediakan arahan admin. | P0 |
| `FR-PJ-23` | Pengajuan Mendesak | Memberikan petunjuk eskalasi langsung ke admin; tidak menjamin prioritas sistem tanpa aturan. | P1 |
| `FR-PJ-24` | Status Perubahan | Menjelaskan bahwa ruang yang sudah disetujui untuk pihak lain tetap terlindungi meski ada perubahan. | P1 |
| `FR-PJ-25` | Keluar Dashboard PJ | Mengakhiri sesi PJ dan mengembalikan pengguna ke konteks publik. | P0 |

### 6.6 Validasi penting untuk PJ

- Penugasan yang tidak sesuai harus menghasilkan **akses ditolak**, sekalipun pengguna menebak ID kelas lain di URL.
- Kode PJ berlaku sesuai masa penugasan/semester dan dapat dicabut oleh admin.
- Permohonan harus dicek ulang saat disubmit jika slot berubah sejak halaman dibuka.
- Form harus menjelaskan bahwa **pengajuan diterima ≠ disetujui**.
- Notifikasi menaut ke pengajuan/pertemuan yang tepat tanpa mengungkap data kelas lain.
- Setelah suatu slot dilepas dan kemudian disetujui bagi pengguna lain, pemilik lama tidak memiliki aksi untuk mengambil kembali secara sepihak.

---

## 7. Persyaratan Fungsional — Dashboard Admin

### 7.1 Beranda Admin

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-ADM-01` | Ringkasan Dashboard | Menampilkan ringkasan operasional dari data yang benar: antrean, konflik, H-1, dan laporan. | P0 |
| `FR-ADM-02` | Pengajuan Menunggu | Menampilkan permohonan yang masih membutuhkan keputusan. | P0 |
| `FR-ADM-03` | Konflik Jadwal | Menampilkan ruangan dan interval dengan konflik yang perlu diverifikasi. | P0 |
| `FR-ADM-04` | Konfirmasi H-1 | Menampilkan PJ yang belum memberi respons tanpa melepas alokasi otomatis. | P0 |
| `FR-ADM-05` | Laporan Masuk | Menampilkan laporan ketidaksesuaian yang belum ditindaklanjuti. | P1 |

### 7.2 Peminjaman

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-ADM-06` | Antrean Pengajuan | Mengurutkan permohonan **valid** menurut waktu diterima server dan nomor urut otomatis. | P0 |
| `FR-ADM-07` | Detail & Verifikasi | Menampilkan informasi lengkap permohonan dan hasil cek jadwal resmi, slot, penutupan, serta konflik. | P0 |
| `FR-ADM-08` | Keputusan Pengajuan | Admin dapat menyetujui/menolak; harus menjaga tidak adanya dua persetujuan aktif pada ruang dan interval beririsan. | P0 |
| `FR-ADM-09` | Riwayat Pengajuan | Menyimpan serta menampilkan keputusan/pembatalan beserta penanda waktu dan pelaku. | P0 |
| `FR-ADM-10` | Alternatif & Tindak Lanjut | Admin dapat meninjau dan menyampaikan opsi alternatif ketika permohonan tidak dapat dipenuhi. | P1 |

### 7.3 Jadwal & Alokasi

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-ADM-11` | Daftar Jadwal Resmi | Menampilkan jadwal kelas lintas prodi beserta ruang, hari, sesi, dan semester. | P0 |
| `FR-ADM-12` | Tambah / Ubah Jadwal | Admin dapat membuat/mengubah jadwal resmi dan melihat dampaknya sebelum menyimpan. | P0 |
| `FR-ADM-13` | Pola Tiap Kelas | Mendukung pola **offline tiap minggu, online tiap minggu, bergantian, atau khusus**. | P0 |
| `FR-ADM-14` | Kalender Bersama | Menampilkan alokasi ruang/lab lintas program studi, sumber jadwal, dan ketidaksesuaian. | P0 |
| `FR-ADM-15` | Tinjauan Konflik | Admin dapat memeriksa bentrokan dan mencatat penyelesaian tanpa menghilangkan histori. | P0 |

### 7.4 Kelola Fasilitas

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-ADM-16` | Daftar Ruang Kuliah | Admin dapat melihat/mengelola identitas, lokasi, kapasitas, dan fasilitas ruang. | P1 |
| `FR-ADM-17` | Daftar Lab Komputer | Admin dapat mengelola fasilitas, jumlah PC berfungsi, software, dan pemeriksaan terakhir. | P1 |
| `FR-ADM-18` | Penutupan Ruang | Admin dapat menandai penutupan karena kerusakan/ujian/alasan khusus dengan rentang waktu. | P0 |
| `FR-ADM-19` | Pemindahan Alokasi | Admin dapat memindahkan alokasi sesuai aturan, memeriksa konflik target, dan memberi notifikasi dampak. | P1 |
| `FR-ADM-20` | Riwayat Perubahan | Menampilkan jejak perubahan fasilitas, penutupan, dan pemindahan alokasi. | P0 |

### 7.5 PJ & Kode Akses

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-ADM-21` | Daftar Penugasan PJ | Admin dapat mengelola keterkaitan PJ dengan prodi, kelas, mata kuliah, dan semester. | P0 |
| `FR-ADM-22` | Semester & Masa Aktif | Menetapkan awal/akhir masa tugas dan berlakunya akses PJ dalam WIB. | P0 |
| `FR-ADM-23` | Terbitkan Kode Unik | Admin menerbitkan kode PJ untuk penugasan yang sah; kode tidak ditampilkan kepada publik. | P0 |
| `FR-ADM-24` | Ganti / Cabut Kode | Admin dapat merotasi/mencabut kode; tindakan berpengaruh pada akses berikutnya. | P0 |
| `FR-ADM-25` | Riwayat Penugasan | Mempertahankan riwayat penugasan lama dan keterkaitannya dengan keputusan historis. | P1 |

### 7.6 Laporan & Tindak Lanjut

| ID | Subhalaman | Persyaratan fungsional | Prioritas |
|---|---|---|---|
| `FR-ADM-26` | PJ Belum Konfirmasi | Admin dapat memantau kelas tanpa respons H-1 tanpa membebaskan ruang sepihak secara otomatis. | P0 |
| `FR-ADM-27` | Laporan Ketidaksesuaian | Menampilkan laporan kondisi/jadwal menurut ruang, interval, isi, status tindak lanjut. | P1 |
| `FR-ADM-28` | Detail Tindak Lanjut | Admin mencatat pemeriksaan dan koreksi yang dilakukan serta alasan penanganannya. | P1 |
| `FR-ADM-29` | Notifikasi Terdampak | Menginformasikan perubahan keputusan/alokasi kepada pihak yang berkaitan. | P1 |
| `FR-ADM-30` | Riwayat Keputusan | Menyediakan catatan audit keputusan yang tetap dapat ditelusuri setelah data berubah. | P0 |

---

## 8. Aturan Bisnis Inti — Wajib Konsisten di Tiga Portal

### `BR-01` — Tiga keluarga status independen

| Entitas status | Nilai |
|---|---|
| **Ketersediaan slot** | `Tersedia`, `Dialokasikan`, `Tidak Tersedia`, `Konflik` |
| **Status pengajuan** | `Menunggu Keputusan`, `Disetujui`, `Ditolak`, `Dibatalkan` |
| **Konfirmasi pertemuan PJ** | `Belum Dikonfirmasi`, `Tetap Offline`, `Berubah Online` |

Status tersebut mewakili hal **berbeda** dan tidak boleh disatukan dalam satu kolom/variabel status tunggal. Contoh yang sah: **slot `Dialokasikan` + konfirmasi `Belum Dikonfirmasi`**.

### `BR-02` — Jadwal resmi membentuk alokasi awal

- Alokasi berdasarkan jadwal resmi dan pola kelas (offline/online/bergantian/khusus).
- Pertemuan yang dijadwalkan offline melindungi slot ruang sampai alokasi berakhir atau dilepas sesuai aturan.
- Tidak ada klaim bahwa jadwal awal selalu mencerminkan kondisi fisik aktual; laporan ketidaksesuaian dan konfirmasi menangani selisih ini.

### `BR-03` — Pengingat dan konfirmasi H-1

- Sebelum pertemuan, PJ menerima pengingat **H-1** untuk menyatakan tetap offline atau berubah online.
- Bila PJ **tidak memberi respons**, status konfirmasi menjadi/tetap `Belum Dikonfirmasi`; **alokasi ruang tetap dilindungi**; admin menerima informasi untuk tindak lanjut.
- Tidak boleh ada perubahan otomatis menjadi `Tersedia` hanya karena pesan H-1 diabaikan.

### `BR-04` — Pelepasan alokasi kelas menjadi online

- PJ dengan penugasan sah dapat menyatakan pertemuan `Berubah Online`.
- Aksi **Lepaskan Alokasi** harus eksplisit, menampilkan konsekuensi, dan meminta konfirmasi.
- Sistem memeriksa hak PJ dan keadaan terbaru sebelum menyimpan pelepasan.
- Slot yang dilepas baru dapat diajukan pihak lain sesuai aturan dan tidak otomatis dianggap sudah disetujui bagi pemohon baru.
- Jika slot dilepas dan kemudian dialokasikan/disetujui untuk pihak lain, PJ lama tidak dapat mengambilnya kembali sepihak.

### `BR-05` — Pengajuan dan persetujuan oleh admin

- Pengajuan yang berhasil dikirim berstatus **`Menunggu Keputusan`** sampai ada tindakan admin.
- Prioritas pemeriksaan mengacu pada **waktu penerimaan permohonan valid oleh server + nomor urut otomatis**.
- **Hanya keputusan admin** yang mengubah pengajuan menjadi `Disetujui` atau `Ditolak`.
- Sistem harus memeriksa ulang konflik, alokasi resmi, dan penutupan pada **saat persetujuan**, bukan hanya pada saat pencarian/submit.
- Dua permohonan pada **ruang yang sama** dengan interval beririsan **tidak boleh sama-sama disetujui**.
- Penolakan harus memiliki alasan yang dapat ditampilkan kepada PJ; histori keputusan tidak hilang.

### `BR-06` — Definisi irisan waktu (aturan teknis yang diusulkan)

Untuk ruang yang sama pada tanggal relevan, dua interval `[mulaiA, selesaiA)` dan `[mulaiB, selesaiB)` beririsan jika:

```text
mulaiA < selesaiB AND mulaiB < selesaiA
```

Interval yang **bertemu tepat di batas**, misalnya 09.00–10.00 dan 10.00–11.00, tidak dianggap beririsan berdasarkan rumus ini. **Namun** bila institusi menerapkan waktu pergantian kelas/ruang (*buffer*), aturan buffer harus ditetapkan sebelum implementasi final; jangan berasumsi pasti nol.

### `BR-07` — Lab komputer dipinjam satu ruang penuh

- Satu lab diperlakukan sebagai satu objek alokasi.
- Lab yang telah dialokasikan pada rentang tertentu tidak dapat disetujui bagi kelompok lain di rentang beririsan.
- Informasi PC berfungsi/software adalah metadata keputusan, bukan pilihan kursi atau komputer individual.

### `BR-08` — Perubahan operasional ruang dan laporan

- Penutupan ruangan karena ujian, kerusakan, atau kondisi lain memengaruhi kemungkinan persetujuan.
- Perubahan jadwal/alokasi dan pemindahan ruangan harus memeriksa dampaknya kepada pihak terdampak serta memiliki catatan siapa/kapan/alasan.
- `Lapor Ketidaksesuaian` hanya membuat laporan yang perlu ditinjau, **bukan** otomatis menghapus jadwal atau hak penggunaan.

### `BR-09` — Sumber data dan informasi yang boleh dipublikasikan

- Waktu/jadwal resmi merupakan sumber awal untuk alokasi.
- Data ruangan, kapasitas, daftar perangkat lunak, komputer berfungsi, dan pemeriksaan terakhir harus berasal dari pengelola/rekaman yang berwenang.
- Data diri, kode akses PJ, dan kontak nonpublik tidak boleh muncul dalam layar publik.
- Ketika data belum tersedia atau belum diverifikasi, tampilan harus menyatakannya, bukan membuat angka perkiraan sebagai fakta.

---

## 9. Kebutuhan Data Konseptual

**Ini daftar entitas/atribut kebutuhan, bukan ERD final atau pilihan database.** Nama teknis dan relasi fisik dapat disesuaikan setelah proses analisis data.

| Entitas | Atribut penting minimal | Catatan |
|---|---|---|
| `Facility` | ID, jenis (`ruang_kuliah`/`lab_komputer`), nama/kode, gedung, lantai, kapasitas, fasilitas, status operasional | Identitas tetap meskipun jadwal berubah |
| `LabEquipment` | ID lab, jumlah komputer berfungsi, tanggal pemeriksaan, catatan fasilitas | Jumlah operasional tidak boleh disamakan dengan kapasitas tanpa verifikasi |
| `LabSoftware` | ID lab, aplikasi/IDE/compiler, versi (opsional), keterangan | Mendukung banyak software per lab |
| `CourseClass` | ID kelas, mata kuliah, prodi, semester, pola online/offline | Pola dapat khusus untuk minggu/sesi tertentu |
| `OfficialSchedule` | ID, kelas, ruang, tanggal/hari, sesi, jam mulai/akhir, sumber, periode berlaku | Dasar alokasi awal dan audit perubahan |
| `Allocation` | ID, ruang, tanggal/interval, sumber, pemegang, status aktif/dilepas, waktu perubahan | Sumber dapat berupa jadwal resmi atau pengajuan disetujui |
| `MeetingConfirmation` | ID pertemuan, PJ, status konfirmasi, waktu, opsi pelaksanaan | Disimpan **terpisah** dari Allocation |
| `PJAssignment` | ID, identitas PJ, kelas/mata kuliah/prodi, semester, mulai/akhir, status tugas | Scope akses PJ |
| `PJAccessCredential` | Referensi penugasan, verifikasi kode secara aman, status berlaku/dicabut, masa aktif | Jangan menyimpan/menampilkan kode mentah secara terbuka |
| `BorrowingRequest` | ID/nomor urut, PJ/penugasan, ruang, mulai/akhir, alasan, waktu diterima server, status, keputusan | Persetujuan dilakukan oleh admin |
| `RequestDecision` | ID permohonan, admin, keputusan, alasan, waktu, metadata perubahan | Jejak keputusan dibutuhkan |
| `RoomClosure` | Ruang, mulai/akhir, alasan, operator, status | Menghambat persetujuan saat penutupan |
| `MismatchReport` | ID, pelapor, ruang, waktu, isi, status tindak lanjut, admin | Laporan tidak mengubah alokasi secara otomatis |
| `Notification` | Penerima/peran, tipe, referensi objek, isi, waktu, status baca | Kanal komunikasi di luar sistem belum ditetapkan |
| `AuditLog` | Aktor, aksi, jenis objek, ID objek, waktu, sebelum/sesudah bila relevan | Khususnya untuk keputusan dan alokasi |
| `CampusService` | Nama/kategori, lokasi, jam, syarat, deskripsi, kontak publik | Informasional, tanpa antrean digital pada tahap awal |

### 9.1 Integritas data minimum

1. Setiap alokasi terhubung ke tepat satu fasilitas yang sah dan interval waktu yang valid.
2. Setiap konfirmasi PJ terhubung ke pertemuan/penugasan sah.
3. Setiap permohonan menyimpan nomor urut dan waktu diterima dari server setelah validasi.
4. Keputusan dan riwayat tidak hilang hanya karena admin mengubah data atau PJ berganti.
5. Pencabutan kode tidak menghapus histori penugasan/pengajuan yang sebelumnya sah.
6. Data perubahan perlu memiliki cap waktu dan identitas pelaku untuk audit.

---

## 10. Persyaratan Nonfungsional

| ID | Kategori | Persyaratan | Verifikasi |
|---|---|---|---|
| `NFR-01` | Desain visual | Menggunakan identitas MATRA: teal `#006569`, kuning `#FFDD00`, putih `#FFFFFF`, abu-abu `#F2F5F7`, font Poppins. | Review terhadap `design.md` dan Figma |
| `NFR-02` | Desktop | Berbasis referensi frame 1440px, area konten publik maksimal 1160px. | Screenshot/layout inspection |
| `NFR-03` | Responsivitas | Tetap usable pada desktop, tablet, mobile; tidak ada overflow horizontal global. | Uji viewport (mis. 1440, 1024, 768, 390px) |
| `NFR-04` | Aksesibilitas | Keyboard dapat mengakses input, kalender, tombol, tabel, dialog; fokus terlihat; status tidak hanya warna. | Audit keyboard dan screen-reader dasar |
| `NFR-05` | Kontras | Target minimum WCAG AA: teks normal 4.5:1, teks besar 3:1; status berlabel. | Pengujian kontras per komponen |
| `NFR-06` | Keamanan peran | Server memverifikasi session, peran, ruang lingkup penugasan, dan masa aktif setiap tindakan mutasi. | Uji akses langsung URL/API tanpa izin |
| `NFR-07` | Kode PJ | Kode tidak mudah ditebak, tidak dibocorkan, dapat berakhir dan dicabut; login memiliki pembatasan percobaan yang wajar. | Security testing sesuai kebijakan kampus |
| `NFR-08` | Admin | Autentikasi admin terpisah dari kode PJ; operasi perubahan dicatat. | Uji pemisahan akses dan audit |
| `NFR-09` | Konsistensi waktu | Waktu penggunaan dan log operasional ditampilkan dalam WIB; penyimpanan tetap konsisten secara sistem. | Uji format zona waktu dan batas hari |
| `NFR-10` | Konsistensi status | Tiga keluarga status disimpan dan ditampilkan terpisah. | Tes kombinasi slot/PJ/pengajuan |
| `NFR-11` | Keandalan keputusan | Keputusan admin atas satu slot beririsan diproses atomik agar tidak tercipta *double booking*. | Tes dua persetujuan serentak |
| `NFR-12` | Auditabilitas | Riwayat keputusan, penugasan, alokasi, penutupan dan pemindahan dapat ditelusuri. | Pemeriksaan audit log |
| `NFR-13` | Ketepatan informasi | UI menunjukkan kapan status terakhir diperbarui bila relevan; data belum tersedia diberi label. | Uji data kosong/kedaluwarsa |
| `NFR-14` | Performa UX | Pencarian dan filter menampilkan loading/empty/error state; tidak ada tombol yang terlihat berfungsi tetapi inert. | Uji alur dan simulasi jaringan lambat |
| `NFR-15` | Konsistensi visual | Komponen header, sidebar, badge, card, dialog, tabel, dan formulir reusable antar peran. | Design system audit |
| `NFR-16` | Privasi | Informasi pribadi PJ/admin dan kode akses tidak ditampilkan dalam area publik atau URL yang terekspos. | Pemeriksaan tampilan, log dan URL |
| `NFR-17` | Browser | Target browser desktop/mobile modern; versi spesifik dan teknologi backend masih harus ditentukan. | Compatibility testing |
| `NFR-18` | Perubahan evolusioner | Prototipe dapat diperbaiki berdasarkan pengujian, tanpa membuang struktur dan definisi status yang sudah divalidasi. | Catatan iterasi/hasil usability test |

**Parameter yang belum ditentukan oleh sumber:** framework, API/backend, database, target latency numerik, uptime SLA, mekanisme SSO, layanan notifikasi eksternal, retensi data, dan infrastruktur hosting. Jangan menetapkan angka atau teknologi tersebut sebagai keputusan final tanpa konfirmasi pemangku kepentingan.

---

## 11. Skenario Pengujian dan Kriteria Penerimaan

### 11.1 Halaman Publik

| ID Uji | Skenario | Kriteria lulus | Ref |
|---|---|---|---|
| `AT-PUB-01` | Mahasiswa membuka Beranda | Beranda, daftar ruang, lab dan layanan bisa diakses tanpa login. | FR-PUB-00/01/06/16 |
| `AT-PUB-02` | Cari ruang pada tanggal dan 09.00–11.00 WIB | Hasil hanya mengacu pada tanggal dan interval tersebut; konteks filter terlihat. | FR-PUB-11/13 |
| `AT-PUB-03` | Jam selesai sebelum/sama dengan jam mulai | Sistem menolak dan menunjukkan pesan validasi. | FR-PUB-13 |
| `AT-PUB-04` | Filter gedung, lantai, kapasitas, fasilitas | Daftar dan jumlah hasil berubah sesuai filter; reset memulihkan kondisi yang tepat. | FR-PUB-12 |
| `AT-PUB-05` | Ruang dialokasikan, PJ belum konfirmasi | Slot berlabel `Dialokasikan`, konfirmasi `Belum Dikonfirmasi`; tidak muncul sebagai `Tersedia`. | FR-PUB-04/05, BR-03 |
| `AT-PUB-06` | Ruang tidak ditemukan | Empty state dan saran mengubah filter/cari alternatif tampil. | FR-PUB-14 |
| `AT-PUB-07` | Melihat informasi Lab Komputer | Kapasitas/PC/software ditampilkan jika ada data dan booking disebut satu lab penuh. | FR-PUB-07/08 |
| `AT-PUB-08` | Membuka detail layanan publik | Hanya lokasi, jam, persyaratan, dan kontak publikasi yang tampil. | FR-PUB-17 |
| `AT-PUB-09` | Pengunjung menekan aksi pengajuan | Pengunjung diarahkan ke petunjuk/akses PJ; tidak dapat membuat permohonan tanpa wewenang. | FR-PUB-18/20 |

### 11.2 Dashboard PJ

| ID Uji | Skenario | Kriteria lulus | Ref |
|---|---|---|---|
| `AT-PJ-01` | Masuk dengan kode penugasan aktif | PJ dapat melihat kelas yang ditugaskan dan dashboard pribadinya. | FR-PUB-18, FR-PJ-01/02 |
| `AT-PJ-02` | Kode PJ kedaluwarsa/dicabut | Aksi PJ ditolak dan halaman `Kode Tidak Berlaku` tampil dengan arahan admin. | FR-PJ-22 |
| `AT-PJ-03` | PJ mencoba membuka kelas yang bukan tugasnya | Akses detail dan semua aksi mutasi ditolak, termasuk lewat URL/API langsung. | FR-PJ-02/07 |
| `AT-PJ-04` | PJ mengabaikan pengingat H-1 | Status konfirmasi tetap belum, **alokasi tetap dilindungi**; ada item admin untuk tindak lanjut. | FR-PJ-03, BR-03 |
| `AT-PJ-05` | PJ konfirmasi Tetap Offline | Konfirmasi tercatat, status slot tetap dialokasikan selama masih berlaku. | FR-PJ-08/10 |
| `AT-PJ-06` | PJ memilih Berubah Online | Konfirmasi tercatat; sistem tidak boleh diam-diam melepas ruang tanpa aksi pelepasan eksplisit. | FR-PJ-08/09, BR-04 |
| `AT-PJ-07` | PJ memilih Lepaskan Alokasi | Dialog konsekuensi tampil; jika disetujui dan valid, pelepasan tercatat. | FR-PJ-09 |
| `AT-PJ-08` | PJ batal pada dialog pelepasan | Status alokasi tidak berubah. | FR-PJ-09 |
| `AT-PJ-09` | PJ mengirim form peminjaman valid | Nomor pengajuan terlihat; status awal **Menunggu Keputusan**, bukan Disetujui. | FR-PJ-13, BR-05 |
| `AT-PJ-10` | Slot tiba-tiba terpakai sebelum submit | Sistem memperbarui hasil validasi, menolak pengajuan yang tidak layak, dan memberi alternatif bila ada. | FR-PJ-13/14 |
| `AT-PJ-11` | Admin menolak pengajuan PJ | PJ melihat alasan penolakan dan dapat membuka opsi alternatif. | FR-PJ-17/19 |
| `AT-PJ-12` | PJ mengirim laporan ketidaksesuaian | Laporan tercatat; hak slot/alokasi tidak berubah otomatis. | FR-PJ-15, BR-08 |
| `AT-PJ-13` | PJ mencoba mengambil kembali slot yang sudah dialokasikan untuk pihak lain | Tindakan ditolak; ditampilkan petunjuk mencari alternatif. | FR-PJ-24, BR-04 |
| `AT-PJ-14` | PJ keluar dari dashboard | Sesi PJ berakhir; halaman publik tetap bisa diakses tanpa login. | FR-PJ-25 |

### 11.3 Dashboard Admin

| ID Uji | Skenario | Kriteria lulus | Ref |
|---|---|---|---|
| `AT-ADM-01` | Login admin menggunakan kredensial berizin | Portal operasional terlihat tanpa memakai kode PJ. | FR-PUB-19 |
| `AT-ADM-02` | Memeriksa antrean beberapa pengajuan | Pengajuan valid diurutkan menurut cap waktu penerimaan server + nomor urut. | FR-ADM-06 |
| `AT-ADM-03` | Admin setujui pengajuan yang tidak konflik | Pengajuan menjadi Disetujui dan alokasi dibuat pada ruang/interval yang benar. | FR-ADM-07/08 |
| `AT-ADM-04` | Dua admin bersamaan menyetujui ruang dan interval bertabrakan | Maksimal satu persetujuan aktif berhasil; transaksi lainnya ditolak/diminta cek ulang. | FR-ADM-08, NFR-11 |
| `AT-ADM-05` | Admin menolak pengajuan | Alasan tercatat, PJ menerima informasi status Ditolak. | FR-ADM-08/09 |
| `AT-ADM-06` | Admin menutup ruang pada waktu tertentu | Slot terdampak tidak ditawarkan sebagai dapat disetujui; konflik ditampilkan jika ada alokasi aktif. | FR-ADM-18 |
| `AT-ADM-07` | Admin mengubah jadwal resmi | Cek konflik terjadi sebelum simpan dan perubahan memiliki log. | FR-ADM-12/15/20 |
| `AT-ADM-08` | PJ belum merespons H-1 | Admin dapat melihat daftar perlu tindak lanjut, tanpa pelepasan otomatis. | FR-ADM-26 |
| `AT-ADM-09` | Admin menerbitkan, mengganti, lalu mencabut kode PJ | Hanya penugasan aktif berhak masuk; histori penugasan lama tetap tersedia. | FR-ADM-21/23/24/25 |
| `AT-ADM-10` | Admin menangani laporan ketidaksesuaian | Keputusan, alasan, petugas, waktu dan notifikasi terdampak dapat ditelusuri. | FR-ADM-27/28/29/30 |
| `AT-ADM-11` | Admin memindahkan alokasi ke ruang lain | Slot target diverifikasi dan pihak terdampak diberi informasi. | FR-ADM-19/29 |

### 11.4 UI/UX lintas peran

- [ ] Header/navigasi publik konsisten dengan high-fidelity awal; CTA mempunyai tujuan nyata.
- [ ] Semua label status konsisten dengan tiga keluarga status pada `BR-01`.
- [ ] Aksi destruktif menampilkan konteks, konsekuensi dan konfirmasi.
- [ ] Kalender dapat dinavigasi dengan keyboard dan berlabel lengkap per sel.
- [ ] Tampilan desktop 1440px nyaman tanpa clipping/overlap; tablet/mobile tidak overflow secara global.
- [ ] Tidak ada data dummy yang disajikan sebagai informasi operasional aktual.
- [ ] Ada state `loading`, `empty`, `error`, `success`, `no permission`, dan `expired code` pada alur terkait.
- [ ] Nama grup menu tepat mengikuti sitemap Publik/PJ/Admin.
- [ ] Pengujian usability mencakup kasus bentrokan GDS 607 dan pencarian ruang pengganti.

---

## 12. Urutan Pengembangan — Evolutionary Prototyping

Dokumen konsep MATRA memilih pendekatan **Membuat Prototipe → Menguji → Mendapatkan Masukan → Memperbaiki → Menguji Kembali → Sistem Final**. Untuk mengurangi risiko proyek, usulan iterasi berikut tetap mengikuti fokus awal Ruang Kuliah dalam dokumen UTS.

| Iterasi | Cakupan prioritas | Hasil yang diharapkan |
|---|---|---|
| **I. Alur inti Ruang Kuliah** | Beranda Publik, cari/kalender/detail slot, status; akses PJ, konfirmasi H-1, pengajuan; admin verifikasi/putusan minimum | Prototipe dapat menguji kasus bentrokan dan mencari alternatif |
| **II. Kejelasan keputusan** | Pengajuan Saya, notifikasi, laporan, konflik, penugasan/kode PJ, audit | Hasil keputusan dan tindakan koreksi dapat dipantau |
| **III. Lab Komputer** | Daftar/detail, software, PC berfungsi, pemeriksaan, kalender, booking lab utuh | Alur lab konsisten dengan aturan ruang kuliah |
| **IV. Layanan Kampus** | Direktori, detail, petunjuk, akses | Pengguna menemukan informasi layanan tanpa antrean digital |
| **V. Pemolesan dan responsivitas** | Tablet/mobile, aksesibilitas, semua state, pengujian berbagai data/role | UI konsisten dan siap evaluasi lanjutan |

Iterasi tersebut adalah **rekomendasi teknis** untuk mencapai sasaran dokumen; urutan resmi dan pembagian tugas perlu disepakati tim.

---

## 13. Struktur Artifak dan Handoff yang Direkomendasikan

Dokumen contoh ChemistryLab menggunakan satu `index.html`, tetapi **kebutuhan tersebut khusus contoh kimia dan tidak berlaku otomatis untuk MATRA**. Website MATRA memiliki tiga peran, banyak layar, otorisasi, dan alokasi yang memerlukan desain sistem lebih besar. Struktur folder di bawah adalah **usulan**, bukan ketetapan framework.

```text
MATRA/
├── design.md              # Design system, layout, komponen, layar dan flow
├── requirement.md         # Hak akses, kebutuhan, aturan bisnis, acceptance test
├── design-references/     # Referensi screenshot/sitemap yang dimiliki tim
├── prototype/             # Prototipe dan asset UI (pilihan teknis belum diputuskan)
├── docs/
│   ├── decision-log.md    # Keputusan dari admin/PJ/pengelola
│   └── test-scenarios.md  # Skenario usability dan hasil iterasi
└── implementation/        # Struktur kode mengikuti stack yang disepakati kemudian
```

### 13.1 Syarat transisi dari desain ke implementasi

1. Sahkan kamus status dan istilah UI tiga peran.
2. Periksa ulang alur pelepasan alokasi pada kelas berubah online.
3. Validasi daftar ruang/jadwal resmi lintas prodi dan bentuk sesinya.
4. Tentukan model akses kode PJ, autentikasi admin, serta saluran pengingat H-1.
5. Lengkapi frame Publik 03–20 dan desain PJ/Admin; uji prototipe dengan skenario bentrokan.
6. Tentukan kontrak data, pengamanan operasi admin, dan cara mencegah race condition pada persetujuan.
7. Lakukan review keamanan dan data pribadi sebelum memakai data operasional nyata.

---

## 14. Daftar Keputusan yang Masih Terbuka

| ID | Pertanyaan belum ditentukan dari sumber | Konsekuensi bila belum diputuskan |
|---|---|---|
| `OD-01` | Rentang jam/sesi resmi, buffer pergantian ruang, hari/libur akademik | Algoritma konflik dan picker waktu belum final |
| `OD-02` | Sumber jadwal resmi dan siapa menyetujui koreksi lintas prodi | Status alokasi bisa tidak akurat |
| `OD-03` | Tata cara penerbitan serta penyampaian kode PJ; masa berlaku yang tepat | UX login dan keamanan PJ belum lengkap |
| `OD-04` | Media pengingat H-1 dan notifikasi keputusan (in-app saja atau kanal lain) | Rancangan notifikasi eksternal belum bisa ditetapkan |
| `OD-05` | Kriteria sah pembatalan pengajuan yang sudah disetujui | Aksi batalkan butuh pembatasan terperinci |
| `OD-06` | Kriteria penutupan ruang dan prosedur pemindahan paksa/ darurat | Alur admin pada kondisi khusus belum final |
| `OD-07` | Format dan izin publikasi data pribadi, pengelola, serta kontak layanan | Potensi eksposur data yang tidak semestinya |
| `OD-08` | Sumber data pemeriksaan lab, jumlah PC aktif, versi software | Detail lab dapat menjadi usang |
| `OD-09` | Nilai status Dialokasikan `#006569` vs `#67C6BE` dalam sumber UTS | Visual status perlu harmonisasi final, lihat `design.md` |
| `OD-10` | Detail infrastruktur, database, keamanan akun admin dan target performa | Perlu keputusan engineering sebelum produksi |
| `OD-11` | Kebijakan pinjam mendesak dan apakah admin dapat memberi pengecualian operasional | Eskalasi belum dapat diprogram sebagai aturan otomatis |
| `OD-12` | Isi fasilitas/layanan di luar tiga kelompok layanan utama | Konten direktori dan izin publikasi belum lengkap |

---

## 15. Checklist Final Penerimaan Spesifikasi

- [ ] Struktur Publik mencakup **20 subhalaman dari empat kelompok + Beranda Publik** (total **21** frame).
- [ ] Struktur PJ mencakup **25 subhalaman dari lima kelompok** dan jalur masuk PJ.
- [ ] Struktur Admin mencakup **30 subhalaman dari enam kelompok** dan login admin terpisah.
- [ ] Publik tetap bisa membaca jadwal dan mencari ruang tanpa login.
- [ ] Hak PJ dibatasi pada penugasan aktif dan tidak membuka aksi admin.
- [ ] Alokasi resmi terjaga sampai berakhir/dilepas, termasuk saat belum ada konfirmasi H-1.
- [ ] Perubahan online tidak otomatis memberi hak slot kepada pihak lain tanpa pemeriksaan dan keputusan.
- [ ] Lab dipinjam per ruangan penuh, bukan PC per pengguna.
- [ ] Permohonan mengikuti urutan valid dan admin menjadi pihak yang menyetujui/menolak.
- [ ] Tidak ada dua persetujuan aktif yang beririsan untuk fasilitas sama.
- [ ] Konflik, keputusan, dan tindakan koreksi memiliki jejak riwayat yang dapat ditinjau.
- [ ] Semua kriteria uji Publik/PJ/Admin pada bagian 11 tersedia untuk validasi.
- [ ] Data contoh/prototipe dan keputusan yang belum final tetap ditandai secara eksplisit.

**Bacaan pendamping:** `design.md` mengatur bagaimana setiap kebutuhan dirender sebagai desain UI/UX. `requirement.md` ini mengatur **apa yang perlu dilakukan sistem, siapa yang berwenang, dan bagaimana memverifikasi bahwa alurnya benar**.

---

## ADDENDUM Implementasi v2 (Mengubah Kebutuhan Prototipe)

Ketentuan di bawah mengungguli spesifikasi antarmuka v1.1 yang bertentangan, **tanpa mengubah aturan bisnis alokasi dan persetujuan**.

- `FR-V2-01`: halaman `/cari` harus merender tanpa crash dan memiliki fallback UI bila muncul error render.
- `FR-V2-02`: panel filter fasilitas menampilkan dropdown nama ruang, bukan input teks bebas. Pilihan ruang kuliah adalah GDS 507, 508, 512, 514, 515, 517, 607, 608, 613, GdM 215, GHA 109. Untuk pencarian lab, opsi Lab Komputer muncul sesuai jenis fasilitas.
- `FR-V2-03`: dropdown Gedung, Kapasitas Minimum, dan Lantai dihapus dari sidebar filter; fitur checkbox dan jenis ruang tetap bisa digunakan.
- `FR-V2-04`: kapasitas kursi diperlakukan sebagai metadata tambahan, bukan angka ringkasan utama. GDS 613 berjumlah 13 kursi. Nilai kursi umum harus diakui belum diverifikasi sebelum penerapan riil.
- `FR-V2-05`: jumlah komputer lab yang tersedia tidak boleh hilang, dan kondisi belum ada data harus ditampilkan dengan teks jelas.
- `FR-V2-06`: ikon Search menggantikan tombol login pojok kanan navbar; link login Admin di footer dihapus.
- `FR-V2-07`: pusat login `/login` menyediakan portal khusus Mahasiswa, PJ, dan Admin, dengan tiga formulir terpisah. Akses mahasiswa biasa tetap baca-saja.
- `FR-V2-08`: login dan otorisasi pada frontend statis **hanya simulasi**, bukan autentikasi aman. Penerapan riil tetap membutuhkan backend dan server-side authorization.
- `FR-V2-09`: rute lama `/masuk-pj` dan `/login-admin` dialihkan ke halaman login baru agar tautan lama tetap valid.
- `NFR-V2-01`: perubahan frontend tidak menambah dependensi dibanding v1.1 sehingga dapat dipasang sebagai patch tanpa `npm install` ulang.

---

## Amandemen kebutuhan v3 (Oktober 2026)

1. Filter hardware umum harus dihapus dari daftar Ruang Kuliah, pencarian gabungan, dan daftar Lab Komputer.
2. Filter Lab Komputer hanya melibatkan nama lab dan daftar perangkat lunak; data software belum terverifikasi harus ditandai sebagai contoh.
3. GDS 507–516 harus dikelompokkan sebagai laboratorium komputer. GDS 517 harus berada pada kategori ruang kuliah.
4. Kalender dan detail ruang harus memperlihatkan alasan ketidaktersediaan, nama mata kuliah, kelas, kode dosen, waktu sampai jam berapa, serta penutupan yang tumpang tindih.
5. Jadwal mata kuliah diproyeksikan berdasarkan 241 entri yang memiliki lokasi jelas dalam transkripsi Semester 125; pengaturan kelompok A/B/C/X/Y mengikuti kalender bergilir. Entri tanpa lokasi tidak mengunci ruang.
6. Rentang pekan UTS/UAS dan lab yang belum mempunyai alokasi tercatat tidak boleh dinyatakan bebas tanpa verifikasi; tampilkan status Belum Terverifikasi.
7. Pencarian cepat navbar mendukung input dan rekomendasi fitur, ruang, mata kuliah dan perangkat lunak.
8. Informasi komputer tetap tersedia per lab, tanpa mengarang jumlah terverifikasi untuk ruang GDS yang belum dipetakan perangkatnya.
9. Kompatibilitas data browser lintas versi tidak dijamin; migrasi produksi membutuhkan backend, peran, dan audit log yang sah.

---

## Amandemen kebutuhan v4 — Login dan Kontrol Form (Menggantikan FR-V2-07)

- `FR-V4-01`: pusat akses `/login` hanya menyediakan pilihan **Publik / PJ / Admin**. Publik dapat langsung menuju halaman umum tanpa akun. Form login mahasiswa lama digantikan alur Publik.
- `FR-V4-02`: PJ memasukkan satu kode unik aktif pada login pertama. Setelah sukses, sesi tetap tersedia pada refresh/kunjungan selanjutnya sampai logout eksplisit atau penyimpanan browser dibersihkan.
- `FR-V4-03`: Admin menggunakan **email dan kata sandi**. Sesi yang valid bertahan seperti PJ sampai logout; setelah logout, login ulang meminta email dan password kembali.
- `FR-V4-04`: logout menghapus status sesi dan menavigasikan pengguna ke pilihan login; kode PJ dan password Admin tidak pernah ditulis ke penyimpanan browser oleh aplikasi.
- `FR-V4-05`: alur sesi lintas tab harus menyelaraskan logout. Operasi PJ/Admin tetap dibatasi berdasarkan role untuk prototipe.
- `FR-V4-06`: seluruh date picker menggunakan format Bahasa Indonesia, navigasi bulan, pemilihan hari, dan dapat dikendalikan mouse atau keyboard. Nilai data yang disimpan tetap ISO `YYYY-MM-DD`.
- `FR-V4-07`: input waktu memilih jam dan menit WIB dalam format data `HH:mm`, termasuk menit dengan kelipatan 5 sesuai jadwal.
- `FR-V4-08`: dropdown pilihan memakai gaya visual yang konsisten pada seluruh area aplikasi, dengan pilihan terpilih, hover/fokus, Escape dan klik di luar untuk menutup.
- `FR-V4-09`: hilangkan notice berjudul **Informasi direktori** dari detail layanan tanpa menghapus konten lokasi, jam, kontak, dan persyaratan yang relevan.
- `FR-V4-10`: jadwal Semester 125, pemisahan status, dan pengelolaan alokasi dari v3 tidak boleh berubah akibat revisi komponen/login.
- `NFR-V4-01`: tidak ada dependency React/Tailwind/Vite tambahan agar patch ke v4 cukup menimpa source tanpa `npm install` ulang.
- `SEC-V4-01`: login v4 adalah simulasi frontend saja, **bukan autentikasi/otorisasi produksi**. Backend, sesi aman HTTP-only, validasi server, dan mekanisme keamanan yang sesuai tetap diperlukan sebelum dipakai sungguhan.

---

## Amandemen kebutuhan v6 — Media WebP (Oktober 2026)

- `FR-V6-01`: hero Publik harus menampilkan `main.webp`, bukan teks alt atau broken-image icon dari ilustrasi SVG sebelumnya.
- `FR-V6-02`: bagian Kenali MATRA memakai `kenali-matra.webp`.
- `FR-V6-03`: kartu kategori Ruang Kuliah, Lab Komputer, dan Layanan Kampus masing-masing menampilkan ilustrasi WebP yang tepat.
- `FR-V6-04`: tiga jenis layanan kampus menggunakan gambar yang berbeda berdasarkan pemetaan ID layanan yang sudah ditentukan; gambar muncul di kartu daftar dan detail.
- `FR-V6-05`: saat foto per-ruang/lab/layanan `.webp` tersedia dalam folder `public/assets/foto/`, tampilkan foto itu terlebih dahulu. `.jpg` tetap kompatibel; bila foto tidak ada tampilkan ilustrasi bawaan yang relevan, bukan gambar rusak.
- `NFR-V6-01`: aset gambar baru harus berupa WebP lokal dengan transparansi dipertahankan; aplikasi tidak perlu meminta aset dari server gambar pihak ketiga.
- `NFR-V6-02`: layout responsif harus menghindari crop karakter/ilustrasi saat desktop/tablet/mobile. Preferensi sistem `prefers-reduced-motion` tetap didukung.
- `NFR-V6-03`: tidak ada dependensi baru; pembaruan dari v5 dapat dilakukan dengan patch dan `npm run dev` tanpa memasang ulang dependensi.
- `NFR-V6-04`: semua aturan jadwal Semester 125, ketersediaan, autentikasi demo, dan peminjaman lama tetap berlaku tanpa perubahan data.

---

## Addendum v6.1 — Perubahan Frontend

- **NAV-6.1-01:** Sistem menambahkan opsi **Beranda** di kiri opsi Ruang Kuliah pada navbar publik, baik desktop maupun mobile, menuju `/`.
- **NAV-6.1-02:** Status aktif **Beranda** hanya terjadi pada rute `/`.
- **UI-6.1-01:** Menampilkan animasi loading singkat dengan warna kuning `#FFDD00` saat pertama kali membuka aplikasi.
- **UI-6.1-02:** Menampilkan progress bar kuning saat navigasi antarhalaman.
- **A11Y-6.1-01:** Animasi tidak dijalankan saat `prefers-reduced-motion` aktif.
- **COMP-6.1-01:** Perubahan tidak boleh mengubah data Semester 125, autentikasi demo, aset WebP, atau dependensi existing.

## Pembaruan v6.3

FR v6.3: tombol Beranda wajib tersedia di navbar desktop/mobile; pengguna mendapat umpan balik loading berwarna kuning saat intro serta pergantian halaman, dengan penghormatan reduced motion.


---

## Addendum v6.4 — Kebutuhan terbaru (menggantikan UI-6.1-01/02 dan loading v6.3)

- **UI-6.4-01:** Animasi loading yang sama (tiga titik kuning dari `loading.lottie`) digunakan pada pemuatan awal dan **setiap** pergantian rute.
- **UI-6.4-02:** Loading cincin/logo dan progress bar navigasi lama tidak lagi ditampilkan.
- **UI-6.4-03:** Hero `main.webp` dan bagian Kenali MATRA `kenali-matra.webp` dirender pada lapisan **di depan** lingkaran dekoratif.
- **A11Y-6.4-01:** Overlay loading mempunyai `role=status`; animasi tidak ditampilkan ketika preferensi *reduced motion* aktif.
- **COMP-6.4-01:** Tidak ada dependensi npm baru; data jadwal, login simulasi, dan aturan peminjaman tidak diubah.
