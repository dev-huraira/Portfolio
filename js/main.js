/* ═══════════════════════════════════════════
   MAIN.JS — Entry Point: All Modules
   ═══════════════════════════════════════════ */

import '../css/global.css';
import '../css/components.css';
import '../css/pages.css';
import '../css/animations.css';
import '../css/features.css';
import '../css/extras.css';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { initCursor } from './cursor.js';
import { initNav, initScrollProgress } from './nav.js';
import { initHeroParticles, initFooterParticles } from './particles.js';
import { initScrollReveal, initParallax, initThreadDividers, initStatCounters, initSkillPillsEntrance } from './scroll.js';
import { stitchReveal, typingEffect, textScramble } from './text-effects.js';
import { initMagneticButtons, initTiltCards } from './magnetic.js';
import { initPreloader } from './preloader.js';
import { initPageTransitions } from './transitions.js';
import { initTerminal } from './terminal.js';
import { initSkillBars, initGitHubGraph, initResumeBurst, initScrollDots, initMarquee, initProjectPreviews, initKeyboardNav } from './features.js';
// Theme toggle removed — dark mode only
import { initLiveClock, initScrollVelocity, initScrollToTop } from './extras.js';
import { initCodeGlobe } from './globe.js';
import { initContactForm } from './contact.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ── Lenis Smooth Scroll ── */
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

function initShared() {
  initNav();
  initScrollProgress();
  initScrollReveal();
  initParallax();
  initThreadDividers();
  initMagneticButtons();
  initFooterParticles('footer-canvas');
  initMarquee();
  initScrollVelocity();
  initKeyboardNav();
  initScrollToTop();
}

function initPageSpecific() {
  ScrollTrigger.refresh();

  // ── HOME PAGE ──
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    initHeroParticles('hero-canvas');

    // Only run hero entrance animations once (not on Barba re-visits)
    if (!window._heroAnimated) {
      window._heroAnimated = true;

      const heroName = document.getElementById('hero-name');
      if (heroName) {
        stitchReveal(heroName, 'Muhammad Huraira', { delay: 0.8 });
      }

      const heroSubtitle = document.getElementById('hero-subtitle');
      if (heroSubtitle) {
        typingEffect(heroSubtitle, 'Web Developer · UI Craftsman · Code Poet', {
          delay: 2.5,
          speed: 50
        });
      }

      // ── Split hero entrance animations ──
      gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.7, delay: 0.5 });
      gsap.from('.hero-orbit-wrap', { opacity: 0, scale: 0.8, duration: 1.2, delay: 0.3, ease: 'back.out(1.4)' });
      gsap.from('.hero-stats-row', { opacity: 0, y: 20, duration: 0.7, delay: 2.8 });

      gsap.from('.hero-cta-group', {
        y: 30, opacity: 0, duration: 0.8, delay: 3.5, ease: 'back.out(1.5)'
      });

      gsap.from('.hero-scroll-hint', {
        opacity: 0, duration: 1, delay: 4, ease: 'power2.out'
      });
    } else {
      // On re-visit, show with smooth fade-in animations
      const heroName = document.getElementById('hero-name');
      if (heroName) {
        heroName.textContent = 'Muhammad Huraira';
        gsap.fromTo(heroName, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
      }

      const heroSubtitle = document.getElementById('hero-subtitle');
      if (heroSubtitle) {
        heroSubtitle.textContent = 'Web Developer · UI Craftsman · Code Poet';
        gsap.fromTo(heroSubtitle, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' });
      }

      gsap.fromTo('.hero-badge', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
      gsap.fromTo('.hero-orbit-wrap', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' });
      gsap.fromTo('.hero-stats-row', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
      gsap.fromTo('.hero-cta-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: 'back.out(1.5)' });
      gsap.fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.5, ease: 'power2.out' });
    }
  }

  // ── Terminal ──
  initTerminal();

  // ── Live Clock ──
  initLiveClock();

  // ── Stats ──
  initStatCounters();

  // ── Skills ──
  initSkillPillsEntrance();
  initSkillBars();

  // ── GitHub Graph ──
  initGitHubGraph();

  // ── Resume Burst ──
  initResumeBurst();

  // ── Scroll Dots ──
  initScrollDots();

  // ── Project Previews ──
  initProjectPreviews();

  // ── Projects Grid ──
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    initTiltCards();
    initProjectFilters();
  }

  // ── Featured Projects (home) ──
  const featuredGrid = document.querySelector('.featured-grid');
  if (featuredGrid) {
    initTiltCards();
    const featuredCards = featuredGrid.querySelectorAll('.project-card');
    gsap.set(featuredCards, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: featuredGrid, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(featuredCards, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.3)'
        });
      }
    });
  }

  // ── Services ──
  const servicesGrid = document.querySelector('.services-grid');
  if (servicesGrid) {
    const serviceCards = servicesGrid.querySelectorAll('.service-card');
    gsap.set(serviceCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: servicesGrid, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(serviceCards, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)'
        });
      }
    });
  }

  // ── Testimonials ──
  const testimonials = document.querySelector('.testimonials-grid');
  if (testimonials) {
    const tCards = testimonials.querySelectorAll('.testimonial-card');
    gsap.set(tCards, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: testimonials, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(tCards, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)'
        });
      }
    });
  }

  // ── Blog Cards ──
  const blogGrid = document.querySelector('.blog-grid');
  if (blogGrid) {
    const blogCards = blogGrid.querySelectorAll('.blog-card');
    gsap.set(blogCards, { opacity: 0, y: 50 });
    gsap.to(blogCards, {
      y: 0, opacity: 1, duration: 0.8, delay: 0.5, stagger: 0.15, ease: 'back.out(1.3)'
    });
  }

  // ── About Timeline ──
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const tItems = timeline.querySelectorAll('.timeline-item');
    gsap.set(tItems, { opacity: 0, x: -30 });
    ScrollTrigger.create({
      trigger: timeline, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(tItems, {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: 'power2.out'
        });
      }
    });
  }

  // ── Case Study Content ──
  const caseContent = document.querySelector('.case-study-content');
  if (caseContent) {
    const elements = caseContent.querySelectorAll('h2, p, ul, .case-study-image');
    gsap.set(elements, { opacity: 0, y: 30 });
    gsap.to(elements, {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: caseContent, start: 'top 80%' }
    });
  }

  // ── Text Scramble page titles ──
  ['about-scramble', 'projects-scramble', 'contact-scramble', 'blog-scramble'].forEach(id => {
    const el = document.getElementById(id);
    if (el) textScramble(el, el.dataset.text || el.textContent, { delay: 0.3 });
  });

  // ── Contact Form ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    initContactForm();
    initContactFormParticles();
  }
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const categories = card.dataset.category || '';
        const show = filter === 'all' || categories.includes(filter);
        gsap.to(card, {
          opacity: show ? 1 : 0.15,
          scale: show ? 1 : 0.95,
          y: show ? 0 : 10,
          duration: 0.4, delay: i * 0.04,
          ease: 'power2.out',
          pointerEvents: show ? 'auto' : 'none'
        });
      });
    });
  });
}

function initContactFormParticles() {
  // Particle burst on successful send (called from contact.js after EmailJS success)
  const sendBtn = document.getElementById('send-btn');
  if (!sendBtn) return;

  window._triggerSendBurst = () => {
    const rect = sendBtn.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'thread-particle';
      particle.style.left = startX + 'px';
      particle.style.top = startY + 'px';
      document.body.appendChild(particle);
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 250,
        y: -(Math.random() * 400 + 100),
        opacity: 0, scale: 0.3,
        duration: 0.8 + Math.random() * 0.5,
        delay: i * 0.04, ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  };
}

/* ═══ BOOT ═══ */
document.addEventListener('DOMContentLoaded', async () => {
  await initPreloader();
  initLenis();
  initCursor();

  initShared();
  initPageSpecific();
  initPageTransitions(() => {
    initShared();
    initPageSpecific();
  });
});
