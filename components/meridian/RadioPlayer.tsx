"use client";

import type { RefObject } from "react";
import type { Genre, Segment } from "@/lib/meridian/segments";

function formatTime(ms: number): string {
  if (!ms || !Number.isFinite(ms)) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function RadioPlayer({
  segment,
  genre,
  mountRef,
  ready,
  isPlaying,
  apiUnavailable,
  positionMs,
  durationMs,
  onTogglePlay,
  onPrevGenre,
  onNextGenre,
}: {
  segment: Segment;
  genre: Genre;
  mountRef: RefObject<HTMLDivElement | null>;
  ready: boolean;
  isPlaying: boolean;
  apiUnavailable: boolean;
  positionMs: number;
  durationMs: number;
  onTogglePlay: () => void;
  onPrevGenre: () => void;
  onNextGenre: () => void;
}) {
  const progress = durationMs > 0 ? Math.min(1, positionMs / durationMs) : 0;

  return (
    <div className="relative w-full max-w-sm rounded-[28px] bg-black/35 backdrop-blur-xl ring-1 ring-white/15 px-4 py-3.5 shadow-2xl shadow-black/40">
      {/* Headless Spotify embed — drives real playback, visually hidden. Our own pill is the UI. */}
      <div className="absolute h-px w-px overflow-hidden opacity-0 pointer-events-none">
        <div ref={mountRef} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={genre.art}
            alt=""
            className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20"
          />
          {isPlaying && (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-black/40 animate-pulse"
              style={{ backgroundColor: segment.accent }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">radio ·</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
              {segment.shortLabel}
            </span>
          </div>
          <p className="truncate text-sm font-semibold text-white">{genre.name}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onPrevGenre}
            className="h-8 w-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Previous station"
            title="Previous station"
          >
            ⏮
          </button>
          <button
            onClick={onTogglePlay}
            disabled={!ready}
            className="h-9 w-9 flex items-center justify-center rounded-full text-black disabled:opacity-40"
            style={{ backgroundColor: segment.accent }}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={onNextGenre}
            className="h-8 w-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Next station"
            title="Next station"
          >
            ⏭
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress * 100}%`, backgroundColor: segment.accent }}
          />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-white/40">{formatTime(positionMs)}</span>
      </div>

      {apiUnavailable && (
        <p className="mt-2 text-center text-[11px] text-white/50">
          Player unavailable —{" "}
          <a
            className="underline hover:text-white"
            href={`https://open.spotify.com/playlist/${genre.playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            open &ldquo;{genre.name}&rdquo; on Spotify
          </a>
        </p>
      )}
    </div>
  );
}
