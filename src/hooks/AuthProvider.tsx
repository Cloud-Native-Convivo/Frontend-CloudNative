import { useState, useMemo, type ReactNode } from "react";
import { AuthContext, USERS } from "./useAuth";
import type { Role, User } from "../types";

const STORAGE_KEY = "convivo_user";

function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as User;
      if (parsed && typeof parsed.nombre === "string" && typeof parsed.role === "string") {
        return parsed;
      }
    }
  } catch {
    // fallback al mock si localStorage falla
  }
  return USERS.residente;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(getStoredUser);

  const setUser = (u: User) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
    setUserState(u);
  };

  const role = user.role;
  const setRole = (r: Role) => setUser(USERS[r]);
  const value = useMemo(() => ({ user, role, setRole, setUser }), [user, role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
