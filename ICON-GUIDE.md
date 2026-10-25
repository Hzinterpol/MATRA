# Panduan ikon MATRA v5

Semua ikon di MATRA v5 menggunakan **Lucide React**, versi yang sudah tersedia di `package.json` (`lucide-react`), sehingga tidak perlu memasang paket ikon lain. Ikon muncul sebagai SVG yang tajam saat ukuran layar berubah. Gaya utama: outline, ketebalan garis 1,5–1,8, ukuran 16–26px, warna teal `#006569`.

| Komponen | Nama Lucide | Referensi visual |
|---|---|---|
| Ruang Kuliah | `Building2` | https://lucide.dev/icons/building-2 |
| Lab Komputer | `Monitor` | https://lucide.dev/icons/monitor |
| Layanan Kampus | `BookOpen` | https://lucide.dev/icons/book-open |
| Pencarian cepat | `Search` | https://lucide.dev/icons/search |
| Kalender | `CalendarDays` | https://lucide.dev/icons/calendar-days |
| Perangkat lunak | `Layers3` | https://lucide.dev/icons/layers-3 |
| Waktu | `Clock3` | https://lucide.dev/icons/clock-3 |
| Status / verifikasi | `ShieldCheck` | https://lucide.dev/icons/shield-check |
| Formulir & keputusan | `ClipboardCheck` | https://lucide.dev/icons/clipboard-check |
| Lokasi | `MapPin` | https://lucide.dev/icons/map-pin |
| Tautan detail | `ArrowUpRight` | https://lucide.dev/icons/arrow-up-right |

Penggunaan pada komponen React:

```jsx
import { Building2, Search } from 'lucide-react';

<Building2 size={24} strokeWidth={1.7} className="text-primary" />
<Search size={20} strokeWidth={1.8} aria-hidden="true" />
```

**Catatan:** Semua ikon merupakan ikon UI. Foto asli ruang/lab/layanan sengaja disediakan sebagai slot yang dapat diisi pengguna melalui `public/assets/foto/`; lihat `PANDUAN-FOTO.md` di sana.
