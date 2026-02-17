import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

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
    toast({ title: "🎉 Order Placed!", description: "We'll confirm your order via WhatsApp shortly." });
    clearCart();
    navigate("/");
  };

  if (items.length === 0 && !checkingOut) {
    return (
      <div className="container flex flex-col items-center py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse our products and add something you love!</p>
        <Link to="/products" className="mt-6">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">{checkingOut ? "Checkout" : "Your Cart"}</h1>

      {!checkingOut ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted text-3xl flex-shrink-0">
                  {item.image}
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.size} • {item.theme}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 rounded-md border border-border">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                    <span className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card h-fit sticky top-20">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs. {totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-success">Free</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                <span>Total</span><span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <Button className="mt-6 w-full bg-gradient-hero text-primary-foreground hover:opacity-90" size="lg" onClick={() => setCheckingOut(true)}>
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleCheckout}
          className="mt-8 grid gap-8 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
              <h3 className="text-lg font-semibold">Delivery Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Muhammad Ali" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX-XXXXXXX" />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label>Delivery Address *</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House #, Street, Area" />
                {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
              </div>
              <div>
                <Label>City *</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Lahore" />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <div className="space-y-2">
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${form.paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="payment" checked={form.paymentMethod === "cod"} onChange={() => setForm({ ...form, paymentMethod: "cod" })} />
                  <div>
                    <span className="font-medium">💵 Cash on Delivery</span>
                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${form.paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="payment" checked={form.paymentMethod === "online"} onChange={() => setForm({ ...form, paymentMethod: "online" })} />
                  <div>
                    <span className="font-medium">💳 Online Payment</span>
                    <p className="text-sm text-muted-foreground">JazzCash / Easypaisa / Card (Coming Soon)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card h-fit sticky top-20">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-success">Free</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                <span>Total</span><span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <Button type="submit" className="mt-6 w-full bg-gradient-hero text-primary-foreground hover:opacity-90" size="lg">
              Place Order
            </Button>
            <Button type="button" variant="ghost" className="mt-2 w-full" onClick={() => setCheckingOut(false)}>
              ← Back to Cart
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default Cart;
