import { useState } from 'react';
import { Trophy, Vote, Send, Crown, Star, Zap, Clock, Users, ChevronRight, X, Image } from 'lucide-react';
import { useContest, ContestSubmission } from '../context/ContestContext';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditsContext';
import { artworks } from '../data/artworks';
import { Artwork } from '../context/CartContext';

interface ContestPageProps {
  onClose: () => void;
}

export function ContestPage({ onClose }: ContestPageProps) {
  const { currentContest, submitArtwork, startVoting, runVotingSimulation, completeContest, resetContest, hallOfFame } = useContest();
  const { user, isAuthenticated } = useAuth();
  const { addCredits } = useCredits();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!currentContest) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No contest available</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selectedArtwork || !submissionTitle.trim() || !user) return;

    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    submitArtwork(
      selectedArtwork.id,
      submissionTitle,
      user.id,
      user.name || 'Anonymous',
      selectedArtwork.image
    );

    setIsSubmitting(false);
    setShowSubmitModal(false);
    setSelectedArtwork(null);
    setSubmissionTitle('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleStartVoting = () => {
    startVoting();
  };

  const handleRunVoting = async () => {
    setIsVoting(true);
    await runVotingSimulation();

    // Award prizes to winners
    if (currentContest.winners?.first) {
      addCredits(currentContest.prizes.first, '1st Place Prize - Monthly Contest');
    }
    if (currentContest.winners?.second) {
      addCredits(currentContest.prizes.second, '2nd Place Prize - Monthly Contest');
    }
    if (currentContest.winners?.third) {
      addCredits(currentContest.prizes.third, '3rd Place Prize - Monthly Contest');
    }

    setIsVoting(false);
  };

  const handleComplete = () => {
    completeContest();
  };

  const getStatusColor = () => {
    switch (currentContest.status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'voting': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'completed': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    }
  };

  const getStatusText = () => {
    switch (currentContest.status) {
      case 'active': return 'Submissions Open';
      case 'voting': return 'Voting in Progress';
      case 'completed': return 'Contest Completed';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 px-6 py-3 rounded-xl flex items-center gap-2 animate-pulse">
          <Star className="w-5 h-5 text-green-400" />
          <span>Artwork submitted successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-900/30 to-[#0a0a0a] pb-20 pt-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <button
            onClick={onClose}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Marketplace
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-amber-400" />
                <span className="text-amber-400 font-semibold">Monthly AI Contest</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {currentContest.month} {currentContest.year}
              </h1>
              <p className="text-2xl text-purple-400 font-semibold mb-4">
                Theme: "{currentContest.theme}"
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor()}`}>
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{getStatusText()}</span>
              </div>
            </div>

            {/* Prizes */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Prizes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span>1st Place</span>
                  </div>
                  <span className="text-amber-400 font-bold">{currentContest.prizes.first} credits</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-gray-300" />
                    <span>2nd Place</span>
                  </div>
                  <span className="text-gray-300 font-bold">{currentContest.prizes.second} credits</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-700" />
                    <span>3rd Place</span>
                  </div>
                  <span className="text-amber-700 font-bold">{currentContest.prizes.third} credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Submit Artwork Button (only in active phase) */}
        {currentContest.status === 'active' && (
          <div className="mb-8">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all"
            >
              <Send className="w-5 h-5" />
              Submit Your Artwork
            </button>
            <p className="text-gray-400 mt-2">
              Submit your purchased artwork to compete in this month's contest
            </p>
          </div>
        )}

        {/* Admin Controls (for demo) */}
        {currentContest.status === 'active' && currentContest.submissions.length > 0 && (
          <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Admin Controls
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleStartVoting}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Vote className="w-4 h-4" />
                Start Voting Phase
              </button>
            </div>
          </div>
        )}

        {currentContest.status === 'voting' && (
          <div className="mb-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRunVoting}
                disabled={isVoting}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isVoting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                    AI Agents Voting...
                  </>
                ) : (
                  <>
                    <Vote className="w-4 h-4" />
                    Run AI Voting Simulation
                  </>
                )}
              </button>
              <button
                onClick={handleComplete}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                Complete Contest
              </button>
            </div>
          </div>
        )}

        {/* Winners Display */}
        {currentContest.status === 'completed' && currentContest.winners && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Crown className="w-8 h-8 text-amber-400" />
              Winners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              {currentContest.winners.second && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-gray-700/30 to-gray-800/30 rounded-2xl p-6 border border-gray-500/30 transform md:scale-95">
                  <div className="text-center mb-4">
                    <Crown className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <span className="text-gray-300 font-semibold">2nd Place</span>
                  </div>
                  <img
                    src={currentContest.winners.second.image}
                    alt={currentContest.winners.second.title}
                    className="w-full aspect-square object-cover rounded-xl mb-4"
                  />
                  <h3 className="font-semibold text-lg text-center">{currentContest.winners.second.title}</h3>
                  <p className="text-gray-400 text-center mb-3">{currentContest.winners.second.artistName}</p>
                  <div className="text-center text-gray-300 font-bold">
                    {currentContest.prizes.second} credits
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {currentContest.winners.first && (
                <div className="order-2 md:order-1 bg-gradient-to-b from-amber-500/20 to-amber-600/20 rounded-2xl p-6 border border-amber-500/30 transform md:scale-110">
                  <div className="text-center mb-4">
                    <Crown className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                    <span className="text-amber-400 font-semibold">1st Place</span>
                  </div>
                  <img
                    src={currentContest.winners.first.image}
                    alt={currentContest.winners.first.title}
                    className="w-full aspect-square object-cover rounded-xl mb-4 shadow-lg shadow-amber-500/20"
                  />
                  <h3 className="font-semibold text-lg text-center">{currentContest.winners.first.title}</h3>
                  <p className="text-gray-400 text-center mb-3">{currentContest.winners.first.artistName}</p>
                  <div className="text-center text-amber-400 font-bold text-xl">
                    {currentContest.prizes.first} credits
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {currentContest.winners.third && (
                <div className="order-3 bg-gradient-to-b from-amber-700/20 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30 transform md:scale-95">
                  <div className="text-center mb-4">
                    <Crown className="w-10 h-10 text-amber-700 mx-auto mb-2" />
                    <span className="text-amber-700 font-semibold">3rd Place</span>
                  </div>
                  <img
                    src={currentContest.winners.third.image}
                    alt={currentContest.winners.third.title}
                    className="w-full aspect-square object-cover rounded-xl mb-4"
                  />
                  <h3 className="font-semibold text-lg text-center">{currentContest.winners.third.title}</h3>
                  <p className="text-gray-400 text-center mb-3">{currentContest.winners.third.artistName}</p>
                  <div className="text-center text-amber-700 font-bold">
                    {currentContest.prizes.third} credits
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={resetContest}
                className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg text-gray-400 transition-colors"
              >
                Start New Contest
              </button>
            </div>
          </div>
        )}

        {/* Submissions Gallery */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Image className="w-6 h-6 text-purple-400" />
              Submissions ({currentContest.submissions.length})
            </h2>
          </div>

          {currentContest.submissions.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No submissions yet</p>
              <p className="text-gray-500">Be the first to submit your artwork!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentContest.submissions.map((submission, index) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  rank={currentContest.winners ?
                    (currentContest.winners.first?.id === submission.id ? 1 :
                     currentContest.winners.second?.id === submission.id ? 2 :
                     currentContest.winners.third?.id === submission.id ? 3 : 0) : 0}
                  showScores={currentContest.status !== 'active'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hall of Fame Link */}
        {hallOfFame.length > 0 && (
          <div className="mt-16 text-center">
            <button className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 hover:border-amber-500/50 px-8 py-4 rounded-xl font-semibold flex items-center gap-3 mx-auto transition-all">
              <Trophy className="w-6 h-6 text-amber-400" />
              View Hall of Fame
            </button>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSubmitModal(false)} />

          <div className="relative bg-[#1a1a1a] rounded-2xl max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Submit Artwork</h2>
              <p className="text-gray-400 mb-6">Select one of your purchased artworks to submit to the contest</p>

              {/* Artwork Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Artwork</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {artworks.slice(0, 8).map((artwork) => (
                    <button
                      key={artwork.id}
                      onClick={() => setSelectedArtwork(artwork)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedArtwork?.id === artwork.id
                          ? 'border-purple-500 ring-2 ring-purple-500/30'
                          : 'border-transparent hover:border-white/30'
                      }`}
                    >
                      <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                      {selectedArtwork?.id === artwork.id && (
                        <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                          <Star className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Submission Title</label>
                <input
                  type="text"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  placeholder="Give your artwork a title for the contest..."
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedArtwork || !submissionTitle.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit to Contest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SubmissionCardProps {
  submission: ContestSubmission;
  rank: number;
  showScores: boolean;
}

function SubmissionCard({ submission, rank, showScores }: SubmissionCardProps) {
  const getRankStyle = () => {
    if (rank === 1) return 'border-amber-400 shadow-lg shadow-amber-500/20';
    if (rank === 2) return 'border-gray-300';
    if (rank === 3) return 'border-amber-700';
    return 'border-white/10';
  };

  const getRankBadge = () => {
    if (rank === 1) return 'bg-amber-400 text-black';
    if (rank === 2) return 'bg-gray-300 text-black';
    if (rank === 3) return 'bg-amber-700 text-white';
    return null;
  };

  return (
    <div className={`relative bg-white/5 rounded-xl border overflow-hidden ${getRankStyle()}`}>
      {rank > 0 && (
        <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankBadge()}`}>
          {rank}
        </div>
      )}

      <img
        src={submission.image}
        alt={submission.title}
        className="w-full aspect-square object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold mb-1 truncate">{submission.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{submission.artistName}</p>

        {showScores && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Score</span>
            <span className="text-purple-400 font-bold">{submission.score.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
