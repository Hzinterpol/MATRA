import React,{useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';

// Animasi MATRA v6.4 diadaptasi dari loading.lottie yang dikirim pengguna.
// Animasi yang sama digunakan saat pertama dibuka dan setiap pergantian rute.
// Versi SVG dihasilkan dari keyframe file Lottie asli, tanpa library tambahan.
export const LOADING_DURATION=1100;
const reduceMotion=()=>typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function LoadingIndicator(){
  const location=useLocation();
  const [loading,setLoading]=useState(()=>!reduceMotion());
  const [sequence,setSequence]=useState(0);

  useEffect(()=>{
    if(reduceMotion()){
      setLoading(false);
      return;
    }
    setSequence(n=>n+1);
    setLoading(true);
    const timeout=window.setTimeout(()=>setLoading(false),LOADING_DURATION);
    // Cleanup aman ketika StrictMode mengulang efek atau navigasi berturut-turut.
    return ()=>window.clearTimeout(timeout);
  },[location.key]);

  if(!loading)return null;
  return <div key={sequence} className="matra-unified-loading" role="status" aria-label="Memuat halaman MATRA" aria-live="polite">
    <img className="matra-unified-loading-art" src="/assets/loading/loading-yellow.svg" width="220" height="96" alt="" aria-hidden="true" decoding="sync"/>
    <span className="sr-only">Memuat halaman MATRA...</span>
  </div>;
}
