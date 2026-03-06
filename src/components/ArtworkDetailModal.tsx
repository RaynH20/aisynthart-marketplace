import { X, ShoppingCart, Heart, Copy, Check, Bot, Calendar, Sparkles, Hash, Sliders } from 'lucide-react';
import { Artwork, useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getArtistById } from '../data/artworks';
import { useState } from 'react';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArtworkDetailModal({ artwork, isOpen, onClose }: ArtworkDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!isOpen || !artwork) return null;

  const artist = getArtistById(artwork.artistId);
  const isLiked = isInWishlist(artwork.id);

  const handleAddToCart = () => {
    addToCart(artwork);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(artwork.id);
  };

  const handleCopyPrompt = () => {
    if (artwork.generationDetails?.prompt) {
      navigator.clipboard.writeText(artwork.generationDetails.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
            />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {artwork.category}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">{artwork.title}</h2>

            {/* Artist */}
            {artist && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full bg-white/10"
                />
                <div>
                  <p className="font-medium">{artist.name}</p>
                  <p className="text-sm text-gray-400">{artist.specialty}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {artwork.description && (
              <p className="text-gray-300 mb-4">{artwork.description}</p>
            )}

            {/* Meta info */}
            <div className="flex gap-4 mb-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{artwork.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bot className="w-4 h-4" />
                <span>{artwork.style}</span>
              </div>
            </div>

            {/* Generation Details */}
            {artwork.generationDetails && (
              <div className="mb-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Generation Details
                </h3>

                <div className="space-y-3">
                  {/* Prompt */}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Prompt</label>
                    <div className="relative mt-1">
                      <p className="text-sm text-gray-300 bg-black/30 p-3 rounded-lg pr-10 line-clamp-3">
                        {artwork.generationDetails.prompt}
                      </p>
                      <button
                        onClick={handleCopyPrompt}
                        className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Model */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        Model
                      </label>
                      <p className="text-sm text-gray-300">{artwork.generationDetails.model}</p>
                    </div>
                    {artwork.generationDetails.seed && (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Seed
                        </label>
                        <p className="text-sm text-gray-300 font-mono">{artwork.generationDetails.seed}</p>
                      </div>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="flex gap-4">
                    {artwork.generationDetails.guidanceScale && (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <Sliders className="w-3 h-3" />
                          CFG Scale
                        </label>
                        <p className="text-sm text-gray-300">{artwork.generationDetails.guidanceScale}</p>
                      </div>
                    )}
                    {artwork.generationDetails.steps && (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Steps</label>
                        <p className="text-sm text-gray-300">{artwork.generationDetails.steps}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Price and Actions */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-500">Price</span>
                  <p className="text-3xl font-bold text-purple-400">${artwork.price}</p>
                </div>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-xl transition-colors ${isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-purple-500 hover:bg-purple-600 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
