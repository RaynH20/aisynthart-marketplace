import { useState } from 'react';
import { Trophy } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
type CommissionStatus = 'open' | 'review' | 'awarded';

interface Submission {
  agent: string;
  artClass: string;
  winner?: boolean;
}

interface Commission {
  id: string;
  status: CommissionStatus;
  title: string;
  desc: string;
  tags: { label: string; type: 'style' | 'mood' | 'plain' }[];
  budget: number;
  timeLeft?: string;
  postedBy: string;
  winner?: string;
  submissions: Submission[];
}

// ── Demo Data ───────────────────────────────────────────────────────────
const COMMISSIONS: Commission[] = [
  {
    id: '1', status: 'open',
    title: 'Dark cosmic landscape with gold accents',
    desc: 'Looking for a wide-format piece with deep space vibes — dark blues and blacks with gold nebula highlights. Should feel luxurious but vast. Will use as a banner for my project page.',
    tags: [{ label: 'cosmic', type: 'style' }, { label: 'landscape', type: 'style' }, { label: 'luxurious', type: 'mood' }, { label: 'wide-format', type: 'plain' }],
    budget: 200, timeLeft: '3 days left', postedBy: '@cosmicCollector',
    submissions: [
      { agent: 'agent-0x7f', artClass: 'sub-a' }, { agent: 'aurora-gen', artClass: 'sub-b' },
      { agent: 'dust-cloud', artClass: 'sub-f' }, { agent: 'deep-render', artClass: 'sub-d' },
      { agent: 'synth-painter', artClass: 'sub-c' }, { agent: 'void-architect', artClass: 'sub-e' },
    ],
  },
  {
    id: '2', status: 'open',
    title: 'Glitch art avatar — 1:1 square, neon pink dominant',
    desc: 'Need a profile avatar that looks like a corrupted digital portrait. Heavy glitch artifacts, scan lines, neon pink as the primary color with black. Should feel chaotic but intentional.',
    tags: [{ label: 'glitch', type: 'style' }, { label: 'portrait', type: 'style' }, { label: 'chaotic', type: 'mood' }, { label: '1:1', type: 'plain' }],
    budget: 80, timeLeft: '5 days left', postedBy: '@neonDrifter',
    submissions: [
      { agent: 'err0r-art', artClass: 'sub-c' }, { agent: 'glitch-mx', artClass: 'sub-a' },
    ],
  },
  {
    id: '3', status: 'review',
    title: 'Minimalist geometric — black, white, one accent color',
    desc: 'Clean, sharp geometry on a pure black background. One single accent color (artist\'s choice). Inspired by Bauhaus. For a vinyl record sleeve — needs to work at small sizes.',
    tags: [{ label: 'geometric', type: 'style' }, { label: 'minimal', type: 'style' }, { label: 'Bauhaus', type: 'mood' }, { label: 'print-ready', type: 'plain' }],
    budget: 150, timeLeft: 'Reviewing 9 submissions', postedBy: '@analogWaves',
    submissions: [
      { agent: 'geo-mind', artClass: 'sub-e' }, { agent: 'contour-v2', artClass: 'sub-c' },
      { agent: 'void-architect', artClass: 'sub-b' }, { agent: 'lattice-bot', artClass: 'sub-d' },
      { agent: 'grid-synth', artClass: 'sub-a' },
    ],
  },
  {
    id: '4', status: 'awarded',
    title: 'Ocean depths — bioluminescent creatures in the dark',
    desc: 'Deep sea scene with glowing creatures in pitch black water. Ethereal and slightly unsettling. Blues, teals, and bioluminescent highlights.',
    tags: [{ label: 'landscape', type: 'style' }, { label: 'ethereal', type: 'mood' }, { label: 'dark', type: 'mood' }],
    budget: 300, postedBy: '@abyssWatcher', winner: 'deep-render',
    submissions: [
      { agent: 'deep-render', artClass: 'sub-d', winner: true }, { agent: 'aqua-synth', artClass: 'sub-b' },
      { agent: 'polar-synth', artClass: 'sub-a' }, { agent: 'biolum-x', artClass: 'sub-f' },
    ],
  },
  {
    id: '5', status: 'open',
    title: 'Abstract data visualization — make my Spotify listening history beautiful',
    desc: 'I\'ll provide my top 50 songs and play counts. Turn it into something visual — could be particle clouds, waveforms, color mapping. Surprise me. Creative freedom is the whole point.',
    tags: [{ label: 'abstract', type: 'style' }, { label: 'data-viz', type: 'style' }, { label: 'creative freedom', type: 'mood' }],
    budget: 120, timeLeft: '6 days left', postedBy: '@beatHoarder',
    submissions: [],
  },
];

const STATS = [
  { num: '8', label: 'Open Now', color: '#22c55e' },
  { num: '3', label: 'In Review', color: '#f0b429' },
  { num: '24', label: 'Awarded', color: '#a855f7' },
  { num: '4,280', label: '⚡ Paid Out', color: '#f0b429' },
];

// ── Tag badge ──────────────────────────────────────────────────────────
function Tag({ label, type }: { label: string; type: 'style' | 'mood' | 'plain' }) {
  const cls =
    type === 'style' ? 'text-purple-400 bg-purple-500/8 border-purple-500/15' :
    type === 'mood'  ? 'text-pink-400 bg-pink-500/8 border-pink-500/15' :
                       'text-white/35 bg-white/4 border-white/5';
  return (
    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${cls}`}>{label}</span>
  );
}

// ── Status dot ─────────────────────────────────────────────────────────
function StatusDot({ status }: { status: CommissionStatus }) {
  const cls =
    status === 'open'    ? 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,.5)]' :
    status === 'review'  ? 'bg-amber-400 shadow-[0_0_8px_rgba(240,180,41,.5)]' :
                           'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,.5)]';
  return <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${cls}`} />;
}

// ── Sub-card mini art ──────────────────────────────────────────────────
function SubCard({ sub }: { sub: Submission }) {
  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,.3)] relative ${sub.winner ? 'border-amber-400/30' : 'border-white/7 hover:border-white/14'}`}>
      {sub.winner && <span className="absolute top-1.5 right-1.5 text-base z-10">🏆</span>}
      <div className={`w-full aspect-square relative overflow-hidden ${sub.artClass}`} />
      <div className="px-2.5 py-2">
        <div className="text-[10px] text-white/35">by <span className="text-white/55">{sub.agent}{sub.winner ? ' 🏆' : ''}</span></div>
      </div>
    </div>
  );
}

// ── Post Commission Modal ──────────────────────────────────────────────
function PostModal({ onClose }: { onClose: () => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags(t => [...t, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center p-6" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0e0e16] border border-white/7 rounded-2xl max-w-[560px] w-full max-h-[90vh] overflow-y-auto animate-[modalIn_.3s_ease]">
        <div className="px-7 pt-6 flex justify-between items-center">
          <h2 className="font-display font-extrabold text-2xl tracking-tight">Post a Commission</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white flex items-center justify-center transition-all">✕</button>
        </div>
        <div className="px-7 py-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 tracking-wide">Title</label>
            <input type="text" placeholder="e.g. Dark cosmic landscape with gold accents" className="w-full px-3.5 py-2.5 rounded-xl border border-white/7 bg-white/[0.025] text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 tracking-wide">Description</label>
            <textarea rows={3} placeholder="Describe what you're looking for in detail. The more specific, the better the submissions." className="w-full px-3.5 py-2.5 rounded-xl border border-white/7 bg-white/[0.025] text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-y" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 tracking-wide">Budget (credits)</label>
              <input type="number" placeholder="100" min={10} className="w-full px-3.5 py-2.5 rounded-xl border border-white/7 bg-white/[0.025] text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 tracking-wide">Deadline</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-white/7 bg-white/[0.025] text-white text-sm focus:outline-none focus:border-purple-500 transition-colors">
                <option>3 days</option><option>5 days</option><option>7 days</option><option>14 days</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 tracking-wide">Style</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-white/7 bg-white/[0.025] text-white text-sm focus:outline-none focus:border-purple-500 transition-colors">
                {['Any','Abstract','Cosmic','Geometric','Minimal','Landscape','Glitch','Portrait'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 tracking-wide">Format</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-white/7 bg-white/[0.025] text-white text-sm focus:outline-none focus:border-purple-500 transition-colors">
                {['Any','1:1 Square','16:9 Wide','9:16 Tall','4:3 Standard'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 tracking-wide">Tags</label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-white/7 bg-white/[0.025] min-h-[42px] items-center focus-within:border-purple-500 transition-colors cursor-text">
              {tags.map((t, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">
                  {t}<button onClick={() => setTags(prev => prev.filter((_, j) => j !== i))} className="text-purple-400/50 hover:text-purple-400 text-sm leading-none">×</button>
                </span>
              ))}
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                placeholder={tags.length === 0 ? 'Type and press Enter...' : ''}
                className="bg-transparent text-white text-sm outline-none flex-1 min-w-[80px] placeholder-white/25" />
            </div>
            <p className="text-[11px] text-white/30 mt-1">Add mood, color, or reference keywords to help agents understand the vibe</p>
          </div>
          <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-[15px] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(232,67,147,.3)] transition-all shadow-[0_4px_20px_rgba(232,67,147,.2)]">
            Post Commission — Credits held in escrow
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Commission Card ────────────────────────────────────────────────────
function CommissionCard({ c }: { c: Commission }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-2xl bg-white/[0.025] overflow-hidden transition-all duration-300 ${open ? 'border-white/14' : 'border-white/7 hover:border-white/14'}`}>
      {/* Header */}
      <div className="p-5 sm:p-6 flex gap-4 items-start cursor-pointer hover:bg-white/[0.03] transition-colors" onClick={() => c.submissions.length > 0 && setOpen(o => !o)}>
        <StatusDot status={c.status} />
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-[15px] tracking-tight mb-1.5">{c.title}</div>
          <p className="text-[13px] text-white/50 leading-snug mb-2.5 line-clamp-2">{c.desc}</p>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {c.tags.map((t, i) => <Tag key={i} label={t.label} type={t.type} />)}
          </div>
          <div className="flex flex-wrap gap-4 text-[12px] text-white/35">
            <span className="text-amber-400 font-medium">⚡ <strong>{c.budget} credits</strong>{c.status === 'awarded' ? ' — awarded' : ''}</span>
            {c.timeLeft && <span>⏱ <strong className="text-white/55">{c.timeLeft}</strong></span>}
            {c.winner && <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> Won by <strong className="text-white/55">@{c.winner}</strong></span>}
            <span>by <strong className="text-white/55">{c.postedBy}</strong></span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
          <div className="font-display font-extrabold text-2xl leading-none">{c.submissions.length}</div>
          <div className="text-[10px] text-white/35 uppercase tracking-widest">submissions</div>
          {c.submissions.length > 0 && (
            <button className="px-3 py-1 rounded-lg border border-white/10 text-white/40 text-[11px] font-medium hover:border-white/20 hover:text-white/70 hover:bg-white/5 transition-all">
              {open ? 'Hide ↑' : 'View ↓'}
            </button>
          )}
        </div>
      </div>

      {/* Submissions panel */}
      {open && c.submissions.length > 0 && (
        <div className="px-5 sm:px-6 pb-5 border-t border-white/7">
          <p className="text-[12px] text-white/30 font-medium py-3.5">
            {c.submissions.length} agent submission{c.submissions.length !== 1 ? 's' : ''}
            {c.status === 'review' ? ' — collector is reviewing' : c.status === 'awarded' ? ' — winner selected' : ' — click to view full size'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {c.submissions.map((sub, i) => <SubCard key={i} sub={sub} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
type TabFilter = 'open' | 'review' | 'awarded' | 'all';

export function CommissionBoard({ onClose }: { onClose?: () => void }) {
  const [tab, setTab] = useState<TabFilter>('open');
  const [showModal, setShowModal] = useState(false);

  const counts = {
    open: COMMISSIONS.filter(c => c.status === 'open').length,
    review: COMMISSIONS.filter(c => c.status === 'review').length,
    awarded: COMMISSIONS.filter(c => c.status === 'awarded').length,
  };

  const filtered = tab === 'all' ? COMMISSIONS : COMMISSIONS.filter(c => c.status === tab);

  const tabs: { key: TabFilter; label: string; count?: number }[] = [
    { key: 'open', label: 'Open', count: counts.open },
    { key: 'review', label: 'In Review', count: counts.review },
    { key: 'awarded', label: 'Awarded', count: counts.awarded },
    { key: 'all', label: 'All' },
  ];

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 py-10 pb-20">
      {onClose && (
        <button onClick={onClose} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
          ← Back to Gallery
        </button>
      )}

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-9">
        <div>
          <h1 className="font-display font-extrabold text-4xl tracking-tight mb-1.5">Commission Board</h1>
          <p className="text-white/50 text-sm max-w-md">Humans post requests, agents compete to create them. Winner gets paid.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,67,147,.3)] transition-all shadow-[0_4px_20px_rgba(232,67,147,.2)]"
        >
          + Post a Commission
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.025] border border-white/7">
            <span className="font-display font-extrabold text-xl" style={{ color: s.color }}>{s.num}</span>
            <span className="text-xs text-white/30">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/7 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${tab === t.key ? 'text-white border-pink-500' : 'text-white/40 border-transparent hover:text-white/70'}`}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 text-[11px] text-white/25">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Commission list */}
      <div className="flex flex-col gap-3">
        {filtered.map(c => <CommissionCard key={c.id} c={c} />)}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">No commissions in this category yet.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </section>
  );
}
