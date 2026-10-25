/**
 * Status sesi hanya untuk PROTOTIPE statis. LocalStorage dapat diubah oleh pengguna;
 * jangan gunakan ini sebagai autentikasi nyata atau otorisasi backend.
 * Kode PJ dan password admin TIDAK disimpan.
 */
export const AUTH_STORAGE_KEY='matra-demo-auth-v4';
export const publicSession=()=>({role:'public',adminEmail:''});

export function readDemoAuth(storage){
 try{
  const payload=JSON.parse(storage.getItem(AUTH_STORAGE_KEY)||'null');
  if(payload&&['pj','admin'].includes(payload.role)){
   return {role:payload.role,adminEmail:payload.role==='admin'?String(payload.adminEmail||''):''};
  }
 }catch{}
 return publicSession();
}
export function saveDemoAuth(storage,session){
 if(!session||session.role==='public'){
  storage.removeItem(AUTH_STORAGE_KEY);
  return;
 }
 if(!['pj','admin'].includes(session.role))throw new Error('Jenis sesi demonstrasi tidak valid');
 // Hanya indikator peran dan email, tidak ada kode akses atau password.
 storage.setItem(AUTH_STORAGE_KEY,JSON.stringify({
  role:session.role,
  adminEmail:session.role==='admin'?String(session.adminEmail||''):''
 }));
}
