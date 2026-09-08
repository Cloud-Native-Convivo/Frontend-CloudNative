import { useState, useMemo, useCallback, type ReactNode } from "react";
import { AuthContext, USERS } from "./useAuth";
import type { Role, User } from "../types";

const STORAGE_KEY = "convivo_user";

function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return USERS.residente;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(getStoredUser);

  const setUser = useCallback((u: User) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
    setUserState(u);
  }, []);

  const role = user.role;
  const setRole = useCallback((r: Role) => setUser(USERS[r]), [setUser]);
  const value = useMemo(() => ({ user, role, setRole, setUser }), [user, role, setRole, setUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
