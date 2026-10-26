import React from 'react';
import {useSearchParams} from 'react-router-dom';

export function useDashboardTab(defaultTab,values){
 const [params,setParams]=useSearchParams();
 const candidate=params.get('tab');
 const current=values.includes(candidate)?candidate:defaultTab;
 const setTab=(next)=>{
  if(!values.includes(next))return;
  const nextParams=new URLSearchParams(params);
  nextParams.set('tab',next);
  setParams(nextParams,{replace:true});
 };
 return [current,setTab];
}
export default function DashboardTabs({items,active,onChange,label='Pilihan tampilan'}){
 return <div role="tablist" aria-label={label} className="mb-5 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-2">
  {items.map(({value,text})=><button type="button" role="tab" aria-selected={value===active}
   key={value} onClick={()=>onChange(value)} className={`min-h-10 rounded-lg px-4 py-2 text-xs font-semibold transition duration-200 ${value===active?'bg-primary text-white shadow-sm':'text-muted hover:bg-mint hover:text-primary'}`}>{text}</button>)}
 </div>;
}
