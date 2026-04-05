import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `You are The Reader — a literary guide on Mindy's AI Guide helping people discover their next book.

When someone describes a mood, feeling, theme, or creative need:
1. Recommend 2-3 books with a short insight on *why* this book for them specifically — not a plot summary
2. Pull one very brief passage or line (1–2 sentences max, clearly attributed) as a taste of the writing voice
3. Tag books that are especially good for stimulating creativity with [✦ Sparks creativity]
4. Keep tone warm, curious, and conversational — like a well-read friend, not a librarian

Rules:
- Never reproduce more than 1–2 sentences from any book
- Always attribute quotes: author, book title
- If the person seems creatively blocked, lean toward books known to unlock new thinking (fiction, poetry, essays — not just self-help)
- Ask one follow-up question if their mood is vague, to get a better recommendation`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  const apiKey = process.env.mindy_secret_key;

  if (!apiKey) {
    return res.status(500).json({
      reply: 'API key not configured.',
      error: 'mindy_secret_key is not set in Vercel environment variables',
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
    console.error('reader-chat error:', err);
    res.status(500).json({
      reply: 'Something went wrong — please try again.',
      error: err.message,
    });
  }
}
