/* ═══════════════════════════════════════════
   FEATURES.JS — Skill Bars, Marquee, Scroll Dots,
                  GitHub Graph, Resume Burst, Logo Anim
   ═══════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * Feature 3: Animated Skill Bars — fill with glow on scroll
 */
export function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  bars.forEach(bar => {
    const percent = bar.dataset.percent || '80';
    ScrollTrigger.create({
      trigger: bar.closest('.skill-bar-item'),
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(bar, {
          width: percent + '%',
          duration: 1.4,
          ease: 'power2.out',
        });
        // Animate the number
        const numEl = bar.closest('.skill-bar-item').querySelector('.skill-bar-percent');
        if (numEl) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: parseInt(percent),
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => { numEl.textContent = Math.round(obj.val) + '%'; }
          });
        }
      }
    });
  });
}

/**
 * Feature 5: GitHub Activity — Fetch contribution data
 */
export function initGitHubGraph() {
  const container = document.getElementById('github-graph');
  if (!container) return;

  // Generate a simulated contribution graph (realistic pattern)
  const weeks = 52;
  const days = 7;
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  let html = '<div class="gh-graph-wrap">';

  // Day labels
  html += '<div class="gh-labels">';
  dayLabels.forEach(label => {
    html += `<div class="gh-label">${label}</div>`;
  });
  html += '</div>';

  // Grid
  html += '<div class="gh-grid">';
  for (let w = 0; w < weeks; w++) {
    html += '<div class="gh-week">';
    for (let d = 0; d < days; d++) {
      // Generate realistic-looking contribution pattern
      const rand = Math.random();
      let level = 0;
      if (rand > 0.35) level = 1;
      if (rand > 0.55) level = 2;
      if (rand > 0.75) level = 3;
      if (rand > 0.9) level = 4;
      // Weekends less active
      if (d === 0 || d === 6) level = Math.max(0, level - 1);

      html += `<div class="gh-cell" data-level="${level}"></div>`;
    }
    html += '</div>';
  }
  html += '</div></div>';

  // Legend
  html += '<div class="gh-legend">';
  html += '<span>Less</span>';
  for (let l = 0; l <= 4; l++) {
    html += `<div class="gh-cell legend" data-level="${l}"></div>`;
  }
  html += '<span>More</span>';
  html += '</div>';

  container.innerHTML = html;

  // Animate cells on scroll — sweep by column (week)
  ScrollTrigger.create({
    trigger: container,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const weeks = container.querySelectorAll('.gh-week');
      weeks.forEach((week, wi) => {
        const cells = week.querySelectorAll('.gh-cell');
        gsap.set(cells, { scale: 0, opacity: 0 });
        gsap.to(cells, {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          stagger: 0.03,
          delay: wi * 0.02,
          ease: 'back.out(2)',
        });
      });
    }
  });
}

/**
 * Feature 4: Resume Download with Particle Burst
 */
export function initResumeBurst() {
  const btn = document.getElementById('resume-btn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 16; i++) {
      const particle = document.createElement('div');
      particle.className = 'thread-particle';
      particle.style.left = cx + 'px';
      particle.style.top = cy + 'px';
      document.body.appendChild(particle);

      const angle = (Math.PI * 2 / 16) * i;
      const dist = 60 + Math.random() * 80;

      gsap.to(particle, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0.2,
        duration: 0.7 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  });
}

/**
 * Feature 6: Scroll Section Dots
 */
let scrollDotsHandler = null;

export function initScrollDots() {
  // Remove existing dots (prevents duplicates on page transitions)
  const existing = document.querySelector('.scroll-dots');
  if (existing) existing.remove();
  if (scrollDotsHandler) {
    window.removeEventListener('scroll', scrollDotsHandler);
    scrollDotsHandler = null;
  }

  // Auto-detect all named sections on the current page (works on every page)
  const sections = document.querySelectorAll('section[id]');
  if (sections.length < 2) return;

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'scroll-dots';
  document.body.appendChild(dotsContainer);

  sections.forEach((section, i) => {
    const dot = document.createElement('div');
    dot.className = 'scroll-dot';
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.scroll-dot');

  scrollDotsHandler = function updateDots() {
    const scrollY = window.scrollY + window.innerHeight / 2;
    let activeIndex = 0;

    // Keep updating activeIndex for every section whose top we've passed.
    // This means the last section always stays active once reached.
    sections.forEach((section, i) => {
      if (scrollY >= section.offsetTop) {
        activeIndex = i;
      }
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === activeIndex);
    });
  };

  window.addEventListener('scroll', scrollDotsHandler, { passive: true });
  scrollDotsHandler();
}

/**
 * Feature 7: Animated SVG Logo (draw-on)
 */
export function initLogoAnimation() {
  const logo = document.querySelector('.nav-logo-svg');
  if (!logo) return;

  const paths = logo.querySelectorAll('path, text, circle, rect');
  paths.forEach(path => {
    const length = path.getTotalLength ? path.getTotalLength() : 100;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  gsap.to(paths, {
    strokeDashoffset: 0,
    duration: 2,
    stagger: 0.3,
    ease: 'power2.out',
    delay: 1.5
  });
}

/**
 * Feature 10: Marquee Tech Stack
 */
export function initMarquee() {
  const marquees = document.querySelectorAll('.marquee');
  marquees.forEach(marquee => {
    const track = marquee.querySelector('.marquee-track');
    if (!track) return;

    // Clone content for seamless loop
    const content = track.innerHTML;
    track.innerHTML = content + content;

    // Get speed from data attribute
    const speed = parseInt(marquee.dataset.speed) || 40;
    const totalWidth = track.scrollWidth / 2;

    gsap.to(track, {
      x: -totalWidth,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });
  });
}

/**
 * Feature 2: Project Card Preview on Hover
 */
export function initProjectPreviews() {
  const cards = document.querySelectorAll('.project-card[data-preview]');
  if (!cards.length) return;
  if ('ontouchstart' in window) return;

  const previewEl = document.createElement('div');
  previewEl.className = 'project-preview';
  previewEl.innerHTML = '<img src="" alt="Preview">';
  document.body.appendChild(previewEl);
  const previewImg = previewEl.querySelector('img');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const src = card.dataset.preview;
      if (src) {
        previewImg.src = src;
        previewEl.classList.add('visible');
      }
    });

    card.addEventListener('mousemove', (e) => {
      previewEl.style.left = e.clientX + 20 + 'px';
      previewEl.style.top = e.clientY - 100 + 'px';
    });

    card.addEventListener('mouseleave', () => {
      previewEl.classList.remove('visible');
    });
  });
}

/**
 * Animated Stats Counter — numbers count up on scroll
 */
export function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val);
          }
        });
      }
    });
  });
}

/**
 * Keyboard Navigation — press 1-5 to jump between pages
 */
export function initKeyboardNav() {
  const routes = {
    '1': '/',
    '2': '/about.html',
    '3': '/projects.html',
    '4': '/blog.html',
    '5': '/contact.html',
  };

  // Show hint after 3 seconds
  const hint = document.createElement('div');
  hint.className = 'keyboard-hint';
  hint.innerHTML = '<span class="kbd">1</span>–<span class="kbd">5</span> navigate pages';
  document.body.appendChild(hint);
  setTimeout(() => hint.classList.add('visible'), 3000);
  setTimeout(() => hint.classList.remove('visible'), 8000);

  document.addEventListener('keydown', (e) => {
    // Don't fire when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      window.location.href = '/';
      return;
    }

    const route = routes[e.key];
    if (route && window.location.pathname !== route) {
      window.location.href = route;
    }
  });
}
