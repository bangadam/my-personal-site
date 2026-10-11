import assert from "node:assert/strict";
import { observeAmbient } from "../src/utils/observeAmbient.js";
import { mascotTarget } from "../src/utils/mascotTarget.js";
const listeners = new Map();
let intersection;
let disconnected = false;
globalThis.document = {
  hidden: false,
  addEventListener: (event, handler) => listeners.set(event, handler),
  removeEventListener: (event, handler) => {
    assert.equal(listeners.get(event), handler);
    listeners.delete(event);
  },
};
globalThis.IntersectionObserver = class {
  constructor(callback) { intersection = callback; }
  observe() {}
  disconnect() { disconnected = true; }
};
const ambient = { style: {} };
const cleanup = observeAmbient(ambient);
assert.equal(ambient.style.animationPlayState, "paused");
intersection([{ isIntersecting: true }]);
assert.equal(ambient.style.animationPlayState, "running");
document.hidden = true;
listeners.get("visibilitychange")();
assert.equal(ambient.style.animationPlayState, "paused");
intersection([{ isIntersecting: false }]);
document.hidden = false;
listeners.get("visibilitychange")();
assert.equal(ambient.style.animationPlayState, "paused");
intersection([{ isIntersecting: true }]);
assert.equal(ambient.style.animationPlayState, "running");
cleanup();
assert.equal(ambient.style.animationPlayState, "paused");
assert.equal(disconnected, true);
assert.equal(listeners.size, 0);
console.log("PASS: ambient pauses offscreen, in hidden tabs, and after navigation cleanup.");

for (const width of [1024, 1440, 1920]) {
  for (const pointerX of [-100, 0, width / 2 - 1, width / 2, width, width + 100]) {
    const target = mascotTarget(pointerX, 2000, width, 900);
    assert.ok(target.x >= 24 && target.x + 96 <= width - 24);
    assert.ok(target.x + 96 <= (width - 672) / 2 - 24 || target.x >= (width + 672) / 2 + 24);
    assert.equal(target.y, 780);
  }
}
console.log("PASS: mascot targets stay onscreen and outside the reading column.");
