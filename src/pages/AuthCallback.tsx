import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { decodeIdToken, exchangeCodeForTokens } from "../lib/cognitoAuth";
import { sileo } from "sileo";
import type { User } from "../types";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
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
        setError(`Google/Cognito rechazó el inicio de sesión: ${errorParam}`);
        return;
      }
      if (!code) {
        setError("Falta el parámetro 'code' en la respuesta de Cognito.");
        return;
      }

      try {
        const tokens = await exchangeCodeForTokens(code);
        const claims = decodeIdToken(tokens.id_token);
        const usuario: User = {
          nombre: claims.name ?? claims.given_name ?? claims.email?.split("@")[0] ?? "Residente",
          unidad: claims["custom:unidad"] ?? "Sin unidad asignada",
          role: "residente",
          avatar: claims.picture,
        };
        localStorage.setItem("convivo_user", JSON.stringify(usuario));
        if (tokens.id_token) {
          localStorage.setItem("id_token", tokens.id_token);
        }
        if (tokens.access_token) {
          localStorage.setItem("access_token", tokens.access_token);
        }
        setUser(usuario);
        sileo.success({ title: "Sesión iniciada correctamente" });
        navigate("/mi-dashboard", { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido intercambiando el code.");
      }
    }

    void procesarCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- guard `ran` evita doble-ejecución, deps intencionalmente vacías
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-surface">
        <h1 className="font-display text-2xl text-text">No se pudo iniciar sesión</h1>
        <p role="alert" className="text-alert-red max-w-md text-sm">
          {error}
        </p>
        <a href="/login" className="text-primary font-semibold hover:underline">
          Volver al login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <p className="text-muted text-sm">Iniciando sesión con Google…</p>
    </div>
  );
}
