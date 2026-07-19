/* ═══════════════════════════════════════════
   EXTRAS.JS — Live Clock, Scroll Velocity
   ═══════════════════════════════════════════ */

import gsap from 'gsap';

/**
 * Feature 5: Live Clock & Location
 */
export function initLiveClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Karachi'
    });
    el.textContent = `📍 Pakistan · ${timeStr}`;
  }

  update();
  setInterval(update, 30000);
}

/**
 * Feature 6: Scroll Velocity Text
 */
export function initScrollVelocity() {
  const elements = document.querySelectorAll('.velocity-text');
  if (!elements.length) return;

  let lastScroll = 0;
  let velocity = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    velocity = Math.abs(currentScroll - lastScroll);
    lastScroll = currentScroll;

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const skew = Math.min(velocity * 0.08, 8);
        const scale = 1 + Math.min(velocity * 0.0003, 0.03);

        elements.forEach(el => {
          gsap.to(el, {
            skewX: velocity > 2 ? skew : 0,
            scaleY: velocity > 2 ? scale : 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        ticking = false;
      });
    }
  }, { passive: true });
}

/**
 * Scroll-to-Top Button — appears after 400px scroll
 */
export function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
