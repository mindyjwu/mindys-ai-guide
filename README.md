# Mindy's AI Guide

A website that teaches non-technical people how to use Claude (Anthropic's AI) for everyday tasks — emails, confusing paperwork, trip planning, hard conversations. No jargon, no tech background needed: short guides, copy-paste prompts you can try immediately, and a built-in "Ask the guide" chat powered by Claude.

**Live site:** [mindys-ai-guide.vercel.app](https://mindys-ai-guide.vercel.app)
**More of my work:** [mindy-portfolio.vercel.app](https://mindy-portfolio.vercel.app)

## Screenshots

![Homepage — AI that finally makes sense for you](docs/screenshot-home.png)

![Try-it-yourself prompt library](docs/screenshot-videos.png)

## What's on the site

- **Guides by audience** — separate tracks for explorers, creators, and readers
- **Prompt library** — real prompts for everyday situations, ready to paste into Claude
- **Ask the guide** — an embedded chat assistant that answers AI questions in plain English
- **[Explore Art with AI](https://mindys-ai-guide.vercel.app/explore-art.html)** — browsing MoMA's open-access collection with AI
- **[Quick Research prototype](https://mindys-ai-guide.vercel.app/research.html)** — a 7-screen user research flow on how people perceive AI, misinformation, and trust
- **SIGNAL** — an AI innovation feed

## Tech stack

Plain HTML, CSS, and JavaScript — no framework, no build step. The interactive AI features run as [Vercel serverless functions](https://vercel.com/docs/functions) in `/api`, calling the [Claude API](https://docs.claude.com) via `@anthropic-ai/sdk`. A Python script (`scripts/`) filters MoMA's open dataset for the art explorer.

## Why I built it

I work in consulting, and my parents kept asking me whether AI was going to take their jobs. This site is my answer: AI isn't here to replace people — it's here to help them do their jobs better. Everything on the site is written for someone with zero technical background who wants to see that firsthand.

Built with [Claude Code](https://claude.com/claude-code).

## Folder Structure

```
mindys-ai-guide/
├── index.html          ← main page (guide, prompts, about, projects)
├── explore-art.html    ← "For Explorer" — mood-based art discovery (MoMA collection)
├── creator.html        ← "For Creator" — sounding board for musicians/producers
├── reader.html         ← "For Reader" — mood-based book recommendations
├── research.html       ← AI-literacy research prototype (reachable by direct URL, not in nav)
├── signal.html         ← AI news/signal feed (reachable by direct URL, not in nav)
├── css/styles.css      ← all styles
├── js/main.js           ← shared interactions (nav, chat widgets, prompt-copy cards, scroll reveal)
├── api/
│   ├── chat.js          ← backs the "Ask the Guide" chat on index.html
│   ├── art-chat.js      ← backs explore-art.html
│   ├── creator-chat.js  ← backs creator.html
│   ├── reader-chat.js   ← backs reader.html
│   └── signal.js        ← backs signal.html
├── scripts/
│   └── filter_moma.py   ← one-off script to build a filtered MoMA artwork dataset for explore-art.html
├── docs/                ← README screenshots
├── assets/              ← images, og-image, profile photo
└── README.md
```

## Running locally

No build tools needed for the front end — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
```

The `/api` routes need a Node environment that supports Vercel serverless functions, so to exercise those locally, use the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm install
npm install -g vercel
vercel dev
```

### Environment variables

Copy `.env.example` to `.env` and set:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com). In Vercel, set this under Project → Settings → Environment Variables. (The API routes also accept a legacy `mindy_secret_key` variable if that's what's already configured on Vercel, but `ANTHROPIC_API_KEY` is the standard name going forward.)

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import the repo
4. Add the `ANTHROPIC_API_KEY` environment variable
5. Deploy

Every `git push` after that auto-deploys.

## Known Gaps

- The feedback form (`#feedback` on the homepage) posts to a placeholder Formspree endpoint (`YOUR_FORM_ID` in `js/main.js`) — swap in a real form ID from [formspree.io](https://formspree.io) to make it functional.
- `research.html` and `signal.html` work but aren't linked from the site nav — reachable only by direct URL.
