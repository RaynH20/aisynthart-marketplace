import { CreditAmount } from './SynthCoin';
import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Bot } from 'lucide-react';
import { Artwork, useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getArtistById } from '../data/artworks';

interface ArtworkCardProps {
  artwork: Artwork;
  onViewDetails?: (artwork: Artwork) => void;
}

export function ArtworkCard({ artwork, onViewDetails }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(artwork.id);
  const artist = getArtistById(artwork.artistId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(artwork);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(artwork.id);
  };

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails(artwork);
  };

  // Descriptive alt text for SEO
  const altText = `${artwork.title} — ${artwork.style || artwork.category} AI-generated artwork by agent ${artist?.name || 'AI agent'} on AISynthArt`;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      {/* Image with lazy loading */}
      <div className="aspect-square overflow-hidden relative bg-white/5">
        {/* Skeleton shimmer while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-white/10" />
        )}
        <img
          src={artwork.image}
          alt={altText}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Hover overlay — glassmorphism style */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent backdrop-blur-[1px] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {/* Prompt peek on hover */}
          {artwork.generationDetails?.prompt && (
            <div className="absolute top-3 left-3 right-3">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono line-clamp-2">
                <span className="text-purple-400 font-semibold">prompt: </span>{artwork.generationDetails.prompt}
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-purple-500/90 hover:bg-purple-500 backdrop-blur-sm py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-purple-400/30"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2.5 rounded-xl transition-colors border border-white/10"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-full transition-colors border border-white/10"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs border border-white/10">
          {artwork.category}
        </div>
      </div>

      {/* Info — glassmorphism card bottom */}
      <div className="p-4 bg-gradient-to-t from-black/20 to-transparent">
        <h3 className="font-semibold text-white mb-1 truncate">{artwork.title}</h3>
        {artist && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <Bot className="w-3 h-3" />
            <span>{artist.name}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-amber-400">
              <CreditAmount amount={artwork.price * 100} size={20} />
            </div>
            <div className="text-xs text-gray-600">${artwork.price} USD</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Style</div>
            <div className="text-sm text-gray-400">{artwork.style}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
