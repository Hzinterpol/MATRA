import { facilities, campusServices } from '../data/demo.js';
import { examPeriodOn } from '../data/schedule.js';

export function toMinutes(value='00:00') {const [h,m]=String(value).split(':').map(Number);return h*60+m;}
export function isValidInterval(start,end) {return /^\d\d:\d\d$/.test(start||'') && /^\d\d:\d\d$/.test(end||'') && toMinutes(start)<toMinutes(end);}
export function overlaps(aStart,aEnd,bStart,bEnd) {return toMinutes(aStart)<toMinutes(bEnd) && toMinutes(bStart)<toMinutes(aEnd);}
export function formatDate(date, options={}) {if(!date)return 'Belum tersedia';try{return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta',...options}).format(new Date(date+'T12:00:00Z'));}catch{return date;}}
export function dateShort(date){if(!date)return '—';return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Jakarta'}).format(new Date(date+'T12:00:00Z'));}
export function formatStamp(stamp){if(!stamp)return '—';try{return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'}).format(new Date(stamp))+' WIB';}catch{return stamp;}}
export function findFacility(id){return facilities.find(f=>f.id===id);}
export function findService(id){return campusServices.find(s=>s.id===id);}
export function getStatus(state,facilityId,date,start,end){
  if(!isValidInterval(start,end))return {label:'Tidak Tersedia',reason:'Rentang waktu tidak valid.'};
  const activeAllocations=state.allocations.filter(a=>a.active && a.facilityId===facilityId&&a.date===date&&overlaps(start,end,a.start,a.end));
  const approved=state.requests.filter(r=>r.status==='Disetujui'&&r.facilityId===facilityId&&r.date===date&&overlaps(start,end,r.start,r.end));
  const closures=state.closures.filter(c=>c.facilityId===facilityId&&c.date===date&&overlaps(start,end,c.start,c.end));
  const closed=closures.length>0;
  if(activeAllocations.length+approved.length>1 || (closed&&(activeAllocations.length+approved.length)>0)) return {label:'Konflik',reason:'Terdapat lebih dari satu kegiatan/penutupan yang beririsan dalam ruangan fisik yang sama. Admin perlu memverifikasi.',allocations:activeAllocations,approved,closures};
  if(closed)return {label:'Tidak Tersedia',reason:closures.map(c=>c.reason).join('; ')||'Ruangan ditutup oleh pengelola.',closures};
  if(activeAllocations.length+approved.length>0)return {label:'Dialokasikan',reason:'Slot digunakan atau dilindungi oleh jadwal Semester 125 / peminjaman yang disetujui.',allocations:activeAllocations,approved};
  const exam=examPeriodOn(date);
  if(exam)return {label:'Belum Terverifikasi',reason:`${exam.title}. ${exam.detail}`,exam};
  if(date<'2026-09-01'||date>'2026-12-13')return {label:'Belum Terverifikasi',reason:'Tanggal di luar rentang kuliah yang dapat diproyeksikan dari Semester 125. Periksa jadwal terbaru dengan admin.'};
  if(!state.allocations.some(a=>a.facilityId===facilityId&&String(a.source||'').includes('Semester 125')))return {label:'Belum Terverifikasi',reason:'Ruangan ini belum memiliki entri jadwal dengan lokasi yang dapat diverifikasi dari dokumen Semester 125. Jangan menganggapnya tersedia tanpa konfirmasi pengelola.'};
  return {label:'Tersedia',reason:'Tidak tercatat kelas luring, peminjaman disetujui, atau penutupan pada interval ini menurut data Semester 125 dan simulasi lokal; bukan jaminan ketersediaan real-time.'};
}
export function getAlternatives(state,filters){return facilities.filter(f=>filters.type==='all'||!filters.type||f.type===filters.type).map(f=>({...f, slot:getStatus(state,f.id,filters.date,filters.start,filters.end)})).filter(f=>f.slot.label==='Tersedia');}
export const nextNumber=(list,prefix)=>prefix+String(Math.max(0,...list.map(x=>Number(x.id?.split('-').pop())||0))+1).padStart(3,'0');
export const statusFamily={
  'Tersedia':'slot','Dialokasikan':'slot','Tidak Tersedia':'slot','Konflik':'slot','Belum Terverifikasi':'slot',
  'Menunggu Keputusan':'request','Disetujui':'request','Ditolak':'request','Dibatalkan':'request',
  'Belum Dikonfirmasi':'confirmation','Tetap Offline':'confirmation','Berubah Online':'confirmation'
};
export function filterFacilities(all, query={}) {
 const q=(query.text||'').toLowerCase();
 return all.filter(f=>
  (!query.type||query.type==='all'||f.type===query.type)&&
  (!query.roomId||f.id===query.roomId)&&
  (!q||[f.name,f.building,f.description].join(' ').toLowerCase().includes(q))&&
  (!query.software||f.type==='lab'&&(f.software||[]).some(x=>x.name===query.software))
 );
}
