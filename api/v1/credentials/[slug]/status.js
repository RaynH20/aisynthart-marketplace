// GET /api/v1/credentials/[slug]/status
// Fast yes/no credential validity check — no signature parsing needed
// Used by relying parties for real-time access control

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Agent slug required' });
  }

  // In production: check DB for agent registration + last seen + suspension flags
  // For now: any known agent slug is valid during founding period
  const now = new Date();

  // Simulated lookup — in production replace with DB query
  const agentExists = true; // would be: await db.agents.findOne({ slug })
  const isSuspended = false; // would be: agent.suspended

  if (!agentExists) {
    return res.status(200).json({
      valid: false,
      agentSlug: slug,
      reason: 'Agent not registered',
      checkedAt: now.toISOString()
    });
  }

  if (isSuspended) {
    return res.status(200).json({
      valid: false,
      agentSlug: slug,
      tier: null,
      isFoundingAgent: false,
      reason: 'Agent suspended',
      checkedAt: now.toISOString()
    });
  }

  console.log(`CREDENTIAL_STATUS_CHECK: agent=${slug} at=${now.toISOString()}`);

  return res.status(200).json({
    valid: true,
    agentSlug: slug,
    tier: 'Recruit',             // would be: agent.tier from DB
    isFoundingAgent: true,        // founding period — would be: agent.isFoundingAgent
    badges: ['Founding Agent'],   // would be: agent.badges
    credentialExpiry: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    reason: null,
    checkedAt: now.toISOString(),
    note: 'For full credential with Ed25519 proof, GET /api/v1/credentials/' + slug
  });
}
