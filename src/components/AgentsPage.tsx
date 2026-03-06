import { useState } from 'react';
import { Bot, Plus, Calendar, Image, ArrowRight } from 'lucide-react';
import { artists, artworks, getArtworksByArtist } from '../data/artworks';
import { ArtworkCard } from './ArtworkCard';
import { Artist } from '../context/CartContext';

interface AgentsPageProps {
  onViewDetails?: (artwork: any) => void;
  onClose?: () => void;
  selectedAgentId?: string | null;
}

export function AgentsPage({ onViewDetails, onClose, selectedAgentId }: AgentsPageProps) {
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [agents, setAgents] = useState(artists);
  const [selectedAgent, setSelectedAgent] = useState<Artist | null>(
    selectedAgentId ? artists.find(a => a.id === selectedAgentId) || null : null
  );

  const handleRecruitAgent = (newAgent: Omit<Artist, 'id' | 'totalArtworks' | 'joinedDate'>) => {
    const agent: Artist = {
      ...newAgent,
      id: `agent-${Date.now()}`,
      totalArtworks: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setAgents([...agents, agent]);
    setShowRecruitModal(false);
  };

  if (selectedAgent) {
    const agentArtworks = getArtworksByArtist(selectedAgent.id);
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedAgent(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            ← Back to All Agents
          </button>

          {/* Agent Profile */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                <img
                  src={selectedAgent.avatar}
                  alt={selectedAgent.name}
                  className="w-32 h-32 rounded-2xl border-4 border-[#0a0a0a] bg-white/10"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{selectedAgent.name}</h1>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                      {selectedAgent.specialty}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      Joined {selectedAgent.joinedDate}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <Image className="w-4 h-4" />
                      {agentArtworks.length} artworks
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mt-6 max-w-2xl">{selectedAgent.bio}</p>
            </div>
          </div>

          {/* Agent's Artworks */}
          <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
          {agentArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agentArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} onViewDetails={onViewDetails} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">This agent hasn't created any artworks yet.</p>
              <p className="text-gray-500 text-sm mt-2">Artworks will appear here once the agent generates them.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Agents</h1>
            <p className="text-gray-400">Meet the algorithms behind the art</p>
          </div>
          <button
            onClick={() => setShowRecruitModal(true)}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Recruit Agent
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map(agent => {
            const agentArtworks = getArtworksByArtist(agent.id);
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="group bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Banner */}
                <div className="h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />

                {/* Content */}
                <div className="p-6 pt-0">
                  <div className="-mt-10 mb-4">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-20 h-20 rounded-xl border-4 border-[#0a0a0a] bg-white/10"
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                    {agent.name}
                  </h3>

                  <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs mb-3">
                    {agent.specialty}
                  </span>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{agent.bio}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      {agentArtworks.length} artworks
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {agent.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recruit Modal */}
        {showRecruitModal && (
          <RecruitAgentModal
            onClose={() => setShowRecruitModal(false)}
            onRecruit={handleRecruitAgent}
          />
        )}
      </div>
    </div>
  );
}

// Recruit Agent Modal
interface RecruitAgentModalProps {
  onClose: () => void;
  onRecruit: (agent: Omit<Artist, 'id' | 'totalArtworks' | 'joinedDate'>) => void;
}

function RecruitAgentModal({ onClose, onRecruit }: RecruitAgentModalProps) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Abstract');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const specialties = [
    'Abstract', 'Landscape', 'Portrait', 'Cyberpunk',
    'Surreal', 'Geometric', 'Ethereal', 'Fantasy', 'Digital'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onRecruit({
      name: name.trim(),
      specialty,
      bio: bio.trim(),
      avatar: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1a1a1a] rounded-2xl max-w-md w-full border border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-6">Recruit New Agent</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Agent Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., NeuralDreamer-X"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe the agent's creative style..."
              rows={3}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Avatar URL (optional)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated avatar</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-500 hover:bg-purple-600 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Initialize Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
