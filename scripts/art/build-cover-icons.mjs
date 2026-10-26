/** Use the complete Book One cover for browser and home-screen icons. */
import sharp from "sharp";
import { writeFile, rm } from "node:fs/promises";
const cover = "public/images/covers/book-1-front.jpg";
async function thumbnail(size, padding = 0) {
  const image = await sharp(cover).resize({ width: size - padding * 2, height: size - padding * 2, fit: "inside" }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: image, gravity: "centre" }]).png().toBuffer();
}
await writeFile("src/app/icon.png", await thumbnail(256, 4));
await writeFile("src/app/apple-icon.png", await thumbnail(180, 4));
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => thumbnail(size)));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (let i = 0; i < sizes.length; i++) {
  const at = 6 + i * 16;
  header[at] = sizes[i]; header[at + 1] = sizes[i];
  header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(images[i].length, at + 8); header.writeUInt32LE(offset, at + 12);
  offset += images[i].length;
}
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...images]));
await rm("src/app/icon.svg", { force: true });
