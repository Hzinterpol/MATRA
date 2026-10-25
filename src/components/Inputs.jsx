import React, {useEffect, useId, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Check, Clock3} from 'lucide-react';

// Picker terpadu MATRA. Popover di-portal ke body supaya tidak terpotong card/modal.
function usePicker(open, setOpen, triggerRef, minWidth=240){
 const popoverRef=useRef(null);
 const [position,setPosition]=useState({top:0,left:0,width:minWidth});
 useLayoutEffect(()=>{
  if(!open)return;
  const reposition=()=>{
   const trigger=triggerRef.current, popup=popoverRef.current;
   if(!trigger)return;
   const rect=trigger.getBoundingClientRect();
   const width=Math.min(window.innerWidth-24,Math.max(minWidth,rect.width));
   const height=popup?.offsetHeight||310;
   const below=window.innerHeight-rect.bottom;
   const above=rect.top;
   const placeAbove=below<Math.min(280,height)&&above>below;
   const top=Math.max(12,Math.min(window.innerHeight-height-12,placeAbove?rect.top-height-8:rect.bottom+8));
   const left=Math.max(12,Math.min(window.innerWidth-width-12,rect.left));
   setPosition({top,left,width});
  };
  reposition();
  const onOutside=e=>{if(!popoverRef.current?.contains(e.target)&&!triggerRef.current?.contains(e.target))setOpen(false)};
  const onKey=e=>{if(e.key==='Escape'){e.preventDefault();setOpen(false);triggerRef.current?.focus()}};
  const onScroll=e=>{if(popoverRef.current?.contains(e.target))return;reposition()};
  const onFocus=e=>{if(!popoverRef.current?.contains(e.target)&&!triggerRef.current?.contains(e.target))setOpen(false)};
  document.addEventListener('pointerdown',onOutside);
  document.addEventListener('focusin',onFocus);
  document.addEventListener('keydown',onKey);
  window.addEventListener('resize',reposition);
  window.addEventListener('scroll',onScroll,true);
  return()=>{document.removeEventListener('pointerdown',onOutside);document.removeEventListener('focusin',onFocus);document.removeEventListener('keydown',onKey);window.removeEventListener('resize',reposition);window.removeEventListener('scroll',onScroll,true)};
 },[open,setOpen,triggerRef,minWidth]);
 return {popoverRef,position};
}
function PortalPopover({open,triggerRef,setOpen,width=240,children,className='',label}){
 const {popoverRef,position}=usePicker(open,setOpen,triggerRef,width);
 if(!open)return null;
 return createPortal(<div ref={popoverRef} role="dialog" aria-label={label} className={`matra-picker fixed z-[180] rounded-2xl border border-[#cae0df] bg-white p-3 text-ink shadow-[0_18px_52px_-12px_rgba(0,73,75,.24)] ${className}`} style={{top:position.top,left:position.left,width:position.width}}>{children}</div>,document.body);
}
function dispatchChange(callback,value,name){callback?.({target:{value,name}});}
function isoFormat(year,month,day){return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;}
function asLocalDate(iso){if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))return null;const [y,m,d]=iso.split('-').map(Number);const date=new Date(y,m-1,d);return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d?date:null;}
function humanDate(iso){const d=asLocalDate(iso);return d?new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d):'Pilih tanggal';}
const days=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
export function DateInput({value='',onChange,className='',disabled=false,required=false,min,max,name,'aria-label':ariaLabel='Tanggal',...unused}){
 const [open,setOpen]=useState(false),triggerRef=useRef(null),popupId=useId();
 const [month,setMonth]=useState(()=>{const d=asLocalDate(value)||new Date();return new Date(d.getFullYear(),d.getMonth(),1)});
 useEffect(()=>{const d=asLocalDate(value);if(d)setMonth(new Date(d.getFullYear(),d.getMonth(),1));},[value]);
 const current=asLocalDate(value),today=new Date(),first=new Date(month.getFullYear(),month.getMonth(),1);
 const offset=(first.getDay()+6)%7,year=month.getFullYear(),m=month.getMonth();
 const cells=Array.from({length:42},(_,i)=>new Date(year,m,i-offset+1));
 function select(iso){dispatchChange(onChange,iso,name);setOpen(false);triggerRef.current?.focus();}
 return <>
  <button ref={triggerRef} type="button" disabled={disabled} aria-label={ariaLabel} aria-expanded={open} aria-haspopup="dialog" aria-controls={open?popupId:undefined} onClick={()=>setOpen(v=>!v)} className={`matra-picker-trigger field flex items-center justify-between gap-3 text-left ${className}`}>
   <span className={value?'text-ink':'text-muted'}>{humanDate(value)}</span><CalendarDays size={18} className="shrink-0 text-primary"/>
  </button>
  <PortalPopover open={open} setOpen={setOpen} triggerRef={triggerRef} width={306} label="Pilih tanggal kalender MATRA">
   <div id={popupId}>
    <div className="mb-3 flex items-center justify-between gap-2 px-1"><span className="font-semibold text-ink">{months[m]} {year}</span><div className="flex gap-1"><button type="button" onClick={()=>setMonth(new Date(year,m-1,1))} aria-label="Bulan sebelumnya" className="matra-picker-icon"><ChevronLeft size={17}/></button><button type="button" onClick={()=>setMonth(new Date(year,m+1,1))} aria-label="Bulan berikutnya" className="matra-picker-icon"><ChevronRight size={17}/></button></div></div>
    <div className="grid grid-cols-7 gap-0.5 text-center">{days.map(day=><span key={day} className="py-2 text-[11px] font-semibold text-muted">{day}</span>)}{cells.map((day,i)=>{const iso=isoFormat(day.getFullYear(),day.getMonth(),day.getDate());const selected=iso===value,isToday=day.toDateString()===today.toDateString(),foreign=day.getMonth()!==m,invalid=(min&&iso<min)||(max&&iso>max);return <button key={iso+'-'+i} type="button" disabled={invalid} aria-label={new Intl.DateTimeFormat('id-ID',{dateStyle:'full'}).format(day)} aria-pressed={selected} onClick={()=>select(iso)} className={`matra-date-cell ${selected?'bg-primary font-semibold text-white':isToday?'border border-primary/60 font-semibold text-primary':foreign?'text-[#a9b7bd]':'text-ink'} ${!selected&&!invalid?'hover:bg-mint hover:text-primary':''}`}>{day.getDate()}</button>})}</div>
    <div className="mt-3 flex items-center justify-between border-t border-line pt-3"><button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={()=>{const t=new Date();select(isoFormat(t.getFullYear(),t.getMonth(),t.getDate()))}}>Hari ini</button>{!required&&<button type="button" className="text-xs text-muted hover:text-danger" onClick={()=>select('')}>Hapus pilihan</button>}</div>
   </div>
  </PortalPopover>
 </>;
}
function two(n){return String(n).padStart(2,'0')}
export function TimeInput({value='',onChange,className='',disabled=false,name,'aria-label':ariaLabel='Pilih waktu WIB',...unused}){
 const [open,setOpen]=useState(false),triggerRef=useRef(null),hoursRef=useRef(null),minutesRef=useRef(null);
 const [hr='09',mn='00']=(value||'09:00').split(':');
 const hour=Number(hr)||0,minute=Number(mn)||0;
 const hours=Array.from({length:24},(_,i)=>i),minutes=Array.from({length:12},(_,i)=>i*5);
 const samples=['07:45','08:00','09:00','10:00','10:15','11:00','12:30','13:00','13:15','14:45','15:30','17:15'];
 useEffect(()=>{if(!open)return;hoursRef.current?.scrollTo({top:Math.max(0,hour*36-72),behavior:'instant'});minutesRef.current?.scrollTo({top:Math.max(0,Math.floor(minute/5)*36-72),behavior:'instant'});},[open,hour,minute]);
 function update(hourValue,minuteValue,close=false){dispatchChange(onChange,`${two(hourValue)}:${two(minuteValue)}`,name);if(close){setOpen(false);triggerRef.current?.focus();}}
 return <><button ref={triggerRef} type="button" disabled={disabled} aria-label={ariaLabel} aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(v=>!v)} className={`matra-picker-trigger field flex items-center justify-between gap-3 text-left ${className}`}><span className="tabular-nums text-ink">{value?value.replace(':','.'):'Pilih waktu'} <span className="text-xs text-muted">WIB</span></span><Clock3 size={18} className="shrink-0 text-primary"/></button>
  <PortalPopover open={open} setOpen={setOpen} triggerRef={triggerRef} width={266} label="Pilih jam dan menit WIB"><p className="px-1 pb-2 text-xs font-semibold text-ink">Pilih waktu (WIB)</p><div className="mb-3 grid grid-cols-2 gap-3"><div><p className="mb-1 text-center text-[11px] font-medium text-muted">Jam</p><div ref={hoursRef} className="matra-time-scroll space-y-1 overflow-y-auto rounded-xl border border-line bg-canvas p-1">{hours.map(h=><button type="button" key={h} onClick={()=>update(h,minute)} aria-pressed={h===hour} className={`matra-time-choice ${hour===h?'bg-primary font-semibold text-white':'hover:bg-mint'}`}>{two(h)}</button>)}</div></div><div><p className="mb-1 text-center text-[11px] font-medium text-muted">Menit</p><div ref={minutesRef} className="matra-time-scroll space-y-1 overflow-y-auto rounded-xl border border-line bg-canvas p-1">{minutes.map(n=><button type="button" key={n} onClick={()=>update(hour,n,true)} aria-pressed={minute===n} className={`matra-time-choice ${minute===n?'bg-primary font-semibold text-white':'hover:bg-mint'}`}>{two(n)}</button>)}</div></div></div><p className="mb-2 border-t border-line pt-3 text-[11px] font-semibold text-muted">Pilihan cepat</p><div className="grid grid-cols-4 gap-1.5">{samples.map(t=><button type="button" key={t} onClick={()=>{const [h,n]=t.split(':').map(Number);update(h,n,true)}} className={`rounded-lg border px-1 py-2 text-[10px] font-semibold tabular-nums transition-colors ${t===value?'border-primary bg-mint text-primary':'border-line bg-white text-ink hover:border-primary hover:bg-mint'}`}>{t.replace(':','.')}</button>)}</div></PortalPopover>
 </>;
}
export function SelectInput({value='',onChange,children,className='',disabled=false,name,'aria-label':ariaLabel='Pilih opsi',...unused}){
 const [open,setOpen]=useState(false),triggerRef=useRef(null);
 const options=useMemo(()=>React.Children.toArray(children).filter(child=>React.isValidElement(child)&&child.type==='option').map(child=>({value:String(child.props.value??child.props.children??''),label:String(child.props.children??''),disabled:!!child.props.disabled})),[children]);
 const selectedIndex=Math.max(0,options.findIndex(o=>o.value===String(value)));
 const [activeIndex,setActiveIndex]=useState(selectedIndex);
 useEffect(()=>{setActiveIndex(selectedIndex)},[selectedIndex,open]);
 const selected=options.find(o=>o.value===String(value))||options[0];
 function choose(option){if(option.disabled)return;dispatchChange(onChange,option.value,name);setOpen(false);triggerRef.current?.focus();}
 function handleKey(e){if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(!open){setOpen(true);return;}setActiveIndex(i=>e.key==='Home'?0:e.key==='End'?options.length-1:Math.min(options.length-1,Math.max(0,i+(e.key==='ArrowDown'?1:-1))))}else if((e.key==='Enter'||e.key===' ')&&open){e.preventDefault();choose(options[activeIndex])}else if(e.key==='Escape'&&open){setOpen(false);}}
 return <><button ref={triggerRef} type="button" disabled={disabled} aria-label={`${ariaLabel}: ${selected?.label||'Belum dipilih'}`} aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(v=>!v)} onKeyDown={handleKey} className={`matra-picker-trigger field flex items-center justify-between gap-2 text-left ${className}`}><span className="truncate">{selected?.label||'Pilih opsi'}</span><ChevronDown size={16} className={`shrink-0 text-primary transition-transform ${open?'rotate-180':''}`}/></button><PortalPopover open={open} setOpen={setOpen} triggerRef={triggerRef} width={245} label={ariaLabel} className="!p-1.5"><div role="listbox" aria-label={ariaLabel} className="matra-option-scroll max-h-64 space-y-0.5 overflow-y-auto">{options.map((option,i)=><button type="button" role="option" aria-selected={option.value===String(value)} key={`${option.value}-${i}`} disabled={option.disabled} onClick={()=>choose(option)} onMouseEnter={()=>setActiveIndex(i)} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${option.value===String(value)?'bg-mint font-semibold text-primary':activeIndex===i?'bg-canvas text-primary':'text-ink hover:bg-canvas'}`}><span>{option.label}</span>{option.value===String(value)&&<Check size={15}/>}</button>)}</div></PortalPopover></>;
}
