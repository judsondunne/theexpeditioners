/** Trace the original paperback's white lettering to a scalable, single-ink logo. */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const {data,info}=await sharp('assets-src/covers/book-1-front.jpg').removeAlpha().raw().toBuffer({resolveWithObject:true});
const x0=60,y0=105,w=800,h=285,mask=new Uint8Array(w*h);
for(let y=0;y<h;y++)for(let x=0;x<w;x++){
 const p=((y+y0)*info.width+x+x0)*info.channels;
 const rgb=[data[p],data[p+1],data[p+2]];
 if(Math.min(...rgb)>228&&Math.max(...rgb)-Math.min(...rgb)<18&&!(y+y0>332&&x+x0>350&&x+x0<560))mask[y*w+x]=1;
}
// Discard tiny compression flecks; preserve letter counters as separate contours.
const seen=new Uint8Array(w*h);
for(let p=0;p<mask.length;p++)if(mask[p]&&!seen[p]){
 const cells=[p];seen[p]=1;
 for(let i=0;i<cells.length;i++){
  const c=cells[i],x=c%w,y=Math.floor(c/w);
  for(const n of [x?c-1:-1,x<w-1?c+1:-1,y?c-w:-1,y<h-1?c+w:-1])if(n>=0&&mask[n]&&!seen[n]){seen[n]=1;cells.push(n);}
 }
 if(cells.length<35)for(const c of cells)mask[c]=0;
}
const edges=new Map();const edge=(a,b)=>edges.set(a,b);const key=(x,y)=>y*(w+1)+x;
for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){
 if(!y||!mask[(y-1)*w+x])edge(key(x,y),key(x+1,y));
 if(x===w-1||!mask[y*w+x+1])edge(key(x+1,y),key(x+1,y+1));
 if(y===h-1||!mask[(y+1)*w+x])edge(key(x+1,y+1),key(x,y+1));
 if(!x||!mask[y*w+x-1])edge(key(x,y+1),key(x,y));
}
const paths=[];
while(edges.size){const start=edges.keys().next().value;let p=start;const points=[];
 do{points.push([p%(w+1),Math.floor(p/(w+1))]);const next=edges.get(p);edges.delete(p);p=next;}while(p!==undefined&&p!==start);
 if(points.length<4)continue;
 const keep=points.filter((v,i)=>{const a=points[(i+points.length-1)%points.length],b=points[(i+1)%points.length];return (v[0]-a[0])*(b[1]-v[1])!==(v[1]-a[1])*(b[0]-v[0]);});
 paths.push('M'+keep.map(p=>p.join(' ')).join('L')+'Z');
}
await mkdir('public/images/brand',{recursive:true});
await writeFile('public/images/brand/expeditioners-lettering.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><title>The Expeditioners — original cover lettering</title><path fill="currentColor" fill-rule="evenodd" d="${paths.join('')}"/></svg>`);
