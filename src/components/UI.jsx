import {DateInput, TimeInput, SelectInput} from './Inputs';
import MediaFrame from './MediaFrame';
import React,{useEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {ArrowRight,Info,CheckCircle2,AlertTriangle,X,Search,SlidersHorizontal,Building2,Monitor,MapPin,Inbox,ShieldAlert} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {facilities} from '../data/demo';
import {formatDate,formatStamp,findFacility,isValidInterval,statusFamily} from '../utils/domain';

export function Button({children,to,variant='primary',className='',onClick,disabled=false,type='button',icon:Icon, ...props}){
 const cls=({primary:'btn-primary',outline:'btn-outline',soft:'btn-soft',light:'btn-light',danger:'btn-danger',ghost:'btn-ghost'})[variant]||'btn-primary';
 if(to && !disabled)return <Link to={to} className={`${cls} ${className}`} {...props}>{Icon&&<Icon size={16}/>} {children}</Link>;
 return <button type={type} disabled={disabled} className={`${cls} ${className}`} onClick={onClick} {...props}>{Icon&&<Icon size={16}/>} {children}</button>;
}
export function StatusBadge({value,small=false,className=''}){
 const colors={
  'Tersedia':'border-[#bbebc8] bg-[#e7f8eb] text-[#15803D]',
  'Belum Terverifikasi':'border-[#d9e0e5] bg-[#f1f4f6] text-[#64748B]',
  'Dialokasikan':'border-[#9ed9d3] bg-[#d9f1ee] text-[#006569]',
  'Tidak Tersedia':'border-[#d9e0e5] bg-[#eaf0f3] text-[#64748B]',
  'Konflik':'border-[#f6c8c4] bg-[#fff0ed] text-[#B42318]',
  'Menunggu Keputusan':'border-[#f1e4b2] bg-[#fff8df] text-[#8B5700]',
  'Disetujui':'border-[#bbebc8] bg-[#e7f8eb] text-[#15803D]',
  'Ditolak':'border-[#f6c8c4] bg-[#fff0ed] text-[#B42318]',
  'Dibatalkan':'border-[#d9e0e5] bg-[#eaf0f3] text-[#64748B]',
  'Belum Dikonfirmasi':'border-[#d9e0e5] bg-[#eaf0f3] text-[#64748B]',
  'Tetap Offline':'border-[#9ed9d3] bg-[#d9f1ee] text-[#006569]',
  'Berubah Online':'border-[#bfcefa] bg-[#eaf1ff] text-[#1D4ED8]',
  'Ditindaklanjuti':'border-[#bbebc8] bg-[#e7f8eb] text-[#15803D]',
  'Belum ditindaklanjuti':'border-[#f1e4b2] bg-[#fff8df] text-[#8B5700]'
 };
 return <span data-status-family={statusFamily[value]||'other'} className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-md border font-semibold ${small?'px-2 py-1 text-[10px]':'px-2.5 py-1.5 text-[11px]'} ${colors[value]||'border-line bg-canvas text-muted'} ${className}`}><span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"/>{value}</span>;
}
export function Notice({title,children,tone='info',className='',icon:Icon}){
 const styles={info:['border-[#c9e7e4] bg-mint text-primary',Info],warn:['border-[#f0dfad] bg-[#fff9e9] text-warning',AlertTriangle],danger:['border-[#f3c1be] bg-[#fff2f0] text-danger',ShieldAlert],success:['border-[#c6e8cb] bg-[#eff9f0] text-success',CheckCircle2]};
 const [style,DefaultIcon]=styles[tone]||styles.info; const TheIcon=Icon||DefaultIcon;
 return <div className={`flex gap-4 rounded-xl border px-5 py-4 ${style} ${className}`} role={tone==='danger'?'alert':'note'}><TheIcon size={19} className="mt-0.5 shrink-0"/><div className="min-w-0"><p className="text-[13px] font-semibold">{title}</p>{children&&<div className="mt-1 text-[12px] leading-relaxed text-ink">{children}</div>}</div></div>;
}
export function Breadcrumbs({items=[]}){return <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted"><Link to="/" className="hover:text-primary">Beranda</Link>{items.map((it,i)=><React.Fragment key={i}><span aria-hidden="true">/</span>{it.to?<Link className="hover:text-primary" to={it.to}>{it.label}</Link>:<span aria-current="page" className="text-primary">{it.label}</span>}</React.Fragment>)}</nav>}
export function PageIntro({eyebrow,title,description,action,children}){return <div className="mb-7 flex flex-wrap items-start justify-between gap-5"><div className="max-w-[750px]">{eyebrow&&<p className="kicker mb-2">{eyebrow}</p>}<h1 className="page-title">{title}</h1>{description&&<p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}{children}</div>{action}</div>}
export function Card({children,className='',...props}){return <div className={`panel ${className}`} {...props}>{children}</div>}
export function Field({label,required=false,children,hint,error,className=''}){return <label className={`block min-w-0 ${className}`}><span className="field-label">{label}{required&&<span className="text-danger"> *</span>}</span>{children}{hint&&<span className="mt-1.5 block text-[11px] text-muted">{hint}</span>}{error&&<span role="alert" className="mt-1.5 block text-[11px] text-danger">{error}</span>}</label>}
export function EmptyState({title='Belum ada hasil',description='Ubah filter atau periksa pilihan waktu.',action}){return <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas text-muted"><Inbox size={27}/></div><h3 className="font-semibold text-ink">{title}</h3><p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">{description}</p>{action&&<div className="mt-5">{action}</div>}</div>}
export function Modal({open,onClose,title,description,children,actions,danger=false}){
 const ref=useRef(null),prevFocus=useRef(null);
 useEffect(()=>{if(!open)return;prevFocus.current=document.activeElement;const k=e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const focusables=Array.from(ref.current?.querySelectorAll('button,input,textarea,select,a[href]')||[]).filter(el=>!el.disabled);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};document.addEventListener('keydown',k);const t=setTimeout(()=>ref.current?.querySelector('button')?.focus(),0);return()=>{clearTimeout(t);document.removeEventListener('keydown',k);prevFocus.current?.focus?.();};},[open,onClose]);
 if(!open)return null;
 return <div className="dialog-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#112b32]/60 px-4 py-6" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><section ref={ref} role="dialog" aria-modal="true" aria-labelledby="matra-dialog-title" aria-describedby="matra-dialog-desc" className="dialog-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-4 flex items-start justify-between gap-3"><div className="flex items-center gap-3">{danger&&<div className="rounded-full bg-[#fff0ed] p-2 text-danger"><AlertTriangle size={22}/></div>}<h2 id="matra-dialog-title" className="text-lg font-semibold text-ink">{title}</h2></div><button type="button" className="rounded-md p-1 text-muted hover:bg-canvas" onClick={onClose} aria-label="Tutup dialog"><X size={20}/></button></div>{description&&<p id="matra-dialog-desc" className="mb-4 text-sm leading-relaxed text-muted">{description}</p>}{children}<div className="mt-6 flex flex-wrap justify-end gap-2">{actions||<Button variant="outline" onClick={onClose}>Tutup</Button>}</div></section></div>;
}
export function QuickSearch({className='',mode='public',compact=false,onSearch,actionText='Cari ketersediaan',showType=false}){
 const {search,updateSearch}=useApp();const navigate=useNavigate();const [error,setError]=useState('');
 function submit(e){e.preventDefault();if(!isValidInterval(search.start,search.end)){setError('Waktu selesai harus lebih besar dari waktu mulai.');return;}if(!search.date){setError('Pilih tanggal pencarian.');return;}setError('');if(onSearch){onSearch(search);return;}const qs=new URLSearchParams({date:search.date,start:search.start,end:search.end,type:search.type});navigate((mode==='pj'?'/pj/cari':'/cari/hasil')+'?'+qs);}
 return <form onSubmit={submit} className={`${compact?'p-4':'p-5 md:p-6'} rounded-xl bg-canvas ${className}`}><div className={`grid items-end gap-3 md:gap-4 ${showType?'sm:grid-cols-2 lg:grid-cols-5':'sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.7fr]'}`}>
 {showType&&<Field label="Jenis fasilitas"><SelectInput className="field" value={search.type} onChange={e=>updateSearch({type:e.target.value})}><option value="all">Semua fasilitas</option><option value="room">Ruang Kuliah</option><option value="lab">Lab Komputer</option></SelectInput></Field>}
 <Field label="Tanggal"><DateInput aria-label="Tanggal pencarian" type="date" className="field" value={search.date} onChange={e=>updateSearch({date:e.target.value})}/></Field>
 <Field label="Waktu mulai"><TimeInput type="time" className="field" aria-label="Waktu mulai WIB" value={search.start} onChange={e=>updateSearch({start:e.target.value})}/></Field>
 <Field label="Waktu selesai"><TimeInput type="time" className="field" aria-label="Waktu selesai WIB" value={search.end} onChange={e=>updateSearch({end:e.target.value})}/></Field>
 <Field label="Temukan slot yang sesuai"><Button className="w-full" type="submit">{actionText}<Search size={16}/></Button></Field>
 </div>{error&&<p role="alert" className="mt-3 text-xs font-medium text-danger">{error}</p>}</form>;
}
/** Filter lab: hanya nama lab dan perangkat lunak, tanpa checklist fasilitas standar. */
export function FilterPanel({showType=false,boxed=true,limitType=null}){
 const {search,updateSearch}=useApp();
 const [draft,setDraft]=useState(search);
 useEffect(()=>setDraft(search),[search]);
 const rooms=facilities.filter(f=>f.type==='room');
 const labs=facilities.filter(f=>f.type==='lab');
 const type=limitType || (showType?draft.type:search.type);
 const selectable=type==='lab'?labs:type==='room'?rooms:facilities;
 const softwareOptions=[...new Set(labs.flatMap(l=>(l.software||[]).map(s=>s.name)))].sort();
 function submit(e){e.preventDefault();updateSearch({roomId:draft.roomId||'',software:type==='lab'?(draft.software||''):'',type:showType?(draft.type||'all'):search.type});}
 function reset(){const next={...search,roomId:'',software:'',type:showType?'all':search.type};setDraft(next);updateSearch(next);}
 return <form className={`${boxed?'panel p-5 md:p-6':'p-0'}`} onSubmit={submit}>
  <h2 className="mb-5 flex items-center gap-2 font-semibold text-ink"><SlidersHorizontal size={18} className="text-primary"/>{type==='lab'?'Filter perangkat lunak':'Pilih ruangan'}</h2>
  <div className="space-y-5">
   {showType&&<Field label="Jenis ruangan"><SelectInput className="field" value={draft.type||'all'} onChange={e=>setDraft(prev=>({...prev,type:e.target.value,roomId:'',software:''}))}><option value="all">Semua ruang & lab</option><option value="room">Ruang Kuliah</option><option value="lab">Lab Komputer</option></SelectInput></Field>}
   <Field label={type==='lab'?'Nama laboratorium':'Nama ruangan'}>
    <SelectInput className="field" value={draft.roomId||''} onChange={e=>setDraft(prev=>({...prev,roomId:e.target.value}))} aria-label="Pilih nama ruangan">
      <option value="">{type==='lab'?'Semua lab':type==='room'?'Semua ruang kuliah':'Semua ruang & lab'}</option>
      {selectable.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
    </SelectInput>
   </Field>
   {type==='lab'&&<Field label="Perangkat lunak"><SelectInput className="field" value={draft.software||''} onChange={e=>setDraft(prev=>({...prev,software:e.target.value}))} aria-label="Pilih perangkat lunak"><option value="">Semua perangkat lunak</option>{softwareOptions.map(name=><option key={name} value={name}>{name}</option>)}</SelectInput><span className="mt-2 block text-[11px] leading-relaxed text-muted">Daftar software masih contoh UI dan perlu validasi pada setiap lab.</span></Field>}
  </div>
  <div className="mt-6 grid gap-2"><Button type="submit" className="w-full">Terapkan filter</Button><Button variant="outline" className="w-full" onClick={reset}>Reset filter</Button></div>
 </form>;
}
export function FacilityCard({facility,slot,detailTo,context='',compact=false}){
 const to=detailTo||(facility.type==='lab'?`/lab-komputer/${facility.id}`:`/ruang-kuliah/${facility.id}`);
 return <article className={`editorial-facility-card interactive-card group overflow-hidden rounded-2xl border border-line bg-white ${compact?'p-0':''}`}>
  <Link to={to} aria-label={`Lihat detail ${facility.name}`} className="block"><MediaFrame type={facility.type} id={facility.id} title={facility.name} compact className={compact?'h-24':'h-[154px]'} label={facility.type==='lab'?'LAB KOMPUTER':'RUANG KULIAH'} showTag={false}/></Link>
  <div className={`relative ${compact?'p-4':'p-5'}`}>
   <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.13em] text-primary">{facility.type==='lab'?'Laboratorium Komputer':'Ruang Kuliah'}</p><h3 className="text-[17px] font-semibold text-ink"><Link to={to} className="hover:text-primary">{facility.name}</Link></h3><p className="mt-1.5 text-[11px] text-muted">{facility.building} · Lantai {facility.floor}</p></div><StatusBadge value={slot.label} small/></div>
   <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
    <span className="inline-flex items-center gap-1.5"><MapPin size={14}/> Lantai {facility.floor}</span>
    {facility.id==='gds-613'&&<span>13 kursi</span>}
    {facility.type==='lab'&&<span className="inline-flex items-center gap-1.5 font-semibold text-primary"><Monitor size={14}/>{facility.computers==null?'Komputer belum terdata':`${facility.computers} komputer (data contoh)`}</span>}
   </div>
   {facility.type==='lab'&&!!facility.software?.length&&<p className="mt-3 line-clamp-2 text-[11px] leading-[1.8] text-muted">Perangkat lunak: {facility.software.map(x=>x.name).join(', ')}</p>}
   {context&&<p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">{context}</p>}
   <div className="mt-4"><Link to={to} className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-deep">Lihat detail <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1"/></Link></div>
  </div>
 </article>;
}
export function DataTable({head,rows,empty='Belum ada data untuk ditampilkan'}){return rows?.length?<div className="table-wrap"><table className="dashboard-table"><thead><tr>{head.map((x,i)=><th key={i} scope="col">{x}</th>)}</tr></thead><tbody>{rows.map((cells,i)=><tr key={i}>{cells.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>:<EmptyState title={empty}/>}
export function Toast(){const {feedback}=useApp();return feedback?<div role="status" aria-live="polite" className={`toast-enter fixed bottom-5 right-5 z-[120] flex max-w-[min(410px,calc(100vw-40px))] items-start gap-3 rounded-xl border bg-white px-4 py-3 text-xs shadow-xl ${feedback.tone==='error'?'border-[#f6c8c4] text-danger':'border-[#bfe7db] text-primary'}`}><CheckCircle2 size={19} className="shrink-0"/><span>{feedback.message}</span></div>:null;}
export function MetricCard({label,value,subtitle,icon:Icon,tone='teal',to}){const inner=<div className="panel interactive-card h-full min-h-[120px] p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium text-muted">{label}</p><p className="mt-2 text-[28px] font-semibold leading-none text-ink">{value}</p>{subtitle&&<p className="mt-3 text-[11px] leading-snug text-muted">{subtitle}</p>}</div><span className={`rounded-xl p-3 ${tone==='red'?'bg-[#fff1ed] text-danger':tone==='amber'?'bg-[#fff8e3] text-warning':'bg-mint text-primary'}`}>{Icon&&<Icon size={20}/>}</span></div></div>;return to?<Link className="block" to={to}>{inner}</Link>:inner;}
export function DetailRow({label,value}){return <div className="grid gap-1 border-b border-line/70 py-3 last:border-0 sm:grid-cols-[175px_1fr]"><dt className="text-xs text-muted">{label}</dt><dd className="text-xs font-medium text-ink">{value??'Belum tersedia'}</dd></div>}
export function SectionHeader({title,caption,to,linkLabel='Lihat semua'}){return <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 className="section-title">{title}</h2>{caption&&<p className="mt-1 text-xs text-muted">{caption}</p>}</div>{to&&<Link className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" to={to}>{linkLabel}<ArrowRight size={14}/></Link>}</div>}
