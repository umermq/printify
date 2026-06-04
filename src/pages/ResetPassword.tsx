import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { PageHero } from "@/components/PageHero";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      const errorDescription = hash.get("error_description") || url.searchParams.get("error_description");
      if (errorDescription) {
        if (!cancelled) {
          setErrorMsg(errorDescription.replace(/\+/g, " "));
          setStatus("invalid");
        }
        return;
      }

      // PKCE flow: ?code=...
      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setErrorMsg(error.message);
          setStatus("invalid");
        } else {
          // Clean URL
          window.history.replaceState({}, "", window.location.pathname);
          setStatus("ready");
        }
        return;
      }

      // Implicit flow: #access_token=...&type=recovery
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const type = hash.get("type");
      if (accessToken && refreshToken && type === "recovery") {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (cancelled) return;
        if (error) {
          setErrorMsg(error.message);
          setStatus("invalid");
        } else {
          window.history.replaceState({}, "", window.location.pathname);
          setStatus("ready");
        }
        return;
      }

      // Fallback: check existing session
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setStatus("ready");
      } else {
        setStatus("invalid");
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStatus("ready");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Password updated successfully!" });
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-background">
        <PageHero label="Account" title="Reset Password" subtitle="Verifying your reset link..." />
        <div className="flex items-center justify-center px-4 py-12">
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-background">
        <PageHero label="Account" title="Reset Password" subtitle="Invalid or expired reset link" />
        <div className="flex flex-col items-center justify-center px-4 py-12 gap-3">
          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
          <p className="text-muted-foreground">Please request a new password reset from the login page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero label="Account" title="Set New Password" subtitle="Enter your new password below" />
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">New Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    type="password"
                    className="pl-9 bg-background border-border focus-visible:ring-gold"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">Confirm Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    type="password"
                    className="pl-9 bg-background border-border focus-visible:ring-gold"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-luxury mt-2 w-full flex items-center justify-center">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
