/** @param {HTMLElement} ambient */
export function observeAmbient(ambient) {
  let inView = false;
  const update = () => {
    ambient.style.animationPlayState =
      inView && !document.hidden ? "running" : "paused";
  };
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  observer.observe(ambient);
  document.addEventListener("visibilitychange", update);
  update();

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
    ambient.style.animationPlayState = "paused";
  };
}
