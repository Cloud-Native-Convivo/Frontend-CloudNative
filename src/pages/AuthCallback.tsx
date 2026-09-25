import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { decodeIdToken, exchangeCodeForTokens, roleFromClaims } from "../lib/cognitoAuth";
import { notify } from "../utils/notify";
import type { User } from "../types";
import { setStoredUser, setStoredIdToken, setStoredAccessToken } from "../utils/authStorage";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    // Un `code` de Cognito es de un solo uso. React.StrictMode (main.tsx)
    // duplica efectos en dev — sin este guard, el segundo intercambio
    // fallaría contra Cognito real.
    if (ran.current) return;
    ran.current = true;

    // setState va todo dentro de esta función async, nunca directo en el
    // cuerpo del efecto (react-hooks/set-state-in-effect).
    async function procesarCallback() {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get("error");
      const code = params.get("code");

      if (errorParam) {
        navigate("/auth/error?reason=oauth_error", { replace: true });
        return;
      }
      if (!code) {
        navigate("/auth/error?reason=exchange_failed", { replace: true });
        return;
      }

      try {
        const tokens = await exchangeCodeForTokens(code);
        const claims = decodeIdToken(tokens.id_token);
        const usuario: User = {
          nombre: claims.name ?? claims.given_name ?? claims.email?.split("@")[0] ?? "Residente",
          unidad: claims["custom:unidad"] ?? "Sin unidad asignada",
          role: roleFromClaims(claims),
          avatar: claims.picture,
        };
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
      } catch {
        navigate("/auth/error?reason=exchange_failed", { replace: true });
      }
    }

    void procesarCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- guard `ran` evita doble-ejecución, deps intencionalmente vacías
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <p className="text-muted text-sm">Iniciando sesión con Google…</p>
    </div>
  );
}
