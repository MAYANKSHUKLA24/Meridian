export type ParticleType = "birds" | "bokeh" | "embers" | "haze" | "neon" | "stars";
export type HorizonType = "mountains" | "skyline";

export type Genre = {
  id: string;
  name: string;
  playlistId: string;
  art: string;
  bpm: string;
  blurb: string;
};

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
    name: "This Is Fred again..",
    playlistId: "37i9dQZF1DZ06evO2zE29q",
    art: "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4oLeXFyACqeem2VImYeBFe/en",
    bpm: "120–130 BPM",
    blurb: "EDM house, Fred again.. vibes — any hour",
  },
  {
    id: "organic-house-mix",
    name: "Organic House Mix",
    playlistId: "37i9dQZF1EIfDmaeED4FQB",
    art: "https://seed-mix-image.spotifycdn.com/v6/img/desc/Organic%20House/en/default",
    bpm: "110–122 BPM",
    blurb: "Ben Böhmer / RÜFÜS DU SOL territory — zone-in music",
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
        playlistId: "37i9dQZF1DX4sWSpwq3LiO",
        art: "https://i.scdn.co/image/ab67706f0000000270e1fb7db7b45809d6a80377",
        bpm: "60–80 BPM",
        blurb: "solo piano, gentle and unhurried",
      },
      {
        id: "chill-hits",
        name: "Chill Hits",
        playlistId: "37i9dQZF1DX4WYpdgoIcn6",
        art: "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a",
        bpm: "70–95 BPM",
        blurb: "soft pop and indie, easing you in",
      },
      {
        id: "lofi-beats",
        name: "lofi beats",
        playlistId: "37i9dQZF1DWWQRwui0ExPn",
        art: "https://i.scdn.co/image/ab67706f00000002266beb50b0032b0f140a749e",
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
        name: "Indie's Top 50",
        playlistId: "37i9dQZF1DX2Nc3B70tvx0",
        art: "https://i.scdn.co/image/ab67706f0000000259516f659813bbba06735379",
        bpm: "95–120 BPM",
        blurb: "gentle indie rock, bright and clear",
      },
      {
        id: "feel-good-friday",
        name: "Feel Good Friday",
        playlistId: "37i9dQZF1DX1g0iEXLFycr",
        art: "https://i.scdn.co/image/ab67706f00000002f358f6e57a4bf67935faadc7",
        bpm: "100–125 BPM",
        blurb: "upbeat but easy, built for momentum",
      },
      {
        id: "deep-house-relax",
        name: "Deep House Relax",
        playlistId: "37i9dQZF1DX2TRYkJECvfC",
        art: "https://i.scdn.co/image/ab67706f000000025c238995031dcb6d2d054fe5",
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
        playlistId: "37i9dQZF1DXcBWIGoYBM5M",
        art: "https://i.scdn.co/image/ab67706f00000002526040498d89ec622e9d3495",
        bpm: "110–130 BPM",
        blurb: "the biggest pop and pop-rock right now",
      },
      {
        id: "mint",
        name: "mint",
        playlistId: "37i9dQZF1DX4dyzvuaRJ0n",
        art: "https://i.scdn.co/image/ab67706f0000000210fbd0e8781970615c0b64c0",
        bpm: "120–140 BPM",
        blurb: "upbeat electronic, dance-floor ready",
      },
      {
        id: "beast-mode",
        name: "Beast Mode",
        playlistId: "37i9dQZF1DX76Wlfdnj7AP",
        art: "https://i.scdn.co/image/ab67706f00000002f367481f06b565250cc7b139",
        bpm: "130–150 BPM",
        blurb: "trap and EDM, maximum drive",
      },
      {
        id: "get-turnt",
        name: "Get Turnt",
        playlistId: "37i9dQZF1DWY4xHQp97fN6",
        art: "https://i.scdn.co/image/ab67706f0000000266356644fbbd3e85adebe1ad",
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
        playlistId: "37i9dQZF1DXbITWG1ZJKYt",
        art: "https://i.scdn.co/image/ab67706f00000002d6717501a3dc7fdef7aa1694",
        bpm: "70–100 BPM",
        blurb: "timeless jazz, warm and unhurried",
      },
      {
        id: "rnb-x",
        name: "RNB X",
        playlistId: "37i9dQZF1DX4SBhb3fqCJd",
        art: "https://i.scdn.co/image/ab67706f00000002a66d968e583d26aa4a440b1d",
        bpm: "80–105 BPM",
        blurb: "modern R&B, smooth and rhythmic",
      },
      {
        id: "uplifting-soul",
        name: "Uplifting Soul Classics",
        playlistId: "37i9dQZF1DWTx0xog3gN3q",
        art: "https://i.scdn.co/image/ab67706f0000000259447262d46d8193c0f68be3",
        bpm: "90–115 BPM",
        blurb: "classic soul, warm instrumentation",
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
        name: "RapCaviar",
        playlistId: "37i9dQZF1DX0XUsuxWHRQd",
        art: "https://i.scdn.co/image/ab67706f00000002785c58430ad4196ef17ab19d",
        bpm: "95–140 BPM",
        blurb: "the pulse of hip-hop and rap right now",
      },
      {
        id: "dance-classics",
        name: "Dance Classics",
        playlistId: "37i9dQZF1DX8a1tdzq5tbM",
        art: "https://i.scdn.co/image/ab67706f000000022da2d07c587623848d44b52d",
        bpm: "118–128 BPM",
        blurb: "disco, funk and house, pure party energy",
      },
      {
        id: "tropical-house",
        name: "Tropical House",
        playlistId: "37i9dQZF1DX0AMssoUKCz7",
        art: "https://i.scdn.co/image/ab67706f000000023dd93c0e973a45efa8b282cf",
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
        name: "Ambient Relaxation",
        playlistId: "37i9dQZF1DX3Ogo9pFvBkY",
        art: "https://i.scdn.co/image/ab67706f0000000226b7b546f240016f02447692",
        bpm: "<70 BPM",
        blurb: "atmospheric and weightless",
      },
      {
        id: "techno-bunker",
        name: "TECHNO BUNKER",
        playlistId: "37i9dQZF1DX6J5NfMJS675",
        art: "https://i.scdn.co/image/ab67706f0000000274fa5700b2400c534df37a66",
        bpm: "120–135 BPM",
        blurb: "deep, dark, progressive techno",
      },
      {
        id: "dinner-with-friends",
        name: "Dinner with Friends",
        playlistId: "37i9dQZF1DX4xuWVBs4FgJ",
        art: "https://i.scdn.co/image/ab67706f00000002a6a35d85da2b230f63a0005a",
        bpm: "80–105 BPM",
        blurb: "mellow jazzy-funk, low and easy",
      },
      {
        id: "top-50-global",
        name: "Top 50 - Global",
        playlistId: "37i9dQZEVXbMDoHDwVN2tF",
        art: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg",
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
