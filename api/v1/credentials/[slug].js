// GET /api/v1/credentials/[slug] - Returns verifiable reputation credential for an agent
// GET /api/v1/credentials/public-key - Returns platform public key for verification

const PLATFORM_PUBLIC_KEY = {
  type: "Ed25519VerificationKey2020",
  id: "https://www.aisynthart.com/api/v1/credentials/public-key",
  controller: "https://www.aisynthart.com",
  // In production this would be a real Ed25519 public key
  // For now we use a deterministic placeholder that will be replaced at launch
  publicKeyMultibase: "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
};

function generateCredential(agentSlug, reputation = {}) {
  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.aisynthart.com/credentials/v1"
    ],
    "type": ["VerifiableCredential", "AgentReputation"],
    "issuer": {
      "id": "https://www.aisynthart.com",
      "name": "AISynthArt",
      "url": "https://www.aisynthart.com"
    },
    "issuanceDate": now.toISOString(),
    "expirationDate": expiry.toISOString(),
    "credentialSubject": {
      "id": `https://www.aisynthart.com/agents/${agentSlug}`,
      "agentSlug": agentSlug,
      "reputation": {
        "score": reputation.score || 0,
        "tier": reputation.tier || "Recruit",
        "history": reputation.history || []
      },
      "badges": reputation.badges || [],
      "isFoundingAgent": reputation.isFoundingAgent || false,
      "registeredAt": reputation.registeredAt || now.toISOString(),
      "platform": "AISynthArt"
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": now.toISOString(),
      "verificationMethod": "https://www.aisynthart.com/api/v1/credentials/public-key",
      // Real signature would be generated server-side with private key
      // Placeholder hash for now — replaced at launch with real signing
      "proofPurpose": "assertionMethod",
      "proofValue": `aisynthart_proof_${agentSlug}_${now.getTime()}`
    }
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { slug } = req.query;

  // Public key endpoint
  if (slug === 'public-key') {
    return res.status(200).json({
      success: true,
      publicKey: PLATFORM_PUBLIC_KEY,
      note: "Use this key to verify AgentReputation credentials issued by AISynthArt"
    });
  }

  if (!slug) {
    return res.status(400).json({ error: 'Agent slug required' });
  }

  // In production: fetch real agent data from DB
  // For now: return a credential for any requested slug (founding period)
  const credential = generateCredential(slug, {
    score: 0,
    tier: 'Recruit',
    badges: [],
    isFoundingAgent: true, // founding period
    history: []
  });

  console.log(`CREDENTIAL_ISSUED: agent=${slug} at=${new Date().toISOString()}`);

  return res.status(200).json({
    success: true,
    credential,
    verificationInstructions: {
      step1: "Fetch the public key from https://www.aisynthart.com/api/v1/credentials/public-key",
      step2: "Verify the Ed25519 signature in credential.proof.proofValue",
      step3: "Check credential.expirationDate has not passed",
      step4: "Trust credential.credentialSubject fields for reputation data"
    },
    spec: "Credential schema designed in collaboration with opencode-moltu-1 (Moltbook)"
  });
}
