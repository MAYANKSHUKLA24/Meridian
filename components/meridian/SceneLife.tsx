"use client";

type Variant = "walker" | "dogwalker" | "jogger" | "cyclist" | "couple";

type Actor = {
  variant: Variant;
  duration: number;
  delay: number;
  bottom: string;
  scale: number;
  reverse?: boolean;
};

const SCENES: Record<string, Actor[]> = {
  earlyMorning: [],
  morning: [
    { variant: "dogwalker", duration: 30, delay: -6, bottom: "1.5vh", scale: 1 },
    { variant: "walker", duration: 20, delay: -2, bottom: "0.5vh", scale: 0.85 },
    { variant: "walker", duration: 24, delay: -14, bottom: "2vh", scale: 0.9, reverse: true },
  ],
  afternoon: [
    { variant: "jogger", duration: 15, delay: -4, bottom: "1vh", scale: 0.95 },
    { variant: "cyclist", duration: 13, delay: -9, bottom: "0.5vh", scale: 1 },
  ],
  goldenHour: [{ variant: "couple", duration: 28, delay: -10, bottom: "1vh", scale: 1 }],
  evening: [
    { variant: "walker", duration: 18, delay: -3, bottom: "0.5vh", scale: 0.9 },
    { variant: "couple", duration: 22, delay: -12, bottom: "1.5vh", scale: 0.95, reverse: true },
  ],
  lateNight: [],
};

function Person({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 40" width={24} height={40} fill={color}>
      <circle cx="12" cy="6" r="4" />
      <rect x="8" y="10" width="8" height="16" rx="3" />
      <rect x="7" y="25" width="4" height="12" rx="1.5" transform="rotate(-10 9 25)" />
      <rect x="13" y="25" width="4" height="12" rx="1.5" transform="rotate(12 15 25)" />
    </svg>
  );
}

function Dog({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 30 16" width={26} height={14} fill={color}>
      <rect x="4" y="4" width="18" height="6" rx="3" />
      <circle cx="24" cy="6" r="3.5" />
      <rect x="6" y="9" width="2.5" height="6" />
      <rect x="16" y="9" width="2.5" height="6" />
    </svg>
  );
}

function Bike({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 30" width={40} height={30} fill="none" stroke={color} strokeWidth={2}>
      <circle cx="8" cy="24" r="5" />
      <circle cx="32" cy="24" r="5" />
      <path d="M8 24 L18 12 L32 24 M18 12 L22 24 M14 12 H22" />
    </svg>
  );
}

function Figure({ variant, color }: { variant: Variant; color: string }) {
  switch (variant) {
    case "dogwalker":
      return (
        <div className="flex items-end gap-1.5">
          <Person color={color} />
          <Dog color={color} />
        </div>
      );
    case "couple":
      return (
        <div className="flex items-end -space-x-1.5">
          <Person color={color} />
          <Person color={color} />
        </div>
      );
    case "cyclist":
      return (
        <div className="relative flex items-end">
          <Bike color={color} />
        </div>
      );
    case "jogger":
    case "walker":
    default:
      return <Person color={color} />;
  }
}

/** Small animated silhouettes (dog walkers, commuters, joggers) that cross the horizon, giving each segment a lived-in feel. */
export function SceneLife({ segmentId, color }: { segmentId: string; color: string }) {
  const actors = SCENES[segmentId] ?? [];
  if (actors.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[-5] h-[28vh] overflow-hidden pointer-events-none">
      {actors.map((actor, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            bottom: actor.bottom,
            left: 0,
            animationName: actor.reverse ? "meridian-walk-reverse" : "meridian-walk",
            animationDuration: `${actor.duration}s`,
            animationDelay: `${actor.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            opacity: 0.7,
          }}
        >
          <div style={{ transform: `scale(${actor.scale})${actor.reverse ? " scaleX(-1)" : ""}` }}>
            <div className="meridian-float">
              <Figure variant={actor.variant} color={color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
