"use client";

import { useEffect, useRef, useState } from "react";
import type { Segment } from "@/lib/meridian/segments";

type Building = { x: number; w: number; h: number; spire?: number };

/** One consistent skyline silhouette, recolored per segment — same idea as a
 * city photographed at different times of day, not a different city each time. */
const BUILDINGS: Building[] = [
  { x: 6, w: 24, h: 62 },
  { x: 36, w: 16, h: 98 },
  { x: 58, w: 26, h: 54 },
  { x: 90, w: 18, h: 86 },
  { x: 114, w: 10, h: 150, spire: 26 },
  { x: 130, w: 30, h: 118 },
  { x: 168, w: 20, h: 68 },
  { x: 194, w: 26, h: 92 },
  { x: 226, w: 16, h: 56 },
  { x: 248, w: 30, h: 106 },
  { x: 284, w: 22, h: 74 },
  { x: 312, w: 18, h: 96 },
  { x: 336, w: 28, h: 60 },
  { x: 370, w: 20, h: 84 },
];

function Skyline({ fill, accent, litRatio }: { fill: string; accent: string; litRatio: number }) {
  return (
    <g>
      {BUILDINGS.map((b, i) => (
        <g key={i}>
          {b.spire && (
            <rect x={b.x + b.w / 2 - 1} y={200 - b.h - b.spire} width={2} height={b.spire} fill={fill} />
          )}
          <rect x={b.x} y={200 - b.h} width={b.w} height={b.h} fill={fill} />
          {Array.from({ length: Math.floor(b.h / 16) }, (_, row) =>
            Array.from({ length: Math.max(1, Math.floor(b.w / 10)) }, (_, col) => {
              const lit = (row * 7 + col * 3 + i * 5) % 10 < litRatio * 10;
              if (!lit) return null;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={b.x + 4 + col * 9}
                  y={200 - b.h + 8 + row * 16}
                  width={3.5}
                  height={5}
                  fill={accent}
                  opacity={0.85}
                />
              );
            }),
          )}
        </g>
      ))}
    </g>
  );
}

function horizonSvg(segment: Segment) {
  // tint the silhouette toward the segment's own palette instead of flat black —
  // same skyline, recolored per time of day — but keep it dark enough to read
  // as a silhouette against whatever's behind it
  const fill = `color-mix(in srgb, ${segment.gradient[0]} 45%, black)`;
  // more lit windows after dark, fewer in daylight
  const litRatio = segment.id === "lateNight" || segment.id === "evening" ? 0.55 : 0.22;

  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="w-full h-full">
      <Skyline fill={fill} accent={segment.accent} litRatio={litRatio} />
    </svg>
  );
}

export function Horizon({ segment }: { segment: Segment }) {
  const [layers, setLayers] = useState<{ id: string; node: React.ReactNode; visible: boolean }[]>([
    { id: segment.id, node: horizonSvg(segment), visible: true },
  ]);
  const prev = useRef(segment.id);

  useEffect(() => {
    if (prev.current === segment.id) return;
    prev.current = segment.id;
    const id = `${segment.id}:${Date.now()}`;
    setLayers((ls) => [...ls, { id, node: horizonSvg(segment), visible: false }]);
    const raf = requestAnimationFrame(() => {
      setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, visible: true } : l)));
    });
    const prune = setTimeout(() => {
      setLayers((ls) => ls.filter((l) => l.id === id));
    }, 1800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(prune);
    };
  }, [segment]);

  return (
    <div className="fixed inset-x-0 bottom-0 -z-10 h-[32vh] pointer-events-none">
      {layers.map((l) => (
        <div
          key={l.id}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
          style={{ opacity: l.visible ? 1 : 0 }}
        >
          {l.node}
        </div>
      ))}
    </div>
  );
}
