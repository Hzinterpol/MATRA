# Panduan Jadwal Semester 125 di MATRA v3

## 1. Sumber

- Dokumen acuan: `Jadwal Kuliah 125 -v01 -mahasiswa(1).pdf`, 50 halaman.
- Dasar transkripsi mesin: teks `Pasted text(2).txt` yang diberikan pengguna.
- Bagian data: 46 tabel kelas dari halaman 5–50.
- **241 jadwal dengan lokasi jelas** dimasukkan. **80 jadwal tanpa ruangan** diabaikan sesuai permintaan. Jangan otomatis mengunci ruang karena kelas daring/terpisah.

## 2. File data

- `src/data/timetable125.js` — data 241 jadwal mata kuliah, kode dosen, kode jam, nama kelas, hari, waktu, lokasi, serta halaman asal.
- `src/data/timetable125.json` — salinan JSON untuk audit atau penyuntingan.
- `src/data/schedule.js` — proyeksi ke tanggal kalender, rotasi grup dan rentang ujian.
- `src/data/demo.js` — master direktori ruang & lab, serta simulasi PJ/Admin.

Saat mengubah master jadwal, perbarui `timetable125.js` dan `timetable125.json` agar tetap konsisten. ID ruang fisik dibentuk dari nama dasar, misalnya `GDS 607 B` menjadi `gds-607` dan menyimpan `group: 'B'`.

## 3. Jadwal dan grup luring

| Pekan | Tanggal 2026 | Grup luring |
|---|---|---|
| 2 | 7–13 Sep | X dan A |
| 3 | 14–20 Sep | Y dan B |
| 4 | 21–27 Sep | X dan C |
| 5 | 28 Sep–4 Okt | Y dan A |
| 6 | 5–11 Okt | X dan B |
| 7 | 12–18 Okt | Y dan C |
| 8–9 | 19 Okt–1 Nov | UTS, jadwal ujian terpisah |
| 10 | 2–8 Nov | X dan A |
| 11 | 9–15 Nov | Y dan B |
| 12 | 16–22 Nov | X dan C |
| 13 | 23–29 Nov | Y dan A |
| 14 | 30 Nov–6 Des | X dan B |
| 15 | 7–13 Des | Y dan C |
| 16–17 | 14–27 Des | UAS, jadwal ujian terpisah |

Entri lab/GdM/GHA tanpa grup bergilir diproyeksikan pada minggu perkuliahan, bukan minggu UTS/UAS. Entri `Wks 1` dan `Wks 2` pada workshop ditempatkan hanya pada dua pekan perkuliahan pertama; perlu verifikasi apabila maksud singkatannya berbeda.

## 4. Contoh validasi

- **GDS 507, Senin 2 Nov 2026, 13.15–15.45 WIB:** Pengantar Animasi Komputer, kelas PM 25 A, dosen **AA/DJ**.
- **GDS 613, Rabu 4 Nov 2026, 08.00–09.40 WIB:** Metodologi Penelitian Pendidikan, kelas S2 PM 26, dosen **PD/FA** (Grup X).
- **GDS 607, Rabu 11 Nov 2026, 13.30–15.10 WIB:** Komputer dan Masyarakat, kelas IK 25 B, dosen **RA/DM** (Grup B).
- **GDS 509:** tidak ada entri dengan lokasi GDS 509 pada berkas sumber, sehingga tidak boleh dinyatakan tersedia hanya karena tidak tercantum kelas.
- **26 Oktober 2026:** pekan UTS; kalender menampilkan **Belum Terverifikasi** apabila tidak ada data tambahan yang pasti.

## 5. Batasan

Ini merupakan data jadwal dokumen, bukan informasi live. Perubahan kelas mendadak, konfirmasi PJ, keputusan admin, penutupan, dan jadwal ujian membutuhkan pembaruan resmi. Jangan menganggap status **Tersedia** sebagai persetujuan memakai fasilitas.
