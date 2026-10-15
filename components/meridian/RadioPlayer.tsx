"use client";

import type { RefObject } from "react";
import type { Genre, Segment } from "@/lib/meridian/segments";

export function RadioPlayer({
  segment,
  genre,
  mountRef,
  ready,
  isPlaying,
  apiUnavailable,
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
  onTogglePlay: () => void;
  onPrevGenre: () => void;
  onNextGenre: () => void;
}) {
  return (
    <div className="w-full max-w-sm rounded-[28px] bg-black/35 backdrop-blur-xl ring-1 ring-white/15 px-4 py-3.5 shadow-2xl shadow-black/40">
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

      {/* Real Spotify widget — this is what actually plays audio, and it's where
          you log into Spotify to unlock full tracks instead of ~15s previews. */}
      <div className="mt-3 overflow-hidden rounded-2xl bg-white/5">
        <div ref={mountRef} />
        {!ready && !apiUnavailable && (
          <div className="flex h-[152px] items-center justify-center text-xs font-mono text-white/40">
            loading player…
          </div>
        )}
      </div>

      <p className="mt-2 text-center text-[10px] leading-snug text-white/35">
        Spotify gives short previews unless you&apos;re signed in — log in above (free account works)
        for full-length tracks.
      </p>

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
