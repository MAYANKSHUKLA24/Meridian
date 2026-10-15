"use client";

import { useEffect, useRef, useState } from "react";
import type { HorizonType, Segment } from "@/lib/meridian/segments";

const MOUNTAIN = "M0,200 L0,140 L60,110 L140,150 L220,95 L300,145 L360,120 L400,150 L400,200 Z";

function Skyline({ accent }: { accent: string }) {
  const buildings = [
    { x: 10, w: 26, h: 70 },
    { x: 42, w: 18, h: 110 },
    { x: 66, w: 30, h: 60 },
    { x: 102, w: 20, h: 95 },
    { x: 128, w: 34, h: 130 },
    { x: 168, w: 22, h: 75 },
    { x: 196, w: 28, h: 100 },
    { x: 230, w: 18, h: 60 },
    { x: 254, w: 32, h: 115 },
    { x: 292, w: 24, h: 80 },
    { x: 322, w: 20, h: 105 },
    { x: 348, w: 30, h: 65 },
  ];
  return (
    <g>
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={200 - b.h} width={b.w} height={b.h} fill="#05030f" opacity={0.92} />
          {Array.from({ length: Math.floor(b.h / 16) }, (_, row) =>
            Array.from({ length: Math.max(1, Math.floor(b.w / 10)) }, (_, col) => {
              const lit = (row + col + i) % 3 === 0;
              if (!lit) return null;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={b.x + 4 + col * 9}
                  y={200 - b.h + 6 + row * 16}
                  width={3.5}
                  height={5}
                  fill={accent}
                  opacity={0.8}
                />
              );
            }),
          )}
        </g>
      ))}
    </g>
  );
}

function horizonSvg(type: HorizonType, segment: Segment) {
  const common = (children: React.ReactNode) => (
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="w-full h-full">
      {children}
    </svg>
  );

  if (type === "skyline") return common(<Skyline accent={segment.accent} />);
  return common(<path d={MOUNTAIN} fill="#05030f" opacity={0.85} />);
}

export function Horizon({ segment }: { segment: Segment }) {
  const [layers, setLayers] = useState<{ id: string; node: React.ReactNode; visible: boolean }[]>([
    { id: segment.horizon, node: horizonSvg(segment.horizon, segment), visible: true },
  ]);
  const prev = useRef(segment.id);

  useEffect(() => {
    if (prev.current === segment.id) return;
    prev.current = segment.id;
    const id = `${segment.id}:${Date.now()}`;
    setLayers((ls) => [...ls, { id, node: horizonSvg(segment.horizon, segment), visible: false }]);
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
