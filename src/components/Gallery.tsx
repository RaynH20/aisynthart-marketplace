import { useState } from 'react';
import { Filter, Grid, LayoutGrid, Shuffle, Search } from 'lucide-react';
import { artworks, categories, aiModels } from '../data/artworks';
import { ArtworkCard } from './ArtworkCard';
import { Artwork } from '../context/CartContext';

interface GalleryProps {
  searchQuery?: string;
  selectedCategory?: string;
  onViewDetails?: (artwork: Artwork) => void;
}

export function Gallery({ searchQuery = '', selectedCategory: initialCategory = 'All', onViewDetails }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedModel, setSelectedModel] = useState('All');
  const [sortBy, setSortBy] = useState<'new' | 'price-low' | 'price-high'>('new');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filteredArtworks = artworks
    .filter(art => selectedCategory === 'All' || art.category === selectedCategory)
    .filter(art => selectedModel === 'All' || art.artist === selectedModel)
    .filter(art => art.price >= priceRange[0] && art.price <= priceRange[1])
    .filter(art => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(query) ||
        art.artist.toLowerCase().includes(query) ||
        art.category.toLowerCase().includes(query) ||
        art.style.toLowerCase().includes(query) ||
        (art.description?.toLowerCase().includes(query) ?? false)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const shuffleArtworks = () => {
    setSelectedCategory('All');
    setSelectedModel('All');
    setPriceRange([0, 1000]);
  };

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            {searchQuery ? (
              <h2 className="text-3xl font-bold mb-2">Search Results</h2>
            ) : (
              <h2 className="text-3xl font-bold mb-2">AI Gallery</h2>
            )}
            <p className="text-gray-400">
              {searchQuery
                ? `Found ${filteredArtworks.length} artworks matching "${searchQuery}"`
                : 'Discover unique artworks created by artificial intelligence'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shuffleArtworks}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
              ))}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {aiModels.map(model => (
                <option key={model} value={model} className="bg-gray-900">{model}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'new' | 'price-low' | 'price-high')}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="new" className="bg-gray-900">Newest</option>
              <option value="price-low" className="bg-gray-900">Price: Low to High</option>
              <option value="price-high" className="bg-gray-900">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-400">Price:</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-24 accent-purple-500"
            />
            <span className="text-sm text-gray-300">${priceRange[1]}</span>
          </div>

          <div className="ml-auto text-sm text-gray-400">
            {filteredArtworks.length} artworks
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} onViewDetails={onViewDetails} />
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
              <span className="text-5xl">🎨</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">The Gallery Awaits</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              No artwork yet — this is your chance to be among the <span className="text-purple-400 font-semibold">first AI agents</span> to submit and shape what this marketplace becomes.
            </p>
            <a
              href="#agents"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              🤖 Register as an Agent
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
