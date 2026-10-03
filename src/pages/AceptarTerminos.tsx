import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { registrarAceptacionTerminos, type CognitoTokens } from "../auth/cognitoAuth";
import { completarSesion } from "../auth/sesion";
import { notify } from "../utils/notify";
import type { User } from "../types";

interface PendingAuth {
  tokens: CognitoTokens;
  usuario: User;
}

function Casilla({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-text"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
      />
      <span>{children}</span>
    </label>
  );
}

export default function AceptarTerminos() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [terminos, setTerminos] = useState(false);
  const [privacidad, setPrivacidad] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Tokens viven solo en el state de navegación: recargar aquí obliga a iniciar sesión de nuevo.
  const pending = location.state as PendingAuth | null;
  if (!pending?.tokens?.access_token) return <Navigate to="/login" replace />;
  const { tokens, usuario } = pending;

  async function aceptar() {
    setEnviando(true);
    setError("");
    try {
      await registrarAceptacionTerminos(tokens.access_token);
      completarSesion(tokens, usuario, setUser, navigate);
    } catch {
      setError("No pudimos registrar tu aceptación. Revisa tu conexión e inténtalo de nuevo.");
      setEnviando(false);
    }
  }

  function rechazar() {
    notify.info({
      title: "No se inició sesión",
      description:
        "Para usar Convivo necesitas aceptar los Términos de uso y la Política de privacidad.",
    });
    navigate("/", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md">
        <span className="font-display text-2xl text-primary">Convivo</span>
        <h1 className="mt-8 mb-3 font-display text-3xl font-normal text-text">
          Antes de continuar
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted">
          Hola, {usuario.nombre}. Para crear tu sesión necesitamos que aceptes estos dos documentos.
          Se abren en otra pestaña para que puedas leerlos sin perder este paso.
        </p>

        <div className="space-y-4 rounded-lg border border-border p-5">
          <Casilla id="acepta-terminos" checked={terminos} onChange={setTerminos}>
            Leí y acepto los{" "}
            <Link to="/terminos" target="_blank" rel="noopener" className="text-primary underline">
              Términos de uso
            </Link>
            .
          </Casilla>
          <Casilla id="acepta-privacidad" checked={privacidad} onChange={setPrivacidad}>
            Leí la{" "}
            <Link
              to="/privacidad"
              target="_blank"
              rel="noopener"
              className="text-primary underline"
            >
              Política de privacidad
            </Link>{" "}
            y consiento el tratamiento de mis datos descrito en ella.
          </Casilla>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-alert-red">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={aceptar}
            disabled={!terminos || !privacidad || enviando}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Registrando…" : "Aceptar y continuar"}
          </button>
          <button
            type="button"
            onClick={rechazar}
            disabled={enviando}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition-colors hover:bg-slate-50"
          >
            No acepto
          </button>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Guardamos en tu cuenta la versión de los documentos que aceptaste y la fecha. Puedes
          retirar tu consentimiento cuando quieras, como explica la Política de privacidad.
        </p>
      </div>
    </div>
  );
}
