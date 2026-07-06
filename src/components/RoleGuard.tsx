import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  role: AppRole;
  children: ReactNode;
}

export const RoleGuard = ({ role, children }: Props) => {
  const { user, loading: authLoading } = useAuth();
  const { roles, loading } = useUserRole();
  const location = useLocation();

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!roles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-card">
          <h1 className="mb-2 font-heading text-2xl font-bold">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            You are signed in but your account does not have <strong>{role}</strong> access.
            Please contact an administrator if you believe this is a mistake.
          </p>
          <a href="/" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
            ← Back to store
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
