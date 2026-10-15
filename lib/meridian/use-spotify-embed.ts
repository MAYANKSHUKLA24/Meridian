"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PlaybackUpdateEvent = { data?: { isPaused?: boolean } };

type EmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  addListener: (event: "ready" | "playback_update", cb: (e: PlaybackUpdateEvent) => void) => void;
  destroy: () => void;
};

type IFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { width?: string | number; height?: string | number; uri: string },
    callback: (controller: EmbedController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    __meridianSpotifyApi?: IFrameAPI;
    __meridianSpotifyApiCallbacks?: Array<(api: IFrameAPI) => void>;
  }
}

const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";

export function spotifyPlaylistUri(playlistId: string): string {
  return `spotify:playlist:${playlistId}`;
}

function loadSpotifyIframeApi(onReady: (api: IFrameAPI) => void) {
  if (typeof window === "undefined") return;

  if (window.__meridianSpotifyApi) {
    onReady(window.__meridianSpotifyApi);
    return;
  }

  window.__meridianSpotifyApiCallbacks = window.__meridianSpotifyApiCallbacks ?? [];
  window.__meridianSpotifyApiCallbacks.push(onReady);

  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

  window.onSpotifyIframeApiReady = (api) => {
    window.__meridianSpotifyApi = api;
    window.__meridianSpotifyApiCallbacks?.forEach((cb) => cb(api));
    window.__meridianSpotifyApiCallbacks = [];
  };

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;
  document.body.appendChild(script);
}

/**
 * Mounts one persistent Spotify embed controller via the official IFrame API
 * (developer.spotify.com/documentation/embeds/iframe-api) and switches tracks
 * with loadUri() so segment/genre changes never remount or flicker the player.
 */
export function useSpotifyEmbed(initialUri: string, embedHeight: number = 152) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    let destroyed = false;
    const timeout = setTimeout(() => {
      if (!destroyed && !controllerRef.current) setApiUnavailable(true);
    }, 8000);

    loadSpotifyIframeApi((api) => {
      if (destroyed || !mountRef.current || controllerRef.current) return;
      api.createController(
        mountRef.current,
        { width: "100%", height: String(embedHeight), uri: initialUri },
        (controller) => {
          if (destroyed) return;
          clearTimeout(timeout);
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            setIsPlaying(!e?.data?.isPaused);
          });
          setReady(true);
        },
      );
    });

    return () => {
      destroyed = true;
      clearTimeout(timeout);
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUri = useCallback((uri: string) => {
    const controller = controllerRef.current;
    if (!controller) return;
    controller.loadUri(uri);
    // loadUri() doesn't reliably resume playback on its own — force it so
    // switching genres always starts audio immediately instead of loading paused.
    controller.play();
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    controllerRef.current?.togglePlay();
  }, []);

  return { mountRef, ready, isPlaying, apiUnavailable, loadUri, togglePlay };
}
