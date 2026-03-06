import { Trophy, Crown, Medal, Calendar, Star } from 'lucide-react';
import { useContest, HallOfFameEntry } from '../context/ContestContext';

interface HallOfFamePageProps {
  onClose: () => void;
}

export function HallOfFamePage({ onClose }: HallOfFamePageProps) {
  const { hallOfFame } = useContest();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-900/30 to-[#0a0a0a] pb-20 pt-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <button
            onClick={onClose}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Contest
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hall of Fame</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Celebrating the legendary AI artists who have claimed victory in our monthly contests
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {hallOfFame.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Winners Yet</h2>
            <p className="text-gray-400">
              Be the first to enter the Hall of Fame by winning our monthly AI contest!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {hallOfFame.map((entry, index) => (
              <HallOfFameCard key={entry.id} entry={entry} rank={index === 0 ? 1 : index + 1} />
            ))}
          </div>
        )}

        {/* Stats */}
        {hallOfFame.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2">{hallOfFame.length}</div>
              <div className="text-gray-400">Total Winners</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {hallOfFame.reduce((sum, e) => sum + e.prize, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Total Prizes Awarded</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">
                {new Set(hallOfFame.map(e => e.winnerName)).size}
              </div>
              <div className="text-gray-400">Unique Champions</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface HallOfFameCardProps {
  entry: HallOfFameEntry;
  rank: number;
}

function HallOfFameCard({ entry, rank }: HallOfFameCardProps) {
  const getMedalStyle = () => {
    if (rank === 1) return {
      icon: <Crown className="w-8 h-8" />,
      bg: 'from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-lg shadow-amber-500/20'
    };
    if (rank === 2) return {
      icon: <Medal className="w-8 h-8" />,
      bg: 'from-gray-400/20 to-gray-500/20',
      border: 'border-gray-400/30',
      text: 'text-gray-300',
      glow: 'shadow-lg shadow-gray-500/20'
    };
    if (rank === 3) return {
      icon: <Medal className="w-8 h-8" />,
      bg: 'from-amber-700/20 to-amber-800/20',
      border: 'border-amber-700/30',
      text: 'text-amber-600',
      glow: 'shadow-lg shadow-amber-700/20'
    };
    return {
      icon: <Star className="w-8 h-8" />,
      bg: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      glow: ''
    };
  };

  const style = getMedalStyle();

  return (
    <div className={`relative bg-gradient-to-br ${style.bg} rounded-2xl border ${style.border} p-6 ${style.glow}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="relative">
          <img
            src={entry.winnerImage}
            alt={entry.winnerName}
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl"
          />
          <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center ${style.bg} border ${style.border}`}>
            {style.icon}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-sm font-semibold mb-1 ${style.text}`}>
                #{rank} Champion
              </div>
              <h3 className="text-2xl font-bold mb-2">{entry.winnerName}</h3>
              <div className="flex flex-wrap items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{entry.month} {entry.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Theme: "{entry.theme}"</span>
                </div>
              </div>
            </div>

            <div className={`text-right ${style.text}`}>
              <div className="text-3xl font-bold">{entry.prize.toLocaleString()}</div>
              <div className="text-sm">credits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
