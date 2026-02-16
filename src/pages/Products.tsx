import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const filtered = categoryFilter ?
  products.filter((p) => p.categorySlug === categoryFilter) :
  products;

  const currentCategory = categories.find((c) => c.slug === categoryFilter);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl font-sans text-center">
          {currentCategory ? currentCategory.name : "All Products"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {currentCategory ? currentCategory.description : "Browse our full collection of custom printed products"}
        </p>
      </div>

      {/* Category filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link to="/products">
          <Button variant={!categoryFilter ? "default" : "outline"} size="sm">All</Button>
        </Link>
        {categories.map((cat) =>
        <Link key={cat.slug} to={`/products?category=${cat.slug}`}>
            <Button variant={categoryFilter === cat.slug ? "default" : "outline"} size="sm">
              {cat.icon} {cat.name}
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, i) =>
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}>

            <Link
            to={`/product/${product.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">

              <div className="flex h-48 items-center justify-center bg-muted text-6xl border-none">
                {product.themes[0]?.preview || "📷"}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-medium text-primary">{product.category}</span>
                <h3 className="mt-1 text-lg font-semibold group-hover:text-primary">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-lg font-bold">Rs. {product.basePrice.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">{product.deliveryDays}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>

      {filtered.length === 0 &&
      <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No products found in this category.</p>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">View all products</Link>
        </div>
      }
    </div>);

};

export default Products;