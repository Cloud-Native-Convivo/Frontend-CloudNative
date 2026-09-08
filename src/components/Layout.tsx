/* eslint-disable react/forbid-dom-props */
import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router";
import {
  IconHome,
  IconDollar,
  IconMessage,
  IconCamera,
  IconShield,
  IconCalendar,
  IconMenu,
  IconX,
  IconTrendingUp,
  IconPhone,
  IconAlertTriangle,
} from "./icons/Icons";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const RIBBON_ITEMS = [
  {
    text: "📢 Asamblea de copropietarios — 22 agosto, 19:00 hrs · Sala de Juegos",
    path: "/tablon",
  },
  {
    text: "💧 Corte de agua programado Torres A y B — 25 agosto 09:00 hrs",
    path: "/tablon",
  },
  {
    text: "🎟️ Rifa solidaria — Bazar Comunidad · Boletos en conserjería",
    path: "/tablon",
  },
  {
    text: "📸 Nuevo registro fotográfico: renovación jardín central",
    path: "/registro",
  },
];

const NAV_LINKS_BY_ROLE: Record<
  Role,
  {
    label: string;
    path: string;
    icon: React.ReactElement;
  }[]
> = {
  residente: [
    {
      label: "Mi panel",
      path: "/mi-dashboard",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
  conserje: [
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <IconTrendingUp className="w-[15px] h-[15px]" />,
    },
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
  comite: [
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
};

const FLOATING_SIDEBAR_ITEMS = [
  {
    id: "reservar",
    icon: <IconCalendar className="w-[17px] h-[17px]" />,
    label: "Reservar",
    path: "/reservas",
    bg: "#0D9488",
  },
  {
    id: "gastos",
    icon: <IconDollar className="w-[17px] h-[17px]" />,
    label: "Mis gastos",
    path: "/gastos",
    bg: "#005047",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AnnouncementRibbon — declared before Layout to avoid hoisting issues
// ─────────────────────────────────────────────────────────────────────────────

function AnnouncementRibbon({ onDismiss }: { onDismiss: () => void }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotate = () => {
    setFading(true);
    fadeTimerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % RIBBON_ITEMS.length);
      setFading(false);
    }, 250);
  };

  useEffect(() => {
    if (RIBBON_ITEMS.length < 2) return;
    timerRef.current = setInterval(rotate, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const item = RIBBON_ITEMS[idx];

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[32px] bg-[#005047] flex items-center">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center gap-[12px] w-full">
        {/* Label badge */}
        <div className="shrink-0 bg-[#0D9488] rounded-[3px] px-2 py-[1px] flex items-center gap-[5px]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#4ADE80] inline-block" />
          <span className="text-[10px] font-bold text-white tracking-[0.08em] uppercase">
            Tablón
          </span>
        </div>

        {/* Rotating text */}
        <Link
          to={item.path}
          className="flex-1 text-[12px] text-white/90 no-underline overflow-hidden whitespace-nowrap text-ellipsis transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {item.text}
        </Link>

        {/* Dot indicators */}
        <div className="flex gap-[4px] shrink-0 ribbon-dots">
          {RIBBON_ITEMS.map((item, i) => (
            <button
              key={item.text}
              aria-label={`Ver aviso ${i + 1} de ${RIBBON_ITEMS.length}`}
              onClick={() => {
                setIdx(i);
                setFading(false);
              }}
              className="h-[5px] rounded-[3px] border-none cursor-pointer p-0 transition-all duration-300"
              style={{
                width: i === idx ? 14 : 5,
                background: i === idx ? "#5EEAD4" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          aria-label="Cerrar aviso"
          className="shrink-0 bg-transparent border-none cursor-pointer text-white/60 hover:text-white px-1 py-0.5 leading-none text-[14px] transition-colors duration-150"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FloatingSidebar — declared before Layout
// ─────────────────────────────────────────────────────────────────────────────

function FloatingSidebar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const items = FLOATING_SIDEBAR_ITEMS;

  return (
    <div className="float-sidebar fixed right-0 top-1/2 -translate-y-1/2 z-[45] flex flex-col gap-[6px]">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          className="flex items-center justify-end no-underline"
        >
          {/* Expanding label */}
          <div
            className="flex items-center h-[40px] overflow-hidden whitespace-nowrap rounded-l-[6px] transition-all duration-[220ms] ease-out"
            style={{
              background: item.bg,
              maxWidth: hovered === item.id ? 120 : 0,
              paddingLeft: hovered === item.id ? 12 : 0,
              opacity: hovered === item.id ? 1 : 0,
            }}
          >
            <span className="text-[12px] font-bold text-white">{item.label}</span>
          </div>

          {/* Icon button */}
          <div
            className="w-[40px] h-[40px] shrink-0 flex items-center justify-center text-white shadow-[0_2px_12px_rgba(0,0,0,0.22)] transition-[border-radius] duration-[220ms] ease-out"
            style={{
              background: item.bg,
              borderRadius: hovered === item.id ? "0 6px 6px 0" : "6px 0 0 6px",
            }}
          >
            {item.icon}
          </div>
        </Link>
      ))}

      {/* Scroll-to-top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-[40px] h-[40px] rounded-l-[6px] bg-white border border-[#E2E8F0] border-r-0 flex items-center justify-center cursor-pointer text-[#64748B] shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors duration-150 hover:bg-[#F0FDFA]"
        title="Ir arriba"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[14px] h-[14px]"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<Role, string> = {
  residente: "Residente",
  conserje: "Conserje",
  admin: "Admin",
  comite: "Comité",
};
const ROLE_COLORS: Record<Role, string> = {
  residente: "#0D9488",
  conserje: "#3B82F6",
  admin: "#7C3AED",
  comite: "#D97706",
};

export default function Layout() {
  const { role, setRole, user } = useAuth();
  const [ribbonVisible, setRibbonVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
  }

  const navLinks = NAV_LINKS_BY_ROLE[role];

  const RIBBON_H = ribbonVisible ? 32 : 0;
  const NAV_H = 64;
  const TOP_OFFSET = RIBBON_H + NAV_H;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const navBg = isHome
    ? scrolled
      ? "rgba(255,255,255,0.96)"
      : "transparent"
    : "rgba(255,255,255,0.97)";
  const navBorder = (isHome ? scrolled : true) ? "1px solid #E2E8F0" : "1px solid transparent";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ribbon */}
      {ribbonVisible && <AnnouncementRibbon onDismiss={() => setRibbonVisible(false)} />}

      {/* Nav */}
      <nav
        className="fixed inset-x-0 z-50 flex items-center backdrop-blur-[14px] transition-all duration-300"
        style={{
          top: RIBBON_H,
          height: NAV_H,
          background: navBg,
          borderBottom: navBorder,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 w-full flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-[10px] no-underline">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#0D9488] to-[#005047] flex items-center justify-center">
              <IconHome className="text-white w-[17px] h-[17px]" />
            </div>
            <div>
              <div className="font-['Gloock',Georgia,serif] text-[19px] text-[#00201B] leading-tight">
                Convivo
              </div>
              <div className="text-[9px] text-[#94A3B8] tracking-[0.12em] uppercase font-semibold">
                Gestión Simple
              </div>
            </div>
          </NavLink>

          {/* Desktop links */}
          <div className="nav-desktop flex items-center gap-[2px]">
            {navLinks.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                className={({ isActive }) =>
                  `flex items-center gap-[5px] text-[13px] font-medium no-underline px-[11px] py-[6px] rounded-[7px] transition-all duration-150 ${
                    isActive
                      ? "text-[#0D9488] bg-[#F0FDFA]"
                      : "text-[#64748B] bg-transparent hover:text-[#00201B]"
                  }`
                }
              >
                {l.icon} {l.label}
              </NavLink>
            ))}
            <div className="w-[1px] h-[20px] bg-[#E2E8F0] mx-[6px]" />

            {/* Avatar del usuario */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.nombre}
                className="w-[32px] h-[32px] rounded-full object-cover border border-[#E2E8F0]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-[32px] h-[32px] rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold text-[12px]"
                title={user.nombre}
              >
                {user.nombre.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Role switcher (demo) */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen((o) => !o)}
                className="flex items-center gap-[6px] text-[12px] font-bold text-white px-[12px] py-[7px] rounded-[7px] border-none cursor-pointer transition-opacity duration-150 hover:opacity-85"
                style={{ background: ROLE_COLORS[role] }}
                title="Cambiar rol (demo)"
              >
                <span className="text-[10px] opacity-75 font-semibold">ROL:</span>
                {ROLE_LABELS[role]}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-[10px] h-[10px] opacity-70"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {roleSwitcherOpen && (
                <div className="absolute top-[calc(100%+6px)] right-0 bg-white border border-[#E2E8F0] rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-1 z-[100] min-w-[160px]">
                  <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] px-[12px] pt-[6px] pb-[4px]">
                    Demo · Cambiar rol
                  </div>
                  {(["residente", "conserje", "admin", "comite"] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleSwitcherOpen(false);
                      }}
                      className="flex items-center gap-[8px] w-full px-[12px] py-[8px] border-none cursor-pointer rounded-[7px] text-[13px] transition-colors duration-150 hover:bg-[#F8FAFB]"
                      style={{
                        background: r === role ? "#F0FDFA" : "transparent",
                        fontWeight: r === role ? 700 : 500,
                        color: r === role ? ROLE_COLORS[r] : "#00201B",
                      }}
                    >
                      <span
                        className="w-[8px] h-[8px] rounded-full shrink-0"
                        style={{ background: ROLE_COLORS[r] }}
                      />
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
                  <div className="border-t border-[#F1F5F9] my-1 px-[12px] pt-[4px] pb-[6px]">
                    <p className="text-[11px] text-[#94A3B8] leading-[1.4] m-0">
                      {user.nombre}
                      <br />
                      {user.unidad}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="flex items-center gap-[5px] text-[12px] font-semibold text-[#64748B] bg-transparent px-[12px] py-[7px] rounded-[7px] no-underline border border-[#E2E8F0] transition-colors duration-200 hover:text-[#00201B] hover:border-[#CBD5E1]"
              data-cuelume-press="whisper"
              aria-label="Cerrar sesión"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[13px] h-[13px]"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Salir
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="nav-burger bg-transparent border-none cursor-pointer p-1 text-[#00201B] hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <IconX className="w-[22px] h-[22px]" />
            ) : (
              <IconMenu className="w-[22px] h-[22px]" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="absolute top-full inset-x-0 bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 z-[49]">
            {navLinks.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                className={({ isActive }) =>
                  `flex items-center gap-[10px] py-[11px] px-[8px] text-[14px] font-medium no-underline border-b border-[#F1F5F9] ${
                    isActive ? "text-[#0D9488]" : "text-[#00201B]"
                  }`
                }
              >
                {l.icon} {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              {(["residente", "conserje", "admin", "comite"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setMobileOpen(false);
                  }}
                  className="flex-1 py-2 px-1 text-[12px] font-bold rounded-lg border-none cursor-pointer"
                  style={{
                    background: r === role ? ROLE_COLORS[r] : "#F1F5F9",
                    color: r === role ? "#fff" : "#64748B",
                  }}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1" style={{ paddingTop: isHome ? 0 : TOP_OFFSET }}>
        <Outlet />
      </main>

      {/* Floating sidebar */}
      <FloatingSidebar />

      {/* Footer */}
      <footer className="bg-[#00201B] text-white/55 pt-[52px] pb-[28px] px-[24px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="footer-grid grid grid-cols-[2fr_1fr_1fr_1fr] gap-[40px] mb-[40px]">
            <div>
              <div className="flex items-center gap-[10px] mb-[16px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#0D9488] flex items-center justify-center">
                  <IconHome className="text-white w-[16px] h-[16px]" />
                </div>
                <span className="font-['Gloock',Georgia,serif] text-[18px] text-white">
                  Convivo
                </span>
              </div>
              <p className="text-[13px] leading-[1.7] max-w-[260px] m-0 mb-[16px] text-white/50">
                Plataforma digital para la gestión de condominios en Chile. Tranquilidad, comunidad
                y confianza.
              </p>
              <div className="flex gap-[16px]">
                {["Privacidad", "Términos", "Contacto"].map((l) => (
                  <span
                    key={l}
                    className="text-[12px] text-white/35 cursor-pointer transition-colors duration-150 hover:text-[#5EEAD4]"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
            {[
              {
                title: "Plataforma",
                links: [
                  "Reservas",
                  "Gastos comunes",
                  "Tablón de avisos",
                  "Dashboard",
                  "Registro fotográfico",
                ],
              },
              {
                title: "Empresa",
                links: ["Precios", "Sobre Convivo", "Blog", "Prensa"],
              },
              {
                title: "Emergencias",
                links: ["Carabineros 133", "Bomberos 132", "SAMU 131", "Conserjería Interno 100"],
              },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-[11px] font-bold text-[#5EEAD4] tracking-[0.1em] uppercase mb-[16px]">
                  {col.title}
                </div>
                {col.links.map((l) => (
                  <div
                    key={l}
                    className="text-[13px] text-white/45 mb-[10px] cursor-pointer transition-colors duration-150 hover:text-white"
                  >
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-[20px] flex justify-between flex-wrap gap-[8px]">
            <p className="text-[12px] m-0">© 2026 Convivo SpA. Todos los derechos reservados.</p>
            <p className="text-[12px] m-0">Hecho con ♥ para condominios chilenos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
