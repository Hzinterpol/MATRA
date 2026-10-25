import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {AUTH_STORAGE_KEY,readDemoAuth,saveDemoAuth,publicSession} from '../src/utils/authSession.js';
const source=path=>fs.readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
const memoryStorage=()=>{
 const map=new Map();
 return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),dump:()=>map};
};
test('Publik langsung mengakses situs tanpa kredensial',()=>{
 const storage=memoryStorage();
 assert.deepEqual(readDemoAuth(storage),publicSession());
 const login=source('pages/AuthPages.jsx');
 assert(login.includes("to:'/',label:'Sebagai Publik'"));
 assert(!login.includes('LoginStudentPage'));
 assert(!login.includes('DEMO_STUDENT_PASSWORD'));
});
test('Sesi PJ bertahan setelah reload sampai logout, tanpa menyimpan kode',()=>{
 const store=memoryStorage();
 saveDemoAuth(store,{role:'pj',adminEmail:'',secret:'MATRA-DEMO-PJ'});
 assert.deepEqual(readDemoAuth(store),{role:'pj',adminEmail:''});
 assert(!store.getItem(AUTH_STORAGE_KEY).includes('MATRA-DEMO-PJ'));
 saveDemoAuth(store,publicSession());
 assert.equal(store.getItem(AUTH_STORAGE_KEY),null);
 assert.equal(readDemoAuth(store).role,'public');
});
test('Sesi Admin menyimpan email tanpa password, logout membolehkan login ulang',()=>{
 const store=memoryStorage();
 saveDemoAuth(store,{role:'admin',adminEmail:'admin@matra.demo',password:'admin123'});
 assert.deepEqual(readDemoAuth(store),{role:'admin',adminEmail:'admin@matra.demo'});
 assert(!store.getItem(AUTH_STORAGE_KEY).includes('admin123'));
 saveDemoAuth(store,publicSession());
 assert.deepEqual(readDemoAuth(store),publicSession());
});
test('Sesi rusak atau jenis peran lain ditolak aman sebagai Publik',()=>{
 const store=memoryStorage();
 for(const text of ['{}','not-json','{"role":"student"}','{"role":"root"}']){
  store.setItem(AUTH_STORAGE_KEY,text);assert.equal(readDemoAuth(store).role,'public');
 }
 assert.throws(()=>saveDemoAuth(store,{role:'root'}));
});
test('Halaman PJ Admin mengarahkan sesi aktif ke dashboard tanpa login ulang',()=>{
 const auth=source('pages/AuthPages.jsx');const context=source('context/AppContext.jsx');
 for(const fragment of ['<CurrentSession requested="pj"/>','<CurrentSession requested="admin"/>','role!==\'public\'','Logout / Ganti akun'])assert(auth.includes(fragment),fragment);
 assert(context.includes("setAuth({role:'pj'"));
 assert(context.includes("setAuth({role:'admin'"));
 assert(context.includes('saveDemoAuth(localStorage,auth)'));
});
test('Semua kontrol tanggal dan waktu menggunakan pemilih MATRA tanpa popup OS',()=>{
 const components=['components/UI.jsx','components/CalendarGrid.jsx','pages/PJPages.jsx','pages/AdminPages.jsx'];
 for(const path of components){const s=source(path);
  assert(!/<input[^<]*\btype="date"/.test(s),path);
  assert(!/<input[^<]*\btype="time"/.test(s),path);
  assert(!s.includes('<select '),path);
  assert(s.includes("from '../components/Inputs'")||s.includes("from './Inputs'"),path);
 }
 const control=source('components/Inputs.jsx');
 assert(control.includes('export function DateInput'));assert(control.includes('export function TimeInput'));assert(control.includes('export function SelectInput'));
 assert(control.includes('Hari ini'));assert(control.includes('Pilih waktu (WIB)'));
});
test('Informasi direktori yang diminta dihapus, dan jalur mahasiswa lama diarahkan ke pilihan akses',()=>{
 const pub=source('pages/PublicPages.jsx');const app=source('App.jsx');
 assert(!pub.includes('Informasi direktori'));
 assert(app.includes('<Route path="login/mahasiswa" element={<Navigate to="/login" replace/>}/>'));
 assert(!app.includes('<LoginStudentPage/>'));
});
