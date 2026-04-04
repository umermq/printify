import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phone: z.string().trim().regex(/^03\d{2}[-\s]?\d{7}$/, "Enter a valid Pakistani phone number (03XX-XXXXXXX)"),
  email: z.string().trim().email("Invalid email address").max(255).or(z.literal("")),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500, "Address too long"),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(50, "City name too long"),
  paymentMethod: z.enum(["cod", "online"]),
});

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkingOut, setCheckingOut] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", city: "", paymentMethod: "cod" as "cod" | "online",
  });

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      toast({ title: "Please fix the errors below", variant: "destructive" });
      return;
    }
    setErrors({});
    toast({ title: "Order Placed", description: "We'll confirm your order via WhatsApp shortly." });
    clearCart();
    navigate("/");
  };

  if (items.length === 0 && !checkingOut) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
        <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">Your cart is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">Discover our premium photo printing collection.</p>
        <Link to="/products" className="btn-luxury mt-8">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label={checkingOut ? "Checkout" : "Your Cart"}
        title={checkingOut ? "Delivery Details" : "Shopping Cart"}
      />
      <div className="container py-12 lg:py-20">

        {!checkingOut ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-border bg-background p-5 shadow-luxury">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-card overflow-hidden">
                     {item.image?.startsWith("http") ? (
                       <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                     ) : (
                       <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                     )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-serif text-base font-medium text-foreground">{item.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.size} · {item.theme}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      {/* Qty */}
                      <div className="flex items-center gap-2 rounded-lg border border-border px-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-foreground hover:text-gold transition-colors"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-foreground hover:text-gold transition-colors"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="font-serif text-base font-semibold text-foreground">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="sticky top-20 h-fit rounded-xl border border-border bg-card p-6 shadow-luxury">
              <h3 className="font-serif text-xl font-medium text-foreground">Order Summary</h3>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-gold">Free</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-serif text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setCheckingOut(true)}
                className="btn-luxury mt-6 w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleCheckout}
            className="grid gap-8 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Info */}
              <div className="rounded-xl border border-border bg-background p-6 shadow-luxury space-y-5">
                <h3 className="font-serif text-xl font-medium text-foreground">Delivery Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs tracking-widest uppercase text-muted-foreground">Full Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Muhammad Ali"
                      className="mt-1.5 border-border focus-visible:ring-gold bg-background"
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label className="text-xs tracking-widest uppercase text-muted-foreground">Phone *</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="03XX-XXXXXXX"
                      className="mt-1.5 border-border focus-visible:ring-gold bg-background"
                    />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className="mt-1.5 border-border focus-visible:ring-gold bg-background"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">Delivery Address *</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House #, Street, Area"
                    className="mt-1.5 border-border focus-visible:ring-gold bg-background"
                  />
                  {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">City *</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Lahore"
                    className="mt-1.5 border-border focus-visible:ring-gold bg-background"
                  />
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-border bg-background p-6 shadow-luxury space-y-4">
                <h3 className="font-serif text-xl font-medium text-foreground">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                    form.paymentMethod === "cod" ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "cod"}
                      onChange={() => setForm({ ...form, paymentMethod: "cod" })}
                      className="mt-0.5 accent-gold"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
                      <p className="mt-0.5 text-xs text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                    form.paymentMethod === "online" ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === "online"}
                      onChange={() => setForm({ ...form, paymentMethod: "online" })}
                      className="mt-0.5 accent-gold"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">Online Payment</span>
                      <p className="mt-0.5 text-xs text-muted-foreground">JazzCash / Easypaisa / Card (Coming Soon)</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="sticky top-20 h-fit rounded-xl border border-border bg-card p-6 shadow-luxury">
              <h3 className="font-serif text-xl font-medium text-foreground">Order Summary</h3>
              <div className="mt-5 space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="text-foreground">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-gold">Free</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-serif text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button type="submit" className="btn-luxury mt-6 w-full flex items-center justify-center gap-2">
                Place Order
              </button>
              <button
                type="button"
                onClick={() => setCheckingOut(false)}
                className="mt-3 w-full text-center text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Cart
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Cart;
