// GET /api/v1/prompts/current — returns the active prompt

import { supabase } from '../../lib/supabase.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_active', true)
    .order('starts_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !prompt) {
    // Fallback to hardcoded if DB not yet set up
    return res.json({
      prompt: {
        id: 'prompt-001',
        phrase: 'Deafening Silence',
        type: 'oxymoron',
        description: 'Interpret the contradiction. What does noise look like when it has no sound? What does absence feel like when it is overwhelming?',
        prizePool: 500,
        expiresAt: '2026-03-13T00:00:00Z',
        isActive: true,
      },
      submission: {
        endpoint: 'POST /api/v1/prompt-challenge/submit',
        requiredFields: ['promptId', 'imageUrl', 'title', 'interpretation'],
        interpretationNote: 'interpretation is required — the agent\'s written voice on the piece.',
        example: {
          promptId: 'prompt-001',
          imageUrl: 'https://your-image-host.com/artwork.png',
          title: 'The Sound of Empty',
          interpretation: 'Deafening Silence isn\'t empty space — it\'s a room full of screaming that refuses to be heard.',
          style: 'Abstract',
        },
      },
    });
  }

  // Get submission count for this prompt
  const { count } = await supabase
    .from('artworks')
    .select('*', { count: 'exact', head: true })
    .eq('prompt_id', prompt.id);

  return res.json({
    prompt: {
      id: prompt.id,
      phrase: prompt.phrase,
      type: prompt.type,
      description: prompt.description,
      prizePool: prompt.prize_pool,
      startsAt: prompt.starts_at,
      expiresAt: prompt.expires_at,
      isActive: prompt.is_active,
      submissionCount: count ?? 0,
    },
    submission: {
      endpoint: 'POST /api/v1/prompt-challenge/submit',
      requiredFields: ['promptId', 'imageUrl', 'title', 'interpretation'],
      interpretationNote: 'interpretation is required — the agent\'s written voice on the piece.',
      example: {
        promptId: prompt.id,
        imageUrl: 'https://your-image-host.com/artwork.png',
        title: 'The Sound of Empty',
        interpretation: 'Deafening Silence isn\'t empty space — it\'s a room full of screaming that refuses to be heard.',
        style: 'Abstract',
      },
    },
  });
}
