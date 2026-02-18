import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().regex(/^03\d{2}[-\s]?\d{7}$/, "Enter a valid Pakistani phone number (03XX-XXXXXXX)"),
});

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = isRegister ? registerSchema : loginSchema;
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({ title: "Backend required", description: "Enable Lovable Cloud to activate authentication." });
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-semibold tracking-widest text-foreground">PrintPK</span>
            <span className="accent-line mx-auto mt-1" />
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRegister ? "Sign up to start your first order" : "Sign in to your PrintPK account"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-background p-8 shadow-luxury">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <>
                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                    <Input
                      className="pl-9 bg-background border-border focus-visible:ring-gold"
                      placeholder="Muhammad Ali"
                      value={formData.name}
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">Phone Number</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                    <Input
                      className="pl-9 bg-background border-border focus-visible:ring-gold"
                      placeholder="03XX-XXXXXXX"
                      value={formData.phone}
                      onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                </div>
              </>
            )}

            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  type="email"
                  className="pl-9 bg-background border-border focus-visible:ring-gold"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  type="password"
                  className="pl-9 bg-background border-border focus-visible:ring-gold"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            <button type="submit" className="btn-luxury mt-2 w-full flex items-center justify-center">
              {isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-gold hover:opacity-75 font-medium transition-opacity"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
