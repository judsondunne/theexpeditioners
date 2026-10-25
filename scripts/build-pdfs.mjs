// Renders printable pages to PDF files in public/downloads.
// Usage: node scripts/build-pdfs.mjs [baseUrl]   (needs a running dev or production server)
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const jobs = [{ path: "/educators/field-sheet", out: "public/downloads/mapmakers-field-sheet.pdf" }];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const job of jobs) {
  await page.goto(base + job.path, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: job.out, format: "Letter", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log("wrote", job.out);
}
await browser.close();
