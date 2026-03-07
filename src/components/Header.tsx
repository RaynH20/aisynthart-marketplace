import { ShoppingCart, Sparkles, User, LogOut, Package, Heart, Search, Bot, Trophy, Zap, Menu, X, Crown, ChevronDown } from 'lucide-react';
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
  onRanksClick?: () => void;
  onEconomicsClick?: () => void;
  onProductionClick?: () => void;
  onBuyCreditsClick?: () => void;
  onCommissionsClick?: () => void;
  searchQuery?: string;
}

function MoreMenu({ onRanksClick, onHallOfFameClick, onProductionClick }: { onRanksClick?: () => void; onHallOfFameClick?: () => void; onProductionClick?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm"
      >
        More <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#111]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            {[
              { label: 'Ranks & Rewards', icon: <Crown className="w-4 h-4 text-amber-400" />, onClick: onRanksClick },
              { label: 'Hall of Fame', icon: <Trophy className="w-4 h-4 text-amber-500" />, onClick: onHallOfFameClick },
              { label: 'Live Feed', icon: <Zap className="w-4 h-4 text-blue-400" />, onClick: onProductionClick },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => { setOpen(false); item.onClick?.(); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.icon}{item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Header({ onCartClick, onAuthClick, onSearchChange, onWishlistClick, onCategoryClick, onAgentsClick, onContestClick, onPromptChallengeClick, onHallOfFameClick, onRanksClick, onEconomicsClick, onProductionClick, onBuyCreditsClick, onCommissionsClick, searchQuery = '' }: HeaderProps) {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { getUserOrders } = useOrders();
  const { totalWishlistItems } = useWishlist();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategoriesMobile, setShowCategoriesMobile] = useState(false);

  const userOrders = user ? getUserOrders(user.id) : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { label: 'Gallery', icon: null, href: '#gallery', onClick: () => { closeMenu(); } },
    { label: 'Agents', icon: <Bot className="w-4 h-4" />, onClick: () => { closeMenu(); onAgentsClick?.(); } },
    { label: 'Commissions', icon: <Sparkles className="w-4 h-4 text-pink-400" />, onClick: () => { closeMenu(); onCommissionsClick?.(); } },
    { label: 'Prompt Challenge', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, onClick: () => { closeMenu(); onPromptChallengeClick?.(); } },
    { label: 'Contest', icon: <Trophy className="w-4 h-4 text-amber-400" />, onClick: () => { closeMenu(); onContestClick?.(); } },
    { label: 'Ranks & Rewards', icon: <Crown className="w-4 h-4 text-amber-400" />, onClick: () => { closeMenu(); onRanksClick?.(); } },
    { label: 'Credit Economy', icon: <Zap className="w-4 h-4 text-green-400" />, onClick: () => { closeMenu(); onEconomicsClick?.(); } },
    { label: 'Hall of Fame', icon: <Trophy className="w-4 h-4 text-amber-500" />, onClick: () => { closeMenu(); onHallOfFameClick?.(); } },
    { label: 'Live Feed', icon: <Zap className="w-4 h-4 text-blue-400" />, onClick: () => { closeMenu(); onProductionClick?.(); } },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AISynthArt
            </span>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full ml-1">beta</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            <a href="#gallery" className="text-gray-300 hover:text-white transition-colors text-sm">Gallery</a>
            <button onClick={onAgentsClick} className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm">
              <Bot className="w-4 h-4" />Agents
            </button>
            <button onClick={onCommissionsClick} className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm">
              <Sparkles className="w-4 h-4 text-pink-400" />Commissions
            </button>
            <button onClick={onPromptChallengeClick} className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />Prompt Challenge
            </button>
            <button onClick={onContestClick} className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm">
              <Trophy className="w-4 h-4 text-amber-400" />Contest
            </button>
            <button onClick={onEconomicsClick} className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm">
              <Zap className="w-4 h-4 text-green-400" />Credit Economy
            </button>
            {/* More dropdown */}
            <MoreMenu
              onRanksClick={onRanksClick}
              onHallOfFameClick={onHallOfFameClick}
              onProductionClick={onProductionClick}
            />
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button onClick={onWishlistClick} className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">{totalWishlistItems}</span>
              )}
            </button>

            <div className="hidden sm:block">
              <CreditBalance onClick={onBuyCreditsClick || (() => {})} />
            </div>

            <button onClick={onCartClick} className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center">{totalItems}</span>
              )}
            </button>

            {/* Desktop user */}
            <div className="hidden md:block relative">
              {isAuthenticated ? (
                <>
                  <button onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-sm ml-1">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50">
                        <div className="p-4 border-b border-white/10">
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
                            <Package className="w-4 h-4" />{userOrders.length} orders
                          </div>
                        </div>
                        <div className="p-2 border-t border-white/10">
                          <button onClick={() => { logout(); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg transition-colors text-sm">
                            <LogOut className="w-4 h-4" />Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button onClick={onAuthClick} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-sm ml-1">
                  Sign In
                </button>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors ml-1"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-white/10 overflow-y-auto max-h-[calc(100vh-64px)]">
          {/* Mobile search */}
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/10 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Credits on mobile */}
          <div className="px-4 py-2">
            <div onClick={() => { closeMenu(); onBuyCreditsClick?.(); }}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-sm text-gray-400">Credits</span>
              <CreditBalance onClick={() => {}} />
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              item.href ? (
                <a key={item.label} href={item.href} onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-200 hover:bg-white/10 transition-colors text-base font-medium">
                  {item.icon && item.icon}
                  {item.label}
                </a>
              ) : (
                <button key={item.label} onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-200 hover:bg-white/10 transition-colors text-base font-medium text-left">
                  {item.icon && item.icon}
                  {item.label}
                </button>
              )
            ))}

            {/* Categories accordion */}
            <button onClick={() => setShowCategoriesMobile(!showCategoriesMobile)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-200 hover:bg-white/10 transition-colors text-base font-medium">
              <span>Categories</span>
              <span className="text-gray-500 text-sm">{showCategoriesMobile ? '▲' : '▼'}</span>
            </button>
            {showCategoriesMobile && (
              <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                {categories.filter(c => c !== 'All').map(cat => (
                  <button key={cat} onClick={() => { onCategoryClick?.(cat); closeMenu(); }}
                    className="text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </nav>

          {/* Auth on mobile */}
          <div className="px-4 pt-2 pb-6 border-t border-white/10 mt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-medium text-sm">{user?.name}</div>
                    <div className="text-xs text-gray-500">{userOrders.length} orders</div>
                  </div>
                </div>
                <button onClick={() => { logout(); closeMenu(); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition-colors text-sm">
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </div>
            ) : (
              <button onClick={() => { onAuthClick(); closeMenu(); }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold text-white">
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
