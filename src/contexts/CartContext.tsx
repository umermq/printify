import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  size: string;
  theme: string;
  quantity: number;
  price: number;
  image: string;
  /** Data URLs, for previewing the photos in the cart. */
  uploadedImages: string[];
  /** The photos themselves, uploaded to Supabase Storage at checkout. */
  photoFiles?: File[];
  /** Row ids in public.products / product_variants / product_themes, for order_items. */
  productDbId?: string;
  variantId?: string;
  themeId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

let lineCounter = 0;
/** Unique per cart line, and stable within a session. */
const nextLineId = () => `${Date.now().toString(36)}-${(lineCounter += 1)}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size && i.theme === item.theme);
      if (existing) {
        // The photos are what makes each add distinct, so keep both sets rather
        // than letting the second one fall on the floor.
        return prev.map((i) =>
          i.id === existing.id
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                uploadedImages: [...i.uploadedImages, ...item.uploadedImages],
                photoFiles: [...(i.photoFiles ?? []), ...(item.photoFiles ?? [])],
              }
            : i
        );
      }
      // Date.now() alone collides when a batch is added in one tick — the
      // wizard adds a line per photo — and two lines sharing an id makes
      // removeItem and updateQuantity hit both.
      return [...prev, { ...item, id: `${item.id}-${nextLineId()}` }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
