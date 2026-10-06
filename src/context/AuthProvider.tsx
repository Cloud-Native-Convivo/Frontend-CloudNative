import { useState, useMemo, useCallback, useEffect, type ReactNode } from "react";
import type { Role, User } from "../types";
import { getStoredUser as loadUser, setStoredUser } from "../utils/authStorage";
import { cerrarSesionCognito, EVENTO_SESION_EXPIRADA } from "../auth/tokenManager";
import { notify } from "../utils/notify";
import { AuthContext, USERS } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(loadUser);

  const setUser = useCallback((u: User | null) => {
    if (u) {
      setStoredUser(u);
    } else {
      // Logout: borra los tokens locales y revoca el refresh token en Cognito.
      void cerrarSesionCognito();
    }
    setUserState(u);
  }, []);

  // El refresh token venció o fue revocado: tokenManager ya borró la sesión local,
  // acá solo se saca al usuario del estado para que las rutas protegidas redirijan.
  useEffect(() => {
    const alExpirar = () => {
      setUserState(null);
      notify.warning({ title: "Tu sesión expiró, vuelve a iniciar sesión" });
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  const role = user?.role ?? null;
  const setRole = useCallback((r: Role) => setUser(USERS[r]), [setUser]);
  const value = useMemo(() => ({ user, role, setRole, setUser }), [user, role, setRole, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
