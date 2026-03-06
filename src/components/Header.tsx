import { ShoppingCart, Sparkles, User, LogOut, Package, Heart, Search, Bot, Trophy, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import { categories } from '../data/artworks';
import { CreditBalance } from './credits/CreditBalance';

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  onSearchChange?: (query: string) => void;
  onWishlistClick?: () => void;
  onCategoryClick?: (category: string) => void;
  onAgentsClick?: () => void;
  onContestClick?: () => void;
  onPromptChallengeClick?: () => void;
  onHallOfFameClick?: () => void;
  onProductionClick?: () => void;
  onBuyCreditsClick?: () => void;
  searchQuery?: string;
}

export function Header({ onCartClick, onAuthClick, onSearchChange, onWishlistClick, onCategoryClick, onAgentsClick, onContestClick, onPromptChallengeClick, onHallOfFameClick, onProductionClick, onBuyCreditsClick, searchQuery = '' }: HeaderProps) {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { getUserOrders } = useOrders();
  const { totalWishlistItems } = useWishlist();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const userOrders = user ? getUserOrders(user.id) : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AISynthArt
            </span>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full ml-2">
              beta
            </span>
          </div>

          {/* Search Bar */}
          <div className={`hidden md:flex items-center ${showSearch ? 'flex-1 max-w-md mx-8' : ''}`}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/10 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">
              Gallery
            </a>
            <button
              onClick={onAgentsClick}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
              <Bot className="w-4 h-4" />
              Agents
            </button>
            <button
              onClick={onContestClick}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Contest
            </button>
            <button
              onClick={onPromptChallengeClick}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Prompt Challenge
            </button>
            <button
              onClick={onProductionClick}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              Production
            </button>
            <button
              onClick={onHallOfFameClick}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Hall of Fame
            </button>
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[150px]">
                {categories.filter(c => c !== 'All').map(cat => (
                  <button
                    key={cat}
                    onClick={() => onCategoryClick && onCategoryClick(cat)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Heart className="w-6 h-6" />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {totalWishlistItems}
                </span>
              )}
            </button>

            {/* Credits Balance */}
            <CreditBalance onClick={onBuyCreditsClick || (() => {})} />

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>

                      <div className="p-2">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400">
                          <Package className="w-4 h-4" />
                          <span>{userOrders.length} orders</span>
                        </div>
                      </div>

                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/10 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
