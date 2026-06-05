import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Palette, Truck, Sparkles, Star, Package, Image as ImageIcon } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import heroPrinty from "@/assets/hero-printy.png";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const features = [
  { icon: Upload, title: "Upload Your Photos", desc: "Drag, drop, and we'll handle the rest. Compressed for fast uploads on any network." },
  { icon: Palette, title: "Design Your Way", desc: "Pick sizes, finishes, themes. Live preview as you customize." },
  { icon: Package, title: "Premium Printing", desc: "Archival inks and quality materials at every branch across Pakistan." },
  { icon: Truck, title: "Nationwide Delivery", desc: "Cash on Delivery available. Tracked from print shop to your door." },
];

const steps = [
  { n: "01", title: "Upload", desc: "Share your favorite photos in seconds." },
  { n: "02", title: "Customize", desc: "Pick size, finish, and theme." },
  { n: "03", title: "Print", desc: "Our trusted print shops craft it with care." },
  { n: "04", title: "Delivered", desc: "Cash on Delivery anywhere in Pakistan." },
];

const Index = () => {
  const { products, categories } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="flex flex-col">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-hero">
        {/* Decorative blobs */}
        <div className="blob bg-primary/25" style={{ width: 420, height: 420, top: -120, left: -120 }} />
        <div className="blob bg-coral/60" style={{ width: 380, height: 380, bottom: -100, right: -100 }} />
        <div className="blob bg-amber-warm/20" style={{ width: 260, height: 260, top: "30%", right: "10%" }} />

        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-[12%] w-4 h-4 rounded-full bg-primary animate-float opacity-70" />
        <div className="absolute top-40 left-[8%] w-6 h-6 rounded-md bg-amber-warm rotate-12 animate-float opacity-80" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-[15%] w-3 h-3 rounded-full bg-coral animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-32 right-[15%] w-5 h-5 rounded-full bg-amber-warm animate-float opacity-60" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-40 right-[8%] w-8 h-2 rounded-full bg-primary/70 rotate-45 animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="container relative z-10 grid min-h-[88vh] items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          {/* Left — Text */}
          <div className="flex flex-col items-start">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /> Premium Photo Printing · Pakistan
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Print your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-amber-warm bg-clip-text text-transparent">
                  memories
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 rounded-full bg-coral/60 -z-0" />
              </span>
              <br />
              into something{" "}
              <em className="font-extrabold not-italic text-primary">magical</em>.
            </motion.h1>

            <motion.p {...fadeUp(0.22)} className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Photo books, prints, mugs, t-shirts and more — designed by you, delivered to your door across Pakistan with Cash on Delivery.
            </motion.p>

            <motion.div {...fadeUp(0.32)} className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/products" className="btn-luxury">
                Shop Online <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/products" className="btn-luxury-ghost">
                Start Designing
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.42)} className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["#FF6B35", "#F7931E", "#FFC9B5"].map((c, i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-background" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Loved by 10,000+ families</p>
              </div>
            </motion.div>
          </div>

          {/* Right — Image with circular gradient */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Big circle backdrop */}
            <div className="absolute inset-0 m-auto h-[80%] w-[80%] rounded-full bg-gradient-to-br from-primary via-amber-warm to-coral opacity-90" />

            {/* Hero person image */}
            <img
              src={heroPrinty}
              alt="Custom printed photo book and mug"
              className="relative z-10 w-full max-w-md drop-shadow-2xl"
              width={1024}
              height={1024}
              loading="eager"
            />

            {/* Floating product card — top right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-8 right-0 z-20 hidden sm:block rounded-2xl bg-white p-3 shadow-luxury-hover w-40 animate-float"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-coral to-primary/40 mb-2 flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-white" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-bold text-foreground">Wedding Album</p>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-primary text-primary" />)}
              </div>
              <button className="mt-2 w-full rounded-full bg-primary py-1.5 text-xs font-semibold text-white">
                ORDER
              </button>
            </motion.div>

            {/* Floating "Upload" pill — bottom left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute bottom-12 left-0 z-20 hidden sm:flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-2 shadow-luxury-hover animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/50">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="pr-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">Your design</p>
                <p className="text-xs font-bold text-foreground leading-tight">My memories.jpg</p>
              </div>
              <button className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wide">
                Upload
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHAT WE OFFER ─── */}
      <section className="relative bg-background py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="section-label mb-3 block">What We Offer</span>
            <h2 className="text-4xl font-bold md:text-5xl tracking-tight">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary to-amber-warm bg-clip-text text-transparent">print perfectly</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-3xl bg-card p-7 transition-all duration-400 hover:bg-white hover:-translate-y-2 hover:shadow-luxury-hover"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-warm text-white shadow-md group-hover:scale-110 transition-transform duration-400">
                  <f.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="bg-cream py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="section-label mb-3 block">Shop by Category</span>
            <h2 className="text-4xl font-bold md:text-5xl tracking-tight">Find your perfect print</h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group relative block overflow-hidden rounded-3xl bg-white shadow-luxury transition-all duration-500 hover:shadow-luxury-hover hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl bg-gradient-to-br from-coral to-primary/30">{cat.icon}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cat.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all duration-300 group-hover:gap-2.5">
                      Shop Now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
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
            transition={{ duration: 0.6 }}
            className="mb-14 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left"
          >
            <div>
              <span className="section-label mb-3 block">Best Sellers</span>
              <h2 className="text-4xl font-bold md:text-5xl tracking-tight">Loved by our customers</h2>
            </div>
            <Link to="/products" className="btn-luxury-ghost mt-6 md:mt-0">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block overflow-hidden rounded-3xl bg-white shadow-luxury transition-all duration-500 hover:shadow-luxury-hover hover:-translate-y-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-7xl">{product.themes[0]?.preview || "📷"}</div>
                    )}
                    {/* Floating pill price */}
                    <div className="absolute top-4 right-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-md">
                      PKR {product.basePrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{product.category}</span>
                    <h3 className="mt-1.5 text-lg font-bold text-foreground">{product.name}</h3>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, si) => <Star key={si} className="h-3 w-3 fill-primary text-primary" />)}
                      </div>
                      <span className="text-xs text-muted-foreground">(4.9)</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative overflow-hidden bg-gradient-hero py-24">
        <div className="blob bg-primary/20" style={{ width: 300, height: 300, top: 40, right: -80 }} />
        <div className="blob bg-coral/50" style={{ width: 240, height: 240, bottom: 40, left: -60 }} />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="section-label mb-3 block">How It Works</span>
            <h2 className="text-4xl font-bold md:text-5xl tracking-tight">
              From upload to{" "}
              <span className="bg-gradient-to-r from-primary to-amber-warm bg-clip-text text-transparent">doorstep</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Four simple steps. We do the rest.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-3xl bg-white/80 backdrop-blur p-7 text-center shadow-luxury hover:shadow-luxury-hover hover:-translate-y-2 transition-all duration-400"
              >
                <div
                  className="mx-auto mb-4 text-6xl font-extrabold leading-none bg-gradient-to-br from-primary to-amber-warm bg-clip-text text-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {s.n}
                </div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden bg-foreground py-24 text-center">
        <div className="blob bg-primary/40" style={{ width: 400, height: 400, top: -120, left: "20%" }} />
        <div className="blob bg-amber-warm/30" style={{ width: 320, height: 320, bottom: -80, right: "20%" }} />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Start Today
            </span>
            <h2 className="mt-6 text-4xl font-extrabold text-primary-foreground md:text-5xl lg:text-6xl tracking-tight">
              Ready to print something{" "}
              <span className="bg-gradient-to-r from-primary to-amber-warm bg-clip-text text-transparent">unforgettable?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-primary-foreground/60">
              Upload your photos. We'll handle printing & delivery. Cash on Delivery available nationwide.
            </p>
            <Link to="/products" className="btn-gold mt-10 inline-flex">
              Start Designing Now <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
