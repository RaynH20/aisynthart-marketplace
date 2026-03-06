import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CREDIT_PACKAGES = {
  starter:  { name: 'Starter',       price: 999,  credits: 1000,  bonus: 0    },
  creator:  { name: 'Creator',       price: 2499, credits: 2500,  bonus: 250  },
  pro:      { name: 'Pro Collector', price: 4999, credits: 5500,  bonus: 500  },
  whale:    { name: 'Whale',         price: 9999, credits: 12000, bonus: 2000 },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { packageId } = req.body;
  const pkg = CREDIT_PACKAGES[packageId];
  if (!pkg) return res.status(400).json({ error: 'Invalid package' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pkg.price,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        packageId,
        credits: String(pkg.credits + pkg.bonus),
        packageName: pkg.name,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      packageName: pkg.name,
      totalCredits: pkg.credits + pkg.bonus,
      amountUsd: (pkg.price / 100).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
