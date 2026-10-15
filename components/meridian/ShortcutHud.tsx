"use client";

import { useMeridianStore } from "@/lib/meridian/store";

const SHORTCUTS: Array<[string, string]> = [
  ["Space", "play / pause"],
  ["G", "cycle genre"],
  ["H", "fidget spinner"],
  ["← / →", "scrub time ± 15 min"],
  ["⇧ + ← / →", "scrub time ± 1 hour"],
  ["L", "jump back to live"],
  ["?", "toggle this menu"],
];

export function ShortcutHud() {
  const showHelp = useMeridianStore((s) => s.showHelp);
  const toggleHelp = useMeridianStore((s) => s.toggleHelp);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {showHelp && (
        <div className="mb-3 w-64 rounded-2xl bg-black/50 backdrop-blur-xl ring-1 ring-white/15 p-4 shadow-2xl">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">shortcuts</p>
          <dl className="space-y-1.5">
            {SHORTCUTS.map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between gap-3 text-xs">
                <dt className="font-mono text-white/80 bg-white/10 rounded px-1.5 py-0.5 shrink-0">{key}</dt>
                <dd className="text-white/55 text-right">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <button
        onClick={toggleHelp}
        className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-xl ring-1 ring-white/15 text-white/60 hover:text-white hover:bg-black/55 flex items-center justify-center text-sm font-mono shadow-xl"
        aria-label="Toggle keyboard shortcuts"
      >
        ?
      </button>
    </div>
  );
}
