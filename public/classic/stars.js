// Star field for the home page hero. Nearby stars join up around the pointer.
(function () {
  const canvas = document.getElementById("stars");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LINK_DISTANCE = 120;
  const POINTER_RADIUS = 170;

  let width = 0;
  let height = 0;
  let stars = [];
  let pointer = null;
  let running = true;
  let frame = null;

  function makeStars() {
    const count = Math.round(Math.min(160, (width * height) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    makeStars();
    draw(0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const near = [];
    for (const s of stars) {
      if (!reduceMotion) {
        s.x = (s.x + s.vx + width) % width;
        s.y = (s.y + s.vy + height) % height;
      }
      const twinkle = reduceMotion ? 0.8 : 0.55 + 0.45 * Math.sin(time / 1400 + s.phase);
      let glow = 0;
      if (pointer) {
        const d = Math.hypot(s.x - pointer.x, s.y - pointer.y);
        if (d < POINTER_RADIUS) {
          glow = 1 - d / POINTER_RADIUS;
          near.push(s);
        }
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r + glow * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = glow
        ? `rgba(240, 182, 90, ${0.5 + glow * 0.5})`
        : `rgba(236, 232, 223, ${twinkle * 0.75})`;
      ctx.fill();
    }

    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const a = near[i];
        const b = near[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DISTANCE) {
          ctx.strokeStyle = `rgba(240, 182, 90, ${(1 - d / LINK_DISTANCE) * 0.55})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function loop(time) {
    draw(time);
    frame = running ? requestAnimationFrame(loop) : null;
  }

  function start() {
    if (frame === null) frame = requestAnimationFrame(loop);
  }

  const hero = canvas.parentElement;
  hero.addEventListener("pointermove", (e) => {
    const box = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
    if (reduceMotion) draw(0);
  });
  hero.addEventListener("pointerleave", () => {
    pointer = null;
    if (reduceMotion) draw(0);
  });

  // Stop animating when the hero is off screen
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting && !reduceMotion;
    if (running) start();
  }).observe(canvas);

  window.addEventListener("resize", resize);
  resize();
  if (!reduceMotion) start();
})();
