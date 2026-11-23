// The window manager: which windows are open, where they are, and which is on top.
// A pure reducer, so it's easy to test and the UI just renders the state.

export type Rect = { x: number; y: number; w: number; h: number };

export type Win = {
  id: string; // one window per app id
  app: string;
  title: string;
  rect: Rect;
  z: number;
  minimised: boolean;
  maximised: boolean;
  restore?: Rect; // size before maximising
};

export type WM = { wins: Win[]; z: number; screen: { w: number; h: number } };

export type Action =
  | { type: "open"; app: string; title: string; size?: { w: number; h: number } }
  | { type: "close"; id: string }
  | { type: "focus"; id: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "resize"; id: string; w: number; h: number }
  | { type: "minimise"; id: string }
  | { type: "toggleMax"; id: string }
  | { type: "screen"; w: number; h: number };

export const MENU_H = 30;
export const DOCK_H = 84;
export const MIN = { w: 320, h: 220 };

export const initialWM = (w: number, h: number): WM => ({ wins: [], z: 1, screen: { w, h } });

/** Keeps a window at least partly on screen, so its title bar can always be grabbed. */
export function clampRect(r: Rect, screen: { w: number; h: number }): Rect {
  const w = Math.max(MIN.w, Math.min(r.w, screen.w));
  const h = Math.max(MIN.h, Math.min(r.h, screen.h - MENU_H));
  const x = Math.max(80 - w, Math.min(r.x, screen.w - 80));
  const y = Math.max(MENU_H, Math.min(r.y, screen.h - DOCK_H - 40));
  return { x, y, w, h };
}

const fullRect = (s: WM["screen"]): Rect => ({ x: 0, y: MENU_H, w: s.w, h: s.h - MENU_H - DOCK_H });

export function reduce(state: WM, a: Action): WM {
  const top = state.z + 1;
  const edit = (id: string, f: (w: Win) => Win): WM => ({ ...state, wins: state.wins.map((w) => (w.id === id ? f(w) : w)) });
  switch (a.type) {
    case "open": {
      const existing = state.wins.find((w) => w.id === a.app);
      if (existing) return { ...edit(a.app, (w) => ({ ...w, minimised: false, z: top })), z: top };
      // New windows cascade from the top left so they don't stack exactly on top of each other
      const n = state.wins.length;
      const size = a.size ?? { w: 720, h: 480 };
      const rect = clampRect({ x: 90 + (n % 6) * 34, y: MENU_H + 30 + (n % 6) * 30, ...size }, state.screen);
      return { ...state, z: top, wins: [...state.wins, { id: a.app, app: a.app, title: a.title, rect, z: top, minimised: false, maximised: false }] };
    }
    case "close":
      return { ...state, wins: state.wins.filter((w) => w.id !== a.id) };
    case "focus":
      {
        const w = state.wins.find((x) => x.id === a.id);
        if (w && w.z === state.z && !w.minimised) return state; // already on top
      }
      return { ...edit(a.id, (w) => ({ ...w, z: top, minimised: false })), z: top };
    case "move":
      return edit(a.id, (w) => (w.maximised ? w : { ...w, rect: clampRect({ ...w.rect, x: a.x, y: a.y }, state.screen) }));
    case "resize":
      return edit(a.id, (w) => (w.maximised ? w : { ...w, rect: clampRect({ ...w.rect, w: a.w, h: a.h }, state.screen) }));
    case "minimise":
      return edit(a.id, (w) => ({ ...w, minimised: true }));
    case "toggleMax":
      return {
        ...edit(a.id, (w) => (w.maximised ? { ...w, maximised: false, rect: w.restore ?? w.rect } : { ...w, maximised: true, restore: w.rect, rect: fullRect(state.screen), z: top })),
        z: top,
      };
    case "screen": {
      const screen = { w: a.w, h: a.h };
      return { ...state, screen, wins: state.wins.map((w) => ({ ...w, rect: w.maximised ? fullRect(screen) : clampRect(w.rect, screen) })) };
    }
  }
}

/** The window on top that isn't minimised: the one keyboard shortcuts act on. */
export const focused = (s: WM) => s.wins.filter((w) => !w.minimised).sort((a, b) => b.z - a.z)[0] ?? null;
