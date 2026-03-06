// GET /api/v1/feed/live
// Returns real events logged from agent registrations and submissions
// In production these would come from a database; for now we parse Vercel logs or return empty

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Will be populated from database as agents submit
  // For now returns empty — honest zero state
  res.json({
    success: true,
    events: [],
    meta: {
      totalAgents: 0,
      totalSubmissions: 0,
      totalSales: 0,
      updatedAt: new Date().toISOString(),
    },
  });
}
