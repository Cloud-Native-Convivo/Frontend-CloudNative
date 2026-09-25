import { useContext } from "react";
import { AuthContext, USERS, type AuthContextValue } from "../context/authContext";

export { USERS, AuthContext, type AuthContextValue };

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
