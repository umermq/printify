import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Minus, Plus, ShoppingCart, Truck, Star, Shield } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const product = products.find((p) => p.id === id);
  const fileRef = useRef<HTMLInputElement>(null);

  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">Product not found</h1>
        <button className="btn-luxury mt-8" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  const currentPrice = product.sizes[selectedSize].price;

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max 10MB per image", variant: "destructive" });
        return false;
      }
      return true;
    });

    try {
      const newImages = await Promise.all(validFiles.map(fileToDataUrl));
      setUploadedImages((prev) => [...prev, ...newImages]);
      if (newImages.length > 0) {
        toast({ title: "Photos uploaded", description: `${newImages.length} image${newImages.length > 1 ? "s" : ""} ready for your order.` });
      }
    } catch {
      toast({ title: "Upload failed", description: "Please try your images again.", variant: "destructive" });
    }

    e.target.value = "";
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      size: product.sizes[selectedSize].label,
      theme: product.themes[selectedTheme].name,
      quantity,
      price: currentPrice,
      image: product.themes[selectedTheme].image || product.image,
      uploadedImages,
    });
    toast({ title: "Added to cart", description: `${product.name} × ${quantity}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container py-12 lg:py-20"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="aspect-square overflow-hidden rounded-xl bg-card shadow-luxury">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-9xl">
                  {product.themes[selectedTheme]?.preview || "📷"}
                </div>
              )}
            </div>
            {/* Thumbnail strip — theme selector as gallery */}
            <div className="flex gap-3">
              {product.themes.slice(0, 4).map((theme, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTheme(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedTheme === i
                      ? "ring-2 ring-gold ring-offset-2"
                      : "ring-1 ring-border hover:ring-gold/50"
                  }`}
                >
                  <img src={theme.image} alt={theme.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {/* Uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Upload ${i + 1}`}
                    className="h-16 w-16 rounded-lg object-cover ring-1 ring-border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Details */}
          <div className="flex flex-col">
            <span className="section-label">{product.category}</span>

            <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-foreground md:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
              </div>
              <span className="text-xs text-muted-foreground">(4.9 · 128 reviews)</span>
            </div>

            <div className="my-6 h-px bg-border" />

            {/* Price */}
            <div className="font-serif text-3xl font-semibold text-foreground">
              PKR {(currentPrice * quantity).toLocaleString()}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{product.deliveryDays}</span>
            </div>

            <div className="my-6 h-px bg-border" />

            {/* Size Selector */}
            <div>
              <h3 className="mb-3 text-xs font-medium tracking-widest uppercase text-foreground">
                Size / Option
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    className={`rounded-lg border px-4 py-2.5 text-xs font-medium tracking-wide transition-all duration-300 ${
                      selectedSize === i
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-gold"
                    }`}
                  >
                    {size.label}
                    <span className="ml-2 text-muted-foreground">
                      PKR {size.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="mt-6">
              <h3 className="mb-3 text-xs font-medium tracking-widest uppercase text-foreground">
                {product.categorySlug === "photo-prints" ? "Material / Finish" : "Theme"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.themes.map((theme, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTheme(i)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                      selectedTheme === i
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-gold"
                    }`}
                  >
                    <img src={theme.image} alt={theme.name} className="h-4 w-4 rounded object-cover" />
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload */}
            <div className="mt-6">
              <h3 className="mb-3 text-xs font-medium tracking-widest uppercase text-foreground">
                Upload Your Photos
              </h3>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gold/50 bg-card py-5 text-xs font-medium tracking-widest uppercase text-gold transition-all duration-300 hover:border-gold hover:bg-gold/5"
              >
                <Upload className="h-4 w-4" strokeWidth={1.5} />
                Choose Photos
              </button>
              <p className="mt-2 text-xs text-muted-foreground">JPG, PNG up to 10MB each</p>
            </div>

            <div className="my-6 h-px bg-border" />

            {/* Quantity + CTA */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-3 rounded-lg border border-border px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-gold"
                >
                  <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-gold"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="btn-luxury flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
                Add to Cart
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                Cash on Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                Nationwide Shipping
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                Premium Quality
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
