import { useEffect, useRef, useState } from "react";
import { useOS, type Wallpaper } from "../os";
import { ME, PROJECTS, type Project } from "../projects";
import { COMMANDS, run, type Line } from "../terminal";

/** The content of a window, by app id. */
export function AppContent({ app }: { app: string }) {
  const [kind, id] = app.split(":");
  const p = PROJECTS.find((x) => x.id === id);
  switch (kind) {
    case "about":
      return <About />;
    case "projects":
      return <Projects />;
    case "terminal":
      return <Terminal self={app} />;
    case "contact":
      return <Contact />;
    case "settings":
      return <Settings />;
    case "classic":
      return <Web url="classic/index.html" title="Classic site" />;
    case "project":
      return p ? <ProjectInfo p={p} /> : null;
    case "web":
      return p?.url ? <Web url={p.url} title={p.name} /> : null;
    case "case":
      return p?.caseStudy ? <Web url={p.caseStudy} title={`${p.name} case study`} /> : null;
    default:
      return null;
  }
}

export function ProjectIcon({ p, size = 56 }: { p: Project; size?: number }) {
  return (
    <span className="p-icon" style={{ background: p.tint, width: size, height: size, fontSize: size * 0.5 }} aria-hidden="true">
      {p.icon}
    </span>
  );
}

function About() {
  const { open } = useOS();
  return (
    <div className="doc about">
      <div className="about-head">
        <span className="avatar-big" aria-hidden="true">
          A
        </span>
        <div>
          <h1>{ME.name}</h1>
          <p className="muted">Software engineering student · founder · Birmingham</p>
        </div>
      </div>
      <p>I'm studying BSc Software Engineering at Birmingham City University, after a Level 3 in Software Development at Bradford College (D*DD).</p>
      <p>
        I also run <b>Metic Apparel</b>, my own clothing brand. Running a business taught me to build what people need, ship it, and keep it working after launch. I like projects with real
        users, whether that's a business taking payments or friends playing a game together.
      </p>
      <dl className="facts">
        <dt>Studying</dt>
        <dd>BSc Software Engineering, BCU</dd>
        <dt>Previously</dt>
        <dd>Level 3 Software Development, D*DD</dd>
        <dt>Building with</dt>
        <dd>TypeScript, React, SQL, Supabase</dd>
        <dt>Based in</dt>
        <dd>Birmingham, UK</dd>
      </dl>
      <div className="row">
        <button className="btn primary" onClick={() => open("projects")}>
          See my projects
        </button>
        <button className="btn" onClick={() => open("contact")}>
          Get in touch
        </button>
      </div>
    </div>
  );
}

function Projects() {
  const { open, phone } = useOS();
  const [filter, setFilter] = useState<"all" | Project["status"]>("all");
  const shown = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.status === filter);
  return (
    <div className="finder">
      <aside className="finder-side">
        <span className="finder-label">Show</span>
        {(["all", "Live", "Built", "In progress"] as const).map((f) => (
          <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
            {f === "all" ? "All projects" : f}
          </button>
        ))}
      </aside>
      <div className="finder-grid">
        {shown.map((p) => (
          <button
            key={p.id}
            className="finder-item"
            onDoubleClick={() => open(`project:${p.id}`)}
            // A tap on a phone, or Enter/Space from the keyboard (detail 0), opens straight away
            onClick={(e) => (phone || e.detail === 0) && open(`project:${p.id}`)}
          >
            <ProjectIcon p={p} />
            <b>{p.name}</b>
            <small>{p.tagline}</small>
          </button>
        ))}
        {!phone && <p className="finder-hint">Double-click a project to open it.</p>}
      </div>
    </div>
  );
}

function ProjectInfo({ p }: { p: Project }) {
  const { open } = useOS();
  return (
    <div className="doc project-doc">
      <div className="project-head">
        <ProjectIcon p={p} size={64} />
        <div>
          <span className={`status s-${p.status.replace(" ", "-").toLowerCase()}`}>{p.status}</span>
          <h1>{p.name}</h1>
          <p className="muted">{p.tagline}</p>
        </div>
      </div>
      {p.image && <img className="shot" src={p.image} alt={`${p.name} screenshot`} loading="lazy" />}
      <p>{p.description}</p>
      <h3>Highlights</h3>
      <ul className="highlights">
        {p.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <div className="tags">
        {p.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <div className="row">
        {p.url && p.embed && (
          <button className="btn primary" onClick={() => open(`web:${p.id}`)}>
            Run it here
          </button>
        )}
        {p.url && (
          <a className={`btn ${p.embed ? "" : "primary"}`} href={p.url} target="_blank" rel="noreferrer">
            Open live ↗
          </a>
        )}
        {p.caseStudy && (
          <button className="btn" onClick={() => open(`case:${p.id}`)}>
            Read the case study
          </button>
        )}
        {p.code && (
          <a className="btn" href={p.code} target="_blank" rel="noreferrer">
            Code ↗
          </a>
        )}
      </div>
      {!p.embed && p.url && <p className="muted small">Opens in a new tab: {p.id === "hands-free" ? "it needs your camera" : "it takes real payments"}.</p>}
    </div>
  );
}

function Web({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  return (
    <div className="web">
      <div className="web-bar">
        <button className="web-btn" onClick={() => frame.current && (frame.current.src = new URL(url, location.href).href)} aria-label="Reload">
          ↻
        </button>
        <span className="web-url">{new URL(url, location.href).href.replace(/^https?:\/\//, "")}</span>
        <a className="web-btn" href={url} target="_blank" rel="noreferrer" aria-label="Open in a new tab">
          ↗
        </a>
      </div>
      {!loaded && <span className="web-loading">Loading {title}…</span>}
      <iframe ref={frame} src={url} title={title} onLoad={() => setLoaded(true)} allow="clipboard-write; fullscreen" />
    </div>
  );
}

function Terminal({ self }: { self: string }) {
  const { open, close } = useOS();
  const [lines, setLines] = useState<Line[]>([
    { text: "Abdulmalik OS terminal. Type help to see what you can do.", kind: "dim" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [h, setH] = useState(-1);
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = run(input);
    if (r.effect?.clear) setLines([]);
    else setLines((l) => [...l, { text: `$ ${input}`, kind: "accent" }, ...r.lines]);
    if (input.trim()) setHistory((all) => [input, ...all].slice(0, 50));
    setH(-1);
    setInput("");
    if (r.effect?.open) open(r.effect.open);
    if (r.effect?.url) window.open(r.effect.url, "_blank", "noreferrer");
    if (r.effect?.exit) close(self);
  }

  return (
    <div className="terminal" onClick={() => field.current?.focus()}>
      {lines.map((l, i) => (
        <pre key={i} className={`t-${l.kind ?? "out"}`}>
          {l.text}
        </pre>
      ))}
      <form onSubmit={submit} className="t-input">
        <span className="t-accent">$</span>
        <input
          ref={field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Command"
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && history[h + 1] !== undefined) {
              e.preventDefault();
              setH(h + 1);
              setInput(history[h + 1]);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setH(Math.max(-1, h - 1));
              setInput(h - 1 >= 0 ? history[h - 1] : "");
            }
            if (e.key === "Tab") {
              e.preventDefault();
              const match = Object.keys(COMMANDS).map((c) => c.split(" ")[0]).find((c) => c.startsWith(input));
              if (match) setInput(match + " ");
            }
          }}
        />
      </form>
      <div ref={end} />
    </div>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="doc contact">
      <h1>Let's talk.</h1>
      <p className="muted">Placements, projects or just to say hi.</p>
      <div className="contact-list">
        <a href={`mailto:${ME.email}`} className="contact-item">
          <span aria-hidden="true">✉️</span>
          <span>
            <b>Email</b>
            <small>{ME.email}</small>
          </span>
        </a>
        <button
          className="contact-item"
          onClick={() =>
            navigator.clipboard?.writeText(ME.email).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
          }
        >
          <span aria-hidden="true">📋</span>
          <span>
            <b>{copied ? "Copied" : "Copy email"}</b>
            <small>For your notes</small>
          </span>
        </button>
        <a href={ME.github} target="_blank" rel="noreferrer" className="contact-item">
          <span aria-hidden="true">🐙</span>
          <span>
            <b>GitHub</b>
            <small>Bhigayo</small>
          </span>
        </a>
        <a href={ME.linkedin} target="_blank" rel="noreferrer" className="contact-item">
          <span aria-hidden="true">💼</span>
          <span>
            <b>LinkedIn</b>
            <small>Abdulmalik Olusesi</small>
          </span>
        </a>
      </div>
    </div>
  );
}

function Settings() {
  const { wallpaper, setWallpaper } = useOS();
  const walls: [Wallpaper, string][] = [
    ["night", "Night sky"],
    ["dusk", "Dusk"],
    ["grid", "Blueprint"],
  ];
  return (
    <div className="doc settings">
      <h2>Wallpaper</h2>
      <div className="walls">
        {walls.map(([w, label]) => (
          <button key={w} className={`wall-pick ${wallpaper === w ? "on" : ""}`} onClick={() => setWallpaper(w)} aria-pressed={wallpaper === w}>
            <span className={`wall-preview wall-${w}`} />
            {label}
          </button>
        ))}
      </div>
      <h2>About this OS</h2>
      <p className="muted">
        Abdulmalik OS 1.0 is my portfolio, built as a desktop. It's React and TypeScript with a hand-written window manager that's covered by tests. Try the Terminal: type <code>help</code>.
      </p>
    </div>
  );
}
