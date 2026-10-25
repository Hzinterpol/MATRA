import test from 'node:test';
import assert from 'node:assert/strict';
import {addDays,weekMonday,calendarRanges} from '../src/utils/schedule.js';
import {timetable125} from '../src/data/timetable125.js';
import {scheduleAllocations,OFFICIAL_WEEKS,examPeriodOn,SCHEDULE_DATE,scheduleMeetings} from '../src/data/schedule.js';
import {initialDemo} from '../src/data/demo.js';
test('tanggal, minggu, dan WIB mengikuti rentang sumber',()=>{
 assert.equal(weekMonday('2026-11-03'),'2026-11-02');
 assert.equal(addDays('2026-11-02',7),'2026-11-09');
 assert.equal(SCHEDULE_DATE,'2026-11-02');
});
test('241 entri dengan ruang dari 46 sheet kelas dipertahankan',()=>{
 assert.equal(timetable125.length,241);
 assert.equal(new Set(timetable125.map(e=>e.section)).size,36); // beberapa sheet tanpa ruang tidak muncul
 assert(timetable125.every(x=>x.facilityId&&x.course&&x.lecturer&&x.start&&x.end&&x.roomLabel));
 assert(timetable125.every(x=>x.start<x.end));
});
test('pengelompokan ruang A B C, X Y tidak membuat subruang fisik baru',()=>{
 const a=timetable125.find(x=>x.roomLabel==='GDS 607 B');assert.equal(a.facilityId,'gds-607');assert.equal(a.group,'B');
 const x=timetable125.find(x=>x.roomLabel==='X-GDS 613');assert.equal(x.facilityId,'gds-613');assert.equal(x.group,'X');
});
test('rotasi: pekan 10 X/A, pekan 11 Y/B, pekan 12 X/C',()=>{
 const a=OFFICIAL_WEEKS.find(x=>x.week===10),b=OFFICIAL_WEEKS.find(x=>x.week===11),c=OFFICIAL_WEEKS.find(x=>x.week===12);
 assert.deepEqual(a.groups,['X','A']);assert.deepEqual(b.groups,['Y','B']);assert.deepEqual(c.groups,['X','C']);
 assert(scheduleAllocations.some(x=>x.roomLabel==='X-GDS 613'&&x.date==='2026-11-04'));
 assert(!scheduleAllocations.some(x=>x.roomLabel==='Y-GDS 613'&&x.date==='2026-11-04'));
 assert(scheduleAllocations.some(x=>x.roomLabel==='Y-GDS 613'&&x.date==='2026-11-11'));
});
test('UTS dan UAS tidak diisi jadwal kuliah reguler',()=>{
 assert(examPeriodOn('2026-10-26'));
 assert(examPeriodOn('2026-12-20'));
 assert(!examPeriodOn('2026-11-02'));
 assert(!scheduleAllocations.some(x=>x.date>='2026-10-19'&&x.date<='2026-11-01'));
 assert(!scheduleAllocations.some(x=>x.date>='2026-12-14'));
});
test('jadwal memiliki referensi kode dosen kelas jam dan sourcePage',()=>{
 const a=scheduleAllocations.find(x=>x.facilityId==='gds-507'&&x.date==='2026-11-02'&&x.course==='Pengantar Animasi Komputer'&&x.start==='13:15');
 assert(a);assert.equal(a.lecturer,'AA/DJ');assert.match(a.section,/PM 25 A/);assert.equal(a.end,'15:45');assert.equal(a.sourcePage,10);
});
test('pertemuan PJ demo merujuk alokasi aktual yang ada',()=>{
 const m=scheduleMeetings[0];assert(m);assert(scheduleAllocations.some(a=>a.id===m.allocationId&&a.facilityId===m.facilityId&&a.date===m.date));
});
test('kalender mengambil rentang dinamis dari alokasi dan waktu pilihan',()=>{
 const dates=Array.from({length:5},(_,i)=>addDays(SCHEDULE_DATE,i));
 const ranges=calendarRanges(initialDemo,['gds-507'],dates,'09:00','11:00');
 assert(ranges.some(([a,b])=>a==='13:15'&&b==='15:45'));
 assert(ranges.some(([a,b])=>a==='09:00'&&b==='11:00'));
 assert(ranges.every(([a,b])=>a<b));
});
