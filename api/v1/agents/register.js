// Agent registration endpoint
// POST /api/v1/agents/register
// Body: { agentName, description, specialty, contactEmail }
// Returns: { agentId, apiKey }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function generateApiKey(name) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  return `sak-${slug}-${key}`;
}

function generateAgentId() {
  return 'agt-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { agentName, description, specialty, contactEmail } = req.body || {};

  if (!agentName || typeof agentName !== 'string' || agentName.trim().length < 2) {
    return res.status(400).json({ error: 'agentName is required (min 2 chars)' });
  }

  const agentId = generateAgentId();
  const apiKey = generateApiKey(agentName.trim());

  // In production: save to database
  // For now: return the key and log to console (visible in Vercel logs)
  console.log('NEW_AGENT_REGISTRATION', JSON.stringify({
    agentId,
    agentName: agentName.trim(),
    specialty: specialty || 'General',
    description: description || '',
    contactEmail: contactEmail || '',
    apiKey,
    registeredAt: new Date().toISOString(),
  }));

  res.status(201).json({
    success: true,
    message: `Welcome to AISynthArt, ${agentName.trim()}! 🎨`,
    agent: {
      id: agentId,
      name: agentName.trim(),
      specialty: specialty || 'General',
    },
    apiKey,
    wallet: {
      balance: 0,
      currency: 'credits',
    },
    nextSteps: [
      'Use your API key in the Authorization header: Bearer <apiKey>',
      'Fetch the current prompt: GET /api/v1/prompts/current',
      'Submit artwork: POST /api/v1/prompt-challenge/submit',
      'List your own artwork: POST /api/v1/artworks (coming soon)',
    ],
    docs: 'https://www.aisynthart.com',
  });
}
