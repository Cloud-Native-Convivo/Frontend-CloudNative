import { useState } from "react";
import { Link } from "react-router";
import {
  IconCalendar,
  IconDollar,
  IconMessage,
  IconHome,
  IconShield,
  IconCamera,
  IconTrendingUp,
  IconCheck,
} from "../components/icons/Icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModuloTab {
  label: string;
  icon: React.ReactNode;
  path: string;
  headline: string;
  body: string;
  points: string[];
  img: string;
  imgAlt: string;
}

interface Paso {
  titulo: string;
  desc: string;
}

interface TrustBadge {
  icon: React.ReactNode;
  text: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULOS: ModuloTab[] = [
  {
    label: "Reservas",
    icon: <IconCalendar className="w-[17px] h-[17px]" />,
    path: "/reservas",
    img: "https://images.unsplash.com/photo-1763479142280-675629f6db27?w=800&h=560&fit=crop&auto=format",
    imgAlt: "Piscina y áreas verdes de un condominio moderno listas para reservar",
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
    imgAlt: "Persona revisando el desglose de gastos en un dispositivo móvil",
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
    imgAlt: "Cartelera digital con anuncios comunitarios y eventos",
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
    imgAlt: "Gráficos financieros que muestran la evolución de los gastos del condominio",
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
    imgAlt: "Radiotransmisor y equipo de seguridad para contacto de emergencias",
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
    imgAlt: "Lente de cámara capturando fotos de mantención",
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

const HERO_QUICK_LINKS = [
  {
    icon: <IconCalendar className="w-[18px] h-[18px]" />,
    label: "Reservar espacio",
    path: "/espacios",
    color: "text-primary",
  },
  {
    icon: <IconDollar className="w-[18px] h-[18px]" />,
    label: "Pagar gastos",
    path: "/gastos",
    color: "text-accent",
  },
  {
    icon: <IconMessage className="w-[18px] h-[18px]" />,
    label: "Ver tablón",
    path: "/tablon",
    color: "text-primary",
  },
  {
    icon: <IconShield className="w-[18px] h-[18px]" />,
    label: "Emergencias",
    path: "/canales",
    color: "text-alert-red",
  },
  {
    icon: <IconTrendingUp className="w-[18px] h-[18px]" />,
    label: "Dashboard",
    path: "/dashboard",
    color: "text-teal-500",
  },
  {
    icon: <IconCamera className="w-[18px] h-[18px]" />,
    label: "Registro fotos",
    path: "/registro",
    color: "text-primary",
  },
];

function HeroSection() {
  const quickLinks = HERO_QUICK_LINKS;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=1800&h=1100&fit=crop&auto=format')] bg-cover bg-center" />

      {/* Dark gradient overlay for readability (Craft: ensures contrast against photo) */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,32,27,0.95)_0%,rgba(13,148,136,0.45)_55%,rgba(0,0,0,0.4)_100%)]" />

      {/* ── Content ── */}
      <div className="relative max-w-[1280px] mx-auto pt-[clamp(96px,10vw,140px)] pr-[24px] pb-[clamp(96px,10vw,140px)] pl-[24px] md:pl-[80px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-14 items-center">
          {/* Left col */}
          <div>
            {/* H1 */}
            <h1 className="font-['Gloock',Georgia,serif] text-[clamp(40px,5vw,68px)] leading-[1.05] text-white m-0 mb-6 font-normal">
              Gestión simple.
              <br />
              <span className="text-primary-on-dark">Comunidad conectada.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] leading-[1.65] text-white/85 m-0 mb-9 font-light max-w-[520px]">
              Plataforma digital para condominios en Chile. Reservas, gastos, avisos y seguridad —
              todo centralizado y al alcance de tu mano.
            </p>

            {/* CTAs */}
            <div className="flex gap-4 flex-wrap mb-9">
              <Link
                to="/crear-cuenta"
                className="inline-flex items-center bg-primary text-white font-semibold text-[14px] py-3.5 px-6 rounded-lg no-underline transition-[background-color,transform] hover:bg-accent hover:-translate-y-[1px]"
              >
                Crear cuenta
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center bg-white/10 text-white font-semibold text-[14px] py-3.5 px-6 rounded-lg no-underline border border-white/30 transition-colors hover:bg-white/20"
              >
                Iniciar sesión
              </Link>
            </div>

            {/* Trust badges (Functional Features) */}
            <div className="flex gap-3 flex-wrap">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b.text}
                  className="inline-flex items-center gap-2 text-[12px] text-white/80 bg-white/5 rounded-full py-1.5 px-3 border border-white/10"
                >
                  {b.icon} {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Glassmorphism quick-access card (Accent use of blur per R-10) */}
          <div className="bg-white/5 backdrop-blur-[16px] rounded-2xl border border-white/10 p-7 shadow-[0_24px_48px_rgba(0,0,0,0.2)]">
            <p className="text-[13px] font-semibold text-white/70 mb-5">Acceso rápido</p>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((item) => (
                <Link key={item.label} to={item.path} className="no-underline group">
                  <div className="bg-white/5 rounded-xl py-4 px-3 border border-white/10 transition-[background-color,transform] cursor-pointer group-hover:bg-white/15 group-hover:-translate-y-[1px]">
                    <div className={`mb-2 ${item.color}`}>{item.icon}</div>
                    <div className="text-[12px] font-semibold text-white leading-[1.2]">
                      {item.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-5 pt-3.5 border-t border-white/10">
              <span className="text-[12px] text-white/70 font-medium">
                Conserjería · Interno 100
              </span>
            </div>
          </div>
        </div>
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
          <p className="text-[13px] font-semibold text-primary mb-3">Plataforma completa</p>
          <h2 className="font-['Gloock',Georgia,serif] text-[clamp(28px,3.5vw,44px)] text-text leading-[1.15] m-0 font-normal">
            Un ecosistema para tu condominio
          </h2>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1.5 justify-center flex-wrap mb-12"
          role="tablist"
          aria-label="Módulos de la plataforma"
        >
          {MODULOS.map((mod, i) => (
            <button
              key={mod.label}
              role="tab"
              aria-selected={active === i}
              aria-controls={`tabpanel-${i}`}
              id={`tab-${i}`}
              onClick={() => setActive(i)}
              className={`flex items-center gap-[7px] py-[9px] px-[18px] rounded-[10px] text-[13px] font-semibold cursor-pointer border-[1.5px] transition-colors ${
                active === i
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted"
              }`}
            >
              {mod.icon} {mod.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          key={active}
          role="tabpanel"
          id={`tabpanel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="tab-content-grid grid grid-cols-2 gap-16 items-center"
        >
          <div className="rounded-[20px] overflow-hidden h-[380px] bg-border shadow-[0_20px_60px_rgba(0,0,0,0.11)]">
            <img
              src={m.img}
              alt={m.imgAlt}
              loading="lazy"
              width="800"
              height="560"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 rounded-lg py-[5px] px-[14px] mb-5 text-accent">
              {m.icon}
              <span className="text-[11px] font-bold font-semibold text-[13px]">{m.label}</span>
            </div>
            <h3 className="font-['Gloock',Georgia,serif] text-[clamp(22px,2.8vw,34px)] text-text leading-[1.2] m-0 mb-4 font-normal">
              {m.headline}
            </h3>
            <p className="text-[15px] text-muted leading-[1.75] m-0 mb-7">{m.body}</p>
            <div className="flex flex-col gap-3 mb-8">
              {m.points.map((p) => (
                <div key={p} className="flex gap-2.5 items-start text-[14px] text-text">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-[1px]">
                    <IconCheck className="w-[11px] h-[11px] text-accent" />
                  </div>
                  {p}
                </div>
              ))}
            </div>
            <Link
              to={m.path}
              viewTransition
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-[14px] py-[12px] px-[24px] rounded-[10px] no-underline transition-colors hover:bg-accent"
            >
              Ir a {m.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-slate-50 py-[100px] px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-[440px] mx-auto mb-[72px]">
          <p className="text-[13px] font-semibold text-primary mb-3">Así funciona</p>
          <h2 className="font-['Gloock',Georgia,serif] text-[clamp(28px,3.5vw,42px)] text-text leading-[1.2] m-0 font-normal">
            En 4 pasos ya formas parte
          </h2>
        </div>

        {/* Steps with CSS connector line */}
        <div className="relative">
          {/* Connector */}
          <div className="steps-line absolute top-[36px] left-[12.5%] right-[12.5%] h-[2px] z-0 bg-linear-to-r from-transparent via-primary to-transparent" />

          <div className="steps-grid grid grid-cols-4 gap-2">
            {PASOS.map((p, i) => (
              <div key={p.titulo} className="text-center px-4 relative z-10">
                <div
                  className={`w-[72px] h-[72px] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_4px_20px_rgba(13,148,136,0.14)] border-[3px] ${
                    i === 0 ? "bg-primary border-primary" : "bg-white border-teal-100"
                  }`}
                >
                  <span
                    className={`font-['Gloock',Georgia,serif] text-[24px] font-normal ${
                      i === 0 ? "text-white" : "text-primary"
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>
                <h4 className="font-['Gloock',Georgia,serif] text-[17px] text-text m-0 mb-[10px] font-normal">
                  {p.titulo}
                </h4>
                <p className="text-[13px] text-muted leading-[1.65] m-0">{p.desc}</p>
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
    imgAlt: "Dashboard financiero con desglose de pagos transparente",
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
    imgAlt: "Piscina del condominio lista para ser reservada por los residentes",
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
  const s1 = FEATURE_SECTIONS[0];
  const s2 = FEATURE_SECTIONS[1];

  return (
    <section className="bg-white py-[100px] px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-[120px]">
        {/* Feature 1: Texto descriptivo superior y gráfica full-width (Rompe simetría de plantilla) */}
        <div className="flex flex-col gap-10">
          <div className="max-w-[640px]">
            <p className="text-[13px] font-semibold text-primary mb-[14px]">{s1.label}</p>
            <h2 className="font-['Gloock',Georgia,serif] text-[clamp(24px,3vw,38px)] text-text leading-[1.2] m-0 mb-4 font-normal">
              {s1.headline}
            </h2>
            <p className="text-[15px] text-muted leading-[1.75] m-0 mb-7">{s1.body}</p>

            <div className="relative pt-6 mb-8">
              <span className="absolute top-0 left-0 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Datos simulados
              </span>
              <div className="flex gap-9">
                {s1.stats.map((st) => (
                  <div key={st.sub}>
                    <div className="font-['Gloock',Georgia,serif] text-[32px] text-primary">
                      {st.val}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5">{st.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={s1.cta.path}
              viewTransition
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold text-[14px] py-[11px] px-[22px] rounded-[10px] no-underline transition-colors hover:bg-primary hover:text-white"
            >
              {s1.cta.label}
            </Link>
          </div>
          <div className="rounded-[20px] overflow-hidden h-[360px] bg-border shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
            <img
              src={s1.img}
              alt={s1.imgAlt}
              loading="lazy"
              width="800"
              height="560"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Feature 2: Side-by-side asimétrico */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div className="rounded-[20px] overflow-hidden h-[460px] bg-border shadow-[0_20px_60px_rgba(0,0,0,0.1)] order-2 md:order-1">
            <img
              src={s2.img}
              alt={s2.imgAlt}
              loading="lazy"
              width="800"
              height="560"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-[13px] font-semibold text-primary mb-[14px]">{s2.label}</p>
            <h2 className="font-['Gloock',Georgia,serif] text-[clamp(24px,3vw,38px)] text-text leading-[1.2] m-0 mb-4 font-normal">
              {s2.headline}
            </h2>
            <p className="text-[15px] text-muted leading-[1.75] m-0 mb-7">{s2.body}</p>

            <div className="relative pt-6 mb-8">
              <span className="absolute top-0 left-0 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Datos simulados
              </span>
              <div className="flex gap-9">
                {s2.stats.map((st) => (
                  <div key={st.sub}>
                    <div className="font-['Gloock',Georgia,serif] text-[32px] text-primary">
                      {st.val}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5">{st.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={s2.cta.path}
              viewTransition
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold text-[14px] py-[11px] px-[22px] rounded-[10px] no-underline transition-colors hover:bg-primary hover:text-white"
            >
              {s2.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-accent py-[88px] px-6 text-center">
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
            viewTransition
            className="bg-white text-accent font-bold text-[15px] py-[14px] px-8 rounded-[10px] no-underline transition-[box-shadow,transform] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
          >
            Comenzar como residente
          </Link>
          <Link
            to="/precios"
            viewTransition
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
      <ModuleTabs />
      <HowItWorks />
      <FeatureSections />
      <FinalCTA />
    </div>
  );
}
