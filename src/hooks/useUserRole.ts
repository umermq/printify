import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "print_shop" | "user";

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!user) {
        if (active) {
          setRoles([]);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (!active) return;
      if (error) {
        setRoles([]);
      } else {
        setRoles((data ?? []).map((r: { role: AppRole }) => r.role));
      }
      setLoading(false);
    };
    if (!authLoading) load();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return {
    roles,
    loading: authLoading || loading,
    isAdmin: roles.includes("admin"),
    isPrintShop: roles.includes("print_shop"),
  };
};
