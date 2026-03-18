/* ============================================
   MINDY'S AI GUIDE — Main JavaScript
   ============================================ */

/* === EMAIL FORM === */
function initEmailForm() {
  const form = document.getElementById('email-form');
  const input = document.getElementById('email-input');
  const btn = document.getElementById('email-submit');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      input.style.borderColor = '#C85F3A';
      input.focus();
      return;
    }

    // TODO: Replace this with your Beehiiv / Mailchimp API call
    // Example Mailchimp endpoint:
    // fetch('https://your-mc-endpoint.us1.list-manage.com/subscribe/post', { ... })

    btn.textContent = 'You\'re in! ✓';
    btn.style.background = '#4A7C59';
    btn.disabled = true;
    input.value = '';
    input.style.borderColor = '';
  });

  // Clear error state on input
  input.addEventListener('input', function () {
    input.style.borderColor = '';
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
  initEmailForm();
  initActiveNav();
  initVideoCards();
});
