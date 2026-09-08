import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { listarEspacios, type BackendEspacio } from "../services/espaciosApi";

interface Espacio {
  id: number;
  nombre: string;
  categoria: string;
  capacidad: number;
  tarifa: number;
  disponibleHoy: boolean;
  imagen: string;
  descripcion: string;
  horario: string;
  reglas: string[];
  deposito: number;
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

const ESPACIOS: Espacio[] = [
  {
    id: 1,
    nombre: "Quincho Los Aromos",
    categoria: "Quincho",
    capacidad: 30,
    tarifa: 25000,
    disponibleHoy: true,
    imagen: "https://images.unsplash.com/photo-1622714384717-3f60c04d7c73?w=600&h=400&fit=crop",
    descripcion:
      "Amplio quincho techado con parrilla de última generación y cocina equipada. Ideal para reuniones familiares y celebraciones. Cuenta con mesas, sillas y servicio de agua caliente.",
    horario: "Lunes a domingo, 10:00 – 22:00 hrs",
    reglas: [
      "Máximo 30 personas incluyendo menores de edad.",
      "Dejar el espacio limpio al finalizar la reserva.",
      "Prohibido el uso de parlantes después de las 22:00 hrs.",
    ],
    deposito: 50000,
  },
  {
    id: 2,
    nombre: "Quincho Bajo",
    categoria: "Quincho",
    capacidad: 20,
    tarifa: 18000,
    disponibleHoy: true,
    imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    descripcion:
      "Quincho más íntimo ubicado en el nivel inferior del conjunto, con vista al jardín. Perfecto para reuniones pequeñas. Dispone de parrilla a carbón y zona de lavado.",
    horario: "Lunes a domingo, 10:00 – 22:00 hrs",
    reglas: [
      "Máximo 20 personas.",
      "No se permite el ingreso de mascotas al espacio cerrado.",
      "El arrendatario es responsable de cualquier daño al mobiliario.",
    ],
    deposito: 36000,
  },
  {
    id: 3,
    nombre: "Piscina",
    categoria: "Piscina",
    capacidad: 50,
    tarifa: 0,
    disponibleHoy: true,
    imagen: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&h=400&fit=crop",
    descripcion:
      "Piscina semiolímpica disponible exclusivamente para residentes del condominio y sus invitados. Cuenta con zona de piscina temperada para niños y solarium con reposeras.",
    horario: "Lunes a domingo, 09:00 – 20:00 hrs (temporada)",
    reglas: [
      "Uso exclusivo para residentes y máximo 2 invitados por unidad.",
      "Obligatorio ducha previa al ingreso a la piscina.",
      "Menores de 12 años deben ir acompañados de un adulto.",
    ],
    deposito: 0,
  },
  {
    id: 4,
    nombre: "Sala Multiuso / Cowork",
    categoria: "Sala",
    capacidad: 15,
    tarifa: 8000,
    disponibleHoy: true,
    imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    descripcion:
      "Sala equipada con proyector, pizarrón, wifi de alta velocidad y estaciones de trabajo individuales. Habilitada para reuniones de trabajo, talleres o clases particulares.",
    horario: "Lunes a viernes, 08:00 – 21:00 hrs. Sábado, 09:00 – 18:00 hrs.",
    reglas: [
      "Reserva mínima de 2 horas.",
      "Dejar el proyector y equipos apagados al salir.",
      "Mantener un ambiente de trabajo tranquilo.",
    ],
    deposito: 16000,
  },
  {
    id: 5,
    nombre: "Sala de Juegos",
    categoria: "Sala",
    capacidad: 10,
    tarifa: 5000,
    disponibleHoy: false,
    imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    descripcion:
      "Sala recreativa con mesa de ping pong, futbolín, consolas de videojuegos y juegos de mesa. Pensada para el entretenimiento de residentes de todas las edades.",
    horario: "Lunes a domingo, 10:00 – 23:00 hrs",
    reglas: [
      "Máximo 10 personas simultáneamente.",
      "Cuidar el equipamiento y reportar cualquier daño.",
      "Menores de 14 años deben estar acompañados por un adulto después de las 21:00 hrs.",
    ],
    deposito: 10000,
  },
  {
    id: 6,
    nombre: "Gimnasio",
    categoria: "Gimnasio",
    capacidad: 12,
    tarifa: 0,
    disponibleHoy: true,
    imagen: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    descripcion:
      "Gimnasio completamente equipado con máquinas cardiovasculares, zona de pesas libres y área de estiramiento. Acceso gratuito para todos los residentes del condominio.",
    horario: "Todos los días, 06:00 – 23:00 hrs",
    reglas: [
      "Uso de toalla obligatorio en las máquinas.",
      "Devolver las pesas y equipos a su lugar tras su uso.",
      "No se permite el ingreso con alimentos ni bebidas distintas al agua.",
    ],
    deposito: 0,
  },
  {
    id: 7,
    nombre: "Cancha Multicancha",
    categoria: "Cancha",
    capacidad: 22,
    tarifa: 12000,
    disponibleHoy: true,
    imagen: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
    descripcion:
      "Cancha techada habilitada para fútbol sala, básquetbol y volleyball. Superficie de piso flotante de alto rendimiento con iluminación LED para uso nocturno.",
    horario: "Lunes a domingo, 08:00 – 22:00 hrs",
    reglas: [
      "Reserva por bloques de 1 hora.",
      "Uso de calzado deportivo adecuado obligatorio.",
      "No se permite ingresar con bebidas alcohólicas.",
    ],
    deposito: 24000,
  },
];

function formatTarifa(tarifa: number): string {
  if (tarifa === 0) return "Gratis para residentes";
  return `$${tarifa.toLocaleString("es-CL")} / reserva`;
}

function formatDeposito(deposito: number): string {
  if (deposito === 0) return "Sin depósito";
  return `$${deposito.toLocaleString("es-CL")}`;
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
      className="m-auto p-0 rounded-2xl bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm w-full max-w-2xl max-h-[90vh]"
    >
      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Image */}
        <div className="relative">
          <img
            src={espacio.imagen}
            alt={espacio.nombre}
            className="w-full aspect-video object-cover rounded-t-2xl"
          />
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
            className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
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
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
              {espacio.categoria}
            </span>
            <h2 id="modal-title" className="font-display text-2xl text-text leading-tight">
              {espacio.nombre}
            </h2>
            <p className="text-muted text-sm mt-1">{espacio.descripcion}</p>
          </div>

          {/* Horario */}
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-primary shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Horario</p>
              <p className="text-sm text-text">{espacio.horario}</p>
            </div>
          </div>

          {/* Reglas */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              Reglas de uso
            </p>
            <ul className="space-y-1.5">
              {espacio.reglas.map((regla) => (
                <li key={regla} className="flex items-start gap-2 text-sm text-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-primary shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {regla}
                </li>
              ))}
            </ul>
          </div>

          {/* Tarifa + Depósito */}
          <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Tarifa</p>
              <p className="text-lg font-semibold text-text">{formatTarifa(espacio.tarifa)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Depósito</p>
              <p className="text-lg font-semibold text-text">{formatDeposito(espacio.deposito)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {espacio.disponibleHoy ? (
              <Link
                to="/reservas"
                className="flex-1 bg-primary hover:bg-accent text-white text-sm font-semibold py-2.5 px-4 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Reservar ahora
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 bg-slate-200 text-slate-400 text-sm font-semibold py-2.5 px-4 rounded-lg cursor-not-allowed"
                aria-disabled="true"
              >
                No disponible hoy
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
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
    <article className="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src={espacio.imagen}
          alt={espacio.nombre}
          className="w-full aspect-video object-cover rounded-t-xl"
        />
        {/* Availability badge */}
        <span
          className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
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
        <span className="inline-block self-start bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
          {espacio.categoria}
        </span>

        {/* Name */}
        <h3 className="font-display text-lg text-text leading-snug">{espacio.nombre}</h3>

        {/* Capacity + Tarifa */}
        <div className="flex items-center justify-between text-sm text-muted">
          <span className="flex items-center gap-1.5">
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
          <button
            onClick={() => onVerDetalle(espacio)}
            className="flex-1 border border-border text-text text-sm font-medium py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Ver detalle
          </button>
          {isAdmin ? (
            <button
              onClick={() => onVerDetalle(espacio)}
              className="flex-1 bg-accent hover:opacity-90 text-white text-sm font-semibold py-2 px-3 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Administrar
            </button>
          ) : espacio.disponibleHoy ? (
            <Link
              to="/reservas"
              className="flex-1 bg-primary hover:bg-accent text-white text-sm font-semibold py-2 px-3 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Reservar
            </Link>
          ) : (
            <button
              disabled
              aria-disabled="true"
              className="flex-1 bg-slate-200 text-slate-400 text-sm font-semibold py-2 px-3 rounded-lg cursor-not-allowed"
            >
              Reservar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

const IMAGENES_CATEGORIA: Record<string, string> = {
  Quincho: "https://images.unsplash.com/photo-1622714384717-3f60c04d7c73?w=600&h=400&fit=crop",
  Piscina: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&h=400&fit=crop",
  Sala: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  Gimnasio: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
  Cancha: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
};

function inferirCategoria(nombre: string): string {
  const n = nombre.toLowerCase();
  if (n.includes("quincho") || n.includes("parrilla") || n.includes("asador")) return "Quincho";
  if (n.includes("piscina") || n.includes("alberca")) return "Piscina";
  if (n.includes("gimnasio") || n.includes("gym")) return "Gimnasio";
  if (n.includes("cancha") || n.includes("padel") || n.includes("tenis") || n.includes("futbol")) return "Cancha";
  return "Sala";
}

function mapearBackendEspacio(b: BackendEspacio): Espacio {
  const categoria = inferirCategoria(b.nombre);
  return {
    id: b.id,
    nombre: b.nombre,
    categoria,
    capacidad: b.capacidad,
    tarifa: b.tarifa_hora,
    disponibleHoy: b.estado === "activo",
    imagen: IMAGENES_CATEGORIA[categoria] || IMAGENES_CATEGORIA.Sala,
    descripcion: b.descripcion || "Espacio común disponible para reserva de residentes.",
    horario: "Lunes a domingo, 09:00 – 22:00 hrs",
    reglas: [
      `Capacidad máxima: ${b.capacidad} personas.`,
      "Dejar el espacio limpio y ordenado al finalizar la reserva.",
      "Respetar el reglamento interno de copropiedad.",
    ],
    deposito: b.tarifa_hora > 0 ? b.tarifa_hora * 2 : 0,
  };
}

export default function EspaciosComunes() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [espacios, setEspacios] = useState<Espacio[]>(ESPACIOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchEspacios() {
      try {
        setLoading(true);
        const data = await listarEspacios();
        if (active && Array.isArray(data) && data.length > 0) {
          setEspacios(data.map(mapearBackendEspacio));
        }
      } catch {
        // Fallback elegante al catálogo local si el backend no está disponible
      } finally {
        if (active) setLoading(false);
      }
    }
    void fetchEspacios();
    return () => {
      active = false;
    };
  }, []);

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
          {espacios.length} espacios disponibles en Torres del Parque {loading ? "(cargando...)" : ""}
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
              className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Categoria */}
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros((f) => ({ ...f, categoria: e.target.value }))}
            className="border border-border rounded-lg text-sm text-text py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
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
            className="border border-border rounded-lg text-sm text-text py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
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
        {espaciosFiltrados.length === 0 ? (
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
                No hay espacios que coincidan con tus filtros
              </p>
              <p className="text-muted text-sm mt-1">
                Intenta ajustar los filtros para ver más resultados.
              </p>
            </div>
            <button
              onClick={() =>
                setFiltros({
                  busqueda: "",
                  categoria: "Todos",
                  capacidad: "Todos",
                  soloDisponibles: false,
                })
              }
              className="mt-2 text-primary text-sm font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              Limpiar filtros
            </button>
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
