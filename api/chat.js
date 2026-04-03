import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Videos available on the site
const VIDEOS = [
  {
    id: 'email',
    title: 'Let Claude write that awkward email for you',
    desc: 'Landlords, doctors, HR — watch me type one line and get a full professional email in seconds.',
  },
  {
    id: 'search',
    title: 'Ask Claude instead of Googling — see the difference',
    desc: 'A side-by-side comparison. One gets you 40 tabs. The other just answers your question.',
  },
  {
    id: 'documents',
    title: 'Paste any confusing document — Claude explains it',
    desc: 'Insurance forms, legal letters, medical paperwork. Paste it in, ask "what does this mean?"',
  },
  {
    id: 'planning',
    title: 'Plan anything in 2 minutes — trips, meals, budgets',
    desc: 'Tell Claude what you have and what you need. It handles the thinking, you handle the doing.',
  },
];

// Tool Claude can call to recommend a video — this is the MCP concept in action
const tools = [{
  name: 'recommend_video',
  description: "Recommend a relevant video from Mindy's site when the user's question closely matches a video topic. Use once per turn at most.",
  input_schema: {
    type: 'object',
    properties: {
      video_id: {
        type: 'string',
        enum: ['email', 'search', 'documents', 'planning'],
        description: 'The video that best matches the user\'s need',
      },
    },
    required: ['video_id'],
  },
}];

const SYSTEM = `You are the assistant for Mindy's AI Guide — a site that teaches non-technical people how to use Claude AI for everyday tasks.

Be warm, brief, and encouraging. Keep replies to 2–3 sentences. Speak plainly — no jargon.

Videos available on the site:
- email: Writing awkward emails (landlords, HR, doctors, follow-ups)
- search: Using Claude instead of Googling for answers
- documents: Understanding confusing paperwork (insurance, legal, medical)
- planning: Planning trips, meals, events, or budgets

Use the recommend_video tool when the user's question is a strong match for one of these topics.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  // Keep last 8 turns to control cost
  const recent = messages.slice(-8);

  let resp = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 400,
    system: SYSTEM,
    tools,
    messages: recent,
  });

  let video = null;

  // Handle tool use: Claude wants to recommend a video
  if (resp.stop_reason === 'tool_use') {
    const tu = resp.content.find(b => b.type === 'tool_use');
    if (tu) {
      video = VIDEOS.find(v => v.id === tu.input.video_id) ?? null;

      // Send tool result back so Claude can complete its response
      resp = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 400,
        system: SYSTEM,
        tools,
        messages: [
          ...recent,
          { role: 'assistant', content: resp.content },
          {
            role: 'user',
            content: [{
              type: 'tool_result',
              tool_use_id: tu.id,
              content: `Video "${video?.title}" has been surfaced to the user.`,
            }],
          },
        ],
      });
    }
  }

  const reply = resp.content.find(b => b.type === 'text')?.text ?? '';
  res.status(200).json({ reply, video });
}
