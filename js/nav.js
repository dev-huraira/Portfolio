/* ═══════════════════════════════════════════
   NAV.JS — Navigation, Mobile Drawer, Scroll Spy
   ═══════════════════════════════════════════ */

export function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!navbar) return;

  // Scroll shadow
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link - based on current page
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Check if it matches the current page
    if (currentPath.endsWith(href) || (href === '/index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
      link.classList.add('active');
    } else if (href === '/' && (currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('/index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Also check drawer links
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  // Mobile drawer
  function toggleDrawer() {
    if (!hamburger || !drawer || !overlay) return;
    const isOpen = drawer.classList.contains('open');
    hamburger.classList.toggle('active');
    drawer.classList.toggle('open');
    overlay.classList.toggle('visible');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('open')) return;
    hamburger.classList.remove('active');
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // × close button inside drawer
  const closeBtn = document.getElementById('drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // Smooth scroll for hash links on same page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeDrawer();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ═══════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════ */
export function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}
