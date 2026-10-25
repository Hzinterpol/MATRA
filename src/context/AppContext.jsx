import React, {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {DEMO_PJ_CODE,DEMO_ADMIN_USERNAME,DEMO_ADMIN_PASSWORD,DEMO_DATE,initialDemo} from '../data/demo';
import {getStatus,isValidInterval,nextNumber} from '../utils/domain';
import {AUTH_STORAGE_KEY,publicSession,readDemoAuth,saveDemoAuth} from '../utils/authSession.js';

const Context=createContext(null);
const clone=()=>JSON.parse(JSON.stringify(initialDemo));
const dataKey='matra-static-demo-v7';
function readStorage(){try{const data=window.localStorage.getItem(dataKey);return data?JSON.parse(data):clone();}catch{return clone();}}
const initialAuth=()=>{try{return readDemoAuth(window.localStorage)}catch{return publicSession()}};
const stamp=()=>new Date().toISOString();
const logAction=(current,actor,action,note='')=>[...current,{id:nextNumber(current,'AU-'),at:stamp(),actor,action,note}];
const notice=(current,role,text,href)=>[...current,{id:nextNumber(current,'NT-'),at:stamp(),role,text,href,read:false}];
export function AppProvider({children}){
  const [data,setData]=useState(readStorage);
  const [auth,setAuth]=useState(initialAuth);
  const role=auth.role;
  const adminEmail=auth.adminEmail;
  const [feedback,setFeedback]=useState(null);
  const [search,setSearch]=useState({date:DEMO_DATE,start:'09:00',end:'11:00',type:'all',roomId:'',software:''});
  useEffect(()=>{try{localStorage.setItem(dataKey,JSON.stringify(data));}catch{}},[data]);
  useEffect(()=>{
   try{saveDemoAuth(localStorage,auth);
       sessionStorage.removeItem('matra-demo-role');sessionStorage.removeItem('matra-demo-student-name');}
   catch{}
  },[role,adminEmail]);
  useEffect(()=>{
    const sync=e=>{if(e.key===AUTH_STORAGE_KEY){
      const next=(()=>{try{return readDemoAuth(localStorage)}catch{return publicSession()}})();
      setAuth(current=>current.role===next.role&&current.adminEmail===next.adminEmail?current:next);
    }};
    window.addEventListener('storage',sync);
    return ()=>window.removeEventListener('storage',sync);
  },[]);
  useEffect(()=>{if(!feedback)return;const t=setTimeout(()=>setFeedback(null),5000);return()=>clearTimeout(t);},[feedback]);
  const notify=useCallback((message,tone='success')=>setFeedback({message,tone,id:Date.now()}),[]);
  const updateSearch=useCallback(patch=>setSearch(old=>({...old,...patch})),[]);
  const loginPJ=(value)=>{if(!data.pjCodeActive)return {ok:false,message:'Kode demo telah dicabut. Gunakan panel admin untuk menerbitkan ulang.'};if(String(value).trim().toUpperCase()!==DEMO_PJ_CODE)return {ok:false,message:'Kode tidak sesuai. Untuk versi demo, gunakan kode yang ditampilkan pada petunjuk.'};setAuth({role:'pj',adminEmail:''});return {ok:true};};
  const loginAdmin=(username,password)=>{if(username!==DEMO_ADMIN_USERNAME||password!==DEMO_ADMIN_PASSWORD)return {ok:false,message:'Email atau kata sandi demo tidak sesuai.'};setAuth({role:'admin',adminEmail:username});return {ok:true};};
  const logout=()=>{setAuth(publicSession());try{saveDemoAuth(localStorage,publicSession())}catch{}};
  const resetDemo=()=>{setData(clone());logout();setSearch({date:DEMO_DATE,start:'09:00',end:'11:00',type:'all',roomId:'',software:''});notify('Data simulasi dikembalikan ke kondisi awal.');};
  const status=(id,date,start,end)=>getStatus(data,id,date,start,end);
  const confirmMeeting=(meetingId,confirmation)=>{
    if(role!=='pj')return {ok:false,message:'Akses PJ diperlukan.'};
    if(!['Tetap Offline','Berubah Online'].includes(confirmation))return {ok:false,message:'Pilihan konfirmasi tidak valid.'};
    const m=data.meetings.find(v=>v.id===meetingId);if(!m)return {ok:false,message:'Pertemuan tidak ditemukan.'};
    if(m.released)return {ok:false,message:'Alokasi telah dilepas dan tidak dapat dikembalikan sepihak.'};
    setData(d=>({...d,meetings:d.meetings.map(x=>x.id===meetingId?{...x,confirmation}:x),audit:logAction(d.audit,'PJ Demo','Konfirmasi pelaksanaan',`${meetingId}: ${confirmation}`)}));
    notify(`Konfirmasi ${confirmation.toLowerCase()} tercatat. Alokasi tidak dilepas otomatis.`);return {ok:true};
  };
  const releaseMeeting=(meetingId)=>{
    if(role!=='pj')return {ok:false,message:'Akses PJ diperlukan.'};
    const m=data.meetings.find(v=>v.id===meetingId);if(!m||m.released)return {ok:false,message:'Pertemuan tidak aktif atau sudah dilepas.'};
    if(m.confirmation!=='Berubah Online')return {ok:false,message:'Pilih Berubah Online terlebih dahulu. Pelepasan merupakan tindakan terpisah.'};
    setData(d=>({...d,meetings:d.meetings.map(x=>x.id===meetingId?{...x,released:true}:x),allocations:d.allocations.map(x=>x.id===m.allocationId?{...x,active:false}:x),audit:logAction(d.audit,'PJ Demo','Melepaskan alokasi',`Alokasi ${m.allocationId} dilepas dengan konfirmasi`),notices:notice(d.notices,'admin',`Alokasi ${m.allocationId} dilepas oleh PJ setelah perubahan online.`,'/admin/kalender')}));
    notify('Alokasi berhasil dilepas pada data simulasi. Ruang dapat diajukan sesuai aturan.');return {ok:true};
  };
  const submitRequest=(payload)=>{
    if(role!=='pj'||!data.pjCodeActive)return {ok:false,message:'Kode penugasan PJ tidak aktif.'};
    if(!isValidInterval(payload.start,payload.end)||!payload.date||!payload.facilityId)return {ok:false,message:'Lengkapi ruangan, tanggal, dan interval waktu yang valid.'};
    if(!payload.purpose||payload.purpose.trim().length<10)return {ok:false,message:'Tulis keperluan pengajuan setidaknya 10 karakter.'};
    const slot=getStatus(data,payload.facilityId,payload.date,payload.start,payload.end);
    if(slot.label!=='Tersedia')return {ok:false,message:`Slot berstatus ${slot.label}. Pilih alternatif atau ubah waktu sebelum mengajukan.`};
    const id=nextNumber(data.requests,'REQ-');const seq=Math.max(0,...data.requests.map(x=>x.seq||0))+1;
    const req={id,seq,facilityId:payload.facilityId,date:payload.date,start:payload.start,end:payload.end,classId:'KLS-001',pj:'PJ Demo MATRA',purpose:payload.purpose.trim(),status:'Menunggu Keputusan',received:stamp(),reason:''};
    setData(d=>({...d,requests:[...d.requests,req],audit:logAction(d.audit,'PJ Demo','Mengirim pengajuan',`${id} - ${req.facilityId}`),notices:notice(d.notices,'admin',`Pengajuan baru ${id} menunggu verifikasi.`,'/admin/antrean')}));
    notify(`${id} berhasil dikirim. Status: Menunggu Keputusan.`);return {ok:true,id};
  };
  const cancelRequest=(id)=>{
    if(role!=='pj')return {ok:false,message:'Akses PJ diperlukan.'};
    const req=data.requests.find(r=>r.id===id);
    if(!req||req.status!=='Menunggu Keputusan')return {ok:false,message:'Prototipe hanya mengizinkan pembatalan pengajuan yang masih menunggu keputusan.'};
    setData(d=>({...d,requests:d.requests.map(x=>x.id===id?{...x,status:'Dibatalkan'}:x),audit:logAction(d.audit,'PJ Demo','Membatalkan pengajuan',id),notices:notice(d.notices,'admin',`${id} dibatalkan oleh PJ.`,'/admin/riwayat-peminjaman')}));
    notify(`${id} dibatalkan. Riwayat tetap tersimpan.`);return {ok:true};
  };
  const decideRequest=(id,decision,reason='')=>{
    if(role!=='admin')return {ok:false,message:'Akses admin diperlukan.'};
    const req=data.requests.find(x=>x.id===id);
    if(!req||req.status!=='Menunggu Keputusan')return {ok:false,message:'Pengajuan sudah diproses atau tidak ditemukan.'};
    if(decision==='Ditolak'&&!reason.trim())return {ok:false,message:'Alasan penolakan wajib ditulis.'};
    if(decision==='Disetujui'){
      const current=getStatus(data,req.facilityId,req.date,req.start,req.end);
      if(current.label!=='Tersedia')return {ok:false,message:`Tidak dapat menyetujui: status terbaru adalah ${current.label}. Verifikasi ulang atau tawarkan alternatif.`};
    }
    if(!['Ditolak','Disetujui'].includes(decision))return {ok:false,message:'Keputusan tidak dikenal.'};
    setData(d=>({...d,requests:d.requests.map(x=>x.id===id?{...x,status:decision,reason:reason.trim(),decidedAt:stamp()}:x),audit:logAction(d.audit,'Admin Demo',`Pengajuan ${decision.toLowerCase()}`,`${id}. ${reason}`),notices:notice(d.notices,'pj',`${id} ${decision.toLowerCase()}.${reason?` Alasan: ${reason}`:''}`,`/pj/pengajuan/${id}`)}));
    notify(`Keputusan ${decision.toLowerCase()} untuk ${id} tersimpan dalam simulasi.`);return {ok:true};
  };
  const addIssue=(payload)=>{
    if(role!=='pj')return {ok:false,message:'Akses PJ diperlukan.'};
    if(!payload.text||payload.text.trim().length<10)return {ok:false,message:'Uraikan ketidaksesuaian paling sedikit 10 karakter.'};
    const id=nextNumber(data.issues,'LAP-');
    setData(d=>({...d,issues:[...d.issues,{...payload,id,reporter:'PJ Demo MATRA',status:'Belum ditindaklanjuti'}],audit:logAction(d.audit,'PJ Demo','Mengirim laporan',id),notices:notice(d.notices,'admin',`Laporan ${id} membutuhkan tindak lanjut.`,'/admin/laporan')}));
    notify(`Laporan ${id} dikirim. Alokasi tidak berubah otomatis.`);return {ok:true,id};
  };
  const resolveIssue=(id,text)=>{
    if(role!=='admin')return {ok:false,message:'Akses admin diperlukan.'};
    if(!text?.trim())return {ok:false,message:'Catatan tindak lanjut diperlukan.'};
    setData(d=>({...d,issues:d.issues.map(x=>x.id===id?{...x,status:'Ditindaklanjuti',followup:text}:x),audit:logAction(d.audit,'Admin Demo','Menindaklanjuti laporan',id+' - '+text),notices:notice(d.notices,'pj',`Laporan ${id} telah ditindaklanjuti.`,`/pj/notifikasi`)}));notify(`${id} telah ditindaklanjuti.`);return {ok:true};
  };
  const addClosure=(payload)=>{
    if(role!=='admin')return {ok:false,message:'Akses admin diperlukan.'};
    if(!payload.facilityId||!payload.date||!isValidInterval(payload.start,payload.end)||!payload.reason)return {ok:false,message:'Isi ruangan, tanggal, waktu, dan alasan penutupan.'};
    const id=nextNumber(data.closures,'CL-');
    const conflicts=data.allocations.filter(a=>a.active&&a.facilityId===payload.facilityId&&a.date===payload.date).length;
    setData(d=>({...d,closures:[...d.closures,{...payload,id}],audit:logAction(d.audit,'Admin Demo','Penutupan ruangan',`${id}: ${payload.reason}`),notices:notice(d.notices,'pj',`Terdapat pembaruan operasional ruang ${payload.facilityId}.`,'/pj/notifikasi')}));
    notify(`Penutupan tercatat.${conflicts?' Periksa potensi konflik dengan alokasi aktif.':''}`);return {ok:true,id};
  };
  const addSchedule=(payload)=>{
    if(role!=='admin')return {ok:false,message:'Akses admin diperlukan.'};
    if(!payload.facilityId||!payload.date||!isValidInterval(payload.start,payload.end)||!payload.classId)return {ok:false,message:'Lengkapi kelas, ruangan, tanggal, dan waktu.'};
    const slot=getStatus(data,payload.facilityId,payload.date,payload.start,payload.end);
    if(slot.label!=='Tersedia')return {ok:false,message:`Bentrok dengan status ${slot.label}. Jadwal tidak disimpan.`};
    const id=nextNumber(data.allocations,'AL-');
    setData(d=>({...d,allocations:[...d.allocations,{...payload,id,active:true,source:'Jadwal resmi',owner:'Kelas demo'}],audit:logAction(d.audit,'Admin Demo','Menambah jadwal resmi',`${id} ${payload.facilityId}`)}));notify(`Jadwal contoh ${id} ditambahkan.`);return {ok:true};
  };
  const moveAllocation=(id,newFacilityId)=>{
    if(role!=='admin')return {ok:false,message:'Akses admin diperlukan.'};
    const a=data.allocations.find(x=>x.id===id&&x.active);
    if(!a)return {ok:false,message:'Alokasi tidak ditemukan atau sudah dilepas.'};
    if(a.facilityId===newFacilityId)return {ok:false,message:'Pilih ruangan tujuan yang berbeda.'};
    const s=getStatus(data,newFacilityId,a.date,a.start,a.end);
    if(s.label!=='Tersedia')return {ok:false,message:`Ruangan tujuan berstatus ${s.label}, pemindahan ditolak.`};
    setData(d=>({...d,allocations:d.allocations.map(x=>x.id===id?{...x,facilityId:newFacilityId}:x),meetings:d.meetings.map(x=>x.allocationId===id?{...x,facilityId:newFacilityId}:x),audit:logAction(d.audit,'Admin Demo','Memindahkan alokasi',`${id} menuju ${newFacilityId}`),notices:notice(d.notices,'pj',`Alokasi ${id} dipindahkan ke ruangan baru oleh admin demo.`,'/pj/jadwal')}));
    notify(`Alokasi ${id} dipindahkan ke ${newFacilityId} pada data simulasi.`);return {ok:true};
  };
  const setClassPattern=(id,pattern)=>{if(role!=='admin')return {ok:false};setData(d=>({...d,classPatterns:{...d.classPatterns,[id]:pattern},audit:logAction(d.audit,'Admin Demo','Mengubah pola kelas',`${id}: ${pattern}`)}));notify('Pola kelas diperbarui dalam simulasi.');return {ok:true};};
  const updateFacility=(id,patch)=>{if(role!=='admin')return {ok:false};setData(d=>({...d,facilityEdits:{...d.facilityEdits,[id]:{...d.facilityEdits[id],...patch}},audit:logAction(d.audit,'Admin Demo','Memperbarui catatan fasilitas',id)}));notify('Catatan fasilitas tersimpan dalam simulasi.');return {ok:true};};
  const changeCode=(active)=>{if(role!=='admin')return {ok:false};setData(d=>({...d,pjCodeActive:active,audit:logAction(d.audit,'Admin Demo',active?'Menerbitkan ulang kode demo':'Mencabut kode demo','Tidak berlaku pada sistem autentikasi produksi.')}));notify(active?'Kode demo diaktifkan kembali.':'Kode demo dicabut; sesi PJ aktif perlu login ulang pada sistem nyata.');return {ok:true};};
  const markRead=(id)=>setData(d=>({...d,notices:d.notices.map(x=>x.id===id?{...x,read:true}:x)}));
  const value=useMemo(()=>({data,role,adminEmail,feedback,notify,search,updateSearch,loginPJ,loginAdmin,logout,resetDemo,status,confirmMeeting,releaseMeeting,submitRequest,cancelRequest,decideRequest,addIssue,resolveIssue,addClosure,addSchedule,moveAllocation,setClassPattern,updateFacility,changeCode,markRead}),[data,role,adminEmail,feedback,search]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useApp=()=>{const ctx=useContext(Context);if(!ctx)throw Error('useApp requires provider');return ctx;};
