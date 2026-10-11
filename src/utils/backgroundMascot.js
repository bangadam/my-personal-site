import { mascotTarget } from "./mascotTarget.js";

document.addEventListener("astro:page-load", () => {
  const pet = /** @type {HTMLElement | null} */ (
    document.querySelector(".background-mascot")
  );
  const facing = /** @type {HTMLElement | null} */ (
    pet?.querySelector(".mascot-facing")
  );
  const frames = /** @type {HTMLElement | null} */ (
    pet?.querySelector(".mascot-frames")
  );
  const button = document.querySelector(".mascot-control");
  if (!pet || !facing || !frames || !button) return;
  const allowed = matchMedia(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );
  const walk = frames.animate(
    Array.from({ length: 7 }, (_, index) => ({
      transform: `translateX(-${(index % 6) * 96}px)`,
      offset: index / 6,
      easing: "steps(1, end)",
    })),
    { duration: 900, iterations: Infinity }
  );
  walk.pause();
  let x = 24;
  let y = innerHeight - 128;
  let target = mascotTarget(x, y, innerWidth, innerHeight);
  let lastPointer = 0;
  let lastFrame = 0;
  let nextWander = 0;
  let paused = false;
  let raf = 0;
  const draw = () => {
    pet.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  draw();

  const tick = now => {
    const elapsed = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    if (now - lastPointer > 2500 && now > nextWander) {
      target = mascotTarget(
        Math.random() * innerWidth,
        Math.random() * innerHeight,
        innerWidth,
        innerHeight
      );
      nextWander = now + 4000;
    }
    const dx = target.x - x;
    const dy = target.y - y;
    const distance = Math.hypot(dx, dy);
    if (distance > 1) {
      const step = Math.min(distance, elapsed * 150);
      x += (dx / distance) * step;
      y += (dy / distance) * step;
      if (Math.abs(dx) > 1)
        facing.style.transform = dx > 0 ? "scaleX(-1)" : "none";
    }
    draw();
    raf = requestAnimationFrame(tick);
  };
  const update = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (allowed.matches && !document.hidden && !paused) {
      walk.play();
      lastFrame = performance.now();
      raf = requestAnimationFrame(tick);
    } else walk.pause();
  };
  const pointer = event => {
    if (event.pointerType !== "mouse") return;
    target = mascotTarget(
      event.clientX - 48,
      event.clientY + 24,
      innerWidth,
      innerHeight
    );
    lastPointer = performance.now();
  };
  const resize = () => {
    target = mascotTarget(target.x, target.y, innerWidth, innerHeight);
    x = Math.max(0, Math.min(x, innerWidth - 96));
    y = Math.max(0, Math.min(y, innerHeight - 96));
    draw();
  };
  button.addEventListener("click", () => {
    paused = !paused;
    button.textContent = paused ? "Resume mascot" : "Pause mascot";
    button.setAttribute("aria-pressed", String(paused));
    update();
  });
  window.addEventListener("pointermove", pointer, { passive: true });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", update);
  allowed.addEventListener("change", update);
  update();
  document.addEventListener(
    "astro:before-swap",
    () => {
      cancelAnimationFrame(raf);
      walk.cancel();
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", update);
      allowed.removeEventListener("change", update);
    },
    { once: true }
  );
});
