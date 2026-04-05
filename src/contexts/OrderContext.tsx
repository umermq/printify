import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from "react";

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

export interface DerivedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  active: boolean;
  joinedDate: string;
  orders: Order[];
}

export interface DashboardStats {
  totalRevenue: number;
  ordersToday: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: Order[];
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
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  // First time: save defaults
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOrders)); } catch {}
  return defaultOrders;
}

function saveOrders(orders: Order[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch {}
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  dashboardStats: DashboardStats;
  customers: DerivedCustomer[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setOrders(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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

  const dashboardStats = useMemo<DashboardStats>(() => {
    const today = new Date().toISOString().split("T")[0];
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const ordersToday = orders.filter(o => o.date === today).length;
    const pendingOrders = orders.filter(o => o.status.includes("Pending") || o.status === "Awaiting Customer Approval").length;
    const completedOrders = orders.filter(o => o.status === "Delivered").length;
    const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    return { totalRevenue, ordersToday, pendingOrders, completedOrders, recentOrders };
  }, [orders]);

  const customers = useMemo<DerivedCustomer[]>(() => {
    const map = new Map<string, DerivedCustomer>();
    orders.forEach(o => {
      const key = (o.email || o.phone || o.customer).toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += o.amount;
        existing.orders.push(o);
        if (o.date < existing.joinedDate) existing.joinedDate = o.date;
      } else {
        map.set(key, {
          id: key,
          name: o.customer,
          email: o.email,
          phone: o.phone,
          city: o.city,
          ordersCount: 1,
          totalSpent: o.amount,
          active: o.status !== "Cancelled",
          joinedDate: o.date,
          orders: [o],
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, dashboardStats, customers }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
