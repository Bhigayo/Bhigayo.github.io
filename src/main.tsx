import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Desktop from "./Desktop";
import { OSProvider, useOS } from "./os";
import Phone from "./Phone";

/** A short boot screen on the first visit of a session. Click to skip; skipped for reduced motion. */
function Boot({ done }: { done: () => void }) {
  useEffect(() => {
    const t = setTimeout(done, 1500);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <div className="boot" onClick={done} role="status" aria-label="Starting up">
      <span className="boot-mark">✦</span>
      <span className="boot-bar">
        <span />
      </span>
    </div>
  );
}

function Shell() {
  const { phone } = useOS();
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem("os:booted") === "1" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return true;
    }
  });
  const finish = () => {
    setBooted(true);
    try {
      sessionStorage.setItem("os:booted", "1");
    } catch {
      // fine
    }
  };
  if (!booted) return <Boot done={finish} />;
  return phone ? <Phone /> : <Desktop />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OSProvider>
      <Shell />
    </OSProvider>
  </StrictMode>,
);
