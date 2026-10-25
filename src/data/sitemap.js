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
export const pjMenu = [
  {label:'Dashboard PJ', icon:'layout-dashboard',items:[
    ['Beranda PJ','/pj'],['Kelas Tanggung Jawab','/pj/kelas'],['Pengingat H-1','/pj/pengingat'],['Notifikasi','/pj/notifikasi'],['Info Penugasan','/pj/penugasan']]},
  {label:'Jadwal & Konfirmasi',icon:'calendar-days',items:[
    ['Jadwal Saya','/pj/jadwal'],['Detail Pertemuan','/pj/pertemuan'],['Konfirmasi Pelaksanaan','/pj/konfirmasi'],['Lepaskan Alokasi','/pj/lepas-alokasi'],['Status Alokasi','/pj/status-alokasi']]},
  {label:'Cari & Pinjam',icon:'search',items:[
    ['Cari Ruang / Lab','/pj/cari'],['Detail & Kalender','/pj/detail-kalender'],['Formulir Pengajuan','/pj/ajukan'],['Pilihan Alternatif','/pj/alternatif'],['Lapor Ketidaksesuaian','/pj/lapor']]},
  {label:'Pengajuan Saya',icon:'clipboard-list',items:[
    ['Pengajuan Aktif','/pj/pengajuan'],['Detail Pengajuan','/pj/pengajuan/REQ-001'],['Riwayat Pengajuan','/pj/riwayat'],['Alasan Penolakan','/pj/penolakan'],['Batalkan Pengajuan','/pj/batalkan']]},
  {label:'Akses & Dukungan',icon:'shield-check',items:[
    ['Identitas & Penugasan','/pj/identitas'],['Kode Tidak Berlaku','/pj/kode-tidak-berlaku'],['Pengajuan Mendesak','/pj/mendesak'],['Status Perubahan','/pj/status-perubahan'],['Keluar Dashboard PJ','/pj/keluar']]}
];
export const adminMenu = [
  {label:'Beranda Admin',icon:'layout-dashboard',items:[
    ['Ringkasan Dashboard','/admin'],['Pengajuan Menunggu','/admin/menunggu'],['Konflik Jadwal','/admin/konflik'],['Konfirmasi H-1','/admin/konfirmasi-h1'],['Laporan Masuk','/admin/laporan-masuk']]},
  {label:'Peminjaman',icon:'clipboard-list',items:[
    ['Antrean Pengajuan','/admin/antrean'],['Detail & Verifikasi','/admin/verifikasi'],['Keputusan Pengajuan','/admin/keputusan'],['Riwayat Pengajuan','/admin/riwayat-peminjaman'],['Alternatif & Tindak Lanjut','/admin/alternatif']]},
  {label:'Jadwal & Alokasi',icon:'calendar-days',items:[
    ['Daftar Jadwal Resmi','/admin/jadwal'],['Tambah / Ubah Jadwal','/admin/ubah-jadwal'],['Pola Tiap Kelas','/admin/pola-kelas'],['Kalender Bersama','/admin/kalender'],['Tinjauan Konflik','/admin/tinjauan-konflik']]},
  {label:'Kelola Fasilitas',icon:'building-2',items:[
    ['Daftar Ruang Kuliah','/admin/ruang-kuliah'],['Daftar Lab Komputer','/admin/lab-komputer'],['Penutupan Ruang','/admin/penutupan'],['Pemindahan Alokasi','/admin/pemindahan'],['Riwayat Perubahan','/admin/riwayat-perubahan']]},
  {label:'PJ & Kode Akses',icon:'users',items:[
    ['Daftar Penugasan PJ','/admin/penugasan'],['Semester & Masa Aktif','/admin/semester'],['Terbitkan Kode Unik','/admin/terbitkan-kode'],['Ganti / Cabut Kode','/admin/cabut-kode'],['Riwayat Penugasan','/admin/riwayat-penugasan']]},
  {label:'Laporan & Tindak Lanjut',icon:'file-warning',items:[
    ['PJ Belum Konfirmasi','/admin/belum-konfirmasi'],['Laporan Ketidaksesuaian','/admin/laporan'],['Detail Tindak Lanjut','/admin/tindak-lanjut'],['Notifikasi Terdampak','/admin/notifikasi-terdampak'],['Riwayat Keputusan','/admin/riwayat-keputusan']]}
];
export const flatRoutes = (menu) => menu.flatMap(group => group.items.map(([label,to]) => ({ label, to, group:group.label })));
