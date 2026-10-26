# Memperbarui MATRA dari v6.6 ke v6.7

Pembaruan ini menyatukan submenu dashboard Admin/PJ yang berulang. **Tidak menambah dependency** React maupun Vite.

1. Hentikan server lokal dengan `Ctrl + C`.
2. Cadangkan folder MATRA v6.6 agar mudah kembali jika ada data lokal yang ingin dipertahankan.
3. Ekstrak file `MATRA-v6.7-PATCH-dari-v6.6.zip`.
4. Salin **isi ZIP** langsung ke folder MATRA lama yang memiliki `package.json` (jangan letakkan semuanya di subfolder `MATRA` baru). Pilih **Replace / Timpa** ketika diminta.
5. Folder `node_modules` lokal boleh dipertahankan. Tidak perlu `npm install` selama dependency v6.6 sudah berfungsi.
6. Jalankan kembali:

```bash
npm run dev
```

7. Refresh `Ctrl + Shift + R`; cek tulisan `v6.7` di footer beranda.
8. Buka `/admin/antrean`, `/admin/jadwal`, `/admin/kalender`, `/pj/konfirmasi`, dan `/pj/pengajuan` dengan akun demo sesuai kewenangannya.

## Untuk deployment GitHub/Vercel

```bash
npm run check
npm test
npm run build
```

Bila dependency sudah dipasang secara lokal, `npm run build` menghasilkan `dist/`. Commit perubahan dengan Git lalu push. Pastikan `node_modules/`, `dist/`, `.env` tidak teracak masuk Git; `.gitignore` sudah disertakan. Setelah itu Vercel akan memulai build baru sesuai integrasi GitHub-mu.

## Tautan lama tetap bekerja

- `/admin/konflik` → `/admin/kalender?tab=conflicts`.
- `/admin/riwayat-peminjaman` → `/admin/antrean?tab=history`.
- `/admin/ubah-jadwal` → `/admin/jadwal?tab=add`.
- `/admin/penutupan` → `/admin/operasional?tab=closures`.
- `/admin/riwayat-keputusan` → `/admin/aktivitas?tab=decisions`.
- `/pj/pengingat` dan `/pj/lepas-alokasi` → `/pj/konfirmasi`.
- `/pj/detail-kalender` → `/pj/cari?tab=calendar`.
- `/pj/penolakan` → `/pj/pengajuan?tab=rejected`.

Daftar lengkap: `src/App.jsx`. Pembaruan tidak menghapus data pengajuan/konfirmasi yang sudah tersimpan pada kunci browser yang sama. Namun tetap disarankan mencadangkan data lokal jika penting karena semua data hanya simulasi.
