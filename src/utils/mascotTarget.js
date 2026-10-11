// ponytail: six-frame sprite walk; layered Lottie only when independent body-part motion is needed.
export function mascotTarget(pointerX, pointerY, width, height) {
  const size = 96;
  const margin = 24;
  const leftEdge = (width - 672) / 2;
  const rightEdge = (width + 672) / 2;
  const x =
    pointerX < width / 2
      ? Math.max(margin, Math.min(pointerX, leftEdge - size - margin))
      : Math.min(width - size - margin, Math.max(pointerX, rightEdge + margin));
  return { x, y: Math.max(96, Math.min(pointerY, height - size - margin)) };
}
