import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { notify } from "../utils/notify";
import { categoriaDeEspacio } from "../utils/categoriaEspacio";
import {
  listarMisReservas,
  crearReserva,
  cancelarReserva,
  listarEspacios,
  type BackendReserva,
} from "../services/espaciosApi";

interface Reserva {
  id: string;
  espacio: string;
  categoria: string;
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
  categoria?: string;
}

interface CreateForm {
  espacioId: number;
  fecha: string;
  hora: string;
  duracion: number;
}

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

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES_CORTOS = [
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

/** Parte la fecha AAAA-MM-DD sin pasar por zonas horarias (evita el desfase de un día). */
function partesFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return {
    dia,
    mes: MESES_CORTOS[mes - 1] ?? "",
    semana: DIAS_CORTOS[new Date(anio, mes - 1, dia).getDay()] ?? "",
    anio,
  };
}

function inicioMs(reserva: Reserva): number {
  const [anio, mes, dia] = reserva.fecha.split("-").map(Number);
  const [h, min] = reserva.hora.split(":").map(Number);
  return new Date(anio, mes - 1, dia, h, min).getTime();
}

function horaFin(reserva: Reserva): string {
  const fin = parseInt(reserva.hora.split(":")[0]) + reserva.duracionHrs;
  return `${fin.toString().padStart(2, "0")}:00`;
}

/** Reserva vigente y futura: la que todavía puede ocurrir. */
function esProxima(reserva: Reserva): boolean {
  return reserva.estado !== "cancelada" && inicioMs(reserva) >= Date.now();
}

function cuentaRegresiva(reserva: Reserva): string {
  const dias = Math.floor((inicioMs(reserva) - Date.now()) / (24 * 60 * 60 * 1000));
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Mañana";
  return `En ${dias} días`;
}

/** El estado va siempre como texto además del indicador: el color solo no alcanza. */
function EstadoReserva({ estado }: { estado: Reserva["estado"] }) {
  const config = {
    confirmada: { texto: "Confirmada", punto: "bg-primary" },
    pendiente: { texto: "Pendiente", punto: "bg-alert-yellow" },
    cancelada: { texto: "Cancelada", punto: "bg-muted" },
  }[estado];
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${config.punto}`} />
      {config.texto}
    </span>
  );
}

interface ReservaCardProps {
  reserva: Reserva;
  onCancel: (id: string) => void;
  onBlock?: (id: string) => void;
}

/** Color del talón según estado: la fecha es lo primero que se lee y ya dice si la reserva está firme. */
const TALON_POR_ESTADO: Record<Reserva["estado"], string> = {
  confirmada: "bg-accent text-white",
  pendiente: "bg-alert-yellow text-text",
  cancelada: "bg-border text-text",
};

/**
 * Una reserva como un ticket: talón con la fecha a la izquierda, línea de corte punteada con
 * muescas y el detalle a la derecha. Es el mismo motivo del comprobante de gastos.
 */
function ReservaCard({ reserva, onCancel, onBlock }: ReservaCardProps) {
  const cancelable = isCancelable(reserva);
  const { dia, mes, semana } = partesFecha(reserva.fecha);

  return (
    <article className="flex overflow-hidden rounded-md bg-white shadow-sm">
      <div
        className={`flex w-28 shrink-0 flex-col items-center justify-center gap-1 px-2 py-6 ${TALON_POR_ESTADO[reserva.estado]}`}
      >
        <span className="text-sm font-medium">{semana}</span>
        <span className="font-display text-5xl leading-none">{dia}</span>
        <span className="text-sm font-medium">{mes}</span>
      </div>

      <div aria-hidden="true" className="relative w-0 border-l-2 border-dashed border-muted">
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-gray-50" />
        <span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-gray-50" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <h3 className="m-0 font-display text-2xl font-normal leading-tight text-text">
              {reserva.espacio}
            </h3>
            <p className="m-0 mt-1 text-sm text-muted">{reserva.categoria}</p>
          </div>
          <p className="m-0 font-display text-2xl text-text">
            {formatPrecio(reserva.precio * reserva.duracionHrs)}
          </p>
        </div>

        <p className="m-0 text-base text-text">
          {reserva.hora} a {horaFin(reserva)} hrs
        </p>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <EstadoReserva estado={reserva.estado} />
          <p className="m-0 font-mono text-xs text-muted">{reserva.codigo}</p>
        </div>

        {reserva.estado !== "cancelada" && (
          <div className="mt-1 flex flex-wrap gap-2">
            <button
              onClick={() => cancelable && onCancel(reserva.id)}
              disabled={!cancelable}
              title={!cancelable ? "No cancelable (menos de 24 hrs de anticipación)" : undefined}
              className={`min-h-11 rounded-md border px-4 text-sm font-medium transition-colors ${
                cancelable
                  ? "border-alert-red text-alert-red hover:bg-red-50"
                  : "cursor-not-allowed border-border text-muted opacity-50"
              }`}
            >
              Cancelar
            </button>
            {onBlock && (
              <button
                onClick={() => onBlock(reserva.id)}
                className="btn btn-secondary btn-sm border-alert-yellow hover:bg-yellow-50"
              >
                Bloquear por mantenimiento
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/** Fila compacta para lo que ya pasó o se canceló: sin acciones, para no competir con lo próximo. */
function HistorialFila({ reserva }: { reserva: Reserva }) {
  const { dia, mes, semana, anio } = partesFecha(reserva.fecha);
  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 gap-y-1 border-b border-border py-4">
      <p className="m-0 w-24 text-sm text-muted">
        {semana} {dia} {mes} {anio}
      </p>
      <div className="min-w-0">
        <p className="m-0 font-display text-xl text-text">{reserva.espacio}</p>
        <p className="m-0 text-sm text-muted">
          {reserva.hora} a {horaFin(reserva)} hrs ·{" "}
          {formatPrecio(reserva.precio * reserva.duracionHrs)}
        </p>
      </div>
      <EstadoReserva estado={reserva.estado} />
    </li>
  );
}

/** Lo primero del hero: la fecha de la próxima reserva a escala de portada, o su ausencia dicha sin rodeos. */
function ProximaReserva({ reserva }: { reserva: Reserva | null }) {
  const contenedor =
    "border-t-2 border-dashed border-white/30 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-12 lg:pt-0";
  if (!reserva) {
    return (
      <div className={contenedor}>
        <p className="m-0 text-sm text-white/70">Próxima reserva</p>
        <p className="m-0 mt-2 font-display text-4xl text-white">Sin reservas próximas</p>
        <p className="m-0 mt-2 text-base text-white/70">Elige un espacio y reserva en minutos.</p>
      </div>
    );
  }
  const { dia, mes, semana } = partesFecha(reserva.fecha);
  return (
    <div className={contenedor}>
      <p className="m-0 text-sm text-white/70">Próxima reserva</p>
      <p className="m-0 flex items-end gap-5 text-white">
        <span className="font-display text-[clamp(96px,12vw,160px)] leading-none">{dia}</span>
        <span className="pb-3 text-2xl font-medium">
          <span className="block text-primary-on-dark">{mes}</span>
          {semana}
        </span>
      </p>
      <p className="m-0 mt-3 text-lg text-white">
        {cuentaRegresiva(reserva)}, {reserva.hora} a {horaFin(reserva)} hrs
      </p>
    </div>
  );
}

// closedby="any" agrega cerrar al hacer clic fuera; Safari aún no lo soporta.
const soportaClosedBy =
  typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;

function cerrarDialogo(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.closest("dialog")?.close();
}

interface ModalProps {
  titleId: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** Modal nativo: showModal() da foco contenido, Esc, fondo inerte y devuelve el foco al cerrar. */
function Modal({ titleId, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // StrictMode monta el efecto dos veces: showModal() sobre uno ya abierto puede lanzar.
    if (!dialog.open) dialog.showModal();
    // Foco inicial explícito: en confirmaciones destructivas va a la acción segura.
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    if (soportaClosedBy) return;
    // Fallback de clic fuera: se mide el puntero, porque el padding del <dialog> también es su target.
    const cerrarSiClicFuera = (e: MouseEvent) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        dialog.close();
      }
    };
    dialog.addEventListener("click", cerrarSiClicFuera);
    return () => dialog.removeEventListener("click", cerrarSiClicFuera);
  }, []);

  return (
    <dialog
      ref={ref}
      {...({ closedby: "any" } as object)}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-narrow rounded-lg bg-white p-6 shadow-xl backdrop:bg-black/50"
    >
      {children}
    </dialog>
  );
}

interface CreateModalProps {
  espacios: EspacioOpcion[];
  procesando: boolean;
  onClose: () => void;
  onConfirm: (
    reserva: Omit<Reserva, "id" | "codigo">,
    payload?: { espacioId: number; fechaInicio: string; fechaFin: string },
  ) => void;
}

function CreateModal({ espacios, procesando, onClose, onConfirm }: CreateModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const defaultEspacio = espacios[0];
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
    <Modal titleId="crear-reserva-titulo" onClose={onClose}>
      <h2 id="crear-reserva-titulo" className="font-display text-2xl text-text mb-5">
        Nueva reserva
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="espacio" className="text-sm font-medium text-text">
            Selecciona un espacio
          </label>
          <select
            id="espacio"
            data-autofocus
            value={form.espacioId}
            onChange={(e) => setForm({ ...form, espacioId: Number(e.target.value) })}
            className="border border-border rounded-md px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="border border-border rounded-md px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="border border-border rounded-md px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="border border-border rounded-md px-3 py-2 text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {DURACIONES.map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "hr" : "hrs"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-3 text-sm text-text">
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
            disabled={procesando}
            aria-busy={procesando}
            className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-wait"
            data-cuelume-press="tick"
            data-cuelume-release="success"
          >
            {procesando ? "Creando reserva…" : "Confirmar reserva"}
          </button>
          <button
            type="button"
            onClick={cerrarDialogo}
            className="btn btn-tertiary w-full text-muted hover:text-text"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface CancelModalProps {
  reserva: Reserva;
  procesando: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function CancelModal({ reserva, procesando, onClose, onConfirm }: CancelModalProps) {
  return (
    <Modal titleId="cancelar-reserva-titulo" onClose={onClose}>
      <h2 id="cancelar-reserva-titulo" className="font-display text-xl text-text mb-2">
        ¿Cancelar esta reserva?
      </h2>
      <p className="text-sm text-muted mb-1">
        <span className="font-medium text-text">{reserva.espacio}</span> — {reserva.fechaDisplay} a
        las {reserva.hora} hrs
      </p>
      <p className="text-sm bg-yellow-50 border border-yellow-200 rounded-md p-3 text-text mt-3 mb-6">
        ⚠️ Recuerda que las cancelaciones deben realizarse con al menos 24 horas de anticipación.
        Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          data-autofocus
          onClick={cerrarDialogo}
          className="btn btn-secondary flex-1"
        >
          Volver
        </button>
        <button
          onClick={onConfirm}
          disabled={procesando}
          aria-busy={procesando}
          className="btn btn-primary flex-1 bg-alert-red text-white hover:bg-alert-red/90 disabled:opacity-60 disabled:cursor-wait"
        >
          {procesando ? "Cancelando…" : "Sí, cancelar"}
        </button>
      </div>
    </Modal>
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
    id: String(b.id),
    espacio: espacioOpcion.nombre,
    categoria: espacioOpcion.categoria || espacioOpcion.nombre.split(" ")[0],

    fecha: fechaIso,
    fechaDisplay,
    hora,
    duracionHrs,
    precio: duracionHrs > 0 ? Math.round(b.monto_total / duracionHrs) : b.monto_total,
    estado: estadoMap[b.estado.toLowerCase()] ?? "pendiente",
    codigo: `CONV-${new Date(b.creado_en).getFullYear() || yyyy}-R${String(b.id).padStart(3, "0")}`,
  };
}

interface DatosReservas {
  espacios: EspacioOpcion[];
  reservas: Reserva[];
}

/**
 * Fuente de verdad: el servidor. Se usa al montar y tras cada mutación confirmada.
 * Sin setState adentro, para que el efecto de carga no actualice estado de forma síncrona.
 */
async function obtenerDatosReservas(): Promise<DatosReservas> {
  const [espaciosData, reservasData] = await Promise.all([listarEspacios(), listarMisReservas()]);

  const espacios: EspacioOpcion[] = Array.isArray(espaciosData)
    ? espaciosData.map((e) => ({
        id: e.id,
        nombre: e.nombre,
        tarifaHr: e.tarifa_hora,
        categoria: categoriaDeEspacio(e.nombre, e.ubicacion),
      }))
    : [];

  const map = new Map(espacios.map((esp) => [esp.id, esp]));
  let reservas: Reserva[] = [];
  try {
    reservas = Array.isArray(reservasData)
      ? reservasData.map((r) => mapearBackendReserva(r, map))
      : [];
  } catch {
    // Una reserva con forma inesperada no debe dejar la pantalla cargando para siempre.
  }
  return { espacios, reservas };
}

export default function Reservas() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [espaciosDisponibles, setEspaciosDisponibles] = useState<EspacioOpcion[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  // Un fallo de red no es "no hay reservas": se muestra aparte, con reintento.
  const [errorCarga, setErrorCarga] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");
  const [showCreate, setShowCreate] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [blockTarget, setBlockTarget] = useState<string | null>(null);
  // El BFF encola la mutación y el sondeo del job puede tardar hasta 30 s: sin esto se envía dos veces.
  const [procesando, setProcesando] = useState(false);

  function aplicarDatos(datos: DatosReservas) {
    setEspaciosDisponibles(datos.espacios);
    setReservas(datos.reservas);
    setErrorCarga(false);
    setLoading(false);
  }

  async function recargar() {
    try {
      aplicarDatos(await obtenerDatosReservas());
    } catch {
      setErrorCarga(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    obtenerDatosReservas().then(
      (datos) => {
        if (active) aplicarDatos(datos);
      },
      () => {
        if (active) {
          setErrorCarga(true);
          setLoading(false);
        }
      },
    );
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
    _data: Omit<Reserva, "id" | "codigo">,
    payload?: { espacioId: number; fechaInicio: string; fechaFin: string },
  ) {
    if (!payload || procesando) return;

    setProcesando(true);
    try {
      await crearReserva({
        espacio_id: payload.espacioId,
        fecha_inicio: payload.fechaInicio,
        fecha_fin: payload.fechaFin,
      });
      notify.success({ title: "Reserva creada" });
    } catch (err) {
      notify.error({
        title: "No se pudo crear la reserva",
        description: err instanceof Error ? err.message : undefined,
      });
      setProcesando(false);
      return;
    }

    setShowCreate(false);
    await recargar();
    setProcesando(false);
  }

  // Bloquear por mantenimiento usa el mismo DELETE: el backend lo autoriza para admin/conserje.
  async function cancelarEnServidor(id: string) {
    setProcesando(true);
    try {
      await cancelarReserva(Number(id));
      notify.success({ title: "Reserva cancelada" });
    } catch (err) {
      notify.error({
        title: "No se pudo cancelar la reserva",
        description: err instanceof Error ? err.message : undefined,
      });
      setProcesando(false);
      return;
    }
    await recargar();
    setProcesando(false);
  }

  async function handleCancelConfirm() {
    if (!cancelTarget || procesando) return;
    await cancelarEnServidor(cancelTarget);
    setCancelTarget(null);
  }

  async function handleBlockConfirm() {
    if (!blockTarget || procesando) return;
    await cancelarEnServidor(blockTarget);
    setBlockTarget(null);
  }

  const porInicio = (a: Reserva, b: Reserva) => inicioMs(a) - inicioMs(b);
  const proximas = filtered.filter(esProxima).sort(porInicio);
  const historial = filtered.filter((r) => !esProxima(r)).sort((a, b) => porInicio(b, a));
  const proxima = reservas.filter(esProxima).sort(porInicio)[0] ?? null;
  const conteo = (tab: FilterTab) =>
    tab === "todas" ? reservas.length : reservas.filter((r) => r.estado === tab).length;

  const accionesTarjeta = {
    onCancel: (id: string) => setCancelTarget(id),
    onBlock: isAdmin ? (id: string) => setBlockTarget(id) : undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-text pt-14 pb-16">
        <div className="mx-auto grid max-w-page items-end gap-12 px-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] font-normal leading-none text-white">
              {isAdmin ? "Reservas del condominio" : "Mis reservas"}
            </h1>
            <p className="m-0 mt-4 text-lg text-white/70">
              {isAdmin ? "Gestión y bloqueo por mantenimiento" : (user?.condominioNombre ?? "")}
            </p>
            {!isAdmin && (
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCreate(true)}
                  disabled={espaciosDisponibles.length === 0}
                  className="btn btn-primary"
                >
                  + Nueva reserva
                </button>
                <Link
                  to="/espacios"
                  className="btn btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  Explorar espacios comunes
                </Link>
              </div>
            )}
          </div>
          {!loading && !errorCarga && <ProximaReserva reserva={proxima} />}
        </div>
      </header>

      <main className="mx-auto max-w-page px-6 pt-10 pb-20">
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-text text-white"
                  : "border border-muted text-text hover:bg-white"
              }`}
            >
              {tab.label}
              <span className="tabular-nums opacity-80">{conteo(tab.key)}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted">
            <div
              role="status"
              aria-label="Cargando reservas"
              className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
            />
            <p className="font-medium text-text">Cargando reservas desde el servidor...</p>
          </div>
        ) : errorCarga ? (
          <div role="alert" className="py-16 text-center text-muted">
            <p className="font-medium text-text">No pudimos cargar tus reservas</p>
            <p className="mt-1 text-sm">Revisa tu conexión e intenta de nuevo.</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void recargar();
              }}
              className="btn btn-primary mt-4"
            >
              Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p className="font-display text-3xl text-text">No hay reservas en esta categoría</p>
            <p className="mt-2 text-base">Crea una nueva reserva para comenzar.</p>
          </div>
        ) : activeTab === "todas" ? (
          <div className="flex flex-col gap-14">
            {proximas.length > 0 && (
              <section aria-labelledby="proximas-titulo">
                <h2
                  id="proximas-titulo"
                  className="m-0 mb-6 font-display text-3xl font-normal text-text"
                >
                  Próximas
                </h2>
                <div className="grid gap-6 lg:grid-cols-2">
                  {proximas.map((reserva) => (
                    <ReservaCard key={reserva.id} reserva={reserva} {...accionesTarjeta} />
                  ))}
                </div>
              </section>
            )}
            {historial.length > 0 && (
              <section aria-labelledby="historial-titulo">
                <h2
                  id="historial-titulo"
                  className="m-0 mb-2 font-display text-3xl font-normal text-text"
                >
                  Anteriores y canceladas
                </h2>
                <ul className="m-0 list-none p-0">
                  {historial.map((reserva) => (
                    <HistorialFila key={reserva.id} reserva={reserva} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {[...filtered].sort(porInicio).map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} {...accionesTarjeta} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreate && espaciosDisponibles.length > 0 && (
        <CreateModal
          espacios={espaciosDisponibles}
          procesando={procesando}
          onClose={() => setShowCreate(false)}
          onConfirm={handleCreateConfirm}
        />
      )}
      {cancelTargetReserva && (
        <CancelModal
          reserva={cancelTargetReserva}
          procesando={procesando}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
      {blockTarget && (
        <Modal titleId="bloquear-reserva-titulo" onClose={() => setBlockTarget(null)}>
          <h2 id="bloquear-reserva-titulo" className="font-display text-xl text-text mb-2">
            ¿Bloquear por mantenimiento?
          </h2>
          <p className="text-sm text-muted mb-6">
            Esta reserva quedará cancelada y el espacio aparecerá no disponible en el período
            correspondiente. La acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              data-autofocus
              onClick={cerrarDialogo}
              className="flex-1 border border-border text-text font-medium py-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleBlockConfirm}
              disabled={procesando}
              aria-busy={procesando}
              className="btn btn-primary flex-1 bg-alert-yellow text-text hover:bg-alert-yellow/90 disabled:opacity-60 disabled:cursor-wait"
            >
              {procesando ? "Bloqueando…" : "Confirmar bloqueo"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
