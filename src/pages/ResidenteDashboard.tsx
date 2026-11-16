import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { obtenerPanel } from "../services/panelApi";
import { obtenerCondominios, obtenerSolicitudPropia } from "../services/condominiosApi";
import { listarEspacios } from "../services/espaciosApi";
import { obtenerResumenGastos } from "../services/gastosApi";
import {
  IconCalendar,
  IconDollar,
  IconChevronRight,
  IconPhone,
  IconUsers,
} from "../components/icons/Icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface KpiCardData {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  badge: {
    label: string;
    variant: "green" | "yellow" | "blue";
  };
  actionUrl: string;
  actionText: string;
}

interface QuickAccessItem {
  label: string;
  category: string;
  to: string;
}

// ── Fallback Static Data ──────────────────────────────────────────────────────

// Estado inicial sin datos: los valores reales llegan de panelApi y gastosApi.
const DEFAULT_KPIS: KpiCardData[] = [
  {
    id: "proxima-reserva",
    title: "Próxima Reserva",
    value: "Sin reservas",
    subtitle: "No tienes reservas próximas",
    badge: { label: "Sin datos", variant: "blue" },
    actionUrl: "/reservas",
    actionText: "Ver reservas",
  },
  {
    id: "gastos-pendientes",
    title: "Gastos Comunes",
    value: "Sin información",
    subtitle: "Aún no hay gastos cargados",
    badge: { label: "Sin datos", variant: "blue" },
    actionUrl: "/gastos",
    actionText: "Ver gastos",
  },
];

// Solo destinos a los que un residente puede entrar: /dashboard es de administración.
const QUICK_LINKS: QuickAccessItem[] = [
  { label: "Espacios Comunes", category: "Reserva por horas", to: "/espacios" },
  { label: "Gastos & Finanzas", category: "Desglose e historial", to: "/gastos" },
  { label: "Tablón Oficial", category: "Avisos del comité", to: "/tablon" },
  { label: "Conserjería", category: "Contactos de emergencia", to: "/canales" },
  { label: "Visitas", category: "Control de acceso", to: "/visitas" },
];

// ── Sub-components ───────────────────────────────────────────────────────────

/** El estado va siempre como texto además del punto: el color solo no alcanza. */
function Estado({ label, variant }: { label: string; variant: "green" | "yellow" | "blue" }) {
  const punto = { green: "bg-primary", yellow: "bg-alert-yellow", blue: "bg-muted" }[variant];
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${punto}`} />
      {label}
    </span>
  );
}

function KpiCard({ card }: { card: KpiCardData }) {
  return (
    <article className="flex flex-col justify-between gap-10 rounded-md border border-border bg-white p-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 text-sm font-semibold text-muted">{card.title}</h2>
          <Estado label={card.badge.label} variant={card.badge.variant} />
        </div>
        <p className="m-0 mt-6 font-display text-[clamp(36px,4.5vw,56px)] font-normal leading-none text-text tabular-nums">
          {card.value}
        </p>
        <p className="m-0 mt-3 text-base text-muted">{card.subtitle}</p>
      </div>
      <Link
        to={card.actionUrl}
        className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-accent hover:underline"
      >
        <span>{card.actionText}</span>
        <IconChevronRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

/** Misma portada que Reservas, Gastos y Espacios; el bloque de la derecha es la placa de la unidad. */
function DashboardHeroHeader({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const primerNombre = user?.nombre.split(" ")[0] ?? "Residente";
  const botonSobreOscuro =
    "btn btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10";

  return (
    <header className="bg-text pt-14 pb-16">
      <div className="mx-auto grid max-w-page items-end gap-12 px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] font-normal leading-none text-white">
            Hola, {primerNombre}
          </h1>
          <p className="m-0 mt-4 max-w-content text-lg text-white/70">
            Tus reservas, tus gastos comunes y tus visitas en un solo lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/espacios" className="btn btn-primary">
              <IconCalendar className="h-4 w-4" />
              <span>Reservar espacio</span>
            </Link>
            <Link to="/gastos" className={botonSobreOscuro}>
              <IconDollar className="h-4 w-4 text-primary-on-dark" />
              <span>Revisar gastos</span>
            </Link>
            <Link to="/visitas" className={botonSobreOscuro}>
              <IconUsers className="h-4 w-4 text-primary-on-dark" />
              <span>Visitas</span>
            </Link>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-white/30 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-12 lg:pt-0">
          <p className="m-0 text-sm text-white/70">Tu unidad</p>
          <p className="m-0 mt-3 font-display text-[clamp(36px,4.5vw,64px)] leading-none text-white">
            {user?.unidad}
          </p>
          {user?.condominioNombre && (
            <p className="m-0 mt-4 text-lg text-primary-on-dark">{user.condominioNombre}</p>
          )}
        </div>
      </div>
    </header>
  );
}

function QuickLinksDock({ links }: { links: QuickAccessItem[] }) {
  return (
    <section>
      <h2 className="m-0 font-display text-3xl font-normal text-text">Accesos Directos</h2>
      <ul className="m-0 mt-6 list-none border-t border-border p-0">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="group flex min-h-16 items-center justify-between gap-4 border-b border-border py-4 no-underline"
            >
              <span>
                <span className="block font-display text-2xl text-text transition-colors group-hover:text-accent">
                  {link.label}
                </span>
                <span className="block text-sm text-muted">{link.category}</span>
              </span>
              <IconChevronRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
            </Link>
          </li>
        ))}
      </ul>
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
  // Si el panel o los gastos no cargan, los KPI por defecto ("Sin reservas") no son un dato real: se avisa.
  const [errorDatos, setErrorDatos] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerSolicitudPropia()
      .then(async (solicitud) => {
        if (!activo || !user) return;
        if (solicitud?.estado === "aprobada") {
          const condominioId = String(solicitud.condominio_id);
          const cambio = user.condominioId !== condominioId || user.unidad !== solicitud.unidad;
          // Si cambió el condominio, el nombre guardado es del anterior: se busca el real.
          const condominioNombre =
            user.condominioId === condominioId
              ? user.condominioNombre
              : (await obtenerCondominios().catch(() => [])).find(
                  (c) => String(c.id) === condominioId,
                )?.nombre;
          // Tras el await, todo setter queda detrás de `activo` (el efecto pudo re-ejecutarse).
          if (activo) {
            if (cambio) {
              setUser({ ...user, condominioId, condominioNombre, unidad: solicitud.unidad });
            }
            setAsignacionVerificada(true);
          }
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
        let fallo = false;
        const alFallar = () => {
          fallo = true;
          return null;
        };
        const [panelData, espaciosData, gastosResumen] = await Promise.all([
          obtenerPanel().catch(alFallar),
          // Sin los nombres solo se pierde la etiqueta: cae a "Espacio #id", no es un dato inventado.
          listarEspacios().catch(() => []),
          obtenerResumenGastos().catch(alFallar),
        ]);

        if (!active) return;
        setErrorDatos(fallo);

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
                  subtitle: "Al día, sin deuda",
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
        if (active) setErrorDatos(true);
      }
    }
    void fetchDashboardData();
    return () => {
      active = false;
    };
  }, [asignacionVerificada, user?.condominioId, user?.unidad, intento]);

  if (
    !asignacionVerificada ||
    !user?.condominioId ||
    !user.unidad ||
    user.unidad === "Sin unidad asignada"
  ) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20">
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
    <div className="flex min-h-screen w-full flex-col bg-gray-50 font-body">
      <DashboardHeroHeader user={user} />

      <main className="mx-auto w-full max-w-page px-6 pt-10 pb-20">
        <div className="flex flex-col gap-14">
          <section aria-label="Resumen">
            {errorDatos && (
              <div
                role="alert"
                className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-white p-4 text-sm text-text"
              >
                <span>No pudimos cargar algunos datos de tu panel. Intenta de nuevo.</span>
                <button
                  type="button"
                  onClick={() => setIntento((n) => n + 1)}
                  className="btn btn-secondary btn-sm"
                >
                  Reintentar
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {kpis.map((card) => (
                <KpiCard key={card.id} card={card} />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.25fr_1fr]">
            <section>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="m-0 font-display text-3xl font-normal text-text">
                  Gaceta & Comunicados
                </h2>
                <Link
                  to="/tablon"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  <span>Ver tablón</span>
                  <IconChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="m-0 mt-2 text-base text-muted">
                Publicaciones oficiales del comité de administración
              </p>
              <p className="m-0 mt-6 border-t border-border pt-6 text-base text-text">
                Sin comunicados publicados.
              </p>
            </section>

            <QuickLinksDock links={QUICK_LINKS} />
          </div>

          <section className="flex flex-col justify-between gap-6 rounded-md bg-text p-8 sm:flex-row sm:items-center">
            <h2 className="m-0 max-w-content font-display text-2xl font-normal text-white">
              ¿Necesitas reportar una urgencia o consultar una encomienda?
            </h2>
            <Link to="/canales" className="btn btn-primary shrink-0">
              <IconPhone className="h-4 w-4" />
              <span>Contactar conserjería</span>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
