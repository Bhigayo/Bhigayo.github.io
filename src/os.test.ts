import { describe, expect, it } from "vitest";
import { findProject, PROJECTS } from "./projects";
import { run } from "./terminal";
import { DOCK_H, focused, initialWM, MENU_H, MIN, reduce, type WM } from "./wm";

const open = (s: WM, app: string) => reduce(s, { type: "open", app, title: app, size: { w: 600, h: 400 } });

describe("window manager", () => {
  it("opens one window per app and brings it to the front when opened again", () => {
    let s = initialWM(1440, 900);
    s = open(s, "about");
    s = open(s, "terminal");
    expect(focused(s)?.id).toBe("terminal");
    s = open(s, "about");
    expect(s.wins).toHaveLength(2);
    expect(focused(s)?.id).toBe("about");
  });

  it("cascades new windows so they don't sit exactly on top of each other", () => {
    let s = open(open(initialWM(1440, 900), "a"), "b");
    expect(s.wins[1].rect.x).toBeGreaterThan(s.wins[0].rect.x);
    expect(s.wins[1].rect.y).toBeGreaterThan(s.wins[0].rect.y);
  });

  it("keeps windows grabbable: never above the menu bar or fully off screen, never too small", () => {
    let s = open(initialWM(1440, 900), "a");
    s = reduce(s, { type: "move", id: "a", x: 5000, y: -400 });
    expect(s.wins[0].rect.x).toBeLessThanOrEqual(1440 - 80);
    expect(s.wins[0].rect.y).toBe(MENU_H);
    s = reduce(s, { type: "resize", id: "a", w: 10, h: 10 });
    expect(s.wins[0].rect).toMatchObject({ w: MIN.w, h: MIN.h });
  });

  it("maximises to fill the space between menu bar and dock, and restores", () => {
    let s = open(initialWM(1440, 900), "a");
    const before = s.wins[0].rect;
    s = reduce(s, { type: "toggleMax", id: "a" });
    expect(s.wins[0].rect).toEqual({ x: 0, y: MENU_H, w: 1440, h: 900 - MENU_H - DOCK_H });
    s = reduce(s, { type: "move", id: "a", x: 300, y: 300 });
    expect(s.wins[0].rect.x).toBe(0); // maximised windows don't move
    s = reduce(s, { type: "toggleMax", id: "a" });
    expect(s.wins[0].rect).toEqual(before);
  });

  it("minimises, then brings back on focus, and refits when the screen shrinks", () => {
    let s = open(open(initialWM(1440, 900), "a"), "b");
    s = reduce(s, { type: "minimise", id: "b" });
    expect(focused(s)?.id).toBe("a");
    s = reduce(s, { type: "focus", id: "b" });
    expect(focused(s)?.id).toBe("b");
    s = reduce(s, { type: "screen", w: 800, h: 600 });
    expect(s.wins.every((w) => w.rect.w <= 800)).toBe(true);
  });
});

describe("terminal", () => {
  it("lists commands and projects", () => {
    expect(run("help").lines.map((l) => l.text).join("\n")).toMatch(/open <name>/);
    expect(run("projects").lines).toHaveLength(PROJECTS.length + 1);
  });

  it("opens projects by id, name or a prefix", () => {
    expect(run("open saldo").effect).toEqual({ open: "project:saldo" });
    expect(run("open Draw Together").effect).toEqual({ open: "project:draw-together" });
    expect(run("open hands").effect).toEqual({ open: "project:hands-free" });
    expect(run("open about").effect).toEqual({ open: "about" });
    expect(run("open nothing-here").lines[0].kind).toBe("error");
  });

  it("handles the fun bits and unknown commands", () => {
    expect(run("sudo rm -rf /").lines[0].text).toMatch(/hire me/);
    expect(run("clear").effect).toEqual({ clear: true });
    expect(run("dance").lines[0].text).toMatch(/command not found: dance/);
    expect(findProject("wardrobe")?.name).toBe("Wardrobe");
  });
});
