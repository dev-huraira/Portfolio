/* ═══════════════════════════════════════════
   PRELOADER.JS — Minimal Progress Bar Preloader
   ═══════════════════════════════════════════ */

export function initPreloader() {
  return new Promise((resolve) => {
    const preloader = document.getElementById('preloader');
    if (!preloader) { resolve(); return; }

    const bar = preloader.querySelector('.preloader-bar');
    const counter = preloader.querySelector('.preloader-counter');
    let progress = 0;
    const target = 100;
    const duration = 1200; // ms
    const startTime = Date.now();

    function update() {
      const elapsed = Date.now() - startTime;
      progress = Math.min(Math.round((elapsed / duration) * target), target);

      if (bar) bar.style.width = progress + '%';
      if (counter) counter.textContent = progress + '%';

      if (progress < target) {
        requestAnimationFrame(update);
      } else {
        // Hold for a moment then hide
        setTimeout(() => {
          preloader.classList.add('hidden');
          // Reveal main content (hidden by critical CSS to prevent FOUC)
          const wrapper = document.querySelector('[data-barba="wrapper"]');
          if (wrapper) wrapper.style.opacity = '1';
          setTimeout(() => {
            preloader.remove();
            resolve();
          }, 600);
        }, 300);
      }
    }

    requestAnimationFrame(update);
  });
}
