"use client";

import { combinedGenres, type Segment } from "@/lib/meridian/segments";
import { useMeridianStore } from "@/lib/meridian/store";

export function GenreSwitcher({ segment, activeIndex }: { segment: Segment; activeIndex: number }) {
  const setGenreIndex = useMeridianStore((s) => s.setGenreIndex);
  const genres = combinedGenres(segment);

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {genres.map((genre, i) => {
        const active = i === activeIndex;
        const anytime = i >= segment.genres.length;
        return (
          <button
            key={genre.id}
            onClick={() => setGenreIndex(segment.id, i)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide transition-all ${
              active
                ? "text-black"
                : "text-white/55 bg-white/6 hover:bg-white/12 ring-1 ring-white/10"
            }`}
            style={active ? { backgroundColor: segment.accent } : undefined}
            title={anytime ? "Always available" : undefined}
          >
            {anytime && <span className={active ? "text-black/50" : "text-white/35"}>·</span>}
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
