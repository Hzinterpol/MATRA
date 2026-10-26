# MATRA v6.7 — React + Tailwind CSS

Pembaruan v6.7 menyatukan dashboard yang tumpang tindih: **Admin 21 → 10 halaman utama** dan **PJ 11 → 7 halaman utama**. Fitur penunjang dipindahkan ke **tab dan dialog** dalam halaman induknya; detail dinamis pengajuan PJ tetap dapat diakses setelah pengiriman.

Lihat [SITEMAP-v6.7.md](SITEMAP-v6.7.md) untuk struktur aktif dan alasan penggabungan, [UPGRADE-v6.7.md](UPGRADE-v6.7.md) untuk instruksi patch dari v6.6, serta [CHANGELOG.md](CHANGELOG.md) untuk ringkasan perubahan.

**Yang tetap dapat digunakan:** verifikasi/keputusan Admin, riwayat dan alternatif ruang, tambah jadwal/pola kelas, kalender dan konflik, operasional fasilitas dan audit, konfirmasi PJ serta pelepasan eksplisit, pengajuan/pembatalan dan alasan penolakan, pelaporan, dan logout. Halaman publik, Semester 125, ilustrasi WebP serta loading kuning tidak diubah.

---

## Arsip dokumentasi versi sebelumnya

Teks setelah bagian ini menjelaskan perjalanan fitur dari v6.5 ke belakang. Untuk **daftar halaman yang aktif sekarang**, ikuti SITEMAP-v6.7.md; v6.6 disimpan sebagai arsip sejarah fitur.

> Pembaruan v6.4: Loading tiga titik kuning yang sama di seluruh halaman, berdasarkan `loading.lottie`, dan penataan ilustrasi di depan lingkaran dekoratif. Lihat [UPGRADE-v6.4.md](UPGRADE-v6.4.md).

# MATRA v6.5 — Frontend React + Tailwind CSS

Prototipe frontend statis untuk informasi ruang, jadwal dan peminjaman Rumpun Matematika FMIPA UNJ. Halaman publik, dashboard PJ dan dashboard Admin menggunakan data simulasi. Desain v6.4 mempertahankan komposisi visual portofolio yang diberikan, dengan warna brand MATRA tetap dipertahankan.

## Teknologi

React 18, Vite 6, React Router, Tailwind CSS 3, JavaScript, Lucide React. Tidak ada database/backend.

## Instalasi

```bash
npm install
npm run dev
```

Buka URL lokal yang dicetak oleh Vite (biasanya `http://localhost:5173`).

Untuk deployment ke Vercel:

```bash
npm run build
```

Folder output: `dist`. Konfigurasi `vercel.json` disertakan untuk fallback SPA.

## Area utama

- Publik: beranda, ruang kuliah, lab komputer, kalender Semester 125, cari ruang & lab, direktori layanan, petunjuk peminjaman.
- PJ: kode akses demo, dashboard, jadwal/konfirmasi, pengajuan/pembatalan, riwayat, notifikasi.
- Admin: login email/password demo, dashboard, keputusan peminjaman, pengelolaan jadwal/alokasi, fasilitas, PJ dan laporan.
- Pencarian cepat pada navbar mendukung kata kunci fitur, nama ruangan, mata kuliah dan shortcut `Ctrl + K`.

## Perbaikan v6.4

- Loading pertama dan setiap perpindahan halaman sekarang **sama**: tiga titik berwarna kuning `#FFDD00`, diadaptasi dari file `loading.lottie` yang diserahkan.
- Animasi cincin/logo dan garis progress atas yang digunakan v6.3 telah **dihapus**.
- Lapisan karakter pada ilustrasi hero dan bagian Kenali MATRA dipastikan berada **di depan lingkaran dekoratif**; tetap responsif.
- Beranda tetap menjadi menu pertama navbar. Footer memakai penanda `v6.4` agar mudah memeriksa versi aktif.
- **PATCH v6.4 tidak memiliki folder MATRA pembungkus** dan tidak menambah dependensi. Lihat [`UPGRADE-v6.4.md`](UPGRADE-v6.4.md).

## Perbaikan v6.2

- Popup pencarian cepat kini dipasang melalui **React Portal** langsung di `document.body`, sehingga lapisan gelap menutupi seluruh layar walau navbar menggunakan `backdrop-blur`.
- Perbaikan input pencarian: indikator fokus lebih rapi, scroll halaman terkunci saat dialog aktif, tombol `Escape`, penutupan di backdrop, serta navigasi keyboard tetap berjalan.
- Teks keterangan panjang di bagian bawah halaman Login PJ/Admin dihapus tanpa mengubah mekanisme autentikasi **simulasi**.
- Seluruh data, tema teal-kuning, menu Beranda, dan aset WebP dipertahankan. Animasi loading v6.1 kemudian diganti oleh desain tiga titik v6.4.

## Perubahan v6.1

- Menu **Beranda** di sebelah kiri **Ruang Kuliah** pada navbar desktop dan mobile.
- **Loading kuning (#FFDD00)**: preloader singkat saat pertama kali membuka situs, dan progress bar kuning saat berpindah halaman.
- Animasi menghormati `prefers-reduced-motion`, berjalan otomatis tanpa ketergantungan baru.
- Aset WebP dan seluruh fitur dari versi 6.0 tetap sama.

## Foto dan ikon

Ilustrasi bawaan kini menggunakan delapan file **WebP** dari arsip yang diberikan (termasuk `main.webp` pada hero). Untuk mengganti ilustrasi dengan foto sendiri, simpan `.webp` sesuai [`public/assets/foto/PANDUAN-FOTO.md`](public/assets/foto/PANDUAN-FOTO.md). Berkas `.webp` v5 tetap didukung sebagai cadangan. Misalnya:

```
public/assets/foto/kategori/ruang-kuliah.webp
public/assets/foto/ruang/gds-517.webp
public/assets/foto/lab/gds-507.webp
public/assets/foto/layanan/layanan-akademik.webp
```

Jika foto tidak ada, ilustrasi WebP bawaan tetap muncul. Ikon UI memakai Lucide React; lihat [`ICON-GUIDE.md`](ICON-GUIDE.md).

## Pembaruan dari v6.1

Gunakan [`UPGRADE-v6.2.md`](UPGRADE-v6.2.md) untuk memperbarui frontend MATRA v6.1 tanpa menghapus `node_modules` atau menjalankan `npm install` ulang. Tidak ada perubahan dependensi.

## Pembaruan dari v6.0

Gunakan PATCH v6.1 dan ikuti [`UPGRADE-v6.1.md`](UPGRADE-v6.1.md). Bila MATRA v6.0 sudah berhasil terpasang, cukup timpa file yang diperbarui dan jalankan `npm run dev`. **Tidak perlu `npm install` ulang.**

## Pembaruan dari v5

Gunakan file PATCH v6 dan ikuti [`UPGRADE-v6.md`](UPGRADE-v6.md). Jika v5 sudah terpasang dependensinya, cukup timpa source/asset hasil patch lalu jalankan `npm run dev` tanpa `npm install` ulang.

## Pengujian

```bash
npm test
npm run check
```

Pengujian Node dijalankan melalui `npm test`. `npm run check` menggunakan paket TypeScript dari `devDependencies`, sehingga membutuhkan `npm install` pada komputer pengguna.

## Keamanan dan sumber data

MATRA v6.2 **belum terhubung ke sistem akademik** dan autentikasi bukan keamanan produksi. Jangan menginput password kampus sungguhan. Jadwal berasal dari referensi Semester 125, sedangkan beberapa data software dan jumlah komputer adalah simulasi yang belum diverifikasi.


Pembaruan v6.5: gambar ilustrasi dibundel melalui import Vite; lihat `UPGRADE-v6.5.md`.
