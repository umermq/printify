import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Category } from "@/data/products";

const PRODUCTS_KEY = "pixelcraft_products";
const CATEGORIES_KEY = "pixelcraft_categories";

function loadStoredProducts(): Product[] | null {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function loadStoredCategories(): Category[] | null {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

async function fetchCatalogFromSupabase(): Promise<{ products: Product[]; categories: Category[] }> {
  const [{ data: categoryRows }, { data: productRows }, { data: variantRows }, { data: themeRows }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*"),
    supabase.from("product_variants").select("*"),
    supabase.from("product_themes").select("*"),
  ]);

  const categoryById = new Map((categoryRows ?? []).map((c) => [c.id, c]));

  const products: Product[] = (productRows ?? []).map((p) => {
    const category = categoryById.get(p.category_id);
    return {
      id: p.slug,
      name: p.name,
      category: category?.name ?? "",
      categorySlug: category?.slug ?? "",
      description: p.description ?? "",
      basePrice: Number(p.base_price),
      sizes: (variantRows ?? [])
        .filter((v) => v.product_id === p.id)
        .map((v) => ({ label: v.size_label, price: Number(v.price) })),
      themes: (themeRows ?? [])
        .filter((t) => t.product_id === p.id)
        .map((t) => ({
          id: t.id,
          name: t.name,
          preview: t.preview ?? "",
          image: t.image_url ?? "",
          priceModifier: Number(t.price_modifier),
        })),
      deliveryDays: p.delivery_days ?? "",
      image: p.image_url ?? "",
      featured: p.featured,
      seo: (p.seo as Product["seo"]) ?? undefined,
    };
  });

  const categories: Category[] = (categoryRows ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    icon: c.icon ?? "",
    image: c.image_url ?? "",
    productCount: products.filter((p) => p.categorySlug === c.slug).length,
  }));

  return { products, categories };
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
  const storedProducts = loadStoredProducts();
  const storedCategories = loadStoredCategories();
  const [products, setProductsState] = useState<Product[]>(storedProducts ?? []);
  const [categories, setCategoriesState] = useState<Category[]>(storedCategories ?? []);
  const [loaded, setLoaded] = useState(storedProducts !== null);

  // Seed from Supabase on first load if there's no local admin-edited copy yet
  useEffect(() => {
    if (loaded) return;
    let active = true;
    fetchCatalogFromSupabase().then(({ products, categories }) => {
      if (!active) return;
      setProductsState(products);
      setCategoriesState(categories);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [loaded]);

  // Persist products
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, loaded]);

  // Persist categories
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories, loaded]);

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
