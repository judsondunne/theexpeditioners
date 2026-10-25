/** Prebuild display sizes of existing artwork; preserve the original source files. */
import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root=process.cwd();
const destination=join(root,"public/images/optimized");
await mkdir(destination,{recursive:true});
const sources=(await readdir(join(root,"public/images/engravings"))).filter(file=>file.endsWith(".webp"));
const work=[];
for(const file of sources) for(const width of [96,192,240,480,720]) work.push(async()=>{
  await sharp(join(root,"public/images/engravings",file)).resize({width,withoutEnlargement:true}).webp({quality:72,alphaQuality:90,effort:4}).toFile(join(destination,`${file.slice(0,-5)}-${width}.webp`));
});
for(const width of [640,960,1440,1920]) work.push(async()=>{
  await sharp(join(root,"public/images/maps/world-1865.webp")).resize({width,withoutEnlargement:true}).flatten({background:"#ffffff"}).webp({quality:56,effort:5}).toFile(join(destination,`hero-map-${width}.webp`));
});
for(let i=0;i<work.length;i+=4) await Promise.all(work.slice(i,i+4).map(run=>run()));
console.log(`Prepared ${work.length} responsive artwork files. Originals are unchanged.`);
