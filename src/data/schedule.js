import {timetable125} from './timetable125.js';

/**
 * Jadwal tatap muka dari dokumen Semester 125 versi mahasiswa.
 * Grup ruang A/B/C dan X/Y berlaku bergiliran sesuai tabel halaman 4 PDF.
 * Entri tanpa ruang tidak mengalokasikan fasilitas secara otomatis.
 * Pekan UTS/UAS TIDAK diisi alokasi mingguan karena jadwal ujian terpisah.
 */
export const SCHEDULE_DATE = '2026-11-02'; // Pekan 10: X dan A luring, bukan pekan UTS.
export const OFFICIAL_WEEKS = [
  {week:1,monday:'2026-08-31',groups:[]},
  {week:2,monday:'2026-09-07',groups:['X','A']},
  {week:3,monday:'2026-09-14',groups:['Y','B']},
  {week:4,monday:'2026-09-21',groups:['X','C']},
  {week:5,monday:'2026-09-28',groups:['Y','A']},
  {week:6,monday:'2026-10-05',groups:['X','B']},
  {week:7,monday:'2026-10-12',groups:['Y','C']},
  {week:10,monday:'2026-11-02',groups:['X','A']},
  {week:11,monday:'2026-11-09',groups:['Y','B']},
  {week:12,monday:'2026-11-16',groups:['X','C']},
  {week:13,monday:'2026-11-23',groups:['Y','A']},
  {week:14,monday:'2026-11-30',groups:['X','B']},
  {week:15,monday:'2026-12-07',groups:['Y','C']}
];
export const EXAM_PERIODS=[
  {start:'2026-10-19',end:'2026-11-01',title:'Pekan UTS',detail:'Jadwal ujian mengikuti ketentuan UTS; jadwal kelas reguler tidak dapat digunakan untuk menyimpulkan slot kosong.'},
  {start:'2026-12-14',end:'2026-12-27',title:'Pekan UAS',detail:'Jadwal ujian mengikuti ketentuan UAS; perlu konfirmasi pengelola untuk peminjaman.'}
];
export function examPeriodOn(date){return EXAM_PERIODS.find(p=>date>=p.start&&date<=p.end)||null;}
const dayOffset={Senin:0,Selasa:1,Rabu:2,Kamis:3,Jumat:4};
function datePlus(iso,offset){const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10);}
const allocationMap=new Map();
for(const wk of OFFICIAL_WEEKS){
  for(const [i,e] of timetable125.entries()){
    if(e.group && !wk.groups.includes(e.group)) continue;
    // Wks 1/2 pada dokumen workshop bersifat khusus; hanya satu kali penempatan awal.
    if(e.weekScope && wk.week!==({1:2,2:3})[e.weekScope]) continue;
    const date=datePlus(wk.monday,dayOffset[e.day]);
    if(date<'2026-09-01'||date>'2026-12-13')continue;
    const key=[wk.week,e.facilityId,date,e.start,e.end,e.course,e.lecturer].join('|');
    if(allocationMap.has(key)){
      const existing=allocationMap.get(key);
      if(!existing.sections.includes(e.section)) existing.sections.push(e.section);
      continue;
    }
    allocationMap.set(key,{
      id:`AL-${String(wk.week).padStart(2,'0')}-${String(i+1).padStart(3,'0')}`,
      facilityId:e.facilityId,date,start:e.start,end:e.end,classId:`SCH-${i+1}`,
      owner:e.course,course:e.course,lecturer:e.lecturer,section:e.section,sections:[e.section],
      roomLabel:e.roomLabel,group:e.group,code:e.code,week:wk.week,
      source:'Jadwal Semester 125 v01 · mahasiswa',sourcePage:e.sourcePage,active:true
    });
  }
}
export const scheduleAllocations=[...allocationMap.values()];
// Pertemuan contoh yang dimiliki PJ demo dihubungkan ke jadwal terverifikasi.
const target=scheduleAllocations.find(a=>a.course==='Komputer dan Masyarakat' && a.section.startsWith('IK 25 B') && a.date==='2026-11-11');
export const scheduleMeetings=target?[{
  id:'MEET-001',classId:'KLS-001',allocationId:target.id,date:target.date,
  start:target.start,end:target.end,facilityId:target.facilityId,
  confirmation:'Belum Dikonfirmasi',released:false
}]:[];
