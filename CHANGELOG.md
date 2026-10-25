# MATRA v6.5 — Perbaikan WebP tidak tampil

- Memulihkan dan menyertakan ulang semua aset ilustrasi WebP dalam patch.
- Mengubah sumber gambar hero dan Kenali MATRA dari string URL `/assets/...` menjadi `import` statis dari `src/assets`, sehingga Vite membundelnya dan memberi kegagalan build jika file tidak ada.
- Mengubah MediaFrame ke import statis yang sama; foto fasilitas manual WebP/JPG tetap didukung.
- Memperbaiki fallback antarmuka saat gambar gagal dirender.
- Mempertahankan desain warna, layering, navbar Beranda, dan animasi loading kuning v6.4.
- Tidak mengubah dependencies.
