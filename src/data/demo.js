// Seluruh isi file merupakan contoh untuk prototipe, BUKAN data operasional kampus.
import { SCHEDULE_DATE, scheduleAllocations, scheduleMeetings } from './schedule.js';
export const DEMO_DATE = SCHEDULE_DATE;
export const DEMO_PJ_CODE = 'MATRA-DEMO-PJ'; // Hanya untuk simulasi UI, bukan kredensial keamanan.
export const DEMO_ADMIN_USERNAME = 'admin@matra.demo';
export const DEMO_ADMIN_PASSWORD = 'admin123';
// GDS 507-516 adalah laboratorium komputer. GDS 517 adalah ruang kuliah.
// Jumlah komputer per nomor GDS dan instalasi software belum diverifikasi.
// Nilai perangkat lunak berikut hanya contoh UI agar filter dapat didemonstrasikan.
export const ROOM_NAMES = Array.from({length:10},(_,i)=>`GDS ${507+i}`).concat(['GDS 517','GDS 607','GDS 608','GDS 613','GdM 215','GHA 109']);
export const DEFAULT_SEATS_DEMO = 40; // tidak ditampilkan sebagai informasi utama/terverifikasi
const standardFeatures=['Smart TV','AC','Wi-Fi'];
const room=(id,name,building,floor,extra={})=>({
 id,type:'room',name,building,floor,capacity:extra.capacity??DEFAULT_SEATS_DEMO,
 features:standardFeatures,description:extra.description||'Ruang perkuliahan dengan Smart TV, AC, dan Wi-Fi. Jadwal mengikuti alokasi Semester 125.',
 location:`${building}, lantai ${floor}`,seatsVerified:!!extra.seatsVerified
});
const sampleSoftware={
 'gds-507':['Visual Studio Code','Python','RStudio'],
 'gds-508':['Java JDK','NetBeans','Visual Studio Code'],
 'gds-512':['Visual Studio Code','Java JDK'],
 'gds-514':['Python','Visual Studio Code'],
 'gds-515':['RStudio','Python','Visual Studio Code']
};
const computerDemo={'gds-507':32,'gds-508':28}; // simulasi UI dari lab A/B lama, bukan verifikasi ruang GDS.
const lab=(number)=>{
 const name=`GDS ${number}`;const id=`gds-${number}`;
 return {id,type:'lab',name,building:'Gedung Dewi Sartika',floor:5,
  capacity:DEFAULT_SEATS_DEMO,seatsVerified:false,computers:computerDemo[id]??null,
  computersVerified:false,checked:null,features:standardFeatures,
  software:(sampleSoftware[id]||[]).map(name=>({name,version:'Belum diverifikasi',verified:false})),
  description:'Laboratorium komputer Rumpun Matematika. Jadwal berdasarkan Semester 125; jumlah komputer dan daftar software perlu verifikasi pengelola.',
  location:'Gedung Dewi Sartika, lantai 5'};
};
export const facilities = [
 ...Array.from({length:10},(_,i)=>lab(507+i)),
 room('gds-517','GDS 517','Gedung Dewi Sartika',5),
 room('gds-607','GDS 607','Gedung Dewi Sartika',6),
 room('gds-608','GDS 608','Gedung Dewi Sartika',6),
 room('gds-613','GDS 613','Gedung Dewi Sartika',6,{capacity:13,seatsVerified:true,description:'Ruang kelas GDS 613 memiliki 13 kursi. Penjadwalan luring menggunakan pergiliran Grup X dan Y.'}),
 room('gdm-215','GdM 215','Gedung M',2),
 room('gha-109','GHA 109','Gedung Hasyim Asy’arie',1,{description:'Ruang workshop akademik. Jadwal Semester 125 mencatat sesi workshop khusus.'})
];
export const classes = [
  {id:'KLS-001',course:'Komputer dan Masyarakat',program:'S1 Ilmu Komputer',section:'2025 B',semester:'2026/2027 Ganjil',pattern:'Bergantian',pj:'PJ Demo MATRA'},
  {id:'KLS-002',course:'Basis Data',program:'S1 Ilmu Komputer',section:'2025 B',semester:'2026/2027 Ganjil',pattern:'Offline setiap minggu',pj:'PJ Kelas B'},
  {id:'KLS-003',course:'Perancangan dan Pemrograman Web',program:'S1 Ilmu Komputer',section:'2025 A',semester:'2026/2027 Ganjil',pattern:'Offline setiap minggu',pj:'PJ Kelas A'}
];
export const campusServices = [
  {id:'layanan-akademik',name:'Layanan Akademik',category:'Akademik',location:'Sekretariat Rumpun Matematika',hours:'Ikuti pengumuman resmi pengelola',requirements:['Identitas mahasiswa','Keperluan akademik yang jelas'],contact:'Kontak resmi belum dipublikasikan',desc:'Informasi administrasi dan bantuan akademik untuk mahasiswa.'},
  {id:'layanan-laboratorium',name:'Informasi Laboratorium',category:'Fasilitas',location:'Gedung laboratorium FMIPA',hours:'Mengikuti jadwal pengelola',requirements:['Periksa jadwal dan aturan fasilitas','Koordinasi melalui pengelola'],contact:'Hubungi pengelola laboratorium',desc:'Petunjuk akses dan penggunaan fasilitas laboratorium.'},
  {id:'bantuan-ruangan',name:'Bantuan Peminjaman Ruang',category:'Peminjaman',location:'Pengelola fasilitas akademik',hours:'Mengikuti jam layanan pengelola',requirements:['Informasi kelas dan PJ','Tanggal, jam, dan ruangan yang dibutuhkan'],contact:'Hubungi admin MATRA melalui kanal resmi kampus',desc:'Bantuan mengajukan ruangan dan menangani bentrokan jadwal.'}
];
export const initialDemo = {
  allocations:scheduleAllocations,
  closures:[{id:'CL-001',facilityId:'gds-608',date:'2026-11-05',start:'08:00',end:'17:00',reason:'Pemeliharaan fasilitas (data simulasi)'}],
  meetings:scheduleMeetings,
  requests:[
    {id:'REQ-001',seq:1,facilityId:'gds-507',date:DEMO_DATE,start:'13:00',end:'15:00',classId:'KLS-001',pj:'PJ Demo MATRA',purpose:'Praktikum pemrograman pengganti',status:'Menunggu Keputusan',received:'2026-11-08T08:30:00+07:00',reason:''},
    {id:'REQ-002',seq:2,facilityId:'gds-507',date:DEMO_DATE,start:'09:00',end:'11:00',classId:'KLS-001',pj:'PJ Demo MATRA',purpose:'Kelas pengganti',status:'Menunggu Keputusan',received:'2026-11-08T09:10:00+07:00',reason:''},
    {id:'REQ-003',seq:3,facilityId:'gds-507',date:'2026-11-10',start:'09:00',end:'11:00',classId:'KLS-001',pj:'PJ Demo MATRA',purpose:'Kegiatan praktikum',status:'Ditolak',received:'2026-11-08T13:00:00+07:00',reason:'Dokumen pendukung belum lengkap (contoh).'},
    {id:'REQ-004',seq:4,facilityId:'gds-508',date:'2026-11-11',start:'13:00',end:'15:00',classId:'KLS-001',pj:'PJ Demo MATRA',purpose:'Praktikum terjadwal',status:'Disetujui',received:'2026-11-08T14:30:00+07:00',reason:''}
  ],
  issues:[{id:'LAP-001',facilityId:'gds-607',date:'2026-11-11',time:'09:00',text:'Terindikasi bentrokan informasi penggunaan ruangan.',status:'Belum ditindaklanjuti',reporter:'PJ Demo MATRA'}],
  notices:[{id:'NT-001',role:'pj',text:'Pengingat: konfirmasi kelas Komputer dan Masyarakat, Rabu 11 November.',at:'2026-11-08T08:00:00+07:00',read:false,href:'/pj/konfirmasi'},{id:'NT-002',role:'admin',text:'Ada 2 pengajuan yang menunggu keputusan.',at:'2026-11-08T09:15:00+07:00',read:false,href:'/admin/antrean'}],
  audit:[{id:'AU-001',at:'2026-11-08T09:15:00+07:00',actor:'Sistem Demo',action:'Data contoh dimuat',note:'Semua data simulasi untuk evaluasi frontend.'}],
  pjCodeActive:true,
  classPatterns:{'KLS-001':'Bergantian','KLS-002':'Offline setiap minggu','KLS-003':'Offline setiap minggu'},
  facilityEdits:{}
};
