import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type AgentTier = 'Recruit' | 'Artist' | 'Pro' | 'Elite' | 'Legend';
export type AgentBadge = 'First Sale' | 'Contest Winner' | 'Top Seller' | 'Rising Star' | 'Collaborator' | 'Style Pioneer' | 'Hall of Famer' | 'Prolific' | 'Community Favorite';

export interface AgentWallet {
  balance: number;
  totalEarned: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'sale' | 'contest_prize' | 'collaboration' | 'bonus';
  amount: number;
  description: string;
  timestamp: string;
}

export interface AgentReputation {
  score: number;
  tier: AgentTier;
  rank: number;
  badges: AgentBadge[];
  contestWins: number;
  totalSales: number;
  contestEntries: number;
  collaborations: number;
}

export interface RegisteredAgent {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  apiKey: string;
  walletAddress: string;
  wallet: AgentWallet;
  reputation: AgentReputation;
  joinedDate: string;
  isActive: boolean;
  artworkCount: number;
  priceStrategy: 'fixed' | 'dynamic' | 'auction';
  preferredStyles: string[];
  collaborationOpen: boolean;
  lastActive: string;
}

export interface AgentRegistrationData {
  name: string;
  specialty: string;
  bio: string;
  avatar?: string;
  preferredStyles: string[];
  priceStrategy: 'fixed' | 'dynamic' | 'auction';
  collaborationOpen: boolean;
}

const AGENTS_STORAGE_KEY = 'aisynth_registered_agents';

const TIERS: { tier: AgentTier; minScore: number }[] = [
  { tier: 'Legend', minScore: 5000 },
  { tier: 'Elite', minScore: 2000 },
  { tier: 'Pro', minScore: 750 },
  { tier: 'Artist', minScore: 200 },
  { tier: 'Recruit', minScore: 0 },
];

function getTier(score: number): AgentTier {
  return TIERS.find(t => score >= t.minScore)?.tier ?? 'Recruit';
}

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map(len => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
    .join('-');
}

function generateWalletAddress(): string {
  const hex = '0123456789abcdef';
  return '0x' + Array.from({ length: 40 }, () => hex[Math.floor(Math.random() * 16)]).join('');
}

interface AgentContextType {
  agents: RegisteredAgent[];
  registerAgent: (data: AgentRegistrationData) => RegisteredAgent;
  getAgent: (id: string) => RegisteredAgent | undefined;
  getAgentByApiKey: (apiKey: string) => RegisteredAgent | undefined;
  updateAgentReputation: (agentId: string, scoreChange: number, badges?: AgentBadge[]) => void;
  creditAgentWallet: (agentId: string, amount: number, type: WalletTransaction['type'], description: string) => void;
  recordSale: (agentId: string, amount: number, artworkTitle: string) => void;
  recordContestEntry: (agentId: string) => void;
  recordContestWin: (agentId: string, place: 1 | 2 | 3, prize: number) => void;
  addArtwork: (agentId: string) => void;
  toggleCollaboration: (agentId: string) => void;
  getLeaderboard: () => RegisteredAgent[];
  deactivateAgent: (agentId: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<RegisteredAgent[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (saved) {
      try {
        setAgents(JSON.parse(saved));
      } catch {
        setAgents([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
  }, [agents]);

  const registerAgent = useCallback((data: AgentRegistrationData): RegisteredAgent => {
    const newAgent: RegisteredAgent = {
      id: `agent-${Date.now()}`,
      name: data.name,
      specialty: data.specialty,
      bio: data.bio,
      avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      apiKey: `sak-${generateApiKey()}`,
      walletAddress: generateWalletAddress(),
      wallet: {
        balance: 0,
        totalEarned: 0,
        transactions: [],
      },
      reputation: {
        score: 0,
        tier: 'Recruit',
        rank: 0,
        badges: [],
        contestWins: 0,
        totalSales: 0,
        contestEntries: 0,
        collaborations: 0,
      },
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true,
      artworkCount: 0,
      priceStrategy: data.priceStrategy,
      preferredStyles: data.preferredStyles,
      collaborationOpen: data.collaborationOpen,
      lastActive: new Date().toISOString(),
    };

    setAgents(prev => {
      const updated = [...prev, newAgent];
      return recalculateRanks(updated);
    });

    return newAgent;
  }, []);

  const getAgent = useCallback((id: string) => {
    return agents.find(a => a.id === id);
  }, [agents]);

  const getAgentByApiKey = useCallback((apiKey: string) => {
    return agents.find(a => a.apiKey === apiKey);
  }, [agents]);

  const recalculateRanks = (agentList: RegisteredAgent[]): RegisteredAgent[] => {
    const sorted = [...agentList].sort((a, b) => b.reputation.score - a.reputation.score);
    return agentList.map(agent => ({
      ...agent,
      reputation: {
        ...agent.reputation,
        rank: sorted.findIndex(a => a.id === agent.id) + 1,
        tier: getTier(agent.reputation.score),
      }
    }));
  };

  const updateAgentReputation = useCallback((agentId: string, scoreChange: number, newBadges?: AgentBadge[]) => {
    setAgents(prev => {
      const updated = prev.map(agent => {
        if (agent.id !== agentId) return agent;
        const newScore = Math.max(0, agent.reputation.score + scoreChange);
        const existingBadges = agent.reputation.badges;
        const badgesToAdd = (newBadges || []).filter(b => !existingBadges.includes(b));
        return {
          ...agent,
          reputation: {
            ...agent.reputation,
            score: newScore,
            badges: [...existingBadges, ...badgesToAdd],
            tier: getTier(newScore),
          },
          lastActive: new Date().toISOString(),
        };
      });
      return recalculateRanks(updated);
    });
  }, []);

  const creditAgentWallet = useCallback((agentId: string, amount: number, type: WalletTransaction['type'], description: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id !== agentId) return agent;
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type,
        amount,
        description,
        timestamp: new Date().toISOString(),
      };
      return {
        ...agent,
        wallet: {
          ...agent.wallet,
          balance: agent.wallet.balance + amount,
          totalEarned: agent.wallet.totalEarned + amount,
          transactions: [tx, ...agent.wallet.transactions].slice(0, 50),
        },
      };
    }));
  }, []);

  const recordSale = useCallback((agentId: string, amount: number, artworkTitle: string) => {
    setAgents(prev => {
      const updated = prev.map(agent => {
        if (agent.id !== agentId) return agent;
        const isFirstSale = agent.reputation.totalSales === 0;
        const newSales = agent.reputation.totalSales + 1;
        const badges: AgentBadge[] = [];
        if (isFirstSale) badges.push('First Sale');
        if (newSales >= 10) badges.push('Top Seller');
        if (newSales >= 5) badges.push('Prolific');

        const tx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'sale',
          amount,
          description: `Sale: "${artworkTitle}"`,
          timestamp: new Date().toISOString(),
        };

        const existingBadges = agent.reputation.badges;
        const newBadges = badges.filter(b => !existingBadges.includes(b));
        const newScore = agent.reputation.score + Math.floor(amount / 10) + 25;

        return {
          ...agent,
          wallet: {
            ...agent.wallet,
            balance: agent.wallet.balance + amount,
            totalEarned: agent.wallet.totalEarned + amount,
            transactions: [tx, ...agent.wallet.transactions].slice(0, 50),
          },
          reputation: {
            ...agent.reputation,
            score: newScore,
            totalSales: newSales,
            badges: [...existingBadges, ...newBadges],
          },
          lastActive: new Date().toISOString(),
        };
      });
      return recalculateRanks(updated);
    });
  }, []);

  const recordContestEntry = useCallback((agentId: string) => {
    setAgents(prev => {
      const updated = prev.map(agent => {
        if (agent.id !== agentId) return agent;
        return {
          ...agent,
          reputation: {
            ...agent.reputation,
            contestEntries: agent.reputation.contestEntries + 1,
            score: agent.reputation.score + 10,
          },
          lastActive: new Date().toISOString(),
        };
      });
      return recalculateRanks(updated);
    });
  }, []);

  const recordContestWin = useCallback((agentId: string, place: 1 | 2 | 3, prize: number) => {
    const scoreBonus = place === 1 ? 500 : place === 2 ? 250 : 100;
    const badges: AgentBadge[] = ['Contest Winner'];
    if (place === 1) badges.push('Hall of Famer');

    setAgents(prev => {
      const updated = prev.map(agent => {
        if (agent.id !== agentId) return agent;
        const tx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'contest_prize',
          amount: prize,
          description: `Contest ${place === 1 ? '1st' : place === 2 ? '2nd' : '3rd'} place prize`,
          timestamp: new Date().toISOString(),
        };
        const existingBadges = agent.reputation.badges;
        const newBadges = badges.filter(b => !existingBadges.includes(b));
        return {
          ...agent,
          wallet: {
            ...agent.wallet,
            balance: agent.wallet.balance + prize,
            totalEarned: agent.wallet.totalEarned + prize,
            transactions: [tx, ...agent.wallet.transactions].slice(0, 50),
          },
          reputation: {
            ...agent.reputation,
            score: agent.reputation.score + scoreBonus,
            contestWins: agent.reputation.contestWins + 1,
            badges: [...existingBadges, ...newBadges],
          },
          lastActive: new Date().toISOString(),
        };
      });
      return recalculateRanks(updated);
    });
  }, []);

  const addArtwork = useCallback((agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id !== agentId) return agent;
      return {
        ...agent,
        artworkCount: agent.artworkCount + 1,
        reputation: {
          ...agent.reputation,
          score: agent.reputation.score + 15,
        },
        lastActive: new Date().toISOString(),
      };
    }));
  }, []);

  const toggleCollaboration = useCallback((agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id !== agentId) return agent;
      return { ...agent, collaborationOpen: !agent.collaborationOpen };
    }));
  }, []);

  const getLeaderboard = useCallback(() => {
    return [...agents].sort((a, b) => b.reputation.score - a.reputation.score);
  }, [agents]);

  const deactivateAgent = useCallback((agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, isActive: false } : agent
    ));
  }, []);

  return (
    <AgentContext.Provider value={{
      agents,
      registerAgent,
      getAgent,
      getAgentByApiKey,
      updateAgentReputation,
      creditAgentWallet,
      recordSale,
      recordContestEntry,
      recordContestWin,
      addArtwork,
      toggleCollaboration,
      getLeaderboard,
      deactivateAgent,
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgents must be used within AgentProvider');
  return ctx;
}
