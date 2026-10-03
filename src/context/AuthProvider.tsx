import { useState, useMemo, useCallback, type ReactNode } from "react";
import type { Role, User } from "../types";
import { getStoredUser as loadUser, setStoredUser, clearStoredAuth } from "../utils/authStorage";
import { AuthContext, USERS } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(loadUser);

  const setUser = useCallback((u: User | null) => {
    if (u) {
      setStoredUser(u);
    } else {
      clearStoredAuth();
    }
    setUserState(u);
  }, []);

  const role = user?.role ?? null;
  const setRole = useCallback((r: Role) => setUser(USERS[r]), [setUser]);
  const value = useMemo(() => ({ user, role, setRole, setUser }), [user, role, setRole, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
