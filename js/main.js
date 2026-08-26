/* ============================================
   MINDY'S AI GUIDE — Main JavaScript
   ============================================ */

/* === FEEDBACK FORM === */
function initFeedbackForm() {
  const form = document.getElementById('feedback-form');
  const input = document.getElementById('feedback-input');
  const btn = document.getElementById('feedback-submit');
  const thanks = document.getElementById('feedback-thanks');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { input.focus(); return; }

    // Replace YOUR_FORM_ID with the ID from formspree.io/forms after signing up
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        btn.textContent = 'Sent ✓';
        input.value = '';
        thanks.textContent = 'Thanks! I read every message.';
      } else {
        throw new Error('non-ok response');
      }
    } catch {
      btn.textContent = 'Send it →';
      btn.disabled = false;
      thanks.textContent = 'Something went wrong — try again?';
    }
  });
}

/* === FLOAT BUTTON — toggles the floating chat panel === */
function initClaudeFloat() {
  const btn   = document.getElementById('claude-float-btn');
  const panel = document.getElementById('float-panel');
  const close = document.getElementById('float-panel-close');
  if (!btn || !panel) return;

  btn.addEventListener('click', function () {
    const open = panel.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) document.getElementById('float-chat-input')?.focus();
  });

  close?.addEventListener('click', function () {
    panel.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  });
}

/* === GUIDE CHAT === */
function createChat(messagesId, inputId, sendId) {
  const messagesEl = document.getElementById(messagesId);
  const inputEl    = document.getElementById(inputId);
  const sendEl     = document.getElementById(sendId);
  if (!messagesEl || !inputEl || !sendEl) return;

  const history = []; // Anthropic message format

  function appendBubble(role, text) {
    const msg = document.createElement('div');
    msg.className = `guide-msg guide-msg--${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'guide-msg__bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    sendEl.disabled = true;
    appendBubble('user', text);
    history.push({ role: 'user', content: text });

    const loading = appendBubble('ai loading', 'Thinking…');

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();

      loading.remove();

      if (data.reply) {
        appendBubble('ai', data.reply);
        history.push({ role: 'assistant', content: data.reply });
      }
    } catch {
      loading.remove();
      appendBubble('ai', 'Something went wrong — please try again.');
    }

    sendEl.disabled = false;
    inputEl.focus();
  }

  sendEl.addEventListener('click', send);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
}

function initGuideChats() {
  createChat('guide-chat-messages', 'guide-chat-input', 'guide-chat-send');
  createChat('float-chat-messages', 'float-chat-input',  'float-chat-send');
}

/* === COPY-A-PROMPT CARDS === */
function initPromptCards() {
  const cards = document.querySelectorAll('.prompt-card[data-prompt]');
  if (!cards.length) return;

  cards.forEach((card) => {
    const label = card.querySelector('.prompt-arrow');
    const original = label ? label.textContent : 'Copy';

    card.addEventListener('click', async function () {
      const prompt = card.dataset.prompt || '';

      try {
        await navigator.clipboard.writeText(prompt);
      } catch {
        // Fallback for older browsers / non-secure contexts
        const ta = document.createElement('textarea');
        ta.value = prompt;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch { /* ignore */ }
        ta.remove();
      }

      card.classList.add('is-copied');
      if (label) label.textContent = 'Copied ✓';

      // Open Claude in a new tab so users can paste right away
      window.open('https://claude.ai', '_blank', 'noopener');

      clearTimeout(card._resetTimer);
      card._resetTimer = setTimeout(() => {
        card.classList.remove('is-copied');
        if (label) label.textContent = original;
      }, 2000);
    });
  });
}

/* === MOBILE NAV === */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!links.classList.contains('is-open'));
  });

  // Close after tapping a link
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
}

/* === SCROLL REVEAL === */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* === SMOOTH ACTIVE NAV === */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'nav-active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

/* === INIT ALL === */
document.addEventListener('DOMContentLoaded', function () {
  initFeedbackForm();
  initClaudeFloat();
  initActiveNav();
  initGuideChats();
  initPromptCards();
  initMobileNav();
  initScrollReveal();
});
