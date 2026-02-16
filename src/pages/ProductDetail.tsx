import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Check, Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
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
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button className="mt-4" onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  const currentPrice = product.sizes[selectedSize].price;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max 10MB per image", variant: "destructive" });
        return;
      }
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });
    setUploadedImages((prev) => [...prev, ...newImages]);
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
      image: product.themes[selectedTheme].preview,
      uploadedImages,
    });
    toast({ title: "Added to cart!", description: `${product.name} × ${quantity}` });
  };

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-10 lg:grid-cols-2"
      >
        {/* Left - Image */}
        <div className="flex flex-col gap-4">
          <div className="flex h-80 items-center justify-center rounded-xl border border-border bg-muted text-8xl lg:h-[450px]">
            {product.themes[selectedTheme]?.preview || "📷"}
          </div>
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((img, i) => (
                <img key={i} src={img} alt={`Upload ${i + 1}`} className="h-20 w-20 rounded-lg border border-border object-cover" />
              ))}
            </div>
          )}
        </div>

        {/* Right - Details */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary">{product.category}</span>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" /> Delivery: {product.deliveryDays}
          </div>

          <div className="mt-6 text-3xl font-bold text-foreground">
            Rs. {(currentPrice * quantity).toLocaleString()}
          </div>

          {/* Size */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold">Size / Option</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(i)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    selectedSize === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {size.label} — Rs. {size.price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold">Theme</h3>
            <div className="flex flex-wrap gap-2">
              {product.themes.map((theme, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTheme(i)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    selectedTheme === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <span>{theme.preview}</span> {theme.name}
                  {selectedTheme === i && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold">Upload Your Photos</h3>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            <Button variant="outline" onClick={() => fileRef.current?.click()} className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" /> Choose Photos
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG up to 10MB each</p>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-border">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button size="lg" className="flex-1 bg-gradient-hero text-primary-foreground hover:opacity-90 sm:flex-none" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>

          {/* COD badge */}
          <div className="mt-6 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-foreground">
            ✅ <strong>Cash on Delivery</strong> available nationwide. Order with confidence!
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
