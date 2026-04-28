/* ═══════════════════════════════════════════
   TRANSITIONS.JS — Page Transitions with Barba.js
   ═══════════════════════════════════════════ */

import barba from '@barba/core';
import gsap from 'gsap';

export function initPageTransitions(reinitCallback) {
  // Create transition overlay
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.innerHTML = '<div class="curtain"></div>';
  document.body.appendChild(overlay);

  const curtain = overlay.querySelector('.curtain');

  barba.init({
    preventRunning: true,
    transitions: [{
      name: 'slide-transition',

      // Before leaving current page
      leave(data) {
        return gsap.timeline()
          .to(data.current.container, {
            opacity: 0,
            y: -30,
            duration: 0.35,
            ease: 'power2.in'
          })
          .to(curtain, {
            y: '0%',
            duration: 0.4,
            ease: 'power3.inOut'
          }, '-=0.15');
      },

      // After entering new page
      enter(data) {
        // Scroll to top
        window.scrollTo(0, 0);

        return gsap.timeline()
          .set(data.next.container, { opacity: 0, y: 30 })
          .to(curtain, {
            y: '-100%',
            duration: 0.4,
            ease: 'power3.inOut'
          })
          .to(data.next.container, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out'
          }, '-=0.2');
      },

      // After transition complete — reinitialize page-specific JS
      after() {
        // Reset curtain position
        gsap.set(curtain, { y: '100%' });
        // Re-init all page logic
        if (typeof reinitCallback === 'function') {
          reinitCallback();
        }
      }
    }]
  });
}
