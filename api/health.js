export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    status: 'ok',
  });
}
