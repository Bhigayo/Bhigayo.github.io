// Everything the portfolio shows. Edit links here once each app is live on GitHub Pages.

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  status: "Live" | "Built" | "In progress";
  url?: string; // the live app
  code?: string; // GitHub repo
  caseStudy?: string; // a case study page inside this site
  embed: boolean; // can it run inside a window? (payments and camera apps open in a new tab)
  icon: string; // emoji shown on the icon tile
  tint: string; // icon background
  image?: string;
};

const GH = "https://github.com/Bhigayo";
const PAGES = "https://bhigayo.github.io";

export const PROJECTS: Project[] = [
  {
    id: "eatsbythia",
    name: "Eatsbythia",
    tagline: "Online ordering for a home food business",
    description:
      "Online ordering, card payments and a live kitchen dashboard for a home-based Nigerian food business in Manchester. Customers order from their phone and the kitchen sees it instantly.",
    highlights: ["Stripe card payments with webhooks", "Live kitchen dashboard over Supabase Realtime", "Order tracking page for customers"],
    stack: ["JavaScript", "Supabase", "PostgreSQL", "Stripe", "Deno", "GitHub Actions"],
    status: "Live",
    url: `${PAGES}/eatsbythia/`,
    code: `${GH}/eatsbythia`,
    caseStudy: "classic/eatsbythia.html",
    embed: false,
    icon: "🍲",
    tint: "#e8743b",
    image: "classic/images/eatsbythia-menu-mobile.webp",
  },
  {
    id: "saldo",
    name: "Saldo",
    tagline: "How much can I safely spend until payday?",
    description: "A personal finance app that answers one question: how much can I safely spend until payday? It works offline and installs on a phone.",
    highlights: ["Safe-to-spend maths with tests", "Offline-first PWA", "Budgets and bills in one view"],
    stack: ["React", "TypeScript", "Vitest", "PWA", "GitHub Actions"],
    status: "Live",
    url: `${PAGES}/saldo/`,
    code: `${GH}/saldo`,
    caseStudy: "classic/saldo.html",
    embed: true,
    icon: "💷",
    tint: "#2f8f5b",
    image: "classic/images/saldo-overview.webp",
  },
  {
    id: "quickfire",
    name: "Quickfire",
    tagline: "A party game: the TV hosts, phones play",
    description: "A Jackbox-style party game. Open it on a laptop or TV, friends scan a QR code and play on their phones: a speed quiz and Guess the Lie, with custom question packs.",
    highlights: ["Real-time rooms for up to a party of players", "Speed and streak scoring", "Custom question packs"],
    stack: ["React", "TypeScript", "Supabase Realtime"],
    status: "Live",
    url: `${PAGES}/quickfire/`,
    code: `${GH}/quickfire`,
    embed: true,
    icon: "⚡",
    tint: "#7c4dff",
  },
  {
    id: "wardrobe",
    name: "Wardrobe",
    tagline: "An outfit every morning from what you own",
    description: "Photograph your clothes once and get an outfit every morning, picked for the weather, the occasion and what you haven't worn lately. Colours are read from the photos.",
    highlights: ["Outfit scoring engine: warmth, rain, occasion, colour harmony", "Colour detection from photos", "Everything stored on the device"],
    stack: ["React", "TypeScript", "IndexedDB", "Open-Meteo", "PWA", "Vitest"],
    status: "Live",
    url: `${PAGES}/wardrobe/`,
    code: `${GH}/wardrobe`,
    embed: true,
    icon: "🧥",
    tint: "#a8482a",
  },
  {
    id: "director",
    name: "Director",
    tagline: "A creative director for phone shoots",
    description: "Describe a shoot and get a shot list with framing sketches, camera moves, gimbal tips and golden-hour times, then work through it shot by shot on the day.",
    highlights: ["Shot-list planner that reads the brief", "Golden-hour times from solar maths", "Optional AI plans with Claude"],
    stack: ["React", "TypeScript", "SVG", "Claude API", "PWA", "Vitest"],
    status: "Live",
    url: `${PAGES}/director/`,
    code: `${GH}/director`,
    embed: true,
    icon: "🎬",
    tint: "#c98a1e",
  },
  {
    id: "ajo",
    name: "Ajo",
    tagline: "Run your savings group without the notebook",
    description: "A tracker for ajo, esusu and susu rotating savings groups: who's paid, whose turn it is, and WhatsApp reminders and group updates in one tap.",
    highlights: ["Payout schedules that handle short months", "Part payments and late tracking", "One-tap WhatsApp reminders"],
    stack: ["React", "TypeScript", "IndexedDB", "Vitest"],
    status: "Built",
    url: `${PAGES}/ajo/`,
    code: `${GH}/ajo`,
    embed: true,
    icon: "🪙",
    tint: "#136f45",
  },
  {
    id: "hands-free",
    name: "Hands Free",
    tagline: "Control things with your hand",
    description: "Gesture control through a webcam: swipe through slides, DJ an Amapiano groove with a pinch, and draw neon lines in the air. Hand tracking runs entirely in the browser.",
    highlights: ["Gesture recognition from 21 hand landmarks", "A live synth and sequencer in Web Audio", "Runs on the device; the camera never leaves it"],
    stack: ["React", "TypeScript", "MediaPipe", "Web Audio", "Vitest"],
    status: "Built",
    url: `${PAGES}/hands-free/`,
    code: `${GH}/hands-free`,
    embed: false,
    icon: "✋",
    tint: "#5a7d00",
  },
  {
    id: "draw-together",
    name: "Draw Together",
    tagline: "One board, everyone's phones",
    description: "A shared drawing board that syncs live between phones: strokes appear while they're drawn, with cursors, presence, pressure-sensitive pens and undo that never touches anyone else's work.",
    highlights: ["Conflict-free, append-only board history", "Live strokes at 20 updates a second", "Apple Pencil pressure and palm rejection"],
    stack: ["React", "TypeScript", "Canvas", "Supabase Realtime", "Vitest"],
    status: "Built",
    url: `${PAGES}/draw-together/`,
    code: `${GH}/draw-together`,
    embed: true,
    icon: "🖍️",
    tint: "#d63a5a",
  },
  {
    id: "brit-life",
    name: "Birmingham crime drama",
    tagline: "A 3D open-world game in the browser",
    description: "A story-driven 3D open-world game that runs in the browser, set in Birmingham's Digbeth, with multiplayer, driving and a story told through missions.",
    highlights: ["3D world in Three.js", "Multiplayer", "Characters and clothing from Blender"],
    stack: ["React", "TypeScript", "Three.js", "React Three Fiber", "Blender"],
    status: "In progress",
    embed: false,
    icon: "🏙️",
    tint: "#33415c",
  },
];

export const findProject = (q: string) => {
  const s = q.trim().toLowerCase().replace(/\s+/g, "-");
  return PROJECTS.find((p) => p.id === s || p.name.toLowerCase().replace(/\s+/g, "-") === s || p.id.startsWith(s) || p.name.toLowerCase().startsWith(q.trim().toLowerCase()));
};

export const ME = {
  name: "Abdulmalik Olusesi",
  role: "Software engineering student and founder",
  email: "abdulmalikayomide40@gmail.com",
  github: GH,
  linkedin: "www.linkedin.com/in/abdulmalik-olusesi-bb4b84235",
};
