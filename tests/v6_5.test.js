import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const names=['main.webp','kenali-matra.webp','ruang-kuliah.webp','lab-komputer.webp','layanan-kampus.webp','layanan-akademik.webp','informasi-laboratorium.webp','bantuan-peminjaman-ruangan.webp'];
test('Kedelapan WebP tersedia di public dan src, tidak ada file kosong',()=>{
 for(const name of names){
  for(const folder of ['src/assets/ilustrasi','public/assets/ilustrasi']){
   const fp=path.join(root,folder,name);
   assert.ok(statSync(fp).size>1000, fp);
   const buff=readFileSync(fp);assert.equal(buff.subarray(0,4).toString(),'RIFF');assert.equal(buff.subarray(8,12).toString(),'WEBP');
  }
 }
});
test('Beranda menggunakan import statis yang ikut build Vite',()=>{
 const s=read('src/components/HomeExperience.jsx');
 assert.match(s,/import mainIllustration from '\.\.\/assets\/ilustrasi\/main\.webp'/);
 assert.match(s,/import aboutIllustration from '\.\.\/assets\/ilustrasi\/kenali-matra\.webp'/);
 assert.match(s,/src=\{mainIllustration\}/);
 assert.match(s,/src=\{aboutIllustration\}/);
 assert.doesNotMatch(s,/src="\/assets\/ilustrasi\/(main|kenali-matra)\.webp"/);
});
test('MediaFrame bundling illustrations and fallback on error',()=>{
 const s=read('src/components/MediaFrame.jsx');
 assert.match(s,/import roomIllustration from/);
 assert.match(s,/import labIllustration from/);
 assert.match(s,/onError=\{\(\)=>setIllustrationFailed\(true\)\}/);
 assert.match(s,/!showIllustration/);
});
test('Version marker and existing loader remain intact',()=>{
 assert.equal(JSON.parse(read('package.json')).version,'6.7.0');
 assert.match(read('src/components/Layouts.jsx'),/v6\.7/);
 assert.match(read('src/components/LoadingIndicator.jsx'),/loading-yellow\.svg/);
});
