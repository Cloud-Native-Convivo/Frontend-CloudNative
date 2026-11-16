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

const CATEGORIAS = ["Quincho", "Piscina", "Gimnasio", "Sala", "Cancha"];

/** Placa oscura: un espacio no disponible baja a gris pizarra, pero sigue siendo legible con texto blanco. */
function colorPlaca(disponible: boolean): string {
  return disponible ? "bg-text" : "bg-slate-600";
}

/** El estado va siempre como texto además del punto: el color solo no alcanza. */
function Disponibilidad({ disponible }: { disponible: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${disponible ? "bg-primary-on-dark" : "bg-slate-300"}`}
      />
      {disponible ? "Disponible hoy" : "No disponible"}
    </span>
  );
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
        <div
          className={`flex items-center justify-between gap-3 rounded-t-lg py-4 pl-6 pr-4 ${colorPlaca(espacio.disponibleHoy)}`}
        >
          <Disponibilidad disponible={espacio.disponibleHoy} />
          <button
            ref={closeRef}
            onClick={handleClose}
            tabIndex={0}
            aria-label="Cerrar detalle"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-text transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-on-dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
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

/** Tarifa partida en cifra y unidad para poder componerla a escala de portada. */
function partesTarifa(tarifa: number): { cifra: string; unidad: string } {
  if (tarifa === 0) return { cifra: "Gratis", unidad: "para residentes" };
  return { cifra: `$${tarifa.toLocaleString("es-CL")}`, unidad: "por hora" };
}

function EspacioCard({ espacio, onVerDetalle, isAdmin }: EspacioCardProps) {
  const { cifra, unidad } = partesTarifa(espacio.tarifa);
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border bg-white transition-[transform,box-shadow] duration-200 hover:shadow-lg motion-safe:hover:-translate-y-1">
      {/* Placa del espacio: el backend no guarda fotos, así que el nombre es la imagen */}
      <div
        className={`flex flex-1 flex-col justify-between gap-12 p-6 ${colorPlaca(espacio.disponibleHoy)}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-primary-on-dark">{espacio.categoria}</span>
          <Disponibilidad disponible={espacio.disponibleHoy} />
        </div>
        <div>
          <h3 className="m-0 font-display text-3xl font-normal leading-tight text-white">
            {espacio.nombre}
          </h3>
          {espacio.ubicacion && (
            <p className="m-0 mt-2 text-sm text-white/70">{espacio.ubicacion}</p>
          )}
        </div>
      </div>

      <dl className="m-0 grid grid-cols-2 gap-6 p-6">
        <div>
          <dt className="text-sm text-muted">Capacidad</dt>
          <dd className="m-0 mt-1 font-display text-4xl leading-none text-text">
            {espacio.capacidad}
            <span className="mt-2 block font-body text-base text-muted">personas</span>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Tarifa</dt>
          <dd className="m-0 mt-1 font-display text-4xl leading-none text-text">
            {cifra}
            <span className="mt-2 block font-body text-base text-muted">{unidad}</span>
          </dd>
        </div>
      </dl>

      <div className="flex gap-3 px-6 pb-6">
        <button onClick={() => onVerDetalle(espacio)} className="btn btn-secondary flex-1">
          Ver detalle
        </button>
        {isAdmin ? (
          <button onClick={() => onVerDetalle(espacio)} className="btn btn-primary flex-1">
            Administrar
          </button>
        ) : espacio.disponibleHoy ? (
          <Link to="/reservas" className="btn btn-primary flex-1">
            Reservar
          </Link>
        ) : (
          <button disabled aria-disabled="true" className="btn btn-primary flex-1">
            Reservar
          </button>
        )}
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

  const conteoCategoria = (c: string) => espacios.filter((e) => e.categoria === c).length;
  const directorio = [
    { clave: "Todos", n: espacios.length },
    ...CATEGORIAS.map((c) => ({ clave: c, n: conteoCategoria(c) })).filter((c) => c.n > 0),
  ];

  return (
    <>
      <header className="bg-text pt-14 pb-16">
        <div className="mx-auto grid max-w-page items-end gap-12 px-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] font-normal leading-none text-white">
              Espacios comunes
            </h1>
            <p className="m-0 mt-4 text-lg text-white/70">
              {user?.condominioNombre ||
                (isAdmin
                  ? "Gestión de los espacios del condominio"
                  : "Elige un espacio y reserva por horas")}
            </p>
          </div>
          {!loading && !errorCarga && espacios.length > 0 && (
            <nav
              aria-label="Categorías de espacios"
              className="border-t-2 border-dashed border-white/30 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <p className="m-0 text-sm text-white/70">Directorio</p>
              <ul className="m-0 mt-3 list-none p-0">
                {directorio.map(({ clave, n }) => {
                  const activa = filtros.categoria === clave;
                  return (
                    <li key={clave}>
                      <button
                        type="button"
                        aria-pressed={activa}
                        onClick={() => setFiltros((f) => ({ ...f, categoria: clave }))}
                        className={`flex min-h-11 w-full cursor-pointer items-baseline gap-3 rounded-sm py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-on-dark ${
                          activa ? "text-primary-on-dark" : "text-white hover:text-primary-on-dark"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 shrink-0 self-center rounded-full ${
                            activa ? "bg-primary-on-dark" : "bg-transparent"
                          }`}
                        />
                        <span className="font-display text-3xl leading-none">{clave}</span>
                        <span
                          aria-hidden="true"
                          className="flex-1 border-b border-dotted border-white/30"
                        />
                        <span className="text-lg tabular-nums">{n}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Filter bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-white py-4">
        <div className="mx-auto flex max-w-page flex-wrap items-center gap-3 px-6">
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
      <main className="mx-auto max-w-page px-6 pt-10 pb-20">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
