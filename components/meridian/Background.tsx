"use client";

import { useEffect, useRef, useState } from "react";
import type { Segment } from "@/lib/meridian/segments";

function gradientCss(g: [string, string, string]): string {
  return `linear-gradient(165deg, ${g[0]} 0%, ${g[1]} 55%, ${g[2]} 100%)`;
}

type Layer = { id: string; css: string; visible: boolean };

export function Background({ segment }: { segment: Segment }) {
  const [layers, setLayers] = useState<Layer[]>([
    { id: segment.id, css: gradientCss(segment.gradient), visible: true },
  ]);
  const prevId = useRef(segment.id);

  useEffect(() => {
    if (prevId.current === segment.id) return;
    prevId.current = segment.id;

    const newLayer: Layer = {
      id: `${segment.id}:${Date.now()}`,
      css: gradientCss(segment.gradient),
      visible: false,
    };
    setLayers((ls) => [...ls, newLayer]);

    const raf = requestAnimationFrame(() => {
      setLayers((ls) => ls.map((l) => (l.id === newLayer.id ? { ...l, visible: true } : l)));
    });
    const prune = setTimeout(() => {
      setLayers((ls) => ls.filter((l) => l.id === newLayer.id));
    }, 1800);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(prune);
    };
  }, [segment]);

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      {layers.map((l) => (
        <div
          key={l.id}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
          style={{ backgroundImage: l.css, opacity: l.visible ? 1 : 0 }}
        />
      ))}
      <div className="meridian-grain absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay" />
      <div
        className="meridian-pulse absolute inset-0 pointer-events-none"
        style={
          {
            "--pulse-duration": `${segment.pulseSeconds}s`,
            "--pulse-color": segment.glow,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
