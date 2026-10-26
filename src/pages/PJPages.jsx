import {DateInput, TimeInput, SelectInput} from '../components/Inputs';
import React,{useMemo,useState} from 'react';
import DashboardTabs,{useDashboardTab} from '../components/DashboardTabs';
import {Link,useLocation,useNavigate,useParams,useSearchParams} from 'react-router-dom';
import {CalendarDays,ClipboardList,AlertTriangle,ArrowRight,CheckCircle2,Monitor,Building2,FileWarning,ChevronRight} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {facilities,DEMO_DATE} from '../data/demo';
import {getStatus,findFacility,formatDate,dateShort,formatStamp,isValidInterval} from '../utils/domain';
import {pjMenu} from '../data/sitemap';
import {Button,StatusBadge,Notice,Card,PageIntro,DetailRow,SectionHeader,MetricCard,EmptyState,DataTable,Modal,QuickSearch,Field} from '../components/UI';
import {CalendarGrid} from '../components/CalendarGrid';

const titleFor=(path)=>pjMenu.flatMap(g=>g.items).find(([,p])=>p===path)?.[0]||(path.startsWith('/pj/pengajuan/')?'Detail Pengajuan':'Dashboard PJ');
const mockMeetingId='MEET-001';
const bread=(title)=> <div className="mb-5 flex items-center gap-2 text-xs text-muted"><Link to="/pj" className="hover:text-primary">Dashboard PJ</Link><ChevronRight size={14}/><span className="font-medium text-primary">{title}</span></div>;
function PJSummary(){
 const {data}=useApp();
 const meeting=data.meetings.find(x=>x.id===mockMeetingId);
 const recent=[...data.requests].sort((a,b)=>(b.seq||0)-(a.seq||0)).slice(0,3);
 const pending=data.requests.filter(x=>x.status==='Menunggu Keputusan').length;
 return <>
  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
   <div><span className="kicker">BERANDA PJ</span><h2 className="mt-2 text-[28px] font-semibold text-ink">Selamat datang, PJ Demo</h2>
    <p className="mt-2 text-sm text-muted">Pantau konfirmasi kelas dan pengajuan tanpa menu yang berulang.</p></div>
   <Button to="/pj/cari">Cari ruang <ArrowRight size={16}/></Button>
  </div>
  <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
   <MetricCard label="Konfirmasi diperlukan" value={meeting?.confirmation==='Belum Dikonfirmasi'?'1':'0'} subtitle={meeting?`Pertemuan ${dateShort(meeting.date)}`:'Tidak ada jadwal'} icon={CalendarDays} tone="amber" to="/pj/konfirmasi"/>
   <MetricCard label="Pengajuan menunggu" value={pending} subtitle="Menunggu keputusan Admin" icon={ClipboardList} to="/pj/pengajuan"/>
   <MetricCard label="Total pengajuan" value={data.requests.length} subtitle="Buka detail pengajuan terbaru" icon={CheckCircle2} to="/pj/pengajuan"/>
  </div>
  <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
   <Card className="p-6">
    <SectionHeader title="Pertemuan yang perlu diperhatikan" to="/pj/konfirmasi"/>
    {meeting?<div className="flex flex-wrap items-start justify-between gap-4 rounded-xl bg-canvas p-5"><div>
     <p className="font-semibold text-ink">Komputer dan Masyarakat · Kelas A</p>
     <p className="mt-2 text-xs text-muted">{findFacility(meeting.facilityId)?.name} · {formatDate(meeting.date)} · {meeting.start}–{meeting.end} WIB</p>
     <div className="mt-3 flex flex-wrap gap-2"><StatusBadge value={meeting.released?'Tersedia':'Dialokasikan'}/><StatusBadge value={meeting.confirmation}/></div>
    </div><Button to="/pj/konfirmasi" variant="outline">Konfirmasi kelas</Button></div>:<EmptyState title="Belum ada pertemuan"/>}
    <div className="mt-5"><Notice title="Pengingat H-1">Tanpa konfirmasi, alokasi resmi tetap terlindungi.</Notice></div>
   </Card>
   <Card className="p-6">
    <SectionHeader title="Pengajuan terbaru" to="/pj/pengajuan" linkLabel="Lihat semua"/>
    {recent.length?<div className="space-y-3">{recent.map(r=><Link to={`/pj/pengajuan/${r.id}`} key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3 hover:bg-mint">
      <span><b className="text-sm text-ink">{r.id}</b><span className="mt-1 block text-xs text-muted">{findFacility(r.facilityId)?.name} · {dateShort(r.date)}</span></span>
      <span className="flex items-center gap-2"><StatusBadge value={r.status}/><ArrowRight size={15} className="text-primary"/></span>
     </Link>)}</div>:<EmptyState title="Belum ada pengajuan" description="Kirim permohonan pertama melalui Cari & Pinjam." action={<Button to="/pj/ajukan">Ajukan ruangan</Button>}/>}
    <div className="mt-5 grid gap-2 sm:grid-cols-2">{[['Cari ruangan','/pj/cari',CalendarDays],['Ajukan peminjaman','/pj/ajukan',ClipboardList],['Lapor ketidaksesuaian','/pj/lapor',FileWarning],['Konfirmasi pelaksanaan','/pj/konfirmasi',CheckCircle2]].map(([label,to,Icon])=><Link to={to} key={label} className="flex items-center gap-2 rounded-lg border border-line px-3 py-3 text-xs font-semibold text-ink hover:bg-mint"><Icon size={17} className="text-primary"/>{label}</Link>)}</div>
   </Card>
  </div>
 </>;
}
function MeetingCard({meeting,cta=true}){const f=findFacility(meeting.facilityId);return <Card className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">Komputer dan Masyarakat A</p><h3 className="mt-2 text-lg font-semibold text-ink">{f?.name||'Ruang belum ada'}</h3><p className="mt-1 text-xs text-muted">{formatDate(meeting.date)} · {meeting.start}–{meeting.end} WIB</p><div className="mt-4 flex flex-wrap gap-2"><StatusBadge value={meeting.released?'Tersedia':'Dialokasikan'}/><StatusBadge value={meeting.confirmation}/></div></div>{cta&&<Button variant="outline" to="/pj/konfirmasi">Konfirmasi pelaksanaan</Button>}</div></Card>}
function PJConfirm(){
 const {data,confirmMeeting,releaseMeeting,notify}=useApp();
 const m=data.meetings.find(x=>x.id===mockMeetingId);
 const [choice,setChoice]=useState(m?.confirmation==='Belum Dikonfirmasi'?'Tetap Offline':m?.confirmation||'Tetap Offline');
 const [open,setOpen]=useState(false);
 if(!m)return <EmptyState title="Tidak ada jadwal pertemuan untuk dikonfirmasi"/>;
 const enabled=!m.released&&m.confirmation==='Berubah Online';
 return <div className="space-y-5"><MeetingCard meeting={m} cta={false}/>
  <Card className="p-6"><h3 className="font-semibold text-ink">Konfirmasi pelaksanaan</h3>
   <p className="mt-2 text-xs text-muted">Pengingat H-1: alokasi tetap dilindungi walaupun PJ belum mengonfirmasi.</p>
   <div className="mt-5 grid gap-3 md:grid-cols-2">{[['Tetap Offline','Kelas tetap menggunakan ruangan sesuai jadwal resmi.',Building2],['Berubah Online','Kelas dilaksanakan daring. Ruangan tidak otomatis dilepas.',Monitor]].map(([value,desc,Icon])=><button key={value} onClick={()=>setChoice(value)} aria-pressed={choice===value} className={`rounded-xl border-2 p-5 text-left transition ${choice===value?'border-primary bg-mint':'border-line bg-white hover:bg-canvas'}`}><Icon size={20} className="text-primary"/><p className="mt-3 text-sm font-semibold text-ink">{value}</p><p className="mt-2 text-xs text-muted">{desc}</p></button>)}</div>
   <div className="mt-5 flex flex-wrap gap-3"><Button disabled={m.released} onClick={()=>confirmMeeting(mockMeetingId,choice)}>Simpan konfirmasi</Button>
    {m.released&&<StatusBadge value="Tersedia"/>}</div>
  </Card>
  <Card className="p-6"><h3 className="font-semibold text-ink">Lepaskan alokasi (opsional)</h3>
   <p className="mt-2 text-xs leading-relaxed text-muted">Tindakan pelepasan berbeda dari konfirmasi online. Setelah dilepas, ruang dapat diajukan pihak lain.</p>
   {m.released?<div className="mt-4"><Notice tone="success" title="Alokasi sudah dilepas">Ruangan telah dilepaskan dan tidak dapat dikembalikan sepihak.</Notice></div>:<><Button className="mt-5" variant="danger" disabled={!enabled} onClick={()=>setOpen(true)}>Lepaskan alokasi <AlertTriangle size={16}/></Button>{!enabled&&<p className="mt-3 text-xs text-warning">Simpan pilihan Berubah Online terlebih dahulu sebelum melepas ruangan.</p>}</>}
  </Card>
  <Modal open={open} onClose={()=>setOpen(false)} danger title="Yakin ingin melepas alokasi?" description="Alokasi bisa diberikan kepada pihak lain dan tidak otomatis dapat dibatalkan."
   actions={<><Button variant="outline" onClick={()=>setOpen(false)}>Jangan lepaskan</Button><Button variant="danger" onClick={()=>{const r=releaseMeeting(mockMeetingId);setOpen(false);if(!r.ok)notify(r.message,'error')}}>Ya, lepaskan alokasi</Button></>}>
   <p className="rounded-xl bg-canvas p-4 text-xs text-ink">{findFacility(m.facilityId)?.name} · {formatDate(m.date)} · {m.start}–{m.end} WIB</p>
  </Modal>
 </div>;
}
const searchTabs=[{value:'list',text:'Hasil Pencarian'},{value:'calendar',text:'Kalender Ketersediaan'}];
function PJSearch(){const {search,status,notify}=useApp();const [tab,setTab]=useDashboardTab('list',searchTabs.map(x=>x.value));
 const list=facilities.filter(f=>(search.type==='all'||f.type===search.type)&&(!search.building||f.building===search.building)&&(!search.capacity||f.capacity>=Number(search.capacity))&&(!search.floor||String(f.floor)===String(search.floor))&&(!search.features?.length||search.features.every(x=>f.features.includes(x)))&&(!search.text||[f.name,f.building].join(' ').toLowerCase().includes(search.text.toLowerCase())));
 return <div className="space-y-5"><QuickSearch mode="pj" showType actionText="Perbarui hasil" onSearch={()=>notify('Daftar ruangan diperbarui sesuai pencarian.')}/>
 <DashboardTabs items={searchTabs} active={tab} onChange={setTab} label="Pencarian dan kalender"/>
 {tab==='calendar'?<CalendarGrid type="all"/>:<>{list.length===0&&<EmptyState title="Belum ada ruangan yang sesuai"/>}
 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map(f=>{const slot=status(f.id,search.date,search.start,search.end);return <Card className="p-5" key={f.id}><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold text-ink">{f.name}</h3><p className="mt-1 text-[11px] text-muted">{f.building} · {f.type==='lab'?'Lab komputer':'Ruang kuliah'}</p></div><StatusBadge small value={slot.label}/></div><p className="mt-4 min-h-[42px] text-xs leading-relaxed text-muted">{slot.reason}</p><Button className="mt-5 w-full" variant={slot.label==='Tersedia'?'primary':'outline'} to={slot.label==='Tersedia'?`/pj/ajukan?facility=${f.id}`:'/pj/cari?tab=calendar'}>{slot.label==='Tersedia'?'Ajukan ruangan':'Lihat kalender'}</Button></Card>})}</div></>}
 </div>;
}
function PJRequestForm(){const {search,submitRequest,notify}=useApp();const [params]=useSearchParams();const nav=useNavigate();const [fId,setFId]=useState(params.get('facility')||'gds-507');const [date,setDate]=useState(search.date);const [start,setStart]=useState(search.start);const [end,setEnd]=useState(search.end);const [purpose,setPurpose]=useState('');const [error,setError]=useState('');
 function submit(e){e.preventDefault();const r=submitRequest({facilityId:fId,date,start,end,purpose});if(r.ok)nav(`/pj/pengajuan/${r.id}`);else{setError(r.message);notify(r.message,'error');}}
 return <form onSubmit={submit} className="space-y-5"><Notice title="Pengajuan tidak sama dengan persetujuan">Setelah dikirim, status awal adalah <strong>Menunggu Keputusan</strong>. Hanya admin yang dapat menyetujui atau menolak.</Notice><Card className="p-6"><div className="grid gap-5 md:grid-cols-2"><Field label="Penanggung jawab"><input className="field bg-canvas" readOnly value="PJ Demo MATRA"/></Field><Field label="Kelas mata kuliah"><input readOnly className="field bg-canvas" value="Komputer dan Masyarakat A"/></Field><Field label="Ruang / lab" required><SelectInput className="field" value={fId} onChange={e=>setFId(e.target.value)}>{facilities.map(f=><option key={f.id} value={f.id}>{f.name} · {f.building}</option>)}</SelectInput></Field><Field label="Tanggal" required><DateInput type="date" className="field" value={date} onChange={e=>setDate(e.target.value)}/></Field><Field label="Waktu mulai (WIB)" required><TimeInput type="time" className="field" value={start} onChange={e=>setStart(e.target.value)}/></Field><Field label="Waktu selesai (WIB)" required><TimeInput type="time" className="field" value={end} onChange={e=>setEnd(e.target.value)}/></Field></div><Field className="mt-5" label="Keperluan peminjaman" required hint="Jelaskan tujuan dan kebutuhan penggunaan (minimal 10 karakter)."><textarea className="field h-32 resize-y py-3" value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder="Contoh: kelas pengganti untuk perkuliahan Komputer dan Masyarakat..."/></Field>{error&&<p className="mt-4 text-xs text-danger" role="alert">{error}</p>}<div className="mt-6 flex flex-wrap gap-3"><Button type="submit">Kirim pengajuan</Button><Button variant="outline" to="/pj/cari">Cari ruangan lain</Button></div></Card></form>}
function PJReport(){const {addIssue,notify}=useApp();const [facilityId,setFacility]=useState('gds-607');const [date,setDate]=useState(DEMO_DATE);const [time,setTime]=useState('09:00');const [text,setText]=useState('');const [done,setDone]=useState('');function submit(e){e.preventDefault();const r=addIssue({facilityId,date,time,text});if(r.ok){setDone(r.id);setText('')}else notify(r.message,'error');}return <Card className="max-w-3xl p-6"><h3 className="font-semibold text-ink">Laporan ketidaksesuaian ruang atau jadwal</h3><p className="mt-2 text-xs text-muted">Laporan masuk ke admin untuk diperiksa; tidak mengubah hak alokasi secara otomatis.</p>{done&&<div className="mt-4"><Notice title={`Laporan ${done} diterima`}>Status penanganan dapat diperiksa oleh admin demo.</Notice></div>}<form className="mt-6 space-y-4" onSubmit={submit}><Field label="Ruang terkait"><SelectInput className="field" value={facilityId} onChange={e=>setFacility(e.target.value)}>{facilities.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</SelectInput></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Tanggal"><DateInput className="field" type="date" value={date} onChange={e=>setDate(e.target.value)}/></Field><Field label="Waktu (WIB)"><TimeInput className="field" type="time" value={time} onChange={e=>setTime(e.target.value)}/></Field></div><Field label="Uraian laporan"><textarea className="field h-32 resize-y py-3" required value={text} onChange={e=>setText(e.target.value)} placeholder="Tuliskan kondisi sebenarnya dan apa yang tidak sesuai..."/></Field><Button type="submit">Kirim laporan</Button></form></Card>}
const pjRequestTabs=[{value:'all',text:'Semua'},{value:'pending',text:'Menunggu'},{value:'approved',text:'Disetujui'},{value:'rejected',text:'Ditolak'},{value:'cancelled',text:'Dibatalkan'}];
const requestFilters={pending:'Menunggu Keputusan',approved:'Disetujui',rejected:'Ditolak',cancelled:'Dibatalkan'};
function PJRequestsHub(){const {data}=useApp();const [tab,setTab]=useDashboardTab('all',pjRequestTabs.map(x=>x.value));
 const rows=[...data.requests].sort((a,b)=>(b.seq||0)-(a.seq||0)).filter(r=>tab==='all'||r.status===requestFilters[tab]);
 return <Card className="p-5 md:p-6"><SectionHeader title="Pengajuan Saya" caption="Satu tempat untuk memantau status, keputusan, alasan penolakan, dan pembatalan pengajuan." to="/pj/ajukan" linkLabel="Ajukan baru"/>
 <DashboardTabs items={pjRequestTabs} active={tab} onChange={setTab} label="Filter status pengajuan"/>
 {rows.length?<DataTable head={['Nomor','Ruangan','Waktu','Status','Tindakan']} rows={rows.map(r=>[
  <b>{r.id}</b>,findFacility(r.facilityId)?.name,<span>{dateShort(r.date)}<br/>{r.start}–{r.end} WIB</span>,<StatusBadge value={r.status}/>,<Button variant="outline" to={`/pj/pengajuan/${r.id}`}>Lihat detail</Button>])}/>:<EmptyState title="Belum ada pengajuan dengan status ini" action={<Button to="/pj/ajukan">Ajukan ruang</Button>}/>}
 </Card>;
}
function PJRequestDetail(){const {id}=useParams();const {data,cancelRequest,notify}=useApp();const req=data.requests.find(x=>x.id===id);const [confirm,setConfirm]=useState(false);if(!req)return <EmptyState title="Pengajuan tidak ditemukan" action={<Button to="/pj">Kembali ke beranda PJ</Button>}/>;return <><Card className="max-w-4xl p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="kicker">NOMOR PENGAJUAN</span><h3 className="mt-1 text-2xl font-semibold text-ink">{req.id}</h3></div><StatusBadge value={req.status}/></div><dl className="mt-5"><DetailRow label="Ruangan" value={findFacility(req.facilityId)?.name}/><DetailRow label="Tanggal" value={formatDate(req.date)}/><DetailRow label="Waktu" value={`${req.start}–${req.end} WIB`}/><DetailRow label="Diterima (simulasi)" value={formatStamp(req.received)}/><DetailRow label="Keperluan" value={req.purpose}/><DetailRow label="Status permohonan" value={<StatusBadge value={req.status}/>}/><DetailRow label="Keputusan admin" value={req.status==='Menunggu Keputusan'?'Belum ada keputusan':req.status}/>{req.reason&&<DetailRow label="Alasan penolakan" value={req.reason}/>}</dl><div className="mt-6 flex flex-wrap gap-3"><Button variant="outline" to="/pj/pengajuan">Kembali ke pengajuan saya</Button>{req.status==='Menunggu Keputusan'&&<Button variant="danger" onClick={()=>setConfirm(true)}>Batalkan pengajuan</Button>}{req.status==='Ditolak'&&<Button to="/pj/cari">Cari ruang lain</Button>}</div></Card><Modal danger open={confirm} onClose={()=>setConfirm(false)} title={`Batalkan ${req.id}?`} description="Pengajuan akan menjadi Dibatalkan dan tetap tersimpan dalam riwayat." actions={<><Button variant="outline" onClick={()=>setConfirm(false)}>Kembali</Button><Button variant="danger" onClick={()=>{const r=cancelRequest(req.id);setConfirm(false);if(!r.ok)notify(r.message,'error');}}>Ya, batalkan</Button></>}/></>}
function PJInfo(){
 const {data}=useApp();
 return <Card className="max-w-3xl p-6"><h3 className="font-semibold text-ink">Identitas dan lingkup penugasan PJ</h3>
  <dl className="mt-4"><DetailRow label="Nama" value="PJ Demo MATRA (simulasi)"/>
   <DetailRow label="Program Studi" value="S1 Ilmu Komputer"/>
   <DetailRow label="Mata kuliah" value="Komputer dan Masyarakat"/>
   <DetailRow label="Kelas" value="A"/>
   <DetailRow label="Semester" value="2026/2027 Ganjil (contoh)"/>
   <DetailRow label="Status akses" value={data.pjCodeActive?'Aktif':'Tidak aktif'}/>
   <DetailRow label="Batas akses" value="Hanya penugasan sendiri"/>
  </dl>
 </Card>;
}
export function PJPage(){
 const {pathname}=useLocation();
 const {data}=useApp();
 const title=titleFor(pathname);
 const meeting=data.meetings.find(x=>x.id===mockMeetingId);
 const content=()=>{
  switch(pathname){
   case '/pj':return <PJSummary/>;
   case '/pj/konfirmasi':return <PJConfirm/>;
   case '/pj/cari':return <PJSearch/>;
   case '/pj/ajukan':return <PJRequestForm/>;
   case '/pj/pengajuan':return <PJRequestsHub/>;
   case '/pj/lapor':return <PJReport/>;
   case '/pj/identitas':return <PJInfo/>;
   default:return pathname.startsWith('/pj/pengajuan/')?<PJRequestDetail/>:<EmptyState title="Halaman tidak tersedia" description="Halaman serupa telah digabungkan. Gunakan menu dashboard yang terbaru." action={<Button to="/pj">Kembali ke dashboard</Button>}/>;
  }
 };
 return <div className="max-w-[1300px]">{pathname!=='/pj'&&<>{bread(title)}<PageIntro title={title} description="Area penanggung jawab mata kuliah · Data dan interaksi dalam mode simulasi frontend."/></>}{content()}</div>;
}
