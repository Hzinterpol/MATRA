import React, {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {UsersRound,KeyRound,LockKeyhole,ShieldCheck,ArrowLeft,ArrowRight,Eye,EyeOff,CheckCircle2,Search,LogOut,LayoutDashboard,ArrowUpRight} from 'lucide-react';
import {DEMO_PJ_CODE,DEMO_ADMIN_USERNAME,DEMO_ADMIN_PASSWORD} from '../data/demo';
import {useApp} from '../context/AppContext';
import {Button,Breadcrumbs,Field} from '../components/UI';

const options=[
 {to:'/',label:'Sebagai Publik',description:'Tanpa login. Cari ruang, lihat jadwal dan ketersediaan fasilitas kampus.',icon:UsersRound,number:'01'},
 {to:'/login/pj',label:'Sebagai PJ',description:'Masukkan satu kode PJ aktif. Sesi diingat sampai kamu memilih logout.',icon:KeyRound,number:'02'},
 {to:'/login/admin',label:'Sebagai Admin',description:'Gunakan email dan kata sandi Admin. Sesi diingat sampai logout.',icon:ShieldCheck,number:'03'}
];
const destination=role=>role==='pj'?'/pj':role==='admin'?'/admin':'/';
const readableRole=role=>role==='pj'?'Penanggung Jawab (PJ)':role==='admin'?'Administrator':'Publik';

function LoginTabs({selected}){
 return <nav className="grid grid-cols-3 gap-2" aria-label="Pilihan akses MATRA">
  {options.map(({to,label,icon:Icon})=><Link key={to} to={to} aria-current={selected===to?'page':undefined}
    className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border px-2 py-2 text-center text-[11px] font-semibold transition-colors sm:text-xs ${selected===to?'border-primary bg-mint text-primary':'border-line bg-white text-muted hover:border-primary/40 hover:bg-canvas'}`}>
   <Icon size={16} className="shrink-0"/><span>{label}</span></Link>)}
 </nav>;
}
function AuthShell({role,eyebrow,title,subtitle,icon:Icon,benefits,children}){
 return <div className="main-wrap pb-20 pt-8 md:pt-10">
  <Breadcrumbs items={[{label:'Pilih akses',to:'/login'},{label:role}]}/>
  <section className="auth-shell-v5 mx-auto mt-8 grid max-w-[1000px] overflow-hidden rounded-2xl border border-line bg-white shadow-soft lg:grid-cols-[.95fr_1.05fr]">
   <div className="auth-intro-v5 relative flex min-h-[365px] flex-col justify-center overflow-hidden bg-mint p-8 md:p-10">
    <span className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-primary/10" aria-hidden="true"/>
    <span className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full border-[25px] border-primary/10" aria-hidden="true"/>
    <div className="relative"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white"><Icon size={24}/></div>
     <p className="kicker mt-7">{eyebrow}</p><h1 className="mt-3 max-w-sm text-[29px] font-semibold leading-[1.3] text-deep md:text-[32px]">{title}</h1>
     <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{subtitle}</p>
     <div className="mt-8 space-y-3">{benefits.map(b=><div key={b} className="flex items-start gap-2.5 text-xs text-ink"><CheckCircle2 size={17} className="mt-px shrink-0 text-primary"/>{b}</div>)}</div>
    </div>
   </div>
   <div className="p-6 md:p-10"><LoginTabs selected={role==='PJ Mata Kuliah'?'/login/pj':'/login/admin'}/>
    <div className="mt-7">{children}</div>
    <Link to="/" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"><ArrowLeft size={15}/> Kembali ke halaman publik</Link>
   </div>
  </section>
 </div>;
}
function DemoAccount({username,password,onFill,code=false}){
 return <div className="mt-5 rounded-xl border border-[#c9e7e4] bg-[#f4faf9] px-4 py-3">
  <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-semibold text-primary">Akses khusus demonstrasi</span><button type="button" className="text-[11px] font-semibold text-primary underline underline-offset-2 hover:text-deep" onClick={onFill}>Isi otomatis</button></div>
  <p className="mt-2 break-all text-xs text-ink">{code?'Kode akses PJ demo':'Email admin demo'}: <code className="font-semibold">{username}</code></p>
  {password&&<p className="mt-1 text-xs text-ink">Sandi demo: <code className="font-semibold">{password}</code></p>}
 </div>;
}
function PasswordField({value,onChange}){
 const [visible,setVisible]=useState(false);
 return <Field label="Kata sandi" required><div className="relative"><input type={visible?'text':'password'} className="field pr-12" autoComplete="off" value={value} onChange={onChange} placeholder="Masukkan sandi admin demo" required/><button type="button" onClick={()=>setVisible(v=>!v)} className="absolute right-3 top-3 rounded p-1 text-muted hover:text-primary" aria-label={visible?'Sembunyikan sandi':'Tampilkan sandi'}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></Field>;
}
function CurrentSession({requested}){
 const {role,adminEmail,logout}=useApp();const navigate=useNavigate();
 if(role==='public')return null;
 const matching=requested===role;
 return <div className="rounded-2xl border border-[#b9dcd8] bg-[#f3faf9] p-5">
  <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary"><CheckCircle2 size={17}/> Sesi masih aktif</span>
  <h2 className="mt-3 text-lg font-semibold text-ink">Kamu sudah masuk sebagai {readableRole(role)}.</h2>
  {role==='admin'&&adminEmail&&<p className="mt-2 text-xs text-muted">Email: {adminEmail}</p>}
  <p className="mt-2 text-xs leading-relaxed text-muted">{matching?'Tidak perlu memasukkan data login lagi.':'Untuk berpindah jenis akun, keluar dari sesi saat ini terlebih dahulu.'} Sesi tetap aktif setelah halaman dimuat ulang sampai kamu memilih logout.</p>
  <div className="mt-5 flex flex-wrap gap-2"><Button to={destination(role)} icon={LayoutDashboard}>Lanjut ke dashboard <ArrowRight size={15}/></Button><Button variant="outline" icon={LogOut} onClick={()=>{logout();navigate('/login',{replace:true})}}>Logout / Ganti akun</Button></div>
 </div>;
}
export function LoginHubPage(){
 const {role,logout,adminEmail}=useApp();const navigate=useNavigate();
 return <div className="main-wrap pb-20 pt-10"><Breadcrumbs items={[{label:'Pilih akses'}]}/><div className="mx-auto mt-9 max-w-5xl">
  <div className="mb-8 max-w-2xl"><p className="kicker">PILIH AKSES MATRA</p><h1 className="mt-2 text-[32px] font-semibold leading-tight text-ink">Bagaimana kamu ingin mengakses MATRA?</h1><p className="mt-4 text-sm leading-relaxed text-muted">Akses Publik dapat digunakan langsung tanpa login. PJ masuk dengan kode unik, sedangkan Admin menggunakan email dan kata sandi.</p></div>
  {role!=='public'&&<div className="mb-7 rounded-2xl border border-[#b9dcd8] bg-mint p-5"><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="inline-flex items-center gap-2 text-xs font-semibold text-primary"><CheckCircle2 size={17}/> Sesi {readableRole(role)} sedang aktif</p><p className="mt-1.5 text-xs text-ink">{role==='admin'&&adminEmail?adminEmail:'Tidak perlu memasukkan kode lagi sampai logout.'}</p></div><div className="flex flex-wrap gap-2"><Button to={destination(role)}>Buka dashboard <ArrowUpRight size={15}/></Button><Button variant="outline" icon={LogOut} onClick={()=>{logout();navigate('/login')}}>Logout</Button></div></div></div>}
  <div className="grid gap-5 md:grid-cols-3">{options.map(({to,label,description,icon:Icon,number})=><Link to={to} key={to} className="login-option-v5 interactive-card group flex min-h-[256px] flex-col rounded-2xl border border-line bg-white p-7"><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-primary"><Icon size={22}/></span><span className="text-xl font-semibold text-primary/80">{number}</span></div><h2 className="mt-6 text-lg font-semibold text-ink">{label}</h2><p className="mt-3 flex-1 text-xs leading-relaxed text-muted">{description}</p><span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-primary">{to==='/'?'Buka halaman publik':'Lanjutkan'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></span></Link>)}</div>
  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-mint p-5"><div className="flex items-center gap-3 text-sm text-ink"><Search size={20} className="text-primary"/>Hanya ingin mengecek ketersediaan ruangan?</div><Button variant="outline" to="/cari">Cari tanpa login</Button></div>
 </div></div>;
}
export function LoginPJPage(){
 const navigate=useNavigate();const {loginPJ,data,role}=useApp();const [code,setCode]=useState(''),[error,setError]=useState('');
 function submit(e){e.preventDefault();const result=loginPJ(code);if(result.ok){setCode('');navigate('/pj',{replace:true});}else setError(result.message);}
 return <AuthShell role="PJ Mata Kuliah" eyebrow="PORTAL PJ" title="Masuk sekali, lanjutkan tugasmu." subtitle="Akses penanggung jawab perkuliahan memakai kode unik. Kode cukup dimasukkan ketika pertama kali login atau setelah logout." icon={KeyRound} benefits={['Kode PJ diingat sebagai sesi lokal sampai logout','Konfirmasi perkuliahan daring atau luring','Ajukan peminjaman dan pantau keputusan Admin']}>
  {role!=='public'?<CurrentSession requested="pj"/>:<><h2 className="text-xl font-semibold text-ink">Masuk sebagai PJ</h2><p className="mt-2 text-xs leading-relaxed text-muted">Masukkan kode unik penugasan PJ. Tidak perlu mengulang pada kunjungan berikutnya selama belum logout.</p>
   <form onSubmit={submit} className="mt-6 space-y-4"><Field label="Kode unik PJ" required><input className="field" value={code} onChange={e=>{setCode(e.target.value);setError('')}} autoComplete="off" placeholder="Masukkan kode PJ" required/></Field>{error&&<p role="alert" className="text-xs font-medium text-danger">{error}</p>}<Button type="submit" className="w-full">Masuk ke dashboard PJ <ArrowRight size={16}/></Button></form>
   <DemoAccount username={DEMO_PJ_CODE} code onFill={()=>{setCode(DEMO_PJ_CODE);setError('')}}/><p className="mt-3 text-[11px] text-muted">Status kode contoh: <strong>{data.pjCodeActive?'Aktif':'Dicabut oleh Admin demo'}</strong>.</p>
  </>}
 </AuthShell>;
}
export function LoginAdminPage(){
 const navigate=useNavigate();const {loginAdmin,role}=useApp();const [username,setUsername]=useState(''),[pwd,setPwd]=useState(''),[error,setError]=useState('');
 function submit(e){e.preventDefault();const result=loginAdmin(username.trim().toLowerCase(),pwd);if(result.ok){setPwd('');navigate('/admin',{replace:true});}else setError(result.message);}
 return <AuthShell role="Administrator" eyebrow="AKSES ADMIN" title="Kelola ruangan dengan lebih terarah." subtitle="Portal khusus pengelola untuk memutuskan pengajuan, memeriksa bentrokan, dan mengatur jadwal fasilitas." icon={LockKeyhole} benefits={['Email dan password hanya dimasukkan saat awal login','Sesi disimpan lokal sampai logout','Pengajuan dan konflik diperiksa oleh admin']}>
  {role!=='public'?<CurrentSession requested="admin"/>:<><h2 className="text-xl font-semibold text-ink">Masuk sebagai Admin</h2><p className="mt-2 text-xs leading-relaxed text-muted">Masukkan email dan kata sandi untuk melanjutkan ke dashboard Admin.</p>
   <form onSubmit={submit} className="mt-6 space-y-4"><Field label="Email Admin" required><input type="email" autoComplete="username" className="field" value={username} onChange={e=>{setUsername(e.target.value);setError('')}} placeholder="admin@matra.demo" required/></Field><PasswordField value={pwd} onChange={e=>{setPwd(e.target.value);setError('')}}/>{error&&<p role="alert" className="text-xs font-medium text-danger">{error}</p>}<Button type="submit" className="w-full">Masuk ke dashboard Admin <ArrowRight size={16}/></Button></form>
   <DemoAccount username={DEMO_ADMIN_USERNAME} password={DEMO_ADMIN_PASSWORD} onFill={()=>{setUsername(DEMO_ADMIN_USERNAME);setPwd(DEMO_ADMIN_PASSWORD);setError('')}}/>
  </>}
 </AuthShell>;
}
