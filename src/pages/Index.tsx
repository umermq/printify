import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, Shield, Truck, CreditCard, Star } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import heroBanner from "@/assets/hero-banner.jpg";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" as const },
});

const trustItems = [
  { icon: Award, label: "Premium Quality", sub: "Archival-grade materials" },
  { icon: Shield, label: "Secure Payments", sub: "JazzCash & Easypaisa" },
  { icon: CreditCard, label: "Cash on Delivery", sub: "Pay when it arrives" },
  { icon: Truck, label: "Nationwide Delivery", sub: "Across all Pakistan" },
];

const testimonials = [
  {
    quote: "The wedding album PixelCraft made for us is absolutely stunning. The quality surpassed every expectation we had — it feels like a true heirloom.",
    name: "Aisha & Hamza",
    location: "Lahore",
  },
];

const Index = () => {
  const { products, categories } = useProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <div className="flex flex-col">

      {/* ─── HERO — Split Layout ─── */}
      <section className="grid min-h-[92vh] lg:grid-cols-2">
        {/* Left — Text */}
        <div className="flex flex-col items-start justify-center bg-card px-8 py-20 md:px-16 lg:px-20">
          <motion.div {...fadeUp(0)}>
            <span className="section-label mb-6 block">Premium Photo Printing · Pakistan</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.12)}
            className="font-serif max-w-lg text-5xl font-medium leading-[1.1] tracking-wide text-foreground md:text-6xl lg:text-[4.25rem]"
          >
            Print Your Moments.
            <br />
            <em className="font-light not-italic text-muted-foreground">Preserve Them Forever.</em>
          </motion.h1>

          <motion.p {...fadeUp(0.24)} className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
            Premium quality photo prints crafted with precision and elegance — delivered across Pakistan.
          </motion.p>

          <motion.div {...fadeUp(0.36)} className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/products" className="btn-luxury">
              Explore Collection <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/products" className="btn-luxury-ghost">
              Start Designing
            </Link>
          </motion.div>

          {/* Thin gold decorative line */}
          <motion.div {...fadeUp(0.48)} className="mt-12 flex items-center gap-4">
            <span className="accent-line" />
            <span className="text-xs tracking-widest text-muted-foreground uppercase">Est. 2020 · Trusted by 10,000+ families</span>
          </motion.div>
        </div>

        {/* Right — Image */}
        <div className="relative hidden lg:block">
          <img
            src={heroBanner}
            alt="Elegant photo printing showcase"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-foreground/20" />
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-10 left-10 rounded-lg bg-background/90 backdrop-blur-sm p-5 shadow-luxury"
          >
            <div className="flex gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-gold text-gold" />)}
            </div>
            <p className="text-xs font-medium text-foreground">Rated 4.9 / 5 by customers</p>
            <p className="text-xs text-muted-foreground">Over 10,000 happy families</p>
          </motion.div>
        </div>

        {/* Mobile hero image */}
        <div className="relative h-64 lg:hidden">
          <img src={heroBanner} alt="Premium photo prints" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/25" />
        </div>
      </section>

      {/* ─── COLLECTIONS ─── */}
      <section className="bg-background py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14 text-center"
          >
            <span className="section-label mb-4 block">Our Collections</span>
            <h2 className="font-serif text-4xl font-medium md:text-5xl">Crafted for Every Occasion</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              From intimate photo books to bold statement prints — everything made with care.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group block overflow-hidden rounded-xl bg-card shadow-luxury transition-all duration-500 hover:shadow-luxury-hover hover:-translate-y-1"
                >
                  {/* Image area */}
                  <div className="relative h-52 overflow-hidden bg-muted">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl">{cat.icon}</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>
                  {/* Content */}
                  <div className="border-b-2 border-transparent p-5 transition-all duration-500 group-hover:border-gold">
                    <h3 className="font-serif text-lg font-medium text-foreground">{cat.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cat.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold font-medium transition-all duration-300 group-hover:gap-2">
                      View Collection <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="bg-foreground py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30">
                  <item.icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-serif text-base font-medium text-primary-foreground">{item.label}</h3>
                <p className="mt-1 text-xs text-primary-foreground/40">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─── */}
      <section className="bg-background py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14 text-center"
          >
            <span className="section-label mb-4 block">Best Sellers</span>
            <h2 className="font-serif text-4xl font-medium md:text-5xl">Most Loved Products</h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block overflow-hidden rounded-xl bg-background border border-border shadow-luxury transition-all duration-500 hover:shadow-luxury-hover hover:border-gold/30"
                >
                  {/* Product image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-card">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-7xl">
                        {product.themes[0]?.preview || "📷"}
                      </div>
                    )}
                  </div>
                  {/* Product info */}
                  <div className="p-5">
                    <span className="section-label">{product.category}</span>
                    <h3 className="mt-2 font-serif text-lg font-medium text-foreground">{product.name}</h3>
                    {/* Stars */}
                    <div className="mt-2 flex gap-0.5">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className="h-3 w-3 fill-gold text-gold" />
                      ))}
                      <span className="ml-1.5 text-xs text-muted-foreground">(4.9)</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-serif text-lg font-semibold text-foreground">
                        PKR {product.basePrice.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gold transition-all duration-300 group-hover:gap-2">
                        View Details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/products" className="btn-luxury-ghost">
              View All Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section className="bg-card py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="section-label mb-8 block">Customer Stories</span>
            {testimonials.map((t, i) => (
              <div key={i}>
                {/* Large gold quotation mark */}
                <span className="font-serif text-6xl leading-none text-gold select-none">&ldquo;</span>
                <blockquote className="font-serif text-xl font-light italic leading-relaxed text-foreground md:text-2xl">
                  {t.quote}
                </blockquote>
                <div className="mt-8 flex flex-col items-center gap-2">
                  <span className="accent-line" />
                  <span className="mt-3 font-serif text-base font-medium text-foreground">{t.name}</span>
                  <span className="text-xs tracking-widest uppercase text-muted-foreground">{t.location}</span>
                </div>
                <div className="mt-4 flex justify-center gap-0.5">
                  {[...Array(5)].map((_, si) => <Star key={si} className="h-3.5 w-3.5 fill-gold text-gold" />)}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-foreground py-24 text-center">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label mb-6 block !text-gold">Begin Your Story</span>
            <h2 className="font-serif text-4xl font-medium text-primary-foreground md:text-5xl lg:text-6xl">
              Ready to Create Something
              <br />
              <em className="font-light">Timeless?</em>
            </h2>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/50">
              Upload your photos and we'll craft them into beautiful prints. Cash on Delivery available nationwide.
            </p>
            <Link to="/products" className="btn-gold mt-10 inline-flex">
              Start Designing Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
