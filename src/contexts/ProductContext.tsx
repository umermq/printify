import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { products as seedProducts, categories as seedCategories, type Product, type Category } from "@/data/products";

const PRODUCTS_KEY = "pixelcraft_products";
const CATEGORIES_KEY = "pixelcraft_categories";

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedProducts;
}

function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedCategories;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
  addCategory: (c: Category) => void;
  updateCategory: (slug: string, updates: Partial<Category>) => void;
  deleteCategory: (slug: string) => void;
  setCategories: (categories: Category[]) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProductsState] = useState<Product[]>(loadProducts);
  const [categories, setCategoriesState] = useState<Category[]>(loadCategories);

  // Persist products
  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  // Persist categories
  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === PRODUCTS_KEY && e.newValue) {
        try { setProductsState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === CATEGORIES_KEY && e.newValue) {
        try { setCategoriesState(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addProduct = useCallback((p: Product) => {
    setProductsState(prev => [...prev, p]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProductsState(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProductsState(prev => prev.filter(p => p.id !== id));
  }, []);

  const setProducts = useCallback((products: Product[]) => {
    setProductsState(products);
  }, []);

  const addCategory = useCallback((c: Category) => {
    setCategoriesState(prev => [...prev, c]);
  }, []);

  const updateCategory = useCallback((slug: string, updates: Partial<Category>) => {
    setCategoriesState(prev => prev.map(c => c.slug === slug ? { ...c, ...updates } : c));
  }, []);

  const deleteCategory = useCallback((slug: string) => {
    setCategoriesState(prev => prev.filter(c => c.slug !== slug));
  }, []);

  const setCategories = useCallback((categories: Category[]) => {
    setCategoriesState(categories);
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, addProduct, updateProduct, deleteProduct, setProducts, addCategory, updateCategory, deleteCategory, setCategories }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
