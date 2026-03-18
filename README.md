# Mindy's AI Guide

A website that teaches non-technical people how to use AI (Claude) for everyday tasks — emails, documents, planning, and more.

**Live site:** [your-url-here.vercel.app](https://your-url-here.vercel.app)

---

## Folder Structure

```
mindys-ai-guide/
├── index.html          ← main page
├── css/
│   └── styles.css      ← all styles
├── js/
│   └── main.js         ← interactions (email form, video embeds, nav)
├── assets/             ← images, og-image, your photo
└── README.md
```

---

## Local Development

No build tools needed. Just open `index.html` in your browser, or use VS Code's Live Server extension for auto-reload:

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension
3. Right-click `index.html` → "Open with Live Server"

---

## Deploy to Vercel (free)

1. Push this repo to GitHub (make it public)
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your GitHub repo
4. Click Deploy — that's it

Every time you `git push`, Vercel auto-deploys. No config needed.

---

## How to Add a Real Video

When your first YouTube video is live:

1. Copy the YouTube video ID (the part after `?v=` in the URL)
2. Open `index.html`
3. Find the first `.video-card` and update `data-youtube="YOUR_VIDEO_ID"`:

```html
<a href="#" class="video-card" data-youtube="dQw4w9WgXcQ">
```

The JS in `main.js` handles the rest — clicking the card will embed the video.

---

## How to Add Your Photo

1. Add a photo file to `assets/mindy.jpg`
2. In `index.html`, find the `about-avatar` div and replace it:

```html
<img src="assets/mindy.jpg" alt="Mindy Wu" style="width:100%;border-radius:20px;object-fit:cover;aspect-ratio:1;">
```

---

## How to Hook Up the Email Form

The form in `js/main.js` is ready — just add your Beehiiv or Mailchimp endpoint.

**Beehiiv** (recommended — cleaner UX):
1. Create a free account at [beehiiv.com](https://beehiiv.com)
2. Go to Settings → API → copy your publication ID and API key
3. In `js/main.js`, replace the TODO comment with:

```js
await fetch('https://api.beehiiv.com/v2/publications/YOUR_PUB_ID/subscriptions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({ email, reactivate_existing: true, send_welcome_email: true })
});
```

---

## TODO Checklist

- [ ] Record and upload first video
- [ ] Add `data-youtube="..."` to first video card
- [ ] Add your photo to `assets/`
- [ ] Add `og:image` meta tag with a screenshot
- [ ] Hook up Beehiiv/Mailchimp to email form
- [ ] Buy a custom domain (optional but worth it)
- [ ] Add Google Analytics or Plausible (optional)
