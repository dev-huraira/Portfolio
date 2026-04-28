/* ═══════════════════════════════════════════
   CONTACT.JS — EmailJS Form Handler
   ═══════════════════════════════════════════

   SETUP INSTRUCTIONS (one-time):
   1. Go to https://www.emailjs.com and create a free account
   2. Create an Email Service (Gmail recommended) → copy the Service ID
   3. Create an Email Template with variables:
      {{from_name}}, {{from_email}}, {{message}}
      → copy the Template ID
   4. Go to Account → copy your Public Key
   5. Replace the three placeholder values below with your real IDs
   ═══════════════════════════════════════════ */

import emailjs from '@emailjs/browser';

// ─── Replace these with your real EmailJS credentials ───
const EMAILJS_PUBLIC_KEY  = 'mutjvWbn0uprcgwXj';
const EMAILJS_SERVICE_ID  = 'service_33qdr7p';
const EMAILJS_TEMPLATE_ID = 'template_1jf9ysi';

export function initContactForm() {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('send-btn');
  const nameEl  = document.getElementById('contact-name');
  const emailEl = document.getElementById('contact-email');
  const msgEl   = document.getElementById('contact-message');

  if (!form || !btn) return;

  // Init EmailJS once
  emailjs.init(EMAILJS_PUBLIC_KEY);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const message = msgEl.value.trim();

    if (!name || !email || !message) return;

    // ── Sending state ──
    btn.disabled = true;
    btn.innerHTML = '<span>Sending ✦</span>';
    btn.style.opacity = '0.7';

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        message:    message,
        reply_to:   email,
      });

      // ── Success state ──
      btn.innerHTML = '<span>Sent! ✓</span>';
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg, #00c878, #00a368)';

      // Trigger particle burst
      if (typeof window._triggerSendBurst === 'function') window._triggerSendBurst();

      // Clear form
      form.reset();

      // Reset button after 4s
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<span>Send Message ✦</span>';
        btn.style.background = '';
        btn.style.opacity = '1';
      }, 4000);

    } catch (err) {
      console.error('EmailJS error:', err);

      // ── Error state ──
      btn.innerHTML = '<span>Failed — Try Again</span>';
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg, #ff3366, #cc0033)';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<span>Send Message ✦</span>';
        btn.style.background = '';
        btn.style.opacity = '1';
      }, 3000);
    }
  });
}
