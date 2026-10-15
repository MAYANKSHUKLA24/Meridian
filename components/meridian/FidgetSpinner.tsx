"use client";

import { useEffect, useRef } from "react";
import { useMeridianStore } from "@/lib/meridian/store";

function angleFromCenter(cx: number, cy: number, x: number, y: number) {
  return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
}

export function FidgetSpinner({ accent, glow }: { accent: string; glow: string }) {
  const show = useMeridianStore((s) => s.showFidget);
  const toggle = useMeridianStore((s) => s.toggleFidget);

  const groupRef = useRef<SVGGElement | null>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const lastAngleRef = useRef(0);
  const lastTickBladeRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTick = () => {
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 720;
      gain.gain.value = 0.05;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // audio context unavailable — spinner still works visually
    }
  };

  useEffect(() => {
    let raf = 0;
    function tick() {
      if (!draggingRef.current && Math.abs(velocityRef.current) > 0.01) {
        rotationRef.current += velocityRef.current;
        velocityRef.current *= 0.975;
      } else if (!draggingRef.current) {
        velocityRef.current = 0;
      }

      const blade = Math.floor(rotationRef.current / 60);
      if (blade !== lastTickBladeRef.current && Math.abs(velocityRef.current) > 0.3) {
        lastTickBladeRef.current = blade;
        playTick();
      }

      if (groupRef.current) {
        groupRef.current.setAttribute("transform", `rotate(${rotationRef.current} 60 60)`);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    draggingRef.current = true;
    velocityRef.current = 0;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {
      // pointer capture is a nice-to-have for smoother dragging, not required
    }
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    lastAngleRef.current = angleFromCenter(rect.left + rect.width / 2, rect.top + rect.height / 2, e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const angle = angleFromCenter(rect.left + rect.width / 2, rect.top + rect.height / 2, e.clientX, e.clientY);
    let delta = angle - lastAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    rotationRef.current += delta;
    velocityRef.current = delta;
    lastAngleRef.current = angle;
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  if (!show) {
    return (
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-black/40 backdrop-blur-xl ring-1 ring-white/15 text-lg shadow-xl hover:bg-black/55"
        aria-label="Open fidget spinner"
        title="Fidget spinner (H)"
      >
        🌀
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 rounded-3xl bg-black/40 backdrop-blur-xl ring-1 ring-white/15 p-4 shadow-2xl">
      <button
        onClick={toggle}
        className="absolute top-2 right-2 text-white/40 hover:text-white/80 text-xs h-6 w-6 flex items-center justify-center rounded-full"
        aria-label="Close fidget spinner"
      >
        ✕
      </button>
      <svg
        width={120}
        height={120}
        viewBox="0 0 120 120"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="cursor-grab active:cursor-grabbing touch-none select-none meridian-spin-glow"
        style={{ "--spin-glow": `${glow}aa` } as React.CSSProperties}
      >
        <circle cx={60} cy={60} r={10} fill="white" opacity={0.9} />
        <g ref={groupRef}>
          {[0, 120, 240].map((a) => (
            <g key={a} transform={`rotate(${a} 60 60)`}>
              <circle cx={60} cy={26} r={16} fill={accent} opacity={0.9} />
              <line x1={60} y1={60} x2={60} y2={34} stroke="white" strokeWidth={6} opacity={0.5} />
            </g>
          ))}
        </g>
      </svg>
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">drag to spin · H to hide</p>
    </div>
  );
}
