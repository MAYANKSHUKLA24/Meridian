"use client";

import { useCallback, useRef } from "react";
import { SEGMENTS, formatClock } from "@/lib/meridian/segments";
import { useMeridianStore } from "@/lib/meridian/store";

const TOTAL = 24;

function segmentSpanPercent(window: [number, number]): [number, number] {
  const [start, end] = window;
  const span = end > start ? end - start : 24 - start + end;
  return [(start / TOTAL) * 100, (span / TOTAL) * 100];
}

export function Timeline({ liveHour, displayHour }: { liveHour: number; displayHour: number }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const mode = useMeridianStore((s) => s.mode);
  const setPreviewHour = useMeridianStore((s) => s.setPreviewHour);
  const goLive = useMeridianStore((s) => s.goLive);

  const hourFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * TOTAL;
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setPreviewHour(hourFromClientX(e.clientX));
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // pointer capture is a nice-to-have for smoother dragging, not required
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setPreviewHour(hourFromClientX(e.clientX));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // no-op if capture was never established
    }
  };

  const playheadPercent = (displayHour / TOTAL) * 100;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-white/50">
        <span>{formatClock(displayHour)}</span>
        <button
          onClick={goLive}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors ${
            mode === "live" ? "text-white bg-white/10" : "text-white/40 hover:text-white/70 hover:bg-white/5"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${mode === "live" ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`}
          />
          {mode === "live" ? "LIVE" : "BACK TO LIVE"}
        </button>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative h-9 w-full cursor-pointer touch-none select-none rounded-full bg-black/30 ring-1 ring-white/10 overflow-hidden"
      >
        {SEGMENTS.map((seg) => {
          const [left, width] = segmentSpanPercent(seg.window);
          return (
            <div
              key={seg.id}
              className="absolute inset-y-0"
              style={{ left: `${left}%`, width: `${width}%`, backgroundColor: seg.accent, opacity: 0.16 }}
            />
          );
        })}

        <div
          className="absolute inset-y-0 w-0.5 bg-white/70"
          style={{ left: `${(liveHour / TOTAL) * 100}%` }}
        />

        <div
          className="absolute top-1/2 -translate-y-1/2 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-white shadow-lg shadow-black/40 transition-[left] duration-150"
          style={{ left: `${playheadPercent}%`, backgroundColor: "white" }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-white/35 px-0.5">
        <span>12AM</span>
        <span>6AM</span>
        <span>12PM</span>
        <span>6PM</span>
        <span>12AM</span>
      </div>
    </div>
  );
}
