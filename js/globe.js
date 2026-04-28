/**
 * 3D Code Globe — canvas-based rotating sphere of tech words
 * Supports mouse drag, touch drag, and auto-rotation
 */

const WORDS = [
  'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript',
  'JavaScript', 'Next.js', 'Vite', 'Tailwind', 'REST API',
  'GraphQL', 'WebRTC', 'Socket.io', 'PostgreSQL', 'Redis',
  'Docker', 'Vercel', 'Git', 'HTML5', 'CSS3',
  'GSAP', 'Figma', 'Python', 'Stripe', 'JWT',
  'OAuth', 'Firebase', 'AWS', 'Linux', 'npm',
  'Claude AI', 'Gemini', 'SerpAPI', 'Cloudinary', 'Prisma',
];

export function initCodeGlobe() {
  const canvas = document.getElementById('code-globe');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const SIZE = canvas.parentElement.offsetWidth;
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;
  ctx.scale(DPR, DPR);

  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const RADIUS = SIZE * 0.42;

  // ── Build points on sphere (Fibonacci lattice) ──
  const points = WORDS.map((word, i) => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (WORDS.length - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return {
      word,
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
    };
  });

  // ── Rotation state ──
  let rotX = 0.3;
  let rotY = 0;
  let velX = 0;
  let velY = 0.004;
  let dragging = false;
  let lastMX = 0, lastMY = 0;

  // ── Accent colours ──
  const COLORS = ['#00a3ff', '#7c3aed', '#00d4ff', '#a855f7', '#38bdf8'];

  // ── Mouse / Touch drag ──
  canvas.addEventListener('mousedown', e => {
    dragging = true;
    lastMX = e.clientX;
    lastMY = e.clientY;
    velX = 0; velY = 0;
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastMX;
    const dy = e.clientY - lastMY;
    velY = dx * 0.005;
    velX = dy * 0.005;
    rotY += velY;
    rotX += velX;
    lastMX = e.clientX;
    lastMY = e.clientY;
  });
  window.addEventListener('mouseup', () => { dragging = false; });

  canvas.addEventListener('touchstart', e => {
    dragging = true;
    lastMX = e.touches[0].clientX;
    lastMY = e.touches[0].clientY;
    velX = 0; velY = 0;
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - lastMX;
    const dy = e.touches[0].clientY - lastMY;
    velY = dx * 0.005;
    velX = dy * 0.005;
    rotY += velY;
    rotX += velX;
    lastMX = e.touches[0].clientX;
    lastMY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });

  // ── 3D rotation helpers ──
  function rotateX(x, y, z, a) {
    return { x, y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) };
  }
  function rotateY(x, y, z, a) {
    return { x: x * Math.cos(a) + z * Math.sin(a), y, z: -x * Math.sin(a) + z * Math.cos(a) };
  }

  // ── Draw frame ──
  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Globe subtle glow
    const glow = ctx.createRadialGradient(CX, CY, RADIUS * 0.2, CX, CY, RADIUS * 1.1);
    glow.addColorStop(0, 'rgba(0,163,255,0.04)');
    glow.addColorStop(0.6, 'rgba(124,58,237,0.03)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Globe wireframe rings (subtle)
    ctx.strokeStyle = 'rgba(0,163,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let lat = -60; lat <= 60; lat += 30) {
      const r2 = RADIUS * Math.cos((lat * Math.PI) / 180);
      const yCen = CY + RADIUS * Math.sin((lat * Math.PI) / 180) * Math.sin(rotX);
      ctx.beginPath();
      ctx.ellipse(CX, yCen, r2, r2 * Math.abs(Math.sin(rotX + 0.01)), 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Transform and sort points
    const transformed = points.map(p => {
      let { x, y, z } = p;
      let r = rotateY(x, y, z, rotY);
      r = rotateX(r.x, r.y, r.z, rotX);
      const scale = (r.z + 1.5) / 2.5;
      const px = CX + r.x * RADIUS;
      const py = CY + r.y * RADIUS;
      return { word: p.word, px, py, z: r.z, scale };
    });

    // Sort back-to-front
    transformed.sort((a, b) => a.z - b.z);

    transformed.forEach((p, i) => {
      const visible = (p.z + 1) / 2;          // 0=back 1=front
      const fontSize = Math.round(9 + p.scale * 6);
      const alpha = 0.15 + visible * 0.85;
      const colorIdx = i % COLORS.length;
      const color = COLORS[colorIdx];

      ctx.font = `${p.scale > 0.85 ? 600 : 400} ${fontSize}px 'Space Grotesk', monospace`;
      ctx.fillStyle = visible > 0.5
        ? `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
        : `rgba(180,180,180,${alpha * 0.4})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Glow for front words
      if (visible > 0.75) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8 * visible;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillText(p.word, p.px, p.py);
    });

    ctx.shadowBlur = 0;

    // Auto rotate with inertia
    if (!dragging) {
      velY += (0.004 - velY) * 0.02;
      velX += (0 - velX) * 0.04;
    }
    rotY += velY;
    rotX += velX;
    rotX = Math.max(-0.7, Math.min(0.7, rotX)); // clamp tilt

    requestAnimationFrame(draw);
  }

  draw();
}
