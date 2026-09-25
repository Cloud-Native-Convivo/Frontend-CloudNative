import { useState, useMemo, useCallback, type ReactNode } from "react";
import type { Role, User } from "../types";
import { getStoredUser as loadUser, setStoredUser, clearStoredAuth } from "../utils/authStorage";
import { AuthContext, USERS } from "./authContext";

function getInitialUser(): User | null {
  return loadUser();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(getInitialUser);

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
