import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Category } from "@/data/products";

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "item";
}

function uniqueSlug(base: string, taken: string[]): string {
  if (!taken.includes(base)) return base;
  let i = 2;
  while (taken.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
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
  loading: boolean;
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (c: Category) => Promise<void>;
  updateCategory: (slug: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (slug: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { products, categories } = await fetchCatalogFromSupabase();
    setProducts(products);
    setCategories(categories);
  }, []);

  useEffect(() => {
    let active = true;
    fetchCatalogFromSupabase().then(({ products, categories }) => {
      if (!active) return;
      setProducts(products);
      setCategories(categories);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const addProduct = useCallback(async (p: Omit<Product, "id">) => {
    const { data: category, error: catError } = await supabase.from("categories").select("id").eq("slug", p.categorySlug).single();
    if (catError || !category) throw new Error("Select a valid category");
    const slug = uniqueSlug(slugify(p.name), products.map((x) => x.id));

    const { data: inserted, error: productError } = await supabase
      .from("products")
      .insert({
        category_id: category.id,
        slug,
        name: p.name,
        description: p.description,
        base_price: p.basePrice,
        delivery_days: p.deliveryDays,
        image_url: p.image,
        featured: p.featured,
      })
      .select("id")
      .single();
    if (productError) throw new Error(productError.message);

    const productId = inserted.id;
    if (p.sizes.length) {
      const { error } = await supabase.from("product_variants").insert(
        p.sizes.map((s) => ({ product_id: productId, size_label: s.label, price: s.price }))
      );
      if (error) throw new Error(error.message);
    }
    if (p.themes.length) {
      const { error } = await supabase.from("product_themes").insert(
        p.themes.map((t) => ({ product_id: productId, name: t.name, preview: t.preview, image_url: t.image, price_modifier: t.priceModifier ?? 0 }))
      );
      if (error) throw new Error(error.message);
    }
    await refresh();
  }, [products, refresh]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const { data: existing, error: findError } = await supabase.from("products").select("id").eq("slug", id).single();
    if (findError || !existing) throw new Error(findError?.message ?? "Product not found");
    const productId = existing.id;

    const patch: Record<string, unknown> = {};
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.basePrice !== undefined) patch.base_price = updates.basePrice;
    if (updates.deliveryDays !== undefined) patch.delivery_days = updates.deliveryDays;
    if (updates.image !== undefined) patch.image_url = updates.image;
    if (updates.featured !== undefined) patch.featured = updates.featured;
    if (updates.seo !== undefined) patch.seo = updates.seo;
    if (updates.categorySlug !== undefined) {
      const { data: cat, error } = await supabase.from("categories").select("id").eq("slug", updates.categorySlug).single();
      if (error || !cat) throw new Error("Select a valid category");
      patch.category_id = cat.id;
    }
    if (Object.keys(patch).length) {
      const { error } = await supabase.from("products").update(patch).eq("id", productId);
      if (error) throw new Error(error.message);
    }

    if (updates.sizes !== undefined) {
      const { error: delError } = await supabase.from("product_variants").delete().eq("product_id", productId);
      if (delError) throw new Error(delError.message);
      if (updates.sizes.length) {
        const { error } = await supabase.from("product_variants").insert(
          updates.sizes.map((s) => ({ product_id: productId, size_label: s.label, price: s.price }))
        );
        if (error) throw new Error(error.message);
      }
    }
    if (updates.themes !== undefined) {
      const { error: delError } = await supabase.from("product_themes").delete().eq("product_id", productId);
      if (delError) throw new Error(delError.message);
      if (updates.themes.length) {
        const { error } = await supabase.from("product_themes").insert(
          updates.themes.map((t) => ({ product_id: productId, name: t.name, preview: t.preview, image_url: t.image, price_modifier: t.priceModifier ?? 0 }))
        );
        if (error) throw new Error(error.message);
      }
    }
    await refresh();
  }, [refresh]);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("slug", id);
    if (error) throw new Error(error.message);
    await refresh();
  }, [refresh]);

  const addCategory = useCallback(async (c: Category) => {
    const slug = uniqueSlug(c.slug || slugify(c.name), categories.map((x) => x.slug));
    const { error } = await supabase.from("categories").insert({
      slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      image_url: c.image,
      sort_order: categories.length,
    });
    if (error) throw new Error(error.message);
    await refresh();
  }, [categories, refresh]);

  const updateCategory = useCallback(async (slug: string, updates: Partial<Category>) => {
    const patch: Record<string, unknown> = {};
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.icon !== undefined) patch.icon = updates.icon;
    if (updates.image !== undefined) patch.image_url = updates.image;
    if (updates.slug !== undefined) patch.slug = updates.slug;
    const { error } = await supabase.from("categories").update(patch).eq("slug", slug);
    if (error) throw new Error(error.message);
    await refresh();
  }, [refresh]);

  const deleteCategory = useCallback(async (slug: string) => {
    const { error } = await supabase.from("categories").delete().eq("slug", slug);
    if (error) {
      if (error.code === "23503") throw new Error("This category still has products in it — move or delete them first.");
      throw new Error(error.message);
    }
    await refresh();
  }, [refresh]);

  return (
    <ProductContext.Provider value={{ products, categories, loading, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
