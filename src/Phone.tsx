import { useEffect, useState } from "react";
import { AppContent, ProjectIcon } from "./apps/Apps";
import { SYSTEM_APPS } from "./Desktop";
import { describeApp, useOS } from "./os";
import { PROJECTS } from "./projects";
import Wallpaper from "./Wallpaper";

/** On a phone the desktop becomes a home screen; apps open full screen with a back button. */
export default function Phone() {
  const os = useOS();
  const [stack, setStack] = useState<string[]>([]);
  const current = stack.at(-1);

  // Apps open things through os.open; on a phone that pushes a screen instead of a window
  useEffect(() => {
    const newest = [...os.wm.wins].sort((a, b) => b.z - a.z)[0];
    if (newest && newest.id !== current) setStack((s) => [...s.filter((x) => x !== newest.id), newest.id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [os.wm.z]);

  const back = () => {
    if (current) os.close(current);
    setStack((s) => s.slice(0, -1));
  };

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="phone">
      <Wallpaper />
      <div className="phone-status">
        <b>{time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</b>
        <span>Abdulmalik OS</span>
      </div>
      <div className="phone-home">
        <div className="phone-hero">
          <p>Hi, I'm</p>
          <h1>Abdulmalik</h1>
          <p className="muted">Software engineering student and founder, Birmingham.</p>
        </div>
        <div className="phone-grid">
          {SYSTEM_APPS.filter((a) => a.app !== "classic" && a.app !== "settings").map((a) => (
            <button key={a.app} className="phone-app" onClick={() => os.open(a.app)}>
              <span className="icon-tile" style={{ background: a.tint }}>
                {a.icon}
              </span>
              <span>{a.label}</span>
            </button>
          ))}
          {PROJECTS.map((p) => (
            <button key={p.id} className="phone-app" onClick={() => os.open(`project:${p.id}`)}>
              <ProjectIcon p={p} size={58} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
      {current && (
        <section className="phone-screen" role="dialog" aria-label={describeApp(current).title}>
          <header className="phone-bar">
            <button onClick={back} aria-label="Back">
              ‹ Back
            </button>
            <b>{describeApp(current).title}</b>
            <span />
          </header>
          <div className="phone-content">
            <AppContent app={current} />
          </div>
        </section>
      )}
    </div>
  );
}
