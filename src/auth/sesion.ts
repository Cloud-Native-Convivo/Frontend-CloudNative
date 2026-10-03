import type { NavigateFunction } from "react-router";
import type { User } from "../types";
import type { CognitoTokens } from "./cognitoAuth";
import { notify } from "../utils/notify";
import { setStoredUser, setStoredIdToken, setStoredAccessToken } from "../utils/authStorage";

/** Guarda la sesión ya autorizada y entra al dashboard del residente. */
export function completarSesion(
  tokens: CognitoTokens,
  usuario: User,
  setUser: (u: User) => void,
  navigate: NavigateFunction,
): void {
  setStoredUser(usuario);
  if (tokens.id_token) {
    setStoredIdToken(tokens.id_token);
  }
  if (tokens.access_token) {
    setStoredAccessToken(tokens.access_token);
  }
  setUser(usuario);
  notify.success({ title: "Sesión iniciada correctamente" });
  navigate("/mi-dashboard", { replace: true });
}
