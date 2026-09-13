import { useState, useEffect } from "react";
import { gastos } from "../lib/data";
import { useAuth } from "../hooks/useAuth";
import { obtenerResumenGastos, type GastosResumen } from "../services/gastosApi";
import {
  IconDownload,
  IconDollar,
  IconBell,
  IconShield,
  IconHome,
  IconChevronRight,
} from "../components/icons/Icons";
import { FlipCard } from "../components/FlipCard";
import { PayModal } from "../components/gastos/PayModal";
import { DesgloseMensualCard } from "../components/gastos/DesgloseMensualCard";
import { HistorialPagosTable, type HistorialEntry } from "../components/gastos/HistorialPagosTable";
import { SituacionResidenteCard } from "../components/gastos/SituacionResidenteCard";

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto"];

interface UnidadEntry {
  unidad: string;
  estado: string;
  monto: string;
  colorClass: string;
  bgClass: string;
}

const historial: HistorialEntry[] = [
  {
    mes: "Agosto 2026",
    total: "$600.000",
    estado: "Al día",
    colorClass: "text-teal-600 bg-teal-600/10",
  },
  {
    mes: "Julio 2026",
    total: "$600.000",
    estado: "Al día",
    colorClass: "text-teal-600 bg-teal-600/10",
  },
  {
    mes: "Junio 2026",
    total: "$595.000",
    estado: "Al día",
    colorClass: "text-teal-600 bg-teal-600/10",
  },
  {
    mes: "Mayo 2026",
    total: "$595.000",
    estado: "Pagado",
    colorClass: "text-teal-600 bg-teal-600/10",
  },
  {
    mes: "Abril 2026",
    total: "$590.000",
    estado: "Pagado",
    colorClass: "text-teal-600 bg-teal-600/10",
  },
  {
    mes: "Marzo 2026",
    total: "$590.000",
    estado: "Pagado",
    colorClass: "text-teal-600 bg-teal-600/10",
  },
];

const unidades: UnidadEntry[] = [
  {
    unidad: "Apto 301 — Torre A",
    estado: "Al día",
    monto: "$0",
    colorClass: "text-teal-600 border-teal-600/20",
    bgClass: "bg-teal-50",
  },
  {
    unidad: "Apto 502 — Torre A",
    estado: "Pendiente",
    monto: "$600.000",
    colorClass: "text-yellow-500 border-yellow-500/20",
    bgClass: "bg-yellow-50",
  },
  {
    unidad: "Apto 108 — Torre B",
    estado: "Moroso",
    monto: "$1.800.000",
    colorClass: "text-rose-600 border-rose-600/20",
    bgClass: "bg-rose-50",
  },
  {
    unidad: "Apto 710 — Torre B",
    estado: "Al día",
    monto: "$0",
    colorClass: "text-teal-600 border-teal-600/20",
    bgClass: "bg-teal-50",
  },
  {
    unidad: "Apto 204 — Torre C",
    estado: "Al día",
    monto: "$0",
    colorClass: "text-teal-600 border-teal-600/20",
    bgClass: "bg-teal-50",
  },
];

const FLIP_CARD_DATA = [
  {
    title: "Desglose mensual",
    description: "Cada peso desglosado por categoría — portería, limpieza, jardín y más.",
    Icon: IconDollar,
  },
  {
    title: "Pago seguro",
    description: "WebPay, transferencia o tarjeta. Pagos procesados en segundos.",
    Icon: IconShield,
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
    body: "Recibe alertas automáticas antes del vencimiento y paga en segundos desde tu teléfono o computador. Historial de pagos siempre disponible para descargar en PDF. Mantente al día sin esfuerzo.",
    imgUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=700&h=500&fit=crop",
    imgRight: false,
  },
];

export default function Gastos() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [selectedMes, setSelectedMes] = useState("Agosto");
  const [showPayModal, setShowPayModal] = useState(false);
  const [paid, setPaid] = useState(false);
  const [resumen, setResumen] = useState<GastosResumen | null>(null);
  const [gastosEstado, setGastosEstado] = useState<"cargando" | "error" | "listo">("cargando");

  useEffect(() => {
    let active = true;
    async function cargarGastos() {
      try {
        const data = await obtenerResumenGastos();
        if (!active) return;
        setResumen(data);
        if (data.alDia) {
          setPaid(true);
        }
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

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <div className="bg-[#00201B] px-6 pt-[56px] pb-12">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-teal-300/70 tracking-[0.12em] uppercase mb-2.5">
            Finanzas del condominio
          </p>
          <h1 className="font-serif text-[clamp(32px,4vw,52px)] text-white leading-[1.1] mb-3 font-normal">
            Gastos comunes
          </h1>
          <p className="text-[17px] text-white/65 m-0 max-w-[540px] leading-[1.65]">
            {isAdmin
              ? "Gestiona los gastos comunes de todas las unidades. Edita montos, categorías y revisa el estado de deuda del condominio."
              : "Revisa y paga tus gastos comunes en línea. Desglose mensual transparente, historial completo y alertas automáticas."}
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto p-[40px_24px_80px]">
        {!isAdmin && (
          <SituacionResidenteCard
            estado={gastosEstado}
            paid={paid}
            onPay={() => setShowPayModal(true)}
            unidad={user?.unidad ? `Unidad ${user.unidad}` : undefined}
            monto={resumen ? resumen.totalPendiente : undefined}
            vencimiento={resumen?.proximoVencimiento}
          />
        )}

        <div className="grid grid-cols-2 gap-6 mb-7">
          <DesgloseMensualCard
            selectedMes={selectedMes}
            onSelectMes={setSelectedMes}
            meses={meses}
            gastos={gastos}
          />

          {isAdmin && (
            <div className="bg-white border border-slate-200 rounded-2xl p-7">
              <h3 className="font-serif text-[20px] text-[#00201B] m-0 mb-6 font-normal">
                Estado por unidad
              </h3>
              <div className="flex flex-col gap-2.5">
                {unidades.map((u) => (
                  <div
                    key={u.unidad}
                    className={`flex justify-between items-center py-3 px-3.5 rounded-[10px] border ${u.bgClass} ${u.colorClass.split(" ")[1]}`}
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-[#00201B]">{u.unidad}</div>
                      <div className="text-[12px] text-[#94A3B8]">
                        {u.estado === "Al día" ? "Sin deuda" : `Deuda: ${u.monto}`}
                      </div>
                    </div>
                    <span
                      className={`text-[12px] font-bold py-1 px-2.5 rounded-full ${u.colorClass.split(" ")[0]} ${u.bgClass}`}
                    >
                      {u.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <HistorialPagosTable historial={historial} />
      </div>

      <div className="bg-white py-20 px-6 border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-[480px] mx-auto mb-14">
            <p className="text-[11px] font-bold text-teal-600 tracking-[0.12em] uppercase mb-3">
              Ventajas del módulo
            </p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] text-[#00201B] leading-[1.2] m-0 mb-3.5 font-normal">
              Gestión clara, sin sorpresas
            </h2>
            <p className="text-[15px] text-slate-500 m-0">
              Diseñado para que cada residente y miembro del comité tenga visibilidad total.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {FLIP_CARD_DATA.map(({ title, description, Icon }) => (
              <FlipCard
                key={title}
                height={200}
                front={
                  <div className="bg-slate-50 rounded-xl border border-slate-200 h-full flex flex-col items-center justify-center gap-3.5 py-6 px-5 box-border">
                    <Icon className="w-8 h-8 text-teal-600" />
                    <span className="text-[15px] font-semibold text-[#00201B] text-center leading-[1.3]">
                      {title}
                    </span>
                  </div>
                }
                back={
                  <div className="bg-teal-600 rounded-xl h-full flex items-center justify-center py-6 px-5 box-border">
                    <p className="text-white text-[14px] leading-[1.6] m-0 text-center">
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
          className={`py-[72px] px-6 ${section.imgRight ? "bg-[#F8FAFB]" : "bg-white"}`}
        >
          <div
            className={`max-w-[1280px] mx-auto flex items-center gap-16 flex-wrap ${
              section.imgRight ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="flex-[1_1_400px]">
              <p className="text-[11px] font-bold text-teal-600 tracking-[0.12em] uppercase mb-3">
                Gastos comunes
              </p>
              <h2 className="font-serif text-[clamp(26px,3vw,40px)] text-[#00201B] m-0 mb-[18px] font-normal leading-[1.15]">
                {section.title}
              </h2>
              <p className="text-[16px] text-slate-500 leading-[1.75] m-0">{section.body}</p>
            </div>
            <div className="flex-[1_1_360px]">
              <img
                src={section.imgUrl}
                alt={section.title}
                className="w-full rounded-[18px] block shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="bg-[#00201B] py-14 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-wrap gap-6 justify-center">
          <a
            href="/gastos"
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl py-6 px-9 no-underline flex-[1_1_260px] max-w-[380px] transition-colors duration-200 hover:bg-white/10"
          >
            <IconHome className="w-7 h-7 text-teal-300 shrink-0" />
            <div>
              <div className="text-[13px] text-white/50 mb-1">¿Eres residente?</div>
              <div className="text-[16px] font-bold text-white">Paga tus gastos</div>
            </div>
            <IconChevronRight className="w-[18px] h-[18px] text-white/40 ml-auto" />
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-3 bg-teal-600/15 border border-teal-600/35 rounded-xl py-6 px-9 no-underline flex-[1_1_260px] max-w-[380px] transition-colors duration-200 hover:bg-teal-600/25"
          >
            <IconShield className="w-7 h-7 text-teal-300 shrink-0" />
            <div>
              <div className="text-[13px] text-white/50 mb-1">¿Eres del comité?</div>
              <div className="text-[16px] font-bold text-white">Ir al dashboard</div>
            </div>
            <IconChevronRight className="w-[18px] h-[18px] text-white/40 ml-auto" />
          </a>
        </div>
      </div>

      {showPayModal && (
        <PayModal
          onClose={() => setShowPayModal(false)}
          onConfirm={() => {
            setPaid(true);
            setShowPayModal(false);
          }}
        />
      )}
    </div>
  );
}
