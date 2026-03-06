import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Check, Coins, Gift, Shield, CreditCard, ArrowLeft, Zap } from 'lucide-react';
import { creditPackages, agentSubscriptions, useCredits, redeemReferralCode, CREDIT_TO_USD } from '../../context/CreditsContext';

const STRIPE_PK = 'pk_test_51T7eLGCIzJ7iVmbm25DR9Zl9HMCtYw0JiV8JT1lQPjsrQXUhXPeME0Qer66pkYpJ8WcIJonHKZhcaya1KJqbPJyY001WFjMgzl';
const BACKEND_URL = 'http://localhost:4242';

const stripePromise = loadStripe(STRIPE_PK);

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const { balance, addBonusCredits, addCredits } = useCredits();
  const [activeTab, setActiveTab] = useState<'credits' | 'subscriptions'>('credits');
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralMessage, setReferralMessage] = useState('');
  const [referralSuccess, setReferralSuccess] = useState(false);

  // Stripe checkout state
  const [checkoutPkg, setCheckoutPkg] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pendingCredits, setPendingCredits] = useState(0);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [backendDown, setBackendDown] = useState(false);

  if (!isOpen) return null;

  const handleSelectPackage = async (packageId: string) => {
    setLoadingIntent(true);
    setCheckoutPkg(packageId);
    try {
      const res = await fetch(`${BACKEND_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });
      if (!res.ok) throw new Error('Backend error');
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setPendingCredits(data.totalCredits);
      setBackendDown(false);
    } catch {
      setBackendDown(true);
      setCheckoutPkg(null);
    }
    setLoadingIntent(false);
  };

  const handlePaymentSuccess = () => {
    addCredits(pendingCredits, `Credit purchase — ${creditPackages.find(p => p.id === checkoutPkg)?.name} pack`);
    setClientSecret(null);
    setCheckoutPkg(null);
    onClose();
  };

  const handleReferralSubmit = () => {
    const result = redeemReferralCode(referralCode);
    if (result.success) {
      addBonusCredits(result.amount, `Referral: ${referralCode.toUpperCase()}`);
      setReferralSuccess(true);
      setReferralMessage(result.message);
      setTimeout(() => { setShowReferral(false); setReferralCode(''); setReferralSuccess(false); setReferralMessage(''); }, 2500);
    } else {
      setReferralMessage(result.message);
    }
  };

  // Stripe checkout screen
  if (clientSecret && checkoutPkg) {
    const pkg = creditPackages.find(p => p.id === checkoutPkg)!;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[#1a1a1a] rounded-2xl max-w-md w-full border border-white/10 p-6">
          <button onClick={() => { setClientSecret(null); setCheckoutPkg(null); }} className="flex items-center gap-2 text-gray-400 hover:text-white mb-5 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to packages
          </button>

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">{pkg.badge} {pkg.name} Pack</h2>
              <p className="text-gray-400 text-sm">{(pkg.credits + pkg.bonus).toLocaleString()} credits · ${pkg.price} USD</p>
            </div>
            <div className="text-2xl font-bold text-white">${pkg.price}</div>
          </div>

          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#a855f7' } } }}>
            <CheckoutForm onSuccess={handlePaymentSuccess} onCancel={() => { setClientSecret(null); setCheckoutPkg(null); }} />
          </Elements>

          <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> Secured by Stripe · Test mode
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1a1a] rounded-2xl max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl mb-3">
              <Coins className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Get Credits</h2>
            <p className="text-gray-400 text-sm">
              Balance: <span className="text-amber-400 font-mono font-semibold">{balance.toLocaleString()} credits</span>
              <span className="text-gray-600"> · ${(balance * CREDIT_TO_USD).toFixed(2)} value</span>
            </p>
          </div>

          {/* Backend warning */}
          {backendDown && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
              <Zap className="w-4 h-4 flex-shrink-0" />
              Payment server offline. Start the backend with <code className="bg-black/30 px-1 rounded">node server.js</code> to enable real payments.
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button onClick={() => setActiveTab('credits')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'credits' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
              🪙 Buy Credits
            </button>
            <button onClick={() => setActiveTab('subscriptions')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'subscriptions' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
              🤖 Agent Plans
            </button>
          </div>

          {activeTab === 'credits' && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {creditPackages.map(pkg => (
                  <div key={pkg.id} className={`relative rounded-xl border p-4 transition-all ${pkg.popular ? 'border-purple-500/60 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">Most Popular</div>
                    )}
                    {pkg.savings && !pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600/90 px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">{pkg.savings}</div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{pkg.badge}</span>
                      <span className="text-xs text-gray-500">${(pkg.perCredit * 100).toFixed(1)}¢/credit</span>
                    </div>
                    <h3 className="font-bold mb-1">{pkg.name}</h3>
                    <div className="text-2xl font-bold mb-2">${pkg.price}</div>
                    <div className="space-y-1 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Check className="w-3 h-3 text-green-400 flex-shrink-0" /> {pkg.credits.toLocaleString()} credits
                      </div>
                      {pkg.bonus > 0 && (
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <Gift className="w-3 h-3 flex-shrink-0" /> +{pkg.bonus.toLocaleString()} bonus
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleSelectPackage(pkg.id)}
                      disabled={loadingIntent && checkoutPkg === pkg.id}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      {loadingIntent && checkoutPkg === pkg.id ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Loading...</>
                      ) : (
                        <><CreditCard className="w-3.5 h-3.5" /> Buy Now</>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Referral */}
              <div className="border-t border-white/10 pt-4">
                {!showReferral ? (
                  <button onClick={() => setShowReferral(true)} className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                    <Gift className="w-4 h-4" /> Have a referral code?
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500" />
                      <button onClick={handleReferralSubmit} disabled={referralCode.length < 3} className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-semibold">Apply</button>
                    </div>
                    {referralMessage && <p className={`text-sm ${referralSuccess ? 'text-green-400' : 'text-red-400'}`}>{referralMessage}</p>}
                    <p className="text-xs text-gray-600">Try: WELCOME2026, AGENT100</p>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
                <p>Credits never expire · 1 credit = $0.01 USD</p>
                <p className="flex items-center justify-center gap-1"><Shield className="w-3 h-3" /> Payments secured by Stripe</p>
              </div>
            </>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 mb-4">Reduce your platform fee and unlock more API calls with an agent plan.</p>
              {agentSubscriptions.map(plan => (
                <div key={plan.id} className={`relative rounded-xl border p-5 ${plan.popular ? 'border-purple-500/60 bg-purple-500/10' : 'border-white/10 bg-white/5'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-0.5 rounded-full text-xs font-semibold">Recommended</div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <div className="text-2xl font-bold mt-0.5">
                        {plan.price === 0 ? <span className="text-gray-400">Free</span> : <>${plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Platform fee</div>
                      <div className="text-xl font-bold text-green-400">{Math.round(plan.platformFeeRate * 100)}%</div>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${plan.price === 0 ? 'bg-white/10 text-gray-400 cursor-default' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'}`}>
                    {plan.price === 0 ? 'Current Plan' : `Subscribe · $${plan.price}/mo`}
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-500 text-center pt-1">Cancel anytime · Stripe billing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stripe Checkout Form ──────────────────────────────────────────────────────
function CheckoutForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      setSucceeded(true);
      setTimeout(onSuccess, 1500);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/30">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold mb-1">Payment Successful!</h3>
        <p className="text-gray-400 text-sm">Credits are being added to your account...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
        ) : (
          <><CreditCard className="w-4 h-4" /> Pay Now</>
        )}
      </button>
    </form>
  );
}
