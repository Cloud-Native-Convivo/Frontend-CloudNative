import { useState, useEffect, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { obtenerCondominios } from "../services/condominiosApi";
import { completarSesion } from "../auth/sesion";
import type { CognitoTokens } from "../auth/cognitoAuth";
import type { CondominioItem, User } from "../types";
import { inputClass } from "../components/registro/types";

interface PendingAuth {
  tokens: CognitoTokens;
  usuario: User;
}

export default function CompletarRegistro() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, user: activeUser } = useAuth();

  const [condominios, setCondominios] = useState<CondominioItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [condominioId, setCondominioId] = useState("");
  const [torre, setTorre] = useState("");
  const [piso, setPiso] = useState("");
  const [numero, setNumero] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  const pending = location.state as PendingAuth | null;

  const cargarCondominios = useCallback(async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const items = await obtenerCondominios();
      setCondominios(items);
    } catch {
      setErrorCarga(
        "No pudimos cargar los condominios disponibles. Verifica tu conexión o intenta nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarCondominios();
  }, [cargarCondominios]);

  // Si no hay tokens pendientes ni usuario activo, redirigir al login
  if (!pending?.tokens?.access_token && !activeUser) {
    return <Navigate to="/login" replace />;
  }

  const tokens = pending?.tokens ?? {
    access_token: "",
    id_token: "",
    token_type: "Bearer",
    expires_in: 3600,
  };
  const usuarioBase = pending?.usuario ?? activeUser!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nuevosErrores: Record<string, string> = {};

    if (!condominioId) nuevosErrores.condominioId = "Selecciona tu condominio.";
    if (!torre) nuevosErrores.torre = "Selecciona una torre.";
    if (!piso) nuevosErrores.piso = "Selecciona un piso.";
    if (!numero.trim()) {
      nuevosErrores.numero = "Ingresa el número de unidad.";
    } else if (!/^[a-zA-Z0-9\s\-°]+$/.test(numero.trim())) {
      nuevosErrores.numero = "El número contiene caracteres no permitidos.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const condoSeleccionado = condominios.find((c) => String(c.id) === String(condominioId));
    const unidadCompuesta = `${torre} · Piso ${piso} · Unidad ${numero.trim()}`;

    const usuarioCompleto: User = {
      ...usuarioBase,
      unidad: unidadCompuesta,
      condominioId,
      condominioNombre: condoSeleccionado?.nombre,
    };

    completarSesion(tokens, usuarioCompleto, setUser, navigate);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-6 text-center">
          <span className="text-primary font-display text-2xl font-bold">Convivo</span>
          <h1 className="font-display text-text text-xl font-bold mt-2">Completa tu registro</h1>
          <p className="text-muted text-xs mt-1">
            Indica tu condominio y unidad para habilitar el acceso a tu comunidad.
          </p>
        </div>

        {cargando ? (
          <div role="status" aria-live="polite" className="py-12 text-center text-sm text-muted">
            Cargando condominios disponibles…
          </div>
        ) : errorCarga ? (
          <div
            role="alert"
            className="p-4 bg-red-50 border border-alert-red rounded-xl text-center space-y-3"
          >
            <p className="text-xs text-alert-red font-medium">
              <span aria-hidden="true">⚠ </span>
              {errorCarga}
            </p>
            <button
              type="button"
              onClick={cargarCondominios}
              className="inline-flex items-center justify-center min-h-[36px] px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="condominioId" className="block text-xs font-semibold text-text mb-1">
                Condominio
              </label>
              <select
                id="condominioId"
                value={condominioId}
                onChange={(e) => setCondominioId(e.target.value)}
                aria-label="Condominio"
                aria-invalid={!!errores.condominioId}
                aria-describedby={errores.condominioId ? "condominioId-error" : undefined}
                className={inputClass(errores.condominioId)}
              >
                <option value="">Selecciona tu condominio</option>
                {condominios.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errores.condominioId && (
                <p
                  id="condominioId-error"
                  role="alert"
                  className="text-xs text-alert-red mt-1 flex items-center gap-1"
                >
                  <span aria-hidden="true">⚠</span> {errores.condominioId}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="torre" className="block text-xs font-semibold text-text mb-1">
                Torre
              </label>
              <select
                id="torre"
                value={torre}
                onChange={(e) => setTorre(e.target.value)}
                aria-label="Torre"
                aria-invalid={!!errores.torre}
                aria-describedby={errores.torre ? "torre-error" : undefined}
                className={inputClass(errores.torre)}
              >
                <option value="">Selecciona torre</option>
                <option value="Torre A">Torre A</option>
                <option value="Torre B">Torre B</option>
                <option value="Torre C">Torre C</option>
              </select>
              {errores.torre && (
                <p
                  id="torre-error"
                  role="alert"
                  className="text-xs text-alert-red mt-1 flex items-center gap-1"
                >
                  <span aria-hidden="true">⚠</span> {errores.torre}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="piso" className="block text-xs font-semibold text-text mb-1">
                Piso
              </label>
              <select
                id="piso"
                value={piso}
                onChange={(e) => setPiso(e.target.value)}
                aria-label="Piso"
                aria-invalid={!!errores.piso}
                aria-describedby={errores.piso ? "piso-error" : undefined}
                className={inputClass(errores.piso)}
              >
                <option value="">Selecciona piso</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={String(p)}>
                    {p}°
                  </option>
                ))}
              </select>
              {errores.piso && (
                <p
                  id="piso-error"
                  role="alert"
                  className="text-xs text-alert-red mt-1 flex items-center gap-1"
                >
                  <span aria-hidden="true">⚠</span> {errores.piso}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="numero" className="block text-xs font-semibold text-text mb-1">
                Número de unidad
              </label>
              <input
                id="numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej: 1204"
                aria-label="Número de unidad"
                aria-invalid={!!errores.numero}
                aria-describedby={errores.numero ? "numero-error" : undefined}
                className={inputClass(errores.numero)}
              />
              {errores.numero && (
                <p
                  id="numero-error"
                  role="alert"
                  className="text-xs text-alert-red mt-1 flex items-center gap-1"
                >
                  <span aria-hidden="true">⚠</span> {errores.numero}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 min-h-[44px] py-3 bg-primary hover:bg-accent text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Guardar y continuar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
