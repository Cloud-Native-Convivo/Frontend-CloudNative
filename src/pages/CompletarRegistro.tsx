import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { obtenerCondominios, solicitarAsignacion } from "../services/condominiosApi";
import { completarSesion } from "../auth/sesion";
import type { CognitoTokens } from "../auth/cognitoAuth";
import type { CondominioItem, User } from "../types";
import {
  componerUnidad,
  inputClass,
  validateUnit,
  type StepUnitForm,
} from "../components/registro/types";
import { CamposUnidad } from "../components/registro/StepComponents";

interface PendingAuth {
  tokens: CognitoTokens;
  usuario: User;
}

interface FormularioUnidadProps {
  condominios: CondominioItem[];
  onSubmit: (unidad: string, condominioId: string, condominioNombre?: string) => void;
}

function FormularioUnidad({ condominios, onSubmit }: FormularioUnidadProps) {
  const [form, setForm] = useState<StepUnitForm>({
    condominioId: "",
    torre: "",
    piso: "",
    numero: "",
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  function handleCampo(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCondominio(e: React.ChangeEvent<HTMLSelectElement>) {
    const tipo = condominios.find((c) => String(c.id) === e.target.value)?.tipo;
    // Al cambiar de condominio, torre y piso del anterior ya no aplican.
    setForm((f) => ({
      ...f,
      condominioId: e.target.value,
      condominioTipo: tipo,
      torre: "",
      piso: "",
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nuevosErrores = validateUnit(form);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const condoSeleccionado = condominios.find((c) => String(c.id) === form.condominioId);
    onSubmit(componerUnidad(form), form.condominioId, condoSeleccionado?.nombre);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="condominioId" className="block text-xs font-semibold text-text mb-1">
          Condominio
        </label>
        <select
          id="condominioId"
          name="condominioId"
          value={form.condominioId}
          onChange={handleCondominio}
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

      {form.condominioId && <CamposUnidad form={form} errors={errores} onChange={handleCampo} />}

      <button type="submit" className="btn btn-primary w-full mt-2">
        Guardar y continuar
      </button>
    </form>
  );
}

export default function CompletarRegistro() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, user: activeUser } = useAuth();

  const [condominios, setCondominios] = useState<CondominioItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [recargarTrigger, setRecargarTrigger] = useState(0);
  const [estadoSolicitud, setEstadoSolicitud] = useState<string | null>(null);

  const pending = location.state as PendingAuth | null;
  const tieneAcceso = Boolean(pending?.tokens?.access_token || activeUser);

  useEffect(() => {
    if (!tieneAcceso) return;
    let activo = true;
    obtenerCondominios()
      .then((items) => {
        if (!activo) return;
        setCondominios(items);
        setCargando(false);
      })
      .catch(() => {
        if (!activo) return;
        setErrorCarga(
          "No pudimos cargar los condominios disponibles. Verifica tu conexión o intenta nuevamente.",
        );
        setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [recargarTrigger, tieneAcceso]);

  const reintentar = () => {
    setErrorCarga(null);
    setCargando(true);
    setRecargarTrigger((prev) => prev + 1);
  };

  // Si no hay tokens pendientes ni usuario activo, redirigir al login
  if (!tieneAcceso) {
    return <Navigate to="/login" replace />;
  }

  const tokens = pending?.tokens ?? {
    access_token: "",
    id_token: "",
    token_type: "Bearer",
    expires_in: 3600,
  };
  const usuarioBase = pending?.usuario ?? activeUser!;

  const handleCompletar = async (
    unidad: string,
    condominioId: string,
    condominioNombre?: string,
  ) => {
    try {
      const respuesta = await solicitarAsignacion({ unidad, condominio_id: Number(condominioId) });
      if (respuesta.estado === "aprobada") {
        // Ya aprobada (409 o respuesta directa): completar sesión y navegar.
        const usuario = { ...usuarioBase, unidad, condominioId: condominioId, condominioNombre };
        completarSesion(tokens, usuario, setUser, navigate);
        return;
      }
      setEstadoSolicitud(respuesta.estado);
    } catch {
      setEstadoSolicitud("error");
    }
  };

  const continuarSinAsignacion = () => {
    completarSesion(tokens, usuarioBase, setUser, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-narrow bg-white rounded-lg shadow-sm border border-border p-8">
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
            className="p-4 bg-red-50 border border-alert-red rounded-md text-center space-y-3"
          >
            <p className="text-xs text-alert-red font-medium">
              <span aria-hidden="true">⚠ </span>
              {errorCarga}
            </p>
            <button type="button" onClick={reintentar} className="btn btn-primary btn-sm">
              Reintentar
            </button>
          </div>
        ) : (
          <FormularioUnidad condominios={condominios} onSubmit={handleCompletar} />
        )}
        {estadoSolicitud && (
          <p role="status" className="mt-4 text-sm text-muted">
            {estadoSolicitud === "error"
              ? "No pudimos enviar la solicitud. Intenta nuevamente."
              : "Solicitud pendiente de aprobación por administración."}
          </p>
        )}
        {!cargando && (
          <button
            type="button"
            onClick={continuarSinAsignacion}
            className="btn btn-tertiary mt-4 w-full underline"
          >
            {estadoSolicitud === "pendiente"
              ? "Continuar al panel de residente"
              : "Continuar sin asignación"}
          </button>
        )}
      </div>
    </div>
  );
}
