"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PlayerState = -1 | 0 | 1 | 2 | 3 | 5;

export type StationSource = { playlistId?: string; videoId?: string };

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  loadPlaylist: (options: { listType: "playlist"; list: string; index?: number }) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getPlayerState: () => PlayerState;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    elementOrId: HTMLElement | string,
    options: {
      height?: string | number;
      width?: string | number;
      videoId?: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: PlayerState; target: YTPlayer }) => void;
        onError?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: YTNamespace;
    __meridianYoutubeCallbacks?: Array<() => void>;
  }
}

const SCRIPT_SRC = "https://www.youtube.com/iframe_api";
const BASE_PLAYER_VARS = {
  autoplay: 1,
  controls: 0,
  disablekb: 1,
  fs: 0,
  iv_load_policy: 3,
  modestbranding: 1,
  playsinline: 1,
  rel: 0,
  loop: 1,
};

// Kept conservatively low: an index beyond a playlist's actual track count
// doesn't error or clamp — YouTube silently falls back to unrelated trending
// content instead. Our smallest curated playlist has 11 tracks.
function randomIndex(maxExclusive = 8) {
  return Math.floor(Math.random() * maxExclusive);
}

function loadYoutubeApi(onReady: () => void) {
  if (typeof window === "undefined") return;

  if (window.YT?.Player) {
    onReady();
    return;
  }

  window.__meridianYoutubeCallbacks = window.__meridianYoutubeCallbacks ?? [];
  window.__meridianYoutubeCallbacks.push(onReady);

  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

  const previous = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    previous?.();
    window.__meridianYoutubeCallbacks?.forEach((cb) => cb());
    window.__meridianYoutubeCallbacks = [];
  };

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;
  document.body.appendChild(script);
}

/**
 * Mounts one persistent YouTube player via the official IFrame Player API
 * (developers.google.com/youtube/iframe_api_reference). Full-length videos
 * play for anyone with no login required, so the player stays fully hidden —
 * our own pill is the only visible UI. Stations backed by a real playlist
 * start at a random track (not always track 1) so switching genres — or
 * coming back to one later — doesn't keep replaying the same song.
 */
export function useYoutubeEmbed(initialSource: StationSource) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const modeRef = useRef<"playlist" | "video">(initialSource.playlistId ? "playlist" : "video");
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    let destroyed = false;
    const timeout = setTimeout(() => {
      if (!destroyed && !playerRef.current) setApiUnavailable(true);
    }, 8000);

    loadYoutubeApi(() => {
      if (destroyed || !mountRef.current || playerRef.current || !window.YT) return;
      const player = new window.YT.Player(mountRef.current, {
        height: "1",
        width: "1",
        ...(initialSource.playlistId ? {} : { videoId: initialSource.videoId }),
        playerVars: {
          ...BASE_PLAYER_VARS,
          ...(initialSource.playlistId
            ? { listType: "playlist", list: initialSource.playlistId, index: randomIndex() }
            : { playlist: initialSource.videoId ?? "" }),
        },
        events: {
          onReady: () => {
            if (destroyed) return;
            clearTimeout(timeout);
            playerRef.current = player;
            setReady(true);
          },
          onStateChange: (e) => {
            setIsPlaying(e.data === 1);
            // Playlists loop natively via the `loop` playerVar; a lone video
            // needs a manual nudge so a station never just stops.
            if (e.data === 0 && modeRef.current === "video") {
              player.seekTo(0, true);
              player.playVideo();
            }
          },
          onError: () => setApiUnavailable(true),
        },
      });
    });

    return () => {
      destroyed = true;
      clearTimeout(timeout);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStation = useCallback((source: StationSource) => {
    const player = playerRef.current;
    if (!player) return;
    if (source.playlistId) {
      modeRef.current = "playlist";
      player.loadPlaylist({ listType: "playlist", list: source.playlistId, index: randomIndex() });
    } else if (source.videoId) {
      modeRef.current = "video";
      player.loadVideoById(source.videoId);
    }
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.getPlayerState() === 1) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, []);

  return { mountRef, ready, isPlaying, apiUnavailable, loadStation, togglePlay };
}
