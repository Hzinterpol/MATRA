import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const assets=['main.webp','kenali-matra.webp','ruang-kuliah.webp','lab-komputer.webp','layanan-kampus.webp','layanan-akademik.webp','informasi-laboratorium.webp','bantuan-peminjaman-ruangan.webp'];

test('Aset dari RAR tersedia sebagai delapan berkas WebP lokal yang valid',()=>{
 for(const f of assets){
  const buf=fs.readFileSync(path.join(root,'public/assets/images',f));
  assert.ok(buf.length>1000,f);
  assert.equal(buf.toString('ascii',0,4),'RIFF',f);
  assert.equal(buf.toString('ascii',8,12),'WEBP',f);
 }
});

test('Ilustrasi utama dan Kenali MATRA memakai WebP lokal, bukan SVG rusak',()=>{
 const src=read('src/components/HomeExperience.jsx');
 assert.ok(src.includes('src="/assets/images/main.webp"'));
 assert.ok(src.includes('src="/assets/images/kenali-matra.webp"'));
 assert.ok(!src.includes('src="/assets/campus-illustration.svg"'));
 assert.ok(!src.includes('src="/assets/classroom-illustration.svg"'));
});

test('Kartu ruang, lab, layanan menggunakan WebP dan fallback dari aset pengguna',()=>{
 const src=read('src/components/MediaFrame.jsx');
 for(const name of assets.slice(2))assert.ok(src.includes(`/assets/images/${name}`),name);
 assert.ok(src.includes('onError={onImageError}'));
 assert.ok(src.includes('setCurrent(backup)'));
 assert.ok(src.includes('object-contain'));
});

test('Slot foto manual memakai ekstensi WebP dan dokumentasi pemasangan tersedia',()=>{
 const src=read('src/components/MediaFrame.jsx');
 const guide=read('public/assets/foto/PANDUAN-FOTO.md');
 for(const ext of ['.jpg','.png','.jpeg'])assert.ok(!src.includes(ext));
 for(const f of ['kategori/ruang-kuliah.webp','ruang/gds-517.webp','lab/gds-507.webp','layanan/layanan-akademik.webp'])assert.ok(guide.includes(f));
 assert.ok(read('UPGRADE-v5.1.md').includes('npm run dev'));
});
