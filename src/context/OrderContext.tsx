import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Artwork } from './CartContext';

export interface Order {
  id: string;
  userId: string;
  items: (Artwork & { quantity: number })[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (userId: string, items: (Artwork & { quantity: number })[], total: number) => Order;
  getUserOrders: (userId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_KEY = 'synthart_orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem(ORDERS_KEY);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
    setOrders(newOrders);
  };

  const createOrder = (userId: string, items: (Artwork & { quantity: number })[], total: number): Order => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      userId,
      items,
      total,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [...orders, newOrder];
    saveOrders(updatedOrders);

    return newOrder;
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId);
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
