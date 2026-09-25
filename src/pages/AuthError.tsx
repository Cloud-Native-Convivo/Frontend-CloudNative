import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { IconGoogle } from "../components/icons/Icons";
import {
  buildGoogleAuthorizeUrl,
  checkCognitoReachability,
  isCognitoConfigured,
} from "../lib/cognitoAuth";

interface ErrorInfo {
  title: string;
  description: string;
}

function resolveErrorInfo(reason: string | null): ErrorInfo {
  switch (reason) {
    case "oauth_error":
      return {
        title: "No se pudo completar el inicio de sesión",
        description:
          "La solicitud de autorización fue cancelada o no pudo validarse con el proveedor de acceso. Por favor, intenta nuevamente.",
      };
    case "connection_failed":
    case "config_missing":
    case "exchange_failed":
    default:
      return {
        title: "Servicio no disponible temporalmente",
        description:
          "No fue posible establecer conexión con el servicio de autenticación. Por favor, verifica tu conexión a internet o intenta nuevamente en unos minutos. Si el problema persiste, contacta a la administración.",
      };
  }
}

export default function AuthError() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  const errorInfo = resolveErrorInfo(reason);

  function handleRetry() {
    setIsRetrying(true);
    setRetryError(null);

    const genericError =
      "El servicio no se encuentra disponible momentáneamente. Por favor, intenta más tarde.";

    if (!isCognitoConfigured()) {
      setIsRetrying(false);
      setRetryError(genericError);
      return;
    }

    checkCognitoReachability(2500)
      .then((isReachable) => {
        if (!isReachable) {
          setIsRetrying(false);
          setRetryError(genericError);
          return;
        }
        return buildGoogleAuthorizeUrl().then((authUrl) => {
          window.location.assign(authUrl);
        });
      })
      .catch(() => {
        setIsRetrying(false);
        setRetryError(genericError);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-sm p-8 text-center">
        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-alert-red/10 flex items-center justify-center text-alert-red">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="font-display text-2xl text-text mb-2">{errorInfo.title}</h1>
        <p className="text-muted text-sm leading-relaxed mb-6">{errorInfo.description}</p>

        {retryError && (
          <div
            role="alert"
            className="mb-5 p-3 bg-red-50 border border-alert-red/30 rounded-lg text-xs text-alert-red"
          >
            {retryError}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            aria-busy={isRetrying}
            className="w-full flex items-center justify-center gap-2 bg-white border border-border text-text font-semibold text-sm py-3 rounded-lg transition-colors hover:bg-primary/5 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconGoogle className="w-4 h-4" />
            {isRetrying ? "Reintentando…" : "Reintentar con Google"}
          </button>

          <Link
            to="/login"
            className="block w-full bg-primary hover:bg-accent text-white font-bold text-sm py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-center"
          >
            Volver a iniciar sesión
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Link
            to="/"
            className="text-xs text-muted hover:text-text transition-colors inline-flex items-center gap-1"
          >
            <span aria-hidden="true">←</span> Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
}
