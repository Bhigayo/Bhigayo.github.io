import { useEffect, useState } from "react";
import { ProjectIcon } from "./apps/Apps";
import { describeApp, useOS } from "./os";
import { PROJECTS } from "./projects";
import Wallpaper from "./Wallpaper";
import Window from "./Window";
import { focused } from "./wm";

export const SYSTEM_APPS = [
  { app: "about", label: "About me", icon: "🙋🏾‍♂️", tint: "#3b4a6b" },
  { app: "projects", label: "Projects", icon: "🗂️", tint: "#2a6fdb" },
  { app: "terminal", label: "Terminal", icon: ">_", tint: "#1b1d22" },
  { app: "contact", label: "Contact", icon: "✉️", tint: "#d9822b" },
  { app: "classic", label: "Classic site", icon: "🌐", tint: "#5b6b7f" },
  { app: "settings", label: "Settings", icon: "⚙️", tint: "#6b7280" },
];

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  return <span>{now.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>;
}

export default function Desktop() {
  const os = useOS();
  const [menu, setMenu] = useState(false);
  const top = focused(os.wm);

  // Open About on first visit so there's something to read straight away
  useEffect(() => {
    os.open("about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard: Escape closes the menu, Ctrl/Cmd+W closes the front window
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "w" && top) {
        e.preventDefault();
        os.close(top.id);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [os, top]);

  const dockApps = [...SYSTEM_APPS.slice(0, 4).map((a) => a.app), ...PROJECTS.filter((p) => p.url && p.embed).slice(0, 5).map((p) => `web:${p.id}`)];
  const openIds = new Set(os.wm.wins.map((w) => w.id));

  return (
    <div className="desktop">
      <Wallpaper />
      <header className="menubar">
        <button className="menu-logo" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-haspopup="menu">
          ✦ <b>Abdulmalik</b>
        </button>
        <span className="menu-app">{top ? top.title : "Finder"}</span>
        <span className="menu-right">
          <a href="https://github.com/Bhigayo" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <Clock />
        </span>
        {menu && (
          <div className="menu" role="menu" onClick={() => setMenu(false)}>
            <button role="menuitem" onClick={() => os.open("about")}>
              About me
            </button>
            <button role="menuitem" onClick={() => os.open("projects")}>
              All projects
            </button>
            <button role="menuitem" onClick={() => os.open("contact")}>
              Contact
            </button>
            <hr />
            <button role="menuitem" onClick={() => os.open("settings")}>
              Settings…
            </button>
            <button role="menuitem" onClick={() => os.wm.wins.forEach((w) => os.close(w.id))}>
              Close all windows
            </button>
          </div>
        )}
      </header>

      <nav className="icons" aria-label="Desktop">
        {SYSTEM_APPS.slice(0, 5).map((a) => (
          <button key={a.app} className="icon" onDoubleClick={() => os.open(a.app)} onClick={(e) => e.detail === 0 && os.open(a.app)}>
            <span className="icon-tile" style={{ background: a.tint }}>
              {a.icon}
            </span>
            <span className="icon-label">{a.label}</span>
          </button>
        ))}
      </nav>

      {os.wm.wins.map((w) => (
        <Window key={w.id} win={w} active={top?.id === w.id} />
      ))}

      <footer className="dock" aria-label="Dock">
        {dockApps.map((app) => {
          const [kind, id] = app.split(":");
          const p = PROJECTS.find((x) => x.id === id);
          const sys = SYSTEM_APPS.find((s) => s.app === app);
          const label = kind === "web" ? p!.name : describeApp(app).title;
          return (
            <button
              key={app}
              className={`dock-item ${openIds.has(app) ? "running" : ""}`}
              onClick={() => (openIds.has(app) ? os.dispatch({ type: "focus", id: app }) : os.open(app))}
              aria-label={`Open ${label}`}
            >
              {p ? (
                <ProjectIcon p={p} size={50} />
              ) : (
                <span className="icon-tile dock-tile" style={{ background: sys?.tint }}>
                  {sys?.icon}
                </span>
              )}
              <span className="dock-tip">{label}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
}
