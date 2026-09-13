import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { sileo } from "sileo";
import {
  listarMisReservas,
  crearReserva,
  listarEspacios,
  type BackendReserva,
} from "../services/espaciosApi";
import { getStoredIdToken } from "../lib/authStorage";

interface Reserva {
  id: string;
  espacio: string;
  categoria: string;
  imagen: string;
  fecha: string;
  fechaDisplay: string;
  hora: string;
  duracionHrs: number;
  precio: number;
  estado: "confirmada" | "pendiente" | "cancelada";
  codigo: string;
}

interface EspacioOpcion {
  id: number;
  nombre: string;
  tarifaHr: number;
  imagen?: string;
  categoria?: string;
}

interface CreateForm {
  espacioId: number;
  fecha: string;
  hora: string;
  duracion: number;
}

const ESPACIOS_FALLBACK: EspacioOpcion[] = [
  { id: 1, nombre: "Quincho Los Aromos", tarifaHr: 25000, categoria: "Quincho" },
  { id: 2, nombre: "Quincho Bajo", tarifaHr: 18000, categoria: "Quincho" },
  { id: 3, nombre: "Piscina", tarifaHr: 0, categoria: "Piscina" },
  { id: 4, nombre: "Sala Multiuso", tarifaHr: 8000, categoria: "Sala" },
  { id: 5, nombre: "Sala de Juegos", tarifaHr: 5000, categoria: "Sala" },
  { id: 6, nombre: "Gimnasio", tarifaHr: 0, categoria: "Gimnasio" },
  { id: 7, nombre: "Cancha Multicancha", tarifaHr: 12000, categoria: "Cancha" },
];

const HORAS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];
const DURACIONES = [1, 2, 3, 4];

const INITIAL_RESERVAS: Reserva[] = [
  {
    id: "R001",
    espacio: "Quincho Los Aromos",
    categoria: "Quincho",
    imagen: "https://images.unsplash.com/photo-1622714384717-3f60c04d7c73?w=300&h=200&fit=crop",
    fecha: "2026-08-23",
    fechaDisplay: "Sáb 23 ago 2026",
    hora: "18:00",
    duracionHrs: 2,
    precio: 25000,
    estado: "confirmada",
    codigo: "CONV-2026-R001",
  },
  {
    id: "R002",
    espacio: "Sala Multiuso",
    categoria: "Sala",
    imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
    fecha: "2026-08-20",
    fechaDisplay: "Mié 20 ago 2026",
    hora: "10:00",
    duracionHrs: 3,
    precio: 8000,
    estado: "pendiente",
    codigo: "CONV-2026-R002",
  },
  {
    id: "R003",
    espacio: "Gimnasio",
    categoria: "Gimnasio",
    imagen: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
    fecha: "2026-08-15",
    fechaDisplay: "Sáb 15 ago 2026",
    hora: "08:00",
    duracionHrs: 1,
    precio: 0,
    estado: "confirmada",
    codigo: "CONV-2026-R003",
  },
  {
    id: "R004",
    espacio: "Piscina",
    categoria: "Piscina",
    imagen: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=300&h=200&fit=crop",
    fecha: "2026-08-10",
    fechaDisplay: "Lun 10 ago 2026",
    hora: "14:00",
    duracionHrs: 2,
    precio: 0,
    estado: "cancelada",
    codigo: "CONV-2026-R004",
  },
  {
    id: "R005",
    espacio: "Cancha Multicancha",
    categoria: "Cancha",
    imagen: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
    fecha: "2026-08-30",
    fechaDisplay: "Dom 30 ago 2026",
    hora: "16:00",
    duracionHrs: 2,
    precio: 12000,
    estado: "pendiente",
    codigo: "CONV-2026-R005",
  },
];

function formatPrecio(precio: number): string {
  if (precio === 0) return "Gratis";
  return `$${precio.toLocaleString("es-CL")}`;
}

function isCancelable(reserva: Reserva): boolean {
  if (reserva.estado === "cancelada") return false;
  const [h] = reserva.hora.split(":").map(Number);
  const reservaDate = new Date(reserva.fecha);
  reservaDate.setHours(h, 0, 0, 0);
  const now = new Date();
  const diffMs = reservaDate.getTime() - now.getTime();
  return diffMs > 24 * 60 * 60 * 1000;
}

function StatusBadge({ estado }: { estado: Reserva["estado"] }) {
  if (estado === "confirmada") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <span aria-hidden="true">✓</span> Confirmada
      </span>
    );
  }
  if (estado === "pendiente") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-text">
        <span aria-hidden="true">⏳</span> Pendiente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-muted">
      <span aria-hidden="true">✗</span> Cancelada
    </span>
  );
}

function StatusBar({ estado }: { estado: Reserva["estado"] }) {
  const colorClass =
    estado === "confirmada"
      ? "bg-green-600"
      : estado === "pendiente"
        ? "bg-alert-yellow"
        : "bg-gray-300";
  return (
    <div
      className={`w-1 self-stretch rounded-l-xl flex-shrink-0 ${colorClass}`}
      aria-hidden="true"
    />
  );
}

interface ReservaCardProps {
  reserva: Reserva;
  onCancel: (id: string) => void;
  onBlock?: (id: string) => void;
}

function ReservaCard({ reserva, onCancel, onBlock }: ReservaCardProps) {
  const cancelable = isCancelable(reserva);
  const endHour = parseInt(reserva.hora.split(":")[0]) + reserva.duracionHrs;
  const endTime = `${endHour.toString().padStart(2, "0")}:00`;

  return (
    <div className="flex bg-white border border-border rounded-xl shadow-sm overflow-hidden">
      <StatusBar estado={reserva.estado} />
      <div className="flex flex-1 gap-4 p-5">
        <img
          src={reserva.imagen}
          alt={reserva.espacio}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex flex-1 flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="font-display text-lg text-text leading-tight">{reserva.espacio}</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-muted text-xs rounded-full">
              {reserva.categoria}
            </span>
          </div>
          <p className="text-sm text-muted">
            {reserva.fechaDisplay} · {reserva.hora} – {endTime} hrs
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="font-medium text-text">
              {formatPrecio(reserva.precio * reserva.duracionHrs)}
            </span>
            <StatusBadge estado={reserva.estado} />
          </div>
          <p className="text-xs text-muted">Código: {reserva.codigo}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {reserva.estado !== "cancelada" && (
              <button
                onClick={() => cancelable && onCancel(reserva.id)}
                disabled={!cancelable}
                title={!cancelable ? "No cancelable (menos de 24 hrs de anticipación)" : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  cancelable
                    ? "border-alert-red text-alert-red hover:bg-red-50"
                    : "border-border text-muted cursor-not-allowed opacity-50"
                }`}
              >
                Cancelar
              </button>
            )}
            {onBlock && reserva.estado !== "cancelada" && (
              <button
                onClick={() => onBlock(reserva.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-alert-yellow text-text hover:bg-yellow-50 transition-colors"
              >
                Bloquear por mantenimiento
              </button>
            )}
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-primary text-primary hover:bg-teal-50 transition-colors">
              Ver detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CreateModalProps {
  espacios: EspacioOpcion[];
  onClose: () => void;
  onConfirm: (
    reserva: Omit<Reserva, "id" | "codigo">,
    payload?: { espacioId: number; fechaInicio: string; fechaFin: string },
  ) => void;
}

function CreateModal({ espacios, onClose, onConfirm }: CreateModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const defaultEspacio = espacios[0] ?? ESPACIOS_FALLBACK[0];
  const [form, setForm] = useState<CreateForm>({
    espacioId: defaultEspacio.id,
    fecha: today,
    hora: "10:00",
    duracion: 1,
  });

  const espacio = espacios.find((e) => e.id === form.espacioId) ?? defaultEspacio;
  const total = espacio.tarifaHr * form.duracion;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fechaDate = new Date(form.fecha + "T12:00:00");
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthNames = [
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
    const fechaDisplay = `${dayNames[fechaDate.getDay()]} ${fechaDate.getDate()} ${monthNames[fechaDate.getMonth()]} ${fechaDate.getFullYear()}`;

    const [hStr, mStr] = form.hora.split(":");
    const startH = parseInt(hStr, 10);
    const startM = parseInt(mStr || "0", 10);
    const [y, m, d] = form.fecha.split("-").map(Number);
    const start = new Date(y, m - 1, d, startH, startM, 0);
    const end = new Date(start.getTime() + form.duracion * 3600 * 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    const toIsoNaive = (dt: Date) =>
      `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`;

    const fechaInicio = toIsoNaive(start);
    const fechaFin = toIsoNaive(end);

    onConfirm(
      {
        espacio: espacio.nombre,
        categoria: espacio.categoria || espacio.nombre.split(" ")[0],
        imagen:
          espacio.imagen ||
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
        fecha: form.fecha,
        fechaDisplay,
        hora: form.hora,
        duracionHrs: form.duracion,
        precio: espacio.tarifaHr,
        estado: "pendiente",
      },
      {
        espacioId: espacio.id,
        fechaInicio,
        fechaFin,
      },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="font-display text-2xl text-text mb-5">Nueva reserva</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="espacio" className="text-sm font-medium text-text">
              Selecciona un espacio
            </label>
            <select
              id="espacio"
              value={form.espacioId}
              onChange={(e) => setForm({ ...form, espacioId: Number(e.target.value) })}
              className="border border-border rounded-lg px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {espacios.map((esp) => (
                <option key={esp.id} value={esp.id}>
                  {esp.nombre} —{" "}
                  {esp.tarifaHr === 0 ? "Gratis" : `$${esp.tarifaHr.toLocaleString("es-CL")}/hr`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="fecha" className="text-sm font-medium text-text">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              min={today}
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
              className="border border-border rounded-lg px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="hora" className="text-sm font-medium text-text">
                Hora inicio
              </label>
              <select
                id="hora"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                className="border border-border rounded-lg px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {HORAS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="duracion" className="text-sm font-medium text-text">
                Duración
              </label>
              <select
                id="duracion"
                value={form.duracion}
                onChange={(e) => setForm({ ...form, duracion: Number(e.target.value) })}
                className="border border-border rounded-lg px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {DURACIONES.map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? "hr" : "hrs"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-text">
            <span className="font-medium">Total: </span>
            {form.duracion} {form.duracion === 1 ? "hr" : "hrs"} &times;{" "}
            {espacio.tarifaHr === 0 ? "Gratis" : `$${espacio.tarifaHr.toLocaleString("es-CL")}`} ={" "}
            <span className="font-semibold text-primary">
              {total === 0 ? "Gratis" : `$${total.toLocaleString("es-CL")}`}
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button
              type="submit"
              className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-accent transition-colors"
              data-cuelume-press="tick"
              data-cuelume-release="success"
            >
              Confirmar reserva
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-muted text-sm py-2 hover:text-text transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CancelModalProps {
  reserva: Reserva;
  onClose: () => void;
  onConfirm: () => void;
}

function CancelModal({ reserva, onClose, onConfirm }: CancelModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="font-display text-xl text-text mb-2">¿Cancelar esta reserva?</h2>
        <p className="text-sm text-muted mb-1">
          <span className="font-medium text-text">{reserva.espacio}</span> — {reserva.fechaDisplay}{" "}
          a las {reserva.hora} hrs
        </p>
        <p className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-text mt-3 mb-6">
          ⚠️ Recuerda que las cancelaciones deben realizarse con al menos 24 horas de anticipación.
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-text font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-alert-red text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

type FilterTab = "todas" | "confirmada" | "pendiente" | "cancelada";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "confirmada", label: "Confirmadas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "cancelada", label: "Canceladas" },
];

function mapearBackendReserva(
  b: BackendReserva,
  espaciosMap?: Map<number, EspacioOpcion>,
): Reserva {
  const fInicio = new Date(b.fecha_inicio);
  const fFin = new Date(b.fecha_fin);
  const duracionHrs = Math.max(
    1,
    Math.round((fFin.getTime() - fInicio.getTime()) / (1000 * 60 * 60)),
  );
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = [
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
  const yyyy = fInicio.getFullYear();
  const mm = String(fInicio.getMonth() + 1).padStart(2, "0");
  const dd = String(fInicio.getDate()).padStart(2, "0");
  const fechaIso = `${yyyy}-${mm}-${dd}`;
  const fechaDisplay = `${dayNames[fInicio.getDay()]} ${fInicio.getDate()} ${monthNames[fInicio.getMonth()]} ${yyyy}`;
  const hora = `${String(fInicio.getHours()).padStart(2, "0")}:${String(fInicio.getMinutes()).padStart(2, "0")}`;

  const espacioOpcion = espaciosMap?.get(b.espacio_id) ?? {
    id: b.espacio_id,
    nombre: `Espacio #${b.espacio_id}`,
    tarifaHr: 0,
    categoria: "Espacio",
  };
  const estadoMap: Record<string, "confirmada" | "pendiente" | "cancelada"> = {
    confirmada: "confirmada",
    pendiente_pago: "pendiente",
    pendiente: "pendiente",
    cancelada: "cancelada",
    expirada: "cancelada",
  };

  return {
    id: `R${String(b.id).padStart(3, "0")}`,
    espacio: espacioOpcion.nombre,
    categoria: espacioOpcion.categoria || espacioOpcion.nombre.split(" ")[0],
    imagen:
      espacioOpcion.imagen ||
      "https://images.unsplash.com/photo-1622714384717-3f60c04d7c73?w=300&h=200&fit=crop",
    fecha: fechaIso,
    fechaDisplay,
    hora,
    duracionHrs,
    precio: duracionHrs > 0 ? Math.round(b.monto_total / duracionHrs) : b.monto_total,
    estado: estadoMap[b.estado.toLowerCase()] ?? "pendiente",
    codigo: `CONV-2026-R${String(b.id).padStart(3, "0")}`,
  };
}

export default function Reservas() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [espaciosDisponibles, setEspaciosDisponibles] = useState<EspacioOpcion[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");
  const [showCreate, setShowCreate] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [blockTarget, setBlockTarget] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function cargarDatos() {
      const idToken = getStoredIdToken() ?? undefined;
      try {
        setLoading(true);
        const [espaciosData, reservasData] = await Promise.all([
          listarEspacios(idToken).catch(() => []),
          listarMisReservas(idToken).catch(() => []),
        ]);

        if (!active) return;

        let listaEspacios: EspacioOpcion[] = [];
        if (Array.isArray(espaciosData) && espaciosData.length > 0) {
          listaEspacios = espaciosData.map((e) => ({
            id: e.id,
            nombre: e.nombre,
            tarifaHr: e.tarifa_hora,
            categoria: e.nombre.split(" ")[0],
          }));
        } else {
          listaEspacios = ESPACIOS_FALLBACK;
        }
        setEspaciosDisponibles(listaEspacios);

        const map = new Map<number, EspacioOpcion>();
        listaEspacios.forEach((esp) => map.set(esp.id, esp));

        if (Array.isArray(reservasData)) {
          setReservas(reservasData.map((r) => mapearBackendReserva(r, map)));
        } else {
          setReservas([]);
        }
      } catch {
        if (active) {
          setReservas(INITIAL_RESERVAS);
          setEspaciosDisponibles(ESPACIOS_FALLBACK);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void cargarDatos();
    return () => {
      active = false;
    };
  }, []);

  const filtered =
    activeTab === "todas" ? reservas : reservas.filter((r) => r.estado === activeTab);
  const cancelTargetReserva = cancelTarget
    ? (reservas.find((r) => r.id === cancelTarget) ?? null)
    : null;

  async function handleCreateConfirm(
    data: Omit<Reserva, "id" | "codigo">,
    payload?: { espacioId: number; fechaInicio: string; fechaFin: string },
  ) {
    const idToken = getStoredIdToken() ?? undefined;
    let newReserva: Reserva;

    if (payload) {
      try {
        const backendResult = await crearReserva(idToken, {
          espacio_id: payload.espacioId,
          fecha_inicio: payload.fechaInicio,
          fecha_fin: payload.fechaFin,
        });
        const map = new Map<number, EspacioOpcion>();
        (espaciosDisponibles.length > 0 ? espaciosDisponibles : ESPACIOS_FALLBACK).forEach((e) =>
          map.set(e.id, e),
        );
        newReserva = mapearBackendReserva(backendResult, map);
        sileo.success({ title: "Reserva creada exitosamente en el servidor" });
      } catch (err) {
        const newId = `R${String(reservas.length + 1).padStart(3, "0")}`;
        newReserva = {
          ...data,
          id: newId,
          codigo: `CONV-2026-${newId}`,
        };
        sileo.warning({
          title: "Reserva guardada localmente (modo offline)",
          description: err instanceof Error ? err.message : undefined,
        });
      }
    } else {
      const newId = `R${String(reservas.length + 1).padStart(3, "0")}`;
      newReserva = {
        ...data,
        id: newId,
        codigo: `CONV-2026-${newId}`,
      };
    }

    setReservas([newReserva, ...reservas]);
    setShowCreate(false);
  }

  function handleCancelConfirm() {
    if (!cancelTarget) return;
    setReservas(reservas.map((r) => (r.id === cancelTarget ? { ...r, estado: "cancelada" } : r)));
    setCancelTarget(null);
  }

  function handleBlockConfirm() {
    if (!blockTarget) return;
    setReservas(reservas.map((r) => (r.id === blockTarget ? { ...r, estado: "cancelada" } : r)));
    setBlockTarget(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark header */}
      <header className="bg-text px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-white">
              {isAdmin ? "Reservas del condominio" : "Mis Reservas"}
            </h1>
            <p className="text-white/60 mt-1">
              {isAdmin ? "Gestión y bloqueo por mantenimiento" : "Torres del Parque"}
            </p>
          </div>
          {!isAdmin && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex-shrink-0 bg-primary text-white font-medium px-4 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm"
            >
              + Nueva reserva
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "border border-border text-muted hover:text-text hover:border-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reservations list */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-16 text-muted">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-medium text-text">Cargando reservas desde el servidor...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-medium text-text">No hay reservas en esta categoría</p>
              <p className="text-sm mt-1">Crea una nueva reserva para comenzar.</p>
            </div>
          ) : (
            filtered.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                onCancel={(id) => setCancelTarget(id)}
                onBlock={isAdmin ? (id) => setBlockTarget(id) : undefined}
              />
            ))
          )}
        </div>
      </main>

      {/* CTA strip */}
      <div className="bg-text mt-12">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <p className="text-white/80 text-sm">¿Buscas un espacio disponible?</p>
          <Link
            to="/espacios"
            className="text-white font-medium text-sm hover:text-primary transition-colors flex items-center gap-1"
          >
            Explorar espacios comunes →
          </Link>
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateModal
          espacios={espaciosDisponibles.length > 0 ? espaciosDisponibles : ESPACIOS_FALLBACK}
          onClose={() => setShowCreate(false)}
          onConfirm={handleCreateConfirm}
        />
      )}
      {cancelTargetReserva && (
        <CancelModal
          reserva={cancelTargetReserva}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
      {blockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setBlockTarget(null)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="font-display text-xl text-text mb-2">¿Bloquear por mantenimiento?</h2>
            <p className="text-sm text-muted mb-6">
              Esta reserva quedará cancelada y el espacio aparecerá no disponible en el período
              correspondiente. La acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBlockTarget(null)}
                className="flex-1 border border-border text-text font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleBlockConfirm}
                className="flex-1 bg-alert-yellow text-text font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Confirmar bloqueo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
