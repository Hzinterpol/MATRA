import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

test('Beranda adalah menu navbar publik pertama, di kiri Ruang Kuliah',()=>{
  const menu=read('src/data/sitemap.js');
  const home=menu.indexOf("{ label: 'Beranda', to: '/'");
  const rooms=menu.indexOf("{ label: 'Ruang Kuliah'");
  assert.ok(home>0 && rooms>home);
  assert.equal([...menu.matchAll(/label: 'Beranda', to: '\/'/g)].length,1);
});

test('Menu baru juga terlihat dalam navigasi mobile dan menandai rute / secara tepat',()=>{
  const layout=read('src/components/Layouts.jsx');
  assert.ok((layout.match(/publicMenu\.map/g)||[]).length>=2);
  assert.ok((layout.match(/end=\{n\.to==='\/'\}/g)||[]).length>=2);
});

test('Loading menampilkan tiga titik yang sama untuk awal dan semua rute',()=>{
  const loader=read('src/components/LoadingIndicator.jsx');
  assert.ok(loader.includes('useLocation'));
  assert.ok(loader.includes('matra-unified-loading'));
  assert.ok(loader.includes('loading-yellow.svg'));
  assert.ok(loader.includes('[location.pathname]'));
  assert.ok(loader.includes('clearTimeout(timeout)'));
});

test('Loading memakai kuning identitas MATRA dan punya alternatif reduced-motion',()=>{
  const css=read('src/styles/loading.css');
  const svg=read('public/assets/loading/loading-yellow.svg');
  assert.match(svg,/#FFDD00/i);
  assert.match(svg,/animate/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.ok(read('src/main.jsx').includes("import './styles/loading.css'"));
  assert.ok(read('src/components/LoadingIndicator.jsx').includes('prefers-reduced-motion: reduce'));
});

test('Seluruh komponen sebelumnya dipertahankan tanpa penambahan dependensi',()=>{
  const pkg=JSON.parse(read('package.json'));
  assert.equal(pkg.version,'6.7.0');
  assert.deepEqual(Object.keys(pkg.dependencies).sort(),['lucide-react','react','react-dom','react-router-dom'].sort());
  assert.deepEqual(Object.keys(pkg.devDependencies).sort(),['@vitejs/plugin-react','autoprefixer','postcss','tailwindcss','vite','typescript'].sort());
});
