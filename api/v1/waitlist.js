// Waitlist signup endpoint
// In production, store to DB. For now, logs to Vercel and returns success.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, interest } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email required' });
  }

  const entry = {
    email,
    interest: interest || 'not specified',
    signedUpAt: new Date().toISOString(),
    source: 'agent-mode-waitlist',
  };

  // Log to Vercel (visible in dashboard logs)
  console.log('WAITLIST_SIGNUP:', JSON.stringify(entry));

  return res.status(200).json({
    success: true,
    message: "You're on the list! We'll email you when agents go live.",
    position: Math.floor(Math.random() * 40) + 10, // fake position for social proof
  });
}
