/* eslint-disable react/forbid-dom-props */
import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router";
import { IconHome, IconMenu, IconX } from "../icons/Icons";
import type { Role, User } from "../../types";

const ROLE_LABELS: Record<Role, string> = {
  residente: "Residente",
  conserje: "Conserje",
  admin: "Administrador",
  comite: "Comité",
};

const ROLE_COLORS: Record<Role, string> = {
  residente: "#0D9488",
  conserje: "#3B82F6",
  admin: "#7C3AED",
  comite: "#D97706",
};

interface NavHeaderProps {
  ribbonH: number;
  navH: number;
  navLinks: {
    label: string;
    path: string;
    icon: React.ReactElement;
  }[];
  role: Role | null;
  setRole: (r: Role) => void;
  user: User | null;
  onLogout: () => void;
}

// Roles elegibles desde el switcher demo (sin login). "residente" queda
// afuera a propósito: tiene login real por Cognito (cognitoAuth.ts) y no
// debe poder simularse sin loguearse de verdad.
const DEMO_ROLES: Role[] = ["conserje", "admin", "comite"];

export function NavHeader({ ribbonH, navH, navLinks, role, setRole, user, onLogout }: NavHeaderProps) {
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navBg = isHome
    ? scrolled
      ? "rgba(255,255,255,0.96)"
      : "transparent"
    : "rgba(255,255,255,0.97)";
  const navBorder = (isHome ? scrolled : true) ? "1px solid #E2E8F0" : "1px solid transparent";

  return (
    <nav
      className="fixed inset-x-0 z-50 flex items-center backdrop-blur-[14px] transition-[background-color,border-color] duration-300"
      style={{
        top: ribbonH,
        height: navH,
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
                `flex items-center gap-[5px] text-[13px] font-medium no-underline px-[11px] py-[6px] rounded-[7px] transition-colors duration-150 ${
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

          {/* Avatar del usuario (solo si hay sesión/rol demo activo) */}
          {user &&
            (user.avatar ? (
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
            ))}

          {/* Role switcher (demo) */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen((o) => !o)}
              className="flex items-center gap-[6px] text-[12px] font-bold text-white px-[12px] py-[7px] rounded-[7px] border-none cursor-pointer transition-opacity duration-150 hover:opacity-85"
              style={{ background: role ? ROLE_COLORS[role] : "#64748B" }}
              title="Cambiar rol (demo)"
            >
              <span className="text-[10px] opacity-75 font-semibold">ROL:</span>
              {role ? ROLE_LABELS[role] : "Elegir"}
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
                {DEMO_ROLES.map((r) => (
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
                {user && (
                  <div className="border-t border-[#F1F5F9] my-1 px-[12px] pt-[4px] pb-[6px]">
                    <p className="text-[11px] text-[#94A3B8] leading-[1.4] m-0">
                      {user.nombre}
                      <br />
                      {user.unidad}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-[5px] text-[12px] font-semibold text-[#64748B] bg-transparent px-[12px] py-[7px] rounded-[7px] border border-[#E2E8F0] cursor-pointer transition-colors duration-200 hover:text-[#00201B] hover:border-[#CBD5E1]"
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
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-[5px] text-[12px] font-semibold text-[#64748B] bg-transparent px-[12px] py-[7px] rounded-[7px] no-underline border border-[#E2E8F0] transition-colors duration-200 hover:text-[#00201B] hover:border-[#CBD5E1]"
              data-cuelume-press="whisper"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="nav-burger bg-transparent border-none cursor-pointer p-1 text-[#00201B] hidden"
          aria-label={mobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
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
            {DEMO_ROLES.map((r) => (
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
  );
}
