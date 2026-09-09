import { useState, useMemo, useCallback, type ReactNode } from "react";
import { AuthContext, USERS } from "./useAuth";
import type { Role, User } from "../types";
import { getStoredUser as loadUser, setStoredUser } from "../lib/authStorage";

function getInitialUser(): User {
  return loadUser() ?? USERS.residente;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(getInitialUser);

  const setUser = useCallback((u: User) => {
    setStoredUser(u);
    setUserState(u);
  }, []);

  const role = user.role;
  const setRole = useCallback((r: Role) => setUser(USERS[r]), [setUser]);
  const value = useMemo(() => ({ user, role, setRole, setUser }), [user, role, setRole, setUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
