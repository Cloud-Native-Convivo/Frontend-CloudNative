import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { obtenerPanel } from "../services/panelApi";

const SparkAreaChart = lazy(() => import("../components/charts/SparkAreaChart"));

// ── Types ────────────────────────────────────────────────────────────────────

interface SparkPoint {
  v: number;
}

interface KpiCardProps {
  id: string;
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  badge: {
    label: string;
    variant: "green" | "yellow" | "blue";
  };
  spark?: SparkPoint[];
  sparkColor?: string;
}

interface NoticeCard {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

interface Visit {
  id: number;
  nombre: string;
  fecha: string;
  estado: "Confirmada" | "Pendiente QR";
}

interface ActivityItem {
  id: number;
  icon: string;
  description: string;
  timestamp: string;
  color: string;
}

interface QuickLink {
  label: string;
  icon: string;
  to: string;
  bg: string;
  iconColor: string;
}

// ── Sub-components ───────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  green: "bg-primary/15 text-primary",
  yellow: "bg-alert-yellow/20 text-text",
  blue: "bg-blue-100 text-blue-700",
};

function Badge({ label, variant }: { label: string; variant: "green" | "yellow" | "blue" }) {
  const styles = BADGE_STYLES;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}
    >
      {variant === "green" && <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />}
      {variant === "yellow" && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-alert-yellow" />
      )}
      {label}
    </span>
  );
}

function KpiCard({
  icon,
  title,
  value,
  subtitle,
  badge,
  spark,
  sparkColor = "#0D9488",
}: KpiCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm overflow-hidden relative">
      <div className="flex items-start justify-between">
        <span className="text-2xl leading-none">{icon}</span>
        <Badge label={badge.label} variant={badge.variant} />
      </div>
      <div>
        <p className="font-body text-xs font-medium uppercase tracking-wide text-muted">{title}</p>
        <p className="mt-1 font-display text-xl font-semibold text-text">{value}</p>
        <p className="mt-0.5 font-body text-sm text-muted">{subtitle}</p>
      </div>
      {spark && (
        <div className="h-10 -mx-5 -mb-5 mt-1">
          <Suspense fallback={<div className="h-full w-full bg-slate-50" />}>
            <SparkAreaChart data={spark} title={title} sparkColor={sparkColor} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

function NoticeTile({ notice }: { notice: NoticeCard }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-body text-xs font-semibold text-primary">
          {notice.category}
        </span>
        <span className="font-body text-xs text-muted">{notice.date}</span>
      </div>
      <h3 className="font-display text-base font-semibold text-text">{notice.title}</h3>
      <p className="font-body text-sm leading-relaxed text-muted line-clamp-2">{notice.excerpt}</p>
    </div>
  );
}

// ── Static data (fallback si GET /api/v1/panel no responde) ────────────────────

const DEFAULT_KPIS: KpiCardProps[] = [
  {
    id: "proxima-reserva",
    icon: "📅",
    title: "Próxima reserva",
    value: "Quincho Los Aromos",
    subtitle: "Sáb 23 ago, 18:00 hrs",
    badge: { label: "Confirmada", variant: "green" },
    spark: [{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 4 }, { v: 3 }, { v: 5 }],
    sparkColor: "#0D9488",
  },
  {
    id: "gastos-pendientes",
    icon: "💰",
    title: "Gastos pendientes",
    value: "$65.000 CLP",
    subtitle: "Vence en 5 días",
    badge: { label: "Pendiente", variant: "yellow" },
    spark: [{ v: 3 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 5 }, { v: 7 }],
    sparkColor: "#005047",
  },
  {
    id: "incidentes-abiertos",
    icon: "⚠",
    title: "Incidentes abiertos",
    value: "1 incidente",
    subtitle: "Filtr. desde plomería",
    badge: { label: "En revisión", variant: "yellow" },
    spark: [{ v: 0 }, { v: 1 }, { v: 0 }, { v: 1 }, { v: 2 }, { v: 1 }, { v: 1 }, { v: 1 }],
    sparkColor: "#EAB308",
  },
  {
    id: "correspondencia",
    icon: "📬",
    title: "Correspondencia",
    value: "2 paquetes",
    subtitle: "Esperando retiro",
    badge: { label: "Pendiente retiro", variant: "yellow" },
    spark: [{ v: 1 }, { v: 0 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 2 }, { v: 2 }],
    sparkColor: "#0D9488",
  },
];

const DEFAULT_UNREAD_COUNT = 3;

const notices: NoticeCard[] = [
  {
    id: 1,
    title: "Corte de agua programado — Torre A",
    date: "18 ago 2026",
    category: "Aviso",
    excerpt:
      "Se informa a los residentes de Torre A que el jueves 21 de agosto habrá un corte de agua potable entre las 09:00 y las 14:00 hrs por mantención de la red.",
  },
  {
    id: 2,
    title: "Resultados votación: nuevas cámaras de seguridad",
    date: "15 ago 2026",
    category: "Comité",
    excerpt:
      "Con un 78% de aprobación, la asamblea aprobó la instalación de 8 cámaras adicionales en estacionamientos y accesos perimetrales.",
  },
  {
    id: 3,
    title: "Torneos de tenis — inscripciones abiertas",
    date: "12 ago 2026",
    category: "Comunidad",
    excerpt:
      "Ya están abiertas las inscripciones para el torneo de tenis interno del condominio. Plazas limitadas, inscríbete antes del 25 de agosto.",
  },
];

const visits: Visit[] = [
  {
    id: 1,
    nombre: "Carlos Fuentes",
    fecha: "Vie 22 ago, 15:30",
    estado: "Confirmada",
  },
  {
    id: 2,
    nombre: "Delivery Falabella",
    fecha: "Sáb 23 ago, 10:00–14:00",
    estado: "Pendiente QR",
  },
];

const quickLinks: QuickLink[] = [
  {
    label: "Espacios",
    icon: "🏠",
    to: "/espacios",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Gastos",
    icon: "💳",
    to: "/gastos",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Tablón",
    icon: "📋",
    to: "/tablon",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Dashboard",
    icon: "📊",
    to: "/dashboard",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    label: "Canales",
    icon: "💬",
    to: "/canales",
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    label: "Registro",
    icon: "📝",
    to: "/registro",
    bg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

const activity: ActivityItem[] = [
  {
    id: 1,
    icon: "✓",
    description: "Reserva confirmada — Quincho Los Aromos, Sáb 23 ago",
    timestamp: "Hace 2 horas",
    color: "bg-primary text-white",
  },
  {
    id: 2,
    icon: "💳",
    description: "Gasto común de julio pagado — $58.500 CLP",
    timestamp: "Hace 3 días",
    color: "bg-blue-500 text-white",
  },
  {
    id: 3,
    icon: "📢",
    description: "Nuevo aviso del comité: Resultados votación cámaras",
    timestamp: "Hace 4 días",
    color: "bg-alert-yellow text-text",
  },
  {
    id: 4,
    icon: "🚪",
    description: "Visita registrada — Carlos Fuentes, Vie 22 ago",
    timestamp: "Hace 5 días",
    color: "bg-slate-400 text-white",
  },
];

// ── Page component ────────────────────────────────────────────────────────────

export default function ResidenteDashboard() {
  const { user } = useAuth();
  const [notifDismissed, setNotifDismissed] = useState(false);
  const unreadCount = DEFAULT_UNREAD_COUNT;
  const [kpis, setKpis] = useState<KpiCardProps[]>(DEFAULT_KPIS);

  // GET /api/v1/panel (TD-26) solo agrega reservas y gastos -- no cubre
  // notices/visits/activity ni las otras 3 KPIs, esas siguen siendo datos
  // de demo hasta que existan endpoints propios. Acá solo se actualiza la
  // KPI "Próxima reserva" con la reserva futura más cercana.
  useEffect(() => {
    let active = true;
    async function fetchPanel() {
      try {
        const data = await obtenerPanel();
        if (!active || !Array.isArray(data.reservas)) return;

        const ahora = Date.now();
        const proxima = data.reservas
          .filter((r) => r.estado !== "cancelada" && new Date(r.fecha_inicio).getTime() >= ahora)
          .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())[0];
        if (!proxima) return;

        const fecha = new Date(proxima.fecha_inicio);
        const subtitle = fecha.toLocaleDateString("es-CL", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }) + `, ${fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} hrs`;

        setKpis((prev) =>
          prev.map((k) =>
            k.id === "proxima-reserva"
              ? {
                  ...k,
                  value: `Espacio #${proxima.espacio_id}`,
                  subtitle,
                  badge: {
                    label: proxima.estado === "confirmada" ? "Confirmada" : "Pendiente",
                    variant: proxima.estado === "confirmada" ? "green" : "yellow",
                  },
                }
              : k,
          ),
        );
      } catch {
        // Fallback elegante a los datos de demo si el BFF no está disponible
      }
    }
    void fetchPanel();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-0 font-body">
      {/* ── Page header ── */}
      <div className="bg-text px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-3xl font-semibold text-white md:text-4xl">
            Buenos días, {user.nombre.split(" ")[0]}
          </h1>
          <p className="mt-1 font-body text-sm text-white/60">{user.unidad}</p>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/espacios"
              className="rounded-full border border-white/40 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Reservar espacio
            </Link>
            <Link
              to="/gastos"
              className="rounded-full border border-white/40 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Pagar gastos
            </Link>
            <a
              href="#incidentes"
              className="rounded-full border border-white/40 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Reportar incidente
            </a>
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="bg-slate-50 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {/* ── Notifications banner ── */}
          {!notifDismissed && unreadCount > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-alert-yellow px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-text" aria-hidden="true">
                  🔔
                </span>
                <span className="font-body text-sm font-semibold text-text">
                  {unreadCount} notificaciones no leídas
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/tablon"
                  className="font-body text-sm font-semibold text-text underline underline-offset-2 hover:no-underline"
                >
                  Ver todas
                </Link>
                <button
                  onClick={() => setNotifDismissed(true)}
                  aria-label="Cerrar notificaciones"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-text/60 transition-colors hover:bg-text/10 hover:text-text"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* ── Main content grid ── */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Left column (wider) */}
            <div className="flex flex-col gap-8 md:col-span-2">
              {/* Tablón notices */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-text">
                    Últimas publicaciones del tablón
                  </h2>
                  <Link
                    to="/tablon"
                    className="font-body text-sm font-medium text-primary hover:underline"
                  >
                    Ver todas →
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {notices.map((notice) => (
                    <NoticeTile key={notice.id} notice={notice} />
                  ))}
                </div>
              </section>

              {/* Visitas próximas */}
              <section id="incidentes">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-text">Visitas próximas</h2>
                  <Link
                    to="/visitas"
                    className="font-body text-sm font-medium text-primary hover:underline"
                  >
                    Gestionar →
                  </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-white">
                  <table className="w-full font-body text-sm">
                    <thead>
                      <tr className="border-b border-border bg-slate-50 text-left">
                        <th className="px-4 py-3 font-semibold text-muted">Nombre</th>
                        <th className="px-4 py-3 font-semibold text-muted">Fecha</th>
                        <th className="px-4 py-3 font-semibold text-muted">Estado</th>
                        <th className="px-4 py-3 font-semibold text-muted">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((visit, i) => (
                        <tr
                          key={visit.id}
                          className={i < visits.length - 1 ? "border-b border-border" : ""}
                        >
                          <td className="px-4 py-3 font-medium text-text">{visit.nombre}</td>
                          <td className="px-4 py-3 text-muted">{visit.fecha}</td>
                          <td className="px-4 py-3">
                            {visit.estado === "Confirmada" ? (
                              <Badge label="Confirmada" variant="green" />
                            ) : (
                              <Badge label="Pendiente QR" variant="yellow" />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-primary hover:text-primary">
                              Ver QR
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-8">
              {/* Accesos rápidos */}
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold text-text">
                  Accesos rápidos
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-center transition-shadow hover:shadow-sm"
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${link.bg} ${link.iconColor}`}
                      >
                        {link.icon}
                      </span>
                      <span className="font-body text-xs font-semibold text-text">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Actividad reciente */}
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold text-text">
                  Actividad reciente
                </h2>
                <div className="rounded-xl border border-border bg-white p-4">
                  <ul className="flex flex-col gap-4">
                    {activity.map((item, i) => (
                      <li key={item.id} className="flex items-start gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${item.color}`}
                        >
                          {item.icon}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <p className="font-body text-sm leading-snug text-text">
                            {item.description}
                          </p>
                          <p className="font-body text-xs text-muted">{item.timestamp}</p>
                        </div>
                        {i < activity.length - 1 && (
                          <span className="absolute" aria-hidden="true" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-text">
                ¿Tienes dudas sobre los gastos?
              </h3>
              <p className="mt-0.5 font-body text-sm text-muted">
                Revisa el detalle de gastos comunes y el registro de mantenciones.
              </p>
            </div>
            <Link
              to="/gastos"
              className="shrink-0 rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              Ver gastos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
