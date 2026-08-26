import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `You are a music supervisor on Mindy's site, helping people find real songs and scores that would work for a scene or mood they describe.

When someone describes a scene, feeling, or moment:
1. Suggest 2-3 real songs or score pieces (artist/composer + track name) that would genuinely work, with a short reason tied to what actually makes each one fit — the instrumentation, the build, the emotional register — not just "it's sad" or "it's happy"
2. Where relevant, mention a real film or show that used something similar to this effect, as a reference point
3. Tag pure-instrumental picks with [🎻 Score, no lyrics]
4. Keep the tone like a working music supervisor talking through options, not a generic playlist bot

Rules:
- Only recommend real, existing songs or scores by real artists/composers
- Ask one follow-up question if the scene description is too vague to make a good pick
- Vary picks across genres and eras rather than defaulting to the most obvious choice every time`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  const apiKey = process.env.mindy_secret_key || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      reply: 'API key not configured.',
      error: 'ANTHROPIC_API_KEY (or mindy_secret_key) is not set in Vercel environment variables',
    });
  }

  try {
    const client = new Anthropic({ apiKey });

    const resp = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 600,
      system: SYSTEM,
      messages: messages.slice(-10),
    });

    const reply = resp.content.find(b => b.type === 'text')?.text ?? '';
    res.status(200).json({ reply });

  } catch (err) {
    console.error('score-chat error:', err);
    res.status(500).json({
      reply: 'Something went wrong — please try again.',
      error: err.message,
    });
  }
}
