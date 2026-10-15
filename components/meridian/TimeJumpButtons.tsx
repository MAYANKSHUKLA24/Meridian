"use client";

import { SEGMENTS, segmentMidpointHour } from "@/lib/meridian/segments";
import { useMeridianStore } from "@/lib/meridian/store";

/** One button per segment — jump straight to what's playing at that time of day. */
export function TimeJumpButtons({ activeSegmentId }: { activeSegmentId: string }) {
  const setPreviewHour = useMeridianStore((s) => s.setPreviewHour);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/35 mr-0.5">hear:</span>
      {SEGMENTS.map((seg) => {
        const active = seg.id === activeSegmentId;
        return (
          <button
            key={seg.id}
            onClick={() => setPreviewHour(segmentMidpointHour(seg))}
            className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide transition-colors ${
              active ? "bg-white/20 text-white" : "text-white/45 hover:bg-white/10 hover:text-white/75"
            }`}
          >
            {seg.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
