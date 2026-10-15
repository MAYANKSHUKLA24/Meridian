"use client";

/** 1 at the center hour, fading to 0 over the last `fade` hours of a `half`-hour-radius window. */
function visibility(hour: number, centerHour: number, half = 6, fade = 1) {
  const d = Math.abs(((hour - centerHour + 12 + 24) % 24) - 12);
  if (d <= half - fade) return 1;
  if (d >= half) return 0;
  return (half - d) / fade;
}

function arcStyle(t: number) {
  const left = 6 + t * 88;
  const top = 70 - Math.sin(Math.PI * t) * 44;
  return { left: `${left}%`, top: `${top}vh` };
}

/**
 * A sun and moon that glide along a continuous arc keyed to the exact hour —
 * live or scrubbed — rather than snapping per segment. The horizon silhouette
 * renders in front of this layer so both bodies dip behind it near the edges.
 */
export function CelestialArc({ hour }: { hour: number }) {
  const sunT = (hour - 6) / 12;
  const moonT = ((hour - 18 + 24) % 24) / 12;
  const sunOpacity = visibility(hour, 12);
  const moonOpacity = visibility(hour, 0);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <div
        className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-1000 ease-linear"
        style={{
          ...arcStyle(sunT),
          opacity: sunOpacity,
          background: "radial-gradient(circle at 35% 35%, #fff6d8, #ffd166 55%, #ff9d4d 100%)",
          boxShadow: "0 0 50px 14px rgba(255,180,90,0.55)",
        }}
      />
      <div
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full transition-[left,top] duration-1000 ease-linear"
        style={{
          ...arcStyle(moonT),
          opacity: moonOpacity,
          background: "radial-gradient(circle at 65% 35%, #f3f6ff, #cfd8f5 55%, #9aa8d6 100%)",
          boxShadow: "0 0 36px 10px rgba(180,195,255,0.45)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "#0c1a3a", transform: "translate(28%, -18%) scale(0.92)" }}
        />
      </div>
    </div>
  );
}
