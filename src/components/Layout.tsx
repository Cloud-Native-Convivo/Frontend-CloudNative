/* eslint-disable react/forbid-dom-props */
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { IconHome, IconDollar, IconCalendar, IconTrendingUp } from "./icons/Icons";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";
import { NavHeader } from "./layout/NavHeader";
import { FloatingSidebar } from "./layout/FloatingSidebar";
import { Footer } from "./layout/Footer";

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

export default function Layout() {
  const { role, user, setUser } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = role ? NAV_LINKS_BY_ROLE[role] : [];
  const NAV_H = 64;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Accesibilidad: Enlace para saltar navegación */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-white focus:text-primary focus:p-4 focus:font-bold"
      >
        Saltar al contenido principal
      </a>

      {/* Nav */}
      <NavHeader
        navH={NAV_H}
        navLinks={navLinks}
        role={role}
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Page content */}
      <main id="main-content" className="flex-1" style={{ paddingTop: isHome ? 0 : NAV_H }}>
        <Outlet />
      </main>

      {/* Floating sidebar — solo para usuarios autenticados */}
      {user && <FloatingSidebar />}

      {/* Footer */}
      <Footer />
    </div>
  );
}
