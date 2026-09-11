import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchOrders, updateOrderRow } from "@/lib/adminOrders";

/** One product line within an order. */
export interface OrderLine {
  product: string;
  size: string;
  theme: string;
  quantity: number;
  unitPrice: number;
  images: string[];
}

export interface Order {
  id: string;
  /** Row id in public.orders, once the order has been written to Supabase. */
  supabaseOrderId?: string;
  customer: string;
  email: string;
  phone: string;
  city: string;
  /**
   * Every line the customer bought. Absent on orders written before the store
   * became per-order rather than per-line, and on the seeded demo rows — read
   * these through orderLines() rather than directly.
   */
  items?: OrderLine[];
  /** Summary of the first line, kept so older single-line rows still render. */
  product: string;
  size: string;
  theme: string;
  status: string;
  /** Order total, including shipping. */
  amount: number;
  shipping?: number;
  date: string;
  paymentMethod: string;
  trackingNumber: string;
  assignedShop: string;
  /** Every photo across every line. */
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

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  /** Why the orders could not be loaded, for the admin to see rather than an empty table. */
  error: string | null;
  refresh: () => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  dashboardStats: DashboardStats;
  customers: DerivedCustomer[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setOrders(await fetchOrders());
      setError(null);
    } catch (err) {
      // An admin staring at an empty table cannot tell "no orders yet" from
      // "the query failed", so the reason is kept and shown.
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    // A sign-in changes which rows RLS will return, so reload on that too.
    const { data } = supabase.auth.onAuthStateChange(() => { void refresh(); });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  /**
   * `id` is the batch number the table shows; the write needs the row id it
   * was derived from. The optimistic update is reverted if the write fails,
   * so the admin never sees a status that was not saved.
   */
  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    const target = orders.find(o => o.id === id);
    if (!target?.supabaseOrderId) throw new Error("This order has no database row to update.");

    const previous = orders;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    try {
      await updateOrderRow(target.supabaseOrderId, updates);
    } catch (err) {
      setOrders(previous);
      throw err;
    }
  }, [orders]);

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
    <OrderContext.Provider value={{ orders, loading, error, refresh, updateOrder, dashboardStats, customers }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
