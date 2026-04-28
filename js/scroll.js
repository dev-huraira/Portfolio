/* ═══════════════════════════════════════════
   SCROLL.JS — Intersection Observer, Parallax, Thread Dividers
   ═══════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize scroll reveal animations
 */
export function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal:not(.visible)');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '20px 0px -20px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Initialize parallax on data-parallax elements
 */
export function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;

  function update() {
    const scrollY = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      // Only animate when in viewport
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = `translateY(${scrollY * speed * 0.25}px)`;
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/**
 * Initialize thread divider draw-on-scroll
 */
export function initThreadDividers() {
  const dividers = document.querySelectorAll('.thread-divider');
  if (!dividers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('drawn');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  dividers.forEach(d => observer.observe(d));
}

/**
 * Animate stat numbers counting up
 */
export function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  statNumbers.forEach(stat => {
    let targetNum, suffix;

    // Support data-target attribute (new stats section)
    if (stat.dataset.target) {
      targetNum = parseInt(stat.dataset.target);
      suffix = '';
    } else {
      // Legacy: parse from text content
      const text = stat.textContent.trim();
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      targetNum = parseInt(match[1]);
      suffix = match[2] || '';
    }

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetNum,
          duration: 2,
          ease: 'power1.out',
          onUpdate: () => {
            stat.textContent = Math.round(obj.val) + suffix;
          }
        });
      }
    });
  });
}

/**
 * Skill pills fly in from random directions
 */
export function initSkillPillsEntrance() {
  const groups = document.querySelectorAll('.skills-constellation');
  if (!groups.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll('.skill-pill');
        const dirs = [
          { x: -50, y: 25 }, { x: 50, y: -25 }, { x: 0, y: 45 },
          { x: -35, y: -35 }, { x: 40, y: 35 }, { x: -25, y: 0 },
        ];
        pills.forEach((pill, i) => {
          const dir = dirs[i % dirs.length];
          gsap.fromTo(pill, {
            opacity: 0, x: dir.x, y: dir.y, scale: 0.8
          }, {
            opacity: 1, x: 0, y: 0, scale: 1,
            duration: 0.65,
            delay: i * 0.07,
            ease: 'back.out(1.5)'
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  groups.forEach(g => observer.observe(g));
}
