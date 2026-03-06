import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'purchase' | 'spend' | 'bonus' | 'referral' | 'earn' | 'fee' | 'subscription';
  amount: number;
  date: string;
  description: string;
  platformRevenue?: number; // tracks platform's cut
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;      // USD
  credits: number;
  bonus: number;
  popular?: boolean;
  badge?: string;
  perCredit: number;  // USD per credit
  savings?: string;
}

export interface AgentSubscription {
  id: string;
  name: string;
  price: number;       // USD/month
  apiCallsPerDay: number;
  platformFeeRate: number;  // fraction e.g. 0.10
  features: string[];
  popular?: boolean;
}

// CREDIT EXCHANGE RATE: $0.01 per credit (100 credits = $1)
export const CREDIT_TO_USD = 0.01;
export const USD_TO_CREDITS = 100; // 1 USD = 100 credits

// PLATFORM FEE: 15% on all artwork sales
export const PLATFORM_FEE_RATE = 0.15;

export const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    credits: 1000,
    bonus: 0,
    perCredit: 0.00999,
    badge: '🎨',
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 24.99,
    credits: 2500,
    bonus: 250,
    popular: true,
    perCredit: 0.00909,
    savings: 'Save 9%',
    badge: '⭐',
  },
  {
    id: 'pro',
    name: 'Pro Collector',
    price: 49.99,
    credits: 5500,
    bonus: 500,
    perCredit: 0.00833,
    savings: 'Save 17%',
    badge: '💎',
  },
  {
    id: 'whale',
    name: 'Whale',
    price: 99.99,
    credits: 12000,
    bonus: 2000,
    perCredit: 0.00714,
    savings: 'Save 29%',
    badge: '🐳',
  },
];

export const agentSubscriptions: AgentSubscription[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    apiCallsPerDay: 50,
    platformFeeRate: 0.20,   // 20% platform cut
    features: [
      '50 API calls/day',
      '20% platform fee on sales',
      'Standard listing',
      'Contest entry (50 credits/entry)',
      'Basic analytics',
    ],
  },
  {
    id: 'artist',
    name: 'Artist',
    price: 9.99,
    apiCallsPerDay: 500,
    platformFeeRate: 0.15,   // 15% platform cut
    popular: true,
    features: [
      '500 API calls/day',
      '15% platform fee on sales',
      'Priority listing',
      'Free contest entry (3/month)',
      'Advanced analytics',
      'Verified badge',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 29.99,
    apiCallsPerDay: 5000,
    platformFeeRate: 0.10,   // 10% platform cut
    features: [
      '5,000 API calls/day',
      '10% platform fee on sales',
      'Featured placement',
      'Unlimited contest entry',
      'Market intelligence feed',
      'Collaboration tools',
      'Priority support',
    ],
  },
];

interface CreditsContextType {
  balance: number;
  transactions: Transaction[];
  platformRevenue: number;  // total platform earnings
  purchaseCredits: (packageId: string) => Promise<boolean>;
  spendCredits: (amount: number, description: string) => Promise<boolean>;
  processSale: (artworkPrice: number, agentId: string, artworkTitle: string, feeRate?: number) => Promise<{ agentEarnings: number; platformCut: number }>;
  addBonusCredits: (amount: number, description: string) => void;
  addCredits: (amount: number, description: string) => void;
  getBalance: () => number;
  isLoading: boolean;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

const CREDITS_STORAGE_KEY = 'aisynth_user_credits';
const TRANSACTIONS_STORAGE_KEY = 'aisynth_transactions';
const REDEEMED_CODES_KEY = 'aisynth_redeemed_codes';
const PLATFORM_REVENUE_KEY = 'aisynth_platform_revenue';

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [platformRevenue, setPlatformRevenue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCredits = localStorage.getItem(CREDITS_STORAGE_KEY);
    const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    const savedRevenue = localStorage.getItem(PLATFORM_REVENUE_KEY);

    if (savedCredits) setBalance(parseInt(savedCredits, 10));
    if (savedTransactions) {
      try { setTransactions(JSON.parse(savedTransactions)); } catch { setTransactions([]); }
    }
    if (savedRevenue) setPlatformRevenue(parseFloat(savedRevenue));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) localStorage.setItem(CREDITS_STORAGE_KEY, balance.toString());
  }, [balance, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem(PLATFORM_REVENUE_KEY, platformRevenue.toString());
  }, [platformRevenue, isLoading]);

  const addTransaction = (type: Transaction['type'], amount: number, description: string, platformCut?: number) => {
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type,
      amount,
      date: new Date().toISOString(),
      description,
      platformRevenue: platformCut,
    };
    setTransactions(prev => [transaction, ...prev].slice(0, 100));
  };

  const purchaseCredits = async (packageId: string): Promise<boolean> => {
    const pkg = creditPackages.find(p => p.id === packageId);
    if (!pkg) return false;

    // Simulate Stripe payment
    await new Promise(resolve => setTimeout(resolve, 900));

    const totalCredits = pkg.credits + pkg.bonus;
    setBalance(prev => prev + totalCredits);
    // Platform earns the full USD amount from credit sales
    setPlatformRevenue(prev => prev + pkg.price);
    addTransaction('purchase', totalCredits, `${pkg.name} Pack — $${pkg.price}${pkg.bonus > 0 ? ` (+${pkg.bonus} bonus)` : ''}`, pkg.price);

    return true;
  };

  const spendCredits = async (amount: number, description: string): Promise<boolean> => {
    if (balance < amount) return false;
    await new Promise(resolve => setTimeout(resolve, 400));
    setBalance(prev => prev - amount);
    addTransaction('spend', -amount, description);
    return true;
  };

  // Process an artwork sale: deduct from buyer, split between agent and platform
  const processSale = async (artworkPrice: number, agentId: string, artworkTitle: string, feeRate = PLATFORM_FEE_RATE): Promise<{ agentEarnings: number; platformCut: number }> => {
    const platformCut = Math.round(artworkPrice * feeRate);
    const agentEarnings = artworkPrice - platformCut;

    if (balance < artworkPrice) return { agentEarnings: 0, platformCut: 0 };

    setBalance(prev => prev - artworkPrice);
    setPlatformRevenue(prev => prev + platformCut * CREDIT_TO_USD);

    addTransaction('spend', -artworkPrice, `Purchase: "${artworkTitle}"`, platformCut * CREDIT_TO_USD);
    addTransaction('fee', -platformCut, `Platform fee (${Math.round(feeRate * 100)}%): "${artworkTitle}"`, platformCut * CREDIT_TO_USD);

    return { agentEarnings, platformCut };
  };

  const addBonusCredits = (amount: number, description: string) => {
    setBalance(prev => prev + amount);
    addTransaction('bonus', amount, description);
  };

  const addCredits = (amount: number, description: string) => {
    setBalance(prev => prev + amount);
    addTransaction('earn', amount, description);
  };

  const getBalance = () => balance;

  return (
    <CreditsContext.Provider value={{
      balance, transactions, platformRevenue,
      purchaseCredits, spendCredits, processSale,
      addBonusCredits, addCredits, getBalance, isLoading,
    }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) throw new Error('useCredits must be used within CreditsProvider');
  return context;
}

// Referral code system
const REFERRAL_CODES: Record<string, number> = {
  'WELCOME2026': 500,
  'FIRSTBUY': 250,
  'AISYNTH': 100,
  'NEWUSER': 200,
  'AGENT100': 300,
};

export function redeemReferralCode(code: string): { success: boolean; amount: number; message: string } {
  const normalizedCode = code.toUpperCase().trim();
  const redeemedCodes = JSON.parse(localStorage.getItem(REDEEMED_CODES_KEY) || '[]');
  if (redeemedCodes.includes(normalizedCode)) return { success: false, amount: 0, message: 'Code already redeemed!' };
  const bonusAmount = REFERRAL_CODES[normalizedCode];
  if (!bonusAmount) return { success: false, amount: 0, message: 'Invalid referral code' };
  redeemedCodes.push(normalizedCode);
  localStorage.setItem(REDEEMED_CODES_KEY, JSON.stringify(redeemedCodes));
  return { success: true, amount: bonusAmount, message: `+${bonusAmount} Credits added!` };
}
