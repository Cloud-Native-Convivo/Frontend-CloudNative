import { useState, useEffect, startTransition } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { rutaPrincipalPorRol } from "../auth/sesion";
import {
  IconCalendar,
  IconDollar,
  IconMessage,
  IconHome,
  IconShield,
  IconCamera,
  IconTrendingUp,
  IconCheck,
  IconChevronRight,
  IconPhone,
  IconUsers,
} from "../components/icons/Icons";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface ModuloTab {
  id: string;
  num: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  path: string;
  headline: string;
  body: string;
  points: string[];
  specs: { label: string; value: string }[];
  img: string;
  imgAlt: string;
}

interface StepItem {
  num: string;
  kicker: string;
  titulo: string;
  desc: string;
  tag: string;
}

interface TrustBadge {
  icon: React.ReactNode;
  text: string;
  highlight?: string;
}

// ─── Data Definitions ─────────────────────────────────────────────────────────

const MODULOS: ModuloTab[] = [
  {
    id: "espacios",
    num: "01",
    label: "Espacios Comunes",
    category: "AMENITIES & QUINCHOS",
    icon: <IconCalendar className="w-4 h-4" />,
    path: "/espacios",
    img: "https://images.unsplash.com/photo-1763479142280-675629f6db27?w=900&h=620&fit=crop&auto=format",
    imgAlt: "Piscina y áreas verdes de un condominio moderno listas para reservar",
    headline: "Reserva espacios comunes en segundos, sin cuadernos de conserjería",
    body: "Disponibilidad garantizada en tiempo real para quinchos, piscina, sala de juegos y cowork. Paga de inmediato mediante WebPay o cárgalo a tu cuenta de gastos.",
    points: [
      "7 espacios equipados con aforo y normas visibles",
      "Confirmación instantánea con pase de acceso QR",
      "Cancelación sin penalización hasta 24 hrs antes",
    ],
    specs: [
      { label: "Aforo Promedio", value: "25 personas" },
      { label: "Confirmación", value: "Tiempo Real" },
      { label: "Medio de Pago", value: "WebPay / Cargo" },
    ],
  },
  {
    id: "gastos",
    num: "02",
    label: "Gastos & Finanzas",
    category: "CONCILIACIÓN & PAGOS",
    icon: <IconDollar className="w-4 h-4" />,
    path: "/gastos",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&h=620&fit=crop&auto=format",
    imgAlt: "Persona revisando el desglose de gastos comunes en una pantalla digital",
    headline: "Cuentas claras y pago en línea para cada copropietario",
    body: "Desglose mensual ítem por ítem, comprobante fiscal descargable y alertas automáticas antes del corte de suministro o fecha de vencimiento.",
    points: [
      "Emisión transparente categorizada por torre y prorrateo",
      "Integración directa con WebPay Plus y tarjetas bancarias",
      "Descarga de comprobante de pago con validez para asamblea",
    ],
    specs: [
      { label: "Prorrateo", value: "Ley 21.442" },
      { label: "Pasarela", value: "WebPay Plus" },
      { label: "Historial", value: "Exportable PDF" },
    ],
  },
  {
    id: "tablon",
    num: "03",
    label: "Tablón Comunitario",
    category: "COMUNICACIÓN & AVISOS",
    icon: <IconMessage className="w-4 h-4" />,
    path: "/tablon",
    img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&h=620&fit=crop&auto=format",
    imgAlt: "Cartelera digital y anuncios comunitarios modernos",
    headline: "El diario mural físico reemplazado por avisos prioritarios",
    body: "Información oficial del comité, convocatorias a asamblea, cortes programados de servicios y anuncios vecinales sin cadenas informales ni spam.",
    points: [
      "Avisos clasificados: Mantención, Comité, Comunidad y Urgente",
      "Confirmación de asistencia digital para asambleas anuales",
      "Historial de comunicados auditable y permanente",
    ],
    specs: [
      { label: "Canal", value: "Oficial Comité" },
      { label: "Filtros", value: "Por Torre/Piso" },
      { label: "Interacción", value: "Sin Ruido" },
    ],
  },
  {
    id: "dashboard",
    num: "04",
    label: "Transparencia Contable",
    category: "AUDITORÍA & FONDOS",
    icon: <IconTrendingUp className="w-4 h-4" />,
    path: "/dashboard",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=620&fit=crop&auto=format",
    imgAlt: "Gráficos financieros con desglose de cuentas y conciliación",
    headline: "Cada peso del condominio con boleta y factura verificable",
    body: "Panel financiero centralizado accesible para todos los residentes. Visualiza fondos de reserva, mantenciones ejecutadas y morosidad general sin secretos.",
    points: [
      "Gráfico de evolución de egresos mensuales",
      "Boleta o factura digitalizada adjunta a cada egreso",
      "Cuentas auditables bajo la nueva Ley de Copropiedad",
    ],
    specs: [
      { label: "Respaldo", value: "100% Boletas" },
      { label: "Fondo Reserva", value: "Conciliado" },
      { label: "Auditoría", value: "Comité y Vecinos" },
    ],
  },
  {
    id: "canales",
    num: "05",
    label: "Conserjería & Emergencias",
    category: "SEGURIDAD & RED",
    icon: <IconShield className="w-4 h-4" />,
    path: "/canales",
    img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=900&h=620&fit=crop&auto=format",
    imgAlt: "Lobby residencial moderno y estación de conserjería",
    headline: "Contacto inmediato con conserjería y protocolos de sector",
    body: "Directorio institucional conectado 24/7. Llamada directa a caseta de seguridad, Plan Cuadrante de Carabineros, Bomberos y cuadrillas técnicas.",
    points: [
      "Acceso directo a conserjería central (Intercomunicador 100)",
      "Cuadrante y patrullaje municipal geolocalizado",
      "Protocolos de emergencia ante corte o sismo",
    ],
    specs: [
      { label: "Disponibilidad", value: "24/7/365" },
      { label: "Plan Cuadrante", value: "Asignado" },
      { label: "Marcado", value: "1 Clic" },
    ],
  },
  {
    id: "registro",
    num: "06",
    label: "Bitácora de Mantención",
    category: "CONTROL TÉCNICO",
    icon: <IconCamera className="w-4 h-4" />,
    path: "/registro",
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&h=620&fit=crop&auto=format",
    imgAlt: "Revisión técnica y mantención preventiva de equipamiento",
    headline: "Evidencia fotográfica verificable de cada trabajo en el edificio",
    body: "Historial de mantenciones preventivas y correctivas con registro antes/después, fecha, empresa responsable y aprobación del comité.",
    points: [
      "Registro gráfico por bomba, ascensor y sala de calderas",
      "Enlace directo al ítem de gasto respectivo en el dashboard",
      "Trazabilidad técnica frente a inspecciones municipales",
    ],
    specs: [
      { label: "Evidencia", value: "Fotos Antes/Después" },
      { label: "Trazabilidad", value: "Por Proveedor" },
      { label: "Validación", value: "Comité Administrador" },
    ],
  },
];

const PASOS: StepItem[] = [
  {
    num: "01",
    kicker: "IDENTIDAD RESIDENCIAL",
    titulo: "Valida tu unidad",
    desc: "Ingresa tu correo institucional o personal e indica torre, piso y número de departamento para aprobación del comité.",
    tag: "Aprobación 24h",
  },
  {
    num: "02",
    kicker: "AMENITIES EN TIEMPO REAL",
    titulo: "Reserva tus espacios",
    desc: "Explora quinchos, piscina y cowork. Revisa horarios libres en vivo y genera tu confirmación digital con código QR.",
    tag: "Confirmación Inmediata",
  },
  {
    num: "03",
    kicker: "CONCILIACIÓN BANCARIA",
    titulo: "Paga tus gastos comunes",
    desc: "Accede al desglose detallado con facturas adjuntas y paga mediante WebPay Plus sin enviar comprobantes por correo.",
    tag: "WebPay Plus",
  },
  {
    num: "04",
    kicker: "VIDA EN COMUNIDAD",
    titulo: "Coordina y mantente seguro",
    desc: "Emite pases de visita temporales para conserjería, revisa avisos prioritarios y reporta incidencias desde tu celular.",
    tag: "Pases QR Activos",
  },
];

const TRUST_BADGES: TrustBadge[] = [
  {
    icon: <IconShield className="w-4 h-4 text-primary-on-dark" />,
    text: "Cumplimiento Ley 21.442",
    highlight: "Copropiedad",
  },
  {
    icon: <IconCheck className="w-4 h-4 text-primary-on-dark" />,
    text: "WebPay Plus Certificado",
    highlight: "Transbank",
  },
  {
    icon: <IconCalendar className="w-4 h-4 text-primary-on-dark" />,
    text: "Infraestructura AWS Cifrada",
    highlight: "Alta Disponibilidad",
  },
  {
    icon: <IconHome className="w-4 h-4 text-primary-on-dark" />,
    text: "Soporte para Comités",
    highlight: "En Español",
  },
];

const METRICS = [
  {
    valor: "$7.2M+",
    etiqueta: "Gastos Conciliados",
    descripcion: "Mensuales con boleta y factura digital respaldada",
  },
  {
    valor: "100%",
    etiqueta: "Auditable por Ley",
    descripcion: "Apegado a estándares de Copropiedad Inmobiliaria",
  },
  {
    valor: "< 30s",
    etiqueta: "Reserva de Quincho",
    descripcion: "Tiempo promedio de confirmación con pase QR",
  },
  {
    valor: "24 / 7",
    etiqueta: "Conserjería Conectada",
    descripcion: "Coordinación de visitas, emergencias y mantención",
  },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function HeroSection() {
  const [previewMode, setPreviewMode] = useState<"residente" | "comite">("residente");

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-text">
      {/* Background architectural imagery */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=1800&h=1100&fit=crop&auto=format')] bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000" />

      {/* Atmospheric Editorial Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,32,27,0.97)_0%,rgba(0,64,56,0.85)_45%,rgba(0,32,27,0.94)_100%)]" />

      {/* Subtle organic light accent */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] rounded-full bg-accent/30 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-[1280px] mx-auto px-6 py-20 md:py-28 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_460px] gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="flex flex-col items-start">
            {/* Editorial Status Badge */}
            <div className="cv-hero-badge inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6 text-white/90 text-xs tracking-wider uppercase font-semibold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-on-dark opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-on-dark" />
              </span>
              <span>CONVIVO · SISTEMA RESIDENCIAL INTEGRAL</span>
              <span className="hidden sm:inline text-white/40">|</span>
              <span className="hidden sm:inline text-primary-on-dark font-normal">
                SANTIAGO DE CHILE
              </span>
            </div>

            {/* Main Editorial H1 */}
            <h1 className="cv-hero-h1 font-display text-[clamp(38px,5.2vw,70px)] leading-[1.04] text-white tracking-[-0.02em] font-normal m-0 mb-6">
              Gestión de condominios,
              <span className="text-primary-on-dark font-display italic font-normal block sm:inline">
                {" "}
                elevada al detalle.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="cv-hero-subtitle text-[17px] sm:text-[18px] leading-[1.68] text-white/80 font-light max-w-[560px] m-0 mb-9">
              La plataforma definitiva para comunidades residenciales en Chile. Espacios comunes,
              conciliación transparente de gastos, control de acceso mediante pases QR y
              comunicación directa con conserjería.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="cv-hero-ctas flex flex-wrap gap-4 items-center mb-10 w-full sm:w-auto">
              <Link
                to="/crear-cuenta"
                className="inline-flex items-center justify-center gap-2.5 bg-primary text-white font-semibold text-[15px] py-4 px-7 rounded-xl no-underline shadow-[0_12px_28px_rgba(13,148,136,0.28)] transition-[background-color,transform,box-shadow] hover:bg-emerald-600 hover:-translate-y-[1px] hover:shadow-[0_16px_36px_rgba(13,148,136,0.36)]"
              >
                <span>Comenzar como residente</span>
                <IconChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-[15px] py-4 px-7 rounded-xl no-underline border border-white/25 backdrop-blur-md transition-[background-color,border-color] hover:bg-white/20 hover:border-white/40"
              >
                <span>Iniciar sesión</span>
              </Link>
            </div>

            {/* Certified Trust Hallmarks */}
            <div className="cv-hero-badges flex flex-wrap gap-2.5 pt-2 border-t border-white/10 w-full">
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.text}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80"
                >
                  {b.icon}
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Living Residence Folio Card */}
          <div className="cv-hero-card relative">
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.35)] text-white">
              {/* Card Header & View Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/15">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-primary-on-dark uppercase">
                    Terminal Activo
                  </span>
                  <h3 className="font-display text-base font-normal text-white m-0">
                    Condominio Los Aromos
                  </h3>
                </div>

                {/* Mode Selector */}
                <div
                  className="flex items-center gap-1 p-1 bg-black/25 rounded-lg border border-white/10 self-start sm:self-auto"
                  role="group"
                  aria-label="Selector de vista de demostración"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewMode("residente")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      previewMode === "residente"
                        ? "bg-primary text-white shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Residente
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("comite")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      previewMode === "comite"
                        ? "bg-primary text-white shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Comité
                  </button>
                </div>
              </div>

              {/* Mode: Residente View */}
              {previewMode === "residente" ? (
                <div className="flex flex-col gap-3.5">
                  {/* Item 1: Próxima Reserva */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 transition-colors hover:bg-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-on-dark font-medium flex items-center gap-1.5">
                        <IconCalendar className="w-3.5 h-3.5" /> Próxima Reserva
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                        Confirmada
                      </span>
                    </div>
                    <div className="font-display text-base text-white">Quincho Los Aromos</div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Sábado 23 ago · 18:00 a 23:30 hrs · Pase QR listo
                    </div>
                  </div>

                  {/* Item 2: Gastos Comunes */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 transition-colors hover:bg-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-on-dark font-medium flex items-center gap-1.5">
                        <IconDollar className="w-3.5 h-3.5" /> Gastos de Julio
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold">
                        Vence en 5 días
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="font-display text-lg text-white tabular-nums">
                        $65.000 CLP
                      </div>
                      <Link
                        to="/gastos"
                        className="text-xs text-primary-on-dark font-semibold underline underline-offset-2 hover:text-white"
                      >
                        Pagar en línea →
                      </Link>
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Boleta electrónica #284-B disponible
                    </div>
                  </div>

                  {/* Item 3: Pase de Visita Activo */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 transition-colors hover:bg-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-on-dark font-medium flex items-center gap-1.5">
                        <IconUsers className="w-3.5 h-3.5" /> Pase QR de Visita
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[11px] font-semibold">
                        Autorizado
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Delivery Falabella (Torre B / 402)
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Válido hoy entre 10:00 y 14:00 hrs · Conserjería notificada
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode: Comité View */
                <div className="flex flex-col gap-3.5">
                  {/* Item 1: Recaudación */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 transition-colors hover:bg-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-on-dark font-medium flex items-center gap-1.5">
                        <IconTrendingUp className="w-3.5 h-3.5" /> Recaudación del Mes
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                        94.8% Cobrado
                      </span>
                    </div>
                    <div className="font-display text-lg text-white tabular-nums">
                      $7.240.000 CLP
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      100% de respaldos de egresos cargados bajo Ley 21.442
                    </div>
                  </div>

                  {/* Item 2: Uso de Espacios */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 transition-colors hover:bg-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-on-dark font-medium flex items-center gap-1.5">
                        <IconCalendar className="w-3.5 h-3.5" /> Ocupación Fin de Semana
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                        Alta Demanda
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      6 de 7 espacios con reservas confirmadas
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Quinchos 1 y 2 al 100% · Piscina en horario normal
                    </div>
                  </div>

                  {/* Item 3: Convocatoria */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 transition-colors hover:bg-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-on-dark font-medium flex items-center gap-1.5">
                        <IconMessage className="w-3.5 h-3.5" /> Próxima Asamblea Ordinaria
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[11px] font-semibold">
                        Convocada
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Miércoles 27 ago · 19:30 hrs (Sala Multiuso)
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Citación oficial enviada a 128 copropietarios
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Quick Bar */}
              <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <IconPhone className="w-3.5 h-3.5 text-primary-on-dark" />
                  <span>Conserjería Central · Intercomunicador 100</span>
                </span>
                <span className="font-semibold text-primary-on-dark">Turno Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="bg-[#fbfaf8] border-y border-stone-200/80 py-12 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {METRICS.map((m, idx) => (
            <div
              key={m.etiqueta}
              className={`flex flex-col ${
                idx > 0 ? "lg:border-l lg:border-stone-200/80 lg:pl-6" : ""
              }`}
            >
              <span className="font-display text-[clamp(32px,3.5vw,46px)] leading-none text-text tracking-tight tabular-nums">
                {m.valor}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary mt-2">
                {m.etiqueta}
              </span>
              <span className="text-xs text-muted leading-relaxed mt-1">{m.descripcion}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const activeModule = MODULOS[activeTab];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-3">
            01 / ARQUITECTURA MODULAR
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] text-text leading-[1.12] m-0 mb-4 font-normal">
            Un ecosistema diseñado para la vida real de tu comunidad
          </h2>
          <p className="text-[16px] text-muted leading-relaxed font-light m-0">
            Cada módulo de Convivo responde a una fricción histórica de los condominios en Chile:
            reuniones interminables, reservas en papel, falta de comprobantes y conserjerías
            aisladas.
          </p>
        </div>

        {/* Editorial Tab Navigation */}
        <div
          className="flex gap-2 overflow-x-auto pb-4 mb-12 border-b border-border no-scrollbar"
          role="tablist"
          aria-label="Módulos de la plataforma"
        >
          {MODULOS.map((mod, index) => {
            const isSelected = activeTab === index;
            return (
              <button
                key={mod.id}
                role="tab"
                id={`modulo-tab-${mod.id}`}
                aria-selected={isSelected}
                aria-controls={`modulo-panel-${mod.id}`}
                onClick={() => {
                  startTransition(() => {
                    setActiveTab(index);
                  });
                }}
                className={`group flex items-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-text text-white border-text shadow-sm"
                    : "bg-stone-50 text-stone-600 border-transparent hover:bg-stone-100 hover:text-text"
                }`}
              >
                <span
                  className={`font-mono text-[11px] ${
                    isSelected
                      ? "text-primary-on-dark"
                      : "text-stone-400 group-hover:text-stone-600"
                  }`}
                >
                  {mod.num}
                </span>
                <span className="flex items-center gap-1.5">
                  {mod.icon}
                  {mod.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel: Editorial Spread */}
        <div
          id={`modulo-panel-${activeModule.id}`}
          role="tabpanel"
          aria-labelledby={`modulo-tab-${activeModule.id}`}
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center"
        >
          {/* Left: Magazine-style Architectural Photography Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-100 shadow-[0_20px_50px_rgba(0,32,27,0.12)] border border-stone-200/70 h-[380px] sm:h-[460px]">
            <img
              src={activeModule.img}
              alt={activeModule.imgAlt}
              loading="lazy"
              decoding="async"
              width="900"
              height="620"
              className="w-full h-full object-cover"
            />
            {/* Editorial overlay badges */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-mono tracking-wider">
              <span>FIG. {activeModule.num}</span>
              <span className="text-white/40">/</span>
              <span>{activeModule.category}</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {activeModule.specs.map((s) => (
                <div
                  key={s.label}
                  className="px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-md text-white text-xs"
                >
                  <span className="text-white/60 mr-1.5 font-light">{s.label}:</span>
                  <span className="font-semibold text-primary-on-dark">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Rich Editorial Content & Features */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 text-accent text-xs font-bold tracking-wider uppercase mb-4">
              {activeModule.icon}
              <span>{activeModule.category}</span>
            </div>

            <h3 className="font-display text-[clamp(24px,2.8vw,36px)] text-text leading-[1.18] m-0 mb-4 font-normal">
              {activeModule.headline}
            </h3>

            <p className="text-[16px] text-muted leading-[1.72] font-light m-0 mb-6">
              {activeModule.body}
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-3 w-full mb-8">
              {activeModule.points.map((pt) => (
                <div key={pt} className="flex items-start gap-3 text-sm text-text">
                  <div className="w-5 h-5 rounded-full bg-teal-100/80 flex items-center justify-center shrink-0 mt-0.5 text-accent">
                    <IconCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{pt}</span>
                </div>
              ))}
            </div>

            {/* Direct Action Link */}
            <Link
              to={activeModule.path}
              viewTransition
              className="inline-flex items-center gap-2.5 bg-text text-white font-semibold text-sm py-3.5 px-6 rounded-xl no-underline transition-[background-color,transform] hover:bg-accent hover:-translate-y-[1px]"
            >
              <span>Acceder a {activeModule.label}</span>
              <IconChevronRight className="w-4 h-4 text-primary-on-dark" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section className="bg-text text-white py-24 px-6 relative overflow-hidden">
      {/* Decorative ambient subtle circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Editorial Quote Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-on-dark mb-4">
            EL MANIFIESTO CONVIVO
          </p>
          <blockquote className="font-display text-[clamp(26px,3.6vw,44px)] leading-[1.22] font-normal text-white m-0">
            «Menos cadenas de mensajes informales y reuniones de pasillo. Cero opacidad en las
            cuentas.
            <span className="text-primary-on-dark italic block mt-1">
              Más tranquilidad para disfrutar tu hogar.
            </span>
            »
          </blockquote>
        </div>

        {/* 3 Column Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/15">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold text-primary-on-dark tracking-widest">
              01 / TRANSPARENCIA TOTAL
            </span>
            <h4 className="font-display text-xl font-normal text-white m-0">
              Cada peso con respaldo fiscal
            </h4>
            <p className="text-sm text-white/70 leading-relaxed font-light m-0">
              Todos los egresos y gastos de fondo de reserva cuentan con su factura o boleta digital
              adjunta. Respaldo normativo estricto bajo la Ley 21.442 de Copropiedad Inmobiliaria.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold text-primary-on-dark tracking-widest">
              02 / AUTONOMÍA DEL RESIDENTE
            </span>
            <h4 className="font-display text-xl font-normal text-white m-0">
              Gestión inmediata desde el móvil
            </h4>
            <p className="text-sm text-white/70 leading-relaxed font-light m-0">
              Reserva quinchos al instante, paga tus gastos comunes vía WebPay Plus y autoriza
              visitas con pases QR sin depender de planillas de papel en conserjería.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold text-primary-on-dark tracking-widest">
              03 / SEGURIDAD COORDINADA
            </span>
            <h4 className="font-display text-xl font-normal text-white m-0">
              Conserjería conectada 24/7
            </h4>
            <p className="text-sm text-white/70 leading-relaxed font-light m-0">
              Canales directos para turnos de conserjería, Plan Cuadrante y emergencias. Registro
              fotográfico de cada mantención preventiva en áreas críticas del edificio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="bg-[#f4f2ed] py-24 px-6 border-b border-stone-200/80">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            02 / EXPERIENCIA DE INGRESO
          </p>
          <h2 className="font-display text-[clamp(28px,3.6vw,44px)] text-text leading-[1.15] m-0 mb-3 font-normal">
            En 4 pasos ya formas parte de tu comunidad
          </h2>
          <p className="text-sm text-muted font-light m-0">
            Un proceso sin papeleo ni trámites presenciales para copropietarios y arrendatarios.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PASOS.map((p) => (
            <div
              key={p.num}
              className="rounded-2xl bg-white p-7 border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-3xl font-normal text-primary">{p.num}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-accent border border-teal-100">
                    {p.tag}
                  </span>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                  {p.kicker}
                </div>
                <h3 className="font-display text-lg text-text font-normal m-0 mb-2.5">
                  {p.titulo}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-light m-0">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-accent text-white py-24 px-6 text-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.35)_0%,rgba(0,80,71,1)_75%)] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-on-dark mb-4 inline-block">
          COMUNIDADES INTELIGENTES
        </span>
        <h2 className="font-display text-[clamp(32px,4.5vw,52px)] text-white leading-[1.08] mb-5 font-normal m-0">
          Tu condominio, elevado al estándar que merece
        </h2>
        <p className="text-[16px] sm:text-[18px] text-white/80 leading-relaxed font-light mb-10 max-w-xl mx-auto">
          Sin contratos mínimos ni costos ocultos de instalación. Transparencia, tranquilidad y
          confort para residentes y comités de administración.
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Link
            to="/crear-cuenta"
            viewTransition
            className="bg-white text-accent font-bold text-[15px] py-4 px-8 rounded-xl no-underline shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
          >
            Comenzar como residente
          </Link>
          <Link
            to="/precios"
            viewTransition
            className="bg-white/10 text-white font-semibold text-[15px] py-4 px-8 rounded-xl no-underline border border-white/25 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Ver planes para el comité
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (
      user.role === "residente" &&
      (!user.condominioId || !user.unidad || user.unidad === "Sin unidad asignada")
    ) {
      navigate("/completar-registro", { replace: true });
    } else {
      navigate(rutaPrincipalPorRol(user.role), { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col w-full bg-white font-body selection:bg-teal-100 selection:text-accent">
      <HeroSection />
      <MetricsSection />
      <ModuleShowcase />
      <ManifestoSection />
      <StepsSection />
      <FinalCTA />
    </div>
  );
}
