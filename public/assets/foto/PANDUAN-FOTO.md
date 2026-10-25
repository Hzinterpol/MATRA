# Menambahkan gambar sendiri ke MATRA (WebP)

Website MATRA sudah menggunakan **8 ilustrasi WebP lokal** yang disalin dari arsip `Aset Gambar.rar`. Kartu tetap memiliki ilustrasi bawaan ketika kamu belum menambahkan foto. Untuk menggantinya, cukup salin file **WebP** ke jalur di bawah ini tanpa mengedit React.

## Gambar utama beranda (sudah tersedia)

- `public/assets/images/main.webp` — gambar utama di sebelah kanan hero.
- `public/assets/images/kenali-matra.webp` — bagian **Kenali MATRA**.

## Kartu tiga layanan di beranda (opsional diganti)

- `public/assets/foto/kategori/ruang-kuliah.webp`
- `public/assets/foto/kategori/lab-komputer.webp`
- `public/assets/foto/kategori/layanan-kampus.webp`

Jika file di atas belum ditambahkan, MATRA menggunakan ilustrasi `ruang-kuliah.webp`, `lab-komputer.webp`, `layanan-kampus.webp` yang sudah disediakan di `public/assets/images/`.

## Foto ruangan (opsional)

- `public/assets/foto/ruang/gds-517.webp`
- `public/assets/foto/ruang/gds-607.webp`
- `public/assets/foto/ruang/gds-608.webp`
- `public/assets/foto/ruang/gds-613.webp`
- `public/assets/foto/ruang/gdm-215.webp`
- `public/assets/foto/ruang/gha-109.webp`

## Foto lab komputer (opsional)

- `public/assets/foto/lab/gds-507.webp` sampai `public/assets/foto/lab/gds-516.webp`.

## Foto layanan kampus (opsional)

- `public/assets/foto/layanan/layanan-akademik.webp`
- `public/assets/foto/layanan/layanan-laboratorium.webp`
- `public/assets/foto/layanan/bantuan-ruangan.webp`

Ketika tidak ada foto custom, MATRA memakai ilustrasi bawaan `layanan-akademik.webp`, `informasi-laboratorium.webp`, atau `bantuan-peminjaman-ruangan.webp`.

## Ketentuan

- Gunakan format `.webp`, sebaiknya ukuran 1200–1600px. Nama file harus sesuai huruf kecil dan tanda minus di atas.
- Gambar ilustrasi bawaan menggunakan `object-fit: contain` agar tidak terpotong; foto custom menggunakan `object-fit: cover` untuk memenuhi kartu.
- Cukup simpan file dan refresh browser. Jangan ubah nama logo `matra-logo.svg`, karena logo merek sengaja tetap SVG supaya tajam.
- Tidak diperlukan `npm install` ulang hanya untuk mengganti gambar.
