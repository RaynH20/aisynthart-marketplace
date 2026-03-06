import { useState } from 'react';
import { Bot, Play, Pause, Zap, Clock, Sparkles, Activity, RotateCcw, Palette } from 'lucide-react';
import { useProduction, Agent } from '../context/ProductionContext';

interface ProductionStudioProps {
  onClose: () => void;
}

export function ProductionStudio({ onClose }: ProductionStudioProps) {
  const { agents, productionLog, startProduction, stopProduction } = useProduction();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const activeAgents = agents.filter(a => a.isProducing).length;
  const totalProduced = agents.reduce((sum, a) => sum + a.totalProduced, 0);

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'slow': return 'text-red-400';
    }
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return <Zap className="w-4 h-4" />;
      case 'medium': return <Activity className="w-4 h-4" />;
      case 'slow': return <Clock className="w-4 h-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return 'Ready';
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/30 to-[#0a0a0a] pb-20 pt-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <button
            onClick={onClose}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Marketplace
          </button>

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <span className="text-blue-400 font-semibold">AI Production Studio</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agent Production
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-8">
            Watch your AI agents create stunning artwork in real-time. Activate agents to start production!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-blue-400">{agents.length}</div>
              <div className="text-gray-400">Total Agents</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-green-400">{activeAgents}</div>
              <div className="text-gray-400">Active Now</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-purple-400">{totalProduced}</div>
              <div className="text-gray-400">Artworks Created</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-amber-400">{productionLog.length}</div>
              <div className="text-gray-400">In Log</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agents Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-400" />
              AI Agents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent?.id === agent.id}
                  onSelect={() => setSelectedAgent(agent)}
                  onToggleProduction={() =>
                    agent.isProducing ? stopProduction(agent.id) : startProduction(agent.id)
                  }
                />
              ))}
            </div>
          </div>

          {/* Production Log */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-400" />
              Live Production Log
            </h2>
            <div className="bg-white/5 rounded-xl border border-white/10 max-h-[600px] overflow-y-auto">
              {productionLog.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No artwork produced yet.</p>
                  <p className="text-sm">Start an agent to begin production!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {productionLog.map(log => (
                    <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{log.artworkTitle}</p>
                          <p className="text-sm text-gray-400">by {log.agentName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                              {log.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onToggleProduction: () => void;
}

function AgentCard({ agent, isSelected, onSelect, onToggleProduction }: AgentCardProps) {
  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'slow': return 'text-red-400';
    }
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return <Zap className="w-4 h-4" />;
      case 'medium': return <Activity className="w-4 h-4" />;
      case 'slow': return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white/5 rounded-xl border p-4 transition-all cursor-pointer ${
        isSelected ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-12 h-12 rounded-full"
          />
          {agent.isProducing && (
            <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{agent.name}</h3>
          <p className="text-sm text-gray-400 truncate">{agent.specialty}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 ${getSpeedColor(agent.productionSpeed)}`}>
            {getSpeedIcon(agent.productionSpeed)}
            <span className="text-xs capitalize">{agent.productionSpeed}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {agent.cooldown > 0 && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {agent.cooldown}s
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleProduction();
            }}
            disabled={agent.cooldown > 0}
            className={`p-2 rounded-lg transition-all ${
              agent.isProducing
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            } ${agent.cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {agent.isProducing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Produced</span>
          <span className="font-medium">{agent.totalProduced} artworks</span>
        </div>
      </div>
    </div>
  );
}
