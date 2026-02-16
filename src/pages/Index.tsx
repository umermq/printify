import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/products";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const featured = products.filter((p) => p.featured);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Custom photo printing products" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="container relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-20 text-center md:min-h-[80vh]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl"
          >
            Turn Your Memories Into Beautiful Prints
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 max-w-xl text-lg text-primary-foreground/80 md:text-xl"
          >
            Photo books, mugs, t-shirts & gifts — delivered across Pakistan. Cash on Delivery available.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link to="/products">
              <Button size="lg" className="bg-gradient-hero text-primary-foreground shadow-elevated hover:opacity-90">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-border bg-card py-5">
        <div className="container flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground md:gap-16">
          <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> <span>Nationwide Delivery</span></div>
          <div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> <span>Cash on Delivery</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> <span>Quality Guaranteed</span></div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Shop by Category</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">Choose a category and start creating your personalized products</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <span className="text-5xl">{cat.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{cat.name}</h3>
                <p className="mt-1 text-center text-sm text-muted-foreground">{cat.description}</p>
                <span className="mt-4 text-sm font-medium text-primary group-hover:underline">
                  View Products →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold md:text-4xl">Featured Products</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">Our most popular custom print products</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
                >
                  <div className="flex h-48 items-center justify-center bg-muted text-6xl">
                    {product.themes[0]?.preview || "📷"}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-medium text-primary">{product.category}</span>
                    <h3 className="mt-1 text-lg font-semibold group-hover:text-primary">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-lg font-bold text-foreground">Rs. {product.basePrice.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{product.deliveryDays}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/products">
              <Button variant="outline" size="lg">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero py-16 text-center">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Ready to Create Something Special?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">Upload your photos and we'll turn them into beautiful printed products. Cash on Delivery available nationwide.</p>
          <Link to="/products" className="mt-6 inline-block">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:opacity-90">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
