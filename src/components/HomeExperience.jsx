import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,ArrowUpRight,CalendarDays,CheckCircle2,Clock3,Search,ShieldCheck,Building2,Monitor,BookOpen,MapPin,ClipboardCheck,Layers3} from 'lucide-react';
import {Button,QuickSearch} from './UI';
import MediaFrame from './MediaFrame';
import mainIllustration from '../assets/ilustrasi/main.webp';
import aboutIllustration from '../assets/ilustrasi/kenali-matra.webp';


// Aset diimpor langsung agar Vite selalu menyertakannya saat build; bukan mengandalkan URL public manual.
function SafeIllustration({src,alt,className,...props}) {
 const [failed,setFailed]=useState(false);
 if(failed) return <div role="img" aria-label={alt} className={`${className} flex flex-col items-center justify-center gap-3 text-center text-primary`}><Building2 size={65} strokeWidth={1.2}/><span className="max-w-48 text-xs font-medium">Ilustrasi MATRA</span></div>;
 return <img src={src} alt={alt} className={className} onError={()=>setFailed(true)} {...props}/>;
}

const shortcuts=[
 {to:'/ruang-kuliah',title:'Ruang Kuliah',icon:Building2},
 {to:'/lab-komputer',title:'Lab Komputer',icon:Monitor},
 {to:'/cari/kalender',title:'Kalender Jadwal',icon:CalendarDays},
 {to:'/lab-komputer',title:'Perangkat Lunak',icon:Layers3},
 {to:'/layanan-kampus',title:'Layanan Kampus',icon:BookOpen},
 {to:'/petunjuk-peminjaman',title:'Panduan Pinjam',icon:ClipboardCheck}
];
const services=[
 {index:'01',type:'category',id:'ruang-kuliah',name:'Ruang Kuliah',category:'RUANG AKADEMIK',desc:'Lihat ruang, kelas yang terjadwal, status slot, dan waktu penggunaan dengan jelas.',to:'/ruang-kuliah',icon:Building2},
 {index:'02',type:'category',id:'lab-komputer',name:'Lab Komputer',category:'PRAKTIKUM',desc:'Temukan lab GDS 507–516, cek perangkat lunak dan jumlah komputer yang tercatat.',to:'/lab-komputer',icon:Monitor},
 {index:'03',type:'category',id:'layanan-kampus',name:'Layanan Kampus',category:'INFORMASI',desc:'Cari informasi lokasi, ketentuan, dan bantuan fasilitas akademik dalam satu tempat.',to:'/layanan-kampus',icon:BookOpen}
];
const benefits=[
 {icon:CalendarDays,label:'Jadwal Semester 125'},
 {icon:Search,label:'Pencarian lebih cepat'},
 {icon:ShieldCheck,label:'Status slot yang jelas'},
 {icon:Monitor,label:'Informasi perangkat'},
 {icon:Clock3,label:'Waktu detail (WIB)'},
 {icon:MapPin,label:'Lokasi satu akses'}
];
const steps=[
 {number:'01',name:'Temukan',desc:'Pilih ruang atau lab',icon:Search},
 {number:'02',name:'Periksa',desc:'Cek jadwal & slot',icon:CalendarDays},
 {number:'03',name:'Ajukan',desc:'PJ mengirim pengajuan',icon:ClipboardCheck},
 {number:'04',name:'Tinjau',desc:'Admin memutuskan',icon:ShieldCheck},
 {number:'05',name:'Gunakan',desc:'Ikuti alokasi resmi',icon:CheckCircle2}
];
export default function HomeExperience(){
 return <div className="homepage-v5 overflow-hidden">
   <div className="main-wrap">
    <section className="hero-editorial grid items-center gap-10 pt-14 pb-11 lg:grid-cols-[1.02fr_.98fr] lg:gap-8 lg:pb-16 lg:pt-20" aria-labelledby="home-hero-title">
     <div className="relative z-[1]">
       <p className="editorial-eyebrow mb-7"><span className="editorial-eyebrow-line"/> SELAMAT DATANG DI MATRA</p>
       <h1 id="home-hero-title" className="editorial-hero-title">Temukan ruang.<span className="block text-primary">Pastikan <span className="relative inline-block whitespace-nowrap">jadwalnya<span className="hero-yellow-underline" aria-hidden="true"/></span>.</span></h1>
       <p className="mt-5 max-w-[440px] text-[14px] font-medium leading-[1.8] text-ink/85">Satu tempat untuk menemukan ruang kuliah, laboratorium komputer, dan layanan kampus dengan informasi jadwal yang lebih pasti.</p>
       <p className="mt-3 max-w-[470px] text-[13px] leading-[1.9] text-muted">Lihat ketersediaan tanpa login. Pelajari alur peminjaman sebelum mengajukan permintaan sebagai PJ.</p>
       <div className="mt-8 flex flex-wrap gap-3"><Button className="hero-cta" to="/cari" icon={Search}>Cari ruang & lab <ArrowRight size={16}/></Button><Button className="hero-cta" to="/cari/kalender" variant="outline" icon={CalendarDays}>Lihat kalender</Button></div>
       <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-muted"><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-primary"/> Akses informasi tanpa login</span><span className="inline-flex items-center gap-1.5"><Clock3 size={15} className="text-primary"/> Seluruh waktu dalam WIB</span></div>
     </div>
     <div className="hero-artwork relative mx-auto flex w-full max-w-[510px] items-center justify-center overflow-hidden rounded-[34px]" aria-label="Ilustrasi kampus MATRA">
      <div className="hero-artwork-disc" aria-hidden="true"/>
      <div className="hero-artwork-scribble" aria-hidden="true"/>
      <span aria-hidden="true" className="hero-asterisk">✳</span>
      <SafeIllustration src={mainIllustration} width="630" height="840" alt="Ilustrasi dua mahasiswa MATRA" className="hero-main-webp relative z-[5]" fetchPriority="high" decoding="async"/>
      <div className="hero-floating-note"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-primary"><CalendarDays size={18}/></span><span><strong className="block text-xs text-ink">Jadwal Semester 125</strong><span className="mt-1 block text-[10px] text-muted">Tersusun berdasarkan ruangan</span></span></div>
      <div className="hero-floating-dot" aria-hidden="true"/>
     </div>
    </section>
   </div>

   <div className="main-wrap"><section className="editorial-searchbox" aria-label="Cari ketersediaan"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="editorial-eyebrow text-[10px]">MULAI DARI SINI</p><h2 className="mt-1.5 text-xl font-semibold text-ink">Temukan slot yang sesuai.</h2></div><span className="inline-flex items-center gap-2 text-[11px] text-muted"><span className="h-2 w-2 rounded-full bg-primary"/> Jadwal dan alokasi berdasarkan data Semester 125</span></div><QuickSearch actionText="Cari ketersediaan"/></section></div>

   <div className="main-wrap"><section className="py-16" aria-labelledby="shortcut-heading"><div className="editorial-section-heading"><div><p className="editorial-eyebrow">AKSES CEPAT</p><h2 id="shortcut-heading" className="section-title mt-2">Cari yang kamu butuhkan.</h2></div><p className="text-[12px] text-muted">Satu tempat, semua informasi penting.</p></div><div className="shortcuts-grid mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{shortcuts.map(({title,to,icon:Icon})=><Link key={title} to={to} className="shortcut-tile group"><span className="shortcut-icon"><Icon size={24} strokeWidth={1.7}/></span><span className="mt-3 block text-center text-[11px] font-semibold text-ink">{title}</span><ArrowUpRight size={13} className="absolute right-3 top-3 text-primary/60 opacity-0 transition-opacity group-hover:opacity-100"/></Link>)}</div></section></div>

   <section className="editorial-about py-16 lg:py-20"><div className="main-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20"><div className="about-illustration" aria-label="Ilustrasi Kenali MATRA"><span className="about-illustration-halo" aria-hidden="true"/><SafeIllustration src={aboutIllustration} width="550" height="660" alt="Mahasiswi memperkenalkan layanan MATRA" className="about-illustration-webp relative z-[5] mx-auto" loading="lazy" decoding="async"/><span className="about-illustration-note">AKSES FASILITAS</span></div><div><p className="editorial-eyebrow">KENALI MATRA</p><h2 className="editorial-large-heading mt-3">Bukan sekadar daftar ruangan.</h2><p className="mt-5 text-[13px] leading-[1.9] text-muted">MATRA membantu mahasiswa memahami kapan sebuah ruang digunakan, mata kuliah apa yang dijadwalkan, serta siapa yang berwenang mengajukan peminjaman. Informasi yang sebelumnya tersebar kini lebih mudah dicari.</p><div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">{benefits.map(({icon:Icon,label})=><div key={label} className="flex items-center gap-3"><Icon className="shrink-0 text-primary" size={21} strokeWidth={1.8}/><span className="text-[12px] font-semibold text-ink">{label}</span></div>)}</div></div></div></section>

   <section className="main-wrap py-16 lg:py-20" aria-labelledby="services-v5-title"><div className="editorial-section-heading"><div><p className="editorial-eyebrow">JELAJAHI FASILITAS</p><h2 id="services-v5-title" className="section-title mt-2">Ruang & layanan pilihanmu.</h2></div><Link to="/cari" className="editorial-inline-link">Lihat semua fasilitas <ArrowRight size={17}/></Link></div><div className="mt-8 grid gap-6 md:grid-cols-3">{services.map(({index,type,id,name,category,desc,to,icon:Icon})=><Link to={to} key={id} className="editorial-project-card group"><MediaFrame type={type} id={id} title={name} label={category} className="h-48 md:h-44 lg:h-[195px]" showTag={false}/><div className="px-6 pb-6 pt-5"><div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary"><Icon size={15}/>{category}</span><span className="text-[13px] font-semibold text-primary">{index}</span></div><h3 className="mt-3 text-[18px] font-semibold text-ink">{name}</h3><p className="mt-2 min-h-[65px] text-[12px] leading-[1.8] text-muted">{desc}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">Jelajahi layanan <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"/></span></div></Link>)}</div></section>

   <section className="main-wrap pb-20 pt-4"><p className="editorial-eyebrow">ALUR PEMINJAMAN</p><h2 className="section-title mt-2">Dari mencari hingga menggunakan.</h2><div className="process-track mt-9 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">{steps.map(({number,name,desc,icon:Icon},i)=><div className="process-step" key={number}><div className="process-circle"><Icon size={27} strokeWidth={1.55}/></div><span className="mt-4 block text-[12px] font-bold text-primary">{number}</span><h3 className="mt-1 text-[13px] font-semibold text-ink">{name}</h3><p className="mt-1 text-[11px] leading-[1.65] text-muted">{desc}</p></div>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-[#f9fcfa] p-6 sm:p-8"><div><p className="editorial-eyebrow mb-1">BUTUH BANTUAN?</p><p className="text-base font-semibold text-ink">Pahami aturan sebelum meminjam.</p></div><Button to="/petunjuk-peminjaman" variant="outline">Baca petunjuk <ArrowRight size={16}/></Button></div></section>
 </div>;
}
