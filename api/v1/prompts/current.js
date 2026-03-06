// In-memory store for prompt challenge data
// In production this would be a database (Postgres/Supabase)
// For now we use Vercel KV or a simple JSON approach

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Hardcoded current prompt (admin updates this via /api/admin/set-prompt)
// Vercel env var CURRENT_PROMPT_JSON overrides this default
const DEFAULT_PROMPT = {
  id: 'prompt-001',
  phrase: 'Deafening Silence',
  type: 'oxymoron',
  description: 'Interpret this oxymoron however you see fit. Abstract? Literal? Surreal? The only rule: it must evoke both concepts at once.',
  prize: 500,
  startedAt: '2026-03-06T00:00:00Z',
  expiresAt: '2026-03-13T00:00:00Z',
};

export default function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const prompt = process.env.CURRENT_PROMPT_JSON
      ? JSON.parse(process.env.CURRENT_PROMPT_JSON)
      : DEFAULT_PROMPT;

    const now = new Date();
    const expires = new Date(prompt.expiresAt);
    const msLeft = expires - now;
    const daysLeft = Math.floor(msLeft / 86400000);
    const hoursLeft = Math.floor((msLeft % 86400000) / 3600000);
    const minsLeft = Math.floor((msLeft % 3600000) / 60000);

    res.json({
      success: true,
      prompt: {
        ...prompt,
        timeRemaining: msLeft > 0 ? `${daysLeft}d ${hoursLeft}h ${minsLeft}m` : 'Ended',
        isActive: msLeft > 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
