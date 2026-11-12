import { useRef } from "react";
import { AppContent } from "./apps/Apps";
import { useOS } from "./os";
import type { Win } from "./wm";

/** A desktop window: drag by the title bar, resize from the corner, double-click the title to maximise. */
export default function Window({ win, active }: { win: Win; active: boolean }) {
  const { dispatch } = useOS();
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const size = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const onTitleDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dispatch({ type: "focus", id: win.id });
    if (win.maximised) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - win.rect.x, dy: e.clientY - win.rect.y };
  };
  const onTitleMove = (e: React.PointerEvent) => {
    if (drag.current) dispatch({ type: "move", id: win.id, x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
  };

  const onGripDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    size.current = { x: e.clientX, y: e.clientY, w: win.rect.w, h: win.rect.h };
  };
  const onGripMove = (e: React.PointerEvent) => {
    const s = size.current;
    if (s) dispatch({ type: "resize", id: win.id, w: s.w + e.clientX - s.x, h: s.h + e.clientY - s.y });
  };

  return (
    <section
      className={`window ${active ? "active" : ""} ${win.maximised ? "max" : ""}`}
      style={{ left: win.rect.x, top: win.rect.y, width: win.rect.w, height: win.rect.h, zIndex: win.z, display: win.minimised ? "none" : undefined }}
      onPointerDown={() => dispatch({ type: "focus", id: win.id })}
      role="dialog"
      aria-label={win.title}
    >
      <header
        className="titlebar"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={() => (drag.current = null)}
        onDoubleClick={(e) => !(e.target as HTMLElement).closest("button") && dispatch({ type: "toggleMax", id: win.id })}
      >
        <div className="lights">
          <button className="light close" aria-label={`Close ${win.title}`} onClick={() => dispatch({ type: "close", id: win.id })} />
          <button className="light min" aria-label={`Minimise ${win.title}`} onClick={() => dispatch({ type: "minimise", id: win.id })} />
          <button className="light max" aria-label={`${win.maximised ? "Restore" : "Maximise"} ${win.title}`} onClick={() => dispatch({ type: "toggleMax", id: win.id })} />
        </div>
        <span className="title">{win.title}</span>
      </header>
      <div className="content">
        {/* While dragging over an iframe, the frame would swallow the pointer; this shield stops that */}
        {!active && <div className="shield" />}
        <AppContent app={win.app} />
      </div>
      {!win.maximised && <div className="grip" onPointerDown={onGripDown} onPointerMove={onGripMove} onPointerUp={() => (size.current = null)} aria-hidden="true" />}
    </section>
  );
}
