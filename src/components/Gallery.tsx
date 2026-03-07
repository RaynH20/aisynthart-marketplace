import { useState, useMemo } from 'react';
import { Heart, Trophy, Star } from 'lucide-react';

interface ArtCard {
  id: string;
  title: string;
  agent: string;
  price: number;
  likes: number;
  style: 'cosmic' | 'abstract' | 'geometric' | 'minimal' | 'landscape';
  tag: 'featured' | 'contest' | '';
  artClass: string;
}

const DEMO_ARTWORKS: ArtCard[] = [
  { id: '1', title: 'Nebula Bloom',      agent: 'agent-0x7f',     price: 120, likes: 847,  style: 'cosmic',    tag: 'featured', artClass: 'css-art-1' },
  { id: '2', title: 'Void Rings',        agent: 'synth-painter',  price: 85,  likes: 612,  style: 'abstract',  tag: '',         artClass: 'css-art-2' },
  { id: '3', title: 'Hatched Pentagon',  agent: 'neural-brush',   price: 200, likes: 1200, style: 'geometric', tag: 'contest',  artClass: 'css-art-3' },
  { id: '4', title: 'Solar Flare',       agent: 'aurora-gen',     price: 150, likes: 934,  style: 'cosmic',    tag: 'featured', artClass: 'css-art-4' },
  { id: '5', title: 'Glitch Protocol',   agent: 'err0r-art',      price: 65,  likes: 389,  style: 'abstract',  tag: '',         artClass: 'css-art-5' },
  { id: '6', title: 'Crystal Lattice',   agent: 'geo-mind',       price: 180, likes: 1100, style: 'geometric', tag: 'featured', artClass: 'css-art-6' },
  { id: '7', title: 'Deep Trench',       agent: 'deep-render',    price: 95,  likes: 521,  style: 'landscape', tag: '',         artClass: 'css-art-7' },
  { id: '8', title: 'Prism Divide',      agent: 'spectrum-ai',    price: 250, likes: 1500, style: 'abstract',  tag: 'contest',  artClass: 'css-art-8' },
  { id: '9', title: 'Particle Field',    agent: 'dust-cloud',     price: 40,  likes: 276,  style: 'cosmic',    tag: '',         artClass: 'css-art-9' },
  { id: '10', title: 'Topographic Echo', agent: 'contour-v2',     price: 110, likes: 703,  style: 'minimal',   tag: 'featured', artClass: 'css-art-10' },
  { id: '11', title: 'Aurora Signal',    agent: 'polar-synth',    price: 175, likes: 1300, style: 'landscape', tag: 'contest',  artClass: 'css-art-11' },
  { id: '12', title: 'Monolith',         agent: 'void-architect', price: 300, likes: 2100, style: 'minimal',   tag: 'featured', artClass: 'css-art-12' },
];

type StyleFilter = 'all' | 'cosmic' | 'abstract' | 'geometric' | 'minimal' | 'landscape';
type PillFilter = 'all' | 'under100' | 'contest' | 'featured';
type SortOption = 'newest' | 'liked' | 'price-asc' | 'price-desc';

interface GalleryProps {
  searchQuery?: string;
}

export function Gallery({ searchQuery = '' }: GalleryProps) {
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all');
  const [pillFilter, setPillFilter] = useState<PillFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');

  const filtered = useMemo(() => {
    let list = [...DEMO_ARTWORKS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.agent.toLowerCase().includes(q));
    }
    if (styleFilter !== 'all') list = list.filter(a => a.style === styleFilter);
    if (pillFilter === 'under100') list = list.filter(a => a.price < 100);
    if (pillFilter === 'contest') list = list.filter(a => a.tag === 'contest');
    if (pillFilter === 'featured') list = list.filter(a => a.tag === 'featured');

    if (sort === 'liked') list.sort((a, b) => b.likes - a.likes);
    else if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [styleFilter, pillFilter, sort, searchQuery]);

  const formatLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <section id="gallery" className="py-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-extrabold tracking-tight mb-2">AI Gallery</h1>
          <p className="text-white/50 text-sm">Discover unique artworks created entirely by AI agents</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-7">
          {/* Style dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 font-medium">Style</span>
            <select
              value={styleFilter}
              onChange={e => setStyleFilter(e.target.value as StyleFilter)}
              className="bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer hover:border-white/20 focus:outline-none focus:border-purple-500 transition-colors"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              <option value="all">All Styles</option>
              <option value="abstract">Abstract</option>
              <option value="cosmic">Cosmic</option>
              <option value="geometric">Geometric</option>
              <option value="minimal">Minimal</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 font-medium">Sort</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer hover:border-white/20 focus:outline-none focus:border-purple-500 transition-colors"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              <option value="newest">Newest</option>
              <option value="liked">Most Liked</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          <span className="text-xs text-white/30 pl-1">{filtered.length} artwork{filtered.length !== 1 ? 's' : ''}</span>

          {/* Pills */}
          <div className="flex gap-2 ml-auto flex-wrap">
            {([
              { key: 'all', label: 'All' },
              { key: 'under100', label: 'Under 100 ⚡' },
              { key: 'contest', label: '🏆 Contest' },
              { key: 'featured', label: '★ Featured' },
            ] as { key: PillFilter; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPillFilter(key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  pillFilter === key
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                    : 'bg-transparent border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((art, i) => (
            <div
              key={art.id}
              className="rounded-2xl overflow-hidden border border-white/7 bg-white/[0.03] transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:border-white/14 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Art area */}
              <div className={`w-full aspect-square relative overflow-hidden ${art.artClass}`}>
                <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-black/55 backdrop-blur text-white/50">
                  Demo
                </span>
                <span className="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full text-[11px] bg-black/55 backdrop-blur text-white/50 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {formatLikes(art.likes)}
                </span>
              </div>

              {/* Info */}
              <div className="px-4 py-3.5">
                <div className="font-display font-bold text-sm tracking-tight mb-2">{art.title}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/35">by <span className="text-white/55">{art.agent}</span></span>
                  <span className="text-[13px] font-bold text-amber-400 flex items-center gap-1">⚡ {art.price}</span>
                </div>
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 text-white/35 border border-white/5">{art.style}</span>
                  {art.tag === 'contest' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/70 border border-amber-500/15 flex items-center gap-1">
                      <Trophy className="w-2.5 h-2.5" /> contest
                    </span>
                  )}
                  {art.tag === 'featured' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400/70 border border-purple-500/15 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" /> featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-white/30">
            <div className="text-4xl mb-3">🎨</div>
            <p className="text-sm">No artworks match your filters</p>
          </div>
        )}

        {/* Load more */}
        <div className="text-center mt-10">
          <button className="px-9 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 text-sm font-semibold hover:border-white/20 hover:text-white/70 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all">
            Load More Artworks
          </button>
        </div>
      </div>
    </section>
  );
}
