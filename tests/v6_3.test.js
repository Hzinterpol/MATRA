import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('Beranda ditampilkan secara eksplisit sebelum peta menu pada desktop dan mobile',()=>{
  const layout=read('src/components/Layouts.jsx');
  const nav=layout.slice(layout.indexOf('<nav aria-label="Navigasi utama"'),layout.indexOf('</nav>')+6);
  const mobile=layout.slice(layout.indexOf('aria-label="Navigasi mobile"'),layout.indexOf('</nav>',layout.indexOf('aria-label="Navigasi mobile"')));
  for(const view of [nav,mobile]){
    assert.match(view,/<NavLink to="\/" end aria-label="Beranda MATRA"/);
    assert.ok(view.indexOf('>Beranda</NavLink>')<view.indexOf('{publicMenu.map'));
    assert.match(view,/n\.to==='\/'\?null/);
  }
  assert.match(layout,/v6\.5/);
});

test('Sistem loading memakai satu animasi yang sama pada awal dan perpindahan halaman',()=>{
  const code=read('src/components/LoadingIndicator.jsx');
  assert.match(code,/LOADING_DURATION=1100/);
  assert.match(code,/loading-yellow\.svg/);
  assert.match(code,/\[location\.key\]/);
  assert.match(code,/clearTimeout\(timeout\)/);
  assert.doesNotMatch(code,/matra-route-progress|matra-preloader/);
});

test('SVG loading berasal dari Lottie dan menggunakan kuning brand MATRA',()=>{
  const css=read('src/styles/loading.css');
  const svg=read('public/assets/loading/loading-yellow.svg');
  assert.match(css,/\.matra-unified-loading\{/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(svg,/#FFDD00/i);
  assert.match(svg,/repeatCount="indefinite"/);
});
