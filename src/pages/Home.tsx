/* eslint-disable react/forbid-dom-props */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  IconCalendar,
  IconDollar,
  IconMessage,
  IconHome,
  IconShield,
  IconCamera,
  IconChevronRight,
  IconTrendingUp,
  IconCheck,
} from "../components/icons/Icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

interface ModuloTab {
  label: string;
  icon: React.ReactNode;
  path: string;
  headline: string;
  body: string;
  points: string[];
  img: string;
}

interface Paso {
  titulo: string;
  desc: string;
}

interface Testimonio {
  nombre: string;
  rol: string;
  iniciales: string;
  cita: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  badge?: string;
  desc: string;
  features: string[];
  cta: string;
}

interface TrustBadge {
  icon: React.ReactNode;
  text: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: StatItem[] = [
  { target: 2400, suffix: "+", label: "Residentes activos" },
  { target: 98, suffix: "%", label: "Satisfacción" },
  { target: 150, suffix: "+", label: "Comunidades" },
  { target: 7, suffix: "", label: "Espacios gestionados" },
];

const MODULOS: ModuloTab[] = [
  {
    label: "Reservas",
    icon: <IconCalendar className="w-[17px] h-[17px]" />,
    path: "/reservas",
    img: "https://images.unsplash.com/photo-1763479142280-675629f6db27?w=800&h=560&fit=crop&auto=format",
    headline: "Reserva espacios comunes en segundos",
    body: "Filtra por categoría, revisa disponibilidad en tiempo real y paga con tarjeta, transferencia o WebPay. Sin llamadas, sin papeles.",
    points: [
      "7 espacios: quinchos, piscina, gimnasio y más",
      "Confirmación instantánea con código QR",
      "Cancelación online hasta 24 hrs antes",
    ],
  },
  {
    label: "Gastos",
    icon: <IconDollar className="w-[17px] h-[17px]" />,
    path: "/gastos",
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=560&fit=crop&auto=format",
    headline: "Paga tus gastos comunes en línea",
    body: "Desglose mensual por ítem, historial PDF y alertas automáticas antes del vencimiento. Estado de pago visible para residentes y comité.",
    points: [
      "Emisión mensual desglosada por categoría",
      "Pago con tarjeta, transferencia y WebPay",
      "Alertas automáticas de vencimiento",
    ],
  },
  {
    label: "Tablón",
    icon: <IconMessage className="w-[17px] h-[17px]" />,
    path: "/tablon",
    img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=560&fit=crop&auto=format",
    headline: "Mantente informado en tiempo real",
    body: "Cartelera digital con avisos del comité, asambleas, mantenciones y publicaciones de residentes. Reemplaza el diario mural físico.",
    points: [
      "Notificaciones push automáticas por torre",
      "Confirmación de asistencia para eventos",
      "Historial consultable de todos los avisos",
    ],
  },
  {
    label: "Dashboard",
    icon: <IconTrendingUp className="w-[17px] h-[17px]" />,
    path: "/dashboard",
    img: "https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=800&h=560&fit=crop&auto=format",
    headline: "Transparencia total en cada peso",
    body: "Panel centralizado con todos los gastos del condominio. Cada ítem respaldado con boleta o factura adjunta, visible para todos.",
    points: [
      "Gráfico de evolución mensual",
      "Boleta o factura adjunta por gasto",
      "Exportación a PDF para asambleas",
    ],
  },
  {
    label: "Canales",
    icon: <IconShield className="w-[17px] h-[17px]" />,
    path: "/canales",
    img: "https://images.unsplash.com/photo-1651514645933-c26e0eb4ace3?w=800&h=560&fit=crop&auto=format",
    headline: "Un clic para cualquier emergencia",
    body: "Contacto directo con conserjería, comité, administración y seguridad del sector. Todo centralizado y siempre actualizado.",
    points: [
      "Conserjería 24/7 con llamada directa",
      "Plan Cuadrante y patrulla del sector",
      "Emergencias: 133 / 132 / 131",
    ],
  },
  {
    label: "Registro",
    icon: <IconCamera className="w-[17px] h-[17px]" />,
    path: "/registro",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=560&fit=crop&auto=format",
    headline: "Control de calidad verificable",
    body: "Bitácora fotográfica de cada mantención. Antes y después, con fecha, responsable y boleta adjunta — visible para todos los residentes.",
    points: [
      "Fotos antes/después por intervención",
      "Vinculado al gasto en el dashboard",
      "Categorizado por tipo de trabajo",
    ],
  },
];

const PASOS: Paso[] = [
  {
    titulo: "Regístrate con tu unidad",
    desc: "Ingresa correo y valida torre, piso y número. El comité aprueba tu cuenta en 24 hrs.",
  },
  {
    titulo: "Explora y reserva espacios",
    desc: "Filtra por categoría y disponibilidad. Paga en segundos desde la plataforma.",
  },
  {
    titulo: "Revisa tus gastos",
    desc: "Accede al desglose mensual y paga antes del vencimiento — sin colas ni cheques.",
  },
  {
    titulo: "Mantente conectado",
    desc: "Recibe avisos, accede al dashboard de transparencia y contacta a conserjería.",
  },
];

const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "Valentina Morales",
    rol: "Residente",
    iniciales: "VM",
    cita: "Antes tenía que llamar para reservar el quincho. Ahora lo hago en 30 segundos desde el teléfono. Increíble.",
  },
  {
    nombre: "Jorge Sepúlveda",
    rol: "Presidente de comité",
    iniciales: "JS",
    cita: "El dashboard de transparencia cambió todo. Los residentes confían más porque pueden ver cada boleta adjunta.",
  },
  {
    nombre: "María Inés Fuentes",
    rol: "Administradora",
    iniciales: "MF",
    cita: "Los gastos comunes se pagan a tiempo porque los recordatorios llegan automáticos. Cero morosidad este mes.",
  },
];

const PRICING: PricingTier[] = [
  {
    name: "Básico",
    price: "Gratis",
    period: "",
    highlight: false,
    desc: "Para comunidades pequeñas que quieren dar el primer paso digital.",
    features: [
      "Hasta 30 unidades",
      "Tablón de avisos",
      "2 espacios para reservar",
      "Gastos manuales",
    ],
    cta: "Comenzar gratis",
  },
  {
    name: "Comunidad",
    price: "$19.900",
    period: "/mes",
    highlight: true,
    badge: "Recomendado",
    desc: "Todo lo que necesita un condominio moderno. El más elegido.",
    features: [
      "Hasta 150 unidades",
      "Todos los módulos",
      "Reservas ilimitadas",
      "Pagos WebPay integrados",
      "Dashboard de transparencia",
      "Soporte prioritario 24/7",
    ],
    cta: "Comenzar ahora",
  },
  {
    name: "Enterprise",
    price: "A medida",
    period: "",
    highlight: false,
    desc: "Para conjuntos residenciales grandes con múltiples torres.",
    features: [
      "Unidades ilimitadas",
      "Multi-torre y multi-edificio",
      "API e integraciones",
      "Onboarding dedicado",
      "SLA garantizado",
      "Administrador asignado",
    ],
    cta: "Contactar equipo",
  },
];

const TRUST_BADGES: TrustBadge[] = [
  {
    icon: <IconShield className="w-[18px] h-[18px]" />,
    text: "Datos seguros y cifrados",
  },
  {
    icon: <IconCheck className="w-[18px] h-[18px]" />,
    text: "Pagos con WebPay",
  },
  {
    icon: <IconCalendar className="w-[18px] h-[18px]" />,
    text: "Sin contratos mínimos",
  },
  {
    icon: <IconHome className="w-[18px] h-[18px]" />,
    text: "Soporte en español",
  },
];

// ─── Sub-components (all before Home) ─────────────────────────────────────────

function Counter({ target, suffix }: StatItem) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setVal(target);
            clearInterval(timer);
          } else {
            setVal(Math.floor(current));
          }
        }, 25);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {val.toLocaleString("es-CL")}
      {suffix}
    </span>
  );
}

const HERO_QUICK_LINKS = [
  {
    icon: <IconCalendar className="w-[18px] h-[18px]" />,
    label: "Reservar espacio",
    path: "/espacios",
    color: "#0D9488",
  },
  {
    icon: <IconDollar className="w-[18px] h-[18px]" />,
    label: "Pagar gastos",
    path: "/gastos",
    color: "#005047",
  },
  {
    icon: <IconMessage className="w-[18px] h-[18px]" />,
    label: "Ver tablón",
    path: "/tablon",
    color: "#0D9488",
  },
  {
    icon: <IconShield className="w-[18px] h-[18px]" />,
    label: "Emergencias",
    path: "/canales",
    color: "#E11D48",
  },
  {
    icon: <IconTrendingUp className="w-[18px] h-[18px]" />,
    label: "Dashboard",
    path: "/dashboard",
    color: "#14B8A6",
  },
  {
    icon: <IconCamera className="w-[18px] h-[18px]" />,
    label: "Registro fotos",
    path: "/registro",
    color: "#0D9488",
  },
];

function HeroSection() {
  const quickLinks = HERO_QUICK_LINKS;

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=1800&h=1100&fit=crop&auto=format')] bg-cover bg-center" />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,32,27,0.93)_0%,rgba(13,148,136,0.35)_55%,rgba(0,0,0,0.15)_100%)]" />

      {/* ── Animated blobs (subtle, behind text) ── */}
      <div
        className="cv-blob absolute rounded-full pointer-events-none w-[520px] h-[520px] top-[-80px] left-[-120px] bg-[radial-gradient(circle,rgba(13,148,136,0.18)_0%,transparent_70%)] blur-[40px]"
        style={{ "--drift-dur": "14s" } as React.CSSProperties}
      />
      <div
        className="cv-blob absolute rounded-full pointer-events-none w-[380px] h-[380px] bottom-[60px] left-[38%] bg-[radial-gradient(circle,rgba(0,80,71,0.22)_0%,transparent_70%)] blur-[50px]"
        style={{ "--drift-dur": "18s", animationDelay: "-6s" } as React.CSSProperties}
      />
      <div
        className="cv-blob absolute rounded-full pointer-events-none w-[260px] h-[260px] top-[30%] right-[8%] bg-[radial-gradient(circle,rgba(94,234,212,0.10)_0%,transparent_70%)] blur-[32px]"
        style={{ "--drift-dur": "11s", animationDelay: "-3s" } as React.CSSProperties}
      />

      {/* ── Content ── */}
      <div className="relative max-w-[1280px] mx-auto pt-[clamp(96px,10vw,140px)] pr-[24px] pb-[clamp(96px,10vw,140px)] pl-[80px] w-full">
        <div className="hero-grid grid grid-cols-[1fr_420px] gap-14 items-center">
          {/* Left col — staggered entrance */}
          <div>
            {/* Badge */}
            <div className="cv-hero-badge inline-flex items-center gap-2 bg-[#0D9488]/22 border border-[#0D9488]/45 rounded-full py-[5px] px-[14px] mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] inline-block" />
              <span className="text-[12px] text-white font-medium tracking-[0.05em]">
                Torres del Parque · Plataforma activa
              </span>
            </div>

            {/* H1 */}
            <h1 className="cv-hero-h1 font-['Gloock',Georgia,serif] text-[clamp(38px,5.2vw,68px)] leading-[1.07] text-white m-0 mb-[22px] font-normal">
              Gestión simple.
              <br />
              <span className="text-[#5EEAD4]">
                Comunidad
                <br />
                conectada.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="cv-hero-subtitle text-[17px] leading-[1.72] text-white/78 m-0 mb-9 font-light max-w-[520px]">
              Plataforma digital para condominios en Chile. Reservas, gastos, avisos y seguridad —
              todo en un lugar.
            </p>

            {/* CTAs */}
            <div className="cv-hero-ctas flex gap-3 flex-wrap mb-9">
              <Link
                to="/crear-cuenta"
                className="inline-flex items-center gap-2 bg-[#0D9488] text-white font-bold text-[14px] py-[13px] px-[26px] rounded-[10px] no-underline transition-[background-color,transform] hover:bg-[#005047] hover:-translate-y-[1px]"
              >
                Crear cuenta <IconChevronRight className="w-[14px] h-[14px]" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/12 text-white font-semibold text-[14px] py-[13px] px-[26px] rounded-[10px] no-underline border border-white/28 transition-colors hover:bg-white/22"
              >
                Iniciar sesión
              </Link>
            </div>

            {/* Trust badges */}
            <div className="cv-hero-badges flex gap-3 flex-wrap">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b.text}
                  className="inline-flex items-center gap-[6px] text-[12px] text-white/70 bg-white/5 rounded-full py-[6px] px-[12px] border border-white/10"
                >
                  {b.icon} {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: glassmorphism quick-access card */}
          <div className="cv-hero-card bg-white/5 backdrop-blur-[18px] rounded-[20px] border border-white/10 p-7">
            <p className="text-[11px] font-bold text-white/55 tracking-[0.1em] uppercase m-0 mb-[18px]">
              Acceso rápido
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {quickLinks.map((item) => (
                <Link key={item.label} to={item.path} className="no-underline group">
                  <div className="bg-white/5 rounded-xl py-[15px] px-[12px] border border-white/10 transition-[background-color,transform] cursor-pointer group-hover:bg-white/15 group-hover:-translate-y-[1px]">
                    <div className="mb-2" style={{ color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="text-[12px] font-semibold text-white leading-[1.2]">
                      {item.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-[18px] pt-[14px] border-t border-white/10 flex items-center gap-2">
              <span className="w-[7px] h-[7px] rounded-full bg-[#4ADE80] inline-block" />
              <span className="text-[12px] text-white/55">Conserjería en línea · Interno 100</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="bg-[#00201B] py-[52px] px-6">
      <div className="stats-grid max-w-[1280px] mx-auto grid grid-cols-4 gap-8 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-['Gloock',Georgia,serif] text-[clamp(36px,4vw,52px)] text-[#5EEAD4] leading-none">
              <Counter target={s.target} suffix={s.suffix} label={s.label} />
            </div>
            <div className="text-[13px] text-white/50 mt-2 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModuleTabs() {
  const [active, setActive] = useState(0);
  const m = MODULOS[active];

  return (
    <section className="bg-white py-[100px] px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-[520px] mx-auto mb-12">
          <p className="text-[11px] font-bold text-[#0D9488] tracking-[0.12em] uppercase mb-3">
            Plataforma completa
          </p>
          <h2 className="font-['Gloock',Georgia,serif] text-[clamp(28px,3.5vw,44px)] text-[#00201B] leading-[1.15] m-0 font-normal">
            Un ecosistema para tu condominio
          </h2>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1.5 justify-center flex-wrap mb-12">
          {MODULOS.map((mod, i) => (
            <button
              key={mod.label}
              onClick={() => setActive(i)}
              className={`flex items-center gap-[7px] py-[9px] px-[18px] rounded-[10px] text-[13px] font-semibold cursor-pointer border-[1.5px] transition-colors ${
                active === i
                  ? "border-[#0D9488] bg-[#0D9488] text-white"
                  : "border-[#E2E8F0] bg-white text-[#64748B]"
              }`}
            >
              {mod.icon} {mod.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div key={active} className="tab-content-grid grid grid-cols-2 gap-16 items-center">
          <div className="rounded-[20px] overflow-hidden h-[380px] bg-[#E2E8F0] shadow-[0_20px_60px_rgba(0,0,0,0.11)]">
            <img src={m.img} alt={m.label} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F0FDFA] rounded-lg py-[5px] px-[14px] mb-5 text-[#005047]">
              {m.icon}
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase">{m.label}</span>
            </div>
            <h3 className="font-['Gloock',Georgia,serif] text-[clamp(22px,2.8vw,34px)] text-[#00201B] leading-[1.2] m-0 mb-4 font-normal">
              {m.headline}
            </h3>
            <p className="text-[15px] text-[#64748B] leading-[1.75] m-0 mb-7">{m.body}</p>
            <div className="flex flex-col gap-3 mb-8">
              {m.points.map((p) => (
                <div key={p} className="flex gap-2.5 items-start text-[14px] text-[#00201B]">
                  <div className="w-5 h-5 rounded-full bg-[#CCFBF1] flex items-center justify-center shrink-0 mt-[1px]">
                    <IconCheck className="w-[11px] h-[11px] text-[#005047]" />
                  </div>
                  {p}
                </div>
              ))}
            </div>
            <Link
              to={m.path}
              className="inline-flex items-center gap-2 bg-[#0D9488] text-white font-bold text-[14px] py-[12px] px-[24px] rounded-[10px] no-underline transition-colors hover:bg-[#005047]"
            >
              Ir a {m.label} <IconChevronRight className="w-[14px] h-[14px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-[#F8FAFB] py-[100px] px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-[440px] mx-auto mb-[72px]">
          <p className="text-[11px] font-bold text-[#0D9488] tracking-[0.12em] uppercase mb-3">
            Así funciona
          </p>
          <h2 className="font-['Gloock',Georgia,serif] text-[clamp(28px,3.5vw,42px)] text-[#00201B] leading-[1.2] m-0 font-normal">
            En 4 pasos ya formas parte
          </h2>
        </div>

        {/* Steps with CSS connector line */}
        <div className="relative">
          {/* Connector */}
          <div className="steps-line absolute top-[36px] left-[12.5%] right-[12.5%] h-[2px] z-0 bg-[linear-gradient(90deg,transparent,#CCFBF1_10%,#0D9488_50%,#CCFBF1_90%,transparent)]" />

          <div className="steps-grid grid grid-cols-4 gap-2">
            {PASOS.map((p, i) => (
              <div key={p.titulo} className="text-center px-4 relative z-10">
                <div
                  className={`w-[72px] h-[72px] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_4px_20px_rgba(13,148,136,0.14)] border-[3px] ${
                    i === 0 ? "bg-[#0D9488] border-[#0D9488]" : "bg-white border-[#CCFBF1]"
                  }`}
                >
                  <span
                    className={`font-['Gloock',Georgia,serif] text-[24px] font-normal ${
                      i === 0 ? "text-white" : "text-[#0D9488]"
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>
                <h4 className="font-['Gloock',Georgia,serif] text-[17px] text-[#00201B] m-0 mb-[10px] font-normal">
                  {p.titulo}
                </h4>
                <p className="text-[13px] text-[#64748B] leading-[1.65] m-0">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURE_SECTIONS = [
  {
    imgLeft: false,
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=560&fit=crop&auto=format",
    label: "Transparencia de gastos",
    headline: "Cada peso del condominio, visible para todos",
    body: "El Dashboard de Transparencia centraliza todos los gastos con su respectiva boleta adjunta. Ningún residente tiene que confiar a ciegas.",
    stats: [
      { val: "$7.2M", sub: "Acumulado 2026" },
      { val: "100%", sub: "Con boleta adjunta" },
    ],
    cta: { label: "Ver dashboard", path: "/dashboard" },
  },
  {
    imgLeft: true,
    img: "https://images.unsplash.com/photo-1763479142280-675629f6db27?w=800&h=560&fit=crop&auto=format",
    label: "Espacios comunes",
    headline: "7 espacios disponibles para reservar hoy",
    body: "Desde el Quincho Los Aromos hasta la Sala de Juegos / Cowork. Filtra, reserva y paga en segundos con tu método preferido.",
    stats: [
      { val: "7", sub: "Espacios disponibles" },
      { val: "3", sub: "Métodos de pago" },
    ],
    cta: { label: "Ver espacios", path: "/reservas" },
  },
];

function FeatureSections() {
  const sections = FEATURE_SECTIONS;

  return (
    <section className="bg-white py-[100px] px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-24">
        {sections.map((s) => (
          <div
            key={s.label}
            className="alt-grid grid grid-cols-2 gap-16 items-center"
            style={{ direction: s.imgLeft ? "rtl" : "ltr" }}
          >
            <div
              className="rounded-[20px] overflow-hidden h-[360px] bg-[#E2E8F0] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
              style={{ direction: "ltr" }}
            >
              <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
            </div>
            <div style={{ direction: "ltr" }}>
              <p className="text-[11px] font-bold text-[#0D9488] tracking-[0.1em] uppercase mb-[14px]">
                {s.label}
              </p>
              <h2 className="font-['Gloock',Georgia,serif] text-[clamp(24px,3vw,38px)] text-[#00201B] leading-[1.2] m-0 mb-4 font-normal">
                {s.headline}
              </h2>
              <p className="text-[15px] text-[#64748B] leading-[1.75] m-0 mb-7">{s.body}</p>
              <div className="flex gap-9 mb-8">
                {s.stats.map((st) => (
                  <div key={st.sub}>
                    <div className="font-['Gloock',Georgia,serif] text-[32px] text-[#0D9488]">
                      {st.val}
                    </div>
                    <div className="text-[12px] text-[#94A3B8] mt-0.5">{st.sub}</div>
                  </div>
                ))}
              </div>
              <Link
                to={s.cta.path}
                className="inline-flex items-center gap-2 border-2 border-[#0D9488] text-[#0D9488] font-bold text-[14px] py-[11px] px-[22px] rounded-[10px] no-underline transition-colors hover:bg-[#0D9488] hover:text-white"
              >
                {s.cta.label} <IconChevronRight className="w-[14px] h-[14px]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-[#F8FAFB] py-[100px] px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-[440px] mx-auto mb-14">
          <p className="text-[11px] font-bold text-[#0D9488] tracking-[0.12em] uppercase mb-3">
            Lo que dicen
          </p>
          <h2 className="font-['Gloock',Georgia,serif] text-[clamp(28px,3.5vw,42px)] text-[#00201B] leading-[1.2] m-0 font-normal">
            La comunidad habla
          </h2>
        </div>
        <div className="testi-grid grid grid-cols-3 gap-[22px]">
          {TESTIMONIOS.map((t) => (
            <div
              key={t.nombre}
              className="bg-white border border-[#E2E8F0] rounded-[18px] py-8 px-7 transition-[box-shadow,transform] hover:shadow-[0_12px_40px_rgba(13,148,136,0.09)] hover:-translate-y-[3px]"
            >
              <div className="text-[48px] text-[#CCFBF1] font-['Georgia',serif] leading-none mb-4">
                "
              </div>
              <p className="text-[15px] text-[#00201B] leading-[1.75] m-0 mb-6 italic">{t.cita}</p>
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-full bg-[linear-gradient(135deg,#CCFBF1,#0D9488)] flex items-center justify-center text-white font-['Gloock',Georgia,serif] text-[15px]">
                  {t.iniciales}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#00201B]">{t.nombre}</div>
                  <div className="text-[12px] text-[#94A3B8]">{t.rol}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="bg-[#00201B] py-[100px] px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-[440px] mx-auto mb-14">
          <p className="text-[11px] font-bold text-[#5EEAD4] tracking-[0.12em] uppercase mb-3">
            Planes y precios
          </p>
          <h2 className="font-['Gloock',Georgia,serif] text-[clamp(28px,3.5vw,42px)] text-white leading-[1.2] m-0 mb-3.5 font-normal">
            Simple y transparente
          </h2>
          <p className="text-[15px] text-white/55 m-0">
            Sin costos ocultos ni letras chicas.{" "}
            <Link to="/precios" className="text-[#5EEAD4] no-underline font-semibold">
              Ver comparación completa →
            </Link>
          </p>
        </div>

        <div className="pricing-grid grid grid-cols-3 gap-5 items-stretch">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-[20px] border ${
                plan.highlight
                  ? "p-[40px_28px] bg-[#0D9488] border-[#0D9488] scale-[1.03] shadow-[0_24px_64px_rgba(13,148,136,0.35)]"
                  : "p-[32px_28px] bg-white/5 border-white/10 scale-100 shadow-none"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-white text-[#005047] text-[10px] font-extrabold py-[3px] px-[10px] rounded-full tracking-[0.06em]">
                  {plan.badge}
                </div>
              )}
              <div
                className={`text-[14px] font-bold mb-2 ${plan.highlight ? "text-white/80" : "text-white/55"}`}
              >
                {plan.name}
              </div>
              <div className="flex items-end gap-1 mb-2">
                <span className="font-['Gloock',Georgia,serif] text-[38px] text-white leading-none">
                  {plan.price}
                </span>
                <span className="text-[14px] text-white/45 mb-1">{plan.period}</span>
              </div>
              <p className="text-[13px] text-white/55 leading-[1.6] m-0 mb-6">{plan.desc}</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {plan.features.map((f) => (
                  <div
                    key={f}
                    className={`flex gap-2 items-start text-[13px] ${plan.highlight ? "text-white/90" : "text-white/65"}`}
                  >
                    <IconCheck
                      className={`w-[13px] h-[13px] shrink-0 mt-[1px] ${plan.highlight ? "text-white" : "text-[#5EEAD4]"}`}
                    />
                    {f}
                  </div>
                ))}
              </div>
              <button
                className={`w-full p-[13px] text-[14px] font-bold rounded-[10px] cursor-pointer transition-opacity hover:opacity-85 ${
                  plan.highlight
                    ? "bg-white text-[#0D9488] border-none"
                    : "bg-white/10 text-white border border-white/20"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-[linear-gradient(135deg,#0D9488_0%,#005047_100%)] py-[88px] px-6 text-center">
      <div className="max-w-[600px] mx-auto">
        <h2 className="font-['Gloock',Georgia,serif] text-[clamp(28px,4vw,48px)] text-white leading-[1.12] mb-4 font-normal">
          Tu condominio, conectado hoy
        </h2>
        <p className="text-[16px] text-white/75 leading-[1.7] mb-9">
          Sin instalaciones, sin contratos mínimos. Empieza a gestionar en minutos.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/reservas"
            className="bg-white text-[#005047] font-bold text-[15px] py-[14px] px-8 rounded-[10px] no-underline transition-[box-shadow,transform] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
          >
            Comenzar como residente
          </Link>
          <Link
            to="/precios"
            className="bg-white/14 text-white font-semibold text-[15px] py-[14px] px-8 rounded-[10px] no-underline border border-white/32 transition-colors hover:bg-white/24"
          >
            Ver planes del comité
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <ModuleTabs />
      <HowItWorks />
      <FeatureSections />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTA />
    </div>
  );
}
