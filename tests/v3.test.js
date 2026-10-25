import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {facilities,ROOM_NAMES,initialDemo} from '../src/data/demo.js';
const src=name=>fs.readFileSync(new URL('../src/'+name,import.meta.url),'utf8');
test('GDS 507 sampai 516 adalah sepuluh lab komputer dan tidak ada Lab A/B/C',()=>{
 const labs=facilities.filter(x=>x.type==='lab');
 assert.deepEqual(labs.map(x=>x.name),Array.from({length:10},(_,i)=>`GDS ${507+i}`));
 assert(!facilities.some(x=>x.id.startsWith('lab-')));
});
test('GDS 517 ruang kuliah dan daftar ruang tambahan tidak hilang',()=>{
 assert.equal(facilities.find(x=>x.id==='gds-517').type,'room');
 for(const name of ['GDS 607','GDS 608','GDS 613','GdM 215','GHA 109']) assert(ROOM_NAMES.includes(name));
});
test('jumlah komputer masih ditampilkan tetapi angka belum diverifikasi',()=>{
 const ui=src('components/UI.jsx');const pub=src('pages/PublicPages.jsx');
 assert.match(ui,/komputer/);assert.match(pub,/Komputer berfungsi/);
 assert.equal(facilities.find(f=>f.id==='gds-507').computersVerified,false);
});
test('filter checkboxes perangkat proyektor AC WiFi dihapus pada halaman daftar',()=>{
 const ui=src('components/UI.jsx'),pub=src('pages/PublicPages.jsx');
 const panel=ui.slice(ui.indexOf('export function FilterPanel('),ui.indexOf('export function FacilityCard('));
 assert(!panel.includes('type="checkbox"'));assert(!panel.includes('Filter fasilitas'));assert.match(panel,/Filter perangkat lunak/);
 const list=pub.slice(pub.indexOf('export function FacilityListPage('),pub.indexOf('export function FacilityDetailPage('));
 assert.match(list,/type==='lab'&&<FilterPanel/);assert(!list.includes('FilterPanel limitType={type}'));
});
test('pencarian gabungan tidak lagi memiliki panel filter fasilitas',()=>{
 const landing=src('pages/PublicPages.jsx').split('export function SearchLanding()')[1].split('export function SearchFiltersPage()')[0];
 assert(!landing.includes('<FilterPanel'));assert(landing.includes('<QuickSearch showType'));
});
test('ikon cari meluncurkan kotak ketik fitur dengan rekomendasi dan Ctrl K',()=>{
 const glob=src('components/GlobalSearch.jsx');const layout=src('components/Layouts.jsx');
 assert.match(glob,/Cari fitur, jadwal, ruang, software/);assert.match(glob,/Rekomendasi untukmu/);assert.match(glob,/e\.ctrlKey/);
 assert(layout.includes('<GlobalSearch/>'));assert(layout.includes('<GlobalSearch compact/>'));
});
test('kalender menampilkan daftar mata kuliah, kode dosen dan jam selesai',()=>{
 const code=src('components/CalendarGrid.jsx');
 for(const text of ['Kode dosen:','Digunakan sampai','Daftar penggunaan ruangan','Kelas:','Alasan penggunaan / blokir']) assert(code.includes(text));
 assert(code.includes('Belum Terverifikasi'));
});
test('semua alokasi, pertemuan, penutupan dan pengajuan memiliki ID fasilitas terdaftar',()=>{
 const ids=new Set(facilities.map(x=>x.id));
 for(const k of ['allocations','meetings','closures','requests'])for(const r of initialDemo[k])assert(ids.has(r.facilityId),`${k}: ${r.id} => ${r.facilityId}`);
});
test('link lama lab A sudah diarahkan ke GDS 507',()=>{
 const app=src('App.jsx');
 assert(app.includes('/lab-komputer/gds-507#perangkat-lunak'));
 assert(!app.includes('/lab-komputer/lab-a'));
});
