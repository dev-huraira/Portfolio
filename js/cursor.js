/* ═══════════════════════════════════════════
   CURSOR.JS — Spotlight Cursor Effect
   ═══════════════════════════════════════════ */

export function initCursor() {
  // Don't init on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  // Spotlight overlay
  const spotlight = document.createElement('div');
  spotlight.className = 'cursor-spotlight';
  document.body.appendChild(spotlight);

  let mouseX = -500, mouseY = -500;
  let spotX = -500, spotY = -500;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    spotX += (mouseX - spotX) * 0.08;
    spotY += (mouseY - spotY) * 0.08;
    spotlight.style.left = spotX + 'px';
    spotlight.style.top = spotY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}
