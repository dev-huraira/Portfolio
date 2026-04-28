/* ═══════════════════════════════════════════
   MAGNETIC.JS — Magnetic Button Effect
   ═══════════════════════════════════════════ */

export function initMagneticButtons() {
  const magnets = document.querySelectorAll('.magnetic-wrap');
  if (!magnets.length) return;

  // Only on non-touch devices
  if ('ontouchstart' in window) return;

  magnets.forEach(wrap => {
    const btn = wrap.querySelector('.btn, .social-link') || wrap.children[0];
    if (!btn) return;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      btn.style.transition = 'transform 0.15s ease-out';
    });

    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });
}

/* ═══════════════════════════════════════════
   3D TILT — Interactive Card Tilt on Hover
   ═══════════════════════════════════════════ */

export function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;
  if ('ontouchstart' in window) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.transition = 'transform 0.1s ease-out';

      // Spotlight effect
      const glare = card.querySelector('.card-glare') || createGlare(card);
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(167,139,250,0.12) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      const glare = card.querySelector('.card-glare');
      if (glare) glare.style.background = 'transparent';
    });
  });
}

function createGlare(card) {
  const glare = document.createElement('div');
  glare.className = 'card-glare';
  glare.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;';
  card.style.position = 'relative';
  card.appendChild(glare);
  return glare;
}
