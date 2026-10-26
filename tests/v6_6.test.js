import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {adminMenu,pjMenu,flatRoutes} from '../src/data/sitemap.js';
const read=p=>fs.readFileSync(p,'utf8');
const adminRemoved=['Pengajuan Menunggu','Detail & Verifikasi','Keputusan Pengajuan','Semester & Masa Aktif','Terbitkan Kode Unik','Ganti / Cabut Kode','Riwayat Penugasan','Detail Tindak Lanjut','Notifikasi Terdampak'];
const pjRemoved=['Kelas Tanggung Jawab','Notifikasi','Info Penugasan','Jadwal Saya','Detail Pertemuan','Status Alokasi','Pilihan Alternatif','Pengajuan Aktif','Riwayat Pengajuan','Batalkan Pengajuan','Kode Tidak Berlaku','Pengajuan Mendesak','Status Perubahan','Keluar Dashboard PJ'];
test('Semua menu yang telah dihapus pada v6.6 tetap tidak kembali',()=>{
 for(const label of adminRemoved)assert.ok(!flatRoutes(adminMenu).some(x=>x.label===label),label);
 for(const label of pjRemoved)assert.ok(!flatRoutes(pjMenu).some(x=>x.label===label),label);
});
test('Fitur keputusan Admin dan penanganan laporan tidak terhapus oleh penggabungan',()=>{
 const admin=read('src/pages/AdminPages.jsx');
 assert.match(admin,/decideRequest\(/);assert.match(admin,/resolveIssue\(/);
 assert.match(admin,/AdminRequestsHub/);assert.match(admin,/AdminReports/);
});
test('Fitur konfirmasi PJ, pelepasan, pembatalan, pengajuan tetap dijaga',()=>{
 const pj=read('src/pages/PJPages.jsx');
 for(const name of ['submitRequest(', 'cancelRequest(', 'confirmMeeting(', 'releaseMeeting('])assert.ok(pj.includes(name),name);
 assert.match(pj,/PJRequestsHub/);assert.match(pj,/PJConfirm/);
});
test('Tautan lama tetap diarahkan ke fitur gabungan yang relevan',()=>{
 const app=read('src/App.jsx');
 for(const fragment of ["['pengingat','/pj/konfirmasi']", "['penolakan','/pj/pengajuan?tab=rejected']", "['riwayat-peminjaman','/admin/antrean?tab=history']", "['tinjauan-konflik','/admin/kalender?tab=conflicts']"]){assert.ok(app.includes(fragment),fragment)}
});
test('Login PJ tetap memeriksa akses tidak aktif',()=>assert.match(read('src/pages/AuthPages.jsx'),/Akses PJ tidak aktif/));
test('Versi baru menjaga dependensi lama dan animasi',()=>{
 const pkg=JSON.parse(read('package.json'));
 assert.equal(pkg.version,'6.7.0');
 assert.deepEqual(Object.keys(pkg.dependencies).sort(),['lucide-react','react','react-dom','react-router-dom'].sort());
 assert.match(read('src/components/LoadingIndicator.jsx'),/loading-yellow\.svg/);
 assert.match(read('src/components/Layouts.jsx'),/v6\.7/);
});
