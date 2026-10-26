export const publicMenu = [
  { label: 'Beranda', to: '/', children: [['Beranda', '/']] },
  { label: 'Ruang Kuliah', to: '/ruang-kuliah', children: [
    ['Daftar Ruang Kuliah','/ruang-kuliah'],['Detail Ruang Kuliah','/ruang-kuliah/gds-607'],
    ['Kalender Ruang Kuliah','/ruang-kuliah/kalender'],['Detail Status Slot','/ruang-kuliah/status-slot'],['Info Konfirmasi PJ','/ruang-kuliah/konfirmasi-pj'] ] },
  { label: 'Lab Komputer', to: '/lab-komputer', children: [
    ['Daftar Lab Komputer','/lab-komputer'],['Detail Lab Komputer','/lab-komputer/gds-507'],
    ['Software Laboratorium','/lab-komputer/software'],['Kalender Lab Komputer','/lab-komputer/kalender'],['Waktu Pemeriksaan','/lab-komputer/pemeriksaan'] ] },
  { label: 'Cari Ruang & Lab', to: '/cari', children: [
    ['Cari Ruang & Lab','/cari'],['Filter Pencarian','/cari/filter'],['Filter Waktu','/cari/waktu'],
    ['Hasil & Alternatif','/cari/hasil'],['Kalender Ketersediaan','/cari/kalender'] ] },
  { label: 'Layanan Kampus', to: '/layanan-kampus', children: [
    ['Direktori Layanan Kampus','/layanan-kampus'],['Detail Layanan','/layanan-kampus/layanan-akademik'],
    ['Pusat Login','/login'],['Sebagai Publik','/'],['Masuk sebagai PJ','/login/pj'],['Login Admin','/login/admin'],['Petunjuk Peminjaman','/petunjuk-peminjaman'] ] }
];
// MATRA v6.7: satu halaman per tugas; tampilan pendukung digabung sebagai tab atau dialog.
export const pjMenu = [
 {label:'Dashboard PJ',icon:'layout-dashboard',items:[['Beranda PJ','/pj']]},
 {label:'Konfirmasi',icon:'calendar-days',items:[['Konfirmasi & Pelepasan','/pj/konfirmasi']]},
 {label:'Cari & Pinjam',icon:'search',items:[
  ['Cari Ruang & Kalender','/pj/cari'],['Ajukan Peminjaman','/pj/ajukan']]},
 {label:'Pengajuan Saya',icon:'clipboard-list',items:[['Daftar & Status Pengajuan','/pj/pengajuan']]},
 {label:'Laporan & Akun',icon:'shield-check',items:[
  ['Lapor Ketidaksesuaian','/pj/lapor'],['Identitas & Akses','/pj/identitas']]}
];
export const adminMenu = [
 {label:'Beranda Admin',icon:'layout-dashboard',items:[['Ringkasan Dashboard','/admin']]},
 {label:'Peminjaman',icon:'clipboard-list',items:[['Pengajuan & Riwayat','/admin/antrean']]},
 {label:'Jadwal & Alokasi',icon:'calendar-days',items:[
  ['Jadwal & Pola Kelas','/admin/jadwal'],['Kalender & Konflik','/admin/kalender']]},
 {label:'Kelola Fasilitas',icon:'building-2',items:[
  ['Daftar Fasilitas','/admin/fasilitas'],['Operasional Ruang','/admin/operasional'],
  ['Riwayat Aktivitas','/admin/aktivitas']]},
 {label:'PJ & Kelola Akses',icon:'users',items:[['Daftar Penugasan PJ','/admin/penugasan']]},
 {label:'Monitoring & Laporan',icon:'file-warning',items:[
  ['Konfirmasi H-1','/admin/konfirmasi-h1'],['Laporan Ketidaksesuaian','/admin/laporan']]}
];
export const flatRoutes = menu=>menu.flatMap(group=>group.items.map(([label,to])=>({label,to,group:group.label})));
