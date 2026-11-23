// Shared state for the whole "operating system": windows, wallpaper, and the open/close actions apps use.

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { PROJECTS } from "./projects";
import { initialWM, reduce, type Action, type WM } from "./wm";

export type Wallpaper = "night" | "dusk" | "grid";

/** Title and default size for every kind of window. */
export function describeApp(app: string): { title: string; size: { w: number; h: number } } {
  const [kind, id] = app.split(":");
  const p = PROJECTS.find((x) => x.id === id);
  switch (kind) {
    case "about":
      return { title: "About me", size: { w: 620, h: 560 } };
    case "projects":
      return { title: "Projects", size: { w: 820, h: 560 } };
    case "terminal":
      return { title: "Terminal", size: { w: 640, h: 420 } };
    case "contact":
      return { title: "Contact", size: { w: 460, h: 400 } };
    case "settings":
      return { title: "Settings", size: { w: 520, h: 420 } };
    case "classic":
      return { title: "Classic site", size: { w: 1000, h: 680 } };
    case "project":
      return { title: p?.name ?? "Project", size: { w: 680, h: 600 } };
    case "web":
      return { title: `${p?.name ?? "App"} · live`, size: { w: 1040, h: 700 } };
    case "case":
      return { title: `${p?.name ?? ""} case study`, size: { w: 960, h: 700 } };
    default:
      return { title: app, size: { w: 600, h: 400 } };
  }
}

type OS = {
  wm: WM;
  dispatch: (a: Action) => void;
  open(app: string): void;
  close(app: string): void;
  wallpaper: Wallpaper;
  setWallpaper(w: Wallpaper): void;
  phone: boolean;
};

const Ctx = createContext<OS | null>(null);
export const useOS = () => {
  const os = useContext(Ctx);
  if (!os) throw new Error("useOS must be used inside OSProvider");
  return os;
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    return (JSON.parse(localStorage.getItem(key) ?? "null") as T) ?? fallback;
  } catch {
    return fallback;
  }
};

export function OSProvider({ children }: { children: ReactNode }) {
  const [wm, dispatch] = useReducer(reduce, undefined, () => initialWM(innerWidth, innerHeight));
  const [wallpaper, setWall] = useState<Wallpaper>(() => read("os:wallpaper", "night"));
  const [phone, setPhone] = useState(() => innerWidth < 720);

  useEffect(() => {
    const on = () => {
      dispatch({ type: "screen", w: innerWidth, h: innerHeight });
      setPhone(innerWidth < 720);
    };
    addEventListener("resize", on);
    return () => removeEventListener("resize", on);
  }, []);

  const value: OS = {
    wm,
    dispatch,
    phone,
    open(app) {
      const d = describeApp(app);
      dispatch({ type: "open", app, title: d.title, size: d.size });
    },
    close(app) {
      dispatch({ type: "close", id: app });
    },
    wallpaper,
    setWallpaper(w) {
      setWall(w);
      try {
        localStorage.setItem("os:wallpaper", JSON.stringify(w));
      } catch {
        // fine without it
      }
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
