import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read = f => fs.readFileSync(path.join(process.cwd(),f),'utf8');

test('Lottie kuning dan ekspor SVG yang dapat diputar offline tersedia',()=>{
 const svg=read('public/assets/loading/loading-yellow.svg');
 assert.match(svg,/#FFDD00/i);
 assert.equal((svg.match(/<circle /g)||[]).length,3);
 assert.equal((svg.match(/repeatCount="indefinite"/g)||[]).length,6);
 assert.ok(fs.statSync('public/assets/loading/loading-yellow.lottie').size>500);
});
test('Intro dan perpindahan memakai durasi dan visual yang identik',()=>{
 const src=read('src/components/LoadingIndicator.jsx');
 assert.match(src,/LOADING_DURATION=1100/);
 assert.match(src,/src="\/assets\/loading\/loading-yellow.svg"/);
 assert.match(src,/\[location\.key\]/);
 assert.match(src,/setLoading\(true\)/);
 assert.match(src,/setLoading\(false\)/);
 assert.doesNotMatch(src,/route-progress|preloader-ring|preloader-brand|NAV_DURATION|INTRO_DURATION/);
});
test('Animasi loading tidak memerlukan library tambahan',()=>{
 const pkg=JSON.parse(read('package.json'));
 assert.equal(pkg.version,'6.5.0');
 assert.deepEqual(Object.keys(pkg.dependencies).sort(),['lucide-react','react','react-dom','react-router-dom'].sort());
 assert.match(read('src/styles/loading.css'),/prefers-reduced-motion/);
});
test('Karakter hero berada di depan lingkaran',()=>{
 const css=read('src/styles/v5.css');
 const home=read('src/components/HomeExperience.jsx');
 assert.match(css,/hero-artwork-disc,.about-illustration-halo\{z-index:0/);
 assert.match(css,/hero-main-webp,.about-illustration-webp\{position:relative;z-index:5/);
 assert.match(home,/hero-main-webp relative z-\[5\]/);
 assert.match(home,/about-illustration-webp relative z-\[5\]/);
});
test('Tidak ada garis progress lama atau logo pada overlay baru',()=>{
 const css=read('src/styles/loading.css');
 const src=read('src/components/LoadingIndicator.jsx');
 assert.doesNotMatch(css,/matra-route-progress|matra-intro-track|matra-preloader-ring/);
 assert.doesNotMatch(src,/matra-logo.svg/);
 assert.match(read('src/components/Layouts.jsx'),/v6\.5/);
});
