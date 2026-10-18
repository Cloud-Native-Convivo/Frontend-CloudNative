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

// Clases completas (no interpoladas) para que Tailwind las detecte al escanear.
const ROLE_BG: Record<Role, string> = {
  residente: "bg-primary",
  conserje: "bg-blue-500",
  admin: "bg-violet-600",
  comite: "bg-amber-600",
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
  user: User | null;
  onLogout: () => void;
}

function UserAvatar({ user }: { user: User }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.nombre}
        className="w-[32px] h-[32px] rounded-full object-cover border border-border"
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <div
      className="w-[32px] h-[32px] rounded-full bg-border text-muted flex items-center justify-center font-bold text-[12px]"
      title={user.nombre}
    >
      {user.nombre.charAt(0).toUpperCase()}
    </div>
  );
}

function MobileMenuDropdown({
  isOpen,
  navLinks,
  role,
  onClose,
}: {
  isOpen: boolean;
  navLinks: NavHeaderProps["navLinks"];
  role: Role | null;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div
      id="mobile-navigation"
      role="region"
      aria-label="Navegación móvil"
      className="absolute top-full inset-x-0 bg-white border-b border-border px-4 pt-2 pb-4 z-[49]"
    >
      {navLinks.map((l) => (
        <NavLink
          key={l.path}
          to={l.path}
          viewTransition
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-[10px] py-[11px] px-[8px] text-[14px] font-medium no-underline border-b border-slate-100 ${
              isActive ? "text-primary" : "text-text"
            }`
          }
        >
          {l.icon} {l.label}
        </NavLink>
      ))}
      {role && (
        <div className="mt-3 px-2 flex items-center justify-between">
          <span className="text-[12px] text-muted">Rol:</span>
          <span
            className={`text-[11px] font-bold text-white px-[8px] py-[2px] rounded-[6px] ${ROLE_BG[role]}`}
          >
            {ROLE_LABELS[role]}
          </span>
        </div>
      )}
    </div>
  );
}

export function NavHeader({
  ribbonH,
  navH,
  navLinks,
  role,
  user,
  onLogout,
}: NavHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const solid = !isHome || scrolled;

  return (
    <nav
      className={`fixed inset-x-0 z-50 flex items-center backdrop-blur-[14px] border-b transition-[background-color,border-color] duration-300 ${
        solid ? "bg-white/97 border-border" : "bg-transparent border-transparent"
      }`}
      style={{ top: ribbonH, height: navH }}
    >
      <div className="max-w-[1280px] mx-auto px-6 w-full flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" viewTransition className="flex items-center gap-[10px] no-underline">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-primary flex items-center justify-center">
            <IconHome className="text-white w-[17px] h-[17px]" />
          </div>
          <div>
            <div className="font-['Gloock',Georgia,serif] text-[19px] text-text leading-tight">
              Convivo
            </div>
            <div className="text-[9px] text-slate-400 tracking-wide font-semibold">
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
              viewTransition
              className={({ isActive }) =>
                `flex items-center gap-[5px] text-[13px] font-medium no-underline px-[11px] py-[6px] rounded-[7px] transition-colors duration-150 ${
                  isActive ? "text-primary bg-teal-50" : "text-muted bg-transparent hover:text-text"
                }`
              }
            >
              {l.icon} {l.label}
            </NavLink>
          ))}
          <div className="w-[1px] h-[20px] bg-border mx-[6px]" />

          {/* Avatar del usuario */}
          {user && <UserAvatar user={user} />}

          {/* Badge del rol (informativo, sin switcher) */}
          {role && (
            <span
              role="status"
              aria-label={`Rol activo: ${ROLE_LABELS[role]}`}
              className={`text-[11px] font-bold text-white px-[8px] py-[3px] rounded-[6px] ${ROLE_BG[role]}`}
            >
              {ROLE_LABELS[role]}
            </span>
          )}

          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-[5px] text-[12px] font-semibold text-muted bg-transparent px-[12px] py-[7px] rounded-[7px] border border-border cursor-pointer transition-colors duration-200 hover:text-text hover:border-slate-300"
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
              viewTransition
              className="flex items-center gap-[5px] text-[12px] font-semibold text-muted bg-transparent px-[12px] py-[7px] rounded-[7px] no-underline border border-border transition-colors duration-200 hover:text-text hover:border-slate-300"
              data-cuelume-press="whisper"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="nav-burger bg-transparent border-none cursor-pointer p-1 text-text hidden"
          aria-label={mobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-haspopup="true"
        >
          {mobileOpen ? (
            <IconX className="w-[22px] h-[22px]" />
          ) : (
            <IconMenu className="w-[22px] h-[22px]" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <MobileMenuDropdown
        isOpen={mobileOpen}
        navLinks={navLinks}
        role={role}
        onClose={() => setMobileOpen(false)}
      />
    </nav>
  );
}
