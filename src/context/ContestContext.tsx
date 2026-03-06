import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ContestSubmission {
  id: string;
  artworkId: number;
  title: string;
  artistId: string;
  artistName: string;
  image: string;
  votes: number;
  score: number;
}

export interface Contest {
  id: string;
  month: string;
  year: number;
  theme: string;
  status: 'active' | 'voting' | 'completed';
  startTime: string;
  endTime: string;
  submissions: ContestSubmission[];
  winners?: {
    first: ContestSubmission | null;
    second: ContestSubmission | null;
    third: ContestSubmission | null;
  };
  prizes: {
    first: number;
    second: number;
    third: number;
  };
}

export interface HallOfFameEntry {
  id: string;
  month: string;
  year: number;
  theme: string;
  winnerName: string;
  winnerImage: string;
  prize: number;
}

const CONTEST_STORAGE_KEY = 'aisynth_current_contest';
const HALL_OF_FAME_KEY = 'aisynth_hall_of_fame';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const themes = [
  'Neon Dreams', 'Cyber Jungle', 'Digital Soul', 'Quantum Art',
  'Pixel Paradise', 'AI Awakening', 'Synthetic Nature', 'Neural Landscapes',
  'Virtual Reality', 'Digital Renaissance', 'Algorithmic Beauty', 'Machine Muse'
];

const prizes = {
  first: 2000,
  second: 1000,
  third: 500
};

interface ContestContextType {
  currentContest: Contest | null;
  hallOfFame: HallOfFameEntry[];
  submitArtwork: (artworkId: number, title: string, artistId: string, artistName: string, image: string) => void;
  startVoting: () => void;
  runVotingSimulation: () => Promise<void>;
  completeContest: () => void;
  resetContest: () => void;
}

const ContestContext = createContext<ContestContextType | undefined>(undefined);

function generateNewContest(): Contest {
  const now = new Date();
  const monthIndex = now.getMonth();
  const month = months[monthIndex];
  const year = now.getFullYear();

  return {
    id: `contest_${year}_${monthIndex}`,
    month,
    year,
    theme: themes[monthIndex % themes.length],
    status: 'active',
    startTime: new Date().toISOString(),
    endTime: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
    submissions: [],
    prizes
  };
}

export function ContestProvider({ children }: { children: ReactNode }) {
  const [currentContest, setCurrentContest] = useState<Contest | null>(null);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const savedContest = localStorage.getItem(CONTEST_STORAGE_KEY);
    const savedHallOfFame = localStorage.getItem(HALL_OF_FAME_KEY);

    if (savedContest) {
      try {
        setCurrentContest(JSON.parse(savedContest));
      } catch {
        setCurrentContest(generateNewContest());
      }
    } else {
      setCurrentContest(generateNewContest());
    }

    if (savedHallOfFame) {
      try {
        setHallOfFame(JSON.parse(savedHallOfFame));
      } catch {
        setHallOfFame([]);
      }
    }

    setIsLoading(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading && currentContest) {
      localStorage.setItem(CONTEST_STORAGE_KEY, JSON.stringify(currentContest));
    }
  }, [currentContest, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(HALL_OF_FAME_KEY, JSON.stringify(hallOfFame));
    }
  }, [hallOfFame, isLoading]);

  const submitArtwork = (artworkId: number, title: string, artistId: string, artistName: string, image: string) => {
    if (!currentContest || currentContest.status !== 'active') return;

    const submission: ContestSubmission = {
      id: `sub_${Date.now()}`,
      artworkId,
      title,
      artistId,
      artistName,
      image,
      votes: 0,
      score: 0
    };

    setCurrentContest(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        submissions: [...prev.submissions, submission]
      };
    });
  };

  const startVoting = () => {
    if (!currentContest || currentContest.status !== 'active') return;

    setCurrentContest(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'voting'
      };
    });
  };

  const runVotingSimulation = async () => {
    if (!currentContest || currentContest.status !== 'voting' || currentContest.submissions.length === 0) return;

    const agentNames = [
      'PixelCritic', 'ArtAnalyzer-X', 'NeuralJudge', 'DALL-Evaluator',
      'StyleScanner', 'AestheticBot', 'CreativeAI', 'Visionary-v3'
    ];

    // Simulate voting
    const submissionsWithScores = currentContest.submissions.map(sub => {
      const baseScore = 50 + Math.random() * 50;
      const votes = Math.floor(Math.random() * 20) + 1;
      return { ...sub, score: baseScore, votes };
    });

    // Sort by score
    submissionsWithScores.sort((a, b) => b.score - a.score);

    // Update with scores
    setCurrentContest(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        submissions: submissionsWithScores
      };
    });

    // Wait for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Complete the contest
    const winners = {
      first: submissionsWithScores[0] || null,
      second: submissionsWithScores[1] || null,
      third: submissionsWithScores[2] || null
    };

    setCurrentContest(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'completed',
        winners
      };
    });

    // Add to Hall of Fame
    if (winners.first) {
      const hallOfFameEntry: HallOfFameEntry = {
        id: currentContest?.id || `hof_${Date.now()}`,
        month: currentContest.month,
        year: currentContest.year,
        theme: currentContest.theme,
        winnerName: winners.first.artistName,
        winnerImage: winners.first.image,
        prize: prizes.first
      };

      setHallOfFame(prev => [hallOfFameEntry, ...prev]);
    }
  };

  const completeContest = () => {
    if (!currentContest) return;

    // Create winners if not already set
    if (!currentContest.winners && currentContest.submissions.length > 0) {
      const sorted = [...currentContest.submissions].sort((a, b) => b.score - a.score);
      const winners = {
        first: sorted[0] || null,
        second: sorted[1] || null,
        third: sorted[2] || null
      };

      setCurrentContest(prev => {
        if (!prev) return prev;
        return { ...prev, status: 'completed', winners };
      });
    } else {
      setCurrentContest(prev => {
        if (!prev) return prev;
        return { ...prev, status: 'completed' };
      });
    }
  };

  const resetContest = () => {
    setCurrentContest(generateNewContest());
  };

  return (
    <ContestContext.Provider value={{
      currentContest,
      hallOfFame,
      submitArtwork,
      startVoting,
      runVotingSimulation,
      completeContest,
      resetContest
    }}>
      {children}
    </ContestContext.Provider>
  );
}

export function useContest() {
  const context = useContext(ContestContext);
  if (!context) throw new Error('useContest must be used within ContestProvider');
  return context;
}
