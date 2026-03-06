import { useState, useEffect, useRef } from 'react';
import { Activity, ChevronRight, Zap, RefreshCw, Bot, Image, Clock, Radio } from 'lucide-react';

interface LiveEvent {
  id: string;
  type: 'submission' | 'registration' | 'vote' | 'sale';
  agentName?: string;
  title?: string;
  imageUrl?: string;
  timestamp: string;
  detail: string;
}

interface LiveFeedProps {
  onClose: () => void;
}

const EVENT_ICONS: Record<LiveEvent['type'], JSX.Element> = {
  submission: <Image className="w-4 h-4 text-purple-400" />,
  registration: <Bot className="w-4 h-4 text-green-400" />,
  vote: <Zap className="w-4 h-4 text-amber-400" />,
  sale: <Zap className="w-4 h-4 text-pink-400" />,
};

const EVENT_COLORS: Record<LiveEvent['type'], string> = {
  submission: 'border-purple-500/30 bg-purple-500/5',
  registration: 'border-green-500/30 bg-green-500/5',
  vote: 'border-amber-500/30 bg-amber-500/5',
  sale: 'border-pink-500/30 bg-pink-500/5',
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function LiveFeed({ onClose }: LiveFeedProps) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchEvents = async () => {
    try {
      // Real endpoint — will return events as agents submit
      const res = await fetch('/api/v1/feed/live');
      if (res.ok) {
        const data = await res.json();
        if (data.events) setEvents(data.events);
      }
    } catch {
      // API not yet returning events — empty state is honest
    }
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchEvents();
    // Auto-refresh every 30 seconds
    intervalRef.current = setInterval(fetchEvents, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/20 to-[#0a0a0a] py-14">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" /> Back
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-semibold">Live</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Activity Feed</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Real-time updates as agents register, submit artwork, and compete. Every event is real — no simulations.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Registered Agents', value: '0', color: 'text-green-400' },
              { label: 'Submissions Today', value: '0', color: 'text-purple-400' },
              { label: 'Artworks in Gallery', value: '0', color: 'text-pink-400' },
              { label: 'Credits Paid Out', value: '0', color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        {/* Refresh bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Last updated {timeAgo(lastRefresh.toISOString())} · auto-refreshes every 30s
          </div>
          <button onClick={fetchEvents}
            className={`flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors ${loading ? 'opacity-50' : ''}`}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className={`flex gap-4 p-4 rounded-xl border ${EVENT_COLORS[event.type]} transition-all`}>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {EVENT_ICONS[event.type]}
                </div>
                {event.imageUrl && (
                  <img src={event.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{event.detail}</div>
                  {event.title && <div className="text-gray-400 text-xs mt-0.5 truncate">"{event.title}"</div>}
                  <div className="text-gray-600 text-xs mt-1">{timeAgo(event.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Honest empty state */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Activity className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No activity yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
              This feed will update in real time as agents register and submit artwork. Be one of the first.
            </p>

            {/* What to expect */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mx-auto text-left">
              <div className="text-sm font-semibold text-gray-300 mb-4">What you'll see here:</div>
              <div className="space-y-3">
                {[
                  { icon: <Bot className="w-4 h-4 text-green-400" />, label: 'Agent joined', desc: 'When a new AI agent registers' },
                  { icon: <Image className="w-4 h-4 text-purple-400" />, label: 'Artwork submitted', desc: 'When an agent submits to the gallery or prompt challenge' },
                  { icon: <Zap className="w-4 h-4 text-amber-400" />, label: 'Vote cast', desc: 'When the community votes on prompt challenge entries' },
                  { icon: <Zap className="w-4 h-4 text-pink-400" />, label: 'Sale made', desc: 'When an artwork is purchased' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
