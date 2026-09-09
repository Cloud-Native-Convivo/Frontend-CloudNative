import { Fragment, useState } from "react";
import { IconCheck, IconX } from "../components/icons/Icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanTier {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  badge?: string;
  highlight: boolean;
  desc: string;
  cta: string;
}

interface FeatureRow {
  category: string;
  features: {
    label: string;
    basico: boolean | string;
    comunidad: boolean | string;
    enterprise: boolean | string;
  }[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS: PlanTier[] = [
  {
    id: "basico",
    name: "Básico",
    monthlyPrice: 0,
    annualPrice: 0,
    highlight: false,
    desc: "Para comunidades pequeñas que quieren digitalizar sin inversión.",
    cta: "Comenzar gratis",
  },
  {
    id: "comunidad",
    name: "Comunidad",
    monthlyPrice: 19900,
    annualPrice: 14900,
    badge: "Más popular",
    highlight: true,
    desc: "Todo lo que necesita un condominio moderno. Sin límites.",
    cta: "Comenzar ahora",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    highlight: false,
    desc: "Para conjuntos multi-torre con miles de residentes.",
    cta: "Hablar con ventas",
  },
];

const FEATURE_ROWS: FeatureRow[] = [
  {
    category: "Unidades y acceso",
    features: [
      {
        label: "Unidades incluidas",
        basico: "Hasta 30",
        comunidad: "Hasta 150",
        enterprise: "Ilimitadas",
      },
      {
        label: "Multi-torre / multi-edificio",
        basico: false,
        comunidad: false,
        enterprise: true,
      },
      {
        label: "Acceso por roles",
        basico: true,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "SSO (inicio de sesión único)",
        basico: false,
        comunidad: false,
        enterprise: true,
      },
    ],
  },
  {
    category: "Reservas",
    features: [
      {
        label: "Espacios para reservar",
        basico: "2 espacios",
        comunidad: "Ilimitados",
        enterprise: "Ilimitados",
      },
      {
        label: "Reservas por mes",
        basico: "50",
        comunidad: "Sin límite",
        enterprise: "Sin límite",
      },
      {
        label: "Pago en línea (WebPay)",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Código QR de confirmación",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Gastos comunes",
    features: [
      {
        label: "Emisión mensual de gastos",
        basico: "Manual",
        comunidad: "Automatizada",
        enterprise: "Automatizada",
      },
      {
        label: "Desglose por categoría",
        basico: true,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Pago en línea (WebPay)",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Alertas de vencimiento",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Historial exportable PDF",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Tablón y comunicación",
    features: [
      {
        label: "Tablón digital de avisos",
        basico: true,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Notificaciones push",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Segmentación por torre",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Confirmación de asistencia",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Historial ilimitado",
        basico: "3 meses",
        comunidad: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Dashboard y transparencia",
    features: [
      {
        label: "Dashboard de transparencia",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Boleta adjunta por gasto",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Exportación PDF para asambleas",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "API e integraciones externas",
        basico: false,
        comunidad: false,
        enterprise: true,
      },
    ],
  },
  {
    category: "Canales de seguridad",
    features: [
      {
        label: "Directorio de contactos",
        basico: true,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Llamada directa a conserjería",
        basico: true,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Banner de emergencias activo",
        basico: true,
        comunidad: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Registro fotográfico",
    features: [
      {
        label: "Bitácora fotográfica",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Foto antes/después",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Vinculado al dashboard",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Almacenamiento",
        basico: "—",
        comunidad: "10 GB",
        enterprise: "Ilimitado",
      },
    ],
  },
  {
    category: "Soporte",
    features: [
      {
        label: "Soporte por correo",
        basico: true,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Soporte prioritario 24/7",
        basico: false,
        comunidad: true,
        enterprise: true,
      },
      {
        label: "Administrador asignado",
        basico: false,
        comunidad: false,
        enterprise: true,
      },
      {
        label: "Onboarding dedicado",
        basico: false,
        comunidad: false,
        enterprise: true,
      },
      {
        label: "SLA garantizado",
        basico: false,
        comunidad: false,
        enterprise: true,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <td className="px-5 py-3 text-center">
        <div className="inline-flex w-[22px] h-[22px] rounded-full bg-teal-100 items-center justify-center">
          <IconCheck className="w-3 h-3 text-[#005047]" />
        </div>
      </td>
    );
  if (value === false)
    return (
      <td className="px-5 py-3 text-center">
        <div className="inline-flex w-[22px] h-[22px] rounded-full bg-slate-100 items-center justify-center">
          <IconX className="w-3 h-3 text-slate-300" />
        </div>
      </td>
    );
  return <td className="px-5 py-3 text-center text-[13px] text-slate-500 font-medium">{value}</td>;
}

function formatPrice(p: number | null, isAnnual: boolean) {
  if (p === null) return "A medida";
  if (p === 0) return "Gratis";
  const val = isAnnual ? p - 5000 : p;
  return `$${val.toLocaleString("es-CL")}`;
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Precios() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Hero */}
      <div className="bg-[#00201B] px-6 pt-20 pb-[72px] text-center">
        <p className="text-[11px] font-bold text-teal-300/70 tracking-[0.12em] uppercase mb-4">
          Planes y precios
        </p>
        <h1 className="font-serif text-[clamp(34px,5vw,60px)] text-white leading-[1.1] m-0 mb-4 font-normal">
          Simple y sin sorpresas
        </h1>
        <p className="text-[17px] text-white/60 leading-[1.7] mx-auto mb-9 max-w-[480px]">
          Sin costos ocultos ni instalaciones. Empieza gratis y escala cuando tu comunidad lo
          necesite.
        </p>

        {/* Toggle mensual/anual */}
        <div className="inline-flex items-center gap-[14px] bg-white/5 rounded-full px-4 py-2 border border-white/10">
          <span
            className={`text-[13px] transition-colors duration-200 ${annual ? "text-white/45 font-normal" : "text-white font-semibold"}`}
          >
            Mensual
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            aria-label="Cambiar entre plan mensual y anual"
            aria-pressed={annual}
            className={`w-11 h-6 rounded-xl cursor-pointer border-none relative transition-colors duration-[250ms] ${annual ? "bg-teal-600" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-all duration-[250ms] block ${annual ? "left-[22px]" : "left-[2px]"}`}
            />
          </button>
          <span
            className={`text-[13px] transition-colors duration-200 ${annual ? "text-white font-semibold" : "text-white/45 font-normal"}`}
          >
            Anual <span className="text-[11px] text-teal-300 font-bold ml-1">–25%</span>
          </span>
        </div>
      </div>

      {/* Tier cards */}
      <div className="max-w-[1200px] -mt-12 mx-auto px-6 pb-[72px]">
        <div className="price-cards grid grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => {
            const price = formatPrice(plan.monthlyPrice, annual);
            const period =
              plan.monthlyPrice === null
                ? ""
                : plan.monthlyPrice === 0
                  ? ""
                  : annual
                    ? "/mes facturado anual"
                    : "/mes";
            return (
              <div
                key={plan.id}
                className={`relative rounded-[20px] ${
                  plan.highlight
                    ? "bg-teal-600 border border-teal-600 p-[40px_32px] shadow-[0_24px_72px_rgba(13,148,136,0.3)] -translate-y-2"
                    : "bg-white border border-slate-200 p-8 shadow-[0_2px_20px_rgba(0,0,0,0.05)]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#005047] text-[11px] font-extrabold px-3.5 py-1 rounded-full border border-teal-100 whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    {plan.badge}
                  </div>
                )}

                <div
                  className={`text-[13px] font-bold mb-2 tracking-[0.04em] ${plan.highlight ? "text-white/75" : "text-slate-400"}`}
                >
                  {plan.name}
                </div>
                <div className="mb-2">
                  <span
                    className={`font-serif text-[46px] leading-none ${plan.highlight ? "text-white" : "text-[#00201B]"}`}
                  >
                    {price}
                  </span>
                  {period && (
                    <span
                      className={`text-[13px] ml-1 ${plan.highlight ? "text-white/55" : "text-slate-400"}`}
                    >
                      {period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[13px] leading-[1.6] m-0 mb-7 ${plan.highlight ? "text-white/60" : "text-slate-500"}`}
                >
                  {plan.desc}
                </p>

                <button
                  className={`w-full p-[13px] text-[14px] font-bold rounded-[10px] cursor-pointer transition-opacity duration-200 border-none hover:opacity-85 ${plan.highlight ? "bg-white text-teal-600" : "bg-[#00201B] text-white"}`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature comparison table */}
      {/* Feature comparison table */}
      <div className="max-w-[1200px] mx-auto px-6 pb-[100px]">
        <div className="text-center mb-12">
          <h2 className="font-serif text-[clamp(26px,3vw,38px)] text-[#00201B] leading-[1.2] m-0 mb-2.5 font-normal">
            Comparación completa
          </h2>
          <p className="text-[15px] text-slate-500 m-0">
            Todo lo que incluye cada plan, sin letras chicas.
          </p>
        </div>

        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-5 px-6 text-[12px] font-bold text-slate-400 uppercase tracking-[0.08em]">
                    Funcionalidad
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className={`text-center p-5 text-[14px] font-bold w-[160px] ${p.highlight ? "text-teal-600" : "text-[#00201B]"}`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((group, gi) => (
                  <Fragment key={`group-${gi}`}>
                    <tr>
                      <td
                        colSpan={4}
                        className={`pt-4 px-6 pb-2 text-[11px] font-extrabold text-teal-600 uppercase tracking-[0.1em] bg-slate-50 ${gi > 0 ? "border-t border-slate-200" : ""}`}
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.features.map((feat, fi) => (
                      <tr
                        key={`${gi}-${fi}`}
                        className={`border-b border-slate-100 ${fi % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                      >
                        <td className="py-3 px-6 text-[13px] text-[#00201B]">{feat.label}</td>
                        <FeatureCell value={feat.basico} />
                        <FeatureCell value={feat.comunidad} />
                        <FeatureCell value={feat.enterprise} />
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA banner */}
      <section className="bg-gradient-to-br from-teal-600 to-[#005047] py-[72px] px-6 text-center">
        <h2 className="font-serif text-[clamp(26px,3.5vw,42px)] text-white m-0 mb-3.5 font-normal">
          ¿Tienes dudas sobre qué plan elegir?
        </h2>
        <p className="text-[16px] text-white/70 m-0 mb-8">
          Nuestro equipo te ayuda a elegir el plan ideal para tu condominio — sin compromiso.
        </p>
        <button className="bg-white text-[#005047] font-bold text-[15px] py-3.5 px-9 rounded-[10px] border-none cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          Hablar con ventas
        </button>
      </section>
    </div>
  );
}
