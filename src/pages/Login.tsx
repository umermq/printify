import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Backend required", description: "Enable Lovable Cloud to activate authentication." });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated"
      >
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
            <Camera className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">{isRegister ? "Create Account" : "Welcome Back"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRegister ? "Sign up to start ordering" : "Login to your PrintPK account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Muhammad Ali" />
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10" placeholder="03XX XXXXXXX" />
                </div>
              </div>
            </>
          )}
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" className="pl-10" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" className="pl-10" placeholder="••••••••" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90" size="lg">
            {isRegister ? "Create Account" : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="font-medium text-primary hover:underline">
            {isRegister ? "Login" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
