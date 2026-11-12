// The Terminal app's commands. Returns lines to print and, sometimes, something for the desktop to do.

import { findProject, ME, PROJECTS } from "./projects";

export type Line = { text: string; kind?: "out" | "accent" | "dim" | "error" };
export type Effect = { open?: string; url?: string; clear?: boolean; exit?: boolean };
export type Result = { lines: Line[]; effect?: Effect };

const out = (text: string, kind: Line["kind"] = "out"): Line => ({ text, kind });

export const COMMANDS: Record<string, string> = {
  help: "List commands",
  whoami: "Who built this",
  projects: "List projects",
  "open <name>": "Open a project, e.g. open saldo",
  skills: "What I work with",
  contact: "How to reach me",
  neofetch: "System info, sort of",
  clear: "Clear the screen",
  exit: "Close the terminal",
};

export function run(input: string, now = new Date()): Result {
  const [cmd, ...rest] = input.trim().split(/\s+/);
  const arg = rest.join(" ");
  switch ((cmd ?? "").toLowerCase()) {
    case "":
      return { lines: [] };
    case "help":
      return { lines: Object.entries(COMMANDS).map(([c, d]) => out(`${c.padEnd(14)} ${d}`)) };
    case "whoami":
      return { lines: [out(ME.name, "accent"), out("Software Engineering student at Birmingham City University."), out("Founder of Metic Apparel. Builds things people actually use.")] };
    case "projects":
    case "ls":
      return {
        lines: [
          ...PROJECTS.map((p) => out(`${p.id.padEnd(15)} ${p.status.padEnd(12)} ${p.tagline}`)),
          out("Try: open " + PROJECTS[1].id, "dim"),
        ],
      };
    case "open": {
      if (!arg) return { lines: [out("Open what? Try: open saldo", "error")] };
      if (/^(about|contact|projects|settings)$/i.test(arg)) return { lines: [out(`Opening ${arg.toLowerCase()}…`, "dim")], effect: { open: arg.toLowerCase() } };
      const p = findProject(arg);
      if (!p) return { lines: [out(`No project called "${arg}". Type projects to see them all.`, "error")] };
      return { lines: [out(`Opening ${p.name}…`, "dim")], effect: { open: `project:${p.id}` } };
    }
    case "skills":
      return {
        lines: [
          out("Languages   TypeScript, JavaScript, SQL, HTML, CSS"),
          out("Front end   React, Vite, Canvas, SVG, Web Audio, PWAs"),
          out("Back end    Supabase (Postgres, Realtime, Auth, Storage), Deno"),
          out("Payments    Stripe, including webhooks"),
          out("Also        Vitest, GitHub Actions, MediaPipe, Three.js"),
        ],
      };
    case "contact":
      return { lines: [out(`email     ${ME.email}`), out(`github    ${ME.github}`), out(`linkedin  ${ME.linkedin}`)] };
    case "neofetch":
      return {
        lines: [
          out("      ✦        abdulmalik@os", "accent"),
          out("     ✦✦✦       -------------"),
          out("  ✦✦✦✦✦✦✦✦✦    OS: Abdulmalik OS 1.0"),
          out("     ✦✦✦       Host: Birmingham, UK"),
          out("      ✦        Uptime: since 2023 (Level 3, Bradford College)"),
          out(`               Projects: ${PROJECTS.length}`),
          out("               Shell: curiosity"),
          out(`               Time: ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`),
        ],
      };
    case "date":
      return { lines: [out(now.toLocaleString("en-GB"))] };
    case "echo":
      return { lines: [out(arg)] };
    case "sudo":
      return { lines: [out("Nice try. You'll need to hire me for admin access.", "accent")] };
    case "github":
      return { lines: [out("Opening GitHub…", "dim")], effect: { url: ME.github } };
    case "clear":
      return { lines: [], effect: { clear: true } };
    case "exit":
      return { lines: [], effect: { exit: true } };
    default:
      return { lines: [out(`command not found: ${cmd}. Type help.`, "error")] };
  }
}
