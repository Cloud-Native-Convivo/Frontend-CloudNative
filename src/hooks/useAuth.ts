import { createContext, useContext } from "react";
import type { Role, User } from "../types";

export interface AuthContextValue {
  user: User | null;
  role: Role | null;
  setRole: (r: Role) => void;
  setUser: (u: User | null) => void;
}

export const USERS: Record<Role, User> = {
  residente: {
    nombre: "María González",
    unidad: "Torre A · Piso 12 · Unidad 1204",
    role: "residente",
  },
  conserje: {
    nombre: "Jorge Pizarro",
    unidad: "Conserjería Principal",
    role: "conserje",
  },
  admin: {
    nombre: "Ana Vidal",
    unidad: "Administración Convivo",
    role: "admin",
  },
  comite: {
    nombre: "Luis Herrera",
    unidad: "Comité de Administración",
    role: "comite",
  },
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
