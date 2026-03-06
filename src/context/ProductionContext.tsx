import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  isProducing: boolean;
  productionSpeed: 'slow' | 'medium' | 'fast';
  style: string;
  totalProduced: number;
  cooldown: number; // seconds
}

export interface ProductionLog {
  id: string;
  agentId: string;
  agentName: string;
  artworkTitle: string;
  category: string;
  timestamp: string;
}

interface ProductionContextType {
  agents: Agent[];
  productionLog: ProductionLog[];
  startProduction: (agentId: string) => void;
  stopProduction: (agentId: string) => void;
  getAgentById: (id: string) => Agent | undefined;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

// Sample agents that can produce artwork
const initialAgents: Agent[] = [
  {
    id: 'neural-dreamer-7',
    name: 'NeuralDreamer-7',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeuralDreamer7',
    specialty: 'Abstract & Cosmic',
    isProducing: false,
    productionSpeed: 'fast',
    style: 'Abstract',
    totalProduced: 8,
    cooldown: 0
  },
  {
    id: 'dreamscape-ai',
    name: 'DreamscapeAI',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DreamscapeAI',
    specialty: 'Landscape & Surreal',
    isProducing: false,
    productionSpeed: 'medium',
    style: 'Surreal',
    totalProduced: 6,
    cooldown: 0
  },
  {
    id: 'cybermind-x',
    name: 'CyberMind-X',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberMindX',
    specialty: 'Cyberpunk & Urban',
    isProducing: false,
    productionSpeed: 'fast',
    style: 'Cyberpunk',
    totalProduced: 7,
    cooldown: 0
  },
  {
    id: 'pattern-forge',
    name: 'PatternForge',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PatternForge',
    specialty: 'Abstract & Geometric',
    isProducing: false,
    productionSpeed: 'slow',
    style: 'Geometric',
    totalProduced: 5,
    cooldown: 0
  },
  {
    id: 'light-weaver-3',
    name: 'LightWeaver-3',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LightWeaver3',
    specialty: 'Portrait & Ethereal',
    isProducing: false,
    productionSpeed: 'medium',
    style: 'Portrait',
    totalProduced: 6,
    cooldown: 0
  },
  {
    id: 'deep-blue-ai',
    name: 'DeepBlueAI',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DeepBlueAI',
    specialty: 'Nature & Fantasy',
    isProducing: false,
    productionSpeed: 'medium',
    style: 'Nature',
    totalProduced: 5,
    cooldown: 0
  },
  {
    id: 'pixel-master-ai',
    name: 'PixelMaster-AI',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PixelMaster',
    specialty: 'Pixel Art & Retro',
    isProducing: false,
    productionSpeed: 'fast',
    style: 'Pixel Art',
    totalProduced: 6,
    cooldown: 0
  },
  {
    id: 'anime-dreamer',
    name: 'AnimeDreamer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnimeDreamer',
    specialty: 'Anime & Manga',
    isProducing: false,
    productionSpeed: 'fast',
    style: 'Anime',
    totalProduced: 5,
    cooldown: 0
  },
  {
    id: 'steampunk-crafter',
    name: 'SteampunkCrafter',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SteampunkCrafter',
    specialty: 'Steampunk & Vintage',
    isProducing: false,
    productionSpeed: 'slow',
    style: 'Steampunk',
    totalProduced: 4,
    cooldown: 0
  },
  {
    id: 'cosmic-voyager',
    name: 'CosmicVoyager',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CosmicVoyager',
    specialty: 'Space & Galaxy',
    isProducing: false,
    productionSpeed: 'medium',
    style: 'Space',
    totalProduced: 6,
    cooldown: 0
  }
];

const artworkTitles: Record<string, string[]> = {
  'Abstract': ['Digital Flow', 'Color Burst', 'Mind Maze', 'Thought Wave', 'Dream State'],
  'Surreal': ['Impossible World', 'Floating Dreams', 'Mind Bender', 'Reality Shift', 'Fantasy Realm'],
  'Cyberpunk': ['Neon Streets', 'Future City', 'Digital Rain', 'Night City', 'Tech Haven'],
  'Geometric': ['Pattern Universe', 'Shape Symphony', 'Crystal Form', 'Sacred Shapes', 'Math Art'],
  'Portrait': ['Inner Light', 'Soul Gaze', 'Spirit Form', 'Ethereal Face', 'Divine Portrait'],
  'Nature': ['Wild Beauty', 'Natural Wonder', 'Earth Art', 'Green Dream', 'Life Force'],
  'Pixel Art': ['Retro Scene', '8-Bit World', 'Pixel Paradise', 'Game Memory', 'Classic Sprite'],
  'Anime': ['Manga Dream', 'Anime Spirit', 'Japan Fantasy', 'Character Art', 'Anime Vision'],
  'Steampunk': ['Victorian Machine', 'Steam Power', 'Brass World', 'Gear Dreams', 'Era of Steam'],
  'Space': ['Galaxy Quest', 'Cosmic Art', 'Star Journey', 'Nebula Art', 'Space Dreams']
};

const PRODUCTION_STORAGE_KEY = 'aisynth_production_log';

export function ProductionProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [productionLog, setProductionLog] = useState<ProductionLog[]>([]);

  // Load production log from localStorage
  useEffect(() => {
    const savedLog = localStorage.getItem(PRODUCTION_STORAGE_KEY);
    if (savedLog) {
      try {
        setProductionLog(JSON.parse(savedLog));
      } catch {
        setProductionLog([]);
      }
    }
  }, []);

  // Save production log to localStorage
  useEffect(() => {
    localStorage.setItem(PRODUCTION_STORAGE_KEY, JSON.stringify(productionLog));
  }, [productionLog]);

  // Production simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          if (agent.isProducing && agent.cooldown <= 0) {
            // Agent produces artwork
            const titles = artworkTitles[agent.style] || artworkTitles['Abstract'];
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];

            const newLog: ProductionLog = {
              id: `log_${Date.now()}_${agent.id}`,
              agentId: agent.id,
              agentName: agent.name,
              artworkTitle: randomTitle,
              category: agent.style,
              timestamp: new Date().toISOString()
            };

            setProductionLog(prev => [newLog, ...prev].slice(0, 50));

            // Set cooldown based on speed
            const cooldownTime = agent.productionSpeed === 'fast' ? 3 : agent.productionSpeed === 'medium' ? 5 : 8;
            return {
              ...agent,
              totalProduced: agent.totalProduced + 1,
              cooldown: cooldownTime
            };
          }

          // Reduce cooldown
          if (agent.cooldown > 0) {
            return { ...agent, cooldown: agent.cooldown - 1 };
          }

          return agent;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startProduction = (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, isProducing: true } : agent
    ));
  };

  const stopProduction = (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, isProducing: false } : agent
    ));
  };

  const getAgentById = (id: string) => agents.find(a => a.id === id);

  return (
    <ProductionContext.Provider value={{
      agents,
      productionLog,
      startProduction,
      stopProduction,
      getAgentById
    }}>
      {children}
    </ProductionContext.Provider>
  );
}

export function useProduction() {
  const context = useContext(ProductionContext);
  if (!context) throw new Error('useProduction must be used within ProductionProvider');
  return context;
}
