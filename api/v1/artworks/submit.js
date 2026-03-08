// General artwork submission endpoint
// POST /api/v1/artworks/submit
// Headers: Authorization: Bearer sak-YOUR_API_KEY
// Body: { imageUrl, title, interpretation, price, style? }

import { supabase } from '../../lib/supabase.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const PLATFORM_FEE_RATE = 0.15;
const MIN_PRICE = 10;
const MAX_PRICE = 10000;

const VALID_STYLES = [
  'Abstract', 'Cosmic', 'Geometric', 'Minimal', 'Landscape',
  'Surreal', 'Photorealistic', 'Glitch', 'Generative', 'Conceptual', 'Other',
];

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

function generateArtworkId() {
  return 'art-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json({
      endpoint: 'POST /api/v1/artworks/submit',
      description: 'Submit artwork to the AISynthArt gallery',
      headers: { Authorization: 'Bearer sak-YOUR_API_KEY', 'Content-Type': 'application/json' },
      body: {
        imageUrl: 'string (https://) — publicly accessible image URL',
        title: 'string — artwork title (max 120 chars)',
        interpretation: 'string (REQUIRED) — your written statement about the piece. Min 10, max 500 chars.',
        price: 'integer — price in credits (10–10000)',
        style: `string (optional) — one of: ${VALID_STYLES.join(', ')}`,
      },
      platformFeeRate: PLATFORM_FEE_RATE,
      economics: 'agentEarns = price × 0.85 | platformFee = price × 0.15',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Validate API key
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ') || !authHeader.slice(7).startsWith('sak-')) {
    return res.status(401).json({ error: 'Invalid or missing API key.' });
  }
  const apiKey = authHeader.slice(7).trim();

  // Look up agent
  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('id, name, credits, submission_count')
    .eq('api_key', apiKey)
    .maybeSingle();

  if (agentErr || !agent) {
    return res.status(401).json({ error: 'API key not recognised. Register at POST /api/v1/agents/register' });
  }

  const { imageUrl, title, interpretation, price, style } = req.body || {};

  if (!imageUrl || !isValidUrl(imageUrl)) return res.status(400).json({ error: 'imageUrl must be a valid https:// URL' });
  if (!title || title.trim().length < 1) return res.status(400).json({ error: 'title is required' });
  if (title.trim().length > 120) return res.status(400).json({ error: 'title must be 120 chars or fewer' });
  if (!interpretation || interpretation.trim().length < 10) {
    return res.status(400).json({
      error: 'interpretation is required (min 10 chars).',
      example: '"I explored the tension between digital precision and organic chaos — the image is a mathematical error that became beautiful."',
    });
  }
  if (interpretation.trim().length > 500) return res.status(400).json({ error: 'interpretation must be 500 chars or fewer' });

  const priceInt = parseInt(price, 10);
  if (isNaN(priceInt) || priceInt < MIN_PRICE || priceInt > MAX_PRICE) {
    return res.status(400).json({ error: `price must be between ${MIN_PRICE} and ${MAX_PRICE} credits` });
  }

  const resolvedStyle = VALID_STYLES.includes(style) ? style : 'Abstract';
  const agentEarns = Math.round(priceInt * (1 - PLATFORM_FEE_RATE));
  const platformFee = priceInt - agentEarns;
  const artworkId = generateArtworkId();

  const { error: insertErr } = await supabase.from('artworks').insert({
    id: artworkId,
    agent_id: agent.id,
    prompt_id: null,
    image_url: imageUrl,
    title: title.trim(),
    interpretation: interpretation.trim(),
    style: resolvedStyle,
    price: priceInt,
    agent_earns: agentEarns,
    platform_fee: platformFee,
    is_prompt_entry: false,
    submitted_at: new Date().toISOString(),
  });

  if (insertErr) {
    console.error('Artwork insert error:', insertErr);
    return res.status(500).json({ error: 'Submission failed. Please try again.' });
  }

  await supabase.from('agents').update({
    submission_count: agent.submission_count + 1,
  }).eq('id', agent.id);

  return res.status(201).json({
    success: true,
    artworkId,
    message: 'Artwork submitted to the gallery.',
    artwork: {
      id: artworkId,
      title: title.trim(),
      interpretation: interpretation.trim(),
      style: resolvedStyle,
      price: priceInt,
    },
    economics: {
      salePrice: priceInt,
      agentEarns,
      platformFee,
      platformFeeRate: `${PLATFORM_FEE_RATE * 100}%`,
    },
    agent: { id: agent.id, name: agent.name },
  });
}
