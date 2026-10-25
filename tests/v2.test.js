import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {facilities,ROOM_NAMES,DEFAULT_SEATS_DEMO,DEMO_ADMIN_USERNAME,DEMO_STUDENT_USERNAME} from '../src/data/demo.js';
import {filterFacilities} from '../src/utils/domain.js';

const root=path.resolve(import.meta.dirname,'..');
const load=path=>fs.readFileSync(new URL(path,import.meta.url),'utf8');
test('direktori memiliki 11 nama ruang yang pengguna tentukan',()=>{
 const expected=['GDS 507','GDS 508','GDS 512','GDS 514','GDS 515','GDS 517','GDS 607','GDS 608','GDS 613','GdM 215','GHA 109'];
 assert.deepEqual(ROOM_NAMES,expected);
 assert.deepEqual(facilities.filter(f=>f.type==='room').map(f=>f.name),expected);
});
test('kapasitas ruangan standar sama, GDS 613 tepat 13 kursi',()=>{
 const rooms=facilities.filter(f=>f.type==='room');
 assert.equal(rooms.find(f=>f.name==='GDS 613').capacity,13);
 assert(rooms.filter(f=>f.name!=='GDS 613').every(f=>f.capacity===DEFAULT_SEATS_DEMO));
 assert(facilities.filter(f=>f.type==='lab').every(f=>f.capacity===DEFAULT_SEATS_DEMO));
});
test('jumlah komputer di lab tidak terhapus atau diganti jumlah kursi',()=>{
 const lab=facilities.filter(f=>f.type==='lab');
 assert.equal(lab.find(f=>f.id==='lab-a').computers,32);
 assert.equal(lab.find(f=>f.id==='lab-b').computers,28);
 assert.equal(lab.find(f=>f.id==='lab-c').computers,null);
 const ui=load('../src/components/UI.jsx');assert.match(ui,/komputer tersedia/);
});
test('dropdown nama ruang dapat memfilter fasilitas secara tepat',()=>{
 assert.deepEqual(filterFacilities(facilities,{roomId:'gds-613',type:'room'}).map(f=>f.name),['GDS 613']);
 assert.deepEqual(filterFacilities(facilities,{roomId:'gdm-215',type:'room'}).map(f=>f.name),['GdM 215']);
 assert.equal(filterFacilities(facilities,{roomId:'lab-a',type:'room'}).length,0);
});
test('white screen /cari: ikon Search diimpor, rute tersedia, ada penangkap error',()=>{
 const pub=load('../src/pages/PublicPages.jsx');
 assert.match(pub,/\bSearch\b[^\n]*from 'lucide-react'/);
 assert.match(pub,/export function SearchLanding\(/);
 const app=load('../src/App.jsx');assert.match(app, /path="cari" element=\{<SearchLanding\/>\}/);
 const main=load('../src/main.jsx');assert.match(main,/<ErrorBoundary><App\/><\/ErrorBoundary>/);
});
test('navbar memakai ikon search dan footer tidak menampilkan link login',()=>{
 const layout=load('../src/components/Layouts.jsx');
 const pub=layout.slice(layout.indexOf('export function PublicLayout'),layout.indexOf('function DashboardNavigation'));
 assert.match(pub,/aria-label="Cari ruang dan lab"/);
 assert.doesNotMatch(pub,/<Button to="\/masuk-pj"/);
 assert.doesNotMatch(pub,/Login admin<\/Link>/);
});
test('login terpisah untuk mahasiswa, PJ, dan admin',()=>{
 const app=load('../src/App.jsx');
 for (const p of ['login/mahasiswa','login/pj','login/admin'])assert(app.includes('path="'+p+'"'));
 assert(app.includes('path="mahasiswa"'));
 assert(DEMO_ADMIN_USERNAME.includes('@'));
 assert(DEMO_STUDENT_USERNAME.length>5);
});
test('semua alokasi, penutupan, pertemuan dan pengajuan menuju fasilitas valid',async()=>{
 const {initialDemo}=await import('../src/data/demo.js');
 const valid=new Set(facilities.map(f=>f.id));
 for (const type of ['allocations','closures','meetings','requests'])for (const x of initialDemo[type])assert(valid.has(x.facilityId),`${type} ${x.id} → ${x.facilityId} tidak ada`);
});
