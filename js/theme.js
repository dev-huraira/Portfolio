/* ═══════════════════════════════════════════
   THEME.JS — Dark/Light Mode Toggle
   ═══════════════════════════════════════════ */

export function initThemeToggle() {
  // Create toggle button
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.id = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Toggle theme');
  toggle.innerHTML = `
    <svg class="theme-icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg class="theme-icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  `;

  // Insert into navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const hamburger = navbar.querySelector('.hamburger');
    if (hamburger) {
      navbar.insertBefore(toggle, hamburger);
    } else {
      navbar.appendChild(toggle);
    }
  }

  // Get saved theme
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
    }

    // Animate toggle
    toggle.classList.add('animating');
    setTimeout(() => toggle.classList.remove('animating'), 500);
  });
}
