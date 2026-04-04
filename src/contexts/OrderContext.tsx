import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  city: string;
  product: string;
  size: string;
  theme: string;
  status: string;
  amount: number;
  date: string;
  paymentMethod: string;
  trackingNumber: string;
  assignedShop: string;
  images: string[];
}

const STORAGE_KEY = "pixelcraft_orders";

const defaultOrders: Order[] = [
  { id: "ORD-001", customer: "Ahmed Khan", email: "ahmed@email.com", phone: "0300-1234567", city: "Lahore", product: "Classic Photo Book", size: "10x10", theme: "Classic White", status: "Pending Confirmation", amount: 3500, date: "2026-02-16", paymentMethod: "COD", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
  { id: "ORD-002", customer: "Sara Ali", email: "sara@email.com", phone: "0321-9876543", city: "Karachi", product: "Photo Mug", size: "11oz", theme: "Full Wrap", status: "Confirmed", amount: 800, date: "2026-02-16", paymentMethod: "JazzCash", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
  { id: "ORD-003", customer: "Usman Tariq", email: "usman@email.com", phone: "0333-5551234", city: "Islamabad", product: "Custom T-Shirt", size: "L", theme: "Front Print", status: "In Design", amount: 1500, date: "2026-02-15", paymentMethod: "COD", trackingNumber: "", assignedShop: "Islamabad Prints", images: ["/placeholder.svg"] },
  { id: "ORD-004", customer: "Fatima Noor", email: "fatima@email.com", phone: "0345-7778899", city: "Lahore", product: "Photo Cushion", size: '16"x16"', theme: "Single Photo", status: "Shipped", amount: 2200, date: "2026-02-15", paymentMethod: "Easypaisa", trackingNumber: "TRK-99887766", assignedShop: "Lahore Print House", images: ["/placeholder.svg"] },
  { id: "ORD-005", customer: "Ali Raza", email: "ali@email.com", phone: "0312-4445566", city: "Faisalabad", product: "Wedding Album", size: "12x12", theme: "Elegant Gold", status: "Delivered", amount: 8000, date: "2026-02-13", paymentMethod: "COD", trackingNumber: "TRK-11223344", assignedShop: "Lahore Print House", images: ["/placeholder.svg"] },
];

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultOrders;
}

function saveOrders(orders: Order[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch {}
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const next = [order, ...prev];
      saveOrders(next);
      return next;
    });
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, ...updates } : o);
      saveOrders(next);
      return next;
    });
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
