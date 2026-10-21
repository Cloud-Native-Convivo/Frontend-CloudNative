import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { obtenerPanel } from "../services/panelApi";
import { obtenerSolicitudPropia } from "../services/condominiosApi";
import { listarEspacios } from "../services/espaciosApi";
import { obtenerResumenGastos } from "../services/gastosApi";
import { CHART_COLORS } from "../components/charts/chartColors";
import { QRModal } from "../components/visitas/QRModal";
import type { Visita } from "../components/visitas/types";
import {
  IconCalendar,
  IconDollar,
  IconMail,
  IconCheck,
  IconChevronRight,
  IconMessage,
  IconTrendingUp,
  IconPhone,
  IconUsers,
  IconAlertTriangle,
  IconBell,
} from "../components/icons/Icons";

const SparkAreaChart = lazy(() => import("../components/charts/SparkAreaChart"));

// ── Types ────────────────────────────────────────────────────────────────────

interface SparkPoint {
  v: number;
}

interface KpiCardData {
  id: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  badge: {
    label: string;
    variant: "green" | "yellow" | "blue";
  };
  actionUrl: string;
  actionText: string;
  spark?: SparkPoint[];
  sparkColor?: string;
}

interface NoticeCard {
  id: number;
  title: string;
  date: string;
  category: "Aviso" | "Comité" | "Comunidad" | "Urgente";
  excerpt: string;
}

interface QuickAccessItem {
  label: string;
  category: string;
  icon: React.ReactNode;
  to: string;
}

interface ActivityItem {
  id: number;
  icon: React.ReactNode;
  description: string;
  timestamp: string;
  iconBg: string;
  iconColor: string;
}

// ── Fallback Static Data ──────────────────────────────────────────────────────

const DEFAULT_KPIS: KpiCardData[] = [
  {
    id: "proxima-reserva",
    icon: <IconCalendar className="w-5 h-5 text-primary" />,
    title: "Próxima Reserva",
    value: "Quincho Los Aromos",
    subtitle: "Sáb 23 ago, 18:00 hrs",
    badge: { label: "Confirmada", variant: "green" },
    actionUrl: "/reservas",
    actionText: "Ver reserva",
    spark: [{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 4 }, { v: 3 }, { v: 5 }],
    sparkColor: CHART_COLORS.primary,
  },
  {
    id: "gastos-pendientes",
    icon: <IconDollar className="w-5 h-5 text-accent" />,
    title: "Gastos Comunes",
    value: "$65.000 CLP",
    subtitle: "Vence en 5 días",
    badge: { label: "Pendiente", variant: "yellow" },
    actionUrl: "/gastos",
    actionText: "Pagar en línea",
    spark: [{ v: 3 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 5 }, { v: 7 }],
    sparkColor: CHART_COLORS.accent,
  },
  {
    id: "incidentes-abiertos",
    icon: <IconAlertTriangle className="w-5 h-5 text-amber-600" />,
    title: "Incidentes Activos",
    value: "1 reporte",
    subtitle: "Filtración en plomería",
    badge: { label: "En revisión", variant: "yellow" },
    actionUrl: "/incidentes",
    actionText: "Ver seguimiento",
    spark: [{ v: 0 }, { v: 1 }, { v: 0 }, { v: 1 }, { v: 2 }, { v: 1 }, { v: 1 }, { v: 1 }],
    sparkColor: CHART_COLORS.alertYellow,
  },
  {
    id: "correspondencia",
    icon: <IconMail className="w-5 h-5 text-blue-600" />,
    title: "Correspondencia",
    value: "2 paquetes",
    subtitle: "En conserjería central",
    badge: { label: "Por retirar", variant: "blue" },
    actionUrl: "/canales",
    actionText: "Ver anexo",
    spark: [{ v: 1 }, { v: 0 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 2 }, { v: 2 }],
    sparkColor: CHART_COLORS.primary,
  },
];

const NOTICES: NoticeCard[] = [
  {
    id: 1,
    title: "Corte de agua programado — Mantención preventiva de bombas",
    date: "18 ago 2026",
    category: "Aviso",
    excerpt:
      "Se informa a los residentes de Torre A y B que el jueves 21 de agosto se realizará mantención general del sistema de bombas entre las 09:00 y las 14:00 hrs.",
  },
  {
    id: 2,
    title: "Votación de seguridad: Ampliación del circuito cerrado de cámaras",
    date: "15 ago 2026",
    category: "Comité",
    excerpt:
      "Con un 78% de quórum favorable, la asamblea aprobó la instalación de 8 cámaras adicionales de alta definición en accesos vehiculares y estacionamientos.",
  },
  {
    id: 3,
    title: "Torneo de Tenis y Pádel Primavera 2026 — Inscripciones abiertas",
    date: "12 ago 2026",
    category: "Comunidad",
    excerpt:
      "Ya se encuentran abiertas las inscripciones para el campeonato interno del condominio. Plazas limitadas por categoría; confirma tu participación antes del 25 de agosto.",
  },
];

const VISITAS_DEMO: Visita[] = [
  {
    id: "vis-1",
    nombre: "Carlos Fuentes",
    documento: "18.452.123-K",
    fecha: "2026-08-22",
    fechaDisplay: "Vie 22 ago",
    hora: "15:30",
    motivo: "Reunión de trabajo",
    estado: "confirmada",
    codigo: "VIS-8492-CF",
    unidad: "Torre A · Depto 402B",
  },
  {
    id: "vis-2",
    nombre: "Delivery Falabella",
    documento: "Empresa de Despacho",
    fecha: "2026-08-23",
    fechaDisplay: "Sáb 23 ago",
    hora: "10:00–14:00",
    motivo: "Entrega de encomienda",
    estado: "pendiente_qr",
    codigo: "DEL-3104-FB",
    unidad: "Torre A · Depto 402B",
  },
];

const QUICK_LINKS: QuickAccessItem[] = [
  {
    label: "Espacios Comunes",
    category: "Quinchos y piscina",
    icon: <IconCalendar className="w-5 h-5" />,
    to: "/espacios",
  },
  {
    label: "Gastos & Finanzas",
    category: "WebPay y boletas",
    icon: <IconDollar className="w-5 h-5" />,
    to: "/gastos",
  },
  {
    label: "Tablón Oficial",
    category: "Avisos del comité",
    icon: <IconMessage className="w-5 h-5" />,
    to: "/tablon",
  },
  {
    label: "Transparencia",
    category: "Balance de cuentas",
    icon: <IconTrendingUp className="w-5 h-5" />,
    to: "/dashboard",
  },
  {
    label: "Conserjería",
    category: "Anexo e intercom",
    icon: <IconPhone className="w-5 h-5" />,
    to: "/canales",
  },
  {
    label: "Control de Acceso",
    category: "Pases QR de visitas",
    icon: <IconUsers className="w-5 h-5" />,
    to: "/visitas",
  },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    icon: <IconCheck className="w-4 h-4" />,
    description: "Reserva confirmada — Quincho Los Aromos para Sáb 23 ago",
    timestamp: "Hace 2 horas",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    id: 2,
    icon: <IconDollar className="w-4 h-4" />,
    description: "Gasto común de junio pagado mediante WebPay — $58.500 CLP",
    timestamp: "Hace 3 días",
    iconBg: "bg-teal-100",
    iconColor: "text-accent",
  },
  {
    id: 3,
    icon: <IconBell className="w-4 h-4" />,
    description: "Nuevo comunicado publicado: Resultados votación de cámaras",
    timestamp: "Hace 4 días",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    id: 4,
    icon: <IconUsers className="w-4 h-4" />,
    description: "Pase QR emitido para Carlos Fuentes (Acceso Viernes)",
    timestamp: "Hace 5 días",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, variant }: { label: string; variant: "green" | "yellow" | "blue" }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    yellow: "bg-amber-50 text-amber-800 border-amber-200/80",
    blue: "bg-blue-50 text-blue-800 border-blue-200/80",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${styles[variant]}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          variant === "green"
            ? "bg-emerald-500"
            : variant === "yellow"
              ? "bg-amber-500"
              : "bg-blue-500"
        }`}
      />
      {label}
    </span>
  );
}

function KpiCard({ card }: { card: KpiCardData }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-[box-shadow,transform,background-color] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 relative overflow-hidden">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-center">
            {card.icon}
          </div>
          <Badge label={card.badge.label} variant={card.badge.variant} />
        </div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
          {card.title}
        </p>
        <p className="mt-1 font-display text-2xl font-normal text-text tabular-nums leading-tight">
          {card.value}
        </p>
        <p className="mt-1 font-body text-xs text-muted leading-relaxed">{card.subtitle}</p>
      </div>

      <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between">
        <Link
          to={card.actionUrl}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors"
        >
          <span>{card.actionText}</span>
          <IconChevronRight className="w-3.5 h-3.5" />
        </Link>
        {card.spark && (
          <div className="w-20 h-6">
            <Suspense fallback={<div className="h-full w-full bg-stone-50" />}>
              <SparkAreaChart
                data={card.spark}
                title={card.title}
                sparkColor={card.sparkColor ?? CHART_COLORS.primary}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardHeroHeader({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const primerNombre = user?.nombre.split(" ")[0] ?? "Residente";
  const unidadDisplay =
    user?.unidad && user.unidad !== "Sin unidad asignada" ? user.unidad : "Unidad no asignada";

  return (
    <div className="bg-text text-white px-6 py-10 md:py-12 md:px-10 border-b border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {/* Top metadata badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono tracking-wider text-primary-on-dark uppercase mb-3.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-on-dark" />
              <span>FOLIO RESIDENCIAL ACTIVO</span>
              <span className="text-white/40">·</span>
              <span>{unidadDisplay}</span>
            </div>

            <h1 className="font-display text-[clamp(28px,4vw,44px)] font-normal text-white m-0 leading-tight">
              Buenos días, {primerNombre}
            </h1>
            <p className="mt-1.5 font-body text-sm text-white/70 font-light max-w-xl">
              Bienvenido al portal de tu comunidad. Revisa tus gastos comunes, agenda tus reservas
              de quincho y gestiona tus visitas en tiempo real.
            </p>
          </div>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap gap-2.5 items-center">
            <Link
              to="/espacios"
              className="inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold py-2.5 px-4 rounded-xl no-underline shadow-[0_4px_16px_rgba(13,148,136,0.25)] transition-[box-shadow,transform,background-color] hover:bg-emerald-600 hover:-translate-y-0.5"
            >
              <IconCalendar className="w-3.5 h-3.5" />
              <span>Reservar espacio</span>
            </Link>
            <Link
              to="/gastos"
              className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded-xl no-underline border border-white/20 transition-[color,background-color,border-color,box-shadow] hover:bg-white/20"
            >
              <IconDollar className="w-3.5 h-3.5 text-primary-on-dark" />
              <span>Pagar gastos</span>
            </Link>
            <Link
              to="/visitas"
              className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded-xl no-underline border border-white/20 transition-[color,background-color,border-color,box-shadow] hover:bg-white/20"
            >
              <IconUsers className="w-3.5 h-3.5 text-primary-on-dark" />
              <span>Pase de visita</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoticeTile({ notice }: { notice: NoticeCard }) {
  const categoryStyles = {
    Aviso: "bg-blue-50 text-blue-700 border-blue-200/60",
    Comité: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
    Comunidad: "bg-purple-50 text-purple-700 border-purple-200/60",
    Urgente: "bg-rose-50 text-rose-700 border-rose-200/60",
  };

  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-stone-200/80 bg-white p-5 transition-[color,background-color,border-color,box-shadow] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-stone-300">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider border ${
            categoryStyles[notice.category] ?? "bg-stone-50 text-stone-700 border-stone-200"
          }`}
        >
          {notice.category}
        </span>
        <span className="font-mono text-xs text-muted">{notice.date}</span>
      </div>
      <h3 className="font-display text-base font-normal text-text m-0 leading-snug">
        {notice.title}
      </h3>
      <p className="font-body text-xs leading-relaxed text-muted font-light m-0 line-clamp-2">
        {notice.excerpt}
      </p>
    </article>
  );
}

function VisitasPassesSection({
  visits,
  onVerQr,
}: {
  visits: Visita[];
  onVerQr: (visita: Visita) => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-normal text-text m-0">
            Pases de Visita Próximos
          </h2>
          <p className="text-xs text-muted font-light mt-0.5">
            Accesos temporales registrados en conserjería
          </p>
        </div>
        <Link
          to="/visitas"
          className="font-body text-xs font-semibold text-primary hover:text-accent flex items-center gap-1"
        >
          <span>Gestionar pases</span>
          <IconChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visits.map((vis) => (
          <div
            key={vis.id}
            className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-[color,background-color,border-color,box-shadow] hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-muted tracking-wider uppercase">
                  {vis.fechaDisplay}
                </span>
                <Badge
                  label={vis.estado === "confirmada" ? "Confirmada" : "Pendiente QR"}
                  variant={vis.estado === "confirmada" ? "green" : "yellow"}
                />
              </div>
              <h3 className="font-display text-base font-normal text-text m-0">{vis.nombre}</h3>
              <p className="font-body text-xs text-muted font-light mt-0.5">
                {vis.hora} · {vis.motivo}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="font-mono text-[11px] text-stone-400 font-semibold">
                {vis.codigo}
              </span>
              <button
                type="button"
                onClick={() => onVerQr(vis)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-semibold text-text hover:bg-primary hover:text-white hover:border-primary transition-[color,background-color,border-color,box-shadow] cursor-pointer"
              >
                <span>Ver QR</span>
                <IconChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickLinksDock({ links }: { links: QuickAccessItem[] }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-xl font-normal text-text m-0">Accesos Directos</h2>
        <p className="text-xs text-muted font-light mt-0.5">Servicios de tu comunidad a un clic</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="group flex flex-col items-start p-3.5 rounded-2xl border border-stone-200/80 bg-white no-underline transition-[color,background-color,border-color,box-shadow] hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:border-stone-300"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-accent flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105">
              {link.icon}
            </div>
            <span className="font-body text-xs font-semibold text-text group-hover:text-primary transition-colors">
              {link.label}
            </span>
            <span className="font-body text-[11px] text-muted font-light leading-tight mt-0.5">
              {link.category}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RecentActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-xl font-normal text-text m-0">Actividad Reciente</h2>
        <p className="text-xs text-muted font-light mt-0.5">Historial cronológico de tu unidad</p>
      </div>

      <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
        <ul className="flex flex-col gap-4 list-none m-0 p-0">
          {items.map((item, idx) => (
            <li key={item.id} className="flex items-start gap-3 relative">
              {idx < items.length - 1 && (
                <div className="absolute top-7 left-3.5 bottom-0 w-[1px] bg-stone-200 -z-0" />
              )}
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center relative z-10 ${item.iconBg} ${item.iconColor}`}
              >
                {item.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-body text-xs font-medium text-text leading-snug m-0">
                  {item.description}
                </p>
                <p className="font-mono text-[11px] text-muted m-0">{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────

export default function ResidenteDashboard() {
  const { user, setUser } = useAuth();
  const tieneAsignacionPrevia = Boolean(
    user?.condominioId && user?.unidad && user.unidad !== "Sin unidad asignada",
  );
  const [asignacionVerificada, setAsignacionVerificada] = useState(tieneAsignacionPrevia);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [kpis, setKpis] = useState<KpiCardData[]>(DEFAULT_KPIS);
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null);

  useEffect(() => {
    let activo = true;
    obtenerSolicitudPropia()
      .then((solicitud) => {
        if (!activo || !user) return;
        if (solicitud?.estado === "aprobada") {
          const condominioId = String(solicitud.condominio_id);
          if (user.condominioId !== condominioId || user.unidad !== solicitud.unidad) {
            setUser({ ...user, condominioId, unidad: solicitud.unidad });
          }
          setAsignacionVerificada(true);
        } else if (solicitud) {
          setAsignacionVerificada(false);
        }
      })
      .catch(() => {
        if (activo && !tieneAsignacionPrevia) setAsignacionVerificada(false);
      });
    return () => {
      activo = false;
    };
  }, [user, setUser, tieneAsignacionPrevia]);

  // Fetch datos reales del BFF/API si están disponibles
  useEffect(() => {
    if (
      !asignacionVerificada ||
      !user?.condominioId ||
      !user.unidad ||
      user.unidad === "Sin unidad asignada"
    )
      return;
    let active = true;
    async function fetchDashboardData() {
      try {
        const [panelData, espaciosData, gastosResumen] = await Promise.all([
          obtenerPanel().catch(() => null),
          listarEspacios().catch(() => []),
          obtenerResumenGastos().catch(() => null),
        ]);

        if (!active) return;

        const espaciosMap = new Map<number, string>();
        if (Array.isArray(espaciosData)) {
          espaciosData.forEach((e) => espaciosMap.set(e.id, e.nombre));
        }

        setKpis((prev) =>
          prev.map((k) => {
            if (k.id === "proxima-reserva" && panelData && Array.isArray(panelData.reservas)) {
              const ahora = Date.now();
              const proxima = panelData.reservas
                .filter(
                  (r) => r.estado !== "cancelada" && new Date(r.fecha_inicio).getTime() >= ahora,
                )
                .sort(
                  (a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime(),
                )[0];

              if (proxima) {
                const fecha = new Date(proxima.fecha_inicio);
                const subtitle =
                  fecha.toLocaleDateString("es-CL", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }) +
                  `, ${fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} hrs`;
                const nombreEspacio =
                  espaciosMap.get(proxima.espacio_id) ?? `Espacio #${proxima.espacio_id}`;

                return {
                  ...k,
                  value: nombreEspacio,
                  subtitle,
                  badge: {
                    label: proxima.estado === "confirmada" ? "Confirmada" : "Pendiente",
                    variant: proxima.estado === "confirmada" ? "green" : "yellow",
                  },
                };
              }
            }

            if (k.id === "gastos-pendientes" && gastosResumen) {
              if (gastosResumen.alDia) {
                return {
                  ...k,
                  value: "$0 CLP",
                  subtitle: "Al día — Sin deuda",
                  badge: { label: "Al día", variant: "green" },
                };
              }
              return {
                ...k,
                value: `$${gastosResumen.totalPendiente.toLocaleString("es-CL")} CLP`,
                subtitle: gastosResumen.proximoVencimiento
                  ? `Vence ${gastosResumen.proximoVencimiento}`
                  : "Pendiente de pago",
                badge: { label: "Pendiente", variant: "yellow" },
              };
            }

            return k;
          }),
        );
      } catch {
        // Fallback elegante a datos estáticos
      }
    }
    void fetchDashboardData();
    return () => {
      active = false;
    };
  }, [asignacionVerificada, user?.condominioId, user?.unidad]);

  if (
    !asignacionVerificada ||
    !user?.condominioId ||
    !user.unidad ||
    user.unidad === "Sin unidad asignada"
  ) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-6 py-20">
        <section className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl text-text">Asignación pendiente</h1>
          <p className="mt-4 text-sm text-muted">
            Tu sesión está activa. Elige tu condominio y unidad; las funciones de la comunidad
            estarán disponibles cuando administración confirme tu asignación.
          </p>
          <Link
            to="/completar-registro"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white"
          >
            Elegir condominio
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="flex flex-col w-full font-body bg-[#faf9f6] min-h-screen">
      {/* ── Page Header ── */}
      <DashboardHeroHeader user={user} />

      {/* ── Content Area ── */}
      <main className="px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {/* ── Notification Banner (Editorial Style) ── */}
          {!notifDismissed && (
            <div className="flex items-center justify-between rounded-2xl border border-amber-200/90 bg-amber-50/90 px-5 py-3.5 shadow-sm text-text">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                  <IconBell className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs tracking-wider uppercase text-amber-900 block">
                    Avisos del Comité
                  </span>
                  <span className="font-body text-xs text-amber-800 font-light">
                    Tienes 3 comunicados nuevos pendientes de lectura en el tablón oficial.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/tablon"
                  className="font-body text-xs font-bold text-amber-900 underline underline-offset-2 hover:no-underline"
                >
                  Ver todos
                </Link>
                <button
                  type="button"
                  onClick={() => setNotifDismissed(true)}
                  aria-label="Cerrar aviso de notificaciones"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-amber-700 hover:bg-amber-200/60 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* ── KPI Cards ── */}
          <section>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((card) => (
                <KpiCard key={card.id} card={card} />
              ))}
            </div>
          </section>

          {/* ── Main Content Grid (Asymmetric Editorial Spread) ── */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_1fr]">
            {/* Left Column: Tablón Gazette + Guest Passes */}
            <div className="flex flex-col gap-10">
              {/* Tablón Notices */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-normal text-text m-0">
                      Gaceta & Comunicados
                    </h2>
                    <p className="text-xs text-muted font-light mt-0.5">
                      Publicaciones oficiales del comité de administración
                    </p>
                  </div>
                  <Link
                    to="/tablon"
                    className="font-body text-xs font-semibold text-primary hover:text-accent flex items-center gap-1"
                  >
                    <span>Ver tablón</span>
                    <IconChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex flex-col gap-3.5">
                  {NOTICES.map((n) => (
                    <NoticeTile key={n.id} notice={n} />
                  ))}
                </div>
              </section>

              {/* Visitas & QR Passes */}
              <VisitasPassesSection
                visits={VISITAS_DEMO}
                onVerQr={(visita) => setSelectedVisita(visita)}
              />
            </div>

            {/* Right Column: Quick Access Dock + Recent Activity */}
            <div className="flex flex-col gap-10">
              <QuickLinksDock links={QUICK_LINKS} />
              <RecentActivityFeed items={RECENT_ACTIVITY} />
            </div>
          </div>

          {/* ── Concierge Support Card (Bottom Banner) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                CONSERJERÍA & ASISTENCIA 24/7
              </span>
              <h3 className="font-display text-lg font-normal text-text m-0 mt-0.5">
                ¿Necesitas reportar una urgencia o consultar una encomienda?
              </h3>
              <p className="font-body text-xs text-muted font-light m-0 mt-1">
                La caseta de conserjería se encuentra conectada en el intercomunicador anexo 100.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/canales"
                className="inline-flex items-center gap-2 rounded-xl bg-text text-white text-xs font-semibold px-4 py-2.5 transition-colors hover:bg-accent no-underline"
              >
                <IconPhone className="w-3.5 h-3.5 text-primary-on-dark" />
                <span>Contactar conserjería</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Interactive QR Modal ── */}
      {selectedVisita && (
        <QRModal visita={selectedVisita} onClose={() => setSelectedVisita(null)} />
      )}
    </div>
  );
}
