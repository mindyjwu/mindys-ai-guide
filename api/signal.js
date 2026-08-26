// api/signal.js
// Vercel serverless function — keeps your Anthropic API key server-side
//
// Modes (all GET):
//   /api/signal                  → 5 mixed stories (legacy default)
//   /api/signal?batch=1|2|3      → 5 stories from that slice of industries
//   /api/signal?industry=legal   → 5 stories inside one industry (on-demand)
//   /api/signal?format=brief     → 3-story compact digest for the Morning Brief

const Anthropic = require('@anthropic-ai/sdk');

const INDUSTRIES = [
  'biotech', 'media', 'legal', 'hardware', 'software', 'agriculture',
  'finance', 'energy', 'manufacturing', 'education', 'space', 'defense',
  'mobility', 'gaming', 'retail', 'others',
];

// The feed fetches these three slices in parallel, so no single request has to
// find 15 stories inside one function timeout.
const BATCHES = {
  1: ['software', 'hardware', 'finance', 'media', 'legal'],
  2: ['biotech', 'energy', 'manufacturing', 'mobility', 'space'],
  3: ['agriculture', 'education', 'defense', 'gaming', 'retail', 'others'],
};

const LABELS = {
  biotech: 'Biotech & Health', media: 'Media & Creative', legal: 'Legal Tech',
  hardware: 'Hardware & Chips', software: 'Software & AI',
  agriculture: 'Agriculture & FoodTech', finance: 'Finance & Fintech',
  energy: 'Energy & Climate', manufacturing: 'Manufacturing & Robotics',
  education: 'Education & Research', space: 'Space & Aerospace',
  defense: 'Defense & Cyber', mobility: 'Mobility & Transport',
  gaming: 'Gaming & XR', retail: 'Retail & E-commerce', others: 'Other Industries',
};

const STORY_SHAPE = `{"industry":"software","company":"Real Company Name","headline":"Bold headline max 12 words","summary":"2-3 sentences with real numbers and why it matters now.","stat":"94%","statLabel":"accuracy rate","metricB":"$340M","metricBLabel":"Funding raised","metricC":"Q3 2026","metricCLabel":"Launch timeline","detail":"5-7 sentences: technical details, specific numbers, market implications, competitive landscape, what comes next.","readMinutes":6,"tags":["AI","Tag2","Tag3"],"source":"TechCrunch","url":"https://techcrunch.com/actual-article-path"}`;

const READ_TIME_RULE = `"readMinutes" is how long the SOURCE ARTICLE takes to read: estimate its word count and divide by 230 words per minute, rounded to a whole number. A short newswire item is 2-3, a standard feature is 5-8, a long investigation is 12+. Never copy the same number onto every story.`;

function feedPrompt(today, industries, count) {
  return `Today is ${today}. Use web_search to find exactly ${count} of the most significant AI and technology innovation news stories from the past 7 days.

Cover as many DIFFERENT industries as you can from this list, one story each where possible: ${industries.join(', ')}.
Map every story to one of those exact industry ids.

Find the ACTUAL article URL for each story (a specific article, not a homepage).
${READ_TIME_RULE}

Return ONLY valid JSON, nothing else before or after:
{"stories":[${STORY_SHAPE}],"meta":{"hottest":"software","totalFunding":"$X.XB","storiesFound":${count}}}

Find exactly ${count} stories. Every URL must point to a real, specific article.`;
}

function industryPrompt(today, id, count) {
  return `Today is ${today}. Use web_search to find exactly ${count} significant AI and technology innovation news stories from the past 14 days specifically in ${LABELS[id]} (industry id "${id}").

Every story must genuinely belong to ${LABELS[id]} — do not pad with generic AI news from other sectors. If there is less than ${count} weeks' worth of real news, return fewer stories rather than inventing any.
Set "industry" to "${id}" on every story.

Find the ACTUAL article URL for each story (a specific article, not a homepage).
${READ_TIME_RULE}

Return ONLY valid JSON, nothing else before or after:
{"stories":[${STORY_SHAPE}],"meta":{"hottest":"${id}","totalFunding":"$X.XB","storiesFound":${count}}}`;
}

function briefPrompt(today) {
  return `Today is ${today}. Use web_search to find the 3 AI and technology stories from the past 48 hours that a senior enterprise-AI consultant would most want to know before her first meeting of the day.

Favour stories with a concrete business consequence — funding, shipped product, regulation, a named enterprise deployment — over research announcements.
${READ_TIME_RULE}

Return ONLY valid JSON, nothing else before or after:
{"brief":{"date":"${today}","throughline":"One sentence naming the thread that connects the three stories.","stories":[{"industry":"software","headline":"Max 10 words","line":"One sentence: what happened and the number that matters.","soWhat":"One sentence on what it changes for someone advising enterprises on AI.","source":"Reuters","url":"https://...","readMinutes":4}]}}`;
}

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

// Estimate a read time from the text we do have, so a card never renders blank.
function fallbackMinutes(s) {
  const words = `${s.summary || ''} ${s.detail || ''}`.trim().split(/\s+/).length;
  return Math.max(2, Math.min(20, Math.round((words * 4) / 230)));
}

function cleanStory(s, forcedIndustry) {
  const industry = forcedIndustry || (INDUSTRIES.includes(s.industry) ? s.industry : 'others');
  const n = Number(s.readMinutes);
  const readMinutes = Number.isFinite(n) && n > 0
    ? Math.max(1, Math.min(20, Math.round(n)))
    : fallbackMinutes(s);
  return { ...s, industry, readMinutes };
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', 'https://mindys-ai-guide.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const today = new Date().toISOString().split('T')[0];
  const q = req.query || {};
  const format = String(q.format || '').toLowerCase();
  const industry = String(q.industry || '').toLowerCase();
  const batch = String(q.batch || '');

  let prompt, forcedIndustry = null, maxTokens = 4000;

  if (format === 'brief') {
    prompt = briefPrompt(today);
    maxTokens = 2000;
  } else if (industry) {
    if (!INDUSTRIES.includes(industry)) {
      return res.status(400).json({ error: `Unknown industry "${industry}"` });
    }
    prompt = industryPrompt(today, industry, 5);
    forcedIndustry = industry;
    maxTokens = 5000;
  } else if (BATCHES[batch]) {
    prompt = feedPrompt(today, BATCHES[batch], 5);
    maxTokens = 5000;
  } else {
    prompt = feedPrompt(today, INDUSTRIES, 5);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || process.env.mindy_secret_key });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: maxTokens,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    if (!text.trim()) throw new Error('Empty response from Claude');

    const data = extractJSON(text);

    if (format === 'brief') {
      const stories = (data.brief?.stories || []).map(s => cleanStory(s, null));
      return res.status(200).json({ brief: { ...data.brief, date: today, stories } });
    }

    data.stories = (data.stories || []).map(s => cleanStory(s, forcedIndustry));
    return res.status(200).json(data);

  } catch (err) {
    console.error('[/api/signal]', err);
    return res.status(500).json({ error: String(err) });
  }
};
