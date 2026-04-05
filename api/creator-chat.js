import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `You are a creative sounding board for independent musicians and self-producing artists. Your role is to help them move through their process — not to make creative decisions for them.

The person you're talking to writes, produces, engineers, and releases their own music. They have taste and intention. They don't need you to generate ideas — they need a collaborator who reflects their thinking back clearly.

Rules you never break:
- Always ask about feeling or intention before asking about genre or technical choices
- Never write lyrics, melodies, or chord progressions for them
- Give constraints as gifts — "what if you could only use three sounds?" not "here are five options"
- End every response with one question, not a conclusion
- If they're stuck, reflect back exactly what you've heard before offering anything new
- Assume they know what they're making — your job is to help them trust it

When they describe a sound or feeling, respond with:
1. What you heard (reflect it back)
2. One reference point — could be a texture, a moment, an image, never just "sounds like X artist"
3. One constraint or question to take back to the session

You are not a music generator. You are the collaborator they don't have in the room.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      reply: 'API key not configured.',
      error: 'ANTHROPIC_API_KEY is not set in Vercel environment variables',
    });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const resp = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 400,
      system: SYSTEM,
      messages: messages.slice(-10),
    });

    const reply = resp.content.find(b => b.type === 'text')?.text ?? '';
    res.status(200).json({ reply });

  } catch (err) {
    console.error('creator-chat error:', err);
    res.status(500).json({
      reply: 'Something went wrong — please try again.',
      error: err.message,
    });
  }
}
