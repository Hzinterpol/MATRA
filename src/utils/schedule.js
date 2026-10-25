/**
 * Date and calendar helpers for demo allocations.
 * Pure functions so an updated schedule seed changes the calendar automatically.
 */
export function addDays(day,amount){
 const d=new Date(day+'T12:00:00Z');
 d.setUTCDate(d.getUTCDate()+amount);
 return d.toISOString().slice(0,10);
}
export function weekMonday(day){
 const dayOfWeek=new Date(day+'T12:00:00Z').getUTCDay();
 return addDays(day,-((dayOfWeek+6)%7));
}
export const intervalKey=(start,end)=>`${start}|${end}`;
export function calendarRanges(state,facilityIds,visibleDays,selectedStart,selectedEnd){
 const ranges=new Map();
 if(selectedStart&&selectedEnd&&selectedStart<selectedEnd)ranges.set(intervalKey(selectedStart,selectedEnd),[selectedStart,selectedEnd]);
 const ids=new Set(facilityIds);
 const dates=new Set(visibleDays);
 const records=[...(state.allocations||[]).filter(a=>a.active),...(state.requests||[]).filter(r=>r.status==='Disetujui'),...(state.closures||[])];
 for(const record of records){
  if(ids.has(record.facilityId)&&dates.has(record.date)&&record.start&&record.end&&record.start<record.end){
   ranges.set(intervalKey(record.start,record.end),[record.start,record.end]);
  }
 }
 return [...ranges.values()].sort((a,b)=>a[0].localeCompare(b[0])||a[1].localeCompare(b[1]));
}
