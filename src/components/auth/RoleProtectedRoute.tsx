import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";

type AppRole = "admin" | "seller" | "buyer";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: AppRole[];
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { roles, isLoading: rolesLoading } = useUserRoles();
  const location = useLocation();

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAllowedRole = allowedRoles.some((role) => roles.includes(role));

  if (!hasAllowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
