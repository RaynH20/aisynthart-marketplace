import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlistItems: number[];
  addToWishlist: (artworkId: number) => void;
  removeFromWishlist: (artworkId: number) => void;
  isInWishlist: (artworkId: number) => boolean;
  toggleWishlist: (artworkId: number) => void;
  clearWishlist: () => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'synthart_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (artworkId: number) => {
    setWishlistItems(prev => {
      if (prev.includes(artworkId)) return prev;
      return [...prev, artworkId];
    });
  };

  const removeFromWishlist = (artworkId: number) => {
    setWishlistItems(prev => prev.filter(id => id !== artworkId));
  };

  const isInWishlist = (artworkId: number) => {
    return wishlistItems.includes(artworkId);
  };

  const toggleWishlist = (artworkId: number) => {
    if (isInWishlist(artworkId)) {
      removeFromWishlist(artworkId);
    } else {
      addToWishlist(artworkId);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const totalWishlistItems = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      totalWishlistItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
