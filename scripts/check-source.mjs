import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
const root=process.cwd();
const walk=(folder)=>fs.readdirSync(folder,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(folder,x.name)):[path.join(folder,x.name)]);
const files=walk(path.join(root,'src')).filter(x=>/\.(js|jsx)$/.test(x));
let errors=0;
for(const file of files){
 const code=fs.readFileSync(file,'utf8');
 const syntax=ts.createSourceFile(file,code,ts.ScriptTarget.ES2022,true,file.endsWith('.jsx')?ts.ScriptKind.JSX:ts.ScriptKind.JS);
 for(const diagnostic of syntax.parseDiagnostics){const pos=syntax.getLineAndCharacterOfPosition(diagnostic.start);console.error(`${path.relative(root,file)}:${pos.line+1}:${pos.character+1} — ${ts.flattenDiagnosticMessageText(diagnostic.messageText,' ')}`);errors++;}
 for(const match of code.matchAll(/from\s+['"](\.[^'"]+)['"]/g)){
  const target=path.resolve(path.dirname(file),match[1]);
  if(!['','.js','.jsx','/index.js','/index.jsx'].some(ext=>fs.existsSync(target+ext))){console.error(`Import tidak ditemukan: ${file} → ${match[1]}`);errors++;}
 }
}
for(const asset of ['matra-logo.svg','campus-illustration.svg','icon-building.svg','icon-monitor.svg','icon-book.svg','icon-info.svg'])if(!fs.existsSync(path.join(root,'public','assets',asset))){console.error(`Asset hilang: ${asset}`);errors++;}
const publicMap=fs.readFileSync(path.join(root,'src','data','sitemap.js'),'utf8');
const pj=fs.readFileSync(path.join(root,'src','pages','PJPages.jsx'),'utf8');
const admin=fs.readFileSync(path.join(root,'src','pages','AdminPages.jsx'),'utf8');
const groups=[...publicMap.matchAll(/\['([^']+)','(\/pj\/[^']+|\/admin\/[^']+)'\]/g)];
for(const [,label,route] of groups){
 if(route.includes('/pj/pengajuan/REQ-'))continue;
 const source=route.startsWith('/pj/')?pj:admin;
 if(!source.includes(`case '${route}'`)){console.error(`Jalur sitemap tidak tertangani: ${label}: ${route}`);errors++;}
}
console.log(`Diperiksa ${files.length} berkas source dan ${groups.length} entri dashboard. Kesalahan: ${errors}`);
process.exitCode=errors?1:0;
