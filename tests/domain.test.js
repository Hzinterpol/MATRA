import test from 'node:test';
import assert from 'node:assert/strict';
import {initialDemo,DEMO_DATE,facilities} from '../src/data/demo.js';
import {overlaps,isValidInterval,getStatus,getAlternatives,filterFacilities} from '../src/utils/domain.js';
const fresh=()=>JSON.parse(JSON.stringify(initialDemo));
test('rentang waktu WIB yang berdampingan tidak beririsan',()=>{
 assert.equal(overlaps('09:00','10:00','10:00','11:00'),false);
 assert.equal(overlaps('09:00','11:00','10:00','12:00'),true);
 assert.equal(isValidInterval('11:00','09:00'),false);
 assert.equal(isValidInterval('09:00','09:00'),false);
 assert.equal(isValidInterval('09:00','11:00'),true);
});
test('kelas terjadwal 125 pada GDS 507 menahan slot hingga selesai',()=>{
 const s=getStatus(fresh(),'gds-507','2026-11-02','13:15','15:45');
 assert.equal(s.label,'Dialokasikan');
 assert.equal(s.allocations[0].course,'Pengantar Animasi Komputer');
 assert.equal(s.allocations[0].lecturer,'AA/DJ');
 assert.equal(s.allocations[0].end,'15:45');
});
test('pelepasan jadwal PJ memerlukan perubahan alokasi aktif eksplisit',()=>{
 const d=fresh(),m=d.meetings[0];
 assert(m&&m.allocationId);
 assert.equal(getStatus(d,m.facilityId,m.date,m.start,m.end).label,'Dialokasikan');
 m.confirmation='Berubah Online';
 assert.equal(getStatus(d,m.facilityId,m.date,m.start,m.end).label,'Dialokasikan');
 d.allocations.find(a=>a.id===m.allocationId).active=false;
 assert.equal(getStatus(d,m.facilityId,m.date,m.start,m.end).label,'Tersedia');
});
test('penutupan dan alokasi yang beririsan harus ditinjau sebagai konflik',()=>{
 const s=getStatus(fresh(),'gds-608','2026-11-05','08:00','09:00');
 assert.equal(s.label,'Konflik');
 assert(s.closures.length>0&&s.allocations.length>0);
});
test('penutupan tanpa kelas menjadi Tidak Tersedia dengan alasan',()=>{
 const d=fresh();d.closures.push({id:'CL-999',facilityId:'gds-613',date:'2026-11-07',start:'08:00',end:'11:00',reason:'Uji pemeliharaan'});
 const s=getStatus(d,'gds-613','2026-11-07','08:30','09:30');
 assert.equal(s.label,'Tidak Tersedia');assert.match(s.reason,/Uji pemeliharaan/);
});
test('jadwal ujian tidak dinyatakan kosong otomatis',()=>{
 assert.equal(getStatus(fresh(),'gds-517','2026-10-26','09:00','11:00').label,'Belum Terverifikasi');
 assert.equal(getStatus(fresh(),'gds-613','2026-12-16','09:00','11:00').label,'Belum Terverifikasi');
});
test('ruangan tanpa entri lokasi Semester 125 berstatus Belum Terverifikasi',()=>{
 assert.equal(getStatus(fresh(),'gds-509','2026-11-02','09:00','11:00').label,'Belum Terverifikasi');
 assert.equal(getStatus(fresh(),'gds-510','2026-11-02','09:00','11:00').label,'Belum Terverifikasi');
});
test('pengajuan menunggu keputusan tidak menjadi alokasi tambahan',()=>{
 const d=fresh();const r=d.requests.find(r=>r.id==='REQ-002');assert.equal(r.status,'Menunggu Keputusan');
 const b=getStatus(d,r.facilityId,r.date,r.start,r.end);
 d.requests=d.requests.filter(x=>x.id!=='REQ-002');
 const a=getStatus(d,r.facilityId,r.date,r.start,r.end);
 assert.equal(a.label,b.label);
});
test('filter perangkat lunak berlaku hanya pada laboratorium',()=>{
 const f=filterFacilities(facilities,{software:'Python'});
 assert(f.length>0);assert(f.every(x=>x.type==='lab'&&x.software.some(s=>s.name==='Python')));
 assert.equal(filterFacilities(facilities,{type:'room',software:'Python'}).length,0);
 assert.deepEqual(filterFacilities(facilities,{type:'room',roomId:'gds-517'}).map(f=>f.name),['GDS 517']);
});
test('alternatif hanya berisi slot Tersedia, bukan Belum Terverifikasi',()=>{
 const a=getAlternatives(fresh(),{date:'2026-11-02',start:'09:00',end:'11:00',type:'lab'});
 assert(a.every(x=>x.type==='lab'&&x.slot.label==='Tersedia'));
 assert(!a.some(x=>x.id==='gds-509'));
});
