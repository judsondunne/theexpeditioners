/** Validate the maintained smooth vector masters; never retrace JPEG pixel edges. */
import { readFile } from "node:fs/promises";
import sharp from "sharp";
for (const name of ["expeditioners-lettering", "expeditioners-compact"]) {
  const path = `public/images/brand/${name}.svg`;
  const svg = await readFile(path, "utf8");
  if ((svg.match(/viewBox=/g) ?? []).length !== 1 || !svg.includes(" C ")) throw new Error(`Invalid curve master: ${path}`);
  await sharp(Buffer.from(svg)).metadata();
  console.log(`Validated ${path}`);
}
