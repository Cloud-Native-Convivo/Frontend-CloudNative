import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  redirectTo?: string;
}

export default function ProtectedRoute({ allowedRoles, redirectTo = "/" }: ProtectedRouteProps) {
  const { role } = useAuth();
  if (!role || !allowedRoles.includes(role)) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
}
