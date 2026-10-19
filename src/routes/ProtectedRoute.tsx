import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  redirectTo?: string;
  permitirSinAsignacion?: boolean;
}

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/",
  permitirSinAsignacion = false,
}: ProtectedRouteProps) {
  const { role, user } = useAuth();
  if (!role || !allowedRoles.includes(role)) return <Navigate to={redirectTo} replace />;

  // Control Anti-Bypass: residente debe tener onboarding completo (condominioId y unidad asignada)
  if (
    role === "residente" &&
    !permitirSinAsignacion &&
    (!user?.condominioId || !user?.unidad || user.unidad === "Sin unidad asignada")
  ) {
    return <Navigate to="/completar-registro" replace />;
  }

  return <Outlet />;
}
