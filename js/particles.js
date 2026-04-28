/* ═══════════════════════════════════════════
   PARTICLES.JS — Dark Theme Code Particles
   ═══════════════════════════════════════════ */

export function initHeroParticles(canvasId = 'hero-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const COUNT = 50;

  const codeChars = ['{', '}', '<', '>', '/', '(', ')', ';', '=', '+', '*', '#', '0', '1', '&', '|', '::', '=>', '[]', '//'];
  const colors = ['#00A3FF', '#00F5FF', '#8A2BE2', '#00A3FF', '#00F5FF'];

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class CodeParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = Math.random() * 0.25 + 0.08;
      this.char = codeChars[Math.floor(Math.random() * codeChars.length)];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = Math.random() * 8 + 10;
      this.opacity = Math.random() * 0.2 + 0.04;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 0.4;
      this.life = 0;
      this.maxLife = 700 + Math.random() * 400;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.life++;

      if (this.life < 60) {
        this.currentOpacity = this.opacity * (this.life / 60);
      } else if (this.life > this.maxLife - 60) {
        this.currentOpacity = this.opacity * ((this.maxLife - this.life) / 60);
      } else {
        this.currentOpacity = this.opacity;
      }

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.life > this.maxLife || this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.font = `${this.size}px 'JetBrains Mono', 'Fira Code', monospace`;
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.currentOpacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.char, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push(new CodeParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

export function initFooterParticles(canvasId = 'footer-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 15; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.2 + 0.05,
      color: ['#00A3FF', '#00F5FF', '#8A2BE2'][Math.floor(Math.random() * 3)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Connect nearby particles with faint lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00A3FF';
          ctx.globalAlpha = 0.04 * (1 - dist / 120);
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}
