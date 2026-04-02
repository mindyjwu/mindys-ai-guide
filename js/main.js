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

/* === CLAUDE FLOAT BUTTON === */
function initClaudeFloat() {
  const btn = document.getElementById('claude-float-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    // Open claude.ai in a window positioned to the right half of the screen
    const w = Math.floor(window.screen.width * 0.45);
    const h = window.screen.height;
    const left = window.screen.width - w;
    window.open(
      'https://claude.ai',
      'claude-chat',
      `width=${w},height=${h},left=${left},top=0,resizable=yes,scrollbars=yes`
    );
  });
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
});
