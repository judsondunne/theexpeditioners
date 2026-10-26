"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { OriginalMap } from "@/components/explore/OriginalMap";
import type { CanyonHandle } from "@/components/three/canyon-scene";

export interface MapPlace { name: string; x: number; y: number }
type Props = {
  src: string; width: number; height: number; crop: number;
  places: readonly MapPlace[]; alt: string; credit: string; compact?: boolean;
};

export function MapRoom({ compact = false, ...props }: Props) {
  const { places, src, alt, credit } = props;
  const container = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handle = useRef<CanyonHandle | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<"relief" | "paper">("relief");
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const choose = useCallback((index: number) => {
    setSelected(index);handle.current?.focus(index);
  }, []);

  const failed = status === "failed";
  useEffect(() => {
    const el = container.current;
    if (!el || mode !== "relief" || failed) return;
    let cancelled = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void (async () => {
        try {
          const { createCanyon } = await import("@/components/three/canyon-scene");
          if (cancelled) return;
          handle.current = createCanyon({ container: el, places, markers: markerRefs.current, onFailure: () => setStatus("failed"), compact });
          setStatus("ready");
        } catch { if (!cancelled) setStatus("failed"); }
      })();
    }, { rootMargin: "250px" });
    observer.observe(el);
    return () => { cancelled = true; observer.disconnect();handle.current?.destroy();handle.current = null; };
  }, [places, compact, mode, failed]);

  return (
    <div className={`canyon-room ${compact ? "canyon-room--compact" : ""}`}>
      {!compact && <div className="canyon-toolbar">
        <div className="flex items-center gap-3"><span aria-hidden="true" className="canyon-status-light" /><span className="label">Drowned Man&rsquo;s Canyon</span></div>
        <div className="flex gap-1" role="group" aria-label="Map display">
          <button type="button" aria-pressed={mode === "relief"} onClick={() => { if (mode !== "relief") { setMode("relief");setStatus("loading");setSelected(null); } }} className="canyon-mode">3D relief</button>
          <button type="button" aria-pressed={mode === "paper"} onClick={() => setMode("paper")} className="canyon-mode">Original map</button>
        </div>
      </div>
      }
      {mode === "paper" || status === "failed" ? (
        <div className="bg-[#21151a] p-3 md:p-6">
          {status === "failed" && <p role="status" className="mb-4 text-cream/75">The 3D view is unavailable on this device. Explore the original map below.</p>}
          <OriginalMap {...props} />
        </div>
      ) : (
        <div className="canyon-layout">
          <div ref={container} className="canyon-viewport" aria-label="Interactive three-dimensional canyon terrain">
            {status === "loading" && <div className="canyon-loading"><Image src={src} alt={alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover opacity-35" /><p className="label relative z-10">Opening the canyon…</p></div>}
            <div className="canyon-markers" aria-label="Locations on the terrain" style={{ visibility: status === "ready" ? "visible" : "hidden" }}>
              {places.map((place, i) => <button key={place.name} ref={el => {markerRefs.current[i] = el;}} type="button" className="canyon-pin" aria-label={`Explore ${place.name}`} aria-pressed={selected === i} onClick={() => choose(i)}><span className="canyon-pin-number">{String(i + 1).padStart(2, "0")}</span><span className="canyon-pin-name">{place.name}</span></button>)}
            </div>
            <span aria-hidden="true" className="canyon-north">N <span>↑</span></span>
            <div className="canyon-controls" role="group" aria-label="Canyon camera controls">
              <button type="button" disabled={status !== "ready"} onClick={() => handle.current?.zoom(.8)} aria-label="Zoom in">+</button>
              <button type="button" disabled={status !== "ready"} onClick={() => handle.current?.zoom(1.25)} aria-label="Zoom out">−</button>
              <button type="button" disabled={status !== "ready"} onClick={() => {handle.current?.reset();setSelected(null);}} aria-label="Reset canyon view">↺</button>
              <button type="button" disabled={status !== "ready"} onClick={() => handle.current?.top()} aria-label="View canyon from above">⌑</button>
            </div>
            <p className="canyon-gesture label">Drag to look around · scroll or pinch to zoom</p>
          </div>
          {!compact && <aside className="canyon-index" aria-label="Canyon locations">
            <p className="label text-[#bd9367] mb-5">Ten places to discover</p>
            <ol>{places.map((place,i)=><li key={place.name}><button type="button" disabled={status !== "ready"} aria-label={place.name} aria-pressed={selected === i} onClick={()=>choose(i)}><span className="label">{String(i+1).padStart(2,"0")}</span><span>{place.name}</span><span aria-hidden="true">↗</span></button></li>)}</ol>
            <p className="mt-6 text-sm leading-relaxed text-cream/50">A relief interpretation of Katherine Roy&rsquo;s map. The heights and terrain are imagined.</p>
          </aside>}
        </div>
      )}
      {!compact && <div className="canyon-caption"><p>{credit}</p><p aria-live="polite">{selected !== null ? places[selected].name : "Follow the water. Find your bearings."}</p></div>}
    </div>
  );
}
