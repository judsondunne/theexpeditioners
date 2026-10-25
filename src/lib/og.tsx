import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared assets for generated social images (Open Graph / Twitter cards).
 * Fonts are the site's own typefaces as TTF (the OG renderer can't read WOFF2).
 */
/** Reads a file from assets-src/ (statically scoped so only that folder is traced into the server bundle). */
const read = (p: string) => readFile(join(process.cwd(), "assets-src", p));

export const ogSize = { width: 1200, height: 630 };

export async function ogFonts() {
  const [league, serif, serifItalic, mono] = await Promise.all([
    read("fonts/league-gothic.ttf"),
    read("fonts/newsreader.ttf"),
    read("fonts/newsreader-italic.ttf"),
    read("fonts/plex-mono-medium.ttf"),
  ]);
  return [
    { name: "League Gothic", data: league, weight: 400 as const, style: "normal" as const },
    { name: "Newsreader", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Newsreader", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "Plex Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

/** `path` is relative to assets-src/, e.g. "og/book-1.jpg". */
export async function ogImage(path: string, mime = "image/jpeg") {
  const data = await read(path);
  return `data:${mime};base64,${data.toString("base64")}`;
}
