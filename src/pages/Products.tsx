import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories } from "@/data/products";
import { ArrowRight } from "lucide-react";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const filtered = categoryFilter
    ? products.filter((p) => p.categorySlug === categoryFilter)
    : products;

  const currentCategory = categories.find((c) => c.slug === categoryFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border py-16">
        <div className="container">
          <span className="section-label mb-4 block">
            {currentCategory ? currentCategory.name : "All Products"}
          </span>
          <h1 className="font-serif text-4xl font-medium md:text-5xl text-foreground">
            {currentCategory ? currentCategory.name : "Our Collections"}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {currentCategory
              ? currentCategory.description
              : "Browse our full collection of custom printed products crafted with precision."}
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Category Filter — minimal text tabs */}
        <div className="mb-12 flex flex-wrap items-center gap-0 border-b border-border">
          <Link
            to="/products"
            className={`relative pb-3 pr-6 text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
              !categoryFilter
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
            {!categoryFilter && (
              <span className="absolute bottom-0 left-0 h-px w-full bg-gold" />
            )}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className={`relative pb-3 pr-6 text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
                categoryFilter === cat.slug
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
              {categoryFilter === cat.slug && (
                <span className="absolute bottom-0 left-0 h-px w-full bg-gold" />
              )}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group block overflow-hidden rounded-xl border border-border bg-background shadow-luxury transition-all duration-500 hover:shadow-luxury-hover hover:border-gold/30"
              >
                {/* Image */}
                <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-card text-7xl">
                  <span className="transition-transform duration-700 group-hover:scale-105">
                    {product.themes[0]?.preview || "📷"}
                  </span>
                </div>
                {/* Info */}
                <div className="p-5">
                  <span className="section-label">{product.category}</span>
                  <h3 className="mt-2 font-serif text-lg font-medium text-foreground group-hover:text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-lg font-semibold text-foreground">
                      PKR {product.basePrice.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gold transition-all duration-300 group-hover:gap-2">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{product.deliveryDays}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-muted-foreground">No products found.</p>
            <Link to="/products" className="mt-6 inline-block text-xs tracking-widest uppercase text-gold hover:opacity-75 transition-opacity">
              View all products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
