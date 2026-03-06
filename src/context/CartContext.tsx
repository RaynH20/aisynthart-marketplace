import { createContext, useContext, useState, ReactNode } from 'react';

export interface GenerationDetails {
  prompt: string;
  model: string;
  seed?: number;
  guidanceScale?: number;
  steps?: number;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialty: string;
  totalArtworks: number;
  joinedDate: string;
}

export interface Artwork {
  id: number;
  title: string;
  artist: string;
  artistId: string;
  price: number;
  image: string;
  category: string;
  style: string;
  generationDetails?: GenerationDetails;
  description?: string;
  createdAt?: string;
}

interface CartItem extends Artwork {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (artwork: Artwork) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === artwork.id);
      if (existing) {
        return prev.map(item =>
          item.id === artwork.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...artwork, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
