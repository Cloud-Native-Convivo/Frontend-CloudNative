import { useRouteError, isRouteErrorResponse } from "react-router";

export default function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Ocurrió un error inesperado.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-surface">
      <h1 className="font-display text-2xl text-text">Algo salió mal</h1>
      <p className="text-muted max-w-narrow">{message}</p>
      <a href="/" className="text-primary font-semibold hover:underline">
        Volver al inicio
      </a>
    </div>
  );
}
