import React, {useEffect, useState} from 'react';
import {Building2, Monitor, BookOpen, GraduationCap, ArrowUpRight, Image as ImageIcon} from 'lucide-react';
import roomIllustration from '../assets/ilustrasi/ruang-kuliah.webp';
import labIllustration from '../assets/ilustrasi/lab-komputer.webp';
import campusIllustration from '../assets/ilustrasi/layanan-kampus.webp';
import academicIllustration from '../assets/ilustrasi/layanan-akademik.webp';
import infoLabIllustration from '../assets/ilustrasi/informasi-laboratorium.webp';
import borrowIllustration from '../assets/ilustrasi/bantuan-peminjaman-ruangan.webp';

/**
 * Ilustrasi bawaan MATRA menggunakan WebP yang sudah ada di public/assets/ilustrasi/.
 * Foto nyata (opsional) selalu diprioritaskan jika disimpan pada public/assets/foto/.
 * Nama foto menggunakan slug, contoh: gds-507.webp, layanan-akademik.webp.
 * JPG lama juga diterima sebagai fallback agar proyek dari v5 tetap kompatibel.
 */
const icons = {room:Building2,lab:Monitor,service:BookOpen,category:GraduationCap};
const illustrations = {
  room:roomIllustration,
  lab:labIllustration,
  category:{
    'ruang-kuliah':roomIllustration,
    'lab-komputer':labIllustration,
    'layanan-kampus':campusIllustration
  },
  service:{
    'layanan-akademik':academicIllustration,
    'layanan-laboratorium':infoLabIllustration,
    'bantuan-ruangan':borrowIllustration
  }
};

export function getIllustrationPath(type,id){
  if(type==='category'||type==='service')return illustrations[type][id]||'';
  return illustrations[type]||'';
}

/** URL pertama untuk file foto khusus. Kosong tidak berarti ilustrasi bawaan tidak ada. */
export function getMediaPath(type,id){
  const folder=type==='category'?'kategori':type==='room'?'ruang':type==='lab'?'lab':type==='service'?'layanan':'';
  if(!folder||!id)return '';
  return `/assets/foto/${folder}/${id}.webp`;
}

export default function MediaFrame({type='room',id='',title='',label='',className='',compact=false,showTag=true}){
  const path = getMediaPath(type,id);
  const illustration = getIllustrationPath(type,id);
  const [attempt,setAttempt] = useState(0);
  const [loaded,setLoaded] = useState(false);
  const [illustrationFailed,setIllustrationFailed] = useState(false);
  useEffect(()=>{setAttempt(0);setLoaded(false);},[path]);
  useEffect(()=>setIllustrationFailed(false),[illustration]);
  const customSources=path?[path,path.replace(/\.webp$/i,'.jpg')]:[];
  const photo=customSources[attempt];
  const Icon=icons[type]||ImageIcon;
  const showIllustration=Boolean(illustration)&&!illustrationFailed;
  return <div className={`matra-media relative isolate overflow-hidden ${className}`} data-media-slot={`${type}:${id}`}>
    <div className="matra-media-fallback absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <span className="matra-media-ring matra-media-ring-one"/>
      <span className="matra-media-ring matra-media-ring-two"/>
      {!showIllustration&&<div className="relative z-[1] flex flex-col items-center justify-center text-center">
        <span className={`matra-media-symbol flex items-center justify-center ${compact?'h-16 w-16':'h-20 w-20'}`}><Icon size={compact?35:43} strokeWidth={1.4}/></span>
        {!compact&&<span className="mt-4 text-[10px] font-semibold uppercase tracking-[.22em] text-primary/70">{label||'FASILITAS MATRA'}</span>}
      </div>}
      {showIllustration&&<img src={illustration} onError={()=>setIllustrationFailed(true)} alt="" aria-hidden="true" loading="lazy" decoding="async" className="matra-media-illustration absolute inset-0 z-[1] h-full w-full object-contain"/>}
    </div>
    {photo&&<img key={photo} src={photo} alt={title?`Foto ${title}`:'Foto fasilitas MATRA'} loading="lazy" decoding="async" onLoad={()=>setLoaded(true)} onError={()=>{setLoaded(false);setAttempt(a=>a+1);}} className={`absolute inset-0 z-[2] h-full w-full object-cover transition-opacity duration-300 ${loaded?'opacity-100':'opacity-0'}`}/>}
    {showTag&&<span className="matra-media-stamp absolute bottom-3 left-3 z-[3] inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold tracking-[.04em] text-ink shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-primary"/>{label||title||'MATRA'}<ArrowUpRight size={12} className="text-primary"/></span>}
  </div>;
}
