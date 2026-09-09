import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

type EstadoIncidente = "abierto" | "en_revision" | "en_progreso" | "resuelto" | "cerrado";
type Prioridad = "alta" | "media" | "baja";
type Categoria =
  | "Mantención"
  | "Seguridad"
  | "Limpieza"
  | "Gasfitería"
  | "Eléctrico"
  | "Ascensor"
  | "Otro";

interface Incidente {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  prioridad: Prioridad;
  ubicacion: string;
  estado: EstadoIncidente;
  fechaCreacion: string;
  reportadoPor: string;
  responsable: string | null;
  unidad: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED: Incidente[] = [
  {
    id: "1",
    titulo: "Filtración de agua en techo pasillo piso 3",
    descripcion:
      "Se observa mancha de humedad creciente en el techo del pasillo entre ascensor y escalera. Gotea cuando llueve.",
    categoria: "Gasfitería",
    prioridad: "alta",
    ubicacion: "Torre A · Piso 3 · Pasillo norte",
    estado: "en_progreso",
    fechaCreacion: "14 ago 2026",
    reportadoPor: "María González",
    responsable: "Jorge Pizarro",
    unidad: "Torre A · 1204",
  },
  {
    id: "2",
    titulo: "Lámpara fundida en estacionamiento subterráneo B2",
    descripcion: "Zona sin iluminación entre columnas 14 y 17. Riesgo de accidente.",
    categoria: "Eléctrico",
    prioridad: "media",
    ubicacion: "Estacionamiento · Nivel B2",
    estado: "en_revision",
    fechaCreacion: "16 ago 2026",
    reportadoPor: "Pedro Soto",
    responsable: null,
    unidad: "Torre B · 304",
  },
  {
    id: "3",
    titulo: "Ascensor Torre B fuera de servicio",
    descripcion:
      "Ascensor principal de Torre B no responde desde las 07:30. Muchos residentes afectados.",
    categoria: "Ascensor",
    prioridad: "alta",
    ubicacion: "Torre B · Lobby",
    estado: "abierto",
    fechaCreacion: "19 ago 2026",
    reportadoPor: "Lucía Herrera",
    responsable: null,
    unidad: "Torre B · 802",
  },
  {
    id: "4",
    titulo: "Basura acumulada en acceso peatonal norte",
    descripcion: "Bolsas de basura dejadas fuera del horario de retiro, llevan 2 días ahí.",
    categoria: "Limpieza",
    prioridad: "baja",
    ubicacion: "Acceso peatonal norte",
    estado: "resuelto",
    fechaCreacion: "10 ago 2026",
    reportadoPor: "Carlos Fuentes",
    responsable: "Jorge Pizarro",
    unidad: "Torre C · 101",
  },
  {
    id: "5",
    titulo: "Cámara de seguridad sin señal — acceso sur",
    descripcion:
      "La cámara del acceso sur no transmite imagen desde el lunes. Punto ciego en vigilancia.",
    categoria: "Seguridad",
    prioridad: "alta",
    ubicacion: "Acceso vehicular sur",
    estado: "cerrado",
    fechaCreacion: "05 ago 2026",
    reportadoPor: "Ana Vidal",
    responsable: "Ana Vidal",
    unidad: "Administración",
  },
];

const CATEGORIAS: Categoria[] = [
  "Mantención",
  "Seguridad",
  "Limpieza",
  "Gasfitería",
  "Eléctrico",
  "Ascensor",
  "Otro",
];
const UBICACIONES = [
  "Torre A · Lobby",
  "Torre A · Piso 1",
  "Torre A · Piso 3",
  "Torre A · Piso 5",
  "Torre B · Lobby",
  "Torre B · Piso 1",
  "Torre B · Piso 3",
  "Torre C · Lobby",
  "Estacionamiento · Nivel B1",
  "Estacionamiento · Nivel B2",
  "Área común · Jardín central",
  "Área común · Piscina",
  "Área común · Quincho",
  "Acceso peatonal norte",
  "Acceso vehicular sur",
];
const RESPONSABLES = ["Jorge Pizarro", "Ana Vidal", "Eduardo Mena", "Verónica Lagos"];

// ─── Estado badge config ──────────────────────────────────────────────────────

interface EstadoConfig {
  label: string;
  icon: string; // inline SVG path command or emoji-style
  bg: string;
  text: string;
}

const ESTADO_MAP: Record<EstadoIncidente, EstadoConfig> = {
  abierto: {
    label: "Abierto",
    icon: "alert",
    bg: "bg-alert-red/10",
    text: "text-alert-red",
  },
  en_revision: {
    label: "En revisión",
    icon: "clock",
    bg: "bg-alert-yellow",
    text: "text-text", // Advertencia: text-text, no blanco
  },
  en_progreso: {
    label: "En progreso",
    icon: "refresh",
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  resuelto: {
    label: "Resuelto",
    icon: "check",
    bg: "bg-primary/10",
    text: "text-primary",
  },
  cerrado: {
    label: "Cerrado",
    icon: "x",
    bg: "bg-slate-100",
    text: "text-muted",
  },
};

const PRIORIDAD_MAP: Record<Prioridad, { label: string; dot: string }> = {
  alta: { label: "Alta", dot: "bg-alert-red" },
  media: { label: "Media", dot: "bg-alert-yellow" },
  baja: { label: "Baja", dot: "bg-primary" },
};

// ─── Icon components ──────────────────────────────────────────────────────────

function IconAlert() {
  return (
    <svg
      className="w-3 h-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg
      className="w-3 h-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg
      className="w-3 h-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg
      className="w-3 h-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconX() {
  return (
    <svg
      className="w-3 h-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const ICON_COMPONENTS: Record<string, () => React.ReactElement> = {
  alert: IconAlert,
  clock: IconClock,
  refresh: IconRefresh,
  check: IconCheck,
  x: IconX,
};

// ─── EstadoBadge ──────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: EstadoIncidente }) {
  const cfg = ESTADO_MAP[estado];
  const Icon = ICON_COMPONENTS[cfg.icon];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <Icon />
      {cfg.label}
    </span>
  );
}

// ─── Nuevo incidente modal ────────────────────────────────────────────────────

interface NuevoFormState {
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  prioridad: Prioridad;
  ubicacion: string;
}

interface NuevoModalProps {
  onClose: () => void;
  onCreated: (inc: Incidente) => void;
  reportadoPor: string;
  unidad: string;
}

function NuevoModal({ onClose, onCreated, reportadoPor, unidad }: NuevoModalProps) {
  const [form, setForm] = useState<NuevoFormState>({
    titulo: "",
    descripcion: "",
    categoria: "Mantención",
    prioridad: "media",
    ubicacion: UBICACIONES[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const meses = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const fecha = `${now.getDate()} ${meses[now.getMonth()]} ${now.getFullYear()}`;
    onCreated({
      id: Date.now().toString(),
      titulo: form.titulo,
      descripcion: form.descripcion,
      categoria: form.categoria,
      prioridad: form.prioridad,
      ubicacion: form.ubicacion,
      estado: "abierto",
      fechaCreacion: fecha,
      reportadoPor,
      responsable: null,
      unidad,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl text-text">Reportar incidente</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="incidente-titulo"
              className="block text-sm font-semibold text-text mb-1"
            >
              Título <span className="text-alert-red">*</span>
            </label>
            <input
              id="incidente-titulo"
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Describe brevemente el incidente"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="incidente-categoria"
                className="block text-sm font-semibold text-text mb-1"
              >
                Categoría
              </label>
              <select
                id="incidente-categoria"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
                className="w-full rounded-lg border border-border px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="incidente-prioridad"
                className="block text-sm font-semibold text-text mb-1"
              >
                Prioridad
              </label>
              <select
                id="incidente-prioridad"
                value={form.prioridad}
                onChange={(e) => setForm({ ...form, prioridad: e.target.value as Prioridad })}
                className="w-full rounded-lg border border-border px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="incidente-ubicacion"
              className="block text-sm font-semibold text-text mb-1"
            >
              Ubicación
            </label>
            <select
              id="incidente-ubicacion"
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {UBICACIONES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="incidente-descripcion"
              className="block text-sm font-semibold text-text mb-1"
            >
              Descripción
            </label>
            <textarea
              id="incidente-descripcion"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              placeholder="Detalla lo que ocurrió, cuándo lo notaste y cualquier información útil..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border rounded-lg py-2.5 text-text font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white rounded-lg py-2.5 font-semibold hover:opacity-90 transition-opacity"
              data-cuelume-press="tick"
              data-cuelume-release="success"
            >
              Reportar incidente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Asignar responsable (admin only) ────────────────────────────────────────

interface AsignarDropdownProps {
  current: string | null;
  onAsignar: (nombre: string) => void;
}

function AsignarDropdown({ current, onAsignar }: AsignarDropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-semibold text-muted border border-border rounded-lg px-3 py-1.5 hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5"
      >
        <svg
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        {current ?? "Asignar"}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-40">
          {RESPONSABLES.map((r) => (
            <button
              key={r}
              onClick={() => {
                onAsignar(r);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                r === current ? "font-semibold text-primary" : "text-text"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Incidente card ───────────────────────────────────────────────────────────

interface IncidenteCardProps {
  inc: Incidente;
  onAsignar: (id: string, responsable: string) => void;
  onCambiarEstado: (id: string, estado: EstadoIncidente) => void;
  isAdmin: boolean;
  isConserje: boolean;
}

function IncidenteCard({
  inc,
  onAsignar,
  onCambiarEstado,
  isAdmin,
  isConserje,
}: IncidenteCardProps) {
  const prioridadCfg = PRIORIDAD_MAP[inc.prioridad];

  return (
    <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                prioridadCfg.dot === "bg-alert-red"
                  ? "bg-alert-red/10 text-alert-red"
                  : prioridadCfg.dot === "bg-alert-yellow"
                    ? "bg-alert-yellow text-text"
                    : "bg-primary/10 text-primary"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${prioridadCfg.dot}`} />
              {prioridadCfg.label}
            </span>
            <span className="text-xs text-muted bg-slate-50 border border-border rounded-full px-2 py-0.5">
              {inc.categoria}
            </span>
          </div>
          <p className="font-semibold text-text leading-snug">{inc.titulo}</p>
        </div>
        <EstadoBadge estado={inc.estado} />
      </div>

      {/* Description */}
      {inc.descripcion && (
        <p className="text-sm text-muted leading-relaxed line-clamp-2">{inc.descripcion}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span>📍 {inc.ubicacion}</span>
        <span>📅 {inc.fechaCreacion}</span>
        <span>👤 {inc.reportadoPor}</span>
        {inc.responsable && <span>🔧 {inc.responsable}</span>}
      </div>

      {/* Admin/conserje actions */}
      {(isAdmin || isConserje) && inc.estado !== "cerrado" && (
        <div className="flex items-center gap-2 pt-1 border-t border-border flex-wrap">
          {/* Estado transitions */}
          {inc.estado === "abierto" && (
            <button
              onClick={() => onCambiarEstado(inc.id, "en_revision")}
              className="text-xs font-semibold text-muted border border-border rounded-lg px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              Tomar en revisión
            </button>
          )}
          {inc.estado === "en_revision" && (
            <button
              onClick={() => onCambiarEstado(inc.id, "en_progreso")}
              className="text-xs font-semibold text-muted border border-border rounded-lg px-3 py-1.5 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              Iniciar trabajo
            </button>
          )}
          {inc.estado === "en_progreso" && (
            <button
              onClick={() => onCambiarEstado(inc.id, "resuelto")}
              className="text-xs font-semibold text-white bg-primary rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity"
              data-cuelume-press="tick"
              data-cuelume-release="chime"
            >
              Marcar resuelto
            </button>
          )}
          {inc.estado === "resuelto" && isAdmin && (
            <button
              onClick={() => onCambiarEstado(inc.id, "cerrado")}
              className="text-xs font-semibold text-muted border border-border rounded-lg px-3 py-1.5 hover:border-slate-400 hover:text-text transition-colors"
            >
              Cerrar incidente
            </button>
          )}
          {/* Assign — admin only */}
          {isAdmin && (
            <div className="ml-auto">
              <AsignarDropdown current={inc.responsable} onAsignar={(r) => onAsignar(inc.id, r)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Incidentes() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";
  const isConserje = role === "conserje";

  const [incidentes, setIncidentes] = useState<Incidente[]>(SEED);
  const [filtroEstado, setFiltroEstado] = useState<EstadoIncidente | "todos">("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<Prioridad | "todas">("todas");
  const [showNuevo, setShowNuevo] = useState(false);

  const filtrados = incidentes.filter(
    (i) =>
      (filtroEstado === "todos" || i.estado === filtroEstado) &&
      (filtroPrioridad === "todas" || i.prioridad === filtroPrioridad),
  );

  const counts: Record<EstadoIncidente | "todos", number> = {
    todos: incidentes.length,
    abierto: incidentes.filter((i) => i.estado === "abierto").length,
    en_revision: incidentes.filter((i) => i.estado === "en_revision").length,
    en_progreso: incidentes.filter((i) => i.estado === "en_progreso").length,
    resuelto: incidentes.filter((i) => i.estado === "resuelto").length,
    cerrado: incidentes.filter((i) => i.estado === "cerrado").length,
  };

  const handleAsignar = (id: string, responsable: string) =>
    setIncidentes((prev) => prev.map((i) => (i.id === id ? { ...i, responsable } : i)));

  const handleCambiarEstado = (id: string, estado: EstadoIncidente) =>
    setIncidentes((prev) => prev.map((i) => (i.id === id ? { ...i, estado } : i)));

  const FILTER_TABS: { key: EstadoIncidente | "todos"; label: string }[] = [
    { key: "todos", label: `Todos (${counts.todos})` },
    { key: "abierto", label: `Abiertos (${counts.abierto})` },
    { key: "en_revision", label: `Revisión (${counts.en_revision})` },
    { key: "en_progreso", label: `Progreso (${counts.en_progreso})` },
    { key: "resuelto", label: `Resueltos (${counts.resuelto})` },
    { key: "cerrado", label: `Cerrados (${counts.cerrado})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Header */}
      <header className="bg-text px-4 pt-8 pb-6">
        <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary/70 uppercase mb-2">
              Gestión
            </p>
            <h1 className="font-display text-4xl text-white">Incidentes</h1>
            <p className="text-white/60 mt-1 text-sm">
              {isAdmin
                ? "Gestiona y asigna todos los incidentes del condominio"
                : isConserje
                  ? "Revisa y actualiza el estado de incidentes reportados"
                  : "Reporta y haz seguimiento de incidentes en tu condominio"}
            </p>
          </div>
          <button
            onClick={() => setShowNuevo(true)}
            className="bg-primary text-white rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap mt-1"
            data-cuelume-press="tick"
          >
            + Nuevo incidente
          </button>
        </div>
      </header>

      {/* Estado filter tabs */}
      <div className="bg-white border-b border-border sticky top-0 z-10 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex min-w-max">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltroEstado(key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                filtroEstado === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              {key !== "todos" && <EstadoBadge estado={key as EstadoIncidente} />}
              {key === "todos" && label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Priority filter + summary strip */}
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {(["todas", "alta", "media", "baja"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFiltroPrioridad(p)}
                className={`text-xs font-semibold rounded-full px-3 py-1 border transition-colors ${
                  filtroPrioridad === p
                    ? "bg-text text-white border-text"
                    : "border-border text-muted hover:text-text hover:border-text/30"
                }`}
              >
                {p === "todas" ? "Todas" : PRIORIDAD_MAP[p].label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">
            {filtrados.length} incidente{filtrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filtrados.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <svg
              className="w-10 h-10 mx-auto mb-3 opacity-30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-semibold">Sin incidentes para este filtro</p>
            <p className="text-sm mt-1">Cambia el filtro o reporta uno nuevo.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtrados.map((inc) => (
              <IncidenteCard
                key={inc.id}
                inc={inc}
                onAsignar={handleAsignar}
                onCambiarEstado={handleCambiarEstado}
                isAdmin={isAdmin}
                isConserje={isConserje}
              />
            ))}
          </div>
        )}
      </main>

      {showNuevo && (
        <NuevoModal
          onClose={() => setShowNuevo(false)}
          onCreated={(inc) => setIncidentes((prev) => [inc, ...prev])}
          reportadoPor={user?.nombre ?? ""}
          unidad={user?.unidad ?? ""}
        />
      )}
    </div>
  );
}
