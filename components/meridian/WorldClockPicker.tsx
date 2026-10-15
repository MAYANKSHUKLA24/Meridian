"use client";

import { useState } from "react";
import { CITY_OPTIONS } from "@/lib/meridian/timezones";
import { useMeridianStore } from "@/lib/meridian/store";

export function WorldClockPicker() {
  const [open, setOpen] = useState(false);
  const timezone = useMeridianStore((s) => s.timezone);
  const setTimezone = useMeridianStore((s) => s.setTimezone);
  const current = CITY_OPTIONS.find((c) => c.timeZone === timezone) ?? CITY_OPTIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-white/60 ring-1 ring-white/10 hover:bg-white/14 hover:text-white/85"
      >
        <span aria-hidden>🌐</span>
        {current.label}
        <span className="text-white/40">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl bg-black/60 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl">
          {CITY_OPTIONS.map((city) => (
            <button
              key={city.label}
              onClick={() => {
                setTimezone(city.timeZone);
                setOpen(false);
              }}
              className={`block w-full px-3.5 py-2 text-left text-xs transition-colors ${
                city.timeZone === timezone ? "bg-white/15 text-white" : "text-white/65 hover:bg-white/10"
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
