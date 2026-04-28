/* ═══════════════════════════════════════════
   TEXT-EFFECTS.JS — Scramble, Stitch Reveal, Typing
   ═══════════════════════════════════════════ */

import gsap from 'gsap';

/**
 * Text Scramble Effect — Characters scramble through random symbols before resolving
 */
export function textScramble(element, finalText, options = {}) {
  const {
    duration = 1.5,
    delay = 0,
    chars = '!<>-_\\/[]{}—=+*^?#_abcdefghijklmnopqrstuvwxyz{}()<>/\\|',
    onComplete = () => {}
  } = options;

  let frame = 0;
  const totalFrames = Math.floor(duration * 60);
  const queue = [];

  for (let i = 0; i < finalText.length; i++) {
    const from = chars[Math.floor(Math.random() * chars.length)];
    const to = finalText[i];
    const start = Math.floor(Math.random() * (totalFrames * 0.6));
    const end = start + Math.floor(Math.random() * (totalFrames * 0.4)) + 10;
    queue.push({ from, to, start, end, char: '' });
  }

  let rafId;
  function update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      if (frame >= q.end) {
        complete++;
        q.char = q.to;
      } else if (frame >= q.start) {
        if (Math.random() < 0.28) {
          q.char = chars[Math.floor(Math.random() * chars.length)];
        }
      } else {
        q.char = '';
      }
      output += q.char;
    }

    element.textContent = output;

    if (complete === queue.length) {
      cancelAnimationFrame(rafId);
      onComplete();
      return;
    }

    frame++;
    rafId = requestAnimationFrame(update);
  }

  setTimeout(() => {
    rafId = requestAnimationFrame(update);
  }, delay * 1000);

  return () => cancelAnimationFrame(rafId);
}

/**
 * Stitch Reveal — Letters appear one by one with bounce-in + color shift
 */
export function stitchReveal(element, text, options = {}) {
  const {
    delay = 0,
    stagger = 0.06,
    onComplete = () => {}
  } = options;

  element.innerHTML = '';
  const chars = [];

  // Split into words — wrap each word in a nowrap span so letters never break
  const words = text.split(' ');
  words.forEach((word, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.whiteSpace = 'nowrap';
    wordSpan.style.display = 'inline-block';

    word.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      wordSpan.appendChild(span);
      chars.push(span);
    });

    element.appendChild(wordSpan);

    // Add a regular space between words (not inside nowrap span)
    if (wi < words.length - 1) {
      element.appendChild(document.createTextNode('\u00A0'));
    }
  });

  gsap.to(chars, {
    opacity: 1,
    duration: 0.06,
    stagger: stagger,
    delay: delay,
    ease: 'none',
  });

  chars.forEach((span, i) => {
    gsap.fromTo(span, {
      y: -8,
      scale: 1.3,
      color: '#00A3FF',
    }, {
      y: 0,
      scale: 1,
      color: '#FFFFFF',
      duration: 0.35,
      delay: delay + i * stagger,
      ease: 'back.out(2)',
      onComplete: i === chars.length - 1 ? onComplete : undefined,
    });
  });
}

/**
 * Typing Effect — Types text character by character
 */
export function typingEffect(element, text, options = {}) {
  const {
    speed = 55,
    delay = 0,
    showCursor = true,
    onComplete = () => {}
  } = options;

  let i = 0;
  element.innerHTML = showCursor ? '<span class="typing-cursor"></span>' : '';

  setTimeout(() => {
    function type() {
      if (i <= text.length) {
        element.innerHTML = text.slice(0, i) + (showCursor ? '<span class="typing-cursor"></span>' : '');
        i++;
        setTimeout(type, speed);
      } else {
        onComplete();
      }
    }
    type();
  }, delay * 1000);
}
