"use client";

import { useEffect, useRef, useState } from "react";
import { useClock } from "@/lib/meridian/use-clock";
import { useMeridianStore } from "@/lib/meridian/store";
import { useSpotifyEmbed, spotifyPlaylistUri } from "@/lib/meridian/use-spotify-embed";
import { SEGMENTS, getSegmentIndexForHour, formatClock, combinedGenres } from "@/lib/meridian/segments";
import { CITY_OPTIONS } from "@/lib/meridian/timezones";
import { Background } from "./Background";
import { CelestialArc } from "./CelestialArc";
import { Particles } from "./Particles";
import { SceneLife } from "./SceneLife";
import { Horizon } from "./Horizon";
import { Timeline } from "./Timeline";
import { TimeJumpButtons } from "./TimeJumpButtons";
import { GenreSwitcher } from "./GenreSwitcher";
import { RadioPlayer } from "./RadioPlayer";
import { FidgetSpinner } from "./FidgetSpinner";
import { ShortcutHud } from "./ShortcutHud";
import { WorldClockPicker } from "./WorldClockPicker";

export function MeridianExperience() {
  const mode = useMeridianStore((s) => s.mode);
  const previewHour = useMeridianStore((s) => s.previewHour);
  const timezone = useMeridianStore((s) => s.timezone);
  const genreIndexBySegment = useMeridianStore((s) => s.genreIndexBySegment);
  const setPreviewHour = useMeridianStore((s) => s.setPreviewHour);
  const goLive = useMeridianStore((s) => s.goLive);
  const nextGenre = useMeridianStore((s) => s.nextGenre);
  const prevGenre = useMeridianStore((s) => s.prevGenre);
  const toggleFidget = useMeridianStore((s) => s.toggleFidget);
  const toggleHelp = useMeridianStore((s) => s.toggleHelp);

  const liveHour = useClock(timezone);
  const cityLabel = CITY_OPTIONS.find((c) => c.timeZone === timezone)?.label ?? "My Time";

  const displayHour = mode === "live" ? liveHour : previewHour;
  const segmentIndex = getSegmentIndexForHour(displayHour);
  const segment = SEGMENTS[segmentIndex];
  const genres = combinedGenres(segment);
  const genreIndex = (genreIndexBySegment[segment.id] ?? 0) % genres.length;
  const genre = genres[genreIndex];

  const [initialUri] = useState(() =>
    spotifyPlaylistUri(SEGMENTS[getSegmentIndexForHour(liveHour)].genres[0].playlistId),
  );
  const { mountRef, ready, isPlaying, apiUnavailable, loadUri, togglePlay } = useSpotifyEmbed(initialUri);

  const loadedUriRef = useRef(initialUri);
  useEffect(() => {
    const uri = spotifyPlaylistUri(genre.playlistId);
    if (!ready || uri === loadedUriRef.current) return;
    loadedUriRef.current = uri;
    loadUri(uri);
  }, [genre.playlistId, ready, loadUri]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "g":
        case "G":
          nextGenre(segment.id);
          break;
        case "h":
        case "H":
          toggleFidget();
          break;
        case "l":
        case "L":
          goLive();
          break;
        case "?":
          toggleHelp();
          break;
        case "ArrowLeft":
          setPreviewHour(displayHour - (e.shiftKey ? 1 : 0.25));
          break;
        case "ArrowRight":
          setPreviewHour(displayHour + (e.shiftKey ? 1 : 0.25));
          break;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [segment.id, displayHour, togglePlay, nextGenre, toggleFidget, goLive, toggleHelp, setPreviewHour]);

  const handleNextGenre = () => nextGenre(segment.id);
  const handlePrevGenre = () => prevGenre(segment.id);

  return (
    <div className="fixed inset-0 overflow-hidden text-white">
      <Background segment={segment} />
      <CelestialArc hour={displayHour} />
      <Particles config={segment.particles} />
      <SceneLife segmentId={segment.id} color="#0b0710" />
      <Horizon segment={segment} />

      <div className="relative z-10 flex h-full w-full flex-col overflow-y-auto">
        <header className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">meridian — a 24h mixtape</p>
            <h1 className="mt-1 text-4xl font-semibold leading-none sm:text-6xl">{segment.label}</h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl tabular-nums sm:text-5xl">{formatClock(displayHour)}</p>
            <div className="mt-1.5 flex items-center justify-end gap-2">
              <p className="text-xs text-white/45">{mode === "preview" ? "previewing" : cityLabel}</p>
              <WorldClockPicker />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-6 sm:px-10">
          <RadioPlayer
            segment={segment}
            genre={genre}
            mountRef={mountRef}
            ready={ready}
            isPlaying={isPlaying}
            apiUnavailable={apiUnavailable}
            onTogglePlay={togglePlay}
            onPrevGenre={handlePrevGenre}
            onNextGenre={handleNextGenre}
          />
          <GenreSwitcher segment={segment} activeIndex={genreIndex} />
        </div>

        <footer className="flex flex-col gap-3 px-6 pb-8 sm:px-10">
          <TimeJumpButtons activeSegmentId={segment.id} />
          <Timeline liveHour={liveHour} displayHour={displayHour} />
        </footer>
      </div>

      <ShortcutHud />
      <FidgetSpinner accent={segment.accent} glow={segment.glow} />
    </div>
  );
}
