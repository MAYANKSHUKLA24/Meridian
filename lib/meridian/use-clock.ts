"use client";

import { useEffect, useState } from "react";

/** Hour-of-day (0–24) for a date in a given IANA timezone, or the browser's own zone when null. */
export function hourInTimeZone(date: Date, timeZone: string | null): number {
  if (!timeZone) {
    return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const hour = get("hour") % 24;
  return hour + get("minute") / 60 + get("second") / 3600;
}

/**
 * Ticks the hour-of-day (0–24) for the given timezone every 15s.
 * Starts at a fixed value so server and client render identically on first
 * paint, then syncs to the real clock on mount — avoids a hydration mismatch
 * from the server and client computing `new Date()` moments apart.
 */
export function useClock(timeZone: string | null = null) {
  const [hour, setHour] = useState(12);

  useEffect(() => {
    const sync = () => setHour(hourInTimeZone(new Date(), timeZone));
    const id = setInterval(sync, 15_000);
    const syncSoon = setTimeout(sync, 0);
    return () => {
      clearInterval(id);
      clearTimeout(syncSoon);
    };
  }, [timeZone]);

  return hour;
}
