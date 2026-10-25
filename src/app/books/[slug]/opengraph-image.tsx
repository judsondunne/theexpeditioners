import { ImageResponse } from "next/og";
import { books, getBook, ordinal } from "@/content/books";
import { ogFonts, ogImage, ogSize } from "@/lib/og";

export const alt = "Cover of an Expeditioners book";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug) ?? books[0];
  const [fonts, cover] = await Promise.all([ogFonts(), ogImage(`og/book-${book.number}.jpg`)]);
  const p = book.palette;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: p.deep, color: "#efe6d4", fontFamily: "Newsreader", position: "relative" }}>
        <div style={{ position: "absolute", top: 18, left: 18, right: 18, bottom: 18, border: "1px solid rgba(239,230,212,0.3)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px 0 72px", width: 760 }}>
          <div style={{ fontFamily: "Plex Mono", fontSize: 18, letterSpacing: 3.5, textTransform: "uppercase", color: p.accent }}>
            {`Book ${ordinal(book.number)} of three`}
          </div>
          <div style={{ fontFamily: "League Gothic", fontSize: 64, textTransform: "uppercase", marginTop: 24, lineHeight: 1 }}>The Expeditioners</div>
          <div style={{ fontStyle: "italic", fontSize: 36, color: "rgba(239,230,212,0.8)", marginTop: 6 }}>and</div>
          <div style={{ fontSize: 60, lineHeight: 1.04, marginTop: 4 }}>{book.title.replace(/^The /, "the ")}</div>
          <div style={{ fontFamily: "Plex Mono", fontSize: 17, letterSpacing: 2.5, textTransform: "uppercase", marginTop: 30, color: "rgba(239,230,212,0.7)" }}>
            By S. S. Taylor · Illustrated by Katherine Roy
          </div>
        </div>
        <img
          src={cover}
          alt=""
          width={300}
          height={464}
          style={{ position: "absolute", right: 96, top: 83, transform: "rotate(3deg)", boxShadow: "0 30px 50px rgba(0,0,0,0.6)" }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
