/* ═══════════════════════════════════════════
   TERMINAL.JS — Interactive Auto-Typing Terminal
   ═══════════════════════════════════════════ */

export function initTerminal() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  const output = terminal.querySelector('.terminal-output');
  if (!output) return;

  const commands = [
    { cmd: 'whoami', result: 'Muhammad Huraira' },
    { cmd: 'cat skills.txt', result: 'React · Next.js · Node.js · MongoDB · TypeScript · GSAP · Figma' },
    { cmd: 'ls projects/', result: 'findra/  sharepulse/  pixaura/  fashionstore/' },
    { cmd: 'cat status.txt', result: '🟢 Available for freelance & full-time opportunities' },
    { cmd: 'echo $MOTTO', result: '"Clean code. Stunning design. Zero compromises."' },
  ];

  let cmdIndex = 0;
  let charIndex = 0;
  let isTypingCmd = true;
  let currentLine = null;
  let resultLine = null;

  function createPromptLine() {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = '<span class="terminal-prompt">visitor@huraira</span><span class="terminal-separator">:</span><span class="terminal-path">~</span><span class="terminal-dollar">$</span> <span class="terminal-cmd"></span><span class="terminal-cursor">█</span>';
    output.appendChild(line);
    return line;
  }

  function createResultLine(text) {
    const line = document.createElement('div');
    line.className = 'terminal-result';
    line.textContent = text;
    line.style.opacity = '0';
    output.appendChild(line);
    requestAnimationFrame(() => { line.style.opacity = '1'; });
    return line;
  }

  function typeNext() {
    if (cmdIndex >= commands.length) {
      // Show final blinking cursor
      const finalLine = createPromptLine();
      return;
    }

    const { cmd, result } = commands[cmdIndex];

    if (isTypingCmd) {
      if (charIndex === 0) {
        currentLine = createPromptLine();
      }

      const cmdSpan = currentLine.querySelector('.terminal-cmd');
      const cursor = currentLine.querySelector('.terminal-cursor');

      if (charIndex < cmd.length) {
        cmdSpan.textContent = cmd.slice(0, charIndex + 1);
        charIndex++;
        setTimeout(typeNext, 40 + Math.random() * 60);
      } else {
        // Done typing command, show result
        cursor.remove();
        isTypingCmd = false;
        charIndex = 0;
        setTimeout(typeNext, 300);
      }
    } else {
      // Show result
      createResultLine(result);
      // Auto-scroll terminal
      output.scrollTop = output.scrollHeight;
      
      cmdIndex++;
      isTypingCmd = true;
      charIndex = 0;
      setTimeout(typeNext, 800);
    }
  }

  // Start typing when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(typeNext, 600);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(terminal);
}
