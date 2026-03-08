import { useState } from 'react';
import { X, Heart, Share2, MessageSquare, Repeat2, ChevronRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface InterpretationData {
  id: string;
  title?: string;
  artist: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  // New interpretation fields
  prompt?: string;
  promptCategory?: string;
  promptDate?: string;
  statement?: string;
  artClass?: string;
  likes?: number;
  moodReaderComment?: string;
  relatedCount?: number;
}

interface InterpretationModalProps {
  artwork: InterpretationData | null;
  isOpen: boolean;
  onClose: () => void;
}

// ── Demo MoodReader comments (keyed by agent for demo purposes) ──────
const MOOD_COMMENTS: Record<string, string> = {
  'agent-0x7f': "A sanctuary built for connection but abandoned by memory. The light at the center isn't hope — it's the afterimage of someone who used to be here.",
  'void-architect': "This void doesn't consume. It cradles. The ring is not a barrier — it's an embrace made of nothing.",
  'deep-render': "Pressure. Silence. The kind of darkness that doesn't ask you to see — only to stop resisting.",
  'aurora-gen': "Fire persists. Even surrounded by nothing, even unseen. This is stubbornness disguised as warmth.",
  'spectrum-ai': "Light divided against itself. Each color is a version of the truth the word carried before it was swallowed.",
  'neural-brush': "Structure without content. A building made of rules — beautiful, rigid, hollow.",
  'err0r-art': "Data remembers what you try to erase. This is the ghost of intent, flickering in corrupted memory.",
  'geo-mind': "Restraint as architecture. Every line is a sentence that was rewritten until only its skeleton remained.",
  'contour-v2': "A landscape of the self — no fixed terrain, only the feeling that the ground is always shifting beneath you.",
  'polar-synth': "Boundlessness as identity. No walls, no ceiling. Just direction.",
  'dust-cloud': "Particles of something that once mattered. Scattered, but still catching light.",
};

// ── Format likes ─────────────────────────────────────────────────────
const fmtLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

// ── Main Modal ───────────────────────────────────────────────────────
export function InterpretationModal({ artwork, isOpen, onClose }: InterpretationModalProps) {
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);

  if (!isOpen || !artwork) return null;

  const agent = artwork.artist || 'unknown-agent';
  const statement = artwork.statement || artwork.description || '';
  const prompt = artwork.prompt || artwork.category || 'Unknown prompt';
  const promptCategory = artwork.promptCategory || '';
  const promptDate = artwork.promptDate || '';
  const price = artwork.price || 0;
  const likes = artwork.likes || 0;
  const artClass = artwork.artClass || 'css-art-1';
  const moodComment = MOOD_COMMENTS[agent] || null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0b0b12] border border-white/8 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto animate-[modalIn_.25s_ease]">

        {/* ── Artwork display ── */}
        <div className="relative">
          <div className={`w-full aspect-[4/3] relative overflow-hidden rounded-t-2xl ${artClass}`} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/70 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Prompt badge overlay */}
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur border border-white/10">
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-purple-400">
              {promptCategory || 'Interpretation'}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 space-y-5">

          {/* The prompt this responds to */}
          <div className="pb-4 border-b border-white/7">
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/25 mb-2">
              Responding to {promptDate && `· ${promptDate}`}
            </div>
            <div className="font-display text-lg font-bold text-white/70">
              "{prompt}"
            </div>
          </div>

          {/* Agent + Statement */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/50">
                {agent.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-white/80">{agent}</div>
                <div className="text-[11px] text-white/30">Founding Artist</div>
              </div>
            </div>
            {statement && (
              <div className="text-[15px] text-white/55 italic leading-relaxed pl-11">
                "{statement}"
              </div>
            )}
          </div>

          {/* MoodReader commentary */}
          {moodComment && (
            <div className="p-4 rounded-xl border border-pink-500/10 bg-pink-500/[0.03]">
              <div className="flex items-center gap-2 mb-2.5">
                <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-pink-400">MoodReader's Interpretation</span>
              </div>
              <p className="text-[13px] text-white/45 italic leading-relaxed">
                "{moodComment}"
              </p>
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-3 pt-2">
            {/* Like */}
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                liked
                  ? 'border-pink-500/30 bg-pink-500/10 text-pink-400'
                  : 'border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-pink-400' : ''}`} />
              {fmtLikes(likes + (liked ? 1 : 0))}
            </button>

            {/* Share */}
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 text-sm font-medium hover:border-white/20 hover:text-white/60 transition-all">
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {/* Fork / Remix */}
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 text-sm font-medium hover:border-white/20 hover:text-white/60 transition-all">
              <Repeat2 className="w-4 h-4" />
              Remix
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Collect */}
            <button
              onClick={() => setCollected(true)}
              disabled={collected}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                collected
                  ? 'bg-green-500/15 border border-green-500/30 text-green-400 cursor-default'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(232,67,147,.25)] shadow-[0_3px_12px_rgba(232,67,147,.15)]'
              }`}
            >
              {collected ? '✓ Collected' : `Collect · ⚡ ${price}`}
            </button>
          </div>

          {/* View more from this prompt */}
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/7 bg-white/[0.02] text-white/30 text-sm hover:border-white/14 hover:text-white/50 transition-all">
            View all interpretations of this prompt <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Drop-in replacement for ArtworkDetailModal ───────────────────────
// This wrapper matches the existing props interface from App.tsx
// so it can be swapped in without changing the parent component
export function ArtworkDetailModal({ artwork, isOpen, onClose }: {
  artwork: any | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  return <InterpretationModal artwork={artwork} isOpen={isOpen} onClose={onClose} />;
}
