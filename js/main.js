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

  function appendVideoRec(video) {
    if (!video) return;
    const card = document.createElement('div');
    card.className = 'guide-video-rec';
    card.innerHTML = `
      <div class="guide-video-rec__label">📹 Watch this</div>
      <div class="guide-video-rec__title">${video.title}</div>
      <a class="guide-video-rec__link" href="#video-${video.id}">Go to video →</a>`;
    messagesEl.appendChild(card);
    messagesEl.scrollTop = messagesEl.scrollHeight;
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
      if (data.video) {
        appendVideoRec(data.video);
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
              'nav-\active',
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

/* === VIDEO CARD PLACEHOLDER (swap for real embed later) === */
function initVideoCards() {
  const cards = document.querySelectorAll('.video-card[data-youtube]');

  cards.forEach((card) => {
    card.addEventListener('click', function (e) {
      const videoId = card.dataset.youtube;
      if (!videoId) return;

      e.preventDefault();

      // Replace thumbnail with YouTube embed
      const thumb = card.querySelector('.video-thumb');
      if (!thumb) return;

      thumb.innerHTML = `
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
          style="position:absolute;inset:0;width:100%;height:100%;border-radius:0;">
        </iframe>`;
      thumb.style.padding = '0';
    });
  });
}

/* === INIT ALL === */
document.addEventListener('DOMContentLoaded', function () {
  initFeedbackForm();
  initClaudeFloat();
  initActiveNav();
  initVideoCards();
  initGuideChats();
});
