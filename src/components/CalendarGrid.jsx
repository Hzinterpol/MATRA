import {DateInput, TimeInput, SelectInput} from './Inputs';
import React,{useEffect,useMemo,useState} from 'react';
import {CalendarDays,ChevronLeft,ChevronRight,BookOpen,Clock3,Users,MapPin,ShieldAlert} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {facilities} from '../data/demo';
import {examPeriodOn,OFFICIAL_WEEKS} from '../data/schedule';
import {dateShort,formatDate,findFacility} from '../utils/domain';
import {addDays,weekMonday,intervalKey,calendarRanges} from '../utils/schedule';
import {StatusBadge,Modal,Button} from './UI';

const cellColors={
 'Tersedia':'border-[#bfe5c9] bg-[#eaf8ed] text-[#15803D]',
 'Dialokasikan':'border-[#a0d6d0] bg-[#def1ee] text-primary',
 'Tidak Tersedia':'border-[#d6e0e5] bg-[#edf1f3] text-muted',
 'Belum Terverifikasi':'border-[#d6e0e5] bg-[#f2f4f6] text-muted',
 'Konflik':'border-[#f5cbc6] bg-[#fff0ed] text-danger'
};
const dayOrder=(a,b)=>a.start.localeCompare(b.start)||a.course.localeCompare(b.course);
function ScheduleRows({events=[],closures=[],approved=[],meetings=[],emptyLabel='Tidak ada kegiatan resmi pada tanggal ini.'}){
 if(!events.length&&!closures.length&&!approved.length)return <p className="rounded-xl bg-canvas px-4 py-4 text-xs leading-relaxed text-muted">{emptyLabel}</p>;
 return <ol className="space-y-3">
  {events.slice().sort(dayOrder).map(a=>{const m=meetings.find(x=>x.allocationId===a.id);return <li key={a.id} className="rounded-xl border border-line bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-[13px] font-semibold text-ink">{a.course||a.owner}</p><span className="rounded-md bg-mint px-2 py-1 text-[10px] font-semibold text-primary">{a.start}–{a.end} WIB</span></div><div className="mt-3 grid gap-1.5 text-[11px] text-muted sm:grid-cols-2"><p className="flex items-start gap-1.5"><Users size={13} className="mt-0.5 shrink-0"/><span>Kelas: {(a.sections||[a.section||a.classId]).join(', ')}</span></p><p className="flex items-start gap-1.5"><BookOpen size={13} className="mt-0.5 shrink-0"/><span>Kode dosen: <strong className="text-ink">{a.lecturer||'Belum tercatat'}</strong></span></p><p className="flex items-start gap-1.5"><MapPin size={13} className="mt-0.5 shrink-0"/><span>Ruang terjadwal: {a.roomLabel||findFacility(a.facilityId)?.name}</span></p><p className="flex items-start gap-1.5"><Clock3 size={13} className="mt-0.5 shrink-0"/><span>Digunakan sampai <strong className="text-ink">{a.end} WIB</strong></span></p></div>{a.group&&<p className="mt-2 text-[10px] text-primary">Grup {a.group} · Pekan {a.week} · Luring sesuai rotasi</p>}{m&&<p className="mt-2 text-[11px] text-muted">Konfirmasi PJ: <StatusBadge small value={m.confirmation}/></p>}</li>})}
  {closures.map(c=><li key={c.id} className="rounded-xl border border-[#f1e4b2] bg-[#fff9e9] p-4"><p className="text-xs font-semibold text-[#8B5700]">Penutupan ruangan · {c.start}–{c.end} WIB</p><p className="mt-2 text-xs text-muted">Alasan: {c.reason}</p></li>)}
  {approved.map(r=><li key={r.id} className="rounded-xl border border-line bg-white p-4"><p className="text-xs font-semibold text-ink">Peminjaman disetujui ({r.id})</p><p className="mt-2 text-xs text-muted">{r.purpose||'Peminjaman'} · {r.start}–{r.end} WIB · PJ: {r.pj||'—'}</p></li>)}
 </ol>;
}
export function CalendarGrid({type='all',facilityId,admin=false,caption='Pilih slot untuk melihat mata kuliah, kode dosen, dan jam selesai.'}){
 const {data,search,status}=useApp();
 const [week,setWeek]=useState(()=>weekMonday(search.date||'2026-11-02'));
 const [selected,setSelected]=useState(null);
 const [timeFilter,setTimeFilter]=useState('all');
 const [roomFilter,setRoomFilter]=useState(facilityId||'all');
 const [page,setPage]=useState(0);
 const [agendaDate,setAgendaDate]=useState(search.date||'2026-11-02');
 const [agendaRoom,setAgendaRoom]=useState(facilityId||'gds-607');
 useEffect(()=>{setWeek(weekMonday(search.date||'2026-11-02'));setAgendaDate(search.date||'2026-11-02')},[search.date]);
 useEffect(()=>{if(facilityId){setRoomFilter(facilityId);setAgendaRoom(facilityId)}},[facilityId]);
 const days=useMemo(()=>Array.from({length:5},(_,i)=>addDays(week,i)),[week]);
 const options=useMemo(()=>facilities.filter(f=>type==='all'||f.type===type).sort((a,b)=>a.type===b.type?a.name.localeCompare(b.name):a.type==='room'?-1:1),[type]);
 const sortedOptions=roomFilter==='all'?options:options.filter(f=>f.id===roomFilter);
 const perPage=6;const pageCount=Math.max(1,Math.ceil(sortedOptions.length/perPage));
 const list=useMemo(()=>facilityId?options.filter(f=>f.id===facilityId):sortedOptions.slice(page*perPage,page*perPage+perPage),[facilityId,options,sortedOptions,page]);
 useEffect(()=>{if(page>=pageCount)setPage(0)},[pageCount,page]);
 const ranges=useMemo(()=>calendarRanges(data,list.map(f=>f.id),days,search.start,search.end),[data,list,days,search.start,search.end]);
 const visibleRanges=timeFilter==='all'?ranges:ranges.filter(([a,b])=>intervalKey(a,b)===timeFilter);
 const detailFor=(fid,date,start,end,overlapOnly=false)=>{
  const intersects=x=>!overlapOnly||(x.start<end&&start<x.end);
  return {
   events:data.allocations.filter(a=>a.active&&a.facilityId===fid&&a.date===date&&intersects(a)).sort(dayOrder),
   closures:data.closures.filter(c=>c.facilityId===fid&&c.date===date&&intersects(c)),
   approved:data.requests.filter(r=>r.status==='Disetujui'&&r.facilityId===fid&&r.date===date&&intersects(r))
  };
 };
 const weekMeta=OFFICIAL_WEEKS.find(w=>w.monday===week);
 const exam=examPeriodOn(week);
 const picked=selected?detailFor(selected.facility.id,selected.date,selected.start,selected.end,true):null;
 const daily=detailFor(agendaRoom,agendaDate,'00:00','23:59');
 return <div className="panel overflow-hidden">
  <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-5">
   <div><h3 className="flex items-center gap-2 font-semibold text-ink"><CalendarDays size={19} className="text-primary"/>Jadwal & ketersediaan ruangan</h3><p className="mt-1 max-w-xl text-xs leading-relaxed text-muted">{caption}</p>{weekMeta&&<p className="mt-2 text-[11px] font-semibold text-primary">Pekan {weekMeta.week} · Grup luring: {weekMeta.groups.length?weekMeta.groups.join(' dan '):'tidak terjadwal pada grup bergilir'}</p>}{exam&&<p className="mt-2 text-[11px] font-semibold text-warning">{exam.title}: jadwal ujian perlu dikonfirmasi.</p>}</div>
   <div className="flex flex-wrap items-center gap-2">
    <label className="sr-only" htmlFor="calendar-room">Nama ruangan</label>
    <SelectInput id="calendar-room" className="h-10 max-w-[185px] rounded-lg border border-line bg-white px-3 text-xs text-ink" value={roomFilter} disabled={!!facilityId} onChange={e=>{setRoomFilter(e.target.value);setPage(0);setTimeFilter('all');if(e.target.value!=='all')setAgendaRoom(e.target.value)}}>
     <option value="all">Semua ruangan</option>{options.map(f=><option key={f.id} value={f.id}>{f.name} · {f.type==='lab'?'Lab':'Kelas'}</option>)}
    </SelectInput>
    <label className="sr-only" htmlFor="calendar-hours">Rentang waktu</label>
    <SelectInput id="calendar-hours" className="h-10 max-w-[200px] rounded-lg border border-line bg-white px-3 text-xs text-ink" value={timeFilter} onChange={e=>setTimeFilter(e.target.value)}><option value="all">Semua jam tercatat</option>{ranges.map(([a,b])=><option key={a+b} value={intervalKey(a,b)}>{a}–{b} WIB</option>)}</SelectInput>
    <button type="button" className="rounded-lg border border-line bg-white p-2 text-primary hover:bg-mint" aria-label="Pekan sebelumnya" onClick={()=>{setWeek(addDays(week,-7));setTimeFilter('all')}}><ChevronLeft size={18}/></button>
    <span className="min-w-[145px] text-center text-[11px] font-semibold text-ink">{dateShort(days[0])} – {dateShort(days[4])}</span>
    <button type="button" className="rounded-lg border border-line bg-white p-2 text-primary hover:bg-mint" aria-label="Pekan berikutnya" onClick={()=>{setWeek(addDays(week,7));setTimeFilter('all')}}><ChevronRight size={18}/></button>
   </div>
  </header>
  <div className="overflow-x-auto p-4"><table className="w-full min-w-[780px] border-separate border-spacing-1.5 text-left"><thead><tr><th className="min-w-[152px] px-2 pb-2 text-[11px] font-semibold text-muted">Ruangan / Jam (WIB)</th>{days.map(day=><th key={day} className="min-w-[112px] rounded-lg bg-canvas px-2 py-3 text-center text-[11px] font-semibold text-ink">{formatDate(day,{weekday:'short',day:'numeric',month:'short',year:undefined})}</th>)}</tr></thead>
   <tbody>{list.flatMap(f=>visibleRanges.map(([start,end],i)=><tr key={f.id+start+end}><th className="min-w-[152px] rounded-lg px-2 py-2 align-middle"><span className="block text-[11px] font-semibold text-ink">{i===0?f.name:''}</span><span className="mt-1 block text-[10px] font-medium text-muted">{start}–{end}</span></th>{days.map(day=>{const slot=status(f.id,day,start,end);return <td key={day} className="p-0.5"><button type="button" aria-label={`${f.name}, ${formatDate(day)}, ${start}–${end} WIB, ${slot.label}`} onClick={()=>{setSelected({facility:f,date:day,start,end,...slot});setAgendaDate(day);setAgendaRoom(f.id)}} className={`calendar-cell flex w-full flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${cellColors[slot.label]||cellColors['Belum Terverifikasi']}`}><span className="text-[10px] font-semibold">{slot.label}</span></button></td>})}</tr>))}</tbody></table>
   {!visibleRanges.length&&<p className="p-5 text-center text-xs text-muted">Belum ada rentang jam tercatat. Pilih tanggal atau ruangan yang lain.</p>}
   {roomFilter==='all'&&pageCount>1&&<div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-canvas px-3 py-3 text-xs text-muted"><span>Menampilkan ruangan {page*perPage+1}–{Math.min(sortedOptions.length,(page+1)*perPage)} dari {sortedOptions.length}</span><div className="flex items-center gap-2"><button type="button" disabled={page===0} onClick={()=>setPage(i=>Math.max(i-1,0))} className="rounded-lg border border-line bg-white px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page>=pageCount-1} onClick={()=>setPage(i=>Math.min(i+1,pageCount-1))} className="rounded-lg border border-line bg-white px-3 py-2 disabled:opacity-40">Berikutnya</button></div></div>}
  </div>
  <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">{['Tersedia','Dialokasikan','Tidak Tersedia','Konflik','Belum Terverifikasi'].map(x=><StatusBadge key={x} value={x} small/>)}<span className="ml-auto text-[10px] text-muted">Jadwal Kuliah 125 v01 • WIB</span></div>
  <section className="border-t border-line bg-[#fbfdfd] px-5 py-6" aria-label="Daftar penggunaan ruangan harian"><div className="mb-4 flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-[15px] font-semibold text-ink">Daftar penggunaan ruangan</h3><p className="mt-1 text-xs text-muted">Mata kuliah, kelas, kode dosen, dan jam selesai pada tanggal terpilih.</p></div><div className="flex flex-wrap gap-2"><DateInput className="field h-10 w-[160px]" aria-label="Tanggal daftar penggunaan" type="date" value={agendaDate} onChange={e=>setAgendaDate(e.target.value)}/><SelectInput className="field h-10 w-[160px]" aria-label="Ruangan untuk daftar penggunaan" value={agendaRoom} onChange={e=>setAgendaRoom(e.target.value)}>{options.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</SelectInput></div></div>
   {examPeriodOn(agendaDate)&&<p className="mb-4 rounded-xl border border-[#f1e4b2] bg-[#fff9e9] p-3 text-xs text-[#8B5700]">{examPeriodOn(agendaDate).title} — jadwal ujian diatur terpisah. Jangan menganggap slot tersedia sebelum diverifikasi.</p>}
   <ScheduleRows {...daily} meetings={data.meetings} emptyLabel={examPeriodOn(agendaDate)?'Belum ada jadwal ujian yang dapat diverifikasi dari dokumen sumber.':'Tidak ada alokasi kelas di ruang ini pada tanggal tersebut dalam dokumen Semester 125.'}/>
  </section>
  <Modal open={!!selected} onClose={()=>setSelected(null)} title="Detail slot ruangan" description={selected?`${selected.facility.name} · ${formatDate(selected.date)} · ${selected.start}–${selected.end} WIB`:''} actions={<Button variant="outline" onClick={()=>setSelected(null)}>Selesai</Button>}>
   {selected&&<div className="space-y-4"><div className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3"><span className="text-xs font-semibold text-ink">Status ketersediaan</span><StatusBadge value={selected.label}/></div><p className="text-xs leading-relaxed text-muted">{selected.reason}</p>
    <div><h4 className="mb-3 text-sm font-semibold text-ink">{selected.label==='Tersedia'?'Tidak ada kegiatan yang beririsan':'Alasan penggunaan / blokir pada interval ini'}</h4><ScheduleRows {...picked} meetings={data.meetings} emptyLabel="Tidak ada kegiatan yang beririsan dengan slot ini."/></div>
    <p className="text-[11px] leading-relaxed text-muted">Daftar penggunaan lengkap untuk ruangan dan tanggal ini juga tersedia di bawah kalender. Perubahan dari admin pada simulasi tidak mencerminkan kondisi langsung kampus.</p></div>}
  </Modal>
 </div>;
}
