import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { sileo } from "sileo";
import {
  obtenerResumenGastos,
  solicitarYDescargarPdfGastos,
  type GastosResumen,
} from "../services/gastosApi";
import { IconDownload } from "../components/icons/Icons";
import { DesgloseMensualCard } from "../components/gastos/DesgloseMensualCard";
import { HistorialPagosTable, type HistorialEntry } from "../components/gastos/HistorialPagosTable";
import { SituacionResidenteCard } from "../components/gastos/SituacionResidenteCard";
import {
  agruparPorPeriodo,
  desglosePeriodo,
  deudaPorUnidad,
  formatPesos,
} from "../utils/gastosResumen";

// Un solo matiz (la rampa teal del sistema) más neutros: los tramos se distinguen por
// luminosidad y por su etiqueta, no por un arcoíris. Ordenados para alternar claro y oscuro.
const COLORES_DESGLOSE = [
  "bg-text",
  "bg-primary",
  "bg-accent",
  "bg-primary-on-dark",
  "bg-muted",
  "bg-border",
];

export default function Gastos() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [selectedClave, setSelectedClave] = useState<string | null>(null);
  const [resumen, setResumen] = useState<GastosResumen | null>(null);
  const [gastosEstado, setGastosEstado] = useState<"cargando" | "error" | "listo">("cargando");

  // Todo se calcula con los gastos reales del BFF; sin gastos quedan listas vacías.
  const gastosBackend = resumen?.gastos ?? [];
  const periodos = agruparPorPeriodo(gastosBackend);
  const claveActiva = selectedClave ?? periodos[0]?.clave ?? "";
  const periodoActual = periodos.find((p) => p.clave === claveActiva);
  const desglose = desglosePeriodo(gastosBackend, claveActiva).map((d, i) => ({
    item: d.concepto,
    monto: formatPesos(d.monto),
    pct: d.pct,
    color: COLORES_DESGLOSE[i % COLORES_DESGLOSE.length],
  }));
  const historial: HistorialEntry[] = periodos.map((p) => ({
    mes: p.etiqueta,
    total: formatPesos(p.total),
    estado: p.pendiente > 0 ? "Pendiente" : "Pagado",
    colorClass: p.pendiente > 0 ? "bg-alert-yellow" : "bg-primary",
  }));
  const unidades = deudaPorUnidad(gastosBackend);

  useEffect(() => {
    let active = true;
    async function cargarGastos() {
      try {
        const data = await obtenerResumenGastos();
        if (!active) return;
        setResumen(data);
        setGastosEstado("listo");
      } catch {
        // No mostrar un saldo/fecha inventados: si no se pudo cargar, decirlo.
        if (active) setGastosEstado("error");
      }
    }
    void cargarGastos();
    return () => {
      active = false;
    };
  }, []);

  const handleDescargarPdf = (mes?: string) => {
    const mesObjetivo = mes ?? periodoActual?.etiqueta;
    void sileo.promise(
      solicitarYDescargarPdfGastos({
        unidadId: user?.unidad,
        mes: mesObjetivo,
      }),
      {
        loading: {
          title: "Generando comprobante PDF...",
          description: `Procesando comprobante de ${mesObjetivo} en segundo plano.`,
        },
        success: {
          title: "¡Comprobante listo!",
          description: "Tu PDF se ha descargado y enviamos una copia a tu correo.",
        },
        error: {
          title: "Error al generar comprobante",
          description: "No se pudo emitir el documento. Intenta nuevamente.",
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-text pt-14 pb-28">
        <div className="mx-auto max-w-page px-6">
          <h1 className="m-0 font-display text-[clamp(32px,4vw,48px)] font-normal leading-tight text-white">
            Gastos comunes
          </h1>
          {isAdmin ? (
            <>
              <p className="m-0 mt-3 max-w-content text-lg text-white/70">
                Gestiona los gastos comunes de todas las unidades. Edita montos, categorías y revisa
                el estado de deuda del condominio.
              </p>
              {gastosEstado === "error" && (
                <p role="alert" className="m-0 mt-6 text-base font-semibold text-white">
                  No pudimos cargar los gastos del condominio. Intenta más tarde.
                </p>
              )}
            </>
          ) : (
            <SituacionResidenteCard
              estado={gastosEstado}
              unidad={user?.unidad ? `Unidad ${user.unidad}` : undefined}
              monto={resumen ? resumen.totalPendiente : undefined}
              vencimiento={resumen?.proximoVencimiento}
            />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-page px-6 pb-24">
        <div className="relative -mt-16 grid items-start gap-8 lg:grid-cols-[7fr_5fr]">
          <DesgloseMensualCard
            periodos={periodos}
            selectedClave={claveActiva}
            onSelectPeriodo={setSelectedClave}
            gastos={desglose}
            total={formatPesos(periodoActual?.total ?? 0)}
          />

          {isAdmin ? (
            <section
              aria-labelledby="unidades-titulo"
              className="rounded-md bg-white p-8 shadow-md"
            >
              <h3
                id="unidades-titulo"
                className="m-0 mb-6 font-display text-2xl font-normal text-text"
              >
                Estado por unidad
              </h3>
              {unidades.length === 0 && (
                <p className="m-0 text-base text-muted">Sin unidades con gastos registrados.</p>
              )}
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {unidades.map((u) => {
                  const alDia = u.deuda === 0;
                  return (
                    <li
                      key={u.unidad}
                      className="flex items-center justify-between gap-4 rounded-sm border border-border px-4 py-3"
                    >
                      <div>
                        <div className="text-base font-semibold text-text">{u.unidad}</div>
                        <div className="text-sm text-muted">
                          {alDia ? "Sin deuda" : `Deuda: ${formatPesos(u.deuda)}`}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${alDia ? "bg-primary" : "bg-alert-yellow"}`}
                        />
                        {alDia ? "Al día" : "Con deuda"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <aside
              aria-labelledby="comprobante-titulo"
              className="rounded-md bg-accent p-8 lg:sticky lg:top-24"
            >
              <h3
                id="comprobante-titulo"
                className="m-0 font-display text-2xl font-normal text-white"
              >
                {periodoActual ? `Comprobante de ${periodoActual.etiqueta}` : "Comprobante"}
              </h3>
              <p className="m-0 mt-3 text-base text-white/80">
                {periodoActual
                  ? "Descarga en PDF el detalle de este período."
                  : "Cuando haya gastos registrados podrás descargar su comprobante."}
              </p>
              <button
                type="button"
                disabled={!periodoActual}
                onClick={() => handleDescargarPdf()}
                className="btn btn-secondary mt-6 w-full"
              >
                <IconDownload className="h-4 w-4" /> Descargar comprobante
              </button>
            </aside>
          )}
        </div>

        <div className="mt-20">
          <HistorialPagosTable historial={historial} onDescargarPdf={handleDescargarPdf} />
        </div>
      </main>
    </div>
  );
}
