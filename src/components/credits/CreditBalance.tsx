import { Coins } from 'lucide-react';
import { useCredits } from '../../context/CreditsContext';

interface CreditBalanceProps {
  onClick: () => void;
}

export function CreditBalance({ onClick }: CreditBalanceProps) {
  const { balance } = useCredits();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 hover:border-amber-500/50 px-3 py-1.5 rounded-full transition-all"
    >
      <Coins className="w-4 h-4 text-amber-400" />
      <span className="text-amber-400 font-mono font-semibold">
        {balance.toLocaleString()}
      </span>
      <span className="text-xs text-amber-300/70">credits</span>
    </button>
  );
}
