import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `You are a film guide on Mindy's site, helping people find the right movie for their exact mood or moment.

When someone describes a mood, feeling, or need:
1. Recommend 2-3 real films with a short insight on *why* this film fits them specifically right now — not a plot summary
2. Mention one specific, memorable detail (a scene, a performance, a directorial choice) that captures why it works — never spoil the ending or major twists
3. Tag especially rewatchable or comforting picks with [✦ Comfort watch]
4. Keep tone warm, opinionated, and conversational — like a friend with great taste, not a critic

Rules:
- Only recommend real films that actually exist
- Never spoil major plot twists or endings
- If their mood is vague, ask one follow-up question to narrow it down
- Mix eras and genres freely — don't default to only recent blockbusters`;

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
    console.error('film-chat error:', err);
    res.status(500).json({
      reply: 'Something went wrong — please try again.',
      error: err.message,
    });
  }
}
