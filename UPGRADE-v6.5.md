# Memperbaiki gambar hilang — MATRA v6.5

## Penyebab
Pada ZIP PATCH v6.4, source gambar `main.webp` dan `kenali-matra.webp` tidak disertakan karena sebelumnya tidak berubah. Jika folder `public/assets/ilustrasi` pada instalasi lokal hilang, browser akan menampilkan ikon gambar rusak dan teks alt.

## Apa yang diperbaiki
- Semua delapan ilustrasi `.webp` sekarang tersedia kembali di **public/assets/ilustrasi/** serta **src/assets/ilustrasi/**.
- `HomeExperience.jsx` dan `MediaFrame.jsx` mengimpor WebP dari `src/assets` secara statis. Vite harus menyertakan berkasnya ketika build, dan akan melaporkan kegagalan jika hilang.
- Jika gambar tidak dapat dibaca browser, antarmuka menampilkan ilustrasi ikon, bukan teks gambar rusak.
- Urutan lapisan karakter di depan lingkaran dari v6.4 tetap dipertahankan; loading tiga titik kuning dari v6.4 tidak berubah.

## Update tanpa npm install
1. Hentikan server lama dengan Ctrl+C.
2. Buka folder MATRA **yang memuat package.json**.
3. Ekstrak `MATRA-v6.5-PATCH-dari-v6.4.zip`; pastikan di dalamnya langsung ada folder `src` dan `public`, bukan `MATRA/MATRA`.
4. Salin **seluruh isi patch** (termasuk kedua folder aset) ke folder proyek tersebut dan pilih Replace/Timpa.
5. Jalankan `npm run dev` dari folder yang sama.
6. Buka `http://localhost:5173/` sesuai URL terminal dan tekan `Ctrl+Shift+R`. Scroll untuk memeriksa Kenali MATRA.

## Pemeriksaan jika masih hilang
Pada terminal di root proyek:

```cmd
dir src\assets\ilustrasi\main.webp
dir src\assets\ilustrasi\kenali-matra.webp
findstr /C:"import mainIllustration" src\components\HomeExperience.jsx
```

File yang ada dan impor yang sesuai membuktikan kode terbaru sudah disalin. Pastikan port Vite yang dibuka adalah port dari terminal aktif (kadang pindah dari 5173 ke 5174). Jika Vite menampilkan error impor asset, periksa bahwa folder `src/assets/ilustrasi` benar-benar ikut disalin.

Tidak perlu menjalankan npm install ulang karena dependensi tidak berubah.
