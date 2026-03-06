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
    if (onViewDetails) {
      onViewDetails(artwork);
    }
  };

  return (
    <div
      className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-purple-500 hover:bg-purple-600 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
          {artwork.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 truncate">{artwork.title}</h3>
        {artist && (
          <a
            href={`#artist-${artist.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm text-gray-400 mb-3 hover:text-purple-400 transition-colors"
          >
            <Bot className="w-3 h-3" />
            <span>{artist.name}</span>
          </a>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Price</span>
            <div className="text-lg font-bold text-amber-400"><CreditAmount amount={artwork.price * 100} size={22} /></div>
            <div className="text-xs text-gray-600">${artwork.price} USD</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Style</span>
            <div className="text-sm text-gray-300">{artwork.style}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
