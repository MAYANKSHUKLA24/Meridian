"use client";

import { useState, type RefObject } from "react";
import { youtubeThumbnail, youtubeOpenUrl, type Genre, type Segment } from "@/lib/meridian/segments";

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
  const [artState, setArtState] = useState({ genreId: genre.id, missing: false });
  if (artState.genreId !== genre.id) {
    setArtState({ genreId: genre.id, missing: false });
  }
  const artMissing = artState.missing;
  const setArtMissing = () => setArtState({ genreId: genre.id, missing: true });

  return (
    <div className="relative w-full max-w-sm rounded-[28px] bg-black/35 backdrop-blur-xl ring-1 ring-white/15 px-4 py-3.5 shadow-2xl shadow-black/40">
      {/* Headless YouTube player — drives real, full-length playback. No login
          gate like Spotify's embed, so it can stay fully hidden; our pill is the UI. */}
      <div className="absolute h-px w-px overflow-hidden opacity-0 pointer-events-none">
        <div ref={mountRef} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {artMissing ? (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-lg ring-1 ring-white/20"
              style={{ backgroundColor: segment.accent }}
            >
              📻
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={youtubeThumbnail(genre.thumbVideoId)}
              alt=""
              className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20"
              onError={() => setArtMissing()}
              onLoad={(e) => {
                const img = e.currentTarget;
                // YouTube silently returns a generic 120×90 placeholder for
                // videos with no real thumbnail, instead of erroring
                if (img.naturalWidth === 120 && img.naturalHeight === 90) setArtMissing();
              }}
            />
          )}
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

      {apiUnavailable && (
        <p className="mt-2 text-center text-[11px] text-white/50">
          Player unavailable —{" "}
          <a
            className="underline hover:text-white"
            href={youtubeOpenUrl(genre)}
            target="_blank"
            rel="noopener noreferrer"
          >
            open &ldquo;{genre.name}&rdquo; on YouTube
          </a>
        </p>
      )}
    </div>
  );
}
