import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { obtenerPanel } from "../services/panelApi";
import { obtenerSolicitudPropia } from "../services/condominiosApi";
import { listarEspacios } from "../services/espaciosApi";
import { obtenerResumenGastos } from "../services/gastosApi";
import { CHART_COLORS } from "../components/charts/chartColors";
import {
  IconCalendar,
  IconDollar,
  IconChevronRight,
  IconMessage,
  IconTrendingUp,
  IconPhone,
  IconUsers,
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

interface QuickAccessItem {
  label: string;
  category: string;
  icon: React.ReactNode;
  to: string;
}

// ── Fallback Static Data ──────────────────────────────────────────────────────

// Estado inicial sin datos: los valores reales llegan de panelApi y gastosApi.
const DEFAULT_KPIS: KpiCardData[] = [
  {
    id: "proxima-reserva",
    icon: <IconCalendar className="w-5 h-5 text-primary" />,
    title: "Próxima Reserva",
    value: "Sin reservas",
    subtitle: "No tienes reservas próximas",
    badge: { label: "Sin datos", variant: "blue" },
    actionUrl: "/reservas",
    actionText: "Ver reservas",
  },
  {
    id: "gastos-pendientes",
    icon: <IconDollar className="w-5 h-5 text-accent" />,
    title: "Gastos Comunes",
    value: "Sin información",
    subtitle: "Aún no hay gastos cargados",
    badge: { label: "Sin datos", variant: "blue" },
    actionUrl: "/gastos",
    actionText: "Ver gastos",
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
    category: "Desglose e historial",
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
    category: "Contactos de emergencia",
    icon: <IconPhone className="w-5 h-5" />,
    to: "/canales",
  },
  {
    label: "Control de Acceso",
    category: "Visitas",
    icon: <IconUsers className="w-5 h-5" />,
    to: "/visitas",
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
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${styles[variant]}`}
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
    <div className="flex flex-col justify-between rounded-lg border border-stone-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-[box-shadow,transform,background-color] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 relative overflow-hidden">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-md bg-stone-50 border border-stone-200/60 flex items-center justify-center">
            {card.icon}
          </div>
          <Badge label={card.badge.label} variant={card.badge.variant} />
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
          {card.title}
        </p>
        <p className="mt-1 font-display text-2xl font-normal text-text tabular-nums leading-tight">
          {card.value}
        </p>
        <p className="mt-1 font-body text-xs text-muted leading-relaxed">{card.subtitle}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
        <Link
          to={card.actionUrl}
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-accent transition-colors"
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

      <div className="mx-auto max-w-page relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {/* Top metadata badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono tracking-wider text-primary-on-dark uppercase mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-on-dark" />
              <span>FOLIO RESIDENCIAL ACTIVO</span>
              <span className="text-white/40">·</span>
              <span>{unidadDisplay}</span>
            </div>

            <h1 className="font-display text-[clamp(28px,4vw,44px)] font-normal text-white m-0 leading-tight">
              Buenos días, {primerNombre}
            </h1>
            <p className="mt-2 font-body text-sm text-white/70 font-light max-w-content">
              Bienvenido al portal de tu comunidad. Revisa tus gastos comunes, agenda tus reservas
              de quincho y gestiona tus visitas en tiempo real.
            </p>
          </div>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap gap-3 items-center">
            <Link to="/espacios" className="btn btn-primary btn-sm">
              <IconCalendar className="w-3.5 h-3.5" />
              <span>Reservar espacio</span>
            </Link>
            <Link
              to="/gastos"
              className="btn btn-secondary bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60 btn-sm"
            >
              <IconDollar className="w-3.5 h-3.5 text-primary-on-dark" />
              <span>Revisar gastos</span>
            </Link>
            <Link
              to="/visitas"
              className="btn btn-secondary bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60 btn-sm"
            >
              <IconUsers className="w-3.5 h-3.5 text-primary-on-dark" />
              <span>Visitas</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLinksDock({ links }: { links: QuickAccessItem[] }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-xl font-normal text-text m-0">Accesos Directos</h2>
        <p className="text-xs text-muted font-light mt-1">Servicios de tu comunidad a un clic</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="group flex flex-col items-start p-4 rounded-lg border border-stone-200/80 bg-white no-underline transition-[color,background-color,border-color,box-shadow] hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:border-stone-300"
          >
            <div className="w-8 h-8 rounded-md bg-teal-50 text-accent flex items-center justify-center mb-3 transition-transform group-hover:scale-105">
              {link.icon}
            </div>
            <span className="font-body text-xs font-semibold text-text group-hover:text-primary transition-colors">
              {link.label}
            </span>
            <span className="font-body text-xs text-muted font-light leading-tight mt-1">
              {link.category}
            </span>
          </Link>
        ))}
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
  const [kpis, setKpis] = useState<KpiCardData[]>(DEFAULT_KPIS);

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
        <section className="mx-auto max-w-content rounded-lg border border-border bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl text-text">Asignación pendiente</h1>
          <p className="mt-4 text-sm text-muted">
            Tu sesión está activa. Elige tu condominio y unidad; las funciones de la comunidad
            estarán disponibles cuando administración confirme tu asignación.
          </p>
          <Link to="/completar-registro" className="btn btn-primary mt-6">
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
        <div className="mx-auto flex max-w-page flex-col gap-10">
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
            {/* Left Column: Tablón Gazette */}
            <div className="flex flex-col gap-10">
              {/* Tablón Notices */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-normal text-text m-0">
                      Gaceta & Comunicados
                    </h2>
                    <p className="text-xs text-muted font-light mt-1">
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

                <p className="text-sm text-muted">Sin comunicados publicados.</p>
              </section>
            </div>

            {/* Right Column: Quick Access Dock */}
            <div className="flex flex-col gap-10">
              <QuickLinksDock links={QUICK_LINKS} />
            </div>
          </div>

          {/* ── Concierge Support Card (Bottom Banner) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-stone-200/80 bg-white p-6 shadow-sm">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                CONSERJERÍA & ASISTENCIA 24/7
              </span>
              <h3 className="font-display text-lg font-normal text-text m-0 mt-1">
                ¿Necesitas reportar una urgencia o consultar una encomienda?
              </h3>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/canales" className="btn btn-primary btn-sm bg-text text-white">
                <IconPhone className="w-3.5 h-3.5 text-primary-on-dark" />
                <span>Contactar conserjería</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
