import React,{useEffect} from 'react';
import {Outlet,useLocation} from 'react-router-dom';

// Animasi masuk sederhana tanpa library animasi tambahan.
// Menghormati prefers-reduced-motion melalui src/index.css.
export function AnimatedOutlet(){
  const location=useLocation();
  useEffect(()=>{if(!location.hash)return;const hash=decodeURIComponent(location.hash.slice(1));const timer=requestAnimationFrame(()=>document.getElementById(hash)?.scrollIntoView({behavior:'smooth',block:'start'}));return()=>cancelAnimationFrame(timer);},[location.pathname,location.hash]);
  return <div className="page-transition" key={location.pathname} data-page={location.pathname}><Outlet/></div>;
}
