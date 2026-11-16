import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { categoriaDeEspacio } from "../utils/categoriaEspacio";
import { listarEspacios, type BackendEspacio } from "../services/espaciosApi";

interface Espacio {
  id: number;
  nombre: string;
  categoria: string;
  capacidad: number;
  tarifa: number;
  disponibleHoy: boolean;
  descripcion: string | null;
  ubicacion: string | null;
}

interface Filtros {
  busqueda: string;
  categoria: string;
  capacidad: string;
  soloDisponibles: boolean;
}

interface EspacioCardProps {
  espacio: Espacio;
  onVerDetalle: (espacio: Espacio) => void;
  isAdmin?: boolean;
}

interface DetalleModalProps {
  espacio: Espacio;
  onClose: () => void;
}

function formatTarifa(tarifa: number): string {
  if (tarifa === 0) return "Gratis para residentes";
  return `$${tarifa.toLocaleString("es-CL")} / hora`;
}

function DetalleModal({ espacio, onClose }: DetalleModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    closeRef.current?.focus();
  }, []);

  const handleClose = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="m-auto p-0 rounded-lg bg-transparent backdrop:bg-black/60 w-full max-w-content max-h-[90vh]"
    >
      {/* Panel */}
      <div className="relative z-10 bg-white rounded-lg shadow-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Cabecera sin imagen: el backend no guarda fotos de los espacios */}
        <div className="relative h-16 rounded-t-lg bg-slate-50 border-b border-border">
          <button
            ref={closeRef}
            onClick={handleClose}
            tabIndex={0}
            aria-label="Cerrar detalle"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-text rounded-full w-9 h-9 flex items-center justify-center shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>

          {/* Availability badge */}
          <span
            className={`absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              espacio.disponibleHoy
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                espacio.disponibleHoy ? "bg-emerald-500" : "bg-slate-400"
              }`}
              aria-hidden="true"
            />
            {espacio.disponibleHoy ? "Disponible hoy" : "No disponible"}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {espacio.categoria}
            </span>
            <h2 id="modal-title" className="font-display text-2xl text-text leading-tight">
              {espacio.nombre}
            </h2>
            {espacio.descripcion && (
              <p className="text-muted text-sm mt-1">{espacio.descripcion}</p>
            )}
          </div>

          {espacio.ubicacion && (
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Ubicación</p>
              <p className="text-sm text-text">{espacio.ubicacion}</p>
            </div>
          )}

          {/* Tarifa + Capacidad */}
          <div className="bg-slate-50 rounded-md p-4 flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Tarifa</p>
              <p className="text-lg font-semibold text-text">{formatTarifa(espacio.tarifa)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Capacidad</p>
              <p className="text-lg font-semibold text-text">{espacio.capacidad} personas</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {espacio.disponibleHoy ? (
              <Link to="/reservas" className="btn btn-primary flex-1">
                Reservar ahora
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 bg-slate-200 text-slate-400 text-sm font-semibold py-3 px-4 rounded-md cursor-not-allowed"
                aria-disabled="true"
              >
                No disponible hoy
              </button>
            )}
            <button onClick={handleClose} className="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function EspacioCard({ espacio, onVerDetalle, isAdmin }: EspacioCardProps) {
  return (
    <article className="bg-white rounded-md border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Cabecera sin imagen: el backend no guarda fotos de los espacios */}
      <div className="relative h-12 bg-slate-50 border-b border-border">
        {/* Availability badge */}
        <span
          className={`absolute top-2.5 right-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            espacio.disponibleHoy
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              espacio.disponibleHoy ? "bg-emerald-500" : "bg-slate-400"
            }`}
            aria-hidden="true"
          />
          {espacio.disponibleHoy ? "Disponible hoy" : "No disponible"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category chip */}
        <span className="inline-block self-start bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
          {espacio.categoria}
        </span>

        {/* Name */}
        <h3 className="font-display text-lg text-text leading-snug">{espacio.nombre}</h3>

        {/* Capacity + Tarifa */}
        <div className="flex items-center justify-between text-sm text-muted">
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
            </svg>
            {espacio.capacidad} personas
          </span>
          <span className="font-medium text-text">{formatTarifa(espacio.tarifa)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button onClick={() => onVerDetalle(espacio)} className="btn btn-secondary btn-sm flex-1">
            Ver detalle
          </button>
          {isAdmin ? (
            <button onClick={() => onVerDetalle(espacio)} className="btn btn-primary btn-sm flex-1">
              Administrar
            </button>
          ) : espacio.disponibleHoy ? (
            <Link to="/reservas" className="btn btn-primary btn-sm flex-1">
              Reservar
            </Link>
          ) : (
            <button
              disabled
              aria-disabled="true"
              className="flex-1 bg-slate-200 text-slate-400 text-sm font-semibold py-2 px-3 rounded-md cursor-not-allowed"
            >
              Reservar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function mapearBackendEspacio(b: BackendEspacio): Espacio {
  const categoria = categoriaDeEspacio(b.nombre, b.ubicacion);
  return {
    id: b.id,
    nombre: b.nombre,
    categoria,
    capacidad: b.capacidad,
    tarifa: b.tarifa_hora,
    disponibleHoy: b.estado === "activo",
    // Solo datos del backend: sin horario, reglas ni depósito inventados.
    descripcion: b.descripcion || null,
    ubicacion: b.ubicacion || null,
  };
}

export default function EspaciosComunes() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(true);
  // Un fallo de red no es "no hay espacios": se muestra aparte, con reintento.
  const [errorCarga, setErrorCarga] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let active = true;
    listarEspacios()
      .then((data) => {
        if (active) {
          setEspacios(Array.isArray(data) ? data.map(mapearBackendEspacio) : []);
          setErrorCarga(false);
        }
      })
      .catch(() => {
        if (active) {
          setEspacios([]);
          setErrorCarga(true);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [intento]);

  const [filtros, setFiltros] = useState<Filtros>({
    busqueda: "",
    categoria: "Todos",
    capacidad: "Todos",
    soloDisponibles: false,
  });
  const [espacioDetalle, setEspacioDetalle] = useState<Espacio | null>(null);

  const espaciosFiltrados = espacios.filter((e) => {
    if (filtros.busqueda && !e.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()))
      return false;
    if (filtros.categoria !== "Todos" && e.categoria !== filtros.categoria) return false;
    if (filtros.capacidad !== "Todos") {
      if (filtros.capacidad === "Hasta 10" && e.capacidad > 10) return false;
      if (filtros.capacidad === "10-30" && (e.capacidad < 10 || e.capacidad > 30)) return false;
      if (filtros.capacidad === "+30 personas" && e.capacidad <= 30) return false;
    }
    if (filtros.soloDisponibles && !e.disponibleHoy) return false;
    return true;
  });

  return (
    <>
      {/* Page header */}
      <header className="bg-text px-6 py-8">
        <h1 className="font-display text-3xl text-white">Espacios Comunes</h1>
        <p className="text-slate-300 text-sm mt-1">
          {espacios.length} espacios disponibles
          {user?.condominioNombre ? ` en ${user.condominioNombre}` : ""}{" "}
          {loading ? "(cargando...)" : ""}
        </p>
      </header>

      {/* Filter bar */}
      <div className="bg-white border-b border-border px-6 py-4 sticky top-0 z-20">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="search"
              aria-label="Buscar espacio"
              placeholder="Buscar espacio..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros((f) => ({ ...f, busqueda: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Categoria */}
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros((f) => ({ ...f, categoria: e.target.value }))}
            className="border border-border rounded-md text-sm text-text py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            aria-label="Filtrar por categoría"
          >
            {["Todos", "Quincho", "Piscina", "Gimnasio", "Sala", "Cancha"].map((c) => (
              <option key={c} value={c}>
                {c === "Todos" ? "Categoría: Todos" : c}
              </option>
            ))}
          </select>

          {/* Capacidad */}
          <select
            value={filtros.capacidad}
            onChange={(e) => setFiltros((f) => ({ ...f, capacidad: e.target.value }))}
            className="border border-border rounded-md text-sm text-text py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            aria-label="Filtrar por capacidad"
          >
            {["Todos", "Hasta 10", "10-30", "+30 personas"].map((c) => (
              <option key={c} value={c}>
                {c === "Todos" ? "Capacidad: Todos" : c}
              </option>
            ))}
          </select>

          {/* Solo disponibles toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={filtros.soloDisponibles}
                onChange={(e) =>
                  setFiltros((f) => ({
                    ...f,
                    soloDisponibles: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-checked:bg-primary rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-1" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm text-text whitespace-nowrap">Solo disponibles hoy</span>
          </label>
        </div>
      </div>

      {/* Cards grid */}
      <main className="px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div
              role="status"
              aria-label="Cargando espacios"
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
            />
            <p className="font-display text-lg text-text">
              Cargando espacios comunes desde el servidor...
            </p>
          </div>
        ) : errorCarga ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center py-24 text-center gap-2"
          >
            <p className="font-display text-xl text-text">No pudimos cargar los espacios comunes</p>
            <p className="text-muted text-sm">Revisa tu conexión e intenta de nuevo.</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setIntento((n) => n + 1);
              }}
              className="btn btn-primary mt-3"
            >
              Reintentar
            </button>
          </div>
        ) : espaciosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="none"
              className="w-16 h-16 text-slate-300"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
              <path
                d="M16 24h16M24 16v16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="font-display text-xl text-text">
                {espacios.length === 0
                  ? "No hay espacios comunes disponibles actualmente"
                  : "No hay espacios que coincidan con tus filtros"}
              </p>
              <p className="text-muted text-sm mt-1">
                {espacios.length === 0
                  ? "Vuelve a consultar más tarde o contacta a la administración."
                  : "Intenta ajustar los filtros para ver más resultados."}
              </p>
            </div>
            {espacios.length > 0 && (
              <button
                onClick={() =>
                  setFiltros({
                    busqueda: "",
                    categoria: "Todos",
                    capacidad: "Todos",
                    soloDisponibles: false,
                  })
                }
                className="btn btn-tertiary btn-sm mt-2"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {espaciosFiltrados.map((espacio) => (
              <EspacioCard
                key={espacio.id}
                espacio={espacio}
                onVerDetalle={setEspacioDetalle}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail modal */}
      {espacioDetalle && (
        <DetalleModal espacio={espacioDetalle} onClose={() => setEspacioDetalle(null)} />
      )}
    </>
  );
}
