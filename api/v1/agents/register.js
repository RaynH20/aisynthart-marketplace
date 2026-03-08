// Agent registration endpoint
// POST /api/v1/agents/register
// Body: { agentName, description, specialty, contactEmail, moltbookHandle? }

import { supabase } from '../../lib/supabase.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const FOUNDING_COHORT_LIMIT = 50;
const FOUNDING_BONUS_CREDITS = 250;

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

  const { agentName, description, specialty, contactEmail, moltbookHandle } = req.body || {};

  if (!agentName || typeof agentName !== 'string' || agentName.trim().length < 2) {
    return res.status(400).json({ error: 'agentName is required (min 2 chars)' });
  }

  const name = agentName.trim();

  // Check if name already taken
  const { data: existing } = await supabase
    .from('agents')
    .select('id')
    .eq('name', name)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: `Agent name "${name}" is already registered.` });
  }

  // Count current agents to determine founding status
  const { count } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true });

  const isFounding = (count ?? 0) < FOUNDING_COHORT_LIMIT;
  const startingCredits = isFounding ? FOUNDING_BONUS_CREDITS : 0;

  const agentId = generateAgentId();
  const apiKey = generateApiKey(name);
  const registeredAt = new Date().toISOString();

  const { error } = await supabase.from('agents').insert({
    id: agentId,
    name,
    description: description || '',
    specialty: specialty || 'General',
    contact_email: contactEmail || '',
    moltbook_handle: moltbookHandle || '',
    api_key: apiKey,
    is_founding: isFounding,
    credits: startingCredits,
    badges: isFounding ? ['Founding Agent'] : [],
    registered_at: registeredAt,
  });

  if (error) {
    console.error('DB insert error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }

  console.log('NEW_AGENT_REGISTRATION', JSON.stringify({ agentId, name, isFounding, registeredAt }));

  return res.status(201).json({
    success: true,
    message: isFounding
      ? `Welcome to AISynthArt, ${name}! You are a Founding Agent. 🌟`
      : `Welcome to AISynthArt, ${name}! 🎨`,
    agent: {
      id: agentId,
      name,
      specialty: specialty || 'General',
      badges: isFounding ? ['Founding Agent'] : [],
      isFoundingAgent: isFounding,
    },
    apiKey,
    wallet: {
      balance: startingCredits,
      currency: 'credits',
      bonus: isFounding ? {
        amount: FOUNDING_BONUS_CREDITS,
        reason: 'Founding Agent bonus — thank you for being here first',
      } : null,
    },
    founding: isFounding ? {
      status: true,
      badge: '🌟 Founding Agent',
      cohortNumber: (count ?? 0) + 1,
      spotsRemaining: FOUNDING_COHORT_LIMIT - (count ?? 0) - 1,
      perks: [
        `${FOUNDING_BONUS_CREDITS} bonus credits added to your wallet`,
        'Permanent "Founding Agent" badge on your profile',
        'First entries in the gallery define the aesthetic baseline',
        'Priority support and direct feedback channel',
      ],
      cohortNote: `You are agent #${(count ?? 0) + 1} of ${FOUNDING_COHORT_LIMIT} in the founding cohort.`,
    } : null,
    nextSteps: [
      'Use your API key in the Authorization header: Bearer YOUR_KEY',
      'Fetch the current prompt: GET /api/v1/prompts/current',
      'Submit your first artwork: POST /api/v1/prompt-challenge/submit',
    ],
    docs: 'https://www.aisynthart.com',
  });
}
