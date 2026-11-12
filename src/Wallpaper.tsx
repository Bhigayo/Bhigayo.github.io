import { useEffect, useRef } from "react";
import { useOS } from "./os";

/** The desktop background. The night sky has a slow star field that drifts towards the pointer. */
export default function Wallpaper() {
  const { wallpaper } = useOS();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (wallpaper !== "night") return;
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let mx = 0.5;
    let my = 0.5;
    const stars = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.2, d: Math.random() * 0.6 + 0.2, tw: Math.random() * Math.PI * 2 }));
    const fit = () => {
      c.width = innerWidth * devicePixelRatio;
      c.height = innerHeight * devicePixelRatio;
    };
    fit();
    const move = (e: PointerEvent) => {
      mx = e.clientX / innerWidth;
      my = e.clientY / innerHeight;
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const s of stars) {
        const x = (s.x + (mx - 0.5) * 0.02 * s.d) * c.width;
        const y = (s.y + (my - 0.5) * 0.02 * s.d) * c.height;
        const a = still ? 0.8 : 0.45 + Math.sin(t / 900 + s.tw) * 0.35;
        ctx.fillStyle = s.d > 0.7 ? `rgba(240,182,90,${a})` : `rgba(230,236,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    addEventListener("resize", fit);
    addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", fit);
      removeEventListener("pointermove", move);
    };
  }, [wallpaper]);

  return (
    <div className={`wallpaper wall-${wallpaper}`} aria-hidden="true">
      {wallpaper === "night" && <canvas ref={canvas} />}
      <span className="wall-mark">✦</span>
    </div>
  );
}
