import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { artworks } from '../data/artworks';
import { Artwork } from '../context/CartContext';

interface WishlistPageProps {
  onViewDetails?: (artwork: Artwork) => void;
  onClose?: () => void;
}

export function WishlistPage({ onViewDetails, onClose }: WishlistPageProps) {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistArtworks = artworks.filter(art => wishlistItems.includes(art.id));

  const totalValue = wishlistArtworks.reduce((sum, art) => sum + art.price, 0);

  const handleAddToCart = (artwork: Artwork) => {
    addToCart(artwork);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold">My Wishlist</h1>
              <p className="text-gray-400">{wishlistArtworks.length} artworks saved</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {wishlistArtworks.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {wishlistArtworks.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Start adding artworks you love to your wishlist</p>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg transition-colors"
              >
                Browse Gallery
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-white/5 rounded-xl p-4 mb-8 flex items-center justify-between">
              <div>
                <span className="text-gray-400">Total Value</span>
                <p className="text-2xl font-bold text-purple-400">${totalValue}</p>
              </div>
              <button
                onClick={() => wishlistArtworks.forEach(art => addToCart(art))}
                className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add All to Cart
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistArtworks.map(artwork => (
                <div
                  key={artwork.id}
                  className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div
                    className="aspect-square overflow-hidden relative cursor-pointer"
                    onClick={() => onViewDetails && onViewDetails(artwork)}
                  >
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                      {artwork.category}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate">{artwork.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{artwork.artist}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500">Price</span>
                        <div className="text-lg font-bold text-purple-400">${artwork.price}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(artwork)}
                          className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromWishlist(artwork.id)}
                          className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
