import type { NavigateFunction } from "react-router";
import type { User } from "../types";
import type { CognitoTokens } from "./cognitoAuth";
import { notify } from "../utils/notify";
import { setStoredUser } from "../utils/authStorage";
import { guardarTokens } from "./tokenManager";

/** Guarda la sesión ya autorizada (ID, access y refresh token) y entra al dashboard del residente. */
export function completarSesion(
  tokens: CognitoTokens,
  usuario: User,
  setUser: (u: User) => void,
  navigate: NavigateFunction,
): void {
  setStoredUser(usuario);
  guardarTokens(tokens);
  setUser(usuario);
  notify.success({ title: "Sesión iniciada correctamente" });
  navigate("/mi-dashboard", { replace: true });
}
