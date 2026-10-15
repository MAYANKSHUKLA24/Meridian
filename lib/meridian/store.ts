import { create } from "zustand";
import { SEGMENTS, combinedGenres } from "./segments";

type Mode = "live" | "preview";

type MeridianState = {
  mode: Mode;
  previewHour: number;
  timezone: string | null;
  genreIndexBySegment: Record<string, number>;
  showFidget: boolean;
  showHelp: boolean;
  isPlaying: boolean;

  setPreviewHour: (hour: number) => void;
  goLive: () => void;
  setTimezone: (timezone: string | null) => void;
  nextGenre: (segmentId: string) => void;
  prevGenre: (segmentId: string) => void;
  setGenreIndex: (segmentId: string, index: number) => void;
  toggleFidget: () => void;
  toggleHelp: () => void;
  setPlaying: (playing: boolean) => void;
};

export const useMeridianStore = create<MeridianState>((set, get) => ({
  mode: "live",
  previewHour: 12,
  timezone: null,
  genreIndexBySegment: {},
  showFidget: false,
  showHelp: false,
  isPlaying: false,

  setPreviewHour: (hour) =>
    set({ mode: "preview", previewHour: ((hour % 24) + 24) % 24 }),

  goLive: () => set({ mode: "live" }),

  setTimezone: (timezone) => set({ timezone, mode: "live" }),

  nextGenre: (segmentId) => {
    const segment = SEGMENTS.find((s) => s.id === segmentId);
    if (!segment) return;
    const total = combinedGenres(segment).length;
    const current = get().genreIndexBySegment[segmentId] ?? 0;
    const next = (current + 1) % total;
    set((state) => ({
      genreIndexBySegment: { ...state.genreIndexBySegment, [segmentId]: next },
    }));
  },

  prevGenre: (segmentId) => {
    const segment = SEGMENTS.find((s) => s.id === segmentId);
    if (!segment) return;
    const total = combinedGenres(segment).length;
    const current = get().genreIndexBySegment[segmentId] ?? 0;
    const prev = (current - 1 + total) % total;
    set((state) => ({
      genreIndexBySegment: { ...state.genreIndexBySegment, [segmentId]: prev },
    }));
  },

  setGenreIndex: (segmentId, index) =>
    set((state) => ({
      genreIndexBySegment: { ...state.genreIndexBySegment, [segmentId]: index },
    })),

  toggleFidget: () => set((state) => ({ showFidget: !state.showFidget })),
  toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),
  setPlaying: (playing) => set({ isPlaying: playing }),
}));
