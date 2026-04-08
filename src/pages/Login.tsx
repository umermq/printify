import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { PageHero } from "@/components/PageHero";

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
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setErrors({ email: "Please enter your email address" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We've sent you a password reset link." });
      setIsForgot(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setLoading(true);

    if (isRegister) {
      const { error } = await signUp(formData.email, formData.password);
      setLoading(false);
      if (error) {
        toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "Please check your email to verify your account before signing in." });
        setIsRegister(false);
      }
    } else {
      const { error } = await signIn(formData.email, formData.password);
      setLoading(false);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label="Account"
        title={isForgot ? "Reset Password" : isRegister ? "Create Account" : "Welcome Back"}
        subtitle={isForgot ? "Enter your email to receive a reset link" : isRegister ? "Sign up to start your first order" : "Sign in to your PixelCraft account"}
      />
      <div className="flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <Logo size="lg" linkTo="/" className="justify-center" />
        </div>

        <div className="rounded-xl border border-border bg-background p-8 shadow-luxury">
          {isForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
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
              <button type="submit" disabled={loading} className="btn-luxury mt-2 w-full flex items-center justify-center">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="text-center text-sm text-muted-foreground">
                <button onClick={() => setIsForgot(false)} className="text-gold hover:opacity-75 font-medium transition-opacity">
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                {isRegister && (
                  <>
                    <div>
                      <Label className="text-xs tracking-widest uppercase text-muted-foreground">Full Name</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                        <Input className="pl-9 bg-background border-border focus-visible:ring-gold" placeholder="Muhammad Ali" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <Label className="text-xs tracking-widest uppercase text-muted-foreground">Phone Number</Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                        <Input className="pl-9 bg-background border-border focus-visible:ring-gold" placeholder="03XX-XXXXXXX" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                    <Input type="email" className="pl-9 bg-background border-border focus-visible:ring-gold" placeholder="you@example.com" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs tracking-widest uppercase text-muted-foreground">Password</Label>
                    {!isRegister && (
                      <button type="button" onClick={() => setIsForgot(true)} className="text-xs text-gold hover:opacity-75 transition-opacity">
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                    <Input type="password" className="pl-9 bg-background border-border focus-visible:ring-gold" placeholder="••••••••" value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-luxury mt-2 w-full flex items-center justify-center">
                  {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
                </button>
              </form>

              <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => { setIsRegister(!isRegister); setErrors({}); }} className="text-gold hover:opacity-75 font-medium transition-opacity">
                  {isRegister ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Login;
