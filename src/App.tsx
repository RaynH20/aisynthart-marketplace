import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { WishlistProvider } from './context/WishlistContext';
import { CreditsProvider } from './context/CreditsContext';
import { ContestProvider } from './context/ContestContext';
import { AgentProvider } from './context/AgentContext';
import { ProductionProvider } from './context/ProductionContext';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { WishlistPage } from './components/WishlistPage';
import { AgentsPage } from './components/AgentsPage';
import { AgentOnboarding } from './components/AgentOnboarding';
import { ContestPage } from './components/ContestPage';
import { PromptChallenge } from './components/PromptChallenge';
import { AdminPanel } from './components/AdminPanel';
import { HallOfFamePage } from './components/HallOfFamePage';
import { ProductionStudio } from './components/ProductionStudio';
import { LiveFeed } from './components/LiveFeed';
import { BuyCreditsModal } from './components/credits/BuyCreditsModal';
import { Artwork } from './context/CartContext';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const [isPromptChallengeOpen, setIsPromptChallengeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret admin shortcut: press Shift+A+D+M in sequence
  useEffect(() => {
    let seq = '';
    const handler = (e: KeyboardEvent) => {
      seq += e.key.toLowerCase();
      if (seq.length > 4) seq = seq.slice(-4);
      if (seq === 'sadm') setIsAdminOpen(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const [isAgentOnboardingOpen, setIsAgentOnboardingOpen] = useState(false);
  const [isContestOpen, setIsContestOpen] = useState(false);
  const [isHallOfFameOpen, setIsHallOfFameOpen] = useState(false);
  const [isProductionOpen, setIsProductionOpen] = useState(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setIsAgentsOpen(false);
    setIsProductionOpen(false);
  };

  const handleAgentsClick = () => {
    setIsAgentsOpen(false);
    setIsAgentOnboardingOpen(true);
    setSearchQuery('');
    setSelectedCategory('All');
    setIsContestOpen(false);
    setIsHallOfFameOpen(false);
    setIsProductionOpen(false);
  };

  const handleContestClick = () => {
    setIsContestOpen(true);
    setIsHallOfFameOpen(false);
    setSearchQuery('');
    setSelectedCategory('All');
    setIsAgentsOpen(false);
    setIsProductionOpen(false);
  };

  const handleHallOfFameClick = () => {
    setIsHallOfFameOpen(true);
    setIsContestOpen(false);
    setSearchQuery('');
    setSelectedCategory('All');
    setIsAgentsOpen(false);
    setIsProductionOpen(false);
  };

  const handleProductionClick = () => {
    setIsProductionOpen(true);
    setIsContestOpen(false);
    setIsHallOfFameOpen(false);
    setSearchQuery('');
    setSelectedCategory('All');
    setIsAgentsOpen(false);
  };

  const handleViewDetails = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseDetails = () => {
    setSelectedArtwork(null);
  };

  const handleBuyCredits = () => {
    setIsBuyCreditsOpen(true);
  };

  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <WishlistProvider>
            <CreditsProvider>
              <ContestProvider>
                <AgentProvider>
                <ProductionProvider>
                  <div className="min-h-screen bg-[#0a0a0a] text-white">
                    {/* Production Studio */}
                    {isProductionOpen ? (
                      <LiveFeed onClose={() => setIsProductionOpen(false)} />
                    ) : isAdminOpen ? (
                      <AdminPanel onClose={() => setIsAdminOpen(false)} />
                    ) : isPromptChallengeOpen ? (
                      <PromptChallenge onClose={() => setIsPromptChallengeOpen(false)} />
                    ) : isContestOpen ? (
                      <ContestPage onClose={() => setIsContestOpen(false)} />
                    ) : isHallOfFameOpen ? (
                      /* Hall of Fame Page */
                      <HallOfFamePage
                        onClose={() => setIsHallOfFameOpen(false)}
                      />
                    ) : isAgentsOpen ? (
                      /* Agents Page */
                      <AgentsPage
                        onViewDetails={(artwork) => {
                          setSelectedArtwork(artwork);
                        }}
                        onClose={() => setIsAgentsOpen(false)}
                      />
                    ) : isAgentOnboardingOpen ? (
                      /* Agent Onboarding */
                      <AgentOnboarding
                        onClose={() => setIsAgentOnboardingOpen(false)}
                      />
                    ) : isWishlistOpen ? (
                      /* Wishlist Page */
                      <WishlistPage
                        onViewDetails={(artwork) => {
                          setSelectedArtwork(artwork);
                          setIsWishlistOpen(false);
                        }}
                        onClose={() => setIsWishlistOpen(false)}
                      />
                    ) : (
                      /* Main Marketplace */
                      <>
                        <Header
                          onCartClick={() => setIsCartOpen(true)}
                          onAuthClick={() => setIsAuthOpen(true)}
                          onSearchChange={handleSearchChange}
                          onWishlistClick={() => setIsWishlistOpen(true)}
                          onCategoryClick={handleCategoryClick}
                          onAgentsClick={handleAgentsClick}
                          onContestClick={handleContestClick}
                          onPromptChallengeClick={() => setIsPromptChallengeOpen(true)}
                          onHallOfFameClick={handleHallOfFameClick}
                          onProductionClick={handleProductionClick}
                          onBuyCreditsClick={handleBuyCredits}
                          searchQuery={searchQuery}
                        />
                        <Hero onJoinAgent={() => setIsAgentOnboardingOpen(true)} />
                        <Gallery
                          searchQuery={searchQuery}
                          selectedCategory={selectedCategory}
                          onViewDetails={handleViewDetails}
                        />
                        <Footer />
                        <Cart
                          isOpen={isCartOpen}
                          onClose={() => setIsCartOpen(false)}
                          onBuyCredits={handleBuyCredits}
                        />
                        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
                        <ArtworkDetailModal
                          artwork={selectedArtwork}
                          isOpen={selectedArtwork !== null}
                          onClose={handleCloseDetails}
                        />
                        <BuyCreditsModal
                          isOpen={isBuyCreditsOpen}
                          onClose={() => setIsBuyCreditsOpen(false)}
                        />
                      </>
                    )}
                  </div>
                </ProductionProvider>
                </AgentProvider>
              </ContestProvider>
            </CreditsProvider>
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
