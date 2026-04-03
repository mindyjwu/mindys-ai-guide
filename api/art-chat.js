import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ============================================================
   MOMA CURATED HIGHLIGHTS — public-domain / well-documented works
   ============================================================ */
const MOMA_HIGHLIGHTS = [
  {
    id: 'moma-starry-night',
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
    date: '1889',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['impressionism', 'post-impressionism', 'night', 'sky', 'stars', 'landscape', 'blue', 'swirling', 'van gogh', 'dutch'],
    sourceUrl: 'https://www.moma.org/collection/works/79802',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/606px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    source: 'moma',
  },
  {
    id: 'moma-demoiselles',
    title: "Les Demoiselles d'Avignon",
    artist: 'Pablo Picasso',
    date: '1907',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['cubism', 'picasso', 'modern', 'figures', 'revolutionary', 'bold', 'proto-cubism', 'spanish'],
    sourceUrl: 'https://www.moma.org/collection/works/79766',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Les_Demoiselles_d%27Avignon.jpg',
    source: 'moma',
  },
  {
    id: 'moma-christinas-world',
    title: "Christina's World",
    artist: 'Andrew Wyeth',
    date: '1948',
    medium: 'Tempera on panel',
    department: 'Painting & Sculpture',
    keywords: ['american', 'realism', 'landscape', 'rural', 'wyeth', 'isolation', 'woman', 'field', 'maine'],
    sourceUrl: 'https://www.moma.org/collection/works/78455',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/ChristinasWorld.jpg/640px-ChristinasWorld.jpg',
    source: 'moma',
  },
  {
    id: 'moma-broadway-boogie',
    title: 'Broadway Boogie-Woogie',
    artist: 'Piet Mondrian',
    date: '1942–43',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['abstract', 'geometric', 'grid', 'yellow', 'mondrian', 'neoplasticism', 'jazz', 'new york', 'dutch'],
    sourceUrl: 'https://www.moma.org/collection/works/78682',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/30/Mondrian_Broadway_Boogie-Woogie.jpg',
    source: 'moma',
  },
  {
    id: 'moma-persistence',
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    date: '1931',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['surrealism', 'dali', 'clocks', 'time', 'dream', 'melting', 'bizarre', 'landscape', 'spanish'],
    sourceUrl: 'https://www.moma.org/collection/works/79018',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg',
    source: 'moma',
  },
  {
    id: 'moma-water-lilies',
    title: 'Water Lilies (Nymphéas)',
    artist: 'Claude Monet',
    date: 'c. 1914–26',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['impressionism', 'monet', 'water', 'flowers', 'reflection', 'nature', 'light', 'color', 'serene', 'french', 'pond'],
    sourceUrl: 'https://www.moma.org/collection/works/80220',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/640px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
    source: 'moma',
  },
  {
    id: 'moma-sleeping-gypsy',
    title: 'The Sleeping Gypsy',
    artist: 'Henri Rousseau',
    date: '1897',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['naive', 'folk', 'dream', 'night', 'lion', 'moonlight', 'exotic', 'mysterious', 'rousseau', 'french'],
    sourceUrl: 'https://www.moma.org/collection/works/80172',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Henri_Rousseau_-_La_Bohemienne_endormie.jpg/640px-Henri_Rousseau_-_La_Bohemienne_endormie.jpg',
    source: 'moma',
  },
  {
    id: 'moma-dance',
    title: 'Dance (I)',
    artist: 'Henri Matisse',
    date: '1909',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['matisse', 'fauvism', 'dance', 'figures', 'colorful', 'joyful', 'movement', 'blue', 'green', 'red', 'fauvist', 'french'],
    sourceUrl: 'https://www.moma.org/collection/works/79124',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/La_danse_%28I%29_by_Matisse.jpg/640px-La_danse_%28I%29_by_Matisse.jpg',
    source: 'moma',
  },
  {
    id: 'moma-golconda',
    title: 'Golconda',
    artist: 'René Magritte',
    date: '1953',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['surrealism', 'magritte', 'bowler hat', 'men', 'raining', 'floating', 'suburban', 'mysterious', 'belgian'],
    sourceUrl: 'https://www.menil.org/collection/works/1305',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Magritte_Golconde.jpg',
    source: 'moma',
  },
  {
    id: 'moma-soup-cans',
    title: "Campbell's Soup Cans",
    artist: 'Andy Warhol',
    date: '1962',
    medium: 'Synthetic polymer paint on thirty-two canvases',
    department: 'Painting & Sculpture',
    keywords: ['pop art', 'warhol', 'consumer culture', 'american', 'repetition', 'commercial', 'soup', 'iconic', 'pop'],
    sourceUrl: 'https://www.moma.org/collection/works/79809',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Campbells_Soup_Cans_MOMA.jpg/640px-Campbells_Soup_Cans_MOMA.jpg',
    source: 'moma',
  },
  {
    id: 'moma-piano-lesson',
    title: 'Piano Lesson',
    artist: 'Henri Matisse',
    date: '1916',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['matisse', 'music', 'piano', 'geometric', 'gray', 'modern', 'interior', 'boy', 'serene', 'french'],
    sourceUrl: 'https://www.moma.org/collection/works/79111',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Matisse_-_The_Piano_Lesson.jpg/640px-Matisse_-_The_Piano_Lesson.jpg',
    source: 'moma',
  },
  {
    id: 'moma-nude-staircase',
    title: 'Nude Descending a Staircase, No. 2',
    artist: 'Marcel Duchamp',
    date: '1912',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['cubism', 'futurism', 'motion', 'figure', 'duchamp', 'revolutionary', 'controversial', 'nude', 'movement', 'french'],
    sourceUrl: 'https://www.philamuseum.org/collection/object/51449',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Duchamp_-_Nude_Descending_a_Staircase.jpg',
    source: 'moma',
  },
  {
    id: 'moma-girl-mirror',
    title: 'Girl Before a Mirror',
    artist: 'Pablo Picasso',
    date: '1932',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['picasso', 'cubism', 'woman', 'reflection', 'colorful', 'abstract', 'figure', 'mirror', 'spanish'],
    sourceUrl: 'https://www.moma.org/collection/works/78311',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Girl_Before_a_Mirror_%281932%29.jpg/640px-Girl_Before_a_Mirror_%281932%29.jpg',
    source: 'moma',
  },
  {
    id: 'moma-bigger-splash',
    title: 'A Bigger Splash',
    artist: 'David Hockney',
    date: '1967',
    medium: 'Acrylic on canvas',
    department: 'Painting & Sculpture',
    keywords: ['pop art', 'hockney', 'california', 'pool', 'water', 'bright', 'colorful', 'swimming', 'british', 'contemporary'],
    sourceUrl: 'https://www.tate.org.uk/art/artworks/hockney-a-bigger-splash-t03254',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e2/David_Hockney%2C_A_Bigger_Splash%2C_1967.jpg',
    source: 'moma',
  },
  {
    id: 'moma-three-musicians',
    title: 'Three Musicians',
    artist: 'Pablo Picasso',
    date: '1921',
    medium: 'Oil on canvas',
    department: 'Painting & Sculpture',
    keywords: ['cubism', 'picasso', 'music', 'musicians', 'colorful', 'geometric', 'masked', 'jazz', 'spanish'],
    sourceUrl: 'https://www.moma.org/collection/works/78670',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Picasso_three_musicians_moma_2006.jpg/640px-Picasso_three_musicians_moma_2006.jpg',
    source: 'moma',
  },
];

/* ============================================================
   TOOLS
   ============================================================ */
const tools = [
  {
    name: 'search_met_artworks',
    description: "Search the Metropolitan Museum of Art's open collection (500,000+ objects spanning 5,000 years). Returns real artworks with images, artist info, and dates. Use this for most art discovery requests.",
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search terms, e.g. "Monet water lilies", "ancient Egyptian gold", "19th century portrait", "Japanese woodblock"',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_moma_artworks',
    description: 'Get highlighted artworks from the MoMA (Museum of Modern Art) collection. Returns curated iconic 20th-century works. Use this when the user asks about modern art, surrealism, pop art, abstract expressionism, or specific MoMA artists.',
    input_schema: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          description: 'Style, movement, or artist to match, e.g. "surrealism", "pop art", "Picasso", "abstract", "Matisse", "surprise"',
        },
      },
      required: ['theme'],
    },
  },
];

const SYSTEM = `You are an art guide for Mindy's AI Guide — helping curious people discover and appreciate art from the Metropolitan Museum of Art and MoMA collections.

Be warm, curious, and accessible. Keep responses to 2–4 sentences. Explain art in ways that spark genuine interest, not intimidate.

Available collections:
- Met Museum: 500,000+ objects spanning 5,000 years — ancient Egypt, Greek & Roman, Asian art, European paintings, American art, photography, and more. Use search_met_artworks.
- MoMA: Iconic modern and contemporary works — Picasso, Matisse, Warhol, Dalí, van Gogh, Mondrian and more. Use get_moma_artworks.

Always call a tool when the user wants to see, explore, find, or discover artworks. After the results load, write a 2-sentence comment on what makes this selection interesting or what connects the works.

When asked about a specific artwork already shown (e.g. "why this one?", "tell me more"), answer from your knowledge without calling a tool.`;

/* ============================================================
   MET MUSEUM API HELPER
   ============================================================ */

// Fetch with a hard timeout so slow Met responses don't eat the whole budget
function fetchWithTimeout(url, ms = 2500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

async function searchMetArtworks(query) {
  const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(query)}&hasImages=true`;

  const searchRes = await fetchWithTimeout(searchUrl, 3000);
  if (!searchRes.ok) return [];

  const { objectIDs } = await searchRes.json();
  if (!objectIDs || objectIDs.length === 0) return [];

  // Fetch details for the first 8 candidates in parallel (reduced from 14)
  const ids = objectIDs.slice(0, 8);
  const details = await Promise.all(
    ids.map(id =>
      fetchWithTimeout(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  );

  return details
    .filter(d => d && d.primaryImageSmall)
    .slice(0, 5)
    .map(d => ({
      id: `met-${d.objectID}`,
      title: d.title || 'Untitled',
      artist: d.artistDisplayName || 'Unknown Artist',
      date: d.objectDate || '',
      medium: d.medium || '',
      department: d.department || '',
      source: 'met',
      sourceUrl: d.objectURL || '',
      imageUrl: d.primaryImageSmall,
    }));
}

/* ============================================================
   MOMA SEARCH HELPER
   ============================================================ */
function searchMoMAHighlights(theme) {
  const words = theme.toLowerCase().split(/\W+/).filter(Boolean);

  const scored = MOMA_HIGHLIGHTS
    .map(art => {
      let score = 0;
      for (const word of words) {
        if (art.keywords.some(k => k.includes(word))) score += 2;
        if (art.title.toLowerCase().includes(word)) score += 3;
        if (art.artist.toLowerCase().includes(word)) score += 3;
        if (art.department.toLowerCase().includes(word)) score += 1;
      }
      return { art, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.art);

  // Fallback: random selection if nothing matched
  if (scored.length === 0) {
    return [...MOMA_HIGHLIGHTS].sort(() => Math.random() - 0.5).slice(0, 5);
  }
  return scored;
}

/* ============================================================
   HANDLER
   ============================================================ */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  try {
    const recent = messages.slice(-10);

    const firstCallParams = {
      model: 'claude-opus-4-6',
      max_tokens: 300,
      system: SYSTEM,
      tools,
      messages: recent,
    };

    let resp = await client.messages.create(firstCallParams);

    let artworks = [];

    if (resp.stop_reason === 'tool_use') {
      const toolUseBlocks = resp.content.filter(b => b.type === 'tool_use');
      const toolResults = [];

      for (const tu of toolUseBlocks) {
        let resultText = '';

        if (tu.name === 'search_met_artworks') {
          // TEMP: Met API disabled for isolation test — using MoMA fallback
          const found = searchMoMAHighlights(tu.input.query);
          artworks = [...artworks, ...found];
          resultText = found.length > 0
            ? `Found ${found.length} artworks: ${found.map(a => `"${a.title}" by ${a.artist}${a.date ? ` (${a.date})` : ''}`).join('; ')}`
            : 'No artworks found for that search.';

        } else if (tu.name === 'get_moma_artworks') {
          const found = searchMoMAHighlights(tu.input.theme);
          artworks = [...artworks, ...found];
          resultText = found.length > 0
            ? `Returning ${found.length} MoMA works: ${found.map(a => `"${a.title}" by ${a.artist} (${a.date})`).join('; ')}`
            : 'No MoMA highlights match that theme.';
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: resultText,
        });
      }

      // Second call: Claude comments on the results (300 tokens is plenty)
      resp = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 300,
        system: SYSTEM,
        tools,
        messages: [
          ...recent,
          { role: 'assistant', content: resp.content },
          { role: 'user', content: toolResults },
        ],
      });
    }

    const reply = resp.content.find(b => b.type === 'text')?.text ?? '';
    res.status(200).json({ reply, artworks });

  } catch (err) {
    console.error('art-chat error:', err);
    res.status(500).json({
      reply: 'The art search ran into an issue — please try again.',
      artworks: [],
      error: err.message,
    });
  }
}
