export type ParticleType = "birds" | "bokeh" | "embers" | "haze" | "neon" | "stars";
export type HorizonType = "mountains" | "skyline";

export type Genre = {
  id: string;
  name: string;
  /** YouTube video ID — a long-running mix or 24/7 livestream that loops indefinitely. */
  videoId: string;
  bpm: string;
  blurb: string;
};

export function youtubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export type Segment = {
  id: string;
  label: string;
  shortLabel: string;
  /** [startHour, endHour) in 24h float time. lateNight wraps past midnight. */
  window: [number, number];
  gradient: [string, string, string];
  accent: string;
  glow: string;
  /** Seconds for one breathing pulse of the ambient glow — a loose nod to the segment's tempo. */
  pulseSeconds: number;
  particles: {
    type: ParticleType;
    density: number;
    speed: number;
    colors: string[];
  };
  horizon: HorizonType;
  genres: Genre[];
};

/** Always-available stations, on top of whatever's in rotation for the time of day. */
export const ANYTIME_GENRES: Genre[] = [
  {
    id: "this-is-fred-again",
    name: "Fred again.. (Full Set)",
    videoId: "RX1cVJt6Gik",
    bpm: "120–130 BPM",
    blurb: "EDM house, Fred again.. live at Terminal 5 — any hour",
  },
  {
    id: "organic-house-mix",
    name: "Organic House Mix",
    videoId: "Ujwa2XCzd8g",
    bpm: "110–122 BPM",
    blurb: "RÜFÜS DU SOL / Ben Böhmer / Lane 8 territory — zone-in music",
  },
];

export function combinedGenres(segment: Segment): Genre[] {
  return [...segment.genres, ...ANYTIME_GENRES];
}

export const SEGMENTS: Segment[] = [
  {
    id: "earlyMorning",
    label: "Early Morning",
    shortLabel: "DAWN",
    window: [5, 8],
    gradient: ["#1b2a4a", "#4a3b6b", "#c97b63"],
    accent: "#f4b393",
    glow: "#ffd9b0",
    pulseSeconds: 6,
    particles: { type: "birds", density: 7, speed: 0.4, colors: ["#2a2440", "#3a3160"] },
    horizon: "mountains",
    genres: [
      {
        id: "peaceful-piano",
        name: "Peaceful Piano",
        videoId: "l6J0ylYTO4s",
        bpm: "60–80 BPM",
        blurb: "solo piano, gentle and unhurried",
      },
      {
        id: "chill-hits",
        name: "Blissful Morning",
        videoId: "zGcYx7TJ5lI",
        bpm: "70–95 BPM",
        blurb: "soft and positive, easing you in",
      },
      {
        id: "lofi-beats",
        name: "lofi beats",
        videoId: "jfKfPfyJRdk",
        bpm: "70–90 BPM",
        blurb: "dusty, warm, half-asleep house",
      },
    ],
  },
  {
    id: "morning",
    label: "Morning",
    shortLabel: "MORNING",
    window: [8, 11.5],
    gradient: ["#163649", "#2f6478", "#d9a93f"],
    accent: "#ffd166",
    glow: "#fff1c2",
    pulseSeconds: 4.5,
    particles: { type: "bokeh", density: 18, speed: 0.5, colors: ["#ffffff", "#ffe9b0", "#bfe8ff"] },
    horizon: "mountains",
    genres: [
      {
        id: "indie-top-50",
        name: "Indie Folk Radio",
        videoId: "c6JAn-IGX6o",
        bpm: "95–120 BPM",
        blurb: "gentle indie folk, bright and clear",
      },
      {
        id: "feel-good-friday",
        name: "Feel Good Friday",
        videoId: "g2dqc7WlFbg",
        bpm: "100–125 BPM",
        blurb: "upbeat but easy, built for momentum",
      },
      {
        id: "deep-house-relax",
        name: "Deep House Relax",
        videoId: "Ihm9OQWmibA",
        bpm: "100–118 BPM",
        blurb: "soft house, rolling and unhurried",
      },
    ],
  },
  {
    id: "afternoon",
    label: "Afternoon",
    shortLabel: "AFTERNOON",
    window: [11.5, 16],
    gradient: ["#a4441c", "#c47a1f", "#2e7f91"],
    accent: "#ff5f6d",
    glow: "#ffe08a",
    pulseSeconds: 2.2,
    particles: { type: "embers", density: 26, speed: 1.1, colors: ["#fff2cc", "#ffb347", "#ff6b6b"] },
    horizon: "mountains",
    genres: [
      {
        id: "todays-top-hits",
        name: "Today's Top Hits",
        videoId: "dSumoJlI1bc",
        bpm: "110–130 BPM",
        blurb: "the biggest pop and pop-rock right now",
      },
      {
        id: "mint",
        name: "Tropical House Radio",
        videoId: "2B4x-tQGH88",
        bpm: "120–140 BPM",
        blurb: "upbeat electronic, dance-floor ready",
      },
      {
        id: "beast-mode",
        name: "Beast Mode",
        videoId: "LDHVtmNdsPk",
        bpm: "130–150 BPM",
        blurb: "trap and EDM, maximum drive",
      },
      {
        id: "get-turnt",
        name: "Get Turnt",
        videoId: "mIwLUsZ32QQ",
        bpm: "125–145 BPM",
        blurb: "hard-hitting trap and hip-hop energy",
      },
    ],
  },
  {
    id: "goldenHour",
    label: "Golden Hour",
    shortLabel: "GOLDEN HOUR",
    window: [16, 18.5],
    gradient: ["#3a1240", "#8a3356", "#c77c42"],
    accent: "#ffb36b",
    glow: "#ff9d6c",
    pulseSeconds: 4,
    particles: { type: "haze", density: 14, speed: 0.35, colors: ["#ffd9a0", "#ff9d9d", "#d9a0ff"] },
    horizon: "mountains",
    genres: [
      {
        id: "jazz-classics",
        name: "Jazz Classics",
        videoId: "ovEwMim9Hks",
        bpm: "70–100 BPM",
        blurb: "timeless jazz, warm and unhurried",
      },
      {
        id: "rnb-x",
        name: "RNB X",
        videoId: "SBnxFo7CjGU",
        bpm: "80–105 BPM",
        blurb: "modern R&B, smooth and rhythmic",
      },
      {
        id: "uplifting-soul",
        name: "Motown Classics",
        videoId: "cfsd2kpUM1k",
        bpm: "90–115 BPM",
        blurb: "Stevie Wonder, The Supremes, Smokey Robinson",
      },
    ],
  },
  {
    id: "evening",
    label: "Evening",
    shortLabel: "EVENING",
    window: [18.5, 23],
    gradient: ["#0d0a2b", "#431567", "#9c2a52"],
    accent: "#ff3b7f",
    glow: "#c86bff",
    pulseSeconds: 2.8,
    particles: { type: "neon", density: 22, speed: 0.8, colors: ["#ff3b7f", "#8a5cff", "#36e2ff"] },
    horizon: "skyline",
    genres: [
      {
        id: "rapcaviar",
        name: "Hip Hop Beats Radio",
        videoId: "v8e1yKTp7H4",
        bpm: "95–140 BPM",
        blurb: "the pulse of hip-hop and rap right now",
      },
      {
        id: "dance-classics",
        name: "Funk & Disco Mix",
        videoId: "9wVB91HkbF4",
        bpm: "118–128 BPM",
        blurb: "ABBA, Bee Gees, Earth Wind & Fire — pure party energy",
      },
      {
        id: "tropical-house",
        name: "Tropical House Radio",
        videoId: "yBiyXnVxIwE",
        bpm: "100–120 BPM",
        blurb: "warm house, built for a night out",
      },
    ],
  },
  {
    id: "lateNight",
    label: "Late Night",
    shortLabel: "LATE NIGHT",
    window: [23, 5],
    gradient: ["#02030e", "#0c1a3a", "#1f2d5c"],
    accent: "#6a8dff",
    glow: "#9db4ff",
    pulseSeconds: 7,
    particles: { type: "stars", density: 60, speed: 0.1, colors: ["#ffffff", "#cfe0ff", "#9db4ff"] },
    horizon: "mountains",
    genres: [
      {
        id: "ambient-relaxation",
        name: "Space Ambient",
        videoId: "X7X3UDwyyqo",
        bpm: "<70 BPM",
        blurb: "atmospheric and weightless",
      },
      {
        id: "techno-bunker",
        name: "Deep Techno",
        videoId: "G-u5OhIeln4",
        bpm: "120–135 BPM",
        blurb: "deep, dark, hypnotic techno",
      },
      {
        id: "dinner-with-friends",
        name: "Cafe Jazz Lounge",
        videoId: "psEr3_r9Yqw",
        bpm: "80–105 BPM",
        blurb: "mellow jazzy-funk, low and easy",
      },
      {
        id: "top-50-global",
        name: "Top Hits Mix",
        videoId: "rPtxYOyAUKc",
        bpm: "varies",
        blurb: "the famous songs everyone already knows",
      },
    ],
  },
];

export function getSegmentIndexForHour(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  for (let i = 0; i < SEGMENTS.length; i++) {
    const [start, end] = SEGMENTS[i].window;
    if (start <= end) {
      if (h >= start && h < end) return i;
    } else {
      // wraps past midnight (lateNight)
      if (h >= start || h < end) return i;
    }
  }
  return 0;
}

export function segmentMidpointHour(segment: Segment): number {
  const [start, end] = segment.window;
  const span = end > start ? end - start : 24 - start + end;
  return (start + span / 2) % 24;
}

export function segmentProgress(hour: number, segment: Segment): number {
  const h = ((hour % 24) + 24) % 24;
  const [start, end] = segment.window;
  const span = end > start ? end - start : 24 - start + end;
  const elapsed = h >= start ? h - start : 24 - start + h;
  return Math.min(1, Math.max(0, elapsed / span));
}

export function formatClock(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  const period = hh >= 12 ? "PM" : "AM";
  const display = hh % 12 === 0 ? 12 : hh % 12;
  return `${display}:${mm.toString().padStart(2, "0")} ${period}`;
}
