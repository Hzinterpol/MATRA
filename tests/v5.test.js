import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');

test('Navbar publik memulihkan Masuk sebagai PJ di kanan pencarian cepat',()=>{
 const source=read('src/components/Layouts.jsx');
 const start=source.indexOf('export function PublicLayout');
 const end=source.indexOf('function DashboardNavigation',start);
 const layout=source.slice(start,end);
 assert.ok(layout.includes('<GlobalSearch/>'));
 assert.ok(layout.includes('Masuk sebagai PJ'));
 assert.ok(layout.indexOf('<GlobalSearch/>')<layout.indexOf('Masuk sebagai PJ'));
 assert.ok(layout.includes('to="/login/admin"'));
});

test('Footer publik menampilkan Login Admin serta petunjuk peminjaman',()=>{
 const source=read('src/components/Layouts.jsx');
 assert.match(source,/Login Admin<\/Link>/);
 assert.match(source,/Petunjuk peminjaman<\/Link>/);
 assert.match(source,/\/login\/admin/);
});

test('Tiga kategori mempunyai slot foto yang dapat diisi manual',()=>{
 const media=read('src/components/MediaFrame.jsx');
 assert.match(media,/\/assets\/foto\/\$\{folder\}\/\$\{id\}\.webp/);
 for(const id of ['ruang-kuliah','lab-komputer','layanan-kampus'])assert.ok(media.includes(`'${id}':`));
 assert.match(media,/replace\(\/\\.webp\$\/i,'\.jpg'\)/);
 const guide=read('public/assets/foto/PANDUAN-FOTO.md');
 for(const name of ['ruang/gds-517.webp','lab/gds-507.webp','layanan/layanan-akademik.webp'])assert.ok(guide.includes(name));
});

test('Visual style referensi diterapkan tanpa mengganti warna utama MATRA',()=>{
 const css=read('src/styles/v5.css');
 assert.match(css,/--matra-paper/);
 assert.match(css,/\.hero-artwork/);
 assert.match(css,/\.editorial-project-card/);
 assert.match(css,/\.process-track/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/#006569/i);
 assert.match(css,/#FFDD00/i);
 assert.ok(read('src/main.jsx').includes("import './styles/v5.css'"));
});

test('Beranda memiliki hero, akses cepat, area layanan dan alur peminjaman',()=>{
 const jsx=read('src/components/HomeExperience.jsx');
 for(const term of ['Temukan ruang.','Pastikan','AKSES CEPAT','JELAJAHI FASILITAS','ALUR PEMINJAMAN','<MediaFrame','<QuickSearch'])assert.ok(jsx.includes(term),term);
});

test('Tidak ada layanan keamanan palsu: autentikasi masih menggunakan simulasi',()=>{
 const auth=read('src/pages/AuthPages.jsx');
 assert.ok(auth.includes('<DemoAccount username={DEMO_PJ_CODE}'));
 assert.ok(read('src/data/demo.js').includes('DEMO_PJ_CODE'));
 const session=read('src/utils/authSession.js');
 assert.ok(session.includes('matra-demo-auth-v4'));
 assert.ok(session.includes('LocalStorage dapat diubah oleh pengguna'));
 assert.ok(!session.includes('storage.setItem(AUTH_STORAGE_KEY,JSON.stringify({password'));
});

test('Tidak ada dependensi produksi baru untuk ikon',()=>{
 const deps=JSON.parse(read('package.json'));
 assert.ok(deps.dependencies['lucide-react']);
 assert.ok(deps.dependencies['react']);
 assert.ok(!deps.dependencies['framer-motion']);
});
