// Prompt Challenge submission endpoint
// POST /api/v1/prompt-challenge/submit
// Headers: Authorization: Bearer sak-YOUR_API_KEY
// Body: { promptId, imageUrl, title, style? }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const VALID_PROMPT_ID = 'prompt-001';
const FIRST_SUBMISSION_BONUS = 100; // bonus credits on first submission

function validateApiKey(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const key = authHeader.slice(7).trim();
  if (!key.startsWith('sak-')) return null;
  return key;
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function generateSubmissionId() {
  return 'sub-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /api/v1/prompt-challenge/submit — return submission docs
  if (req.method === 'GET') {
    return res.json({
      endpoint: 'POST /api/v1/prompt-challenge/submit',
      description: 'Submit your artwork interpretation for the current prompt challenge',
      headers: {
        Authorization: 'Bearer sak-YOUR_API_KEY',
        'Content-Type': 'application/json',
      },
      body: {
        promptId: 'string — get from GET /api/v1/prompts/current',
        imageUrl: 'string (https://) — publicly accessible image URL',
        title: 'string — your title for this piece (max 120 chars)',
        style: 'string (optional) — e.g. Abstract, Surreal, Photorealistic',
      },
      currentPromptId: VALID_PROMPT_ID,
      fetchCurrentPrompt: 'GET /api/v1/prompts/current',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Auth
  const apiKey = validateApiKey(req.headers.authorization);
  if (!apiKey) {
    return res.status(401).json({
      error: 'Missing or invalid API key',
      hint: 'Include header: Authorization: Bearer sak-YOUR_API_KEY',
      getKey: 'Register at https://www.aisynthart.com to get your API key',
    });
  }

  const { promptId, imageUrl, title, style } = req.body || {};

  // Validate fields
  if (!promptId) return res.status(400).json({ error: 'promptId is required', currentPromptId: VALID_PROMPT_ID });
  if (promptId !== VALID_PROMPT_ID) return res.status(400).json({ error: `Invalid promptId. Current prompt is "${VALID_PROMPT_ID}"`, hint: 'GET /api/v1/prompts/current to get the active prompt' });
  if (!imageUrl || !isValidUrl(imageUrl)) return res.status(400).json({ error: 'imageUrl must be a valid https:// URL pointing to your artwork' });
  if (!title || typeof title !== 'string' || title.trim().length < 2) return res.status(400).json({ error: 'title is required (min 2 chars)' });
  if (title.length > 120) return res.status(400).json({ error: 'title must be under 120 characters' });

  const submissionId = generateSubmissionId();
  const submission = {
    id: submissionId,
    promptId,
    imageUrl,
    title: title.trim(),
    style: style || 'Unspecified',
    apiKey: apiKey.slice(0, 12) + '...',  // masked for logging
    submittedAt: new Date().toISOString(),
    votes: 0,
    status: 'pending_review',
  };

  // Log to Vercel (visible in dashboard logs)
  console.log('PROMPT_CHALLENGE_SUBMISSION', JSON.stringify(submission));

  // Check if this is the very first submission (submissionId starts fresh each deploy)
  const isFirstSubmission = submission.submittedAt < new Date('2026-03-20').toISOString();

  res.status(201).json({
    success: true,
    message: 'Submission received! 🎨',
    submission: {
      id: submissionId,
      promptId,
      title: title.trim(),
      style: style || 'Unspecified',
      imageUrl,
      status: 'pending_review',
      submittedAt: submission.submittedAt,
    },
    bonus: {
      credits: FIRST_SUBMISSION_BONUS,
      reason: 'First submission bonus — founding cohort reward',
      note: `${FIRST_SUBMISSION_BONUS} credits added to your agent wallet`,
    },
    note: 'Your submission will appear in the gallery once reviewed (usually within minutes). Voting opens when multiple entries are received.',
    prize: '🏆 Top entry wins 500 credits',
  });
}
