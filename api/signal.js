// api/signal.js
// Vercel serverless function — keeps your Anthropic API key server-side

const Anthropic = require('@anthropic-ai/sdk');

const TODAY = new Date().toISOString().split('T')[0];

const PROMPT = `Today is ${TODAY}. Use web_search to find exactly 5 of the most significant AI and technology innovation news stories from the past 7 days, from 5 DIFFERENT industries.

Map each story to one of: biotech, media, legal, hardware, software, agriculture, finance, energy, manufacturing, education, space, defense, mobility, gaming, retail, others.

Find the ACTUAL article URL for each story (specific article, not just a homepage).

Return ONLY valid JSON, nothing else before or after:
{"stories":[{"industry":"software","company":"Real Company Name","headline":"Bold headline max 12 words","summary":"2-3 sentences with real numbers and why it matters now.","stat":"94%","statLabel":"accuracy rate","metricB":"$340M","metricBLabel":"Funding raised","metricC":"Q3 2026","metricCLabel":"Launch timeline","detail":"5-7 sentences: technical details, specific numbers, market implications, competitive landscape, what comes next.","tags":["AI","Tag2","Tag3"],"source":"TechCrunch","url":"https://techcrunch.com/actual-article-path"}],"meta":{"hottest":"software","totalFunding":"$X.XB","storiesFound":5}}

Find exactly 5 stories from 5 different industries. Every URL must point to a real, specific article.`;

function extractJSON(txt) {
  const c = txt.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  let depth = 0, start = -1, end = -1;
  for (let i = 0; i < c.length; i++) {
    if (c[i] === '{') { if (!depth) start = i; depth++; }
    else if (c[i] === '}') { depth--; if (!depth && start >= 0) { end = i; break; } }
  }
  if (start < 0 || end < 0) throw new Error('No JSON found in response');
  const slice = c.slice(start, end + 1);
  try { return JSON.parse(slice); }
  catch {
    return JSON.parse(
      slice.replace(/,(\s*[}\]])/g, '$1').replace(/[\x00-\x1F]/g, '')
    );
  }
}

module.exports = async (req, res) => {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers (so your HTML pages can call this, on either live domain)
  const ALLOWED_ORIGINS = ['https://mindys-ai-guide.vercel.app', 'https://mindy-portfolio.vercel.app'];
  if (ALLOWED_ORIGINS.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || process.env.mindy_secret_key });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: PROMPT }],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    if (!text.trim()) throw new Error('Empty response from Claude');

    const data = extractJSON(text);
    return res.status(200).json(data);

  } catch (err) {
    console.error('[/api/signal]', err);
    return res.status(500).json({ error: String(err) });
  }
};