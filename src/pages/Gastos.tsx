import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { sileo } from "sileo";
import {
  obtenerResumenGastos,
  solicitarYDescargarPdfGastos,
  type GastosResumen,
} from "../services/gastosApi";
import {
  IconDownload,
  IconDollar,
  IconBell,
  IconShield,
  IconHome,
} from "../components/icons/Icons";
import { FlipCard } from "../components/FlipCard";
import { DesgloseMensualCard } from "../components/gastos/DesgloseMensualCard";
import { HistorialPagosTable, type HistorialEntry } from "../components/gastos/HistorialPagosTable";
import { SituacionResidenteCard } from "../components/gastos/SituacionResidenteCard";
import {
  agruparPorPeriodo,
  desglosePeriodo,
  deudaPorUnidad,
  formatPesos,
} from "../utils/gastosResumen";

const COLORES_DESGLOSE = [
  "bg-teal-600",
  "bg-yellow-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-slate-500",
];

const FLIP_CARD_DATA = [
  {
    title: "Desglose mensual",
    description: "Cada peso desglosado por categoría — portería, limpieza, jardín y más.",
    Icon: IconDollar,
  },
  {
    title: "Alertas automáticas",
    description: "Notificación 5 días antes del vencimiento para nunca atrasarte.",
    Icon: IconBell,
  },
  {
    title: "Historial PDF",
    description: "Descarga tu historial de pagos en PDF en cualquier momento.",
    Icon: IconDownload,
  },
];

const alternatingSections = [
  {
    title: "Transparencia",
    body: "Cada gasto común se desglosa en categorías claras: portería, limpieza, jardín, mantenimiento y más. Sin letra chica ni cobros sorpresa. Tú y el comité tienen acceso a los mismos datos en tiempo real.",
    imgUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=700&h=500&fit=crop",
    imgRight: true,
  },
  {
    title: "Sin morosidad",
    body: "Recibe alertas automáticas antes del vencimiento. Historial de pagos siempre disponible para descargar en PDF. Mantente al día sin esfuerzo.",
    imgUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=700&h=500&fit=crop",
    imgRight: false,
  },
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
    colorClass:
      p.pendiente > 0 ? "text-yellow-500 bg-yellow-500/10" : "text-teal-600 bg-teal-600/10",
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
      <div className="bg-text px-6 pt-14 pb-12">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-teal-300/70 tracking-wide mb-3">
            Finanzas del condominio
          </p>
          <h1 className="font-serif text-[clamp(32px,4vw,52px)] text-white leading-[1.1] mb-3 font-normal">
            Gastos comunes
          </h1>
          <p className="text-lg text-white/65 m-0 max-w-content leading-[1.65]">
            {isAdmin
              ? "Gestiona los gastos comunes de todas las unidades. Edita montos, categorías y revisa el estado de deuda del condominio."
              : "Revisa tus gastos comunes. Desglose mensual transparente e historial completo."}
          </p>
        </div>
      </div>

      <div className="max-w-page mx-auto p-[40px_24px_80px]">
        {!isAdmin && (
          <SituacionResidenteCard
            estado={gastosEstado}
            unidad={user?.unidad ? `Unidad ${user.unidad}` : undefined}
            monto={resumen ? resumen.totalPendiente : undefined}
            vencimiento={resumen?.proximoVencimiento}
          />
        )}
        {isAdmin && gastosEstado === "error" && (
          <p className="text-sm text-red-600 font-semibold mb-5">
            No pudimos cargar los gastos del condominio. Intenta más tarde.
          </p>
        )}

        <div className="grid grid-cols-2 gap-6 mb-7">
          <DesgloseMensualCard
            periodos={periodos}
            selectedClave={claveActiva}
            onSelectPeriodo={setSelectedClave}
            gastos={desglose}
            total={formatPesos(periodoActual?.total ?? 0)}
          />

          {isAdmin && (
            <div className="bg-white border border-slate-200 rounded-lg p-7">
              <h3 className="font-serif text-xl text-text m-0 mb-6 font-normal">
                Estado por unidad
              </h3>
              {unidades.length === 0 && (
                <p className="text-sm text-slate-400 m-0">Sin unidades con gastos registrados.</p>
              )}
              <div className="flex flex-col gap-3">
                {unidades.map((u) => {
                  const alDia = u.deuda === 0;
                  return (
                    <div
                      key={u.unidad}
                      className={`flex justify-between items-center py-3 px-4 rounded-md border ${
                        alDia
                          ? "bg-teal-50 border-teal-600/20"
                          : "bg-yellow-50 border-yellow-500/20"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-text">{u.unidad}</div>
                        <div className="text-xs text-slate-400">
                          {alDia ? "Sin deuda" : `Deuda: ${formatPesos(u.deuda)}`}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold py-1 px-3 rounded-full ${
                          alDia ? "text-teal-600 bg-teal-50" : "text-yellow-500 bg-yellow-50"
                        }`}
                      >
                        {alDia ? "Al día" : "Con deuda"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <HistorialPagosTable historial={historial} onDescargarPdf={handleDescargarPdf} />
      </div>

      <div className="bg-white py-20 px-6 border-t border-slate-200">
        <div className="max-w-page mx-auto">
          <div className="text-center max-w-narrow mx-auto mb-14">
            <p className="text-xs font-bold text-teal-600 tracking-wide mb-3">
              Ventajas del módulo
            </p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] text-text leading-[1.2] m-0 mb-4 font-normal">
              Gestión clara, sin sorpresas
            </h2>
            <p className="text-base text-slate-500 m-0">
              Diseñado para que cada residente y miembro del comité tenga visibilidad total.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {FLIP_CARD_DATA.map(({ title, description, Icon }) => (
              <FlipCard
                key={title}
                height={200}
                front={
                  <div className="bg-slate-50 rounded-md border border-slate-200 h-full flex flex-col items-center justify-center gap-4 py-6 px-5 box-border">
                    <Icon className="w-8 h-8 text-teal-600" />
                    <span className="text-base font-semibold text-text text-center leading-[1.3]">
                      {title}
                    </span>
                  </div>
                }
                back={
                  <div className="bg-teal-600 rounded-md h-full flex items-center justify-center py-6 px-5 box-border">
                    <p className="text-white text-sm leading-[1.6] m-0 text-center">
                      {description}
                    </p>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>

      {alternatingSections.map((section) => (
        <div
          key={section.title}
          className={`py-18 px-6 ${section.imgRight ? "bg-slate-50" : "bg-white"}`}
        >
          <div
            className={`max-w-page mx-auto flex items-center gap-16 flex-wrap ${
              section.imgRight ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="flex-[1_1_400px]">
              <p className="text-xs font-bold text-teal-600 tracking-wide mb-3">Gastos comunes</p>
              <h2 className="font-serif text-[clamp(26px,3vw,40px)] text-text m-0 mb-5 font-normal leading-[1.15]">
                {section.title}
              </h2>
              <p className="text-base text-slate-500 leading-[1.75] m-0">{section.body}</p>
            </div>
            <div className="flex-[1_1_360px]">
              <img
                src={section.imgUrl}
                alt={section.title}
                className="w-full rounded-lg block shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="bg-text py-14 px-6">
        <div className="max-w-page mx-auto flex flex-wrap gap-6 justify-center">
          <a
            href="/gastos"
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-md py-6 px-9 no-underline flex-[1_1_260px] max-w-narrow transition-colors duration-200 hover:bg-white/10"
          >
            <IconHome className="w-7 h-7 text-teal-300 shrink-0" />
            <div>
              <div className="text-sm text-white/50 mb-1">¿Eres residente?</div>
              <div className="text-base font-bold text-white">Revisa tus gastos</div>
            </div>
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-3 bg-teal-600/15 border border-teal-600/35 rounded-md py-6 px-9 no-underline flex-[1_1_260px] max-w-narrow transition-colors duration-200 hover:bg-teal-600/25"
          >
            <IconShield className="w-7 h-7 text-teal-300 shrink-0" />
            <div>
              <div className="text-sm text-white/50 mb-1">¿Eres del comité?</div>
              <div className="text-base font-bold text-white">Ir al dashboard</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
