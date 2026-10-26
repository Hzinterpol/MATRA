import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {adminMenu,pjMenu,flatRoutes} from '../src/data/sitemap.js';
const read=p=>fs.readFileSync(p,'utf8');
const admins=flatRoutes(adminMenu),pjs=flatRoutes(pjMenu);
test('Dashboard Admin berisi 10 tujuan unik, bukan 21 halaman tumpang tindih',()=>{
 assert.equal(admins.length,10);
 assert.equal(new Set(admins.map(x=>x.to)).size,10);
 for(const to of ['/admin','/admin/antrean','/admin/jadwal','/admin/kalender','/admin/fasilitas','/admin/operasional','/admin/aktivitas','/admin/penugasan','/admin/konfirmasi-h1','/admin/laporan'])assert.ok(admins.some(x=>x.to===to),to);
});
test('Dashboard PJ berisi 7 tujuan tanpa duplikat, detail dinamis tetap terbuka',()=>{
 assert.equal(pjs.length,7);
 assert.equal(new Set(pjs.map(x=>x.to)).size,7);
 assert.ok(pjs.some(x=>x.to==='/pj/pengajuan'));
 assert.ok(read('src/App.jsx').includes('path="pengajuan/:id"'));
});
test('Admin menggabungkan antrean, riwayat, alternatif dan proses verifikasi',()=>{
 const s=read('src/pages/AdminPages.jsx');
 assert.match(s,/adminRequestTabs/);assert.match(s,/mode="history"/);assert.match(s,/AdminAlternatives/);
 assert.match(s,/decideRequest/);
});
test('Jadwal, pola, kalender, dan konflik diakses lewat tab tanpa page ganda',()=>{
 const s=read('src/pages/AdminPages.jsx');
 for(const label of ['AdminScheduleHub','AdminCalendarHub','AdminScheduleForm','ClassPatterns','AdminConflicts'])assert.match(s,new RegExp(label));
 assert.doesNotMatch(s,/case '\/admin\/(konflik|tinjauan-konflik|ubah-jadwal|pola-kelas)'/);
});
test('Fasilitas, tindakan operasional dan audit tetap dapat dibuka lewat tab',()=>{
 const s=read('src/pages/AdminPages.jsx');
 for(const label of ['AdminFacilityHub','AdminOperationHub','AdminAuditHub','FacilityManagement','ClosurePage','MoveAllocationPage'])assert.match(s,new RegExp(label));
 assert.ok(read('src/App.jsx').includes("['riwayat-keputusan','/admin/aktivitas?tab=decisions']"));
});
test('Konfirmasi PJ dapat melepas alokasi hanya sesudah Berubah Online dan dialog',()=>{
 const s=read('src/pages/PJPages.jsx');
 assert.match(s,/m.confirmation==='Berubah Online'/);
 assert.match(s,/title="Yakin ingin melepas alokasi\?"/);
 assert.match(s,/releaseMeeting\(mockMeetingId\)/);
 assert.doesNotMatch(s,/function ReleaseAllocation\(/);
});
test('Pencarian & Kalender satu halaman dan Pengajuan Saya memuat penolakan',()=>{
 const s=read('src/pages/PJPages.jsx');
 assert.match(s,/function PJSearch/);assert.match(s,/tab==='calendar'\?<CalendarGrid/);
 assert.match(s,/function PJRequestsHub/);assert.match(s,/rejected:'Ditolak'/);
 assert.match(s,/req.reason&&<DetailRow label="Alasan penolakan"/);
 assert.doesNotMatch(s,/function PJRejections\(/);
});
test('Menu aktif detail dinamis dan pencarian navbar tidak merujuk ke halaman terhapus',()=>{
 const layout=read('src/components/Layouts.jsx');
 assert.match(layout,/pathname.startsWith\('\/pj\/pengajuan\/'\)/);
 assert.doesNotMatch(read('src/data/sitemap.js'),/\/admin\/riwayat-peminjaman|\/pj\/pengingat/);
 const search=read('src/components/GlobalSearch.jsx');
 assert.match(search,/pjMenu.flatMap/);assert.match(search,/adminMenu.flatMap/);
});
test('Tautan notifikasi memakai URL terbaru dan tidak ada jalur mati',()=>{
 const source=read('src/context/AppContext.jsx');
 assert.doesNotMatch(source,/'\/admin\/riwayat-peminjaman'|'\/pj\/detail-kalender'/);
 assert.match(source,/\/pj\/cari\?tab=calendar/);
});
test('Gaya beranda, aset WebP, dan loader kuning tidak diubah',()=>{
 assert.ok(fs.existsSync('src/assets/ilustrasi/main.webp'));
 assert.ok(fs.existsSync('src/assets/ilustrasi/kenali-matra.webp'));
 assert.match(read('src/components/LoadingIndicator.jsx'),/loading-yellow\.svg/);
 assert.match(read('src/components/Layouts.jsx'),/v6\.7/);
});

test('Perpindahan tab dalam dashboard tidak menampilkan overlay loading halaman',()=>{
 const loader=read('src/components/LoadingIndicator.jsx');
 assert.match(loader,/\[location\.pathname\]/);
 assert.doesNotMatch(loader,/\[location\.key\]/);
});
