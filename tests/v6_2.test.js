import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const search=read('src/components/GlobalSearch.jsx');
const auth=read('src/pages/AuthPages.jsx');
const css=read('src/index.css');

test('Popup pencarian dipindah ke body via React portal dan bebas dari sticky header',()=>{
 assert.match(search,/import \{createPortal\} from 'react-dom'/);
 assert.match(search,/createPortal\(/);
 assert.match(search,/,document\.body\)\s*:\s*null/);
 assert.match(search,/fixed inset-0 z-\[300\]/);
 assert.match(read('src/components/Layouts.jsx'),/backdrop-blur-md/);
});
test('Overlay popup mengunci background dan memulihkan overflow saat ditutup',()=>{
 assert.match(search,/document\.body\.style\.overflow='hidden'/);
 assert.match(search,/document\.documentElement\.style\.overflow='hidden'/);
 assert.match(search,/document\.body\.style\.overflow=bodyOverflow/);
 assert.match(search,/document\.documentElement\.style\.overflow=htmlOverflow/);
 assert.match(search,/onMouseDown=\{e=>\{if\(e\.target===e\.currentTarget\)closeSearch\(\)\}\}/);
});
test('Pencarian menyediakan fokus input, penutupan Escape dan navigasi keyboard',()=>{
 assert.match(search,/inputRef\.current\?\.focus\(\)/);
 assert.match(search,/if\(e\.key==='Escape'\)/);
 assert.match(search,/if\(e\.key!=='Tab'/);
 assert.match(search,/ArrowDown/);
 assert.match(search,/ArrowUp/);
 assert.match(search,/Enter/);
 assert.match(search,/aria-modal="true"/);
 assert.match(search,/aria-haspopup="dialog"/);
});
test('Focus ring sekarang mengikuti satu bidang pencarian, bukan input yang terpotong',()=>{
 assert.match(css,/\.matra-search-field:focus-within/);
 assert.match(css,/\.matra-search-input:focus-visible/);
 assert.match(css,/\.matra-search-panel\{max-height:calc\(100dvh - 48px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('Tulisan peringatan demo yang mengganggu sudah dihapus dari tampilan PJ dan Admin',()=>{
 assert.doesNotMatch(auth,/Akses ini merupakan demonstrasi frontend/);
 assert.doesNotMatch(auth,/Jangan gunakan kode, email, atau kata sandi kampus/);
 assert.doesNotMatch(auth,/Jangan gunakan password akun kampus sungguhan/);
 assert.match(auth,/Masuk sebagai PJ/);
 assert.match(auth,/Masuk sebagai Admin/);
});
test('Dependensi tidak berubah dan versi patch v6.2 dapat menimpa v6.1',()=>{
 const pkg=JSON.parse(read('package.json'));
 assert.equal(pkg.version,'6.5.0');
 assert.deepEqual(Object.keys(pkg.dependencies).sort(),['lucide-react','react','react-dom','react-router-dom'].sort());
});
