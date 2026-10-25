import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {useLocation,useNavigate} from 'react-router-dom';
import {Search,ArrowUpRight,BookOpen,CalendarDays,Building2,Monitor,FileText,LogIn,LayoutDashboard,X,Clock3} from 'lucide-react';
import {facilities} from '../data/demo';
import {timetable125} from '../data/timetable125';
import {adminMenu,pjMenu,publicMenu} from '../data/sitemap';
import {useApp} from '../context/AppContext';

const featured=[
 {title:'Cari ruang dan laboratorium',desc:'Pencarian gabungan berdasarkan tanggal dan waktu',to:'/cari',words:'cari search ruang lab pencarian',Icon:Search},
 {title:'Kalender ketersediaan',desc:'Jadwal Semester 125, alasan, kode dosen dan waktu',to:'/cari/kalender',words:'jadwal kelas kalender ruangan bentrok tersedia dosen hingga jam',Icon:CalendarDays},
 {title:'Daftar ruang kuliah',desc:'GDS 517, GDS 607, GDS 608, GDS 613',to:'/ruang-kuliah',words:'ruang kuliah gds kelas smart tv wifi ac',Icon:Building2},
 {title:'Laboratorium komputer',desc:'GDS 507 hingga GDS 516',to:'/lab-komputer',words:'lab perangkat lunak software jumlah komputer python vscode rstudio',Icon:Monitor},
 {title:'Cari perangkat lunak',desc:'Filter nama software di laboratorium',to:'/lab-komputer',words:'software perangkat lunak aplikasi vscode visual studio python java netbeans rstudio',Icon:Monitor},
 {title:'Petunjuk peminjaman',desc:'Cara mengajukan, status, dan persetujuan',to:'/petunjuk-peminjaman',words:'pinjam booking mengajukan permohonan aturan pj',Icon:FileText},
 {title:'Layanan kampus',desc:'Direktori dan petunjuk akademik',to:'/layanan-kampus',words:'layanan kontak lokasi informasi kampus',Icon:BookOpen},
 {title:'Masuk akun',desc:'Pilih Mahasiswa, PJ atau Admin',to:'/login',words:'login daftar akun masuk mahasiswa pj admin',Icon:LogIn}
];
const extra=[
 ...pjMenu.flatMap(g=>g.items.map(([title,to])=>({title,desc:'Dashboard PJ · '+g.label,to,words:'pj penanggung jawab '+g.label,Icon:LayoutDashboard,role:'pj'}))),
 ...adminMenu.flatMap(g=>g.items.map(([title,to])=>({title,desc:'Dashboard Admin · '+g.label,to,words:'admin pengelola '+g.label,Icon:LayoutDashboard,role:'admin'})))
];
const roomLinks=facilities.map(f=>({title:f.name,desc:f.type==='lab'?'Lab komputer · Detail dan software':'Ruang kuliah · Detail dan jadwal',to:(f.type==='lab'?'/lab-komputer/':'/ruang-kuliah/')+f.id,words:`ruang kelas lab komputer lokasi ${f.name.toLowerCase()} ${f.id}`,Icon:f.type==='lab'?Monitor:Building2}));
const courseLinks=[...new Map(timetable125.map(e=>[e.course+'|'+e.facilityId,{title:e.course,desc:e.section+' · '+e.roomLabel+' · Dosen '+e.lecturer,to:(e.facilityId.startsWith('gds-5')&&e.facilityId!=='gds-517'?'/lab-komputer/':'/ruang-kuliah/')+e.facilityId,words:e.course+' '+e.section+' '+e.roomLabel+' '+e.lecturer,Icon:BookOpen}])).values()];
const normalize=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export function quickFeatureSuggestions(query,role='public',max=9){
 const choices=[...featured,...roomLinks,...courseLinks,...extra.filter(x=>!x.role||x.role===role)];
 const q=normalize(query).trim();
 if(!q)return featured.slice(0,6);
 const keys=q.split(/\s+/);
 return choices.map((x,i)=>{const title=normalize(x.title),words=normalize(x.title+' '+x.desc+' '+x.words);const all=keys.every(k=>words.includes(k));const score=all?(title===q?8:title.startsWith(q)?6:title.includes(q)?4:1):0;return {...x,score,order:i};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.order-b.order).slice(0,max);
}
export default function GlobalSearch({compact=false}){
 const [open,setOpen]=useState(false);
 const [query,setQuery]=useState('');
 const [active,setActive]=useState(0);
 const inputRef=useRef(null);
 const dialogRef=useRef(null);
 const triggerRef=useRef(null);
 const navigate=useNavigate();
 const {pathname}=useLocation();
 const {role}=useApp();
 const suggestions=useMemo(()=>quickFeatureSuggestions(query,role),[query,role]);

 // Tutup hasil saat halaman berganti dan jangan pertahankan kueri lama.
 useEffect(()=>{setOpen(false);setQuery('');setActive(0)},[pathname]);

 useEffect(()=>{
  const shortcuts=e=>{
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
    e.preventDefault();
    setOpen(value=>!value);
   }else if(e.key==='/'&&!open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
    e.preventDefault();
    setOpen(true);
   }
  };
  document.addEventListener('keydown',shortcuts);
  return()=>document.removeEventListener('keydown',shortcuts);
 },[open]);

 // Portal dipasang di document.body agar overlay tidak terkurung
 // stacking context navbar sticky yang memakai backdrop-filter.
 useEffect(()=>{
  if(!open)return;
  const bodyOverflow=document.body.style.overflow;
  const htmlOverflow=document.documentElement.style.overflow;
  document.body.style.overflow='hidden';
  document.documentElement.style.overflow='hidden';
  const frame=requestAnimationFrame(()=>inputRef.current?.focus());
  const onKeyDown=e=>{
   if(e.key==='Escape'){
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(()=>triggerRef.current?.focus());
    return;
   }
   if(e.key!=='Tab'||!dialogRef.current)return;
   const nodes=[...dialogRef.current.querySelectorAll('input:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
   if(!nodes.length)return;
   const first=nodes[0],last=nodes[nodes.length-1];
   if(!dialogRef.current.contains(document.activeElement)){
    e.preventDefault();
    first.focus();
   }else if(e.shiftKey&&document.activeElement===first){
    e.preventDefault();
    last.focus();
   }else if(!e.shiftKey&&document.activeElement===last){
    e.preventDefault();
    first.focus();
   }
  };
  document.addEventListener('keydown',onKeyDown);
  return()=>{
   cancelAnimationFrame(frame);
   document.removeEventListener('keydown',onKeyDown);
   document.body.style.overflow=bodyOverflow;
   document.documentElement.style.overflow=htmlOverflow;
  };
 },[open]);

 function closeSearch(){setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus())}
 function choose(item){setOpen(false);setQuery('');navigate(item.to)}
 function onInputKeyDown(e){
  if(e.key==='ArrowDown'){
   e.preventDefault();setActive(i=>(i+1)%Math.max(1,suggestions.length));
  }else if(e.key==='ArrowUp'){
   e.preventDefault();setActive(i=>(i+Math.max(1,suggestions.length)-1)%Math.max(1,suggestions.length));
  }else if(e.key==='Enter'){
   e.preventDefault();if(suggestions[active])choose(suggestions[active]);
  }
 }

 const dialog=open?createPortal(
  <div className="matra-search-overlay fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#102f32]/60 px-3 pb-6 pt-[clamp(24px,10vh,110px)] sm:px-5"
       role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)closeSearch()}}>
   <section ref={dialogRef}
            className="search-command-enter matra-search-panel mx-auto flex w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-[#dce8e8] bg-white shadow-2xl"
            role="dialog" aria-modal="true" aria-label="Pencarian cepat MATRA">
    <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-3 sm:px-5 sm:py-4">
     <div className="matra-search-field flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 transition-colors">
      <Search size={21} className="shrink-0 text-primary" aria-hidden="true"/>
      <input ref={inputRef} value={query}
             onChange={e=>{setQuery(e.target.value);setActive(0)}}
             onKeyDown={onInputKeyDown} autoComplete="off" type="search"
             placeholder="Cari fitur, jadwal, ruang, software..."
             aria-label="Ketik nama fitur MATRA"
             className="matra-search-input h-9 min-w-0 flex-1 border-0 bg-transparent text-[14px] text-ink placeholder:text-muted sm:text-[15px]"/>
     </div>
     <button type="button" aria-label="Tutup pencarian" className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-primary" onClick={closeSearch}><X size={19}/></button>
    </div>
    <div className="matra-search-results min-h-0 flex-1 overflow-y-auto px-3 py-4">
     <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{query?'Hasil pencarian dan rekomendasi':'Rekomendasi untukmu'}</p>
     {suggestions.length===0?
       <p role="status" className="rounded-xl bg-canvas px-4 py-8 text-center text-sm text-muted">Belum ada fitur yang cocok. Coba kata kunci “jadwal”, “lab”, “software” atau “peminjaman”.</p>
      :suggestions.map((item,i)=><button type="button" key={item.to+'|'+item.title} onClick={()=>choose(item)} onMouseEnter={()=>setActive(i)}
        className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors ${active===i?'bg-mint':'hover:bg-canvas'}`}>
         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary"><item.Icon size={19}/></span>
         <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-ink">{item.title}</span><span className="mt-1 block truncate text-[11px] text-muted">{item.desc}</span></span>
         <ArrowUpRight size={15} className="shrink-0 text-muted"/>
        </button>)}
    </div>
    <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 border-t border-line bg-canvas/70 px-5 py-3 text-[11px] text-muted">
     <span>↑ ↓ pilih hasil</span><span>Enter untuk membuka</span><span>Esc untuk menutup</span><span className="ml-auto hidden sm:inline">Ctrl + K</span>
    </div>
   </section>
  </div>,document.body):null;

 return <>
  <button ref={triggerRef} type="button" onClick={()=>{setActive(0);setOpen(true)}}
          aria-label="Cari halaman atau fitur MATRA" aria-haspopup="dialog" aria-expanded={open}
          title="Cari fitur (Ctrl+K)"
          className={compact?'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-primary transition-colors hover:bg-mint':'ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-primary transition-colors hover:border-primary hover:bg-mint lg:ml-6'}>
   <Search size={21}/>
  </button>
  {dialog}
 </>;
}
