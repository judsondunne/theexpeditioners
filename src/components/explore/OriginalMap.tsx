"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/cn";

export interface MapPlace {
  name: string;
  x: number;
  y: number;
}

/**
 * The Map Room: Katherine Roy's map of Drowned Man's Canyon, zoomable and
 * pannable, with a legend of the places labelled on the map itself. It adds
 * no lore — selecting a place only flies to its label.
 *
 * Controls: buttons, drag to pan, arrow keys / + / − when focused, pinch on
 * touch devices. The wheel is left alone so the page always scrolls.
 */
export function OriginalMap({
  src,
  width,
  height,
  crop,
  places,
  alt,
  credit,
}: {
  src: string;
  width: number;
  height: number;
  /** Fraction of the image height to show (the scan fades out at the bottom). */
  crop: number;
  places: readonly MapPlace[];
  alt: string;
  credit: string;
}) {
  const [view, setView] = useState({ scale: 1, x: 0.5, y: crop / 2 });
  const [selected, setSelected] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; sx: number; sy: number; vx: number; vy: number } | null>(null);
  const pinch = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ d: number; scale: number } | null>(null);

  const visH = crop; // visible fraction of image height
  const clampView = useCallback(
    (v: { scale: number; x: number; y: number }) => {
      const scale = Math.min(4, Math.max(1, v.scale));
      const halfW = 0.5 / scale;
      const halfH = (visH * 0.5) / scale;
      return {
        scale,
        x: Math.min(1 - halfW, Math.max(halfW, v.x)),
        y: Math.min(visH - halfH, Math.max(halfH, v.y)),
      };
    },
    [visH],
  );

  const zoom = (factor: number) => setView((v) => clampView({ ...v, scale: v.scale * factor }));
  const reset = () => {
    setSelected(null);
    setView(clampView({ scale: 1, x: 0.5, y: visH / 2 }));
  };
  const flyTo = (p: MapPlace) => {
    setSelected(p.name);
    setView(clampView({ scale: 2.6, x: p.x, y: p.y }));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 2) {
      const [a, b] = Array.from(pinch.current.values());
      pinchStart.current = { d: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
      drag.current = null;
      return;
    }
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pinch.current.has(e.pointerId)) pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 2 && pinchStart.current) {
      const [a, b] = Array.from(pinch.current.values());
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const start = pinchStart.current;
      setView((v) => clampView({ ...v, scale: start.scale * (d / start.d) }));
      return;
    }
    const dr = drag.current;
    const el = frame.current;
    if (!dr || !el || dr.id !== e.pointerId) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - dr.sx) / rect.width / view.scale;
    const dy = ((e.clientY - dr.sy) / rect.height) * visH / view.scale;
    setView((v) => clampView({ ...v, x: dr.vx - dx, y: dr.vy - dy }));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    pinch.current.delete(e.pointerId);
    if (pinch.current.size < 2) pinchStart.current = null;
    if (drag.current?.id === e.pointerId) drag.current = null;
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.08 / view.scale;
    const map: Record<string, () => void> = {
      ArrowLeft: () => setView((v) => clampView({ ...v, x: v.x - step })),
      ArrowRight: () => setView((v) => clampView({ ...v, x: v.x + step })),
      ArrowUp: () => setView((v) => clampView({ ...v, y: v.y - step * visH })),
      ArrowDown: () => setView((v) => clampView({ ...v, y: v.y + step * visH })),
      "+": () => zoom(1.4),
      "=": () => zoom(1.4),
      "-": () => zoom(1 / 1.4),
      "0": reset,
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  // translate so (view.x, view.y) sits in the centre of the frame
  const tx = (0.5 - view.x * view.scale) * 100;
  const ty = ((visH * 0.5 - view.y * view.scale) / visH) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-9">
        <div className="border border-cream/30 p-1.5">
          <div
            ref={frame}
            role="application"
            aria-roledescription="zoomable map"
            aria-label={`${alt}. Use the arrow keys to pan, plus and minus to zoom, and 0 to reset.`}
            tabIndex={0}
            onKeyDown={onKey}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={cn(
              "relative w-full touch-pan-y overflow-hidden bg-[#efe3cf] outline-none focus-visible:ring-2 focus-visible:ring-signal",
              view.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
            )}
            style={{ aspectRatio: `${width} / ${height * crop}`, touchAction: view.scale > 1 ? "none" : "pan-y" }}
            onDoubleClick={() => zoom(1.6)}
          >
            <div
              className="absolute left-0 top-0 origin-top-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: "100%",
                height: `${100 / crop}%`,
                transform: `translate(${tx}%, ${ty * crop}%) scale(${view.scale})`,
              }}
            >
              <Image src={src} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="select-none object-cover [filter:contrast(1.18)_saturate(1.12)]" draggable={false} />
              {places.map((p) => (
                <span
                  key={p.name}
                  aria-hidden="true"
                  className={cn(
                    "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300",
                    selected === p.name
                      ? "scale-100 border-rust bg-rust/30 shadow-[0_0_0_6px_rgba(163,60,38,0.18)]"
                      : "scale-0 border-transparent",
                  )}
                  style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <p className="label text-cream/55">{credit}</p>
          <div className="flex items-center gap-2" role="group" aria-label="Map controls">
            <button type="button" onClick={() => zoom(1.4)} className="label-lg h-10 w-10 border border-cream/40 hover:bg-cream hover:text-ink" aria-label="Zoom in">
              +
            </button>
            <button type="button" onClick={() => zoom(1 / 1.4)} className="label-lg h-10 w-10 border border-cream/40 hover:bg-cream hover:text-ink" aria-label="Zoom out">
              −
            </button>
            <button type="button" onClick={reset} className="label h-10 border border-cream/40 px-4 hover:bg-cream hover:text-ink">
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <p className="plate-caps border-b border-cream/25 pb-3 text-[0.95rem] text-cream/80">Labelled on the map</p>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
          {places.map((p) => (
            <li key={p.name}>
              <button
                type="button"
                onClick={() => flyTo(p)}
                aria-pressed={selected === p.name}
                className={cn(
                  "group flex w-full items-center gap-3 border-b border-cream/12 py-2.5 text-left font-serif text-[1.02rem] transition-colors",
                  selected === p.name ? "text-cream" : "text-cream/65 hover:text-cream",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", selected === p.name ? "bg-rust" : "bg-cream/30 group-hover:bg-cream/60")}
                />
                {p.name}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.92rem] italic leading-snug text-cream/55">
          Place names exactly as Katherine Roy lettered them. What happens there, you&rsquo;ll have to read to find out.
        </p>
      </div>
    </div>
  );
}
