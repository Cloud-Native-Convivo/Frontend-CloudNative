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

const ROLE_TEXT: Record<Role, string> = {
  residente: "text-primary",
  conserje: "text-blue-500",
  admin: "text-violet-600",
  comite: "text-amber-600",
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

function RoleSwitcherDropdown({
  role,
  setRole,
  user,
  isOpen,
  onToggle,
  onClose,
}: {
  role: Role | null;
  setRole: (r: Role) => void;
  user: User | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-[6px] text-[12px] font-bold text-white px-[12px] py-[7px] rounded-[7px] border-none cursor-pointer transition-opacity duration-150 hover:opacity-85 ${role ? ROLE_BG[role] : "bg-muted"}`}
        title="Cambiar rol (demo)"
        aria-expanded={isOpen}
        aria-haspopup="menu"
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
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] right-0 bg-white border border-border rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-1 z-[100] min-w-[160px]">
          <div className="text-[10px] font-bold text-slate-400 tracking-wide px-[12px] pt-[6px] pb-[4px]">
            Demo · Cambiar rol
          </div>
          {DEMO_ROLES.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                onClose();
              }}
              className={`flex items-center gap-[8px] w-full px-[12px] py-[8px] border-none cursor-pointer rounded-[7px] text-[13px] transition-colors duration-150 hover:bg-slate-50 ${
                r === role
                  ? `bg-teal-50 font-bold ${ROLE_TEXT[r]}`
                  : "bg-transparent font-medium text-text"
              }`}
            >
              <span className={`w-[8px] h-[8px] rounded-full shrink-0 ${ROLE_BG[r]}`} />
              {ROLE_LABELS[r]}
            </button>
          ))}
          {user && (
            <div className="border-t border-slate-100 my-1 px-[12px] pt-[4px] pb-[6px]">
              <p className="text-[11px] text-slate-400 leading-[1.4] m-0">
                {user.nombre}
                <br />
                {user.unidad}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MobileMenuDropdown({
  isOpen,
  navLinks,
  role,
  setRole,
  onClose,
}: {
  isOpen: boolean;
  navLinks: NavHeaderProps["navLinks"];
  role: Role | null;
  setRole: (r: Role) => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full inset-x-0 bg-white border-b border-border px-4 pt-2 pb-4 z-[49]">
      {navLinks.map((l) => (
        <NavLink
          key={l.path}
          to={l.path}
          viewTransition
          className={({ isActive }) =>
            `flex items-center gap-[10px] py-[11px] px-[8px] text-[14px] font-medium no-underline border-b border-slate-100 ${
              isActive ? "text-primary" : "text-text"
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
              onClose();
            }}
            className={`flex-1 py-2 px-1 text-[12px] font-bold rounded-lg border-none cursor-pointer ${
              r === role ? `${ROLE_BG[r]} text-white` : "bg-slate-100 text-muted"
            }`}
          >
            {ROLE_LABELS[r]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NavHeader({
  ribbonH,
  navH,
  navLinks,
  role,
  setRole,
  user,
  onLogout,
}: NavHeaderProps) {
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

          {/* Role switcher (demo) */}
          <RoleSwitcherDropdown
            role={role}
            setRole={setRole}
            user={user}
            isOpen={roleSwitcherOpen}
            onToggle={() => setRoleSwitcherOpen((o) => !o)}
            onClose={() => setRoleSwitcherOpen(false)}
          />

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
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-haspopup="menu"
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
        setRole={setRole}
        onClose={() => setMobileOpen(false)}
      />
    </nav>
  );
}
