import { ImageResponse } from "next/og";
import { ogFonts, ogImage, ogSize } from "@/lib/og";

export const alt = "The Expeditioners — an illustrated adventure trilogy by S. S. Taylor, illustrated by Katherine Roy";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const [fonts, bg, b1, b2, b3] = await Promise.all([
    ogFonts(),
    ogImage("og/world-paper.jpg"),
    ogImage("og/book-1.jpg"),
    ogImage("og/book-2.jpg"),
    ogImage("og/book-3.jpg"),
  ]);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", color: "#1d1915", fontFamily: "Newsreader" }}>
        <img src={bg} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
        <div style={{ position: "absolute", top: 18, left: 18, right: 18, bottom: 18, border: "1px solid rgba(74,55,38,0.5)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", width: 640 }}>
          <div style={{ fontFamily: "Plex Mono", fontSize: 18, letterSpacing: 3.5, textTransform: "uppercase", color: "#4b4136" }}>
            An illustrated adventure trilogy
          </div>
          <div style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: 40, marginTop: 22, color: "#4b4136" }}>The</div>
          <div style={{ fontFamily: "League Gothic", fontSize: 124, lineHeight: 0.9, textTransform: "uppercase" }}>Expeditioners</div>
          <div style={{ fontSize: 34, marginTop: 20, lineHeight: 1.2, maxWidth: 520 }}>What if the maps of the world were all wrong?</div>
          <div style={{ fontFamily: "Plex Mono", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", marginTop: 26, color: "#4b4136" }}>
            By S. S. Taylor · Illustrated by Katherine Roy
          </div>
        </div>
        <div style={{ position: "absolute", right: 56, top: 120, display: "flex" }}>
          {[b3, b2, b1].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              width={196}
              height={303}
              style={{
                marginLeft: i === 0 ? 0 : -96,
                transform: `rotate(${(i - 2) * 5}deg) translateY(${(2 - i) * 18}px)`,
                boxShadow: "0 24px 40px rgba(29,25,21,0.45)",
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
